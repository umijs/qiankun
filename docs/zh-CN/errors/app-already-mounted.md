# app-already-mounted：微应用已挂载

## 触发原因

调用句柄的 `mount()` 时，轮到这次挂载执行时应用已经处于挂载状态。常见情形：

- `loadMicroApp` 返回的句柄会自动挂载，调用方又调用了一次 `mount()`；
- 对同一个句柄连续调用了两次 `mount()`，中间没有 `unmount()`。

句柄上的 `mount()` 和 `unmount()` 按调用顺序依次执行，每一次都要求应用处于对应的状态。

## 排查步骤

1. 检查是否在 `loadMicroApp` 之后又立即调用了 `mount()`。
2. 检查同一个句柄上的 `mount()`、`unmount()` 调用是否成对出现。
3. 结合 `getStatus()` 确认调用 `mount()` 时应用所处的状态。

## 解决办法

`loadMicroApp` 之后无需再调用 `mount()`，等待 `mountPromise` 即可。需要重新挂载时，先调用 `unmount()`，再调用 `mount()`。

## 相关内容

- [错误码与解决办法](/zh-CN/errors/)
- [app-already-mounted: Micro app already mounted](/errors/app-already-mounted)
