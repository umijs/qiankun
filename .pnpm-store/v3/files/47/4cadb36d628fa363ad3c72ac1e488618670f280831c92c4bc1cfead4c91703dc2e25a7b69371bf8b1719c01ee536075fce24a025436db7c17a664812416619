"use strict";

const includeDeprecated = !process.env.ESLINT_CONFIG_PRETTIER_NO_DEPRECATED;

module.exports = {
  rules: {
    // The following rules can be used in some cases. See the README for more
    // information. (These are marked with `0` instead of `"off"` so that a
    // script can distinguish them.)
    "curly": 0,
    "lines-around-comment": 0,
    "max-len": 0,
    "no-confusing-arrow": 0,
    "no-mixed-operators": 0,
    "no-tabs": 0,
    "no-unexpected-multiline": 0,
    "quotes": 0,
    "@typescript-eslint/lines-around-comment": 0,
    "@typescript-eslint/quotes": 0,
    "babel/quotes": 0,
    "vue/html-self-closing": 0,
    "vue/max-len": 0,

    // The rest are rules that you never need to enable when using Prettier.
    "array-bracket-newline": "off",
    "array-bracket-spacing": "off",
    "array-element-newline": "off",
    "arrow-parens": "off",
    "arrow-spacing": "off",
    "block-spacing": "off",
    "brace-style": "off",
    "comma-dangle": "off",
    "comma-spacing": "off",
    "comma-style": "off",
    "computed-property-spacing": "off",
    "dot-location": "off",
    "eol-last": "off",
    "func-call-spacing": "off",
    "function-call-argument-newline": "off",
    "function-paren-newline": "off",
    "generator-star-spacing": "off",
    "implicit-arrow-linebreak": "off",
    "indent": "off",
    "jsx-quotes": "off",
    "key-spacing": "off",
    "keyword-spacing": "off",
    "linebreak-style": "off",
    "max-statements-per-line": "off",
    "multiline-ternary": "off",
    "newline-per-chained-call": "off",
    "new-parens": "off",
    "no-extra-parens": "off",
    "no-extra-semi": "off",
    "no-floating-decimal": "off",
    "no-mixed-spaces-and-tabs": "off",
    "no-multi-spaces": "off",
    "no-multiple-empty-lines": "off",
    "no-trailing-spaces": "off",
    "no-whitespace-before-property": "off",
    "nonblock-statement-body-position": "off",
    "object-curly-newline": "off",
    "object-curly-spacing": "off",
    "object-property-newline": "off",
    "one-var-declaration-per-line": "off",
    "operator-linebreak": "off",
    "padded-blocks": "off",
    "quote-props": "off",
    "rest-spread-spacing": "off",
    "semi": "off",
    "semi-spacing": "off",
    "semi-style": "off",
    "space-before-blocks": "off",
    "space-before-function-paren": "off",
    "space-in-parens": "off",
    "space-infix-ops": "off",
    "space-unary-ops": "off",
    "switch-colon-spacing": "off",
    "template-curly-spacing": "off",
    "template-tag-spacing": "off",
    "wrap-iife": "off",
    "wrap-regex": "off",
    "yield-star-spacing": "off",
    "@babel/object-curly-spacing": "off",
    "@babel/semi": "off",
    "@typescript-eslint/block-spacing": "off",
    "@typescript-eslint/brace-style": "off",
    "@typescript-eslint/comma-dangle": "off",
    "@typescript-eslint/comma-spacing": "off",
    "@typescript-eslint/func-call-spacing": "off",
    "@typescript-eslint/indent": "off",
    "@typescript-eslint/key-spacing": "off",
    "@typescript-eslint/keyword-spacing": "off",
    "@typescript-eslint/member-delimiter-style": "off",
    "@typescript-eslint/no-extra-parens": "off",
    "@typescript-eslint/no-extra-semi": "off",
    "@typescript-eslint/object-curly-spacing": "off",
    "@typescript-eslint/semi": "off",
    "@typescript-eslint/space-before-blocks": "off",
    "@typescript-eslint/space-before-function-paren": "off",
    "@typescript-eslint/space-infix-ops": "off",
    "@typescript-eslint/type-annotation-spacing": "off",
    "babel/object-curly-spacing": "off",
    "babel/semi": "off",
    "flowtype/boolean-style": "off",
    "flowtype/delimiter-dangle": "off",
    "flowtype/generic-spacing": "off",
    "flowtype/object-type-curly-spacing": "off",
    "flowtype/object-type-delimiter": "off",
    "flowtype/quotes": "off",
    "flowtype/semi": "off",
    "flowtype/space-after-type-colon": "off",
    "flowtype/space-before-generic-bracket": "off",
    "flowtype/space-before-type-colon": "off",
    "flowtype/union-intersection-spacing": "off",
    "react/jsx-child-element-spacing": "off",
    "react/jsx-closing-bracket-location": "off",
    "react/jsx-closing-tag-location": "off",
    "react/jsx-curly-newline": "off",
    "react/jsx-curly-spacing": "off",
    "react/jsx-equals-spacing": "off",
    "react/jsx-first-prop-new-line": "off",
    "react/jsx-indent": "off",
    "react/jsx-indent-props": "off",
    "react/jsx-max-props-per-line": "off",
    "react/jsx-newline": "off",
    "react/jsx-one-expression-per-line": "off",
    "react/jsx-props-no-multi-spaces": "off",
    "react/jsx-tag-spacing": "off",
    "react/jsx-wrap-multilines": "off",
    "standard/array-bracket-even-spacing": "off",
    "standard/computed-property-even-spacing": "off",
    "standard/object-curly-even-spacing": "off",
    "unicorn/empty-brace-spaces": "off",
    "unicorn/no-nested-ternary": "off",
    "unicorn/number-literal-case": "off",
    "vue/array-bracket-newline": "off",
    "vue/array-bracket-spacing": "off",
    "vue/array-element-newline": "off",
    "vue/arrow-spacing": "off",
    "vue/block-spacing": "off",
    "vue/block-tag-newline": "off",
    "vue/brace-style": "off",
    "vue/comma-dangle": "off",
    "vue/comma-spacing": "off",
    "vue/comma-style": "off",
    "vue/dot-location": "off",
    "vue/func-call-spacing": "off",
    "vue/html-closing-bracket-newline": "off",
    "vue/html-closing-bracket-spacing": "off",
    "vue/html-end-tags": "off",
    "vue/html-indent": "off",
    "vue/html-quotes": "off",
    "vue/key-spacing": "off",
    "vue/keyword-spacing": "off",
    "vue/max-attributes-per-line": "off",
    "vue/multiline-html-element-content-newline": "off",
    "vue/multiline-ternary": "off",
    "vue/mustache-interpolation-spacing": "off",
    "vue/no-extra-parens": "off",
    "vue/no-multi-spaces": "off",
    "vue/no-spaces-around-equal-signs-in-attribute": "off",
    "vue/object-curly-newline": "off",
    "vue/object-curly-spacing": "off",
    "vue/object-property-newline": "off",
    "vue/operator-linebreak": "off",
    "vue/quote-props": "off",
    "vue/script-indent": "off",
    "vue/singleline-html-element-content-newline": "off",
    "vue/space-in-parens": "off",
    "vue/space-infix-ops": "off",
    "vue/space-unary-ops": "off",
    "vue/template-curly-spacing": "off",

    ...(includeDeprecated && {
      // Removed in version 1.0.0.
      // https://eslint.org/docs/latest/rules/generator-star
      "generator-star": "off",
      // Deprecated since version 4.0.0.
      // https://github.com/eslint/eslint/pull/8286
      "indent-legacy": "off",
      // Removed in version 2.0.0.
      // https://eslint.org/docs/latest/rules/no-arrow-condition
      "no-arrow-condition": "off",
      // Removed in version 1.0.0.
      // https://eslint.org/docs/latest/rules/no-comma-dangle
      "no-comma-dangle": "off",
      // Removed in version 1.0.0.
      // https://eslint.org/docs/latest/rules/no-reserved-keys
      "no-reserved-keys": "off",
      // Removed in version 1.0.0.
      // https://eslint.org/docs/latest/rules/no-space-before-semi
      "no-space-before-semi": "off",
      // Deprecated since version 3.3.0.
      // https://eslint.org/docs/rules/no-spaced-func
      "no-spaced-func": "off",
      // Removed in version 1.0.0.
      // https://eslint.org/docs/latest/rules/no-wrap-func
      "no-wrap-func": "off",
      // Removed in version 1.0.0.
      // https://eslint.org/docs/latest/rules/space-after-function-name
      "space-after-function-name": "off",
      // Removed in version 2.0.0.
      // https://eslint.org/docs/latest/rules/space-after-keywords
      "space-after-keywords": "off",
      // Removed in version 1.0.0.
      // https://eslint.org/docs/latest/rules/space-before-function-parentheses
      "space-before-function-parentheses": "off",
      // Removed in version 2.0.0.
      // https://eslint.org/docs/latest/rules/space-before-keywords
      "space-before-keywords": "off",
      // Removed in version 1.0.0.
      // https://eslint.org/docs/latest/rules/space-in-brackets
      "space-in-brackets": "off",
      // Removed in version 2.0.0.
      // https://eslint.org/docs/latest/rules/space-return-throw-case
      "space-return-throw-case": "off",
      // Removed in version 0.10.0.
      // https://eslint.org/docs/latest/rules/space-unary-word-ops
      "space-unary-word-ops": "off",
      // Deprecated since version 7.0.0.
      // https://github.com/yannickcr/eslint-plugin-react/blob/master/CHANGELOG.md#700---2017-05-06
      "react/jsx-space-before-closing": "off",
    }),
  },
};
