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

```
Usage: capturejs [options]

Options:
  -u, --uri <value>                URI (required)
  -o, --output <value>             Output image file (required)
  -p, --ssl-protocol <value>       Sets the SSL protocol for secure connections (default is SSLv3) (sslv3|sslv2|tlsv1|any)
  -I, --ignore-ssl-errors          Ignores SSL errors (expired/self-signed certificate errors)
  -s, --selector <value>           CSS selector
  -A, --user-agent <value>         UserAgent
  -J, --javascript-file <value>    Inject external script code on Web page
  -V, --viewportsize <value>       ViewPortSize {width}x{height}
  -c, --cookies-file <value>       Cookies file
  -T, --timeout <value>            HTTP Timeout (ms)
  -R, --renderdelay <value>        Render delay (ms)
  -z, --zoomfactor <value>         Zoom Factor (default is 1.0, i.e. 100% zoom)

  -h, --help                       Show this message and exit
```

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
