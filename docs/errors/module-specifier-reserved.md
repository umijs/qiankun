# module-specifier-reserved: Reserved module specifier

## Cause

An application static import, dynamic import, or `resolveHook` result uses a module specifier starting with `__qk_`. This prefix is reserved for qiankun's internal modules.

## Troubleshooting

1. Use the error message to locate the import in application source and any related module redirects.
2. Check whether `resolveHook` generates names starting with `__qk_`.
3. Check whether runtime-generated code or private specifiers from one instance were copied into application source or another instance.

## Solution

Use application module names or regular URLs and let qiankun generate its internal specifiers. For precompilation, use the public `precompileModuleSource` API and supply the artifact through the module descriptor contract.

Do not generate reserved prefixes yourself or reuse runtime-generated private specifiers across instances.

## Related

- [Error codes and solutions](/errors/)
- [module-specifier-reserved：使用了保留模块说明符](/zh-CN/errors/module-specifier-reserved)
