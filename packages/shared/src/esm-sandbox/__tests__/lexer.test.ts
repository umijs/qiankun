import { describe, expect, it, vi } from 'vitest';
import { parseModuleSyntax, prepareEsmLexer } from '../lexer';

describe('CSP-safe module lexer', () => {
  it('decodes escaped static specifiers without eval', async () => {
    const evalSpy = vi.spyOn(globalThis, 'eval').mockImplementation(() => {
      throw new EvalError('unsafe-eval is disabled');
    });

    try {
      await prepareEsmLexer();
      const [imports] = parseModuleSyntax(String.raw`import './\u0064ep.js';`);

      expect(imports[0]?.n).toBe('./dep.js');
      expect(evalSpy).not.toHaveBeenCalled();
    } finally {
      evalSpy.mockRestore();
    }
  });
});
