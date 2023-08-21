"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SableRenderer = void 0;
const EngineConst = require("../common/engine_const");
const xml_renderer_1 = require("./xml_renderer");
class SableRenderer extends xml_renderer_1.XmlRenderer {
    finalize(str) {
        return ('<?xml version="1.0"?>' +
            '<!DOCTYPE SABLE PUBLIC "-//SABLE//DTD SABLE speech mark up//EN"' +
            ' "Sable.v0_2.dtd" []><SABLE>' +
            this.getSeparator() +
            str +
            this.getSeparator() +
            '</SABLE>');
    }
    pause(pause) {
        return ('<BREAK ' +
            'MSEC="' +
            this.pauseValue(pause[EngineConst.personalityProps.PAUSE]) +
            '"/>');
    }
    prosodyElement(tag, value) {
        value = this.applyScaleFunction(value);
        switch (tag) {
            case EngineConst.personalityProps.PITCH:
                return '<PITCH RANGE="' + value + '%">';
            case EngineConst.personalityProps.RATE:
                return '<RATE SPEED="' + value + '%">';
            case EngineConst.personalityProps.VOLUME:
                return '<VOLUME LEVEL="' + value + '%">';
            default:
                return '<' + tag.toUpperCase() + ' VALUE="' + value + '">';
        }
    }
    closeTag(tag) {
        return '</' + tag.toUpperCase() + '>';
    }
}
exports.SableRenderer = SableRenderer;
