"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _helperModuleImports = require("@babel/helper-module-imports");

var _detectors = require("../utils/detectors");

var _options = require("../utils/options");

// Most of this code was taken from @satya164's babel-plugin-css-prop
// @see https://github.com/satya164/babel-plugin-css-prop
const TAG_NAME_REGEXP = /^[a-z][a-z\d]*(\-[a-z][a-z\d]*)?$/;

const getName = (node, t) => {
  if (typeof node.name === 'string') return node.name;

  if (t.isJSXMemberExpression(node)) {
    return `${getName(node.object, t)}.${node.property.name}`;
  }

  throw path.buildCodeFrameError(`Cannot infer name from node with type "${node.type}". Please submit an issue at github.com/styled-components/babel-plugin-styled-components with your code so we can take a look at your use case!`);
};

const getNameExpression = (node, t) => {
  if (typeof node.name === 'string') return t.identifier(node.name);

  if (t.isJSXMemberExpression(node)) {
    return t.memberExpression(getNameExpression(node.object, t), t.identifier(node.property.name));
  }

  throw path.buildCodeFrameError(`Cannot infer name expression from node with type "${node.type}". Please submit an issue at github.com/styled-components/babel-plugin-styled-components with your code so we can take a look at your use case!`);
};

const getLocalIdentifier = path => {
  const identifier = path.scope.generateUidIdentifier('css'); // make it transient

  identifier.name = identifier.name.replace('_', '$_');
  return identifier;
};

var _default = t => (path, state) => {
  if (!(0, _options.useCssProp)(state)) return;
  if (path.node.name.name !== 'css') return;
  const program = state.file.path; // state.customImportName is passed through from styled-components/macro if it's used
  // since the macro also inserts the import

  let importName = state.customImportName || (0, _detectors.importLocalName)('default', state);
  const {
    bindings
  } = program.scope; // Insert import if it doesn't exist yet

  if (!importName || !bindings[importName.name] || !bindings[importName]) {
    (0, _helperModuleImports.addDefault)(path, 'styled-components', {
      nameHint: 'styled'
    });
    importName = t.identifier((0, _detectors.importLocalName)('default', state, {
      bypassCache: true
    }));
  }

  if (!t.isIdentifier(importName)) importName = t.identifier(importName);
  const elem = path.parentPath;
  const name = getName(elem.node.name, t);
  const nameExpression = getNameExpression(elem.node.name, t);
  const id = path.scope.generateUidIdentifier('Styled' + name.replace(/^([a-z])/, (match, p1) => p1.toUpperCase()));
  let styled;
  let injector;

  if (TAG_NAME_REGEXP.test(name)) {
    styled = t.callExpression(importName, [t.stringLiteral(name)]);
  } else {
    styled = t.callExpression(importName, [nameExpression]);

    if (bindings[name] && !t.isImportDeclaration(bindings[name].path.parent)) {
      injector = nodeToInsert => (t.isVariableDeclaration(bindings[name].path.parent) ? bindings[name].path.parentPath : bindings[name].path).insertAfter(nodeToInsert);
    }
  }

  let css;

  if (t.isStringLiteral(path.node.value)) {
    css = t.templateLiteral([t.templateElement({
      raw: path.node.value.value,
      cooked: path.node.value.value
    }, true)], []);
  } else if (t.isJSXExpressionContainer(path.node.value)) {
    if (t.isTemplateLiteral(path.node.value.expression)) {
      css = path.node.value.expression;
    } else if (t.isTaggedTemplateExpression(path.node.value.expression) && path.node.value.expression.tag.name === 'css') {
      css = path.node.value.expression.quasi;
    } else if (t.isObjectExpression(path.node.value.expression)) {
      css = path.node.value.expression;
    } else {
      css = t.templateLiteral([t.templateElement({
        raw: '',
        cooked: ''
      }, false), t.templateElement({
        raw: '',
        cooked: ''
      }, true)], [path.node.value.expression]);
    }
  }

  if (!css) return; // strip off css prop from final output

  elem.node.attributes = elem.node.attributes.filter(x => t.isJSXSpreadAttribute(x) || (t.isJSXAttribute(x) ? x.name.name !== 'css' : false));
  elem.node.name = t.jSXIdentifier(id.name);

  if (elem.parentPath.node.closingElement) {
    elem.parentPath.node.closingElement.name = t.jSXIdentifier(id.name);
  } // object syntax


  if (t.isObjectExpression(css)) {
    /**
     * for objects as CSS props, we have to recurse through the object and replace any
     * object key/value scope references with generated props similar to how the template
     * literal transform above creates dynamic interpolations
     */
    const p = t.identifier('p');
    let replaceObjectWithPropFunction = false;
    css.properties = css.properties.reduce(function propertiesReducer(acc, property) {
      /**
       * handle potential object key interpolations
       */
      if (t.isMemberExpression(property.key) || t.isCallExpression(property.key) || // checking for css={{[something]: something}}
      t.isIdentifier(property.key) && path.scope.hasBinding(property.key.name) && ( // but not a object reference shorthand like css={{ color }}
      t.isIdentifier(property.value) ? property.key.name !== property.value.name : true) && // and not a tricky expression
      !t.isMemberExpression(property.value) && !t.isLogicalExpression(property.value) && !t.isConditionalExpression(property.value)) {
        replaceObjectWithPropFunction = true;
        const identifier = getLocalIdentifier(path);
        elem.node.attributes.push(t.jSXAttribute(t.jSXIdentifier(identifier.name), t.jSXExpressionContainer(property.key)));
        property.key = t.memberExpression(p, identifier);
      }

      if (t.isObjectExpression(property.value)) {
        // recurse for objects within objects (e.g. {'::before': { content: x }})
        property.value.properties = property.value.properties.reduce(propertiesReducer, []);
        acc.push(property);
      } else if (t.isSpreadElement(property)) {
        // handle spread variables and such
        if (t.isObjectExpression(property.argument)) {
          property.argument.properties = property.argument.properties.reduce(propertiesReducer, []);
        } else {
          replaceObjectWithPropFunction = true;
          const identifier = getLocalIdentifier(path);
          elem.node.attributes.push(t.jSXAttribute(t.jSXIdentifier(identifier.name), t.jSXExpressionContainer(property.argument)));
          property.argument = t.memberExpression(p, identifier);
        }

        acc.push(property);
      } else if ( // if a non-primitive value we have to interpolate it
      [t.isBigIntLiteral, t.isBooleanLiteral, t.isNullLiteral, t.isNumericLiteral, t.isStringLiteral].filter(Boolean) // older versions of babel might not have bigint support baked in
      .every(x => !x(property.value))) {
        replaceObjectWithPropFunction = true;
        const identifier = getLocalIdentifier(path);
        elem.node.attributes.push(t.jSXAttribute(t.jSXIdentifier(identifier.name), t.jSXExpressionContainer(property.value)));
        acc.push(t.objectProperty(property.key, t.memberExpression(p, identifier)));
      } else {
        // some sort of primitive which is safe to pass through as-is
        acc.push(property);
      }

      return acc;
    }, []);

    if (replaceObjectWithPropFunction) {
      css = t.arrowFunctionExpression([p], css);
    }
  } else {
    // tagged template literal
    css.expressions = css.expressions.reduce((acc, ex) => {
      if (Object.keys(bindings).some(key => bindings[key].referencePaths.find(p => p.node === ex)) || t.isFunctionExpression(ex) || t.isArrowFunctionExpression(ex)) {
        acc.push(ex);
      } else {
        const identifier = getLocalIdentifier(path);
        const p = t.identifier('p');
        elem.node.attributes.push(t.jSXAttribute(t.jSXIdentifier(identifier.name), t.jSXExpressionContainer(ex)));
        acc.push(t.arrowFunctionExpression([p], t.memberExpression(p, identifier)));
      }

      return acc;
    }, []);
  }

  if (!injector) {
    let parent = elem;

    while (!t.isProgram(parent)) {
      parent = parent.parentPath;
    }

    injector = nodeToInsert => parent.pushContainer('body', nodeToInsert);
  }

  injector(t.variableDeclaration('var', [t.variableDeclarator(id, t.isObjectExpression(css) || t.isArrowFunctionExpression(css) ? t.callExpression(styled, [css]) : t.taggedTemplateExpression(styled, css))]));
};

exports.default = _default;