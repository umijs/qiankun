/*!
 * find-pkg <https://github.com/jonschlinkert/find-pkg>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

/**
 * Module dependencies
 */

var findFile = require('find-file-up');

/**
 * Find package.json, starting with the given directory.
 * Based on https://github.com/jonschlinkert/look-up
 */

module.exports = function(dir, limit, cb) {
  return findFile('package.json', dir, limit, cb);
};

/**
 * Sync
 */

module.exports.sync = function(dir, limit) {
  return findFile.sync('package.json', dir, limit);
};
