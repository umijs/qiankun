import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { injectImportMapEntries, resetImportMapRegistry } from '../import-map-registry';

const readInjectedMaps = (): Array<Record<string, string>> =>
  Array.from(document.head.querySelectorAll('script[type="importmap"][data-qiankun="esm"]')).map(
    (script) => (JSON.parse(script.textContent!) as { imports: Record<string, string> }).imports,
  );

describe('injectImportMapEntries', () => {
  beforeEach(() => {
    resetImportMapRegistry();
  });

  afterEach(() => {
    document.head.querySelectorAll('script[type="importmap"]').forEach((s) => s.remove());
    vi.restoreAllMocks();
  });

  it('injects entries as an importmap script into the document head', () => {
    injectImportMapEntries({ '__qk_a_1_1__/https://a.host/main.js': 'blob:mock-1' });
    expect(readInjectedMaps()).toEqual([{ '__qk_a_1_1__/https://a.host/main.js': 'blob:mock-1' }]);
  });

  it('dedupes already injected specifiers and skips empty injections', () => {
    injectImportMapEntries({ spec1: 'blob:1' });
    injectImportMapEntries({ spec1: 'blob:1' });
    expect(readInjectedMaps()).toHaveLength(1);
  });

  it('only injects the fresh entries of a batch', () => {
    injectImportMapEntries({ spec1: 'blob:1' });
    injectImportMapEntries({ spec1: 'blob:1', spec2: 'blob:2' });
    expect(readInjectedMaps()).toEqual([{ spec1: 'blob:1' }, { spec2: 'blob:2' }]);
  });

  it('reports conflicting remappings loudly (first-wins is silent in the browser)', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    injectImportMapEntries({ spec1: 'blob:1' });
    injectImportMapEntries({ spec1: 'blob:another' });
    expect(consoleError).toHaveBeenCalledWith(expect.stringContaining('first-wins'));
    // the conflicting entry must not be re-injected
    expect(readInjectedMaps()).toHaveLength(1);
  });
});
