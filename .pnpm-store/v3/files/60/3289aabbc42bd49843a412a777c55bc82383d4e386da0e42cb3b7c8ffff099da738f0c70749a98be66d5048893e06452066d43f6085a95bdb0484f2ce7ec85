"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrailleStore = void 0;
const semantic_annotations_1 = require("../semantic_tree/semantic_annotations");
const math_store_1 = require("./math_store");
class BrailleStore extends math_store_1.MathStore {
    constructor() {
        super(...arguments);
        this.modality = 'braille';
        this.customTranscriptions = { '\u22ca': '⠈⠡⠳' };
    }
    evaluateString(str) {
        const descs = [];
        const text = Array.from(str);
        for (let i = 0; i < text.length; i++) {
            descs.push(this.evaluateCharacter(text[i]));
        }
        return descs;
    }
    annotations() {
        for (let i = 0, annotator; (annotator = this.annotators[i]); i++) {
            (0, semantic_annotations_1.activate)(this.locale, annotator);
        }
    }
}
exports.BrailleStore = BrailleStore;
