# Create Qiankun

`create-qiankun` 是一个专为 qiankun 微前端框架设计的 CLI 脚手架工具。它帮助开发者快速构建示例项目，高效开始微前端开发。

## 🚀 快速开始

### 使用 npm

```bash
npx create-qiankun@latest
```

### 使用 yarn

```bash
yarn create qiankun@latest
```

### 使用 pnpm

```bash
pnpm dlx create-qiankun@latest
```

## 🎯 特性

- **多种项目类型**：选择仅主应用、仅微应用或完整设置
- **框架支持**：React 18、Vue 3、Vue 2 和 Umi 4 模板
- **路由模式**：支持 hash 和 history 路由模式
- **包管理器选项**：npm、yarn、pnpm 或 pnpm workspace
- **自动配置**：自动端口冲突检测和启动脚本注入
- **Monorepo 支持**：内置 pnpm workspace 设置管理多个应用

## 📋 要求

- **Node.js**：v18 或更高版本（推荐：使用 [fnm](https://github.com/Schniz/fnm) 进行版本管理）
- **包管理器**：npm、yarn 或 pnpm

## 🎮 交互式设置

运行 `create-qiankun` 时，您将通过交互式设置过程：

### 步骤 1：项目名称

```bash
? Project name: › my-qiankun-project
```

### 步骤 2：项目类型

```bash
? Choose a way to create › 
❯ Create main application and sub applications
  Just create main application  
  Just create sub applications
```

**选项：**
- **Create main application and sub applications**：完整设置，包含主应用和多个微应用
- **Just create main application**：仅创建主（shell）应用
- **Just create sub applications**：仅创建微应用

### 步骤 3：主应用框架（如适用）

```bash
? Choose a framework for your main application › 
❯ React18+Webpack
  Vue3+Webpack
  React18+umi4
```

### 步骤 4：路由模式（如适用）

```bash
? Choose a route pattern for your main application › 
❯ hash
  history
```

### 步骤 5：子应用框架（如适用）

```bash
? Choose a framework for your sub application › 
Space to select. Return to submit.

❯◯ React18+Webpack
 ◯ Vue3+Webpack  
 ◯ Vue2+Webpack
 ◯ React18+umi4
```

### 步骤 6：包管理器

```bash
? Which package manager do you want to use? › 
❯ npm
  yarn
  pnpm
  pnpm with workspace
```

## 📦 可用模板

### 主应用模板

| 模板 | 描述 | 特性 |
|----------|-------------|----------|
| **React18+Webpack** | React 18 with Webpack 5 | 现代 React、TypeScript 支持、热重载 |
| **Vue3+Webpack** | Vue 3 with Vue CLI | Composition API、TypeScript、Element Plus |
| **React18+umi4** | Umi 4 框架 | 内置 qiankun 支持、Ant Design Pro |

### 子应用模板

| 模板 | 描述 | 状态 | 备注 |
|----------|-------------|--------|-------|
| **React18+Webpack** | React 18 微应用 | ✅ 稳定 | 生产就绪 |
| **Vue3+Webpack** | Vue 3 微应用 | ✅ 稳定 | 生产就绪 |
| **Vue2+Webpack** | Vue 2 微应用 | ⚠️ 有限 | pnpm workspace 存在问题 |
| **React18+umi4** | Umi 4 微应用 | ✅ 稳定 | 内置微应用支持 |
| **Vite+Vue3** | Vue 3 with Vite | 🚧 开发中 | 开发中 |
| **Vite+React18** | React 18 with Vite | 🚧 开发中 | 开发中 |

## 🏗️ 项目结构

### 单一项目结构

```
my-qiankun-project/
├── main-app/                 # 主应用
│   ├── src/
│   ├── package.json
│   └── webpack.config.js
├── react18-sub/              # React 微应用
│   ├── src/
│   ├── package.json
│   └── webpack.config.js
├── vue3-sub/                 # Vue 微应用
│   ├── src/
│   ├── package.json
│   └── vue.config.js
└── package.json
```

### Pnpm Workspace 结构

```
my-qiankun-project/
├── packages/
│   ├── main-app/             # 主应用
│   ├── react18-sub/          # React 微应用
│   └── vue3-sub/             # Vue 微应用
├── package.json              # Workspace 配置
├── pnpm-workspace.yaml       # Workspace 定义
└── scripts/
    └── checkPnpm.js          # 包管理器验证
```

## 🔧 生成的配置

### 主应用配置

主应用自动配置包含：

```typescript
// 主应用微应用注册
import { registerMicroApps, start } from 'qiankun';

registerMicroApps([
  {
    name: 'react18-sub',
    entry: '//localhost:8080',
    container: '#subapp-viewport',
    activeRule: '/react18-sub',
  },
  {
    name: 'vue3-sub', 
    entry: '//localhost:8081',
    container: '#subapp-viewport',
    activeRule: '/vue3-sub',
  }
]);

start();
```

### 微应用配置

每个微应用包含：

**React 微应用：**
```javascript
// webpack.config.js
const { QiankunWebpackPlugin } = require('@qiankunjs/bundler-plugin');

module.exports = {
  plugins: [
    new QiankunWebpackPlugin()
  ]
};
```

**Vue 微应用：**
```javascript
// vue.config.js
const { defineConfig } = require('@vue/cli-service');
const { QiankunWebpackPlugin } = require('@qiankunjs/bundler-plugin');

module.exports = defineConfig({
  configureWebpack: {
    plugins: [
      new QiankunWebpackPlugin()
    ]
  }
});
```

### 端口配置

自动端口分配防止冲突：

```json
{
  "scripts": {
    "dev": "PORT=8080 react-scripts start",
    "check-port": "node scripts/checkPort.js"
  }
}
```

## 🎨 自定义选项

### 环境特定配置

```javascript
// config/development.js
module.exports = {
  microApps: [
    {
      name: 'react-app',
      entry: '//localhost:8080',
      activeRule: '/react-app'
    }
  ]
};

// config/production.js
module.exports = {
  microApps: [
    {
      name: 'react-app', 
      entry: '//app.example.com',
      activeRule: '/react-app'
    }
  ]
};
```

### 自定义路由

```typescript
// Hash 路由（默认）
const router = createRouter({
  history: createWebHashHistory(),
  routes: [...]
});

// History 路由  
const router = createRouter({
  history: createWebHistory(),
  routes: [...]
});
```

## 🚀 开发工作流

### 单一包管理器

```bash
# 启动主应用
cd main-app && npm run dev

# 启动微应用（在单独的终端）
cd react18-sub && npm run dev  
cd vue3-sub && npm run dev
```

### Pnpm Workspace

```bash
# 安装所有依赖
pnpm install

# 同时启动所有应用
pnpm run dev

# 启动特定应用
pnpm --filter main-app run dev
pnpm --filter react18-sub run dev
```

### 生成的脚本

CLI 自动注入有用的脚本：

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:main\" \"npm run dev:subs\"",
    "dev:main": "cd main-app && npm run dev",
    "dev:subs": "concurrently \"cd react18-sub && npm run dev\" \"cd vue3-sub && npm run dev\"",
    "build": "npm run build:main && npm run build:subs",
    "clean": "rimraf node_modules **/*/node_modules"
  }
}
```

## 🔧 高级用法

### 命令行参数

通过提供参数跳过交互式提示：

```bash
npx create-qiankun my-project CreateMainAndSubApp react18-main hash react18-webpack-sub,vue3-webpack-sub pnpm
```

**参数顺序：**
1. 项目名称
2. 创建类型 (`CreateMainApp` | `CreateSubApp` | `CreateMainAndSubApp`)
3. 主应用模板（如适用）
4. 路由模式（如适用） 
5. 子应用模板（逗号分隔，如适用）
6. 包管理器

### 批量创建

```bash
# 创建多个项目
for project in app1 app2 app3; do
  npx create-qiankun $project CreateMainAndSubApp react18-main history react18-webpack-sub pnpm
done
```

### 自定义模板

您可以通过为项目贡献或分叉仓库来使用自定义模板扩展 CLI。

## 🎯 项目示例

### 完整的 React + Vue 设置

```bash
npx create-qiankun my-micro-frontend-app
# 选择：Create main application and sub applications
# 主应用：React18+Webpack
# 路由：history
# 子应用：React18+Webpack, Vue3+Webpack
# 包管理器：pnpm with workspace
```

**结果：**
- 带路由的主 React 应用
- React 18 微应用
- Vue 3 微应用  
- 自动端口分配（3000、8080、8081）
- Workspace 配置
- 开发脚本

### 基于 Umi 的 Monorepo

```bash
npx create-qiankun enterprise-app
# 选择：Create main application and sub applications  
# 主应用：React18+umi4
# 路由：history
# 子应用：React18+umi4, Vue3+Webpack
# 包管理器：pnpm with workspace
```

**特性：**
- 内置 qiankun 支持的 Umi 4 主应用
- Umi 4 微应用
- Vue 3 微应用
- Ant Design Pro 组件
- TypeScript 配置

## 📚 最佳实践

### 1. 使用描述性名称

```bash
# ✅ 好：描述性项目名称
npx create-qiankun e-commerce-platform
npx create-qiankun admin-dashboard

# ❌ 坏：通用名称
npx create-qiankun app1
npx create-qiankun project
```

### 2. 选择适当的包管理器

```bash
# 对于简单项目
npm / yarn

# 对于多团队的 monorepo
pnpm with workspace
```

### 3. 规划路由策略

```bash
# Hash 路由 - 更简单的部署
# History 路由 - 更好的 SEO，需要服务器配置
```

### 4. 考虑框架兼容性

- **React + Vue**：适合混合团队
- **相同框架**：更容易的依赖管理
- **Umi**：最适合企业应用

## 🐛 故障排除

### 端口冲突

CLI 自动检测和解决端口冲突。如果遇到问题：

```bash
# 检查运行中的进程
lsof -i :8080

# 杀死冲突进程
kill -9 $(lsof -t -i:8080)
```

### Pnpm Workspace 问题

```bash
# 清除 node_modules 并重新安装
pnpm run clean
pnpm install

# 检查 workspace 配置
cat pnpm-workspace.yaml
```

### 构建错误

```bash
# 清除构建缓存
rm -rf dist/ build/ .cache/

# 重新安装依赖
rm -rf node_modules package-lock.json
npm install
```

### Vue 2 与 Pnpm Workspace

已知限制：Vue 2 模板与 pnpm workspace 存在兼容性问题。使用替代方法：

```bash
# 使用常规 pnpm 替代
# 选择：pnpm（不是 pnpm with workspace）

# 或对 Vue 2 项目使用 yarn/npm
```

## 🔗 生成项目特性

### 自动配置

- 微前端构建的 **Webpack 优化**
- 跨域请求的 **CORS 处理**  
- 不同环境的 **Public path** 配置
- 本地开发的 **开发代理** 设置

### 开发体验

- 所有应用中的 **热模块替换**
- 微应用失败的 **错误边界**
- 微应用转换期间的 **加载状态**
- 适用的 **TypeScript 支持**

### 生产就绪

- 微前端部署的 **构建优化**
- **资源优化** 和代码分割
- 不同阶段的 **环境配置**
- **CI/CD 友好** 结构

## 📖 下一步

创建项目后：

1. **探索生成的代码** 以了解结构
2. **根据需要自定义配置**
3. **随着项目增长添加更多微应用**
4. **设置 CI/CD 流水线** 进行自动化部署
5. **阅读 qiankun 文档** 了解高级特性

## 🔗 相关文档

- [核心 APIs](/zh-CN/api/) - qiankun 核心 APIs
- [React 绑定](/zh-CN/ecosystem/react) - React UI 绑定
- [Vue 绑定](/zh-CN/ecosystem/vue) - Vue UI 绑定
- [Webpack 插件](/zh-CN/ecosystem/bundler-plugin) - 构建工具配置

## 🤝 贡献

想要添加新模板或改进 CLI？查看 [GitHub 仓库](https://github.com/umijs/qiankun) 并为 `packages/create-qiankun` 目录贡献。 