# Changes to CSS Blank Pseudo

### 3.0.3 (February 5, 2022)

- Rebuild of browser polyfills

### 3.0.2 (January 2, 2022)

- Removed Sourcemaps from package tarball.
- Moved CLI to CLI Package. See [announcement](https://github.com/csstools/postcss-plugins/discussions/121).

### 3.0.1 (December 27, 2021)

- Fixed: require/import paths for browser script

### 3.0.0 (December 13, 2021)

- Breaking: require/import paths have changed
- Changed: new polyfill CDN urls.
- Changed: Supports Node 12+ (major).
- Updated: documentation

**Migrating to 3.0.0**

PostCSS plugin :

```diff
- const postcssBlankPseudo = require('css-blank-pseudo/postcss');
+ const postcssBlankPseudo = require('css-blank-pseudo');
```

Browser Polyfill :

```diff
- const cssBlankPseudo = require('css-blank-pseudo');
+ const cssBlankPseudo = require('css-blank-pseudo/browser');
```

_The old CND url is now deprecated and will be removed in a next major release._
_It will continue to work for now._

```diff
- <script src="https://unpkg.com/css-blank-pseudo/browser"></script>
+ <script src="https://unpkg.com/css-blank-pseudo/dist/browser-global.js"></script>
```

Browser Polyfill IE :

_The polyfill for IE is now the same as the general polyfill_

```diff
- const cssBlankPseudo = require('css-blank-pseudo');
+ const cssBlankPseudo = require('css-blank-pseudo/browser');
```

_The old CND url is now deprecated and will be removed in a next major release._
_It will continue to work for now._

```diff
- <script src="https://unpkg.com/css-blank-pseudo/browser-legacy"></script>
+ <script src="https://unpkg.com/css-blank-pseudo/dist/browser-global.js"></script>
```

### 2.0.0 (September 16, 2021)

- Changed: Supports PostCSS 8.3+ (major).
- Changed: Supports Node 10+ (major).

### 1.0.0 (June 10, 2019)

- Updated: `postcss` to 7.0.16 (patch)
- Updated: Node 8+ compatibility (major)

### 0.1.4 (November 17, 2018)

- Update documentation

### 0.1.3 (November 17, 2018)

- Improve CLI usage

### 0.1.2 (November 17, 2018)

- Provide a version specifically for Internet Explorer 11

### 0.1.1 (November 17, 2018)

- Update documentation

### 0.1.0 (November 17, 2018)

- Initial version
