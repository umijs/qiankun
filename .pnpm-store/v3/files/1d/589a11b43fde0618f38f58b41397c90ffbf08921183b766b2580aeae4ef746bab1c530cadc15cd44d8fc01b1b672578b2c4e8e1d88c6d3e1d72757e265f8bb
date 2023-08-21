/*!
 * git-config-path <https://github.com/jonschlinkert/git-config-path>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var path = require('path');
var exists = require('fs-exists-sync');
var extend = require('extend-shallow');
var homedir = require('homedir-polyfill');

module.exports = function(type, options) {
  if (typeof type !== 'string') {
    options = type;
    type = null;
  }

  var opts = extend({cwd: process.cwd()}, options);
  type = type || opts.type;

  var configPath = path.resolve(opts.cwd, '.git/config');
  if (type === 'global') {
    configPath = path.join(homedir(), '.gitconfig');
  }

  if (!exists(configPath)) {
    if (typeof type === 'string') {
      return null;
    }
    configPath = path.join(homedir(), '.config/git/config');
  }

  return exists(configPath) ? configPath : null;
};
