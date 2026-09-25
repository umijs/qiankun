# module-descriptor-invalid: Invalid module descriptor

## Cause

A descriptor in `modules`, or a value returned by `importHook` / `loadHook`, does not satisfy the module descriptor contract:

- The descriptor must be a non-null object containing exactly one of `source`, `namespace`, or `specifier`.
- `source` must be a string or a structurally complete `ModuleSource`.
- `namespace` must be a non-null, non-array object. Ordinary objects are accepted.
- A redirect's `specifier` must be a non-empty string.

## Troubleshooting

1. Use the module specifier and field name in the message to locate the `modules` entry or hook result.
2. Check whether the descriptor combines multiple forms or the hook returns a source string directly.
3. For precompiled modules, check whether any `ModuleSource` fields were omitted or modified.

## Solution

Return one of `{ source: code }`, `{ namespace: exports }`, or `{ specifier: target }` according to the module source. Hooks should return a promise that resolves to the descriptor. Use the public `precompileModuleSource` API to generate a complete precompiled artifact and place it in `source`; do not manually assemble an object with missing fields.

## Related

- [Error codes and solutions](/errors/)
- [module-descriptor-invalid：模块描述符无效](/zh-CN/errors/module-descriptor-invalid)
