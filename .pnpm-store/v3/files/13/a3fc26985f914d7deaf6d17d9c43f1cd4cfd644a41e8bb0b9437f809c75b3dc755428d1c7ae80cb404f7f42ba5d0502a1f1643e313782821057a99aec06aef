// This file adds some React specific settings. Not using React? Use base.js instead.
module.exports = {
  extends: ["eslint-config-airbnb", "./lib/shared"].map(require.resolve),
  settings: {
    // Append 'ts' and 'tsx' extensions to Airbnb 'import/resolver' setting
    "import/resolver": {
      node: {
        extensions: [".js", ".ts", ".jsx", ".tsx", ".json"],
      },
    },
    // Append 'ts' and 'tsx' extensions to Airbnb 'import/extensions' setting
    "import/extensions": [".js", ".ts", ".mjs", ".jsx", ".tsx"],
  },
  rules: {
    // Append 'tsx' to Airbnb 'react/jsx-filename-extension' rule
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-filename-extension.md
    "react/jsx-filename-extension": ["error", { extensions: [".jsx", ".tsx"] }],
  },
}
