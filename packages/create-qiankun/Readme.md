# create-qiankun

Scaffold a qiankun main app or sub app with a single command. Supports React and Vue with TypeScript or JavaScript, powered by Vite.

## Requirements

- Node.js v18 or higher

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

Run the command without arguments to enter interactive mode:

```bash
npx create-qiankun@latest
```

You will be prompted to:

1. Select app type: **Main App** or **Sub App**
2. Enter a name for your app
3. (Sub apps only) Select a framework template

### Non-Interactive Mode

You can also pass arguments directly:

```bash
# Create a main app
npx create-qiankun@latest my-main-app --type main

# Create a sub app with React + TypeScript
npx create-qiankun@latest my-sub-app --template react-ts

# Alias: use -T for --type and -t for --template
npx create-qiankun@latest my-app -T sub -t react
```

## CLI Options

| Option | Alias | Values | Description |
|--------|-------|--------|-------------|
| `--type` | `-T` | `main`, `sub` | App type (default: `sub`) |
| `--template` | `-t` | `react-ts`, `react`, `vue-ts`, `vue` | Framework template for sub apps |

## Templates

### Main App

Main apps use **React + TypeScript** with Vite.

Creates a minimal main application with qiankun integration. The generated app includes:

- App component with `loadMicroApp()` integration
- Vite configuration for main app development
- qiankun dependency added to package.json

### Sub Apps

Sub apps support 4 framework templates, all powered by Vite:

| Template | Description |
|----------|-------------|
| `react-ts` | React with TypeScript |
| `react` | React with JavaScript |
| `vue-ts` | Vue 3 with TypeScript |
| `vue` | Vue 3 with JavaScript |

Each sub app includes:

- Proper qiankun entry point configuration
- `build:qiankun` script for qiankun-compatible builds
- qiankun sandbox isolation configuration

## Generated Project Structure

### Main App

```
my-main-app/
├── src/
│   ├── App.tsx           # Main component with loadMicroApp
│   ├── App.css
│   ├── main.tsx
│   └── ...
├── vite.config.ts
├── package.json          # Includes qiankun dependency
└── ...
```

### Sub App

```
my-sub-app/
├── src/
│   ├── App.{ts,tsx}      # Qiankun entry export
│   ├── main.{ts,tsx}     # Qiankun lifecycle hooks
│   └── ...
├── vite.config.ts        # Configured for qiankun
├── package.json          # Includes build:qiankun script
└── ...
```

## Getting Started

After creating your app:

```bash
cd my-app
pnpm install
pnpm dev
```

For sub apps, build for qiankun:

```bash
pnpm build:qiankun
```

## License

MIT
