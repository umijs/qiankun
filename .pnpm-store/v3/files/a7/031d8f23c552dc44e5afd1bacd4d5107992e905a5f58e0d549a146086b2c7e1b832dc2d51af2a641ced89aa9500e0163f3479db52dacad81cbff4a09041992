"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isWithThemeHelper = exports.isValidTopLevelImport = exports.isUseTheme = exports.isStyled = exports.isPureHelper = exports.isKeyframesHelper = exports.isInjectGlobalHelper = exports.isHelper = exports.isCreateGlobalStyleHelper = exports.isCSSHelper = exports.importLocalName = void 0;

var _getSequenceExpressionValue = _interopRequireDefault(require("./getSequenceExpressionValue"));

var _options = require("./options");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const VALID_TOP_LEVEL_IMPORT_PATH_MATCHERS = ['styled-components', 'styled-components/no-tags', 'styled-components/native', 'styled-components/primitives'].map(literal => x => x === literal);

const isValidTopLevelImport = (x, state) => {
  return [...VALID_TOP_LEVEL_IMPORT_PATH_MATCHERS, ...(0, _options.useTopLevelImportPathMatchers)(state)].some(isMatch => isMatch(x));
};

exports.isValidTopLevelImport = isValidTopLevelImport;
const localNameCache = {};

const importLocalName = (name, state, options = {}) => {
  const {
    cacheIdentifier,
    bypassCache = false
  } = options;
  const cacheKeyAffix = cacheIdentifier ? `|${cacheIdentifier}` : '';
  const cacheKey = name + state.file.opts.filename + cacheKeyAffix;

  if (!bypassCache && cacheKey in localNameCache) {
    return localNameCache[cacheKey]; // state.customImportName is injected by the babel macro
  } else if (state.customImportName) {
    return state.customImportName.name;
  }

  let localName = state.styledRequired ? name === 'default' ? 'styled' : name : false;
  state.file.path.traverse({
    ImportDeclaration: {
      exit(path) {
        const {
          node
        } = path;

        if (isValidTopLevelImport(node.source.value, state)) {
          for (const specifier of path.get('specifiers')) {
            if (specifier.isImportSpecifier() && specifier.node.imported.name === 'styled') {
              localName = 'styled';
            }

            if (specifier.isImportDefaultSpecifier()) {
              localName = specifier.node.local.name;
            }

            if (specifier.isImportSpecifier() && specifier.node.imported.name === name) {
              localName = specifier.node.local.name;
            }

            if (specifier.isImportNamespaceSpecifier()) {
              localName = name === 'default' ? specifier.node.local.name : name;
            }
          }
        }
      }

    }
  });
  localNameCache[cacheKey] = localName;
  return localName;
};

exports.importLocalName = importLocalName;

const isStyled = t => (tag, state) => {
  if (t.isCallExpression(tag) && t.isMemberExpression(tag.callee) && tag.callee.property.name !== 'default'
  /** ignore default for #93 below */
  ) {
    // styled.something()
    return isStyled(t)(tag.callee.object, state);
  } else if (t.isCallExpression(tag) && t.isSequenceExpression(tag.callee) && t.isMemberExpression((0, _getSequenceExpressionValue.default)(tag.callee)) && (0, _getSequenceExpressionValue.default)(tag.callee).property.name !== 'default'
  /** ignore default for #93 below */
  ) {
    // (..., styled).something()
    return isStyled(t)((0, _getSequenceExpressionValue.default)(tag.callee), state);
  } else {
    return t.isMemberExpression(tag) && tag.object.name === importLocalName('default', state, {
      cacheIdentifier: tag.object.name
    }) && !isHelper(t)(tag.property, state) || t.isCallExpression(tag) && tag.callee.name === importLocalName('default', state, {
      cacheIdentifier: tag.callee.name
    }) || t.isCallExpression(tag) && t.isSequenceExpression(tag.callee) && (0, _getSequenceExpressionValue.default)(tag.callee).name === importLocalName('default', state, {
      cacheIdentifier: (0, _getSequenceExpressionValue.default)(tag.callee).name
    }) ||
    /**
     * #93 Support require()
     * styled-components might be imported using a require()
     * call and assigned to a variable of any name.
     * - styled.default.div``
     * - styled.default.something()
     */
    state.styledRequired && t.isMemberExpression(tag) && t.isMemberExpression(tag.object) && tag.object.property.name === 'default' && tag.object.object.name === state.styledRequired || state.styledRequired && t.isCallExpression(tag) && t.isMemberExpression(tag.callee) && tag.callee.property.name === 'default' && tag.callee.object.name === state.styledRequired || state.styledRequired && t.isCallExpression(tag) && t.isSequenceExpression(tag.callee) && t.isMemberExpression((0, _getSequenceExpressionValue.default)(tag.callee)) && (0, _getSequenceExpressionValue.default)(tag.callee).property.name === 'default' && (0, _getSequenceExpressionValue.default)(tag.callee).object.name === state.styledRequired || importLocalName('default', state) && t.isMemberExpression(tag) && t.isMemberExpression(tag.object) && tag.object.property.name === 'default' && tag.object.object.name === importLocalName('default', state) || importLocalName('default', state) && t.isCallExpression(tag) && t.isMemberExpression(tag.callee) && tag.object.property.name === 'default' && tag.object.object.name === importLocalName('default', state);
  }
};

exports.isStyled = isStyled;

const isCSSHelper = t => (tag, state) => t.isIdentifier(tag) && tag.name === importLocalName('css', state);

exports.isCSSHelper = isCSSHelper;

const isCreateGlobalStyleHelper = t => (tag, state) => t.isIdentifier(tag) && tag.name === importLocalName('createGlobalStyle', state);

exports.isCreateGlobalStyleHelper = isCreateGlobalStyleHelper;

const isInjectGlobalHelper = t => (tag, state) => t.isIdentifier(tag) && tag.name === importLocalName('injectGlobal', state);

exports.isInjectGlobalHelper = isInjectGlobalHelper;

const isKeyframesHelper = t => (tag, state) => t.isIdentifier(tag) && tag.name === importLocalName('keyframes', state);

exports.isKeyframesHelper = isKeyframesHelper;

const isWithThemeHelper = t => (tag, state) => t.isIdentifier(tag) && tag.name === importLocalName('withTheme', state);

exports.isWithThemeHelper = isWithThemeHelper;

const isUseTheme = t => (tag, state) => t.isIdentifier(tag) && tag.name === importLocalName('useTheme', state);

exports.isUseTheme = isUseTheme;

const isHelper = t => (tag, state) => isCreateGlobalStyleHelper(t)(tag, state) || isCSSHelper(t)(tag, state) || isInjectGlobalHelper(t)(tag, state) || isUseTheme(t)(tag, state) || isKeyframesHelper(t)(tag, state) || isWithThemeHelper(t)(tag, state);

exports.isHelper = isHelper;

const isPureHelper = t => (tag, state) => isCreateGlobalStyleHelper(t)(tag, state) || isCSSHelper(t)(tag, state) || isKeyframesHelper(t)(tag, state) || isUseTheme(t)(tag, state) || isWithThemeHelper(t)(tag, state);

exports.isPureHelper = isPureHelper;