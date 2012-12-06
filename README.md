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
var br = new (require('../lib/transmission.js'))({});

//hash for the debian torrent
var hash = '5db3a7a15a1391795a74b48c74df5d515a12c6f7';

//debian torrent
var torrentURL = 'http://cdimage.debian.org/debian-cd/6.0.6/i386/bt-cd/debian-6.0.6-i386-netinst.iso.torrent';

br.add(torrentURL, function(err, result) {
	if (err) {
		throw err;
	}
	console.log(result);
	br.stop(hash, function(err) {
		if (err) {
			throw err;
		}
		br.start(hash, function(err) {
			if (err) {
				throw err;
			}
			br.get(hash, function(err, result) {
				if (err) {
					throw err;
				}
				console.log(result);
				br.remove(hash, true, function(err) {
					if (err) {
						throw err;
					}
				});
			});
		});
	});
});
```


