# custom-error: Caller-defined error

## Cause

The caller created an error with `new QiankunError(message)` without specifying a code, so it received the default code `custom-error`. The caller supplies the message; this code does not identify a specific internal qiankun validation.

## Troubleshooting

1. Read the original message between the `[qiankun]:` prefix and the solution link.
2. Use the stack trace to locate the application or integration code that created the `QiankunError`.
3. Check that call site's arguments, state, and earlier logs to identify the trigger.

## Solution

Handle the problem according to the meaning defined by the caller. There is no single configuration fix for this default code; use the original message and stack trace.

When creating a custom error, include enough diagnostic context in `message`. qiankun preserves that text and appends a link to this page.

## Related

- [Error codes and solutions](/errors/)
- [custom-error：调用方自定义错误](/zh-CN/errors/custom-error)
