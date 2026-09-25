# entry-script-failed: Entry script failed to load

## Cause

The classic script marked as the entry fired an `error` event, causing the loader to reject the entry loading promise. The message includes the HTML entry URL and the script URL.

This code corresponds to the entry script element's `error` event. It does not mean that every script runtime exception is converted to this error. ESM entries report execution results through their module import promises.

## Troubleshooting

1. Inspect requests for the URLs in the message. Check the script URL, response status, and response content.
2. Check console errors from the same time for CORS or Content Security Policy (CSP) restrictions on loading or execution.
3. If the URL has been transformed into a blob URL, use the original script URL and earlier logs to locate the source file.

## Solution

Correct the resource URL, server response, cross-origin access, or CSP configuration according to the browser's report, and address any reported script issue. Confirm that the entry script can load in the host app page before loading the micro app again.

## Related

- [Error codes and solutions](/errors/)
- [entry-script-failed：入口脚本加载失败](/zh-CN/errors/entry-script-failed)
