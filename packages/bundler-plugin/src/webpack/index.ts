import * as fs from 'fs';
import * as path from 'path';
import type { Compiler, Compilation } from 'webpack';

export interface QiankunWebpackPluginOptions {
  packageName?: string;
}

interface Chunk {
  files: Iterable<string> | undefined;
  hasRuntime?: () => boolean;
}

interface Entrypoint {
  chunks: Chunk[] | undefined;
  getEntrypointChunk?: () => Chunk;
  getFiles?: () => string[];
}

interface PackageJson {
  name?: string;
}

interface HtmlTagObject {
  tagName: string;
  voidTag: boolean;
  attributes: Record<string, string | boolean | undefined>;
  innerHTML?: string;
  meta?: Record<string, unknown>;
}

interface HtmlWebpackPluginData {
  assetTags: {
    scripts: HtmlTagObject[];
    styles: HtmlTagObject[];
    meta: HtmlTagObject[];
  };
  outputName: string;
  publicPath: string;
  plugin: unknown;
}

interface HtmlWebpackPluginHooks {
  alterAssetTags: {
    tapAsync: (
      name: string,
      callback: (data: HtmlWebpackPluginData, cb: (err: Error | null, data: HtmlWebpackPluginData) => void) => void,
    ) => void;
  };
}

interface HtmlWebpackPluginStatic {
  getHooks(compilation: Compilation): HtmlWebpackPluginHooks;
}

export class QiankunWebpackPlugin {
  private readonly packageName: string;

  private static cachedPackageJson: PackageJson | null = null;

  constructor(options: QiankunWebpackPluginOptions = {}) {
    this.packageName = options.packageName || QiankunWebpackPlugin.getPackageName();
  }

  private static getPackageName(): string {
    if (!QiankunWebpackPlugin.cachedPackageJson) {
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      try {
        const content = fs.readFileSync(packageJsonPath, 'utf-8');
        QiankunWebpackPlugin.cachedPackageJson = JSON.parse(content) as PackageJson;
      } catch {
        QiankunWebpackPlugin.cachedPackageJson = {};
      }
    }
    return QiankunWebpackPlugin.cachedPackageJson.name || '';
  }

  apply(compiler: Compiler): void {
    this.configureOutput(compiler);
    this.registerHtmlProcessing(compiler);
  }

  private configureOutput(compiler: Compiler): void {
    const output = compiler.options.output;
    // webpack 4 doesn't have compiler.webpack, use it for version detection
    const webpack = (compiler as unknown as { webpack?: { version?: string } }).webpack;
    const isWebpack5 = webpack?.version?.startsWith('5');

    if (isWebpack5) {
      output.library = {
        name: this.packageName,
        type: 'window',
      };
    } else {
      // @ts-expect-error webpack 4 specific options
      output.library = this.packageName;
      // @ts-expect-error webpack 4 specific options
      output.libraryTarget = 'window';
      // @ts-expect-error webpack 4 specific options
      output.jsonpFunction = `webpackJsonp_${this.packageName}`;
      output.globalObject = 'window';
    }
  }

  private registerHtmlProcessing(compiler: Compiler): void {
    compiler.hooks.compilation.tap('QiankunWebpackPlugin', (compilation: Compilation) => {
      const HtmlWebpackPlugin = this.findHtmlWebpackPlugin(compiler);

      if (HtmlWebpackPlugin) {
        this.hookIntoHtmlWebpackPlugin(compilation, HtmlWebpackPlugin);
      }
    });
  }

  private findHtmlWebpackPlugin(compiler: Compiler): HtmlWebpackPluginStatic | null {
    const plugins = (compiler.options as unknown as { plugins?: unknown[] }).plugins ?? [];

    for (const plugin of plugins) {
      const ctor = (plugin as { constructor?: HtmlWebpackPluginStatic } | null)?.constructor;
      if (ctor && typeof ctor.getHooks === 'function') {
        return ctor;
      }
    }

    return null;
  }

  private hookIntoHtmlWebpackPlugin(compilation: Compilation, HtmlWebpackPlugin: HtmlWebpackPluginStatic): void {
    const hooks = HtmlWebpackPlugin.getHooks(compilation);

    hooks.alterAssetTags.tapAsync('QiankunWebpackPlugin', (data, callback) => {
      const scripts = data.assetTags.scripts;

      if (scripts.length === 0) {
        callback(null, data);
        return;
      }

      const hasEntry = scripts.some((script) => 'entry' in script.attributes);
      if (hasEntry) {
        callback(null, data);
        return;
      }

      const entryScriptSrc = this.findEntryScriptSrc(compilation, data.outputName);

      let marked = false;
      if (entryScriptSrc) {
        const entryScript = scripts.find((script) => {
          const src = script.attributes.src;
          return typeof src === 'string' && this.matchEntryScript(src, entryScriptSrc);
        });

        if (entryScript) {
          entryScript.attributes.entry = true;
          marked = true;
        }
      }

      if (!marked) {
        scripts[scripts.length - 1].attributes.entry = true;
      }

      callback(null, data);
    });
  }

  private findEntryScriptSrc(compilation: Compilation, htmlOutputName: string): string | null {
    const entrypoints = compilation.entrypoints as Map<string, Entrypoint> | undefined;
    if (!entrypoints || entrypoints.size === 0) {
      return null;
    }

    // For single entry, use the only entrypoint
    if (entrypoints.size === 1) {
      const entrypoint = entrypoints.values().next().value as Entrypoint;
      return this.getEntryChunkFile(entrypoint);
    }

    // For multiple entries, try to match by HTML filename
    const htmlBaseName = path.basename(htmlOutputName, '.html');
    const matchedEntrypoint = entrypoints.get(htmlBaseName);
    if (matchedEntrypoint) {
      return this.getEntryChunkFile(matchedEntrypoint);
    }

    // Fallback: use the first entrypoint
    const firstEntrypoint = entrypoints.values().next().value as Entrypoint;
    return this.getEntryChunkFile(firstEntrypoint);
  }

  private getEntryChunkFile(entrypoint: Entrypoint): string | null {
    // Webpack 5: getEntrypointChunk returns the main chunk
    if (typeof entrypoint.getEntrypointChunk === 'function') {
      const chunk = entrypoint.getEntrypointChunk();
      const files = chunk.files;
      if (files) {
        for (const file of files) {
          if (file.endsWith('.js')) {
            return file;
          }
        }
      }
    }

    // Webpack 4/5 fallback: iterate chunks to find the one with runtime or entry modules
    const chunks = entrypoint.chunks;
    if (chunks) {
      for (let i = chunks.length - 1; i >= 0; i--) {
        const chunk = chunks[i];
        // In code-split scenarios, the entry chunk usually has runtime
        if (chunk.hasRuntime?.() || i === chunks.length - 1) {
          const files = Array.from(chunk.files ?? []);
          for (const file of files) {
            if (file.endsWith('.js')) {
              return file;
            }
          }
        }
      }
    }

    // Last resort: get files from entrypoint
    const allFiles = entrypoint.getFiles?.() || [];
    for (const file of allFiles) {
      if (file.endsWith('.js')) {
        return file;
      }
    }

    return null;
  }

  private matchEntryScript(scriptSrc: string, entryFile: string): boolean {
    // Handle both absolute and relative paths
    const normalizedSrc = scriptSrc.replace(/^\//, '');
    const normalizedEntry = entryFile.replace(/^\//, '');

    return (
      normalizedSrc === normalizedEntry ||
      normalizedSrc.endsWith('/' + normalizedEntry) ||
      normalizedSrc.endsWith(normalizedEntry)
    );
  }
}

export default QiankunWebpackPlugin;
