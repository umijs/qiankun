/* eslint no-console:0 */
'use strict';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
// Imports
var path_1 = __importDefault(require("path"));
var semver_1 = __importDefault(require("semver"));
var util_js_1 = require("./util.js");
// As Errlop uses Editions, we should use a specific Errlop edition
// As otherwise, the circular reference may fail on some machines
// https://github.com/bevry/errlop/issues/2
var errlop_1 = __importDefault(require("errlop"));
/**
 * The current node version that we are operating within.
 * It is compared in {@link requireEdition} against {@link Edition.engines}.
 */
var NODE_VERSION = process.versions.node;
/**
 * Whether or not {@link EDITIONS_VERBOSE} is enabled.
 * @type {bollean}
 * @private
 */
var VERBOSE = process.env.EDITIONS_VERBOSE === true ||
    process.env.EDITIONS_VERBOSE === 'yes' ||
    process.env.EDITIONS_VERBOSE === 'true' ||
    false;
/**
 * A list of the blacklisted tags.
 * Data imported from {@link EDITIONS_TAG_BLACKLIST}.
 */
var BLACKLIST = ((_a = process.env.EDITIONS_TAG_BLACKLIST) === null || _a === void 0 ? void 0 : _a.split(/[, ]+/g)) || ((_b = process.env.EDITIONS_SYNTAX_BLACKLIST) === null || _b === void 0 ? void 0 : _b.split(/[, ]+/g));
/**
 * A mapping of blacklisted tags to their reasons.
 * Keys are the tags.
 * Values are the error instances that contain the reasoning for why/how that tag is/became blacklisted.
 * Data imported from {@link EDITIONS_TAG_BLACKLIST}.
 */
var blacklist = {};
// Create the mapping of blacklisted tags and their reasonings
if (BLACKLIST) {
    for (var i = 0; i < BLACKLIST.length; ++i) {
        var tag = BLACKLIST[i].trim().toLowerCase();
        blacklist[tag] = util_js_1.errtion({
            message: "The EDITIONS_TAG_BLACKLIST (aka EDITIONS_SYNTAX_BLACKLIST) environment variable blacklisted the tag [" + tag + "]",
            code: 'blacklisted-tag'
        });
    }
}
// Blacklist the tag 'esnext' if our node version is below 0.12
if (semver_1.default.satisfies(NODE_VERSION, '<0.12')) {
    blacklist.esnext = new Error('The esnext tag is skipped on early node versions as attempting to use esnext features will output debugging information on these node versions');
}
/**
 * Attempt to load a specific {@link Edition}.
 * @returns The result of the loaded edition.
 * @throws An error if the edition failed to load.
 */
function loadEdition(edition, opts) {
    var entry = path_1.default.resolve(opts.cwd || '', edition.directory, opts.entry || edition.entry || '');
    if (opts.require == null) {
        throw util_js_1.errtion({
            message: "Skipped edition [" + edition.description + "] as opts.require was not provided, this is probably due to a testing misconfiguration.",
            code: 'unsupported-edition-require'
        });
    }
    try {
        return opts.require(entry);
    }
    catch (loadError) {
        // Note the error with more details
        throw util_js_1.errtion({
            message: "Skipped edition [" + edition.description + "] at entry [" + entry + "] because it failed to load",
            code: 'unsupported-edition-tried'
        }, loadError);
    }
}
exports.loadEdition = loadEdition;
/**
 * Attempt to require an {@link Edition}, based on its compatibility with the current environment, such as {@link NODE_VERSION} and {@link EDITIONS_TAG_BLACKLIST} compatibility.
 * If compatibility is established with the environment, it will load the edition using {@link loadEdition}.
 * @returns The result of the loaded edition
 * @throws An error if the edition failed to load
 */
function requireEdition(edition, opts) {
    // Verify the edition is valid
    if (!edition.description ||
        !edition.directory ||
        !edition.entry ||
        edition.engines == null) {
        throw util_js_1.errtion({
            message: "Each edition must have its [description, directory, entry, engines] fields defined, yet all it had was [" + Object.keys(edition).join(', ') + "]",
            code: 'unsupported-edition-malformed',
            level: 'fatal'
        });
    }
    // Handle strict omission
    if (opts.strict == null) {
        try {
            return requireEdition(edition, __assign(__assign({}, opts), { strict: true }));
        }
        catch (err) {
            return requireEdition(edition, __assign(__assign({}, opts), { strict: false }));
        }
    }
    // Verify tag support
    // Convert tags into a sorted lowercase string
    var tags = (edition.tags || edition.syntaxes || [])
        .map(function (i) { return i.toLowerCase(); })
        .sort();
    for (var index = 0; index < tags.length; index++) {
        var tag = tags[index];
        var blacklisted = blacklist[tag];
        if (blacklisted) {
            throw util_js_1.errtion({
                message: "Skipping edition [" + edition.description + "] because it contained a blacklisted tag [" + tag + "]",
                code: 'unsupported-edition-backlisted-tag'
            }, blacklisted);
        }
    }
    // Verify engine support
    if (edition.engines === false) {
        throw util_js_1.errtion({
            message: "Skipping edition [" + edition.description + "] because its engines field was false",
            code: 'unsupported-edition-engine'
        });
    }
    if (!edition.engines.node) {
        throw util_js_1.errtion({
            message: "Skipping edition [" + edition.description + "] because its .engines.node field was falsey",
            code: 'unsupported-edition-engines-node'
        });
    }
    if (opts.strict) {
        if (edition.engines.node === true) {
            throw util_js_1.errtion({
                message: "Skipping edition [" + edition.description + "] because its .engines.node field was true yet we are in strict mode",
                code: 'unsupported-edition-engines-node-version-true'
            });
        }
        else if (semver_1.default.satisfies(NODE_VERSION, edition.engines.node) === false) {
            throw util_js_1.errtion({
                message: "Skipping edition [" + edition.description + "] because our current node version [" + NODE_VERSION + "] is not supported by its specific range [" + util_js_1.stringify(edition.engines.node) + "]",
                code: 'unsupported-edition-engines-node-version-specific'
            });
        }
    }
    else if (edition.engines.node !== true) {
        var simplifiedRange = util_js_1.simplifyRange(edition.engines.node);
        if (semver_1.default.satisfies(NODE_VERSION, simplifiedRange) === false) {
            throw util_js_1.errtion({
                message: "Skipping edition [" + edition.description + "] because our current node version [" + NODE_VERSION + "] is not supported by its simplified range [" + util_js_1.stringify(simplifiedRange) + "]",
                code: 'unsupported-edition-engines-node-version-simplified'
            });
        }
    }
    // Load the edition
    return loadEdition(edition, opts);
}
exports.requireEdition = requireEdition;
/**
 * Cycles through a list of editions, returning the require result of the first suitable {@link Edition} that it was able to load.
 * Editions should be ordered from most preferable first, to least desirable last.
 * Providing the editions configuration is valid, individual edition handling is forwarded to {@link requireEdition}.
 * @returns The result of the loaded edition.
 * @throws An error if a suitable edition was unable to be resolved.
 */
function requireEditions(editions, opts) {
    // Check
    if (!editions || editions.length === 0) {
        if (opts.packagePath) {
            throw util_js_1.errtion({
                message: "There were no editions specified for package [" + opts.packagePath + "]",
                code: 'unsupported-editions-missing'
            });
        }
        else {
            throw util_js_1.errtion({
                message: 'There were no editions specified',
                code: 'unsupported-editions-missing'
            });
        }
    }
    // Handle strict omission
    if (opts.strict == null) {
        try {
            return requireEditions(editions, __assign(__assign({}, opts), { strict: true }));
        }
        catch (err) {
            return requireEditions(editions, __assign(__assign({}, opts), { strict: false }));
        }
    }
    // Whether or not we should be verbose
    var verbose = opts.verbose == null ? VERBOSE : opts.verbose;
    // Capture the load result, the last error, and the fallback option
    var result, loaded = false, editionsError = null, fallbackEdition = null;
    // Cycle through the editions determing the above
    for (var i = 0; i < editions.length; ++i) {
        var edition = editions[i];
        try {
            result = requireEdition(edition, opts);
            loaded = true;
            break;
        }
        catch (editionError) {
            if (editionError.level === 'fatal') {
                editionsError = editionError;
                break;
            }
            else if (editionsError) {
                editionsError = util_js_1.errtion(editionsError, editionError);
            }
            else {
                editionsError = editionError;
            }
            // make the fallback edition one that we don't bother loading due to its engines
            // also: don't assume that .code is accessible, as it may not be, even if it should be, due to the way different environments behave
            if (String(editionError.code || '').indexOf('unsupported-edition-engines-node-version') === 0) {
                fallbackEdition = edition;
            }
        }
    }
    // if no edition was suitable for our environment, then try the fallback if it exists
    // that is to say, ignore its engines.node
    if (opts.strict === false && loaded === false && fallbackEdition) {
        try {
            result = loadEdition(fallbackEdition, opts);
            loaded = true;
        }
        catch (editionError) {
            editionsError = new errlop_1.default(editionError, editionsError);
        }
    }
    // if we were able to load something, then provide it
    if (loaded) {
        // make note of any errors if desired
        if (editionsError && verbose) {
            var stderr = opts.stderr || process.stderr;
            stderr.write(editionsError.stack + '\n');
        }
        return result;
    }
    // otherwise, provide the error
    else if (editionsError) {
        if (opts.packagePath) {
            throw util_js_1.errtion({
                message: "There were no suitable editions for package [" + opts.packagePath + "]",
                code: 'unsupported-editions-tried'
            }, editionsError);
        }
        else {
            throw util_js_1.errtion({
                message: 'There were no suitable editions',
                code: 'unsupported-editions-tried'
            }, editionsError);
        }
    }
}
exports.requireEditions = requireEditions;
/**
 * Cycle through the editions for a package and require the correct one.
 * Providing the package configuration is valid, editions handling is forwarded to {@link requireEditions}.
 * @returns The result of the loaded edition.
 * @throws An error if a suitable edition was unable to be resolved.
 */
function requirePackage(cwd, require, entry) {
    // Load the package.json file to fetch `name` for debugging and `editions` for loading
    var packagePath = path_1.default.resolve(cwd || '', 'package.json');
    var editions = require(packagePath).editions;
    var opts = { packagePath: packagePath, cwd: cwd, require: require, entry: entry };
    return requireEditions(editions, opts);
}
exports.requirePackage = requirePackage;
