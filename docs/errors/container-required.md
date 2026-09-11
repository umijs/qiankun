# container-required: Missing app container

## Cause

Style isolation was enabled without a `container` option, or a DOM isolation plugin could not obtain a container while running or rebuilding side effects.

## Troubleshooting

1. Confirm that the host app has created the container and obtained an actual `HTMLElement`.
2. If `container` is an accessor function, confirm that it returns the correct element during plugin execution and mounting.
3. If you manage plugin lifecycles yourself, check that rebuild functions receive the container for the current mount.

## Solution

Initialize sandboxes that need DOM isolation after their containers are ready, and provide the current container for each mount and rebuild. Complete the micro app's unmount before the host app removes its container.

For JavaScript-only isolation, use a sandbox without a container and leave `styleIsolation` and container-dependent DOM plugins disabled.

## Related

- [Error codes and solutions](/errors/)
- [container-required：缺少应用容器](/zh-CN/errors/container-required)
