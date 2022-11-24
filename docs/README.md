---
title: qiankun
hero:
  title: qiankun
  desc: Probably the most complete micro-frontends solution you ever met🧐
  actions:
    - text: Get Started →
      link: /guide
features:
  - title: Simple
    desc: Works with any javascript framework. Build your micro-frontend system just like using with iframe, but not iframe actually.
  - title: Complete
    desc: Includes almost all the basic capabilities required to build a micro-frontend system, such as style isolation, js sandbox, preloading, and so on.
  - title: Production-Ready
    desc: Had been extensively tested and polished by a large number of online applications both inside and outside of Ant Financial, the robustness is trustworthy.
footer: MIT Licensed | Copyright © 2019-present<br />Powered by [dumi](https://d.umijs.org)
---

## 📦 Installation

```shell
$ yarn add qiankun  # or npm i qiankun -S
```

## 🔨 Getting Started

```tsx
import { loadMicroApp } from 'qiankun';

// load micro app
loadMicroApp({
  name: 'reactApp',
  entry: '//localhost:7100',
  container: '#container',
  props: {
    slogan: 'Hello Qiankun',
  },
});
```

See details：[Getting Started](/guide/getting-started)

## 👬 Community

| Github Discussions | DingTalk Group | WeChat Group |
| --- | --- | --- |
| [qiankun discussions](https://github.com/umijs/qiankun/discussions) | <img src="https://mdn.alipayobjects.com/huamei_zvchwx/afts/img/A*GG8zTJaUnTAAAAAAAAAAAAAADuWEAQ/original" width="150" /> | [view group QR code](https://github.com/umijs/qiankun/discussions/2343) |
