"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.highlighterMapping_ = exports.addEvents = exports.highlighter = void 0;
const chtml_highlighter_1 = require("./chtml_highlighter");
const color_picker_1 = require("./color_picker");
const css_highlighter_1 = require("./css_highlighter");
const html_highlighter_1 = require("./html_highlighter");
const mml_css_highlighter_1 = require("./mml_css_highlighter");
const mml_highlighter_1 = require("./mml_highlighter");
const svg_highlighter_1 = require("./svg_highlighter");
const svg_v3_highlighter_1 = require("./svg_v3_highlighter");
function highlighter(back, fore, rendererInfo) {
    const colorPicker = new color_picker_1.ColorPicker(back, fore);
    const renderer = rendererInfo.renderer === 'NativeMML' && rendererInfo.browser === 'Safari'
        ? 'MML-CSS'
        : rendererInfo.renderer === 'SVG' && rendererInfo.browser === 'v3'
            ? 'SVG-V3'
            : rendererInfo.renderer;
    const highlighter = new (exports.highlighterMapping_[renderer] ||
        exports.highlighterMapping_['NativeMML'])();
    highlighter.setColor(colorPicker);
    return highlighter;
}
exports.highlighter = highlighter;
function addEvents(node, events, rendererInfo) {
    const highlight = exports.highlighterMapping_[rendererInfo.renderer];
    if (highlight) {
        new highlight().addEvents(node, events);
    }
}
exports.addEvents = addEvents;
exports.highlighterMapping_ = {
    SVG: svg_highlighter_1.SvgHighlighter,
    'SVG-V3': svg_v3_highlighter_1.SvgV3Highlighter,
    NativeMML: mml_highlighter_1.MmlHighlighter,
    'HTML-CSS': html_highlighter_1.HtmlHighlighter,
    'MML-CSS': mml_css_highlighter_1.MmlCssHighlighter,
    CommonHTML: css_highlighter_1.CssHighlighter,
    CHTML: chtml_highlighter_1.ChtmlHighlighter
};
