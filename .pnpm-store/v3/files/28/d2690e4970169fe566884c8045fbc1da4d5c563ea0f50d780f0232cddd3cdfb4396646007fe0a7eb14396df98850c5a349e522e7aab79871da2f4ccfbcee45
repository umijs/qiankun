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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { DocNode } from './DocNode';
import { StringChecks } from '../parser/StringChecks';
import { DocExcerpt, ExcerptKind } from './DocExcerpt';
/**
 * The abstract base class for {@link DocInlineTag}, {@link DocLinkTag}, and {@link DocInheritDocTag}.
 */
var DocInlineTagBase = /** @class */ (function (_super) {
    __extends(DocInlineTagBase, _super);
    /**
     * Don't call this directly.  Instead use {@link TSDocParser}
     * @internal
     */
    function DocInlineTagBase(parameters) {
        var _this = _super.call(this, parameters) || this;
        StringChecks.validateTSDocTagName(parameters.tagName);
        if (DocNode.isParsedParameters(parameters)) {
            _this._openingDelimiterExcerpt = new DocExcerpt({
                configuration: _this.configuration,
                excerptKind: ExcerptKind.InlineTag_OpeningDelimiter,
                content: parameters.openingDelimiterExcerpt
            });
            _this._tagNameExcerpt = new DocExcerpt({
                configuration: _this.configuration,
                excerptKind: ExcerptKind.InlineTag_TagName,
                content: parameters.tagNameExcerpt
            });
            if (parameters.spacingAfterTagNameExcerpt) {
                _this._spacingAfterTagNameExcerpt = new DocExcerpt({
                    configuration: _this.configuration,
                    excerptKind: ExcerptKind.Spacing,
                    content: parameters.spacingAfterTagNameExcerpt
                });
            }
            _this._closingDelimiterExcerpt = new DocExcerpt({
                configuration: _this.configuration,
                excerptKind: ExcerptKind.InlineTag_ClosingDelimiter,
                content: parameters.closingDelimiterExcerpt
            });
        }
        _this._tagName = parameters.tagName;
        _this._tagNameWithUpperCase = parameters.tagName.toUpperCase();
        return _this;
    }
    Object.defineProperty(DocInlineTagBase.prototype, "tagName", {
        /**
         * The TSDoc tag name.  TSDoc tag names start with an at-sign (`@`) followed
         * by ASCII letters using "camelCase" capitalization.
         *
         * @remarks
         * For example, if the inline tag is `{@link Guid.toString | the toString() method}`
         * then the tag name would be `@link`.
         */
        get: function () {
            return this._tagName;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DocInlineTagBase.prototype, "tagNameWithUpperCase", {
        /**
         * The TSDoc tag name in all capitals, which is used for performing
         * case-insensitive comparisons or lookups.
         */
        get: function () {
            return this._tagNameWithUpperCase;
        },
        enumerable: false,
        configurable: true
    });
    /** @override @sealed */
    DocInlineTagBase.prototype.onGetChildNodes = function () {
        return __spreadArrays([
            this._openingDelimiterExcerpt,
            this._tagNameExcerpt,
            this._spacingAfterTagNameExcerpt
        ], this.getChildNodesForContent(), [
            this._closingDelimiterExcerpt
        ]);
    };
    return DocInlineTagBase;
}(DocNode));
export { DocInlineTagBase };
//# sourceMappingURL=DocInlineTagBase.js.map