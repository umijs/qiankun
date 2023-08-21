"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUBISO = exports.FUNCTIONS = exports.ALPHABETS = exports.NUMBERS = exports.MESSAGES = void 0;
const tr = require("./transformers");
function MESSAGES() {
    return {
        MS: {},
        MSroots: {},
        font: {},
        embellish: {},
        role: {},
        enclose: {},
        navigate: {},
        regexp: {},
        unitTimes: ''
    };
}
exports.MESSAGES = MESSAGES;
function NUMBERS() {
    return {
        zero: 'zero',
        ones: [],
        tens: [],
        large: [],
        special: {},
        wordOrdinal: tr.identityTransformer,
        numericOrdinal: tr.identityTransformer,
        numberToWords: tr.identityTransformer,
        numberToOrdinal: tr.pluralCase,
        vulgarSep: ' ',
        numSep: ' '
    };
}
exports.NUMBERS = NUMBERS;
function ALPHABETS() {
    return {
        latinSmall: [],
        latinCap: [],
        greekSmall: [],
        greekCap: [],
        capPrefix: { default: '' },
        smallPrefix: { default: '' },
        digitPrefix: { default: '' },
        languagePrefix: {},
        digitTrans: {
            default: tr.identityTransformer,
            mathspeak: tr.identityTransformer,
            clearspeak: tr.identityTransformer
        },
        letterTrans: { default: tr.identityTransformer },
        combiner: (letter, _font, _cap) => {
            return letter;
        }
    };
}
exports.ALPHABETS = ALPHABETS;
function FUNCTIONS() {
    return {
        fracNestDepth: (n) => tr.vulgarFractionSmall(n, 10, 100),
        radicalNestDepth: (_count) => '',
        combineRootIndex: function (postfix, _index) {
            return postfix;
        },
        combineNestedFraction: tr.Combiners.identityCombiner,
        combineNestedRadical: tr.Combiners.identityCombiner,
        fontRegexp: function (font) {
            return new RegExp('^' + font.split(/ |-/).join('( |-)') + '( |-)');
        },
        si: tr.siCombiner,
        plural: tr.identityTransformer
    };
}
exports.FUNCTIONS = FUNCTIONS;
function SUBISO() {
    return {
        default: '',
        current: '',
        all: []
    };
}
exports.SUBISO = SUBISO;
