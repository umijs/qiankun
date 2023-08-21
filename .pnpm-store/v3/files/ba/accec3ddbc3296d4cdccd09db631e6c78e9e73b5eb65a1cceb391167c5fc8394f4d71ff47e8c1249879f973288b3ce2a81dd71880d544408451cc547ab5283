"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SsmlRenderer = void 0;
const engine_1 = require("../common/engine");
const EngineConst = require("../common/engine_const");
const xml_renderer_1 = require("./xml_renderer");
class SsmlRenderer extends xml_renderer_1.XmlRenderer {
    finalize(str) {
        return ('<?xml version="1.0"?><speak version="1.1"' +
            ' xmlns="http://www.w3.org/2001/10/synthesis">' +
            '<prosody rate="' +
            engine_1.default.getInstance().getRate() +
            '%">' +
            this.getSeparator() +
            str +
            this.getSeparator() +
            '</prosody></speak>');
    }
    pause(pause) {
        return ('<break ' +
            'time="' +
            this.pauseValue(pause[EngineConst.personalityProps.PAUSE]) +
            'ms"/>');
    }
    prosodyElement(attr, value) {
        value = Math.floor(this.applyScaleFunction(value));
        const valueStr = value < 0 ? value.toString() : '+' + value.toString();
        return ('<prosody ' +
            attr.toLowerCase() +
            '="' +
            valueStr +
            (attr === EngineConst.personalityProps.VOLUME ? '>' : '%">'));
    }
    closeTag(_tag) {
        return '</prosody>';
    }
}
exports.SsmlRenderer = SsmlRenderer;
