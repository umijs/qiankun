# app-not-mounted：微应用未挂载

## 触发原因

调用句柄的 `unmount()` 时，轮到这次卸载执行时应用并没有处于挂载状态，因此没有东西可以卸载：

- 应用从未挂载成功：加载、`bootstrap` 或 `mount` 失败了；
- 应用已经卸载，又调用了一次 `unmount()`。

如果是前一次挂载失败导致的，错误的 `cause` 就是那次挂载失败的错误，与 `mountPromise` 拒绝时给出的错误是同一个对象。

## 排查步骤

1. 查看错误的 `cause`。有值时，先按那次挂载失败的原因排查；它通常已经通过 `mountPromise` 报告过一次。
2. `cause` 为空时，检查是否有多处代码对同一个句柄调用了 `unmount()`，或者在卸载完成后又调用了一次。
3. 结合 `getStatus()` 确认调用 `unmount()` 时应用所处的状态。

## 解决办法

只对挂载中或已挂载的应用调用 `unmount()`，同一次挂载只卸载一次。已经在 `mountPromise` 上处理过挂载失败的代码，可以在 `unmount()` 被拒绝、且 `cause` 正是那次挂载错误时忽略这次拒绝。

## 相关内容

- [错误码与解决办法](/zh-CN/errors/)
- [app-not-mounted: Micro app not mounted](/errors/app-not-mounted)
