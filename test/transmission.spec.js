var fs = require('fs');
var path = require('path');
var http = require('http');
var async = require('async');
var dotenv = require('dotenv');

dotenv.load();

if (!fs.existsSync(path.resolve('tmp'))) {
    fs.mkdirSync(path.resolve('tmp'));
}

var Transmission = require(path.resolve());
var clientOption = {};

if (process.env.PORT) {
    clientOption.port = process.env.PORT;
}
if (process.env.HOST) {
    clientOption.host = process.env.HOST;
}

//USERNAME and USER aren't overwritten by .env file and are used from the parent process
if (process.env.USERN) {
    clientOption.username = process.env.USERN;
}
if (process.env.PASSWORD) {
    clientOption.password = process.env.PASSWORD;
}
if (process.env.URL) {
    clientOption.url = process.env.URL;
}

describe('transmission', function () {
    var chai = require('chai');
    var expect = chai.expect;
    var transmission = new Transmission(clientOption);

    var sampleUrl = 'http://releases.ubuntu.com/14.04.1/ubuntu-14.04.1-desktop-amd64.iso.torrent';
    var sampleHash = 'cb84ccc10f296df72d6c40ba7a07c178a4323a14';

    chai.config.includeStack = true;

    before(function (done) {
        transmission.active(function (err) {
            if (err) {
                done(err);
            }
            transmission.get(function (err, arg) {
                if (err) {
                    done(err);
                }
                async.each(arg.torrents, function (torrent, callback) {
                    if (torrent.hash === sampleHash) {
                        transmission.remove(torrent.id, true, callback);
                    } else {
                        callback(null);
                    }
                }, function (err) {
                    done(err);
                });
            });
        });
    });

    afterEach(function (done) {
        transmission.get(function (err, arg) {
            if (err) {
                done(err);
            }
            async.each(arg.torrents, function (torrent, callback) {
                if (torrent.hashString === sampleHash) {
                    transmission.remove(torrent.id, true, callback);
                } else {
                    callback(null);
                }
            }, function (err) {
                done(err);
            });
        });
    });

    describe('status definition', function () {
        it('should have correct status', function () {
            expect(transmission.status.STOPPED).to.equal(0);
            expect(transmission.status.CHECK_WAIT).to.equal(1);
            expect(transmission.status.CHECK).to.equal(2);
            expect(transmission.status.DOWNLOAD_WAIT).to.equal(3);
            expect(transmission.status.DOWNLOAD).to.equal(4);
            expect(transmission.status.SEED_WAIT).to.equal(5);
            expect(transmission.status.SEED).to.equal(6);
            expect(transmission.status.ISOLATED).to.equal(7);
        });
    });

    describe('methods', function () {
        it.skip('should set properties', function (done) {
            done(null);
        });

        it('should add torrent from file path', function (done) {
            http.get(sampleUrl, function (response) {
                var destination = path.resolve('tmp', 'debian.torrent');
                var writeStream = fs.createWriteStream(destination);
                response.pipe(writeStream);
                response.on('error', done);
                response.on('end', function () {
                    transmission.addFile(destination, function (err, info) {
                        if (err) {
                            done(err);
                        } else {
                            transmission.get(info.id, function (err, got) {
                                if (0 === got.torrents.length) {
                                    err = new Error('add torrent failure');
                                }
                                done(err);
                            });
                        }
                    });
                });
            });
        });

        it('should add torrent from url', function (done) {
            transmission.addUrl(sampleUrl, function (err, info) {
                if (err) {
                    done(err);
                } else {
                    transmission.get(info.id, function (err, got) {
                        if (0 === got.torrents.length) {
                            err = new Error('add torrent failure');
                        }
                        done(err);
                    });
                }
            });
        });

        it('should rename the torrent', function (done) {
            transmission.addUrl(sampleUrl, function (err, info) {
                if (err) {
                    done(err);
                } else {
                    var newName = 'windows-10-installer.exe';
                    var path = 'ubuntu-14.04.1-desktop-amd64.iso';
                    transmission.rename(info.id, path, newName, function (err, info) {
                        if (err) {
                            done(err);
                        } else {
                            transmission.get(info.id, function (err, got) {
                                if (newName !== got.torrents[0].name) {
                                    err = new Error('rename torrent failure');
                                }
                                done(err);
                            });
                        }
                    });
                }
            });
        });

        it.skip('should stop working torrents', function () {
            // transmission.stop
        });

        it.skip('should start working torrents', function () {
            // transmission.start
        });

        it.skip('should start working torrents immediately', function () {
            // transmission.startNow
        });

        it.skip('should reannounce to the tracker', function () {
            // transmission.verify
        });

        it.skip('should get client session info', function () {
            // transmission.session
        });

        it.skip('should set client session info', function () {
            // transmission.session({})
        });

        it.skip('should get client session stats', function () {
            // transmission.sessionStats
        });
    });

});
