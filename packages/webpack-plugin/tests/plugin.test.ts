import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';

describe('QiankunPlugin', () => {
  // webpack4
  it('should work with webpack 4', async () => {
    // 检查产物
    const htmlContent = fs.readFileSync(path.join(__dirname, 'tests/webpack4/dist/index.html'), 'utf-8');
    expect(htmlContent).toContain('<script entry'); // 检查是否正确标记了 entry js

    const jsChunkContent = fs.readFileSync(path.join(__dirname, 'tests/webpack4/dist/bundle.js'), 'utf-8');
    expect(jsChunkContent).toMatch(/window(\["[^"]+"\]|\.\w+)/); // 检查是否包含了 window. 或 window["..."] 关键字
  });

  // webpack5
  it('should work with webpack 5', async () => {
    // 检查产物
    const htmlContent = fs.readFileSync(path.join(__dirname, 'tests/webpack5/dist/index.html'), 'utf-8');
    expect(htmlContent).toContain('<script entry'); // 检查是否正确标记了 entry js

    const jsChunkContent = fs.readFileSync(path.join(__dirname, 'tests/webpack5/dist/bundle.js'), 'utf-8');
    expect(jsChunkContent).toMatch(/window(\["[^"]+"\]|\.\w+)/); // 检查是否包含了 window. 或 window["..."] 关键字
  });
});
