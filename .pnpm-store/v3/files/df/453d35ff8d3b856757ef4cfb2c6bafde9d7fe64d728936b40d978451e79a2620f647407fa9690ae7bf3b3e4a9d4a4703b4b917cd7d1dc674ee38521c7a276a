'use strict';
module.exports = {
    extends: [
        'airbnb',
        'prettier',
        'airbnb-typescript',
        'prettier/react',
        'prettier/@typescript-eslint',
    ].map(function (key) { return require.resolve("eslint-config-" + key); }),
    plugins: ['@typescript-eslint', 'eslint-comments', 'jest', 'unicorn', 'react-hooks'],
    env: {
        browser: true,
        node: true,
        es6: true,
        mocha: true,
        jest: true,
        jasmine: true,
    },
    rules: {
        'react/jsx-wrap-multilines': 0,
        'react/prop-types': 0,
        'react/forbid-prop-types': 0,
        'react/jsx-one-expression-per-line': 0,
        'react/sort-comp': 0,
        'generator-star-spacing': 0,
        'function-paren-newline': 0,
        'import/no-unresolved': [1, { ignore: ['^@/', '^umi/'] }],
        'import/no-extraneous-dependencies': [
            1,
            {
                optionalDependencies: true,
                devDependencies: [
                    '**/tests/**..{ts,js,jsx,tsx}',
                    '**/_test_/**.{ts,js,jsx,tsx}',
                    '/mock/**/**.{ts,js,jsx,tsx}',
                    '**/**.test.{ts,js,jsx,tsx}',
                    '**/_mock.{ts,js,jsx,tsx}',
                ],
            },
        ],
        'jsx-a11y/no-noninteractive-element-interactions': 0,
        'jsx-a11y/click-events-have-key-events': 0,
        'jsx-a11y/no-static-element-interactions': 0,
        'jsx-a11y/anchor-is-valid': 0,
        'linebreak-style': 0,
        // Too restrictive, writing ugly code to defend against a very unlikely scenario: https://eslint.org/docs/rules/no-prototype-builtins
        'no-prototype-builtins': 'off',
        'import/prefer-default-export': 'off',
        'import/no-default-export': [0, 'camel-case'],
        // Too restrictive: https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/destructuring-assignment.md
        'react/destructuring-assignment': 'off',
        'react/jsx-filename-extension': 'off',
        'max-len': 'warn',
        'sort-imports': 0,
        // Use function hoisting to improve code readability
        'no-use-before-define': ['warn', { functions: false, classes: true, variables: true }],
        // Makes no sense to allow type inferrence for expression parameters, but require typing the response
        '@typescript-eslint/explicit-function-return-type': [
            'off',
            { allowTypedFunctionExpressions: true },
        ],
        '@typescript-eslint/camelcase': 'off',
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/no-use-before-define': [
            'warn',
            { functions: false, classes: true, variables: true, typedefs: true },
        ],
        // Common abbreviations are known and readable
        'unicorn/prevent-abbreviations': 'off',
        '@typescript-eslint/explicit-member-accessibility': 0,
        '@typescript-eslint/interface-name-prefix': 0,
        '@typescript-eslint/no-non-null-assertion': 0,
        'import/no-cycle': 0,
        'react-hooks/rules-of-hooks': 'warn',
        'react/no-array-index-key': 'warn',
        // issue https://github.com/facebook/react/issues/15204
        'react-hooks/exhaustive-deps': 'off',
        // Conflict with prettier
        'arrow-body-style': ['warn', 'as-needed'],
        'object-curly-newline': 0,
        'implicit-arrow-linebreak': 0,
        'operator-linebreak': 0,
        'no-mixed-operators': 'warn',
        'comma-dangle': 0,
    },
    settings: {
        'import/resolver': { node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] } },
    },
};
