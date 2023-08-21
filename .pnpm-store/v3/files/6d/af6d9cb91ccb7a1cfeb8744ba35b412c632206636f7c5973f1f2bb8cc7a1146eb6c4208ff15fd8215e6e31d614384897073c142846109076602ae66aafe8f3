"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSharedData = exports.setSharedData = void 0;
const map = new Map();
/**
 * set data to map key
 */
function setSharedData(key, value) {
    map.set(key, value);
}
exports.setSharedData = setSharedData;
/**
 * get data and clear map key
 */
function getSharedData(key) {
    const data = map.get(key);
    map.delete(key);
    return data;
}
exports.getSharedData = getSharedData;
