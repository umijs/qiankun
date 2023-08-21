"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariablePool = void 0;
var VariablePool = (function () {
    function VariablePool() {
        this.pool = {};
    }
    VariablePool.prototype.insert = function (variable) {
        this.pool[variable.name] = variable;
    };
    VariablePool.prototype.lookup = function (name) {
        return this.pool[name];
    };
    VariablePool.prototype.remove = function (name) {
        delete this.pool[name];
    };
    VariablePool.prototype.update = function () {
        for (var variable in this.pool) {
            this.pool[variable].update();
        }
    };
    return VariablePool;
}());
exports.VariablePool = VariablePool;
//# sourceMappingURL=variable_pool.js.map