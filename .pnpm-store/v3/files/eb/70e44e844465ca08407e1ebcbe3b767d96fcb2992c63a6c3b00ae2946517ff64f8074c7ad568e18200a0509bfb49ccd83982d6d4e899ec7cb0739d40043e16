"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usage = void 0;
var Usage = (function () {
    function Usage() {
        this.used = new Set();
        this.needsUpdate = [];
    }
    Usage.prototype.add = function (item) {
        var name = JSON.stringify(item);
        if (!this.used.has(name)) {
            this.needsUpdate.push(item);
        }
        this.used.add(name);
    };
    Usage.prototype.has = function (item) {
        return this.used.has(JSON.stringify(item));
    };
    Usage.prototype.clear = function () {
        this.used.clear();
        this.needsUpdate = [];
    };
    Usage.prototype.update = function () {
        var update = this.needsUpdate;
        this.needsUpdate = [];
        return update;
    };
    return Usage;
}());
exports.Usage = Usage;
//# sourceMappingURL=Usage.js.map