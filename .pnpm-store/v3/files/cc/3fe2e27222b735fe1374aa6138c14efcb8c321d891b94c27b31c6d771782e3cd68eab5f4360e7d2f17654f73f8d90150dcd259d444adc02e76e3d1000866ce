'use strict';

var fs = require('fs');
var path = require('path');

function branch(cwd, cb) {
  if (typeof cwd === 'function') {
    cb = cwd;
    cwd = process.cwd();
  }

  if (typeof cb !== 'function') {
    throw new TypeError('expected callback to be a function');
  }

  fs.readFile(gitHeadpath(cwd), function(err, buf) {
    if (err) {
      cb(err);
      return;
    }
    cb(null, parseBranches(buf));
  });
}

branch.sync = function configSync(cwd) {
  var filepath = gitHeadpath(cwd);
  if (!fs.existsSync(filepath)) {
    throw new Error('.git/HEAD does not exist');
  }
  return parseBranches(fs.readFileSync(filepath, 'utf8'));
};

function gitHeadpath(cwd) {
  return path.join(cwd || process.cwd(), '.git/HEAD');
}

function parseBranches(str) {
  var match = /ref: refs\/heads\/([^\n]+)/.exec(String(str));
  return match && match[1];
}

/**
 * Expose `branch`
 */

module.exports = branch;
