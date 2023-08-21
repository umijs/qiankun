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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColortblConfiguration = exports.ColorArrayItem = void 0;
var BaseItems_js_1 = require("../base/BaseItems.js");
var Configuration_js_1 = require("../Configuration.js");
var SymbolMap_js_1 = require("../SymbolMap.js");
var TexError_js_1 = __importDefault(require("../TexError.js"));
var ColorArrayItem = (function (_super) {
    __extends(ColorArrayItem, _super);
    function ColorArrayItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.color = {
            cell: '',
            row: '',
            col: []
        };
        _this.hasColor = false;
        return _this;
    }
    ColorArrayItem.prototype.EndEntry = function () {
        _super.prototype.EndEntry.call(this);
        var cell = this.row[this.row.length - 1];
        var color = this.color.cell || this.color.row || this.color.col[this.row.length - 1];
        if (color) {
            cell.attributes.set('mathbackground', color);
            this.color.cell = '';
            this.hasColor = true;
        }
    };
    ColorArrayItem.prototype.EndRow = function () {
        _super.prototype.EndRow.call(this);
        this.color.row = '';
    };
    ColorArrayItem.prototype.createMml = function () {
        var mml = _super.prototype.createMml.call(this);
        var table = (mml.isKind('mrow') ? mml.childNodes[1] : mml);
        if (table.isKind('menclose')) {
            table = table.childNodes[0].childNodes[0];
        }
        if (this.hasColor && table.attributes.get('frame') === 'none') {
            table.attributes.set('frame', '');
        }
        return mml;
    };
    return ColorArrayItem;
}(BaseItems_js_1.ArrayItem));
exports.ColorArrayItem = ColorArrayItem;
new SymbolMap_js_1.CommandMap('colortbl', {
    cellcolor: ['TableColor', 'cell'],
    rowcolor: ['TableColor', 'row'],
    columncolor: ['TableColor', 'col']
}, {
    TableColor: function (parser, name, type) {
        var lookup = parser.configuration.packageData.get('color').model;
        var model = parser.GetBrackets(name, '');
        var color = lookup.getColor(model, parser.GetArgument(name));
        var top = parser.stack.Top();
        if (!(top instanceof ColorArrayItem)) {
            throw new TexError_js_1.default('UnsupportedTableColor', 'Unsupported use of %1', parser.currentCS);
        }
        if (type === 'col') {
            if (top.table.length) {
                throw new TexError_js_1.default('ColumnColorNotTop', '%1 must be in the top row', name);
            }
            top.color.col[top.row.length] = color;
            if (parser.GetBrackets(name, '')) {
                parser.GetBrackets(name, '');
            }
        }
        else {
            top.color[type] = color;
            if (type === 'row' && (top.Size() || top.row.length)) {
                throw new TexError_js_1.default('RowColorNotFirst', '%1 must be at the beginning of a row', name);
            }
        }
    }
});
var config = function (config, jax) {
    if (!jax.parseOptions.packageData.has('color')) {
        Configuration_js_1.ConfigurationHandler.get('color').config(config, jax);
    }
};
exports.ColortblConfiguration = Configuration_js_1.Configuration.create('colortbl', {
    handler: { macro: ['colortbl'] },
    items: { 'array': ColorArrayItem },
    priority: 10,
    config: [config, 10]
});
//# sourceMappingURL=ColortblConfiguration.js.map