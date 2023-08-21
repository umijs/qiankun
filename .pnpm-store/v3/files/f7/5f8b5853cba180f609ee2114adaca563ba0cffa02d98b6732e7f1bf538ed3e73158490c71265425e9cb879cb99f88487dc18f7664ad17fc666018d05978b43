"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var fs = require("fs-extra"), path = require("path"), micromatch = require("micromatch"), errors = require("@changesets/errors"), logger = require("@changesets/logger"), getDependentsGraph = require("@changesets/get-dependents-graph");

function _interopDefault(e) {
  return e && e.__esModule ? e : {
    default: e
  };
}

var path__default = _interopDefault(path), micromatch__default = _interopDefault(micromatch), packageJson = {
  name: "@changesets/config",
  version: "2.3.1",
  description: "Utilities for reading and parsing Changeset's config",
  main: "dist/config.cjs.js",
  module: "dist/config.esm.js",
  license: "MIT",
  repository: "https://github.com/changesets/changesets/tree/main/packages/config",
  files: [ "dist", "schema.json" ],
  dependencies: {
    "@changesets/errors": "^0.1.4",
    "@changesets/get-dependents-graph": "^1.3.6",
    "@changesets/logger": "^0.0.5",
    "@changesets/types": "^5.2.1",
    "@manypkg/get-packages": "^1.1.3",
    "fs-extra": "^7.0.1",
    micromatch: "^4.0.2"
  },
  devDependencies: {
    "@changesets/test-utils": "*",
    "@types/micromatch": "^4.0.1",
    "jest-in-case": "^1.0.2"
  }
};

let defaultWrittenConfig = {
  $schema: `https://unpkg.com/@changesets/config@${packageJson.version}/schema.json`,
  changelog: "@changesets/cli/changelog",
  commit: !1,
  fixed: [],
  linked: [],
  access: "restricted",
  baseBranch: "master",
  updateInternalDependencies: "patch",
  ignore: []
};

function flatten(arr) {
  return [].concat(...arr);
}

function getNormalizedChangelogOption(thing) {
  return !1 !== thing && ("string" == typeof thing ? [ thing, null ] : thing);
}

function getNormalizedCommitOption(thing) {
  return !1 !== thing && (!0 === thing ? [ "@changesets/cli/commit", {
    skipCI: "version"
  } ] : "string" == typeof thing ? [ thing, null ] : thing);
}

function getUnmatchedPatterns(listOfPackageNamesOrGlob, pkgNames) {
  return listOfPackageNamesOrGlob.filter((pkgNameOrGlob => !pkgNames.some((pkgName => micromatch__default.default.isMatch(pkgName, pkgNameOrGlob)))));
}

const havePackageGroupsCorrectShape = pkgGroups => isArray(pkgGroups) && pkgGroups.every((arr => isArray(arr) && arr.every((pkgName => "string" == typeof pkgName))));

function isArray(arg) {
  return Array.isArray(arg);
}

let read = async (cwd, packages) => {
  let json = await fs.readJSON(path__default.default.join(cwd, ".changeset", "config.json"));
  return parse(json, packages);
}, parse = (json, packages) => {
  var _json$changedFilePatt, _json$snapshot$prerel, _json$snapshot, _json$snapshot2, _json$___experimental, _json$___experimental2, _json$___experimental3, _json$___experimental4, _json$privatePackages, _json$privatePackages2;
  let messages = [], pkgNames = packages.packages.map((({packageJson: packageJson}) => packageJson.name));
  void 0 === json.changelog || !1 === json.changelog || "string" == typeof json.changelog || isArray(json.changelog) && 2 === json.changelog.length && "string" == typeof json.changelog[0] || messages.push(`The \`changelog\` option is set as ${JSON.stringify(json.changelog, null, 2)} when the only valid values are undefined, false, a module path(e.g. "@changesets/cli/changelog" or "./some-module") or a tuple with a module path and config for the changelog generator(e.g. ["@changesets/cli/changelog", { someOption: true }])`);
  let normalizedAccess = json.access;
  "private" === json.access && (normalizedAccess = "restricted", logger.warn('The `access` option is set as "private", but this is actually not a valid value - the correct form is "restricted".')), 
  void 0 !== normalizedAccess && "restricted" !== normalizedAccess && "public" !== normalizedAccess && messages.push(`The \`access\` option is set as ${JSON.stringify(normalizedAccess, null, 2)} when the only valid values are undefined, "public" or "restricted"`), 
  void 0 === json.commit || "boolean" == typeof json.commit || "string" == typeof json.commit || isArray(json.commit) && 2 === json.commit.length && "string" == typeof json.commit[0] || messages.push(`The \`commit\` option is set as ${JSON.stringify(json.commit, null, 2)} when the only valid values are undefined or a boolean or a module path (e.g. "@changesets/cli/commit" or "./some-module") or a tuple with a module path and config for the commit message generator (e.g. ["@changesets/cli/commit", { "skipCI": "version" }])`), 
  void 0 !== json.baseBranch && "string" != typeof json.baseBranch && messages.push(`The \`baseBranch\` option is set as ${JSON.stringify(json.baseBranch, null, 2)} but the \`baseBranch\` option can only be set as a string`), 
  void 0 === json.changedFilePatterns || isArray(json.changedFilePatterns) && json.changedFilePatterns.every((pattern => "string" == typeof pattern)) || messages.push(`The \`changedFilePatterns\` option is set as ${JSON.stringify(json.changedFilePatterns, null, 2)} but the \`changedFilePatterns\` option can only be set as an array of strings`);
  let fixed = [];
  if (void 0 !== json.fixed) if (havePackageGroupsCorrectShape(json.fixed)) {
    let foundPkgNames = new Set, duplicatedPkgNames = new Set;
    for (let fixedGroup of json.fixed) {
      messages.push(...getUnmatchedPatterns(fixedGroup, pkgNames).map((pkgOrGlob => `The package or glob expression "${pkgOrGlob}" specified in the \`fixed\` option does not match any package in the project. You may have misspelled the package name or provided an invalid glob expression. Note that glob expressions must be defined according to https://www.npmjs.com/package/micromatch.`)));
      let expandedFixedGroup = micromatch__default.default(pkgNames, fixedGroup);
      fixed.push(expandedFixedGroup);
      for (let fixedPkgName of expandedFixedGroup) foundPkgNames.has(fixedPkgName) && duplicatedPkgNames.add(fixedPkgName), 
      foundPkgNames.add(fixedPkgName);
    }
    duplicatedPkgNames.size && duplicatedPkgNames.forEach((pkgName => {
      messages.push(`The package "${pkgName}" is defined in multiple sets of fixed packages. Packages can only be defined in a single set of fixed packages. If you are using glob expressions, make sure that they are valid according to https://www.npmjs.com/package/micromatch.`);
    }));
  } else messages.push(`The \`fixed\` option is set as ${JSON.stringify(json.fixed, null, 2)} when the only valid values are undefined or an array of arrays of package names`);
  let linked = [];
  if (void 0 !== json.linked) if (havePackageGroupsCorrectShape(json.linked)) {
    let foundPkgNames = new Set, duplicatedPkgNames = new Set;
    for (let linkedGroup of json.linked) {
      messages.push(...getUnmatchedPatterns(linkedGroup, pkgNames).map((pkgOrGlob => `The package or glob expression "${pkgOrGlob}" specified in the \`linked\` option does not match any package in the project. You may have misspelled the package name or provided an invalid glob expression. Note that glob expressions must be defined according to https://www.npmjs.com/package/micromatch.`)));
      let expandedLinkedGroup = micromatch__default.default(pkgNames, linkedGroup);
      linked.push(expandedLinkedGroup);
      for (let linkedPkgName of expandedLinkedGroup) foundPkgNames.has(linkedPkgName) && duplicatedPkgNames.add(linkedPkgName), 
      foundPkgNames.add(linkedPkgName);
    }
    duplicatedPkgNames.size && duplicatedPkgNames.forEach((pkgName => {
      messages.push(`The package "${pkgName}" is defined in multiple sets of linked packages. Packages can only be defined in a single set of linked packages. If you are using glob expressions, make sure that they are valid according to https://www.npmjs.com/package/micromatch.`);
    }));
  } else messages.push(`The \`linked\` option is set as ${JSON.stringify(json.linked, null, 2)} when the only valid values are undefined or an array of arrays of package names`);
  const allFixedPackages = new Set(flatten(fixed)), allLinkedPackages = new Set(flatten(linked));
  if (allFixedPackages.forEach((pkgName => {
    allLinkedPackages.has(pkgName) && messages.push(`The package "${pkgName}" can be found in both fixed and linked groups. A package can only be either fixed or linked.`);
  })), void 0 === json.updateInternalDependencies || [ "patch", "minor" ].includes(json.updateInternalDependencies) || messages.push(`The \`updateInternalDependencies\` option is set as ${JSON.stringify(json.updateInternalDependencies, null, 2)} but can only be 'patch' or 'minor'`), 
  json.ignore) if (isArray(json.ignore) && json.ignore.every((pkgName => "string" == typeof pkgName))) {
    messages.push(...getUnmatchedPatterns(json.ignore, pkgNames).map((pkgOrGlob => `The package or glob expression "${pkgOrGlob}" is specified in the \`ignore\` option but it is not found in the project. You may have misspelled the package name or provided an invalid glob expression. Note that glob expressions must be defined according to https://www.npmjs.com/package/micromatch.`)));
    const dependentsGraph = getDependentsGraph.getDependentsGraph(packages);
    for (const ignoredPackage of json.ignore) {
      const dependents = dependentsGraph.get(ignoredPackage) || [];
      for (const dependent of dependents) json.ignore.includes(dependent) || messages.push(`The package "${dependent}" depends on the ignored package "${ignoredPackage}", but "${dependent}" is not being ignored. Please add "${dependent}" to the \`ignore\` option.`);
    }
  } else messages.push(`The \`ignore\` option is set as ${JSON.stringify(json.ignore, null, 2)} when the only valid values are undefined or an array of package names`);
  const {snapshot: snapshot} = json;
  if (void 0 !== snapshot && (void 0 !== snapshot.useCalculatedVersion && "boolean" != typeof snapshot.useCalculatedVersion && messages.push(`The \`snapshot.useCalculatedVersion\` option is set as ${JSON.stringify(snapshot.useCalculatedVersion, null, 2)} when the only valid values are undefined or a boolean`), 
  void 0 !== snapshot.prereleaseTemplate && "string" != typeof snapshot.prereleaseTemplate && messages.push(`The \`snapshot.prereleaseTemplate\` option is set as ${JSON.stringify(snapshot.prereleaseTemplate, null, 2)} when the only valid values are undefined, or a template string.`)), 
  void 0 !== json.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH) {
    const {onlyUpdatePeerDependentsWhenOutOfRange: onlyUpdatePeerDependentsWhenOutOfRange, updateInternalDependents: updateInternalDependents, useCalculatedVersionForSnapshots: useCalculatedVersionForSnapshots} = json.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH;
    void 0 !== onlyUpdatePeerDependentsWhenOutOfRange && "boolean" != typeof onlyUpdatePeerDependentsWhenOutOfRange && messages.push(`The \`onlyUpdatePeerDependentsWhenOutOfRange\` option is set as ${JSON.stringify(onlyUpdatePeerDependentsWhenOutOfRange, null, 2)} when the only valid values are undefined or a boolean`), 
    void 0 === updateInternalDependents || [ "always", "out-of-range" ].includes(updateInternalDependents) || messages.push(`The \`updateInternalDependents\` option is set as ${JSON.stringify(updateInternalDependents, null, 2)} but can only be 'always' or 'out-of-range'`), 
    useCalculatedVersionForSnapshots && void 0 !== useCalculatedVersionForSnapshots && (console.warn('Experimental flag "useCalculatedVersionForSnapshots" is deprecated since snapshot feature became stable. Please use "snapshot.useCalculatedVersion" instead.'), 
    "boolean" != typeof useCalculatedVersionForSnapshots && messages.push(`The \`useCalculatedVersionForSnapshots\` option is set as ${JSON.stringify(useCalculatedVersionForSnapshots, null, 2)} when the only valid values are undefined or a boolean`));
  }
  if (messages.length) throw new errors.ValidationError("Some errors occurred when validating the changesets config:\n" + messages.join("\n"));
  let config = {
    changelog: getNormalizedChangelogOption(void 0 === json.changelog ? defaultWrittenConfig.changelog : json.changelog),
    access: void 0 === normalizedAccess ? defaultWrittenConfig.access : normalizedAccess,
    commit: getNormalizedCommitOption(void 0 === json.commit ? defaultWrittenConfig.commit : json.commit),
    fixed: fixed,
    linked: linked,
    baseBranch: void 0 === json.baseBranch ? defaultWrittenConfig.baseBranch : json.baseBranch,
    changedFilePatterns: null !== (_json$changedFilePatt = json.changedFilePatterns) && void 0 !== _json$changedFilePatt ? _json$changedFilePatt : [ "**" ],
    updateInternalDependencies: void 0 === json.updateInternalDependencies ? defaultWrittenConfig.updateInternalDependencies : json.updateInternalDependencies,
    ignore: void 0 === json.ignore ? defaultWrittenConfig.ignore : micromatch__default.default(pkgNames, json.ignore),
    bumpVersionsWithWorkspaceProtocolOnly: !0 === json.bumpVersionsWithWorkspaceProtocolOnly,
    snapshot: {
      prereleaseTemplate: null !== (_json$snapshot$prerel = null === (_json$snapshot = json.snapshot) || void 0 === _json$snapshot ? void 0 : _json$snapshot.prereleaseTemplate) && void 0 !== _json$snapshot$prerel ? _json$snapshot$prerel : null,
      useCalculatedVersion: void 0 !== (null === (_json$snapshot2 = json.snapshot) || void 0 === _json$snapshot2 ? void 0 : _json$snapshot2.useCalculatedVersion) ? json.snapshot.useCalculatedVersion : void 0 !== (null === (_json$___experimental = json.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH) || void 0 === _json$___experimental ? void 0 : _json$___experimental.useCalculatedVersionForSnapshots) && (null === (_json$___experimental2 = json.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH) || void 0 === _json$___experimental2 ? void 0 : _json$___experimental2.useCalculatedVersionForSnapshots)
    },
    ___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH: {
      onlyUpdatePeerDependentsWhenOutOfRange: void 0 !== json.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH && void 0 !== json.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH.onlyUpdatePeerDependentsWhenOutOfRange && json.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH.onlyUpdatePeerDependentsWhenOutOfRange,
      updateInternalDependents: null !== (_json$___experimental3 = null === (_json$___experimental4 = json.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH) || void 0 === _json$___experimental4 ? void 0 : _json$___experimental4.updateInternalDependents) && void 0 !== _json$___experimental3 ? _json$___experimental3 : "out-of-range"
    },
    privatePackages: !1 === json.privatePackages ? {
      tag: !1,
      version: !1
    } : json.privatePackages ? {
      version: null === (_json$privatePackages = json.privatePackages.version) || void 0 === _json$privatePackages || _json$privatePackages,
      tag: null !== (_json$privatePackages2 = json.privatePackages.tag) && void 0 !== _json$privatePackages2 && _json$privatePackages2
    } : {
      version: !0,
      tag: !1
    }
  };
  if (!1 === config.privatePackages.version && !0 === config.privatePackages.tag) throw new errors.ValidationError("The `privatePackages.tag` option is set to `true` but `privatePackages.version` is set to `false`. This is not allowed.");
  return config;
}, fakePackage = {
  dir: "",
  packageJson: {
    name: "",
    version: ""
  }
}, defaultConfig = parse(defaultWrittenConfig, {
  root: fakePackage,
  tool: "root",
  packages: [ fakePackage ]
});

exports.defaultConfig = defaultConfig, exports.defaultWrittenConfig = defaultWrittenConfig, 
exports.parse = parse, exports.read = read;
