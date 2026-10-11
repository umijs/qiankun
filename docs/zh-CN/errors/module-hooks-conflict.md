# module-hooks-conflict：模块加载钩子冲突

## 触发原因

同一配置同时提供了 `importHook` 和 `loadHook`，但两者不是同一个函数引用。

## 排查步骤

1. 检查沙箱顶层选项及 `compartmentOptions` 中的模块钩子配置。
2. 检查配置合并逻辑是否重复提供了新旧钩子名称。
3. 对比实际函数引用。即使函数实现相同，分别创建的函数也不能通过此校验。

## 解决办法

优先只提供 `importHook`。若兼容代码必须同时填写两个名称，应让它们引用同一个函数，避免分别创建包装函数。

## 相关内容

- [错误码与解决办法](/zh-CN/errors/)
- [module-hooks-conflict: Conflicting module hooks](/errors/module-hooks-conflict)
