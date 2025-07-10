import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'qiankun',
  description: 'Probably the most complete micro-frontends solution you ever met🧐',
  
  // Default to English
  lang: 'en-US',
  
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }],
    ['meta', { name: 'theme-color', content: '#646cff' }],
    ['meta', { property: 'og:title', content: 'qiankun' }],
    ['meta', { property: 'og:description', content: 'Probably the most complete micro-frontends solution you ever met🧐' }],
    ['meta', { property: 'og:image', content: '/logo.png' }]
  ],

  locales: {
    root: {
      label: 'English',
      lang: 'en',
      title: 'qiankun',
      description: 'Probably the most complete micro-frontends solution you ever met🧐',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/guide/' },
          { text: 'API', link: '/api/' },
          { text: 'Ecosystem', link: '/ecosystem/' },
          { text: 'Cookbook', link: '/cookbook/' },
          { text: 'FAQ', link: '/faq/' },
          {
            text: 'Links',
            items: [
              { text: 'GitHub', link: 'https://github.com/umijs/qiankun' },
              { text: 'Changelog', link: 'https://github.com/umijs/qiankun/releases' },
              { text: 'Community', link: 'https://github.com/umijs/qiankun/discussions' },
            ]
          }
        ],
        sidebar: {
          '/guide/': [
            {
              text: 'Introduction',
              items: [
                { text: 'What is qiankun?', link: '/guide/' },
                { text: 'Quick Start', link: '/guide/quick-start' },
                { text: 'Tutorial', link: '/guide/tutorial' },
              ]
            }
          ],
          '/api/': [
            {
              text: 'Core APIs',
              items: [
                { text: 'Overview', link: '/api/' },
                { text: 'registerMicroApps', link: '/api/register-micro-apps' },
                { text: 'loadMicroApp', link: '/api/load-micro-app' },
                { text: 'start', link: '/api/start' },
                { text: 'isRuntimeCompatible', link: '/api/is-runtime-compatible' },
              ]
            },
            {
              text: 'Reference',
              items: [
                { text: 'Lifecycles', link: '/api/lifecycles' },
                { text: 'Configuration', link: '/api/configuration' },
                { text: 'Types', link: '/api/types' },
              ]
            }
          ],
          '/ecosystem/': [
            {
              text: 'UI Bindings',
              items: [
                { text: 'Overview', link: '/ecosystem/' },
                { text: 'React', link: '/ecosystem/react' },
                { text: 'Vue', link: '/ecosystem/vue' },
              ]
            },
            {
              text: 'Tools',
              items: [
                { text: 'Webpack Plugin', link: '/ecosystem/webpack-plugin' },
                { text: 'Create Qiankun', link: '/ecosystem/create-qiankun' },
              ]
            }
          ],
          '/cookbook/': [
            {
              text: 'Best Practices',
              items: [
                { text: 'Overview', link: '/cookbook/' },
                { text: 'Style Isolation', link: '/cookbook/style-isolation' },
                { text: 'Performance', link: '/cookbook/performance' },
                { text: 'Error Handling', link: '/cookbook/error-handling' },
              ]
            }
          ]
        }
      }
    },
    'zh-CN': {
      label: '中文',
      lang: 'zh-CN',
      title: 'qiankun',
      description: '可能是你见过最完善的微前端解决方案🧐',
      themeConfig: {
        nav: [
          { text: '指南', link: '/zh-CN/guide/' },
          { text: 'API', link: '/zh-CN/api/' },
          { text: '生态系统', link: '/zh-CN/ecosystem/' },
          { text: '最佳实践', link: '/zh-CN/cookbook/' },
          { text: '常见问题', link: '/zh-CN/faq/' },
          {
            text: '相关链接',
            items: [
              { text: 'GitHub', link: 'https://github.com/umijs/qiankun' },
              { text: '更新日志', link: 'https://github.com/umijs/qiankun/releases' },
              { text: '社区讨论', link: 'https://github.com/umijs/qiankun/discussions' },
            ]
          }
        ],
        sidebar: {
          '/zh-CN/guide/': [
            {
              text: '介绍',
              items: [
                { text: '什么是 qiankun?', link: '/zh-CN/guide/' },
                { text: '快速开始', link: '/zh-CN/guide/quick-start' },
                { text: '详细教程', link: '/zh-CN/guide/tutorial' },
              ]
            }
          ],
          '/zh-CN/api/': [
            {
              text: '核心 API',
              items: [
                { text: '概览', link: '/zh-CN/api/' },
                { text: 'registerMicroApps', link: '/zh-CN/api/register-micro-apps' },
                { text: 'loadMicroApp', link: '/zh-CN/api/load-micro-app' },
                { text: 'start', link: '/zh-CN/api/start' },
                { text: 'isRuntimeCompatible', link: '/zh-CN/api/is-runtime-compatible' },
              ]
            }
          ],
          '/zh-CN/ecosystem/': [
            {
              text: 'UI 绑定',
              items: [
                { text: '概览', link: '/zh-CN/ecosystem/' },
                { text: 'React', link: '/zh-CN/ecosystem/react' },
                { text: 'Vue', link: '/zh-CN/ecosystem/vue' },
              ]
            }
          ],
          '/zh-CN/cookbook/': [
            {
              text: '最佳实践',
              items: [
                { text: '概览', link: '/zh-CN/cookbook/' },
                { text: '常见问题', link: '/zh-CN/cookbook/error-handling' },
              ]
            }
          ],
          '/zh-CN/faq/': [
            {
              text: '常见问题',
              items: [
                { text: 'FAQ', link: '/zh-CN/faq/' },
              ]
            }
          ]
        }
      }
    }
  },

  themeConfig: {
    logo: '/logo.png',
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/umijs/qiankun' }
    ],

    search: {
      provider: 'local'
    },

    editLink: {
      pattern: 'https://github.com/umijs/qiankun/edit/next/docs/:path',
      text: 'Edit this page on GitHub'
    },

    lastUpdated: {
      text: 'Last updated',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2019-present qiankun contributors'
    }
  },

  markdown: {
    lineNumbers: true,
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  },

  cleanUrls: true,
  
  sitemap: {
    hostname: 'https://qiankun.umijs.org'
  },

  ignoreDeadLinks: true
})