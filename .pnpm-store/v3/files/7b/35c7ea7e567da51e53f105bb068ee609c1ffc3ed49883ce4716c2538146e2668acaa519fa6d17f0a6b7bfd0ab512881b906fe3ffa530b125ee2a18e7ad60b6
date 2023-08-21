'use strict'

var extend = require('extend')
var visit = require('unist-util-visit')
var has = require('hast-util-has-property')
var is = require('hast-util-is-element')

module.exports = autolink

var splice = [].splice

var headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']

var contentDefaults = {
  type: 'element',
  tagName: 'span',
  properties: {className: ['icon', 'icon-link']},
  children: []
}

function autolink(options) {
  var settings = options || {}
  var props = settings.properties
  var behavior = settings.behaviour || settings.behavior || 'prepend'
  var content = settings.content || contentDefaults
  var group = settings.group
  var method

  if (behavior === 'wrap') {
    method = wrap
  } else if (behavior === 'before' || behavior === 'after') {
    method = around
  } else {
    method = inject

    if (!props) {
      props = {ariaHidden: 'true', tabIndex: -1}
    }
  }

  return transformer

  function transformer(tree) {
    visit(tree, 'element', visitor)
  }

  function visitor(node, index, parent) {
    if (is(node, headings) && has(node, 'id')) {
      return method(node, index, parent)
    }
  }

  function inject(node) {
    var name = behavior === 'prepend' ? 'unshift' : 'push'

    node.children[name](create(node, toProps(props), toChildren(content, node)))

    return [visit.SKIP]
  }

  function around(node, index, parent) {
    var link = create(node, toProps(props), toChildren(content, node))
    var grouping = group ? toNode(group, node) : undefined
    var nodes = behavior === 'before' ? [link, node] : [node, link]

    if (grouping) {
      grouping.children = nodes
      nodes = grouping
    }

    splice.apply(parent.children, [index, 1].concat(nodes))

    return [visit.SKIP, index + nodes.length]
  }

  function wrap(node) {
    node.children = [create(node, toProps(props), node.children)]

    return [visit.SKIP]
  }

  function toProps(value) {
    return deepAssign({}, value)
  }

  function toChildren(value, node) {
    var result = toNode(value, node)
    return Array.isArray(result) ? result : [result]
  }

  function toNode(value, node) {
    if (typeof value === 'function') return value(node)
    return deepAssign(Array.isArray(value) ? [] : {}, value)
  }

  function create(node, props, children) {
    return {
      type: 'element',
      tagName: 'a',
      properties: Object.assign({}, props, {href: '#' + node.properties.id}),
      children: children
    }
  }

  function deepAssign(base, value) {
    return extend(true, base, value)
  }
}
