# app-unloaded: Micro app unloaded

## Cause

The micro app was disposed of with `unload()`, `unloadMicroApp()`, or `unloadApplication()`, but code still uses the disposed instance:

- It calls `mount()`, `unmount()`, or `update()` on an invalidated handle.
- A `mountPromise` that was still pending during disposal is rejected.
- An unfinished loading request of the instance is canceled.

## Troubleshooting

1. Use the stack trace to find code that still uses the invalidated handle, such as a callback or timer that fires after a component unmounts.
2. Check the order of `unload()` relative to `mount()` and `update()` calls, and look for concurrent operations.
3. If the error surfaces where `mountPromise` is awaited, check whether the cancellation is expected.

## Solution

`unload()` is terminal cleanup. Unlike `unmount()`, it does not allow the instance to be mounted again. Call `unmount()` to hide an app temporarily. To run an app again after disposal, call `loadMicroApp` to create a new instance.

Handle rejections caused by expected cancellation and stop subsequent work.

## Related

- [Error codes and solutions](/errors/)
- [app-unloaded：微应用已销毁](/zh-CN/errors/app-unloaded)
