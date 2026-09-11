# module-unresolved：模块说明符无法解析

## 触发原因

默认模块解析器遇到裸模块说明符，但微应用的导入映射（import map）和 `modules` 配置均未命中，且该说明符不能按 URL 形式解析。

## 排查步骤

1. 查看错误信息中的说明符与导入方地址，检查名称、大小写和依赖子路径。
2. 检查微应用自己的 import map 和 `modules` 配置，确认包含相应条目。
3. 若只在主应用页面配置了 import map，检查是否也向微应用的模块解析流程提供了对应映射。

## 解决办法

为微应用的 import map 添加 `imports` 条目，或在 `modules` 中提供相应描述符。自定义模块来源时，也可提供一致的 `resolveHook`，并通过 `modules` 或 `importHook` 提供模块内容。

对于构建生成的入口，可将依赖打包，或输出为可访问的 URL 导入。主应用页面上的 import map 不会自动成为此默认解析器的应用映射。

## 相关内容

- [错误码与解决办法](/zh-CN/errors/)
- [module-unresolved: Unresolved module specifier](/errors/module-unresolved)
