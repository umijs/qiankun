import { describe, expect, it } from 'vitest';
import {
  createQiankunDevEntryHtml,
  createQiankunDevEntryScript,
  transformViteDevModule,
} from '../../../../../examples/shared/vite/qiankunDevPlugin';

describe('qiankun dev plugin helpers', () => {
  it('creates qiankun dev html with a single classic entry script', () => {
    const html = createQiankunDevEntryHtml({ rootId: 'root' });

    expect(html).toContain('<div id="root"></div>');
    expect(html).toContain('<script src="/__qiankun_dev__.js" entry></script>');
    expect(html).not.toContain('type="module"');
  });

  it('creates a dev adapter script that exposes lifecycle functions synchronously', () => {
    const code = createQiankunDevEntryScript({
      appName: 'reactApp',
      moduleEntry: '/src/main.tsx',
    });

    expect(code).toContain('globalThis["reactApp"]');
    expect(code).toContain('bootstrap: (...args) => loadAppModule().then((mod) => mod.bootstrap(...args))');
    expect(code).toContain('__qiankun_dev_module__');
    expect(code).toContain('eval(');
    expect(code).toContain('/src/main.tsx');
  });

  it('transforms vite esm into sandbox loader code', () => {
    const transformed = transformViteDevModule(
      [
        'import foo, { bar as baz } from "/dep.js";',
        'import "/style.css";',
        'export const count = 1;',
        'export default function greet() { return import.meta.url; }',
      ].join('\n'),
      '/src/example.js',
    );

    expect(transformed).toContain('const __qiankun_import_0 = await __qiankun_import__("/dep.js");');
    expect(transformed).toContain('const foo = __qiankun_import_0.default;');
    expect(transformed).toContain('const { bar: baz } = __qiankun_import_0;');
    expect(transformed).toContain('await __qiankun_load_css__("/style.css");');
    expect(transformed).toContain('__qiankun_exports__.count = count;');
    expect(transformed).toContain('__qiankun_import_meta__.url');
    expect(transformed).toContain('__qiankun_exports__.default = greet;');
  });
});
