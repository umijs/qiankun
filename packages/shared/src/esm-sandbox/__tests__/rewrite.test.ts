import { beforeAll, describe, expect, it } from 'vitest';
import { prepareEsmLexer } from '../lexer';
import { rewriteModule } from '../rewrite';

const instanceKey = '__qk_appA_1_1__';
const globalsBaseSet = new Set(['window', 'document', 'console', 'history', 'location']);
const resolveSpecifier = (specifier: string, baseUrl: string): string => new URL(specifier, baseUrl).href;

const rewrite = (source: string, url = 'https://app-a.host/main.js') =>
  rewriteModule({ source, url, instanceKey, globalsBaseSet, resolveSpecifier });

beforeAll(async () => {
  await prepareEsmLexer();
});

describe('rewriteModule', () => {
  it('rewrites static import specifiers to instance-unique synthetic specifiers', () => {
    const { code, deps } = rewrite(`import { createApp } from './vue.js';\nexport const a = 1;`);
    expect(code).toContain(`from '${instanceKey}/https://app-a.host/vue.js'`);
    expect(deps).toEqual(['https://app-a.host/vue.js']);
  });

  it('rewrites re-export specifiers as well', () => {
    const { code, deps } = rewrite(`export { x } from './x.js';\nexport * from '/y.js';`);
    expect(code).toContain(`from '${instanceKey}/https://app-a.host/x.js'`);
    expect(code).toContain(`from '${instanceKey}/https://app-a.host/y.js'`);
    expect(deps).toHaveLength(2);
  });

  it('injects the runtime module import and the filtered destructuring set', () => {
    const { code, destructured, needsRuntime } = rewrite(`console.log(window.foo);`);
    expect(needsRuntime).toBe(true);
    expect(code).toContain(
      `import { __qk_view, __qk_resolve, __qk_dynamic_import, __qk_track } from "${instanceKey}/__runtime__";`,
    );
    expect(destructured.sort()).toEqual(['console', 'window']);
    expect(code).toMatch(/const \{ (console, window|window, console) \} = __qk_view;/);
  });

  it('binds dunder feature-flag identifiers live via let + __qk_track', () => {
    const { code, destructured } = rewrite(`window.__MY_FLAG__ = true;\nif (__MY_FLAG__) console.log(1);`);
    expect(destructured).toContain('__MY_FLAG__');
    expect(code).toContain('let { __MY_FLAG__ } = __qk_view;');
    expect(code).toContain('__qk_track(() => ({ __MY_FLAG__ } = __qk_view));');
    // dunder names never join the const snapshot group
    expect(code).not.toMatch(/const \{[^}]*__MY_FLAG__[^}]*\} = __qk_view;/);
  });

  it('pre-excludes dunder names declared in the module (webpack ESM output pattern)', () => {
    const { code, destructured } = rewrite(
      `var __webpack_exports__ = {};\nfunction __WEBPACK_DEFAULT_EXPORT__() {}\nif (__MY_FLAG__) console.log(__webpack_exports__);`,
    );
    expect(destructured).not.toContain('__webpack_exports__');
    expect(destructured).not.toContain('__WEBPACK_DEFAULT_EXPORT__');
    expect(code).not.toContain('let { __webpack_exports__');
    // an undeclared dunder in the same module still gets its live binding
    expect(destructured).toContain('__MY_FLAG__');
    expect(code).toContain('let { __MY_FLAG__ } = __qk_view;');
  });

  it('never binds internal or Object.prototype dunder names', () => {
    const { code, destructured } = rewrite(`console.log(a.__proto__, __qk_view_fake__);\nconst b = {};`);
    expect(destructured).not.toContain('__proto__');
    expect(code).not.toContain('let { __proto__');
    // __qk_-prefixed tokens are engine internals, they must stay unbound
    expect(destructured.filter((name) => name.startsWith('__qk_'))).toEqual([]);
  });

  it('excludes dunder names from the live group on redeclaration retry', () => {
    const { code, destructured } = rewriteModule({
      source: `let __LOCAL_FLAG__ = 1;\nconsole.log(__LOCAL_FLAG__);`,
      url: 'https://app-a.host/main.js',
      instanceKey,
      globalsBaseSet,
      resolveSpecifier,
      excludedNames: new Set(['__LOCAL_FLAG__']),
    });
    expect(destructured).not.toContain('__LOCAL_FLAG__');
    expect(code).not.toContain('let { __LOCAL_FLAG__ } = __qk_view;');
  });

  it('excludes import bindings from the destructuring set', () => {
    const { destructured } = rewrite(`import { history } from './router.js';\nconsole.log(history, window);`);
    expect(destructured).not.toContain('history');
    expect(destructured.sort()).toEqual(['console', 'window']);
  });

  it('excludes explicitly excluded names (redeclaration retry)', () => {
    const { destructured } = rewriteModule({
      source: `const history = { push() {} };\nhistory.push();\nconsole.log(1);`,
      url: 'https://app-a.host/main.js',
      instanceKey,
      globalsBaseSet,
      resolveSpecifier,
      excludedNames: new Set(['history']),
    });
    expect(destructured).toEqual(['console']);
  });

  it('rewrites import.meta by token span and provides url/resolve/hot', () => {
    const { code } = rewrite(`console.log(import.meta.url);\nif (import.meta.hot) { import.meta.hot.accept(); }`);
    expect(code).not.toMatch(/\bimport\.meta\b/);
    expect(code).toContain(`__qk_import_meta.url`);
    expect(code).toContain(`url: "https://app-a.host/main.js"`);
    expect(code).toContain('hot: { accept:');
  });

  it('does not rewrite identifiers that only look like import.meta', () => {
    const { code } = rewrite(`const importMeta = 'import.meta in string';\nconsole.log(importMeta);`);
    // the string content must stay untouched, only real import.meta tokens are rewritten
    expect(code).toContain(`'import.meta in string'`);
  });

  it('rewrites dynamic import to __qk_dynamic_import with the importer url', () => {
    const { code } = rewrite(`const load = (name) => import(\`./pages/\${name}.js\`);`);
    expect(code).toContain('__qk_dynamic_import(`./pages/${name}.js`, __qk_import_meta.url)');
    expect(code).toContain('const __qk_import_meta =');
  });

  it('locates the dynamic import paren via lexer offset, not a comment paren', () => {
    const { code } = rewrite(`const p = import /*(*/ ('./a.js');`);
    // the comment paren must not be mistaken for the call paren (no corrupted splice)
    expect(code).toContain("__qk_dynamic_import('./a.js', __qk_import_meta.url)");
    expect(code).not.toContain('/*(*/');
  });

  it('does not produce a double comma for a trailing-comma dynamic import', () => {
    const { code } = rewrite(`const p = import('./a.js',);`);
    expect(code).toContain("__qk_dynamic_import('./a.js', __qk_import_meta.url)");
    expect(code).not.toMatch(/,\s*,/);
  });

  it('leaves typed static imports rewritten but records them as typed deps', () => {
    const { code, deps, typedDeps } = rewrite(`import data from './data.json' with { type: 'json' };`);
    // specifier rewritten to synthetic, `with { type: 'json' }` clause preserved
    expect(code).toContain(`from '${instanceKey}/https://app-a.host/data.json' with { type: 'json' }`);
    expect(typedDeps).toEqual(['https://app-a.host/data.json']);
    expect(deps).toEqual([]);
  });

  it('leaves typed dynamic imports native (not rewritten to __qk_dynamic_import)', () => {
    const { code } = rewrite(`const j = import('https://cdn/x.json', { with: { type: 'json' } });`);
    expect(code).toContain("import('https://cdn/x.json', { with: { type: 'json' } })");
    expect(code).not.toContain('__qk_dynamic_import');
  });

  it('rejects synthetic specifiers in user code', () => {
    expect(() => rewrite(`import '__qk_appB_2_2__/https://evil.host/x.js';`)).toThrowError(/synthetic specifier/);
  });

  it('injects no header for modules referencing nothing', () => {
    const { code, needsRuntime, injectedLines } = rewrite(`export const answer = 42;`);
    expect(needsRuntime).toBe(false);
    expect(injectedLines).toBe(0);
    expect(code).not.toContain('__qk_view');
  });

  it('appends the sourceURL of the original module', () => {
    const { code } = rewrite(`export const a = 1;`);
    expect(code).toContain('//# sourceURL=https://app-a.host/main.js');
  });

  it('merges the line offset into an inline source map and absolutizes sources', () => {
    const map = { version: 3, sources: ['./main.ts'], mappings: 'AAAA' };
    const encoded = Buffer.from(JSON.stringify(map), 'utf-8').toString('base64');
    const source = `console.log(window);\n//# sourceMappingURL=data:application/json;base64,${encoded}`;
    const { code, injectedLines } = rewrite(source);
    expect(injectedLines).toBeGreaterThan(0);

    const remappedUrl = /sourceMappingURL=data:application\/json;base64,([A-Za-z0-9+/=]+)/.exec(code)![1];
    const remapped = JSON.parse(Buffer.from(remappedUrl, 'base64').toString('utf-8')) as {
      sources: string[];
      mappings: string;
    };
    expect(remapped.mappings).toBe(`${';'.repeat(injectedLines)}AAAA`);
    expect(remapped.sources).toEqual(['https://app-a.host/main.ts']);
  });

  it('strips external sourceMappingURL comments', () => {
    const { code } = rewrite(`console.log(window);\n//# sourceMappingURL=main.js.map`);
    expect(code).not.toContain('sourceMappingURL=main.js.map');
  });
});
