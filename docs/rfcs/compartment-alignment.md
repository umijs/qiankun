# RFC: Compartment Alignment for qiankun Sandbox

- **Status**: Draft
- **Author**: qiankun maintainers
- **Created**: 2026-07-18
- **Target Release**: qiankun v3.x
- **Tracking Issue**: TBD
- **Last Revision**: 2026-07-18（首轮 review 修订：确立「只对齐 API 形状、不复制 ses 行为，隔离分寸不动」原则并贯穿 §5/成功标准；修正 `moduleResolver` 的规范映射（redirect → `modules` 表而非 `resolveHook`）；`evaluateScript` 返回值改 `Promise<void>`（blob script 无 completion value）；补 globals 两段式自引用姿势、入口发现门面 `importDocumentModules`、hook memoize/重建幂等契约、插件协议时序与跨实例状态承诺、Snapshot 预设数据化；新增 Risks and Mitigations 与分阶段成功标准）

## Summary

将 qiankun 沙箱的内部架构与对外接口向 TC39 [Compartment 分层提案](https://github.com/tc39/proposal-compartments)（Layer 0–4）及其事实标准实现 [SES (ses shim)](https://github.com/endojs/endo/tree/master/packages/ses) 对齐，达成两个目标：

1. **功能目标**：沙箱的隔离能力可被外部扩展——自定义 patcher（隔离插件）与自定义 globals 均有一等注册 API。
2. **实现目标**：底层术语、接口形状与 Compartment 规范对齐，使得未来任何原生化（`Module`/`ModuleSource`、Evaluators、乃至完整 Compartment）落地时，只需替换 Compartment 的内部实现，上层（loader/qiankun facade）与插件生态零改动。

核心重组：把现有「Membrane + EsmSandboxEngine + 硬编码 patchers」重组为「**一个名实相符的 Compartment（globals + module hooks + `import()`/`load()`）** + **一圈只依赖 Compartment 公开接口的 DOM 隔离插件（IsolationPlugin）**」。

**对齐的边界**：对齐的是**术语与 API 形状**，不是 ses 的行为细节。qiankun 沙箱的隔离分寸（membrane read-through、共享 DOM 与对象身份、副作用清理范围）是多年实践沉淀的产品语义；凡 qiankun 不需要考虑的场景（防御性冻结、严格 shadow 规则等 Hardened JS 议题），不为其改变沙箱的实际边界。

**明确不对齐 ShadowRealm**（理由见「Spec Landscape」与「Non-Goals」两节）。

## Motivation

### 现状问题

qiankun v3 沙箱在设计上参考了 ShadowRealm / Compartment 等 ECMAScript 虚拟化提案，但只借了概念名，底层术语与实现细节大量错位：

1. **`Compartment` 类名实不符**（`packages/sandbox/src/core/compartment/index.ts`）。构造参数只有一个外部建好的 `WindowProxy`；唯一实职是 `makeEvaluateFactory()` 字符串工厂与把 globalProxy 挂到 `window.__compartment_globalThis__<n>__`。`evaluate()`、`transforms`、模块相关 hook 全部是注释掉的 stub。而 SES / Layer 4 草案的 Compartment 是 `new Compartment({ globals, modules, resolveHook, importHook, transforms })` + `evaluate()` / `import()` / `load()`。
2. **globals 所有权倒置**。规范中 globals（endowments）是 Compartment 的构造入参、`compartment.globalThis` 由它自己创建并拥有；qiankun 里 `Membrane` 在 `StandardSandbox` 中创建后塞给 `Compartment`，Compartment 只是挂名基类。
3. **模块子系统完全绕开 Compartment**。`EsmSandboxEngine`（fetch → lexer rewrite → synthetic specifier → import map → native import）是一条独立路径，内部的 `moduleResolver`、module record、synthetic specifier 概念与规范的 `resolveHook` / `importHook` / `ModuleSource` / `Module` 对不上——但**能力上是同构的**，只差接口形状。
4. **classic / ESM 双求值路径割裂**。一条走 `with(this)` 包裹（Layer 3 Evaluators 的手写版），一条走 EsmSandboxEngine（Layer 0 Module 的手写版），仅靠 `getEsmGlobalsView` / `onGlobalSet` 回调共享同一个 Membrane 视图，没有统一门面。
5. **术语漂移**。`Endowments` 类型实际对应规范的 `globals`；`addIntrinsics` 中的 "intrinsics" 与 TC39 intrinsic（`%Object.prototype%` 等）完全不是一回事，实际语义是「不可被 shadow 的固定 globals」；`realm-registry` 中的 "realm" 也非 TC39 Realm。
6. **扩展点缺失**。patcher 在 `packages/sandbox/src/patchers/index.ts` 按 `SandboxType` 硬编码分派，无注册 API；`extraGlobals` 通道存在但 `loadApp.ts` 写死为 `{}` 未接线；外部无法注册自定义隔离能力。

### 目标

- **G1 接口对齐**：Compartment 类按 ses 稳定面（options-bag）重塑，术语清洗（`Endowments` → `globals` 等），语义用契约测试钉死。
- **G2 模块收编**：EsmSandboxEngine 成为 Compartment 的模块子系统，对外只见 `resolveHook` / `importHook` / `modules` / `import()` / `load()`。
- **G3 扩展开放**：IsolationPlugin 插件协议 + `extraGlobals` 接线，内置 patcher 全部改为默认插件（自我验证扩展点够用）。
- **G4 可替换性**：原生能力落地时替换的是机制层（rewrite + import map、`with` + blob），接口层不动；替换边界在架构文档中显式声明。
- **G5 不破坏既有语义**：DOM/对象共享模型、zero-eval（CSP 无 `unsafe-eval`）、三段式 patcher 生命周期（`Patch → Free → Rebuild`）全部保留。

## Spec Landscape：规范格局与锚点选择

> 本节结论基于 2026-07-18 对一手来源的核实，是本 RFC 全部设计决策的事实基础。

### 为什么不是 ShadowRealm

**语义冲突（根本原因）**。ShadowRealm 的两条核心语义与微前端模型直接矛盾：

- 每个 realm 一套**全新的 intrinsics**（独立的 `Object` / `Array` / `Promise` / 原型链）；
- **callable boundary**：跨界只允许 primitive 与 callable，对象一律 `TypeError`，函数被包成 wrapped function exotic object。

qiankun 要求子应用与主应用**共享 DOM、共享对象身份**（props 传组件实例、事件对象跨界、`instanceof` 成立）。原生 ShadowRealm 中甚至没有 DOM——即使浏览器实现了，它也替换不了 qiankun 沙箱，因为二者解决的不是同一个问题。

**实现停滞（现实原因）**。准确表述是「实现代码都在，但没有引擎愿意 ship」：

- **WebKit/JSC**：Igalia 完成过完整实现，2022-02 起在 Safari Technology Preview **默认启用约 7 个月**；2022-09 起禁用（STP 155 release notes："Disabled ShadowRealm for now (the `--useShadowRealm` flag can enable it)"），代码至今留在 main 分支，从未进入正式版 Safari。
- **Node.js / V8**：`--experimental-shadow-realm`（v18.13 / v19.0 起，底层是 V8 `--harmony-shadow-realm`）在最新 Node 中仍存在，但 2023-11 后无功能性开发；V8 flag 停在 `HARMONY_INPROGRESS`（未完成、未 staged）。
- **提案本体**：Stage 2.7（2023-09 曾从 Stage 3 降级）；HTML 集成 PR（whatwg/html#9893）自 2024-12 无实质进展；TC39 2025-02 会议纪要显示三引擎均不愿当 first mover。
- **WPT**：2026-05 以「without implementer support all the ShadowRealm tests add significant noise」为由删除全部 ShadowRealm web 集成测试（wpt#59794，注明有实现者支持时可 revert；test262 语言层测试未删）。

结论：ShadowRealm 不能作为可规划依赖，其语义也不是 qiankun 的语义。

### 为什么是 Compartment / SES

TC39 Compartment 描述的恰好就是 qiankun 的模型：**same-realm、共享 intrinsics、每个 compartment 一个虚拟化的 `globalThis`（globals）、通过 hook 虚拟化模块图**。qiankun 现有的 Membrane + EsmSandboxEngine 本质上就是一个手写的、术语不对齐的 Compartment。

Compartment 提案自身的状态（须如实纳入决策）：

- TC39 轨道**冻结于 2022-12**（Stage 1）；仓库根目录 `spec.emu` 是空脚手架，**没有正式 ecmarkup 规范文本**——唯一有实质内容的是 Layer 0 的 `0-module-and-module-source.emu`，Layer 1–4（含 Compartment 本体）只是 markdown 分层解说。
- 但其能力被**拆层接力**：Layer 0 的 source 概念进了 **Source Phase Imports（Stage 3，V8 已实现）** 与 **ESM Phase Imports（Stage 2.7）**；Hardened JS 阵营的活跃提案是 Stabilize（Stage 1）与 Immutable ArrayBuffers（Stage 2.7）。
- **实现不止 ses 一家**：ses shim（活跃维护，事实标准）之外，**Moddable XS 引擎有原生 Compartment 实现**（嵌入式生产可用）；ECMA-419 第 3 版（TC53，2025-06）规范性引用了 Compartment 模型但未收编 API 文本。LavaMoat / Agoric 是消费者。

因此不存在一份「活着的 TC39 spec」可逐条对照；**形状参照 = ses shim 的公开 API 面 + 草案分层文档**。注意 ses 只是**接口形状参照，不是行为基准**——qiankun 的隔离语义自成产品边界（见 Summary「对齐的边界」与 §5）。对齐投入应向模块 hooks 侧倾斜——那是唯一仍在 TC39 轨道上真实前进的部分。

### 术语命名分歧的处理

Layer 4 草案已将 `importHook` 更名为 `loadHook`（草案原文承认与 ses 及旧版提案不一致），`moduleMap`/`moduleMapHook` 被 `modules` 描述符表取代。ses 未跟进改名，且 Stage 1 草案命名仍可能再变。

**决策：以 ses 形状为准实现（`importHook`），`loadHook` 做别名。** ses 是最稳定、有真实用户压舱的形状参照；草案若最终定稿，别名切换是零成本的。

### 近中期真实可依赖的原生原语

| 原语 | 状态 | 对 qiankun 的意义 |
| --- | --- | --- |
| native import map | 已全面可用 | 已在用（ESM 引擎的 specifier 间接层） |
| `import source`（Source Phase Imports） | Stage 3，V8 已 ship | Layer 0 `ModuleSource` 概念的原生落点 |
| `import defer` | Stage 3，工具链已广泛支持 | 未来 prefetch/懒执行的候选 |
| ESM Phase Imports | Stage 2.7 | `ModuleSource` 扩展到 JS 模块本身 |
| Compartment（Layer 4） | Stage 1，冻结 | 仅作接口形状参考，不押注 |
| ShadowRealm | Stage 2.7，停滞 | 不依赖 |

## Design Overview

### 目标架构

```
┌────────────────────────────────────────────────────────────┐
│ qiankun facade (loadApp)                                   │
│   只依赖 Compartment 公开接口 + 插件注册 API                  │
├────────────────────────────────────────────────────────────┤
│ IsolationPlugin 层（可外部注册）                             │
│   interval / windowListener / historyListener /            │
│   dynamicAppend(document 代理) / 用户自定义插件…             │
│   —— 全部只经 compartment 公开 API 干活                      │
├────────────────────────────────────────────────────────────┤
│ Compartment（名实相符，ses 形状）                            │
│   new Compartment({ name, globals, modules,                │
│                     resolveHook, importHook, transforms }) │
│   .globalThis            ← Membrane 视图（内部创建并拥有）    │
│   .import(specifier)     ← 异步执行入口（规范形态）           │
│   .load(specifier)       ← 只加载不执行                      │
│   .evaluateScript(src)   ← classic script 扩展 API（async）  │
├──────────────────────────┬─────────────────────────────────┤
│ 机制层（可被原生替换）      │ 机制层（qiankun 永久自有）         │
│  · Membrane (Proxy 视图)  │  · document 代理 / dynamicAppend │
│  · with(this)+blob 执行   │  · 样式隔离 (@scope/blob-link)    │
│  · rewrite+import map     │  · timers/listeners 清理          │
│    (EsmSandboxEngine)     │  · history 集成                   │
└──────────────────────────┴─────────────────────────────────┘
```

左下角机制层是未来原生化的替换目标（`Module`/`ModuleSource`、Evaluators、原生 Compartment）；右下角是规范永远不管的 DOM 层，**不存在被原生替换的可能**，因此插件协议必须从第一天起就只依赖 Compartment 接口而非其实现。

### 分阶段路线

| 阶段 | 内容 | 行为变化 |
| --- | --- | --- |
| ① 接口重塑 | Compartment options-bag 化、globals 所有权移入、术语清洗 | 无（纯重构） |
| ② 模块收编 | EsmSandboxEngine → module hooks，`compartment.import()` 门面 | 无（接口换壳） |
| ③ 扩展开放 | IsolationPlugin 协议、内置 patcher 插件化、`extraGlobals` 接线 | 新增公开 API |
| ④ 对齐验证 | API 形状断言 + hook 契约测试、替换边界文档化 | 无 |

各阶段可独立落地、独立发版；①② 是 ③ 的前置（插件协议依赖 Compartment 公开接口），④ 贯穿始终。

## Detailed Design

### 1. Compartment 名实相符（阶段一）

#### 1.1 构造器与所有权翻转

```ts
interface CompartmentOptions {
  name?: string;
  globals?: Record<string, unknown | PropertyDescriptor>; // 原 Endowments
  modules?: Record<string, ModuleDescriptor>;             // 预置模块表（§3.3）
  resolveHook?: (specifier: string, referrer: string) => string;
  importHook?: (fullSpecifier: string) => Promise<ModuleDescriptor>;
  loadHook?: CompartmentOptions['importHook'];            // 草案术语别名
  transforms?: Array<(source: string) => string>;
  // —— 以下为 qiankun host 扩展，文档中显式标注非规范项 ——
  incubatorContext?: WindowProxy;                          // membrane read-through 目标
}

class Compartment {
  constructor(options?: CompartmentOptions);
  get globalThis(): WindowProxy;   // Membrane 视图，由构造器内部创建
  import(specifier: string): Promise<ModuleExportsNamespace>;
  load(specifier: string): Promise<void>;
  // qiankun 扩展（§2）：
  evaluateScript(source: string, opts?: { sourceURL?: string }): Promise<void>;
}
```

关键变化：**Membrane 的创建移入 Compartment 构造函数**。`globals` 即 endowments，`compartment.globalThis` 成为它真正拥有的视图。`StandardSandbox` 退化为「qiankun 预设」：负责组装 window/document/DOM 视图这组 qiankun 特有的 globals 再交给 Compartment——层次从「Sandbox 拥有 Compartment 的零件」翻转为「**Sandbox 是 Compartment 的一种配置**」。

**globals 自引用的处理**。qiankun 预设的核心 globals 是自引用的——`window`/`self`/`globalThis`/`top`/`parent` 的 getter 必须指回 compartment 自己的 `globalThis`（现实现靠闭包在 Membrane 构造前定义、构造后惰性生效，`StandardSandbox.ts:33-68`）。构造参数无法引用尚未创建的视图，因此规范形状的 `globals` 只承载普通值/描述符；自引用 globals 的标准姿势是**两段式**：构造完成后由预设调用 `defineUnshadowableGlobals((rawTarget) => descriptors)`（承接现 `Membrane.addIntrinsics` 的函数式签名）。另外 `globals` 的「值 vs `PropertyDescriptor`」在运行时存在二义性（现有 `Endowments` 同样如此），判别规则需在实现时固定并写入类型文档。

现有 `Sandbox` 接口（`core/sandbox/types.ts`）保留为兼容层，内部委托新 Compartment；`active()`/`inactive()`/`latestSetProp`/`getEsmGlobalsView`/`onGlobalSet` 等 qiankun 生命周期能力归入 host 扩展面，不混入规范面。

#### 1.2 术语清洗

| 现名 | 新名 | 说明 |
| --- | --- | --- |
| `Endowments`（类型） | `globals` | 对齐 ses/草案；类型导出保留 deprecated 别名一个 minor 周期 |
| `addIntrinsics()` | `defineUnshadowableGlobals()` | 语义是「不可被子应用 shadow 的固定 globals」，与 TC39 intrinsic 无关；标注为 qiankun 扩展 |
| `realm-registry` 的 "realm" | `instance` / `view` | 避免与 TC39 Realm 混淆（`__qk_` 内部前缀机制不变） |
| `makeEvaluateFactory()` | 收入 `evaluateScript` 私有实现 | 不再作为公开 API |

清洗只动 sandbox/shared 内部与类型导出；`window.__compartment_globalThis__<n>__` 等运行时协约不变。

### 2. classic script 求值：保持 script+blob，不提供 sync `evaluate`

这是本 RFC 一个刻意的**不对齐**决策，理由必须写透：

1. **规范里没有 async evaluate**。Layer 3 Evaluators 与 Layer 4 草案中 `evaluate(source): any` 只有同步形态；规范的异步入口全部在模块侧（`load` / `import`，及同步变体 `importNow` / `loadNow`）。ShadowRealm 同构：`evaluate` 同步、`importValue` 异步，且 HTML 集成讨论明确 **CSP 禁 `unsafe-eval` 时 `evaluate` 被阻断、`importValue` 是设计给 CSP 受限环境的路径**。
2. **浏览器 host 中 sync evaluate 必然依赖 `unsafe-eval`**。ses shim 自己就是如此——其 Compartment 求值器依赖 dynamic eval，CSP 禁 eval 的环境下不可用（endo#903 至今 open，官方无浏览器端解法）。qiankun 现有 zero-eval blob 路径在 CSP 兼容性上**领先于事实标准实现**，没有理由倒退。
3. **eval 会引入浏览器行为不一致**。间接 eval 与原生 script 执行在调试器表现、错误堆栈、脚本调度时机等方面均有差异；qiankun 的沙箱语义建立在「子应用代码以尽可能原生的方式执行」之上。

因此：

- **不实现**规范签名的同步 `evaluate()`。
- 现有 `with(this)` + blob 机制收敛为 **`evaluateScript(source, { sourceURL }): Promise<void>`**，作为显式标注的 qiankun host 扩展——它对应「classic script 语义 + 规范异步入口的执行模型」。resolve 仅表示执行完成：blob script 以原生 `<script>` 执行，**没有可捕获的 completion value**（这正是 `latestSetProp` 导出发现机制存在的原因），结果发现仍走 `latestSetProp`——这也是不提供 sync `evaluate` 的又一实证。文档明确：qiankun 有意不提供 sync `evaluate`，与 ShadowRealm「CSP 下用 `importValue` 而非 `evaluate`」的规范态度一致。
- 对齐验证（§5）中 `evaluate` 相关用例归入「有意不实现」清单，而非失败项。

### 3. 模块子系统收编（阶段二）

#### 3.1 Layer 0 内部抽象

EsmSandboxEngine 内部建立与 Layer 0 对齐的两个概念：

- **`ModuleSource`**：fetch + lexer rewrite 的产物（改写后源码 + 元信息）。未来 `import source` / 原生 `ModuleSource` 落地时，这一层直接换成原生对象。
- **`Module`（record）**：现有 module record（canonical URL、synthetic specifier、blob、依赖边）的规范化命名。

#### 3.2 hook 化

```ts
// 默认 resolveHook = 现引擎内部的 specifier 解析（URL 拼接 + 子应用私有 import map 解析）
resolveHook(specifier, referrerUrl)  // 同步：specifier → canonical full specifier

// 现 fetchModuleSource + rewriteModule 链路收进默认 importHook
importHook(fullSpecifier)            // 异步：→ ModuleDescriptor（含 ModuleSource）
```

注意一个容易错位的映射：现有 `moduleResolver`（`engine.ts:30`，`(url) => { url } | undefined`）接收的是**已解析完成的 URL**，语义是重定向（externals / 共享依赖场景）——它对应的规范概念不是 `resolveHook`，而是 `modules` 表的 redirect 描述符，归入 §3.3 建模。

外部可通过 CompartmentOptions 覆盖默认 hooks（例如私有协议加载、构建期预编译产物直供），这本身就是一个隔离/加载能力的扩展点。

#### 3.3 `modules` 描述符表

externals / 共享依赖改用 `modules` 表表达（module descriptor：namespace 直供、source 直供或重定向）。这为 ESM Sandbox RFC v1 中收缩掉的「共享依赖」诉求提供了规范形状的容器，v2 讨论可在此表上展开而无需再发明私有配置。

#### 3.4 统一门面

- `compartment.import(specifier)` 是「已知 specifier」的通用入口：内部驱动现有 `collectGraph → probe → flush import map → native import` 管线。
- **入口发现需要独立门面**。现有入口选取是「显式 `entry` 属性 → lifecycle namespace 命中 → 最后执行者」（Vite 会丢 entry 属性），即 loader 在执行前并不知道 entry specifier，`import()` 无法独自承担入口路径。补充 `compartment.importDocumentModules(): Promise<EntryNamespace>`，严格承接现 `sealAndExecute` 的文档序执行与入口选取语义。
- **hook 契约需写明 memoize 与失效语义**。redeclaration probe 重试会以 `excludedNames` 重建 module record，契约定义为「`importHook` 的结果可能被引擎重建替换，自定义 hook 必须幂等」，并有单测钉死（成功标准 8）。
- loader 不再直接消费 `esmEngine.entryNamespacePromise`，改为消费 compartment 门面；classic 入口的 `latestSetProp` 发现机制不变，同样从门面取值。
- `EsmSandboxEngine` 保留为 shared 包内的机制层实现，不再出现在跨包接口上（loader 的 `LoaderOpts.esmEngine` 收敛为 `LoaderOpts.compartment`）。

**可替换性的实质兑现**：未来原生 `new Module(source, { importHook })` 落地时，被替换的是 rewrite + synthetic specifier + import map 这套*机制*；`resolveHook` / `importHook` / `modules` 这层*接口*原样保留，上层零改动。

### 4. IsolationPlugin：隔离能力的外部扩展点（阶段三）

#### 4.1 协议

现有三段式生命周期（`Patch → Free → Rebuild`，`patchers/types.ts`）已是良好接口，缺的只是注册机制：

```ts
interface IsolationPluginContext {
  compartment: Compartment;        // 只暴露公开接口
  appName: string;
  getContainer: () => HTMLElement;
  config: { styleIsolation?: StyleIsolationOpts /* 应用级配置切片，按插件需要扩充 */ };
}

interface IsolationPlugin {
  name: string;
  bootstrap?: (ctx: IsolationPluginContext) => Free;  // 应用首次加载时
  mount?: (ctx: IsolationPluginContext) => Free;      // 每次 mount 时
}
// Free = () => Rebuild;  Rebuild = (container) => Promise<void>;  —— 语义不变
```

协议附带两条明确承诺（由 dynamicAppend 的真实依赖倒推）：

1. **时序**：`bootstrap` 插件在任何子应用脚本求值前完成安装——现实现里 document intrinsic 先占位、后被 dynamicAppend 覆写（`StandardSandbox.ts` 中 "Temporarily occupy the document" 注释）的隐式时序，升级为协议保证。
2. **跨实例共享状态**：原型级 patch（`MutationObserver.prototype.observe`、`Node.prototype.compareDocumentPosition` 等）需要跨 compartment 乃至跨 qiankun 副本的协调（refcount、`nativeGlobal.__currentLockingSandbox__`）。协议不把这类状态塞进 per-app ctx；官方模式是「插件模块级共享状态 + refcount，全部实例卸载时还原」，作为插件作者指引文档化。

#### 4.2 注册与默认插件

- `createSandboxContainer(opts.plugins?: IsolationPlugin[])`，并经 `loadApp` 配置一路暴露到用户 API。
- 内置 interval / windowListener / historyListener / dynamicAppend 改为**默认插件列表**，用户插件追加其后；`patchers/index.ts` 的硬编码分派**数据化**——默认列表按 `SandboxType` 提供 Standard / Snapshot 两套预设（Snapshot 路径本身维持现状，见 Non-Goals）。
- free 的编排逻辑（bootstrap frees 长驻、mounting frees 每次重建）保持现状，由容器统一调度。

#### 4.3 dynamicAppend 吃狗粮

dynamicAppend 目前通过 `sandbox.addIntrinsics({ document: proxyDocument })` 反向注入 document 代理——改造后它必须作为普通插件、仅用公开 API（`defineUnshadowableGlobals`）完成同样的事。**内置最重的 patcher 能纯靠公开接口实现，就是扩展点足够的证明**；反之任何做不到的点都暴露了协议缺口，在阶段三内补齐。

#### 4.4 `extraGlobals` 接线

`loadApp.ts` 中写死的 `extraGlobals: {}` 接通到用户配置（ESM Sandbox RFC 的 v1.1 计划项），成为外部扩展 globals 的最短路径；ESM 侧经现有 `esmDestructurableGlobals` 基集机制同步生效。

### 5. 对齐验证：API 形状兼容 + qiankun 语义回归（阶段四）

**原则：对齐的是 API 形状，不是 ses 的行为。** qiankun 沙箱的隔离分寸是多年实践沉淀的产品语义；ses 面向 Hardened JS 的行为细节（防御性冻结、严格 shadow 规则、错误驯化等）大量是 qiankun 不需要考虑的场景，不为它们改变沙箱的实际边界。因此**不做**「双实现跑同一套行为用例」的 parity 测试，验证拆为三层：

- **形状兼容（类型层，零运行时依赖）**：在测试代码中按 ses 公开 API 与 Layer 4 草案手写一组「规范形状」接口类型，用类型断言（`satisfies` / 赋值兼容）验证 qiankun `Compartment` 的方法存在性与签名兼容。ses 不进入任何依赖。
- **hook 契约测试（运行时，基准是本 RFC）**：`resolveHook` / `importHook` 的调用时序、入参、memoize 与重建幂等语义按 §3 的契约写单测——契约文本在本 RFC，不在 ses。
- **语义回归**：现有 membrane / patchers / esm-sandbox 单测与 e2e 就是隔离分寸的可执行定义；重构全程保持全量通过，即语义未漂移。
- 差异清单**只保留文档职能**——本 RFC 是唯一权威来源，不在运行时代码里镜像成导出常量（那样既扩大产物导出面，又要靠额外测试维护两份清单；曾短暂引入的 `COMPARTMENT_INTENTIONAL_OMISSIONS` / `COMPARTMENT_HOST_EXTENSIONS` 已据此移除）。本 RFC 与 `AGENTS.md` 显式枚举：
  - **有意不实现（相对 SES / Layer-4 surface）**：sync `evaluate`（§2）、`lockdown`、`harden`——`lockdown`/`harden` 的冻结语义与「子应用可自由使用宿主能力」的定位冲突（§8）。对应的运行时保证是这些成员**不出现在** `Compartment` 实例上（`compartment/__tests__/index.test.ts` 以 `'evaluate'/'harden'/'lockdown' in compartment === false` 的负向断言守护，防止将来出现语义不符的半吊子实现）。
  - **qiankun 宿主扩展（围绕 Compartment 形状核心分层）**：DOM globals、`evaluateScript`（classic script 求值，§2）、`transformClassicScript`、`defineUnshadowableGlobals`、`getEsmGlobalsView`、`onGlobalSet` / `latestSetProp`（导出发现）、`active` / `inactive` / `dispose`（生命周期）、`incubatorContext`、`type`、`IsolationPlugin`（插件协议）。这些是 qiankun 自有面，不冒充规范 API。

### 6. 替换边界声明（阶段四，文档）

在 `packages/sandbox/AGENTS.md` 与本 RFC 中固化以下边界，防止「对齐」随迭代漂移：

> 即使原生 Compartment 落地，它能替换的也只是「globalThis 虚拟化 + evaluator + 模块图」这一层；document 代理、dynamicAppend、样式隔离、timers/listeners 清理这些 DOM 层插件**永远是 qiankun 自有的**——规范不管 DOM。插件层因此只准依赖 Compartment 公开接口。

feature-detect（`typeof Compartment === 'function'` 时优先原生）留骨架即可；按提案进度属远期占位，不投入实现。

## Code Changes

| 包 | 变更 |
| --- | --- |
| `packages/sandbox` | `core/compartment/` 重写（options-bag、Membrane 所有权移入、`evaluateScript`）；`StandardSandbox` 降为预设；术语清洗；`patchers/index.ts` 分派逻辑替换为插件注册；形状断言与 hook 契约测试 |
| `packages/shared` | `esm-sandbox/` 内部抽象更名（ModuleSource/Module）、hook 化改造；`module-resolver` → 默认 `resolveHook`；`realm-registry` 术语调整 |
| `packages/loader` | `LoaderOpts.sandbox/esmEngine` 收敛为 compartment 门面；入口 namespace 消费路径切换 |
| `packages/qiankun` | `loadApp` 接线 `plugins` / `extraGlobals` 配置；对外类型导出 |
| `docs` | 本 RFC；`packages/sandbox/AGENTS.md` 更新替换边界与插件协议 |

依赖方向不变：`qiankun → loader → sandbox → shared`；插件协议类型放 sandbox 包。

## Acceptance Criteria（成功标准）

### 全局硬指标（每阶段合入的门禁，始终保持）

1. 现有全部单测、e2e 通过（chromium 全绿；firefox 既有 `test.fail` 注解集不扩大）；examples 浏览器验证无回归（classic + ESM + 多实例 + 样式隔离）。
2. sandbox 包性能基准回归 ≤ 5%（membrane get/set、模块改写吞吐、加载链路）。
3. 运行时零新增依赖；CSP 无 `unsafe-eval` 场景保持全链路可用并有用例显式覆盖。
4. `pnpm run ci` 通过；包依赖方向 `qiankun → loader → sandbox → shared` 不变。
5. 不引入任何 eval / `new Function` 求值路径；跨界对象身份语义（`===`、`instanceof`）与现状完全一致——隔离分寸不因对齐而漂移。

### 阶段 DoD

**阶段①（接口重塑）**

6. options-bag `Compartment` 落地；globals 两段式自引用姿势（§1.1）有单测覆盖。
7. 术语清洗完成后，旧名（`Endowments` / `addIntrinsics`）仅存在于带 `@deprecated` 的别名导出，仓库内部零使用（grep 可验证）。

**阶段②（模块收编）**

8. hook 契约（调用时序、入参、memoize / probe 重建幂等）有专门单测钉死。
9. loader 跨包接口不再出现 `EsmSandboxEngine` 类型；入口路径改走 compartment 门面（含 `importDocumentModules`），ESM e2e 全量保持通过。

**阶段③（扩展开放）**

10. dynamicAppend 以插件身份、零内部 import 实现，并以 eslint `no-restricted-imports` 把「插件目录禁止 import membrane 内部模块」固化为 CI 规则。
11. 提供一个**仓库外视角**的示例插件（如 localStorage 前缀隔离），只用公开 API 与公开类型实现并进 e2e；`plugins` / `extraGlobals` 有用户文档。

**阶段④（对齐验证）**

12. API 形状断言（类型层）通过；「有意不实现 / qiankun 扩展」两清单在代码中显式枚举，新增差异必须修改清单才能通过 CI。
13. 可替换性演练：至少一个测试用自定义 `importHook` 直供预编译 source（不走 fetch + rewrite）跑通完整 mount 流程——证明接口缝真实存在。

**总验收**：以上全部满足后，RFC 转 `Status: Accepted`，替换边界与插件协议同步进 `packages/sandbox/AGENTS.md`。

## Risks and Mitigations

| 风险 | 缓解 |
| --- | --- |
| 重构触及 classic / ESM 双路径的公共层（Membrane / Compartment），回归面大 | 四阶段独立落地、独立发版；全局硬指标 1–5 作为每阶段合入门禁；性能基准纳入 CI 对比 |
| 术语清洗破坏下游类型消费者 | `@deprecated` 别名保留一个 minor 周期；`next` 分支处于 3.0 迭代期，破坏面可控 |
| 插件协议一旦公开即成承诺面，协议缺口后补是 breaking change | 阶段三先用四个内置插件 + 一个仓库外视角示例插件验证协议完备性（吃狗粮），验证通过后才进公开文档 |
| 入口发现门面（`importDocumentModules`）与 loader 流式时序耦合，语义漂移风险 | 严格承接现 `sealAndExecute` 语义，不新增行为；ESM 入口选取的既有 e2e 全量覆盖 |
| globals 两段式姿势被误用（预设外的调用方在脚本执行后才补 globals） | `defineUnshadowableGlobals` 文档标注时序约束；插件协议的 bootstrap 时序承诺（§4.1）兜底 |

## Non-Goals

- **不做 intrinsics 隔离、不做 callable boundary**——破坏 DOM/对象共享模型，且 ShadowRealm 已无实现动能。未来若有「强隔离不可信代码」需求，那是 Worker / iframe realm 方向的独立产品形态，不是本沙箱的演进。
- **不实现 `lockdown()` / `harden()`**——Hardened JS 的冻结语义与微前端「子应用可自由使用宿主能力」的定位冲突；仅保留概念映射说明。
- **不 all-in Layer 4 草案的精确签名**——Stage 1、冻结三年半、术语仍可能变；锚点是 ses 稳定面，草案术语（`loadHook`）以别名跟踪。
- **不做 snapshot 沙箱的 Compartment 化**——`SandboxType.Snapshot` 路径维持现状（本就是降级路径）。

## Migration Path

- 阶段①②为纯内部重构：`Sandbox` 接口保留兼容委托，`Endowments` 等类型导出保留 deprecated 别名一个 minor 周期后移除。
- 阶段③只增不改：`plugins` / `extraGlobals` 是新增可选配置，默认行为与现状一致。
- 子应用零感知；主应用仅在使用新扩展 API 时需要了解插件协议。

## Open Questions

1. `evaluateScript` 是否应该进入公开导出，还是仅供 loader 内部使用？（公开则成为承诺面，需与 transpiler 的 blob 管线约定错误语义。）
2. `modules` 描述符表与未来共享依赖方案（ESM Sandbox RFC v2 议题）的衔接细节——namespace 直供跨 compartment 的对象身份语义需要单独 RFC。
3. 插件协议是否需要 `unmount` 独立钩子，还是维持 `Free` 返回值语义即可？（现状 `Free → Rebuild` 已覆盖，但对第三方作者的心智成本待验证。）
4. 形状断言所依据的「规范形状」接口类型的维护节奏：跟踪 ses README 与草案变化到什么频率？（类型是手写快照，不自动同步。）

## References

- Compartment 分层提案：https://github.com/tc39/proposal-compartments （Layer 0–4；仓库冻结于 2022-12，Stage 1）
- SES shim：https://github.com/endojs/endo/tree/master/packages/ses · https://hardenedjs.org/
- ses 与 CSP `unsafe-eval`：https://github.com/endojs/endo/issues/903
- ShadowRealm 提案与 explainer：https://github.com/tc39/proposal-shadowrealm
- ShadowRealm HTML 集成 PR：https://github.com/whatwg/html/pull/9893
- WPT 删除 ShadowRealm 测试：https://github.com/web-platform-tests/wpt/pull/59794 · https://github.com/tc39/proposal-shadowrealm/issues/425
- WebKit 禁用记录：https://bugs.webkit.org/show_bug.cgi?id=245166 · https://webkit.org/blog/13338/release-notes-for-safari-technology-preview-155/
- Node ShadowRealm：https://github.com/nodejs/node/issues/42528 · https://github.com/nodejs/node/pull/42869
- TC39 2025-02 会议纪要（ShadowRealm status update）：https://github.com/tc39/notes/blob/HEAD/meetings/2025-02/february-18.md
- Source Phase Imports（Stage 3）：https://github.com/tc39/proposal-source-phase-imports
- ESM Phase Imports（Stage 2.7）：https://github.com/tc39/proposal-esm-phase-imports
- Moddable XS 原生 Compartment：https://www.moddable.com/documentation/xs/XS%20Compartment
- ECMA-419（第 3 版，规范性引用 Compartment 模型）：https://419.ecma-international.org/
- qiankun ESM Sandbox RFC：`docs/rfcs/esm-sandbox.md`
