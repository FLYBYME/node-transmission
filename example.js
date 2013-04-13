var Transmission = require('./')

var transmission = new Transmission({
	port : 9091,
	host : '127.0.0.1'
})

transmission.on('added', function(hash, id, name) {
	console.log('torrent added', hash, id, name)
})
transmission.on('removed', function(id) {
	console.log('torrent removed id:', id)
})
transmission.on('stopped', function(id) {
	console.log('torrent stopped id:', id)
})
transmission.on('force', function(id) {
	console.log('torrent force start id:', id)
})
transmission.on('active', function(torrents) {
	console.log('active torrent count:', torrents.length)
})

transmission.add('http://cdimage.debian.org/debian-cd/6.0.7/i386/bt-cd/debian-6.0.7-i386-netinst.iso.torrent', {
	"download-dir" : "/home/torrents"
}, function(err, result) {
	if (err) {
		throw err
	}
	var id = result.id
	console.log(result)

})