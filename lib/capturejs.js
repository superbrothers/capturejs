var phantom = require("phantom");

module.exports.capture = function(option, callback) {
  var args = [];
  callback = callback || function(){};
  
  // Handler for Phantom.js
  var phantomHandler = function(ph) {
    ph.createPage(function (page) {
      // viewportSize option
      if (option["viewportsize"]) {
        var matches = option["viewportsize"].match(/^(\d+)x(\d+)$/);
        if (matches !== null) {
          page.set("viewportSize", {width: matches[1], height: matches[2]});
        }
      }
          
      // UserAgent option
      if (option["user-agent"]) {
        page.set("settings.userAgent", option["user-agent"]);
      }
          
      // HTTP Timeout option
      if (option["timeout"]) {
        var timer = setTimeout(function () {
          var err = "Error: " + option["uri"] + " is timeout";
          ph.exit();
          process.nextTick(function(){
            callback(err);
          });
        }, +option["timeout"]);
      }
          
      // Open web page
      page.open(option["uri"], function (status) {
        if (status === "fail") {
          var err = "Error: " + option["uri"] + "failed";
          ph.exit();
          process.nextTick(function(){
            callback(err);
          });
        }
      
        if (typeof timer !== "undefined") clearTimeout(timer);
              
        // Injecting external script code
        if (option["javascript-file"]) {
          page.injectJs(option["javascript-file"]);
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
          return "function() { return (" + func.toString() + ").apply(this, " + JSON.stringify([option["selector"]]) + ");}";
        }()), function (rect) {
          if (rect !== null)  page.set("clipRect", rect);
          page.render(option["output"]);
          ph.exit();
          process.nextTick(callback);
        });
      });
    });
  };
  
  // Setup arguments for Phantom.js
  ["cookies-files"].forEach(function (key) {
    if (option[key]) args.push(["--", key, "=", option["cookies-file"]].join(""));
  });
  args.push(phantomHandler);
    
  // Execute Phantom.js
  phantom.create.apply(phantom, args);
};
