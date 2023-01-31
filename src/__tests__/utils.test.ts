import { version } from '../../package.json';
import {
  Deferred,
  genAppInstanceIdByName,
  getContainerXPath,
  getDefaultTplWrapper,
  getWrapperId,
  getXPathForElement,
  isPropertyFrozen,
  nextTask,
  sleep,
  validateExportLifecycle,
} from '../utils';

it('should wrap the id [1]', () => {
  const id = 'REACT16';

  expect(getWrapperId(id)).toBe(`__qiankun_microapp_wrapper_for_${'react_16'}__`);
});

it('should wrap the id [2]', () => {
  const id = 'react16';

  expect(getWrapperId(id)).toBe('__qiankun_microapp_wrapper_for_react_16__');
});

it('should wrap string with div', () => {
  const tpl = '<span>qiankun</span>';
  const factory = getDefaultTplWrapper('react16', { speedy: true });

  const ret = factory(tpl);

  expect(ret).toBe(
    // eslint-disable-next-line max-len
    `<div id="__qiankun_microapp_wrapper_for_react_16__" data-name="react16" data-version="${version}" data-sandbox-cfg={\"speedy\":true}><qiankun-head></qiankun-head>${tpl}</div>`,
  );
});

it('should be able to validate lifecycle', () => {
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

it('Deferred should worked [1]', async () => {
  const inst = new Deferred();

  setTimeout(() => {
    inst.resolve(1);
  });
  const ret = await inst.promise;

  expect(ret).toBe(1);
});

it('Deferred should worked [2]', async () => {
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

it('should getContainerXPath work well', () => {
  const article = document.createElement('article');
  article.innerHTML = `
    <div>
      <div></div>
      <div id="testNode"></div>
      <div></div>
    </div>
  `;

  document.body.appendChild(article);
  // const testNode = document.querySelector('#testNode');
  const xpath = getContainerXPath('#testNode');
  expect(xpath).toEqual(
    // eslint-disable-next-line max-len
    `/*[name()='HTML']/*[name()='BODY'][1]/*[name()='ARTICLE'][1]/*[name()='DIV'][1]/*[name()='DIV'][2]`,
  );
  const testNode2 = document.createElement('div');
  testNode2.innerHTML = `
      <div id="testNode2"></div>
  `;

  document.body.appendChild(testNode2);
  const xpath1 = getContainerXPath(testNode2);

  expect(xpath1).toEqual(
    // eslint-disable-next-line max-len
    `/*[name()='HTML']/*[name()='BODY'][1]/*[name()='DIV'][1]`,
  );

  const xpath2 = getContainerXPath(undefined);
  expect(xpath2).toBeUndefined();
});

it('should getXPathForElement work well', () => {
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

it('should genAppInstanceIdByName work well', () => {
  const instanceId1 = genAppInstanceIdByName('hello');
  expect(instanceId1).toBe('hello');

  const instanceId2 = genAppInstanceIdByName('hello');
  expect(instanceId2).toBe('hello_1');

  const instanceId3 = genAppInstanceIdByName('hello');
  expect(instanceId3).toBe('hello_2');
});

it('should isPropertyFrozen work well', () => {
  const a = {
    get name() {
      return 'read only';
    },
  };
  expect(isPropertyFrozen(a, 'name')).toBeFalsy();

  const b = {
    get name() {
      return 'read only';
    },
    set name(_) {},
  };
  expect(isPropertyFrozen(b, 'name')).toBeFalsy();

  const c = {};
  Object.defineProperty(c, 'name', { writable: false });
  expect(isPropertyFrozen(c, 'name')).toBeTruthy();

  const d = {};
  Object.defineProperty(d, 'name', { configurable: true });
  expect(isPropertyFrozen(d, 'name')).toBeFalsy();

  const e = {};
  Object.defineProperty(e, 'name', { configurable: false });
  expect(isPropertyFrozen(e, 'name')).toBeTruthy();

  const f = {};
  Object.defineProperty(f, 'name', {
    get() {
      return 'test';
    },
    configurable: false,
  });
  expect(isPropertyFrozen(f, 'name')).toBeTruthy();

  expect(isPropertyFrozen(undefined, 'name')).toBeFalsy();
});
