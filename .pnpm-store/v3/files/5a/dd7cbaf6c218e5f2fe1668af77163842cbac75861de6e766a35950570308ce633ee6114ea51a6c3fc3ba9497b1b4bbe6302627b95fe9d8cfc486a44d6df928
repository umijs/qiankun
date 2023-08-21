import { resolve, relative, isAbsolute, dirname, basename, normalize, join, extname, toNamespacedPath } from 'pathe';
import { loadConfigFromFile, createServer, version as version$2, mergeConfig } from 'vite';
import path$a from 'node:path';
import url, { fileURLToPath, pathToFileURL } from 'node:url';
import process$1 from 'node:process';
import fs$8, { promises, existsSync, readFileSync } from 'node:fs';
import { E as EXIT_CODE_RESTART, c as configFiles, d as defaultPort, a as defaultBrowserPort, w as workspacesFiles, C as CONFIG_NAMES } from './vendor-constants.538d9b49.js';
import { g as getDefaultExportFromCjs, c as commonjsGlobal } from './vendor-_commonjsHelpers.7d1333e8.js';
import require$$0 from 'os';
import f$1 from 'path';
import require$$2 from 'util';
import require$$0$1 from 'stream';
import require$$2$1 from 'events';
import $ from 'fs';
import c from 'picocolors';
import { slash as slash$2, normalizeRequestId, cleanUrl } from 'vite-node/utils';
import { ViteNodeRunner } from 'vite-node/client';
import { SnapshotManager } from '@vitest/snapshot/manager';
import { ViteNodeServer } from 'vite-node/server';
import { a as isNode, r as relativePath, b as removeUndefinedValues, c as isWindows } from './vendor-index.087d1af7.js';
import { g as getCoverageProvider, C as CoverageProviderMap } from './vendor-coverage.78040316.js';
import { d as distDir, r as rootDir } from './vendor-paths.84fc7a99.js';
import v8 from 'node:v8';
import { fork } from 'node:child_process';
import { c as createBirpc } from './vendor-index.b271ebe4.js';
import { g as groupBy, A as AggregateErrorPonyfill, s as slash$1, t as toArray, i as isPrimitive, d as deepMerge, n as noop$1, a as stdout } from './vendor-base.9c08bbd0.js';
import { MessageChannel } from 'node:worker_threads';
import { cpus, hostname, totalmem } from 'node:os';
import Tinypool from 'tinypool';
import { createDefer, getSafeTimers, notNullish, shuffle, inspect, positionToOffset, lineSplitRE } from '@vitest/utils';
import { isPackageExists, resolveModule } from 'local-pkg';
import { isCI } from 'std-env';
import { performance } from 'node:perf_hooks';
import { g as getFullName, h as hasFailedSnapshot, p as parseErrorStacktrace, T as TraceMap, b as generatedPositionFor } from './vendor-source-map.e6c1997b.js';
import { getTests, hasFailed, getSuites, generateHash, calculateSuiteHash, someTasksAreOnly, interpretTaskModes, getTasks } from '@vitest/runner/utils';
import { createRequire, builtinModules } from 'node:module';
import { createHash } from 'node:crypto';
import { o as onExit, e as execa } from './vendor-index.1f85e5f1.js';
import { writeFile, rm } from 'node:fs/promises';
import ue from 'module';
import { parse as parse$4 } from 'acorn';
import { ancestor, simple, findNodeAround } from 'acorn-walk';
import MagicString from 'magic-string';
import { stripLiteral } from 'strip-literal';
import { g as getEnvPackageName } from './vendor-environments.443ecd82.js';
import readline from 'node:readline';
import require$$0$2 from 'readline';

function _mergeNamespaces(n, m) {
  m.forEach(function (e) {
    e && typeof e !== 'string' && !Array.isArray(e) && Object.keys(e).forEach(function (k) {
      if (k !== 'default' && !(k in n)) {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  });
  return Object.freeze(n);
}

var version$1 = "0.34.1";

const __dirname$1 = url.fileURLToPath(new URL(".", import.meta.url));
async function ensurePackageInstalled(dependency, root) {
  if (isPackageExists(dependency, { paths: [root, __dirname$1] }))
    return true;
  const promptInstall = !isCI && process.stdout.isTTY;
  process.stderr.write(c.red(`${c.inverse(c.red(" MISSING DEP "))} Can not find dependency '${dependency}'

`));
  if (!promptInstall)
    return false;
  const prompts = await Promise.resolve().then(function () { return index; });
  const { install } = await prompts.prompt({
    type: "confirm",
    name: "install",
    message: c.reset(`Do you want to install ${c.green(dependency)}?`)
  });
  if (install) {
    await (await import('./chunk-install-pkg.dd40cbef.js')).installPackage(dependency, { dev: true });
    process.stderr.write(c.yellow(`
Package ${dependency} installed, re-run the command to start.
`));
    process.exit(EXIT_CODE_RESTART);
    return true;
  }
  return false;
}

/*
How it works:
`this.#head` is an instance of `Node` which keeps track of its current value and nests another instance of `Node` that keeps the value that comes after it. When a value is provided to `.enqueue()`, the code needs to iterate through `this.#head`, going deeper and deeper to find the last value. However, iterating through every single item is slow. This problem is solved by saving a reference to the last value as `this.#tail` so that it can reference it to add a new value.
*/

class Node {
	value;
	next;

	constructor(value) {
		this.value = value;
	}
}

class Queue {
	#head;
	#tail;
	#size;

	constructor() {
		this.clear();
	}

	enqueue(value) {
		const node = new Node(value);

		if (this.#head) {
			this.#tail.next = node;
			this.#tail = node;
		} else {
			this.#head = node;
			this.#tail = node;
		}

		this.#size++;
	}

	dequeue() {
		const current = this.#head;
		if (!current) {
			return;
		}

		this.#head = this.#head.next;
		this.#size--;
		return current.value;
	}

	clear() {
		this.#head = undefined;
		this.#tail = undefined;
		this.#size = 0;
	}

	get size() {
		return this.#size;
	}

	* [Symbol.iterator]() {
		let current = this.#head;

		while (current) {
			yield current.value;
			current = current.next;
		}
	}
}

function pLimit(concurrency) {
	if (!((Number.isInteger(concurrency) || concurrency === Number.POSITIVE_INFINITY) && concurrency > 0)) {
		throw new TypeError('Expected `concurrency` to be a number from 1 and up');
	}

	const queue = new Queue();
	let activeCount = 0;

	const next = () => {
		activeCount--;

		if (queue.size > 0) {
			queue.dequeue()();
		}
	};

	const run = async (fn, resolve, args) => {
		activeCount++;

		const result = (async () => fn(...args))();

		resolve(result);

		try {
			await result;
		} catch {}

		next();
	};

	const enqueue = (fn, resolve, args) => {
		queue.enqueue(run.bind(undefined, fn, resolve, args));

		(async () => {
			// This function needs to wait until the next microtask before comparing
			// `activeCount` to `concurrency`, because `activeCount` is updated asynchronously
			// when the run function is dequeued and called. The comparison in the if-statement
			// needs to happen asynchronously as well to get an up-to-date value for `activeCount`.
			await Promise.resolve();

			if (activeCount < concurrency && queue.size > 0) {
				queue.dequeue()();
			}
		})();
	};

	const generator = (fn, ...args) => new Promise(resolve => {
		enqueue(fn, resolve, args);
	});

	Object.defineProperties(generator, {
		activeCount: {
			get: () => activeCount,
		},
		pendingCount: {
			get: () => queue.size,
		},
		clearQueue: {
			value: () => {
				queue.clear();
			},
		},
	});

	return generator;
}

class EndError extends Error {
	constructor(value) {
		super();
		this.value = value;
	}
}

// The input can also be a promise, so we await it.
const testElement = async (element, tester) => tester(await element);

// The input can also be a promise, so we `Promise.all()` them both.
const finder = async element => {
	const values = await Promise.all(element);
	if (values[1] === true) {
		throw new EndError(values[0]);
	}

	return false;
};

async function pLocate(
	iterable,
	tester,
	{
		concurrency = Number.POSITIVE_INFINITY,
		preserveOrder = true,
	} = {},
) {
	const limit = pLimit(concurrency);

	// Start all the promises concurrently with optional limit.
	const items = [...iterable].map(element => [element, limit(testElement, element, tester)]);

	// Check the promises either serially or concurrently.
	const checkLimit = pLimit(preserveOrder ? 1 : Number.POSITIVE_INFINITY);

	try {
		await Promise.all(items.map(element => checkLimit(finder, element)));
	} catch (error) {
		if (error instanceof EndError) {
			return error.value;
		}

		throw error;
	}
}

const typeMappings = {
	directory: 'isDirectory',
	file: 'isFile',
};

function checkType(type) {
	if (Object.hasOwnProperty.call(typeMappings, type)) {
		return;
	}

	throw new Error(`Invalid type specified: ${type}`);
}

const matchType = (type, stat) => stat[typeMappings[type]]();

const toPath$1 = urlOrPath => urlOrPath instanceof URL ? fileURLToPath(urlOrPath) : urlOrPath;

async function locatePath(
	paths,
	{
		cwd = process$1.cwd(),
		type = 'file',
		allowSymlinks = true,
		concurrency,
		preserveOrder,
	} = {},
) {
	checkType(type);
	cwd = toPath$1(cwd);

	const statFunction = allowSymlinks ? promises.stat : promises.lstat;

	return pLocate(paths, async path_ => {
		try {
			const stat = await statFunction(path$a.resolve(cwd, path_));
			return matchType(type, stat);
		} catch {
			return false;
		}
	}, {concurrency, preserveOrder});
}

const toPath = urlOrPath => urlOrPath instanceof URL ? fileURLToPath(urlOrPath) : urlOrPath;

const findUpStop = Symbol('findUpStop');

async function findUpMultiple(name, options = {}) {
	let directory = path$a.resolve(toPath(options.cwd) || '');
	const {root} = path$a.parse(directory);
	const stopAt = path$a.resolve(directory, options.stopAt || root);
	const limit = options.limit || Number.POSITIVE_INFINITY;
	const paths = [name].flat();

	const runMatcher = async locateOptions => {
		if (typeof name !== 'function') {
			return locatePath(paths, locateOptions);
		}

		const foundPath = await name(locateOptions.cwd);
		if (typeof foundPath === 'string') {
			return locatePath([foundPath], locateOptions);
		}

		return foundPath;
	};

	const matches = [];
	// eslint-disable-next-line no-constant-condition
	while (true) {
		// eslint-disable-next-line no-await-in-loop
		const foundPath = await runMatcher({...options, cwd: directory});

		if (foundPath === findUpStop) {
			break;
		}

		if (foundPath) {
			matches.push(path$a.resolve(directory, foundPath));
		}

		if (directory === stopAt || matches.length >= limit) {
			break;
		}

		directory = path$a.dirname(directory);
	}

	return matches;
}

async function findUp(name, options = {}) {
	const matches = await findUpMultiple(name, {...options, limit: 1});
	return matches[0];
}

var tasks = {};

var utils$k = {};

var array$1 = {};

Object.defineProperty(array$1, "__esModule", { value: true });
array$1.splitWhen = array$1.flatten = void 0;
function flatten(items) {
    return items.reduce((collection, item) => [].concat(collection, item), []);
}
array$1.flatten = flatten;
function splitWhen(items, predicate) {
    const result = [[]];
    let groupIndex = 0;
    for (const item of items) {
        if (predicate(item)) {
            groupIndex++;
            result[groupIndex] = [];
        }
        else {
            result[groupIndex].push(item);
        }
    }
    return result;
}
array$1.splitWhen = splitWhen;

var errno$1 = {};

Object.defineProperty(errno$1, "__esModule", { value: true });
errno$1.isEnoentCodeError = void 0;
function isEnoentCodeError(error) {
    return error.code === 'ENOENT';
}
errno$1.isEnoentCodeError = isEnoentCodeError;

var fs$7 = {};

Object.defineProperty(fs$7, "__esModule", { value: true });
fs$7.createDirentFromStats = void 0;
let DirentFromStats$1 = class DirentFromStats {
    constructor(name, stats) {
        this.name = name;
        this.isBlockDevice = stats.isBlockDevice.bind(stats);
        this.isCharacterDevice = stats.isCharacterDevice.bind(stats);
        this.isDirectory = stats.isDirectory.bind(stats);
        this.isFIFO = stats.isFIFO.bind(stats);
        this.isFile = stats.isFile.bind(stats);
        this.isSocket = stats.isSocket.bind(stats);
        this.isSymbolicLink = stats.isSymbolicLink.bind(stats);
    }
};
function createDirentFromStats$1(name, stats) {
    return new DirentFromStats$1(name, stats);
}
fs$7.createDirentFromStats = createDirentFromStats$1;

var path$9 = {};

Object.defineProperty(path$9, "__esModule", { value: true });
path$9.convertPosixPathToPattern = path$9.convertWindowsPathToPattern = path$9.convertPathToPattern = path$9.escapePosixPath = path$9.escapeWindowsPath = path$9.escape = path$9.removeLeadingDotSegment = path$9.makeAbsolute = path$9.unixify = void 0;
const os = require$$0;
const path$8 = f$1;
const IS_WINDOWS_PLATFORM = os.platform() === 'win32';
const LEADING_DOT_SEGMENT_CHARACTERS_COUNT = 2; // ./ or .\\
/**
 * All non-escaped special characters.
 * Posix: ()*?[\]{|}, !+@ before (, ! at the beginning, \\ before non-special characters.
 * Windows: (){}, !+@ before (, ! at the beginning.
 */
const POSIX_UNESCAPED_GLOB_SYMBOLS_RE = /(\\?)([()*?[\]{|}]|^!|[!+@](?=\()|\\(?![!()*+?@[\]{|}]))/g;
const WINDOWS_UNESCAPED_GLOB_SYMBOLS_RE = /(\\?)([(){}]|^!|[!+@](?=\())/g;
/**
 * The device path (\\.\ or \\?\).
 * https://learn.microsoft.com/en-us/dotnet/standard/io/file-path-formats#dos-device-paths
 */
const DOS_DEVICE_PATH_RE = /^\\\\([.?])/;
/**
 * All backslashes except those escaping special characters.
 * Windows: !()+@{}
 * https://learn.microsoft.com/en-us/windows/win32/fileio/naming-a-file#naming-conventions
 */
const WINDOWS_BACKSLASHES_RE = /\\(?![!()+@{}])/g;
/**
 * Designed to work only with simple paths: `dir\\file`.
 */
function unixify(filepath) {
    return filepath.replace(/\\/g, '/');
}
path$9.unixify = unixify;
function makeAbsolute(cwd, filepath) {
    return path$8.resolve(cwd, filepath);
}
path$9.makeAbsolute = makeAbsolute;
function removeLeadingDotSegment(entry) {
    // We do not use `startsWith` because this is 10x slower than current implementation for some cases.
    // eslint-disable-next-line @typescript-eslint/prefer-string-starts-ends-with
    if (entry.charAt(0) === '.') {
        const secondCharactery = entry.charAt(1);
        if (secondCharactery === '/' || secondCharactery === '\\') {
            return entry.slice(LEADING_DOT_SEGMENT_CHARACTERS_COUNT);
        }
    }
    return entry;
}
path$9.removeLeadingDotSegment = removeLeadingDotSegment;
path$9.escape = IS_WINDOWS_PLATFORM ? escapeWindowsPath : escapePosixPath;
function escapeWindowsPath(pattern) {
    return pattern.replace(WINDOWS_UNESCAPED_GLOB_SYMBOLS_RE, '\\$2');
}
path$9.escapeWindowsPath = escapeWindowsPath;
function escapePosixPath(pattern) {
    return pattern.replace(POSIX_UNESCAPED_GLOB_SYMBOLS_RE, '\\$2');
}
path$9.escapePosixPath = escapePosixPath;
path$9.convertPathToPattern = IS_WINDOWS_PLATFORM ? convertWindowsPathToPattern : convertPosixPathToPattern;
function convertWindowsPathToPattern(filepath) {
    return escapeWindowsPath(filepath)
        .replace(DOS_DEVICE_PATH_RE, '//$1')
        .replace(WINDOWS_BACKSLASHES_RE, '/');
}
path$9.convertWindowsPathToPattern = convertWindowsPathToPattern;
function convertPosixPathToPattern(filepath) {
    return escapePosixPath(filepath);
}
path$9.convertPosixPathToPattern = convertPosixPathToPattern;

var pattern$1 = {};

/*!
 * is-extglob <https://github.com/jonschlinkert/is-extglob>
 *
 * Copyright (c) 2014-2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

var isExtglob$1 = function isExtglob(str) {
  if (typeof str !== 'string' || str === '') {
    return false;
  }

  var match;
  while ((match = /(\\).|([@?!+*]\(.*\))/g.exec(str))) {
    if (match[2]) return true;
    str = str.slice(match.index + match[0].length);
  }

  return false;
};

/*!
 * is-glob <https://github.com/jonschlinkert/is-glob>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

var isExtglob = isExtglob$1;
var chars = { '{': '}', '(': ')', '[': ']'};
var strictCheck = function(str) {
  if (str[0] === '!') {
    return true;
  }
  var index = 0;
  var pipeIndex = -2;
  var closeSquareIndex = -2;
  var closeCurlyIndex = -2;
  var closeParenIndex = -2;
  var backSlashIndex = -2;
  while (index < str.length) {
    if (str[index] === '*') {
      return true;
    }

    if (str[index + 1] === '?' && /[\].+)]/.test(str[index])) {
      return true;
    }

    if (closeSquareIndex !== -1 && str[index] === '[' && str[index + 1] !== ']') {
      if (closeSquareIndex < index) {
        closeSquareIndex = str.indexOf(']', index);
      }
      if (closeSquareIndex > index) {
        if (backSlashIndex === -1 || backSlashIndex > closeSquareIndex) {
          return true;
        }
        backSlashIndex = str.indexOf('\\', index);
        if (backSlashIndex === -1 || backSlashIndex > closeSquareIndex) {
          return true;
        }
      }
    }

    if (closeCurlyIndex !== -1 && str[index] === '{' && str[index + 1] !== '}') {
      closeCurlyIndex = str.indexOf('}', index);
      if (closeCurlyIndex > index) {
        backSlashIndex = str.indexOf('\\', index);
        if (backSlashIndex === -1 || backSlashIndex > closeCurlyIndex) {
          return true;
        }
      }
    }

    if (closeParenIndex !== -1 && str[index] === '(' && str[index + 1] === '?' && /[:!=]/.test(str[index + 2]) && str[index + 3] !== ')') {
      closeParenIndex = str.indexOf(')', index);
      if (closeParenIndex > index) {
        backSlashIndex = str.indexOf('\\', index);
        if (backSlashIndex === -1 || backSlashIndex > closeParenIndex) {
          return true;
        }
      }
    }

    if (pipeIndex !== -1 && str[index] === '(' && str[index + 1] !== '|') {
      if (pipeIndex < index) {
        pipeIndex = str.indexOf('|', index);
      }
      if (pipeIndex !== -1 && str[pipeIndex + 1] !== ')') {
        closeParenIndex = str.indexOf(')', pipeIndex);
        if (closeParenIndex > pipeIndex) {
          backSlashIndex = str.indexOf('\\', pipeIndex);
          if (backSlashIndex === -1 || backSlashIndex > closeParenIndex) {
            return true;
          }
        }
      }
    }

    if (str[index] === '\\') {
      var open = str[index + 1];
      index += 2;
      var close = chars[open];

      if (close) {
        var n = str.indexOf(close, index);
        if (n !== -1) {
          index = n + 1;
        }
      }

      if (str[index] === '!') {
        return true;
      }
    } else {
      index++;
    }
  }
  return false;
};

var relaxedCheck = function(str) {
  if (str[0] === '!') {
    return true;
  }
  var index = 0;
  while (index < str.length) {
    if (/[*?{}()[\]]/.test(str[index])) {
      return true;
    }

    if (str[index] === '\\') {
      var open = str[index + 1];
      index += 2;
      var close = chars[open];

      if (close) {
        var n = str.indexOf(close, index);
        if (n !== -1) {
          index = n + 1;
        }
      }

      if (str[index] === '!') {
        return true;
      }
    } else {
      index++;
    }
  }
  return false;
};

var isGlob$1 = function isGlob(str, options) {
  if (typeof str !== 'string' || str === '') {
    return false;
  }

  if (isExtglob(str)) {
    return true;
  }

  var check = strictCheck;

  // optionally relax check
  if (options && options.strict === false) {
    check = relaxedCheck;
  }

  return check(str);
};

var isGlob = isGlob$1;
var pathPosixDirname = f$1.posix.dirname;
var isWin32 = require$$0.platform() === 'win32';

var slash = '/';
var backslash = /\\/g;
var enclosure = /[\{\[].*[\}\]]$/;
var globby = /(^|[^\\])([\{\[]|\([^\)]+$)/;
var escaped = /\\([\!\*\?\|\[\]\(\)\{\}])/g;

/**
 * @param {string} str
 * @param {Object} opts
 * @param {boolean} [opts.flipBackslashes=true]
 * @returns {string}
 */
var globParent$1 = function globParent(str, opts) {
  var options = Object.assign({ flipBackslashes: true }, opts);

  // flip windows path separators
  if (options.flipBackslashes && isWin32 && str.indexOf(slash) < 0) {
    str = str.replace(backslash, slash);
  }

  // special case for strings ending in enclosure containing path separator
  if (enclosure.test(str)) {
    str += slash;
  }

  // preserves full path in case of trailing path separator
  str += 'a';

  // remove path parts that are globby
  do {
    str = pathPosixDirname(str);
  } while (isGlob(str) || globby.test(str));

  // remove escape chars and return result
  return str.replace(escaped, '$1');
};

var utils$j = {};

(function (exports) {

	exports.isInteger = num => {
	  if (typeof num === 'number') {
	    return Number.isInteger(num);
	  }
	  if (typeof num === 'string' && num.trim() !== '') {
	    return Number.isInteger(Number(num));
	  }
	  return false;
	};

	/**
	 * Find a node of the given type
	 */

	exports.find = (node, type) => node.nodes.find(node => node.type === type);

	/**
	 * Find a node of the given type
	 */

	exports.exceedsLimit = (min, max, step = 1, limit) => {
	  if (limit === false) return false;
	  if (!exports.isInteger(min) || !exports.isInteger(max)) return false;
	  return ((Number(max) - Number(min)) / Number(step)) >= limit;
	};

	/**
	 * Escape the given node with '\\' before node.value
	 */

	exports.escapeNode = (block, n = 0, type) => {
	  let node = block.nodes[n];
	  if (!node) return;

	  if ((type && node.type === type) || node.type === 'open' || node.type === 'close') {
	    if (node.escaped !== true) {
	      node.value = '\\' + node.value;
	      node.escaped = true;
	    }
	  }
	};

	/**
	 * Returns true if the given brace node should be enclosed in literal braces
	 */

	exports.encloseBrace = node => {
	  if (node.type !== 'brace') return false;
	  if ((node.commas >> 0 + node.ranges >> 0) === 0) {
	    node.invalid = true;
	    return true;
	  }
	  return false;
	};

	/**
	 * Returns true if a brace node is invalid.
	 */

	exports.isInvalidBrace = block => {
	  if (block.type !== 'brace') return false;
	  if (block.invalid === true || block.dollar) return true;
	  if ((block.commas >> 0 + block.ranges >> 0) === 0) {
	    block.invalid = true;
	    return true;
	  }
	  if (block.open !== true || block.close !== true) {
	    block.invalid = true;
	    return true;
	  }
	  return false;
	};

	/**
	 * Returns true if a node is an open or close node
	 */

	exports.isOpenOrClose = node => {
	  if (node.type === 'open' || node.type === 'close') {
	    return true;
	  }
	  return node.open === true || node.close === true;
	};

	/**
	 * Reduce an array of text nodes.
	 */

	exports.reduce = nodes => nodes.reduce((acc, node) => {
	  if (node.type === 'text') acc.push(node.value);
	  if (node.type === 'range') node.type = 'text';
	  return acc;
	}, []);

	/**
	 * Flatten an array
	 */

	exports.flatten = (...args) => {
	  const result = [];
	  const flat = arr => {
	    for (let i = 0; i < arr.length; i++) {
	      let ele = arr[i];
	      Array.isArray(ele) ? flat(ele) : ele !== void 0 && result.push(ele);
	    }
	    return result;
	  };
	  flat(args);
	  return result;
	}; 
} (utils$j));

const utils$i = utils$j;

var stringify$4 = (ast, options = {}) => {
  let stringify = (node, parent = {}) => {
    let invalidBlock = options.escapeInvalid && utils$i.isInvalidBrace(parent);
    let invalidNode = node.invalid === true && options.escapeInvalid === true;
    let output = '';

    if (node.value) {
      if ((invalidBlock || invalidNode) && utils$i.isOpenOrClose(node)) {
        return '\\' + node.value;
      }
      return node.value;
    }

    if (node.value) {
      return node.value;
    }

    if (node.nodes) {
      for (let child of node.nodes) {
        output += stringify(child);
      }
    }
    return output;
  };

  return stringify(ast);
};

/*!
 * is-number <https://github.com/jonschlinkert/is-number>
 *
 * Copyright (c) 2014-present, Jon Schlinkert.
 * Released under the MIT License.
 */

var isNumber$2 = function(num) {
  if (typeof num === 'number') {
    return num - num === 0;
  }
  if (typeof num === 'string' && num.trim() !== '') {
    return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
  }
  return false;
};

/*!
 * to-regex-range <https://github.com/micromatch/to-regex-range>
 *
 * Copyright (c) 2015-present, Jon Schlinkert.
 * Released under the MIT License.
 */

const isNumber$1 = isNumber$2;

const toRegexRange$1 = (min, max, options) => {
  if (isNumber$1(min) === false) {
    throw new TypeError('toRegexRange: expected the first argument to be a number');
  }

  if (max === void 0 || min === max) {
    return String(min);
  }

  if (isNumber$1(max) === false) {
    throw new TypeError('toRegexRange: expected the second argument to be a number.');
  }

  let opts = { relaxZeros: true, ...options };
  if (typeof opts.strictZeros === 'boolean') {
    opts.relaxZeros = opts.strictZeros === false;
  }

  let relax = String(opts.relaxZeros);
  let shorthand = String(opts.shorthand);
  let capture = String(opts.capture);
  let wrap = String(opts.wrap);
  let cacheKey = min + ':' + max + '=' + relax + shorthand + capture + wrap;

  if (toRegexRange$1.cache.hasOwnProperty(cacheKey)) {
    return toRegexRange$1.cache[cacheKey].result;
  }

  let a = Math.min(min, max);
  let b = Math.max(min, max);

  if (Math.abs(a - b) === 1) {
    let result = min + '|' + max;
    if (opts.capture) {
      return `(${result})`;
    }
    if (opts.wrap === false) {
      return result;
    }
    return `(?:${result})`;
  }

  let isPadded = hasPadding(min) || hasPadding(max);
  let state = { min, max, a, b };
  let positives = [];
  let negatives = [];

  if (isPadded) {
    state.isPadded = isPadded;
    state.maxLen = String(state.max).length;
  }

  if (a < 0) {
    let newMin = b < 0 ? Math.abs(b) : 1;
    negatives = splitToPatterns(newMin, Math.abs(a), state, opts);
    a = state.a = 0;
  }

  if (b >= 0) {
    positives = splitToPatterns(a, b, state, opts);
  }

  state.negatives = negatives;
  state.positives = positives;
  state.result = collatePatterns(negatives, positives);

  if (opts.capture === true) {
    state.result = `(${state.result})`;
  } else if (opts.wrap !== false && (positives.length + negatives.length) > 1) {
    state.result = `(?:${state.result})`;
  }

  toRegexRange$1.cache[cacheKey] = state;
  return state.result;
};

function collatePatterns(neg, pos, options) {
  let onlyNegative = filterPatterns(neg, pos, '-', false) || [];
  let onlyPositive = filterPatterns(pos, neg, '', false) || [];
  let intersected = filterPatterns(neg, pos, '-?', true) || [];
  let subpatterns = onlyNegative.concat(intersected).concat(onlyPositive);
  return subpatterns.join('|');
}

function splitToRanges(min, max) {
  let nines = 1;
  let zeros = 1;

  let stop = countNines(min, nines);
  let stops = new Set([max]);

  while (min <= stop && stop <= max) {
    stops.add(stop);
    nines += 1;
    stop = countNines(min, nines);
  }

  stop = countZeros(max + 1, zeros) - 1;

  while (min < stop && stop <= max) {
    stops.add(stop);
    zeros += 1;
    stop = countZeros(max + 1, zeros) - 1;
  }

  stops = [...stops];
  stops.sort(compare);
  return stops;
}

/**
 * Convert a range to a regex pattern
 * @param {Number} `start`
 * @param {Number} `stop`
 * @return {String}
 */

function rangeToPattern(start, stop, options) {
  if (start === stop) {
    return { pattern: start, count: [], digits: 0 };
  }

  let zipped = zip(start, stop);
  let digits = zipped.length;
  let pattern = '';
  let count = 0;

  for (let i = 0; i < digits; i++) {
    let [startDigit, stopDigit] = zipped[i];

    if (startDigit === stopDigit) {
      pattern += startDigit;

    } else if (startDigit !== '0' || stopDigit !== '9') {
      pattern += toCharacterClass(startDigit, stopDigit);

    } else {
      count++;
    }
  }

  if (count) {
    pattern += options.shorthand === true ? '\\d' : '[0-9]';
  }

  return { pattern, count: [count], digits };
}

function splitToPatterns(min, max, tok, options) {
  let ranges = splitToRanges(min, max);
  let tokens = [];
  let start = min;
  let prev;

  for (let i = 0; i < ranges.length; i++) {
    let max = ranges[i];
    let obj = rangeToPattern(String(start), String(max), options);
    let zeros = '';

    if (!tok.isPadded && prev && prev.pattern === obj.pattern) {
      if (prev.count.length > 1) {
        prev.count.pop();
      }

      prev.count.push(obj.count[0]);
      prev.string = prev.pattern + toQuantifier(prev.count);
      start = max + 1;
      continue;
    }

    if (tok.isPadded) {
      zeros = padZeros(max, tok, options);
    }

    obj.string = zeros + obj.pattern + toQuantifier(obj.count);
    tokens.push(obj);
    start = max + 1;
    prev = obj;
  }

  return tokens;
}

function filterPatterns(arr, comparison, prefix, intersection, options) {
  let result = [];

  for (let ele of arr) {
    let { string } = ele;

    // only push if _both_ are negative...
    if (!intersection && !contains(comparison, 'string', string)) {
      result.push(prefix + string);
    }

    // or _both_ are positive
    if (intersection && contains(comparison, 'string', string)) {
      result.push(prefix + string);
    }
  }
  return result;
}

/**
 * Zip strings
 */

function zip(a, b) {
  let arr = [];
  for (let i = 0; i < a.length; i++) arr.push([a[i], b[i]]);
  return arr;
}

function compare(a, b) {
  return a > b ? 1 : b > a ? -1 : 0;
}

function contains(arr, key, val) {
  return arr.some(ele => ele[key] === val);
}

function countNines(min, len) {
  return Number(String(min).slice(0, -len) + '9'.repeat(len));
}

function countZeros(integer, zeros) {
  return integer - (integer % Math.pow(10, zeros));
}

function toQuantifier(digits) {
  let [start = 0, stop = ''] = digits;
  if (stop || start > 1) {
    return `{${start + (stop ? ',' + stop : '')}}`;
  }
  return '';
}

function toCharacterClass(a, b, options) {
  return `[${a}${(b - a === 1) ? '' : '-'}${b}]`;
}

function hasPadding(str) {
  return /^-?(0+)\d/.test(str);
}

function padZeros(value, tok, options) {
  if (!tok.isPadded) {
    return value;
  }

  let diff = Math.abs(tok.maxLen - String(value).length);
  let relax = options.relaxZeros !== false;

  switch (diff) {
    case 0:
      return '';
    case 1:
      return relax ? '0?' : '0';
    case 2:
      return relax ? '0{0,2}' : '00';
    default: {
      return relax ? `0{0,${diff}}` : `0{${diff}}`;
    }
  }
}

/**
 * Cache
 */

toRegexRange$1.cache = {};
toRegexRange$1.clearCache = () => (toRegexRange$1.cache = {});

/**
 * Expose `toRegexRange`
 */

var toRegexRange_1 = toRegexRange$1;

/*!
 * fill-range <https://github.com/jonschlinkert/fill-range>
 *
 * Copyright (c) 2014-present, Jon Schlinkert.
 * Licensed under the MIT License.
 */

const util$3 = require$$2;
const toRegexRange = toRegexRange_1;

const isObject$1 = val => val !== null && typeof val === 'object' && !Array.isArray(val);

const transform = toNumber => {
  return value => toNumber === true ? Number(value) : String(value);
};

const isValidValue = value => {
  return typeof value === 'number' || (typeof value === 'string' && value !== '');
};

const isNumber = num => Number.isInteger(+num);

const zeros = input => {
  let value = `${input}`;
  let index = -1;
  if (value[0] === '-') value = value.slice(1);
  if (value === '0') return false;
  while (value[++index] === '0');
  return index > 0;
};

const stringify$3 = (start, end, options) => {
  if (typeof start === 'string' || typeof end === 'string') {
    return true;
  }
  return options.stringify === true;
};

const pad = (input, maxLength, toNumber) => {
  if (maxLength > 0) {
    let dash = input[0] === '-' ? '-' : '';
    if (dash) input = input.slice(1);
    input = (dash + input.padStart(dash ? maxLength - 1 : maxLength, '0'));
  }
  if (toNumber === false) {
    return String(input);
  }
  return input;
};

const toMaxLen = (input, maxLength) => {
  let negative = input[0] === '-' ? '-' : '';
  if (negative) {
    input = input.slice(1);
    maxLength--;
  }
  while (input.length < maxLength) input = '0' + input;
  return negative ? ('-' + input) : input;
};

const toSequence = (parts, options) => {
  parts.negatives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
  parts.positives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);

  let prefix = options.capture ? '' : '?:';
  let positives = '';
  let negatives = '';
  let result;

  if (parts.positives.length) {
    positives = parts.positives.join('|');
  }

  if (parts.negatives.length) {
    negatives = `-(${prefix}${parts.negatives.join('|')})`;
  }

  if (positives && negatives) {
    result = `${positives}|${negatives}`;
  } else {
    result = positives || negatives;
  }

  if (options.wrap) {
    return `(${prefix}${result})`;
  }

  return result;
};

const toRange = (a, b, isNumbers, options) => {
  if (isNumbers) {
    return toRegexRange(a, b, { wrap: false, ...options });
  }

  let start = String.fromCharCode(a);
  if (a === b) return start;

  let stop = String.fromCharCode(b);
  return `[${start}-${stop}]`;
};

const toRegex = (start, end, options) => {
  if (Array.isArray(start)) {
    let wrap = options.wrap === true;
    let prefix = options.capture ? '' : '?:';
    return wrap ? `(${prefix}${start.join('|')})` : start.join('|');
  }
  return toRegexRange(start, end, options);
};

const rangeError = (...args) => {
  return new RangeError('Invalid range arguments: ' + util$3.inspect(...args));
};

const invalidRange = (start, end, options) => {
  if (options.strictRanges === true) throw rangeError([start, end]);
  return [];
};

const invalidStep = (step, options) => {
  if (options.strictRanges === true) {
    throw new TypeError(`Expected step "${step}" to be a number`);
  }
  return [];
};

const fillNumbers = (start, end, step = 1, options = {}) => {
  let a = Number(start);
  let b = Number(end);

  if (!Number.isInteger(a) || !Number.isInteger(b)) {
    if (options.strictRanges === true) throw rangeError([start, end]);
    return [];
  }

  // fix negative zero
  if (a === 0) a = 0;
  if (b === 0) b = 0;

  let descending = a > b;
  let startString = String(start);
  let endString = String(end);
  let stepString = String(step);
  step = Math.max(Math.abs(step), 1);

  let padded = zeros(startString) || zeros(endString) || zeros(stepString);
  let maxLen = padded ? Math.max(startString.length, endString.length, stepString.length) : 0;
  let toNumber = padded === false && stringify$3(start, end, options) === false;
  let format = options.transform || transform(toNumber);

  if (options.toRegex && step === 1) {
    return toRange(toMaxLen(start, maxLen), toMaxLen(end, maxLen), true, options);
  }

  let parts = { negatives: [], positives: [] };
  let push = num => parts[num < 0 ? 'negatives' : 'positives'].push(Math.abs(num));
  let range = [];
  let index = 0;

  while (descending ? a >= b : a <= b) {
    if (options.toRegex === true && step > 1) {
      push(a);
    } else {
      range.push(pad(format(a, index), maxLen, toNumber));
    }
    a = descending ? a - step : a + step;
    index++;
  }

  if (options.toRegex === true) {
    return step > 1
      ? toSequence(parts, options)
      : toRegex(range, null, { wrap: false, ...options });
  }

  return range;
};

const fillLetters = (start, end, step = 1, options = {}) => {
  if ((!isNumber(start) && start.length > 1) || (!isNumber(end) && end.length > 1)) {
    return invalidRange(start, end, options);
  }


  let format = options.transform || (val => String.fromCharCode(val));
  let a = `${start}`.charCodeAt(0);
  let b = `${end}`.charCodeAt(0);

  let descending = a > b;
  let min = Math.min(a, b);
  let max = Math.max(a, b);

  if (options.toRegex && step === 1) {
    return toRange(min, max, false, options);
  }

  let range = [];
  let index = 0;

  while (descending ? a >= b : a <= b) {
    range.push(format(a, index));
    a = descending ? a - step : a + step;
    index++;
  }

  if (options.toRegex === true) {
    return toRegex(range, null, { wrap: false, options });
  }

  return range;
};

const fill$2 = (start, end, step, options = {}) => {
  if (end == null && isValidValue(start)) {
    return [start];
  }

  if (!isValidValue(start) || !isValidValue(end)) {
    return invalidRange(start, end, options);
  }

  if (typeof step === 'function') {
    return fill$2(start, end, 1, { transform: step });
  }

  if (isObject$1(step)) {
    return fill$2(start, end, 0, step);
  }

  let opts = { ...options };
  if (opts.capture === true) opts.wrap = true;
  step = step || opts.step || 1;

  if (!isNumber(step)) {
    if (step != null && !isObject$1(step)) return invalidStep(step, opts);
    return fill$2(start, end, 1, step);
  }

  if (isNumber(start) && isNumber(end)) {
    return fillNumbers(start, end, step, opts);
  }

  return fillLetters(start, end, Math.max(Math.abs(step), 1), opts);
};

var fillRange = fill$2;

const fill$1 = fillRange;
const utils$h = utils$j;

const compile$1 = (ast, options = {}) => {
  let walk = (node, parent = {}) => {
    let invalidBlock = utils$h.isInvalidBrace(parent);
    let invalidNode = node.invalid === true && options.escapeInvalid === true;
    let invalid = invalidBlock === true || invalidNode === true;
    let prefix = options.escapeInvalid === true ? '\\' : '';
    let output = '';

    if (node.isOpen === true) {
      return prefix + node.value;
    }
    if (node.isClose === true) {
      return prefix + node.value;
    }

    if (node.type === 'open') {
      return invalid ? (prefix + node.value) : '(';
    }

    if (node.type === 'close') {
      return invalid ? (prefix + node.value) : ')';
    }

    if (node.type === 'comma') {
      return node.prev.type === 'comma' ? '' : (invalid ? node.value : '|');
    }

    if (node.value) {
      return node.value;
    }

    if (node.nodes && node.ranges > 0) {
      let args = utils$h.reduce(node.nodes);
      let range = fill$1(...args, { ...options, wrap: false, toRegex: true });

      if (range.length !== 0) {
        return args.length > 1 && range.length > 1 ? `(${range})` : range;
      }
    }

    if (node.nodes) {
      for (let child of node.nodes) {
        output += walk(child, node);
      }
    }
    return output;
  };

  return walk(ast);
};

var compile_1 = compile$1;

const fill = fillRange;
const stringify$2 = stringify$4;
const utils$g = utils$j;

const append = (queue = '', stash = '', enclose = false) => {
  let result = [];

  queue = [].concat(queue);
  stash = [].concat(stash);

  if (!stash.length) return queue;
  if (!queue.length) {
    return enclose ? utils$g.flatten(stash).map(ele => `{${ele}}`) : stash;
  }

  for (let item of queue) {
    if (Array.isArray(item)) {
      for (let value of item) {
        result.push(append(value, stash, enclose));
      }
    } else {
      for (let ele of stash) {
        if (enclose === true && typeof ele === 'string') ele = `{${ele}}`;
        result.push(Array.isArray(ele) ? append(item, ele, enclose) : (item + ele));
      }
    }
  }
  return utils$g.flatten(result);
};

const expand$1 = (ast, options = {}) => {
  let rangeLimit = options.rangeLimit === void 0 ? 1000 : options.rangeLimit;

  let walk = (node, parent = {}) => {
    node.queue = [];

    let p = parent;
    let q = parent.queue;

    while (p.type !== 'brace' && p.type !== 'root' && p.parent) {
      p = p.parent;
      q = p.queue;
    }

    if (node.invalid || node.dollar) {
      q.push(append(q.pop(), stringify$2(node, options)));
      return;
    }

    if (node.type === 'brace' && node.invalid !== true && node.nodes.length === 2) {
      q.push(append(q.pop(), ['{}']));
      return;
    }

    if (node.nodes && node.ranges > 0) {
      let args = utils$g.reduce(node.nodes);

      if (utils$g.exceedsLimit(...args, options.step, rangeLimit)) {
        throw new RangeError('expanded array length exceeds range limit. Use options.rangeLimit to increase or disable the limit.');
      }

      let range = fill(...args, options);
      if (range.length === 0) {
        range = stringify$2(node, options);
      }

      q.push(append(q.pop(), range));
      node.nodes = [];
      return;
    }

    let enclose = utils$g.encloseBrace(node);
    let queue = node.queue;
    let block = node;

    while (block.type !== 'brace' && block.type !== 'root' && block.parent) {
      block = block.parent;
      queue = block.queue;
    }

    for (let i = 0; i < node.nodes.length; i++) {
      let child = node.nodes[i];

      if (child.type === 'comma' && node.type === 'brace') {
        if (i === 1) queue.push('');
        queue.push('');
        continue;
      }

      if (child.type === 'close') {
        q.push(append(q.pop(), queue, enclose));
        continue;
      }

      if (child.value && child.type !== 'open') {
        queue.push(append(queue.pop(), child.value));
        continue;
      }

      if (child.nodes) {
        walk(child, node);
      }
    }

    return queue;
  };

  return utils$g.flatten(walk(ast));
};

var expand_1 = expand$1;

var constants$4 = {
  MAX_LENGTH: 1024 * 64,

  // Digits
  CHAR_0: '0', /* 0 */
  CHAR_9: '9', /* 9 */

  // Alphabet chars.
  CHAR_UPPERCASE_A: 'A', /* A */
  CHAR_LOWERCASE_A: 'a', /* a */
  CHAR_UPPERCASE_Z: 'Z', /* Z */
  CHAR_LOWERCASE_Z: 'z', /* z */

  CHAR_LEFT_PARENTHESES: '(', /* ( */
  CHAR_RIGHT_PARENTHESES: ')', /* ) */

  CHAR_ASTERISK: '*', /* * */

  // Non-alphabetic chars.
  CHAR_AMPERSAND: '&', /* & */
  CHAR_AT: '@', /* @ */
  CHAR_BACKSLASH: '\\', /* \ */
  CHAR_BACKTICK: '`', /* ` */
  CHAR_CARRIAGE_RETURN: '\r', /* \r */
  CHAR_CIRCUMFLEX_ACCENT: '^', /* ^ */
  CHAR_COLON: ':', /* : */
  CHAR_COMMA: ',', /* , */
  CHAR_DOLLAR: '$', /* . */
  CHAR_DOT: '.', /* . */
  CHAR_DOUBLE_QUOTE: '"', /* " */
  CHAR_EQUAL: '=', /* = */
  CHAR_EXCLAMATION_MARK: '!', /* ! */
  CHAR_FORM_FEED: '\f', /* \f */
  CHAR_FORWARD_SLASH: '/', /* / */
  CHAR_HASH: '#', /* # */
  CHAR_HYPHEN_MINUS: '-', /* - */
  CHAR_LEFT_ANGLE_BRACKET: '<', /* < */
  CHAR_LEFT_CURLY_BRACE: '{', /* { */
  CHAR_LEFT_SQUARE_BRACKET: '[', /* [ */
  CHAR_LINE_FEED: '\n', /* \n */
  CHAR_NO_BREAK_SPACE: '\u00A0', /* \u00A0 */
  CHAR_PERCENT: '%', /* % */
  CHAR_PLUS: '+', /* + */
  CHAR_QUESTION_MARK: '?', /* ? */
  CHAR_RIGHT_ANGLE_BRACKET: '>', /* > */
  CHAR_RIGHT_CURLY_BRACE: '}', /* } */
  CHAR_RIGHT_SQUARE_BRACKET: ']', /* ] */
  CHAR_SEMICOLON: ';', /* ; */
  CHAR_SINGLE_QUOTE: '\'', /* ' */
  CHAR_SPACE: ' ', /*   */
  CHAR_TAB: '\t', /* \t */
  CHAR_UNDERSCORE: '_', /* _ */
  CHAR_VERTICAL_LINE: '|', /* | */
  CHAR_ZERO_WIDTH_NOBREAK_SPACE: '\uFEFF' /* \uFEFF */
};

const stringify$1 = stringify$4;

/**
 * Constants
 */

const {
  MAX_LENGTH: MAX_LENGTH$1,
  CHAR_BACKSLASH, /* \ */
  CHAR_BACKTICK, /* ` */
  CHAR_COMMA: CHAR_COMMA$1, /* , */
  CHAR_DOT: CHAR_DOT$1, /* . */
  CHAR_LEFT_PARENTHESES: CHAR_LEFT_PARENTHESES$1, /* ( */
  CHAR_RIGHT_PARENTHESES: CHAR_RIGHT_PARENTHESES$1, /* ) */
  CHAR_LEFT_CURLY_BRACE: CHAR_LEFT_CURLY_BRACE$1, /* { */
  CHAR_RIGHT_CURLY_BRACE: CHAR_RIGHT_CURLY_BRACE$1, /* } */
  CHAR_LEFT_SQUARE_BRACKET: CHAR_LEFT_SQUARE_BRACKET$1, /* [ */
  CHAR_RIGHT_SQUARE_BRACKET: CHAR_RIGHT_SQUARE_BRACKET$1, /* ] */
  CHAR_DOUBLE_QUOTE, /* " */
  CHAR_SINGLE_QUOTE, /* ' */
  CHAR_NO_BREAK_SPACE,
  CHAR_ZERO_WIDTH_NOBREAK_SPACE
} = constants$4;

/**
 * parse
 */

const parse$3 = (input, options = {}) => {
  if (typeof input !== 'string') {
    throw new TypeError('Expected a string');
  }

  let opts = options || {};
  let max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH$1, opts.maxLength) : MAX_LENGTH$1;
  if (input.length > max) {
    throw new SyntaxError(`Input length (${input.length}), exceeds max characters (${max})`);
  }

  let ast = { type: 'root', input, nodes: [] };
  let stack = [ast];
  let block = ast;
  let prev = ast;
  let brackets = 0;
  let length = input.length;
  let index = 0;
  let depth = 0;
  let value;

  /**
   * Helpers
   */

  const advance = () => input[index++];
  const push = node => {
    if (node.type === 'text' && prev.type === 'dot') {
      prev.type = 'text';
    }

    if (prev && prev.type === 'text' && node.type === 'text') {
      prev.value += node.value;
      return;
    }

    block.nodes.push(node);
    node.parent = block;
    node.prev = prev;
    prev = node;
    return node;
  };

  push({ type: 'bos' });

  while (index < length) {
    block = stack[stack.length - 1];
    value = advance();

    /**
     * Invalid chars
     */

    if (value === CHAR_ZERO_WIDTH_NOBREAK_SPACE || value === CHAR_NO_BREAK_SPACE) {
      continue;
    }

    /**
     * Escaped chars
     */

    if (value === CHAR_BACKSLASH) {
      push({ type: 'text', value: (options.keepEscaping ? value : '') + advance() });
      continue;
    }

    /**
     * Right square bracket (literal): ']'
     */

    if (value === CHAR_RIGHT_SQUARE_BRACKET$1) {
      push({ type: 'text', value: '\\' + value });
      continue;
    }

    /**
     * Left square bracket: '['
     */

    if (value === CHAR_LEFT_SQUARE_BRACKET$1) {
      brackets++;
      let next;

      while (index < length && (next = advance())) {
        value += next;

        if (next === CHAR_LEFT_SQUARE_BRACKET$1) {
          brackets++;
          continue;
        }

        if (next === CHAR_BACKSLASH) {
          value += advance();
          continue;
        }

        if (next === CHAR_RIGHT_SQUARE_BRACKET$1) {
          brackets--;

          if (brackets === 0) {
            break;
          }
        }
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Parentheses
     */

    if (value === CHAR_LEFT_PARENTHESES$1) {
      block = push({ type: 'paren', nodes: [] });
      stack.push(block);
      push({ type: 'text', value });
      continue;
    }

    if (value === CHAR_RIGHT_PARENTHESES$1) {
      if (block.type !== 'paren') {
        push({ type: 'text', value });
        continue;
      }
      block = stack.pop();
      push({ type: 'text', value });
      block = stack[stack.length - 1];
      continue;
    }

    /**
     * Quotes: '|"|`
     */

    if (value === CHAR_DOUBLE_QUOTE || value === CHAR_SINGLE_QUOTE || value === CHAR_BACKTICK) {
      let open = value;
      let next;

      if (options.keepQuotes !== true) {
        value = '';
      }

      while (index < length && (next = advance())) {
        if (next === CHAR_BACKSLASH) {
          value += next + advance();
          continue;
        }

        if (next === open) {
          if (options.keepQuotes === true) value += next;
          break;
        }

        value += next;
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Left curly brace: '{'
     */

    if (value === CHAR_LEFT_CURLY_BRACE$1) {
      depth++;

      let dollar = prev.value && prev.value.slice(-1) === '$' || block.dollar === true;
      let brace = {
        type: 'brace',
        open: true,
        close: false,
        dollar,
        depth,
        commas: 0,
        ranges: 0,
        nodes: []
      };

      block = push(brace);
      stack.push(block);
      push({ type: 'open', value });
      continue;
    }

    /**
     * Right curly brace: '}'
     */

    if (value === CHAR_RIGHT_CURLY_BRACE$1) {
      if (block.type !== 'brace') {
        push({ type: 'text', value });
        continue;
      }

      let type = 'close';
      block = stack.pop();
      block.close = true;

      push({ type, value });
      depth--;

      block = stack[stack.length - 1];
      continue;
    }

    /**
     * Comma: ','
     */

    if (value === CHAR_COMMA$1 && depth > 0) {
      if (block.ranges > 0) {
        block.ranges = 0;
        let open = block.nodes.shift();
        block.nodes = [open, { type: 'text', value: stringify$1(block) }];
      }

      push({ type: 'comma', value });
      block.commas++;
      continue;
    }

    /**
     * Dot: '.'
     */

    if (value === CHAR_DOT$1 && depth > 0 && block.commas === 0) {
      let siblings = block.nodes;

      if (depth === 0 || siblings.length === 0) {
        push({ type: 'text', value });
        continue;
      }

      if (prev.type === 'dot') {
        block.range = [];
        prev.value += value;
        prev.type = 'range';

        if (block.nodes.length !== 3 && block.nodes.length !== 5) {
          block.invalid = true;
          block.ranges = 0;
          prev.type = 'text';
          continue;
        }

        block.ranges++;
        block.args = [];
        continue;
      }

      if (prev.type === 'range') {
        siblings.pop();

        let before = siblings[siblings.length - 1];
        before.value += prev.value + value;
        prev = before;
        block.ranges--;
        continue;
      }

      push({ type: 'dot', value });
      continue;
    }

    /**
     * Text
     */

    push({ type: 'text', value });
  }

  // Mark imbalanced braces and brackets as invalid
  do {
    block = stack.pop();

    if (block.type !== 'root') {
      block.nodes.forEach(node => {
        if (!node.nodes) {
          if (node.type === 'open') node.isOpen = true;
          if (node.type === 'close') node.isClose = true;
          if (!node.nodes) node.type = 'text';
          node.invalid = true;
        }
      });

      // get the location of the block on parent.nodes (block's siblings)
      let parent = stack[stack.length - 1];
      let index = parent.nodes.indexOf(block);
      // replace the (invalid) block with it's nodes
      parent.nodes.splice(index, 1, ...block.nodes);
    }
  } while (stack.length > 0);

  push({ type: 'eos' });
  return ast;
};

var parse_1$1 = parse$3;

const stringify = stringify$4;
const compile = compile_1;
const expand = expand_1;
const parse$2 = parse_1$1;

/**
 * Expand the given pattern or create a regex-compatible string.
 *
 * ```js
 * const braces = require('braces');
 * console.log(braces('{a,b,c}', { compile: true })); //=> ['(a|b|c)']
 * console.log(braces('{a,b,c}')); //=> ['a', 'b', 'c']
 * ```
 * @param {String} `str`
 * @param {Object} `options`
 * @return {String}
 * @api public
 */

const braces$1 = (input, options = {}) => {
  let output = [];

  if (Array.isArray(input)) {
    for (let pattern of input) {
      let result = braces$1.create(pattern, options);
      if (Array.isArray(result)) {
        output.push(...result);
      } else {
        output.push(result);
      }
    }
  } else {
    output = [].concat(braces$1.create(input, options));
  }

  if (options && options.expand === true && options.nodupes === true) {
    output = [...new Set(output)];
  }
  return output;
};

/**
 * Parse the given `str` with the given `options`.
 *
 * ```js
 * // braces.parse(pattern, [, options]);
 * const ast = braces.parse('a/{b,c}/d');
 * console.log(ast);
 * ```
 * @param {String} pattern Brace pattern to parse
 * @param {Object} options
 * @return {Object} Returns an AST
 * @api public
 */

braces$1.parse = (input, options = {}) => parse$2(input, options);

/**
 * Creates a braces string from an AST, or an AST node.
 *
 * ```js
 * const braces = require('braces');
 * let ast = braces.parse('foo/{a,b}/bar');
 * console.log(stringify(ast.nodes[2])); //=> '{a,b}'
 * ```
 * @param {String} `input` Brace pattern or AST.
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */

braces$1.stringify = (input, options = {}) => {
  if (typeof input === 'string') {
    return stringify(braces$1.parse(input, options), options);
  }
  return stringify(input, options);
};

/**
 * Compiles a brace pattern into a regex-compatible, optimized string.
 * This method is called by the main [braces](#braces) function by default.
 *
 * ```js
 * const braces = require('braces');
 * console.log(braces.compile('a/{b,c}/d'));
 * //=> ['a/(b|c)/d']
 * ```
 * @param {String} `input` Brace pattern or AST.
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */

braces$1.compile = (input, options = {}) => {
  if (typeof input === 'string') {
    input = braces$1.parse(input, options);
  }
  return compile(input, options);
};

/**
 * Expands a brace pattern into an array. This method is called by the
 * main [braces](#braces) function when `options.expand` is true. Before
 * using this method it's recommended that you read the [performance notes](#performance))
 * and advantages of using [.compile](#compile) instead.
 *
 * ```js
 * const braces = require('braces');
 * console.log(braces.expand('a/{b,c}/d'));
 * //=> ['a/b/d', 'a/c/d'];
 * ```
 * @param {String} `pattern` Brace pattern
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */

braces$1.expand = (input, options = {}) => {
  if (typeof input === 'string') {
    input = braces$1.parse(input, options);
  }

  let result = expand(input, options);

  // filter out empty strings if specified
  if (options.noempty === true) {
    result = result.filter(Boolean);
  }

  // filter out duplicates if specified
  if (options.nodupes === true) {
    result = [...new Set(result)];
  }

  return result;
};

/**
 * Processes a brace pattern and returns either an expanded array
 * (if `options.expand` is true), a highly optimized regex-compatible string.
 * This method is called by the main [braces](#braces) function.
 *
 * ```js
 * const braces = require('braces');
 * console.log(braces.create('user-{200..300}/project-{a,b,c}-{1..10}'))
 * //=> 'user-(20[0-9]|2[1-9][0-9]|300)/project-(a|b|c)-([1-9]|10)'
 * ```
 * @param {String} `pattern` Brace pattern
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */

braces$1.create = (input, options = {}) => {
  if (input === '' || input.length < 3) {
    return [input];
  }

 return options.expand !== true
    ? braces$1.compile(input, options)
    : braces$1.expand(input, options);
};

/**
 * Expose "braces"
 */

var braces_1 = braces$1;

var utils$f = {};

const path$7 = f$1;
const WIN_SLASH = '\\\\/';
const WIN_NO_SLASH = `[^${WIN_SLASH}]`;

/**
 * Posix glob regex
 */

const DOT_LITERAL = '\\.';
const PLUS_LITERAL = '\\+';
const QMARK_LITERAL = '\\?';
const SLASH_LITERAL = '\\/';
const ONE_CHAR = '(?=.)';
const QMARK = '[^/]';
const END_ANCHOR = `(?:${SLASH_LITERAL}|$)`;
const START_ANCHOR = `(?:^|${SLASH_LITERAL})`;
const DOTS_SLASH = `${DOT_LITERAL}{1,2}${END_ANCHOR}`;
const NO_DOT = `(?!${DOT_LITERAL})`;
const NO_DOTS = `(?!${START_ANCHOR}${DOTS_SLASH})`;
const NO_DOT_SLASH = `(?!${DOT_LITERAL}{0,1}${END_ANCHOR})`;
const NO_DOTS_SLASH = `(?!${DOTS_SLASH})`;
const QMARK_NO_DOT = `[^.${SLASH_LITERAL}]`;
const STAR = `${QMARK}*?`;

const POSIX_CHARS = {
  DOT_LITERAL,
  PLUS_LITERAL,
  QMARK_LITERAL,
  SLASH_LITERAL,
  ONE_CHAR,
  QMARK,
  END_ANCHOR,
  DOTS_SLASH,
  NO_DOT,
  NO_DOTS,
  NO_DOT_SLASH,
  NO_DOTS_SLASH,
  QMARK_NO_DOT,
  STAR,
  START_ANCHOR
};

/**
 * Windows glob regex
 */

const WINDOWS_CHARS = {
  ...POSIX_CHARS,

  SLASH_LITERAL: `[${WIN_SLASH}]`,
  QMARK: WIN_NO_SLASH,
  STAR: `${WIN_NO_SLASH}*?`,
  DOTS_SLASH: `${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$)`,
  NO_DOT: `(?!${DOT_LITERAL})`,
  NO_DOTS: `(?!(?:^|[${WIN_SLASH}])${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
  NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}(?:[${WIN_SLASH}]|$))`,
  NO_DOTS_SLASH: `(?!${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
  QMARK_NO_DOT: `[^.${WIN_SLASH}]`,
  START_ANCHOR: `(?:^|[${WIN_SLASH}])`,
  END_ANCHOR: `(?:[${WIN_SLASH}]|$)`
};

/**
 * POSIX Bracket Regex
 */

const POSIX_REGEX_SOURCE$1 = {
  alnum: 'a-zA-Z0-9',
  alpha: 'a-zA-Z',
  ascii: '\\x00-\\x7F',
  blank: ' \\t',
  cntrl: '\\x00-\\x1F\\x7F',
  digit: '0-9',
  graph: '\\x21-\\x7E',
  lower: 'a-z',
  print: '\\x20-\\x7E ',
  punct: '\\-!"#$%&\'()\\*+,./:;<=>?@[\\]^_`{|}~',
  space: ' \\t\\r\\n\\v\\f',
  upper: 'A-Z',
  word: 'A-Za-z0-9_',
  xdigit: 'A-Fa-f0-9'
};

var constants$3 = {
  MAX_LENGTH: 1024 * 64,
  POSIX_REGEX_SOURCE: POSIX_REGEX_SOURCE$1,

  // regular expressions
  REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
  REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
  REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
  REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
  REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
  REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,

  // Replace globs with equivalent patterns to reduce parsing time.
  REPLACEMENTS: {
    '***': '*',
    '**/**': '**',
    '**/**/**': '**'
  },

  // Digits
  CHAR_0: 48, /* 0 */
  CHAR_9: 57, /* 9 */

  // Alphabet chars.
  CHAR_UPPERCASE_A: 65, /* A */
  CHAR_LOWERCASE_A: 97, /* a */
  CHAR_UPPERCASE_Z: 90, /* Z */
  CHAR_LOWERCASE_Z: 122, /* z */

  CHAR_LEFT_PARENTHESES: 40, /* ( */
  CHAR_RIGHT_PARENTHESES: 41, /* ) */

  CHAR_ASTERISK: 42, /* * */

  // Non-alphabetic chars.
  CHAR_AMPERSAND: 38, /* & */
  CHAR_AT: 64, /* @ */
  CHAR_BACKWARD_SLASH: 92, /* \ */
  CHAR_CARRIAGE_RETURN: 13, /* \r */
  CHAR_CIRCUMFLEX_ACCENT: 94, /* ^ */
  CHAR_COLON: 58, /* : */
  CHAR_COMMA: 44, /* , */
  CHAR_DOT: 46, /* . */
  CHAR_DOUBLE_QUOTE: 34, /* " */
  CHAR_EQUAL: 61, /* = */
  CHAR_EXCLAMATION_MARK: 33, /* ! */
  CHAR_FORM_FEED: 12, /* \f */
  CHAR_FORWARD_SLASH: 47, /* / */
  CHAR_GRAVE_ACCENT: 96, /* ` */
  CHAR_HASH: 35, /* # */
  CHAR_HYPHEN_MINUS: 45, /* - */
  CHAR_LEFT_ANGLE_BRACKET: 60, /* < */
  CHAR_LEFT_CURLY_BRACE: 123, /* { */
  CHAR_LEFT_SQUARE_BRACKET: 91, /* [ */
  CHAR_LINE_FEED: 10, /* \n */
  CHAR_NO_BREAK_SPACE: 160, /* \u00A0 */
  CHAR_PERCENT: 37, /* % */
  CHAR_PLUS: 43, /* + */
  CHAR_QUESTION_MARK: 63, /* ? */
  CHAR_RIGHT_ANGLE_BRACKET: 62, /* > */
  CHAR_RIGHT_CURLY_BRACE: 125, /* } */
  CHAR_RIGHT_SQUARE_BRACKET: 93, /* ] */
  CHAR_SEMICOLON: 59, /* ; */
  CHAR_SINGLE_QUOTE: 39, /* ' */
  CHAR_SPACE: 32, /*   */
  CHAR_TAB: 9, /* \t */
  CHAR_UNDERSCORE: 95, /* _ */
  CHAR_VERTICAL_LINE: 124, /* | */
  CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279, /* \uFEFF */

  SEP: path$7.sep,

  /**
   * Create EXTGLOB_CHARS
   */

  extglobChars(chars) {
    return {
      '!': { type: 'negate', open: '(?:(?!(?:', close: `))${chars.STAR})` },
      '?': { type: 'qmark', open: '(?:', close: ')?' },
      '+': { type: 'plus', open: '(?:', close: ')+' },
      '*': { type: 'star', open: '(?:', close: ')*' },
      '@': { type: 'at', open: '(?:', close: ')' }
    };
  },

  /**
   * Create GLOB_CHARS
   */

  globChars(win32) {
    return win32 === true ? WINDOWS_CHARS : POSIX_CHARS;
  }
};

(function (exports) {

	const path = f$1;
	const win32 = process.platform === 'win32';
	const {
	  REGEX_BACKSLASH,
	  REGEX_REMOVE_BACKSLASH,
	  REGEX_SPECIAL_CHARS,
	  REGEX_SPECIAL_CHARS_GLOBAL
	} = constants$3;

	exports.isObject = val => val !== null && typeof val === 'object' && !Array.isArray(val);
	exports.hasRegexChars = str => REGEX_SPECIAL_CHARS.test(str);
	exports.isRegexChar = str => str.length === 1 && exports.hasRegexChars(str);
	exports.escapeRegex = str => str.replace(REGEX_SPECIAL_CHARS_GLOBAL, '\\$1');
	exports.toPosixSlashes = str => str.replace(REGEX_BACKSLASH, '/');

	exports.removeBackslashes = str => {
	  return str.replace(REGEX_REMOVE_BACKSLASH, match => {
	    return match === '\\' ? '' : match;
	  });
	};

	exports.supportsLookbehinds = () => {
	  const segs = process.version.slice(1).split('.').map(Number);
	  if (segs.length === 3 && segs[0] >= 9 || (segs[0] === 8 && segs[1] >= 10)) {
	    return true;
	  }
	  return false;
	};

	exports.isWindows = options => {
	  if (options && typeof options.windows === 'boolean') {
	    return options.windows;
	  }
	  return win32 === true || path.sep === '\\';
	};

	exports.escapeLast = (input, char, lastIdx) => {
	  const idx = input.lastIndexOf(char, lastIdx);
	  if (idx === -1) return input;
	  if (input[idx - 1] === '\\') return exports.escapeLast(input, char, idx - 1);
	  return `${input.slice(0, idx)}\\${input.slice(idx)}`;
	};

	exports.removePrefix = (input, state = {}) => {
	  let output = input;
	  if (output.startsWith('./')) {
	    output = output.slice(2);
	    state.prefix = './';
	  }
	  return output;
	};

	exports.wrapOutput = (input, state = {}, options = {}) => {
	  const prepend = options.contains ? '' : '^';
	  const append = options.contains ? '' : '$';

	  let output = `${prepend}(?:${input})${append}`;
	  if (state.negated === true) {
	    output = `(?:^(?!${output}).*$)`;
	  }
	  return output;
	}; 
} (utils$f));

const utils$e = utils$f;
const {
  CHAR_ASTERISK,             /* * */
  CHAR_AT,                   /* @ */
  CHAR_BACKWARD_SLASH,       /* \ */
  CHAR_COMMA,                /* , */
  CHAR_DOT,                  /* . */
  CHAR_EXCLAMATION_MARK,     /* ! */
  CHAR_FORWARD_SLASH,        /* / */
  CHAR_LEFT_CURLY_BRACE,     /* { */
  CHAR_LEFT_PARENTHESES,     /* ( */
  CHAR_LEFT_SQUARE_BRACKET,  /* [ */
  CHAR_PLUS,                 /* + */
  CHAR_QUESTION_MARK,        /* ? */
  CHAR_RIGHT_CURLY_BRACE,    /* } */
  CHAR_RIGHT_PARENTHESES,    /* ) */
  CHAR_RIGHT_SQUARE_BRACKET  /* ] */
} = constants$3;

const isPathSeparator = code => {
  return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
};

const depth = token => {
  if (token.isPrefix !== true) {
    token.depth = token.isGlobstar ? Infinity : 1;
  }
};

/**
 * Quickly scans a glob pattern and returns an object with a handful of
 * useful properties, like `isGlob`, `path` (the leading non-glob, if it exists),
 * `glob` (the actual pattern), `negated` (true if the path starts with `!` but not
 * with `!(`) and `negatedExtglob` (true if the path starts with `!(`).
 *
 * ```js
 * const pm = require('picomatch');
 * console.log(pm.scan('foo/bar/*.js'));
 * { isGlob: true, input: 'foo/bar/*.js', base: 'foo/bar', glob: '*.js' }
 * ```
 * @param {String} `str`
 * @param {Object} `options`
 * @return {Object} Returns an object with tokens and regex source string.
 * @api public
 */

const scan$1 = (input, options) => {
  const opts = options || {};

  const length = input.length - 1;
  const scanToEnd = opts.parts === true || opts.scanToEnd === true;
  const slashes = [];
  const tokens = [];
  const parts = [];

  let str = input;
  let index = -1;
  let start = 0;
  let lastIndex = 0;
  let isBrace = false;
  let isBracket = false;
  let isGlob = false;
  let isExtglob = false;
  let isGlobstar = false;
  let braceEscaped = false;
  let backslashes = false;
  let negated = false;
  let negatedExtglob = false;
  let finished = false;
  let braces = 0;
  let prev;
  let code;
  let token = { value: '', depth: 0, isGlob: false };

  const eos = () => index >= length;
  const peek = () => str.charCodeAt(index + 1);
  const advance = () => {
    prev = code;
    return str.charCodeAt(++index);
  };

  while (index < length) {
    code = advance();
    let next;

    if (code === CHAR_BACKWARD_SLASH) {
      backslashes = token.backslashes = true;
      code = advance();

      if (code === CHAR_LEFT_CURLY_BRACE) {
        braceEscaped = true;
      }
      continue;
    }

    if (braceEscaped === true || code === CHAR_LEFT_CURLY_BRACE) {
      braces++;

      while (eos() !== true && (code = advance())) {
        if (code === CHAR_BACKWARD_SLASH) {
          backslashes = token.backslashes = true;
          advance();
          continue;
        }

        if (code === CHAR_LEFT_CURLY_BRACE) {
          braces++;
          continue;
        }

        if (braceEscaped !== true && code === CHAR_DOT && (code = advance()) === CHAR_DOT) {
          isBrace = token.isBrace = true;
          isGlob = token.isGlob = true;
          finished = true;

          if (scanToEnd === true) {
            continue;
          }

          break;
        }

        if (braceEscaped !== true && code === CHAR_COMMA) {
          isBrace = token.isBrace = true;
          isGlob = token.isGlob = true;
          finished = true;

          if (scanToEnd === true) {
            continue;
          }

          break;
        }

        if (code === CHAR_RIGHT_CURLY_BRACE) {
          braces--;

          if (braces === 0) {
            braceEscaped = false;
            isBrace = token.isBrace = true;
            finished = true;
            break;
          }
        }
      }

      if (scanToEnd === true) {
        continue;
      }

      break;
    }

    if (code === CHAR_FORWARD_SLASH) {
      slashes.push(index);
      tokens.push(token);
      token = { value: '', depth: 0, isGlob: false };

      if (finished === true) continue;
      if (prev === CHAR_DOT && index === (start + 1)) {
        start += 2;
        continue;
      }

      lastIndex = index + 1;
      continue;
    }

    if (opts.noext !== true) {
      const isExtglobChar = code === CHAR_PLUS
        || code === CHAR_AT
        || code === CHAR_ASTERISK
        || code === CHAR_QUESTION_MARK
        || code === CHAR_EXCLAMATION_MARK;

      if (isExtglobChar === true && peek() === CHAR_LEFT_PARENTHESES) {
        isGlob = token.isGlob = true;
        isExtglob = token.isExtglob = true;
        finished = true;
        if (code === CHAR_EXCLAMATION_MARK && index === start) {
          negatedExtglob = true;
        }

        if (scanToEnd === true) {
          while (eos() !== true && (code = advance())) {
            if (code === CHAR_BACKWARD_SLASH) {
              backslashes = token.backslashes = true;
              code = advance();
              continue;
            }

            if (code === CHAR_RIGHT_PARENTHESES) {
              isGlob = token.isGlob = true;
              finished = true;
              break;
            }
          }
          continue;
        }
        break;
      }
    }

    if (code === CHAR_ASTERISK) {
      if (prev === CHAR_ASTERISK) isGlobstar = token.isGlobstar = true;
      isGlob = token.isGlob = true;
      finished = true;

      if (scanToEnd === true) {
        continue;
      }
      break;
    }

    if (code === CHAR_QUESTION_MARK) {
      isGlob = token.isGlob = true;
      finished = true;

      if (scanToEnd === true) {
        continue;
      }
      break;
    }

    if (code === CHAR_LEFT_SQUARE_BRACKET) {
      while (eos() !== true && (next = advance())) {
        if (next === CHAR_BACKWARD_SLASH) {
          backslashes = token.backslashes = true;
          advance();
          continue;
        }

        if (next === CHAR_RIGHT_SQUARE_BRACKET) {
          isBracket = token.isBracket = true;
          isGlob = token.isGlob = true;
          finished = true;
          break;
        }
      }

      if (scanToEnd === true) {
        continue;
      }

      break;
    }

    if (opts.nonegate !== true && code === CHAR_EXCLAMATION_MARK && index === start) {
      negated = token.negated = true;
      start++;
      continue;
    }

    if (opts.noparen !== true && code === CHAR_LEFT_PARENTHESES) {
      isGlob = token.isGlob = true;

      if (scanToEnd === true) {
        while (eos() !== true && (code = advance())) {
          if (code === CHAR_LEFT_PARENTHESES) {
            backslashes = token.backslashes = true;
            code = advance();
            continue;
          }

          if (code === CHAR_RIGHT_PARENTHESES) {
            finished = true;
            break;
          }
        }
        continue;
      }
      break;
    }

    if (isGlob === true) {
      finished = true;

      if (scanToEnd === true) {
        continue;
      }

      break;
    }
  }

  if (opts.noext === true) {
    isExtglob = false;
    isGlob = false;
  }

  let base = str;
  let prefix = '';
  let glob = '';

  if (start > 0) {
    prefix = str.slice(0, start);
    str = str.slice(start);
    lastIndex -= start;
  }

  if (base && isGlob === true && lastIndex > 0) {
    base = str.slice(0, lastIndex);
    glob = str.slice(lastIndex);
  } else if (isGlob === true) {
    base = '';
    glob = str;
  } else {
    base = str;
  }

  if (base && base !== '' && base !== '/' && base !== str) {
    if (isPathSeparator(base.charCodeAt(base.length - 1))) {
      base = base.slice(0, -1);
    }
  }

  if (opts.unescape === true) {
    if (glob) glob = utils$e.removeBackslashes(glob);

    if (base && backslashes === true) {
      base = utils$e.removeBackslashes(base);
    }
  }

  const state = {
    prefix,
    input,
    start,
    base,
    glob,
    isBrace,
    isBracket,
    isGlob,
    isExtglob,
    isGlobstar,
    negated,
    negatedExtglob
  };

  if (opts.tokens === true) {
    state.maxDepth = 0;
    if (!isPathSeparator(code)) {
      tokens.push(token);
    }
    state.tokens = tokens;
  }

  if (opts.parts === true || opts.tokens === true) {
    let prevIndex;

    for (let idx = 0; idx < slashes.length; idx++) {
      const n = prevIndex ? prevIndex + 1 : start;
      const i = slashes[idx];
      const value = input.slice(n, i);
      if (opts.tokens) {
        if (idx === 0 && start !== 0) {
          tokens[idx].isPrefix = true;
          tokens[idx].value = prefix;
        } else {
          tokens[idx].value = value;
        }
        depth(tokens[idx]);
        state.maxDepth += tokens[idx].depth;
      }
      if (idx !== 0 || value !== '') {
        parts.push(value);
      }
      prevIndex = i;
    }

    if (prevIndex && prevIndex + 1 < input.length) {
      const value = input.slice(prevIndex + 1);
      parts.push(value);

      if (opts.tokens) {
        tokens[tokens.length - 1].value = value;
        depth(tokens[tokens.length - 1]);
        state.maxDepth += tokens[tokens.length - 1].depth;
      }
    }

    state.slashes = slashes;
    state.parts = parts;
  }

  return state;
};

var scan_1 = scan$1;

const constants$2 = constants$3;
const utils$d = utils$f;

/**
 * Constants
 */

const {
  MAX_LENGTH,
  POSIX_REGEX_SOURCE,
  REGEX_NON_SPECIAL_CHARS,
  REGEX_SPECIAL_CHARS_BACKREF,
  REPLACEMENTS
} = constants$2;

/**
 * Helpers
 */

const expandRange = (args, options) => {
  if (typeof options.expandRange === 'function') {
    return options.expandRange(...args, options);
  }

  args.sort();
  const value = `[${args.join('-')}]`;

  try {
    /* eslint-disable-next-line no-new */
    new RegExp(value);
  } catch (ex) {
    return args.map(v => utils$d.escapeRegex(v)).join('..');
  }

  return value;
};

/**
 * Create the message for a syntax error
 */

const syntaxError = (type, char) => {
  return `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
};

/**
 * Parse the given input string.
 * @param {String} input
 * @param {Object} options
 * @return {Object}
 */

const parse$1 = (input, options) => {
  if (typeof input !== 'string') {
    throw new TypeError('Expected a string');
  }

  input = REPLACEMENTS[input] || input;

  const opts = { ...options };
  const max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;

  let len = input.length;
  if (len > max) {
    throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
  }

  const bos = { type: 'bos', value: '', output: opts.prepend || '' };
  const tokens = [bos];

  const capture = opts.capture ? '' : '?:';
  const win32 = utils$d.isWindows(options);

  // create constants based on platform, for windows or posix
  const PLATFORM_CHARS = constants$2.globChars(win32);
  const EXTGLOB_CHARS = constants$2.extglobChars(PLATFORM_CHARS);

  const {
    DOT_LITERAL,
    PLUS_LITERAL,
    SLASH_LITERAL,
    ONE_CHAR,
    DOTS_SLASH,
    NO_DOT,
    NO_DOT_SLASH,
    NO_DOTS_SLASH,
    QMARK,
    QMARK_NO_DOT,
    STAR,
    START_ANCHOR
  } = PLATFORM_CHARS;

  const globstar = opts => {
    return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
  };

  const nodot = opts.dot ? '' : NO_DOT;
  const qmarkNoDot = opts.dot ? QMARK : QMARK_NO_DOT;
  let star = opts.bash === true ? globstar(opts) : STAR;

  if (opts.capture) {
    star = `(${star})`;
  }

  // minimatch options support
  if (typeof opts.noext === 'boolean') {
    opts.noextglob = opts.noext;
  }

  const state = {
    input,
    index: -1,
    start: 0,
    dot: opts.dot === true,
    consumed: '',
    output: '',
    prefix: '',
    backtrack: false,
    negated: false,
    brackets: 0,
    braces: 0,
    parens: 0,
    quotes: 0,
    globstar: false,
    tokens
  };

  input = utils$d.removePrefix(input, state);
  len = input.length;

  const extglobs = [];
  const braces = [];
  const stack = [];
  let prev = bos;
  let value;

  /**
   * Tokenizing helpers
   */

  const eos = () => state.index === len - 1;
  const peek = state.peek = (n = 1) => input[state.index + n];
  const advance = state.advance = () => input[++state.index] || '';
  const remaining = () => input.slice(state.index + 1);
  const consume = (value = '', num = 0) => {
    state.consumed += value;
    state.index += num;
  };

  const append = token => {
    state.output += token.output != null ? token.output : token.value;
    consume(token.value);
  };

  const negate = () => {
    let count = 1;

    while (peek() === '!' && (peek(2) !== '(' || peek(3) === '?')) {
      advance();
      state.start++;
      count++;
    }

    if (count % 2 === 0) {
      return false;
    }

    state.negated = true;
    state.start++;
    return true;
  };

  const increment = type => {
    state[type]++;
    stack.push(type);
  };

  const decrement = type => {
    state[type]--;
    stack.pop();
  };

  /**
   * Push tokens onto the tokens array. This helper speeds up
   * tokenizing by 1) helping us avoid backtracking as much as possible,
   * and 2) helping us avoid creating extra tokens when consecutive
   * characters are plain text. This improves performance and simplifies
   * lookbehinds.
   */

  const push = tok => {
    if (prev.type === 'globstar') {
      const isBrace = state.braces > 0 && (tok.type === 'comma' || tok.type === 'brace');
      const isExtglob = tok.extglob === true || (extglobs.length && (tok.type === 'pipe' || tok.type === 'paren'));

      if (tok.type !== 'slash' && tok.type !== 'paren' && !isBrace && !isExtglob) {
        state.output = state.output.slice(0, -prev.output.length);
        prev.type = 'star';
        prev.value = '*';
        prev.output = star;
        state.output += prev.output;
      }
    }

    if (extglobs.length && tok.type !== 'paren') {
      extglobs[extglobs.length - 1].inner += tok.value;
    }

    if (tok.value || tok.output) append(tok);
    if (prev && prev.type === 'text' && tok.type === 'text') {
      prev.value += tok.value;
      prev.output = (prev.output || '') + tok.value;
      return;
    }

    tok.prev = prev;
    tokens.push(tok);
    prev = tok;
  };

  const extglobOpen = (type, value) => {
    const token = { ...EXTGLOB_CHARS[value], conditions: 1, inner: '' };

    token.prev = prev;
    token.parens = state.parens;
    token.output = state.output;
    const output = (opts.capture ? '(' : '') + token.open;

    increment('parens');
    push({ type, value, output: state.output ? '' : ONE_CHAR });
    push({ type: 'paren', extglob: true, value: advance(), output });
    extglobs.push(token);
  };

  const extglobClose = token => {
    let output = token.close + (opts.capture ? ')' : '');
    let rest;

    if (token.type === 'negate') {
      let extglobStar = star;

      if (token.inner && token.inner.length > 1 && token.inner.includes('/')) {
        extglobStar = globstar(opts);
      }

      if (extglobStar !== star || eos() || /^\)+$/.test(remaining())) {
        output = token.close = `)$))${extglobStar}`;
      }

      if (token.inner.includes('*') && (rest = remaining()) && /^\.[^\\/.]+$/.test(rest)) {
        // Any non-magical string (`.ts`) or even nested expression (`.{ts,tsx}`) can follow after the closing parenthesis.
        // In this case, we need to parse the string and use it in the output of the original pattern.
        // Suitable patterns: `/!(*.d).ts`, `/!(*.d).{ts,tsx}`, `**/!(*-dbg).@(js)`.
        //
        // Disabling the `fastpaths` option due to a problem with parsing strings as `.ts` in the pattern like `**/!(*.d).ts`.
        const expression = parse$1(rest, { ...options, fastpaths: false }).output;

        output = token.close = `)${expression})${extglobStar})`;
      }

      if (token.prev.type === 'bos') {
        state.negatedExtglob = true;
      }
    }

    push({ type: 'paren', extglob: true, value, output });
    decrement('parens');
  };

  /**
   * Fast paths
   */

  if (opts.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(input)) {
    let backslashes = false;

    let output = input.replace(REGEX_SPECIAL_CHARS_BACKREF, (m, esc, chars, first, rest, index) => {
      if (first === '\\') {
        backslashes = true;
        return m;
      }

      if (first === '?') {
        if (esc) {
          return esc + first + (rest ? QMARK.repeat(rest.length) : '');
        }
        if (index === 0) {
          return qmarkNoDot + (rest ? QMARK.repeat(rest.length) : '');
        }
        return QMARK.repeat(chars.length);
      }

      if (first === '.') {
        return DOT_LITERAL.repeat(chars.length);
      }

      if (first === '*') {
        if (esc) {
          return esc + first + (rest ? star : '');
        }
        return star;
      }
      return esc ? m : `\\${m}`;
    });

    if (backslashes === true) {
      if (opts.unescape === true) {
        output = output.replace(/\\/g, '');
      } else {
        output = output.replace(/\\+/g, m => {
          return m.length % 2 === 0 ? '\\\\' : (m ? '\\' : '');
        });
      }
    }

    if (output === input && opts.contains === true) {
      state.output = input;
      return state;
    }

    state.output = utils$d.wrapOutput(output, state, options);
    return state;
  }

  /**
   * Tokenize input until we reach end-of-string
   */

  while (!eos()) {
    value = advance();

    if (value === '\u0000') {
      continue;
    }

    /**
     * Escaped characters
     */

    if (value === '\\') {
      const next = peek();

      if (next === '/' && opts.bash !== true) {
        continue;
      }

      if (next === '.' || next === ';') {
        continue;
      }

      if (!next) {
        value += '\\';
        push({ type: 'text', value });
        continue;
      }

      // collapse slashes to reduce potential for exploits
      const match = /^\\+/.exec(remaining());
      let slashes = 0;

      if (match && match[0].length > 2) {
        slashes = match[0].length;
        state.index += slashes;
        if (slashes % 2 !== 0) {
          value += '\\';
        }
      }

      if (opts.unescape === true) {
        value = advance();
      } else {
        value += advance();
      }

      if (state.brackets === 0) {
        push({ type: 'text', value });
        continue;
      }
    }

    /**
     * If we're inside a regex character class, continue
     * until we reach the closing bracket.
     */

    if (state.brackets > 0 && (value !== ']' || prev.value === '[' || prev.value === '[^')) {
      if (opts.posix !== false && value === ':') {
        const inner = prev.value.slice(1);
        if (inner.includes('[')) {
          prev.posix = true;

          if (inner.includes(':')) {
            const idx = prev.value.lastIndexOf('[');
            const pre = prev.value.slice(0, idx);
            const rest = prev.value.slice(idx + 2);
            const posix = POSIX_REGEX_SOURCE[rest];
            if (posix) {
              prev.value = pre + posix;
              state.backtrack = true;
              advance();

              if (!bos.output && tokens.indexOf(prev) === 1) {
                bos.output = ONE_CHAR;
              }
              continue;
            }
          }
        }
      }

      if ((value === '[' && peek() !== ':') || (value === '-' && peek() === ']')) {
        value = `\\${value}`;
      }

      if (value === ']' && (prev.value === '[' || prev.value === '[^')) {
        value = `\\${value}`;
      }

      if (opts.posix === true && value === '!' && prev.value === '[') {
        value = '^';
      }

      prev.value += value;
      append({ value });
      continue;
    }

    /**
     * If we're inside a quoted string, continue
     * until we reach the closing double quote.
     */

    if (state.quotes === 1 && value !== '"') {
      value = utils$d.escapeRegex(value);
      prev.value += value;
      append({ value });
      continue;
    }

    /**
     * Double quotes
     */

    if (value === '"') {
      state.quotes = state.quotes === 1 ? 0 : 1;
      if (opts.keepQuotes === true) {
        push({ type: 'text', value });
      }
      continue;
    }

    /**
     * Parentheses
     */

    if (value === '(') {
      increment('parens');
      push({ type: 'paren', value });
      continue;
    }

    if (value === ')') {
      if (state.parens === 0 && opts.strictBrackets === true) {
        throw new SyntaxError(syntaxError('opening', '('));
      }

      const extglob = extglobs[extglobs.length - 1];
      if (extglob && state.parens === extglob.parens + 1) {
        extglobClose(extglobs.pop());
        continue;
      }

      push({ type: 'paren', value, output: state.parens ? ')' : '\\)' });
      decrement('parens');
      continue;
    }

    /**
     * Square brackets
     */

    if (value === '[') {
      if (opts.nobracket === true || !remaining().includes(']')) {
        if (opts.nobracket !== true && opts.strictBrackets === true) {
          throw new SyntaxError(syntaxError('closing', ']'));
        }

        value = `\\${value}`;
      } else {
        increment('brackets');
      }

      push({ type: 'bracket', value });
      continue;
    }

    if (value === ']') {
      if (opts.nobracket === true || (prev && prev.type === 'bracket' && prev.value.length === 1)) {
        push({ type: 'text', value, output: `\\${value}` });
        continue;
      }

      if (state.brackets === 0) {
        if (opts.strictBrackets === true) {
          throw new SyntaxError(syntaxError('opening', '['));
        }

        push({ type: 'text', value, output: `\\${value}` });
        continue;
      }

      decrement('brackets');

      const prevValue = prev.value.slice(1);
      if (prev.posix !== true && prevValue[0] === '^' && !prevValue.includes('/')) {
        value = `/${value}`;
      }

      prev.value += value;
      append({ value });

      // when literal brackets are explicitly disabled
      // assume we should match with a regex character class
      if (opts.literalBrackets === false || utils$d.hasRegexChars(prevValue)) {
        continue;
      }

      const escaped = utils$d.escapeRegex(prev.value);
      state.output = state.output.slice(0, -prev.value.length);

      // when literal brackets are explicitly enabled
      // assume we should escape the brackets to match literal characters
      if (opts.literalBrackets === true) {
        state.output += escaped;
        prev.value = escaped;
        continue;
      }

      // when the user specifies nothing, try to match both
      prev.value = `(${capture}${escaped}|${prev.value})`;
      state.output += prev.value;
      continue;
    }

    /**
     * Braces
     */

    if (value === '{' && opts.nobrace !== true) {
      increment('braces');

      const open = {
        type: 'brace',
        value,
        output: '(',
        outputIndex: state.output.length,
        tokensIndex: state.tokens.length
      };

      braces.push(open);
      push(open);
      continue;
    }

    if (value === '}') {
      const brace = braces[braces.length - 1];

      if (opts.nobrace === true || !brace) {
        push({ type: 'text', value, output: value });
        continue;
      }

      let output = ')';

      if (brace.dots === true) {
        const arr = tokens.slice();
        const range = [];

        for (let i = arr.length - 1; i >= 0; i--) {
          tokens.pop();
          if (arr[i].type === 'brace') {
            break;
          }
          if (arr[i].type !== 'dots') {
            range.unshift(arr[i].value);
          }
        }

        output = expandRange(range, opts);
        state.backtrack = true;
      }

      if (brace.comma !== true && brace.dots !== true) {
        const out = state.output.slice(0, brace.outputIndex);
        const toks = state.tokens.slice(brace.tokensIndex);
        brace.value = brace.output = '\\{';
        value = output = '\\}';
        state.output = out;
        for (const t of toks) {
          state.output += (t.output || t.value);
        }
      }

      push({ type: 'brace', value, output });
      decrement('braces');
      braces.pop();
      continue;
    }

    /**
     * Pipes
     */

    if (value === '|') {
      if (extglobs.length > 0) {
        extglobs[extglobs.length - 1].conditions++;
      }
      push({ type: 'text', value });
      continue;
    }

    /**
     * Commas
     */

    if (value === ',') {
      let output = value;

      const brace = braces[braces.length - 1];
      if (brace && stack[stack.length - 1] === 'braces') {
        brace.comma = true;
        output = '|';
      }

      push({ type: 'comma', value, output });
      continue;
    }

    /**
     * Slashes
     */

    if (value === '/') {
      // if the beginning of the glob is "./", advance the start
      // to the current index, and don't add the "./" characters
      // to the state. This greatly simplifies lookbehinds when
      // checking for BOS characters like "!" and "." (not "./")
      if (prev.type === 'dot' && state.index === state.start + 1) {
        state.start = state.index + 1;
        state.consumed = '';
        state.output = '';
        tokens.pop();
        prev = bos; // reset "prev" to the first token
        continue;
      }

      push({ type: 'slash', value, output: SLASH_LITERAL });
      continue;
    }

    /**
     * Dots
     */

    if (value === '.') {
      if (state.braces > 0 && prev.type === 'dot') {
        if (prev.value === '.') prev.output = DOT_LITERAL;
        const brace = braces[braces.length - 1];
        prev.type = 'dots';
        prev.output += value;
        prev.value += value;
        brace.dots = true;
        continue;
      }

      if ((state.braces + state.parens) === 0 && prev.type !== 'bos' && prev.type !== 'slash') {
        push({ type: 'text', value, output: DOT_LITERAL });
        continue;
      }

      push({ type: 'dot', value, output: DOT_LITERAL });
      continue;
    }

    /**
     * Question marks
     */

    if (value === '?') {
      const isGroup = prev && prev.value === '(';
      if (!isGroup && opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
        extglobOpen('qmark', value);
        continue;
      }

      if (prev && prev.type === 'paren') {
        const next = peek();
        let output = value;

        if (next === '<' && !utils$d.supportsLookbehinds()) {
          throw new Error('Node.js v10 or higher is required for regex lookbehinds');
        }

        if ((prev.value === '(' && !/[!=<:]/.test(next)) || (next === '<' && !/<([!=]|\w+>)/.test(remaining()))) {
          output = `\\${value}`;
        }

        push({ type: 'text', value, output });
        continue;
      }

      if (opts.dot !== true && (prev.type === 'slash' || prev.type === 'bos')) {
        push({ type: 'qmark', value, output: QMARK_NO_DOT });
        continue;
      }

      push({ type: 'qmark', value, output: QMARK });
      continue;
    }

    /**
     * Exclamation
     */

    if (value === '!') {
      if (opts.noextglob !== true && peek() === '(') {
        if (peek(2) !== '?' || !/[!=<:]/.test(peek(3))) {
          extglobOpen('negate', value);
          continue;
        }
      }

      if (opts.nonegate !== true && state.index === 0) {
        negate();
        continue;
      }
    }

    /**
     * Plus
     */

    if (value === '+') {
      if (opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
        extglobOpen('plus', value);
        continue;
      }

      if ((prev && prev.value === '(') || opts.regex === false) {
        push({ type: 'plus', value, output: PLUS_LITERAL });
        continue;
      }

      if ((prev && (prev.type === 'bracket' || prev.type === 'paren' || prev.type === 'brace')) || state.parens > 0) {
        push({ type: 'plus', value });
        continue;
      }

      push({ type: 'plus', value: PLUS_LITERAL });
      continue;
    }

    /**
     * Plain text
     */

    if (value === '@') {
      if (opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
        push({ type: 'at', extglob: true, value, output: '' });
        continue;
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Plain text
     */

    if (value !== '*') {
      if (value === '$' || value === '^') {
        value = `\\${value}`;
      }

      const match = REGEX_NON_SPECIAL_CHARS.exec(remaining());
      if (match) {
        value += match[0];
        state.index += match[0].length;
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Stars
     */

    if (prev && (prev.type === 'globstar' || prev.star === true)) {
      prev.type = 'star';
      prev.star = true;
      prev.value += value;
      prev.output = star;
      state.backtrack = true;
      state.globstar = true;
      consume(value);
      continue;
    }

    let rest = remaining();
    if (opts.noextglob !== true && /^\([^?]/.test(rest)) {
      extglobOpen('star', value);
      continue;
    }

    if (prev.type === 'star') {
      if (opts.noglobstar === true) {
        consume(value);
        continue;
      }

      const prior = prev.prev;
      const before = prior.prev;
      const isStart = prior.type === 'slash' || prior.type === 'bos';
      const afterStar = before && (before.type === 'star' || before.type === 'globstar');

      if (opts.bash === true && (!isStart || (rest[0] && rest[0] !== '/'))) {
        push({ type: 'star', value, output: '' });
        continue;
      }

      const isBrace = state.braces > 0 && (prior.type === 'comma' || prior.type === 'brace');
      const isExtglob = extglobs.length && (prior.type === 'pipe' || prior.type === 'paren');
      if (!isStart && prior.type !== 'paren' && !isBrace && !isExtglob) {
        push({ type: 'star', value, output: '' });
        continue;
      }

      // strip consecutive `/**/`
      while (rest.slice(0, 3) === '/**') {
        const after = input[state.index + 4];
        if (after && after !== '/') {
          break;
        }
        rest = rest.slice(3);
        consume('/**', 3);
      }

      if (prior.type === 'bos' && eos()) {
        prev.type = 'globstar';
        prev.value += value;
        prev.output = globstar(opts);
        state.output = prev.output;
        state.globstar = true;
        consume(value);
        continue;
      }

      if (prior.type === 'slash' && prior.prev.type !== 'bos' && !afterStar && eos()) {
        state.output = state.output.slice(0, -(prior.output + prev.output).length);
        prior.output = `(?:${prior.output}`;

        prev.type = 'globstar';
        prev.output = globstar(opts) + (opts.strictSlashes ? ')' : '|$)');
        prev.value += value;
        state.globstar = true;
        state.output += prior.output + prev.output;
        consume(value);
        continue;
      }

      if (prior.type === 'slash' && prior.prev.type !== 'bos' && rest[0] === '/') {
        const end = rest[1] !== void 0 ? '|$' : '';

        state.output = state.output.slice(0, -(prior.output + prev.output).length);
        prior.output = `(?:${prior.output}`;

        prev.type = 'globstar';
        prev.output = `${globstar(opts)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`;
        prev.value += value;

        state.output += prior.output + prev.output;
        state.globstar = true;

        consume(value + advance());

        push({ type: 'slash', value: '/', output: '' });
        continue;
      }

      if (prior.type === 'bos' && rest[0] === '/') {
        prev.type = 'globstar';
        prev.value += value;
        prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts)}${SLASH_LITERAL})`;
        state.output = prev.output;
        state.globstar = true;
        consume(value + advance());
        push({ type: 'slash', value: '/', output: '' });
        continue;
      }

      // remove single star from output
      state.output = state.output.slice(0, -prev.output.length);

      // reset previous token to globstar
      prev.type = 'globstar';
      prev.output = globstar(opts);
      prev.value += value;

      // reset output with globstar
      state.output += prev.output;
      state.globstar = true;
      consume(value);
      continue;
    }

    const token = { type: 'star', value, output: star };

    if (opts.bash === true) {
      token.output = '.*?';
      if (prev.type === 'bos' || prev.type === 'slash') {
        token.output = nodot + token.output;
      }
      push(token);
      continue;
    }

    if (prev && (prev.type === 'bracket' || prev.type === 'paren') && opts.regex === true) {
      token.output = value;
      push(token);
      continue;
    }

    if (state.index === state.start || prev.type === 'slash' || prev.type === 'dot') {
      if (prev.type === 'dot') {
        state.output += NO_DOT_SLASH;
        prev.output += NO_DOT_SLASH;

      } else if (opts.dot === true) {
        state.output += NO_DOTS_SLASH;
        prev.output += NO_DOTS_SLASH;

      } else {
        state.output += nodot;
        prev.output += nodot;
      }

      if (peek() !== '*') {
        state.output += ONE_CHAR;
        prev.output += ONE_CHAR;
      }
    }

    push(token);
  }

  while (state.brackets > 0) {
    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', ']'));
    state.output = utils$d.escapeLast(state.output, '[');
    decrement('brackets');
  }

  while (state.parens > 0) {
    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', ')'));
    state.output = utils$d.escapeLast(state.output, '(');
    decrement('parens');
  }

  while (state.braces > 0) {
    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', '}'));
    state.output = utils$d.escapeLast(state.output, '{');
    decrement('braces');
  }

  if (opts.strictSlashes !== true && (prev.type === 'star' || prev.type === 'bracket')) {
    push({ type: 'maybe_slash', value: '', output: `${SLASH_LITERAL}?` });
  }

  // rebuild the output if we had to backtrack at any point
  if (state.backtrack === true) {
    state.output = '';

    for (const token of state.tokens) {
      state.output += token.output != null ? token.output : token.value;

      if (token.suffix) {
        state.output += token.suffix;
      }
    }
  }

  return state;
};

/**
 * Fast paths for creating regular expressions for common glob patterns.
 * This can significantly speed up processing and has very little downside
 * impact when none of the fast paths match.
 */

parse$1.fastpaths = (input, options) => {
  const opts = { ...options };
  const max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
  const len = input.length;
  if (len > max) {
    throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
  }

  input = REPLACEMENTS[input] || input;
  const win32 = utils$d.isWindows(options);

  // create constants based on platform, for windows or posix
  const {
    DOT_LITERAL,
    SLASH_LITERAL,
    ONE_CHAR,
    DOTS_SLASH,
    NO_DOT,
    NO_DOTS,
    NO_DOTS_SLASH,
    STAR,
    START_ANCHOR
  } = constants$2.globChars(win32);

  const nodot = opts.dot ? NO_DOTS : NO_DOT;
  const slashDot = opts.dot ? NO_DOTS_SLASH : NO_DOT;
  const capture = opts.capture ? '' : '?:';
  const state = { negated: false, prefix: '' };
  let star = opts.bash === true ? '.*?' : STAR;

  if (opts.capture) {
    star = `(${star})`;
  }

  const globstar = opts => {
    if (opts.noglobstar === true) return star;
    return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
  };

  const create = str => {
    switch (str) {
      case '*':
        return `${nodot}${ONE_CHAR}${star}`;

      case '.*':
        return `${DOT_LITERAL}${ONE_CHAR}${star}`;

      case '*.*':
        return `${nodot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;

      case '*/*':
        return `${nodot}${star}${SLASH_LITERAL}${ONE_CHAR}${slashDot}${star}`;

      case '**':
        return nodot + globstar(opts);

      case '**/*':
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${ONE_CHAR}${star}`;

      case '**/*.*':
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;

      case '**/.*':
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${DOT_LITERAL}${ONE_CHAR}${star}`;

      default: {
        const match = /^(.*?)\.(\w+)$/.exec(str);
        if (!match) return;

        const source = create(match[1]);
        if (!source) return;

        return source + DOT_LITERAL + match[2];
      }
    }
  };

  const output = utils$d.removePrefix(input, state);
  let source = create(output);

  if (source && opts.strictSlashes !== true) {
    source += `${SLASH_LITERAL}?`;
  }

  return source;
};

var parse_1 = parse$1;

const path$6 = f$1;
const scan = scan_1;
const parse = parse_1;
const utils$c = utils$f;
const constants$1 = constants$3;
const isObject = val => val && typeof val === 'object' && !Array.isArray(val);

/**
 * Creates a matcher function from one or more glob patterns. The
 * returned function takes a string to match as its first argument,
 * and returns true if the string is a match. The returned matcher
 * function also takes a boolean as the second argument that, when true,
 * returns an object with additional information.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch(glob[, options]);
 *
 * const isMatch = picomatch('*.!(*a)');
 * console.log(isMatch('a.a')); //=> false
 * console.log(isMatch('a.b')); //=> true
 * ```
 * @name picomatch
 * @param {String|Array} `globs` One or more glob patterns.
 * @param {Object=} `options`
 * @return {Function=} Returns a matcher function.
 * @api public
 */

const picomatch$2 = (glob, options, returnState = false) => {
  if (Array.isArray(glob)) {
    const fns = glob.map(input => picomatch$2(input, options, returnState));
    const arrayMatcher = str => {
      for (const isMatch of fns) {
        const state = isMatch(str);
        if (state) return state;
      }
      return false;
    };
    return arrayMatcher;
  }

  const isState = isObject(glob) && glob.tokens && glob.input;

  if (glob === '' || (typeof glob !== 'string' && !isState)) {
    throw new TypeError('Expected pattern to be a non-empty string');
  }

  const opts = options || {};
  const posix = utils$c.isWindows(options);
  const regex = isState
    ? picomatch$2.compileRe(glob, options)
    : picomatch$2.makeRe(glob, options, false, true);

  const state = regex.state;
  delete regex.state;

  let isIgnored = () => false;
  if (opts.ignore) {
    const ignoreOpts = { ...options, ignore: null, onMatch: null, onResult: null };
    isIgnored = picomatch$2(opts.ignore, ignoreOpts, returnState);
  }

  const matcher = (input, returnObject = false) => {
    const { isMatch, match, output } = picomatch$2.test(input, regex, options, { glob, posix });
    const result = { glob, state, regex, posix, input, output, match, isMatch };

    if (typeof opts.onResult === 'function') {
      opts.onResult(result);
    }

    if (isMatch === false) {
      result.isMatch = false;
      return returnObject ? result : false;
    }

    if (isIgnored(input)) {
      if (typeof opts.onIgnore === 'function') {
        opts.onIgnore(result);
      }
      result.isMatch = false;
      return returnObject ? result : false;
    }

    if (typeof opts.onMatch === 'function') {
      opts.onMatch(result);
    }
    return returnObject ? result : true;
  };

  if (returnState) {
    matcher.state = state;
  }

  return matcher;
};

/**
 * Test `input` with the given `regex`. This is used by the main
 * `picomatch()` function to test the input string.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.test(input, regex[, options]);
 *
 * console.log(picomatch.test('foo/bar', /^(?:([^/]*?)\/([^/]*?))$/));
 * // { isMatch: true, match: [ 'foo/', 'foo', 'bar' ], output: 'foo/bar' }
 * ```
 * @param {String} `input` String to test.
 * @param {RegExp} `regex`
 * @return {Object} Returns an object with matching info.
 * @api public
 */

picomatch$2.test = (input, regex, options, { glob, posix } = {}) => {
  if (typeof input !== 'string') {
    throw new TypeError('Expected input to be a string');
  }

  if (input === '') {
    return { isMatch: false, output: '' };
  }

  const opts = options || {};
  const format = opts.format || (posix ? utils$c.toPosixSlashes : null);
  let match = input === glob;
  let output = (match && format) ? format(input) : input;

  if (match === false) {
    output = format ? format(input) : input;
    match = output === glob;
  }

  if (match === false || opts.capture === true) {
    if (opts.matchBase === true || opts.basename === true) {
      match = picomatch$2.matchBase(input, regex, options, posix);
    } else {
      match = regex.exec(output);
    }
  }

  return { isMatch: Boolean(match), match, output };
};

/**
 * Match the basename of a filepath.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.matchBase(input, glob[, options]);
 * console.log(picomatch.matchBase('foo/bar.js', '*.js'); // true
 * ```
 * @param {String} `input` String to test.
 * @param {RegExp|String} `glob` Glob pattern or regex created by [.makeRe](#makeRe).
 * @return {Boolean}
 * @api public
 */

picomatch$2.matchBase = (input, glob, options, posix = utils$c.isWindows(options)) => {
  const regex = glob instanceof RegExp ? glob : picomatch$2.makeRe(glob, options);
  return regex.test(path$6.basename(input));
};

/**
 * Returns true if **any** of the given glob `patterns` match the specified `string`.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.isMatch(string, patterns[, options]);
 *
 * console.log(picomatch.isMatch('a.a', ['b.*', '*.a'])); //=> true
 * console.log(picomatch.isMatch('a.a', 'b.*')); //=> false
 * ```
 * @param {String|Array} str The string to test.
 * @param {String|Array} patterns One or more glob patterns to use for matching.
 * @param {Object} [options] See available [options](#options).
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */

picomatch$2.isMatch = (str, patterns, options) => picomatch$2(patterns, options)(str);

/**
 * Parse a glob pattern to create the source string for a regular
 * expression.
 *
 * ```js
 * const picomatch = require('picomatch');
 * const result = picomatch.parse(pattern[, options]);
 * ```
 * @param {String} `pattern`
 * @param {Object} `options`
 * @return {Object} Returns an object with useful properties and output to be used as a regex source string.
 * @api public
 */

picomatch$2.parse = (pattern, options) => {
  if (Array.isArray(pattern)) return pattern.map(p => picomatch$2.parse(p, options));
  return parse(pattern, { ...options, fastpaths: false });
};

/**
 * Scan a glob pattern to separate the pattern into segments.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.scan(input[, options]);
 *
 * const result = picomatch.scan('!./foo/*.js');
 * console.log(result);
 * { prefix: '!./',
 *   input: '!./foo/*.js',
 *   start: 3,
 *   base: 'foo',
 *   glob: '*.js',
 *   isBrace: false,
 *   isBracket: false,
 *   isGlob: true,
 *   isExtglob: false,
 *   isGlobstar: false,
 *   negated: true }
 * ```
 * @param {String} `input` Glob pattern to scan.
 * @param {Object} `options`
 * @return {Object} Returns an object with
 * @api public
 */

picomatch$2.scan = (input, options) => scan(input, options);

/**
 * Compile a regular expression from the `state` object returned by the
 * [parse()](#parse) method.
 *
 * @param {Object} `state`
 * @param {Object} `options`
 * @param {Boolean} `returnOutput` Intended for implementors, this argument allows you to return the raw output from the parser.
 * @param {Boolean} `returnState` Adds the state to a `state` property on the returned regex. Useful for implementors and debugging.
 * @return {RegExp}
 * @api public
 */

picomatch$2.compileRe = (state, options, returnOutput = false, returnState = false) => {
  if (returnOutput === true) {
    return state.output;
  }

  const opts = options || {};
  const prepend = opts.contains ? '' : '^';
  const append = opts.contains ? '' : '$';

  let source = `${prepend}(?:${state.output})${append}`;
  if (state && state.negated === true) {
    source = `^(?!${source}).*$`;
  }

  const regex = picomatch$2.toRegex(source, options);
  if (returnState === true) {
    regex.state = state;
  }

  return regex;
};

/**
 * Create a regular expression from a parsed glob pattern.
 *
 * ```js
 * const picomatch = require('picomatch');
 * const state = picomatch.parse('*.js');
 * // picomatch.compileRe(state[, options]);
 *
 * console.log(picomatch.compileRe(state));
 * //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
 * ```
 * @param {String} `state` The object returned from the `.parse` method.
 * @param {Object} `options`
 * @param {Boolean} `returnOutput` Implementors may use this argument to return the compiled output, instead of a regular expression. This is not exposed on the options to prevent end-users from mutating the result.
 * @param {Boolean} `returnState` Implementors may use this argument to return the state from the parsed glob with the returned regular expression.
 * @return {RegExp} Returns a regex created from the given pattern.
 * @api public
 */

picomatch$2.makeRe = (input, options = {}, returnOutput = false, returnState = false) => {
  if (!input || typeof input !== 'string') {
    throw new TypeError('Expected a non-empty string');
  }

  let parsed = { negated: false, fastpaths: true };

  if (options.fastpaths !== false && (input[0] === '.' || input[0] === '*')) {
    parsed.output = parse.fastpaths(input, options);
  }

  if (!parsed.output) {
    parsed = parse(input, options);
  }

  return picomatch$2.compileRe(parsed, options, returnOutput, returnState);
};

/**
 * Create a regular expression from the given regex source string.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.toRegex(source[, options]);
 *
 * const { output } = picomatch.parse('*.js');
 * console.log(picomatch.toRegex(output));
 * //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
 * ```
 * @param {String} `source` Regular expression source string.
 * @param {Object} `options`
 * @return {RegExp}
 * @api public
 */

picomatch$2.toRegex = (source, options) => {
  try {
    const opts = options || {};
    return new RegExp(source, opts.flags || (opts.nocase ? 'i' : ''));
  } catch (err) {
    if (options && options.debug === true) throw err;
    return /$^/;
  }
};

/**
 * Picomatch constants.
 * @return {Object}
 */

picomatch$2.constants = constants$1;

/**
 * Expose "picomatch"
 */

var picomatch_1 = picomatch$2;

var picomatch$1 = picomatch_1;

const util$2 = require$$2;
const braces = braces_1;
const picomatch = picomatch$1;
const utils$b = utils$f;
const isEmptyString = val => val === '' || val === './';

/**
 * Returns an array of strings that match one or more glob patterns.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm(list, patterns[, options]);
 *
 * console.log(mm(['a.js', 'a.txt'], ['*.js']));
 * //=> [ 'a.js' ]
 * ```
 * @param {String|Array<string>} `list` List of strings to match.
 * @param {String|Array<string>} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` See available [options](#options)
 * @return {Array} Returns an array of matches
 * @summary false
 * @api public
 */

const micromatch$1 = (list, patterns, options) => {
  patterns = [].concat(patterns);
  list = [].concat(list);

  let omit = new Set();
  let keep = new Set();
  let items = new Set();
  let negatives = 0;

  let onResult = state => {
    items.add(state.output);
    if (options && options.onResult) {
      options.onResult(state);
    }
  };

  for (let i = 0; i < patterns.length; i++) {
    let isMatch = picomatch(String(patterns[i]), { ...options, onResult }, true);
    let negated = isMatch.state.negated || isMatch.state.negatedExtglob;
    if (negated) negatives++;

    for (let item of list) {
      let matched = isMatch(item, true);

      let match = negated ? !matched.isMatch : matched.isMatch;
      if (!match) continue;

      if (negated) {
        omit.add(matched.output);
      } else {
        omit.delete(matched.output);
        keep.add(matched.output);
      }
    }
  }

  let result = negatives === patterns.length ? [...items] : [...keep];
  let matches = result.filter(item => !omit.has(item));

  if (options && matches.length === 0) {
    if (options.failglob === true) {
      throw new Error(`No matches found for "${patterns.join(', ')}"`);
    }

    if (options.nonull === true || options.nullglob === true) {
      return options.unescape ? patterns.map(p => p.replace(/\\/g, '')) : patterns;
    }
  }

  return matches;
};

/**
 * Backwards compatibility
 */

micromatch$1.match = micromatch$1;

/**
 * Returns a matcher function from the given glob `pattern` and `options`.
 * The returned function takes a string to match as its only argument and returns
 * true if the string is a match.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.matcher(pattern[, options]);
 *
 * const isMatch = mm.matcher('*.!(*a)');
 * console.log(isMatch('a.a')); //=> false
 * console.log(isMatch('a.b')); //=> true
 * ```
 * @param {String} `pattern` Glob pattern
 * @param {Object} `options`
 * @return {Function} Returns a matcher function.
 * @api public
 */

micromatch$1.matcher = (pattern, options) => picomatch(pattern, options);

/**
 * Returns true if **any** of the given glob `patterns` match the specified `string`.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.isMatch(string, patterns[, options]);
 *
 * console.log(mm.isMatch('a.a', ['b.*', '*.a'])); //=> true
 * console.log(mm.isMatch('a.a', 'b.*')); //=> false
 * ```
 * @param {String} `str` The string to test.
 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `[options]` See available [options](#options).
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */

micromatch$1.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);

/**
 * Backwards compatibility
 */

micromatch$1.any = micromatch$1.isMatch;

/**
 * Returns a list of strings that _**do not match any**_ of the given `patterns`.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.not(list, patterns[, options]);
 *
 * console.log(mm.not(['a.a', 'b.b', 'c.c'], '*.a'));
 * //=> ['b.b', 'c.c']
 * ```
 * @param {Array} `list` Array of strings to match.
 * @param {String|Array} `patterns` One or more glob pattern to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Array} Returns an array of strings that **do not match** the given patterns.
 * @api public
 */

micromatch$1.not = (list, patterns, options = {}) => {
  patterns = [].concat(patterns).map(String);
  let result = new Set();
  let items = [];

  let onResult = state => {
    if (options.onResult) options.onResult(state);
    items.push(state.output);
  };

  let matches = new Set(micromatch$1(list, patterns, { ...options, onResult }));

  for (let item of items) {
    if (!matches.has(item)) {
      result.add(item);
    }
  }
  return [...result];
};

/**
 * Returns true if the given `string` contains the given pattern. Similar
 * to [.isMatch](#isMatch) but the pattern can match any part of the string.
 *
 * ```js
 * var mm = require('micromatch');
 * // mm.contains(string, pattern[, options]);
 *
 * console.log(mm.contains('aa/bb/cc', '*b'));
 * //=> true
 * console.log(mm.contains('aa/bb/cc', '*d'));
 * //=> false
 * ```
 * @param {String} `str` The string to match.
 * @param {String|Array} `patterns` Glob pattern to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns true if any of the patterns matches any part of `str`.
 * @api public
 */

micromatch$1.contains = (str, pattern, options) => {
  if (typeof str !== 'string') {
    throw new TypeError(`Expected a string: "${util$2.inspect(str)}"`);
  }

  if (Array.isArray(pattern)) {
    return pattern.some(p => micromatch$1.contains(str, p, options));
  }

  if (typeof pattern === 'string') {
    if (isEmptyString(str) || isEmptyString(pattern)) {
      return false;
    }

    if (str.includes(pattern) || (str.startsWith('./') && str.slice(2).includes(pattern))) {
      return true;
    }
  }

  return micromatch$1.isMatch(str, pattern, { ...options, contains: true });
};

/**
 * Filter the keys of the given object with the given `glob` pattern
 * and `options`. Does not attempt to match nested keys. If you need this feature,
 * use [glob-object][] instead.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.matchKeys(object, patterns[, options]);
 *
 * const obj = { aa: 'a', ab: 'b', ac: 'c' };
 * console.log(mm.matchKeys(obj, '*b'));
 * //=> { ab: 'b' }
 * ```
 * @param {Object} `object` The object with keys to filter.
 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Object} Returns an object with only keys that match the given patterns.
 * @api public
 */

micromatch$1.matchKeys = (obj, patterns, options) => {
  if (!utils$b.isObject(obj)) {
    throw new TypeError('Expected the first argument to be an object');
  }
  let keys = micromatch$1(Object.keys(obj), patterns, options);
  let res = {};
  for (let key of keys) res[key] = obj[key];
  return res;
};

/**
 * Returns true if some of the strings in the given `list` match any of the given glob `patterns`.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.some(list, patterns[, options]);
 *
 * console.log(mm.some(['foo.js', 'bar.js'], ['*.js', '!foo.js']));
 * // true
 * console.log(mm.some(['foo.js'], ['*.js', '!foo.js']));
 * // false
 * ```
 * @param {String|Array} `list` The string or array of strings to test. Returns as soon as the first match is found.
 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns true if any `patterns` matches any of the strings in `list`
 * @api public
 */

micromatch$1.some = (list, patterns, options) => {
  let items = [].concat(list);

  for (let pattern of [].concat(patterns)) {
    let isMatch = picomatch(String(pattern), options);
    if (items.some(item => isMatch(item))) {
      return true;
    }
  }
  return false;
};

/**
 * Returns true if every string in the given `list` matches
 * any of the given glob `patterns`.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.every(list, patterns[, options]);
 *
 * console.log(mm.every('foo.js', ['foo.js']));
 * // true
 * console.log(mm.every(['foo.js', 'bar.js'], ['*.js']));
 * // true
 * console.log(mm.every(['foo.js', 'bar.js'], ['*.js', '!foo.js']));
 * // false
 * console.log(mm.every(['foo.js'], ['*.js', '!foo.js']));
 * // false
 * ```
 * @param {String|Array} `list` The string or array of strings to test.
 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns true if all `patterns` matches all of the strings in `list`
 * @api public
 */

micromatch$1.every = (list, patterns, options) => {
  let items = [].concat(list);

  for (let pattern of [].concat(patterns)) {
    let isMatch = picomatch(String(pattern), options);
    if (!items.every(item => isMatch(item))) {
      return false;
    }
  }
  return true;
};

/**
 * Returns true if **all** of the given `patterns` match
 * the specified string.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.all(string, patterns[, options]);
 *
 * console.log(mm.all('foo.js', ['foo.js']));
 * // true
 *
 * console.log(mm.all('foo.js', ['*.js', '!foo.js']));
 * // false
 *
 * console.log(mm.all('foo.js', ['*.js', 'foo.js']));
 * // true
 *
 * console.log(mm.all('foo.js', ['*.js', 'f*', '*o*', '*o.js']));
 * // true
 * ```
 * @param {String|Array} `str` The string to test.
 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */

micromatch$1.all = (str, patterns, options) => {
  if (typeof str !== 'string') {
    throw new TypeError(`Expected a string: "${util$2.inspect(str)}"`);
  }

  return [].concat(patterns).every(p => picomatch(p, options)(str));
};

/**
 * Returns an array of matches captured by `pattern` in `string, or `null` if the pattern did not match.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.capture(pattern, string[, options]);
 *
 * console.log(mm.capture('test/*.js', 'test/foo.js'));
 * //=> ['foo']
 * console.log(mm.capture('test/*.js', 'foo/bar.css'));
 * //=> null
 * ```
 * @param {String} `glob` Glob pattern to use for matching.
 * @param {String} `input` String to match
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Array|null} Returns an array of captures if the input matches the glob pattern, otherwise `null`.
 * @api public
 */

micromatch$1.capture = (glob, input, options) => {
  let posix = utils$b.isWindows(options);
  let regex = picomatch.makeRe(String(glob), { ...options, capture: true });
  let match = regex.exec(posix ? utils$b.toPosixSlashes(input) : input);

  if (match) {
    return match.slice(1).map(v => v === void 0 ? '' : v);
  }
};

/**
 * Create a regular expression from the given glob `pattern`.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.makeRe(pattern[, options]);
 *
 * console.log(mm.makeRe('*.js'));
 * //=> /^(?:(\.[\\\/])?(?!\.)(?=.)[^\/]*?\.js)$/
 * ```
 * @param {String} `pattern` A glob pattern to convert to regex.
 * @param {Object} `options`
 * @return {RegExp} Returns a regex created from the given pattern.
 * @api public
 */

micromatch$1.makeRe = (...args) => picomatch.makeRe(...args);

/**
 * Scan a glob pattern to separate the pattern into segments. Used
 * by the [split](#split) method.
 *
 * ```js
 * const mm = require('micromatch');
 * const state = mm.scan(pattern[, options]);
 * ```
 * @param {String} `pattern`
 * @param {Object} `options`
 * @return {Object} Returns an object with
 * @api public
 */

micromatch$1.scan = (...args) => picomatch.scan(...args);

/**
 * Parse a glob pattern to create the source string for a regular
 * expression.
 *
 * ```js
 * const mm = require('micromatch');
 * const state = mm.parse(pattern[, options]);
 * ```
 * @param {String} `glob`
 * @param {Object} `options`
 * @return {Object} Returns an object with useful properties and output to be used as regex source string.
 * @api public
 */

micromatch$1.parse = (patterns, options) => {
  let res = [];
  for (let pattern of [].concat(patterns || [])) {
    for (let str of braces(String(pattern), options)) {
      res.push(picomatch.parse(str, options));
    }
  }
  return res;
};

/**
 * Process the given brace `pattern`.
 *
 * ```js
 * const { braces } = require('micromatch');
 * console.log(braces('foo/{a,b,c}/bar'));
 * //=> [ 'foo/(a|b|c)/bar' ]
 *
 * console.log(braces('foo/{a,b,c}/bar', { expand: true }));
 * //=> [ 'foo/a/bar', 'foo/b/bar', 'foo/c/bar' ]
 * ```
 * @param {String} `pattern` String with brace pattern to process.
 * @param {Object} `options` Any [options](#options) to change how expansion is performed. See the [braces][] library for all available options.
 * @return {Array}
 * @api public
 */

micromatch$1.braces = (pattern, options) => {
  if (typeof pattern !== 'string') throw new TypeError('Expected a string');
  if ((options && options.nobrace === true) || !/\{.*\}/.test(pattern)) {
    return [pattern];
  }
  return braces(pattern, options);
};

/**
 * Expand braces
 */

micromatch$1.braceExpand = (pattern, options) => {
  if (typeof pattern !== 'string') throw new TypeError('Expected a string');
  return micromatch$1.braces(pattern, { ...options, expand: true });
};

/**
 * Expose micromatch
 */

var micromatch_1 = micromatch$1;

var mm = /*@__PURE__*/getDefaultExportFromCjs(micromatch_1);

Object.defineProperty(pattern$1, "__esModule", { value: true });
pattern$1.removeDuplicateSlashes = pattern$1.matchAny = pattern$1.convertPatternsToRe = pattern$1.makeRe = pattern$1.getPatternParts = pattern$1.expandBraceExpansion = pattern$1.expandPatternsWithBraceExpansion = pattern$1.isAffectDepthOfReadingPattern = pattern$1.endsWithSlashGlobStar = pattern$1.hasGlobStar = pattern$1.getBaseDirectory = pattern$1.isPatternRelatedToParentDirectory = pattern$1.getPatternsOutsideCurrentDirectory = pattern$1.getPatternsInsideCurrentDirectory = pattern$1.getPositivePatterns = pattern$1.getNegativePatterns = pattern$1.isPositivePattern = pattern$1.isNegativePattern = pattern$1.convertToNegativePattern = pattern$1.convertToPositivePattern = pattern$1.isDynamicPattern = pattern$1.isStaticPattern = void 0;
const path$5 = f$1;
const globParent = globParent$1;
const micromatch = micromatch_1;
const GLOBSTAR = '**';
const ESCAPE_SYMBOL = '\\';
const COMMON_GLOB_SYMBOLS_RE = /[*?]|^!/;
const REGEX_CHARACTER_CLASS_SYMBOLS_RE = /\[[^[]*]/;
const REGEX_GROUP_SYMBOLS_RE = /(?:^|[^!*+?@])\([^(]*\|[^|]*\)/;
const GLOB_EXTENSION_SYMBOLS_RE = /[!*+?@]\([^(]*\)/;
const BRACE_EXPANSION_SEPARATORS_RE = /,|\.\./;
/**
 * Matches a sequence of two or more consecutive slashes, excluding the first two slashes at the beginning of the string.
 * The latter is due to the presence of the device path at the beginning of the UNC path.
 */
const DOUBLE_SLASH_RE = /(?!^)\/{2,}/g;
function isStaticPattern(pattern, options = {}) {
    return !isDynamicPattern(pattern, options);
}
pattern$1.isStaticPattern = isStaticPattern;
function isDynamicPattern(pattern, options = {}) {
    /**
     * A special case with an empty string is necessary for matching patterns that start with a forward slash.
     * An empty string cannot be a dynamic pattern.
     * For example, the pattern `/lib/*` will be spread into parts: '', 'lib', '*'.
     */
    if (pattern === '') {
        return false;
    }
    /**
     * When the `caseSensitiveMatch` option is disabled, all patterns must be marked as dynamic, because we cannot check
     * filepath directly (without read directory).
     */
    if (options.caseSensitiveMatch === false || pattern.includes(ESCAPE_SYMBOL)) {
        return true;
    }
    if (COMMON_GLOB_SYMBOLS_RE.test(pattern) || REGEX_CHARACTER_CLASS_SYMBOLS_RE.test(pattern) || REGEX_GROUP_SYMBOLS_RE.test(pattern)) {
        return true;
    }
    if (options.extglob !== false && GLOB_EXTENSION_SYMBOLS_RE.test(pattern)) {
        return true;
    }
    if (options.braceExpansion !== false && hasBraceExpansion(pattern)) {
        return true;
    }
    return false;
}
pattern$1.isDynamicPattern = isDynamicPattern;
function hasBraceExpansion(pattern) {
    const openingBraceIndex = pattern.indexOf('{');
    if (openingBraceIndex === -1) {
        return false;
    }
    const closingBraceIndex = pattern.indexOf('}', openingBraceIndex + 1);
    if (closingBraceIndex === -1) {
        return false;
    }
    const braceContent = pattern.slice(openingBraceIndex, closingBraceIndex);
    return BRACE_EXPANSION_SEPARATORS_RE.test(braceContent);
}
function convertToPositivePattern(pattern) {
    return isNegativePattern(pattern) ? pattern.slice(1) : pattern;
}
pattern$1.convertToPositivePattern = convertToPositivePattern;
function convertToNegativePattern(pattern) {
    return '!' + pattern;
}
pattern$1.convertToNegativePattern = convertToNegativePattern;
function isNegativePattern(pattern) {
    return pattern.startsWith('!') && pattern[1] !== '(';
}
pattern$1.isNegativePattern = isNegativePattern;
function isPositivePattern(pattern) {
    return !isNegativePattern(pattern);
}
pattern$1.isPositivePattern = isPositivePattern;
function getNegativePatterns(patterns) {
    return patterns.filter(isNegativePattern);
}
pattern$1.getNegativePatterns = getNegativePatterns;
function getPositivePatterns$1(patterns) {
    return patterns.filter(isPositivePattern);
}
pattern$1.getPositivePatterns = getPositivePatterns$1;
/**
 * Returns patterns that can be applied inside the current directory.
 *
 * @example
 * // ['./*', '*', 'a/*']
 * getPatternsInsideCurrentDirectory(['./*', '*', 'a/*', '../*', './../*'])
 */
function getPatternsInsideCurrentDirectory(patterns) {
    return patterns.filter((pattern) => !isPatternRelatedToParentDirectory(pattern));
}
pattern$1.getPatternsInsideCurrentDirectory = getPatternsInsideCurrentDirectory;
/**
 * Returns patterns to be expanded relative to (outside) the current directory.
 *
 * @example
 * // ['../*', './../*']
 * getPatternsInsideCurrentDirectory(['./*', '*', 'a/*', '../*', './../*'])
 */
function getPatternsOutsideCurrentDirectory(patterns) {
    return patterns.filter(isPatternRelatedToParentDirectory);
}
pattern$1.getPatternsOutsideCurrentDirectory = getPatternsOutsideCurrentDirectory;
function isPatternRelatedToParentDirectory(pattern) {
    return pattern.startsWith('..') || pattern.startsWith('./..');
}
pattern$1.isPatternRelatedToParentDirectory = isPatternRelatedToParentDirectory;
function getBaseDirectory(pattern) {
    return globParent(pattern, { flipBackslashes: false });
}
pattern$1.getBaseDirectory = getBaseDirectory;
function hasGlobStar(pattern) {
    return pattern.includes(GLOBSTAR);
}
pattern$1.hasGlobStar = hasGlobStar;
function endsWithSlashGlobStar(pattern) {
    return pattern.endsWith('/' + GLOBSTAR);
}
pattern$1.endsWithSlashGlobStar = endsWithSlashGlobStar;
function isAffectDepthOfReadingPattern(pattern) {
    const basename = path$5.basename(pattern);
    return endsWithSlashGlobStar(pattern) || isStaticPattern(basename);
}
pattern$1.isAffectDepthOfReadingPattern = isAffectDepthOfReadingPattern;
function expandPatternsWithBraceExpansion(patterns) {
    return patterns.reduce((collection, pattern) => {
        return collection.concat(expandBraceExpansion(pattern));
    }, []);
}
pattern$1.expandPatternsWithBraceExpansion = expandPatternsWithBraceExpansion;
function expandBraceExpansion(pattern) {
    const patterns = micromatch.braces(pattern, { expand: true, nodupes: true });
    /**
     * Sort the patterns by length so that the same depth patterns are processed side by side.
     * `a/{b,}/{c,}/*` – `['a///*', 'a/b//*', 'a//c/*', 'a/b/c/*']`
     */
    patterns.sort((a, b) => a.length - b.length);
    /**
     * Micromatch can return an empty string in the case of patterns like `{a,}`.
     */
    return patterns.filter((pattern) => pattern !== '');
}
pattern$1.expandBraceExpansion = expandBraceExpansion;
function getPatternParts(pattern, options) {
    let { parts } = micromatch.scan(pattern, Object.assign(Object.assign({}, options), { parts: true }));
    /**
     * The scan method returns an empty array in some cases.
     * See micromatch/picomatch#58 for more details.
     */
    if (parts.length === 0) {
        parts = [pattern];
    }
    /**
     * The scan method does not return an empty part for the pattern with a forward slash.
     * This is another part of micromatch/picomatch#58.
     */
    if (parts[0].startsWith('/')) {
        parts[0] = parts[0].slice(1);
        parts.unshift('');
    }
    return parts;
}
pattern$1.getPatternParts = getPatternParts;
function makeRe(pattern, options) {
    return micromatch.makeRe(pattern, options);
}
pattern$1.makeRe = makeRe;
function convertPatternsToRe(patterns, options) {
    return patterns.map((pattern) => makeRe(pattern, options));
}
pattern$1.convertPatternsToRe = convertPatternsToRe;
function matchAny(entry, patternsRe) {
    return patternsRe.some((patternRe) => patternRe.test(entry));
}
pattern$1.matchAny = matchAny;
/**
 * This package only works with forward slashes as a path separator.
 * Because of this, we cannot use the standard `path.normalize` method, because on Windows platform it will use of backslashes.
 */
function removeDuplicateSlashes(pattern) {
    return pattern.replace(DOUBLE_SLASH_RE, '/');
}
pattern$1.removeDuplicateSlashes = removeDuplicateSlashes;

var stream$4 = {};

/*
 * merge2
 * https://github.com/teambition/merge2
 *
 * Copyright (c) 2014-2020 Teambition
 * Licensed under the MIT license.
 */
const Stream = require$$0$1;
const PassThrough = Stream.PassThrough;
const slice = Array.prototype.slice;

var merge2_1 = merge2$1;

function merge2$1 () {
  const streamsQueue = [];
  const args = slice.call(arguments);
  let merging = false;
  let options = args[args.length - 1];

  if (options && !Array.isArray(options) && options.pipe == null) {
    args.pop();
  } else {
    options = {};
  }

  const doEnd = options.end !== false;
  const doPipeError = options.pipeError === true;
  if (options.objectMode == null) {
    options.objectMode = true;
  }
  if (options.highWaterMark == null) {
    options.highWaterMark = 64 * 1024;
  }
  const mergedStream = PassThrough(options);

  function addStream () {
    for (let i = 0, len = arguments.length; i < len; i++) {
      streamsQueue.push(pauseStreams(arguments[i], options));
    }
    mergeStream();
    return this
  }

  function mergeStream () {
    if (merging) {
      return
    }
    merging = true;

    let streams = streamsQueue.shift();
    if (!streams) {
      process.nextTick(endStream);
      return
    }
    if (!Array.isArray(streams)) {
      streams = [streams];
    }

    let pipesCount = streams.length + 1;

    function next () {
      if (--pipesCount > 0) {
        return
      }
      merging = false;
      mergeStream();
    }

    function pipe (stream) {
      function onend () {
        stream.removeListener('merge2UnpipeEnd', onend);
        stream.removeListener('end', onend);
        if (doPipeError) {
          stream.removeListener('error', onerror);
        }
        next();
      }
      function onerror (err) {
        mergedStream.emit('error', err);
      }
      // skip ended stream
      if (stream._readableState.endEmitted) {
        return next()
      }

      stream.on('merge2UnpipeEnd', onend);
      stream.on('end', onend);

      if (doPipeError) {
        stream.on('error', onerror);
      }

      stream.pipe(mergedStream, { end: false });
      // compatible for old stream
      stream.resume();
    }

    for (let i = 0; i < streams.length; i++) {
      pipe(streams[i]);
    }

    next();
  }

  function endStream () {
    merging = false;
    // emit 'queueDrain' when all streams merged.
    mergedStream.emit('queueDrain');
    if (doEnd) {
      mergedStream.end();
    }
  }

  mergedStream.setMaxListeners(0);
  mergedStream.add = addStream;
  mergedStream.on('unpipe', function (stream) {
    stream.emit('merge2UnpipeEnd');
  });

  if (args.length) {
    addStream.apply(null, args);
  }
  return mergedStream
}

// check and pause streams for pipe.
function pauseStreams (streams, options) {
  if (!Array.isArray(streams)) {
    // Backwards-compat with old-style streams
    if (!streams._readableState && streams.pipe) {
      streams = streams.pipe(PassThrough(options));
    }
    if (!streams._readableState || !streams.pause || !streams.pipe) {
      throw new Error('Only readable stream can be merged.')
    }
    streams.pause();
  } else {
    for (let i = 0, len = streams.length; i < len; i++) {
      streams[i] = pauseStreams(streams[i], options);
    }
  }
  return streams
}

Object.defineProperty(stream$4, "__esModule", { value: true });
stream$4.merge = void 0;
const merge2 = merge2_1;
function merge(streams) {
    const mergedStream = merge2(streams);
    streams.forEach((stream) => {
        stream.once('error', (error) => mergedStream.emit('error', error));
    });
    mergedStream.once('close', () => propagateCloseEventToSources(streams));
    mergedStream.once('end', () => propagateCloseEventToSources(streams));
    return mergedStream;
}
stream$4.merge = merge;
function propagateCloseEventToSources(streams) {
    streams.forEach((stream) => stream.emit('close'));
}

var string$1 = {};

Object.defineProperty(string$1, "__esModule", { value: true });
string$1.isEmpty = string$1.isString = void 0;
function isString(input) {
    return typeof input === 'string';
}
string$1.isString = isString;
function isEmpty(input) {
    return input === '';
}
string$1.isEmpty = isEmpty;

Object.defineProperty(utils$k, "__esModule", { value: true });
utils$k.string = utils$k.stream = utils$k.pattern = utils$k.path = utils$k.fs = utils$k.errno = utils$k.array = void 0;
const array = array$1;
utils$k.array = array;
const errno = errno$1;
utils$k.errno = errno;
const fs$6 = fs$7;
utils$k.fs = fs$6;
const path$4 = path$9;
utils$k.path = path$4;
const pattern = pattern$1;
utils$k.pattern = pattern;
const stream$3 = stream$4;
utils$k.stream = stream$3;
const string = string$1;
utils$k.string = string;

Object.defineProperty(tasks, "__esModule", { value: true });
tasks.convertPatternGroupToTask = tasks.convertPatternGroupsToTasks = tasks.groupPatternsByBaseDirectory = tasks.getNegativePatternsAsPositive = tasks.getPositivePatterns = tasks.convertPatternsToTasks = tasks.generate = void 0;
const utils$a = utils$k;
function generate(input, settings) {
    const patterns = processPatterns(input, settings);
    const ignore = processPatterns(settings.ignore, settings);
    const positivePatterns = getPositivePatterns(patterns);
    const negativePatterns = getNegativePatternsAsPositive(patterns, ignore);
    const staticPatterns = positivePatterns.filter((pattern) => utils$a.pattern.isStaticPattern(pattern, settings));
    const dynamicPatterns = positivePatterns.filter((pattern) => utils$a.pattern.isDynamicPattern(pattern, settings));
    const staticTasks = convertPatternsToTasks(staticPatterns, negativePatterns, /* dynamic */ false);
    const dynamicTasks = convertPatternsToTasks(dynamicPatterns, negativePatterns, /* dynamic */ true);
    return staticTasks.concat(dynamicTasks);
}
tasks.generate = generate;
function processPatterns(input, settings) {
    let patterns = input;
    /**
     * The original pattern like `{,*,**,a/*}` can lead to problems checking the depth when matching entry
     * and some problems with the micromatch package (see fast-glob issues: #365, #394).
     *
     * To solve this problem, we expand all patterns containing brace expansion. This can lead to a slight slowdown
     * in matching in the case of a large set of patterns after expansion.
     */
    if (settings.braceExpansion) {
        patterns = utils$a.pattern.expandPatternsWithBraceExpansion(patterns);
    }
    /**
     * If the `baseNameMatch` option is enabled, we must add globstar to patterns, so that they can be used
     * at any nesting level.
     *
     * We do this here, because otherwise we have to complicate the filtering logic. For example, we need to change
     * the pattern in the filter before creating a regular expression. There is no need to change the patterns
     * in the application. Only on the input.
     */
    if (settings.baseNameMatch) {
        patterns = patterns.map((pattern) => pattern.includes('/') ? pattern : `**/${pattern}`);
    }
    /**
     * This method also removes duplicate slashes that may have been in the pattern or formed as a result of expansion.
     */
    return patterns.map((pattern) => utils$a.pattern.removeDuplicateSlashes(pattern));
}
/**
 * Returns tasks grouped by basic pattern directories.
 *
 * Patterns that can be found inside (`./`) and outside (`../`) the current directory are handled separately.
 * This is necessary because directory traversal starts at the base directory and goes deeper.
 */
function convertPatternsToTasks(positive, negative, dynamic) {
    const tasks = [];
    const patternsOutsideCurrentDirectory = utils$a.pattern.getPatternsOutsideCurrentDirectory(positive);
    const patternsInsideCurrentDirectory = utils$a.pattern.getPatternsInsideCurrentDirectory(positive);
    const outsideCurrentDirectoryGroup = groupPatternsByBaseDirectory(patternsOutsideCurrentDirectory);
    const insideCurrentDirectoryGroup = groupPatternsByBaseDirectory(patternsInsideCurrentDirectory);
    tasks.push(...convertPatternGroupsToTasks(outsideCurrentDirectoryGroup, negative, dynamic));
    /*
     * For the sake of reducing future accesses to the file system, we merge all tasks within the current directory
     * into a global task, if at least one pattern refers to the root (`.`). In this case, the global task covers the rest.
     */
    if ('.' in insideCurrentDirectoryGroup) {
        tasks.push(convertPatternGroupToTask('.', patternsInsideCurrentDirectory, negative, dynamic));
    }
    else {
        tasks.push(...convertPatternGroupsToTasks(insideCurrentDirectoryGroup, negative, dynamic));
    }
    return tasks;
}
tasks.convertPatternsToTasks = convertPatternsToTasks;
function getPositivePatterns(patterns) {
    return utils$a.pattern.getPositivePatterns(patterns);
}
tasks.getPositivePatterns = getPositivePatterns;
function getNegativePatternsAsPositive(patterns, ignore) {
    const negative = utils$a.pattern.getNegativePatterns(patterns).concat(ignore);
    const positive = negative.map(utils$a.pattern.convertToPositivePattern);
    return positive;
}
tasks.getNegativePatternsAsPositive = getNegativePatternsAsPositive;
function groupPatternsByBaseDirectory(patterns) {
    const group = {};
    return patterns.reduce((collection, pattern) => {
        const base = utils$a.pattern.getBaseDirectory(pattern);
        if (base in collection) {
            collection[base].push(pattern);
        }
        else {
            collection[base] = [pattern];
        }
        return collection;
    }, group);
}
tasks.groupPatternsByBaseDirectory = groupPatternsByBaseDirectory;
function convertPatternGroupsToTasks(positive, negative, dynamic) {
    return Object.keys(positive).map((base) => {
        return convertPatternGroupToTask(base, positive[base], negative, dynamic);
    });
}
tasks.convertPatternGroupsToTasks = convertPatternGroupsToTasks;
function convertPatternGroupToTask(base, positive, negative, dynamic) {
    return {
        dynamic,
        positive,
        negative,
        base,
        patterns: [].concat(positive, negative.map(utils$a.pattern.convertToNegativePattern))
    };
}
tasks.convertPatternGroupToTask = convertPatternGroupToTask;

var async$7 = {};

var async$6 = {};

var out$3 = {};

var async$5 = {};

var async$4 = {};

var out$2 = {};

var async$3 = {};

var out$1 = {};

var async$2 = {};

Object.defineProperty(async$2, "__esModule", { value: true });
async$2.read = void 0;
function read$3(path, settings, callback) {
    settings.fs.lstat(path, (lstatError, lstat) => {
        if (lstatError !== null) {
            callFailureCallback$2(callback, lstatError);
            return;
        }
        if (!lstat.isSymbolicLink() || !settings.followSymbolicLink) {
            callSuccessCallback$2(callback, lstat);
            return;
        }
        settings.fs.stat(path, (statError, stat) => {
            if (statError !== null) {
                if (settings.throwErrorOnBrokenSymbolicLink) {
                    callFailureCallback$2(callback, statError);
                    return;
                }
                callSuccessCallback$2(callback, lstat);
                return;
            }
            if (settings.markSymbolicLink) {
                stat.isSymbolicLink = () => true;
            }
            callSuccessCallback$2(callback, stat);
        });
    });
}
async$2.read = read$3;
function callFailureCallback$2(callback, error) {
    callback(error);
}
function callSuccessCallback$2(callback, result) {
    callback(null, result);
}

var sync$7 = {};

Object.defineProperty(sync$7, "__esModule", { value: true });
sync$7.read = void 0;
function read$2(path, settings) {
    const lstat = settings.fs.lstatSync(path);
    if (!lstat.isSymbolicLink() || !settings.followSymbolicLink) {
        return lstat;
    }
    try {
        const stat = settings.fs.statSync(path);
        if (settings.markSymbolicLink) {
            stat.isSymbolicLink = () => true;
        }
        return stat;
    }
    catch (error) {
        if (!settings.throwErrorOnBrokenSymbolicLink) {
            return lstat;
        }
        throw error;
    }
}
sync$7.read = read$2;

var settings$3 = {};

var fs$5 = {};

(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createFileSystemAdapter = exports.FILE_SYSTEM_ADAPTER = void 0;
	const fs = $;
	exports.FILE_SYSTEM_ADAPTER = {
	    lstat: fs.lstat,
	    stat: fs.stat,
	    lstatSync: fs.lstatSync,
	    statSync: fs.statSync
	};
	function createFileSystemAdapter(fsMethods) {
	    if (fsMethods === undefined) {
	        return exports.FILE_SYSTEM_ADAPTER;
	    }
	    return Object.assign(Object.assign({}, exports.FILE_SYSTEM_ADAPTER), fsMethods);
	}
	exports.createFileSystemAdapter = createFileSystemAdapter; 
} (fs$5));

Object.defineProperty(settings$3, "__esModule", { value: true });
const fs$4 = fs$5;
let Settings$2 = class Settings {
    constructor(_options = {}) {
        this._options = _options;
        this.followSymbolicLink = this._getValue(this._options.followSymbolicLink, true);
        this.fs = fs$4.createFileSystemAdapter(this._options.fs);
        this.markSymbolicLink = this._getValue(this._options.markSymbolicLink, false);
        this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, true);
    }
    _getValue(option, value) {
        return option !== null && option !== void 0 ? option : value;
    }
};
settings$3.default = Settings$2;

Object.defineProperty(out$1, "__esModule", { value: true });
out$1.statSync = out$1.stat = out$1.Settings = void 0;
const async$1 = async$2;
const sync$6 = sync$7;
const settings_1$3 = settings$3;
out$1.Settings = settings_1$3.default;
function stat(path, optionsOrSettingsOrCallback, callback) {
    if (typeof optionsOrSettingsOrCallback === 'function') {
        async$1.read(path, getSettings$2(), optionsOrSettingsOrCallback);
        return;
    }
    async$1.read(path, getSettings$2(optionsOrSettingsOrCallback), callback);
}
out$1.stat = stat;
function statSync(path, optionsOrSettings) {
    const settings = getSettings$2(optionsOrSettings);
    return sync$6.read(path, settings);
}
out$1.statSync = statSync;
function getSettings$2(settingsOrOptions = {}) {
    if (settingsOrOptions instanceof settings_1$3.default) {
        return settingsOrOptions;
    }
    return new settings_1$3.default(settingsOrOptions);
}

/*! queue-microtask. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */

let promise;

var queueMicrotask_1 = typeof queueMicrotask === 'function'
  ? queueMicrotask.bind(typeof window !== 'undefined' ? window : commonjsGlobal)
  // reuse resolved promise, and allocate it lazily
  : cb => (promise || (promise = Promise.resolve()))
    .then(cb)
    .catch(err => setTimeout(() => { throw err }, 0));

/*! run-parallel. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */

var runParallel_1 = runParallel;

const queueMicrotask$1 = queueMicrotask_1;

function runParallel (tasks, cb) {
  let results, pending, keys;
  let isSync = true;

  if (Array.isArray(tasks)) {
    results = [];
    pending = tasks.length;
  } else {
    keys = Object.keys(tasks);
    results = {};
    pending = keys.length;
  }

  function done (err) {
    function end () {
      if (cb) cb(err, results);
      cb = null;
    }
    if (isSync) queueMicrotask$1(end);
    else end();
  }

  function each (i, err, result) {
    results[i] = result;
    if (--pending === 0 || err) {
      done(err);
    }
  }

  if (!pending) {
    // empty
    done(null);
  } else if (keys) {
    // object
    keys.forEach(function (key) {
      tasks[key](function (err, result) { each(key, err, result); });
    });
  } else {
    // array
    tasks.forEach(function (task, i) {
      task(function (err, result) { each(i, err, result); });
    });
  }

  isSync = false;
}

var constants = {};

Object.defineProperty(constants, "__esModule", { value: true });
constants.IS_SUPPORT_READDIR_WITH_FILE_TYPES = void 0;
const NODE_PROCESS_VERSION_PARTS = process.versions.node.split('.');
if (NODE_PROCESS_VERSION_PARTS[0] === undefined || NODE_PROCESS_VERSION_PARTS[1] === undefined) {
    throw new Error(`Unexpected behavior. The 'process.versions.node' variable has invalid value: ${process.versions.node}`);
}
const MAJOR_VERSION = Number.parseInt(NODE_PROCESS_VERSION_PARTS[0], 10);
const MINOR_VERSION = Number.parseInt(NODE_PROCESS_VERSION_PARTS[1], 10);
const SUPPORTED_MAJOR_VERSION = 10;
const SUPPORTED_MINOR_VERSION = 10;
const IS_MATCHED_BY_MAJOR = MAJOR_VERSION > SUPPORTED_MAJOR_VERSION;
const IS_MATCHED_BY_MAJOR_AND_MINOR = MAJOR_VERSION === SUPPORTED_MAJOR_VERSION && MINOR_VERSION >= SUPPORTED_MINOR_VERSION;
/**
 * IS `true` for Node.js 10.10 and greater.
 */
constants.IS_SUPPORT_READDIR_WITH_FILE_TYPES = IS_MATCHED_BY_MAJOR || IS_MATCHED_BY_MAJOR_AND_MINOR;

var utils$9 = {};

var fs$3 = {};

Object.defineProperty(fs$3, "__esModule", { value: true });
fs$3.createDirentFromStats = void 0;
class DirentFromStats {
    constructor(name, stats) {
        this.name = name;
        this.isBlockDevice = stats.isBlockDevice.bind(stats);
        this.isCharacterDevice = stats.isCharacterDevice.bind(stats);
        this.isDirectory = stats.isDirectory.bind(stats);
        this.isFIFO = stats.isFIFO.bind(stats);
        this.isFile = stats.isFile.bind(stats);
        this.isSocket = stats.isSocket.bind(stats);
        this.isSymbolicLink = stats.isSymbolicLink.bind(stats);
    }
}
function createDirentFromStats(name, stats) {
    return new DirentFromStats(name, stats);
}
fs$3.createDirentFromStats = createDirentFromStats;

Object.defineProperty(utils$9, "__esModule", { value: true });
utils$9.fs = void 0;
const fs$2 = fs$3;
utils$9.fs = fs$2;

var common$6 = {};

Object.defineProperty(common$6, "__esModule", { value: true });
common$6.joinPathSegments = void 0;
function joinPathSegments$1(a, b, separator) {
    /**
     * The correct handling of cases when the first segment is a root (`/`, `C:/`) or UNC path (`//?/C:/`).
     */
    if (a.endsWith(separator)) {
        return a + b;
    }
    return a + separator + b;
}
common$6.joinPathSegments = joinPathSegments$1;

Object.defineProperty(async$3, "__esModule", { value: true });
async$3.readdir = async$3.readdirWithFileTypes = async$3.read = void 0;
const fsStat$5 = out$1;
const rpl = runParallel_1;
const constants_1$1 = constants;
const utils$8 = utils$9;
const common$5 = common$6;
function read$1(directory, settings, callback) {
    if (!settings.stats && constants_1$1.IS_SUPPORT_READDIR_WITH_FILE_TYPES) {
        readdirWithFileTypes$1(directory, settings, callback);
        return;
    }
    readdir$1(directory, settings, callback);
}
async$3.read = read$1;
function readdirWithFileTypes$1(directory, settings, callback) {
    settings.fs.readdir(directory, { withFileTypes: true }, (readdirError, dirents) => {
        if (readdirError !== null) {
            callFailureCallback$1(callback, readdirError);
            return;
        }
        const entries = dirents.map((dirent) => ({
            dirent,
            name: dirent.name,
            path: common$5.joinPathSegments(directory, dirent.name, settings.pathSegmentSeparator)
        }));
        if (!settings.followSymbolicLinks) {
            callSuccessCallback$1(callback, entries);
            return;
        }
        const tasks = entries.map((entry) => makeRplTaskEntry(entry, settings));
        rpl(tasks, (rplError, rplEntries) => {
            if (rplError !== null) {
                callFailureCallback$1(callback, rplError);
                return;
            }
            callSuccessCallback$1(callback, rplEntries);
        });
    });
}
async$3.readdirWithFileTypes = readdirWithFileTypes$1;
function makeRplTaskEntry(entry, settings) {
    return (done) => {
        if (!entry.dirent.isSymbolicLink()) {
            done(null, entry);
            return;
        }
        settings.fs.stat(entry.path, (statError, stats) => {
            if (statError !== null) {
                if (settings.throwErrorOnBrokenSymbolicLink) {
                    done(statError);
                    return;
                }
                done(null, entry);
                return;
            }
            entry.dirent = utils$8.fs.createDirentFromStats(entry.name, stats);
            done(null, entry);
        });
    };
}
function readdir$1(directory, settings, callback) {
    settings.fs.readdir(directory, (readdirError, names) => {
        if (readdirError !== null) {
            callFailureCallback$1(callback, readdirError);
            return;
        }
        const tasks = names.map((name) => {
            const path = common$5.joinPathSegments(directory, name, settings.pathSegmentSeparator);
            return (done) => {
                fsStat$5.stat(path, settings.fsStatSettings, (error, stats) => {
                    if (error !== null) {
                        done(error);
                        return;
                    }
                    const entry = {
                        name,
                        path,
                        dirent: utils$8.fs.createDirentFromStats(name, stats)
                    };
                    if (settings.stats) {
                        entry.stats = stats;
                    }
                    done(null, entry);
                });
            };
        });
        rpl(tasks, (rplError, entries) => {
            if (rplError !== null) {
                callFailureCallback$1(callback, rplError);
                return;
            }
            callSuccessCallback$1(callback, entries);
        });
    });
}
async$3.readdir = readdir$1;
function callFailureCallback$1(callback, error) {
    callback(error);
}
function callSuccessCallback$1(callback, result) {
    callback(null, result);
}

var sync$5 = {};

Object.defineProperty(sync$5, "__esModule", { value: true });
sync$5.readdir = sync$5.readdirWithFileTypes = sync$5.read = void 0;
const fsStat$4 = out$1;
const constants_1 = constants;
const utils$7 = utils$9;
const common$4 = common$6;
function read(directory, settings) {
    if (!settings.stats && constants_1.IS_SUPPORT_READDIR_WITH_FILE_TYPES) {
        return readdirWithFileTypes(directory, settings);
    }
    return readdir(directory, settings);
}
sync$5.read = read;
function readdirWithFileTypes(directory, settings) {
    const dirents = settings.fs.readdirSync(directory, { withFileTypes: true });
    return dirents.map((dirent) => {
        const entry = {
            dirent,
            name: dirent.name,
            path: common$4.joinPathSegments(directory, dirent.name, settings.pathSegmentSeparator)
        };
        if (entry.dirent.isSymbolicLink() && settings.followSymbolicLinks) {
            try {
                const stats = settings.fs.statSync(entry.path);
                entry.dirent = utils$7.fs.createDirentFromStats(entry.name, stats);
            }
            catch (error) {
                if (settings.throwErrorOnBrokenSymbolicLink) {
                    throw error;
                }
            }
        }
        return entry;
    });
}
sync$5.readdirWithFileTypes = readdirWithFileTypes;
function readdir(directory, settings) {
    const names = settings.fs.readdirSync(directory);
    return names.map((name) => {
        const entryPath = common$4.joinPathSegments(directory, name, settings.pathSegmentSeparator);
        const stats = fsStat$4.statSync(entryPath, settings.fsStatSettings);
        const entry = {
            name,
            path: entryPath,
            dirent: utils$7.fs.createDirentFromStats(name, stats)
        };
        if (settings.stats) {
            entry.stats = stats;
        }
        return entry;
    });
}
sync$5.readdir = readdir;

var settings$2 = {};

var fs$1 = {};

(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createFileSystemAdapter = exports.FILE_SYSTEM_ADAPTER = void 0;
	const fs = $;
	exports.FILE_SYSTEM_ADAPTER = {
	    lstat: fs.lstat,
	    stat: fs.stat,
	    lstatSync: fs.lstatSync,
	    statSync: fs.statSync,
	    readdir: fs.readdir,
	    readdirSync: fs.readdirSync
	};
	function createFileSystemAdapter(fsMethods) {
	    if (fsMethods === undefined) {
	        return exports.FILE_SYSTEM_ADAPTER;
	    }
	    return Object.assign(Object.assign({}, exports.FILE_SYSTEM_ADAPTER), fsMethods);
	}
	exports.createFileSystemAdapter = createFileSystemAdapter; 
} (fs$1));

Object.defineProperty(settings$2, "__esModule", { value: true });
const path$3 = f$1;
const fsStat$3 = out$1;
const fs = fs$1;
let Settings$1 = class Settings {
    constructor(_options = {}) {
        this._options = _options;
        this.followSymbolicLinks = this._getValue(this._options.followSymbolicLinks, false);
        this.fs = fs.createFileSystemAdapter(this._options.fs);
        this.pathSegmentSeparator = this._getValue(this._options.pathSegmentSeparator, path$3.sep);
        this.stats = this._getValue(this._options.stats, false);
        this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, true);
        this.fsStatSettings = new fsStat$3.Settings({
            followSymbolicLink: this.followSymbolicLinks,
            fs: this.fs,
            throwErrorOnBrokenSymbolicLink: this.throwErrorOnBrokenSymbolicLink
        });
    }
    _getValue(option, value) {
        return option !== null && option !== void 0 ? option : value;
    }
};
settings$2.default = Settings$1;

Object.defineProperty(out$2, "__esModule", { value: true });
out$2.Settings = out$2.scandirSync = out$2.scandir = void 0;
const async = async$3;
const sync$4 = sync$5;
const settings_1$2 = settings$2;
out$2.Settings = settings_1$2.default;
function scandir(path, optionsOrSettingsOrCallback, callback) {
    if (typeof optionsOrSettingsOrCallback === 'function') {
        async.read(path, getSettings$1(), optionsOrSettingsOrCallback);
        return;
    }
    async.read(path, getSettings$1(optionsOrSettingsOrCallback), callback);
}
out$2.scandir = scandir;
function scandirSync(path, optionsOrSettings) {
    const settings = getSettings$1(optionsOrSettings);
    return sync$4.read(path, settings);
}
out$2.scandirSync = scandirSync;
function getSettings$1(settingsOrOptions = {}) {
    if (settingsOrOptions instanceof settings_1$2.default) {
        return settingsOrOptions;
    }
    return new settings_1$2.default(settingsOrOptions);
}

var queue = {exports: {}};

function reusify$1 (Constructor) {
  var head = new Constructor();
  var tail = head;

  function get () {
    var current = head;

    if (current.next) {
      head = current.next;
    } else {
      head = new Constructor();
      tail = head;
    }

    current.next = null;

    return current
  }

  function release (obj) {
    tail.next = obj;
    tail = obj;
  }

  return {
    get: get,
    release: release
  }
}

var reusify_1 = reusify$1;

/* eslint-disable no-var */

var reusify = reusify_1;

function fastqueue (context, worker, concurrency) {
  if (typeof context === 'function') {
    concurrency = worker;
    worker = context;
    context = null;
  }

  if (concurrency < 1) {
    throw new Error('fastqueue concurrency must be greater than 1')
  }

  var cache = reusify(Task);
  var queueHead = null;
  var queueTail = null;
  var _running = 0;
  var errorHandler = null;

  var self = {
    push: push,
    drain: noop,
    saturated: noop,
    pause: pause,
    paused: false,
    concurrency: concurrency,
    running: running,
    resume: resume,
    idle: idle,
    length: length,
    getQueue: getQueue,
    unshift: unshift,
    empty: noop,
    kill: kill,
    killAndDrain: killAndDrain,
    error: error
  };

  return self

  function running () {
    return _running
  }

  function pause () {
    self.paused = true;
  }

  function length () {
    var current = queueHead;
    var counter = 0;

    while (current) {
      current = current.next;
      counter++;
    }

    return counter
  }

  function getQueue () {
    var current = queueHead;
    var tasks = [];

    while (current) {
      tasks.push(current.value);
      current = current.next;
    }

    return tasks
  }

  function resume () {
    if (!self.paused) return
    self.paused = false;
    for (var i = 0; i < self.concurrency; i++) {
      _running++;
      release();
    }
  }

  function idle () {
    return _running === 0 && self.length() === 0
  }

  function push (value, done) {
    var current = cache.get();

    current.context = context;
    current.release = release;
    current.value = value;
    current.callback = done || noop;
    current.errorHandler = errorHandler;

    if (_running === self.concurrency || self.paused) {
      if (queueTail) {
        queueTail.next = current;
        queueTail = current;
      } else {
        queueHead = current;
        queueTail = current;
        self.saturated();
      }
    } else {
      _running++;
      worker.call(context, current.value, current.worked);
    }
  }

  function unshift (value, done) {
    var current = cache.get();

    current.context = context;
    current.release = release;
    current.value = value;
    current.callback = done || noop;

    if (_running === self.concurrency || self.paused) {
      if (queueHead) {
        current.next = queueHead;
        queueHead = current;
      } else {
        queueHead = current;
        queueTail = current;
        self.saturated();
      }
    } else {
      _running++;
      worker.call(context, current.value, current.worked);
    }
  }

  function release (holder) {
    if (holder) {
      cache.release(holder);
    }
    var next = queueHead;
    if (next) {
      if (!self.paused) {
        if (queueTail === queueHead) {
          queueTail = null;
        }
        queueHead = next.next;
        next.next = null;
        worker.call(context, next.value, next.worked);
        if (queueTail === null) {
          self.empty();
        }
      } else {
        _running--;
      }
    } else if (--_running === 0) {
      self.drain();
    }
  }

  function kill () {
    queueHead = null;
    queueTail = null;
    self.drain = noop;
  }

  function killAndDrain () {
    queueHead = null;
    queueTail = null;
    self.drain();
    self.drain = noop;
  }

  function error (handler) {
    errorHandler = handler;
  }
}

function noop () {}

function Task () {
  this.value = null;
  this.callback = noop;
  this.next = null;
  this.release = noop;
  this.context = null;
  this.errorHandler = null;

  var self = this;

  this.worked = function worked (err, result) {
    var callback = self.callback;
    var errorHandler = self.errorHandler;
    var val = self.value;
    self.value = null;
    self.callback = noop;
    if (self.errorHandler) {
      errorHandler(err, val);
    }
    callback.call(self.context, err, result);
    self.release(self);
  };
}

function queueAsPromised (context, worker, concurrency) {
  if (typeof context === 'function') {
    concurrency = worker;
    worker = context;
    context = null;
  }

  function asyncWrapper (arg, cb) {
    worker.call(this, arg)
      .then(function (res) {
        cb(null, res);
      }, cb);
  }

  var queue = fastqueue(context, asyncWrapper, concurrency);

  var pushCb = queue.push;
  var unshiftCb = queue.unshift;

  queue.push = push;
  queue.unshift = unshift;
  queue.drained = drained;

  return queue

  function push (value) {
    var p = new Promise(function (resolve, reject) {
      pushCb(value, function (err, result) {
        if (err) {
          reject(err);
          return
        }
        resolve(result);
      });
    });

    // Let's fork the promise chain to
    // make the error bubble up to the user but
    // not lead to a unhandledRejection
    p.catch(noop);

    return p
  }

  function unshift (value) {
    var p = new Promise(function (resolve, reject) {
      unshiftCb(value, function (err, result) {
        if (err) {
          reject(err);
          return
        }
        resolve(result);
      });
    });

    // Let's fork the promise chain to
    // make the error bubble up to the user but
    // not lead to a unhandledRejection
    p.catch(noop);

    return p
  }

  function drained () {
    var previousDrain = queue.drain;

    var p = new Promise(function (resolve) {
      queue.drain = function () {
        previousDrain();
        resolve();
      };
    });

    return p
  }
}

queue.exports = fastqueue;
queue.exports.promise = queueAsPromised;

var queueExports = queue.exports;

var common$3 = {};

Object.defineProperty(common$3, "__esModule", { value: true });
common$3.joinPathSegments = common$3.replacePathSegmentSeparator = common$3.isAppliedFilter = common$3.isFatalError = void 0;
function isFatalError(settings, error) {
    if (settings.errorFilter === null) {
        return true;
    }
    return !settings.errorFilter(error);
}
common$3.isFatalError = isFatalError;
function isAppliedFilter(filter, value) {
    return filter === null || filter(value);
}
common$3.isAppliedFilter = isAppliedFilter;
function replacePathSegmentSeparator(filepath, separator) {
    return filepath.split(/[/\\]/).join(separator);
}
common$3.replacePathSegmentSeparator = replacePathSegmentSeparator;
function joinPathSegments(a, b, separator) {
    if (a === '') {
        return b;
    }
    /**
     * The correct handling of cases when the first segment is a root (`/`, `C:/`) or UNC path (`//?/C:/`).
     */
    if (a.endsWith(separator)) {
        return a + b;
    }
    return a + separator + b;
}
common$3.joinPathSegments = joinPathSegments;

var reader$1 = {};

Object.defineProperty(reader$1, "__esModule", { value: true });
const common$2 = common$3;
let Reader$1 = class Reader {
    constructor(_root, _settings) {
        this._root = _root;
        this._settings = _settings;
        this._root = common$2.replacePathSegmentSeparator(_root, _settings.pathSegmentSeparator);
    }
};
reader$1.default = Reader$1;

Object.defineProperty(async$4, "__esModule", { value: true });
const events_1 = require$$2$1;
const fsScandir$2 = out$2;
const fastq = queueExports;
const common$1 = common$3;
const reader_1$4 = reader$1;
class AsyncReader extends reader_1$4.default {
    constructor(_root, _settings) {
        super(_root, _settings);
        this._settings = _settings;
        this._scandir = fsScandir$2.scandir;
        this._emitter = new events_1.EventEmitter();
        this._queue = fastq(this._worker.bind(this), this._settings.concurrency);
        this._isFatalError = false;
        this._isDestroyed = false;
        this._queue.drain = () => {
            if (!this._isFatalError) {
                this._emitter.emit('end');
            }
        };
    }
    read() {
        this._isFatalError = false;
        this._isDestroyed = false;
        setImmediate(() => {
            this._pushToQueue(this._root, this._settings.basePath);
        });
        return this._emitter;
    }
    get isDestroyed() {
        return this._isDestroyed;
    }
    destroy() {
        if (this._isDestroyed) {
            throw new Error('The reader is already destroyed');
        }
        this._isDestroyed = true;
        this._queue.killAndDrain();
    }
    onEntry(callback) {
        this._emitter.on('entry', callback);
    }
    onError(callback) {
        this._emitter.once('error', callback);
    }
    onEnd(callback) {
        this._emitter.once('end', callback);
    }
    _pushToQueue(directory, base) {
        const queueItem = { directory, base };
        this._queue.push(queueItem, (error) => {
            if (error !== null) {
                this._handleError(error);
            }
        });
    }
    _worker(item, done) {
        this._scandir(item.directory, this._settings.fsScandirSettings, (error, entries) => {
            if (error !== null) {
                done(error, undefined);
                return;
            }
            for (const entry of entries) {
                this._handleEntry(entry, item.base);
            }
            done(null, undefined);
        });
    }
    _handleError(error) {
        if (this._isDestroyed || !common$1.isFatalError(this._settings, error)) {
            return;
        }
        this._isFatalError = true;
        this._isDestroyed = true;
        this._emitter.emit('error', error);
    }
    _handleEntry(entry, base) {
        if (this._isDestroyed || this._isFatalError) {
            return;
        }
        const fullpath = entry.path;
        if (base !== undefined) {
            entry.path = common$1.joinPathSegments(base, entry.name, this._settings.pathSegmentSeparator);
        }
        if (common$1.isAppliedFilter(this._settings.entryFilter, entry)) {
            this._emitEntry(entry);
        }
        if (entry.dirent.isDirectory() && common$1.isAppliedFilter(this._settings.deepFilter, entry)) {
            this._pushToQueue(fullpath, base === undefined ? undefined : entry.path);
        }
    }
    _emitEntry(entry) {
        this._emitter.emit('entry', entry);
    }
}
async$4.default = AsyncReader;

Object.defineProperty(async$5, "__esModule", { value: true });
const async_1$4 = async$4;
class AsyncProvider {
    constructor(_root, _settings) {
        this._root = _root;
        this._settings = _settings;
        this._reader = new async_1$4.default(this._root, this._settings);
        this._storage = [];
    }
    read(callback) {
        this._reader.onError((error) => {
            callFailureCallback(callback, error);
        });
        this._reader.onEntry((entry) => {
            this._storage.push(entry);
        });
        this._reader.onEnd(() => {
            callSuccessCallback(callback, this._storage);
        });
        this._reader.read();
    }
}
async$5.default = AsyncProvider;
function callFailureCallback(callback, error) {
    callback(error);
}
function callSuccessCallback(callback, entries) {
    callback(null, entries);
}

var stream$2 = {};

Object.defineProperty(stream$2, "__esModule", { value: true });
const stream_1$5 = require$$0$1;
const async_1$3 = async$4;
class StreamProvider {
    constructor(_root, _settings) {
        this._root = _root;
        this._settings = _settings;
        this._reader = new async_1$3.default(this._root, this._settings);
        this._stream = new stream_1$5.Readable({
            objectMode: true,
            read: () => { },
            destroy: () => {
                if (!this._reader.isDestroyed) {
                    this._reader.destroy();
                }
            }
        });
    }
    read() {
        this._reader.onError((error) => {
            this._stream.emit('error', error);
        });
        this._reader.onEntry((entry) => {
            this._stream.push(entry);
        });
        this._reader.onEnd(() => {
            this._stream.push(null);
        });
        this._reader.read();
        return this._stream;
    }
}
stream$2.default = StreamProvider;

var sync$3 = {};

var sync$2 = {};

Object.defineProperty(sync$2, "__esModule", { value: true });
const fsScandir$1 = out$2;
const common = common$3;
const reader_1$3 = reader$1;
class SyncReader extends reader_1$3.default {
    constructor() {
        super(...arguments);
        this._scandir = fsScandir$1.scandirSync;
        this._storage = [];
        this._queue = new Set();
    }
    read() {
        this._pushToQueue(this._root, this._settings.basePath);
        this._handleQueue();
        return this._storage;
    }
    _pushToQueue(directory, base) {
        this._queue.add({ directory, base });
    }
    _handleQueue() {
        for (const item of this._queue.values()) {
            this._handleDirectory(item.directory, item.base);
        }
    }
    _handleDirectory(directory, base) {
        try {
            const entries = this._scandir(directory, this._settings.fsScandirSettings);
            for (const entry of entries) {
                this._handleEntry(entry, base);
            }
        }
        catch (error) {
            this._handleError(error);
        }
    }
    _handleError(error) {
        if (!common.isFatalError(this._settings, error)) {
            return;
        }
        throw error;
    }
    _handleEntry(entry, base) {
        const fullpath = entry.path;
        if (base !== undefined) {
            entry.path = common.joinPathSegments(base, entry.name, this._settings.pathSegmentSeparator);
        }
        if (common.isAppliedFilter(this._settings.entryFilter, entry)) {
            this._pushToStorage(entry);
        }
        if (entry.dirent.isDirectory() && common.isAppliedFilter(this._settings.deepFilter, entry)) {
            this._pushToQueue(fullpath, base === undefined ? undefined : entry.path);
        }
    }
    _pushToStorage(entry) {
        this._storage.push(entry);
    }
}
sync$2.default = SyncReader;

Object.defineProperty(sync$3, "__esModule", { value: true });
const sync_1$3 = sync$2;
class SyncProvider {
    constructor(_root, _settings) {
        this._root = _root;
        this._settings = _settings;
        this._reader = new sync_1$3.default(this._root, this._settings);
    }
    read() {
        return this._reader.read();
    }
}
sync$3.default = SyncProvider;

var settings$1 = {};

Object.defineProperty(settings$1, "__esModule", { value: true });
const path$2 = f$1;
const fsScandir = out$2;
class Settings {
    constructor(_options = {}) {
        this._options = _options;
        this.basePath = this._getValue(this._options.basePath, undefined);
        this.concurrency = this._getValue(this._options.concurrency, Number.POSITIVE_INFINITY);
        this.deepFilter = this._getValue(this._options.deepFilter, null);
        this.entryFilter = this._getValue(this._options.entryFilter, null);
        this.errorFilter = this._getValue(this._options.errorFilter, null);
        this.pathSegmentSeparator = this._getValue(this._options.pathSegmentSeparator, path$2.sep);
        this.fsScandirSettings = new fsScandir.Settings({
            followSymbolicLinks: this._options.followSymbolicLinks,
            fs: this._options.fs,
            pathSegmentSeparator: this._options.pathSegmentSeparator,
            stats: this._options.stats,
            throwErrorOnBrokenSymbolicLink: this._options.throwErrorOnBrokenSymbolicLink
        });
    }
    _getValue(option, value) {
        return option !== null && option !== void 0 ? option : value;
    }
}
settings$1.default = Settings;

Object.defineProperty(out$3, "__esModule", { value: true });
out$3.Settings = out$3.walkStream = out$3.walkSync = out$3.walk = void 0;
const async_1$2 = async$5;
const stream_1$4 = stream$2;
const sync_1$2 = sync$3;
const settings_1$1 = settings$1;
out$3.Settings = settings_1$1.default;
function walk(directory, optionsOrSettingsOrCallback, callback) {
    if (typeof optionsOrSettingsOrCallback === 'function') {
        new async_1$2.default(directory, getSettings()).read(optionsOrSettingsOrCallback);
        return;
    }
    new async_1$2.default(directory, getSettings(optionsOrSettingsOrCallback)).read(callback);
}
out$3.walk = walk;
function walkSync(directory, optionsOrSettings) {
    const settings = getSettings(optionsOrSettings);
    const provider = new sync_1$2.default(directory, settings);
    return provider.read();
}
out$3.walkSync = walkSync;
function walkStream(directory, optionsOrSettings) {
    const settings = getSettings(optionsOrSettings);
    const provider = new stream_1$4.default(directory, settings);
    return provider.read();
}
out$3.walkStream = walkStream;
function getSettings(settingsOrOptions = {}) {
    if (settingsOrOptions instanceof settings_1$1.default) {
        return settingsOrOptions;
    }
    return new settings_1$1.default(settingsOrOptions);
}

var reader = {};

Object.defineProperty(reader, "__esModule", { value: true });
const path$1 = f$1;
const fsStat$2 = out$1;
const utils$6 = utils$k;
class Reader {
    constructor(_settings) {
        this._settings = _settings;
        this._fsStatSettings = new fsStat$2.Settings({
            followSymbolicLink: this._settings.followSymbolicLinks,
            fs: this._settings.fs,
            throwErrorOnBrokenSymbolicLink: this._settings.followSymbolicLinks
        });
    }
    _getFullEntryPath(filepath) {
        return path$1.resolve(this._settings.cwd, filepath);
    }
    _makeEntry(stats, pattern) {
        const entry = {
            name: pattern,
            path: pattern,
            dirent: utils$6.fs.createDirentFromStats(pattern, stats)
        };
        if (this._settings.stats) {
            entry.stats = stats;
        }
        return entry;
    }
    _isFatalError(error) {
        return !utils$6.errno.isEnoentCodeError(error) && !this._settings.suppressErrors;
    }
}
reader.default = Reader;

var stream$1 = {};

Object.defineProperty(stream$1, "__esModule", { value: true });
const stream_1$3 = require$$0$1;
const fsStat$1 = out$1;
const fsWalk$2 = out$3;
const reader_1$2 = reader;
class ReaderStream extends reader_1$2.default {
    constructor() {
        super(...arguments);
        this._walkStream = fsWalk$2.walkStream;
        this._stat = fsStat$1.stat;
    }
    dynamic(root, options) {
        return this._walkStream(root, options);
    }
    static(patterns, options) {
        const filepaths = patterns.map(this._getFullEntryPath, this);
        const stream = new stream_1$3.PassThrough({ objectMode: true });
        stream._write = (index, _enc, done) => {
            return this._getEntry(filepaths[index], patterns[index], options)
                .then((entry) => {
                if (entry !== null && options.entryFilter(entry)) {
                    stream.push(entry);
                }
                if (index === filepaths.length - 1) {
                    stream.end();
                }
                done();
            })
                .catch(done);
        };
        for (let i = 0; i < filepaths.length; i++) {
            stream.write(i);
        }
        return stream;
    }
    _getEntry(filepath, pattern, options) {
        return this._getStat(filepath)
            .then((stats) => this._makeEntry(stats, pattern))
            .catch((error) => {
            if (options.errorFilter(error)) {
                return null;
            }
            throw error;
        });
    }
    _getStat(filepath) {
        return new Promise((resolve, reject) => {
            this._stat(filepath, this._fsStatSettings, (error, stats) => {
                return error === null ? resolve(stats) : reject(error);
            });
        });
    }
}
stream$1.default = ReaderStream;

Object.defineProperty(async$6, "__esModule", { value: true });
const fsWalk$1 = out$3;
const reader_1$1 = reader;
const stream_1$2 = stream$1;
class ReaderAsync extends reader_1$1.default {
    constructor() {
        super(...arguments);
        this._walkAsync = fsWalk$1.walk;
        this._readerStream = new stream_1$2.default(this._settings);
    }
    dynamic(root, options) {
        return new Promise((resolve, reject) => {
            this._walkAsync(root, options, (error, entries) => {
                if (error === null) {
                    resolve(entries);
                }
                else {
                    reject(error);
                }
            });
        });
    }
    async static(patterns, options) {
        const entries = [];
        const stream = this._readerStream.static(patterns, options);
        // After #235, replace it with an asynchronous iterator.
        return new Promise((resolve, reject) => {
            stream.once('error', reject);
            stream.on('data', (entry) => entries.push(entry));
            stream.once('end', () => resolve(entries));
        });
    }
}
async$6.default = ReaderAsync;

var provider = {};

var deep = {};

var partial = {};

var matcher = {};

Object.defineProperty(matcher, "__esModule", { value: true });
const utils$5 = utils$k;
class Matcher {
    constructor(_patterns, _settings, _micromatchOptions) {
        this._patterns = _patterns;
        this._settings = _settings;
        this._micromatchOptions = _micromatchOptions;
        this._storage = [];
        this._fillStorage();
    }
    _fillStorage() {
        for (const pattern of this._patterns) {
            const segments = this._getPatternSegments(pattern);
            const sections = this._splitSegmentsIntoSections(segments);
            this._storage.push({
                complete: sections.length <= 1,
                pattern,
                segments,
                sections
            });
        }
    }
    _getPatternSegments(pattern) {
        const parts = utils$5.pattern.getPatternParts(pattern, this._micromatchOptions);
        return parts.map((part) => {
            const dynamic = utils$5.pattern.isDynamicPattern(part, this._settings);
            if (!dynamic) {
                return {
                    dynamic: false,
                    pattern: part
                };
            }
            return {
                dynamic: true,
                pattern: part,
                patternRe: utils$5.pattern.makeRe(part, this._micromatchOptions)
            };
        });
    }
    _splitSegmentsIntoSections(segments) {
        return utils$5.array.splitWhen(segments, (segment) => segment.dynamic && utils$5.pattern.hasGlobStar(segment.pattern));
    }
}
matcher.default = Matcher;

Object.defineProperty(partial, "__esModule", { value: true });
const matcher_1 = matcher;
class PartialMatcher extends matcher_1.default {
    match(filepath) {
        const parts = filepath.split('/');
        const levels = parts.length;
        const patterns = this._storage.filter((info) => !info.complete || info.segments.length > levels);
        for (const pattern of patterns) {
            const section = pattern.sections[0];
            /**
             * In this case, the pattern has a globstar and we must read all directories unconditionally,
             * but only if the level has reached the end of the first group.
             *
             * fixtures/{a,b}/**
             *  ^ true/false  ^ always true
            */
            if (!pattern.complete && levels > section.length) {
                return true;
            }
            const match = parts.every((part, index) => {
                const segment = pattern.segments[index];
                if (segment.dynamic && segment.patternRe.test(part)) {
                    return true;
                }
                if (!segment.dynamic && segment.pattern === part) {
                    return true;
                }
                return false;
            });
            if (match) {
                return true;
            }
        }
        return false;
    }
}
partial.default = PartialMatcher;

Object.defineProperty(deep, "__esModule", { value: true });
const utils$4 = utils$k;
const partial_1 = partial;
class DeepFilter {
    constructor(_settings, _micromatchOptions) {
        this._settings = _settings;
        this._micromatchOptions = _micromatchOptions;
    }
    getFilter(basePath, positive, negative) {
        const matcher = this._getMatcher(positive);
        const negativeRe = this._getNegativePatternsRe(negative);
        return (entry) => this._filter(basePath, entry, matcher, negativeRe);
    }
    _getMatcher(patterns) {
        return new partial_1.default(patterns, this._settings, this._micromatchOptions);
    }
    _getNegativePatternsRe(patterns) {
        const affectDepthOfReadingPatterns = patterns.filter(utils$4.pattern.isAffectDepthOfReadingPattern);
        return utils$4.pattern.convertPatternsToRe(affectDepthOfReadingPatterns, this._micromatchOptions);
    }
    _filter(basePath, entry, matcher, negativeRe) {
        if (this._isSkippedByDeep(basePath, entry.path)) {
            return false;
        }
        if (this._isSkippedSymbolicLink(entry)) {
            return false;
        }
        const filepath = utils$4.path.removeLeadingDotSegment(entry.path);
        if (this._isSkippedByPositivePatterns(filepath, matcher)) {
            return false;
        }
        return this._isSkippedByNegativePatterns(filepath, negativeRe);
    }
    _isSkippedByDeep(basePath, entryPath) {
        /**
         * Avoid unnecessary depth calculations when it doesn't matter.
         */
        if (this._settings.deep === Infinity) {
            return false;
        }
        return this._getEntryLevel(basePath, entryPath) >= this._settings.deep;
    }
    _getEntryLevel(basePath, entryPath) {
        const entryPathDepth = entryPath.split('/').length;
        if (basePath === '') {
            return entryPathDepth;
        }
        const basePathDepth = basePath.split('/').length;
        return entryPathDepth - basePathDepth;
    }
    _isSkippedSymbolicLink(entry) {
        return !this._settings.followSymbolicLinks && entry.dirent.isSymbolicLink();
    }
    _isSkippedByPositivePatterns(entryPath, matcher) {
        return !this._settings.baseNameMatch && !matcher.match(entryPath);
    }
    _isSkippedByNegativePatterns(entryPath, patternsRe) {
        return !utils$4.pattern.matchAny(entryPath, patternsRe);
    }
}
deep.default = DeepFilter;

var entry$1 = {};

Object.defineProperty(entry$1, "__esModule", { value: true });
const utils$3 = utils$k;
class EntryFilter {
    constructor(_settings, _micromatchOptions) {
        this._settings = _settings;
        this._micromatchOptions = _micromatchOptions;
        this.index = new Map();
    }
    getFilter(positive, negative) {
        const positiveRe = utils$3.pattern.convertPatternsToRe(positive, this._micromatchOptions);
        const negativeRe = utils$3.pattern.convertPatternsToRe(negative, Object.assign(Object.assign({}, this._micromatchOptions), { dot: true }));
        return (entry) => this._filter(entry, positiveRe, negativeRe);
    }
    _filter(entry, positiveRe, negativeRe) {
        const filepath = utils$3.path.removeLeadingDotSegment(entry.path);
        if (this._settings.unique && this._isDuplicateEntry(filepath)) {
            return false;
        }
        if (this._onlyFileFilter(entry) || this._onlyDirectoryFilter(entry)) {
            return false;
        }
        if (this._isSkippedByAbsoluteNegativePatterns(filepath, negativeRe)) {
            return false;
        }
        const isDirectory = entry.dirent.isDirectory();
        const isMatched = this._isMatchToPatterns(filepath, positiveRe, isDirectory) && !this._isMatchToPatterns(filepath, negativeRe, isDirectory);
        if (this._settings.unique && isMatched) {
            this._createIndexRecord(filepath);
        }
        return isMatched;
    }
    _isDuplicateEntry(filepath) {
        return this.index.has(filepath);
    }
    _createIndexRecord(filepath) {
        this.index.set(filepath, undefined);
    }
    _onlyFileFilter(entry) {
        return this._settings.onlyFiles && !entry.dirent.isFile();
    }
    _onlyDirectoryFilter(entry) {
        return this._settings.onlyDirectories && !entry.dirent.isDirectory();
    }
    _isSkippedByAbsoluteNegativePatterns(entryPath, patternsRe) {
        if (!this._settings.absolute) {
            return false;
        }
        const fullpath = utils$3.path.makeAbsolute(this._settings.cwd, entryPath);
        return utils$3.pattern.matchAny(fullpath, patternsRe);
    }
    _isMatchToPatterns(filepath, patternsRe, isDirectory) {
        // Trying to match files and directories by patterns.
        const isMatched = utils$3.pattern.matchAny(filepath, patternsRe);
        // A pattern with a trailling slash can be used for directory matching.
        // To apply such pattern, we need to add a tralling slash to the path.
        if (!isMatched && isDirectory) {
            return utils$3.pattern.matchAny(filepath + '/', patternsRe);
        }
        return isMatched;
    }
}
entry$1.default = EntryFilter;

var error = {};

Object.defineProperty(error, "__esModule", { value: true });
const utils$2 = utils$k;
class ErrorFilter {
    constructor(_settings) {
        this._settings = _settings;
    }
    getFilter() {
        return (error) => this._isNonFatalError(error);
    }
    _isNonFatalError(error) {
        return utils$2.errno.isEnoentCodeError(error) || this._settings.suppressErrors;
    }
}
error.default = ErrorFilter;

var entry = {};

Object.defineProperty(entry, "__esModule", { value: true });
const utils$1 = utils$k;
class EntryTransformer {
    constructor(_settings) {
        this._settings = _settings;
    }
    getTransformer() {
        return (entry) => this._transform(entry);
    }
    _transform(entry) {
        let filepath = entry.path;
        if (this._settings.absolute) {
            filepath = utils$1.path.makeAbsolute(this._settings.cwd, filepath);
            filepath = utils$1.path.unixify(filepath);
        }
        if (this._settings.markDirectories && entry.dirent.isDirectory()) {
            filepath += '/';
        }
        if (!this._settings.objectMode) {
            return filepath;
        }
        return Object.assign(Object.assign({}, entry), { path: filepath });
    }
}
entry.default = EntryTransformer;

Object.defineProperty(provider, "__esModule", { value: true });
const path = f$1;
const deep_1 = deep;
const entry_1 = entry$1;
const error_1 = error;
const entry_2 = entry;
class Provider {
    constructor(_settings) {
        this._settings = _settings;
        this.errorFilter = new error_1.default(this._settings);
        this.entryFilter = new entry_1.default(this._settings, this._getMicromatchOptions());
        this.deepFilter = new deep_1.default(this._settings, this._getMicromatchOptions());
        this.entryTransformer = new entry_2.default(this._settings);
    }
    _getRootDirectory(task) {
        return path.resolve(this._settings.cwd, task.base);
    }
    _getReaderOptions(task) {
        const basePath = task.base === '.' ? '' : task.base;
        return {
            basePath,
            pathSegmentSeparator: '/',
            concurrency: this._settings.concurrency,
            deepFilter: this.deepFilter.getFilter(basePath, task.positive, task.negative),
            entryFilter: this.entryFilter.getFilter(task.positive, task.negative),
            errorFilter: this.errorFilter.getFilter(),
            followSymbolicLinks: this._settings.followSymbolicLinks,
            fs: this._settings.fs,
            stats: this._settings.stats,
            throwErrorOnBrokenSymbolicLink: this._settings.throwErrorOnBrokenSymbolicLink,
            transform: this.entryTransformer.getTransformer()
        };
    }
    _getMicromatchOptions() {
        return {
            dot: this._settings.dot,
            matchBase: this._settings.baseNameMatch,
            nobrace: !this._settings.braceExpansion,
            nocase: !this._settings.caseSensitiveMatch,
            noext: !this._settings.extglob,
            noglobstar: !this._settings.globstar,
            posix: true,
            strictSlashes: false
        };
    }
}
provider.default = Provider;

Object.defineProperty(async$7, "__esModule", { value: true });
const async_1$1 = async$6;
const provider_1$2 = provider;
class ProviderAsync extends provider_1$2.default {
    constructor() {
        super(...arguments);
        this._reader = new async_1$1.default(this._settings);
    }
    async read(task) {
        const root = this._getRootDirectory(task);
        const options = this._getReaderOptions(task);
        const entries = await this.api(root, task, options);
        return entries.map((entry) => options.transform(entry));
    }
    api(root, task, options) {
        if (task.dynamic) {
            return this._reader.dynamic(root, options);
        }
        return this._reader.static(task.patterns, options);
    }
}
async$7.default = ProviderAsync;

var stream = {};

Object.defineProperty(stream, "__esModule", { value: true });
const stream_1$1 = require$$0$1;
const stream_2 = stream$1;
const provider_1$1 = provider;
class ProviderStream extends provider_1$1.default {
    constructor() {
        super(...arguments);
        this._reader = new stream_2.default(this._settings);
    }
    read(task) {
        const root = this._getRootDirectory(task);
        const options = this._getReaderOptions(task);
        const source = this.api(root, task, options);
        const destination = new stream_1$1.Readable({ objectMode: true, read: () => { } });
        source
            .once('error', (error) => destination.emit('error', error))
            .on('data', (entry) => destination.emit('data', options.transform(entry)))
            .once('end', () => destination.emit('end'));
        destination
            .once('close', () => source.destroy());
        return destination;
    }
    api(root, task, options) {
        if (task.dynamic) {
            return this._reader.dynamic(root, options);
        }
        return this._reader.static(task.patterns, options);
    }
}
stream.default = ProviderStream;

var sync$1 = {};

var sync = {};

Object.defineProperty(sync, "__esModule", { value: true });
const fsStat = out$1;
const fsWalk = out$3;
const reader_1 = reader;
class ReaderSync extends reader_1.default {
    constructor() {
        super(...arguments);
        this._walkSync = fsWalk.walkSync;
        this._statSync = fsStat.statSync;
    }
    dynamic(root, options) {
        return this._walkSync(root, options);
    }
    static(patterns, options) {
        const entries = [];
        for (const pattern of patterns) {
            const filepath = this._getFullEntryPath(pattern);
            const entry = this._getEntry(filepath, pattern, options);
            if (entry === null || !options.entryFilter(entry)) {
                continue;
            }
            entries.push(entry);
        }
        return entries;
    }
    _getEntry(filepath, pattern, options) {
        try {
            const stats = this._getStat(filepath);
            return this._makeEntry(stats, pattern);
        }
        catch (error) {
            if (options.errorFilter(error)) {
                return null;
            }
            throw error;
        }
    }
    _getStat(filepath) {
        return this._statSync(filepath, this._fsStatSettings);
    }
}
sync.default = ReaderSync;

Object.defineProperty(sync$1, "__esModule", { value: true });
const sync_1$1 = sync;
const provider_1 = provider;
class ProviderSync extends provider_1.default {
    constructor() {
        super(...arguments);
        this._reader = new sync_1$1.default(this._settings);
    }
    read(task) {
        const root = this._getRootDirectory(task);
        const options = this._getReaderOptions(task);
        const entries = this.api(root, task, options);
        return entries.map(options.transform);
    }
    api(root, task, options) {
        if (task.dynamic) {
            return this._reader.dynamic(root, options);
        }
        return this._reader.static(task.patterns, options);
    }
}
sync$1.default = ProviderSync;

var settings = {};

(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DEFAULT_FILE_SYSTEM_ADAPTER = void 0;
	const fs = $;
	const os = require$$0;
	/**
	 * The `os.cpus` method can return zero. We expect the number of cores to be greater than zero.
	 * https://github.com/nodejs/node/blob/7faeddf23a98c53896f8b574a6e66589e8fb1eb8/lib/os.js#L106-L107
	 */
	const CPU_COUNT = Math.max(os.cpus().length, 1);
	exports.DEFAULT_FILE_SYSTEM_ADAPTER = {
	    lstat: fs.lstat,
	    lstatSync: fs.lstatSync,
	    stat: fs.stat,
	    statSync: fs.statSync,
	    readdir: fs.readdir,
	    readdirSync: fs.readdirSync
	};
	class Settings {
	    constructor(_options = {}) {
	        this._options = _options;
	        this.absolute = this._getValue(this._options.absolute, false);
	        this.baseNameMatch = this._getValue(this._options.baseNameMatch, false);
	        this.braceExpansion = this._getValue(this._options.braceExpansion, true);
	        this.caseSensitiveMatch = this._getValue(this._options.caseSensitiveMatch, true);
	        this.concurrency = this._getValue(this._options.concurrency, CPU_COUNT);
	        this.cwd = this._getValue(this._options.cwd, process.cwd());
	        this.deep = this._getValue(this._options.deep, Infinity);
	        this.dot = this._getValue(this._options.dot, false);
	        this.extglob = this._getValue(this._options.extglob, true);
	        this.followSymbolicLinks = this._getValue(this._options.followSymbolicLinks, true);
	        this.fs = this._getFileSystemMethods(this._options.fs);
	        this.globstar = this._getValue(this._options.globstar, true);
	        this.ignore = this._getValue(this._options.ignore, []);
	        this.markDirectories = this._getValue(this._options.markDirectories, false);
	        this.objectMode = this._getValue(this._options.objectMode, false);
	        this.onlyDirectories = this._getValue(this._options.onlyDirectories, false);
	        this.onlyFiles = this._getValue(this._options.onlyFiles, true);
	        this.stats = this._getValue(this._options.stats, false);
	        this.suppressErrors = this._getValue(this._options.suppressErrors, false);
	        this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, false);
	        this.unique = this._getValue(this._options.unique, true);
	        if (this.onlyDirectories) {
	            this.onlyFiles = false;
	        }
	        if (this.stats) {
	            this.objectMode = true;
	        }
	    }
	    _getValue(option, value) {
	        return option === undefined ? value : option;
	    }
	    _getFileSystemMethods(methods = {}) {
	        return Object.assign(Object.assign({}, exports.DEFAULT_FILE_SYSTEM_ADAPTER), methods);
	    }
	}
	exports.default = Settings; 
} (settings));

const taskManager = tasks;
const async_1 = async$7;
const stream_1 = stream;
const sync_1 = sync$1;
const settings_1 = settings;
const utils = utils$k;
async function FastGlob(source, options) {
    assertPatternsInput(source);
    const works = getWorks(source, async_1.default, options);
    const result = await Promise.all(works);
    return utils.array.flatten(result);
}
// https://github.com/typescript-eslint/typescript-eslint/issues/60
// eslint-disable-next-line no-redeclare
(function (FastGlob) {
    FastGlob.glob = FastGlob;
    FastGlob.globSync = sync;
    FastGlob.globStream = stream;
    FastGlob.async = FastGlob;
    function sync(source, options) {
        assertPatternsInput(source);
        const works = getWorks(source, sync_1.default, options);
        return utils.array.flatten(works);
    }
    FastGlob.sync = sync;
    function stream(source, options) {
        assertPatternsInput(source);
        const works = getWorks(source, stream_1.default, options);
        /**
         * The stream returned by the provider cannot work with an asynchronous iterator.
         * To support asynchronous iterators, regardless of the number of tasks, we always multiplex streams.
         * This affects performance (+25%). I don't see best solution right now.
         */
        return utils.stream.merge(works);
    }
    FastGlob.stream = stream;
    function generateTasks(source, options) {
        assertPatternsInput(source);
        const patterns = [].concat(source);
        const settings = new settings_1.default(options);
        return taskManager.generate(patterns, settings);
    }
    FastGlob.generateTasks = generateTasks;
    function isDynamicPattern(source, options) {
        assertPatternsInput(source);
        const settings = new settings_1.default(options);
        return utils.pattern.isDynamicPattern(source, settings);
    }
    FastGlob.isDynamicPattern = isDynamicPattern;
    function escapePath(source) {
        assertPatternsInput(source);
        return utils.path.escape(source);
    }
    FastGlob.escapePath = escapePath;
    function convertPathToPattern(source) {
        assertPatternsInput(source);
        return utils.path.convertPathToPattern(source);
    }
    FastGlob.convertPathToPattern = convertPathToPattern;
    (function (posix) {
        function escapePath(source) {
            assertPatternsInput(source);
            return utils.path.escapePosixPath(source);
        }
        posix.escapePath = escapePath;
        function convertPathToPattern(source) {
            assertPatternsInput(source);
            return utils.path.convertPosixPathToPattern(source);
        }
        posix.convertPathToPattern = convertPathToPattern;
    })(FastGlob.posix || (FastGlob.posix = {}));
    (function (win32) {
        function escapePath(source) {
            assertPatternsInput(source);
            return utils.path.escapeWindowsPath(source);
        }
        win32.escapePath = escapePath;
        function convertPathToPattern(source) {
            assertPatternsInput(source);
            return utils.path.convertWindowsPathToPattern(source);
        }
        win32.convertPathToPattern = convertPathToPattern;
    })(FastGlob.win32 || (FastGlob.win32 = {}));
})(FastGlob || (FastGlob = {}));
function getWorks(source, _Provider, options) {
    const patterns = [].concat(source);
    const settings = new settings_1.default(options);
    const tasks = taskManager.generate(patterns, settings);
    const provider = new _Provider(settings);
    return tasks.map(provider.read, provider);
}
function assertPatternsInput(input) {
    const source = [].concat(input);
    const isValidSource = source.every((item) => utils.string.isString(item) && !utils.string.isEmpty(item));
    if (!isValidSource) {
        throw new TypeError('Patterns must be a string (non empty) or an array of strings');
    }
}
var out = FastGlob;

var fg = /*@__PURE__*/getDefaultExportFromCjs(out);

const envsOrder = [
  "node",
  "jsdom",
  "happy-dom",
  "edge-runtime"
];
function getTransformMode(patterns, filename) {
  if (patterns.web && mm.isMatch(filename, patterns.web))
    return "web";
  if (patterns.ssr && mm.isMatch(filename, patterns.ssr))
    return "ssr";
  return void 0;
}
async function groupFilesByEnv(files) {
  const filesWithEnv = await Promise.all(files.map(async ([project, file]) => {
    var _a, _b;
    const code = await promises.readFile(file, "utf-8");
    let env = (_a = code.match(/@(?:vitest|jest)-environment\s+?([\w-]+)\b/)) == null ? void 0 : _a[1];
    if (!env) {
      for (const [glob, target] of project.config.environmentMatchGlobs || []) {
        if (mm.isMatch(file, glob, { cwd: project.config.root })) {
          env = target;
          break;
        }
      }
    }
    env || (env = project.config.environment || "node");
    const transformMode = getTransformMode(project.config.testTransformMode, file);
    const envOptions = JSON.parse(((_b = code.match(/@(?:vitest|jest)-environment-options\s+?(.+)/)) == null ? void 0 : _b[1]) || "null");
    return {
      file,
      project,
      environment: {
        name: env,
        transformMode,
        options: envOptions ? { [env]: envOptions } : null
      }
    };
  }));
  return groupBy(filesWithEnv, ({ environment }) => environment.name);
}

function createMethodsRPC(project) {
  const ctx = project.ctx;
  return {
    async onWorkerExit(error, code) {
      await ctx.logger.printError(error, { type: "Unexpected Exit" });
      process.exit(code || 1);
    },
    snapshotSaved(snapshot) {
      ctx.snapshot.add(snapshot);
    },
    resolveSnapshotPath(testPath) {
      return ctx.snapshot.resolvePath(testPath);
    },
    async getSourceMap(id, force) {
      if (force) {
        const mod = project.server.moduleGraph.getModuleById(id);
        if (mod)
          project.server.moduleGraph.invalidateModule(mod);
      }
      const r = await project.vitenode.transformRequest(id);
      return r == null ? void 0 : r.map;
    },
    fetch(id, transformMode) {
      return project.vitenode.fetchModule(id, transformMode);
    },
    resolveId(id, importer, transformMode) {
      return project.vitenode.resolveId(id, importer, transformMode);
    },
    onPathsCollected(paths) {
      ctx.state.collectPaths(paths);
      project.report("onPathsCollected", paths);
    },
    onCollected(files) {
      ctx.state.collectFiles(files);
      project.report("onCollected", files);
    },
    onAfterSuiteRun(meta) {
      var _a;
      (_a = ctx.coverageProvider) == null ? void 0 : _a.onAfterSuiteRun(meta);
    },
    onTaskUpdate(packs) {
      ctx.state.updateTasks(packs);
      project.report("onTaskUpdate", packs);
    },
    onUserConsoleLog(log) {
      ctx.state.updateUserLog(log);
      project.report("onUserConsoleLog", log);
    },
    onUnhandledError(err, type) {
      ctx.state.catchError(err, type);
    },
    onFinished(files) {
      project.report("onFinished", files, ctx.state.getUnhandledErrors());
    },
    onCancel(reason) {
      ctx.cancelCurrentRun(reason);
    },
    getCountOfFailedTests() {
      return ctx.state.getCountOfFailedTests();
    }
  };
}

const childPath = fileURLToPath(pathToFileURL(resolve(distDir, "./child.js")).href);
function setupChildProcessChannel(project, fork2) {
  const rpc = createBirpc(
    createMethodsRPC(project),
    {
      eventNames: ["onCancel"],
      serialize: v8.serialize,
      deserialize: (v) => v8.deserialize(Buffer.from(v)),
      post(v) {
        fork2.send(v);
      },
      on(fn) {
        fork2.on("message", fn);
      }
    }
  );
  project.ctx.onCancel((reason) => rpc.onCancel(reason));
}
function stringifyRegex(input) {
  if (typeof input === "string")
    return input;
  return `$$vitest:${input.toString()}`;
}
function getTestConfig(ctx) {
  const config = ctx.getSerializableConfig();
  return {
    ...config,
    testNamePattern: config.testNamePattern ? stringifyRegex(config.testNamePattern) : void 0
  };
}
function createChildProcessPool(ctx, { execArgv, env }) {
  const children = /* @__PURE__ */ new Set();
  const Sequencer = ctx.config.sequence.sequencer;
  const sequencer = new Sequencer(ctx);
  function runFiles(project, files, environment, invalidates = []) {
    const config = getTestConfig(project);
    ctx.state.clearFiles(project, files);
    const data = {
      command: "start",
      config,
      files,
      invalidates,
      environment
    };
    const child = fork(childPath, [], {
      execArgv,
      env
      // TODO: investigate
      // serialization: 'advanced',
    });
    children.add(child);
    setupChildProcessChannel(project, child);
    return new Promise((resolve2, reject) => {
      child.send(data, (err) => {
        if (err)
          reject(err);
      });
      child.on("close", (code) => {
        if (!code)
          resolve2();
        else
          reject(new Error(`Child process exited unexpectedly with code ${code}`));
        children.delete(child);
      });
    });
  }
  async function runTests(specs, invalidates = []) {
    const { shard } = ctx.config;
    if (shard)
      specs = await sequencer.shard(specs);
    specs = await sequencer.sort(specs);
    const filesByEnv = await groupFilesByEnv(specs);
    const envs = envsOrder.concat(
      Object.keys(filesByEnv).filter((env2) => !envsOrder.includes(env2))
    );
    for (const env2 of envs) {
      const files = filesByEnv[env2];
      if (!(files == null ? void 0 : files.length))
        continue;
      const filesByOptions = groupBy(files, ({ project, environment }) => project.getName() + JSON.stringify(environment.options) + environment.transformMode);
      for (const option in filesByOptions) {
        const files2 = filesByOptions[option];
        if (files2 == null ? void 0 : files2.length) {
          const filenames = files2.map((f) => f.file);
          await runFiles(files2[0].project, filenames, files2[0].environment, invalidates);
        }
      }
    }
  }
  return {
    runTests,
    async close() {
      children.forEach((child) => {
        if (!child.killed)
          child.kill();
      });
      children.clear();
    }
  };
}

const workerPath$1 = pathToFileURL(resolve(distDir, "./worker.js")).href;
function createWorkerChannel$1(project) {
  const channel = new MessageChannel();
  const port = channel.port2;
  const workerPort = channel.port1;
  const rpc = createBirpc(
    createMethodsRPC(project),
    {
      eventNames: ["onCancel"],
      post(v) {
        port.postMessage(v);
      },
      on(fn) {
        port.on("message", fn);
      }
    }
  );
  project.ctx.onCancel((reason) => rpc.onCancel(reason));
  return { workerPort, port };
}
function createThreadsPool(ctx, { execArgv, env }) {
  const threadsCount = ctx.config.watch ? Math.max(Math.floor(cpus().length / 2), 1) : Math.max(cpus().length - 1, 1);
  const maxThreads = ctx.config.maxThreads ?? threadsCount;
  const minThreads = ctx.config.minThreads ?? threadsCount;
  const options = {
    filename: workerPath$1,
    // TODO: investigate further
    // It seems atomics introduced V8 Fatal Error https://github.com/vitest-dev/vitest/issues/1191
    useAtomics: ctx.config.useAtomics ?? false,
    maxThreads,
    minThreads,
    env,
    execArgv,
    terminateTimeout: ctx.config.teardownTimeout
  };
  if (ctx.config.isolate) {
    options.isolateWorkers = true;
    options.concurrentTasksPerWorker = 1;
  }
  if (ctx.config.singleThread) {
    options.concurrentTasksPerWorker = 1;
    options.maxThreads = 1;
    options.minThreads = 1;
  }
  const pool = new Tinypool(options);
  const runWithFiles = (name) => {
    let id = 0;
    async function runFiles(project, config, files, environment, invalidates = []) {
      ctx.state.clearFiles(project, files);
      const { workerPort, port } = createWorkerChannel$1(project);
      const workerId = ++id;
      const data = {
        port: workerPort,
        config,
        files,
        invalidates,
        environment,
        workerId
      };
      try {
        await pool.run(data, { transferList: [workerPort], name });
      } catch (error) {
        if (error instanceof Error && /Failed to terminate worker/.test(error.message))
          ctx.state.addProcessTimeoutCause(`Failed to terminate worker while running ${files.join(", ")}.`);
        else if (ctx.isCancelling && error instanceof Error && /The task has been cancelled/.test(error.message))
          ctx.state.cancelFiles(files, ctx.config.root);
        else
          throw error;
      } finally {
        port.close();
        workerPort.close();
      }
    }
    const Sequencer = ctx.config.sequence.sequencer;
    const sequencer = new Sequencer(ctx);
    return async (specs, invalidates) => {
      ctx.onCancel(() => pool.cancelPendingTasks());
      const configs = /* @__PURE__ */ new Map();
      const getConfig = (project) => {
        if (configs.has(project))
          return configs.get(project);
        const config = project.getSerializableConfig();
        configs.set(project, config);
        return config;
      };
      const workspaceMap = /* @__PURE__ */ new Map();
      for (const [project, file] of specs) {
        const workspaceFiles = workspaceMap.get(file) ?? [];
        workspaceFiles.push(project);
        workspaceMap.set(file, workspaceFiles);
      }
      const { shard } = ctx.config;
      if (shard)
        specs = await sequencer.shard(specs);
      specs = await sequencer.sort(specs);
      const singleThreads = specs.filter(([project]) => project.config.singleThread);
      const multipleThreads = specs.filter(([project]) => !project.config.singleThread);
      if (multipleThreads.length) {
        const filesByEnv = await groupFilesByEnv(multipleThreads);
        const files = Object.values(filesByEnv).flat();
        const results = [];
        if (ctx.config.isolate) {
          results.push(...await Promise.allSettled(files.map(({ file, environment, project }) => runFiles(project, getConfig(project), [file], environment, invalidates))));
        } else {
          const grouped = groupBy(files, ({ project, environment }) => project.getName() + environment.name + JSON.stringify(environment.options));
          for (const group of Object.values(grouped)) {
            results.push(...await Promise.allSettled(group.map(({ file, environment, project }) => runFiles(project, getConfig(project), [file], environment, invalidates))));
            await new Promise((resolve2) => pool.queueSize === 0 ? resolve2() : pool.once("drain", resolve2));
            await pool.recycleWorkers();
          }
        }
        const errors = results.filter((r) => r.status === "rejected").map((r) => r.reason);
        if (errors.length > 0)
          throw new AggregateErrorPonyfill(errors, "Errors occurred while running tests. For more information, see serialized error.");
      }
      if (singleThreads.length) {
        const filesByEnv = await groupFilesByEnv(singleThreads);
        const envs = envsOrder.concat(
          Object.keys(filesByEnv).filter((env2) => !envsOrder.includes(env2))
        );
        for (const env2 of envs) {
          const files = filesByEnv[env2];
          if (!(files == null ? void 0 : files.length))
            continue;
          const filesByOptions = groupBy(files, ({ project, environment }) => project.getName() + JSON.stringify(environment.options));
          for (const files2 of Object.values(filesByOptions)) {
            await pool.recycleWorkers();
            const filenames = files2.map((f) => f.file);
            await runFiles(files2[0].project, getConfig(files2[0].project), filenames, files2[0].environment, invalidates);
          }
        }
      }
    };
  };
  return {
    runTests: runWithFiles("run"),
    close: async () => {
      var _a;
      const nodeVersion = Number((_a = process.version.match(/v(\d+)\.(\d+)/)) == null ? void 0 : _a[0].slice(1));
      if (nodeVersion >= 16.17)
        await pool.destroy();
    }
  };
}

function createBrowserPool(ctx) {
  const providers = /* @__PURE__ */ new Set();
  const waitForTest = async (provider, id) => {
    const defer = createDefer();
    ctx.state.browserTestPromises.set(id, defer);
    const off = provider.catchError((error) => {
      if (id !== "no-isolate") {
        Object.defineProperty(error, "VITEST_TEST_PATH", {
          value: id
        });
      }
      defer.reject(error);
    });
    try {
      return await defer;
    } finally {
      off();
    }
  };
  const runTests = async (project, files) => {
    var _a;
    ctx.state.clearFiles(project, files);
    let isCancelled = false;
    project.ctx.onCancel(() => {
      isCancelled = true;
    });
    const provider = project.browserProvider;
    providers.add(provider);
    const origin = `http://${((_a = ctx.config.browser.api) == null ? void 0 : _a.host) || "localhost"}:${project.browser.config.server.port}`;
    const paths = files.map((file) => relative(project.config.root, file));
    const isolate = project.config.isolate;
    if (isolate) {
      for (const path of paths) {
        if (isCancelled) {
          ctx.state.cancelFiles(files.slice(paths.indexOf(path)), ctx.config.root);
          break;
        }
        const url = new URL("/", origin);
        url.searchParams.append("path", path);
        url.searchParams.set("id", path);
        await provider.openPage(url.toString());
        await waitForTest(provider, path);
      }
    } else {
      const url = new URL("/", origin);
      url.searchParams.set("id", "no-isolate");
      paths.forEach((path) => url.searchParams.append("path", path));
      await provider.openPage(url.toString());
      await waitForTest(provider, "no-isolate");
    }
  };
  const runWorkspaceTests = async (specs) => {
    const groupedFiles = /* @__PURE__ */ new Map();
    for (const [project, file] of specs) {
      const files = groupedFiles.get(project) || [];
      files.push(file);
      groupedFiles.set(project, files);
    }
    for (const [project, files] of groupedFiles.entries())
      await runTests(project, files);
  };
  return {
    async close() {
      ctx.state.browserTestPromises.clear();
      await Promise.all([...providers].map((provider) => provider.close()));
      providers.clear();
    },
    runTests: runWorkspaceTests
  };
}

const workerPath = pathToFileURL(resolve(distDir, "./vm.js")).href;
const suppressLoaderWarningsPath$1 = resolve(rootDir, "./suppress-warnings.cjs");
function createWorkerChannel(project) {
  const channel = new MessageChannel();
  const port = channel.port2;
  const workerPort = channel.port1;
  const rpc = createBirpc(
    createMethodsRPC(project),
    {
      eventNames: ["onCancel"],
      post(v) {
        port.postMessage(v);
      },
      on(fn) {
        port.on("message", fn);
      }
    }
  );
  project.ctx.onCancel((reason) => rpc.onCancel(reason));
  return { workerPort, port };
}
function createVmThreadsPool(ctx, { execArgv, env }) {
  const threadsCount = ctx.config.watch ? Math.max(Math.floor(cpus().length / 2), 1) : Math.max(cpus().length - 1, 1);
  const maxThreads = ctx.config.maxThreads ?? threadsCount;
  const minThreads = ctx.config.minThreads ?? threadsCount;
  const options = {
    filename: workerPath,
    // TODO: investigate further
    // It seems atomics introduced V8 Fatal Error https://github.com/vitest-dev/vitest/issues/1191
    useAtomics: ctx.config.useAtomics ?? false,
    maxThreads,
    minThreads,
    env,
    execArgv: [
      "--experimental-import-meta-resolve",
      "--experimental-vm-modules",
      "--require",
      suppressLoaderWarningsPath$1,
      ...execArgv
    ],
    terminateTimeout: ctx.config.teardownTimeout,
    maxMemoryLimitBeforeRecycle: ctx.config.experimentalVmWorkerMemoryLimit || void 0
  };
  if (ctx.config.singleThread) {
    options.concurrentTasksPerWorker = 1;
    options.maxThreads = 1;
    options.minThreads = 1;
  }
  const pool = new Tinypool(options);
  const runWithFiles = (name) => {
    let id = 0;
    async function runFiles(project, config, files, environment, invalidates = []) {
      ctx.state.clearFiles(project, files);
      const { workerPort, port } = createWorkerChannel(project);
      const workerId = ++id;
      const data = {
        port: workerPort,
        config,
        files,
        invalidates,
        environment,
        workerId
      };
      try {
        await pool.run(data, { transferList: [workerPort], name });
      } catch (error) {
        if (error instanceof Error && /Failed to terminate worker/.test(error.message))
          ctx.state.addProcessTimeoutCause(`Failed to terminate worker while running ${files.join(", ")}.`);
        else if (ctx.isCancelling && error instanceof Error && /The task has been cancelled/.test(error.message))
          ctx.state.cancelFiles(files, ctx.config.root);
        else
          throw error;
      } finally {
        port.close();
        workerPort.close();
      }
    }
    const Sequencer = ctx.config.sequence.sequencer;
    const sequencer = new Sequencer(ctx);
    return async (specs, invalidates) => {
      const configs = /* @__PURE__ */ new Map();
      const getConfig = (project) => {
        if (configs.has(project))
          return configs.get(project);
        const config = project.getSerializableConfig();
        configs.set(project, config);
        return config;
      };
      const { shard } = ctx.config;
      if (shard)
        specs = await sequencer.shard(specs);
      specs = await sequencer.sort(specs);
      const filesByEnv = await groupFilesByEnv(specs);
      const promises = Object.values(filesByEnv).flat();
      const results = await Promise.allSettled(promises.map(({ file, environment, project }) => runFiles(project, getConfig(project), [file], environment, invalidates)));
      const errors = results.filter((r) => r.status === "rejected").map((r) => r.reason);
      if (errors.length > 0)
        throw new AggregateErrorPonyfill(errors, "Errors occurred while running tests. For more information, see serialized error.");
    };
  };
  return {
    runTests: runWithFiles("run"),
    close: async () => {
      var _a;
      const nodeVersion = Number((_a = process.version.match(/v(\d+)\.(\d+)/)) == null ? void 0 : _a[0].slice(1));
      if (nodeVersion >= 16.17)
        await pool.destroy();
    }
  };
}

const loaderPath = pathToFileURL(resolve(distDir, "./loader.js")).href;
const suppressLoaderWarningsPath = resolve(rootDir, "./suppress-warnings.cjs");
function createPool(ctx) {
  const pools = {
    child_process: null,
    threads: null,
    browser: null,
    experimentalVmThreads: null
  };
  function getDefaultPoolName(project) {
    if (project.config.browser.enabled)
      return "browser";
    if (project.config.experimentalVmThreads)
      return "experimentalVmThreads";
    if (project.config.threads)
      return "threads";
    return "child_process";
  }
  function getPoolName([project, file]) {
    for (const [glob, pool] of project.config.poolMatchGlobs || []) {
      if (pool === "browser")
        throw new Error('Since Vitest 0.31.0 "browser" pool is not supported in "poolMatchGlobs". You can create a workspace to run some of your tests in browser in parallel. Read more: https://vitest.dev/guide/workspace');
      if (mm.isMatch(file, glob, { cwd: project.config.root }))
        return pool;
    }
    return getDefaultPoolName(project);
  }
  async function runTests(files, invalidate) {
    var _a;
    const conditions = ((_a = ctx.server.config.resolve.conditions) == null ? void 0 : _a.flatMap((c) => ["--conditions", c])) || [];
    const execArgv = process.execArgv.filter(
      (execArg) => execArg.startsWith("--cpu-prof") || execArg.startsWith("--heap-prof")
    );
    const options = {
      execArgv: ctx.config.deps.registerNodeLoader ? [
        ...execArgv,
        "--require",
        suppressLoaderWarningsPath,
        "--experimental-loader",
        loaderPath,
        ...conditions
      ] : [
        ...execArgv,
        ...conditions
      ],
      env: {
        TEST: "true",
        VITEST: "true",
        NODE_ENV: ctx.config.mode || "test",
        VITEST_MODE: ctx.config.watch ? "WATCH" : "RUN",
        ...process.env,
        ...ctx.config.env
      }
    };
    const filesByPool = {
      child_process: [],
      threads: [],
      browser: [],
      experimentalVmThreads: []
    };
    for (const spec of files) {
      const pool = getPoolName(spec);
      if (!(pool in filesByPool))
        throw new Error(`Unknown pool name "${pool}" for ${spec[1]}. Available pools: ${Object.keys(filesByPool).join(", ")}`);
      filesByPool[pool].push(spec);
    }
    await Promise.all(Object.entries(filesByPool).map(([pool, files2]) => {
      if (!files2.length)
        return null;
      if (pool === "browser") {
        pools.browser ?? (pools.browser = createBrowserPool(ctx));
        return pools.browser.runTests(files2, invalidate);
      }
      if (pool === "experimentalVmThreads") {
        pools.experimentalVmThreads ?? (pools.experimentalVmThreads = createVmThreadsPool(ctx, options));
        return pools.experimentalVmThreads.runTests(files2, invalidate);
      }
      if (pool === "threads") {
        pools.threads ?? (pools.threads = createThreadsPool(ctx, options));
        return pools.threads.runTests(files2, invalidate);
      }
      pools.child_process ?? (pools.child_process = createChildProcessPool(ctx, options));
      return pools.child_process.runTests(files2, invalidate);
    }));
  }
  return {
    runTests,
    async close() {
      await Promise.all(Object.values(pools).map((p) => p == null ? void 0 : p.close()));
    }
  };
}

const F_RIGHT = "\u2192";
const F_DOWN = "\u2193";
const F_DOWN_RIGHT = "\u21B3";
const F_POINTER = "\u276F";
const F_DOT = "\xB7";
const F_CHECK = "\u2713";
const F_CROSS = "\xD7";
const F_LONG_DASH = "\u23AF";

function ansiRegex({onlyFirst = false} = {}) {
	const pattern = [
	    '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
		'(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))'
	].join('|');

	return new RegExp(pattern, onlyFirst ? undefined : 'g');
}

const regex = ansiRegex();

function stripAnsi(string) {
	if (typeof string !== 'string') {
		throw new TypeError(`Expected a \`string\`, got \`${typeof string}\``);
	}

	// Even though the regex is global, we don't need to reset the `.lastIndex`
	// because unlike `.exec()` and `.test()`, `.replace()` does it automatically
	// and doing it manually has a performance penalty.
	return string.replace(regex, '');
}

const spinnerMap = /* @__PURE__ */ new WeakMap();
const hookSpinnerMap = /* @__PURE__ */ new WeakMap();
const pointer = c.yellow(F_POINTER);
const skipped = c.dim(c.gray(F_DOWN));
function getCols(delta = 0) {
  var _a;
  let length = (_a = process.stdout) == null ? void 0 : _a.columns;
  if (!length || Number.isNaN(length))
    length = 30;
  return Math.max(length + delta, 0);
}
function divider(text, left, right) {
  const cols = getCols();
  if (text) {
    const textLength = stripAnsi(text).length;
    if (left == null && right != null) {
      left = cols - textLength - right;
    } else {
      left = left ?? Math.floor((cols - textLength) / 2);
      right = cols - textLength - left;
    }
    left = Math.max(0, left);
    right = Math.max(0, right);
    return `${F_LONG_DASH.repeat(left)}${text}${F_LONG_DASH.repeat(right)}`;
  }
  return F_LONG_DASH.repeat(cols);
}
function formatTestPath(root, path) {
  var _a;
  if (isAbsolute(path))
    path = relative(root, path);
  const dir = dirname(path);
  const ext = ((_a = path.match(/(\.(spec|test)\.[cm]?[tj]sx?)$/)) == null ? void 0 : _a[0]) || "";
  const base = basename(path, ext);
  return slash$1(c.dim(`${dir}/`) + c.bold(base)) + c.dim(ext);
}
function renderSnapshotSummary(rootDir, snapshots) {
  const summary = [];
  if (snapshots.added)
    summary.push(c.bold(c.green(`${snapshots.added} written`)));
  if (snapshots.unmatched)
    summary.push(c.bold(c.red(`${snapshots.unmatched} failed`)));
  if (snapshots.updated)
    summary.push(c.bold(c.green(`${snapshots.updated} updated `)));
  if (snapshots.filesRemoved) {
    if (snapshots.didUpdate)
      summary.push(c.bold(c.green(`${snapshots.filesRemoved} files removed `)));
    else
      summary.push(c.bold(c.yellow(`${snapshots.filesRemoved} files obsolete `)));
  }
  if (snapshots.filesRemovedList && snapshots.filesRemovedList.length) {
    const [head, ...tail] = snapshots.filesRemovedList;
    summary.push(`${c.gray(F_DOWN_RIGHT)} ${formatTestPath(rootDir, head)}`);
    tail.forEach((key) => {
      summary.push(`  ${c.gray(F_DOT)} ${formatTestPath(rootDir, key)}`);
    });
  }
  if (snapshots.unchecked) {
    if (snapshots.didUpdate)
      summary.push(c.bold(c.green(`${snapshots.unchecked} removed`)));
    else
      summary.push(c.bold(c.yellow(`${snapshots.unchecked} obsolete`)));
    snapshots.uncheckedKeysByFile.forEach((uncheckedFile) => {
      summary.push(`${c.gray(F_DOWN_RIGHT)} ${formatTestPath(rootDir, uncheckedFile.filePath)}`);
      uncheckedFile.keys.forEach((key) => summary.push(`  ${c.gray(F_DOT)} ${key}`));
    });
  }
  return summary;
}
function countTestErrors(tasks) {
  return tasks.reduce((c2, i) => {
    var _a, _b;
    return c2 + (((_b = (_a = i.result) == null ? void 0 : _a.errors) == null ? void 0 : _b.length) || 0);
  }, 0);
}
function getStateString(tasks, name = "tests", showTotal = true) {
  if (tasks.length === 0)
    return c.dim(`no ${name}`);
  const passed = tasks.filter((i) => {
    var _a;
    return ((_a = i.result) == null ? void 0 : _a.state) === "pass";
  });
  const failed = tasks.filter((i) => {
    var _a;
    return ((_a = i.result) == null ? void 0 : _a.state) === "fail";
  });
  const skipped2 = tasks.filter((i) => i.mode === "skip");
  const todo = tasks.filter((i) => i.mode === "todo");
  return [
    failed.length ? c.bold(c.red(`${failed.length} failed`)) : null,
    passed.length ? c.bold(c.green(`${passed.length} passed`)) : null,
    skipped2.length ? c.yellow(`${skipped2.length} skipped`) : null,
    todo.length ? c.gray(`${todo.length} todo`) : null
  ].filter(Boolean).join(c.dim(" | ")) + (showTotal ? c.gray(` (${tasks.length})`) : "");
}
function getStateSymbol(task) {
  var _a;
  if (task.mode === "skip" || task.mode === "todo")
    return skipped;
  if (!task.result)
    return c.gray("\xB7");
  if (task.result.state === "run") {
    if (task.type === "suite")
      return pointer;
    let spinner = spinnerMap.get(task);
    if (!spinner) {
      spinner = elegantSpinner();
      spinnerMap.set(task, spinner);
    }
    return c.yellow(spinner());
  }
  if (task.result.state === "pass") {
    return ((_a = task.meta) == null ? void 0 : _a.benchmark) ? c.green(F_DOT) : c.green(F_CHECK);
  }
  if (task.result.state === "fail") {
    return task.type === "suite" ? pointer : c.red(F_CROSS);
  }
  return " ";
}
function getHookStateSymbol(task, hookName) {
  var _a, _b;
  const state = (_b = (_a = task.result) == null ? void 0 : _a.hooks) == null ? void 0 : _b[hookName];
  if (state && state === "run") {
    let spinnerMap2 = hookSpinnerMap.get(task);
    if (!spinnerMap2) {
      spinnerMap2 = /* @__PURE__ */ new Map();
      hookSpinnerMap.set(task, spinnerMap2);
    }
    let spinner = spinnerMap2.get(hookName);
    if (!spinner) {
      spinner = elegantSpinner();
      spinnerMap2.set(hookName, spinner);
    }
    return c.yellow(spinner());
  }
}
const spinnerFrames = process.platform === "win32" ? ["-", "\\", "|", "/"] : ["\u280B", "\u2819", "\u2839", "\u2838", "\u283C", "\u2834", "\u2826", "\u2827", "\u2807", "\u280F"];
function elegantSpinner() {
  let index = 0;
  return () => {
    index = ++index % spinnerFrames.length;
    return spinnerFrames[index];
  };
}
function formatTimeString(date) {
  return date.toTimeString().split(" ")[0];
}
function formatProjectName(name, suffix = " ") {
  if (!name)
    return "";
  const index = name.split("").reduce((acc, v, idx) => acc + v.charCodeAt(0) + idx, 0);
  const colors = [
    c.blue,
    c.yellow,
    c.cyan,
    c.green,
    c.magenta
  ];
  return colors[index % colors.length](`|${name}|`) + suffix;
}

var _a;
const BADGE_PADDING = "       ";
const HELP_HINT = `${c.dim("press ")}${c.bold("h")}${c.dim(" to show help")}`;
const HELP_UPDATE_SNAP = c.dim("press ") + c.bold(c.yellow("u")) + c.dim(" to update snapshot");
const HELP_QUITE = `${c.dim("press ")}${c.bold("q")}${c.dim(" to quit")}`;
const WAIT_FOR_CHANGE_PASS = `
${c.bold(c.inverse(c.green(" PASS ")))}${c.green(" Waiting for file changes...")}`;
const WAIT_FOR_CHANGE_FAIL = `
${c.bold(c.inverse(c.red(" FAIL ")))}${c.red(" Tests failed. Watching for file changes...")}`;
const WAIT_FOR_CHANGE_CANCELLED = `
${c.bold(c.inverse(c.red(" CANCELLED ")))}${c.red(" Test run cancelled. Watching for file changes...")}`;
const LAST_RUN_LOG_TIMEOUT = 1500;
class BaseReporter {
  start = 0;
  end = 0;
  watchFilters;
  isTTY = isNode && ((_a = process.stdout) == null ? void 0 : _a.isTTY) && !isCI;
  ctx = void 0;
  _filesInWatchMode = /* @__PURE__ */ new Map();
  _lastRunTimeout = 0;
  _lastRunTimer;
  _lastRunCount = 0;
  _timeStart = /* @__PURE__ */ new Date();
  constructor() {
    this.registerUnhandledRejection();
  }
  get mode() {
    return this.ctx.config.mode;
  }
  onInit(ctx) {
    this.ctx = ctx;
    ctx.logger.printBanner();
    this.start = performance.now();
  }
  relative(path) {
    return relativePath(this.ctx.config.root, path);
  }
  async onFinished(files = this.ctx.state.getFiles(), errors = this.ctx.state.getUnhandledErrors()) {
    this.end = performance.now();
    await this.reportSummary(files, errors);
    if (errors.length) {
      if (!this.ctx.config.dangerouslyIgnoreUnhandledErrors)
        process.exitCode = 1;
    }
  }
  onTaskUpdate(packs) {
    var _a2, _b, _c, _d;
    if (this.isTTY)
      return;
    const logger = this.ctx.logger;
    for (const pack of packs) {
      const task = this.ctx.state.idMap.get(pack[0]);
      if (task && "filepath" in task && ((_a2 = task.result) == null ? void 0 : _a2.state) && ((_b = task.result) == null ? void 0 : _b.state) !== "run") {
        const tests = getTests(task);
        const failed = tests.filter((t) => {
          var _a3;
          return ((_a3 = t.result) == null ? void 0 : _a3.state) === "fail";
        });
        const skipped = tests.filter((t) => t.mode === "skip" || t.mode === "todo");
        let state = c.dim(`${tests.length} test${tests.length > 1 ? "s" : ""}`);
        if (failed.length)
          state += ` ${c.dim("|")} ${c.red(`${failed.length} failed`)}`;
        if (skipped.length)
          state += ` ${c.dim("|")} ${c.yellow(`${skipped.length} skipped`)}`;
        let suffix = c.dim(" (") + state + c.dim(")");
        if (task.result.duration) {
          const color = task.result.duration > this.ctx.config.slowTestThreshold ? c.yellow : c.gray;
          suffix += color(` ${Math.round(task.result.duration)}${c.dim("ms")}`);
        }
        if (this.ctx.config.logHeapUsage && task.result.heap != null)
          suffix += c.magenta(` ${Math.floor(task.result.heap / 1024 / 1024)} MB heap used`);
        let title = ` ${getStateSymbol(task)} `;
        if (task.projectName)
          title += formatProjectName(task.projectName);
        title += `${task.name} ${suffix}`;
        logger.log(title);
        for (const test of failed) {
          logger.log(c.red(`   ${pointer} ${getFullName(test, c.dim(" > "))}`));
          (_d = (_c = test.result) == null ? void 0 : _c.errors) == null ? void 0 : _d.forEach((e) => {
            logger.log(c.red(`     ${F_RIGHT} ${e == null ? void 0 : e.message}`));
          });
        }
      }
    }
  }
  async onWatcherStart(files = this.ctx.state.getFiles(), errors = this.ctx.state.getUnhandledErrors()) {
    this.resetLastRunLog();
    const failed = errors.length > 0 || hasFailed(files);
    const failedSnap = hasFailedSnapshot(files);
    const cancelled = this.ctx.isCancelling;
    if (failed)
      this.ctx.logger.log(WAIT_FOR_CHANGE_FAIL);
    else if (cancelled)
      this.ctx.logger.log(WAIT_FOR_CHANGE_CANCELLED);
    else
      this.ctx.logger.log(WAIT_FOR_CHANGE_PASS);
    const hints = [];
    if (this.mode !== "typecheck")
      hints.push(HELP_HINT);
    if (failedSnap)
      hints.unshift(HELP_UPDATE_SNAP);
    else
      hints.push(HELP_QUITE);
    this.ctx.logger.log(BADGE_PADDING + hints.join(c.dim(", ")));
    if (this._lastRunCount) {
      const LAST_RUN_TEXT = `rerun x${this._lastRunCount}`;
      const LAST_RUN_TEXTS = [
        c.blue(LAST_RUN_TEXT),
        c.gray(LAST_RUN_TEXT),
        c.dim(c.gray(LAST_RUN_TEXT))
      ];
      this.ctx.logger.logUpdate(BADGE_PADDING + LAST_RUN_TEXTS[0]);
      this._lastRunTimeout = 0;
      const { setInterval } = getSafeTimers();
      this._lastRunTimer = setInterval(
        () => {
          this._lastRunTimeout += 1;
          if (this._lastRunTimeout >= LAST_RUN_TEXTS.length)
            this.resetLastRunLog();
          else
            this.ctx.logger.logUpdate(BADGE_PADDING + LAST_RUN_TEXTS[this._lastRunTimeout]);
        },
        LAST_RUN_LOG_TIMEOUT / LAST_RUN_TEXTS.length
      );
    }
  }
  resetLastRunLog() {
    const { clearInterval } = getSafeTimers();
    clearInterval(this._lastRunTimer);
    this._lastRunTimer = void 0;
    this.ctx.logger.logUpdate.clear();
  }
  async onWatcherRerun(files, trigger) {
    this.resetLastRunLog();
    this.watchFilters = files;
    files.forEach((filepath) => {
      let reruns = this._filesInWatchMode.get(filepath) ?? 0;
      this._filesInWatchMode.set(filepath, ++reruns);
    });
    const BADGE = c.inverse(c.bold(c.blue(" RERUN ")));
    const TRIGGER = trigger ? c.dim(` ${this.relative(trigger)}`) : "";
    const FILENAME_PATTERN = this.ctx.filenamePattern ? `${BADGE_PADDING} ${c.dim("Filename pattern: ")}${c.blue(this.ctx.filenamePattern)}
` : "";
    const TESTNAME_PATTERN = this.ctx.configOverride.testNamePattern ? `${BADGE_PADDING} ${c.dim("Test name pattern: ")}${c.blue(String(this.ctx.configOverride.testNamePattern))}
` : "";
    if (files.length > 1) {
      this.ctx.logger.clearFullScreen(`
${BADGE}${TRIGGER}
${FILENAME_PATTERN}${TESTNAME_PATTERN}`);
      this._lastRunCount = 0;
    } else if (files.length === 1) {
      const rerun = this._filesInWatchMode.get(files[0]) ?? 1;
      this._lastRunCount = rerun;
      this.ctx.logger.clearFullScreen(`
${BADGE}${TRIGGER} ${c.blue(`x${rerun}`)}
${FILENAME_PATTERN}${TESTNAME_PATTERN}`);
    }
    this._timeStart = /* @__PURE__ */ new Date();
    this.start = performance.now();
  }
  onUserConsoleLog(log) {
    if (!this.shouldLog(log))
      return;
    const task = log.taskId ? this.ctx.state.idMap.get(log.taskId) : void 0;
    const header = c.gray(log.type + c.dim(` | ${task ? getFullName(task, c.dim(" > ")) : "unknown test"}`));
    process[log.type].write(`${header}
${log.content}
`);
  }
  shouldLog(log) {
    var _a2, _b;
    if (this.ctx.config.silent)
      return false;
    const shouldLog = (_b = (_a2 = this.ctx.config).onConsoleLog) == null ? void 0 : _b.call(_a2, log.content, log.type);
    if (shouldLog === false)
      return shouldLog;
    return true;
  }
  onServerRestart(reason) {
    this.ctx.logger.log(c.bold(c.magenta(
      reason === "config" ? "\nRestarting due to config changes..." : "\nRestarting Vitest..."
    )));
  }
  async reportSummary(files, errors) {
    await this.printErrorsSummary(files, errors);
    if (this.mode === "benchmark")
      await this.reportBenchmarkSummary(files);
    else
      await this.reportTestSummary(files, errors);
  }
  async reportTestSummary(files, errors) {
    const tests = getTests(files);
    const logger = this.ctx.logger;
    const executionTime = this.end - this.start;
    const collectTime = files.reduce((acc, test) => acc + Math.max(0, test.collectDuration || 0), 0);
    const setupTime = files.reduce((acc, test) => acc + Math.max(0, test.setupDuration || 0), 0);
    const testsTime = files.reduce((acc, test) => {
      var _a2;
      return acc + Math.max(0, ((_a2 = test.result) == null ? void 0 : _a2.duration) || 0);
    }, 0);
    const transformTime = this.ctx.projects.flatMap((w) => Array.from(w.vitenode.fetchCache.values()).map((i) => i.duration || 0)).reduce((a, b) => a + b, 0);
    const environmentTime = files.reduce((acc, file) => acc + Math.max(0, file.environmentLoad || 0), 0);
    const prepareTime = files.reduce((acc, file) => acc + Math.max(0, file.prepareDuration || 0), 0);
    const threadTime = collectTime + testsTime + setupTime;
    const padTitle = (str) => c.dim(`${str.padStart(11)} `);
    const time = (time2) => {
      if (time2 > 1e3)
        return `${(time2 / 1e3).toFixed(2)}s`;
      return `${Math.round(time2)}ms`;
    };
    const snapshotOutput = renderSnapshotSummary(this.ctx.config.root, this.ctx.snapshot.summary);
    if (snapshotOutput.length) {
      logger.log(snapshotOutput.map(
        (t, i) => i === 0 ? `${padTitle("Snapshots")} ${t}` : `${padTitle("")} ${t}`
      ).join("\n"));
      if (snapshotOutput.length > 1)
        logger.log();
    }
    logger.log(padTitle("Test Files"), getStateString(files));
    logger.log(padTitle("Tests"), getStateString(tests));
    if (this.mode === "typecheck") {
      const failed = tests.filter((t) => {
        var _a2, _b, _c;
        return ((_a2 = t.meta) == null ? void 0 : _a2.typecheck) && ((_c = (_b = t.result) == null ? void 0 : _b.errors) == null ? void 0 : _c.length);
      });
      logger.log(padTitle("Type Errors"), failed.length ? c.bold(c.red(`${failed.length} failed`)) : c.dim("no errors"));
    }
    if (errors.length)
      logger.log(padTitle("Errors"), c.bold(c.red(`${errors.length} error${errors.length > 1 ? "s" : ""}`)));
    logger.log(padTitle("Start at"), formatTimeString(this._timeStart));
    if (this.watchFilters)
      logger.log(padTitle("Duration"), time(threadTime));
    else if (this.mode === "typecheck")
      logger.log(padTitle("Duration"), time(executionTime));
    else
      logger.log(padTitle("Duration"), time(executionTime) + c.dim(` (transform ${time(transformTime)}, setup ${time(setupTime)}, collect ${time(collectTime)}, tests ${time(testsTime)}, environment ${time(environmentTime)}, prepare ${time(prepareTime)})`));
    logger.log();
  }
  async printErrorsSummary(files, errors) {
    const logger = this.ctx.logger;
    const suites = getSuites(files);
    const tests = getTests(files);
    const failedSuites = suites.filter((i) => {
      var _a2;
      return (_a2 = i.result) == null ? void 0 : _a2.errors;
    });
    const failedTests = tests.filter((i) => {
      var _a2;
      return ((_a2 = i.result) == null ? void 0 : _a2.state) === "fail";
    });
    const failedTotal = countTestErrors(failedSuites) + countTestErrors(failedTests);
    let current = 1;
    const errorDivider = () => logger.error(`${c.red(c.dim(divider(`[${current++}/${failedTotal}]`, void 0, 1)))}
`);
    if (failedSuites.length) {
      logger.error(c.red(divider(c.bold(c.inverse(` Failed Suites ${failedSuites.length} `)))));
      logger.error();
      await this.printTaskErrors(failedSuites, errorDivider);
    }
    if (failedTests.length) {
      logger.error(c.red(divider(c.bold(c.inverse(` Failed Tests ${failedTests.length} `)))));
      logger.error();
      await this.printTaskErrors(failedTests, errorDivider);
    }
    if (errors.length) {
      await logger.printUnhandledErrors(errors);
      logger.error();
    }
    return tests;
  }
  async reportBenchmarkSummary(files) {
    const logger = this.ctx.logger;
    const benches = getTests(files);
    const topBenches = benches.filter((i) => {
      var _a2, _b;
      return ((_b = (_a2 = i.result) == null ? void 0 : _a2.benchmark) == null ? void 0 : _b.rank) === 1;
    });
    logger.log(`
${c.cyan(c.inverse(c.bold(" BENCH ")))} ${c.cyan("Summary")}
`);
    for (const bench of topBenches) {
      const group = bench.suite;
      if (!group)
        continue;
      const groupName = getFullName(group, c.dim(" > "));
      logger.log(`  ${bench.name}${c.dim(` - ${groupName}`)}`);
      const siblings = group.tasks.filter((i) => {
        var _a2;
        return ((_a2 = i.result) == null ? void 0 : _a2.benchmark) && i !== bench;
      }).sort((a, b) => a.result.benchmark.rank - b.result.benchmark.rank);
      for (const sibling of siblings) {
        const number = `${(sibling.result.benchmark.mean / bench.result.benchmark.mean).toFixed(2)}x`;
        logger.log(`    ${c.green(number)} ${c.gray("faster than")} ${sibling.name}`);
      }
      logger.log("");
    }
  }
  async printTaskErrors(tasks, errorDivider) {
    var _a2, _b, _c;
    const errorsQueue = [];
    for (const task of tasks) {
      (_b = (_a2 = task.result) == null ? void 0 : _a2.errors) == null ? void 0 : _b.forEach((error) => {
        const errorItem = (error == null ? void 0 : error.stackStr) && errorsQueue.find((i) => {
          var _a3, _b2, _c2, _d;
          const hasStr = ((_a3 = i[0]) == null ? void 0 : _a3.stackStr) === error.stackStr;
          if (!hasStr)
            return false;
          const currentProjectName = (task == null ? void 0 : task.projectName) || ((_b2 = task.file) == null ? void 0 : _b2.projectName);
          const projectName = ((_c2 = i[1][0]) == null ? void 0 : _c2.projectName) || ((_d = i[1][0].file) == null ? void 0 : _d.projectName);
          return projectName === currentProjectName;
        });
        if (errorItem)
          errorItem[1].push(task);
        else
          errorsQueue.push([error, [task]]);
      });
    }
    for (const [error, tasks2] of errorsQueue) {
      for (const task of tasks2) {
        const filepath = (task == null ? void 0 : task.filepath) || "";
        const projectName = (task == null ? void 0 : task.projectName) || ((_c = task.file) == null ? void 0 : _c.projectName);
        let name = getFullName(task, c.dim(" > "));
        if (filepath)
          name = `${name} ${c.dim(`[ ${this.relative(filepath)} ]`)}`;
        this.ctx.logger.error(`${c.red(c.bold(c.inverse(" FAIL ")))} ${formatProjectName(projectName)}${name}`);
      }
      const project = this.ctx.getProjectByTaskId(tasks2[0].id);
      await this.ctx.logger.printError(error, { project });
      errorDivider();
      await Promise.resolve();
    }
  }
  registerUnhandledRejection() {
    process.on("unhandledRejection", async (err) => {
      process.exitCode = 1;
      await this.ctx.logger.printError(err, { fullStack: true, type: "Unhandled Rejection" });
      this.ctx.logger.error("\n\n");
      process.exit(1);
    });
  }
}

class BasicReporter extends BaseReporter {
  isTTY = false;
  reportSummary(files, errors) {
    this.ctx.logger.log();
    return super.reportSummary(files, errors);
  }
}

/* eslint-disable yoda */

function isFullwidthCodePoint(codePoint) {
	if (!Number.isInteger(codePoint)) {
		return false;
	}

	// Code points are derived from:
	// https://unicode.org/Public/UNIDATA/EastAsianWidth.txt
	return codePoint >= 0x1100 && (
		codePoint <= 0x115F || // Hangul Jamo
		codePoint === 0x2329 || // LEFT-POINTING ANGLE BRACKET
		codePoint === 0x232A || // RIGHT-POINTING ANGLE BRACKET
		// CJK Radicals Supplement .. Enclosed CJK Letters and Months
		(0x2E80 <= codePoint && codePoint <= 0x3247 && codePoint !== 0x303F) ||
		// Enclosed CJK Letters and Months .. CJK Unified Ideographs Extension A
		(0x3250 <= codePoint && codePoint <= 0x4DBF) ||
		// CJK Unified Ideographs .. Yi Radicals
		(0x4E00 <= codePoint && codePoint <= 0xA4C6) ||
		// Hangul Jamo Extended-A
		(0xA960 <= codePoint && codePoint <= 0xA97C) ||
		// Hangul Syllables
		(0xAC00 <= codePoint && codePoint <= 0xD7A3) ||
		// CJK Compatibility Ideographs
		(0xF900 <= codePoint && codePoint <= 0xFAFF) ||
		// Vertical Forms
		(0xFE10 <= codePoint && codePoint <= 0xFE19) ||
		// CJK Compatibility Forms .. Small Form Variants
		(0xFE30 <= codePoint && codePoint <= 0xFE6B) ||
		// Halfwidth and Fullwidth Forms
		(0xFF01 <= codePoint && codePoint <= 0xFF60) ||
		(0xFFE0 <= codePoint && codePoint <= 0xFFE6) ||
		// Kana Supplement
		(0x1B000 <= codePoint && codePoint <= 0x1B001) ||
		// Enclosed Ideographic Supplement
		(0x1F200 <= codePoint && codePoint <= 0x1F251) ||
		// CJK Unified Ideographs Extension B .. Tertiary Ideographic Plane
		(0x20000 <= codePoint && codePoint <= 0x3FFFD)
	);
}

const ANSI_BACKGROUND_OFFSET = 10;

const wrapAnsi16 = (offset = 0) => code => `\u001B[${code + offset}m`;

const wrapAnsi256 = (offset = 0) => code => `\u001B[${38 + offset};5;${code}m`;

const wrapAnsi16m = (offset = 0) => (red, green, blue) => `\u001B[${38 + offset};2;${red};${green};${blue}m`;

const styles = {
	modifier: {
		reset: [0, 0],
		// 21 isn't widely supported and 22 does the same thing
		bold: [1, 22],
		dim: [2, 22],
		italic: [3, 23],
		underline: [4, 24],
		overline: [53, 55],
		inverse: [7, 27],
		hidden: [8, 28],
		strikethrough: [9, 29],
	},
	color: {
		black: [30, 39],
		red: [31, 39],
		green: [32, 39],
		yellow: [33, 39],
		blue: [34, 39],
		magenta: [35, 39],
		cyan: [36, 39],
		white: [37, 39],

		// Bright color
		blackBright: [90, 39],
		gray: [90, 39], // Alias of `blackBright`
		grey: [90, 39], // Alias of `blackBright`
		redBright: [91, 39],
		greenBright: [92, 39],
		yellowBright: [93, 39],
		blueBright: [94, 39],
		magentaBright: [95, 39],
		cyanBright: [96, 39],
		whiteBright: [97, 39],
	},
	bgColor: {
		bgBlack: [40, 49],
		bgRed: [41, 49],
		bgGreen: [42, 49],
		bgYellow: [43, 49],
		bgBlue: [44, 49],
		bgMagenta: [45, 49],
		bgCyan: [46, 49],
		bgWhite: [47, 49],

		// Bright color
		bgBlackBright: [100, 49],
		bgGray: [100, 49], // Alias of `bgBlackBright`
		bgGrey: [100, 49], // Alias of `bgBlackBright`
		bgRedBright: [101, 49],
		bgGreenBright: [102, 49],
		bgYellowBright: [103, 49],
		bgBlueBright: [104, 49],
		bgMagentaBright: [105, 49],
		bgCyanBright: [106, 49],
		bgWhiteBright: [107, 49],
	},
};

Object.keys(styles.modifier);
const foregroundColorNames = Object.keys(styles.color);
const backgroundColorNames = Object.keys(styles.bgColor);
[...foregroundColorNames, ...backgroundColorNames];

function assembleStyles() {
	const codes = new Map();

	for (const [groupName, group] of Object.entries(styles)) {
		for (const [styleName, style] of Object.entries(group)) {
			styles[styleName] = {
				open: `\u001B[${style[0]}m`,
				close: `\u001B[${style[1]}m`,
			};

			group[styleName] = styles[styleName];

			codes.set(style[0], style[1]);
		}

		Object.defineProperty(styles, groupName, {
			value: group,
			enumerable: false,
		});
	}

	Object.defineProperty(styles, 'codes', {
		value: codes,
		enumerable: false,
	});

	styles.color.close = '\u001B[39m';
	styles.bgColor.close = '\u001B[49m';

	styles.color.ansi = wrapAnsi16();
	styles.color.ansi256 = wrapAnsi256();
	styles.color.ansi16m = wrapAnsi16m();
	styles.bgColor.ansi = wrapAnsi16(ANSI_BACKGROUND_OFFSET);
	styles.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
	styles.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);

	// From https://github.com/Qix-/color-convert/blob/3f0e0d4e92e235796ccb17f6e85c72094a651f49/conversions.js
	Object.defineProperties(styles, {
		rgbToAnsi256: {
			value: (red, green, blue) => {
				// We use the extended greyscale palette here, with the exception of
				// black and white. normal palette only has 4 greyscale shades.
				if (red === green && green === blue) {
					if (red < 8) {
						return 16;
					}

					if (red > 248) {
						return 231;
					}

					return Math.round(((red - 8) / 247) * 24) + 232;
				}

				return 16
					+ (36 * Math.round(red / 255 * 5))
					+ (6 * Math.round(green / 255 * 5))
					+ Math.round(blue / 255 * 5);
			},
			enumerable: false,
		},
		hexToRgb: {
			value: hex => {
				const matches = /[a-f\d]{6}|[a-f\d]{3}/i.exec(hex.toString(16));
				if (!matches) {
					return [0, 0, 0];
				}

				let [colorString] = matches;

				if (colorString.length === 3) {
					colorString = [...colorString].map(character => character + character).join('');
				}

				const integer = Number.parseInt(colorString, 16);

				return [
					/* eslint-disable no-bitwise */
					(integer >> 16) & 0xFF,
					(integer >> 8) & 0xFF,
					integer & 0xFF,
					/* eslint-enable no-bitwise */
				];
			},
			enumerable: false,
		},
		hexToAnsi256: {
			value: hex => styles.rgbToAnsi256(...styles.hexToRgb(hex)),
			enumerable: false,
		},
		ansi256ToAnsi: {
			value: code => {
				if (code < 8) {
					return 30 + code;
				}

				if (code < 16) {
					return 90 + (code - 8);
				}

				let red;
				let green;
				let blue;

				if (code >= 232) {
					red = (((code - 232) * 10) + 8) / 255;
					green = red;
					blue = red;
				} else {
					code -= 16;

					const remainder = code % 36;

					red = Math.floor(code / 36) / 5;
					green = Math.floor(remainder / 6) / 5;
					blue = (remainder % 6) / 5;
				}

				const value = Math.max(red, green, blue) * 2;

				if (value === 0) {
					return 30;
				}

				// eslint-disable-next-line no-bitwise
				let result = 30 + ((Math.round(blue) << 2) | (Math.round(green) << 1) | Math.round(red));

				if (value === 2) {
					result += 60;
				}

				return result;
			},
			enumerable: false,
		},
		rgbToAnsi: {
			value: (red, green, blue) => styles.ansi256ToAnsi(styles.rgbToAnsi256(red, green, blue)),
			enumerable: false,
		},
		hexToAnsi: {
			value: hex => styles.ansi256ToAnsi(styles.hexToAnsi256(hex)),
			enumerable: false,
		},
	});

	return styles;
}

const ansiStyles = assembleStyles();

const astralRegex = /^[\uD800-\uDBFF][\uDC00-\uDFFF]$/;

const ESCAPES$1 = [
	'\u001B',
	'\u009B'
];

const wrapAnsi$1 = code => `${ESCAPES$1[0]}[${code}m`;

const checkAnsi = (ansiCodes, isEscapes, endAnsiCode) => {
	let output = [];
	ansiCodes = [...ansiCodes];

	for (let ansiCode of ansiCodes) {
		const ansiCodeOrigin = ansiCode;
		if (ansiCode.includes(';')) {
			ansiCode = ansiCode.split(';')[0][0] + '0';
		}

		const item = ansiStyles.codes.get(Number.parseInt(ansiCode, 10));
		if (item) {
			const indexEscape = ansiCodes.indexOf(item.toString());
			if (indexEscape === -1) {
				output.push(wrapAnsi$1(isEscapes ? item : ansiCodeOrigin));
			} else {
				ansiCodes.splice(indexEscape, 1);
			}
		} else if (isEscapes) {
			output.push(wrapAnsi$1(0));
			break;
		} else {
			output.push(wrapAnsi$1(ansiCodeOrigin));
		}
	}

	if (isEscapes) {
		output = output.filter((element, index) => output.indexOf(element) === index);

		if (endAnsiCode !== undefined) {
			const fistEscapeCode = wrapAnsi$1(ansiStyles.codes.get(Number.parseInt(endAnsiCode, 10)));
			// TODO: Remove the use of `.reduce` here.
			// eslint-disable-next-line unicorn/no-array-reduce
			output = output.reduce((current, next) => next === fistEscapeCode ? [next, ...current] : [...current, next], []);
		}
	}

	return output.join('');
};

function sliceAnsi(string, begin, end) {
	const characters = [...string];
	const ansiCodes = [];

	let stringEnd = typeof end === 'number' ? end : characters.length;
	let isInsideEscape = false;
	let ansiCode;
	let visible = 0;
	let output = '';

	for (const [index, character] of characters.entries()) {
		let leftEscape = false;

		if (ESCAPES$1.includes(character)) {
			const code = /\d[^m]*/.exec(string.slice(index, index + 18));
			ansiCode = code && code.length > 0 ? code[0] : undefined;

			if (visible < stringEnd) {
				isInsideEscape = true;

				if (ansiCode !== undefined) {
					ansiCodes.push(ansiCode);
				}
			}
		} else if (isInsideEscape && character === 'm') {
			isInsideEscape = false;
			leftEscape = true;
		}

		if (!isInsideEscape && !leftEscape) {
			visible++;
		}

		if (!astralRegex.test(character) && isFullwidthCodePoint(character.codePointAt())) {
			visible++;

			if (typeof end !== 'number') {
				stringEnd++;
			}
		}

		if (visible > begin && visible <= stringEnd) {
			output += character;
		} else if (visible === begin && !isInsideEscape && ansiCode !== undefined) {
			output = checkAnsi(ansiCodes);
		} else if (visible >= stringEnd) {
			output += checkAnsi(ansiCodes, true, ansiCode);
			break;
		}
	}

	return output;
}

var eastasianwidth = {exports: {}};

(function (module) {
	var eaw = {};

	{
	  module.exports = eaw;
	}

	eaw.eastAsianWidth = function(character) {
	  var x = character.charCodeAt(0);
	  var y = (character.length == 2) ? character.charCodeAt(1) : 0;
	  var codePoint = x;
	  if ((0xD800 <= x && x <= 0xDBFF) && (0xDC00 <= y && y <= 0xDFFF)) {
	    x &= 0x3FF;
	    y &= 0x3FF;
	    codePoint = (x << 10) | y;
	    codePoint += 0x10000;
	  }

	  if ((0x3000 == codePoint) ||
	      (0xFF01 <= codePoint && codePoint <= 0xFF60) ||
	      (0xFFE0 <= codePoint && codePoint <= 0xFFE6)) {
	    return 'F';
	  }
	  if ((0x20A9 == codePoint) ||
	      (0xFF61 <= codePoint && codePoint <= 0xFFBE) ||
	      (0xFFC2 <= codePoint && codePoint <= 0xFFC7) ||
	      (0xFFCA <= codePoint && codePoint <= 0xFFCF) ||
	      (0xFFD2 <= codePoint && codePoint <= 0xFFD7) ||
	      (0xFFDA <= codePoint && codePoint <= 0xFFDC) ||
	      (0xFFE8 <= codePoint && codePoint <= 0xFFEE)) {
	    return 'H';
	  }
	  if ((0x1100 <= codePoint && codePoint <= 0x115F) ||
	      (0x11A3 <= codePoint && codePoint <= 0x11A7) ||
	      (0x11FA <= codePoint && codePoint <= 0x11FF) ||
	      (0x2329 <= codePoint && codePoint <= 0x232A) ||
	      (0x2E80 <= codePoint && codePoint <= 0x2E99) ||
	      (0x2E9B <= codePoint && codePoint <= 0x2EF3) ||
	      (0x2F00 <= codePoint && codePoint <= 0x2FD5) ||
	      (0x2FF0 <= codePoint && codePoint <= 0x2FFB) ||
	      (0x3001 <= codePoint && codePoint <= 0x303E) ||
	      (0x3041 <= codePoint && codePoint <= 0x3096) ||
	      (0x3099 <= codePoint && codePoint <= 0x30FF) ||
	      (0x3105 <= codePoint && codePoint <= 0x312D) ||
	      (0x3131 <= codePoint && codePoint <= 0x318E) ||
	      (0x3190 <= codePoint && codePoint <= 0x31BA) ||
	      (0x31C0 <= codePoint && codePoint <= 0x31E3) ||
	      (0x31F0 <= codePoint && codePoint <= 0x321E) ||
	      (0x3220 <= codePoint && codePoint <= 0x3247) ||
	      (0x3250 <= codePoint && codePoint <= 0x32FE) ||
	      (0x3300 <= codePoint && codePoint <= 0x4DBF) ||
	      (0x4E00 <= codePoint && codePoint <= 0xA48C) ||
	      (0xA490 <= codePoint && codePoint <= 0xA4C6) ||
	      (0xA960 <= codePoint && codePoint <= 0xA97C) ||
	      (0xAC00 <= codePoint && codePoint <= 0xD7A3) ||
	      (0xD7B0 <= codePoint && codePoint <= 0xD7C6) ||
	      (0xD7CB <= codePoint && codePoint <= 0xD7FB) ||
	      (0xF900 <= codePoint && codePoint <= 0xFAFF) ||
	      (0xFE10 <= codePoint && codePoint <= 0xFE19) ||
	      (0xFE30 <= codePoint && codePoint <= 0xFE52) ||
	      (0xFE54 <= codePoint && codePoint <= 0xFE66) ||
	      (0xFE68 <= codePoint && codePoint <= 0xFE6B) ||
	      (0x1B000 <= codePoint && codePoint <= 0x1B001) ||
	      (0x1F200 <= codePoint && codePoint <= 0x1F202) ||
	      (0x1F210 <= codePoint && codePoint <= 0x1F23A) ||
	      (0x1F240 <= codePoint && codePoint <= 0x1F248) ||
	      (0x1F250 <= codePoint && codePoint <= 0x1F251) ||
	      (0x20000 <= codePoint && codePoint <= 0x2F73F) ||
	      (0x2B740 <= codePoint && codePoint <= 0x2FFFD) ||
	      (0x30000 <= codePoint && codePoint <= 0x3FFFD)) {
	    return 'W';
	  }
	  if ((0x0020 <= codePoint && codePoint <= 0x007E) ||
	      (0x00A2 <= codePoint && codePoint <= 0x00A3) ||
	      (0x00A5 <= codePoint && codePoint <= 0x00A6) ||
	      (0x00AC == codePoint) ||
	      (0x00AF == codePoint) ||
	      (0x27E6 <= codePoint && codePoint <= 0x27ED) ||
	      (0x2985 <= codePoint && codePoint <= 0x2986)) {
	    return 'Na';
	  }
	  if ((0x00A1 == codePoint) ||
	      (0x00A4 == codePoint) ||
	      (0x00A7 <= codePoint && codePoint <= 0x00A8) ||
	      (0x00AA == codePoint) ||
	      (0x00AD <= codePoint && codePoint <= 0x00AE) ||
	      (0x00B0 <= codePoint && codePoint <= 0x00B4) ||
	      (0x00B6 <= codePoint && codePoint <= 0x00BA) ||
	      (0x00BC <= codePoint && codePoint <= 0x00BF) ||
	      (0x00C6 == codePoint) ||
	      (0x00D0 == codePoint) ||
	      (0x00D7 <= codePoint && codePoint <= 0x00D8) ||
	      (0x00DE <= codePoint && codePoint <= 0x00E1) ||
	      (0x00E6 == codePoint) ||
	      (0x00E8 <= codePoint && codePoint <= 0x00EA) ||
	      (0x00EC <= codePoint && codePoint <= 0x00ED) ||
	      (0x00F0 == codePoint) ||
	      (0x00F2 <= codePoint && codePoint <= 0x00F3) ||
	      (0x00F7 <= codePoint && codePoint <= 0x00FA) ||
	      (0x00FC == codePoint) ||
	      (0x00FE == codePoint) ||
	      (0x0101 == codePoint) ||
	      (0x0111 == codePoint) ||
	      (0x0113 == codePoint) ||
	      (0x011B == codePoint) ||
	      (0x0126 <= codePoint && codePoint <= 0x0127) ||
	      (0x012B == codePoint) ||
	      (0x0131 <= codePoint && codePoint <= 0x0133) ||
	      (0x0138 == codePoint) ||
	      (0x013F <= codePoint && codePoint <= 0x0142) ||
	      (0x0144 == codePoint) ||
	      (0x0148 <= codePoint && codePoint <= 0x014B) ||
	      (0x014D == codePoint) ||
	      (0x0152 <= codePoint && codePoint <= 0x0153) ||
	      (0x0166 <= codePoint && codePoint <= 0x0167) ||
	      (0x016B == codePoint) ||
	      (0x01CE == codePoint) ||
	      (0x01D0 == codePoint) ||
	      (0x01D2 == codePoint) ||
	      (0x01D4 == codePoint) ||
	      (0x01D6 == codePoint) ||
	      (0x01D8 == codePoint) ||
	      (0x01DA == codePoint) ||
	      (0x01DC == codePoint) ||
	      (0x0251 == codePoint) ||
	      (0x0261 == codePoint) ||
	      (0x02C4 == codePoint) ||
	      (0x02C7 == codePoint) ||
	      (0x02C9 <= codePoint && codePoint <= 0x02CB) ||
	      (0x02CD == codePoint) ||
	      (0x02D0 == codePoint) ||
	      (0x02D8 <= codePoint && codePoint <= 0x02DB) ||
	      (0x02DD == codePoint) ||
	      (0x02DF == codePoint) ||
	      (0x0300 <= codePoint && codePoint <= 0x036F) ||
	      (0x0391 <= codePoint && codePoint <= 0x03A1) ||
	      (0x03A3 <= codePoint && codePoint <= 0x03A9) ||
	      (0x03B1 <= codePoint && codePoint <= 0x03C1) ||
	      (0x03C3 <= codePoint && codePoint <= 0x03C9) ||
	      (0x0401 == codePoint) ||
	      (0x0410 <= codePoint && codePoint <= 0x044F) ||
	      (0x0451 == codePoint) ||
	      (0x2010 == codePoint) ||
	      (0x2013 <= codePoint && codePoint <= 0x2016) ||
	      (0x2018 <= codePoint && codePoint <= 0x2019) ||
	      (0x201C <= codePoint && codePoint <= 0x201D) ||
	      (0x2020 <= codePoint && codePoint <= 0x2022) ||
	      (0x2024 <= codePoint && codePoint <= 0x2027) ||
	      (0x2030 == codePoint) ||
	      (0x2032 <= codePoint && codePoint <= 0x2033) ||
	      (0x2035 == codePoint) ||
	      (0x203B == codePoint) ||
	      (0x203E == codePoint) ||
	      (0x2074 == codePoint) ||
	      (0x207F == codePoint) ||
	      (0x2081 <= codePoint && codePoint <= 0x2084) ||
	      (0x20AC == codePoint) ||
	      (0x2103 == codePoint) ||
	      (0x2105 == codePoint) ||
	      (0x2109 == codePoint) ||
	      (0x2113 == codePoint) ||
	      (0x2116 == codePoint) ||
	      (0x2121 <= codePoint && codePoint <= 0x2122) ||
	      (0x2126 == codePoint) ||
	      (0x212B == codePoint) ||
	      (0x2153 <= codePoint && codePoint <= 0x2154) ||
	      (0x215B <= codePoint && codePoint <= 0x215E) ||
	      (0x2160 <= codePoint && codePoint <= 0x216B) ||
	      (0x2170 <= codePoint && codePoint <= 0x2179) ||
	      (0x2189 == codePoint) ||
	      (0x2190 <= codePoint && codePoint <= 0x2199) ||
	      (0x21B8 <= codePoint && codePoint <= 0x21B9) ||
	      (0x21D2 == codePoint) ||
	      (0x21D4 == codePoint) ||
	      (0x21E7 == codePoint) ||
	      (0x2200 == codePoint) ||
	      (0x2202 <= codePoint && codePoint <= 0x2203) ||
	      (0x2207 <= codePoint && codePoint <= 0x2208) ||
	      (0x220B == codePoint) ||
	      (0x220F == codePoint) ||
	      (0x2211 == codePoint) ||
	      (0x2215 == codePoint) ||
	      (0x221A == codePoint) ||
	      (0x221D <= codePoint && codePoint <= 0x2220) ||
	      (0x2223 == codePoint) ||
	      (0x2225 == codePoint) ||
	      (0x2227 <= codePoint && codePoint <= 0x222C) ||
	      (0x222E == codePoint) ||
	      (0x2234 <= codePoint && codePoint <= 0x2237) ||
	      (0x223C <= codePoint && codePoint <= 0x223D) ||
	      (0x2248 == codePoint) ||
	      (0x224C == codePoint) ||
	      (0x2252 == codePoint) ||
	      (0x2260 <= codePoint && codePoint <= 0x2261) ||
	      (0x2264 <= codePoint && codePoint <= 0x2267) ||
	      (0x226A <= codePoint && codePoint <= 0x226B) ||
	      (0x226E <= codePoint && codePoint <= 0x226F) ||
	      (0x2282 <= codePoint && codePoint <= 0x2283) ||
	      (0x2286 <= codePoint && codePoint <= 0x2287) ||
	      (0x2295 == codePoint) ||
	      (0x2299 == codePoint) ||
	      (0x22A5 == codePoint) ||
	      (0x22BF == codePoint) ||
	      (0x2312 == codePoint) ||
	      (0x2460 <= codePoint && codePoint <= 0x24E9) ||
	      (0x24EB <= codePoint && codePoint <= 0x254B) ||
	      (0x2550 <= codePoint && codePoint <= 0x2573) ||
	      (0x2580 <= codePoint && codePoint <= 0x258F) ||
	      (0x2592 <= codePoint && codePoint <= 0x2595) ||
	      (0x25A0 <= codePoint && codePoint <= 0x25A1) ||
	      (0x25A3 <= codePoint && codePoint <= 0x25A9) ||
	      (0x25B2 <= codePoint && codePoint <= 0x25B3) ||
	      (0x25B6 <= codePoint && codePoint <= 0x25B7) ||
	      (0x25BC <= codePoint && codePoint <= 0x25BD) ||
	      (0x25C0 <= codePoint && codePoint <= 0x25C1) ||
	      (0x25C6 <= codePoint && codePoint <= 0x25C8) ||
	      (0x25CB == codePoint) ||
	      (0x25CE <= codePoint && codePoint <= 0x25D1) ||
	      (0x25E2 <= codePoint && codePoint <= 0x25E5) ||
	      (0x25EF == codePoint) ||
	      (0x2605 <= codePoint && codePoint <= 0x2606) ||
	      (0x2609 == codePoint) ||
	      (0x260E <= codePoint && codePoint <= 0x260F) ||
	      (0x2614 <= codePoint && codePoint <= 0x2615) ||
	      (0x261C == codePoint) ||
	      (0x261E == codePoint) ||
	      (0x2640 == codePoint) ||
	      (0x2642 == codePoint) ||
	      (0x2660 <= codePoint && codePoint <= 0x2661) ||
	      (0x2663 <= codePoint && codePoint <= 0x2665) ||
	      (0x2667 <= codePoint && codePoint <= 0x266A) ||
	      (0x266C <= codePoint && codePoint <= 0x266D) ||
	      (0x266F == codePoint) ||
	      (0x269E <= codePoint && codePoint <= 0x269F) ||
	      (0x26BE <= codePoint && codePoint <= 0x26BF) ||
	      (0x26C4 <= codePoint && codePoint <= 0x26CD) ||
	      (0x26CF <= codePoint && codePoint <= 0x26E1) ||
	      (0x26E3 == codePoint) ||
	      (0x26E8 <= codePoint && codePoint <= 0x26FF) ||
	      (0x273D == codePoint) ||
	      (0x2757 == codePoint) ||
	      (0x2776 <= codePoint && codePoint <= 0x277F) ||
	      (0x2B55 <= codePoint && codePoint <= 0x2B59) ||
	      (0x3248 <= codePoint && codePoint <= 0x324F) ||
	      (0xE000 <= codePoint && codePoint <= 0xF8FF) ||
	      (0xFE00 <= codePoint && codePoint <= 0xFE0F) ||
	      (0xFFFD == codePoint) ||
	      (0x1F100 <= codePoint && codePoint <= 0x1F10A) ||
	      (0x1F110 <= codePoint && codePoint <= 0x1F12D) ||
	      (0x1F130 <= codePoint && codePoint <= 0x1F169) ||
	      (0x1F170 <= codePoint && codePoint <= 0x1F19A) ||
	      (0xE0100 <= codePoint && codePoint <= 0xE01EF) ||
	      (0xF0000 <= codePoint && codePoint <= 0xFFFFD) ||
	      (0x100000 <= codePoint && codePoint <= 0x10FFFD)) {
	    return 'A';
	  }

	  return 'N';
	};

	eaw.characterLength = function(character) {
	  var code = this.eastAsianWidth(character);
	  if (code == 'F' || code == 'W' || code == 'A') {
	    return 2;
	  } else {
	    return 1;
	  }
	};

	// Split a string considering surrogate-pairs.
	function stringToArray(string) {
	  return string.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[^\uD800-\uDFFF]/g) || [];
	}

	eaw.length = function(string) {
	  var characters = stringToArray(string);
	  var len = 0;
	  for (var i = 0; i < characters.length; i++) {
	    len = len + this.characterLength(characters[i]);
	  }
	  return len;
	};

	eaw.slice = function(text, start, end) {
	  textLen = eaw.length(text);
	  start = start ? start : 0;
	  end = end ? end : 1;
	  if (start < 0) {
	      start = textLen + start;
	  }
	  if (end < 0) {
	      end = textLen + end;
	  }
	  var result = '';
	  var eawLen = 0;
	  var chars = stringToArray(text);
	  for (var i = 0; i < chars.length; i++) {
	    var char = chars[i];
	    var charLen = eaw.length(char);
	    if (eawLen >= start - (charLen == 2 ? 1 : 0)) {
	        if (eawLen + charLen <= end) {
	            result += char;
	        } else {
	            break;
	        }
	    }
	    eawLen += charLen;
	  }
	  return result;
	}; 
} (eastasianwidth));

var eastasianwidthExports = eastasianwidth.exports;
var eastAsianWidth = /*@__PURE__*/getDefaultExportFromCjs(eastasianwidthExports);

var emojiRegex = function () {
  // https://mths.be/emoji
  return /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67)\uDB40\uDC7F|(?:\uD83E\uDDD1\uD83C\uDFFF\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFC-\uDFFF])|\uD83D\uDC68(?:\uD83C\uDFFB(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF]))|\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|[\u2695\u2696\u2708]\uFE0F|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))?|(?:\uD83C[\uDFFC-\uDFFF])\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF]))|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])\uFE0F|\u200D(?:(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D[\uDC66\uDC67])|\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC)?|(?:\uD83D\uDC69(?:\uD83C\uDFFB\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|(?:\uD83C[\uDFFC-\uDFFF])\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69]))|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1)(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC69(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83E\uDDD1(?:\u200D(?:\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|\uD83D\uDE36\u200D\uD83C\uDF2B|\uD83C\uDFF3\uFE0F\u200D\u26A7|\uD83D\uDC3B\u200D\u2744|(?:(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\uD83C\uDFF4\u200D\u2620|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD])\u200D[\u2640\u2642]|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u2600-\u2604\u260E\u2611\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26B0\u26B1\u26C8\u26CF\u26D1\u26D3\u26E9\u26F0\u26F1\u26F4\u26F7\u26F8\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2763\u27A1\u2934\u2935\u2B05-\u2B07\u3030\u303D\u3297\u3299]|\uD83C[\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE37\uDF21\uDF24-\uDF2C\uDF36\uDF7D\uDF96\uDF97\uDF99-\uDF9B\uDF9E\uDF9F\uDFCD\uDFCE\uDFD4-\uDFDF\uDFF5\uDFF7]|\uD83D[\uDC3F\uDCFD\uDD49\uDD4A\uDD6F\uDD70\uDD73\uDD76-\uDD79\uDD87\uDD8A-\uDD8D\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA\uDECB\uDECD-\uDECF\uDEE0-\uDEE5\uDEE9\uDEF0\uDEF3])\uFE0F|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDE35\u200D\uD83D\uDCAB|\uD83D\uDE2E\u200D\uD83D\uDCA8|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83E\uDDD1(?:\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC|\uD83C\uDFFB)?|\uD83D\uDC69(?:\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC|\uD83C\uDFFB)?|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDF4\uD83C\uDDF2|\uD83D\uDC08\u200D\u2B1B|\u2764\uFE0F\u200D(?:\uD83D\uDD25|\uD83E\uDE79)|\uD83D\uDC41\uFE0F|\uD83C\uDFF3\uFE0F|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|[#\*0-9]\uFE0F\u20E3|\u2764\uFE0F|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])|\uD83C\uDFF4|(?:[\u270A\u270B]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270C\u270D]|\uD83D[\uDD74\uDD90])(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])|[\u270A\u270B]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC08\uDC15\uDC3B\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE2E\uDE35\uDE36\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5]|\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD]|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF]|[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF84\uDF86-\uDF93\uDFA0-\uDFC1\uDFC5\uDFC6\uDFC8\uDFC9\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC07\uDC09-\uDC14\uDC16-\uDC3A\uDC3C-\uDC3E\uDC40\uDC44\uDC45\uDC51-\uDC65\uDC6A\uDC79-\uDC7B\uDC7D-\uDC80\uDC84\uDC88-\uDC8E\uDC90\uDC92-\uDCA9\uDCAB-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDDA4\uDDFB-\uDE2D\uDE2F-\uDE34\uDE37-\uDE44\uDE48-\uDE4A\uDE80-\uDEA2\uDEA4-\uDEB3\uDEB7-\uDEBF\uDEC1-\uDEC5\uDED0-\uDED2\uDED5-\uDED7\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0D\uDD0E\uDD10-\uDD17\uDD1D\uDD20-\uDD25\uDD27-\uDD2F\uDD3A\uDD3F-\uDD45\uDD47-\uDD76\uDD78\uDD7A-\uDDB4\uDDB7\uDDBA\uDDBC-\uDDCB\uDDD0\uDDE0-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6]|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5-\uDED7\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDD78\uDD7A-\uDDCB\uDDCD-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26A7\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5-\uDED7\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDD78\uDD7A-\uDDCB\uDDCD-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDD77\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD])/g;
};

var emojiRegex$1 = /*@__PURE__*/getDefaultExportFromCjs(emojiRegex);

function stringWidth(string, options = {}) {
	if (typeof string !== 'string' || string.length === 0) {
		return 0;
	}

	options = {
		ambiguousIsNarrow: true,
		...options
	};

	string = stripAnsi(string);

	if (string.length === 0) {
		return 0;
	}

	string = string.replace(emojiRegex$1(), '  ');

	const ambiguousCharacterWidth = options.ambiguousIsNarrow ? 1 : 2;
	let width = 0;

	for (const character of string) {
		const codePoint = character.codePointAt(0);

		// Ignore control characters
		if (codePoint <= 0x1F || (codePoint >= 0x7F && codePoint <= 0x9F)) {
			continue;
		}

		// Ignore combining characters
		if (codePoint >= 0x300 && codePoint <= 0x36F) {
			continue;
		}

		const code = eastAsianWidth.eastAsianWidth(character);
		switch (code) {
			case 'F':
			case 'W':
				width += 2;
				break;
			case 'A':
				width += ambiguousCharacterWidth;
				break;
			default:
				width += 1;
		}
	}

	return width;
}

function getIndexOfNearestSpace(string, wantedIndex, shouldSearchRight) {
	if (string.charAt(wantedIndex) === ' ') {
		return wantedIndex;
	}

	for (let index = 1; index <= 3; index++) {
		if (shouldSearchRight) {
			if (string.charAt(wantedIndex + index) === ' ') {
				return wantedIndex + index;
			}
		} else if (string.charAt(wantedIndex - index) === ' ') {
			return wantedIndex - index;
		}
	}

	return wantedIndex;
}

function cliTruncate(text, columns, options) {
	options = {
		position: 'end',
		preferTruncationOnSpace: false,
		truncationCharacter: '…',
		...options,
	};

	const {position, space, preferTruncationOnSpace} = options;
	let {truncationCharacter} = options;

	if (typeof text !== 'string') {
		throw new TypeError(`Expected \`input\` to be a string, got ${typeof text}`);
	}

	if (typeof columns !== 'number') {
		throw new TypeError(`Expected \`columns\` to be a number, got ${typeof columns}`);
	}

	if (columns < 1) {
		return '';
	}

	if (columns === 1) {
		return truncationCharacter;
	}

	const length = stringWidth(text);

	if (length <= columns) {
		return text;
	}

	if (position === 'start') {
		if (preferTruncationOnSpace) {
			const nearestSpace = getIndexOfNearestSpace(text, length - columns + 1, true);
			return truncationCharacter + sliceAnsi(text, nearestSpace, length).trim();
		}

		if (space === true) {
			truncationCharacter += ' ';
		}

		return truncationCharacter + sliceAnsi(text, length - columns + stringWidth(truncationCharacter), length);
	}

	if (position === 'middle') {
		if (space === true) {
			truncationCharacter = ` ${truncationCharacter} `;
		}

		const half = Math.floor(columns / 2);

		if (preferTruncationOnSpace) {
			const spaceNearFirstBreakPoint = getIndexOfNearestSpace(text, half);
			const spaceNearSecondBreakPoint = getIndexOfNearestSpace(text, length - (columns - half) + 1, true);
			return sliceAnsi(text, 0, spaceNearFirstBreakPoint) + truncationCharacter + sliceAnsi(text, spaceNearSecondBreakPoint, length).trim();
		}

		return (
			sliceAnsi(text, 0, half)
				+ truncationCharacter
				+ sliceAnsi(text, length - (columns - half) + stringWidth(truncationCharacter), length)
		);
	}

	if (position === 'end') {
		if (preferTruncationOnSpace) {
			const nearestSpace = getIndexOfNearestSpace(text, columns - 1);
			return sliceAnsi(text, 0, nearestSpace) + truncationCharacter;
		}

		if (space === true) {
			truncationCharacter = ` ${truncationCharacter}`;
		}

		return sliceAnsi(text, 0, columns - stringWidth(truncationCharacter)) + truncationCharacter;
	}

	throw new Error(`Expected \`options.position\` to be either \`start\`, \`middle\` or \`end\`, got ${position}`);
}

const DURATION_LONG$1 = 300;
const outputMap$1 = /* @__PURE__ */ new WeakMap();
function formatFilepath$1(path) {
  const lastSlash = Math.max(path.lastIndexOf("/") + 1, 0);
  const basename = path.slice(lastSlash);
  let firstDot = basename.indexOf(".");
  if (firstDot < 0)
    firstDot = basename.length;
  firstDot += lastSlash;
  return c.dim(path.slice(0, lastSlash)) + path.slice(lastSlash, firstDot) + c.dim(path.slice(firstDot));
}
function formatNumber$1(number) {
  const res = String(number.toFixed(number < 100 ? 4 : 2)).split(".");
  return res[0].replace(/(?=(?:\d{3})+$)(?!\b)/g, ",") + (res[1] ? `.${res[1]}` : "");
}
function renderHookState(task, hookName, level = 0) {
  var _a, _b;
  const state = (_b = (_a = task.result) == null ? void 0 : _a.hooks) == null ? void 0 : _b[hookName];
  if (state && state === "run")
    return `${"  ".repeat(level)} ${getHookStateSymbol(task, hookName)} ${c.dim(`[ ${hookName} ]`)}`;
  return "";
}
function renderBenchmarkItems$1(result) {
  return [
    result.name,
    formatNumber$1(result.hz || 0),
    formatNumber$1(result.p99 || 0),
    `\xB1${result.rme.toFixed(2)}%`,
    result.samples.length.toString()
  ];
}
function renderBenchmark$1(task, tasks) {
  var _a;
  const result = (_a = task.result) == null ? void 0 : _a.benchmark;
  if (!result)
    return task.name;
  const benches = tasks.map((i) => {
    var _a2, _b;
    return ((_a2 = i.meta) == null ? void 0 : _a2.benchmark) ? (_b = i.result) == null ? void 0 : _b.benchmark : void 0;
  }).filter(notNullish);
  const allItems = benches.map(renderBenchmarkItems$1);
  const items = renderBenchmarkItems$1(result);
  const padded = items.map((i, idx) => {
    const width = Math.max(...allItems.map((i2) => i2[idx].length));
    return idx ? i.padStart(width, " ") : i.padEnd(width, " ");
  });
  return [
    padded[0],
    // name
    c.dim("  "),
    c.blue(padded[1]),
    c.dim(" ops/sec "),
    c.cyan(padded[3]),
    c.dim(` (${padded[4]} samples)`),
    result.rank === 1 ? c.bold(c.green(" fastest")) : result.rank === benches.length && benches.length > 2 ? c.bold(c.gray(" slowest")) : ""
  ].join("");
}
function renderTree$1(tasks, options, level = 0, maxRows) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i;
  const output = [];
  let currentRowCount = 0;
  for (const task of [...tasks].reverse()) {
    const taskOutput = [];
    let suffix = "";
    let prefix = ` ${getStateSymbol(task)} `;
    if (level === 0 && task.type === "suite" && task.projectName)
      prefix += formatProjectName(task.projectName);
    if (task.type === "test" && ((_a = task.result) == null ? void 0 : _a.retryCount) && task.result.retryCount > 0)
      suffix += c.yellow(` (retry x${task.result.retryCount})`);
    if (task.type === "suite" && !((_b = task.meta) == null ? void 0 : _b.typecheck)) {
      const tests = getTests(task);
      suffix += c.dim(` (${tests.length})`);
    }
    if (task.mode === "skip" || task.mode === "todo")
      suffix += ` ${c.dim(c.gray("[skipped]"))}`;
    if (task.type === "test" && ((_c = task.result) == null ? void 0 : _c.repeatCount) && task.result.repeatCount > 0)
      suffix += c.yellow(` (repeat x${task.result.repeatCount})`);
    if (((_d = task.result) == null ? void 0 : _d.duration) != null) {
      if (task.result.duration > DURATION_LONG$1)
        suffix += c.yellow(` ${Math.round(task.result.duration)}${c.dim("ms")}`);
    }
    if (options.showHeap && ((_e = task.result) == null ? void 0 : _e.heap) != null)
      suffix += c.magenta(` ${Math.floor(task.result.heap / 1024 / 1024)} MB heap used`);
    let name = task.name;
    if (level === 0)
      name = formatFilepath$1(name);
    const padding = "  ".repeat(level);
    const body = ((_f = task.meta) == null ? void 0 : _f.benchmark) ? renderBenchmark$1(task, tasks) : name;
    taskOutput.push(padding + prefix + body + suffix);
    if (((_g = task.result) == null ? void 0 : _g.state) !== "pass" && outputMap$1.get(task) != null) {
      let data = outputMap$1.get(task);
      if (typeof data === "string") {
        data = stripAnsi(data.trim().split("\n").filter(Boolean).pop());
        if (data === "")
          data = void 0;
      }
      if (data != null) {
        const out = `${"  ".repeat(level)}${F_RIGHT} ${data}`;
        taskOutput.push(`   ${c.gray(cliTruncate(out, getCols(-3)))}`);
      }
    }
    taskOutput.push(renderHookState(task, "beforeAll", level + 1));
    taskOutput.push(renderHookState(task, "beforeEach", level + 1));
    if (task.type === "suite" && task.tasks.length > 0) {
      if (((_h = task.result) == null ? void 0 : _h.state) === "fail" || ((_i = task.result) == null ? void 0 : _i.state) === "run" || options.renderSucceed) {
        if (options.logger.ctx.config.hideSkippedTests) {
          const filteredTasks = task.tasks.filter((t) => t.mode !== "skip" && t.mode !== "todo");
          taskOutput.push(renderTree$1(filteredTasks, options, level + 1, maxRows));
        } else {
          taskOutput.push(renderTree$1(task.tasks, options, level + 1, maxRows));
        }
      }
    }
    taskOutput.push(renderHookState(task, "afterAll", level + 1));
    taskOutput.push(renderHookState(task, "afterEach", level + 1));
    const rows = taskOutput.filter(Boolean);
    output.push(rows.join("\n"));
    currentRowCount += rows.length;
    if (maxRows && currentRowCount >= maxRows)
      break;
  }
  return output.reverse().join("\n");
}
function createListRenderer(_tasks, options) {
  let tasks = _tasks;
  let timer;
  const log = options.logger.logUpdate;
  function update() {
    if (options.logger.ctx.config.hideSkippedTests) {
      const filteredTasks = tasks.filter((t) => t.mode !== "skip" && t.mode !== "todo");
      log(renderTree$1(
        filteredTasks,
        options,
        0,
        // log-update already limits the amount of printed rows to fit the current terminal
        // but we can optimize performance by doing it ourselves
        process.stdout.rows
      ));
    } else {
      log(renderTree$1(
        tasks,
        options,
        0,
        // log-update already limits the amount of printed rows to fit the current terminal
        // but we can optimize performance by doing it ourselves
        process.stdout.rows
      ));
    }
  }
  return {
    start() {
      if (timer)
        return this;
      timer = setInterval(update, 16);
      return this;
    },
    update(_tasks2) {
      tasks = _tasks2;
      return this;
    },
    async stop() {
      if (timer) {
        clearInterval(timer);
        timer = void 0;
      }
      log.clear();
      if (options.logger.ctx.config.hideSkippedTests) {
        const filteredTasks = tasks.filter((t) => t.mode !== "skip" && t.mode !== "todo");
        options.logger.log(renderTree$1(filteredTasks, options));
      } else {
        options.logger.log(renderTree$1(tasks, options));
      }
      return this;
    },
    clear() {
      log.clear();
    }
  };
}

class DefaultReporter extends BaseReporter {
  renderer;
  rendererOptions = {};
  renderSucceedDefault;
  onPathsCollected(paths = []) {
    if (this.isTTY) {
      if (this.renderSucceedDefault === void 0)
        this.renderSucceedDefault = !!this.rendererOptions.renderSucceed;
      if (this.renderSucceedDefault !== true)
        this.rendererOptions.renderSucceed = paths.length <= 1;
    }
  }
  async onTestRemoved(trigger) {
    await this.stopListRender();
    this.ctx.logger.clearScreen(c.yellow("Test removed...") + (trigger ? c.dim(` [ ${this.relative(trigger)} ]
`) : ""), true);
    const files = this.ctx.state.getFiles(this.watchFilters);
    createListRenderer(files, this.rendererOptions).stop();
    this.ctx.logger.log();
    await super.reportSummary(files, this.ctx.state.getUnhandledErrors());
    super.onWatcherStart();
  }
  onCollected() {
    if (this.isTTY) {
      this.rendererOptions.logger = this.ctx.logger;
      this.rendererOptions.showHeap = this.ctx.config.logHeapUsage;
      this.rendererOptions.mode = this.mode;
      const files = this.ctx.state.getFiles(this.watchFilters);
      if (!this.renderer)
        this.renderer = createListRenderer(files, this.rendererOptions).start();
      else
        this.renderer.update(files);
    }
  }
  async onFinished(files = this.ctx.state.getFiles(), errors = this.ctx.state.getUnhandledErrors()) {
    await this.stopListRender();
    this.ctx.logger.log();
    await super.onFinished(files, errors);
  }
  async onWatcherStart(files = this.ctx.state.getFiles(), errors = this.ctx.state.getUnhandledErrors()) {
    await this.stopListRender();
    await super.onWatcherStart(files, errors);
  }
  async stopListRender() {
    var _a;
    await ((_a = this.renderer) == null ? void 0 : _a.stop());
    this.renderer = void 0;
  }
  async onWatcherRerun(files, trigger) {
    await this.stopListRender();
    await super.onWatcherRerun(files, trigger);
  }
  onUserConsoleLog(log) {
    var _a;
    if (!this.shouldLog(log))
      return;
    (_a = this.renderer) == null ? void 0 : _a.clear();
    super.onUserConsoleLog(log);
  }
}

const check = { char: "\xB7", color: c.green };
const cross = { char: "x", color: c.red };
const pending = { char: "*", color: c.yellow };
const skip = { char: "-", color: (char) => c.dim(c.gray(char)) };
function getIcon(task) {
  var _a;
  if (task.mode === "skip" || task.mode === "todo")
    return skip;
  switch ((_a = task.result) == null ? void 0 : _a.state) {
    case "pass":
      return check;
    case "fail":
      return cross;
    default:
      return pending;
  }
}
function render(tasks, width) {
  const all = getTests(tasks);
  let currentIcon = pending;
  let currentTasks = 0;
  let previousLineWidth = 0;
  let output = "";
  const addOutput = () => {
    const { char, color } = currentIcon;
    const availableWidth = width - previousLineWidth;
    if (availableWidth > currentTasks) {
      output += color(char.repeat(currentTasks));
      previousLineWidth += currentTasks;
    } else {
      let buf = `${char.repeat(availableWidth)}
`;
      const remaining = currentTasks - availableWidth;
      const fullRows = Math.floor(remaining / width);
      buf += `${char.repeat(width)}
`.repeat(fullRows);
      const partialRow = remaining % width;
      if (partialRow > 0) {
        buf += char.repeat(partialRow);
        previousLineWidth = partialRow;
      } else {
        previousLineWidth = 0;
      }
      output += color(buf);
    }
  };
  for (const task of all) {
    const icon = getIcon(task);
    if (icon === currentIcon) {
      currentTasks++;
      continue;
    }
    addOutput();
    currentTasks = 1;
    currentIcon = icon;
  }
  addOutput();
  return output;
}
function createDotRenderer(_tasks, options) {
  let tasks = _tasks;
  let timer;
  const { logUpdate: log, outputStream } = options.logger;
  function update() {
    log(render(tasks, outputStream.columns));
  }
  return {
    start() {
      if (timer)
        return this;
      timer = setInterval(update, 16);
      return this;
    },
    update(_tasks2) {
      tasks = _tasks2;
      return this;
    },
    async stop() {
      if (timer) {
        clearInterval(timer);
        timer = void 0;
      }
      log.clear();
      options.logger.log(render(tasks, outputStream.columns));
      return this;
    },
    clear() {
      log.clear();
    }
  };
}

class DotReporter extends BaseReporter {
  renderer;
  onCollected() {
    if (this.isTTY) {
      const files = this.ctx.state.getFiles(this.watchFilters);
      if (!this.renderer)
        this.renderer = createDotRenderer(files, { logger: this.ctx.logger }).start();
      else
        this.renderer.update(files);
    }
  }
  async onFinished(files = this.ctx.state.getFiles(), errors = this.ctx.state.getUnhandledErrors()) {
    await this.stopListRender();
    this.ctx.logger.log();
    await super.onFinished(files, errors);
  }
  async onWatcherStart() {
    await this.stopListRender();
    super.onWatcherStart();
  }
  async stopListRender() {
    var _a;
    (_a = this.renderer) == null ? void 0 : _a.stop();
    this.renderer = void 0;
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  async onWatcherRerun(files, trigger) {
    await this.stopListRender();
    await super.onWatcherRerun(files, trigger);
  }
  onUserConsoleLog(log) {
    var _a;
    (_a = this.renderer) == null ? void 0 : _a.clear();
    super.onUserConsoleLog(log);
  }
}

function getOutputFile(config, reporter) {
  if (!(config == null ? void 0 : config.outputFile))
    return;
  if (typeof config.outputFile === "string")
    return config.outputFile;
  return config.outputFile[reporter];
}

const StatusMap = {
  fail: "failed",
  only: "pending",
  pass: "passed",
  run: "pending",
  skip: "skipped",
  todo: "todo"
};
let JsonReporter$1 = class JsonReporter {
  start = 0;
  ctx;
  onInit(ctx) {
    this.ctx = ctx;
    this.start = Date.now();
  }
  async logTasks(files) {
    var _a, _b, _c;
    const suites = getSuites(files);
    const numTotalTestSuites = suites.length;
    const tests = getTests(files);
    const numTotalTests = tests.length;
    const numFailedTestSuites = suites.filter((s) => {
      var _a2;
      return (_a2 = s.result) == null ? void 0 : _a2.errors;
    }).length;
    const numPassedTestSuites = numTotalTestSuites - numFailedTestSuites;
    const numPendingTestSuites = suites.filter((s) => {
      var _a2;
      return ((_a2 = s.result) == null ? void 0 : _a2.state) === "run";
    }).length;
    const numFailedTests = tests.filter((t) => {
      var _a2;
      return ((_a2 = t.result) == null ? void 0 : _a2.state) === "fail";
    }).length;
    const numPassedTests = numTotalTests - numFailedTests;
    const numPendingTests = tests.filter((t) => {
      var _a2;
      return ((_a2 = t.result) == null ? void 0 : _a2.state) === "run";
    }).length;
    const numTodoTests = tests.filter((t) => t.mode === "todo").length;
    const testResults = [];
    const success = numFailedTestSuites === 0 && numFailedTests === 0;
    for (const file of files) {
      const tests2 = getTests([file]);
      let startTime = tests2.reduce((prev, next) => {
        var _a2;
        return Math.min(prev, ((_a2 = next.result) == null ? void 0 : _a2.startTime) ?? Number.POSITIVE_INFINITY);
      }, Number.POSITIVE_INFINITY);
      if (startTime === Number.POSITIVE_INFINITY)
        startTime = this.start;
      const endTime = tests2.reduce((prev, next) => {
        var _a2, _b2;
        return Math.max(prev, (((_a2 = next.result) == null ? void 0 : _a2.startTime) ?? 0) + (((_b2 = next.result) == null ? void 0 : _b2.duration) ?? 0));
      }, startTime);
      const assertionResults = await Promise.all(tests2.map(async (t) => {
        var _a2, _b2, _c2, _d;
        const ancestorTitles = [];
        let iter = t.suite;
        while (iter) {
          ancestorTitles.push(iter.name);
          iter = iter.suite;
        }
        ancestorTitles.reverse();
        return {
          ancestorTitles,
          fullName: ancestorTitles.length > 0 ? `${ancestorTitles.join(" ")} ${t.name}` : t.name,
          status: StatusMap[((_a2 = t.result) == null ? void 0 : _a2.state) || t.mode] || "skipped",
          title: t.name,
          duration: (_b2 = t.result) == null ? void 0 : _b2.duration,
          failureMessages: ((_d = (_c2 = t.result) == null ? void 0 : _c2.errors) == null ? void 0 : _d.map((e) => e.message)) || [],
          location: await this.getFailureLocation(t)
        };
      }));
      if (tests2.some((t) => {
        var _a2;
        return ((_a2 = t.result) == null ? void 0 : _a2.state) === "run";
      })) {
        this.ctx.logger.warn("WARNING: Some tests are still running when generating the JSON report.This is likely an internal bug in Vitest.Please report it to https://github.com/vitest-dev/vitest/issues");
      }
      testResults.push({
        assertionResults,
        startTime,
        endTime,
        status: tests2.some((t) => {
          var _a2;
          return ((_a2 = t.result) == null ? void 0 : _a2.state) === "fail";
        }) ? "failed" : "passed",
        message: ((_c = (_b = (_a = file.result) == null ? void 0 : _a.errors) == null ? void 0 : _b[0]) == null ? void 0 : _c.message) ?? "",
        name: file.filepath
      });
    }
    const result = {
      numTotalTestSuites,
      numPassedTestSuites,
      numFailedTestSuites,
      numPendingTestSuites,
      numTotalTests,
      numPassedTests,
      numFailedTests,
      numPendingTests,
      numTodoTests,
      startTime: this.start,
      success,
      testResults
    };
    await this.writeReport(JSON.stringify(result, null, 2));
  }
  async onFinished(files = this.ctx.state.getFiles()) {
    await this.logTasks(files);
  }
  /**
   * Writes the report to an output file if specified in the config,
   * or logs it to the console otherwise.
   * @param report
   */
  async writeReport(report) {
    const outputFile = getOutputFile(this.ctx.config, "json");
    if (outputFile) {
      const reportFile = resolve(this.ctx.config.root, outputFile);
      const outputDirectory = dirname(reportFile);
      if (!existsSync(outputDirectory))
        await promises.mkdir(outputDirectory, { recursive: true });
      await promises.writeFile(reportFile, report, "utf-8");
      this.ctx.logger.log(`JSON report written to ${reportFile}`);
    } else {
      this.ctx.logger.log(report);
    }
  }
  async getFailureLocation(test) {
    var _a, _b;
    const error = (_b = (_a = test.result) == null ? void 0 : _a.errors) == null ? void 0 : _b[0];
    if (!error)
      return;
    const project = this.ctx.getProjectByTaskId(test.id);
    const stack = parseErrorStacktrace(error, {
      getSourceMap: (file) => project.getBrowserSourceMapModuleById(file)
    });
    const frame = stack[0];
    if (!frame)
      return;
    return { line: frame.line, column: frame.column };
  }
};

class VerboseReporter extends DefaultReporter {
  constructor() {
    super();
    this.rendererOptions.renderSucceed = true;
  }
  onTaskUpdate(packs) {
    var _a, _b, _c, _d;
    if (this.isTTY)
      return;
    for (const pack of packs) {
      const task = this.ctx.state.idMap.get(pack[0]);
      if (task && task.type === "test" && ((_a = task.result) == null ? void 0 : _a.state) && ((_b = task.result) == null ? void 0 : _b.state) !== "run") {
        let title = ` ${getStateSymbol(task)} `;
        if ((_c = task.suite) == null ? void 0 : _c.projectName)
          title += formatProjectName(task.suite.projectName);
        title += getFullName(task, c.dim(" > "));
        if (this.ctx.config.logHeapUsage && task.result.heap != null)
          title += c.magenta(` ${Math.floor(task.result.heap / 1024 / 1024)} MB heap used`);
        this.ctx.logger.log(title);
        if (task.result.state === "fail") {
          (_d = task.result.errors) == null ? void 0 : _d.forEach((error) => {
            this.ctx.logger.log(c.red(`   ${F_RIGHT} ${error == null ? void 0 : error.message}`));
          });
        }
      }
    }
  }
}

class IndentedLogger {
  constructor(baseLog) {
    this.baseLog = baseLog;
  }
  currentIndent = "";
  indent() {
    this.currentIndent += "    ";
  }
  unindent() {
    this.currentIndent = this.currentIndent.substring(0, this.currentIndent.length - 4);
  }
  log(text) {
    return this.baseLog(this.currentIndent + text);
  }
}

function yamlString(str) {
  return `"${str.replace(/"/g, '\\"')}"`;
}
function tapString(str) {
  return str.replace(/\\/g, "\\\\").replace(/#/g, "\\#").replace(/\n/g, " ");
}
class TapReporter {
  ctx;
  logger;
  onInit(ctx) {
    this.ctx = ctx;
    this.logger = new IndentedLogger(ctx.logger.log.bind(ctx.logger));
  }
  static getComment(task) {
    var _a;
    if (task.mode === "skip")
      return " # SKIP";
    else if (task.mode === "todo")
      return " # TODO";
    else if (((_a = task.result) == null ? void 0 : _a.duration) != null)
      return ` # time=${task.result.duration.toFixed(2)}ms`;
    else
      return "";
  }
  logErrorDetails(error, stack) {
    this.logger.log(`name: ${yamlString(error.name)}`);
    this.logger.log(`message: ${yamlString(error.message)}`);
    if (stack) {
      this.logger.log(`stack: ${yamlString(`${stack.file}:${stack.line}:${stack.column}`)}`);
    }
  }
  logTasks(tasks) {
    var _a, _b;
    this.logger.log(`1..${tasks.length}`);
    for (const [i, task] of tasks.entries()) {
      const id = i + 1;
      const ok = ((_a = task.result) == null ? void 0 : _a.state) === "pass" || task.mode === "skip" || task.mode === "todo" ? "ok" : "not ok";
      const comment = TapReporter.getComment(task);
      if (task.type === "suite" && task.tasks.length > 0) {
        this.logger.log(`${ok} ${id} - ${tapString(task.name)}${comment} {`);
        this.logger.indent();
        this.logTasks(task.tasks);
        this.logger.unindent();
        this.logger.log("}");
      } else {
        this.logger.log(`${ok} ${id} - ${tapString(task.name)}${comment}`);
        const project = this.ctx.getProjectByTaskId(task.id);
        if (((_b = task.result) == null ? void 0 : _b.state) === "fail" && task.result.errors) {
          this.logger.indent();
          task.result.errors.forEach((error) => {
            const stacks = parseErrorStacktrace(error, {
              getSourceMap: (file) => project.getBrowserSourceMapModuleById(file)
            });
            const stack = stacks[0];
            this.logger.log("---");
            this.logger.log("error:");
            this.logger.indent();
            this.logErrorDetails(error);
            this.logger.unindent();
            if (stack)
              this.logger.log(`at: ${yamlString(`${stack.file}:${stack.line}:${stack.column}`)}`);
            if (error.showDiff) {
              this.logger.log(`actual: ${yamlString(error.actual)}`);
              this.logger.log(`expected: ${yamlString(error.expected)}`);
            }
          });
          this.logger.log("...");
          this.logger.unindent();
        }
      }
    }
  }
  async onFinished(files = this.ctx.state.getFiles()) {
    this.logger.log("TAP version 13");
    this.logTasks(files);
  }
}

function flattenTasks$1(task, baseName = "") {
  const base = baseName ? `${baseName} > ` : "";
  if (task.type === "suite") {
    return task.tasks.flatMap((child) => flattenTasks$1(child, `${base}${task.name}`));
  } else {
    return [{
      ...task,
      name: `${base}${task.name}`
    }];
  }
}
function removeInvalidXMLCharacters(value, removeDiscouragedChars) {
  let regex = /((?:[\0-\x08\x0B\f\x0E-\x1F\uFFFD\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]))/g;
  value = String(value || "").replace(regex, "");
  if (removeDiscouragedChars) {
    regex = new RegExp(
      "([\\x7F-\\x84]|[\\x86-\\x9F]|[\\uFDD0-\\uFDEF]|(?:\\uD83F[\\uDFFE\\uDFFF])|(?:\\uD87F[\\uDFFE\\uDFFF])|(?:\\uD8BF[\\uDFFE\\uDFFF])|(?:\\uD8FF[\\uDFFE\\uDFFF])|(?:\\uD93F[\\uDFFE\\uDFFF])|(?:\\uD97F[\\uDFFE\\uDFFF])|(?:\\uD9BF[\\uDFFE\\uDFFF])|(?:\\uD9FF[\\uDFFE\\uDFFF])|(?:\\uDA3F[\\uDFFE\\uDFFF])|(?:\\uDA7F[\\uDFFE\\uDFFF])|(?:\\uDABF[\\uDFFE\\uDFFF])|(?:\\uDAFF[\\uDFFE\\uDFFF])|(?:\\uDB3F[\\uDFFE\\uDFFF])|(?:\\uDB7F[\\uDFFE\\uDFFF])|(?:\\uDBBF[\\uDFFE\\uDFFF])|(?:\\uDBFF[\\uDFFE\\uDFFF])(?:[\\0-\\t\\x0B\\f\\x0E-\\u2027\\u202A-\\uD7FF\\uE000-\\uFFFF]|[\\uD800-\\uDBFF][\\uDC00-\\uDFFF]|[\\uD800-\\uDBFF](?![\\uDC00-\\uDFFF])|(?:[^\\uD800-\\uDBFF]|^)[\\uDC00-\\uDFFF]))",
      "g"
    );
    value = value.replace(regex, "");
  }
  return value;
}
function escapeXML(value) {
  return removeInvalidXMLCharacters(
    String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/</g, "&lt;").replace(/>/g, "&gt;"),
    true
  );
}
function executionTime(durationMS) {
  return (durationMS / 1e3).toLocaleString("en-US", { useGrouping: false, maximumFractionDigits: 10 });
}
function getDuration(task) {
  var _a;
  const duration = ((_a = task.result) == null ? void 0 : _a.duration) ?? 0;
  return executionTime(duration);
}
class JUnitReporter {
  ctx;
  reportFile;
  baseLog;
  logger;
  _timeStart = /* @__PURE__ */ new Date();
  fileFd;
  async onInit(ctx) {
    this.ctx = ctx;
    const outputFile = getOutputFile(this.ctx.config, "junit");
    if (outputFile) {
      this.reportFile = resolve(this.ctx.config.root, outputFile);
      const outputDirectory = dirname(this.reportFile);
      if (!existsSync(outputDirectory))
        await promises.mkdir(outputDirectory, { recursive: true });
      const fileFd = await promises.open(this.reportFile, "w+");
      this.fileFd = fileFd;
      this.baseLog = async (text) => {
        if (!this.fileFd)
          this.fileFd = await promises.open(this.reportFile, "w+");
        await promises.writeFile(this.fileFd, `${text}
`);
      };
    } else {
      this.baseLog = async (text) => this.ctx.logger.log(text);
    }
    this._timeStart = /* @__PURE__ */ new Date();
    this.logger = new IndentedLogger(this.baseLog);
  }
  async writeElement(name, attrs, children) {
    const pairs = [];
    for (const key in attrs) {
      const attr = attrs[key];
      if (attr === void 0)
        continue;
      pairs.push(`${key}="${escapeXML(attr)}"`);
    }
    await this.logger.log(`<${name}${pairs.length ? ` ${pairs.join(" ")}` : ""}>`);
    this.logger.indent();
    await children.call(this);
    this.logger.unindent();
    await this.logger.log(`</${name}>`);
  }
  async writeErrorDetails(task, error) {
    const errorName = error.name ?? error.nameStr ?? "Unknown Error";
    const errorDetails = `${errorName}: ${error.message}`;
    await this.baseLog(escapeXML(errorDetails));
    const project = this.ctx.getProjectByTaskId(task.id);
    const stack = parseErrorStacktrace(error, {
      getSourceMap: (file) => project.getBrowserSourceMapModuleById(file)
    });
    for (const frame of stack) {
      const path = relative(this.ctx.config.root, frame.file);
      await this.baseLog(escapeXML(` ${F_POINTER} ${[frame.method, `${path}:${frame.line}:${frame.column}`].filter(Boolean).join(" ")}`));
      if (frame.file in this.ctx.state.filesMap)
        break;
    }
  }
  async writeLogs(task, type) {
    if (task.logs == null || task.logs.length === 0)
      return;
    const logType = type === "err" ? "stderr" : "stdout";
    const logs = task.logs.filter((log) => log.type === logType);
    if (logs.length === 0)
      return;
    await this.writeElement(`system-${type}`, {}, async () => {
      for (const log of logs)
        await this.baseLog(escapeXML(log.content));
    });
  }
  async writeTasks(tasks, filename) {
    for (const task of tasks) {
      await this.writeElement("testcase", {
        classname: process.env.VITEST_JUNIT_CLASSNAME ?? filename,
        name: task.name,
        time: getDuration(task)
      }, async () => {
        var _a, _b;
        await this.writeLogs(task, "out");
        await this.writeLogs(task, "err");
        if (task.mode === "skip" || task.mode === "todo")
          await this.logger.log("<skipped/>");
        if (((_a = task.result) == null ? void 0 : _a.state) === "fail") {
          const errors = ((_b = task.result.errors) == null ? void 0 : _b.length) ? task.result.errors : [task.result.error];
          for (const error of errors) {
            await this.writeElement("failure", {
              message: error == null ? void 0 : error.message,
              type: (error == null ? void 0 : error.name) ?? (error == null ? void 0 : error.nameStr)
            }, async () => {
              if (!error)
                return;
              await this.writeErrorDetails(task, error);
            });
          }
        }
      });
    }
  }
  async onFinished(files = this.ctx.state.getFiles()) {
    var _a;
    await this.logger.log('<?xml version="1.0" encoding="UTF-8" ?>');
    const transformed = files.map((file) => {
      const tasks = file.tasks.flatMap((task) => flattenTasks$1(task));
      const stats2 = tasks.reduce(
        (stats3, task) => {
          var _a2, _b;
          return {
            passed: stats3.passed + Number(((_a2 = task.result) == null ? void 0 : _a2.state) === "pass"),
            failures: stats3.failures + Number(((_b = task.result) == null ? void 0 : _b.state) === "fail"),
            skipped: stats3.skipped + Number(task.mode === "skip" || task.mode === "todo")
          };
        },
        {
          passed: 0,
          failures: 0,
          skipped: 0
        }
      );
      return {
        ...file,
        tasks,
        stats: stats2
      };
    });
    const stats = transformed.reduce((stats2, file) => {
      stats2.tests += file.tasks.length;
      stats2.failures += file.stats.failures;
      return stats2;
    }, {
      name: process.env.VITEST_JUNIT_SUITE_NAME || "vitest tests",
      tests: 0,
      failures: 0,
      errors: 0,
      // we cannot detect those
      time: executionTime((/* @__PURE__ */ new Date()).getTime() - this._timeStart.getTime())
    });
    await this.writeElement("testsuites", stats, async () => {
      for (const file of transformed) {
        await this.writeElement("testsuite", {
          name: file.name,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          hostname: hostname(),
          tests: file.tasks.length,
          failures: file.stats.failures,
          errors: 0,
          // An errored test is one that had an unanticipated problem. We cannot detect those.
          skipped: file.stats.skipped,
          time: getDuration(file)
        }, async () => {
          await this.writeTasks(file.tasks, file.name);
        });
      }
    });
    if (this.reportFile)
      this.ctx.logger.log(`JUNIT report written to ${this.reportFile}`);
    await ((_a = this.fileFd) == null ? void 0 : _a.close());
    this.fileFd = void 0;
  }
}

function flattenTasks(task, baseName = "") {
  const base = baseName ? `${baseName} > ` : "";
  if (task.type === "suite" && task.tasks.length > 0) {
    return task.tasks.flatMap((child) => flattenTasks(child, `${base}${task.name}`));
  } else {
    return [{
      ...task,
      name: `${base}${task.name}`
    }];
  }
}
class TapFlatReporter extends TapReporter {
  onInit(ctx) {
    super.onInit(ctx);
  }
  async onFinished(files = this.ctx.state.getFiles()) {
    this.ctx.logger.log("TAP version 13");
    const flatTasks = files.flatMap((task) => flattenTasks(task));
    this.logTasks(flatTasks);
  }
}

class HangingProcessReporter {
  whyRunning;
  onInit() {
    const _require = createRequire(import.meta.url);
    this.whyRunning = _require("why-is-node-running");
  }
  onProcessTimeout() {
    var _a;
    (_a = this.whyRunning) == null ? void 0 : _a.call(this);
  }
}

class JsonReporter {
  start = 0;
  ctx;
  onInit(ctx) {
    this.ctx = ctx;
  }
  async logTasks(files) {
    var _a;
    const suites = getSuites(files);
    const numTotalTestSuites = suites.length;
    const tests = getTests(files);
    const numTotalTests = tests.length;
    const testResults = {};
    const outputFile = getOutputFile(this.ctx.config.benchmark, "json");
    for (const file of files) {
      const tests2 = getTests([file]);
      for (const test of tests2) {
        const res = (_a = test.result) == null ? void 0 : _a.benchmark;
        if (!res || test.mode === "skip")
          continue;
        if (!outputFile)
          res.samples = "ignore on terminal";
        testResults[test.suite.name] = (testResults[test.suite.name] || []).concat(res);
      }
      if (tests2.some((t) => {
        var _a2;
        return ((_a2 = t.result) == null ? void 0 : _a2.state) === "run";
      })) {
        this.ctx.logger.warn("WARNING: Some tests are still running when generating the json report.This is likely an internal bug in Vitest.Please report it to https://github.com/vitest-dev/vitest/issues");
      }
    }
    const result = {
      numTotalTestSuites,
      numTotalTests,
      testResults
    };
    await this.writeReport(JSON.stringify(result, null, 2));
  }
  async onFinished(files = this.ctx.state.getFiles()) {
    await this.logTasks(files);
  }
  /**
   * Writes the report to an output file if specified in the config,
   * or logs it to the console otherwise.
   * @param report
   */
  async writeReport(report) {
    const outputFile = getOutputFile(this.ctx.config.benchmark, "json");
    if (outputFile) {
      const reportFile = resolve(this.ctx.config.root, outputFile);
      const outputDirectory = dirname(reportFile);
      if (!existsSync(outputDirectory))
        await promises.mkdir(outputDirectory, { recursive: true });
      await promises.writeFile(reportFile, report, "utf-8");
      this.ctx.logger.log(`json report written to ${reportFile}`);
    } else {
      this.ctx.logger.log(report);
    }
  }
}

const DURATION_LONG = 300;
const outputMap = /* @__PURE__ */ new WeakMap();
function formatFilepath(path) {
  const lastSlash = Math.max(path.lastIndexOf("/") + 1, 0);
  const basename = path.slice(lastSlash);
  let firstDot = basename.indexOf(".");
  if (firstDot < 0)
    firstDot = basename.length;
  firstDot += lastSlash;
  return c.dim(path.slice(0, lastSlash)) + path.slice(lastSlash, firstDot) + c.dim(path.slice(firstDot));
}
function formatNumber(number) {
  const res = String(number.toFixed(number < 100 ? 4 : 2)).split(".");
  return res[0].replace(/(?=(?:\d{3})+$)(?!\b)/g, ",") + (res[1] ? `.${res[1]}` : "");
}
const tableHead = ["name", "hz", "min", "max", "mean", "p75", "p99", "p995", "p999", "rme", "samples"];
function renderTableHead(tasks) {
  const benches = tasks.map((i) => {
    var _a, _b;
    return ((_a = i.meta) == null ? void 0 : _a.benchmark) ? (_b = i.result) == null ? void 0 : _b.benchmark : void 0;
  }).filter(notNullish);
  const allItems = benches.map(renderBenchmarkItems).concat([tableHead]);
  return `${" ".repeat(3)}${tableHead.map((i, idx) => {
    const width = Math.max(...allItems.map((i2) => i2[idx].length));
    return idx ? i.padStart(width, " ") : i.padEnd(width, " ");
  }).map(c.bold).join("  ")}`;
}
function renderBenchmarkItems(result) {
  return [
    result.name,
    formatNumber(result.hz || 0),
    formatNumber(result.min || 0),
    formatNumber(result.max || 0),
    formatNumber(result.mean || 0),
    formatNumber(result.p75 || 0),
    formatNumber(result.p99 || 0),
    formatNumber(result.p995 || 0),
    formatNumber(result.p999 || 0),
    `\xB1${(result.rme || 0).toFixed(2)}%`,
    result.samples.length.toString()
  ];
}
function renderBenchmark(task, tasks) {
  var _a;
  const result = (_a = task.result) == null ? void 0 : _a.benchmark;
  if (!result)
    return task.name;
  const benches = tasks.map((i) => {
    var _a2, _b;
    return ((_a2 = i.meta) == null ? void 0 : _a2.benchmark) ? (_b = i.result) == null ? void 0 : _b.benchmark : void 0;
  }).filter(notNullish);
  const allItems = benches.map(renderBenchmarkItems).concat([tableHead]);
  const items = renderBenchmarkItems(result);
  const padded = items.map((i, idx) => {
    const width = Math.max(...allItems.map((i2) => i2[idx].length));
    return idx ? i.padStart(width, " ") : i.padEnd(width, " ");
  });
  return [
    padded[0],
    // name
    c.blue(padded[1]),
    // hz
    c.cyan(padded[2]),
    // min
    c.cyan(padded[3]),
    // max
    c.cyan(padded[4]),
    // mean
    c.cyan(padded[5]),
    // p75
    c.cyan(padded[6]),
    // p99
    c.cyan(padded[7]),
    // p995
    c.cyan(padded[8]),
    // p999
    c.dim(padded[9]),
    // rem
    c.dim(padded[10]),
    // sample
    result.rank === 1 ? c.bold(c.green(" fastest")) : result.rank === benches.length && benches.length > 2 ? c.bold(c.gray(" slowest")) : ""
  ].join("  ");
}
function renderTree(tasks, options, level = 0) {
  var _a, _b, _c, _d, _e, _f;
  const output = [];
  let idx = 0;
  for (const task of tasks) {
    const padding = "  ".repeat(level ? 1 : 0);
    let prefix = "";
    if (idx === 0 && ((_a = task.meta) == null ? void 0 : _a.benchmark))
      prefix += `${renderTableHead(tasks)}
${padding}`;
    prefix += ` ${getStateSymbol(task)} `;
    let suffix = "";
    if (task.type === "suite")
      suffix += c.dim(` (${getTests(task).length})`);
    if (task.mode === "skip" || task.mode === "todo")
      suffix += ` ${c.dim(c.gray("[skipped]"))}`;
    if (((_b = task.result) == null ? void 0 : _b.duration) != null) {
      if (task.result.duration > DURATION_LONG)
        suffix += c.yellow(` ${Math.round(task.result.duration)}${c.dim("ms")}`);
    }
    if (options.showHeap && ((_c = task.result) == null ? void 0 : _c.heap) != null)
      suffix += c.magenta(` ${Math.floor(task.result.heap / 1024 / 1024)} MB heap used`);
    let name = task.name;
    if (level === 0)
      name = formatFilepath(name);
    const body = ((_d = task.meta) == null ? void 0 : _d.benchmark) ? renderBenchmark(task, tasks) : name;
    output.push(padding + prefix + body + suffix);
    if (((_e = task.result) == null ? void 0 : _e.state) !== "pass" && outputMap.get(task) != null) {
      let data = outputMap.get(task);
      if (typeof data === "string") {
        data = stripAnsi(data.trim().split("\n").filter(Boolean).pop());
        if (data === "")
          data = void 0;
      }
      if (data != null) {
        const out = `${"  ".repeat(level)}${F_RIGHT} ${data}`;
        output.push(`   ${c.gray(cliTruncate(out, getCols(-3)))}`);
      }
    }
    if (task.type === "suite" && task.tasks.length > 0) {
      if ((_f = task.result) == null ? void 0 : _f.state)
        output.push(renderTree(task.tasks, options, level + 1));
    }
    idx++;
  }
  return output.filter(Boolean).join("\n");
}
function createTableRenderer(_tasks, options) {
  let tasks = _tasks;
  let timer;
  const log = options.logger.logUpdate;
  function update() {
    log(renderTree(tasks, options));
  }
  return {
    start() {
      if (timer)
        return this;
      timer = setInterval(update, 200);
      return this;
    },
    update(_tasks2) {
      tasks = _tasks2;
      update();
      return this;
    },
    async stop() {
      if (timer) {
        clearInterval(timer);
        timer = void 0;
      }
      log.clear();
      options.logger.log(renderTree(tasks, options));
      return this;
    },
    clear() {
      log.clear();
    }
  };
}

class TableReporter extends BaseReporter {
  renderer;
  rendererOptions = {};
  async onTestRemoved(trigger) {
    await this.stopListRender();
    this.ctx.logger.clearScreen(c.yellow("Test removed...") + (trigger ? c.dim(` [ ${this.relative(trigger)} ]
`) : ""), true);
    const files = this.ctx.state.getFiles(this.watchFilters);
    createTableRenderer(files, this.rendererOptions).stop();
    this.ctx.logger.log();
    await super.reportSummary(files, this.ctx.state.getUnhandledErrors());
    super.onWatcherStart();
  }
  onCollected() {
    if (this.isTTY) {
      this.rendererOptions.logger = this.ctx.logger;
      this.rendererOptions.showHeap = this.ctx.config.logHeapUsage;
      const files = this.ctx.state.getFiles(this.watchFilters);
      if (!this.renderer)
        this.renderer = createTableRenderer(files, this.rendererOptions).start();
      else
        this.renderer.update(files);
    }
  }
  async onFinished(files = this.ctx.state.getFiles(), errors = this.ctx.state.getUnhandledErrors()) {
    await this.stopListRender();
    this.ctx.logger.log();
    await super.onFinished(files, errors);
  }
  async onWatcherStart() {
    await this.stopListRender();
    await super.onWatcherStart();
  }
  async stopListRender() {
    var _a;
    await ((_a = this.renderer) == null ? void 0 : _a.stop());
    this.renderer = void 0;
  }
  async onWatcherRerun(files, trigger) {
    await this.stopListRender();
    await super.onWatcherRerun(files, trigger);
  }
  onUserConsoleLog(log) {
    var _a;
    if (!this.shouldLog(log))
      return;
    (_a = this.renderer) == null ? void 0 : _a.clear();
    super.onUserConsoleLog(log);
  }
}

const BenchmarkReportsMap = {
  default: TableReporter,
  verbose: VerboseReporter,
  json: JsonReporter
};

const ReportersMap = {
  "default": DefaultReporter,
  "basic": BasicReporter,
  "verbose": VerboseReporter,
  "dot": DotReporter,
  "json": JsonReporter$1,
  "tap": TapReporter,
  "tap-flat": TapFlatReporter,
  "junit": JUnitReporter,
  "hanging-process": HangingProcessReporter
};

async function loadCustomReporterModule(path, runner) {
  let customReporterModule;
  try {
    customReporterModule = await runner.executeId(path);
  } catch (customReporterModuleError) {
    throw new Error(`Failed to load custom Reporter from ${path}`, { cause: customReporterModuleError });
  }
  if (customReporterModule.default === null || customReporterModule.default === void 0)
    throw new Error(`Custom reporter loaded from ${path} was not the default export`);
  return customReporterModule.default;
}
function createReporters(reporterReferences, runner) {
  const promisedReporters = reporterReferences.map(async (referenceOrInstance) => {
    if (typeof referenceOrInstance === "string") {
      if (referenceOrInstance === "html") {
        await ensurePackageInstalled("@vitest/ui", runner.root);
        const CustomReporter = await loadCustomReporterModule("@vitest/ui/reporter", runner);
        return new CustomReporter();
      } else if (referenceOrInstance in ReportersMap) {
        const BuiltinReporter = ReportersMap[referenceOrInstance];
        return new BuiltinReporter();
      } else {
        const CustomReporter = await loadCustomReporterModule(referenceOrInstance, runner);
        return new CustomReporter();
      }
    }
    return referenceOrInstance;
  });
  return Promise.all(promisedReporters);
}
function createBenchmarkReporters(reporterReferences, runner) {
  const promisedReporters = reporterReferences.map(async (referenceOrInstance) => {
    if (typeof referenceOrInstance === "string") {
      if (referenceOrInstance in BenchmarkReportsMap) {
        const BuiltinReporter = BenchmarkReportsMap[referenceOrInstance];
        return new BuiltinReporter();
      } else {
        const CustomReporter = await loadCustomReporterModule(referenceOrInstance, runner);
        return new CustomReporter();
      }
    }
    return referenceOrInstance;
  });
  return Promise.all(promisedReporters);
}

function isAggregateError(err) {
  if (typeof AggregateError !== "undefined" && err instanceof AggregateError)
    return true;
  return err instanceof Error && "errors" in err;
}
class StateManager {
  filesMap = /* @__PURE__ */ new Map();
  pathsSet = /* @__PURE__ */ new Set();
  browserTestPromises = /* @__PURE__ */ new Map();
  idMap = /* @__PURE__ */ new Map();
  taskFileMap = /* @__PURE__ */ new WeakMap();
  errorsSet = /* @__PURE__ */ new Set();
  processTimeoutCauses = /* @__PURE__ */ new Set();
  catchError(err, type) {
    if (isAggregateError(err))
      return err.errors.forEach((error) => this.catchError(error, type));
    if (err === Object(err))
      err.type = type;
    else
      err = { type, message: err };
    this.errorsSet.add(err);
  }
  clearErrors() {
    this.errorsSet.clear();
  }
  getUnhandledErrors() {
    return Array.from(this.errorsSet.values());
  }
  addProcessTimeoutCause(cause) {
    this.processTimeoutCauses.add(cause);
  }
  getProcessTimeoutCauses() {
    return Array.from(this.processTimeoutCauses.values());
  }
  getPaths() {
    return Array.from(this.pathsSet);
  }
  getFiles(keys) {
    if (keys)
      return keys.map((key) => this.filesMap.get(key)).filter(Boolean).flat();
    return Array.from(this.filesMap.values()).flat();
  }
  getFilepaths() {
    return Array.from(this.filesMap.keys());
  }
  getFailedFilepaths() {
    return this.getFiles().filter((i) => {
      var _a;
      return ((_a = i.result) == null ? void 0 : _a.state) === "fail";
    }).map((i) => i.filepath);
  }
  collectPaths(paths = []) {
    paths.forEach((path) => {
      this.pathsSet.add(path);
    });
  }
  collectFiles(files = []) {
    files.forEach((file) => {
      const existing = this.filesMap.get(file.filepath) || [];
      const otherProject = existing.filter((i) => i.projectName !== file.projectName);
      otherProject.push(file);
      this.filesMap.set(file.filepath, otherProject);
      this.updateId(file);
    });
  }
  // this file is reused by ws-client, and shoult not rely on heavy dependencies like workspace
  clearFiles(_project, paths = []) {
    const project = _project;
    paths.forEach((path) => {
      const files = this.filesMap.get(path);
      if (!files)
        return;
      const filtered = files.filter((file) => file.projectName !== project.config.name);
      if (!filtered.length)
        this.filesMap.delete(path);
      else
        this.filesMap.set(path, filtered);
    });
  }
  updateId(task) {
    if (this.idMap.get(task.id) === task)
      return;
    this.idMap.set(task.id, task);
    if (task.type === "suite") {
      task.tasks.forEach((task2) => {
        this.updateId(task2);
      });
    }
  }
  updateTasks(packs) {
    for (const [id, result, meta] of packs) {
      const task = this.idMap.get(id);
      if (task) {
        task.result = result;
        task.meta = meta;
      }
    }
  }
  updateUserLog(log) {
    const task = log.taskId && this.idMap.get(log.taskId);
    if (task) {
      if (!task.logs)
        task.logs = [];
      task.logs.push(log);
    }
  }
  getCountOfFailedTests() {
    return Array.from(this.idMap.values()).filter((t) => {
      var _a;
      return ((_a = t.result) == null ? void 0 : _a.state) === "fail";
    }).length;
  }
  cancelFiles(files, root) {
    this.collectFiles(files.map((filepath) => ({
      filepath,
      name: relative(root, filepath),
      id: filepath,
      mode: "skip",
      type: "suite",
      result: {
        state: "skip"
      },
      meta: {},
      // Cancelled files have not yet collected tests
      tasks: []
    })));
  }
}

const defaultInclude = ["**/*.{test,spec}.?(c|m)[jt]s?(x)"];
const defaultExclude = ["**/node_modules/**", "**/dist/**", "**/cypress/**", "**/.{idea,git,cache,output,temp}/**", "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*"];
const benchmarkConfigDefaults = {
  include: ["**/*.{bench,benchmark}.?(c|m)[jt]s?(x)"],
  exclude: defaultExclude,
  includeSource: [],
  reporters: ["default"]
};
const defaultCoverageExcludes = [
  "coverage/**",
  "dist/**",
  "packages/*/test?(s)/**",
  "**/*.d.ts",
  "**/virtual:*",
  "**/__x00__*",
  "**/\0*",
  "cypress/**",
  "test?(s)/**",
  "test?(-*).?(c|m)[jt]s?(x)",
  "**/*{.,-}{test,spec}.?(c|m)[jt]s?(x)",
  "**/__tests__/**",
  "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
  "**/.{eslint,mocha,prettier}rc.{?(c|m)js,yml}"
];
const coverageConfigDefaults = {
  provider: "v8",
  enabled: false,
  clean: true,
  cleanOnRerun: true,
  reportsDirectory: "./coverage",
  exclude: defaultCoverageExcludes,
  reportOnFailure: false,
  reporter: [["text", {}], ["html", {}], ["clover", {}], ["json", {}]],
  extension: [".js", ".cjs", ".mjs", ".ts", ".mts", ".cts", ".tsx", ".jsx", ".vue", ".svelte"]
};
const fakeTimersDefaults = {
  loopLimit: 1e4,
  shouldClearNativeTimers: true,
  toFake: [
    "setTimeout",
    "clearTimeout",
    "setInterval",
    "clearInterval",
    "setImmediate",
    "clearImmediate",
    "Date"
  ]
};
const config = {
  allowOnly: !isCI,
  watch: !isCI,
  globals: false,
  environment: "node",
  threads: true,
  clearMocks: false,
  restoreMocks: false,
  mockReset: false,
  include: defaultInclude,
  exclude: defaultExclude,
  testTimeout: 5e3,
  hookTimeout: 1e4,
  teardownTimeout: 1e4,
  isolate: true,
  watchExclude: ["**/node_modules/**", "**/dist/**"],
  forceRerunTriggers: [
    "**/package.json/**",
    "**/{vitest,vite}.config.*/**"
  ],
  update: false,
  reporters: [],
  silent: false,
  hideSkippedTests: false,
  api: false,
  ui: false,
  uiBase: "/__vitest__/",
  open: true,
  css: {
    include: []
  },
  coverage: coverageConfigDefaults,
  fakeTimers: fakeTimersDefaults,
  maxConcurrency: 5,
  dangerouslyIgnoreUnhandledErrors: false,
  typecheck: {
    checker: "tsc",
    include: ["**/*.{test,spec}-d.?(c|m)[jt]s?(x)"],
    exclude: defaultExclude
  },
  slowTestThreshold: 300
};
const configDefaults = Object.freeze(config);

function getDefaultThreadsCount(config) {
  return config.watch ? Math.max(Math.floor(cpus().length / 2), 1) : Math.max(cpus().length - 1, 1);
}
function getWorkerMemoryLimit(config) {
  if (config.experimentalVmWorkerMemoryLimit)
    return config.experimentalVmWorkerMemoryLimit;
  return 1 / (config.maxThreads ?? getDefaultThreadsCount(config));
}
function stringToBytes(input, percentageReference) {
  if (input === null || input === void 0)
    return input;
  if (typeof input === "string") {
    if (Number.isNaN(Number.parseFloat(input.slice(-1)))) {
      let [, numericString, trailingChars] = input.match(/(.*?)([^0-9.-]+)$/i) || [];
      if (trailingChars && numericString) {
        const numericValue = Number.parseFloat(numericString);
        trailingChars = trailingChars.toLowerCase();
        switch (trailingChars) {
          case "%":
            input = numericValue / 100;
            break;
          case "kb":
          case "k":
            return numericValue * 1e3;
          case "kib":
            return numericValue * 1024;
          case "mb":
          case "m":
            return numericValue * 1e3 * 1e3;
          case "mib":
            return numericValue * 1024 * 1024;
          case "gb":
          case "g":
            return numericValue * 1e3 * 1e3 * 1e3;
          case "gib":
            return numericValue * 1024 * 1024 * 1024;
        }
      }
    } else {
      input = Number.parseFloat(input);
    }
  }
  if (typeof input === "number") {
    if (input <= 1 && input > 0) {
      if (percentageReference) {
        return Math.floor(input * percentageReference);
      } else {
        throw new Error(
          "For a percentage based memory limit a percentageReference must be supplied"
        );
      }
    } else if (input > 1) {
      return Math.floor(input);
    } else {
      throw new Error('Unexpected numerical input for "experimentalVmWorkerMemoryLimit"');
    }
  }
  return null;
}

class FilesStatsCache {
  cache = /* @__PURE__ */ new Map();
  getStats(key) {
    return this.cache.get(key);
  }
  async populateStats(root, specs) {
    const promises = specs.map((spec) => {
      const key = `${spec[0].getName()}:${relative(root, spec[1])}`;
      return this.updateStats(spec[1], key);
    });
    await Promise.all(promises);
  }
  async updateStats(fsPath, key) {
    if (!fs$8.existsSync(fsPath))
      return;
    const stats = await fs$8.promises.stat(fsPath);
    this.cache.set(key, { size: stats.size });
  }
  removeStats(fsPath) {
    this.cache.forEach((_, key) => {
      if (key.endsWith(fsPath))
        this.cache.delete(key);
    });
  }
}

class ResultsCache {
  cache = /* @__PURE__ */ new Map();
  workspacesKeyMap = /* @__PURE__ */ new Map();
  cachePath = null;
  version = version$1;
  root = "/";
  getCachePath() {
    return this.cachePath;
  }
  setConfig(root, config) {
    this.root = root;
    if (config)
      this.cachePath = resolve(config.dir, "results.json");
  }
  getResults(key) {
    return this.cache.get(key);
  }
  async readFromCache() {
    if (!this.cachePath)
      return;
    if (!fs$8.existsSync(this.cachePath))
      return;
    const resultsCache = await fs$8.promises.readFile(this.cachePath, "utf8");
    const { results, version: version2 } = JSON.parse(resultsCache || "[]");
    if (Number(version2.split(".")[1]) >= 30) {
      this.cache = new Map(results);
      this.version = version2;
      results.forEach(([spec]) => {
        const [projectName, relativePath] = spec.split(":");
        const keyMap = this.workspacesKeyMap.get(relativePath) || [];
        keyMap.push(projectName);
        this.workspacesKeyMap.set(relativePath, keyMap);
      });
    }
  }
  updateResults(files) {
    files.forEach((file) => {
      const result = file.result;
      if (!result)
        return;
      const duration = result.duration || 0;
      const relativePath = relative(this.root, file.filepath);
      this.cache.set(`${file.projectName || ""}:${relativePath}`, {
        duration: duration >= 0 ? duration : 0,
        failed: result.state === "fail"
      });
    });
  }
  removeFromCache(filepath) {
    this.cache.forEach((_, key) => {
      if (key.endsWith(filepath))
        this.cache.delete(key);
    });
  }
  async writeToCache() {
    if (!this.cachePath)
      return;
    const results = Array.from(this.cache.entries());
    const cacheDirname = dirname(this.cachePath);
    if (!fs$8.existsSync(cacheDirname))
      await fs$8.promises.mkdir(cacheDirname, { recursive: true });
    const cache = JSON.stringify({
      version: this.version,
      results
    });
    await fs$8.promises.writeFile(this.cachePath, cache);
  }
}

class VitestCache {
  results = new ResultsCache();
  stats = new FilesStatsCache();
  getFileTestResults(key) {
    return this.results.getResults(key);
  }
  getFileStats(key) {
    return this.stats.getStats(key);
  }
  static resolveCacheDir(root, dir) {
    return resolve(root, slash$1(dir || "node_modules/.vitest"));
  }
  static async clearCache(options) {
    var _a, _b;
    const root = resolve(options.root || process.cwd());
    const configPath = options.config === false ? false : options.config ? resolve(root, options.config) : await findUp(configFiles, { cwd: root });
    const config = configPath ? (_a = await loadConfigFromFile({ command: "serve", mode: "test" }, configPath)) == null ? void 0 : _a.config : void 0;
    const cache = (_b = config == null ? void 0 : config.test) == null ? void 0 : _b.cache;
    if (cache === false)
      throw new Error("Cache is disabled");
    const cachePath = VitestCache.resolveCacheDir(root, cache == null ? void 0 : cache.dir);
    let cleared = false;
    if (fs$8.existsSync(cachePath)) {
      fs$8.rmSync(cachePath, { recursive: true, force: true });
      cleared = true;
    }
    return { dir: cachePath, cleared };
  }
}

class BaseSequencer {
  ctx;
  constructor(ctx) {
    this.ctx = ctx;
  }
  // async so it can be extended by other sequelizers
  async shard(files) {
    const { config } = this.ctx;
    const { index, count } = config.shard;
    const shardSize = Math.ceil(files.length / count);
    const shardStart = shardSize * (index - 1);
    const shardEnd = shardSize * index;
    return [...files].map((spec) => {
      const fullPath = resolve(slash$2(config.root), slash$2(spec[1]));
      const specPath = fullPath == null ? void 0 : fullPath.slice(config.root.length);
      return {
        spec,
        hash: createHash("sha1").update(specPath).digest("hex")
      };
    }).sort((a, b) => a.hash < b.hash ? -1 : a.hash > b.hash ? 1 : 0).slice(shardStart, shardEnd).map(({ spec }) => spec);
  }
  // async so it can be extended by other sequelizers
  async sort(files) {
    const cache = this.ctx.cache;
    return [...files].sort((a, b) => {
      const keyA = `${a[0].getName()}:${relative(this.ctx.config.root, a[1])}`;
      const keyB = `${b[0].getName()}:${relative(this.ctx.config.root, b[1])}`;
      const aState = cache.getFileTestResults(keyA);
      const bState = cache.getFileTestResults(keyB);
      if (!aState || !bState) {
        const statsA = cache.getFileStats(keyA);
        const statsB = cache.getFileStats(keyB);
        if (!statsA || !statsB)
          return !statsA && statsB ? -1 : !statsB && statsA ? 1 : 0;
        return statsB.size - statsA.size;
      }
      if (aState.failed && !bState.failed)
        return -1;
      if (!aState.failed && bState.failed)
        return 1;
      return bState.duration - aState.duration;
    });
  }
}

class RandomSequencer extends BaseSequencer {
  async sort(files) {
    const { sequence } = this.ctx.config;
    return shuffle(files, sequence.seed);
  }
}

const extraInlineDeps = [
  /^(?!.*(?:node_modules)).*\.mjs$/,
  /^(?!.*(?:node_modules)).*\.cjs\.js$/,
  // Vite client
  /vite\w*\/dist\/client\/env.mjs/,
  // Nuxt
  "@nuxt/test-utils"
];
function resolveApiServerConfig(options) {
  let api;
  if (options.ui && !options.api)
    api = { port: defaultPort };
  else if (options.api === true)
    api = { port: defaultPort };
  else if (typeof options.api === "number")
    api = { port: options.api };
  if (typeof options.api === "object") {
    if (api) {
      if (options.api.port)
        api.port = options.api.port;
      if (options.api.strictPort)
        api.strictPort = options.api.strictPort;
      if (options.api.host)
        api.host = options.api.host;
    } else {
      api = { ...options.api };
    }
  }
  if (api) {
    if (!api.port)
      api.port = defaultPort;
  }
  return api;
}
function resolveConfig(mode, options, viteConfig) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
  if (options.dom) {
    if (((_a = viteConfig.test) == null ? void 0 : _a.environment) != null && viteConfig.test.environment !== "happy-dom") {
      console.warn(
        c.yellow(
          `${c.inverse(c.yellow(" Vitest "))} Your config.test.environment ("${viteConfig.test.environment}") conflicts with --dom flag ("happy-dom"), ignoring "${viteConfig.test.environment}"`
        )
      );
    }
    options.environment = "happy-dom";
  }
  const resolved = {
    ...configDefaults,
    ...options,
    root: viteConfig.root,
    mode
  };
  resolved.inspect = Boolean(resolved.inspect);
  resolved.inspectBrk = Boolean(resolved.inspectBrk);
  resolved.singleThread = Boolean(resolved.singleThread);
  if (viteConfig.base !== "/")
    resolved.base = viteConfig.base;
  if (options.shard) {
    if (resolved.watch)
      throw new Error("You cannot use --shard option with enabled watch");
    const [indexString, countString] = options.shard.split("/");
    const index = Math.abs(Number.parseInt(indexString, 10));
    const count = Math.abs(Number.parseInt(countString, 10));
    if (Number.isNaN(count) || count <= 0)
      throw new Error("--shard <count> must be a positive number");
    if (Number.isNaN(index) || index <= 0 || index > count)
      throw new Error("--shard <index> must be a positive number less then <count>");
    resolved.shard = { index, count };
  }
  if (resolved.inspect || resolved.inspectBrk) {
    if (resolved.threads !== false && resolved.singleThread !== true) {
      const inspectOption = `--inspect${resolved.inspectBrk ? "-brk" : ""}`;
      throw new Error(`You cannot use ${inspectOption} without "threads: false" or "singleThread: true"`);
    }
  }
  if (resolved.coverage.provider === "c8")
    throw new Error('"coverage.provider: c8" is not supported anymore. Use "coverage.provider: v8" instead');
  if (resolved.coverage.provider === "v8" && resolved.coverage.enabled && isBrowserEnabled(resolved))
    throw new Error("@vitest/coverage-v8 does not work with --browser. Use @vitest/coverage-istanbul instead");
  resolved.deps ?? (resolved.deps = {});
  (_b = resolved.deps).moduleDirectories ?? (_b.moduleDirectories = []);
  resolved.deps.moduleDirectories = resolved.deps.moduleDirectories.map((dir) => {
    if (!dir.startsWith("/"))
      dir = `/${dir}`;
    if (!dir.endsWith("/"))
      dir += "/";
    return normalize(dir);
  });
  if (!resolved.deps.moduleDirectories.includes("/node_modules/"))
    resolved.deps.moduleDirectories.push("/node_modules/");
  resolved.server ?? (resolved.server = {});
  (_c = resolved.server).deps ?? (_c.deps = {});
  const deprecatedDepsOptions = ["inline", "external", "fallbackCJS"];
  deprecatedDepsOptions.forEach((option) => {
    if (resolved.deps[option] === void 0)
      return;
    if (option === "fallbackCJS") {
      console.warn(c.yellow(`${c.inverse(c.yellow(" Vitest "))} "deps.${option}" is deprecated. Use "server.deps.${option}" instead`));
    } else {
      const transformMode = resolved.environment === "happy-dom" || resolved.environment === "jsdom" ? "web" : "ssr";
      console.warn(
        c.yellow(
          `${c.inverse(c.yellow(" Vitest "))} "deps.${option}" is deprecated. If you rely on vite-node directly, use "server.deps.${option}" instead. Otherwise, consider using "deps.optimizer.${transformMode}.${option === "external" ? "exclude" : "include"}"`
        )
      );
    }
    if (resolved.server.deps[option] === void 0)
      resolved.server.deps[option] = resolved.deps[option];
  });
  if (resolved.server.deps.inline !== true) {
    const ssrOptions = viteConfig.ssr;
    if ((ssrOptions == null ? void 0 : ssrOptions.noExternal) === true && resolved.server.deps.inline == null) {
      resolved.server.deps.inline = true;
    } else {
      (_d = resolved.server.deps).inline ?? (_d.inline = []);
      resolved.server.deps.inline.push(...extraInlineDeps);
    }
  }
  (_e = resolved.server.deps).moduleDirectories ?? (_e.moduleDirectories = []);
  resolved.server.deps.moduleDirectories.push(...resolved.deps.moduleDirectories);
  if (resolved.runner) {
    resolved.runner = resolveModule(resolved.runner, { paths: [resolved.root] }) ?? resolve(resolved.root, resolved.runner);
  }
  if (resolved.deps.registerNodeLoader) {
    const transformMode = resolved.environment === "happy-dom" || resolved.environment === "jsdom" ? "web" : "ssr";
    console.warn(
      c.yellow(
        `${c.inverse(c.yellow(" Vitest "))} "deps.registerNodeLoader" is deprecated.If you rely on aliases inside external packages, use "deps.optimizer.${transformMode}.include" instead.`
      )
    );
  }
  resolved.testNamePattern = resolved.testNamePattern ? resolved.testNamePattern instanceof RegExp ? resolved.testNamePattern : new RegExp(resolved.testNamePattern) : void 0;
  const UPDATE_SNAPSHOT = resolved.update || process.env.UPDATE_SNAPSHOT;
  resolved.snapshotOptions = {
    snapshotFormat: resolved.snapshotFormat || {},
    updateSnapshot: isCI && !UPDATE_SNAPSHOT ? "none" : UPDATE_SNAPSHOT ? "all" : "new",
    resolveSnapshotPath: options.resolveSnapshotPath,
    // resolved inside the worker
    snapshotEnvironment: null
  };
  resolved.experimentalVmWorkerMemoryLimit = stringToBytes(
    getWorkerMemoryLimit(resolved),
    totalmem()
  );
  if (options.resolveSnapshotPath)
    delete resolved.resolveSnapshotPath;
  if (process.env.VITEST_MAX_THREADS)
    resolved.maxThreads = Number.parseInt(process.env.VITEST_MAX_THREADS);
  if (process.env.VITEST_MIN_THREADS)
    resolved.minThreads = Number.parseInt(process.env.VITEST_MIN_THREADS);
  if (mode === "benchmark") {
    resolved.benchmark = {
      ...benchmarkConfigDefaults,
      ...resolved.benchmark
    };
    resolved.coverage.enabled = false;
    resolved.include = resolved.benchmark.include;
    resolved.exclude = resolved.benchmark.exclude;
    resolved.includeSource = resolved.benchmark.includeSource;
    const reporters = Array.from(/* @__PURE__ */ new Set([
      ...toArray(resolved.benchmark.reporters),
      // @ts-expect-error reporter is CLI flag
      ...toArray(options.reporter)
    ])).filter(Boolean);
    if (reporters.length)
      resolved.benchmark.reporters = reporters;
    else
      resolved.benchmark.reporters = ["default"];
    if (options.outputFile)
      resolved.benchmark.outputFile = options.outputFile;
  }
  resolved.setupFiles = toArray(resolved.setupFiles || []).map(
    (file) => normalize(
      resolveModule(file, { paths: [resolved.root] }) ?? resolve(resolved.root, file)
    )
  );
  resolved.coverage.exclude.push(...resolved.setupFiles.map((file) => relative(resolved.root, file)));
  resolved.forceRerunTriggers = [
    ...resolved.forceRerunTriggers,
    ...resolved.setupFiles
  ];
  resolved.api = resolveApiServerConfig(options);
  if (options.related)
    resolved.related = toArray(options.related).map((file) => resolve(resolved.root, file));
  if (mode !== "benchmark") {
    const cliReporters = toArray(resolved.reporter || []).map((reporter) => {
      if (/^\.\.?\//.test(reporter))
        return resolve(process.cwd(), reporter);
      return reporter;
    });
    const reporters = cliReporters.length ? cliReporters : resolved.reporters;
    resolved.reporters = Array.from(new Set(toArray(reporters))).filter(Boolean);
  }
  if (!resolved.reporters.length)
    resolved.reporters.push("default");
  if (resolved.changed)
    resolved.passWithNoTests ?? (resolved.passWithNoTests = true);
  resolved.css ?? (resolved.css = {});
  if (typeof resolved.css === "object") {
    (_f = resolved.css).modules ?? (_f.modules = {});
    (_g = resolved.css.modules).classNameStrategy ?? (_g.classNameStrategy = "stable");
  }
  resolved.cache ?? (resolved.cache = { dir: "" });
  if (resolved.cache)
    resolved.cache.dir = VitestCache.resolveCacheDir(resolved.root, resolved.cache.dir);
  resolved.sequence ?? (resolved.sequence = {});
  if (!((_h = resolved.sequence) == null ? void 0 : _h.sequencer)) {
    resolved.sequence.sequencer = resolved.sequence.shuffle ? RandomSequencer : BaseSequencer;
  }
  (_i = resolved.sequence).hooks ?? (_i.hooks = "parallel");
  if (resolved.sequence.sequencer === RandomSequencer)
    (_j = resolved.sequence).seed ?? (_j.seed = Date.now());
  resolved.typecheck = {
    ...configDefaults.typecheck,
    ...resolved.typecheck
  };
  resolved.environmentMatchGlobs = (resolved.environmentMatchGlobs || []).map((i) => [resolve(resolved.root, i[0]), i[1]]);
  if (mode === "typecheck") {
    resolved.include = resolved.typecheck.include;
    resolved.exclude = resolved.typecheck.exclude;
  }
  resolved.browser ?? (resolved.browser = {});
  (_k = resolved.browser).enabled ?? (_k.enabled = false);
  (_l = resolved.browser).headless ?? (_l.headless = isCI);
  (_m = resolved.browser).slowHijackESM ?? (_m.slowHijackESM = true);
  resolved.browser.api = resolveApiServerConfig(resolved.browser) || {
    port: defaultBrowserPort
  };
  resolved.testTransformMode ?? (resolved.testTransformMode = {});
  return resolved;
}
function isBrowserEnabled(config) {
  var _a, _b;
  if ((_a = config.browser) == null ? void 0 : _a.enabled)
    return true;
  return ((_b = config.poolMatchGlobs) == null ? void 0 : _b.length) && config.poolMatchGlobs.some(([, pool]) => pool === "browser");
}

const ESC$1 = '\u001B[';
const OSC = '\u001B]';
const BEL = '\u0007';
const SEP = ';';
const isTerminalApp = process.env.TERM_PROGRAM === 'Apple_Terminal';

const ansiEscapes = {};

ansiEscapes.cursorTo = (x, y) => {
	if (typeof x !== 'number') {
		throw new TypeError('The `x` argument is required');
	}

	if (typeof y !== 'number') {
		return ESC$1 + (x + 1) + 'G';
	}

	return ESC$1 + (y + 1) + ';' + (x + 1) + 'H';
};

ansiEscapes.cursorMove = (x, y) => {
	if (typeof x !== 'number') {
		throw new TypeError('The `x` argument is required');
	}

	let returnValue = '';

	if (x < 0) {
		returnValue += ESC$1 + (-x) + 'D';
	} else if (x > 0) {
		returnValue += ESC$1 + x + 'C';
	}

	if (y < 0) {
		returnValue += ESC$1 + (-y) + 'A';
	} else if (y > 0) {
		returnValue += ESC$1 + y + 'B';
	}

	return returnValue;
};

ansiEscapes.cursorUp = (count = 1) => ESC$1 + count + 'A';
ansiEscapes.cursorDown = (count = 1) => ESC$1 + count + 'B';
ansiEscapes.cursorForward = (count = 1) => ESC$1 + count + 'C';
ansiEscapes.cursorBackward = (count = 1) => ESC$1 + count + 'D';

ansiEscapes.cursorLeft = ESC$1 + 'G';
ansiEscapes.cursorSavePosition = isTerminalApp ? '\u001B7' : ESC$1 + 's';
ansiEscapes.cursorRestorePosition = isTerminalApp ? '\u001B8' : ESC$1 + 'u';
ansiEscapes.cursorGetPosition = ESC$1 + '6n';
ansiEscapes.cursorNextLine = ESC$1 + 'E';
ansiEscapes.cursorPrevLine = ESC$1 + 'F';
ansiEscapes.cursorHide = ESC$1 + '?25l';
ansiEscapes.cursorShow = ESC$1 + '?25h';

ansiEscapes.eraseLines = count => {
	let clear = '';

	for (let i = 0; i < count; i++) {
		clear += ansiEscapes.eraseLine + (i < count - 1 ? ansiEscapes.cursorUp() : '');
	}

	if (count) {
		clear += ansiEscapes.cursorLeft;
	}

	return clear;
};

ansiEscapes.eraseEndLine = ESC$1 + 'K';
ansiEscapes.eraseStartLine = ESC$1 + '1K';
ansiEscapes.eraseLine = ESC$1 + '2K';
ansiEscapes.eraseDown = ESC$1 + 'J';
ansiEscapes.eraseUp = ESC$1 + '1J';
ansiEscapes.eraseScreen = ESC$1 + '2J';
ansiEscapes.scrollUp = ESC$1 + 'S';
ansiEscapes.scrollDown = ESC$1 + 'T';

ansiEscapes.clearScreen = '\u001Bc';

ansiEscapes.clearTerminal = process.platform === 'win32' ?
	`${ansiEscapes.eraseScreen}${ESC$1}0f` :
	// 1. Erases the screen (Only done in case `2` is not supported)
	// 2. Erases the whole screen including scrollback buffer
	// 3. Moves cursor to the top-left position
	// More info: https://www.real-world-systems.com/docs/ANSIcode.html
	`${ansiEscapes.eraseScreen}${ESC$1}3J${ESC$1}H`;

ansiEscapes.beep = BEL;

ansiEscapes.link = (text, url) => {
	return [
		OSC,
		'8',
		SEP,
		SEP,
		url,
		BEL,
		text,
		OSC,
		'8',
		SEP,
		SEP,
		BEL
	].join('');
};

ansiEscapes.image = (buffer, options = {}) => {
	let returnValue = `${OSC}1337;File=inline=1`;

	if (options.width) {
		returnValue += `;width=${options.width}`;
	}

	if (options.height) {
		returnValue += `;height=${options.height}`;
	}

	if (options.preserveAspectRatio === false) {
		returnValue += ';preserveAspectRatio=0';
	}

	return returnValue + ':' + buffer.toString('base64') + BEL;
};

ansiEscapes.iTerm = {
	setCwd: (cwd = process.cwd()) => `${OSC}50;CurrentDir=${cwd}${BEL}`,

	annotation: (message, options = {}) => {
		let returnValue = `${OSC}1337;`;

		const hasX = typeof options.x !== 'undefined';
		const hasY = typeof options.y !== 'undefined';
		if ((hasX || hasY) && !(hasX && hasY && typeof options.length !== 'undefined')) {
			throw new Error('`x`, `y` and `length` must be defined when `x` or `y` is defined');
		}

		message = message.replace(/\|/g, '');

		returnValue += options.isHidden ? 'AddHiddenAnnotation=' : 'AddAnnotation=';

		if (options.length > 0) {
			returnValue +=
					(hasX ?
						[message, options.length, options.x, options.y] :
						[options.length, message]).join('|');
		} else {
			returnValue += message;
		}

		return returnValue + BEL;
	}
};

var onetime$2 = {exports: {}};

var mimicFn$2 = {exports: {}};

const mimicFn$1 = (to, from) => {
	for (const prop of Reflect.ownKeys(from)) {
		Object.defineProperty(to, prop, Object.getOwnPropertyDescriptor(from, prop));
	}

	return to;
};

mimicFn$2.exports = mimicFn$1;
// TODO: Remove this for the next major release
mimicFn$2.exports.default = mimicFn$1;

var mimicFnExports = mimicFn$2.exports;

const mimicFn = mimicFnExports;

const calledFunctions = new WeakMap();

const onetime = (function_, options = {}) => {
	if (typeof function_ !== 'function') {
		throw new TypeError('Expected a function');
	}

	let returnValue;
	let callCount = 0;
	const functionName = function_.displayName || function_.name || '<anonymous>';

	const onetime = function (...arguments_) {
		calledFunctions.set(onetime, ++callCount);

		if (callCount === 1) {
			returnValue = function_.apply(this, arguments_);
			function_ = null;
		} else if (options.throw === true) {
			throw new Error(`Function \`${functionName}\` can only be called once`);
		}

		return returnValue;
	};

	mimicFn(onetime, function_);
	calledFunctions.set(onetime, callCount);

	return onetime;
};

onetime$2.exports = onetime;
// TODO: Remove this for the next major release
onetime$2.exports.default = onetime;

onetime$2.exports.callCount = function_ => {
	if (!calledFunctions.has(function_)) {
		throw new Error(`The given function \`${function_.name}\` is not wrapped by the \`onetime\` package`);
	}

	return calledFunctions.get(function_);
};

var onetimeExports = onetime$2.exports;
var onetime$1 = /*@__PURE__*/getDefaultExportFromCjs(onetimeExports);

const restoreCursor = onetime$1(() => {
	onExit(() => {
		process$1.stderr.write('\u001B[?25h');
	}, {alwaysLast: true});
});

let isHidden = false;

const cliCursor = {};

cliCursor.show = (writableStream = process$1.stderr) => {
	if (!writableStream.isTTY) {
		return;
	}

	isHidden = false;
	writableStream.write('\u001B[?25h');
};

cliCursor.hide = (writableStream = process$1.stderr) => {
	if (!writableStream.isTTY) {
		return;
	}

	restoreCursor();
	isHidden = true;
	writableStream.write('\u001B[?25l');
};

cliCursor.toggle = (force, writableStream) => {
	if (force !== undefined) {
		isHidden = force;
	}

	if (isHidden) {
		cliCursor.show(writableStream);
	} else {
		cliCursor.hide(writableStream);
	}
};

const ESCAPES = new Set([
	'\u001B',
	'\u009B',
]);

const END_CODE = 39;
const ANSI_ESCAPE_BELL = '\u0007';
const ANSI_CSI = '[';
const ANSI_OSC = ']';
const ANSI_SGR_TERMINATOR = 'm';
const ANSI_ESCAPE_LINK = `${ANSI_OSC}8;;`;

const wrapAnsiCode = code => `${ESCAPES.values().next().value}${ANSI_CSI}${code}${ANSI_SGR_TERMINATOR}`;
const wrapAnsiHyperlink = uri => `${ESCAPES.values().next().value}${ANSI_ESCAPE_LINK}${uri}${ANSI_ESCAPE_BELL}`;

// Calculate the length of words split on ' ', ignoring
// the extra characters added by ansi escape codes
const wordLengths = string => string.split(' ').map(character => stringWidth(character));

// Wrap a long word across multiple rows
// Ansi escape codes do not count towards length
const wrapWord = (rows, word, columns) => {
	const characters = [...word];

	let isInsideEscape = false;
	let isInsideLinkEscape = false;
	let visible = stringWidth(stripAnsi(rows[rows.length - 1]));

	for (const [index, character] of characters.entries()) {
		const characterLength = stringWidth(character);

		if (visible + characterLength <= columns) {
			rows[rows.length - 1] += character;
		} else {
			rows.push(character);
			visible = 0;
		}

		if (ESCAPES.has(character)) {
			isInsideEscape = true;
			isInsideLinkEscape = characters.slice(index + 1).join('').startsWith(ANSI_ESCAPE_LINK);
		}

		if (isInsideEscape) {
			if (isInsideLinkEscape) {
				if (character === ANSI_ESCAPE_BELL) {
					isInsideEscape = false;
					isInsideLinkEscape = false;
				}
			} else if (character === ANSI_SGR_TERMINATOR) {
				isInsideEscape = false;
			}

			continue;
		}

		visible += characterLength;

		if (visible === columns && index < characters.length - 1) {
			rows.push('');
			visible = 0;
		}
	}

	// It's possible that the last row we copy over is only
	// ansi escape characters, handle this edge-case
	if (!visible && rows[rows.length - 1].length > 0 && rows.length > 1) {
		rows[rows.length - 2] += rows.pop();
	}
};

// Trims spaces from a string ignoring invisible sequences
const stringVisibleTrimSpacesRight = string => {
	const words = string.split(' ');
	let last = words.length;

	while (last > 0) {
		if (stringWidth(words[last - 1]) > 0) {
			break;
		}

		last--;
	}

	if (last === words.length) {
		return string;
	}

	return words.slice(0, last).join(' ') + words.slice(last).join('');
};

// The wrap-ansi module can be invoked in either 'hard' or 'soft' wrap mode
//
// 'hard' will never allow a string to take up more than columns characters
//
// 'soft' allows long words to expand past the column length
const exec = (string, columns, options = {}) => {
	if (options.trim !== false && string.trim() === '') {
		return '';
	}

	let returnValue = '';
	let escapeCode;
	let escapeUrl;

	const lengths = wordLengths(string);
	let rows = [''];

	for (const [index, word] of string.split(' ').entries()) {
		if (options.trim !== false) {
			rows[rows.length - 1] = rows[rows.length - 1].trimStart();
		}

		let rowLength = stringWidth(rows[rows.length - 1]);

		if (index !== 0) {
			if (rowLength >= columns && (options.wordWrap === false || options.trim === false)) {
				// If we start with a new word but the current row length equals the length of the columns, add a new row
				rows.push('');
				rowLength = 0;
			}

			if (rowLength > 0 || options.trim === false) {
				rows[rows.length - 1] += ' ';
				rowLength++;
			}
		}

		// In 'hard' wrap mode, the length of a line is never allowed to extend past 'columns'
		if (options.hard && lengths[index] > columns) {
			const remainingColumns = (columns - rowLength);
			const breaksStartingThisLine = 1 + Math.floor((lengths[index] - remainingColumns - 1) / columns);
			const breaksStartingNextLine = Math.floor((lengths[index] - 1) / columns);
			if (breaksStartingNextLine < breaksStartingThisLine) {
				rows.push('');
			}

			wrapWord(rows, word, columns);
			continue;
		}

		if (rowLength + lengths[index] > columns && rowLength > 0 && lengths[index] > 0) {
			if (options.wordWrap === false && rowLength < columns) {
				wrapWord(rows, word, columns);
				continue;
			}

			rows.push('');
		}

		if (rowLength + lengths[index] > columns && options.wordWrap === false) {
			wrapWord(rows, word, columns);
			continue;
		}

		rows[rows.length - 1] += word;
	}

	if (options.trim !== false) {
		rows = rows.map(row => stringVisibleTrimSpacesRight(row));
	}

	const pre = [...rows.join('\n')];

	for (const [index, character] of pre.entries()) {
		returnValue += character;

		if (ESCAPES.has(character)) {
			const {groups} = new RegExp(`(?:\\${ANSI_CSI}(?<code>\\d+)m|\\${ANSI_ESCAPE_LINK}(?<uri>.*)${ANSI_ESCAPE_BELL})`).exec(pre.slice(index).join('')) || {groups: {}};
			if (groups.code !== undefined) {
				const code = Number.parseFloat(groups.code);
				escapeCode = code === END_CODE ? undefined : code;
			} else if (groups.uri !== undefined) {
				escapeUrl = groups.uri.length === 0 ? undefined : groups.uri;
			}
		}

		const code = ansiStyles.codes.get(Number(escapeCode));

		if (pre[index + 1] === '\n') {
			if (escapeUrl) {
				returnValue += wrapAnsiHyperlink('');
			}

			if (escapeCode && code) {
				returnValue += wrapAnsiCode(code);
			}
		} else if (character === '\n') {
			if (escapeCode && code) {
				returnValue += wrapAnsiCode(escapeCode);
			}

			if (escapeUrl) {
				returnValue += wrapAnsiHyperlink(escapeUrl);
			}
		}
	}

	return returnValue;
};

// For each newline, invoke the method separately
function wrapAnsi(string, columns, options) {
	return String(string)
		.normalize()
		.replace(/\r\n/g, '\n')
		.split('\n')
		.map(line => exec(line, columns, options))
		.join('\n');
}

const defaultTerminalHeight = 24;

const getWidth = stream => {
	const {columns} = stream;

	if (!columns) {
		return 80;
	}

	return columns;
};

const fitToTerminalHeight = (stream, text) => {
	const terminalHeight = stream.rows || defaultTerminalHeight;
	const lines = text.split('\n');

	const toRemove = lines.length - terminalHeight;
	if (toRemove <= 0) {
		return text;
	}

	return sliceAnsi(
		text,
		stripAnsi(lines.slice(0, toRemove).join('\n')).length + 1,
	);
};

function createLogUpdate(stream, {showCursor = false} = {}) {
	let previousLineCount = 0;
	let previousWidth = getWidth(stream);
	let previousOutput = '';

	const render = (...arguments_) => {
		if (!showCursor) {
			cliCursor.hide();
		}

		let output = arguments_.join(' ') + '\n';
		output = fitToTerminalHeight(stream, output);
		const width = getWidth(stream);
		if (output === previousOutput && previousWidth === width) {
			return;
		}

		previousOutput = output;
		previousWidth = width;
		output = wrapAnsi(output, width, {
			trim: false,
			hard: true,
			wordWrap: false,
		});
		stream.write(ansiEscapes.eraseLines(previousLineCount) + output);
		previousLineCount = output.split('\n').length;
	};

	render.clear = () => {
		stream.write(ansiEscapes.eraseLines(previousLineCount));
		previousOutput = '';
		previousWidth = getWidth(stream);
		previousLineCount = 0;
	};

	render.done = () => {
		previousOutput = '';
		previousWidth = getWidth(stream);
		previousLineCount = 0;

		if (!showCursor) {
			cliCursor.show();
		}
	};

	return render;
}

createLogUpdate(process$1.stdout);

createLogUpdate(process$1.stderr);

var version = "0.34.1";

const A=r=>r!==null&&typeof r=="object",a=(r,t)=>Object.assign(new Error(`[${r}]: ${t}`),{code:r}),_$1="ERR_INVALID_PACKAGE_CONFIG",E="ERR_INVALID_PACKAGE_TARGET",I="ERR_PACKAGE_PATH_NOT_EXPORTED",R$1=/^\d+$/,O=/^(\.{1,2}|node_modules)$/i,w=/\/|\\/;var h=(r=>(r.Export="exports",r.Import="imports",r))(h||{});const f=(r,t,e,o,c)=>{if(t==null)return [];if(typeof t=="string"){const[n,...i]=t.split(w);if(n===".."||i.some(l=>O.test(l)))throw a(E,`Invalid "${r}" target "${t}" defined in the package config`);return [c?t.replace(/\*/g,c):t]}if(Array.isArray(t))return t.flatMap(n=>f(r,n,e,o,c));if(A(t)){for(const n of Object.keys(t)){if(R$1.test(n))throw a(_$1,"Cannot contain numeric property keys");if(n==="default"||o.includes(n))return f(r,t[n],e,o,c)}return []}throw a(E,`Invalid "${r}" target "${t}"`)},s="*",m=(r,t)=>{const e=r.indexOf(s),o=t.indexOf(s);return e===o?t.length>r.length:o>e};function d$1(r,t){if(!t.includes(s)&&r.hasOwnProperty(t))return [t];let e,o;for(const c of Object.keys(r))if(c.includes(s)){const[n,i,l]=c.split(s);if(l===void 0&&t.startsWith(n)&&t.endsWith(i)){const g=t.slice(n.length,-i.length||void 0);g&&(!e||m(e,c))&&(e=c,o=g);}}return [e,o]}const p=r=>Object.keys(r).reduce((t,e)=>{const o=e===""||e[0]!==".";if(t===void 0||t===o)return o;throw a(_$1,'"exports" cannot contain some keys starting with "." and some not')},void 0),u=/^\w+:/,v=(r,t,e)=>{if(!r)throw new Error('"exports" is required');t=t===""?".":`./${t}`,(typeof r=="string"||Array.isArray(r)||A(r)&&p(r))&&(r={".":r});const[o,c]=d$1(r,t),n=f(h.Export,r[o],t,e,c);if(n.length===0)throw a(I,t==="."?'No "exports" main defined':`Package subpath '${t}' is not defined by "exports"`);for(const i of n)if(!i.startsWith("./")&&!u.test(i))throw a(E,`Invalid "exports" target "${i}" defined in the package config`);return n};

function U(e){return e.startsWith("\\\\?\\")?e:e.replace(/\\/g,"/")}const Y=(e,s)=>{for(;;){const i=f$1.posix.join(e,s);if($.existsSync(i))return i;const n=f$1.dirname(e);if(n===e)return;e=n;}},S=/^\.{1,2}(\/.*)?$/,V=e=>{const s=U(e);return S.test(s)?s:`./${s}`};function re(e,s=!1){const i=e.length;let n=0,t="",l=0,c=16,m=0,p=0,L=0,g=0,T=0;function k(o,r){let u=0,E=0;for(;u<o||!r;){let v=e.charCodeAt(n);if(v>=48&&v<=57)E=E*16+v-48;else if(v>=65&&v<=70)E=E*16+v-65+10;else if(v>=97&&v<=102)E=E*16+v-97+10;else break;n++,u++;}return u<o&&(E=-1),E}function j(o){n=o,t="",l=0,c=16,T=0;}function w(){let o=n;if(e.charCodeAt(n)===48)n++;else for(n++;n<e.length&&_(e.charCodeAt(n));)n++;if(n<e.length&&e.charCodeAt(n)===46)if(n++,n<e.length&&_(e.charCodeAt(n)))for(n++;n<e.length&&_(e.charCodeAt(n));)n++;else return T=3,e.substring(o,n);let r=n;if(n<e.length&&(e.charCodeAt(n)===69||e.charCodeAt(n)===101))if(n++,(n<e.length&&e.charCodeAt(n)===43||e.charCodeAt(n)===45)&&n++,n<e.length&&_(e.charCodeAt(n))){for(n++;n<e.length&&_(e.charCodeAt(n));)n++;r=n;}else T=3;return e.substring(o,r)}function b(){let o="",r=n;for(;;){if(n>=i){o+=e.substring(r,n),T=2;break}const u=e.charCodeAt(n);if(u===34){o+=e.substring(r,n),n++;break}if(u===92){if(o+=e.substring(r,n),n++,n>=i){T=2;break}switch(e.charCodeAt(n++)){case 34:o+='"';break;case 92:o+="\\";break;case 47:o+="/";break;case 98:o+="\b";break;case 102:o+="\f";break;case 110:o+=`
`;break;case 114:o+="\r";break;case 116:o+="	";break;case 117:const v=k(4,!0);v>=0?o+=String.fromCharCode(v):T=4;break;default:T=5;}r=n;continue}if(u>=0&&u<=31)if(F(u)){o+=e.substring(r,n),T=2;break}else T=6;n++;}return o}function A(){if(t="",T=0,l=n,p=m,g=L,n>=i)return l=i,c=17;let o=e.charCodeAt(n);if(W(o)){do n++,t+=String.fromCharCode(o),o=e.charCodeAt(n);while(W(o));return c=15}if(F(o))return n++,t+=String.fromCharCode(o),o===13&&e.charCodeAt(n)===10&&(n++,t+=`
`),m++,L=n,c=14;switch(o){case 123:return n++,c=1;case 125:return n++,c=2;case 91:return n++,c=3;case 93:return n++,c=4;case 58:return n++,c=6;case 44:return n++,c=5;case 34:return n++,t=b(),c=10;case 47:const r=n-1;if(e.charCodeAt(n+1)===47){for(n+=2;n<i&&!F(e.charCodeAt(n));)n++;return t=e.substring(r,n),c=12}if(e.charCodeAt(n+1)===42){n+=2;const u=i-1;let E=!1;for(;n<u;){const v=e.charCodeAt(n);if(v===42&&e.charCodeAt(n+1)===47){n+=2,E=!0;break}n++,F(v)&&(v===13&&e.charCodeAt(n)===10&&n++,m++,L=n);}return E||(n++,T=1),t=e.substring(r,n),c=13}return t+=String.fromCharCode(o),n++,c=16;case 45:if(t+=String.fromCharCode(o),n++,n===i||!_(e.charCodeAt(n)))return c=16;case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:return t+=w(),c=11;default:for(;n<i&&N(o);)n++,o=e.charCodeAt(n);if(l!==n){switch(t=e.substring(l,n),t){case"true":return c=8;case"false":return c=9;case"null":return c=7}return c=16}return t+=String.fromCharCode(o),n++,c=16}}function N(o){if(W(o)||F(o))return !1;switch(o){case 125:case 93:case 123:case 91:case 34:case 58:case 44:case 47:return !1}return !0}function h(){let o;do o=A();while(o>=12&&o<=15);return o}return {setPosition:j,getPosition:()=>n,scan:s?h:A,getToken:()=>c,getTokenValue:()=>t,getTokenOffset:()=>l,getTokenLength:()=>n-l,getTokenStartLine:()=>p,getTokenStartCharacter:()=>l-g,getTokenError:()=>T}}function W(e){return e===32||e===9}function F(e){return e===10||e===13}function _(e){return e>=48&&e<=57}var Z;(function(e){e[e.lineFeed=10]="lineFeed",e[e.carriageReturn=13]="carriageReturn",e[e.space=32]="space",e[e._0=48]="_0",e[e._1=49]="_1",e[e._2=50]="_2",e[e._3=51]="_3",e[e._4=52]="_4",e[e._5=53]="_5",e[e._6=54]="_6",e[e._7=55]="_7",e[e._8=56]="_8",e[e._9=57]="_9",e[e.a=97]="a",e[e.b=98]="b",e[e.c=99]="c",e[e.d=100]="d",e[e.e=101]="e",e[e.f=102]="f",e[e.g=103]="g",e[e.h=104]="h",e[e.i=105]="i",e[e.j=106]="j",e[e.k=107]="k",e[e.l=108]="l",e[e.m=109]="m",e[e.n=110]="n",e[e.o=111]="o",e[e.p=112]="p",e[e.q=113]="q",e[e.r=114]="r",e[e.s=115]="s",e[e.t=116]="t",e[e.u=117]="u",e[e.v=118]="v",e[e.w=119]="w",e[e.x=120]="x",e[e.y=121]="y",e[e.z=122]="z",e[e.A=65]="A",e[e.B=66]="B",e[e.C=67]="C",e[e.D=68]="D",e[e.E=69]="E",e[e.F=70]="F",e[e.G=71]="G",e[e.H=72]="H",e[e.I=73]="I",e[e.J=74]="J",e[e.K=75]="K",e[e.L=76]="L",e[e.M=77]="M",e[e.N=78]="N",e[e.O=79]="O",e[e.P=80]="P",e[e.Q=81]="Q",e[e.R=82]="R",e[e.S=83]="S",e[e.T=84]="T",e[e.U=85]="U",e[e.V=86]="V",e[e.W=87]="W",e[e.X=88]="X",e[e.Y=89]="Y",e[e.Z=90]="Z",e[e.asterisk=42]="asterisk",e[e.backslash=92]="backslash",e[e.closeBrace=125]="closeBrace",e[e.closeBracket=93]="closeBracket",e[e.colon=58]="colon",e[e.comma=44]="comma",e[e.dot=46]="dot",e[e.doubleQuote=34]="doubleQuote",e[e.minus=45]="minus",e[e.openBrace=123]="openBrace",e[e.openBracket=91]="openBracket",e[e.plus=43]="plus",e[e.slash=47]="slash",e[e.formFeed=12]="formFeed",e[e.tab=9]="tab";})(Z||(Z={}));var x;(function(e){e.DEFAULT={allowTrailingComma:!1};})(x||(x={}));function pe(e,s=[],i=x.DEFAULT){let n=null,t=[];const l=[];function c(p){Array.isArray(t)?t.push(p):n!==null&&(t[n]=p);}return ge(e,{onObjectBegin:()=>{const p={};c(p),l.push(t),t=p,n=null;},onObjectProperty:p=>{n=p;},onObjectEnd:()=>{t=l.pop();},onArrayBegin:()=>{const p=[];c(p),l.push(t),t=p,n=null;},onArrayEnd:()=>{t=l.pop();},onLiteralValue:c,onError:(p,L,g)=>{s.push({error:p,offset:L,length:g});}},i),t[0]}function ge(e,s,i=x.DEFAULT){const n=re(e,!1),t=[];function l(a){return a?()=>a(n.getTokenOffset(),n.getTokenLength(),n.getTokenStartLine(),n.getTokenStartCharacter()):()=>!0}function c(a){return a?()=>a(n.getTokenOffset(),n.getTokenLength(),n.getTokenStartLine(),n.getTokenStartCharacter(),()=>t.slice()):()=>!0}function m(a){return a?O=>a(O,n.getTokenOffset(),n.getTokenLength(),n.getTokenStartLine(),n.getTokenStartCharacter()):()=>!0}function p(a){return a?O=>a(O,n.getTokenOffset(),n.getTokenLength(),n.getTokenStartLine(),n.getTokenStartCharacter(),()=>t.slice()):()=>!0}const L=c(s.onObjectBegin),g=p(s.onObjectProperty),T=l(s.onObjectEnd),k=c(s.onArrayBegin),j=l(s.onArrayEnd),w=p(s.onLiteralValue),b=m(s.onSeparator),A=l(s.onComment),N=m(s.onError),h=i&&i.disallowComments,o=i&&i.allowTrailingComma;function r(){for(;;){const a=n.scan();switch(n.getTokenError()){case 4:u(14);break;case 5:u(15);break;case 3:u(13);break;case 1:h||u(11);break;case 2:u(12);break;case 6:u(16);break}switch(a){case 12:case 13:h?u(10):A();break;case 16:u(1);break;case 15:case 14:break;default:return a}}}function u(a,O=[],X=[]){if(N(a),O.length+X.length>0){let y=n.getToken();for(;y!==17;){if(O.indexOf(y)!==-1){r();break}else if(X.indexOf(y)!==-1)break;y=r();}}}function E(a){const O=n.getTokenValue();return a?w(O):(g(O),t.push(O)),r(),!0}function v(){switch(n.getToken()){case 11:const a=n.getTokenValue();let O=Number(a);isNaN(O)&&(u(2),O=0),w(O);break;case 7:w(null);break;case 8:w(!0);break;case 9:w(!1);break;default:return !1}return r(),!0}function oe(){return n.getToken()!==10?(u(3,[],[2,5]),!1):(E(!1),n.getToken()===6?(b(":"),r(),P()||u(4,[],[2,5])):u(5,[],[2,5]),t.pop(),!0)}function le(){L(),r();let a=!1;for(;n.getToken()!==2&&n.getToken()!==17;){if(n.getToken()===5){if(a||u(4,[],[]),b(","),r(),n.getToken()===2&&o)break}else a&&u(6,[],[]);oe()||u(4,[],[2,5]),a=!0;}return T(),n.getToken()!==2?u(7,[2],[]):r(),!0}function ce(){k(),r();let a=!0,O=!1;for(;n.getToken()!==4&&n.getToken()!==17;){if(n.getToken()===5){if(O||u(4,[],[]),b(","),r(),n.getToken()===4&&o)break}else O&&u(6,[],[]);a?(t.push(0),a=!1):t[t.length-1]++,P()||u(4,[],[4,5]),O=!0;}return j(),a||t.pop(),n.getToken()!==4?u(8,[4],[]):r(),!0}function P(){switch(n.getToken()){case 3:return ce();case 1:return le();case 10:return E(!0);default:return v()}}return r(),n.getToken()===17?i.allowEmptyContent?!0:(u(4,[],[]),!1):P()?(n.getToken()!==17&&u(9,[],[]),!0):(u(4,[],[]),!1)}var d;(function(e){e[e.None=0]="None",e[e.UnexpectedEndOfComment=1]="UnexpectedEndOfComment",e[e.UnexpectedEndOfString=2]="UnexpectedEndOfString",e[e.UnexpectedEndOfNumber=3]="UnexpectedEndOfNumber",e[e.InvalidUnicode=4]="InvalidUnicode",e[e.InvalidEscapeCharacter=5]="InvalidEscapeCharacter",e[e.InvalidCharacter=6]="InvalidCharacter";})(d||(d={}));var q;(function(e){e[e.OpenBraceToken=1]="OpenBraceToken",e[e.CloseBraceToken=2]="CloseBraceToken",e[e.OpenBracketToken=3]="OpenBracketToken",e[e.CloseBracketToken=4]="CloseBracketToken",e[e.CommaToken=5]="CommaToken",e[e.ColonToken=6]="ColonToken",e[e.NullKeyword=7]="NullKeyword",e[e.TrueKeyword=8]="TrueKeyword",e[e.FalseKeyword=9]="FalseKeyword",e[e.StringLiteral=10]="StringLiteral",e[e.NumericLiteral=11]="NumericLiteral",e[e.LineCommentTrivia=12]="LineCommentTrivia",e[e.BlockCommentTrivia=13]="BlockCommentTrivia",e[e.LineBreakTrivia=14]="LineBreakTrivia",e[e.Trivia=15]="Trivia",e[e.Unknown=16]="Unknown",e[e.EOF=17]="EOF";})(q||(q={}));const ae=pe;var K;(function(e){e[e.InvalidSymbol=1]="InvalidSymbol",e[e.InvalidNumberFormat=2]="InvalidNumberFormat",e[e.PropertyNameExpected=3]="PropertyNameExpected",e[e.ValueExpected=4]="ValueExpected",e[e.ColonExpected=5]="ColonExpected",e[e.CommaExpected=6]="CommaExpected",e[e.CloseBraceExpected=7]="CloseBraceExpected",e[e.CloseBracketExpected=8]="CloseBracketExpected",e[e.EndOfFileExpected=9]="EndOfFileExpected",e[e.InvalidCommentToken=10]="InvalidCommentToken",e[e.UnexpectedEndOfComment=11]="UnexpectedEndOfComment",e[e.UnexpectedEndOfString=12]="UnexpectedEndOfString",e[e.UnexpectedEndOfNumber=13]="UnexpectedEndOfNumber",e[e.InvalidUnicode=14]="InvalidUnicode",e[e.InvalidEscapeCharacter=15]="InvalidEscapeCharacter",e[e.InvalidCharacter=16]="InvalidCharacter";})(K||(K={}));const C=e=>ae($.readFileSync(e,"utf8")),{existsSync:B}=$,me=()=>{const{findPnpApi:e}=ue;return e&&e(process.cwd())},J=(e,s,i)=>{let n="tsconfig.json";const t=C(e);if(t)if(!i&&t.exports)try{const[l]=v(t.exports,s,["require","types"]);n=l;}catch{return}else !s&&t.tsconfig&&(n=t.tsconfig);return f$1.join(e,"..",n)},M="package.json",R="tsconfig.json",ke=(e,s)=>{let i=e;if(e===".."&&(i=f$1.join(i,R)),e[0]==="."&&(i=f$1.resolve(s,i)),f$1.isAbsolute(i)){if(B(i)){if($.statSync(i).isFile())return i}else if(!i.endsWith(".json")){const k=`${i}.json`;if(B(k))return k}return}const[n,...t]=e.split("/"),l=n[0]==="@"?`${n}/${t.shift()}`:n,c=t.join("/"),m=me();if(m){const{resolveRequest:k}=m;try{if(l===e){const j=k(f$1.join(l,M),s);if(j){const w=J(j,c);if(w&&B(w))return w}}else {let j;try{j=k(e,s,{extensions:[".json"]});}catch{j=k(f$1.join(e,R),s);}if(j)return j}}catch{}}const p=Y(s,f$1.join("node_modules",l));if(!p||!$.statSync(p).isDirectory())return;const L=f$1.join(p,M);if(B(L)){const k=J(L,c);if(!k)return;if(B(k))return k}const g=f$1.join(p,c),T=g.endsWith(".json");if(!T){const k=`${g}.json`;if(B(k))return k}if(B(g)){if($.statSync(g).isDirectory()){const k=f$1.join(g,M);if(B(k)){const w=J(k,"",!0);if(w&&B(w))return w}const j=f$1.join(g,R);if(B(j))return j}else if(T)return g}},be=(e,s)=>{var i;const n=ke(e,s);if(!n)throw new Error(`File '${e}' not found.`);const t=G(n);if(delete t.references,(i=t.compilerOptions)!=null&&i.baseUrl){const{compilerOptions:l}=t;l.baseUrl=f$1.relative(s,f$1.join(f$1.dirname(n),l.baseUrl))||"./";}return t.files&&(t.files=t.files.map(l=>f$1.relative(s,f$1.join(f$1.dirname(n),l)))),t.include&&(t.include=t.include.map(l=>f$1.relative(s,f$1.join(f$1.dirname(n),l)))),t},G=e=>{let s;try{s=$.realpathSync(e);}catch{throw new Error(`Cannot resolve tsconfig at path: ${e}`)}const i=f$1.dirname(s);let n=C(s)||{};if(typeof n!="object")throw new SyntaxError(`Failed to parse tsconfig at: ${e}`);if(n.extends){const t=Array.isArray(n.extends)?n.extends:[n.extends];delete n.extends;for(const l of t.reverse()){const c=be(l,i),m={...c,...n,compilerOptions:{...c.compilerOptions,...n.compilerOptions}};c.watchOptions&&(m.watchOptions={...c.watchOptions,...n.watchOptions}),n=m;}}if(n.compilerOptions){const{compilerOptions:t}=n;if(t.baseUrl){const l=f$1.resolve(i,t.baseUrl),c=V(f$1.relative(i,l));t.baseUrl=c;}t.outDir&&(Array.isArray(n.exclude)||(n.exclude=[]),n.exclude.push(t.outDir),t.outDir=V(t.outDir));}else n.compilerOptions={};if(n.files&&(n.files=n.files.map(V)),n.include&&(n.include=n.include.map(U)),n.watchOptions){const{watchOptions:t}=n;t.excludeDirectories&&(t.excludeDirectories=t.excludeDirectories.map(l=>U(f$1.resolve(i,l))));}return n},Te=(e=process.cwd(),s="tsconfig.json")=>{const i=Y(U(e),s);if(!i)return null;const n=G(i);return {path:i,config:n}};f$1.posix;process.platform==="win32";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const newLineRegExp = /\r?\n/;
const errCodeRegExp = /error TS(?<errCode>\d+)/;
async function makeTscErrorInfo(errInfo) {
  var _a;
  const [errFilePathPos = "", ...errMsgRawArr] = errInfo.split(":");
  if (!errFilePathPos || errMsgRawArr.length === 0 || errMsgRawArr.join("").length === 0)
    return ["unknown filepath", null];
  const errMsgRaw = errMsgRawArr.join("").trim();
  const [errFilePath, errPos] = errFilePathPos.slice(0, -1).split("(");
  if (!errFilePath || !errPos)
    return ["unknown filepath", null];
  const [errLine, errCol] = errPos.split(",");
  if (!errLine || !errCol)
    return [errFilePath, null];
  const execArr = errCodeRegExp.exec(errMsgRaw);
  if (!execArr)
    return [errFilePath, null];
  const errCodeStr = ((_a = execArr.groups) == null ? void 0 : _a.errCode) ?? "";
  if (!errCodeStr)
    return [errFilePath, null];
  const line = Number(errLine);
  const col = Number(errCol);
  const errCode = Number(errCodeStr);
  return [
    errFilePath,
    {
      filePath: errFilePath,
      errCode,
      line,
      column: col,
      errMsg: errMsgRaw.slice(`error TS${errCode} `.length)
    }
  ];
}
async function getTsconfig(root, config) {
  const configName = config.tsconfig ? basename(config.tsconfig) : void 0;
  const configSearchPath = config.tsconfig ? dirname(resolve(root, config.tsconfig)) : root;
  const tsconfig = Te(configSearchPath, configName);
  if (!tsconfig)
    throw new Error("no tsconfig.json found");
  const tempConfigPath = join(dirname(tsconfig.path), "tsconfig.vitest-temp.json");
  try {
    const tmpTsConfig = { ...tsconfig.config };
    tmpTsConfig.compilerOptions = tmpTsConfig.compilerOptions || {};
    tmpTsConfig.compilerOptions.emitDeclarationOnly = false;
    tmpTsConfig.compilerOptions.incremental = true;
    tmpTsConfig.compilerOptions.tsBuildInfoFile = join(
      __dirname,
      "tsconfig.tmp.tsbuildinfo"
    );
    const tsconfigFinalContent = JSON.stringify(tmpTsConfig, null, 2);
    await writeFile(tempConfigPath, tsconfigFinalContent);
    return { path: tempConfigPath, config: tmpTsConfig };
  } catch (err) {
    throw new Error("failed to write tsconfig.temp.json", { cause: err });
  }
}
async function getRawErrsMapFromTsCompile(tscErrorStdout) {
  const rawErrsMap = /* @__PURE__ */ new Map();
  const infos = await Promise.all(
    tscErrorStdout.split(newLineRegExp).reduce((prev, next) => {
      if (!next)
        return prev;
      else if (!next.startsWith(" "))
        prev.push(next);
      else
        prev[prev.length - 1] += `
${next}`;
      return prev;
    }, []).map((errInfoLine) => makeTscErrorInfo(errInfoLine))
  );
  infos.forEach(([errFilePath, errInfo]) => {
    var _a;
    if (!errInfo)
      return;
    if (!rawErrsMap.has(errFilePath))
      rawErrsMap.set(errFilePath, [errInfo]);
    else
      (_a = rawErrsMap.get(errFilePath)) == null ? void 0 : _a.push(errInfo);
  });
  return rawErrsMap;
}

function createIndexMap(source) {
  const map = /* @__PURE__ */ new Map();
  let index = 0;
  let line = 1;
  let column = 1;
  for (const char of source) {
    map.set(`${line}:${column}`, index++);
    if (char === "\n" || char === "\r\n") {
      line++;
      column = 0;
    } else {
      column++;
    }
  }
  return map;
}

async function collectTests(ctx, filepath) {
  const request = await ctx.vitenode.transformRequest(filepath, filepath);
  if (!request)
    return null;
  const ast = parse$4(request.code, {
    ecmaVersion: "latest",
    allowAwaitOutsideFunction: true
  });
  const testFilepath = relative(ctx.config.root, filepath);
  const file = {
    filepath,
    type: "suite",
    id: generateHash(`${testFilepath}${ctx.config.name || ""}`),
    name: testFilepath,
    mode: "run",
    tasks: [],
    start: ast.start,
    end: ast.end,
    meta: { typecheck: true }
  };
  const definitions = [];
  const getName = (callee) => {
    var _a, _b, _c;
    if (!callee)
      return null;
    if (callee.type === "Identifier")
      return callee.name;
    if (callee.type === "MemberExpression") {
      if ((_b = (_a = callee.object) == null ? void 0 : _a.name) == null ? void 0 : _b.startsWith("__vite_ssr_"))
        return getName(callee.property);
      return getName((_c = callee.object) == null ? void 0 : _c.property);
    }
    return null;
  };
  ancestor(ast, {
    CallExpression(node) {
      var _a;
      const { callee } = node;
      const name = getName(callee);
      if (!name)
        return;
      if (!["it", "test", "describe", "suite"].includes(name))
        return;
      const { arguments: [{ value: message }] } = node;
      const property = (_a = callee == null ? void 0 : callee.property) == null ? void 0 : _a.name;
      let mode = !property || property === name ? "run" : property;
      if (!["run", "skip", "todo", "only", "skipIf", "runIf"].includes(mode))
        throw new Error(`${name}.${mode} syntax is not supported when testing types`);
      if (mode === "skipIf" || mode === "runIf")
        mode = "skip";
      definitions.push({
        start: node.start,
        end: node.end,
        name: message,
        type: name === "it" || name === "test" ? "test" : "suite",
        mode
      });
    }
  });
  let lastSuite = file;
  const updateLatestSuite = (index) => {
    const suite = lastSuite;
    while (lastSuite !== file && lastSuite.end < index)
      lastSuite = suite.suite;
    return lastSuite;
  };
  definitions.sort((a, b) => a.start - b.start).forEach((definition) => {
    const latestSuite = updateLatestSuite(definition.start);
    let mode = definition.mode;
    if (latestSuite.mode !== "run")
      mode = latestSuite.mode;
    if (definition.type === "suite") {
      const task2 = {
        type: definition.type,
        id: "",
        suite: latestSuite,
        file,
        tasks: [],
        mode,
        name: definition.name,
        end: definition.end,
        start: definition.start,
        meta: {
          typecheck: true
        }
      };
      definition.task = task2;
      latestSuite.tasks.push(task2);
      lastSuite = task2;
      return;
    }
    const task = {
      type: definition.type,
      id: "",
      suite: latestSuite,
      file,
      mode,
      context: {},
      // not used in typecheck
      name: definition.name,
      end: definition.end,
      start: definition.start,
      meta: {
        typecheck: true
      }
    };
    definition.task = task;
    latestSuite.tasks.push(task);
  });
  calculateSuiteHash(file);
  const hasOnly = someTasksAreOnly(file);
  interpretTaskModes(file, ctx.config.testNamePattern, hasOnly, false, ctx.config.allowOnly);
  return {
    file,
    parsed: request.code,
    filepath,
    map: request.map,
    definitions
  };
}

class TypeCheckError extends Error {
  constructor(message, stacks) {
    super(message);
    this.message = message;
    this.stacks = stacks;
  }
  name = "TypeCheckError";
}
class Typechecker {
  constructor(ctx, files) {
    this.ctx = ctx;
    this.files = files;
  }
  _onParseStart;
  _onParseEnd;
  _onWatcherRerun;
  _result = {
    files: [],
    sourceErrors: []
  };
  _output = "";
  _tests = {};
  tempConfigPath;
  allowJs;
  process;
  onParseStart(fn) {
    this._onParseStart = fn;
  }
  onParseEnd(fn) {
    this._onParseEnd = fn;
  }
  onWatcherRerun(fn) {
    this._onWatcherRerun = fn;
  }
  async collectFileTests(filepath) {
    return collectTests(this.ctx, filepath);
  }
  getFiles() {
    return this.files.filter((filename) => {
      const extension = extname(filename);
      return extension !== ".js" || this.allowJs;
    });
  }
  async collectTests() {
    const tests = (await Promise.all(
      this.getFiles().map((filepath) => this.collectFileTests(filepath))
    )).reduce((acc, data) => {
      if (!data)
        return acc;
      acc[data.filepath] = data;
      return acc;
    }, {});
    this._tests = tests;
    return tests;
  }
  markPassed(file) {
    var _a;
    if (!((_a = file.result) == null ? void 0 : _a.state)) {
      file.result = {
        state: "pass"
      };
    }
    const markTasks = (tasks) => {
      var _a2;
      for (const task of tasks) {
        if ("tasks" in task)
          markTasks(task.tasks);
        if (!((_a2 = task.result) == null ? void 0 : _a2.state) && task.mode === "run") {
          task.result = {
            state: "pass"
          };
        }
      }
    };
    markTasks(file.tasks);
  }
  async prepareResults(output) {
    const typeErrors = await this.parseTscLikeOutput(output);
    const testFiles = new Set(this.getFiles());
    if (!this._tests)
      this._tests = await this.collectTests();
    const sourceErrors = [];
    const files = [];
    testFiles.forEach((path) => {
      const { file, definitions, map, parsed } = this._tests[path];
      const errors = typeErrors.get(path);
      files.push(file);
      if (!errors) {
        this.markPassed(file);
        return;
      }
      const sortedDefinitions = [...definitions.sort((a, b) => b.start - a.start)];
      const traceMap = map && new TraceMap(map);
      const indexMap = createIndexMap(parsed);
      const markState = (task, state) => {
        task.result = {
          state: task.mode === "run" || task.mode === "only" ? state : task.mode
        };
        if (task.suite)
          markState(task.suite, state);
      };
      errors.forEach(({ error, originalError }) => {
        var _a;
        const processedPos = traceMap ? generatedPositionFor(traceMap, {
          line: originalError.line,
          column: originalError.column,
          source: basename(path)
        }) : originalError;
        const line = processedPos.line ?? originalError.line;
        const column = processedPos.column ?? originalError.column;
        const index = indexMap.get(`${line}:${column}`);
        const definition = index != null && sortedDefinitions.find((def) => def.start <= index && def.end >= index);
        const suite = definition ? definition.task : file;
        const state = suite.mode === "run" || suite.mode === "only" ? "fail" : suite.mode;
        const errors2 = ((_a = suite.result) == null ? void 0 : _a.errors) || [];
        suite.result = {
          state,
          errors: errors2
        };
        errors2.push(error);
        if (state === "fail" && suite.suite)
          markState(suite.suite, "fail");
      });
      this.markPassed(file);
    });
    typeErrors.forEach((errors, path) => {
      if (!testFiles.has(path))
        sourceErrors.push(...errors.map(({ error }) => error));
    });
    return {
      files,
      sourceErrors
    };
  }
  async parseTscLikeOutput(output) {
    const errorsMap = await getRawErrsMapFromTsCompile(output);
    const typesErrors = /* @__PURE__ */ new Map();
    errorsMap.forEach((errors, path) => {
      const filepath = resolve(this.ctx.config.root, path);
      const suiteErrors = errors.map((info) => {
        const limit = Error.stackTraceLimit;
        Error.stackTraceLimit = 0;
        const error = new TypeCheckError(info.errMsg, [
          {
            file: filepath,
            line: info.line,
            column: info.column,
            method: ""
          }
        ]);
        Error.stackTraceLimit = limit;
        return {
          originalError: info,
          error
        };
      });
      typesErrors.set(filepath, suiteErrors);
    });
    return typesErrors;
  }
  async clear() {
    if (this.tempConfigPath)
      await rm(this.tempConfigPath, { force: true });
  }
  async stop() {
    var _a;
    await this.clear();
    (_a = this.process) == null ? void 0 : _a.kill();
  }
  async ensurePackageInstalled(root, checker) {
    if (checker !== "tsc" && checker !== "vue-tsc")
      return;
    const packageName = checker === "tsc" ? "typescript" : "vue-tsc";
    await ensurePackageInstalled(packageName, root);
  }
  async prepare() {
    const { root, typecheck } = this.ctx.config;
    await this.ensurePackageInstalled(root, typecheck.checker);
    const { config, path } = await getTsconfig(root, typecheck);
    this.tempConfigPath = path;
    this.allowJs = typecheck.allowJs || config.allowJs || false;
  }
  getExitCode() {
    var _a;
    return ((_a = this.process) == null ? void 0 : _a.exitCode) != null && this.process.exitCode;
  }
  getOutput() {
    return this._output;
  }
  async start() {
    var _a, _b, _c;
    if (!this.tempConfigPath)
      throw new Error("tsconfig was not initialized");
    const { root, watch, typecheck } = this.ctx.config;
    const args = ["--noEmit", "--pretty", "false", "-p", this.tempConfigPath];
    if (watch)
      args.push("--watch");
    if (typecheck.allowJs)
      args.push("--allowJs", "--checkJs");
    this._output = "";
    const child = execa(typecheck.checker, args, {
      cwd: root,
      stdout: "pipe",
      reject: false
    });
    this.process = child;
    await ((_a = this._onParseStart) == null ? void 0 : _a.call(this));
    let rerunTriggered = false;
    (_b = child.stdout) == null ? void 0 : _b.on("data", (chunk) => {
      var _a2;
      this._output += chunk;
      if (!watch)
        return;
      if (this._output.includes("File change detected") && !rerunTriggered) {
        (_a2 = this._onWatcherRerun) == null ? void 0 : _a2.call(this);
        this._result.sourceErrors = [];
        this._result.files = [];
        this._tests = null;
        rerunTriggered = true;
      }
      if (/Found \w+ errors*. Watching for/.test(this._output)) {
        rerunTriggered = false;
        this.prepareResults(this._output).then((result) => {
          var _a3;
          this._result = result;
          (_a3 = this._onParseEnd) == null ? void 0 : _a3.call(this, result);
        });
        this._output = "";
      }
    });
    if (!watch) {
      await child;
      this._result = await this.prepareResults(this._output);
      await ((_c = this._onParseEnd) == null ? void 0 : _c.call(this, this._result));
    }
  }
  getResult() {
    return this._result;
  }
  getTestFiles() {
    return Object.values(this._tests || {}).map((i) => i.file);
  }
  getTestPacks() {
    return Object.values(this._tests || {}).map(({ file }) => getTasks(file)).flat().map((i) => [i.id, void 0, { typecheck: true }]);
  }
}

async function printError(error, project, options) {
  const { showCodeFrame = true, fullStack = false, type } = options;
  const logger = options.logger;
  let e = error;
  if (isPrimitive(e)) {
    e = {
      message: String(error).split(/\n/g)[0],
      stack: String(error)
    };
  }
  if (!e) {
    const error2 = new Error("unknown error");
    e = {
      message: e ?? error2.message,
      stack: error2.stack
    };
  }
  if (!project)
    return printErrorMessage(e, logger);
  const parserOptions = {
    // only browser stack traces require remapping
    getSourceMap: (file) => project.getBrowserSourceMapModuleById(file)
  };
  if (fullStack)
    parserOptions.ignoreStackEntries = [];
  const stacks = parseErrorStacktrace(e, parserOptions);
  const nearest = error instanceof TypeCheckError ? error.stacks[0] : stacks.find(
    (stack) => project.getModuleById(stack.file) && existsSync(stack.file)
  );
  const errorProperties = getErrorProperties(e);
  if (type)
    printErrorType(type, project.ctx);
  printErrorMessage(e, logger);
  if (e.diff)
    displayDiff(e.diff, logger.console);
  if (e.frame) {
    logger.error(c.yellow(e.frame));
  } else {
    printStack(project, stacks, nearest, errorProperties, (s) => {
      if (showCodeFrame && s === nearest && nearest) {
        const sourceCode = readFileSync(nearest.file, "utf-8");
        logger.error(generateCodeFrame(sourceCode, 4, s.line, s.column));
      }
    });
  }
  const testPath = e.VITEST_TEST_PATH;
  const testName = e.VITEST_TEST_NAME;
  const afterEnvTeardown = e.VITEST_AFTER_ENV_TEARDOWN;
  if (testPath)
    logger.error(c.red(`This error originated in "${c.bold(testPath)}" test file. It doesn't mean the error was thrown inside the file itself, but while it was running.`));
  if (testName) {
    logger.error(c.red(`The latest test that might've caused the error is "${c.bold(testName)}". It might mean one of the following:
- The error was thrown, while Vitest was running this test.
- This was the last recorded test before the error was thrown, if error originated after test finished its execution.`));
  }
  if (afterEnvTeardown) {
    logger.error(c.red("This error was caught after test environment was torn down. Make sure to cancel any running tasks before test finishes:\n- cancel timeouts using clearTimeout and clearInterval\n- wait for promises to resolve using the await keyword"));
  }
  if (typeof e.cause === "object" && e.cause && "name" in e.cause) {
    e.cause.name = `Caused by: ${e.cause.name}`;
    await printError(e.cause, project, { fullStack, showCodeFrame: false, logger: options.logger });
  }
  handleImportOutsideModuleError(e.stack || e.stackStr || "", logger);
}
function printErrorType(type, ctx) {
  ctx.logger.error(`
${c.red(divider(c.bold(c.inverse(` ${type} `))))}`);
}
const skipErrorProperties = /* @__PURE__ */ new Set([
  "nameStr",
  "stack",
  "cause",
  "stacks",
  "stackStr",
  "type",
  "showDiff",
  "diff",
  "actual",
  "expected",
  "VITEST_TEST_NAME",
  "VITEST_TEST_PATH",
  "VITEST_AFTER_ENV_TEARDOWN",
  ...Object.getOwnPropertyNames(Error.prototype),
  ...Object.getOwnPropertyNames(Object.prototype)
]);
function getErrorProperties(e) {
  const errorObject = /* @__PURE__ */ Object.create(null);
  if (e.name === "AssertionError")
    return errorObject;
  for (const key of Object.getOwnPropertyNames(e)) {
    if (!skipErrorProperties.has(key))
      errorObject[key] = e[key];
  }
  return errorObject;
}
const esmErrors = [
  "Cannot use import statement outside a module",
  "Unexpected token 'export'"
];
function handleImportOutsideModuleError(stack, logger) {
  if (!esmErrors.some((e) => stack.includes(e)))
    return;
  const path = normalize(stack.split("\n")[0].trim());
  let name = path.split("/node_modules/").pop() || "";
  if (name == null ? void 0 : name.startsWith("@"))
    name = name.split("/").slice(0, 2).join("/");
  else
    name = name.split("/")[0];
  if (name)
    printModuleWarningForPackage(logger, path, name);
  else
    printModuleWarningForSourceCode(logger, path);
}
function printModuleWarningForPackage(logger, path, name) {
  logger.error(c.yellow(
    `Module ${path} seems to be an ES Module but shipped in a CommonJS package. You might want to create an issue to the package ${c.bold(`"${name}"`)} asking them to ship the file in .mjs extension or add "type": "module" in their package.json.

As a temporary workaround you can try to inline the package by updating your config:

` + c.gray(c.dim("// vitest.config.js")) + "\n" + c.green(`export default {
  test: {
    deps: {
      inline: [
        ${c.yellow(c.bold(`"${name}"`))}
      ]
    }
  }
}
`)
  ));
}
function printModuleWarningForSourceCode(logger, path) {
  logger.error(c.yellow(
    `Module ${path} seems to be an ES Module but shipped in a CommonJS package. To fix this issue, change the file extension to .mjs or add "type": "module" in your package.json.`
  ));
}
function displayDiff(diff, console) {
  if (diff)
    console.error(`
${diff}
`);
}
function printErrorMessage(error, logger) {
  const errorName = error.name || error.nameStr || "Unknown Error";
  if (!error.message) {
    logger.error(error);
    return;
  }
  if (error.message.length > 5e3) {
    logger.error(`${c.red(c.bold(errorName))}: ${error.message}`);
  } else {
    logger.error(c.red(`${c.bold(errorName)}: ${error.message}`));
  }
}
function printStack(project, stack, highlight, errorProperties, onStack) {
  const logger = project.ctx.logger;
  for (const frame of stack) {
    const color = frame === highlight ? c.cyan : c.gray;
    const path = relative(project.config.root, frame.file);
    logger.error(color(` ${c.dim(F_POINTER)} ${[frame.method, `${path}:${c.dim(`${frame.line}:${frame.column}`)}`].filter(Boolean).join(" ")}`));
    onStack == null ? void 0 : onStack(frame);
  }
  if (stack.length)
    logger.error();
  const hasProperties = Object.keys(errorProperties).length > 0;
  if (hasProperties) {
    logger.error(c.red(c.dim(divider())));
    const propertiesString = inspect(errorProperties);
    logger.error(c.red(c.bold("Serialized Error:")), c.gray(propertiesString));
  }
}
function generateCodeFrame(source, indent = 0, lineNumber, columnNumber, range = 2) {
  var _a;
  const start = positionToOffset(source, lineNumber, columnNumber);
  const end = start;
  const lines = source.split(lineSplitRE);
  let count = 0;
  let res = [];
  const columns = ((_a = process.stdout) == null ? void 0 : _a.columns) || 80;
  function lineNo(no = "") {
    return c.gray(`${String(no).padStart(3, " ")}| `);
  }
  for (let i = 0; i < lines.length; i++) {
    count += lines[i].length + 1;
    if (count >= start) {
      for (let j = i - range; j <= i + range || end > count; j++) {
        if (j < 0 || j >= lines.length)
          continue;
        const lineLength = lines[j].length;
        if (lineLength > 200)
          return "";
        res.push(lineNo(j + 1) + cliTruncate(lines[j].replace(/\t/g, " "), columns - 5 - indent));
        if (j === i) {
          const pad = start - (count - lineLength);
          const length = Math.max(1, end > count ? lineLength - pad : end - start);
          res.push(lineNo() + " ".repeat(pad) + c.red("^".repeat(length)));
        } else if (j > i) {
          if (end > count) {
            const length = Math.max(1, Math.min(end - count, lineLength));
            res.push(lineNo() + c.red("^".repeat(length)));
          }
          count += lineLength + 1;
        }
      }
      break;
    }
  }
  if (indent)
    res = res.map((line) => " ".repeat(indent) + line);
  return res.join("\n");
}

const ESC = "\x1B[";
const ERASE_DOWN = `${ESC}J`;
const ERASE_SCROLLBACK = `${ESC}3J`;
const CURSOR_TO_START = `${ESC}1;1H`;
const CLEAR_SCREEN = "\x1Bc";
class Logger {
  constructor(ctx, console = globalThis.console) {
    this.ctx = ctx;
    this.console = console;
  }
  outputStream = process.stdout;
  errorStream = process.stderr;
  logUpdate = createLogUpdate(process.stdout);
  _clearScreenPending;
  log(...args) {
    this._clearScreen();
    this.console.log(...args);
  }
  error(...args) {
    this._clearScreen();
    this.console.error(...args);
  }
  warn(...args) {
    this._clearScreen();
    this.console.warn(...args);
  }
  clearFullScreen(message) {
    if (this.ctx.server.config.clearScreen === false) {
      this.console.log(message);
      return;
    }
    this.console.log(`${ERASE_SCROLLBACK}${CLEAR_SCREEN}${message}`);
  }
  clearScreen(message, force = false) {
    if (this.ctx.server.config.clearScreen === false) {
      this.console.log(message);
      return;
    }
    this._clearScreenPending = message;
    if (force)
      this._clearScreen();
  }
  _clearScreen() {
    if (this._clearScreenPending == null)
      return;
    const log = this._clearScreenPending;
    this._clearScreenPending = void 0;
    this.console.log(`${CURSOR_TO_START}${ERASE_DOWN}${log}`);
  }
  printError(err, options = {}) {
    const { fullStack = false, type } = options;
    const project = options.project ?? this.ctx.getCoreWorkspaceProject() ?? this.ctx.projects[0];
    return printError(err, project, {
      fullStack,
      type,
      showCodeFrame: true,
      logger: this
    });
  }
  printNoTestFound(filters) {
    var _a;
    const config = this.ctx.config;
    const comma = c.dim(", ");
    if (filters == null ? void 0 : filters.length)
      this.console.error(c.dim("filter:  ") + c.yellow(filters.join(comma)));
    if (config.include)
      this.console.error(c.dim("include: ") + c.yellow(config.include.join(comma)));
    if (config.exclude)
      this.console.error(c.dim("exclude:  ") + c.yellow(config.exclude.join(comma)));
    if (config.watchExclude)
      this.console.error(c.dim("watch exclude:  ") + c.yellow(config.watchExclude.join(comma)));
    if (config.watch && (config.changed || ((_a = config.related) == null ? void 0 : _a.length))) {
      this.log(`No affected ${config.mode} files found
`);
    } else {
      if (config.passWithNoTests)
        this.log(`No ${config.mode} files found, exiting with code 0
`);
      else
        this.error(c.red(`
No ${config.mode} files found, exiting with code 1`));
    }
  }
  printBanner() {
    var _a, _b;
    this.log();
    const versionTest = this.ctx.config.watch ? c.blue(`v${version}`) : c.cyan(`v${version}`);
    const mode = this.ctx.config.watch ? c.blue(" DEV ") : c.cyan(" RUN ");
    this.log(`${c.inverse(c.bold(mode))} ${versionTest} ${c.gray(this.ctx.config.root)}`);
    if (this.ctx.config.sequence.sequencer === RandomSequencer)
      this.log(c.gray(`      Running tests with seed "${this.ctx.config.sequence.seed}"`));
    this.ctx.projects.forEach((project) => {
      var _a2;
      if (!project.browser)
        return;
      const name = project.getName();
      const output = project.isCore() ? "" : ` [${name}]`;
      this.log(c.dim(c.green(`     ${output} Browser runner started at http://${((_a2 = project.config.browser.api) == null ? void 0 : _a2.host) || "localhost"}:${c.bold(`${project.browser.config.server.port}`)}`)));
    });
    if (this.ctx.config.ui)
      this.log(c.dim(c.green(`      UI started at http://${((_a = this.ctx.config.api) == null ? void 0 : _a.host) || "localhost"}:${c.bold(`${this.ctx.server.config.server.port}`)}${this.ctx.config.uiBase}`)));
    else if (this.ctx.config.api)
      this.log(c.dim(c.green(`      API started at http://${((_b = this.ctx.config.api) == null ? void 0 : _b.host) || "localhost"}:${c.bold(`${this.ctx.config.api.port}`)}`)));
    if (this.ctx.coverageProvider)
      this.log(c.dim("      Coverage enabled with ") + c.yellow(this.ctx.coverageProvider.name));
    this.log();
  }
  async printUnhandledErrors(errors) {
    const errorMessage = c.red(c.bold(
      `
Vitest caught ${errors.length} unhandled error${errors.length > 1 ? "s" : ""} during the test run.
This might cause false positive tests. Resolve unhandled errors to make sure your tests are not affected.`
    ));
    this.log(c.red(divider(c.bold(c.inverse(" Unhandled Errors ")))));
    this.log(errorMessage);
    await Promise.all(errors.map(async (err) => {
      await this.printError(err, { fullStack: true, type: err.type || "Unhandled Error" });
    }));
    this.log(c.red(divider()));
  }
  async printSourceTypeErrors(errors) {
    const errorMessage = c.red(c.bold(
      `
Vitest found ${errors.length} error${errors.length > 1 ? "s" : ""} not related to your test files.`
    ));
    this.log(c.red(divider(c.bold(c.inverse(" Source Errors ")))));
    this.log(errorMessage);
    await Promise.all(errors.map(async (err) => {
      await this.printError(err, { fullStack: true });
    }));
    this.log(c.red(divider()));
  }
}

function CoverageTransform(ctx) {
  return {
    name: "vitest:coverage-transform",
    transform(srcCode, id) {
      var _a, _b;
      return (_b = (_a = ctx.coverageProvider) == null ? void 0 : _a.onFileTransform) == null ? void 0 : _b.call(_a, srcCode, normalizeRequestId(id), this);
    }
  };
}

const API_NOT_FOUND_ERROR = `There are some problems in resolving the mocks API.
You may encounter this issue when importing the mocks API from another module other than 'vitest'.
To fix this issue you can either:
- import the mocks API directly from 'vitest'
- enable the 'globals' options`;
const API_NOT_FOUND_CHECK = `
if (typeof globalThis.vi === "undefined" && typeof globalThis.vitest === "undefined") { throw new Error(${JSON.stringify(API_NOT_FOUND_ERROR)}) }
`;
function isIdentifier(node) {
  return node.type === "Identifier";
}
function transformImportSpecifiers(node) {
  const dynamicImports = node.specifiers.map((specifier) => {
    if (specifier.type === "ImportDefaultSpecifier")
      return `default: ${specifier.local.name}`;
    if (specifier.type === "ImportSpecifier") {
      const local = specifier.local.name;
      const imported = specifier.imported.name;
      if (local === imported)
        return local;
      return `${imported}: ${local}`;
    }
    return null;
  }).filter(Boolean).join(", ");
  if (!dynamicImports.length)
    return "";
  return `{ ${dynamicImports} }`;
}
const regexpHoistable = /^[ \t]*\b(vi|vitest)\s*\.\s*(mock|unmock|hoisted)\(/m;
const hashbangRE = /^#!.*\n/;
function hoistMocks(code, id, parse) {
  var _a;
  const hasMocks = regexpHoistable.test(code);
  if (!hasMocks)
    return;
  const s = new MagicString(code);
  let ast;
  try {
    ast = parse(code, {
      sourceType: "module",
      ecmaVersion: "latest",
      locations: true
    });
  } catch (err) {
    console.error(`Cannot parse ${id}:
${err.message}`);
    return;
  }
  const hoistIndex = ((_a = code.match(hashbangRE)) == null ? void 0 : _a[0].length) ?? 0;
  let hoistedCode = "";
  let hoistedVitestImports = "";
  const transformImportDeclaration = (node) => {
    const source = node.source.value;
    const namespace = node.specifiers.find((specifier) => specifier.type === "ImportNamespaceSpecifier");
    let code2 = "";
    if (namespace)
      code2 += `const ${namespace.local.name} = await import('${source}')
`;
    const specifiers = transformImportSpecifiers(node);
    if (specifiers) {
      if (namespace)
        code2 += `const ${specifiers} = ${namespace.local.name}
`;
      else
        code2 += `const ${specifiers} = await import('${source}')
`;
    } else if (!namespace) {
      code2 += `await import('${source}')
`;
    }
    return code2;
  };
  function hoistImport(node) {
    s.remove(node.start, node.end);
    if (node.source.value === "vitest") {
      const code3 = `const ${transformImportSpecifiers(node)} = await import('vitest')
`;
      hoistedVitestImports += code3;
      return;
    }
    const code2 = transformImportDeclaration(node);
    s.appendLeft(hoistIndex, code2);
  }
  for (const node of ast.body) {
    if (node.type === "ImportDeclaration")
      hoistImport(node);
  }
  simple(ast, {
    CallExpression(_node) {
      var _a2, _b;
      const node = _node;
      if (node.callee.type === "MemberExpression" && isIdentifier(node.callee.object) && (node.callee.object.name === "vi" || node.callee.object.name === "vitest") && isIdentifier(node.callee.property)) {
        const methodName = node.callee.property.name;
        if (methodName === "mock" || methodName === "unmock") {
          hoistedCode += `${code.slice(node.start, node.end)}
`;
          s.remove(node.start, node.end);
        }
        if (methodName === "hoisted") {
          const declarationNode = (_a2 = findNodeAround(ast, node.start, "VariableDeclaration")) == null ? void 0 : _a2.node;
          const init = (_b = declarationNode == null ? void 0 : declarationNode.declarations[0]) == null ? void 0 : _b.init;
          const isViHoisted = (node2) => {
            return node2.callee.type === "MemberExpression" && isIdentifier(node2.callee.object) && (node2.callee.object.name === "vi" || node2.callee.object.name === "vitest") && isIdentifier(node2.callee.property) && node2.callee.property.name === "hoisted";
          };
          const canMoveDeclaration = init && init.type === "CallExpression" && isViHoisted(init) || init && init.type === "AwaitExpression" && init.argument.type === "CallExpression" && isViHoisted(init.argument);
          if (canMoveDeclaration) {
            hoistedCode += `${code.slice(declarationNode.start, declarationNode.end)}
`;
            s.remove(declarationNode.start, declarationNode.end);
          } else {
            hoistedCode += `${code.slice(node.start, node.end)}
`;
            s.remove(node.start, node.end);
          }
        }
      }
    }
  });
  if (hoistedCode || hoistedVitestImports) {
    s.prepend(
      hoistedVitestImports + (!hoistedVitestImports && hoistedCode ? API_NOT_FOUND_CHECK : "") + hoistedCode
    );
  }
  return {
    ast,
    code: s.toString(),
    map: s.generateMap({ hires: true, source: id })
  };
}

function MocksPlugin() {
  return {
    name: "vite:mocks",
    enforce: "post",
    transform(code, id) {
      return hoistMocks(code, id, this.parse);
    }
  };
}

async function createBrowserServer(project, options) {
  const root = project.config.root;
  await ensurePackageInstalled("@vitest/browser", root);
  const configPath = options.config === false ? false : options.config ? resolve(root, options.config) : await findUp(configFiles, { cwd: root });
  const server = await createServer({
    logLevel: "error",
    mode: project.config.mode,
    configFile: configPath,
    // watch is handled by Vitest
    server: {
      hmr: false,
      watch: {
        ignored: ["**/**"]
      }
    },
    plugins: [
      (await import('@vitest/browser')).default(project, "/"),
      CoverageTransform(project.ctx),
      {
        enforce: "post",
        name: "vitest:browser:config",
        async config(config) {
          var _a, _b, _c;
          const server2 = resolveApiServerConfig(((_a = config.test) == null ? void 0 : _a.browser) || {}) || {
            port: defaultBrowserPort
          };
          config.server = server2;
          (_b = config.server).fs ?? (_b.fs = {});
          config.server.fs.strict = false;
          return {
            resolve: {
              alias: (_c = config.test) == null ? void 0 : _c.alias
            }
          };
        }
      },
      MocksPlugin()
    ]
  });
  await server.listen();
  await server.watcher.close();
  (await import('./chunk-api-setup.644415c3.js')).setup(project, server);
  return server;
}

const playwrightBrowsers = ["firefox", "webkit", "chromium"];
class PlaywrightBrowserProvider {
  name = "playwright";
  cachedBrowser = null;
  browser;
  ctx;
  getSupportedBrowsers() {
    return playwrightBrowsers;
  }
  async initialize(ctx, { browser }) {
    this.ctx = ctx;
    this.browser = browser;
    const root = this.ctx.config.root;
    if (!await ensurePackageInstalled("playwright", root))
      throw new Error('Cannot find "playwright" package. Please install it manually.');
  }
  async openBrowser() {
    if (this.cachedBrowser)
      return this.cachedBrowser;
    const options = this.ctx.config.browser;
    const playwright = await import('playwright');
    const playwrightInstance = await playwright[this.browser].launch({ headless: options.headless });
    this.cachedBrowser = await playwrightInstance.newPage();
    this.cachedBrowser.on("close", () => {
      playwrightInstance.close();
    });
    return this.cachedBrowser;
  }
  catchError(cb) {
    var _a;
    (_a = this.cachedBrowser) == null ? void 0 : _a.on("pageerror", cb);
    return () => {
      var _a2;
      (_a2 = this.cachedBrowser) == null ? void 0 : _a2.off("pageerror", cb);
    };
  }
  async openPage(url) {
    const browserInstance = await this.openBrowser();
    await browserInstance.goto(url);
  }
  async close() {
    var _a;
    await ((_a = this.cachedBrowser) == null ? void 0 : _a.close());
    process.exit();
  }
}

const webdriverBrowsers = ["firefox", "chrome", "edge", "safari"];
class WebdriverBrowserProvider {
  name = "webdriverio";
  cachedBrowser = null;
  stopSafari = () => {
  };
  browser;
  ctx;
  getSupportedBrowsers() {
    return webdriverBrowsers;
  }
  async initialize(ctx, { browser }) {
    this.ctx = ctx;
    this.browser = browser;
    const root = this.ctx.config.root;
    if (!await ensurePackageInstalled("webdriverio", root))
      throw new Error('Cannot find "webdriverio" package. Please install it manually.');
    if (browser === "safari" && !await ensurePackageInstalled("safaridriver", root))
      throw new Error('Cannot find "safaridriver" package. Please install it manually.');
  }
  async openBrowser() {
    if (this.cachedBrowser)
      return this.cachedBrowser;
    const options = this.ctx.config.browser;
    if (this.browser === "safari") {
      const safaridriver = await import('safaridriver');
      safaridriver.start({ diagnose: true });
      this.stopSafari = () => safaridriver.stop();
      process.on("beforeExit", () => {
        safaridriver.stop();
      });
    }
    const { remote } = await import('webdriverio');
    this.cachedBrowser = await remote({
      logLevel: "error",
      capabilities: {
        "browserName": this.browser,
        "wdio:devtoolsOptions": { headless: options.headless }
      }
    });
    return this.cachedBrowser;
  }
  async openPage(url) {
    const browserInstance = await this.openBrowser();
    await browserInstance.url(url);
  }
  // TODO
  catchError(_cb) {
    return () => {
    };
  }
  async close() {
    var _a, _b, _c;
    await Promise.all([
      this.stopSafari(),
      ((_a = this.cachedBrowser) == null ? void 0 : _a.sessionId) ? (_c = (_b = this.cachedBrowser) == null ? void 0 : _b.deleteSession) == null ? void 0 : _c.call(_b) : null
    ]);
    process.exit();
  }
}

async function getBrowserProvider(options, loader) {
  switch (options.provider) {
    case void 0:
    case "webdriverio":
      return WebdriverBrowserProvider;
    case "playwright":
      return PlaywrightBrowserProvider;
  }
  let customProviderModule;
  try {
    customProviderModule = await loader.executeId(options.provider);
  } catch (error) {
    throw new Error(`Failed to load custom BrowserProvider from ${options.provider}`, { cause: error });
  }
  if (customProviderModule.default == null)
    throw new Error(`Custom BrowserProvider loaded from ${options.provider} was not the default export`);
  return customProviderModule.default;
}

function generateCssFilenameHash(filepath) {
  return createHash("md5").update(filepath).digest("hex").slice(0, 6);
}
function generateScopedClassName(strategy, name, filename) {
  if (strategy === "scoped")
    return null;
  if (strategy === "non-scoped")
    return name;
  const hash = generateCssFilenameHash(filename);
  return `_${name}_${hash}`;
}

const cssLangs = "\\.(css|less|sass|scss|styl|stylus|pcss|postcss)($|\\?)";
const cssLangRE = new RegExp(cssLangs);
const cssModuleRE = new RegExp(`\\.module${cssLangs}`);
function isCSS(id) {
  return cssLangRE.test(id);
}
function isCSSModule(id) {
  return cssModuleRE.test(id);
}
function getCSSModuleProxyReturn(strategy, filename) {
  if (strategy === "non-scoped")
    return "style";
  const hash = generateCssFilenameHash(filename);
  return `\`_\${style}_${hash}\``;
}
function CSSEnablerPlugin(ctx) {
  const shouldProcessCSS = (id) => {
    const { css } = ctx.config;
    if (typeof css === "boolean")
      return css;
    if (toArray(css.exclude).some((re) => re.test(id)))
      return false;
    if (toArray(css.include).some((re) => re.test(id)))
      return true;
    return false;
  };
  return [
    {
      name: "vitest:css-disable",
      enforce: "pre",
      transform(code, id) {
        if (!isCSS(id))
          return;
        if (!shouldProcessCSS(id))
          return { code: "" };
      }
    },
    {
      name: "vitest:css-empty-post",
      enforce: "post",
      transform(_, id) {
        var _a;
        if (!isCSS(id) || shouldProcessCSS(id))
          return;
        if (isCSSModule(id)) {
          const scopeStrategy = typeof ctx.config.css !== "boolean" && ((_a = ctx.config.css.modules) == null ? void 0 : _a.classNameStrategy) || "stable";
          const proxyReturn = getCSSModuleProxyReturn(scopeStrategy, relative(ctx.config.root, id));
          const code = `export default new Proxy(Object.create(null), {
            get(_, style) {
              return ${proxyReturn};
            },
          })`;
          return { code };
        }
        return { code: 'export default ""' };
      }
    }
  ];
}

function SsrReplacerPlugin() {
  return {
    name: "vitest:env-replacer",
    enforce: "pre",
    transform(code, id) {
      if (!/\bimport\.meta\.env\b/.test(code) && !/\bimport\.meta\.url\b/.test(code))
        return null;
      let s = null;
      const cleanCode = stripLiteral(code);
      const envs = cleanCode.matchAll(/\bimport\.meta\.env\b/g);
      for (const env of envs) {
        s || (s = new MagicString(code));
        const startIndex = env.index;
        const endIndex = startIndex + env[0].length;
        s.overwrite(startIndex, endIndex, "process.env");
      }
      const urls = cleanCode.matchAll(/\bimport\.meta\.url\b/g);
      for (const env of urls) {
        s || (s = new MagicString(code));
        const startIndex = env.index;
        const endIndex = startIndex + env[0].length;
        s.overwrite(startIndex, endIndex, "__vite_ssr_import_meta__.url");
      }
      if (s) {
        return {
          code: s.toString(),
          map: s.generateMap({
            hires: true,
            // Remove possible query parameters, e.g. vue's "?vue&type=script&src=true&lang.ts"
            source: cleanUrl(id)
          })
        };
      }
    }
  };
}

async function loadGlobalSetupFiles(project) {
  var _a;
  const server = project.server;
  const runner = project.runner;
  const globalSetupFiles = toArray((_a = server.config.test) == null ? void 0 : _a.globalSetup);
  return Promise.all(globalSetupFiles.map((file) => loadGlobalSetupFile(file, runner)));
}
async function loadGlobalSetupFile(file, runner) {
  const m = await runner.executeFile(file);
  for (const exp of ["default", "setup", "teardown"]) {
    if (m[exp] != null && typeof m[exp] !== "function")
      throw new Error(`invalid export in globalSetup file ${file}: ${exp} must be a function`);
  }
  if (m.default) {
    return {
      file,
      setup: m.default
    };
  } else if (m.setup || m.teardown) {
    return {
      file,
      setup: m.setup,
      teardown: m.teardown
    };
  } else {
    throw new Error(`invalid globalSetup file ${file}. Must export setup, teardown or have a default export`);
  }
}
function GlobalSetupPlugin(project, logger) {
  let globalSetupFiles;
  return {
    name: "vitest:global-setup-plugin",
    enforce: "pre",
    async buildStart() {
      var _a, _b;
      if (!((_a = project.server.config.test) == null ? void 0 : _a.globalSetup))
        return;
      globalSetupFiles = await loadGlobalSetupFiles(project);
      try {
        for (const globalSetupFile of globalSetupFiles) {
          const teardown = await ((_b = globalSetupFile.setup) == null ? void 0 : _b.call(globalSetupFile));
          if (teardown == null || !!globalSetupFile.teardown)
            continue;
          if (typeof teardown !== "function")
            throw new Error(`invalid return value in globalSetup file ${globalSetupFile.file}. Must return a function`);
          globalSetupFile.teardown = teardown;
        }
      } catch (e) {
        logger.error(`
${c.red(divider(c.bold(c.inverse(" Error during global setup "))))}`);
        await logger.printError(e);
        process.exit(1);
      }
    },
    async buildEnd() {
      var _a;
      if (globalSetupFiles == null ? void 0 : globalSetupFiles.length) {
        for (const globalSetupFile of globalSetupFiles.reverse()) {
          try {
            await ((_a = globalSetupFile.teardown) == null ? void 0 : _a.call(globalSetupFile));
          } catch (error) {
            logger.error(`error during global teardown of ${globalSetupFile.file}`, error);
          }
        }
      }
    }
  };
}

function resolveOptimizerConfig(_testOptions, viteOptions, testConfig) {
  var _a;
  const testOptions = _testOptions || {};
  const newConfig = {};
  const [major, minor] = version$2.split(".").map(Number);
  const allowed = major >= 5 || major === 4 && minor >= 3;
  if (!allowed && (testOptions == null ? void 0 : testOptions.enabled) === true)
    console.warn(`Vitest: "deps.optimizer" is only available in Vite >= 4.3.0, current Vite version: ${version$2}`);
  else
    testOptions.enabled ?? (testOptions.enabled = true);
  if (!allowed || (testOptions == null ? void 0 : testOptions.enabled) !== true) {
    newConfig.cacheDir = void 0;
    newConfig.optimizeDeps = {
      // experimental in Vite >2.9.2, entries remains to help with older versions
      disabled: true,
      entries: []
    };
  } else {
    const cacheDir = testConfig.cache !== false ? (_a = testConfig.cache) == null ? void 0 : _a.dir : null;
    newConfig.cacheDir = cacheDir ?? "node_modules/.vitest";
    newConfig.optimizeDeps = {
      ...viteOptions,
      ...testOptions,
      noDiscovery: true,
      disabled: false,
      entries: [],
      exclude: ["vitest", ...builtinModules, ...testOptions.exclude || (viteOptions == null ? void 0 : viteOptions.exclude) || []],
      include: (testOptions.include || (viteOptions == null ? void 0 : viteOptions.include) || []).filter((n) => n !== "vitest")
    };
  }
  return newConfig;
}
function deleteDefineConfig(viteConfig) {
  const defines = {};
  if (viteConfig.define) {
    delete viteConfig.define["import.meta.vitest"];
    delete viteConfig.define["process.env"];
    delete viteConfig.define.process;
    delete viteConfig.define.global;
  }
  for (const key in viteConfig.define) {
    const val = viteConfig.define[key];
    let replacement;
    try {
      replacement = typeof val === "string" ? JSON.parse(val) : val;
    } catch {
      continue;
    }
    if (key.startsWith("import.meta.env.")) {
      const envKey = key.slice("import.meta.env.".length);
      process.env[envKey] = replacement;
      delete viteConfig.define[key];
    } else if (key.startsWith("process.env.")) {
      const envKey = key.slice("process.env.".length);
      process.env[envKey] = replacement;
      delete viteConfig.define[key];
    } else if (!key.includes(".")) {
      defines[key] = replacement;
      delete viteConfig.define[key];
    }
  }
  return defines;
}

function VitestResolver(ctx) {
  return {
    name: "vitest:resolve-root",
    enforce: "pre",
    async resolveId(id) {
      if (id === "vitest" || id.startsWith("@vitest/")) {
        return this.resolve(
          id,
          join(ctx.config.root, "index.html"),
          { skipSelf: true }
        );
      }
    }
  };
}

function WorkspaceVitestPlugin(project, options) {
  return [
    {
      name: "vitest:project",
      enforce: "pre",
      options() {
        this.meta.watchMode = false;
      },
      config(viteConfig) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const env = deleteDefineConfig(viteConfig);
        const testConfig = viteConfig.test || {};
        const root = testConfig.root || viteConfig.root || options.root;
        let name = testConfig.name;
        if (!name) {
          if (typeof options.workspacePath === "string")
            name = dirname(options.workspacePath).split("/").pop();
          else
            name = options.workspacePath.toString();
        }
        const config = {
          root,
          resolve: {
            // by default Vite resolves `module` field, which not always a native ESM module
            // setting this option can bypass that and fallback to cjs version
            mainFields: [],
            alias: testConfig.alias,
            conditions: ["node"],
            // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
            // @ts-ignore we support Vite ^3.0, but browserField is available in Vite ^3.2
            browserField: false
          },
          esbuild: {
            sourcemap: "external",
            // Enables using ignore hint for coverage providers with @preserve keyword
            legalComments: "inline"
          },
          server: {
            // disable watch mode in workspaces,
            // because it is handled by the top-level watcher
            watch: {
              ignored: ["**/*"],
              depth: 0,
              persistent: false
            },
            open: false,
            hmr: false,
            preTransformRequests: false
          },
          test: {
            env,
            name
          }
        };
        const classNameStrategy = typeof testConfig.css !== "boolean" && ((_b = (_a = testConfig.css) == null ? void 0 : _a.modules) == null ? void 0 : _b.classNameStrategy) || "stable";
        if (classNameStrategy !== "scoped") {
          config.css ?? (config.css = {});
          (_c = config.css).modules ?? (_c.modules = {});
          if (config.css.modules) {
            config.css.modules.generateScopedName = (name2, filename) => {
              const root2 = project.config.root;
              return generateScopedClassName(classNameStrategy, name2, relative(root2, filename));
            };
          }
        }
        const webOptimizer = resolveOptimizerConfig((_e = (_d = testConfig.deps) == null ? void 0 : _d.optimizer) == null ? void 0 : _e.web, viteConfig.optimizeDeps, testConfig);
        const ssrOptimizer = resolveOptimizerConfig((_g = (_f = testConfig.deps) == null ? void 0 : _f.optimizer) == null ? void 0 : _g.ssr, (_h = viteConfig.ssr) == null ? void 0 : _h.optimizeDeps, testConfig);
        config.cacheDir = webOptimizer.cacheDir || ssrOptimizer.cacheDir || config.cacheDir;
        config.optimizeDeps = webOptimizer.optimizeDeps;
        config.ssr = {
          optimizeDeps: ssrOptimizer.optimizeDeps
        };
        return config;
      },
      async configureServer(server) {
        try {
          const options2 = deepMerge(
            {},
            configDefaults,
            server.config.test || {}
          );
          await project.setServer(options2, server);
        } catch (err) {
          await project.ctx.logger.printError(err, { fullStack: true });
          process.exit(1);
        }
        await server.watcher.close();
      }
    },
    SsrReplacerPlugin(),
    ...CSSEnablerPlugin(project),
    CoverageTransform(project.ctx),
    GlobalSetupPlugin(project, project.ctx.logger),
    MocksPlugin(),
    VitestResolver(project.ctx)
  ];
}

async function initializeProject(workspacePath, ctx, options) {
  var _a, _b, _c, _d, _e, _f, _g;
  const project = new WorkspaceProject(workspacePath, ctx);
  const configFile = options.extends ? resolve(dirname(options.workspaceConfigPath), options.extends) : typeof workspacePath === "number" || workspacePath.endsWith("/") ? false : workspacePath;
  const root = options.root || (typeof workspacePath === "number" ? void 0 : dirname(workspacePath));
  const config = {
    ...options,
    root,
    logLevel: "error",
    configFile,
    // this will make "mode" = "test" inside defineConfig
    mode: options.mode || ctx.config.mode || process.env.NODE_ENV,
    plugins: [
      ...options.plugins || [],
      WorkspaceVitestPlugin(project, { ...options, root, workspacePath })
    ]
  };
  const server = await createServer(config);
  if (((_a = ctx.config.api) == null ? void 0 : _a.port) || ((_d = (_c = (_b = project.config.deps) == null ? void 0 : _b.optimizer) == null ? void 0 : _c.web) == null ? void 0 : _d.enabled) || ((_g = (_f = (_e = project.config.deps) == null ? void 0 : _e.optimizer) == null ? void 0 : _f.ssr) == null ? void 0 : _g.enabled))
    await server.listen();
  else
    await server.pluginContainer.buildStart({});
  return project;
}
class WorkspaceProject {
  constructor(path, ctx) {
    this.path = path;
    this.ctx = ctx;
  }
  configOverride;
  config;
  server;
  vitenode;
  runner;
  browser;
  typechecker;
  closingPromise;
  browserProvider;
  testFilesList = [];
  getName() {
    return this.config.name || "";
  }
  isCore() {
    return this.ctx.getCoreWorkspaceProject() === this;
  }
  getModuleById(id) {
    var _a;
    return this.server.moduleGraph.getModuleById(id) || ((_a = this.browser) == null ? void 0 : _a.moduleGraph.getModuleById(id));
  }
  getSourceMapModuleById(id) {
    var _a, _b;
    const mod = this.server.moduleGraph.getModuleById(id);
    return ((_a = mod == null ? void 0 : mod.ssrTransformResult) == null ? void 0 : _a.map) || ((_b = mod == null ? void 0 : mod.transformResult) == null ? void 0 : _b.map);
  }
  getBrowserSourceMapModuleById(id) {
    var _a, _b, _c;
    return (_c = (_b = (_a = this.browser) == null ? void 0 : _a.moduleGraph.getModuleById(id)) == null ? void 0 : _b.transformResult) == null ? void 0 : _c.map;
  }
  get reporters() {
    return this.ctx.reporters;
  }
  async globTestFiles(filters = []) {
    const dir = this.config.dir || this.config.root;
    const testFiles = await this.globAllTestFiles(this.config, dir);
    return this.filterFiles(testFiles, filters, dir);
  }
  async globAllTestFiles(config, cwd) {
    const { include, exclude, includeSource } = config;
    const testFiles = await this.globFiles(include, exclude, cwd);
    if (includeSource) {
      const files = await this.globFiles(includeSource, exclude, cwd);
      await Promise.all(files.map(async (file) => {
        try {
          const code = await promises.readFile(file, "utf-8");
          if (this.isInSourceTestFile(code))
            testFiles.push(file);
        } catch {
          return null;
        }
      }));
    }
    this.testFilesList = testFiles;
    return testFiles;
  }
  isTestFile(id) {
    return this.testFilesList.includes(id);
  }
  async globFiles(include, exclude, cwd) {
    const globOptions = {
      absolute: true,
      dot: true,
      cwd,
      ignore: exclude
    };
    return fg(include, globOptions);
  }
  async isTargetFile(id, source) {
    var _a;
    const relativeId = relative(this.config.dir || this.config.root, id);
    if (mm.isMatch(relativeId, this.config.exclude))
      return false;
    if (mm.isMatch(relativeId, this.config.include))
      return true;
    if (((_a = this.config.includeSource) == null ? void 0 : _a.length) && mm.isMatch(relativeId, this.config.includeSource)) {
      source = source || await promises.readFile(id, "utf-8");
      return this.isInSourceTestFile(source);
    }
    return false;
  }
  isInSourceTestFile(code) {
    return code.includes("import.meta.vitest");
  }
  filterFiles(testFiles, filters = [], dir) {
    if (filters.length && process.platform === "win32")
      filters = filters.map((f) => toNamespacedPath(f));
    if (filters.length) {
      return testFiles.filter((t) => {
        const testFile = relative(dir, t);
        return filters.some((f) => {
          return testFile.includes(f) || testFile.includes(relative(dir, f));
        });
      });
    }
    return testFiles;
  }
  async initBrowserServer(options) {
    var _a;
    if (!this.isBrowserEnabled())
      return;
    await ((_a = this.browser) == null ? void 0 : _a.close());
    this.browser = await createBrowserServer(this, options);
  }
  async setServer(options, server, params = {}) {
    this.config = resolveConfig(this.ctx.mode, options, server.config);
    this.server = server;
    this.vitenode = params.server ?? new ViteNodeServer(server, this.config);
    const node = this.vitenode;
    this.runner = params.runner ?? new ViteNodeRunner({
      root: server.config.root,
      base: server.config.base,
      fetchModule(id) {
        return node.fetchModule(id);
      },
      resolveId(id, importer) {
        return node.resolveId(id, importer);
      }
    });
    await this.initBrowserServer(options);
  }
  async report(name, ...args) {
    return this.ctx.report(name, ...args);
  }
  async typecheck(filters = []) {
    const dir = this.config.dir || this.config.root;
    const { include, exclude } = this.config.typecheck;
    const testFiles = await this.globFiles(include, exclude, dir);
    const testsFilesList = this.filterFiles(testFiles, filters, dir);
    const checker = new Typechecker(this, testsFilesList);
    this.typechecker = checker;
    checker.onParseEnd(async ({ files, sourceErrors }) => {
      this.ctx.state.collectFiles(checker.getTestFiles());
      await this.report("onTaskUpdate", checker.getTestPacks());
      await this.report("onCollected");
      const failedTests = hasFailed(files);
      const exitCode = !failedTests && checker.getExitCode();
      if (exitCode) {
        const error = new Error(checker.getOutput());
        error.stack = "";
        this.ctx.state.catchError(error, "Typecheck Error");
      }
      if (!files.length) {
        this.ctx.logger.printNoTestFound();
      } else {
        if (failedTests)
          process.exitCode = 1;
        await this.report("onFinished", files);
      }
      if (sourceErrors.length && !this.config.typecheck.ignoreSourceErrors) {
        process.exitCode = 1;
        await this.ctx.logger.printSourceTypeErrors(sourceErrors);
      }
      if (!files.length) {
        const exitCode2 = this.config.passWithNoTests ? process.exitCode ?? 0 : 1;
        await this.close();
        process.exit(exitCode2);
      }
      if (this.config.watch) {
        await this.report("onWatcherStart", files, [
          ...this.config.typecheck.ignoreSourceErrors ? [] : sourceErrors,
          ...this.ctx.state.getUnhandledErrors()
        ]);
      }
    });
    checker.onParseStart(async () => {
      await this.report("onInit", this.ctx);
      this.ctx.state.collectFiles(checker.getTestFiles());
      await this.report("onCollected");
    });
    checker.onWatcherRerun(async () => {
      await this.report("onWatcherRerun", testsFilesList, "File change detected. Triggering rerun.");
      await checker.collectTests();
      this.ctx.state.collectFiles(checker.getTestFiles());
      await this.report("onTaskUpdate", checker.getTestPacks());
      await this.report("onCollected");
    });
    await checker.prepare();
    await checker.collectTests();
    await checker.start();
  }
  isBrowserEnabled() {
    return isBrowserEnabled(this.config);
  }
  getSerializableConfig() {
    var _a, _b, _c, _d, _e, _f;
    return deepMerge(
      {
        ...this.config,
        coverage: this.ctx.config.coverage,
        reporters: [],
        deps: {
          ...this.config.deps,
          optimizer: {
            web: {
              enabled: ((_c = (_b = (_a = this.config.deps) == null ? void 0 : _a.optimizer) == null ? void 0 : _b.web) == null ? void 0 : _c.enabled) ?? false
            },
            ssr: {
              enabled: ((_f = (_e = (_d = this.config.deps) == null ? void 0 : _d.optimizer) == null ? void 0 : _e.ssr) == null ? void 0 : _f.enabled) ?? false
            }
          }
        },
        snapshotOptions: {
          ...this.config.snapshotOptions,
          resolveSnapshotPath: void 0
        },
        onConsoleLog: void 0,
        sequence: {
          ...this.ctx.config.sequence,
          sequencer: void 0
        },
        benchmark: {
          ...this.config.benchmark,
          reporters: []
        },
        inspect: this.ctx.config.inspect,
        inspectBrk: this.ctx.config.inspectBrk
      },
      this.ctx.configOverride || {}
    );
  }
  close() {
    var _a, _b;
    if (!this.closingPromise) {
      this.closingPromise = Promise.all([
        this.server.close(),
        (_a = this.typechecker) == null ? void 0 : _a.stop(),
        (_b = this.browser) == null ? void 0 : _b.close()
      ].filter(Boolean));
    }
    return this.closingPromise;
  }
  async initBrowserProvider() {
    if (!this.isBrowserEnabled())
      return;
    if (this.browserProvider)
      return;
    const Provider = await getBrowserProvider(this.config.browser, this.runner);
    this.browserProvider = new Provider();
    const browser = this.config.browser.name;
    const supportedBrowsers = this.browserProvider.getSupportedBrowsers();
    if (!browser)
      throw new Error(`[${this.getName()}] Browser name is required. Please, set \`test.browser.name\` option manually.`);
    if (!supportedBrowsers.includes(browser))
      throw new Error(`[${this.getName()}] Browser "${browser}" is not supported by the browser provider "${this.browserProvider.name}". Supported browsers: ${supportedBrowsers.join(", ")}.`);
    await this.browserProvider.initialize(this, { browser });
  }
}

const WATCHER_DEBOUNCE = 100;
class Vitest {
  constructor(mode) {
    this.mode = mode;
    this.logger = new Logger(this);
  }
  config = void 0;
  configOverride = {};
  server = void 0;
  state = void 0;
  snapshot = void 0;
  cache = void 0;
  reporters = void 0;
  coverageProvider;
  browserProvider;
  logger;
  pool;
  vitenode = void 0;
  invalidates = /* @__PURE__ */ new Set();
  changedTests = /* @__PURE__ */ new Set();
  filenamePattern;
  runningPromise;
  closingPromise;
  isCancelling = false;
  isFirstRun = true;
  restartsCount = 0;
  runner = void 0;
  coreWorkspace;
  projects = [];
  projectsTestFiles = /* @__PURE__ */ new Map();
  _onRestartListeners = [];
  _onSetServer = [];
  _onCancelListeners = [];
  async setServer(options, server, cliOptions) {
    var _a, _b, _c;
    (_a = this.unregisterWatcher) == null ? void 0 : _a.call(this);
    clearTimeout(this._rerunTimer);
    this.restartsCount += 1;
    (_b = this.pool) == null ? void 0 : _b.close();
    this.pool = void 0;
    this.coverageProvider = void 0;
    this.runningPromise = void 0;
    this.projectsTestFiles.clear();
    const resolved = resolveConfig(this.mode, options, server.config);
    this.server = server;
    this.config = resolved;
    this.state = new StateManager();
    this.cache = new VitestCache();
    this.snapshot = new SnapshotManager({ ...resolved.snapshotOptions });
    if (this.config.watch && this.mode !== "typecheck")
      this.registerWatcher();
    this.vitenode = new ViteNodeServer(server, this.config.server);
    const node = this.vitenode;
    this.runner = new ViteNodeRunner({
      root: server.config.root,
      base: server.config.base,
      fetchModule(id) {
        return node.fetchModule(id);
      },
      resolveId(id, importer) {
        return node.resolveId(id, importer);
      }
    });
    if (this.config.watch) {
      const serverRestart = server.restart;
      server.restart = async (...args) => {
        await Promise.all(this._onRestartListeners.map((fn) => fn()));
        return await serverRestart(...args);
      };
      server.watcher.on("change", async (file) => {
        file = normalize(file);
        const isConfig = file === server.config.configFile;
        if (isConfig) {
          await Promise.all(this._onRestartListeners.map((fn) => fn("config")));
          await serverRestart();
        }
      });
    }
    this.reporters = resolved.mode === "benchmark" ? await createBenchmarkReporters(toArray((_c = resolved.benchmark) == null ? void 0 : _c.reporters), this.runner) : await createReporters(resolved.reporters, this.runner);
    this.cache.results.setConfig(resolved.root, resolved.cache);
    try {
      await this.cache.results.readFromCache();
    } catch {
    }
    await Promise.all(this._onSetServer.map((fn) => fn()));
    this.projects = await this.resolveWorkspace(options, cliOptions);
    if (this.config.testNamePattern)
      this.configOverride.testNamePattern = this.config.testNamePattern;
  }
  async createCoreWorkspace(options) {
    const coreWorkspace = new WorkspaceProject(this.config.root, this);
    await coreWorkspace.setServer(options, this.server, {
      runner: this.runner,
      server: this.vitenode
    });
    this.coreWorkspace = coreWorkspace;
    return coreWorkspace;
  }
  getCoreWorkspaceProject() {
    return this.coreWorkspace || null;
  }
  getProjectByTaskId(taskId) {
    var _a;
    const task = this.state.idMap.get(taskId);
    const projectName = task.projectName || ((_a = task == null ? void 0 : task.file) == null ? void 0 : _a.projectName);
    return this.projects.find((p) => p.getName() === projectName) || this.getCoreWorkspaceProject() || this.projects[0];
  }
  async resolveWorkspace(options, cliOptions) {
    const configDir = this.server.config.configFile ? dirname(this.server.config.configFile) : this.config.root;
    const rootFiles = await promises.readdir(configDir);
    const workspaceConfigName = workspacesFiles.find((configFile) => {
      return rootFiles.includes(configFile);
    });
    if (!workspaceConfigName)
      return [await this.createCoreWorkspace(options)];
    const workspaceConfigPath = join(configDir, workspaceConfigName);
    const workspaceModule = await this.runner.executeFile(workspaceConfigPath);
    if (!workspaceModule.default || !Array.isArray(workspaceModule.default))
      throw new Error(`Workspace config file ${workspaceConfigPath} must export a default array of project paths.`);
    const workspaceGlobMatches = [];
    const projectsOptions = [];
    for (const project of workspaceModule.default) {
      if (typeof project === "string")
        workspaceGlobMatches.push(project.replace("<rootDir>", this.config.root));
      else
        projectsOptions.push(project);
    }
    const globOptions = {
      absolute: true,
      dot: true,
      onlyFiles: false,
      markDirectories: true,
      cwd: this.config.root,
      ignore: ["**/node_modules/**"]
    };
    const workspacesFs = await fg(workspaceGlobMatches, globOptions);
    const resolvedWorkspacesPaths = await Promise.all(workspacesFs.filter((file) => {
      if (file.endsWith("/")) {
        const hasWorkspaceWithConfig = workspacesFs.some((file2) => {
          return file2 !== file && `${dirname(file2)}/` === file;
        });
        return !hasWorkspaceWithConfig;
      }
      const filename = basename(file);
      return CONFIG_NAMES.some((configName) => filename.startsWith(configName));
    }).map(async (filepath) => {
      if (filepath.endsWith("/")) {
        const filesInside = await promises.readdir(filepath);
        const configFile = configFiles.find((config) => filesInside.includes(config));
        return configFile ? join(filepath, configFile) : filepath;
      }
      return filepath;
    }));
    const overridesOptions = [
      "logHeapUsage",
      "allowOnly",
      "sequence",
      "testTimeout",
      "threads",
      "singleThread",
      "isolate",
      "globals",
      "mode"
    ];
    const cliOverrides = overridesOptions.reduce((acc, name) => {
      if (name in cliOptions)
        acc[name] = cliOptions[name];
      return acc;
    }, {});
    const projects = resolvedWorkspacesPaths.map(async (workspacePath) => {
      if (this.server.config.configFile === workspacePath)
        return this.createCoreWorkspace(options);
      return initializeProject(workspacePath, this, { workspaceConfigPath, test: cliOverrides });
    });
    projectsOptions.forEach((options2, index) => {
      projects.push(initializeProject(index, this, mergeConfig(options2, { workspaceConfigPath, test: cliOverrides })));
    });
    if (!projects.length)
      return [await this.createCoreWorkspace(options)];
    const resolvedProjects = await Promise.all(projects);
    const names = /* @__PURE__ */ new Set();
    for (const project of resolvedProjects) {
      const name = project.getName();
      if (names.has(name))
        throw new Error(`Project name "${name}" is not unique. All projects in a workspace should have unique names.`);
      names.add(name);
    }
    return resolvedProjects;
  }
  async initCoverageProvider() {
    if (this.coverageProvider !== void 0)
      return;
    this.coverageProvider = await getCoverageProvider(this.config.coverage, this.runner);
    if (this.coverageProvider) {
      await this.coverageProvider.initialize(this);
      this.config.coverage = this.coverageProvider.resolveOptions();
    }
    return this.coverageProvider;
  }
  async initBrowserProviders() {
    return Promise.all(this.projects.map((w) => w.initBrowserProvider()));
  }
  typecheck(filters) {
    return Promise.all(this.projects.map((project) => project.typecheck(filters)));
  }
  async start(filters) {
    var _a, _b;
    if (this.mode === "typecheck") {
      await this.typecheck(filters);
      return;
    }
    try {
      await this.initCoverageProvider();
      await ((_a = this.coverageProvider) == null ? void 0 : _a.clean(this.config.coverage.clean));
      await this.initBrowserProviders();
    } finally {
      await this.report("onInit", this);
    }
    const files = await this.filterTestsBySource(
      await this.globTestFiles(filters)
    );
    if (!files.length) {
      await this.reportCoverage(true);
      this.logger.printNoTestFound(filters);
      if (!this.config.watch || !(this.config.changed || ((_b = this.config.related) == null ? void 0 : _b.length))) {
        const exitCode = this.config.passWithNoTests ? 0 : 1;
        process.exit(exitCode);
      }
    }
    this.config.changed = false;
    this.config.related = void 0;
    if (files.length) {
      await this.cache.stats.populateStats(this.config.root, files);
      await this.runFiles(files);
    }
    await this.reportCoverage(true);
    if (this.config.watch)
      await this.report("onWatcherStart");
  }
  async getTestDependencies(filepath, deps = /* @__PURE__ */ new Set()) {
    const addImports = async ([project, filepath2]) => {
      if (deps.has(filepath2))
        return;
      const mod = project.server.moduleGraph.getModuleById(filepath2);
      const transformed = (mod == null ? void 0 : mod.ssrTransformResult) || await project.vitenode.transformRequest(filepath2);
      if (!transformed)
        return;
      const dependencies = [...transformed.deps || [], ...transformed.dynamicDeps || []];
      await Promise.all(dependencies.map(async (dep) => {
        const path = await this.server.pluginContainer.resolveId(dep, filepath2, { ssr: true });
        const fsPath = path && !path.external && path.id.split("?")[0];
        if (fsPath && !fsPath.includes("node_modules") && !deps.has(fsPath) && existsSync(fsPath)) {
          deps.add(fsPath);
          await addImports([project, fsPath]);
        }
      }));
    };
    await addImports(filepath);
    return deps;
  }
  async filterTestsBySource(specs) {
    if (this.config.changed && !this.config.related) {
      const { VitestGit } = await import('./chunk-node-git.c410fed8.js');
      const vitestGit = new VitestGit(this.config.root);
      const related2 = await vitestGit.findChangedFiles({
        changedSince: this.config.changed
      });
      if (!related2) {
        this.logger.error(c.red("Could not find Git root. Have you initialized git with `git init`?\n"));
        process.exit(1);
      }
      this.config.related = Array.from(new Set(related2));
    }
    const related = this.config.related;
    if (!related)
      return specs;
    const forceRerunTriggers = this.config.forceRerunTriggers;
    if (forceRerunTriggers.length && mm(related, forceRerunTriggers).length)
      return specs;
    if (!this.config.watch && !related.length)
      return [];
    const testGraphs = await Promise.all(
      specs.map(async (spec) => {
        const deps = await this.getTestDependencies(spec);
        return [spec, deps];
      })
    );
    const runningTests = [];
    for (const [filepath, deps] of testGraphs) {
      if (related.some((path) => path === filepath[1] || deps.has(path)))
        runningTests.push(filepath);
    }
    return runningTests;
  }
  getProjectsByTestFile(file) {
    const projects = this.projectsTestFiles.get(file);
    if (!projects)
      return [];
    return Array.from(projects).map((project) => [project, file]);
  }
  async runFiles(paths) {
    const filepaths = paths.map(([, file]) => file);
    this.state.collectPaths(filepaths);
    await this.report("onPathsCollected", filepaths);
    await this.runningPromise;
    this._onCancelListeners = [];
    this.isCancelling = false;
    this.runningPromise = (async () => {
      if (!this.pool)
        this.pool = createPool(this);
      const invalidates = Array.from(this.invalidates);
      this.invalidates.clear();
      this.snapshot.clear();
      this.state.clearErrors();
      try {
        await this.pool.runTests(paths, invalidates);
      } catch (err) {
        this.state.catchError(err, "Unhandled Error");
      }
      const files = this.state.getFiles();
      if (hasFailed(files))
        process.exitCode = 1;
      this.cache.results.updateResults(files);
      await this.cache.results.writeToCache();
    })().finally(async () => {
      const specs = Array.from(new Set(paths.map(([, p]) => p)));
      await this.report("onFinished", this.state.getFiles(specs), this.state.getUnhandledErrors());
      this.runningPromise = void 0;
    });
    return await this.runningPromise;
  }
  async cancelCurrentRun(reason) {
    this.isCancelling = true;
    await Promise.all(this._onCancelListeners.splice(0).map((listener) => listener(reason)));
  }
  async rerunFiles(files = this.state.getFilepaths(), trigger) {
    if (this.filenamePattern) {
      const filteredFiles = await this.globTestFiles([this.filenamePattern]);
      files = files.filter((file) => filteredFiles.some((f) => f[1] === file));
    }
    if (this.coverageProvider && this.config.coverage.cleanOnRerun)
      await this.coverageProvider.clean();
    await this.report("onWatcherRerun", files, trigger);
    await this.runFiles(files.flatMap((file) => this.getProjectsByTestFile(file)));
    await this.reportCoverage(!trigger);
    await this.report("onWatcherStart", this.state.getFiles(files));
  }
  async changeNamePattern(pattern, files = this.state.getFilepaths(), trigger) {
    if (pattern === "")
      this.filenamePattern = void 0;
    this.configOverride.testNamePattern = pattern ? new RegExp(pattern) : void 0;
    await this.rerunFiles(files, trigger);
  }
  async changeFilenamePattern(pattern) {
    this.filenamePattern = pattern;
    const files = this.state.getFilepaths();
    const trigger = this.filenamePattern ? "change filename pattern" : "reset filename pattern";
    await this.rerunFiles(files, trigger);
  }
  async rerunFailed() {
    await this.rerunFiles(this.state.getFailedFilepaths(), "rerun failed");
  }
  async updateSnapshot(files) {
    files = files || [
      ...this.state.getFailedFilepaths(),
      ...this.snapshot.summary.uncheckedKeysByFile.map((s) => s.filePath)
    ];
    this.configOverride.snapshotOptions = {
      updateSnapshot: "all",
      // environment is resolved inside a worker thread
      snapshotEnvironment: null
    };
    try {
      await this.rerunFiles(files, "update snapshot");
    } finally {
      delete this.configOverride.snapshotOptions;
    }
  }
  _rerunTimer;
  async scheduleRerun(triggerId) {
    const currentCount = this.restartsCount;
    clearTimeout(this._rerunTimer);
    await this.runningPromise;
    clearTimeout(this._rerunTimer);
    if (this.restartsCount !== currentCount)
      return;
    this._rerunTimer = setTimeout(async () => {
      if (this.changedTests.size === 0) {
        this.invalidates.clear();
        return;
      }
      if (this.restartsCount !== currentCount)
        return;
      this.isFirstRun = false;
      this.snapshot.clear();
      let files = Array.from(this.changedTests);
      if (this.filenamePattern) {
        const filteredFiles = await this.globTestFiles([this.filenamePattern]);
        files = files.filter((file) => filteredFiles.some((f) => f[1] === file));
        if (files.length === 0)
          return;
      }
      this.changedTests.clear();
      if (this.coverageProvider && this.config.coverage.cleanOnRerun)
        await this.coverageProvider.clean();
      const triggerIds = new Set(triggerId.map((id) => relative(this.config.root, id)));
      const triggerLabel = Array.from(triggerIds).join(", ");
      await this.report("onWatcherRerun", files, triggerLabel);
      await this.runFiles(files.flatMap((file) => this.getProjectsByTestFile(file)));
      await this.reportCoverage(false);
      await this.report("onWatcherStart", this.state.getFiles(files));
    }, WATCHER_DEBOUNCE);
  }
  getModuleProjects(id) {
    return this.projects.filter((project) => {
      return project.getModuleById(id);
    });
  }
  unregisterWatcher = noop$1;
  registerWatcher() {
    const updateLastChanged = (id) => {
      const projects = this.getModuleProjects(id);
      projects.forEach(({ server, browser }) => {
        const mod = server.moduleGraph.getModuleById(id) || (browser == null ? void 0 : browser.moduleGraph.getModuleById(id));
        if (mod)
          server.moduleGraph.invalidateModule(mod);
      });
    };
    const onChange = (id) => {
      id = slash$1(id);
      updateLastChanged(id);
      const needsRerun = this.handleFileChanged(id);
      if (needsRerun.length)
        this.scheduleRerun(needsRerun);
    };
    const onUnlink = (id) => {
      id = slash$1(id);
      this.invalidates.add(id);
      if (this.state.filesMap.has(id)) {
        this.state.filesMap.delete(id);
        this.cache.results.removeFromCache(id);
        this.cache.stats.removeStats(id);
        this.changedTests.delete(id);
        this.report("onTestRemoved", id);
      }
    };
    const onAdd = async (id) => {
      id = slash$1(id);
      updateLastChanged(id);
      const matchingProjects = [];
      await Promise.all(this.projects.map(async (project) => {
        if (await project.isTargetFile(id))
          matchingProjects.push(project);
      }));
      if (matchingProjects.length > 0) {
        this.projectsTestFiles.set(id, new Set(matchingProjects));
        this.changedTests.add(id);
        this.scheduleRerun([id]);
      }
    };
    const watcher = this.server.watcher;
    if (this.config.forceRerunTriggers.length)
      watcher.add(this.config.forceRerunTriggers);
    watcher.unwatch(this.config.watchExclude);
    watcher.on("change", onChange);
    watcher.on("unlink", onUnlink);
    watcher.on("add", onAdd);
    this.unregisterWatcher = () => {
      watcher.off("change", onChange);
      watcher.off("unlink", onUnlink);
      watcher.off("add", onAdd);
      this.unregisterWatcher = noop$1;
    };
  }
  /**
   * @returns A value indicating whether rerun is needed (changedTests was mutated)
   */
  handleFileChanged(id) {
    if (this.changedTests.has(id) || this.invalidates.has(id))
      return [];
    if (mm.isMatch(id, this.config.forceRerunTriggers)) {
      this.state.getFilepaths().forEach((file) => this.changedTests.add(file));
      return [id];
    }
    const projects = this.getModuleProjects(id);
    if (!projects.length)
      return [];
    const files = [];
    for (const project of projects) {
      const { server, browser } = project;
      const mod = server.moduleGraph.getModuleById(id) || (browser == null ? void 0 : browser.moduleGraph.getModuleById(id));
      if (!mod) {
        const mods = browser == null ? void 0 : browser.moduleGraph.getModulesByFile(id);
        if (!(mods == null ? void 0 : mods.size))
          return [];
        let rerun2 = false;
        mods.forEach((m) => {
          if (m.id && this.handleFileChanged(m.id))
            rerun2 = true;
        });
        if (rerun2)
          files.push(id);
        continue;
      }
      id = normalizeRequestId(id, server.config.base);
      this.invalidates.add(id);
      if (this.state.filesMap.has(id) || project.isTestFile(id)) {
        this.changedTests.add(id);
        files.push(id);
        continue;
      }
      let rerun = false;
      mod.importers.forEach((i) => {
        if (!i.id)
          return;
        const heedsRerun = this.handleFileChanged(i.id);
        if (heedsRerun)
          rerun = true;
      });
      if (rerun)
        files.push(id);
    }
    return files;
  }
  async reportCoverage(allTestsRun) {
    if (!this.config.coverage.reportOnFailure && this.state.getCountOfFailedTests() > 0)
      return;
    if (this.coverageProvider) {
      this.logger.log(c.blue(" % ") + c.dim("Coverage report from ") + c.yellow(this.coverageProvider.name));
      await this.coverageProvider.reportCoverage({ allTestsRun });
    }
  }
  async close() {
    if (!this.closingPromise) {
      const closePromises = this.projects.map((w) => w.close().then(() => w.server = void 0));
      if (this.coreWorkspace && !this.projects.includes(this.coreWorkspace))
        closePromises.push(this.server.close().then(() => this.server = void 0));
      if (this.pool)
        closePromises.push(this.pool.close().then(() => this.pool = void 0));
      this.closingPromise = Promise.allSettled(closePromises).then((results) => {
        results.filter((r) => r.status === "rejected").forEach((err) => {
          this.logger.error("error during close", err.reason);
        });
      });
    }
    return this.closingPromise;
  }
  /**
   * Close the thread pool and exit the process
   */
  async exit(force = false) {
    setTimeout(() => {
      this.report("onProcessTimeout").then(() => {
        console.warn(`close timed out after ${this.config.teardownTimeout}ms`);
        this.state.getProcessTimeoutCauses().forEach((cause) => console.warn(cause));
        if (!this.pool) {
          const runningServers = [this.server, ...this.projects.map((p) => p.server)].filter(Boolean).length;
          if (runningServers === 1)
            console.warn("Tests closed successfully but something prevents Vite server from exiting");
          else if (runningServers > 1)
            console.warn(`Tests closed successfully but something prevents ${runningServers} Vite servers from exiting`);
          else
            console.warn("Tests closed successfully but something prevents the main process from exiting");
          console.warn('You can try to identify the cause by enabling "hanging-process" reporter. See https://vitest.dev/config/#reporters');
        }
        process.exit();
      });
    }, this.config.teardownTimeout).unref();
    await this.close();
    if (force)
      process.exit();
  }
  async report(name, ...args) {
    await Promise.all(this.reporters.map((r) => {
      var _a;
      return (_a = r[name]) == null ? void 0 : _a.call(
        r,
        ...args
      );
    }));
  }
  async globTestFiles(filters = []) {
    const files = [];
    await Promise.all(this.projects.map(async (project) => {
      const specs = await project.globTestFiles(filters);
      specs.forEach((file) => {
        files.push([project, file]);
        const projects = this.projectsTestFiles.get(file) || /* @__PURE__ */ new Set();
        projects.add(project);
        this.projectsTestFiles.set(file, projects);
      });
    }));
    return files;
  }
  // The server needs to be running for communication
  shouldKeepServer() {
    var _a;
    return !!((_a = this.config) == null ? void 0 : _a.watch);
  }
  onServerRestart(fn) {
    this._onRestartListeners.push(fn);
  }
  onAfterSetServer(fn) {
    this._onSetServer.push(fn);
  }
  onCancel(fn) {
    this._onCancelListeners.push(fn);
  }
}

async function VitestPlugin(options = {}, ctx = new Vitest("test")) {
  const userConfig = deepMerge({}, options);
  const getRoot = () => {
    var _a;
    return ((_a = ctx.config) == null ? void 0 : _a.root) || options.root || process.cwd();
  };
  async function UIPlugin() {
    await ensurePackageInstalled("@vitest/ui", getRoot());
    return (await import('@vitest/ui')).default(ctx);
  }
  return [
    {
      name: "vitest",
      enforce: "pre",
      options() {
        this.meta.watchMode = false;
      },
      async config(viteConfig) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i;
        if (options.watch) {
          options = deepMerge({}, userConfig);
        }
        const testConfig = deepMerge(
          {},
          configDefaults,
          options,
          removeUndefinedValues(viteConfig.test ?? {})
        );
        testConfig.api = resolveApiServerConfig(testConfig);
        const defines = deleteDefineConfig(viteConfig);
        options.defines = defines;
        let open;
        if (testConfig.ui && testConfig.open)
          open = testConfig.uiBase ?? "/__vitest__/";
        const config = {
          root: ((_a = viteConfig.test) == null ? void 0 : _a.root) || options.root,
          esbuild: {
            sourcemap: "external",
            // Enables using ignore hint for coverage providers with @preserve keyword
            legalComments: "inline"
          },
          resolve: {
            // by default Vite resolves `module` field, which not always a native ESM module
            // setting this option can bypass that and fallback to cjs version
            mainFields: [],
            alias: testConfig.alias,
            conditions: ["node"],
            // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
            // @ts-ignore we support Vite ^3.0, but browserField is available in Vite ^3.2
            browserField: false
          },
          server: {
            ...testConfig.api,
            watch: {
              ignored: testConfig.watchExclude
            },
            open,
            hmr: false,
            preTransformRequests: false
          }
        };
        if (process.platform === "darwin" && process.env.VITE_TEST_WATCHER_DEBUG) {
          config.server.watch.useFsEvents = false;
          config.server.watch.usePolling = false;
        }
        const classNameStrategy = typeof testConfig.css !== "boolean" && ((_c = (_b = testConfig.css) == null ? void 0 : _b.modules) == null ? void 0 : _c.classNameStrategy) || "stable";
        if (classNameStrategy !== "scoped") {
          config.css ?? (config.css = {});
          (_d = config.css).modules ?? (_d.modules = {});
          if (config.css.modules) {
            config.css.modules.generateScopedName = (name, filename) => {
              const root = getRoot();
              return generateScopedClassName(classNameStrategy, name, relative(root, filename));
            };
          }
        }
        const webOptimizer = resolveOptimizerConfig((_f = (_e = testConfig.deps) == null ? void 0 : _e.optimizer) == null ? void 0 : _f.web, viteConfig.optimizeDeps, testConfig);
        const ssrOptimizer = resolveOptimizerConfig((_h = (_g = testConfig.deps) == null ? void 0 : _g.optimizer) == null ? void 0 : _h.ssr, (_i = viteConfig.ssr) == null ? void 0 : _i.optimizeDeps, testConfig);
        config.cacheDir = webOptimizer.cacheDir || ssrOptimizer.cacheDir || config.cacheDir;
        config.optimizeDeps = webOptimizer.optimizeDeps;
        config.ssr = {
          optimizeDeps: ssrOptimizer.optimizeDeps
        };
        return config;
      },
      async configResolved(viteConfig) {
        var _a, _b, _c, _d;
        const viteConfigTest = viteConfig.test || {};
        if (viteConfigTest.watch === false)
          viteConfigTest.run = true;
        if ("alias" in viteConfigTest)
          delete viteConfigTest.alias;
        options = deepMerge(
          {},
          configDefaults,
          viteConfigTest,
          options
        );
        options.api = resolveApiServerConfig(options);
        const { PROD, DEV, ...envs } = viteConfig.env;
        (_a = process.env).PROD ?? (_a.PROD = PROD ? "1" : "");
        (_b = process.env).DEV ?? (_b.DEV = DEV ? "1" : "");
        (_c = process.env).SSR ?? (_c.SSR = "1");
        for (const name in envs)
          (_d = process.env)[name] ?? (_d[name] = envs[name]);
        if (!options.watch) {
          viteConfig.server.watch = {
            persistent: false,
            depth: 0,
            ignored: ["**/*"]
          };
        }
      },
      async configureServer(server) {
        if (options.watch && process.env.VITE_TEST_WATCHER_DEBUG) {
          server.watcher.on("ready", () => {
            console.log("[debug] watcher is ready");
          });
        }
        try {
          await ctx.setServer(options, server, userConfig);
          if (options.api && options.watch)
            (await import('./chunk-api-setup.644415c3.js')).setup(ctx);
        } catch (err) {
          await ctx.logger.printError(err, { fullStack: true });
          process.exit(1);
        }
        if (!options.watch)
          await server.watcher.close();
      }
    },
    SsrReplacerPlugin(),
    GlobalSetupPlugin(ctx, ctx.logger),
    ...CSSEnablerPlugin(ctx),
    CoverageTransform(ctx),
    options.ui ? await UIPlugin() : null,
    MocksPlugin(),
    VitestResolver(ctx)
  ].filter(notNullish);
}

async function createVitest(mode, options, viteOverrides = {}) {
  var _a, _b, _c, _d, _e, _f, _g;
  const ctx = new Vitest(mode);
  const root = resolve(options.root || process.cwd());
  const configPath = options.config === false ? false : options.config ? resolve(root, options.config) : await findUp(configFiles, { cwd: root });
  const config = {
    logLevel: "error",
    configFile: configPath,
    // this will make "mode" = "test" inside defineConfig
    mode: options.mode || process.env.NODE_ENV || mode,
    plugins: await VitestPlugin(options, ctx)
  };
  const server = await createServer(mergeConfig(config, mergeConfig(viteOverrides, { root: options.root })));
  if (((_a = ctx.config.api) == null ? void 0 : _a.port) || ((_d = (_c = (_b = ctx.config.deps) == null ? void 0 : _b.optimizer) == null ? void 0 : _c.web) == null ? void 0 : _d.enabled) || ((_g = (_f = (_e = ctx.config.deps) == null ? void 0 : _e.optimizer) == null ? void 0 : _f.ssr) == null ? void 0 : _g.enabled))
    await server.listen();
  else
    await server.pluginContainer.buildStart({});
  return ctx;
}

var prompts$2 = {};

var kleur;
var hasRequiredKleur;

function requireKleur () {
	if (hasRequiredKleur) return kleur;
	hasRequiredKleur = 1;

	const { FORCE_COLOR, NODE_DISABLE_COLORS, TERM } = process.env;

	const $ = {
		enabled: !NODE_DISABLE_COLORS && TERM !== 'dumb' && FORCE_COLOR !== '0',

		// modifiers
		reset: init(0, 0),
		bold: init(1, 22),
		dim: init(2, 22),
		italic: init(3, 23),
		underline: init(4, 24),
		inverse: init(7, 27),
		hidden: init(8, 28),
		strikethrough: init(9, 29),

		// colors
		black: init(30, 39),
		red: init(31, 39),
		green: init(32, 39),
		yellow: init(33, 39),
		blue: init(34, 39),
		magenta: init(35, 39),
		cyan: init(36, 39),
		white: init(37, 39),
		gray: init(90, 39),
		grey: init(90, 39),

		// background colors
		bgBlack: init(40, 49),
		bgRed: init(41, 49),
		bgGreen: init(42, 49),
		bgYellow: init(43, 49),
		bgBlue: init(44, 49),
		bgMagenta: init(45, 49),
		bgCyan: init(46, 49),
		bgWhite: init(47, 49)
	};

	function run(arr, str) {
		let i=0, tmp, beg='', end='';
		for (; i < arr.length; i++) {
			tmp = arr[i];
			beg += tmp.open;
			end += tmp.close;
			if (str.includes(tmp.close)) {
				str = str.replace(tmp.rgx, tmp.close + tmp.open);
			}
		}
		return beg + str + end;
	}

	function chain(has, keys) {
		let ctx = { has, keys };

		ctx.reset = $.reset.bind(ctx);
		ctx.bold = $.bold.bind(ctx);
		ctx.dim = $.dim.bind(ctx);
		ctx.italic = $.italic.bind(ctx);
		ctx.underline = $.underline.bind(ctx);
		ctx.inverse = $.inverse.bind(ctx);
		ctx.hidden = $.hidden.bind(ctx);
		ctx.strikethrough = $.strikethrough.bind(ctx);

		ctx.black = $.black.bind(ctx);
		ctx.red = $.red.bind(ctx);
		ctx.green = $.green.bind(ctx);
		ctx.yellow = $.yellow.bind(ctx);
		ctx.blue = $.blue.bind(ctx);
		ctx.magenta = $.magenta.bind(ctx);
		ctx.cyan = $.cyan.bind(ctx);
		ctx.white = $.white.bind(ctx);
		ctx.gray = $.gray.bind(ctx);
		ctx.grey = $.grey.bind(ctx);

		ctx.bgBlack = $.bgBlack.bind(ctx);
		ctx.bgRed = $.bgRed.bind(ctx);
		ctx.bgGreen = $.bgGreen.bind(ctx);
		ctx.bgYellow = $.bgYellow.bind(ctx);
		ctx.bgBlue = $.bgBlue.bind(ctx);
		ctx.bgMagenta = $.bgMagenta.bind(ctx);
		ctx.bgCyan = $.bgCyan.bind(ctx);
		ctx.bgWhite = $.bgWhite.bind(ctx);

		return ctx;
	}

	function init(open, close) {
		let blk = {
			open: `\x1b[${open}m`,
			close: `\x1b[${close}m`,
			rgx: new RegExp(`\\x1b\\[${close}m`, 'g')
		};
		return function (txt) {
			if (this !== void 0 && this.has !== void 0) {
				this.has.includes(open) || (this.has.push(open),this.keys.push(blk));
				return txt === void 0 ? this : $.enabled ? run(this.keys, txt+'') : txt+'';
			}
			return txt === void 0 ? chain([open], [blk]) : $.enabled ? run([blk], txt+'') : txt+'';
		};
	}

	kleur = $;
	return kleur;
}

var action$1;
var hasRequiredAction$1;

function requireAction$1 () {
	if (hasRequiredAction$1) return action$1;
	hasRequiredAction$1 = 1;

	action$1 = (key, isSelect) => {
	  if (key.meta && key.name !== 'escape') return;

	  if (key.ctrl) {
	    if (key.name === 'a') return 'first';
	    if (key.name === 'c') return 'abort';
	    if (key.name === 'd') return 'abort';
	    if (key.name === 'e') return 'last';
	    if (key.name === 'g') return 'reset';
	  }

	  if (isSelect) {
	    if (key.name === 'j') return 'down';
	    if (key.name === 'k') return 'up';
	  }

	  if (key.name === 'return') return 'submit';
	  if (key.name === 'enter') return 'submit'; // ctrl + J

	  if (key.name === 'backspace') return 'delete';
	  if (key.name === 'delete') return 'deleteForward';
	  if (key.name === 'abort') return 'abort';
	  if (key.name === 'escape') return 'exit';
	  if (key.name === 'tab') return 'next';
	  if (key.name === 'pagedown') return 'nextPage';
	  if (key.name === 'pageup') return 'prevPage'; // TODO create home() in prompt types (e.g. TextPrompt)

	  if (key.name === 'home') return 'home'; // TODO create end() in prompt types (e.g. TextPrompt)

	  if (key.name === 'end') return 'end';
	  if (key.name === 'up') return 'up';
	  if (key.name === 'down') return 'down';
	  if (key.name === 'right') return 'right';
	  if (key.name === 'left') return 'left';
	  return false;
	};
	return action$1;
}

var strip$1;
var hasRequiredStrip$1;

function requireStrip$1 () {
	if (hasRequiredStrip$1) return strip$1;
	hasRequiredStrip$1 = 1;

	strip$1 = str => {
	  const pattern = ['[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)', '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))'].join('|');
	  const RGX = new RegExp(pattern, 'g');
	  return typeof str === 'string' ? str.replace(RGX, '') : str;
	};
	return strip$1;
}

var src;
var hasRequiredSrc;

function requireSrc () {
	if (hasRequiredSrc) return src;
	hasRequiredSrc = 1;

	const ESC = '\x1B';
	const CSI = `${ESC}[`;
	const beep = '\u0007';

	const cursor = {
	  to(x, y) {
	    if (!y) return `${CSI}${x + 1}G`;
	    return `${CSI}${y + 1};${x + 1}H`;
	  },
	  move(x, y) {
	    let ret = '';

	    if (x < 0) ret += `${CSI}${-x}D`;
	    else if (x > 0) ret += `${CSI}${x}C`;

	    if (y < 0) ret += `${CSI}${-y}A`;
	    else if (y > 0) ret += `${CSI}${y}B`;

	    return ret;
	  },
	  up: (count = 1) => `${CSI}${count}A`,
	  down: (count = 1) => `${CSI}${count}B`,
	  forward: (count = 1) => `${CSI}${count}C`,
	  backward: (count = 1) => `${CSI}${count}D`,
	  nextLine: (count = 1) => `${CSI}E`.repeat(count),
	  prevLine: (count = 1) => `${CSI}F`.repeat(count),
	  left: `${CSI}G`,
	  hide: `${CSI}?25l`,
	  show: `${CSI}?25h`,
	  save: `${ESC}7`,
	  restore: `${ESC}8`
	};

	const scroll = {
	  up: (count = 1) => `${CSI}S`.repeat(count),
	  down: (count = 1) => `${CSI}T`.repeat(count)
	};

	const erase = {
	  screen: `${CSI}2J`,
	  up: (count = 1) => `${CSI}1J`.repeat(count),
	  down: (count = 1) => `${CSI}J`.repeat(count),
	  line: `${CSI}2K`,
	  lineEnd: `${CSI}K`,
	  lineStart: `${CSI}1K`,
	  lines(count) {
	    let clear = '';
	    for (let i = 0; i < count; i++)
	      clear += this.line + (i < count - 1 ? cursor.up() : '');
	    if (count)
	      clear += cursor.left;
	    return clear;
	  }
	};

	src = { cursor, scroll, erase, beep };
	return src;
}

var clear$1;
var hasRequiredClear$1;

function requireClear$1 () {
	if (hasRequiredClear$1) return clear$1;
	hasRequiredClear$1 = 1;

	function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

	function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

	function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

	const strip = requireStrip$1();

	const _require = requireSrc(),
	      erase = _require.erase,
	      cursor = _require.cursor;

	const width = str => [...strip(str)].length;
	/**
	 * @param {string} prompt
	 * @param {number} perLine
	 */


	clear$1 = function (prompt, perLine) {
	  if (!perLine) return erase.line + cursor.to(0);
	  let rows = 0;
	  const lines = prompt.split(/\r?\n/);

	  var _iterator = _createForOfIteratorHelper(lines),
	      _step;

	  try {
	    for (_iterator.s(); !(_step = _iterator.n()).done;) {
	      let line = _step.value;
	      rows += 1 + Math.floor(Math.max(width(line) - 1, 0) / perLine);
	    }
	  } catch (err) {
	    _iterator.e(err);
	  } finally {
	    _iterator.f();
	  }

	  return erase.lines(rows);
	};
	return clear$1;
}

var figures_1$1;
var hasRequiredFigures$1;

function requireFigures$1 () {
	if (hasRequiredFigures$1) return figures_1$1;
	hasRequiredFigures$1 = 1;

	const main = {
	  arrowUp: '↑',
	  arrowDown: '↓',
	  arrowLeft: '←',
	  arrowRight: '→',
	  radioOn: '◉',
	  radioOff: '◯',
	  tick: '✔',
	  cross: '✖',
	  ellipsis: '…',
	  pointerSmall: '›',
	  line: '─',
	  pointer: '❯'
	};
	const win = {
	  arrowUp: main.arrowUp,
	  arrowDown: main.arrowDown,
	  arrowLeft: main.arrowLeft,
	  arrowRight: main.arrowRight,
	  radioOn: '(*)',
	  radioOff: '( )',
	  tick: '√',
	  cross: '×',
	  ellipsis: '...',
	  pointerSmall: '»',
	  line: '─',
	  pointer: '>'
	};
	const figures = process.platform === 'win32' ? win : main;
	figures_1$1 = figures;
	return figures_1$1;
}

var style$1;
var hasRequiredStyle$1;

function requireStyle$1 () {
	if (hasRequiredStyle$1) return style$1;
	hasRequiredStyle$1 = 1;

	const c = requireKleur();

	const figures = requireFigures$1(); // rendering user input.


	const styles = Object.freeze({
	  password: {
	    scale: 1,
	    render: input => '*'.repeat(input.length)
	  },
	  emoji: {
	    scale: 2,
	    render: input => '😃'.repeat(input.length)
	  },
	  invisible: {
	    scale: 0,
	    render: input => ''
	  },
	  default: {
	    scale: 1,
	    render: input => `${input}`
	  }
	});

	const render = type => styles[type] || styles.default; // icon to signalize a prompt.


	const symbols = Object.freeze({
	  aborted: c.red(figures.cross),
	  done: c.green(figures.tick),
	  exited: c.yellow(figures.cross),
	  default: c.cyan('?')
	});

	const symbol = (done, aborted, exited) => aborted ? symbols.aborted : exited ? symbols.exited : done ? symbols.done : symbols.default; // between the question and the user's input.


	const delimiter = completing => c.gray(completing ? figures.ellipsis : figures.pointerSmall);

	const item = (expandable, expanded) => c.gray(expandable ? expanded ? figures.pointerSmall : '+' : figures.line);

	style$1 = {
	  styles,
	  render,
	  symbols,
	  symbol,
	  delimiter,
	  item
	};
	return style$1;
}

var lines$1;
var hasRequiredLines$1;

function requireLines$1 () {
	if (hasRequiredLines$1) return lines$1;
	hasRequiredLines$1 = 1;

	const strip = requireStrip$1();
	/**
	 * @param {string} msg
	 * @param {number} perLine
	 */


	lines$1 = function (msg, perLine) {
	  let lines = String(strip(msg) || '').split(/\r?\n/);
	  if (!perLine) return lines.length;
	  return lines.map(l => Math.ceil(l.length / perLine)).reduce((a, b) => a + b);
	};
	return lines$1;
}

var wrap$1;
var hasRequiredWrap$1;

function requireWrap$1 () {
	if (hasRequiredWrap$1) return wrap$1;
	hasRequiredWrap$1 = 1;
	/**
	 * @param {string} msg The message to wrap
	 * @param {object} opts
	 * @param {number|string} [opts.margin] Left margin
	 * @param {number} opts.width Maximum characters per line including the margin
	 */

	wrap$1 = (msg, opts = {}) => {
	  const tab = Number.isSafeInteger(parseInt(opts.margin)) ? new Array(parseInt(opts.margin)).fill(' ').join('') : opts.margin || '';
	  const width = opts.width;
	  return (msg || '').split(/\r?\n/g).map(line => line.split(/\s+/g).reduce((arr, w) => {
	    if (w.length + tab.length >= width || arr[arr.length - 1].length + w.length + 1 < width) arr[arr.length - 1] += ` ${w}`;else arr.push(`${tab}${w}`);
	    return arr;
	  }, [tab]).join('\n')).join('\n');
	};
	return wrap$1;
}

var entriesToDisplay$1;
var hasRequiredEntriesToDisplay$1;

function requireEntriesToDisplay$1 () {
	if (hasRequiredEntriesToDisplay$1) return entriesToDisplay$1;
	hasRequiredEntriesToDisplay$1 = 1;
	/**
	 * Determine what entries should be displayed on the screen, based on the
	 * currently selected index and the maximum visible. Used in list-based
	 * prompts like `select` and `multiselect`.
	 *
	 * @param {number} cursor the currently selected entry
	 * @param {number} total the total entries available to display
	 * @param {number} [maxVisible] the number of entries that can be displayed
	 */

	entriesToDisplay$1 = (cursor, total, maxVisible) => {
	  maxVisible = maxVisible || total;
	  let startIndex = Math.min(total - maxVisible, cursor - Math.floor(maxVisible / 2));
	  if (startIndex < 0) startIndex = 0;
	  let endIndex = Math.min(startIndex + maxVisible, total);
	  return {
	    startIndex,
	    endIndex
	  };
	};
	return entriesToDisplay$1;
}

var util$1;
var hasRequiredUtil$1;

function requireUtil$1 () {
	if (hasRequiredUtil$1) return util$1;
	hasRequiredUtil$1 = 1;

	util$1 = {
	  action: requireAction$1(),
	  clear: requireClear$1(),
	  style: requireStyle$1(),
	  strip: requireStrip$1(),
	  figures: requireFigures$1(),
	  lines: requireLines$1(),
	  wrap: requireWrap$1(),
	  entriesToDisplay: requireEntriesToDisplay$1()
	};
	return util$1;
}

var prompt$2;
var hasRequiredPrompt$1;

function requirePrompt$1 () {
	if (hasRequiredPrompt$1) return prompt$2;
	hasRequiredPrompt$1 = 1;

	const readline = require$$0$2;

	const _require = requireUtil$1(),
	      action = _require.action;

	const EventEmitter = require$$2$1;

	const _require2 = requireSrc(),
	      beep = _require2.beep,
	      cursor = _require2.cursor;

	const color = requireKleur();
	/**
	 * Base prompt skeleton
	 * @param {Stream} [opts.stdin] The Readable stream to listen to
	 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
	 */


	class Prompt extends EventEmitter {
	  constructor(opts = {}) {
	    super();
	    this.firstRender = true;
	    this.in = opts.stdin || process.stdin;
	    this.out = opts.stdout || process.stdout;

	    this.onRender = (opts.onRender || (() => void 0)).bind(this);

	    const rl = readline.createInterface({
	      input: this.in,
	      escapeCodeTimeout: 50
	    });
	    readline.emitKeypressEvents(this.in, rl);
	    if (this.in.isTTY) this.in.setRawMode(true);
	    const isSelect = ['SelectPrompt', 'MultiselectPrompt'].indexOf(this.constructor.name) > -1;

	    const keypress = (str, key) => {
	      let a = action(key, isSelect);

	      if (a === false) {
	        this._ && this._(str, key);
	      } else if (typeof this[a] === 'function') {
	        this[a](key);
	      } else {
	        this.bell();
	      }
	    };

	    this.close = () => {
	      this.out.write(cursor.show);
	      this.in.removeListener('keypress', keypress);
	      if (this.in.isTTY) this.in.setRawMode(false);
	      rl.close();
	      this.emit(this.aborted ? 'abort' : this.exited ? 'exit' : 'submit', this.value);
	      this.closed = true;
	    };

	    this.in.on('keypress', keypress);
	  }

	  fire() {
	    this.emit('state', {
	      value: this.value,
	      aborted: !!this.aborted,
	      exited: !!this.exited
	    });
	  }

	  bell() {
	    this.out.write(beep);
	  }

	  render() {
	    this.onRender(color);
	    if (this.firstRender) this.firstRender = false;
	  }

	}

	prompt$2 = Prompt;
	return prompt$2;
}

var text$1;
var hasRequiredText$1;

function requireText$1 () {
	if (hasRequiredText$1) return text$1;
	hasRequiredText$1 = 1;

	function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

	function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

	const color = requireKleur();

	const Prompt = requirePrompt$1();

	const _require = requireSrc(),
	      erase = _require.erase,
	      cursor = _require.cursor;

	const _require2 = requireUtil$1(),
	      style = _require2.style,
	      clear = _require2.clear,
	      lines = _require2.lines,
	      figures = _require2.figures;
	/**
	 * TextPrompt Base Element
	 * @param {Object} opts Options
	 * @param {String} opts.message Message
	 * @param {String} [opts.style='default'] Render style
	 * @param {String} [opts.initial] Default value
	 * @param {Function} [opts.validate] Validate function
	 * @param {Stream} [opts.stdin] The Readable stream to listen to
	 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
	 * @param {String} [opts.error] The invalid error label
	 */


	class TextPrompt extends Prompt {
	  constructor(opts = {}) {
	    super(opts);
	    this.transform = style.render(opts.style);
	    this.scale = this.transform.scale;
	    this.msg = opts.message;
	    this.initial = opts.initial || ``;

	    this.validator = opts.validate || (() => true);

	    this.value = ``;
	    this.errorMsg = opts.error || `Please Enter A Valid Value`;
	    this.cursor = Number(!!this.initial);
	    this.cursorOffset = 0;
	    this.clear = clear(``, this.out.columns);
	    this.render();
	  }

	  set value(v) {
	    if (!v && this.initial) {
	      this.placeholder = true;
	      this.rendered = color.gray(this.transform.render(this.initial));
	    } else {
	      this.placeholder = false;
	      this.rendered = this.transform.render(v);
	    }

	    this._value = v;
	    this.fire();
	  }

	  get value() {
	    return this._value;
	  }

	  reset() {
	    this.value = ``;
	    this.cursor = Number(!!this.initial);
	    this.cursorOffset = 0;
	    this.fire();
	    this.render();
	  }

	  exit() {
	    this.abort();
	  }

	  abort() {
	    this.value = this.value || this.initial;
	    this.done = this.aborted = true;
	    this.error = false;
	    this.red = false;
	    this.fire();
	    this.render();
	    this.out.write('\n');
	    this.close();
	  }

	  validate() {
	    var _this = this;

	    return _asyncToGenerator(function* () {
	      let valid = yield _this.validator(_this.value);

	      if (typeof valid === `string`) {
	        _this.errorMsg = valid;
	        valid = false;
	      }

	      _this.error = !valid;
	    })();
	  }

	  submit() {
	    var _this2 = this;

	    return _asyncToGenerator(function* () {
	      _this2.value = _this2.value || _this2.initial;
	      _this2.cursorOffset = 0;
	      _this2.cursor = _this2.rendered.length;
	      yield _this2.validate();

	      if (_this2.error) {
	        _this2.red = true;

	        _this2.fire();

	        _this2.render();

	        return;
	      }

	      _this2.done = true;
	      _this2.aborted = false;

	      _this2.fire();

	      _this2.render();

	      _this2.out.write('\n');

	      _this2.close();
	    })();
	  }

	  next() {
	    if (!this.placeholder) return this.bell();
	    this.value = this.initial;
	    this.cursor = this.rendered.length;
	    this.fire();
	    this.render();
	  }

	  moveCursor(n) {
	    if (this.placeholder) return;
	    this.cursor = this.cursor + n;
	    this.cursorOffset += n;
	  }

	  _(c, key) {
	    let s1 = this.value.slice(0, this.cursor);
	    let s2 = this.value.slice(this.cursor);
	    this.value = `${s1}${c}${s2}`;
	    this.red = false;
	    this.cursor = this.placeholder ? 0 : s1.length + 1;
	    this.render();
	  }

	  delete() {
	    if (this.isCursorAtStart()) return this.bell();
	    let s1 = this.value.slice(0, this.cursor - 1);
	    let s2 = this.value.slice(this.cursor);
	    this.value = `${s1}${s2}`;
	    this.red = false;

	    if (this.isCursorAtStart()) {
	      this.cursorOffset = 0;
	    } else {
	      this.cursorOffset++;
	      this.moveCursor(-1);
	    }

	    this.render();
	  }

	  deleteForward() {
	    if (this.cursor * this.scale >= this.rendered.length || this.placeholder) return this.bell();
	    let s1 = this.value.slice(0, this.cursor);
	    let s2 = this.value.slice(this.cursor + 1);
	    this.value = `${s1}${s2}`;
	    this.red = false;

	    if (this.isCursorAtEnd()) {
	      this.cursorOffset = 0;
	    } else {
	      this.cursorOffset++;
	    }

	    this.render();
	  }

	  first() {
	    this.cursor = 0;
	    this.render();
	  }

	  last() {
	    this.cursor = this.value.length;
	    this.render();
	  }

	  left() {
	    if (this.cursor <= 0 || this.placeholder) return this.bell();
	    this.moveCursor(-1);
	    this.render();
	  }

	  right() {
	    if (this.cursor * this.scale >= this.rendered.length || this.placeholder) return this.bell();
	    this.moveCursor(1);
	    this.render();
	  }

	  isCursorAtStart() {
	    return this.cursor === 0 || this.placeholder && this.cursor === 1;
	  }

	  isCursorAtEnd() {
	    return this.cursor === this.rendered.length || this.placeholder && this.cursor === this.rendered.length + 1;
	  }

	  render() {
	    if (this.closed) return;

	    if (!this.firstRender) {
	      if (this.outputError) this.out.write(cursor.down(lines(this.outputError, this.out.columns) - 1) + clear(this.outputError, this.out.columns));
	      this.out.write(clear(this.outputText, this.out.columns));
	    }

	    super.render();
	    this.outputError = '';
	    this.outputText = [style.symbol(this.done, this.aborted), color.bold(this.msg), style.delimiter(this.done), this.red ? color.red(this.rendered) : this.rendered].join(` `);

	    if (this.error) {
	      this.outputError += this.errorMsg.split(`\n`).reduce((a, l, i) => a + `\n${i ? ' ' : figures.pointerSmall} ${color.red().italic(l)}`, ``);
	    }

	    this.out.write(erase.line + cursor.to(0) + this.outputText + cursor.save + this.outputError + cursor.restore + cursor.move(this.cursorOffset, 0));
	  }

	}

	text$1 = TextPrompt;
	return text$1;
}

var select$1;
var hasRequiredSelect$1;

function requireSelect$1 () {
	if (hasRequiredSelect$1) return select$1;
	hasRequiredSelect$1 = 1;

	const color = requireKleur();

	const Prompt = requirePrompt$1();

	const _require = requireUtil$1(),
	      style = _require.style,
	      clear = _require.clear,
	      figures = _require.figures,
	      wrap = _require.wrap,
	      entriesToDisplay = _require.entriesToDisplay;

	const _require2 = requireSrc(),
	      cursor = _require2.cursor;
	/**
	 * SelectPrompt Base Element
	 * @param {Object} opts Options
	 * @param {String} opts.message Message
	 * @param {Array} opts.choices Array of choice objects
	 * @param {String} [opts.hint] Hint to display
	 * @param {Number} [opts.initial] Index of default value
	 * @param {Stream} [opts.stdin] The Readable stream to listen to
	 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
	 * @param {Number} [opts.optionsPerPage=10] Max options to display at once
	 */


	class SelectPrompt extends Prompt {
	  constructor(opts = {}) {
	    super(opts);
	    this.msg = opts.message;
	    this.hint = opts.hint || '- Use arrow-keys. Return to submit.';
	    this.warn = opts.warn || '- This option is disabled';
	    this.cursor = opts.initial || 0;
	    this.choices = opts.choices.map((ch, idx) => {
	      if (typeof ch === 'string') ch = {
	        title: ch,
	        value: idx
	      };
	      return {
	        title: ch && (ch.title || ch.value || ch),
	        value: ch && (ch.value === undefined ? idx : ch.value),
	        description: ch && ch.description,
	        selected: ch && ch.selected,
	        disabled: ch && ch.disabled
	      };
	    });
	    this.optionsPerPage = opts.optionsPerPage || 10;
	    this.value = (this.choices[this.cursor] || {}).value;
	    this.clear = clear('', this.out.columns);
	    this.render();
	  }

	  moveCursor(n) {
	    this.cursor = n;
	    this.value = this.choices[n].value;
	    this.fire();
	  }

	  reset() {
	    this.moveCursor(0);
	    this.fire();
	    this.render();
	  }

	  exit() {
	    this.abort();
	  }

	  abort() {
	    this.done = this.aborted = true;
	    this.fire();
	    this.render();
	    this.out.write('\n');
	    this.close();
	  }

	  submit() {
	    if (!this.selection.disabled) {
	      this.done = true;
	      this.aborted = false;
	      this.fire();
	      this.render();
	      this.out.write('\n');
	      this.close();
	    } else this.bell();
	  }

	  first() {
	    this.moveCursor(0);
	    this.render();
	  }

	  last() {
	    this.moveCursor(this.choices.length - 1);
	    this.render();
	  }

	  up() {
	    if (this.cursor === 0) {
	      this.moveCursor(this.choices.length - 1);
	    } else {
	      this.moveCursor(this.cursor - 1);
	    }

	    this.render();
	  }

	  down() {
	    if (this.cursor === this.choices.length - 1) {
	      this.moveCursor(0);
	    } else {
	      this.moveCursor(this.cursor + 1);
	    }

	    this.render();
	  }

	  next() {
	    this.moveCursor((this.cursor + 1) % this.choices.length);
	    this.render();
	  }

	  _(c, key) {
	    if (c === ' ') return this.submit();
	  }

	  get selection() {
	    return this.choices[this.cursor];
	  }

	  render() {
	    if (this.closed) return;
	    if (this.firstRender) this.out.write(cursor.hide);else this.out.write(clear(this.outputText, this.out.columns));
	    super.render();

	    let _entriesToDisplay = entriesToDisplay(this.cursor, this.choices.length, this.optionsPerPage),
	        startIndex = _entriesToDisplay.startIndex,
	        endIndex = _entriesToDisplay.endIndex; // Print prompt


	    this.outputText = [style.symbol(this.done, this.aborted), color.bold(this.msg), style.delimiter(false), this.done ? this.selection.title : this.selection.disabled ? color.yellow(this.warn) : color.gray(this.hint)].join(' '); // Print choices

	    if (!this.done) {
	      this.outputText += '\n';

	      for (let i = startIndex; i < endIndex; i++) {
	        let title,
	            prefix,
	            desc = '',
	            v = this.choices[i]; // Determine whether to display "more choices" indicators

	        if (i === startIndex && startIndex > 0) {
	          prefix = figures.arrowUp;
	        } else if (i === endIndex - 1 && endIndex < this.choices.length) {
	          prefix = figures.arrowDown;
	        } else {
	          prefix = ' ';
	        }

	        if (v.disabled) {
	          title = this.cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
	          prefix = (this.cursor === i ? color.bold().gray(figures.pointer) + ' ' : '  ') + prefix;
	        } else {
	          title = this.cursor === i ? color.cyan().underline(v.title) : v.title;
	          prefix = (this.cursor === i ? color.cyan(figures.pointer) + ' ' : '  ') + prefix;

	          if (v.description && this.cursor === i) {
	            desc = ` - ${v.description}`;

	            if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) {
	              desc = '\n' + wrap(v.description, {
	                margin: 3,
	                width: this.out.columns
	              });
	            }
	          }
	        }

	        this.outputText += `${prefix} ${title}${color.gray(desc)}\n`;
	      }
	    }

	    this.out.write(this.outputText);
	  }

	}

	select$1 = SelectPrompt;
	return select$1;
}

var toggle$1;
var hasRequiredToggle$1;

function requireToggle$1 () {
	if (hasRequiredToggle$1) return toggle$1;
	hasRequiredToggle$1 = 1;

	const color = requireKleur();

	const Prompt = requirePrompt$1();

	const _require = requireUtil$1(),
	      style = _require.style,
	      clear = _require.clear;

	const _require2 = requireSrc(),
	      cursor = _require2.cursor,
	      erase = _require2.erase;
	/**
	 * TogglePrompt Base Element
	 * @param {Object} opts Options
	 * @param {String} opts.message Message
	 * @param {Boolean} [opts.initial=false] Default value
	 * @param {String} [opts.active='no'] Active label
	 * @param {String} [opts.inactive='off'] Inactive label
	 * @param {Stream} [opts.stdin] The Readable stream to listen to
	 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
	 */


	class TogglePrompt extends Prompt {
	  constructor(opts = {}) {
	    super(opts);
	    this.msg = opts.message;
	    this.value = !!opts.initial;
	    this.active = opts.active || 'on';
	    this.inactive = opts.inactive || 'off';
	    this.initialValue = this.value;
	    this.render();
	  }

	  reset() {
	    this.value = this.initialValue;
	    this.fire();
	    this.render();
	  }

	  exit() {
	    this.abort();
	  }

	  abort() {
	    this.done = this.aborted = true;
	    this.fire();
	    this.render();
	    this.out.write('\n');
	    this.close();
	  }

	  submit() {
	    this.done = true;
	    this.aborted = false;
	    this.fire();
	    this.render();
	    this.out.write('\n');
	    this.close();
	  }

	  deactivate() {
	    if (this.value === false) return this.bell();
	    this.value = false;
	    this.render();
	  }

	  activate() {
	    if (this.value === true) return this.bell();
	    this.value = true;
	    this.render();
	  }

	  delete() {
	    this.deactivate();
	  }

	  left() {
	    this.deactivate();
	  }

	  right() {
	    this.activate();
	  }

	  down() {
	    this.deactivate();
	  }

	  up() {
	    this.activate();
	  }

	  next() {
	    this.value = !this.value;
	    this.fire();
	    this.render();
	  }

	  _(c, key) {
	    if (c === ' ') {
	      this.value = !this.value;
	    } else if (c === '1') {
	      this.value = true;
	    } else if (c === '0') {
	      this.value = false;
	    } else return this.bell();

	    this.render();
	  }

	  render() {
	    if (this.closed) return;
	    if (this.firstRender) this.out.write(cursor.hide);else this.out.write(clear(this.outputText, this.out.columns));
	    super.render();
	    this.outputText = [style.symbol(this.done, this.aborted), color.bold(this.msg), style.delimiter(this.done), this.value ? this.inactive : color.cyan().underline(this.inactive), color.gray('/'), this.value ? color.cyan().underline(this.active) : this.active].join(' ');
	    this.out.write(erase.line + cursor.to(0) + this.outputText);
	  }

	}

	toggle$1 = TogglePrompt;
	return toggle$1;
}

var datepart$1;
var hasRequiredDatepart$1;

function requireDatepart$1 () {
	if (hasRequiredDatepart$1) return datepart$1;
	hasRequiredDatepart$1 = 1;

	class DatePart {
	  constructor({
	    token,
	    date,
	    parts,
	    locales
	  }) {
	    this.token = token;
	    this.date = date || new Date();
	    this.parts = parts || [this];
	    this.locales = locales || {};
	  }

	  up() {}

	  down() {}

	  next() {
	    const currentIdx = this.parts.indexOf(this);
	    return this.parts.find((part, idx) => idx > currentIdx && part instanceof DatePart);
	  }

	  setTo(val) {}

	  prev() {
	    let parts = [].concat(this.parts).reverse();
	    const currentIdx = parts.indexOf(this);
	    return parts.find((part, idx) => idx > currentIdx && part instanceof DatePart);
	  }

	  toString() {
	    return String(this.date);
	  }

	}

	datepart$1 = DatePart;
	return datepart$1;
}

var meridiem$1;
var hasRequiredMeridiem$1;

function requireMeridiem$1 () {
	if (hasRequiredMeridiem$1) return meridiem$1;
	hasRequiredMeridiem$1 = 1;

	const DatePart = requireDatepart$1();

	class Meridiem extends DatePart {
	  constructor(opts = {}) {
	    super(opts);
	  }

	  up() {
	    this.date.setHours((this.date.getHours() + 12) % 24);
	  }

	  down() {
	    this.up();
	  }

	  toString() {
	    let meridiem = this.date.getHours() > 12 ? 'pm' : 'am';
	    return /\A/.test(this.token) ? meridiem.toUpperCase() : meridiem;
	  }

	}

	meridiem$1 = Meridiem;
	return meridiem$1;
}

var day$1;
var hasRequiredDay$1;

function requireDay$1 () {
	if (hasRequiredDay$1) return day$1;
	hasRequiredDay$1 = 1;

	const DatePart = requireDatepart$1();

	const pos = n => {
	  n = n % 10;
	  return n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th';
	};

	class Day extends DatePart {
	  constructor(opts = {}) {
	    super(opts);
	  }

	  up() {
	    this.date.setDate(this.date.getDate() + 1);
	  }

	  down() {
	    this.date.setDate(this.date.getDate() - 1);
	  }

	  setTo(val) {
	    this.date.setDate(parseInt(val.substr(-2)));
	  }

	  toString() {
	    let date = this.date.getDate();
	    let day = this.date.getDay();
	    return this.token === 'DD' ? String(date).padStart(2, '0') : this.token === 'Do' ? date + pos(date) : this.token === 'd' ? day + 1 : this.token === 'ddd' ? this.locales.weekdaysShort[day] : this.token === 'dddd' ? this.locales.weekdays[day] : date;
	  }

	}

	day$1 = Day;
	return day$1;
}

var hours$1;
var hasRequiredHours$1;

function requireHours$1 () {
	if (hasRequiredHours$1) return hours$1;
	hasRequiredHours$1 = 1;

	const DatePart = requireDatepart$1();

	class Hours extends DatePart {
	  constructor(opts = {}) {
	    super(opts);
	  }

	  up() {
	    this.date.setHours(this.date.getHours() + 1);
	  }

	  down() {
	    this.date.setHours(this.date.getHours() - 1);
	  }

	  setTo(val) {
	    this.date.setHours(parseInt(val.substr(-2)));
	  }

	  toString() {
	    let hours = this.date.getHours();
	    if (/h/.test(this.token)) hours = hours % 12 || 12;
	    return this.token.length > 1 ? String(hours).padStart(2, '0') : hours;
	  }

	}

	hours$1 = Hours;
	return hours$1;
}

var milliseconds$1;
var hasRequiredMilliseconds$1;

function requireMilliseconds$1 () {
	if (hasRequiredMilliseconds$1) return milliseconds$1;
	hasRequiredMilliseconds$1 = 1;

	const DatePart = requireDatepart$1();

	class Milliseconds extends DatePart {
	  constructor(opts = {}) {
	    super(opts);
	  }

	  up() {
	    this.date.setMilliseconds(this.date.getMilliseconds() + 1);
	  }

	  down() {
	    this.date.setMilliseconds(this.date.getMilliseconds() - 1);
	  }

	  setTo(val) {
	    this.date.setMilliseconds(parseInt(val.substr(-this.token.length)));
	  }

	  toString() {
	    return String(this.date.getMilliseconds()).padStart(4, '0').substr(0, this.token.length);
	  }

	}

	milliseconds$1 = Milliseconds;
	return milliseconds$1;
}

var minutes$1;
var hasRequiredMinutes$1;

function requireMinutes$1 () {
	if (hasRequiredMinutes$1) return minutes$1;
	hasRequiredMinutes$1 = 1;

	const DatePart = requireDatepart$1();

	class Minutes extends DatePart {
	  constructor(opts = {}) {
	    super(opts);
	  }

	  up() {
	    this.date.setMinutes(this.date.getMinutes() + 1);
	  }

	  down() {
	    this.date.setMinutes(this.date.getMinutes() - 1);
	  }

	  setTo(val) {
	    this.date.setMinutes(parseInt(val.substr(-2)));
	  }

	  toString() {
	    let m = this.date.getMinutes();
	    return this.token.length > 1 ? String(m).padStart(2, '0') : m;
	  }

	}

	minutes$1 = Minutes;
	return minutes$1;
}

var month$1;
var hasRequiredMonth$1;

function requireMonth$1 () {
	if (hasRequiredMonth$1) return month$1;
	hasRequiredMonth$1 = 1;

	const DatePart = requireDatepart$1();

	class Month extends DatePart {
	  constructor(opts = {}) {
	    super(opts);
	  }

	  up() {
	    this.date.setMonth(this.date.getMonth() + 1);
	  }

	  down() {
	    this.date.setMonth(this.date.getMonth() - 1);
	  }

	  setTo(val) {
	    val = parseInt(val.substr(-2)) - 1;
	    this.date.setMonth(val < 0 ? 0 : val);
	  }

	  toString() {
	    let month = this.date.getMonth();
	    let tl = this.token.length;
	    return tl === 2 ? String(month + 1).padStart(2, '0') : tl === 3 ? this.locales.monthsShort[month] : tl === 4 ? this.locales.months[month] : String(month + 1);
	  }

	}

	month$1 = Month;
	return month$1;
}

var seconds$1;
var hasRequiredSeconds$1;

function requireSeconds$1 () {
	if (hasRequiredSeconds$1) return seconds$1;
	hasRequiredSeconds$1 = 1;

	const DatePart = requireDatepart$1();

	class Seconds extends DatePart {
	  constructor(opts = {}) {
	    super(opts);
	  }

	  up() {
	    this.date.setSeconds(this.date.getSeconds() + 1);
	  }

	  down() {
	    this.date.setSeconds(this.date.getSeconds() - 1);
	  }

	  setTo(val) {
	    this.date.setSeconds(parseInt(val.substr(-2)));
	  }

	  toString() {
	    let s = this.date.getSeconds();
	    return this.token.length > 1 ? String(s).padStart(2, '0') : s;
	  }

	}

	seconds$1 = Seconds;
	return seconds$1;
}

var year$1;
var hasRequiredYear$1;

function requireYear$1 () {
	if (hasRequiredYear$1) return year$1;
	hasRequiredYear$1 = 1;

	const DatePart = requireDatepart$1();

	class Year extends DatePart {
	  constructor(opts = {}) {
	    super(opts);
	  }

	  up() {
	    this.date.setFullYear(this.date.getFullYear() + 1);
	  }

	  down() {
	    this.date.setFullYear(this.date.getFullYear() - 1);
	  }

	  setTo(val) {
	    this.date.setFullYear(val.substr(-4));
	  }

	  toString() {
	    let year = String(this.date.getFullYear()).padStart(4, '0');
	    return this.token.length === 2 ? year.substr(-2) : year;
	  }

	}

	year$1 = Year;
	return year$1;
}

var dateparts$1;
var hasRequiredDateparts$1;

function requireDateparts$1 () {
	if (hasRequiredDateparts$1) return dateparts$1;
	hasRequiredDateparts$1 = 1;

	dateparts$1 = {
	  DatePart: requireDatepart$1(),
	  Meridiem: requireMeridiem$1(),
	  Day: requireDay$1(),
	  Hours: requireHours$1(),
	  Milliseconds: requireMilliseconds$1(),
	  Minutes: requireMinutes$1(),
	  Month: requireMonth$1(),
	  Seconds: requireSeconds$1(),
	  Year: requireYear$1()
	};
	return dateparts$1;
}

var date$1;
var hasRequiredDate$1;

function requireDate$1 () {
	if (hasRequiredDate$1) return date$1;
	hasRequiredDate$1 = 1;

	function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

	function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

	const color = requireKleur();

	const Prompt = requirePrompt$1();

	const _require = requireUtil$1(),
	      style = _require.style,
	      clear = _require.clear,
	      figures = _require.figures;

	const _require2 = requireSrc(),
	      erase = _require2.erase,
	      cursor = _require2.cursor;

	const _require3 = requireDateparts$1(),
	      DatePart = _require3.DatePart,
	      Meridiem = _require3.Meridiem,
	      Day = _require3.Day,
	      Hours = _require3.Hours,
	      Milliseconds = _require3.Milliseconds,
	      Minutes = _require3.Minutes,
	      Month = _require3.Month,
	      Seconds = _require3.Seconds,
	      Year = _require3.Year;

	const regex = /\\(.)|"((?:\\["\\]|[^"])+)"|(D[Do]?|d{3,4}|d)|(M{1,4})|(YY(?:YY)?)|([aA])|([Hh]{1,2})|(m{1,2})|(s{1,2})|(S{1,4})|./g;
	const regexGroups = {
	  1: ({
	    token
	  }) => token.replace(/\\(.)/g, '$1'),
	  2: opts => new Day(opts),
	  // Day // TODO
	  3: opts => new Month(opts),
	  // Month
	  4: opts => new Year(opts),
	  // Year
	  5: opts => new Meridiem(opts),
	  // AM/PM // TODO (special)
	  6: opts => new Hours(opts),
	  // Hours
	  7: opts => new Minutes(opts),
	  // Minutes
	  8: opts => new Seconds(opts),
	  // Seconds
	  9: opts => new Milliseconds(opts) // Fractional seconds

	};
	const dfltLocales = {
	  months: 'January,February,March,April,May,June,July,August,September,October,November,December'.split(','),
	  monthsShort: 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec'.split(','),
	  weekdays: 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'.split(','),
	  weekdaysShort: 'Sun,Mon,Tue,Wed,Thu,Fri,Sat'.split(',')
	};
	/**
	 * DatePrompt Base Element
	 * @param {Object} opts Options
	 * @param {String} opts.message Message
	 * @param {Number} [opts.initial] Index of default value
	 * @param {String} [opts.mask] The format mask
	 * @param {object} [opts.locales] The date locales
	 * @param {String} [opts.error] The error message shown on invalid value
	 * @param {Function} [opts.validate] Function to validate the submitted value
	 * @param {Stream} [opts.stdin] The Readable stream to listen to
	 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
	 */

	class DatePrompt extends Prompt {
	  constructor(opts = {}) {
	    super(opts);
	    this.msg = opts.message;
	    this.cursor = 0;
	    this.typed = '';
	    this.locales = Object.assign(dfltLocales, opts.locales);
	    this._date = opts.initial || new Date();
	    this.errorMsg = opts.error || 'Please Enter A Valid Value';

	    this.validator = opts.validate || (() => true);

	    this.mask = opts.mask || 'YYYY-MM-DD HH:mm:ss';
	    this.clear = clear('', this.out.columns);
	    this.render();
	  }

	  get value() {
	    return this.date;
	  }

	  get date() {
	    return this._date;
	  }

	  set date(date) {
	    if (date) this._date.setTime(date.getTime());
	  }

	  set mask(mask) {
	    let result;
	    this.parts = [];

	    while (result = regex.exec(mask)) {
	      let match = result.shift();
	      let idx = result.findIndex(gr => gr != null);
	      this.parts.push(idx in regexGroups ? regexGroups[idx]({
	        token: result[idx] || match,
	        date: this.date,
	        parts: this.parts,
	        locales: this.locales
	      }) : result[idx] || match);
	    }

	    let parts = this.parts.reduce((arr, i) => {
	      if (typeof i === 'string' && typeof arr[arr.length - 1] === 'string') arr[arr.length - 1] += i;else arr.push(i);
	      return arr;
	    }, []);
	    this.parts.splice(0);
	    this.parts.push(...parts);
	    this.reset();
	  }

	  moveCursor(n) {
	    this.typed = '';
	    this.cursor = n;
	    this.fire();
	  }

	  reset() {
	    this.moveCursor(this.parts.findIndex(p => p instanceof DatePart));
	    this.fire();
	    this.render();
	  }

	  exit() {
	    this.abort();
	  }

	  abort() {
	    this.done = this.aborted = true;
	    this.error = false;
	    this.fire();
	    this.render();
	    this.out.write('\n');
	    this.close();
	  }

	  validate() {
	    var _this = this;

	    return _asyncToGenerator(function* () {
	      let valid = yield _this.validator(_this.value);

	      if (typeof valid === 'string') {
	        _this.errorMsg = valid;
	        valid = false;
	      }

	      _this.error = !valid;
	    })();
	  }

	  submit() {
	    var _this2 = this;

	    return _asyncToGenerator(function* () {
	      yield _this2.validate();

	      if (_this2.error) {
	        _this2.color = 'red';

	        _this2.fire();

	        _this2.render();

	        return;
	      }

	      _this2.done = true;
	      _this2.aborted = false;

	      _this2.fire();

	      _this2.render();

	      _this2.out.write('\n');

	      _this2.close();
	    })();
	  }

	  up() {
	    this.typed = '';
	    this.parts[this.cursor].up();
	    this.render();
	  }

	  down() {
	    this.typed = '';
	    this.parts[this.cursor].down();
	    this.render();
	  }

	  left() {
	    let prev = this.parts[this.cursor].prev();
	    if (prev == null) return this.bell();
	    this.moveCursor(this.parts.indexOf(prev));
	    this.render();
	  }

	  right() {
	    let next = this.parts[this.cursor].next();
	    if (next == null) return this.bell();
	    this.moveCursor(this.parts.indexOf(next));
	    this.render();
	  }

	  next() {
	    let next = this.parts[this.cursor].next();
	    this.moveCursor(next ? this.parts.indexOf(next) : this.parts.findIndex(part => part instanceof DatePart));
	    this.render();
	  }

	  _(c) {
	    if (/\d/.test(c)) {
	      this.typed += c;
	      this.parts[this.cursor].setTo(this.typed);
	      this.render();
	    }
	  }

	  render() {
	    if (this.closed) return;
	    if (this.firstRender) this.out.write(cursor.hide);else this.out.write(clear(this.outputText, this.out.columns));
	    super.render(); // Print prompt

	    this.outputText = [style.symbol(this.done, this.aborted), color.bold(this.msg), style.delimiter(false), this.parts.reduce((arr, p, idx) => arr.concat(idx === this.cursor && !this.done ? color.cyan().underline(p.toString()) : p), []).join('')].join(' '); // Print error

	    if (this.error) {
	      this.outputText += this.errorMsg.split('\n').reduce((a, l, i) => a + `\n${i ? ` ` : figures.pointerSmall} ${color.red().italic(l)}`, ``);
	    }

	    this.out.write(erase.line + cursor.to(0) + this.outputText);
	  }

	}

	date$1 = DatePrompt;
	return date$1;
}

var number$1;
var hasRequiredNumber$1;

function requireNumber$1 () {
	if (hasRequiredNumber$1) return number$1;
	hasRequiredNumber$1 = 1;

	function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

	function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

	const color = requireKleur();

	const Prompt = requirePrompt$1();

	const _require = requireSrc(),
	      cursor = _require.cursor,
	      erase = _require.erase;

	const _require2 = requireUtil$1(),
	      style = _require2.style,
	      figures = _require2.figures,
	      clear = _require2.clear,
	      lines = _require2.lines;

	const isNumber = /[0-9]/;

	const isDef = any => any !== undefined;

	const round = (number, precision) => {
	  let factor = Math.pow(10, precision);
	  return Math.round(number * factor) / factor;
	};
	/**
	 * NumberPrompt Base Element
	 * @param {Object} opts Options
	 * @param {String} opts.message Message
	 * @param {String} [opts.style='default'] Render style
	 * @param {Number} [opts.initial] Default value
	 * @param {Number} [opts.max=+Infinity] Max value
	 * @param {Number} [opts.min=-Infinity] Min value
	 * @param {Boolean} [opts.float=false] Parse input as floats
	 * @param {Number} [opts.round=2] Round floats to x decimals
	 * @param {Number} [opts.increment=1] Number to increment by when using arrow-keys
	 * @param {Function} [opts.validate] Validate function
	 * @param {Stream} [opts.stdin] The Readable stream to listen to
	 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
	 * @param {String} [opts.error] The invalid error label
	 */


	class NumberPrompt extends Prompt {
	  constructor(opts = {}) {
	    super(opts);
	    this.transform = style.render(opts.style);
	    this.msg = opts.message;
	    this.initial = isDef(opts.initial) ? opts.initial : '';
	    this.float = !!opts.float;
	    this.round = opts.round || 2;
	    this.inc = opts.increment || 1;
	    this.min = isDef(opts.min) ? opts.min : -Infinity;
	    this.max = isDef(opts.max) ? opts.max : Infinity;
	    this.errorMsg = opts.error || `Please Enter A Valid Value`;

	    this.validator = opts.validate || (() => true);

	    this.color = `cyan`;
	    this.value = ``;
	    this.typed = ``;
	    this.lastHit = 0;
	    this.render();
	  }

	  set value(v) {
	    if (!v && v !== 0) {
	      this.placeholder = true;
	      this.rendered = color.gray(this.transform.render(`${this.initial}`));
	      this._value = ``;
	    } else {
	      this.placeholder = false;
	      this.rendered = this.transform.render(`${round(v, this.round)}`);
	      this._value = round(v, this.round);
	    }

	    this.fire();
	  }

	  get value() {
	    return this._value;
	  }

	  parse(x) {
	    return this.float ? parseFloat(x) : parseInt(x);
	  }

	  valid(c) {
	    return c === `-` || c === `.` && this.float || isNumber.test(c);
	  }

	  reset() {
	    this.typed = ``;
	    this.value = ``;
	    this.fire();
	    this.render();
	  }

	  exit() {
	    this.abort();
	  }

	  abort() {
	    let x = this.value;
	    this.value = x !== `` ? x : this.initial;
	    this.done = this.aborted = true;
	    this.error = false;
	    this.fire();
	    this.render();
	    this.out.write(`\n`);
	    this.close();
	  }

	  validate() {
	    var _this = this;

	    return _asyncToGenerator(function* () {
	      let valid = yield _this.validator(_this.value);

	      if (typeof valid === `string`) {
	        _this.errorMsg = valid;
	        valid = false;
	      }

	      _this.error = !valid;
	    })();
	  }

	  submit() {
	    var _this2 = this;

	    return _asyncToGenerator(function* () {
	      yield _this2.validate();

	      if (_this2.error) {
	        _this2.color = `red`;

	        _this2.fire();

	        _this2.render();

	        return;
	      }

	      let x = _this2.value;
	      _this2.value = x !== `` ? x : _this2.initial;
	      _this2.done = true;
	      _this2.aborted = false;
	      _this2.error = false;

	      _this2.fire();

	      _this2.render();

	      _this2.out.write(`\n`);

	      _this2.close();
	    })();
	  }

	  up() {
	    this.typed = ``;

	    if (this.value === '') {
	      this.value = this.min - this.inc;
	    }

	    if (this.value >= this.max) return this.bell();
	    this.value += this.inc;
	    this.color = `cyan`;
	    this.fire();
	    this.render();
	  }

	  down() {
	    this.typed = ``;

	    if (this.value === '') {
	      this.value = this.min + this.inc;
	    }

	    if (this.value <= this.min) return this.bell();
	    this.value -= this.inc;
	    this.color = `cyan`;
	    this.fire();
	    this.render();
	  }

	  delete() {
	    let val = this.value.toString();
	    if (val.length === 0) return this.bell();
	    this.value = this.parse(val = val.slice(0, -1)) || ``;

	    if (this.value !== '' && this.value < this.min) {
	      this.value = this.min;
	    }

	    this.color = `cyan`;
	    this.fire();
	    this.render();
	  }

	  next() {
	    this.value = this.initial;
	    this.fire();
	    this.render();
	  }

	  _(c, key) {
	    if (!this.valid(c)) return this.bell();
	    const now = Date.now();
	    if (now - this.lastHit > 1000) this.typed = ``; // 1s elapsed

	    this.typed += c;
	    this.lastHit = now;
	    this.color = `cyan`;
	    if (c === `.`) return this.fire();
	    this.value = Math.min(this.parse(this.typed), this.max);
	    if (this.value > this.max) this.value = this.max;
	    if (this.value < this.min) this.value = this.min;
	    this.fire();
	    this.render();
	  }

	  render() {
	    if (this.closed) return;

	    if (!this.firstRender) {
	      if (this.outputError) this.out.write(cursor.down(lines(this.outputError, this.out.columns) - 1) + clear(this.outputError, this.out.columns));
	      this.out.write(clear(this.outputText, this.out.columns));
	    }

	    super.render();
	    this.outputError = ''; // Print prompt

	    this.outputText = [style.symbol(this.done, this.aborted), color.bold(this.msg), style.delimiter(this.done), !this.done || !this.done && !this.placeholder ? color[this.color]().underline(this.rendered) : this.rendered].join(` `); // Print error

	    if (this.error) {
	      this.outputError += this.errorMsg.split(`\n`).reduce((a, l, i) => a + `\n${i ? ` ` : figures.pointerSmall} ${color.red().italic(l)}`, ``);
	    }

	    this.out.write(erase.line + cursor.to(0) + this.outputText + cursor.save + this.outputError + cursor.restore);
	  }

	}

	number$1 = NumberPrompt;
	return number$1;
}

var multiselect$1;
var hasRequiredMultiselect$1;

function requireMultiselect$1 () {
	if (hasRequiredMultiselect$1) return multiselect$1;
	hasRequiredMultiselect$1 = 1;

	const color = requireKleur();

	const _require = requireSrc(),
	      cursor = _require.cursor;

	const Prompt = requirePrompt$1();

	const _require2 = requireUtil$1(),
	      clear = _require2.clear,
	      figures = _require2.figures,
	      style = _require2.style,
	      wrap = _require2.wrap,
	      entriesToDisplay = _require2.entriesToDisplay;
	/**
	 * MultiselectPrompt Base Element
	 * @param {Object} opts Options
	 * @param {String} opts.message Message
	 * @param {Array} opts.choices Array of choice objects
	 * @param {String} [opts.hint] Hint to display
	 * @param {String} [opts.warn] Hint shown for disabled choices
	 * @param {Number} [opts.max] Max choices
	 * @param {Number} [opts.cursor=0] Cursor start position
	 * @param {Number} [opts.optionsPerPage=10] Max options to display at once
	 * @param {Stream} [opts.stdin] The Readable stream to listen to
	 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
	 */


	class MultiselectPrompt extends Prompt {
	  constructor(opts = {}) {
	    super(opts);
	    this.msg = opts.message;
	    this.cursor = opts.cursor || 0;
	    this.scrollIndex = opts.cursor || 0;
	    this.hint = opts.hint || '';
	    this.warn = opts.warn || '- This option is disabled -';
	    this.minSelected = opts.min;
	    this.showMinError = false;
	    this.maxChoices = opts.max;
	    this.instructions = opts.instructions;
	    this.optionsPerPage = opts.optionsPerPage || 10;
	    this.value = opts.choices.map((ch, idx) => {
	      if (typeof ch === 'string') ch = {
	        title: ch,
	        value: idx
	      };
	      return {
	        title: ch && (ch.title || ch.value || ch),
	        description: ch && ch.description,
	        value: ch && (ch.value === undefined ? idx : ch.value),
	        selected: ch && ch.selected,
	        disabled: ch && ch.disabled
	      };
	    });
	    this.clear = clear('', this.out.columns);

	    if (!opts.overrideRender) {
	      this.render();
	    }
	  }

	  reset() {
	    this.value.map(v => !v.selected);
	    this.cursor = 0;
	    this.fire();
	    this.render();
	  }

	  selected() {
	    return this.value.filter(v => v.selected);
	  }

	  exit() {
	    this.abort();
	  }

	  abort() {
	    this.done = this.aborted = true;
	    this.fire();
	    this.render();
	    this.out.write('\n');
	    this.close();
	  }

	  submit() {
	    const selected = this.value.filter(e => e.selected);

	    if (this.minSelected && selected.length < this.minSelected) {
	      this.showMinError = true;
	      this.render();
	    } else {
	      this.done = true;
	      this.aborted = false;
	      this.fire();
	      this.render();
	      this.out.write('\n');
	      this.close();
	    }
	  }

	  first() {
	    this.cursor = 0;
	    this.render();
	  }

	  last() {
	    this.cursor = this.value.length - 1;
	    this.render();
	  }

	  next() {
	    this.cursor = (this.cursor + 1) % this.value.length;
	    this.render();
	  }

	  up() {
	    if (this.cursor === 0) {
	      this.cursor = this.value.length - 1;
	    } else {
	      this.cursor--;
	    }

	    this.render();
	  }

	  down() {
	    if (this.cursor === this.value.length - 1) {
	      this.cursor = 0;
	    } else {
	      this.cursor++;
	    }

	    this.render();
	  }

	  left() {
	    this.value[this.cursor].selected = false;
	    this.render();
	  }

	  right() {
	    if (this.value.filter(e => e.selected).length >= this.maxChoices) return this.bell();
	    this.value[this.cursor].selected = true;
	    this.render();
	  }

	  handleSpaceToggle() {
	    const v = this.value[this.cursor];

	    if (v.selected) {
	      v.selected = false;
	      this.render();
	    } else if (v.disabled || this.value.filter(e => e.selected).length >= this.maxChoices) {
	      return this.bell();
	    } else {
	      v.selected = true;
	      this.render();
	    }
	  }

	  toggleAll() {
	    if (this.maxChoices !== undefined || this.value[this.cursor].disabled) {
	      return this.bell();
	    }

	    const newSelected = !this.value[this.cursor].selected;
	    this.value.filter(v => !v.disabled).forEach(v => v.selected = newSelected);
	    this.render();
	  }

	  _(c, key) {
	    if (c === ' ') {
	      this.handleSpaceToggle();
	    } else if (c === 'a') {
	      this.toggleAll();
	    } else {
	      return this.bell();
	    }
	  }

	  renderInstructions() {
	    if (this.instructions === undefined || this.instructions) {
	      if (typeof this.instructions === 'string') {
	        return this.instructions;
	      }

	      return '\nInstructions:\n' + `    ${figures.arrowUp}/${figures.arrowDown}: Highlight option\n` + `    ${figures.arrowLeft}/${figures.arrowRight}/[space]: Toggle selection\n` + (this.maxChoices === undefined ? `    a: Toggle all\n` : '') + `    enter/return: Complete answer`;
	    }

	    return '';
	  }

	  renderOption(cursor, v, i, arrowIndicator) {
	    const prefix = (v.selected ? color.green(figures.radioOn) : figures.radioOff) + ' ' + arrowIndicator + ' ';
	    let title, desc;

	    if (v.disabled) {
	      title = cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
	    } else {
	      title = cursor === i ? color.cyan().underline(v.title) : v.title;

	      if (cursor === i && v.description) {
	        desc = ` - ${v.description}`;

	        if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) {
	          desc = '\n' + wrap(v.description, {
	            margin: prefix.length,
	            width: this.out.columns
	          });
	        }
	      }
	    }

	    return prefix + title + color.gray(desc || '');
	  } // shared with autocompleteMultiselect


	  paginateOptions(options) {
	    if (options.length === 0) {
	      return color.red('No matches for this query.');
	    }

	    let _entriesToDisplay = entriesToDisplay(this.cursor, options.length, this.optionsPerPage),
	        startIndex = _entriesToDisplay.startIndex,
	        endIndex = _entriesToDisplay.endIndex;

	    let prefix,
	        styledOptions = [];

	    for (let i = startIndex; i < endIndex; i++) {
	      if (i === startIndex && startIndex > 0) {
	        prefix = figures.arrowUp;
	      } else if (i === endIndex - 1 && endIndex < options.length) {
	        prefix = figures.arrowDown;
	      } else {
	        prefix = ' ';
	      }

	      styledOptions.push(this.renderOption(this.cursor, options[i], i, prefix));
	    }

	    return '\n' + styledOptions.join('\n');
	  } // shared with autocomleteMultiselect


	  renderOptions(options) {
	    if (!this.done) {
	      return this.paginateOptions(options);
	    }

	    return '';
	  }

	  renderDoneOrInstructions() {
	    if (this.done) {
	      return this.value.filter(e => e.selected).map(v => v.title).join(', ');
	    }

	    const output = [color.gray(this.hint), this.renderInstructions()];

	    if (this.value[this.cursor].disabled) {
	      output.push(color.yellow(this.warn));
	    }

	    return output.join(' ');
	  }

	  render() {
	    if (this.closed) return;
	    if (this.firstRender) this.out.write(cursor.hide);
	    super.render(); // print prompt

	    let prompt = [style.symbol(this.done, this.aborted), color.bold(this.msg), style.delimiter(false), this.renderDoneOrInstructions()].join(' ');

	    if (this.showMinError) {
	      prompt += color.red(`You must select a minimum of ${this.minSelected} choices.`);
	      this.showMinError = false;
	    }

	    prompt += this.renderOptions(this.value);
	    this.out.write(this.clear + prompt);
	    this.clear = clear(prompt, this.out.columns);
	  }

	}

	multiselect$1 = MultiselectPrompt;
	return multiselect$1;
}

var autocomplete$1;
var hasRequiredAutocomplete$1;

function requireAutocomplete$1 () {
	if (hasRequiredAutocomplete$1) return autocomplete$1;
	hasRequiredAutocomplete$1 = 1;

	function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

	function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

	const color = requireKleur();

	const Prompt = requirePrompt$1();

	const _require = requireSrc(),
	      erase = _require.erase,
	      cursor = _require.cursor;

	const _require2 = requireUtil$1(),
	      style = _require2.style,
	      clear = _require2.clear,
	      figures = _require2.figures,
	      wrap = _require2.wrap,
	      entriesToDisplay = _require2.entriesToDisplay;

	const getVal = (arr, i) => arr[i] && (arr[i].value || arr[i].title || arr[i]);

	const getTitle = (arr, i) => arr[i] && (arr[i].title || arr[i].value || arr[i]);

	const getIndex = (arr, valOrTitle) => {
	  const index = arr.findIndex(el => el.value === valOrTitle || el.title === valOrTitle);
	  return index > -1 ? index : undefined;
	};
	/**
	 * TextPrompt Base Element
	 * @param {Object} opts Options
	 * @param {String} opts.message Message
	 * @param {Array} opts.choices Array of auto-complete choices objects
	 * @param {Function} [opts.suggest] Filter function. Defaults to sort by title
	 * @param {Number} [opts.limit=10] Max number of results to show
	 * @param {Number} [opts.cursor=0] Cursor start position
	 * @param {String} [opts.style='default'] Render style
	 * @param {String} [opts.fallback] Fallback message - initial to default value
	 * @param {String} [opts.initial] Index of the default value
	 * @param {Boolean} [opts.clearFirst] The first ESCAPE keypress will clear the input
	 * @param {Stream} [opts.stdin] The Readable stream to listen to
	 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
	 * @param {String} [opts.noMatches] The no matches found label
	 */


	class AutocompletePrompt extends Prompt {
	  constructor(opts = {}) {
	    super(opts);
	    this.msg = opts.message;
	    this.suggest = opts.suggest;
	    this.choices = opts.choices;
	    this.initial = typeof opts.initial === 'number' ? opts.initial : getIndex(opts.choices, opts.initial);
	    this.select = this.initial || opts.cursor || 0;
	    this.i18n = {
	      noMatches: opts.noMatches || 'no matches found'
	    };
	    this.fallback = opts.fallback || this.initial;
	    this.clearFirst = opts.clearFirst || false;
	    this.suggestions = [];
	    this.input = '';
	    this.limit = opts.limit || 10;
	    this.cursor = 0;
	    this.transform = style.render(opts.style);
	    this.scale = this.transform.scale;
	    this.render = this.render.bind(this);
	    this.complete = this.complete.bind(this);
	    this.clear = clear('', this.out.columns);
	    this.complete(this.render);
	    this.render();
	  }

	  set fallback(fb) {
	    this._fb = Number.isSafeInteger(parseInt(fb)) ? parseInt(fb) : fb;
	  }

	  get fallback() {
	    let choice;
	    if (typeof this._fb === 'number') choice = this.choices[this._fb];else if (typeof this._fb === 'string') choice = {
	      title: this._fb
	    };
	    return choice || this._fb || {
	      title: this.i18n.noMatches
	    };
	  }

	  moveSelect(i) {
	    this.select = i;
	    if (this.suggestions.length > 0) this.value = getVal(this.suggestions, i);else this.value = this.fallback.value;
	    this.fire();
	  }

	  complete(cb) {
	    var _this = this;

	    return _asyncToGenerator(function* () {
	      const p = _this.completing = _this.suggest(_this.input, _this.choices);

	      const suggestions = yield p;
	      if (_this.completing !== p) return;
	      _this.suggestions = suggestions.map((s, i, arr) => ({
	        title: getTitle(arr, i),
	        value: getVal(arr, i),
	        description: s.description
	      }));
	      _this.completing = false;
	      const l = Math.max(suggestions.length - 1, 0);

	      _this.moveSelect(Math.min(l, _this.select));

	      cb && cb();
	    })();
	  }

	  reset() {
	    this.input = '';
	    this.complete(() => {
	      this.moveSelect(this.initial !== void 0 ? this.initial : 0);
	      this.render();
	    });
	    this.render();
	  }

	  exit() {
	    if (this.clearFirst && this.input.length > 0) {
	      this.reset();
	    } else {
	      this.done = this.exited = true;
	      this.aborted = false;
	      this.fire();
	      this.render();
	      this.out.write('\n');
	      this.close();
	    }
	  }

	  abort() {
	    this.done = this.aborted = true;
	    this.exited = false;
	    this.fire();
	    this.render();
	    this.out.write('\n');
	    this.close();
	  }

	  submit() {
	    this.done = true;
	    this.aborted = this.exited = false;
	    this.fire();
	    this.render();
	    this.out.write('\n');
	    this.close();
	  }

	  _(c, key) {
	    let s1 = this.input.slice(0, this.cursor);
	    let s2 = this.input.slice(this.cursor);
	    this.input = `${s1}${c}${s2}`;
	    this.cursor = s1.length + 1;
	    this.complete(this.render);
	    this.render();
	  }

	  delete() {
	    if (this.cursor === 0) return this.bell();
	    let s1 = this.input.slice(0, this.cursor - 1);
	    let s2 = this.input.slice(this.cursor);
	    this.input = `${s1}${s2}`;
	    this.complete(this.render);
	    this.cursor = this.cursor - 1;
	    this.render();
	  }

	  deleteForward() {
	    if (this.cursor * this.scale >= this.rendered.length) return this.bell();
	    let s1 = this.input.slice(0, this.cursor);
	    let s2 = this.input.slice(this.cursor + 1);
	    this.input = `${s1}${s2}`;
	    this.complete(this.render);
	    this.render();
	  }

	  first() {
	    this.moveSelect(0);
	    this.render();
	  }

	  last() {
	    this.moveSelect(this.suggestions.length - 1);
	    this.render();
	  }

	  up() {
	    if (this.select === 0) {
	      this.moveSelect(this.suggestions.length - 1);
	    } else {
	      this.moveSelect(this.select - 1);
	    }

	    this.render();
	  }

	  down() {
	    if (this.select === this.suggestions.length - 1) {
	      this.moveSelect(0);
	    } else {
	      this.moveSelect(this.select + 1);
	    }

	    this.render();
	  }

	  next() {
	    if (this.select === this.suggestions.length - 1) {
	      this.moveSelect(0);
	    } else this.moveSelect(this.select + 1);

	    this.render();
	  }

	  nextPage() {
	    this.moveSelect(Math.min(this.select + this.limit, this.suggestions.length - 1));
	    this.render();
	  }

	  prevPage() {
	    this.moveSelect(Math.max(this.select - this.limit, 0));
	    this.render();
	  }

	  left() {
	    if (this.cursor <= 0) return this.bell();
	    this.cursor = this.cursor - 1;
	    this.render();
	  }

	  right() {
	    if (this.cursor * this.scale >= this.rendered.length) return this.bell();
	    this.cursor = this.cursor + 1;
	    this.render();
	  }

	  renderOption(v, hovered, isStart, isEnd) {
	    let desc;
	    let prefix = isStart ? figures.arrowUp : isEnd ? figures.arrowDown : ' ';
	    let title = hovered ? color.cyan().underline(v.title) : v.title;
	    prefix = (hovered ? color.cyan(figures.pointer) + ' ' : '  ') + prefix;

	    if (v.description) {
	      desc = ` - ${v.description}`;

	      if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) {
	        desc = '\n' + wrap(v.description, {
	          margin: 3,
	          width: this.out.columns
	        });
	      }
	    }

	    return prefix + ' ' + title + color.gray(desc || '');
	  }

	  render() {
	    if (this.closed) return;
	    if (this.firstRender) this.out.write(cursor.hide);else this.out.write(clear(this.outputText, this.out.columns));
	    super.render();

	    let _entriesToDisplay = entriesToDisplay(this.select, this.choices.length, this.limit),
	        startIndex = _entriesToDisplay.startIndex,
	        endIndex = _entriesToDisplay.endIndex;

	    this.outputText = [style.symbol(this.done, this.aborted, this.exited), color.bold(this.msg), style.delimiter(this.completing), this.done && this.suggestions[this.select] ? this.suggestions[this.select].title : this.rendered = this.transform.render(this.input)].join(' ');

	    if (!this.done) {
	      const suggestions = this.suggestions.slice(startIndex, endIndex).map((item, i) => this.renderOption(item, this.select === i + startIndex, i === 0 && startIndex > 0, i + startIndex === endIndex - 1 && endIndex < this.choices.length)).join('\n');
	      this.outputText += `\n` + (suggestions || color.gray(this.fallback.title));
	    }

	    this.out.write(erase.line + cursor.to(0) + this.outputText);
	  }

	}

	autocomplete$1 = AutocompletePrompt;
	return autocomplete$1;
}

var autocompleteMultiselect$1;
var hasRequiredAutocompleteMultiselect$1;

function requireAutocompleteMultiselect$1 () {
	if (hasRequiredAutocompleteMultiselect$1) return autocompleteMultiselect$1;
	hasRequiredAutocompleteMultiselect$1 = 1;

	const color = requireKleur();

	const _require = requireSrc(),
	      cursor = _require.cursor;

	const MultiselectPrompt = requireMultiselect$1();

	const _require2 = requireUtil$1(),
	      clear = _require2.clear,
	      style = _require2.style,
	      figures = _require2.figures;
	/**
	 * MultiselectPrompt Base Element
	 * @param {Object} opts Options
	 * @param {String} opts.message Message
	 * @param {Array} opts.choices Array of choice objects
	 * @param {String} [opts.hint] Hint to display
	 * @param {String} [opts.warn] Hint shown for disabled choices
	 * @param {Number} [opts.max] Max choices
	 * @param {Number} [opts.cursor=0] Cursor start position
	 * @param {Stream} [opts.stdin] The Readable stream to listen to
	 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
	 */


	class AutocompleteMultiselectPrompt extends MultiselectPrompt {
	  constructor(opts = {}) {
	    opts.overrideRender = true;
	    super(opts);
	    this.inputValue = '';
	    this.clear = clear('', this.out.columns);
	    this.filteredOptions = this.value;
	    this.render();
	  }

	  last() {
	    this.cursor = this.filteredOptions.length - 1;
	    this.render();
	  }

	  next() {
	    this.cursor = (this.cursor + 1) % this.filteredOptions.length;
	    this.render();
	  }

	  up() {
	    if (this.cursor === 0) {
	      this.cursor = this.filteredOptions.length - 1;
	    } else {
	      this.cursor--;
	    }

	    this.render();
	  }

	  down() {
	    if (this.cursor === this.filteredOptions.length - 1) {
	      this.cursor = 0;
	    } else {
	      this.cursor++;
	    }

	    this.render();
	  }

	  left() {
	    this.filteredOptions[this.cursor].selected = false;
	    this.render();
	  }

	  right() {
	    if (this.value.filter(e => e.selected).length >= this.maxChoices) return this.bell();
	    this.filteredOptions[this.cursor].selected = true;
	    this.render();
	  }

	  delete() {
	    if (this.inputValue.length) {
	      this.inputValue = this.inputValue.substr(0, this.inputValue.length - 1);
	      this.updateFilteredOptions();
	    }
	  }

	  updateFilteredOptions() {
	    const currentHighlight = this.filteredOptions[this.cursor];
	    this.filteredOptions = this.value.filter(v => {
	      if (this.inputValue) {
	        if (typeof v.title === 'string') {
	          if (v.title.toLowerCase().includes(this.inputValue.toLowerCase())) {
	            return true;
	          }
	        }

	        if (typeof v.value === 'string') {
	          if (v.value.toLowerCase().includes(this.inputValue.toLowerCase())) {
	            return true;
	          }
	        }

	        return false;
	      }

	      return true;
	    });
	    const newHighlightIndex = this.filteredOptions.findIndex(v => v === currentHighlight);
	    this.cursor = newHighlightIndex < 0 ? 0 : newHighlightIndex;
	    this.render();
	  }

	  handleSpaceToggle() {
	    const v = this.filteredOptions[this.cursor];

	    if (v.selected) {
	      v.selected = false;
	      this.render();
	    } else if (v.disabled || this.value.filter(e => e.selected).length >= this.maxChoices) {
	      return this.bell();
	    } else {
	      v.selected = true;
	      this.render();
	    }
	  }

	  handleInputChange(c) {
	    this.inputValue = this.inputValue + c;
	    this.updateFilteredOptions();
	  }

	  _(c, key) {
	    if (c === ' ') {
	      this.handleSpaceToggle();
	    } else {
	      this.handleInputChange(c);
	    }
	  }

	  renderInstructions() {
	    if (this.instructions === undefined || this.instructions) {
	      if (typeof this.instructions === 'string') {
	        return this.instructions;
	      }

	      return `
Instructions:
    ${figures.arrowUp}/${figures.arrowDown}: Highlight option
    ${figures.arrowLeft}/${figures.arrowRight}/[space]: Toggle selection
    [a,b,c]/delete: Filter choices
    enter/return: Complete answer
`;
	    }

	    return '';
	  }

	  renderCurrentInput() {
	    return `
Filtered results for: ${this.inputValue ? this.inputValue : color.gray('Enter something to filter')}\n`;
	  }

	  renderOption(cursor, v, i) {
	    let title;
	    if (v.disabled) title = cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);else title = cursor === i ? color.cyan().underline(v.title) : v.title;
	    return (v.selected ? color.green(figures.radioOn) : figures.radioOff) + '  ' + title;
	  }

	  renderDoneOrInstructions() {
	    if (this.done) {
	      return this.value.filter(e => e.selected).map(v => v.title).join(', ');
	    }

	    const output = [color.gray(this.hint), this.renderInstructions(), this.renderCurrentInput()];

	    if (this.filteredOptions.length && this.filteredOptions[this.cursor].disabled) {
	      output.push(color.yellow(this.warn));
	    }

	    return output.join(' ');
	  }

	  render() {
	    if (this.closed) return;
	    if (this.firstRender) this.out.write(cursor.hide);
	    super.render(); // print prompt

	    let prompt = [style.symbol(this.done, this.aborted), color.bold(this.msg), style.delimiter(false), this.renderDoneOrInstructions()].join(' ');

	    if (this.showMinError) {
	      prompt += color.red(`You must select a minimum of ${this.minSelected} choices.`);
	      this.showMinError = false;
	    }

	    prompt += this.renderOptions(this.filteredOptions);
	    this.out.write(this.clear + prompt);
	    this.clear = clear(prompt, this.out.columns);
	  }

	}

	autocompleteMultiselect$1 = AutocompleteMultiselectPrompt;
	return autocompleteMultiselect$1;
}

var confirm$1;
var hasRequiredConfirm$1;

function requireConfirm$1 () {
	if (hasRequiredConfirm$1) return confirm$1;
	hasRequiredConfirm$1 = 1;

	const color = requireKleur();

	const Prompt = requirePrompt$1();

	const _require = requireUtil$1(),
	      style = _require.style,
	      clear = _require.clear;

	const _require2 = requireSrc(),
	      erase = _require2.erase,
	      cursor = _require2.cursor;
	/**
	 * ConfirmPrompt Base Element
	 * @param {Object} opts Options
	 * @param {String} opts.message Message
	 * @param {Boolean} [opts.initial] Default value (true/false)
	 * @param {Stream} [opts.stdin] The Readable stream to listen to
	 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
	 * @param {String} [opts.yes] The "Yes" label
	 * @param {String} [opts.yesOption] The "Yes" option when choosing between yes/no
	 * @param {String} [opts.no] The "No" label
	 * @param {String} [opts.noOption] The "No" option when choosing between yes/no
	 */


	class ConfirmPrompt extends Prompt {
	  constructor(opts = {}) {
	    super(opts);
	    this.msg = opts.message;
	    this.value = opts.initial;
	    this.initialValue = !!opts.initial;
	    this.yesMsg = opts.yes || 'yes';
	    this.yesOption = opts.yesOption || '(Y/n)';
	    this.noMsg = opts.no || 'no';
	    this.noOption = opts.noOption || '(y/N)';
	    this.render();
	  }

	  reset() {
	    this.value = this.initialValue;
	    this.fire();
	    this.render();
	  }

	  exit() {
	    this.abort();
	  }

	  abort() {
	    this.done = this.aborted = true;
	    this.fire();
	    this.render();
	    this.out.write('\n');
	    this.close();
	  }

	  submit() {
	    this.value = this.value || false;
	    this.done = true;
	    this.aborted = false;
	    this.fire();
	    this.render();
	    this.out.write('\n');
	    this.close();
	  }

	  _(c, key) {
	    if (c.toLowerCase() === 'y') {
	      this.value = true;
	      return this.submit();
	    }

	    if (c.toLowerCase() === 'n') {
	      this.value = false;
	      return this.submit();
	    }

	    return this.bell();
	  }

	  render() {
	    if (this.closed) return;
	    if (this.firstRender) this.out.write(cursor.hide);else this.out.write(clear(this.outputText, this.out.columns));
	    super.render();
	    this.outputText = [style.symbol(this.done, this.aborted), color.bold(this.msg), style.delimiter(this.done), this.done ? this.value ? this.yesMsg : this.noMsg : color.gray(this.initialValue ? this.yesOption : this.noOption)].join(' ');
	    this.out.write(erase.line + cursor.to(0) + this.outputText);
	  }

	}

	confirm$1 = ConfirmPrompt;
	return confirm$1;
}

var elements$1;
var hasRequiredElements$1;

function requireElements$1 () {
	if (hasRequiredElements$1) return elements$1;
	hasRequiredElements$1 = 1;

	elements$1 = {
	  TextPrompt: requireText$1(),
	  SelectPrompt: requireSelect$1(),
	  TogglePrompt: requireToggle$1(),
	  DatePrompt: requireDate$1(),
	  NumberPrompt: requireNumber$1(),
	  MultiselectPrompt: requireMultiselect$1(),
	  AutocompletePrompt: requireAutocomplete$1(),
	  AutocompleteMultiselectPrompt: requireAutocompleteMultiselect$1(),
	  ConfirmPrompt: requireConfirm$1()
	};
	return elements$1;
}

var hasRequiredPrompts$1;

function requirePrompts$1 () {
	if (hasRequiredPrompts$1) return prompts$2;
	hasRequiredPrompts$1 = 1;
	(function (exports) {

		const $ = exports;

		const el = requireElements$1();

		const noop = v => v;

		function toPrompt(type, args, opts = {}) {
		  return new Promise((res, rej) => {
		    const p = new el[type](args);
		    const onAbort = opts.onAbort || noop;
		    const onSubmit = opts.onSubmit || noop;
		    const onExit = opts.onExit || noop;
		    p.on('state', args.onState || noop);
		    p.on('submit', x => res(onSubmit(x)));
		    p.on('exit', x => res(onExit(x)));
		    p.on('abort', x => rej(onAbort(x)));
		  });
		}
		/**
		 * Text prompt
		 * @param {string} args.message Prompt message to display
		 * @param {string} [args.initial] Default string value
		 * @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
		 * @param {function} [args.onState] On state change callback
		 * @param {function} [args.validate] Function to validate user input
		 * @param {Stream} [args.stdin] The Readable stream to listen to
		 * @param {Stream} [args.stdout] The Writable stream to write readline data to
		 * @returns {Promise} Promise with user input
		 */


		$.text = args => toPrompt('TextPrompt', args);
		/**
		 * Password prompt with masked input
		 * @param {string} args.message Prompt message to display
		 * @param {string} [args.initial] Default string value
		 * @param {function} [args.onState] On state change callback
		 * @param {function} [args.validate] Function to validate user input
		 * @param {Stream} [args.stdin] The Readable stream to listen to
		 * @param {Stream} [args.stdout] The Writable stream to write readline data to
		 * @returns {Promise} Promise with user input
		 */


		$.password = args => {
		  args.style = 'password';
		  return $.text(args);
		};
		/**
		 * Prompt where input is invisible, like sudo
		 * @param {string} args.message Prompt message to display
		 * @param {string} [args.initial] Default string value
		 * @param {function} [args.onState] On state change callback
		 * @param {function} [args.validate] Function to validate user input
		 * @param {Stream} [args.stdin] The Readable stream to listen to
		 * @param {Stream} [args.stdout] The Writable stream to write readline data to
		 * @returns {Promise} Promise with user input
		 */


		$.invisible = args => {
		  args.style = 'invisible';
		  return $.text(args);
		};
		/**
		 * Number prompt
		 * @param {string} args.message Prompt message to display
		 * @param {number} args.initial Default number value
		 * @param {function} [args.onState] On state change callback
		 * @param {number} [args.max] Max value
		 * @param {number} [args.min] Min value
		 * @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
		 * @param {Boolean} [opts.float=false] Parse input as floats
		 * @param {Number} [opts.round=2] Round floats to x decimals
		 * @param {Number} [opts.increment=1] Number to increment by when using arrow-keys
		 * @param {function} [args.validate] Function to validate user input
		 * @param {Stream} [args.stdin] The Readable stream to listen to
		 * @param {Stream} [args.stdout] The Writable stream to write readline data to
		 * @returns {Promise} Promise with user input
		 */


		$.number = args => toPrompt('NumberPrompt', args);
		/**
		 * Date prompt
		 * @param {string} args.message Prompt message to display
		 * @param {number} args.initial Default number value
		 * @param {function} [args.onState] On state change callback
		 * @param {number} [args.max] Max value
		 * @param {number} [args.min] Min value
		 * @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
		 * @param {Boolean} [opts.float=false] Parse input as floats
		 * @param {Number} [opts.round=2] Round floats to x decimals
		 * @param {Number} [opts.increment=1] Number to increment by when using arrow-keys
		 * @param {function} [args.validate] Function to validate user input
		 * @param {Stream} [args.stdin] The Readable stream to listen to
		 * @param {Stream} [args.stdout] The Writable stream to write readline data to
		 * @returns {Promise} Promise with user input
		 */


		$.date = args => toPrompt('DatePrompt', args);
		/**
		 * Classic yes/no prompt
		 * @param {string} args.message Prompt message to display
		 * @param {boolean} [args.initial=false] Default value
		 * @param {function} [args.onState] On state change callback
		 * @param {Stream} [args.stdin] The Readable stream to listen to
		 * @param {Stream} [args.stdout] The Writable stream to write readline data to
		 * @returns {Promise} Promise with user input
		 */


		$.confirm = args => toPrompt('ConfirmPrompt', args);
		/**
		 * List prompt, split intput string by `seperator`
		 * @param {string} args.message Prompt message to display
		 * @param {string} [args.initial] Default string value
		 * @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
		 * @param {string} [args.separator] String separator
		 * @param {function} [args.onState] On state change callback
		 * @param {Stream} [args.stdin] The Readable stream to listen to
		 * @param {Stream} [args.stdout] The Writable stream to write readline data to
		 * @returns {Promise} Promise with user input, in form of an `Array`
		 */


		$.list = args => {
		  const sep = args.separator || ',';
		  return toPrompt('TextPrompt', args, {
		    onSubmit: str => str.split(sep).map(s => s.trim())
		  });
		};
		/**
		 * Toggle/switch prompt
		 * @param {string} args.message Prompt message to display
		 * @param {boolean} [args.initial=false] Default value
		 * @param {string} [args.active="on"] Text for `active` state
		 * @param {string} [args.inactive="off"] Text for `inactive` state
		 * @param {function} [args.onState] On state change callback
		 * @param {Stream} [args.stdin] The Readable stream to listen to
		 * @param {Stream} [args.stdout] The Writable stream to write readline data to
		 * @returns {Promise} Promise with user input
		 */


		$.toggle = args => toPrompt('TogglePrompt', args);
		/**
		 * Interactive select prompt
		 * @param {string} args.message Prompt message to display
		 * @param {Array} args.choices Array of choices objects `[{ title, value }, ...]`
		 * @param {number} [args.initial] Index of default value
		 * @param {String} [args.hint] Hint to display
		 * @param {function} [args.onState] On state change callback
		 * @param {Stream} [args.stdin] The Readable stream to listen to
		 * @param {Stream} [args.stdout] The Writable stream to write readline data to
		 * @returns {Promise} Promise with user input
		 */


		$.select = args => toPrompt('SelectPrompt', args);
		/**
		 * Interactive multi-select / autocompleteMultiselect prompt
		 * @param {string} args.message Prompt message to display
		 * @param {Array} args.choices Array of choices objects `[{ title, value, [selected] }, ...]`
		 * @param {number} [args.max] Max select
		 * @param {string} [args.hint] Hint to display user
		 * @param {Number} [args.cursor=0] Cursor start position
		 * @param {function} [args.onState] On state change callback
		 * @param {Stream} [args.stdin] The Readable stream to listen to
		 * @param {Stream} [args.stdout] The Writable stream to write readline data to
		 * @returns {Promise} Promise with user input
		 */


		$.multiselect = args => {
		  args.choices = [].concat(args.choices || []);

		  const toSelected = items => items.filter(item => item.selected).map(item => item.value);

		  return toPrompt('MultiselectPrompt', args, {
		    onAbort: toSelected,
		    onSubmit: toSelected
		  });
		};

		$.autocompleteMultiselect = args => {
		  args.choices = [].concat(args.choices || []);

		  const toSelected = items => items.filter(item => item.selected).map(item => item.value);

		  return toPrompt('AutocompleteMultiselectPrompt', args, {
		    onAbort: toSelected,
		    onSubmit: toSelected
		  });
		};

		const byTitle = (input, choices) => Promise.resolve(choices.filter(item => item.title.slice(0, input.length).toLowerCase() === input.toLowerCase()));
		/**
		 * Interactive auto-complete prompt
		 * @param {string} args.message Prompt message to display
		 * @param {Array} args.choices Array of auto-complete choices objects `[{ title, value }, ...]`
		 * @param {Function} [args.suggest] Function to filter results based on user input. Defaults to sort by `title`
		 * @param {number} [args.limit=10] Max number of results to show
		 * @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
		 * @param {String} [args.initial] Index of the default value
		 * @param {boolean} [opts.clearFirst] The first ESCAPE keypress will clear the input
		 * @param {String} [args.fallback] Fallback message - defaults to initial value
		 * @param {function} [args.onState] On state change callback
		 * @param {Stream} [args.stdin] The Readable stream to listen to
		 * @param {Stream} [args.stdout] The Writable stream to write readline data to
		 * @returns {Promise} Promise with user input
		 */


		$.autocomplete = args => {
		  args.suggest = args.suggest || byTitle;
		  args.choices = [].concat(args.choices || []);
		  return toPrompt('AutocompletePrompt', args);
		}; 
	} (prompts$2));
	return prompts$2;
}

var dist;
var hasRequiredDist;

function requireDist () {
	if (hasRequiredDist) return dist;
	hasRequiredDist = 1;

	function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

	function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

	function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

	function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

	function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

	const prompts = requirePrompts$1();

	const passOn = ['suggest', 'format', 'onState', 'validate', 'onRender', 'type'];

	const noop = () => {};
	/**
	 * Prompt for a series of questions
	 * @param {Array|Object} questions Single question object or Array of question objects
	 * @param {Function} [onSubmit] Callback function called on prompt submit
	 * @param {Function} [onCancel] Callback function called on cancel/abort
	 * @returns {Object} Object with values from user input
	 */


	function prompt() {
	  return _prompt.apply(this, arguments);
	}

	function _prompt() {
	  _prompt = _asyncToGenerator(function* (questions = [], {
	    onSubmit = noop,
	    onCancel = noop
	  } = {}) {
	    const answers = {};
	    const override = prompt._override || {};
	    questions = [].concat(questions);
	    let answer, question, quit, name, type, lastPrompt;

	    const getFormattedAnswer = /*#__PURE__*/function () {
	      var _ref = _asyncToGenerator(function* (question, answer, skipValidation = false) {
	        if (!skipValidation && question.validate && question.validate(answer) !== true) {
	          return;
	        }

	        return question.format ? yield question.format(answer, answers) : answer;
	      });

	      return function getFormattedAnswer(_x, _x2) {
	        return _ref.apply(this, arguments);
	      };
	    }();

	    var _iterator = _createForOfIteratorHelper(questions),
	        _step;

	    try {
	      for (_iterator.s(); !(_step = _iterator.n()).done;) {
	        question = _step.value;
	        var _question = question;
	        name = _question.name;
	        type = _question.type;

	        // evaluate type first and skip if type is a falsy value
	        if (typeof type === 'function') {
	          type = yield type(answer, _objectSpread({}, answers), question);
	          question['type'] = type;
	        }

	        if (!type) continue; // if property is a function, invoke it unless it's a special function

	        for (let key in question) {
	          if (passOn.includes(key)) continue;
	          let value = question[key];
	          question[key] = typeof value === 'function' ? yield value(answer, _objectSpread({}, answers), lastPrompt) : value;
	        }

	        lastPrompt = question;

	        if (typeof question.message !== 'string') {
	          throw new Error('prompt message is required');
	        } // update vars in case they changed


	        var _question2 = question;
	        name = _question2.name;
	        type = _question2.type;

	        if (prompts[type] === void 0) {
	          throw new Error(`prompt type (${type}) is not defined`);
	        }

	        if (override[question.name] !== undefined) {
	          answer = yield getFormattedAnswer(question, override[question.name]);

	          if (answer !== undefined) {
	            answers[name] = answer;
	            continue;
	          }
	        }

	        try {
	          // Get the injected answer if there is one or prompt the user
	          answer = prompt._injected ? getInjectedAnswer(prompt._injected, question.initial) : yield prompts[type](question);
	          answers[name] = answer = yield getFormattedAnswer(question, answer, true);
	          quit = yield onSubmit(question, answer, answers);
	        } catch (err) {
	          quit = !(yield onCancel(question, answers));
	        }

	        if (quit) return answers;
	      }
	    } catch (err) {
	      _iterator.e(err);
	    } finally {
	      _iterator.f();
	    }

	    return answers;
	  });
	  return _prompt.apply(this, arguments);
	}

	function getInjectedAnswer(injected, deafultValue) {
	  const answer = injected.shift();

	  if (answer instanceof Error) {
	    throw answer;
	  }

	  return answer === undefined ? deafultValue : answer;
	}

	function inject(answers) {
	  prompt._injected = (prompt._injected || []).concat(answers);
	}

	function override(answers) {
	  prompt._override = Object.assign({}, answers);
	}

	dist = Object.assign(prompt, {
	  prompt,
	  prompts,
	  inject,
	  override
	});
	return dist;
}

var prompts$1 = {};

var action;
var hasRequiredAction;

function requireAction () {
	if (hasRequiredAction) return action;
	hasRequiredAction = 1;

	action = (key, isSelect) => {
	  if (key.meta && key.name !== 'escape') return;
	  
	  if (key.ctrl) {
	    if (key.name === 'a') return 'first';
	    if (key.name === 'c') return 'abort';
	    if (key.name === 'd') return 'abort';
	    if (key.name === 'e') return 'last';
	    if (key.name === 'g') return 'reset';
	  }
	  
	  if (isSelect) {
	    if (key.name === 'j') return 'down';
	    if (key.name === 'k') return 'up';
	  }

	  if (key.name === 'return') return 'submit';
	  if (key.name === 'enter') return 'submit'; // ctrl + J
	  if (key.name === 'backspace') return 'delete';
	  if (key.name === 'delete') return 'deleteForward';
	  if (key.name === 'abort') return 'abort';
	  if (key.name === 'escape') return 'exit';
	  if (key.name === 'tab') return 'next';
	  if (key.name === 'pagedown') return 'nextPage';
	  if (key.name === 'pageup') return 'prevPage';
	  // TODO create home() in prompt types (e.g. TextPrompt)
	  if (key.name === 'home') return 'home';
	  // TODO create end() in prompt types (e.g. TextPrompt)
	  if (key.name === 'end') return 'end';

	  if (key.name === 'up') return 'up';
	  if (key.name === 'down') return 'down';
	  if (key.name === 'right') return 'right';
	  if (key.name === 'left') return 'left';

	  return false;
	};
	return action;
}

var strip;
var hasRequiredStrip;

function requireStrip () {
	if (hasRequiredStrip) return strip;
	hasRequiredStrip = 1;

	strip = str => {
	  const pattern = [
	    '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
	    '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))'
	  ].join('|');

	  const RGX = new RegExp(pattern, 'g');
	  return typeof str === 'string' ? str.replace(RGX, '') : str;
	};
	return strip;
}

var clear;
var hasRequiredClear;

function requireClear () {
	if (hasRequiredClear) return clear;
	hasRequiredClear = 1;

	const strip = requireStrip();
	const { erase, cursor } = requireSrc();

	const width = str => [...strip(str)].length;

	/**
	 * @param {string} prompt
	 * @param {number} perLine
	 */
	clear = function(prompt, perLine) {
	  if (!perLine) return erase.line + cursor.to(0);

	  let rows = 0;
	  const lines = prompt.split(/\r?\n/);
	  for (let line of lines) {
	    rows += 1 + Math.floor(Math.max(width(line) - 1, 0) / perLine);
	  }

	  return erase.lines(rows);
	};
	return clear;
}

var figures_1;
var hasRequiredFigures;

function requireFigures () {
	if (hasRequiredFigures) return figures_1;
	hasRequiredFigures = 1;

	 const main = {
	  arrowUp: '↑',
	  arrowDown: '↓',
	  arrowLeft: '←',
	  arrowRight: '→',
	  radioOn: '◉',
	  radioOff: '◯',
	  tick: '✔',	
	  cross: '✖',	
	  ellipsis: '…',	
	  pointerSmall: '›',	
	  line: '─',	
	  pointer: '❯'	
	};	
	const win = {
	  arrowUp: main.arrowUp,
	  arrowDown: main.arrowDown,
	  arrowLeft: main.arrowLeft,
	  arrowRight: main.arrowRight,
	  radioOn: '(*)',
	  radioOff: '( )',	
	  tick: '√',	
	  cross: '×',	
	  ellipsis: '...',	
	  pointerSmall: '»',	
	  line: '─',	
	  pointer: '>'	
	};	
	const figures = process.platform === 'win32' ? win : main;	

	 figures_1 = figures;
	return figures_1;
}

var style;
var hasRequiredStyle;

function requireStyle () {
	if (hasRequiredStyle) return style;
	hasRequiredStyle = 1;

	const c = requireKleur();
	const figures = requireFigures();

	// rendering user input.
	const styles = Object.freeze({
	  password: { scale: 1, render: input => '*'.repeat(input.length) },
	  emoji: { scale: 2, render: input => '😃'.repeat(input.length) },
	  invisible: { scale: 0, render: input => '' },
	  default: { scale: 1, render: input => `${input}` }
	});
	const render = type => styles[type] || styles.default;

	// icon to signalize a prompt.
	const symbols = Object.freeze({
	  aborted: c.red(figures.cross),
	  done: c.green(figures.tick),
	  exited: c.yellow(figures.cross),
	  default: c.cyan('?')
	});

	const symbol = (done, aborted, exited) =>
	  aborted ? symbols.aborted : exited ? symbols.exited : done ? symbols.done : symbols.default;

	// between the question and the user's input.
	const delimiter = completing =>
	  c.gray(completing ? figures.ellipsis : figures.pointerSmall);

	const item = (expandable, expanded) =>
	  c.gray(expandable ? (expanded ? figures.pointerSmall : '+') : figures.line);

	style = {
	  styles,
	  render,
	  symbols,
	  symbol,
	  delimiter,
	  item
	};
	return style;
}

var lines;
var hasRequiredLines;

function requireLines () {
	if (hasRequiredLines) return lines;
	hasRequiredLines = 1;

	const strip = requireStrip();

	/**
	 * @param {string} msg
	 * @param {number} perLine
	 */
	lines = function (msg, perLine) {
	  let lines = String(strip(msg) || '').split(/\r?\n/);

	  if (!perLine) return lines.length;
	  return lines.map(l => Math.ceil(l.length / perLine))
	      .reduce((a, b) => a + b);
	};
	return lines;
}

var wrap;
var hasRequiredWrap;

function requireWrap () {
	if (hasRequiredWrap) return wrap;
	hasRequiredWrap = 1;

	/**
	 * @param {string} msg The message to wrap
	 * @param {object} opts
	 * @param {number|string} [opts.margin] Left margin
	 * @param {number} opts.width Maximum characters per line including the margin
	 */
	wrap = (msg, opts = {}) => {
	  const tab = Number.isSafeInteger(parseInt(opts.margin))
	    ? new Array(parseInt(opts.margin)).fill(' ').join('')
	    : (opts.margin || '');

	  const width = opts.width;

	  return (msg || '').split(/\r?\n/g)
	    .map(line => line
	      .split(/\s+/g)
	      .reduce((arr, w) => {
	        if (w.length + tab.length >= width || arr[arr.length - 1].length + w.length + 1 < width)
	          arr[arr.length - 1] += ` ${w}`;
	        else arr.push(`${tab}${w}`);
	        return arr;
	      }, [ tab ])
	      .join('\n'))
	    .join('\n');
	};
	return wrap;
}

var entriesToDisplay;
var hasRequiredEntriesToDisplay;

function requireEntriesToDisplay () {
	if (hasRequiredEntriesToDisplay) return entriesToDisplay;
	hasRequiredEntriesToDisplay = 1;

	/**
	 * Determine what entries should be displayed on the screen, based on the
	 * currently selected index and the maximum visible. Used in list-based
	 * prompts like `select` and `multiselect`.
	 *
	 * @param {number} cursor the currently selected entry
	 * @param {number} total the total entries available to display
	 * @param {number} [maxVisible] the number of entries that can be displayed
	 */
	entriesToDisplay = (cursor, total, maxVisible)  => {
	  maxVisible = maxVisible || total;

	  let startIndex = Math.min(total- maxVisible, cursor - Math.floor(maxVisible / 2));
	  if (startIndex < 0) startIndex = 0;

	  let endIndex = Math.min(startIndex + maxVisible, total);

	  return { startIndex, endIndex };
	};
	return entriesToDisplay;
}

var util;
var hasRequiredUtil;

function requireUtil () {
	if (hasRequiredUtil) return util;
	hasRequiredUtil = 1;

	util = {
	  action: requireAction(),
	  clear: requireClear(),
	  style: requireStyle(),
	  strip: requireStrip(),
	  figures: requireFigures(),
	  lines: requireLines(),
	  wrap: requireWrap(),
	  entriesToDisplay: requireEntriesToDisplay()
	};
	return util;
}

var prompt$1;
var hasRequiredPrompt;

function requirePrompt () {
	if (hasRequiredPrompt) return prompt$1;
	hasRequiredPrompt = 1;

	const readline = require$$0$2;
	const { action } = requireUtil();
	const EventEmitter = require$$2$1;
	const { beep, cursor } = requireSrc();
	const color = requireKleur();

	/**
	 * Base prompt skeleton
	 * @param {Stream} [opts.stdin] The Readable stream to listen to
	 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
	 */
	class Prompt extends EventEmitter {
	  constructor(opts={}) {
	    super();

	    this.firstRender = true;
	    this.in = opts.stdin || process.stdin;
	    this.out = opts.stdout || process.stdout;
	    this.onRender = (opts.onRender || (() => void 0)).bind(this);
	    const rl = readline.createInterface({ input:this.in, escapeCodeTimeout:50 });
	    readline.emitKeypressEvents(this.in, rl);

	    if (this.in.isTTY) this.in.setRawMode(true);
	    const isSelect = [ 'SelectPrompt', 'MultiselectPrompt' ].indexOf(this.constructor.name) > -1;
	    const keypress = (str, key) => {
	      let a = action(key, isSelect);
	      if (a === false) {
	        this._ && this._(str, key);
	      } else if (typeof this[a] === 'function') {
	        this[a](key);
	      } else {
	        this.bell();
	      }
	    };

	    this.close = () => {
	      this.out.write(cursor.show);
	      this.in.removeListener('keypress', keypress);
	      if (this.in.isTTY) this.in.setRawMode(false);
	      rl.close();
	      this.emit(this.aborted ? 'abort' : this.exited ? 'exit' : 'submit', this.value);
	      this.closed = true;
	    };

	    this.in.on('keypress', keypress);
	  }

	  fire() {
	    this.emit('state', {
	      value: this.value,
	      aborted: !!this.aborted,
	      exited: !!this.exited
	    });
	  }

	  bell() {
	    this.out.write(beep);
	  }

	  render() {
	    this.onRender(color);
	    if (this.firstRender) this.firstRender = false;
	  }
	}

	prompt$1 = Prompt;
	return prompt$1;
}

var text;
var hasRequiredText;

function requireText () {
	if (hasRequiredText) return text;
	hasRequiredText = 1;
	const color = requireKleur();
	const Prompt = requirePrompt();
	const { erase, cursor } = requireSrc();
	const { style, clear, lines, figures } = requireUtil();

	/**
	 * TextPrompt Base Element
	 * @param {Object} opts Options
	 * @param {String} opts.message Message
	 * @param {String} [opts.style='default'] Render style
	 * @param {String} [opts.initial] Default value
	 * @param {Function} [opts.validate] Validate function
	 * @param {Stream} [opts.stdin] The Readable stream to listen to
	 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
	 * @param {String} [opts.error] The invalid error label
	 */
	class TextPrompt extends Prompt {
	  constructor(opts={}) {
	    super(opts);
	    this.transform = style.render(opts.style);
	    this.scale = this.transform.scale;
	    this.msg = opts.message;
	    this.initial = opts.initial || ``;
	    this.validator = opts.validate || (() => true);
	    this.value = ``;
	    this.errorMsg = opts.error || `Please Enter A Valid Value`;
	    this.cursor = Number(!!this.initial);
	    this.cursorOffset = 0;
	    this.clear = clear(``, this.out.columns);
	    this.render();
	  }

	  set value(v) {
	    if (!v && this.initial) {
	      this.placeholder = true;
	      this.rendered = color.gray(this.transform.render(this.initial));
	    } else {
	      this.placeholder = false;
	      this.rendered = this.transform.render(v);
	    }
	    this._value = v;
	    this.fire();
	  }

	  get value() {
	    return this._value;
	  }

	  reset() {
	    this.value = ``;
	    this.cursor = Number(!!this.initial);
	    this.cursorOffset = 0;
	    this.fire();
	    this.render();
	  }

	  exit() {
	    this.abort();
	  }

	  abort() {
	    this.value = this.value || this.initial;
	    this.done = this.aborted = true;
	    this.error = false;
	    this.red = false;
	    this.fire();
	    this.render();
	    this.out.write('\n');
	    this.close();
	  }

	  async validate() {
	    let valid = await this.validator(this.value);
	    if (typeof valid === `string`) {
	      this.errorMsg = valid;
	      valid = false;
	    }
	    this.error = !valid;
	  }

	  async submit() {
	    this.value = this.value || this.initial;
	    this.cursorOffset = 0;
	    this.cursor = this.rendered.length;
	    await this.validate();
	    if (this.error) {
	      this.red = true;
	      this.fire();
	      this.render();
	      return;
	    }
	    this.done = true;
	    this.aborted = false;
	    this.fire();
	    this.render();
	    this.out.write('\n');
	    this.close();
	  }

	  next() {
	    if (!this.placeholder) return this.bell();
	    this.value = this.initial;
	    this.cursor = this.rendered.length;
	    this.fire();
	    this.render();
	  }

	  moveCursor(n) {
	    if (this.placeholder) return;
	    this.cursor = this.cursor+n;
	    this.cursorOffset += n;
	  }

	  _(c, key) {
	    let s1 = this.value.slice(0, this.cursor);
	    let s2 = this.value.slice(this.cursor);
	    this.value = `${s1}${c}${s2}`;
	    this.red = false;
	    this.cursor = this.placeholder ? 0 : s1.length+1;
	    this.render();
	  }

	  delete() {
	    if (this.isCursorAtStart()) return this.bell();
	    let s1 = this.value.slice(0, this.cursor-1);
	    let s2 = this.value.slice(this.cursor);
	    this.value = `${s1}${s2}`;
	    this.red = false;
	    if (this.isCursorAtStart()) {
	      this.cursorOffset = 0;
	    } else {
	      this.cursorOffset++;
	      this.moveCursor(-1);
	    }
	    this.render();
	  }

	  deleteForward() {
	    if(this.cursor*this.scale >= this.rendered.length || this.placeholder) return this.bell();
	    let s1 = this.value.slice(0, this.cursor);
	    let s2 = this.value.slice(this.cursor+1);
	    this.value = `${s1}${s2}`;
	    this.red = false;
	    if (this.isCursorAtEnd()) {
	      this.cursorOffset = 0;
	    } else {
	      this.cursorOffset++;
	    }
	    this.render();
	  }

	  first() {
	    this.cursor = 0;
	    this.render();
	  }

	  last() {
	    this.cursor = this.value.length;
	    this.render();
	  }

	  left() {
	    if (this.cursor <= 0 || this.placeholder) return this.bell();
	    this.moveCursor(-1);
	    this.render();
	  }

	  right() {
	    if (this.cursor*this.scale >= this.rendered.length || this.placeholder) return this.bell();
	    this.moveCursor(1);
	    this.render();
	  }

	  isCursorAtStart() {
	    return this.cursor === 0 || (this.placeholder && this.cursor === 1);
	  }

	  isCursorAtEnd() {
	    return this.cursor === this.rendered.length || (this.placeholder && this.cursor === this.rendered.length + 1)
	  }

	  render() {
	    if (this.closed) return;
	    if (!this.firstRender) {
	      if (this.outputError)
	        this.out.write(cursor.down(lines(this.outputError, this.out.columns) - 1) + clear(this.outputError, this.out.columns));
	      this.out.write(clear(this.outputText, this.out.columns));
	    }
	    super.render();
	    this.outputError = '';

	    this.outputText = [
	      style.symbol(this.done, this.aborted),
	      color.bold(this.msg),
	      style.delimiter(this.done),
	      this.red ? color.red(this.rendered) : this.rendered
	    ].join(` `);

	    if (this.error) {
	      this.outputError += this.errorMsg.split(`\n`)
	          .reduce((a, l, i) => a + `\n${i ? ' ' : figures.pointerSmall} ${color.red().italic(l)}`, ``);
	    }

	    this.out.write(erase.line + cursor.to(0) + this.outputText + cursor.save + this.outputError + cursor.restore + cursor.move(this.cursorOffset, 0));
	  }
	}

	text = TextPrompt;
	return text;
}

var select;
var hasRequiredSelect;

function requireSelect () {
	if (hasRequiredSelect) return select;
	hasRequiredSelect = 1;

	const color = requireKleur();
	const Prompt = requirePrompt();
	const { style, clear, figures, wrap, entriesToDisplay } = requireUtil();
	const { cursor } = requireSrc();

	/**
	 * SelectPrompt Base Element
	 * @param {Object} opts Options
	 * @param {String} opts.message Message
	 * @param {Array} opts.choices Array of choice objects
	 * @param {String} [opts.hint] Hint to display
	 * @param {Number} [opts.initial] Index of default value
	 * @param {Stream} [opts.stdin] The Readable stream to listen to
	 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
	 * @param {Number} [opts.optionsPerPage=10] Max options to display at once
	 */
	class SelectPrompt extends Prompt {
	  constructor(opts={}) {
	    super(opts);
	    this.msg = opts.message;
	    this.hint = opts.hint || '- Use arrow-keys. Return to submit.';
	    this.warn = opts.warn || '- This option is disabled';
	    this.cursor = opts.initial || 0;
	    this.choices = opts.choices.map((ch, idx) => {
	      if (typeof ch === 'string')
	        ch = {title: ch, value: idx};
	      return {
	        title: ch && (ch.title || ch.value || ch),
	        value: ch && (ch.value === undefined ? idx : ch.value),
	        description: ch && ch.description,
	        selected: ch && ch.selected,
	        disabled: ch && ch.disabled
	      };
	    });
	    this.optionsPerPage = opts.optionsPerPage || 10;
	    this.value = (this.choices[this.cursor] || {}).value;
	    this.clear = clear('', this.out.columns);
	    this.render();
	  }

	  moveCursor(n) {
	    this.cursor = n;
	    this.value = this.choices[n].value;
	    this.fire();
	  }

	  reset() {
	    this.moveCursor(0);
	    this.fire();
	    this.render();
	  }

	  exit() {
	    this.abort();
	  }

	  abort() {
	    this.done = this.aborted = true;
	    this.fire();
	    this.render();
	    this.out.write('\n');
	    this.close();
	  }

	  submit() {
	    if (!this.selection.disabled) {
	      this.done = true;
	      this.aborted = false;
	      this.fire();
	      this.render();
	      this.out.write('\n');
	      this.close();
	    } else
	      this.bell();
	  }

	  first() {
	    this.moveCursor(0);
	    this.render();
	  }

	  last() {
	    this.moveCursor(this.choices.length - 1);
	    this.render();
	  }

	  up() {
	    if (this.cursor === 0) {
	      this.moveCursor(this.choices.length - 1);
	    } else {
	      this.moveCursor(this.cursor - 1);
	    }
	    this.render();
	  }

	  down() {
	    if (this.cursor === this.choices.length - 1) {
	      this.moveCursor(0);
	    } else {
	      this.moveCursor(this.cursor + 1);
	    }
	    this.render();
	  }

	  next() {
	    this.moveCursor((this.cursor + 1) % this.choices.length);
	    this.render();
	  }

	  _(c, key) {
	    if (c === ' ') return this.submit();
	  }

	  get selection() {
	    return this.choices[this.cursor];
	  }

	  render() {
	    if (this.closed) return;
	    if (this.firstRender) this.out.write(cursor.hide);
	    else this.out.write(clear(this.outputText, this.out.columns));
	    super.render();

	    let { startIndex, endIndex } = entriesToDisplay(this.cursor, this.choices.length, this.optionsPerPage);

	    // Print prompt
	    this.outputText = [
	      style.symbol(this.done, this.aborted),
	      color.bold(this.msg),
	      style.delimiter(false),
	      this.done ? this.selection.title : this.selection.disabled
	          ? color.yellow(this.warn) : color.gray(this.hint)
	    ].join(' ');

	    // Print choices
	    if (!this.done) {
	      this.outputText += '\n';
	      for (let i = startIndex; i < endIndex; i++) {
	        let title, prefix, desc = '', v = this.choices[i];

	        // Determine whether to display "more choices" indicators
	        if (i === startIndex && startIndex > 0) {
	          prefix = figures.arrowUp;
	        } else if (i === endIndex - 1 && endIndex < this.choices.length) {
	          prefix = figures.arrowDown;
	        } else {
	          prefix = ' ';
	        }

	        if (v.disabled) {
	          title = this.cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
	          prefix = (this.cursor === i ? color.bold().gray(figures.pointer) + ' ' : '  ') + prefix;
	        } else {
	          title = this.cursor === i ? color.cyan().underline(v.title) : v.title;
	          prefix = (this.cursor === i ? color.cyan(figures.pointer) + ' ' : '  ') + prefix;
	          if (v.description && this.cursor === i) {
	            desc = ` - ${v.description}`;
	            if (prefix.length + title.length + desc.length >= this.out.columns
	                || v.description.split(/\r?\n/).length > 1) {
	              desc = '\n' + wrap(v.description, { margin: 3, width: this.out.columns });
	            }
	          }
	        }

	        this.outputText += `${prefix} ${title}${color.gray(desc)}\n`;
	      }
	    }

	    this.out.write(this.outputText);
	  }
	}

	select = SelectPrompt;
	return select;
}

var toggle;
var hasRequiredToggle;

function requireToggle () {
	if (hasRequiredToggle) return toggle;
	hasRequiredToggle = 1;
	const color = requireKleur();
	const Prompt = requirePrompt();
	const { style, clear } = requireUtil();
	const { cursor, erase } = requireSrc();

	/**
	 * TogglePrompt Base Element
	 * @param {Object} opts Options
	 * @param {String} opts.message Message
	 * @param {Boolean} [opts.initial=false] Default value
	 * @param {String} [opts.active='no'] Active label
	 * @param {String} [opts.inactive='off'] Inactive label
	 * @param {Stream} [opts.stdin] The Readable stream to listen to
	 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
	 */
	class TogglePrompt extends Prompt {
	  constructor(opts={}) {
	    super(opts);
	    this.msg = opts.message;
	    this.value = !!opts.initial;
	    this.active = opts.active || 'on';
	    this.inactive = opts.inactive || 'off';
	    this.initialValue = this.value;
	    this.render();
	  }

	  reset() {
	    this.value = this.initialValue;
	    this.fire();
	    this.render();
	  }

	  exit() {
	    this.abort();
	  }

	  abort() {
	    this.done = this.aborted = true;
	    this.fire();
	    this.render();
	    this.out.write('\n');
	    this.close();
	  }

	  submit() {
	    this.done = true;
	    this.aborted = false;
	    this.fire();
	    this.render();
	    this.out.write('\n');
	    this.close();
	  }

	  deactivate() {
	    if (this.value === false) return this.bell();
	    this.value = false;
	    this.render();
	  }

	  activate() {
	    if (this.value === true) return this.bell();
	    this.value = true;
	    this.render();
	  }

	  delete() {
	    this.deactivate();
	  }
	  left() {
	    this.deactivate();
	  }
	  right() {
	    this.activate();
	  }
	  down() {
	    this.deactivate();
	  }
	  up() {
	    this.activate();
	  }

	  next() {
	    this.value = !this.value;
	    this.fire();
	    this.render();
	  }

	  _(c, key) {
	    if (c === ' ') {
	      this.value = !this.value;
	    } else if (c === '1') {
	      this.value = true;
	    } else if (c === '0') {
	      this.value = false;
	    } else return this.bell();
	    this.render();
	  }

	  render() {
	    if (this.closed) return;
	    if (this.firstRender) this.out.write(cursor.hide);
	    else this.out.write(clear(this.outputText, this.out.columns));
	    super.render();

	    this.outputText = [
	      style.symbol(this.done, this.aborted),
	      color.bold(this.msg),
	      style.delimiter(this.done),
	      this.value ? this.inactive : color.cyan().underline(this.inactive),
	      color.gray('/'),
	      this.value ? color.cyan().underline(this.active) : this.active
	    ].join(' ');

	    this.out.write(erase.line + cursor.to(0) + this.outputText);
	  }
	}

	toggle = TogglePrompt;
	return toggle;
}

var datepart;
var hasRequiredDatepart;

function requireDatepart () {
	if (hasRequiredDatepart) return datepart;
	hasRequiredDatepart = 1;

	class DatePart {
	  constructor({token, date, parts, locales}) {
	    this.token = token;
	    this.date = date || new Date();
	    this.parts = parts || [this];
	    this.locales = locales || {};
	  }

	  up() {}

	  down() {}

	  next() {
	    const currentIdx = this.parts.indexOf(this);
	    return this.parts.find((part, idx) => idx > currentIdx && part instanceof DatePart);
	  }

	  setTo(val) {}

	  prev() {
	    let parts = [].concat(this.parts).reverse();
	    const currentIdx = parts.indexOf(this);
	    return parts.find((part, idx) => idx > currentIdx && part instanceof DatePart);
	  }

	  toString() {
	    return String(this.date);
	  }
	}

	datepart = DatePart;
	return datepart;
}

var meridiem;
var hasRequiredMeridiem;

function requireMeridiem () {
	if (hasRequiredMeridiem) return meridiem;
	hasRequiredMeridiem = 1;

	const DatePart = requireDatepart();

	class Meridiem extends DatePart {
	  constructor(opts={}) {
	    super(opts);
	  }

	  up() {
	    this.date.setHours((this.date.getHours() + 12) % 24);
	  }

	  down() {
	    this.up();
	  }

	  toString() {
	    let meridiem = this.date.getHours() > 12 ? 'pm' : 'am';
	    return /\A/.test(this.token) ? meridiem.toUpperCase() : meridiem;
	  }
	}

	meridiem = Meridiem;
	return meridiem;
}

var day;
var hasRequiredDay;

function requireDay () {
	if (hasRequiredDay) return day;
	hasRequiredDay = 1;

	const DatePart = requireDatepart();

	const pos = n => {
	  n = n % 10;
	  return n === 1 ? 'st'
	       : n === 2 ? 'nd'
	       : n === 3 ? 'rd'
	       : 'th';
	};

	class Day extends DatePart {
	  constructor(opts={}) {
	    super(opts);
	  }

	  up() {
	    this.date.setDate(this.date.getDate() + 1);
	  }

	  down() {
	    this.date.setDate(this.date.getDate() - 1);
	  }

	  setTo(val) {
	    this.date.setDate(parseInt(val.substr(-2)));
	  }

	  toString() {
	    let date = this.date.getDate();
	    let day = this.date.getDay();
	    return this.token === 'DD' ? String(date).padStart(2, '0')
	         : this.token === 'Do' ? date + pos(date)
	         : this.token === 'd' ? day + 1
	         : this.token === 'ddd' ? this.locales.weekdaysShort[day]
	         : this.token === 'dddd' ? this.locales.weekdays[day]
	         : date;
	  }
	}

	day = Day;
	return day;
}

var hours;
var hasRequiredHours;

function requireHours () {
	if (hasRequiredHours) return hours;
	hasRequiredHours = 1;

	const DatePart = requireDatepart();

	class Hours extends DatePart {
	  constructor(opts={}) {
	    super(opts);
	  }

	  up() {
	    this.date.setHours(this.date.getHours() + 1);
	  }

	  down() {
	    this.date.setHours(this.date.getHours() - 1);
	  }

	  setTo(val) {
	    this.date.setHours(parseInt(val.substr(-2)));
	  }

	  toString() {
	    let hours = this.date.getHours();
	    if (/h/.test(this.token))
	      hours = (hours % 12) || 12;
	    return this.token.length > 1 ? String(hours).padStart(2, '0') : hours;
	  }
	}

	hours = Hours;
	return hours;
}

var milliseconds;
var hasRequiredMilliseconds;

function requireMilliseconds () {
	if (hasRequiredMilliseconds) return milliseconds;
	hasRequiredMilliseconds = 1;

	const DatePart = requireDatepart();

	class Milliseconds extends DatePart {
	  constructor(opts={}) {
	    super(opts);
	  }

	  up() {
	    this.date.setMilliseconds(this.date.getMilliseconds() + 1);
	  }

	  down() {
	    this.date.setMilliseconds(this.date.getMilliseconds() - 1);
	  }

	  setTo(val) {
	    this.date.setMilliseconds(parseInt(val.substr(-(this.token.length))));
	  }

	  toString() {
	    return String(this.date.getMilliseconds()).padStart(4, '0')
	                                              .substr(0, this.token.length);
	  }
	}

	milliseconds = Milliseconds;
	return milliseconds;
}

var minutes;
var hasRequiredMinutes;

function requireMinutes () {
	if (hasRequiredMinutes) return minutes;
	hasRequiredMinutes = 1;

	const DatePart = requireDatepart();

	class Minutes extends DatePart {
	  constructor(opts={}) {
	    super(opts);
	  }

	  up() {
	    this.date.setMinutes(this.date.getMinutes() + 1);
	  }

	  down() {
	    this.date.setMinutes(this.date.getMinutes() - 1);
	  }

	  setTo(val) {
	    this.date.setMinutes(parseInt(val.substr(-2)));
	  }

	  toString() {
	    let m = this.date.getMinutes();
	    return this.token.length > 1 ? String(m).padStart(2, '0') : m;
	  }
	}

	minutes = Minutes;
	return minutes;
}

var month;
var hasRequiredMonth;

function requireMonth () {
	if (hasRequiredMonth) return month;
	hasRequiredMonth = 1;

	const DatePart = requireDatepart();

	class Month extends DatePart {
	  constructor(opts={}) {
	    super(opts);
	  }

	  up() {
	    this.date.setMonth(this.date.getMonth() + 1);
	  }

	  down() {
	    this.date.setMonth(this.date.getMonth() - 1);
	  }

	  setTo(val) {
	    val = parseInt(val.substr(-2)) - 1;
	    this.date.setMonth(val < 0 ? 0 : val);
	  }

	  toString() {
	    let month = this.date.getMonth();
	    let tl = this.token.length;
	    return tl === 2 ? String(month + 1).padStart(2, '0')
	           : tl === 3 ? this.locales.monthsShort[month]
	             : tl === 4 ? this.locales.months[month]
	               : String(month + 1);
	  }
	}

	month = Month;
	return month;
}

var seconds;
var hasRequiredSeconds;

function requireSeconds () {
	if (hasRequiredSeconds) return seconds;
	hasRequiredSeconds = 1;

	const DatePart = requireDatepart();

	class Seconds extends DatePart {
	  constructor(opts={}) {
	    super(opts);
	  }

	  up() {
	    this.date.setSeconds(this.date.getSeconds() + 1);
	  }

	  down() {
	    this.date.setSeconds(this.date.getSeconds() - 1);
	  }

	  setTo(val) {
	    this.date.setSeconds(parseInt(val.substr(-2)));
	  }

	  toString() {
	    let s = this.date.getSeconds();
	    return this.token.length > 1 ? String(s).padStart(2, '0') : s;
	  }
	}

	seconds = Seconds;
	return seconds;
}

var year;
var hasRequiredYear;

function requireYear () {
	if (hasRequiredYear) return year;
	hasRequiredYear = 1;

	const DatePart = requireDatepart();

	class Year extends DatePart {
	  constructor(opts={}) {
	    super(opts);
	  }

	  up() {
	    this.date.setFullYear(this.date.getFullYear() + 1);
	  }

	  down() {
	    this.date.setFullYear(this.date.getFullYear() - 1);
	  }

	  setTo(val) {
	    this.date.setFullYear(val.substr(-4));
	  }

	  toString() {
	    let year = String(this.date.getFullYear()).padStart(4, '0');
	    return this.token.length === 2 ? year.substr(-2) : year;
	  }
	}

	year = Year;
	return year;
}

var dateparts;
var hasRequiredDateparts;

function requireDateparts () {
	if (hasRequiredDateparts) return dateparts;
	hasRequiredDateparts = 1;

	dateparts = {
	  DatePart: requireDatepart(),
	  Meridiem: requireMeridiem(),
	  Day: requireDay(),
	  Hours: requireHours(),
	  Milliseconds: requireMilliseconds(),
	  Minutes: requireMinutes(),
	  Month: requireMonth(),
	  Seconds: requireSeconds(),
	  Year: requireYear(),
	};
	return dateparts;
}

var date;
var hasRequiredDate;

function requireDate () {
	if (hasRequiredDate) return date;
	hasRequiredDate = 1;

	const color = requireKleur();
	const Prompt = requirePrompt();
	const { style, clear, figures } = requireUtil();
	const { erase, cursor } = requireSrc();
	const { DatePart, Meridiem, Day, Hours, Milliseconds, Minutes, Month, Seconds, Year } = requireDateparts();

	const regex = /\\(.)|"((?:\\["\\]|[^"])+)"|(D[Do]?|d{3,4}|d)|(M{1,4})|(YY(?:YY)?)|([aA])|([Hh]{1,2})|(m{1,2})|(s{1,2})|(S{1,4})|./g;
	const regexGroups = {
	  1: ({token}) => token.replace(/\\(.)/g, '$1'),
	  2: (opts) => new Day(opts), // Day // TODO
	  3: (opts) => new Month(opts), // Month
	  4: (opts) => new Year(opts), // Year
	  5: (opts) => new Meridiem(opts), // AM/PM // TODO (special)
	  6: (opts) => new Hours(opts), // Hours
	  7: (opts) => new Minutes(opts), // Minutes
	  8: (opts) => new Seconds(opts), // Seconds
	  9: (opts) => new Milliseconds(opts), // Fractional seconds
	};

	const dfltLocales = {
	  months: 'January,February,March,April,May,June,July,August,September,October,November,December'.split(','),
	  monthsShort: 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec'.split(','),
	  weekdays: 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'.split(','),
	  weekdaysShort: 'Sun,Mon,Tue,Wed,Thu,Fri,Sat'.split(',')
	};


	/**
	 * DatePrompt Base Element
	 * @param {Object} opts Options
	 * @param {String} opts.message Message
	 * @param {Number} [opts.initial] Index of default value
	 * @param {String} [opts.mask] The format mask
	 * @param {object} [opts.locales] The date locales
	 * @param {String} [opts.error] The error message shown on invalid value
	 * @param {Function} [opts.validate] Function to validate the submitted value
	 * @param {Stream} [opts.stdin] The Readable stream to listen to
	 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
	 */
	class DatePrompt extends Prompt {
	  constructor(opts={}) {
	    super(opts);
	    this.msg = opts.message;
	    this.cursor = 0;
	    this.typed = '';
	    this.locales = Object.assign(dfltLocales, opts.locales);
	    this._date = opts.initial || new Date();
	    this.errorMsg = opts.error || 'Please Enter A Valid Value';
	    this.validator = opts.validate || (() => true);
	    this.mask = opts.mask || 'YYYY-MM-DD HH:mm:ss';
	    this.clear = clear('', this.out.columns);
	    this.render();
	  }

	  get value() {
	    return this.date
	  }

	  get date() {
	    return this._date;
	  }

	  set date(date) {
	    if (date) this._date.setTime(date.getTime());
	  }

	  set mask(mask) {
	    let result;
	    this.parts = [];
	    while(result = regex.exec(mask)) {
	      let match = result.shift();
	      let idx = result.findIndex(gr => gr != null);
	      this.parts.push(idx in regexGroups
	        ? regexGroups[idx]({ token: result[idx] || match, date: this.date, parts: this.parts, locales: this.locales })
	        : result[idx] || match);
	    }

	    let parts = this.parts.reduce((arr, i) => {
	      if (typeof i === 'string' && typeof arr[arr.length - 1] === 'string')
	        arr[arr.length - 1] += i;
	      else arr.push(i);
	      return arr;
	    }, []);

	    this.parts.splice(0);
	    this.parts.push(...parts);
	    this.reset();
	  }

	  moveCursor(n) {
	    this.typed = '';
	    this.cursor = n;
	    this.fire();
	  }

	  reset() {
	    this.moveCursor(this.parts.findIndex(p => p instanceof DatePart));
	    this.fire();
	    this.render();
	  }

	  exit() {
	    this.abort();
	  }

	  abort() {
	    this.done = this.aborted = true;
	    this.error = false;
	    this.fire();
	    this.render();
	    this.out.write('\n');
	    this.close();
	  }

	  async validate() {
	    let valid = await this.validator(this.value);
	    if (typeof valid === 'string') {
	      this.errorMsg = valid;
	      valid = false;
	    }
	    this.error = !valid;
	  }

	  async submit() {
	    await this.validate();
	    if (this.error) {
	      this.color = 'red';
	      this.fire();
	      this.render();
	      return;
	    }
	    this.done = true;
	    this.aborted = false;
	    this.fire();
	    this.render();
	    this.out.write('\n');
	    this.close();
	  }

	  up() {
	    this.typed = '';
	    this.parts[this.cursor].up();
	    this.render();
	  }

	  down() {
	    this.typed = '';
	    this.parts[this.cursor].down();
	    this.render();
	  }

	  left() {
	    let prev = this.parts[this.cursor].prev();
	    if (prev == null) return this.bell();
	    this.moveCursor(this.parts.indexOf(prev));
	    this.render();
	  }

	  right() {
	    let next = this.parts[this.cursor].next();
	    if (next == null) return this.bell();
	    this.moveCursor(this.parts.indexOf(next));
	    this.render();
	  }

	  next() {
	    let next = this.parts[this.cursor].next();
	    this.moveCursor(next
	      ? this.parts.indexOf(next)
	      : this.parts.findIndex((part) => part instanceof DatePart));
	    this.render();
	  }

	  _(c) {
	    if (/\d/.test(c)) {
	      this.typed += c;
	      this.parts[this.cursor].setTo(this.typed);
	      this.render();
	    }
	  }

	  render() {
	    if (this.closed) return;
	    if (this.firstRender) this.out.write(cursor.hide);
	    else this.out.write(clear(this.outputText, this.out.columns));
	    super.render();

	    // Print prompt
	    this.outputText = [
	      style.symbol(this.done, this.aborted),
	      color.bold(this.msg),
	      style.delimiter(false),
	      this.parts.reduce((arr, p, idx) => arr.concat(idx === this.cursor && !this.done ? color.cyan().underline(p.toString()) : p), [])
	          .join('')
	    ].join(' ');

	    // Print error
	    if (this.error) {
	      this.outputText += this.errorMsg.split('\n').reduce(
	          (a, l, i) => a + `\n${i ? ` ` : figures.pointerSmall} ${color.red().italic(l)}`, ``);
	    }

	    this.out.write(erase.line + cursor.to(0) + this.outputText);
	  }
	}

	date = DatePrompt;
	return date;
}

var number;
var hasRequiredNumber;

function requireNumber () {
	if (hasRequiredNumber) return number;
	hasRequiredNumber = 1;
	const color = requireKleur();
	const Prompt = requirePrompt();
	const { cursor, erase } = requireSrc();
	const { style, figures, clear, lines } = requireUtil();

	const isNumber = /[0-9]/;
	const isDef = any => any !== undefined;
	const round = (number, precision) => {
	  let factor = Math.pow(10, precision);
	  return Math.round(number * factor) / factor;
	};

	/**
	 * NumberPrompt Base Element
	 * @param {Object} opts Options
	 * @param {String} opts.message Message
	 * @param {String} [opts.style='default'] Render style
	 * @param {Number} [opts.initial] Default value
	 * @param {Number} [opts.max=+Infinity] Max value
	 * @param {Number} [opts.min=-Infinity] Min value
	 * @param {Boolean} [opts.float=false] Parse input as floats
	 * @param {Number} [opts.round=2] Round floats to x decimals
	 * @param {Number} [opts.increment=1] Number to increment by when using arrow-keys
	 * @param {Function} [opts.validate] Validate function
	 * @param {Stream} [opts.stdin] The Readable stream to listen to
	 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
	 * @param {String} [opts.error] The invalid error label
	 */
	class NumberPrompt extends Prompt {
	  constructor(opts={}) {
	    super(opts);
	    this.transform = style.render(opts.style);
	    this.msg = opts.message;
	    this.initial = isDef(opts.initial) ? opts.initial : '';
	    this.float = !!opts.float;
	    this.round = opts.round || 2;
	    this.inc = opts.increment || 1;
	    this.min = isDef(opts.min) ? opts.min : -Infinity;
	    this.max = isDef(opts.max) ? opts.max : Infinity;
	    this.errorMsg = opts.error || `Please Enter A Valid Value`;
	    this.validator = opts.validate || (() => true);
	    this.color = `cyan`;
	    this.value = ``;
	    this.typed = ``;
	    this.lastHit = 0;
	    this.render();
	  }

	  set value(v) {
	    if (!v && v !== 0) {
	      this.placeholder = true;
	      this.rendered = color.gray(this.transform.render(`${this.initial}`));
	      this._value = ``;
	    } else {
	      this.placeholder = false;
	      this.rendered = this.transform.render(`${round(v, this.round)}`);
	      this._value = round(v, this.round);
	    }
	    this.fire();
	  }

	  get value() {
	    return this._value;
	  }

	  parse(x) {
	    return this.float ? parseFloat(x) : parseInt(x);
	  }

	  valid(c) {
	    return c === `-` || c === `.` && this.float || isNumber.test(c)
	  }

	  reset() {
	    this.typed = ``;
	    this.value = ``;
	    this.fire();
	    this.render();
	  }

	  exit() {
	    this.abort();
	  }

	  abort() {
	    let x = this.value;
	    this.value = x !== `` ? x : this.initial;
	    this.done = this.aborted = true;
	    this.error = false;
	    this.fire();
	    this.render();
	    this.out.write(`\n`);
	    this.close();
	  }

	  async validate() {
	    let valid = await this.validator(this.value);
	    if (typeof valid === `string`) {
	      this.errorMsg = valid;
	      valid = false;
	    }
	    this.error = !valid;
	  }

	  async submit() {
	    await this.validate();
	    if (this.error) {
	      this.color = `red`;
	      this.fire();
	      this.render();
	      return;
	    }
	    let x = this.value;
	    this.value = x !== `` ? x : this.initial;
	    this.done = true;
	    this.aborted = false;
	    this.error = false;
	    this.fire();
	    this.render();
	    this.out.write(`\n`);
	    this.close();
	  }

	  up() {
	    this.typed = ``;
	    if(this.value === '') {
	      this.value = this.min - this.inc;
	    }
	    if (this.value >= this.max) return this.bell();
	    this.value += this.inc;
	    this.color = `cyan`;
	    this.fire();
	    this.render();
	  }

	  down() {
	    this.typed = ``;
	    if(this.value === '') {
	      this.value = this.min + this.inc;
	    }
	    if (this.value <= this.min) return this.bell();
	    this.value -= this.inc;
	    this.color = `cyan`;
	    this.fire();
	    this.render();
	  }

	  delete() {
	    let val = this.value.toString();
	    if (val.length === 0) return this.bell();
	    this.value = this.parse((val = val.slice(0, -1))) || ``;
	    if (this.value !== '' && this.value < this.min) {
	      this.value = this.min;
	    }
	    this.color = `cyan`;
	    this.fire();
	    this.render();
	  }

	  next() {
	    this.value = this.initial;
	    this.fire();
	    this.render();
	  }

	  _(c, key) {
	    if (!this.valid(c)) return this.bell();

	    const now = Date.now();
	    if (now - this.lastHit > 1000) this.typed = ``; // 1s elapsed
	    this.typed += c;
	    this.lastHit = now;
	    this.color = `cyan`;

	    if (c === `.`) return this.fire();

	    this.value = Math.min(this.parse(this.typed), this.max);
	    if (this.value > this.max) this.value = this.max;
	    if (this.value < this.min) this.value = this.min;
	    this.fire();
	    this.render();
	  }

	  render() {
	    if (this.closed) return;
	    if (!this.firstRender) {
	      if (this.outputError)
	        this.out.write(cursor.down(lines(this.outputError, this.out.columns) - 1) + clear(this.outputError, this.out.columns));
	      this.out.write(clear(this.outputText, this.out.columns));
	    }
	    super.render();
	    this.outputError = '';

	    // Print prompt
	    this.outputText = [
	      style.symbol(this.done, this.aborted),
	      color.bold(this.msg),
	      style.delimiter(this.done),
	      !this.done || (!this.done && !this.placeholder)
	          ? color[this.color]().underline(this.rendered) : this.rendered
	    ].join(` `);

	    // Print error
	    if (this.error) {
	      this.outputError += this.errorMsg.split(`\n`)
	          .reduce((a, l, i) => a + `\n${i ? ` ` : figures.pointerSmall} ${color.red().italic(l)}`, ``);
	    }

	    this.out.write(erase.line + cursor.to(0) + this.outputText + cursor.save + this.outputError + cursor.restore);
	  }
	}

	number = NumberPrompt;
	return number;
}

var multiselect;
var hasRequiredMultiselect;

function requireMultiselect () {
	if (hasRequiredMultiselect) return multiselect;
	hasRequiredMultiselect = 1;

	const color = requireKleur();
	const { cursor } = requireSrc();
	const Prompt = requirePrompt();
	const { clear, figures, style, wrap, entriesToDisplay } = requireUtil();

	/**
	 * MultiselectPrompt Base Element
	 * @param {Object} opts Options
	 * @param {String} opts.message Message
	 * @param {Array} opts.choices Array of choice objects
	 * @param {String} [opts.hint] Hint to display
	 * @param {String} [opts.warn] Hint shown for disabled choices
	 * @param {Number} [opts.max] Max choices
	 * @param {Number} [opts.cursor=0] Cursor start position
	 * @param {Number} [opts.optionsPerPage=10] Max options to display at once
	 * @param {Stream} [opts.stdin] The Readable stream to listen to
	 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
	 */
	class MultiselectPrompt extends Prompt {
	  constructor(opts={}) {
	    super(opts);
	    this.msg = opts.message;
	    this.cursor = opts.cursor || 0;
	    this.scrollIndex = opts.cursor || 0;
	    this.hint = opts.hint || '';
	    this.warn = opts.warn || '- This option is disabled -';
	    this.minSelected = opts.min;
	    this.showMinError = false;
	    this.maxChoices = opts.max;
	    this.instructions = opts.instructions;
	    this.optionsPerPage = opts.optionsPerPage || 10;
	    this.value = opts.choices.map((ch, idx) => {
	      if (typeof ch === 'string')
	        ch = {title: ch, value: idx};
	      return {
	        title: ch && (ch.title || ch.value || ch),
	        description: ch && ch.description,
	        value: ch && (ch.value === undefined ? idx : ch.value),
	        selected: ch && ch.selected,
	        disabled: ch && ch.disabled
	      };
	    });
	    this.clear = clear('', this.out.columns);
	    if (!opts.overrideRender) {
	      this.render();
	    }
	  }

	  reset() {
	    this.value.map(v => !v.selected);
	    this.cursor = 0;
	    this.fire();
	    this.render();
	  }

	  selected() {
	    return this.value.filter(v => v.selected);
	  }

	  exit() {
	    this.abort();
	  }

	  abort() {
	    this.done = this.aborted = true;
	    this.fire();
	    this.render();
	    this.out.write('\n');
	    this.close();
	  }

	  submit() {
	    const selected = this.value
	      .filter(e => e.selected);
	    if (this.minSelected && selected.length < this.minSelected) {
	      this.showMinError = true;
	      this.render();
	    } else {
	      this.done = true;
	      this.aborted = false;
	      this.fire();
	      this.render();
	      this.out.write('\n');
	      this.close();
	    }
	  }

	  first() {
	    this.cursor = 0;
	    this.render();
	  }

	  last() {
	    this.cursor = this.value.length - 1;
	    this.render();
	  }
	  next() {
	    this.cursor = (this.cursor + 1) % this.value.length;
	    this.render();
	  }

	  up() {
	    if (this.cursor === 0) {
	      this.cursor = this.value.length - 1;
	    } else {
	      this.cursor--;
	    }
	    this.render();
	  }

	  down() {
	    if (this.cursor === this.value.length - 1) {
	      this.cursor = 0;
	    } else {
	      this.cursor++;
	    }
	    this.render();
	  }

	  left() {
	    this.value[this.cursor].selected = false;
	    this.render();
	  }

	  right() {
	    if (this.value.filter(e => e.selected).length >= this.maxChoices) return this.bell();
	    this.value[this.cursor].selected = true;
	    this.render();
	  }

	  handleSpaceToggle() {
	    const v = this.value[this.cursor];

	    if (v.selected) {
	      v.selected = false;
	      this.render();
	    } else if (v.disabled || this.value.filter(e => e.selected).length >= this.maxChoices) {
	      return this.bell();
	    } else {
	      v.selected = true;
	      this.render();
	    }
	  }

	  toggleAll() {
	    if (this.maxChoices !== undefined || this.value[this.cursor].disabled) {
	      return this.bell();
	    }

	    const newSelected = !this.value[this.cursor].selected;
	    this.value.filter(v => !v.disabled).forEach(v => v.selected = newSelected);
	    this.render();
	  }

	  _(c, key) {
	    if (c === ' ') {
	      this.handleSpaceToggle();
	    } else if (c === 'a') {
	      this.toggleAll();
	    } else {
	      return this.bell();
	    }
	  }

	  renderInstructions() {
	    if (this.instructions === undefined || this.instructions) {
	      if (typeof this.instructions === 'string') {
	        return this.instructions;
	      }
	      return '\nInstructions:\n'
	        + `    ${figures.arrowUp}/${figures.arrowDown}: Highlight option\n`
	        + `    ${figures.arrowLeft}/${figures.arrowRight}/[space]: Toggle selection\n`
	        + (this.maxChoices === undefined ? `    a: Toggle all\n` : '')
	        + `    enter/return: Complete answer`;
	    }
	    return '';
	  }

	  renderOption(cursor, v, i, arrowIndicator) {
	    const prefix = (v.selected ? color.green(figures.radioOn) : figures.radioOff) + ' ' + arrowIndicator + ' ';
	    let title, desc;

	    if (v.disabled) {
	      title = cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
	    } else {
	      title = cursor === i ? color.cyan().underline(v.title) : v.title;
	      if (cursor === i && v.description) {
	        desc = ` - ${v.description}`;
	        if (prefix.length + title.length + desc.length >= this.out.columns
	          || v.description.split(/\r?\n/).length > 1) {
	          desc = '\n' + wrap(v.description, { margin: prefix.length, width: this.out.columns });
	        }
	      }
	    }

	    return prefix + title + color.gray(desc || '');
	  }

	  // shared with autocompleteMultiselect
	  paginateOptions(options) {
	    if (options.length === 0) {
	      return color.red('No matches for this query.');
	    }

	    let { startIndex, endIndex } = entriesToDisplay(this.cursor, options.length, this.optionsPerPage);
	    let prefix, styledOptions = [];

	    for (let i = startIndex; i < endIndex; i++) {
	      if (i === startIndex && startIndex > 0) {
	        prefix = figures.arrowUp;
	      } else if (i === endIndex - 1 && endIndex < options.length) {
	        prefix = figures.arrowDown;
	      } else {
	        prefix = ' ';
	      }
	      styledOptions.push(this.renderOption(this.cursor, options[i], i, prefix));
	    }

	    return '\n' + styledOptions.join('\n');
	  }

	  // shared with autocomleteMultiselect
	  renderOptions(options) {
	    if (!this.done) {
	      return this.paginateOptions(options);
	    }
	    return '';
	  }

	  renderDoneOrInstructions() {
	    if (this.done) {
	      return this.value
	        .filter(e => e.selected)
	        .map(v => v.title)
	        .join(', ');
	    }

	    const output = [color.gray(this.hint), this.renderInstructions()];

	    if (this.value[this.cursor].disabled) {
	      output.push(color.yellow(this.warn));
	    }
	    return output.join(' ');
	  }

	  render() {
	    if (this.closed) return;
	    if (this.firstRender) this.out.write(cursor.hide);
	    super.render();

	    // print prompt
	    let prompt = [
	      style.symbol(this.done, this.aborted),
	      color.bold(this.msg),
	      style.delimiter(false),
	      this.renderDoneOrInstructions()
	    ].join(' ');
	    if (this.showMinError) {
	      prompt += color.red(`You must select a minimum of ${this.minSelected} choices.`);
	      this.showMinError = false;
	    }
	    prompt += this.renderOptions(this.value);

	    this.out.write(this.clear + prompt);
	    this.clear = clear(prompt, this.out.columns);
	  }
	}

	multiselect = MultiselectPrompt;
	return multiselect;
}

var autocomplete;
var hasRequiredAutocomplete;

function requireAutocomplete () {
	if (hasRequiredAutocomplete) return autocomplete;
	hasRequiredAutocomplete = 1;

	const color = requireKleur();
	const Prompt = requirePrompt();
	const { erase, cursor } = requireSrc();
	const { style, clear, figures, wrap, entriesToDisplay } = requireUtil();

	const getVal = (arr, i) => arr[i] && (arr[i].value || arr[i].title || arr[i]);
	const getTitle = (arr, i) => arr[i] && (arr[i].title || arr[i].value || arr[i]);
	const getIndex = (arr, valOrTitle) => {
	  const index = arr.findIndex(el => el.value === valOrTitle || el.title === valOrTitle);
	  return index > -1 ? index : undefined;
	};

	/**
	 * TextPrompt Base Element
	 * @param {Object} opts Options
	 * @param {String} opts.message Message
	 * @param {Array} opts.choices Array of auto-complete choices objects
	 * @param {Function} [opts.suggest] Filter function. Defaults to sort by title
	 * @param {Number} [opts.limit=10] Max number of results to show
	 * @param {Number} [opts.cursor=0] Cursor start position
	 * @param {String} [opts.style='default'] Render style
	 * @param {String} [opts.fallback] Fallback message - initial to default value
	 * @param {String} [opts.initial] Index of the default value
	 * @param {Boolean} [opts.clearFirst] The first ESCAPE keypress will clear the input
	 * @param {Stream} [opts.stdin] The Readable stream to listen to
	 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
	 * @param {String} [opts.noMatches] The no matches found label
	 */
	class AutocompletePrompt extends Prompt {
	  constructor(opts={}) {
	    super(opts);
	    this.msg = opts.message;
	    this.suggest = opts.suggest;
	    this.choices = opts.choices;
	    this.initial = typeof opts.initial === 'number'
	      ? opts.initial
	      : getIndex(opts.choices, opts.initial);
	    this.select = this.initial || opts.cursor || 0;
	    this.i18n = { noMatches: opts.noMatches || 'no matches found' };
	    this.fallback = opts.fallback || this.initial;
	    this.clearFirst = opts.clearFirst || false;
	    this.suggestions = [];
	    this.input = '';
	    this.limit = opts.limit || 10;
	    this.cursor = 0;
	    this.transform = style.render(opts.style);
	    this.scale = this.transform.scale;
	    this.render = this.render.bind(this);
	    this.complete = this.complete.bind(this);
	    this.clear = clear('', this.out.columns);
	    this.complete(this.render);
	    this.render();
	  }

	  set fallback(fb) {
	    this._fb = Number.isSafeInteger(parseInt(fb)) ? parseInt(fb) : fb;
	  }

	  get fallback() {
	    let choice;
	    if (typeof this._fb === 'number')
	      choice = this.choices[this._fb];
	    else if (typeof this._fb === 'string')
	      choice = { title: this._fb };
	    return choice || this._fb || { title: this.i18n.noMatches };
	  }

	  moveSelect(i) {
	    this.select = i;
	    if (this.suggestions.length > 0)
	      this.value = getVal(this.suggestions, i);
	    else this.value = this.fallback.value;
	    this.fire();
	  }

	  async complete(cb) {
	    const p = (this.completing = this.suggest(this.input, this.choices));
	    const suggestions = await p;

	    if (this.completing !== p) return;
	    this.suggestions = suggestions
	      .map((s, i, arr) => ({ title: getTitle(arr, i), value: getVal(arr, i), description: s.description }));
	    this.completing = false;
	    const l = Math.max(suggestions.length - 1, 0);
	    this.moveSelect(Math.min(l, this.select));

	    cb && cb();
	  }

	  reset() {
	    this.input = '';
	    this.complete(() => {
	      this.moveSelect(this.initial !== void 0 ? this.initial : 0);
	      this.render();
	    });
	    this.render();
	  }

	  exit() {
	    if (this.clearFirst && this.input.length > 0) {
	      this.reset();
	    } else {
	      this.done = this.exited = true; 
	      this.aborted = false;
	      this.fire();
	      this.render();
	      this.out.write('\n');
	      this.close();
	    }
	  }

	  abort() {
	    this.done = this.aborted = true;
	    this.exited = false;
	    this.fire();
	    this.render();
	    this.out.write('\n');
	    this.close();
	  }

	  submit() {
	    this.done = true;
	    this.aborted = this.exited = false;
	    this.fire();
	    this.render();
	    this.out.write('\n');
	    this.close();
	  }

	  _(c, key) {
	    let s1 = this.input.slice(0, this.cursor);
	    let s2 = this.input.slice(this.cursor);
	    this.input = `${s1}${c}${s2}`;
	    this.cursor = s1.length+1;
	    this.complete(this.render);
	    this.render();
	  }

	  delete() {
	    if (this.cursor === 0) return this.bell();
	    let s1 = this.input.slice(0, this.cursor-1);
	    let s2 = this.input.slice(this.cursor);
	    this.input = `${s1}${s2}`;
	    this.complete(this.render);
	    this.cursor = this.cursor-1;
	    this.render();
	  }

	  deleteForward() {
	    if(this.cursor*this.scale >= this.rendered.length) return this.bell();
	    let s1 = this.input.slice(0, this.cursor);
	    let s2 = this.input.slice(this.cursor+1);
	    this.input = `${s1}${s2}`;
	    this.complete(this.render);
	    this.render();
	  }

	  first() {
	    this.moveSelect(0);
	    this.render();
	  }

	  last() {
	    this.moveSelect(this.suggestions.length - 1);
	    this.render();
	  }

	  up() {
	    if (this.select === 0) {
	      this.moveSelect(this.suggestions.length - 1);
	    } else {
	      this.moveSelect(this.select - 1);
	    }
	    this.render();
	  }

	  down() {
	    if (this.select === this.suggestions.length - 1) {
	      this.moveSelect(0);
	    } else {
	      this.moveSelect(this.select + 1);
	    }
	    this.render();
	  }

	  next() {
	    if (this.select === this.suggestions.length - 1) {
	      this.moveSelect(0);
	    } else this.moveSelect(this.select + 1);
	    this.render();
	  }

	  nextPage() {
	    this.moveSelect(Math.min(this.select + this.limit, this.suggestions.length - 1));
	    this.render();
	  }

	  prevPage() {
	    this.moveSelect(Math.max(this.select - this.limit, 0));
	    this.render();
	  }

	  left() {
	    if (this.cursor <= 0) return this.bell();
	    this.cursor = this.cursor-1;
	    this.render();
	  }

	  right() {
	    if (this.cursor*this.scale >= this.rendered.length) return this.bell();
	    this.cursor = this.cursor+1;
	    this.render();
	  }

	  renderOption(v, hovered, isStart, isEnd) {
	    let desc;
	    let prefix = isStart ? figures.arrowUp : isEnd ? figures.arrowDown : ' ';
	    let title = hovered ? color.cyan().underline(v.title) : v.title;
	    prefix = (hovered ? color.cyan(figures.pointer) + ' ' : '  ') + prefix;
	    if (v.description) {
	      desc = ` - ${v.description}`;
	      if (prefix.length + title.length + desc.length >= this.out.columns
	        || v.description.split(/\r?\n/).length > 1) {
	        desc = '\n' + wrap(v.description, { margin: 3, width: this.out.columns });
	      }
	    }
	    return prefix + ' ' + title + color.gray(desc || '');
	  }

	  render() {
	    if (this.closed) return;
	    if (this.firstRender) this.out.write(cursor.hide);
	    else this.out.write(clear(this.outputText, this.out.columns));
	    super.render();

	    let { startIndex, endIndex } = entriesToDisplay(this.select, this.choices.length, this.limit);

	    this.outputText = [
	      style.symbol(this.done, this.aborted, this.exited),
	      color.bold(this.msg),
	      style.delimiter(this.completing),
	      this.done && this.suggestions[this.select]
	        ? this.suggestions[this.select].title
	        : this.rendered = this.transform.render(this.input)
	    ].join(' ');

	    if (!this.done) {
	      const suggestions = this.suggestions
	        .slice(startIndex, endIndex)
	        .map((item, i) =>  this.renderOption(item,
	          this.select === i + startIndex,
	          i === 0 && startIndex > 0,
	          i + startIndex === endIndex - 1 && endIndex < this.choices.length))
	        .join('\n');
	      this.outputText += `\n` + (suggestions || color.gray(this.fallback.title));
	    }

	    this.out.write(erase.line + cursor.to(0) + this.outputText);
	  }
	}

	autocomplete = AutocompletePrompt;
	return autocomplete;
}

var autocompleteMultiselect;
var hasRequiredAutocompleteMultiselect;

function requireAutocompleteMultiselect () {
	if (hasRequiredAutocompleteMultiselect) return autocompleteMultiselect;
	hasRequiredAutocompleteMultiselect = 1;

	const color = requireKleur();
	const { cursor } = requireSrc();
	const MultiselectPrompt = requireMultiselect();
	const { clear, style, figures } = requireUtil();
	/**
	 * MultiselectPrompt Base Element
	 * @param {Object} opts Options
	 * @param {String} opts.message Message
	 * @param {Array} opts.choices Array of choice objects
	 * @param {String} [opts.hint] Hint to display
	 * @param {String} [opts.warn] Hint shown for disabled choices
	 * @param {Number} [opts.max] Max choices
	 * @param {Number} [opts.cursor=0] Cursor start position
	 * @param {Stream} [opts.stdin] The Readable stream to listen to
	 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
	 */
	class AutocompleteMultiselectPrompt extends MultiselectPrompt {
	  constructor(opts={}) {
	    opts.overrideRender = true;
	    super(opts);
	    this.inputValue = '';
	    this.clear = clear('', this.out.columns);
	    this.filteredOptions = this.value;
	    this.render();
	  }

	  last() {
	    this.cursor = this.filteredOptions.length - 1;
	    this.render();
	  }
	  next() {
	    this.cursor = (this.cursor + 1) % this.filteredOptions.length;
	    this.render();
	  }

	  up() {
	    if (this.cursor === 0) {
	      this.cursor = this.filteredOptions.length - 1;
	    } else {
	      this.cursor--;
	    }
	    this.render();
	  }

	  down() {
	    if (this.cursor === this.filteredOptions.length - 1) {
	      this.cursor = 0;
	    } else {
	      this.cursor++;
	    }
	    this.render();
	  }

	  left() {
	    this.filteredOptions[this.cursor].selected = false;
	    this.render();
	  }

	  right() {
	    if (this.value.filter(e => e.selected).length >= this.maxChoices) return this.bell();
	    this.filteredOptions[this.cursor].selected = true;
	    this.render();
	  }

	  delete() {
	    if (this.inputValue.length) {
	      this.inputValue = this.inputValue.substr(0, this.inputValue.length - 1);
	      this.updateFilteredOptions();
	    }
	  }

	  updateFilteredOptions() {
	    const currentHighlight = this.filteredOptions[this.cursor];
	    this.filteredOptions = this.value
	      .filter(v => {
	        if (this.inputValue) {
	          if (typeof v.title === 'string') {
	            if (v.title.toLowerCase().includes(this.inputValue.toLowerCase())) {
	              return true;
	            }
	          }
	          if (typeof v.value === 'string') {
	            if (v.value.toLowerCase().includes(this.inputValue.toLowerCase())) {
	              return true;
	            }
	          }
	          return false;
	        }
	        return true;
	      });
	    const newHighlightIndex = this.filteredOptions.findIndex(v => v === currentHighlight);
	    this.cursor = newHighlightIndex < 0 ? 0 : newHighlightIndex;
	    this.render();
	  }

	  handleSpaceToggle() {
	    const v = this.filteredOptions[this.cursor];

	    if (v.selected) {
	      v.selected = false;
	      this.render();
	    } else if (v.disabled || this.value.filter(e => e.selected).length >= this.maxChoices) {
	      return this.bell();
	    } else {
	      v.selected = true;
	      this.render();
	    }
	  }

	  handleInputChange(c) {
	    this.inputValue = this.inputValue + c;
	    this.updateFilteredOptions();
	  }

	  _(c, key) {
	    if (c === ' ') {
	      this.handleSpaceToggle();
	    } else {
	      this.handleInputChange(c);
	    }
	  }

	  renderInstructions() {
	    if (this.instructions === undefined || this.instructions) {
	      if (typeof this.instructions === 'string') {
	        return this.instructions;
	      }
	      return `
Instructions:
    ${figures.arrowUp}/${figures.arrowDown}: Highlight option
    ${figures.arrowLeft}/${figures.arrowRight}/[space]: Toggle selection
    [a,b,c]/delete: Filter choices
    enter/return: Complete answer
`;
	    }
	    return '';
	  }

	  renderCurrentInput() {
	    return `
Filtered results for: ${this.inputValue ? this.inputValue : color.gray('Enter something to filter')}\n`;
	  }

	  renderOption(cursor, v, i) {
	    let title;
	    if (v.disabled) title = cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
	    else title = cursor === i ? color.cyan().underline(v.title) : v.title;
	    return (v.selected ? color.green(figures.radioOn) : figures.radioOff) + '  ' + title
	  }

	  renderDoneOrInstructions() {
	    if (this.done) {
	      return this.value
	        .filter(e => e.selected)
	        .map(v => v.title)
	        .join(', ');
	    }

	    const output = [color.gray(this.hint), this.renderInstructions(), this.renderCurrentInput()];

	    if (this.filteredOptions.length && this.filteredOptions[this.cursor].disabled) {
	      output.push(color.yellow(this.warn));
	    }
	    return output.join(' ');
	  }

	  render() {
	    if (this.closed) return;
	    if (this.firstRender) this.out.write(cursor.hide);
	    super.render();

	    // print prompt

	    let prompt = [
	      style.symbol(this.done, this.aborted),
	      color.bold(this.msg),
	      style.delimiter(false),
	      this.renderDoneOrInstructions()
	    ].join(' ');

	    if (this.showMinError) {
	      prompt += color.red(`You must select a minimum of ${this.minSelected} choices.`);
	      this.showMinError = false;
	    }
	    prompt += this.renderOptions(this.filteredOptions);

	    this.out.write(this.clear + prompt);
	    this.clear = clear(prompt, this.out.columns);
	  }
	}

	autocompleteMultiselect = AutocompleteMultiselectPrompt;
	return autocompleteMultiselect;
}

var confirm;
var hasRequiredConfirm;

function requireConfirm () {
	if (hasRequiredConfirm) return confirm;
	hasRequiredConfirm = 1;
	const color = requireKleur();
	const Prompt = requirePrompt();
	const { style, clear } = requireUtil();
	const { erase, cursor } = requireSrc();

	/**
	 * ConfirmPrompt Base Element
	 * @param {Object} opts Options
	 * @param {String} opts.message Message
	 * @param {Boolean} [opts.initial] Default value (true/false)
	 * @param {Stream} [opts.stdin] The Readable stream to listen to
	 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
	 * @param {String} [opts.yes] The "Yes" label
	 * @param {String} [opts.yesOption] The "Yes" option when choosing between yes/no
	 * @param {String} [opts.no] The "No" label
	 * @param {String} [opts.noOption] The "No" option when choosing between yes/no
	 */
	class ConfirmPrompt extends Prompt {
	  constructor(opts={}) {
	    super(opts);
	    this.msg = opts.message;
	    this.value = opts.initial;
	    this.initialValue = !!opts.initial;
	    this.yesMsg = opts.yes || 'yes';
	    this.yesOption = opts.yesOption || '(Y/n)';
	    this.noMsg = opts.no || 'no';
	    this.noOption = opts.noOption || '(y/N)';
	    this.render();
	  }

	  reset() {
	    this.value = this.initialValue;
	    this.fire();
	    this.render();
	  }

	  exit() {
	    this.abort();
	  }

	  abort() {
	    this.done = this.aborted = true;
	    this.fire();
	    this.render();
	    this.out.write('\n');
	    this.close();
	  }

	  submit() {
	    this.value = this.value || false;
	    this.done = true;
	    this.aborted = false;
	    this.fire();
	    this.render();
	    this.out.write('\n');
	    this.close();
	  }

	  _(c, key) {
	    if (c.toLowerCase() === 'y') {
	      this.value = true;
	      return this.submit();
	    }
	    if (c.toLowerCase() === 'n') {
	      this.value = false;
	      return this.submit();
	    }
	    return this.bell();
	  }

	  render() {
	    if (this.closed) return;
	    if (this.firstRender) this.out.write(cursor.hide);
	    else this.out.write(clear(this.outputText, this.out.columns));
	    super.render();

	    this.outputText = [
	      style.symbol(this.done, this.aborted),
	      color.bold(this.msg),
	      style.delimiter(this.done),
	      this.done ? (this.value ? this.yesMsg : this.noMsg)
	          : color.gray(this.initialValue ? this.yesOption : this.noOption)
	    ].join(' ');

	    this.out.write(erase.line + cursor.to(0) + this.outputText);
	  }
	}

	confirm = ConfirmPrompt;
	return confirm;
}

var elements;
var hasRequiredElements;

function requireElements () {
	if (hasRequiredElements) return elements;
	hasRequiredElements = 1;

	elements = {
	  TextPrompt: requireText(),
	  SelectPrompt: requireSelect(),
	  TogglePrompt: requireToggle(),
	  DatePrompt: requireDate(),
	  NumberPrompt: requireNumber(),
	  MultiselectPrompt: requireMultiselect(),
	  AutocompletePrompt: requireAutocomplete(),
	  AutocompleteMultiselectPrompt: requireAutocompleteMultiselect(),
	  ConfirmPrompt: requireConfirm()
	};
	return elements;
}

var hasRequiredPrompts;

function requirePrompts () {
	if (hasRequiredPrompts) return prompts$1;
	hasRequiredPrompts = 1;
	(function (exports) {
		const $ = exports;
		const el = requireElements();
		const noop = v => v;

		function toPrompt(type, args, opts={}) {
		  return new Promise((res, rej) => {
		    const p = new el[type](args);
		    const onAbort = opts.onAbort || noop;
		    const onSubmit = opts.onSubmit || noop;
		    const onExit = opts.onExit || noop;
		    p.on('state', args.onState || noop);
		    p.on('submit', x => res(onSubmit(x)));
		    p.on('exit', x => res(onExit(x)));
		    p.on('abort', x => rej(onAbort(x)));
		  });
		}

		/**
		 * Text prompt
		 * @param {string} args.message Prompt message to display
		 * @param {string} [args.initial] Default string value
		 * @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
		 * @param {function} [args.onState] On state change callback
		 * @param {function} [args.validate] Function to validate user input
		 * @param {Stream} [args.stdin] The Readable stream to listen to
		 * @param {Stream} [args.stdout] The Writable stream to write readline data to
		 * @returns {Promise} Promise with user input
		 */
		$.text = args => toPrompt('TextPrompt', args);

		/**
		 * Password prompt with masked input
		 * @param {string} args.message Prompt message to display
		 * @param {string} [args.initial] Default string value
		 * @param {function} [args.onState] On state change callback
		 * @param {function} [args.validate] Function to validate user input
		 * @param {Stream} [args.stdin] The Readable stream to listen to
		 * @param {Stream} [args.stdout] The Writable stream to write readline data to
		 * @returns {Promise} Promise with user input
		 */
		$.password = args => {
		  args.style = 'password';
		  return $.text(args);
		};

		/**
		 * Prompt where input is invisible, like sudo
		 * @param {string} args.message Prompt message to display
		 * @param {string} [args.initial] Default string value
		 * @param {function} [args.onState] On state change callback
		 * @param {function} [args.validate] Function to validate user input
		 * @param {Stream} [args.stdin] The Readable stream to listen to
		 * @param {Stream} [args.stdout] The Writable stream to write readline data to
		 * @returns {Promise} Promise with user input
		 */
		$.invisible = args => {
		  args.style = 'invisible';
		  return $.text(args);
		};

		/**
		 * Number prompt
		 * @param {string} args.message Prompt message to display
		 * @param {number} args.initial Default number value
		 * @param {function} [args.onState] On state change callback
		 * @param {number} [args.max] Max value
		 * @param {number} [args.min] Min value
		 * @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
		 * @param {Boolean} [opts.float=false] Parse input as floats
		 * @param {Number} [opts.round=2] Round floats to x decimals
		 * @param {Number} [opts.increment=1] Number to increment by when using arrow-keys
		 * @param {function} [args.validate] Function to validate user input
		 * @param {Stream} [args.stdin] The Readable stream to listen to
		 * @param {Stream} [args.stdout] The Writable stream to write readline data to
		 * @returns {Promise} Promise with user input
		 */
		$.number = args => toPrompt('NumberPrompt', args);

		/**
		 * Date prompt
		 * @param {string} args.message Prompt message to display
		 * @param {number} args.initial Default number value
		 * @param {function} [args.onState] On state change callback
		 * @param {number} [args.max] Max value
		 * @param {number} [args.min] Min value
		 * @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
		 * @param {Boolean} [opts.float=false] Parse input as floats
		 * @param {Number} [opts.round=2] Round floats to x decimals
		 * @param {Number} [opts.increment=1] Number to increment by when using arrow-keys
		 * @param {function} [args.validate] Function to validate user input
		 * @param {Stream} [args.stdin] The Readable stream to listen to
		 * @param {Stream} [args.stdout] The Writable stream to write readline data to
		 * @returns {Promise} Promise with user input
		 */
		$.date = args => toPrompt('DatePrompt', args);

		/**
		 * Classic yes/no prompt
		 * @param {string} args.message Prompt message to display
		 * @param {boolean} [args.initial=false] Default value
		 * @param {function} [args.onState] On state change callback
		 * @param {Stream} [args.stdin] The Readable stream to listen to
		 * @param {Stream} [args.stdout] The Writable stream to write readline data to
		 * @returns {Promise} Promise with user input
		 */
		$.confirm = args => toPrompt('ConfirmPrompt', args);

		/**
		 * List prompt, split intput string by `seperator`
		 * @param {string} args.message Prompt message to display
		 * @param {string} [args.initial] Default string value
		 * @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
		 * @param {string} [args.separator] String separator
		 * @param {function} [args.onState] On state change callback
		 * @param {Stream} [args.stdin] The Readable stream to listen to
		 * @param {Stream} [args.stdout] The Writable stream to write readline data to
		 * @returns {Promise} Promise with user input, in form of an `Array`
		 */
		$.list = args => {
		  const sep = args.separator || ',';
		  return toPrompt('TextPrompt', args, {
		    onSubmit: str => str.split(sep).map(s => s.trim())
		  });
		};

		/**
		 * Toggle/switch prompt
		 * @param {string} args.message Prompt message to display
		 * @param {boolean} [args.initial=false] Default value
		 * @param {string} [args.active="on"] Text for `active` state
		 * @param {string} [args.inactive="off"] Text for `inactive` state
		 * @param {function} [args.onState] On state change callback
		 * @param {Stream} [args.stdin] The Readable stream to listen to
		 * @param {Stream} [args.stdout] The Writable stream to write readline data to
		 * @returns {Promise} Promise with user input
		 */
		$.toggle = args => toPrompt('TogglePrompt', args);

		/**
		 * Interactive select prompt
		 * @param {string} args.message Prompt message to display
		 * @param {Array} args.choices Array of choices objects `[{ title, value }, ...]`
		 * @param {number} [args.initial] Index of default value
		 * @param {String} [args.hint] Hint to display
		 * @param {function} [args.onState] On state change callback
		 * @param {Stream} [args.stdin] The Readable stream to listen to
		 * @param {Stream} [args.stdout] The Writable stream to write readline data to
		 * @returns {Promise} Promise with user input
		 */
		$.select = args => toPrompt('SelectPrompt', args);

		/**
		 * Interactive multi-select / autocompleteMultiselect prompt
		 * @param {string} args.message Prompt message to display
		 * @param {Array} args.choices Array of choices objects `[{ title, value, [selected] }, ...]`
		 * @param {number} [args.max] Max select
		 * @param {string} [args.hint] Hint to display user
		 * @param {Number} [args.cursor=0] Cursor start position
		 * @param {function} [args.onState] On state change callback
		 * @param {Stream} [args.stdin] The Readable stream to listen to
		 * @param {Stream} [args.stdout] The Writable stream to write readline data to
		 * @returns {Promise} Promise with user input
		 */
		$.multiselect = args => {
		  args.choices = [].concat(args.choices || []);
		  const toSelected = items => items.filter(item => item.selected).map(item => item.value);
		  return toPrompt('MultiselectPrompt', args, {
		    onAbort: toSelected,
		    onSubmit: toSelected
		  });
		};

		$.autocompleteMultiselect = args => {
		  args.choices = [].concat(args.choices || []);
		  const toSelected = items => items.filter(item => item.selected).map(item => item.value);
		  return toPrompt('AutocompleteMultiselectPrompt', args, {
		    onAbort: toSelected,
		    onSubmit: toSelected
		  });
		};

		const byTitle = (input, choices) => Promise.resolve(
		  choices.filter(item => item.title.slice(0, input.length).toLowerCase() === input.toLowerCase())
		);

		/**
		 * Interactive auto-complete prompt
		 * @param {string} args.message Prompt message to display
		 * @param {Array} args.choices Array of auto-complete choices objects `[{ title, value }, ...]`
		 * @param {Function} [args.suggest] Function to filter results based on user input. Defaults to sort by `title`
		 * @param {number} [args.limit=10] Max number of results to show
		 * @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
		 * @param {String} [args.initial] Index of the default value
		 * @param {boolean} [opts.clearFirst] The first ESCAPE keypress will clear the input
		 * @param {String} [args.fallback] Fallback message - defaults to initial value
		 * @param {function} [args.onState] On state change callback
		 * @param {Stream} [args.stdin] The Readable stream to listen to
		 * @param {Stream} [args.stdout] The Writable stream to write readline data to
		 * @returns {Promise} Promise with user input
		 */
		$.autocomplete = args => {
		  args.suggest = args.suggest || byTitle;
		  args.choices = [].concat(args.choices || []);
		  return toPrompt('AutocompletePrompt', args);
		}; 
	} (prompts$1));
	return prompts$1;
}

var lib;
var hasRequiredLib;

function requireLib () {
	if (hasRequiredLib) return lib;
	hasRequiredLib = 1;

	const prompts = requirePrompts();

	const passOn = ['suggest', 'format', 'onState', 'validate', 'onRender', 'type'];
	const noop = () => {};

	/**
	 * Prompt for a series of questions
	 * @param {Array|Object} questions Single question object or Array of question objects
	 * @param {Function} [onSubmit] Callback function called on prompt submit
	 * @param {Function} [onCancel] Callback function called on cancel/abort
	 * @returns {Object} Object with values from user input
	 */
	async function prompt(questions=[], { onSubmit=noop, onCancel=noop }={}) {
	  const answers = {};
	  const override = prompt._override || {};
	  questions = [].concat(questions);
	  let answer, question, quit, name, type, lastPrompt;

	  const getFormattedAnswer = async (question, answer, skipValidation = false) => {
	    if (!skipValidation && question.validate && question.validate(answer) !== true) {
	      return;
	    }
	    return question.format ? await question.format(answer, answers) : answer
	  };

	  for (question of questions) {
	    ({ name, type } = question);

	    // evaluate type first and skip if type is a falsy value
	    if (typeof type === 'function') {
	      type = await type(answer, { ...answers }, question);
	      question['type'] = type;
	    }
	    if (!type) continue;

	    // if property is a function, invoke it unless it's a special function
	    for (let key in question) {
	      if (passOn.includes(key)) continue;
	      let value = question[key];
	      question[key] = typeof value === 'function' ? await value(answer, { ...answers }, lastPrompt) : value;
	    }

	    lastPrompt = question;

	    if (typeof question.message !== 'string') {
	      throw new Error('prompt message is required');
	    }

	    // update vars in case they changed
	    ({ name, type } = question);

	    if (prompts[type] === void 0) {
	      throw new Error(`prompt type (${type}) is not defined`);
	    }

	    if (override[question.name] !== undefined) {
	      answer = await getFormattedAnswer(question, override[question.name]);
	      if (answer !== undefined) {
	        answers[name] = answer;
	        continue;
	      }
	    }

	    try {
	      // Get the injected answer if there is one or prompt the user
	      answer = prompt._injected ? getInjectedAnswer(prompt._injected, question.initial) : await prompts[type](question);
	      answers[name] = answer = await getFormattedAnswer(question, answer, true);
	      quit = await onSubmit(question, answer, answers);
	    } catch (err) {
	      quit = !(await onCancel(question, answers));
	    }

	    if (quit) return answers;
	  }

	  return answers;
	}

	function getInjectedAnswer(injected, deafultValue) {
	  const answer = injected.shift();
	    if (answer instanceof Error) {
	      throw answer;
	    }

	    return (answer === undefined) ? deafultValue : answer;
	}

	function inject(answers) {
	  prompt._injected = (prompt._injected || []).concat(answers);
	}

	function override(answers) {
	  prompt._override = Object.assign({}, answers);
	}

	lib = Object.assign(prompt, { prompt, prompts, inject, override });
	return lib;
}

function isNodeLT(tar) {
  tar = (Array.isArray(tar) ? tar : tar.split('.')).map(Number);
  let i=0, src=process.versions.node.split('.').map(Number);
  for (; i < tar.length; i++) {
    if (src[i] > tar[i]) return false;
    if (tar[i] > src[i]) return true;
  }
  return false;
}

var prompts =
  isNodeLT('8.6.0')
    ? requireDist()
    : requireLib();

var prompt = /*@__PURE__*/getDefaultExportFromCjs(prompts);

var index = /*#__PURE__*/_mergeNamespaces({
  __proto__: null,
  default: prompt
}, [prompts]);

const keys = [
  [["a", "return"], "rerun all tests"],
  ["r", "rerun current pattern tests"],
  ["f", "rerun only failed tests"],
  ["u", "update snapshot"],
  ["p", "filter by a filename"],
  ["t", "filter by a test name regex pattern"],
  ["q", "quit"]
];
const cancelKeys = ["space", "c", "h", ...keys.map((key) => key[0]).flat()];
function printShortcutsHelp() {
  stdout().write(
    `
${c.bold("  Watch Usage")}
${keys.map((i) => c.dim("  press ") + c.reset([i[0]].flat().map(c.bold).join(", ")) + c.dim(` to ${i[1]}`)).join("\n")}
`
  );
}
function registerConsoleShortcuts(ctx) {
  let latestFilename = "";
  async function _keypressHandler(str, key) {
    if (str === "" || str === "\x1B" || key && key.ctrl && key.name === "c") {
      if (!ctx.isCancelling) {
        ctx.logger.logUpdate.clear();
        ctx.logger.log(c.red("Cancelling test run. Press CTRL+c again to exit forcefully.\n"));
        process.exitCode = 130;
        await ctx.cancelCurrentRun("keyboard-input");
        await ctx.runningPromise;
      }
      return ctx.exit(true);
    }
    if (!isWindows && key && key.ctrl && key.name === "z") {
      process.kill(process.ppid, "SIGTSTP");
      process.kill(process.pid, "SIGTSTP");
      return;
    }
    if (!ctx.config.watch)
      return;
    const name = key == null ? void 0 : key.name;
    if (ctx.runningPromise) {
      if (cancelKeys.includes(name))
        await ctx.cancelCurrentRun("keyboard-input");
      return;
    }
    if (name === "q")
      return ctx.exit(true);
    if (ctx.mode === "typecheck")
      return;
    if (name === "h")
      return printShortcutsHelp();
    if (name === "u")
      return ctx.updateSnapshot();
    if (name === "a" || name === "return")
      return ctx.changeNamePattern("");
    if (name === "r")
      return ctx.rerunFiles();
    if (name === "f")
      return ctx.rerunFailed();
    if (name === "t")
      return inputNamePattern();
    if (name === "p")
      return inputFilePattern();
  }
  async function keypressHandler(str, key) {
    await _keypressHandler(str, key);
  }
  async function inputNamePattern() {
    var _a;
    off();
    const { filter = "" } = await prompt([{
      name: "filter",
      type: "text",
      message: "Input test name pattern (RegExp)",
      initial: ((_a = ctx.configOverride.testNamePattern) == null ? void 0 : _a.source) || ""
    }]);
    on();
    await ctx.changeNamePattern(filter.trim(), void 0, "change pattern");
  }
  async function inputFilePattern() {
    off();
    const { filter = "" } = await prompt([{
      name: "filter",
      type: "text",
      message: "Input filename pattern",
      initial: latestFilename
    }]);
    latestFilename = filter.trim();
    on();
    await ctx.changeFilenamePattern(filter.trim());
  }
  let rl;
  function on() {
    off();
    rl = readline.createInterface({ input: process.stdin, escapeCodeTimeout: 50 });
    readline.emitKeypressEvents(process.stdin, rl);
    if (process.stdin.isTTY)
      process.stdin.setRawMode(true);
    process.stdin.on("keypress", keypressHandler);
  }
  function off() {
    rl == null ? void 0 : rl.close();
    rl = void 0;
    process.stdin.removeListener("keypress", keypressHandler);
    if (process.stdin.isTTY)
      process.stdin.setRawMode(false);
  }
  on();
  return function cleanup() {
    off();
  };
}

async function startVitest(mode, cliFilters = [], options = {}, viteOverrides) {
  var _a;
  process.env.TEST = "true";
  process.env.VITEST = "true";
  (_a = process.env).NODE_ENV ?? (_a.NODE_ENV = options.mode || "test");
  if (options.run)
    options.watch = false;
  const root = resolve(options.root || process.cwd());
  if (!await ensurePackageInstalled("vite", root)) {
    process.exitCode = 1;
    return;
  }
  if (typeof options.coverage === "boolean")
    options.coverage = { enabled: options.coverage };
  if (typeof options.browser === "boolean")
    options.browser = { enabled: options.browser };
  if (typeof options.browser === "string")
    options.browser = { enabled: true, name: options.browser };
  if (typeof options.browser === "object" && !("enabled" in options.browser))
    options.browser.enabled = true;
  if ("threads" in options && options.experimentalVmThreads)
    throw new Error('Cannot use both "threads" (or "no-threads") and "experimentalVmThreads" at the same time.');
  const ctx = await createVitest(mode, options, viteOverrides);
  if (mode === "test" && ctx.config.coverage.enabled) {
    const provider = ctx.config.coverage.provider || "v8";
    const requiredPackages = CoverageProviderMap[provider];
    if (requiredPackages) {
      if (!await ensurePackageInstalled(requiredPackages, root)) {
        process.exitCode = 1;
        return ctx;
      }
    }
  }
  const environmentPackage = getEnvPackageName(ctx.config.environment);
  if (environmentPackage && !await ensurePackageInstalled(environmentPackage, root)) {
    process.exitCode = 1;
    return ctx;
  }
  let stdinCleanup;
  if (process.stdin.isTTY)
    stdinCleanup = registerConsoleShortcuts(ctx);
  ctx.onServerRestart((reason) => {
    ctx.report("onServerRestart", reason);
    if (process.env.VITEST_CLI_WRAPPER)
      process.exit(EXIT_CODE_RESTART);
  });
  ctx.onAfterSetServer(() => {
    ctx.start(cliFilters);
  });
  try {
    await ctx.start(cliFilters);
  } catch (e) {
    process.exitCode = 1;
    await ctx.logger.printError(e, { fullStack: true, type: "Unhandled Error" });
    ctx.logger.error("\n\n");
    return ctx;
  }
  if (ctx.shouldKeepServer())
    return ctx;
  stdinCleanup == null ? void 0 : stdinCleanup();
  await ctx.close();
  return ctx;
}

export { BaseSequencer as B, VitestPlugin as V, createVitest as c, divider as d, onetimeExports as o, registerConsoleShortcuts as r, startVitest as s, version$1 as v };
