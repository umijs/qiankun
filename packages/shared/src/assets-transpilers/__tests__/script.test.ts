import { expect, it, vi } from 'vitest';
import transpileScript from '../script';

it('inline script not include sourceURL', () => {
  const code = 'console.log("hello world")';
  const publicPath = 'http://localhost:8000';
  const scriptElement = document.createElement('script');
  scriptElement.innerHTML = code;
  const classicScriptTransformer = vi.fn(() => '');
  transpileScript(scriptElement, publicPath, {
    classicScriptTransformer,
    compartment: {} as never,
    fetch: window.fetch,
    rawNode: scriptElement,
  });
  expect(classicScriptTransformer).toHaveBeenCalledWith(code);
});
