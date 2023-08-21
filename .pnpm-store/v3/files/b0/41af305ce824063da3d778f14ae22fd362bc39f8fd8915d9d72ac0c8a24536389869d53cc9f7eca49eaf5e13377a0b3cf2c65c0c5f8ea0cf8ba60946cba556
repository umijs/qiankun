"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkupRenderer = void 0;
const EngineConst = require("../common/engine_const");
const abstract_audio_renderer_1 = require("./abstract_audio_renderer");
class MarkupRenderer extends abstract_audio_renderer_1.AbstractAudioRenderer {
    constructor() {
        super(...arguments);
        this.ignoreElements = [EngineConst.personalityProps.LAYOUT];
        this.scaleFunction = null;
    }
    setScaleFunction(a, b, c, d, decimals = 0) {
        this.scaleFunction = (x) => {
            const delta = (x - a) / (b - a);
            const num = c * (1 - delta) + d * delta;
            return +(Math.round((num + 'e+' + decimals)) +
                'e-' +
                decimals);
        };
    }
    applyScaleFunction(value) {
        return this.scaleFunction ? this.scaleFunction(value) : value;
    }
    ignoreElement(key) {
        return this.ignoreElements.indexOf(key) !== -1;
    }
}
exports.MarkupRenderer = MarkupRenderer;
