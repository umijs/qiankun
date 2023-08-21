/*!
 * remote-origin-url <https://github.com/jonschlinkert/remote-origin-url>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var parse = require('parse-git-config');

/**
 * Expose `originUrl`
 */


module.exports = originUrl;

function originUrl(cwd, cb) {
  if (typeof cwd === 'function') {
    cb = cwd;
    cwd = null;
  }

  parse(cwd, function (err, parsed) {
    if (err) {
      if (err.code === 'ENOENT') {
        cb(null, null);
        return;
      }
      cb(err);
      return;
    }
    var origin = parsed['remote "origin"'];
    cb(null, origin && origin.url);
  });
}

originUrl.sync = function(cwd) {
  try {
    var parsed = parse.sync(cwd);
    if (!parsed) {
      return null;
    }

    var origin = parsed['remote "origin"'];
    return origin && origin.url;
  } catch(err) {
    throw err;
  }
};
