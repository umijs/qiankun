# module-descriptor-invalid：模块描述符无效

## 触发原因

`modules` 中的描述符，或 `importHook` / `loadHook` 的返回值，不符合模块描述符要求：

- 描述符必须是非 `null` 对象，且必须在 `source`、`namespace`、`specifier` 三个字段中恰好提供一个；
- `source` 必须是字符串或结构完整的 `ModuleSource`；
- `namespace` 必须是非 `null`、非数组的对象，普通对象也可以使用；
- 重定向的 `specifier` 必须是非空字符串。

## 排查步骤

1. 根据错误信息中的模块说明符和字段名，定位 `modules` 条目或钩子返回值。
2. 检查描述符是否误混用了多个形式，或直接返回了源码字符串。
3. 使用预编译产物时，确认没有遗漏或修改 `ModuleSource` 字段。

## 解决办法

根据模块来源返回 `{ source: code }`、`{ namespace: exports }` 或 `{ specifier: target }` 中的一种。钩子应返回解析为描述符的 Promise。预编译模块应通过公开的 `precompileModuleSource` 生成完整产物，再放入 `source` 字段，不要手工拼接缺少字段的对象。

## 相关内容

- [错误码与解决办法](/zh-CN/errors/)
- [module-descriptor-invalid: Invalid module descriptor](/errors/module-descriptor-invalid)
