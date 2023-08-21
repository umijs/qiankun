"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuUtil = void 0;
var MenuUtil;
(function (MenuUtil) {
    function close(item) {
        var menu = item.menu;
        if (menu.baseMenu) {
            menu.baseMenu.unpost();
        }
        else {
            menu.unpost();
        }
    }
    MenuUtil.close = close;
    function getActiveElement(item) {
        var menu = item.menu;
        var baseMenu = (menu.baseMenu ? menu.baseMenu : menu);
        return baseMenu.store.active;
    }
    MenuUtil.getActiveElement = getActiveElement;
    function error(_error, msg) {
        console.error('ContextMenu Error: ' + msg);
    }
    MenuUtil.error = error;
    function counter() {
        return count++;
    }
    MenuUtil.counter = counter;
    var count = 0;
})(MenuUtil = exports.MenuUtil || (exports.MenuUtil = {}));
//# sourceMappingURL=menu_util.js.map