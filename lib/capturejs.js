"use strict";

var phantom = require("phantom");

const DEBUG = true;

/**
 * Print all arguments to the console.
 */
function inspectArgs() {
    if (DEBUG) console.log.apply(null, arguments);
}

// NOTE: The <phantomjs-node> module no longer supports a port configuration object.
// Pick a random int between two ranges.
// function getRandomPort(min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

module.exports.capture = function (option, callback) {
    callback = callback || function () { return undefined };

    var phInstance,
        phPage,
        timer;

    // Set arguments mapped to the PhantomJS command line.
    var phantomArgs = (function () {
        let args = [];

        [ "ssl-protocol"
        , "ignore-ssl-errors"
        , "web-security"
        , "cookies-file"
        ].forEach(function(key) {
            if (option[key]) {
                args.push(["--", key, "=", option[key]].join(""));
            }
        });

        // NOTE: The <phantomjs-node> module no longer supports a port configuration object.
        // Pick a random port for phantom to use on start up
        // var port = getRandomPort(40000, 60000);
        // args.unshift({"port": port});

        return args;
    })();

    // NOTE: The <phantomjs-node> module no longer supports a port configuration object.
    // Reset the handler in case we grab an in-use port.
    // function onUncaughtException(err) {
    //     if (err.errno === "EADDRINUSE") {
    //         createPhantomInstance(args);
    //     } else {
    //         console.log(err);
    //         process.exit(1);
    //     }
    // }

    /**
     * Generate a new PhantomJS instance.
     */
    function createPhantomHandler(ph) {
        if (DEBUG && typeof ph !== "object") inspectArgs("createPhantomHandler: ", ph);

        phInstance = ph;
        return ph.createPage();
    };

    /**
     * Configure page settings then open a new page in PhantomJS.
     */
    function createPageHandler(page) {
        if (DEBUG && !page.phantom) inspectArgs("createPageHandler: ", page);

        phPage = page;
        var matches;

        if (option.viewportsize) {
            matches = option.viewportsize.match(/^(\d+)x(\d+)$/);
            if (matches !== null) {
                page.setting("viewportSize", {width: matches[1], height: matches[2]});
            }
        }

        if (option.cliprect) {
            matches = option.cliprect.match(/^(\d+)x(\d+)x(\d+)x(\d+)$/);
            if (matches !== null) {
                page.setting("clipRect", {top: matches[1], left: matches[2],
                    width: matches[3], height: matches[4]});
            }
        }

        if (option["user-agent"]) {
            page.setting("settings.userAgent", option["user-agent"]);
        }

        if (option.zoomfactor) {
            page.setting("zoomFactor", parseFloat(option.zoomfactor));
        }

        if (option.timeout) {
            timer = setTimeout(function () {
                var err = `capturejs: cannot access ${option.uri}: request timed out`;
                console.error(err);
                phInstance.exit();
                process.nextTick(function () { callback(err) });
            }, +option.timeout);
        }

        return page.open(option.uri);
    };

    /**
     * Log status messages, and close PhantomJS on failure.
     */
    function reportStatus(status) {
        if (DEBUG && status !== "success") inspectArgs("reportStatus: ", status);

        if (status === "fail") {
            var err = `capturejs: cannot access ${option.uri}: failed to open page`;
            console.error(err);
            phInstance.exit();
            process.nextTick(callback, err);
        } else {
            return phPage;
        }
    }

    /**
     * Inject JavaScript into the open page.
     */
    function manipulatePage(page) {
        if (DEBUG && !page.phantom) inspectArgs("manipulatePage: ", page);

        if (timer !== undefined) {
            clearTimeout(timer);
        }

        // Inject an external script file.
        if (option["javascript-file"]) {
            page.injectJs(option["javascript-file"]);
        }

        // Inject an in-line script from the command line.
        if (option["inject-script"]) {
            var injectScript = option["inject-script"];
            injectScript = (typeof injectScript === "function") ?
                injectScript.toString() : `function() { ${injectScript} }`;
            page.evaluateJavaScript(injectScript);
        }

        if (option.waitcapturedelay) {
            setTimeout(function () { return page }, +option.waitcapturedelay);
        } else {
            return page;
        }
    };

    /**
     * Capture the specified image.
     */
    function captureImage(page) {
        if (DEBUG && !page.phantom) inspectArgs("captureImage: ", page);

        if (option.selector) {
            let getElement = [ "function () {",
                , "document.body.bgColor = 'white';"
                , `var elem = document.querySelector('${option.selector}');`
                , "return (elem !== null) ? elem.getBoundingClientRect() : null; };"
            ].join("");

            return page.evaluateJavaScript(getElement);
        }
    }

    /**
     * Output the saved image to the specified file.
     */
    function saveImage(rect) {
        if (DEBUG && rect && !rect.bottom) inspectArgs("saveImage: ", rect);

        if (rect && typeof rect.bottom === "number") {
            phPage.property("clipRect", rect);
        }

        // Set a timeout to give the page a chance to render.
        setTimeout(function () {
            phPage.render(option.output)
                  .then(function () {
                      phInstance.exit();
                      // process.removeListener("uncaughtException", onUncaughtException);
                      process.nextTick(callback);
                  });
        }, option.renderdelay || 250);
    }

    // Monitor for conflicts when using a randomized port number.
    // process.on("uncaughtException", onUncaughtException);

    // Initialize PhantomJS using all command-line arguments.
    phantom.create(phantomArgs)
           .then(createPhantomHandler)
           .then(createPageHandler)
           .then(reportStatus)
           .then(manipulatePage)
           .then(captureImage)
           .then(saveImage)
           .catch(function(err) {
               console.error(err);
               phInstance.exit();
               process.nextTick(callback, err);
           });

};

// vim: set fenc=utf-8 ts=4 sts=4 sw=4 :
