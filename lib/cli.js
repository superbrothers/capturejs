"use strict";

var url = require("url"),
    path = require("path"),
    fs = require("fs"),
    nopt = require("nopt"),
    cjs = require("./capturejs");

var cli = module.exports = {};

cli.start = function (argv) {
    var knownOpts = {
            uri: url,
            output: path,
            "ssl-protocol": ["sslv3", "sslv2", "tlsv1", "any"],
            "ignore-ssl-errors": [Boolean, "true", "false", "yes", "no"],
            "web-security": [Boolean, "true", "false", "yes", "no"],
            selector: String,
            "user-agent": String,
            "javascript-file": path,
            "inject-script": String,
            viewportsize: String,
            cliprect: String,
            "cookies-file": path,
            timeout: Number,
            renderdelay: Number,
            waitcapturedelay: Number,
            zoomfactor: Number,
            version: Boolean,
            help: Boolean,
        },
        shortHands = {
            u: "--uri",
            o: "--output",
            p: "---ssl-protocol",
            I: "--ignore-ssl-errors",
            W: "--web-security",
            s: "--selector",
            A: "--user-agent",
            J: "--javascript-file",
            j: "--inject-script",
            V: "--viewportsize",
            C: "--cliprect",
            c: "--cookies-file",
            T: "--timeout",
            R: "--renderdelay",
            w: "--waitcapturedelay",
            z: "--zoomfactor",
            v: "--version",
            h: "--help",
        },
        errors = [],
        parsed;

    nopt.invalidHandler = function (key, val) {
        errors.push("Invalid: --" + key + "=" + val);
    };

    parsed = nopt(knownOpts, shortHands, argv, 0);
    if (parsed.help) {
        var data = fs.readFileSync(path.join(__dirname, "../doc/help.txt"));
        console.error(data.toString("utf-8"));
        process.exit(0);
    }

    if (parsed.version) {
        console.error(require("../package.json").version);
        process.exit(0);
    }

    if (!parsed.uri && parsed.argv.cooked.indexOf("--uri") === -1) {
        errors.push("Missing required: --uri");
    }

    if (!parsed.output) {
        errors.push("Missing required: --output");
    }

    if (errors.length > 0) {
        console.error(errors.join("\n"));
        process.exit(1);
    }
    cjs.capture(parsed);
};

// vim: set fenc=utf-8 ts=4 sts=4 sw=4 :
