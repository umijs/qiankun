# timeout-invalid: Invalid loading timeout

## Cause

`timeout` is not a finite non-negative number, for example a negative number, `NaN`, or `Infinity`. Both `start({ timeout })` and app-level configuration validate this value.

## Troubleshooting

1. Use the stack trace to check whether the error comes from `start()` or from loading a specific app.
2. Check where `timeout` comes from. When it is read from an environment variable, URL parameter, or configuration file, a failed string conversion produces `NaN`.

## Solution

Pass a finite non-negative number of milliseconds. `0` disables the timeout. When the value is omitted or `undefined`, an app inherits the default set by `start({ timeout })`.

## Related

- [Error codes and solutions](/errors/)
- [timeout-invalid：加载超时配置无效](/zh-CN/errors/timeout-invalid)
