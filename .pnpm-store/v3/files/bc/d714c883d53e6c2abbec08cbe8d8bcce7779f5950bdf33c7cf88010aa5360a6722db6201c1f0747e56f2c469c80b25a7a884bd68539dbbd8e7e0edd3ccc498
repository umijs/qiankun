"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultComparator = exports.DynamicCstrParser = exports.DynamicCstr = exports.DynamicProperties = exports.Axis = void 0;
var Axis;
(function (Axis) {
    Axis["DOMAIN"] = "domain";
    Axis["STYLE"] = "style";
    Axis["LOCALE"] = "locale";
    Axis["TOPIC"] = "topic";
    Axis["MODALITY"] = "modality";
})(Axis = exports.Axis || (exports.Axis = {}));
class DynamicProperties {
    constructor(properties, order = Object.keys(properties)) {
        this.properties = properties;
        this.order = order;
    }
    static createProp(...cstrList) {
        const axes = DynamicCstr.DEFAULT_ORDER;
        const dynamicCstr = {};
        for (let i = 0, l = cstrList.length, k = axes.length; i < l && i < k; i++) {
            dynamicCstr[axes[i]] = cstrList[i];
        }
        return new DynamicProperties(dynamicCstr);
    }
    getProperties() {
        return this.properties;
    }
    getOrder() {
        return this.order;
    }
    getAxes() {
        return this.order;
    }
    getProperty(key) {
        return this.properties[key];
    }
    updateProperties(props) {
        this.properties = props;
    }
    allProperties() {
        const propLists = [];
        this.order.forEach((key) => propLists.push(this.getProperty(key).slice()));
        return propLists;
    }
    toString() {
        const cstrStrings = [];
        this.order.forEach((key) => cstrStrings.push(key + ': ' + this.getProperty(key).toString()));
        return cstrStrings.join('\n');
    }
}
exports.DynamicProperties = DynamicProperties;
class DynamicCstr extends DynamicProperties {
    constructor(components_, order) {
        const properties = {};
        for (const [key, value] of Object.entries(components_)) {
            properties[key] = [value];
        }
        super(properties, order);
        this.components = components_;
    }
    static createCstr(...cstrList) {
        const axes = DynamicCstr.DEFAULT_ORDER;
        const dynamicCstr = {};
        for (let i = 0, l = cstrList.length, k = axes.length; i < l && i < k; i++) {
            dynamicCstr[axes[i]] = cstrList[i];
        }
        return new DynamicCstr(dynamicCstr);
    }
    static defaultCstr() {
        return DynamicCstr.createCstr.apply(null, DynamicCstr.DEFAULT_ORDER.map(function (x) {
            return DynamicCstr.DEFAULT_VALUES[x];
        }));
    }
    static validOrder(order) {
        const axes = DynamicCstr.DEFAULT_ORDER.slice();
        return order.every((x) => {
            const index = axes.indexOf(x);
            return index !== -1 && axes.splice(index, 1);
        });
    }
    getComponents() {
        return this.components;
    }
    getValue(key) {
        return this.components[key];
    }
    getValues() {
        return this.order.map((key) => this.getValue(key));
    }
    allProperties() {
        const propLists = super.allProperties();
        for (let i = 0, props, key; (props = propLists[i]), (key = this.order[i]); i++) {
            const value = this.getValue(key);
            if (props.indexOf(value) === -1) {
                props.unshift(value);
            }
        }
        return propLists;
    }
    toString() {
        return this.getValues().join('.');
    }
    equal(cstr) {
        const keys1 = cstr.getAxes();
        if (this.order.length !== keys1.length) {
            return false;
        }
        for (let j = 0, key; (key = keys1[j]); j++) {
            const comp2 = this.getValue(key);
            if (!comp2 || cstr.getValue(key) !== comp2) {
                return false;
            }
        }
        return true;
    }
}
exports.DynamicCstr = DynamicCstr;
DynamicCstr.DEFAULT_ORDER = [
    Axis.LOCALE,
    Axis.MODALITY,
    Axis.DOMAIN,
    Axis.STYLE,
    Axis.TOPIC
];
DynamicCstr.BASE_LOCALE = 'base';
DynamicCstr.DEFAULT_VALUE = 'default';
DynamicCstr.DEFAULT_VALUES = {
    [Axis.LOCALE]: 'en',
    [Axis.DOMAIN]: DynamicCstr.DEFAULT_VALUE,
    [Axis.STYLE]: DynamicCstr.DEFAULT_VALUE,
    [Axis.TOPIC]: DynamicCstr.DEFAULT_VALUE,
    [Axis.MODALITY]: 'speech'
};
class DynamicCstrParser {
    constructor(order) {
        this.order = order;
    }
    parse(str) {
        const order = str.split('.');
        const cstr = {};
        if (order.length > this.order.length) {
            throw new Error('Invalid dynamic constraint: ' + cstr);
        }
        let j = 0;
        for (let i = 0, key; (key = this.order[i]), order.length; i++, j++) {
            const value = order.shift();
            cstr[key] = value;
        }
        return new DynamicCstr(cstr, this.order.slice(0, j));
    }
}
exports.DynamicCstrParser = DynamicCstrParser;
class DefaultComparator {
    constructor(reference, fallback = new DynamicProperties(reference.getProperties(), reference.getOrder())) {
        this.reference = reference;
        this.fallback = fallback;
        this.order = this.reference.getOrder();
    }
    getReference() {
        return this.reference;
    }
    setReference(cstr, props) {
        this.reference = cstr;
        this.fallback =
            props || new DynamicProperties(cstr.getProperties(), cstr.getOrder());
        this.order = this.reference.getOrder();
    }
    match(cstr) {
        const keys1 = cstr.getAxes();
        return (keys1.length === this.reference.getAxes().length &&
            keys1.every((key) => {
                const value = cstr.getValue(key);
                return (value === this.reference.getValue(key) ||
                    this.fallback.getProperty(key).indexOf(value) !== -1);
            }));
    }
    compare(cstr1, cstr2) {
        let ignore = false;
        for (let i = 0, key; (key = this.order[i]); i++) {
            const value1 = cstr1.getValue(key);
            const value2 = cstr2.getValue(key);
            if (!ignore) {
                const ref = this.reference.getValue(key);
                if (ref === value1 && ref !== value2) {
                    return -1;
                }
                if (ref === value2 && ref !== value1) {
                    return 1;
                }
                if (ref === value1 && ref === value2) {
                    continue;
                }
                if (ref !== value1 && ref !== value2) {
                    ignore = true;
                }
            }
            const prop = this.fallback.getProperty(key);
            const index1 = prop.indexOf(value1);
            const index2 = prop.indexOf(value2);
            if (index1 < index2) {
                return -1;
            }
            if (index2 < index1) {
                return 1;
            }
        }
        return 0;
    }
    toString() {
        return this.reference.toString() + '\n' + this.fallback.toString();
    }
}
exports.DefaultComparator = DefaultComparator;
