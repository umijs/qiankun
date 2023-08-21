# Disallow empty titles

Having an empty string as your test title is pretty useless. This rule reports
an error if it finds an empty string as s test title.

This rule is not auto-fixable.

## Rule Details

The following patterns are considered warnings:

```js
describe('', () => {});
describe('foo', () => {
  it('', () => {});
});
it('', () => {});
test('', () => {});
xdescribe('', () => {});
xit('', () => {});
xtest('', () => {});
```

These patterns would not be considered warnings:

```js
describe('foo', () => {});
describe('foo', () => {
  it('bar', () => {});
});
test('foo', () => {});
it('foo', () => {});
xdescribe('foo', () => {});
xit('foo', () => {});
xtest('foo', () => {});
```
