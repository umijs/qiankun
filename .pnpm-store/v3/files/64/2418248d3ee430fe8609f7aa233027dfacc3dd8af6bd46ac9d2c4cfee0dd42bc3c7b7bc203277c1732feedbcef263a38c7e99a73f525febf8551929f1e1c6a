"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSchemas = void 0;
const types_1 = require("../../types");
function getCommonSchemas() {
    return {
        platform: (Joi) => Joi.equal(types_1.IFatherPlatformTypes.BROWSER, types_1.IFatherPlatformTypes.NODE).default(types_1.IFatherPlatformTypes.BROWSER),
        define: (Joi) => Joi.object().pattern(Joi.string(), Joi.string()).optional(),
        alias: (Joi) => Joi.object().pattern(Joi.string(), Joi.string()).optional(),
        postcssOptions: (Joi) => Joi.object().optional(),
        autoprefixer: (Joi) => Joi.object().optional(),
        extraBabelPresets: (Joi) => Joi.array().optional(),
        extraBabelPlugins: (Joi) => Joi.array().optional(),
        sourcemap: (Joi) => Joi.boolean().optional(),
        targets: (Joi) => Joi.object().optional(),
    };
}
function getCommonSchemasJoi(Joi) {
    const schemas = getCommonSchemas();
    return Object.keys(schemas).reduce((jois, key) => {
        jois[key] = schemas[key](Joi);
        return jois;
    }, {});
}
function getBundlessSchemas(Joi) {
    return Joi.object({
        ...getCommonSchemasJoi(Joi),
        input: Joi.string(),
        output: Joi.string(),
        transformer: Joi.equal(types_1.IFatherJSTransformerTypes.BABEL, types_1.IFatherJSTransformerTypes.ESBUILD, types_1.IFatherJSTransformerTypes.SWC).optional(),
        overrides: Joi.object(),
        ignores: Joi.array().items(Joi.string()),
    });
}
function getSchemas() {
    return {
        ...getCommonSchemas(),
        extends: (Joi) => Joi.string(),
        esm: (Joi) => getBundlessSchemas(Joi),
        cjs: (Joi) => getBundlessSchemas(Joi),
        umd: (Joi) => Joi.object({
            ...getCommonSchemasJoi(Joi),
            entry: Joi.alternatives()
                .try(Joi.string(), Joi.object().pattern(Joi.string(), Joi.object()))
                .optional(),
            output: Joi.alternatives().try(Joi.string(), Joi.object()).optional(),
            externals: Joi.alternatives().try(Joi.object(), Joi.string(), Joi.array()),
            chainWebpack: Joi.function().optional(),
            extractCSS: Joi.boolean().optional(),
            name: Joi.string().optional(),
            theme: Joi.object().pattern(Joi.string(), Joi.string()),
        }),
        prebundle: (Joi) => Joi.object({
            output: Joi.string(),
            deps: Joi.alternatives()
                .try(Joi.array().items(Joi.string()), Joi.object())
                .optional(),
            extraDtsDeps: Joi.array().items(Joi.string()),
            extraExternals: Joi.object()
                .pattern(Joi.string(), Joi.string())
                .optional(),
        }),
        plugins: (Joi) => Joi.array().items(Joi.string()),
        presets: (Joi) => Joi.array().items(Joi.string()),
    };
}
exports.getSchemas = getSchemas;
