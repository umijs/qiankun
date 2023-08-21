'use strict';

var ns = require('web-namespaces');
var h = require('hastscript/html');
var s = require('hastscript/svg');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var ns__default = /*#__PURE__*/_interopDefaultLegacy(ns);
var h__default = /*#__PURE__*/_interopDefaultLegacy(h);
var s__default = /*#__PURE__*/_interopDefaultLegacy(s);

var ELEMENT_NODE = 1;
var TEXT_NODE = 3;
var COMMENT_NODE = 8;
var DOCUMENT_NODE = 9;
var DOCUMENT_TYPE_NODE = 10;
var DOCUMENT_FRAGMENT_NODE = 11;

function transform(value) {
  var node = value || {};

  switch (node.nodeType) {
    case ELEMENT_NODE:
      return element(node);

    case DOCUMENT_NODE:
    case DOCUMENT_FRAGMENT_NODE:
      return root(node);

    case TEXT_NODE:
      return text(node);

    case COMMENT_NODE:
      return comment(node);

    case DOCUMENT_TYPE_NODE:
      return doctype(node);

    default:
      return null;
  }
} // Transform a document.


function root(node) {
  return {
    type: 'root',
    children: all(node)
  };
} // Transform a doctype.


function doctype(node) {
  return {
    type: 'doctype',
    name: node.name || '',
    "public": node.publicId || null,
    system: node.systemId || null
  };
} // Transform text.


function text(node) {
  return {
    type: 'text',
    value: node.nodeValue
  };
} // Transform a comment.


function comment(node) {
  return {
    type: 'comment',
    value: node.nodeValue
  };
} // Transform an element.


function element(node) {
  var space = node.namespaceURI;
  var fn = space === ns__default['default'].svg ? s__default['default'] : h__default['default'];
  var tagName = space === ns__default['default'].html ? node.tagName.toLowerCase() : node.tagName;
  var content = space === ns__default['default'].html && tagName === 'template' ? node.content : node;
  var attributes = node.getAttributeNames();
  var length = attributes.length;
  var props = {};
  var index = 0;

  while (index < length) {
    var key = attributes[index];
    props[key] = node.getAttribute(key);
    index += 1;
  }

  return fn(tagName, props, all(content));
}

function all(node) {
  var nodes = node.childNodes;
  var length = nodes.length;
  var children = [];
  var index = 0;

  while (index < length) {
    var child = transform(nodes[index]);

    if (child !== null) {
      children.push(child);
    }

    index += 1;
  }

  return children;
}

function fromDOM(node) {
  return transform(node) || {
    type: 'root',
    children: []
  };
}

module.exports = fromDOM;
