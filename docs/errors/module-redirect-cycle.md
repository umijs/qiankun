# module-redirect-cycle: Module redirect cycle

## Cause

A module descriptor redirect chain reaches the same canonical specifier again, such as `a -> b -> a`.

## Troubleshooting

1. Follow the chain shown in the message through `modules` entries and `importHook` / `loadHook` results.
2. Check whether `{ specifier: target }` points back to itself or forms a cycle with another entry.
3. Check `resolveHook` results for aliases that normalize back into the same cycle.

## Solution

Remove self-references and cyclic redirects so that the chain ends at a descriptor containing `source` or `namespace`. Point aliases to an explicit final module instead of having them reference each other.

## Related

- [Error codes and solutions](/errors/)
- [module-redirect-cycle：模块重定向循环](/zh-CN/errors/module-redirect-cycle)
