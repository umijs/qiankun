# @qiankunjs/create-qiankun

中文 | [English](./README.md)

`@qiankunjs/create-qiankun` 是一个为 [qiankun](https://github.com/umijs/qiankun) 微前端框架设计的脚手架工具。旨在快速启动示例项目，方便开发者快速上手。

## 功能特性

- ✨ 支持选择一个或多个子应用来创建一个新的项目
- 🎯 支持主应用和子应用路由模式 (`hash`, `history`) 选择
- 📦 支持一键生成 `npm/yarn/pnpm/pnpm workspace` 工程
- 🔧 自动注入启动应用脚本以及端口冲突检测
- 🛡️ 增强的错误处理和输入验证
- 🚀 改进的用户体验，提供更好的错误信息和进度反馈

## 环境要求

- 建议使用 Node.js 版本 v18 或更高版本
- 推荐使用 [fnm](https://github.com/Schniz/fnm) 管理 Node.js 版本

## 安装

使用 npm:

```bash
npx create-qiankun@latest
```

使用 yarn:

```bash
yarn create qiankun@latest
```

使用 pnpm:

```bash
pnpm dlx create-qiankun@latest
```

## 使用方法

### 交互式模式

直接运行命令，跟随交互式提示：

```bash
npx create-qiankun@latest
```

### 命令行参数

您也可以直接提供参数：

```bash
npx create-qiankun@latest my-project 3 react18-main react18-webpack-sub history npm
```

参数顺序：
1. 项目名称
2. 创建模式 (1: 仅主应用, 2: 仅子应用, 3: 主应用+子应用)
3. 主应用框架 (适用时)
4. 子应用框架 (适用时)
5. 路由模式 (hash/history)
6. 包管理器 (npm/yarn/pnpm/pnpm workspace)

### 输入验证

工具现在包含全面的输入验证：

- **项目名称**：只能包含字母、数字、下划线和连字符
- **端口号**：自动生成在安全范围内，避免常见的系统端口
- **模板验证**：确保所有选定的模板都可用

## 模板列表

### 主应用模板

| 模板名称         | 描述                        | 状态     |
| --------------- | --------------------------- | -------- |
| React18+Webpack | React 18 配合 Webpack      | ✅ 可用   |
| Vue3+Webpack    | Vue 3 配合 Webpack         | ✅ 可用   |
| React18+umi     | React 18 配合 UmiJS        | ✅ 可用   |

### 子应用模板

| 模板名称         | 描述                        | 状态                      |
| --------------- | --------------------------- | ------------------------- |
| React18+Webpack | React 18 配合 Webpack      | ✅ 可用                    |
| React16+Webpack | React 16 配合 Webpack      | ✅ 可用                    |
| Vue3+Webpack    | Vue 3 配合 Webpack         | ✅ 可用                    |
| Vue2+Webpack    | Vue 2 配合 Webpack         | ⚠️ 在 pnpm workspace 有问题 |
| Vite+Vue3       | Vue 3 配合 Vite            | 🚧 开发中                  |
| Vite+React18    | React 18 配合 Vite         | 🚧 开发中                  |

## 包管理器支持

### 标准模式
- **npm**：完全支持，自动安装依赖
- **yarn**：完全支持，自动安装依赖
- **pnpm**：完全支持，自动安装依赖

### Monorepo 模式
- **pnpm workspace**：完全支持，自动配置工作空间

## 最新改进

### v0.0.1-rc.0 更新

- 🛡️ **增强错误处理**：整个代码库的全面错误处理
- 🔒 **输入验证**：添加项目名称验证和端口号验证
- 🚀 **改进端口生成**：更安全的端口生成算法，避免冲突
- 📝 **更好的用户体验**：更有信息量的错误消息和进度反馈
- 🔧 **代码质量**：修复 TypeScript 问题并改进代码结构
- 🎯 **模板改进**：修复重复配置并增强模板
- 🔍 **调试**：更好的日志记录和调试信息

## 项目结构

创建后，您的项目将具有以下结构：

### 标准模式
```
my-project/
├── main-app/          # 主应用
│   ├── src/
│   │   ├── microApp/  # 微前端配置
│   │   └── ...
│   └── package.json
├── sub-app-1/         # 子应用 1
│   ├── src/
│   └── package.json
└── sub-app-2/         # 子应用 2
    ├── src/
    └── package.json
```

### Monorepo 模式 (pnpm workspace)
```
my-project/
├── packages/
│   ├── main-app/      # 主应用
│   ├── sub-app-1/     # 子应用 1
│   └── sub-app-2/     # 子应用 2
├── package.json       # 根 package.json 配置工作空间
└── pnpm-workspace.yaml
```

## 开发

在开发模式下启动应用：

### 标准模式
```bash
# 启动主应用
cd main-app && npm run dev

# 启动子应用 (在不同终端中)
cd sub-app-1 && npm run dev
cd sub-app-2 && npm run dev
```

### Monorepo 模式
```bash
# 启动所有应用
pnpm run dev:app1  # 主应用
pnpm run dev:app2  # 子应用 1
pnpm run dev:app3  # 子应用 2
```

## 端口管理

工具会自动：
- 生成安全的端口号（避免系统端口和常见服务端口）
- 在启动应用前检查端口冲突
- 如果端口被占用，提供有用的错误消息
- 如果需要，允许手动配置端口

## 故障排除

### 常见问题

1. **端口已被使用**
   - 工具会自动检测并警告端口冲突
   - 您可以在生成的配置中手动更新端口号

2. **模板未找到**
   - 确保您使用的是最新版本的 create-qiankun
   - 检查模板名称是否正确指定

3. **安装问题**
   - 确保您具有所需的 Node.js 版本 (v18+)
   - 尝试清除 npm/yarn/pnpm 缓存并重新安装

## 贡献

欢迎任何形式的贡献！请随时提交 PR 或开启 issue 讨论。

### 开发设置

```bash
# 克隆仓库
git clone https://github.com/umijs/qiankun.git

# 安装依赖
cd qiankun
pnpm install

# 构建包
cd packages/create-qiankun
pnpm run build
```

## 许可证

MIT

---

由 qiankun 团队用 ❤️ 制作
