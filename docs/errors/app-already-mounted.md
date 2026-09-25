# app-already-mounted: Micro app already mounted

## Cause

A handle's `mount()` was called, but when that mount got its turn the app was already mounted. Common cases:

- The handle returned by `loadMicroApp` mounts on its own, and the caller called `mount()` again.
- `mount()` was called twice on the same handle without an `unmount()` in between.

A handle runs its `mount()` and `unmount()` calls one after another in call order, and each one requires the app to be in the matching state.

## Troubleshooting

1. Check whether `mount()` is called right after `loadMicroApp`.
2. Check that `mount()` and `unmount()` calls on the same handle come in pairs.
3. Use `getStatus()` to confirm which state the app was in when `mount()` was called.

## Solution

You do not need to call `mount()` after `loadMicroApp`; await `mountPromise` instead. To mount again, call `unmount()` first and then `mount()`.

## Related

- [Error codes and solutions](/errors/)
- [app-already-mounted：微应用已挂载](/zh-CN/errors/app-already-mounted)
