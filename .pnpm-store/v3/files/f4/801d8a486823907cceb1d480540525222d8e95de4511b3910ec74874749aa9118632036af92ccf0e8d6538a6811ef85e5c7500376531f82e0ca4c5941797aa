[jStat](http://www.jstat.org/) - JavaScript Statistical Library
===============================================================

[![npm version](https://badge.fury.io/js/jstat.svg)](https://badge.fury.io/js/jstat)

jStat provides native javascript implementations of statistical functions.
Full details are available in the [docs](https://jstat.github.io/all.html).
jStat provides more functions than most libraries, including the weibull,
cauchy, poisson, hypergeometric, and beta distributions.  For most
distributions, jStat provides the pdf, cdf, inverse, mean, mode, variance, and
a sample function, allowing for more complex calculations.

**NOTICE:** The previous case sensitive `jStat` module will no longer be
updated. Instead use the all lowercase `jstat` when doing an `npm install` or
similar.

Using jStat in a Browser
------------------------

jStat can be used in the browser. The `jStat` object will be added to the
window. For example:

```
<script src="components/jstat.js"></script> <!-- include jStat, from the CDN or otherwise -->

<script>
...
var jstat = this.jStat(dataset); // jStat will be added to the window
...
data[i]['cum'] = jstat.normal(jstat.mean(), jstat.stdev()).cdf(data[i].x);
...
</script>

```

CDN [![jsDelivr Hits](https://data.jsdelivr.com/v1/package/npm/jstat/badge?style=rounded)](https://www.jsdelivr.com/package/npm/jstat)
---

The library is hosted on [jsDelivr](http://www.jsdelivr.com/) using the following
url:
```
//cdn.jsdelivr.net/npm/jstat@latest/dist/jstat.min.js
```
Note that `'latest'` can be replaced with any released verion of jStat.

Module Loaders
--------------

Currently jStat is exposed as `j$` and `jStat` inside an object, rather than
exported directly. This may confuse some module loaders, however should be
easily remedied with the correct configuration.

NodeJS & NPM
------------
To install via npm:

```
npm install --save jstat
```

When loading under Node be sure to reference the child object.

```
var { jStat } = require('jstat').
```

RequireJS Shim
--------------

For RequireJS not only `exports` but also `init` function must be specified.
```
requirejs.config({
  paths: {
    'jstat': 'path/to/jstat/dist/jstat.min'
  },
  shim: {
    jstat: {
      exports: ['j$', 'jStat'],
      init: function () {
        return {
          j$: j$,
          jStat: jStat
        };
      }
    }
  }
});
```

Build Prerequisites
-------------------

In order to build jStat, you need to have GNU make 3.8 or later, Node.js 0.2 or
later, and git 1.7 or later.  (Earlier versions might work OK, but are not
tested.)

Windows users have two options:

1. Install [msysgit](https://code.google.com/p/msysgit/) (Full installer for official Git),
   [GNU make for Windows](http://gnuwin32.sourceforge.net/packages/make.htm), and a
   [binary version of Node.js](http://node-js.prcn.co.cc/). Make sure all three packages are installed to the same
   location (by default, this is C:\Program Files\Git).
2. Install [Cygwin](http://cygwin.com/) (make sure you install the git, make, and which packages), then either follow
   the [Node.js build instructions](https://github.com/ry/node/wiki/Building-node.js-on-Cygwin-%28Windows%29) or install
   the [binary version of Node.js](http://node-js.prcn.co.cc/).

Mac OS users should install Xcode (comes on your Mac OS install DVD, or downloadable from
[Apple's Xcode site](http://developer.apple.com/technologies/xcode.html)) and
[http://mxcl.github.com/homebrew/](Homebrew). Once Homebrew is installed, run `brew install git` to install git,
and `brew install node` to install Node.js.

Linux/BSD users should use their appropriate package managers to install make, git, and node, or build from source
if you swing that way.


Building jStat
--------------

First, clone a copy of the jStat git repo by running `git clone git://github.com/jstat/jstat.git`.

To download all necessary libraries run `npm install`.

Then, to get a complete, minified version of jStat and all documentation,
simply `cd` to the `jstat` directory and type `make`. If you don't have Node
installed and/or want to make a basic, uncompressed, unlinted version of jstat,
use `make jstat` instead of `make`.

The built version of jStat will be put in the `dist/` subdirectory.

Generate just the documentation by running `make doc`. Documentation will be
placed in `dist/docs` by default.

To remove all built files, run `make clean`.


Running Tests
-------------

Execute all tests by running `make test`.

Or if you wish to run a specific test, `cd` to `test/<subdir>` and run `node <some_test>-test.js`.


Get the Code
------------

Both the minified and unminified source are located in the `dist/` directory.
For those who don't want to build it themselves.


Contribute
----------

jStat is now going to follow most of the v8
[JavaScript](https://google.github.io/styleguide/jsguide.html)
guidelines. There will be plenty of source that uses the old style, but we're
going to work away from that.

Also, we'll be going through and reimplementing a good portion of the code to
run faster. Hopefully it won't take too long to get the project on one basic
standard.

When submitting pull requests, no need to check in `dist/*.js`. They'll be
recompiled for distribution anyway.

Join the Community
------------------

We always like discussion of how to improve jStat.
Join us at our [mailing list](http://groups.google.com/group/jstat-discuss/)
and let us know what you'd like to see.  Also come ask questions in the #jstat
channel on irc.freenode.net.
