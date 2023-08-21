"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorConfiguration = void 0;
var SymbolMap_js_1 = require("../SymbolMap.js");
var Configuration_js_1 = require("../Configuration.js");
var ColorMethods_js_1 = require("./ColorMethods.js");
var ColorUtil_js_1 = require("./ColorUtil.js");
new SymbolMap_js_1.CommandMap('color', {
    color: 'Color',
    textcolor: 'TextColor',
    definecolor: 'DefineColor',
    colorbox: 'ColorBox',
    fcolorbox: 'FColorBox'
}, ColorMethods_js_1.ColorMethods);
var config = function (_config, jax) {
    jax.parseOptions.packageData.set('color', { model: new ColorUtil_js_1.ColorModel() });
};
exports.ColorConfiguration = Configuration_js_1.Configuration.create('color', {
    handler: {
        macro: ['color'],
    },
    options: {
        color: {
            padding: '5px',
            borderWidth: '2px'
        }
    },
    config: config
});
//# sourceMappingURL=ColorConfiguration.js.map