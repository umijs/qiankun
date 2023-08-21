import { tokenizer } from 'acorn';
import { builtinModules, createRequire } from 'node:module';
import fs, { realpathSync, statSync, Stats, promises, existsSync } from 'node:fs';
import { fileURLToPath as fileURLToPath$1, URL as URL$1, pathToFileURL } from 'node:url';
import { joinURL } from 'ufo';
import { normalize, isAbsolute, extname as extname$1 } from 'pathe';
import { readPackageJSON } from 'pkg-types';
import assert from 'node:assert';
import process$1 from 'node:process';
import path, { dirname } from 'node:path';
import v8 from 'node:v8';
import { format, inspect } from 'node:util';

const BUILTIN_MODULES = new Set(builtinModules);
function normalizeSlash(string_) {
  return string_.replace(/\\/g, "/");
}
function pcall(function_, ...arguments_) {
  try {
    return Promise.resolve(function_(...arguments_)).catch(
      (error) => perr(error)
    );
  } catch (error) {
    return perr(error);
  }
}
function perr(_error) {
  const error = new Error(_error);
  error.code = _error.code;
  Error.captureStackTrace(error, pcall);
  return Promise.reject(error);
}
function isObject(value) {
  return value !== null && typeof value === "object";
}
function matchAll(regex, string, addition) {
  const matches = [];
  for (const match of string.matchAll(regex)) {
    matches.push({
      ...addition,
      ...match.groups,
      code: match[0],
      start: match.index,
      end: match.index + match[0].length
    });
  }
  return matches;
}
function clearImports(imports) {
  return (imports || "").replace(/(\/\/[^\n]*\n|\/\*.*\*\/)/g, "").replace(/\s+/g, " ");
}
function getImportNames(cleanedImports) {
  const topLevelImports = cleanedImports.replace(/{([^}]*)}/, "");
  const namespacedImport = topLevelImports.match(/\* as \s*(\S*)/)?.[1];
  const defaultImport = topLevelImports.split(",").find((index) => !/[*{}]/.test(index))?.trim() || void 0;
  return {
    namespacedImport,
    defaultImport
  };
}

/**
 * @typedef ErrnoExceptionFields
 * @property {number | undefined} [errnode]
 * @property {string | undefined} [code]
 * @property {string | undefined} [path]
 * @property {string | undefined} [syscall]
 * @property {string | undefined} [url]
 *
 * @typedef {Error & ErrnoExceptionFields} ErrnoException
 */


const isWindows = process$1.platform === 'win32';

const own$1 = {}.hasOwnProperty;

const classRegExp = /^([A-Z][a-z\d]*)+$/;
// Sorted by a rough estimate on most frequently used entries.
const kTypes = new Set([
  'string',
  'function',
  'number',
  'object',
  // Accept 'Function' and 'Object' as alternative to the lower cased version.
  'Function',
  'Object',
  'boolean',
  'bigint',
  'symbol'
]);

const codes = {};

/**
 * Create a list string in the form like 'A and B' or 'A, B, ..., and Z'.
 * We cannot use Intl.ListFormat because it's not available in
 * --without-intl builds.
 *
 * @param {Array<string>} array
 *   An array of strings.
 * @param {string} [type]
 *   The list type to be inserted before the last element.
 * @returns {string}
 */
function formatList(array, type = 'and') {
  return array.length < 3
    ? array.join(` ${type} `)
    : `${array.slice(0, -1).join(', ')}, ${type} ${array[array.length - 1]}`
}

/** @type {Map<string, MessageFunction | string>} */
const messages = new Map();
const nodeInternalPrefix = '__node_internal_';
/** @type {number} */
let userStackTraceLimit;

codes.ERR_INVALID_ARG_TYPE = createError(
  'ERR_INVALID_ARG_TYPE',
  /**
   * @param {string} name
   * @param {Array<string> | string} expected
   * @param {unknown} actual
   */
  (name, expected, actual) => {
    assert(typeof name === 'string', "'name' must be a string");
    if (!Array.isArray(expected)) {
      expected = [expected];
    }

    let message = 'The ';
    if (name.endsWith(' argument')) {
      // For cases like 'first argument'
      message += `${name} `;
    } else {
      const type = name.includes('.') ? 'property' : 'argument';
      message += `"${name}" ${type} `;
    }

    message += 'must be ';

    /** @type {Array<string>} */
    const types = [];
    /** @type {Array<string>} */
    const instances = [];
    /** @type {Array<string>} */
    const other = [];

    for (const value of expected) {
      assert(
        typeof value === 'string',
        'All expected entries have to be of type string'
      );

      if (kTypes.has(value)) {
        types.push(value.toLowerCase());
      } else if (classRegExp.exec(value) === null) {
        assert(
          value !== 'object',
          'The value "object" should be written as "Object"'
        );
        other.push(value);
      } else {
        instances.push(value);
      }
    }

    // Special handle `object` in case other instances are allowed to outline
    // the differences between each other.
    if (instances.length > 0) {
      const pos = types.indexOf('object');
      if (pos !== -1) {
        types.slice(pos, 1);
        instances.push('Object');
      }
    }

    if (types.length > 0) {
      message += `${types.length > 1 ? 'one of type' : 'of type'} ${formatList(
        types,
        'or'
      )}`;
      if (instances.length > 0 || other.length > 0) message += ' or ';
    }

    if (instances.length > 0) {
      message += `an instance of ${formatList(instances, 'or')}`;
      if (other.length > 0) message += ' or ';
    }

    if (other.length > 0) {
      if (other.length > 1) {
        message += `one of ${formatList(other, 'or')}`;
      } else {
        if (other[0].toLowerCase() !== other[0]) message += 'an ';
        message += `${other[0]}`;
      }
    }

    message += `. Received ${determineSpecificType(actual)}`;

    return message
  },
  TypeError
);

codes.ERR_INVALID_MODULE_SPECIFIER = createError(
  'ERR_INVALID_MODULE_SPECIFIER',
  /**
   * @param {string} request
   * @param {string} reason
   * @param {string} [base]
   */
  (request, reason, base = undefined) => {
    return `Invalid module "${request}" ${reason}${
      base ? ` imported from ${base}` : ''
    }`
  },
  TypeError
);

codes.ERR_INVALID_PACKAGE_CONFIG = createError(
  'ERR_INVALID_PACKAGE_CONFIG',
  /**
   * @param {string} path
   * @param {string} [base]
   * @param {string} [message]
   */
  (path, base, message) => {
    return `Invalid package config ${path}${
      base ? ` while importing ${base}` : ''
    }${message ? `. ${message}` : ''}`
  },
  Error
);

codes.ERR_INVALID_PACKAGE_TARGET = createError(
  'ERR_INVALID_PACKAGE_TARGET',
  /**
   * @param {string} pkgPath
   * @param {string} key
   * @param {unknown} target
   * @param {boolean} [isImport=false]
   * @param {string} [base]
   */
  (pkgPath, key, target, isImport = false, base = undefined) => {
    const relError =
      typeof target === 'string' &&
      !isImport &&
      target.length > 0 &&
      !target.startsWith('./');
    if (key === '.') {
      assert(isImport === false);
      return (
        `Invalid "exports" main target ${JSON.stringify(target)} defined ` +
        `in the package config ${pkgPath}package.json${
          base ? ` imported from ${base}` : ''
        }${relError ? '; targets must start with "./"' : ''}`
      )
    }

    return `Invalid "${
      isImport ? 'imports' : 'exports'
    }" target ${JSON.stringify(
      target
    )} defined for '${key}' in the package config ${pkgPath}package.json${
      base ? ` imported from ${base}` : ''
    }${relError ? '; targets must start with "./"' : ''}`
  },
  Error
);

codes.ERR_MODULE_NOT_FOUND = createError(
  'ERR_MODULE_NOT_FOUND',
  /**
   * @param {string} path
   * @param {string} base
   * @param {string} [type]
   */
  (path, base, type = 'package') => {
    return `Cannot find ${type} '${path}' imported from ${base}`
  },
  Error
);

codes.ERR_NETWORK_IMPORT_DISALLOWED = createError(
  'ERR_NETWORK_IMPORT_DISALLOWED',
  "import of '%s' by %s is not supported: %s",
  Error
);

codes.ERR_PACKAGE_IMPORT_NOT_DEFINED = createError(
  'ERR_PACKAGE_IMPORT_NOT_DEFINED',
  /**
   * @param {string} specifier
   * @param {string} packagePath
   * @param {string} base
   */
  (specifier, packagePath, base) => {
    return `Package import specifier "${specifier}" is not defined${
      packagePath ? ` in package ${packagePath}package.json` : ''
    } imported from ${base}`
  },
  TypeError
);

codes.ERR_PACKAGE_PATH_NOT_EXPORTED = createError(
  'ERR_PACKAGE_PATH_NOT_EXPORTED',
  /**
   * @param {string} pkgPath
   * @param {string} subpath
   * @param {string} [base]
   */
  (pkgPath, subpath, base = undefined) => {
    if (subpath === '.')
      return `No "exports" main defined in ${pkgPath}package.json${
        base ? ` imported from ${base}` : ''
      }`
    return `Package subpath '${subpath}' is not defined by "exports" in ${pkgPath}package.json${
      base ? ` imported from ${base}` : ''
    }`
  },
  Error
);

codes.ERR_UNSUPPORTED_DIR_IMPORT = createError(
  'ERR_UNSUPPORTED_DIR_IMPORT',
  "Directory import '%s' is not supported " +
    'resolving ES modules imported from %s',
  Error
);

codes.ERR_UNKNOWN_FILE_EXTENSION = createError(
  'ERR_UNKNOWN_FILE_EXTENSION',
  /**
   * @param {string} ext
   * @param {string} path
   */
  (ext, path) => {
    return `Unknown file extension "${ext}" for ${path}`
  },
  TypeError
);

codes.ERR_INVALID_ARG_VALUE = createError(
  'ERR_INVALID_ARG_VALUE',
  /**
   * @param {string} name
   * @param {unknown} value
   * @param {string} [reason='is invalid']
   */
  (name, value, reason = 'is invalid') => {
    let inspected = inspect(value);

    if (inspected.length > 128) {
      inspected = `${inspected.slice(0, 128)}...`;
    }

    const type = name.includes('.') ? 'property' : 'argument';

    return `The ${type} '${name}' ${reason}. Received ${inspected}`
  },
  TypeError
  // Note: extra classes have been shaken out.
  // , RangeError
);

codes.ERR_UNSUPPORTED_ESM_URL_SCHEME = createError(
  'ERR_UNSUPPORTED_ESM_URL_SCHEME',
  /**
   * @param {URL} url
   * @param {Array<string>} supported
   */
  (url, supported) => {
    let message = `Only URLs with a scheme in: ${formatList(
      supported
    )} are supported by the default ESM loader`;

    if (isWindows && url.protocol.length === 2) {
      message += '. On Windows, absolute paths must be valid file:// URLs';
    }

    message += `. Received protocol '${url.protocol}'`;
    return message
  },
  Error
);

/**
 * Utility function for registering the error codes. Only used here. Exported
 * *only* to allow for testing.
 * @param {string} sym
 * @param {MessageFunction | string} value
 * @param {ErrorConstructor} def
 * @returns {new (...args: Array<any>) => Error}
 */
function createError(sym, value, def) {
  // Special case for SystemError that formats the error message differently
  // The SystemErrors only have SystemError as their base classes.
  messages.set(sym, value);

  return makeNodeErrorWithCode(def, sym)
}

/**
 * @param {ErrorConstructor} Base
 * @param {string} key
 * @returns {ErrorConstructor}
 */
function makeNodeErrorWithCode(Base, key) {
  // @ts-expect-error It’s a Node error.
  return NodeError
  /**
   * @param {Array<unknown>} args
   */
  function NodeError(...args) {
    const limit = Error.stackTraceLimit;
    if (isErrorStackTraceLimitWritable()) Error.stackTraceLimit = 0;
    const error = new Base();
    // Reset the limit and setting the name property.
    if (isErrorStackTraceLimitWritable()) Error.stackTraceLimit = limit;
    const message = getMessage(key, args, error);
    Object.defineProperties(error, {
      // Note: no need to implement `kIsNodeError` symbol, would be hard,
      // probably.
      message: {
        value: message,
        enumerable: false,
        writable: true,
        configurable: true
      },
      toString: {
        /** @this {Error} */
        value() {
          return `${this.name} [${key}]: ${this.message}`
        },
        enumerable: false,
        writable: true,
        configurable: true
      }
    });

    captureLargerStackTrace(error);
    // @ts-expect-error It’s a Node error.
    error.code = key;
    return error
  }
}

/**
 * @returns {boolean}
 */
function isErrorStackTraceLimitWritable() {
  // Do no touch Error.stackTraceLimit as V8 would attempt to install
  // it again during deserialization.
  try {
    // @ts-expect-error: not in types?
    if (v8.startupSnapshot.isBuildingSnapshot()) {
      return false
    }
  } catch {}

  const desc = Object.getOwnPropertyDescriptor(Error, 'stackTraceLimit');
  if (desc === undefined) {
    return Object.isExtensible(Error)
  }

  return own$1.call(desc, 'writable') && desc.writable !== undefined
    ? desc.writable
    : desc.set !== undefined
}

/**
 * This function removes unnecessary frames from Node.js core errors.
 * @template {(...args: unknown[]) => unknown} T
 * @param {T} fn
 * @returns {T}
 */
function hideStackFrames(fn) {
  // We rename the functions that will be hidden to cut off the stacktrace
  // at the outermost one
  const hidden = nodeInternalPrefix + fn.name;
  Object.defineProperty(fn, 'name', {value: hidden});
  return fn
}

const captureLargerStackTrace = hideStackFrames(
  /**
   * @param {Error} error
   * @returns {Error}
   */
  // @ts-expect-error: fine
  function (error) {
    const stackTraceLimitIsWritable = isErrorStackTraceLimitWritable();
    if (stackTraceLimitIsWritable) {
      userStackTraceLimit = Error.stackTraceLimit;
      Error.stackTraceLimit = Number.POSITIVE_INFINITY;
    }

    Error.captureStackTrace(error);

    // Reset the limit
    if (stackTraceLimitIsWritable) Error.stackTraceLimit = userStackTraceLimit;

    return error
  }
);

/**
 * @param {string} key
 * @param {Array<unknown>} args
 * @param {Error} self
 * @returns {string}
 */
function getMessage(key, args, self) {
  const message = messages.get(key);
  assert(message !== undefined, 'expected `message` to be found');

  if (typeof message === 'function') {
    assert(
      message.length <= args.length, // Default options do not count.
      `Code: ${key}; The provided arguments length (${args.length}) does not ` +
        `match the required ones (${message.length}).`
    );
    return Reflect.apply(message, self, args)
  }

  const regex = /%[dfijoOs]/g;
  let expectedLength = 0;
  while (regex.exec(message) !== null) expectedLength++;
  assert(
    expectedLength === args.length,
    `Code: ${key}; The provided arguments length (${args.length}) does not ` +
      `match the required ones (${expectedLength}).`
  );
  if (args.length === 0) return message

  args.unshift(message);
  return Reflect.apply(format, null, args)
}

/**
 * Determine the specific type of a value for type-mismatch errors.
 * @param {unknown} value
 * @returns {string}
 */
function determineSpecificType(value) {
  if (value === null || value === undefined) {
    return String(value)
  }

  if (typeof value === 'function' && value.name) {
    return `function ${value.name}`
  }

  if (typeof value === 'object') {
    if (value.constructor && value.constructor.name) {
      return `an instance of ${value.constructor.name}`
    }

    return `${inspect(value, {depth: -1})}`
  }

  let inspected = inspect(value, {colors: false});

  if (inspected.length > 28) {
    inspected = `${inspected.slice(0, 25)}...`;
  }

  return `type ${typeof value} (${inspected})`
}

// Manually “tree shaken” from:
// <https://github.com/nodejs/node/blob/3e74590/lib/internal/modules/package_json_reader.js>
// Last checked on: Apr 24, 2023.
// Removed the native dependency.
// Also: no need to cache, we do that in resolve already.


const reader = {read};
const packageJsonReader = reader;

/**
 * @param {string} jsonPath
 * @returns {{string: string | undefined}}
 */
function read(jsonPath) {
  try {
    const string = fs.readFileSync(
      path.toNamespacedPath(path.join(path.dirname(jsonPath), 'package.json')),
      'utf8'
    );
    return {string}
  } catch (error) {
    const exception = /** @type {ErrnoException} */ (error);

    if (exception.code === 'ENOENT') {
      return {string: undefined}
      // Throw all other errors.
      /* c8 ignore next 4 */
    }

    throw exception
  }
}

// Manually “tree shaken” from:
// <https://github.com/nodejs/node/blob/3e74590/lib/internal/modules/esm/package_config.js>
// Last checked on: Apr 24, 2023.


const {ERR_INVALID_PACKAGE_CONFIG: ERR_INVALID_PACKAGE_CONFIG$1} = codes;

/** @type {Map<string, PackageConfig>} */
const packageJsonCache = new Map();

/**
 * @param {string} path
 * @param {URL | string} specifier Note: `specifier` is actually optional, not base.
 * @param {URL} [base]
 * @returns {PackageConfig}
 */
function getPackageConfig(path, specifier, base) {
  const existing = packageJsonCache.get(path);
  if (existing !== undefined) {
    return existing
  }

  const source = packageJsonReader.read(path).string;

  if (source === undefined) {
    /** @type {PackageConfig} */
    const packageConfig = {
      pjsonPath: path,
      exists: false,
      main: undefined,
      name: undefined,
      type: 'none',
      exports: undefined,
      imports: undefined
    };
    packageJsonCache.set(path, packageConfig);
    return packageConfig
  }

  /** @type {Record<string, unknown>} */
  let packageJson;
  try {
    packageJson = JSON.parse(source);
  } catch (error) {
    const exception = /** @type {ErrnoException} */ (error);

    throw new ERR_INVALID_PACKAGE_CONFIG$1(
      path,
      (base ? `"${specifier}" from ` : '') + fileURLToPath$1(base || specifier),
      exception.message
    )
  }

  const {exports, imports, main, name, type} = packageJson;

  /** @type {PackageConfig} */
  const packageConfig = {
    pjsonPath: path,
    exists: true,
    main: typeof main === 'string' ? main : undefined,
    name: typeof name === 'string' ? name : undefined,
    type: type === 'module' || type === 'commonjs' ? type : 'none',
    // @ts-expect-error Assume `Record<string, unknown>`.
    exports,
    // @ts-expect-error Assume `Record<string, unknown>`.
    imports: imports && typeof imports === 'object' ? imports : undefined
  };
  packageJsonCache.set(path, packageConfig);
  return packageConfig
}

/**
 * @param {URL} resolved
 * @returns {PackageConfig}
 */
function getPackageScopeConfig(resolved) {
  let packageJsonUrl = new URL$1('package.json', resolved);

  while (true) {
    const packageJsonPath = packageJsonUrl.pathname;

    if (packageJsonPath.endsWith('node_modules/package.json')) break

    const packageConfig = getPackageConfig(
      fileURLToPath$1(packageJsonUrl),
      resolved
    );
    if (packageConfig.exists) return packageConfig

    const lastPackageJsonUrl = packageJsonUrl;
    packageJsonUrl = new URL$1('../package.json', packageJsonUrl);

    // Terminates at root where ../package.json equals ../../package.json
    // (can't just check "/package.json" for Windows support).
    if (packageJsonUrl.pathname === lastPackageJsonUrl.pathname) break
  }

  const packageJsonPath = fileURLToPath$1(packageJsonUrl);
  /** @type {PackageConfig} */
  const packageConfig = {
    pjsonPath: packageJsonPath,
    exists: false,
    main: undefined,
    name: undefined,
    type: 'none',
    exports: undefined,
    imports: undefined
  };
  packageJsonCache.set(packageJsonPath, packageConfig);
  return packageConfig
}

// Manually “tree shaken” from:
// <https://github.com/nodejs/node/blob/3e74590/lib/internal/modules/esm/resolve.js>
// Last checked on: Apr 24, 2023.
//
// This file solves a circular dependency.
// In Node.js, `getPackageType` is in `resolve.js`.
// `resolve.js` imports `get-format.js`, which needs `getPackageType`.
// We split that up so that bundlers don’t fail.


/**
 * @param {URL} url
 * @returns {PackageType}
 */
function getPackageType(url) {
  const packageConfig = getPackageScopeConfig(url);
  return packageConfig.type
}

// Manually “tree shaken” from:
// <https://github.com/nodejs/node/blob/3e74590/lib/internal/modules/esm/get_format.js>
// Last checked on: Apr 24, 2023.


const {ERR_UNKNOWN_FILE_EXTENSION} = codes;

const hasOwnProperty = {}.hasOwnProperty;

/** @type {Record<string, string>} */
const extensionFormatMap = {
  // @ts-expect-error: hush.
  __proto__: null,
  '.cjs': 'commonjs',
  '.js': 'module',
  '.json': 'json',
  '.mjs': 'module'
};

/**
 * @param {string | null} mime
 * @returns {string | null}
 */
function mimeToFormat(mime) {
  if (
    mime &&
    /\s*(text|application)\/javascript\s*(;\s*charset=utf-?8\s*)?/i.test(mime)
  )
    return 'module'
  if (mime === 'application/json') return 'json'
  return null
}

/**
 * @callback ProtocolHandler
 * @param {URL} parsed
 * @param {{parentURL: string}} context
 * @param {boolean} ignoreErrors
 * @returns {string | null | void}
 */

/**
 * @type {Record<string, ProtocolHandler>}
 */
const protocolHandlers = {
  // @ts-expect-error: hush.
  __proto__: null,
  'data:': getDataProtocolModuleFormat,
  'file:': getFileProtocolModuleFormat,
  'http:': getHttpProtocolModuleFormat,
  'https:': getHttpProtocolModuleFormat,
  'node:'() {
    return 'builtin'
  }
};

/**
 * @param {URL} parsed
 */
function getDataProtocolModuleFormat(parsed) {
  const {1: mime} = /^([^/]+\/[^;,]+)[^,]*?(;base64)?,/.exec(
    parsed.pathname
  ) || [null, null, null];
  return mimeToFormat(mime)
}

/**
 * Returns the file extension from a URL.
 *
 * Should give similar result to
 * `require('node:path').extname(require('node:url').fileURLToPath(url))`
 * when used with a `file:` URL.
 *
 * @param {URL} url
 * @returns {string}
 */
function extname(url) {
  const pathname = url.pathname;
  let index = pathname.length;

  while (index--) {
    const code = pathname.codePointAt(index);

    if (code === 47 /* `/` */) {
      return ''
    }

    if (code === 46 /* `.` */) {
      return pathname.codePointAt(index - 1) === 47 /* `/` */
        ? ''
        : pathname.slice(index)
    }
  }

  return ''
}

/**
 * @type {ProtocolHandler}
 */
function getFileProtocolModuleFormat(url, _context, ignoreErrors) {
  const ext = extname(url);

  if (ext === '.js') {
    return getPackageType(url) === 'module' ? 'module' : 'commonjs'
  }

  const format = extensionFormatMap[ext];
  if (format) return format

  // Explicit undefined return indicates load hook should rerun format check
  if (ignoreErrors) {
    return undefined
  }

  const filepath = fileURLToPath$1(url);
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath)
}

function getHttpProtocolModuleFormat() {
  // To do: HTTPS imports.
}

/**
 * @param {URL} url
 * @param {{parentURL: string}} context
 * @returns {string | null}
 */
function defaultGetFormatWithoutErrors(url, context) {
  if (!hasOwnProperty.call(protocolHandlers, url.protocol)) {
    return null
  }

  return protocolHandlers[url.protocol](url, context, true) || null
}

// Manually “tree shaken” from:
// <https://github.com/nodejs/node/blob/3e74590/lib/internal/modules/esm/resolve.js>
// Last checked on: Apr 24, 2023.


const RegExpPrototypeSymbolReplace = RegExp.prototype[Symbol.replace];

const {
  ERR_NETWORK_IMPORT_DISALLOWED,
  ERR_INVALID_MODULE_SPECIFIER,
  ERR_INVALID_PACKAGE_CONFIG,
  ERR_INVALID_PACKAGE_TARGET,
  ERR_MODULE_NOT_FOUND,
  ERR_PACKAGE_IMPORT_NOT_DEFINED,
  ERR_PACKAGE_PATH_NOT_EXPORTED,
  ERR_UNSUPPORTED_DIR_IMPORT,
  ERR_UNSUPPORTED_ESM_URL_SCHEME
} = codes;

const own = {}.hasOwnProperty;

const invalidSegmentRegEx =
  /(^|\\|\/)((\.|%2e)(\.|%2e)?|(n|%6e|%4e)(o|%6f|%4f)(d|%64|%44)(e|%65|%45)(_|%5f)(m|%6d|%4d)(o|%6f|%4f)(d|%64|%44)(u|%75|%55)(l|%6c|%4c)(e|%65|%45)(s|%73|%53))?(\\|\/|$)/i;
const deprecatedInvalidSegmentRegEx =
  /(^|\\|\/)((\.|%2e)(\.|%2e)?|(n|%6e|%4e)(o|%6f|%4f)(d|%64|%44)(e|%65|%45)(_|%5f)(m|%6d|%4d)(o|%6f|%4f)(d|%64|%44)(u|%75|%55)(l|%6c|%4c)(e|%65|%45)(s|%73|%53))(\\|\/|$)/i;
const invalidPackageNameRegEx = /^\.|%|\\/;
const patternRegEx = /\*/g;
const encodedSepRegEx = /%2f|%5c/i;
/** @type {Set<string>} */
const emittedPackageWarnings = new Set();

const doubleSlashRegEx = /[/\\]{2}/;

/**
 *
 * @param {string} target
 * @param {string} request
 * @param {string} match
 * @param {URL} packageJsonUrl
 * @param {boolean} internal
 * @param {URL} base
 * @param {boolean} isTarget
 */
function emitInvalidSegmentDeprecation(
  target,
  request,
  match,
  packageJsonUrl,
  internal,
  base,
  isTarget
) {
  const pjsonPath = fileURLToPath$1(packageJsonUrl);
  const double = doubleSlashRegEx.exec(isTarget ? target : request) !== null;
  process$1.emitWarning(
    `Use of deprecated ${
      double ? 'double slash' : 'leading or trailing slash matching'
    } resolving "${target}" for module ` +
      `request "${request}" ${
        request === match ? '' : `matched to "${match}" `
      }in the "${
        internal ? 'imports' : 'exports'
      }" field module resolution of the package at ${pjsonPath}${
        base ? ` imported from ${fileURLToPath$1(base)}` : ''
      }.`,
    'DeprecationWarning',
    'DEP0166'
  );
}

/**
 * @param {URL} url
 * @param {URL} packageJsonUrl
 * @param {URL} base
 * @param {unknown} [main]
 * @returns {void}
 */
function emitLegacyIndexDeprecation(url, packageJsonUrl, base, main) {
  const format = defaultGetFormatWithoutErrors(url, {parentURL: base.href});
  if (format !== 'module') return
  const path = fileURLToPath$1(url.href);
  const pkgPath = fileURLToPath$1(new URL$1('.', packageJsonUrl));
  const basePath = fileURLToPath$1(base);
  if (main)
    process$1.emitWarning(
      `Package ${pkgPath} has a "main" field set to ${JSON.stringify(main)}, ` +
        `excluding the full filename and extension to the resolved file at "${path.slice(
          pkgPath.length
        )}", imported from ${basePath}.\n Automatic extension resolution of the "main" field is` +
        'deprecated for ES modules.',
      'DeprecationWarning',
      'DEP0151'
    );
  else
    process$1.emitWarning(
      `No "main" or "exports" field defined in the package.json for ${pkgPath} resolving the main entry point "${path.slice(
        pkgPath.length
      )}", imported from ${basePath}.\nDefault "index" lookups for the main are deprecated for ES modules.`,
      'DeprecationWarning',
      'DEP0151'
    );
}

/**
 * @param {string} path
 * @returns {Stats}
 */
function tryStatSync(path) {
  // Note: from Node 15 onwards we can use `throwIfNoEntry: false` instead.
  try {
    return statSync(path)
  } catch {
    return new Stats()
  }
}

/**
 * Legacy CommonJS main resolution:
 * 1. let M = pkg_url + (json main field)
 * 2. TRY(M, M.js, M.json, M.node)
 * 3. TRY(M/index.js, M/index.json, M/index.node)
 * 4. TRY(pkg_url/index.js, pkg_url/index.json, pkg_url/index.node)
 * 5. NOT_FOUND
 *
 * @param {URL} url
 * @returns {boolean}
 */
function fileExists(url) {
  const stats = statSync(url, {throwIfNoEntry: false});
  const isFile = stats ? stats.isFile() : undefined;
  return isFile === null || isFile === undefined ? false : isFile
}

/**
 * @param {URL} packageJsonUrl
 * @param {PackageConfig} packageConfig
 * @param {URL} base
 * @returns {URL}
 */
function legacyMainResolve(packageJsonUrl, packageConfig, base) {
  /** @type {URL | undefined} */
  let guess;
  if (packageConfig.main !== undefined) {
    guess = new URL$1(packageConfig.main, packageJsonUrl);
    // Note: fs check redundances will be handled by Descriptor cache here.
    if (fileExists(guess)) return guess

    const tries = [
      `./${packageConfig.main}.js`,
      `./${packageConfig.main}.json`,
      `./${packageConfig.main}.node`,
      `./${packageConfig.main}/index.js`,
      `./${packageConfig.main}/index.json`,
      `./${packageConfig.main}/index.node`
    ];
    let i = -1;

    while (++i < tries.length) {
      guess = new URL$1(tries[i], packageJsonUrl);
      if (fileExists(guess)) break
      guess = undefined;
    }

    if (guess) {
      emitLegacyIndexDeprecation(
        guess,
        packageJsonUrl,
        base,
        packageConfig.main
      );
      return guess
    }
    // Fallthrough.
  }

  const tries = ['./index.js', './index.json', './index.node'];
  let i = -1;

  while (++i < tries.length) {
    guess = new URL$1(tries[i], packageJsonUrl);
    if (fileExists(guess)) break
    guess = undefined;
  }

  if (guess) {
    emitLegacyIndexDeprecation(guess, packageJsonUrl, base, packageConfig.main);
    return guess
  }

  // Not found.
  throw new ERR_MODULE_NOT_FOUND(
    fileURLToPath$1(new URL$1('.', packageJsonUrl)),
    fileURLToPath$1(base)
  )
}

/**
 * @param {URL} resolved
 * @param {URL} base
 * @param {boolean} [preserveSymlinks]
 * @returns {URL}
 */
function finalizeResolution(resolved, base, preserveSymlinks) {
  if (encodedSepRegEx.exec(resolved.pathname) !== null)
    throw new ERR_INVALID_MODULE_SPECIFIER(
      resolved.pathname,
      'must not include encoded "/" or "\\" characters',
      fileURLToPath$1(base)
    )

  const filePath = fileURLToPath$1(resolved);

  const stats = tryStatSync(
    filePath.endsWith('/') ? filePath.slice(-1) : filePath
  );

  if (stats.isDirectory()) {
    const error = new ERR_UNSUPPORTED_DIR_IMPORT(filePath, fileURLToPath$1(base));
    // @ts-expect-error Add this for `import.meta.resolve`.
    error.url = String(resolved);
    throw error
  }

  if (!stats.isFile()) {
    throw new ERR_MODULE_NOT_FOUND(
      filePath || resolved.pathname,
      base && fileURLToPath$1(base),
      'module'
    )
  }

  if (!preserveSymlinks) {
    const real = realpathSync(filePath);
    const {search, hash} = resolved;
    resolved = pathToFileURL(real + (filePath.endsWith(path.sep) ? '/' : ''));
    resolved.search = search;
    resolved.hash = hash;
  }

  return resolved
}

/**
 * @param {string} specifier
 * @param {URL | undefined} packageJsonUrl
 * @param {URL} base
 * @returns {Error}
 */
function importNotDefined(specifier, packageJsonUrl, base) {
  return new ERR_PACKAGE_IMPORT_NOT_DEFINED(
    specifier,
    packageJsonUrl && fileURLToPath$1(new URL$1('.', packageJsonUrl)),
    fileURLToPath$1(base)
  )
}

/**
 * @param {string} subpath
 * @param {URL} packageJsonUrl
 * @param {URL} base
 * @returns {Error}
 */
function exportsNotFound(subpath, packageJsonUrl, base) {
  return new ERR_PACKAGE_PATH_NOT_EXPORTED(
    fileURLToPath$1(new URL$1('.', packageJsonUrl)),
    subpath,
    base && fileURLToPath$1(base)
  )
}

/**
 * @param {string} request
 * @param {string} match
 * @param {URL} packageJsonUrl
 * @param {boolean} internal
 * @param {URL} [base]
 * @returns {never}
 */
function throwInvalidSubpath(request, match, packageJsonUrl, internal, base) {
  const reason = `request is not a valid match in pattern "${match}" for the "${
    internal ? 'imports' : 'exports'
  }" resolution of ${fileURLToPath$1(packageJsonUrl)}`;
  throw new ERR_INVALID_MODULE_SPECIFIER(
    request,
    reason,
    base && fileURLToPath$1(base)
  )
}

/**
 * @param {string} subpath
 * @param {unknown} target
 * @param {URL} packageJsonUrl
 * @param {boolean} internal
 * @param {URL} [base]
 * @returns {Error}
 */
function invalidPackageTarget(subpath, target, packageJsonUrl, internal, base) {
  target =
    typeof target === 'object' && target !== null
      ? JSON.stringify(target, null, '')
      : `${target}`;

  return new ERR_INVALID_PACKAGE_TARGET(
    fileURLToPath$1(new URL$1('.', packageJsonUrl)),
    subpath,
    target,
    internal,
    base && fileURLToPath$1(base)
  )
}

/**
 * @param {string} target
 * @param {string} subpath
 * @param {string} match
 * @param {URL} packageJsonUrl
 * @param {URL} base
 * @param {boolean} pattern
 * @param {boolean} internal
 * @param {boolean} isPathMap
 * @param {Set<string> | undefined} conditions
 * @returns {URL}
 */
function resolvePackageTargetString(
  target,
  subpath,
  match,
  packageJsonUrl,
  base,
  pattern,
  internal,
  isPathMap,
  conditions
) {
  if (subpath !== '' && !pattern && target[target.length - 1] !== '/')
    throw invalidPackageTarget(match, target, packageJsonUrl, internal, base)

  if (!target.startsWith('./')) {
    if (internal && !target.startsWith('../') && !target.startsWith('/')) {
      let isURL = false;

      try {
        new URL$1(target);
        isURL = true;
      } catch {
        // Continue regardless of error.
      }

      if (!isURL) {
        const exportTarget = pattern
          ? RegExpPrototypeSymbolReplace.call(
              patternRegEx,
              target,
              () => subpath
            )
          : target + subpath;

        return packageResolve(exportTarget, packageJsonUrl, conditions)
      }
    }

    throw invalidPackageTarget(match, target, packageJsonUrl, internal, base)
  }

  if (invalidSegmentRegEx.exec(target.slice(2)) !== null) {
    if (deprecatedInvalidSegmentRegEx.exec(target.slice(2)) === null) {
      if (!isPathMap) {
        const request = pattern
          ? match.replace('*', () => subpath)
          : match + subpath;
        const resolvedTarget = pattern
          ? RegExpPrototypeSymbolReplace.call(
              patternRegEx,
              target,
              () => subpath
            )
          : target;
        emitInvalidSegmentDeprecation(
          resolvedTarget,
          request,
          match,
          packageJsonUrl,
          internal,
          base,
          true
        );
      }
    } else {
      throw invalidPackageTarget(match, target, packageJsonUrl, internal, base)
    }
  }

  const resolved = new URL$1(target, packageJsonUrl);
  const resolvedPath = resolved.pathname;
  const packagePath = new URL$1('.', packageJsonUrl).pathname;

  if (!resolvedPath.startsWith(packagePath))
    throw invalidPackageTarget(match, target, packageJsonUrl, internal, base)

  if (subpath === '') return resolved

  if (invalidSegmentRegEx.exec(subpath) !== null) {
    const request = pattern
      ? match.replace('*', () => subpath)
      : match + subpath;
    if (deprecatedInvalidSegmentRegEx.exec(subpath) === null) {
      if (!isPathMap) {
        const resolvedTarget = pattern
          ? RegExpPrototypeSymbolReplace.call(
              patternRegEx,
              target,
              () => subpath
            )
          : target;
        emitInvalidSegmentDeprecation(
          resolvedTarget,
          request,
          match,
          packageJsonUrl,
          internal,
          base,
          false
        );
      }
    } else {
      throwInvalidSubpath(request, match, packageJsonUrl, internal, base);
    }
  }

  if (pattern) {
    return new URL$1(
      RegExpPrototypeSymbolReplace.call(
        patternRegEx,
        resolved.href,
        () => subpath
      )
    )
  }

  return new URL$1(subpath, resolved)
}

/**
 * @param {string} key
 * @returns {boolean}
 */
function isArrayIndex(key) {
  const keyNumber = Number(key);
  if (`${keyNumber}` !== key) return false
  return keyNumber >= 0 && keyNumber < 0xff_ff_ff_ff
}

/**
 * @param {URL} packageJsonUrl
 * @param {unknown} target
 * @param {string} subpath
 * @param {string} packageSubpath
 * @param {URL} base
 * @param {boolean} pattern
 * @param {boolean} internal
 * @param {boolean} isPathMap
 * @param {Set<string> | undefined} conditions
 * @returns {URL | null}
 */
function resolvePackageTarget(
  packageJsonUrl,
  target,
  subpath,
  packageSubpath,
  base,
  pattern,
  internal,
  isPathMap,
  conditions
) {
  if (typeof target === 'string') {
    return resolvePackageTargetString(
      target,
      subpath,
      packageSubpath,
      packageJsonUrl,
      base,
      pattern,
      internal,
      isPathMap,
      conditions
    )
  }

  if (Array.isArray(target)) {
    /** @type {Array<unknown>} */
    const targetList = target;
    if (targetList.length === 0) return null

    /** @type {ErrnoException | null | undefined} */
    let lastException;
    let i = -1;

    while (++i < targetList.length) {
      const targetItem = targetList[i];
      /** @type {URL | null} */
      let resolveResult;
      try {
        resolveResult = resolvePackageTarget(
          packageJsonUrl,
          targetItem,
          subpath,
          packageSubpath,
          base,
          pattern,
          internal,
          isPathMap,
          conditions
        );
      } catch (error) {
        const exception = /** @type {ErrnoException} */ (error);
        lastException = exception;
        if (exception.code === 'ERR_INVALID_PACKAGE_TARGET') continue
        throw error
      }

      if (resolveResult === undefined) continue

      if (resolveResult === null) {
        lastException = null;
        continue
      }

      return resolveResult
    }

    if (lastException === undefined || lastException === null) {
      return null
    }

    throw lastException
  }

  if (typeof target === 'object' && target !== null) {
    const keys = Object.getOwnPropertyNames(target);
    let i = -1;

    while (++i < keys.length) {
      const key = keys[i];
      if (isArrayIndex(key)) {
        throw new ERR_INVALID_PACKAGE_CONFIG(
          fileURLToPath$1(packageJsonUrl),
          base,
          '"exports" cannot contain numeric property keys.'
        )
      }
    }

    i = -1;

    while (++i < keys.length) {
      const key = keys[i];
      if (key === 'default' || (conditions && conditions.has(key))) {
        // @ts-expect-error: indexable.
        const conditionalTarget = /** @type {unknown} */ (target[key]);
        const resolveResult = resolvePackageTarget(
          packageJsonUrl,
          conditionalTarget,
          subpath,
          packageSubpath,
          base,
          pattern,
          internal,
          isPathMap,
          conditions
        );
        if (resolveResult === undefined) continue
        return resolveResult
      }
    }

    return null
  }

  if (target === null) {
    return null
  }

  throw invalidPackageTarget(
    packageSubpath,
    target,
    packageJsonUrl,
    internal,
    base
  )
}

/**
 * @param {unknown} exports
 * @param {URL} packageJsonUrl
 * @param {URL} base
 * @returns {boolean}
 */
function isConditionalExportsMainSugar(exports, packageJsonUrl, base) {
  if (typeof exports === 'string' || Array.isArray(exports)) return true
  if (typeof exports !== 'object' || exports === null) return false

  const keys = Object.getOwnPropertyNames(exports);
  let isConditionalSugar = false;
  let i = 0;
  let j = -1;
  while (++j < keys.length) {
    const key = keys[j];
    const curIsConditionalSugar = key === '' || key[0] !== '.';
    if (i++ === 0) {
      isConditionalSugar = curIsConditionalSugar;
    } else if (isConditionalSugar !== curIsConditionalSugar) {
      throw new ERR_INVALID_PACKAGE_CONFIG(
        fileURLToPath$1(packageJsonUrl),
        base,
        '"exports" cannot contain some keys starting with \'.\' and some not.' +
          ' The exports object must either be an object of package subpath keys' +
          ' or an object of main entry condition name keys only.'
      )
    }
  }

  return isConditionalSugar
}

/**
 * @param {string} match
 * @param {URL} pjsonUrl
 * @param {URL} base
 */
function emitTrailingSlashPatternDeprecation(match, pjsonUrl, base) {
  const pjsonPath = fileURLToPath$1(pjsonUrl);
  if (emittedPackageWarnings.has(pjsonPath + '|' + match)) return
  emittedPackageWarnings.add(pjsonPath + '|' + match);
  process$1.emitWarning(
    `Use of deprecated trailing slash pattern mapping "${match}" in the ` +
      `"exports" field module resolution of the package at ${pjsonPath}${
        base ? ` imported from ${fileURLToPath$1(base)}` : ''
      }. Mapping specifiers ending in "/" is no longer supported.`,
    'DeprecationWarning',
    'DEP0155'
  );
}

/**
 * @param {URL} packageJsonUrl
 * @param {string} packageSubpath
 * @param {Record<string, unknown>} packageConfig
 * @param {URL} base
 * @param {Set<string> | undefined} conditions
 * @returns {URL}
 */
function packageExportsResolve(
  packageJsonUrl,
  packageSubpath,
  packageConfig,
  base,
  conditions
) {
  let exports = packageConfig.exports;

  if (isConditionalExportsMainSugar(exports, packageJsonUrl, base)) {
    exports = {'.': exports};
  }

  if (
    own.call(exports, packageSubpath) &&
    !packageSubpath.includes('*') &&
    !packageSubpath.endsWith('/')
  ) {
    // @ts-expect-error: indexable.
    const target = exports[packageSubpath];
    const resolveResult = resolvePackageTarget(
      packageJsonUrl,
      target,
      '',
      packageSubpath,
      base,
      false,
      false,
      false,
      conditions
    );
    if (resolveResult === null || resolveResult === undefined) {
      throw exportsNotFound(packageSubpath, packageJsonUrl, base)
    }

    return resolveResult
  }

  let bestMatch = '';
  let bestMatchSubpath = '';
  const keys = Object.getOwnPropertyNames(exports);
  let i = -1;

  while (++i < keys.length) {
    const key = keys[i];
    const patternIndex = key.indexOf('*');

    if (
      patternIndex !== -1 &&
      packageSubpath.startsWith(key.slice(0, patternIndex))
    ) {
      // When this reaches EOL, this can throw at the top of the whole function:
      //
      // if (StringPrototypeEndsWith(packageSubpath, '/'))
      //   throwInvalidSubpath(packageSubpath)
      //
      // To match "imports" and the spec.
      if (packageSubpath.endsWith('/')) {
        emitTrailingSlashPatternDeprecation(
          packageSubpath,
          packageJsonUrl,
          base
        );
      }

      const patternTrailer = key.slice(patternIndex + 1);

      if (
        packageSubpath.length >= key.length &&
        packageSubpath.endsWith(patternTrailer) &&
        patternKeyCompare(bestMatch, key) === 1 &&
        key.lastIndexOf('*') === patternIndex
      ) {
        bestMatch = key;
        bestMatchSubpath = packageSubpath.slice(
          patternIndex,
          packageSubpath.length - patternTrailer.length
        );
      }
    }
  }

  if (bestMatch) {
    // @ts-expect-error: indexable.
    const target = /** @type {unknown} */ (exports[bestMatch]);
    const resolveResult = resolvePackageTarget(
      packageJsonUrl,
      target,
      bestMatchSubpath,
      bestMatch,
      base,
      true,
      false,
      packageSubpath.endsWith('/'),
      conditions
    );

    if (resolveResult === null || resolveResult === undefined) {
      throw exportsNotFound(packageSubpath, packageJsonUrl, base)
    }

    return resolveResult
  }

  throw exportsNotFound(packageSubpath, packageJsonUrl, base)
}

/**
 * @param {string} a
 * @param {string} b
 */
function patternKeyCompare(a, b) {
  const aPatternIndex = a.indexOf('*');
  const bPatternIndex = b.indexOf('*');
  const baseLengthA = aPatternIndex === -1 ? a.length : aPatternIndex + 1;
  const baseLengthB = bPatternIndex === -1 ? b.length : bPatternIndex + 1;
  if (baseLengthA > baseLengthB) return -1
  if (baseLengthB > baseLengthA) return 1
  if (aPatternIndex === -1) return 1
  if (bPatternIndex === -1) return -1
  if (a.length > b.length) return -1
  if (b.length > a.length) return 1
  return 0
}

/**
 * @param {string} name
 * @param {URL} base
 * @param {Set<string>} [conditions]
 * @returns {URL}
 */
function packageImportsResolve(name, base, conditions) {
  if (name === '#' || name.startsWith('#/') || name.endsWith('/')) {
    const reason = 'is not a valid internal imports specifier name';
    throw new ERR_INVALID_MODULE_SPECIFIER(name, reason, fileURLToPath$1(base))
  }

  /** @type {URL | undefined} */
  let packageJsonUrl;

  const packageConfig = getPackageScopeConfig(base);

  if (packageConfig.exists) {
    packageJsonUrl = pathToFileURL(packageConfig.pjsonPath);
    const imports = packageConfig.imports;
    if (imports) {
      if (own.call(imports, name) && !name.includes('*')) {
        const resolveResult = resolvePackageTarget(
          packageJsonUrl,
          imports[name],
          '',
          name,
          base,
          false,
          true,
          false,
          conditions
        );
        if (resolveResult !== null && resolveResult !== undefined) {
          return resolveResult
        }
      } else {
        let bestMatch = '';
        let bestMatchSubpath = '';
        const keys = Object.getOwnPropertyNames(imports);
        let i = -1;

        while (++i < keys.length) {
          const key = keys[i];
          const patternIndex = key.indexOf('*');

          if (patternIndex !== -1 && name.startsWith(key.slice(0, -1))) {
            const patternTrailer = key.slice(patternIndex + 1);
            if (
              name.length >= key.length &&
              name.endsWith(patternTrailer) &&
              patternKeyCompare(bestMatch, key) === 1 &&
              key.lastIndexOf('*') === patternIndex
            ) {
              bestMatch = key;
              bestMatchSubpath = name.slice(
                patternIndex,
                name.length - patternTrailer.length
              );
            }
          }
        }

        if (bestMatch) {
          const target = imports[bestMatch];
          const resolveResult = resolvePackageTarget(
            packageJsonUrl,
            target,
            bestMatchSubpath,
            bestMatch,
            base,
            true,
            true,
            false,
            conditions
          );

          if (resolveResult !== null && resolveResult !== undefined) {
            return resolveResult
          }
        }
      }
    }
  }

  throw importNotDefined(name, packageJsonUrl, base)
}

// Note: In Node.js, `getPackageType` is here.
// To prevent a circular dependency, we move it to
// `resolve-get-package-type.js`.

/**
 * @param {string} specifier
 * @param {URL} base
 */
function parsePackageName(specifier, base) {
  let separatorIndex = specifier.indexOf('/');
  let validPackageName = true;
  let isScoped = false;
  if (specifier[0] === '@') {
    isScoped = true;
    if (separatorIndex === -1 || specifier.length === 0) {
      validPackageName = false;
    } else {
      separatorIndex = specifier.indexOf('/', separatorIndex + 1);
    }
  }

  const packageName =
    separatorIndex === -1 ? specifier : specifier.slice(0, separatorIndex);

  // Package name cannot have leading . and cannot have percent-encoding or
  // \\ separators.
  if (invalidPackageNameRegEx.exec(packageName) !== null) {
    validPackageName = false;
  }

  if (!validPackageName) {
    throw new ERR_INVALID_MODULE_SPECIFIER(
      specifier,
      'is not a valid package name',
      fileURLToPath$1(base)
    )
  }

  const packageSubpath =
    '.' + (separatorIndex === -1 ? '' : specifier.slice(separatorIndex));

  return {packageName, packageSubpath, isScoped}
}

/**
 * @param {string} specifier
 * @param {URL} base
 * @param {Set<string> | undefined} conditions
 * @returns {URL}
 */
function packageResolve(specifier, base, conditions) {
  if (builtinModules.includes(specifier)) {
    return new URL$1('node:' + specifier)
  }

  const {packageName, packageSubpath, isScoped} = parsePackageName(
    specifier,
    base
  );

  // ResolveSelf
  const packageConfig = getPackageScopeConfig(base);

  // Can’t test.
  /* c8 ignore next 16 */
  if (packageConfig.exists) {
    const packageJsonUrl = pathToFileURL(packageConfig.pjsonPath);
    if (
      packageConfig.name === packageName &&
      packageConfig.exports !== undefined &&
      packageConfig.exports !== null
    ) {
      return packageExportsResolve(
        packageJsonUrl,
        packageSubpath,
        packageConfig,
        base,
        conditions
      )
    }
  }

  let packageJsonUrl = new URL$1(
    './node_modules/' + packageName + '/package.json',
    base
  );
  let packageJsonPath = fileURLToPath$1(packageJsonUrl);
  /** @type {string} */
  let lastPath;
  do {
    const stat = tryStatSync(packageJsonPath.slice(0, -13));
    if (!stat.isDirectory()) {
      lastPath = packageJsonPath;
      packageJsonUrl = new URL$1(
        (isScoped ? '../../../../node_modules/' : '../../../node_modules/') +
          packageName +
          '/package.json',
        packageJsonUrl
      );
      packageJsonPath = fileURLToPath$1(packageJsonUrl);
      continue
    }

    // Package match.
    const packageConfig = getPackageConfig(packageJsonPath, specifier, base);
    if (packageConfig.exports !== undefined && packageConfig.exports !== null) {
      return packageExportsResolve(
        packageJsonUrl,
        packageSubpath,
        packageConfig,
        base,
        conditions
      )
    }

    if (packageSubpath === '.') {
      return legacyMainResolve(packageJsonUrl, packageConfig, base)
    }

    return new URL$1(packageSubpath, packageJsonUrl)
    // Cross-platform root check.
  } while (packageJsonPath.length !== lastPath.length)

  throw new ERR_MODULE_NOT_FOUND(packageName, fileURLToPath$1(base))
}

/**
 * @param {string} specifier
 * @returns {boolean}
 */
function isRelativeSpecifier(specifier) {
  if (specifier[0] === '.') {
    if (specifier.length === 1 || specifier[1] === '/') return true
    if (
      specifier[1] === '.' &&
      (specifier.length === 2 || specifier[2] === '/')
    ) {
      return true
    }
  }

  return false
}

/**
 * @param {string} specifier
 * @returns {boolean}
 */
function shouldBeTreatedAsRelativeOrAbsolutePath(specifier) {
  if (specifier === '') return false
  if (specifier[0] === '/') return true
  return isRelativeSpecifier(specifier)
}

/**
 * The “Resolver Algorithm Specification” as detailed in the Node docs (which is
 * sync and slightly lower-level than `resolve`).
 *
 * @param {string} specifier
 *   `/example.js`, `./example.js`, `../example.js`, `some-package`, `fs`, etc.
 * @param {URL} base
 *   Full URL (to a file) that `specifier` is resolved relative from.
 * @param {Set<string>} [conditions]
 *   Conditions.
 * @param {boolean} [preserveSymlinks]
 *   Keep symlinks instead of resolving them.
 * @returns {URL}
 *   A URL object to the found thing.
 */
function moduleResolve(specifier, base, conditions, preserveSymlinks) {
  const protocol = base.protocol;
  const isRemote = protocol === 'http:' || protocol === 'https:';
  // Order swapped from spec for minor perf gain.
  // Ok since relative URLs cannot parse as URLs.
  /** @type {URL | undefined} */
  let resolved;

  if (shouldBeTreatedAsRelativeOrAbsolutePath(specifier)) {
    resolved = new URL$1(specifier, base);
  } else if (!isRemote && specifier[0] === '#') {
    resolved = packageImportsResolve(specifier, base, conditions);
  } else {
    try {
      resolved = new URL$1(specifier);
    } catch {
      if (!isRemote) {
        resolved = packageResolve(specifier, base, conditions);
      }
    }
  }

  assert(resolved !== undefined, 'expected to be defined');

  if (resolved.protocol !== 'file:') {
    return resolved
  }

  return finalizeResolution(resolved, base, preserveSymlinks)
}

function fileURLToPath(id) {
  if (typeof id === "string" && !id.startsWith("file://")) {
    return normalizeSlash(id);
  }
  return normalizeSlash(fileURLToPath$1(id));
}
const INVALID_CHAR_RE = /[\u0000-\u001F"#$&*+,/:;<=>?@[\]^`{|}\u007F]+/g;
function sanitizeURIComponent(name = "", replacement = "_") {
  return name.replace(INVALID_CHAR_RE, replacement).replace(/%../g, replacement);
}
function sanitizeFilePath(filePath = "") {
  return filePath.replace(/\?.*$/, "").split(/[/\\]/g).map((p) => sanitizeURIComponent(p)).join("/").replace(/^([A-Za-z])_\//, "$1:/");
}
function normalizeid(id) {
  if (typeof id !== "string") {
    id = id.toString();
  }
  if (/(node|data|http|https|file):/.test(id)) {
    return id;
  }
  if (BUILTIN_MODULES.has(id)) {
    return "node:" + id;
  }
  return "file://" + encodeURI(normalizeSlash(id));
}
async function loadURL(url) {
  const code = await promises.readFile(fileURLToPath(url), "utf8");
  return code;
}
function toDataURL(code) {
  const base64 = Buffer.from(code).toString("base64");
  return `data:text/javascript;base64,${base64}`;
}
function isNodeBuiltin(id = "") {
  id = id.replace(/^node:/, "").split("/")[0];
  return BUILTIN_MODULES.has(id);
}
const ProtocolRegex = /^(?<proto>.{2,}?):.+$/;
function getProtocol(id) {
  const proto = id.match(ProtocolRegex);
  return proto ? proto.groups.proto : void 0;
}

const DEFAULT_CONDITIONS_SET = /* @__PURE__ */ new Set(["node", "import"]);
const DEFAULT_URL = pathToFileURL(process.cwd());
const DEFAULT_EXTENSIONS = [".mjs", ".cjs", ".js", ".json"];
const NOT_FOUND_ERRORS = /* @__PURE__ */ new Set([
  "ERR_MODULE_NOT_FOUND",
  "ERR_UNSUPPORTED_DIR_IMPORT",
  "MODULE_NOT_FOUND",
  "ERR_PACKAGE_PATH_NOT_EXPORTED"
]);
function _tryModuleResolve(id, url, conditions) {
  try {
    return moduleResolve(id, url, conditions);
  } catch (error) {
    if (!NOT_FOUND_ERRORS.has(error.code)) {
      throw error;
    }
  }
}
function _resolve(id, options = {}) {
  if (/(node|data|http|https):/.test(id)) {
    return id;
  }
  if (BUILTIN_MODULES.has(id)) {
    return "node:" + id;
  }
  if (isAbsolute(id) && existsSync(id)) {
    const realPath2 = realpathSync(fileURLToPath(id));
    return pathToFileURL(realPath2).toString();
  }
  const conditionsSet = options.conditions ? new Set(options.conditions) : DEFAULT_CONDITIONS_SET;
  const _urls = (Array.isArray(options.url) ? options.url : [options.url]).filter(Boolean).map((u) => new URL(normalizeid(u.toString())));
  if (_urls.length === 0) {
    _urls.push(DEFAULT_URL);
  }
  const urls = [..._urls];
  for (const url of _urls) {
    if (url.protocol === "file:") {
      urls.push(
        new URL("./", url),
        // If url is directory
        new URL(joinURL(url.pathname, "_index.js"), url),
        // TODO: Remove in next major version?
        new URL("node_modules", url)
      );
    }
  }
  let resolved;
  for (const url of urls) {
    resolved = _tryModuleResolve(id, url, conditionsSet);
    if (resolved) {
      break;
    }
    for (const prefix of ["", "/index"]) {
      for (const extension of options.extensions || DEFAULT_EXTENSIONS) {
        resolved = _tryModuleResolve(
          id + prefix + extension,
          url,
          conditionsSet
        );
        if (resolved) {
          break;
        }
      }
      if (resolved) {
        break;
      }
    }
    if (resolved) {
      break;
    }
  }
  if (!resolved) {
    const error = new Error(
      `Cannot find module ${id} imported from ${urls.join(", ")}`
    );
    error.code = "ERR_MODULE_NOT_FOUND";
    throw error;
  }
  const realPath = realpathSync(fileURLToPath(resolved));
  return pathToFileURL(realPath).toString();
}
function resolveSync(id, options) {
  return _resolve(id, options);
}
function resolve(id, options) {
  return pcall(resolveSync, id, options);
}
function resolvePathSync(id, options) {
  return fileURLToPath(resolveSync(id, options));
}
function resolvePath(id, options) {
  return pcall(resolvePathSync, id, options);
}
function createResolve(defaults) {
  return (id, url) => {
    return resolve(id, { url, ...defaults });
  };
}
const NODE_MODULES_RE = /^(.+\/node_modules\/)([^/@]+|@[^/]+\/[^/]+)(\/?.*?)?$/;
function parseNodeModulePath(path) {
  if (!path) {
    return {};
  }
  path = normalize(fileURLToPath(path));
  const match = NODE_MODULES_RE.exec(path);
  if (!match) {
    return {};
  }
  const [, dir, name, subpath] = match;
  return {
    dir,
    name,
    subpath: subpath ? `.${subpath}` : void 0
  };
}
async function lookupNodeModuleSubpath(path) {
  path = normalize(fileURLToPath(path));
  const { name, subpath } = parseNodeModulePath(path);
  if (!name || !subpath) {
    return subpath;
  }
  const { exports } = await readPackageJSON(path).catch(() => {
  }) || {};
  if (exports) {
    const resolvedSubpath = _findSubpath(subpath, exports);
    if (resolvedSubpath) {
      return resolvedSubpath;
    }
  }
  return subpath;
}
function _findSubpath(subpath, exports) {
  if (typeof exports === "string") {
    exports = { ".": exports };
  }
  if (!subpath.startsWith(".")) {
    subpath = subpath.startsWith("/") ? `.${subpath}` : `./${subpath}`;
  }
  if (subpath in exports) {
    return subpath;
  }
  const flattenedExports = _flattenExports(exports);
  const [foundPath] = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    flattenedExports.find(([_, resolved]) => resolved === subpath) || []
  );
  return foundPath;
}
function _flattenExports(exports, path) {
  return Object.entries(exports).flatMap(
    ([key, value]) => typeof value === "string" ? [[path ?? key, value]] : _flattenExports(value, path ?? key)
  );
}

const ESM_STATIC_IMPORT_RE = /(?<=\s|^|;)import\s*([\s"']*(?<imports>[\p{L}\p{M}\w\t\n\r $*,/{}@.]+)from\s*)?["']\s*(?<specifier>(?<="\s*)[^"]*[^\s"](?=\s*")|(?<='\s*)[^']*[^\s'](?=\s*'))\s*["'][\s;]*/gmu;
const DYNAMIC_IMPORT_RE = /import\s*\((?<expression>(?:[^()]+|\((?:[^()]+|\([^()]*\))*\))*)\)/gm;
const IMPORT_NAMED_TYPE_RE = /(?<=\s|^|;)import\s*type\s+([\s"']*(?<imports>[\w\t\n\r $*,/{}]+)from\s*)?["']\s*(?<specifier>(?<="\s*)[^"]*[^\s"](?=\s*")|(?<='\s*)[^']*[^\s'](?=\s*'))\s*["'][\s;]*/gm;
const EXPORT_DECAL_RE = /\bexport\s+(?<declaration>(async function|function|let|const enum|const|enum|var|class))\s+(?<name>[\w$]+)/g;
const EXPORT_DECAL_TYPE_RE = /\bexport\s+(?<declaration>(interface|type|declare (async function|function|let|const enum|const|enum|var|class)))\s+(?<name>[\w$]+)/g;
const EXPORT_NAMED_RE = /\bexport\s+{(?<exports>[^}]+?)[\s,]*}(\s*from\s*["']\s*(?<specifier>(?<="\s*)[^"]*[^\s"](?=\s*")|(?<='\s*)[^']*[^\s'](?=\s*'))\s*["'][^\n;]*)?/g;
const EXPORT_NAMED_TYPE_RE = /\bexport\s+type\s+{(?<exports>[^}]+?)[\s,]*}(\s*from\s*["']\s*(?<specifier>(?<="\s*)[^"]*[^\s"](?=\s*")|(?<='\s*)[^']*[^\s'](?=\s*'))\s*["'][^\n;]*)?/g;
const EXPORT_NAMED_DESTRUCT = /\bexport\s+(let|var|const)\s+(?:{(?<exports1>[^}]+?)[\s,]*}|\[(?<exports2>[^\]]+?)[\s,]*])\s+=/gm;
const EXPORT_STAR_RE = /\bexport\s*(\*)(\s*as\s+(?<name>[\w$]+)\s+)?\s*(\s*from\s*["']\s*(?<specifier>(?<="\s*)[^"]*[^\s"](?=\s*")|(?<='\s*)[^']*[^\s'](?=\s*'))\s*["'][^\n;]*)?/g;
const EXPORT_DEFAULT_RE = /\bexport\s+default\s+/g;
const TYPE_RE = /^\s*?type\s/;
function findStaticImports(code) {
  return matchAll(ESM_STATIC_IMPORT_RE, code, { type: "static" });
}
function findDynamicImports(code) {
  return matchAll(DYNAMIC_IMPORT_RE, code, { type: "dynamic" });
}
function findTypeImports(code) {
  return [
    ...matchAll(IMPORT_NAMED_TYPE_RE, code, { type: "type" }),
    ...matchAll(ESM_STATIC_IMPORT_RE, code, { type: "static" }).filter(
      (match) => /[^A-Za-z]type\s/.test(match.imports)
    )
  ];
}
function parseStaticImport(matched) {
  const cleanedImports = clearImports(matched.imports);
  const namedImports = {};
  for (const namedImport of cleanedImports.match(/{([^}]*)}/)?.[1]?.split(",") || []) {
    const [, source = namedImport.trim(), importName = source] = namedImport.match(/^\s*(\S*) as (\S*)\s*$/) || [];
    if (source && !TYPE_RE.test(source)) {
      namedImports[source] = importName;
    }
  }
  const { namespacedImport, defaultImport } = getImportNames(cleanedImports);
  return {
    ...matched,
    defaultImport,
    namespacedImport,
    namedImports
  };
}
function parseTypeImport(matched) {
  if (matched.type === "type") {
    return parseStaticImport(matched);
  }
  const cleanedImports = clearImports(matched.imports);
  const namedImports = {};
  for (const namedImport of cleanedImports.match(/{([^}]*)}/)?.[1]?.split(",") || []) {
    const [, source = namedImport.trim(), importName = source] = (() => {
      return /\s+as\s+/.test(namedImport) ? namedImport.match(/^\s*type\s+(\S*) as (\S*)\s*$/) || [] : namedImport.match(/^\s*type\s+(\S*)\s*$/) || [];
    })();
    if (source && TYPE_RE.test(namedImport)) {
      namedImports[source] = importName;
    }
  }
  const { namespacedImport, defaultImport } = getImportNames(cleanedImports);
  return {
    ...matched,
    defaultImport,
    namespacedImport,
    namedImports
  };
}
function findExports(code) {
  const declaredExports = matchAll(EXPORT_DECAL_RE, code, {
    type: "declaration"
  });
  const namedExports = normalizeNamedExports(
    matchAll(EXPORT_NAMED_RE, code, {
      type: "named"
    })
  );
  const destructuredExports = matchAll(
    EXPORT_NAMED_DESTRUCT,
    code,
    { type: "named" }
  );
  for (const namedExport of destructuredExports) {
    namedExport.exports = namedExport.exports1 || namedExport.exports2;
    namedExport.names = namedExport.exports.replace(/^\r?\n?/, "").split(/\s*,\s*/g).filter((name) => !TYPE_RE.test(name)).map(
      (name) => name.replace(/^.*?\s*:\s*/, "").replace(/\s*=\s*.*$/, "").trim()
    );
  }
  const defaultExport = matchAll(EXPORT_DEFAULT_RE, code, {
    type: "default",
    name: "default"
  });
  const starExports = matchAll(EXPORT_STAR_RE, code, {
    type: "star"
  });
  const exports = normalizeExports([
    ...declaredExports,
    ...namedExports,
    ...destructuredExports,
    ...defaultExport,
    ...starExports
  ]);
  if (exports.length === 0) {
    return [];
  }
  const exportLocations = _tryGetExportLocations(code);
  if (exportLocations && exportLocations.length === 0) {
    return [];
  }
  return exports.filter(
    (exp) => !exportLocations || _isExportStatement(exportLocations, exp)
  ).filter((exp, index, exports2) => {
    const nextExport = exports2[index + 1];
    return !nextExport || exp.type !== nextExport.type || !exp.name || exp.name !== nextExport.name;
  });
}
function findTypeExports(code) {
  const declaredExports = matchAll(
    EXPORT_DECAL_TYPE_RE,
    code,
    { type: "declaration" }
  );
  const namedExports = normalizeNamedExports(
    matchAll(EXPORT_NAMED_TYPE_RE, code, {
      type: "named"
    })
  );
  const exports = normalizeExports([
    ...declaredExports,
    ...namedExports
  ]);
  if (exports.length === 0) {
    return [];
  }
  const exportLocations = _tryGetExportLocations(code);
  if (exportLocations && exportLocations.length === 0) {
    return [];
  }
  return exports.filter(
    (exp) => !exportLocations || _isExportStatement(exportLocations, exp)
  ).filter((exp, index, exports2) => {
    const nextExport = exports2[index + 1];
    return !nextExport || exp.type !== nextExport.type || !exp.name || exp.name !== nextExport.name;
  });
}
function normalizeExports(exports) {
  for (const exp of exports) {
    if (!exp.name && exp.names && exp.names.length === 1) {
      exp.name = exp.names[0];
    }
    if (exp.name === "default" && exp.type !== "default") {
      exp._type = exp.type;
      exp.type = "default";
    }
    if (!exp.names && exp.name) {
      exp.names = [exp.name];
    }
  }
  return exports;
}
function normalizeNamedExports(namedExports) {
  for (const namedExport of namedExports) {
    namedExport.names = namedExport.exports.replace(/^\r?\n?/, "").split(/\s*,\s*/g).filter((name) => !TYPE_RE.test(name)).map((name) => name.replace(/^.*?\sas\s/, "").trim());
  }
  return namedExports;
}
function findExportNames(code) {
  return findExports(code).flatMap((exp) => exp.names).filter(Boolean);
}
async function resolveModuleExportNames(id, options) {
  const url = await resolvePath(id, options);
  const code = await loadURL(url);
  const exports = findExports(code);
  const exportNames = new Set(
    exports.flatMap((exp) => exp.names).filter(Boolean)
  );
  for (const exp of exports) {
    if (exp.type === "star") {
      const subExports = await resolveModuleExportNames(exp.specifier, {
        ...options,
        url
      });
      for (const subExport of subExports) {
        exportNames.add(subExport);
      }
    }
  }
  return [...exportNames];
}
function _isExportStatement(exportsLocation, exp) {
  return exportsLocation.some((location) => {
    return exp.start <= location.start && exp.end >= location.end;
  });
}
function _tryGetExportLocations(code) {
  try {
    return _getExportLocations(code);
  } catch {
  }
}
function _getExportLocations(code) {
  const tokens = tokenizer(code, {
    ecmaVersion: "latest",
    sourceType: "module",
    allowHashBang: true,
    allowAwaitOutsideFunction: true,
    allowImportExportEverywhere: true
  });
  const locations = [];
  for (const token of tokens) {
    if (token.type.label === "export") {
      locations.push({
        start: token.start,
        end: token.end
      });
    }
  }
  return locations;
}

function createCommonJS(url) {
  const __filename = fileURLToPath(url);
  const __dirname = dirname(__filename);
  let _nativeRequire;
  const getNativeRequire = () => _nativeRequire || (_nativeRequire = createRequire(url));
  function require(id) {
    return getNativeRequire()(id);
  }
  require.resolve = (id, options) => getNativeRequire().resolve(id, options);
  return {
    __filename,
    __dirname,
    require
  };
}
function interopDefault(sourceModule) {
  if (!isObject(sourceModule) || !("default" in sourceModule)) {
    return sourceModule;
  }
  const newModule = sourceModule.default;
  for (const key in sourceModule) {
    if (key === "default") {
      try {
        if (!(key in newModule)) {
          Object.defineProperty(newModule, key, {
            enumerable: false,
            configurable: false,
            get() {
              return newModule;
            }
          });
        }
      } catch {
      }
    } else {
      try {
        if (!(key in newModule)) {
          Object.defineProperty(newModule, key, {
            enumerable: true,
            configurable: true,
            get() {
              return sourceModule[key];
            }
          });
        }
      } catch {
      }
    }
  }
  return newModule;
}

const EVAL_ESM_IMPORT_RE = /(?<=import .* from ["'])([^"']+)(?=["'])|(?<=export .* from ["'])([^"']+)(?=["'])|(?<=import\s*["'])([^"']+)(?=["'])|(?<=import\s*\(["'])([^"']+)(?=["']\))/g;
async function loadModule(id, options = {}) {
  const url = await resolve(id, options);
  const code = await loadURL(url);
  return evalModule(code, { ...options, url });
}
async function evalModule(code, options = {}) {
  const transformed = await transformModule(code, options);
  const dataURL = toDataURL(transformed);
  return import(dataURL).catch((error) => {
    error.stack = error.stack.replace(
      new RegExp(dataURL, "g"),
      options.url || "_mlly_eval_"
    );
    throw error;
  });
}
function transformModule(code, options) {
  if (options.url && options.url.endsWith(".json")) {
    return Promise.resolve("export default " + code);
  }
  if (options.url) {
    code = code.replace(/import\.meta\.url/g, `'${options.url}'`);
  }
  return Promise.resolve(code);
}
async function resolveImports(code, options) {
  const imports = [...code.matchAll(EVAL_ESM_IMPORT_RE)].map((m) => m[0]);
  if (imports.length === 0) {
    return code;
  }
  const uniqueImports = [...new Set(imports)];
  const resolved = /* @__PURE__ */ new Map();
  await Promise.all(
    uniqueImports.map(async (id) => {
      let url = await resolve(id, options);
      if (url.endsWith(".json")) {
        const code2 = await loadURL(url);
        url = toDataURL(await transformModule(code2, { url }));
      }
      resolved.set(id, url);
    })
  );
  const re = new RegExp(
    uniqueImports.map((index) => `(${index})`).join("|"),
    "g"
  );
  return code.replace(re, (id) => resolved.get(id));
}

const ESM_RE = /([\s;]|^)(import[\s\w*,{}]*from|import\s*["'*{]|export\b\s*(?:[*{]|default|class|type|function|const|var|let|async function)|import\.meta\b)/m;
const BUILTIN_EXTENSIONS = /* @__PURE__ */ new Set([".mjs", ".cjs", ".node", ".wasm"]);
function hasESMSyntax(code) {
  return ESM_RE.test(code);
}
const CJS_RE = /([\s;]|^)(module.exports\b|exports\.\w|require\s*\(|global\.\w)/m;
function hasCJSSyntax(code) {
  return CJS_RE.test(code);
}
function detectSyntax(code) {
  const hasESM = hasESMSyntax(code);
  const hasCJS = hasCJSSyntax(code);
  return {
    hasESM,
    hasCJS,
    isMixed: hasESM && hasCJS
  };
}
const validNodeImportDefaults = {
  allowedProtocols: ["node", "file", "data"]
};
async function isValidNodeImport(id, _options = {}) {
  if (isNodeBuiltin(id)) {
    return true;
  }
  const options = { ...validNodeImportDefaults, ..._options };
  const proto = getProtocol(id);
  if (proto && !options.allowedProtocols.includes(proto)) {
    return false;
  }
  if (proto === "data") {
    return true;
  }
  const resolvedPath = await resolvePath(id, options);
  const extension = extname$1(resolvedPath);
  if (BUILTIN_EXTENSIONS.has(extension)) {
    return true;
  }
  if (extension !== ".js") {
    return false;
  }
  const package_ = await readPackageJSON(resolvedPath).catch(() => {
  });
  if (package_?.type === "module") {
    return true;
  }
  if (/\.(\w+-)?esm?(-\w+)?\.js$|\/(esm?)\//.test(resolvedPath)) {
    return false;
  }
  const code = options.code || await promises.readFile(resolvedPath, "utf8").catch(() => {
  }) || "";
  return hasCJSSyntax(code) || !hasESMSyntax(code);
}

export { DYNAMIC_IMPORT_RE, ESM_STATIC_IMPORT_RE, EXPORT_DECAL_RE, EXPORT_DECAL_TYPE_RE, createCommonJS, createResolve, detectSyntax, evalModule, fileURLToPath, findDynamicImports, findExportNames, findExports, findStaticImports, findTypeExports, findTypeImports, getProtocol, hasCJSSyntax, hasESMSyntax, interopDefault, isNodeBuiltin, isValidNodeImport, loadModule, loadURL, lookupNodeModuleSubpath, normalizeid, parseNodeModulePath, parseStaticImport, parseTypeImport, resolve, resolveImports, resolveModuleExportNames, resolvePath, resolvePathSync, resolveSync, sanitizeFilePath, sanitizeURIComponent, toDataURL, transformModule };
