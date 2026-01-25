# Qiankun E2E Testing Infrastructure

## Context

### Original Request

为 qiankun 微前端框架项目建立完整的 E2E 测试方案，结合社区最佳实践。

### Interview Summary

**Key Discussions**:

- 框架选择: Playwright (社区主流，iframe/shadow DOM 支持最佳)
- 测试范围: 核心 API、沙箱隔离、多框架兼容、生命周期、跨应用通信
- CI 集成: 独立 E2E Job (与 unit-test 并行)
- 浏览器覆盖: 仅 Chromium (最小资源消耗)
- E2E 目录: `packages/qiankun/e2e/`
- 测试环境: 真实服务器 (构建 examples 后启动)
- 样例应用: react16, vue3
- 启动策略: 统一启动脚本
- 执行策略: Playwright 内置并行
- 失败策略: 立即失败 (fail-fast)

**Research Findings**:

1. Playwright 是微前端 E2E 测试的最佳选择 (iframe/sandbox 支持优于 Cypress)
2. 使用 `frameLocator()` 处理 iframe，Playwright 自动穿透 Shadow DOM
3. 使用 Playwright `webServer` 配置自动管理服务器启动/停止
4. 推荐 feature-based 测试组织方式

### Metis Review

**Identified Gaps** (addressed):

- Examples 不在 pnpm workspace 中，需单独安装依赖 → 添加 `pnpm run examples:install` 脚本
- 主应用有多种渲染模式 → 明确使用 vanilla 模式
- 端口冲突风险 → Playwright `webServer` 配置管理
- 首版范围过大风险 → 限定 5-8 个核心测试场景

---

## Work Objectives

### Core Objective

为 qiankun 建立基于 Playwright 的 E2E 测试基础设施，覆盖核心微前端场景，集成到 CI 流程。

### Concrete Deliverables

- `packages/qiankun/e2e/` 目录结构
- `packages/qiankun/playwright.config.ts` 配置文件
- `packages/qiankun/package.json` 新增 test:e2e 脚本
- `.github/workflows/ci.yml` 新增 e2e job
- 5-8 个核心 E2E 测试用例
- E2E 测试 README 文档

### Definition of Done

- [ ] `pnpm --filter qiankun run test:e2e` 本地执行成功
- [ ] CI e2e job 执行成功 (与 unit-test 并行)
- [ ] 测试失败时生成 HTML 报告和 trace
- [ ] 连续 3 次运行无 flaky tests

### Must Have

- Playwright 配置文件
- webServer 自动启动 examples
- 核心场景测试覆盖
- CI 集成
- 失败报告

### Must NOT Have (Guardrails)

- 不修改 examples/ 核心逻辑代码 (只允许端口/配置调整)
- 不引入 MSW 或其他 mock 层 (首版)
- 不测试超过 2 个子应用框架 (react16, vue3)
- 不实现 sharding 或 caching 优化 (首版)
- 不测试 Safari/Firefox
- 不添加 visual regression testing
- 不抽象 common utilities (首版允许重复)

---

## Verification Strategy (MANDATORY)

### Test Decision

- **Infrastructure exists**: YES (vitest 已有)
- **User wants tests**: Manual-only (E2E 本身就是测试)
- **Framework**: Playwright

### Manual QA Procedures

每个 TODO 完成后需执行手动验证：

**For E2E Infrastructure:**

```bash
# 验证 Playwright 安装
npx playwright --version

# 验证配置有效
npx playwright test --list

# 验证 webServer 启动
npx playwright test --debug
```

**For Test Execution:**

```bash
# 本地运行所有测试
pnpm --filter qiankun run test:e2e

# 查看报告
npx playwright show-report packages/qiankun/playwright-report
```

---

## Task Flow

```
Task 0 (Examples Setup)
    ↓
Task 1 (Playwright Install) → Task 2 (Config)
                                  ↓
Task 3 (E2E Directory) → Task 4 (First Test: Load App)
                              ↓
Task 5 (Sandbox Test) → Task 6 (Lifecycle Test)
        ↓                       ↓
Task 7 (Style Isolation) → Task 8 (Multi-App Switch)
                              ↓
                       Task 9 (CI Integration)
                              ↓
                       Task 10 (Documentation)
```

## Parallelization

| Group | Tasks | Reason                   |
| ----- | ----- | ------------------------ |
| A     | 5, 7  | 独立测试用例，可并行编写 |
| B     | 6, 8  | 独立测试用例，可并行编写 |

| Task | Depends On | Reason                                 |
| ---- | ---------- | -------------------------------------- |
| 1    | 0          | Examples 依赖需先安装                  |
| 2    | 1          | 配置依赖 Playwright 安装               |
| 3    | 2          | 目录结构依赖配置完成                   |
| 4    | 3          | 第一个测试依赖基础设施                 |
| 5-8  | 4          | 所有测试依赖第一个测试验证基础设施可用 |
| 9    | 5-8        | CI 需所有测试通过                      |
| 10   | 9          | 文档需最终验证完成                     |

---

## TODOs

- [ ] 0. 配置 Examples 依赖安装脚本

  **What to do**:
  - 在根目录 `package.json` 添加 `examples:install` 脚本
  - 脚本需安装 main, react16, vue3 的依赖
  - 使用 `npm install --legacy-peer-deps` 处理老版本依赖兼容

  **Must NOT do**:
  - 不修改 examples 的 package.json 依赖版本
  - 不将 examples 加入 pnpm workspace

  **Parallelizable**: NO (基础依赖)

  **References**:
  - `package.json:8-24` - 现有 scripts 结构
  - `examples/main/package.json` - main 应用依赖
  - `examples/react16/package.json` - react16 依赖
  - `examples/vue3/package.json` - vue3 依赖
  - `pnpm-workspace.yaml:4-6` - examples 被注释未在 workspace 中

  **Acceptance Criteria**:
  - [ ] `pnpm run examples:install` 成功执行
  - [ ] `examples/main/node_modules` 存在
  - [ ] `examples/react16/node_modules` 存在
  - [ ] `examples/vue3/node_modules` 存在

  **Commit**: YES
  - Message: `chore: add examples:install script for E2E testing`
  - Files: `package.json`

---

- [ ] 1. 安装 Playwright 到 qiankun 包

  **What to do**:
  - 在 `packages/qiankun` 中安装 `@playwright/test` 作为 devDependency
  - 运行 `npx playwright install chromium` 安装浏览器
  - 在 package.json 添加 `test:e2e` 脚本

  **Must NOT do**:
  - 不安装 Firefox/Safari
  - 不全局安装 Playwright

  **Parallelizable**: NO (依赖 Task 0)

  **References**:
  - `packages/qiankun/package.json` - 目标 package.json
  - Playwright 官方安装文档: https://playwright.dev/docs/intro

  **Acceptance Criteria**:
  - [ ] `packages/qiankun/package.json` 包含 `"@playwright/test": "^1.x"`
  - [ ] `pnpm --filter qiankun run test:e2e --help` 显示 Playwright 帮助
  - [ ] `npx playwright --version` 显示版本号

  **Commit**: YES
  - Message: `chore(qiankun): add playwright for E2E testing`
  - Files: `packages/qiankun/package.json`, `pnpm-lock.yaml`

---

- [ ] 2. 创建 Playwright 配置文件

  **What to do**:
  - 创建 `packages/qiankun/playwright.config.ts`
  - 配置 testDir 指向 `e2e/`
  - 配置 webServer 启动 main + react16 + vue3
  - 配置 Chromium only
  - 配置 timeout, retries, reporter
  - 添加 `.gitignore` 条目: `playwright-report/`, `test-results/`

  **Must NOT do**:
  - 不配置多浏览器
  - 不配置 sharding

  **Parallelizable**: NO (依赖 Task 1)

  **References**:
  - `vitest.config.ts` - 项目现有测试配置风格参考
  - `packages/create-qiankun/vitest.config.ts` - 包级配置参考
  - Playwright webServer 文档: https://playwright.dev/docs/test-webserver
  - 端口映射:
    - main: 7099
    - react16: 7100
    - vue3: 7105

  **Acceptance Criteria**:
  - [ ] `packages/qiankun/playwright.config.ts` 存在
  - [ ] `npx playwright test --list` 无报错
  - [ ] 配置包含 `webServer` 配置
  - [ ] 配置 `projects` 只有 chromium
  - [ ] `.gitignore` 包含 E2E 输出目录

  **Commit**: YES
  - Message: `feat(qiankun): add playwright configuration`
  - Files: `packages/qiankun/playwright.config.ts`, `.gitignore`

---

- [ ] 3. 创建 E2E 测试目录结构

  **What to do**:
  - 创建 `packages/qiankun/e2e/` 目录
  - 创建 `packages/qiankun/e2e/fixtures/` 目录 (自定义 fixtures)
  - 创建 `packages/qiankun/e2e/utils/` 目录 (测试工具函数)
  - 创建基础 fixture 文件 `fixtures/qiankun.fixture.ts`

  **Must NOT do**:
  - 不过度抽象，保持简单

  **Parallelizable**: NO (依赖 Task 2)

  **References**:
  - `packages/shared/src/__tests__/` - 项目测试目录结构参考
  - Playwright fixtures 文档: https://playwright.dev/docs/test-fixtures
  - `examples/main/index.js:1-35` - loadMicroApp 使用示例，了解需要验证的行为

  **Acceptance Criteria**:
  - [ ] 目录 `packages/qiankun/e2e/` 存在
  - [ ] 目录 `packages/qiankun/e2e/fixtures/` 存在
  - [ ] 文件 `packages/qiankun/e2e/fixtures/qiankun.fixture.ts` 存在
  - [ ] fixture 导出扩展的 test 对象

  **Commit**: YES
  - Message: `feat(qiankun): create E2E test directory structure`
  - Files: `packages/qiankun/e2e/**`

---

- [ ] 4. 编写第一个 E2E 测试: 微应用加载

  **What to do**:
  - 创建 `packages/qiankun/e2e/load-micro-app.e2e.spec.ts`
  - 测试场景: 主应用成功加载 react16 子应用
  - 验证: 子应用容器出现，子应用内容渲染

  **Must NOT do**:
  - 不测试所有子应用，只测 react16
  - 不验证网络请求细节

  **Parallelizable**: NO (验证基础设施)

  **References**:
  - `examples/main/index.js:5-8` - microApps 配置，了解子应用名称和端口
  - `examples/main/index.html:39-44` - 侧边栏选择器，用于触发加载
  - `examples/main/index.js:12-32` - 点击事件处理，了解加载流程
  - `examples/react16/src/App.js` - react16 子应用入口，了解渲染内容
  - `packages/qiankun/src/apis/loadMicroApp.ts:12-121` - loadMicroApp API 实现

  **Acceptance Criteria**:
  - [ ] 测试文件 `load-micro-app.e2e.spec.ts` 存在
  - [ ] `pnpm --filter qiankun run test:e2e` 执行通过
  - [ ] 测试包含: 访问主应用 → 点击 react16 → 验证子应用加载

  **Commit**: YES
  - Message: `test(qiankun): add E2E test for micro-app loading`
  - Files: `packages/qiankun/e2e/load-micro-app.e2e.spec.ts`

---

- [ ] 5. 编写沙箱隔离测试

  **What to do**:
  - 创建 `packages/qiankun/e2e/sandbox-isolation.e2e.spec.ts`
  - 测试场景: 子应用全局变量不污染主应用
  - 使用 `page.evaluate()` 在子应用设置全局变量
  - 切换子应用后验证全局变量不存在

  **Must NOT do**:
  - 不测试 sandbox 内部实现细节
  - 不依赖特定的沙箱模式配置

  **Parallelizable**: YES (与 Task 7)

  **References**:
  - `packages/sandbox/src/core/` - sandbox 实现，了解隔离机制
  - `packages/qiankun/src/core/loadApp.ts` - sandbox 配置传递方式
  - `examples/main/index.js:26` - sandbox 配置: `{ sandbox: true }`
  - Playwright evaluate 文档: https://playwright.dev/docs/evaluating

  **Acceptance Criteria**:
  - [ ] 测试文件 `sandbox-isolation.e2e.spec.ts` 存在
  - [ ] 测试验证: 子应用全局变量在卸载后不可访问
  - [ ] `pnpm --filter qiankun run test:e2e` 全部通过

  **Commit**: YES
  - Message: `test(qiankun): add E2E test for sandbox isolation`
  - Files: `packages/qiankun/e2e/sandbox-isolation.e2e.spec.ts`

---

- [ ] 6. 编写生命周期钩子测试

  **What to do**:
  - 创建 `packages/qiankun/e2e/lifecycle.e2e.spec.ts`
  - 测试场景: mount/unmount 正确触发
  - 加载子应用 → 验证 mounted
  - 切换子应用 → 验证前一个 unmounted

  **Must NOT do**:
  - 不测试 bootstrap 钩子 (只触发一次，难以验证)

  **Parallelizable**: YES (与 Task 8)

  **References**:
  - `packages/qiankun/src/types.ts` - LifeCycles 类型定义
  - `examples/react16/src/index.js` - react16 生命周期导出 (如果存在)
  - `examples/main/index.js:18-28` - unmount 调用方式

  **Acceptance Criteria**:
  - [ ] 测试文件 `lifecycle.e2e.spec.ts` 存在
  - [ ] 测试验证: 子应用加载后 DOM 存在
  - [ ] 测试验证: 子应用切换后前一个 DOM 清除
  - [ ] `pnpm --filter qiankun run test:e2e` 全部通过

  **Commit**: YES
  - Message: `test(qiankun): add E2E test for lifecycle hooks`
  - Files: `packages/qiankun/e2e/lifecycle.e2e.spec.ts`

---

- [ ] 7. 编写样式隔离测试

  **What to do**:
  - 创建 `packages/qiankun/e2e/style-isolation.e2e.spec.ts`
  - 测试场景: 子应用样式不影响主应用
  - 记录主应用元素的样式
  - 加载子应用
  - 验证主应用元素样式未变化

  **Must NOT do**:
  - 不验证所有 CSS 属性，选择关键属性即可

  **Parallelizable**: YES (与 Task 5)

  **References**:
  - `packages/loader/src/` - 样式隔离实现
  - `examples/main/index.less` - 主应用样式
  - `examples/react16/src/App.css` - react16 样式

  **Acceptance Criteria**:
  - [ ] 测试文件 `style-isolation.e2e.spec.ts` 存在
  - [ ] 测试验证: 主应用 header 样式在子应用加载前后一致
  - [ ] `pnpm --filter qiankun run test:e2e` 全部通过

  **Commit**: YES
  - Message: `test(qiankun): add E2E test for style isolation`
  - Files: `packages/qiankun/e2e/style-isolation.e2e.spec.ts`

---

- [ ] 8. 编写多应用切换测试

  **What to do**:
  - 创建 `packages/qiankun/e2e/multi-app-switch.e2e.spec.ts`
  - 测试场景: react16 和 vue3 之间切换
  - 加载 react16 → 验证渲染 → 切换 vue3 → 验证渲染
  - 验证切换过程无报错

  **Must NOT do**:
  - 不测试快速连续切换 (边界场景留后续)

  **Parallelizable**: YES (与 Task 6)

  **References**:
  - `examples/main/index.html:39-44` - 侧边栏选择器
  - `examples/vue3/` - vue3 应用结构
  - 需要在 main/index.html 添加 vue3 选项 (如果不存在)

  **Acceptance Criteria**:
  - [ ] 测试文件 `multi-app-switch.e2e.spec.ts` 存在
  - [ ] 测试验证: react16 加载成功
  - [ ] 测试验证: 切换到 vue3 成功
  - [ ] 控制台无错误
  - [ ] `pnpm --filter qiankun run test:e2e` 全部通过

  **Commit**: YES
  - Message: `test(qiankun): add E2E test for multi-app switching`
  - Files: `packages/qiankun/e2e/multi-app-switch.e2e.spec.ts`

---

- [ ] 9. 集成 CI 工作流

  **What to do**:
  - 修改 `.github/workflows/ci.yml`
  - 添加 `e2e-test` job，与 `unit-test` 并行
  - 配置 examples 依赖安装
  - 配置 Playwright 浏览器缓存
  - 上传测试报告作为 artifact

  **Must NOT do**:
  - 不配置 matrix 多浏览器
  - 不配置 sharding

  **Parallelizable**: NO (依赖所有测试完成)

  **References**:
  - `.github/workflows/ci.yml:1-72` - 现有 CI 配置
  - Playwright CI 文档: https://playwright.dev/docs/ci-intro
  - GitHub Actions Playwright action: `actions/setup-node` + `npx playwright install`

  **Acceptance Criteria**:
  - [ ] `.github/workflows/ci.yml` 包含 `e2e-test` job
  - [ ] e2e-test 与 unit-test 并行 (无 needs 依赖)
  - [ ] CI 运行成功
  - [ ] 失败时上传 `playwright-report/` 作为 artifact

  **Commit**: YES
  - Message: `ci: add E2E testing job with Playwright`
  - Files: `.github/workflows/ci.yml`

---

- [ ] 10. 编写 E2E 测试文档

  **What to do**:
  - 创建 `packages/qiankun/e2e/README.md`
  - 说明如何运行 E2E 测试
  - 说明如何添加新测试
  - 说明调试方法

  **Must NOT do**:
  - 不写详细的 Playwright 教程

  **Parallelizable**: NO (最后一步)

  **References**:
  - `packages/qiankun/README.md` - 现有 README 风格
  - Playwright 文档结构

  **Acceptance Criteria**:
  - [ ] `packages/qiankun/e2e/README.md` 存在
  - [ ] 包含运行命令说明
  - [ ] 包含调试方法说明
  - [ ] 包含添加新测试说明

  **Commit**: YES
  - Message: `docs(qiankun): add E2E testing documentation`
  - Files: `packages/qiankun/e2e/README.md`

---

## Commit Strategy

| After Task | Message | Files | Verification |
| --- | --- | --- | --- |
| 0 | `chore: add examples:install script for E2E testing` | `package.json` | `pnpm run examples:install` |
| 1 | `chore(qiankun): add playwright for E2E testing` | `packages/qiankun/package.json`, `pnpm-lock.yaml` | `npx playwright --version` |
| 2 | `feat(qiankun): add playwright configuration` | `packages/qiankun/playwright.config.ts`, `.gitignore` | `npx playwright test --list` |
| 3 | `feat(qiankun): create E2E test directory structure` | `packages/qiankun/e2e/**` | 目录存在 |
| 4 | `test(qiankun): add E2E test for micro-app loading` | `packages/qiankun/e2e/load-micro-app.e2e.spec.ts` | `pnpm --filter qiankun run test:e2e` |
| 5 | `test(qiankun): add E2E test for sandbox isolation` | `packages/qiankun/e2e/sandbox-isolation.e2e.spec.ts` | 测试通过 |
| 6 | `test(qiankun): add E2E test for lifecycle hooks` | `packages/qiankun/e2e/lifecycle.e2e.spec.ts` | 测试通过 |
| 7 | `test(qiankun): add E2E test for style isolation` | `packages/qiankun/e2e/style-isolation.e2e.spec.ts` | 测试通过 |
| 8 | `test(qiankun): add E2E test for multi-app switching` | `packages/qiankun/e2e/multi-app-switch.e2e.spec.ts` | 测试通过 |
| 9 | `ci: add E2E testing job with Playwright` | `.github/workflows/ci.yml` | CI 通过 |
| 10 | `docs(qiankun): add E2E testing documentation` | `packages/qiankun/e2e/README.md` | 文档存在 |

---

## Success Criteria

### Verification Commands

```bash
# 安装 examples 依赖
pnpm run examples:install

# 本地运行 E2E 测试
pnpm --filter qiankun run test:e2e

# 查看测试报告
npx playwright show-report packages/qiankun/playwright-report

# 调试模式运行
pnpm --filter qiankun run test:e2e -- --debug

# 只运行特定测试
pnpm --filter qiankun run test:e2e -- load-micro-app
```

### Final Checklist

- [ ] 所有 5 个核心测试场景覆盖
- [ ] 本地所有测试通过
- [ ] CI e2e job 通过
- [ ] 连续 3 次运行无 flaky tests
- [ ] 测试报告可访问
- [ ] 文档完整
- [ ] 无修改 examples 核心逻辑
- [ ] 仅使用 Chromium
