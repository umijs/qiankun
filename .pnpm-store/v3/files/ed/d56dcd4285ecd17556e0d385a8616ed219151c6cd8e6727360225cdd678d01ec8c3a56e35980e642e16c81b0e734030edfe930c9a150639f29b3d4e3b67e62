"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (api) => {
    api.onStart(() => { });
    return {
        plugins: [
            require.resolve('./registerMethods'),
            // commands
            require.resolve('./commands/dev'),
            require.resolve('./commands/doctor'),
            require.resolve('./commands/build'),
            require.resolve('./commands/changelog'),
            require.resolve('./commands/prebundle'),
            require.resolve('./commands/release'),
            require.resolve('./commands/version'),
            require.resolve('./commands/help'),
            require.resolve('./commands/generators/jest'),
            require.resolve('./commands/generators/commitlint'),
            require.resolve('./commands/generators/eslint'),
            require.resolve('./commands/generators/stylelint'),
            require.resolve('./commands/generators/lint'),
            // features
            require.resolve('./features/configBuilder/configBuilder'),
            require.resolve('./features/configPlugins/configPlugins'),
            require.resolve('./features/depsOnDemand/swc'),
        ],
    };
};
