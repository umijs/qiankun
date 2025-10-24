<p align="center">
  <a href="https://qiankun.umijs.org" target="_blank" rel="noopener noreferrer">
    <img width="180" src="./docs/logo.png" alt="qiankun logo">
  </a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/qiankun"><img src="https://img.shields.io/npm/v/qiankun/next.svg?style=flat-square" alt="npm version" /></a>
  <a href="https://codecov.io/gh/umijs/qiankun"><img src="https://img.shields.io/codecov/c/github/umijs/qiankun.svg?style=flat-square" alt="coverage" /></a>
  <a href="https://www.npmjs.com/package/qiankun"><img src="https://img.shields.io/npm/dm/qiankun.svg?style=flat-square" alt="npm downloads" /></a>
  <a href="https://github.com/umijs/qiankun/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/umijs/qiankun/ci.yml?branch=master&style=flat-square" alt="build status" /></a>
  <a href="https://github.com/umijs/dumi"><img src="https://img.shields.io/badge/docs%20by-dumi-blue" alt="dumi" /></a>
</p>

# qiankun（乾坤）

> [!WARNING]
> 🚧 qiankun 3.0 is currently under active development. Check out the [Roadmap](https://github.com/umijs/qiankun/discussions/1378) for more details.

> In Chinese, `qian(乾)` means heaven and `kun(坤)` earth. `qiankun` is the universe.

Qiankun enables you and your teams to build next-generation and enterprise-ready web applications leveraging [Micro Frontends](https://micro-frontends.org/). It is inspired by and based on [single-spa](https://github.com/single-spa/single-spa).

## 🤔 Motivation

A quick recap about the concept of `Micro Frontends`:

> Techniques, strategies and recipes for building a **modern web app** with **multiple teams** using **different JavaScript frameworks**. — [Micro Frontends](https://micro-frontends.org/)

Qiankun was birthed internally in our group during the time web app development by distributed teams had turned to complete chaos. We faced every problem micro frontend was conceived to solve, so naturally, it became part of our solution.

The path was never easy, we stepped on every challenge there could possibly be. Just to name a few:

- In what form do micro-apps publish static resources?
- How does the framework integrate individual micro-apps?
- How to ensure that sub-applications are isolated from one another (development independence and deployment independence) and runtime sandboxed?
- Performance issues? What about public dependencies?
- The list goes on long ...

After solving these common problems of micro frontends and lots of polishing and testing, we extracted the minimal viable framework of our solution, and named it `qiankun`, as it can contain and serve anything. Not long after, it became the cornerstone of hundreds of our web applications in production, and we decided to open-source it to save you the suffering.

**TLDR: Qiankun is probably the most complete micro-frontend solution you ever met🧐.**

## :sparkles: Features

Qiankun inherits many benefits from [single-spa](https://github.com/single-spa/single-spa):

- 📦 **Micro-apps Independent Deployment**
- 🛴 **Lazy Load**
- 📱 **Technology Agnostic**

And on top of these, it offers:

- 💃 **Elegant API**
- 💪 **HTML Entry Access Mode**
- 🛡 **Style Isolation**
- 🧳 **JS Sandbox**
- ⚡ **Prefetch Assets**
- 🔌 **[Umi Plugin](https://github.com/umijs/plugins/tree/master/packages/plugin-qiankun) Integration**

## Packages

| Package | Version (click for changelogs) |
| --- | :-- |
| [qiankun](packages/qiankun) | [![qiankun version](https://img.shields.io/npm/v/qiankun/next.svg?style=flat-square)](packages/qiankun/CHANGELOG.md) |
| [@qiankunjs/loader](packages/loader) | [![loader version](https://img.shields.io/npm/v/@qiankunjs/loader/rc.svg?style=flat-square)](packages/loader/CHANGELOG.md) |
| [@qiankunjs/sandbox](packages/sandbox) | [![sandbox version](https://img.shields.io/npm/v/@qiankunjs/sandbox/rc.svg?style=flat-square)](packages/sandbox/CHANGELOG.md) |
| [@qiankunjs/shared](packages/shared) | [![shared version](https://img.shields.io/npm/v/@qiankunjs/shared/rc.svg?style=flat-square)](packages/shared/CHANGELOG.md) |
| [@qiankunjs/react](packages/ui-bindings/react) | [![react version](https://img.shields.io/npm/v/@qiankunjs/react/rc.svg?style=flat-square)](packages/ui-bindings/react/CHANGELOG.md) |
| [@qiankunjs/vue](packages/ui-bindings/vue) | [![vue version](https://img.shields.io/npm/v/@qiankunjs/vue/rc.svg?style=flat-square)](packages/ui-bindings/vue/CHANGELOG.md) |
| [@qiankunjs/ui-shared](packages/ui-bindings/shared) | [![ui-shared version](https://img.shields.io/npm/v/@qiankunjs/ui-shared/rc.svg?style=flat-square)](packages/ui-bindings/shared/CHANGELOG.md) |
| [@qiankunjs/webpack-plugin](packages/webpack-plugin) | [![webpack-plugin version](https://img.shields.io/npm/v/@qiankunjs/webpack-plugin/rc.svg?style=flat-square)](packages/webpack-plugin/CHANGELOG.md) |
| [create-qiankun](packages/create-qiankun) | [![create-qiankun version](https://img.shields.io/npm/v/create-qiankun/rc.svg?style=flat-square)](packages/create-qiankun/CHANGELOG.md) |

## 📦 Installation

```shell
$ yarn add qiankun  # or npm i qiankun -S
```

## 📖 Documentation

You can find the Qiankun documentation [on the website](https://qiankun.umijs.org/)

Check out the [Getting Started](https://qiankun.umijs.org/guide/getting-started) page for a quick overview.

The documentation is divided into several sections:

- [Tutorial](https://qiankun.umijs.org/cookbook)
- [API Reference](https://qiankun.umijs.org/api)
- [FAQ](https://qiankun.umijs.org/faq)
- [Community](https://qiankun.umijs.org/#-community)

## 💿 Examples

Inside the `examples` folder, there is a sample Shell app and multiple mounted Micro FE apps. To get it running, first clone `qiankun`:

```shell
$ git clone https://github.com/umijs/qiankun.git
$ cd qiankun
```

Now install and run the example:

```shell
$ pnpm install
$ pnpm run examples:install
$ pnpm run examples:start
```

Visit `http://localhost:7099`.

![](./examples/example.gif)

## 🎯 Roadmap

See [Qiankun 3.0 Roadmap](https://github.com/umijs/qiankun/discussions/1378)

## 🤝 Contributing
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/umijs/qiankun)

See [contributing guide](./CONTRIBUTING.md).

## 👥 Contributors
Thanks to all the contributors!

<a href="https://github.com/umijs/qiankun/graphs/contributors">
  <img src="https://opencollective.com/qiankun/contributors.svg?width=960&button=false" alt="contributors" />
</a>

## 🎁 Acknowledgements

- [single-spa](https://github.com/single-spa/single-spa) What an awesome meta-framework for micro-frontends!
- [writable-dom](https://github.com/marko-js/writable-dom/) Utility to stream HTML content into a live document.

## 📄 License

Qiankun is [MIT licensed](./LICENSE).
