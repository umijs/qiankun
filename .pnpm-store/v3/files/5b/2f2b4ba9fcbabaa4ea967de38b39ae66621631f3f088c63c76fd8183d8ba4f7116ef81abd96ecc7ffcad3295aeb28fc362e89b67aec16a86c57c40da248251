# stylelint-config-rational-order

[![NPM version][version-img]][npm-url] [![Build status][ci-img]][ci-url] [![License][l-img]][l-url]

Stylelint config that sorts related property declarations by grouping together following the order:

1.  Positioning
2.  Box Model
3.  Typography
4.  Visual
5.  Animation
6.  Misc

```css
.declaration-order {
  /* Positioning */
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;

  /* Box Model */
  display: block;
  float: right;
  width: 100px;
  height: 100px;
  margin: 10px;
  padding: 10px;

  /* Typography */
  color: #888;
  font: normal 16px Helvetica, sans-serif;
  line-height: 1.3;
  text-align: center;

  /* Visual */
  background-color: #eee;
  border: 1px solid #888;
  border-radius: 4px;
  opacity: 1;

  /* Animation */
  transition: all 1s;

  /* Misc */
  user-select: none;
}
```

## Usage

1.  Add `stylelint`, `stylelint-order` and this package to your project:

```bash
npm install --save-dev stylelint stylelint-order stylelint-config-rational-order
# or, if you prefer yarn over npm:
yarn add --dev stylelint stylelint-order stylelint-config-rational-order
```

2.  Add this package to the end of your extends array inside Stylelint
    configuration (.stylelintrc for example):

```javascript
{
  "extends": [
    // "stylelint-config-standard",
    "stylelint-config-rational-order"
  ]
}
```

This shareable config contains the following:
```javascript
{
  "plugins": [
    "stylelint-order",
    "stylelint-config-rational-order/plugin"
  ],
  "rules": {
    "order/properties-order": [],
    "plugin/rational-order": [true, {
      "border-in-box-model": false,
      "empty-line-between-groups": false,
    }]
  }
}
```

Since it adds `stylelint-order` and `stylelint-config-rational-order` to plugins and also adds required rules, you don't have to do this yourself when extending this config.


## Optional options / rules

#### border-in-box-model

Defines to which group the **border** property belongs to.

If `true` **border** property belongs to the **box model section**.
The default value is `false` (**border** property belongs to the **visual section**).


#### empty-line-between-groups

If `true` adds an empty line between groups. The default value is `false`.

## FAQ

<details>
  <summary>Why should I use the rational order and group and sort CSS properties by type instead of alphabetical order?</summary>

  The pros and cons of both ways in detail:

* [Happy Potter and the Order of CSS](https://dev.to/thekashey/happy-potter-and-the-order-of-css-5ec)
* [“Outside In” — Ordering CSS Properties by Importance](https://webdesign.tutsplus.com/articles/outside-in-ordering-css-properties-by-importance--cms-21685)
</details>

## Credits

* [Code Guide by @mdo](http://codeguide.co/)
* [Code Guide by HTML Academy](https://github.com/htmlacademy/codeguide)


[npm-url]: https://www.npmjs.com/package/stylelint-config-rational-order
[version-img]: https://img.shields.io/npm/v/stylelint-config-rational-order.svg?style=flat-square
[ci-url]: https://travis-ci.org/constverum/stylelint-config-rational-order
[ci-img]: https://img.shields.io/travis/constverum/stylelint-config-rational-order.svg?style=flat-square
[l-url]: https://www.npmjs.com/package/stylelint-config-rational-order
[l-img]: https://img.shields.io/npm/l/stylelint-config-rational-order.svg?style=flat-square
