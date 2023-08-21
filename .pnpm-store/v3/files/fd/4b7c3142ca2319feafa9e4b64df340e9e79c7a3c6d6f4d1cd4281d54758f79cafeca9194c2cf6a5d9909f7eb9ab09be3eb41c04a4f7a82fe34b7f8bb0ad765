"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorModel = void 0;
var TexError_js_1 = __importDefault(require("../TexError.js"));
var ColorConstants_js_1 = require("./ColorConstants.js");
var ColorModelProcessors = new Map();
var ColorModel = (function () {
    function ColorModel() {
        this.userColors = new Map();
    }
    ColorModel.prototype.normalizeColor = function (model, def) {
        if (!model || model === 'named') {
            return def;
        }
        if (ColorModelProcessors.has(model)) {
            var modelProcessor = ColorModelProcessors.get(model);
            return modelProcessor(def);
        }
        throw new TexError_js_1.default('UndefinedColorModel', 'Color model \'%1\' not defined', model);
    };
    ColorModel.prototype.getColor = function (model, def) {
        if (!model || model === 'named') {
            return this.getColorByName(def);
        }
        return this.normalizeColor(model, def);
    };
    ColorModel.prototype.getColorByName = function (name) {
        if (this.userColors.has(name)) {
            return this.userColors.get(name);
        }
        if (ColorConstants_js_1.COLORS.has(name)) {
            return ColorConstants_js_1.COLORS.get(name);
        }
        return name;
    };
    ColorModel.prototype.defineColor = function (model, name, def) {
        var normalized = this.normalizeColor(model, def);
        this.userColors.set(name, normalized);
    };
    return ColorModel;
}());
exports.ColorModel = ColorModel;
ColorModelProcessors.set('rgb', function (rgb) {
    var e_1, _a;
    var rgbParts = rgb.trim().split(/\s*,\s*/);
    var RGB = '#';
    if (rgbParts.length !== 3) {
        throw new TexError_js_1.default('ModelArg1', 'Color values for the %1 model require 3 numbers', 'rgb');
    }
    try {
        for (var rgbParts_1 = __values(rgbParts), rgbParts_1_1 = rgbParts_1.next(); !rgbParts_1_1.done; rgbParts_1_1 = rgbParts_1.next()) {
            var rgbPart = rgbParts_1_1.value;
            if (!rgbPart.match(/^(\d+(\.\d*)?|\.\d+)$/)) {
                throw new TexError_js_1.default('InvalidDecimalNumber', 'Invalid decimal number');
            }
            var n = parseFloat(rgbPart);
            if (n < 0 || n > 1) {
                throw new TexError_js_1.default('ModelArg2', 'Color values for the %1 model must be between %2 and %3', 'rgb', '0', '1');
            }
            var pn = Math.floor(n * 255).toString(16);
            if (pn.length < 2) {
                pn = '0' + pn;
            }
            RGB += pn;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (rgbParts_1_1 && !rgbParts_1_1.done && (_a = rgbParts_1.return)) _a.call(rgbParts_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return RGB;
});
ColorModelProcessors.set('RGB', function (rgb) {
    var e_2, _a;
    var rgbParts = rgb.trim().split(/\s*,\s*/);
    var RGB = '#';
    if (rgbParts.length !== 3) {
        throw new TexError_js_1.default('ModelArg1', 'Color values for the %1 model require 3 numbers', 'RGB');
    }
    try {
        for (var rgbParts_2 = __values(rgbParts), rgbParts_2_1 = rgbParts_2.next(); !rgbParts_2_1.done; rgbParts_2_1 = rgbParts_2.next()) {
            var rgbPart = rgbParts_2_1.value;
            if (!rgbPart.match(/^\d+$/)) {
                throw new TexError_js_1.default('InvalidNumber', 'Invalid number');
            }
            var n = parseInt(rgbPart);
            if (n > 255) {
                throw new TexError_js_1.default('ModelArg2', 'Color values for the %1 model must be between %2 and %3', 'RGB', '0', '255');
            }
            var pn = n.toString(16);
            if (pn.length < 2) {
                pn = '0' + pn;
            }
            RGB += pn;
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (rgbParts_2_1 && !rgbParts_2_1.done && (_a = rgbParts_2.return)) _a.call(rgbParts_2);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return RGB;
});
ColorModelProcessors.set('gray', function (gray) {
    if (!gray.match(/^\s*(\d+(\.\d*)?|\.\d+)\s*$/)) {
        throw new TexError_js_1.default('InvalidDecimalNumber', 'Invalid decimal number');
    }
    var n = parseFloat(gray);
    if (n < 0 || n > 1) {
        throw new TexError_js_1.default('ModelArg2', 'Color values for the %1 model must be between %2 and %3', 'gray', '0', '1');
    }
    var pn = Math.floor(n * 255).toString(16);
    if (pn.length < 2) {
        pn = '0' + pn;
    }
    return "#".concat(pn).concat(pn).concat(pn);
});
//# sourceMappingURL=ColorUtil.js.map