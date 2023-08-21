# stylelint-declaration-block-no-ignored-properties

[![NPM version](https://img.shields.io/npm/v/stylelint-declaration-block-no-ignored-properties.svg)](https://www.npmjs.com/package/stylelint-declaration-block-no-ignored-properties)
[![Build Status](https://github.com/kristerkari/stylelint-declaration-block-no-ignored-properties/workflows/Tests/badge.svg)](https://github.com/kristerkari/stylelint-declaration-block-no-ignored-properties/actions?workflow=Tests)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)
[![Downloads per month](https://img.shields.io/npm/dm/stylelint-declaration-block-no-ignored-properties.svg)](http://npmcharts.com/compare/stylelint-declaration-block-no-ignored-properties)

Original rule: [stylelint/declaration-block-no-ignored-properties](https://github.com/stylelint/stylelint/tree/7.13.0/lib/rules/declaration-block-no-ignored-properties).

Disallow property values that are ignored due to another property value in the same rule.

```css
a { display: inline; width: 100px; }
/**                  ↑
 *       This property */
```

Certain property value pairs rule out other property value pairs, causing them to be ignored by the browser. For example, when an element has display: inline, any further declarations about width, height and margin-top properties will be ignored. Sometimes this is confusing: maybe you forgot that your margin-top will have no effect because the element has display: inline, so you spend a while struggling to figure out what you've done wrong. This rule protects against that confusion by ensuring that within a single rule you don't use property values that are ruled out by other property values in that same rule.

The rule complains when it finds:

-   `display: inline` used with `width`, `height`, `margin`, `margin-top`, `margin-bottom`, `overflow` (and all variants).
-   `display: list-item` used with `vertical-align`.
-   `display: block` used with `vertical-align`.
-   `display: flex` used with `vertical-align`.
-   `display: table` used with `vertical-align`.
-   `display: table-*` (except `table-caption`) used with `margin`.
-   `display: table-*` (except `table-cell`) used with `padding`.
-   `display: table-*` (except `table-cell`) used with `vertical-align`.
-   `display: table-(row|row-group)` used with `width`, `min-width` or `max-width`.
-   `display: table-(column|column-group)` used with `height`, `min-height` or `max-height`.
-   `float: left` and `float: right` used with `vertical-align`.
-   `position: static` used with `top`, `right`, `bottom`, `left` or `z-index`.
-   `position: absolute` used with `float`, `clear` or `vertical-align`.
-   `position: fixed` used with `float`, `clear` or `vertical-align`.
-   `list-style-type: none` used with `list-style-image`.
-   `overflow: visible` used with `resize`.

## Installation

```
npm install stylelint-declaration-block-no-ignored-properties --save-dev
```

## Usage

```js
// .stylelintrc
{
  "plugins": [
    "stylelint-declaration-block-no-ignored-properties"
  ],
  "rules": {
    "plugin/declaration-block-no-ignored-properties": true,
  }
}
```

## Options

### `true`

The following patterns are considered violations:

```css
a { display: inline; width: 100px; }
```

`display: inline` causes `width` to be ignored.

```css
a { display: inline; height: 100px; }
```

`display: inline` causes `height` to be ignored.

```css
a { display: inline; margin: 10px; }
```

`display: inline` causes `margin` to be ignored.

```css
a { display: block; vertical-align: baseline; }
```

`display: block` causes `vertical-align` to be ignored.

```css
a { display: flex; vertical-align: baseline; }
```

`display: flex` causes `vertical-align` to be ignored.

```css
a { position: absolute; vertical-align: baseline; }
```

`position: absolute` causes `vertical-align` to be ignored.

```css
a { float: left; vertical-align: baseline; }
```

`float: left` causes `vertical-align` to be ignored.

The following patterns are *not* considered violations:

```css
a { display: inline; margin-left: 10px; }
```

```css
a { display: inline; margin-right: 10px; }
```

```css
a { display: inline; padding: 10px; }
```

```css
a { display: inline-block; width: 100px; }
```

Although `display: inline` causes `width` to be ignored, `inline-block` works with `width`.

```css
a { display: table-cell; vertical-align: baseline; }
```

Although `display: block` causes `vertical-align` to be ignored, `table-cell` works with `vertical-align`.

```css
a { position: relative; vertical-align: baseline; }
```

Although `position: absolute` causes `vertical-align` to be ignored, `relative` works with `vertical-align`.
