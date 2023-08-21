# `@mdn/browser-compat-data`

[https://github.com/mdn/browser-compat-data](https://github.com/mdn/browser-compat-data)

This repository contains compatibility data for Web technologies.
Browser compatibility data describes which platforms (where "platforms" are
usually, but not always, web browsers) support particular Web APIs.

This data can be used in documentation, to build compatibility tables listing
browser support for APIs. For example:
[Browser support for WebExtension APIs](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Browser_support_for_JavaScript_APIs).

Read how this project is [governed](GOVERNANCE.md).

Chat on [chat.mozilla.org#mdn](https://chat.mozilla.org/#/room/#mdn:mozilla.org).

## Installation

You can install `@mdn/browser-compat-data` as a node package.

```
npm install @mdn/browser-compat-data
```

## Usage

```js
const bcd = require('@mdn/browser-compat-data');
bcd.css.properties.background;
// returns a compat data object (see schema)
```

## Package contents

The `@mdn/browser-compat-data` package contains a tree of objects, with support and browser data objects at their leaves. There are over 12,000 features in the dataset; this documentation highlights significant portions, but many others exist at various levels of the tree.

The definitive description of the format used to represent individual features and browsers is the [schema definitions](schemas/).

Apart from the explicitly documented objects below, feature-level support data may change at any time. See [_Semantic versioning policy_](#Semantic-versioning-policy) for details.

The package contains the following top-level objects:

### [`api`](api)

Data for [Web API](https://developer.mozilla.org/en-US/docs/Web/API) features.

### [`browsers`](browsers)

Data for browser and engine releases. See the [browser schema](schemas/browsers-schema.md) for details.

### [`css`](css)

Data for [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) features, including:

- `at-rules` - at-rules
- `properties` - properties
- `selectors` - selectors (such as basic selectors, combinators, or pseudo elements)
- `types` - types for rule values

### [`html`](html)

Data for [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) features, including:

- `elements` - Elements
- `global_attributes` - Global attributes
- `manifest` - Web App manifest keys

### [`http`](http)

Data for [HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP) features, including:

- `headers` - Request and response headers
- `methods` - Request methods
- `status` - Status codes

### [`javascript`](javascript)

Data for JavaScript language features, including:

- `builtins` - Built-in objects
- `classes` - Class definition features
- `functions` - Function features
- `grammar` - Language grammar
- `operators` - Mathematical and logical operators
- `statements` - Language statements and expressions

### [`mathml`](mathml)

Data for [MathML](https://developer.mozilla.org/en-US/docs/Web/MathML) features, including:

- `elements` - Elements

### [`svg`](svg)

Data for [SVG](https://developer.mozilla.org/en-US/docs/Web/SVG) features, including:

- `attributes` - Attributes
- `elements` - Elements

### [`webdriver`](webdriver)

Data for [WebDriver](https://developer.mozilla.org/en-US/docs/Web/WebDriver) features.

### [`webextensions`](webextensions)

Data for [WebExtensions](https://developer.mozilla.org/en-US/Add-ons/WebExtensions) features, including:

- `api` - WebExtension-specific APIs
- `manifest` - `manifest.json` keys

### [`xpath`](xpath)

Data for [XPath](https://developer.mozilla.org/en-US/docs/Web/XPath) features.

### [`xslt`](xslt)

Data for [XSLT](https://developer.mozilla.org/en-US/docs/Web/XSLT) features.

## Semantic versioning policy

For the purposes of [semantic versioning](https://semver.org/) (SemVer), the public API consists of:

- The high-level namespace objects documented in [_Package contents_](#Package-contents)
- The schema definitions for browser and support data structures

The details of browser compatibility change frequently, as browsers ship new features, standards organizations revise specifications, and Web developers discover new bugs. We routinely publish updates to the package to reflect these changes.

You should expect lower-level namespaces, feature data, and browser data to be added, removed, or modified at any time. That said, we strive to communicate changes and preserve backward compatibility; if you rely on a currently undocumented portion of the package and want SemVer to apply to it, please [open an issue](https://github.com/mdn/browser-compat-data/issues).

## Issues?

If you find a problem, please [file a bug](https://github.com/mdn/browser-compat-data/issues/new).

## Contributing

We're very happy to accept contributions to this data. See [Contributing to browser-compat-data](/docs/contributing.md) for more information.

## Projects using the data

Here are some projects using the data, as an [npm module](https://www.npmjs.com/browse/depended/@mdn/browser-compat-data) or directly:

- [Add-ons Linter](https://github.com/mozilla/addons-linter) - the Add-ons Linter is used on [addons.mozilla.org](https://addons.mozilla.org/) and the [web-ext](https://github.com/mozilla/web-ext/) tool. It uses browser-compat-data to check that the Firefox version that the add-on lists support for does in fact support the APIs used by the add-on.
- [caniuse](https://caniuse.com/) - In addition to the existing caniuse database, caniuse includes features from the MDN BCD project, formatted and interactive like any other caniuse support table.
- [CanIUse Embed](https://caniuse.bitsofco.de/) - Thanks to the inclusion of MDN BCD data in caniuse, this embed tool allows for embedding BCD data into any project.
- [Compat Report](https://addons.mozilla.org/en-US/firefox/addon/compat-report/) - Firefox Add-on that shows compatibility data for the current site in the developer tools.
- [compat-tester](https://github.com/SphinxKnight/compat-tester) - Scan local documents for compatibility issues.
- [Visual Studio Code](https://code.visualstudio.com) - Shows the compatibility information in [the code completion popup](https://code.visualstudio.com/updates/v1_25#_improved-accuracy-of-browser-compatibility-data).
- [webhint.io](https://webhint.io/docs/user-guide/hints/hint-compat-api/) - Hints to check if your CSS HTML and JavaScript have deprecated or not broadly supported features.
- [WebStorm](https://www.jetbrains.com/webstorm/whatsnew/#v2019-1-html-and-css) - JavaScript IDE allowing you to check whether all CSS properties you use are supported in the target browser version.
- [Hexo Plugin: hexo-compat-report](https://github.com/TimDaub/hexo-compat-report) - Allows to embed MDN's compatibility table in a hexo blog post.

## Acknowledgments

Thanks to:

<table>
  <tr align="center">
    <td>
      <img
        src="https://user-images.githubusercontent.com/498917/52569900-852b3080-2e12-11e9-9bd0-f1e256b13e53.png"
        height="86"
        alt="BrowserStack"
      />
      <p>
        The
        <a href="https://www.browserstack.com/open-source"
          >BrowserStack Open Source Program</a
        >
        for testing services
      </p>
    </td>
    <td>
      <img
        src="https://opensource.saucelabs.com/images/opensauce/powered-by-saucelabs-badge-white.png?sanitize=true"
        height="86"
        alt="Testing Powered By Sauce Labs"
      />
      <p>
        <a href="https://opensource.saucelabs.com/">Sauce Labs Open Source</a
        >
        for testing services
      </p>
    </td>
  </tr>
</table>
