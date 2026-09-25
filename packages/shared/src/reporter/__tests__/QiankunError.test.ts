import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { QiankunError, qiankunErrorCodes } from '../QiankunError';

const docsRoot = resolve(__dirname, '../../../../../docs');
const errorDocs = [
  { dir: join(docsRoot, 'zh-CN/errors'), linkPrefix: '/zh-CN/errors/' },
  { dir: join(docsRoot, 'errors'), linkPrefix: '/errors/' },
];

describe('QiankunError', () => {
  it('keeps the original diagnostic context and appends a stable solution URL', () => {
    const error = new QiankunError('Entry https://app.example/ failed\nOriginal detail', 'entry-script-failed');

    expect(error).toBeInstanceOf(Error);
    expect(error.code).toBe('entry-script-failed');
    expect(error.message).toBe(
      '[qiankun]: Entry https://app.example/ failed\nOriginal detail\nSee https://www.qiankunjs.com/zh-CN/errors/entry-script-failed',
    );
    expect(error.stack).toContain(error.message);
  });

  it.each(errorDocs)('documents every error code under $linkPrefix', ({ dir, linkPrefix }) => {
    const codes = [...qiankunErrorCodes].sort();
    const pages = readdirSync(dir)
      .filter((file) => file !== 'index.md')
      .map((file) => file.replace(/\.md$/, ''))
      .sort();
    const indexedCodes = [...readFileSync(join(dir, 'index.md'), 'utf8').matchAll(/^- \[.+\]\((.+)\)$/gm)]
      .map(([, link]) => link)
      .filter((link) => link.startsWith(linkPrefix))
      .map((link) => link.slice(linkPrefix.length))
      .sort();

    expect(pages).toEqual(codes);
    expect(indexedCodes).toEqual(codes);
  });
});
