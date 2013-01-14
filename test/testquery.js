var bt = new (require('../lib/transmission.js'))({
	//port : 9091,
	//host : 'localhost',
	//username : 'admin',
	//password : 'password1'
})

bt.on('added', function(hash, id, name) {
	console.log('torrent added', hash, id, name)
})
bt.on('removed', function(id) {
	console.log('torrent removed id:', id)
})
bt.on('stopped', function(id) {
	console.log('torrent stopped id:', id)
})
bt.on('start-now', function(id) {
	console.log('torrent start now id:', id)
})
bt.on('active', function(torrents) {
	console.log('active torrent count:', torrents.length)
})

bt.add('http://cdimage.debian.org/debian-cd/6.0.6/i386/bt-cd/debian-6.0.6-i386-netinst.iso.torrent', function(err, result) {
	if (err) {
		throw err
	}
	var id = result.id
	//console.log(result)
	bt.stop(id, function(err) {
		if (err) {
			throw err
		}
		bt.start(id, function(err) {
			if (err) {
				throw err
			}
			bt.get(id, function(err, result) {
				if (err) {
					throw err
				}
				//console.log(result)

				bt.remove(id, true, function(err) {
					if (err) {
						throw err
					}
					bt.active()
				})
			})
		})
	})
})