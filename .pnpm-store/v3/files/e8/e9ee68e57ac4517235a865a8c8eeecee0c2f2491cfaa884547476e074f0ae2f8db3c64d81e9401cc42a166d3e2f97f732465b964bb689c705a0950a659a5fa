"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Styles = void 0;
var TRBL = ['top', 'right', 'bottom', 'left'];
var WSC = ['width', 'style', 'color'];
function splitSpaces(text) {
    var parts = text.split(/((?:'[^']*'|"[^"]*"|,[\s\n]|[^\s\n])*)/g);
    var split = [];
    while (parts.length > 1) {
        parts.shift();
        split.push(parts.shift());
    }
    return split;
}
function splitTRBL(name) {
    var e_1, _a;
    var parts = splitSpaces(this.styles[name]);
    if (parts.length === 0) {
        parts.push('');
    }
    if (parts.length === 1) {
        parts.push(parts[0]);
    }
    if (parts.length === 2) {
        parts.push(parts[0]);
    }
    if (parts.length === 3) {
        parts.push(parts[1]);
    }
    try {
        for (var _b = __values(Styles.connect[name].children), _c = _b.next(); !_c.done; _c = _b.next()) {
            var child = _c.value;
            this.setStyle(this.childName(name, child), parts.shift());
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
}
function combineTRBL(name) {
    var e_2, _a;
    var children = Styles.connect[name].children;
    var parts = [];
    try {
        for (var children_1 = __values(children), children_1_1 = children_1.next(); !children_1_1.done; children_1_1 = children_1.next()) {
            var child = children_1_1.value;
            var part = this.styles[name + '-' + child];
            if (!part) {
                delete this.styles[name];
                return;
            }
            parts.push(part);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (children_1_1 && !children_1_1.done && (_a = children_1.return)) _a.call(children_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    if (parts[3] === parts[1]) {
        parts.pop();
        if (parts[2] === parts[0]) {
            parts.pop();
            if (parts[1] === parts[0]) {
                parts.pop();
            }
        }
    }
    this.styles[name] = parts.join(' ');
}
function splitSame(name) {
    var e_3, _a;
    try {
        for (var _b = __values(Styles.connect[name].children), _c = _b.next(); !_c.done; _c = _b.next()) {
            var child = _c.value;
            this.setStyle(this.childName(name, child), this.styles[name]);
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_3) throw e_3.error; }
    }
}
function combineSame(name) {
    var e_4, _a;
    var children = __spreadArray([], __read(Styles.connect[name].children), false);
    var value = this.styles[this.childName(name, children.shift())];
    try {
        for (var children_2 = __values(children), children_2_1 = children_2.next(); !children_2_1.done; children_2_1 = children_2.next()) {
            var child = children_2_1.value;
            if (this.styles[this.childName(name, child)] !== value) {
                delete this.styles[name];
                return;
            }
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (children_2_1 && !children_2_1.done && (_a = children_2.return)) _a.call(children_2);
        }
        finally { if (e_4) throw e_4.error; }
    }
    this.styles[name] = value;
}
var BORDER = {
    width: /^(?:[\d.]+(?:[a-z]+)|thin|medium|thick|inherit|initial|unset)$/,
    style: /^(?:none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset|inherit|initial|unset)$/
};
function splitWSC(name) {
    var e_5, _a, e_6, _b;
    var parts = { width: '', style: '', color: '' };
    try {
        for (var _c = __values(splitSpaces(this.styles[name])), _d = _c.next(); !_d.done; _d = _c.next()) {
            var part = _d.value;
            if (part.match(BORDER.width) && parts.width === '') {
                parts.width = part;
            }
            else if (part.match(BORDER.style) && parts.style === '') {
                parts.style = part;
            }
            else {
                parts.color = part;
            }
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
        }
        finally { if (e_5) throw e_5.error; }
    }
    try {
        for (var _e = __values(Styles.connect[name].children), _f = _e.next(); !_f.done; _f = _e.next()) {
            var child = _f.value;
            this.setStyle(this.childName(name, child), parts[child]);
        }
    }
    catch (e_6_1) { e_6 = { error: e_6_1 }; }
    finally {
        try {
            if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
        }
        finally { if (e_6) throw e_6.error; }
    }
}
function combineWSC(name) {
    var e_7, _a;
    var parts = [];
    try {
        for (var _b = __values(Styles.connect[name].children), _c = _b.next(); !_c.done; _c = _b.next()) {
            var child = _c.value;
            var value = this.styles[this.childName(name, child)];
            if (value) {
                parts.push(value);
            }
        }
    }
    catch (e_7_1) { e_7 = { error: e_7_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_7) throw e_7.error; }
    }
    if (parts.length) {
        this.styles[name] = parts.join(' ');
    }
    else {
        delete this.styles[name];
    }
}
var FONT = {
    style: /^(?:normal|italic|oblique|inherit|initial|unset)$/,
    variant: new RegExp('^(?:' +
        ['normal|none',
            'inherit|initial|unset',
            'common-ligatures|no-common-ligatures',
            'discretionary-ligatures|no-discretionary-ligatures',
            'historical-ligatures|no-historical-ligatures',
            'contextual|no-contextual',
            '(?:stylistic|character-variant|swash|ornaments|annotation)\\([^)]*\\)',
            'small-caps|all-small-caps|petite-caps|all-petite-caps|unicase|titling-caps',
            'lining-nums|oldstyle-nums|proportional-nums|tabular-nums',
            'diagonal-fractions|stacked-fractions',
            'ordinal|slashed-zero',
            'jis78|jis83|jis90|jis04|simplified|traditional',
            'full-width|proportional-width',
            'ruby'].join('|') + ')$'),
    weight: /^(?:normal|bold|bolder|lighter|[1-9]00|inherit|initial|unset)$/,
    stretch: new RegExp('^(?:' +
        ['normal',
            '(?:(?:ultra|extra|semi)-)?condensed',
            '(?:(?:semi|extra|ulta)-)?expanded',
            'inherit|initial|unset'].join('|') + ')$'),
    size: new RegExp('^(?:' +
        ['xx-small|x-small|small|medium|large|x-large|xx-large|larger|smaller',
            '[\d.]+%|[\d.]+[a-z]+',
            'inherit|initial|unset'].join('|') + ')' +
        '(?:\/(?:normal|[\d.\+](?:%|[a-z]+)?))?$')
};
function splitFont(name) {
    var e_8, _a, e_9, _b;
    var parts = splitSpaces(this.styles[name]);
    var value = {
        style: '', variant: [], weight: '', stretch: '',
        size: '', family: '', 'line-height': ''
    };
    try {
        for (var parts_1 = __values(parts), parts_1_1 = parts_1.next(); !parts_1_1.done; parts_1_1 = parts_1.next()) {
            var part = parts_1_1.value;
            value.family = part;
            try {
                for (var _c = (e_9 = void 0, __values(Object.keys(FONT))), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var name_1 = _d.value;
                    if ((Array.isArray(value[name_1]) || value[name_1] === '') && part.match(FONT[name_1])) {
                        if (name_1 === 'size') {
                            var _e = __read(part.split(/\//), 2), size = _e[0], height = _e[1];
                            value[name_1] = size;
                            if (height) {
                                value['line-height'] = height;
                            }
                        }
                        else if (value.size === '') {
                            if (Array.isArray(value[name_1])) {
                                value[name_1].push(part);
                            }
                            else {
                                value[name_1] = part;
                            }
                        }
                    }
                }
            }
            catch (e_9_1) { e_9 = { error: e_9_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                }
                finally { if (e_9) throw e_9.error; }
            }
        }
    }
    catch (e_8_1) { e_8 = { error: e_8_1 }; }
    finally {
        try {
            if (parts_1_1 && !parts_1_1.done && (_a = parts_1.return)) _a.call(parts_1);
        }
        finally { if (e_8) throw e_8.error; }
    }
    saveFontParts(name, value);
    delete this.styles[name];
}
function saveFontParts(name, value) {
    var e_10, _a;
    try {
        for (var _b = __values(Styles.connect[name].children), _c = _b.next(); !_c.done; _c = _b.next()) {
            var child = _c.value;
            var cname = this.childName(name, child);
            if (Array.isArray(value[child])) {
                var values = value[child];
                if (values.length) {
                    this.styles[cname] = values.join(' ');
                }
            }
            else if (value[child] !== '') {
                this.styles[cname] = value[child];
            }
        }
    }
    catch (e_10_1) { e_10 = { error: e_10_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_10) throw e_10.error; }
    }
}
function combineFont(_name) { }
var Styles = (function () {
    function Styles(cssText) {
        if (cssText === void 0) { cssText = ''; }
        this.parse(cssText);
    }
    Object.defineProperty(Styles.prototype, "cssText", {
        get: function () {
            var e_11, _a;
            var styles = [];
            try {
                for (var _b = __values(Object.keys(this.styles)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var name_2 = _c.value;
                    var parent_1 = this.parentName(name_2);
                    if (!this.styles[parent_1]) {
                        styles.push(name_2 + ': ' + this.styles[name_2] + ';');
                    }
                }
            }
            catch (e_11_1) { e_11 = { error: e_11_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_11) throw e_11.error; }
            }
            return styles.join(' ');
        },
        enumerable: false,
        configurable: true
    });
    Styles.prototype.set = function (name, value) {
        name = this.normalizeName(name);
        this.setStyle(name, value);
        if (Styles.connect[name] && !Styles.connect[name].combine) {
            this.combineChildren(name);
            delete this.styles[name];
        }
        while (name.match(/-/)) {
            name = this.parentName(name);
            if (!Styles.connect[name])
                break;
            Styles.connect[name].combine.call(this, name);
        }
    };
    Styles.prototype.get = function (name) {
        name = this.normalizeName(name);
        return (this.styles.hasOwnProperty(name) ? this.styles[name] : '');
    };
    Styles.prototype.setStyle = function (name, value) {
        this.styles[name] = value;
        if (Styles.connect[name] && Styles.connect[name].children) {
            Styles.connect[name].split.call(this, name);
        }
        if (value === '') {
            delete this.styles[name];
        }
    };
    Styles.prototype.combineChildren = function (name) {
        var e_12, _a;
        var parent = this.parentName(name);
        try {
            for (var _b = __values(Styles.connect[name].children), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                var cname = this.childName(parent, child);
                Styles.connect[cname].combine.call(this, cname);
            }
        }
        catch (e_12_1) { e_12 = { error: e_12_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_12) throw e_12.error; }
        }
    };
    Styles.prototype.parentName = function (name) {
        var parent = name.replace(/-[^-]*$/, '');
        return (name === parent ? '' : parent);
    };
    Styles.prototype.childName = function (name, child) {
        if (child.match(/-/)) {
            return child;
        }
        if (Styles.connect[name] && !Styles.connect[name].combine) {
            child += name.replace(/.*-/, '-');
            name = this.parentName(name);
        }
        return name + '-' + child;
    };
    Styles.prototype.normalizeName = function (name) {
        return name.replace(/[A-Z]/g, function (c) { return '-' + c.toLowerCase(); });
    };
    Styles.prototype.parse = function (cssText) {
        if (cssText === void 0) { cssText = ''; }
        var PATTERN = this.constructor.pattern;
        this.styles = {};
        var parts = cssText.replace(PATTERN.comment, '').split(PATTERN.style);
        while (parts.length > 1) {
            var _a = __read(parts.splice(0, 3), 3), space = _a[0], name_3 = _a[1], value = _a[2];
            if (space.match(/[^\s\n]/))
                return;
            this.set(name_3, value);
        }
    };
    Styles.pattern = {
        style: /([-a-z]+)[\s\n]*:[\s\n]*((?:'[^']*'|"[^"]*"|\n|.)*?)[\s\n]*(?:;|$)/g,
        comment: /\/\*[^]*?\*\//g
    };
    Styles.connect = {
        padding: {
            children: TRBL,
            split: splitTRBL,
            combine: combineTRBL
        },
        border: {
            children: TRBL,
            split: splitSame,
            combine: combineSame
        },
        'border-top': {
            children: WSC,
            split: splitWSC,
            combine: combineWSC
        },
        'border-right': {
            children: WSC,
            split: splitWSC,
            combine: combineWSC
        },
        'border-bottom': {
            children: WSC,
            split: splitWSC,
            combine: combineWSC
        },
        'border-left': {
            children: WSC,
            split: splitWSC,
            combine: combineWSC
        },
        'border-width': {
            children: TRBL,
            split: splitTRBL,
            combine: null
        },
        'border-style': {
            children: TRBL,
            split: splitTRBL,
            combine: null
        },
        'border-color': {
            children: TRBL,
            split: splitTRBL,
            combine: null
        },
        font: {
            children: ['style', 'variant', 'weight', 'stretch', 'line-height', 'size', 'family'],
            split: splitFont,
            combine: combineFont
        }
    };
    return Styles;
}());
exports.Styles = Styles;
//# sourceMappingURL=Styles.js.map