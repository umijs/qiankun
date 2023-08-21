import meow from 'meow';
import { ExitError, PreEnterButInPreModeError, PreExitButNotInPreModeError, InternalError } from '@changesets/errors';
import { error, info, warn, log, prefix, success } from '@changesets/logger';
import { format } from 'util';
import fs from 'fs-extra';
import path, { join } from 'path';
import { getPackages } from '@manypkg/get-packages';
import { getDependentsGraph } from '@changesets/get-dependents-graph';
import { defaultWrittenConfig, read } from '@changesets/config';
import chalk from 'chalk';
import { spawn } from 'child_process';
import termSize from 'term-size';
import { prompt } from 'enquirer';
import { edit, ExternalEditor } from 'external-editor';
import { symbols } from 'ansi-colors';
import { getChangedPackagesSinceRef, add as add$1, commit, getCurrentCommitId, tagExists, remoteTagExists, tag, getAllTags } from '@changesets/git';
import writeChangeset from '@changesets/write';
import resolveFrom from 'resolve-from';
import semver from 'semver';
import outdent from 'outdent';
import applyReleasePlan from '@changesets/apply-release-plan';
import readChangesets from '@changesets/read';
import assembleReleasePlan from '@changesets/assemble-release-plan';
import { readPreState, enterPre, exitPre } from '@changesets/pre';
import pLimit from 'p-limit';
import preferredPM from 'preferred-pm';
import spawn$1 from 'spawndamnit';
import isCI from 'is-ci';
import table from 'tty-table';
import getReleasePlan from '@changesets/get-release-plan';

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

const pkgPath = path.dirname(require.resolve("@changesets/cli/package.json")); // Modify base branch to "main" without changing defaultWrittenConfig since it also serves as a fallback
// for config files that don't specify a base branch. Changing that to main would be a breaking change.

const defaultConfig = `${JSON.stringify(_objectSpread2(_objectSpread2({}, defaultWrittenConfig), {}, {
  baseBranch: "main"
}), null, 2)}\n`;
async function init(cwd) {
  const changesetBase = path.resolve(cwd, ".changeset");

  if (fs.existsSync(changesetBase)) {
    if (!fs.existsSync(path.join(changesetBase, "config.json"))) {
      if (fs.existsSync(path.join(changesetBase, "config.js"))) {
        error("It looks like you're using the version 1 `.changeset/config.js` file");
        error("The format of the config object has significantly changed in v2 as well");
        error(" - we thoroughly recommend looking at the changelog for this package for what has changed");
        error("Changesets will write the defaults for the new config, remember to transfer your options into the new config at `.changeset/config.json`");
      } else {
        error("It looks like you don't have a config file");
        info("The default config file will be written at `.changeset/config.json`");
      }

      await fs.writeFile(path.resolve(changesetBase, "config.json"), defaultConfig);
    } else {
      warn("It looks like you already have changesets initialized. You should be able to run changeset commands no problems.");
    }
  } else {
    await fs.copy(path.resolve(pkgPath, "./default-files"), changesetBase);
    await fs.writeFile(path.resolve(changesetBase, "config.json"), defaultConfig);
    log(chalk`Thanks for choosing {green changesets} to help manage your versioning and publishing\n`);
    log("You should be set up to start using changesets now!\n");
    info("We have added a `.changeset` folder, and a couple of files to help you out:");
    info(chalk`- {blue .changeset/README.md} contains information about using changesets`);
    info(chalk`- {blue .changeset/config.json} is our default config`);
  }
}

// @ts-ignore it's not worth writing a TS declaration file in this repo for a tiny module we use once like this
// so we can make type assertions using them because `enquirer` types do no support `prefix` right now

/* Notes on using inquirer:
 * Each question needs a key, as inquirer is assembling an object behind-the-scenes.
 * At each call, the entire responses object is returned, so we need a unique
 * identifier for the name every time. This is why we are using serial IDs
 */
const serialId = function () {
  let id = 0;
  return () => id++;
}();

const limit = Math.max(termSize().rows - 5, 10);

let cancelFlow = () => {
  success("Cancelled... 👋 ");
  process.exit();
};

async function askCheckboxPlus(message, choices, format) {
  const name = `CheckboxPlus-${serialId()}`;
  return prompt({
    type: "autocomplete",
    name,
    message,
    prefix,
    multiple: true,
    choices,
    format,
    limit,
    onCancel: cancelFlow,
    symbols: {
      indicator: symbols.radioOff,
      checked: symbols.radioOn
    },

    indicator(state, choice) {
      return choice.enabled ? state.symbols.checked : state.symbols.indicator;
    }

  }).then(responses => responses[name]).catch(err => {
    error(err);
  });
}

async function askQuestion(message) {
  const name = `Question-${serialId()}`;
  return prompt([{
    type: "input",
    message,
    name,
    prefix,
    onCancel: cancelFlow
  }]).then(responses => responses[name]).catch(err => {
    error(err);
  });
}

function askQuestionWithEditor(message) {
  const response = edit(message, {
    postfix: ".md"
  });
  return response.replace(/^#.*\n?/gm, "").replace(/\n+$/g, "").trim();
}

async function askConfirm(message) {
  const name = `Confirm-${serialId()}`;
  return prompt([{
    message,
    name,
    prefix,
    type: "confirm",
    initial: true,
    onCancel: cancelFlow
  }]).then(responses => responses[name]).catch(err => {
    error(err);
  });
}

async function askList(message, choices) {
  const name = `List-${serialId()}`;
  return prompt([{
    choices,
    message,
    name,
    prefix,
    type: "select",
    onCancel: cancelFlow
  }]).then(responses => responses[name]).catch(err => {
    error(err);
  });
}

function getCommitFunctions(commit, cwd) {
  let commitFunctions = {};

  if (!commit) {
    return [commitFunctions, null];
  }

  let commitOpts = commit[1];
  let changesetPath = path.join(cwd, ".changeset");
  let commitPath = resolveFrom(changesetPath, commit[0]);

  let possibleCommitFunc = require(commitPath);

  if (possibleCommitFunc.default) {
    possibleCommitFunc = possibleCommitFunc.default;
  }

  if (typeof possibleCommitFunc.getAddMessage === "function" || typeof possibleCommitFunc.getVersionMessage === "function") {
    commitFunctions = possibleCommitFunc;
  } else {
    throw new Error("Could not resolve commit generation functions");
  }

  return [commitFunctions, commitOpts];
}

const {
  green,
  yellow,
  red,
  bold,
  blue,
  cyan
} = chalk;

async function confirmMajorRelease(pkgJSON) {
  if (semver.lt(pkgJSON.version, "1.0.0")) {
    // prettier-ignore
    log(yellow(`WARNING: Releasing a major version for ${green(pkgJSON.name)} will be its ${red('first major release')}.`));
    log(yellow(`If you are unsure if this is correct, contact the package's maintainers ${red("before committing this changeset")}.`));
    let shouldReleaseFirstMajor = await askConfirm(bold(`Are you sure you want to release the ${red("first major version")} of ${pkgJSON.name}?`));
    return shouldReleaseFirstMajor;
  }

  return true;
}

async function getPackagesToRelease(changedPackages, allPackages) {
  function askInitialReleaseQuestion(defaultChoiceList) {
    return askCheckboxPlus( // TODO: Make this wording better
    // TODO: take objects and be fancy with matching
    `Which packages would you like to include?`, defaultChoiceList, x => {
      // this removes changed packages and unchanged packages from the list
      // of packages shown after selection
      if (Array.isArray(x)) {
        return x.filter(x => x !== "changed packages" && x !== "unchanged packages").map(x => cyan(x)).join(", ");
      }

      return x;
    });
  }

  if (allPackages.length > 1) {
    const unchangedPackagesNames = allPackages.map(({
      packageJson
    }) => packageJson.name).filter(name => !changedPackages.includes(name));
    const defaultChoiceList = [{
      name: "changed packages",
      choices: changedPackages
    }, {
      name: "unchanged packages",
      choices: unchangedPackagesNames
    }].filter(({
      choices
    }) => choices.length !== 0);
    let packagesToRelease = await askInitialReleaseQuestion(defaultChoiceList);

    if (packagesToRelease.length === 0) {
      do {
        error("You must select at least one package to release");
        error("(You most likely hit enter instead of space!)");
        packagesToRelease = await askInitialReleaseQuestion(defaultChoiceList);
      } while (packagesToRelease.length === 0);
    }

    return packagesToRelease.filter(pkgName => pkgName !== "changed packages" && pkgName !== "unchanged packages");
  }

  return [allPackages[0].packageJson.name];
}

function getPkgJsonsByName(packages) {
  return new Map(packages.map(({
    packageJson
  }) => [packageJson.name, packageJson]));
}

function formatPkgNameAndVersion(pkgName, version) {
  return `${bold(pkgName)}@${bold(version)}`;
}

async function createChangeset(changedPackages, allPackages) {
  const releases = [];

  if (allPackages.length > 1) {
    const packagesToRelease = await getPackagesToRelease(changedPackages, allPackages);
    let pkgJsonsByName = getPkgJsonsByName(allPackages);
    let pkgsLeftToGetBumpTypeFor = new Set(packagesToRelease);
    let pkgsThatShouldBeMajorBumped = (await askCheckboxPlus(bold(`Which packages should have a ${red("major")} bump?`), [{
      name: "all packages",
      choices: packagesToRelease.map(pkgName => {
        return {
          name: pkgName,
          message: formatPkgNameAndVersion(pkgName, pkgJsonsByName.get(pkgName).version)
        };
      })
    }], x => {
      // this removes changed packages and unchanged packages from the list
      // of packages shown after selection
      if (Array.isArray(x)) {
        return x.filter(x => x !== "all packages").map(x => cyan(x)).join(", ");
      }

      return x;
    })).filter(x => x !== "all packages");

    for (const pkgName of pkgsThatShouldBeMajorBumped) {
      // for packages that are under v1, we want to make sure major releases are intended,
      // as some repo-wide sweeping changes have mistakenly release first majors
      // of packages.
      let pkgJson = pkgJsonsByName.get(pkgName);
      let shouldReleaseFirstMajor = await confirmMajorRelease(pkgJson);

      if (shouldReleaseFirstMajor) {
        pkgsLeftToGetBumpTypeFor.delete(pkgName);
        releases.push({
          name: pkgName,
          type: "major"
        });
      }
    }

    if (pkgsLeftToGetBumpTypeFor.size !== 0) {
      let pkgsThatShouldBeMinorBumped = (await askCheckboxPlus(bold(`Which packages should have a ${green("minor")} bump?`), [{
        name: "all packages",
        choices: [...pkgsLeftToGetBumpTypeFor].map(pkgName => {
          return {
            name: pkgName,
            message: formatPkgNameAndVersion(pkgName, pkgJsonsByName.get(pkgName).version)
          };
        })
      }], x => {
        // this removes changed packages and unchanged packages from the list
        // of packages shown after selection
        if (Array.isArray(x)) {
          return x.filter(x => x !== "all packages").map(x => cyan(x)).join(", ");
        }

        return x;
      })).filter(x => x !== "all packages");

      for (const pkgName of pkgsThatShouldBeMinorBumped) {
        pkgsLeftToGetBumpTypeFor.delete(pkgName);
        releases.push({
          name: pkgName,
          type: "minor"
        });
      }
    }

    if (pkgsLeftToGetBumpTypeFor.size !== 0) {
      log(`The following packages will be ${blue("patch")} bumped:`);
      pkgsLeftToGetBumpTypeFor.forEach(pkgName => {
        log(formatPkgNameAndVersion(pkgName, pkgJsonsByName.get(pkgName).version));
      });

      for (const pkgName of pkgsLeftToGetBumpTypeFor) {
        releases.push({
          name: pkgName,
          type: "patch"
        });
      }
    }
  } else {
    let pkg = allPackages[0];
    let type = await askList(`What kind of change is this for ${green(pkg.packageJson.name)}? (current version is ${pkg.packageJson.version})`, ["patch", "minor", "major"]);

    if (type === "major") {
      let shouldReleaseAsMajor = await confirmMajorRelease(pkg.packageJson);

      if (!shouldReleaseAsMajor) {
        throw new ExitError(1);
      }
    }

    releases.push({
      name: pkg.packageJson.name,
      type
    });
  }

  log("Please enter a summary for this change (this will be in the changelogs).");
  log(chalk.gray("  (submit empty line to open external editor)"));
  let summary = await askQuestion("Summary");

  if (summary.length === 0) {
    try {
      summary = askQuestionWithEditor("\n\n# Please enter a summary for your changes.\n# An empty message aborts the editor.");

      if (summary.length > 0) {
        return {
          confirmed: true,
          summary,
          releases
        };
      }
    } catch (err) {
      log("An error happened using external editor. Please type your summary here:");
    }

    summary = await askQuestion("");

    while (summary.length === 0) {
      summary = await askQuestion("\n\n# A summary is required for the changelog! 😪");
    }
  }

  return {
    confirmed: false,
    summary,
    releases
  };
}

function printConfirmationMessage(changeset, repoHasMultiplePackages) {
  function getReleasesOfType(type) {
    return changeset.releases.filter(release => release.type === type).map(release => release.name);
  }

  log("\n=== Summary of changesets ===");
  const majorReleases = getReleasesOfType("major");
  const minorReleases = getReleasesOfType("minor");
  const patchReleases = getReleasesOfType("patch");
  if (majorReleases.length > 0) log(`${chalk.bold.green("major")}:  ${majorReleases.join(", ")}`);
  if (minorReleases.length > 0) log(`${chalk.bold.green("minor")}:  ${minorReleases.join(", ")}`);
  if (patchReleases.length > 0) log(`${chalk.bold.green("patch")}:  ${patchReleases.join(", ")}`);
  log("");

  if (repoHasMultiplePackages) {
    const message = outdent`
      Note: All dependents of these packages that will be incompatible with
      the new version will be ${chalk.redBright("patch bumped")} when this changeset is applied.
    `;
    log(message + "\n");
  }
}

function isListablePackage(config, packageJson) {
  const packageIgnoredInConfig = config.ignore.includes(packageJson.name);

  if (packageIgnoredInConfig) {
    return false;
  }

  if (!config.privatePackages.version && packageJson.private) {
    return false;
  }

  const hasVersionField = !!packageJson.version;
  return hasVersionField;
}

async function add(cwd, {
  empty,
  open
}, config) {
  const packages = await getPackages(cwd);

  if (packages.packages.length === 0) {
    throw new Error(`No packages found. You might have ${packages.tool} workspaces configured but no packages yet?`);
  }

  const listablePackages = packages.packages.filter(pkg => isListablePackage(config, pkg.packageJson));
  const changesetBase = path.resolve(cwd, ".changeset");
  let newChangeset;

  if (empty) {
    newChangeset = {
      confirmed: true,
      releases: [],
      summary: ``
    };
  } else {
    const changedPackages = await getChangedPackagesSinceRef({
      cwd,
      ref: config.baseBranch,
      changedFilePatterns: config.changedFilePatterns
    });
    const changedPackagesName = changedPackages.filter(pkg => isListablePackage(config, pkg.packageJson)).map(pkg => pkg.packageJson.name);
    newChangeset = await createChangeset(changedPackagesName, listablePackages);
    printConfirmationMessage(newChangeset, listablePackages.length > 1);

    if (!newChangeset.confirmed) {
      newChangeset = _objectSpread2(_objectSpread2({}, newChangeset), {}, {
        confirmed: await askConfirm("Is this your desired changeset?")
      });
    }
  }

  if (newChangeset.confirmed) {
    const changesetID = await writeChangeset(newChangeset, cwd);
    const [{
      getAddMessage
    }, commitOpts] = getCommitFunctions(config.commit, cwd);

    if (getAddMessage) {
      await add$1(path.resolve(changesetBase, `${changesetID}.md`), cwd);
      await commit(await getAddMessage(newChangeset, commitOpts), cwd);
      log(chalk.green(`${empty ? "Empty " : ""}Changeset added and committed`));
    } else {
      log(chalk.green(`${empty ? "Empty " : ""}Changeset added! - you can now commit it\n`));
    }

    let hasMajorChange = [...newChangeset.releases].find(c => c.type === "major");

    if (hasMajorChange) {
      warn("This Changeset includes a major change and we STRONGLY recommend adding more information to the changeset:");
      warn("WHAT the breaking change is");
      warn("WHY the change was made");
      warn("HOW a consumer should update their code");
    } else {
      log(chalk.green("If you want to modify or expand on the changeset summary, you can find it here"));
    }

    const changesetPath = path.resolve(changesetBase, `${changesetID}.md`);
    info(chalk.blue(changesetPath));

    if (open) {
      // this is really a hack to reuse the logic embedded in `external-editor` related to determining the editor
      const externalEditor = new ExternalEditor();
      externalEditor.cleanup();
      spawn(externalEditor.editor.bin, externalEditor.editor.args.concat([changesetPath]), {
        detached: true,
        stdio: "inherit"
      });
    }
  }
}

// folder, and tidy up the subfolders
// THIS SHOULD BE REMOVED WHEN SUPPORT FOR CHANGESETS FROM V1 IS DROPPED

const removeEmptyFolders = async folderPath => {
  const dirContents = fs.readdirSync(folderPath);
  return Promise.all(dirContents.map(async contentPath => {
    const singleChangesetPath = path.resolve(folderPath, contentPath);

    try {
      if ((await fs.readdir(singleChangesetPath)).length < 1) {
        await fs.rmdir(singleChangesetPath);
      }
    } catch (err) {
      if (err.code !== "ENOTDIR") {
        throw err;
      }
    }
  }));
};

let importantSeparator = chalk.red("===============================IMPORTANT!===============================");
let importantEnd = chalk.red("----------------------------------------------------------------------");
async function version(cwd, options, config) {
  var _config$snapshot$prer;

  const releaseConfig = _objectSpread2(_objectSpread2({}, config), {}, {
    // Disable committing when in snapshot mode
    commit: options.snapshot ? false : config.commit
  });

  const [changesets, preState] = await Promise.all([readChangesets(cwd), readPreState(cwd), removeEmptyFolders(path.resolve(cwd, ".changeset"))]);

  if ((preState === null || preState === void 0 ? void 0 : preState.mode) === "pre") {
    warn(importantSeparator);

    if (options.snapshot !== undefined) {
      error("Snapshot release is not allowed in pre mode");
      log("To resolve this exit the pre mode by running `changeset pre exit`");
      throw new ExitError(1);
    } else {
      warn("You are in prerelease mode");
      warn("If you meant to do a normal release you should revert these changes and run `changeset pre exit`");
      warn("You can then run `changeset version` again to do a normal release");
    }

    warn(importantEnd);
  }

  if (changesets.length === 0 && (preState === undefined || preState.mode !== "exit")) {
    warn("No unreleased changesets found, exiting.");
    return;
  }

  let packages = await getPackages(cwd);
  let releasePlan = assembleReleasePlan(changesets, packages, releaseConfig, preState, options.snapshot ? {
    tag: options.snapshot === true ? undefined : options.snapshot,
    commit: (_config$snapshot$prer = config.snapshot.prereleaseTemplate) !== null && _config$snapshot$prer !== void 0 && _config$snapshot$prer.includes("{commit}") ? await getCurrentCommitId({
      cwd,
      short: true
    }) : undefined
  } : undefined);
  let [...touchedFiles] = await applyReleasePlan(releasePlan, packages, releaseConfig, options.snapshot);
  const [{
    getVersionMessage
  }, commitOpts] = getCommitFunctions(releaseConfig.commit, cwd);

  if (getVersionMessage) {
    let touchedFile; // Note, git gets angry if you try and have two git actions running at once
    // So we need to be careful that these iterations are properly sequential

    while (touchedFile = touchedFiles.shift()) {
      await add$1(path.relative(cwd, touchedFile), cwd);
    }

    const commit$1 = await commit(await getVersionMessage(releasePlan, commitOpts), cwd);

    if (!commit$1) {
      error("Changesets ran into trouble committing your files");
    } else {
      log("All files have been updated and committed. You're ready to publish!");
    }
  } else {
    log("All files have been updated. Review them and commit at your leisure");
  }
}

const getLastJsonObjectFromString = str => {
  str = str.replace(/[^}]*$/, "");

  while (str) {
    str = str.replace(/[^{]*/, "");

    try {
      return JSON.parse(str);
    } catch (err) {
      // move past the potentially leading `{` so the regexp in the loop can try to match for the next `{`
      str = str.slice(1);
    }
  }

  return null;
};

const npmRequestLimit = pLimit(40);
const npmPublishLimit = pLimit(10);

function jsonParse(input) {
  try {
    return JSON.parse(input);
  } catch (err) {
    if (err instanceof SyntaxError) {
      console.error("error parsing json:", input);
    }

    throw err;
  }
}

function getCorrectRegistry(packageJson) {
  var _packageJson$publishC, _packageJson$publishC2;

  const registry = (_packageJson$publishC = packageJson === null || packageJson === void 0 ? void 0 : (_packageJson$publishC2 = packageJson.publishConfig) === null || _packageJson$publishC2 === void 0 ? void 0 : _packageJson$publishC2.registry) !== null && _packageJson$publishC !== void 0 ? _packageJson$publishC : process.env.npm_config_registry;
  return !registry || registry === "https://registry.yarnpkg.com" ? "https://registry.npmjs.org" : registry;
}

async function getPublishTool(cwd) {
  const pm = await preferredPM(cwd);
  if (!pm || pm.name !== "pnpm") return {
    name: "npm"
  };

  try {
    let result = await spawn$1("pnpm", ["--version"], {
      cwd
    });
    let version = result.stdout.toString().trim();
    let parsed = semver.parse(version);
    return {
      name: "pnpm",
      shouldAddNoGitChecks: (parsed === null || parsed === void 0 ? void 0 : parsed.major) === undefined ? false : parsed.major >= 5
    };
  } catch (e) {
    return {
      name: "pnpm",
      shouldAddNoGitChecks: false
    };
  }
}

async function getTokenIsRequired() {
  // Due to a super annoying issue in yarn, we have to manually override this env variable
  // See: https://github.com/yarnpkg/yarn/issues/2935#issuecomment-355292633
  const envOverride = {
    npm_config_registry: getCorrectRegistry()
  };
  let result = await spawn$1("npm", ["profile", "get", "--json"], {
    env: Object.assign({}, process.env, envOverride)
  });

  if (result.code !== 0) {
    error("error while checking if token is required", result.stderr.toString().trim() || result.stdout.toString().trim());
    return false;
  }

  let json = jsonParse(result.stdout.toString());

  if (json.error || !json.tfa || !json.tfa.mode) {
    return false;
  }

  return json.tfa.mode === "auth-and-writes";
}
function getPackageInfo(packageJson) {
  return npmRequestLimit(async () => {
    info(`npm info ${packageJson.name}`); // Due to a couple of issues with yarnpkg, we also want to override the npm registry when doing
    // npm info.
    // Issues: We sometimes get back cached responses, i.e old data about packages which causes
    // `publish` to behave incorrectly. It can also cause issues when publishing private packages
    // as they will always give a 404, which will tell `publish` to always try to publish.
    // See: https://github.com/yarnpkg/yarn/issues/2935#issuecomment-355292633

    let result = await spawn$1("npm", ["info", packageJson.name, "--registry", getCorrectRegistry(packageJson), "--json"]); // Github package registry returns empty string when calling npm info
    // for a non-existent package instead of a E404

    if (result.stdout.toString() === "") {
      return {
        error: {
          code: "E404"
        }
      };
    }

    return jsonParse(result.stdout.toString());
  });
}
async function infoAllow404(packageJson) {
  var _pkgInfo$error;

  let pkgInfo = await getPackageInfo(packageJson);

  if (((_pkgInfo$error = pkgInfo.error) === null || _pkgInfo$error === void 0 ? void 0 : _pkgInfo$error.code) === "E404") {
    warn(`Received 404 for npm info ${chalk.cyan(`"${packageJson.name}"`)}`);
    return {
      published: false,
      pkgInfo: {}
    };
  }

  if (pkgInfo.error) {
    error(`Received an unknown error code: ${pkgInfo.error.code} for npm info ${chalk.cyan(`"${packageJson.name}"`)}`);
    error(pkgInfo.error.summary);
    if (pkgInfo.error.detail) error(pkgInfo.error.detail);
    throw new ExitError(1);
  }

  return {
    published: true,
    pkgInfo
  };
}
let otpAskLimit = pLimit(1);

let askForOtpCode = twoFactorState => otpAskLimit(async () => {
  if (twoFactorState.token !== null) return twoFactorState.token;
  info("This operation requires a one-time password from your authenticator.");
  let val = await askQuestion("Enter one-time password:");
  twoFactorState.token = val;
  return val;
});

let getOtpCode = async twoFactorState => {
  if (twoFactorState.token !== null) {
    return twoFactorState.token;
  }

  return askForOtpCode(twoFactorState);
}; // we have this so that we can do try a publish again after a publish without
// the call being wrapped in the npm request limit and causing the publishes to potentially never run

async function internalPublish(pkgName, opts, twoFactorState) {
  let publishTool = await getPublishTool(opts.cwd);
  let publishFlags = opts.access ? ["--access", opts.access] : [];
  publishFlags.push("--tag", opts.tag);

  if ((await twoFactorState.isRequired) && !isCI) {
    let otpCode = await getOtpCode(twoFactorState);
    publishFlags.push("--otp", otpCode);
  }

  if (publishTool.name === "pnpm" && publishTool.shouldAddNoGitChecks) {
    publishFlags.push("--no-git-checks");
  } // Due to a super annoying issue in yarn, we have to manually override this env variable
  // See: https://github.com/yarnpkg/yarn/issues/2935#issuecomment-355292633


  const envOverride = {
    npm_config_registry: getCorrectRegistry()
  };
  let {
    code,
    stdout,
    stderr
  } = publishTool.name === "pnpm" ? await spawn$1("pnpm", ["publish", "--json", ...publishFlags], {
    env: Object.assign({}, process.env, envOverride),
    cwd: opts.cwd
  }) : await spawn$1(publishTool.name, ["publish", opts.publishDir, "--json", ...publishFlags], {
    env: Object.assign({}, process.env, envOverride)
  });

  if (code !== 0) {
    // NPM's --json output is included alongside the `prepublish` and `postpublish` output in terminal
    // We want to handle this as best we can but it has some struggles:
    // - output of those lifecycle scripts can contain JSON
    // - npm7 has switched to printing `--json` errors to stderr (https://github.com/npm/cli/commit/1dbf0f9bb26ba70f4c6d0a807701d7652c31d7d4)
    // Note that the `--json` output is always printed at the end so this should work
    let json = getLastJsonObjectFromString(stderr.toString()) || getLastJsonObjectFromString(stdout.toString());

    if (json !== null && json !== void 0 && json.error) {
      // The first case is no 2fa provided, the second is when the 2fa is wrong (timeout or wrong words)
      if ((json.error.code === "EOTP" || json.error.code === "E401" && json.error.detail.includes("--otp=<code>")) && !isCI) {
        if (twoFactorState.token !== null) {
          // the current otp code must be invalid since it errored
          twoFactorState.token = null;
        } // just in case this isn't already true


        twoFactorState.isRequired = Promise.resolve(true);
        return internalPublish(pkgName, opts, twoFactorState);
      }

      error(`an error occurred while publishing ${pkgName}: ${json.error.code}`, json.error.summary, json.error.detail ? "\n" + json.error.detail : "");
    }

    error(stderr.toString() || stdout.toString());
    return {
      published: false
    };
  }

  return {
    published: true
  };
}

function publish(pkgName, opts, twoFactorState) {
  // If there are many packages to be published, it's better to limit the
  // concurrency to avoid unwanted errors, for example from npm.
  return npmRequestLimit(() => npmPublishLimit(() => internalPublish(pkgName, opts, twoFactorState)));
}

function getReleaseTag(pkgInfo, preState, tag) {
  if (tag) return tag;

  if (preState !== undefined && pkgInfo.publishedState !== "only-pre") {
    return preState.tag;
  }

  return "latest";
}

const isCustomRegistry = registry => !!registry && registry !== "https://registry.npmjs.org" && registry !== "https://registry.yarnpkg.com";

const getTwoFactorState = ({
  otp,
  publicPackages
}) => {
  if (otp) {
    return {
      token: otp,
      isRequired: Promise.resolve(true)
    };
  }

  if (isCI || publicPackages.some(pkg => {
    var _pkg$packageJson$publ;

    return isCustomRegistry((_pkg$packageJson$publ = pkg.packageJson.publishConfig) === null || _pkg$packageJson$publ === void 0 ? void 0 : _pkg$packageJson$publ.registry);
  }) || isCustomRegistry(process.env.npm_config_registry)) {
    return {
      token: null,
      isRequired: Promise.resolve(false)
    };
  }

  return {
    token: null,
    // note: we're not awaiting this here, we want this request to happen in parallel with getUnpublishedPackages
    isRequired: getTokenIsRequired()
  };
};

async function publishPackages({
  packages,
  access,
  otp,
  preState,
  tag
}) {
  const packagesByName = new Map(packages.map(x => [x.packageJson.name, x]));
  const publicPackages = packages.filter(pkg => !pkg.packageJson.private);
  const unpublishedPackagesInfo = await getUnpublishedPackages(publicPackages, preState);

  if (unpublishedPackagesInfo.length === 0) {
    return [];
  }

  const twoFactorState = getTwoFactorState({
    otp,
    publicPackages
  });
  return Promise.all(unpublishedPackagesInfo.map(pkgInfo => {
    let pkg = packagesByName.get(pkgInfo.name);
    return publishAPackage(pkg, access, twoFactorState, getReleaseTag(pkgInfo, preState, tag));
  }));
}

async function publishAPackage(pkg, access, twoFactorState, tag) {
  const {
    name,
    version,
    publishConfig
  } = pkg.packageJson;
  info(`Publishing ${chalk.cyan(`"${name}"`)} at ${chalk.green(`"${version}"`)}`);
  const publishConfirmation = await publish(name, {
    cwd: pkg.dir,
    publishDir: publishConfig !== null && publishConfig !== void 0 && publishConfig.directory ? join(pkg.dir, publishConfig.directory) : pkg.dir,
    access: (publishConfig === null || publishConfig === void 0 ? void 0 : publishConfig.access) || access,
    tag
  }, twoFactorState);
  return {
    name,
    newVersion: version,
    published: publishConfirmation.published
  };
}

async function getUnpublishedPackages(packages, preState) {
  const results = await Promise.all(packages.map(async ({
    packageJson
  }) => {
    const response = await infoAllow404(packageJson);
    let publishedState = "never";

    if (response.published) {
      publishedState = "published";

      if (preState !== undefined) {
        if (response.pkgInfo.versions && response.pkgInfo.versions.every(version => semver.parse(version).prerelease[0] === preState.tag)) {
          publishedState = "only-pre";
        }
      }
    }

    return {
      name: packageJson.name,
      localVersion: packageJson.version,
      publishedState,
      publishedVersions: response.pkgInfo.versions || []
    };
  }));
  const packagesToPublish = [];

  for (const pkgInfo of results) {
    const {
      name,
      publishedState,
      localVersion,
      publishedVersions
    } = pkgInfo;

    if (!publishedVersions.includes(localVersion)) {
      packagesToPublish.push(pkgInfo);
      info(`${name} is being published because our local version (${localVersion}) has not been published on npm`);

      if (preState !== undefined && publishedState === "only-pre") {
        info(`${name} is being published to ${chalk.cyan("latest")} rather than ${chalk.cyan(preState.tag)} because there has not been a regular release of it yet`);
      }
    } else {
      // If the local version is behind npm, something is wrong, we warn here, and by not getting published later, it will fail
      warn(`${name} is not being published because version ${localVersion} is already published on npm`);
    }
  }

  return packagesToPublish;
}

async function getUntaggedPrivatePackages(privatePackages, cwd, tool) {
  const packageWithTags = await Promise.all(privatePackages.map(async privatePkg => {
    const tagName = tool === "root" ? `v${privatePkg.packageJson.version}` : `${privatePkg.packageJson.name}@${privatePkg.packageJson.version}`;
    const isMissingTag = !((await tagExists(tagName, cwd)) || (await remoteTagExists(tagName)));
    return {
      pkg: privatePkg,
      isMissingTag
    };
  }));
  const untagged = [];

  for (const packageWithTag of packageWithTags) {
    if (packageWithTag.isMissingTag) {
      untagged.push({
        name: packageWithTag.pkg.packageJson.name,
        newVersion: packageWithTag.pkg.packageJson.version,
        published: false
      });
    }
  }

  return untagged;
}

function logReleases(pkgs) {
  const mappedPkgs = pkgs.map(p => `${p.name}@${p.newVersion}`).join("\n");
  log(mappedPkgs);
}

let importantSeparator$1 = chalk.red("===============================IMPORTANT!===============================");
let importantEnd$1 = chalk.red("----------------------------------------------------------------------");

function showNonLatestTagWarning(tag, preState) {
  warn(importantSeparator$1);

  if (preState) {
    warn(`You are in prerelease mode so packages will be published to the ${chalk.cyan(preState.tag)}
        dist tag except for packages that have not had normal releases which will be published to ${chalk.cyan("latest")}`);
  } else if (tag !== "latest") {
    warn(`Packages will be released under the ${tag} tag`);
  }

  warn(importantEnd$1);
}

async function run(cwd, {
  otp,
  tag,
  gitTag = true
}, config) {
  const releaseTag = tag && tag.length > 0 ? tag : undefined;
  let preState = await readPreState(cwd);

  if (releaseTag && preState && preState.mode === "pre") {
    error("Releasing under custom tag is not allowed in pre mode");
    log("To resolve this exit the pre mode by running `changeset pre exit`");
    throw new ExitError(1);
  }

  if (releaseTag || preState) {
    showNonLatestTagWarning(tag, preState);
  }

  const {
    packages,
    tool
  } = await getPackages(cwd);
  const tagPrivatePackages = config.privatePackages && config.privatePackages.tag;
  const publishedPackages = await publishPackages({
    packages,
    // if not public, we won't pass the access, and it works as normal
    access: config.access,
    otp,
    preState,
    tag: releaseTag
  });
  const privatePackages = packages.filter(pkg => pkg.packageJson.private && pkg.packageJson.version);
  const untaggedPrivatePackageReleases = tagPrivatePackages ? await getUntaggedPrivatePackages(privatePackages, cwd, tool) : [];

  if (publishedPackages.length === 0 && untaggedPrivatePackageReleases.length === 0) {
    warn("No unpublished projects to publish");
  }

  const successfulNpmPublishes = publishedPackages.filter(p => p.published);
  const unsuccessfulNpmPublishes = publishedPackages.filter(p => !p.published);

  if (successfulNpmPublishes.length > 0) {
    success("packages published successfully:");
    logReleases(successfulNpmPublishes);

    if (gitTag) {
      // We create the tags after the push above so that we know that HEAD won't change and that pushing
      // won't suffer from a race condition if another merge happens in the mean time (pushing tags won't
      // fail if we are behind the base branch).
      log(`Creating git tag${successfulNpmPublishes.length > 1 ? "s" : ""}...`);
      await tagPublish(tool, successfulNpmPublishes, cwd);
    }
  }

  if (untaggedPrivatePackageReleases.length > 0) {
    success("found untagged projects:");
    logReleases(untaggedPrivatePackageReleases);
    await tagPublish(tool, untaggedPrivatePackageReleases, cwd);
  }

  if (unsuccessfulNpmPublishes.length > 0) {
    error("packages failed to publish:");
    logReleases(unsuccessfulNpmPublishes);
    throw new ExitError(1);
  }
}

async function tagPublish(tool, packageReleases, cwd) {
  if (tool !== "root") {
    for (const pkg of packageReleases) {
      const tag$1 = `${pkg.name}@${pkg.newVersion}`;
      log("New tag: ", tag$1);
      await tag(tag$1, cwd);
    }
  } else {
    const tag$1 = `v${packageReleases[0].newVersion}`;
    log("New tag: ", tag$1);
    await tag(tag$1, cwd);
  }
}

async function getStatus(cwd, {
  sinceMaster,
  since,
  verbose,
  output
}, config) {
  if (sinceMaster) {
    warn("--sinceMaster is deprecated and will be removed in a future major version");
    warn("Use --since=master instead");
  }

  const sinceBranch = since === undefined ? sinceMaster ? "master" : undefined : since;
  const releasePlan = await getReleasePlan(cwd, sinceBranch, config);
  const {
    changesets,
    releases
  } = releasePlan;
  const changedPackages = await getChangedPackagesSinceRef({
    cwd,
    ref: sinceBranch || config.baseBranch,
    changedFilePatterns: config.changedFilePatterns
  });

  if (changedPackages.length > 0 && changesets.length === 0) {
    error("Some packages have been changed but no changesets were found. Run `changeset add` to resolve this error.");
    error("If this change doesn't need a release, run `changeset add --empty`.");
    process.exit(1);
  }

  if (output) {
    await fs.writeFile(path.join(cwd, output), JSON.stringify(releasePlan, undefined, 2));
    return;
  }

  const print = verbose ? verbosePrint : SimplePrint;
  print("patch", releases);
  log("---");
  print("minor", releases);
  log("---");
  print("major", releases);
  return releasePlan;
}

function SimplePrint(type, releases) {
  const packages = releases.filter(r => r.type === type);

  if (packages.length) {
    info(chalk`Packages to be bumped at {green ${type}}:\n`);
    const pkgs = packages.map(({
      name
    }) => `- ${name}`).join("\n");
    log(chalk.green(pkgs));
  } else {
    info(chalk`{red NO} packages to be bumped at {green ${type}}`);
  }
}

function verbosePrint(type, releases) {
  const packages = releases.filter(r => r.type === type);

  if (packages.length) {
    info(chalk`Packages to be bumped at {green ${type}}`);
    const columns = packages.map(({
      name,
      newVersion: version,
      changesets
    }) => [chalk.green(name), version, changesets.map(c => chalk.blue(` .changeset/${c}.md`)).join(" +")]);
    const t1 = table([{
      value: "Package Name",
      width: 20
    }, {
      value: "New Version",
      width: 20
    }, {
      value: "Related Changeset Summaries",
      width: 70
    }], columns, {
      paddingLeft: 1,
      paddingRight: 0,
      headerAlign: "center",
      align: "left"
    });
    log(t1.render() + "\n");
  } else {
    info(chalk`Running release would release {red NO} packages as a {green ${type}}`);
  }
}

async function pre(cwd, options) {
  if (options.command === "enter") {
    try {
      await enterPre(cwd, options.tag);
      success(`Entered pre mode with tag ${chalk.cyan(options.tag)}`);
      info("Run `changeset version` to version packages with prerelease versions");
    } catch (err) {
      if (err instanceof PreEnterButInPreModeError) {
        error("`changeset pre enter` cannot be run when in pre mode");
        info("If you're trying to exit pre mode, run `changeset pre exit`");
        throw new ExitError(1);
      }

      throw err;
    }
  } else {
    try {
      await exitPre(cwd);
      success(`Exited pre mode`);
      info("Run `changeset version` to version packages with normal versions");
    } catch (err) {
      if (err instanceof PreExitButNotInPreModeError) {
        error("`changeset pre exit` can only be run when in pre mode");
        info("If you're trying to enter pre mode, run `changeset pre enter`");
        throw new ExitError(1);
      }

      throw err;
    }
  }
}

async function run$1(cwd) {
  const {
    packages,
    tool
  } = await getPackages(cwd);
  const allExistingTags = await getAllTags(cwd);

  for (const pkg of packages) {
    const tag$1 = tool !== "root" ? `${pkg.packageJson.name}@${pkg.packageJson.version}` : `v${pkg.packageJson.version}`;

    if (allExistingTags.has(tag$1)) {
      log("Skipping tag (already exists): ", tag$1);
    } else {
      log("New tag: ", tag$1);
      await tag(tag$1, cwd);
    }
  }
}

async function run$2(input, flags, cwd) {
  if (input[0] === "init") {
    await init(cwd);
    return;
  }

  if (!fs.existsSync(path.resolve(cwd, ".changeset"))) {
    error("There is no .changeset folder. ");
    error("If this is the first time `changesets` have been used in this project, run `yarn changeset init` to get set up.");
    error("If you expected there to be changesets, you should check git history for when the folder was removed to ensure you do not lose any configuration.");
    throw new ExitError(1);
  }

  const packages = await getPackages(cwd);
  let config;

  try {
    config = await read(cwd, packages);
  } catch (e) {
    let oldConfigExists = await fs.pathExists(path.resolve(cwd, ".changeset/config.js"));

    if (oldConfigExists) {
      error("It looks like you're using the version 1 `.changeset/config.js` file");
      error("You'll need to convert it to a `.changeset/config.json` file");
      error("The format of the config object has significantly changed in v2 as well");
      error(" - we thoroughly recommend looking at the changelog for this package for what has changed");
      throw new ExitError(1);
    } else {
      throw e;
    }
  }

  if (input.length < 1) {
    const {
      empty,
      open
    } = flags; // @ts-ignore if this is undefined, we have already exited

    await add(cwd, {
      empty,
      open
    }, config);
  } else if (input[0] !== "pre" && input.length > 1) {
    error("Too many arguments passed to changesets - we only accept the command name as an argument");
  } else {
    const {
      sinceMaster,
      since,
      verbose,
      output,
      otp,
      empty,
      ignore,
      snapshot,
      snapshotPrereleaseTemplate,
      tag,
      open,
      gitTag
    } = flags;
    const deadFlags = ["updateChangelog", "isPublic", "skipCI", "commit"];
    deadFlags.forEach(flag => {
      if (flags[flag]) {
        error(`the flag ${flag} has been removed from changesets for version 2`);
        error(`Please encode the desired value into your config`);
        error(`See our changelog for more details`);
        throw new ExitError(1);
      }
    }); // Command line options need to be undefined, otherwise their
    // default value overrides the user's provided config in their
    // config file. For this reason, we only assign them to this
    // object as and when they exist.

    switch (input[0]) {
      case "add":
        {
          await add(cwd, {
            empty,
            open
          }, config);
          return;
        }

      case "version":
        {
          let ignoreArrayFromCmd;

          if (typeof ignore === "string") {
            ignoreArrayFromCmd = [ignore];
          } else {
            // undefined or an array
            ignoreArrayFromCmd = ignore;
          } // Validate that items in ignoreArrayFromCmd are valid project names


          let pkgNames = new Set(packages.packages.map(({
            packageJson
          }) => packageJson.name));
          const messages = [];

          for (const pkgName of ignoreArrayFromCmd || []) {
            if (!pkgNames.has(pkgName)) {
              messages.push(`The package "${pkgName}" is passed to the \`--ignore\` option but it is not found in the project. You may have misspelled the package name.`);
            }
          }

          if (config.ignore.length > 0 && ignoreArrayFromCmd) {
            messages.push(`It looks like you are trying to use the \`--ignore\` option while ignore is defined in the config file. This is currently not allowed, you can only use one of them at a time.`);
          } else if (ignoreArrayFromCmd) {
            // use the ignore flags from cli
            config.ignore = ignoreArrayFromCmd;
          } // Validate that all dependents of ignored packages are listed in the ignore list


          const dependentsGraph = getDependentsGraph(packages, {
            bumpVersionsWithWorkspaceProtocolOnly: config.bumpVersionsWithWorkspaceProtocolOnly
          });

          for (const ignoredPackage of config.ignore) {
            const dependents = dependentsGraph.get(ignoredPackage) || [];

            for (const dependent of dependents) {
              if (!config.ignore.includes(dependent)) {
                messages.push(`The package "${dependent}" depends on the ignored package "${ignoredPackage}", but "${dependent}" is not being ignored. Please pass "${dependent}" to the \`--ignore\` flag.`);
              }
            }
          }

          if (messages.length > 0) {
            error(messages.join("\n"));
            throw new ExitError(1);
          }

          if (snapshotPrereleaseTemplate) {
            config.snapshot.prereleaseTemplate = snapshotPrereleaseTemplate;
          }

          await version(cwd, {
            snapshot
          }, config);
          return;
        }

      case "publish":
        {
          await run(cwd, {
            otp,
            tag,
            gitTag
          }, config);
          return;
        }

      case "status":
        {
          await getStatus(cwd, {
            sinceMaster,
            since,
            verbose,
            output
          }, config);
          return;
        }

      case "tag":
        {
          await run$1(cwd);
          return;
        }

      case "pre":
        {
          let command = input[1];

          if (command !== "enter" && command !== "exit") {
            error("`enter`, `exit` or `snapshot` must be passed after prerelease");
            throw new ExitError(1);
          }

          let tag = input[2];

          if (command === "enter" && typeof tag !== "string") {
            error(`A tag must be passed when using prerelese enter`);
            throw new ExitError(1);
          } // @ts-ignore


          await pre(cwd, {
            command,
            tag
          });
          return;
        }

      case "bump":
        {
          error('In version 2 of changesets, "bump" has been renamed to "version" - see our changelog for an explanation');
          error("To fix this, use `changeset version` instead, and update any scripts that use changesets");
          throw new ExitError(1);
        }

      case "release":
        {
          error('In version 2 of changesets, "release" has been renamed to "publish" - see our changelog for an explanation');
          error("To fix this, use `changeset publish` instead, and update any scripts that use changesets");
          throw new ExitError(1);
        }

      default:
        {
          error(`Invalid command ${input[0]} was provided`);
          throw new ExitError(1);
        }
    }
  }
}

const {
  input,
  flags
} = meow(`
  Usage
    $ changeset [command]
  Commands
    init
    add [--empty] [--open]
    version [--ignore] [--snapshot <?name>] [--snapshot-prerelease-template <template>]
    publish [--tag <name>] [--otp <code>] [--no-git-tag]
    status [--since <branch>] [--verbose] [--output JSON_FILE.json]
    pre <enter|exit> <tag>
    tag
    `, {
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
      isMultiple: true
    },
    tag: {
      type: "string"
    },
    open: {
      type: "boolean"
    },
    gitTag: {
      type: "boolean",
      default: true
    },
    snapshotPrereleaseTemplate: {
      type: "string"
    } // mixed type like this is not supported by `meow`
    // if it gets passed explicitly then it's still available on the flags with an inferred type though
    // snapshot: { type: "boolean" | "string" },

  }
});
const cwd = process.cwd();
run$2(input, flags, cwd).catch(err => {
  if (err instanceof InternalError) {
    error("The following error is an internal unexpected error, these should never happen.");
    error("Please open an issue with the following link");
    error(`https://github.com/changesets/changesets/issues/new?title=${encodeURIComponent(`Unexpected error during ${input[0] || "add"} command`)}&body=${encodeURIComponent(`## Error

\`\`\`
${format("", err).replace(process.cwd(), "<cwd>")}
\`\`\`

## Versions

- @changesets/cli@${// eslint-disable-next-line import/no-extraneous-dependencies
    require("@changesets/cli/package.json").version}
- node@${process.version}

## Extra details

<!-- Add any extra details of what you were doing, ideas you have about what might have caused the error and reproduction steps if possible. If you have a repository we can look at that would be great. 😁 -->
`)}`);
  }

  if (err instanceof ExitError) {
    return process.exit(err.code);
  }

  error(err);
  process.exit(1);
});
