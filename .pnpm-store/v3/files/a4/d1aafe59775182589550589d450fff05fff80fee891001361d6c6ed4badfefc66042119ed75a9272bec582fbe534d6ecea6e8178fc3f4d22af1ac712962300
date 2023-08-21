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
exports.TreeColorer = exports.FlameColorer = exports.AbstractTreeExplorer = void 0;
var Explorer_js_1 = require("./Explorer.js");
var sre_js_1 = __importDefault(require("../sre.js"));
var AbstractTreeExplorer = (function (_super) {
    __extends(AbstractTreeExplorer, _super);
    function AbstractTreeExplorer(document, region, node, mml) {
        var _this = _super.call(this, document, null, node) || this;
        _this.document = document;
        _this.region = region;
        _this.node = node;
        _this.mml = mml;
        _this.stoppable = false;
        return _this;
    }
    AbstractTreeExplorer.prototype.Attach = function () {
        _super.prototype.Attach.call(this);
        this.Start();
    };
    AbstractTreeExplorer.prototype.Detach = function () {
        this.Stop();
        _super.prototype.Detach.call(this);
    };
    return AbstractTreeExplorer;
}(Explorer_js_1.AbstractExplorer));
exports.AbstractTreeExplorer = AbstractTreeExplorer;
var FlameColorer = (function (_super) {
    __extends(FlameColorer, _super);
    function FlameColorer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FlameColorer.prototype.Start = function () {
        if (this.active)
            return;
        this.active = true;
        this.highlighter.highlightAll(this.node);
    };
    FlameColorer.prototype.Stop = function () {
        if (this.active) {
            this.highlighter.unhighlightAll();
        }
        this.active = false;
    };
    return FlameColorer;
}(AbstractTreeExplorer));
exports.FlameColorer = FlameColorer;
var TreeColorer = (function (_super) {
    __extends(TreeColorer, _super);
    function TreeColorer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TreeColorer.prototype.Start = function () {
        if (this.active)
            return;
        this.active = true;
        var generator = sre_js_1.default.getSpeechGenerator('Color');
        if (!this.node.hasAttribute('hasforegroundcolor')) {
            generator.generateSpeech(this.node, this.mml);
            this.node.setAttribute('hasforegroundcolor', 'true');
        }
        this.highlighter.colorizeAll(this.node);
    };
    TreeColorer.prototype.Stop = function () {
        if (this.active) {
            this.highlighter.uncolorizeAll(this.node);
        }
        this.active = false;
    };
    return TreeColorer;
}(AbstractTreeExplorer));
exports.TreeColorer = TreeColorer;
//# sourceMappingURL=TreeExplorer.js.map