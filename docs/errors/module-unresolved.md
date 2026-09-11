# module-unresolved: Unresolved module specifier

## Cause

The default module resolver received a bare specifier that matches neither the micro app's import map nor its `modules` configuration, and cannot be resolved as a URL-like specifier.

## Troubleshooting

1. Check the specifier and importing module URL in the message, including spelling, case, and dependency subpaths.
2. Inspect the micro app's own import map and `modules` configuration for a matching entry.
3. If an import map exists only on the host app page, check whether the micro app's module resolution flow also receives the required mapping.

## Solution

Add an `imports` entry to the micro app's import map, or provide a corresponding descriptor in `modules`. For custom module sources, supply a consistent `resolveHook` and provide module content through `modules` or `importHook`.

For built entries, bundle the dependency or emit imports with accessible URLs. The host app page's import map does not automatically become this resolver's app import map.

## Related

- [Error codes and solutions](/errors/)
- [module-unresolved：模块说明符无法解析](/zh-CN/errors/module-unresolved)
