[![build status](https://secure.travis-ci.org/superbrothers/capturejs.png)](http://travis-ci.org/superbrothers/capturejs)
# Capturejs

## Installation

    $ brew install phantomjs
    $ npm install -g capturejs

## Usage

    Usage: capturejs [options]
    URI
        -u, --uri <value> (required)
    Output Image File
        -o, --output <value> (required)
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

    $ capturejs --uri http://tiqav.com/ \
                --selector 'header .wrapper' \
                --output tiqav_header.png

![tiqav_header.png](http://farm9.staticflickr.com/8166/7386134234_50d633e965.jpg)

    $ capturejs --uri http://tiqav.com/ \
                --selector 'header .wrapper' \
                --javascript-file tiqav_hide_logo.js \
                --output tiqav_header.png

```js
// tiqav_hide_logo.js
document.querySelector("#logo").style.visibility = "hidden";
```

![tiqav_header_hide_logo.png](http://farm8.staticflickr.com/7073/7386144940_9e686bcaf8.jpg)

## Copyright

Copyright (c) 2012 Kazuki Suda. See LICENSE.txt for further details.
