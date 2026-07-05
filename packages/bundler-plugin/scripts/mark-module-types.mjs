// father emits dist/esm and dist/cjs without module-type markers; node (which loads the
// vite plugin from vite.config) would otherwise sniff-reparse every esm file with a warning
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = join(dirname(fileURLToPath(import.meta.url)), '../dist');
writeFileSync(join(dist, 'esm/package.json'), JSON.stringify({ type: 'module' }, null, 2) + '\n');
writeFileSync(join(dist, 'cjs/package.json'), JSON.stringify({ type: 'commonjs' }, null, 2) + '\n');
