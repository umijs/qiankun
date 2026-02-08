# Qiankun PR #3115 - 待修复问题清单

> **生成时间**: 2026-02-08 **PR**: https://github.com/umijs/qiankun/pull/3115 **来源**: Copilot PR Review Comments

---

## 概述

以下问题在 Copilot PR Review 中被指出，但**未在当前 PR 中修复**。这些问题涉及架构设计、依赖管理和功能完整性，需要后续单独处理。

---

## 🔴 高优先级（功能/类型问题）

### 1. Qiankun 类型导入错误

- **文件**: `examples/react18/src/types/index.ts`
- **问题**: 尝试从 `qiankun` 导入 `QiankunProps` 和 `QiankunContext`，但这两个类型并未被 qiankun 包导出
- **影响**: TypeScript 类型检查会失败
- **建议**: 在 qiankun 包中添加这些类型的导出，或改为本地定义这些类型

### 2. @tanstack/react-query-devtools 缺失

- **文件**: `examples/react18/package.json` vs `examples/react18/src/main.tsx`
- **问题**: `main.tsx` 导入 `@tanstack/react-query-devtools`，但 package.json 未声明此依赖
- **影响**: 安装和构建会失败
- **建议**: 添加 `@tanstack/react-query-devtools` 作为 devDependency

### 3. react16 示例依赖不匹配

- **文件**: `examples/react16/package.json` vs 实际源码
- **问题**:
  - package.json 只声明了 `react`, `react-dom`, `react-router-dom`, `qiankun`
  - 但源码中导入了 `clsx`, `tailwind-merge`, `@tanstack/react-query` 等未声明的依赖
  - 源码引用 `./styles/globals.css` 但目录不存在
- **影响**: 示例无法编译运行
- **建议**: 完整梳理 react16 示例的依赖和目录结构

---

## 🟡 中优先级（配置/架构问题）

### 4. rollupOptions 重复定义

- **文件**: `examples/react18/vite.config.ts`
- **问题**: `build.rollupOptions` 被定义了两次，第二次会覆盖第一次的配置
- **影响**: 第一次定义的 `external` 和 `globals` 被丢弃，UMD 构建可能出现问题
- **建议**: 将两个 `rollupOptions` 合并为一个完整的配置对象

### 5. Tailwind 配置无法加载 TS 模块

- **文件**: `examples/react18/tailwind.config.js`
- **问题**: `tailwind.config.js` 是 JS/Node 运行时代码，但尝试导入 `./src/styles/design-tokens` (`.ts` 模块)
- **影响**: Tailwind 无法直接加载 TS 文件，配置会失败
- **建议**: 将 Tailwind 需要的 tokens 移到 `.js/.cjs/.mjs` 文件或 JSON

### 6. Angular unmount 生命周期为空

- **文件**: `examples/angular/src/main.ts`
- **问题**: `mount()` 每次都引导新的 Angular 模块，但 `unmount()` 是空的，没有清理 Angular 实例
- **影响**: 切换应用时会泄漏 Angular 实例、事件监听器和 DOM
- **建议**: 保留对 `NgModuleRef` 的引用，在 `unmount()` 中调用 `destroy()` 并清理 DOM

### 7. modern-react 引用不存在

- **文件**: `examples/main/index.html`
- **问题**: 微应用列表包含 `modern-react` (端口 3001)，但 PR 中没有对应的示例目录
- **影响**: UI 显示了一个无法启动的应用
- **建议**: 添加 modern-react 示例或从列表中移除

### 8. qiankun.js 资源不存在

- **文件**: `examples/main/index.html`
- **问题**: `import('/qiankun.js')` 用于获取 `loadMicroApp`，但仓库/构建输出中没有此文件
- **影响**: 会 404 错误，无法加载微应用
- **建议**: 从打包后的入口导入，或确保构建输出包含 qiankun.js

---

## 📋 修复建议优先级

### 立即修复（阻塞功能）

1. 添加 `@tanstack/react-query-devtools` 依赖
2. 修复 react16 示例的依赖和目录结构
3. 合并 `rollupOptions` 配置

### 短期修复（改善体验）

4. 在 qiankun 包中导出 `QiankunProps` 和 `QiankunContext`
5. 修复 Angular unmount 生命周期
6. 移除或添加 modern-react 示例
7. 修复 qiankun.js 资源引用

### 长期优化

8. 将 Tailwind tokens 移到 JS/JSON 文件

---

## 相关链接

- PR: https://github.com/umijs/qiankun/pull/3115
- Copilot Review: https://github.com/umijs/qiankun/pull/3115#pullrequestreview-XXXXXX
