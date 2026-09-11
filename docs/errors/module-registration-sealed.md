# module-registration-sealed: Document module registration is closed

## Cause

The first call to `importDocumentModules()` closes the document module set to further registration. Calling `registerDocumentModule()` afterward throws this error.

## Troubleshooting

1. Check the order of these two methods in your custom loader or streaming integration.
2. Check whether `importDocumentModules()` runs before all document modules have been registered.
3. Look for asynchronous callbacks that submit additional document modules after importing begins.

## Solution

Register all modules in the current document before calling `importDocumentModules()`. Use the Compartment's `import()` or `load()` for modules needed on demand afterward. Document module registration cannot be reopened once it has ended.

## Related

- [Error codes and solutions](/errors/)
- [module-registration-sealed：文档模块注册已结束](/zh-CN/errors/module-registration-sealed)
