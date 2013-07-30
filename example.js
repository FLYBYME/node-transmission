var Transmission = require('./')

var transmission = new Transmission({
	port : 9091,
	host : '127.0.0.1'
})

function getTorrent(id) {
	transmission.get(id, function(err, result) {
		if (err) {
			throw err
		}
		console.log('bt.get returned ' + result.torrents.length + ' torrents')
		result.torrents.forEach(function(torrent) {
			console.log('hashString', torrent.hashString)
		})
		removeTorrent(id)
	})
}

function removeTorrent(id) {
	transmission.remove(id, function(err) {
		if (err) {
			throw err
		}
		console.log('torrent was removed')
	})
}

transmission.add('http://cdimage.debian.org/debian-cd/7.1.0/i386/bt-cd/debian-7.1.0-i386-netinst.iso.torrent', {
	"download-dir" : "/home/torrents"
}, function(err, result) {
	if (err) {
		return console.log(err)
	}
	var id = result.id
	console.log('Just added a new torrent.')
	console.log('Torrent ID: ' + id)
	getTorrent(id)
})