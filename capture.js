#! /usr/bin/env node
/*jslint node: true, sloppy: true, maxerr: 50, indent: 4 */
// vim: set fenc=utf-8 ts=4 sts=4 sw=4 :
'use strict';

var opts      = require('opts'),
    opts_conf = require('./opts.json'),
    cjs       = require('./lib/capturejs');

opts.parse(opts_conf);

var option = {};
opts_conf.forEach(function (o) {
    if (opts.get(o.long)) {
        option[o.long] = opts.get(o.long);
    }
});

cjs.capture(option);
