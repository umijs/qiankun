/**
 * @author Kuitos
 * @since 2021-04-12
 */

import { getTargetValue } from '../common';

describe('getTargetValue', () => {
  it('should work well', () => {
    const a1 = getTargetValue(window, undefined);
    expect(a1).toEqual(undefined);

    const a2 = getTargetValue(window, null);
    expect(a2).toEqual(null);

    const a3 = getTargetValue(window, function bindThis(this: any) {
      return this;
    });
    const a3returns = a3();
    expect(a3returns).toEqual(window);
  });

  it('should work well while function added prototype methods after first running', () => {
    function prototypeAddedAfterFirstInvocation(this: any, field: string) {
      this.field = field;
    }
    const notConstructableFunction = getTargetValue(window, prototypeAddedAfterFirstInvocation);
    // `this` of not constructable function will be bound automatically, and it can not be changed by calling with special `this`
    const result = {};
    notConstructableFunction.call(result, '123');
    expect(result).toStrictEqual({});
    expect(window.field).toEqual('123');

    prototypeAddedAfterFirstInvocation.prototype.addedFn = () => {};
    const constructableFunction = getTargetValue(window, prototypeAddedAfterFirstInvocation);
    // `this` coule be available if it be predicated as a constructable function
    const result2 = {};
    constructableFunction.call(result2, '456');
    expect(result2).toStrictEqual({ field: '456' });
    // window.field not be affected
    expect(window.field).toEqual('123');
    // reference should be stable after first running
    expect(constructableFunction).toBe(getTargetValue(window, prototypeAddedAfterFirstInvocation));
  });

  it('should work well while value have a readonly prototype on its prototype chain', () => {
    function callableFunction() {}

    const functionWithReadonlyPrototype = () => {};
    Object.defineProperty(functionWithReadonlyPrototype, 'prototype', {
      writable: false,
      enumerable: false,
      configurable: false,
      value: 123,
    });

    Object.setPrototypeOf(callableFunction, functionWithReadonlyPrototype);

    const boundFn = getTargetValue(window, callableFunction);
    expect(boundFn.prototype).toBe(callableFunction.prototype);
  });

  it("should work well while function's toString()'s return value keeps the same as the origin", () => {
    function callableFunction1() {}
    function callableFunction2() {}
    function callableFunction3() {}
    callableFunction2.toString = () => 'instance toString';
    Object.defineProperty(callableFunction3, 'toString', {
      get() {
        return () => 'instance toString';
      },
    });

    const boundFn1 = getTargetValue(window, callableFunction1);
    const boundFn2 = getTargetValue(window, callableFunction2);
    const boundFn3 = getTargetValue(window, callableFunction3);

    expect(boundFn1.toString()).toBe(callableFunction1.toString());
    expect(boundFn2.toString()).toBe(callableFunction2.toString());
    expect(boundFn3.toString()).toBe(callableFunction3.toString());
  });
});
