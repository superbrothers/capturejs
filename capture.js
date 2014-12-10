#! /usr/bin/env node
/*jslint node: true, sloppy: true, maxerr: 50, indent: 4 */
// vim: set fenc=utf-8 ts=4 sts=4 sw=4 :
'use strict';

var url = require('url'),
    path = require('path'),
    nopt = require('nopt'),
    cjs = require('./lib/capturejs');

var knownOpts = {
        uri: url,
        output: path,
        'ssl-protocol': ['sslv3', 'sslv2', 'tlsv1', 'any'],
        'ignore-ssl-errors': [Boolean, 'true', 'false', 'yes', 'no'],
        selector: String,
        'user-agent': String,
        'javascript-file': path,
        viewportsize: String,
        'cookies-file': path,
        timeout: Number,
        renderdely: Number,
        zoomfactor: Number
    },
    shortHands = {
        u: '--uri',
        o: '--output',
        p: '---ssl-protocol',
        I: '--ignore-ssl-errors',
        s: '--selector',
        A: '--user-agent',
        J: '--javascript-file',
        V: '--viewportsize',
        c: '--cookies-file',
        T: '--timeout',
        R: '--renderdely',
        z: '--zoomfactor'
    },
    errors = [],
    parsed;

nopt.invalidHandler = function (key, val) {
    errors.push('Invalid: --' + key + '=' + val);
};

parsed = nopt(knownOpts, shortHands, process.argv);

if (!parsed.uri) {
    errors.push('Missing required: --uri');
}

if (!parsed.output) {
    errors.push('Missing required: --output');
}

if (errors.length > 0) {
    console.error(errors.join('\n'));
    process.exit(1);
}

cjs.capture(parsed);
