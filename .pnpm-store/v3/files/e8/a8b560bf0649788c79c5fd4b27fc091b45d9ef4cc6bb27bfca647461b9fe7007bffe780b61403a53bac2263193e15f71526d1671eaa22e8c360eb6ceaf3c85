import callBind from 'call-bind';
import callBound from 'call-bind/callBound';
import RequireObjectCoercible from 'es-abstract/2022/RequireObjectCoercible.js';

import getPolyfill from 'array.prototype.findlastindex/polyfill';

const bound = callBind.apply(getPolyfill());
const $slice = callBound('Array.prototype.slice');

// eslint-disable-next-line no-unused-vars
export default function findLastIndex(array, predicate) {
	RequireObjectCoercible(array);
	return bound(array, $slice(arguments, 1));
}

export { default as getPolyfill } from 'array.prototype.findlastindex/polyfill';
export { default as implementation } from 'array.prototype.findlastindex/implementation';
export { default as shim } from 'array.prototype.findlastindex/shim';
