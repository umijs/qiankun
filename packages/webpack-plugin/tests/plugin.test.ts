import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';
import webpack4PackageJson from './webpack4/package.json';
import webpack5PackageJson from './webpack5/package.json';
import cheerio from 'cheerio';
import { QiankunPlugin } from '../src/index';

function verifyLibraryOutput(jsContent: string, packageName: string): void {
  const regex = new RegExp(`window(\\.${packageName}|\\["${packageName}"\\])`);
  expect(jsContent).toMatch(regex);
}

function verifyEntryAttribute(htmlContent: string): void {
  const $ = cheerio.load(htmlContent);
  expect($('script[entry]').length).toBeGreaterThan(0);
}

describe('QiankunPlugin', () => {
  describe('integration tests', () => {
    it('should work with webpack 4 and entrySrcPattern', () => {
      const packageName = webpack4PackageJson.name;
      const htmlContent = fs.readFileSync(path.join(__dirname, 'webpack4/dist/index.html'), 'utf-8');
      const jsContent = fs.readFileSync(path.join(__dirname, 'webpack4/dist/bundle.js'), 'utf-8');

      verifyEntryAttribute(htmlContent);
      verifyLibraryOutput(jsContent, packageName);
    });

    it('should work with webpack 5 and preserve existing entry attribute', () => {
      const packageName = webpack5PackageJson.name;
      const htmlContent = fs.readFileSync(path.join(__dirname, 'webpack5/dist/index.html'), 'utf-8');
      const jsContent = fs.readFileSync(path.join(__dirname, 'webpack5/dist/bundle.js'), 'utf-8');

      verifyEntryAttribute(htmlContent);
      verifyLibraryOutput(jsContent, packageName);
    });
  });

  describe('addEntryAttributeToScripts', () => {
    it('should add entry to last script when no entrySrcPattern provided', () => {
      const plugin = new QiankunPlugin({ packageName: 'test-app' });
      const html = `
        <html>
          <body>
            <script src="vendor.js"></script>
            <script src="main.js"></script>
          </body>
        </html>
      `;

      const result = plugin.addEntryAttributeToScripts(html, 'index.html');

      expect(result.error).toBeUndefined();
      const $ = cheerio.load(result.html!);
      expect($('script[entry]').length).toBe(1);
      expect($('script[entry]').attr('src')).toBe('main.js');
    });

    it('should skip processing when entry attribute already exists', () => {
      const plugin = new QiankunPlugin({ packageName: 'test-app' });
      const html = `
        <html>
          <body>
            <script entry src="main.js"></script>
            <script src="other.js"></script>
          </body>
        </html>
      `;

      const result = plugin.addEntryAttributeToScripts(html, 'index.html');

      expect(result.error).toBeUndefined();
      const $ = cheerio.load(result.html!);
      expect($('script[entry]').length).toBe(1);
      expect($('script[entry]').attr('src')).toBe('main.js');
    });

    it('should match script by entrySrcPattern', () => {
      const plugin = new QiankunPlugin({
        packageName: 'test-app',
        entrySrcPattern: /main\.js$/,
      });
      const html = `
        <html>
          <body>
            <script src="vendor.js"></script>
            <script src="/assets/main.js"></script>
          </body>
        </html>
      `;

      const result = plugin.addEntryAttributeToScripts(html, 'index.html');

      expect(result.error).toBeUndefined();
      const $ = cheerio.load(result.html!);
      expect($('script[entry]').length).toBe(1);
      expect($('script[entry]').attr('src')).toBe('/assets/main.js');
    });

    it('should preserve regex flags (case insensitive)', () => {
      const plugin = new QiankunPlugin({
        packageName: 'test-app',
        entrySrcPattern: /MAIN\.JS$/i,
      });
      const html = `
        <html>
          <body>
            <script src="vendor.js"></script>
            <script src="main.js"></script>
          </body>
        </html>
      `;

      const result = plugin.addEntryAttributeToScripts(html, 'index.html');

      expect(result.error).toBeUndefined();
      const $ = cheerio.load(result.html!);
      expect($('script[entry]').attr('src')).toBe('main.js');
    });

    it('should return error when entrySrcPattern matches multiple scripts', () => {
      const plugin = new QiankunPlugin({
        packageName: 'test-app',
        entrySrcPattern: /\.js$/,
      });
      const html = `
        <html>
          <body>
            <script src="vendor.js"></script>
            <script src="main.js"></script>
          </body>
        </html>
      `;

      const result = plugin.addEntryAttributeToScripts(html, 'index.html');

      expect(result.error).toContain('matched multiple script tags');
      expect(result.html).toBeUndefined();
    });

    it('should return error when entrySrcPattern matches no scripts', () => {
      const plugin = new QiankunPlugin({
        packageName: 'test-app',
        entrySrcPattern: /nonexistent\.js$/,
      });
      const html = `
        <html>
          <body>
            <script src="main.js"></script>
          </body>
        </html>
      `;

      const result = plugin.addEntryAttributeToScripts(html, 'index.html');

      expect(result.error).toContain('did not match any scripts');
      expect(result.html).toBeUndefined();
    });
  });
});
