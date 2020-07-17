---
nav:
  order: 0
toc: menu
---

# Introduction

Qiankun is an implementation of [Micro Frontends](https://micro-frontends.org/), which based on [single-spa](https://github.com/CanopyTax/single-spa). It aims to make it easier and painless to build a production-ready microfront-end architecture system.

Qiankun hatched from [Ant Financial](https://en.wikipedia.org/wiki/Ant_Financial)’s unified front-end platform for cloud products based on micro-frontends architecture. After full testing and polishing of a number of online applications, we extracted its micro-frontends kernel and open sourced it. We hope to help the systems who has the same requirement more convenient to build its own micro-frontends application in the community. At the same time, with the help of community, qiankun will be polished and improved.

At present qiankun has served more than 200 online applications inside Ant, and it is definitely trustworthy in terms of ease of use and completeness.

## What Are Micro FrontEnds

> Techniques, strategies and recipes for building a **modern web app** with **multiple teams** that can **ship features independently**. -- [Micro Frontends](https://micro-frontends.org/)

Micro Frontends architecture has the following core values:

- Technology Agnostic

  The main framework does not restrict access to the technology stack of the application, and the sub-applications have full autonomy.

- Independent Development and Deployment

  The sub application repo is independent, and the frontend and backend can be independently developed. After deployment, the main framework can be updated automatically.

- Incremental Upgrade

  In the face of various complex scenarios, it is often difficult for us to upgrade or refactor the entire technology stack of an existing system. Micro frontends is a very good method and strategy for implementing progressive refactoring.

- Isolated Runtime

  State is isolated between each subapplication and no shared runtime state.

The micro-frontends architecture is designed to solve the application of a single application in a relatively long time span. As a result of the increase in the number of people and teams involved, it has evolved from a common application to a [Frontend Monolith](https://www.youtube.com/watch?v=pU1gXA0rfwc) then becomes unmaintainable. Such a problem is especially common in enterprise web applications.

For more related introductions about micro frontends, I recommend that you check out these articles:

- [Micro Frontends](https://micro-frontends.org/)
- [Micro Frontends from martinfowler.com](https://martinfowler.com/articles/micro-frontends.html)

## Core Design Philosophy Of qiankun

- 🥄 Simple

  Since the main application sub-applications can be independent of the technology stack, qiankun is just a jQuery-like library for users. You need to call several qiankun APIs to complete the micro frontends transformation of your application. At the same time, due to the design of qiankun's HTML entry and sandbox, accessing sub-applications is as simple as using an iframe.

- 🍡 Decoupling/Technology Agnostic

  As the core goal of the micro frontends is to disassemble the monolithic application into a number of loosely coupled micro applications that can be autonomous, all the designs of qiankun are follow this principle, such as HTML Entry, sandbox, and communicating mechanism between applications. Only in this way can we ensure that sub-applications truly have the ability to develop and run independently.

## How Does Qiankun Works

TODO

## Why Not Iframe

Check this article [Why Not Iframe](https://www.yuque.com/kuitos/gky7yw/gesexv)

## Features

- 📦 **Based On [single-spa](https://github.com/CanopyTax/single-spa)** , provide a more out-of-box APIs.
- 📱 **Technology Agnostic**，any javascript framework can use/integrate, whether React/Vue/Angular/JQuery or the others.
- 💪 **HTML Entry access mode**, allows you to access the son as simple application like use the iframe.
- 🛡 **Style Isolation**, make sure styles don't interfere with each other.
- 🧳 **JS Sandbox**, ensure that global variables/events do not conflict between sub-applications.
- ⚡ **Prefetch Assets**, prefetch unopened sub-application assets during the browser idle time to speed up the sub-application opening speed.
- 🔌 **Umi Plugin**, [@umijs/plugin-qiankun](https://github.com/umijs/plugins/tree/master/packages/plugin-qiankun) is provided for umi applications to switch to a micro frontends architecture system with one line code.
