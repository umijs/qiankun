"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Levels = void 0;
class Levels {
    constructor() {
        this.level_ = [];
    }
    push(level) {
        this.level_.push(level);
    }
    pop() {
        return this.level_.pop();
    }
    peek() {
        return this.level_[this.level_.length - 1] || null;
    }
    indexOf(element) {
        const last = this.peek();
        return !last ? null : last.indexOf(element);
    }
    find(pred) {
        const last = this.peek();
        if (!last) {
            return null;
        }
        for (let i = 0, l = last.length; i < l; i++) {
            if (pred(last[i])) {
                return last[i];
            }
        }
        return null;
    }
    get(index) {
        const last = this.peek();
        return !last || index < 0 || index >= last.length ? null : last[index];
    }
    depth() {
        return this.level_.length;
    }
    clone() {
        const levels = new Levels();
        levels.level_ = this.level_.slice(0);
        return levels;
    }
    toString() {
        let str = '';
        for (let i = 0, level; (level = this.level_[i]); i++) {
            str +=
                '\n' +
                    level.map(function (x) {
                        return x.toString();
                    });
        }
        return str;
    }
}
exports.Levels = Levels;
