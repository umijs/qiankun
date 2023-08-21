"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
var abstract_item_js_1 = require("./abstract_item.js");
var menu_util_js_1 = require("./menu_util.js");
var Command = (function (_super) {
    __extends(Command, _super);
    function Command(menu, content, command, id) {
        var _this = _super.call(this, menu, 'command', content, id) || this;
        _this.command = command;
        return _this;
    }
    Command.fromJson = function (_factory, _a, menu) {
        var content = _a.content, action = _a.action, id = _a.id;
        return new this(menu, content, action, id);
    };
    Command.prototype.executeAction = function () {
        try {
            this.command(menu_util_js_1.MenuUtil.getActiveElement(this));
        }
        catch (e) {
            menu_util_js_1.MenuUtil.error(e, 'Illegal command callback.');
        }
        menu_util_js_1.MenuUtil.close(this);
    };
    Command.prototype.toJson = function () {
        return { type: ''
        };
    };
    return Command;
}(abstract_item_js_1.AbstractItem));
exports.Command = Command;
//# sourceMappingURL=item_command.js.map