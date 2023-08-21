var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);
var import_utils = require("@umijs/utils");
var import_path = require("path");
var import_autoCSSModules = __toESM(require("./plugins/autoCSSModules"));
var import_dynamicImportNode = __toESM(require("./plugins/dynamicImportNode"));
var import_lockCoreJS = __toESM(require("./plugins/lockCoreJS"));
var import_stripExports = __toESM(require("./plugins/stripExports"));
var src_default = (_context, opts) => {
  return {
    presets: [
      [
        require.resolve("@umijs/bundler-utils/compiled/babel/preset-env"),
        {
          bugfixes: true,
          // 更兼容 spec，但会变慢，所以不开
          spec: false,
          // 推荐用 top level 的 assumptions 配置
          loose: false,
          // 保留 es modules 语法，交给 webpack 处理
          modules: false,
          debug: false,
          useBuiltIns: "entry",
          corejs: (0, import_utils.getCorejsVersion)((0, import_path.join)(__dirname, "../package.json")),
          // 没必要，遇到了应该改 targets 配置
          forceAllTransforms: false,
          ignoreBrowserslistConfig: true,
          ...opts.presetEnv
        }
      ],
      // 允许禁用 preset-react 用于支持 vue 等其他框架
      opts.presetReact !== false && [
        require.resolve("@umijs/bundler-utils/compiled/babel/preset-react"),
        {
          runtime: "automatic",
          development: process.env.NODE_ENV === "development",
          ...opts.presetReact
        }
      ],
      [
        require.resolve("@umijs/bundler-utils/compiled/babel/preset-typescript"),
        {
          allowNamespaces: true,
          allowDeclareFields: true,
          // Why false?
          // 如果为 true，babel 只删除 import type 语句，会保留其他通过 import 引入的 type
          // 这些 type 引用走到 webpack 之后，就会报错
          onlyRemoveTypeImports: false,
          optimizeConstEnums: true,
          ...opts.presetTypeScript
        }
      ]
    ].filter(Boolean),
    plugins: [
      opts.pluginStyledComponents && [
        require.resolve("babel-plugin-styled-components"),
        {
          ...opts.pluginStyledComponents
        }
      ],
      // TC39 Proposals
      // class-static-block
      // decorators
      opts.pluginDecorators !== false && [
        require.resolve("@umijs/bundler-utils/compiled/babel/plugin-proposal-decorators"),
        {
          legacy: true,
          ...opts.pluginDecorators
        }
      ],
      // Enable loose mode to use assignment instead of defineProperty
      // Note:
      // 'loose' mode configuration must be the same for
      // * @babel/plugin-proposal-class-properties
      // * @babel/plugin-proposal-private-methods
      // * @babel/plugin-proposal-private-property-in-object
      // (when they are enabled)
      // ref: https://github.com/facebook/create-react-app/issues/4263
      // ref: https://github.com/mobxjs/mobx/issues/1471
      // ref: https://github.com/umijs/umi/issues/9396
      // 不移动到 feature 里的原因是因为 decorators 有顺序要求
      opts.classPropertiesLoose && [
        require.resolve("@umijs/bundler-utils/compiled/babel/plugin-proposal-class-properties"),
        { loose: true }
      ],
      opts.classPropertiesLoose && [
        require.resolve("@umijs/bundler-utils/compiled/babel/plugin-proposal-private-methods"),
        {
          loose: true
        }
      ],
      opts.classPropertiesLoose && [
        require.resolve("@umijs/bundler-utils/compiled/babel/plugin-proposal-private-property-in-object"),
        {
          loose: true
        }
      ],
      // do-expressions
      [
        require.resolve("@umijs/bundler-utils/compiled/babel/plugin-proposal-do-expressions")
      ],
      // export-default-from
      [
        require.resolve("@umijs/bundler-utils/compiled/babel/plugin-proposal-export-default-from")
      ],
      // export-namespace-from
      [
        require.resolve("@umijs/bundler-utils/compiled/babel/plugin-proposal-export-namespace-from")
      ],
      // function-bind
      [
        require.resolve("@umijs/bundler-utils/compiled/babel/plugin-proposal-function-bind")
      ],
      // function-sent
      // partial-application
      [
        require.resolve("@umijs/bundler-utils/compiled/babel/plugin-proposal-partial-application")
      ],
      // pipeline-operator
      [
        require.resolve("@umijs/bundler-utils/compiled/babel/plugin-proposal-pipeline-operator"),
        { proposal: "minimal" }
      ],
      // throw-expressions
      // record-and-tuple
      [
        require.resolve("@umijs/bundler-utils/compiled/babel/plugin-proposal-record-and-tuple"),
        {
          syntaxType: "hash",
          importPolyfill: true,
          polyfillModuleName: (0, import_path.dirname)(
            require.resolve("@bloomberg/record-tuple-polyfill/package")
          )
        }
      ],
      opts.pluginTransformRuntime && [
        require.resolve("@umijs/bundler-utils/compiled/babel/plugin-transform-runtime"),
        {
          helpers: true,
          regenerator: true,
          // 7.13 之后根据 exports 自动选择 esm 和 cjs，无需此配置
          useESModules: false,
          // lock the version of @babel/runtime
          // make sure we are using the correct version
          // ref: https://github.com/babel/babel/blob/v7.16.12/packages/babel-plugin-transform-runtime/src/get-runtime-path/index.ts#L19
          // ref: https://github.com/umijs/umi/pull/7816
          absoluteRuntime: (0, import_path.dirname)(require.resolve("../package.json")),
          version: `^${require("@babel/runtime/package.json").version}`,
          ...opts.pluginTransformRuntime
        }
      ],
      // none official plugins
      opts.pluginLockCoreJS && [import_lockCoreJS.default],
      opts.pluginDynamicImportNode && [import_dynamicImportNode.default],
      opts.pluginAutoCSSModules && [import_autoCSSModules.default],
      opts.stripExports && [import_stripExports.default]
    ].filter(Boolean)
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
