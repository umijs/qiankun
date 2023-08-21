"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MathSimpleStore = void 0;
const engine_1 = require("../common/engine");
const dynamic_cstr_1 = require("./dynamic_cstr");
class MathSimpleStore {
    constructor() {
        this.category = '';
        this.rules = new Map();
    }
    static parseUnicode(num) {
        const keyValue = parseInt(num, 16);
        return String.fromCodePoint(keyValue);
    }
    static testDynamicConstraints_(dynamic, rule) {
        if (engine_1.default.getInstance().strict) {
            return rule.cstr.equal(dynamic);
        }
        return engine_1.default.getInstance().comparator.match(rule.cstr);
    }
    defineRulesFromMappings(name, locale, modality, str, mapping) {
        for (const domain in mapping) {
            for (const style in mapping[domain]) {
                const content = mapping[domain][style];
                this.defineRuleFromStrings(name, locale, modality, domain, style, str, content);
            }
        }
    }
    getRules(key) {
        let store = this.rules.get(key);
        if (!store) {
            store = [];
            this.rules.set(key, store);
        }
        return store;
    }
    defineRuleFromStrings(_name, locale, modality, domain, style, _str, content) {
        let store = this.getRules(locale);
        const parser = engine_1.default.getInstance().parsers[domain] ||
            engine_1.default.getInstance().defaultParser;
        const comp = engine_1.default.getInstance().comparators[domain];
        const cstr = `${locale}.${modality}.${domain}.${style}`;
        const dynamic = parser.parse(cstr);
        const comparator = comp ? comp() : engine_1.default.getInstance().comparator;
        const oldCstr = comparator.getReference();
        comparator.setReference(dynamic);
        const rule = { cstr: dynamic, action: content };
        store = store.filter((r) => !dynamic.equal(r.cstr));
        store.push(rule);
        this.rules.set(locale, store);
        comparator.setReference(oldCstr);
    }
    lookupRule(_node, dynamic) {
        let rules = this.getRules(dynamic.getValue(dynamic_cstr_1.Axis.LOCALE));
        rules = rules.filter(function (rule) {
            return MathSimpleStore.testDynamicConstraints_(dynamic, rule);
        });
        if (rules.length === 1) {
            return rules[0];
        }
        return rules.length
            ? rules.sort((r1, r2) => engine_1.default.getInstance().comparator.compare(r1.cstr, r2.cstr))[0]
            : null;
    }
}
exports.MathSimpleStore = MathSimpleStore;
