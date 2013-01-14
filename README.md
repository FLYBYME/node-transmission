# node-transmission

transmission-daemon wrapper script written in node.js

## Install

```sh
npm install transmission
```

## How to Use

```coffee
Transmission = require 'transmission'
br = new Transmission
  host: 'localhost'  # default 'localhost'
  port: 9091         # default 9091
  username: 'hoge'   # default blank
  password: 'fuga'   # default blank
```

## Definition

### Status

RPC returned torrent status with integer `0-7`.

Using `br.status` for inspect status.

```
br.status =
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

### Event: added ###

`function (hash, id, name) { }`

Emits when a new torrent is added
### Event: removed ###

`function (id) { }`

Emits when a torrent is removed
### Event: stopped ###

`function (id) { }`

Emits when a torrent is stopped
### Event: start-now ###

`function (id) { }`

Emits when a torrent is forced to start
### Event: active ###

`function (torrents) { }`

Emits when the active method is called.


## Methods

### br.add(path, callback)

Add torrents to transmission-daemon.

```coffee
br.add 'path/or/url', (err, arg) ->
```

### br.remove(ids, del, callback)

Remove torrents.

Remove also local data when `del` is `true`.

```coffee
br.remove [1, 7], true, (err, arg) ->
```

### br.active(callback)

List of active torrents. Callback is not needed and will fire the `active` event.

```coffee
br.active (err, arg) ->
```

### br.get([ids], callback)

Get torrents info that optional `ids`.

If omit `ids`, get all torrents.

```coffee
# Get torrents with id #1 and #7
br.get [1, 7], (err, arg) ->
  if err
    console.error err
  else
    for torrent in arg.torrents
      console.log arg.torrents

# Get all torrents and remove it if status is stopped.
br.get (err, arg) ->
  if err
    console.error err
  else
    for torrent in arg.torrents
      if torrent.status is br.status.STOPPED
        br.remove [torrent.id], (err) ->
          console.error err if err
```

### br.stop(ids, callback)

Stop working torrents.

```coffee
br.stop [1, 7], (err, arg) ->
```

### br.start(ids, callback)

Start working torrents.

```coffee
br.start [1, 7], (err, arg) ->
```

### br.startNow(ids, callback)

Bypass the download queue, start working torrents immediately.

```coffee
br.startNow [1, 7], (err, arg) ->
```

### All together.

```js
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
```


