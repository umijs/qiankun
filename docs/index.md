---
layout: home

hero:
  name: qiankun · micro-frontend runtime
  text: Ship independently. Compose on demand.
  tagline: Use loadMicroApp to mount front-end apps from different teams and frameworks wherever your product needs them. Each app keeps its own development and release cadence.
  image:
    src: /hero-runtime.svg
    alt: A host application composing independently delivered micro-apps at runtime
  actions:
    - theme: brand
      text: Load your first micro-app
      link: /guide/getting-started
    - theme: alt
      text: See when qiankun fits
      link: /guide/what-is-qiankun
    - theme: alt
      text: Live examples
      link: https://examples.qiankunjs.com

features:
  - icon:
      src: /icons/agnostic.svg
      alt: Independent application boundaries
      width: 22
      height: 22
      wrap: true
    title: Release without lockstep
    details: Each micro-app keeps its stack, repository, and release cadence. The host composes them at runtime.
  - icon:
      src: /icons/scope.svg
      alt: An application mounted into a page region
      width: 22
      height: 22
      wrap: true
    title: Control each instance
    details: Mount into any HTMLElement with loadMicroApp, then update or unmount the returned instance when needed.
  - icon:
      src: /icons/sandbox.svg
      alt: Isolated runtime boundary
      width: 22
      height: 22
      wrap: true
    title: Coexist with fewer conflicts
    details: JavaScript sandboxing, optional style isolation, and native ESM support help different stacks share one page.
---

## Control one micro-app instance

Install qiankun in the main app:

```bash
npm install qiankun@rc
```

::: tip v3 installs from the `rc` tag
qiankun 3.0 is a release candidate, so npm's `latest` tag still resolves to 2.x. Ask for `@rc` explicitly to get v3.
:::

Mount after the container exists, then keep the returned handle for status and teardown:

```ts
import { loadMicroApp } from 'qiankun';

const container = document.getElementById('micro-app-slot');
if (!container) throw new Error('micro-app-slot not found');

const microApp = loadMicroApp({
  name: 'orders',
  entry: '//localhost:7101',
  container,
});

await microApp.mountPromise;

// When this part of the page is removed:
await microApp.unmount();
```

The micro-app exports `bootstrap`, `mount`, and `unmount`; qiankun loads it into the `HTMLElement` and drives those lifecycles. Follow [Getting started](/guide/getting-started) for a complete runnable setup.

For applications whose lifetime should be driven entirely by the URL, see the route-based [`registerMicroApps`](/api/register-micro-apps) and [`start`](/api/start) alternative.

A live version of the repository's example apps — two hosts driving the same set of micro-apps — runs at [examples.qiankunjs.com](https://examples.qiankunjs.com).
