"use strict";
module.exports = {
    extends: [
        'stylelint-config-standard',
        'stylelint-config-css-modules',
        'stylelint-config-rational-order',
        'stylelint-config-prettier',
    ].map(function (key) { return require.resolve(key); }),
    plugins: ['stylelint-order', 'stylelint-declaration-block-no-ignored-properties'].map(function (key) {
        return require.resolve(key);
    }),
    rules: {
        'no-descending-specificity': null,
        'plugin/declaration-block-no-ignored-properties': true,
    },
};
