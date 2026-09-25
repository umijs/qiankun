# load-timeout: Micro app loading timed out

## Cause

The micro app has a `loadTimeout`, and its loading phase did not finish within that limit.

Timing starts after the app acquires the container for loading. It covers `beforeLoad`, the entry request and HTML stream, assets the loader waits for, and lifecycle discovery from the entry. Time spent waiting for a previous instance to release the container is not counted, and `bootstrap`, `mount`, and `unmount` are not limited.

The error is a `LoadAppTimeoutError`. It extends `QiankunError` and adds the read-only fields `appName`, `loadTimeout`, and `elapsed`.

## Troubleshooting

1. Compare `loadTimeout` with `elapsed` to check whether the limit is much shorter than a normal load.
2. In the browser's network panel, inspect the entry HTML and blocking assets to find the slowest request or one that never finishes.
3. Check whether the entry HTML response ends. With a timeout enabled, qiankun waits for the HTML stream to finish before mounting, so a streaming response that never closes always times out.
4. Check `beforeLoad` hooks for slow asynchronous work.

## Solution

Adjust the app's `loadTimeout` to match your network conditions and asset sizes. Set it to `0` to disable the timeout.

By the time the error is reported, qiankun has aborted the load, removed the nodes written into the container, disposed of the sandbox, and released the container. To retry, call `loadMicroApp` again to create a new instance instead of mounting the failed handle. A timeout cannot interrupt synchronous JavaScript that is already running.

## Related

- [Error codes and solutions](/errors/)
- [load-timeout：微应用加载超时](/zh-CN/errors/load-timeout)
