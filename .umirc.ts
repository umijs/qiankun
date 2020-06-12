import { defineConfig } from 'dumi';

export default defineConfig({
  mode: 'site',
  hash: true,
  ssr: {},
  publicPath: process.env.NOW_DEPLOY ? '/' : '/qiankun/',
  base: process.env.NOW_DEPLOY ? '/' : '/qiankun',
  resolve: {
    includes: ['docs'],
    previewLangs: [],
  },
  locales: [
    ['en', 'English'],
    ['zh', '中文'],
  ],
  navs: {
    en: [
      null,
      { title: 'Changelog', path: 'https://github.com/umijs/qiankun/releases' },
      { title: '1.x', path: 'https://v1.qiankun.umijs.org/' },
      { title: 'GitHub', path: 'https://github.com/umijs/qiankun' },
    ],
    zh: [
      null,
      { title: '发布日志', path: 'https://github.com/umijs/qiankun/releases' },
      { title: '1.x', path: 'https://v1.qiankun.umijs.org/zh/' },
      { title: 'GitHub', path: 'https://github.com/umijs/qiankun' },
    ],
  },
  metas: [
    {
      name: 'keywords',
      content:
        'microfrontend, micro frontend, micro frontends, micro-frontend, micro-frontends, microservice, javascript',
    },
  ],
  analytics: {
    ga: 'UA-157295698-1',
    baidu: '0f738d9b0ac90574c09183ea85bcfa2e',
  },
  exportStatic: {},
  logo: false,
});
