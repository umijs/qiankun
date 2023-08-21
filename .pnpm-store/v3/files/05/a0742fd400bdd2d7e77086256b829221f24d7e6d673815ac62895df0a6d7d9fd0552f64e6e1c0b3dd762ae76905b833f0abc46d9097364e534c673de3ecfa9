"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemanticComparator = exports.reduce = exports.sort = exports.apply = exports.add = void 0;
const comparators = [];
function add(comparator) {
    comparators.push(comparator);
}
exports.add = add;
function apply(meaning1, meaning2) {
    for (let i = 0, comparator; (comparator = comparators[i]); i++) {
        const result = comparator.compare(meaning1, meaning2);
        if (result !== 0) {
            return result;
        }
    }
    return 0;
}
exports.apply = apply;
function sort(meanings) {
    meanings.sort(apply);
}
exports.sort = sort;
function reduce(meanings) {
    if (meanings.length <= 1) {
        return meanings;
    }
    const copy = meanings.slice();
    sort(copy);
    const result = [];
    let last;
    do {
        last = copy.pop();
        result.push(last);
    } while (last && copy.length && apply(copy[copy.length - 1], last) === 0);
    return result;
}
exports.reduce = reduce;
class SemanticComparator {
    constructor(comparator, type = null) {
        this.comparator = comparator;
        this.type = type;
        add(this);
    }
    compare(meaning1, meaning2) {
        return this.type &&
            this.type === meaning1.type &&
            this.type === meaning2.type
            ? this.comparator(meaning1, meaning2)
            : 0;
    }
}
exports.SemanticComparator = SemanticComparator;
function simpleFunction(meaning1, meaning2) {
    if (meaning1.role === "simple function") {
        return 1;
    }
    if (meaning2.role === "simple function") {
        return -1;
    }
    return 0;
}
new SemanticComparator(simpleFunction, "identifier");
