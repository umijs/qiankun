import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';
import webpack4PackageJson from './webpack4/package.json';
import webpack5PackageJson from './webpack5/package.json';
import cheerio from 'cheerio';

describe('QiankunPlugin', () => {
  // webpack4
  it('should work with webpack 4', async () => {
    // 获取包名
    const packageName4 = webpack4PackageJson.name;

    // 检查产物
    const htmlContent4 = fs.readFileSync(path.join(__dirname, 'webpack4/dist/index.html'), 'utf-8');
    const $4 = cheerio.load(htmlContent4);
    const hasEntryAttribute4 = $4('script[entry]').length > 0;
    expect(hasEntryAttribute4).toBe(true); // 检查是否正确标记了 entry js

    const jsChunkContent4 = fs.readFileSync(path.join(__dirname, 'webpack4/dist/bundle.js'), 'utf-8');
    const regex4 = new RegExp(`window(\\.\\${packageName4}|\\["${packageName4}"\\])`);
    expect(jsChunkContent4).toMatch(regex4); // 检查是否包含了 window.${packageName} 或 window["${packageName}"]
  });

  // webpack5
  it('should work with webpack 5', async () => {
    // 获取包名
    const packageName5 = webpack5PackageJson.name;

    // 检查产物
    const htmlContent5 = fs.readFileSync(path.join(__dirname, 'webpack5/dist/index.html'), 'utf-8');
    const $5 = cheerio.load(htmlContent5);
    const hasEntryAttribute5 = $5('script[entry]').length > 0;
    expect(hasEntryAttribute5).toBe(true); // 检查是否正确标记了 entry js

    const jsChunkContent5 = fs.readFileSync(path.join(__dirname, 'webpack5/dist/bundle.js'), 'utf-8');
    const regex5 = new RegExp(`window(\\.\\${packageName5}|\\["${packageName5}"\\])`);
    expect(jsChunkContent5).toMatch(regex5); // 检查是否包含了 window.${packageName} 或 window["${packageName}"]
  });
});
