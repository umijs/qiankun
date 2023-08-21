"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createControlledPromise = void 0;
function createControlledPromise() {
    let resolve = () => undefined;
    let reject = () => undefined;
    const promise = new Promise((aResolve, aReject) => {
        resolve = aResolve;
        reject = aReject;
    });
    return {
        promise,
        resolve,
        reject,
    };
}
exports.createControlledPromise = createControlledPromise;
