"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTypeArguments = void 0;
function getTypeArguments(type, checker) {
    // getTypeArguments was only added in TS3.7
    if (checker.getTypeArguments) {
        return checker.getTypeArguments(type);
    }
    return type.typeArguments ?? [];
}
exports.getTypeArguments = getTypeArguments;
//# sourceMappingURL=getTypeArguments.js.map