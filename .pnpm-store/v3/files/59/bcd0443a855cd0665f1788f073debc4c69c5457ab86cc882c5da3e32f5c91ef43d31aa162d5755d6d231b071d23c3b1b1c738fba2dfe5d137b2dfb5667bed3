"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const variables_1 = require("./variables");
class SystemExternal {
    static extRequire(library) {
        if (typeof process !== 'undefined' && typeof require !== 'undefined') {
            const nodeRequire = eval('require');
            return nodeRequire(library);
        }
        return null;
    }
}
exports.default = SystemExternal;
SystemExternal.windowSupported = (() => !(typeof window === 'undefined'))();
SystemExternal.documentSupported = (() => SystemExternal.windowSupported &&
    !(typeof window.document === 'undefined'))();
SystemExternal.xmldom = SystemExternal.documentSupported
    ? window
    : SystemExternal.extRequire('xmldom-sre');
SystemExternal.document = SystemExternal.documentSupported
    ? window.document
    : new SystemExternal.xmldom.DOMImplementation().createDocument('', '', 0);
SystemExternal.xpath = SystemExternal.documentSupported
    ? document
    : (function () {
        const window = { document: {}, XPathResult: {} };
        const wgx = SystemExternal.extRequire('wicked-good-xpath');
        wgx.install(window);
        window.document.XPathResult = window.XPathResult;
        return window.document;
    })();
SystemExternal.mathmapsIePath = 'https://cdn.jsdelivr.net/npm/sre-mathmaps-ie@' +
    variables_1.Variables.VERSION +
    'mathmaps_ie.js';
SystemExternal.commander = SystemExternal.documentSupported
    ? null
    : SystemExternal.extRequire('commander');
SystemExternal.fs = SystemExternal.documentSupported
    ? null
    : SystemExternal.extRequire('fs');
SystemExternal.url = variables_1.Variables.url;
SystemExternal.jsonPath = (function () {
    return ((SystemExternal.documentSupported
        ? SystemExternal.url
        : process.env.SRE_JSON_PATH ||
            global.SRE_JSON_PATH ||
            (typeof __dirname !== 'undefined'
                ? __dirname + '/mathmaps'
                : process.cwd())) + '/');
})();
SystemExternal.WGXpath = variables_1.Variables.WGXpath;
SystemExternal.wgxpath = null;
