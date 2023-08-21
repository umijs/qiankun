"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BboxConfiguration = exports.BboxMethods = void 0;
var Configuration_js_1 = require("../Configuration.js");
var SymbolMap_js_1 = require("../SymbolMap.js");
var TexError_js_1 = __importDefault(require("../TexError.js"));
exports.BboxMethods = {};
exports.BboxMethods.BBox = function (parser, name) {
    var bbox = parser.GetBrackets(name, '');
    var math = parser.ParseArg(name);
    var parts = bbox.split(/,/);
    var def, background, style;
    for (var i = 0, m = parts.length; i < m; i++) {
        var part = parts[i].trim();
        var match = part.match(/^(\.\d+|\d+(\.\d*)?)(pt|em|ex|mu|px|in|cm|mm)$/);
        if (match) {
            if (def) {
                throw new TexError_js_1.default('MultipleBBoxProperty', '%1 specified twice in %2', 'Padding', name);
            }
            var pad = BBoxPadding(match[1] + match[3]);
            if (pad) {
                def = {
                    height: '+' + pad,
                    depth: '+' + pad,
                    lspace: pad,
                    width: '+' + (2 * parseInt(match[1], 10)) + match[3]
                };
            }
        }
        else if (part.match(/^([a-z0-9]+|\#[0-9a-f]{6}|\#[0-9a-f]{3})$/i)) {
            if (background) {
                throw new TexError_js_1.default('MultipleBBoxProperty', '%1 specified twice in %2', 'Background', name);
            }
            background = part;
        }
        else if (part.match(/^[-a-z]+:/i)) {
            if (style) {
                throw new TexError_js_1.default('MultipleBBoxProperty', '%1 specified twice in %2', 'Style', name);
            }
            style = BBoxStyle(part);
        }
        else if (part !== '') {
            throw new TexError_js_1.default('InvalidBBoxProperty', '"%1" doesn\'t look like a color, a padding dimension, or a style', part);
        }
    }
    if (def) {
        math = parser.create('node', 'mpadded', [math], def);
    }
    if (background || style) {
        def = {};
        if (background) {
            Object.assign(def, { mathbackground: background });
        }
        if (style) {
            Object.assign(def, { style: style });
        }
        math = parser.create('node', 'mstyle', [math], def);
    }
    parser.Push(math);
};
var BBoxStyle = function (styles) {
    return styles;
};
var BBoxPadding = function (pad) {
    return pad;
};
new SymbolMap_js_1.CommandMap('bbox', { bbox: 'BBox' }, exports.BboxMethods);
exports.BboxConfiguration = Configuration_js_1.Configuration.create('bbox', { handler: { macro: ['bbox'] } });
//# sourceMappingURL=BboxConfiguration.js.map