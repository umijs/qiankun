import fs from 'fs';
import path from 'path';
import type { Compiler, Compilation } from 'webpack';
import { RawSource } from 'webpack-sources';
import cheerio from 'cheerio';

export type QiankunPluginOptions = {
  packageName?: string;
  entrySrcPattern?: RegExp;
  entryAttributeName?: string; // 新增：可配置的入口属性名
  chunkLoadingGlobalPrefix?: string; // 新增：可配置的全局前缀
};

export type PackageJson = {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

// 扩展webpack输出类型以包含旧版本的属性
interface WebpackOutputWithLegacy {
  library?: string | { name?: string; type?: string };
  libraryTarget?: string;
  jsonpFunction?: string;
  chunkLoadingGlobal?: string;
  globalObject?: string;
}

export class QiankunPlugin {
  private packageName: string;
  private entrySrcPattern: RegExp | null;
  private entryAttributeName: string;
  private chunkLoadingGlobalPrefix: string;

  private static packageJsonCache: PackageJson | null = null;

  constructor(options: QiankunPluginOptions = {}) {
    const packageJson = QiankunPlugin.getPackageJson();

    // 参数验证 - 修复空字符串的处理逻辑
    const providedName = options.packageName !== undefined ? options.packageName : packageJson.name || '';
    this.packageName = this.validatePackageName(providedName);
    this.entrySrcPattern = this.validateRegexPattern(options.entrySrcPattern);
    this.entryAttributeName = options.entryAttributeName || 'entry';
    this.chunkLoadingGlobalPrefix = options.chunkLoadingGlobalPrefix || 'webpackJsonp_';
  }

  private validatePackageName(name: string): string {
    if (!name) {
      throw new Error(
        'Package name is required. Please provide packageName option or ensure package.json has a valid name field.',
      );
    }

    // 基本的包名验证
    if (!/^[@a-z0-9][a-z0-9._/-]*[a-z0-9]$/i.test(name)) {
      console.warn(`Warning: Package name "${name}" may not be a valid npm package name.`);
    }

    return name;
  }

  private validateRegexPattern(pattern?: RegExp): RegExp | null {
    if (!pattern) return null;

    try {
      // 移除全局标志以避免状态问题
      const flags = pattern.flags.replace('g', '');
      return new RegExp(pattern.source, flags);
    } catch (error) {
      throw new Error(`Invalid regular expression pattern: ${error}`);
    }
  }

  private static getPackageJson(): PackageJson {
    if (QiankunPlugin.packageJsonCache !== null) {
      return QiankunPlugin.packageJsonCache;
    }

    try {
      const projectRoot = process.cwd();
      const packageJsonPath = path.join(projectRoot, 'package.json');

      if (!fs.existsSync(packageJsonPath)) {
        console.warn('Warning: package.json not found in project root.');
        QiankunPlugin.packageJsonCache = {};
        return QiankunPlugin.packageJsonCache;
      }

      const content = fs.readFileSync(packageJsonPath, 'utf-8');
      QiankunPlugin.packageJsonCache = JSON.parse(content) as PackageJson;
      return QiankunPlugin.packageJsonCache;
    } catch (error) {
      console.warn('Warning: Failed to read or parse package.json:', error);
      QiankunPlugin.packageJsonCache = {};
      return QiankunPlugin.packageJsonCache;
    }
  }

  apply(compiler: Compiler): void {
    if (!this.isValidWebpackCompiler(compiler)) {
      throw new Error('Invalid webpack compiler provided.');
    }

    this.configureWebpackOutput(compiler);

    // 使用更现代的 hooks，避免 webpack 5 废弃警告
    const version = compiler.webpack.version || '4';

    if (version.startsWith('5')) {
      // Webpack 5: 使用 processAssets hook
      compiler.hooks.compilation.tap('QiankunPlugin', (compilation: unknown) => {
        if (compilation.hooks && compilation.hooks.processAssets) {
          compilation.hooks.processAssets.tapAsync(
            {
              name: 'QiankunPlugin',
              // 使用数字常量避免类型问题，这对应 PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE
              stage: 700,
            },
            (assets: unknown, callback: () => void) => {
              try {
                this.modifyHtmlAssetsWebpack5(compilation, assets);
                callback();
              } catch (error) {
                console.error('QiankunPlugin error during HTML modification:', error);
                callback();
              }
            },
          );
        } else {
          // 降级到 emit hook 如果 processAssets 不可用
          compiler.hooks.emit.tapAsync('QiankunPlugin', (compilation: Compilation, callback: () => void) => {
            try {
              this.modifyHtmlAssets(compilation);
              callback();
            } catch (error) {
              console.error('QiankunPlugin error during HTML modification:', error);
              callback();
            }
          });
        }
      });
    } else {
      // Webpack 4: 继续使用 emit hook
      compiler.hooks.emit.tapAsync('QiankunPlugin', (compilation: Compilation, callback: () => void) => {
        try {
          this.modifyHtmlAssets(compilation);
          callback();
        } catch (error) {
          console.error('QiankunPlugin error during HTML modification:', error);
          callback();
        }
      });
    }
  }

  private isValidWebpackCompiler(compiler: unknown): compiler is Compiler {
    return (
      compiler &&
      typeof compiler === 'object' &&
      compiler.hooks &&
      typeof compiler.hooks === 'object' &&
      compiler.options &&
      typeof compiler.options === 'object'
    );
  }

  private configureWebpackOutput(compiler: Compiler): void {
    const version = compiler.webpack.version || '4';
    const output = compiler.options.output as WebpackOutputWithLegacy;

    if (!output) {
      console.warn('Warning: No output configuration found in webpack options.');
      return;
    }

    const chunkLoadingGlobal = `${this.chunkLoadingGlobalPrefix}${this.packageName}`;

    if (version.startsWith('4')) {
      // Webpack 4 配置
      output.library = this.packageName;
      output.libraryTarget = 'window';
      output.jsonpFunction = chunkLoadingGlobal;
    } else if (version.startsWith('5')) {
      // Webpack 5 配置
      output.library = {
        name: this.packageName,
        type: 'window',
      };

      // 在 webpack 5 中不设置 libraryTarget 和 jsonpFunction
      output.chunkLoadingGlobal = chunkLoadingGlobal;
    } else {
      console.warn(`Warning: Unsupported webpack version: ${version}. Plugin may not work correctly.`);
    }

    output.globalObject = 'window';
  }

  private modifyHtmlAssets(compilation: Compilation): void {
    const htmlFiles = Object.keys(compilation.assets).filter((filename) => filename.endsWith('.html'));

    if (htmlFiles.length === 0) {
      console.warn('Warning: No HTML files found in compilation assets.');
      return;
    }

    htmlFiles.forEach((filename) => {
      try {
        const asset = compilation.assets[filename];
        const htmlSource = asset.source();
        const htmlString = typeof htmlSource === 'string' ? htmlSource : htmlSource.toString('utf-8');

        const modifiedHtml = this.addEntryAttributeToScripts(htmlString, filename);

        // 使用更安全的类型设置，添加 as any 来避免类型检查问题
        compilation.assets[filename] = new RawSource(modifiedHtml) as unknown;
      } catch (error) {
        console.error(`Error modifying HTML file ${filename}:`, error);
      }
    });
  }

  private modifyHtmlAssetsWebpack5(compilation: unknown, assets: Record<string, unknown>): void {
    const htmlFiles = Object.keys(assets).filter((filename) => filename.endsWith('.html'));

    if (htmlFiles.length === 0) {
      console.warn('Warning: No HTML files found in compilation assets.');
      return;
    }

    htmlFiles.forEach((filename) => {
      try {
        const asset = assets[filename];
        const htmlSource = asset.source();
        const htmlString = typeof htmlSource === 'string' ? htmlSource : htmlSource.toString('utf-8');

        const modifiedHtml = this.addEntryAttributeToScripts(htmlString, filename);

        // 在 webpack 5 中使用 updateAsset 方法，使用 any 类型避免类型检查问题
        if (compilation.updateAsset && typeof compilation.updateAsset === 'function') {
          compilation.updateAsset(filename, new RawSource(modifiedHtml) as unknown);
        } else {
          // 降级处理
          compilation.assets[filename] = new RawSource(modifiedHtml) as unknown;
        }
      } catch (error) {
        console.error(`Error modifying HTML file ${filename}:`, error);
      }
    });
  }

  private addEntryAttributeToScripts(htmlString: string, filename?: string): string {
    const $ = cheerio.load(htmlString);

    const alreadyHasEntry = $(`script[${this.entryAttributeName}]`).length > 0;
    if (alreadyHasEntry) {
      return $.html();
    }

    if (!this.entrySrcPattern) {
      // 如果没有提供正则表达式，选择最后一个有效的 script 标签
      const scriptTags = $('script');
      if (scriptTags.length > 0) {
        scriptTags.last().attr(this.entryAttributeName, '');
      } else {
        console.warn(`Warning: No script tags found in HTML file ${filename || 'unknown'}.`);
      }
    } else {
      // 使用提供的正则表达式过滤 script 标签
      const matchingScriptTags = $('script').filter((_, el) => {
        const $el = $(el);
        const src = $el.attr('src');

        // 检查外部脚本的 src 属性
        if (src && this.matchesPattern(src)) {
          return true;
        }

        // 也检查内联脚本的内容（如果正则表达式适用）
        const scriptContent = $el.html();
        if (scriptContent && this.matchesPattern(scriptContent)) {
          return true;
        }

        return false;
      });

      if (matchingScriptTags.length > 1) {
        const sources = matchingScriptTags.map((_, el) => $(el).attr('src') || 'inline').get();
        throw new Error(
          `The regular expression matched multiple script tags in ${filename || 'HTML file'}. ` +
            `Matched scripts: [${sources.join(', ')}]. Please refine your regex pattern.`,
        );
      } else if (matchingScriptTags.length === 1) {
        matchingScriptTags.first().attr(this.entryAttributeName, '');
      } else {
        throw new Error(
          `The provided regular expression did not match any scripts in ${filename || 'HTML file'}. ` +
            `Pattern: ${this.entrySrcPattern.source}`,
        );
      }
    }

    return $.html();
  }

  private matchesPattern(text: string): boolean {
    if (!this.entrySrcPattern) return false;

    // 每次使用时创建新的正则实例，避免全局状态问题
    const pattern = new RegExp(this.entrySrcPattern.source, this.entrySrcPattern.flags);
    return pattern.test(text);
  }
}
