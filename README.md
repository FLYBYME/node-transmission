# node-transmission

transmission-daemon wrapper script written in node.js

## Install

```sh
npm install transmission
```

## How to Use

```coffee
Transmission = require 'transmission'
transmission = new Transmission
  host: 'localhost'  # default 'localhost'
  port: 9091         # default 9091
  username: 'hoge'   # default blank
  password: 'fuga'   # default blank
```

## Definition

### Status

RPC returned torrent status with integer `0-7`.

Using `transmission.status` for inspect status.

```
transmission.status =
  STOPPED       : 0  # Torrent is stopped
  CHECK_WAIT    : 1  # Queued to check files
  CHECK         : 2  # Checking files
  DOWNLOAD_WAIT : 3  # Queued to download
  DOWNLOAD      : 4  # Downloading
  SEED_WAIT     : 5  # Queued to seed
  SEED          : 6  # Seeding
  ISOLATED      : 7  # Torrent can't find peers
```
##Events

### Event: "added" ###

`function (hash, id, name) { }`

Emits when a new torrent is added
### Event: "removed" ###

`function (id) { }`

Emits when a torrent is removed
### Event: "stopped" ###

`function (id) { }`

Emits when a torrent is stopped
### Event: "force" ###

`function (id) { }`

Emits when a torrent is forced to start
### Event: "active" ###

`function (torrents) { }`

Emits when the active method is called.


## Methods

### transmission.add(path, callback)

Add torrents to transmission-daemon.

```coffee
transmission.add 'path/or/url', (err, arg) ->
```
OR

The `options` object would be the arguments passed to transmission.
If you want to set the download directory of the torrent you would pass in `"download-dir":"/my/path"`

```coffee
transmission.add 'path/or/url', options, (err, arg) ->
```

### transmission.remove(ids, del, callback)

Remove torrents.

Remove also local data when `del` is `true`.

```coffee
transmission.remove [1, 7], true, (err, arg) ->
```

### transmission.active(callback)

List of active torrents. Callback is not needed and will fire the `active` event.

```coffee
transmission.active (err, arg) ->
```

### transmission.get([ids], callback)

Get torrents info that optional `ids`.

If omit `ids`, get all torrents.

```coffee
# Get torrents with id #1 and #7
transmission.get [1, 7], (err, arg) ->
  if err
    console.error err
  else
    for torrent in arg.torrents
      console.log arg.torrents

# Get all torrents and remove it if status is stopped.
transmission.get (err, arg) ->
  if err
    console.error err
  else
    for torrent in arg.torrents
      if torrent.status is transmission.status.STOPPED
        transmission.remove [torrent.id], (err) ->
          console.error err if err
```

### transmission.stop(ids, callback)

Stop working torrents.

```coffee
transmission.stop [1, 7], (err, arg) ->
```

### transmission.start(ids, callback)

Start working torrents.

```coffee
transmission.start [1, 7], (err, arg) ->
```

### transmission.startNow(ids, callback)

Bypass the download queue, start working torrents immediately.

```coffee
transmission.startNow [1, 7], (err, arg) ->
```

### transmission.verify(ids, callback)

Verify torrent data.

```coffee
transmission.verify [1, 7], (err, arg) ->
```

### transmission.reannounce(ids, callback)

Reannounce to the tracker, ask for more peers.

```coffee
transmission.reannounce [1, 7], (err, arg) ->
```

### transmission.session(callback)

Get cleint session infomation.

```coffee
transmission.session (err, arg) ->
```

### transmission.session({}, callback)

Set session infomation.

```coffee
transmission.session {'download-dir':'/my/path'}, (err, arg) ->
```

### transmission.sessionStats(callback)

Get cleint session stats.

```coffee
transmission.sessionStats (err, arg) ->
```

### All together.

```js
var transmission = new (require('../lib/transmission.js'))({
	//port : 9091,
	//host : 'localhost',
	//username : 'admin',
	//password : 'password1'
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

transmission.add('http://cdimage.debian.org/debian-cd/6.0.6/i386/bt-cd/debian-6.0.6-i386-netinst.iso.torrent', function(err, result) {
	if (err) {
		throw err
	}
	var id = result.id
	//console.log(result)
	transmission.stop(id, function(err) {
		if (err) {
			throw err
		}
		transmission.start(id, function(err) {
			if (err) {
				throw err
			}
			transmission.get(id, function(err, result) {
				if (err) {
					throw err
				}
				//console.log(result)

				transmission.remove(id, true, function(err) {
					if (err) {
						throw err
					}
					bt.active()
				})
			})
		})
	})
})
```


