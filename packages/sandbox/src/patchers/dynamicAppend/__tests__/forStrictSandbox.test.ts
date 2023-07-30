import { SandBoxType } from '../../../../interfaces';
import { noop } from 'lodash';
import { patchStandardSandbox } from '../forStrictSandbox';

vi.mock('import-html-entry', () => ({
  default: {
    execScripts: vi.fn(),
  }
}));

describe('forStrictSandbox test', () => {
  const {
    prototype: { createTreeWalker: originalCreateTreeWalker },
  } = Document;

  beforeAll(() => {
    Document.prototype.createTreeWalker = function createTreeWalker(
      this: Document,
      root: Node,
      whatToShow?: number | undefined,
      filter?: NodeFilter | null | undefined,
    ) {
      if (document !== root) {
        throw new TypeError('error');
      }
      return originalCreateTreeWalker.call(this, root, whatToShow, filter);
    };
  });

  afterAll(() => {
    Document.prototype.createTreeWalker = originalCreateTreeWalker;
  });

  it('should not throw on patched document', () => {
    let patchedDocument!: Document;
    const appName = 'test-app';
    const wrapper = document.createElement('div');
    const sandbox = {
      name: appName,
      type: SandBoxType.Proxy,
      proxy: window,
      sandboxRunning: true,
      latestSetProp: null,
      patchDocument: (patched: Document) => {
        patchedDocument = patched;
      },
      active: noop,
      inactive: noop,
    };
    patchStandardSandbox(appName, () => wrapper, sandbox, true, false, undefined, true);

    expect(patchedDocument).toBeDefined();
    expect(() => patchedDocument?.createTreeWalker(patchedDocument)).not.toThrow();
  });
});
