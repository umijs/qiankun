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
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/getDevBanner.ts
var getDevBanner_exports = {};
__export(getDevBanner_exports, {
  getDevBanner: () => getDevBanner
});
module.exports = __toCommonJS(getDevBanner_exports);
var import_address = __toESM(require("../compiled/address"));
var import_chalk = __toESM(require("../compiled/chalk"));
var import_strip_ansi = __toESM(require("../compiled/strip-ansi"));
var BORDERS = {
  TL: import_chalk.default.gray.dim("╔"),
  TR: import_chalk.default.gray.dim("╗"),
  BL: import_chalk.default.gray.dim("╚"),
  BR: import_chalk.default.gray.dim("╝"),
  V: import_chalk.default.gray.dim("║"),
  H_PURE: "═"
};
function getDevBanner(protocol, host = "0.0.0.0", port, offset = 8) {
  const header = " App listening at:";
  const footer = import_chalk.default.bold(
    " Now you can open browser with the above addresses↑ "
  );
  const local = `  ${import_chalk.default.gray(">")}   Local: ${import_chalk.default.green(
    `${protocol}//${host === "0.0.0.0" ? "localhost" : host}:${port}`
  )} `;
  const ip = import_address.default.ip();
  const network = `  ${import_chalk.default.gray(">")} Network: ${ip ? import_chalk.default.green(`${protocol}//${ip}:${port}`) : import_chalk.default.gray("Not available")} `;
  const maxLen = Math.max(
    ...[header, footer, local, network].map((x) => (0, import_strip_ansi.default)(x).length)
  );
  const beforeLines = [
    `${BORDERS.TL}${import_chalk.default.gray.dim("".padStart(maxLen, BORDERS.H_PURE))}${BORDERS.TR}`,
    `${BORDERS.V}${header}${"".padStart(maxLen - header.length)}${BORDERS.V}`,
    `${BORDERS.V}${local}${"".padStart(maxLen - (0, import_strip_ansi.default)(local).length)}${BORDERS.V}`
  ];
  const mainLine = `${BORDERS.V}${network}${"".padStart(
    maxLen - (0, import_strip_ansi.default)(network).length
  )}${BORDERS.V}`;
  const afterLines = [
    `${BORDERS.V}${"".padStart(maxLen)}${BORDERS.V}`,
    `${BORDERS.V}${footer}${"".padStart(maxLen - (0, import_strip_ansi.default)(footer).length)}${BORDERS.V}`,
    `${BORDERS.BL}${import_chalk.default.gray.dim("".padStart(maxLen, BORDERS.H_PURE))}${BORDERS.BR}`
  ];
  return {
    before: beforeLines.map((l) => l.padStart(l.length + offset)).join("\n"),
    main: mainLine,
    after: afterLines.map((l) => l.padStart(l.length + offset)).join("\n")
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getDevBanner
});
