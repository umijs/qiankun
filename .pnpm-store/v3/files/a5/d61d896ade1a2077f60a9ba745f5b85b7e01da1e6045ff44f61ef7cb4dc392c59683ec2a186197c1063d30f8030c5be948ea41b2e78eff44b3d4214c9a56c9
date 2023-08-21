"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FontCache = void 0;
var FontCache = (function () {
    function FontCache(jax) {
        this.cache = new Map();
        this.defs = null;
        this.localID = '';
        this.nextID = 0;
        this.jax = jax;
    }
    FontCache.prototype.cachePath = function (variant, C, path) {
        var id = 'MJX-' + this.localID + (this.jax.font.getVariant(variant).cacheID || '') + '-' + C;
        if (!this.cache.has(id)) {
            this.cache.set(id, path);
            this.jax.adaptor.append(this.defs, this.jax.svg('path', { id: id, d: path }));
        }
        return id;
    };
    FontCache.prototype.clearLocalID = function () {
        this.localID = '';
    };
    FontCache.prototype.useLocalID = function (id) {
        if (id === void 0) { id = null; }
        this.localID = (id == null ? ++this.nextID : id) + (id === '' ? '' : '-');
    };
    FontCache.prototype.clearCache = function () {
        this.cache = new Map();
        this.defs = this.jax.svg('defs');
    };
    FontCache.prototype.getCache = function () {
        return this.defs;
    };
    return FontCache;
}());
exports.FontCache = FontCache;
//# sourceMappingURL=FontCache.js.map