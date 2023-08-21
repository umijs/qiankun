"use strict";

var test = require("tape");
var truncate = require("./");
var browserTruncate = require("./browser");

function isHighSurrogate(codePoint) {
  return codePoint >= 0xd800 && codePoint <= 0xdbff;
}

function repeat(string, times) {
  return new Array(times + 1).join(string);
}

function assertLengths(t, string, charLength, byteLength) {
  t.equal(string.length, charLength);
  t.equal(Buffer.byteLength(string), byteLength);
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

// Run tests against both implementations
[truncate, browserTruncate].forEach(function(truncate) {
  test("strings", function(t) {
    assertLengths(t, truncate("a☃", 2), 1, 1);
    assertLengths(t, truncate(repeat("a", 250) + '\uD800\uDC00', 255), 252, 254);
    assertLengths(t, truncate(repeat("a", 251) + '\uD800\uDC00', 255), 253, 255);
    assertLengths(t, truncate(repeat("a", 252) + '\uD800\uDC00', 255), 252, 252);
    assertLengths(t, truncate(repeat("a", 253) + '\uD800\uDC00', 255), 253, 253);
    assertLengths(t, truncate(repeat("a", 254) + '\uD800\uDC00', 255), 254, 254);
    assertLengths(t, truncate(repeat("a", 255) + '\uD800\uDC00', 255), 255, 255);
    t.end();
  });

  // Truncate various strings
  [].concat(
    [
      repeat("a", 300),
      repeat("a", 252) + '\uD800\uDC00',
      repeat("a", 251) + '\uD800\uDC00',
      repeat("a", 253) + '\uD800\uDC00',
    ],
    blns
  ).forEach(function(str) {
    test(JSON.stringify(str), function(t) {
      var i = 0;
      t.equals(truncate(str, 0), "");
      // Truncate string one byte at a time
      while (true) {
        var truncated = truncate(str, i);
        t.ok(Buffer.byteLength(truncated) <= i);
        t.ok( ! isHighSurrogate(truncated[truncated.length - 1]));
        if (truncated === str) {
          break;
        }
        i += 1;
      }
      t.end();
    });
  });
});
