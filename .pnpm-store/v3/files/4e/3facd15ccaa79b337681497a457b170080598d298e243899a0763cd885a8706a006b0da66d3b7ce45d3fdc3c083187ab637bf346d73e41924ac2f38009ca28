import getPrototypeOf from 'object.getprototypeof';
import * as Module from 'object.getprototypeof';
import test from 'tape';
import runTests from './tests.js';

test('as a function', (t) => {
	runTests(getPrototypeOf, t);

	t.end();
});

test('named exports', async (t) => {
	t.deepEqual(
		Object.keys(Module).sort(),
		['default', 'shim', 'getPolyfill', 'implementation'].sort(),
		'has expected named exports',
	);

	const { shim, getPolyfill, implementation } = Module;
	t.equal((await import('object.getprototypeof/shim')).default, shim, 'shim named export matches deep export');
	t.equal((await import('object.getprototypeof/implementation')).default, implementation, 'implementation named export matches deep export');
	t.equal((await import('object.getprototypeof/polyfill')).default, getPolyfill, 'getPolyfill named export matches deep export');

	t.end();
});
