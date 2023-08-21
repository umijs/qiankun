"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MmlHighlighter = void 0;
const abstract_highlighter_1 = require("./abstract_highlighter");
class MmlHighlighter extends abstract_highlighter_1.AbstractHighlighter {
    constructor() {
        super();
        this.mactionName = 'maction';
    }
    highlightNode(node) {
        let style = node.getAttribute('style');
        style += ';background-color: ' + this.colorString().background;
        style += ';color: ' + this.colorString().foreground;
        node.setAttribute('style', style);
        return { node: node };
    }
    unhighlightNode(info) {
        let style = info.node.getAttribute('style');
        style = style.replace(';background-color: ' + this.colorString().background, '');
        style = style.replace(';color: ' + this.colorString().foreground, '');
        info.node.setAttribute('style', style);
    }
    colorString() {
        return this.color.rgba();
    }
    getMactionNodes(node) {
        return Array.from(node.getElementsByTagName(this.mactionName));
    }
    isMactionNode(node) {
        return node.tagName === this.mactionName;
    }
}
exports.MmlHighlighter = MmlHighlighter;
