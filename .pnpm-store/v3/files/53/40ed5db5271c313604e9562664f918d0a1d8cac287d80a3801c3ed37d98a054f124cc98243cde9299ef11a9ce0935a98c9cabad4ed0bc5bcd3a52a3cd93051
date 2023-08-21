"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.maybeAddRelativeLocalPrefix = exports.isBaseDir = exports.isURL = void 0;
const url_1 = __importDefault(require("url"));
const path_1 = __importDefault(require("path"));
/* ****************************************************************************************************************** *
 * General Utilities & Helpers
 * ****************************************************************************************************************** */
const isURL = (s) => !!s && (!!url_1.default.parse(s).host || !!url_1.default.parse(s).hostname);
exports.isURL = isURL;
const isBaseDir = (baseDir, testDir) => {
    const relative = path_1.default.relative(baseDir, testDir);
    return relative ? !relative.startsWith("..") && !path_1.default.isAbsolute(relative) : true;
};
exports.isBaseDir = isBaseDir;
const maybeAddRelativeLocalPrefix = (p) => (p[0] === "." ? p : `./${p}`);
exports.maybeAddRelativeLocalPrefix = maybeAddRelativeLocalPrefix;
//# sourceMappingURL=general-utils.js.map