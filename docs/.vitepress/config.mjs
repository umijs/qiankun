import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

// qiankun v3 documentation — 袖里乾坤 design language (brand primary: geekblue #2F54EB)
export default withMermaid(
  defineConfig({
    title: 'qiankun',
    description: 'A complete micro-frontends solution — streaming HTML-entry loading, a Proxy-membrane JS sandbox, and native ESM execution.',
    lang: 'en-US',
    cleanUrls: true,
    ignoreDeadLinks: true,
    lastUpdated: true,
    metaChunk: true,

    head: [
      ['link', { rel: 'icon', href: '/logo.png' }],
      ['meta', { name: 'theme-color', content: '#2f54eb' }],
      ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
      ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
      ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap' }],
      ['meta', { property: 'og:type', content: 'website' }],
      ['meta', { property: 'og:title', content: 'qiankun — micro-frontends framework' }],
      ['meta', { property: 'og:description', content: 'Streaming HTML-entry loading, a Proxy-membrane JS sandbox, and native ESM execution.' }],
      ['meta', { property: 'og:image', content: '/logo.png' }],
    ],

    themeConfig: {
      logo: '/logo.png',
      search: { provider: 'local' },
      socialLinks: [{ icon: 'github', link: 'https://github.com/umijs/qiankun' }],
      outline: { level: [2, 3] },
    },

    markdown: {
      lineNumbers: true,
      theme: { light: 'github-light', dark: 'github-dark' },
    },

    sitemap: { hostname: 'https://qiankun.umijs.org' },

    locales: {
      root: {
        label: 'English',
        lang: 'en-US',
        themeConfig: {
          nav: [
        {
          "text": "Guide",
          "link": "/guide/what-is-qiankun",
          "activeMatch": "/guide/|/tutorial/|/concepts/"
        },
        {
          "text": "API",
          "link": "/api/",
          "activeMatch": "/api/"
        },
        {
          "text": "Ecosystem",
          "link": "/ecosystem/",
          "activeMatch": "/ecosystem/"
        },
        {
          "text": "Cookbook",
          "link": "/cookbook/",
          "activeMatch": "/cookbook/"
        },
        {
          "text": "FAQ",
          "link": "/faq/"
        },
        {
          "text": "v3",
          "items": [
            {
              "text": "Changelog",
              "link": "https://github.com/umijs/qiankun/releases"
            },
            {
              "text": "RFCs",
              "link": "https://github.com/umijs/qiankun/tree/next/docs/rfcs"
            },
            {
              "text": "Roadmap",
              "link": "https://github.com/umijs/qiankun/discussions/1378"
            },
            {
              "text": "Community",
              "link": "https://github.com/umijs/qiankun/discussions"
            }
          ]
        }
      ],
          sidebar: [
        {
          "text": "Introduction",
          "collapsed": false,
          "items": [
            {
              "text": "What is qiankun",
              "link": "/guide/what-is-qiankun"
            },
            {
              "text": "What is a micro-frontend",
              "link": "/guide/what-is-micro-frontend"
            },
            {
              "text": "Why not iframes",
              "link": "/guide/why-not-iframe"
            },
            {
              "text": "Getting started",
              "link": "/guide/getting-started"
            }
          ]
        },
        {
          "text": "Tutorial",
          "collapsed": false,
          "items": [
            {
              "text": "Tutorial: build a main app and a micro-app",
              "link": "/tutorial/"
            },
            {
              "text": "Step 1 — Build the micro-app",
              "link": "/tutorial/build-the-micro-app"
            },
            {
              "text": "Step 2 — Build the main app",
              "link": "/tutorial/build-the-main-app"
            },
            {
              "text": "Step 3 — Connect, run, and verify",
              "link": "/tutorial/run-and-verify"
            }
          ]
        },
        {
          "text": "Core Concepts",
          "collapsed": false,
          "items": [
            {
              "text": "Architecture overview",
              "link": "/concepts/architecture"
            },
            {
              "text": "HTML-entry streaming loading",
              "link": "/concepts/html-entry-loading"
            },
            {
              "text": "The JS sandbox",
              "link": "/concepts/js-sandbox"
            },
            {
              "text": "Style isolation",
              "link": "/concepts/style-isolation"
            },
            {
              "text": "The ESM sandbox",
              "link": "/concepts/esm-sandbox"
            },
            {
              "text": "Micro-app lifecycle and props",
              "link": "/concepts/lifecycle-and-props"
            }
          ]
        },
        {
          "text": "Reference",
          "collapsed": false,
          "items": [
            {
              "text": "API reference overview",
              "link": "/api/"
            },
            {
              "text": "registerMicroApps",
              "link": "/api/register-micro-apps"
            },
            {
              "text": "start",
              "link": "/api/start"
            },
            {
              "text": "loadMicroApp",
              "link": "/api/load-micro-app"
            },
            {
              "text": "setDefaultMountApp / runAfterFirstMounted",
              "link": "/api/effects"
            },
            {
              "text": "addErrorHandler / removeErrorHandler",
              "link": "/api/error-handling"
            },
            {
              "text": "prefetchApps (deprecated)",
              "link": "/api/prefetch-apps"
            },
            {
              "text": "isRuntimeCompatible",
              "link": "/api/is-runtime-compatible"
            },
            {
              "text": "AppConfiguration",
              "link": "/api/configuration"
            },
            {
              "text": "Lifecycle hooks (LifeCycles)",
              "link": "/api/lifecycles"
            },
            {
              "text": "Types reference",
              "link": "/api/types"
            }
          ]
        },
        {
          "text": "Ecosystem",
          "collapsed": false,
          "items": [
            {
              "text": "Ecosystem overview",
              "link": "/ecosystem/"
            },
            {
              "text": "create-qiankun",
              "link": "/ecosystem/create-qiankun"
            },
            {
              "text": "@qiankunjs/bundler-plugin (Webpack & Vite)",
              "link": "/ecosystem/bundler-plugin"
            },
            {
              "text": "<MicroApp> for React (@qiankunjs/react)",
              "link": "/ecosystem/react"
            },
            {
              "text": "<MicroApp> for Vue (@qiankunjs/vue)",
              "link": "/ecosystem/vue"
            }
          ]
        },
        {
          "text": "Cookbook",
          "collapsed": false,
          "items": [
            {
              "text": "Cookbook",
              "link": "/cookbook/"
            },
            {
              "text": "Enable CSS style isolation",
              "link": "/cookbook/enable-style-isolation"
            },
            {
              "text": "Optimize loading and preloading",
              "link": "/cookbook/optimize-loading"
            },
            {
              "text": "Handle load and runtime errors",
              "link": "/cookbook/handle-errors"
            },
            {
              "text": "Share state and communicate between apps",
              "link": "/cookbook/communicate-between-apps"
            },
            {
              "text": "Migrate from qiankun 2.x",
              "link": "/cookbook/migrate-from-2x"
            },
            {
              "text": "Make a Vite app qiankun-ready",
              "link": "/cookbook/prepare-a-vite-app"
            },
            {
              "text": "Make a Webpack app qiankun-ready",
              "link": "/cookbook/prepare-a-webpack-app"
            },
            {
              "text": "Run multiple micro-app instances",
              "link": "/cookbook/run-multiple-instances"
            }
          ]
        },
        {
          "text": "FAQ",
          "collapsed": false,
          "items": [
            {
              "text": "FAQ",
              "link": "/faq/"
            }
          ]
        }
      ],
          editLink: {
            pattern: 'https://github.com/umijs/qiankun/edit/next/docs/:path',
            text: 'Edit this page on GitHub',
          },
          footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © 2019-present qiankun contributors',
          },
        },
      },
      'zh-CN': {
        label: '简体中文',
        lang: 'zh-CN',
        description: '一套完善的微前端解决方案 — 流式 HTML Entry 加载、Proxy 隔离的 JS 沙箱与原生 ESM 执行。',
        themeConfig: {
          nav: [
        {
          "text": "指南",
          "link": "/zh-CN/guide/what-is-qiankun",
          "activeMatch": "/zh-CN/guide/|/zh-CN/tutorial/|/zh-CN/concepts/"
        },
        {
          "text": "API",
          "link": "/zh-CN/api/",
          "activeMatch": "/zh-CN/api/"
        },
        {
          "text": "生态",
          "link": "/zh-CN/ecosystem/",
          "activeMatch": "/zh-CN/ecosystem/"
        },
        {
          "text": "实践",
          "link": "/zh-CN/cookbook/",
          "activeMatch": "/zh-CN/cookbook/"
        },
        {
          "text": "常见问题",
          "link": "/zh-CN/faq/"
        },
        {
          "text": "v3",
          "items": [
            {
              "text": "更新日志",
              "link": "https://github.com/umijs/qiankun/releases"
            },
            {
              "text": "RFC 设计文档",
              "link": "https://github.com/umijs/qiankun/tree/next/docs/rfcs"
            },
            {
              "text": "路线图",
              "link": "https://github.com/umijs/qiankun/discussions/1378"
            },
            {
              "text": "社区讨论",
              "link": "https://github.com/umijs/qiankun/discussions"
            }
          ]
        }
      ],
          sidebar: [
        {
          "text": "介绍",
          "collapsed": false,
          "items": [
            {
              "text": "什么是 qiankun",
              "link": "/zh-CN/guide/what-is-qiankun"
            },
            {
              "text": "什么是微前端",
              "link": "/zh-CN/guide/what-is-micro-frontend"
            },
            {
              "text": "为什么不是 iframe",
              "link": "/zh-CN/guide/why-not-iframe"
            },
            {
              "text": "快速上手",
              "link": "/zh-CN/guide/getting-started"
            }
          ]
        },
        {
          "text": "教程",
          "collapsed": false,
          "items": [
            {
              "text": "教程总览",
              "link": "/zh-CN/tutorial/"
            },
            {
              "text": "第一步 · 搭建微应用",
              "link": "/zh-CN/tutorial/build-the-micro-app"
            },
            {
              "text": "第二步 · 搭建主应用",
              "link": "/zh-CN/tutorial/build-the-main-app"
            },
            {
              "text": "第三步 · 连接、运行与验证",
              "link": "/zh-CN/tutorial/run-and-verify"
            }
          ]
        },
        {
          "text": "核心概念",
          "collapsed": false,
          "items": [
            {
              "text": "架构概览",
              "link": "/zh-CN/concepts/architecture"
            },
            {
              "text": "HTML Entry 流式加载",
              "link": "/zh-CN/concepts/html-entry-loading"
            },
            {
              "text": "JS 沙箱",
              "link": "/zh-CN/concepts/js-sandbox"
            },
            {
              "text": "样式隔离",
              "link": "/zh-CN/concepts/style-isolation"
            },
            {
              "text": "ESM 沙箱",
              "link": "/zh-CN/concepts/esm-sandbox"
            },
            {
              "text": "生命周期与 props",
              "link": "/zh-CN/concepts/lifecycle-and-props"
            }
          ]
        },
        {
          "text": "API 参考",
          "collapsed": false,
          "items": [
            {
              "text": "API 总览",
              "link": "/zh-CN/api/"
            },
            {
              "text": "registerMicroApps",
              "link": "/zh-CN/api/register-micro-apps"
            },
            {
              "text": "start",
              "link": "/zh-CN/api/start"
            },
            {
              "text": "loadMicroApp",
              "link": "/zh-CN/api/load-micro-app"
            },
            {
              "text": "setDefaultMountApp / runAfterFirstMounted",
              "link": "/zh-CN/api/effects"
            },
            {
              "text": "addErrorHandler / removeErrorHandler",
              "link": "/zh-CN/api/error-handling"
            },
            {
              "text": "prefetchApps(废弃)",
              "link": "/zh-CN/api/prefetch-apps"
            },
            {
              "text": "isRuntimeCompatible",
              "link": "/zh-CN/api/is-runtime-compatible"
            },
            {
              "text": "AppConfiguration",
              "link": "/zh-CN/api/configuration"
            },
            {
              "text": "生命周期钩子",
              "link": "/zh-CN/api/lifecycles"
            },
            {
              "text": "类型参考",
              "link": "/zh-CN/api/types"
            }
          ]
        },
        {
          "text": "生态",
          "collapsed": false,
          "items": [
            {
              "text": "生态概览",
              "link": "/zh-CN/ecosystem/"
            },
            {
              "text": "create-qiankun",
              "link": "/zh-CN/ecosystem/create-qiankun"
            },
            {
              "text": "bundler-plugin",
              "link": "/zh-CN/ecosystem/bundler-plugin"
            },
            {
              "text": "React · <MicroApp>",
              "link": "/zh-CN/ecosystem/react"
            },
            {
              "text": "Vue · <MicroApp>",
              "link": "/zh-CN/ecosystem/vue"
            }
          ]
        },
        {
          "text": "实践指南",
          "collapsed": false,
          "items": [
            {
              "text": "实践指南总览",
              "link": "/zh-CN/cookbook/"
            },
            {
              "text": "开启样式隔离",
              "link": "/zh-CN/cookbook/enable-style-isolation"
            },
            {
              "text": "优化加载与预加载",
              "link": "/zh-CN/cookbook/optimize-loading"
            },
            {
              "text": "处理加载与运行时错误",
              "link": "/zh-CN/cookbook/handle-errors"
            },
            {
              "text": "应用间共享状态与通信",
              "link": "/zh-CN/cookbook/communicate-between-apps"
            },
            {
              "text": "从 qiankun 2.x 迁移",
              "link": "/zh-CN/cookbook/migrate-from-2x"
            },
            {
              "text": "让 Vite 应用接入",
              "link": "/zh-CN/cookbook/prepare-a-vite-app"
            },
            {
              "text": "让 Webpack 应用接入",
              "link": "/zh-CN/cookbook/prepare-a-webpack-app"
            },
            {
              "text": "运行多个微应用实例",
              "link": "/zh-CN/cookbook/run-multiple-instances"
            }
          ]
        },
        {
          "text": "常见问题",
          "collapsed": false,
          "items": [
            {
              "text": "常见问题",
              "link": "/zh-CN/faq/"
            }
          ]
        }
      ],
          editLink: {
            pattern: 'https://github.com/umijs/qiankun/edit/next/docs/:path',
            text: '在 GitHub 上编辑此页',
          },
          docFooter: { prev: '上一页', next: '下一页' },
          outline: { label: '本页目录' },
          lastUpdated: { text: '最后更新于' },
          footer: {
            message: '基于 MIT 协议发布',
            copyright: 'Copyright © 2019-present qiankun contributors',
          },
        },
      },
    },
  }),
)
