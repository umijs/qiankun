"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringRenderer = void 0;
const abstract_audio_renderer_1 = require("./abstract_audio_renderer");
const audio_util_1 = require("./audio_util");
class StringRenderer extends abstract_audio_renderer_1.AbstractAudioRenderer {
    markup(descrs) {
        let str = '';
        const markup = (0, audio_util_1.personalityMarkup)(descrs);
        const clean = markup.filter((x) => x.span);
        if (!clean.length) {
            return str;
        }
        const len = clean.length - 1;
        for (let i = 0, descr; (descr = clean[i]); i++) {
            if (descr.span) {
                str += this.merge(descr.span);
            }
            if (i >= len) {
                continue;
            }
            const join = descr.join;
            str += typeof join === 'undefined' ? this.getSeparator() : join;
        }
        return str;
    }
}
exports.StringRenderer = StringRenderer;
