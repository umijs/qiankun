import { defineConfig } from 'dumi';

export default defineConfig({
  ssr: {},
  publicPath: process.env.NOW_DEPLOY ? '/' : '/qiankun/',
  base: process.env.NOW_DEPLOY ? '/' : '/qiankun',
  resolve: {
    docDirs: ['docs'],
    codeBlockMode: 'passive',
  },
  locales: [
    { id: 'zh-CN', name: '中文' },
    { id: 'en', name: 'English' },
  ],
  themeConfig: {
    logo: 'https://gw.alipayobjects.com/zos/bmw-prod/8a74c1d3-16f3-4719-be63-15e467a68a24/km0cv8vn_w500_h500.png',
    nav: {
      mode: 'append',
      value: {
        'zh-CN': [
          {
            title: '版本公告',
            children: [
              { title: '发布日志', link: 'https://github.com/umijs/qiankun/releases' },
              { title: '升级指南', link: '/zh/cookbook#从-1x-版本升级到-2x-版本' },
              { title: '1.x 版本', link: 'https://v1.qiankun.umijs.org/zh/' },
            ],
          },
          { title: 'GitHub', link: 'https://github.com/umijs/qiankun' },
        ],
        en: [
          {
            title: 'Version Notice',
            children: [
              { title: 'Changelog', link: 'https://github.com/umijs/qiankun/releases' },
              { title: 'Upgrade Guide', link: '/cookbook#upgrade-from-1x-version-to-2x-version' },
              { title: '1.x Version', link: 'https://v1.qiankun.umijs.org/' },
            ],
          },
          { title: 'GitHub', link: 'https://github.com/umijs/qiankun' },
        ],
      },
    },
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
  favicons: ['https://gw.alipayobjects.com/mdn/rms_655822/afts/img/A*4sIUQpcos_gAAAAAAAAAAAAAARQnAQ'],
  theme: {
    '@c-primary': '#6451AB',
  },
});
