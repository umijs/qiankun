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
exports.DocBlock = void 0;
var DocNode_1 = require("./DocNode");
var DocSection_1 = require("./DocSection");
/**
 * Represents a section that is introduced by a TSDoc block tag.
 * For example, an `@example` block.
 */
var DocBlock = /** @class */ (function (_super) {
    __extends(DocBlock, _super);
    /**
     * Don't call this directly.  Instead use {@link TSDocParser}
     * @internal
     */
    function DocBlock(parameters) {
        var _this = _super.call(this, parameters) || this;
        _this._blockTag = parameters.blockTag;
        _this._content = new DocSection_1.DocSection({ configuration: _this.configuration });
        return _this;
    }
    Object.defineProperty(DocBlock.prototype, "kind", {
        /** @override */
        get: function () {
            return DocNode_1.DocNodeKind.Block;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DocBlock.prototype, "blockTag", {
        /**
         * The TSDoc tag that introduces this section.
         */
        get: function () {
            return this._blockTag;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DocBlock.prototype, "content", {
        /**
         * The TSDoc tag that introduces this section.
         */
        get: function () {
            return this._content;
        },
        enumerable: false,
        configurable: true
    });
    /** @override */
    DocBlock.prototype.onGetChildNodes = function () {
        return [this.blockTag, this._content];
    };
    return DocBlock;
}(DocNode_1.DocNode));
exports.DocBlock = DocBlock;
//# sourceMappingURL=DocBlock.js.map