var Transmission = require('./');
var ProgressBar = require('progress');

var transmission = new Transmission({
	port : 9091,
	host : '127.0.0.1'
});

function get(hash, cb) {
	transmission.get(hash, function(err, result) {
		if (err) {
			throw err;
		}
		cb(null, result.torrents[0]);
	});
}

function watch(hash) {
	get(hash, function(err, torrent) {
		if (err) {
			throw err;
		}

		var downloadedEver = 0;
		var WatchBar = new ProgressBar('  downloading [:bar] :percent :etas', {
			complete : '=',
			incomplete : ' ',
			width : 35,
			total : torrent.sizeWhenDone
		});

		function tick(err, torrent) {
			if (err) {
				throw err;
			}
			var downloaded = torrent.downloadedEver - downloadedEver;
			downloadedEver = torrent.downloadedEver;
			WatchBar.tick(downloaded);

			if (torrent.sizeWhenDone === torrent.downloadedEver) {
				return remove(hash);
			}
			setTimeout(function() {
				get(hash, tick);
			}, 1000);
		}

		get(hash, tick);
	});
}

function remove(hash) {
	transmission.remove(hash, function(err) {
		if (err) {
			throw err;
		}
		console.log('torrent was removed');
	});
}

var sample = 'http://releases.ubuntu.com/14.04.1/ubuntu-14.04.1-desktop-amd64.iso.torrent';

transmission.addUrl(sample, {
	//options
}, function(err, result) {
	if (err) {
		return console.log(err)
	}
	var hash = result.hashString;
	watch(hash);
});
