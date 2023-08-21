"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loaders_1 = require("../../builder/bundless/loaders");
const javascript_1 = require("../../builder/bundless/loaders/javascript");
const types_1 = require("../../types");
exports.default = async (api) => {
    // collect all bundless loaders
    const bundlessLoaders = await api.applyPlugins({
        key: 'addBundlessLoader',
        initialValue: [
            {
                id: 'js-loader',
                test: /((?<!\.d)\.ts|\.(jsx?|tsx))$/,
                loader: require.resolve('../../builder/bundless/loaders/javascript'),
            },
        ],
    });
    // register bundless loaders
    bundlessLoaders.forEach((l) => (0, loaders_1.addLoader)(l));
    // collect all bundless js transformers
    const jsTransformers = await api.applyPlugins({
        key: 'addJSTransformer',
        initialValue: [
            {
                id: types_1.IFatherJSTransformerTypes.BABEL,
                transformer: require.resolve('../../builder/bundless/loaders/javascript/babel'),
            },
            {
                id: types_1.IFatherJSTransformerTypes.ESBUILD,
                transformer: require.resolve('../../builder/bundless/loaders/javascript/esbuild'),
            },
            {
                id: types_1.IFatherJSTransformerTypes.SWC,
                transformer: require.resolve('../../builder/bundless/loaders/javascript/swc'),
            },
        ],
    });
    // register js transformers
    jsTransformers.forEach((t) => (0, javascript_1.addTransformer)(t));
};
