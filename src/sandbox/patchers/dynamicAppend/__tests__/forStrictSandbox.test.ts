import {
  elementAttachContainerConfigMap,
  proxyAttachContainerConfigMap,
  patchDocumentCreateElement,
  patchDOMParserParseFromString,
} from '../forStrictSandbox';

jest.mock('import-html-entry', () => ({
  execScripts: jest.fn(),
}));

const test1Config = {};
proxyAttachContainerConfigMap.set(test1Config as any, { config: '111' } as any);
jest.mock('../../../common', () => ({
  getCurrentRunningSandboxProxy: () => {
    return test1Config;
  },
}));

test('patchDocumentCreateElement should put elements into elementAttachContainerConfigMap', () => {
  const rawDocumentCreateElement = Document.prototype.createElement;
  const unpatchDocumentCreate = patchDocumentCreateElement();
  expect(Document.prototype.createElement === rawDocumentCreateElement).toEqual(false);

  const div1 = document.createElement('div');
  div1.innerHTML = '<style id="style-under-test"></style><style id="style-under-test"></style>';
  expect(elementAttachContainerConfigMap.has(div1.children[0] as HTMLElement)).toEqual(true);
  expect(elementAttachContainerConfigMap.has(div1.children[1] as HTMLElement)).toEqual(true);

  unpatchDocumentCreate();
  expect(Document.prototype.createElement === rawDocumentCreateElement).toEqual(true);
});

test('patchDOMParserParseFromString should put elements into elementAttachContainerConfigMap', () => {
  const rawDOMParserParseFromString = DOMParser.prototype.parseFromString;
  const unpatchDOMParserParseFromString = patchDOMParserParseFromString();

  const domparser = new DOMParser();
  const doc1 = domparser.parseFromString(
    '<style id="style-under-test"></style><style id="style-under-test"></style>',
    'text/html',
  );
  expect(elementAttachContainerConfigMap.has(doc1.head.children[0] as HTMLElement)).toEqual(true);
  expect(elementAttachContainerConfigMap.has(doc1.head.children[1] as HTMLElement)).toEqual(true);

  unpatchDOMParserParseFromString();
  expect(DOMParser.prototype.parseFromString === rawDOMParserParseFromString).toEqual(true);
});
