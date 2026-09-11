# module-rewrite-invalid: Invalid module rewrite spans

## Cause

During ESM source rewriting, two edit spans partially overlap without a valid containment relationship, or a plain text replacement span contains child edits. This violates an internal constraint of the rewriting engine.

## Troubleshooting

1. Preserve the original module source, module URL, qiankun version, and complete stack trace.
2. Reduce the reproduction around the reported location while retaining relevant dynamic `import()`, static import, or `import.meta` syntax.
3. Check whether code already rewritten by qiankun at runtime was supplied again as original source.

## Solution

If runtime output was supplied again, use the original source instead, or generate precompiled source with the public `precompileModuleSource` API and pass it through a complete module descriptor.

If valid original source still triggers the error, report it to qiankun with a minimal reproduction and the diagnostic details above. An engine fix may be required; general application configuration changes are not a guaranteed solution. Do not remove internal checks to bypass the error.

## Related

- [Error codes and solutions](/errors/)
- [module-rewrite-invalid：模块改写区间异常](/zh-CN/errors/module-rewrite-invalid)
