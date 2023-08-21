"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.union = exports.setdifference = exports.interleaveLists = exports.removeEmpty = void 0;
function removeEmpty(strs) {
    return strs.filter((str) => str);
}
exports.removeEmpty = removeEmpty;
function interleaveLists(list1, list2) {
    const result = [];
    while (list1.length || list2.length) {
        list1.length && result.push(list1.shift());
        list2.length && result.push(list2.shift());
    }
    return result;
}
exports.interleaveLists = interleaveLists;
function setdifference(a, b) {
    if (!a) {
        return [];
    }
    if (!b) {
        return a;
    }
    return a.filter((x) => b.indexOf(x) < 0);
}
exports.setdifference = setdifference;
function union(a, b) {
    if (!a || !b) {
        return a || b || [];
    }
    return a.concat(setdifference(b, a));
}
exports.union = union;
