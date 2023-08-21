import findLastIndex from 'array.prototype.findlastindex';
import * as Module from 'array.prototype.findlastindex';
import test from 'tape';
import runTests from './tests.js';

test('as a function', (t) => {
	t.test('bad array/this value', (st) => {
		st.throws(() => findLastIndex(undefined), TypeError, 'undefined is not an object');
		st.throws(() => findLastIndex(null), TypeError, 'null is not an object');
		st.end();
	});

	runTests(findLastIndex, t);

	t.end();
});

test('named exports', async (t) => {
	t.deepEqual(
		Object.keys(Module).sort(),
		['default', 'shim', 'getPolyfill', 'implementation'].sort(),
		'has expected named exports',
	);

	const { shim, getPolyfill, implementation } = Module;
	t.equal((await import('array.prototype.findlastindex/shim')).default, shim, 'shim named export matches deep export');
	t.equal((await import('array.prototype.findlastindex/implementation')).default, implementation, 'implementation named export matches deep export');
	t.equal((await import('array.prototype.findlastindex/polyfill')).default, getPolyfill, 'getPolyfill named export matches deep export');

	t.end();
});
