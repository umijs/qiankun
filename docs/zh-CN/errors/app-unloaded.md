# app-unloaded：微应用已销毁

## 触发原因

微应用已经通过 `unload()`、`unloadMicroApp()` 或 `unloadApplication()` 销毁，相关代码仍在使用这一代实例：

- 调用旧句柄的 `mount()` 或 `update()`；
- 销毁发生时仍在等待的 `mountPromise` 被拒绝；
- 该实例尚未完成的加载请求被取消。

## 排查步骤

1. 根据调用栈找到仍在使用旧句柄的代码，例如组件卸载后仍会触发的回调或定时器。
2. 检查 `unload()` 与 `mount()`、`update()` 的调用顺序，确认是否存在并发操作。
3. 如果报错位置是在等待 `mountPromise`，确认这次取消是否符合预期。

## 解决办法

`unload()` 是最终清理，与之后还能重新挂载的 `unmount()` 不同。只是暂时隐藏应用时，应调用 `unmount()`；销毁之后需要再次运行，重新调用 `loadMicroApp` 创建新实例。

预期内的取消应捕获对应 Promise 的拒绝，并停止后续操作。

## 相关内容

- [错误码与解决办法](/zh-CN/errors/)
- [app-unloaded: Micro app unloaded](/errors/app-unloaded)
