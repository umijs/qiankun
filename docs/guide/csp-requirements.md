# Content Security Policy (CSP)

qiankun 3's script evaluators do not rely on `eval` or `new Function`, so the framework itself does not require `'unsafe-eval'`. After sandbox transformation, however, scripts and styles may reach the browser through Blob URLs or inline elements. The host application's Content Security Policy (CSP) must allow these resources.

This page covers the default sandbox and standalone use of `@qiankunjs/sandbox`. Micro-apps share the host document, so configure the policy on the **host HTML response**. Changing only the micro-app resource server's CSP does not replace host configuration. For browser compatibility, see [Browser support](/guide/browser-support).

## Minimal policy examples

The following response header assumes that **the host, micro-apps, and their resources share the same origin**, and that the application uses ESM, inline scripts, and style isolation:

```http
Content-Security-Policy: default-src 'self'; script-src 'self' blob: 'unsafe-inline'; style-src 'self' blob: 'unsafe-inline'; connect-src 'self'
```

This is a minimal example for those execution paths. `'unsafe-inline'` permits all inline content of the corresponding type; narrow it according to the paths described below. Configure images, fonts, APIs, and other origins according to your application.

For cross-origin deployments, add the actual origins of micro-app entries, scripts, modules, isolated stylesheets, and APIs to `connect-src`, for example:

```http
Content-Security-Policy: default-src 'self'; script-src 'self' blob: 'unsafe-inline'; style-src 'self' blob: 'unsafe-inline'; connect-src 'self' https://micro-app.example.com https://api.example.com
```

Replace the example domains with your own. Cross-origin fetches must also satisfy CORS; CSP permission does not replace the server's CORS response headers. Origins of untransformed external scripts or stylesheets loaded directly by the browser must also appear in `script-src` or `style-src`, respectively.

## What each permission allows

| Policy | When it is needed | Reason |
| --- | --- | --- |
| `default-src 'self'` | Default origin restriction in these examples | Resource types without a specific directive fall back to the same-origin policy |
| `script-src 'self'` | Loading the host's own external scripts | The browser loads the host code directly |
| `script-src blob:` | Sandboxed external Classic scripts, ESM, or `evaluateScript()` | Transformed scripts, modules, and runtime helper modules execute through Blob URLs |
| `script-src 'unsafe-inline'` | The current ESM engine, or inline Classic scripts without nonce or equivalent authorization | The ESM engine injects inline import maps; inline Classic scripts in HTML remain inline after rewriting |
| `style-src 'self'` | Loading same-origin external stylesheets | Without style isolation, the browser still loads external stylesheets directly |
| `style-src blob:` | External stylesheets with `styleIsolation` enabled, or shared stylesheet dependency reuse | Isolated styles load through Blob URLs after fetching and rewriting, including `@scope`; dependency reuse also generates Blob stylesheet placeholders |
| `style-src 'unsafe-inline'` | Inline styles without nonce or equivalent authorization | Existing or dynamically created style elements remain inline after `@scope` rewriting |
| `connect-src` | Fetching micro-app HTML, external scripts, modules, isolated stylesheets, and their `@import` resources | These resources are fetched before processing; host and micro-app API requests are also subject to this directive |

Images, fonts, and other resources requested directly by the browser remain subject to directives such as `img-src` and `font-src`. Converting CSS to a Blob URL does not automatically allow them.

If your policy sets `script-src-elem` or `style-src-elem` separately, check that those directives allow the corresponding elements too. Changing only `script-src` or `style-src` may have no effect. See the [CSP specification](https://www.w3.org/TR/CSP3/#directive-script-src-elem) for fallback rules.

### Classic scripts only

External Classic scripts and the standalone sandbox's `evaluateScript()` execute through Blob URLs. If neither the host nor the micro-apps contain scripts, event-handler attributes, or other content requiring inline authorization, and you do not use ESM, you can remove `'unsafe-inline'` from `script-src`:

```http
Content-Security-Policy: default-src 'self'; script-src 'self' blob:; style-src 'self' blob: 'unsafe-inline'; connect-src 'self'
```

This example still assumes same-origin resources. It retains permissions for style isolation and inline styles; narrow `style-src` further when those styles are absent. Do not apply it unchanged to an HTML entry containing inline Classic scripts: those scripts are rewritten in place, not automatically converted to Blob URLs.

### ESM

Ordinary JavaScript modules and helper modules execute through Blob URLs, but their module mappings come from dynamically created `<script type="importmap">` elements. These elements have no `src` and contain runtime-generated JSON, so they are subject to inline script checks. See the [HTML script preparation steps](https://html.spec.whatwg.org/multipage/scripting.html#prepare-the-script-element).

Typed module imports such as JSON, CSS, and WASM retain their original URLs and use native browser loading. Cross-origin use also requires those origins to be allowed by the resource directives the browser applies.

With the source allowlist policies used on this page, allowing only `blob:` is therefore insufficient for ESM: `'unsafe-inline'` is also needed. `'unsafe-eval'` cannot replace that permission.

## Can I use a nonce?

Browsers can authorize individual inline script or style elements with a matching nonce. However, qiankun currently has **no unified CSP nonce option**. Internally generated import maps do not inherit the nonce from a host script or micro-app entry, so adding a nonce to the entry alone does not let you remove `'unsafe-inline'` from this page's ESM examples.

Complete nonce propagation is **planned for a later 3.x release**; no configuration is available yet. Projects requiring a nonce policy throughout should account for this limitation when evaluating integration. This page does not provide examples for an unimplemented nonce API.

Runtime import maps also contain instance identifiers and newly created Blob URLs, so a fixed build-time hash cannot cover them. Inline Classic scripts and isolated styles are rewritten too; hashes of their original contents cannot directly authorize the transformed elements.

Adding a nonce or hash to the same source list makes browsers ignore `'unsafe-inline'` in that list; combining them does not provide a fallback. See the [CSP inline matching rules](https://www.w3.org/TR/CSP3/#match-element-to-source-list).

## Verification

1. Use production builds and configure the policy on the host HTML response.
2. In your target browsers, exercise initial loading, dynamic resources, remounting after unmount, and the ESM and style isolation paths your application uses.
3. Inspect CSP console reports to distinguish blocked Blob scripts, inline import maps, inline scripts or styles, and fetch destinations.

The repository's [Classic CSP tests](https://github.com/umijs/qiankun/blob/next/e2e/tests/sandbox-js.spec.ts), [ESM CSP tests](https://github.com/umijs/qiankun/blob/next/e2e/tests/esm-sandbox.spec.ts), and [standalone sandbox test](https://github.com/umijs/qiankun/blob/next/e2e/tests/standalone-sandbox.spec.ts) cover policies without `'unsafe-eval'`. These tests still allow Blob URLs and inline content; they do not establish support for nonce policies.

Application code, third-party dependencies, or development tools that call `eval` / `new Function` can still trigger CSP violations. qiankun's independence from those calls does not mean your micro-apps are free of them.

## Further reading

- [Browser support](/guide/browser-support)
- [Native ESM support](/concepts/esm-sandbox)
- [Style isolation](/concepts/style-isolation)
- [Using the sandbox without qiankun](/cookbook/standalone-sandbox)
