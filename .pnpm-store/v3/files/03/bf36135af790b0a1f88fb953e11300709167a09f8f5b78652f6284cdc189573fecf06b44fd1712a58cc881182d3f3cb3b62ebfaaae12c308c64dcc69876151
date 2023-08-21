"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChtmlHighlighter = void 0;
const css_highlighter_1 = require("./css_highlighter");
class ChtmlHighlighter extends css_highlighter_1.CssHighlighter {
    constructor() {
        super();
    }
    isMactionNode(node) {
        return node.tagName.toUpperCase() === this.mactionName.toUpperCase();
    }
    getMactionNodes(node) {
        return Array.from(node.getElementsByTagName(this.mactionName));
    }
}
exports.ChtmlHighlighter = ChtmlHighlighter;
