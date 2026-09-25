# sandbox-mount-conflict: Sandbox mount state conflict

## Cause

`mount()` was called on a sandbox controller that is not in a mountable state:

- The previous `mount()` has not finished.
- `unmount()` is still running.
- The sandbox is already mounted and has not been unmounted.

A sandbox can be mounted into only one container at a time. This error usually appears when `createSandbox` is used on its own and `mount()` is called concurrently, or called again without unmounting first.

## Troubleshooting

1. Use the error message to identify the conflicting state: `is already mounting`, `is currently unmounting`, or `is already mounted`.
2. Check that each call waits for the promise returned by the previous `mount()` or `unmount()` before starting the next operation.
3. Check whether several pieces of code share one controller and each call `mount()`.

## Solution

Call mount, unmount, and mount again in sequence, and wait for each promise to settle. To run in several containers at the same time, create a separate sandbox for each container.

## Related

- [Error codes and solutions](/errors/)
- [sandbox-mount-conflict：沙箱挂载状态冲突](/zh-CN/errors/sandbox-mount-conflict)
