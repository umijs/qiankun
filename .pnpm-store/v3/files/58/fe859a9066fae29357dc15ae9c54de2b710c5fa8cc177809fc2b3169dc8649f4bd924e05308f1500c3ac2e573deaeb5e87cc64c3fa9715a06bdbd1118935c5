/* @flow */
"use strict";

const path = require("path");
const pify = require("pify");
const stripAnsi = require("strip-ansi");
const writeFileAtomic /*: Function*/ = require("./vendor/writeFileAtomic");

module.exports = (content /*: string*/, filePath /*: string*/) =>
  pify(writeFileAtomic)(path.normalize(filePath), stripAnsi(content));
