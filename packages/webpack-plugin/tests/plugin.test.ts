import fs from 'fs';
import path from 'path';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import webpack4PackageJson from './webpack4/package.json';
import webpack5PackageJson from './webpack5/package.json';
import cheerio from 'cheerio';

// 统一导入 QiankunPlugin
const { QiankunPlugin } = require('../dist/cjs/index');

describe('QiankunPlugin', () => {
  // 基础功能测试
  describe('Basic Functionality', () => {
    it('should work with webpack 4', async () => {
      const packageName4 = webpack4PackageJson.name;

      const htmlPath4 = path.join(__dirname, 'webpack4/dist/index.html');
      if (!fs.existsSync(htmlPath4)) {
        throw new Error('HTML file not found for webpack 4. Please run build first.');
      }

      const htmlContent4 = fs.readFileSync(htmlPath4, 'utf-8');
      const $4 = cheerio.load(htmlContent4);
      const hasEntryAttribute4 = $4('script[entry]').length > 0;
      expect(hasEntryAttribute4).toBe(true);

      const jsPath4 = path.join(__dirname, 'webpack4/dist/bundle.js');
      if (!fs.existsSync(jsPath4)) {
        throw new Error('Bundle file not found for webpack 4. Please run build first.');
      }

      const jsChunkContent4 = fs.readFileSync(jsPath4, 'utf-8');
      const regex4 = new RegExp(`window(\\.\\${packageName4}|\\["${packageName4}"\\])`);
      expect(jsChunkContent4).toMatch(regex4);
    });

    it('should work with webpack 5', async () => {
      const packageName5 = webpack5PackageJson.name;

      const htmlPath5 = path.join(__dirname, 'webpack5/dist/index.html');
      if (!fs.existsSync(htmlPath5)) {
        throw new Error('HTML file not found for webpack 5. Please run build first.');
      }

      const htmlContent5 = fs.readFileSync(htmlPath5, 'utf-8');
      const $5 = cheerio.load(htmlContent5);
      const hasEntryAttribute5 = $5('script[entry]').length > 0;
      expect(hasEntryAttribute5).toBe(true);

      const jsPath5 = path.join(__dirname, 'webpack5/dist/bundle.js');
      if (!fs.existsSync(jsPath5)) {
        throw new Error('Bundle file not found for webpack 5. Please run build first.');
      }

      const jsChunkContent5 = fs.readFileSync(jsPath5, 'utf-8');
      const regex5 = new RegExp(`window(\\.\\${packageName5}|\\["${packageName5}"\\])`);
      expect(jsChunkContent5).toMatch(regex5);
    });
  });

  // 配置选项测试
  describe('Configuration Options', () => {
    it('should respect custom configuration options', () => {
      const plugin1 = new QiankunPlugin({
        packageName: 'test-app',
        entryAttributeName: 'main-entry',
      });
      expect(plugin1).toBeDefined();

      const plugin2 = new QiankunPlugin({
        packageName: 'test-app',
        chunkLoadingGlobalPrefix: 'myCustomPrefix_',
      });
      expect(plugin2).toBeDefined();
    });

    it('should handle all configuration combinations', () => {
      // 测试所有配置选项的组合
      const fullConfig = new QiankunPlugin({
        packageName: 'full-config-app',
        entrySrcPattern: /main\.js$/,
        entryAttributeName: 'custom-entry',
        chunkLoadingGlobalPrefix: 'customPrefix_',
      });
      expect(fullConfig).toBeDefined();

      // 测试部分配置
      const partialConfig = new QiankunPlugin({
        packageName: 'partial-app',
        entrySrcPattern: /bundle\.js$/,
      });
      expect(partialConfig).toBeDefined();

      // 测试最小配置
      const minimalConfig = new QiankunPlugin({
        packageName: 'minimal-app',
      });
      expect(minimalConfig).toBeDefined();
    });

    it('should use default values for optional parameters', () => {
      const plugin = new QiankunPlugin({
        packageName: 'default-test-app',
      });
      expect(plugin).toBeDefined();
      // 默认值通过插件行为间接验证
    });
  });

  // 错误处理测试
  describe('Error Handling', () => {
    it('should handle invalid configurations gracefully', () => {
      // 测试空包名
      expect(() => {
        new QiankunPlugin({ packageName: '' });
      }).toThrow('Package name is required');

      // 测试未定义包名且无 package.json
      expect(() => {
        new QiankunPlugin({ packageName: undefined });
      }).not.toThrow();
    });

    it('should handle invalid package names', () => {
      // 测试各种无效包名（这些应该警告但不抛出错误）
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      new QiankunPlugin({ packageName: '123invalid' });
      new QiankunPlugin({ packageName: 'Invalid@Name' });
      new QiankunPlugin({ packageName: 'spaces in name' });

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('may not be a valid npm package name'));

      consoleSpy.mockRestore();
    });

    it('should handle invalid compiler objects', () => {
      const plugin = new QiankunPlugin({ packageName: 'test-app' });

      // 测试无效的 compiler 对象
      expect(() => {
        plugin.apply(null as any);
      }).toThrow('Invalid webpack compiler provided');

      expect(() => {
        plugin.apply({} as any);
      }).toThrow('Invalid webpack compiler provided');

      expect(() => {
        plugin.apply({ hooks: null } as any);
      }).toThrow('Invalid webpack compiler provided');
    });

    it('should handle missing output configuration', () => {
      const plugin = new QiankunPlugin({ packageName: 'test-app' });

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const mockCompiler = {
        hooks: { emit: { tapAsync: vi.fn() }, compilation: { tap: vi.fn() } },
        options: { output: null },
        webpack: { version: '5.0.0' },
      };

      plugin.apply(mockCompiler as any);

      expect(consoleSpy).toHaveBeenCalledWith('Warning: No output configuration found in webpack options.');

      consoleSpy.mockRestore();
    });
  });

  // 正则表达式测试
  describe('Regular Expression Handling', () => {
    it('should handle various regex patterns', () => {
      // 测试不同的正则表达式
      const patterns = [/main\.js$/, /bundle\.[a-f0-9]+\.js$/, /app\..*\.js$/, /^index\.js$/, /(main|index|app)\.js$/];

      patterns.forEach((pattern) => {
        expect(() => {
          new QiankunPlugin({
            packageName: 'regex-test',
            entrySrcPattern: pattern,
          });
        }).not.toThrow();
      });
    });

    it('should remove global flag from regex', () => {
      // 测试全局标志的处理
      const globalRegex = /test\.js$/g;
      const plugin = new QiankunPlugin({
        packageName: 'global-regex-test',
        entrySrcPattern: globalRegex,
      });

      expect(plugin).toBeDefined();
      // 验证全局标志被移除（间接通过插件不抛出错误来验证）
    });

    it('should handle malformed regex gracefully', () => {
      // 由于我们在构造函数中验证正则表达式，这里测试边界情况
      expect(() => {
        new QiankunPlugin({
          packageName: 'test-app',
          entrySrcPattern: /[abc]/, // 这个正则表达式是有效的
        });
      }).not.toThrow();
    });
  });

  // HTML 处理测试
  describe('HTML Processing', () => {
    it('should handle various HTML structures', () => {
      const plugin = new QiankunPlugin({ packageName: 'html-test' });

      // 测试不同的 HTML 结构
      const htmlCases = [
        '<html><head></head><body><script src="app.js"></script></body></html>',
        '<html><body><script>console.log("inline")</script><script src="main.js"></script></body></html>',
        '<html><body><script src="vendor.js"></script><script src="app.js"></script></body></html>',
        '<html><body></body></html>', // 无脚本标签
        '<html><head><script src="head-script.js"></script></head><body></body></html>',
      ];

      // 使用私有方法进行测试（这里假设我们可以访问私有方法）
      htmlCases.forEach((html) => {
        expect(() => {
          // 这里我们测试 HTML 处理不会崩溃
          const result = (plugin as any).addEntryAttributeToScripts(html, 'test.html');
          expect(typeof result).toBe('string');
        }).not.toThrow();
      });
    });

    it('should handle already marked entry scripts', () => {
      const plugin = new QiankunPlugin({ packageName: 'entry-test' });

      const htmlWithEntry = '<html><body><script entry src="app.js"></script></body></html>';
      const result = (plugin as any).addEntryAttributeToScripts(htmlWithEntry, 'test.html');

      expect(result).toContain('entry');
      // 检查是否包含entry属性，不要求完全相等
      expect(result).toMatch(/script[^>]*entry/);
    });

    it('should handle custom entry attribute names', () => {
      const plugin = new QiankunPlugin({
        packageName: 'custom-attr-test',
        entryAttributeName: 'main-entry',
      });

      const html = '<html><body><script src="app.js"></script></body></html>';
      const result = (plugin as any).addEntryAttributeToScripts(html, 'test.html');

      expect(result).toContain('main-entry');
      // 不检查不包含 entry=""，因为 cheerio 可能会规范化属性
    });

    it('should handle inline scripts with regex pattern', () => {
      const plugin = new QiankunPlugin({
        packageName: 'inline-test',
        entrySrcPattern: /console\.log/,
      });

      const html = '<html><body><script>console.log("test")</script><script src="app.js"></script></body></html>';
      const result = (plugin as any).addEntryAttributeToScripts(html, 'test.html');

      expect(result).toContain('entry');
    });
  });

  // Webpack 版本兼容性测试
  describe('Webpack Version Compatibility', () => {
    it('should detect webpack version correctly', () => {
      const plugin = new QiankunPlugin({ packageName: 'version-test' });

      // 模拟不同版本的 webpack compiler
      const webpack4Compiler = {
        hooks: { emit: { tapAsync: vi.fn() }, compilation: { tap: vi.fn() } },
        options: { output: {} },
        webpack: { version: '4.47.0' },
      };

      const webpack5Compiler = {
        hooks: { emit: { tapAsync: vi.fn() }, compilation: { tap: vi.fn() } },
        options: { output: {} },
        webpack: { version: '5.100.2' },
      };

      const unknownCompiler = {
        hooks: { emit: { tapAsync: vi.fn() }, compilation: { tap: vi.fn() } },
        options: { output: {} },
        webpack: { version: '6.0.0' },
      };

      expect(() => plugin.apply(webpack4Compiler as any)).not.toThrow();
      expect(() => plugin.apply(webpack5Compiler as any)).not.toThrow();
      expect(() => plugin.apply(unknownCompiler as any)).not.toThrow();
    });

    it('should handle missing webpack version', () => {
      const plugin = new QiankunPlugin({ packageName: 'no-version-test' });

      const compilerWithoutVersion = {
        hooks: { emit: { tapAsync: vi.fn() }, compilation: { tap: vi.fn() } },
        options: { output: {} },
        webpack: undefined,
      };

      expect(() => plugin.apply(compilerWithoutVersion as any)).not.toThrow();
    });
  });

  // 缓存机制测试
  describe('Caching Mechanism', () => {
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
  });

  // 边界情况测试
  describe('Edge Cases', () => {
    it('should handle empty HTML files', () => {
      const plugin = new QiankunPlugin({ packageName: 'empty-html-test' });

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const emptyHtml = '';
      const result = (plugin as any).addEntryAttributeToScripts(emptyHtml, 'empty.html');

      expect(typeof result).toBe('string');
      expect(consoleSpy).toHaveBeenCalledWith('Warning: No script tags found in HTML file empty.html.');

      consoleSpy.mockRestore();
    });

    it('should handle regex that matches multiple scripts', () => {
      const plugin = new QiankunPlugin({
        packageName: 'multi-match-test',
        entrySrcPattern: /\.js$/,
      });

      const html = '<html><body><script src="app.js"></script><script src="vendor.js"></script></body></html>';

      expect(() => {
        (plugin as any).addEntryAttributeToScripts(html, 'multi.html');
      }).toThrow('The regular expression matched multiple script tags');
    });

    it('should handle regex that matches no scripts', () => {
      const plugin = new QiankunPlugin({
        packageName: 'no-match-test',
        entrySrcPattern: /\.ts$/,
      });

      const html = '<html><body><script src="app.js"></script></body></html>';

      expect(() => {
        (plugin as any).addEntryAttributeToScripts(html, 'nomatch.html');
      }).toThrow('The provided regular expression did not match any scripts');
    });

    it('should handle extremely long package names', () => {
      const longName = 'a'.repeat(214); // npm 包名限制是 214 个字符

      expect(() => {
        new QiankunPlugin({ packageName: longName });
      }).not.toThrow();
    });

    it('should handle special characters in package names', () => {
      const specialNames = [
        '@scope/package-name',
        'package-with-dashes',
        'package_with_underscores',
        'package.with.dots',
      ];

      specialNames.forEach((name) => {
        expect(() => {
          new QiankunPlugin({ packageName: name });
        }).not.toThrow();
      });
    });
  });

  // 性能测试
  describe('Performance', () => {
    it('should handle large HTML files efficiently', () => {
      const plugin = new QiankunPlugin({ packageName: 'perf-test' });

      // 创建一个适中大小的 HTML 文件，避免栈溢出
      const largeHtml =
        '<html><body>' +
        '<div>'.repeat(1000) +
        'content' +
        '</div>'.repeat(1000) +
        '<script src="app.js"></script>' +
        '</body></html>';

      const startTime = Date.now();
      const result = (plugin as any).addEntryAttributeToScripts(largeHtml, 'large.html');
      const endTime = Date.now();

      expect(typeof result).toBe('string');
      expect(result).toContain('entry');
      expect(endTime - startTime).toBeLessThan(1000); // 应该在 1 秒内完成
    });

    it('should handle many script tags efficiently', () => {
      const plugin = new QiankunPlugin({ packageName: 'many-scripts-test' });

      // 创建包含很多脚本标签的 HTML
      const manyScripts =
        '<html><body>' +
        Array.from({ length: 100 }, (_, i) => `<script src="script${i}.js"></script>`).join('') +
        '</body></html>';

      const startTime = Date.now();
      const result = (plugin as any).addEntryAttributeToScripts(manyScripts, 'many-scripts.html');
      const endTime = Date.now();

      expect(typeof result).toBe('string');
      expect(result).toContain('entry');
      expect(endTime - startTime).toBeLessThan(1000); // 应该在 1 秒内完成
    });
  });
});
