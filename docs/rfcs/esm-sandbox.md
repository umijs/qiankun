# RFC: ESM Sandbox for qiankun

- **Status**: Draft（v1 已实现，见 `rfc/esm-sandbox` 分支）
- **Author**: qiankun maintainers
- **Created**: 2026-04-18
- **Target Release**: qiankun v3.x
- **Tracking Issue**: TBD
- **Last Revision**: 2026-07-18（随 Compartment Alignment RFC 更新当前接口：ESM 机制收进 `Compartment` 的 module hooks / descriptor 门面；`extraGlobals` 接入应用配置；内部 realm registry 更名为 instance registry；lexer 切至 CSP-safe 的 `es-module-lexer/js` 入口；document credentials 通过上下文专属 runtime bridge 贯穿普通动态 import 图；synthetic key 加入跨 qiankun 副本随机 nonce；dispose 的全部异步边界改为 fail-closed；预编译 `ModuleSource` 只按结构化 import span 重定位。下文保留 v1 设计过程中的 realm 术语，用于解释当时的安全模型。）
- **Previous Implementation Revision**: 2026-07-04（第三轮修订，随 v1 实现 + code review 落地：realm 访问器改为**每副本随机 key + 不可猜 token** 索引（堵死裸标识符/proxy/`with` 三条越权路径，并顺带解决多 qiankun 副本抢占单例崩溃）；`dispose` 覆盖全部 blob（含 inline/rebuilt）并接入 single-spa `unload`；入口选取改为"显式 entry 优先 → 生命周期 namespace → 最后执行"且非入口模块失败不炸整个 app、支持 `export default` 生命周期；typed import（JSON/CSS）走 §14 passthrough 而非硬崩；probe 去掉 120 字窗口改为"解构集非空 ∧ 含声明关键字"不漏检；动态 import 用 lexer `imp.d` 定位括号并整体覆盖 `[ss,se)` 修正注释击穿/尾逗号；fetch 透传 `crossorigin` credentials；import-bindings/importmap 解析加注释剥离与幂等；membrane 复用 `esmInternalPrefix` 且不拷贝 `__qk_*` 到 target）
- **Second Revision**: 2026-07-04（注入引导改为 runtime 模块 import（消除 CSP `unsafe-eval` 依赖与 TDZ）、解构白名单按需过滤（标识符扫描 ∩ 基集）、顶层重名 SyntaxError 防护、共享依赖收缩为 source 级、既有 sourceMappingURL 偏移合并）
- **Previous Revision**: 2026-06-09（依据深度 review 修订：修复注入模板 TDZ blocker、白名单复用现有 `globalsInBrowser`、`__qk_realm` 安全模型、Vite dev 真实性、改写 offset 管理、错误可观测性、生产 ESM 构建产物、Trusted Types、prefetch 等）

## Summary

为 qiankun 增加对原生 ESM 子应用（尤其是 Vite dev 模式）的沙箱支持，在保持 qiankun JS 沙箱语义的前提下，让子应用开发者视角维持原生 ESM。

技术路径：**运行时改写（runtime rewrite）+ CSP-safe 纯 JS lexer + 复用现有 Membrane**。**不引入 iframe**。

## Motivation

### 问题

qiankun 当前的 JS 沙箱实现基于 classic script 执行模型：

- 通过 `Compartment` 内部的 classic script transformer 用 `with(this) { ... }` 包裹脚本源码，再走 blob `<script>` 执行
- 通过 `URL.createObjectURL` 生成 Blob URL 以非 module 形式执行
- 通过监听 `window` 的 `latestSetProp` 来发现子应用导出的生命周期函数

这套模型与原生 ESM 存在**结构性冲突**：

1. **`with` 在 ESM 中是 SyntaxError** —— ESM 模块代码处于 strict mode（[ECMA-262 §16.2.1.6.2](https://tc39.es/ecma262/#sec-parsemodule)），strict mode 下 `with` 是 [Early Error](https://tc39.es/ecma262/#sec-with-statement-static-semantics-early-errors)。这意味着现有的 `with(this)` 包裹方式**根本无法用于 `<script type="module">`**，浏览器会在解析阶段就拒绝。
2. **生命周期发现机制不适用** —— ESM 不向 `window` 写属性，导出走 `export` 语法。`latestSetProp` 完全捕获不到。
3. **Vite dev 模式天然 ESM** —— Vite 不打包，开发模式下子应用入口是 `<script type="module">`，加载的依赖也是原生 ES module。这是当前业界主流的开发体验，qiankun 无法兼容意味着无法集成 Vite 子应用进行本地调试。

### 既有规避方案的不足

社区里曾出现过几种规避方案，均不能同时满足 qiankun 的核心约束：

| 方案 | 问题 |
|---|---|
| iframe / Wujie 风格 realm | 隔离过强，与 qiankun 现有 DOM 模型、生命周期机制差异大；本 RFC 明确**不予考虑** |
| Vite dev 模式直接 `<script type="module">` 透传 | JS 不经过 qiankun 沙箱，window 污染、定时器/事件残留等问题完全失控 |
| 自定义 module loader（runtime 接管所有 import） | 失去浏览器原生 ESM loader 的依赖图、TLA、循环依赖处理；工程量极大且语义易出错 |
| ShadowRealm / SES | 浏览器支持度低；与 qiankun 现有 DOM 共享模型不兼容 |

### 目标

提供一种 ESM 沙箱方案，满足以下硬约束：

- **C1 开发者视角原生**：子应用入口仍是 `<script type="module">`；模块内部使用原生 `import`/`export` 语法；`import.meta.url` 等返回开发者可预期的真实 URL。
- **C2 沙箱语义保留**：JS 全局访问受 Membrane 约束；卸载时副作用可清理；与现有 classic script 沙箱共享同一份 Membrane。
- **C3 运行时支持**：不依赖子应用构建期插件或编译期改造。
- **C4 不使用 iframe**。
- **C5 性能可控**：通过 [`es-module-lexer`](https://github.com/guybedford/es-module-lexer) 的纯 JS 入口保证改写开销可接受，同时避免默认入口的 specifier 解码依赖 `eval`。

## Design Overview

### 核心管线

```
子应用 mount
    │
    ├─ HTML loader (packages/loader/src/index.ts)
    │   流式解析 entry HTML（writable-dom），通过 nodeTransformer 钩子分流：
    │   ├─ <script>                 → 现有 classic transpiler（with(this) 包裹）
    │   ├─ <script type="module">   → 新增 ESM transpiler 分支 ◄── 新增
    │   ├─ <script type="importmap">→ 解析存入 per-app importMap ◄── 新增
    │   └─ <link rel="stylesheet"> / 其它 → 走现有 link transpiler + dynamicAppend（不变，见 §6）
    │
    │   说明：
    │   - 现有 writable-dom 已对 type="module" 走非阻塞路径，并为其生成 modulepreload；
    │     ESM 接入需复用同一路径，但要避免“原始 URL 被 modulepreload + 改写后 blob URL 再次 fetch”
    │     的双取问题（见 §10.1）。
    │
    ├─ ESM transpiler (packages/shared/src/assets-transpilers/module.ts, 新增) 流水线（per module）
    │   ├─ fetch 源码（走全局 LRU cache，引用计数 +1）
    │   ├─ es-module-lexer 扫描 imports / exports / import.meta / dynamic import()
    │   ├─ 标识符扫描过滤：单遍 token 扫描 ∩ globalsInBrowser，再剔除模块自声明/导入重名（见 §1）
    │   ├─ 顶部注入 globals 与 import.meta（经 per-instance runtime 模块 import 引导，零 eval、无 TDZ，见 §1）：
    │   │     import { __qk_view, __qk_resolve, __qk_dynamic_import } from '__qk_appA_inst1__/__runtime__'
    │   │     const { window, document, /* 仅本模块实际引用的名字 */ } = __qk_view
    │   │     const __qk_import_meta = { url: '<原始URL>', resolve: __qk_resolve }
    │   ├─ 改写 specifier：bare specifier / 相对路径 → 实例级唯一标识（不改为 blob URL）
    │   ├─ 改写 import.meta → __qk_import_meta
    │   ├─ 改写 import(x) → __qk_dynamic_import(x, __qk_import_meta.url)
    │   ├─ 追加 //# sourceURL=<原始URL>
    │   └─ 生成 Blob URL（type: 'text/javascript'），缓存（key: instanceId + 原始 URL，引用计数 +1）
    │
    ├─ Import Map 注入（新增，见 §11）
    │   所有模块 blob URL 就绪后，构建全局 import map：
    │   将实例级唯一 specifier 映射到最终 blob URL
    │   （含每实例一条 __qk_<appId>_<inst>__/__runtime__ → runtime 模块 blob，见 §1）。
    │   动态注入 <script type="importmap"> 到主文档。
    │   blob 内部 import 唯一 specifier → 浏览器查全局 import map → 重定向到 blob URL。
    │   由于 specifier 包含 instanceId，各实例不会命中同一条全局映射。
    │
    ├─ ESM 入口解析（替代 latestSetProp 路径）
    │   现有 loader 通过 sandbox.globalThis[sandbox.latestSetProp] 拿到 entry 导出，
    │   ESM 入口不会写 window，因此走新分支：
    │     const ns = await import(entryBlobUrl);
    │   浏览器原生 ESM loader 自动处理依赖图、TLA、循环依赖。
    │
    └─ 取出 ns.bootstrap / ns.mount / ns.unmount → 接入 single-spa 生命周期

unmount
    └─ 调用 app.unmount() + 清空 DOM；blob URL / fetch cache / module 状态保留

remount
    └─ 复用之前的 blob URL → import(sameBlobUrl) 拿到同一个 namespace
       → 调用 ns.mount(newProps)（顶层不重跑，符合 ESM 规范）

unload
    └─ 引用计数 -1；归零的模块 revokeObjectURL；清空 sandbox
```

### 改写示例

**子应用源码（开发者视角原生）：**

```js
// app-a/main.js
import { createApp } from 'vue';
import App from './App.vue';

console.log(import.meta.url);
window.__APP_A_STARTED = true;

export async function bootstrap() {}
export async function mount(props) {
  createApp(App).mount(props.container);
}
export async function unmount() {}
```

**qiankun loader 改写后（浏览器实际执行）：**

```js
// 顶部注入 —— CSP-safe lexer 定位首个非注释位置后插入
// 引导经 per-instance runtime 模块 import：零 eval（无 CSP 'unsafe-eval' 依赖）、
// import 绑定先于模块体求值完成初始化（构造上无 TDZ），见 §1
import { __qk_view, __qk_resolve, __qk_dynamic_import } from '__qk_appA_inst1__/__runtime__';
// 解构集按模块生成：源码标识符扫描 ∩ globalsInBrowser（725 项基集），再剔除本模块自声明/导入的重名。
// 本例模块实际只引用了 window / console 两个全局（见 §1「按需过滤」）
const { window, console } = __qk_view;

const __qk_import_meta = {
  url: 'https://app-a.host/main.js',
  resolve: __qk_resolve, // runtime 模块导出的 resolve 已绑定 appId
};

// specifier 重写：bare specifier / 相对路径 → 实例级唯一标识（不改为 blob URL）
// 浏览器通过 qiankun 注入的全局 import map 将实例唯一 specifier 映射到 blob URL
import { createApp } from '__qk_appA_inst1__/https://cdn.jsdelivr.net/vue@3.4/dist/vue.esm-browser.js';
import App from '__qk_appA_inst1__/https://app-a.host/App.vue';


console.log(__qk_import_meta.url);   // → 原始 URL
window.__APP_A_STARTED = true;       // window 是 proxy，写入受 Membrane 拦截

export async function bootstrap() {}
export async function mount(props) { /* ... */ }
export async function unmount() {}

//# sourceURL=https://app-a.host/main.js
```

## Detailed Design

### 1. 变量隔离：顶部解构注入

**为什么不能用 `with(proxy)`**

ESM 模块代码强制 strict mode，strict mode 下 `with` 是 SyntaxError。这是规范级硬约束，浏览器在解析阶段就会拒绝。

**采用方案：runtime 模块 import 引导 + 顶部 destructuring 注入 globals**

qiankun 为每个实例生成一个**不经改写管线**的 runtime 模块 blob（其源码中的 `globalThis` 没有任何遮蔽，就是真实全局），并在 import map 中注册 `__qk_<appId>_<inst>__/__runtime__` → 该 blob：

```js
// __qk_runtime（per instance，qiankun 生成，不走改写管线）
// 这里的 globalThis 未被遮蔽，即真实全局；访问器 key 与 token 在生成时被内联为随机字面量
//（key、token 见下方「安全（v1 实现）」）
const rt = globalThis['__qk_r_<random>']('<per-instance-random-token>');
export const __qk_view = rt.view;                    // globals 解构视图
export const __qk_resolve = rt.resolve;              // import.meta.resolve，已绑定实例
export const __qk_dynamic_import = rt.dynamicImport; // 动态 import 管线入口，已绑定实例
```

每个被改写的 ES module 顶部插入：

```js
import { __qk_view, __qk_resolve, __qk_dynamic_import } from '__qk_appA_inst1__/__runtime__';
const { window, document, location, globalThis, self, /* ...按需过滤，见下 */ } = __qk_view;
```

借助 ES 的 lexical scoping，这些标识符在该 module 内会**遮蔽**全局同名标识符。模块内任何裸 `window`、`document` 引用都会指向 Membrane 包装的 proxy。runtime 模块是每个模块的依赖，先于所有业务模块求值一次（浏览器保证），所有模块共享同一份 namespace。

**为什么引导必须走 import，而不是直接读 `globalThis` 或间接 eval**

- **TDZ（原 Blocker）**：若写成 `const { window, globalThis, ... } = globalThis.__qk_realm(appId)`，右侧的 `globalThis` 会解析到正被 `const` 声明的**同名词法绑定**。该绑定在整条 `LexicalBinding` 求值期间处于 TDZ（[ECMA-262 §13.3.1](https://tc39.es/ecma262/#sec-let-and-const-declarations)，Initializer 先于 BindingInitialization 求值），**每个被改写模块的第一行就抛 `ReferenceError`**；`window`/`self` 同理。而 import 绑定来自另一个模块作用域：依赖模块先于本模块体求值，绑定在使用前**必然已初始化**——构造上无 TDZ。
- **CSP（本轮修订新发现）**：上一轮曾修订为 `const __qk_root = (0, eval)('globalThis')` 规避 TDZ，但间接 eval / `Function('return this')()` 都要求 CSP **`'unsafe-eval'`**——与 Migration CSP 表（仅要求 `script-src blob:`）直接矛盾。生产 shell 常见「无 `unsafe-eval`」的 CSP，会让**每个被改写模块第一行抛 EvalError**，波及面比 TDZ 更大。runtime 模块方案零 eval，qiankun 注入代码对 CSP 的额外要求仅剩 `blob:`。

**白名单：复用现有 `globalsInBrowser`，而非新建手维护列表**

仓库已存在 `packages/sandbox/src/core/globals.ts`，其中 `globalsInBrowser` 是由 [sindresorhus/globals](https://github.com/sindresorhus/globals) 生成的 **725 项**完整浏览器全局列表（含 `addEventListener`/`removeEventListener`/`getComputedStyle`/`matchMedia`/`dispatchEvent`/`queueMicrotask`/`structuredClone`/`Event`/`CustomEvent`/`URL`/`atob`/`btoa`/`open` 等），classic 沙箱的 Membrane 已在用它。ESM 顶部解构应**直接复用这份列表作为基集**，而不是新建一份仅 ~30 项的 `membrane/globals.ts`（那等于在更优资产上倒退）。

实现要点：
- 从基集**静态剔除值类型 / getter 语义的属性项**（如 `innerWidth`、`devicePixelRatio`、`length`：解构是求值期快照，无法表达 live 值语义），这类裸引用回落真实全局（多为只读布局值，风险可接受并文档化）；
- 通过 `rt.view` 暴露 `Compartment.globalThis` 的按需视图，解构即拿到对应 proxy；
- 应用配置通过 `extraGlobals: Record<string, unknown | PropertyDescriptor>` 追加值或描述符，并自动加入 ESM 解构基集。

**按需过滤：解构集按模块生成（必需，非优化）**

全量注入 725 项解构，单模块 ≈ 11KB、270 模块的 Vite dev 应用累计 ≈ 3MB 改写产物膨胀，且解构集越大、与模块自身顶层声明重名（见下）的碰撞面越大。因此解构集必须按模块过滤：对**原始源码文本**做单遍标识符 token 扫描（`/[A-Za-z_$][\w$]*/g`），每个 token 查 `globalsInBrowser` 的 `Set`，命中集合即该模块的解构集。

- **超集安全论证**：任何真实的裸标识符引用必然以完整 token 出现在源文本中——**不会漏**（漏 = 沙箱逃逸）；字符串/注释里的误命中只是多解构一个没用到的名字——**无害**（最坏退化为全量注入，即不做过滤的现状）。因此**不需要**正确的词法分析，无须处理字符串/注释/模板字面量边界。
- **实测**（本仓库真实源码 79 文件、平均 10KB/模块、725 项白名单，Node/M 系列本机）：约 **34µs/模块**（≈293MB/s），270 模块应用合计 ~7ms 纯 CPU，与并行 fetch 完全重叠，墙钟不可见；与管线中本就存在的 es-module-lexer parse（官方 benchmark ≈10MB/25ms）同量级。命中分布 **p50=3、p90=11** → 注入体积 ≈ 300B/模块（Risks 表「200~400 字节」在此前提下成立；270 模块合计从 ~3MB 降到 ~76KB）。扫描结果只依赖源码内容，与 fetch LRU 同 key（URL）缓存，remount / 多实例零成本。
- **已知绕过**：unicode 转义标识符（如 `d\u006Fcument`，即 `document` 的转义写法）不会被 ASCII 扫描命中，该引用将逃逸——属**蓄意逃逸**，与 `(0,eval)` 逃逸同类，不在防御范围（扫描的目标是正常代码的正确性，不是对抗恶意代码）。

**⚠️ 重名碰撞：注入解构与模块顶层声明/导入同名 → SyntaxError（必须处理）**

模块自身顶层的 `const history = createBrowserHistory()`、`import { location } from './router'` 等，与注入的同名 `const` 构成**同一模块作用域内的重复词法声明**——解析期 `SyntaxError: Identifier 'x' has already been declared`，整个模块图加载失败。白名单里 `history`/`name`/`status`/`origin`/`event`/`screen`/`top`/`parent` 都是常见业务变量名，真实命中概率不低。防护机制（组合使用）：

1. **按需过滤**（上文）先把解构集缩到 p50=3 项，碰撞面缩小两个数量级；
2. **剔除 import 绑定名**（可靠）：从 lexer 的 `[ss,se)` span 切出 import 语句文本解析绑定名（import clause 语法简单），从解构集剔除；解析器会**剥离 import 语句内注释**（`import { x } /* window */ from ...`）——否则注释里的全局名会被误当绑定剔除，令真实的 `window` 引用逃逸沙箱（review 修正）。
3. **SyntaxError 捕获重试（v1 用 probe 在 flush 前完成，必须不漏）**：合成 specifier → blob 的 import map 条目一旦 flush 便 **first-wins 不可改**，因此重试不能等到真实执行——那时 blob 已锁定、换新 blob 也无法更新条目。v1 在 flush **之前**对可能重名的模块做 **probe**：import 一份「runtime specifier 换成永不注册的 `__probe__`」的 blob——parse 阶段的重名 SyntaxError 会先于 resolve 失败暴露、且模块**绝不会真正求值**；捕获后从解构集剔除、原地重建 record（新 blob、更新 pending 条目），循环至无碰撞。
4. **probe 触发条件必须不漏**（review 修正）：**去掉**原「声明关键字 120 字窗口内出现解构名」的启发式——那会漏掉「声明关键字距重名 >120 字」（长声明列表）的真实碰撞，导致 flush 了含重名 `const` 的 blob、真实执行时抛 SyntaxError 且**无法再修**（条目已锁）。改为**必要条件的合取**：`解构集非空 ∧ 源码含 const/let/var/function/class 关键字` 即 probe。两者都是碰撞的必要条件，缺一即不可能碰撞——因此跳过不漏；含关键字的模块一律 probe（不看关键字位置），宁可多 probe 一次（冷路径，parse 成本与真实执行本就要付的 parse 同量级）也不漏。

被剔除的名字在该模块内不经沙箱，但这恰是正确语义：模块自己的顶层声明/导入本来就遮蔽全局，该标识符根本不引用全局。

**与 classic `with(proxy)` 的能力差异（真实但已大幅收敛）**

- `with(proxy)` 能拦截**所有**裸标识符；顶部解构只能拦截**解构集内**的标识符。复用 725 项后差距很小，但仍非完全等价：白名单外的新 Web API 裸调用会逃逸、无法在 unmount 时清理。缓解：扩充白名单 + `extraGlobals` + 可选 lint 规则。（原 RFC 把 `addEventListener` 等列为「逃逸」是基于「只解构 30 项」的假设；复用 725 项后这些**默认已覆盖**。）
- **strict-mode 隐式全局「写」差异（重要，必须文档化）**：classic `with(proxy)` 下 `foo = 1`（无 `var`/`window.` 前缀）会写到 proxy；但 ESM 模块强制 strict mode，无声明的 `foo = 1` **直接抛 `ReferenceError`**，而非写入 proxy。依赖隐式全局的老代码在 ESM 子应用里会**报错而非被沙箱捕获**。注意这与下文「写入走 set trap 可清理」**并不矛盾**：set trap 只覆盖 `window.foo = 1` 这类**经 proxy 的属性写**；裸 `foo = 1` 在 strict mode 下根本到不了 set trap。迁移指南需明确这一点。
- 通过 `(0, eval)('globalThis')`、`Function('return this')()` 等间接渠道仍能拿到真 globalThis。这是 JS 沙箱固有问题，与 classic 同病，不在本 RFC 解决范围。（注：qiankun 自身的注入引导已不依赖 eval——见上文 runtime 模块方案——子应用的 eval 逃逸与框架自身的 CSP 依赖是两回事。）
- **`const` 解构是快照，非 live binding**：对 `window`、`document` 等引用稳定的对象，解构拿到 proxy 本身，后续属性访问仍是 live 的（`document.title` 始终走 proxy getter）。但无法对某个标识符做「整体替换」式虚拟化（如让不同子应用看到不同的 `location` 对象）。当前 classic sandbox 也不虚拟化 `location`，故这是**一致的限制**，但需在此显式声明以避免未来扩展踩坑。
- 缓解：属性写操作走 Membrane 的 set trap，副作用仍可记录与清理（与现有 classic 沙箱一致）。

**安全（v1 实现）：realm 访问器的三重防越权**

内部入口需要一座「blob 模块文本 → qiankun 内存对象」的桥，而改写后的业务模块**跑在真实全局作用域**——裸标识符 `foo` 直接解析到真实全局对象、**根本不经过 membrane proxy**（proxy 只拦截 `window.foo` 这类经代理的属性访问）。因此第二轮设计的「membrane get-trap 黑名单屏蔽 `__qk_*`」**只能挡住 `globalThis.__qk_realm(...)`，挡不住裸 `__qk_realm(...)`**（review 实测：裸引用穿透；且 `createMembraneTarget` 会把真实全局上 non-configurable 的 `__qk_realm` 拷进第二个应用起的 target，令 proxy 屏蔽对后续实例失效）。

v1 因此改为**不依赖屏蔽完备性**的三重防护：

1. **随机访问器 key（每 qiankun 副本一个）**：访问器不再挂在固定的 `globalThis.__qk_realm`，而是 `globalThis['__qk_r_<crypto 随机>']`。业务代码即使枚举真实 globalThis 也拿不到一个可预测的名字；固定名 `__qk_realm` 已不存在。
2. **不可猜 token（每实例一个）**：访问器按 `token → realm` 索引，而非按可猜的 `appId`/`instanceKey`。token 是 crypto 随机、**只作为字面量内联在该实例自己的 runtime blob 源码里**（runtime blob 的 specifier 是 `__qk_..._/__runtime__`，改写器拒绝业务代码 import 任何 `__qk_*` 合成 specifier）。业务模块拿不到别的实例的 token，也读不到自己 runtime blob 的源码——即便侥幸找到随机访问器 key，也无 token 可用。
3. **membrane 屏蔽作为纵深**：随机 key 仍以 `__qk_` 前缀（复用 `esmInternalPrefix` 单一常量，避免前缀漂移使屏蔽失守），membrane 的 get/has/getOwnPropertyDescriptor/ownKeys 四个 trap 一致屏蔽 `__qk_*`；`createMembraneTarget` **不再把 `__qk_*` 拷进 target**，使屏蔽对第 2、3……个实例同样生效。

`Symbol.for(...)` / 可枚举 token 类缓解仍**无效**（可派生/可枚举），故未采用；随机 key + 不可猜 token 的组合才是不依赖 proxy 屏蔽的正确解。

**副作用收益**：随机 key 天然是**每副本私有**（各副本各自的 key + 各自的 `token → realm` map），不再抢占固定单例 `__qk_realm`，因此**一页面上两份 qiankun 副本共存不再崩溃**（旧设计里第二份副本的 `ensureRealmAccessor` 见 key 已存在而跳过，导致其 runtime 模块 `rt` 取到 undefined）。

- **合成 specifier 不得透传**：runtime 模块的 `__qk_..._/__runtime__` 条目在全局 import map 中对所有代码可见。改写器对源码中出现的 `__qk_*` 前缀 specifier 必须拒绝（不按用户输入原样保留）；`__qk_dynamic_import` 同样拒绝解析 `__qk_*` 合成 specifier——防止子应用经 import map 直接 import 他人（或自己）的 runtime 模块。
- **残留的固有限制**：`(0,eval)('globalThis')`、`Function('return this')()` 等间接渠道仍可拿到真 globalThis（与 classic 沙箱同病，不在本 RFC 解决范围）；但即便拿到真全局，也需要随机 key + 目标实例的不可猜 token 才能越权到他人 realm。

### 2. 模块加载：保留原生 `import`，仅改写 specifier

**为什么不替换为 `qiankun_import(...)`**

如果把所有 `import`/`import()` 改写成 runtime loader 调用，就要自己实现：模块依赖图解析、top-level await 协调、循环依赖、execution order 等等。这些浏览器原生 ESM loader 已实现且语义复杂。重写不仅工程量大，且容易引入语义偏差。

**采用方案：lexer 只改写 specifier 字符串字面量 + Import Map 间接层**

```
原: import { createApp } from 'vue';
改: import { createApp } from '__qk_appA_inst1__/https://cdn.jsdelivr.net/vue@3.4/dist/vue.esm-browser.js';
```

specifier 被改写为 **实例级唯一标识**（如 `__qk_<appId>_<instanceId>__/<原始URL>`）。浏览器通过 qiankun 注入的全局 import map 将其映射到 blob URL，再由原生 ESM loader 处理后续。TLA、循环依赖、live binding **全部由浏览器保证**。

> 为什么不直接改写为 blob URL？见下方"循环依赖"说明。

**依赖图遍历策略（并行 + memoize）**

RFC 的改写管线需要递归处理整个模块依赖图。为避免串行瀑布（entry → fetch A → fetch B → ...），采用以下策略：

```
1. fetch + parse entry module
2. 从 parse 结果中提取所有 static import specifier
3. 对每个 specifier：
   a. 解析为绝对 URL（按下方"Specifier 解析顺序"）
   b. 查 fetch memoize map：如果该 URL 已有 pending/completed Promise，复用响应体
   c. 否则：发起 fetch + parse，递归步骤 2-3（并行，不等待）
4. 每个模块独立生成 blob URL（specifier 改写为唯一标识，无需等待子依赖的 blob URL）
5. 所有 blob URL 就绪后，构建全局 import map：`{ "imports": { "__qk_inst1__/url": "blob:uuid", ... } }`
6. 注入 import map → import(entryBlobUrl)
```

关键实现要点：
- **Promise memoization**：fetch/parse 可按 `absoluteUrl` 复用响应体；blob URL 缓存必须按 `instanceId + absoluteUrl` 区分，避免不同实例共享带有不同前缀与 realm 绑定的改写产物
- **并行 fetch**：步骤 3 中所有子依赖的 fetch 同时发起，不等待彼此
- **全并行 blob 生成**：因为 specifier 改写为唯一标识后不再依赖其他模块的 blob URL，所有模块可独立、并行生成 blob URL，无需自底向上串行
- **循环依赖**：见下方专项说明
- **动态 import**：不在此阶段处理，保持 lazy（运行时通过 `__qk_dynamic_import` 按需触发同样的管线，并追加 import map 条目）
- **与 `modulepreload` 的协同**：writable-dom 生成的 `modulepreload` 被改写为 `rel="preload" as="fetch"`，预热请求仍由浏览器在 walk-ahead 时机发出，其响应经浏览器 preload cache 被改写管线的 `fetch()` 复用（与 classic 路径的 `as="script"` → `as="fetch"` 改写同一手法，见 §10.1）

**循环依赖**

如果直接将 specifier 改写为 blob URL，循环依赖会导致**死锁**：A 的 blob URL 生成需要 B 的 blob URL（替换 specifier），B 的 blob URL 生成需要 A 的 blob URL → 互相等待，永远无法完成。

> **准确定性**：这是一个纯粹的 **blob 生成期自依赖** 问题，而非 ESM 运行时语义问题。打破它的充分条件只是「specifier 不内联 blob URL」。原生 import map 是实现该间接层的**一种**方式，并非唯一解——任何「先把 specifier 改写成稳定本地标识、blob 独立生成、再做一次间接解析」的方案都能打破死锁。本 RFC 选择原生 import map，是因为它把循环依赖的 instantiation/evaluation 完全交还浏览器、**零 live-binding 损失**；而 es-module-shims 一类的 in-JS 间接层用 shell module 打破循环时，会带来「循环中首个未执行父模块 live binding 失效」的语义代价（这恰好印证了对「跳板模块」类方案的否决，见 Alternatives Considered）。§11 列举的诸多衍生代价（blob: scope 无法隔离、条目不可删、Firefox flag、retired 前缀簿记）属于「选择文档级单例 import map」的代价，而非 ESM 循环依赖的固有成本。

Import Map 间接层彻底解决了这个问题：

- 改写后的模块代码中，specifier 是 **实例级唯一标识**（如 `__qk_<appId>_<instanceId>__/<原始URL>`），不依赖任何其他模块的 blob URL
- 因此 A 和 B 的 blob URL 可以独立生成，不存在循环等待
- 浏览器通过全局 import map 将唯一标识解析为 blob URL 后，由原生 ESM loader 处理循环依赖的 instantiation（创建 module record + binding）和 evaluation（DFS 后序执行）
- **live binding、hoisting、evaluation order 完全由浏览器保证** → 零 ESM 语义损失

详见 §11 Import Map 运行时管理（已更新）。

**Specifier 解析顺序**

1. 查询当前 app 的 import map（**新增功能**：当前仓库 `packages/` 下没有 importmap 实现）→ 命中则使用映射后的 URL
2. 查询 qiankun `module-resolver`（`packages/shared/src/module-resolver/index.ts`）：
   - 当前实现是 **URL + dependencymap 驱动** 的，依赖匹配通过子应用 HTML 的 `<script type="dependencymap">` 与 semver 范围进行；它**不直接解析 bare specifier**。
   - 因此本方案需要做的衔接是：在 (1) 把 bare specifier 解析为绝对 URL 之后，再由 module-resolver 判断是否能复用已有共享模块的**网络响应**（按现有 URL/版本语义；v1 只做 source 级共享，不跨实例共享改写产物 blob，见 §11）。
3. 否则按 `new URL(specifier, parentUrl)` 解析为绝对 URL，递归走 transpiler

**`es-module-lexer` 实现注意事项**

- `parse()` 返回 `[imports, exports, facade, hasModuleSyntax]`；每个 import 条目含 `s, e, ss, se, d, a, n, t` 字段
- **static import** 的 specifier 位置通过 `imports[i].s` / `imports[i].e` 获取
- **re-export**（`export { x } from 'mod'`、`export * from 'mod'`）的 specifier 位置在 **`imports` 数组**中（作为 static import 条目），不在 `exports` 数组中。改写逻辑只需遍历 `imports` 数组即可覆盖所有需要改写的 specifier
- **`import.meta` 检测**：作为 `imports` 数组中 **`d === -2`** 的条目，其 `[s, e)` 覆盖整段 `import.meta` token。§3 的改写依赖这一点（**§2/§3 必须显式写明该检测方式，否则实现易漏掉 import.meta**）
- **dynamic import**：条目 `d > -1`；`ss`/`se` 为整个 `import(...)` 调用范围，`s`/`e` 为括号内 specifier 范围。字符串字面量 dynamic import 的 `n` 为该字符串，`a` 为 import attributes 位置（无则 `-1`）
- **非字符串 dynamic import**（`import(variable)`）：`n` 字段为 `undefined`，只有调用范围（`ss`/`se`）可用。这些由 `__qk_dynamic_import` 在运行时处理，不需要编译期解析 specifier；改写时注意 `import(` 关键字定位与嵌套 `import()` 的边界

**改写的 offset 管理（实现必读）**

一个模块里通常要**同时**改写多处：若干 static / re-export specifier、若干 `import.meta`、若干 `import()` 调用点。lexer 给出的所有 `[s,e)`/`[ss,se)` 都是**针对原始源码字符串**的字节偏移。一旦在某处插入/替换文本，其后所有偏移都会错位。因此改写必须：

- 把所有改写点（specifier / import.meta / dynamic import）**收集成一个按 `s` 排序的列表统一处理**，并**从后向前（右→左）应用替换**，或维护「原始偏移 → 累计位移」映射在替换后重算——切忌多遍各自按原始偏移改写；
- specifier 改写要替换**整个 `[s,e)` span**（含引号内字符串），`import.meta` 要替换**整个 `[s,e)` span**，**不能**做 naive 的 `code.replace('import.meta', …)`（会被注释、字符串、`import.metaFoo` 等击穿）。

### 3. `import.meta`

`import.meta` 是语法级对象，**不能**用 `const import.meta = ...` 替换。

**方案**：lexer 通过 **`d === -2`** 定位所有 `import.meta` 条目 → 把每个条目的整段 `[s,e)`（即 `import.meta` token）替换为标识符 `__qk_import_meta`（务必替换整段 span，不可用字符串 replace，见 §2 offset 管理）→ 顶部声明：

```js
const __qk_import_meta = {
  url: '<原始 URL>',
  resolve: __qk_resolve, // runtime 模块导出，已绑定 appId（见 §1）
};
```

`import.meta.resolve(specifier)` 返回**原始 URL**（不是内部 blob URL），符合开发者视角原生。`__qk_resolve` 内部沿用 specifier 解析逻辑，但只解析不 transpile，返回开发者可预期的真实 URL。

### 4. 动态 `import(x)`

`x` 是运行时字符串（如 `import(\`./\${name}.js\`)`），lexer 无法在编译期解析。

**方案**：

```
原: import(x)
改: __qk_dynamic_import(x, __qk_import_meta.url)
```

`__qk_dynamic_import(specifier, baseUrl)` 内部：
1. 用 `new URL(specifier, baseUrl)` 解析
2. 走完整的 fetch + lexer + rewrite + Blob URL 流水线（共享缓存）
3. 返回 `import(blobUrl)` 的 Promise —— 注意这里把**已解析的 blob URL 直接**交给原生 `import()`，而非合成 specifier，因此不存在「同一 referrer 重复 import 同一合成 specifier、命中 resolved-module-set 旧解析」的竞态；不同目标 URL 自然得到不同 blob URL / 不同缓存条目，相同 URL 复用同一 namespace（符合 ESM 语义）。
4. 若被动态加载的模块自身含 static import（其合成 specifier 需要 import map 条目），必须**先**把这些条目注入运行时 import map，**再**调用 `import(blobUrl)`（其 referrer 是全新 blob URL，首次解析即可见新条目）。不得尝试用晚注入 map 覆盖已解析过的 `(referrer, specifier)`（见 §11）。

> 边界：`import(` 关键字定位、嵌套 `import(import(x))`、非字符串实参（`n === undefined` / `a === -1`）等需按 §2 offset 规则处理。

这样 `import('./foo.js')` 在 `src/utils/bar.js` 与在 `main.js` 里得到正确的不同解析结果。

### 5. import maps

子应用 HTML 中可能出现 `<script type="importmap">{...}</script>`。

**方案**：qiankun **自己解析** import map，不依赖浏览器：

- HTML loader 解析 import map JSON → 存入 per-app `Map<bareSpecifier, url>`
- ESM transpiler 改写 specifier 时优先查询该 map
- 永远不把 `<script type="importmap">` 注入主文档（避免与主应用、其他子应用的 import map 冲突）

每个 app 独立 import map，天然隔离。

### 6. CSS / 静态资源

- **JS 里 `new URL('./assets/logo.png', import.meta.url)`** —— 因 `__qk_import_meta.url` 是原始 URL，`new URL()` 解析结果天然正确，**无需特殊处理**。
- **CSS 里 `url(./bg.png)`** —— 复用 `packages/shared/src/assets-transpilers/` 现有的 CSS URL 重写逻辑。
- **HTML 里 `<link rel="stylesheet" href="...">`**（生产构建、dev `index.html` 内联均可能出现）—— **不走 ESM 模块管线**，仍走 qiankun 现有 link transpiler + `dynamicAppend`（`forStandardSandbox` 对 `rel=stylesheet` 已有专门处理），被路由到子应用虚拟 head。需注意其与 ESM 入口「`await import` 完成信号」的时序协调：旧 link 路径会计入 entry HTML 阻塞资源，而 ESM 入口不经 script onload，需确保两套完成信号正确合流；remount 后外链样式同样面临下文的「丢样式」问题。

**Vite CSS-as-JS 模块**

Vite dev 模式下 `import './style.css'` 不返回原始 CSS 文件，而是返回一个在模块顶层把样式注入 DOM 的 JS 模块。**注意：真实 Vite dev 的样式注入与 HMR 绑定**——它通过 `/@vite/client` 的 `updateStyle`/`removeStyle` 注入，并在模块里**无条件**调用 `import.meta.hot.accept()` / `import.meta.hot.prune()`。下面是简化示意（**非逐字还原** Vite 产物，原 RFC 给出的独立 `createElement('style')` 片段是杜撰/过时的）：

```js
// 简化示意：Vite dev 的 CSS 模块在顶层注入 <style>
import { updateStyle, removeStyle } from '/@vite/client';
const id = '/src/style.css';
const css = ".foo { color: red }";
updateStyle(id, css);              // 顶层副作用：插入 <style>
import.meta.hot.accept();          // 无条件调用 → 依赖 __qk_import_meta.hot stub
import.meta.hot.prune(() => removeStyle(id));
export default css;
```

走通用管线（fetch → lexer → rewrite → blob）后：
- 其中 DOM 操作经顶部注入指向 proxy `document`，动态 `<style>` 被 `patchers/dynamicAppend` 路由到虚拟 head ✅
- `import.meta.hot` 被改写为 `__qk_import_meta.hot`，由 §13 的 noop stub 兜底，不报错 ✅

**⚠️ 但与 ESM remount 语义冲突（重要，原「无需额外处理」结论不成立）**

CSS-as-JS 的样式注入发生在**模块顶层**。按 §8，ESM remount 复用同一 blob URL、**顶层代码不再执行**；而 qiankun unmount 会清空子应用容器（含虚拟 `<qiankun-head>`），把首次 mount 注入的 `<style>` 一并销毁。于是 **remount 后顶层不重跑 → 样式不会重新注入 → 子应用第二次 mount 起永久丢失样式**。这对「mount/unmount/remount 业务功能正常」验收是真实威胁，任何在顶层做 DOM 副作用的模块都同理。

可选缓解（需 POC 选定其一）：
1. 验证 `dynamicAppend` 的 `rebuildCSSRules` 能否在 remount 时完整恢复这些 `<style>`（需确认 `textContent` 型 style 元素被移除后 cssRules 仍可重建）；
2. 或对 CSS-as-JS / 顶层 DOM 副作用模块，remount 时**不复用 blob、重新求值顶层**（作为 §8 通用「复用」策略的例外）；
3. 把样式注入挪到 `mount()`（**但 Vite CSS-as-JS 是构建产物、开发者无法控制**，故 1/2 更现实）。

需补一条「remount 后样式仍在」的验收用例（见 Acceptance Criteria）。

### 7. 生命周期契约

ESM 子应用通过 `export` 暴露生命周期：

```js
export async function bootstrap() {}
export async function mount(props) {}
export async function unmount() {}
```

**当前实现 vs 新增**

- 当前 `packages/loader/src/index.ts` 在 `onEntryLoaded()` 中通过 `sandbox.globalThis[sandbox.latestSetProp]` 来取出 entry 导出对象。这条路径只对会向 `window` 写值的 classic script 有效。
- ESM 入口模块**不会向 `window` 写**，因此必须新增一条 ESM 入口解析路径。

qiankun loader 在识别到 entry 是 `<script type="module">` 时，进入 ESM 分支：

```ts
let ns: Record<string, unknown>;
try {
  // 可选 timeout / abort：防止入口模块 TLA 永不 resolve，并支持快速 unmount 取消（见 §8 / Risks）
  ns = await raceWithAbort(import(entryBlobUrl), loadController.signal);
} catch (e) {
  // ESM 入口模块图中任一模块同步抛错或 TLA reject 都会到这里，
  // 必须把 rejection plumb 回 entryScriptLoadedDeferred.reject，经 loadApp 上抛 single-spa
  entryScriptLoadedDeferred.reject(e);
  throw e;
}
return {
  bootstrap: ns.bootstrap,
  mount: ns.mount,
  unmount: ns.unmount,
};
```

完全替换 classic 分支的 `latestSetProp` 机制（classic 分支不动）。

**入口 namespace 的选取（v1 实现，修正「最后一个 module script 即入口」的启发式）**

`<script type="module">` 经 `transformIndexHtml` 后**常丢失 `entry` 属性**（Vite 就会），因此不能简单假定「文档序最后一个 module script 就是入口」——那会让「入口模块后面还有一个无关 module script（埋点/polyfill）」的 app、以及「classic app 恰好内联了一个 module script」的场景选错 namespace。v1 的选取顺序：

1. **显式 `entry`**：若存在标了 `entry` 的 module script，它就是入口；它执行失败**直接 reject** 整个 entry（RFC §7 错误传播）。
2. **按生命周期 namespace**：否则在所有已执行 module 的 namespace 里选**第一个**导出了 `bootstrap`/`mount`/`unmount`（或 `export default { ... }`，见下）的模块。谓词由 loadApp 注入（engine 属 `@qiankunjs/shared`，不认识 qiankun 的生命周期概念）。
3. **回落最后执行**：都不匹配则取最后执行的 namespace；无论如何 loadApp 的 `getLifecyclesFromExports` 会**二次校验并回落** `latestSetProp`/`window[appName]`。
4. **非入口模块失败不炸整个 app**：无显式 entry 时，单个 module 执行失败只 `console.error`，不 reject——因为它可能只是 classic app 顺带的一个 module script，真正的生命周期在 `latestSetProp`。

这套顺序同时修好了「classic + 无关 module script 被 ESM 引擎劫持入口」与「多 module 且入口非末位选错」两个 review 缺陷。

**默认导出生命周期**：`getLifecyclesFromExports` 除具名 `bootstrap`/`mount`/`unmount` 外，也接受 `export default { bootstrap, mount, unmount }`（single-spa 惯例，classic `latestSetProp` 路径此前不必处理）。

**错误传播与可观测性（不可省略）**

- classic 路径把 entry 的 `script.onerror` 接到 `entryScriptLoadedDeferred.reject`，错误能上抛 `loadApp` / single-spa `addErrorHandler`。ESM 走 `await import`，**必须显式 try/catch 接住 reject 并回灌**同一 Deferred，否则要么静默丢失、要么变成 `unhandledrejection`。原 §7 只给了 happy path，需补此分支。
- **运行期未捕获错误的可观测性退化**：blob 模块抛出的 `error.stack` 指向 `blob:https://<主应用 origin>/<uuid>`；`//# sourceURL`（§15）只改 DevTools 显示名、**不改 stack 里的真实 URL**。生产错误上报会充斥无意义的 `blob:` 帧、无法定位子应用真实文件。这是 classic 沙箱不存在的退化，把「完整 source map」从「未来增强」重估为**可观测性必需项**（见 §15 / Risks）。

### 8. 模块缓存与生命周期

| 生命周期事件 | blob URL 缓存 | fetch LRU | sandbox state |
|---|---|---|---|
| mount | 引用计数 +1（命中复用，未命中新建） | 命中复用 | 激活 |
| unmount | 保留 | 保留 | 失活但保留 |
| remount | **复用同一个 blob URL** | 命中复用 | 重新激活 |
| unload | 引用计数 -1，归零则 `revokeObjectURL` | 不动（全局 LRU 自管理） | GC |

blob URL 缓存 key 必须包含 instanceId；fetch LRU 可以继续按原始 URL 复用响应体。这样同一子应用的同一实例 remount 可复用 module namespace，而 unload 后重新加载会获得新的实例前缀与 blob URL，避免命中已退休的全局 import map 条目。

> **不变量（需显式声明）**：remount = **同 instanceId、复用同一 blob、不注入新 import map 条目**；unload→reload = **分配新 instanceId、新 blob、新条目**。Acceptance 的「100 次循环」必须明确是 remount（不含 unload），否则会被误读为 reload 级膨胀（见 Acceptance / §11）。

**`dispose` 的接入时机（v1 实现）**

engine 的 `dispose()` 追踪**它创建过的每一个 blob URL**（runtime 模块、每个 module record、每次 redeclaration 重建产生的旧 blob、inline module——review 曾漏 inline/rebuilt），dispose 时全部 `revokeObjectURL` 并从 instance registry 注销（使退休实例的 globals view 不再可达）。

接入点是 **single-spa 的 `unload` 生命周期**（parcelConfig 新增 `unload` 钩子），而**非 `unmount`**：

- `unmount` 只是失活，remount 要复用同一 engine 与其 module namespace（顶层不重跑），此时 dispose 会把 instance view/blob 清掉导致复用断裂——所以 unmount **不** dispose，与 classic sandbox「inactive 不销毁」一致。
- `unload` 是「彻底卸载」，正是释放 instance view + blob 的时机；unload 后再次激活会重新走 loadApp → 全新 engine（新 instanceKey/新条目），与上面的不变量吻合。

**已知限制**：`loadMicroApp` 手动加载的 parcel 没有 `unload` 语义（single-spa parcel 只有 unmount），其 engine 会随 parcel 一同滞留直到调用方释放引用；这与 classic sandbox 至今**没有 `destroy` 钩子**（`Sandbox.destroy` 仍是 TODO）是同一类既有缺口，不是 ESM 引入的新退化。长生命周期 shell 若需在 unmount 后立即回收，需等 sandbox 层引入统一 destroy。

**共享模块引用计数（v1 简化：blob 均为实例私有）**

v1 已把共享依赖收缩为 source 级（见 §11）：blob 全部按 `instanceId + 原始 URL` 私有，本表的引用计数按实例记即可，不存在跨实例误 revoke。**若 v2 引入 namespace 级共享（多个实例指向同一份 shared blob）**，引用计数必须按 shared key 单独维护，否则实例 A unload 时会把仍被实例 B 引用的 shared blob `revokeObjectURL` 掉 → B 后续 `import()` 报错；那是一套全新的跨实例引用计数基础设施（现有 `module-resolver` 仅做 URL/版本匹配，无此计数），shared blob 的 revoke 必须等其所有引用实例都 unload——连同 realm 绑定问题一并作为 v2 前置条件（见 §11、Open Q9）。

**快速 unmount / 切路由的取消语义（abort）**

ESM 管线是「并行 fetch 整个模块图 → 生成 blob → 注入 import map → `await import(entryBlobUrl)`」的长异步链。用户可能在 mount 完成前就切走路由触发 unmount。需引入 **per-load `AbortController`**：
- unmount 时 abort 所有 in-flight 模块 fetch（避免浪费带宽、避免向已退休实例注入 import map 条目）；
- `await import` 解析后检查实例是否仍 active，**已卸载则丢弃结果、不调用 `mount()`**（防 mount-after-unmount 对已清空容器调 mount）；
- 配合入口 import 的 timeout（`Promise.race`），避免 TLA 永久 pending 时 unmount 也打断不了。

**异步求值下的动态元素归属（dynamicAppend）**

qiankun 用全局单变量 `nativeGlobal.__currentLockingSandbox__` 把 `document.createElement` 产物归属到「当前正在执行的 sandbox」（`forStandardSandbox`：proxy.createElement 同步置位、同一同步调用内 `delete`）。该机制建立在「脚本同步执行、同一时刻只有一个 sandbox 在跑」之上——classic `with(this)` 满足。但 ESM 求值深度异步（`await import` 触发的模块求值、TLA、动态 import 跨 microtask/task），**同名 app 多实例并发加载时模块求值会在事件循环里交错**：若 `createElement` 发生在某次 `await` 之后，`__currentLockingSandbox__` 可能恰被另一实例置换或已 `delete`，导致元素**错配/漏归属**，unmount 时清理到错误容器。需评估把元素归属从「全局单锁」改为「从 proxy document 身份直接拿所属 sandbox」。多实例隔离不能只靠 §11 的 specifier 前缀。

**与 classic script remount 的语义差异（重要）**

- Classic script：每次 remount 重新执行整段代码，顶层副作用重跑。
- ESM remount：因复用同一 blob URL，浏览器原生 ESM loader 保证 `import(sameBlobUrl)` 返回**同一个 module namespace**，**顶层代码不会重跑**，只有 `mount(props)` 函数被重复调用。

这对现代框架是正确行为（Vue/React 的应用实例本就应该在 `mount()` 里创建）。但对老写法（在 module 顶层创建全局状态）需要迁移到 `mount()` 内。

**文档化要求**：在 ESM 子应用迁移指南中明确说明此差异。

### 9. classic 与 ESM 混合

同一子应用可能同时包含两种 script：

```html
<script src="./polyfill.js"></script>
<script type="module" src="./main.js" entry></script>
```

**方案**：HTML loader 按 `type` 自动分流：

- `<script>` / `<script type="text/javascript">` → classic transpiler（`with(this)` 包裹）
- `<script type="module">` → ESM transpiler

**与现有代码的衔接**

- `packages/shared/src/assets-transpilers/utils.ts` 中的 `isValidJavaScriptType()` 已经把 `'module'` 视为合法 JS 类型，但 `script.ts` 中的现有 transpile 逻辑仍是 classic 路径；本 RFC 在 `script.ts` 内增加“按 `type` 分流到 classic / ESM transpiler”的判断。
- `packages/loader/src/writable-dom/index.ts` 已对 `type="module"` 走非阻塞分支并生成 `modulepreload`；本 RFC **不修改 writable-dom 内部**，而是通过 loader 的 `nodeTransformer` 钩子完成实际改写。

两者**共享同一份 Membrane**：classic 通过 `with(proxy)` 看到 proxy；ESM 通过顶部注入看到同一个 proxy。理论行为一致。

### 10. CSP-safe lexer 入口

`es-module-lexer` 的默认 WASM 入口会用动态 `eval` 解码字符串 specifier。CSP 禁止 `'unsafe-eval'` 时，该调用虽然被依赖内部捕获，却会让 `imp.n` 变成 `undefined`，随后静态依赖被错误跳过。qiankun 因此固定使用 `es-module-lexer/js`：它在纯 JS 中完成字符串解码，不依赖 `eval` 或 WebAssembly，也无需在 `start()` 阶段异步预热。

`prepareEsmLexer(): Promise<void>` 仅作为加载管线的兼容契约保留，当前返回已 resolve 的 Promise。CSP e2e 必须实际挂载带静态依赖的 ESM 应用，不能只检查响应头。

### 10.1 与 writable-dom `modulepreload` 的协同

`packages/loader/src/writable-dom/index.ts` 在 walk 到 `<script type="module">` 时**可能**生成 `<link rel="modulepreload" href="原始URL">`——但这条预加载受 `isBlocked` 门控（仅在被前序阻塞脚本挡住、需要「向前预热」时生成）。**对一个纯 ESM 入口（HTML 里只有一个 `<script type="module">`、前面没有阻塞 classic 脚本）的主目标场景，往往根本不会生成 modulepreload**，所谓「双取」在该场景基本不存在——原 RFC 把它描述为「解析 module script 时必然生成」是不准确的。

仅在确实生成了 modulepreload 的**混合**场景，才需处理「原始 URL 预取一次 + 改写后 blob URL 再 `import()` 一次」的双取：

- **更正一：不能依赖「复用 `makeFetchCacheable` LRU」**。`modulepreload` 是**浏览器内部**的 link 资源获取，不经过 JS 层；`makeFetchCacheable`（`packages/shared/src/fetch-utils/makeFetchCacheable.ts`，全局 LRU 50）只缓存 qiankun 自己 `fetch()` 的响应。浏览器 modulepreload 的产物只进入**浏览器缓存**，无法直接灌进 qiankun 的 JS 级 LRU。原 RFC 把两者混为一谈，「让原始 URL 预取结果被改写流水线复用」这一「优先方案」**机制上不成立**。
- **更正二：modulepreload 的 module map 产物在改写方案下必然浪费**。modulepreload 会把**原始 URL** 的编译模块塞进 module map，但改写后的模块图只 `import` blob URL，原 URL 条目永远不会被消费——网络字节最多经缓存复用，编译则纯属白做。
- 候选复用路径有三条：
  - (a) **依赖 HTTP 缓存命中**：保留 modulepreload，寄希望于改写管线的 `fetch()` 与它命中同一条浏览器 HTTP 缓存。依赖响应可缓存、同 URL、同 credentials——dev server 普遍 `no-cache`，命中不可控，**不采用**。
  - (b) **抑制**：直接摘掉 modulepreload、由改写管线统一发起并经 `makeFetchCacheable` 去重。缺点：writable-dom 只在被前序阻塞脚本挡住时才 walk-ahead 生成 modulepreload（「向前预热」），单纯抑制会**丢失这个预热时机**——模块下载被推迟到 walker 正序处理到 module script 时才开始，混合场景出现串行化回退；若要补偿还需在抑制处手动发 `cachedFetch` 预热。
  - (b') **改写为 `rel="preload" as="fetch"`（采用，与 classic 路径对齐）**：classic script 沙箱路径早已用同一手法——`link.ts` 的 `postProcessPreloadLink` 把 `as="script"` 改成 `as="fetch"`，使浏览器 preload 请求的 destination/mode 与后续管线 `fetch()` 对齐、经 **preload cache** 命中（preload cache 匹配不依赖响应可缓存性，对 `no-cache` 的 dev server 同样有效）。modulepreload 照抄：改写为 `rel="preload" as="fetch"`，浏览器仍在 walk-ahead 时机发出预热请求（时机零丢失），管线 `fetch()` 从 preload cache 直取。
- **(b') 的 credentials 对齐规则**：modulepreload 天然 `mode: 'cors'`，而裸 `as="fetch"` preload 是 no-cors、永远匹配不上 `fetch()`，因此必须显式映射——无 `crossorigin`/`anonymous` → 补 `crossorigin="anonymous"`（cors + same-origin，恰为 `fetch()` 默认值，与 `engine.fetchModuleSource` 一致）；`use-credentials` → 原样保留。每个 `DocumentModule` 都保存自己的 credentials，静态 JS 依赖与普通动态 `import()` 发现的懒加载图沿用该不可变上下文；引擎为每个上下文生成独立 runtime bridge，避免动态 import 回落到默认凭据。`makeFetchCacheable` 也按「规范化 URL + 最终生效 credentials」分区，避免 `include` 响应被默认图复用。实现见 `packages/shared/src/assets-transpilers/link.ts` 对 `rel === 'modulepreload'` 的分支。

### 11. Import Map 运行时管理（已更新）

**重要说明**：由于原生 Import Map 是文档级单例且一旦生效无法删除/修改，qiankun 必须确保不同子应用、同一子应用的不同实例之间的 specifier 互不冲突。

**为什么需要 Import Map 间接层**

如 §2 所述，直接将 specifier 改写为 blob URL 会导致循环依赖死锁。Import Map 间接层将"模块标识"（实例级唯一标识）与"模块容器"（blob URL）解耦，使所有模块可独立并行生成 blob URL，由浏览器原生 ESM loader 处理循环依赖。

**机制**

每个子应用 mount 时，qiankun 动态注入一个 `<script type="importmap">`。

**关键约束与设计修正：**

1.  **全局单例与合并语义**：根据 [HTML 规范](https://html.spec.whatwg.org/multipage/webappapis.html#import-maps)，每个 document 逻辑上只维护一张 import map。多个 `<script type="importmap">` 注入时，浏览器会将其合并。**如果新注入的条目与现有条目冲突（specifier 相同），新条目将被丢弃，以先注册者为准。**
2.  **`blob:` 作用域限制**：`scopes` 是基于 referrer URL 匹配的。由于所有子应用模块都被转换为 `blob:` URL，使用 `"scopes": { "blob:": { ... } }` 会匹配**所有**子应用发起的请求，只能避免主应用的非 blob 模块受到影响，无法实现子应用间的相互隔离。
3.  **强制唯一化前缀**：为了实现多实例/多应用隔离，所有 app-private 模块在改写 specifier 时，必须增加 **实例级唯一前缀**（如 `__qk_<appId>_<instanceId>__/...`），并在全局 import map 中注册该唯一 specifier 的映射。
4.  **共享依赖（v1 收缩为 source 级，修正原「共享 blob」设计）**：改写产物 blob 的顶部注入**烘焙了特定实例的 realm 绑定**（解构自 `__qk_realm('app-a')` 的视图）。若跨应用复用同一份 blob，共享模块在模块作用域捕获的 `document`/`window`（如 Vue runtime-dom 的 nodeOps）在应用 B 里仍走 **A 的 proxy**：dynamicAppend 元素归属错到 A 的容器；A unload 后 B 继续持有 A 已清理的 realm。原「共享 vue@3.4 blob」的例子恰与本条「执行结果不携带实例状态才可共享」的前提自相矛盾。此外，classic 沙箱下 module-resolver 的共享本来就只是**网络响应级**——各应用仍在各自沙箱里独立执行一遍脚本，namespace 级单例是超出 classic 的新能力。因此 **v1 与 classic 对齐：module-resolver 只复用 fetch 响应（source 级），每实例独立改写、独立 blob、独立 module namespace**。`__qk_shared__/...` 稳定 key 的 namespace 级共享推迟到 v2，前置条件是解决共享 blob 的 realm 绑定语义与跨实例引用计数（§8、Open Q9）。
5.  **隔离正确性的隐含前提（必须显式规约）**：上述「first-wins 合并 + instanceId 前缀不冲突」的全部正确性，**依赖一个未显式声明的前提——instanceId 必须全局单调唯一、退休后永不复用**。一旦 instanceId 回卷或复用，新实例的合成 specifier 会与某条尚存旧条目相同，被浏览器**静默丢弃（first-wins）→ 解析到旧实例的退休 blob URL**，且**没有任何运行时信号**（不报错、不告警）。因此：instanceId 必须由 qiankun registry 单调分配（全局自增计数，避免随机/时间戳碰撞）；建议 dev 模式对「注入条目与现存 key 冲突」显式探测并 `console.error`，把这条静默失败显性化。

**Import Map 示例：**

```json
{
  "imports": {
    "__qk_appA_inst1__/__runtime__": "blob:uuid-rt-a1",
    "__qk_appA_inst1__/https://app-a.host/main.js": "blob:uuid-a1",
    "__qk_appA_inst1__/https://cdn.jsdelivr.net/vue@3.4/dist/vue.esm-browser.js": "blob:uuid-vue-a1",
    "__qk_appB_inst2__/__runtime__": "blob:uuid-rt-b2",
    "__qk_appB_inst2__/https://app-b.host/main.js": "blob:uuid-b2",
    "__qk_appB_inst2__/https://cdn.jsdelivr.net/vue@3.4/dist/vue.esm-browser.js": "blob:uuid-vue-b2"
  }
}
```

> 注意两实例的 vue 条目指向**各自的** blob——v1 是 source 级共享：fetch 响应经 LRU 只取一次，但改写产物与 module namespace 不共享（见上方第 4 点）。`__qk_shared__/...` 形式的稳定 key 条目仅在 v2 引入 namespace 级共享后才会出现。

**浏览器兼容性**

| 浏览器 | 多 import map 支持 | 版本 |
|---|---|---|
| Chrome / Edge | ✅ | 133+ |
| Safari / iOS Safari | ✅ | 18.4+ |
| Firefox | ⚠️ | 150 branch 已实现，但默认关闭；需开启 `dom.multiple_import_maps.enabled` |

截至 RFC 时间（2026-04），Chromium 与 WebKit 已可依赖原生多 import map；Firefox 稳定版仍不能默认依赖。若运行环境需要 Firefox 或旧版本浏览器，必须把 [es-module-shims](https://github.com/guybedford/es-module-shims) 作为受支持路径，而不是可选兜底。


**Import Map 大小与生命周期**

- **大小估算**：一个中等规模 Vite 子应用（~270 个模块），由于增加了实例前缀，每条 import map 条目约 200 字节，总计约 **54KB**。浏览器解析此 JSON < 1ms，可接受。
- **条目无法删除（长生命周期 shell 中是无界增长）**：import map 一旦注入，无法移除单个条目。子应用 unload 后，blob URL 可 `revokeObjectURL` 释放内存，但 import map 条目成为指向已 revoke URL 的死条目。单次影响小（纯字符串），但**在长生命周期 shell 中，每次 unload→reload 都分配新 instanceId、注入 ~270 条新条目**：100 次 reload ≈ 27,000 条死条目（~5MB+ 字符串），且每次注入都触发一次浏览器 import map **合并**，合并成本随累计条目集增长——与「解析 < 1ms」的乐观说法不符。需明确：要么接受该上限并文档化（多数 shell 不会无限 reload 同一子应用），要么提供「整图重置」逃逸（清空所有 qiankun 注入的 importmap 脚本并重建）。注意：死条目并非「无害」——若被某次解析命中，`import()` 会失败（blob 404）而非返回旧模块；只是新实例用新前缀，通常不会再命中它。
- **动态 import 追加**：晚注入的 import map 只影响未来尚未解析过的 `(referrer, specifier)`。`__qk_dynamic_import` 必须先把运行时发现的模块写入同一个实例前缀 registry，注入唯一 specifier → blob URL 的映射，再调用原生 `import()`；不得尝试用晚注入 map 覆盖已经解析过的原始 URL。
- **unload / reload**：unload 后只能 revoke blob URL，不能删除 import map 条目；该实例前缀应标记为 retired。再次加载同一子应用时应分配新的 instanceId，避免新实例命中旧的全局映射。

**与 §5 子应用 import map 的关系**

§5 描述的是 qiankun **自己解析**子应用 HTML 中的 `<script type="importmap">`，用于 bare specifier → 绝对 URL 的解析。本节描述的是 qiankun **注入到主文档**的运行时 import map，用于将该绝对 URL 映射为 blob URL（并增加实例隔离前缀）。两者是不同层次：

```
子应用 import map（§5，qiankun 内部解析）：  'vue' → 'https://cdn.com/vue.js'
运行时 import map（§11，注入主文档）：       '__qk_inst1__/https://cdn.com/vue.js' → 'blob:uuid-vue'
```

### 12. 集成架构：同步 `nodeTransformer` vs 异步 ESM 管线

**问题**

当前 loader 的 `nodeTransformer` 钩子是**同步**的：

```ts
// packages/shared/src/assets-transpilers/types.ts
type NodeTransformer = <T extends Node>(node: T, opts: Omit<AssetsTranspilerOpts, 'moduleResolver'>) => T;
```

但 ESM 改写管线是**异步**的（fetch 源码 → lexer parse → 递归解析依赖 → 生成 blob URL）。如果同步返回未改写的 `<script type="module" src="...">`，浏览器会立即以原生方式 fetch 并执行原始 URL——**完全绕过沙箱**。

当前 classic script 的 workaround（同步返回节点，异步填充 `src`）对 ESM 不适用：module script 一旦有 `src` 属性就会触发浏览器原生 module loader，无法像 classic script 那样延迟。

**候选方案**

| 方案 | 描述 | 优点 | 缺点 |
|---|---|---|---|
| A. nodeTransformer 改为 async | 签名改为 `async (node, opts) => node` | 最干净 | loader API breaking change；writable-dom 流式管线需要支持 await |
| B. 占位替换 | 同步返回一个**无 src 的空 `<script type="module">`**；异步管线完成后动态设置 `src` 为 blob URL | 不改 nodeTransformer 签名 | 需验证：动态设置 module script src 是否在所有浏览器中触发执行；执行顺序可能与文档顺序不一致 |
| C. 移除 + 异步插入 | 在 nodeTransformer 中**移除**原始 script 节点（返回注释节点占位）；异步管线完成后在占位位置插入新的 blob URL script | 不改签名；执行时机完全可控 | 需要管理占位节点与最终节点的映射；与 writable-dom 的 defer script 队列交互复杂 |
| D. 在 writable-dom 之前拦截 | 在 `loadEntry` 的 stream pipeline 中增加一个 TransformStream，在 HTML 文本层面把 `<script type="module" src="X">` 改写为 `<script type="module" src="blob:...">` | 完全不动 nodeTransformer | 需要在文本层面做 async 改写（等待整个模块图解析完成）；与流式解析的"边解析边执行"理念冲突 |

**倾向方案 C**：移除 + 异步插入。理由：
- 不需要 breaking change
- 执行时机完全由 qiankun 控制
- 与现有 defer script 队列机制可以复用类似的 Deferred 协调模式
- 需要额外处理：多个 module script 之间的执行顺序保证（按文档顺序）

**待定**：需要 POC 验证方案 C 在 writable-dom 流式管线中的可行性。

**补充约束（实现必读）**：
- **执行顺序**：多个动态插入的 module script 设 `async=false` 即由 HTML 规范保证按插入序执行（与 classic 复用的同一机制）；自建 Deferred 链仅用于「等待异步改写完成」，**不是用来保序**的。
- **类型契约 / entry onload**：option C 返回注释占位节点会违反 `NodeTransformer` 的 `T -> T` 类型契约；且若 entry script 被替换成占位/新节点，loader 依赖 entry 节点 `onload`/`onerror` 的 Deferred 会**静默失效**——ESM 入口必须改走 §7 的 `await import` 完成信号，不能再依赖被移除节点的 onload。
- **流式张力**：writable-dom「边解析边执行」的 stream `.then()` 会在**模块 import 完成前**就 resolve；ESM 入口的「就绪」必须以 `await import(entryBlobUrl)` 为准，而非 stream 结束。

### 13. Vite dev 模式 `import.meta.hot` 处理

**问题**

Vite dev server 对**每个模块**都注入 HMR 代码：

```js
import { createHotContext as __vite__createHotContext } from "/@vite/client";
import.meta.hot = __vite__createHotContext("/src/main.ts");
// ... 业务代码 ...
if (import.meta.hot) {
  import.meta.hot.accept(() => { /* ... */ });
}
```

经过 ESM transpiler 改写后：
- `import.meta.hot` → `__qk_import_meta.hot`（赋值不会报错，但语义不同）
- `/@vite/client` → 被改写为 blob URL，其内部依赖 WebSocket 连接到 Vite server
- HMR 的 WebSocket 连接和模块替换逻辑与 blob URL 缓存语义**直接冲突**

**关键更正**：`/@vite/client` 的 HMR WebSocket URL 来自 Vite serve 期注入的**字面量**（`__HMR_PROTOCOL__`/`__HMR_HOSTNAME__`/`__HMR_PORT__`），**不依赖 `import.meta.url`**。因此在沙箱里 WebSocket **会真的连上 Vite server**——HMR 不是「静默失效」，而是会收到更新推送并执行其逻辑：full-reload 消息会触发 **`location.reload()`（经 proxy location，可能刷新整个主应用）**，模块热替换会尝试重新 `import` 原始 URL（绕过 blob 缓存）→ 与本方案语义冲突、报错或行为异常。这是**破坏性**的，不是无害降级。

**方案**

v1 采用**主动禁用 / 拦截 HMR** 策略（而非「静默降级」——上文已说明 WebSocket 会连上，放任会触发破坏性 reload）：

1. ESM transpiler 在 `__qk_import_meta` 上预置 `hot` 属性为 **noop stub**：
   ```js
   const __qk_import_meta = {
     url: '<原始URL>',
     resolve: __qk_resolve, // runtime 模块导出（见 §1）
     hot: {
       accept: () => {},
       dispose: () => {},
       prune: () => {},
       invalidate: () => {},
       decline: () => {},
       on: () => {},
       send: () => {},
       data: {},
     },
   };
   ```
2. **抑制 `/@vite/client` 的连接与 reload**：至少做到其一——(a) 改写/拦截 `/@vite/client`，使其 `createHotContext` 返回 noop、且不建立 WebSocket、不调用 `location.reload`；(b) 让 proxy `location.reload` 在子应用上下文里成为 noop 或仅刷新子应用容器；(c) 注入配置让 Vite 关闭 HMR client（如 `server.hmr=false`）。**不能依赖「赋值覆盖 stub 后连接自然失败」——它通常不会失败。**
3. `if (import.meta.hot)` 守卫内的代码会执行，但因 hot context 为 noop、不触发实际热替换与 reload。

**效果**：Vite dev 子应用能正常加载和运行，HMR 被**主动禁用**（修改代码后需手动刷新），不会出现整页 reload 或热替换报错。这对"集成调试"场景是可接受的。

**React Fast Refresh preamble 风险（验收必经点）**：`@vitejs/plugin-react` 会在 index.html 注入一段 preamble inline module（设置 `window.__vite_plugin_react_preamble_installed__` 并 `import '/@react-refresh'`）；若组件模块运行时该全局未先就位，plugin 注入的检查会**硬抛** "@vitejs/plugin-react can't detect preamble"。在本方案的改写 + 异步注入下需确保：preamble 模块先于任何组件模块求值、且其写入的全局经 proxy 对组件模块可见（preamble 写 `window.x`、组件读 `window.x`，两者经同一 proxy 即一致）。否则「Vite dev React 子应用可工作」验收会落空，需 POC 覆盖。

**v2 考虑**：实现 qiankun 自己的 HMR 协调层，代理 Vite HMR WebSocket 消息并触发单个子应用的模块重新改写。需要单独 RFC。

### 14. 模块类型 scope 声明

**v1 支持的模块类型**

| 类型 | 支持 | 说明 |
|---|---|---|
| JavaScript modules (`.js`, `.ts`, `.mjs`) | ✅ | 完整 fetch → lexer → rewrite → blob 管线 |
| CSS-as-JS modules（Vite `import './style.css'`） | ✅ | Vite dev server 已转为 JS 模块，走通用管线；DOM 操作通过 proxy `document` 路由到虚拟 head |
| JSON modules (`import data from './data.json' with { type: 'json' }`) | ⚠️ v1 passthrough | 静态 import：走下方「合成 specifier → 原始 URL」passthrough，浏览器原生按 attribute 加载（牺牲实例隔离，`console.warn`）；动态 typed import 见下 |
| WASM modules (`import` of `.wasm`) | ⚠️ v1 passthrough | 同上（静态 typed import 走 passthrough） |
| CSS Module Scripts (`import sheet from './style.css' with { type: 'css' }`) | ⚠️ v1 passthrough | 同上；注意这是**原生 CSS module**，与上一行的 Vite「CSS-as-JS」不是一回事 |

遇到带 import attributes 的 typed module 时，走下方 passthrough；其它真正无法处理的类型输出 `console.warn` 并尽量 passthrough，避免静默失败。

**passthrough 与 import-map 间接层冲突的解法（v1 实现，选 (a)）**

「passthrough 让浏览器原生处理」对**入口 / 被直接 `import()` 的 JS 模块**成立，但对**被其它已改写模块 `import` 的 typed module 不成立**：引用它的模块里该 import 的 specifier 已被改写成合成 specifier、只存在于注入的 import map 中。若 transpiler 对这个 typed module 本身完全不处理，浏览器解析那个**没有 import map 条目的合成 specifier** 会**直接失败**（连带崩溃，而非降级）。

v1 采用 **(a)**：改写器识别带 attributes 的 static import（lexer `imp.a > -1`），**仍把 specifier 改写为合成形式**（`with { type }` 子句紧跟在 specifier span 之后、原样保留），但把该 dep 归入 `typedDeps` 而非 `deps`——engine 对 `typedDeps` **不 fetch/不改写**，只在 import map 里注册「合成 specifier → 原始 URL」。于是浏览器用**原生 JSON/CSS/WASM module 语义**从原始 URL 加载（需子应用 server 提供正确 MIME + CORS）。牺牲这类资源的实例隔离，并 `console.warn`（每 app 一次）。

这条浏览器原生直连路径也无法接收所属 `DocumentModule` 的 credentials：import map 只能映射 URL，不能携带 `RequestInit`。因此 `crossorigin="use-credentials"` 的任务图只保证被引擎 fetch/rewrite 的 JavaScript 模块使用 `include`，typed module 仍按浏览器原生模块请求语义加载。这是当前浏览器机制限制；本 RFC 的 credentials 验收明确不包含 typed module，不为此扩展为另一套 typed-module loader。

- **动态 typed import**（`import('./x.json', { with: { type: 'json' } })`）：v1 **保持原生调用不改写**（改写会引入两参数 `import()` 字面量，触发 babel 的 `importAttributes` 解析限制且需引入语法插件）。绝对 URL 的动态 typed import 可原生工作；**相对 specifier**（相对 blob URL 解析）是 v1 已知限制——请用绝对 URL。改写器用 lexer 的 attributes 位置区分「真 attributes（`{` 开头）」与「尾逗号 `import('x',)`（`imp.a` 也 > -1 但无 `{`）」，后者仍走普通动态 import 改写。

### 15. Source Map

`//# sourceURL=<原始URL>` 只影响 **DevTools Sources 面板的显示名**——它**不修改 `error.stack` 里的 URL**（stack 仍是 `blob:...`），也**不修正行号**（顶部注入了引导行 + 解构 + `__qk_import_meta`，行号整体下移）。

因此：
- **调试**：DevTools 能按原始路径找到文件，但断点行号与源码错位若干行。
- **可观测性（被原 RFC 低估）**：生产环境未捕获错误经 `window.onerror` / 上报 SDK 采集到的 `error.stack` 全是 `blob:<主应用 origin>/<uuid>` 帧，**无法映射回子应用真实文件**。这是 classic 沙箱不存在的退化（见 §7）。
- **行号偏移**：若复用 725 项 `globalsInBrowser` 解构，注入即便压成一行，仍是「引导行 + 大解构 + import_meta」数行；原「约 3-8 行 / ≤10 行」估计需按实际白名单大小重算（见 Acceptance「可观测」项）。

**结论修订**：完整 source map 不再是「未来增强」，而是**生产可观测性的必需项**（至少需把 blob 帧映射回原始 URL + 行号）。v1 若不实现完整 source map，必须文档化「ESM 子应用生产错误栈不可直接定位」这一已知局限，并在 Acceptance 增列对应项。

**既有 `sourceMappingURL` 的处理（本轮修订新增，必须）**

Vite dev 对 TS/JSX 等转换产物普遍附带 `//# sourceMappingURL=`（inline `data:` 或相对路径）。改写后它在两处失效：

1. **行偏移**：顶部插入 N 行后，原 map 的行映射整体错位，DevTools 映射到错误行——比没有 map 更误导；
2. **相对 URL 失效**：相对路径的 map URL 会相对 **blob: URL** 解析 → 直接 404。

处理（推荐 a+b）：
- (a) 相对 map URL **绝对化**（相对原始模块 URL 解析后回写）；
- (b) **行偏移合并**：顶部纯插入场景只需在 map 的 `mappings` 前补 N 个 `;`（source map 规范中每个 `;` 代表一行）。inline `data:` map 解码 → 补 `;` → 重编码即可，成本极低；
- (c) v1 最低限度也要 **strip** 掉既有 sourceMappingURL（避免错位映射误导调试），并文档化。

### 16. 生产 ESM 构建产物（不止 Vite dev）

本 RFC 的目标、示例、验收主要锚定 Vite **dev**（每模块一文件、`/@vite/client`、HMR）。但真实部署是**生产构建**：Vite build 产出经 Rollup 打包的少量 hashed chunk（`index-a1b2c3.js` + 若干 vendor chunk），可能自带 `modulepreload` 链与 `<script type="importmap">`。需明确：

- **复用同一运行时管线**：生产 chunk 同样走 fetch → lexer → rewrite → blob，无需子应用构建期改造（坚持 C3）。
- **自带 importmap 的合并**：生产 HTML 里子应用自带的 `<script type="importmap">` 由 qiankun **自己解析**（§5），其 bare→URL 映射并入 per-app import map；**绝不直接注入主文档**，避免与 §11 运行时 map 冲突。
- **差异点**：无 `/@vite/client`、无 HMR、`modulepreload` 来自构建产物（按 §10.1 处理）；大 chunk 上 always-rewrite 开销被放大，但数量少，总体可接受。
- **`import.meta.url` 用于 worker/wasm 资源定位**在生产更常见，改写正确性要求更高（§3/§6）。

**解决 C3 矛盾**：原 Risks「生产环境推荐构建期预处理」与硬约束 C3 冲突。修订为：**生产同样纯运行时、不需要构建期预处理**；「构建期预处理」仅作为**可选性能优化**（如预生成依赖图清单供 prefetch），非必需、不破坏 C3。需补至少一条生产 ESM 子应用验收。

### 17. ESM Prefetch 策略

qiankun 现有 prefetch（`apis/prefetch.ts`）用 `DOMParser` 解析静态 entry HTML，只能枚举 `script[src]` 与 `link[rel=stylesheet]` 来预热。对 ESM 子应用，HTML 里通常只有**一个** `<script type="module">`——整个 ~270 模块依赖图在静态 HTML 中**不可见**，必须运行 es-module-lexer 递归解析才能发现。因此现有 prefetch 对 ESM **结构性失效**，只能预热 entry 一个文件，Risks「靠 prefetch + LRU 缓解异步瀑布」对 ESM 不成立。

方案（择一并文档化）：
- **(a) 依赖图级 prefetch**：prefetch 阶段对 ESM 子应用运行**轻量 lexer 递归**（只 fetch+parse、不生成 blob），预热依赖图到 fetch 缓存；与 LRU 容量耦合需一并评估（见 Open Q4）。
- **(b) 仅预热 entry**：明确声明 ESM 子应用不享受依赖图级 prefetch，并据此修正「异步瀑布」风险叙述（不能再依赖现有 prefetch）。
- **(c) 构建期清单**：生产可选地由构建产出依赖清单供 prefetch（§16，可选优化，不破坏 C3）。

## Code Changes

| 文件 | 改造内容 |
|---|---|
| `packages/shared/src/assets-transpilers/script.ts` | 增加 ESM 分支检测：`type="module"` → 调用新 `transpileModule()`（`isValidJavaScriptType()` 已识别 `'module'`） |
| `packages/shared/src/assets-transpilers/utils.ts` | `isValidJavaScriptType()` 增加 `'importmap'` 支持，使 `<script type="importmap">` 能进入 transpiler 管线被拦截和解析 |
| `packages/shared/src/assets-transpilers/module.ts` | **新增**：lexer 调用 + 标识符扫描过滤（∩ `globalsInBrowser`、剔除 import 绑定重名、SyntaxError 重试兜底，见 §1）+ 顶部注入（runtime 模块 import 引导）+ specifier 改写为实例级唯一 specifier（不改为 blob URL）+ import.meta rewrite + 既有 sourceMappingURL 绝对化与行偏移合并（§15）+ Blob URL 生成（`type: 'text/javascript'`） |
| `packages/shared/src/assets-transpilers/import-map.ts` | **新增**：per-app import map 解析与查询（仓库现无 importmap 实现） |
| `packages/loader/src/index.ts` | (1) 通过 `nodeTransformer` 把 `<script type="module">` / `<script type="importmap">` 路由到对应 transpiler；(2) 新增 ESM 入口解析分支：`onEntryLoaded` 内当 entry 为 module 时走 `await import(entryBlobUrl)`，绕过 `latestSetProp` |
| `packages/loader/src/writable-dom/index.ts` | **不修改内部**；接入点改为 loader 的 `nodeTransformer`。仅需协同：为 module script 自动生成的 `modulepreload` 在 link transpiler 中改写为 `rel="preload" as="fetch"`（保留浏览器预热时机、经 preload cache 被管线 `fetch()` 复用，与 classic 路径同一手法，见 §10.1） |
| `packages/qiankun/src/core/loadApp.ts` | ESM 入口生命周期接入：从 ESM 入口分支拿到 `{bootstrap, mount, unmount}` 接入 single-spa（classic 路径不动） |
| `packages/qiankun/src/apis/registerMicroApps.ts` | 无需预热 lexer；纯 JS 入口同步可用 |
| `packages/sandbox/src/core/globals.ts` | **复用**现有 `globalsInBrowser`（725 项）作为 ESM 顶部解构白名单**基集**（实际解构集按模块扫描过滤，见 §1）；静态剔除值类型/getter 语义属性项。**不新建** `membrane/globals.ts`（原 RFC 的 30 项手维护列表是倒退） |
| `packages/sandbox/src/core/membrane/index.ts` | get/has/getOwnPropertyDescriptor/ownKeys 四 trap 对 `__qk_*` 内部 key 一致黑名单屏蔽（复用 `esmInternalPrefix` 单一常量，纵深防越权）；`createMembraneTarget` **跳过 `__qk_*` 拷贝**，使屏蔽对第 2+ 实例仍生效（见 §1 / Open Q7） |
| `packages/sandbox/src/core/compartment/index.ts` | `getEsmGlobalsView()` 暴露同一 Membrane-backed `globalThis`，并以 `import()` / `load()` / `importDocumentModules()` 统一承接模块门面 |
| `packages/sandbox/src/core/esm-globals.ts` | **新增**（独立于生成文件 `globals.ts`）：`esmDestructurableGlobals` = `globalsInBrowser` ∪ sandbox intrinsics − 值类型/getter 语义项（解构快照无法表达）作为解构基集 |
| `packages/shared/src/module-resolver/index.ts` | 复用现有 URL/dependencymap 匹配（v1 仅复用**网络响应**，不跨实例共享 blob，见 §11）；按 §2 的“先解析为绝对 URL 再询问 module-resolver”衔接（engine 经注入的 `moduleResolver` 调用） |
| `packages/shared/src/esm-sandbox/import-map-registry.ts` | **新增**：运行时 import map 管理——全局去重注入 `<script type="importmap">` 到主文档、first-wins 冲突显式 `console.error`、追加动态 import 条目（§11） |
| `packages/shared/src/esm-sandbox/instance-registry.ts` | **新增**：per-copy 随机 accessorKey + `token → instance view` 私有 map；返回 `{ accessorKey, token }` 供 engine 内联进 runtime blob（§1 安全） |
| `packages/shared/src/esm-sandbox/engine.ts` | **新增**：Compartment 背后的机制层——模块图并行 fetch + hook memoize、redeclaration probe、文档序求值 + 入口选取、动态 import 管线、typed import passthrough、credentials、`dispose` 全 blob 回收（§1–§8/§14） |
| `packages/shared/src/esm-sandbox/{rewrite,identifier-scan,import-bindings,source-map,lexer,vite-client-stub}.ts` | **新增**：改写、按需过滤扫描、import 绑定解析（含注释剥离）、sourceMappingURL 偏移合并、CSP-safe 纯 JS lexer、`/@vite/client` 桩（§1–§4/§10/§13/§15） |
| `packages/shared/src/fetch-utils/makeFetchCacheable.ts` | 缓存键使用「规范化 Request URL + 最终生效 credentials」；`init.credentials` 优先于 `Request.credentials`，默认值与显式 `same-origin` 共享缓存，`include`/`omit` 分区，避免跨凭据复用响应 |

Compartment Alignment RFC 落地后，classic 与 ESM 共用同一个 Compartment 门面；`EsmSandboxEngine` 仅作为 shared 内部机制存在，不再出现在 loader 跨包接口中。sandbox barrel 同步导出 module hook / descriptor 与 IsolationPlugin 的公开类型。

新增 dependency：[`es-module-lexer`](https://www.npmjs.com/package/es-module-lexer)（MIT；使用 CSP-safe 的 `/js` 入口）。

## Acceptance Criteria

### 必须满足

- [ ] Vite dev 模式 Vue 子应用可作为 qiankun 子应用 mount/unmount/remount，业务功能正常
- [ ] Vite dev 模式 React 子应用同上
- [ ] 子应用源码 **零修改**（除生命周期 export，与 classic 子应用对等）
- [ ] 子应用 `console.log(import.meta.url)` 输出原始 URL，不是 blob URL
- [ ] 子应用 `window.foo = 1` 后 unmount，主应用 `window.foo === undefined`（Membrane 清理生效）
- [ ] 子应用顶层 `await fetch(...)`（TLA）正常工作
- [ ] 子应用循环依赖正常解析
- [ ] 验证在多个 ESM 子应用并发加载场景下，通过 **实例级唯一 specifier 前缀** 确保模块解析不冲突
- [ ] 同一 app `mount → unmount → mount` 循环 100 次无 blob URL / 内存泄漏（除业务自身保留的引用）
- [ ] 两个子应用同时使用 `vue@3.4.x`，`module-resolver` 复用同一份**网络响应**（fetch LRU 命中一次），但各自持有独立 blob 与 module namespace，互不串实例（namespace 级共享为 v2，见 §11）
- [ ] 两个子应用私有依赖解析到同一个外部 URL 时，实例级唯一 specifier 仍会解析到各自的 blob URL，不会串到对方实例
- [ ] classic script 与 module script 混合的子应用同样工作
- [ ] HTML 中的 `<script type="importmap">` 被 qiankun 解析并应用，不注入主文档，也不会与其他子应用的 import map 合并产生冲突
- [ ] 现有 classic script 子应用行为**完全不变**（回归测试通过）
- [ ] **ESM 入口模块图中任一模块抛错 / TLA reject 时，错误经 single-spa `addErrorHandler` 上抛**，不静默丢失、不产生 unhandledrejection
- [ ] **加载未完成即 unmount**：不发生 mount-after-unmount，无悬挂 fetch（in-flight 请求被 abort）
- [ ] **入口模块 TLA 永不 resolve 时**，加载在 timeout 内失败而非永久挂起
- [ ] **Vite CSS-as-JS（及顶层 DOM 副作用）子应用：remount 后样式仍在**
- [ ] **同一 app 两个实例并发加载**，各自动态创建的 `<style>` 互不串容器（dynamicAppend 归属正确）
- [ ] **同一 app `unload → reload` 循环 N 次**：import map 死条目增长在文档化上限内 / 触发整图重置；无解析到退休 blob 的错误（区别于「mount→unmount→mount」remount 循环）
- [ ] **白名单外裸全局调用**的清理行为符合文档化预期（默认覆盖 / 已知逃逸，二选一并验证）
- [ ] **Vite dev React 子应用**：`@vitejs/plugin-react` preamble 不抛 "can't detect preamble"，组件正常渲染
- [ ] **生产 ESM 构建产物**（hashed chunks + 自带 importmap）子应用可正常 mount/unmount/remount
- [ ] **Firefox（或目标旧浏览器）经 es-module-shims 路径**可正常加载 ESM 子应用
- [ ] JS 错误的 `error.stack` 可经 source map 映射回子应用原始文件（若 v1 不实现完整 source map，则文档化该局限并标注此项为已知不满足）
- [ ] **顶层声明/导入与白名单重名**（如 `const history = ...`、`import { location } from ...`）的模块可正常加载（重名剔除 / SyntaxError 重试生效），且该标识符语义正确（引用本地绑定）
- [ ] **主应用 CSP 不含 `'unsafe-eval'`**（仅 `script-src blob:` 等）时，ESM 子应用可正常加载（注入引导零 eval，见 §1）
- [ ] 携带 inline / 相对路径 `sourceMappingURL` 的 Vite dev 模块，改写后 DevTools 行映射正确（偏移合并生效）或已 strip（不出现错位映射，见 §15）

### 性能

- [ ] qiankun 启动开销增加 ≤ 50ms（纯 JS lexer 无异步初始化）
- [ ] 单个 module 改写开销 ≤ 5ms（典型业务模块体量；含标识符扫描过滤——实测基线 ~34µs/模块，见 §1）
- [ ] remount 第二次起，在未 unload 的同一实例内复用 blob URL，mount 耗时 ≤ 首次 50%

### 可观测

- [ ] 改写后代码在 DevTools Sources 面板显示为原始 URL（通过 `sourceURL`）
- [ ] 行号偏移按实际注入行数文档化（按需过滤后为 runtime import 行 + 解构行（p50=3 项）+ `__qk_import_meta` 声明，约 3~5 行；不承诺固定值）
- [ ] 明确 `//# sourceURL` 只改 DevTools 显示名、不改 `error.stack` URL 与行号；生产可定位依赖完整 source map（见 §15）

## Risks and Mitigations

| 风险 | 缓解 |
|---|---|
| Globals 白名单不完整，新 Web API 逃逸 | 文档化限制；通过应用配置的 `extraGlobals` 提供值或描述符 |
| 裸全局函数调用（`addEventListener` 等）逃逸，与 classic 沙箱 `with(proxy)` 存在能力差异 | 扩充白名单覆盖 `Window` interface 常用方法；文档化差异；考虑提供 lint 规则 |
| `(0, eval)('globalThis')` 等间接渠道逃逸 | 已知 JS 沙箱固有问题，与 classic 同病，不解决 |
| 固定、可猜的 globals view 访问器会暴露跨应用访问接口 | 已采用每副本随机 key + 每实例不可猜 token，并由 membrane 对内部前缀做纵深屏蔽 |
| `loadMicroApp` 多实例场景 | **设计修正**：所有模块 specifier 必须强制加入实例唯一前缀（如 `__qk_<appId>_<instanceId>__/...`）以在全局 import map 中实现隔离。 |
| Worker / Service Worker 不沙箱化 | v1 明确不支持，文档化；后续迭代用 runtime 拦截 `Worker` 构造函数 |
| 行号偏移影响调试 | `sourceURL` 缓解；v1.x 加完整 source map |
| 首屏依赖加载是异步瀑布 | 并行 fetch + Blob URL 缓存 + 全局 LRU；生产环境推荐构建期预处理 |
| CSP 需要 `script-src blob:` | 文档化要求 |
| ESM module 顶层只执行一次（remount 复用） | 文档化语义差异；提供迁移指南 |
| `import.meta.resolve` 识别需额外 lexer 规则 | 采用 runtime 方案：`__qk_import_meta.resolve = (s) => __qk_resolve(appId, s)`，避免编译期识别 |
| 改写后字节体积增加 | 以 §1 按需过滤为前提，顶部注入 ≈ 200~400 字节/模块（p50=3 项解构）；若全量注入 725 项则 ~11KB/模块、270 模块 ≈ 3MB，不可接受 → 过滤为必需 |
| Blob 创建时 MIME type 缺失 | 必须指定 `new Blob([code], { type: 'text/javascript' })`，否则浏览器拒绝执行 module script |
| Import map 冲突导致模块解析失败 | **核心风险**：由于 import map 无法删除且冲突条目会被丢弃，长期运行或热更新可能导致 specifier 冲突。**对策**：app-private specifier 必须包含 instanceId；shared specifier（v2 引入 namespace 级共享后）必须由 qiankun registry 统一分配。 |
| Import map 条目无法清理 | 子应用 unload 后死条目积累，但仅为纯字符串，内存影响极小；blob URL 可正常 revoke；重新加载时分配新的 instanceId，避免命中旧条目 |
| Vite dev URL 查询参数影响缓存 | Vite `?t=` 参数（HMR 时间戳）和 `?v=` 参数（预构建 hash）需保留在缓存 key 中，确保版本正确性 |
| 运行时 import map 需要多 import map 浏览器支持 | Chrome/Edge 133+、Safari/iOS Safari 18.4+；Firefox 150 branch 已实现但默认关闭。Firefox 与旧浏览器必须 fallback 到 es-module-shims |
| **注入模板 TDZ / CSP `unsafe-eval`（已修复）** | 引导曾先后采用 `globalThis.__qk_realm(...)`（同名 const TDZ，每模块首行 ReferenceError）与 `(0,eval)('globalThis')`（要求 CSP `unsafe-eval`，生产 shell 常不满足）。现改为 runtime 模块 import 引导：import 绑定先于模块体初始化（构造上无 TDZ）、零 eval（§1） |
| **注入解构与顶层声明/导入重名 → SyntaxError** | `const history = ...` 等常见写法会砖掉整个模块图。按需过滤缩小碰撞面（p50=3 项）+ import 绑定名剔除 + SyntaxError 捕获重试兜底（§1） |
| **共享 blob 烘焙 realm 绑定** | 跨实例复用改写产物会让 B 应用经 A 的 proxy 操作 DOM、并持有 A 已清理的 realm。v1 收缩为 source 级共享（与 classic 语义对齐）；namespace 级共享为 v2 前置课题（§11、Open Q9） |
| **既有 sourceMappingURL 错位 / 404** | 顶部插行使原 map 行映射错位；相对 map URL 相对 blob 解析 404。绝对化 + `mappings` 前补 `;` 偏移合并，或至少 strip（§15） |
| **strict-mode 隐式全局「写」差异** | ESM 下裸 `foo = 1` 抛 ReferenceError（classic 写入 proxy）。文档化差异；迁移指南要求显式 `window.` 前缀或声明（§1、Migration） |
| **realm 访问器跨应用越权** | 裸 `__qk_realm(...)` 不经 proxy、屏蔽只挡 `globalThis.__qk_realm`；且拷贝 non-configurable 全局使屏蔽从第 2 个 app 起失效。**v1 已修**：随机 key + 不可猜 token（token 仅内联在实例自身 runtime blob），屏蔽降为纵深且不再拷贝 `__qk_*`（§1、Open Q7） |
| **CSS-as-JS / 顶层副作用 remount 后丢失** | remount 顶层不重跑 + 卸载清空虚拟 head → 样式永久消失。POC 选定 rebuildCSSRules 恢复 / remount 重求值例外（§6、§8） |
| **错误传播与可观测性退化** | `await import` reject 需手动 plumb 回 single-spa；blob 帧无法定位。补错误分支 + 完整 source map（§7、§15） |
| **快速 unmount 无 abort** | in-flight fetch 悬挂、mount-after-unmount。per-load AbortController + import timeout（§8） |
| **异步求值下元素归属错配** | `__currentLockingSandbox__` 的同步单 sandbox 假设在并发 ESM 下失效。改为基于 proxy document 身份归属（§8） |
| **Prefetch 对 ESM 失效** | 静态 HTML 只见 entry，~270 模块图发现不了。补 ESM prefetch 策略或声明仅预热 entry（见「ESM Prefetch 策略」） |
| **Trusted Types 拦截 createObjectURL / importmap 注入** | `require-trusted-types-for 'script'` 下 blob→script、字符串→importmap 被 TT sink 拦截。需 qiankun 专用 TrustedTypePolicy 或声明不兼容（Migration CSP） |
| **生产 ESM 路径与 C3 矛盾** | 「生产推荐构建期预处理」违反 C3「不依赖构建期改造」。明确生产复用同一运行时管线（见「生产 ESM 构建产物」） |

### 第三轮（v1 实现 + code review）新增/修复项

| 风险 | 缓解（v1 已实现，除非注明） |
|---|---|
| **realm 访问器越权（三条路径）** | 裸标识符 / proxy 透传 / classic `with` 三路均可达真实全局访问器。**已修**：随机 key + 不可猜 token（§1、Open Q7） |
| **多 qiankun 副本抢占单例 `__qk_realm` → 第二副本 `rt` undefined 崩溃** | **已修**：随机 key 每副本私有，各自 `token→realm` map，不再单例（§1） |
| **`dispose` 从未调用 → realm/blob 泄漏、退休 realm 可达** | **已修**：`dispose` 覆盖全部 blob（含 inline/rebuilt）+ unregister realm，接入 single-spa `unload`；`loadMicroApp` parcel 无 unload 为已知限制（§8） |
| **classic app 混入非 entry module script 被 ESM 引擎劫持入口 / 失败炸全 app** | **已修**：无显式 entry 时按生命周期 namespace 选取、非入口失败只 warn、loadApp 二次回落 latestSetProp（§7） |
| **多 module 入口非末位选错 namespace** | **已修**：优先选含生命周期导出的 namespace，而非「最后一个」（§7） |
| **`export default { bootstrap, mount, unmount }` 生命周期不识别** | **已修**：`getLifecyclesFromExports` 增加 default 兜底（§7） |
| **typed import（JSON/CSS/WASM）当 JS 硬崩** | **已修**：static typed import 走 §14 (a) passthrough（合成 specifier → 原始 URL，保留 `with` 子句）；dynamic typed import 保持原生（相对 specifier、无法继承 document graph credentials 均为已知限制）（§14） |
| **动态 import 用 `indexOf('(')` 被注释 `import/*(*/(x)` 击穿 / 尾逗号 `import('x',)` 双逗号 SyntaxError** | **已修**：用 lexer `imp.d` 精确定位括号、整体覆盖 `[ss,se)` 并 trim 尾逗号（§2/§4） |
| **import 语句内注释里的全局名被误当绑定剔除 → 逃逸** | **已修**：`parseImportBindings` 剥离注释，字符串优先保护 URL 里的 `//`（§1 防护 2） |
| **importmap sentinel 重入 → `JSON.parse(注释)` 报错** | **已修**：`consumeImportMapScript` 按 `dataset.consumed` 幂等（§5） |
| **redeclaration probe 120 字窗口漏检 → flush 后不可修的 SyntaxError** | **已修**：改为「解构集非空 ∧ 含声明关键字」不漏检（§1 防护 3/4） |
| **cross-origin `use-credentials` 子应用 fetch 丢 cookie / 并发图串用响应** | **已修**：`transpileModuleScript` 把 `crossorigin` 绑定到每个 document task，JS 静态依赖与普通动态 import 图沿不可变上下文加载；每个上下文使用独立 runtime bridge，engine 模块缓存和 `makeFetchCacheable` 都按 credentials 分区（§8）。typed module 原生直连不在此保证内（§14）；**SRI `integrity` 逐模块校验**仍为已知限制（动态发现的模块图无法从 HTML 拿到各自 integrity） |
| **动态 import 运行时追加 import map 在非最新浏览器失效** | **仍为已知限制**：Chrome 133+/Safari 18.4+ 支持运行时多 import map；Firefox、Safari<18.4、Chrome<133 需 **es-module-shims** 基座——v1 **未内置**，代码/浏览器兼容表已声明，作为独立工作项（§11） |

## Alternatives Considered

| 方案 | 否决理由 |
|---|---|
| **iframe / Wujie 风格 realm** | 用户明确不接受 iframe 方向；与 qiankun 现有 DOM 模型差异大 |
| **ShadowRealm / SES** | 浏览器支持度低；与 qiankun DOM 共享模型不兼容 |
| **完全自定义 module loader（自己实现 loader 语义）** | 若**连依赖图/TLA/循环依赖语义都自己写**，工程量极大且易出语义偏差。但需澄清：本方案「改写 specifier + import map + blob」本身已是一种「保留原生 loader 的自定义 loader」，故此否决仅针对「连 loader 语义都自实现」，不应被读成「任何运行时接管都不可取」（见下行 es-module-shims） |
| **基于 es-module-shims（作为基座）** | es-module-shims 已实现 fetch+lexer+rewrite-to-blob、import-map 管理、import.meta 改写、动态 import、`revokeBlobURLs`，并提供 `resolve`/`fetch`/`source`/`meta` 等 hook，天然支持 Firefox/旧浏览器。**本 RFC 应将其作为候选基座正式评估**（用 hook 注入顶部解构 + 映射 specifier），而非仅当 Firefox fallback。权衡需基于事实：① **循环依赖 live-binding**——它用 shell module 打破循环，官方文档承认「循环中首个未执行父模块 live binding 失效」，与本方案「零语义损失」目标冲突（这也正是「跳板模块」被否决的理由）；② 依赖面/控制权/包体积。不能以「会丢循环依赖/工程量」一句否决「自定义 loader」却不评估这个最成熟的实现 |
| **QuickJS / Boa WASM JS engine** | 性能差 1~2 个数量级；DOM 桥需自实现；体积大 |
| **swc-wasm / oxc-wasm 做完整 AST** | 体积 +500KB~2MB；解析慢；本方案需求只需 lexer 级别即可 |
| **构建期插件改写** | 违背"运行时支持"约束；不能解决 Vite dev 场景 |
| **Service Worker 重写** | 受限于 SW 注册时机和 scope；与 qiankun 流式加载机制冲突 |
| **保留 `with(proxy)` + 顶部注入双保险** | `with` 在 ESM 是 SyntaxError，根本不可行 |
| **直接改写 specifier 为 blob URL（不用 import map）** | 循环依赖死锁：A 的 blob URL 生成需要 B 的 blob URL，B 的 blob URL 生成需要 A 的 blob URL → 互相等待。其他打破循环的方案（动态 import 替换循环边、跳板模块 + TLA re-export、模块注册表）均会破坏 ESM 语义（live binding / static linking / evaluation order） |

## Migration Path

### 对子应用开发者

1. 把模块顶层的全局状态初始化迁移到 `mount()` 函数内（避免 remount 时顶层不重跑导致的状态陈旧）。
2. **检查隐式全局**：ESM 强制 strict mode，裸 `foo = 1`（无 `var`/`window.`）会**抛 ReferenceError**（classic 下会被沙箱捕获）。改为显式声明或 `window.foo = 1`。
3. 检查是否使用 Web Worker（v1 不支持，需等待迭代或暂时不沙箱化）。
4. 检查 CSP，确保允许 `script-src blob:`（详见下方完整 CSP 要求）；若主应用强制 Trusted Types，见 CSP 表的 TT 行。
5. **Vite dev 模式**：HMR 在 qiankun 沙箱内被**主动禁用**（见 §13，避免破坏性整页 reload），修改代码后需手动刷新。子应用功能本身正常运行。

**CORS / Origin 说明**

Blob URL 继承**创建者**（主应用）的 origin，而非子应用原始 origin。这意味着：

- 子应用代码中 `fetch('/api/data')` 会请求**主应用的 server**，而非子应用 server。子应用应使用绝对 URL 调用自己的 API（如 `fetch('https://sub-app.example.com/api/data')`）。
- 子应用 server 必须配置 CORS 允许主应用 origin（`Access-Control-Allow-Origin: https://main-app.example.com`），否则 qiankun 无法 fetch 子应用的 JS/CSS 资源。
- `document.cookie`、`localStorage`、`sessionStorage` 访问的是**主应用 origin** 的存储，而非子应用 origin 的。

> 注：这不是 ESM 沙箱引入的新问题——当前 classic script 沙箱也是同样的行为（子应用代码在主应用 document 中执行）。但 ESM 子应用开发者可能之前没有意识到这一点，因此在此显式说明。

**完整 CSP 要求**

如果主应用启用了 Content Security Policy，需要确保以下指令：

| CSP 指令 | 要求 | 原因 |
|---|---|---|
| `script-src` | 包含 `blob:` | 执行改写后的 blob URL 模块 |
| `script-src` | **无需** `'unsafe-eval'` | 注入引导经 runtime 模块 import 而非间接 eval（§1）；子应用代码自身使用 eval 则另当别论 |
| `connect-src` | 包含子应用 origin（如 `https://sub-app.example.com`） | 主应用 origin 的代码 fetch 子应用资源；跨域子应用 server 需 CORS 允许主应用 origin。若子应用入口 `<script type="module" crossorigin="use-credentials">` 依赖 cookie，qiankun 会以 `credentials: 'include'` fetch 其 JavaScript 静态依赖与普通动态 import 图，server 还需 `Access-Control-Allow-Credentials: true`（§8）；typed module 为 §14 所述浏览器直连例外 |
| `style-src` | 包含 `'unsafe-inline'`（如果子应用动态创建 style） | Vite CSS-as-JS 模块通过 `style.textContent` 注入样式 |
| `worker-src` | 包含 `blob:`（如果子应用创建 Worker） | v1 scope 外，但提前配置可避免未来问题 |
| `require-trusted-types-for` / `trusted-types` | 若主应用强制 Trusted Types，需为 qiankun 配置专用 `TrustedTypePolicy`（`createScriptURL` 包装 blob URL、`createHTML`/`createScript` 包装注入的 importmap）；或声明 v1 不兼容 TT 强制模式 | ESM 管线「字符串源码 → blob → 当脚本执行」+ 字符串注入 `<script type=importmap>` 正是 TT 设计要管控的 string-to-script sink |

### 对 qiankun 主应用开发者

无需修改既有注册代码。需要补充应用私有 globals 时，可在应用配置中使用新增选项：

```ts
loadMicroApp(
  { name: 'reporting', entry: '//localhost:7100', container: '#container' },
  {
    extraGlobals: {
      MyCustomGlobal: createCustomGlobal(),
    },
  },
);
```

### 对现有 classic 子应用

行为完全不变。回归测试覆盖。

## Open Questions

1. **`__qk_import_meta.resolve` 是否需要支持 fallback 到浏览器原生 `import.meta.resolve`？** —— 后者要求 baseURL 必须是当前模块 URL，但 qiankun 内部已用 blob URL 加载，原生 resolve 可能给出 blob URL。倾向：完全自实现，不 fallback。
2. **是否提供 `disableEsmSandbox` 全局开关用于排查？** —— 倾向：是，作为 escape hatch。
3. **Vite HMR 是否支持？** —— v1 范围外。Vite HMR 走 WebSocket + 模块热替换，与本方案的"复用 blob URL"语义直接冲突。需要单独 RFC。v1 提供 `import.meta.hot` noop stub 保证不报错（见 §13）。
4. **全局 fetch LRU 缓存容量是否足够？** —— `makeFetchCacheable` 当前全局 LRU 容量为 50。**单个**中等规模 Vite dev 子应用即有 ~270 模块，**已远超 50**——不必等「多应用并发」就会频繁淘汰（原表述把风险归因于多应用并发，定位偏了）。§17 的依赖图级 prefetch 会进一步加压。选项：(a) 为 ESM 模块 fetch 使用独立的更大缓存（按子应用模块量级，如 ≥512）；(b) 提高全局 LRU 容量；(c) v1 先观察命中率。倾向 **(a)**（独立大缓存），而非沿用 50。
5. **§12 集成架构方案选择（v1 阻塞决策，不可挂起）** —— 方案 C（移除 + 异步插入）需 POC 验证在 writable-dom 流式管线中的可行性。**修正**：多个动态插入的 module script **设 `async=false` 即由 HTML 规范保证按插入序执行**（与 classic 同机制，option B/C 均适用），并非 C 独有优势；option B 因此不应被「需验证是否在所有浏览器触发执行」低估。真正待验证的是占位/重插与 entry-script onload 钩子、defer 队列的交互。**此项必须在实现前定稿**。
6. **`loadMicroApp` 多实例是否在 v1 scope 内？** —— 同一子应用加载两次时，不同实例通过 **实例唯一 specifier 前缀** 实现在全局 import map 中的隔离。
7. **realm 访问器的安全性（v1 已实现，结论较第二轮修正）** —— 第二轮曾定为「membrane get-trap 黑名单屏蔽 `__qk_*`」+ 固定单例 `__qk_realm`。**code review 推翻了「屏蔽足够」**：改写模块跑在真实全局作用域，裸 `__qk_realm(...)` 直达真实全局、**不经 proxy**，屏蔽只挡 `globalThis.__qk_realm`；且 `createMembraneTarget` 拷贝 non-configurable 全局属性会让屏蔽从第二个应用起失效。**v1 最终方案**：访问器改为**每副本随机 key** `globalThis['__qk_r_<random>']` + 按**不可猜 token** 索引（token 仅内联在该实例 runtime blob 源码里，改写器拒绝业务代码 import `__qk_*` specifier）——即便拿到真全局也无从命名访问器、无从提供他人 token。membrane 屏蔽保留为纵深（且 `createMembraneTarget` 不再拷贝 `__qk_*`，复用 `esmInternalPrefix` 单一常量）。详见 §1「安全（v1 实现）」。随机 key 每副本私有，顺带解决多 qiankun 副本抢占单例崩溃。
8. **运行时 import map 是否违反"不把子应用 import map 注入主文档"的约束？** —— **已解决**：注入的是 qiankun 运行时用于 URL -> Blob 映射的 import map。由于 import map 是文档级单例且合并冲突时“先到先得”，我们必须通过 specifier 唯一化（Prefixing）来避免不同应用、不同实例间的 specifier 碰撞。
9. **v2 namespace 级共享模块的 realm 语义** —— 共享 blob 的顶部注入只能绑定一个 realm：绑定「中立 realm（真实全局）」会让共享模块的 DOM 副作用绕过 dynamicAppend 归属；「动态归属当前活跃实例」又落回 §8 的异步归属难题。v1 已收缩为 source 级共享规避（§11）；v2 若要真单例共享，需连同跨实例引用计数（§8）单独设计并评审。

## References

- [es-module-lexer](https://github.com/guybedford/es-module-lexer) - Guy Bedford 的 JavaScript module lexer（qiankun 使用 CSP-safe `/js` 入口）
- [es-module-shims](https://github.com/guybedford/es-module-shims) - 同作者的 module shim，灵感来源
- [ECMA-262 §16.2.1.6.2 ParseModule](https://tc39.es/ecma262/#sec-parsemodule)
- [ECMA-262 §11.2.2 Strict Mode Code](https://tc39.es/ecma262/#sec-strict-mode-code)
- [ECMA-262 §14.11.1 With Statement Early Errors](https://tc39.es/ecma262/#sec-with-statement-static-semantics-early-errors)
- [HTML Spec: Import Maps](https://html.spec.whatwg.org/multipage/webappapis.html#import-maps)
- qiankun v3 Roadmap: https://github.com/umijs/qiankun/discussions/1378
