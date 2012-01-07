var bt = new (require('../lib/transmission.js'))(9091, 'localhost')
console.log(bt)

bt.on('update', function(torrents) {
	console.log(torrents.length)
	console.log(bt)
})
bt.start()
bt.addTorrent('https://broadcasthe.net/torrents.php?action=download&id=86859&authkey=ef1acaab381c3eabd3e14eb0f67fd130&torrent_pass=851gkt7b7i9mp255vbijvnneunii12c4')