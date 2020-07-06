import { getWrapperId, getDefaultTplWrapper, validateExportLifecycle, sleep, Deferred } from '../../utils';

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
  const factory = getDefaultTplWrapper('react16');

  const ret = factory(tpl);

  expect(ret).toBe(`<div id="__qiankun_microapp_wrapper_for_react_16__">${tpl}</div>`);
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

test('should be able to suspend', async () => {
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
