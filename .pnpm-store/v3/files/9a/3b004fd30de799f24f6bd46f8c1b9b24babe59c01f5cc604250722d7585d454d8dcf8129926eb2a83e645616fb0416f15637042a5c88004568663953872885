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

// src/getFileGitIno.ts
var getFileGitIno_exports = {};
__export(getFileGitIno_exports, {
  getFileCreateInfo: () => getFileCreateInfo,
  getFileLastModifyInfo: () => getFileLastModifyInfo,
  isGitRepo: () => isGitRepo
});
module.exports = __toCommonJS(getFileGitIno_exports);
var import_cross_spawn = __toESM(require("../compiled/cross-spawn"));
var import_execa = require("../compiled/execa");
var promisifySpawn = (cmd, args, {
  onlyOnce,
  ...rest
}) => new Promise((resolve, reject) => {
  var _a;
  const cp = (0, import_cross_spawn.default)(cmd, args, rest);
  const error = [];
  const stdout = [];
  (_a = cp.stdout) == null ? void 0 : _a.on("data", (data) => {
    stdout.push(data.toString());
    if (onlyOnce) {
      cp.kill("SIGKILL");
    }
  });
  cp.on("error", (e) => {
    error.push(e.toString());
  });
  cp.on("close", () => {
    if (error.length) {
      reject(error.join(""));
    } else {
      resolve(stdout);
    }
  });
});
var getFileCreateInfo = async (filePath, gitDirPath) => {
  try {
    const info = await promisifySpawn(
      "git",
      // time|name|email|since
      ["log", "--reverse", "-1000000", "--pretty='%ad|%an|%ae|%ar'", filePath],
      {
        cwd: gitDirPath,
        onlyOnce: true,
        shell: true
      }
    );
    if (info.length && info[0]) {
      const firstCommit = info[0].slice(0, info[0].indexOf("\n")).split("|");
      return {
        createTime: firstCommit.at(0),
        creator: firstCommit.at(1),
        creatorEmail: firstCommit.at(2),
        createSince: firstCommit.at(3)
      };
    } else {
      return {};
    }
  } catch (err) {
    throw new Error(`get file ${filePath} git info failed`);
  }
};
var getFileLastModifyInfo = async (filePath, gitDirPath) => {
  try {
    const info = await promisifySpawn(
      "git",
      ["log", "-1", "--pretty='%ad|%an|%ae|%ar'", filePath],
      {
        cwd: gitDirPath,
        onlyOnce: true,
        shell: true
      }
    );
    if (info.length && info[0]) {
      const firstCommit = info[0].slice(0, info[0].indexOf("\n")).split("|");
      return {
        modifyTime: firstCommit.at(0),
        modifier: firstCommit.at(1),
        modifierEmail: firstCommit.at(2),
        modifySince: firstCommit.at(3)
      };
    } else {
      return {};
    }
  } catch (err) {
    throw new Error(`get file ${filePath} git info failed`);
  }
};
var isGitRepo = async () => {
  try {
    const res = await (0, import_execa.execa)("git", ["rev-parse", "--is-inside-work-tree"]);
    return res.stdout.includes("true");
  } catch (e) {
    return false;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getFileCreateInfo,
  getFileLastModifyInfo,
  isGitRepo
});
