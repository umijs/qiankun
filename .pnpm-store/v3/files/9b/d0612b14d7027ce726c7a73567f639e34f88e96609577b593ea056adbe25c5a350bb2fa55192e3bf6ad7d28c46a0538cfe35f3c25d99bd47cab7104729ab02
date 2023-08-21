"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpgreekConfiguration = void 0;
var Configuration_js_1 = require("../Configuration.js");
var SymbolMap_js_1 = require("../SymbolMap.js");
var TexConstants_js_1 = require("../TexConstants.js");
function mathchar0miNormal(parser, mchar) {
    var def = mchar.attributes || {};
    def.mathvariant = TexConstants_js_1.TexConstant.Variant.NORMAL;
    var node = parser.create('token', 'mi', def, mchar.char);
    parser.Push(node);
}
new SymbolMap_js_1.CharacterMap('upgreek', mathchar0miNormal, {
    upalpha: '\u03B1',
    upbeta: '\u03B2',
    upgamma: '\u03B3',
    updelta: '\u03B4',
    upepsilon: '\u03F5',
    upzeta: '\u03B6',
    upeta: '\u03B7',
    uptheta: '\u03B8',
    upiota: '\u03B9',
    upkappa: '\u03BA',
    uplambda: '\u03BB',
    upmu: '\u03BC',
    upnu: '\u03BD',
    upxi: '\u03BE',
    upomicron: '\u03BF',
    uppi: '\u03C0',
    uprho: '\u03C1',
    upsigma: '\u03C3',
    uptau: '\u03C4',
    upupsilon: '\u03C5',
    upphi: '\u03D5',
    upchi: '\u03C7',
    uppsi: '\u03C8',
    upomega: '\u03C9',
    upvarepsilon: '\u03B5',
    upvartheta: '\u03D1',
    upvarpi: '\u03D6',
    upvarrho: '\u03F1',
    upvarsigma: '\u03C2',
    upvarphi: '\u03C6',
    Upgamma: '\u0393',
    Updelta: '\u0394',
    Uptheta: '\u0398',
    Uplambda: '\u039B',
    Upxi: '\u039E',
    Uppi: '\u03A0',
    Upsigma: '\u03A3',
    Upupsilon: '\u03A5',
    Upphi: '\u03A6',
    Uppsi: '\u03A8',
    Upomega: '\u03A9'
});
exports.UpgreekConfiguration = Configuration_js_1.Configuration.create('upgreek', {
    handler: { macro: ['upgreek'] },
});
//# sourceMappingURL=UpgreekConfiguration.js.map