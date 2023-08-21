"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SsmlStepRenderer = void 0;
const ssml_renderer_1 = require("./ssml_renderer");
class SsmlStepRenderer extends ssml_renderer_1.SsmlRenderer {
    markup(descrs) {
        SsmlStepRenderer.MARKS = {};
        return super.markup(descrs);
    }
    merge(spans) {
        const result = [];
        for (let i = 0; i < spans.length; i++) {
            const span = spans[i];
            const id = span.attributes['extid'];
            if (id && !SsmlStepRenderer.MARKS[id]) {
                result.push('<mark name="' + id + '"/>');
                SsmlStepRenderer.MARKS[id] = true;
            }
            if (span.speech.length === 1 && span.speech.match(/[a-zA-Z]/)) {
                result.push('<say-as interpret-as="' +
                    SsmlStepRenderer.CHARACTER_ATTR +
                    '">' +
                    span.speech +
                    '</say-as>');
            }
            else {
                result.push(span.speech);
            }
        }
        return result.join(this.getSeparator());
    }
}
exports.SsmlStepRenderer = SsmlStepRenderer;
SsmlStepRenderer.CHARACTER_ATTR = 'character';
SsmlStepRenderer.MARKS = {};
