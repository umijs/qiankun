"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BussproofsConfiguration = void 0;
var Configuration_js_1 = require("../Configuration.js");
var BussproofsItems_js_1 = require("./BussproofsItems.js");
var BussproofsUtil_js_1 = require("./BussproofsUtil.js");
require("./BussproofsMappings.js");
exports.BussproofsConfiguration = Configuration_js_1.Configuration.create('bussproofs', {
    handler: {
        macro: ['Bussproofs-macros'],
        environment: ['Bussproofs-environments']
    },
    items: (_a = {},
        _a[BussproofsItems_js_1.ProofTreeItem.prototype.kind] = BussproofsItems_js_1.ProofTreeItem,
        _a),
    preprocessors: [
        [BussproofsUtil_js_1.saveDocument, 1]
    ],
    postprocessors: [
        [BussproofsUtil_js_1.clearDocument, 3],
        [BussproofsUtil_js_1.makeBsprAttributes, 2],
        [BussproofsUtil_js_1.balanceRules, 1]
    ]
});
//# sourceMappingURL=BussproofsConfiguration.js.map