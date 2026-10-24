# esm-unsupported: Required ESM sandbox capabilities are unavailable

## Cause

The browser failed the ESM sandbox's dynamic multiple-import-map check. In a separate same-origin iframe, qiankun injects an import map and executes a module, then adds a second map and executes another module. A module loading failure in either step produces this error.

The check runs before fetching, rewriting, or executing the micro-app's ESM modules. Its result is reused within the host document. Classic scripts do not trigger the check.

## Troubleshooting

1. Check [Browser support](/guide/browser-support) for the native ESM requirements. Support for ES modules or a single import map is insufficient.
2. Inspect the console for CSP violations. Enforced CSP restrictions normally produce `esm-capability-check-failed`, but this code does not replace a full CSP investigation.
3. Catch `microApp.mountPromise` and inspect `error instanceof QiankunError` and `error.code` instead of matching browser error messages.

## Resolution

Use a supported browser, or provide a Classic build entry for the host to select. qiankun 3.0 provides no ESM sandbox fallback. Disabling the sandbox does not preserve isolation as a compatibility fallback. Do not require users to change experimental browser preferences.

If the check cannot finish, qiankun reports [esm-capability-check-failed: ESM capability check could not complete](/errors/esm-capability-check-failed).

## Related

- [Browser support](/guide/browser-support)
- [Error codes and solutions](/errors/)
- [esm-unsupported：ESM 沙箱所需能力不可用](/zh-CN/errors/esm-unsupported)
