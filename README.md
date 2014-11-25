CaptureJS
=========

CaptureJS is full webpage capture command-line tool with PhantomJS.

[![Build Status](https://travis-ci.org/superbrothers/capturejs.png?branch=master)](https://travis-ci.org/superbrothers/capturejs)

Installation
------------

First [install PhantomJS](http://phantomjs.org/download.html).


    $ npm install -g capturejs

Usage
-----

    Usage: capturejs [options]

    URI
        -u, --uri <value> (required)
    Output Image File
        -o, --output <value> (required)
    Sets the SSL protocol for secure connections (default is SSLv3) (sslv3|sslv2|tlsv1|any)
        -p, --ssl-protocol <value>
    Ignores SSL errors (expired/self-signed certificate errors)
        -I, --ignore-ssl-errors <value>
    CSS Selector
        -s, --selector <value>
    UserAgent
        -A, --user-agent <value>
    Inject external script code on Web page
        -J, --javascript-file <value>
    ViewPortSize {width}x{height}
        -V, --viewportsize <value>
    Cookies File
        -c, --cookies-file <value>
    HTTP Timeout (ms)
        -T, --timeout <value>
    Render Delay (ms)
        -R, --renderdelay <value>
    Zoom Factor (default is 1.0, i.e. 100% zoom)
        -z, --zoomfactor <value>

Quick Start
-----------

    % capturejs --uri http://phantomjs.org/ \
                --selector '.header' \
                --viewportsize 1400x1400 \
                --output 'phantomjs.org.png'

![phantomjs org](screenshots/phantomjs_org.png)

    % capturejs --uri http://phantomjs.org/ \
                --selector '.header' \
                --viewportsize 1400x1400 \
                --javascript-file ./hidelogo.js \
                --output 'phantomjs.org_hide_logo.png'

```javascript
// hidelogo.js
document.querySelector('.header img').style.visibility = 'hidden';
```

![phantomjs org_hide_logo](screenshots/phantomjs_org_hide_logo.png)

Copyright
---------

Copyright (c) 2012 Kazuki Suda. See LICENSE.txt for further details.
