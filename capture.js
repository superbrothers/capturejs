#! /usr/bin/env node
/*jshint node: true, browser: true, indent: 2, laxcomma: true */
/* vim: set fenc=utf-8 ts=2 sts=2 sw=2 : */
"use strict";

var opts = require("opts")
  , fs = require("fs")
  , phantom = require("phantom")
  ;

opts.parse(require("./opts.json"));

// phantomjs Command-line Options
var args = [];
["cookies-files"].forEach(function (key) {
  if (opts.get(key)) args.push(["--", key, "=", opts.get("cookies-file")].join(""));
});
phantom.create.apply(phantom, (function () {
  args.push(function (ph) {
    ph.createPage(function (page) {
      // viewportSize
      if (opts.get("viewportsize")) {
        var matches = opts.get("viewportsize").match(/^(\d+)x(\d+)$/);
        if (matches !== null) {
          page.set("viewportSize", {width: matches[1], height: matches[2]});
        }
      }
      // UserAgent
      if (opts.get("useragent")) {
        page.set("settings.userAgent", opts.get("useragent"));
      }
      // HTTP Timeout
      if (opts.get("timeout")) {
        var timer = setTimeout(function () {
          console.error("Error: " + opts.get("uri") + " is timeout");
          ph.exit();
          process.exit(1);
        }, +opts.get("timeout"));
      }
      page.open(opts.get("uri"), function (status) {
        if (status === "fail") {
          console.error("Error: " + opts.get("uri") + "failed");
          ph.exit();
          process.exit(1);
        }
        if (typeof timer !== "undefined") clearTimeout(timer);

        // inject external script code
        if (opts.get("javascript-file")) {
          page.injectJs(opts.get("javascript-file"));
        }
        /**
        * pass parameters into the webpage function.
        *
        * http://code.google.com/p/phantomjs/issues/detail?id=132
        * from comment #43.
        */
        page.evaluate((function () {
          var func = function (selector) {
            document.body.bgColor = "white";
            if (typeof selector === "undefined") return null;
            var elem = document.querySelector(selector);
            return (elem !== null) ? elem.getBoundingClientRect() : null;
          };
          return "function() { return (" + func.toString() + ").apply(this, " + JSON.stringify([opts.get("selector")]) + ");}";
        }()), function (rect) {
          if (rect !== null)  page.set("clipRect", rect);
          page.render(opts.get("output"));
          ph.exit();
        });
      });
    });
  });
  return args;
}()));
