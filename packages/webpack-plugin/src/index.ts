import fs from 'fs';
import path from 'path';
import type { Compiler, Configuration, Compilation } from 'webpack';
import { RawSource } from 'webpack-sources';
import cheerio from 'cheerio';

export interface QiankunPluginOptions {
  packageName?: string;
  entrySrcPattern?: RegExp;
}

export interface PackageJson {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

interface WebpackOutputConfiguration extends NonNullable<Configuration['output']> {
  // webpack 4 特有属性
  jsonpFunction?: string;
  // webpack 5 特有属性
  chunkLoadingGlobal?: string;
}

export class QiankunPlugin {
  private readonly packageName: string;
  private readonly entrySrcPattern: RegExp | null;
  private static packageJson: PackageJson = QiankunPlugin.readPackageJson();

  constructor(options: QiankunPluginOptions = {}) {
    this.packageName = this.validatePackageName(
      options.packageName || QiankunPlugin.packageJson.name || ''
    );
    this.entrySrcPattern = this.validateEntrySrcPattern(options.entrySrcPattern);
  }

  private validatePackageName(packageName: string): string {
    if (!packageName.trim()) {
      throw new Error('包名不能为空，请在插件选项中提供 packageName 或确保 package.json 中存在 name 字段');
    }
    return packageName.trim();
  }

  private validateEntrySrcPattern(pattern?: RegExp): RegExp | null {
    if (!pattern) return null;
    
    try {
      // 创建新的 RegExp 实例以确保全局标志正确
      return new RegExp(pattern.source, 'g');
    } catch (error) {
      throw new Error(`入口脚本匹配正则表达式无效: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private static readPackageJson(): PackageJson {
    try {
      const projectRoot: string = process.cwd();
      const packageJsonPath: string = path.join(projectRoot, 'package.json');
      const content = fs.readFileSync(packageJsonPath, 'utf-8');
      return JSON.parse(content) as PackageJson;
    } catch (error) {
      console.warn('无法读取 package.json 文件:', error);
      return {};
    }
  }

  apply(compiler: Compiler): void {
    this.configureWebpackOutput(compiler);
    
    compiler.hooks.emit.tapAsync('QiankunPlugin', (compilation: Compilation, callback: () => void) => {
      try {
        this.modifyHtmlAssets(compilation);
        callback();
      } catch (error) {
        console.error('QiankunPlugin 处理 HTML 资源时发生错误:', error);
        callback();
      }
    });
  }

  private configureWebpackOutput(compiler: Compiler): void {
    const webpackVersion = this.getWebpackVersion(compiler);
    
    if (!compiler.options.output) {
      (compiler.options as any).output = {};
    }
    
    const output = compiler.options.output as WebpackOutputConfiguration;

    if (webpackVersion.startsWith('4')) {
      this.configureWebpack4Output(output);
    } else if (webpackVersion.startsWith('5')) {
      this.configureWebpack5Output(output);
    } else {
      console.warn(`不支持的 webpack 版本: ${webpackVersion}`);
    }
  }

  private getWebpackVersion(compiler: Compiler): string {
    return compiler.webpack?.version || '4';
  }

  private configureWebpack4Output(output: WebpackOutputConfiguration): void {
    output.library = this.packageName;
    output.libraryTarget = 'window';
    output.jsonpFunction = `webpackJsonp_${this.packageName}`;
    output.globalObject = 'window';
  }

  private configureWebpack5Output(output: WebpackOutputConfiguration): void {
    output.library = {
      name: this.packageName,
      type: 'window',
    };
    output.chunkLoadingGlobal = `webpackJsonp_${this.packageName}`;
    output.globalObject = 'window';
  }

  private modifyHtmlAssets(compilation: Compilation): void {
    const htmlFiles = Object.keys(compilation.assets).filter(filename => filename.endsWith('.html'));
    
    htmlFiles.forEach((filename) => {
      try {
        const htmlSource = compilation.assets[filename].source();
        const htmlString = typeof htmlSource === 'string' ? htmlSource : htmlSource.toString('utf-8');
        const modifiedHtml = this.addEntryAttributeToScripts(htmlString);
        
        compilation.assets[filename] = new RawSource(modifiedHtml);
      } catch (error) {
        console.error(`处理 HTML 文件 ${filename} 时发生错误:`, error);
      }
    });
  }

  private addEntryAttributeToScripts(htmlString: string): string {
    try {
      const $ = cheerio.load(htmlString);

      // 检查是否已经存在 entry 属性
      const alreadyHasEntry = $('script[entry]').length > 0;
      if (alreadyHasEntry) {
        return $.html();
      }

      if (!this.entrySrcPattern) {
        // 如果没有提供正则表达式，则选择最后一个具有 src 属性的 script 标签
        const lastScriptWithSrc = $('script[src]').last();
        if (lastScriptWithSrc.length > 0) {
          lastScriptWithSrc.attr('entry', '');
        }
      } else {
        // 使用提供的正则表达式过滤 script 标签
        const matchingScriptTags = $('script[src]').filter((_, el) => {
          const src = $(el).attr('src');
          return !!(src && this.entrySrcPattern!.test(src));
        });

        if (matchingScriptTags.length > 1) {
          throw new Error('正则表达式匹配到多个 script 标签，请检查您的正则表达式配置');
        } else if (matchingScriptTags.length === 1) {
          matchingScriptTags.first().attr('entry', '');
        } else {
          throw new Error('提供的正则表达式没有匹配到任何 script 标签');
        }
      }

      return $.html();
    } catch (error) {
      console.error('解析 HTML 内容时发生错误:', error);
      return htmlString; // 返回原始 HTML 而不是抛出错误
    }
  }
}