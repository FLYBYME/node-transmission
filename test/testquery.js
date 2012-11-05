var bt = new (require('../lib/transmission.js'))({
	//port : 9091,
	//host : 'localhost',
	//username : 'admin',
	//password : 'password1'
})

bt.add('http://cdimage.debian.org/debian-cd/6.0.6/i386/bt-cd/debian-6.0.6-i386-netinst.iso.torrent', function(err, result) {
	if (err) {
		throw err
	}
	console.log(result)
	bt.stop('5db3a7a15a1391795a74b48c74df5d515a12c6f7', function(err) {
		if (err) {
			throw err
		}
		bt.start('5db3a7a15a1391795a74b48c74df5d515a12c6f7', function(err) {
			if (err) {
				throw err
			}
			bt.get('5db3a7a15a1391795a74b48c74df5d515a12c6f7', function(err, result) {
				if (err) {
					throw err
				}
				console.log(result)

				bt.remove('5db3a7a15a1391795a74b48c74df5d515a12c6f7', true, function(err) {
					if (err) {
						throw err
					}

				})
			})
		})
	})
})