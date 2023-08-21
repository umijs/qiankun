"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var semverSatisfies = require("semver/functions/satisfies"), semverInc = require("semver/functions/inc"), errors = require("@changesets/errors"), semverGt = require("semver/functions/gt"), semverParse = require("semver/functions/parse"), getDependentsGraph = require("@changesets/get-dependents-graph");

function _interopDefault(e) {
  return e && e.__esModule ? e : {
    default: e
  };
}

var semverSatisfies__default = _interopDefault(semverSatisfies), semverInc__default = _interopDefault(semverInc), semverGt__default = _interopDefault(semverGt), semverParse__default = _interopDefault(semverParse);

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

function incrementVersion(release, preInfo) {
  if ("none" === release.type) return release.oldVersion;
  let version = semverInc__default.default(release.oldVersion, release.type);
  if (void 0 !== preInfo && "exit" !== preInfo.state.mode) {
    let preVersion = preInfo.preVersions.get(release.name);
    if (void 0 === preVersion) throw new errors.InternalError(`preVersion for ${release.name} does not exist when preState is defined`);
    version += `-${preInfo.state.tag}.${preVersion}`;
  }
  return version;
}

function determineDependents({releases: releases, packagesByName: packagesByName, dependencyGraph: dependencyGraph, preInfo: preInfo, config: config}) {
  let updated = !1, pkgsToSearch = [ ...releases.values() ];
  for (;pkgsToSearch.length > 0; ) {
    const nextRelease = pkgsToSearch.shift();
    if (!nextRelease) continue;
    const pkgDependents = dependencyGraph.get(nextRelease.name);
    if (!pkgDependents) throw new Error("Error in determining dependents - could not find package in repository: " + nextRelease.name);
    pkgDependents.map((dependent => {
      let type;
      const dependentPackage = packagesByName.get(dependent);
      if (!dependentPackage) throw new Error("Dependency map is incorrect");
      if (config.ignore.includes(dependent)) type = "none"; else {
        const dependencyVersionRanges = getDependencyVersionRanges(dependentPackage.packageJson, nextRelease);
        for (const {depType: depType, versionRange: versionRange} of dependencyVersionRanges) if ("none" !== nextRelease.type) if (shouldBumpMajor({
          dependent: dependent,
          depType: depType,
          versionRange: versionRange,
          releases: releases,
          nextRelease: nextRelease,
          preInfo: preInfo,
          onlyUpdatePeerDependentsWhenOutOfRange: config.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH.onlyUpdatePeerDependentsWhenOutOfRange
        })) type = "major"; else if (!(releases.has(dependent) && "none" !== releases.get(dependent).type || "always" !== config.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH.updateInternalDependents && semverSatisfies__default.default(incrementVersion(nextRelease, preInfo), versionRange))) switch (depType) {
         case "dependencies":
         case "optionalDependencies":
         case "peerDependencies":
          "major" !== type && "minor" !== type && (type = "patch");
          break;

         case "devDependencies":
          "major" !== type && "minor" !== type && "patch" !== type && (type = "none");
        }
      }
      return releases.has(dependent) && releases.get(dependent).type === type && (type = void 0), 
      {
        name: dependent,
        type: type,
        pkgJSON: dependentPackage.packageJson
      };
    })).filter((dependentItem => !!dependentItem.type)).forEach((({name: name, type: type, pkgJSON: pkgJSON}) => {
      updated = !0;
      const existing = releases.get(name);
      if (existing && "major" === type && "major" !== existing.type) existing.type = "major", 
      pkgsToSearch.push(existing); else {
        let newDependent = {
          name: name,
          type: type,
          oldVersion: pkgJSON.version,
          changesets: []
        };
        pkgsToSearch.push(newDependent), releases.set(name, newDependent);
      }
    }));
  }
  return updated;
}

function getDependencyVersionRanges(dependentPkgJSON, dependencyRelease) {
  const DEPENDENCY_TYPES = [ "dependencies", "devDependencies", "peerDependencies", "optionalDependencies" ], dependencyVersionRanges = [];
  for (const type of DEPENDENCY_TYPES) {
    var _dependentPkgJSON$typ;
    const versionRange = null === (_dependentPkgJSON$typ = dependentPkgJSON[type]) || void 0 === _dependentPkgJSON$typ ? void 0 : _dependentPkgJSON$typ[dependencyRelease.name];
    versionRange && (versionRange.startsWith("workspace:") ? dependencyVersionRanges.push({
      depType: type,
      versionRange: "workspace:*" === versionRange ? dependencyRelease.oldVersion : versionRange.replace(/^workspace:/, "")
    }) : dependencyVersionRanges.push({
      depType: type,
      versionRange: versionRange
    }));
  }
  return dependencyVersionRanges;
}

function shouldBumpMajor({dependent: dependent, depType: depType, versionRange: versionRange, releases: releases, nextRelease: nextRelease, preInfo: preInfo, onlyUpdatePeerDependentsWhenOutOfRange: onlyUpdatePeerDependentsWhenOutOfRange}) {
  return "peerDependencies" === depType && "none" !== nextRelease.type && "patch" !== nextRelease.type && (!onlyUpdatePeerDependentsWhenOutOfRange || !semverSatisfies__default.default(incrementVersion(nextRelease, preInfo), versionRange)) && (!releases.has(dependent) || releases.has(dependent) && "major" !== releases.get(dependent).type);
}

function flattenReleases(changesets, packagesByName, ignoredPackages) {
  let releases = new Map;
  return changesets.forEach((changeset => {
    changeset.releases.filter((({name: name}) => !ignoredPackages.includes(name))).forEach((({name: name, type: type}) => {
      let release = releases.get(name), pkg = packagesByName.get(name);
      if (!pkg) throw new Error(`"${changeset.id}" changeset mentions a release for a package "${name}" but such a package could not be found.`);
      release ? ("major" !== type && ("patch" !== release.type && "none" !== release.type || "minor" !== type && "patch" !== type) || (release.type = type), 
      release.changesets.push(changeset.id)) : release = {
        name: name,
        type: type,
        oldVersion: pkg.packageJson.version,
        changesets: [ changeset.id ]
      }, releases.set(name, release);
    }));
  })), releases;
}

function getHighestReleaseType(releases) {
  if (0 === releases.length) throw new Error("Large internal Changesets error when calculating highest release type in the set of releases. Please contact the maintainers");
  let highestReleaseType = "none";
  for (let release of releases) switch (release.type) {
   case "major":
    return "major";

   case "minor":
    highestReleaseType = "minor";
    break;

   case "patch":
    "none" === highestReleaseType && (highestReleaseType = "patch");
  }
  return highestReleaseType;
}

function getCurrentHighestVersion(packageGroup, packagesByName) {
  let highestVersion;
  for (let pkgName of packageGroup) {
    let pkg = packagesByName.get(pkgName);
    if (!pkg) throw console.error(`FATAL ERROR IN CHANGESETS! We were unable to version for package group: ${pkgName} in package group: ${packageGroup.toString()}`), 
    new Error("fatal: could not resolve linked packages");
    (void 0 === highestVersion || semverGt__default.default(pkg.packageJson.version, highestVersion)) && (highestVersion = pkg.packageJson.version);
  }
  return highestVersion;
}

function matchFixedConstraint(releases, packagesByName, config) {
  let updated = !1;
  for (let fixedPackages of config.fixed) {
    let releasingFixedPackages = [ ...releases.values() ].filter((release => fixedPackages.includes(release.name) && "none" !== release.type));
    if (0 === releasingFixedPackages.length) continue;
    let highestReleaseType = getHighestReleaseType(releasingFixedPackages), highestVersion = getCurrentHighestVersion(fixedPackages, packagesByName);
    for (let pkgName of fixedPackages) {
      if (config.ignore.includes(pkgName)) continue;
      let release = releases.get(pkgName);
      release ? (release.type !== highestReleaseType && (updated = !0, release.type = highestReleaseType), 
      release.oldVersion !== highestVersion && (updated = !0, release.oldVersion = highestVersion)) : (updated = !0, 
      releases.set(pkgName, {
        name: pkgName,
        type: highestReleaseType,
        oldVersion: highestVersion,
        changesets: []
      }));
    }
  }
  return updated;
}

function applyLinks(releases, packagesByName, linked) {
  let updated = !1;
  for (let linkedPackages of linked) {
    let releasingLinkedPackages = [ ...releases.values() ].filter((release => linkedPackages.includes(release.name) && "none" !== release.type));
    if (0 === releasingLinkedPackages.length) continue;
    let highestReleaseType = getHighestReleaseType(releasingLinkedPackages), highestVersion = getCurrentHighestVersion(linkedPackages, packagesByName);
    for (let linkedPackage of releasingLinkedPackages) linkedPackage.type !== highestReleaseType && (updated = !0, 
    linkedPackage.type = highestReleaseType), linkedPackage.oldVersion !== highestVersion && (updated = !0, 
    linkedPackage.oldVersion = highestVersion);
  }
  return updated;
}

function getPreVersion(version) {
  let parsed = semverParse__default.default(version), preVersion = void 0 === parsed.prerelease[1] ? -1 : parsed.prerelease[1];
  if ("number" != typeof preVersion) throw new errors.InternalError("preVersion is not a number");
  return preVersion++, preVersion;
}

function getSnapshotSuffix(template, snapshotParameters) {
  let snapshotRefDate = new Date;
  const placeholderValues = {
    commit: snapshotParameters.commit,
    tag: snapshotParameters.tag,
    timestamp: snapshotRefDate.getTime().toString(),
    datetime: snapshotRefDate.toISOString().replace(/\.\d{3}Z$/, "").replace(/[^\d]/g, "")
  };
  if (!template) return [ placeholderValues.tag, placeholderValues.datetime ].filter(Boolean).join("-");
  const placeholders = Object.keys(placeholderValues);
  if (!template.includes("{tag}") && void 0 !== placeholderValues.tag) throw new Error(`Failed to compose snapshot version: "{tag}" placeholder is missing, but the snapshot parameter is defined (value: '${placeholderValues.tag}')`);
  return placeholders.reduce(((prev, key) => prev.replace(new RegExp(`\\{${key}\\}`, "g"), (() => {
    const value = placeholderValues[key];
    if (void 0 === value) throw new Error(`Failed to compose snapshot version: "{${key}}" placeholder is used without having a value defined!`);
    return value;
  }))), template);
}

function getSnapshotVersion(release, preInfo, useCalculatedVersion, snapshotSuffix) {
  if ("none" === release.type) return release.oldVersion;
  return `${useCalculatedVersion ? incrementVersion(release, preInfo) : "0.0.0"}-${snapshotSuffix}`;
}

function getNewVersion(release, preInfo) {
  return "none" === release.type ? release.oldVersion : incrementVersion(release, preInfo);
}

function assembleReleasePlan(changesets, packages, config, preState, snapshot) {
  const refinedConfig = config.snapshot ? config : _objectSpread2(_objectSpread2({}, config), {}, {
    snapshot: {
      prereleaseTemplate: null,
      useCalculatedVersion: config.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH.useCalculatedVersionForSnapshots
    }
  }), refinedSnapshot = "string" == typeof snapshot ? {
    tag: snapshot
  } : "boolean" == typeof snapshot ? {
    tag: void 0
  } : snapshot;
  let packagesByName = new Map(packages.packages.map((x => [ x.packageJson.name, x ])));
  const relevantChangesets = getRelevantChangesets(changesets, refinedConfig.ignore, preState), preInfo = getPreInfo(changesets, packagesByName, refinedConfig, preState);
  let releases = flattenReleases(relevantChangesets, packagesByName, refinedConfig.ignore), dependencyGraph = getDependentsGraph.getDependentsGraph(packages, {
    bumpVersionsWithWorkspaceProtocolOnly: refinedConfig.bumpVersionsWithWorkspaceProtocolOnly
  }), releasesValidated = !1;
  for (;!1 === releasesValidated; ) {
    let dependentAdded = determineDependents({
      releases: releases,
      packagesByName: packagesByName,
      dependencyGraph: dependencyGraph,
      preInfo: preInfo,
      config: refinedConfig
    }), fixedConstraintUpdated = matchFixedConstraint(releases, packagesByName, refinedConfig);
    releasesValidated = !applyLinks(releases, packagesByName, refinedConfig.linked) && !dependentAdded && !fixedConstraintUpdated;
  }
  if ("exit" === (null == preInfo ? void 0 : preInfo.state.mode)) for (let pkg of packages.packages) if (0 !== preInfo.preVersions.get(pkg.packageJson.name)) {
    const existingRelease = releases.get(pkg.packageJson.name);
    existingRelease ? "none" !== existingRelease.type || refinedConfig.ignore.includes(pkg.packageJson.name) || (existingRelease.type = "patch") : releases.set(pkg.packageJson.name, {
      name: pkg.packageJson.name,
      type: "patch",
      oldVersion: pkg.packageJson.version,
      changesets: []
    });
  }
  const snapshotSuffix = refinedSnapshot && getSnapshotSuffix(refinedConfig.snapshot.prereleaseTemplate, refinedSnapshot);
  return {
    changesets: relevantChangesets,
    releases: [ ...releases.values() ].map((incompleteRelease => _objectSpread2(_objectSpread2({}, incompleteRelease), {}, {
      newVersion: snapshotSuffix ? getSnapshotVersion(incompleteRelease, preInfo, refinedConfig.snapshot.useCalculatedVersion, snapshotSuffix) : getNewVersion(incompleteRelease, preInfo)
    }))),
    preState: null == preInfo ? void 0 : preInfo.state
  };
}

function getRelevantChangesets(changesets, ignored, preState) {
  for (const changeset of changesets) {
    const ignoredPackages = [], notIgnoredPackages = [];
    for (const release of changeset.releases) ignored.find((ignoredPackageName => ignoredPackageName === release.name)) ? ignoredPackages.push(release.name) : notIgnoredPackages.push(release.name);
    if (ignoredPackages.length > 0 && notIgnoredPackages.length > 0) throw new Error(`Found mixed changeset ${changeset.id}\nFound ignored packages: ${ignoredPackages.join(" ")}\nFound not ignored packages: ${notIgnoredPackages.join(" ")}\nMixed changesets that contain both ignored and not ignored packages are not allowed`);
  }
  if (preState && "exit" !== preState.mode) {
    let usedChangesetIds = new Set(preState.changesets);
    return changesets.filter((changeset => !usedChangesetIds.has(changeset.id)));
  }
  return changesets;
}

function getHighestPreVersion(packageGroup, packagesByName) {
  let highestPreVersion = 0;
  for (let pkg of packageGroup) highestPreVersion = Math.max(getPreVersion(packagesByName.get(pkg).packageJson.version), highestPreVersion);
  return highestPreVersion;
}

function getPreInfo(changesets, packagesByName, config, preState) {
  if (void 0 === preState) return;
  let updatedPreState = _objectSpread2(_objectSpread2({}, preState), {}, {
    changesets: changesets.map((changeset => changeset.id)),
    initialVersions: _objectSpread2({}, preState.initialVersions)
  });
  for (const [, pkg] of packagesByName) void 0 === updatedPreState.initialVersions[pkg.packageJson.name] && (updatedPreState.initialVersions[pkg.packageJson.name] = pkg.packageJson.version);
  let preVersions = new Map;
  for (const [, pkg] of packagesByName) preVersions.set(pkg.packageJson.name, getPreVersion(pkg.packageJson.version));
  for (let fixedGroup of config.fixed) {
    let highestPreVersion = getHighestPreVersion(fixedGroup, packagesByName);
    for (let fixedPackage of fixedGroup) preVersions.set(fixedPackage, highestPreVersion);
  }
  for (let linkedGroup of config.linked) {
    let highestPreVersion = getHighestPreVersion(linkedGroup, packagesByName);
    for (let linkedPackage of linkedGroup) preVersions.set(linkedPackage, highestPreVersion);
  }
  return {
    state: updatedPreState,
    preVersions: preVersions
  };
}

exports.default = assembleReleasePlan;
