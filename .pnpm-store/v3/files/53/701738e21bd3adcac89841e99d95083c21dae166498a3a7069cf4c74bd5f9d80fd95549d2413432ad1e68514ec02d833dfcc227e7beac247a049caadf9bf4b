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
var e_1, _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG = exports.MathJax = exports.Loader = exports.PathFilters = exports.PackageError = exports.Package = void 0;
var global_js_1 = require("./global.js");
var package_js_1 = require("./package.js");
var package_js_2 = require("./package.js");
Object.defineProperty(exports, "Package", { enumerable: true, get: function () { return package_js_2.Package; } });
Object.defineProperty(exports, "PackageError", { enumerable: true, get: function () { return package_js_2.PackageError; } });
var FunctionList_js_1 = require("../util/FunctionList.js");
exports.PathFilters = {
    source: function (data) {
        if (exports.CONFIG.source.hasOwnProperty(data.name)) {
            data.name = exports.CONFIG.source[data.name];
        }
        return true;
    },
    normalize: function (data) {
        var name = data.name;
        if (!name.match(/^(?:[a-z]+:\/)?\/|[a-z]:\\|\[/i)) {
            data.name = '[mathjax]/' + name.replace(/^\.\//, '');
        }
        if (data.addExtension && !name.match(/\.[^\/]+$/)) {
            data.name += '.js';
        }
        return true;
    },
    prefix: function (data) {
        var match;
        while ((match = data.name.match(/^\[([^\]]*)\]/))) {
            if (!exports.CONFIG.paths.hasOwnProperty(match[1]))
                break;
            data.name = exports.CONFIG.paths[match[1]] + data.name.substr(match[0].length);
        }
        return true;
    }
};
var Loader;
(function (Loader) {
    var VERSION = global_js_1.MathJax.version;
    Loader.versions = new Map();
    function ready() {
        var e_2, _a;
        var names = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            names[_i] = arguments[_i];
        }
        if (names.length === 0) {
            names = Array.from(package_js_1.Package.packages.keys());
        }
        var promises = [];
        try {
            for (var names_1 = __values(names), names_1_1 = names_1.next(); !names_1_1.done; names_1_1 = names_1.next()) {
                var name_1 = names_1_1.value;
                var extension = package_js_1.Package.packages.get(name_1) || new package_js_1.Package(name_1, true);
                promises.push(extension.promise);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (names_1_1 && !names_1_1.done && (_a = names_1.return)) _a.call(names_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return Promise.all(promises);
    }
    Loader.ready = ready;
    function load() {
        var e_3, _a;
        var names = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            names[_i] = arguments[_i];
        }
        if (names.length === 0) {
            return Promise.resolve();
        }
        var promises = [];
        var _loop_1 = function (name_2) {
            var extension = package_js_1.Package.packages.get(name_2);
            if (!extension) {
                extension = new package_js_1.Package(name_2);
                extension.provides(exports.CONFIG.provides[name_2]);
            }
            extension.checkNoLoad();
            promises.push(extension.promise.then(function () {
                if (!exports.CONFIG.versionWarnings)
                    return;
                if (extension.isLoaded && !Loader.versions.has(package_js_1.Package.resolvePath(name_2))) {
                    console.warn("No version information available for component ".concat(name_2));
                }
            }));
        };
        try {
            for (var names_2 = __values(names), names_2_1 = names_2.next(); !names_2_1.done; names_2_1 = names_2.next()) {
                var name_2 = names_2_1.value;
                _loop_1(name_2);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (names_2_1 && !names_2_1.done && (_a = names_2.return)) _a.call(names_2);
            }
            finally { if (e_3) throw e_3.error; }
        }
        package_js_1.Package.loadAll();
        return Promise.all(promises);
    }
    Loader.load = load;
    function preLoad() {
        var e_4, _a;
        var names = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            names[_i] = arguments[_i];
        }
        try {
            for (var names_3 = __values(names), names_3_1 = names_3.next(); !names_3_1.done; names_3_1 = names_3.next()) {
                var name_3 = names_3_1.value;
                var extension = package_js_1.Package.packages.get(name_3);
                if (!extension) {
                    extension = new package_js_1.Package(name_3, true);
                    extension.provides(exports.CONFIG.provides[name_3]);
                }
                extension.loaded();
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (names_3_1 && !names_3_1.done && (_a = names_3.return)) _a.call(names_3);
            }
            finally { if (e_4) throw e_4.error; }
        }
    }
    Loader.preLoad = preLoad;
    function defaultReady() {
        if (typeof exports.MathJax.startup !== 'undefined') {
            exports.MathJax.config.startup.ready();
        }
    }
    Loader.defaultReady = defaultReady;
    function getRoot() {
        var root = __dirname + '/../../es5';
        if (typeof document !== 'undefined') {
            var script = document.currentScript || document.getElementById('MathJax-script');
            if (script) {
                root = script.src.replace(/\/[^\/]*$/, '');
            }
        }
        return root;
    }
    Loader.getRoot = getRoot;
    function checkVersion(name, version, _type) {
        Loader.versions.set(package_js_1.Package.resolvePath(name), VERSION);
        if (exports.CONFIG.versionWarnings && version !== VERSION) {
            console.warn("Component ".concat(name, " uses ").concat(version, " of MathJax; version in use is ").concat(VERSION));
            return true;
        }
        return false;
    }
    Loader.checkVersion = checkVersion;
    Loader.pathFilters = new FunctionList_js_1.FunctionList();
    Loader.pathFilters.add(exports.PathFilters.source, 0);
    Loader.pathFilters.add(exports.PathFilters.normalize, 10);
    Loader.pathFilters.add(exports.PathFilters.prefix, 20);
})(Loader = exports.Loader || (exports.Loader = {}));
exports.MathJax = global_js_1.MathJax;
if (typeof exports.MathJax.loader === 'undefined') {
    (0, global_js_1.combineDefaults)(exports.MathJax.config, 'loader', {
        paths: {
            mathjax: Loader.getRoot()
        },
        source: {},
        dependencies: {},
        provides: {},
        load: [],
        ready: Loader.defaultReady.bind(Loader),
        failed: function (error) { return console.log("MathJax(".concat(error.package || '?', "): ").concat(error.message)); },
        require: null,
        pathFilters: [],
        versionWarnings: true
    });
    (0, global_js_1.combineWithMathJax)({
        loader: Loader
    });
    try {
        for (var _b = __values(exports.MathJax.config.loader.pathFilters), _c = _b.next(); !_c.done; _c = _b.next()) {
            var filter = _c.value;
            if (Array.isArray(filter)) {
                Loader.pathFilters.add(filter[0], filter[1]);
            }
            else {
                Loader.pathFilters.add(filter);
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
}
exports.CONFIG = exports.MathJax.config.loader;
//# sourceMappingURL=loader.js.map