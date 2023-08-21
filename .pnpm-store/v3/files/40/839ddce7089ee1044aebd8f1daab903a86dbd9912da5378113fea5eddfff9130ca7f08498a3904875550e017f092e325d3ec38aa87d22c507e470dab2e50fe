"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemanticMeaningCollator = exports.SemanticNodeCollator = exports.SemanticDefault = void 0;
const SemanticAttr = require("./semantic_attr");
const semantic_ordering_1 = require("./semantic_ordering");
class SemanticDefault {
    constructor() {
        this.map = {};
    }
    static key(symbol, font) {
        return font ? symbol + ':' + font : symbol;
    }
    add(symbol, meaning) {
        this.map[SemanticDefault.key(symbol, meaning.font)] = meaning;
    }
    addNode(node) {
        this.add(node.textContent, node.meaning());
    }
    retrieve(symbol, font) {
        return this.map[SemanticDefault.key(symbol, font)];
    }
    retrieveNode(node) {
        return this.retrieve(node.textContent, node.font);
    }
    size() {
        return Object.keys(this.map).length;
    }
}
exports.SemanticDefault = SemanticDefault;
class SemanticCollator {
    constructor() {
        this.map = {};
    }
    add(symbol, entry) {
        const list = this.map[symbol];
        if (list) {
            list.push(entry);
        }
        else {
            this.map[symbol] = [entry];
        }
    }
    retrieve(symbol, font) {
        return this.map[SemanticDefault.key(symbol, font)];
    }
    retrieveNode(node) {
        return this.retrieve(node.textContent, node.font);
    }
    copy() {
        const collator = this.copyCollator();
        for (const key in this.map) {
            collator.map[key] = this.map[key];
        }
        return collator;
    }
    minimize() {
        for (const key in this.map) {
            if (this.map[key].length === 1) {
                delete this.map[key];
            }
        }
    }
    minimalCollator() {
        const collator = this.copy();
        for (const key in collator.map) {
            if (collator.map[key].length === 1) {
                delete collator.map[key];
            }
        }
        return collator;
    }
    isMultiValued() {
        for (const key in this.map) {
            if (this.map[key].length > 1) {
                return true;
            }
        }
        return false;
    }
    isEmpty() {
        return !Object.keys(this.map).length;
    }
}
class SemanticNodeCollator extends SemanticCollator {
    copyCollator() {
        return new SemanticNodeCollator();
    }
    add(symbol, entry) {
        const key = SemanticDefault.key(symbol, entry.font);
        super.add(key, entry);
    }
    addNode(node) {
        this.add(node.textContent, node);
    }
    toString() {
        const outer = [];
        for (const key in this.map) {
            const length = Array(key.length + 3).join(' ');
            const nodes = this.map[key];
            const inner = [];
            for (let i = 0, node; (node = nodes[i]); i++) {
                inner.push(node.toString());
            }
            outer.push(key + ': ' + inner.join('\n' + length));
        }
        return outer.join('\n');
    }
    collateMeaning() {
        const collator = new SemanticMeaningCollator();
        for (const key in this.map) {
            collator.map[key] = this.map[key].map(function (node) {
                return node.meaning();
            });
        }
        return collator;
    }
}
exports.SemanticNodeCollator = SemanticNodeCollator;
class SemanticMeaningCollator extends SemanticCollator {
    copyCollator() {
        return new SemanticMeaningCollator();
    }
    add(symbol, entry) {
        const list = this.retrieve(symbol, entry.font);
        if (!list ||
            !list.find(function (x) {
                return SemanticAttr.equal(x, entry);
            })) {
            const key = SemanticDefault.key(symbol, entry.font);
            super.add(key, entry);
        }
    }
    addNode(node) {
        this.add(node.textContent, node.meaning());
    }
    toString() {
        const outer = [];
        for (const key in this.map) {
            const length = Array(key.length + 3).join(' ');
            const nodes = this.map[key];
            const inner = [];
            for (let i = 0, node; (node = nodes[i]); i++) {
                inner.push('{type: ' +
                    node.type +
                    ', role: ' +
                    node.role +
                    ', font: ' +
                    node.font +
                    '}');
            }
            outer.push(key + ': ' + inner.join('\n' + length));
        }
        return outer.join('\n');
    }
    reduce() {
        for (const key in this.map) {
            if (this.map[key].length !== 1) {
                this.map[key] = (0, semantic_ordering_1.reduce)(this.map[key]);
            }
        }
    }
    default() {
        const def = new SemanticDefault();
        for (const key in this.map) {
            if (this.map[key].length === 1) {
                def.map[key] = this.map[key][0];
            }
        }
        return def;
    }
    newDefault() {
        const oldDefault = this.default();
        this.reduce();
        const newDefault = this.default();
        return oldDefault.size() !== newDefault.size() ? newDefault : null;
    }
}
exports.SemanticMeaningCollator = SemanticMeaningCollator;
