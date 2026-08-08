// The Vite library build emits dist/esm and dist/cjs without module-type markers; Node (which loads
// the Vite plugin from vite.config) would otherwise sniff-reparse every ESM file with a warning.
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = join(dirname(fileURLToPath(import.meta.url)), '../dist');
writeFileSync(join(dist, 'esm/package.json'), JSON.stringify({ type: 'module' }, null, 2) + '\n');
writeFileSync(join(dist, 'cjs/package.json'), JSON.stringify({ type: 'commonjs' }, null, 2) + '\n');

// tsc emits declarations with extensionless relative specifiers, which node16/nodenext resolution
// rejects inside the {"type":"module"} scope of dist/esm.
const esmDir = join(dist, 'esm');
const declarationFiles = readdirSync(esmDir, { recursive: true, withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith('.d.ts'))
  .map((entry) => join(entry.parentPath, entry.name));

for (const file of declarationFiles) {
  const source = readFileSync(file, 'utf8');
  const rewritten = source.replace(
    /(from\s+|import\s*\(\s*|import\s+)(['"])(\.\.?\/[^'"]+)\2/g,
    (match, prefix, quote, specifier) => {
      if (/\.[cm]?js$/.test(specifier)) return match;
      const base = resolve(dirname(file), specifier);
      if (existsSync(`${base}.d.ts`)) return `${prefix}${quote}${specifier}.js${quote}`;
      if (existsSync(join(base, 'index.d.ts'))) return `${prefix}${quote}${specifier}/index.js${quote}`;
      return match;
    },
  );
  if (rewritten !== source) writeFileSync(file, rewritten);
}
