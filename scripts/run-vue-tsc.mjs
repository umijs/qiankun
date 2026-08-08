import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

const projectRequire = createRequire(resolve(process.cwd(), 'package.json'));
const tscShimPath = projectRequire.resolve('typescript/lib/tsc');
const tscShim = readFileSync(tscShimPath, 'utf8');

// vue-tsc instruments the JavaScript compiler to add Vue SFC support. The
// TypeScript 6 compatibility package delegates to that compiler through a
// one-line shim, so pass vue-tsc the resolved implementation instead.
const shimSpecifier = /^\s*require\(['"]([^'"]+)['"]\);?\s*$/.exec(tscShim)?.[1];
const tscPath = shimSpecifier ? createRequire(tscShimPath).resolve(shimSpecifier) : tscShimPath;

const { run } = projectRequire('vue-tsc');
run(tscPath);
