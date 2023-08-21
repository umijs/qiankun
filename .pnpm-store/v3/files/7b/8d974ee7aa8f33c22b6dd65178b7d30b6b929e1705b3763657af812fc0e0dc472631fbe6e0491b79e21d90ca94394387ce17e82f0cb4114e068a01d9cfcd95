import { pathToFileURL, fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
import 'acorn';
import { builtinModules } from 'node:module';
import 'node:fs';
import 'pathe';
import assert from 'node:assert';
import process$1 from 'node:process';
import 'node:path';
import v8 from 'node:v8';
import { format, inspect } from 'node:util';
import { normalizeModuleId } from 'vite-node/utils';
import './vendor-index.087d1af7.js';
import { g as getWorkerState } from './vendor-global.97e4527c.js';
import 'std-env';
import '@vitest/runner/utils';
import '@vitest/utils';

const BUILTIN_MODULES = new Set(builtinModules);

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

createError(
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

createError(
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

createError(
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

createError(
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

createError(
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

createError(
  'ERR_NETWORK_IMPORT_DISALLOWED',
  "import of '%s' by %s is not supported: %s",
  Error
);

createError(
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

createError(
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

createError(
  'ERR_UNSUPPORTED_DIR_IMPORT',
  "Directory import '%s' is not supported " +
    'resolving ES modules imported from %s',
  Error
);

createError(
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

createError(
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

createError(
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
function isNodeBuiltin(id = "") {
  id = id.replace(/^node:/, "").split("/")[0];
  return BUILTIN_MODULES.has(id);
}
pathToFileURL(process.cwd());
const CJS_RE = /([\s;]|^)(module.exports\b|exports\.\w|require\s*\(|global\.\w)/m;
function hasCJSSyntax(code) {
  return CJS_RE.test(code);
}

var ModuleFormat = /* @__PURE__ */ ((ModuleFormat2) => {
  ModuleFormat2["Builtin"] = "builtin";
  ModuleFormat2["Commonjs"] = "commonjs";
  ModuleFormat2["Json"] = "json";
  ModuleFormat2["Module"] = "module";
  ModuleFormat2["Wasm"] = "wasm";
  return ModuleFormat2;
})(ModuleFormat || {});

const ESM_RE = /([\s;}]|^)(import[\w,{}\s*]*from|import\s*['"*{]|export\b\s*(?:[*{]|default|class|type|function|const|var|let|async function)|import\.meta\b)/m;
function hasESMSyntax(code) {
  return ESM_RE.test(code);
}
const cache = /* @__PURE__ */ new Map();
async function getPotentialSource(filepath, result) {
  var _a;
  if (!result.url.startsWith("file://") || result.format === "module")
    return null;
  let source = (_a = cache.get(result.url)) == null ? void 0 : _a.source;
  if (source == null)
    source = await readFile(filepath, "utf8");
  return source;
}
function detectESM(url, source) {
  const cached = cache.get(url);
  if (cached)
    return cached.isPseudoESM;
  if (!source)
    return false;
  return hasESMSyntax(source) && !hasCJSSyntax(source);
}
const resolve = async (url, context, next) => {
  var _a;
  const { parentURL } = context;
  const state = getWorkerState();
  const resolver = state == null ? void 0 : state.rpc.resolveId;
  const environment = state == null ? void 0 : state.ctx.environment;
  if (!parentURL || isNodeBuiltin(url) || !resolver || !environment)
    return next(url, context, next);
  const id = normalizeModuleId(url);
  const importer = normalizeModuleId(parentURL);
  const resolved = await resolver(id, importer, environment.transformMode ?? ((_a = environment.environment) == null ? void 0 : _a.transformMode) ?? "ssr");
  let result;
  let filepath;
  if (resolved) {
    const resolvedUrl = pathToFileURL(resolved.id).toString();
    filepath = resolved.id;
    result = {
      url: resolvedUrl,
      shortCircuit: true
    };
  } else {
    const { url: resolvedUrl, format } = await next(url, context, next);
    filepath = fileURLToPath(resolvedUrl);
    result = {
      url: resolvedUrl,
      format,
      shortCircuit: true
    };
  }
  const source = await getPotentialSource(filepath, result);
  const isPseudoESM = detectESM(result.url, source);
  if (typeof source === "string")
    cache.set(result.url, { isPseudoESM, source });
  if (isPseudoESM)
    result.format = ModuleFormat.Module;
  return result;
};
const load = async (url, context, next) => {
  const result = await next(url, context, next);
  const cached = cache.get(url);
  if ((cached == null ? void 0 : cached.isPseudoESM) && result.format !== "module") {
    return {
      source: cached.source,
      format: ModuleFormat.Module
    };
  }
  return result;
};

export { load, resolve };
