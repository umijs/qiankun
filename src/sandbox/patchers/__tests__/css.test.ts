/**
 * @author Saviio
 * @since 2020-04-19
 */

import { processor as CSSProcessor } from '../css';
import { sleep } from '../../../utils';

const fakeStyleNode = (css: string) => {
  const styleNode = document.createElement('style');
  const textNode = document.createTextNode(css);

  styleNode.appendChild(textNode);
  document.body.append(styleNode);

  return styleNode;
};

const removeWs = (s: string | null) => {
  if (s == null) {
    return s;
  }

  const re = /\s/g;
  return s.replace(re, '');
};

test('should add attribute selector correctly', () => {
  const actualValue = '.react15-main {display: flex; flex-direction: column; align-items: center;}';
  const expectValue =
    'div[data-qiankun=react15] .react15-main {display: flex; flex-direction: column; align-items: center;}';

  const styleNode = fakeStyleNode(actualValue);
  CSSProcessor.process(styleNode, 'div[data-qiankun=react15]');

  expect(removeWs(styleNode.textContent)).toBe(removeWs(expectValue));
});

test('should add attribute selector correctly [2]', async () => {
  const actualValue = '.react15-main {display: flex; flex-direction: column; align-items: center;}';
  const expectValue =
    'div[data-qiankun=react15] .react15-main {display: flex; flex-direction: column; align-items: center;}';

  const styleNode = fakeStyleNode('');
  CSSProcessor.process(styleNode, 'div[data-qiankun=react15]');

  const textNode = document.createTextNode(actualValue);
  styleNode.appendChild(textNode);

  await sleep(10);

  expect(removeWs(styleNode.textContent)).toBe(removeWs(expectValue));
});

test('should replace html correctly', () => {
  const actualValue = 'html {font-size: 14px;}';
  const expectValue = 'div[data-qiankun=react15] {font-size: 14px;}';

  const styleNode = fakeStyleNode(actualValue);
  CSSProcessor.process(styleNode, 'div[data-qiankun=react15]');

  expect(removeWs(styleNode.textContent)).toBe(removeWs(expectValue));
});

test('should replace body correctly', () => {
  const actualValue = 'body {font-size: 14px;}';
  const expectValue = 'div[data-qiankun=react15] {font-size: 14px;}';

  const styleNode = fakeStyleNode(actualValue);
  CSSProcessor.process(styleNode, 'div[data-qiankun=react15]');

  expect(removeWs(styleNode.textContent)).toBe(removeWs(expectValue));
});

test('should transform @supports', () => {
  const actualValue = '@supports (display: grid) {div{margin: 1cm;}}';
  const expectValue = '@supports (display: grid) {div[data-qiankun=react15] div {margin: 1cm;}}';

  const styleNode = fakeStyleNode(actualValue);
  CSSProcessor.process(styleNode, 'div[data-qiankun=react15]');

  expect(removeWs(styleNode.textContent)).toBe(removeWs(expectValue));
});

test('should not transform @keyframes', () => {
  const actualValue = '@keyframes move {from {top: 0px;}to {top: 200px;}}';
  const expectValue = '@keyframes move {from {top: 0px;}to {top: 200px;}}';

  const styleNode = fakeStyleNode(actualValue);
  CSSProcessor.process(styleNode, 'div[data-qiankun=react15]');

  expect(removeWs(styleNode.textContent)).toBe(removeWs(expectValue));
});

test('should not transform @font-face', () => {
  const actualValue = '@font-face {font-family: "Open Sans";}';
  const expectValue = '@font-face {font-family: "Open Sans";}';

  const styleNode = fakeStyleNode(actualValue);
  CSSProcessor.process(styleNode, 'div[data-qiankun=react15]');

  expect(removeWs(styleNode.textContent)).toBe(removeWs(expectValue));
});

// jest cannot handle @page directive correctly
test.skip('should not transform @page', () => {
  const actualValue = '@page {margin: 1cm;}';
  const expectValue = '@page {margin: 1cm;}';

  const styleNode = fakeStyleNode(actualValue);
  CSSProcessor.process(styleNode, 'div[data-qiankun=react15]');

  expect(removeWs(styleNode.textContent)).toBe(removeWs(expectValue));
});

// jest cannot handle @import directive correctly
test.skip('should not transform @import', () => {
  const actualValue = "@import 'custom.css'";
  const expectValue = "@import 'custom.css'";

  const styleNode = fakeStyleNode(actualValue);
  CSSProcessor.process(styleNode, 'div[data-qiankun=react15]');

  expect(removeWs(styleNode.textContent)).toBe(removeWs(expectValue));
});

// jest cannot handle @media directive correctly
test.skip('should transform @media', () => {
  const actualValue = '@media screen and (max-width: 300px) {div{margin: 1cm;}}';
  const expectValue = '@media screen and (max-width: 300px) {div[data-qiankun=react15] div {margin: 1cm;}}';

  const styleNode = fakeStyleNode(actualValue);
  CSSProcessor.process(styleNode, 'div[data-qiankun=react15]');

  expect(removeWs(styleNode.textContent)).toBe(removeWs(expectValue));
});
