"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadScript = exports.loadMapsForIE_ = exports.installWGXpath_ = exports.loadWGXpath_ = exports.mapsForIE = exports.detectEdge = exports.detectIE = void 0;
const system_external_1 = require("./system_external");
const xpath_util_1 = require("./xpath_util");
function detectIE() {
    const isIE = typeof window !== 'undefined' &&
        'ActiveXObject' in window &&
        'clipboardData' in window;
    if (!isIE) {
        return false;
    }
    loadMapsForIE_();
    loadWGXpath_();
    return true;
}
exports.detectIE = detectIE;
function detectEdge() {
    var _a;
    const isEdge = typeof window !== 'undefined' &&
        'MSGestureEvent' in window &&
        ((_a = window.chrome) === null || _a === void 0 ? void 0 : _a.loadTimes) === null;
    if (!isEdge) {
        return false;
    }
    document.evaluate = null;
    loadWGXpath_(true);
    return true;
}
exports.detectEdge = detectEdge;
exports.mapsForIE = null;
function loadWGXpath_(opt_isEdge) {
    loadScript(system_external_1.default.WGXpath);
    installWGXpath_(opt_isEdge);
}
exports.loadWGXpath_ = loadWGXpath_;
function installWGXpath_(opt_isEdge, opt_count) {
    let count = opt_count || 1;
    if (typeof wgxpath === 'undefined' && count < 10) {
        setTimeout(function () {
            installWGXpath_(opt_isEdge, count++);
        }, 200);
        return;
    }
    if (count >= 10) {
        return;
    }
    system_external_1.default.wgxpath = wgxpath;
    opt_isEdge
        ? system_external_1.default.wgxpath.install({ document: document })
        : system_external_1.default.wgxpath.install();
    xpath_util_1.xpath.evaluate = document.evaluate;
    xpath_util_1.xpath.result = XPathResult;
    xpath_util_1.xpath.createNSResolver = document.createNSResolver;
}
exports.installWGXpath_ = installWGXpath_;
function loadMapsForIE_() {
    loadScript(system_external_1.default.mathmapsIePath);
}
exports.loadMapsForIE_ = loadMapsForIE_;
function loadScript(src) {
    const scr = system_external_1.default.document.createElement('script');
    scr.type = 'text/javascript';
    scr.src = src;
    system_external_1.default.document.head
        ? system_external_1.default.document.head.appendChild(scr)
        : system_external_1.default.document.body.appendChild(scr);
}
exports.loadScript = loadScript;
