/* @flow */
"use strict";

const micromatch = require("micromatch");
const path = require("path");
const slash = require("slash");

// To find out if a path is ignored, we need to load the config,
// which may have an ignoreFiles property. We then check the path
// against these.
module.exports = function(
  stylelint /*: stylelint$internalApi*/,
  filePathArg /*:: ?: string*/
) /*: Promise<boolean>*/ {
  const filePath = filePathArg; // to please Flow

  if (!filePath) {
    return Promise.resolve(false);
  }

  return stylelint.getConfigForFile(filePath).then(result => {
    // Glob patterns for micromatch should be in POSIX-style
    const ignoreFiles = (result.config.ignoreFiles || []).map(slash);

    const absoluteFilePath = path.isAbsolute(filePath)
      ? filePath
      : path.resolve(process.cwd(), filePath);

    if (micromatch(absoluteFilePath, ignoreFiles).length) {
      return true;
    }

    return false;
  });
};
