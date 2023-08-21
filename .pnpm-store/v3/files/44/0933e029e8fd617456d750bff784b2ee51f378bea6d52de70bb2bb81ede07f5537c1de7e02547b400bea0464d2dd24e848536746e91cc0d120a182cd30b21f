"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isXml = exports.registerRenderer = exports.error = exports.finalize = exports.merge = exports.markup = exports.getSeparator = exports.setSeparator = void 0;
const engine_1 = require("../common/engine");
const EngineConst = require("../common/engine_const");
const acss_renderer_1 = require("./acss_renderer");
const layout_renderer_1 = require("./layout_renderer");
const punctuation_renderer_1 = require("./punctuation_renderer");
const sable_renderer_1 = require("./sable_renderer");
const span_1 = require("./span");
const ssml_renderer_1 = require("./ssml_renderer");
const ssml_step_renderer_1 = require("./ssml_step_renderer");
const string_renderer_1 = require("./string_renderer");
const xml_renderer_1 = require("./xml_renderer");
const xmlInstance = new ssml_renderer_1.SsmlRenderer();
const renderers = new Map([
    [EngineConst.Markup.NONE, new string_renderer_1.StringRenderer()],
    [EngineConst.Markup.PUNCTUATION, new punctuation_renderer_1.PunctuationRenderer()],
    [EngineConst.Markup.LAYOUT, new layout_renderer_1.LayoutRenderer()],
    [EngineConst.Markup.ACSS, new acss_renderer_1.AcssRenderer()],
    [EngineConst.Markup.SABLE, new sable_renderer_1.SableRenderer()],
    [EngineConst.Markup.VOICEXML, xmlInstance],
    [EngineConst.Markup.SSML, xmlInstance],
    [EngineConst.Markup.SSML_STEP, new ssml_step_renderer_1.SsmlStepRenderer()]
]);
function setSeparator(sep) {
    const renderer = renderers.get(engine_1.default.getInstance().markup);
    if (renderer) {
        renderer.setSeparator(sep);
    }
}
exports.setSeparator = setSeparator;
function getSeparator() {
    const renderer = renderers.get(engine_1.default.getInstance().markup);
    return renderer ? renderer.getSeparator() : '';
}
exports.getSeparator = getSeparator;
function markup(descrs) {
    const renderer = renderers.get(engine_1.default.getInstance().markup);
    if (!renderer) {
        return '';
    }
    return renderer.markup(descrs);
}
exports.markup = markup;
function merge(strs) {
    const span = strs.map((s) => {
        return typeof s === 'string' ? new span_1.Span(s, {}) : s;
    });
    const renderer = renderers.get(engine_1.default.getInstance().markup);
    if (!renderer) {
        return strs.join();
    }
    return renderer.merge(span);
}
exports.merge = merge;
function finalize(str) {
    const renderer = renderers.get(engine_1.default.getInstance().markup);
    if (!renderer) {
        return str;
    }
    return renderer.finalize(str);
}
exports.finalize = finalize;
function error(key) {
    const renderer = renderers.get(engine_1.default.getInstance().markup);
    if (!renderer) {
        return '';
    }
    return renderer.error(key);
}
exports.error = error;
function registerRenderer(type, renderer) {
    renderers.set(type, renderer);
}
exports.registerRenderer = registerRenderer;
function isXml() {
    return renderers.get(engine_1.default.getInstance().markup) instanceof xml_renderer_1.XmlRenderer;
}
exports.isXml = isXml;
