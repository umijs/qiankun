# RFC: Insertion-Point Ownership for Dynamic DOM Attribution

- **Status**: Draft(已实现,见本分支:标记拆分 → 归属收敛 + 创建者机制退役 + CSSOM 位置解析,附归属契约单测)
- **Author**: qiankun maintainers
- **Created**: 2026-07-25
- **Target Release**: qiankun v3.x
- **Tracking Issue**: TBD
- **Last Revision**: 2026-07-25(实现与验证完成:全仓单测、Chromium e2e、eslint/prettier、本地性能基准全部通过;嵌套沙箱补齐真实 e2e harness(`fixtures/sub-nested`,qiankun 套 qiankun),核心判别用例经变异测试确认可区分新旧归属语义。review 收尾:Q1 定案为无条件 warn、unpatch 清除挂载点 stamp、S2/D5 补缓存边界、D2 补 cloneNode 已知限制;二轮 review:效果位更名 `nativePassthroughNode` 以名实相符,盖章点从 writable-dom fork 移入 `loadEntry` 闭包,fork 不再感知 qiankun 语义)

## Summary

把 dynamicAppend patcher 的元素归属(attribution)规则从「**创建者优先、插入点兜底**」收敛为「**插入点唯一**」:

> 凡是插入某 app 已 patch 挂载点(容器 body / `<qiankun-head>`)的可劫持标签(script/link/style),即归属该 app、进入其管线 —— 除非节点带「原生放行」效果位。

同时把现有单一 `loaderStreamedNode` 标记按语义拆成两个:

- **效果位** `nativePassthroughNode`:「此节点由 qiankun 自有管线插入,动态插入管线必须原生放行」。loader 流式管线与 Compartment 内部 blob script 都打它;dynamicAppend 只消费它。
- **出处位** `loaderStreamedNode`:「此节点由 HTML entry 流式加载产出」。仅 loader 打;仅容器占用检测(`containsLoaderStreamedNode`)消费。

创建者归属机制(`attachElementToSandbox` + `__currentLockingSandbox__` 嵌套锁)整体退役。CSSOM `insertRule` 的 config 解析改为**按 DOM 位置**(向上找已 tag 的容器),与插入点模型自洽。

## Motivation

### 历史:两套归属模型的叠加

v2 时代归属只有一条规则:沙箱代理的 `document.createElement` 在创建时刻给元素挂 config(创建者归属),patcher 里「无 config → 原生放行」。

#3138(`dcc42ae4`)修复 jQuery/innerHTML 场景时发现:**parser 产出的 DOM**(`innerHTML`、`insertAdjacentHTML`、`cloneNode`、`DOMParser`、jQuery `buildFragment`)从不经过 createElement,无 config 却是不折不扣的应用动态插入 —— 样式因此完全绕过 `@scope` 隔离泄漏到主页面。修复方式是给挂载点打 config(`tagMountPoint`,`forStandardSandbox.ts:233`),无主元素落上来时继承(插入点归属)。

补丁没有替换旧模型,而是叠在上面,产生了一批胶水逻辑:

| 胶水 | 位置 |
| --- | --- |
| 创建者优先 + 插入点兜底的三元决策 | `common.ts:147-148` |
| fragment 分解分支的 `getSandboxConfig(child) ?? ownerConfig` | `common.ts:123` |
| `isLoaderStreamedNode` 排除位散布 | `common.ts:122/132/148` |
| 嵌套沙箱创建锁 | `forStandardSandbox.ts:44-48, 162-177` |
| Compartment 内部 blob script 语义透支(见下) | `core/compartment/index.ts:183` |

### 语义透支的具体化

`loaderStreamedNode` 目前同时承载两个契约:

1. **效果契约**(dynamicAppend 三处消费):「已转译,放行」—— 与出处无关;
2. **出处契约**(`containsLoaderStreamedNode`,`container.ts:27` → `sandbox/index.ts:153`):「容器持有 entry 流式内容」—— 只有 loader 有资格声明。

Compartment `evaluateScript` 给内部 blob script 打此标记(`compartment/index.ts:183`)在效果契约下是对的,但污染了出处契约:blob script 挂着标记待在容器里,理论上会让容器被误判为「已被流式占用」。今天不出事仅仅因为 `sandbox/index.ts:153` 的 `&&` 短路顺序 —— blob script 必然位于 qiankun-head 内,第一个条件已经 false。靠条件排列的巧合掩护,不是靠语义正确。

### 目标

- **G1 单一归属规则**:插入点唯一,消灭创建者/插入点双模型与全部胶水。
- **G2 标记语义诚实**:效果位与出处位分离,每个消费者读到它真正想问的问题。
- **G3 死代码退役**:`attachElementToSandbox`、`__currentLockingSandbox__` 及 createElement 锁整体删除。
- **G4 为 patcher 插件化铺路**:归属规则收敛是 Compartment Alignment RFC(G3 扩展开放)中 dynamicAppend 插件化的前置项 —— 插件契约里只需要「插入点 + 效果位」两个概念。

## 事实底账(2026-07-25 全量核实)

以下事实是本 RFC 风险结论的基础,均已在源码/测试中逐一核对。

**F1 — 挂载点必然被 tag,归属变更不改变「进管线的集合」。** `patchStandardSandbox` 先创建 SandboxConfig(`forStandardSandbox.ts:458-469`)再 `patchDocument`(`:474`),故 `tagMountPoint`(`:233-236`,在 `:246/:281` 调用)总能取到 config。因此在 patched 挂载点上,可劫持、非流式元素**今天就总能解析出 config**(自带的或挂载点兜底的),总会进管线。收敛为插入点唯一后,进管线的集合完全不变;唯一可能变化的是**绑定到哪个 app 的 config**,且仅当「创建方 ≠ 插入方」。这直接排除了「原本原生放行的外部同步 script 新进入 deferred 链」一类风险 —— 该场景在挂载点上今天就不存在。

**F2 — 「创建方 ≠ 插入方」在正常编排下不可达。**
- `loadMicroApp` 多实例:每实例独立容器(`e2e/fixtures/main/src/main.ts:61-72`,`multi-instance.spec.ts:9-46`),互不交叉;
- `registerMicroApps` 共享容器:顺序接力,`initContainer`/`clearContainer` 在 init/remount/unmount 时清空容器(`loadApp.ts:278-308`),互斥 `activeRule` 保证不同时活跃(`register.ts:4-26`);
- sandbox 层 `containerOwners` 是单 owner、last-writer-wins(`forStandardSandbox.ts:109/220/262/297`),本就不支持多租户;双向 unpatch 顺序已核实安全(先释放方的 cleanup 因方法引用不匹配而 no-op)。
- 仓库内**没有任何测试钉住创建者归属行为**;嵌套锁 `__currentLockingSandbox__` 的测试覆盖为零。现有测试(`stylesheet-ledger.test.ts:70-87`、`style-isolation.spec.ts:68`)钉住的恰恰是插入点收养路径。

**F3 — 重挂载回放与归属正交。** 回放走模块加载时捕获的原生 `rawHeadInsertBefore`/`rawHeadAppendChild`(`forStandardSandbox.ts:412-413, 543-551`),完全绕开 patch,不重新注册、不重进账本。归属变更只影响「首挂载时哪些元素入谁的账本」,不触碰回放机制。

**F4 — 宿主从不向容器内插节点。** ui-bindings 的 loader/error UI 渲染在 wrapper(容器的兄弟层),容器引用原样交给 `mountMicroApp`(`MicroApp.tsx:111-119`、`MicroApp.ts:182-233`);无 portal。e2e/fixtures 中宿主对容器只有清空与属性写,从无可劫持节点插入。

**F5 — 既有 RFC 已定「元素归属按实例、随物理容器」。** esm-sandbox RFC 拒绝共享 blob 的理由正是「dynamicAppend 元素归属错到 A 的容器」(`esm-sandbox.md:581`)。插入点归属把「元素在谁的容器里」与「归属谁」钉成同一件事,与该不变量**更**一致;反而是现行创建者优先规则允许 B 的元素在 A 的容器里仍归 B。

**F6 — 管线下游对 config 是不透明消费。** 转译、账本(`dynamicStyleSheetElements`)、deferred 队列(`dynamicExternalSyncScriptDeferredList`)、样式记录各分支只读 `sandboxConfig` 的字段,不关心 config 从哪来。唯一的实质决策点就是 `common.ts:147-148`。

## Design

### D1 归属规则:插入点唯一

`common.ts:147-148` 改为:

```ts
// before
const sandboxConfig =
  getSandboxConfig(element) ?? (isLoaderStreamedNode(element) ? undefined : getSandboxConfig(this));

// after
const sandboxConfig = isNativePassthroughNode(element) ? undefined : getSandboxConfig(this);
```

**收养语义**:进入管线的元素**一律** `setSandboxConfig(element, sandboxConfig)`(去掉 `common.ts:158` 的 `!getSandboxConfig(element)` 守卫)。含义:重插入即重归属 —— 元素被挪到谁的挂载点就归谁,与插入点模型自洽,也让 removeChild(`common.ts:306`)与 CSSOM 读到的永远是「最后一次插入的归属」。

**fragment 分支简化**(`common.ts:114-141`):`shouldDecompose` 从「child 自有 config ?? ownerConfig 的三元」简化为「存在可劫持且非原生放行的 child」;分解时对每个 child 直接 stamp `ownerConfig`(去掉 `:132-133` 两个守卫)。

### D2 标记拆分

`packages/shared/src/common.ts`:

| 标记 | Symbol | 生产者 | 消费者 |
| --- | --- | --- | --- |
| 效果位 | `Symbol.for('qiankun.nativePassthroughNode')` | loader 流式管线(`loadEntry` 的 transformer 闭包,`loader/src/index.ts`)、Compartment blob script(`compartment/index.ts:183`) | dynamicAppend(`common.ts:122/132/148` 对应处) |
| 出处位 | `Symbol.for('qiankun.loaderStreamedNode')`(保留) | 仅 loader 流式管线(同上闭包) | 仅 `containsLoaderStreamedNode`(`container.ts:27`) |

loader 对流式元素两个都打;Compartment 只打效果位 —— 出处契约的污染消除,容器占用检测不再依赖短路顺序保命。两个符号均用 `Symbol.for` 注册,跨 `@qiankunjs/shared` 副本契约保持(现状同)。doc comment(`shared/src/common.ts:5-12`)按两个契约分别重写。

**盖章点归 loader 集成层,不归 writable-dom fork。** vendored 的 writable-dom 不感知任何 qiankun 下游语义(不 import `@qiankunjs/shared`),它的契约止步于「每个待插入 element 在插入前必经 `assetTransformer` 回调」;两个标记由 `loadEntry` 传入的闭包盖章。回调的调用范围恰好等于「walk 经手的节点」,故语义与在 walk 内盖章等价,唯一差异是 preload hint(blocked 期间的预扫描分支也走回调)从「不带标记、插入被 patch 容器时被二次转译」变为「带标记、原生放行」—— 属良性修正:hint 是 walk 自己插入、`onload` 后自己移除的瞬态节点;且 preload 分支仅在 walk 被 blocking 元素卡住时运行,容器中必已存在带出处位的元素,`containsLoaderStreamedNode` 判定不受影响。标记形态必须维持 symbol 属性而非 DOM attribute:attribute 会随 `cloneNode` 复制、可被应用代码伪造,效果位若可克隆/可伪造即成沙箱逃逸通道(symbol 属性两者皆不会)。

已知限制(现状同,非本 RFC 引入):symbol 标记不随 `cloneNode` 复制 —— 克隆一个带效果位的节点再插入会重新进管线(样式可能被二次 `@scope` 包裹)。单一 `loaderStreamedNode` 时代行为相同,记录备查。

### D3 创建者机制退役

删除:`attachElementToSandbox`(`forStandardSandbox.ts:115-120`)、`__currentLockingSandbox__` 全部(`:34-48` 声明与 defineProperty、`:163-177` createElement 锁逻辑)。`proxyDocument` 的 `createElement` get 保留 override 通道(`modificationFns`)但不再做任何归属动作;`createElement`/`querySelector` 的 set/get 配对结构不动(防写泄漏)。

### D4 嵌套沙箱:插入点天然区分

嵌套锁存在的唯一理由是消歧「createElement 链上谁是真正的创建者」(B 的代理委托 A 的代理再委托原生,无锁则最内层 attach 胜出、归属错乱)。插入点模型下归属在插入时刻由挂载点决定:B 的容器与 A 的容器是不同元素、各自持有实例级 patch,插到谁的挂载点就命中谁的 patch、绑谁的 config —— 无需任何创建时刻协调。锁连同它保护的问题一起消失。

### D5 CSSOM `insertRule`:按位置解析

现状 `forStandardSandbox.ts:422` 读 `elementConfigs.get(ownerNode)`,依赖元素身上的 stamp。经挂载点插入的元素(styled-components/emotion/JSS 均注入代理 `document.head` → qiankun-head → 挂载点)在 D1 收养下照常有 stamp,不受影响。

对**未经挂载点**插入的 style(如 `StyleSheetManager target` 指向容器深处的 div),今天靠创建者 stamp 才能 scope。改为按位置解析:

```ts
const config = elementConfigs.get(ownerNode) ?? resolveConfigByPosition(ownerNode);
// resolveConfigByPosition: 沿 parentElement 上溯,首个命中 elementConfigs 的祖先
//(挂载点必然被 tag,F1)即为归属;命中后回写 stamp 到 ownerNode 作缓存。
```

这与插入点模型同构(「样式现在活在谁的容器里」),并顺带修正现状的不一致:今天深插 style 的**文本规则不 scope、insertRule 规则却按创建者 scope**,若元素被挪出容器 insertRule 仍继续 scope(错误);按位置解析后两者行为统一且随位置正确。上溯只在无 stamp 的首次 `insertRule` 发生一次,之后走缓存 —— CSS-in-JS 高频 insertRule 路径无持续开销。

缓存同时划定了修正的边界:首次解析后归属被钉在元素上,之后元素再被挪出容器,后续 `insertRule` 仍沿用缓存归属 —— 深插元素不经过 patched removeChild,缓存没有失效时机。这与 S3 属同类已知限制,不因缓存恶化(旧创建者 stamp 同样不随移动失效)。

### 不变量保持对照

样式账本调查提炼的 9 条不变量逐条对照(编号见调查底稿,此处收录结论):

1. **入账⇔摘账对称**(push 进账本的元素必须可被 removeChild 识别摘除,否则复活 #3163 修掉的账本堵塞):D1 的「一律 stamp」在直插、fragment、转译替换(`common.ts:203-204`)三条路径统一保证,比现状(守卫式补 stamp)更强。钉住测试:`stylesheet-ledger.test.ts:70-87`。
2. hint link 转译但不入账(`common.ts:175-182`):不动。
3. 管线节点原生放行:由效果位承接(D2),语义不变。
4. 回放原生、不重注册:不动(F3)。
5. `styleElementTargetSymbol`/`refNodeNo` 顺序元数据:不动;插入点模型下 target symbol 的含义(「插入的挂载点」)反而名实相符。
6. 账本数组与 `elementConfigs` 跨挂载持久:不动。
7. 原生放行 script 不误入 deferred 链:F1 证明挂载点上不存在该集合变化。
8. 挂载失败回滚(`lifecycle.test.ts:82-110`):不动。
9. realm 级原型 patch 引用计数:不动。

## 语义变更清单(诚实列举)

**S1 — 跨实例直插**:B 用直接 DOM 引用把自建元素插进 A 的挂载点,归属从 B(创建者)变为 A(插入点)。评估:正常编排不可达(F2)、零测试依赖、与 F5 既定不变量更一致。**接受**,并在 Phase 3 用测试把新语义钉成契约。

**S2 — 沙箱内创建、未经挂载点插入的 style 的 `insertRule` scoping**:归属来源从创建者 stamp 变为位置解析(D5)。容器内深插:行为不变(解析到同一 app);首次 `insertRule` 解析前被挪出容器:从「继续 scope(错)」变为「不再 scope(对)」;首次解析后再挪出:沿用缓存归属(D5 缓存边界)。**属修正而非回归**,修正范围以首次解析为界。

**S3 — 重插入即重归属**(D1 收养语义):元素跨挂载点移动后,removeChild/CSSOM 按最后插入点结算。跨容器移动在两种模型下账本层面都有未定义行为(直接 append 触发的隐式 detach 不经过旧容器的 patched removeChild,旧账本残留 —— 现状同病),不因本 RFC 恶化,记为已知限制。

## Implementation Plan

**Phase 1 — 标记拆分**(独立可先行,风险低):shared 增 `nativePassthroughNode` 标记对;loader 双打(盖章点在 `loadEntry` 闭包,见 D2);Compartment 改打效果位;dynamicAppend 三处消费换效果位;`container.ts` 保持出处位。现有测试全量回归(`lifecycle.test.ts:100` 的出处位用法不变)。

**Phase 2 — 归属收敛**:D1(决策行 + 一律 stamp + fragment 简化)、D3(死代码删除)、D5(CSSOM 位置解析)。回归重点:`stylesheet-ledger.test.ts` 全部、`style-isolation.spec.ts:68`(jQuery fragment)、`router-mode.spec.ts:46-63`(共享容器接力竞态)、multi-instance 与 standalone 全套。

**Phase 3 — 测试补账**(补历史空白 + 钉新契约):跨实例直插归属契约单测(钉 S1)、`StyleSheetManager` 式容器内自定义注入点的 insertRule scoping 单测(钉 D5)、容器占用检测不被 Compartment blob script 误导的单测(钉 D2 出处位纯度)、以及**嵌套沙箱 e2e**(历史零覆盖):新增 `e2e/fixtures/sub-nested` —— 一个自带 qiankun 副本、在自己 DOM 内再挂一个子应用的 classic 应用,配 `e2e/tests/nested-sandbox.spec.ts`。

### 嵌套与 evaluateScript 的覆盖实证(变异测试结论)

- **嵌套归属**:`nested-sandbox` 中「外层应用创建、交给内层容器」的节点用例是新旧语义的**真判别式** —— 变异回创建者归属后,该用例精确失败于 `@scope ([data-name="sub-nested"])`(错误归属外层)。其余三条(各自容器内的样式归属、两层全局不外泄、外层卸载连带内层)在新旧模型下都应成立,作用是给已退役的 `__currentLockingSandbox__` 嵌套锁补上回归护栏。该 fixture 同时顺带验证了跨 qiankun 副本的 `Symbol.for` 契约(内外层是两份独立打包的 qiankun)。
- **evaluateScript 的效果位**:已被现有 `standalone-sandbox` e2e 兜住 —— 去掉 `markNodeForNativePassthrough(script)` 后该用例失败(控制器进入 `failed`,blob script 被二次转译)。
- **evaluateScript 的出处位**:端到端**不可达**,已实证 —— 把拆分前的 `markLoaderStreamedNode(script)` 加回去,全部 e2e 依旧通过。原因是双重结构保护:blob script 始终位于 `<qiankun-head>` 内(占用检测的第一个条件因此为 false),且求值 settle 后即被移除。故出处位纯度由单测精确钉住,e2e 覆盖其可达邻域:新增「同容器在一次 classic 求值生命周期后由新控制器重新准备」用例(`standalone-sandbox.spec.ts`),断言虚拟头恰好重建一次、隔离对第二个控制器依然成立。

各 Phase 独立成 conventional commit,`pnpm run ci` + Chromium e2e 全绿为 gate;Phase 2 附带跑一次性能门禁(D5 上溯为冷路径,预期无感,须实证)。

## Non-Goals

- 不支持两个活跃 app 共享一个容器(现状即不生成该场景,`containerOwners` 维持单 owner)。
- 不改回放机制、账本数据结构、deferred 队列机制。
- 不移除「原生放行」效果位本身 —— 它是流式管线与动态管线并存的必要契约,本 RFC 只让它名实相符。

## 附带清理项(顺路,不阻塞)

- `forStandardSandbox.ts:289`:body `insertBefore` 误传 `document.head.insertBefore` 为原生函数(与 `Node.prototype.insertBefore` 同引用故无功能差异,但捕获自实例属性有被宿主实例级 patch 污染的理论风险),统一改为从 prototype 捕获。子应用自行 wrap 它所见的挂载点 `appendChild`(业务 monkey-patch 常态)不受影响:wrapper 遮蔽实例级 patch 方法并委托之,管线在 wrapper 之下照常运行 —— 由新增 e2e(`sub-classic-patched-append`)钉住。
- `shared/src/common.ts:5-12` doc comment 随 D2 重写为双契约表述。
- unpatch 时清除挂载点自己的 stamp(守卫同主 config,共享容器接力时不误删后来者的 tag):防止 D5 位置解析把已卸载 app 判为陈旧归属;归属契约单测钉住。

## Open Questions

- **Q1(已定案)**:重归属 warning 无条件发,不做 dev gating —— 与 detached-container warning 的既有处理一致;该场景正常编排下不可达(F2),噪音风险可忽略。
- **Q2**:D5 位置解析是否需要处理 Shadow DOM 边界(`getRootNode()` 跨越)?现状 qiankun 容器不使用 shadow root,倾向:不处理,遇到即视为无归属。
