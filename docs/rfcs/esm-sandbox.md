# RFC: ESM Sandbox for qiankun

- **Status**: Draft
- **Author**: qiankun maintainers
- **Created**: 2026-04-18
- **Target Release**: qiankun v3.x
- **Tracking Issue**: TBD
- **Last Revision**: 2026-06-09（依据深度 review 修订：修复注入模板 TDZ blocker、白名单复用现有 `globalsInBrowser`、`__qk_realm` 安全模型、Vite dev 真实性、改写 offset 管理、错误可观测性、生产 ESM 构建产物、Trusted Types、prefetch 等）

## Summary

为 qiankun 增加对原生 ESM 子应用（尤其是 Vite dev 模式）的沙箱支持，在保持 qiankun JS 沙箱语义的前提下，让子应用开发者视角维持原生 ESM。

技术路径：**运行时改写（runtime rewrite）+ WASM lexer + 复用现有 Membrane**。**不引入 iframe**。

## Motivation

### 问题

qiankun 当前的 JS 沙箱实现基于 classic script 执行模型：

- 通过 `Compartment.makeEvaluateFactory()` 用 `with(this) { ... }` 包裹脚本源码
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
- **C5 性能可控**：通过 WASM lexer（首选 [`es-module-lexer`](https://github.com/guybedford/es-module-lexer)）保证改写开销可接受。

## Design Overview

### 核心管线

```
qiankun.start()  (packages/qiankun/src/apis/registerMicroApps.ts)
    └─ await esModuleLexer.init()    // 预加载 WASM lexer（在公共 start 入口完成）

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
    │   ├─ 顶部注入 globals 与 import.meta（引导行用别名 __qk_root 取 realm，避免 TDZ，见 §1）：
    │   │     const __qk_root = (0, eval)('globalThis')
    │   │     const { window, document, location, ... } = __qk_root.__qk_realm('app-a')
    │   │     const __qk_import_meta = { url: '<原始URL>', resolve: (s) => __qk_root.__qk_resolve('app-a', s) }
    │   ├─ 改写 specifier：bare specifier / 相对路径 → 实例级唯一标识（不改为 blob URL）
    │   ├─ 改写 import.meta → __qk_import_meta
    │   ├─ 改写 import(x) → __qk_dynamic_import(x, __qk_import_meta.url)
    │   ├─ 追加 //# sourceURL=<原始URL>
    │   └─ 生成 Blob URL（type: 'text/javascript'），缓存（key: instanceId + 原始 URL，引用计数 +1）
    │
    ├─ Import Map 注入（新增，见 §11）
    │   所有模块 blob URL 就绪后，构建全局 import map：
    │   将实例级唯一 specifier 映射到最终 blob URL。
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
// 顶部注入 —— WASM lexer 定位首个非注释位置后插入
// ⚠️ 引导行用别名 __qk_root 取 realm，绝不能用 globalThis/window/self，否则会命中下方 const 解构同名绑定的 TDZ（见 §1 Blocker）
const __qk_root = (0, eval)('globalThis');
const { window, document, location, history, navigator,
        fetch, XMLHttpRequest, WebSocket,
        setTimeout, setInterval, clearTimeout, clearInterval,
        requestAnimationFrame, cancelAnimationFrame,
        localStorage, sessionStorage, console,
        /* ...基集复用 packages/sandbox/src/core/globals.ts 的 globalsInBrowser（725 项），见 §1 */
      } = __qk_root.__qk_realm('app-a');

const __qk_import_meta = {
  url: 'https://app-a.host/main.js',
  resolve: (s) => __qk_root.__qk_resolve('app-a', s),
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

**采用方案：顶部 destructuring 注入 globals**

每个被改写的 ES module，在源码顶部插入（**注意引导行的 TDZ 陷阱，见下**）：

```js
// 引导行：用不在解构集内的别名取 realm
const __qk_root = (0, eval)('globalThis');
const { window, document, location, globalThis, self, /* ... */ } = __qk_root.__qk_realm(appId);
```

借助 ES 的 lexical scoping，这些标识符在该 module 内会**遮蔽**全局同名标识符。模块内任何裸 `window`、`document` 引用都会指向 Membrane 包装的 proxy。

**⚠️ Blocker：引导行绝不能用 `globalThis`/`window`/`self` 作为取 realm 的对象**

如果写成 `const { window, globalThis, ... } = globalThis.__qk_realm(appId)`，右侧的 `globalThis` 会解析到正被 `const` 声明的**同名词法绑定**。该绑定在整条 `LexicalBinding` 求值期间处于 TDZ（[ECMA-262 §13.3.1](https://tc39.es/ecma262/#sec-let-and-const-declarations)，Initializer 先于 BindingInitialization 求值），于是**每个被改写模块的第一行就抛 `ReferenceError: Cannot access 'globalThis' before initialization`**——整个 ESM 沙箱特性不可用。`window`/`self` 同理（一旦它们被用作右侧取用对象）。

因此引导行必须：
- 先声明一个**不在解构集内**的别名 `const __qk_root = (0, eval)('globalThis')`（间接 eval 取真实 global，且 `__qk_root` 不会被任何子应用标识符遮蔽）；
- 再 `const { ... } = __qk_root.__qk_realm(appId)`。

`__qk_root` 同时用于 `__qk_import_meta.resolve`、`__qk_dynamic_import` 的取用，避免它们经被屏蔽的 proxy globalThis（见下方「安全」）。

**白名单：复用现有 `globalsInBrowser`，而非新建手维护列表**

仓库已存在 `packages/sandbox/src/core/globals.ts`，其中 `globalsInBrowser` 是由 [sindresorhus/globals](https://github.com/sindresorhus/globals) 生成的 **725 项**完整浏览器全局列表（含 `addEventListener`/`removeEventListener`/`getComputedStyle`/`matchMedia`/`dispatchEvent`/`queueMicrotask`/`structuredClone`/`Event`/`CustomEvent`/`URL`/`atob`/`btoa`/`open` 等），classic 沙箱的 Membrane 已在用它。ESM 顶部解构应**直接复用这份列表作为基集**，而不是新建一份仅 ~30 项的 `membrane/globals.ts`（那等于在更优资产上倒退）。

实现要点：
- 从 `globalsInBrowser` 中**剔除不可作为标识符安全解构的项**（如 `innerWidth`、`length`、`name`、`top` 这类 getter-only / 与本地常用名易冲突的属性），保留可注入解构的标识符集合；
- 通过 `createRealmView(appId)` 返回 `{ [k]: membrane.realmGlobal[k] }`，解构即拿到对应 proxy 视图；
- v1.1 提供 `extraGlobals: string[]` 兜底极少数新增 / 属性型全局。

**与 classic `with(proxy)` 的能力差异（真实但已大幅收敛）**

- `with(proxy)` 能拦截**所有**裸标识符；顶部解构只能拦截**解构集内**的标识符。复用 725 项后差距很小，但仍非完全等价：白名单外的新 Web API 裸调用会逃逸、无法在 unmount 时清理。缓解：扩充白名单 + `extraGlobals` + 可选 lint 规则。（原 RFC 把 `addEventListener` 等列为「逃逸」是基于「只解构 30 项」的假设；复用 725 项后这些**默认已覆盖**。）
- **strict-mode 隐式全局「写」差异（重要，必须文档化）**：classic `with(proxy)` 下 `foo = 1`（无 `var`/`window.` 前缀）会写到 proxy；但 ESM 模块强制 strict mode，无声明的 `foo = 1` **直接抛 `ReferenceError`**，而非写入 proxy。依赖隐式全局的老代码在 ESM 子应用里会**报错而非被沙箱捕获**。注意这与下文「写入走 set trap 可清理」**并不矛盾**：set trap 只覆盖 `window.foo = 1` 这类**经 proxy 的属性写**；裸 `foo = 1` 在 strict mode 下根本到不了 set trap。迁移指南需明确这一点。
- 通过 `(0, eval)('globalThis')`、`Function('return this')()` 等间接渠道仍能拿到真 globalThis。这是 JS 沙箱固有问题，与 classic 同病，不在本 RFC 解决范围。
- **`const` 解构是快照，非 live binding**：对 `window`、`document` 等引用稳定的对象，解构拿到 proxy 本身，后续属性访问仍是 live 的（`document.title` 始终走 proxy getter）。但无法对某个标识符做「整体替换」式虚拟化（如让不同子应用看到不同的 `location` 对象）。当前 classic sandbox 也不虚拟化 `location`，故这是**一致的限制**，但需在此显式声明以避免未来扩展踩坑。
- 缓解：属性写操作走 Membrane 的 set trap，副作用仍可记录与清理（与现有 classic 沙箱一致）。

**安全：`__qk_realm` 等内部函数必须对子应用不可达**

`__qk_realm`/`__qk_resolve`/`__qk_dynamic_import` 挂在真实 globalThis 上。业务代码读到的 `globalThis` 是 membrane proxy，其 get trap 对未定义属性会**回落到真实 window** → 子应用可 `globalThis.__qk_realm('other-app')` 拿到他人 sandbox proxy，构成跨应用越权。

- `Symbol.for(...)` / 可枚举 token 类缓解**无效**（`Symbol.for` 全局可派生；token 可被枚举）。
- **正确方案**：membrane get trap 对 `__qk_*` 前缀（或一组已知内部 key）做**黑名单屏蔽**，使经 proxy 的读取一律返回 `undefined`。引导行用的是 `__qk_root`（真实 globalThis），不经 proxy，因此 bootstrap 不受影响；`__qk_import_meta.resolve` 等也统一经 `__qk_root` 取用，避免命中屏蔽。详见 Open Q7。

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
- **与 `modulepreload` 的协同**：writable-dom 生成的 `modulepreload` 可作为 fetch 预热 hint，其响应通过 `makeFetchCacheable` LRU 被改写管线复用（见 §10.1）

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
   - 因此本方案需要做的衔接是：在 (1) 把 bare specifier 解析为绝对 URL 之后，再由 module-resolver 判断是否能复用已有共享模块（按现有 URL/版本语义）。
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
  resolve: (s) => __qk_root.__qk_resolve('app-a', s),
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

**共享模块的跨实例引用计数（全新基础设施，注意误 revoke）**

§11「共享依赖例外」允许多个实例指向同一份 shared blob。但 §8 的引用计数表是按「instanceId + 原始 URL」记的；shared blob 被多个实例共享时，引用计数必须按 **shared key** 单独维护，否则会出现：实例 A unload 时把仍被实例 B 引用的 shared blob `revokeObjectURL` 掉 → B 后续 `import()` 命中已 revoke 的 blob URL 报错。这是一套**全新的跨实例引用计数基础设施**（现有 `module-resolver` 仅做 URL/版本匹配，无此计数），需明确：shared blob 的 revoke 必须等其所有引用实例都 unload。

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

### 10. WASM lexer 加载时机

`es-module-lexer` 需要 `await init()`。

**方案**：在 qiankun 公共 `start()`（`packages/qiankun/src/apis/registerMicroApps.ts` 的 `start()`）中预加载，第一个子应用加载前 lexer 已就绪。代价：qiankun 启动多 ~20ms（WASM 实例化）。

> 注：`packages/sandbox/src/index.ts` 仅是一个 barrel export 文件，不在公共启动路径上；lexer 初始化不应放在那里。

### 10.1 与 writable-dom `modulepreload` 的协同

`packages/loader/src/writable-dom/index.ts` 在 walk 到 `<script type="module">` 时**可能**生成 `<link rel="modulepreload" href="原始URL">`——但这条预加载受 `isBlocked` 门控（仅在被前序阻塞脚本挡住、需要「向前预热」时生成）。**对一个纯 ESM 入口（HTML 里只有一个 `<script type="module">`、前面没有阻塞 classic 脚本）的主目标场景，往往根本不会生成 modulepreload**，所谓「双取」在该场景基本不存在——原 RFC 把它描述为「解析 module script 时必然生成」是不准确的。

仅在确实生成了 modulepreload 的**混合**场景，才需处理「原始 URL 预取一次 + 改写后 blob URL 再 `import()` 一次」的双取：

- **抑制 / 改写**：接管 `<script type="module">` 时不生成对应 `modulepreload`，或改成指向最终 blob URL。
- **更正：不能依赖「复用 `makeFetchCacheable` LRU」**。`modulepreload` 是**浏览器内部**的 link 资源获取，不经过 JS 层；`makeFetchCacheable`（`packages/shared/src/fetch-utils/makeFetchCacheable.ts`，全局 LRU 50）只缓存 qiankun 自己 `fetch()` 的响应。浏览器 modulepreload 的产物只进入**浏览器 HTTP 缓存**，无法直接灌进 qiankun 的 JS 级 LRU。原 RFC 把两者混为一谈，「让原始 URL 预取结果被改写流水线复用」这一「优先方案」**机制上不成立**。
- 真正可行的复用路径只有两条：(a) 让 qiankun 改写流水线的 `fetch()` 与 modulepreload 命中**同一条浏览器 HTTP 缓存**（依赖响应可缓存、同 URL、同 credentials 与 `?t=`/`?v=` 查询）；(b) 干脆抑制 modulepreload、由 qiankun 改写流水线统一发起并经 `makeFetchCacheable` 复用。**推荐 (b)**，避免依赖不可控的 HTTP 缓存命中。

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
4.  **共享依赖例外**：只有 `module-resolver` 明确判定为可共享、且其执行结果不携带子应用实例状态的依赖，才允许多个应用指向同一份 blob。共享映射也必须使用 qiankun 管理的稳定 key（如 `__qk_shared__/vue@3.4/entry.js`），避免与主应用或其他原生 import map 的裸 specifier 冲突。
5.  **隔离正确性的隐含前提（必须显式规约）**：上述「first-wins 合并 + instanceId 前缀不冲突」的全部正确性，**依赖一个未显式声明的前提——instanceId 必须全局单调唯一、退休后永不复用**。一旦 instanceId 回卷或复用，新实例的合成 specifier 会与某条尚存旧条目相同，被浏览器**静默丢弃（first-wins）→ 解析到旧实例的退休 blob URL**，且**没有任何运行时信号**（不报错、不告警）。因此：instanceId 必须由 qiankun registry 单调分配（全局自增计数，避免随机/时间戳碰撞）；建议 dev 模式对「注入条目与现存 key 冲突」显式探测并 `console.error`，把这条静默失败显性化。

**Import Map 示例：**

```json
{
  "imports": {
    "__qk_appA_inst1__/https://app-a.host/main.js": "blob:uuid-a1",
    "__qk_appB_inst2__/https://app-b.host/main.js": "blob:uuid-b2",
    "__qk_shared__/vue@3.4/entry.js": "blob:uuid-shared-vue"
  }
}
```

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
     resolve: (s) => globalThis.__qk_resolve('app-a', s),
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
| JSON modules (`import data from './data.json' with { type: 'json' }`) | ❌ v1 不支持 | 需要 blob URL 设置正确 MIME type；`es-module-lexer` 能检测 import attributes 但改写管线未处理 |
| WASM modules (`import` of `.wasm`) | ❌ v1 不支持 | 同上 |
| CSS Module Scripts (`import sheet from './style.css' with { type: 'css' }`) | ❌ v1 不支持 | 浏览器原生 CSS module；需要单独处理 |

遇到不支持的模块类型时，ESM transpiler 应输出 `console.warn` 并 **passthrough**（不改写，让浏览器原生处理），避免静默失败。

**⚠️ passthrough 与 import-map 间接层冲突（必须处理）**

「passthrough 让浏览器原生处理」对**入口 / 被直接 `import()` 的 JS 模块**成立，但对**被其它已改写模块 `import` 的 typed module 不成立**：引用它的模块里，该 import 的 specifier 已被改写成合成 specifier、只存在于注入的 import map 中。若 transpiler 对这个 typed module 本身 passthrough（不生成 blob、不注册 import map 条目），浏览器解析那个**没有 import map 条目的合成 specifier** 时会**直接失败**，而非优雅回退到原始 URL。因此 v1 至少要做到其一：
- (a) 仍按「合成 specifier → 原始 URL（或带正确 MIME 的 blob）」注册一条 import map 条目，让浏览器用原生 JSON/CSS/WASM module 语义加载；
- (b) 在引用方改写阶段对 typed import 的 specifier **不做合成改写、保留原始 URL**（牺牲这类资源的实例隔离），并 `console.warn`。

单纯「不改写该模块」会让**引用它的模块整体解析失败**，这不是「降级」而是「连带崩溃」。

### 15. Source Map

`//# sourceURL=<原始URL>` 只影响 **DevTools Sources 面板的显示名**——它**不修改 `error.stack` 里的 URL**（stack 仍是 `blob:...`），也**不修正行号**（顶部注入了引导行 + 解构 + `__qk_import_meta`，行号整体下移）。

因此：
- **调试**：DevTools 能按原始路径找到文件，但断点行号与源码错位若干行。
- **可观测性（被原 RFC 低估）**：生产环境未捕获错误经 `window.onerror` / 上报 SDK 采集到的 `error.stack` 全是 `blob:<主应用 origin>/<uuid>` 帧，**无法映射回子应用真实文件**。这是 classic 沙箱不存在的退化（见 §7）。
- **行号偏移**：若复用 725 项 `globalsInBrowser` 解构，注入即便压成一行，仍是「引导行 + 大解构 + import_meta」数行；原「约 3-8 行 / ≤10 行」估计需按实际白名单大小重算（见 Acceptance「可观测」项）。

**结论修订**：完整 source map 不再是「未来增强」，而是**生产可观测性的必需项**（至少需把 blob 帧映射回原始 URL + 行号）。v1 若不实现完整 source map，必须文档化「ESM 子应用生产错误栈不可直接定位」这一已知局限，并在 Acceptance 增列对应项。

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
| `packages/shared/src/assets-transpilers/module.ts` | **新增**：lexer 调用 + 顶部注入 + specifier 改写为实例级唯一 specifier（不改为 blob URL）+ import.meta rewrite + Blob URL 生成（`type: 'text/javascript'`） |
| `packages/shared/src/assets-transpilers/import-map.ts` | **新增**：per-app import map 解析与查询（仓库现无 importmap 实现） |
| `packages/loader/src/index.ts` | (1) 通过 `nodeTransformer` 把 `<script type="module">` / `<script type="importmap">` 路由到对应 transpiler；(2) 新增 ESM 入口解析分支：`onEntryLoaded` 内当 entry 为 module 时走 `await import(entryBlobUrl)`，绕过 `latestSetProp` |
| `packages/loader/src/writable-dom/index.ts` | **不修改内部**；接入点改为 loader 的 `nodeTransformer`。仅需协同：抑制/改写为 module script 自动生成的 `modulepreload`，避免与 blob URL 二次取（见 §10.1） |
| `packages/qiankun/src/core/loadApp.ts` | ESM 入口生命周期接入：从 ESM 入口分支拿到 `{bootstrap, mount, unmount}` 接入 single-spa（classic 路径不动） |
| `packages/qiankun/src/apis/registerMicroApps.ts` | `start()` 中增加 `await esModuleLexer.init()`（公共启动入口） |
| `packages/sandbox/src/core/globals.ts` | **复用**现有 `globalsInBrowser`（725 项）作为 ESM 顶部解构白名单基集；剔除不可解构的纯属性项。**不新建** `membrane/globals.ts`（原 RFC 的 30 项手维护列表是倒退） |
| `packages/sandbox/src/core/membrane/index.ts` | 导出 `createRealmView(appId): Record<string, unknown>`；get trap 增加对 `__qk_*` 内部 key 的黑名单屏蔽（防跨应用越权，见 §1 / Open Q7） |
| `packages/sandbox/src/core/sandbox/StandardSandbox.ts` | `start()` 时挂载 `globalThis.__qk_realm`、`__qk_dynamic_import`、`__qk_resolve` |
| `packages/shared/src/module-resolver/index.ts` | 复用现有 URL/dependencymap 匹配；扩展引用计数管理；按 §2 的”先解析为绝对 URL 再询问 module-resolver”进行衔接 |
| `packages/shared/src/esm-sandbox/import-map-registry.ts` | **新增**：运行时 import map 管理——构建全局唯一前缀映射、注入 `<script type=”importmap”>` 到主文档、追加动态 import 条目（§11） |
| `packages/shared/src/fetch-utils/makeFetchCacheable.ts` | 不修改实现；ESM 流水线复用其全局 LRU 响应缓存 |

`packages/sandbox/src/core/compartment/index.ts` **不动** —— classic script 继续 `with(this)`，ESM 分支不经过 Compartment。
`packages/sandbox/src/index.ts` **不动** —— 仅 barrel export，不在公共启动路径上。

新增 dependency：[`es-module-lexer`](https://www.npmjs.com/package/es-module-lexer)（~50KB gz, MIT, WASM 模式）。

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
- [ ] 两个子应用同时使用 `vue@3.4.x`，通过 `module-resolver` 与 qiankun 管理的 shared key 共享同一份 Vue 模块（namespace 隔离正确）
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

### 性能

- [ ] qiankun 启动开销（含 lexer init）增加 ≤ 50ms
- [ ] 单个 module 改写开销 ≤ 5ms（典型业务模块体量）
- [ ] remount 第二次起，在未 unload 的同一实例内复用 blob URL，mount 耗时 ≤ 首次 50%

### 可观测

- [ ] 改写后代码在 DevTools Sources 面板显示为原始 URL（通过 `sourceURL`）
- [ ] 行号偏移按实际白名单大小重算并文档化（复用 725 项 `globalsInBrowser` 时，注入压成单行解构 + 引导行 + `__qk_import_meta` 声明，约 3~5 行；不再承诺固定「≤10 行 / 3-8 行」）
- [ ] 明确 `//# sourceURL` 只改 DevTools 显示名、不改 `error.stack` URL 与行号；生产可定位依赖完整 source map（见 §15）

## Risks and Mitigations

| 风险 | 缓解 |
|---|---|
| Globals 白名单不完整，新 Web API 逃逸 | 文档化限制；提供 `extraGlobals: string[]` 配置（v1.1） |
| 裸全局函数调用（`addEventListener` 等）逃逸，与 classic 沙箱 `with(proxy)` 存在能力差异 | 扩充白名单覆盖 `Window` interface 常用方法；文档化差异；考虑提供 lint 规则 |
| `(0, eval)('globalThis')` 等间接渠道逃逸 | 已知 JS 沙箱固有问题，与 classic 同病，不解决 |
| `globalThis.__qk_realm(appId)` 暴露跨应用访问接口 | 恶意子应用可调用 `__qk_realm('other-app')` 访问其他子应用 sandbox。缓解：改用 per-mount 随机 token 或 `Symbol` key，避免全局可枚举 |
| `loadMicroApp` 多实例场景 | **设计修正**：所有模块 specifier 必须强制加入实例唯一前缀（如 `__qk_<appId>_<instanceId>__/...`）以在全局 import map 中实现隔离。 |
| Worker / Service Worker 不沙箱化 | v1 明确不支持，文档化；后续迭代用 runtime 拦截 `Worker` 构造函数 |
| 行号偏移影响调试 | `sourceURL` 缓解；v1.x 加完整 source map |
| 首屏依赖加载是异步瀑布 | 并行 fetch + Blob URL 缓存 + 全局 LRU；生产环境推荐构建期预处理 |
| CSP 需要 `script-src blob:` | 文档化要求 |
| ESM module 顶层只执行一次（remount 复用） | 文档化语义差异；提供迁移指南 |
| `import.meta.resolve` 识别需额外 lexer 规则 | 采用 runtime 方案：`__qk_import_meta.resolve = (s) => __qk_resolve(appId, s)`，避免编译期识别 |
| 改写后字节体积增加 | 顶部注入 ≈ 200~400 字节；可接受 |
| Blob 创建时 MIME type 缺失 | 必须指定 `new Blob([code], { type: 'text/javascript' })`，否则浏览器拒绝执行 module script |
| Import map 冲突导致模块解析失败 | **核心风险**：由于 import map 无法删除且冲突条目会被丢弃，长期运行或热更新可能导致 specifier 冲突。**对策**：app-private specifier 必须包含 instanceId；shared specifier 必须由 qiankun registry 统一分配。 |
| Import map 条目无法清理 | 子应用 unload 后死条目积累，但仅为纯字符串，内存影响极小；blob URL 可正常 revoke；重新加载时分配新的 instanceId，避免命中旧条目 |
| Vite dev URL 查询参数影响缓存 | Vite `?t=` 参数（HMR 时间戳）和 `?v=` 参数（预构建 hash）需保留在缓存 key 中，确保版本正确性 |
| 运行时 import map 需要多 import map 浏览器支持 | Chrome/Edge 133+、Safari/iOS Safari 18.4+；Firefox 150 branch 已实现但默认关闭。Firefox 与旧浏览器必须 fallback 到 es-module-shims |
| **注入模板 TDZ（已修复）** | 引导行曾用 `globalThis.__qk_realm(...)` 命中同名 const TDZ，每模块首行 ReferenceError。改用不在解构集内的 `__qk_root = (0,eval)('globalThis')`（§1） |
| **strict-mode 隐式全局「写」差异** | ESM 下裸 `foo = 1` 抛 ReferenceError（classic 写入 proxy）。文档化差异；迁移指南要求显式 `window.` 前缀或声明（§1、Migration） |
| **`__qk_realm` 跨应用越权** | 经 proxy get-trap 透传可达。Symbol/token 无效；改为 get-trap 黑名单屏蔽 `__qk_*`（§1、Open Q7） |
| **CSS-as-JS / 顶层副作用 remount 后丢失** | remount 顶层不重跑 + 卸载清空虚拟 head → 样式永久消失。POC 选定 rebuildCSSRules 恢复 / remount 重求值例外（§6、§8） |
| **错误传播与可观测性退化** | `await import` reject 需手动 plumb 回 single-spa；blob 帧无法定位。补错误分支 + 完整 source map（§7、§15） |
| **快速 unmount 无 abort** | in-flight fetch 悬挂、mount-after-unmount。per-load AbortController + import timeout（§8） |
| **异步求值下元素归属错配** | `__currentLockingSandbox__` 的同步单 sandbox 假设在并发 ESM 下失效。改为基于 proxy document 身份归属（§8） |
| **Prefetch 对 ESM 失效** | 静态 HTML 只见 entry，~270 模块图发现不了。补 ESM prefetch 策略或声明仅预热 entry（见「ESM Prefetch 策略」） |
| **Trusted Types 拦截 createObjectURL / importmap 注入** | `require-trusted-types-for 'script'` 下 blob→script、字符串→importmap 被 TT sink 拦截。需 qiankun 专用 TrustedTypePolicy 或声明不兼容（Migration CSP） |
| **生产 ESM 路径与 C3 矛盾** | 「生产推荐构建期预处理」违反 C3「不依赖构建期改造」。明确生产复用同一运行时管线（见「生产 ESM 构建产物」） |


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
| `connect-src` | 包含子应用 origin（如 `https://sub-app.example.com`） | 主应用 origin 的代码 fetch 子应用资源 |
| `style-src` | 包含 `'unsafe-inline'`（如果子应用动态创建 style） | Vite CSS-as-JS 模块通过 `style.textContent` 注入样式 |
| `worker-src` | 包含 `blob:`（如果子应用创建 Worker） | v1 scope 外，但提前配置可避免未来问题 |
| `require-trusted-types-for` / `trusted-types` | 若主应用强制 Trusted Types，需为 qiankun 配置专用 `TrustedTypePolicy`（`createScriptURL` 包装 blob URL、`createHTML`/`createScript` 包装注入的 importmap）；或声明 v1 不兼容 TT 强制模式 | ESM 管线「字符串源码 → blob → 当脚本执行」+ 字符串注入 `<script type=importmap>` 正是 TT 设计要管控的 string-to-script sink |

### 对 qiankun 主应用开发者

无需修改注册代码。`registerMicroApps` / `loadMicroApp` API 不变。可选：

```ts
start({
  sandbox: {
    esm: {
      extraGlobals: ['MyCustomGlobal'],   // v1.1
    },
  },
});
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
7. **`__qk_realm` 的安全性（v1 阻塞决策）** —— 任何子应用经 proxy globalThis 即可 `__qk_realm('other-app')` 越权访问他人 sandbox proxy。**`Symbol`/token 缓解无效**（`Symbol.for` 可派生、token 可枚举，见 §1）。**结论**：v1 直接采用 **membrane get-trap 黑名单屏蔽 `__qk_*`**，内部函数统一经 `__qk_root`（真实 globalThis、不经 proxy）取用。不再「v1 先用简单方案、v1.1 再改」。
8. **运行时 import map 是否违反"不把子应用 import map 注入主文档"的约束？** —— **已解决**：注入的是 qiankun 运行时用于 URL -> Blob 映射的 import map。由于 import map 是文档级单例且合并冲突时“先到先得”，我们必须通过 specifier 唯一化（Prefixing）来避免不同应用、不同实例间的 specifier 碰撞。

## References

- [es-module-lexer](https://github.com/guybedford/es-module-lexer) - Brian Bedford 的 WASM JS module lexer
- [es-module-shims](https://github.com/guybedford/es-module-shims) - 同作者的 module shim，灵感来源
- [ECMA-262 §16.2.1.6.2 ParseModule](https://tc39.es/ecma262/#sec-parsemodule)
- [ECMA-262 §11.2.2 Strict Mode Code](https://tc39.es/ecma262/#sec-strict-mode-code)
- [ECMA-262 §14.11.1 With Statement Early Errors](https://tc39.es/ecma262/#sec-with-statement-static-semantics-early-errors)
- [HTML Spec: Import Maps](https://html.spec.whatwg.org/multipage/webappapis.html#import-maps)
- qiankun v3 Roadmap: https://github.com/umijs/qiankun/discussions/1378
