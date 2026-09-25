# sandbox-mount-conflict：沙箱挂载状态冲突

## 触发原因

调用沙箱控制器的 `mount()` 时，沙箱不处于可挂载的状态：

- 上一次 `mount()` 还没有完成；
- `unmount()` 正在执行；
- 沙箱已经挂载，但还没有卸载。

一个沙箱在同一时刻只能挂载到一个容器。该错误通常出现在独立使用 `createSandbox` 的场景：并发调用了 `mount()`，或者在未卸载时重复挂载。

## 排查步骤

1. 根据错误信息确认冲突的状态：`is already mounting`、`is currently unmounting` 或 `is already mounted`。
2. 检查调用方是否等待上一次 `mount()` 或 `unmount()` 返回的 Promise 完成后，才发起下一次操作。
3. 检查是否有多处代码共用同一个控制器，并各自调用 `mount()`。

## 解决办法

按「挂载、卸载、再挂载」的顺序串行调用，并等待每一步的 Promise 完成。需要同时在多个容器中运行时，为每个容器创建独立的沙箱。

## 相关内容

- [错误码与解决办法](/zh-CN/errors/)
- [sandbox-mount-conflict: Sandbox mount state conflict](/errors/sandbox-mount-conflict)
