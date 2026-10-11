# compartment-disposed: Disposed isolation instance

## Cause

Code attempted to use a Compartment or ESM execution instance after `dispose()`, or disposal canceled an unfinished classic script evaluation.

## Troubleshooting

1. Use the stack trace to identify whether script evaluation, module import, or another instance operation failed.
2. Check the order of `dispose()` and asynchronous work. Look for timers, callbacks, or pending promises that still use the old instance.
3. Check whether the remount flow tries to reuse an instance that has already been disposed.

## Solution

If the task needs to finish, wait for evaluation or import to complete before disposing the instance. If disposal is an intentional cancellation, handle the rejected promise and stop subsequent work.

`dispose()` is terminal cleanup. Unlike `unmount()`, it does not allow remounting the same instance. Create a new instance and mount it when the micro app needs to run again.

## Related

- [Error codes and solutions](/errors/)
- [compartment-disposed：隔离实例已销毁](/zh-CN/errors/compartment-disposed)
