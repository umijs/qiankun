"use strict";

var meow = require("meow"), errors = require("@changesets/errors"), logger = require("@changesets/logger"), util = require("util"), fs = require("fs-extra"), path = require("path"), getPackages = require("@manypkg/get-packages"), getDependentsGraph = require("@changesets/get-dependents-graph"), config = require("@changesets/config"), chalk = require("chalk"), child_process = require("child_process"), termSize = require("term-size"), enquirer = require("enquirer"), externalEditor = require("external-editor"), ansiColors = require("ansi-colors"), git = require("@changesets/git"), writeChangeset = require("@changesets/write"), resolveFrom = require("resolve-from"), semver = require("semver"), outdent = require("outdent"), applyReleasePlan = require("@changesets/apply-release-plan"), readChangesets = require("@changesets/read"), assembleReleasePlan = require("@changesets/assemble-release-plan"), pre$1 = require("@changesets/pre"), pLimit = require("p-limit"), preferredPM = require("preferred-pm"), spawn = require("spawndamnit"), isCI = require("is-ci"), table = require("tty-table"), getReleasePlan = require("@changesets/get-release-plan");

function _interopDefault(e) {
  return e && e.__esModule ? e : {
    default: e
  };
}

var meow__default = _interopDefault(meow), fs__default = _interopDefault(fs), path__default = _interopDefault(path), chalk__default = _interopDefault(chalk), termSize__default = _interopDefault(termSize), writeChangeset__default = _interopDefault(writeChangeset), resolveFrom__default = _interopDefault(resolveFrom), semver__default = _interopDefault(semver), outdent__default = _interopDefault(outdent), applyReleasePlan__default = _interopDefault(applyReleasePlan), readChangesets__default = _interopDefault(readChangesets), assembleReleasePlan__default = _interopDefault(assembleReleasePlan), pLimit__default = _interopDefault(pLimit), preferredPM__default = _interopDefault(preferredPM), spawn__default = _interopDefault(spawn), isCI__default = _interopDefault(isCI), table__default = _interopDefault(table), getReleasePlan__default = _interopDefault(getReleasePlan);

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

const pkgPath = path__default.default.dirname(require.resolve("@changesets/cli/package.json")), defaultConfig = JSON.stringify(_objectSpread2(_objectSpread2({}, config.defaultWrittenConfig), {}, {
  baseBranch: "main"
}), null, 2) + "\n";

async function init(cwd) {
  const changesetBase = path__default.default.resolve(cwd, ".changeset");
  fs__default.default.existsSync(changesetBase) ? fs__default.default.existsSync(path__default.default.join(changesetBase, "config.json")) ? logger.warn("It looks like you already have changesets initialized. You should be able to run changeset commands no problems.") : (fs__default.default.existsSync(path__default.default.join(changesetBase, "config.js")) ? (logger.error("It looks like you're using the version 1 `.changeset/config.js` file"), 
  logger.error("The format of the config object has significantly changed in v2 as well"), 
  logger.error(" - we thoroughly recommend looking at the changelog for this package for what has changed"), 
  logger.error("Changesets will write the defaults for the new config, remember to transfer your options into the new config at `.changeset/config.json`")) : (logger.error("It looks like you don't have a config file"), 
  logger.info("The default config file will be written at `.changeset/config.json`")), 
  await fs__default.default.writeFile(path__default.default.resolve(changesetBase, "config.json"), defaultConfig)) : (await fs__default.default.copy(path__default.default.resolve(pkgPath, "./default-files"), changesetBase), 
  await fs__default.default.writeFile(path__default.default.resolve(changesetBase, "config.json"), defaultConfig), 
  logger.log(chalk__default.default`Thanks for choosing {green changesets} to help manage your versioning and publishing\n`), 
  logger.log("You should be set up to start using changesets now!\n"), logger.info("We have added a `.changeset` folder, and a couple of files to help you out:"), 
  logger.info(chalk__default.default`- {blue .changeset/README.md} contains information about using changesets`), 
  logger.info(chalk__default.default`- {blue .changeset/config.json} is our default config`));
}

const serialId = function() {
  let id = 0;
  return () => id++;
}(), limit = Math.max(termSize__default.default().rows - 5, 10);

let cancelFlow = () => {
  logger.success("Cancelled... 👋 "), process.exit();
};

async function askCheckboxPlus(message, choices, format) {
  const name = "CheckboxPlus-" + serialId();
  return enquirer.prompt({
    type: "autocomplete",
    name: name,
    message: message,
    prefix: logger.prefix,
    multiple: !0,
    choices: choices,
    format: format,
    limit: limit,
    onCancel: cancelFlow,
    symbols: {
      indicator: ansiColors.symbols.radioOff,
      checked: ansiColors.symbols.radioOn
    },
    indicator: (state, choice) => choice.enabled ? state.symbols.checked : state.symbols.indicator
  }).then((responses => responses[name])).catch((err => {
    logger.error(err);
  }));
}

async function askQuestion(message) {
  const name = "Question-" + serialId();
  return enquirer.prompt([ {
    type: "input",
    message: message,
    name: name,
    prefix: logger.prefix,
    onCancel: cancelFlow
  } ]).then((responses => responses[name])).catch((err => {
    logger.error(err);
  }));
}

function askQuestionWithEditor(message) {
  return externalEditor.edit(message, {
    postfix: ".md"
  }).replace(/^#.*\n?/gm, "").replace(/\n+$/g, "").trim();
}

async function askConfirm(message) {
  const name = "Confirm-" + serialId();
  return enquirer.prompt([ {
    message: message,
    name: name,
    prefix: logger.prefix,
    type: "confirm",
    initial: !0,
    onCancel: cancelFlow
  } ]).then((responses => responses[name])).catch((err => {
    logger.error(err);
  }));
}

async function askList(message, choices) {
  const name = "List-" + serialId();
  return enquirer.prompt([ {
    choices: choices,
    message: message,
    name: name,
    prefix: logger.prefix,
    type: "select",
    onCancel: cancelFlow
  } ]).then((responses => responses[name])).catch((err => {
    logger.error(err);
  }));
}

function getCommitFunctions(commit, cwd) {
  let commitFunctions = {};
  if (!commit) return [ commitFunctions, null ];
  let commitOpts = commit[1], changesetPath = path__default.default.join(cwd, ".changeset"), commitPath = resolveFrom__default.default(changesetPath, commit[0]), possibleCommitFunc = require(commitPath);
  if (possibleCommitFunc.default && (possibleCommitFunc = possibleCommitFunc.default), 
  "function" != typeof possibleCommitFunc.getAddMessage && "function" != typeof possibleCommitFunc.getVersionMessage) throw new Error("Could not resolve commit generation functions");
  return commitFunctions = possibleCommitFunc, [ commitFunctions, commitOpts ];
}

const {green: green, yellow: yellow, red: red, bold: bold, blue: blue, cyan: cyan} = chalk__default.default;

async function confirmMajorRelease(pkgJSON) {
  if (semver__default.default.lt(pkgJSON.version, "1.0.0")) {
    return logger.log(yellow(`WARNING: Releasing a major version for ${green(pkgJSON.name)} will be its ${red("first major release")}.`)), 
    logger.log(yellow(`If you are unsure if this is correct, contact the package's maintainers ${red("before committing this changeset")}.`)), 
    await askConfirm(bold(`Are you sure you want to release the ${red("first major version")} of ${pkgJSON.name}?`));
  }
  return !0;
}

async function getPackagesToRelease(changedPackages, allPackages) {
  function askInitialReleaseQuestion(defaultChoiceList) {
    return askCheckboxPlus("Which packages would you like to include?", defaultChoiceList, (x => Array.isArray(x) ? x.filter((x => "changed packages" !== x && "unchanged packages" !== x)).map((x => cyan(x))).join(", ") : x));
  }
  if (allPackages.length > 1) {
    const unchangedPackagesNames = allPackages.map((({packageJson: packageJson}) => packageJson.name)).filter((name => !changedPackages.includes(name))), defaultChoiceList = [ {
      name: "changed packages",
      choices: changedPackages
    }, {
      name: "unchanged packages",
      choices: unchangedPackagesNames
    } ].filter((({choices: choices}) => 0 !== choices.length));
    let packagesToRelease = await askInitialReleaseQuestion(defaultChoiceList);
    if (0 === packagesToRelease.length) do {
      logger.error("You must select at least one package to release"), logger.error("(You most likely hit enter instead of space!)"), 
      packagesToRelease = await askInitialReleaseQuestion(defaultChoiceList);
    } while (0 === packagesToRelease.length);
    return packagesToRelease.filter((pkgName => "changed packages" !== pkgName && "unchanged packages" !== pkgName));
  }
  return [ allPackages[0].packageJson.name ];
}

function getPkgJsonsByName(packages) {
  return new Map(packages.map((({packageJson: packageJson}) => [ packageJson.name, packageJson ])));
}

function formatPkgNameAndVersion(pkgName, version) {
  return `${bold(pkgName)}@${bold(version)}`;
}

async function createChangeset(changedPackages, allPackages) {
  const releases = [];
  if (allPackages.length > 1) {
    const packagesToRelease = await getPackagesToRelease(changedPackages, allPackages);
    let pkgJsonsByName = getPkgJsonsByName(allPackages), pkgsLeftToGetBumpTypeFor = new Set(packagesToRelease), pkgsThatShouldBeMajorBumped = (await askCheckboxPlus(bold(`Which packages should have a ${red("major")} bump?`), [ {
      name: "all packages",
      choices: packagesToRelease.map((pkgName => ({
        name: pkgName,
        message: formatPkgNameAndVersion(pkgName, pkgJsonsByName.get(pkgName).version)
      })))
    } ], (x => Array.isArray(x) ? x.filter((x => "all packages" !== x)).map((x => cyan(x))).join(", ") : x))).filter((x => "all packages" !== x));
    for (const pkgName of pkgsThatShouldBeMajorBumped) {
      let pkgJson = pkgJsonsByName.get(pkgName);
      await confirmMajorRelease(pkgJson) && (pkgsLeftToGetBumpTypeFor.delete(pkgName), 
      releases.push({
        name: pkgName,
        type: "major"
      }));
    }
    if (0 !== pkgsLeftToGetBumpTypeFor.size) {
      let pkgsThatShouldBeMinorBumped = (await askCheckboxPlus(bold(`Which packages should have a ${green("minor")} bump?`), [ {
        name: "all packages",
        choices: [ ...pkgsLeftToGetBumpTypeFor ].map((pkgName => ({
          name: pkgName,
          message: formatPkgNameAndVersion(pkgName, pkgJsonsByName.get(pkgName).version)
        })))
      } ], (x => Array.isArray(x) ? x.filter((x => "all packages" !== x)).map((x => cyan(x))).join(", ") : x))).filter((x => "all packages" !== x));
      for (const pkgName of pkgsThatShouldBeMinorBumped) pkgsLeftToGetBumpTypeFor.delete(pkgName), 
      releases.push({
        name: pkgName,
        type: "minor"
      });
    }
    if (0 !== pkgsLeftToGetBumpTypeFor.size) {
      logger.log(`The following packages will be ${blue("patch")} bumped:`), pkgsLeftToGetBumpTypeFor.forEach((pkgName => {
        logger.log(formatPkgNameAndVersion(pkgName, pkgJsonsByName.get(pkgName).version));
      }));
      for (const pkgName of pkgsLeftToGetBumpTypeFor) releases.push({
        name: pkgName,
        type: "patch"
      });
    }
  } else {
    let pkg = allPackages[0], type = await askList(`What kind of change is this for ${green(pkg.packageJson.name)}? (current version is ${pkg.packageJson.version})`, [ "patch", "minor", "major" ]);
    if ("major" === type) {
      if (!await confirmMajorRelease(pkg.packageJson)) throw new errors.ExitError(1);
    }
    releases.push({
      name: pkg.packageJson.name,
      type: type
    });
  }
  logger.log("Please enter a summary for this change (this will be in the changelogs)."), 
  logger.log(chalk__default.default.gray("  (submit empty line to open external editor)"));
  let summary = await askQuestion("Summary");
  if (0 === summary.length) {
    try {
      if (summary = askQuestionWithEditor("\n\n# Please enter a summary for your changes.\n# An empty message aborts the editor."), 
      summary.length > 0) return {
        confirmed: !0,
        summary: summary,
        releases: releases
      };
    } catch (err) {
      logger.log("An error happened using external editor. Please type your summary here:");
    }
    for (summary = await askQuestion(""); 0 === summary.length; ) summary = await askQuestion("\n\n# A summary is required for the changelog! 😪");
  }
  return {
    confirmed: !1,
    summary: summary,
    releases: releases
  };
}

function printConfirmationMessage(changeset, repoHasMultiplePackages) {
  function getReleasesOfType(type) {
    return changeset.releases.filter((release => release.type === type)).map((release => release.name));
  }
  logger.log("\n=== Summary of changesets ===");
  const majorReleases = getReleasesOfType("major"), minorReleases = getReleasesOfType("minor"), patchReleases = getReleasesOfType("patch");
  if (majorReleases.length > 0 && logger.log(`${chalk__default.default.bold.green("major")}:  ${majorReleases.join(", ")}`), 
  minorReleases.length > 0 && logger.log(`${chalk__default.default.bold.green("minor")}:  ${minorReleases.join(", ")}`), 
  patchReleases.length > 0 && logger.log(`${chalk__default.default.bold.green("patch")}:  ${patchReleases.join(", ")}`), 
  logger.log(""), repoHasMultiplePackages) {
    const message = outdent__default.default`
      Note: All dependents of these packages that will be incompatible with
      the new version will be ${chalk__default.default.redBright("patch bumped")} when this changeset is applied.
    `;
    logger.log(message + "\n");
  }
}

function isListablePackage(config, packageJson) {
  if (config.ignore.includes(packageJson.name)) return !1;
  if (!config.privatePackages.version && packageJson.private) return !1;
  return !!packageJson.version;
}

async function add(cwd, {empty: empty, open: open}, config) {
  const packages = await getPackages.getPackages(cwd);
  if (0 === packages.packages.length) throw new Error(`No packages found. You might have ${packages.tool} workspaces configured but no packages yet?`);
  const listablePackages = packages.packages.filter((pkg => isListablePackage(config, pkg.packageJson))), changesetBase = path__default.default.resolve(cwd, ".changeset");
  let newChangeset;
  if (empty) newChangeset = {
    confirmed: !0,
    releases: [],
    summary: ""
  }; else {
    const changedPackagesName = (await git.getChangedPackagesSinceRef({
      cwd: cwd,
      ref: config.baseBranch,
      changedFilePatterns: config.changedFilePatterns
    })).filter((pkg => isListablePackage(config, pkg.packageJson))).map((pkg => pkg.packageJson.name));
    newChangeset = await createChangeset(changedPackagesName, listablePackages), printConfirmationMessage(newChangeset, listablePackages.length > 1), 
    newChangeset.confirmed || (newChangeset = _objectSpread2(_objectSpread2({}, newChangeset), {}, {
      confirmed: await askConfirm("Is this your desired changeset?")
    }));
  }
  if (newChangeset.confirmed) {
    const changesetID = await writeChangeset__default.default(newChangeset, cwd), [{getAddMessage: getAddMessage}, commitOpts] = getCommitFunctions(config.commit, cwd);
    getAddMessage ? (await git.add(path__default.default.resolve(changesetBase, changesetID + ".md"), cwd), 
    await git.commit(await getAddMessage(newChangeset, commitOpts), cwd), logger.log(chalk__default.default.green((empty ? "Empty " : "") + "Changeset added and committed"))) : logger.log(chalk__default.default.green((empty ? "Empty " : "") + "Changeset added! - you can now commit it\n")), 
    [ ...newChangeset.releases ].find((c => "major" === c.type)) ? (logger.warn("This Changeset includes a major change and we STRONGLY recommend adding more information to the changeset:"), 
    logger.warn("WHAT the breaking change is"), logger.warn("WHY the change was made"), 
    logger.warn("HOW a consumer should update their code")) : logger.log(chalk__default.default.green("If you want to modify or expand on the changeset summary, you can find it here"));
    const changesetPath = path__default.default.resolve(changesetBase, changesetID + ".md");
    if (logger.info(chalk__default.default.blue(changesetPath)), open) {
      const externalEditor$1 = new externalEditor.ExternalEditor;
      externalEditor$1.cleanup(), child_process.spawn(externalEditor$1.editor.bin, externalEditor$1.editor.args.concat([ changesetPath ]), {
        detached: !0,
        stdio: "inherit"
      });
    }
  }
}

const removeEmptyFolders = async folderPath => {
  const dirContents = fs__default.default.readdirSync(folderPath);
  return Promise.all(dirContents.map((async contentPath => {
    const singleChangesetPath = path__default.default.resolve(folderPath, contentPath);
    try {
      (await fs__default.default.readdir(singleChangesetPath)).length < 1 && await fs__default.default.rmdir(singleChangesetPath);
    } catch (err) {
      if ("ENOTDIR" !== err.code) throw err;
    }
  })));
};

let importantSeparator = chalk__default.default.red("===============================IMPORTANT!==============================="), importantEnd = chalk__default.default.red("----------------------------------------------------------------------");

async function version(cwd, options, config) {
  var _config$snapshot$prer;
  const releaseConfig = _objectSpread2(_objectSpread2({}, config), {}, {
    commit: !options.snapshot && config.commit
  }), [changesets, preState] = await Promise.all([ readChangesets__default.default(cwd), pre$1.readPreState(cwd), removeEmptyFolders(path__default.default.resolve(cwd, ".changeset")) ]);
  if ("pre" === (null == preState ? void 0 : preState.mode)) {
    if (logger.warn(importantSeparator), void 0 !== options.snapshot) throw logger.error("Snapshot release is not allowed in pre mode"), 
    logger.log("To resolve this exit the pre mode by running `changeset pre exit`"), 
    new errors.ExitError(1);
    logger.warn("You are in prerelease mode"), logger.warn("If you meant to do a normal release you should revert these changes and run `changeset pre exit`"), 
    logger.warn("You can then run `changeset version` again to do a normal release"), 
    logger.warn(importantEnd);
  }
  if (0 === changesets.length && (void 0 === preState || "exit" !== preState.mode)) return void logger.warn("No unreleased changesets found, exiting.");
  let packages = await getPackages.getPackages(cwd), releasePlan = assembleReleasePlan__default.default(changesets, packages, releaseConfig, preState, options.snapshot ? {
    tag: !0 === options.snapshot ? void 0 : options.snapshot,
    commit: null !== (_config$snapshot$prer = config.snapshot.prereleaseTemplate) && void 0 !== _config$snapshot$prer && _config$snapshot$prer.includes("{commit}") ? await git.getCurrentCommitId({
      cwd: cwd,
      short: !0
    }) : void 0
  } : void 0), [...touchedFiles] = await applyReleasePlan__default.default(releasePlan, packages, releaseConfig, options.snapshot);
  const [{getVersionMessage: getVersionMessage}, commitOpts] = getCommitFunctions(releaseConfig.commit, cwd);
  if (getVersionMessage) {
    let touchedFile;
    for (;touchedFile = touchedFiles.shift(); ) await git.add(path__default.default.relative(cwd, touchedFile), cwd);
    await git.commit(await getVersionMessage(releasePlan, commitOpts), cwd) ? logger.log("All files have been updated and committed. You're ready to publish!") : logger.error("Changesets ran into trouble committing your files");
  } else logger.log("All files have been updated. Review them and commit at your leisure");
}

const getLastJsonObjectFromString = str => {
  for (str = str.replace(/[^}]*$/, ""); str; ) {
    str = str.replace(/[^{]*/, "");
    try {
      return JSON.parse(str);
    } catch (err) {
      str = str.slice(1);
    }
  }
  return null;
}, npmRequestLimit = pLimit__default.default(40), npmPublishLimit = pLimit__default.default(10);

function jsonParse(input) {
  try {
    return JSON.parse(input);
  } catch (err) {
    throw err instanceof SyntaxError && console.error("error parsing json:", input), 
    err;
  }
}

function getCorrectRegistry(packageJson) {
  var _packageJson$publishC, _packageJson$publishC2;
  const registry = null !== (_packageJson$publishC = null == packageJson || null === (_packageJson$publishC2 = packageJson.publishConfig) || void 0 === _packageJson$publishC2 ? void 0 : _packageJson$publishC2.registry) && void 0 !== _packageJson$publishC ? _packageJson$publishC : process.env.npm_config_registry;
  return registry && "https://registry.yarnpkg.com" !== registry ? registry : "https://registry.npmjs.org";
}

async function getPublishTool(cwd) {
  const pm = await preferredPM__default.default(cwd);
  if (!pm || "pnpm" !== pm.name) return {
    name: "npm"
  };
  try {
    let version = (await spawn__default.default("pnpm", [ "--version" ], {
      cwd: cwd
    })).stdout.toString().trim(), parsed = semver__default.default.parse(version);
    return {
      name: "pnpm",
      shouldAddNoGitChecks: void 0 !== (null == parsed ? void 0 : parsed.major) && parsed.major >= 5
    };
  } catch (e) {
    return {
      name: "pnpm",
      shouldAddNoGitChecks: !1
    };
  }
}

async function getTokenIsRequired() {
  const envOverride = {
    npm_config_registry: getCorrectRegistry()
  };
  let result = await spawn__default.default("npm", [ "profile", "get", "--json" ], {
    env: Object.assign({}, process.env, envOverride)
  });
  if (0 !== result.code) return logger.error("error while checking if token is required", result.stderr.toString().trim() || result.stdout.toString().trim()), 
  !1;
  let json = jsonParse(result.stdout.toString());
  return !(json.error || !json.tfa || !json.tfa.mode) && "auth-and-writes" === json.tfa.mode;
}

function getPackageInfo(packageJson) {
  return npmRequestLimit((async () => {
    logger.info("npm info " + packageJson.name);
    let result = await spawn__default.default("npm", [ "info", packageJson.name, "--registry", getCorrectRegistry(packageJson), "--json" ]);
    return "" === result.stdout.toString() ? {
      error: {
        code: "E404"
      }
    } : jsonParse(result.stdout.toString());
  }));
}

async function infoAllow404(packageJson) {
  var _pkgInfo$error;
  let pkgInfo = await getPackageInfo(packageJson);
  if ("E404" === (null === (_pkgInfo$error = pkgInfo.error) || void 0 === _pkgInfo$error ? void 0 : _pkgInfo$error.code)) return logger.warn("Received 404 for npm info " + chalk__default.default.cyan(`"${packageJson.name}"`)), 
  {
    published: !1,
    pkgInfo: {}
  };
  if (pkgInfo.error) throw logger.error(`Received an unknown error code: ${pkgInfo.error.code} for npm info ${chalk__default.default.cyan(`"${packageJson.name}"`)}`), 
  logger.error(pkgInfo.error.summary), pkgInfo.error.detail && logger.error(pkgInfo.error.detail), 
  new errors.ExitError(1);
  return {
    published: !0,
    pkgInfo: pkgInfo
  };
}

let otpAskLimit = pLimit__default.default(1), askForOtpCode = twoFactorState => otpAskLimit((async () => {
  if (null !== twoFactorState.token) return twoFactorState.token;
  logger.info("This operation requires a one-time password from your authenticator.");
  let val = await askQuestion("Enter one-time password:");
  return twoFactorState.token = val, val;
})), getOtpCode = async twoFactorState => null !== twoFactorState.token ? twoFactorState.token : askForOtpCode(twoFactorState);

async function internalPublish(pkgName, opts, twoFactorState) {
  let publishTool = await getPublishTool(opts.cwd), publishFlags = opts.access ? [ "--access", opts.access ] : [];
  if (publishFlags.push("--tag", opts.tag), await twoFactorState.isRequired && !isCI__default.default) {
    let otpCode = await getOtpCode(twoFactorState);
    publishFlags.push("--otp", otpCode);
  }
  "pnpm" === publishTool.name && publishTool.shouldAddNoGitChecks && publishFlags.push("--no-git-checks");
  const envOverride = {
    npm_config_registry: getCorrectRegistry()
  };
  let {code: code, stdout: stdout, stderr: stderr} = "pnpm" === publishTool.name ? await spawn__default.default("pnpm", [ "publish", "--json", ...publishFlags ], {
    env: Object.assign({}, process.env, envOverride),
    cwd: opts.cwd
  }) : await spawn__default.default(publishTool.name, [ "publish", opts.publishDir, "--json", ...publishFlags ], {
    env: Object.assign({}, process.env, envOverride)
  });
  if (0 !== code) {
    let json = getLastJsonObjectFromString(stderr.toString()) || getLastJsonObjectFromString(stdout.toString());
    if (null != json && json.error) {
      if (("EOTP" === json.error.code || "E401" === json.error.code && json.error.detail.includes("--otp=<code>")) && !isCI__default.default) return null !== twoFactorState.token && (twoFactorState.token = null), 
      twoFactorState.isRequired = Promise.resolve(!0), internalPublish(pkgName, opts, twoFactorState);
      logger.error(`an error occurred while publishing ${pkgName}: ${json.error.code}`, json.error.summary, json.error.detail ? "\n" + json.error.detail : "");
    }
    return logger.error(stderr.toString() || stdout.toString()), {
      published: !1
    };
  }
  return {
    published: !0
  };
}

function publish(pkgName, opts, twoFactorState) {
  return npmRequestLimit((() => npmPublishLimit((() => internalPublish(pkgName, opts, twoFactorState)))));
}

function getReleaseTag(pkgInfo, preState, tag) {
  return tag || (void 0 !== preState && "only-pre" !== pkgInfo.publishedState ? preState.tag : "latest");
}

const isCustomRegistry = registry => !!registry && "https://registry.npmjs.org" !== registry && "https://registry.yarnpkg.com" !== registry, getTwoFactorState = ({otp: otp, publicPackages: publicPackages}) => otp ? {
  token: otp,
  isRequired: Promise.resolve(!0)
} : isCI__default.default || publicPackages.some((pkg => {
  var _pkg$packageJson$publ;
  return isCustomRegistry(null === (_pkg$packageJson$publ = pkg.packageJson.publishConfig) || void 0 === _pkg$packageJson$publ ? void 0 : _pkg$packageJson$publ.registry);
})) || isCustomRegistry(process.env.npm_config_registry) ? {
  token: null,
  isRequired: Promise.resolve(!1)
} : {
  token: null,
  isRequired: getTokenIsRequired()
};

async function publishPackages({packages: packages, access: access, otp: otp, preState: preState, tag: tag}) {
  const packagesByName = new Map(packages.map((x => [ x.packageJson.name, x ]))), publicPackages = packages.filter((pkg => !pkg.packageJson.private)), unpublishedPackagesInfo = await getUnpublishedPackages(publicPackages, preState);
  if (0 === unpublishedPackagesInfo.length) return [];
  const twoFactorState = getTwoFactorState({
    otp: otp,
    publicPackages: publicPackages
  });
  return Promise.all(unpublishedPackagesInfo.map((pkgInfo => publishAPackage(packagesByName.get(pkgInfo.name), access, twoFactorState, getReleaseTag(pkgInfo, preState, tag)))));
}

async function publishAPackage(pkg, access, twoFactorState, tag) {
  const {name: name, version: version, publishConfig: publishConfig} = pkg.packageJson;
  logger.info(`Publishing ${chalk__default.default.cyan(`"${name}"`)} at ${chalk__default.default.green(`"${version}"`)}`);
  return {
    name: name,
    newVersion: version,
    published: (await publish(name, {
      cwd: pkg.dir,
      publishDir: null != publishConfig && publishConfig.directory ? path.join(pkg.dir, publishConfig.directory) : pkg.dir,
      access: (null == publishConfig ? void 0 : publishConfig.access) || access,
      tag: tag
    }, twoFactorState)).published
  };
}

async function getUnpublishedPackages(packages, preState) {
  const results = await Promise.all(packages.map((async ({packageJson: packageJson}) => {
    const response = await infoAllow404(packageJson);
    let publishedState = "never";
    return response.published && (publishedState = "published", void 0 !== preState && response.pkgInfo.versions && response.pkgInfo.versions.every((version => semver__default.default.parse(version).prerelease[0] === preState.tag)) && (publishedState = "only-pre")), 
    {
      name: packageJson.name,
      localVersion: packageJson.version,
      publishedState: publishedState,
      publishedVersions: response.pkgInfo.versions || []
    };
  }))), packagesToPublish = [];
  for (const pkgInfo of results) {
    const {name: name, publishedState: publishedState, localVersion: localVersion, publishedVersions: publishedVersions} = pkgInfo;
    publishedVersions.includes(localVersion) ? logger.warn(`${name} is not being published because version ${localVersion} is already published on npm`) : (packagesToPublish.push(pkgInfo), 
    logger.info(`${name} is being published because our local version (${localVersion}) has not been published on npm`), 
    void 0 !== preState && "only-pre" === publishedState && logger.info(`${name} is being published to ${chalk__default.default.cyan("latest")} rather than ${chalk__default.default.cyan(preState.tag)} because there has not been a regular release of it yet`));
  }
  return packagesToPublish;
}

async function getUntaggedPrivatePackages(privatePackages, cwd, tool) {
  const packageWithTags = await Promise.all(privatePackages.map((async privatePkg => {
    const tagName = "root" === tool ? "v" + privatePkg.packageJson.version : `${privatePkg.packageJson.name}@${privatePkg.packageJson.version}`;
    return {
      pkg: privatePkg,
      isMissingTag: !(await git.tagExists(tagName, cwd) || await git.remoteTagExists(tagName))
    };
  }))), untagged = [];
  for (const packageWithTag of packageWithTags) packageWithTag.isMissingTag && untagged.push({
    name: packageWithTag.pkg.packageJson.name,
    newVersion: packageWithTag.pkg.packageJson.version,
    published: !1
  });
  return untagged;
}

function logReleases(pkgs) {
  const mappedPkgs = pkgs.map((p => `${p.name}@${p.newVersion}`)).join("\n");
  logger.log(mappedPkgs);
}

let importantSeparator$1 = chalk__default.default.red("===============================IMPORTANT!==============================="), importantEnd$1 = chalk__default.default.red("----------------------------------------------------------------------");

function showNonLatestTagWarning(tag, preState) {
  logger.warn(importantSeparator$1), preState ? logger.warn(`You are in prerelease mode so packages will be published to the ${chalk__default.default.cyan(preState.tag)}\n        dist tag except for packages that have not had normal releases which will be published to ${chalk__default.default.cyan("latest")}`) : "latest" !== tag && logger.warn(`Packages will be released under the ${tag} tag`), 
  logger.warn(importantEnd$1);
}

async function run(cwd, {otp: otp, tag: tag, gitTag: gitTag = !0}, config) {
  const releaseTag = tag && tag.length > 0 ? tag : void 0;
  let preState = await pre$1.readPreState(cwd);
  if (releaseTag && preState && "pre" === preState.mode) throw logger.error("Releasing under custom tag is not allowed in pre mode"), 
  logger.log("To resolve this exit the pre mode by running `changeset pre exit`"), 
  new errors.ExitError(1);
  (releaseTag || preState) && showNonLatestTagWarning(tag, preState);
  const {packages: packages, tool: tool} = await getPackages.getPackages(cwd), tagPrivatePackages = config.privatePackages && config.privatePackages.tag, publishedPackages = await publishPackages({
    packages: packages,
    access: config.access,
    otp: otp,
    preState: preState,
    tag: releaseTag
  }), privatePackages = packages.filter((pkg => pkg.packageJson.private && pkg.packageJson.version)), untaggedPrivatePackageReleases = tagPrivatePackages ? await getUntaggedPrivatePackages(privatePackages, cwd, tool) : [];
  0 === publishedPackages.length && 0 === untaggedPrivatePackageReleases.length && logger.warn("No unpublished projects to publish");
  const successfulNpmPublishes = publishedPackages.filter((p => p.published)), unsuccessfulNpmPublishes = publishedPackages.filter((p => !p.published));
  if (successfulNpmPublishes.length > 0 && (logger.success("packages published successfully:"), 
  logReleases(successfulNpmPublishes), gitTag && (logger.log(`Creating git tag${successfulNpmPublishes.length > 1 ? "s" : ""}...`), 
  await tagPublish(tool, successfulNpmPublishes, cwd))), untaggedPrivatePackageReleases.length > 0 && (logger.success("found untagged projects:"), 
  logReleases(untaggedPrivatePackageReleases), await tagPublish(tool, untaggedPrivatePackageReleases, cwd)), 
  unsuccessfulNpmPublishes.length > 0) throw logger.error("packages failed to publish:"), 
  logReleases(unsuccessfulNpmPublishes), new errors.ExitError(1);
}

async function tagPublish(tool, packageReleases, cwd) {
  if ("root" !== tool) for (const pkg of packageReleases) {
    const tag = `${pkg.name}@${pkg.newVersion}`;
    logger.log("New tag: ", tag), await git.tag(tag, cwd);
  } else {
    const tag = "v" + packageReleases[0].newVersion;
    logger.log("New tag: ", tag), await git.tag(tag, cwd);
  }
}

async function getStatus(cwd, {sinceMaster: sinceMaster, since: since, verbose: verbose, output: output}, config) {
  sinceMaster && (logger.warn("--sinceMaster is deprecated and will be removed in a future major version"), 
  logger.warn("Use --since=master instead"));
  const sinceBranch = void 0 === since ? sinceMaster ? "master" : void 0 : since, releasePlan = await getReleasePlan__default.default(cwd, sinceBranch, config), {changesets: changesets, releases: releases} = releasePlan;
  if ((await git.getChangedPackagesSinceRef({
    cwd: cwd,
    ref: sinceBranch || config.baseBranch,
    changedFilePatterns: config.changedFilePatterns
  })).length > 0 && 0 === changesets.length && (logger.error("Some packages have been changed but no changesets were found. Run `changeset add` to resolve this error."), 
  logger.error("If this change doesn't need a release, run `changeset add --empty`."), 
  process.exit(1)), output) return void await fs__default.default.writeFile(path__default.default.join(cwd, output), JSON.stringify(releasePlan, void 0, 2));
  const print = verbose ? verbosePrint : SimplePrint;
  return print("patch", releases), logger.log("---"), print("minor", releases), logger.log("---"), 
  print("major", releases), releasePlan;
}

function SimplePrint(type, releases) {
  const packages = releases.filter((r => r.type === type));
  if (packages.length) {
    logger.info(chalk__default.default`Packages to be bumped at {green ${type}}:\n`);
    const pkgs = packages.map((({name: name}) => "- " + name)).join("\n");
    logger.log(chalk__default.default.green(pkgs));
  } else logger.info(chalk__default.default`{red NO} packages to be bumped at {green ${type}}`);
}

function verbosePrint(type, releases) {
  const packages = releases.filter((r => r.type === type));
  if (packages.length) {
    logger.info(chalk__default.default`Packages to be bumped at {green ${type}}`);
    const columns = packages.map((({name: name, newVersion: version, changesets: changesets}) => [ chalk__default.default.green(name), version, changesets.map((c => chalk__default.default.blue(` .changeset/${c}.md`))).join(" +") ])), t1 = table__default.default([ {
      value: "Package Name",
      width: 20
    }, {
      value: "New Version",
      width: 20
    }, {
      value: "Related Changeset Summaries",
      width: 70
    } ], columns, {
      paddingLeft: 1,
      paddingRight: 0,
      headerAlign: "center",
      align: "left"
    });
    logger.log(t1.render() + "\n");
  } else logger.info(chalk__default.default`Running release would release {red NO} packages as a {green ${type}}`);
}

async function pre(cwd, options) {
  if ("enter" === options.command) try {
    await pre$1.enterPre(cwd, options.tag), logger.success("Entered pre mode with tag " + chalk__default.default.cyan(options.tag)), 
    logger.info("Run `changeset version` to version packages with prerelease versions");
  } catch (err) {
    if (err instanceof errors.PreEnterButInPreModeError) throw logger.error("`changeset pre enter` cannot be run when in pre mode"), 
    logger.info("If you're trying to exit pre mode, run `changeset pre exit`"), new errors.ExitError(1);
    throw err;
  } else try {
    await pre$1.exitPre(cwd), logger.success("Exited pre mode"), logger.info("Run `changeset version` to version packages with normal versions");
  } catch (err) {
    if (err instanceof errors.PreExitButNotInPreModeError) throw logger.error("`changeset pre exit` can only be run when in pre mode"), 
    logger.info("If you're trying to enter pre mode, run `changeset pre enter`"), new errors.ExitError(1);
    throw err;
  }
}

async function run$1(cwd) {
  const {packages: packages, tool: tool} = await getPackages.getPackages(cwd), allExistingTags = await git.getAllTags(cwd);
  for (const pkg of packages) {
    const tag = "root" !== tool ? `${pkg.packageJson.name}@${pkg.packageJson.version}` : "v" + pkg.packageJson.version;
    allExistingTags.has(tag) ? logger.log("Skipping tag (already exists): ", tag) : (logger.log("New tag: ", tag), 
    await git.tag(tag, cwd));
  }
}

async function run$2(input, flags, cwd) {
  if ("init" === input[0]) return void await init(cwd);
  if (!fs__default.default.existsSync(path__default.default.resolve(cwd, ".changeset"))) throw logger.error("There is no .changeset folder. "), 
  logger.error("If this is the first time `changesets` have been used in this project, run `yarn changeset init` to get set up."), 
  logger.error("If you expected there to be changesets, you should check git history for when the folder was removed to ensure you do not lose any configuration."), 
  new errors.ExitError(1);
  const packages = await getPackages.getPackages(cwd);
  let config$1;
  try {
    config$1 = await config.read(cwd, packages);
  } catch (e) {
    throw await fs__default.default.pathExists(path__default.default.resolve(cwd, ".changeset/config.js")) ? (logger.error("It looks like you're using the version 1 `.changeset/config.js` file"), 
    logger.error("You'll need to convert it to a `.changeset/config.json` file"), logger.error("The format of the config object has significantly changed in v2 as well"), 
    logger.error(" - we thoroughly recommend looking at the changelog for this package for what has changed"), 
    new errors.ExitError(1)) : e;
  }
  if (input.length < 1) {
    const {empty: empty, open: open} = flags;
    await add(cwd, {
      empty: empty,
      open: open
    }, config$1);
  } else if ("pre" !== input[0] && input.length > 1) logger.error("Too many arguments passed to changesets - we only accept the command name as an argument"); else {
    const {sinceMaster: sinceMaster, since: since, verbose: verbose, output: output, otp: otp, empty: empty, ignore: ignore, snapshot: snapshot, snapshotPrereleaseTemplate: snapshotPrereleaseTemplate, tag: tag, open: open, gitTag: gitTag} = flags;
    switch ([ "updateChangelog", "isPublic", "skipCI", "commit" ].forEach((flag => {
      if (flags[flag]) throw logger.error(`the flag ${flag} has been removed from changesets for version 2`), 
      logger.error("Please encode the desired value into your config"), logger.error("See our changelog for more details"), 
      new errors.ExitError(1);
    })), input[0]) {
     case "add":
      return void await add(cwd, {
        empty: empty,
        open: open
      }, config$1);

     case "version":
      {
        let ignoreArrayFromCmd;
        ignoreArrayFromCmd = "string" == typeof ignore ? [ ignore ] : ignore;
        let pkgNames = new Set(packages.packages.map((({packageJson: packageJson}) => packageJson.name)));
        const messages = [];
        for (const pkgName of ignoreArrayFromCmd || []) pkgNames.has(pkgName) || messages.push(`The package "${pkgName}" is passed to the \`--ignore\` option but it is not found in the project. You may have misspelled the package name.`);
        config$1.ignore.length > 0 && ignoreArrayFromCmd ? messages.push("It looks like you are trying to use the `--ignore` option while ignore is defined in the config file. This is currently not allowed, you can only use one of them at a time.") : ignoreArrayFromCmd && (config$1.ignore = ignoreArrayFromCmd);
        const dependentsGraph = getDependentsGraph.getDependentsGraph(packages, {
          bumpVersionsWithWorkspaceProtocolOnly: config$1.bumpVersionsWithWorkspaceProtocolOnly
        });
        for (const ignoredPackage of config$1.ignore) {
          const dependents = dependentsGraph.get(ignoredPackage) || [];
          for (const dependent of dependents) config$1.ignore.includes(dependent) || messages.push(`The package "${dependent}" depends on the ignored package "${ignoredPackage}", but "${dependent}" is not being ignored. Please pass "${dependent}" to the \`--ignore\` flag.`);
        }
        if (messages.length > 0) throw logger.error(messages.join("\n")), new errors.ExitError(1);
        return snapshotPrereleaseTemplate && (config$1.snapshot.prereleaseTemplate = snapshotPrereleaseTemplate), 
        void await version(cwd, {
          snapshot: snapshot
        }, config$1);
      }

     case "publish":
      return void await run(cwd, {
        otp: otp,
        tag: tag,
        gitTag: gitTag
      }, config$1);

     case "status":
      return void await getStatus(cwd, {
        sinceMaster: sinceMaster,
        since: since,
        verbose: verbose,
        output: output
      }, config$1);

     case "tag":
      return void await run$1(cwd);

     case "pre":
      {
        let command = input[1];
        if ("enter" !== command && "exit" !== command) throw logger.error("`enter`, `exit` or `snapshot` must be passed after prerelease"), 
        new errors.ExitError(1);
        let tag = input[2];
        if ("enter" === command && "string" != typeof tag) throw logger.error("A tag must be passed when using prerelese enter"), 
        new errors.ExitError(1);
        return void await pre(cwd, {
          command: command,
          tag: tag
        });
      }

     case "bump":
      throw logger.error('In version 2 of changesets, "bump" has been renamed to "version" - see our changelog for an explanation'), 
      logger.error("To fix this, use `changeset version` instead, and update any scripts that use changesets"), 
      new errors.ExitError(1);

     case "release":
      throw logger.error('In version 2 of changesets, "release" has been renamed to "publish" - see our changelog for an explanation'), 
      logger.error("To fix this, use `changeset publish` instead, and update any scripts that use changesets"), 
      new errors.ExitError(1);

     default:
      throw logger.error(`Invalid command ${input[0]} was provided`), new errors.ExitError(1);
    }
  }
}

const {input: input, flags: flags} = meow__default.default("\n  Usage\n    $ changeset [command]\n  Commands\n    init\n    add [--empty] [--open]\n    version [--ignore] [--snapshot <?name>] [--snapshot-prerelease-template <template>]\n    publish [--tag <name>] [--otp <code>] [--no-git-tag]\n    status [--since <branch>] [--verbose] [--output JSON_FILE.json]\n    pre <enter|exit> <tag>\n    tag\n    ", {
  flags: {
    sinceMaster: {
      type: "boolean"
    },
    verbose: {
      type: "boolean",
      alias: "v"
    },
    output: {
      type: "string",
      alias: "o"
    },
    otp: {
      type: "string"
    },
    empty: {
      type: "boolean"
    },
    since: {
      type: "string"
    },
    ignore: {
      type: "string",
      isMultiple: !0
    },
    tag: {
      type: "string"
    },
    open: {
      type: "boolean"
    },
    gitTag: {
      type: "boolean",
      default: !0
    },
    snapshotPrereleaseTemplate: {
      type: "string"
    }
  }
}), cwd = process.cwd();

run$2(input, flags, cwd).catch((err => {
  if (err instanceof errors.InternalError && (logger.error("The following error is an internal unexpected error, these should never happen."), 
  logger.error("Please open an issue with the following link"), logger.error(`https://github.com/changesets/changesets/issues/new?title=${encodeURIComponent(`Unexpected error during ${input[0] || "add"} command`)}&body=${encodeURIComponent(`## Error\n\n\`\`\`\n${util.format("", err).replace(process.cwd(), "<cwd>")}\n\`\`\`\n\n## Versions\n\n- @changesets/cli@${require("@changesets/cli/package.json").version}\n- node@${process.version}\n\n## Extra details\n\n\x3c!-- Add any extra details of what you were doing, ideas you have about what might have caused the error and reproduction steps if possible. If you have a repository we can look at that would be great. 😁 --\x3e\n`)}`)), 
  err instanceof errors.ExitError) return process.exit(err.code);
  logger.error(err), process.exit(1);
}));
