---
layout: home

hero:
  name: qiankun
  text: Micro-frontends, assembled at runtime
  tagline: A complete micro-frontends solution built on single-spa — stream any HTML entry, isolate each app in a Proxy-membrane sandbox, and run native ES modules without a build step.
  actions:
    - theme: brand
      text: Get started
      link: /guide/getting-started
    - theme: alt
      text: What is qiankun
      link: /guide/what-is-qiankun
    - theme: alt
      text: View on GitHub
      link: https://github.com/umijs/qiankun

features:
  - icon:
      src: /icons/stream.svg
    title: Streaming HTML-entry loading
    details: Point qiankun at a micro-app's HTML URL. The loader streams it through writable-dom, virtualizes the head, and preloads assets as they arrive — no manifest, no entry contract to hand-maintain.
    link: /concepts/html-entry-loading
    linkText: How loading works
  - icon:
      src: /icons/sandbox.svg
    title: Proxy-membrane JS sandbox
    details: Every micro-app runs against its own proxied window and document. Globals, timers, event listeners and history are tracked and reverted on unmount, so apps mount, unmount and coexist without leaking into each other.
    link: /concepts/js-sandbox
    linkText: The JS sandbox
  - icon:
      src: /icons/esm.svg
    title: Native ESM execution
    details: A micro-app shipping native script type=module is fetched, lexer-rewritten to route globals through the membrane, wired with a synthetic import map, and evaluated by the browser's own module loader. Vite dev servers work as-is.
    link: /concepts/esm-sandbox
    linkText: The ESM sandbox
  - icon:
      src: /icons/scope.svg
    title: Runtime style isolation
    details: Opt in with a single styleIsolation flag. Styles are wrapped in CSS @scope at runtime and scoped to the mounted app — no Shadow DOM, no build-time rewriting, and external stylesheets are handled too.
    link: /concepts/style-isolation
    linkText: Style isolation
  - icon:
      src: /icons/agnostic.svg
    title: Framework agnostic
    details: React, Vue, Angular, or plain HTML — a micro-app only needs to export bootstrap, mount and unmount. First-class MicroApp bindings ship for React and Vue, and create-qiankun scaffolds a working setup in seconds.
    link: /ecosystem/
    linkText: Explore the ecosystem
  - icon:
      src: /icons/singlespa.svg
    title: Built on single-spa
    details: Routing, activation and lifecycle orchestration are handled by the battle-tested single-spa core. qiankun adds the loading, sandboxing and asset pipeline on top, so both route-based and manual mounting are first class.
    link: /concepts/architecture
    linkText: Architecture overview
---
