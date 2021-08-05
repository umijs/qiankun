---
title: qiankun
hero:
  title: qiankun
  desc: 可能是你见过最完善的微前端解决方案🧐
  actions:
    - text: 快速开始 →
      link: /zh/guide
features:
  - title: 简单
    desc: 任意 js 框架均可使用。微应用接入像使用接入一个 iframe 系统一样简单，但实际不是 iframe。
  - title: 完备
    desc: 几乎包含所有构建微前端系统时所需要的基本能力，如 样式隔离、js 沙箱、预加载等。
  - title: 生产可用
    desc: 已在蚂蚁内外经受过足够大量的线上系统的考验及打磨，健壮性值得信赖。
footer: MIT Licensed | Copyright © 2019-present<br />Powered by [dumi](https://d.umijs.org)
---

## 📦 安装

```shell
$ yarn add qiankun  # or npm i qiankun -S
```

## 🔨 使用

```tsx
import { loadMicroApp } from 'qiankun';

// 加载微应用
loadMicroApp({
  name: 'reactApp',
  entry: '//localhost:7100',
  container: '#container',
  props: {
    slogan: 'Hello Qiankun',
  },
});
```

参考：[快速上手](/zh/guide/getting-started)。

## 社区

| Github Discussions | 钉钉群 |
| --- | --- |
| [qiankun discussions](https://github.com/umijs/qiankun/discussions) | <img src="https://gw.alipayobjects.com/mdn/rms_655822/afts/img/A*9U6OSKHyMHUAAAAAAAAAAAAAARQnAQ" width="150" /> |
