// @ts-check

/* eslint no-use-before-define:0 */
'use strict'; // Import

var pathUtil = require('path');

var textExtensions = require('textextensions');

var binaryExtensions = require('binaryextensions');
/**
 * WIll be `null` if `buffer` was not provided. Otherwise will be either `'utf8'` or `'binary'`.
 * @typedef {'utf8'|'binary'|null} EncodingResult
 */

/**
 * WIll be `null` if neither `filename` nor `buffer` were provided. Otherwise will be a boolean value with the detection result.
 * @typedef {boolean|null} TextOrBinaryResult
 */

/**
 * @typedef {Object} EncodingOpts
 * @property {number} [chunkLength = 24]
 * @property {number} [chunkBegin = 0]
 */

/**
 * @callback IsTextCallback
 * @param {Error?} error
 * @param {TextOrBinaryResult} [isTextResult]
 */

/**
 * @callback IsBinaryCallback
 * @param {Error?} error
 * @param {TextOrBinaryResult} [isBinaryResult]
 */

/**
 * @callback GetEncodingCallback
 * @param {Error?} error
 * @param {EncodingResult} [encoding]
 */

/**
 * Determine if the filename and/or buffer is text.
 * Determined by extension checks first (if filename is available), otherwise if unknown extension or no filename, will perform a slower buffer encoding detection.
 * This order is done, as extension checks are quicker, and also because encoding checks cannot guarantee accuracy for chars between utf8 and utf16.
 * The extension checks are performed using the resources https://github.com/bevry/textextensions and https://github.com/bevry/binaryextensions
 * In a later major release, this function will become {@link isText} so you should use that instead.
 * @param {string} [filename] The filename for the file/buffer if available
 * @param {Buffer} [buffer] The buffer for the file if available
 * @returns {TextOrBinaryResult}
 */


function isTextSync(filename, buffer) {
  // Test extensions
  if (filename) {
    // Extract filename
    var parts = pathUtil.basename(filename).split('.').reverse(); // Cycle extensions

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = parts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var extension = _step.value;

        if (textExtensions.indexOf(extension) !== -1) {
          return true;
        }

        if (binaryExtensions.indexOf(extension) !== -1) {
          return false;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  } // Fallback to encoding if extension check was not enough


  if (buffer) {
    return getEncodingSync(buffer) === 'utf8';
  } // No buffer was provided


  return null;
}
/**
 * Callback wrapper for {@link isTextSync}.
 * @param {string?} filename
 * @param {Buffer?} buffer
 * @param {IsTextCallback} callback
 * @returns {void}
 */


function isTextCallback(filename, buffer, callback) {
  var result;

  try {
    result = isTextSync(filename, buffer);
  } catch (err) {
    callback(err);
  }

  callback(null, result);
}
/**
 * Promise wrapper for {@link isTextSync}.
 * @param {string?} filename
 * @param {Buffer?} buffer
 * @returns {Promise<TextOrBinaryResult>}
 */


function isTextPromise(filename, buffer) {
  try {
    return Promise.resolve(isTextSync(filename, buffer));
  } catch (err) {
    return Promise.reject(err);
  }
}
/**
 * Wrapper around {@link isTextSync} for sync signature and {@link isTextCallback} async signature.
 * In a later major release, {@link isTextSync}.will become this function, so if you prefer the callback interface you should use {@link isTextCallback}.
 * @param {string?} filename
 * @param {Buffer?} buffer
 * @param {IsTextCallback} [callback] If provided, void will be returned, as the result will provided to the callback.
 * @returns {TextOrBinaryResult|void} If no callback was provided, then the result is returned.
 */


function isText(filename, buffer, callback) {
  if (callback) {
    return isTextCallback(filename, buffer, callback);
  } else return isTextSync(filename, buffer);
}
/**
 * Inverse wrapper for {@link isTextSync}.
 * In a later major release, this function will become {@link isBinary} so you should use that instead.
 * @param {string} [filename]
 * @param {Buffer} [buffer]
 * @returns {TextOrBinaryResult}
 */


function isBinarySync(filename, buffer) {
  var text = isTextSync(filename, buffer);
  if (text == null) return null;
  return !text;
}
/**
 * Callback wrapper for {@link isBinarySync}.
 * @param {string?} filename
 * @param {Buffer?} buffer
 * @param {IsTextCallback} callback
 * @returns {void}
 */


function isBinaryCallback(filename, buffer, callback) {
  var result;

  try {
    result = isBinarySync(filename, buffer);
  } catch (err) {
    callback(err);
  }

  callback(null, result);
}
/**
 * Promise wrapper for {@link isBinarySync}.
 * @param {string?} filename
 * @param {Buffer?} buffer
 * @returns {Promise<TextOrBinaryResult>}
 */


function isBinaryPromise(filename, buffer) {
  try {
    return Promise.resolve(isBinarySync(filename, buffer));
  } catch (err) {
    return Promise.reject(err);
  }
}
/**
 * Wrapper around {@link isBinarySync} for sync signature and {@link isBinaryCallback} async signature.
 * In a later major release, {@link isBinarySync}.will become this function, so if you prefer the callback interface you should use {@link isBinaryCallback}.
 * @param {string?} filename
 * @param {Buffer?} buffer
 * @param {IsTextCallback} [callback] If provided, void will be returned, as the result will provided to the callback.
 * @returns {TextOrBinaryResult|void} If no callback was provided, then the result is returned.
 */


function isBinary(filename, buffer, callback) {
  if (callback) {
    return isBinaryCallback(filename, buffer, callback);
  } else return isBinarySync(filename, buffer);
}
/**
 * Get the encoding of a buffer.
 * Checks the start, middle, and end of the buffer for characters that are unrecognized within UTF8 encoding.
 * History has shown that inspection at all three locations is necessary.
 * In a later major release, this function will become {@link getEncoding} so you should use that instead.
 * @param {Buffer} buffer
 * @param {EncodingOpts} [opts]
 * @returns {EncodingResult}
 */


function getEncodingSync(buffer, opts) {
  // Check
  if (!buffer) return null; // Prepare

  var textEncoding = 'utf8';
  var binaryEncoding = 'binary'; // Discover

  if (opts == null) {
    // Start
    var chunkLength = 24;
    var encoding = getEncodingSync(buffer, {
      chunkLength: chunkLength
    });

    if (encoding === textEncoding) {
      // Middle
      var chunkBegin = Math.max(0, Math.floor(buffer.length / 2) - chunkLength);
      encoding = getEncodingSync(buffer, {
        chunkLength: chunkLength,
        chunkBegin: chunkBegin
      });

      if (encoding === textEncoding) {
        // End
        chunkBegin = Math.max(0, buffer.length - chunkLength);
        encoding = getEncodingSync(buffer, {
          chunkLength: chunkLength,
          chunkBegin: chunkBegin
        });
      }
    } // Return


    return encoding;
  } else {
    // Extract
    var _opts$chunkLength = opts.chunkLength,
        _chunkLength = _opts$chunkLength === void 0 ? 24 : _opts$chunkLength,
        _opts$chunkBegin = opts.chunkBegin,
        _chunkBegin = _opts$chunkBegin === void 0 ? 0 : _opts$chunkBegin;

    var chunkEnd = Math.min(buffer.length, _chunkBegin + _chunkLength);
    var contentChunkUTF8 = buffer.toString(textEncoding, _chunkBegin, chunkEnd); // Detect encoding

    for (var i = 0; i < contentChunkUTF8.length; ++i) {
      var charCode = contentChunkUTF8.charCodeAt(i);

      if (charCode === 65533 || charCode <= 8) {
        // 8 and below are control characters (e.g. backspace, null, eof, etc.)
        // 65533 is the unknown character
        // console.log(charCode, contentChunkUTF8[i])
        return binaryEncoding;
      }
    } // Return


    return textEncoding;
  }
}
/**
 * Get the encoding of a buffer.
 * Uses {@link getEncodingSync} behind the scenes.
 * @param {Buffer} buffer
 * @param {EncodingOpts} [opts]
 * @param {GetEncodingCallback} callback
 * @returns {void}
 */


function getEncodingCallback(buffer, opts, callback) {
  if (typeof opts === 'function' && callback == null) return getEncodingCallback(buffer, null, opts);
  /** @type {EncodingResult?} */

  var result;

  try {
    result = getEncodingSync(buffer, opts);
  } catch (err) {
    callback(err);
  }

  callback(null, result);
}
/**
 * Promise wrapper for {@link getEncodingSync}.
 * @param {Buffer} buffer
 * @param {EncodingOpts} [opts]
 * @returns {Promise<EncodingResult>}
 */


function getEncodingPromise(buffer, opts) {
  try {
    return Promise.resolve(getEncodingSync(buffer, opts));
  } catch (err) {
    return Promise.reject(err);
  }
}
/**
 * Wrapper around {@link getEncodingSync} for sync signature and {@link getEncodingCallback} async signature.
 * In a later major release, {@link getEncodingSync}.will become this function, so if you prefer the callback interface you should use {@link getEncodingCallback}.
 * @param {Buffer} buffer
 * @param {EncodingOpts} [opts]
 * @param {GetEncodingCallback} [callback] If provided, void will be returned, as the result will provided to the callback.
 * @returns {EncodingResult|void} If no callback was provided, then the result is returned.
 */


function getEncoding(buffer, opts, callback) {
  if (callback || typeof opts === 'function') {
    return getEncodingCallback(buffer, opts, callback);
  } else return getEncodingSync(buffer, opts);
} // Export


module.exports = {
  isTextSync: isTextSync,
  isTextCallback: isTextCallback,
  isTextPromise: isTextPromise,
  isText: isText,
  isBinarySync: isBinarySync,
  isBinaryCallback: isBinaryCallback,
  isBinaryPromise: isBinaryPromise,
  isBinary: isBinary,
  getEncoding: getEncoding,
  getEncodingSync: getEncodingSync,
  getEncodingPromise: getEncodingPromise,
  getEncodingCallback: getEncodingCallback
};