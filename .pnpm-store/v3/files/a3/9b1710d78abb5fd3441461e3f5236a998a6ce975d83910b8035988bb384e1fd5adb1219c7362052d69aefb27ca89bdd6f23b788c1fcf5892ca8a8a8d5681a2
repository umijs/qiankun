var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/utils/formatWebpackMessages.ts
var formatWebpackMessages_exports = {};
__export(formatWebpackMessages_exports, {
  formatMessage: () => formatMessage,
  formatWebpackMessages: () => formatWebpackMessages
});
module.exports = __toCommonJS(formatWebpackMessages_exports);
var import_strip_ansi = __toESM(require("@umijs/utils/compiled/strip-ansi"));
var friendlySyntaxErrorLabel = "Syntax error:";
function isLikelyASyntaxError(message) {
  return (0, import_strip_ansi.default)(message).indexOf(friendlySyntaxErrorLabel) !== -1;
}
function formatMessage(message) {
  let lines = [];
  if (typeof message === "string") {
    lines = message.split("\n");
  } else if ("message" in message) {
    lines = message["message"].split("\n");
  } else if (Array.isArray(message)) {
    message.forEach((message2) => {
      if ("message" in message2) {
        lines = message2["message"].split("\n");
      }
    });
  }
  lines = lines.filter((line) => !/Module [A-z ]+\(from/.test(line));
  lines = lines.map((line) => {
    const parsingError = /Line (\d+):(?:(\d+):)?\s*Parsing error: (.+)$/.exec(
      line
    );
    if (!parsingError) {
      return line;
    }
    const [, errorLine, errorColumn, errorMessage] = parsingError;
    return `${friendlySyntaxErrorLabel} ${errorMessage} (${errorLine}:${errorColumn})`;
  });
  message = lines.join("\n");
  message = message.replace(
    /SyntaxError\s+\((\d+):(\d+)\)\s*(.+?)\n/g,
    `${friendlySyntaxErrorLabel} $3 ($1:$2)
`
  );
  message = message.replace(
    /^.*export '(.+?)' was not found in '(.+?)'.*$/gm,
    `Attempted import error: '$1' is not exported from '$2'.`
  );
  message = message.replace(
    /^.*export 'default' \(imported as '(.+?)'\) was not found in '(.+?)'.*$/gm,
    `Attempted import error: '$2' does not contain a default export (imported as '$1').`
  );
  message = message.replace(
    /^.*export '(.+?)' \(imported as '(.+?)'\) was not found in '(.+?)'.*$/gm,
    `Attempted import error: '$1' is not exported from '$3' (imported as '$2').`
  );
  lines = message.split("\n");
  if (lines.length > 2 && lines[1].trim() === "") {
    lines.splice(1, 1);
  }
  lines[0] = lines[0].replace(/^(.*) \d+:\d+-\d+$/, "$1");
  if (lines[1] && lines[1].indexOf("Module not found: ") === 0) {
    lines = [
      lines[0],
      lines[1].replace("Error: ", "").replace("Module not found: Cannot find file:", "Cannot find file:")
    ];
  }
  if (lines[1] && lines[1].match(/Cannot find module.+sass/)) {
    lines[1] = "To import Sass files, you first need to install sass.\n";
    lines[1] += "Run `npm install sass` or `yarn add sass` inside your workspace.";
  }
  message = lines.join("\n");
  message = message.replace(
    /^\s*at\s((?!webpack:).)*:\d+:\d+[\s)]*(\n|$)/gm,
    ""
  );
  message = message.replace(/^\s*at\s<anonymous>(\n|$)/gm, "");
  lines = message.split("\n");
  lines = lines.filter(
    (line, index, arr) => index === 0 || line.trim() !== "" || line.trim() !== arr[index - 1].trim()
  );
  message = lines.join("\n");
  return message.trim();
}
function formatWebpackMessages(json) {
  const formattedErrors = json.errors.map(function(message) {
    return formatMessage(message);
  });
  const formattedWarnings = json.warnings.map(function(message) {
    return formatMessage(message);
  });
  const result = { errors: formattedErrors, warnings: formattedWarnings };
  if (result.errors.some(isLikelyASyntaxError)) {
    result.errors = result.errors.filter(isLikelyASyntaxError);
  }
  return result;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  formatMessage,
  formatWebpackMessages
});
