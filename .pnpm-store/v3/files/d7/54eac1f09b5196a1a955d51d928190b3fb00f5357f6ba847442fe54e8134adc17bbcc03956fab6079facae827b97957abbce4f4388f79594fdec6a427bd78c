# strip-literal

[![NPM version](https://img.shields.io/npm/v/strip-literal?color=a1b858&label=)](https://www.npmjs.com/package/strip-literal)

Strip comments and string literals from JavaScript code. Powered by [acorn](https://github.com/acornjs/acorn)'s tokenizer.

## Usage

<!-- eslint-disable no-template-curly-in-string -->

```ts
import { stripLiteral } from 'strip-literal'

stripLiteral('const foo = `//foo ${bar}`') // 'const foo = `       ${bar}`'
```

Comments, string literals will be replaced by spaces with the same length to keep the source map untouched.

## Functions

### `stripLiteralAcorn`

Strip literal using [Acorn](https://github.com/acornjs/acorn)'s tokenizer.

Will throw error if the input is not valid JavaScript.

[Source](./src/acorn.ts)

### `stripLiteralRegex`

Strip literal using RegExp.

This will be faster and can work on non-JavaScript input. But will have some caveats on distinguish strings and comments.

[Source](./src/regex.ts)

### `stripLiteral`

Strip literal from code.

Try to use `stripLiteralAcorn` first, and fallback to `stripLiteralRegex` if Acorn fails.

[Source](./src/index.ts)

### `createIsLiteralPositionAcorn`
Returns a function that returns whether the position is in a literal using [Acorn](https://github.com/acornjs/acorn)'s tokenizer.

Will throw error if the input is not valid JavaScript.

[Source](./src/acorn.ts)

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg'/>
  </a>
</p>

## License

[MIT](./LICENSE) License © 2022 [Anthony Fu](https://github.com/antfu)
