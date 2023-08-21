/*!
 * git-username <https://github.com/jonschlinkert/git-username>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

var url = require('url');
var origin = require('remote-origin-url');

/**
 * Get the username from the GitHub remote origin URL
 */

module.exports = function username(cwd, verbose) {
  var repo = origin.sync(cwd);
  if (!repo && verbose) {
    console.error('  Can\'t calculate git-username, which probably means that\n  a git remote origin has not been defined.');
  }

  if (!repo) {
    return null;
  }

  var o = url.parse(repo);
  var path = o.path;

  if (path.length && path.charAt(0) === '/') {
    path = path.slice(1);
  } else {
    var match = /^git@[^:\s]+:(\S+)\//.exec(path);
    if (match && match[1]) {
      path = match[1];
    }
  }

  path = path.split('/')[0];
  return path;
}
