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
import { DocNodeKind } from './DocNode';
import { DocNodeContainer } from './DocNodeContainer';
/**
 * Represents a paragraph of text, similar to a `<p>` element in HTML.
 * Like CommonMark, the TSDoc syntax uses blank lines to delineate paragraphs
 * instead of explicitly notating them.
 */
var DocParagraph = /** @class */ (function (_super) {
    __extends(DocParagraph, _super);
    /**
     * Don't call this directly.  Instead use {@link TSDocParser}
     * @internal
     */
    function DocParagraph(parameters, childNodes) {
        return _super.call(this, parameters, childNodes) || this;
    }
    Object.defineProperty(DocParagraph.prototype, "kind", {
        /** @override */
        get: function () {
            return DocNodeKind.Paragraph;
        },
        enumerable: false,
        configurable: true
    });
    return DocParagraph;
}(DocNodeContainer));
export { DocParagraph };
//# sourceMappingURL=DocParagraph.js.map