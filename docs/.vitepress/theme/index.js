// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme';
import { onMounted, nextTick } from 'vue';

let mermaidPromise;

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router }) {
    // 路由变化时重新渲染 Mermaid
    if (typeof window !== 'undefined') {
      router.onAfterRouteChanged = () => {
        nextTick(() => {
          void renderMermaidCharts();
        });
      };
    }
  },
  setup() {
    onMounted(() => {
      // 初始加载时渲染 Mermaid
      setTimeout(() => {
        void renderMermaidCharts();
      }, 100);
    });
  },
};

async function renderMermaidCharts() {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    mermaidPromise ??= import('mermaid').then(({ default: mermaid }) => mermaid);
    const mermaid = await mermaidPromise;

    // 初始化 mermaid
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
    });

    // 查找所有 mermaid 代码块
    const mermaidElements = document.querySelectorAll('.language-mermaid > pre > code');

    mermaidElements.forEach((element, index) => {
      // 如果已经渲染过，跳过
      if (element.getAttribute('data-processed') === 'true') {
        return;
      }

      const code = element.textContent || element.innerText;
      const uniqueId = `mermaid-${Date.now()}-${index}`;

      // 创建容器
      const container = document.createElement('div');
      container.className = 'mermaid-container';
      container.id = uniqueId;

      // 渲染图表
      mermaid
        .render(uniqueId + '-svg', code)
        .then(({ svg }) => {
          container.innerHTML = svg;

          // 替换原来的代码块
          const codeBlock = element.closest('.language-mermaid');
          if (codeBlock?.parentNode) {
            codeBlock.parentNode.replaceChild(container, codeBlock);
          }
        })
        .catch((error) => {
          console.warn('Mermaid 渲染错误:', error);
        });

      // 标记为已处理
      element.setAttribute('data-processed', 'true');
    });
  } catch (error) {
    console.warn('Mermaid 初始化错误:', error);
  }
}
