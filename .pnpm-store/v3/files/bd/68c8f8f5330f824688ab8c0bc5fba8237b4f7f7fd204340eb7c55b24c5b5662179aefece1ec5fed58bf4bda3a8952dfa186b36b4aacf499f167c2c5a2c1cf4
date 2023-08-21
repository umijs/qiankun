"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enumerate = exports.lookupString = exports.lookupCategory = exports.lookupRule = exports.addSiUnitRules = exports.addUnitRules = exports.addFunctionRules = exports.addSymbolRules = exports.defineRule = exports.defineRules = exports.setSiPrefixes = void 0;
const debugger_1 = require("../common/debugger");
const engine_1 = require("../common/engine");
const l10n_1 = require("../l10n/l10n");
const math_simple_store_1 = require("./math_simple_store");
const dynamic_cstr_1 = require("./dynamic_cstr");
let locale = dynamic_cstr_1.DynamicCstr.DEFAULT_VALUES[dynamic_cstr_1.Axis.LOCALE];
let modality = dynamic_cstr_1.DynamicCstr.DEFAULT_VALUES[dynamic_cstr_1.Axis.MODALITY];
let siPrefixes = {};
function setSiPrefixes(prefixes) {
    siPrefixes = prefixes;
}
exports.setSiPrefixes = setSiPrefixes;
const subStores_ = {};
function defineRules(name, str, cat, mappings) {
    const store = getSubStore_(str);
    setupStore_(store, cat);
    store.defineRulesFromMappings(name, locale, modality, str, mappings);
}
exports.defineRules = defineRules;
function defineRule(name, domain, style, cat, str, content) {
    const store = getSubStore_(str);
    setupStore_(store, cat);
    store.defineRuleFromStrings(name, locale, modality, domain, style, str, content);
}
exports.defineRule = defineRule;
function addSymbolRules(json) {
    if (changeLocale_(json)) {
        return;
    }
    const key = math_simple_store_1.MathSimpleStore.parseUnicode(json['key']);
    defineRules(json['key'], key, json['category'], json['mappings']);
}
exports.addSymbolRules = addSymbolRules;
function addFunctionRules(json) {
    if (changeLocale_(json)) {
        return;
    }
    const names = json['names'];
    const mappings = json['mappings'];
    const category = json['category'];
    for (let j = 0, name; (name = names[j]); j++) {
        defineRules(name, name, category, mappings);
    }
}
exports.addFunctionRules = addFunctionRules;
function addUnitRules(json) {
    if (changeLocale_(json)) {
        return;
    }
    if (json['si']) {
        addSiUnitRules(json);
        return;
    }
    addUnitRules_(json);
}
exports.addUnitRules = addUnitRules;
function addSiUnitRules(json) {
    for (const key of Object.keys(siPrefixes)) {
        const newJson = Object.assign({}, json);
        newJson.mappings = {};
        const prefix = siPrefixes[key];
        newJson['key'] = key + newJson['key'];
        newJson['names'] = newJson['names'].map(function (name) {
            return key + name;
        });
        for (const domain of Object.keys(json['mappings'])) {
            newJson.mappings[domain] = {};
            for (const style of Object.keys(json['mappings'][domain])) {
                newJson['mappings'][domain][style] = l10n_1.locales[locale]().FUNCTIONS.si(prefix, json['mappings'][domain][style]);
            }
        }
        addUnitRules_(newJson);
    }
    addUnitRules_(json);
}
exports.addSiUnitRules = addSiUnitRules;
function lookupRule(node, dynamic) {
    const store = subStores_[node];
    return store ? store.lookupRule(null, dynamic) : null;
}
exports.lookupRule = lookupRule;
function lookupCategory(character) {
    const store = subStores_[character];
    return store ? store.category : '';
}
exports.lookupCategory = lookupCategory;
function lookupString(text, dynamic) {
    const rule = lookupRule(text, dynamic);
    if (!rule) {
        return null;
    }
    return rule.action;
}
exports.lookupString = lookupString;
engine_1.default.getInstance().evaluator = lookupString;
function enumerate(info = {}) {
    for (const store of Object.values(subStores_)) {
        for (const [, rules] of store.rules.entries()) {
            for (const { cstr: dynamic } of rules) {
                info = enumerate_(dynamic.getValues(), info);
            }
        }
    }
    return info;
}
exports.enumerate = enumerate;
function enumerate_(dynamic, info) {
    info = info || {};
    if (!dynamic.length) {
        return info;
    }
    info[dynamic[0]] = enumerate_(dynamic.slice(1), info[dynamic[0]]);
    return info;
}
function addUnitRules_(json) {
    const names = json['names'];
    if (names) {
        json['names'] = names.map(function (name) {
            return name + ':' + 'unit';
        });
    }
    addFunctionRules(json);
}
function changeLocale_(json) {
    if (!json['locale'] && !json['modality']) {
        return false;
    }
    locale = json['locale'] || locale;
    modality = json['modality'] || modality;
    return true;
}
function getSubStore_(key) {
    let store = subStores_[key];
    if (store) {
        debugger_1.Debugger.getInstance().output('Store exists! ' + key);
        return store;
    }
    store = new math_simple_store_1.MathSimpleStore();
    subStores_[key] = store;
    return store;
}
function setupStore_(store, opt_cat) {
    if (opt_cat) {
        store.category = opt_cat;
    }
}
