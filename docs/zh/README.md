---
home: true
actionText: 快速开始 →
actionLink: /guide/
features:
  - title: 简单
    details: 任意 js 框架均可使用。子应用接入像使用接入一个 iframe 系统一样简单，但实际不是 iframe。
  - title: 完备
    details: 几乎包含所有构建微前端系统时所需要的基本能力，如 样式隔离、js 沙箱、预加载等。
  - title: 生产可用
    details: 已在蚂蚁内外经受过足够大量的线上系统的考验及打磨，健壮性值得信赖。
footer: MIT Licensed | Copyright © 2019-present
---

## 📦 安装

```shell
$ yarn add qiankun  # or npm i qiankun -S
```

## 🔨 使用

```tsx
import { registerMicroApps, start } from 'qiankun';

// 注册子应用
registerMicroApps([
  {
    name: 'reactApp',
    entry: '//localhost:7100',
    render: ({ appContent }) => ReactDOM.render(<App appContent={appContent}>, document.getElementById('container')),
    activeRule: location => location.pathname.startsWith('/react'),
  },
]);

start();
```

参考：[快速上手](/zh/guide/getting-started.html)。

## 社区

| Github Issue | 钉钉群 |
| --- | --- |
| [umijs/qiankun/issues](https://github.com/umijs/qiankun/issues) | <img src="https://gw.alipayobjects.com/mdn/rms_655822/afts/img/A*HMVERqOue-AAAAAAAAAAAABkARQnAQ" width="60" /> |
