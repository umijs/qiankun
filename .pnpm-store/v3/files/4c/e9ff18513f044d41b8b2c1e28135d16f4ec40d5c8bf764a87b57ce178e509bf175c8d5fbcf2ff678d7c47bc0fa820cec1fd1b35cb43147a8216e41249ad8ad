"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (api) => {
    api.addRegularCheckup(() => {
        const warns = [];
        if (api.pkg.peerDependencies && api.pkg.dependencies) {
            Object.keys(api.pkg.peerDependencies).forEach((pkg) => {
                if (api.pkg.dependencies[pkg]) {
                    warns.push({
                        type: 'warn',
                        problem: `The package \`${pkg}\` is both a peerDependency and a dependency`,
                        solution: 'Remove one from the package.json file base on project requirements',
                    });
                }
            });
        }
        return warns;
    });
};
