"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractWrapper = void 0;
var AbstractWrapper = (function () {
    function AbstractWrapper(factory, node) {
        this.factory = factory;
        this.node = node;
    }
    Object.defineProperty(AbstractWrapper.prototype, "kind", {
        get: function () {
            return this.node.kind;
        },
        enumerable: false,
        configurable: true
    });
    AbstractWrapper.prototype.wrap = function (node) {
        return this.factory.wrap(node);
    };
    return AbstractWrapper;
}());
exports.AbstractWrapper = AbstractWrapper;
//# sourceMappingURL=Wrapper.js.map