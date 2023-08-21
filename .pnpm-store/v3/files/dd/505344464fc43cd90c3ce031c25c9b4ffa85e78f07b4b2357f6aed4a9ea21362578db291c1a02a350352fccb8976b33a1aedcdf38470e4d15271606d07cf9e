"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var config = require("@changesets/config"), git = require("@changesets/git"), resolveFrom = require("resolve-from"), detectIndent = require("detect-indent"), fs = require("fs-extra"), path = require("path"), prettier = require("prettier"), getVersionRangeType = require("@changesets/get-version-range-type"), Range = require("semver/classes/range"), semverPrerelease = require("semver/functions/prerelease"), semverSatisfies = require("semver/functions/satisfies"), startCase = require("lodash.startcase");

function _interopDefault(e) {
  return e && e.__esModule ? e : {
    default: e
  };
}

var resolveFrom__default = _interopDefault(resolveFrom), detectIndent__default = _interopDefault(detectIndent), fs__default = _interopDefault(fs), path__default = _interopDefault(path), prettier__default = _interopDefault(prettier), getVersionRangeType__default = _interopDefault(getVersionRangeType), Range__default = _interopDefault(Range), semverPrerelease__default = _interopDefault(semverPrerelease), semverSatisfies__default = _interopDefault(semverSatisfies), startCase__default = _interopDefault(startCase);

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

const bumpTypes = [ "none", "patch", "minor", "major" ];

function getBumpLevel(type) {
  const level = bumpTypes.indexOf(type);
  if (level < 0) throw new Error("Unrecognised bump type " + type);
  return level;
}

function shouldUpdateDependencyBasedOnConfig(release, {depVersionRange: depVersionRange, depType: depType}, {minReleaseType: minReleaseType, onlyUpdatePeerDependentsWhenOutOfRange: onlyUpdatePeerDependentsWhenOutOfRange}) {
  if (!semverSatisfies__default.default(release.version, depVersionRange)) return !0;
  const minLevel = getBumpLevel(minReleaseType);
  let shouldUpdate = getBumpLevel(release.type) >= minLevel;
  return "peerDependencies" === depType && (shouldUpdate = !onlyUpdatePeerDependentsWhenOutOfRange), 
  shouldUpdate;
}

const DEPENDENCY_TYPES = [ "dependencies", "devDependencies", "peerDependencies", "optionalDependencies" ];

function versionPackage(release, versionsToUpdate, {updateInternalDependencies: updateInternalDependencies, onlyUpdatePeerDependentsWhenOutOfRange: onlyUpdatePeerDependentsWhenOutOfRange, bumpVersionsWithWorkspaceProtocolOnly: bumpVersionsWithWorkspaceProtocolOnly, snapshot: snapshot}) {
  let {newVersion: newVersion, packageJson: packageJson} = release;
  packageJson.version = newVersion;
  for (let depType of DEPENDENCY_TYPES) {
    let deps = packageJson[depType];
    if (deps) for (let {name: name, version: version, type: type} of versionsToUpdate) {
      let depCurrentVersion = deps[name];
      if (!depCurrentVersion || depCurrentVersion.startsWith("file:") || depCurrentVersion.startsWith("link:") || !shouldUpdateDependencyBasedOnConfig({
        version: version,
        type: type
      }, {
        depVersionRange: depCurrentVersion,
        depType: depType
      }, {
        minReleaseType: updateInternalDependencies,
        onlyUpdatePeerDependentsWhenOutOfRange: onlyUpdatePeerDependentsWhenOutOfRange
      })) continue;
      const usesWorkspaceRange = depCurrentVersion.startsWith("workspace:");
      if (usesWorkspaceRange || !0 !== bumpVersionsWithWorkspaceProtocolOnly) {
        if (usesWorkspaceRange) {
          const workspaceDepVersion = depCurrentVersion.replace(/^workspace:/, "");
          if ("*" === workspaceDepVersion || "^" === workspaceDepVersion || "~" === workspaceDepVersion) continue;
          depCurrentVersion = workspaceDepVersion;
        }
        if ("" !== new Range__default.default(depCurrentVersion).range || null !== semverPrerelease__default.default(version)) {
          let newNewRange = snapshot ? version : `${getVersionRangeType__default.default(depCurrentVersion)}${version}`;
          usesWorkspaceRange && (newNewRange = "workspace:" + newNewRange), deps[name] = newNewRange;
        }
      }
    }
  }
  return _objectSpread2(_objectSpread2({}, release), {}, {
    packageJson: packageJson
  });
}

async function generateChangesForVersionTypeMarkdown(obj, type) {
  let releaseLines = await Promise.all(obj[type]);
  if (releaseLines = releaseLines.filter((x => x)), releaseLines.length) return `### ${startCase__default.default(type)} Changes\n\n${releaseLines.join("\n")}\n`;
}

async function getChangelogEntry(release, releases, changesets, changelogFuncs, changelogOpts, {updateInternalDependencies: updateInternalDependencies, onlyUpdatePeerDependentsWhenOutOfRange: onlyUpdatePeerDependentsWhenOutOfRange}) {
  if ("none" === release.type) return null;
  const changelogLines = {
    major: [],
    minor: [],
    patch: []
  };
  changesets.forEach((cs => {
    const rls = cs.releases.find((r => r.name === release.name));
    rls && "none" !== rls.type && changelogLines[rls.type].push(changelogFuncs.getReleaseLine(cs, rls.type, changelogOpts));
  }));
  let dependentReleases = releases.filter((rel => {
    var _release$packageJson$, _release$packageJson$2;
    const dependencyVersionRange = null === (_release$packageJson$ = release.packageJson.dependencies) || void 0 === _release$packageJson$ ? void 0 : _release$packageJson$[rel.name], peerDependencyVersionRange = null === (_release$packageJson$2 = release.packageJson.peerDependencies) || void 0 === _release$packageJson$2 ? void 0 : _release$packageJson$2[rel.name], versionRange = dependencyVersionRange || peerDependencyVersionRange;
    return versionRange && shouldUpdateDependencyBasedOnConfig({
      type: rel.type,
      version: rel.newVersion
    }, {
      depVersionRange: versionRange,
      depType: dependencyVersionRange ? "dependencies" : "peerDependencies"
    }, {
      minReleaseType: updateInternalDependencies,
      onlyUpdatePeerDependentsWhenOutOfRange: onlyUpdatePeerDependentsWhenOutOfRange
    });
  })), relevantChangesetIds = new Set;
  dependentReleases.forEach((rel => {
    rel.changesets.forEach((cs => {
      relevantChangesetIds.add(cs);
    }));
  }));
  let relevantChangesets = changesets.filter((cs => relevantChangesetIds.has(cs.id)));
  return changelogLines.patch.push(changelogFuncs.getDependencyReleaseLine(relevantChangesets, dependentReleases, changelogOpts)), 
  [ "## " + release.newVersion, await generateChangesForVersionTypeMarkdown(changelogLines, "major"), await generateChangesForVersionTypeMarkdown(changelogLines, "minor"), await generateChangesForVersionTypeMarkdown(changelogLines, "patch") ].filter((line => line)).join("\n");
}

function getPrettierInstance(cwd) {
  try {
    return require(require.resolve("prettier", {
      paths: [ cwd ]
    }));
  } catch (err) {
    if (!err || "MODULE_NOT_FOUND" !== err.code) throw err;
    return prettier__default.default;
  }
}

function stringDefined(s) {
  return !!s;
}

async function getCommitsThatAddChangesets(changesetIds, cwd) {
  const paths = changesetIds.map((id => `.changeset/${id}.md`)), commits = await git.getCommitsThatAddFiles(paths, {
    cwd: cwd,
    short: !0
  });
  if (commits.every(stringDefined)) return commits;
  const missingIds = changesetIds.map(((id, i) => commits[i] ? void 0 : id)).filter(stringDefined), legacyPaths = missingIds.map((id => `.changeset/${id}/changes.json`)), commitsForLegacyPaths = await git.getCommitsThatAddFiles(legacyPaths, {
    cwd: cwd,
    short: !0
  });
  return changesetIds.forEach(((id, i) => {
    if (!commits[i]) {
      const missingIndex = missingIds.indexOf(id);
      commits[i] = commitsForLegacyPaths[missingIndex];
    }
  })), commits;
}

async function applyReleasePlan(releasePlan, packages, config$1 = config.defaultConfig, snapshot) {
  let cwd = packages.root.dir, touchedFiles = [];
  const packagesByName = new Map(packages.packages.map((x => [ x.packageJson.name, x ])));
  let {releases: releases, changesets: changesets} = releasePlan, releasesWithPackage = releases.map((release => {
    let pkg = packagesByName.get(release.name);
    if (!pkg) throw new Error("Could not find matching package for release of: " + release.name);
    return _objectSpread2(_objectSpread2({}, release), pkg);
  })), releaseWithChangelogs = await getNewChangelogEntry(releasesWithPackage, changesets, config$1, cwd);
  void 0 !== releasePlan.preState && void 0 === snapshot && ("exit" === releasePlan.preState.mode ? await fs__default.default.remove(path__default.default.join(cwd, ".changeset", "pre.json")) : await fs__default.default.writeFile(path__default.default.join(cwd, ".changeset", "pre.json"), JSON.stringify(releasePlan.preState, null, 2) + "\n"));
  let versionsToUpdate = releases.map((({name: name, newVersion: newVersion, type: type}) => ({
    name: name,
    version: newVersion,
    type: type
  }))), finalisedRelease = releaseWithChangelogs.map((release => versionPackage(release, versionsToUpdate, {
    updateInternalDependencies: config$1.updateInternalDependencies,
    onlyUpdatePeerDependentsWhenOutOfRange: config$1.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH.onlyUpdatePeerDependentsWhenOutOfRange,
    bumpVersionsWithWorkspaceProtocolOnly: config$1.bumpVersionsWithWorkspaceProtocolOnly,
    snapshot: snapshot
  }))), prettierInstance = getPrettierInstance(cwd), prettierConfig = await prettierInstance.resolveConfig(cwd);
  for (let release of finalisedRelease) {
    let {changelog: changelog, packageJson: packageJson, dir: dir, name: name} = release;
    const pkgJSONPath = path__default.default.resolve(dir, "package.json");
    if (await updatePackageJson(pkgJSONPath, packageJson), touchedFiles.push(pkgJSONPath), 
    changelog && changelog.length > 0) {
      const changelogPath = path__default.default.resolve(dir, "CHANGELOG.md");
      await updateChangelog(changelogPath, changelog, name, prettierInstance, prettierConfig), 
      touchedFiles.push(changelogPath);
    }
  }
  if (void 0 === releasePlan.preState || "exit" === releasePlan.preState.mode) {
    let changesetFolder = path__default.default.resolve(cwd, ".changeset");
    await Promise.all(changesets.map((async changeset => {
      let changesetPath = path__default.default.resolve(changesetFolder, changeset.id + ".md"), changesetFolderPath = path__default.default.resolve(changesetFolder, changeset.id);
      await fs__default.default.pathExists(changesetPath) ? changeset.releases.find((release => config$1.ignore.includes(release.name))) || (touchedFiles.push(changesetPath), 
      await fs__default.default.remove(changesetPath)) : await fs__default.default.pathExists(changesetFolderPath) && (touchedFiles.push(changesetFolderPath), 
      await fs__default.default.remove(changesetFolderPath));
    })));
  }
  return touchedFiles;
}

async function getNewChangelogEntry(releasesWithPackage, changesets, config, cwd) {
  if (!config.changelog) return Promise.resolve(releasesWithPackage.map((release => _objectSpread2(_objectSpread2({}, release), {}, {
    changelog: null
  }))));
  let getChangelogFuncs = {
    getReleaseLine: () => Promise.resolve(""),
    getDependencyReleaseLine: () => Promise.resolve("")
  };
  const changelogOpts = config.changelog[1];
  let changesetPath = path__default.default.join(cwd, ".changeset"), changelogPath = resolveFrom__default.default(changesetPath, config.changelog[0]), possibleChangelogFunc = require(changelogPath);
  if (possibleChangelogFunc.default && (possibleChangelogFunc = possibleChangelogFunc.default), 
  "function" != typeof possibleChangelogFunc.getReleaseLine || "function" != typeof possibleChangelogFunc.getDependencyReleaseLine) throw new Error("Could not resolve changelog generation functions");
  getChangelogFuncs = possibleChangelogFunc;
  let commits = await getCommitsThatAddChangesets(changesets.map((cs => cs.id)), cwd), moddedChangesets = changesets.map(((cs, i) => _objectSpread2(_objectSpread2({}, cs), {}, {
    commit: commits[i]
  })));
  return Promise.all(releasesWithPackage.map((async release => {
    let changelog = await getChangelogEntry(release, releasesWithPackage, moddedChangesets, getChangelogFuncs, changelogOpts, {
      updateInternalDependencies: config.updateInternalDependencies,
      onlyUpdatePeerDependentsWhenOutOfRange: config.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH.onlyUpdatePeerDependentsWhenOutOfRange
    });
    return _objectSpread2(_objectSpread2({}, release), {}, {
      changelog: changelog
    });
  }))).catch((e => {
    throw console.error("The following error was encountered while generating changelog entries"), 
    console.error("We have escaped applying the changesets, and no files should have been affected"), 
    e;
  }));
}

async function updateChangelog(changelogPath, changelog, name, prettierInstance, prettierConfig) {
  let templateString = `\n\n${changelog.trim()}\n`;
  try {
    fs__default.default.existsSync(changelogPath) ? await prependFile(changelogPath, templateString, name, prettierInstance, prettierConfig) : await writeFormattedMarkdownFile(changelogPath, `# ${name}${templateString}`, prettierInstance, prettierConfig);
  } catch (e) {
    console.warn(e);
  }
}

async function updatePackageJson(pkgJsonPath, pkgJson) {
  const pkgRaw = await fs__default.default.readFile(pkgJsonPath, "utf-8"), indent = detectIndent__default.default(pkgRaw).indent || "  ", stringified = JSON.stringify(pkgJson, null, indent) + (pkgRaw.endsWith("\n") ? "\n" : "");
  return fs__default.default.writeFile(pkgJsonPath, stringified);
}

async function prependFile(filePath, data, name, prettierInstance, prettierConfig) {
  const fileData = fs__default.default.readFileSync(filePath).toString();
  if (!fileData) {
    const completelyNewChangelog = `# ${name}${data}`;
    return void await writeFormattedMarkdownFile(filePath, completelyNewChangelog, prettierInstance, prettierConfig);
  }
  const newChangelog = fileData.replace("\n", data);
  await writeFormattedMarkdownFile(filePath, newChangelog, prettierInstance, prettierConfig);
}

async function writeFormattedMarkdownFile(filePath, content, prettierInstance, prettierConfig) {
  await fs__default.default.writeFile(filePath, await prettierInstance.format(content, _objectSpread2(_objectSpread2({}, prettierConfig), {}, {
    filepath: filePath,
    parser: "markdown"
  })));
}

exports.default = applyReleasePlan;
