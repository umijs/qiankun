"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpheqUtil = void 0;
var ParseUtil_js_1 = __importDefault(require("../ParseUtil.js"));
var TexParser_js_1 = __importDefault(require("../TexParser.js"));
exports.EmpheqUtil = {
    environment: function (parser, env, func, args) {
        var name = args[0];
        var item = parser.itemFactory.create(name + '-begin').setProperties({ name: env, end: name });
        parser.Push(func.apply(void 0, __spreadArray([parser, item], __read(args.slice(1)), false)));
    },
    splitOptions: function (text, allowed) {
        if (allowed === void 0) { allowed = null; }
        return ParseUtil_js_1.default.keyvalOptions(text, allowed, true);
    },
    columnCount: function (table) {
        var e_1, _a;
        var m = 0;
        try {
            for (var _b = __values(table.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var row = _c.value;
                var n = row.childNodes.length - (row.isKind('mlabeledtr') ? 1 : 0);
                if (n > m)
                    m = n;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return m;
    },
    cellBlock: function (tex, table, parser, env) {
        var e_2, _a;
        var mpadded = parser.create('node', 'mpadded', [], { height: 0, depth: 0, voffset: '-1height' });
        var result = new TexParser_js_1.default(tex, parser.stack.env, parser.configuration);
        var mml = result.mml();
        if (env && result.configuration.tags.label) {
            result.configuration.tags.currentTag.env = env;
            result.configuration.tags.getTag(true);
        }
        try {
            for (var _b = __values((mml.isInferred ? mml.childNodes : [mml])), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                mpadded.appendChild(child);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        mpadded.appendChild(parser.create('node', 'mphantom', [
            parser.create('node', 'mpadded', [table], { width: 0 })
        ]));
        return mpadded;
    },
    topRowTable: function (original, parser) {
        var table = ParseUtil_js_1.default.copyNode(original, parser);
        table.setChildren(table.childNodes.slice(0, 1));
        table.attributes.set('align', 'baseline 1');
        return original.factory.create('mphantom', {}, [parser.create('node', 'mpadded', [table], { width: 0 })]);
    },
    rowspanCell: function (mtd, tex, table, parser, env) {
        mtd.appendChild(parser.create('node', 'mpadded', [
            this.cellBlock(tex, ParseUtil_js_1.default.copyNode(table, parser), parser, env),
            this.topRowTable(table, parser)
        ], { height: 0, depth: 0, voffset: 'height' }));
    },
    left: function (table, original, left, parser, env) {
        var e_3, _a;
        if (env === void 0) { env = ''; }
        table.attributes.set('columnalign', 'right ' + (table.attributes.get('columnalign') || ''));
        table.attributes.set('columnspacing', '0em ' + (table.attributes.get('columnspacing') || ''));
        var mtd;
        try {
            for (var _b = __values(table.childNodes.slice(0).reverse()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var row = _c.value;
                mtd = parser.create('node', 'mtd');
                row.childNodes.unshift(mtd);
                mtd.parent = row;
                if (row.isKind('mlabeledtr')) {
                    row.childNodes[0] = row.childNodes[1];
                    row.childNodes[1] = mtd;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        this.rowspanCell(mtd, left, original, parser, env);
    },
    right: function (table, original, right, parser, env) {
        if (env === void 0) { env = ''; }
        if (table.childNodes.length === 0) {
            table.appendChild(parser.create('node', 'mtr'));
        }
        var m = exports.EmpheqUtil.columnCount(table);
        var row = table.childNodes[0];
        while (row.childNodes.length < m)
            row.appendChild(parser.create('node', 'mtd'));
        var mtd = row.appendChild(parser.create('node', 'mtd'));
        exports.EmpheqUtil.rowspanCell(mtd, right, original, parser, env);
        table.attributes.set('columnalign', (table.attributes.get('columnalign') || '').split(/ /).slice(0, m).join(' ') + ' left');
        table.attributes.set('columnspacing', (table.attributes.get('columnspacing') || '').split(/ /).slice(0, m - 1).join(' ') + ' 0em');
    },
    adjustTable: function (empheq, parser) {
        var left = empheq.getProperty('left');
        var right = empheq.getProperty('right');
        if (left || right) {
            var table = empheq.Last;
            var original = ParseUtil_js_1.default.copyNode(table, parser);
            if (left)
                this.left(table, original, left, parser);
            if (right)
                this.right(table, original, right, parser);
        }
    },
    allowEnv: {
        equation: true,
        align: true,
        gather: true,
        flalign: true,
        alignat: true,
        multline: true
    },
    checkEnv: function (env) {
        return this.allowEnv.hasOwnProperty(env.replace(/\*$/, '')) || false;
    }
};
//# sourceMappingURL=EmpheqUtil.js.map