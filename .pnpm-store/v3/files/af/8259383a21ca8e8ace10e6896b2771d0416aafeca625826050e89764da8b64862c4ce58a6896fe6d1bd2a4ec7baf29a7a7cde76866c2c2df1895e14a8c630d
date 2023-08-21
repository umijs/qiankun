'use strict';

const h = require('hastscript');
const u = require('unist-builder');
const unified = require('unified');
const rehypeParse = require('rehype-parse');
const toJsx = require('..');

function hastFromHtml(html) {
  return unified()
    .use(rehypeParse, { fragment: true })
    .parse(html);
}

test('should stringify `element`s', () => {
  const actual = toJsx(h('i', 'bravo'));
  expect(actual).toBe('<i>bravo</i>');
});

test('should stringify unknown `element`s', () => {
  const actual = toJsx(h('foo'));
  expect(actual).toBe('<foo />');
});

test('should stringify void `element`s', () => {
  const actual = toJsx(h('img'));
  expect(actual).toBe('<img />');
});

test('should support `<template>`s content', () => {
  const actual = toJsx({
    type: 'element',
    tagName: 'template',
    properties: {},
    children: [],
    content: {
      type: 'root',
      children: [h('p', [h('b', 'Bold'), ' and ', h('i', 'italic'), '.'])]
    }
  });
  expect(actual).toBe(
    '<template><p><b>Bold</b> and <i>italic</i>.</p></template>'
  );
});

test('nested elements', () => {
  const actual = toJsx(
    h('div', { className: ['one', 'two'], ariaLabel: 'foo', id: 'bar' }, [
      h('h1', { className: 'txt-h1' }, u('text', 'heading')),
      h('p', u('text', 'something here'))
    ])
  );
  expect(actual).toBe(
    '<div className="one two" aria-label="foo" id="bar"><h1 className="txt-h1">heading</h1><p>something here</p></div>'
  );
});

test('textarea renders child text as defaultValue', () => {
  const actual = toJsx(hastFromHtml('<textarea id="foo">some text</textarea>'));
  expect(actual).toBe('<textarea id="foo" defaultValue="some text" />');
});

test('style renders child text as inner HTML', () => {
  const actual = toJsx(
    hastFromHtml('<style id="foo">:root { color: pink; }</style>')
  );
  expect(actual).toBe(
    '<style id="foo" dangerouslySetInnerHTML={{__html: ":root { color: pink; }" }} />'
  );
});

test('preserves whitespace inside <pre>', () => {
  const html = `<pre>
  one
    two
</pre>`;
  const actual = toJsx(hastFromHtml(html));
  expect(actual).toBe('<pre>{"  "}one{"\\n"}{"    "}two{"\\n"}</pre>');
});

test('escapes curly braces in text', () => {
  const actual = toJsx(hastFromHtml('<p>{{ here }} {there}</p>'));
  expect(actual).toBe('<p>{"{"}{"{"} here {"}"}{"}"} {"{"}there{"}"}</p>');
});

test('README example', () => {
  const actual = toJsx(
    h('div.one.two', { id: 'bar' }, [
      h('p.hidden', { ariaHidden: true }, ['hidden text']),
      h('p', { style: 'color: pink; font-size: 2em;' }, ['fancy text'])
    ])
  );
  expect(actual).toBe(
    '<div className="one two" id="bar"><p className="hidden" aria-hidden={true}>hidden text</p><p style={{color: "pink", fontSize: "2em"}}>fancy text</p></div>'
  );
});
