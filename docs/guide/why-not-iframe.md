# Why not iframe

When people first think about "isolating several apps inside one page," iframe almost always comes to mind. It gives you the most thorough isolation there is — its own `window`, its own `document`, its own style and script environment. No matter what a sub-app does, it can't reach out.

If iframe were good enough, qiankun wouldn't need to exist. The catch is that iframe's "thorough isolation" is also its biggest liability: it isolates so hard that making "several apps feel like one product" becomes an uphill fight. Four problems in particular are hard to get around.

## 1. URL state doesn't stay in sync

Route changes inside an iframe aren't reflected in the browser's address bar. So:

- When the user refreshes, the iframe reverts to its initial URL and the sub-app's current location is lost.
- The browser's forward / back buttons have no reach into the iframe's own history.
- Want to share a link to a specific page in a sub-app? The address bar simply doesn't carry that information.

You can wire the iframe's routing to the host's address bar by hand, but it's awkward and prone to edge cases.

## 2. UI can't escape the iframe boundary

An iframe is a hard boundary, and nothing inside it can cross out. That's fatal for interactions:

- A modal or overlay that should be centered over the whole page can only center within the iframe's little frame.
- A dropdown or tooltip from the sub-app gets clipped the moment it extends past the iframe's viewport.

The upshot is that you have to invent workarounds for these cross-boundary UI cases — cases that aren't even a problem on an ordinary page.

## 3. Slow to load, and prone to blank screens

Every iframe you load forces the browser to build a whole new context, re-downloading, re-parsing, and re-executing everything inside. Even when the host and the sub-app share the same set of dependencies, there's no reuse. Switching apps often greets the user with a stretch of blank screen — hardly a smooth experience.

## 4. Over-isolated, so communication gets harder

The iframe splits `document` too, leaving the host and the sub-app in two disconnected DOM trees. That comes with a pile of costs you didn't need:

- Cross-iframe communication only works through `postMessage`; even passing an object means serializing it, and a synchronous call is out of the question.
- Sharing things like Cookies and `localStorage` across the iframe takes extra work.
- Events are boxed in too — clicking outside to dismiss a popover inside the iframe, about as routine as interactions get, needs special handling.

## How qiankun does it

qiankun's approach: isolate where isolation matters, and stay open everywhere else.

A micro app is **not** put inside an iframe. It's mounted directly into a container element on the host page, sharing the same `document` as the host. That alone makes the problems above — the ones caused by splitting `document`: URL desync, UI trapped at the boundary, awkward communication — disappear at the root.

So what provides the isolation? The runtime:

- The **[JS sandbox](/concepts/js-sandbox)** uses a `Proxy` membrane to give each micro app its own view of `window`. Global reads and writes, timers, and event listeners are all recorded, then unwound one by one on unmount, so apps don't pollute each other.
- **[Style isolation](/concepts/style-isolation)** builds on native CSS `@scope`, opt-in, confining a micro app's styles to its own container — no need for the hard boundary of an iframe or Shadow DOM.

You get the isolation apps ought to have between them, without giving up any of the convenience of them actually living on the same page. That's why qiankun doesn't use iframe.

To see how this isolation works underneath, read on in the [architecture overview](/concepts/architecture).
