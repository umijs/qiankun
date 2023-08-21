"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _utils() {
  const data = require("@umijs/utils");

  _utils = function _utils() {
    return data;
  };

  return data;
}

function _path() {
  const data = require("path");

  _path = function _path() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function toObject(obj) {
  return typeof obj === 'object' ? obj : {};
}

var _default = (context, opts = {}) => {
  const defaultEnvConfig = {
    exclude: ['transform-typeof-symbol', 'transform-sticky-regex', 'transform-new-target', 'transform-modules-umd', 'transform-modules-systemjs', 'transform-modules-amd', 'transform-literals']
  };
  const preset = {
    presets: [opts.env && [require('@umijs/deps/compiled/babel/preset-env').default, _objectSpread(_objectSpread({}, (0, _utils().mergeConfig)(defaultEnvConfig, toObject(opts.env))), {}, {
      debug: opts.debug
    })], opts.react && [require('@umijs/deps/compiled/babel/preset-react').default, toObject(opts.react)], opts.typescript && [require('@umijs/deps/compiled/babel/preset-typescript').default, {
      // https://babeljs.io/docs/en/babel-plugin-transform-typescript#impartial-namespace-support
      allowNamespaces: true
    }]].filter(Boolean),
    plugins: [// https://github.com/webpack/webpack/issues/10227
    [require('@umijs/deps/compiled/babel/plugin-proposal-optional-chaining').default, {
      loose: false
    }], // https://github.com/webpack/webpack/issues/10227
    [require('@umijs/deps/compiled/babel/plugin-proposal-nullish-coalescing-operator').default, {
      loose: false
    }], require('@umijs/deps/compiled/babel/plugin-syntax-top-level-await').default, // Necessary to include regardless of the environment because
    // in practice some other transforms (such as object-rest-spread)
    // don't work without it: https://github.com/babel/babel/issues/7215
    [require('@umijs/deps/compiled/babel/plugin-transform-destructuring').default, {
      loose: false
    }], // https://www.npmjs.com/package/babel-plugin-transform-typescript-metadata#usage
    // should be placed before @babel/plugin-proposal-decorators.
    opts.typescript && [require.resolve('@umijs/deps/compiled/babel/babel-plugin-transform-typescript-metadata')], [require('@umijs/deps/compiled/babel/plugin-proposal-decorators').default, {
      legacy: true
    }], [require('@umijs/deps/compiled/babel/plugin-proposal-class-properties').default, {
      loose: true
    }], require('@umijs/deps/compiled/babel/plugin-proposal-export-default-from').default, [require('@umijs/deps/compiled/babel/plugin-proposal-pipeline-operator').default, {
      proposal: 'minimal'
    }], require('@umijs/deps/compiled/babel/plugin-proposal-do-expressions').default, require('@umijs/deps/compiled/babel/plugin-proposal-function-bind').default, require('@umijs/deps/compiled/babel/plugin-proposal-logical-assignment-operators').default, opts.transformRuntime && [require('@umijs/deps/compiled/babel/plugin-transform-runtime').default, _objectSpread({
      version: require('@babel/runtime/package.json').version,
      // https://babeljs.io/docs/en/babel-plugin-transform-runtime#absoluteruntime
      // lock the version of @babel/runtime
      // make sure we are using the correct version
      // this path will be used by babel like `require.resolve(path, { paths: [absoluteRuntime] })`
      // so we need to place the absolute path of this package
      // refer: https://github.com/babel/babel/blob/v7.16.12/packages/babel-plugin-transform-runtime/src/get-runtime-path/index.ts#L19
      absoluteRuntime: (0, _path().dirname)(require.resolve('../package.json')),
      // https://babeljs.io/docs/en/babel-plugin-transform-runtime#useesmodules
      useESModules: true
    }, toObject(opts.transformRuntime))], opts.reactRemovePropTypes && [require.resolve('@umijs/deps/compiled/babel/babel-plugin-transform-react-remove-prop-types'), {
      removeImport: true
    }], opts.reactRequire && [require.resolve('@umijs/deps/compiled/babel/babel-plugin-react-require')], opts.dynamicImportNode && [require.resolve('@umijs/deps/compiled/babel/babel-plugin-dynamic-import-node')], opts.svgr && [require.resolve('@umijs/deps/compiled/babel/babel-plugin-named-asset-import'), {
      loaderMap: {
        svg: {
          ReactComponent: `${require.resolve('@umijs/deps/compiled/babel/svgr-webpack')}?-svgo,+titleProp,+ref![path]`
        }
      }
    }], ...(opts.import ? opts.import.map(importOpts => {
      return [require.resolve('@umijs/deps/compiled/babel/babel-plugin-import'), importOpts, importOpts.libraryName];
    }) : []), opts.autoCSSModules && [require.resolve('@umijs/babel-plugin-auto-css-modules')], opts.importToAwaitRequire && [require.resolve('@umijs/babel-plugin-import-to-await-require'), opts.importToAwaitRequire], opts.lockCoreJS3 && [require.resolve('@umijs/babel-plugin-lock-core-js-3'), opts.lockCoreJS3], opts.noAnonymousDefaultExport && [require.resolve('@umijs/babel-plugin-no-anonymous-default-export')], [require('@umijs/deps/compiled/babel/plugin-proposal-record-and-tuple').default, {
      syntaxType: 'hash',
      polyfillModuleName: '@umijs/deps/reexported/record-tuple-polyfill',
      importPolyfill: true
    }]].filter(Boolean)
  };
  return opts.modify ? opts.modify(preset) : preset;
};

exports.default = _default;