# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this
project adheres to [Semantic Versioning](http://semver.org/).

<!-- ## Unreleased -->

## [0.5.10] 2021-09-27

- The `--horizons` flag and `horizon` config setting has been replaced with
  `--auto-sample-conditions` and `autoSampleConditions`. `--horizon` will
  continue to work for backwards compatibility, but please do update to the new
  name.

- Copyright notice owner changed from "The Polymer Project Authors" to "Google
  LLC". Trivial reformatting for `LICENSE` file to match spdx.org version.
  Source license headers replaced with concise SPDX-style.

- Fix bug where log files would be created with '\' backslash names instead of
  nested directories.

- Fix bug where `browser.addArguments` JSON config setting did not work for
  Firefox.

- Add `browser.profile` JSON config setting that sets the browser profile
  directory. Currently supported in Chrome and Firefox.

- Upgrade dependencies.

## [0.5.9] 2021-04-22

- Fix bug where git URLs like `git@github.com/MyOrg/my-repo.git` were treated as
  local paths.

- Bump dependencies.

## [0.5.8] 2021-02-16

- Upgrade `systeminformation` dependency with security vulnerability alert.

## [0.5.7] 2021-02-11

- Add `trace` config to capture performance logs from browsers (currently only
  Chromium based browsers).

## [0.5.6] 2021-02-03

- Fix bug in dependency swapping where local file paths in `git` dependencies
  would fail to install if they were relative.

- Fix "should be object" exception during result table formatting.

## [0.5.5] 2020-09-21

- A warning is now displayed when there are multiple performance marks or
  measurements being retrieved with the same name.

## [0.5.4] 2020-09-18

- Fix bug where a unique browser would not be launched if the only difference
  between browser configurations was `binary`, `addArguments`,
  `removeArguments`, `cpuThrottlingRate` or `preferences`.

## [0.5.3] 2020-09-11

- Fix `git checkout` errors when using advanced git-based dependency swapping.

- When using dependency swapping, a fresh install will now be performed whenever
  any dependency version has changed (either in the original `package.json`, or
  in the dependency-swap configuration). The `label` field is no longer
  significant in this respect.

- When using advanced git-based dependency swapping `{kind: 'git', ...}`, a
  query will now always be made to the remote git repo to determine if the
  configured `ref` is still up to date. If it is stale, a fresh install will be
  performed.

- When using dependency swapping, temp directories will be deleted when there is
  an installation failure, so that they are not re-used in a broken state.

## [0.5.2] 2020-09-08

- Add advanced configuration for cloning a git repo as a dependency swap for
  monorepos and other git layouts where the `package.json` is not at the root.
- Add support for `name` property to measurement config
- Include `measurement` object for each benchmark in JSON results output
- Fix errors with auto-installing WebDriver modules using Yarn
  ([#186](https://github.com/Polymer/tachometer/issues/186])).

## [0.5.1] 2020-08-19

- Fix `Package "chromedriver" cannot be installed on demand` and similar errors
  affecting Node versions 10 and below
  ([#182](https://github.com/Polymer/tachometer/issues/182)).

## [0.5.0] 2020-08-06

- Change WebDriver-related packages for Chrome, Firefox and IE to be installed
  on-demand. This saves a lot of time during the intial installation of the
  `tachometer` package. See the README for more details.

## [0.4.21] 2020-07-23

- Add ability to specify multiple measurements from the same page load by
  setting the `measurement` property in the JSON config file to an array. For
  example, you can now use the performance API to define two intervals on the
  same page, and compare them to each other or to other pages.

- Add ability to pull measurements from the browser performance measurement API,
  e.g.:

  ```
  "benchmarks": [
    {
      "measurement": {
        "mode": "performance",
        "entryName": "foo"
      }
    }
  ]
  ```

- Add new syntax for specifying benchmarks:

  ```
  "benchmarks": [
    {
      "measurement": {
        "mode": "callback"
      }
    },
    {
      "measurement": {
        "mode": "expression",
        "expression": "window.tachometerResult"
      }
    }
  ]
  ```

- Fix `main` entry in package.json to point to `lib/cli.js`.

- Added more fields to JSON output file to more closely match table printed to the console

- Fix default benchmark name on Windows to replace all `\\` with `/`. For
  example, previously a benchmark name might have been
  `"src/test\\data\\for-loop.html"`. With this fix, the benchmark name will now be
  `"src/test/data/for-loop.html"`.

## [0.4.20] 2020-07-09

- Added `--csv-file-raw` flag, which outputs a CSV file containing all raw
  measurement results for each benchmark. Columns correspond to benchmarks, rows
  correspond to sample measurements in milliseconds. The first row is a header
  row containing the name of each benchmark.

- Added `samples` property to the JSON file emitted by `--json-file` which
  contains all raw sample measurements in milliseconds.

## [0.4.19] 2020-07-07

- Fix failures to launch recent versions of Firefox and Safari.
- Remove unnecessary dependencies.

## [0.4.18] 2020-04-10

### Fixed

- When using custom package versions, Tachometer will resolve bare modules in the temporary npm install folders, instead of the root folder. This change fixes a bug where different package versions should have resolved to different files but Tachometer always resolved to the version in the root folder, not the temporary npm install folder.

## [0.4.17] 2020-04-03

### Added

- Added `preferences` property to Firefox browser config, which can be used
  to set any option that is usually set from the about:config page.

### Fixed

- Files are no longer cached by the server when using `--manual` mode.
- Running `npm` commands is fixed on Windows
- Improved Windows support in build scripts

## [0.4.16] 2019-12-20

### Changed

- Chromedriver dependency is no longer pinned to a particular major version,
  so fresh installs should be compatible with the latest version of Chrome.

## [0.4.15] 2019-11-20

### Added

- Added `cpuThrottlingRate` option to `browser` JSON config (Chrome only),
  which emulates slow CPUs by the given factor (1 for no throttle, 2 for
  2x slowdown, etc).

### Fixed

- Improved reliability of measurements by opening new tabs with
  `noopener=yes`. This change appears to reduce or eliminate shared code
  caching across benchmarks, removing effects such as the order of
  benchmarks reliably producing different results.

- Fixed bug where the `measurementExpression` setting was not being
  respected when passed via the config file (vs the command line flag).

## [0.4.14] 2019-11-05

### Added

- Added a `measurementExpression` option for overriding the default
  global measurement of `window.tachometerResult` to an arbitrary expression.

## [0.4.13] 2019-09-12

### Added

- It is now possible to control the binary location and arguments to the
  browser by using the following settings in a `browser` section of the JSON
  config file:
  - `binary` (Chrome and Firefox) specifies a custom path to the browser
    binary.
  - `addArguments` (Chrome and Firefox) specifies additional arguments to
    pass to the binary.
  - `removeArguments` (Chrome) specifies arguments to _omit_ that WebDriver
    would usually include by default.

## [0.4.12] 2019-08-21

### Added

- A notification will now be printed if the current version of tachometer is
  outdated.

- Added `--json-file` flag which outputs raw statistical results to a JSON
  file (similar to the `--csv-file` flag). This supersedes the `--save` flag,
  which will be removed in the next major version.

### Fixed

- Fix bug where the `--manual`, `--csv-file`, and other flags were ignored if
  a config file was in use.

## [0.4.11] 2019-08-13

### Fixed

- Fix bug where using `--config` always fails with an error about
  `--resolve-bare-modules`.

- Fix bug where a JavaScript syntax error could result in an empty page being
  served ([#106](https://github.com/Polymer/tachometer/issues/106)).

## [0.4.10] 2019-07-31

### Added

- Added `--csv-file` flag which writes raw NxN results result table to a CSV
  file. ([#88](https://github.com/Polymer/tachometer/issues/88)).

- During auto-sampling, the time remaining before the timeout will be hit is
  now displayed ([#107](https://github.com/Polymer/tachometer/issues/107)).

### Fixed

- `--resolve-bare-modules` (with no value) no longer disables bare module
  resolution ([#99](https://github.com/Polymer/tachometer/issues/99)).

- Fix bug where 404s results in e.g. `Unknown response type undefined for /favicon.ico` errors logged to the console.
  ([#105](https://github.com/Polymer/tachometer/issues/105)).

## [0.4.9] 2019-07-11

- Responses from the local server are now cached in-memory. This greatly
  improves performance when bare module resolution is enabled, because HTML
  and JS is now only parsed once per benchmark, instead of once per sample.

- Do one throw-away warm-up run for each benchmark before starting
  measurement. This should help reduce measurement variation due to any
  cold-start effects that would have previously applied to the first sample.

- Fix bug where timeouts in measuring the `window.tachometerResult` global
  (e.g. when the server is down) could cause a crash with `Reduce of empty array with no initial value`
  ([#86](https://github.com/Polymer/tachometer/issues/86)).

- When using custom package versions, the temporary NPM install directories
  will now be re-used less aggressively across runs of tachometer. If any of
  the specified dependency versions have changed, or if the version of
  tachometer being used has changed, then a fresh NPM install will be
  performed. Additionally, the new `--force-clean-npm-install` flag can be
  used to force a clean NPM install every time.

- Fix bug where the `node_modules` directory could sometimes be mounted at the
  URL `//node_modules`, causing benchmarks to fail to load dependencies.

- Don't show URL query parameters in the result table when an alias was
  specified.

- Fix bug where browser in result table was displayed as `[object Object]`
  instead of its name.

## [0.4.8] 2019-07-08

- Fix bug where `<html>`, `<body>`, and `<head>` tags could be removed from
  HTML files served by the built-in static server (via version bump to
  `koa-node-resolve`).

- Browsers in the JSON config file can now be specified as an object, e.g.
  `browser: { name: 'chrome', headless: true }`. The string format is still
  supported, though more options will be supported by the object form (e.g.
  `windowSize` below).

- Added `--window-size` flag and `browser:{ windowSize: {width, height} }`
  JSON config file property to control browser window size. Browsers will be
  resized to 1024x768 by default.

## [0.4.7] 2019-06-14

- Add support for Internet Explorer in Windows (`--browser=ie`).

## [0.4.6] 2019-06-12

- Add support for Edge in Windows (`--browser=edge`).

- Add support for remote WebDriver with e.g.
  `--browser=chrome@http://<remote-selenium-server>`. See `README` for more
  details.

- Add `--measure=global` mode, where the benchmark assigns an arbitrary
  millisecond result to `window.tachometerResult`, and tachometer will poll
  until it is found.

- Fix bug where no browser other than Chrome could be launched.

- Fix bug where process did not exit on most exceptions.

## [0.4.5] 2019-06-10

- Fix `$schema` property URL automatically added to config files.

## [0.4.4] 2019-06-08

- Remove noisy debug logging for bare module import resolution.

## [0.4.3] 2019-06-08

- Automatically update config files with a `$schema` property, pointing to the
  JSON schema for the file on unpkg. This will provide in-editor contextual
  help for many IDEs (like VS Code) when writing tachometer config files.

- Add `tachometer` bin alias, so that `npx tachometer` can be used (previously
  the binary could only be invoked as `tach`).

## [0.4.2] 2019-06-07

- Add `--config` flag to configure benchmarks through a JSON configuration
  file instead of flags. See `README.md` for format details.

- JavaScript imports with bare module specifiers (e.g. `import {foo} from 'mylib';`) will now be automatically transformed to browser-compatible path
  imports using Node-style module resolution (e.g.`import {foo} from './node_modules/mylib/index.js';`). This feature can be disabled with the
  `--resolve-bare-modules=false` flag or the `resolveBareModules: false` JSON
  config file property.

## [0.4.1] 2019-06-06

- A `label` can now be set in the GitHub check JSON object.

## [0.4.0] 2019-05-08

- Benchmarks are now specified as arbitrary paths to local HTML files or
  directories (containing an `index.html`). Benchmarks are no longer required
  to be laid out in any particular directory structure. E.g. you can now
  invoke as `tach foo.html` or `tach myalias=foo/bar/baz`. There is no longer
  a concept of _implementations_.

- Local benchmark files can now include URL query strings (e.g. `tach foo.html?a=b`) which will be included as-is in the launched URL.

- Variants no longer exist. Use URL query strings instead (see above).

- Custom package versions are now installed to the system's temp dir, instead
  of into the project directory.

- `--manual` mode no longer shows benchmark names and other metadata (but it
  should only be used for testing the web server anyway since it has no
  statistical significance).

- Add `--version` flag.

## [0.3.0] 2019-05-03

- Full URLs are now supported (e.g. `tach http://example.com`). Only
  first-contentful-paint measurement is supported in this case.

- Benchmarks are now specified as bare arguments (e.g. `tach foo`) instead of
  with the `--name` flag.

- Fix race condition where benchmarks that returned results quickly might not
  be registered.

## [0.2.1] 2019-04-26

- Added support for measuring First Contentful Paint (FCP), enabled by setting
  the `--measure=fcp` flag.

## [0.2.0] 2019-04-25

- Result differences are now reported as an NxN matrix, so that every result
  can be compared to any other result. The `--baseline` flag has been removed,
  since it is no longer necessary.

- GitHub Check report is now formatted as HTML instead of ASCII.

- Remove standard deviation column, as it is rarely useful to interpret
  directly.

## [0.1.0] 2019-04-17

- Initial release.
