"use strict";

class NoFilesFoundError extends Error {
  constructor(fileList) {
    super();

    if (typeof fileList === "string") {
      fileList = [fileList];
    }

    const pattern = fileList.filter(i => !i.startsWith("!")).join(", ");

    this.message = `No files matching the pattern "${pattern}" were found.`;
  }
}

module.exports = NoFilesFoundError;
