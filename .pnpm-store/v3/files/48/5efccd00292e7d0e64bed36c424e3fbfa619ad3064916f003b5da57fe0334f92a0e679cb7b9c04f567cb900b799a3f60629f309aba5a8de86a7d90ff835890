"use strict";

/*
CSV Generate - sync module

Please look at the [project documentation](https://csv.js.org/generate/) for
additional information.
*/
var generate = require('.');

module.exports = function (options) {
  if (typeof options === 'string' && /\d+/.test(options)) {
    options = parseInt(options);
  }

  if (Number.isInteger(options)) {
    options = {
      length: options
    };
  }

  if (!Number.isInteger(options.length)) {
    throw Error('Invalid Argument: length is not defined');
  }

  var chunks = [];
  var work = true; // See https://nodejs.org/api/stream.html#stream_new_stream_readable_options

  options.highWaterMark = options.objectMode ? 16 : 16384;
  var generator = new generate.Generator(options);

  generator.push = function (chunk) {
    if (chunk === null) {
      return work = false;
    }

    if (options.objectMode) {
      chunks.push(chunk);
    } else {
      chunks.push(chunk);
    }
  };

  while (work) {
    generator._read(options.highWaterMark);
  }

  if (!options.objectMode) {
    return chunks.join('');
  } else {
    return chunks;
  }
};