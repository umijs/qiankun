"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmsConfiguration = exports.AmsTags = void 0;
var Configuration_js_1 = require("../Configuration.js");
var AmsItems_js_1 = require("./AmsItems.js");
var Tags_js_1 = require("../Tags.js");
var AmsMethods_js_1 = require("./AmsMethods.js");
require("./AmsMappings.js");
var SymbolMap_js_1 = require("../SymbolMap.js");
var AmsTags = (function (_super) {
    __extends(AmsTags, _super);
    function AmsTags() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AmsTags;
}(Tags_js_1.AbstractTags));
exports.AmsTags = AmsTags;
var init = function (config) {
    new SymbolMap_js_1.CommandMap(AmsMethods_js_1.NEW_OPS, {}, {});
    config.append(Configuration_js_1.Configuration.local({ handler: { macro: [AmsMethods_js_1.NEW_OPS] },
        priority: -1 }));
};
exports.AmsConfiguration = Configuration_js_1.Configuration.create('ams', {
    handler: {
        character: ['AMSmath-operatorLetter'],
        delimiter: ['AMSsymbols-delimiter', 'AMSmath-delimiter'],
        macro: ['AMSsymbols-mathchar0mi', 'AMSsymbols-mathchar0mo',
            'AMSsymbols-delimiter', 'AMSsymbols-macros',
            'AMSmath-mathchar0mo', 'AMSmath-macros', 'AMSmath-delimiter'],
        environment: ['AMSmath-environment']
    },
    items: (_a = {},
        _a[AmsItems_js_1.MultlineItem.prototype.kind] = AmsItems_js_1.MultlineItem,
        _a[AmsItems_js_1.FlalignItem.prototype.kind] = AmsItems_js_1.FlalignItem,
        _a),
    tags: { 'ams': AmsTags },
    init: init,
    config: function (_config, jax) {
        if (jax.parseOptions.options.multlineWidth) {
            jax.parseOptions.options.ams.multlineWidth = jax.parseOptions.options.multlineWidth;
        }
        delete jax.parseOptions.options.multlineWidth;
    },
    options: {
        multlineWidth: '',
        ams: {
            multlineWidth: '100%',
            multlineIndent: '1em',
        }
    }
});
//# sourceMappingURL=AmsConfiguration.js.map