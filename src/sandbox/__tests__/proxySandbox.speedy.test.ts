import ProxySandbox from '../proxySandbox';

it('should never throw errors although globalThis is unavailable in current global context', () => {
  const { proxy } = new ProxySandbox('globalThis-always-available');
  // @ts-ignore
  window.proxy = proxy;

  expect('mockGlobalThis' in window).toBe(false);
  expect('mockGlobalThis' in proxy).toBe(true);

  const code = `(function() {
    with (window.proxy) {
      (function(mockGlobalThis){
        mockGlobalThis.testName = 'kuitos';
      })(mockGlobalThis);
    }
  })()`;
  // eslint-disable-next-line no-eval
  const geval = eval;
  geval(code);

  // @ts-ignore
  expect(proxy.testName).toBe('kuitos');
  // @ts-ignore
  expect(window.testName).toBeUndefined();
});

it('should throw errors while variable not existed in current global context', () => {
  const { proxy } = new ProxySandbox('invalid-throw-error');
  // @ts-ignore
  window.proxy = proxy;

  expect('invalidVariable' in window).toBe(false);
  expect('invalidVariable' in proxy).toBe(false);

  const code = `(function() {
    with (window.proxy) {
      (function(mockGlobalThis){
        (0, invalidVariable);
      })(mockGlobalThis);
    }
  })()`;
  // eslint-disable-next-line no-eval
  const geval = eval;
  try {
    geval(code);
  } catch (e: any) {
    expect(e.message).toBe('invalidVariable is not defined');
  }
});

it('should never hijack native method of Object.prototype', () => {
  const { proxy } = new ProxySandbox('native-object-method');
  // @ts-ignore
  window.proxy = proxy;

  const code = `(function() {
    with (window.proxy) {
      (function(mockGlobalThis){
        window.nativeHasOwnCheckResult = hasOwnProperty.call({nativeHas: 123}, 'nativeHas');
        window.proxyHasOwnCheck = window.hasOwnProperty.call({nativeHas: '123'}, 'nativeHas');
        window.selfCheck = window.hasOwnProperty('nativeHasOwnCheckResult');
      })(mockGlobalThis);
    }
  })()`;
  // eslint-disable-next-line no-eval
  const geval = eval;
  geval(code);
  expect(window.proxy.nativeHasOwnCheckResult).toBeTruthy();
  expect(window.proxy.proxyHasOwnCheck).toBeFalsy();
  expect(window.proxy.selfCheck).toBeTruthy();
});
