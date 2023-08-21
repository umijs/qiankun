"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Package = exports.PackageError = void 0;
var loader_js_1 = require("./loader.js");
var PackageError = (function (_super) {
    __extends(PackageError, _super);
    function PackageError(message, name) {
        var _this = _super.call(this, message) || this;
        _this.package = name;
        return _this;
    }
    return PackageError;
}(Error));
exports.PackageError = PackageError;
var Package = (function () {
    function Package(name, noLoad) {
        if (noLoad === void 0) { noLoad = false; }
        this.isLoaded = false;
        this.isLoading = false;
        this.hasFailed = false;
        this.dependents = [];
        this.dependencies = [];
        this.dependencyCount = 0;
        this.provided = [];
        this.name = name;
        this.noLoad = noLoad;
        Package.packages.set(name, this);
        this.promise = this.makePromise(this.makeDependencies());
    }
    Object.defineProperty(Package.prototype, "canLoad", {
        get: function () {
            return this.dependencyCount === 0 && !this.noLoad && !this.isLoading && !this.hasFailed;
        },
        enumerable: false,
        configurable: true
    });
    Package.resolvePath = function (name, addExtension) {
        if (addExtension === void 0) { addExtension = true; }
        var data = { name: name, original: name, addExtension: addExtension };
        loader_js_1.Loader.pathFilters.execute(data);
        return data.name;
    };
    Package.loadAll = function () {
        var e_1, _a;
        try {
            for (var _b = __values(this.packages.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var extension = _c.value;
                if (extension.canLoad) {
                    extension.load();
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
    };
    Package.prototype.makeDependencies = function () {
        var e_2, _a;
        var promises = [];
        var map = Package.packages;
        var noLoad = this.noLoad;
        var name = this.name;
        var dependencies = [];
        if (loader_js_1.CONFIG.dependencies.hasOwnProperty(name)) {
            dependencies.push.apply(dependencies, __spreadArray([], __read(loader_js_1.CONFIG.dependencies[name]), false));
        }
        else if (name !== 'core') {
            dependencies.push('core');
        }
        try {
            for (var dependencies_1 = __values(dependencies), dependencies_1_1 = dependencies_1.next(); !dependencies_1_1.done; dependencies_1_1 = dependencies_1.next()) {
                var dependent = dependencies_1_1.value;
                var extension = map.get(dependent) || new Package(dependent, noLoad);
                if (this.dependencies.indexOf(extension) < 0) {
                    extension.addDependent(this, noLoad);
                    this.dependencies.push(extension);
                    if (!extension.isLoaded) {
                        this.dependencyCount++;
                        promises.push(extension.promise);
                    }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (dependencies_1_1 && !dependencies_1_1.done && (_a = dependencies_1.return)) _a.call(dependencies_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return promises;
    };
    Package.prototype.makePromise = function (promises) {
        var _this = this;
        var promise = new Promise((function (resolve, reject) {
            _this.resolve = resolve;
            _this.reject = reject;
        }));
        var config = (loader_js_1.CONFIG[this.name] || {});
        if (config.ready) {
            promise = promise.then(function (_name) { return config.ready(_this.name); });
        }
        if (promises.length) {
            promises.push(promise);
            promise = Promise.all(promises).then(function (names) { return names.join(', '); });
        }
        if (config.failed) {
            promise.catch(function (message) { return config.failed(new PackageError(message, _this.name)); });
        }
        return promise;
    };
    Package.prototype.load = function () {
        if (!this.isLoaded && !this.isLoading && !this.noLoad) {
            this.isLoading = true;
            var url = Package.resolvePath(this.name);
            if (loader_js_1.CONFIG.require) {
                this.loadCustom(url);
            }
            else {
                this.loadScript(url);
            }
        }
    };
    Package.prototype.loadCustom = function (url) {
        var _this = this;
        try {
            var result = loader_js_1.CONFIG.require(url);
            if (result instanceof Promise) {
                result.then(function () { return _this.checkLoad(); })
                    .catch(function (err) { return _this.failed('Can\'t load "' + url + '"\n' + err.message.trim()); });
            }
            else {
                this.checkLoad();
            }
        }
        catch (err) {
            this.failed(err.message);
        }
    };
    Package.prototype.loadScript = function (url) {
        var _this = this;
        var script = document.createElement('script');
        script.src = url;
        script.charset = 'UTF-8';
        script.onload = function (_event) { return _this.checkLoad(); };
        script.onerror = function (_event) { return _this.failed('Can\'t load "' + url + '"'); };
        document.head.appendChild(script);
    };
    Package.prototype.loaded = function () {
        var e_3, _a, e_4, _b;
        this.isLoaded = true;
        this.isLoading = false;
        try {
            for (var _c = __values(this.dependents), _d = _c.next(); !_d.done; _d = _c.next()) {
                var dependent = _d.value;
                dependent.requirementSatisfied();
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_3) throw e_3.error; }
        }
        try {
            for (var _e = __values(this.provided), _f = _e.next(); !_f.done; _f = _e.next()) {
                var provided = _f.value;
                provided.loaded();
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
            }
            finally { if (e_4) throw e_4.error; }
        }
        this.resolve(this.name);
    };
    Package.prototype.failed = function (message) {
        this.hasFailed = true;
        this.isLoading = false;
        this.reject(new PackageError(message, this.name));
    };
    Package.prototype.checkLoad = function () {
        var _this = this;
        var config = (loader_js_1.CONFIG[this.name] || {});
        var checkReady = config.checkReady || (function () { return Promise.resolve(); });
        checkReady().then(function () { return _this.loaded(); })
            .catch(function (message) { return _this.failed(message); });
    };
    Package.prototype.requirementSatisfied = function () {
        if (this.dependencyCount) {
            this.dependencyCount--;
            if (this.canLoad) {
                this.load();
            }
        }
    };
    Package.prototype.provides = function (names) {
        var e_5, _a;
        if (names === void 0) { names = []; }
        try {
            for (var names_1 = __values(names), names_1_1 = names_1.next(); !names_1_1.done; names_1_1 = names_1.next()) {
                var name_1 = names_1_1.value;
                var provided = Package.packages.get(name_1);
                if (!provided) {
                    if (!loader_js_1.CONFIG.dependencies[name_1]) {
                        loader_js_1.CONFIG.dependencies[name_1] = [];
                    }
                    loader_js_1.CONFIG.dependencies[name_1].push(name_1);
                    provided = new Package(name_1, true);
                    provided.isLoading = true;
                }
                this.provided.push(provided);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (names_1_1 && !names_1_1.done && (_a = names_1.return)) _a.call(names_1);
            }
            finally { if (e_5) throw e_5.error; }
        }
    };
    Package.prototype.addDependent = function (extension, noLoad) {
        this.dependents.push(extension);
        if (!noLoad) {
            this.checkNoLoad();
        }
    };
    Package.prototype.checkNoLoad = function () {
        var e_6, _a;
        if (this.noLoad) {
            this.noLoad = false;
            try {
                for (var _b = __values(this.dependencies), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var dependency = _c.value;
                    dependency.checkNoLoad();
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_6) throw e_6.error; }
            }
        }
    };
    Package.packages = new Map();
    return Package;
}());
exports.Package = Package;
//# sourceMappingURL=package.js.map