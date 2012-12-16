/*jslint browser: true, node: true, nomen: true, sloppy: true, maxerr: 50, indent: 4 */
// vim: set fenc=utf-8 ts=4 sts=4 sw=4 :

var fs = require('fs'),
    http = require('http'),
    url = require('url'),
    path = require('path'),
    crypto = require('crypto'),
    async = require('async'),
    capturejs = require(path.join(__dirname, '..', 'lib', 'capturejs.js')),
    server,
    PORT = 9999,
    ROOT_URI = 'http://' + require('os').hostname() + ':' + PORT;

function md5sum(path, callback) {
    var md5 = crypto.createHash('md5');
    fs.readFile(path, function (err, data) {
        if (err) {
            return callback(err, null);
        }
        callback(null, md5.update(data).digest('hex'));
    });
}

function actualPath(fileName) {
    return path.join(__dirname, 'actual', fileName);
}

function expectedPath(fileName) {
    return path.join(__dirname, 'expected', fileName);
}

module.exports = {
    'setUp': function (callback) {
        server = http.createServer(function (req, res) {
            fs.readFile(path.join(__dirname, 'test.html'), 'utf8', function (err, data) {
                res.writeHead('200', {'Content-Type': 'text/html'});
                res.write(data);
                res.end();
            });
        }).listen(PORT);
        callback();
    },
    'tearDown': function (callback) {
        server.close();
        callback();
    },
    'basic': function (test) {
        var expected = expectedPath('basic.png'),
            actual = actualPath(Date.now() + '.png');
        capturejs.capture({
            'uri': ROOT_URI,
            'output': actual
        }, function () {
            setTimeout(function () {
                async.map([expected, actual], md5sum, function (err, results) {
                    test.equal(results[0], results[1], expected + ' eq ' + actual);
                    test.done();
                });
            }, 100);
        });
    },
    'use selector': function (test) {
        var expected = expectedPath('selector.png'),
            actual = actualPath(Date.now() + '.png');
        capturejs.capture({
            'uri': ROOT_URI,
            'output': actual,
            'selector': '#wrapper1'
        }, function () {
            setTimeout(function () {
                async.map([expected, actual], md5sum, function (err, results) {
                    test.equal(results[0], results[1], expected + ' eq ' + actual);
                    test.done();
                });
            }, 100);
        });
    }
};
