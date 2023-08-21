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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProofTreeItem = void 0;
var TexError_js_1 = __importDefault(require("../TexError.js"));
var StackItem_js_1 = require("../StackItem.js");
var Stack_js_1 = __importDefault(require("../Stack.js"));
var BussproofsUtil = __importStar(require("./BussproofsUtil.js"));
var ProofTreeItem = (function (_super) {
    __extends(ProofTreeItem, _super);
    function ProofTreeItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.leftLabel = null;
        _this.rigthLabel = null;
        _this.innerStack = new Stack_js_1.default(_this.factory, {}, true);
        return _this;
    }
    Object.defineProperty(ProofTreeItem.prototype, "kind", {
        get: function () {
            return 'proofTree';
        },
        enumerable: false,
        configurable: true
    });
    ProofTreeItem.prototype.checkItem = function (item) {
        if (item.isKind('end') && item.getName() === 'prooftree') {
            var node = this.toMml();
            BussproofsUtil.setProperty(node, 'proof', true);
            return [[this.factory.create('mml', node), item], true];
        }
        if (item.isKind('stop')) {
            throw new TexError_js_1.default('EnvMissingEnd', 'Missing \\end{%1}', this.getName());
        }
        this.innerStack.Push(item);
        return StackItem_js_1.BaseItem.fail;
    };
    ProofTreeItem.prototype.toMml = function () {
        var tree = _super.prototype.toMml.call(this);
        var start = this.innerStack.Top();
        if (start.isKind('start') && !start.Size()) {
            return tree;
        }
        this.innerStack.Push(this.factory.create('stop'));
        var prefix = this.innerStack.Top().toMml();
        return this.create('node', 'mrow', [prefix, tree], {});
    };
    return ProofTreeItem;
}(StackItem_js_1.BaseItem));
exports.ProofTreeItem = ProofTreeItem;
//# sourceMappingURL=BussproofsItems.js.map