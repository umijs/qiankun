"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var fs = require("fs-extra"), path = require("path"), parse = require("@changesets/parse"), git = require("@changesets/git"), chalk = require("chalk"), pFilter = require("p-filter"), logger = require("@changesets/logger");

function _interopDefault(e) {
  return e && e.__esModule ? e : {
    default: e
  };
}

var fs__default = _interopDefault(fs), path__default = _interopDefault(path), parse__default = _interopDefault(parse), chalk__default = _interopDefault(chalk), pFilter__default = _interopDefault(pFilter);

function _defineProperty(obj, key, value) {
  return key in obj ? Object.defineProperty(obj, key, {
    value: value,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : obj[key] = value, obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter((function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    }))), keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach((function(key) {
      _defineProperty(target, key, source[key]);
    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach((function(key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    }));
  }
  return target;
}

let importantSeparator = chalk__default.default.red("===============================IMPORTANT!==============================="), importantEnd = chalk__default.default.red("----------------------------------------------------------------------");

async function getOldChangesets(changesetBase, dirs) {
  const changesetContents = (await pFilter__default.default(dirs, (async dir => (await fs.lstat(path__default.default.join(changesetBase, dir))).isDirectory()))).map((async changesetDir => {
    const jsonPath = path__default.default.join(changesetBase, changesetDir, "changes.json"), [summary, json] = await Promise.all([ fs.readFile(path__default.default.join(changesetBase, changesetDir, "changes.md"), "utf-8"), fs.readJson(jsonPath) ]);
    return {
      releases: json.releases,
      summary: summary,
      id: changesetDir
    };
  }));
  return Promise.all(changesetContents);
}

async function getOldChangesetsAndWarn(changesetBase, dirs) {
  let oldChangesets = await getOldChangesets(changesetBase, dirs);
  return 0 === oldChangesets.length ? [] : (logger.warn(importantSeparator), logger.warn("There were old changesets from version 1 found"), 
  logger.warn("These are being applied now but the dependents graph may have changed"), 
  logger.warn("Make sure you validate all your dependencies"), logger.warn("In a future major version, we will no longer apply these old changesets, and will instead throw here"), 
  logger.warn(importantEnd), oldChangesets);
}

async function filterChangesetsSinceRef(changesets, changesetBase, sinceRef) {
  const newHashes = (await git.getChangedChangesetFilesSinceRef({
    cwd: changesetBase,
    ref: sinceRef
  })).map((c => c.split("/")[1]));
  return changesets.filter((dir => newHashes.includes(dir)));
}

async function getChangesets(cwd, sinceRef) {
  let contents, changesetBase = path__default.default.join(cwd, ".changeset");
  try {
    contents = await fs__default.default.readdir(changesetBase);
  } catch (err) {
    if ("ENOENT" === err.code) throw new Error("There is no .changeset directory in this project");
    throw err;
  }
  void 0 !== sinceRef && (contents = await filterChangesetsSinceRef(contents, changesetBase, sinceRef));
  let oldChangesetsPromise = getOldChangesetsAndWarn(changesetBase, contents);
  const changesetContents = contents.filter((file => !file.startsWith(".") && file.endsWith(".md") && "README.md" !== file)).map((async file => {
    const changeset = await fs__default.default.readFile(path__default.default.join(changesetBase, file), "utf-8");
    return _objectSpread2(_objectSpread2({}, parse__default.default(changeset)), {}, {
      id: file.replace(".md", "")
    });
  }));
  return [ ...await oldChangesetsPromise, ...await Promise.all(changesetContents) ];
}

exports.default = getChangesets;
