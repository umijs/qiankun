import * as fs from 'fs';
import * as path from 'path';
import { describe, expect, it } from 'vitest';
import { load as cheerioLoad } from 'cheerio';

function normalizeHtml(html: string): string {
  const $ = cheerioLoad(html);
  $('body')
    .contents()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison -- cheerio's AnyNode has ElementType enum
    .filter((_, el) => el.type === 'text' && !(el as unknown as { data: string }).data.trim())
    .remove();
  return $.html();
}

function readFixture(name: string): string {
  return fs.readFileSync(path.join(__dirname, 'fixtures', `${name}.html`), 'utf-8');
}

describe('QiankunWebpackPlugin', () => {
  describe('integration tests', () => {
    it('should generate expected HTML for webpack 4', () => {
      const actual = normalizeHtml(fs.readFileSync(path.join(__dirname, 'webpack4/dist/index.html'), 'utf-8'));
      const expected = normalizeHtml(readFixture('webpack4'));
      expect(actual).toBe(expected);
    });

    it('should generate expected HTML for webpack 5', () => {
      const actual = normalizeHtml(fs.readFileSync(path.join(__dirname, 'webpack5/dist/index.html'), 'utf-8'));
      const expected = normalizeHtml(readFixture('webpack5'));
      expect(actual).toBe(expected);
    });
  });
});
