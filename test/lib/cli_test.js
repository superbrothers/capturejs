"use strict";

var sinon = require("sinon"),
    assert = require("assert"),
    path = require("path"),
    cli = require("../../lib/cli"),
    cjs = require("../../lib/capturejs");

describe("cli", function () {
    describe("#start()", function () {
        var sandbox = sinon.sandbox.create(), argv;

        before(function () {
            sandbox.stub(cjs, "capture");
            sandbox.stub(process, "exit");
            sandbox.stub(console, "error");
        });

        beforeEach(function () {
            sandbox.reset();
            cli.start(argv);
        });

        after(function () {
            sandbox.restore();
        });

        describe("no argument", function () {
            before(function () { argv = []; });

            it("should print 'Missing required' error message", function () {
                assert(console.error.calledWith("Missing required: --uri\nMissing required: --output"));
            });

            it("should exit process with 1", function () {
                assert(process.exit.calledWith(1));
            });
        });

        describe("--help", function () {
            before(function () { argv = ["--help"]; });

            it("should print help message", function () {
                assert(console.error.calledWithMatch(/^Usage: capturejs/));
            });

            it("should exit process with 0", function () {
                assert(process.exit.calledWith(0));
            });
        });

        describe("--version", function () {
            before(function () { argv = ["--version"]; });

            it("should print version number", function () {
                assert(console.error.calledWith(require("../../package.json").version));
            });

            it("should exit process with 0", function () {
                assert(process.exit.calledWith(0));
            });
        });

        describe("--uri", function () {
            before(function () {
                argv = ["--uri", "http://www.example.com/", "--output", "example.com.png"];
            });

            it("should call cjs.capture with uri", function () {
                var arg = cjs.capture.lastCall.args[0];
                assert.equal(arg.uri, "http://www.example.com/");
            });

            describe("when uri is not URI", function () {
                before(function () {
                    argv = ["--uri", "this is not URI", "--output", "example.com.png"];
                });

                it("should print 'Invalid' error message", function () {
                    assert(console.error.calledWith("Invalid: --uri=this is not URI"));
                });

                it("should exit process with 1", function () {
                    assert(process.exit.calledWith(1));
                });
            });
        });

        describe("--output", function () {
            var fullpath = path.resolve(process.cwd(), "example.com.png");

            before(function () {
                argv = ["--uri", "http://www.example.com/", "--output", "example.com.png"];
            });

            it("should call cjs.capture with uri", function () {
                var arg = cjs.capture.lastCall.args[0];
                assert.equal(arg.output, fullpath);
            });
        });
    });
});
// vim: set fenc=utf-8 ts=4 sts=4 sw=4 :
