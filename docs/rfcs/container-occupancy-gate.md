# RFC: Container Occupancy Gate — Serialize DOM Writes for Micro Apps Sharing One Container

- **Status**: Draft(已实现,见本分支:两段临界区 + FIFO 闸门 + 失败兜底,附闸门单测与 loadApp 集成单测)
- **Author**: qiankun maintainers
- **Created**: 2026-07-25
- **Target Release**: qiankun v3.x
- **Tracking Issue**: #3139
- **Last Revision**: 2026-07-28(review 修订:①段释放信号覆盖 post-stream 求值、①→② 采纳、initializedContainers 归属令牌、兜底先 teardown、update/指示器纳入守护、预热按需触发,并新增 §已知限制)

## 背景

qiankun 3 的 streaming loader 在 **load 阶段**就向容器流式写入 DOM 并执行脚本(必须执行才能拿到 lifecycle exports)。而 single-spa 的调度语义是:**incoming app 的 `load` 与 outgoing app 的 `unmount` 并发执行**,只有 `mount` 才等待 unmount 全部完成。

两者叠加后,多个微应用共享同一容器时存在结构性竞态(A→B 切换),完整时序是**两拍互抹**:

1. `load(B)` 与 `unmount(A)` 并发:B 的 load 阶段 `initContainer` **先把仍处于 mounted 状态的 A 的 live DOM 同步抹掉**,随后 B 的 HTML 流入共享容器、模块求值、动态样式注入(如 Vite dev 的 CSS-as-JS 模块);
2. `unmount(A)` 的最后一步 `clearContainer()`(`loadApp.ts` unmount 链末尾)再把 B 刚流入的一切抹掉;
3. `mount(B)` 命中 `!initializedContainers.has(container)` 分支,用 `getPureHTMLStringWithoutScripts` **二次渲染**(脚本被剥掉以避免重复执行)→ 静态 DOM 恢复,但脚本执行的副作用(动态注入的 style 等)不会重来(ESM 模块缓存也不允许重跑)。

### 已有缓解与其局限

- #3138 中的 `reattachDynamicStylesheets` 在每次 sandbox mount 时把已记录但脱离容器的动态样式补挂回去——这是**兜底**,治标不治本:竞态窗口内的 DOM 抹除 + 二次渲染依然发生(浪费一整轮流式渲染、可见闪烁)。
- `loadMicroApp` 内置的时序控制(`wrapParcelConfigForRemount`)只覆盖**同名应用 + 同容器**的重复挂载(registry key 为 `${name}-${xpath}`);跨应用共享容器不受保护——调用方不 `await prevApp.unmountPromise` 就调 `loadMicroApp(next)` 时与 register 路径一样竞态。

## 设计:容器占用注册表(container occupancy gate)

**目标:同一容器上先后渲染多个微应用时,DOM 写入全序化,无竞态。**

粒度 = 容器元素(`container: HTMLElement`,`WeakMap<HTMLElement, Holding>` 按元素引用键控;主应用重渲染产生新元素时新旧元素天然不冲突)。持有凭证用 release 闭包身份(而非 appName 匹配),避免同名多实例歧义;等待者 FIFO 排队。

### 持有周期:两段临界区,而非一段长持有

一个应用对容器的占用不是「load 时 acquire、unmount 时 release」的一段连续持有,而是两类独立的临界区,每段都有确定的退出点:

**① load 流式渲染临界区**

- acquire:`loadApp` 在 load 阶段 `initContainer` 之前(也先于 `createSandbox`——沙箱 bootstrap 会在容器挂载点上安装实例方法 patch,同属容器写入);
- release:**entry lifecycles promise settle ∧ DOM 流 settle**,两个信号齐备即释放(finally 语义,成功失败都放)。见 §释放点修订。

不能持有到 unmount 才释放:single-spa 的 `tryToBootstrapAndMount` 在 load 完成后会**复查 `shouldBeActive`**,A→B→A 快速导航下 B 会 load 完成但永不 mount、也就永不 unmount——若持有延续到 unmount,闸门被 B 永久持有,此后该容器上一切 acquire 全部饿死(死锁)。load settle 即释放则该场景自然消解。

**② mount→unmount 占用期**

- acquire:mount 链内、remount 二次渲染(`initContainer` + `loadEntry` 重放)**之前**——这段同样是 DOM 写入,必须在闸内,否则 loadMicroApp 跨应用 + remount 的组合下竞态依旧;
- release:
  - 正常路径:`clearContainer`(unmount 链最后一步);
  - 失败兜底(**防死锁的关键**):**mount 链任一 hook reject、unmount 链任一 hook reject** 时都要释放。single-spa 对 mount **或 unmount** 失败的应用都标记 `SKIP_BECAUSE_BROKEN`,此后不再调它的 unmount,链末尾的 `clearContainer` 不会执行,必须显式兜底(`loadMicroApp.ts` 过滤 `LOAD_ERROR`/`SKIP_BECAUSE_BROKEN` 实例是同一问题的既有先例)。unmount 失败兜底释放后容器可能残留旧 DOM——无害,下一个持有者自己的 `initContainer` 会清掉,正好自洽。

两段之间(load settle 后、mount acquire 前)存在一个可插队窗口。插队者同样被全序化,不破坏正确性:若真有 C 在窗口内占走容器,B 之后 mount 时发现 `initializedContainers` 中的归属令牌不是自己的(见 §归属令牌修订),走 pure-HTML 重放,只在这个罕见交错下退化为一次二次渲染(且全程无竞态,重放本身在②内执行)。正常 A→B 切换该窗口无人插队,单次渲染的收益保持。

**①→② 采纳(adoption)**:若 mount 到来时应用**自己的①段尚未释放**(流还在写——大文件尾部、defer/module 脚本仍在求值、乃至永不关闭的 chunked 响应)且目标容器与①一致,mount 不排队等自己,而是直接把①的持有**转为②**(settle 闩此后不再释放该持有)。这既消除了「应用的 mount 排在自己的 load 持有之后」的自死锁,也避免了常规场景下白白让出容器再重放一轮;跨应用互斥不受影响——被采纳的持有仍按②的规则在 unmount(或失败兜底)时释放。

**预热按需**:闸门只拦 DOM 写入;当 acquire 前探测到容器已被占用(`isContainerHeld`)时,`void enhancedFetch(entry)` 预热 entry HTML,使网络时间与前任 teardown 重叠(`makeFetchCacheable` 是全局 LRU,会与 loadEntry 内部 fetch 去重;缓存对 rejection 与无效 status 主动逐出,预热失败不会污染正式加载)。无竞争时不预热——loadEntry 马上就会自己发起请求,多发一份只会在失败场景翻倍重试、并在内存里多驻留一份未消费的响应体。

### 释放点修订(2026-07-27,实现时收紧)

Issue 原文的①段释放点是「`loadEntry` settle 即释放」。实现时发现该表述不精确:`loadEntry` 返回的 promise 在 **entry script 的 onload 即可 settle**(「complete the entry process in advance」,`loader/src/index.ts`),此刻 writable-dom 可能仍在写入 HTML 尾部节点。若此时释放,插队者的 `initContainer` 清容器后,前者的尾部节点会继续追加进来——**交错污染**,且因 `initializedContainers` 已含该容器,mount 不会触发 pure-HTML 重放来修复。

因此释放条件收紧为两个信号的合取:

1. entry lifecycles promise settle(loadApp 等待的那个信号);
2. DOM 流 settle——loader 新增可选回调 `LoaderOpts.onDOMStreamSettled`,约定**所有路径恰好通知一次**:流完整写完(含下述 post-stream 求值)、流中途出错、接线阶段同步抛错(自定义 streamTransformer 工厂抛错、body 已被锁定),或流根本未启动(fetch 失败/空 body)。

**「DOM 流 settle」不止于最后一个字节**(2026-07-28 二次收紧):module 脚本(引擎在流结束后按文档序求值)与 classic defer 脚本(流结束后拿到 blob src 才执行)都在最后一个字节之后运行,且都可能继续向容器写入(动态样式注入等)。若在它们完成前释放①,后继应用的 initContainer/流式写入会与这些「尾部写入」交错——正是闸门要防的竞态。故 settle 信号等到 `importDocumentModules()` settle 且各 defer 脚本的 load/error 事件落定后才发出(module/importmap 脚本被引擎中和为惰性元素,不产生 load 事件,由引擎 promise 覆盖)。若某个 defer 脚本的子资源请求永久悬挂,①随之延续——与永不关闭的 entry 流同类,应用自身仍可经①→②采纳正常 mount,只是后继应用严格排队(见 §已知限制)。

两个信号都无条件 settle(不依赖 mount/unmount 是否发生),①段的防饿死论证不受影响;唯一的例外类(悬挂的网络流)由采纳机制兜住应用自身、由 dev 等待诊断暴露后继排队。回调是通用的「DOM 写入阶段结束」信号,不携带 qiankun 语义。

### 归属令牌修订(2026-07-28,review 修订)

`initializedContainers` 原为 app 无关的 `WeakSet<HTMLElement>`,存在两处漏洞:(a) 插队窗口内容器被**另一应用**初始化后,原应用 mount 时 `has(container)` 命中、跳过重放,直接挂到别人的 DOM 上;(b) mount 失败的兜底释放跳过了 `clearContainer`(teardown 须持有②),WeakSet 条目残留,重试时跳过重放、挂到坏 DOM 上。修订为 `WeakMap<HTMLElement, token>`:每次 `loadApp` 持有唯一令牌,initContainer 写入令牌,mount 仅在**自己的令牌仍在**时才可跳过重放;失败兜底(`dropMountHold`)在令牌仍属于自己时主动逐出(令牌已被后继覆盖则不动)。

### 影响面评估

| 路径 | 现状 | 加闸后 |
|---|---|---|
| register 共享容器切换 | 流入→被抹→mount 二次渲染(pure HTML);动态样式靠 reattach 兜底 | 只渲染一次(`initializedContainers` 命中,mount 跳过 reload)、无闪烁、动态样式天然不丢 |
| register A→B→A 快速导航(B load 完成但未 mount 即切走) | B 的流式写入与 A 的 remount 竞态 | B 在 load settle 时已释放;A 的 remount 过闸串行执行,无死锁 |
| loadMicroApp 同名重复挂载 | 已有闸门 + load memoize | 无感知,等价于现有机制 |
| loadMicroApp 跨应用共享容器(含 remount) | 调用方不 await 即竞态 | load 临界区与 mount 占用期均过闸,自动串行化 |
| prefetch | 纯 fetch 预热,不碰 DOM | 零影响 |
| 多实例/多容器/嵌套 qiankun | — | 闸门按容器元素隔离,互不干扰 |

### 行为变更

1. **`loadMicroApp` 塞进被占用容器:静默踩掉 → 显式等待。** 把新应用塞进一个**仍被挂载中应用占用**且调用方从不 unmount 的容器,今天是静默踩掉(前应用沙箱仍活着,本就是坏状态),加闸后变为显式等待,等待期间该应用的 single-spa status 停在 `LOADING_SOURCE_CODE`(load 排队)或 mount 前的对应状态(mount 排队),调用方可观察。对策:dev 模式下等待超过 ~3s 打警告(`app B is waiting for container held by A — did you forget to unmount it?`),不设强制超时(正确性优先)。
2. **切换时序变化。** B 的脚本执行从「与 unmount(A) 并行」推迟到「unmount(A) 完成之后」,依赖该重叠时序的边缘用法会感知。总 wall-clock 大体不变甚至更好:今天是 max(unmount A, load B) 之后还要追加一整轮 pure-HTML 二次渲染,加闸后是 unmount(A) + load(B),省掉整轮浪费渲染。

changelog 需注明以上两点。

### 实现注记

- 闸门模块:`packages/qiankun/src/core/containerOccupancy.ts`;接入点全部在 `loadApp.ts`。`acquireContainer` 解析为 `ContainerHold`(`held` 查询 + 幂等 `release()`),`held` 与 release 的幂等标志同源,「是否仍持有」只有一个真相源。
- ①的 acquire 与释放信号接线之间存在同步抛错窗口(sandbox 插件 bootstrap 由 `createSandbox` 重抛、多实例 chunk-cache 清理等):该窗口由 try/catch 兜底,失败时先 best-effort dispose 沙箱再释放①,防止永久泄漏。
- mount/unmount 链的失败兜底通过包裹链内每个 hook 实现(`guardHooksWithMountHoldRelease`),`update` 生命周期同样纳入包裹(update reject 后 single-spa 拒绝 unmount 该 parcel,无人释放②)。`loader(true/false)` 指示器 hook 由 loadApp 收编进 mount 链内(`LoadableApp.loader`),位于包裹范围内——指示器是普通用户代码,抛错时同样走兜底释放,`registerMicroApps` 不再在链外拼接。
- **兜底先 teardown、再放行**:链中途失败时,guard 在仍持有②的窗口内 best-effort 执行 `unmountSandbox()`(拆掉容器实例方法 patch 与挂载点标记),然后才 `dropMountHold`。否则 SKIP_BECAUSE_BROKEN 的残留 patch 会把后继应用(尤其 sandbox:false、流式节点不带 passthrough 标记的)劫持进死应用的转译管线。loadApp 在 sandbox 关闭时也会给流式 nodeTransformer 的输出补打 passthrough 标记,恢复跨副本免疫。
- **teardown 写入以「仍持有②」为前提**(实现时由 e2e race 用例暴露、二次修订):single-spa 对 mount 失败的 parcel 仍会跑其 unmount 链,而此时兜底释放已把容器让给后继应用——链末尾的 `clearContainer` 若无条件执行,会把新持有者刚渲染的 live DOM 抹掉。故 unmount 链的 `clearContainer` 只在 `mountHold.held` 时执行;失去持有后的 teardown 只做应用/沙箱自身清理(unpatch 与 untag 均有 owner 守卫,不会误伤后继者)。
- passthrough 效果位必须保持 `Symbol.for` 注册符号(跨 qiankun 副本可读):兜底 teardown 尽力拆 patch,但另一份 qiankun 副本的残留 patch 仍可能存在,流式节点须能被其识别放行,见 insertion-point-ownership RFC。
- remount 的 pure-HTML 重放同样接 `onDOMStreamSettled` 并显式 await:脚本剥净使 entry promise 恰在整流后 settle 只是「碰巧成立」的不变量,显式等待把它变成结构保证。

### 已知限制

- **single-spa `dieOnTimeout`**:生命周期超时的 reject 发生在 hook **外部**(`reasonableTime` 竞速),链内每个 hook 都正常 resolve,guard 结构上感知不到,②不会被兜底释放;被放弃的链在闸门授予后照常恢复执行(全程持闸,不产生交错)。最终效果等价于「一个从未 unmount 的应用」:容器被其持有直到永远,dev 模式 3s 等待诊断可见。共享容器场景请勿开启 `dieOnTimeout`(默认关闭)。
- **悬挂的网络流**:entry 响应永不关闭、或某 defer 脚本的子资源请求永久悬挂时,①段随之延续。应用自身经①→②采纳仍可正常 mount/unmount(释放随 unmount 发生);仅当应用 load 完成却永不 mount(如 A→B→A 快速导航中的 B)时,后继应用会一直排队——同样由 dev 等待诊断暴露,不设强制超时(正确性优先)。

### 测试计划

- 现有 e2e 全绿;「loading-phase dynamic styles survive replacing another app in a shared container」用例从"靠 reattach 救回"升级为"根本不丢",并断言整个切换过程只发生一次流式渲染;
- 新增:
  - register A→B→A 快速导航:B load 完成但从未 mount,A 的 remount 不死锁、渲染正确(①段 release 的回归用例);
  - loadMicroApp 跨应用同容器不 await 的竞态用例(含 remount 场景);
  - A mount 链抛错后 B 不死锁;A unmount 链中途抛错后 B 不死锁(两类 `SKIP_BECAUSE_BROKEN` 兜底各一);
  - 闸门 FIFO 顺序、两段临界区 acquire/release 配对的单测(`containerOccupancy.test.ts`、`loadApp.containerGate.test.ts`)。

## 参考

- 竞态的完整分析与讨论见 #3138
- single-spa reroute 调度:`toLoadPromise` 立即启动、`tryToBootstrapAndMount` 等待 `unmountAllPromise`,且在 mount 前**复查 `shouldBeActive`**(load 完成但已不活跃的应用永不 mount——①段 release 时机的直接依据)
