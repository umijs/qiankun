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
exports.AutoOpen = void 0;
var StackItem_js_1 = require("../StackItem.js");
var ParseUtil_js_1 = __importDefault(require("../ParseUtil.js"));
var NodeUtil_js_1 = __importDefault(require("../NodeUtil.js"));
var TexParser_js_1 = __importDefault(require("../TexParser.js"));
var AutoOpen = (function (_super) {
    __extends(AutoOpen, _super);
    function AutoOpen() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.openCount = 0;
        return _this;
    }
    Object.defineProperty(AutoOpen.prototype, "kind", {
        get: function () {
            return 'auto open';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AutoOpen.prototype, "isOpen", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    AutoOpen.prototype.toMml = function () {
        var parser = this.factory.configuration.parser;
        var right = this.getProperty('right');
        if (this.getProperty('smash')) {
            var mml_1 = _super.prototype.toMml.call(this);
            var smash = parser.create('node', 'mpadded', [mml_1], { height: 0, depth: 0 });
            this.Clear();
            this.Push(parser.create('node', 'TeXAtom', [smash]));
        }
        if (right) {
            this.Push(new TexParser_js_1.default(right, parser.stack.env, parser.configuration).mml());
        }
        var mml = ParseUtil_js_1.default.fenced(this.factory.configuration, this.getProperty('open'), _super.prototype.toMml.call(this), this.getProperty('close'), this.getProperty('big'));
        NodeUtil_js_1.default.removeProperties(mml, 'open', 'close', 'texClass');
        return mml;
    };
    AutoOpen.prototype.checkItem = function (item) {
        if (item.isKind('mml') && item.Size() === 1) {
            var mml = item.toMml();
            if (mml.isKind('mo') && mml.getText() === this.getProperty('open')) {
                this.openCount++;
            }
        }
        var close = item.getProperty('autoclose');
        if (close && close === this.getProperty('close') && !this.openCount--) {
            if (this.getProperty('ignore')) {
                this.Clear();
                return [[], true];
            }
            return [[this.toMml()], true];
        }
        return _super.prototype.checkItem.call(this, item);
    };
    AutoOpen.errors = Object.assign(Object.create(StackItem_js_1.BaseItem.errors), {
        'stop': ['ExtraOrMissingDelims', 'Extra open or missing close delimiter']
    });
    return AutoOpen;
}(StackItem_js_1.BaseItem));
exports.AutoOpen = AutoOpen;
//# sourceMappingURL=PhysicsItems.js.map