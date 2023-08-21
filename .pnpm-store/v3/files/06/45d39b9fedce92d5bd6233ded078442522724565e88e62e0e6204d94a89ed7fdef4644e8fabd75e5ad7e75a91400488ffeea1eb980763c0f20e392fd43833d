'use strict';

const u = require('unist-builder');
const toJsx = require('..');

test('should throw on non-nodes', () => {
  expect(() => {
    toJsx(true);
  }).toThrow(/Expected node with a type property/);
});

test('should throw on unknown nodes', () => {
  expect(() => {
    toJsx(u('foo', []));
  }).toThrow(/Cannot compile node of unknown type "foo"/);
});
