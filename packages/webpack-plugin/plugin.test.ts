import fs from 'fs';
import path from 'path';

describe('QiankunPlugin', () => {
  // webpack4
  it('should work with webpack 4', async () => {
    // 检查产物
    const htmlContent = fs.readFileSync(path.join(__dirname, 'tests/webpack4/dist/index.html'), 'utf-8');
    expect(htmlContent).toContain('<script entry'); // 检查是否正确标记了 entry js

    const jsChunkContent = fs.readFileSync(path.join(__dirname, 'tests/webpack4/dist/bundle.js'), 'utf-8');
    expect(jsChunkContent).toContain('window.'); // 检查是否包含了 webpackJSONP
  });

  // webpack5
  it('should work with webpack 5', async () => {
    // 检查产物
    const htmlContent = fs.readFileSync(path.join(__dirname, 'tests/webpack5/dist/index.html'), 'utf-8');
    expect(htmlContent).toContain('<script entry'); // 检查是否正确标记了 entry js

    const jsChunkContent = fs.readFileSync(path.join(__dirname, 'tests/webpack5/dist/bundle.js'), 'utf-8');
    expect(jsChunkContent).toContain('window.'); // 检查是否包含了 webpackJSONP
  });
});
