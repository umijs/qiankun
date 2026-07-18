# RFC: Fork single-spa 7.x 为 workspace 子包（@qiankunjs/single-spa）

- **Status**: Draft
- **Author**: qiankun maintainers
- **Created**: 2026-07-18
- **Target Release**: qiankun v3.x
- **Tracking Issue**: [#3149](https://github.com/umijs/qiankun/issues/3149)

## Summary

将 [single-spa](https://github.com/single-spa/single-spa) `7.0` 分支源码**一次性 vendor 收编**为本 monorepo 的 `packages/single-spa`，以 `@qiankunjs/single-spa` 发布到 npm，工具链完全归化（Vite 8 + tsc 声明 + vitest）；`packages/qiankun` 的依赖从 npm `single-spa@^6.0.3` 切换为 workspace 包。**不采用** git subtree / git submodule / 独立 fork 仓库 / pnpm patch。

本 RFC 的定位是**可交给任意 agent 独立执行的迁移方案**：事实基线、决策理由、分步执行计划、验收标准均已固化在文中。执行时若发现文中记录的行号 / 细节与代码漂移，以「API 清单 + 验收标准」为准，行号仅作定位提示。

## Motivation

qiankun 构建在 single-spa 之上，但对其的扩展诉求长期受制于「上游 npm 黑盒」：

1. **行为定制只能靠 call-order hack**。例如 `packages/qiankun/src/apis/loadMicroApp.ts` 中必须强制先调 `start()` 再 `mountRootParcel`（single-spa 在派发 `popstate` 前检查 started 状态，见注释引用的 single-spa `navigation-events.js` 与 umijs/qiankun#1071）。这类问题在源头一行就能修，隔着 npm 包只能绕。
2. **类型摩擦无法根治**。`packages/qiankun/src/core/loadApp.ts` 中有两处针对 `ParcelConfigObject` 的 `@ts-ignore`（`bootstrap` 数组形式、条件赋值 `update`），与本仓库「禁 `@ts-ignore`」的规范冲突，只能在类型定义源头解决。
3. **上游已实质停滞，等不来了**。见下方事实基线：v7 卡在 beta 近一年，`latest` 停在 6.0.3。qiankun v3 需要的迭代速度与上游节奏已不匹配。

Issue #3149 的诉求即「fork single-spa 进 monorepo，以便更好的扩展 single-spa 里的实现」。本 RFC 回答"以什么形式 fork"以及"如何安全落地"。

## 事实基线（截至 2026-07-18，执行前建议复核）

### 上游 single-spa 现状

| 事实 | 数据 |
| --- | --- |
| v7 开发线 | `7.0` 分支（**不是** `main`；`main` 是 6.0.3 维护线，两者已 diverge） |
| 收编基线 | `7.0` 分支 HEAD `ce0f925a`，即 tag `v7.0.0-beta.13`（2025-09-22） |
| 活跃度 | `7.0` 分支自 2025-09-22 后无实质提交；npm 上 `beta.13` 之后无任何发布；`latest` dist-tag 仍为 6.0.3 |
| License | MIT（仓库根 `LICENSE`） |
| 仓库形态 | 单包（非 monorepo）；TS 源码位于 `src/`；rollup + babel 构建；jest 双套测试（`spec/` browser-jsdom + `node-spec/` node）；pnpm |
| 运行时依赖 | **零**（`dependencies` 为空） |
| 产物形态 | v7 起 ESM-only（`type: "module"`，exports 仅 `lib/esm`，UMD/SystemJS 已移除） |
| `src/` 结构 | `applications/` `lifecycles/` `navigation/` `parcels/` `devtools/` `utils/` + `single-spa.ts`（主入口）、`single-spa.profile.ts`（profile 变体入口）、`start.ts`、`jquery-support.ts` |

### qiankun 对 single-spa 的完整依赖面

依赖声明（全仓唯一一处直接依赖）：

- `packages/qiankun/package.json` → `dependencies` → `single-spa: ^6.0.3`。无 peerDependencies / devDependencies / `@types/single-spa`。
- （无关项：`benchmark/package.json` 里 `qiankun-v2`（npm alias 至 qiankun@2.10.16）传递依赖 `single-spa@5.9.5`，仅作性能对比基准，不受本迁移影响。）

源码 import 清单（执行 Step 4 时逐一切换的完整名单）：

| 文件 | 使用的 API |
| --- | --- |
| `packages/qiankun/src/apis/registerMicroApps.ts` | `type StartOpts`、`registerApplication`、`start` |
| `packages/qiankun/src/apis/loadMicroApp.ts` | `type ParcelConfigObject`、`mountRootParcel` |
| `packages/qiankun/src/apis/effects.ts` | `getMountedApps`、`navigateToUrl` |
| `packages/qiankun/src/apis/errorHandler.ts` | re-export `addErrorHandler`、`removeErrorHandler` |
| `packages/qiankun/src/types.ts` | `type LifeCycles`、`type Parcel`、`type RegisterApplicationConfig` |
| `packages/qiankun/src/core/loadApp.ts` | `type ParcelConfigObject` |
| `packages/qiankun/src/apis/__tests__/effects.test.ts` | `vi.mock('single-spa', …)` + `getMountedApps`、`navigateToUrl` |

事件契约（非 import，但属于对外行为面）：

- `packages/qiankun/src/apis/effects.ts` 监听 window 事件 `single-spa:no-app-change`、`single-spa:first-mount`；
- `examples/main/src/router.ts` 监听 `single-spa:routing-event`；
- 用户生态广泛监听 `single-spa:*` 系列事件与 `window.singleSpaNavigate` 等全局。

patch / hack 现状：

- 无 `patches/` 目录、无 `pnpm.patchedDependencies`、无 patch-package、无对 single-spa 私有 API 的访问；
- 唯一行为 workaround 即 Motivation 第 1 条（#1071 call-order hack）；
- 唯一类型摩擦即 Motivation 第 2 条（两处 `@ts-ignore`）。

构建 / 测试配置现状：

- `vite.library.config.ts` 按包的 `dependencies`/`peerDependencies` 自动 externalize —— `single-spa` 当前**不打进** qiankun 的 dist（产物中保留裸 import）；
- 根 `vitest.config.ts` 的 `resolve.alias` 显式将 `@qiankunjs/shared|sandbox|loader` 指到各自 `src` 入口；`single-spa` 无 alias，从 node_modules 解析；
- 根 `tsconfig.json` paths：`@qiankunjs/*` → `./packages/*/src`（通配，新包自动覆盖）；
- 根 `vitest.config.ts` 的 projects include：`packages/**/*.{test,spec}.ts`（上游 spec 命名 `*.spec.ts`，导入后自动被发现）。

## 决策：为什么是「一次性 vendor 收编」

| 候选形式 | 结论 | 理由 |
| --- | --- | --- |
| **Vendor 收编（本方案）** | ✅ 采纳 | 上游停滞 → 「可回流同步」价值趋近于零；issue 目标是定制，长期必然分叉；API 面小、无 patch，收编成本低、红利实在；MIT 合规只需保留 LICENSE |
| git subtree | ❌ | 唯一优势是保留 merge 锚点便于整体回流，但上游不动、且工具链归化后 subtree pull 冲突面巨大；零星上游修复用 cherry-pick 即可 |
| git submodule | ❌ | 不能直接改代码（还得先 fork 仓库），与 pnpm workspace / Vite 工具链天然不合 |
| 独立 fork 仓库 + npm 发布 | ❌ | 跨仓迭代割裂（改一行要走两仓发版联调），与「进 monorepo 方便迭代」的目标直接相悖 |
| 继续依赖 npm + pnpm patch | ❌ | 只适合一次性小修，撑不起持续定制；patch 与上游版本强耦合 |

## 包形态设计

- **目录**：`packages/single-spa`；**包名**：`@qiankunjs/single-spa`；正常发布 npm（非 private）。必须发布的原因：`vite.library.config.ts` 会把它 externalize，qiankun 的 dist 中将保留 `@qiankunjs/single-spa` 裸 import；且 `packages/qiankun/src/types.ts` 对外 re-export 了其类型。
- **依赖图位置**：`qiankun → single-spa`；single-spa 保持**零运行时依赖**，不得 import `@qiankunjs/shared`/`sandbox`/`loader`（依赖图最底层，遵守 AGENTS.md「never invert」规则）。
- **版本线**：独立版本，初始 `0.0.1-rc.0`（对齐 monorepo `0.0.1-rc.x` 惯例），后续由 changesets（conventional commits 自动派生）接管；**不**跟随上游 beta 序号。
- **入口**：新增 `src/index.ts` 内容为 `export * from './single-spa';`，上游文件零改动（`single-spa.ts` 保持原名，降低与上游的 diff 面）。`single-spa.profile.ts` profile 变体阶段一不构建、不发布，文件保留。
- **构建**：完全照抄 `packages/loader/package.json` 的模式 —— `vite build --config ../../vite.library.config.ts` + `tsc -p tsconfig.build.json` + `copy-declarations.mjs`，产出 `dist/esm` + `dist/cjs`，`main`/`module`/`types` 指向 dist。上游的 rollup/babel/jest/husky/heeler 配置一律不带入。
- **License**：拷贝上游 `LICENSE` 至 `packages/single-spa/LICENSE`；`package.json` `license: MIT`；包 README 注明 fork 来源与基线（`single-spa/single-spa` `7.0` 分支 @ `ce0f925a`，v7.0.0-beta.13）。

### 不可变契约（fork 后永久保持）

1. **window 事件名全保留**：`single-spa:before-routing-event`、`single-spa:routing-event`、`single-spa:no-app-change`、`single-spa:first-mount` 等 `single-spa:*` 系列 —— qiankun 自身与用户生态都在监听。
2. **devtools 钩子保留**：`src/devtools/`（`window.__SINGLE_SPA_DEVTOOLS__`），保证 single-spa-inspector 浏览器插件对现有用户继续工作。
3. **阶段一公开 API 与类型签名 1:1**：不加、不删、不改任何导出。

## 执行计划

### 阶段一：1:1 导入切换（本 RFC 的交付范围）

原则：**「换底座」与「改行为」严格分离**。阶段一结束时，qiankun 的一切可观测行为与切换前一致（唯一例外：底座从 single-spa 6.0.3 变为 7.0.0-beta.13 基线所隐含的 v7 行为差异，由 Step 5 显式审阅、Step 6 全量验证兜底）。

#### Step 1 — 导入源码

```bash
git clone --depth 1 --branch 7.0 https://github.com/single-spa/single-spa.git /tmp/single-spa-vendor
# 校验基线：git -C /tmp/single-spa-vendor rev-parse HEAD 应为 ce0f925a…（若上游 7.0 分支有了新提交，
# 更新本 RFC 的基线记录后以新 HEAD 为准）
mkdir -p packages/single-spa
cp -R /tmp/single-spa-vendor/src packages/single-spa/src
cp -R /tmp/single-spa-vendor/spec packages/single-spa/spec
cp -R /tmp/single-spa-vendor/node-spec packages/single-spa/node-spec
cp /tmp/single-spa-vendor/LICENSE packages/single-spa/LICENSE
```

不拷贝：`rollup.config.js`、`.babelrc.json`、`jest-*.config.js`、`.husky/`、`package.json`（重写）、`pnpm-lock.yaml`、`CHANGELOG.md`（历史归上游，本包从零记）。

导入 commit 独立成一个（`chore(single-spa): vendor single-spa 7.0 branch @ ce0f925a`），后续归化改动不与导入混在同一 commit —— review 时才能区分「上游原样」与「我们的改动」。

#### Step 2 — 包骨架与工具链归化

1. `packages/single-spa/package.json`：参照 `packages/loader/package.json` 结构（scripts.build / main / module / types / files / publishConfig），`name: "@qiankunjs/single-spa"`、`version: "0.0.1-rc.0"`、`license: "MIT"`、无 dependencies。
2. `packages/single-spa/tsconfig.build.json`：参照相邻包（如 `packages/loader/tsconfig.build.json`）。上游 `tsconfig.json` 的编译选项与本仓库不同，以本仓库为准；因此产生的类型报错在**不改行为**的前提下用最小改动修复（允许改类型标注，不允许改运行时逻辑）。
3. 新增 `src/index.ts` 入口 re-export（见包形态设计）。
4. 根 `vitest.config.ts` 的 `resolve.alias` 增加一行：`'@qiankunjs/single-spa': fromRoot('./packages/single-spa/src/index.ts')`（现有 alias 机制是显式逐包列出，必须补）。
5. **ESLint 豁免**：`eslint.config.mjs` 新增一个 `qiankun/vendored-single-spa` 配置块（`files: ['packages/single-spa/**']`），关闭 strict type-checked 系列规则（`no-explicit-any`、`no-unsafe-*`、`no-unnecessary-condition` 等，按实际报错定集合），保留基础 recommended + prettier。**原则：不为过 lint 改上游代码。** 收紧留到阶段二。
6. 全目录跑一次 `prettier -w packages/single-spa` 归一格式（上游本就用 prettier，diff 可控；此步单独成 commit）。
7. 更新根 `AGENTS.md`：STRUCTURE 树加 `packages/single-spa`，依赖图加 `qiankun → single-spa`（零依赖底层）。

#### Step 3 — 测试迁移（jest → vitest）

上游 `spec/`（`apis/` `apps/` `parcels/`，`*.spec.ts`，jsdom 环境）+ `node-spec/nodejs.spec.ts`（node 环境）。这套 spec 是后续定制不回归的保命资产，**必须迁移而非丢弃**。

1. 根 `vitest.config.ts` 的 include（`packages/**/*.{test,spec}.ts`）会自动发现它们；机械替换 jest API → vitest（`jest.fn` → `vi.fn`、`jest.mock` → `vi.mock`、timer API 等）。
2. **环境风险**：本仓库 vitest 环境是 happy-dom，而 single-spa spec 重度依赖 navigation（`location`/`history`/`popstate`/`hashchange`），happy-dom 与 jsdom 在此处行为有差异。若出现大面积环境性失败，**允许**为该包的 spec 单独指定 jsdom（vitest per-project environment 或文件头 `// @vitest-environment jsdom` 注释），这不算破坏 monorepo 惯例。
3. `node-spec/nodejs.spec.ts`（SSR/node 场景）：迁移并以 node 环境运行；若与现有 vitest projects 配置冲突，可为其单独建 project。
4. 迁移完成标准：上游 spec 在 vitest 下**全绿**（逐个用例语义不变；确因测试框架差异无法迁移的用例允许 `it.skip` 并附注释说明原因，skip 数量需在 PR 描述中列明）。

#### Step 4 — qiankun 切换依赖

1. `packages/qiankun/package.json`：`dependencies` 中 `"single-spa": "^6.0.3"` → `"@qiankunjs/single-spa": "workspace:^"`。
2. 按「源码 import 清单」逐文件把 `'single-spa'` 改为 `'@qiankunjs/single-spa'`（含 `effects.test.ts` 里的 `vi.mock`）。改完 `grep -rn "from 'single-spa'" packages/` 必须为空。
3. `pnpm install` 刷新 lockfile。此后 lockfile 中唯一的上游 `single-spa` 应只剩 benchmark 的传递依赖。

#### Step 5 — 6→7 差异审阅（导入即升级，必须显式过一遍）

qiankun 当前运行在 single-spa 6.0.3 上，切换后底座是 7.0.0-beta.13。已知 v7 breaking（源自上游 CHANGELOG）与 qiankun 的关系：

| v7 变更 | 对 qiankun 的影响 | 处置 |
| --- | --- | --- |
| `bootstrap` 生命周期改名 `init`（未提供 `init` 时 `bootstrap` 向后兼容） | `loadApp.ts` 产出的 `ParcelConfigObject` 用的是 `bootstrap` | 阶段一靠向后兼容不改；阶段二再评估是否切 `init` |
| `timeouts.bootstrap` → `timeouts.init`、`setBootstrapMaxTime` → `setInitMaxTime` | qiankun 未使用 | 无 |
| 状态常量改为 `AppOrParcelStatus` 对象导出 | qiankun 未 import 状态常量 | 无 |
| 移除 legacy lifecycle、`singleSpa` prop、custom-event polyfill、UMD/SystemJS 产物 | qiankun 未依赖 | 无（本包自建 dist/cjs 产物，不受上游移除 UMD 影响） |
| 类型面变化（`StartOpts`、`ParcelConfig` timeouts 可选、`ErrorHandler`/`SingleSpaError` 导出、activity fn 放宽为可接受 URL） | qiankun import 的 5 个类型 | 执行时逐一核对 qiankun import 的每个类型名在 v7 源码中的存在性与形状：`StartOpts` ✓（beta.3 起导出）、`LifeCycles`、`Parcel`、`ParcelConfigObject`、`RegisterApplicationConfig` —— 若有改名，在 qiankun 侧跟随改名，**不在** fork 侧加兼容别名 |

审阅时以 `packages/single-spa/src/single-spa.ts` 的实际导出为准核对上表，发现表外差异一律记录进 PR 描述。

另外两个顺手项（属阶段一允许的"类型层"修复，不改运行时行为）：

- `loadApp.ts` 两处 `@ts-ignore` —— 若 v7 类型定义已能表达（如 timeouts 可选、lifecycle 数组形式），直接删掉 ignore；若仍不能，保留并在阶段二于 fork 侧修类型。
- `registerMicroApps.ts` 的 `start()`：v7 中 `StartOpts` 已可选（beta.4），签名核对即可。

#### Step 6 — 全量验证

```bash
pnpm install
pnpm run build          # 全部包 + examples 构建通过
pnpm run test           # 全部 unit（含新迁移的 single-spa spec）绿
pnpm run eslint         # 含豁免块后全绿
pnpm run prettier:check
pnpm run test:e2e       # Playwright 全量（先 build:packages，见 e2e/README.md）
```

e2e 是 6→7 行为差异的最终裁判：路由切换、多实例 `loadMicroApp`、remount、ESM-sandbox 场景都必须过。

### 阶段二：定制迭代（不在本 RFC 交付范围，仅列方向）

1. 源头修复 #1071：让 `mountRootParcel` 不依赖 started 状态（或提供显式 opt-in），删除 `loadMicroApp.ts` 的强制 `start()` hack。
2. fork 侧修 `ParcelConfigObject` 类型，彻底消灭 qiankun 侧残留的 `@ts-ignore`（若阶段一未能删净）。
3. 裁剪 qiankun 不需要的模块（`jquery-support.ts` 等），缩产物体积。
4. 逐步收紧 ESLint：分模块把 `packages/single-spa` 纳入 strict type-checked，直至删除豁免块。
5. 评估 `bootstrap` → `init` 切换与 v7 新能力（如 profile 构建）的利用。

每项独立走 conventional commit / PR，正常触发 changesets 发版。

## 风险与缓解

| 风险 | 缓解 |
| --- | --- |
| 「导入」同时是「6→7 升级」，行为差异混入 | 阶段一严格 1:1 + Step 5 显式差异审阅 + Step 6 全量 e2e；导入/归化/切换分 commit，可二分 |
| happy-dom 下 navigation 类 spec 不兼容 | 允许该包 spec 单独用 jsdom 环境（Step 3.2） |
| 上游代码过不了本仓库 strict lint | 阶段一 ESLint 豁免块，不为 lint 改行为（Step 2.5） |
| 上游若复活、需要回流修复 | 包 README 记录基线 sha；用 `git log ce0f925a..upstream/7.0` 找增量、逐个 cherry-pick（源码目录结构保持原样即为此服务） |
| `workspace:^` 发版联动 | changesets 自动处理 workspace 协议替换，与现有 `@qiankunjs/*` 包一致，无新增流程 |

## 验收标准（执行 PR 的 Definition of Done）

- [ ] `packages/single-spa` 存在，含上游 `src/`（结构原样）+ `spec/` + `node-spec/` + `LICENSE` + README（注明 fork 基线 sha）
- [ ] 导入基线 = 上游 `7.0` 分支 HEAD（执行时复核，当前为 `ce0f925a` / v7.0.0-beta.13），且「原样导入」独立成 commit
- [ ] `@qiankunjs/single-spa` 构建产出 `dist/esm` + `dist/cjs` + 声明文件，包字段对齐 monorepo 惯例
- [ ] 零运行时依赖；未 import 任何 `@qiankunjs/shared|sandbox|loader`
- [ ] 上游 spec 迁至 vitest 全绿（skip 项已在 PR 描述列明缘由）
- [ ] `packages/` 下 `grep -rn "from 'single-spa'"` 为空；`packages/qiankun` 依赖 `@qiankunjs/single-spa: workspace:^`
- [ ] 根 `vitest.config.ts` alias、`AGENTS.md`（STRUCTURE + 依赖图）、`eslint.config.mjs`（豁免块）已同步更新
- [ ] `pnpm run ci` 全绿；`pnpm run test:e2e` 全绿
- [ ] `single-spa:*` window 事件与 `__SINGLE_SPA_DEVTOOLS__` 钩子行为不变（e2e / 手工验证）
- [ ] Step 5 差异审阅结论（含类型名核对表）写入执行 PR 描述

## 附：上游同步策略（收编后）

预期常态是**不同步**（上游停滞 + 我们主动分叉）。若上游出现值得吸收的修复：

```bash
git remote add single-spa-upstream https://github.com/single-spa/single-spa.git
git fetch single-spa-upstream 7.0
git log <当前基线sha>..single-spa-upstream/7.0 --oneline   # 审阅增量
# 对选中的 commit：git show <sha> -- src/ | 手工套用到 packages/single-spa/src/（路径前缀不同，patch 需 -p 调整或手工）
# 吸收后更新包 README 的基线记录
```

不追求自动化 —— 按上游当前活跃度，这条路径的预期使用频率是每年 0~2 次。
