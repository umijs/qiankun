"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.factory = exports.getCase = void 0;
function getCase(node) {
    for (let i = 0, enrich; (enrich = exports.factory[i]); i++) {
        if (enrich.test(node)) {
            return enrich.constr(node);
        }
    }
    return null;
}
exports.getCase = getCase;
exports.factory = [];
