# module-redirect-cycle：模块重定向循环

## 触发原因

模块描述符的重定向链中再次出现同一个规范化说明符，例如 `a -> b -> a`。

## 排查步骤

1. 按错误信息给出的重定向链检查 `modules` 条目及 `importHook` / `loadHook` 的返回值。
2. 检查 `{ specifier: target }` 是否指回自身，或与其他条目形成循环。
3. 检查 `resolveHook` 的规范化结果，确认不同别名没有被解析回同一条循环路径。

## 解决办法

移除自指或循环重定向，让重定向链最终落到包含 `source` 或 `namespace` 的模块描述符。对于别名，应指定明确的最终模块，而不是让别名互相引用。

## 相关内容

- [错误码与解决办法](/zh-CN/errors/)
- [module-redirect-cycle: Module redirect cycle](/errors/module-redirect-cycle)
