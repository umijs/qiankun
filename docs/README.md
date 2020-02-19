---
home: true
actionText: Get Started →
actionLink: /guide/
features:
  - title: Simple
    details: Works with any javascript framework. Build your micro-frontend system just like using with iframe, but not iframe actually.
  - title: Complete
    details: Includes almost all the basic capabilities required to build a micro-frontend system, such as style isolation, js sandbox, preloading, and so on.
  - title: Production-Ready
    details: Had been extensively tested and polished by a large number of online applications both inside and outside of Ant Financial, the robustness is trustworthy.
footer: MIT Licensed | Copyright © 2019-present
---

## 📦 Installation

```shell
$ yarn add qiankun  # or npm i qiankun -S
```

## 🔨 Getting Started

```tsx
import { registerMicroApps, start } from 'qiankun';

// register the sub apps
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

See details：[Getting Started](/guide/getting-started.html)

## Community

| Github Issue | 钉钉群 |
| --- | --- |
| [umijs/qiankun/issues](https://github.com/umijs/qiankun/issues) | <img src="https://gw.alipayobjects.com/mdn/rms_655822/afts/img/A*HMVERqOue-AAAAAAAAAAAABkARQnAQ" width="60" /> |
