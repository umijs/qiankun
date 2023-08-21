'use strict';var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {return typeof obj;} : function (obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};





var _ignore = require('eslint-module-utils/ignore');
var _resolve = require('eslint-module-utils/resolve');var _resolve2 = _interopRequireDefault(_resolve);
var _visit = require('eslint-module-utils/visit');var _visit2 = _interopRequireDefault(_visit);
var _path = require('path');
var _readPkgUp2 = require('eslint-module-utils/readPkgUp');var _readPkgUp3 = _interopRequireDefault(_readPkgUp2);
var _object = require('object.values');var _object2 = _interopRequireDefault(_object);
var _arrayIncludes = require('array-includes');var _arrayIncludes2 = _interopRequireDefault(_arrayIncludes);
var _arrayPrototype = require('array.prototype.flatmap');var _arrayPrototype2 = _interopRequireDefault(_arrayPrototype);

var _ExportMap = require('../ExportMap');var _ExportMap2 = _interopRequireDefault(_ExportMap);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}} /**
                                                                                                                                                                                                                                                                                                                                                                                 * @fileOverview Ensures that modules contain exports and/or all
                                                                                                                                                                                                                                                                                                                                                                                 * modules are consumed within other modules.
                                                                                                                                                                                                                                                                                                                                                                                 * @author René Fermann
                                                                                                                                                                                                                                                                                                                                                                                 */var FileEnumerator = void 0;var listFilesToProcess = void 0;
try {var _require =
  require('eslint/use-at-your-own-risk');FileEnumerator = _require.FileEnumerator;
} catch (e) {
  try {var _require2 =

    require('eslint/lib/cli-engine/file-enumerator'); // has been moved to eslint/lib/cli-engine/file-enumerator in version 6
    FileEnumerator = _require2.FileEnumerator;} catch (e) {
    try {
      // eslint/lib/util/glob-util has been moved to eslint/lib/util/glob-utils with version 5.3
      var _require3 = require('eslint/lib/util/glob-utils'),originalListFilesToProcess = _require3.listFilesToProcess;

      // Prevent passing invalid options (extensions array) to old versions of the function.
      // https://github.com/eslint/eslint/blob/v5.16.0/lib/util/glob-utils.js#L178-L280
      // https://github.com/eslint/eslint/blob/v5.2.0/lib/util/glob-util.js#L174-L269
      listFilesToProcess = function listFilesToProcess(src, extensions) {
        return originalListFilesToProcess(src, {
          extensions: extensions });

      };
    } catch (e) {var _require4 =
      require('eslint/lib/util/glob-util'),_originalListFilesToProcess = _require4.listFilesToProcess;

      listFilesToProcess = function listFilesToProcess(src, extensions) {
        var patterns = src.concat((0, _arrayPrototype2['default'])(src, function (pattern) {return extensions.map(function (extension) {return (/\*\*|\*\./.test(pattern) ? pattern : String(pattern) + '/**/*' + String(extension));});}));

        return _originalListFilesToProcess(patterns);
      };
    }
  }
}

if (FileEnumerator) {
  listFilesToProcess = function listFilesToProcess(src, extensions) {
    var e = new FileEnumerator({
      extensions: extensions });


    return Array.from(e.iterateFiles(src), function (_ref) {var filePath = _ref.filePath,ignored = _ref.ignored;return {
        ignored: ignored,
        filename: filePath };});

  };
}

var EXPORT_DEFAULT_DECLARATION = 'ExportDefaultDeclaration';
var EXPORT_NAMED_DECLARATION = 'ExportNamedDeclaration';
var EXPORT_ALL_DECLARATION = 'ExportAllDeclaration';
var IMPORT_DECLARATION = 'ImportDeclaration';
var IMPORT_NAMESPACE_SPECIFIER = 'ImportNamespaceSpecifier';
var IMPORT_DEFAULT_SPECIFIER = 'ImportDefaultSpecifier';
var VARIABLE_DECLARATION = 'VariableDeclaration';
var FUNCTION_DECLARATION = 'FunctionDeclaration';
var CLASS_DECLARATION = 'ClassDeclaration';
var IDENTIFIER = 'Identifier';
var OBJECT_PATTERN = 'ObjectPattern';
var TS_INTERFACE_DECLARATION = 'TSInterfaceDeclaration';
var TS_TYPE_ALIAS_DECLARATION = 'TSTypeAliasDeclaration';
var TS_ENUM_DECLARATION = 'TSEnumDeclaration';
var DEFAULT = 'default';

function forEachDeclarationIdentifier(declaration, cb) {
  if (declaration) {
    if (
    declaration.type === FUNCTION_DECLARATION ||
    declaration.type === CLASS_DECLARATION ||
    declaration.type === TS_INTERFACE_DECLARATION ||
    declaration.type === TS_TYPE_ALIAS_DECLARATION ||
    declaration.type === TS_ENUM_DECLARATION)
    {
      cb(declaration.id.name);
    } else if (declaration.type === VARIABLE_DECLARATION) {
      declaration.declarations.forEach(function (_ref2) {var id = _ref2.id;
        if (id.type === OBJECT_PATTERN) {
          (0, _ExportMap.recursivePatternCapture)(id, function (pattern) {
            if (pattern.type === IDENTIFIER) {
              cb(pattern.name);
            }
          });
        } else {
          cb(id.name);
        }
      });
    }
  }
}

/**
   * List of imports per file.
   *
   * Represented by a two-level Map to a Set of identifiers. The upper-level Map
   * keys are the paths to the modules containing the imports, while the
   * lower-level Map keys are the paths to the files which are being imported
   * from. Lastly, the Set of identifiers contains either names being imported
   * or a special AST node name listed above (e.g ImportDefaultSpecifier).
   *
   * For example, if we have a file named foo.js containing:
   *
   *   import { o2 } from './bar.js';
   *
   * Then we will have a structure that looks like:
   *
   *   Map { 'foo.js' => Map { 'bar.js' => Set { 'o2' } } }
   *
   * @type {Map<string, Map<string, Set<string>>>}
   */
var importList = new Map();

/**
                             * List of exports per file.
                             *
                             * Represented by a two-level Map to an object of metadata. The upper-level Map
                             * keys are the paths to the modules containing the exports, while the
                             * lower-level Map keys are the specific identifiers or special AST node names
                             * being exported. The leaf-level metadata object at the moment only contains a
                             * `whereUsed` property, which contains a Set of paths to modules that import
                             * the name.
                             *
                             * For example, if we have a file named bar.js containing the following exports:
                             *
                             *   const o2 = 'bar';
                             *   export { o2 };
                             *
                             * And a file named foo.js containing the following import:
                             *
                             *   import { o2 } from './bar.js';
                             *
                             * Then we will have a structure that looks like:
                             *
                             *   Map { 'bar.js' => Map { 'o2' => { whereUsed: Set { 'foo.js' } } } }
                             *
                             * @type {Map<string, Map<string, object>>}
                             */
var exportList = new Map();

var visitorKeyMap = new Map();

var ignoredFiles = new Set();
var filesOutsideSrc = new Set();

var isNodeModule = function isNodeModule(path) {return (/\/(node_modules)\//.test(path));};

/**
                                                                                             * read all files matching the patterns in src and ignoreExports
                                                                                             *
                                                                                             * return all files matching src pattern, which are not matching the ignoreExports pattern
                                                                                             */
var resolveFiles = function resolveFiles(src, ignoreExports, context) {
  var extensions = Array.from((0, _ignore.getFileExtensions)(context.settings));

  var srcFileList = listFilesToProcess(src, extensions);

  // prepare list of ignored files
  var ignoredFilesList = listFilesToProcess(ignoreExports, extensions);
  ignoredFilesList.forEach(function (_ref3) {var filename = _ref3.filename;return ignoredFiles.add(filename);});

  // prepare list of source files, don't consider files from node_modules

  return new Set(
  (0, _arrayPrototype2['default'])(srcFileList, function (_ref4) {var filename = _ref4.filename;return isNodeModule(filename) ? [] : filename;}));

};

/**
    * parse all source files and build up 2 maps containing the existing imports and exports
    */
var prepareImportsAndExports = function prepareImportsAndExports(srcFiles, context) {
  var exportAll = new Map();
  srcFiles.forEach(function (file) {
    var exports = new Map();
    var imports = new Map();
    var currentExports = _ExportMap2['default'].get(file, context);
    if (currentExports) {var

      dependencies =




      currentExports.dependencies,reexports = currentExports.reexports,localImportList = currentExports.imports,namespace = currentExports.namespace,visitorKeys = currentExports.visitorKeys;

      visitorKeyMap.set(file, visitorKeys);
      // dependencies === export * from
      var currentExportAll = new Set();
      dependencies.forEach(function (getDependency) {
        var dependency = getDependency();
        if (dependency === null) {
          return;
        }

        currentExportAll.add(dependency.path);
      });
      exportAll.set(file, currentExportAll);

      reexports.forEach(function (value, key) {
        if (key === DEFAULT) {
          exports.set(IMPORT_DEFAULT_SPECIFIER, { whereUsed: new Set() });
        } else {
          exports.set(key, { whereUsed: new Set() });
        }
        var reexport = value.getImport();
        if (!reexport) {
          return;
        }
        var localImport = imports.get(reexport.path);
        var currentValue = void 0;
        if (value.local === DEFAULT) {
          currentValue = IMPORT_DEFAULT_SPECIFIER;
        } else {
          currentValue = value.local;
        }
        if (typeof localImport !== 'undefined') {
          localImport = new Set([].concat(_toConsumableArray(localImport), [currentValue]));
        } else {
          localImport = new Set([currentValue]);
        }
        imports.set(reexport.path, localImport);
      });

      localImportList.forEach(function (value, key) {
        if (isNodeModule(key)) {
          return;
        }
        var localImport = imports.get(key) || new Set();
        value.declarations.forEach(function (_ref5) {var importedSpecifiers = _ref5.importedSpecifiers;
          importedSpecifiers.forEach(function (specifier) {
            localImport.add(specifier);
          });
        });
        imports.set(key, localImport);
      });
      importList.set(file, imports);

      // build up export list only, if file is not ignored
      if (ignoredFiles.has(file)) {
        return;
      }
      namespace.forEach(function (value, key) {
        if (key === DEFAULT) {
          exports.set(IMPORT_DEFAULT_SPECIFIER, { whereUsed: new Set() });
        } else {
          exports.set(key, { whereUsed: new Set() });
        }
      });
    }
    exports.set(EXPORT_ALL_DECLARATION, { whereUsed: new Set() });
    exports.set(IMPORT_NAMESPACE_SPECIFIER, { whereUsed: new Set() });
    exportList.set(file, exports);
  });
  exportAll.forEach(function (value, key) {
    value.forEach(function (val) {
      var currentExports = exportList.get(val);
      if (currentExports) {
        var currentExport = currentExports.get(EXPORT_ALL_DECLARATION);
        currentExport.whereUsed.add(key);
      }
    });
  });
};

/**
    * traverse through all imports and add the respective path to the whereUsed-list
    * of the corresponding export
    */
var determineUsage = function determineUsage() {
  importList.forEach(function (listValue, listKey) {
    listValue.forEach(function (value, key) {
      var exports = exportList.get(key);
      if (typeof exports !== 'undefined') {
        value.forEach(function (currentImport) {
          var specifier = void 0;
          if (currentImport === IMPORT_NAMESPACE_SPECIFIER) {
            specifier = IMPORT_NAMESPACE_SPECIFIER;
          } else if (currentImport === IMPORT_DEFAULT_SPECIFIER) {
            specifier = IMPORT_DEFAULT_SPECIFIER;
          } else {
            specifier = currentImport;
          }
          if (typeof specifier !== 'undefined') {
            var exportStatement = exports.get(specifier);
            if (typeof exportStatement !== 'undefined') {var
              whereUsed = exportStatement.whereUsed;
              whereUsed.add(listKey);
              exports.set(specifier, { whereUsed: whereUsed });
            }
          }
        });
      }
    });
  });
};

var getSrc = function getSrc(src) {
  if (src) {
    return src;
  }
  return [process.cwd()];
};

/**
    * prepare the lists of existing imports and exports - should only be executed once at
    * the start of a new eslint run
    */
var srcFiles = void 0;
var lastPrepareKey = void 0;
var doPreparation = function doPreparation(src, ignoreExports, context) {
  var prepareKey = JSON.stringify({
    src: (src || []).sort(),
    ignoreExports: (ignoreExports || []).sort(),
    extensions: Array.from((0, _ignore.getFileExtensions)(context.settings)).sort() });

  if (prepareKey === lastPrepareKey) {
    return;
  }

  importList.clear();
  exportList.clear();
  ignoredFiles.clear();
  filesOutsideSrc.clear();

  srcFiles = resolveFiles(getSrc(src), ignoreExports, context);
  prepareImportsAndExports(srcFiles, context);
  determineUsage();
  lastPrepareKey = prepareKey;
};

var newNamespaceImportExists = function newNamespaceImportExists(specifiers) {return specifiers.some(function (_ref6) {var type = _ref6.type;return type === IMPORT_NAMESPACE_SPECIFIER;});};

var newDefaultImportExists = function newDefaultImportExists(specifiers) {return specifiers.some(function (_ref7) {var type = _ref7.type;return type === IMPORT_DEFAULT_SPECIFIER;});};

var fileIsInPkg = function fileIsInPkg(file) {var _readPkgUp =
  (0, _readPkgUp3['default'])({ cwd: file }),path = _readPkgUp.path,pkg = _readPkgUp.pkg;
  var basePath = (0, _path.dirname)(path);

  var checkPkgFieldString = function checkPkgFieldString(pkgField) {
    if ((0, _path.join)(basePath, pkgField) === file) {
      return true;
    }
  };

  var checkPkgFieldObject = function checkPkgFieldObject(pkgField) {
    var pkgFieldFiles = (0, _arrayPrototype2['default'])((0, _object2['default'])(pkgField), function (value) {return typeof value === 'boolean' ? [] : (0, _path.join)(basePath, value);});

    if ((0, _arrayIncludes2['default'])(pkgFieldFiles, file)) {
      return true;
    }
  };

  var checkPkgField = function checkPkgField(pkgField) {
    if (typeof pkgField === 'string') {
      return checkPkgFieldString(pkgField);
    }

    if ((typeof pkgField === 'undefined' ? 'undefined' : _typeof(pkgField)) === 'object') {
      return checkPkgFieldObject(pkgField);
    }
  };

  if (pkg['private'] === true) {
    return false;
  }

  if (pkg.bin) {
    if (checkPkgField(pkg.bin)) {
      return true;
    }
  }

  if (pkg.browser) {
    if (checkPkgField(pkg.browser)) {
      return true;
    }
  }

  if (pkg.main) {
    if (checkPkgFieldString(pkg.main)) {
      return true;
    }
  }

  return false;
};

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Helpful warnings',
      description: 'Forbid modules without exports, or exports without matching import in another module.',
      url: (0, _docsUrl2['default'])('no-unused-modules') },

    schema: [{
      properties: {
        src: {
          description: 'files/paths to be analyzed (only for unused exports)',
          type: 'array',
          uniqueItems: true,
          items: {
            type: 'string',
            minLength: 1 } },


        ignoreExports: {
          description: 'files/paths for which unused exports will not be reported (e.g module entry points)',
          type: 'array',
          uniqueItems: true,
          items: {
            type: 'string',
            minLength: 1 } },


        missingExports: {
          description: 'report modules without any exports',
          type: 'boolean' },

        unusedExports: {
          description: 'report exports without any usage',
          type: 'boolean' } },


      anyOf: [
      {
        properties: {
          unusedExports: { 'enum': [true] },
          src: {
            minItems: 1 } },


        required: ['unusedExports'] },

      {
        properties: {
          missingExports: { 'enum': [true] } },

        required: ['missingExports'] }] }] },





  create: function () {function create(context) {var _ref8 =





      context.options[0] || {},src = _ref8.src,_ref8$ignoreExports = _ref8.ignoreExports,ignoreExports = _ref8$ignoreExports === undefined ? [] : _ref8$ignoreExports,missingExports = _ref8.missingExports,unusedExports = _ref8.unusedExports;

      if (unusedExports) {
        doPreparation(src, ignoreExports, context);
      }

      var file = context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename();

      var checkExportPresence = function () {function checkExportPresence(node) {
          if (!missingExports) {
            return;
          }

          if (ignoredFiles.has(file)) {
            return;
          }

          var exportCount = exportList.get(file);
          var exportAll = exportCount.get(EXPORT_ALL_DECLARATION);
          var namespaceImports = exportCount.get(IMPORT_NAMESPACE_SPECIFIER);

          exportCount['delete'](EXPORT_ALL_DECLARATION);
          exportCount['delete'](IMPORT_NAMESPACE_SPECIFIER);
          if (exportCount.size < 1) {
            // node.body[0] === 'undefined' only happens, if everything is commented out in the file
            // being linted
            context.report(node.body[0] ? node.body[0] : node, 'No exports found');
          }
          exportCount.set(EXPORT_ALL_DECLARATION, exportAll);
          exportCount.set(IMPORT_NAMESPACE_SPECIFIER, namespaceImports);
        }return checkExportPresence;}();

      var checkUsage = function () {function checkUsage(node, exportedValue) {
          if (!unusedExports) {
            return;
          }

          if (ignoredFiles.has(file)) {
            return;
          }

          if (fileIsInPkg(file)) {
            return;
          }

          if (filesOutsideSrc.has(file)) {
            return;
          }

          // make sure file to be linted is included in source files
          if (!srcFiles.has(file)) {
            srcFiles = resolveFiles(getSrc(src), ignoreExports, context);
            if (!srcFiles.has(file)) {
              filesOutsideSrc.add(file);
              return;
            }
          }

          exports = exportList.get(file);

          // special case: export * from
          var exportAll = exports.get(EXPORT_ALL_DECLARATION);
          if (typeof exportAll !== 'undefined' && exportedValue !== IMPORT_DEFAULT_SPECIFIER) {
            if (exportAll.whereUsed.size > 0) {
              return;
            }
          }

          // special case: namespace import
          var namespaceImports = exports.get(IMPORT_NAMESPACE_SPECIFIER);
          if (typeof namespaceImports !== 'undefined') {
            if (namespaceImports.whereUsed.size > 0) {
              return;
            }
          }

          // exportsList will always map any imported value of 'default' to 'ImportDefaultSpecifier'
          var exportsKey = exportedValue === DEFAULT ? IMPORT_DEFAULT_SPECIFIER : exportedValue;

          var exportStatement = exports.get(exportsKey);

          var value = exportsKey === IMPORT_DEFAULT_SPECIFIER ? DEFAULT : exportsKey;

          if (typeof exportStatement !== 'undefined') {
            if (exportStatement.whereUsed.size < 1) {
              context.report(
              node, 'exported declaration \'' +
              value + '\' not used within other modules');

            }
          } else {
            context.report(
            node, 'exported declaration \'' +
            value + '\' not used within other modules');

          }
        }return checkUsage;}();

      /**
                                 * only useful for tools like vscode-eslint
                                 *
                                 * update lists of existing exports during runtime
                                 */
      var updateExportUsage = function () {function updateExportUsage(node) {
          if (ignoredFiles.has(file)) {
            return;
          }

          var exports = exportList.get(file);

          // new module has been created during runtime
          // include it in further processing
          if (typeof exports === 'undefined') {
            exports = new Map();
          }

          var newExports = new Map();
          var newExportIdentifiers = new Set();

          node.body.forEach(function (_ref9) {var type = _ref9.type,declaration = _ref9.declaration,specifiers = _ref9.specifiers;
            if (type === EXPORT_DEFAULT_DECLARATION) {
              newExportIdentifiers.add(IMPORT_DEFAULT_SPECIFIER);
            }
            if (type === EXPORT_NAMED_DECLARATION) {
              if (specifiers.length > 0) {
                specifiers.forEach(function (specifier) {
                  if (specifier.exported) {
                    newExportIdentifiers.add(specifier.exported.name || specifier.exported.value);
                  }
                });
              }
              forEachDeclarationIdentifier(declaration, function (name) {
                newExportIdentifiers.add(name);
              });
            }
          });

          // old exports exist within list of new exports identifiers: add to map of new exports
          exports.forEach(function (value, key) {
            if (newExportIdentifiers.has(key)) {
              newExports.set(key, value);
            }
          });

          // new export identifiers added: add to map of new exports
          newExportIdentifiers.forEach(function (key) {
            if (!exports.has(key)) {
              newExports.set(key, { whereUsed: new Set() });
            }
          });

          // preserve information about namespace imports
          var exportAll = exports.get(EXPORT_ALL_DECLARATION);
          var namespaceImports = exports.get(IMPORT_NAMESPACE_SPECIFIER);

          if (typeof namespaceImports === 'undefined') {
            namespaceImports = { whereUsed: new Set() };
          }

          newExports.set(EXPORT_ALL_DECLARATION, exportAll);
          newExports.set(IMPORT_NAMESPACE_SPECIFIER, namespaceImports);
          exportList.set(file, newExports);
        }return updateExportUsage;}();

      /**
                                        * only useful for tools like vscode-eslint
                                        *
                                        * update lists of existing imports during runtime
                                        */
      var updateImportUsage = function () {function updateImportUsage(node) {
          if (!unusedExports) {
            return;
          }

          var oldImportPaths = importList.get(file);
          if (typeof oldImportPaths === 'undefined') {
            oldImportPaths = new Map();
          }

          var oldNamespaceImports = new Set();
          var newNamespaceImports = new Set();

          var oldExportAll = new Set();
          var newExportAll = new Set();

          var oldDefaultImports = new Set();
          var newDefaultImports = new Set();

          var oldImports = new Map();
          var newImports = new Map();
          oldImportPaths.forEach(function (value, key) {
            if (value.has(EXPORT_ALL_DECLARATION)) {
              oldExportAll.add(key);
            }
            if (value.has(IMPORT_NAMESPACE_SPECIFIER)) {
              oldNamespaceImports.add(key);
            }
            if (value.has(IMPORT_DEFAULT_SPECIFIER)) {
              oldDefaultImports.add(key);
            }
            value.forEach(function (val) {
              if (
              val !== IMPORT_NAMESPACE_SPECIFIER &&
              val !== IMPORT_DEFAULT_SPECIFIER)
              {
                oldImports.set(val, key);
              }
            });
          });

          function processDynamicImport(source) {
            if (source.type !== 'Literal') {
              return null;
            }
            var p = (0, _resolve2['default'])(source.value, context);
            if (p == null) {
              return null;
            }
            newNamespaceImports.add(p);
          }

          (0, _visit2['default'])(node, visitorKeyMap.get(file), {
            ImportExpression: function () {function ImportExpression(child) {
                processDynamicImport(child.source);
              }return ImportExpression;}(),
            CallExpression: function () {function CallExpression(child) {
                if (child.callee.type === 'Import') {
                  processDynamicImport(child.arguments[0]);
                }
              }return CallExpression;}() });


          node.body.forEach(function (astNode) {
            var resolvedPath = void 0;

            // support for export { value } from 'module'
            if (astNode.type === EXPORT_NAMED_DECLARATION) {
              if (astNode.source) {
                resolvedPath = (0, _resolve2['default'])(astNode.source.raw.replace(/('|")/g, ''), context);
                astNode.specifiers.forEach(function (specifier) {
                  var name = specifier.local.name || specifier.local.value;
                  if (name === DEFAULT) {
                    newDefaultImports.add(resolvedPath);
                  } else {
                    newImports.set(name, resolvedPath);
                  }
                });
              }
            }

            if (astNode.type === EXPORT_ALL_DECLARATION) {
              resolvedPath = (0, _resolve2['default'])(astNode.source.raw.replace(/('|")/g, ''), context);
              newExportAll.add(resolvedPath);
            }

            if (astNode.type === IMPORT_DECLARATION) {
              resolvedPath = (0, _resolve2['default'])(astNode.source.raw.replace(/('|")/g, ''), context);
              if (!resolvedPath) {
                return;
              }

              if (isNodeModule(resolvedPath)) {
                return;
              }

              if (newNamespaceImportExists(astNode.specifiers)) {
                newNamespaceImports.add(resolvedPath);
              }

              if (newDefaultImportExists(astNode.specifiers)) {
                newDefaultImports.add(resolvedPath);
              }

              astNode.specifiers.
              filter(function (specifier) {return specifier.type !== IMPORT_DEFAULT_SPECIFIER && specifier.type !== IMPORT_NAMESPACE_SPECIFIER;}).
              forEach(function (specifier) {
                newImports.set(specifier.imported.name || specifier.imported.value, resolvedPath);
              });
            }
          });

          newExportAll.forEach(function (value) {
            if (!oldExportAll.has(value)) {
              var imports = oldImportPaths.get(value);
              if (typeof imports === 'undefined') {
                imports = new Set();
              }
              imports.add(EXPORT_ALL_DECLARATION);
              oldImportPaths.set(value, imports);

              var _exports = exportList.get(value);
              var currentExport = void 0;
              if (typeof _exports !== 'undefined') {
                currentExport = _exports.get(EXPORT_ALL_DECLARATION);
              } else {
                _exports = new Map();
                exportList.set(value, _exports);
              }

              if (typeof currentExport !== 'undefined') {
                currentExport.whereUsed.add(file);
              } else {
                var whereUsed = new Set();
                whereUsed.add(file);
                _exports.set(EXPORT_ALL_DECLARATION, { whereUsed: whereUsed });
              }
            }
          });

          oldExportAll.forEach(function (value) {
            if (!newExportAll.has(value)) {
              var imports = oldImportPaths.get(value);
              imports['delete'](EXPORT_ALL_DECLARATION);

              var _exports2 = exportList.get(value);
              if (typeof _exports2 !== 'undefined') {
                var currentExport = _exports2.get(EXPORT_ALL_DECLARATION);
                if (typeof currentExport !== 'undefined') {
                  currentExport.whereUsed['delete'](file);
                }
              }
            }
          });

          newDefaultImports.forEach(function (value) {
            if (!oldDefaultImports.has(value)) {
              var imports = oldImportPaths.get(value);
              if (typeof imports === 'undefined') {
                imports = new Set();
              }
              imports.add(IMPORT_DEFAULT_SPECIFIER);
              oldImportPaths.set(value, imports);

              var _exports3 = exportList.get(value);
              var currentExport = void 0;
              if (typeof _exports3 !== 'undefined') {
                currentExport = _exports3.get(IMPORT_DEFAULT_SPECIFIER);
              } else {
                _exports3 = new Map();
                exportList.set(value, _exports3);
              }

              if (typeof currentExport !== 'undefined') {
                currentExport.whereUsed.add(file);
              } else {
                var whereUsed = new Set();
                whereUsed.add(file);
                _exports3.set(IMPORT_DEFAULT_SPECIFIER, { whereUsed: whereUsed });
              }
            }
          });

          oldDefaultImports.forEach(function (value) {
            if (!newDefaultImports.has(value)) {
              var imports = oldImportPaths.get(value);
              imports['delete'](IMPORT_DEFAULT_SPECIFIER);

              var _exports4 = exportList.get(value);
              if (typeof _exports4 !== 'undefined') {
                var currentExport = _exports4.get(IMPORT_DEFAULT_SPECIFIER);
                if (typeof currentExport !== 'undefined') {
                  currentExport.whereUsed['delete'](file);
                }
              }
            }
          });

          newNamespaceImports.forEach(function (value) {
            if (!oldNamespaceImports.has(value)) {
              var imports = oldImportPaths.get(value);
              if (typeof imports === 'undefined') {
                imports = new Set();
              }
              imports.add(IMPORT_NAMESPACE_SPECIFIER);
              oldImportPaths.set(value, imports);

              var _exports5 = exportList.get(value);
              var currentExport = void 0;
              if (typeof _exports5 !== 'undefined') {
                currentExport = _exports5.get(IMPORT_NAMESPACE_SPECIFIER);
              } else {
                _exports5 = new Map();
                exportList.set(value, _exports5);
              }

              if (typeof currentExport !== 'undefined') {
                currentExport.whereUsed.add(file);
              } else {
                var whereUsed = new Set();
                whereUsed.add(file);
                _exports5.set(IMPORT_NAMESPACE_SPECIFIER, { whereUsed: whereUsed });
              }
            }
          });

          oldNamespaceImports.forEach(function (value) {
            if (!newNamespaceImports.has(value)) {
              var imports = oldImportPaths.get(value);
              imports['delete'](IMPORT_NAMESPACE_SPECIFIER);

              var _exports6 = exportList.get(value);
              if (typeof _exports6 !== 'undefined') {
                var currentExport = _exports6.get(IMPORT_NAMESPACE_SPECIFIER);
                if (typeof currentExport !== 'undefined') {
                  currentExport.whereUsed['delete'](file);
                }
              }
            }
          });

          newImports.forEach(function (value, key) {
            if (!oldImports.has(key)) {
              var imports = oldImportPaths.get(value);
              if (typeof imports === 'undefined') {
                imports = new Set();
              }
              imports.add(key);
              oldImportPaths.set(value, imports);

              var _exports7 = exportList.get(value);
              var currentExport = void 0;
              if (typeof _exports7 !== 'undefined') {
                currentExport = _exports7.get(key);
              } else {
                _exports7 = new Map();
                exportList.set(value, _exports7);
              }

              if (typeof currentExport !== 'undefined') {
                currentExport.whereUsed.add(file);
              } else {
                var whereUsed = new Set();
                whereUsed.add(file);
                _exports7.set(key, { whereUsed: whereUsed });
              }
            }
          });

          oldImports.forEach(function (value, key) {
            if (!newImports.has(key)) {
              var imports = oldImportPaths.get(value);
              imports['delete'](key);

              var _exports8 = exportList.get(value);
              if (typeof _exports8 !== 'undefined') {
                var currentExport = _exports8.get(key);
                if (typeof currentExport !== 'undefined') {
                  currentExport.whereUsed['delete'](file);
                }
              }
            }
          });
        }return updateImportUsage;}();

      return {
        'Program:exit': function () {function ProgramExit(node) {
            updateExportUsage(node);
            updateImportUsage(node);
            checkExportPresence(node);
          }return ProgramExit;}(),
        ExportDefaultDeclaration: function () {function ExportDefaultDeclaration(node) {
            checkUsage(node, IMPORT_DEFAULT_SPECIFIER);
          }return ExportDefaultDeclaration;}(),
        ExportNamedDeclaration: function () {function ExportNamedDeclaration(node) {
            node.specifiers.forEach(function (specifier) {
              checkUsage(specifier, specifier.exported.name || specifier.exported.value);
            });
            forEachDeclarationIdentifier(node.declaration, function (name) {
              checkUsage(node, name);
            });
          }return ExportNamedDeclaration;}() };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby11bnVzZWQtbW9kdWxlcy5qcyJdLCJuYW1lcyI6WyJGaWxlRW51bWVyYXRvciIsImxpc3RGaWxlc1RvUHJvY2VzcyIsInJlcXVpcmUiLCJlIiwib3JpZ2luYWxMaXN0RmlsZXNUb1Byb2Nlc3MiLCJzcmMiLCJleHRlbnNpb25zIiwicGF0dGVybnMiLCJjb25jYXQiLCJwYXR0ZXJuIiwibWFwIiwiZXh0ZW5zaW9uIiwidGVzdCIsIkFycmF5IiwiZnJvbSIsIml0ZXJhdGVGaWxlcyIsImZpbGVQYXRoIiwiaWdub3JlZCIsImZpbGVuYW1lIiwiRVhQT1JUX0RFRkFVTFRfREVDTEFSQVRJT04iLCJFWFBPUlRfTkFNRURfREVDTEFSQVRJT04iLCJFWFBPUlRfQUxMX0RFQ0xBUkFUSU9OIiwiSU1QT1JUX0RFQ0xBUkFUSU9OIiwiSU1QT1JUX05BTUVTUEFDRV9TUEVDSUZJRVIiLCJJTVBPUlRfREVGQVVMVF9TUEVDSUZJRVIiLCJWQVJJQUJMRV9ERUNMQVJBVElPTiIsIkZVTkNUSU9OX0RFQ0xBUkFUSU9OIiwiQ0xBU1NfREVDTEFSQVRJT04iLCJJREVOVElGSUVSIiwiT0JKRUNUX1BBVFRFUk4iLCJUU19JTlRFUkZBQ0VfREVDTEFSQVRJT04iLCJUU19UWVBFX0FMSUFTX0RFQ0xBUkFUSU9OIiwiVFNfRU5VTV9ERUNMQVJBVElPTiIsIkRFRkFVTFQiLCJmb3JFYWNoRGVjbGFyYXRpb25JZGVudGlmaWVyIiwiZGVjbGFyYXRpb24iLCJjYiIsInR5cGUiLCJpZCIsIm5hbWUiLCJkZWNsYXJhdGlvbnMiLCJmb3JFYWNoIiwiaW1wb3J0TGlzdCIsIk1hcCIsImV4cG9ydExpc3QiLCJ2aXNpdG9yS2V5TWFwIiwiaWdub3JlZEZpbGVzIiwiU2V0IiwiZmlsZXNPdXRzaWRlU3JjIiwiaXNOb2RlTW9kdWxlIiwicGF0aCIsInJlc29sdmVGaWxlcyIsImlnbm9yZUV4cG9ydHMiLCJjb250ZXh0Iiwic2V0dGluZ3MiLCJzcmNGaWxlTGlzdCIsImlnbm9yZWRGaWxlc0xpc3QiLCJhZGQiLCJwcmVwYXJlSW1wb3J0c0FuZEV4cG9ydHMiLCJzcmNGaWxlcyIsImV4cG9ydEFsbCIsImZpbGUiLCJleHBvcnRzIiwiaW1wb3J0cyIsImN1cnJlbnRFeHBvcnRzIiwiRXhwb3J0cyIsImdldCIsImRlcGVuZGVuY2llcyIsInJlZXhwb3J0cyIsImxvY2FsSW1wb3J0TGlzdCIsIm5hbWVzcGFjZSIsInZpc2l0b3JLZXlzIiwic2V0IiwiY3VycmVudEV4cG9ydEFsbCIsImdldERlcGVuZGVuY3kiLCJkZXBlbmRlbmN5IiwidmFsdWUiLCJrZXkiLCJ3aGVyZVVzZWQiLCJyZWV4cG9ydCIsImdldEltcG9ydCIsImxvY2FsSW1wb3J0IiwiY3VycmVudFZhbHVlIiwibG9jYWwiLCJpbXBvcnRlZFNwZWNpZmllcnMiLCJzcGVjaWZpZXIiLCJoYXMiLCJ2YWwiLCJjdXJyZW50RXhwb3J0IiwiZGV0ZXJtaW5lVXNhZ2UiLCJsaXN0VmFsdWUiLCJsaXN0S2V5IiwiY3VycmVudEltcG9ydCIsImV4cG9ydFN0YXRlbWVudCIsImdldFNyYyIsInByb2Nlc3MiLCJjd2QiLCJsYXN0UHJlcGFyZUtleSIsImRvUHJlcGFyYXRpb24iLCJwcmVwYXJlS2V5IiwiSlNPTiIsInN0cmluZ2lmeSIsInNvcnQiLCJjbGVhciIsIm5ld05hbWVzcGFjZUltcG9ydEV4aXN0cyIsInNwZWNpZmllcnMiLCJzb21lIiwibmV3RGVmYXVsdEltcG9ydEV4aXN0cyIsImZpbGVJc0luUGtnIiwicGtnIiwiYmFzZVBhdGgiLCJjaGVja1BrZ0ZpZWxkU3RyaW5nIiwicGtnRmllbGQiLCJjaGVja1BrZ0ZpZWxkT2JqZWN0IiwicGtnRmllbGRGaWxlcyIsImNoZWNrUGtnRmllbGQiLCJiaW4iLCJicm93c2VyIiwibWFpbiIsIm1vZHVsZSIsIm1ldGEiLCJkb2NzIiwiY2F0ZWdvcnkiLCJkZXNjcmlwdGlvbiIsInVybCIsInNjaGVtYSIsInByb3BlcnRpZXMiLCJ1bmlxdWVJdGVtcyIsIml0ZW1zIiwibWluTGVuZ3RoIiwibWlzc2luZ0V4cG9ydHMiLCJ1bnVzZWRFeHBvcnRzIiwiYW55T2YiLCJtaW5JdGVtcyIsInJlcXVpcmVkIiwiY3JlYXRlIiwib3B0aW9ucyIsImdldFBoeXNpY2FsRmlsZW5hbWUiLCJnZXRGaWxlbmFtZSIsImNoZWNrRXhwb3J0UHJlc2VuY2UiLCJub2RlIiwiZXhwb3J0Q291bnQiLCJuYW1lc3BhY2VJbXBvcnRzIiwic2l6ZSIsInJlcG9ydCIsImJvZHkiLCJjaGVja1VzYWdlIiwiZXhwb3J0ZWRWYWx1ZSIsImV4cG9ydHNLZXkiLCJ1cGRhdGVFeHBvcnRVc2FnZSIsIm5ld0V4cG9ydHMiLCJuZXdFeHBvcnRJZGVudGlmaWVycyIsImxlbmd0aCIsImV4cG9ydGVkIiwidXBkYXRlSW1wb3J0VXNhZ2UiLCJvbGRJbXBvcnRQYXRocyIsIm9sZE5hbWVzcGFjZUltcG9ydHMiLCJuZXdOYW1lc3BhY2VJbXBvcnRzIiwib2xkRXhwb3J0QWxsIiwibmV3RXhwb3J0QWxsIiwib2xkRGVmYXVsdEltcG9ydHMiLCJuZXdEZWZhdWx0SW1wb3J0cyIsIm9sZEltcG9ydHMiLCJuZXdJbXBvcnRzIiwicHJvY2Vzc0R5bmFtaWNJbXBvcnQiLCJzb3VyY2UiLCJwIiwiSW1wb3J0RXhwcmVzc2lvbiIsImNoaWxkIiwiQ2FsbEV4cHJlc3Npb24iLCJjYWxsZWUiLCJhcmd1bWVudHMiLCJhc3ROb2RlIiwicmVzb2x2ZWRQYXRoIiwicmF3IiwicmVwbGFjZSIsImZpbHRlciIsImltcG9ydGVkIiwiRXhwb3J0RGVmYXVsdERlY2xhcmF0aW9uIiwiRXhwb3J0TmFtZWREZWNsYXJhdGlvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBTUE7QUFDQSxzRDtBQUNBLGtEO0FBQ0E7QUFDQSwyRDtBQUNBLHVDO0FBQ0EsK0M7QUFDQSx5RDs7QUFFQSx5QztBQUNBLHFDLDJVQWhCQTs7OzttWEFrQkEsSUFBSUEsdUJBQUosQ0FDQSxJQUFJQywyQkFBSjtBQUVBLElBQUk7QUFDb0JDLFVBQVEsNkJBQVIsQ0FEcEIsQ0FDQ0Ys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V04sSUFBWCxFQUFpQnJHLElBQWpCO0FBQ0QsYUFGRDtBQUdELFdBaEJJLG1DQUFQOztBQWtCRCxLQXZoQmMsbUJBQWpCIiwiZmlsZSI6Im5vLXVudXNlZC1tb2R1bGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZU92ZXJ2aWV3IEVuc3VyZXMgdGhhdCBtb2R1bGVzIGNvbnRhaW4gZXhwb3J0cyBhbmQvb3IgYWxsXG4gKiBtb2R1bGVzIGFyZSBjb25zdW1lZCB3aXRoaW4gb3RoZXIgbW9kdWxlcy5cbiAqIEBhdXRob3IgUmVuw6kgRmVybWFublxuICovXG5cbmltcG9ydCB7IGdldEZpbGVFeHRlbnNpb25zIH0gZnJvbSAnZXNsaW50LW1vZHVsZS11dGlscy9pZ25vcmUnO1xuaW1wb3J0IHJlc29sdmUgZnJvbSAnZXNsaW50LW1vZHVsZS11dGlscy9yZXNvbHZlJztcbmltcG9ydCB2aXNpdCBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL3Zpc2l0JztcbmltcG9ydCB7IGRpcm5hbWUsIGpvaW4gfSBmcm9tICdwYXRoJztcbmltcG9ydCByZWFkUGtnVXAgZnJvbSAnZXNsaW50LW1vZHVsZS11dGlscy9yZWFkUGtnVXAnO1xuaW1wb3J0IHZhbHVlcyBmcm9tICdvYmplY3QudmFsdWVzJztcbmltcG9ydCBpbmNsdWRlcyBmcm9tICdhcnJheS1pbmNsdWRlcyc7XG5pbXBvcnQgZmxhdE1hcCBmcm9tICdhcnJheS5wcm90b3R5cGUuZmxhdG1hcCc7XG5cbmltcG9ydCBFeHBvcnRzLCB7IHJlY3Vyc2l2ZVBhdHRlcm5DYXB0dXJlIH0gZnJvbSAnLi4vRXhwb3J0TWFwJztcbmltcG9ydCBkb2NzVXJsIGZyb20gJy4uL2RvY3NVcmwnO1xuXG5sZXQgRmlsZUVudW1lcmF0b3I7XG5sZXQgbGlzdEZpbGVzVG9Qcm9jZXNzO1xuXG50cnkge1xuICAoeyBGaWxlRW51bWVyYXRvciB9ID0gcmVxdWlyZSgnZXNsaW50L3VzZS1hdC15b3VyLW93bi1yaXNrJykpO1xufSBjYXRjaCAoZSkge1xuICB0cnkge1xuICAgIC8vIGhhcyBiZWVuIG1vdmVkIHRvIGVzbGludC9saWIvY2xpLWVuZ2luZS9maWxlLWVudW1lcmF0b3IgaW4gdmVyc2lvbiA2XG4gICAgKHsgRmlsZUVudW1lcmF0b3IgfSA9IHJlcXVpcmUoJ2VzbGludC9saWIvY2xpLWVuZ2luZS9maWxlLWVudW1lcmF0b3InKSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB0cnkge1xuICAgICAgLy8gZXNsaW50L2xpYi91dGlsL2dsb2ItdXRpbCBoYXMgYmVlbiBtb3ZlZCB0byBlc2xpbnQvbGliL3V0aWwvZ2xvYi11dGlscyB3aXRoIHZlcnNpb24gNS4zXG4gICAgICBjb25zdCB7IGxpc3RGaWxlc1RvUHJvY2Vzczogb3JpZ2luYWxMaXN0RmlsZXNUb1Byb2Nlc3MgfSA9IHJlcXVpcmUoJ2VzbGludC9saWIvdXRpbC9nbG9iLXV0aWxzJyk7XG5cbiAgICAgIC8vIFByZXZlbnQgcGFzc2luZyBpbnZhbGlkIG9wdGlvbnMgKGV4dGVuc2lvbnMgYXJyYXkpIHRvIG9sZCB2ZXJzaW9ucyBvZiB0aGUgZnVuY3Rpb24uXG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vZXNsaW50L2VzbGludC9ibG9iL3Y1LjE2LjAvbGliL3V0aWwvZ2xvYi11dGlscy5qcyNMMTc4LUwyODBcbiAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9lc2xpbnQvZXNsaW50L2Jsb2IvdjUuMi4wL2xpYi91dGlsL2dsb2ItdXRpbC5qcyNMMTc0LUwyNjlcbiAgICAgIGxpc3RGaWxlc1RvUHJvY2VzcyA9IGZ1bmN0aW9uIChzcmMsIGV4dGVuc2lvbnMpIHtcbiAgICAgICAgcmV0dXJuIG9yaWdpbmFsTGlzdEZpbGVzVG9Qcm9jZXNzKHNyYywge1xuICAgICAgICAgIGV4dGVuc2lvbnMsXG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zdCB7IGxpc3RGaWxlc1RvUHJvY2Vzczogb3JpZ2luYWxMaXN0RmlsZXNUb1Byb2Nlc3MgfSA9IHJlcXVpcmUoJ2VzbGludC9saWIvdXRpbC9nbG9iLXV0aWwnKTtcblxuICAgICAgbGlzdEZpbGVzVG9Qcm9jZXNzID0gZnVuY3Rpb24gKHNyYywgZXh0ZW5zaW9ucykge1xuICAgICAgICBjb25zdCBwYXR0ZXJucyA9IHNyYy5jb25jYXQoZmxhdE1hcChzcmMsIChwYXR0ZXJuKSA9PiBleHRlbnNpb25zLm1hcCgoZXh0ZW5zaW9uKSA9PiAoL1xcKlxcKnxcXCpcXC4vKS50ZXN0KHBhdHRlcm4pID8gcGF0dGVybiA6IGAke3BhdHRlcm59LyoqLyoke2V4dGVuc2lvbn1gKSkpO1xuXG4gICAgICAgIHJldHVybiBvcmlnaW5hbExpc3RGaWxlc1RvUHJvY2VzcyhwYXR0ZXJucyk7XG4gICAgICB9O1xuICAgIH1cbiAgfVxufVxuXG5pZiAoRmlsZUVudW1lcmF0b3IpIHtcbiAgbGlzdEZpbGVzVG9Qcm9jZXNzID0gZnVuY3Rpb24gKHNyYywgZXh0ZW5zaW9ucykge1xuICAgIGNvbnN0IGUgPSBuZXcgRmlsZUVudW1lcmF0b3Ioe1xuICAgICAgZXh0ZW5zaW9ucyxcbiAgICB9KTtcblxuICAgIHJldHVybiBBcnJheS5mcm9tKGUuaXRlcmF0ZUZpbGVzKHNyYyksICh7IGZpbGVQYXRoLCBpZ25vcmVkIH0pID0+ICh7XG4gICAgICBpZ25vcmVkLFxuICAgICAgZmlsZW5hbWU6IGZpbGVQYXRoLFxuICAgIH0pKTtcbiAgfTtcbn1cblxuY29uc3QgRVhQT1JUX0RFRkFVTFRfREVDTEFSQVRJT04gPSAnRXhwb3J0RGVmYXVsdERlY2xhcmF0aW9uJztcbmNvbnN0IEVYUE9SVF9OQU1FRF9ERUNMQVJBVElPTiA9ICdFeHBvcnROYW1lZERlY2xhcmF0aW9uJztcbmNvbnN0IEVYUE9SVF9BTExfREVDTEFSQVRJT04gPSAnRXhwb3J0QWxsRGVjbGFyYXRpb24nO1xuY29uc3QgSU1QT1JUX0RFQ0xBUkFUSU9OID0gJ0ltcG9ydERlY2xhcmF0aW9uJztcbmNvbnN0IElNUE9SVF9OQU1FU1BBQ0VfU1BFQ0lGSUVSID0gJ0ltcG9ydE5hbWVzcGFjZVNwZWNpZmllcic7XG5jb25zdCBJTVBPUlRfREVGQVVMVF9TUEVDSUZJRVIgPSAnSW1wb3J0RGVmYXVsdFNwZWNpZmllcic7XG5jb25zdCBWQVJJQUJMRV9ERUNMQVJBVElPTiA9ICdWYXJpYWJsZURlY2xhcmF0aW9uJztcbmNvbnN0IEZVTkNUSU9OX0RFQ0xBUkFUSU9OID0gJ0Z1bmN0aW9uRGVjbGFyYXRpb24nO1xuY29uc3QgQ0xBU1NfREVDTEFSQVRJT04gPSAnQ2xhc3NEZWNsYXJhdGlvbic7XG5jb25zdCBJREVOVElGSUVSID0gJ0lkZW50aWZpZXInO1xuY29uc3QgT0JKRUNUX1BBVFRFUk4gPSAnT2JqZWN0UGF0dGVybic7XG5jb25zdCBUU19JTlRFUkZBQ0VfREVDTEFSQVRJT04gPSAnVFNJbnRlcmZhY2VEZWNsYXJhdGlvbic7XG5jb25zdCBUU19UWVBFX0FMSUFTX0RFQ0xBUkFUSU9OID0gJ1RTVHlwZUFsaWFzRGVjbGFyYXRpb24nO1xuY29uc3QgVFNfRU5VTV9ERUNMQVJBVElPTiA9ICdUU0VudW1EZWNsYXJhdGlvbic7XG5jb25zdCBERUZBVUxUID0gJ2RlZmF1bHQnO1xuXG5mdW5jdGlvbiBmb3JFYWNoRGVjbGFyYXRpb25JZGVudGlmaWVyKGRlY2xhcmF0aW9uLCBjYikge1xuICBpZiAoZGVjbGFyYXRpb24pIHtcbiAgICBpZiAoXG4gICAgICBkZWNsYXJhdGlvbi50eXBlID09PSBGVU5DVElPTl9ERUNMQVJBVElPTlxuICAgICAgfHwgZGVjbGFyYXRpb24udHlwZSA9PT0gQ0xBU1NfREVDTEFSQVRJT05cbiAgICAgIHx8IGRlY2xhcmF0aW9uLnR5cGUgPT09IFRTX0lOVEVSRkFDRV9ERUNMQVJBVElPTlxuICAgICAgfHwgZGVjbGFyYXRpb24udHlwZSA9PT0gVFNfVFlQRV9BTElBU19ERUNMQVJBVElPTlxuICAgICAgfHwgZGVjbGFyYXRpb24udHlwZSA9PT0gVFNfRU5VTV9ERUNMQVJBVElPTlxuICAgICkge1xuICAgICAgY2IoZGVjbGFyYXRpb24uaWQubmFtZSk7XG4gICAgfSBlbHNlIGlmIChkZWNsYXJhdGlvbi50eXBlID09PSBWQVJJQUJMRV9ERUNMQVJBVElPTikge1xuICAgICAgZGVjbGFyYXRpb24uZGVjbGFyYXRpb25zLmZvckVhY2goKHsgaWQgfSkgPT4ge1xuICAgICAgICBpZiAoaWQudHlwZSA9PT0gT0JKRUNUX1BBVFRFUk4pIHtcbiAgICAgICAgICByZWN1cnNpdmVQYXR0ZXJuQ2FwdHVyZShpZCwgKHBhdHRlcm4pID0+IHtcbiAgICAgICAgICAgIGlmIChwYXR0ZXJuLnR5cGUgPT09IElERU5USUZJRVIpIHtcbiAgICAgICAgICAgICAgY2IocGF0dGVybi5uYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjYihpZC5uYW1lKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogTGlzdCBvZiBpbXBvcnRzIHBlciBmaWxlLlxuICpcbiAqIFJlcHJlc2VudGVkIGJ5IGEgdHdvLWxldmVsIE1hcCB0byBhIFNldCBvZiBpZGVudGlmaWVycy4gVGhlIHVwcGVyLWxldmVsIE1hcFxuICoga2V5cyBhcmUgdGhlIHBhdGhzIHRvIHRoZSBtb2R1bGVzIGNvbnRhaW5pbmcgdGhlIGltcG9ydHMsIHdoaWxlIHRoZVxuICogbG93ZXItbGV2ZWwgTWFwIGtleXMgYXJlIHRoZSBwYXRocyB0byB0aGUgZmlsZXMgd2hpY2ggYXJlIGJlaW5nIGltcG9ydGVkXG4gKiBmcm9tLiBMYXN0bHksIHRoZSBTZXQgb2YgaWRlbnRpZmllcnMgY29udGFpbnMgZWl0aGVyIG5hbWVzIGJlaW5nIGltcG9ydGVkXG4gKiBvciBhIHNwZWNpYWwgQVNUIG5vZGUgbmFtZSBsaXN0ZWQgYWJvdmUgKGUuZyBJbXBvcnREZWZhdWx0U3BlY2lmaWVyKS5cbiAqXG4gKiBGb3IgZXhhbXBsZSwgaWYgd2UgaGF2ZSBhIGZpbGUgbmFtZWQgZm9vLmpzIGNvbnRhaW5pbmc6XG4gKlxuICogICBpbXBvcnQgeyBvMiB9IGZyb20gJy4vYmFyLmpzJztcbiAqXG4gKiBUaGVuIHdlIHdpbGwgaGF2ZSBhIHN0cnVjdHVyZSB0aGF0IGxvb2tzIGxpa2U6XG4gKlxuICogICBNYXAgeyAnZm9vLmpzJyA9PiBNYXAgeyAnYmFyLmpzJyA9PiBTZXQgeyAnbzInIH0gfSB9XG4gKlxuICogQHR5cGUge01hcDxzdHJpbmcsIE1hcDxzdHJpbmcsIFNldDxzdHJpbmc+Pj59XG4gKi9cbmNvbnN0IGltcG9ydExpc3QgPSBuZXcgTWFwKCk7XG5cbi8qKlxuICogTGlzdCBvZiBleHBvcnRzIHBlciBmaWxlLlxuICpcbiAqIFJlcHJlc2VudGVkIGJ5IGEgdHdvLWxldmVsIE1hcCB0byBhbiBvYmplY3Qgb2YgbWV0YWRhdGEuIFRoZSB1cHBlci1sZXZlbCBNYXBcbiAqIGtleXMgYXJlIHRoZSBwYXRocyB0byB0aGUgbW9kdWxlcyBjb250YWluaW5nIHRoZSBleHBvcnRzLCB3aGlsZSB0aGVcbiAqIGxvd2VyLWxldmVsIE1hcCBrZXlzIGFyZSB0aGUgc3BlY2lmaWMgaWRlbnRpZmllcnMgb3Igc3BlY2lhbCBBU1Qgbm9kZSBuYW1lc1xuICogYmVpbmcgZXhwb3J0ZWQuIFRoZSBsZWFmLWxldmVsIG1ldGFkYXRhIG9iamVjdCBhdCB0aGUgbW9tZW50IG9ubHkgY29udGFpbnMgYVxuICogYHdoZXJlVXNlZGAgcHJvcGVydHksIHdoaWNoIGNvbnRhaW5zIGEgU2V0IG9mIHBhdGhzIHRvIG1vZHVsZXMgdGhhdCBpbXBvcnRcbiAqIHRoZSBuYW1lLlxuICpcbiAqIEZvciBleGFtcGxlLCBpZiB3ZSBoYXZlIGEgZmlsZSBuYW1lZCBiYXIuanMgY29udGFpbmluZyB0aGUgZm9sbG93aW5nIGV4cG9ydHM6XG4gKlxuICogICBjb25zdCBvMiA9ICdiYXInO1xuICogICBleHBvcnQgeyBvMiB9O1xuICpcbiAqIEFuZCBhIGZpbGUgbmFtZWQgZm9vLmpzIGNvbnRhaW5pbmcgdGhlIGZvbGxvd2luZyBpbXBvcnQ6XG4gKlxuICogICBpbXBvcnQgeyBvMiB9IGZyb20gJy4vYmFyLmpzJztcbiAqXG4gKiBUaGVuIHdlIHdpbGwgaGF2ZSBhIHN0cnVjdHVyZSB0aGF0IGxvb2tzIGxpa2U6XG4gKlxuICogICBNYXAgeyAnYmFyLmpzJyA9PiBNYXAgeyAnbzInID0+IHsgd2hlcmVVc2VkOiBTZXQgeyAnZm9vLmpzJyB9IH0gfSB9XG4gKlxuICogQHR5cGUge01hcDxzdHJpbmcsIE1hcDxzdHJpbmcsIG9iamVjdD4+fVxuICovXG5jb25zdCBleHBvcnRMaXN0ID0gbmV3IE1hcCgpO1xuXG5jb25zdCB2aXNpdG9yS2V5TWFwID0gbmV3IE1hcCgpO1xuXG5jb25zdCBpZ25vcmVkRmlsZXMgPSBuZXcgU2V0KCk7XG5jb25zdCBmaWxlc091dHNpZGVTcmMgPSBuZXcgU2V0KCk7XG5cbmNvbnN0IGlzTm9kZU1vZHVsZSA9IChwYXRoKSA9PiAoL1xcLyhub2RlX21vZHVsZXMpXFwvLykudGVzdChwYXRoKTtcblxuLyoqXG4gKiByZWFkIGFsbCBmaWxlcyBtYXRjaGluZyB0aGUgcGF0dGVybnMgaW4gc3JjIGFuZCBpZ25vcmVFeHBvcnRzXG4gKlxuICogcmV0dXJuIGFsbCBmaWxlcyBtYXRjaGluZyBzcmMgcGF0dGVybiwgd2hpY2ggYXJlIG5vdCBtYXRjaGluZyB0aGUgaWdub3JlRXhwb3J0cyBwYXR0ZXJuXG4gKi9cbmNvbnN0IHJlc29sdmVGaWxlcyA9IChzcmMsIGlnbm9yZUV4cG9ydHMsIGNvbnRleHQpID0+IHtcbiAgY29uc3QgZXh0ZW5zaW9ucyA9IEFycmF5LmZyb20oZ2V0RmlsZUV4dGVuc2lvbnMoY29udGV4dC5zZXR0aW5ncykpO1xuXG4gIGNvbnN0IHNyY0ZpbGVMaXN0ID0gbGlzdEZpbGVzVG9Qcm9jZXNzKHNyYywgZXh0ZW5zaW9ucyk7XG5cbiAgLy8gcHJlcGFyZSBsaXN0IG9mIGlnbm9yZWQgZmlsZXNcbiAgY29uc3QgaWdub3JlZEZpbGVzTGlzdCA9IGxpc3RGaWxlc1RvUHJvY2VzcyhpZ25vcmVFeHBvcnRzLCBleHRlbnNpb25zKTtcbiAgaWdub3JlZEZpbGVzTGlzdC5mb3JFYWNoKCh7IGZpbGVuYW1lIH0pID0+IGlnbm9yZWRGaWxlcy5hZGQoZmlsZW5hbWUpKTtcblxuICAvLyBwcmVwYXJlIGxpc3Qgb2Ygc291cmNlIGZpbGVzLCBkb24ndCBjb25zaWRlciBmaWxlcyBmcm9tIG5vZGVfbW9kdWxlc1xuXG4gIHJldHVybiBuZXcgU2V0KFxuICAgIGZsYXRNYXAoc3JjRmlsZUxpc3QsICh7IGZpbGVuYW1lIH0pID0+IGlzTm9kZU1vZHVsZShmaWxlbmFtZSkgPyBbXSA6IGZpbGVuYW1lKSxcbiAgKTtcbn07XG5cbi8qKlxuICogcGFyc2UgYWxsIHNvdXJjZSBmaWxlcyBhbmQgYnVpbGQgdXAgMiBtYXBzIGNvbnRhaW5pbmcgdGhlIGV4aXN0aW5nIGltcG9ydHMgYW5kIGV4cG9ydHNcbiAqL1xuY29uc3QgcHJlcGFyZUltcG9ydHNBbmRFeHBvcnRzID0gKHNyY0ZpbGVzLCBjb250ZXh0KSA9PiB7XG4gIGNvbnN0IGV4cG9ydEFsbCA9IG5ldyBNYXAoKTtcbiAgc3JjRmlsZXMuZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgIGNvbnN0IGV4cG9ydHMgPSBuZXcgTWFwKCk7XG4gICAgY29uc3QgaW1wb3J0cyA9IG5ldyBNYXAoKTtcbiAgICBjb25zdCBjdXJyZW50RXhwb3J0cyA9IEV4cG9ydHMuZ2V0KGZpbGUsIGNvbnRleHQpO1xuICAgIGlmIChjdXJyZW50RXhwb3J0cykge1xuICAgICAgY29uc3Qge1xuICAgICAgICBkZXBlbmRlbmNpZXMsXG4gICAgICAgIHJlZXhwb3J0cyxcbiAgICAgICAgaW1wb3J0czogbG9jYWxJbXBvcnRMaXN0LFxuICAgICAgICBuYW1lc3BhY2UsXG4gICAgICAgIHZpc2l0b3JLZXlzLFxuICAgICAgfSA9IGN1cnJlbnRFeHBvcnRzO1xuXG4gICAgICB2aXNpdG9yS2V5TWFwLnNldChmaWxlLCB2aXNpdG9yS2V5cyk7XG4gICAgICAvLyBkZXBlbmRlbmNpZXMgPT09IGV4cG9ydCAqIGZyb21cbiAgICAgIGNvbnN0IGN1cnJlbnRFeHBvcnRBbGwgPSBuZXcgU2V0KCk7XG4gICAgICBkZXBlbmRlbmNpZXMuZm9yRWFjaCgoZ2V0RGVwZW5kZW5jeSkgPT4ge1xuICAgICAgICBjb25zdCBkZXBlbmRlbmN5ID0gZ2V0RGVwZW5kZW5jeSgpO1xuICAgICAgICBpZiAoZGVwZW5kZW5jeSA9PT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGN1cnJlbnRFeHBvcnRBbGwuYWRkKGRlcGVuZGVuY3kucGF0aCk7XG4gICAgICB9KTtcbiAgICAgIGV4cG9ydEFsbC5zZXQoZmlsZSwgY3VycmVudEV4cG9ydEFsbCk7XG5cbiAgICAgIHJlZXhwb3J0cy5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgIGlmIChrZXkgPT09IERFRkFVTFQpIHtcbiAgICAgICAgICBleHBvcnRzLnNldChJTVBPUlRfREVGQVVMVF9TUEVDSUZJRVIsIHsgd2hlcmVVc2VkOiBuZXcgU2V0KCkgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZXhwb3J0cy5zZXQoa2V5LCB7IHdoZXJlVXNlZDogbmV3IFNldCgpIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlZXhwb3J0ID0gIHZhbHVlLmdldEltcG9ydCgpO1xuICAgICAgICBpZiAoIXJlZXhwb3J0KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBsb2NhbEltcG9ydCA9IGltcG9ydHMuZ2V0KHJlZXhwb3J0LnBhdGgpO1xuICAgICAgICBsZXQgY3VycmVudFZhbHVlO1xuICAgICAgICBpZiAodmFsdWUubG9jYWwgPT09IERFRkFVTFQpIHtcbiAgICAgICAgICBjdXJyZW50VmFsdWUgPSBJTVBPUlRfREVGQVVMVF9TUEVDSUZJRVI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3VycmVudFZhbHVlID0gdmFsdWUubG9jYWw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBsb2NhbEltcG9ydCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICBsb2NhbEltcG9ydCA9IG5ldyBTZXQoWy4uLmxvY2FsSW1wb3J0LCBjdXJyZW50VmFsdWVdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsb2NhbEltcG9ydCA9IG5ldyBTZXQoW2N1cnJlbnRWYWx1ZV0pO1xuICAgICAgICB9XG4gICAgICAgIGltcG9ydHMuc2V0KHJlZXhwb3J0LnBhdGgsIGxvY2FsSW1wb3J0KTtcbiAgICAgIH0pO1xuXG4gICAgICBsb2NhbEltcG9ydExpc3QuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICBpZiAoaXNOb2RlTW9kdWxlKGtleSkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbG9jYWxJbXBvcnQgPSBpbXBvcnRzLmdldChrZXkpIHx8IG5ldyBTZXQoKTtcbiAgICAgICAgdmFsdWUuZGVjbGFyYXRpb25zLmZvckVhY2goKHsgaW1wb3J0ZWRTcGVjaWZpZXJzIH0pID0+IHtcbiAgICAgICAgICBpbXBvcnRlZFNwZWNpZmllcnMuZm9yRWFjaCgoc3BlY2lmaWVyKSA9PiB7XG4gICAgICAgICAgICBsb2NhbEltcG9ydC5hZGQoc3BlY2lmaWVyKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGltcG9ydHMuc2V0KGtleSwgbG9jYWxJbXBvcnQpO1xuICAgICAgfSk7XG4gICAgICBpbXBvcnRMaXN0LnNldChmaWxlLCBpbXBvcnRzKTtcblxuICAgICAgLy8gYnVpbGQgdXAgZXhwb3J0IGxpc3Qgb25seSwgaWYgZmlsZSBpcyBub3QgaWdub3JlZFxuICAgICAgaWYgKGlnbm9yZWRGaWxlcy5oYXMoZmlsZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgbmFtZXNwYWNlLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgaWYgKGtleSA9PT0gREVGQVVMVCkge1xuICAgICAgICAgIGV4cG9ydHMuc2V0KElNUE9SVF9ERUZBVUxUX1NQRUNJRklFUiwgeyB3aGVyZVVzZWQ6IG5ldyBTZXQoKSB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBleHBvcnRzLnNldChrZXksIHsgd2hlcmVVc2VkOiBuZXcgU2V0KCkgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBleHBvcnRzLnNldChFWFBPUlRfQUxMX0RFQ0xBUkFUSU9OLCB7IHdoZXJlVXNlZDogbmV3IFNldCgpIH0pO1xuICAgIGV4cG9ydHMuc2V0KElNUE9SVF9OQU1FU1BBQ0VfU1BFQ0lGSUVSLCB7IHdoZXJlVXNlZDogbmV3IFNldCgpIH0pO1xuICAgIGV4cG9ydExpc3Quc2V0KGZpbGUsIGV4cG9ydHMpO1xuICB9KTtcbiAgZXhwb3J0QWxsLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICB2YWx1ZS5mb3JFYWNoKCh2YWwpID0+IHtcbiAgICAgIGNvbnN0IGN1cnJlbnRFeHBvcnRzID0gZXhwb3J0TGlzdC5nZXQodmFsKTtcbiAgICAgIGlmIChjdXJyZW50RXhwb3J0cykge1xuICAgICAgICBjb25zdCBjdXJyZW50RXhwb3J0ID0gY3VycmVudEV4cG9ydHMuZ2V0KEVYUE9SVF9BTExfREVDTEFSQVRJT04pO1xuICAgICAgICBjdXJyZW50RXhwb3J0LndoZXJlVXNlZC5hZGQoa2V5KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59O1xuXG4vKipcbiAqIHRyYXZlcnNlIHRocm91Z2ggYWxsIGltcG9ydHMgYW5kIGFkZCB0aGUgcmVzcGVjdGl2ZSBwYXRoIHRvIHRoZSB3aGVyZVVzZWQtbGlzdFxuICogb2YgdGhlIGNvcnJlc3BvbmRpbmcgZXhwb3J0XG4gKi9cbmNvbnN0IGRldGVybWluZVVzYWdlID0gKCkgPT4ge1xuICBpbXBvcnRMaXN0LmZvckVhY2goKGxpc3RWYWx1ZSwgbGlzdEtleSkgPT4ge1xuICAgIGxpc3RWYWx1ZS5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICBjb25zdCBleHBvcnRzID0gZXhwb3J0TGlzdC5nZXQoa2V5KTtcbiAgICAgIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdmFsdWUuZm9yRWFjaCgoY3VycmVudEltcG9ydCkgPT4ge1xuICAgICAgICAgIGxldCBzcGVjaWZpZXI7XG4gICAgICAgICAgaWYgKGN1cnJlbnRJbXBvcnQgPT09IElNUE9SVF9OQU1FU1BBQ0VfU1BFQ0lGSUVSKSB7XG4gICAgICAgICAgICBzcGVjaWZpZXIgPSBJTVBPUlRfTkFNRVNQQUNFX1NQRUNJRklFUjtcbiAgICAgICAgICB9IGVsc2UgaWYgKGN1cnJlbnRJbXBvcnQgPT09IElNUE9SVF9ERUZBVUxUX1NQRUNJRklFUikge1xuICAgICAgICAgICAgc3BlY2lmaWVyID0gSU1QT1JUX0RFRkFVTFRfU1BFQ0lGSUVSO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzcGVjaWZpZXIgPSBjdXJyZW50SW1wb3J0O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodHlwZW9mIHNwZWNpZmllciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGNvbnN0IGV4cG9ydFN0YXRlbWVudCA9IGV4cG9ydHMuZ2V0KHNwZWNpZmllcik7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGV4cG9ydFN0YXRlbWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgY29uc3QgeyB3aGVyZVVzZWQgfSA9IGV4cG9ydFN0YXRlbWVudDtcbiAgICAgICAgICAgICAgd2hlcmVVc2VkLmFkZChsaXN0S2V5KTtcbiAgICAgICAgICAgICAgZXhwb3J0cy5zZXQoc3BlY2lmaWVyLCB7IHdoZXJlVXNlZCB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn07XG5cbmNvbnN0IGdldFNyYyA9IChzcmMpID0+IHtcbiAgaWYgKHNyYykge1xuICAgIHJldHVybiBzcmM7XG4gIH1cbiAgcmV0dXJuIFtwcm9jZXNzLmN3ZCgpXTtcbn07XG5cbi8qKlxuICogcHJlcGFyZSB0aGUgbGlzdHMgb2YgZXhpc3RpbmcgaW1wb3J0cyBhbmQgZXhwb3J0cyAtIHNob3VsZCBvbmx5IGJlIGV4ZWN1dGVkIG9uY2UgYXRcbiAqIHRoZSBzdGFydCBvZiBhIG5ldyBlc2xpbnQgcnVuXG4gKi9cbmxldCBzcmNGaWxlcztcbmxldCBsYXN0UHJlcGFyZUtleTtcbmNvbnN0IGRvUHJlcGFyYXRpb24gPSAoc3JjLCBpZ25vcmVFeHBvcnRzLCBjb250ZXh0KSA9PiB7XG4gIGNvbnN0IHByZXBhcmVLZXkgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgc3JjOiAoc3JjIHx8IFtdKS5zb3J0KCksXG4gICAgaWdub3JlRXhwb3J0czogKGlnbm9yZUV4cG9ydHMgfHwgW10pLnNvcnQoKSxcbiAgICBleHRlbnNpb25zOiBBcnJheS5mcm9tKGdldEZpbGVFeHRlbnNpb25zKGNvbnRleHQuc2V0dGluZ3MpKS5zb3J0KCksXG4gIH0pO1xuICBpZiAocHJlcGFyZUtleSA9PT0gbGFzdFByZXBhcmVLZXkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpbXBvcnRMaXN0LmNsZWFyKCk7XG4gIGV4cG9ydExpc3QuY2xlYXIoKTtcbiAgaWdub3JlZEZpbGVzLmNsZWFyKCk7XG4gIGZpbGVzT3V0c2lkZVNyYy5jbGVhcigpO1xuXG4gIHNyY0ZpbGVzID0gcmVzb2x2ZUZpbGVzKGdldFNyYyhzcmMpLCBpZ25vcmVFeHBvcnRzLCBjb250ZXh0KTtcbiAgcHJlcGFyZUltcG9ydHNBbmRFeHBvcnRzKHNyY0ZpbGVzLCBjb250ZXh0KTtcbiAgZGV0ZXJtaW5lVXNhZ2UoKTtcbiAgbGFzdFByZXBhcmVLZXkgPSBwcmVwYXJlS2V5O1xufTtcblxuY29uc3QgbmV3TmFtZXNwYWNlSW1wb3J0RXhpc3RzID0gKHNwZWNpZmllcnMpID0+IHNwZWNpZmllcnMuc29tZSgoeyB0eXBlIH0pID0+IHR5cGUgPT09IElNUE9SVF9OQU1FU1BBQ0VfU1BFQ0lGSUVSKTtcblxuY29uc3QgbmV3RGVmYXVsdEltcG9ydEV4aXN0cyA9IChzcGVjaWZpZXJzKSA9PiBzcGVjaWZpZXJzLnNvbWUoKHsgdHlwZSB9KSA9PiB0eXBlID09PSBJTVBPUlRfREVGQVVMVF9TUEVDSUZJRVIpO1xuXG5jb25zdCBmaWxlSXNJblBrZyA9IChmaWxlKSA9PiB7XG4gIGNvbnN0IHsgcGF0aCwgcGtnIH0gPSByZWFkUGtnVXAoeyBjd2Q6IGZpbGUgfSk7XG4gIGNvbnN0IGJhc2VQYXRoID0gZGlybmFtZShwYXRoKTtcblxuICBjb25zdCBjaGVja1BrZ0ZpZWxkU3RyaW5nID0gKHBrZ0ZpZWxkKSA9PiB7XG4gICAgaWYgKGpvaW4oYmFzZVBhdGgsIHBrZ0ZpZWxkKSA9PT0gZmlsZSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGNoZWNrUGtnRmllbGRPYmplY3QgPSAocGtnRmllbGQpID0+IHtcbiAgICBjb25zdCBwa2dGaWVsZEZpbGVzID0gZmxhdE1hcCh2YWx1ZXMocGtnRmllbGQpLCAodmFsdWUpID0+IHR5cGVvZiB2YWx1ZSA9PT0gJ2Jvb2xlYW4nID8gW10gOiBqb2luKGJhc2VQYXRoLCB2YWx1ZSkpO1xuXG4gICAgaWYgKGluY2x1ZGVzKHBrZ0ZpZWxkRmlsZXMsIGZpbGUpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgY2hlY2tQa2dGaWVsZCA9IChwa2dGaWVsZCkgPT4ge1xuICAgIGlmICh0eXBlb2YgcGtnRmllbGQgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gY2hlY2tQa2dGaWVsZFN0cmluZyhwa2dGaWVsZCk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBwa2dGaWVsZCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHJldHVybiBjaGVja1BrZ0ZpZWxkT2JqZWN0KHBrZ0ZpZWxkKTtcbiAgICB9XG4gIH07XG5cbiAgaWYgKHBrZy5wcml2YXRlID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHBrZy5iaW4pIHtcbiAgICBpZiAoY2hlY2tQa2dGaWVsZChwa2cuYmluKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgaWYgKHBrZy5icm93c2VyKSB7XG4gICAgaWYgKGNoZWNrUGtnRmllbGQocGtnLmJyb3dzZXIpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBpZiAocGtnLm1haW4pIHtcbiAgICBpZiAoY2hlY2tQa2dGaWVsZFN0cmluZyhwa2cubWFpbikpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3N1Z2dlc3Rpb24nLFxuICAgIGRvY3M6IHtcbiAgICAgIGNhdGVnb3J5OiAnSGVscGZ1bCB3YXJuaW5ncycsXG4gICAgICBkZXNjcmlwdGlvbjogJ0ZvcmJpZCBtb2R1bGVzIHdpdGhvdXQgZXhwb3J0cywgb3IgZXhwb3J0cyB3aXRob3V0IG1hdGNoaW5nIGltcG9ydCBpbiBhbm90aGVyIG1vZHVsZS4nLFxuICAgICAgdXJsOiBkb2NzVXJsKCduby11bnVzZWQtbW9kdWxlcycpLFxuICAgIH0sXG4gICAgc2NoZW1hOiBbe1xuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBzcmM6IHtcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ2ZpbGVzL3BhdGhzIHRvIGJlIGFuYWx5emVkIChvbmx5IGZvciB1bnVzZWQgZXhwb3J0cyknLFxuICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgdW5pcXVlSXRlbXM6IHRydWUsXG4gICAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgbWluTGVuZ3RoOiAxLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGlnbm9yZUV4cG9ydHM6IHtcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ2ZpbGVzL3BhdGhzIGZvciB3aGljaCB1bnVzZWQgZXhwb3J0cyB3aWxsIG5vdCBiZSByZXBvcnRlZCAoZS5nIG1vZHVsZSBlbnRyeSBwb2ludHMpJyxcbiAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgIHVuaXF1ZUl0ZW1zOiB0cnVlLFxuICAgICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgIG1pbkxlbmd0aDogMSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBtaXNzaW5nRXhwb3J0czoge1xuICAgICAgICAgIGRlc2NyaXB0aW9uOiAncmVwb3J0IG1vZHVsZXMgd2l0aG91dCBhbnkgZXhwb3J0cycsXG4gICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICB9LFxuICAgICAgICB1bnVzZWRFeHBvcnRzOiB7XG4gICAgICAgICAgZGVzY3JpcHRpb246ICdyZXBvcnQgZXhwb3J0cyB3aXRob3V0IGFueSB1c2FnZScsXG4gICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGFueU9mOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICB1bnVzZWRFeHBvcnRzOiB7IGVudW06IFt0cnVlXSB9LFxuICAgICAgICAgICAgc3JjOiB7XG4gICAgICAgICAgICAgIG1pbkl0ZW1zOiAxLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlcXVpcmVkOiBbJ3VudXNlZEV4cG9ydHMnXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIG1pc3NpbmdFeHBvcnRzOiB7IGVudW06IFt0cnVlXSB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgcmVxdWlyZWQ6IFsnbWlzc2luZ0V4cG9ydHMnXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfV0sXG4gIH0sXG5cbiAgY3JlYXRlKGNvbnRleHQpIHtcbiAgICBjb25zdCB7XG4gICAgICBzcmMsXG4gICAgICBpZ25vcmVFeHBvcnRzID0gW10sXG4gICAgICBtaXNzaW5nRXhwb3J0cyxcbiAgICAgIHVudXNlZEV4cG9ydHMsXG4gICAgfSA9IGNvbnRleHQub3B0aW9uc1swXSB8fCB7fTtcblxuICAgIGlmICh1bnVzZWRFeHBvcnRzKSB7XG4gICAgICBkb1ByZXBhcmF0aW9uKHNyYywgaWdub3JlRXhwb3J0cywgY29udGV4dCk7XG4gICAgfVxuXG4gICAgY29uc3QgZmlsZSA9IGNvbnRleHQuZ2V0UGh5c2ljYWxGaWxlbmFtZSA/IGNvbnRleHQuZ2V0UGh5c2ljYWxGaWxlbmFtZSgpIDogY29udGV4dC5nZXRGaWxlbmFtZSgpO1xuXG4gICAgY29uc3QgY2hlY2tFeHBvcnRQcmVzZW5jZSA9IChub2RlKSA9PiB7XG4gICAgICBpZiAoIW1pc3NpbmdFeHBvcnRzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKGlnbm9yZWRGaWxlcy5oYXMoZmlsZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBleHBvcnRDb3VudCA9IGV4cG9ydExpc3QuZ2V0KGZpbGUpO1xuICAgICAgY29uc3QgZXhwb3J0QWxsID0gZXhwb3J0Q291bnQuZ2V0KEVYUE9SVF9BTExfREVDTEFSQVRJT04pO1xuICAgICAgY29uc3QgbmFtZXNwYWNlSW1wb3J0cyA9IGV4cG9ydENvdW50LmdldChJTVBPUlRfTkFNRVNQQUNFX1NQRUNJRklFUik7XG5cbiAgICAgIGV4cG9ydENvdW50LmRlbGV0ZShFWFBPUlRfQUxMX0RFQ0xBUkFUSU9OKTtcbiAgICAgIGV4cG9ydENvdW50LmRlbGV0ZShJTVBPUlRfTkFNRVNQQUNFX1NQRUNJRklFUik7XG4gICAgICBpZiAoZXhwb3J0Q291bnQuc2l6ZSA8IDEpIHtcbiAgICAgICAgLy8gbm9kZS5ib2R5WzBdID09PSAndW5kZWZpbmVkJyBvbmx5IGhhcHBlbnMsIGlmIGV2ZXJ5dGhpbmcgaXMgY29tbWVudGVkIG91dCBpbiB0aGUgZmlsZVxuICAgICAgICAvLyBiZWluZyBsaW50ZWRcbiAgICAgICAgY29udGV4dC5yZXBvcnQobm9kZS5ib2R5WzBdID8gbm9kZS5ib2R5WzBdIDogbm9kZSwgJ05vIGV4cG9ydHMgZm91bmQnKTtcbiAgICAgIH1cbiAgICAgIGV4cG9ydENvdW50LnNldChFWFBPUlRfQUxMX0RFQ0xBUkFUSU9OLCBleHBvcnRBbGwpO1xuICAgICAgZXhwb3J0Q291bnQuc2V0KElNUE9SVF9OQU1FU1BBQ0VfU1BFQ0lGSUVSLCBuYW1lc3BhY2VJbXBvcnRzKTtcbiAgICB9O1xuXG4gICAgY29uc3QgY2hlY2tVc2FnZSA9IChub2RlLCBleHBvcnRlZFZhbHVlKSA9PiB7XG4gICAgICBpZiAoIXVudXNlZEV4cG9ydHMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoaWdub3JlZEZpbGVzLmhhcyhmaWxlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChmaWxlSXNJblBrZyhmaWxlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChmaWxlc091dHNpZGVTcmMuaGFzKGZpbGUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gbWFrZSBzdXJlIGZpbGUgdG8gYmUgbGludGVkIGlzIGluY2x1ZGVkIGluIHNvdXJjZSBmaWxlc1xuICAgICAgaWYgKCFzcmNGaWxlcy5oYXMoZmlsZSkpIHtcbiAgICAgICAgc3JjRmlsZXMgPSByZXNvbHZlRmlsZXMoZ2V0U3JjKHNyYyksIGlnbm9yZUV4cG9ydHMsIGNvbnRleHQpO1xuICAgICAgICBpZiAoIXNyY0ZpbGVzLmhhcyhmaWxlKSkge1xuICAgICAgICAgIGZpbGVzT3V0c2lkZVNyYy5hZGQoZmlsZSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGV4cG9ydHMgPSBleHBvcnRMaXN0LmdldChmaWxlKTtcblxuICAgICAgLy8gc3BlY2lhbCBjYXNlOiBleHBvcnQgKiBmcm9tXG4gICAgICBjb25zdCBleHBvcnRBbGwgPSBleHBvcnRzLmdldChFWFBPUlRfQUxMX0RFQ0xBUkFUSU9OKTtcbiAgICAgIGlmICh0eXBlb2YgZXhwb3J0QWxsICE9PSAndW5kZWZpbmVkJyAmJiBleHBvcnRlZFZhbHVlICE9PSBJTVBPUlRfREVGQVVMVF9TUEVDSUZJRVIpIHtcbiAgICAgICAgaWYgKGV4cG9ydEFsbC53aGVyZVVzZWQuc2l6ZSA+IDApIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gc3BlY2lhbCBjYXNlOiBuYW1lc3BhY2UgaW1wb3J0XG4gICAgICBjb25zdCBuYW1lc3BhY2VJbXBvcnRzID0gZXhwb3J0cy5nZXQoSU1QT1JUX05BTUVTUEFDRV9TUEVDSUZJRVIpO1xuICAgICAgaWYgKHR5cGVvZiBuYW1lc3BhY2VJbXBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBpZiAobmFtZXNwYWNlSW1wb3J0cy53aGVyZVVzZWQuc2l6ZSA+IDApIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gZXhwb3J0c0xpc3Qgd2lsbCBhbHdheXMgbWFwIGFueSBpbXBvcnRlZCB2YWx1ZSBvZiAnZGVmYXVsdCcgdG8gJ0ltcG9ydERlZmF1bHRTcGVjaWZpZXInXG4gICAgICBjb25zdCBleHBvcnRzS2V5ID0gZXhwb3J0ZWRWYWx1ZSA9PT0gREVGQVVMVCA/IElNUE9SVF9ERUZBVUxUX1NQRUNJRklFUiA6IGV4cG9ydGVkVmFsdWU7XG5cbiAgICAgIGNvbnN0IGV4cG9ydFN0YXRlbWVudCA9IGV4cG9ydHMuZ2V0KGV4cG9ydHNLZXkpO1xuXG4gICAgICBjb25zdCB2YWx1ZSA9IGV4cG9ydHNLZXkgPT09IElNUE9SVF9ERUZBVUxUX1NQRUNJRklFUiA/IERFRkFVTFQgOiBleHBvcnRzS2V5O1xuXG4gICAgICBpZiAodHlwZW9mIGV4cG9ydFN0YXRlbWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgaWYgKGV4cG9ydFN0YXRlbWVudC53aGVyZVVzZWQuc2l6ZSA8IDEpIHtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydChcbiAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICBgZXhwb3J0ZWQgZGVjbGFyYXRpb24gJyR7dmFsdWV9JyBub3QgdXNlZCB3aXRoaW4gb3RoZXIgbW9kdWxlc2AsXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29udGV4dC5yZXBvcnQoXG4gICAgICAgICAgbm9kZSxcbiAgICAgICAgICBgZXhwb3J0ZWQgZGVjbGFyYXRpb24gJyR7dmFsdWV9JyBub3QgdXNlZCB3aXRoaW4gb3RoZXIgbW9kdWxlc2AsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIG9ubHkgdXNlZnVsIGZvciB0b29scyBsaWtlIHZzY29kZS1lc2xpbnRcbiAgICAgKlxuICAgICAqIHVwZGF0ZSBsaXN0cyBvZiBleGlzdGluZyBleHBvcnRzIGR1cmluZyBydW50aW1lXG4gICAgICovXG4gICAgY29uc3QgdXBkYXRlRXhwb3J0VXNhZ2UgPSAobm9kZSkgPT4ge1xuICAgICAgaWYgKGlnbm9yZWRGaWxlcy5oYXMoZmlsZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBsZXQgZXhwb3J0cyA9IGV4cG9ydExpc3QuZ2V0KGZpbGUpO1xuXG4gICAgICAvLyBuZXcgbW9kdWxlIGhhcyBiZWVuIGNyZWF0ZWQgZHVyaW5nIHJ1bnRpbWVcbiAgICAgIC8vIGluY2x1ZGUgaXQgaW4gZnVydGhlciBwcm9jZXNzaW5nXG4gICAgICBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGV4cG9ydHMgPSBuZXcgTWFwKCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG5ld0V4cG9ydHMgPSBuZXcgTWFwKCk7XG4gICAgICBjb25zdCBuZXdFeHBvcnRJZGVudGlmaWVycyA9IG5ldyBTZXQoKTtcblxuICAgICAgbm9kZS5ib2R5LmZvckVhY2goKHsgdHlwZSwgZGVjbGFyYXRpb24sIHNwZWNpZmllcnMgfSkgPT4ge1xuICAgICAgICBpZiAodHlwZSA9PT0gRVhQT1JUX0RFRkFVTFRfREVDTEFSQVRJT04pIHtcbiAgICAgICAgICBuZXdFeHBvcnRJZGVudGlmaWVycy5hZGQoSU1QT1JUX0RFRkFVTFRfU1BFQ0lGSUVSKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZSA9PT0gRVhQT1JUX05BTUVEX0RFQ0xBUkFUSU9OKSB7XG4gICAgICAgICAgaWYgKHNwZWNpZmllcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgc3BlY2lmaWVycy5mb3JFYWNoKChzcGVjaWZpZXIpID0+IHtcbiAgICAgICAgICAgICAgaWYgKHNwZWNpZmllci5leHBvcnRlZCkge1xuICAgICAgICAgICAgICAgIG5ld0V4cG9ydElkZW50aWZpZXJzLmFkZChzcGVjaWZpZXIuZXhwb3J0ZWQubmFtZSB8fCBzcGVjaWZpZXIuZXhwb3J0ZWQudmFsdWUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZm9yRWFjaERlY2xhcmF0aW9uSWRlbnRpZmllcihkZWNsYXJhdGlvbiwgKG5hbWUpID0+IHtcbiAgICAgICAgICAgIG5ld0V4cG9ydElkZW50aWZpZXJzLmFkZChuYW1lKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vIG9sZCBleHBvcnRzIGV4aXN0IHdpdGhpbiBsaXN0IG9mIG5ldyBleHBvcnRzIGlkZW50aWZpZXJzOiBhZGQgdG8gbWFwIG9mIG5ldyBleHBvcnRzXG4gICAgICBleHBvcnRzLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgaWYgKG5ld0V4cG9ydElkZW50aWZpZXJzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgbmV3RXhwb3J0cy5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyBuZXcgZXhwb3J0IGlkZW50aWZpZXJzIGFkZGVkOiBhZGQgdG8gbWFwIG9mIG5ldyBleHBvcnRzXG4gICAgICBuZXdFeHBvcnRJZGVudGlmaWVycy5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgaWYgKCFleHBvcnRzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgbmV3RXhwb3J0cy5zZXQoa2V5LCB7IHdoZXJlVXNlZDogbmV3IFNldCgpIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8gcHJlc2VydmUgaW5mb3JtYXRpb24gYWJvdXQgbmFtZXNwYWNlIGltcG9ydHNcbiAgICAgIGNvbnN0IGV4cG9ydEFsbCA9IGV4cG9ydHMuZ2V0KEVYUE9SVF9BTExfREVDTEFSQVRJT04pO1xuICAgICAgbGV0IG5hbWVzcGFjZUltcG9ydHMgPSBleHBvcnRzLmdldChJTVBPUlRfTkFNRVNQQUNFX1NQRUNJRklFUik7XG5cbiAgICAgIGlmICh0eXBlb2YgbmFtZXNwYWNlSW1wb3J0cyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgbmFtZXNwYWNlSW1wb3J0cyA9IHsgd2hlcmVVc2VkOiBuZXcgU2V0KCkgfTtcbiAgICAgIH1cblxuICAgICAgbmV3RXhwb3J0cy5zZXQoRVhQT1JUX0FMTF9ERUNMQVJBVElPTiwgZXhwb3J0QWxsKTtcbiAgICAgIG5ld0V4cG9ydHMuc2V0KElNUE9SVF9OQU1FU1BBQ0VfU1BFQ0lGSUVSLCBuYW1lc3BhY2VJbXBvcnRzKTtcbiAgICAgIGV4cG9ydExpc3Quc2V0KGZpbGUsIG5ld0V4cG9ydHMpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBvbmx5IHVzZWZ1bCBmb3IgdG9vbHMgbGlrZSB2c2NvZGUtZXNsaW50XG4gICAgICpcbiAgICAgKiB1cGRhdGUgbGlzdHMgb2YgZXhpc3RpbmcgaW1wb3J0cyBkdXJpbmcgcnVudGltZVxuICAgICAqL1xuICAgIGNvbnN0IHVwZGF0ZUltcG9ydFVzYWdlID0gKG5vZGUpID0+IHtcbiAgICAgIGlmICghdW51c2VkRXhwb3J0cykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGxldCBvbGRJbXBvcnRQYXRocyA9IGltcG9ydExpc3QuZ2V0KGZpbGUpO1xuICAgICAgaWYgKHR5cGVvZiBvbGRJbXBvcnRQYXRocyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgb2xkSW1wb3J0UGF0aHMgPSBuZXcgTWFwKCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG9sZE5hbWVzcGFjZUltcG9ydHMgPSBuZXcgU2V0KCk7XG4gICAgICBjb25zdCBuZXdOYW1lc3BhY2VJbXBvcnRzID0gbmV3IFNldCgpO1xuXG4gICAgICBjb25zdCBvbGRFeHBvcnRBbGwgPSBuZXcgU2V0KCk7XG4gICAgICBjb25zdCBuZXdFeHBvcnRBbGwgPSBuZXcgU2V0KCk7XG5cbiAgICAgIGNvbnN0IG9sZERlZmF1bHRJbXBvcnRzID0gbmV3IFNldCgpO1xuICAgICAgY29uc3QgbmV3RGVmYXVsdEltcG9ydHMgPSBuZXcgU2V0KCk7XG5cbiAgICAgIGNvbnN0IG9sZEltcG9ydHMgPSBuZXcgTWFwKCk7XG4gICAgICBjb25zdCBuZXdJbXBvcnRzID0gbmV3IE1hcCgpO1xuICAgICAgb2xkSW1wb3J0UGF0aHMuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICBpZiAodmFsdWUuaGFzKEVYUE9SVF9BTExfREVDTEFSQVRJT04pKSB7XG4gICAgICAgICAgb2xkRXhwb3J0QWxsLmFkZChrZXkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2YWx1ZS5oYXMoSU1QT1JUX05BTUVTUEFDRV9TUEVDSUZJRVIpKSB7XG4gICAgICAgICAgb2xkTmFtZXNwYWNlSW1wb3J0cy5hZGQoa2V5KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmFsdWUuaGFzKElNUE9SVF9ERUZBVUxUX1NQRUNJRklFUikpIHtcbiAgICAgICAgICBvbGREZWZhdWx0SW1wb3J0cy5hZGQoa2V5KTtcbiAgICAgICAgfVxuICAgICAgICB2YWx1ZS5mb3JFYWNoKCh2YWwpID0+IHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICB2YWwgIT09IElNUE9SVF9OQU1FU1BBQ0VfU1BFQ0lGSUVSXG4gICAgICAgICAgICAmJiB2YWwgIT09IElNUE9SVF9ERUZBVUxUX1NQRUNJRklFUlxuICAgICAgICAgICkge1xuICAgICAgICAgICAgb2xkSW1wb3J0cy5zZXQodmFsLCBrZXkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgZnVuY3Rpb24gcHJvY2Vzc0R5bmFtaWNJbXBvcnQoc291cmNlKSB7XG4gICAgICAgIGlmIChzb3VyY2UudHlwZSAhPT0gJ0xpdGVyYWwnKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcCA9IHJlc29sdmUoc291cmNlLnZhbHVlLCBjb250ZXh0KTtcbiAgICAgICAgaWYgKHAgPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIG5ld05hbWVzcGFjZUltcG9ydHMuYWRkKHApO1xuICAgICAgfVxuXG4gICAgICB2aXNpdChub2RlLCB2aXNpdG9yS2V5TWFwLmdldChmaWxlKSwge1xuICAgICAgICBJbXBvcnRFeHByZXNzaW9uKGNoaWxkKSB7XG4gICAgICAgICAgcHJvY2Vzc0R5bmFtaWNJbXBvcnQoY2hpbGQuc291cmNlKTtcbiAgICAgICAgfSxcbiAgICAgICAgQ2FsbEV4cHJlc3Npb24oY2hpbGQpIHtcbiAgICAgICAgICBpZiAoY2hpbGQuY2FsbGVlLnR5cGUgPT09ICdJbXBvcnQnKSB7XG4gICAgICAgICAgICBwcm9jZXNzRHluYW1pY0ltcG9ydChjaGlsZC5hcmd1bWVudHNbMF0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBub2RlLmJvZHkuZm9yRWFjaCgoYXN0Tm9kZSkgPT4ge1xuICAgICAgICBsZXQgcmVzb2x2ZWRQYXRoO1xuXG4gICAgICAgIC8vIHN1cHBvcnQgZm9yIGV4cG9ydCB7IHZhbHVlIH0gZnJvbSAnbW9kdWxlJ1xuICAgICAgICBpZiAoYXN0Tm9kZS50eXBlID09PSBFWFBPUlRfTkFNRURfREVDTEFSQVRJT04pIHtcbiAgICAgICAgICBpZiAoYXN0Tm9kZS5zb3VyY2UpIHtcbiAgICAgICAgICAgIHJlc29sdmVkUGF0aCA9IHJlc29sdmUoYXN0Tm9kZS5zb3VyY2UucmF3LnJlcGxhY2UoLygnfFwiKS9nLCAnJyksIGNvbnRleHQpO1xuICAgICAgICAgICAgYXN0Tm9kZS5zcGVjaWZpZXJzLmZvckVhY2goKHNwZWNpZmllcikgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBuYW1lID0gc3BlY2lmaWVyLmxvY2FsLm5hbWUgfHwgc3BlY2lmaWVyLmxvY2FsLnZhbHVlO1xuICAgICAgICAgICAgICBpZiAobmFtZSA9PT0gREVGQVVMVCkge1xuICAgICAgICAgICAgICAgIG5ld0RlZmF1bHRJbXBvcnRzLmFkZChyZXNvbHZlZFBhdGgpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ld0ltcG9ydHMuc2V0KG5hbWUsIHJlc29sdmVkUGF0aCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhc3ROb2RlLnR5cGUgPT09IEVYUE9SVF9BTExfREVDTEFSQVRJT04pIHtcbiAgICAgICAgICByZXNvbHZlZFBhdGggPSByZXNvbHZlKGFzdE5vZGUuc291cmNlLnJhdy5yZXBsYWNlKC8oJ3xcIikvZywgJycpLCBjb250ZXh0KTtcbiAgICAgICAgICBuZXdFeHBvcnRBbGwuYWRkKHJlc29sdmVkUGF0aCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXN0Tm9kZS50eXBlID09PSBJTVBPUlRfREVDTEFSQVRJT04pIHtcbiAgICAgICAgICByZXNvbHZlZFBhdGggPSByZXNvbHZlKGFzdE5vZGUuc291cmNlLnJhdy5yZXBsYWNlKC8oJ3xcIikvZywgJycpLCBjb250ZXh0KTtcbiAgICAgICAgICBpZiAoIXJlc29sdmVkUGF0aCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChpc05vZGVNb2R1bGUocmVzb2x2ZWRQYXRoKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChuZXdOYW1lc3BhY2VJbXBvcnRFeGlzdHMoYXN0Tm9kZS5zcGVjaWZpZXJzKSkge1xuICAgICAgICAgICAgbmV3TmFtZXNwYWNlSW1wb3J0cy5hZGQocmVzb2x2ZWRQYXRoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAobmV3RGVmYXVsdEltcG9ydEV4aXN0cyhhc3ROb2RlLnNwZWNpZmllcnMpKSB7XG4gICAgICAgICAgICBuZXdEZWZhdWx0SW1wb3J0cy5hZGQocmVzb2x2ZWRQYXRoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBhc3ROb2RlLnNwZWNpZmllcnNcbiAgICAgICAgICAgIC5maWx0ZXIoKHNwZWNpZmllcikgPT4gc3BlY2lmaWVyLnR5cGUgIT09IElNUE9SVF9ERUZBVUxUX1NQRUNJRklFUiAmJiBzcGVjaWZpZXIudHlwZSAhPT0gSU1QT1JUX05BTUVTUEFDRV9TUEVDSUZJRVIpXG4gICAgICAgICAgICAuZm9yRWFjaCgoc3BlY2lmaWVyKSA9PiB7XG4gICAgICAgICAgICAgIG5ld0ltcG9ydHMuc2V0KHNwZWNpZmllci5pbXBvcnRlZC5uYW1lIHx8IHNwZWNpZmllci5pbXBvcnRlZC52YWx1ZSwgcmVzb2x2ZWRQYXRoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgbmV3RXhwb3J0QWxsLmZvckVhY2goKHZhbHVlKSA9PiB7XG4gICAgICAgIGlmICghb2xkRXhwb3J0QWxsLmhhcyh2YWx1ZSkpIHtcbiAgICAgICAgICBsZXQgaW1wb3J0cyA9IG9sZEltcG9ydFBhdGhzLmdldCh2YWx1ZSk7XG4gICAgICAgICAgaWYgKHR5cGVvZiBpbXBvcnRzID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgaW1wb3J0cyA9IG5ldyBTZXQoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaW1wb3J0cy5hZGQoRVhQT1JUX0FMTF9ERUNMQVJBVElPTik7XG4gICAgICAgICAgb2xkSW1wb3J0UGF0aHMuc2V0KHZhbHVlLCBpbXBvcnRzKTtcblxuICAgICAgICAgIGxldCBleHBvcnRzID0gZXhwb3J0TGlzdC5nZXQodmFsdWUpO1xuICAgICAgICAgIGxldCBjdXJyZW50RXhwb3J0O1xuICAgICAgICAgIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGN1cnJlbnRFeHBvcnQgPSBleHBvcnRzLmdldChFWFBPUlRfQUxMX0RFQ0xBUkFUSU9OKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXhwb3J0cyA9IG5ldyBNYXAoKTtcbiAgICAgICAgICAgIGV4cG9ydExpc3Quc2V0KHZhbHVlLCBleHBvcnRzKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodHlwZW9mIGN1cnJlbnRFeHBvcnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBjdXJyZW50RXhwb3J0LndoZXJlVXNlZC5hZGQoZmlsZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHdoZXJlVXNlZCA9IG5ldyBTZXQoKTtcbiAgICAgICAgICAgIHdoZXJlVXNlZC5hZGQoZmlsZSk7XG4gICAgICAgICAgICBleHBvcnRzLnNldChFWFBPUlRfQUxMX0RFQ0xBUkFUSU9OLCB7IHdoZXJlVXNlZCB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBvbGRFeHBvcnRBbGwuZm9yRWFjaCgodmFsdWUpID0+IHtcbiAgICAgICAgaWYgKCFuZXdFeHBvcnRBbGwuaGFzKHZhbHVlKSkge1xuICAgICAgICAgIGNvbnN0IGltcG9ydHMgPSBvbGRJbXBvcnRQYXRocy5nZXQodmFsdWUpO1xuICAgICAgICAgIGltcG9ydHMuZGVsZXRlKEVYUE9SVF9BTExfREVDTEFSQVRJT04pO1xuXG4gICAgICAgICAgY29uc3QgZXhwb3J0cyA9IGV4cG9ydExpc3QuZ2V0KHZhbHVlKTtcbiAgICAgICAgICBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50RXhwb3J0ID0gZXhwb3J0cy5nZXQoRVhQT1JUX0FMTF9ERUNMQVJBVElPTik7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGN1cnJlbnRFeHBvcnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgIGN1cnJlbnRFeHBvcnQud2hlcmVVc2VkLmRlbGV0ZShmaWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBuZXdEZWZhdWx0SW1wb3J0cy5mb3JFYWNoKCh2YWx1ZSkgPT4ge1xuICAgICAgICBpZiAoIW9sZERlZmF1bHRJbXBvcnRzLmhhcyh2YWx1ZSkpIHtcbiAgICAgICAgICBsZXQgaW1wb3J0cyA9IG9sZEltcG9ydFBhdGhzLmdldCh2YWx1ZSk7XG4gICAgICAgICAgaWYgKHR5cGVvZiBpbXBvcnRzID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgaW1wb3J0cyA9IG5ldyBTZXQoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaW1wb3J0cy5hZGQoSU1QT1JUX0RFRkFVTFRfU1BFQ0lGSUVSKTtcbiAgICAgICAgICBvbGRJbXBvcnRQYXRocy5zZXQodmFsdWUsIGltcG9ydHMpO1xuXG4gICAgICAgICAgbGV0IGV4cG9ydHMgPSBleHBvcnRMaXN0LmdldCh2YWx1ZSk7XG4gICAgICAgICAgbGV0IGN1cnJlbnRFeHBvcnQ7XG4gICAgICAgICAgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgY3VycmVudEV4cG9ydCA9IGV4cG9ydHMuZ2V0KElNUE9SVF9ERUZBVUxUX1NQRUNJRklFUik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGV4cG9ydHMgPSBuZXcgTWFwKCk7XG4gICAgICAgICAgICBleHBvcnRMaXN0LnNldCh2YWx1ZSwgZXhwb3J0cyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHR5cGVvZiBjdXJyZW50RXhwb3J0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgY3VycmVudEV4cG9ydC53aGVyZVVzZWQuYWRkKGZpbGUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB3aGVyZVVzZWQgPSBuZXcgU2V0KCk7XG4gICAgICAgICAgICB3aGVyZVVzZWQuYWRkKGZpbGUpO1xuICAgICAgICAgICAgZXhwb3J0cy5zZXQoSU1QT1JUX0RFRkFVTFRfU1BFQ0lGSUVSLCB7IHdoZXJlVXNlZCB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBvbGREZWZhdWx0SW1wb3J0cy5mb3JFYWNoKCh2YWx1ZSkgPT4ge1xuICAgICAgICBpZiAoIW5ld0RlZmF1bHRJbXBvcnRzLmhhcyh2YWx1ZSkpIHtcbiAgICAgICAgICBjb25zdCBpbXBvcnRzID0gb2xkSW1wb3J0UGF0aHMuZ2V0KHZhbHVlKTtcbiAgICAgICAgICBpbXBvcnRzLmRlbGV0ZShJTVBPUlRfREVGQVVMVF9TUEVDSUZJRVIpO1xuXG4gICAgICAgICAgY29uc3QgZXhwb3J0cyA9IGV4cG9ydExpc3QuZ2V0KHZhbHVlKTtcbiAgICAgICAgICBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50RXhwb3J0ID0gZXhwb3J0cy5nZXQoSU1QT1JUX0RFRkFVTFRfU1BFQ0lGSUVSKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY3VycmVudEV4cG9ydCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgY3VycmVudEV4cG9ydC53aGVyZVVzZWQuZGVsZXRlKGZpbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIG5ld05hbWVzcGFjZUltcG9ydHMuZm9yRWFjaCgodmFsdWUpID0+IHtcbiAgICAgICAgaWYgKCFvbGROYW1lc3BhY2VJbXBvcnRzLmhhcyh2YWx1ZSkpIHtcbiAgICAgICAgICBsZXQgaW1wb3J0cyA9IG9sZEltcG9ydFBhdGhzLmdldCh2YWx1ZSk7XG4gICAgICAgICAgaWYgKHR5cGVvZiBpbXBvcnRzID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgaW1wb3J0cyA9IG5ldyBTZXQoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaW1wb3J0cy5hZGQoSU1QT1JUX05BTUVTUEFDRV9TUEVDSUZJRVIpO1xuICAgICAgICAgIG9sZEltcG9ydFBhdGhzLnNldCh2YWx1ZSwgaW1wb3J0cyk7XG5cbiAgICAgICAgICBsZXQgZXhwb3J0cyA9IGV4cG9ydExpc3QuZ2V0KHZhbHVlKTtcbiAgICAgICAgICBsZXQgY3VycmVudEV4cG9ydDtcbiAgICAgICAgICBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBjdXJyZW50RXhwb3J0ID0gZXhwb3J0cy5nZXQoSU1QT1JUX05BTUVTUEFDRV9TUEVDSUZJRVIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBleHBvcnRzID0gbmV3IE1hcCgpO1xuICAgICAgICAgICAgZXhwb3J0TGlzdC5zZXQodmFsdWUsIGV4cG9ydHMpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0eXBlb2YgY3VycmVudEV4cG9ydCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGN1cnJlbnRFeHBvcnQud2hlcmVVc2VkLmFkZChmaWxlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3Qgd2hlcmVVc2VkID0gbmV3IFNldCgpO1xuICAgICAgICAgICAgd2hlcmVVc2VkLmFkZChmaWxlKTtcbiAgICAgICAgICAgIGV4cG9ydHMuc2V0KElNUE9SVF9OQU1FU1BBQ0VfU1BFQ0lGSUVSLCB7IHdoZXJlVXNlZCB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBvbGROYW1lc3BhY2VJbXBvcnRzLmZvckVhY2goKHZhbHVlKSA9PiB7XG4gICAgICAgIGlmICghbmV3TmFtZXNwYWNlSW1wb3J0cy5oYXModmFsdWUpKSB7XG4gICAgICAgICAgY29uc3QgaW1wb3J0cyA9IG9sZEltcG9ydFBhdGhzLmdldCh2YWx1ZSk7XG4gICAgICAgICAgaW1wb3J0cy5kZWxldGUoSU1QT1JUX05BTUVTUEFDRV9TUEVDSUZJRVIpO1xuXG4gICAgICAgICAgY29uc3QgZXhwb3J0cyA9IGV4cG9ydExpc3QuZ2V0KHZhbHVlKTtcbiAgICAgICAgICBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50RXhwb3J0ID0gZXhwb3J0cy5nZXQoSU1QT1JUX05BTUVTUEFDRV9TUEVDSUZJRVIpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjdXJyZW50RXhwb3J0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICBjdXJyZW50RXhwb3J0LndoZXJlVXNlZC5kZWxldGUoZmlsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgbmV3SW1wb3J0cy5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgIGlmICghb2xkSW1wb3J0cy5oYXMoa2V5KSkge1xuICAgICAgICAgIGxldCBpbXBvcnRzID0gb2xkSW1wb3J0UGF0aHMuZ2V0KHZhbHVlKTtcbiAgICAgICAgICBpZiAodHlwZW9mIGltcG9ydHMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBpbXBvcnRzID0gbmV3IFNldCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpbXBvcnRzLmFkZChrZXkpO1xuICAgICAgICAgIG9sZEltcG9ydFBhdGhzLnNldCh2YWx1ZSwgaW1wb3J0cyk7XG5cbiAgICAgICAgICBsZXQgZXhwb3J0cyA9IGV4cG9ydExpc3QuZ2V0KHZhbHVlKTtcbiAgICAgICAgICBsZXQgY3VycmVudEV4cG9ydDtcbiAgICAgICAgICBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBjdXJyZW50RXhwb3J0ID0gZXhwb3J0cy5nZXQoa2V5KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXhwb3J0cyA9IG5ldyBNYXAoKTtcbiAgICAgICAgICAgIGV4cG9ydExpc3Quc2V0KHZhbHVlLCBleHBvcnRzKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodHlwZW9mIGN1cnJlbnRFeHBvcnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBjdXJyZW50RXhwb3J0LndoZXJlVXNlZC5hZGQoZmlsZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHdoZXJlVXNlZCA9IG5ldyBTZXQoKTtcbiAgICAgICAgICAgIHdoZXJlVXNlZC5hZGQoZmlsZSk7XG4gICAgICAgICAgICBleHBvcnRzLnNldChrZXksIHsgd2hlcmVVc2VkIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIG9sZEltcG9ydHMuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICBpZiAoIW5ld0ltcG9ydHMuaGFzKGtleSkpIHtcbiAgICAgICAgICBjb25zdCBpbXBvcnRzID0gb2xkSW1wb3J0UGF0aHMuZ2V0KHZhbHVlKTtcbiAgICAgICAgICBpbXBvcnRzLmRlbGV0ZShrZXkpO1xuXG4gICAgICAgICAgY29uc3QgZXhwb3J0cyA9IGV4cG9ydExpc3QuZ2V0KHZhbHVlKTtcbiAgICAgICAgICBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50RXhwb3J0ID0gZXhwb3J0cy5nZXQoa2V5KTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY3VycmVudEV4cG9ydCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgY3VycmVudEV4cG9ydC53aGVyZVVzZWQuZGVsZXRlKGZpbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAnUHJvZ3JhbTpleGl0Jyhub2RlKSB7XG4gICAgICAgIHVwZGF0ZUV4cG9ydFVzYWdlKG5vZGUpO1xuICAgICAgICB1cGRhdGVJbXBvcnRVc2FnZShub2RlKTtcbiAgICAgICAgY2hlY2tFeHBvcnRQcmVzZW5jZShub2RlKTtcbiAgICAgIH0sXG4gICAgICBFeHBvcnREZWZhdWx0RGVjbGFyYXRpb24obm9kZSkge1xuICAgICAgICBjaGVja1VzYWdlKG5vZGUsIElNUE9SVF9ERUZBVUxUX1NQRUNJRklFUik7XG4gICAgICB9LFxuICAgICAgRXhwb3J0TmFtZWREZWNsYXJhdGlvbihub2RlKSB7XG4gICAgICAgIG5vZGUuc3BlY2lmaWVycy5mb3JFYWNoKChzcGVjaWZpZXIpID0+IHtcbiAgICAgICAgICBjaGVja1VzYWdlKHNwZWNpZmllciwgc3BlY2lmaWVyLmV4cG9ydGVkLm5hbWUgfHwgc3BlY2lmaWVyLmV4cG9ydGVkLnZhbHVlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGZvckVhY2hEZWNsYXJhdGlvbklkZW50aWZpZXIobm9kZS5kZWNsYXJhdGlvbiwgKG5hbWUpID0+IHtcbiAgICAgICAgICBjaGVja1VzYWdlKG5vZGUsIG5hbWUpO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfTtcbiAgfSxcbn07XG4iXX0=