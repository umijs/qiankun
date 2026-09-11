# entry-body-missing: Missing entry response body

## Cause

The HTML entry response has a `null` `Response.body`, so the loader cannot obtain a response stream for parsing.

Although the error message uses the word `empty`, this branch checks whether the body is `null`, not its length. A non-null readable stream containing zero bytes does not directly trigger this error.

## Troubleshooting

1. Check the request method and response status for a HEAD request or a response without a body, such as 204.
2. Inspect responses returned by custom `fetch` implementations, test doubles, and preloading logic. Check for `new Response(null)`.
3. Check redirects and gateway behavior to confirm that the final response provides HTML content.

## Solution

Make the entry GET request return a valid response with an HTML body. Custom `fetch` implementations and preloading logic must preserve the body. Use an HTML string or readable stream when mocking an entry response in tests. After correcting the response, also confirm that its HTML is the micro app entry.

## Related

- [Error codes and solutions](/errors/)
- [entry-body-missing：入口响应缺少正文流](/zh-CN/errors/entry-body-missing)
