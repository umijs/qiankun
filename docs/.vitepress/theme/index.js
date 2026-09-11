// qiankun docs theme — extends the VitePress default theme with the
// 袖里乾坤 ("a universe in every sleeve") design language.
//
// Mermaid diagrams are rendered by vitepress-plugin-mermaid (wired in
// config.mjs via withMermaid). No manual mermaid bootstrapping is needed.
import DefaultTheme from 'vitepress/theme';
import './custom.css';

export default {
  extends: DefaultTheme,
};
