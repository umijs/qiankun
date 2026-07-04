import { describe, expect, it } from 'vitest';
import { scanReferencedGlobals } from '../identifier-scan';

const baseSet = new Set(['window', 'document', 'console', 'history', 'location', 'fetch']);

describe('scanReferencedGlobals', () => {
  it('collects referenced globals as full tokens', () => {
    const source = `
      console.log(window.foo);
      document.title = 'x';
    `;
    expect(scanReferencedGlobals(source, baseSet).sort()).toEqual(['console', 'document', 'window']);
  });

  it('never misses a bare reference (superset safety)', () => {
    const source = `history.pushState({}, '', '/next')`;
    expect(scanReferencedGlobals(source, baseSet)).toContain('history');
  });

  it('does not match partial identifiers', () => {
    const source = `const windowSize = 1; myDocument.foo();`;
    expect(scanReferencedGlobals(source, baseSet)).toEqual([]);
  });

  it('hits inside strings/comments are allowed (harmless superset)', () => {
    const source = `// window is mentioned here\nconst a = 'document';`;
    const result = scanReferencedGlobals(source, baseSet);
    expect(result).toContain('window');
    expect(result).toContain('document');
  });
});
