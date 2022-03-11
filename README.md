<p align="center">
  <a href="https://qiankun.umijs.org" target="_blank" rel="noopener noreferrer">
    <img width="180" src="https://gw.alipayobjects.com/zos/bmw-prod/8a74c1d3-16f3-4719-be63-15e467a68a24/km0cv8vn_w500_h500.png" alt="qiankun logo">
  </a>
</p>

[![npm version](https://img.shields.io/npm/v/qiankun.svg?style=flat-square)](https://www.npmjs.com/package/qiankun) [![coverage](https://img.shields.io/codecov/c/github/umijs/qiankun.svg?style=flat-square)](https://codecov.io/gh/umijs/qiankun) [![npm downloads](https://img.shields.io/npm/dt/qiankun.svg?style=flat-square)](https://www.npmjs.com/package/qiankun) [![Build Status](https://img.shields.io/travis/umijs/qiankun.svg?style=flat-square)](https://travis-ci.com/umijs/qiankun)

# qiankun（乾坤）

> An Enterprise Mirco-Frontends Framework

- 📦 Based On [single-spa](https://github.com/CanopyTax/single-spa)
- 📱 Technology Agnostic
- 💪 HTML Entry Access Mode
- 🛡 Style Isolation
- 🧳 JS Sandbox
- ⚡ Prefetch Assets
- 🔌 [Umi Plugin](https://github.com/umijs/plugins/tree/master/packages/plugin-qiankun) Integration

In Chinese traditional culture `qian` means heaven and `kun` stands for earth, so `qiankun` is the universe.

## Packages

| Package                              | Version (click for changelogs)                                                                             |
| ------------------------------------ | :--------------------------------------------------------------------------------------------------------- |
| [qiankun](packages/qiankun)          | [![plugin-vue version](https://img.shields.io/npm/v/qiankun.svg?label=%20)](packages/qiankun/CHANGELOG.md) |
| [@qiankun/loader](packages/loader)   |                                                                                                            |
| [@qiankun/sandbox](packages/sandbox) |                                                                                                            |

## 🤔 Motivation

As we know what micro-frontends aims for:

> Techniques, strategies and recipes for building a **modern web app** with **multiple teams** using **different JavaScript frameworks**. — [Micro Frontends](https://micro-frontends.org/)

Modularity is very important for large application. By breaking down a large system into individual sub-applications, we can achieve good divide-and-conquer between products and when necessary combination, especially for enterprise applications that usually involve multi-team collaboration. But if you're trying to implement such a micro frontends architecture system by yourself, you're likely to run into some tricky problems:

- In what form do sub applications publish static resources?
- How does the main application integrate individual sub-applications?
- How do you ensure that sub-applications are independent of each other (development independent, deployment independent) and runtime isolated?
- Performance issues? What about public dependencies?
- And so on...

After solving these common problems of micro frontends, we extracted the kernel of our solution after a lot of internal online application testing and polishing, and then named it `qiankun`.

**Probably the most complete micro-frontends solution you ever met🧐.**

## 🎁 Acknowledgements

- [single-spa](https://github.com/CanopyTax/single-spa) What an awesome meta-framework for micro-frontends!
- [import-html-entry](https://github.com/kuitos/import-html-entry/) An assets loader which supports html entry.
