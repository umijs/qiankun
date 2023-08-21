# koa-node-resolve

Middleware for Koa servers that resolves Node package specifiers in standard JS modules to relative paths for use on the web.

The following import uses a _bare module specifier_, which won't currently load natively in browsers (until [import maps](https://www.chromestatus.com/feature/5315286962012160) are available):

```js
import { foo } from "stuff";
```

`koa-node-resolve` solves this problem by resolving `stuff` using the same rules as [Node `require()`](https://nodejs.org/api/modules.html#modules_all_together), and transforming the import specifier to a path that can be loaded natively by any browser that [supports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#Browser_compatibility) standard JS modules:

```js
import { foo } from "./node_modules/stuff/index.js";
```

Because this is middleware, you can use it in a simple static file server as well as a proxy server sitting in front of a test server such as the one `karma` starts up. (See [karma testing setup](#karma-testing-setup) below.)

Note: HTML and JavaScript are parsed on every request for those content-types, it is intended for use in development context to facilitate build-free testing/iteration as opposed to in a high volume production web server.

## Installation

```sh
$ npm install --save koa-node-resolve
```

## Usage

Create your own mini-development server in file `./dev-server.js`. This one depends on `koa` and `koa-static`, so you'll need to `npm install --save-dev koa koa-static` for your project to use it.

```js
const Koa = require('koa');
const staticFiles = require('koa-static');
const { nodeResolve } = require('koa-node-resolve');

const server = new Koa()
  .use(nodeResolve())
  .use(staticFiles('.'))
  .listen(3000);
```

```sh
$ node dev-server.js
```

Now you can serve up your web assets and Node package specifiers will be transformed on request.

## Configuration

`nodeResolve(options={})`

### Options

 - `root` the on-disk directory that maps to the served root URL, used to resolve module specifiers on the filesystem.  In most cases this should match the root directory configured in your downstream static file server middleware.

 - `logger` an alternative logger to use (`console` is the default).  The logger will receive `error()` to record exceptions during parsing/transforming of JavaScript modules, `warn()` when a specifier is unresolvable, `info()` to report URLs with transformed content, `debug()` to report all Node module specifier resolutions.  All log messages are prefixed with `[koa-node-resolve]`.  To disable all logging, provide `false`.

 - `logLevel` (defaults to `warn`) sets the minimum level of severity for an event to be logged.  Options in order of severity: `debug`, `info`, `warn`, `error`.

 - `htmlParser` function to convert HTML source to a `Parse5.DefaultTreeNode`.  The default implementation is equivalent to:
    ```js
    const { parse } = require('parse5');

    nodeResolve({ htmlParser: parse);
    ```

 - `htmlSerializer` function to generate string from AST of `Parse5.DefaultTreeNode`.  The default implementation is equivalent to:
    ```js
    const { serialize } = require('parse5');
    import { removeFakeRootElements } = 'koa-node-resolve/lib/support/parse5-utils';

    nodeResolve({ htmlSerializer: (ast) => {
      // Don't emit parse5's hallucenated <html>, <head> and <body> tags.
      removeFakeRootElements(ast);
      return serialize(ast); 
    });
    ```
    Maybe you don't *want* to remove the generated `<html>`, `<head>` and `<body>` tags-- you can provide an htmlSerializer function that doesn't do that then.
 
 - `jsParser` function to convert JavaScript module source to a `Babel.Node`.  The default implementation is equivalent to:
    ```js
    const { parse } = require('@babel/parse');

    nodeResolve({
      jsParser: (source) => parse(source, {
        sourceType: 'unambiguous'
      })
    });
    ```
    The most common reason to provide your own JavaScript parser function is to enable the middleware to process content which has syntax requiring babel syntax plugins that your project is making use of, such as decorators, dynamic imports or import meta etc.

 - `jsSerializer` function to generate output string from AST of `Babel.Node`.  The default implementation is equivalent to:
    ```js
    const serialize = require('@babel/generator');

    nodeResolve({ jsSerializer: (ast) => serialize(ast).code })
    ```
    The [@babel/generator documentation](https://babeljs.io/docs/en/babel-generator) shows many options available for tweaking output.  Maybe you want to generate source maps and embed them in the response; you could do that here.

## Karma Testing Setup

In a `karma` setup, your `karma.conf.js` file could create the Koa server before exporting the config. The Koa server uses the `koa-proxy` package (therefore `npm install --save-dev koa-proxy`) in between the browser and the Karma server, transforming all the Node package specifiers encountered in documents located under the `base/` URL namespace, which is a special Karma behavior for partitioning the package resources under test from Karma support resources.

```js
const Koa = require('koa');
const mount = require('koa-mount');
const proxy = require('koa-proxy');
const { nodeResolve } = require('koa-node-resolve');

const server = new Koa()
  .use(mount('/base', nodeResolve()))
  .use(proxy({ host: 'http://127.0.0.1:9876' }))
  .listen(9877);

module.exports = config => {
  config.set({
    upstreamProxy: {
      hostname: '127.0.0.1',
      port: 9877,
    },
    files: [
      { pattern: 'test/**/*.js', type: 'module' },
      { pattern: '**/*.js', included: false },
      { pattern: 'node_modules/**/*', included: false },
    ],
  });
};
```

In this setup, the Koa proxy server that runs the Node resolution middleware will be on port 9877 and the Karma server will be on port 9876, so be sure to open up `http://127.0.0.1:9877` in your browser rather than `http://127.0.0.1:9876`. The `upstreamProxy` configuration block tells Karma, when it launches browsers, to points them to the Koa app instead of directly to the Karma server.

Note also that in this configuration its important to tell Karma that the test files are modules and to serve those up, but to list the other files, like the ones in `node_modules` as available but not "included" (i.e. Karma can serve them by request, but shouldn't add inline dependencies on them when generating its "context" HTML).
