"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PREFER_PEER_DEPS = ['react', 'react-dom', 'antd'];
exports.default = (api) => {
    api.addRegularCheckup(() => {
        const warns = [];
        if (api.pkg.dependencies) {
            Object.keys(api.pkg.dependencies).forEach((pkg) => {
                var _a;
                if (PREFER_PEER_DEPS.includes(pkg) &&
                    !((_a = api.pkg.peerDependencies) === null || _a === void 0 ? void 0 : _a[pkg])) {
                    warns.push({
                        type: 'warn',
                        problem: `The dependency \`${pkg}\` has multi-instance risk in host project`,
                        solution: 'Move it into `peerDependencies` from `dependencies`',
                    });
                }
            });
        }
        return warns;
    });
};
