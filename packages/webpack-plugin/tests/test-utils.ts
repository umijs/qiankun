import fs from 'fs';
import path from 'path';
import { vi } from 'vitest';
import { Compiler } from 'webpack';

// 创建模拟的 webpack compiler
export function createMockCompiler(version: string = '5.0.0', hasProcessAssets: boolean = true): any {
  const mockCompiler: any = {
    hooks: {
      emit: { tapAsync: vi.fn() },
      compilation: { tap: vi.fn() },
    },
    options: {
      output: {
        library: undefined,
        libraryTarget: undefined,
        chunkLoadingGlobal: undefined,
        jsonpFunction: undefined,
        globalObject: undefined,
      },
    },
    webpack: { version },
  };

  // 模拟 webpack 5 的 compilation hooks
  if (hasProcessAssets) {
    mockCompiler.hooks.compilation.tap.mockImplementation((name: string, callback: (compilation: any) => void) => {
      const mockCompilation = {
        hooks: {
          processAssets: {
            tapAsync: vi.fn(),
          },
        },
        updateAsset: vi.fn(),
        assets: {},
      };
      callback(mockCompilation);
    });
  }

  return mockCompiler;
}

// 创建测试用的 HTML 内容
export const testHtmlTemplates = {
  basic: '<html><body><script src="app.js"></script></body></html>',
  multiple: '<html><body><script src="vendor.js"></script><script src="app.js"></script></body></html>',
  inline: '<html><body><script>console.log("test")</script></body></html>',
  mixed: '<html><body><script>console.log("inline")</script><script src="app.js"></script></body></html>',
  empty: '<html><body></body></html>',
  withEntry: '<html><body><script entry src="app.js"></script></body></html>',
  complex: `
    <html>
      <head>
        <script src="polyfills.js"></script>
      </head>
      <body>
        <script>
          window.globalConfig = { debug: true };
        </script>
        <script src="vendors.js"></script>
        <script src="main.js"></script>
      </body>
    </html>
  `,
};

// 包名测试用例
export const packageNameTestCases = {
  valid: [
    'my-package',
    '@scope/package-name',
    'package-with-dashes',
    'package_with_underscores',
    'package.with.dots',
    'a'.repeat(214), // 最大长度
  ],
  invalid: [
    '', // 空字符串
    '123invalid', // 以数字开头
    'Invalid@Name', // 包含大写字母和@在中间
    'spaces in name', // 包含空格
    '..invalid', // 以点开头
    'invalid..name', // 连续的点
  ],
  edge: [
    'a', // 单个字符
    'a'.repeat(214), // 最大长度
    '@scope/a', // 最短的作用域包名
  ],
};

// 正则表达式测试用例
export const regexTestCases = [
  {
    pattern: /main\.js$/,
    description: 'simple filename match',
    shouldMatch: ['main.js', 'path/main.js'],
    shouldNotMatch: ['main.jsx', 'main.js.map', 'not-main.js'],
  },
  {
    pattern: /bundle\.[a-f0-9]+\.js$/,
    description: 'hash-based bundle',
    shouldMatch: ['bundle.abc123.js', 'bundle.def456.js'],
    shouldNotMatch: ['bundle.js', 'bundle.xyz.js', 'bundle.abc123.css'],
  },
  {
    pattern: /(main|index|app)\.js$/,
    description: 'multiple possible names',
    shouldMatch: ['main.js', 'index.js', 'app.js'],
    shouldNotMatch: ['vendor.js', 'polyfills.js'],
  },
  {
    pattern: /console\.log/,
    description: 'inline script content',
    shouldMatch: ['console.log("test")', 'if (debug) console.log(data)'],
    shouldNotMatch: ['console.error("test")', 'alert("test")'],
  },
];

// 创建临时目录和文件的辅助函数
export function createTempDir(name: string): string {
  const tempDir = path.join(__dirname, `temp-${name}-${Date.now()}`);
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  return tempDir;
}

export function cleanupTempDir(dir: string): void {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

export function createTempPackageJson(dir: string, content: any): void {
  const packageJsonPath = path.join(dir, 'package.json');
  fs.writeFileSync(packageJsonPath, JSON.stringify(content, null, 2));
}

// 性能测试辅助函数
export function measureExecutionTime<T>(fn: () => T): { result: T; duration: number } {
  const startTime = Date.now();
  const result = fn();
  const endTime = Date.now();
  return { result, duration: endTime - startTime };
}
