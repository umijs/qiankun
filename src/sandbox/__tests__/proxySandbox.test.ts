/**
 * @author Kuitos
 * @since 2020-03-31
 */

import { isBoundedFunction } from '../../utils';
import { setProxyPropertyGetter } from '../common';
import ProxySandbox from '../proxySandbox';

beforeAll(() => {
  Object.defineProperty(window, 'mockTop', { value: window, writable: false, configurable: false, enumerable: false });
  Object.defineProperty(window, 'mockSafariTop', {
    get() {
      return window;
    },
    set() {},
    configurable: false,
    enumerable: false,
  });
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
  expect((<any>proxy).mockSafariTop).toBe(proxy);
  expect(proxy.top).toBe(proxy);
  expect(proxy.self).toBe(proxy);
  expect(proxy.window).toBe(proxy);
});

test('eval should never be represented', () => {
  const { proxy } = new ProxySandbox('eval-test');
  // @ts-ignore
  window.proxy = proxy;
  const code =
    ';(function(window){with(window){ var testProp = function(wrequire){ eval("window.testEval=wrequire()"); }; testProp(() => "kuitos");}})(window.proxy)';
  // eslint-disable-next-line no-eval
  const geval = eval;
  geval(code);

  // @ts-ignore
  expect(proxy.testEval).toBe('kuitos');
  // @ts-ignore
  expect(window.testEval).toBeUndefined();
});

test('hasOwnProperty should works well', () => {
  const { proxy } = new ProxySandbox('unit-test');

  (<any>proxy).testName = 'kuitos';
  expect((<any>proxy).testName).toBe('kuitos');
  expect((<any>window).testName).toBeUndefined();

  expect(proxy.hasOwnProperty('testName')).toBeTruthy();
  expect(window.hasOwnProperty('testName')).toBeFalsy();

  expect(Object.getOwnPropertyDescriptor(proxy, 'testName')).toEqual({
    value: 'kuitos',
    configurable: true,
    enumerable: true,
    writable: true,
  });
});

test('descriptor of non-configurable and non-enumerable property existed in raw window should be the same after modified in sandbox', () => {
  Object.defineProperty(window, 'nonConfigurableProp', { configurable: false, writable: true });
  // eslint-disable-next-line getter-return
  Object.defineProperty(window, 'nonConfigurablePropWithAccessor', { configurable: false, get() {}, set() {} });
  Object.defineProperty(window, 'enumerableProp', { enumerable: true, writable: true });
  Object.defineProperty(window, 'nonEnumerableProp', { enumerable: false, writable: true });

  const { proxy } = new ProxySandbox('unit-test');

  (<any>proxy).nonConfigurableProp = (<any>window).nonConfigurableProp;
  (<any>proxy).nonConfigurablePropWithAccessor = 123;
  expect((<any>proxy).nonConfigurablePropWithAccessor).toBe(undefined);
  expect(Object.keys(proxy)).toEqual(Object.keys(window));
  expect(Object.getOwnPropertyDescriptor(proxy, 'nonConfigurableProp')).toEqual(
    Object.getOwnPropertyDescriptor(window, 'nonConfigurableProp'),
  );

  (<any>proxy).enumerableProp = 123;
  (<any>proxy).nonEnumerableProp = 456;
  expect((<any>proxy).enumerableProp).toBe(123);
  expect((<any>proxy).nonEnumerableProp).toBe(456);
  expect(Object.keys(proxy)).toEqual(Object.keys(window));
  expect(Object.keys(proxy).includes('nonEnumerableProp')).toBeFalsy();
  expect(Object.keys(proxy).includes('enumerableProp')).toBeTruthy();
  expect(Object.getOwnPropertyDescriptor(proxy, 'nonEnumerableProp')).toEqual({
    enumerable: false,
    writable: true,
    configurable: false,
    value: 456,
  });
  expect(Object.getOwnPropertyDescriptor(window, 'nonEnumerableProp')).toEqual({
    enumerable: false,
    writable: true,
    configurable: false,
  });
});

test('property added by Object.defineProperty should works as expect', () => {
  const { proxy } = new ProxySandbox('object-define-property-test');

  let v: any;
  const descriptor = {
    get(): any {
      return v;
    },
    set(value: any) {
      v = value;
    },
  };

  Object.defineProperty(proxy, 'g_history', descriptor);
  (<any>proxy).g_history = 'window.g_history';

  expect((<any>proxy).g_history).toBe('window.g_history');

  expect('g_history' in proxy).toBeTruthy();

  expect(Object.keys(proxy)).toEqual(Object.keys(window));

  expect(Object.getOwnPropertyDescriptor(proxy, 'g_history')).toEqual({
    ...descriptor,
    configurable: false,
    enumerable: false,
  });
});

test('defineProperty should added to the target where its descriptor from', () => {
  Object.defineProperty(window, 'propertyInNativeWindow', {
    get(this: any) {
      // distinguish it from internal target or raw window with property length
      const fromProxyInternalTarget = Object.keys(this).length !== Object.keys(window).length;
      if (fromProxyInternalTarget) throw new TypeError('illegal invocation');
      return 'ifAccessByInternalTargetWillCauseIllegalInvocation';
    },
    set() {},
    configurable: true,
    enumerable: false,
  });

  // @ts-ignore
  expect(window.propertyInNativeWindow).toBe('ifAccessByInternalTargetWillCauseIllegalInvocation');

  const { proxy } = new ProxySandbox('object-define-property-target-test');
  const eventDescriptor = Object.getOwnPropertyDescriptor(proxy, 'propertyInNativeWindow');
  Object.defineProperty(proxy, 'propertyInNativeWindow', eventDescriptor!);
  expect((<any>proxy).propertyInNativeWindow).toBe('ifAccessByInternalTargetWillCauseIllegalInvocation');
});

test('hasOwnProperty should always returns same reference', () => {
  const proxy = new ProxySandbox('hasOwnProperty-test').proxy as any;
  proxy.testA = {};
  proxy.testB = {};

  expect(proxy.testA.hasOwnProperty).toBe(proxy.testB.hasOwnProperty);
});

test('property getter should just called once', () => {
  const countFn = jest.fn();
  const proxy = new ProxySandbox('property-getter-test').proxy as any;
  setProxyPropertyGetter(proxy, 'document', () => {
    countFn();
    return document;
  });

  const d1 = proxy.document;
  const d2 = proxy.document;

  expect(d1).toBe(d2);
  expect(countFn).toBeCalledTimes(1);
});

test('bounded function should not be rebounded', () => {
  const proxy = new ProxySandbox('bound-fn-test').proxy as any;
  const fn = () => {};
  const boundedFn = fn.bind(null);
  proxy.fn1 = fn;
  proxy.fn2 = boundedFn;

  expect(proxy.fn1 === fn).toBeFalsy();
  expect(proxy.fn2 === boundedFn).toBeTruthy();
  expect(isBoundedFunction(proxy.fn1)).toBeTruthy();
});

test('some native window property was defined with getter in safari and firefox, and they will check the caller source', () => {
  Object.defineProperty(window, 'mockSafariGetterProperty', {
    get(this: Window) {
      // distinguish it from internal target or raw window with property length
      const fromProxyInternalTarget = Object.keys(this).length !== Object.keys(window).length;
      if (fromProxyInternalTarget) {
        throw new TypeError('The Window.mockSafariGetterProperty getter can only be used on instances of Window');
      }
      return 'getterPropertyInSafariWindow';
    },
    set() {},
    configurable: false,
    enumerable: false,
  });

  expect((<any>window).mockSafariGetterProperty).toBe('getterPropertyInSafariWindow');

  const { proxy } = new ProxySandbox('object-define-property-target-test');
  expect((<any>proxy).mockSafariGetterProperty).toBe('getterPropertyInSafariWindow');
});
