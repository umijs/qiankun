import { expect, it } from 'vitest';
import { getValueType } from '../src/utils';

it('should return value type', () => {
  expect(getValueType(1)).toBe('Number');
  expect(getValueType('1')).toBe('String');
  expect(getValueType(true)).toBe('Boolean');
  expect(getValueType(null)).toBe('Null');
  expect(getValueType(undefined)).toBe('Undefined');
  expect(getValueType({})).toBe('Object');
  expect(getValueType([])).toBe('Array');
  expect(getValueType(function () {})).toBe('Function');
  expect(getValueType(Symbol())).toBe('Symbol');
  expect(getValueType(new Date())).toBe('Date');
  expect(getValueType(new RegExp(''))).toBe('RegExp');
  expect(getValueType(new Error())).toBe('Error');
  expect(getValueType(new Map())).toBe('Map');
  expect(getValueType(new Set())).toBe('Set');
  expect(getValueType(new WeakMap())).toBe('WeakMap');
  expect(getValueType(new WeakSet())).toBe('WeakSet');
});
