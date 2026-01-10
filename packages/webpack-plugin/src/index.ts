import fs from 'fs';
import path from 'path';
import type { Compiler, Configuration, Compilation, sources, WebpackError } from 'webpack';
import { RawSource } from 'webpack-sources';
import cheerio from 'cheerio';

export type QiankunPluginOptions = {
  packageName?: string;
  entrySrcPattern?: RegExp;
};

export type PackageJson = {
  name?: string;
};

type Webpack4OutputOptions = {
  jsonpFunction?: string;
};

export class QiankunPlugin {
  private packageName: string;
  private entrySrcPattern: RegExp | null;

  private static packageJson: PackageJson = QiankunPlugin.readPackageJson();

  constructor(options: QiankunPluginOptions = {}) {
    this.packageName = options.packageName || QiankunPlugin.packageJson.name || '';
    if (options.entrySrcPattern) {
      const flags = options.entrySrcPattern.flags.includes('g')
        ? options.entrySrcPattern.flags
        : options.entrySrcPattern.flags + 'g';
      this.entrySrcPattern = new RegExp(options.entrySrcPattern.source, flags);
    } else {
      this.entrySrcPattern = null;
    }
  }

  private static readPackageJson(): PackageJson {
    const projectRoot: string = process.cwd();
    const packageJsonPath: string = path.join(projectRoot, 'package.json');
    return JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8')) as PackageJson;
  }

  apply(compiler: Compiler): void {
    this.configureWebpackOutput(compiler);

    // Feature detection: processAssets hook only exists in webpack 5+
    // Using 'in' operator to check if compilation has processAssets hook
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const Compilation = compiler.webpack?.Compilation;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const hasProcessAssets = Compilation && 'PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE' in Compilation;

    if (hasProcessAssets) {
      compiler.hooks.thisCompilation.tap('QiankunPlugin', (compilation: Compilation) => {
        compilation.hooks.processAssets.tap(
          {
            name: 'QiankunPlugin',
            stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE,
          },
          () => {
            this.modifyHtmlAssets(compilation);
          },
        );
      });
    } else {
      compiler.hooks.emit.tapAsync('QiankunPlugin', (compilation: Compilation, callback: () => void) => {
        this.modifyHtmlAssets(compilation);
        callback();
      });
    }
  }

  private configureWebpackOutput(compiler: Compiler): void {
    // Feature detection: check if output.jsonpFunction exists (webpack 4)
    // and output.chunkLoadingGlobal exists (webpack 5)
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const output = compiler.options.output || {};
    const hasJsonpFunction = 'jsonpFunction' in output;
    // chunkLoadingGlobal only exists when explicitly set in webpack options
    const hasChunkLoadingGlobal = Object.prototype.hasOwnProperty.call(output, 'chunkLoadingGlobal');

    if (hasJsonpFunction) {
      // webpack 4
      const webpackCompilerOptions = compiler.options as Configuration & {
        output: Configuration['output'] & Webpack4OutputOptions;
      };
      webpackCompilerOptions.output.library = `${this.packageName}`;
      webpackCompilerOptions.output.libraryTarget = 'window';
      webpackCompilerOptions.output.jsonpFunction = `webpackJsonp_${this.packageName}`;
      webpackCompilerOptions.output.globalObject = 'window';
    } else {
      // webpack 5 (or future versions)
      const webpackCompilerOptions = compiler.options as Configuration;
      webpackCompilerOptions.output = webpackCompilerOptions.output || {};
      webpackCompilerOptions.output.library = {
        name: `${this.packageName}`,
        type: 'window',
      };
      webpackCompilerOptions.output.globalObject = 'window';
      if (hasChunkLoadingGlobal) {
        webpackCompilerOptions.output.chunkLoadingGlobal = `webpackJsonp_${this.packageName}`;
      }
    }
  }

  private modifyHtmlAssets(compilation: Compilation): void {
    Object.keys(compilation.assets).forEach((filename) => {
      if (filename.endsWith('.html')) {
        const htmlSource = compilation.assets[filename].source();
        const htmlString = typeof htmlSource === 'string' ? htmlSource : htmlSource.toString('utf-8');

        const result = this.addEntryAttributeToScripts(htmlString, filename);
        if (result.error) {
          const webpackError = new Error(result.error) as WebpackError;
          compilation.errors.push(webpackError);
          return;
        }

        if (result.html) {
          const newSource = new RawSource(result.html) as sources.Source;
          // updateAsset only exists in Webpack 5+
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if ('updateAsset' in compilation) {
            compilation.updateAsset(filename, newSource);
          } else {
            (compilation as { assets: Record<string, sources.Source> }).assets[filename] = newSource;
          }
        }
      }
    });
  }

  addEntryAttributeToScripts(htmlString: string, filename: string): { html?: string; error?: string } {
    const $ = cheerio.load(htmlString);

    const alreadyHasEntry = $('script[entry]').length > 0;
    if (alreadyHasEntry) {
      return { html: $.html() };
    }

    if (!this.entrySrcPattern) {
      $('script').last().attr('entry', '');
    } else {
      // Reset lastIndex to avoid global regex stateful matching issues
      this.entrySrcPattern.lastIndex = 0;
      const matchingScriptTags = $('script').filter((_, el) => {
        const src = $(el).attr('src');
        if (!src || !this.entrySrcPattern) return false;
        this.entrySrcPattern.lastIndex = 0;
        return this.entrySrcPattern.test(src);
      });

      if (matchingScriptTags.length > 1) {
        return {
          error: `[QiankunPlugin] The regular expression matched multiple script tags in "${filename}", please check your regex.`,
        };
      }
      if (matchingScriptTags.length === 1) {
        matchingScriptTags.first().attr('entry', '');
      } else {
        return {
          error: `[QiankunPlugin] The provided regular expression did not match any scripts in "${filename}".`,
        };
      }
    }

    return { html: $.html() };
  }
}
