'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();exports.













































































































































































































































































































































































































































































































































































































































































































































































recursivePatternCapture = recursivePatternCapture;var _fs = require('fs');var _fs2 = _interopRequireDefault(_fs);var _path = require('path');var _doctrine = require('doctrine');var _doctrine2 = _interopRequireDefault(_doctrine);var _debug = require('debug');var _debug2 = _interopRequireDefault(_debug);var _eslint = require('eslint');var _parse = require('eslint-module-utils/parse');var _parse2 = _interopRequireDefault(_parse);var _visit = require('eslint-module-utils/visit');var _visit2 = _interopRequireDefault(_visit);var _resolve = require('eslint-module-utils/resolve');var _resolve2 = _interopRequireDefault(_resolve);var _ignore = require('eslint-module-utils/ignore');var _ignore2 = _interopRequireDefault(_ignore);var _hash = require('eslint-module-utils/hash');var _unambiguous = require('eslint-module-utils/unambiguous');var unambiguous = _interopRequireWildcard(_unambiguous);var _tsconfigLoader = require('tsconfig-paths/lib/tsconfig-loader');var _arrayIncludes = require('array-includes');var _arrayIncludes2 = _interopRequireDefault(_arrayIncludes);function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj['default'] = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var ts = void 0;var log = (0, _debug2['default'])('eslint-plugin-import:ExportMap');var exportCache = new Map();var tsconfigCache = new Map();var ExportMap = function () {function ExportMap(path) {_classCallCheck(this, ExportMap);this.path = path;this.namespace = new Map(); // todo: restructure to key on path, value is resolver + map of names
    this.reexports = new Map(); /**
                                 * star-exports
                                 * @type {Set} of () => ExportMap
                                 */this.dependencies = new Set(); /**
                                                                   * dependencies of this module that are not explicitly re-exported
                                                                   * @type {Map} from path = () => ExportMap
                                                                   */this.imports = new Map();this.errors = []; /**
                                                                                                                 * type {'ambiguous' | 'Module' | 'Script'}
                                                                                                                 */this.parseGoal = 'ambiguous';}_createClass(ExportMap, [{ key: 'has', /**
                                                                                                                                                                                         * Note that this does not check explicitly re-exported names for existence
                                                                                                                                                                                         * in the base namespace, but it will expand all `export * from '...'` exports
                                                                                                                                                                                         * if not found in the explicit namespace.
                                                                                                                                                                                         * @param  {string}  name
                                                                                                                                                                                         * @return {Boolean} true if `name` is exported by this module.
                                                                                                                                                                                         */value: function () {function has(name) {if (this.namespace.has(name)) {return true;}if (this.reexports.has(name)) {return true;} // default exports must be explicitly re-exported (#328)
        if (name !== 'default') {var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {for (var _iterator = this.dependencies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var dep = _step.value;var innerMap = dep(); // todo: report as unresolved?
              if (!innerMap) {continue;}if (innerMap.has(name)) {return true;}}} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator['return']) {_iterator['return']();}} finally {if (_didIteratorError) {throw _iteratorError;}}}}return false;}return has;}() /**
                                                                                                                                                                                                                                                                                                                                     * ensure that imported name fully resolves.
                                                                                                                                                                                                                                                                                                                                     * @param  {string} name
                                                                                                                                                                                                                                                                                                                                     * @return {{ found: boolean, path: ExportMap[] }}
                                                                                                                                                                                                                                                                                                                                     */ }, { key: 'hasDeep', value: function () {function hasDeep(name) {if (this.namespace.has(name)) {return { found: true, path: [this] };}if (this.reexports.has(name)) {var reexports = this.reexports.get(name);var imported = reexports.getImport(); // if import is ignored, return explicit 'null'
          if (imported == null) {return { found: true, path: [this] };} // safeguard against cycles, only if name matches
          if (imported.path === this.path && reexports.local === name) {return { found: false, path: [this] };}var deep = imported.hasDeep(reexports.local);deep.path.unshift(this);return deep;} // default exports must be explicitly re-exported (#328)
        if (name !== 'default') {var _iteratorNormalCompletion2 = true;var _didIteratorError2 = false;var _iteratorError2 = undefined;try {for (var _iterator2 = this.dependencies[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {var dep = _step2.value;var innerMap = dep();if (innerMap == null) {return { found: true, path: [this] };} // todo: report as unresolved?
              if (!innerMap) {continue;} // safeguard against cycles
              if (innerMap.path === this.path) {continue;}var innerValue = innerMap.hasDeep(name);if (innerValue.found) {innerValue.path.unshift(this);return innerValue;}}} catch (err) {_didIteratorError2 = true;_iteratorError2 = err;} finally {try {if (!_iteratorNormalCompletion2 && _iterator2['return']) {_iterator2['return']();}} finally {if (_didIteratorError2) {throw _iteratorError2;}}}}return { found: false, path: [this] };}return hasDeep;}() }, { key: 'get', value: function () {function get(name) {if (this.namespace.has(name)) {return this.namespace.get(name);}if (this.reexports.has(name)) {var reexports = this.reexports.get(name);var imported = reexports.getImport(); // if import is ignored, return explicit 'null'
          if (imported == null) {return null;} // safeguard against cycles, only if name matches
          if (imported.path === this.path && reexports.local === name) {return undefined;}return imported.get(reexports.local);} // default exports must be explicitly re-exported (#328)
        if (name !== 'default') {var _iteratorNormalCompletion3 = true;var _didIteratorError3 = false;var _iteratorError3 = undefined;try {for (var _iterator3 = this.dependencies[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {var dep = _step3.value;var innerMap = dep(); // todo: report as unresolved?
              if (!innerMap) {continue;} // safeguard against cycles
              if (innerMap.path === this.path) {continue;}var innerValue = innerMap.get(name);if (innerValue !== undefined) {return innerValue;}}} catch (err) {_didIteratorError3 = true;_iteratorError3 = err;} finally {try {if (!_iteratorNormalCompletion3 && _iterator3['return']) {_iterator3['return']();}} finally {if (_didIteratorError3) {throw _iteratorError3;}}}}return undefined;}return get;}() }, { key: 'forEach', value: function () {function forEach(callback, thisArg) {var _this = this;this.namespace.forEach(function (v, n) {callback.call(thisArg, v, n, _this);});this.reexports.forEach(function (reexports, name) {var reexported = reexports.getImport(); // can't look up meta for ignored re-exports (#348)
          callback.call(thisArg, reexported && reexported.get(reexports.local), name, _this);});this.dependencies.forEach(function (dep) {var d = dep(); // CJS / ignored dependencies won't exist (#717)
          if (d == null) {return;}d.forEach(function (v, n) {if (n !== 'default') {callback.call(thisArg, v, n, _this);}});});}return forEach;}() // todo: keys, values, entries?
  }, { key: 'reportErrors', value: function () {function reportErrors(context, declaration) {var msg = this.errors.map(function (e) {return String(e.message) + ' (' + String(e.lineNumber) + ':' + String(e.column) + ')';}).join(', ');context.report({ node: declaration.source, message: 'Parse errors in imported module \'' + String(declaration.source.value) + '\': ' + String(msg) });}return reportErrors;}() }, { key: 'hasDefault', get: function () {function get() {return this.get('default') != null;}return get;}() // stronger than this.has
  }, { key: 'size', get: function () {function get() {var size = this.namespace.size + this.reexports.size;this.dependencies.forEach(function (dep) {var d = dep(); // CJS / ignored dependencies won't exist (#717)
          if (d == null) {return;}size += d.size;});return size;}return get;}() }]);return ExportMap;}(); /**
                                                                                                           * parse docs from the first node that has leading comments
                                                                                                           */exports['default'] = ExportMap;function captureDoc(source, docStyleParsers) {var metadata = {}; // 'some' short-circuits on first 'true'
  for (var _len = arguments.length, nodes = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {nodes[_key - 2] = arguments[_key];}nodes.some(function (n) {try {var leadingComments = void 0; // n.leadingComments is legacy `attachComments` behavior
      if ('leadingComments' in n) {leadingComments = n.leadingComments;} else if (n.range) {leadingComments = source.getCommentsBefore(n);}if (!leadingComments || leadingComments.length === 0) {return false;}for (var name in docStyleParsers) {var doc = docStyleParsers[name](leadingComments);if (doc) {metadata.doc = doc;}}return true;} catch (err) {return false;}});return metadata;}var availableDocStyleParsers = { jsdoc: captureJsDoc, tomdoc: captureTomDoc }; /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * parse JSDoc from leading comments
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @param {object[]} comments
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @return {{ doc: object }}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */function captureJsDoc(comments) {var doc = void 0; // capture XSDoc
  comments.forEach(function (comment) {// skip non-block comments
    if (comment.type !== 'Block') {return;}try {doc = _doctrine2['default'].parse(comment.value, { unwrap: true });} catch (err) {/* don't care, for now? maybe add to `errors?` */}});return doc;} /**
                                                                                                                                                                                                      * parse TomDoc section from comments
                                                                                                                                                                                                      */function captureTomDoc(comments) {// collect lines up to first paragraph break
  var lines = [];for (var i = 0; i < comments.length; i++) {var comment = comments[i];if (comment.value.match(/^\s*$/)) {break;}lines.push(comment.value.trim());} // return doctrine-like object
  var statusMatch = lines.join(' ').match(/^(Public|Internal|Deprecated):\s*(.+)/);if (statusMatch) {return { description: statusMatch[2], tags: [{ title: statusMatch[1].toLowerCase(), description: statusMatch[2] }] };}}var supportedImportTypes = new Set(['ImportDefaultSpecifier', 'ImportNamespaceSpecifier']);ExportMap.get = function (source, context) {var path = (0, _resolve2['default'])(source, context);if (path == null) {return null;}return ExportMap['for'](childContext(path, context));};ExportMap['for'] = function (context) {var path = context.path;var cacheKey = context.cacheKey || (0, _hash.hashObject)(context).digest('hex');var exportMap = exportCache.get(cacheKey); // return cached ignore
  if (exportMap === null) {return null;}var stats = _fs2['default'].statSync(path);if (exportMap != null) {// date equality check
    if (exportMap.mtime - stats.mtime === 0) {return exportMap;} // future: check content equality?
  } // check valid extensions first
  if (!(0, _ignore.hasValidExtension)(path, context)) {exportCache.set(cacheKey, null);return null;} // check for and cache ignore
  if ((0, _ignore2['default'])(path, context)) {log('ignored path due to ignore settings:', path);exportCache.set(cacheKey, null);return null;}var content = _fs2['default'].readFileSync(path, { encoding: 'utf8' }); // check for and cache unambiguous modules
  if (!unambiguous.test(content)) {log('ignored path due to unambiguous regex:', path);exportCache.set(cacheKey, null);return null;}log('cache miss', cacheKey, 'for path', path);exportMap = ExportMap.parse(path, content, context); // ambiguous modules return null
  if (exportMap == null) {log('ignored path due to ambiguous parse:', path);exportCache.set(cacheKey, null);return null;}exportMap.mtime = stats.mtime;exportCache.set(cacheKey, exportMap);return exportMap;};ExportMap.parse = function (path, content, context) {var m = new ExportMap(path);var isEsModuleInteropTrue = isEsModuleInterop();var ast = void 0;var visitorKeys = void 0;try {var result = (0, _parse2['default'])(path, content, context);ast = result.ast;visitorKeys = result.visitorKeys;} catch (err) {m.errors.push(err);return m; // can't continue
  }m.visitorKeys = visitorKeys;var hasDynamicImports = false;function processDynamicImport(source) {hasDynamicImports = true;if (source.type !== 'Literal') {return null;}var p = remotePath(source.value);if (p == null) {return null;}var importedSpecifiers = new Set();importedSpecifiers.add('ImportNamespaceSpecifier');var getter = thunkFor(p, context);m.imports.set(p, { getter: getter, declarations: new Set([{ source: { // capturing actual node reference holds full AST in memory!
          value: source.value, loc: source.loc }, importedSpecifiers: importedSpecifiers, dynamic: true }]) });}(0, _visit2['default'])(ast, visitorKeys, { ImportExpression: function () {function ImportExpression(node) {processDynamicImport(node.source);}return ImportExpression;}(), CallExpression: function () {function CallExpression(node) {if (node.callee.type === 'Import') {processDynamicImport(node.arguments[0]);}}return CallExpression;}() });var unambiguouslyESM = unambiguous.isModule(ast);if (!unambiguouslyESM && !hasDynamicImports) {return null;}var docstyle = context.settings && context.settings['import/docstyle'] || ['jsdoc'];var docStyleParsers = {};docstyle.forEach(function (style) {docStyleParsers[style] = availableDocStyleParsers[style];}); // attempt to collect module doc
  if (ast.comments) {ast.comments.some(function (c) {if (c.type !== 'Block') {return false;}try {var doc = _doctrine2['default'].parse(c.value, { unwrap: true });if (doc.tags.some(function (t) {return t.title === 'module';})) {m.doc = doc;return true;}} catch (err) {/* ignore */}return false;});}var namespaces = new Map();function remotePath(value) {return _resolve2['default'].relative(value, path, context.settings);}function resolveImport(value) {var rp = remotePath(value);if (rp == null) {return null;}return ExportMap['for'](childContext(rp, context));}function getNamespace(identifier) {if (!namespaces.has(identifier.name)) {return;}return function () {return resolveImport(namespaces.get(identifier.name));};}function addNamespace(object, identifier) {var nsfn = getNamespace(identifier);if (nsfn) {Object.defineProperty(object, 'namespace', { get: nsfn });}return object;}function processSpecifier(s, n, m) {var nsource = n.source && n.source.value;var exportMeta = {};var local = void 0;switch (s.type) {case 'ExportDefaultSpecifier':if (!nsource) {return;}local = 'default';break;case 'ExportNamespaceSpecifier':m.namespace.set(s.exported.name, Object.defineProperty(exportMeta, 'namespace', { get: function () {function get() {return resolveImport(nsource);}return get;}() }));return;case 'ExportAllDeclaration':m.namespace.set(s.exported.name || s.exported.value, addNamespace(exportMeta, s.source.value));return;case 'ExportSpecifier':if (!n.source) {m.namespace.set(s.exported.name || s.exported.value, addNamespace(exportMeta, s.local));return;} // else falls through
      default:local = s.local.name;break;} // todo: JSDoc
    m.reexports.set(s.exported.name, { local: local, getImport: function () {function getImport() {return resolveImport(nsource);}return getImport;}() });}function captureDependencyWithSpecifiers(n) {// import type { Foo } (TS and Flow); import typeof { Foo } (Flow)
    var declarationIsType = n.importKind === 'type' || n.importKind === 'typeof'; // import './foo' or import {} from './foo' (both 0 specifiers) is a side effect and
    // shouldn't be considered to be just importing types
    var specifiersOnlyImportingTypes = n.specifiers.length > 0;var importedSpecifiers = new Set();n.specifiers.forEach(function (specifier) {if (specifier.type === 'ImportSpecifier') {importedSpecifiers.add(specifier.imported.name || specifier.imported.value);} else if (supportedImportTypes.has(specifier.type)) {importedSpecifiers.add(specifier.type);} // import { type Foo } (Flow); import { typeof Foo } (Flow)
      specifiersOnlyImportingTypes = specifiersOnlyImportingTypes && (specifier.importKind === 'type' || specifier.importKind === 'typeof');});captureDependency(n, declarationIsType || specifiersOnlyImportingTypes, importedSpecifiers);}function captureDependency(_ref, isOnlyImportingTypes) {var source = _ref.source;var importedSpecifiers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Set();if (source == null) {return null;}var p = remotePath(source.value);if (p == null) {return null;}var declarationMetadata = { // capturing actual node reference holds full AST in memory!
      source: { value: source.value, loc: source.loc }, isOnlyImportingTypes: isOnlyImportingTypes, importedSpecifiers: importedSpecifiers };var existing = m.imports.get(p);if (existing != null) {existing.declarations.add(declarationMetadata);return existing.getter;}var getter = thunkFor(p, context);m.imports.set(p, { getter: getter, declarations: new Set([declarationMetadata]) });return getter;}var source = makeSourceCode(content, ast);function readTsConfig(context) {var tsconfigInfo = (0, _tsconfigLoader.tsConfigLoader)({ cwd: context.parserOptions && context.parserOptions.tsconfigRootDir || process.cwd(), getEnv: function () {function getEnv(key) {return process.env[key];}return getEnv;}() });try {if (tsconfigInfo.tsConfigPath !== undefined) {// Projects not using TypeScript won't have `typescript` installed.
        if (!ts) {ts = require('typescript');} // eslint-disable-line import/no-extraneous-dependencies
        var configFile = ts.readConfigFile(tsconfigInfo.tsConfigPath, ts.sys.readFile);return ts.parseJsonConfigFileContent(configFile.config, ts.sys, (0, _path.dirname)(tsconfigInfo.tsConfigPath));}} catch (e) {// Catch any errors
    }return null;}function isEsModuleInterop() {var cacheKey = (0, _hash.hashObject)({ tsconfigRootDir: context.parserOptions && context.parserOptions.tsconfigRootDir }).digest('hex');var tsConfig = tsconfigCache.get(cacheKey);if (typeof tsConfig === 'undefined') {tsConfig = readTsConfig(context);tsconfigCache.set(cacheKey, tsConfig);}return tsConfig && tsConfig.options ? tsConfig.options.esModuleInterop : false;}ast.body.forEach(function (n) {if (n.type === 'ExportDefaultDeclaration') {var exportMeta = captureDoc(source, docStyleParsers, n);if (n.declaration.type === 'Identifier') {addNamespace(exportMeta, n.declaration);}m.namespace.set('default', exportMeta);return;}if (n.type === 'ExportAllDeclaration') {var getter = captureDependency(n, n.exportKind === 'type');if (getter) {m.dependencies.add(getter);}if (n.exported) {processSpecifier(n, n.exported, m);}return;} // capture namespaces in case of later export
    if (n.type === 'ImportDeclaration') {captureDependencyWithSpecifiers(n);var ns = n.specifiers.find(function (s) {return s.type === 'ImportNamespaceSpecifier';});if (ns) {namespaces.set(ns.local.name, n.source.value);}return;}if (n.type === 'ExportNamedDeclaration') {captureDependencyWithSpecifiers(n); // capture declaration
      if (n.declaration != null) {switch (n.declaration.type) {case 'FunctionDeclaration':case 'ClassDeclaration':case 'TypeAlias': // flowtype with babel-eslint parser
          case 'InterfaceDeclaration':case 'DeclareFunction':case 'TSDeclareFunction':case 'TSEnumDeclaration':case 'TSTypeAliasDeclaration':case 'TSInterfaceDeclaration':case 'TSAbstractClassDeclaration':case 'TSModuleDeclaration':m.namespace.set(n.declaration.id.name, captureDoc(source, docStyleParsers, n));break;case 'VariableDeclaration':n.declaration.declarations.forEach(function (d) {recursivePatternCapture(d.id, function (id) {return m.namespace.set(id.name, captureDoc(source, docStyleParsers, d, n));});});break;default:}}n.specifiers.forEach(function (s) {return processSpecifier(s, n, m);});}var exports = ['TSExportAssignment'];if (isEsModuleInteropTrue) {exports.push('TSNamespaceExportDeclaration');} // This doesn't declare anything, but changes what's being exported.
    if ((0, _arrayIncludes2['default'])(exports, n.type)) {var exportedName = n.type === 'TSNamespaceExportDeclaration' ? (n.id || n.name).name : n.expression && n.expression.name || n.expression.id && n.expression.id.name || null;var declTypes = ['VariableDeclaration', 'ClassDeclaration', 'TSDeclareFunction', 'TSEnumDeclaration', 'TSTypeAliasDeclaration', 'TSInterfaceDeclaration', 'TSAbstractClassDeclaration', 'TSModuleDeclaration'];var exportedDecls = ast.body.filter(function (_ref2) {var type = _ref2.type,id = _ref2.id,declarations = _ref2.declarations;return (0, _arrayIncludes2['default'])(declTypes, type) && (id && id.name === exportedName || declarations && declarations.find(function (d) {return d.id.name === exportedName;}));});if (exportedDecls.length === 0) {// Export is not referencing any local declaration, must be re-exporting
        m.namespace.set('default', captureDoc(source, docStyleParsers, n));return;}if (isEsModuleInteropTrue // esModuleInterop is on in tsconfig
      && !m.namespace.has('default') // and default isn't added already
      ) {m.namespace.set('default', {}); // add default export
        }exportedDecls.forEach(function (decl) {if (decl.type === 'TSModuleDeclaration') {if (decl.body && decl.body.type === 'TSModuleDeclaration') {m.namespace.set(decl.body.id.name, captureDoc(source, docStyleParsers, decl.body));} else if (decl.body && decl.body.body) {decl.body.body.forEach(function (moduleBlockNode) {// Export-assignment exports all members in the namespace,
              // explicitly exported or not.
              var namespaceDecl = moduleBlockNode.type === 'ExportNamedDeclaration' ? moduleBlockNode.declaration : moduleBlockNode;if (!namespaceDecl) {// TypeScript can check this for us; we needn't
              } else if (namespaceDecl.type === 'VariableDeclaration') {namespaceDecl.declarations.forEach(function (d) {return recursivePatternCapture(d.id, function (id) {return m.namespace.set(id.name, captureDoc(source, docStyleParsers, decl, namespaceDecl, moduleBlockNode));});});} else {m.namespace.set(namespaceDecl.id.name, captureDoc(source, docStyleParsers, moduleBlockNode));}});}} else {// Export as default
          m.namespace.set('default', captureDoc(source, docStyleParsers, decl));}});}});if (isEsModuleInteropTrue // esModuleInterop is on in tsconfig
  && m.namespace.size > 0 // anything is exported
  && !m.namespace.has('default') // and default isn't added already
  ) {m.namespace.set('default', {}); // add default export
    }if (unambiguouslyESM) {m.parseGoal = 'Module';}return m;}; /**
                                                                 * The creation of this closure is isolated from other scopes
                                                                 * to avoid over-retention of unrelated variables, which has
                                                                 * caused memory leaks. See #1266.
                                                                 */function thunkFor(p, context) {return function () {return ExportMap['for'](childContext(p, context));};} /**
                                                                                                                                                                             * Traverse a pattern/identifier node, calling 'callback'
                                                                                                                                                                             * for each leaf identifier.
                                                                                                                                                                             * @param  {node}   pattern
                                                                                                                                                                             * @param  {Function} callback
                                                                                                                                                                             * @return {void}
                                                                                                                                                                             */function recursivePatternCapture(pattern, callback) {switch (pattern.type) {case 'Identifier': // base case
      callback(pattern);break;case 'ObjectPattern':pattern.properties.forEach(function (p) {if (p.type === 'ExperimentalRestProperty' || p.type === 'RestElement') {callback(p.argument);return;}recursivePatternCapture(p.value, callback);});break;case 'ArrayPattern':pattern.elements.forEach(function (element) {if (element == null) {return;}if (element.type === 'ExperimentalRestProperty' || element.type === 'RestElement') {callback(element.argument);return;}recursivePatternCapture(element, callback);});break;case 'AssignmentPattern':callback(pattern.left);break;default:}}var parserOptionsHash = '';var prevParserOptions = '';var settingsHash = '';var prevSettings = ''; /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * don't hold full context object in memory, just grab what we need.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * also calculate a cacheKey, where parts of the cacheKey hash are memoized
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   */function childContext(path, context) {var settings = context.settings,parserOptions = context.parserOptions,parserPath = context.parserPath;if (JSON.stringify(settings) !== prevSettings) {settingsHash = (0, _hash.hashObject)({ settings: settings }).digest('hex');prevSettings = JSON.stringify(settings);}if (JSON.stringify(parserOptions) !== prevParserOptions) {parserOptionsHash = (0, _hash.hashObject)({ parserOptions: parserOptions }).digest('hex');prevParserOptions = JSON.stringify(parserOptions);}return { cacheKey: String(parserPath) + parserOptionsHash + settingsHash + String(path), settings: settings, parserOptions: parserOptions, parserPath: parserPath, path: path };} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * sometimes legacy support isn't _that_ hard... right?
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */function makeSourceCode(text, ast) {if (_eslint.SourceCode.length > 1) {// ESLint 3
    return new _eslint.SourceCode(text, ast);} else {// ESLint 4, 5
    return new _eslint.SourceCode({ text: text, ast: ast });}}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9FeHBvcnRNYXAuanMiXSwibmFtZXMiOlsicmVjdXJzaXZlUGF0dGVybkNhcHR1cmUiLCJ1bmFtYmlndW91cyIsInRzIiwibG9nIiwiZXhwb3J0Q2FjaGUiLCJNYXAiLCJ0c2NvbmZpZ0NhY2hlIiwiRXhwb3J0TWFwIiwicGF0aCIsIm5hbWVzcGFjZSIsInJlZXhwb3J0cyIsImRlcGVuZGVuY2llcyIsIlNldCIsImltcG9ydHMiLCJlcnJvcnMiLCJwYXJzZUdvYWwiLCJuYW1lIiwiaGFzIiwiZGVwIiwiaW5uZXJNYXAiLCJmb3VuZCIsImdldCIsImltcG9ydGVkIiwiZ2V0SW1wb3J0IiwibG9jYWwiLCJkZWVwIiwiaGFzRGVlcCIsInVuc2hpZnQiLCJpbm5lclZhbHVlIiwidW5kZWZpbmVkIiwiY2FsbGJhY2siLCJ0aGlzQXJnIiwiZm9yRWFjaCIsInYiLCJuIiwiY2FsbCIsInJlZXhwb3J0ZWQiLCJkIiwiY29udGV4dCIsImRlY2xhcmF0aW9uIiwibXNnIiwibWFwIiwiZSIsIm1lc3NhZ2UiLCJsaW5lTnVtYmVyIiwiY29sdW1uIiwiam9pbiIsInJlcG9ydCIsIm5vZGUiLCJzb3VyY2UiLCJ2YWx1ZSIsInNpemUiLCJjYXB0dXJlRG9jIiwiZG9jU3R5bGVQYXJzZXJzIiwibWV0YWRhdGEiLCJub2RlcyIsInNvbWUiLCJsZWFkaW5nQ29tbWVudHMiLCJyYW5nZSIsImdldENvbW1lbnRzQmVmb3JlIiwibGVuZ3RoIiwiZG9jIiwiZXJyIiwiYXZhaWxhYmxlRG9jU3R5bGVQYXJzZXJzIiwianNkb2MiLCJjYXB0dXJlSnNEb2MiLCJ0b21kb2MiLCJjYXB0dXJlVG9tRG9jIiwiY29tbWVudHMiLCJjb21tZW50IiwidHlwZSIsImRvY3RyaW5lIiwicGFyc2UiLCJ1bndyYXAiLCJsaW5lcyIsImkiLCJtYXRjaCIsInB1c2giLCJ0cmltIiwic3RhdHVzTWF0Y2giLCJkZXNjcmlwdGlvbiIsInRhZ3MiLCJ0aXRsZSIsInRvTG93ZXJDYXNlIiwic3VwcG9ydGVkSW1wb3J0VHlwZXMiLCJjaGlsZENvbnRleHQiLCJjYWNoZUtleSIsImRpZ2VzdCIsImV4cG9ydE1hcCIsInN0YXRzIiwiZnMiLCJzdGF0U3luYyIsIm10aW1lIiwic2V0IiwiY29udGVudCIsInJlYWRGaWxlU3luYyIsImVuY29kaW5nIiwidGVzdCIsIm0iLCJpc0VzTW9kdWxlSW50ZXJvcFRydWUiLCJpc0VzTW9kdWxlSW50ZXJvcCIsImFzdCIsInZpc2l0b3JLZXlzIiwicmVzdWx0IiwiaGFzRHluYW1pY0ltcG9ydHMiLCJwcm9jZXNzRHluYW1pY0ltcG9ydCIsInAiLCJyZW1vdGVQYXRoIiwiaW1wb3J0ZWRTcGVjaWZpZXJzIiwiYWRkIiwiZ2V0dGVyIiwidGh1bmtGb3IiLCJkZWNsYXJhdGlvbnMiLCJsb2MiLCJkeW5hbWljIiwiSW1wb3J0RXhwcmVzc2lvbiIsIkNhbGxFeHByZXNzaW9uIiwiY2FsbGVlIiwiYXJndW1lbnRzIiwidW5hbWJpZ3VvdXNseUVTTSIsImlzTW9kdWxlIiwiZG9jc3R5bGUiLCJzZXR0aW5ncyIsInN0eWxlIiwiYyIsInQiLCJuYW1lc3BhY2VzIiwicmVzb2x2ZSIsInJlbGF0aXZlIiwicmVzb2x2ZUltcG9ydCIsInJwIiwiZ2V0TmFtZXNwYWNlIiwiaWRlbnRpZmllciIsImFkZE5hbWVzcGFjZSIsIm9iamVjdCIsIm5zZm4iLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsInByb2Nlc3NTcGVjaWZpZXIiLCJzIiwibnNvdXJjZSIsImV4cG9ydE1ldGEiLCJleHBvcnRlZCIsImNhcHR1cmVEZXBlbmRlbmN5V2l0aFNwZWNpZmllcnMiLCJkZWNsYXJhdGlvbklzVHlwZSIsImltcG9ydEtpbmQiLCJzcGVjaWZpZXJzT25seUltcG9ydGluZ1R5cGVzIiwic3BlY2lmaWVycyIsInNwZWNpZmllciIsImNhcHR1cmVEZXBlbmRlbmN5IiwiaXNPbmx5SW1wb3J0aW5nVHlwZXMiLCJkZWNsYXJhdGlvbk1ldGFkYXRhIiwiZXhpc3RpbmciLCJtYWtlU291cmNlQ29kZSIsInJlYWRUc0NvbmZpZyIsInRzY29uZmlnSW5mbyIsImN3ZCIsInBhcnNlck9wdGlvbnMiLCJ0c2NvbmZpZ1Jvb3REaXIiLCJwcm9jZXNzIiwiZ2V0RW52Iiwia2V5IiwiZW52IiwidHNDb25maWdQYXRoIiwicmVxdWlyZSIsImNvbmZpZ0ZpbGUiLCJyZWFkQ29uZmlnRmlsZSIsInN5cyIsInJlYWRGaWxlIiwicGFyc2VKc29uQ29uZmlnRmlsZUNvbnRlbnQiLCJjb25maWciLCJ0c0NvbmZpZyIsIm9wdGlvbnMiLCJlc01vZHVsZUludGVyb3AiLCJib2R5IiwiZXhwb3J0S2luZCIsIm5zIiwiZmluZCIsImlkIiwiZXhwb3J0cyIsImV4cG9ydGVkTmFtZSIsImV4cHJlc3Npb24iLCJkZWNsVHlwZXMiLCJleHBvcnRlZERlY2xzIiwiZmlsdGVyIiwiZGVjbCIsIm1vZHVsZUJsb2NrTm9kZSIsIm5hbWVzcGFjZURlY2wiLCJwYXR0ZXJuIiwicHJvcGVydGllcyIsImFyZ3VtZW50IiwiZWxlbWVudHMiLCJlbGVtZW50IiwibGVmdCIsInBhcnNlck9wdGlvbnNIYXNoIiwicHJldlBhcnNlck9wdGlvbnMiLCJzZXR0aW5nc0hhc2giLCJwcmV2U2V0dGluZ3MiLCJwYXJzZXJQYXRoIiwiSlNPTiIsInN0cmluZ2lmeSIsIlN0cmluZyIsInRleHQiLCJTb3VyY2VDb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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QUFlLEVBQUVELFVBQUYsRUFBUXJHLFFBQVIsRUFBZixDQUFQLENBQ0QsQ0FDRiIsImZpbGUiOiJFeHBvcnRNYXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHsgZGlybmFtZSB9IGZyb20gJ3BhdGgnO1xuXG5pbXBvcnQgZG9jdHJpbmUgZnJvbSAnZG9jdHJpbmUnO1xuXG5pbXBvcnQgZGVidWcgZnJvbSAnZGVidWcnO1xuXG5pbXBvcnQgeyBTb3VyY2VDb2RlIH0gZnJvbSAnZXNsaW50JztcblxuaW1wb3J0IHBhcnNlIGZyb20gJ2VzbGludC1tb2R1bGUtdXRpbHMvcGFyc2UnO1xuaW1wb3J0IHZpc2l0IGZyb20gJ2VzbGludC1tb2R1bGUtdXRpbHMvdmlzaXQnO1xuaW1wb3J0IHJlc29sdmUgZnJvbSAnZXNsaW50LW1vZHVsZS11dGlscy9yZXNvbHZlJztcbmltcG9ydCBpc0lnbm9yZWQsIHsgaGFzVmFsaWRFeHRlbnNpb24gfSBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL2lnbm9yZSc7XG5cbmltcG9ydCB7IGhhc2hPYmplY3QgfSBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL2hhc2gnO1xuaW1wb3J0ICogYXMgdW5hbWJpZ3VvdXMgZnJvbSAnZXNsaW50LW1vZHVsZS11dGlscy91bmFtYmlndW91cyc7XG5cbmltcG9ydCB7IHRzQ29uZmlnTG9hZGVyIH0gZnJvbSAndHNjb25maWctcGF0aHMvbGliL3RzY29uZmlnLWxvYWRlcic7XG5cbmltcG9ydCBpbmNsdWRlcyBmcm9tICdhcnJheS1pbmNsdWRlcyc7XG5cbmxldCB0cztcblxuY29uc3QgbG9nID0gZGVidWcoJ2VzbGludC1wbHVnaW4taW1wb3J0OkV4cG9ydE1hcCcpO1xuXG5jb25zdCBleHBvcnRDYWNoZSA9IG5ldyBNYXAoKTtcbmNvbnN0IHRzY29uZmlnQ2FjaGUgPSBuZXcgTWFwKCk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV4cG9ydE1hcCB7XG4gIGNvbnN0cnVjdG9yKHBhdGgpIHtcbiAgICB0aGlzLnBhdGggPSBwYXRoO1xuICAgIHRoaXMubmFtZXNwYWNlID0gbmV3IE1hcCgpO1xuICAgIC8vIHRvZG86IHJlc3RydWN0dXJlIHRvIGtleSBvbiBwYXRoLCB2YWx1ZSBpcyByZXNvbHZlciArIG1hcCBvZiBuYW1lc1xuICAgIHRoaXMucmVleHBvcnRzID0gbmV3IE1hcCgpO1xuICAgIC8qKlxuICAgICAqIHN0YXItZXhwb3J0c1xuICAgICAqIEB0eXBlIHtTZXR9IG9mICgpID0+IEV4cG9ydE1hcFxuICAgICAqL1xuICAgIHRoaXMuZGVwZW5kZW5jaWVzID0gbmV3IFNldCgpO1xuICAgIC8qKlxuICAgICAqIGRlcGVuZGVuY2llcyBvZiB0aGlzIG1vZHVsZSB0aGF0IGFyZSBub3QgZXhwbGljaXRseSByZS1leHBvcnRlZFxuICAgICAqIEB0eXBlIHtNYXB9IGZyb20gcGF0aCA9ICgpID0+IEV4cG9ydE1hcFxuICAgICAqL1xuICAgIHRoaXMuaW1wb3J0cyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmVycm9ycyA9IFtdO1xuICAgIC8qKlxuICAgICAqIHR5cGUgeydhbWJpZ3VvdXMnIHwgJ01vZHVsZScgfCAnU2NyaXB0J31cbiAgICAgKi9cbiAgICB0aGlzLnBhcnNlR29hbCA9ICdhbWJpZ3VvdXMnO1xuICB9XG5cbiAgZ2V0IGhhc0RlZmF1bHQoKSB7IHJldHVybiB0aGlzLmdldCgnZGVmYXVsdCcpICE9IG51bGw7IH0gLy8gc3Ryb25nZXIgdGhhbiB0aGlzLmhhc1xuXG4gIGdldCBzaXplKCkge1xuICAgIGxldCBzaXplID0gdGhpcy5uYW1lc3BhY2Uuc2l6ZSArIHRoaXMucmVleHBvcnRzLnNpemU7XG4gICAgdGhpcy5kZXBlbmRlbmNpZXMuZm9yRWFjaCgoZGVwKSA9PiB7XG4gICAgICBjb25zdCBkID0gZGVwKCk7XG4gICAgICAvLyBDSlMgLyBpZ25vcmVkIGRlcGVuZGVuY2llcyB3b24ndCBleGlzdCAoIzcxNylcbiAgICAgIGlmIChkID09IG51bGwpIHsgcmV0dXJuOyB9XG4gICAgICBzaXplICs9IGQuc2l6ZTtcbiAgICB9KTtcbiAgICByZXR1cm4gc2l6ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBOb3RlIHRoYXQgdGhpcyBkb2VzIG5vdCBjaGVjayBleHBsaWNpdGx5IHJlLWV4cG9ydGVkIG5hbWVzIGZvciBleGlzdGVuY2VcbiAgICogaW4gdGhlIGJhc2UgbmFtZXNwYWNlLCBidXQgaXQgd2lsbCBleHBhbmQgYWxsIGBleHBvcnQgKiBmcm9tICcuLi4nYCBleHBvcnRzXG4gICAqIGlmIG5vdCBmb3VuZCBpbiB0aGUgZXhwbGljaXQgbmFtZXNwYWNlLlxuICAgKiBAcGFyYW0gIHtzdHJpbmd9ICBuYW1lXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgYG5hbWVgIGlzIGV4cG9ydGVkIGJ5IHRoaXMgbW9kdWxlLlxuICAgKi9cbiAgaGFzKG5hbWUpIHtcbiAgICBpZiAodGhpcy5uYW1lc3BhY2UuaGFzKG5hbWUpKSB7IHJldHVybiB0cnVlOyB9XG4gICAgaWYgKHRoaXMucmVleHBvcnRzLmhhcyhuYW1lKSkgeyByZXR1cm4gdHJ1ZTsgfVxuXG4gICAgLy8gZGVmYXVsdCBleHBvcnRzIG11c3QgYmUgZXhwbGljaXRseSByZS1leHBvcnRlZCAoIzMyOClcbiAgICBpZiAobmFtZSAhPT0gJ2RlZmF1bHQnKSB7XG4gICAgICBmb3IgKGNvbnN0IGRlcCBvZiB0aGlzLmRlcGVuZGVuY2llcykge1xuICAgICAgICBjb25zdCBpbm5lck1hcCA9IGRlcCgpO1xuXG4gICAgICAgIC8vIHRvZG86IHJlcG9ydCBhcyB1bnJlc29sdmVkP1xuICAgICAgICBpZiAoIWlubmVyTWFwKSB7IGNvbnRpbnVlOyB9XG5cbiAgICAgICAgaWYgKGlubmVyTWFwLmhhcyhuYW1lKSkgeyByZXR1cm4gdHJ1ZTsgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBlbnN1cmUgdGhhdCBpbXBvcnRlZCBuYW1lIGZ1bGx5IHJlc29sdmVzLlxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IG5hbWVcbiAgICogQHJldHVybiB7eyBmb3VuZDogYm9vbGVhbiwgcGF0aDogRXhwb3J0TWFwW10gfX1cbiAgICovXG4gIGhhc0RlZXAobmFtZSkge1xuICAgIGlmICh0aGlzLm5hbWVzcGFjZS5oYXMobmFtZSkpIHsgcmV0dXJuIHsgZm91bmQ6IHRydWUsIHBhdGg6IFt0aGlzXSB9OyB9XG5cbiAgICBpZiAodGhpcy5yZWV4cG9ydHMuaGFzKG5hbWUpKSB7XG4gICAgICBjb25zdCByZWV4cG9ydHMgPSB0aGlzLnJlZXhwb3J0cy5nZXQobmFtZSk7XG4gICAgICBjb25zdCBpbXBvcnRlZCA9IHJlZXhwb3J0cy5nZXRJbXBvcnQoKTtcblxuICAgICAgLy8gaWYgaW1wb3J0IGlzIGlnbm9yZWQsIHJldHVybiBleHBsaWNpdCAnbnVsbCdcbiAgICAgIGlmIChpbXBvcnRlZCA9PSBudWxsKSB7IHJldHVybiB7IGZvdW5kOiB0cnVlLCBwYXRoOiBbdGhpc10gfTsgfVxuXG4gICAgICAvLyBzYWZlZ3VhcmQgYWdhaW5zdCBjeWNsZXMsIG9ubHkgaWYgbmFtZSBtYXRjaGVzXG4gICAgICBpZiAoaW1wb3J0ZWQucGF0aCA9PT0gdGhpcy5wYXRoICYmIHJlZXhwb3J0cy5sb2NhbCA9PT0gbmFtZSkge1xuICAgICAgICByZXR1cm4geyBmb3VuZDogZmFsc2UsIHBhdGg6IFt0aGlzXSB9O1xuICAgICAgfVxuXG4gICAgICBjb25zdCBkZWVwID0gaW1wb3J0ZWQuaGFzRGVlcChyZWV4cG9ydHMubG9jYWwpO1xuICAgICAgZGVlcC5wYXRoLnVuc2hpZnQodGhpcyk7XG5cbiAgICAgIHJldHVybiBkZWVwO1xuICAgIH1cblxuICAgIC8vIGRlZmF1bHQgZXhwb3J0cyBtdXN0IGJlIGV4cGxpY2l0bHkgcmUtZXhwb3J0ZWQgKCMzMjgpXG4gICAgaWYgKG5hbWUgIT09ICdkZWZhdWx0Jykge1xuICAgICAgZm9yIChjb25zdCBkZXAgb2YgdGhpcy5kZXBlbmRlbmNpZXMpIHtcbiAgICAgICAgY29uc3QgaW5uZXJNYXAgPSBkZXAoKTtcbiAgICAgICAgaWYgKGlubmVyTWFwID09IG51bGwpIHsgcmV0dXJuIHsgZm91bmQ6IHRydWUsIHBhdGg6IFt0aGlzXSB9OyB9XG4gICAgICAgIC8vIHRvZG86IHJlcG9ydCBhcyB1bnJlc29sdmVkP1xuICAgICAgICBpZiAoIWlubmVyTWFwKSB7IGNvbnRpbnVlOyB9XG5cbiAgICAgICAgLy8gc2FmZWd1YXJkIGFnYWluc3QgY3ljbGVzXG4gICAgICAgIGlmIChpbm5lck1hcC5wYXRoID09PSB0aGlzLnBhdGgpIHsgY29udGludWU7IH1cblxuICAgICAgICBjb25zdCBpbm5lclZhbHVlID0gaW5uZXJNYXAuaGFzRGVlcChuYW1lKTtcbiAgICAgICAgaWYgKGlubmVyVmFsdWUuZm91bmQpIHtcbiAgICAgICAgICBpbm5lclZhbHVlLnBhdGgudW5zaGlmdCh0aGlzKTtcbiAgICAgICAgICByZXR1cm4gaW5uZXJWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7IGZvdW5kOiBmYWxzZSwgcGF0aDogW3RoaXNdIH07XG4gIH1cblxuICBnZXQobmFtZSkge1xuICAgIGlmICh0aGlzLm5hbWVzcGFjZS5oYXMobmFtZSkpIHsgcmV0dXJuIHRoaXMubmFtZXNwYWNlLmdldChuYW1lKTsgfVxuXG4gICAgaWYgKHRoaXMucmVleHBvcnRzLmhhcyhuYW1lKSkge1xuICAgICAgY29uc3QgcmVleHBvcnRzID0gdGhpcy5yZWV4cG9ydHMuZ2V0KG5hbWUpO1xuICAgICAgY29uc3QgaW1wb3J0ZWQgPSByZWV4cG9ydHMuZ2V0SW1wb3J0KCk7XG5cbiAgICAgIC8vIGlmIGltcG9ydCBpcyBpZ25vcmVkLCByZXR1cm4gZXhwbGljaXQgJ251bGwnXG4gICAgICBpZiAoaW1wb3J0ZWQgPT0gbnVsbCkgeyByZXR1cm4gbnVsbDsgfVxuXG4gICAgICAvLyBzYWZlZ3VhcmQgYWdhaW5zdCBjeWNsZXMsIG9ubHkgaWYgbmFtZSBtYXRjaGVzXG4gICAgICBpZiAoaW1wb3J0ZWQucGF0aCA9PT0gdGhpcy5wYXRoICYmIHJlZXhwb3J0cy5sb2NhbCA9PT0gbmFtZSkgeyByZXR1cm4gdW5kZWZpbmVkOyB9XG5cbiAgICAgIHJldHVybiBpbXBvcnRlZC5nZXQocmVleHBvcnRzLmxvY2FsKTtcbiAgICB9XG5cbiAgICAvLyBkZWZhdWx0IGV4cG9ydHMgbXVzdCBiZSBleHBsaWNpdGx5IHJlLWV4cG9ydGVkICgjMzI4KVxuICAgIGlmIChuYW1lICE9PSAnZGVmYXVsdCcpIHtcbiAgICAgIGZvciAoY29uc3QgZGVwIG9mIHRoaXMuZGVwZW5kZW5jaWVzKSB7XG4gICAgICAgIGNvbnN0IGlubmVyTWFwID0gZGVwKCk7XG4gICAgICAgIC8vIHRvZG86IHJlcG9ydCBhcyB1bnJlc29sdmVkP1xuICAgICAgICBpZiAoIWlubmVyTWFwKSB7IGNvbnRpbnVlOyB9XG5cbiAgICAgICAgLy8gc2FmZWd1YXJkIGFnYWluc3QgY3ljbGVzXG4gICAgICAgIGlmIChpbm5lck1hcC5wYXRoID09PSB0aGlzLnBhdGgpIHsgY29udGludWU7IH1cblxuICAgICAgICBjb25zdCBpbm5lclZhbHVlID0gaW5uZXJNYXAuZ2V0KG5hbWUpO1xuICAgICAgICBpZiAoaW5uZXJWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7IHJldHVybiBpbm5lclZhbHVlOyB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZvckVhY2goY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICB0aGlzLm5hbWVzcGFjZS5mb3JFYWNoKCh2LCBuKSA9PiB7IGNhbGxiYWNrLmNhbGwodGhpc0FyZywgdiwgbiwgdGhpcyk7IH0pO1xuXG4gICAgdGhpcy5yZWV4cG9ydHMuZm9yRWFjaCgocmVleHBvcnRzLCBuYW1lKSA9PiB7XG4gICAgICBjb25zdCByZWV4cG9ydGVkID0gcmVleHBvcnRzLmdldEltcG9ydCgpO1xuICAgICAgLy8gY2FuJ3QgbG9vayB1cCBtZXRhIGZvciBpZ25vcmVkIHJlLWV4cG9ydHMgKCMzNDgpXG4gICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHJlZXhwb3J0ZWQgJiYgcmVleHBvcnRlZC5nZXQocmVleHBvcnRzLmxvY2FsKSwgbmFtZSwgdGhpcyk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmRlcGVuZGVuY2llcy5mb3JFYWNoKChkZXApID0+IHtcbiAgICAgIGNvbnN0IGQgPSBkZXAoKTtcbiAgICAgIC8vIENKUyAvIGlnbm9yZWQgZGVwZW5kZW5jaWVzIHdvbid0IGV4aXN0ICgjNzE3KVxuICAgICAgaWYgKGQgPT0gbnVsbCkgeyByZXR1cm47IH1cblxuICAgICAgZC5mb3JFYWNoKCh2LCBuKSA9PiB7XG4gICAgICAgIGlmIChuICE9PSAnZGVmYXVsdCcpIHtcbiAgICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHYsIG4sIHRoaXMpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIHRvZG86IGtleXMsIHZhbHVlcywgZW50cmllcz9cblxuICByZXBvcnRFcnJvcnMoY29udGV4dCwgZGVjbGFyYXRpb24pIHtcbiAgICBjb25zdCBtc2cgPSB0aGlzLmVycm9yc1xuICAgICAgLm1hcCgoZSkgPT4gYCR7ZS5tZXNzYWdlfSAoJHtlLmxpbmVOdW1iZXJ9OiR7ZS5jb2x1bW59KWApXG4gICAgICAuam9pbignLCAnKTtcbiAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICBub2RlOiBkZWNsYXJhdGlvbi5zb3VyY2UsXG4gICAgICBtZXNzYWdlOiBgUGFyc2UgZXJyb3JzIGluIGltcG9ydGVkIG1vZHVsZSAnJHtkZWNsYXJhdGlvbi5zb3VyY2UudmFsdWV9JzogJHttc2d9YCxcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIHBhcnNlIGRvY3MgZnJvbSB0aGUgZmlyc3Qgbm9kZSB0aGF0IGhhcyBsZWFkaW5nIGNvbW1lbnRzXG4gKi9cbmZ1bmN0aW9uIGNhcHR1cmVEb2Moc291cmNlLCBkb2NTdHlsZVBhcnNlcnMsIC4uLm5vZGVzKSB7XG4gIGNvbnN0IG1ldGFkYXRhID0ge307XG5cbiAgLy8gJ3NvbWUnIHNob3J0LWNpcmN1aXRzIG9uIGZpcnN0ICd0cnVlJ1xuICBub2Rlcy5zb21lKChuKSA9PiB7XG4gICAgdHJ5IHtcblxuICAgICAgbGV0IGxlYWRpbmdDb21tZW50cztcblxuICAgICAgLy8gbi5sZWFkaW5nQ29tbWVudHMgaXMgbGVnYWN5IGBhdHRhY2hDb21tZW50c2AgYmVoYXZpb3JcbiAgICAgIGlmICgnbGVhZGluZ0NvbW1lbnRzJyBpbiBuKSB7XG4gICAgICAgIGxlYWRpbmdDb21tZW50cyA9IG4ubGVhZGluZ0NvbW1lbnRzO1xuICAgICAgfSBlbHNlIGlmIChuLnJhbmdlKSB7XG4gICAgICAgIGxlYWRpbmdDb21tZW50cyA9IHNvdXJjZS5nZXRDb21tZW50c0JlZm9yZShuKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFsZWFkaW5nQ29tbWVudHMgfHwgbGVhZGluZ0NvbW1lbnRzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gZmFsc2U7IH1cblxuICAgICAgZm9yIChjb25zdCBuYW1lIGluIGRvY1N0eWxlUGFyc2Vycykge1xuICAgICAgICBjb25zdCBkb2MgPSBkb2NTdHlsZVBhcnNlcnNbbmFtZV0obGVhZGluZ0NvbW1lbnRzKTtcbiAgICAgICAgaWYgKGRvYykge1xuICAgICAgICAgIG1ldGFkYXRhLmRvYyA9IGRvYztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBtZXRhZGF0YTtcbn1cblxuY29uc3QgYXZhaWxhYmxlRG9jU3R5bGVQYXJzZXJzID0ge1xuICBqc2RvYzogY2FwdHVyZUpzRG9jLFxuICB0b21kb2M6IGNhcHR1cmVUb21Eb2MsXG59O1xuXG4vKipcbiAqIHBhcnNlIEpTRG9jIGZyb20gbGVhZGluZyBjb21tZW50c1xuICogQHBhcmFtIHtvYmplY3RbXX0gY29tbWVudHNcbiAqIEByZXR1cm4ge3sgZG9jOiBvYmplY3QgfX1cbiAqL1xuZnVuY3Rpb24gY2FwdHVyZUpzRG9jKGNvbW1lbnRzKSB7XG4gIGxldCBkb2M7XG5cbiAgLy8gY2FwdHVyZSBYU0RvY1xuICBjb21tZW50cy5mb3JFYWNoKChjb21tZW50KSA9PiB7XG4gICAgLy8gc2tpcCBub24tYmxvY2sgY29tbWVudHNcbiAgICBpZiAoY29tbWVudC50eXBlICE9PSAnQmxvY2snKSB7IHJldHVybjsgfVxuICAgIHRyeSB7XG4gICAgICBkb2MgPSBkb2N0cmluZS5wYXJzZShjb21tZW50LnZhbHVlLCB7IHVud3JhcDogdHJ1ZSB9KTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIC8qIGRvbid0IGNhcmUsIGZvciBub3c/IG1heWJlIGFkZCB0byBgZXJyb3JzP2AgKi9cbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBkb2M7XG59XG5cbi8qKlxuICAqIHBhcnNlIFRvbURvYyBzZWN0aW9uIGZyb20gY29tbWVudHNcbiAgKi9cbmZ1bmN0aW9uIGNhcHR1cmVUb21Eb2MoY29tbWVudHMpIHtcbiAgLy8gY29sbGVjdCBsaW5lcyB1cCB0byBmaXJzdCBwYXJhZ3JhcGggYnJlYWtcbiAgY29uc3QgbGluZXMgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb21tZW50cy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGNvbW1lbnQgPSBjb21tZW50c1tpXTtcbiAgICBpZiAoY29tbWVudC52YWx1ZS5tYXRjaCgvXlxccyokLykpIHsgYnJlYWs7IH1cbiAgICBsaW5lcy5wdXNoKGNvbW1lbnQudmFsdWUudHJpbSgpKTtcbiAgfVxuXG4gIC8vIHJldHVybiBkb2N0cmluZS1saWtlIG9iamVjdFxuICBjb25zdCBzdGF0dXNNYXRjaCA9IGxpbmVzLmpvaW4oJyAnKS5tYXRjaCgvXihQdWJsaWN8SW50ZXJuYWx8RGVwcmVjYXRlZCk6XFxzKiguKykvKTtcbiAgaWYgKHN0YXR1c01hdGNoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRlc2NyaXB0aW9uOiBzdGF0dXNNYXRjaFsyXSxcbiAgICAgIHRhZ3M6IFt7XG4gICAgICAgIHRpdGxlOiBzdGF0dXNNYXRjaFsxXS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICBkZXNjcmlwdGlvbjogc3RhdHVzTWF0Y2hbMl0sXG4gICAgICB9XSxcbiAgICB9O1xuICB9XG59XG5cbmNvbnN0IHN1cHBvcnRlZEltcG9ydFR5cGVzID0gbmV3IFNldChbJ0ltcG9ydERlZmF1bHRTcGVjaWZpZXInLCAnSW1wb3J0TmFtZXNwYWNlU3BlY2lmaWVyJ10pO1xuXG5FeHBvcnRNYXAuZ2V0ID0gZnVuY3Rpb24gKHNvdXJjZSwgY29udGV4dCkge1xuICBjb25zdCBwYXRoID0gcmVzb2x2ZShzb3VyY2UsIGNvbnRleHQpO1xuICBpZiAocGF0aCA9PSBudWxsKSB7IHJldHVybiBudWxsOyB9XG5cbiAgcmV0dXJuIEV4cG9ydE1hcC5mb3IoY2hpbGRDb250ZXh0KHBhdGgsIGNvbnRleHQpKTtcbn07XG5cbkV4cG9ydE1hcC5mb3IgPSBmdW5jdGlvbiAoY29udGV4dCkge1xuICBjb25zdCB7IHBhdGggfSA9IGNvbnRleHQ7XG5cbiAgY29uc3QgY2FjaGVLZXkgPSBjb250ZXh0LmNhY2hlS2V5IHx8IGhhc2hPYmplY3QoY29udGV4dCkuZGlnZXN0KCdoZXgnKTtcbiAgbGV0IGV4cG9ydE1hcCA9IGV4cG9ydENhY2hlLmdldChjYWNoZUtleSk7XG5cbiAgLy8gcmV0dXJuIGNhY2hlZCBpZ25vcmVcbiAgaWYgKGV4cG9ydE1hcCA9PT0gbnVsbCkgeyByZXR1cm4gbnVsbDsgfVxuXG4gIGNvbnN0IHN0YXRzID0gZnMuc3RhdFN5bmMocGF0aCk7XG4gIGlmIChleHBvcnRNYXAgIT0gbnVsbCkge1xuICAgIC8vIGRhdGUgZXF1YWxpdHkgY2hlY2tcbiAgICBpZiAoZXhwb3J0TWFwLm10aW1lIC0gc3RhdHMubXRpbWUgPT09IDApIHtcbiAgICAgIHJldHVybiBleHBvcnRNYXA7XG4gICAgfVxuICAgIC8vIGZ1dHVyZTogY2hlY2sgY29udGVudCBlcXVhbGl0eT9cbiAgfVxuXG4gIC8vIGNoZWNrIHZhbGlkIGV4dGVuc2lvbnMgZmlyc3RcbiAgaWYgKCFoYXNWYWxpZEV4dGVuc2lvbihwYXRoLCBjb250ZXh0KSkge1xuICAgIGV4cG9ydENhY2hlLnNldChjYWNoZUtleSwgbnVsbCk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyBjaGVjayBmb3IgYW5kIGNhY2hlIGlnbm9yZVxuICBpZiAoaXNJZ25vcmVkKHBhdGgsIGNvbnRleHQpKSB7XG4gICAgbG9nKCdpZ25vcmVkIHBhdGggZHVlIHRvIGlnbm9yZSBzZXR0aW5nczonLCBwYXRoKTtcbiAgICBleHBvcnRDYWNoZS5zZXQoY2FjaGVLZXksIG51bGwpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgY29udGVudCA9IGZzLnJlYWRGaWxlU3luYyhwYXRoLCB7IGVuY29kaW5nOiAndXRmOCcgfSk7XG5cbiAgLy8gY2hlY2sgZm9yIGFuZCBjYWNoZSB1bmFtYmlndW91cyBtb2R1bGVzXG4gIGlmICghdW5hbWJpZ3VvdXMudGVzdChjb250ZW50KSkge1xuICAgIGxvZygnaWdub3JlZCBwYXRoIGR1ZSB0byB1bmFtYmlndW91cyByZWdleDonLCBwYXRoKTtcbiAgICBleHBvcnRDYWNoZS5zZXQoY2FjaGVLZXksIG51bGwpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgbG9nKCdjYWNoZSBtaXNzJywgY2FjaGVLZXksICdmb3IgcGF0aCcsIHBhdGgpO1xuICBleHBvcnRNYXAgPSBFeHBvcnRNYXAucGFyc2UocGF0aCwgY29udGVudCwgY29udGV4dCk7XG5cbiAgLy8gYW1iaWd1b3VzIG1vZHVsZXMgcmV0dXJuIG51bGxcbiAgaWYgKGV4cG9ydE1hcCA9PSBudWxsKSB7XG4gICAgbG9nKCdpZ25vcmVkIHBhdGggZHVlIHRvIGFtYmlndW91cyBwYXJzZTonLCBwYXRoKTtcbiAgICBleHBvcnRDYWNoZS5zZXQoY2FjaGVLZXksIG51bGwpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZXhwb3J0TWFwLm10aW1lID0gc3RhdHMubXRpbWU7XG5cbiAgZXhwb3J0Q2FjaGUuc2V0KGNhY2hlS2V5LCBleHBvcnRNYXApO1xuICByZXR1cm4gZXhwb3J0TWFwO1xufTtcblxuRXhwb3J0TWFwLnBhcnNlID0gZnVuY3Rpb24gKHBhdGgsIGNvbnRlbnQsIGNvbnRleHQpIHtcbiAgY29uc3QgbSA9IG5ldyBFeHBvcnRNYXAocGF0aCk7XG4gIGNvbnN0IGlzRXNNb2R1bGVJbnRlcm9wVHJ1ZSA9IGlzRXNNb2R1bGVJbnRlcm9wKCk7XG5cbiAgbGV0IGFzdDtcbiAgbGV0IHZpc2l0b3JLZXlzO1xuICB0cnkge1xuICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlKHBhdGgsIGNvbnRlbnQsIGNvbnRleHQpO1xuICAgIGFzdCA9IHJlc3VsdC5hc3Q7XG4gICAgdmlzaXRvcktleXMgPSByZXN1bHQudmlzaXRvcktleXM7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIG0uZXJyb3JzLnB1c2goZXJyKTtcbiAgICByZXR1cm4gbTsgLy8gY2FuJ3QgY29udGludWVcbiAgfVxuXG4gIG0udmlzaXRvcktleXMgPSB2aXNpdG9yS2V5cztcblxuICBsZXQgaGFzRHluYW1pY0ltcG9ydHMgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBwcm9jZXNzRHluYW1pY0ltcG9ydChzb3VyY2UpIHtcbiAgICBoYXNEeW5hbWljSW1wb3J0cyA9IHRydWU7XG4gICAgaWYgKHNvdXJjZS50eXBlICE9PSAnTGl0ZXJhbCcpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBwID0gcmVtb3RlUGF0aChzb3VyY2UudmFsdWUpO1xuICAgIGlmIChwID09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBpbXBvcnRlZFNwZWNpZmllcnMgPSBuZXcgU2V0KCk7XG4gICAgaW1wb3J0ZWRTcGVjaWZpZXJzLmFkZCgnSW1wb3J0TmFtZXNwYWNlU3BlY2lmaWVyJyk7XG4gICAgY29uc3QgZ2V0dGVyID0gdGh1bmtGb3IocCwgY29udGV4dCk7XG4gICAgbS5pbXBvcnRzLnNldChwLCB7XG4gICAgICBnZXR0ZXIsXG4gICAgICBkZWNsYXJhdGlvbnM6IG5ldyBTZXQoW3tcbiAgICAgICAgc291cmNlOiB7XG4gICAgICAgIC8vIGNhcHR1cmluZyBhY3R1YWwgbm9kZSByZWZlcmVuY2UgaG9sZHMgZnVsbCBBU1QgaW4gbWVtb3J5IVxuICAgICAgICAgIHZhbHVlOiBzb3VyY2UudmFsdWUsXG4gICAgICAgICAgbG9jOiBzb3VyY2UubG9jLFxuICAgICAgICB9LFxuICAgICAgICBpbXBvcnRlZFNwZWNpZmllcnMsXG4gICAgICAgIGR5bmFtaWM6IHRydWUsXG4gICAgICB9XSksXG4gICAgfSk7XG4gIH1cblxuICB2aXNpdChhc3QsIHZpc2l0b3JLZXlzLCB7XG4gICAgSW1wb3J0RXhwcmVzc2lvbihub2RlKSB7XG4gICAgICBwcm9jZXNzRHluYW1pY0ltcG9ydChub2RlLnNvdXJjZSk7XG4gICAgfSxcbiAgICBDYWxsRXhwcmVzc2lvbihub2RlKSB7XG4gICAgICBpZiAobm9kZS5jYWxsZWUudHlwZSA9PT0gJ0ltcG9ydCcpIHtcbiAgICAgICAgcHJvY2Vzc0R5bmFtaWNJbXBvcnQobm9kZS5hcmd1bWVudHNbMF0pO1xuICAgICAgfVxuICAgIH0sXG4gIH0pO1xuXG4gIGNvbnN0IHVuYW1iaWd1b3VzbHlFU00gPSB1bmFtYmlndW91cy5pc01vZHVsZShhc3QpO1xuICBpZiAoIXVuYW1iaWd1b3VzbHlFU00gJiYgIWhhc0R5bmFtaWNJbXBvcnRzKSB7IHJldHVybiBudWxsOyB9XG5cbiAgY29uc3QgZG9jc3R5bGUgPSBjb250ZXh0LnNldHRpbmdzICYmIGNvbnRleHQuc2V0dGluZ3NbJ2ltcG9ydC9kb2NzdHlsZSddIHx8IFsnanNkb2MnXTtcbiAgY29uc3QgZG9jU3R5bGVQYXJzZXJzID0ge307XG4gIGRvY3N0eWxlLmZvckVhY2goKHN0eWxlKSA9PiB7XG4gICAgZG9jU3R5bGVQYXJzZXJzW3N0eWxlXSA9IGF2YWlsYWJsZURvY1N0eWxlUGFyc2Vyc1tzdHlsZV07XG4gIH0pO1xuXG4gIC8vIGF0dGVtcHQgdG8gY29sbGVjdCBtb2R1bGUgZG9jXG4gIGlmIChhc3QuY29tbWVudHMpIHtcbiAgICBhc3QuY29tbWVudHMuc29tZSgoYykgPT4ge1xuICAgICAgaWYgKGMudHlwZSAhPT0gJ0Jsb2NrJykgeyByZXR1cm4gZmFsc2U7IH1cbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGRvYyA9IGRvY3RyaW5lLnBhcnNlKGMudmFsdWUsIHsgdW53cmFwOiB0cnVlIH0pO1xuICAgICAgICBpZiAoZG9jLnRhZ3Muc29tZSgodCkgPT4gdC50aXRsZSA9PT0gJ21vZHVsZScpKSB7XG4gICAgICAgICAgbS5kb2MgPSBkb2M7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycikgeyAvKiBpZ25vcmUgKi8gfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuICB9XG5cbiAgY29uc3QgbmFtZXNwYWNlcyA9IG5ldyBNYXAoKTtcblxuICBmdW5jdGlvbiByZW1vdGVQYXRoKHZhbHVlKSB7XG4gICAgcmV0dXJuIHJlc29sdmUucmVsYXRpdmUodmFsdWUsIHBhdGgsIGNvbnRleHQuc2V0dGluZ3MpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzb2x2ZUltcG9ydCh2YWx1ZSkge1xuICAgIGNvbnN0IHJwID0gcmVtb3RlUGF0aCh2YWx1ZSk7XG4gICAgaWYgKHJwID09IG51bGwpIHsgcmV0dXJuIG51bGw7IH1cbiAgICByZXR1cm4gRXhwb3J0TWFwLmZvcihjaGlsZENvbnRleHQocnAsIGNvbnRleHQpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldE5hbWVzcGFjZShpZGVudGlmaWVyKSB7XG4gICAgaWYgKCFuYW1lc3BhY2VzLmhhcyhpZGVudGlmaWVyLm5hbWUpKSB7IHJldHVybjsgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiByZXNvbHZlSW1wb3J0KG5hbWVzcGFjZXMuZ2V0KGlkZW50aWZpZXIubmFtZSkpO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBhZGROYW1lc3BhY2Uob2JqZWN0LCBpZGVudGlmaWVyKSB7XG4gICAgY29uc3QgbnNmbiA9IGdldE5hbWVzcGFjZShpZGVudGlmaWVyKTtcbiAgICBpZiAobnNmbikge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ25hbWVzcGFjZScsIHsgZ2V0OiBuc2ZuIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cblxuICBmdW5jdGlvbiBwcm9jZXNzU3BlY2lmaWVyKHMsIG4sIG0pIHtcbiAgICBjb25zdCBuc291cmNlID0gbi5zb3VyY2UgJiYgbi5zb3VyY2UudmFsdWU7XG4gICAgY29uc3QgZXhwb3J0TWV0YSA9IHt9O1xuICAgIGxldCBsb2NhbDtcblxuICAgIHN3aXRjaCAocy50eXBlKSB7XG4gICAgICBjYXNlICdFeHBvcnREZWZhdWx0U3BlY2lmaWVyJzpcbiAgICAgICAgaWYgKCFuc291cmNlKSB7IHJldHVybjsgfVxuICAgICAgICBsb2NhbCA9ICdkZWZhdWx0JztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdFeHBvcnROYW1lc3BhY2VTcGVjaWZpZXInOlxuICAgICAgICBtLm5hbWVzcGFjZS5zZXQocy5leHBvcnRlZC5uYW1lLCBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0TWV0YSwgJ25hbWVzcGFjZScsIHtcbiAgICAgICAgICBnZXQoKSB7IHJldHVybiByZXNvbHZlSW1wb3J0KG5zb3VyY2UpOyB9LFxuICAgICAgICB9KSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIGNhc2UgJ0V4cG9ydEFsbERlY2xhcmF0aW9uJzpcbiAgICAgICAgbS5uYW1lc3BhY2Uuc2V0KHMuZXhwb3J0ZWQubmFtZSB8fCBzLmV4cG9ydGVkLnZhbHVlLCBhZGROYW1lc3BhY2UoZXhwb3J0TWV0YSwgcy5zb3VyY2UudmFsdWUpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgY2FzZSAnRXhwb3J0U3BlY2lmaWVyJzpcbiAgICAgICAgaWYgKCFuLnNvdXJjZSkge1xuICAgICAgICAgIG0ubmFtZXNwYWNlLnNldChzLmV4cG9ydGVkLm5hbWUgfHwgcy5leHBvcnRlZC52YWx1ZSwgYWRkTmFtZXNwYWNlKGV4cG9ydE1ldGEsIHMubG9jYWwpKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIC8vIGVsc2UgZmFsbHMgdGhyb3VnaFxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbG9jYWwgPSBzLmxvY2FsLm5hbWU7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIHRvZG86IEpTRG9jXG4gICAgbS5yZWV4cG9ydHMuc2V0KHMuZXhwb3J0ZWQubmFtZSwgeyBsb2NhbCwgZ2V0SW1wb3J0OiAoKSA9PiByZXNvbHZlSW1wb3J0KG5zb3VyY2UpIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gY2FwdHVyZURlcGVuZGVuY3lXaXRoU3BlY2lmaWVycyhuKSB7XG4gICAgLy8gaW1wb3J0IHR5cGUgeyBGb28gfSAoVFMgYW5kIEZsb3cpOyBpbXBvcnQgdHlwZW9mIHsgRm9vIH0gKEZsb3cpXG4gICAgY29uc3QgZGVjbGFyYXRpb25Jc1R5cGUgPSBuLmltcG9ydEtpbmQgPT09ICd0eXBlJyB8fCBuLmltcG9ydEtpbmQgPT09ICd0eXBlb2YnO1xuICAgIC8vIGltcG9ydCAnLi9mb28nIG9yIGltcG9ydCB7fSBmcm9tICcuL2ZvbycgKGJvdGggMCBzcGVjaWZpZXJzKSBpcyBhIHNpZGUgZWZmZWN0IGFuZFxuICAgIC8vIHNob3VsZG4ndCBiZSBjb25zaWRlcmVkIHRvIGJlIGp1c3QgaW1wb3J0aW5nIHR5cGVzXG4gICAgbGV0IHNwZWNpZmllcnNPbmx5SW1wb3J0aW5nVHlwZXMgPSBuLnNwZWNpZmllcnMubGVuZ3RoID4gMDtcbiAgICBjb25zdCBpbXBvcnRlZFNwZWNpZmllcnMgPSBuZXcgU2V0KCk7XG4gICAgbi5zcGVjaWZpZXJzLmZvckVhY2goKHNwZWNpZmllcikgPT4ge1xuICAgICAgaWYgKHNwZWNpZmllci50eXBlID09PSAnSW1wb3J0U3BlY2lmaWVyJykge1xuICAgICAgICBpbXBvcnRlZFNwZWNpZmllcnMuYWRkKHNwZWNpZmllci5pbXBvcnRlZC5uYW1lIHx8IHNwZWNpZmllci5pbXBvcnRlZC52YWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnRlZEltcG9ydFR5cGVzLmhhcyhzcGVjaWZpZXIudHlwZSkpIHtcbiAgICAgICAgaW1wb3J0ZWRTcGVjaWZpZXJzLmFkZChzcGVjaWZpZXIudHlwZSk7XG4gICAgICB9XG5cbiAgICAgIC8vIGltcG9ydCB7IHR5cGUgRm9vIH0gKEZsb3cpOyBpbXBvcnQgeyB0eXBlb2YgRm9vIH0gKEZsb3cpXG4gICAgICBzcGVjaWZpZXJzT25seUltcG9ydGluZ1R5cGVzID0gc3BlY2lmaWVyc09ubHlJbXBvcnRpbmdUeXBlc1xuICAgICAgICAmJiAoc3BlY2lmaWVyLmltcG9ydEtpbmQgPT09ICd0eXBlJyB8fCBzcGVjaWZpZXIuaW1wb3J0S2luZCA9PT0gJ3R5cGVvZicpO1xuICAgIH0pO1xuICAgIGNhcHR1cmVEZXBlbmRlbmN5KG4sIGRlY2xhcmF0aW9uSXNUeXBlIHx8IHNwZWNpZmllcnNPbmx5SW1wb3J0aW5nVHlwZXMsIGltcG9ydGVkU3BlY2lmaWVycyk7XG4gIH1cblxuICBmdW5jdGlvbiBjYXB0dXJlRGVwZW5kZW5jeSh7IHNvdXJjZSB9LCBpc09ubHlJbXBvcnRpbmdUeXBlcywgaW1wb3J0ZWRTcGVjaWZpZXJzID0gbmV3IFNldCgpKSB7XG4gICAgaWYgKHNvdXJjZSA9PSBudWxsKSB7IHJldHVybiBudWxsOyB9XG5cbiAgICBjb25zdCBwID0gcmVtb3RlUGF0aChzb3VyY2UudmFsdWUpO1xuICAgIGlmIChwID09IG51bGwpIHsgcmV0dXJuIG51bGw7IH1cblxuICAgIGNvbnN0IGRlY2xhcmF0aW9uTWV0YWRhdGEgPSB7XG4gICAgICAvLyBjYXB0dXJpbmcgYWN0dWFsIG5vZGUgcmVmZXJlbmNlIGhvbGRzIGZ1bGwgQVNUIGluIG1lbW9yeSFcbiAgICAgIHNvdXJjZTogeyB2YWx1ZTogc291cmNlLnZhbHVlLCBsb2M6IHNvdXJjZS5sb2MgfSxcbiAgICAgIGlzT25seUltcG9ydGluZ1R5cGVzLFxuICAgICAgaW1wb3J0ZWRTcGVjaWZpZXJzLFxuICAgIH07XG5cbiAgICBjb25zdCBleGlzdGluZyA9IG0uaW1wb3J0cy5nZXQocCk7XG4gICAgaWYgKGV4aXN0aW5nICE9IG51bGwpIHtcbiAgICAgIGV4aXN0aW5nLmRlY2xhcmF0aW9ucy5hZGQoZGVjbGFyYXRpb25NZXRhZGF0YSk7XG4gICAgICByZXR1cm4gZXhpc3RpbmcuZ2V0dGVyO1xuICAgIH1cblxuICAgIGNvbnN0IGdldHRlciA9IHRodW5rRm9yKHAsIGNvbnRleHQpO1xuICAgIG0uaW1wb3J0cy5zZXQocCwgeyBnZXR0ZXIsIGRlY2xhcmF0aW9uczogbmV3IFNldChbZGVjbGFyYXRpb25NZXRhZGF0YV0pIH0pO1xuICAgIHJldHVybiBnZXR0ZXI7XG4gIH1cblxuICBjb25zdCBzb3VyY2UgPSBtYWtlU291cmNlQ29kZShjb250ZW50LCBhc3QpO1xuXG4gIGZ1bmN0aW9uIHJlYWRUc0NvbmZpZyhjb250ZXh0KSB7XG4gICAgY29uc3QgdHNjb25maWdJbmZvID0gdHNDb25maWdMb2FkZXIoe1xuICAgICAgY3dkOiBjb250ZXh0LnBhcnNlck9wdGlvbnMgJiYgY29udGV4dC5wYXJzZXJPcHRpb25zLnRzY29uZmlnUm9vdERpciB8fCBwcm9jZXNzLmN3ZCgpLFxuICAgICAgZ2V0RW52OiAoa2V5KSA9PiBwcm9jZXNzLmVudltrZXldLFxuICAgIH0pO1xuICAgIHRyeSB7XG4gICAgICBpZiAodHNjb25maWdJbmZvLnRzQ29uZmlnUGF0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIFByb2plY3RzIG5vdCB1c2luZyBUeXBlU2NyaXB0IHdvbid0IGhhdmUgYHR5cGVzY3JpcHRgIGluc3RhbGxlZC5cbiAgICAgICAgaWYgKCF0cykgeyB0cyA9IHJlcXVpcmUoJ3R5cGVzY3JpcHQnKTsgfSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuXG4gICAgICAgIGNvbnN0IGNvbmZpZ0ZpbGUgPSB0cy5yZWFkQ29uZmlnRmlsZSh0c2NvbmZpZ0luZm8udHNDb25maWdQYXRoLCB0cy5zeXMucmVhZEZpbGUpO1xuICAgICAgICByZXR1cm4gdHMucGFyc2VKc29uQ29uZmlnRmlsZUNvbnRlbnQoXG4gICAgICAgICAgY29uZmlnRmlsZS5jb25maWcsXG4gICAgICAgICAgdHMuc3lzLFxuICAgICAgICAgIGRpcm5hbWUodHNjb25maWdJbmZvLnRzQ29uZmlnUGF0aCksXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gQ2F0Y2ggYW55IGVycm9yc1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNFc01vZHVsZUludGVyb3AoKSB7XG4gICAgY29uc3QgY2FjaGVLZXkgPSBoYXNoT2JqZWN0KHtcbiAgICAgIHRzY29uZmlnUm9vdERpcjogY29udGV4dC5wYXJzZXJPcHRpb25zICYmIGNvbnRleHQucGFyc2VyT3B0aW9ucy50c2NvbmZpZ1Jvb3REaXIsXG4gICAgfSkuZGlnZXN0KCdoZXgnKTtcbiAgICBsZXQgdHNDb25maWcgPSB0c2NvbmZpZ0NhY2hlLmdldChjYWNoZUtleSk7XG4gICAgaWYgKHR5cGVvZiB0c0NvbmZpZyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRzQ29uZmlnID0gcmVhZFRzQ29uZmlnKGNvbnRleHQpO1xuICAgICAgdHNjb25maWdDYWNoZS5zZXQoY2FjaGVLZXksIHRzQ29uZmlnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHNDb25maWcgJiYgdHNDb25maWcub3B0aW9ucyA/IHRzQ29uZmlnLm9wdGlvbnMuZXNNb2R1bGVJbnRlcm9wIDogZmFsc2U7XG4gIH1cblxuICBhc3QuYm9keS5mb3JFYWNoKGZ1bmN0aW9uIChuKSB7XG4gICAgaWYgKG4udHlwZSA9PT0gJ0V4cG9ydERlZmF1bHREZWNsYXJhdGlvbicpIHtcbiAgICAgIGNvbnN0IGV4cG9ydE1ldGEgPSBjYXB0dXJlRG9jKHNvdXJjZSwgZG9jU3R5bGVQYXJzZXJzLCBuKTtcbiAgICAgIGlmIChuLmRlY2xhcmF0aW9uLnR5cGUgPT09ICdJZGVudGlmaWVyJykge1xuICAgICAgICBhZGROYW1lc3BhY2UoZXhwb3J0TWV0YSwgbi5kZWNsYXJhdGlvbik7XG4gICAgICB9XG4gICAgICBtLm5hbWVzcGFjZS5zZXQoJ2RlZmF1bHQnLCBleHBvcnRNZXRhKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAobi50eXBlID09PSAnRXhwb3J0QWxsRGVjbGFyYXRpb24nKSB7XG4gICAgICBjb25zdCBnZXR0ZXIgPSBjYXB0dXJlRGVwZW5kZW5jeShuLCBuLmV4cG9ydEtpbmQgPT09ICd0eXBlJyk7XG4gICAgICBpZiAoZ2V0dGVyKSB7IG0uZGVwZW5kZW5jaWVzLmFkZChnZXR0ZXIpOyB9XG4gICAgICBpZiAobi5leHBvcnRlZCkge1xuICAgICAgICBwcm9jZXNzU3BlY2lmaWVyKG4sIG4uZXhwb3J0ZWQsIG0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIGNhcHR1cmUgbmFtZXNwYWNlcyBpbiBjYXNlIG9mIGxhdGVyIGV4cG9ydFxuICAgIGlmIChuLnR5cGUgPT09ICdJbXBvcnREZWNsYXJhdGlvbicpIHtcbiAgICAgIGNhcHR1cmVEZXBlbmRlbmN5V2l0aFNwZWNpZmllcnMobik7XG5cbiAgICAgIGNvbnN0IG5zID0gbi5zcGVjaWZpZXJzLmZpbmQoKHMpID0+IHMudHlwZSA9PT0gJ0ltcG9ydE5hbWVzcGFjZVNwZWNpZmllcicpO1xuICAgICAgaWYgKG5zKSB7XG4gICAgICAgIG5hbWVzcGFjZXMuc2V0KG5zLmxvY2FsLm5hbWUsIG4uc291cmNlLnZhbHVlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAobi50eXBlID09PSAnRXhwb3J0TmFtZWREZWNsYXJhdGlvbicpIHtcbiAgICAgIGNhcHR1cmVEZXBlbmRlbmN5V2l0aFNwZWNpZmllcnMobik7XG5cbiAgICAgIC8vIGNhcHR1cmUgZGVjbGFyYXRpb25cbiAgICAgIGlmIChuLmRlY2xhcmF0aW9uICE9IG51bGwpIHtcbiAgICAgICAgc3dpdGNoIChuLmRlY2xhcmF0aW9uLnR5cGUpIHtcbiAgICAgICAgICBjYXNlICdGdW5jdGlvbkRlY2xhcmF0aW9uJzpcbiAgICAgICAgICBjYXNlICdDbGFzc0RlY2xhcmF0aW9uJzpcbiAgICAgICAgICBjYXNlICdUeXBlQWxpYXMnOiAvLyBmbG93dHlwZSB3aXRoIGJhYmVsLWVzbGludCBwYXJzZXJcbiAgICAgICAgICBjYXNlICdJbnRlcmZhY2VEZWNsYXJhdGlvbic6XG4gICAgICAgICAgY2FzZSAnRGVjbGFyZUZ1bmN0aW9uJzpcbiAgICAgICAgICBjYXNlICdUU0RlY2xhcmVGdW5jdGlvbic6XG4gICAgICAgICAgY2FzZSAnVFNFbnVtRGVjbGFyYXRpb24nOlxuICAgICAgICAgIGNhc2UgJ1RTVHlwZUFsaWFzRGVjbGFyYXRpb24nOlxuICAgICAgICAgIGNhc2UgJ1RTSW50ZXJmYWNlRGVjbGFyYXRpb24nOlxuICAgICAgICAgIGNhc2UgJ1RTQWJzdHJhY3RDbGFzc0RlY2xhcmF0aW9uJzpcbiAgICAgICAgICBjYXNlICdUU01vZHVsZURlY2xhcmF0aW9uJzpcbiAgICAgICAgICAgIG0ubmFtZXNwYWNlLnNldChuLmRlY2xhcmF0aW9uLmlkLm5hbWUsIGNhcHR1cmVEb2Moc291cmNlLCBkb2NTdHlsZVBhcnNlcnMsIG4pKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ1ZhcmlhYmxlRGVjbGFyYXRpb24nOlxuICAgICAgICAgICAgbi5kZWNsYXJhdGlvbi5kZWNsYXJhdGlvbnMuZm9yRWFjaCgoZCkgPT4ge1xuICAgICAgICAgICAgICByZWN1cnNpdmVQYXR0ZXJuQ2FwdHVyZShcbiAgICAgICAgICAgICAgICBkLmlkLFxuICAgICAgICAgICAgICAgIChpZCkgPT4gbS5uYW1lc3BhY2Uuc2V0KGlkLm5hbWUsIGNhcHR1cmVEb2Moc291cmNlLCBkb2NTdHlsZVBhcnNlcnMsIGQsIG4pKSxcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBuLnNwZWNpZmllcnMuZm9yRWFjaCgocykgPT4gcHJvY2Vzc1NwZWNpZmllcihzLCBuLCBtKSk7XG4gICAgfVxuXG4gICAgY29uc3QgZXhwb3J0cyA9IFsnVFNFeHBvcnRBc3NpZ25tZW50J107XG4gICAgaWYgKGlzRXNNb2R1bGVJbnRlcm9wVHJ1ZSkge1xuICAgICAgZXhwb3J0cy5wdXNoKCdUU05hbWVzcGFjZUV4cG9ydERlY2xhcmF0aW9uJyk7XG4gICAgfVxuXG4gICAgLy8gVGhpcyBkb2Vzbid0IGRlY2xhcmUgYW55dGhpbmcsIGJ1dCBjaGFuZ2VzIHdoYXQncyBiZWluZyBleHBvcnRlZC5cbiAgICBpZiAoaW5jbHVkZXMoZXhwb3J0cywgbi50eXBlKSkge1xuICAgICAgY29uc3QgZXhwb3J0ZWROYW1lID0gbi50eXBlID09PSAnVFNOYW1lc3BhY2VFeHBvcnREZWNsYXJhdGlvbidcbiAgICAgICAgPyAobi5pZCB8fCBuLm5hbWUpLm5hbWVcbiAgICAgICAgOiBuLmV4cHJlc3Npb24gJiYgbi5leHByZXNzaW9uLm5hbWUgfHwgbi5leHByZXNzaW9uLmlkICYmIG4uZXhwcmVzc2lvbi5pZC5uYW1lIHx8IG51bGw7XG4gICAgICBjb25zdCBkZWNsVHlwZXMgPSBbXG4gICAgICAgICdWYXJpYWJsZURlY2xhcmF0aW9uJyxcbiAgICAgICAgJ0NsYXNzRGVjbGFyYXRpb24nLFxuICAgICAgICAnVFNEZWNsYXJlRnVuY3Rpb24nLFxuICAgICAgICAnVFNFbnVtRGVjbGFyYXRpb24nLFxuICAgICAgICAnVFNUeXBlQWxpYXNEZWNsYXJhdGlvbicsXG4gICAgICAgICdUU0ludGVyZmFjZURlY2xhcmF0aW9uJyxcbiAgICAgICAgJ1RTQWJzdHJhY3RDbGFzc0RlY2xhcmF0aW9uJyxcbiAgICAgICAgJ1RTTW9kdWxlRGVjbGFyYXRpb24nLFxuICAgICAgXTtcbiAgICAgIGNvbnN0IGV4cG9ydGVkRGVjbHMgPSBhc3QuYm9keS5maWx0ZXIoKHsgdHlwZSwgaWQsIGRlY2xhcmF0aW9ucyB9KSA9PiBpbmNsdWRlcyhkZWNsVHlwZXMsIHR5cGUpICYmIChcbiAgICAgICAgaWQgJiYgaWQubmFtZSA9PT0gZXhwb3J0ZWROYW1lIHx8IGRlY2xhcmF0aW9ucyAmJiBkZWNsYXJhdGlvbnMuZmluZCgoZCkgPT4gZC5pZC5uYW1lID09PSBleHBvcnRlZE5hbWUpXG4gICAgICApKTtcbiAgICAgIGlmIChleHBvcnRlZERlY2xzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAvLyBFeHBvcnQgaXMgbm90IHJlZmVyZW5jaW5nIGFueSBsb2NhbCBkZWNsYXJhdGlvbiwgbXVzdCBiZSByZS1leHBvcnRpbmdcbiAgICAgICAgbS5uYW1lc3BhY2Uuc2V0KCdkZWZhdWx0JywgY2FwdHVyZURvYyhzb3VyY2UsIGRvY1N0eWxlUGFyc2VycywgbikpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoXG4gICAgICAgIGlzRXNNb2R1bGVJbnRlcm9wVHJ1ZSAvLyBlc01vZHVsZUludGVyb3AgaXMgb24gaW4gdHNjb25maWdcbiAgICAgICAgJiYgIW0ubmFtZXNwYWNlLmhhcygnZGVmYXVsdCcpIC8vIGFuZCBkZWZhdWx0IGlzbid0IGFkZGVkIGFscmVhZHlcbiAgICAgICkge1xuICAgICAgICBtLm5hbWVzcGFjZS5zZXQoJ2RlZmF1bHQnLCB7fSk7IC8vIGFkZCBkZWZhdWx0IGV4cG9ydFxuICAgICAgfVxuICAgICAgZXhwb3J0ZWREZWNscy5mb3JFYWNoKChkZWNsKSA9PiB7XG4gICAgICAgIGlmIChkZWNsLnR5cGUgPT09ICdUU01vZHVsZURlY2xhcmF0aW9uJykge1xuICAgICAgICAgIGlmIChkZWNsLmJvZHkgJiYgZGVjbC5ib2R5LnR5cGUgPT09ICdUU01vZHVsZURlY2xhcmF0aW9uJykge1xuICAgICAgICAgICAgbS5uYW1lc3BhY2Uuc2V0KGRlY2wuYm9keS5pZC5uYW1lLCBjYXB0dXJlRG9jKHNvdXJjZSwgZG9jU3R5bGVQYXJzZXJzLCBkZWNsLmJvZHkpKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGRlY2wuYm9keSAmJiBkZWNsLmJvZHkuYm9keSkge1xuICAgICAgICAgICAgZGVjbC5ib2R5LmJvZHkuZm9yRWFjaCgobW9kdWxlQmxvY2tOb2RlKSA9PiB7XG4gICAgICAgICAgICAgIC8vIEV4cG9ydC1hc3NpZ25tZW50IGV4cG9ydHMgYWxsIG1lbWJlcnMgaW4gdGhlIG5hbWVzcGFjZSxcbiAgICAgICAgICAgICAgLy8gZXhwbGljaXRseSBleHBvcnRlZCBvciBub3QuXG4gICAgICAgICAgICAgIGNvbnN0IG5hbWVzcGFjZURlY2wgPSBtb2R1bGVCbG9ja05vZGUudHlwZSA9PT0gJ0V4cG9ydE5hbWVkRGVjbGFyYXRpb24nXG4gICAgICAgICAgICAgICAgPyBtb2R1bGVCbG9ja05vZGUuZGVjbGFyYXRpb25cbiAgICAgICAgICAgICAgICA6IG1vZHVsZUJsb2NrTm9kZTtcblxuICAgICAgICAgICAgICBpZiAoIW5hbWVzcGFjZURlY2wpIHtcbiAgICAgICAgICAgICAgICAvLyBUeXBlU2NyaXB0IGNhbiBjaGVjayB0aGlzIGZvciB1czsgd2UgbmVlZG4ndFxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKG5hbWVzcGFjZURlY2wudHlwZSA9PT0gJ1ZhcmlhYmxlRGVjbGFyYXRpb24nKSB7XG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlRGVjbC5kZWNsYXJhdGlvbnMuZm9yRWFjaCgoZCkgPT4gcmVjdXJzaXZlUGF0dGVybkNhcHR1cmUoZC5pZCwgKGlkKSA9PiBtLm5hbWVzcGFjZS5zZXQoXG4gICAgICAgICAgICAgICAgICBpZC5uYW1lLFxuICAgICAgICAgICAgICAgICAgY2FwdHVyZURvYyhzb3VyY2UsIGRvY1N0eWxlUGFyc2VycywgZGVjbCwgbmFtZXNwYWNlRGVjbCwgbW9kdWxlQmxvY2tOb2RlKSxcbiAgICAgICAgICAgICAgICApKSxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG0ubmFtZXNwYWNlLnNldChcbiAgICAgICAgICAgICAgICAgIG5hbWVzcGFjZURlY2wuaWQubmFtZSxcbiAgICAgICAgICAgICAgICAgIGNhcHR1cmVEb2Moc291cmNlLCBkb2NTdHlsZVBhcnNlcnMsIG1vZHVsZUJsb2NrTm9kZSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gRXhwb3J0IGFzIGRlZmF1bHRcbiAgICAgICAgICBtLm5hbWVzcGFjZS5zZXQoJ2RlZmF1bHQnLCBjYXB0dXJlRG9jKHNvdXJjZSwgZG9jU3R5bGVQYXJzZXJzLCBkZWNsKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgaWYgKFxuICAgIGlzRXNNb2R1bGVJbnRlcm9wVHJ1ZSAvLyBlc01vZHVsZUludGVyb3AgaXMgb24gaW4gdHNjb25maWdcbiAgICAmJiBtLm5hbWVzcGFjZS5zaXplID4gMCAvLyBhbnl0aGluZyBpcyBleHBvcnRlZFxuICAgICYmICFtLm5hbWVzcGFjZS5oYXMoJ2RlZmF1bHQnKSAvLyBhbmQgZGVmYXVsdCBpc24ndCBhZGRlZCBhbHJlYWR5XG4gICkge1xuICAgIG0ubmFtZXNwYWNlLnNldCgnZGVmYXVsdCcsIHt9KTsgLy8gYWRkIGRlZmF1bHQgZXhwb3J0XG4gIH1cblxuICBpZiAodW5hbWJpZ3VvdXNseUVTTSkge1xuICAgIG0ucGFyc2VHb2FsID0gJ01vZHVsZSc7XG4gIH1cbiAgcmV0dXJuIG07XG59O1xuXG4vKipcbiAqIFRoZSBjcmVhdGlvbiBvZiB0aGlzIGNsb3N1cmUgaXMgaXNvbGF0ZWQgZnJvbSBvdGhlciBzY29wZXNcbiAqIHRvIGF2b2lkIG92ZXItcmV0ZW50aW9uIG9mIHVucmVsYXRlZCB2YXJpYWJsZXMsIHdoaWNoIGhhc1xuICogY2F1c2VkIG1lbW9yeSBsZWFrcy4gU2VlICMxMjY2LlxuICovXG5mdW5jdGlvbiB0aHVua0ZvcihwLCBjb250ZXh0KSB7XG4gIHJldHVybiAoKSA9PiBFeHBvcnRNYXAuZm9yKGNoaWxkQ29udGV4dChwLCBjb250ZXh0KSk7XG59XG5cbi8qKlxuICogVHJhdmVyc2UgYSBwYXR0ZXJuL2lkZW50aWZpZXIgbm9kZSwgY2FsbGluZyAnY2FsbGJhY2snXG4gKiBmb3IgZWFjaCBsZWFmIGlkZW50aWZpZXIuXG4gKiBAcGFyYW0gIHtub2RlfSAgIHBhdHRlcm5cbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHJldHVybiB7dm9pZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlY3Vyc2l2ZVBhdHRlcm5DYXB0dXJlKHBhdHRlcm4sIGNhbGxiYWNrKSB7XG4gIHN3aXRjaCAocGF0dGVybi50eXBlKSB7XG4gICAgY2FzZSAnSWRlbnRpZmllcic6IC8vIGJhc2UgY2FzZVxuICAgICAgY2FsbGJhY2socGF0dGVybik7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ09iamVjdFBhdHRlcm4nOlxuICAgICAgcGF0dGVybi5wcm9wZXJ0aWVzLmZvckVhY2goKHApID0+IHtcbiAgICAgICAgaWYgKHAudHlwZSA9PT0gJ0V4cGVyaW1lbnRhbFJlc3RQcm9wZXJ0eScgfHwgcC50eXBlID09PSAnUmVzdEVsZW1lbnQnKSB7XG4gICAgICAgICAgY2FsbGJhY2socC5hcmd1bWVudCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJlY3Vyc2l2ZVBhdHRlcm5DYXB0dXJlKHAudmFsdWUsIGNhbGxiYWNrKTtcbiAgICAgIH0pO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdBcnJheVBhdHRlcm4nOlxuICAgICAgcGF0dGVybi5lbGVtZW50cy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAgIGlmIChlbGVtZW50ID09IG51bGwpIHsgcmV0dXJuOyB9XG4gICAgICAgIGlmIChlbGVtZW50LnR5cGUgPT09ICdFeHBlcmltZW50YWxSZXN0UHJvcGVydHknIHx8IGVsZW1lbnQudHlwZSA9PT0gJ1Jlc3RFbGVtZW50Jykge1xuICAgICAgICAgIGNhbGxiYWNrKGVsZW1lbnQuYXJndW1lbnQpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZWN1cnNpdmVQYXR0ZXJuQ2FwdHVyZShlbGVtZW50LCBjYWxsYmFjayk7XG4gICAgICB9KTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnQXNzaWdubWVudFBhdHRlcm4nOlxuICAgICAgY2FsbGJhY2socGF0dGVybi5sZWZ0KTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gIH1cbn1cblxubGV0IHBhcnNlck9wdGlvbnNIYXNoID0gJyc7XG5sZXQgcHJldlBhcnNlck9wdGlvbnMgPSAnJztcbmxldCBzZXR0aW5nc0hhc2ggPSAnJztcbmxldCBwcmV2U2V0dGluZ3MgPSAnJztcbi8qKlxuICogZG9uJ3QgaG9sZCBmdWxsIGNvbnRleHQgb2JqZWN0IGluIG1lbW9yeSwganVzdCBncmFiIHdoYXQgd2UgbmVlZC5cbiAqIGFsc28gY2FsY3VsYXRlIGEgY2FjaGVLZXksIHdoZXJlIHBhcnRzIG9mIHRoZSBjYWNoZUtleSBoYXNoIGFyZSBtZW1vaXplZFxuICovXG5mdW5jdGlvbiBjaGlsZENvbnRleHQocGF0aCwgY29udGV4dCkge1xuICBjb25zdCB7IHNldHRpbmdzLCBwYXJzZXJPcHRpb25zLCBwYXJzZXJQYXRoIH0gPSBjb250ZXh0O1xuXG4gIGlmIChKU09OLnN0cmluZ2lmeShzZXR0aW5ncykgIT09IHByZXZTZXR0aW5ncykge1xuICAgIHNldHRpbmdzSGFzaCA9IGhhc2hPYmplY3QoeyBzZXR0aW5ncyB9KS5kaWdlc3QoJ2hleCcpO1xuICAgIHByZXZTZXR0aW5ncyA9IEpTT04uc3RyaW5naWZ5KHNldHRpbmdzKTtcbiAgfVxuXG4gIGlmIChKU09OLnN0cmluZ2lmeShwYXJzZXJPcHRpb25zKSAhPT0gcHJldlBhcnNlck9wdGlvbnMpIHtcbiAgICBwYXJzZXJPcHRpb25zSGFzaCA9IGhhc2hPYmplY3QoeyBwYXJzZXJPcHRpb25zIH0pLmRpZ2VzdCgnaGV4Jyk7XG4gICAgcHJldlBhcnNlck9wdGlvbnMgPSBKU09OLnN0cmluZ2lmeShwYXJzZXJPcHRpb25zKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgY2FjaGVLZXk6IFN0cmluZyhwYXJzZXJQYXRoKSArIHBhcnNlck9wdGlvbnNIYXNoICsgc2V0dGluZ3NIYXNoICsgU3RyaW5nKHBhdGgpLFxuICAgIHNldHRpbmdzLFxuICAgIHBhcnNlck9wdGlvbnMsXG4gICAgcGFyc2VyUGF0aCxcbiAgICBwYXRoLFxuICB9O1xufVxuXG4vKipcbiAqIHNvbWV0aW1lcyBsZWdhY3kgc3VwcG9ydCBpc24ndCBfdGhhdF8gaGFyZC4uLiByaWdodD9cbiAqL1xuZnVuY3Rpb24gbWFrZVNvdXJjZUNvZGUodGV4dCwgYXN0KSB7XG4gIGlmIChTb3VyY2VDb2RlLmxlbmd0aCA+IDEpIHtcbiAgICAvLyBFU0xpbnQgM1xuICAgIHJldHVybiBuZXcgU291cmNlQ29kZSh0ZXh0LCBhc3QpO1xuICB9IGVsc2Uge1xuICAgIC8vIEVTTGludCA0LCA1XG4gICAgcmV0dXJuIG5ldyBTb3VyY2VDb2RlKHsgdGV4dCwgYXN0IH0pO1xuICB9XG59XG4iXX0=