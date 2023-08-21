"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeXFont = void 0;
var FontData_js_1 = require("../FontData.js");
var tex_js_1 = require("../../common/fonts/tex.js");
var bold_italic_js_1 = require("./tex/bold-italic.js");
var bold_js_1 = require("./tex/bold.js");
var double_struck_js_1 = require("./tex/double-struck.js");
var fraktur_bold_js_1 = require("./tex/fraktur-bold.js");
var fraktur_js_1 = require("./tex/fraktur.js");
var italic_js_1 = require("./tex/italic.js");
var largeop_js_1 = require("./tex/largeop.js");
var monospace_js_1 = require("./tex/monospace.js");
var normal_js_1 = require("./tex/normal.js");
var sans_serif_bold_italic_js_1 = require("./tex/sans-serif-bold-italic.js");
var sans_serif_bold_js_1 = require("./tex/sans-serif-bold.js");
var sans_serif_italic_js_1 = require("./tex/sans-serif-italic.js");
var sans_serif_js_1 = require("./tex/sans-serif.js");
var script_bold_js_1 = require("./tex/script-bold.js");
var script_js_1 = require("./tex/script.js");
var smallop_js_1 = require("./tex/smallop.js");
var tex_calligraphic_bold_js_1 = require("./tex/tex-calligraphic-bold.js");
var tex_calligraphic_js_1 = require("./tex/tex-calligraphic.js");
var tex_mathit_js_1 = require("./tex/tex-mathit.js");
var tex_oldstyle_bold_js_1 = require("./tex/tex-oldstyle-bold.js");
var tex_oldstyle_js_1 = require("./tex/tex-oldstyle.js");
var tex_size3_js_1 = require("./tex/tex-size3.js");
var tex_size4_js_1 = require("./tex/tex-size4.js");
var tex_variant_js_1 = require("./tex/tex-variant.js");
var delimiters_js_1 = require("../../common/fonts/tex/delimiters.js");
var TeXFont = (function (_super) {
    __extends(TeXFont, _super);
    function TeXFont() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TeXFont.defaultCssFamilyPrefix = 'MJXZERO';
    TeXFont.defaultVariantClasses = {
        'normal': 'mjx-n',
        'bold': 'mjx-b',
        'italic': 'mjx-i',
        'bold-italic': 'mjx-b mjx-i',
        'double-struck': 'mjx-ds mjx-b',
        'fraktur': 'mjx-fr',
        'bold-fraktur': 'mjx-fr mjx-b',
        'script': 'mjx-sc mjx-i',
        'bold-script': 'mjx-sc mjx-b mjx-i',
        'sans-serif': 'mjx-ss',
        'bold-sans-serif': 'mjx-ss mjx-b',
        'sans-serif-italic': 'mjx-ss mjx-i',
        'sans-serif-bold-italic': 'mjx-ss mjx-b mjx-i',
        'monospace': 'mjx-ty',
        '-smallop': 'mjx-sop',
        '-largeop': 'mjx-lop',
        '-size3': 'mjx-s3',
        '-size4': 'mjx-s4',
        '-tex-calligraphic': 'mjx-cal mjx-i',
        '-tex-bold-calligraphic': 'mjx-cal mjx-b',
        '-tex-mathit': 'mjx-mit mjx-i',
        '-tex-oldstyle': 'mjx-os',
        '-tex-bold-oldstyle': 'mjx-os mjx-b',
        '-tex-variant': 'mjx-var'
    };
    TeXFont.defaultVariantLetters = {
        'normal': '',
        'bold': 'B',
        'italic': 'MI',
        'bold-italic': 'BI',
        'double-struck': 'A',
        'fraktur': 'FR',
        'bold-fraktur': 'FRB',
        'script': 'SC',
        'bold-script': 'SCB',
        'sans-serif': 'SS',
        'bold-sans-serif': 'SSB',
        'sans-serif-italic': 'SSI',
        'sans-serif-bold-italic': 'SSBI',
        'monospace': 'T',
        '-smallop': 'S1',
        '-largeop': 'S2',
        '-size3': 'S3',
        '-size4': 'S4',
        '-tex-calligraphic': 'C',
        '-tex-bold-calligraphic': 'CB',
        '-tex-mathit': 'MI',
        '-tex-oldstyle': 'C',
        '-tex-bold-oldstyle': 'CB',
        '-tex-variant': 'A'
    };
    TeXFont.defaultDelimiters = delimiters_js_1.delimiters;
    TeXFont.defaultChars = {
        'normal': normal_js_1.normal,
        'bold': bold_js_1.bold,
        'italic': italic_js_1.italic,
        'bold-italic': bold_italic_js_1.boldItalic,
        'double-struck': double_struck_js_1.doubleStruck,
        'fraktur': fraktur_js_1.fraktur,
        'bold-fraktur': fraktur_bold_js_1.frakturBold,
        'script': script_js_1.script,
        'bold-script': script_bold_js_1.scriptBold,
        'sans-serif': sans_serif_js_1.sansSerif,
        'bold-sans-serif': sans_serif_bold_js_1.sansSerifBold,
        'sans-serif-italic': sans_serif_italic_js_1.sansSerifItalic,
        'sans-serif-bold-italic': sans_serif_bold_italic_js_1.sansSerifBoldItalic,
        'monospace': monospace_js_1.monospace,
        '-smallop': smallop_js_1.smallop,
        '-largeop': largeop_js_1.largeop,
        '-size3': tex_size3_js_1.texSize3,
        '-size4': tex_size4_js_1.texSize4,
        '-tex-calligraphic': tex_calligraphic_js_1.texCalligraphic,
        '-tex-bold-calligraphic': tex_calligraphic_bold_js_1.texCalligraphicBold,
        '-tex-mathit': tex_mathit_js_1.texMathit,
        '-tex-oldstyle': tex_oldstyle_js_1.texOldstyle,
        '-tex-bold-oldstyle': tex_oldstyle_bold_js_1.texOldstyleBold,
        '-tex-variant': tex_variant_js_1.texVariant
    };
    TeXFont.defaultStyles = __assign(__assign({}, FontData_js_1.CHTMLFontData.defaultStyles), { '.MJX-TEX': {
            'font-family': 'MJXZERO, MJXTEX'
        }, '.TEX-B': {
            'font-family': 'MJXZERO, MJXTEX-B'
        }, '.TEX-I': {
            'font-family': 'MJXZERO, MJXTEX-I'
        }, '.TEX-MI': {
            'font-family': 'MJXZERO, MJXTEX-MI'
        }, '.TEX-BI': {
            'font-family': 'MJXZERO, MJXTEX-BI'
        }, '.TEX-S1': {
            'font-family': 'MJXZERO, MJXTEX-S1'
        }, '.TEX-S2': {
            'font-family': 'MJXZERO, MJXTEX-S2'
        }, '.TEX-S3': {
            'font-family': 'MJXZERO, MJXTEX-S3'
        }, '.TEX-S4': {
            'font-family': 'MJXZERO, MJXTEX-S4'
        }, '.TEX-A': {
            'font-family': 'MJXZERO, MJXTEX-A'
        }, '.TEX-C': {
            'font-family': 'MJXZERO, MJXTEX-C'
        }, '.TEX-CB': {
            'font-family': 'MJXZERO, MJXTEX-CB'
        }, '.TEX-FR': {
            'font-family': 'MJXZERO, MJXTEX-FR'
        }, '.TEX-FRB': {
            'font-family': 'MJXZERO, MJXTEX-FRB'
        }, '.TEX-SS': {
            'font-family': 'MJXZERO, MJXTEX-SS'
        }, '.TEX-SSB': {
            'font-family': 'MJXZERO, MJXTEX-SSB'
        }, '.TEX-SSI': {
            'font-family': 'MJXZERO, MJXTEX-SSI'
        }, '.TEX-SC': {
            'font-family': 'MJXZERO, MJXTEX-SC'
        }, '.TEX-T': {
            'font-family': 'MJXZERO, MJXTEX-T'
        }, '.TEX-V': {
            'font-family': 'MJXZERO, MJXTEX-V'
        }, '.TEX-VB': {
            'font-family': 'MJXZERO, MJXTEX-VB'
        }, 'mjx-stretchy-v mjx-c, mjx-stretchy-h mjx-c': {
            'font-family': 'MJXZERO, MJXTEX-S1, MJXTEX-S4, MJXTEX, MJXTEX-A ! important'
        } });
    TeXFont.defaultFonts = __assign(__assign({}, FontData_js_1.CHTMLFontData.defaultFonts), { '@font-face /* 1 */': {
            'font-family': 'MJXTEX',
            src: 'url("%%URL%%/MathJax_Main-Regular.woff") format("woff")'
        }, '@font-face /* 2 */': {
            'font-family': 'MJXTEX-B',
            src: 'url("%%URL%%/MathJax_Main-Bold.woff") format("woff")'
        }, '@font-face /* 3 */': {
            'font-family': 'MJXTEX-I',
            src: 'url("%%URL%%/MathJax_Math-Italic.woff") format("woff")'
        }, '@font-face /* 4 */': {
            'font-family': 'MJXTEX-MI',
            src: 'url("%%URL%%/MathJax_Main-Italic.woff") format("woff")'
        }, '@font-face /* 5 */': {
            'font-family': 'MJXTEX-BI',
            src: 'url("%%URL%%/MathJax_Math-BoldItalic.woff") format("woff")'
        }, '@font-face /* 6 */': {
            'font-family': 'MJXTEX-S1',
            src: 'url("%%URL%%/MathJax_Size1-Regular.woff") format("woff")'
        }, '@font-face /* 7 */': {
            'font-family': 'MJXTEX-S2',
            src: 'url("%%URL%%/MathJax_Size2-Regular.woff") format("woff")'
        }, '@font-face /* 8 */': {
            'font-family': 'MJXTEX-S3',
            src: 'url("%%URL%%/MathJax_Size3-Regular.woff") format("woff")'
        }, '@font-face /* 9 */': {
            'font-family': 'MJXTEX-S4',
            src: 'url("%%URL%%/MathJax_Size4-Regular.woff") format("woff")'
        }, '@font-face /* 10 */': {
            'font-family': 'MJXTEX-A',
            src: 'url("%%URL%%/MathJax_AMS-Regular.woff") format("woff")'
        }, '@font-face /* 11 */': {
            'font-family': 'MJXTEX-C',
            src: 'url("%%URL%%/MathJax_Calligraphic-Regular.woff") format("woff")'
        }, '@font-face /* 12 */': {
            'font-family': 'MJXTEX-CB',
            src: 'url("%%URL%%/MathJax_Calligraphic-Bold.woff") format("woff")'
        }, '@font-face /* 13 */': {
            'font-family': 'MJXTEX-FR',
            src: 'url("%%URL%%/MathJax_Fraktur-Regular.woff") format("woff")'
        }, '@font-face /* 14 */': {
            'font-family': 'MJXTEX-FRB',
            src: 'url("%%URL%%/MathJax_Fraktur-Bold.woff") format("woff")'
        }, '@font-face /* 15 */': {
            'font-family': 'MJXTEX-SS',
            src: 'url("%%URL%%/MathJax_SansSerif-Regular.woff") format("woff")'
        }, '@font-face /* 16 */': {
            'font-family': 'MJXTEX-SSB',
            src: 'url("%%URL%%/MathJax_SansSerif-Bold.woff") format("woff")'
        }, '@font-face /* 17 */': {
            'font-family': 'MJXTEX-SSI',
            src: 'url("%%URL%%/MathJax_SansSerif-Italic.woff") format("woff")'
        }, '@font-face /* 18 */': {
            'font-family': 'MJXTEX-SC',
            src: 'url("%%URL%%/MathJax_Script-Regular.woff") format("woff")'
        }, '@font-face /* 19 */': {
            'font-family': 'MJXTEX-T',
            src: 'url("%%URL%%/MathJax_Typewriter-Regular.woff") format("woff")'
        }, '@font-face /* 20 */': {
            'font-family': 'MJXTEX-V',
            src: 'url("%%URL%%/MathJax_Vector-Regular.woff") format("woff")'
        }, '@font-face /* 21 */': {
            'font-family': 'MJXTEX-VB',
            src: 'url("%%URL%%/MathJax_Vector-Bold.woff") format("woff")'
        } });
    return TeXFont;
}((0, tex_js_1.CommonTeXFontMixin)(FontData_js_1.CHTMLFontData)));
exports.TeXFont = TeXFont;
//# sourceMappingURL=tex.js.map