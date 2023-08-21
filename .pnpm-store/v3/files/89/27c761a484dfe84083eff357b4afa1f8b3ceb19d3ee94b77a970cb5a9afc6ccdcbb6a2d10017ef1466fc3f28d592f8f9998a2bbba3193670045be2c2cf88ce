# import-html-entry
Treats the index html as manifest and loads the assets(css,js), get the exports from entry script.

```html
<!-- subApp/index.html -->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>test</title>
</head>
<body>

<!-- mark the entry script with entry attribute -->
<script src="https://unpkg.com/mobx@5.0.3/lib/mobx.umd.js" entry></script>
<script src="https://unpkg.com/react@16.4.2/umd/react.production.min.js"></script>
</body>
</html>
```

```js
import importHTML from 'import-html-entry';

importHTML('./subApp/index.html')
    .then(res => {
        console.log(res.template);

        res.execScripts().then(exports => {
            const mobx = exports;
            const { observable } = mobx;
            observable({
                name: 'kuitos'
            })	
        })
});
```

## API

  - [importHTML](#importhtmlurl-opts)
  - [importEntry](#importentryentry-opts)
  - [execScripts](#execscriptsentry-scripts-proxy-opts)


#### importHTML(url, opts?)

##### Parameters
- url - `string` - required, URL of the index HTML.
- opts - `ImportEntryOpts` - optional, Load configuration.

##### Return
- `Promise<IImportResult>`


##### Type
- ImportEntryOpts
    - fetch - `typeof window.fetch | { fn?: typeof window.fetch, autoDecodeResponse?: boolean }` - optional, Custom fetch method.
        - autoDecodeResponse - optional, Auto decode when the charset is not `utf-8`(like `gbk` or `gb2312`), default is `false`.
    - getPublicPath - `(entry: Entry) => string` - optional, Customize the assets public path.
    - getTemplate - `(tpl: string) => string` - optional, Customize the HTML template before proceeding.

- IImportResult
    - template - `string` - Processed HTML template.
    - assetPublicPath - `string` - Public path for assets.
    - getExternalScripts - `Promise<string[]>` - Scripts URL from template.
    - getExternalStyleSheets - `Promise<string[]>` - StyleSheets URL from template.
    - execScripts - `(sandbox?: object, strictGlobal?: boolean, execScriptsHooks?: ExecScriptsHooks): Promise<unknown>` - the return value is the last property on `window` or `proxy window` which set by the entry script.
        - sandbox - optional, Window or proxy window.
        - strictGlobal - optional, Strictly enforce the `sandbox`.

- ExecScriptsHooks <span id="ExecScriptsHooks" />
    - beforeExec - `(code: string, script: string) => string | void` - optional, call it before executing each script, if `return value` is a string, replace `code` with `return value`.
        - code - The inline script as a string.
        - script - The URL of external script.
    - afterExec - `(code: string, script: string) => void` - optional, call it after executing each script, and the call will stop if the execution error occurs.
        - code - The inline script as a string.
        - script - The URL of external script.

##### Usage
Treats the index html as manifest and loads the assets(css,js), get the exports from entry script.

##### Sample
```js
import importHTML from 'import-html-entry';

const opts = {
    fetch: {
        fn: (...args) => window.fetch(...args),
        autoDecodeResponse: true,
    },
    getPublicPath: (entry) => `${entry}/newPublicPath/`,
    getTemplate: (tpl) => tpl.replace(/SOME_RULES/, '\n//Replaced\n'),
}

importHTML('./subApp/index.html')
    .then(res => {
        res.execScripts().then(exports => {
            console.log(exports);
        })
});
```


#### importEntry(entry, opts?)

##### Parameters
- entry - `Entry` - required, URL of the index HTML or assets.
- opts - `ImportEntryOpts` - optional, Load configuration.

##### Return
- `Promise<IImportResult>`

##### Type
- Entry - `string | { styles?: string[], scripts?: string[], html?: string }` - When type as string, importEntry will run as importHTML, otherwise will load scripts and add styleSheets in your HTML string which you're provided or not.
    - styles - The URL for styles.
    - scripts - The URL for scripts.
    - html - The HTML template as a string, default is empty string.

> Other type as same as [importHTML](#importhtmlurl-opts).

##### Usage
Loads the assets(css,js) and embed into HTML template, get the exports from entry script.

##### Sample
```js
import { importEntry } from 'import-html-entry';

const opts = {
    fetch: {
        fn: (...args) => window.fetch(...args),
        autoDecodeResponse: true,
    },
    getPublicPath: (entry) => `${entry}/newPublicPath/`,
    getTemplate: (tpl) => tpl.replace(/SOME_RULES/, '\n//Replaced\n'),
}

const entryOpts = {
    styles: [
        'https://unpkg.com/antd@3.13.6/dist/antd.min.css',
    ],
    scripts: [
        'https://unpkg.com/react@16.4.2/umd/react.production.min.js'
    ],
    html: `<!DOCTYPE html>
            <head>
                <meta charset="UTF-8">
            </head>
            <body>
                <div id="root"></div>
            </body>
        </html>`
}

importEntry('./subApp/index.html')
    .then(res => {
        res.execScripts().then(exports => {
            console.log(exports);
        })
});
```

#### execScripts(entry, scripts, proxy, opts?)

##### Parameters
- entry - `string` - required, The URL of entry assets (will use last of scripts when entry is null).
- scripts - `string[]` - required, The URL for scripts (should always include entry when entry is valid URL).
- proxy - `Window` - required, Window or proxy window.
- opts - `ExecScriptsOpts` - optional, Exec configuration.

##### Return
- `Promise<T>` - The returned value is the last property on `window` or `proxy window` which set by the entry script.

##### Type
- ExecScriptsOpts
    - fetch - `typeof window.fetch` - optional, Custom fetch method.
    - strictGlobal - `boolean` - optional, Strictly enforce the `sandbox`.
	- success - `(exports: unknown) => void` - optional, Use callback to get the result when successfully.
        - exports - Same as the return value.
	- error - `CallableFunction` - optional, Use callback to get the result when error.
    - [ExecScriptsHooks](#ExecScriptsHooks).

##### Usage
Loads the scripts by URL on the custom sandbox, get the exports from entry script.

##### Sample
```js
import { execScripts } from 'import-html-entry';

const scripts = [
    'https://demo.com/entry.js',
    'https://unpkg.com/react@16.4.2/umd/react.production.min.js'
]

execScripts(
    'https://demo.com/entry.js',
    scripts,
    windows, // or custom sandbox
    {
        fetch: (...args) => window.fetch(...args),,
        strictGlobal: true,
        success: () => {},
        error: () => {},
    }
);
```
