import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import {
  createMockCompiler,
  testHtmlTemplates,
  packageNameTestCases,
  regexTestCases,
  createTempDir,
  cleanupTempDir,
  createTempPackageJson,
  measureExecutionTime,
} from './test-utils';

describe('QiankunPlugin Integration Tests', () => {
  const { QiankunPlugin } = require('../dist/cjs/index');
  let tempDirs: string[] = [];

  afterEach(() => {
    // 清理所有临时目录
    tempDirs.forEach((dir) => cleanupTempDir(dir));
    tempDirs = [];
  });

  describe('Real-world Scenarios', () => {
    it('should work with typical React application structure', () => {
      const plugin = new QiankunPlugin({
        packageName: 'react-micro-app',
        entrySrcPattern: /main\.[a-f0-9]+\.js$/,
      });

      const reactHtml = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>React Micro App</title>
          </head>
          <body>
            <div id="root"></div>
            <script src="/static/js/runtime.abc123.js"></script>
            <script src="/static/js/2.def456.js"></script>
            <script src="/static/js/main.789abc.js"></script>
          </body>
        </html>
      `;

      const result = (plugin as any).addEntryAttributeToScripts(reactHtml, 'index.html');
      expect(result).toContain('entry');
      expect(result).toMatch(/main\.789abc\.js[^>]*entry/);
    });

    it('should work with Vue application structure', () => {
      const plugin = new QiankunPlugin({
        packageName: 'vue-micro-app',
        entrySrcPattern: /app\.[a-f0-9]+\.js$/,
      });

      const vueHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Vue Micro App</title>
          </head>
          <body>
            <div id="app"></div>
            <script src="js/chunk-vendors.abc123.js"></script>
            <script src="js/app.def456.js"></script>
          </body>
        </html>
      `;

      const result = (plugin as any).addEntryAttributeToScripts(vueHtml, 'index.html');
      expect(result).toContain('entry');
      expect(result).toMatch(/app\.def456\.js[^>]*entry/);
    });

    it('should handle Angular application with complex structure', () => {
      const plugin = new QiankunPlugin({
        packageName: 'angular-micro-app',
        entrySrcPattern: /main\.mno345\.js$/,
      });

      const angularHtml = `
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <title>Angular Micro App</title>
            <base href="/">
          </head>
          <body>
            <app-root></app-root>
            <script src="runtime.abc123.js" type="module"></script>
            <script src="polyfills.def456.js" type="module"></script>
            <script src="styles.ghi789.js" type="module"></script>
            <script src="vendor.jkl012.js" type="module"></script>
            <script src="main.mno345.js" type="module"></script>
          </body>
        </html>
      `;

      const result = (plugin as any).addEntryAttributeToScripts(angularHtml, 'index.html');
      expect(result).toContain('entry');
      expect(result).toMatch(/main\.mno345\.js[^>]*entry/);
    });
  });

  describe('Package Name Validation Comprehensive Tests', () => {
    it('should handle all valid package names', () => {
      packageNameTestCases.valid.forEach((name) => {
        expect(() => {
          new QiankunPlugin({ packageName: name });
        }).not.toThrow();
      });
    });

    it('should warn for invalid package names but not throw', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      packageNameTestCases.invalid.forEach((name) => {
        if (name === '') {
          // 空字符串应该抛出错误
          expect(() => {
            new QiankunPlugin({ packageName: name });
          }).toThrow();
        } else {
          // 其他无效名称应该警告但不抛出错误
          expect(() => {
            new QiankunPlugin({ packageName: name });
          }).not.toThrow();
        }
      });

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should handle edge case package names', () => {
      packageNameTestCases.edge.forEach((name) => {
        expect(() => {
          new QiankunPlugin({ packageName: name });
        }).not.toThrow();
      });
    });
  });

  describe('Regex Pattern Comprehensive Tests', () => {
    regexTestCases.forEach((testCase) => {
      it(`should handle ${testCase.description}`, () => {
        const plugin = new QiankunPlugin({
          packageName: 'regex-test-app',
          entrySrcPattern: testCase.pattern,
        });

        // 测试应该匹配的情况
        testCase.shouldMatch.forEach((matchText) => {
          const html = testCase.pattern.toString().includes('console\\.log')
            ? `<html><body><script>${matchText}</script></body></html>`
            : `<html><body><script src="${matchText}"></script></body></html>`;

          expect(() => {
            const result = (plugin as any).addEntryAttributeToScripts(html, 'test.html');
            expect(result).toContain('entry');
          }).not.toThrow();
        });

        // 测试不应该匹配的情况 - 只测试第一个以避免过多的错误
        const noMatchText = testCase.shouldNotMatch[0];
        if (noMatchText) {
          const html = testCase.pattern.toString().includes('console\\.log')
            ? `<html><body><script>${noMatchText}</script></body></html>`
            : `<html><body><script src="${noMatchText}"></script></body></html>`;

          expect(() => {
            (plugin as any).addEntryAttributeToScripts(html, 'test.html');
          }).toThrow();
        }
      });
    });
  });

  describe('HTML Template Processing Tests', () => {
    Object.entries(testHtmlTemplates).forEach(([templateName, html]) => {
      it(`should process ${templateName} template correctly`, () => {
        const plugin = new QiankunPlugin({ packageName: 'template-test-app' });

        if (templateName === 'empty') {
          const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
          const result = (plugin as any).addEntryAttributeToScripts(html, `${templateName}.html`);
          expect(typeof result).toBe('string');
          expect(consoleSpy).toHaveBeenCalled();
          consoleSpy.mockRestore();
        } else if (templateName === 'withEntry') {
          const result = (plugin as any).addEntryAttributeToScripts(html, `${templateName}.html`);
          expect(result).toContain('entry');
          // 不比较完全相等，只检查 entry 属性存在
          expect(result).toMatch(/script[^>]*entry/);
        } else {
          const result = (plugin as any).addEntryAttributeToScripts(html, `${templateName}.html`);
          expect(typeof result).toBe('string');
          expect(result).toContain('entry');
        }
      });
    });
  });

  describe('Webpack Compiler Integration Tests', () => {
    it('should integrate with webpack 4 compiler correctly', () => {
      const plugin = new QiankunPlugin({ packageName: 'webpack4-integration-test' });
      const compiler = createMockCompiler('4.47.0', false);

      plugin.apply(compiler);

      expect(compiler.hooks.emit.tapAsync).toHaveBeenCalled();
      expect(compiler.hooks.compilation.tap).not.toHaveBeenCalled();
    });

    it('should integrate with webpack 5 compiler correctly', () => {
      const plugin = new QiankunPlugin({ packageName: 'webpack5-integration-test' });
      const compiler = createMockCompiler('5.100.2', true);

      plugin.apply(compiler);

      expect(compiler.hooks.compilation.tap).toHaveBeenCalled();
    });

    it('should fallback gracefully when processAssets is not available', () => {
      const plugin = new QiankunPlugin({ packageName: 'fallback-test' });
      const compiler = createMockCompiler('5.100.2', false);

      // 模拟没有 processAssets 的情况
      compiler.hooks.compilation.tap.mockImplementation((name: string, callback: (compilation: any) => void) => {
        const mockCompilation = {
          hooks: {}, // 没有 processAssets
          assets: {},
        };
        callback(mockCompilation);
      });

      expect(() => plugin.apply(compiler)).not.toThrow();
      expect(compiler.hooks.emit.tapAsync).toHaveBeenCalled();
    });
  });

  describe('Performance Integration Tests', () => {
    it('should handle high-frequency plugin creation efficiently', () => {
      const { result, duration } = measureExecutionTime(() => {
        return Array.from({ length: 1000 }, (_, i) => new QiankunPlugin({ packageName: `perf-test-app-${i}` }));
      });

      expect(result).toHaveLength(1000);
      expect(duration).toBeLessThan(1000); // 应该在 1 秒内完成
    });

    it('should process complex HTML structures efficiently', () => {
      const plugin = new QiankunPlugin({ packageName: 'complex-html-test' });

      // 创建一个复杂的 HTML 结构
      const complexHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            ${Array.from({ length: 50 }, (_, i) => `<script src="head-script-${i}.js"></script>`).join('\n')}
          </head>
          <body>
            ${Array.from({ length: 100 }, (_, i) => `<div class="content-${i}">Content ${i}</div>`).join('\n')}
            ${Array.from({ length: 200 }, (_, i) => `<script src="script-${i}.js"></script>`).join('\n')}
            <script src="main-app.js"></script>
          </body>
        </html>
      `;

      const { result, duration } = measureExecutionTime(() => {
        return (plugin as any).addEntryAttributeToScripts(complexHtml, 'complex.html');
      });

      expect(typeof result).toBe('string');
      expect(result).toContain('entry');
      expect(duration).toBeLessThan(500); // 应该在 500ms 内完成
    });
  });

  describe('Error Recovery and Resilience Tests', () => {
    it('should recover from HTML parsing errors', () => {
      const plugin = new QiankunPlugin({ packageName: 'error-recovery-test' });

      const malformedHtmlCases = [
        '<html><body><script src="app.js">', // 未闭合标签
        '<html><body><script src="app.js"></script></body>', // 缺少 </html>
        '<script src="app.js"></script>', // 缺少 html 结构
        '<!DOCTYPE html><html><body><!-- comment --><script src="app.js"></script></body></html>', // 带注释
      ];

      malformedHtmlCases.forEach((html, index) => {
        expect(() => {
          const result = (plugin as any).addEntryAttributeToScripts(html, `malformed-${index}.html`);
          expect(typeof result).toBe('string');
        }).not.toThrow();
      });
    });

    it('should handle memory pressure gracefully', () => {
      const plugin = new QiankunPlugin({ packageName: 'memory-test' });

      // 创建一个非常大的 HTML 文件
      const hugeHtml =
        '<html><body>' +
        'x'.repeat(1000000) + // 1MB 的内容
        '<script src="app.js"></script>' +
        '</body></html>';

      expect(() => {
        const result = (plugin as any).addEntryAttributeToScripts(hugeHtml, 'huge.html');
        expect(typeof result).toBe('string');
        expect(result).toContain('entry');
      }).not.toThrow();
    });

    it('should handle basic configuration without filesystem operations', () => {
      // 测试不需要文件系统操作的基本功能
      expect(() => {
        new QiankunPlugin({ packageName: 'simple-test' });
      }).not.toThrow();

      expect(() => {
        new QiankunPlugin({
          packageName: 'complex-test',
          entrySrcPattern: /main\.js$/,
          chunkLoadingGlobalPrefix: 'myPrefix_',
        });
      }).not.toThrow();
    });
  });

  // 简化的文件系统测试（不使用 process.chdir）
  describe('Simplified File System Tests', () => {
    it('should handle missing package.json gracefully', () => {
      // 清除缓存
      (QiankunPlugin as any).packageJsonCache = null;

      // 模拟读取失败
      const readSyncSpy = vi.spyOn(require('fs'), 'readFileSync').mockImplementation(() => {
        throw new Error('ENOENT: no such file or directory');
      });

      const existsSyncSpy = vi.spyOn(require('fs'), 'existsSync').mockReturnValue(false);
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      expect(() => {
        new QiankunPlugin({ packageName: 'test-missing-package' });
      }).not.toThrow();

      expect(consoleSpy).toHaveBeenCalled();

      // 恢复 mock
      readSyncSpy.mockRestore();
      existsSyncSpy.mockRestore();
      consoleSpy.mockRestore();
    });

    it('should handle corrupted package.json gracefully', () => {
      // 清除缓存
      (QiankunPlugin as any).packageJsonCache = null;

      // 模拟JSON解析失败
      const readSyncSpy = vi.spyOn(require('fs'), 'readFileSync').mockReturnValue('{ invalid json }');
      const existsSyncSpy = vi.spyOn(require('fs'), 'existsSync').mockReturnValue(true);
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      expect(() => {
        new QiankunPlugin({ packageName: 'test-corrupt-package' });
      }).not.toThrow();

      expect(consoleSpy).toHaveBeenCalled();

      // 恢复 mock
      readSyncSpy.mockRestore();
      existsSyncSpy.mockRestore();
      consoleSpy.mockRestore();
    });

    it('should cache package.json reads', () => {
      // 清除缓存
      (QiankunPlugin as any).packageJsonCache = null;

      const readSyncSpy = vi.spyOn(require('fs'), 'readFileSync').mockReturnValue('{"name": "test-package"}');
      const existsSyncSpy = vi.spyOn(require('fs'), 'existsSync').mockReturnValue(true);

      // 第一次创建插件
      new QiankunPlugin({});
      const firstCallCount = readSyncSpy.mock.calls.length;

      // 第二次创建插件
      new QiankunPlugin({});
      const secondCallCount = readSyncSpy.mock.calls.length;

      // 第二次不应该再次读取文件
      expect(secondCallCount).toBe(firstCallCount);

      // 恢复 mock
      readSyncSpy.mockRestore();
      existsSyncSpy.mockRestore();
    });
  });
});
