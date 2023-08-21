'use strict';

const u = require('unist-builder');
const toJsx = require('..');

test('should stringify `comment`s', () => {
  const actual = toJsx(u('comment', 'alpha'));
  expect(actual).toBe('{/*alpha*/}');
});

test('should not encode `comment`s (#1)', () => {
  const actual = toJsx(u('comment', 'AT&T'));
  expect(actual).toBe('{/*AT&T*/}');
});
