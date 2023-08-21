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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
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
    function TeXFont(options) {
        var e_1, _a;
        if (options === void 0) { options = null; }
        var _this = _super.call(this, options) || this;
        var CLASS = _this.constructor;
        try {
            for (var _b = __values(Object.keys(CLASS.variantCacheIds)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var variant = _c.value;
                _this.variant[variant].cacheID = 'TEX-' + CLASS.variantCacheIds[variant];
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return _this;
    }
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
    TeXFont.variantCacheIds = {
        'normal': 'N',
        'bold': 'B',
        'italic': 'I',
        'bold-italic': 'BI',
        'double-struck': 'D',
        'fraktur': 'F',
        'bold-fraktur': 'BF',
        'script': 'S',
        'bold-script': 'BS',
        'sans-serif': 'SS',
        'bold-sans-serif': 'BSS',
        'sans-serif-italic': 'SSI',
        'sans-serif-bold-italic': 'SSBI',
        'monospace': 'M',
        '-smallop': 'SO',
        '-largeop': 'LO',
        '-size3': 'S3',
        '-size4': 'S4',
        '-tex-calligraphic': 'C',
        '-tex-bold-calligraphic': 'BC',
        '-tex-mathit': 'MI',
        '-tex-oldstyle': 'OS',
        '-tex-bold-oldstyle': 'BOS',
        '-tex-variant': 'V'
    };
    return TeXFont;
}((0, tex_js_1.CommonTeXFontMixin)(FontData_js_1.SVGFontData)));
exports.TeXFont = TeXFont;
//# sourceMappingURL=tex.js.map