"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTransformer = void 0;
const dts_1 = require("../../dts");
const transformers = {};
/**
 * add javascript transformer
 * @param item
 */
function addTransformer(item) {
    const mod = require(item.transformer);
    const transformer = mod.default || mod;
    transformers[item.id] = transformer;
}
exports.addTransformer = addTransformer;
/**
 * builtin javascript loader
 */
const jsLoader = function (content) {
    var _a;
    const transformer = transformers[this.config.transformer];
    const outputOpts = {};
    // specify output ext for non-js file
    if (/\.(jsx|tsx?)$/.test(this.resource)) {
        outputOpts.ext = '.js';
    }
    // mark for output declaration file
    if (/\.tsx?$/.test(this.resource) &&
        ((_a = (0, dts_1.getTsconfig)(this.context)) === null || _a === void 0 ? void 0 : _a.options.declaration)) {
        outputOpts.declaration = true;
    }
    const ret = transformer.call({
        config: this.config,
        pkg: this.pkg,
        paths: {
            cwd: this.cwd,
            fileAbsPath: this.resource,
            itemDistAbsPath: this.itemDistAbsPath,
        },
    }, content.toString());
    // handle async transformer
    if (ret instanceof Promise) {
        const cb = this.async();
        ret.then((r) => {
            outputOpts.map = r[1];
            this.setOutputOptions(outputOpts);
            cb(null, r[0]);
        }, (e) => cb(e));
    }
    else {
        outputOpts.map = ret[1];
        this.setOutputOptions(outputOpts);
        return ret[0];
    }
};
exports.default = jsLoader;
