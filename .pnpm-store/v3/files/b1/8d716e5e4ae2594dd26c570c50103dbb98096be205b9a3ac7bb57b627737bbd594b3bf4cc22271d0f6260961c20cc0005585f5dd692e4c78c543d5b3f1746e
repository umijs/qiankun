"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vulgarFractionSmall = exports.convertVulgarFraction = exports.Combiners = exports.siCombiner = exports.identityTransformer = exports.pluralCase = void 0;
function pluralCase(num, _plural) {
    return num.toString();
}
exports.pluralCase = pluralCase;
function identityTransformer(input) {
    return input.toString();
}
exports.identityTransformer = identityTransformer;
function siCombiner(prefix, unit) {
    return prefix + unit.toLowerCase();
}
exports.siCombiner = siCombiner;
exports.Combiners = {};
exports.Combiners.identityCombiner = function (a, b, c) {
    return a + b + c;
};
exports.Combiners.prefixCombiner = function (letter, font, cap) {
    letter = cap ? cap + ' ' + letter : letter;
    return font ? font + ' ' + letter : letter;
};
exports.Combiners.postfixCombiner = function (letter, font, cap) {
    letter = cap ? cap + ' ' + letter : letter;
    return font ? letter + ' ' + font : letter;
};
exports.Combiners.romanceCombiner = function (letter, font, cap) {
    letter = cap ? letter + ' ' + cap : letter;
    return font ? letter + ' ' + font : letter;
};
function convertVulgarFraction(node, over = '') {
    if (!node.childNodes ||
        !node.childNodes[0] ||
        !node.childNodes[0].childNodes ||
        node.childNodes[0].childNodes.length < 2 ||
        node.childNodes[0].childNodes[0].tagName !==
            "number" ||
        node.childNodes[0].childNodes[0].getAttribute('role') !==
            "integer" ||
        node.childNodes[0].childNodes[1].tagName !==
            "number" ||
        node.childNodes[0].childNodes[1].getAttribute('role') !==
            "integer") {
        return { convertible: false, content: node.textContent };
    }
    const denStr = node.childNodes[0].childNodes[1].textContent;
    const enumStr = node.childNodes[0].childNodes[0].textContent;
    const denominator = Number(denStr);
    const enumerator = Number(enumStr);
    if (isNaN(denominator) || isNaN(enumerator)) {
        return {
            convertible: false,
            content: `${enumStr} ${over} ${denStr}`
        };
    }
    return {
        convertible: true,
        enumerator: enumerator,
        denominator: denominator
    };
}
exports.convertVulgarFraction = convertVulgarFraction;
function vulgarFractionSmall(node, enumer, denom) {
    const conversion = convertVulgarFraction(node);
    if (conversion.convertible) {
        const enumerator = conversion.enumerator;
        const denominator = conversion.denominator;
        return (enumerator > 0 &&
            enumerator < enumer &&
            denominator > 0 &&
            denominator < denom);
    }
    return false;
}
exports.vulgarFractionSmall = vulgarFractionSmall;
