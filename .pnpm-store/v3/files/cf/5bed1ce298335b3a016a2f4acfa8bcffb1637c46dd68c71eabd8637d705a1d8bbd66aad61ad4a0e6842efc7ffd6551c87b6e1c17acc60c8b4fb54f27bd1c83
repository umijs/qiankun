var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/config/detectCssModulesInDependence.ts
var detectCssModulesInDependence_exports = {};
__export(detectCssModulesInDependence_exports, {
  addDependenceCssModulesDetector: () => addDependenceCssModulesDetector
});
module.exports = __toCommonJS(detectCssModulesInDependence_exports);
var import_utils = require("@umijs/utils");
var import_path = require("path");
async function addDependenceCssModulesDetector(opts) {
  const { config, cwd, userConfig } = opts;
  if (!userConfig.checkDepCssModules)
    return;
  const matchers = opts.extraBabelIncludes.map(function(p) {
    if (import_utils.lodash.isRegExp(p)) {
      return p;
    }
    let absPath;
    if ((0, import_path.isAbsolute)(p)) {
      absPath = p;
    }
    try {
      if (p.startsWith("./")) {
        absPath = require.resolve(p, { paths: [cwd] });
      }
      absPath = (0, import_path.dirname)(
        import_utils.resolve.sync(`${p}/package.json`, {
          basedir: cwd,
          // same behavior as webpack, to ensure `include` paths matched
          // ref: https://webpack.js.org/configuration/resolve/#resolvesymlinks
          preserveSymlinks: false
        })
      );
      return toRegExp(absPath);
    } catch (e) {
      if (e.code === "MODULE_NOT_FOUND") {
        throw new Error("Cannot resolve extraBabelIncludes: " + p, {
          cause: e
        });
      }
      throw e;
    }
  });
  config.plugin("dep-css-modules-detector").use(DetectCSsModulePlugin, [matchers]);
}
var _DetectCSsModulePlugin = class {
  constructor(skipMatcher = []) {
    this.skipMatcher = skipMatcher;
  }
  isCallRequireStyle(statement) {
    if (
      // var x= require(...) ?
      statement.type === "CallExpression" && statement.callee.type === "Identifier" && statement.callee.name === "require" && // var x = require('xxxxx')
      statement.arguments.length === 1 && statement.arguments[0].type === "Literal"
    ) {
      const requireArg = statement.arguments[0].value;
      if (requireArg.endsWith(".less") || requireArg.endsWith(".css")) {
        return true;
      }
    }
    return false;
  }
  apply(compiler) {
    compiler.hooks.normalModuleFactory.tap(
      _DetectCSsModulePlugin.PLUGIN_NAME,
      (factory) => {
        factory.hooks.parser.for("javascript/auto").tap("lessDetector", (parser) => {
          parser.hooks.import.tap(
            "lessDetector",
            (statement, source) => {
              var _a, _b;
              const specifiers = statement.specifiers.length;
              if (specifiers > 0 && (source.endsWith(".less") || source.endsWith(".css")) && this.isJSModule(parser)) {
                this.throwError((_b = (_a = parser.state) == null ? void 0 : _a.module) == null ? void 0 : _b.resource, compiler);
              }
            }
          );
          parser.hooks.program.tap(
            _DetectCSsModulePlugin.PLUGIN_NAME,
            (program) => {
              var _a, _b, _c, _d;
              if (this.isJSModule(parser)) {
                for (const statement of program.body) {
                  if (statement.type === "AssignmentExpression" && // x= require("x.less") or var x = require(".css") ?
                  this.isCallRequireStyle(statement.right)) {
                    this.throwError((_b = (_a = parser.state) == null ? void 0 : _a.module) == null ? void 0 : _b.resource, compiler);
                  }
                  if (statement.type === "VariableDeclarator" && // var x= require("x.less") or var x = require(".css") ?
                  this.isCallRequireStyle(statement.init)) {
                    this.throwError((_d = (_c = parser.state) == null ? void 0 : _c.module) == null ? void 0 : _d.resource, compiler);
                  }
                }
              }
            }
          );
        });
      }
    );
  }
  isJSModule(parser) {
    var _a, _b;
    let res = (_b = (_a = parser.state) == null ? void 0 : _a.module) == null ? void 0 : _b.resource;
    if (res) {
      if (this.skipMatcher.some((r) => r.test(res))) {
        return false;
      }
      return res.indexOf("node_modules") >= 0 && (res.endsWith(".js") || res.endsWith(".jsx"));
    }
    return false;
  }
  throwError(file, c) {
    const logger = c.getInfrastructureLogger(_DetectCSsModulePlugin.PLUGIN_NAME) || console;
    logger.error(import_utils.chalk.red(`Dependence file ${file} contains css module`));
    logger.error(
      import_utils.chalk.red(
        `Please add the package's name in 'babelExtraIncludes' or use non-css module in dependence`
      )
    );
    throw Error(_DetectCSsModulePlugin.ERROR_NAME);
  }
};
var DetectCSsModulePlugin = _DetectCSsModulePlugin;
DetectCSsModulePlugin.PLUGIN_NAME = "depCssModulesDetector";
DetectCSsModulePlugin.ERROR_NAME = "USE CSS-MODULES IN NODE_MODULES";
var toRegExp = (test) => {
  if (typeof test === "string") {
    return new RegExp("^" + test.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"));
  }
  return test;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addDependenceCssModulesDetector
});
