/*!
 * remote-origin-url <https://github.com/jonschlinkert/remote-origin-url>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

var parse = require('parse-git-config');

function originUrl(path, cb) {
  if (typeof path === 'function') {
    cb = path;
    path = null;
  }

  parse({path: path}, function(err, parsed) {
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

originUrl.sync = function(path) {
  try {
    var parsed = parse.sync({path: path});
    if (!parsed) {
      return null;
    }

    var origin = parsed['remote "origin"'];
    return origin && origin.url;
  } catch (err) {
    throw err;
  }
};

/**
 * Expose `originUrl`
 */

module.exports = originUrl;
