"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const queue_1 = require("queue");
const types_1 = require("./types");
const detector_1 = require("./detector");
require("./fs.promises");
// Maximum buffer size, with a default of 512 kilobytes.
// TO-DO: make this adaptive based on the initial signature of the image
const MaxBufferSize = 512 * 1024;
// This queue is for async `fs` operations, to avoid reaching file-descriptor limits
const queue = new queue_1.default({ concurrency: 100, autostart: true });
/**
 * Return size information based on a buffer
 *
 * @param {Buffer} buffer
 * @param {String} filepath
 * @returns {Object}
 */
function lookup(buffer, filepath) {
    // detect the file type.. don't rely on the extension
    const type = detector_1.detector(buffer);
    // find an appropriate handler for this file type
    if (type && type in types_1.typeHandlers) {
        const size = types_1.typeHandlers[type].calculate(buffer, filepath);
        if (size !== undefined) {
            size.type = type;
            return size;
        }
    }
    // throw up, if we don't understand the file
    throw new TypeError('unsupported file type: ' + type + ' (file: ' + filepath + ')');
}
/**
 * Reads a file into a buffer.
 * @param {String} filepath
 * @returns {Promise<Buffer>}
 */
function asyncFileToBuffer(filepath) {
    return __awaiter(this, void 0, void 0, function* () {
        const handle = yield fs.promises.open(filepath, 'r');
        const { size } = yield handle.stat();
        if (size <= 0) {
            throw new Error('Empty file');
        }
        const bufferSize = Math.min(size, MaxBufferSize);
        const buffer = Buffer.alloc(bufferSize);
        yield handle.read(buffer, 0, bufferSize, 0);
        yield handle.close();
        return buffer;
    });
}
/**
 * Synchronously reads a file into a buffer, blocking the nodejs process.
 *
 * @param {String} filepath
 * @returns {Buffer}
 */
function syncFileToBuffer(filepath) {
    // read from the file, synchronously
    const descriptor = fs.openSync(filepath, 'r');
    const size = fs.fstatSync(descriptor).size;
    const bufferSize = Math.min(size, MaxBufferSize);
    const buffer = Buffer.alloc(bufferSize);
    fs.readSync(descriptor, buffer, 0, bufferSize, 0);
    fs.closeSync(descriptor);
    return buffer;
}
module.exports = exports = imageSize; // backwards compatibility
/**
 * @param {Buffer|string} input - buffer or relative/absolute path of the image file
 * @param {Function=} [callback] - optional function for async detection
 */
function imageSize(input, callback) {
    // Handle buffer input
    if (Buffer.isBuffer(input)) {
        return lookup(input);
    }
    // input should be a string at this point
    if (typeof input !== 'string') {
        throw new TypeError('invalid invocation');
    }
    // resolve the file path
    const filepath = path.resolve(input);
    if (typeof callback === 'function') {
        queue.push(() => asyncFileToBuffer(filepath)
            .then((buffer) => process.nextTick(callback, null, lookup(buffer, filepath)))
            .catch(callback));
    }
    else {
        const buffer = syncFileToBuffer(filepath);
        return lookup(buffer, filepath);
    }
}
exports.imageSize = imageSize;
exports.setConcurrency = (c) => { queue.concurrency = c; };
exports.types = Object.keys(types_1.typeHandlers);
