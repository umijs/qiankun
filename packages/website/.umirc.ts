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
      {
        title: 'Version Notice',
        children: [
          { title: 'Changelog', path: 'https://github.com/umijs/qiankun/releases' },
          { title: 'Upgrade Guide', path: '/cookbook#upgrade-from-1x-version-to-2x-version' },
          { title: '1.x Version', path: 'https://v1.qiankun.umijs.org/' },
        ],
      },
      { title: 'GitHub', path: 'https://github.com/umijs/qiankun' },
    ],
    zh: [
      null,
      {
        title: '版本公告',
        children: [
          { title: '发布日志', path: 'https://github.com/umijs/qiankun/releases' },
          { title: '升级指南', path: '/zh/cookbook#从-1x-版本升级到-2x-版本' },
          { title: '1.x 版本', path: 'https://v1.qiankun.umijs.org/zh/' },
        ],
      },
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
