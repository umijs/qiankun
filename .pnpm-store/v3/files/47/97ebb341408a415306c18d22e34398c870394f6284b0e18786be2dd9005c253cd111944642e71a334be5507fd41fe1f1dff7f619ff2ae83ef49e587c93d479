'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var config = require('@changesets/config');
var git = require('@changesets/git');
var resolveFrom = require('resolve-from');
var detectIndent = require('detect-indent');
var fs = require('fs-extra');
var path = require('path');
var prettier = require('prettier');
var getVersionRangeType = require('@changesets/get-version-range-type');
var Range = require('semver/classes/range');
var semverPrerelease = require('semver/functions/prerelease');
var semverSatisfies = require('semver/functions/satisfies');
var startCase = require('lodash.startcase');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var resolveFrom__default = /*#__PURE__*/_interopDefault(resolveFrom);
var detectIndent__default = /*#__PURE__*/_interopDefault(detectIndent);
var fs__default = /*#__PURE__*/_interopDefault(fs);
var path__default = /*#__PURE__*/_interopDefault(path);
var prettier__default = /*#__PURE__*/_interopDefault(prettier);
var getVersionRangeType__default = /*#__PURE__*/_interopDefault(getVersionRangeType);
var Range__default = /*#__PURE__*/_interopDefault(Range);
var semverPrerelease__default = /*#__PURE__*/_interopDefault(semverPrerelease);
var semverSatisfies__default = /*#__PURE__*/_interopDefault(semverSatisfies);
var startCase__default = /*#__PURE__*/_interopDefault(startCase);

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

/**
 * Shared utility functions and business logic
 */
const bumpTypes = ["none", "patch", "minor", "major"];
/* Converts a bump type into a numeric level to indicate order */

function getBumpLevel(type) {
  const level = bumpTypes.indexOf(type);

  if (level < 0) {
    throw new Error(`Unrecognised bump type ${type}`);
  }

  return level;
}

function shouldUpdateDependencyBasedOnConfig(release, {
  depVersionRange,
  depType
}, {
  minReleaseType,
  onlyUpdatePeerDependentsWhenOutOfRange
}) {
  if (!semverSatisfies__default['default'](release.version, depVersionRange)) {
    // Dependencies leaving semver range should always be updated
    return true;
  }

  const minLevel = getBumpLevel(minReleaseType);
  let shouldUpdate = getBumpLevel(release.type) >= minLevel;

  if (depType === "peerDependencies") {
    shouldUpdate = !onlyUpdatePeerDependentsWhenOutOfRange;
  }

  return shouldUpdate;
}

const DEPENDENCY_TYPES = ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"];
function versionPackage(release, versionsToUpdate, {
  updateInternalDependencies,
  onlyUpdatePeerDependentsWhenOutOfRange,
  bumpVersionsWithWorkspaceProtocolOnly,
  snapshot
}) {
  let {
    newVersion,
    packageJson
  } = release;
  packageJson.version = newVersion;

  for (let depType of DEPENDENCY_TYPES) {
    let deps = packageJson[depType];

    if (deps) {
      for (let {
        name,
        version,
        type
      } of versionsToUpdate) {
        let depCurrentVersion = deps[name];

        if (!depCurrentVersion || depCurrentVersion.startsWith("file:") || depCurrentVersion.startsWith("link:") || !shouldUpdateDependencyBasedOnConfig({
          version,
          type
        }, {
          depVersionRange: depCurrentVersion,
          depType
        }, {
          minReleaseType: updateInternalDependencies,
          onlyUpdatePeerDependentsWhenOutOfRange
        })) {
          continue;
        }

        const usesWorkspaceRange = depCurrentVersion.startsWith("workspace:");

        if (!usesWorkspaceRange && bumpVersionsWithWorkspaceProtocolOnly === true) {
          continue;
        }

        if (usesWorkspaceRange) {
          const workspaceDepVersion = depCurrentVersion.replace(/^workspace:/, "");

          if (workspaceDepVersion === "*" || workspaceDepVersion === "^" || workspaceDepVersion === "~") {
            continue;
          }

          depCurrentVersion = workspaceDepVersion;
        }

        if ( // an empty string is the normalised version of x/X/*
        // we don't want to change these versions because they will match
        // any version and if someone makes the range that
        // they probably want it to stay like that...
        new Range__default['default'](depCurrentVersion).range !== "" || // ...unless the current version of a dependency is a prerelease (which doesn't satisfy x/X/*)
        // leaving those as is would leave the package in a non-installable state (wrong dep versions would get installed)
        semverPrerelease__default['default'](version) !== null) {
          let newNewRange = snapshot ? version : `${getVersionRangeType__default['default'](depCurrentVersion)}${version}`;
          if (usesWorkspaceRange) newNewRange = `workspace:${newNewRange}`;
          deps[name] = newNewRange;
        }
      }
    }
  }

  return _objectSpread2(_objectSpread2({}, release), {}, {
    packageJson
  });
}

async function generateChangesForVersionTypeMarkdown(obj, type) {
  let releaseLines = await Promise.all(obj[type]);
  releaseLines = releaseLines.filter(x => x);

  if (releaseLines.length) {
    return `### ${startCase__default['default'](type)} Changes\n\n${releaseLines.join("\n")}\n`;
  }
} // release is the package and version we are releasing


async function getChangelogEntry(release, releases, changesets, changelogFuncs, changelogOpts, {
  updateInternalDependencies,
  onlyUpdatePeerDependentsWhenOutOfRange
}) {
  if (release.type === "none") return null;
  const changelogLines = {
    major: [],
    minor: [],
    patch: []
  }; // I sort of feel we can do better, as ComprehensiveReleases have an array
  // of the relevant changesets but since we need the version type for the
  // release in the changeset, I don't know if we can
  // We can filter here, but that just adds another iteration over this list

  changesets.forEach(cs => {
    const rls = cs.releases.find(r => r.name === release.name);

    if (rls && rls.type !== "none") {
      changelogLines[rls.type].push(changelogFuncs.getReleaseLine(cs, rls.type, changelogOpts));
    }
  });
  let dependentReleases = releases.filter(rel => {
    var _release$packageJson$, _release$packageJson$2;

    const dependencyVersionRange = (_release$packageJson$ = release.packageJson.dependencies) === null || _release$packageJson$ === void 0 ? void 0 : _release$packageJson$[rel.name];
    const peerDependencyVersionRange = (_release$packageJson$2 = release.packageJson.peerDependencies) === null || _release$packageJson$2 === void 0 ? void 0 : _release$packageJson$2[rel.name];
    const versionRange = dependencyVersionRange || peerDependencyVersionRange;
    return versionRange && shouldUpdateDependencyBasedOnConfig({
      type: rel.type,
      version: rel.newVersion
    }, {
      depVersionRange: versionRange,
      depType: dependencyVersionRange ? "dependencies" : "peerDependencies"
    }, {
      minReleaseType: updateInternalDependencies,
      onlyUpdatePeerDependentsWhenOutOfRange
    });
  });
  let relevantChangesetIds = new Set();
  dependentReleases.forEach(rel => {
    rel.changesets.forEach(cs => {
      relevantChangesetIds.add(cs);
    });
  });
  let relevantChangesets = changesets.filter(cs => relevantChangesetIds.has(cs.id));
  changelogLines.patch.push(changelogFuncs.getDependencyReleaseLine(relevantChangesets, dependentReleases, changelogOpts));
  return [`## ${release.newVersion}`, await generateChangesForVersionTypeMarkdown(changelogLines, "major"), await generateChangesForVersionTypeMarkdown(changelogLines, "minor"), await generateChangesForVersionTypeMarkdown(changelogLines, "patch")].filter(line => line).join("\n");
}

function getPrettierInstance(cwd) {
  try {
    return require(require.resolve("prettier", {
      paths: [cwd]
    }));
  } catch (err) {
    if (!err || err.code !== "MODULE_NOT_FOUND") {
      throw err;
    }

    return prettier__default['default'];
  }
}

function stringDefined(s) {
  return !!s;
}

async function getCommitsThatAddChangesets(changesetIds, cwd) {
  const paths = changesetIds.map(id => `.changeset/${id}.md`);
  const commits = await git.getCommitsThatAddFiles(paths, {
    cwd,
    short: true
  });

  if (commits.every(stringDefined)) {
    // We have commits for all files
    return commits;
  } // Some files didn't exist. Try legacy filenames instead


  const missingIds = changesetIds.map((id, i) => commits[i] ? undefined : id).filter(stringDefined);
  const legacyPaths = missingIds.map(id => `.changeset/${id}/changes.json`);
  const commitsForLegacyPaths = await git.getCommitsThatAddFiles(legacyPaths, {
    cwd,
    short: true
  }); // Fill in the blanks in the array of commits

  changesetIds.forEach((id, i) => {
    if (!commits[i]) {
      const missingIndex = missingIds.indexOf(id);
      commits[i] = commitsForLegacyPaths[missingIndex];
    }
  });
  return commits;
}

async function applyReleasePlan(releasePlan, packages, config$1 = config.defaultConfig, snapshot) {
  let cwd = packages.root.dir;
  let touchedFiles = [];
  const packagesByName = new Map(packages.packages.map(x => [x.packageJson.name, x]));
  let {
    releases,
    changesets
  } = releasePlan;
  let releasesWithPackage = releases.map(release => {
    let pkg = packagesByName.get(release.name);
    if (!pkg) throw new Error(`Could not find matching package for release of: ${release.name}`);
    return _objectSpread2(_objectSpread2({}, release), pkg);
  }); // I think this might be the wrong place to do this, but gotta do it somewhere -  add changelog entries to releases

  let releaseWithChangelogs = await getNewChangelogEntry(releasesWithPackage, changesets, config$1, cwd);

  if (releasePlan.preState !== undefined && snapshot === undefined) {
    if (releasePlan.preState.mode === "exit") {
      await fs__default['default'].remove(path__default['default'].join(cwd, ".changeset", "pre.json"));
    } else {
      await fs__default['default'].writeFile(path__default['default'].join(cwd, ".changeset", "pre.json"), JSON.stringify(releasePlan.preState, null, 2) + "\n");
    }
  }

  let versionsToUpdate = releases.map(({
    name,
    newVersion,
    type
  }) => ({
    name,
    version: newVersion,
    type
  })); // iterate over releases updating packages

  let finalisedRelease = releaseWithChangelogs.map(release => {
    return versionPackage(release, versionsToUpdate, {
      updateInternalDependencies: config$1.updateInternalDependencies,
      onlyUpdatePeerDependentsWhenOutOfRange: config$1.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH.onlyUpdatePeerDependentsWhenOutOfRange,
      bumpVersionsWithWorkspaceProtocolOnly: config$1.bumpVersionsWithWorkspaceProtocolOnly,
      snapshot
    });
  });
  let prettierInstance = getPrettierInstance(cwd);
  let prettierConfig = await prettierInstance.resolveConfig(cwd);

  for (let release of finalisedRelease) {
    let {
      changelog,
      packageJson,
      dir,
      name
    } = release;
    const pkgJSONPath = path__default['default'].resolve(dir, "package.json");
    await updatePackageJson(pkgJSONPath, packageJson);
    touchedFiles.push(pkgJSONPath);

    if (changelog && changelog.length > 0) {
      const changelogPath = path__default['default'].resolve(dir, "CHANGELOG.md");
      await updateChangelog(changelogPath, changelog, name, prettierInstance, prettierConfig);
      touchedFiles.push(changelogPath);
    }
  }

  if (releasePlan.preState === undefined || releasePlan.preState.mode === "exit") {
    let changesetFolder = path__default['default'].resolve(cwd, ".changeset");
    await Promise.all(changesets.map(async changeset => {
      let changesetPath = path__default['default'].resolve(changesetFolder, `${changeset.id}.md`);
      let changesetFolderPath = path__default['default'].resolve(changesetFolder, changeset.id);

      if (await fs__default['default'].pathExists(changesetPath)) {
        // DO NOT remove changeset for ignored packages
        // Mixed changeset that contains both ignored packages and not ignored packages are disallowed
        // At this point, we know there is no such changeset, because otherwise the program would've already failed,
        // so we just check if any ignored package exists in this changeset, and only remove it if none exists
        // Ignored list is added in v2, so we don't need to do it for v1 changesets
        if (!changeset.releases.find(release => config$1.ignore.includes(release.name))) {
          touchedFiles.push(changesetPath);
          await fs__default['default'].remove(changesetPath);
        } // TO REMOVE LOGIC - this works to remove v1 changesets. We should be removed in the future

      } else if (await fs__default['default'].pathExists(changesetFolderPath)) {
        touchedFiles.push(changesetFolderPath);
        await fs__default['default'].remove(changesetFolderPath);
      }
    }));
  } // We return the touched files to be committed in the cli


  return touchedFiles;
}

async function getNewChangelogEntry(releasesWithPackage, changesets, config, cwd) {
  if (!config.changelog) {
    return Promise.resolve(releasesWithPackage.map(release => _objectSpread2(_objectSpread2({}, release), {}, {
      changelog: null
    })));
  }

  let getChangelogFuncs = {
    getReleaseLine: () => Promise.resolve(""),
    getDependencyReleaseLine: () => Promise.resolve("")
  };
  const changelogOpts = config.changelog[1];
  let changesetPath = path__default['default'].join(cwd, ".changeset");
  let changelogPath = resolveFrom__default['default'](changesetPath, config.changelog[0]);

  let possibleChangelogFunc = require(changelogPath);

  if (possibleChangelogFunc.default) {
    possibleChangelogFunc = possibleChangelogFunc.default;
  }

  if (typeof possibleChangelogFunc.getReleaseLine === "function" && typeof possibleChangelogFunc.getDependencyReleaseLine === "function") {
    getChangelogFuncs = possibleChangelogFunc;
  } else {
    throw new Error("Could not resolve changelog generation functions");
  }

  let commits = await getCommitsThatAddChangesets(changesets.map(cs => cs.id), cwd);
  let moddedChangesets = changesets.map((cs, i) => _objectSpread2(_objectSpread2({}, cs), {}, {
    commit: commits[i]
  }));
  return Promise.all(releasesWithPackage.map(async release => {
    let changelog = await getChangelogEntry(release, releasesWithPackage, moddedChangesets, getChangelogFuncs, changelogOpts, {
      updateInternalDependencies: config.updateInternalDependencies,
      onlyUpdatePeerDependentsWhenOutOfRange: config.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH.onlyUpdatePeerDependentsWhenOutOfRange
    });
    return _objectSpread2(_objectSpread2({}, release), {}, {
      changelog
    });
  })).catch(e => {
    console.error("The following error was encountered while generating changelog entries");
    console.error("We have escaped applying the changesets, and no files should have been affected");
    throw e;
  });
}

async function updateChangelog(changelogPath, changelog, name, prettierInstance, prettierConfig) {
  let templateString = `\n\n${changelog.trim()}\n`;

  try {
    if (fs__default['default'].existsSync(changelogPath)) {
      await prependFile(changelogPath, templateString, name, prettierInstance, prettierConfig);
    } else {
      await writeFormattedMarkdownFile(changelogPath, `# ${name}${templateString}`, prettierInstance, prettierConfig);
    }
  } catch (e) {
    console.warn(e);
  }
}

async function updatePackageJson(pkgJsonPath, pkgJson) {
  const pkgRaw = await fs__default['default'].readFile(pkgJsonPath, "utf-8");
  const indent = detectIndent__default['default'](pkgRaw).indent || "  ";
  const stringified = JSON.stringify(pkgJson, null, indent) + (pkgRaw.endsWith("\n") ? "\n" : "");
  return fs__default['default'].writeFile(pkgJsonPath, stringified);
}

async function prependFile(filePath, data, name, prettierInstance, prettierConfig) {
  const fileData = fs__default['default'].readFileSync(filePath).toString(); // if the file exists but doesn't have the header, we'll add it in

  if (!fileData) {
    const completelyNewChangelog = `# ${name}${data}`;
    await writeFormattedMarkdownFile(filePath, completelyNewChangelog, prettierInstance, prettierConfig);
    return;
  }

  const newChangelog = fileData.replace("\n", data);
  await writeFormattedMarkdownFile(filePath, newChangelog, prettierInstance, prettierConfig);
}

async function writeFormattedMarkdownFile(filePath, content, prettierInstance, prettierConfig) {
  await fs__default['default'].writeFile(filePath, // Prettier v3 returns a promise
  await prettierInstance.format(content, _objectSpread2(_objectSpread2({}, prettierConfig), {}, {
    filepath: filePath,
    parser: "markdown"
  })));
}

exports.default = applyReleasePlan;
