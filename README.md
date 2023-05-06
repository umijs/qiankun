<p align="center">
  <a href="https://qiankun.umijs.org" target="_blank" rel="noopener noreferrer">
    <img width="180" src="https://user-images.githubusercontent.com/5206843/156369489-cf708a6a-1937-4dd9-895b-c6d17156c493.png" alt="qiankun logo">
  </a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/qiankun"><img src="https://img.shields.io/npm/v/qiankun/alpha.svg?style=flat-square" alt="npm version" /></a>
  <a href="https://codecov.io/gh/umijs/qiankun"><img src="https://img.shields.io/codecov/c/github/umijs/qiankun.svg?style=flat-square" alt="coverage" /></a>
  <a href="https://www.npmjs.com/package/qiankun"><img src="https://img.shields.io/npm/dt/qiankun.svg?style=flat-square" alt="npm downloads" /></a>
  <a href="https://github.com/umijs/qiankun/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/umijs/qiankun/ci.yml?branch=master&style=flat-square" alt="build status" /></a>
  <a href="https://github.com/umijs/dumi"><img src="https://img.shields.io/badge/docs%20by-dumi-blue" alt="dumi" /></a>
</p>

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

| Package                                | Version (click for changelogs)                                                                             |
|----------------------------------------| :--------------------------------------------------------------------------------------------------------- |
| [qiankun](packages/qiankun)            | [![plugin-vue version](https://img.shields.io/npm/v/qiankun.svg?label=%20)](packages/qiankun/CHANGELOG.md) |
| [@qiankunjs/loader](packages/loader)   |                                                                                                            |
| [@qiankunjs/sandbox](packages/sandbox) |                                                                                                            |

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
