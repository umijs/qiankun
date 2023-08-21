"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GensymbConfiguration = void 0;
var Configuration_js_1 = require("../Configuration.js");
var TexConstants_js_1 = require("../TexConstants.js");
var SymbolMap_js_1 = require("../SymbolMap.js");
function mathcharUnit(parser, mchar) {
    var def = mchar.attributes || {};
    def.mathvariant = TexConstants_js_1.TexConstant.Variant.NORMAL;
    def.class = 'MathML-Unit';
    var node = parser.create('token', 'mi', def, mchar.char);
    parser.Push(node);
}
new SymbolMap_js_1.CharacterMap('gensymb-symbols', mathcharUnit, {
    ohm: '\u2126',
    degree: '\u00B0',
    celsius: '\u2103',
    perthousand: '\u2030',
    micro: '\u00B5'
});
exports.GensymbConfiguration = Configuration_js_1.Configuration.create('gensymb', {
    handler: { macro: ['gensymb-symbols'] },
});
//# sourceMappingURL=GensymbConfiguration.js.map