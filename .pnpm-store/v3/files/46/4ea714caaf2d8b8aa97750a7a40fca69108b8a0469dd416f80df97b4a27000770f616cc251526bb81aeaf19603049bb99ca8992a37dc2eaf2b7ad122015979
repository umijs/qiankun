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
exports.BeginEnvItem = void 0;
var TexError_js_1 = __importDefault(require("../TexError.js"));
var StackItem_js_1 = require("../StackItem.js");
var BeginEnvItem = (function (_super) {
    __extends(BeginEnvItem, _super);
    function BeginEnvItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(BeginEnvItem.prototype, "kind", {
        get: function () {
            return 'beginEnv';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BeginEnvItem.prototype, "isOpen", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    BeginEnvItem.prototype.checkItem = function (item) {
        if (item.isKind('end')) {
            if (item.getName() !== this.getName()) {
                throw new TexError_js_1.default('EnvBadEnd', '\\begin{%1} ended with \\end{%2}', this.getName(), item.getName());
            }
            return [[this.factory.create('mml', this.toMml())], true];
        }
        if (item.isKind('stop')) {
            throw new TexError_js_1.default('EnvMissingEnd', 'Missing \\end{%1}', this.getName());
        }
        return _super.prototype.checkItem.call(this, item);
    };
    return BeginEnvItem;
}(StackItem_js_1.BaseItem));
exports.BeginEnvItem = BeginEnvItem;
//# sourceMappingURL=NewcommandItems.js.map