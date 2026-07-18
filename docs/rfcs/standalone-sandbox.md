# RFC: Standalone Sandbox — 沙箱能力独立开放

- **Status**: Accepted
- **Author**: qiankun maintainers
- **Created**: 2026-07-18
- **Last Revision**: 2026-07-18（实现与验收完成）
- **Target Release**: `@qiankunjs/sandbox` v3.x
- **Tracking Issue**: TBD
- **Depends on**: [Compartment Alignment RFC](./compartment-alignment.md)（Accepted，本 RFC 是其延伸阶段⑤）

## Summary

让 `@qiankunjs/sandbox` 成为可被**非 qiankun 用户**独立使用的浏览器隔离库：

1. **JS 隔离开箱即用**——classic 脚本求值与 ESM `import()` 不需要任何 qiankun/loader 上下文。
2. **DOM/样式遏制按需开启**——容器协议由包自身负责建立，不再要求用户复刻 loader 的隐式约定。
3. **qiankun 退化为普通消费者**——`loadApp` 与独立用户走同一公开入口，吃自己的狗粮。

**边界**：纯开放，不改隔离分寸。membrane 的 non-transitive 定位、写隔离/身份共享语义、副作用清理范围均维持 Compartment Alignment RFC 声明的现状。

## Motivation

Compartment 对齐完成后（2026-07-18 standalone 可用性审计），独立使用的现状分三层：

1. **JS 隔离层已可独立用**：`moduleHost` 全部字段可选且默认值完备（`entryUrl` = `document.baseURI`、`fetch` = 原生、`globalsBaseSet` = `esmDestructurableGlobals`、`instanceId` 自动分配）。`new StandardSandbox(name, globals)` + `evaluateScript()` / `import()` 即可运行——这是对齐工作的直接红利，但没有任何文档承认这条路径。
2. **完整沙箱层能跑但要伪造 loader 形状**：`createSandboxContainer` 的 `nodeTransformer` / `fetch` 必填（loader 概念泄漏）；head 定向动态样式要求容器内存在 `<qiankun-head>`（本由 loader 流式改写产生，缺失抛 `QiankunError`）；`styleIsolation` 的 `scopeRoot` 与容器 `data-name` 配对约定拼装在 `loadApp` 里，包内无 helper。
3. **文档为零**：无 README、无示例；唯一的 standalone「教程」是单元测试。

另有一个无文档的坑：裸 `Compartment` 的 `defaultUnshadowableGlobalNames` 只含 ES intrinsics + rAF/cAF，不含 `window`/`self`/`document`——classic 脚本里 `window.x = 1` 会穿透污染宿主。自引用安装是 `StandardSandbox` 第二阶段的职责，但没有任何指引告诉用户「classic 求值必须走 StandardSandbox」。

## Design

### 1. 分层公开面：两个入口，各自完整

| 层 | 入口 | 能力 | 依赖 |
| --- | --- | --- | --- |
| **Layer A — JS 隔离** | `StandardSandbox`（预设）/ `Compartment`（机制） | 写隔离 global、classic 求值、ESM `import()`/hooks | 无 DOM 假设 |
| **Layer B — 完整沙箱** | `createSandbox()` | Layer A + DOM 遏制、样式隔离、定时器/监听器回收、插件生命周期 | 需要容器 |

分层职责不变：`Compartment` 保持规范投影的纯粹性（不默认安装 `window` 自引用——那不是 Compartment 规范形状的一部分）；`StandardSandbox` 是 classic 求值的安全入口。针对穿透坑的防护：

- `Compartment.evaluateScript()` 在 dev 模式检测 `window` 未被定义为自引用时发出一次性 `console.warn`，指向 `StandardSandbox`；运行语义不变。
- README 与文档以「两个入口」为第一原则组织，杜绝用户按规范直觉误入裸 `Compartment`。

### 2. `createSandbox()`：默认值完备的完整沙箱入口

现 `createSandboxContainer` 直接更名为 `createSandbox`，不保留旧名——`@qiankunjs/sandbox` 目前没有外部用户，无兼容负担。选项全面默认值化：

```ts
function createSandbox(
  appName: string,
  opts?: {
    /** 提供即开启 DOM 遏制；缺省为纯 JS 隔离（不安装 dynamicAppend 插件） */
    container?: HTMLElement | (() => HTMLElement);
    globals?: CompartmentGlobals;
    incubatorContext?: WindowProxy;
    modules?: Modules;
    resolveHook?: ResolveHook;
    importHook?: ImportHook;
    loadHook?: ImportHook;
    plugins?: readonly IsolationPlugin[];
    /** boolean 即可；scopeRoot/data 属性契约由包内部建立 */
    styleIsolation?: boolean;
    /** 默认 window.fetch */
    fetch?: typeof window.fetch;
    /** 默认为「隔离保持」转换器（见下），可覆盖 */
    nodeTransformer?: NodeTransformer;
    compartmentOptions?: Omit<CompartmentOptions, 'globals' | 'incubatorContext' | 'name'>;
  },
): SandboxController;
```

**关键设计约束：默认值必须保隔离。** `nodeTransformer` 的默认值**绝不能是 identity**——dynamicAppend 拦截到的动态 `<script>` 依赖 transformer 经 `transformClassicScript` 包装后执行，identity 等于沙箱逃逸。默认实现基于 `@qiankunjs/shared` 的 `transpileAssets`（sandbox 已依赖 shared，不引入新依赖方向），entry 基准取 `document.baseURI`；它是内部实现细节，不将 assets-transpilers 提升为公开 API。

必填项收敛为 `appName` 一个；`container` 缺省时按「JS-only 预设」装配插件（interval / windowListener / historyListener——它们不依赖容器），提供 `container` 时装配完整 Standard 预设。

### 3. 容器协议包内化

- 新增公开 helper `prepareSandboxContainer(container, appName)`：确保 `<qiankun-head>` 存在、设置 `data-name`、返回配好的 `StyleIsolationOpts` 与清理函数。`createSandbox({ container })` 自动调用。
- `createSandbox` 在 mount 阶段若容器缺 `<qiankun-head>` **且不处于 loader 流式管线**（以 loader streamed 标记区分）则自动创建，消除 standalone 用户的 `QiankunError` 硬雷；loader 场景保持现状报错——那里缺失代表真实的时序 bug，不应被静默掩盖。容器准备只属于完整沙箱预设：JS-only 预设即使在 `mount(container)` 收到元素也不触碰它。
- `styleIsolation` 的 `{ appName, scopeRoot }` 构造从 `loadApp` 下沉进包内，qiankun 与 standalone 共享同一份契约代码。

### 4. qiankun 收编为消费者

`loadApp` 改走 `createSandbox` 同一入口：传入真实的 nodeTransformer（含 moduleResolver / styleIsolation）、装饰后的 fetch、真实容器。qiankun 专有的 `moduleHost` 字段（`entryUrl` / `instanceId` / `materializeRedirect` / `isLifecycleNamespace`）继续经 `compartmentOptions.moduleHost` 传入——它们全部有默认值，非 qiankun 用户零感知。此步骤与 IsolationPlugin 的「dynamicAppend 吃狗粮」同构：qiankun 对包的每一次使用都必须可被外部用户复刻。

### 5. 文档与示例

- `packages/sandbox/README.md`：两条路径的快速上手 + **隔离分寸声明**（non-transitive membrane、写隔离、身份共享——链接 Compartment Alignment RFC 的机制定位段），npm 页面可见。
- `docs/cookbook/standalone-sandbox.md`（en + zh-CN）：完整教程。
- `examples/standalone-sandbox`：零 qiankun 依赖的 demo（隔离加载一个第三方 widget 脚本）。

### 6. 形状与回归守卫

- **standalone 冒烟测试套件**：以 README 示例为蓝本（classic 写隔离、`window` 穿透防护、ESM `import()`、动态 append 遏制、styleIsolation、dispose 无泄漏），全程不 import qiankun/loader，进 CI。
- 依赖方向守卫维持（sandbox → shared）；新增守卫：sandbox 源码不得出现 loader 专有类型（结构化 facade 除外）。
- qiankun 路径回归门禁：全量 e2e 保持通过 + 复用 rfc-performance 性能闸门（含 95% CI 分辨率守卫），作为「收编不改行为、不回归性能」的硬指标。

## 阶段划分（接 Compartment Alignment 的①—④）

| 阶段 | 内容 | 性质 |
| --- | --- | --- |
| ⑤a 入口与默认值 | `createSandbox`、默认 transformer/fetch、容器协议内化、穿透 dev 警告 | 新增 + 少量重构 |
| ⑤b 文档与示例 | README、cookbook（双语）、standalone example、冒烟测试 | 纯新增 |
| ⑤c 收编与守卫 | `loadApp` 消费同一入口、形状守卫、e2e/性能门禁 | 内部重构 |

## Acceptance Criteria

1. 一个不依赖 qiankun/loader 的项目，仅按 README 即可完成：classic 脚本隔离执行、ESM 入口 `import()`、动态 DOM/样式遏制、卸载与 dispose 清理。
2. `createSandbox` 必填项仅 `appName`；所有默认值保持隔离语义（尤其动态 script 的包装路径有专门测试钉住「默认非 identity」）。
3. 裸 `Compartment` 的 classic 求值在 dev 模式有穿透警告；README 有明确的两入口分层指引。
4. qiankun `loadApp` 与 standalone 用户走同一公开入口；全量 e2e 保持通过；rfc-performance 闸门无回归。
5. standalone 冒烟测试套件进 CI，且不 import qiankun/loader。
6. 零新增运行时依赖；CSP 无 `unsafe-eval` 场景全覆盖（含默认 transformer 路径）。

## Non-Goals

- **不做强隔离**——iframe / Worker / callable boundary 是独立产品形态；本 RFC 与 Compartment Alignment 的 Non-Goals 完全继承（不 harden、不 lockdown、不改隔离分寸）。
- **不把 `shared/assets-transpilers` 提升为公开 API**——默认 nodeTransformer 是内部实现细节，覆盖点是 `nodeTransformer` 本身。
- **不支持 Node/SSR 环境**——浏览器专用（blob script、DOM、import map）。
- **不做独立品牌化**——包名维持 `@qiankunjs/sandbox`，独立命名留待生态验证后再议。

## Implementation Verification（2026-07-18）

阶段⑤已完成，并按上述 Acceptance Criteria 验收：

- `@qiankunjs/sandbox` 单元测试 60/60 通过；workspace 全量单元测试通过；`loadApp` 定向回归 6/6 通过。
- `pnpm run ci` 通过；文档构建通过。
- Chromium 全量 e2e 38/38 通过，其中 standalone fixture 在不允许 `unsafe-eval` 的 CSP 下覆盖 classic、动态 append、样式隔离、真实 ESM module graph 与 dispose 清理。
- standalone 测试与示例均不依赖 qiankun/loader；依赖方向另由 ESLint 规则守卫。
- 性能闸门以变更前源码提交 `491b16c8` 为 baseline，使用 400 组配对样本；为满足 benchmark harness 的输入指纹要求，baseline 临时工作树仅同步了新增 example importer 对应的 lockfile 形状，运行时与包源码保持未变。四项指标均满足“回归不超过 5%，且 95% CI 宽度小于 10 个百分点”：

| 指标 | Baseline | Current | 变化 | 95% CI | 结论 |
| --- | ---: | ---: | ---: | ---: | --- |
| Membrane get | 23.26 Mops/s | 23.26 Mops/s | +0.00% | +0.00%～+0.47% | 通过 |
| Membrane set | 42.74 Mops/s | 42.74 Mops/s | -0.00% | -0.85%～+0.00% | 通过 |
| Module rewrite | 69.74 MiB/s | 69.74 MiB/s | +0.00% | +0.00%～+0.00% | 通过 |
| Load chain | 40.00 ms | 39.90 ms | -1.72% | -6.14%～+2.48% | 通过 |

## Risks and Mitigations

- **默认 transformer 的隐式行为**（动态 script 被自动包装）可能让 standalone 用户意外 → README 显式声明 + `nodeTransformer` 可覆盖 + 冒烟测试展示两种行为。
- **`qiankun-head` 自动创建与 loader 流的边界**：靠 loader streamed 标记区分，两侧各有测试钉住（standalone 自动建成功 / loader 缺失仍报错）。
- **dev 警告误报**（用户自行定义了 window 自引用）：检测基于 `definedUnshadowableGlobalNames` 实际状态而非入口类型。

## References

- [Compartment Alignment RFC](./compartment-alignment.md)——依赖的公开面与机制定位（membrane non-transitive、`incubatorContext` 出处）
- [TC39 proposal-compartments](https://github.com/tc39/proposal-compartments) / [ses](https://github.com/endojs/endo/tree/master/packages/ses)
- 现有单元测试中的 standalone 用法（`packages/sandbox/src/core/**/__tests__`）——本 RFC 将其升格为受支持的公开旅程
