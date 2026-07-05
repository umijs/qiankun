/**
 * @author Kuitos
 * @since 2026-07-05
 */
import { load } from 'cheerio';
import type { IndexHtmlTransformContext, Plugin, UserConfig } from 'vite';

/**
 * Vite plugin that makes a Vite app loadable as a qiankun micro app:
 *
 * 1. dev/preview servers respond with permissive CORS headers, so the main app can
 *    fetch the entry html and module graph cross-origin;
 * 2. the built index.html gets its entry module script marked with the `entry`
 *    attribute (same contract as QiankunWebpackPlugin), so the loader picks the
 *    entry deterministically instead of falling back to the last module script.
 *
 * No legacy/SystemJS transformation is involved: qiankun loads Vite apps natively
 * through its ESM sandbox, both in dev and in production builds.
 */
export function qiankun(): Plugin {
  const corsHeaders = { 'Access-Control-Allow-Origin': '*' };

  return {
    name: 'qiankun',

    config(): UserConfig {
      return {
        server: {
          cors: true,
          headers: corsHeaders,
        },
        preview: {
          cors: true,
          headers: corsHeaders,
        },
      };
    },

    transformIndexHtml: {
      order: 'post',
      handler(html: string, ctx: IndexHtmlTransformContext) {
        // dev html needs no marking: the ESM engine resolves the entry by its
        // lifecycle exports (vite drops unknown attributes during dev transform anyway)
        const entryChunk = ctx.chunk;
        if (!entryChunk) {
          return html;
        }

        const $ = load(html);
        const moduleScripts = $('script[type="module"][src]');

        if (moduleScripts.length === 0 || moduleScripts.filter('[entry]').length > 0) {
          return html;
        }

        const matched = moduleScripts.filter((_, el) => {
          const src = $(el).attr('src');
          return !!src && src.split(/[?#]/)[0].endsWith(entryChunk.fileName);
        });

        const target = matched.length > 0 ? matched.first() : moduleScripts.last();
        target.attr('entry', '');

        return $.html();
      },
    },
  };
}

export default qiankun;
