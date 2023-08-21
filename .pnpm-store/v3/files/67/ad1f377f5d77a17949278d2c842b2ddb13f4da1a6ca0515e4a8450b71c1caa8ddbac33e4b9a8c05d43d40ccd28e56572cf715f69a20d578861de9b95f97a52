'use strict';

const u = require('unist-builder');
const toJsx = require('..');

test('should encode `raw`s', () => {
  const actual = toJsx(u('raw', '<script>alert("XSS!")</script>'));
  expect(actual).toBe('&lt;script>alert("XSS!")&lt;/script>');
});
