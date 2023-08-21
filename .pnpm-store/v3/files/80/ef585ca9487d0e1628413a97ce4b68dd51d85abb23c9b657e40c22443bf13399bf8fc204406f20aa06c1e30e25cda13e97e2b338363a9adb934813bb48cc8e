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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadLatest = void 0;
var CDN = new Map([
    ['cdnjs.cloudflare.com', {
            api: 'https://api.cdnjs.com/libraries/mathjax?fields=version',
            key: 'version',
            base: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/'
        }],
    ['rawcdn.githack.com', {
            api: 'https://api.github.com/repos/mathjax/mathjax/releases/latest',
            key: 'tag_name',
            base: 'https://rawcdn.githack.com/mathjax/MathJax/'
        }],
    ['gitcdn.xyz', {
            api: 'https://api.github.com/repos/mathjax/mathjax/releases/latest',
            key: 'tag_name',
            base: 'https://gitcdn.xyz/mathjax/MathJax/'
        }],
    ['cdn.statically.io', {
            api: 'https://api.github.com/repos/mathjax/mathjax/releases/latest',
            key: 'tag_name',
            base: 'https://cdn.statically.io/gh/mathjax/MathJax/'
        }],
    ['unpkg.com', {
            api: 'https://api.github.com/repos/mathjax/mathjax/releases/latest',
            key: 'tag_name',
            base: 'https://unpkg.com/mathjax@'
        }],
    ['cdn.jsdelivr.net', {
            api: 'https://api.github.com/repos/mathjax/mathjax/releases/latest',
            key: 'tag_name',
            base: 'https://cdn.jsdelivr.net/npm/mathjax@'
        }]
]);
var GITHUB = {
    api: 'https://api.github.com/repos/mathjax/mathjax/releases',
    key: 'tag_name'
};
var MJX_VERSION = 3;
var MJX_LATEST = 'mjx-latest-version';
var SAVE_TIME = 1000 * 60 * 60 * 24 * 7;
var script = null;
function Error(message) {
    if (console && console.error) {
        console.error('MathJax(latest.js): ' + message);
    }
}
function scriptData(script, cdn) {
    if (cdn === void 0) { cdn = null; }
    script.parentNode.removeChild(script);
    var src = script.src;
    var file = src.replace(/.*?\/latest\.js(\?|$)/, '');
    if (file === '') {
        file = 'startup.js';
        src = src.replace(/\?$/, '') + '?' + file;
    }
    var version = (src.match(/(\d+\.\d+\.\d+)(\/es\d+)?\/latest.js\?/) || ['', ''])[1];
    var dir = (src.match(/(\/es\d+)\/latest.js\?/) || ['', ''])[1] || '';
    return {
        tag: script,
        src: src,
        id: script.id,
        version: version,
        dir: dir,
        file: file,
        cdn: cdn
    };
}
function checkScript(script) {
    var e_1, _a;
    try {
        for (var _b = __values(CDN.keys()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var server = _c.value;
            var cdn = CDN.get(server);
            var url = cdn.base;
            var src = script.src;
            if (src && src.substr(0, url.length) === url && src.match(/\/latest\.js(\?|$)/)) {
                return scriptData(script, cdn);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return null;
}
function getScript() {
    var e_2, _a;
    if (document.currentScript) {
        return scriptData(document.currentScript);
    }
    var script = document.getElementById('MathJax-script');
    if (script && script.nodeName.toLowerCase() === 'script') {
        return checkScript(script);
    }
    var scripts = document.getElementsByTagName('script');
    try {
        for (var _b = __values(Array.from(scripts)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var script_1 = _c.value;
            var data = checkScript(script_1);
            if (data) {
                return data;
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return null;
}
function saveVersion(version) {
    try {
        var data = version + ' ' + Date.now();
        localStorage.setItem(MJX_LATEST, data);
    }
    catch (err) { }
}
function getSavedVersion() {
    try {
        var _a = __read(localStorage.getItem(MJX_LATEST).split(/ /), 2), version = _a[0], date = _a[1];
        if (date && Date.now() - parseInt(date) < SAVE_TIME) {
            return version;
        }
    }
    catch (err) { }
    return null;
}
function loadMathJax(url, id) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = url;
    if (id) {
        script.id = id;
    }
    var head = document.head || document.getElementsByTagName('head')[0] || document.body;
    if (head) {
        head.appendChild(script);
    }
    else {
        Error('Can\'t find the document <head> element');
    }
}
function loadDefaultMathJax() {
    if (script) {
        loadMathJax(script.src.replace(/\/latest\.js\?/, '/'), script.id);
    }
    else {
        Error('Can\'t determine the URL for loading MathJax');
    }
}
function loadVersion(version) {
    if (script.version && script.version !== version) {
        script.file = 'latest.js?' + script.file;
    }
    loadMathJax(script.cdn.base + version + script.dir + '/' + script.file, script.id);
}
function checkVersion(version) {
    var major = parseInt(version.split(/\./)[0]);
    if (major === MJX_VERSION && !version.match(/-(beta|rc)/)) {
        saveVersion(version);
        loadVersion(version);
        return true;
    }
    return false;
}
function getXMLHttpRequest() {
    if (window.XMLHttpRequest) {
        return new XMLHttpRequest();
    }
    if (window.ActiveXObject) {
        try {
            return new window.ActiveXObject('Msxml2.XMLHTTP');
        }
        catch (err) { }
        try {
            return new window.ActiveXObject('Microsoft.XMLHTTP');
        }
        catch (err) { }
    }
    return null;
}
function requestXML(cdn, action, failure) {
    var request = getXMLHttpRequest();
    if (request) {
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                if (request.status === 200) {
                    !action(JSON.parse(request.responseText)) && failure();
                }
                else {
                    Error('Problem acquiring MathJax version: status = ' + request.status);
                    failure();
                }
            }
        };
        request.open('GET', cdn.api, true);
        request.send(null);
    }
    else {
        Error('Can\'t create XMLHttpRequest object');
        failure();
    }
}
function loadLatestGitVersion() {
    requestXML(GITHUB, function (json) {
        var e_3, _a;
        if (!(json instanceof Array))
            return false;
        try {
            for (var json_1 = __values(json), json_1_1 = json_1.next(); !json_1_1.done; json_1_1 = json_1.next()) {
                var data = json_1_1.value;
                if (checkVersion(data[GITHUB.key])) {
                    return true;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (json_1_1 && !json_1_1.done && (_a = json_1.return)) _a.call(json_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return false;
    }, loadDefaultMathJax);
}
function loadLatestCdnVersion() {
    requestXML(script.cdn, function (json) {
        if (json instanceof Array) {
            json = json[0];
        }
        if (!checkVersion(json[script.cdn.key])) {
            loadLatestGitVersion();
        }
        return true;
    }, loadDefaultMathJax);
}
function loadLatest() {
    script = getScript();
    if (script && script.cdn) {
        var version = getSavedVersion();
        version ?
            loadVersion(version) :
            loadLatestCdnVersion();
    }
    else {
        loadDefaultMathJax();
    }
}
exports.loadLatest = loadLatest;
//# sourceMappingURL=latest.js.map