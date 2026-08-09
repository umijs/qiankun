import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

const enNav = [
  { text: 'Get started', link: '/guide/getting-started', activeMatch: '^/(guide|tutorial)/' },
  { text: 'Cookbook', link: '/cookbook/', activeMatch: '^/cookbook/' },
  { text: 'Concepts', link: '/concepts/architecture', activeMatch: '^/concepts/' },
  { text: 'API', link: '/api/', activeMatch: '^/api/' },
  { text: 'Ecosystem', link: '/ecosystem/', activeMatch: '^/ecosystem/' },
  {
    text: 'More',
    items: [
      { text: 'FAQ', link: '/faq/' },
      { text: 'Runtime internals', link: '/internals/' },
      { text: 'Live examples', link: 'https://examples.qiankunjs.com' },
      { text: 'Releases', link: 'https://github.com/umijs/qiankun/releases' },
      { text: 'RFCs', link: 'https://github.com/umijs/qiankun/tree/next/docs/rfcs' },
      { text: 'Roadmap', link: 'https://github.com/umijs/qiankun/discussions/1378' },
      { text: 'Community', link: 'https://github.com/umijs/qiankun/discussions' },
      { text: 'Contributing', link: 'https://github.com/umijs/qiankun/blob/next/.github/CONTRIBUTING.md' },
    ],
  },
]

const enSidebar = {
  '/guide/': [
    {
      text: 'Start here',
      items: [
        { text: 'What is qiankun?', link: '/guide/what-is-qiankun' },
        { text: 'Get started in 5 minutes', link: '/guide/getting-started' },
        { text: 'Browser support', link: '/guide/browser-support' },
      ],
    },
    {
      text: 'Build it yourself',
      collapsed: true,
      items: [
        { text: 'Tutorial overview', link: '/tutorial/' },
        { text: '1. Prepare the micro-app', link: '/tutorial/build-the-micro-app' },
        { text: '2. Load it from the host', link: '/tutorial/build-the-main-app' },
        { text: '3. Run and verify', link: '/tutorial/run-and-verify' },
      ],
    },
  ],
  '/tutorial/': [
    {
      text: 'Tutorial',
      items: [
        { text: 'Overview', link: '/tutorial/' },
        { text: '1. Prepare the micro-app', link: '/tutorial/build-the-micro-app' },
        { text: '2. Load it from the host', link: '/tutorial/build-the-main-app' },
        { text: '3. Run and verify', link: '/tutorial/run-and-verify' },
      ],
    },
  ],
  '/concepts/': [
    {
      text: 'Core concepts',
      items: [
        { text: 'Loading a micro-app instance', link: '/concepts/architecture' },
        { text: 'Lifecycle and props', link: '/concepts/lifecycle-and-props' },
        { text: 'HTML Entry and execution', link: '/concepts/html-entry-loading' },
        { text: 'JavaScript isolation', link: '/concepts/js-sandbox' },
        { text: 'Style isolation', link: '/concepts/style-isolation' },
        { text: 'Native ESM support', link: '/concepts/esm-sandbox' },
      ],
    },
    {
      text: 'Go deeper',
      collapsed: true,
      items: [{ text: 'Runtime internals', link: '/internals/' }],
    },
  ],
  '/cookbook/': [
    {
      text: 'Cookbook',
      items: [
        { text: 'Overview', link: '/cookbook/' },
        { text: 'Prepare a Vite app', link: '/cookbook/prepare-a-vite-app' },
        { text: 'Prepare a Webpack app', link: '/cookbook/prepare-a-webpack-app' },
        { text: 'Share state and communicate', link: '/cookbook/communicate-between-apps' },
        { text: 'Handle errors', link: '/cookbook/handle-errors' },
        { text: 'Enable style isolation', link: '/cookbook/enable-style-isolation' },
        { text: 'Optimize loading', link: '/cookbook/optimize-loading' },
        { text: 'Run multiple instances', link: '/cookbook/run-multiple-instances' },
        { text: 'Extend the sandbox with plugins', link: '/cookbook/sandbox-plugins' },
        { text: 'Use the sandbox standalone', link: '/cookbook/standalone-sandbox' },
        { text: 'Migrate from qiankun 2.x', link: '/cookbook/migrate-from-2x' },
      ],
    },
  ],
  '/api/': [
    {
      text: 'Recommended loading API',
      items: [
        { text: 'API overview', link: '/api/' },
        { text: 'loadMicroApp', link: '/api/load-micro-app' },
        { text: 'AppConfiguration', link: '/api/configuration' },
        { text: 'Lifecycle hooks', link: '/api/lifecycles' },
        { text: 'Types', link: '/api/types' },
      ],
    },
    {
      text: 'Route-driven alternative',
      collapsed: true,
      items: [
        { text: 'registerMicroApps', link: '/api/register-micro-apps' },
        { text: 'start', link: '/api/start' },
        { text: 'Route effects', link: '/api/effects' },
      ],
    },
    {
      text: 'Other APIs',
      collapsed: true,
      items: [
        { text: 'Error handling', link: '/api/error-handling' },
        { text: 'Runtime compatibility', link: '/api/is-runtime-compatible' },
        { text: 'prefetchApps (deprecated)', link: '/api/prefetch-apps' },
      ],
    },
  ],
  '/ecosystem/': [
    {
      text: 'Ecosystem',
      items: [
        { text: 'Overview', link: '/ecosystem/' },
        { text: 'create-qiankun', link: '/ecosystem/create-qiankun' },
        { text: 'Bundler plugin', link: '/ecosystem/bundler-plugin' },
        { text: '<MicroApp> for React', link: '/ecosystem/react' },
        { text: '<MicroApp> for Vue', link: '/ecosystem/vue' },
      ],
    },
  ],
  '/internals/': [
    {
      text: 'Runtime internals',
      collapsed: true,
      items: [
        { text: 'Overview', link: '/internals/' },
        { text: 'Runtime orchestration', link: '/internals/runtime-orchestration' },
        { text: 'Lifecycle resolution', link: '/internals/lifecycle-resolution' },
        { text: 'Streaming HTML Entry', link: '/internals/streaming-html-entry' },
        { text: 'JavaScript sandbox', link: '/internals/js-sandbox' },
        { text: 'Style isolation', link: '/internals/style-isolation' },
        { text: 'ESM sandbox', link: '/internals/esm-sandbox' },
      ],
    },
  ],
  '/faq/': [{ text: 'Support', items: [{ text: 'FAQ', link: '/faq/' }] }],
}

const zhNav = [
  { text: '开始使用', link: '/zh-CN/guide/getting-started', activeMatch: '^/zh-CN/(guide|tutorial)/' },
  { text: '实用指南', link: '/zh-CN/cookbook/', activeMatch: '^/zh-CN/cookbook/' },
  { text: '核心概念', link: '/zh-CN/concepts/architecture', activeMatch: '^/zh-CN/concepts/' },
  { text: 'API', link: '/zh-CN/api/', activeMatch: '^/zh-CN/api/' },
  { text: '生态', link: '/zh-CN/ecosystem/', activeMatch: '^/zh-CN/ecosystem/' },
  {
    text: '更多',
    items: [
      { text: '常见问题', link: '/zh-CN/faq/' },
      { text: '运行时实现', link: '/zh-CN/internals/' },
      { text: '在线示例', link: 'https://examples.qiankunjs.com' },
      { text: '更新日志', link: 'https://github.com/umijs/qiankun/releases' },
      { text: 'RFC 设计文档', link: 'https://github.com/umijs/qiankun/tree/next/docs/rfcs' },
      { text: '路线图', link: 'https://github.com/umijs/qiankun/discussions/1378' },
      { text: '社区讨论', link: 'https://github.com/umijs/qiankun/discussions' },
      { text: '参与贡献', link: 'https://github.com/umijs/qiankun/blob/next/.github/CONTRIBUTING.md' },
    ],
  },
]

const zhSidebar = {
  '/zh-CN/guide/': [
    {
      text: '从这里开始',
      items: [
        { text: '什么是 qiankun', link: '/zh-CN/guide/what-is-qiankun' },
        { text: '快速上手', link: '/zh-CN/guide/getting-started' },
        { text: '浏览器支持', link: '/zh-CN/guide/browser-support' },
      ],
    },
    {
      text: '手动搭建',
      collapsed: true,
      items: [
        { text: '教程总览', link: '/zh-CN/tutorial/' },
        { text: '1. 准备微应用', link: '/zh-CN/tutorial/build-the-micro-app' },
        { text: '2. 从主应用加载', link: '/zh-CN/tutorial/build-the-main-app' },
        { text: '3. 运行与验证', link: '/zh-CN/tutorial/run-and-verify' },
      ],
    },
  ],
  '/zh-CN/tutorial/': [
    {
      text: '教程',
      items: [
        { text: '总览', link: '/zh-CN/tutorial/' },
        { text: '1. 准备微应用', link: '/zh-CN/tutorial/build-the-micro-app' },
        { text: '2. 从主应用加载', link: '/zh-CN/tutorial/build-the-main-app' },
        { text: '3. 运行与验证', link: '/zh-CN/tutorial/run-and-verify' },
      ],
    },
  ],
  '/zh-CN/concepts/': [
    {
      text: '核心概念',
      items: [
        { text: '加载一个微应用实例', link: '/zh-CN/concepts/architecture' },
        { text: '生命周期与 props', link: '/zh-CN/concepts/lifecycle-and-props' },
        { text: 'HTML Entry 与执行', link: '/zh-CN/concepts/html-entry-loading' },
        { text: 'JavaScript 隔离', link: '/zh-CN/concepts/js-sandbox' },
        { text: '样式隔离', link: '/zh-CN/concepts/style-isolation' },
        { text: '原生 ESM 支持', link: '/zh-CN/concepts/esm-sandbox' },
      ],
    },
    {
      text: '深入了解',
      collapsed: true,
      items: [{ text: '运行时实现', link: '/zh-CN/internals/' }],
    },
  ],
  '/zh-CN/cookbook/': [
    {
      text: '实用指南',
      items: [
        { text: '指南索引', link: '/zh-CN/cookbook/' },
        { text: '接入 Vite 应用', link: '/zh-CN/cookbook/prepare-a-vite-app' },
        { text: '接入 Webpack 应用', link: '/zh-CN/cookbook/prepare-a-webpack-app' },
        { text: '应用间通信', link: '/zh-CN/cookbook/communicate-between-apps' },
        { text: '错误处理', link: '/zh-CN/cookbook/handle-errors' },
        { text: '开启样式隔离', link: '/zh-CN/cookbook/enable-style-isolation' },
        { text: '优化加载', link: '/zh-CN/cookbook/optimize-loading' },
        { text: '运行多个实例', link: '/zh-CN/cookbook/run-multiple-instances' },
        { text: '用插件扩展沙箱', link: '/zh-CN/cookbook/sandbox-plugins' },
        { text: '独立使用沙箱', link: '/zh-CN/cookbook/standalone-sandbox' },
        { text: '从 qiankun 2.x 迁移', link: '/zh-CN/cookbook/migrate-from-2x' },
      ],
    },
  ],
  '/zh-CN/api/': [
    {
      text: '推荐加载 API',
      items: [
        { text: 'API 总览', link: '/zh-CN/api/' },
        { text: 'loadMicroApp', link: '/zh-CN/api/load-micro-app' },
        { text: 'AppConfiguration', link: '/zh-CN/api/configuration' },
        { text: '生命周期钩子', link: '/zh-CN/api/lifecycles' },
        { text: '类型参考', link: '/zh-CN/api/types' },
      ],
    },
    {
      text: '路由驱动替代方案',
      collapsed: true,
      items: [
        { text: 'registerMicroApps', link: '/zh-CN/api/register-micro-apps' },
        { text: 'start', link: '/zh-CN/api/start' },
        { text: '路由辅助 API', link: '/zh-CN/api/effects' },
      ],
    },
    {
      text: '其他 API',
      collapsed: true,
      items: [
        { text: '错误处理', link: '/zh-CN/api/error-handling' },
        { text: '运行时兼容性', link: '/zh-CN/api/is-runtime-compatible' },
        { text: 'prefetchApps（已废弃）', link: '/zh-CN/api/prefetch-apps' },
      ],
    },
  ],
  '/zh-CN/ecosystem/': [
    {
      text: '生态',
      items: [
        { text: '概览', link: '/zh-CN/ecosystem/' },
        { text: 'create-qiankun', link: '/zh-CN/ecosystem/create-qiankun' },
        { text: 'Bundler 插件', link: '/zh-CN/ecosystem/bundler-plugin' },
        { text: 'React <MicroApp>', link: '/zh-CN/ecosystem/react' },
        { text: 'Vue <MicroApp>', link: '/zh-CN/ecosystem/vue' },
      ],
    },
  ],
  '/zh-CN/internals/': [
    {
      text: '运行时实现',
      collapsed: true,
      items: [
        { text: '概览', link: '/zh-CN/internals/' },
        { text: '运行时编排', link: '/zh-CN/internals/runtime-orchestration' },
        { text: '生命周期解析', link: '/zh-CN/internals/lifecycle-resolution' },
        { text: '流式 HTML Entry', link: '/zh-CN/internals/streaming-html-entry' },
        { text: 'JavaScript 沙箱', link: '/zh-CN/internals/js-sandbox' },
        { text: '样式隔离', link: '/zh-CN/internals/style-isolation' },
        { text: 'ESM 沙箱', link: '/zh-CN/internals/esm-sandbox' },
      ],
    },
  ],
  '/zh-CN/faq/': [{ text: '支持', items: [{ text: '常见问题', link: '/zh-CN/faq/' }] }],
}

export default withMermaid(
  defineConfig({
    title: 'qiankun',
    description: 'Load, compose, and isolate independently delivered micro-apps in one page.',
    lang: 'en-US',
    cleanUrls: true,
    ignoreDeadLinks: 'localhostLinks',
    lastUpdated: true,
    metaChunk: true,
    // RFCs are design discussions that live on GitHub; keep them out of the
    // built site (and out of local search) so drafts are never published.
    srcExclude: ['rfcs/**'],

    transformPageData(pageData, { siteConfig }) {
      const isZh = pageData.relativePath.startsWith('zh-CN/')
      const head = (pageData.frontmatter.head ??= [])
      const title = pageData.title ? `${pageData.title} | qiankun` : 'qiankun'
      const description =
        pageData.description ||
        (isZh
          ? siteConfig.site.locales['zh-CN'].description
          : siteConfig.site.description)
      head.push(
        ['meta', { property: 'og:locale', content: isZh ? 'zh_CN' : 'en_US' }],
        ['meta', { property: 'og:title', content: title }],
        ['meta', { property: 'og:description', content: description }],
      )
    },

    head: [
      ['link', { rel: 'icon', href: '/logo.png' }],
      ['meta', { name: 'theme-color', content: '#2f54eb' }],
      // fonts.googleapis.cn / fonts.gstatic.cn are Google Fonts' China-reachable
      // mirrors — the .com domains stall for the primary (mainland) audience.
      ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.cn' }],
      ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.cn', crossorigin: '' }],
      [
        'link',
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.cn/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap',
        },
      ],
      ['meta', { property: 'og:type', content: 'website' }],
      ['meta', { property: 'og:site_name', content: 'qiankun' }],
      ['meta', { property: 'og:image', content: 'https://qiankun.umijs.org/logo.png' }],
      [
        'script',
        {},
        // First-visit language negotiation: only on the root landing page, once
        // per browser (cookie), so deep links and explicit choices are untouched.
        `if(location.pathname==='/'&&!document.cookie.includes('qk_lang=')&&/^zh\\b/i.test(navigator.language)){document.cookie='qk_lang=zh;path=/;max-age=31536000';location.replace('/zh-CN/')}`,
      ],
    ],

    themeConfig: {
      logo: '/logo.png',
      search: {
        provider: 'local',
        options: {
          // miniSearch tokenizes on whitespace by default, which makes Chinese
          // content unsearchable. Index CJK text per character and AND-combine
          // query terms so multi-character queries still match precisely.
          miniSearch: {
            options: {
              tokenize: (text) =>
                (text.match(/[㐀-鿿豈-﫿]|[^\s\p{P}㐀-鿿豈-﫿]+/gu) ?? []).filter(
                  Boolean,
                ),
            },
            searchOptions: { combineWith: 'AND', fuzzy: 0.2, prefix: true },
          },
          locales: {
            'zh-CN': {
              translations: {
                button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
                modal: {
                  displayDetails: '显示详细列表',
                  resetButtonTitle: '清除查询条件',
                  backButtonTitle: '关闭搜索',
                  noResultsText: '未找到相关结果',
                  footer: {
                    selectText: '选择',
                    selectKeyAriaLabel: '回车',
                    navigateText: '切换',
                    navigateUpKeyAriaLabel: '上方向键',
                    navigateDownKeyAriaLabel: '下方向键',
                    closeText: '关闭',
                    closeKeyAriaLabel: 'esc',
                  },
                },
              },
            },
          },
        },
      },
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
          nav: enNav,
          sidebar: enSidebar,
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
        description: '在同一页面中按需加载、组合并隔离独立交付的微应用。',
        themeConfig: {
          nav: zhNav,
          sidebar: zhSidebar,
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
