/**
 * @author Kuitos
 * @since 2020-03-31
 */

import { isBoundedFunction } from '../../utils';
import { getCurrentRunningApp } from '../common';
import ProxySandbox from '../proxySandbox';

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window extends Record<string, any> {
    nonEnumerableValue: string;
  }
}

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
  Object.defineProperty(window, 'nonEnumerableValue', {
    enumerable: false,
    value: 1,
    writable: true,
    configurable: true,
  });

  const { proxy } = new ProxySandbox('unit-test');
  expect(Object.keys(proxy)).toEqual(Object.keys(window));
  expect(Object.getOwnPropertyNames(proxy)).toEqual(Object.getOwnPropertyNames(window));

  proxy.nonEnumerableValue = window.nonEnumerableValue;
  proxy.parseFloat = window.parseFloat;

  // test the iterator order
  const sandboxKeys = [];
  // @ts-ignore
  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const p in proxy) {
    sandboxKeys.push(p);
  }
  const rawWindowKeys = [];
  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const p in window) {
    rawWindowKeys.push(p);
  }
  expect(sandboxKeys).toEqual(rawWindowKeys);

  proxy.additionalProp = 'kuitos';
  expect(Object.keys(proxy)).toEqual([...Object.keys(window), 'additionalProp']);
});

test('window.self & window.window & window.top & window.parent should equals with sandbox', () => {
  const { proxy } = new ProxySandbox('unit-test');

  expect(proxy.self).toBe(proxy);
  expect(proxy.window).toBe(proxy);

  expect(proxy.mockTop).toBe(proxy);
  expect(proxy.mockSafariTop).toBe(proxy);
  expect(proxy.top).toBe(proxy);
  expect(proxy.parent).toBe(proxy);
});

test('globalThis should equals with sandbox', () => {
  const { proxy } = new ProxySandbox('globalThis');
  expect(proxy.globalThis).toBe(proxy);
});

test('allow window.top & window.parent to escape sandbox while in iframe', () => {
  // change window.parent to cheat ProxySandbox is in iframe
  Object.defineProperty(window, 'parent', { value: 'parent' });
  Object.defineProperty(window, 'top', { value: 'top' });
  const { proxy } = new ProxySandbox('iframe-test');

  expect(proxy.top).toBe('top');
  expect(proxy.parent).toBe('parent');
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

  proxy.testName = 'kuitos';
  expect(proxy.testName).toBe('kuitos');
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
  Object.defineProperty(window, 'nonConfigurablePropWithAccessor', {
    configurable: false,
    get() {},
    set() {},
  });
  Object.defineProperty(window, 'enumerableProp', { enumerable: true, writable: true });
  Object.defineProperty(window, 'nonEnumerableProp', { enumerable: false, writable: true });

  const { proxy } = new ProxySandbox('unit-test');

  proxy.nonConfigurableProp = (<any>window).nonConfigurableProp;
  proxy.nonConfigurablePropWithAccessor = 123;
  expect(proxy.nonConfigurablePropWithAccessor).toBe(undefined);
  expect(Object.keys(proxy)).toEqual(Object.keys(window));
  expect(Object.getOwnPropertyDescriptor(proxy, 'nonConfigurableProp')).toEqual(
    Object.getOwnPropertyDescriptor(window, 'nonConfigurableProp'),
  );

  proxy.enumerableProp = 123;
  proxy.nonEnumerableProp = 456;
  expect(proxy.enumerableProp).toBe(123);
  expect(proxy.nonEnumerableProp).toBe(456);
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

test('A property cannot be reported as non-configurable, if it does not exists as an own property of the target object', () => {
  const { proxy } = new ProxySandbox('non-configurable');
  Object.defineProperty(window, 'nonConfigurablePropAfterSandboxCreated', { value: 'test', configurable: false });
  const descriptor = Object.getOwnPropertyDescriptor(proxy, 'nonConfigurablePropAfterSandboxCreated');
  expect(descriptor?.configurable).toBeTruthy();
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
  proxy.g_history = 'window.g_history';

  expect(proxy.g_history).toBe('window.g_history');

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
  expect(proxy.propertyInNativeWindow).toBe('ifAccessByInternalTargetWillCauseIllegalInvocation');
});

test('hasOwnProperty should always returns same reference', () => {
  const proxy = new ProxySandbox('hasOwnProperty-test').proxy as any;
  proxy.testA = {};
  proxy.testB = {};

  expect(proxy.testA.hasOwnProperty).toBe(proxy.testB.hasOwnProperty);
});

test('document and eval accessing should modify the attachDocProxySymbol value every time', () => {
  const proxy1 = new ProxySandbox('doc-access-test1').proxy;
  const proxy2 = new ProxySandbox('doc-access-test2').proxy;
  const proxy3 = new ProxySandbox('eval-access-test1').proxy;
  const proxy4 = new ProxySandbox('eval-access-test2').proxy;

  const d1 = proxy1.document;
  expect(getCurrentRunningApp()?.window).toBe(proxy1);
  expect(getCurrentRunningApp()?.name).toBe('doc-access-test1');
  const d2 = proxy2.document;
  expect(getCurrentRunningApp()?.window).toBe(proxy2);
  expect(getCurrentRunningApp()?.name).toBe('doc-access-test2');

  expect(d1).toBe(d2);
  expect(d1).toBe(document);

  const eval1 = proxy3.eval;
  expect(getCurrentRunningApp()?.window).toBe(proxy3);
  expect(getCurrentRunningApp()?.name).toBe('eval-access-test1');
  const eval2 = proxy4.eval;
  expect(getCurrentRunningApp()?.window).toBe(proxy4);
  expect(getCurrentRunningApp()?.name).toBe('eval-access-test2');

  expect(eval1).toBe(eval2);
  // eslint-disable-next-line no-eval
  expect(eval1).toBe(eval);
});

test('document attachDocProxySymbol mark should be remove before next task', (done) => {
  const { proxy } = new ProxySandbox('doc-symbol');
  // just access
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const d1 = proxy.document;
  expect(getCurrentRunningApp()?.window).toBe(proxy);
  expect(getCurrentRunningApp()?.name).toBe('doc-symbol');

  setTimeout(() => {
    expect(getCurrentRunningApp()).toBeNull();
    done();
  });
});

test('document should work well with MutationObserver', (done) => {
  const docProxy = new ProxySandbox('doc').proxy;

  const observer = new MutationObserver((mutations) => {
    if (mutations[0]) {
      expect(mutations[0].target).toBe(document.body);
      observer.disconnect();
      done();
    }
  });

  observer.observe(docProxy.document, {
    attributes: true,
    subtree: true,
    childList: true,
  });

  docProxy.document.body.innerHTML = '<div></div>';
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

test('the prototype should be kept while we create a function with prototype on proxy', () => {
  const proxy = new ProxySandbox('new-function').proxy as any;

  function test() {}

  proxy.fn = test;
  expect(proxy.fn === test).toBeFalsy();
  expect(proxy.fn.prototype).toBe(test.prototype);
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
  expect(proxy.mockSafariGetterProperty).toBe('getterPropertyInSafariWindow');
});

test('falsy values should return as expected', () => {
  const { proxy } = new ProxySandbox('falsy-value-test');
  proxy.falsevar = false;
  proxy.nullvar = null;
  proxy.zero = 0;
  expect(proxy.falsevar).toBe(false);
  expect(proxy.nullvar).toBeNull();
  expect(proxy.zero).toBe(0);
});

it('should return true while [[GetPrototypeOf]] invoked by proxy object', () => {
  // window.__proto__ not equals window prototype in jest environment
  // eslint-disable-next-line no-proto
  expect(window.__proto__ === Object.getPrototypeOf(window)).toBeFalsy();
  // we must to set the prototype of window as jest modified window `__proto__` property but not changed it internal [[Prototype]] property
  // eslint-disable-next-line no-proto
  Object.setPrototypeOf(window, window.__proto__);

  const { proxy } = new ProxySandbox('window-prototype');
  expect(proxy instanceof Window).toBeTruthy();
  expect(Object.getPrototypeOf(proxy)).toBe(Object.getPrototypeOf(window));
  expect(Reflect.getPrototypeOf(proxy)).toBe(Reflect.getPrototypeOf(window));
  expect(Reflect.getPrototypeOf(proxy)).toBe(Object.getPrototypeOf(window));
});

it('should get current running sandbox proxy correctly', async () => {
  const { proxy } = new ProxySandbox('running');

  await Promise.resolve().then(() => {
    expect(getCurrentRunningApp()).toBeNull();
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const unused = proxy.accessing;
    expect(getCurrentRunningApp()?.window).toBe(proxy);
    expect(getCurrentRunningApp()?.name).toBe('running');
  });
});

it('native window function calling should always be bound with window', () => {
  window.nativeWindowFunction = function nativeWindowFunction(this: any) {
    if (this !== undefined && this !== window) {
      throw new Error('Illegal Invocation!');
    }

    return 'success';
  };

  const { proxy } = new ProxySandbox('mustBeBoundWithWindowReference');
  expect(proxy.nativeWindowFunction()).toBe('success');
});
