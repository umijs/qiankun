const defaultPort = 51204;
const defaultBrowserPort = 63315;
const EXIT_CODE_RESTART = 43;
const API_PATH = "/__vitest_api__";
const CONFIG_NAMES = [
  "vitest.config",
  "vite.config"
];
const WORKSPACES_NAMES = [
  "vitest.workspace",
  "vitest.projects"
];
const CONFIG_EXTENSIONS = [
  ".ts",
  ".mts",
  ".cts",
  ".js",
  ".mjs",
  ".cjs"
];
const configFiles = CONFIG_NAMES.flatMap(
  (name) => CONFIG_EXTENSIONS.map((ext) => name + ext)
);
const WORKSPACES_EXTENSIONS = [
  ...CONFIG_EXTENSIONS,
  ".json"
];
const workspacesFiles = WORKSPACES_NAMES.flatMap(
  (name) => WORKSPACES_EXTENSIONS.map((ext) => name + ext)
);
const globalApis = [
  // suite
  "suite",
  "test",
  "describe",
  "it",
  // chai
  "chai",
  "expect",
  "assert",
  // typecheck
  "expectTypeOf",
  "assertType",
  // utils
  "vitest",
  "vi",
  // hooks
  "beforeAll",
  "afterAll",
  "beforeEach",
  "afterEach"
];

export { API_PATH as A, CONFIG_NAMES as C, EXIT_CODE_RESTART as E, defaultBrowserPort as a, configFiles as c, defaultPort as d, globalApis as g, workspacesFiles as w };
