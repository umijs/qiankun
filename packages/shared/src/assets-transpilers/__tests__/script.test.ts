import { expect, it } from 'vitest';
import transpileScript from '../script';
import { StandardSandbox } from '../../../../sandbox/src/core/sandbox/StandardSandbox';

it('inline script not include sourceURL', () => {
  const scriptElement = document.createElement('script');
  scriptElement.innerHTML = 'console.log("hello world")';
  const sandboxInstance = new StandardSandbox("app", {});
  const publicPath = 'http://localhost:8000';
  const transpiledScriptElement = transpileScript(scriptElement, publicPath, {fetch: window.fetch, rawNode: scriptElement, sandbox: sandboxInstance});
  expect(transpiledScriptElement.innerHTML).toEqual(expect.not.stringContaining(`//# sourceURL=${publicPath}`));
});
