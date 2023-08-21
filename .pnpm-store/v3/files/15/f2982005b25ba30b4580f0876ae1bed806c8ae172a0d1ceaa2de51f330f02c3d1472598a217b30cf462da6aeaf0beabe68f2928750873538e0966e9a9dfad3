"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectionBox = exports.SelectionMenu = void 0;
var menu_util_js_1 = require("./menu_util.js");
var html_classes_js_1 = require("./html_classes.js");
var abstract_menu_js_1 = require("./abstract_menu.js");
var info_js_1 = require("./info.js");
var SelectionMenu = (function (_super) {
    __extends(SelectionMenu, _super);
    function SelectionMenu(anchor) {
        var _this = _super.call(this) || this;
        _this.anchor = anchor;
        _this.className = html_classes_js_1.HtmlClasses['SELECTIONMENU'];
        _this.variablePool = _this.anchor.menu.pool;
        _this.baseMenu = _this.anchor.menu;
        return _this;
    }
    SelectionMenu.fromJson = function (factory, _a, sb) {
        var title = _a.title, values = _a.values, variable = _a.variable;
        var selection = new this(sb);
        var tit = factory.get('label')(factory, { content: title || '', id: title || 'id' }, selection);
        var rul = factory.get('rule')(factory, {}, selection);
        var radios = values.map(function (x) { return factory.get('radio')(factory, { content: x, variable: variable, id: x }, selection); });
        var items = [tit, rul].concat(radios);
        selection.items = items;
        return selection;
    };
    SelectionMenu.prototype.generateHtml = function () {
        _super.prototype.generateHtml.call(this);
        this.items.forEach(function (item) { return item.html.classList.add(html_classes_js_1.HtmlClasses['SELECTIONITEM']); });
    };
    SelectionMenu.prototype.display = function () { };
    SelectionMenu.prototype.right = function (event) {
        this.anchor.right(event);
    };
    SelectionMenu.prototype.left = function (event) {
        this.anchor.left(event);
    };
    return SelectionMenu;
}(abstract_menu_js_1.AbstractMenu));
exports.SelectionMenu = SelectionMenu;
var SelectionBox = (function (_super) {
    __extends(SelectionBox, _super);
    function SelectionBox(title, signature, style, grid) {
        if (style === void 0) { style = "none"; }
        if (grid === void 0) { grid = "vertical"; }
        var _this = _super.call(this, title, null, signature) || this;
        _this.style = style;
        _this.grid = grid;
        _this._selections = [];
        _this.prefix = 'ctxt-selection';
        _this._balanced = true;
        return _this;
    }
    SelectionBox.fromJson = function (factory, _a, ctxt) {
        var title = _a.title, signature = _a.signature, selections = _a.selections, order = _a.order, grid = _a.grid;
        var sb = new this(title, signature, order, grid);
        sb.attachMenu(ctxt);
        var sels = selections.map(function (x) { return factory.get('selectionMenu')(factory, x, sb); });
        sb.selections = sels;
        return sb;
    };
    SelectionBox.prototype.attachMenu = function (menu) {
        this.menu = menu;
    };
    Object.defineProperty(SelectionBox.prototype, "selections", {
        get: function () {
            return this._selections;
        },
        set: function (selections) {
            var _this = this;
            this._selections = [];
            selections.forEach(function (x) { return _this.addSelection(x); });
        },
        enumerable: false,
        configurable: true
    });
    SelectionBox.prototype.addSelection = function (selection) {
        selection.anchor = this;
        this._selections.push(selection);
    };
    SelectionBox.prototype.rowDiv = function (sels) {
        var _this = this;
        var div = document.createElement('div');
        this.contentDiv.appendChild(div);
        var rects = sels.map(function (sel) {
            div.appendChild(sel.html);
            if (!sel.html.id) {
                sel.html.id = _this.prefix + menu_util_js_1.MenuUtil.counter();
            }
            return sel.html.getBoundingClientRect();
        });
        var column = rects.map(function (x) { return x.width; });
        var width = column.reduce(function (x, y) { return x + y; }, 0);
        var height = rects.reduce(function (x, y) { return Math.max(x, y.height); }, 0);
        div.classList.add(html_classes_js_1.HtmlClasses['SELECTIONDIVIDER']);
        div.setAttribute('style', 'height: ' + height + 'px;');
        return [div, width, height, column];
    };
    SelectionBox.prototype.display = function () {
        _super.prototype.display.call(this);
        this.order();
        if (!this.selections.length) {
            return;
        }
        var outerDivs = [];
        var maxWidth = 0;
        var balancedColumn = [];
        var chunks = this.getChunkSize(this.selections.length);
        var _loop_1 = function (i) {
            var sels = this_1.selections.slice(i, i + chunks);
            var _a = __read(this_1.rowDiv(sels), 4), div = _a[0], width = _a[1], height = _a[2], column = _a[3];
            outerDivs.push(div);
            maxWidth = Math.max(maxWidth, width);
            sels.forEach(function (sel) { return sel.html.style.height = height + 'px'; });
            balancedColumn = this_1.combineColumn(balancedColumn, column);
        };
        var this_1 = this;
        for (var i = 0; i < this.selections.length; i += chunks) {
            _loop_1(i);
        }
        if (this._balanced) {
            this.balanceColumn(outerDivs, balancedColumn);
            maxWidth = balancedColumn.reduce(function (x, y) { return x + y; }, 20);
        }
        outerDivs.forEach(function (div) { return div.style.width = maxWidth + 'px'; });
    };
    SelectionBox.prototype.getChunkSize = function (size) {
        switch (this.grid) {
            case "square":
                return Math.floor(Math.sqrt(size));
            case "horizontal":
                return Math.floor(size / SelectionBox.chunkSize);
            case "vertical":
            default:
                return SelectionBox.chunkSize;
        }
    };
    SelectionBox.prototype.balanceColumn = function (divs, column) {
        divs.forEach(function (div) {
            var children = Array.from(div.children);
            for (var i = 0, child = void 0; child = children[i]; i++) {
                child.style.width = column[i] + 'px';
            }
        });
    };
    SelectionBox.prototype.combineColumn = function (col1, col2) {
        var result = [];
        var i = 0;
        while (col1[i] || col2[i]) {
            if (!col1[i]) {
                result = result.concat(col2.slice(i));
                break;
            }
            if (!col2[i]) {
                result = result.concat(col1.slice(i));
                break;
            }
            result.push(Math.max(col1[i], col2[i]));
            i++;
        }
        ;
        return result;
    };
    SelectionBox.prototype.left = function (event) {
        var _this = this;
        this.move(event, function (index) {
            return (index === 0 ? _this.selections.length : index) - 1;
        });
    };
    SelectionBox.prototype.right = function (event) {
        var _this = this;
        this.move(event, function (index) {
            return index === _this.selections.length - 1 ? 0 : index + 1;
        });
    };
    SelectionBox.prototype.generateHtml = function () {
        _super.prototype.generateHtml.call(this);
        this.html.classList.add(html_classes_js_1.HtmlClasses['SELECTION']);
    };
    SelectionBox.prototype.generateContent = function () {
        var div = _super.prototype.generateContent.call(this);
        div.classList.add(html_classes_js_1.HtmlClasses['SELECTIONBOX']);
        div.removeAttribute('tabindex');
        return div;
    };
    SelectionBox.prototype.findSelection = function (event) {
        var target = event.target;
        var selection = null;
        if (target.id) {
            selection = this.selections.find(function (x) { return x.html.id === target.id; });
        }
        if (!selection) {
            var id_1 = target.parentElement.id;
            selection = this.selections.find(function (x) { return x.html.id === id_1; });
        }
        return selection;
    };
    SelectionBox.prototype.move = function (event, isNext) {
        var selection = this.findSelection(event);
        if (selection.focused) {
            selection.focused.unfocus();
        }
        var index = this.selections.indexOf(selection);
        var next = isNext(index);
        this.selections[next].focus();
    };
    SelectionBox.prototype.order = function () {
        this.selections.sort(SelectionBox.orderMethod.get(this.style));
    };
    SelectionBox.prototype.toJson = function () {
        return { type: ''
        };
    };
    SelectionBox.chunkSize = 4;
    SelectionBox.orderMethod = new Map([
        ["alphabetical", function (x, y) { return x.items[0].content.localeCompare(y.items[0].content); }],
        ["none", function (_x, _y) { return 1; }],
        ["decreasing", function (x, y) {
                var xl = x.items.length;
                var yl = y.items.length;
                return (xl < yl) ? 1 : ((yl < xl) ? -1 : 0);
            }],
        ["increasing", function (x, y) {
                var xl = x.items.length;
                var yl = y.items.length;
                return (xl < yl) ? -1 : ((yl < xl) ? 1 : 0);
            }],
    ]);
    return SelectionBox;
}(info_js_1.Info));
exports.SelectionBox = SelectionBox;
//# sourceMappingURL=selection_box.js.map