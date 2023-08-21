# 🚫💩 lint-staged [![Build Status for Linux](https://travis-ci.org/okonet/lint-staged.svg?branch=master)](https://travis-ci.org/okonet/lint-staged) [![Build Status for Windows](https://ci.appveyor.com/api/projects/status/github/okonet/lint-staged?branch=master&svg=true)](https://ci.appveyor.com/project/okonet/lint-staged) [![npm version](https://badge.fury.io/js/lint-staged.svg)](https://badge.fury.io/js/lint-staged) [![Codecov](https://codecov.io/gh/okonet/lint-staged/branch/master/graph/badge.svg)](https://codecov.io/gh/okonet/lint-staged)

Run linters against staged git files and don't let :poop: slip into your code base!

---

## 🚧 Help test `lint-staged@next`!

Version 10 of `lint-staged` is coming with changes that help it run faster on large git repositories and prevent loss of data during errors. Please help test the `next` version and report any inconsistencies in our [GitHub Issues](https://github.com/okonet/lint-staged/issues):

**Using npm**

    npm install --save-dev lint-staged@next

**Using yarn**

    yarn add -D lint-staged@next

### Notable changes

- A git stash is created before running any tasks, so in case of errors any lost changes can be restored easily (and automatically unless lint-staged itself crashes)
- Instead of write-tree/read-tree, `lint-staged@next` uses git stashes to hide unstaged changes while running tasks against staged files
  - This results in a performance increase of up to 45x on very large repositories
- The behaviour of committing modifications during tasks (eg. `prettier --write && git add`) is different. The current version creates a diff of these modifications, and applies it against the original state, silently ignoring any errors. The `next` version leaves modifications of staged files as-is, and then restores all hidden unstaged changes as patch. If applying the patch fails due to a merge conflict (because tasks have modified the same lines), a 3-way merge will be retried. If this also fails, the entire commit will fail and the original state will be restored.
  - **TL;DR** the `next` version will never skip committing any changes by tasks (due to a merge conflict), but might fail in very complex situations where unstaged changes cannot be restored cleanly. If this happens to you, we are very interested in a repeatable test scenario.

---

[![asciicast](https://asciinema.org/a/199934.svg)](https://asciinema.org/a/199934)

## Why

Linting makes more sense when run before committing your code. By doing so you can ensure no errors go into the repository and enforce code style. But running a lint process on a whole project is slow and linting results can be irrelevant. Ultimately you only want to lint files that will be committed.

This project contains a script that will run arbitrary shell tasks with a list of staged files as an argument, filtered by a specified glob pattern.

## Related blogs posts and talks

* [Make Linting Great Again](https://medium.com/@okonetchnikov/make-linting-great-again-f3890e1ad6b8#.8qepn2b5l)
* [Running Jest Tests Before Each Git Commit](https://benmccormick.org/2017/02/26/running-jest-tests-before-each-git-commit/)
* [AgentConf: Make Linting Great Again](https://www.youtube.com/watch?v=-mhY7e-EsC4)
* [SurviveJS Interview](https://survivejs.com/blog/lint-staged-interview/)

> If you've written one, please submit a PR with the link to it!

## Installation and setup

The fastest way to start using lint-staged is to run following command in your terminal:

```bash
npx mrm lint-staged
```

It will install and configure [husky](https://github.com/typicode/husky) and lint-staged depending on code quality tools from `package.json` dependencies so please make sure you install (`npm install --save-dev`) and configure all code quality tools like [Prettier](https://prettier.io), [ESlint](https://eslint.org) prior that.

Don't forget to commit changes to `package.json` to share this setup with your team!

Now change a few files, `git add` or `git add --patch` some of them to your commit and try to `git commit` them.

See [examples](#examples) and [configuration](#configuration) for more information.

## Changelog

See [Releases](https://github.com/okonet/lint-staged/releases)

## Command line flags

```bash
$ npx lint-staged --help
Usage: lint-staged [options]

Options:
  -V, --version        output the version number
  -c, --config [path]  Path to configuration file
  -r, --relative       Pass relative filepaths to tasks
  -x, --shell          Skip parsing of tasks for better shell support
  -q, --quiet          Disable lint-staged’s own console output
  -d, --debug          Enable debug mode
  -h, --help           output usage information
```

* **`--config [path]`**: This can be used to manually specify the `lint-staged` config file location. However, if the specified file cannot be found, it will error out instead of performing the usual search. You may pass a npm package name for configuration also.
* **`--relative`**: By default filepaths will be passed to the linter tasks as *absolute*. This flag makes them relative to `process.cwd()` (where `lint-staged` runs).
* **`--shell`**: By default linter commands will be parsed for speed and security. This has the side-effect that regular shell scripts might not work as expected. You can skip parsing of commands with this option.
* **`--quiet`**: By default `lint-staged` will print progress status to console while running linters. Use this flag to supress all output, except for linter scripts.
* **`--debug`**: Enabling the debug mode does the following:
  * `lint-staged` uses the [debug](https://github.com/visionmedia/debug) module internally to log information about staged files, commands being executed, location of binaries, etc. Debug logs, which are automatically enabled by passing the flag, can also be enabled by setting the environment variable `$DEBUG` to `lint-staged*`.
  * Use the [`verbose` renderer](https://github.com/SamVerschueren/listr-verbose-renderer) for `listr`.

## Configuration

Starting with v3.1 you can now use different ways of configuring it:

* `lint-staged` object in your `package.json`
* `.lintstagedrc` file in JSON or YML format
* `lint-staged.config.js` file in JS format
* Pass a configuration file using the `--config` or `-c` flag

See [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) for more details on what formats are supported.

Configuration should be an object where each value is a command to run and its key is a glob pattern to use for this command. This package uses [micromatch](https://github.com/micromatch/micromatch) for glob patterns.

#### `package.json` example:

```json
{
  "lint-staged": {
    "*": "your-cmd"
  }
}
```

#### `.lintstagedrc` example

```json
{
  "*": "your-cmd"
}
```

This config will execute `your-cmd` with the list of currently staged files passed as arguments.

So, considering you did `git add file1.ext file2.ext`, lint-staged will run the following command:

`your-cmd file1.ext file2.ext`

## Filtering files

Linter commands work on a subset of all staged files, defined by a _glob pattern_. `lint-staged´ uses [micromatch](https://github.com/micromatch/micromatch) for matching files with the following rules:

* If the glob pattern contains no slashes (`/`), micromatch's `matchBase` option will enabled, so globs match a file's basename regardless of directory:
  * **`"*.js"`** will match all JS files, like `/test.js` and `/foo/bar/test.js`
  * **`"!(*test).js"`**. will match all JS files, except those ending in `test.js`, so `foo.js` but not `foo.test.js`
* If the glob pattern does contain a slash (`/`), it will match for paths as well:
  * **`"/*.js"`** will match all JS files in the git repo root, so `/test.js` but not `/foo/bar/test.js`
  * **`"foo/**/*.js"`** will match all JS files inside the`/foo`directory, so`/foo/bar/test.js`but not`/test.js`

When matching, `lint-staged` will do the following

* Resolve the git root automatically, no configuration needed.
* Pick the staged files which are present inside the project directory.
* Filter them using the specified glob patterns.
* Pass absolute paths to the linters as arguments.

**NOTE:** `lint-staged` will pass _absolute_ paths to the linters to avoid any confusion in case they're executed in a different working directory (i.e. when your `.git` directory isn't the same as your `package.json` directory).

Also see [How to use `lint-staged` in a multi package monorepo?](#how-to-use-lint-staged-in-a-multi-package-monorepo)

### Ignoring files

The concept of `lint-staged` is to run configured linter (or other) tasks on files that are staged in git. `lint-staged` will always pass a list of all staged files to the task, and ignoring any files should be configured in the task itself.

Consider a project that uses [`prettier`](https://prettier.io/) to keep code format consistent across all files. The project also stores minified 3rd-party vendor libraries in the `vendor/` directory. To keep `prettier` from throwing errors on these files, the vendor directory should be added to prettier's ignore configuration, the `.prettierignore` file. Running `npx prettier .` will ignore the entire vendor directory, throwing no errors. When `lint-staged` is added to the project and configured to run prettier, all modified and staged files in the vendor directory will be ignored by prettier, even though it receives them as input.

In advanced scenarios, where it is impossible to configure the linter task itself to ignore files, but some staged files should still be ignored by `lint-staged`, it is possible to filter filepaths before passing them to tasks by using the function syntax. See [Example: Ignore files from match](#example-ignore-files-from-match).

## What commands are supported?

Supported are any executables installed locally or globally via `npm` as well as any executable from your $PATH.

> Using globally installed scripts is discouraged, since lint-staged may not work for someone who doesn’t have it installed.

`lint-staged` uses [execa](https://github.com/sindresorhus/execa#preferlocal) to locate locally installed scripts. So in your `.lintstagedrc` you can write:

```json
{
  "*.js": "eslint --fix"
}
```

Pass arguments to your commands separated by space as you would do in the shell. See [examples](#examples) below.

Starting from [v2.0.0](https://github.com/okonet/lint-staged/releases/tag/2.0.0) sequences of commands are supported. Pass an array of commands instead of a single one and they will run sequentially. This is useful for running autoformatting tools like `eslint --fix` or `stylefmt` but can be used for any arbitrary sequences.

## Using JS functions to customize linter commands

When supplying configuration in JS format it is possible to define the linter command as a function which receives an array of staged filenames/paths and returns the complete linter command as a string. It is also possible to return an array of complete command strings, for example when the linter command supports only a single file input.

```ts
type LinterFn = (filenames: string[]) => string | string[]
```

### Example: Wrap filenames in single quotes and run once per file

```js
// .lintstagedrc.js
module.exports = {
  '**/*.js?(x)': filenames => filenames.map(filename => `prettier --write '${filename}'`)
}
```

### Example: Run `tsc` on changes to TypeScript files, but do not pass any filename arguments

```js
// lint-staged.config.js
module.exports = {
  '**/*.ts?(x)': () => 'tsc -p tsconfig.json --noEmit'
}
```

### Example: Run eslint on entire repo if more than 10 staged files

```js
// .lintstagedrc.js
module.exports = {
  '**/*.js?(x)': filenames => (filenames.length > 10 ? 'eslint .' : `eslint ${filenames.join(' ')}`)
}
```

### Example: Use your own globs

```js
// lint-staged.config.js
const micromatch = require('micromatch')
module.exports = {
  '*': allFiles => {
    const match = micromatch(allFiles, ['*.js', '*.ts'])
    return match.map(file => `eslint ${file}`)
  }
}
```

### Example: Ignore files from match

If for some reason you want to ignore files from the glob match, you can use `micromatch.not()`:

```js
// lint-staged.config.js
const micromatch = require('micromatch')
module.exports = {
  '*.js': files => {
    // from `files` filter those _NOT_ matching `*test.js`
    const match = micromatch.not(files, '*test.js')
    return match.map(file => `eslint ${file}`)
  }
}
```

Please note that for most cases, globs can achieve the same effect. For the above example, a matching glob would be `!(*test).js`.

### Example: Use relative paths for commands

```js
const path = require('path')
module.exports = {
  '*.ts': absolutePaths => {
    const cwd = process.cwd()
    const relativePaths = absolutePaths.map(file => path.relative(cwd, file))
    return `ng lint myProjectName --files ${relativePaths.join(' ')}`
  }
}
```

## Reformatting the code

Tools like [Prettier](https://prettier.io), ESLint/TSLint, or stylelint can reformat your code according to an appropriate config by running `prettier --write`/`eslint --fix`/`tslint --fix`/`stylelint --fix`. After the code is reformatted, we want it to be added to the same commit. This can be done using following config:

```json
{
  "*.js": ["prettier --write", "git add"]
}
```

Starting from v8, lint-staged will stash your remaining changes (not added to the index) and restore them from stash afterwards if there are partially staged files detected. This allows you to create partial commits with hunks using `git add --patch`. See the [blog post](https://medium.com/@okonetchnikov/announcing-lint-staged-with-support-for-partially-staged-files-abc24a40d3ff)

## Examples

All examples assuming you’ve already set up lint-staged and husky in the `package.json`.

```json
{
  "name": "My project",
  "version": "0.1.0",
  "scripts": {
    "my-custom-script": "linter --arg1 --arg2"
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {}
}
```

_Note we don’t pass a path as an argument for the runners. This is important since lint-staged will do this for you._

### ESLint with default parameters for `*.js` and `*.jsx` running as a pre-commit hook

```json
{
  "*.{js,jsx}": "eslint"
}
```

### Automatically fix code style with `--fix` and add to commit

```json
{
  "*.js": ["eslint --fix", "git add"]
}
```

This will run `eslint --fix` and automatically add changes to the commit.

### Reuse npm script

If you wish to reuse a npm script defined in your package.json:

```json
{
  "*.js": ["npm run my-custom-script --", "git add"]
}
```

The following is equivalent:

```json
{
  "*.js": ["linter --arg1 --arg2", "git add"]
}
```

### Use environment variables with linting commands

Linting commands _do not_ support the shell convention of expanding environment variables. To enable the convention yourself, use a tool like [`cross-env`](https://github.com/kentcdodds/cross-env).

For example, here is `jest` running on all `.js` files with the `NODE_ENV` variable being set to `"test"`:

```json
{
  "*.js": ["cross-env NODE_ENV=test jest --bail --findRelatedTests"]
}
```

### Automatically fix code style with `prettier` for javascript + flow, typescript, markdown or html

```json
{
  "*.{js,jsx}": ["prettier --write", "git add"]
}
```

```json
{
  "*.{ts,tsx}": ["prettier --write", "git add"]
}
```

```json
{
  "*.{md,html}": ["prettier --write", "git add"]
}
```

### Stylelint for CSS with defaults and for SCSS with SCSS syntax

```json
{
  "*.css": "stylelint",
  "*.scss": "stylelint --syntax=scss"
}
```

### Run PostCSS sorting, add files to commit and run Stylelint to check

```json
{
  "*.scss": ["postcss --config path/to/your/config --replace", "stylelint", "git add"]
}
```

### Minify the images and add files to commit

```json
{
  "*.{png,jpeg,jpg,gif,svg}": ["imagemin-lint-staged", "git add"]
}
```

<details>
  <summary>More about <code>imagemin-lint-staged</code></summary>

[imagemin-lint-staged](https://github.com/tomchentw/imagemin-lint-staged) is a CLI tool designed for lint-staged usage with sensible defaults.

See more on [this blog post](https://medium.com/@tomchentw/imagemin-lint-staged-in-place-minify-the-images-before-adding-to-the-git-repo-5acda0b4c57e) for benefits of this approach.

</details>

### Typecheck your staged files with flow

```json
{
  "*.{js,jsx}": ["flow focus-check", "git add"]
}
```

## Frequently Asked Questions

### Can I use `lint-staged` via node?

Yes!

```js
const lintStaged = require('lint-staged')

try {
  const success = await lintStaged()
  console.log(success ? 'Linting was successful!' : 'Linting failed!')
} catch(e) {
  // Failed to load configuration
  console.error(e)
}
```

Parameters to `lintStaged` are equivalent to their CLI counterparts:

```js
const success = await lintStaged({
  configPath: './path/to/configuration/file',
  shell: false,
  quiet: false,
  debug: false
})
```

You can also pass config directly with `config` option:


```js
const success = await lintStaged({
  config: {
    '*.js': 'eslint --fix'
  },
  shell: false,
  quiet: false,
  debug: false
})
```

### Using with JetBrains IDEs _(WebStorm, PyCharm, IntelliJ IDEA, RubyMine, etc.)_

_**Update**_: The latest version of JetBrains IDEs now support running hooks as you would expect.

When using the IDE's GUI to commit changes with the `precommit` hook, you might see inconsistencies in the IDE and command line. This is [known issue](https://youtrack.jetbrains.com/issue/IDEA-135454) at JetBrains so if you want this fixed, please vote for it on YouTrack.

Until the issue is resolved in the IDE, you can use the following config to work around it:

husky v1.x

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "post-commit": "git update-index --again"
    }
  }
}
```

husky v0.x

```json
{
  "scripts": {
    "precommit": "lint-staged",
    "postcommit": "git update-index --again"
  }
}
```

_Thanks to [this comment](https://youtrack.jetbrains.com/issue/IDEA-135454#comment=27-2710654) for the fix!_

### How to use `lint-staged` in a multi package monorepo?

Starting with v5.0, `lint-staged` automatically resolves the git root **without any** additional configuration. You configure `lint-staged` as you normally would if your project root and git root were the same directory.

If you wish to use `lint-staged` in a multi package monorepo, it is recommended to install [`husky`](https://github.com/typicode/husky) in the root package.json.
[`lerna`](https://github.com/lerna/lerna) can be used to execute the `precommit` script in all sub-packages.

Example repo: [sudo-suhas/lint-staged-multi-pkg](https://github.com/sudo-suhas/lint-staged-multi-pkg).

### Can I lint files outside of the current project folder?

tl;dr: Yes, but the pattern should start with `../`.

By default, `lint-staged` executes linters only on the files present inside the project folder(where `lint-staged` is installed and run from).
So this question is relevant _only_ when the project folder is a child folder inside the git repo.
In certain project setups, it might be desirable to bypass this restriction. See [#425](https://github.com/okonet/lint-staged/issues/425), [#487](https://github.com/okonet/lint-staged/issues/487) for more context.

`lint-staged` provides an escape hatch for the same(`>= v7.3.0`). For patterns that start with `../`, all the staged files are allowed to match against the pattern.
Note that patterns like `*.js`, `**/*.js` will still only match the project files and not any of the files in parent or sibling directories.

Example repo: [sudo-suhas/lint-staged-django-react-demo](https://github.com/sudo-suhas/lint-staged-django-react-demo).
