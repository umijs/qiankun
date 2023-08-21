"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlalignItem = exports.MultlineItem = void 0;
var BaseItems_js_1 = require("../base/BaseItems.js");
var ParseUtil_js_1 = __importDefault(require("../ParseUtil.js"));
var NodeUtil_js_1 = __importDefault(require("../NodeUtil.js"));
var TexError_js_1 = __importDefault(require("../TexError.js"));
var TexConstants_js_1 = require("../TexConstants.js");
var MultlineItem = (function (_super) {
    __extends(MultlineItem, _super);
    function MultlineItem(factory) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var _this = _super.call(this, factory) || this;
        _this.factory.configuration.tags.start('multline', true, args[0]);
        return _this;
    }
    Object.defineProperty(MultlineItem.prototype, "kind", {
        get: function () {
            return 'multline';
        },
        enumerable: false,
        configurable: true
    });
    MultlineItem.prototype.EndEntry = function () {
        if (this.table.length) {
            ParseUtil_js_1.default.fixInitialMO(this.factory.configuration, this.nodes);
        }
        var shove = this.getProperty('shove');
        var mtd = this.create('node', 'mtd', this.nodes, shove ? { columnalign: shove } : {});
        this.setProperty('shove', null);
        this.row.push(mtd);
        this.Clear();
    };
    MultlineItem.prototype.EndRow = function () {
        if (this.row.length !== 1) {
            throw new TexError_js_1.default('MultlineRowsOneCol', 'The rows within the %1 environment must have exactly one column', 'multline');
        }
        var row = this.create('node', 'mtr', this.row);
        this.table.push(row);
        this.row = [];
    };
    MultlineItem.prototype.EndTable = function () {
        _super.prototype.EndTable.call(this);
        if (this.table.length) {
            var m = this.table.length - 1, label = -1;
            if (!NodeUtil_js_1.default.getAttribute(NodeUtil_js_1.default.getChildren(this.table[0])[0], 'columnalign')) {
                NodeUtil_js_1.default.setAttribute(NodeUtil_js_1.default.getChildren(this.table[0])[0], 'columnalign', TexConstants_js_1.TexConstant.Align.LEFT);
            }
            if (!NodeUtil_js_1.default.getAttribute(NodeUtil_js_1.default.getChildren(this.table[m])[0], 'columnalign')) {
                NodeUtil_js_1.default.setAttribute(NodeUtil_js_1.default.getChildren(this.table[m])[0], 'columnalign', TexConstants_js_1.TexConstant.Align.RIGHT);
            }
            var tag = this.factory.configuration.tags.getTag();
            if (tag) {
                label = (this.arraydef.side === TexConstants_js_1.TexConstant.Align.LEFT ? 0 : this.table.length - 1);
                var mtr = this.table[label];
                var mlabel = this.create('node', 'mlabeledtr', [tag].concat(NodeUtil_js_1.default.getChildren(mtr)));
                NodeUtil_js_1.default.copyAttributes(mtr, mlabel);
                this.table[label] = mlabel;
            }
        }
        this.factory.configuration.tags.end();
    };
    return MultlineItem;
}(BaseItems_js_1.ArrayItem));
exports.MultlineItem = MultlineItem;
var FlalignItem = (function (_super) {
    __extends(FlalignItem, _super);
    function FlalignItem(factory, name, numbered, padded, center) {
        var _this = _super.call(this, factory) || this;
        _this.name = name;
        _this.numbered = numbered;
        _this.padded = padded;
        _this.center = center;
        _this.factory.configuration.tags.start(name, numbered, numbered);
        return _this;
    }
    Object.defineProperty(FlalignItem.prototype, "kind", {
        get: function () {
            return 'flalign';
        },
        enumerable: false,
        configurable: true
    });
    FlalignItem.prototype.EndEntry = function () {
        _super.prototype.EndEntry.call(this);
        var n = this.getProperty('xalignat');
        if (!n)
            return;
        if (this.row.length > n) {
            throw new TexError_js_1.default('XalignOverflow', 'Extra %1 in row of %2', '&', this.name);
        }
    };
    FlalignItem.prototype.EndRow = function () {
        var cell;
        var row = this.row;
        var n = this.getProperty('xalignat');
        while (row.length < n) {
            row.push(this.create('node', 'mtd'));
        }
        this.row = [];
        if (this.padded) {
            this.row.push(this.create('node', 'mtd'));
        }
        while ((cell = row.shift())) {
            this.row.push(cell);
            cell = row.shift();
            if (cell)
                this.row.push(cell);
            if (row.length || this.padded) {
                this.row.push(this.create('node', 'mtd'));
            }
        }
        if (this.row.length > this.maxrow) {
            this.maxrow = this.row.length;
        }
        _super.prototype.EndRow.call(this);
        var mtr = this.table[this.table.length - 1];
        if (this.getProperty('zeroWidthLabel') && mtr.isKind('mlabeledtr')) {
            var mtd = NodeUtil_js_1.default.getChildren(mtr)[0];
            var side = this.factory.configuration.options['tagSide'];
            var def = __assign({ width: 0 }, (side === 'right' ? { lspace: '-1width' } : {}));
            var mpadded = this.create('node', 'mpadded', NodeUtil_js_1.default.getChildren(mtd), def);
            mtd.setChildren([mpadded]);
        }
    };
    FlalignItem.prototype.EndTable = function () {
        _super.prototype.EndTable.call(this);
        if (this.center) {
            if (this.maxrow <= 2) {
                var def = this.arraydef;
                delete def.width;
                delete this.global.indentalign;
            }
        }
    };
    return FlalignItem;
}(BaseItems_js_1.EqnArrayItem));
exports.FlalignItem = FlalignItem;
//# sourceMappingURL=AmsItems.js.map