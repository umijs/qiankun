// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import { onMounted, nextTick } from 'vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router }) {
    // 路由变化时重新渲染 Mermaid
    if (typeof window !== 'undefined') {
      router.onAfterRouteChanged = () => {
        nextTick(() => {
          renderMermaidCharts()
        })
      }
    }
  },
  setup() {
    onMounted(() => {
      // 初始加载时渲染 Mermaid
      setTimeout(() => {
        renderMermaidCharts()
      }, 100)
    })
  }
}

function renderMermaidCharts() {
  if (typeof window === 'undefined' || !window.mermaid) {
    return
  }

  try {
    // 初始化 mermaid
    window.mermaid.initialize({ 
      startOnLoad: false,
      theme: 'default'
    })

    // 查找所有 mermaid 代码块
    const mermaidElements = document.querySelectorAll('pre code.language-mermaid')
    
    mermaidElements.forEach((element, index) => {
      // 如果已经渲染过，跳过
      if (element.getAttribute('data-processed') === 'true') {
        return
      }
      
      const code = element.textContent || element.innerText
      const uniqueId = `mermaid-${Date.now()}-${index}`
      
      // 创建容器
      const container = document.createElement('div')
      container.className = 'mermaid-container'
      container.id = uniqueId
      
      // 渲染图表
      window.mermaid.render(uniqueId + '-svg', code).then(({ svg }) => {
        container.innerHTML = svg
        
        // 替换原来的代码块
        const parent = element.closest('pre')
        if (parent && parent.parentNode) {
          parent.parentNode.replaceChild(container, parent)
        }
      }).catch(error => {
        console.warn('Mermaid 渲染错误:', error)
      })
      
      // 标记为已处理
      element.setAttribute('data-processed', 'true')
    })
  } catch (error) {
    console.warn('Mermaid 初始化错误:', error)
  }
} 