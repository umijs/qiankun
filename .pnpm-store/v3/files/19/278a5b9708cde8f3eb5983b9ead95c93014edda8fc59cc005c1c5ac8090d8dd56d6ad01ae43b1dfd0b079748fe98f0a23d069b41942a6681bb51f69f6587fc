"use strict";

var test = require("tape");
var getLength = require("./index");
var browserGetLength = require("./browser");

function repeat(string, times) {
  return new Array(times + 1).join(string);
}

// Test writing files to the fs
//

try {
  var blns = require("./vendor/big-list-of-naughty-strings/blns.json");
}
catch (err) {
  console.error("Error: Cannot load file './vendor/big-list-of-naughty-strings/blns.json'");
  console.error();
  console.error("Make sure you've initialized git submodules by running");
  console.error();
  console.error("    git submodule update --init");
  console.error();
  process.exit(1);
}


// 8-byte, 4-character string
var THUMB = "👍🏽";

// Tests run against both implementations
[getLength, browserGetLength].forEach(function(getLength) {
  // Strings with known lengths
  [
    ["", 0],
    ["a", 1],
    ["☃", 3],
    ["a☃", 4],
    [repeat("a", 250) + '\uD800\uDC00', 254],
    [repeat("a", 251) + '\uD800\uDC00', 255],
    [repeat("a", 252) + '\uD800\uDC00', 256],
    [THUMB, 8],
    [THUMB[0], 3],
    [THUMB[1], 3],
    [THUMB[2], 3],
    [THUMB[3], 3],
    [THUMB.slice(0, 2), 4],
    [THUMB.slice(2, 4), 4],
    [THUMB.slice(1, 3), 6],
  ].forEach(function(desc) {
    var string = desc[0];
    var length = desc[1];
    test(JSON.stringify(string) + "=" + length, function(t) {
      t.equal(getLength(string), length);
      t.end();
    });
  });

  // Make sure result matches Buffer.byteLength for various strings
  blns.forEach(function(str) {
    test(JSON.stringify(str), function(t) {
      t.equal(getLength(str), Buffer.byteLength(str));
      t.end();
    });
  });
});

