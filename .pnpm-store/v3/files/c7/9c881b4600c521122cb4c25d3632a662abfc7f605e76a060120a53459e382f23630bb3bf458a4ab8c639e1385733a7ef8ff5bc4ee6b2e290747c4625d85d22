"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorGenerator = void 0;
const enrich_attr_1 = require("../enrich_mathml/enrich_attr");
const color_picker_1 = require("../highlighter/color_picker");
const rebuild_stree_1 = require("../walker/rebuild_stree");
const WalkerUtil = require("../walker/walker_util");
const abstract_speech_generator_1 = require("./abstract_speech_generator");
class ColorGenerator extends abstract_speech_generator_1.AbstractSpeechGenerator {
    constructor() {
        super(...arguments);
        this.modality = (0, enrich_attr_1.addPrefix)('foreground');
        this.contrast = new color_picker_1.ContrastPicker();
    }
    static visitStree_(tree, leaves, ignore) {
        if (!tree.childNodes.length) {
            if (!ignore[tree.id]) {
                leaves.push(tree.id);
            }
            return;
        }
        if (tree.contentNodes.length) {
            if (tree.type === 'punctuated') {
                tree.contentNodes.forEach((x) => (ignore[x.id] = true));
            }
            if (tree.role !== 'implicit') {
                leaves.push(tree.contentNodes.map((x) => x.id));
            }
        }
        if (tree.childNodes.length) {
            if (tree.role === 'implicit') {
                const factors = [];
                let rest = [];
                for (const child of tree.childNodes) {
                    const tt = [];
                    ColorGenerator.visitStree_(child, tt, ignore);
                    if (tt.length <= 2) {
                        factors.push(tt.shift());
                    }
                    rest = rest.concat(tt);
                }
                leaves.push(factors);
                rest.forEach((x) => leaves.push(x));
                return;
            }
            tree.childNodes.forEach((x) => ColorGenerator.visitStree_(x, leaves, ignore));
        }
    }
    getSpeech(node, _xml) {
        return WalkerUtil.getAttribute(node, this.modality);
    }
    generateSpeech(node, _xml) {
        if (!this.getRebuilt()) {
            this.setRebuilt(new rebuild_stree_1.RebuildStree(node));
        }
        this.colorLeaves_(node);
        return WalkerUtil.getAttribute(node, this.modality);
    }
    colorLeaves_(node) {
        const leaves = [];
        ColorGenerator.visitStree_(this.getRebuilt().streeRoot, leaves, {});
        for (const id of leaves) {
            const color = this.contrast.generate();
            let success = false;
            if (Array.isArray(id)) {
                success = id
                    .map((x) => this.colorLeave_(node, x, color))
                    .reduce((x, y) => x || y, false);
            }
            else {
                success = this.colorLeave_(node, id.toString(), color);
            }
            if (success) {
                this.contrast.increment();
            }
        }
    }
    colorLeave_(node, id, color) {
        const aux = WalkerUtil.getBySemanticId(node, id);
        if (aux) {
            aux.setAttribute(this.modality, color);
            return true;
        }
        return false;
    }
}
exports.ColorGenerator = ColorGenerator;
