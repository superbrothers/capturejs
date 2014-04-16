# Capturejs

[![Build Status](https://travis-ci.org/superbrothers/capturejs.png?branch=master)](https://travis-ci.org/superbrothers/capturejs)

## Installation

    $ brew install phantomjs
    $ npm install -g capturejs

## Usage

    Usage: capturejs [options]
    URI
        -u, --uri <value> (required)
    Output Image File
        -o, --output <value> (required)
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

## Quick Start

    % capturejs --uri http://phantomjs.org/ \
                --selector '.header' \
                --viewportsize 1400x1400 \
                --output 'phantomjs.org.png'

![phantomjs org](https://f.cloud.github.com/assets/230185/659051/081f6cf6-d651-11e2-9b1f-a62d192135b3.png)

    % capturejs --uri http://phantomjs.org/ \
                --selector '.header' \
                --viewportsize 1400x1400 \
                --javascript-file ./hidelogo.js \
                --output 'phantomjs.org_hide_logo.png'

```javascript
// hidelogo.js
document.querySelector('.header img').style.visibility = 'hidden';
```

![phantomjs org_hide_logo](https://f.cloud.github.com/assets/230185/659053/808bf312-d651-11e2-8485-b490a10f7eca.png)

## Copyright

Copyright (c) 2012 Kazuki Suda. See LICENSE.txt for further details.
