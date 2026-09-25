# timeout-invalid: Invalid loading timeout

## Cause

The `loadTimeout` in an app's configuration is not a finite non-negative number, for example a negative number, `NaN`, or `Infinity`.

## Troubleshooting

1. Use the failing app to find which `loadMicroApp` call or `registerMicroApps` configuration passed the value.
2. Check where `loadTimeout` comes from. When it is read from an environment variable, URL parameter, or configuration file, a failed string conversion produces `NaN`.

## Solution

Pass a finite non-negative number of milliseconds. Omitting it or passing `0` disables the timeout.

## Related

- [Error codes and solutions](/errors/)
- [timeout-invalid：加载超时配置无效](/zh-CN/errors/timeout-invalid)
