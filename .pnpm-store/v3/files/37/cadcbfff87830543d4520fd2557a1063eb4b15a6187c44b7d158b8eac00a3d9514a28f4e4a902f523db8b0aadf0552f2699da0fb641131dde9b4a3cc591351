# ast-metadata-inferer

[![Test](https://github.com/amilajack/ast-metadata-inferer/actions/workflows/test.yml/badge.svg)](https://github.com/amilajack/ast-metadata-inferer/actions/workflows/test.yml)

A collection of metadata about browser API's. This collection is intended for tools that analyze JS. It currently supports `3993` compatibility records.

For all the API's it supports, it gives the

- AST node type of the API (`MemberExpression`, `NewExpression`, or `CallExpression`)
- Determines if an API is statically invoked (ex. `document.querySelector()`)
- Determines if an API is a CSS or JS API
- Provides compatibility information from `@mdn/browser-compat-data`

## Usage

```js
import AstMetadata from "ast-metadata-inferer";

const [firstRecord] = AstMetadata;
console.log(firstRecord);
// {
//   "language":"js-api",
//   "protoChain":["document","querySelector"],
//   "protoChainId":"document.querySelector",
//   "astNodeTypes":["MemberExpression"],
//   "isStatic":true,
//   "compat": {
//     support: {
//       chrome: {
//         version_added: "14"
//       },
//       chrome_android: { version_added: "18" },
//       ...
//     }
//   }
// }
```

## Support

If this project is saving you (or your team) time, please consider supporting it on Patreon 👍 thank you!

<p>
  <a href="https://www.patreon.com/amilajack">
    <img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160">
  </a>
</p>

## Related

- [eslint-plugin-compat](https://github.com/amilajack/eslint-plugin-compat)
- [compat-db](https://github.com/amilajack/compat-db)
