#! /usr/bin/env node
/*jshint node: true, browser: true, indent: 2, laxcomma: true */
/* vim: set fenc=utf-8 ts=2 sts=2 sw=2 : */
"use strict";

var opts      = require("opts")
  , opts_conf = require("./opts.json")
  , cjs       = require("./lib/capturejs")
  ;

opts.parse(opts_conf);

var option = {}
opts_conf.forEach(function(o){
  if(opts.get(o.long)) {
    option[o.long] = opts.get(o.long);
  }
});

cjs.capture(option);