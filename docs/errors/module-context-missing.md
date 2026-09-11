# module-context-missing: Missing module load context

## Cause

The dynamic import runtime bridge supplied a context identifier that has no registered module load context in the current instance. Normally generated runtime code should reference a context registered with its own instance.

The message's `credentials context` refers to an internal module loading context. It does not establish that login state or cookie configuration is incorrect.

## Troubleshooting

1. Preserve the complete message, stack trace, module URL, and qiankun version.
2. Check whether generated runtime modules were manually modified or copied from another instance.
3. Check whether precompiled artifacts are passed through public APIs, without reusing runtime code containing private instance identifiers.

## Solution

If runtime code was modified or copied across instances, regenerate artifacts from the original source and load them through the current instance's public interface.

If the issue reproduces without modified internal artifacts, report it to qiankun with minimal module source, the loading setup, version, and full stack trace. This error concerns an internal context constraint; changing application configuration is not a guaranteed fix.

## Related

- [Error codes and solutions](/errors/)
- [module-context-missing：模块加载上下文丢失](/zh-CN/errors/module-context-missing)
