"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MmlCssHighlighter = void 0;
const css_highlighter_1 = require("./css_highlighter");
class MmlCssHighlighter extends css_highlighter_1.CssHighlighter {
    constructor() {
        super();
        this.mactionName = 'maction';
    }
    getMactionNodes(node) {
        return Array.from(node.getElementsByTagName(this.mactionName));
    }
    isMactionNode(node) {
        return node.tagName === this.mactionName;
    }
}
exports.MmlCssHighlighter = MmlCssHighlighter;
