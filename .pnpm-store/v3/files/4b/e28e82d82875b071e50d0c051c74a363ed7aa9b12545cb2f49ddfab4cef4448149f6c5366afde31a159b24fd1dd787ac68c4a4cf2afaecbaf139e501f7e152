"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XmlRenderer = void 0;
const engine_1 = require("../common/engine");
const AudioUtil = require("./audio_util");
const markup_renderer_1 = require("./markup_renderer");
class XmlRenderer extends markup_renderer_1.MarkupRenderer {
    markup(descrs) {
        this.setScaleFunction(-2, 2, -100, 100, 2);
        const markup = AudioUtil.personalityMarkup(descrs);
        const result = [];
        const currentOpen = [];
        for (let i = 0, descr; (descr = markup[i]); i++) {
            if (descr.span) {
                result.push(this.merge(descr.span));
                continue;
            }
            if (AudioUtil.isPauseElement(descr)) {
                result.push(this.pause(descr));
                continue;
            }
            if (descr.close.length) {
                for (let j = 0; j < descr.close.length; j++) {
                    const last = currentOpen.pop();
                    if (descr.close.indexOf(last) === -1) {
                        throw new engine_1.SREError('Unknown closing markup element: ' + last);
                    }
                    result.push(this.closeTag(last));
                }
            }
            if (descr.open.length) {
                const open = AudioUtil.sortClose(descr.open.slice(), markup.slice(i + 1));
                open.forEach((o) => {
                    result.push(this.prosodyElement(o, descr[o]));
                    currentOpen.push(o);
                });
            }
        }
        return result.join(' ');
    }
}
exports.XmlRenderer = XmlRenderer;
