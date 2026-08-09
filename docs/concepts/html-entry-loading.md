# HTML entry

A qiankun micro-app is described by the URL of its HTML document, usually its deployed `index.html`. Pass that URL as `entry` to [`loadMicroApp`](/api/load-micro-app); qiankun follows the scripts and styles declared by the document and mounts the result into your container.

This page covers the user-facing contract. The parser and resource pipeline are documented in [Streaming HTML-entry internals](/internals/streaming-html-entry).

## Why the entry is HTML

The HTML document remains the single source of truth for a micro-app's assets. When a build produces new hashed filenames, its `index.html` already points to them, so the host does not need a second manifest to keep in sync.

This model also preserves independent deployment: the same application can have its own HTML shell, run standalone during development, and be loaded by qiankun in production. The host only needs its entry URL and lifecycle contract.

## The entry contract

Serve a valid, non-empty HTML document. With the official bundler plugin, a production build automatically marks one external script as the lifecycle entry:

```html
<!doctype html>
<html>
  <head>
    <link rel="stylesheet" href="/assets/main.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/assets/main.js" entry></script>
  </body>
</html>
```

An HTML document must never contain more than one script with the `entry` attribute. The entry script must be external (`src` or `data-src`); inline scripts cannot be the lifecycle entry. [`@qiankunjs/bundler-plugin`](/ecosystem/bundler-plugin) marks entries in Vite production builds and Webpack builds. Vite development HTML may omit an explicit marker, in which case the ESM engine selects the entry from lifecycle exports. Prefer the plugin over editing generated HTML by hand.

Other scripts may still appear in the document. The `entry` marker identifies the one whose exports satisfy the [micro-app lifecycle contract](/concepts/lifecycle-and-props).

## What streaming changes for you

qiankun processes the response while it arrives instead of waiting for the complete HTML document. This has three observable consequences:

- Markup can appear progressively in the container.
- Asset discovery can begin before the rest of the HTML finishes downloading.
- Script and stylesheet ordering follows document semantics, so existing build output does not need a qiankun-specific asset manifest.

Streaming requires no special application API. If a server or proxy buffers the whole response, the entry still works, but it loses the progressive-loading benefit. Use the [loading optimization guide](/cookbook/optimize-loading) for deployment tuning.

## Classic and ESM entries

Both formats use the same HTML-entry and lifecycle model. Choose the format that matches the micro-app's build tool.

| | Classic script | Native ESM |
| --- | --- | --- |
| Typical entry | `<script src="/app.js" entry>` | `<script type="module" src="/assets/main.js" entry>` |
| Lifecycle exposure | UMD/global export configured by the bundler | Named exports or a default lifecycle object |
| Typical use | Existing Webpack or legacy builds | Vite and modern module builds |

Classic scripts and ESM modules have different execution constraints, but the host still receives the same `MicroApp` handle. See [Native ESM support](/concepts/esm-sandbox), [Prepare a Vite app](/cookbook/prepare-a-vite-app), or [Prepare a Webpack app](/cookbook/prepare-a-webpack-app).

## Cross-origin and deployment boundaries

The browser fetches the entry and assets from the host page. When origins differ:

- Allow the host origin with CORS on the HTML entry and every asset qiankun needs to fetch.
- Keep redirects and asset URLs reachable from the browser; a successful HTML response alone is not enough.
- Serve JavaScript, CSS, and modules with appropriate content types.
- If requests require cookies or authorization, configure a custom [`fetch`](/api/configuration) and matching credential-aware CORS headers.

The HTML-entry model does not bypass browser security policy. CSP, mixed-content rules, authentication, and network failures still apply.

## Continue reading

- [Loading a micro-app instance](/concepts/architecture) — where the entry fits in the runtime model.
- [Micro-app lifecycle and props](/concepts/lifecycle-and-props) — what the entry must expose.
- [JavaScript isolation](/concepts/js-sandbox) and [Style isolation](/concepts/style-isolation) — how loaded assets are scoped.
- [Streaming HTML-entry internals](/internals/streaming-html-entry) — parser and execution details for maintainers.
