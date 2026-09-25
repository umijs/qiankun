# app-teardown-failed：微应用清理失败

## 触发原因

销毁微应用的最后一步清理抛出了非 `Error` 类型的值，例如字符串。这一步包括沙箱自身的清理和自定义沙箱插件的 `dispose` 钩子。

`unmount` 生命周期以及 `beforeUnmount`、`afterUnmount` 钩子中的异常会先由 single-spa 包装成 `Error`，不会使用该错误码。清理抛出 `Error` 实例时，qiankun 会原样传出该错误。

即使出现该错误，销毁流程也已经执行完毕，旧实例不能再使用。

## 排查步骤

1. 错误信息中带有被抛出的原始值，据此检查自定义沙箱插件的 `dispose` 钩子，找出抛出该值的位置。
2. 如果插件在 `dispose` 中调用了其他库的清理方法，确认这些方法是否会抛出字符串或普通对象。

## 解决办法

修复清理逻辑中的异常，并统一抛出 `Error` 实例，以保留调用栈和原始信息。需要再次运行微应用时，重新调用 `loadMicroApp` 创建新实例。

## 相关内容

- [错误码与解决办法](/zh-CN/errors/)
- [app-teardown-failed: Micro app teardown failed](/errors/app-teardown-failed)
