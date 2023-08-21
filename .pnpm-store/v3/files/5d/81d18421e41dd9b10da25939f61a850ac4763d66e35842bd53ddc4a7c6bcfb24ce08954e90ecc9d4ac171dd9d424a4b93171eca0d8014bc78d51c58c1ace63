# Sylvanas

A tool to convert TypeScript to JavaScript with human-like code style.

## How to use

```bash
npm install --save-dev sylvanas
```

### sylvanas(files: string[], option?: Option)

```js
const sylvanas = require('sylvanas');

const files = glob.sync('**/*.@(ts|tsx)');

const fileList = sylvanas(files);

fileList.forEach(({ data }) => {
  console.log('Trans:', data);
});
```

### Option

#### cwd - string

The current working directory in which to search. Defaults to `process.cwd()`.

#### action - `none` | `write` | `overwrite`

Default `none`. Set what will Sylvanas do with files:

* `write`: Write new file with name of suffix `.js` or `.jsx`.
* `overwrite`: Like `write` but will remove origin files.

#### outDir - string

Set the write file folder. Defaults to `cwd`.

#### decoratorsBeforeExport - boolean

Same as [babel decoratorsbeforeexport](https://babeljs.io/docs/en/babel-plugin-proposal-decorators#decoratorsbeforeexport).
