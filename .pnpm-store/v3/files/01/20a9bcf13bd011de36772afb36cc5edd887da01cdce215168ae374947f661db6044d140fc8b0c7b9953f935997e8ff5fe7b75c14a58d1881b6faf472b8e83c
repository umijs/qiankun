# Wicked Good XPath

[![Build Status](https://travis-ci.org/Dominator008/wicked-good-xpath.svg?branch=master)](https://travis-ci.org/Dominator008/wicked-good-xpath) [![npm version](https://badge.fury.io/js/wicked-good-xpath.svg)](https://badge.fury.io/js/wicked-good-xpath)

## About
Wicked Good XPath is a Google-authored pure JavaScript implementation of the <a href="http://www.w3.org/TR/DOM-Level-3-XPath/">DOM Level 3 XPath specification</a>. It enables XPath evaluation for HTML documents in every browser. We believe it to be the fastest XPath implementation available in JavaScript.

## Instructions
Download the latest <a href="https://github.com/google/wicked-good-xpath/releases/latest">wgxpath.install.js</a> file and include it on your webpage with a script tag. For example:
```html
<script src="wgxpath.install.js"></script>
```
Then call `wgxpath.install()` from your JavaScript code, which will ensure <a href="http://www.w3.org/TR/DOM-Level-3-XPath/xpath.html#XPathEvaluator-evaluate">`document.evaluate`</a>, the XPath evaluation function, is defined on the window object. To install the library on a different window, pass that window as an argument to the install function.

We provide an NPM package at https://www.npmjs.com/package/wicked-good-xpath.
There's also another NPM package at https://www.npmjs.com/package/wgxpath.

## Building it Yourself
We use Gulp:
```
npm install
gulp
```
You can also run `src/compile.sh` if you want to use different versions of
Closure Compiler / Closure Library.

## History
Wicked Good XPath started as a <a href="https://developers.google.com/closure/">Google Closure</a> port of the <a href="http://coderepos.org/share/wiki/JavaScript-XPath">JavaScript-XPath</a> project by Cybozu Labs. At the time, JavaScript-XPath was the fastest JavaScript implementation of XPath available --- a whopping 10 times faster than Google's own AJAXSLT --- which made it a popular choice, notable for frontend web testing tools like <a href="http://docs.seleniumhq.org/">Selenium</a> and <a href="https://github.com/google/puppeteer">Web Puppeteer</a>.

While it was fast, the code fell out of maintenance (last update was in 2007) so bugs were tough to get fixed. Also, since it wasn't written in Google Closure, it was tricky for us Googlers to integrate into our JavaScript applications. A rewrite was necessary.

However, we went beyond merely porting the library to Google Closure and fixing a couple bugs. We identified some significant additional performance improvements, such that our version runs about 30% faster than the original. On top of that, the Closure compiler was able to minify our code down to a mere 25K, 40% smaller than JavaScript-XPath's 42K (though it has grown a bit since). Finally, the code is structured and documented in a way that we believe will make future maintenance quicker and easier.
