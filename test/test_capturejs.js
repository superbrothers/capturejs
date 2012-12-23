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
    request,
    PORT = 9999,
    ROOT_URI = 'http://' + require('os').hostname() + ':' + PORT;

function md5sum(path, callback) {
    var md5 = crypto.createHash('md5');
    fs.readFile(path, function (err, data) {
        if (err) {
            return callback(null, err);
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
            request = req;
            var u = url.parse(req.url, true);
            setTimeout(function () {
                fs.readFile(path.join(__dirname, 'test.html'), 'utf8', function (err, data) {
                    res.writeHead('200', {
                        'Content-Type': 'text/html',
                        'Set-Cookie': 'cookie=test'
                    });
                    res.write(data);
                    res.end();
                });
            }, (u.query.responsetime ? u.query.responsetime : 0));
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
    'selector': function (test) {
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
    },
    'external script': function (test) {
        var expected = expectedPath('external_script.png'),
            actual = actualPath(Date.now() + '.png');
        capturejs.capture({
            'uri': ROOT_URI,
            'output': actual,
            'javascript-file': path.join(__dirname, 'external_script')
        }, function () {
            setTimeout(function () {
                async.map([expected, actual], md5sum, function (err, results) {
                    test.equal(results[0], results[1], expected + ' eq ' + actual);
                    test.done();
                });
            }, 100);
        });
    },
    'user-agent': function (test) {
        var useragent = 'This is user-agent test';
        capturejs.capture({
            'uri': ROOT_URI,
            'output': actualPath(Date.now() + '.png'),
            'user-agent': useragent
        }, function () {
            test.equal(useragent, request.headers['user-agent']);
            test.done();
        });
    },
    'cookies-file': function (test) {
        var cookiesFile = path.join(__dirname, 'cookies-file.txt');
        fs.unlink(cookiesFile, function (err) {
            capturejs.capture({
                'uri': ROOT_URI,
                'output': actualPath(Date.now() + '.png'),
                'cookies-file': cookiesFile
            }, function () {
                fs.exists(cookiesFile, function (exists) {
                    test.ok(exists);
                    test.done();
                });
            });
        });
    },
    'timeout': function (test) {
        capturejs.capture({
            'uri': ROOT_URI + '/?responsetime=2000',
            'output': actualPath(Date.now() + '.png'),
            'timeout': 500
        }, function (err) {
            test.ok(!!err);
            test.done();
        });
    },
    'viewportsize': function (test) {
        var expected = expectedPath('viewportsize.png'),
            actual = actualPath(Date.now() + '.png');
        capturejs.capture({
            'uri': ROOT_URI,
            'output': actual,
            'javascript-file': path.join(__dirname, 'external_script'),
            'viewportsize': '1000x400'
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
