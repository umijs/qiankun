import { rebuildCSSRules, recordStyledComponentsCSSRules, getStyledElementCSSRules } from '../common';

jest.mock('import-html-entry', () => ({
  execScripts: jest.fn(),
}));

const cssRuleText1 = '#foo { color: red; }';
const cssRuleText2 = 'span { font-weight: bold; }';

const createStyleElement = () => {
  document.body.innerHTML = '<style id="style-under-test"></style>';
  return document.getElementById('style-under-test') as HTMLStyleElement;
};

beforeEach(() => {
  document.body.innerHTML = '';
});

test('should record Styled-Component CSS Rules correctly', () => {
  const styleElement = createStyleElement();
  const cssStyleSheet = styleElement.sheet;
  cssStyleSheet?.insertRule(cssRuleText1);
  cssStyleSheet?.insertRule(cssRuleText2);

  recordStyledComponentsCSSRules([styleElement]);

  const cssRules: CSSRuleList | undefined = getStyledElementCSSRules(styleElement);
  expect(cssRules).toBeDefined();
  expect(cssRules?.length).toEqual(2);
  expect((cssStyleSheet?.cssRules[0] as CSSStyleRule).selectorText).toEqual('span');
  expect((cssStyleSheet?.cssRules[1] as CSSStyleRule).selectorText).toEqual('#foo');
});

test('should rebuild Styled-Component CSS Rules in the correct order', () => {
  const styleElement = createStyleElement();
  const cssStyleSheet = styleElement.sheet;
  cssStyleSheet?.insertRule(cssRuleText1);
  cssStyleSheet?.insertRule(cssRuleText2);

  recordStyledComponentsCSSRules([styleElement]);

  expect((cssStyleSheet?.cssRules[0] as CSSStyleRule).selectorText).toEqual('span');
  expect((cssStyleSheet?.cssRules[1] as CSSStyleRule).selectorText).toEqual('#foo');

  // Set sheet to be writiable so we can overwrite the value for sheet
  Object.defineProperty(window.HTMLStyleElement.prototype, 'sheet', {
    writable: true,
    value: {},
  });
  // @ts-ignore
  styleElement.sheet = new CSSStyleSheet();
  rebuildCSSRules([styleElement], () => true);

  expect(styleElement.sheet.cssRules.length).toEqual(2);
  // Verify that the order of the styles is the same as the recorded ones
  expect((cssStyleSheet?.cssRules[0] as CSSStyleRule).selectorText).toEqual('span');
  expect((cssStyleSheet?.cssRules[1] as CSSStyleRule).selectorText).toEqual('#foo');
});
