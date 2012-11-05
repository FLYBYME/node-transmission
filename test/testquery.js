var bt = new (require('../lib/transmission.js'))(9091, 'localhost')
console.log(bt)

// optional authorization options
// bt.username = 'admin';
// bt.password = 'password1';

bt.on('update', function(torrents) {
	console.log(torrents.length)
	console.log(bt)
})
bt.start()

bt.addTorrent('path.to.torrent')