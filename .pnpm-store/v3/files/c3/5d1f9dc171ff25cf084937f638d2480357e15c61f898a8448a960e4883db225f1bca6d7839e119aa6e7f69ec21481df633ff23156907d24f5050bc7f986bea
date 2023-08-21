"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStore = exports.addStore = exports.funcStore = void 0;
const dynamic_cstr_1 = require("../rule_engine/dynamic_cstr");
exports.funcStore = new Map();
function addStore(constr, inherit, store) {
    const values = {};
    if (inherit) {
        const inherits = exports.funcStore.get(inherit) || {};
        Object.assign(values, inherits);
    }
    exports.funcStore.set(constr, Object.assign(values, store));
}
exports.addStore = addStore;
function getStore(locale, modality, domain) {
    return (exports.funcStore.get([locale, modality, domain].join('.')) ||
        exports.funcStore.get([dynamic_cstr_1.DynamicCstr.DEFAULT_VALUES[dynamic_cstr_1.Axis.LOCALE], modality, domain].join('.')) ||
        exports.funcStore.get([dynamic_cstr_1.DynamicCstr.BASE_LOCALE, modality, domain].join('.')) ||
        {});
}
exports.getStore = getStore;
