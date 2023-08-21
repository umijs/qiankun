"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const events_1 = require("events");
async function run(opts) {
    if (!opts.destination)
        throw new Error('kaboom');
    const stream = fs.createWriteStream(opts.destination, { encoding: 'utf8' });
    await (0, events_1.once)(stream, 'open');
    return stream;
}
exports.default = run;
