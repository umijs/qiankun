# container-head-missing: Missing container head node

## Cause

The sandbox accessed its proxied `document.head`, or attempted to restore head styles during remount, but the container lacked the `<qiankun-head>` node required by the container protocol.

## Troubleshooting

1. Check whether the host app cleared or replaced the container, or removed `<qiankun-head>`, while the micro app was running.
2. Check script execution and container preparation order. The node must be ready before code accesses `document.head`.
3. For standalone sandboxes, check `provisionContainerHead`. For HTML loaded through qiankun, check that the entry includes `<head>` and that streaming completed successfully.

## Solution

Keep the default `provisionContainerHead: true` for standalone sandboxes so that mounting prepares the node. Custom integrations that set it to `false` must prepare the required node before using DOM plugins.

When using qiankun's HTML loading pipeline, provide a complete entry containing `<head>` and let the loader create its container counterpart. Do not manually clear or rewrite the container while the micro app is running.

## Related

- [Error codes and solutions](/errors/)
- [container-head-missing：容器内缺少 head 节点](/zh-CN/errors/container-head-missing)
