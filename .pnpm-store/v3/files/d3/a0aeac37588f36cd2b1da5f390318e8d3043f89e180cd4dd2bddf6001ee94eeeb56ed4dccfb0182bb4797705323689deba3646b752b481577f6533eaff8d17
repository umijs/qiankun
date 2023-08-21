"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrioritizedList = void 0;
var PrioritizedList = (function () {
    function PrioritizedList() {
        this.items = [];
        this.items = [];
    }
    PrioritizedList.prototype[Symbol.iterator] = function () {
        var i = 0;
        var items = this.items;
        return {
            next: function () {
                return { value: items[i++], done: (i > items.length) };
            }
        };
    };
    PrioritizedList.prototype.add = function (item, priority) {
        if (priority === void 0) { priority = PrioritizedList.DEFAULTPRIORITY; }
        var i = this.items.length;
        do {
            i--;
        } while (i >= 0 && priority < this.items[i].priority);
        this.items.splice(i + 1, 0, { item: item, priority: priority });
        return item;
    };
    PrioritizedList.prototype.remove = function (item) {
        var i = this.items.length;
        do {
            i--;
        } while (i >= 0 && this.items[i].item !== item);
        if (i >= 0) {
            this.items.splice(i, 1);
        }
    };
    PrioritizedList.DEFAULTPRIORITY = 5;
    return PrioritizedList;
}());
exports.PrioritizedList = PrioritizedList;
//# sourceMappingURL=PrioritizedList.js.map