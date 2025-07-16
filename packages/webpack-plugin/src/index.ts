import { type Compiler, type Compilation, type WebpackPluginInstance } from 'webpack';
import { RawSource } from 'webpack-sources';

// 扩展 webpack 的 output 类型以包含 webpack 4 和 5 的 library 属性
interface WebpackOutputWithLegacy {
  library?: string | { name?: string; type?: string };
  libraryTarget?: string;
  publicPath?: string;
  filename?: string;
  chunkFilename?: string;
  path?: string;
  libraryExport?: string;
  umdNamedDefine?: boolean;
  jsonpFunction?: string;
  chunkLoadingGlobal?: string;
  globalObject?: string;
  [key: string]: unknown;
}



// 定义 webpack 5 编译钩子类型
interface WebpackCompilation {
  hooks?: {
    processAssets?: {
      tapAsync: (
        options: { name: string; stage: number },
        callback: (assets: unknown, callback: () => void) => void,
      ) => void;
    };
  };
  assets?: Record<string, unknown>;
  updateAsset?: (filename: string, source: unknown) => void;
  getAsset?: (filename: string) => unknown;
  [key: string]: unknown;
}

export interface QiankunPluginOptions {
  activeRule?: string | RegExp;
}

export class QiankunPlugin implements WebpackPluginInstance {
  private activeRule: RegExp | null = null;

  constructor(options: QiankunPluginOptions = {}) {
    this.activeRule = this.validateRegexPattern(options.activeRule);
  }

  private validateRegexPattern(pattern?: string | RegExp): RegExp | null {
    if (!pattern) return null;

    try {
      if (typeof pattern === 'string') {
        return new RegExp(pattern);
      }
      // 移除全局标志以避免状态问题
      const flags = pattern.flags.replace('g', '');
      return new RegExp(pattern.source, flags);
    } catch (error) {
      throw new Error(`Invalid regular expression pattern: ${error instanceof Error ? error.message : String(error)}`);
    }
  }



  private configureWebpackOutput(compiler: Compiler): void {
    // 暂时简化配置，只设置 globalObject 以避免 webpack 5 配置冲突
    const output = compiler.options.output as WebpackOutputWithLegacy;
    
    // 设置 globalObject
    if (!output.globalObject) {
      output.globalObject = 'window';
    }
  }

  apply(compiler: Compiler): void {
    this.configureWebpackOutput(compiler);

    // 使用功能检测而非版本检测，避免 webpack 5 废弃警告
    compiler.hooks.compilation.tap('QiankunPlugin', (compilation: unknown) => {
      const typedCompilation = compilation as WebpackCompilation;
      if (typedCompilation.hooks?.processAssets) {
        // Webpack 5: 使用 processAssets hook
        typedCompilation.hooks.processAssets.tapAsync(
          {
            name: 'QiankunPlugin',
            // 使用数字常量避免类型问题，这对应 PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE
            stage: 700,
          },
          (assets: unknown, callback: () => void) => {
            try {
              this.modifyHtmlAssetsWebpack5(typedCompilation, assets);
              callback();
            } catch (error) {
              console.error('QiankunPlugin error:', error);
              callback();
            }
          },
        );
      } else {
        // Webpack 4: 使用 emit hook
        compiler.hooks.emit.tapAsync('QiankunPlugin', (emitCompilation: Compilation, callback: () => void) => {
          try {
            this.modifyHtmlAssetsWebpack4(emitCompilation);
            callback();
          } catch (error) {
            console.error('QiankunPlugin error:', error);
            callback();
          }
        });
      }
    });
  }

  private modifyHtmlAssetsWebpack4(compilation: Compilation): void {
    const assets = compilation.assets;

    Object.keys(assets).forEach((filename) => {
      if (filename.endsWith('.html')) {
        const htmlAsset = assets[filename];
        const source = htmlAsset.source();
        const sourceString = typeof source === 'string' ? source : source.toString();
        const modifiedSource = this.modifyHtmlContent(sourceString);

        assets[filename] = new RawSource(modifiedSource) as unknown as (typeof assets)[string];
      }
    });
  }

  private modifyHtmlAssetsWebpack5(compilation: WebpackCompilation, assets: unknown): void {
    const typedAssets = assets as Record<string, unknown>;

    Object.keys(typedAssets).forEach((filename) => {
      if (filename.endsWith('.html')) {
        const htmlAsset = compilation.getAsset?.(filename) as
          | {
              source: () => string | Buffer;
              size: () => number;
            }
          | undefined;

        if (htmlAsset) {
          const source = htmlAsset.source();
          const sourceString = typeof source === 'string' ? source : source.toString();
          const modifiedSource = this.modifyHtmlContent(sourceString);

          if (compilation.updateAsset) {
            compilation.updateAsset(filename, new RawSource(modifiedSource) as unknown);
          }
        }
      }
    });
  }

  private modifyHtmlContent(source: string): string {
    if (typeof source !== 'string') {
      return String(source);
    }

    // 如果配置了 activeRule，只在匹配时处理
    if (this.activeRule && this.activeRule.test(source)) {
      return this.processHtmlContent(source);
    }

    // 如果没有 activeRule，默认处理所有 HTML
    if (!this.activeRule) {
      return this.processHtmlContent(source);
    }

    // 如果有 activeRule 但不匹配，返回原始内容
    return source;
  }

  private processHtmlContent(html: string): string {
    try {
      // 处理外部脚本标签
      html = html.replace(
        /<script([^>]*)\s+src\s*=\s*["']([^"']*\.js)["']([^>]*)>/gi,
        (match: string, beforeSrc: string, src: string, afterSrc: string) => {
          const hasEntry = /\bentry\s*=\s*["']/.test(beforeSrc + afterSrc);
          if (!hasEntry) {
            return `<script${beforeSrc} src="${src}" entry="true"${afterSrc}>`;
          }
          return match;
        },
      );

      // 处理内联脚本标签
      html = html.replace(/<script([^>]*?)>([\s\S]*?)<\/script>/gi, (match: string, attrs: string, content: string) => {
        // 跳过已有 entry 属性的脚本
        if (/\bentry\s*=\s*["']/.test(attrs)) {
          return match;
        }

        // 跳过空的或只有注释的脚本
        const trimmedContent = content.trim();
        if (!trimmedContent || trimmedContent.startsWith('//') || trimmedContent.startsWith('/*')) {
          return match;
        }

        return `<script${attrs} entry="true">${content}</script>`;
      });

      return html;
    } catch (error) {
      console.error('Error processing HTML content:', error);
      return html;
    }
  }
}

export default QiankunPlugin;
