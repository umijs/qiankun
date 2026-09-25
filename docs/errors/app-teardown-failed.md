# app-teardown-failed: Micro app teardown failed

## Cause

The final cleanup step of disposing of a micro app threw a value that is not an `Error`, such as a string. This step includes the sandbox's own cleanup and the `dispose` hooks of custom sandbox plugins.

Failures in the `unmount` lifecycle and in `beforeUnmount` or `afterUnmount` hooks are first wrapped into an `Error` by single-spa and do not use this code. When cleanup throws an `Error` instance, qiankun rethrows it unchanged.

Even when this error is reported, disposal has completed and the old instance can no longer be used.

## Troubleshooting

1. The error message includes the thrown value. Use it to find the code in the `dispose` hooks of custom sandbox plugins that throws that value.
2. If a plugin calls another library's cleanup method in `dispose`, check whether that method throws strings or plain objects.

## Solution

Fix the failing cleanup logic and always throw `Error` instances so the stack trace and original message are preserved. To run the micro app again, call `loadMicroApp` to create a new instance.

## Related

- [Error codes and solutions](/errors/)
- [app-teardown-failed：微应用清理失败](/zh-CN/errors/app-teardown-failed)
