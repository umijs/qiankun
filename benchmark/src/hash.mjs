import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';

async function listFiles(directory) {
  const files = [];
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(path)));
    } else if (entry.isFile()) {
      files.push(path);
    }
  }
  return files;
}

async function hashRelativeFiles(directory, relativeFiles) {
  const hash = createHash('sha256');
  for (const file of [...new Set(relativeFiles)].sort()) {
    hash.update(file);
    hash.update('\0');
    hash.update(await readFile(join(directory, file)));
    hash.update('\0');
  }
  return hash.digest('hex');
}

export async function hashDirectory(directory) {
  const files = await listFiles(directory);
  return hashRelativeFiles(
    directory,
    files.map((file) => relative(directory, file)),
  );
}

export async function hashFiles(directory, files) {
  return hashRelativeFiles(directory, files);
}

export async function hashViteEntries(directory, entryHtmlFiles) {
  const manifest = JSON.parse(await readFile(join(directory, '.vite/manifest.json'), 'utf8'));
  const files = new Set(entryHtmlFiles);
  const visited = new Set();

  function visit(key) {
    if (visited.has(key)) return;
    visited.add(key);
    const record = manifest[key];
    if (!record) throw new Error(`Vite manifest entry is missing: ${key}`);
    files.add(record.file);
    record.css?.forEach((file) => files.add(file));
    record.assets?.forEach((file) => files.add(file));
    record.imports?.forEach(visit);
    record.dynamicImports?.forEach(visit);
  }

  entryHtmlFiles.forEach(visit);
  return hashRelativeFiles(directory, [...files]);
}
