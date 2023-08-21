"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _options = require("../utils/options");

var _getName = _interopRequireDefault(require("../utils/getName"));

var _prefixDigit = _interopRequireDefault(require("../utils/prefixDigit"));

var _hash = _interopRequireDefault(require("../utils/hash"));

var _detectors = require("../utils/detectors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const addConfig = t => (path, displayName, componentId) => {
  if (!displayName && !componentId) {
    return;
  }

  const withConfigProps = [];

  if (displayName) {
    withConfigProps.push(t.objectProperty(t.identifier('displayName'), t.stringLiteral(displayName)));
  }

  if (componentId) {
    withConfigProps.push(t.objectProperty(t.identifier('componentId'), t.stringLiteral(componentId)));
  }

  const existingConfig = getExistingConfig(t)(path);

  if (existingConfig && existingConfig.arguments.length && Array.isArray(existingConfig.arguments[0].properties) && !existingConfig.arguments[0].properties.some(prop => ['displayName', 'componentId'].includes(prop.key.name))) {
    existingConfig.arguments[0].properties.push(...withConfigProps);
    return;
  }

  if (path.node.callee && t.isMemberExpression(path.node.callee.callee) && path.node.callee.callee.property && path.node.callee.callee.property.name && path.node.callee.callee.property.name == 'withConfig' && path.node.callee.arguments.length && Array.isArray(path.node.callee.arguments[0].properties) && !path.node.callee.arguments[0].properties.some(prop => ['displayName', 'componentId'].includes(prop.key.name))) {
    path.node.callee.arguments[0].properties.push(...withConfigProps);
    return;
  }

  if (path.node.tag) {
    // Replace x`...` with x.withConfig({ })`...`
    path.node.tag = t.callExpression(t.memberExpression(path.node.tag, t.identifier('withConfig')), [t.objectExpression(withConfigProps)]);
  } else {
    path.replaceWith(t.callExpression(t.callExpression(t.memberExpression(path.node.callee, t.identifier('withConfig')), [t.objectExpression(withConfigProps)]), path.node.arguments));
  }
};

const getExistingConfig = t => path => {
  if (path.node.callee && t.isMemberExpression(path.node.callee.callee) && path.node.callee.callee.property && path.node.callee.callee.property.name && path.node.callee.callee.property.name == 'withConfig') {
    return path.node.callee;
  }

  if (path.node.callee && t.isMemberExpression(path.node.callee.callee) && path.node.callee.callee.object && path.node.callee.callee.object.callee && path.node.callee.callee.object.callee.property && path.node.callee.callee.object.callee.property.name === 'withConfig') {
    return path.node.callee.callee.object;
  }
};

const getBlockName = (file, meaninglessFileNames) => {
  const name = _path.default.basename(file.opts.filename, _path.default.extname(file.opts.filename));

  return meaninglessFileNames.includes(name) ? _path.default.basename(_path.default.dirname(file.opts.filename)) : name;
};

const getDisplayName = t => (path, state) => {
  const {
    file
  } = state;
  const componentName = (0, _getName.default)(t)(path);

  if (file) {
    const blockName = getBlockName(file, (0, _options.useMeaninglessFileNames)(state));

    if (blockName === componentName) {
      return componentName;
    }

    return componentName ? `${(0, _prefixDigit.default)(blockName)}__${componentName}` : (0, _prefixDigit.default)(blockName);
  } else {
    return componentName;
  }
};

const findModuleRoot = filename => {
  if (!filename) {
    return null;
  }

  let dir = _path.default.dirname(filename);

  if (_fs.default.existsSync(_path.default.join(dir, 'package.json'))) {
    return dir;
  } else if (dir !== filename) {
    return findModuleRoot(dir);
  } else {
    return null;
  }
};

const FILE_HASH = 'styled-components-file-hash';
const COMPONENT_POSITION = 'styled-components-component-position';
const separatorRegExp = new RegExp(`\\${_path.default.sep}`, 'g');

const getFileHash = state => {
  const {
    file
  } = state; // hash calculation is costly due to fs operations, so we'll cache it per file.

  if (file.get(FILE_HASH)) {
    return file.get(FILE_HASH);
  }

  const filename = file.opts.filename; // find module root directory

  const moduleRoot = findModuleRoot(filename);

  const filePath = moduleRoot && _path.default.relative(moduleRoot, filename).replace(separatorRegExp, '/');

  const moduleName = moduleRoot && JSON.parse(_fs.default.readFileSync(_path.default.join(moduleRoot, 'package.json'))).name;
  const code = file.code;
  const stuffToHash = [moduleName];

  if (filePath) {
    stuffToHash.push(filePath);
  } else {
    stuffToHash.push(code);
  }

  const fileHash = (0, _hash.default)(stuffToHash.join(''));
  file.set(FILE_HASH, fileHash);
  return fileHash;
};

const getNextId = state => {
  const id = state.file.get(COMPONENT_POSITION) || 0;
  state.file.set(COMPONENT_POSITION, id + 1);
  return id;
};

const getComponentId = state => {
  // Prefix the identifier with a character because CSS classes cannot start with a number
  return `${(0, _options.useNamespace)(state)}sc-${getFileHash(state)}-${getNextId(state)}`;
};

var _default = t => (path, state) => {
  if (path.node.tag ? (0, _detectors.isStyled)(t)(path.node.tag, state) :
  /* styled()`` */
  (0, _detectors.isStyled)(t)(path.node.callee, state) && path.node.callee.property && path.node.callee.property.name !== 'withConfig' || // styled(x)({})
  (0, _detectors.isStyled)(t)(path.node.callee, state) && !t.isMemberExpression(path.node.callee.callee) || // styled(x).attrs()({})
  (0, _detectors.isStyled)(t)(path.node.callee, state) && t.isMemberExpression(path.node.callee.callee) && path.node.callee.callee.property && path.node.callee.callee.property.name && path.node.callee.callee.property.name !== 'withConfig' || // styled(x).withConfig({})
  (0, _detectors.isStyled)(t)(path.node.callee, state) && t.isMemberExpression(path.node.callee.callee) && path.node.callee.callee.property && path.node.callee.callee.property.name && path.node.callee.callee.property.name === 'withConfig' && path.node.callee.arguments.length && Array.isArray(path.node.callee.arguments[0].properties) && !path.node.callee.arguments[0].properties.some(prop => ['displayName', 'componentId'].includes(prop.key.name))) {
    const displayName = (0, _options.useDisplayName)(state) && getDisplayName(t)(path, (0, _options.useFileName)(state) && state);
    addConfig(t)(path, displayName && displayName.replace(/[^_a-zA-Z0-9-]/g, ''), (0, _options.useSSR)(state) && getComponentId(state));
  }
};

exports.default = _default;