/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
import HtmlWebpackPlugin from 'html-webpack-plugin';
import type { Compiler, Compilation } from 'webpack';
import packageJson from '../package.json';

interface QiankunPluginOptions {
  packageName?: string;
  htmlWebpackPluginOptions?: HtmlWebpackPlugin.Options;
}

interface HtmlWebpackPluginHooks {
  htmlWebpackPluginAlterAssetTags?: {
    tapAsync: (pluginName: string, callback: (data: any, cb: any) => void) => void;
  };
}

interface TagAttributes {
  src?: string;
  [key: string]: any;
}

interface Tag {
  tagName: string;
  attributes: TagAttributes;
}



class QiankunPlugin {
  private packageName: string;
  private htmlWebpackPluginOptions: HtmlWebpackPlugin.Options;

  constructor(options: QiankunPluginOptions = {}) {
    this.packageName = options.packageName || packageJson.name;
    this.htmlWebpackPluginOptions = options.htmlWebpackPluginOptions || {};
  }

  apply(compiler: Compiler): void {
    // 首先，添加HtmlWebpackPlugin
    new HtmlWebpackPlugin(this.htmlWebpackPluginOptions).apply(compiler);

    // 检查Webpack版本
    const isWebpack5 = compiler.webpack && typeof compiler.webpack.version === 'string' && compiler.webpack.version.startsWith('5');

    // 根据Webpack版本，使用适当的钩子
    if (isWebpack5) {
      compiler.hooks.thisCompilation.tap('QiankunPlugin', (compilation: Compilation) => {
        HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync(
          'QiankunPlugin',
          (data, cb) => {
            this.addEntryAttribute(data.bodyTags);
            cb(null, data);
          }
        );
      });
    } else {
      // Webpack 4
      compiler.hooks.compilation.tap('QiankunPlugin', (compilation: Compilation) => {
        const hooks = (compilation.hooks as HtmlWebpackPluginHooks).htmlWebpackPluginAlterAssetTags;
        if (hooks) {
          hooks.tapAsync('QiankunPlugin', (data: any, cb: any) => {
            this.addEntryAttribute(data.body);
            cb(null, data);
          });
        }
      });
      
    }

    // 修改输出配置
    if (isWebpack5) {
      compiler.options.output.library = {
        name: `${this.packageName}-[name]`,
        type: 'umd',
      };
    } else {
      // 对于Webpack 4
      (compiler.options.output as any).library = `${this.packageName}-[name]`;
      (compiler.options.output as any).libraryTarget = 'umd';
      (compiler.options.output as any).jsonpFunction = `webpackJsonp_${this.packageName}`;
    }
    compiler.options.output.chunkLoadingGlobal = `webpackJsonp_${this.packageName}`;
    compiler.options.output.globalObject = 'window';
  }

  private addEntryAttribute(tags: Tag[]): void {
    const entryTag = tags.find(tag => tag.tagName === 'script' && tag.attributes && tag.attributes.src && tag.attributes.src.includes('entry'));
    if (entryTag) {
      entryTag.attributes.entry = '';
    }
  }
}

export default QiankunPlugin;
