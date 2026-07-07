// qiankun docs theme — extends the VitePress default theme with the
// 袖里乾坤 ("a universe in every sleeve") design language.
//
// Mermaid diagrams are rendered by vitepress-plugin-mermaid (wired in
// config.mjs via withMermaid). No manual mermaid bootstrapping is needed.
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    // A faint 乾坤 seal watermark sits behind the home hero only.
    return h(DefaultTheme.Layout, null, {
      'home-hero-before': () =>
        h('div', { class: 'qk-hero-watermark', 'aria-hidden': 'true' }, '乾坤'),
    })
  },
}
