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
  logo: 'https://gw.alipayobjects.com/zos/bmw-prod/8a74c1d3-16f3-4719-be63-15e467a68a24/km0cv8vn_w500_h500.png',
  favicon: 'https://gw.alipayobjects.com/mdn/rms_655822/afts/img/A*4sIUQpcos_gAAAAAAAAAAAAAARQnAQ',
  theme: {
    '@c-primary': '#6451AB',
  },
  styles: [
    `html .__dumi-default-layout-hero {
      padding: 140px 0;
      background: #21144d no-repeat bottom/cover url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'%3E%3Cpolygon fill='%23f3c200' points='957 450 539 900 1396 900'/%3E%3Cpolygon fill='%23e26003' points='957 450 872.9 900 1396 900'/%3E%3Cpolygon fill='%23ecb500' points='-60 900 398 662 816 900'/%3E%3Cpolygon fill='%23d86200' points='337 900 398 662 816 900'/%3E%3Cpolygon fill='%23e4a800' points='1203 546 1552 900 876 900'/%3E%3Cpolygon fill='%23ce6400' points='1203 546 1552 900 1162 900'/%3E%3Cpolygon fill='%23dc9b00' points='641 695 886 900 367 900'/%3E%3Cpolygon fill='%23c46500' points='587 900 641 695 886 900'/%3E%3Cpolygon fill='%23d38f00' points='1710 900 1401 632 1096 900'/%3E%3Cpolygon fill='%23ba6600' points='1710 900 1401 632 1365 900'/%3E%3Cpolygon fill='%23ca8300' points='1210 900 971 687 725 900'/%3E%3Cpolygon fill='%23b16600' points='943 900 1210 900 971 687'/%3E%3C/svg%3E");;
    }
    html .__dumi-default-layout-hero h1 {
      color: #f3f3f3;
      text-shadow: 0 2px 8px rgba(0,0,0,.3);
    }
    html .__dumi-default-layout-hero .markdown {
      color: #eee;
      text-shadow: 0 2px 5px rgba(0,0,0,.3);
    }`,
  ],
  hire: {
    title: '蚂蚁体验技术部正寻觅前端',
    content: `
<p><strong>招聘团队：</strong>蚂蚁体验技术部（玉伯）- 平台前端技术部（偏右）</p>
<p><strong>招聘层级：</strong>P5 ~ P8</p>
<p><strong>\u3000技术栈：</strong>不限</p>
<p><strong>工作城市：</strong>杭州、上海、成都</p>
<p><strong>面试效率：</strong>一周面完</p>
<p><strong>团队作品：</strong></p>
<ul>
  <li>Ant Design · 西湖区最流行的设计语言</li>
  <li>Umi · 企业级前端开发框架</li>
  <li>dumi · React 组件研发工具</li>
  <li>qiankun · 微前端星星最多的库</li>
  <li>ahooks · React Hooks 库</li>
</ul>`,
    email: 'youzhi.lk@antgroup.com',
    slogan: '在寻找心仪的工作吗？',
  },
});
