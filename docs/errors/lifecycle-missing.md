# lifecycle-missing: Missing lifecycle exports

## Cause

qiankun could not obtain a complete lifecycle object from the micro app entry. The entry's named exports, default export, the last global property written in the sandbox, and the global property named after the app all failed to provide `bootstrap`, `mount`, and `unmount` as functions.

## Troubleshooting

1. Check earlier console errors to confirm that the entry script loaded and executed successfully.
2. Inspect the deployed entry file and confirm that the build output exports the lifecycle functions.
3. Check the actual type of each field. The current validation requires three functions; missing fields and arrays of functions do not pass.

## Solution

An ESM entry can export the three lifecycle functions individually or default-export an object containing them. For a classic script entry, configure the bundler's library output to expose the complete lifecycle object to the sandbox. Rebuild and deploy after correcting the exports; declaring the functions without exporting them does not satisfy this requirement.

## Related

- [Error codes and solutions](/errors/)
- [lifecycle-missing：生命周期导出不完整](/zh-CN/errors/lifecycle-missing)
