# module-resolve-invalid：模块解析结果无效

## 触发原因

`resolveHook` 的返回值不是非空字符串。

## 排查步骤

1. 根据错误信息找到待解析说明符及其导入方地址。
2. 检查钩子的每个返回分支，确认没有返回 `undefined`、`null`、对象或空字符串。
3. 检查是否将钩子声明为 `async`。`resolveHook` 是同步接口，不能返回 Promise。

## 解决办法

让 `resolveHook(specifier, referrer)` 同步返回规范化后的非空说明符。URL 类导入可以用 `new URL(specifier, referrer).href` 解析；业务虚拟模块应返回稳定的规范键，并由 `modules` 或 `importHook` 提供对应内容。

## 相关内容

- [错误码与解决办法](/zh-CN/errors/)
- [module-resolve-invalid: Invalid module resolution result](/errors/module-resolve-invalid)
