# entry-duplicate: Duplicate entry scripts

## Cause

A single HTML entry contains multiple external scripts that qiankun recognizes as entry scripts. The loader throws this error when it encounters the second external script with an `entry` attribute.

## Troubleshooting

1. Inspect the HTML response in the network panel and find external scripts with an `entry` attribute.
2. Check the bundler plugin configuration for duplicate markers added by both the plugin and the HTML template.
3. Identify which script exports the lifecycle functions, distinguishing it from runtime and shared dependency scripts.

## Solution

Keep the `entry` attribute only on the actual app entry. Other scripts can remain in the HTML without that marker. If a bundler plugin generates the markers, correct its configuration or the HTML template so that subsequent builds do not recreate the duplicate.

## Related

- [Error codes and solutions](/errors/)
- [entry-duplicate：入口脚本重复](/zh-CN/errors/entry-duplicate)
