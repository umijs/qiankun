# compartment-disposed：隔离实例已销毁

## 触发原因

代码继续操作已经 `dispose()` 的 Compartment 或 ESM 执行实例，或者 `dispose()` 取消了尚未完成的经典脚本求值。

## 排查步骤

1. 根据调用栈确定失败的是脚本求值、模块导入还是其他实例操作。
2. 检查 `dispose()` 与异步任务的先后顺序，确认定时器、回调或未完成的 Promise 是否仍在使用旧实例。
3. 检查重新挂载流程是否错误地复用了已经销毁的实例。

## 解决办法

若任务需要正常完成，应等待求值或导入结束后再销毁实例。若销毁属于预期取消，应处理相应 Promise 的拒绝，并停止后续任务。

`dispose()` 是最终清理操作，与可再次挂载的 `unmount()` 不同。已经销毁的实例不能恢复；后续需要运行微应用时，应创建新实例并重新挂载。

## 相关内容

- [错误码与解决办法](/zh-CN/errors/)
- [compartment-disposed: Disposed isolation instance](/errors/compartment-disposed)
