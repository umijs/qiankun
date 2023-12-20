import { expect, it } from 'vitest';
import transpileScript from '../script';

it('inline script not include sourceURL', () => {
  class MockSandbox {
    id = 'testApp';
    constantIntrinsicNames = [];
    makeEvaluateFactory(source: string, sourceURL?: string): string {
      const sourceMapURL = sourceURL ? `//# sourceURL=${sourceURL}\n` : '';
      const globalObjectOptimizer = this.constantIntrinsicNames.length
        ? `const {${this.constantIntrinsicNames.join(',')}} = this;`
        : '';
      // eslint-disable-next-line max-len
      return `;(function(){with(this){${globalObjectOptimizer}${source}\n${sourceMapURL}}}).bind(window.${this.id})();`;
    }
  }

  const scriptElement = document.createElement('script');
  scriptElement.innerHTML = 'console.log("hello world")';
  const sandboxInstance = new MockSandbox();
  const publicPath = 'http://localhost:8000';
  const transpiledScriptElement = transpileScript(scriptElement, publicPath, {
    fetch: window.fetch,
    rawNode: scriptElement,
    sandbox: sandboxInstance,
  });
  expect(transpiledScriptElement.innerHTML).toEqual(expect.not.stringContaining(`//# sourceURL=${publicPath}`));
});
