"use strict";

module.exports = function getByteLength(string) {
  if (typeof string !== "string") {
    throw new Error("Input must be string");
  }
  return Buffer.byteLength(string, "utf8");
};
