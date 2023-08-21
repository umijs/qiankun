'use strict';

var url = require('url');
var path = require('path');
var utils = require('./utils');

module.exports = function(cwd, cb) {
  if (typeof cwd === 'function') {
    cb = cwd;
    cwd = '.';
  }

  var gitPath = path.resolve(utils.cwd(cwd), '.git/config');

  utils.origin(gitPath, function(err, giturl) {
    if (err) {
      cb(err);
      return;
    }

    if(!giturl) {
      cb(new Error('cannot find ".git/config"'));
      return;
    }

    var parsed = url.parse(giturl);
    var segments = parsed.pathname.split(path.sep);
    cb(null, utils.filename(segments.pop()));
  });
};

module.exports.sync = function(cwd) {
  var gitPath = path.resolve(utils.cwd(cwd), '.git/config');
  var giturl = utils.origin.sync(gitPath);
  if (!giturl) {
    throw new Error('cannot find ".git/config"');
  }
  var parsed = url.parse(giturl);
  var segments = parsed.pathname.split(path.sep);
  return utils.filename(segments.pop());
};
