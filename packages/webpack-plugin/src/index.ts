import fs from 'fs';
import path from 'path';
import { Compiler, Configuration } from 'webpack';
import { RawSource } from 'webpack-sources';

const projectRoot: string = process.cwd();
const packageJsonPath: string = path.join(projectRoot, 'package.json');
const packageJson: { name?: string } = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

interface QiankunPluginOptions {
  packageName?: string;
}

class QiankunPlugin {
  private packageName: string;

  constructor(options: QiankunPluginOptions = {}) {
    this.packageName = options.packageName || packageJson.name || '';
  }

  apply(compiler: Compiler): void {
    const webpackCompilerOptions = compiler.options as Configuration & { output: { jsonpFunction?: string } };
    webpackCompilerOptions.output.library = `${this.packageName}`;
    webpackCompilerOptions.output.libraryTarget = 'window';
    webpackCompilerOptions.output.jsonpFunction = `webpackJsonp_${this.packageName}`;
    webpackCompilerOptions.output.globalObject = 'window';
    webpackCompilerOptions.output.chunkLoadingGlobal = `webpackJsonp_${this.packageName}`;

    compiler.hooks.emit.tapAsync('QiankunPlugin', (compilation, callback) => {
      Object.keys(compilation.assets).forEach(filename => {
        if (filename.endsWith('.html')) {
          const htmlSource = compilation.assets[filename].source();
          const htmlString = typeof htmlSource === 'string' ? htmlSource : htmlSource.toString('utf-8');
          
          // 找到所有的 <script> 标签
          const scriptTags = htmlString.match(/<script[^>]*src="[^"]+"[^>]*><\/script>/g) || [];
          // 筛选出不包含 defer 和 async 属性的标签
          const nonAsyncOrDeferScripts = scriptTags.filter(tag => !(/defer|async/.test(tag)));

          if (nonAsyncOrDeferScripts.length) {
            // 获取最后一个 <script> 标签
            const lastScriptTag = nonAsyncOrDeferScripts[nonAsyncOrDeferScripts.length - 1];
            // 添加 entry 属性
            const modifiedScriptTag = lastScriptTag.replace('<script', '<script entry');
            const modifiedHtml = htmlString.replace(lastScriptTag, modifiedScriptTag);
            compilation.assets[filename] = new RawSource(modifiedHtml) as any;
          }
        }
      });
      callback();
    });
  }
}

export default QiankunPlugin;

