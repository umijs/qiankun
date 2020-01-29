# Introduction

Qiankun is a [single-spa](https://github.com/CanopyTax/single-spa) based [Micro Frontends](https://micro-frontends.org/) to realize library, designed to help you can be more simple, painless to build a production on the front-end architecture system is available.

Qiankun hatch from ant financial technology based on micro front-end architecture cloud products unified access platform, in a number of online application fully tested and polishing, we will be the micro front kernel extracted and open source, hoping to help the community at the same time have a similar demand of the construction of the system more convenient own micro front-end system, at the same time also hope that through the help of the community will qiankun grinding is more mature and perfect.

So far, qiankun has served more than 100 online applications inside the ants, and is absolutely reliable in terms of ease of use and completeness.

## What Are Micro FrontEnds

> Techniques, strategies and recipes for building a **modern web app** with **multiple teams** that can **ship features independently**. -- [Micro Frontends](https://micro-frontends.org/)

Micro Frontends architecture has the following core values:

- technology agnostic The main framework does not limit access to the application stack, and the sub-applications have full autonomy

- independent development and deployment The sub-application warehouse is independent, and the front and rear end can be developed independently. After deployment, the main framework can be updated automatically

- incremental upgrade

In the face of various complex scenarios, it is usually difficult for us to upgrade or refactor an existing system's technical stack in full, while micro-front end is a very good means and strategy to implement progressive reconfiguration

- independent runtime State is isolated between each subapplication and is not Shared at runtime

Micro front-end application architecture is designed to solve monomer under a relatively long time span, due to the increase in the number of personnel, team participation, change, from an ordinary evolved into a boulder application ([Frontend Monolith] (HTTP: / / https://www.youtube.com/watch? After that, the application is not maintainable. This type of problem is particularly common in enterprise Web applications.

For more information about micro front end, I recommend you to read these articles:

- [Micro Frontends](https://micro-frontends.org/)
- [Micro Frontends from martinfowler.com](https://martinfowler.com/articles/micro-frontends.html)

## The Core Design Concept Of qiankun

- 🥄 simple

Since the main application and sub-applications can be technology stack independent, qiankun is just a library similar to jQuery for users. You need to call several of the apis of qiankun to complete the micro-front-end modification of the application. Meanwhile, due to the design of the qiankun's HTML entry and sandbox, the access of sub-applications is as simple as using an iframe.

- 🍡 decoupling/technology stack has nothing to do

The core goal of the microfront is to break monolabes into loosely coupled microapplications that can be autonomous, and the design of qiankun is based on this principle, such as HTML entry, sandboxes, and inter-application communication. This can ensure that the sub-application has the ability to develop and run independently.

## How Does Qiankun Works

TODO

## Why Not Iframe

See this artical [Why Not Iframe](https://www.yuque.com/kuitos/gky7yw/gesexv)

## Features

- :package: base on [single-spa](https://github.com/CanopyTax/single-spa) , provide a more out-of-the-box API.
- 🦾 HTML Entry access mode, allows you to access the son as simple application like use the iframe.
- 🛡 style isolation, ensure the application between the pillars without interfering with each other.
- 🧳 JS sandbox, to ensure that the global variable/events do not conflict between applications.
- ⚡ prefetch resources, in the browser idle time preload did not open the application resources, accelerate the application open speed.
- 🔌 umi plugin \* _, _ \* provides @ umijs/plugin - qiankun (https://github.com/umijs/umi-plugin-qiankun) for umi application a key switch into micro front-end architecture system.
