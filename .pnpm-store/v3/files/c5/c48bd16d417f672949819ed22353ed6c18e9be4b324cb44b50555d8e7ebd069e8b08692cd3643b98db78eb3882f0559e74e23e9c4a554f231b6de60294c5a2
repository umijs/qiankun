import fs, { lstat, readFile, readJson } from 'fs-extra';
import path from 'path';
import parse from '@changesets/parse';
import { getChangedChangesetFilesSinceRef } from '@changesets/git';
import chalk from 'chalk';
import pFilter from 'p-filter';
import { warn } from '@changesets/logger';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

let importantSeparator = chalk.red("===============================IMPORTANT!===============================");
let importantEnd = chalk.red("----------------------------------------------------------------------");

async function getOldChangesets(changesetBase, dirs) {
  // this needs to support just not dealing with dirs that aren't set up properly
  let changesets = await pFilter(dirs, async (dir) => (await lstat(path.join(changesetBase, dir))).isDirectory());
  const changesetContents = changesets.map(async changesetDir => {
    const jsonPath = path.join(changesetBase, changesetDir, "changes.json");
    const [summary, json] = await Promise.all([readFile(path.join(changesetBase, changesetDir, "changes.md"), "utf-8"), readJson(jsonPath)]);
    return {
      releases: json.releases,
      summary,
      id: changesetDir
    };
  });
  return Promise.all(changesetContents);
} // this function only exists while we wait for v1 changesets to be obsoleted
// and should be deleted before v3


async function getOldChangesetsAndWarn(changesetBase, dirs) {
  let oldChangesets = await getOldChangesets(changesetBase, dirs);

  if (oldChangesets.length === 0) {
    return [];
  }

  warn(importantSeparator);
  warn("There were old changesets from version 1 found");
  warn("These are being applied now but the dependents graph may have changed");
  warn("Make sure you validate all your dependencies");
  warn("In a future major version, we will no longer apply these old changesets, and will instead throw here");
  warn(importantEnd);
  return oldChangesets;
}

async function filterChangesetsSinceRef(changesets, changesetBase, sinceRef) {
  const newChangesets = await getChangedChangesetFilesSinceRef({
    cwd: changesetBase,
    ref: sinceRef
  });
  const newHashes = newChangesets.map(c => c.split("/")[1]);
  return changesets.filter(dir => newHashes.includes(dir));
}

async function getChangesets(cwd, sinceRef) {
  let changesetBase = path.join(cwd, ".changeset");
  let contents;

  try {
    contents = await fs.readdir(changesetBase);
  } catch (err) {
    if (err.code === "ENOENT") {
      throw new Error("There is no .changeset directory in this project");
    }

    throw err;
  }

  if (sinceRef !== undefined) {
    contents = await filterChangesetsSinceRef(contents, changesetBase, sinceRef);
  }

  let oldChangesetsPromise = getOldChangesetsAndWarn(changesetBase, contents);
  let changesets = contents.filter(file => !file.startsWith(".") && file.endsWith(".md") && file !== "README.md");
  const changesetContents = changesets.map(async file => {
    const changeset = await fs.readFile(path.join(changesetBase, file), "utf-8");
    return _objectSpread2(_objectSpread2({}, parse(changeset)), {}, {
      id: file.replace(".md", "")
    });
  });
  return [...(await oldChangesetsPromise), ...(await Promise.all(changesetContents))];
}

export default getChangesets;
