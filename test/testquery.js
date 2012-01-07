var bt = new (require('../lib/transmission.js'))(9091, 'localhost')
console.log(bt)

bt.on('update', function(torrents) {
	console.log(torrents.length)
	console.log(bt)
})
bt.start()

bt.addTorrent('path.to.torrent')