import type { IndexHtmlTransformContext, PluginOption } from 'vite';
import { load } from 'cheerio';

export default function qiankunHtmlPlugin(): PluginOption {
  return {
    name: 'qiankun-html-transform',
    enforce: 'post',
    apply: 'build',
    transformIndexHtml(html: string, ctx: IndexHtmlTransformContext) {
      if (!ctx || !isQiankunBuild(ctx)) return html;
      return transformHtml(html);
    },
  };
}

function isQiankunBuild(ctx: IndexHtmlTransformContext): boolean {
  return ctx.bundle !== undefined && ctx.server === undefined;
}

function rewriteSystemImport(script: string): string {
  const parentUrl = 'window.__POWERED_BY_QIANKUN__ ? window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ : document.baseURI';

  if (script.includes(parentUrl)) {
    return script;
  }

  const legacyEntryPattern = "document.getElementById('vite-legacy-entry').getAttribute('data-src')";
  if (script.includes(legacyEntryPattern)) {
    return script.replace(`System.import(${legacyEntryPattern})`, `System.import(${legacyEntryPattern}, ${parentUrl})`);
  }

  return script;
}

function transformHtml(html: string): string {
  const $ = load(html);

  $('script[type="module"]').remove();
  $('link[rel="modulepreload"]').remove();

  $('script[nomodule]').each((_, el) => {
    const scriptContent = $(el).html();
    if (!scriptContent || !scriptContent.includes('System.import')) return;

    const updated = rewriteSystemImport(scriptContent);
    if (updated !== scriptContent) {
      $(el).text(updated);
    }
  });

  return $.html();
}
