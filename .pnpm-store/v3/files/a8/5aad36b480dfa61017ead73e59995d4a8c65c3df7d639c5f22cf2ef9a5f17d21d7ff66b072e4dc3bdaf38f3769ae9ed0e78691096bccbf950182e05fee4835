"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = exports.INIT_ = void 0;
const clearspeak_rules_1 = require("./clearspeak_rules");
const mathspeak_rules_1 = require("./mathspeak_rules");
const other_rules_1 = require("./other_rules");
exports.INIT_ = false;
function init() {
    if (exports.INIT_) {
        return;
    }
    (0, mathspeak_rules_1.MathspeakRules)();
    (0, clearspeak_rules_1.ClearspeakRules)();
    (0, other_rules_1.PrefixRules)();
    (0, other_rules_1.OtherRules)();
    (0, other_rules_1.BrailleRules)();
    exports.INIT_ = true;
}
exports.init = init;
