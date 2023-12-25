import { expect, it, vi } from 'vitest';
import transpileScript from '../script';

it('inline script not include sourceURL', () => {
  class MockSandbox {
    makeEvaluateFactory(source: string, sourceURL?: string): string {
      return '';
    }
  }

  const code = 'console.log("hello world")';
  const publicPath = 'http://localhost:8000';
  const scriptElement = document.createElement('script');
  scriptElement.innerHTML = code;
  const sandboxInstance = new MockSandbox();
  const makeEvaluateFactorySpy = vi.spyOn(sandboxInstance, 'makeEvaluateFactory');
  transpileScript(scriptElement, publicPath, {
    fetch: window.fetch,
    rawNode: scriptElement,
    sandbox: sandboxInstance,
  });
  expect(makeEvaluateFactorySpy).toHaveBeenCalledWith(code);
});
