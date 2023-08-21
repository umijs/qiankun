import { isCI } from 'std-env';
export { mergeConfig } from 'vite';

var _a;
typeof process < "u" && typeof process.stdout < "u" && !((_a = process.versions) == null ? void 0 : _a.deno) && !globalThis.window;

const defaultInclude = ["**/*.{test,spec}.?(c|m)[jt]s?(x)"];
const defaultExclude = ["**/node_modules/**", "**/dist/**", "**/cypress/**", "**/.{idea,git,cache,output,temp}/**", "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*"];
const defaultCoverageExcludes = [
  "coverage/**",
  "dist/**",
  "packages/*/test?(s)/**",
  "**/*.d.ts",
  "**/virtual:*",
  "**/__x00__*",
  "**/\0*",
  "cypress/**",
  "test?(s)/**",
  "test?(-*).?(c|m)[jt]s?(x)",
  "**/*{.,-}{test,spec}.?(c|m)[jt]s?(x)",
  "**/__tests__/**",
  "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
  "**/.{eslint,mocha,prettier}rc.{?(c|m)js,yml}"
];
const coverageConfigDefaults = {
  provider: "v8",
  enabled: false,
  clean: true,
  cleanOnRerun: true,
  reportsDirectory: "./coverage",
  exclude: defaultCoverageExcludes,
  reportOnFailure: false,
  reporter: [["text", {}], ["html", {}], ["clover", {}], ["json", {}]],
  extension: [".js", ".cjs", ".mjs", ".ts", ".mts", ".cts", ".tsx", ".jsx", ".vue", ".svelte"]
};
const fakeTimersDefaults = {
  loopLimit: 1e4,
  shouldClearNativeTimers: true,
  toFake: [
    "setTimeout",
    "clearTimeout",
    "setInterval",
    "clearInterval",
    "setImmediate",
    "clearImmediate",
    "Date"
  ]
};
const config = {
  allowOnly: !isCI,
  watch: !isCI,
  globals: false,
  environment: "node",
  threads: true,
  clearMocks: false,
  restoreMocks: false,
  mockReset: false,
  include: defaultInclude,
  exclude: defaultExclude,
  testTimeout: 5e3,
  hookTimeout: 1e4,
  teardownTimeout: 1e4,
  isolate: true,
  watchExclude: ["**/node_modules/**", "**/dist/**"],
  forceRerunTriggers: [
    "**/package.json/**",
    "**/{vitest,vite}.config.*/**"
  ],
  update: false,
  reporters: [],
  silent: false,
  hideSkippedTests: false,
  api: false,
  ui: false,
  uiBase: "/__vitest__/",
  open: true,
  css: {
    include: []
  },
  coverage: coverageConfigDefaults,
  fakeTimers: fakeTimersDefaults,
  maxConcurrency: 5,
  dangerouslyIgnoreUnhandledErrors: false,
  typecheck: {
    checker: "tsc",
    include: ["**/*.{test,spec}-d.?(c|m)[jt]s?(x)"],
    exclude: defaultExclude
  },
  slowTestThreshold: 300
};
const configDefaults = Object.freeze(config);

function defineConfig(config) {
  return config;
}
function defineProject(config) {
  return config;
}
function defineWorkspace(config) {
  return config;
}

export { configDefaults, coverageConfigDefaults, defaultExclude, defaultInclude, defineConfig, defineProject, defineWorkspace };
