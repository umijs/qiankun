[![npm](https://img.shields.io/npm/v/pkg-install.svg?style=flat-square)](https://npmjs.com/package/pkg-install) [![npm](https://img.shields.io/npm/dt/pkg-install.svg?style=flat-square)](https://npmjs.com/package/pkg-install) [![npm](https://img.shields.io/npm/l/pkg-install.svg?style=flat-square)](/LICENSE) [![Build Status](https://travis-ci.org/dkundel/pkg-install.svg?branch=master)](https://travis-ci.org/dkundel/pkg-install) ![Codecov](https://img.shields.io/codecov/c/gh/dkundel/pkg-install.svg?style=flat-square)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors)

# pkg-install

> Easier installation of Node.js packages irrespective of the platform or package manager.

- Supports [npm](npmjs.com) and [yarn](yarnpkg.com)
- Easy to use promise-based API
- Uses [`execa`](npm.im/execa) under the hood

## Installation

```bash
npm install pkg-install
```

## Usage

### Install a set of known dependencies to a project

```js
const { install } = require('pkg-install');

(async () => {
  const { stdout } = await install(
    {
      twilio: '^3.1',
      'node-env-run': '~1',
      'pkg-install': undefined,
    },
    {
      dev: true,
      prefer: 'npm',
    }
  );
  console.log(stdout);
})();
```

### Run a project install of dependencies

```js
const { projectInstall } = require('pkg-install');

(async () => {
  const { stdout } = await projectInstall({
    prefer: 'yarn',
  });
  console.log(stdout);
})();
```

### Documentation

Full documentation of available functions and configuration can be found on:
[pkg-install.dkundel.com](https://pkg-install.dkundel.com/modules/pkg_install.html)

## Known Issues

### 1. Disparity in supported flags

At the current moment `yarn` has no equivalent flags for `--save-bundle` or `--no-save`. These will be ignored when `yarn` has been detected as package manager.

The flags that were ignored in the run are returned as the `ignoredFlags` property.

### 2. Different behavior of modifying `package.json`

This library uses `npm` and `yarn` under the hood and currently `npm install` and `yarn add` have different behaviors when passing versions to the package names

For example

```bash
npm install twilio^3.1 node-env-run~1 pkg-install
```

Will result in the following dependencies in the `package.json`:

```json
"dependencies": {
  "node-env-run": "^1.0.1",
  "pkg-install": "^0.1.1",
  "twilio": "^3.28.1"
}
```

While:

```bash
yarn add twilio@^3.1 node-env-run@~1 pkg-install
```

Will result in the following dependencies in the `package.json`:

```json
"dependencies": {
  "node-env-run": "~1",
  "pkg-install": "^0.1.1",
  "twilio": "^3.1"
}
```

## License

MIT

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table><tr><td align="center"><a href="https://dkundel.com"><img src="https://avatars3.githubusercontent.com/u/1505101?v=4" width="100px;" alt="Dominik Kundel"/><br /><sub><b>Dominik Kundel</b></sub></a><br /><a href="https://github.com/dkundel/pkg-install/commits?author=dkundel" title="Code">💻</a></td></tr></table>
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
