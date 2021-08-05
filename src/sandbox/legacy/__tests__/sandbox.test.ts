/**
 * @author Kuitos
 * @since 2021-07-19
 */

import LooseSandbox from '../sandbox';

describe('loose sandbox', () => {
  it('should record the mutation from Object.defineProperty', () => {
    const sandbox = new LooseSandbox('defineProperty');

    const { proxy } = sandbox;

    proxy.prop1 = 123;
    Object.defineProperty(proxy, 'prop2', { value: 456, configurable: true, writable: true });

    expect(proxy.prop1).toBe(123);
    expect(window.prop1).toBe(123);
    expect(proxy.prop2).toBe(456);
    expect(window.prop2).toBe(456);

    sandbox.inactive();

    expect(window.prop1).toBeUndefined();
    expect(window.prop2).toBeUndefined();
  });
});
