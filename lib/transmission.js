//node utils
var http = require('http');
var util = require('util');
var path = require('path');
var fs = require('fs');
var url = require('url');
var events = require('events')

var keyGen = require('./utils').keyGen;

var Transmission = module.exports = function(port, host) {

	events.EventEmitter.call(this);
	this.url = '/transmission/rpc';
	this.host = host;
	this.port = port;
	this.key = '';
	this.isPolling = false;
	this.conActive = false;
	this.timer;

};
// So will act like an event emitter
util.inherits(Transmission, events.EventEmitter);

Transmission.prototype.start = function() {
	if(!this.poll) {
		this.poll = true;
		this.update()
	}
};
Transmission.prototype.stop = function() {
	if(this.poll) {
		this.poll = false;
	}
};
Transmission.prototype.addTorrent = function(path) {
	this.callServer({
		arguments : {
			filename : path
		},
		method : this.methods.torrents.add,
		tag : keyGen()
	}, function(result) {

	})
}
Transmission.prototype.callServer = function(query, callBack) {
	var self = this;

	var httpClient = http.createClient(this.port, this.host);
	this.conActive = true;
	var request = httpClient.request('POST', this.url, {

		'Time' : new Date(),
		'Host' : this.host + ':' + this.port,
		'X-Requested-With' : 'Node',
		'X-Transmission-Session-Id' : this.key

	});

	request.end(JSON.stringify(query), 'utf8');

	var self = this;
	request.on('response', function(response) {

		var page = [];

		response.setEncoding('utf8');

		response.on('data', function(chunk) {
			page.push(chunk);

		});
		response.on('end', function() {

			if(response.statusCode == 409) {
				self.key = response.headers['x-transmission-session-id'];
				return self.callServer(query, callBack);
			}
			if(response.statusCode == 200) {
				callBack(JSON.parse(unescape(page.join(''))));
			}
			if(self.poll) {
				setTimeout(function() {
					self.update()
				}, 35000)
			}
		});
	});
};
Transmission.prototype.update = function() {
	var self = this;
	self.callServer({
		arguments : {
			fields : ['activityDate', 'addedDate', 'bandwidthPriority', 'comment', 'corruptEver', 'creator', 'dateCreated', 'desiredAvailable', 'doneDate', 'downloadDir', 'downloadedEver', 'downloadLimit', 'downloadLimited', 'error', 'errorString', 'eta', 'files', 'fileStats', 'hashString', 'haveUnchecked', 'haveValid', 'honorsSessionLimits', 'id', 'isFinished', 'isPrivate', 'leftUntilDone', 'magnetLink', 'manualAnnounceTime', 'maxConnectedPeers', 'metadataPercentComplete', 'name', 'peer-limit', 'peers', 'peersConnected', 'peersFrom', 'peersGettingFromUs', 'peersKnown', 'peersSendingToUs', 'percentDone', 'pieces', 'pieceCount', 'pieceSize', 'priorities', 'rateDownload', 'rateUpload', 'recheckProgress', 'seedIdleLimit', 'seedIdleMode', 'seedRatioLimit', 'seedRatioMode', 'sizeWhenDone', 'startDate', 'status', 'trackers', 'trackerStats ', 'totalSize', 'torrentFile', 'uploadedEver', 'uploadLimit', 'uploadLimited', 'uploadRatio', 'wanted', 'webseeds', 'webseedsSendingToUs']
		},
		ids : '',
		method : 'torrent-get',
		tag : keyGen()
	}, function(result) {
		self.torrents = result.arguments.torrents;
		self.emit('update', self.torrents)
	})
}
Transmission.prototype.methods = {
	torrents : {
		stop : 'torrent-stop',
		start : 'torrent-start',
		verify : 'torrent-verify',
		reannounce : 'torrent-reannounce',
		stop : 'torrent-start',
		set : 'torrent-set',
		setTypes : {
			'bandwidthPriority' : true,
			'downloadLimit' : true,
			'downloadLimited' : true,
			'files-wanted' : true,
			'files-unwanted' : true,
			'honorsSessionLimits' : true,
			'ids' : true,
			'location' : true,
			'peer-limit' : true,
			'priority-high' : true,
			'priority-low' : true,
			'priority-normal' : true,
			'seedRatioLimit' : true,
			'seedRatioMode' : true,
			'uploadLimit' : true,
			'uploadLimited' : true
		},
		add : 'torrent-add',
		addTypes : {
			'download-dir' : true,
			'filename' : true,
			'metainfo' : true,
			'paused' : true,
			'peer-limit' : true,
			'files-wanted' : true,
			'files-unwanted' : true,
			'priority-high' : true,
			'priority-low' : true,
			'priority-normal' : true
		},
		remove : 'torrent-remove',
		removeTypes : {
			'ids' : true,
			'delete-local-data' : true
		},
		location : 'torrent-set-location',
		locationTypes : {
			'location' : true,
			'ids' : true,
			'move' : true
		},
		get : 'torrent-get'
	},
	session : {
		stats : 'session-stats',
		get : 'session-get',
		set : 'session-set',
		setTypes : {
			'alt-speed-down' : true,
			'alt-speed-enabled' : true,
			'alt-speed-time-begin' : true,
			'alt-speed-time-enabled' : true,
			'alt-speed-time-end' : true,
			'alt-speed-time-day' : true,
			'alt-speed-up' : true,
			'blocklist-enabled' : true,
			'dht-enabled' : true,
			'encryption' : true,
			'download-dir' : true,
			'peer-limit-global' : true,
			'peer-limit-per-torrent' : true,
			'pex-enabled' : true,
			'peer-port' : true,
			'peer-port-random-on-start' : true,
			'port-forwarding-enabled' : true,
			'seedRatioLimit' : true,
			'seedRatioLimited' : true,
			'speed-limit-down' : true,
			'speed-limit-down-enabled' : true,
			'speed-limit-up' : true,
			'speed-limit-up-enabled' : true
		}
	},
	other : {
		blockList : 'blocklist-update',
		port : 'port-test'
	}
};
