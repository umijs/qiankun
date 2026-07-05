import { describe, expect, it } from 'vitest';
import type { IndexHtmlTransformContext, UserConfig } from 'vite';
import { qiankun } from '../src/vite';

function transformHtml(html: string, chunkFileName?: string): string {
  const plugin = qiankun();
  const hook = plugin.transformIndexHtml as {
    handler: (html: string, ctx: IndexHtmlTransformContext) => string;
  };
  const ctx = (chunkFileName ? { chunk: { fileName: chunkFileName } } : {}) as IndexHtmlTransformContext;
  return hook.handler(html, ctx);
}

describe('qiankun vite plugin', () => {
  it('should configure permissive CORS for dev and preview servers', () => {
    const plugin = qiankun();
    const config = (plugin.config as () => UserConfig)();

    expect(config.server?.cors).toBe(true);
    expect(config.server?.headers).toEqual({ 'Access-Control-Allow-Origin': '*' });
    expect(config.preview?.cors).toBe(true);
    expect(config.preview?.headers).toEqual({ 'Access-Control-Allow-Origin': '*' });
  });

  it('should mark the entry chunk script with the entry attribute on build', () => {
    const html = `<html><head>
      <script type="module" crossorigin src="/assets/vendor-abc.js"></script>
      <script type="module" crossorigin src="/assets/index-abc.js"></script>
    </head><body></body></html>`;

    const result = transformHtml(html, 'assets/index-abc.js');

    expect(result).toMatch(/<script[^>]*src="\/assets\/index-abc\.js"[^>]*entry=""[^>]*><\/script>/);
    expect(result).not.toContain('src="/assets/vendor-abc.js" entry');
  });

  it('should fall back to the last module script when no src matches the entry chunk', () => {
    const html = `<html><head>
      <script type="module" src="/assets/a.js"></script>
      <script type="module" src="/assets/b.js"></script>
    </head><body></body></html>`;

    const result = transformHtml(html, 'assets/index-abc.js');

    expect(result).toContain('src="/assets/b.js" entry=""');
    expect(result).not.toContain('src="/assets/a.js" entry');
  });

  it('should respect an existing entry attribute', () => {
    const html = `<html><head>
      <script type="module" src="/assets/a.js" entry></script>
      <script type="module" src="/assets/index-abc.js"></script>
    </head><body></body></html>`;

    const result = transformHtml(html, 'assets/index-abc.js');

    expect(result).not.toContain('src="/assets/index-abc.js" entry');
  });

  it('should leave dev html untouched (no chunk in context)', () => {
    const html = `<html><head><script type="module" src="/src/main.tsx"></script></head><body></body></html>`;

    expect(transformHtml(html)).toBe(html);
  });

  it('should ignore query and hash when matching the entry chunk', () => {
    const html = `<html><head>
      <script type="module" src="/assets/index-abc.js?v=1"></script>
    </head><body></body></html>`;

    const result = transformHtml(html, 'assets/index-abc.js');

    expect(result).toContain('src="/assets/index-abc.js?v=1" entry=""');
  });
});
