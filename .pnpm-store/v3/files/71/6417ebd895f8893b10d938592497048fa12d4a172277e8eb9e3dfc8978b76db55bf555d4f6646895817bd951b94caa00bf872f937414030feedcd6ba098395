"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncQueue = exports.Async = void 0;
/**
 * Utilities for parallel asynchronous operations, for use with the system `Promise` APIs.
 *
 * @beta
 */
class Async {
    /**
     * Given an input array and a `callback` function, invoke the callback to start a
     * promise for each element in the array.  Returns an array containing the results.
     *
     * @remarks
     * This API is similar to the system `Array#map`, except that the loop is asynchronous,
     * and the maximum number of concurrent promises can be throttled
     * using {@link IAsyncParallelismOptions.concurrency}.
     *
     * If `callback` throws a synchronous exception, or if it returns a promise that rejects,
     * then the loop stops immediately.  Any remaining array items will be skipped, and
     * overall operation will reject with the first error that was encountered.
     *
     * @param iterable - the array of inputs for the callback function
     * @param callback - a function that starts an asynchronous promise for an element
     *   from the array
     * @param options - options for customizing the control flow
     * @returns an array containing the result for each callback, in the same order
     *   as the original input `array`
     */
    static async mapAsync(iterable, callback, options) {
        const result = [];
        await Async.forEachAsync(iterable, async (item, arrayIndex) => {
            result[arrayIndex] = await callback(item, arrayIndex);
        }, options);
        return result;
    }
    /**
     * Given an input array and a `callback` function, invoke the callback to start a
     * promise for each element in the array.
     *
     * @remarks
     * This API is similar to the system `Array#forEach`, except that the loop is asynchronous,
     * and the maximum number of concurrent promises can be throttled
     * using {@link IAsyncParallelismOptions.concurrency}.
     *
     * If `callback` throws a synchronous exception, or if it returns a promise that rejects,
     * then the loop stops immediately.  Any remaining array items will be skipped, and
     * overall operation will reject with the first error that was encountered.
     *
     * @param iterable - the array of inputs for the callback function
     * @param callback - a function that starts an asynchronous promise for an element
     *   from the array
     * @param options - options for customizing the control flow
     */
    static async forEachAsync(iterable, callback, options) {
        await new Promise((resolve, reject) => {
            const concurrency = (options === null || options === void 0 ? void 0 : options.concurrency) && options.concurrency > 0 ? options.concurrency : Infinity;
            let operationsInProgress = 0;
            const iterator = (iterable[Symbol.iterator] ||
                iterable[Symbol.asyncIterator]).call(iterable);
            let arrayIndex = 0;
            let iteratorIsComplete = false;
            let promiseHasResolvedOrRejected = false;
            async function queueOperationsAsync() {
                while (operationsInProgress < concurrency && !iteratorIsComplete && !promiseHasResolvedOrRejected) {
                    // Increment the concurrency while waiting for the iterator.
                    // This function is reentrant, so this ensures that at most `concurrency` executions are waiting
                    operationsInProgress++;
                    const currentIteratorResult = await iterator.next();
                    // eslint-disable-next-line require-atomic-updates
                    iteratorIsComplete = !!currentIteratorResult.done;
                    if (!iteratorIsComplete) {
                        Promise.resolve(callback(currentIteratorResult.value, arrayIndex++))
                            .then(async () => {
                            operationsInProgress--;
                            await onOperationCompletionAsync();
                        })
                            .catch((error) => {
                            promiseHasResolvedOrRejected = true;
                            reject(error);
                        });
                    }
                    else {
                        // The iterator is complete and there wasn't a value, so untrack the waiting state.
                        operationsInProgress--;
                    }
                }
                if (iteratorIsComplete) {
                    await onOperationCompletionAsync();
                }
            }
            async function onOperationCompletionAsync() {
                if (!promiseHasResolvedOrRejected) {
                    if (operationsInProgress === 0 && iteratorIsComplete) {
                        promiseHasResolvedOrRejected = true;
                        resolve();
                    }
                    else if (!iteratorIsComplete) {
                        await queueOperationsAsync();
                    }
                }
            }
            queueOperationsAsync().catch((error) => {
                promiseHasResolvedOrRejected = true;
                reject(error);
            });
        });
    }
    /**
     * Return a promise that resolves after the specified number of milliseconds.
     */
    static async sleep(ms) {
        await new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }
    /**
     * Executes an async function and optionally retries it if it fails.
     */
    static async runWithRetriesAsync({ action, maxRetries, retryDelayMs = 0 }) {
        let retryCounter = 0;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            try {
                return await action();
            }
            catch (e) {
                if (++retryCounter > maxRetries) {
                    throw e;
                }
                else if (retryDelayMs > 0) {
                    await Async.sleep(retryDelayMs);
                }
            }
        }
    }
}
exports.Async = Async;
function getSignal() {
    let resolver;
    const promise = new Promise((resolve) => {
        resolver = resolve;
    });
    return [promise, resolver];
}
/**
 * A queue that allows for asynchronous iteration. During iteration, the queue will wait until
 * the next item is pushed into the queue before yielding. If instead all queue items are consumed
 * and all callbacks have been called, the queue will return.
 *
 * @public
 */
class AsyncQueue {
    constructor(iterable) {
        this._queue = iterable ? Array.from(iterable) : [];
        const [promise, resolver] = getSignal();
        this._onPushSignal = promise;
        this._onPushResolve = resolver;
    }
    [Symbol.asyncIterator]() {
        return __asyncGenerator(this, arguments, function* _a() {
            let activeIterations = 0;
            let [callbackSignal, callbackResolve] = getSignal();
            const callback = () => {
                if (--activeIterations === 0) {
                    // Resolve whatever the latest callback promise is and create a new one
                    callbackResolve();
                    const [newCallbackSignal, newCallbackResolve] = getSignal();
                    callbackSignal = newCallbackSignal;
                    callbackResolve = newCallbackResolve;
                }
            };
            let position = 0;
            while (this._queue.length > position || activeIterations > 0) {
                if (this._queue.length > position) {
                    activeIterations++;
                    yield yield __await([this._queue[position++], callback]);
                }
                else {
                    // On push, the item will be added to the queue and the onPushSignal will be resolved.
                    // On calling the callback, active iterations will be decremented by the callback and the
                    // callbackSignal will be resolved. This means that the loop will continue if there are
                    // active iterations or if there are items in the queue that haven't been yielded yet.
                    yield __await(Promise.race([this._onPushSignal, callbackSignal]));
                }
            }
        });
    }
    /**
     * Adds an item to the queue.
     *
     * @param item - The item to push into the queue.
     */
    push(item) {
        this._queue.push(item);
        this._onPushResolve();
        const [onPushSignal, onPushResolve] = getSignal();
        this._onPushSignal = onPushSignal;
        this._onPushResolve = onPushResolve;
    }
}
exports.AsyncQueue = AsyncQueue;
//# sourceMappingURL=Async.js.map