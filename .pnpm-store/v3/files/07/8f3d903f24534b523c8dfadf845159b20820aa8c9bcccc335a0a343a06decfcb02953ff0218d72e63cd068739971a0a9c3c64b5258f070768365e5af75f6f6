"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHarmonyFactory = void 0;
const versions_1 = require("./versions");
// endregion
/* ****************************************************************************************************************** */
// region: Utilities
/* ****************************************************************************************************************** */
/**
 * Creates a node factory compatible with TS v3+
 */
function createHarmonyFactory(context) {
    var _a;
    return new Proxy((_a = context.tsFactory) !== null && _a !== void 0 ? _a : context.tsInstance, {
        get(target, prop) {
            if (versions_1.TsThreeEight.predicate(context)) {
                return versions_1.TsThreeEight.handler(context, prop);
            }
            else if (versions_1.TsFourSeven.predicate(context)) {
                return versions_1.TsFourSeven.handler(context, prop);
            }
            else {
                return target[prop];
            }
        },
    });
}
exports.createHarmonyFactory = createHarmonyFactory;
// endregion
//# sourceMappingURL=harmony-factory.js.map