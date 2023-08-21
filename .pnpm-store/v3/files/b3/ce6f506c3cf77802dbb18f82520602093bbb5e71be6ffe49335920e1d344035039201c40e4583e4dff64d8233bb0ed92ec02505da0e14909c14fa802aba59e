"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomGenerators = exports.ContextFunctions = exports.CustomStrings = exports.CustomQueries = void 0;
class FunctionsStore {
    constructor(prefix, store) {
        this.prefix = prefix;
        this.store = store;
    }
    add(name, func) {
        if (this.checkCustomFunctionSyntax_(name)) {
            this.store[name] = func;
        }
    }
    addStore(store) {
        const keys = Object.keys(store.store);
        for (let i = 0, key; (key = keys[i]); i++) {
            this.add(key, store.store[key]);
        }
    }
    lookup(name) {
        return this.store[name];
    }
    checkCustomFunctionSyntax_(name) {
        const reg = new RegExp('^' + this.prefix);
        if (!name.match(reg)) {
            console.error('FunctionError: Invalid function name. Expected prefix ' + this.prefix);
            return false;
        }
        return true;
    }
}
class CustomQueries extends FunctionsStore {
    constructor() {
        const store = {};
        super('CQF', store);
    }
}
exports.CustomQueries = CustomQueries;
class CustomStrings extends FunctionsStore {
    constructor() {
        const store = {};
        super('CSF', store);
    }
}
exports.CustomStrings = CustomStrings;
class ContextFunctions extends FunctionsStore {
    constructor() {
        const store = {};
        super('CTF', store);
    }
}
exports.ContextFunctions = ContextFunctions;
class CustomGenerators extends FunctionsStore {
    constructor() {
        const store = {};
        super('CGF', store);
    }
}
exports.CustomGenerators = CustomGenerators;
