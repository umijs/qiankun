'use strict';

const postcss = require('postcss');
const postcssJs = require('postcss-js');
const reactAttrConverter = require('react-attr-converter');
const propertyInformation = require('property-information');
const kebabCase = require('kebab-case');
const stringifyEntities = require('stringify-entities');
const stringifyObject = require('stringify-object');

// Render all of a node's children to a single string.
function renderChildren(ctx, parent) {
  if (!parent.children || parent.children.length === 0) {
    return null;
  }

  return parent.children
    .map((node, index) => {
      return renderNode(ctx, node, index, parent);
    })
    .join('');
}

function renderElement(ctx, node) {
  let elementName = node.tagName;

  let renderedChildren = renderChildren(
    ctx,
    elementName === 'template' ? node.content : node
  );

  let props = hastPropertiesToJsxProps(node.properties, elementName);
  if (ctx.transformElement) {
    const transformed = ctx.transformElement(elementName, props);
    if (transformed) {
      elementName = transformed.name || elementName;
      props = transformed.props || props;
    }
  }

  let renderedProps = renderProps(props);
  if (renderedProps) {
    renderedProps = ` ${renderedProps}`;
  }

  if (!renderedChildren) {
    return `<${elementName}${renderedProps} />`;
  }

  if (elementName === 'textarea') {
    const dangerousChild = JSON.stringify(renderedChildren);
    return `<textarea${renderedProps} defaultValue=${dangerousChild} />`;
  }
  if (elementName === 'style') {
    const dangerousChild = JSON.stringify(renderedChildren);
    return `<style${renderedProps} dangerouslySetInnerHTML={{__html: ${dangerousChild} }} />`;
  }

  if (elementName === 'pre') {
    renderedChildren = renderedChildren.replace(
      /( {2,}|\n|\t)/g,
      whitespace => {
        return `{${JSON.stringify(whitespace)}}`;
      }
    );
  }

  return `<${elementName}${renderedProps}>${renderedChildren}</${elementName}>`;
}

// Transform a HAST property name to its HTML equivalent.
function hastPropertyNameToHtmlName(hastName) {
  if (hastName === 'className') {
    return 'class';
  }
  if (hastName === 'htmlFor') {
    return 'for';
  }
  const kebabed = kebabCase(hastName);
  return kebabed.replace(/^(data|aria)([0-9])/, '$1-$2');
}

// Transform an object of HAST properties to a props object
// that is suitable for a React component.
function hastPropertiesToJsxProps(hastProperties, elementName) {
  return Object.keys(hastProperties).reduce((result, hastName) => {
    let value = hastProperties[hastName];

    if (value === undefined || (typeof value == 'number' && isNaN(value))) {
      return result;
    }

    const htmlName = hastPropertyNameToHtmlName(hastName);
    const info = propertyInformation.find(propertyInformation.html, htmlName);
    const propName = reactAttrConverter(htmlName);

    // Transform input values to defaultX props, to allow for changes.
    if (elementName === 'input' && propName === 'value') {
      result.defaultValue = value;
      return result;
    }
    if (elementName === 'input' && propName === 'checked') {
      result.defaultChecked = value;
      return result;
    }

    // Transform style string values to JSX-ready objects.
    if (propName === 'style') {
      result.style = cssToJs(value, {
        inlineCharacterLimit: Infinity,
        singleQuotes: false
      });
      return result;
    }

    // HAST stores list values as actual arrays, but JSX needs
    // them to be strings. The property-information module
    // provides the information we need to determine how to
    // stringify HAST's arrays.
    if (Array.isArray(value)) {
      const punc = info && info.commaSeparated ? ', ' : ' ';
      value = value.join(punc);
    }

    // If a property value is supposed to be numeric but is a string,
    // and we can safely coerce it to a number, do that.
    if (
      info &&
      info.numeric &&
      typeof value === 'string' &&
      isNumberyString(value)
    ) {
      result[propName] = Number(value);
    }

    result[propName] = value;
    return result;
  }, {});
}

function cssToJs(css) {
  return postcssJs.objectify(postcss.parse(css, { from: undefined }));
}

function isNumberyString(str) {
  return String(Number(str)) === str;
}

// Render a React-ready property to a JSX-ready string.
function renderJsxProp(name, value) {
  if (name === 'style') {
    value = stringifyObject(value, {
      singleQuotes: false,
      inlineCharacterLimit: Infinity
    });
    return `style={${value}}`;
  }

  if (typeof value === 'string') {
    const encodedValue = stringifyEntities(value, {
      subset: ['"'],
      attribute: true
    });
    return `${name}=${JSON.stringify(encodedValue)}`;
  }

  return `${name}={${value}}`;
}

function renderProps(props) {
  return Object.keys(props)
    .map(propName => {
      return renderJsxProp(propName, props[propName]);
    })
    .filter(x => !!x)
    .join(' ');
}

function renderComment(ctx, node) {
  return `{/*${node.value}*/}`;
}

// For text, escape < and > and wrap { and }
// in more curly braces, so JSX doesn't interpret
// these symbols as indicating elements or expressions.
function renderText(ctx, node, index, parent) {
  if (parent.tagName === 'style') {
    return node.value;
  }
  return stringifyEntities(node.value, {
    subset: ['<', '>'],
    useNamedReferences: true
  }).replace(/\{|\}/g, brace => {
    return `{${JSON.stringify(brace)}}`;
  });
}

function renderRaw(ctx, node) {
  return stringifyEntities(node.value, {
    subset: ['<', '&'],
    useNamedReferences: true
  });
}

function getHandler(nodeType) {
  switch (nodeType) {
    case 'root':
      return renderChildren;
    case 'text':
      return renderText;
    case 'raw':
      return renderRaw;
    case 'element':
      return renderElement;
    case 'comment':
      return renderComment;
    default:
      throw new Error(`Cannot compile node of unknown type "${nodeType}"`);
  }
}

function renderNode(ctx, node, index, parent) {
  const type = node && node.type;

  if (!type) {
    throw new Error('Expected node with a type property');
  }

  const handler = getHandler(type);
  const rendered = handler(ctx, node, index, parent);

  if (type === 'root' && node.children.length > 1) {
    const wrapperName = ctx.wrapper === 'fragment' ? 'React.Fragment' : 'div';
    return `<${wrapperName}>${rendered}</${wrapperName}>`;
  }

  return rendered;
}

function toJsx(node, options) {
  options = options || {};
  return renderNode(options, node);
}

module.exports = toJsx;
