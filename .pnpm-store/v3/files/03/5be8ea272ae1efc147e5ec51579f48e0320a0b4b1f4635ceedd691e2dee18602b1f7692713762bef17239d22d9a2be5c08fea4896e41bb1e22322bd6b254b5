'use strict';

exports.__esModule = true;

const moduleRequire = require('./module-require').default;
const extname = require('path').extname;
const fs = require('fs');

const log = require('debug')('eslint-plugin-import:parse');

function getBabelEslintVisitorKeys(parserPath) {
  if (parserPath.endsWith('index.js')) {
    const hypotheticalLocation = parserPath.replace('index.js', 'visitor-keys.js');
    if (fs.existsSync(hypotheticalLocation)) {
      const keys = moduleRequire(hypotheticalLocation);
      return keys.default || keys;
    }
  }
  return null;
}

function keysFromParser(parserPath, parserInstance, parsedResult) {
  // Exposed by @typescript-eslint/parser and @babel/eslint-parser
  if (parsedResult && parsedResult.visitorKeys) {
    return parsedResult.visitorKeys;
  }
  if (typeof parserPath === 'string' && (/.*espree.*/).test(parserPath)) {
    return parserInstance.VisitorKeys;
  }
  if (typeof parserPath === 'string' && (/.*babel-eslint.*/).test(parserPath)) {
    return getBabelEslintVisitorKeys(parserPath);
  }
  return null;
}

// this exists to smooth over the unintentional breaking change in v2.7.
// TODO, semver-major: avoid mutating `ast` and return a plain object instead.
function makeParseReturn(ast, visitorKeys) {
  if (ast) {
    ast.visitorKeys = visitorKeys;
    ast.ast = ast;
  }
  return ast;
}

function stripUnicodeBOM(text) {
  return text.charCodeAt(0) === 0xFEFF ? text.slice(1) : text;
}

function transformHashbang(text) {
  return text.replace(/^#!([^\r\n]+)/u, (_, captured) => `//${captured}`);
}

exports.default = function parse(path, content, context) {
  if (context == null) { throw new Error('need context to parse properly'); }

  // ESLint in "flat" mode only sets context.languageOptions.parserOptions
  let parserOptions = context.languageOptions && context.languageOptions.parserOptions || context.parserOptions;
  const parserOrPath = getParser(path, context);

  if (!parserOrPath) { throw new Error('parserPath or languageOptions.parser is required!'); }

  // hack: espree blows up with frozen options
  parserOptions = Object.assign({}, parserOptions);
  parserOptions.ecmaFeatures = Object.assign({}, parserOptions.ecmaFeatures);

  // always include comments and tokens (for doc parsing)
  parserOptions.comment = true;
  parserOptions.attachComment = true;  // keeping this for backward-compat with  older parsers
  parserOptions.tokens = true;

  // attach node locations
  parserOptions.loc = true;
  parserOptions.range = true;

  // provide the `filePath` like eslint itself does, in `parserOptions`
  // https://github.com/eslint/eslint/blob/3ec436ee/lib/linter.js#L637
  parserOptions.filePath = path;

  // @typescript-eslint/parser will parse the entire project with typechecking if you provide
  // "project" or "projects" in parserOptions. Removing these options means the parser will
  // only parse one file in isolate mode, which is much, much faster.
  // https://github.com/import-js/eslint-plugin-import/issues/1408#issuecomment-509298962
  delete parserOptions.project;
  delete parserOptions.projects;

  // require the parser relative to the main module (i.e., ESLint)
  const parser = typeof parserOrPath === 'string' ? moduleRequire(parserOrPath) : parserOrPath;

  // replicate bom strip and hashbang transform of ESLint
  // https://github.com/eslint/eslint/blob/b93af98b3c417225a027cabc964c38e779adb945/lib/linter/linter.js#L779
  content = transformHashbang(stripUnicodeBOM(String(content)));

  if (typeof parser.parseForESLint === 'function') {
    let ast;
    try {
      const parserRaw = parser.parseForESLint(content, parserOptions);
      ast = parserRaw.ast;
      return makeParseReturn(ast, keysFromParser(parserOrPath, parser, parserRaw));
    } catch (e) {
      console.warn();
      console.warn('Error while parsing ' + parserOptions.filePath);
      console.warn('Line ' + e.lineNumber + ', column ' + e.column + ': ' + e.message);
    }
    if (!ast || typeof ast !== 'object') {
      console.warn(
        // Can only be invalid for custom parser per imports/parser
        '`parseForESLint` from parser `' + (typeof parserOrPath === 'string' ? parserOrPath : '`context.languageOptions.parser`') + '` is invalid and will just be ignored'
      );
    } else {
      return makeParseReturn(ast, keysFromParser(parserOrPath, parser, undefined));
    }
  }

  const ast = parser.parse(content, parserOptions);
  return makeParseReturn(ast, keysFromParser(parserOrPath, parser, undefined));
};

function getParser(path, context) {
  const parserPath = getParserPath(path, context);
  if (parserPath) {
    return parserPath;
  }
  const isFlat = context.languageOptions
    && context.languageOptions.parser
    && typeof context.languageOptions.parser !== 'string'
    && (
      typeof context.languageOptions.parser.parse === 'function'
      || typeof context.languageOptions.parser.parseForESLint === 'function'
    );

  return isFlat ? context.languageOptions.parser : null;
}

function getParserPath(path, context) {
  const parsers = context.settings['import/parsers'];
  if (parsers != null) {
    const extension = extname(path);
    for (const parserPath in parsers) {
      if (parsers[parserPath].indexOf(extension) > -1) {
        // use this alternate parser
        log('using alt parser:', parserPath);
        return parserPath;
      }
    }
  }
  // default to use ESLint parser
  return context.parserPath;
}
