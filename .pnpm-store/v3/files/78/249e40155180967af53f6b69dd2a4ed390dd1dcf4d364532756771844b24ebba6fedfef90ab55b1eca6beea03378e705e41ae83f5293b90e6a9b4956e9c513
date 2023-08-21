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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocNodeContainer = void 0;
var DocNode_1 = require("./DocNode");
/**
 * DocNodeContainer is the base class for DocNode classes that allow arbitrary child nodes to be added by the consumer.
 * The child classes are {@link DocParagraph} and {@link DocSection}.
 */
var DocNodeContainer = /** @class */ (function (_super) {
    __extends(DocNodeContainer, _super);
    /**
     * Don't call this directly.  Instead use {@link TSDocParser}
     * @internal
     */
    function DocNodeContainer(parameters, childNodes) {
        var _this = _super.call(this, parameters) || this;
        _this._nodes = [];
        if (childNodes !== undefined && childNodes.length > 0) {
            _this.appendNodes(childNodes);
        }
        return _this;
    }
    Object.defineProperty(DocNodeContainer.prototype, "nodes", {
        /**
         * The nodes that were added to this container.
         */
        get: function () {
            return this._nodes;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Append a node to the container.
     */
    DocNodeContainer.prototype.appendNode = function (docNode) {
        if (!this.configuration.docNodeManager.isAllowedChild(this.kind, docNode.kind)) {
            throw new Error("The TSDocConfiguration does not allow a " + this.kind + " node to" +
                (" contain a node of type " + docNode.kind));
        }
        this._nodes.push(docNode);
    };
    /**
     * Append nodes to the container.
     */
    DocNodeContainer.prototype.appendNodes = function (docNodes) {
        for (var _i = 0, docNodes_1 = docNodes; _i < docNodes_1.length; _i++) {
            var docNode = docNodes_1[_i];
            this.appendNode(docNode);
        }
    };
    /**
     * Remove all nodes from the container.
     */
    DocNodeContainer.prototype.clearNodes = function () {
        this._nodes.length = 0;
    };
    /** @override */
    DocNodeContainer.prototype.onGetChildNodes = function () {
        return this._nodes;
    };
    return DocNodeContainer;
}(DocNode_1.DocNode));
exports.DocNodeContainer = DocNodeContainer;
//# sourceMappingURL=DocNodeContainer.js.map