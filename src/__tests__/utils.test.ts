import {
  Deferred,
  getDefaultTplWrapper,
  getWrapperId,
  getXPathForElement,
  nextTask,
  sleep,
  validateExportLifecycle,
} from '../utils';
import { version } from '../../package.json';

test('should wrap the id [1]', () => {
  const id = 'REACT16';

  expect(getWrapperId(id)).toBe(`__qiankun_microapp_wrapper_for_${'react_16'}__`);
});

test('should wrap the id [2]', () => {
  const id = 'react16';

  expect(getWrapperId(id)).toBe('__qiankun_microapp_wrapper_for_react_16__');
});

test('should wrap string with div', () => {
  const tpl = '<span>qiankun</span>';
  const factory = getDefaultTplWrapper('react16', 'react16');

  const ret = factory(tpl);

  expect(ret).toBe(
    `<div id="__qiankun_microapp_wrapper_for_react_16__" data-name="react16" data-version="${version}">${tpl}</div>`,
  );
});

test('should be able to validate lifecycle', () => {
  const noop = () => undefined;

  const export1 = {
    bootstrap: noop,
    mount: noop,
    unmount: noop,
  };
  expect(validateExportLifecycle(export1)).toBeTruthy();

  const export2 = {
    bootstrap: noop,
  };
  expect(validateExportLifecycle(export2)).toBeFalsy();

  const export3 = {};
  expect(validateExportLifecycle(export3)).toBeFalsy();

  const export4 = {
    bootstrap: true,
    mount: 1,
    unmount: 'noop',
  };
  expect(validateExportLifecycle(export4)).toBeFalsy();
});

// ci 容易挂
test.skip('should be able to suspend', async () => {
  const start = new Date().getTime();
  await sleep(10);

  const end = new Date().getTime();

  const diff = end - start;
  expect(diff >= 10).toBeTruthy();
});

test('Deferred should worked [1]', async () => {
  const inst = new Deferred();

  setTimeout(() => {
    inst.resolve(1);
  });
  const ret = await inst.promise;

  expect(ret).toBe(1);
});

test('Deferred should worked [2]', async () => {
  const inst = new Deferred();

  setTimeout(() => {
    inst.reject(new Error());
  });

  let err = null;

  try {
    await inst.promise;
  } catch (e) {
    err = e;
  }

  expect(err).toBeInstanceOf(Error);
});

test('should getXPathForElement work well', () => {
  const article = document.createElement('article');
  article.innerHTML = `
    <div>
      <div></div>
      <div id="testNode"></div>
      <div></div>
    </div>
  `;

  document.body.appendChild(article);
  const testNode = document.querySelector('#testNode');
  const xpath = getXPathForElement(testNode!, document);
  expect(xpath).toEqual(
    // eslint-disable-next-line max-len
    `/*[name()='HTML']/*[name()='BODY'][1]/*[name()='ARTICLE'][1]/*[name()='DIV'][1]/*[name()='DIV'][2]`,
  );

  const virtualDOM = document.createElement('div');
  const xpath1 = getXPathForElement(virtualDOM, document);
  expect(xpath1).toBeUndefined();
});

it('should nextTick just executed once in one task context', async () => {
  let counter = 0;
  nextTask(() => ++counter);
  nextTask(() => ++counter);
  nextTask(() => ++counter);
  nextTask(() => ++counter);
  await sleep(0);
  expect(counter).toBe(1);

  await sleep(0);
  nextTask(() => ++counter);
  await sleep(0);
  nextTask(() => ++counter);
  await sleep(0);
  expect(counter).toBe(3);
});
