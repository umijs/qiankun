"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractHighlighter = void 0;
const XpathUtil = require("../common/xpath_util");
const enrich_attr_1 = require("../enrich_mathml/enrich_attr");
class AbstractHighlighter {
    constructor() {
        this.color = null;
        this.mactionName = '';
        this.currentHighlights = [];
    }
    highlight(nodes) {
        this.currentHighlights.push(nodes.map((node) => {
            const info = this.highlightNode(node);
            this.setHighlighted(node);
            return info;
        }));
    }
    highlightAll(node) {
        const mactions = this.getMactionNodes(node);
        for (let i = 0, maction; (maction = mactions[i]); i++) {
            this.highlight([maction]);
        }
    }
    unhighlight() {
        const nodes = this.currentHighlights.pop();
        if (!nodes) {
            return;
        }
        nodes.forEach((highlight) => {
            if (this.isHighlighted(highlight.node)) {
                this.unhighlightNode(highlight);
                this.unsetHighlighted(highlight.node);
            }
        });
    }
    unhighlightAll() {
        while (this.currentHighlights.length > 0) {
            this.unhighlight();
        }
    }
    setColor(color) {
        this.color = color;
    }
    colorString() {
        return this.color.rgba();
    }
    addEvents(node, events) {
        const mactions = this.getMactionNodes(node);
        for (let i = 0, maction; (maction = mactions[i]); i++) {
            for (const event in events) {
                maction.addEventListener(event, events[event]);
            }
        }
    }
    getMactionNodes(node) {
        return Array.from(node.getElementsByClassName(this.mactionName));
    }
    isMactionNode(node) {
        const className = node.className || node.getAttribute('class');
        return className ? !!className.match(new RegExp(this.mactionName)) : false;
    }
    isHighlighted(node) {
        return node.hasAttribute(AbstractHighlighter.ATTR);
    }
    setHighlighted(node) {
        node.setAttribute(AbstractHighlighter.ATTR, 'true');
    }
    unsetHighlighted(node) {
        node.removeAttribute(AbstractHighlighter.ATTR);
    }
    colorizeAll(node) {
        const allNodes = XpathUtil.evalXPath(`.//*[@${enrich_attr_1.Attribute.ID}]`, node);
        allNodes.forEach((x) => this.colorize(x));
    }
    uncolorizeAll(node) {
        const allNodes = XpathUtil.evalXPath(`.//*[@${enrich_attr_1.Attribute.ID}]`, node);
        allNodes.forEach((x) => this.uncolorize(x));
    }
    colorize(node) {
        const fore = (0, enrich_attr_1.addPrefix)('foreground');
        if (node.hasAttribute(fore)) {
            node.setAttribute(fore + '-old', node.style.color);
            node.style.color = node.getAttribute(fore);
        }
    }
    uncolorize(node) {
        const fore = (0, enrich_attr_1.addPrefix)('foreground') + '-old';
        if (node.hasAttribute(fore)) {
            node.style.color = node.getAttribute(fore);
        }
    }
}
exports.AbstractHighlighter = AbstractHighlighter;
AbstractHighlighter.ATTR = 'sre-highlight';
