# qiankun（乾坤）

[![npm version](https://img.shields.io/npm/v/qiankun.svg?style=flat-square)](https://www.npmjs.com/package/qiankun) [![coverage](https://img.shields.io/codecov/c/github/umijs/qiankun.svg?style=flat-square)](https://codecov.io/gh/umijs/qiankun) [![npm downloads](https://img.shields.io/npm/dt/qiankun.svg?style=flat-square)](https://www.npmjs.com/package/qiankun) [![Build Status](https://img.shields.io/travis/umijs/qiankun.svg?style=flat-square)](https://travis-ci.org/umijs/qiankun)

> In Chinese traditional culture `qian` means heaven and `kun` stands for earth, so `qiankun` is the universe.

An implementation of [Micro Frontends](https://micro-frontends.org/), based on [single-spa](https://github.com/CanopyTax/single-spa), but made it production-ready.

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

## 📦 Installation

```shell
$ yarn add qiankun  # or npm i qiankun -S
```

## 📖 Documentation

https://qiankun.umijs.org/

## 💿 Getting started

This repo contains an `examples` folder with a sample Shell app and multiple mounted Micro FE apps. To run this app, first clone `qiankun`:

```shell
$ git clone https://github.com/umijs/qiankun.git
$ cd qiankun
```

Now run the yarn scripts to install and run the examples project:

```shell
$ yarn install
$ yarn examples:install
$ yarn examples:start
```

Visit `http://localhost:7099`.

![](./examples/example.gif)

## :sparkles: Features

- 📦 **Based On [single-spa](https://github.com/CanopyTax/single-spa)**
- 📱 **Technology Agnostic**
- 💪 **HTML Entry Access Mode**
- 🛡 **Style Isolation**
- 🧳 **JS Sandbox**
- ⚡ **Prefetch Assets**
- 🔌 **[Umi Plugin](https://github.com/umijs/plugins/tree/master/packages/plugin-qiankun) Integration**

## 🎯 Roadmap

- [ ] Parcel apps integration (multiple sub apps displayed at the same time, but only one uses router at most)
- [ ] Communication development kits between master and sub apps
- [ ] Custom side effects hijacker
- [ ] Nested Microfrontends

## ❓ FAQ

https://qiankun.umijs.org/faq/

## 👬 Community

https://qiankun.umijs.org/#community

## 🧑‍💻 Contributors

## 🎁 Acknowledgements

- [single-spa](https://github.com/CanopyTax/single-spa) What an awesome meta-framework for micro-frontends!
- [import-html-entry](https://github.com/kuitos/import-html-entry/) An assets loader which supports html entry.
