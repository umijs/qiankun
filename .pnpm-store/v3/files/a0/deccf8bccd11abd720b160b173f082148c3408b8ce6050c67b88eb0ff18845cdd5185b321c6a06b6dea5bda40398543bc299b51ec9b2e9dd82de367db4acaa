"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhysicsConfiguration = void 0;
var Configuration_js_1 = require("../Configuration.js");
var PhysicsItems_js_1 = require("./PhysicsItems.js");
require("./PhysicsMappings.js");
exports.PhysicsConfiguration = Configuration_js_1.Configuration.create('physics', {
    handler: {
        macro: [
            'Physics-automatic-bracing-macros',
            'Physics-vector-macros',
            'Physics-vector-mo',
            'Physics-vector-mi',
            'Physics-derivative-macros',
            'Physics-expressions-macros',
            'Physics-quick-quad-macros',
            'Physics-bra-ket-macros',
            'Physics-matrix-macros'
        ],
        character: ['Physics-characters'],
        environment: ['Physics-aux-envs']
    },
    items: (_a = {},
        _a[PhysicsItems_js_1.AutoOpen.prototype.kind] = PhysicsItems_js_1.AutoOpen,
        _a),
    options: {
        physics: {
            italicdiff: false,
            arrowdel: false
        }
    }
});
//# sourceMappingURL=PhysicsConfiguration.js.map