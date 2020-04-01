/**
 * @author Kuitos
 * @since 2020-03-31
 */

import ProxySandbox from '../proxySandbox';

beforeAll(() => {
  Object.defineProperty(window, 'mockTop', { value: window, writable: false, configurable: false, enumerable: false });
});

test('iterator should be worked the same as the raw window', () => {
  const { proxy } = new ProxySandbox('unit-test');
  expect(Object.keys(proxy)).toEqual(Object.keys(window));
  expect(Object.getOwnPropertyNames(proxy)).toEqual(Object.getOwnPropertyNames(window));

  // test the iterator order
  const sandboxKeys = [];
  // @ts-ignore
  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const p in proxy) {
    sandboxKeys.push(p);
  }
  const rawKeys = [];
  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const p in window) {
    rawKeys.push(p);
  }
  expect(sandboxKeys).toEqual(rawKeys);

  (<any>proxy).additionalProp = 'kuitos';
  expect(Object.keys(proxy)).toEqual([...Object.keys(window), 'additionalProp']);
});

test('window.top & window.self & window.window should equals with sandbox', () => {
  const { proxy } = new ProxySandbox('unit-test');

  expect((<any>proxy).mockTop).toBe(proxy);
  expect(proxy.top).toBe(proxy);
  expect(proxy.self).toBe(proxy);
  expect(proxy.window).toBe(proxy);
});

test('hasOwnProperty should work well', () => {
  const { proxy } = new ProxySandbox('unit-test');

  (<any>proxy).testName = 'kuitos';
  expect((<any>proxy).testName).toBe('kuitos');
  expect((<any>window).testName).toBeUndefined();

  expect(proxy.hasOwnProperty('testName')).toBeTruthy();
  expect(window.hasOwnProperty('testName')).toBeFalsy();
});

test('non-configurable property should get correctly from sandbox', () => {
  Object.defineProperty(window, 'nonConfigurableProp', { configurable: false, writable: true });
  // eslint-disable-next-line getter-return
  Object.defineProperty(window, 'nonConfigurablePropWithAccessor', { configurable: false, get() {}, set() {} });

  const { proxy } = new ProxySandbox('unit-test');

  (<any>proxy).nonConfigurableProp = (<any>window).nonConfigurableProp;
  (<any>proxy).nonConfigurablePropWithAccessor = 123;
  expect((<any>proxy).nonConfigurablePropWithAccessor).toBe(123);
  expect(Object.keys(proxy)).toEqual(Object.keys(window));
  expect(Object.getOwnPropertyDescriptor(proxy, 'nonConfigurableProp')).toEqual(
    Object.getOwnPropertyDescriptor(window, 'nonConfigurableProp'),
  );
});
