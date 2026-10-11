# module-hooks-conflict: Conflicting module hooks

## Cause

The configuration provides both `importHook` and `loadHook`, but they do not reference the same function.

## Troubleshooting

1. Inspect module hooks in the top-level sandbox options and `compartmentOptions`.
2. Check whether configuration merging supplies both hook names.
3. Compare the actual function references. Separately created functions fail this check even if their implementations are identical.

## Solution

Prefer providing only `importHook`. If compatibility code must supply both names, assign the same function to both options instead of creating separate wrapper functions.

## Related

- [Error codes and solutions](/errors/)
- [module-hooks-conflict：模块加载钩子冲突](/zh-CN/errors/module-hooks-conflict)
