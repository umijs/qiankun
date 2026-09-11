# module-resolve-invalid: Invalid module resolution result

## Cause

`resolveHook` returned a value other than a non-empty string.

## Troubleshooting

1. Locate the specifier being resolved and its referrer in the error message.
2. Check every return path in the hook for `undefined`, `null`, objects, or empty strings.
3. Check whether the hook was declared `async`. `resolveHook` is synchronous and cannot return a promise.

## Solution

Make `resolveHook(specifier, referrer)` synchronously return a non-empty canonical specifier. URL-like imports can use `new URL(specifier, referrer).href`. For virtual application modules, return a stable canonical key and provide its content through `modules` or `importHook`.

## Related

- [Error codes and solutions](/errors/)
- [module-resolve-invalid：模块解析结果无效](/zh-CN/errors/module-resolve-invalid)
