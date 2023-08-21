/*!
 * parse-git-config <https://github.com/jonschlinkert/parse-git-config>
 *
 * Copyright (c) 2015 Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var ini = require('ini');

/**
 * Expose `config`
 */

module.exports = git;

function git(cwd, cb) {
  if (typeof cwd === 'function') {
    cb = cwd; cwd = null;
  }

  if (typeof cb !== 'function') {
    throw new TypeError('parse-git-config async expects a callback function.');
  }

  read(resolve(cwd), function (err, buffer) {
    if (err) {
      cb(err);
      return;
    }
    cb(null, ini.parse(buffer.toString()));
  });
}

git.sync = function configSync(cwd) {
  var fp = resolve(cwd);
  if (!fs.existsSync(fp)) {
    return null;
  }
  return ini.parse(fs.readFileSync(fp, 'utf8'));
};

function read(fp, cb) {
  try {
    fs.readFile(fp, function (err, config) {
      if (err) {
        return cb(err);
      }
      cb(null, config);
    });
  } catch (err) {
    cb(err);
  }
}

function resolve(cwd) {
  return path.join(cwd || process.cwd(), '.git/config');
}
