---
layout: home

hero:
  name: qiankun
  tagline: Load and manage independently delivered micro-apps in one page
  image:
    src: /logo.png
    alt: qiankun
  actions:
    - theme: brand
      text: Get started
      link: /guide/getting-started
    - theme: alt
      text: What is qiankun
      link: /guide/what-is-qiankun
    - theme: alt
      text: GitHub
      link: https://github.com/umijs/qiankun

features:
  - icon: 🚀
    title: Simple
    details: Works with any JavaScript framework. Load a micro-app into an HTMLElement and control its lifetime with a small API.
  - icon: 🛡️
    title: Complete
    details: Ships the essentials for a micro-frontend system, including JavaScript isolation, optional style isolation, and preloading.
  - icon: 🔧
    title: Production ready
    details: Battle-tested across a large number of production apps inside and outside Ant Group.
  - icon: ⚡
    title: High performance
    details: Streams HTML entries and preloads assets as they are discovered, keeping application loading responsive.
  - icon: 🎯
    title: Framework agnostic
    details: The main app does not constrain a micro-app's framework or release process.
  - icon: 🧬
    title: Runtime isolation
    details: JavaScript sandboxes and native ESM support help independently developed apps coexist on one page.
---

## Load your first micro-app

Install qiankun in the main app:

```bash
pnpm add qiankun
```

Mount the micro-app after its container exists, and keep the returned handle so it can be unmounted:

```tsx
import { loadMicroApp } from 'qiankun';
import { useEffect, useRef } from 'react';

export function MicroAppSlot() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const microApp = loadMicroApp({
      name: 'sub-app',
      entry: '//localhost:7101',
      container,
    });

    return () => {
      void microApp.unmount().catch((error: unknown) => {
        console.error('Failed to unmount sub-app:', error);
      });
    };
  }, []);

  return <div ref={containerRef} />;
}
```

The micro-app exports `bootstrap`, `mount`, and `unmount`; qiankun loads it into the `HTMLElement` and drives those lifecycles. Follow [Getting started](/guide/getting-started) to run a main app on port `7099` and a micro-app on port `7101`.

For applications whose lifetime should be driven entirely by the URL, see the route-based [`registerMicroApps`](/api/register-micro-apps) and [`start`](/api/start) alternative.
