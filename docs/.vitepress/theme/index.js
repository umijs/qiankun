// qiankun docs theme — extends the VitePress default theme with the
// 袖里乾坤 ("a universe in every sleeve") design language.
//
// Mermaid diagrams are rendered by vitepress-plugin-mermaid (wired in
// config.mjs via withMermaid). No manual mermaid bootstrapping is needed.
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import { useData } from 'vitepress'
import './custom.css'

// Version banner: the site documents qiankun 3 while npm's `latest` tag still
// resolves to 2.x, so every page states which major it covers and how to
// install it. Drop this (and --vp-layout-top-height in custom.css) once 3.0
// ships as `latest`.
const VersionBanner = {
  setup() {
    const { lang } = useData()
    return () =>
      h('div', { class: 'qk-version-banner' }, [
        lang.value.startsWith('zh')
          ? h('span', [
              '当前文档对应 qiankun 3.0（RC），安装请使用 ',
              h('code', 'npm i qiankun@rc'),
              '；2.x 文档见 ',
              h('a', { href: 'https://v2.qiankun.umijs.org' }, 'v2 站点'),
              '。',
            ])
          : h('span', [
              'These docs cover qiankun 3.0 (RC) — install it with ',
              h('code', 'npm i qiankun@rc'),
              '. For 2.x, see the ',
              h('a', { href: 'https://v2.qiankun.umijs.org' }, 'v2 docs'),
              '.',
            ]),
      ])
  },
}

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'layout-top': () => h(VersionBanner),
    })
  },
}
