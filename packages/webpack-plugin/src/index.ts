import fs from 'fs';
import path from 'path';
import type { Compiler, Configuration, Compilation } from 'webpack';
import { RawSource } from 'webpack-sources';
import cheerio from 'cheerio';

export type QiankunPluginOptions = {
  packageName?: string;
  entrySrcPattern?: RegExp; // 新增可选参数，用于匹配script标签
};

export type PackageJson = {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

export class QiankunPlugin {
  private packageName: string;
  private entrySrcPattern: RegExp | null; // 用户提供的正则表达式

  private static packageJson: PackageJson = QiankunPlugin.readPackageJson();

  constructor(options: QiankunPluginOptions = {}) {
    this.packageName = options.packageName || QiankunPlugin.packageJson.name || '';
    this.entrySrcPattern = options.entrySrcPattern ? new RegExp(options.entrySrcPattern.source, 'g') : null; // 默认值
  }

  private static readPackageJson(): PackageJson {
    const projectRoot: string = process.cwd();
    const packageJsonPath: string = path.join(projectRoot, 'package.json');
    return JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8')) as PackageJson;
  }

  apply(compiler: Compiler): void {
    this.configureWebpackOutput(compiler);
    compiler.hooks.emit.tapAsync('QiankunPlugin', (compilation: Compilation, callback: () => void) => {
      this.modifyHtmlAssets(compilation);
      callback();
    });
  }

  private configureWebpackOutput(compiler: Compiler): void {
    const webpackCompilerOptions = compiler.options as Configuration & { output: { jsonpFunction?: string } };
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const version = compiler.webpack?.version || '4';
    if (version.startsWith('4')) {
      // webpack 4
      webpackCompilerOptions.output.library = `${this.packageName}`;
      webpackCompilerOptions.output.libraryTarget = 'window';
      webpackCompilerOptions.output.jsonpFunction = `webpackJsonp_${this.packageName}`;
      webpackCompilerOptions.output.globalObject = 'window';
      webpackCompilerOptions.output.chunkLoadingGlobal = `webpackJsonp_${this.packageName}`;
    } else if (version.startsWith('5')) {
      // webpack 5
      webpackCompilerOptions.output.library = {
        name: `${this.packageName}`,
        type: 'window',
      };
      webpackCompilerOptions.output.libraryTarget = 'window';
      webpackCompilerOptions.output.jsonpFunction = `webpackJsonp_${this.packageName}`;
      webpackCompilerOptions.output.globalObject = 'window';
      webpackCompilerOptions.output.chunkLoadingGlobal = `webpackJsonp_${this.packageName}`;
    }
  }

  private modifyHtmlAssets(compilation: Compilation): void {
    Object.keys(compilation.assets).forEach((filename) => {
      if (filename.endsWith('.html')) {
        const htmlSource = compilation.assets[filename].source();
        const htmlString = typeof htmlSource === 'string' ? htmlSource : htmlSource.toString('utf-8');

        const modifiedHtml = this.addEntryAttributeToScripts(htmlString);
        // eslint-disable-next-line
        compilation.assets[filename] = new RawSource(modifiedHtml) as any;
      }
    });
  }

  private addEntryAttributeToScripts(htmlString: string): string {
    const $ = cheerio.load(htmlString);

    const alreadyHasEntry = $('script[entry]').length > 0;
    if (!alreadyHasEntry) {
      if (!this.entrySrcPattern) {
        // 如果没有提供正则表达式，则选择最后一个 script 标签
        $('script').last().attr('entry', '');
      } else {
        // 使用提供的正则表达式过滤 script 标签
        const matchingScriptTags = $('script').filter((_, el) => {
          const src = $(el).attr('src');
          // 确保 this.entrySrcPattern 不是 null 再调用 test 方法
          return src && this.entrySrcPattern ? this.entrySrcPattern.test(src) : false;
        });

        if (matchingScriptTags.length > 1) {
          throw new Error('The regular expression matched multiple script tags, please check your regex.');
        } else if (matchingScriptTags.length === 1) {
          matchingScriptTags.first().attr('entry', '');
        } else {
          throw new Error('The provided regular expression did not match any scripts.');
        }
      }
    }

    return $.html();
  }
}
