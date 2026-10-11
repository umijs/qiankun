# module-specifier-reserved：使用了保留模块说明符

## 触发原因

应用的静态导入、动态导入，或 `resolveHook` 的返回值使用了以 `__qk_` 开头的模块说明符。此前缀保留给 qiankun 的内部模块。

## 排查步骤

1. 根据错误信息定位源码中的导入及相关模块重定向。
2. 检查 `resolveHook` 是否生成了以 `__qk_` 开头的名称。
3. 检查是否将某个实例运行时生成的代码或私有说明符复制到了应用源码或其他实例中。

## 解决办法

应用应使用业务模块名称或正式 URL，让 qiankun 生成内部说明符。需要预编译时，应使用公开的 `precompileModuleSource` API，并按模块描述符契约传入产物。

不要自行生成保留前缀，也不要跨实例复用运行时生成的私有说明符。

## 相关内容

- [错误码与解决办法](/zh-CN/errors/)
- [module-specifier-reserved: Reserved module specifier](/errors/module-specifier-reserved)
