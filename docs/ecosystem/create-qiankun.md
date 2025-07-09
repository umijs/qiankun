# Create Qiankun

`create-qiankun` is a CLI scaffolding tool designed specifically for the qiankun micro-frontend framework. It helps developers quickly bootstrap example projects and get started with micro-frontend development efficiently.

## 🚀 Quick Start

### Using npm

```bash
npx create-qiankun@latest
```

### Using yarn

```bash
yarn create qiankun@latest
```

### Using pnpm

```bash
pnpm dlx create-qiankun@latest
```

## 🎯 Features

- **Multiple Project Types**: Choose between main app only, micro apps only, or complete setup
- **Framework Support**: React 18, Vue 3, Vue 2, and Umi 4 templates
- **Routing Modes**: Support for both hash and history routing patterns
- **Package Manager Options**: npm, yarn, pnpm, or pnpm workspace
- **Auto Configuration**: Automatic port conflict detection and startup scripts injection
- **Monorepo Support**: Built-in pnpm workspace setup for managing multiple applications

## 📋 Requirements

- **Node.js**: v18 or higher (recommended: use [fnm](https://github.com/Schniz/fnm) for version management)
- **Package Manager**: npm, yarn, or pnpm

## 🎮 Interactive Setup

When you run `create-qiankun`, you'll be guided through an interactive setup process:

### Step 1: Project Name

```bash
? Project name: › my-qiankun-project
```

### Step 2: Project Type

```bash
? Choose a way to create › 
❯ Create main application and sub applications
  Just create main application  
  Just create sub applications
```

**Options:**
- **Create main application and sub applications**: Complete setup with main app and multiple micro apps
- **Just create main application**: Only create the main (shell) application
- **Just create sub applications**: Only create micro applications

### Step 3: Main Application Framework (if applicable)

```bash
? Choose a framework for your main application › 
❯ React18+Webpack
  Vue3+Webpack
  React18+umi4
```

### Step 4: Routing Pattern (if applicable)

```bash
? Choose a route pattern for your main application › 
❯ hash
  history
```

### Step 5: Sub Applications Framework (if applicable)

```bash
? Choose a framework for your sub application › 
Space to select. Return to submit.

❯◯ React18+Webpack
 ◯ Vue3+Webpack  
 ◯ Vue2+Webpack
 ◯ React18+umi4
```

### Step 6: Package Manager

```bash
? Which package manager do you want to use? › 
❯ npm
  yarn
  pnpm
  pnpm with workspace
```

## 📦 Available Templates

### Main Application Templates

| Template | Description | Features |
|----------|-------------|----------|
| **React18+Webpack** | React 18 with Webpack 5 | Modern React, TypeScript support, Hot reload |
| **Vue3+Webpack** | Vue 3 with Vue CLI | Composition API, TypeScript, Element Plus |
| **React18+umi4** | Umi 4 framework | Built-in qiankun support, Ant Design Pro |

### Sub Application Templates

| Template | Description | Status | Notes |
|----------|-------------|--------|-------|
| **React18+Webpack** | React 18 micro app | ✅ Stable | Production ready |
| **Vue3+Webpack** | Vue 3 micro app | ✅ Stable | Production ready |
| **Vue2+Webpack** | Vue 2 micro app | ⚠️ Limited | Issues with pnpm workspace |
| **React18+umi4** | Umi 4 micro app | ✅ Stable | Built-in micro app support |
| **Vite+Vue3** | Vue 3 with Vite | 🚧 WIP | Under development |
| **Vite+React18** | React 18 with Vite | 🚧 WIP | Under development |

## 🏗️ Project Structure

### Single Project Structure

```
my-qiankun-project/
├── main-app/                 # Main application
│   ├── src/
│   ├── package.json
│   └── webpack.config.js
├── react18-sub/              # React micro app
│   ├── src/
│   ├── package.json
│   └── webpack.config.js
├── vue3-sub/                 # Vue micro app
│   ├── src/
│   ├── package.json
│   └── vue.config.js
└── package.json
```

### Pnpm Workspace Structure

```
my-qiankun-project/
├── packages/
│   ├── main-app/             # Main application
│   ├── react18-sub/          # React micro app
│   └── vue3-sub/             # Vue micro app
├── package.json              # Workspace configuration
├── pnpm-workspace.yaml       # Workspace definition
└── scripts/
    └── checkPnpm.js          # Package manager validation
```

## 🔧 Generated Configuration

### Main Application Configuration

The main application is automatically configured with:

```typescript
// Main app micro app registration
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

### Micro Application Configuration

Each micro application includes:

**React Micro App:**
```javascript
// webpack.config.js
const { QiankunWebpackPlugin } = require('@qiankunjs/webpack-plugin');

module.exports = {
  plugins: [
    new QiankunWebpackPlugin()
  ]
};
```

**Vue Micro App:**
```javascript
// vue.config.js
const { defineConfig } = require('@vue/cli-service');
const { QiankunWebpackPlugin } = require('@qiankunjs/webpack-plugin');

module.exports = defineConfig({
  configureWebpack: {
    plugins: [
      new QiankunWebpackPlugin()
    ]
  }
});
```

### Port Configuration

Automatic port assignment prevents conflicts:

```json
{
  "scripts": {
    "dev": "PORT=8080 react-scripts start",
    "check-port": "node scripts/checkPort.js"
  }
}
```

## 🎨 Customization Options

### Environment-specific Configuration

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

### Custom Routing

```typescript
// Hash routing (default)
const router = createRouter({
  history: createWebHashHistory(),
  routes: [...]
});

// History routing  
const router = createRouter({
  history: createWebHistory(),
  routes: [...]
});
```

## 🚀 Development Workflow

### Single Package Manager

```bash
# Start main application
cd main-app && npm run dev

# Start micro applications (in separate terminals)
cd react18-sub && npm run dev  
cd vue3-sub && npm run dev
```

### Pnpm Workspace

```bash
# Install all dependencies
pnpm install

# Start all applications concurrently
pnpm run dev

# Start specific application
pnpm --filter main-app run dev
pnpm --filter react18-sub run dev
```

### Generated Scripts

The CLI automatically injects useful scripts:

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

## 🔧 Advanced Usage

### Command Line Arguments

Skip the interactive prompts by providing arguments:

```bash
npx create-qiankun my-project CreateMainAndSubApp react18-main hash react18-webpack-sub,vue3-webpack-sub pnpm
```

**Arguments order:**
1. Project name
2. Create kind (`CreateMainApp` | `CreateSubApp` | `CreateMainAndSubApp`)
3. Main app template (if applicable)
4. Routing pattern (if applicable) 
5. Sub app templates (comma-separated, if applicable)
6. Package manager

### Batch Creation

```bash
# Create multiple projects
for project in app1 app2 app3; do
  npx create-qiankun $project CreateMainAndSubApp react18-main history react18-webpack-sub pnpm
done
```

### Custom Templates

You can extend the CLI with custom templates by contributing to the project or forking the repository.

## 🎯 Project Examples

### Complete React + Vue Setup

```bash
npx create-qiankun my-micro-frontend-app
# Choose: Create main application and sub applications
# Main: React18+Webpack
# Routing: history
# Subs: React18+Webpack, Vue3+Webpack
# Package Manager: pnpm with workspace
```

**Result:**
- Main React app with routing
- React 18 micro app
- Vue 3 micro app  
- Automatic port assignment (3000, 8080, 8081)
- Workspace configuration
- Development scripts

### Umi-based Monorepo

```bash
npx create-qiankun enterprise-app
# Choose: Create main application and sub applications  
# Main: React18+umi4
# Routing: history
# Subs: React18+umi4, Vue3+Webpack
# Package Manager: pnpm with workspace
```

**Features:**
- Umi 4 main application with built-in qiankun support
- Umi 4 micro application
- Vue 3 micro application
- Ant Design Pro components
- TypeScript configuration

## 📚 Best Practices

### 1. Use Descriptive Names

```bash
# ✅ Good: Descriptive project names
npx create-qiankun e-commerce-platform
npx create-qiankun admin-dashboard

# ❌ Bad: Generic names
npx create-qiankun app1
npx create-qiankun project
```

### 2. Choose Appropriate Package Manager

```bash
# For simple projects
npm / yarn

# For monorepo with multiple teams
pnpm with workspace
```

### 3. Plan Your Routing Strategy

```bash
# Hash routing - simpler deployment
# History routing - better SEO, requires server configuration
```

### 4. Consider Framework Compatibility

- **React + Vue**: Good for mixed teams
- **Same Framework**: Easier dependency management
- **Umi**: Best for enterprise applications

## 🐛 Troubleshooting

### Port Conflicts

The CLI automatically detects and resolves port conflicts. If you encounter issues:

```bash
# Check running processes
lsof -i :8080

# Kill conflicting processes
kill -9 $(lsof -t -i:8080)
```

### Pnpm Workspace Issues

```bash
# Clear node_modules and reinstall
pnpm run clean
pnpm install

# Check workspace configuration
cat pnpm-workspace.yaml
```

### Build Errors

```bash
# Clear build cache
rm -rf dist/ build/ .cache/

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Vue 2 with Pnpm Workspace

Known limitation: Vue 2 templates have compatibility issues with pnpm workspace. Use alternative approaches:

```bash
# Use regular pnpm instead
# Choose: pnpm (not pnpm with workspace)

# Or use yarn/npm for Vue 2 projects
```

## 🔗 Generated Project Features

### Automatic Configuration

- **Webpack optimization** for micro-frontend builds
- **CORS handling** for cross-origin requests  
- **Public path** configuration for different environments
- **Development proxy** setup for local development

### Development Experience

- **Hot module replacement** in all applications
- **Error boundaries** for micro app failures
- **Loading states** during micro app transitions
- **TypeScript support** where applicable

### Production Ready

- **Build optimization** for micro-frontend deployment
- **Asset optimization** and code splitting
- **Environment configuration** for different stages
- **CI/CD friendly** structure

## 📖 Next Steps

After creating your project:

1. **Explore the generated code** to understand the structure
2. **Customize the configuration** based on your needs
3. **Add more micro applications** as your project grows
4. **Set up CI/CD pipelines** for automated deployment
5. **Read the qiankun documentation** for advanced features

## 🔗 Related Documentation

- [Core APIs](/api/) - qiankun core APIs
- [React Bindings](/ecosystem/react) - React UI bindings
- [Vue Bindings](/ecosystem/vue) - Vue UI bindings
- [Webpack Plugin](/ecosystem/webpack-plugin) - Build tool configuration

## 🤝 Contributing

Want to add new templates or improve the CLI? Check out the [GitHub repository](https://github.com/umijs/qiankun) and contribute to the `packages/create-qiankun` directory. 