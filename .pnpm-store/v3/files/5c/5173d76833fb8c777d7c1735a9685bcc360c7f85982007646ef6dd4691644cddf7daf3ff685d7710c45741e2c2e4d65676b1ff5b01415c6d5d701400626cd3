import { afterAll, afterEach, beforeAll, beforeEach, describe, it, onTestFailed, suite, test } from '@vitest/runner';
import { e as bench, c as createExpect, d as globalExpect, v as vi, f as vitest } from './vendor-vi.271667ef.js';
import { i as isFirstRun, r as runOnce } from './vendor-run-once.3e5ef7d7.js';
import * as chai from 'chai';
import { assert, should } from 'chai';

function getRunningMode() {
  return process.env.VITEST_MODE === "WATCH" ? "watch" : "run";
}
function isWatchMode() {
  return getRunningMode() === "watch";
}

var dist = {};

(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.expectTypeOf = void 0;
	const fn = () => true;
	/**
	 * Similar to Jest's `expect`, but with type-awareness.
	 * Gives you access to a number of type-matchers that let you make assertions about the
	 * form of a reference or generic type parameter.
	 *
	 * @example
	 * import {foo, bar} from '../foo'
	 * import {expectTypeOf} from 'expect-type'
	 *
	 * test('foo types', () => {
	 *   // make sure `foo` has type {a: number}
	 *   expectTypeOf(foo).toMatchTypeOf({a: 1})
	 *   expectTypeOf(foo).toHaveProperty('a').toBeNumber()
	 *
	 *   // make sure `bar` is a function taking a string:
	 *   expectTypeOf(bar).parameter(0).toBeString()
	 *   expectTypeOf(bar).returns.not.toBeAny()
	 * })
	 *
	 * @description
	 * See the [full docs](https://npmjs.com/package/expect-type#documentation) for lots more examples.
	 */
	const expectTypeOf = (_actual) => {
	    const nonFunctionProperties = [
	        'parameters',
	        'returns',
	        'resolves',
	        'not',
	        'items',
	        'constructorParameters',
	        'thisParameter',
	        'instance',
	        'guards',
	        'asserts',
	        'branded',
	    ];
	    const obj = {
	        /* eslint-disable mmkal/@typescript-eslint/no-unsafe-assignment */
	        toBeAny: fn,
	        toBeUnknown: fn,
	        toBeNever: fn,
	        toBeFunction: fn,
	        toBeObject: fn,
	        toBeArray: fn,
	        toBeString: fn,
	        toBeNumber: fn,
	        toBeBoolean: fn,
	        toBeVoid: fn,
	        toBeSymbol: fn,
	        toBeNull: fn,
	        toBeUndefined: fn,
	        toBeNullable: fn,
	        toMatchTypeOf: fn,
	        toEqualTypeOf: fn,
	        toBeCallableWith: fn,
	        toBeConstructibleWith: fn,
	        /* eslint-enable mmkal/@typescript-eslint/no-unsafe-assignment */
	        extract: exports.expectTypeOf,
	        exclude: exports.expectTypeOf,
	        toHaveProperty: exports.expectTypeOf,
	        parameter: exports.expectTypeOf,
	    };
	    const getterProperties = nonFunctionProperties;
	    getterProperties.forEach((prop) => Object.defineProperty(obj, prop, { get: () => (0, exports.expectTypeOf)({}) }));
	    return obj;
	};
	exports.expectTypeOf = expectTypeOf; 
} (dist));

function noop() {
}
const assertType = noop;

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  afterAll: afterAll,
  afterEach: afterEach,
  assert: assert,
  assertType: assertType,
  beforeAll: beforeAll,
  beforeEach: beforeEach,
  bench: bench,
  chai: chai,
  createExpect: createExpect,
  describe: describe,
  expect: globalExpect,
  expectTypeOf: dist.expectTypeOf,
  getRunningMode: getRunningMode,
  isFirstRun: isFirstRun,
  isWatchMode: isWatchMode,
  it: it,
  onTestFailed: onTestFailed,
  runOnce: runOnce,
  should: should,
  suite: suite,
  test: test,
  vi: vi,
  vitest: vitest
});

export { isWatchMode as a, assertType as b, dist as d, getRunningMode as g, index as i };
