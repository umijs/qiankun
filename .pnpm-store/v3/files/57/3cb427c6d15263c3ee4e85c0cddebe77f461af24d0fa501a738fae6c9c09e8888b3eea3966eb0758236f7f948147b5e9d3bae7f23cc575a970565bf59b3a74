'use strict';

const h = require('hastscript');
const u = require('unist-builder');
const toJsx = require('..');

test('should wrap `root` with multiple children in <div>', () => {
  const actual = toJsx(
    u('root', [u('text', 'alpha '), h('i', 'bravo'), u('text', ' charlie')])
  );
  expect(actual).toBe('<div>alpha <i>bravo</i> charlie</div>');
});

test('should not wrap `root` with one child in <div>', () => {
  const actual = toJsx(u('root', [h('i', 'bravo')]));
  expect(actual).toBe('<i>bravo</i>');
});

test('with wrapper: "fragment", should wrap `root` with multiple children in <React.Fragment>', () => {
  const actual = toJsx(
    u('root', [u('text', 'alpha '), h('i', 'bravo'), u('text', ' charlie')]),
    { wrapper: 'fragment' }
  );
  expect(actual).toBe(
    '<React.Fragment>alpha <i>bravo</i> charlie</React.Fragment>'
  );
});

test('with wrapper: "fragment", should not wrap `root` with one child in <React.Fragment>', () => {
  const actual = toJsx(u('root', [h('i', 'bravo')]), { wrapper: 'fragment' });
  expect(actual).toBe('<i>bravo</i>');
});
