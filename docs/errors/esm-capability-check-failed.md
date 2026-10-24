# esm-capability-check-failed: ESM capability check could not complete

## Cause

The ESM capability check could not access or initialize its same-origin iframe, an enforced CSP blocked a probe script, or the check did not complete within five seconds. This indicates a restriction on the check, not proof that the browser lacks dynamic multiple-import-map support.

The check cleans up its iframe, event handlers, and temporary blob URLs. Its result is reused within the host document. If the application's configured `loadTimeout` expires earlier, the host may receive `load-timeout` first.

## Troubleshooting

1. Inspect the console for CSP, Trusted Types, and iframe access errors.
2. Allow creation and access to a same-origin `about:blank` iframe. It inherits the host origin and CSP and only runs feature detection, not the micro-app.
3. Ensure script policies permit the probe's `blob:` modules and inline import maps. Check more specific directives such as `script-src-elem` as well. See [Content Security Policy (CSP)](/guide/csp-requirements) for the full requirements.

## Resolution

Adjust script and embedding policies to fit your deployment requirements. Until the check passes, show a loading error or select a Classic build entry. This check does not verify micro-app resource CORS, network availability, or every CSP requirement.

## Related

- [Browser support](/guide/browser-support)
- [Error codes and solutions](/errors/)
- [esm-capability-check-failed：ESM 能力检测未完成](/zh-CN/errors/esm-capability-check-failed)
