# node-transmission

transmission-daemon wrapper script written in node.js

## Install

```sh
npm install transmission
```

## How to Use

```js
Transmission = require 'transmission'
transmission = new Transmission
  host: 'localhost'  # default 'localhost'
  port: 9091         # default 9091
  username: 'hoge'   # default blank
  password: 'fuga'   # default blank
  url: '/my/other/url'   # default '/transmission/rpc'
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

## Methods

### transmission.set([ids], callback)

Set torrent's properties.

```js
transmission.set (id, options, function(err, arg){});
```
You must provide one or more ids. According to the rpc-spec, transmission will not respond a success argument. Only error.

### transmission.addFile(filePath, callback)

Add torrents to transmission-daemon.

```js
transmission.addFile('path', function(err, arg){});
```

OR

The `options` object would be the arguments passed to transmission.
If you want to set the download directory of the torrent you would pass in `"download-dir":"/my/path"`

```js
transmission.addFile('path', options, function(err, arg){});
```

### transmission.addUrl(url, callback)

Add torrents to transmission-daemon.

```js
transmission.addUrl('url', function(err, arg){});
```
OR

The `options` object would be the arguments passed to transmission.
If you want to set the download directory of the torrent you would pass in `"download-dir":"/my/path"`

```js
transmission.addUrl ('url', options, function(err, arg){});
```

### transmission.remove(ids, del, callback)

Remove torrents.

Remove also local data when `del` is `true`.

```js
transmission.remove (id, function(err, arg){});
```

### transmission.active(callback)

List of active torrents. Callback is not needed and will fire the `active` event.

```js
transmission.active(function(err, arg){});
```

### transmission.get([ids], callback)

Get torrents info that optional `ids`.

If omit `ids`, get all torrents.

```js
transmission.get (id, function(err, arg){
  if err
    console.error err
  else{
    for torrent in arg.torrents
      console.log arg.torrents
   }
});

# Get all torrents and remove it if status is stopped.
transmission.get (function(err, arg){
  if err
    console.error err
  else{
    for torrent in arg.torrents
      if torrent.status is transmission.status.STOPPED
        transmission.remove ([torrent.id], function (err){
          console.error err if err
      	});
  }
});
```

### transmission.stop(ids, callback)

Stop working torrents.

```js
transmission.stop (id, function(err, arg){});
```

### transmission.start(ids, callback)

Start working torrents.

```js
transmission.start (id, function(err, arg){});
```

### transmission.startNow(ids, callback)

Bypass the download queue, start working torrents immediately.

```js
transmission.startNow(id, function(err, arg){});
```

### transmission.verify(ids, callback)

Verify torrent data.

```js
transmission.verify(id,function(err, arg){});
```

### transmission.reannounce(ids, callback)

Reannounce to the tracker, ask for more peers.

```js
transmission.reannounce(id, function(err, arg){});
```

### transmission.session(callback)

Get client session infomation.

```js
transmission.session (function(err, arg){});
```

### transmission.session({}, callback)

Set session infomation.

```js
transmission.session({'download-dir':'/my/path'}, function(err, arg){});
```

### transmission.sessionStats(callback)

Get client session stats.

```js
transmission.sessionStats(function(err, arg){});
```

### All together.

```js
var Transmission = require('transmission')

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

transmission.addUrl('http://cdimage.debian.org/debian-cd/7.1.0/i386/bt-cd/debian-7.1.0-i386-netinst.iso.torrent', {
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
```


