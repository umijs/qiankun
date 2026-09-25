# app-not-mounted: Micro app not mounted

## Cause

A handle's `unmount()` was called, but when that unmount got its turn the app was not mounted, so there was nothing to unmount:

- The app never mounted: loading, `bootstrap`, or `mount` failed.
- The app was already unmounted, and `unmount()` was called again.

When a failed mount caused it, the error's `cause` is that mount failure, the same object `mountPromise` rejected with.

## Troubleshooting

1. Check the error's `cause`. If it is set, investigate that mount failure first; it has usually been reported once already through `mountPromise`.
2. If `cause` is empty, look for several places calling `unmount()` on the same handle, or a second call after the unmount finished.
3. Use `getStatus()` to confirm which state the app was in when `unmount()` was called.

## Solution

Call `unmount()` only for an app that is mounting or mounted, and unmount each mount once. Code that already handled the mount failure on `mountPromise` can ignore an `unmount()` rejection whose `cause` is that same mount error.

## Related

- [Error codes and solutions](/errors/)
- [app-not-mounted：微应用未挂载](/zh-CN/errors/app-not-mounted)
