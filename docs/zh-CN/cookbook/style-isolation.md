# 样式隔离

样式隔离是微前端架构中最关键的方面之一。当多个应用在同一浏览器上下文中运行时，CSS 冲突可能导致视觉不一致和布局错误。本指南涵盖了在 qiankun 应用中实现有效样式隔离的各种策略。

## 🎯 理解问题

### 微前端中的 CSS 冲突

当多个微应用加载到同一页面时，它们共享相同的全局 CSS 命名空间。这可能导致：

- **样式覆盖**：后加载的应用覆盖早期样式
- **选择器冲突**：相同的类名造成意外样式
- **全局污染**：微应用影响主应用样式
- **布局破坏**：由于样式冲突导致的意外布局变化

### CSS 冲突示例

```css
/* 主应用 */
.button {
  background: blue;
  padding: 10px;
}

/* 微应用 */
.button {
  background: red; /* 这将覆盖主应用样式！ */
  border: none;
}
```

## 🛡️ qiankun 的内置样式隔离

qiankun 提供了内置的样式隔离机制，您可以通过 `sandbox` 配置启用。

### styleIsolation

基于原生 CSS `@scope` 规则的运行时样式隔离：

```javascript
import { loadMicroApp } from 'qiankun';

loadMicroApp(app, {
  sandbox: {
    styleIsolation: true
  }
});
```

或者在注册应用时按应用配置：

```javascript
import { registerMicroApps } from 'qiankun';

registerMicroApps([
  {
    name: 'scoped-app',
    entry: '//localhost:8080',
    container: '#container',
    activeRule: '/scoped-app',
    configuration: {
      sandbox: {
        styleIsolation: true
      }
    }
  }
]);
```

**工作原理：**
- 把每个微应用样式表包进绑定到应用容器的 CSS `@scope` 规则
- 入口 HTML 中的静态样式在流式加载时由 loader 完成 scope 包裹
- 运行时动态注入的样式由沙箱的 DOM 拦截捕获并做同样处理
- 保持 DOM 结构

**优点：**
- 原生浏览器作用域能力——无需改写选择器
- 良好的第三方库兼容性
- 易于调试，性能开销低

**注意：** `styleIsolation` 位于 `sandbox` 配置内，因为动态注入的样式依赖沙箱的 DOM 拦截——CSS 隔离只在 JS 沙箱开启时可用。若没有沙箱，动态样式会静默泄漏。

## 🎨 CSS-in-JS 解决方案

CSS-in-JS 库通过生成唯一的类名提供天然的样式隔离。

### Styled Components

```jsx
// 使用 Styled Components 的微应用
import styled from 'styled-components';

const Button = styled.button`
  background: ${props => props.primary ? 'blue' : 'grey'};
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  
  &:hover {
    opacity: 0.8;
  }
`;

function MyComponent() {
  return (
    <div>
      <Button primary>主按钮</Button>
      <Button>次要按钮</Button>
    </div>
  );
}
```

### Emotion

```jsx
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const buttonStyle = css`
  background: blue;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  
  &:hover {
    background: darkblue;
  }
`;

function MyComponent() {
  return <button css={buttonStyle}>点击我</button>;
}
```

### 动态导入的 CSS 模块

```css
/* Button.module.css */
.button {
  background: blue;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
}

.button:hover {
  background: darkblue;
}
```

```jsx
// Button.jsx
import styles from './Button.module.css';

function Button({ children, ...props }) {
  return (
    <button className={styles.button} {...props}>
      {children}
    </button>
  );
}
```

## 🏗️ CSS 作用域策略

### BEM 方法论

使用 Block、Element、Modifier 命名约定避免冲突：

```css
/* 主应用 */
.main-app__button {
  background: blue;
}

.main-app__button--primary {
  background: darkblue;
}

/* 微应用 */
.micro-app__button {
  background: red;
}

.micro-app__button--large {
  padding: 15px 30px;
}
```

### 命名空间前缀

为所有 CSS 类添加唯一前缀：

```css
/* 用户管理微应用 */
.user-mgmt-container { }
.user-mgmt-header { }
.user-mgmt-button { }

/* 产品目录微应用 */
.product-cat-container { }
.product-cat-header { }
.product-cat-button { }
```

### CSS 自定义属性（变量）

使用 CSS 变量实现一致的主题，避免冲突：

```css
/* 主应用 - 定义主题变量 */
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
}

/* 微应用 - 使用主题变量 */
.micro-app-button {
  background: var(--primary-color);
  color: white;
}
```

## 🎭 运行时样式管理

### 动态 CSS 加载

在微应用挂载时动态加载 CSS：

```javascript
// 动态 CSS 加载的生命周期钩子
const lifeCycles = {
  async beforeMount(app) {
    // 加载微应用特定的 CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${app.entry}/static/css/main.css`;
    link.id = `${app.name}-styles`;
    document.head.appendChild(link);
  },
  
  async afterUnmount(app) {
    // 移除微应用 CSS
    const link = document.getElementById(`${app.name}-styles`);
    if (link) {
      document.head.removeChild(link);
    }
  }
};

registerMicroApps([
  {
    name: 'micro-app',
    entry: '//localhost:8080',
    container: '#container',
    activeRule: '/micro-app'
  }
], lifeCycles);
```

### 使用 PostCSS 进行 CSS 作用域

使用 PostCSS 插件自动为 CSS 添加作用域：

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-prefixwrap')('.micro-app-container')
  ]
};
```

**输入 CSS：**
```css
.button {
  background: blue;
}
```

**输出 CSS：**
```css
.micro-app-container .button {
  background: blue;
}
```

## 🔧 框架特定解决方案

### React 应用

#### 在 Create React App 中使用 CSS 模块

```javascript
// Button.module.css
.button {
  background: blue;
  color: white;
}

// Button.jsx
import styles from './Button.module.css';

function Button({ children }) {
  return <button className={styles.button}>{children}</button>;
}
```

#### 自定义 CSS 前缀 Hook

```javascript
import { useMemo } from 'react';

function useCSSPrefix(prefix) {
  return useMemo(() => {
    return (className) => `${prefix}-${className}`;
  }, [prefix]);
}

// 用法
function MyComponent() {
  const cx = useCSSPrefix('user-mgmt');
  
  return (
    <div className={cx('container')}>
      <button className={cx('button')}>点击我</button>
    </div>
  );
}
```

### Vue 应用

#### 作用域样式

```vue
<template>
  <div class="component">
    <button class="button">点击我</button>
  </div>
</template>

<style scoped>
.component {
  padding: 20px;
}

.button {
  background: blue;
  color: white;
}
</style>
```

#### Vue 中的 CSS 模块

```vue
<template>
  <div :class="$style.component">
    <button :class="$style.button">点击我</button>
  </div>
</template>

<style module>
.component {
  padding: 20px;
}

.button {
  background: blue;
  color: white;
}
</style>
```

### Angular 应用

#### ViewEncapsulation

```typescript
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-my-component',
  template: `
    <div class="component">
      <button class="button">点击我</button>
    </div>
  `,
  styles: [`
    .component {
      padding: 20px;
    }
    .button {
      background: blue;
      color: white;
    }
  `],
  encapsulation: ViewEncapsulation.Emulated // 默认
})
export class MyComponent { }
```

## 🎪 组件库策略

### 设计系统方法

创建所有微应用都使用的共享设计系统：

```javascript
// shared-design-system/Button.js
export const Button = ({ variant = 'primary', size = 'medium', children, ...props }) => {
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary'
  };
  const sizeClasses = {
    small: 'btn-sm',
    medium: 'btn-md',
    large: 'btn-lg'
  };
  
  const className = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size]
  ].join(' ');
  
  return <button className={className} {...props}>{children}</button>;
};
```

### 用于主题化的 CSS 自定义属性

```css
/* 设计系统 CSS */
:root {
  --btn-primary-bg: #007bff;
  --btn-primary-color: white;
  --btn-secondary-bg: #6c757d;
  --btn-secondary-color: white;
  --btn-padding-sm: 8px 12px;
  --btn-padding-md: 10px 16px;
  --btn-padding-lg: 12px 20px;
}

.btn {
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
}

.btn-primary {
  background: var(--btn-primary-bg);
  color: var(--btn-primary-color);
}

.btn-secondary {
  background: var(--btn-secondary-bg);
  color: var(--btn-secondary-color);
}

.btn-sm { padding: var(--btn-padding-sm); }
.btn-md { padding: var(--btn-padding-md); }
.btn-lg { padding: var(--btn-padding-lg); }
```

## 🚫 第三方库处理

### 隔离第三方样式

当使用注入全局样式的第三方库时：

```javascript
// 在隔离环境中加载第三方 CSS
const loadLibraryStyles = (libraryName, cssUrl) => {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    const iframeDoc = iframe.contentDocument;
    const link = iframeDoc.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssUrl;
    link.onload = () => {
      // 提取并为 CSS 添加作用域
      const styles = Array.from(iframeDoc.styleSheets[0].cssRules)
        .map(rule => rule.cssText)
        .join('\n');
      
      const scopedStyles = scopeCSS(styles, `.${libraryName}-container`);
      
      const style = document.createElement('style');
      style.textContent = scopedStyles;
      style.id = `${libraryName}-scoped-styles`;
      document.head.appendChild(style);
      
      document.body.removeChild(iframe);
      resolve();
    };
    iframeDoc.head.appendChild(link);
  });
};
```

### 第三方集成的 CSS-in-JS

```javascript
import { createGlobalStyle } from 'styled-components';

// 将第三方样式作用域限定为特定容器
const AntdStyles = createGlobalStyle`
  .micro-app-container {
    .ant-btn {
      /* 专门为此微应用覆盖 Ant Design 按钮样式 */
      border-radius: 8px;
    }
    
    .ant-table {
      /* 覆盖 Ant Design 表格样式 */
      border: 1px solid #f0f0f0;
    }
  }
`;

function MicroApp() {
  return (
    <div className="micro-app-container">
      <AntdStyles />
      {/* 您的微应用内容 */}
    </div>
  );
}
```

## 🔍 调试样式冲突

### 开发工具

#### 样式检查脚本

```javascript
// 添加到浏览器控制台进行调试
const findStyleConflicts = (selector) => {
  const elements = document.querySelectorAll(selector);
  
  elements.forEach((el, index) => {
    const styles = window.getComputedStyle(el);
    const rules = [];
    
    for (let i = 0; i < document.styleSheets.length; i++) {
      try {
        const sheet = document.styleSheets[i];
        const cssRules = sheet.cssRules || sheet.rules;
        
        for (let j = 0; j < cssRules.length; j++) {
          if (el.matches(cssRules[j].selectorText)) {
            rules.push({
              selector: cssRules[j].selectorText,
              rule: cssRules[j].cssText,
              sheet: sheet.href || 'inline'
            });
          }
        }
      } catch (e) {
        // 跨域样式表
      }
    }
    
    console.log(`元素 ${index + 1}:`, el);
    console.log('应用的样式:', rules);
  });
};

// 用法: findStyleConflicts('.button');
```

#### 样式来源跟踪器

```javascript
// 跟踪哪个微应用加载了哪些样式
const styleTracker = {
  styles: new Map(),
  
  track(appName, styleElement) {
    if (!this.styles.has(appName)) {
      this.styles.set(appName, []);
    }
    this.styles.get(appName).push(styleElement);
  },
  
  getByApp(appName) {
    return this.styles.get(appName) || [];
  },
  
  getConflicts() {
    const allSelectors = new Map();
    
    this.styles.forEach((styles, appName) => {
      styles.forEach(style => {
        // 解析 CSS 并检查选择器冲突
        // 实现取决于 CSS 解析器
      });
    });
    
    return allSelectors;
  }
};
```

### 运行时冲突检测

```javascript
// 在运行时检测样式冲突
const detectStyleConflicts = () => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.tagName === 'STYLE' || node.tagName === 'LINK') {
            checkForConflicts(node);
          }
        });
      }
    });
  });
  
  observer.observe(document.head, { childList: true });
};

const checkForConflicts = (styleNode) => {
  // 检查 CSS 选择器冲突的实现
  console.warn('添加了新的样式节点:', styleNode);
};
```

## 📊 性能考虑

### CSS 加载性能

```javascript
// 优化微应用的 CSS 加载
const optimizedCSSLoader = {
  cache: new Map(),
  
  async loadCSS(url, appName) {
    if (this.cache.has(url)) {
      return this.cache.get(url);
    }
    
    const response = await fetch(url);
    const css = await response.text();
    const optimizedCSS = this.optimizeCSS(css, appName);
    
    this.cache.set(url, optimizedCSS);
    return optimizedCSS;
  },
  
  optimizeCSS(css, appName) {
    // 移除未使用的选择器
    // 添加应用特定前缀
    // 必要时压缩
    return css.replace(/(\.[a-zA-Z-_]+)/g, `.${appName}-$1`);
  }
};
```

### 样式的包分割

```javascript
// webpack.config.js - 按微应用分割 CSS
module.exports = {
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  }
};
```

## 🎯 最佳实践总结

### ✅ 应该做的

1. **尽可能使用 qiankun 的内置隔离**
2. **实施一致的命名约定**（BEM、命名空间）
3. **使用 CSS-in-JS** 进行自动隔离
4. **创建共享设计系统** 以保持一致性
5. **在开发中测试样式隔离**
6. **在生产中监控冲突**
7. **为您的团队记录样式指南**

### ❌ 不应该做的

1. **不要在微应用中依赖全局 CSS**
2. **不要使用过于通用的类名**（.button、.container）
3. **不要忘记在卸载时清理样式**
4. **不要忽略第三方库样式**
5. **不要跳过样式隔离测试**
6. **除非绝对必要，不要使用 !important**

### 🎪 真实世界示例

这是一个良好隔离的微应用的完整示例：

```jsx
// MicroApp.jsx
import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';

// 作用域限定为此微应用的全局样式
const GlobalStyles = createGlobalStyle`
  .user-management-app {
    font-family: 'Inter', sans-serif;
    
    * {
      box-sizing: border-box;
    }
  }
`;

// 带隔离的样式组件
const Container = styled.div`
  padding: 20px;
  background: #f8f9fa;
  min-height: 100vh;
`;

const Header = styled.h1`
  color: #343a40;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background: ${props => props.primary ? '#007bff' : '#6c757d'};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
`;

function UserManagementApp() {
  return (
    <div className="user-management-app">
      <GlobalStyles />
      <Container>
        <Header>用户管理</Header>
        <Button primary>添加用户</Button>
        <Button>取消</Button>
      </Container>
    </div>
  );
}

export default UserManagementApp;
```

## 🔗 相关文档

- [性能优化](/cookbook/performance) - 优化加载和运行时性能
- [错误处理](/cookbook/error-handling) - 处理 CSS 相关错误
- [配置](/api/configuration) - 配置样式隔离选项
- [调试](/cookbook/debugging) - 调试样式冲突 