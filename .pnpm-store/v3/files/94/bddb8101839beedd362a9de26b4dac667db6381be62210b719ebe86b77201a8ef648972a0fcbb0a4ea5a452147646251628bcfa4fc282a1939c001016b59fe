"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HtmlHighlighter = void 0;
const DomUtil = require("../common/dom_util");
const abstract_highlighter_1 = require("./abstract_highlighter");
class HtmlHighlighter extends abstract_highlighter_1.AbstractHighlighter {
    constructor() {
        super();
        this.mactionName = 'maction';
    }
    highlightNode(node) {
        const info = {
            node: node,
            foreground: node.style.color,
            position: node.style.position
        };
        const color = this.color.rgb();
        node.style.color = color.foreground;
        node.style.position = 'relative';
        const bbox = node.bbox;
        if (bbox && bbox.w) {
            const vpad = 0.05;
            const hpad = 0;
            const span = DomUtil.createElement('span');
            const left = parseFloat(node.style.paddingLeft || '0');
            span.style.backgroundColor = color.background;
            span.style.opacity = color.alphaback.toString();
            span.style.display = 'inline-block';
            span.style.height = bbox.h + bbox.d + 2 * vpad + 'em';
            span.style.verticalAlign = -bbox.d + 'em';
            span.style.marginTop = span.style.marginBottom = -vpad + 'em';
            span.style.width = bbox.w + 2 * hpad + 'em';
            span.style.marginLeft = left - hpad + 'em';
            span.style.marginRight = -bbox.w - hpad - left + 'em';
            node.parentNode.insertBefore(span, node);
            info.box = span;
        }
        return info;
    }
    unhighlightNode(info) {
        const node = info.node;
        node.style.color = info.foreground;
        node.style.position = info.position;
        if (info.box) {
            info.box.parentNode.removeChild(info.box);
        }
    }
}
exports.HtmlHighlighter = HtmlHighlighter;
