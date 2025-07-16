# @qiankunjs/create-qiankun

**English** | [中文](./README-zh.md)

`@qiankunjs/create-qiankun` is a scaffolding tool designed for the [qiankun](https://github.com/umijs/qiankun) micro-frontend framework. It helps developers quickly start example projects and get up to speed with qiankun.

## Features

- ✨ Support for creating one or multiple sub-applications in a new project
- 🎯 Support for main and sub-application routing modes (`hash`, `history`)
- 📦 One-click generation of `npm/yarn/pnpm/pnpm workspace` projects
- 🔧 Automatic injection of startup scripts and port conflict detection
- 🛡️ Enhanced error handling and input validation
- 🚀 Improved user experience with better error messages and progress feedback

## Requirements

- Node.js version v18 or higher recommended
- We recommend using [fnm](https://github.com/Schniz/fnm) to manage Node.js versions

## Installation

Using npm:

```bash
npx create-qiankun@latest
```

Using yarn:

```bash
yarn create qiankun@latest
```

Using pnpm:

```bash
pnpm dlx create-qiankun@latest
```

## Usage

### Interactive Mode

Simply run the command and follow the interactive prompts:

```bash
npx create-qiankun@latest
```

### Command Line Arguments

You can also provide arguments directly:

```bash
npx create-qiankun@latest my-project 3 react18-main react18-webpack-sub history npm
```

Arguments order:

1. Project name
2. Creation mode (1: main app only, 2: sub apps only, 3: main + sub apps)
3. Main app framework (when applicable)
4. Sub app frameworks (when applicable)
5. Routing mode (hash/history)
6. Package manager (npm/yarn/pnpm/pnpm workspace)

### Input Validation

The tool now includes comprehensive input validation:

- **Project name**: Must contain only letters, numbers, underscores, and hyphens
- **Port numbers**: Automatically generated within safe ranges, avoiding common system ports
- **Template validation**: Ensures all selected templates are available

## Templates

### Main Application Templates

| Template Name   | Description           | Status   |
| --------------- | --------------------- | -------- |
| React18+Webpack | React 18 with Webpack | ✅ Ready |
| Vue3+Webpack    | Vue 3 with Webpack    | ✅ Ready |
| React18+umi     | React 18 with UmiJS   | ✅ Ready |

### Sub Application Templates

| Template Name   | Description           | Status                        |
| --------------- | --------------------- | ----------------------------- |
| React18+Webpack | React 18 with Webpack | ✅ Ready                      |
| React16+Webpack | React 16 with Webpack | ✅ Ready                      |
| Vue3+Webpack    | Vue 3 with Webpack    | ✅ Ready                      |
| Vue2+Webpack    | Vue 2 with Webpack    | ⚠️ Issues with pnpm workspace |
| Vite+Vue3       | Vue 3 with Vite       | 🚧 Under development          |
| Vite+React18    | React 18 with Vite    | 🚧 Under development          |

## Package Manager Support

### Standard Mode

- **npm**: Full support with automatic dependency installation
- **yarn**: Full support with automatic dependency installation
- **pnpm**: Full support with automatic dependency installation

### Monorepo Mode

- **pnpm workspace**: Full support with automatic workspace configuration

## Recent Improvements

### v0.0.1-rc.0 Updates

- 🛡️ **Enhanced Error Handling**: Comprehensive error handling throughout the codebase
- 🔒 **Input Validation**: Added project name validation and port number validation
- 🚀 **Improved Port Generation**: Safer port generation algorithm avoiding conflicts
- 📝 **Better User Experience**: More informative error messages and progress feedback
- 🔧 **Code Quality**: Fixed TypeScript issues and improved code structure
- 🎯 **Template Improvements**: Fixed duplicate configurations and enhanced templates
- 🔍 **Debugging**: Better logging and debugging information

## Project Structure

After creation, your project will have the following structure:

### Standard Mode

```
my-project/
├── main-app/          # Main application
│   ├── src/
│   │   ├── microApp/  # Micro-frontend configuration
│   │   └── ...
│   └── package.json
├── sub-app-1/         # Sub application 1
│   ├── src/
│   └── package.json
└── sub-app-2/         # Sub application 2
    ├── src/
    └── package.json
```

### Monorepo Mode (pnpm workspace)

```
my-project/
├── packages/
│   ├── main-app/      # Main application
│   ├── sub-app-1/     # Sub application 1
│   └── sub-app-2/     # Sub application 2
├── package.json       # Root package.json with workspace config
└── pnpm-workspace.yaml
```

## Development

Start the applications in development mode:

### Standard Mode

```bash
# Start main application
cd main-app && npm run dev

# Start sub applications (in separate terminals)
cd sub-app-1 && npm run dev
cd sub-app-2 && npm run dev
```

### Monorepo Mode

```bash
# Start all applications
pnpm run dev:app1  # Main application
pnpm run dev:app2  # Sub application 1
pnpm run dev:app3  # Sub application 2
```

## Port Management

The tool automatically:

- Generates safe port numbers (avoiding system ports and common service ports)
- Checks for port conflicts before starting applications
- Provides helpful error messages if ports are occupied
- Allows manual port configuration if needed

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   - The tool will automatically detect and warn about port conflicts
   - You can manually update port numbers in the generated configuration

2. **Template Not Found**
   - Ensure you're using the latest version of create-qiankun
   - Check if the template name is correctly specified

3. **Installation Issues**
   - Make sure you have the required Node.js version (v18+)
   - Try clearing npm/yarn/pnpm cache and reinstalling

## Contributing

We welcome contributions of all kinds! Please feel free to submit PRs or open issues for discussion.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/umijs/qiankun.git

# Install dependencies
cd qiankun
pnpm install

# Build the package
cd packages/create-qiankun
pnpm run build
```

## License

MIT

---

Made with ❤️ by the qiankun team
