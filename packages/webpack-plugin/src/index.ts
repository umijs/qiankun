import fs from 'fs';
import path from 'path';
import type { Compiler, Configuration } from 'webpack';
import { RawSource } from 'webpack-sources';

interface QiankunPluginOptions {
  packageName?: string;
}

interface PackageJson {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

class QiankunPlugin {
  private packageName: string;
  private static packageJson: PackageJson = QiankunPlugin.readPackageJson();

  constructor(options: QiankunPluginOptions = {}) {
    this.packageName = options.packageName || QiankunPlugin.packageJson.name || '';
  }

  private static readPackageJson(): { name?: string } {
    const projectRoot: string = process.cwd();
    const packageJsonPath: string = path.join(projectRoot, 'package.json');
    return JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  }

  private static getWebpackVersion(): string {
    return QiankunPlugin.packageJson.dependencies?.webpack || QiankunPlugin.packageJson.devDependencies?.webpack || '';
  }

  apply(compiler: Compiler): void {
    this.configureWebpackOutput(compiler);
    compiler.hooks.emit.tapAsync('QiankunPlugin', (compilation, callback) => {
      this.modifyHtmlAssets(compilation);
      callback();
    });
  }

  private configureWebpackOutput(compiler: Compiler): void {
    const webpackVersion = QiankunPlugin.getWebpackVersion();
    const webpackCompilerOptions = compiler.options as Configuration & { output: { jsonpFunction?: string } };
    if (webpackVersion.startsWith('4')) {
      // webpack 4
      webpackCompilerOptions.output.library = `${this.packageName}`;
      webpackCompilerOptions.output.libraryTarget = 'window';
      webpackCompilerOptions.output.jsonpFunction = `webpackJsonp_${this.packageName}`;
      webpackCompilerOptions.output.globalObject = 'window';
      webpackCompilerOptions.output.chunkLoadingGlobal = `webpackJsonp_${this.packageName}`;
    } else if (webpackVersion.startsWith('5')) {
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

  private modifyHtmlAssets(compilation: any): void {
    Object.keys(compilation.assets).forEach((filename) => {
      if (filename.endsWith('.html')) {
        const htmlSource = compilation.assets[filename].source();
        const htmlString = typeof htmlSource === 'string' ? htmlSource : htmlSource.toString('utf-8');

        const modifiedHtml = this.addEntryAttributeToScripts(htmlString);
        compilation.assets[filename] = new RawSource(modifiedHtml);
      }
    });
  }

  private addEntryAttributeToScripts(htmlString: string): string {
    const scriptTags = htmlString.match(/<script[^>]*src="[^"]+"[^>]*><\/script>/g) || [];
    const nonAsyncOrDeferScripts = scriptTags.filter((tag) => !/defer|async/.test(tag));

    if (nonAsyncOrDeferScripts.length) {
      const lastScriptTag = nonAsyncOrDeferScripts[nonAsyncOrDeferScripts.length - 1];
      const modifiedScriptTag = lastScriptTag.replace('<script', '<script entry');
      return htmlString.replace(lastScriptTag, modifiedScriptTag);
    }
    return htmlString;
  }
}

module.exports = QiankunPlugin;
