"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useTranspileTemplateLiterals = exports.useTopLevelImportPathMatchers = exports.useSSR = exports.usePureAnnotation = exports.useNamespace = exports.useMinify = exports.useMeaninglessFileNames = exports.useFileName = exports.useDisplayName = exports.useCssProp = void 0;

var _picomatch = _interopRequireDefault(require("picomatch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getOption({
  opts
}, name, defaultValue = true) {
  return opts[name] === undefined || opts[name] === null ? defaultValue : opts[name];
}

const useDisplayName = state => getOption(state, 'displayName');

exports.useDisplayName = useDisplayName;

const useTopLevelImportPathMatchers = state => getOption(state, 'topLevelImportPaths', []).map(pattern => (0, _picomatch.default)(pattern));

exports.useTopLevelImportPathMatchers = useTopLevelImportPathMatchers;

const useSSR = state => getOption(state, 'ssr', true);

exports.useSSR = useSSR;

const useFileName = state => getOption(state, 'fileName');

exports.useFileName = useFileName;

const useMeaninglessFileNames = state => getOption(state, 'meaninglessFileNames', ['index']);

exports.useMeaninglessFileNames = useMeaninglessFileNames;

const useMinify = state => getOption(state, 'minify');

exports.useMinify = useMinify;

const useTranspileTemplateLiterals = state => getOption(state, 'transpileTemplateLiterals');

exports.useTranspileTemplateLiterals = useTranspileTemplateLiterals;

const useNamespace = state => {
  const namespace = getOption(state, 'namespace', '');

  if (namespace) {
    return `${namespace}__`;
  }

  return '';
};

exports.useNamespace = useNamespace;

const usePureAnnotation = state => getOption(state, 'pure', false);

exports.usePureAnnotation = usePureAnnotation;

const useCssProp = state => getOption(state, 'cssProp', true);

exports.useCssProp = useCssProp;