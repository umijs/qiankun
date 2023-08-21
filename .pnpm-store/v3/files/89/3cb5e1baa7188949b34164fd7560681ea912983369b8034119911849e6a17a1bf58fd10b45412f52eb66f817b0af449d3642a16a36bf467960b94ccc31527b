"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSpanElement = exports.isPauseElement = exports.isMarkupElement = exports.personalityMarkup = exports.sortClose = exports.mergeMarkup = exports.mergePause = void 0;
const base_util_1 = require("../common/base_util");
const EngineConst = require("../common/engine_const");
const span_1 = require("./span");
function mergePause(oldPause, newPause, opt_merge) {
    if (!oldPause) {
        return newPause;
    }
    return { pause: mergePause_(oldPause.pause, newPause.pause, opt_merge) };
}
exports.mergePause = mergePause;
function mergePause_(oldPause, newPause, opt_merge) {
    const merge = opt_merge ||
        function (x, y) {
            if (typeof x === 'number' && typeof y === 'number') {
                return x + y;
            }
            if (typeof x === 'number') {
                return y;
            }
            if (typeof y === 'number') {
                return x;
            }
            return [oldPause, newPause].sort()[0];
        };
    return merge.call(null, oldPause, newPause);
}
function mergeMarkup(oldPers, newPers) {
    delete oldPers.open;
    newPers.close.forEach((x) => delete oldPers[x]);
    newPers.open.forEach((x) => (oldPers[x] = newPers[x]));
    const keys = Object.keys(oldPers);
    oldPers.open = keys;
}
exports.mergeMarkup = mergeMarkup;
function sortClose(open, descrs) {
    if (open.length <= 1) {
        return open;
    }
    const result = [];
    for (let i = 0, descr; (descr = descrs[i]), open.length; i++) {
        if (!descr.close || !descr.close.length) {
            continue;
        }
        descr.close.forEach(function (x) {
            const index = open.indexOf(x);
            if (index !== -1) {
                result.unshift(x);
                open.splice(index, 1);
            }
        });
    }
    return result;
}
exports.sortClose = sortClose;
let PersonalityRanges_ = {};
let LastOpen_ = [];
function personalityMarkup(descrs) {
    PersonalityRanges_ = {};
    LastOpen_ = [];
    let result = [];
    const currentPers = {};
    for (let i = 0, descr; (descr = descrs[i]); i++) {
        let pause = null;
        const span = descr.descriptionSpan();
        const pers = descr.personality;
        const join = pers[EngineConst.personalityProps.JOIN];
        delete pers[EngineConst.personalityProps.JOIN];
        if (typeof pers[EngineConst.personalityProps.PAUSE] !== 'undefined') {
            pause = {
                [EngineConst.personalityProps.PAUSE]: pers[EngineConst.personalityProps.PAUSE]
            };
            delete pers[EngineConst.personalityProps.PAUSE];
        }
        const diff = personalityDiff_(pers, currentPers);
        appendMarkup_(result, span, diff, join, pause, true);
    }
    result = result.concat(finaliseMarkup_());
    result = simplifyMarkup_(result);
    return result;
}
exports.personalityMarkup = personalityMarkup;
function appendElement_(markup, element) {
    const last = markup[markup.length - 1];
    if (!last) {
        markup.push(element);
        return;
    }
    if (isSpanElement(element) && isSpanElement(last)) {
        if (typeof last.join === 'undefined') {
            last.span = last.span.concat(element.span);
            return;
        }
        const lstr = last['span'].pop();
        const fstr = element['span'].shift();
        last['span'].push(lstr + last.join + fstr);
        last['span'] = last['span'].concat(element.span);
        last.join = element.join;
        return;
    }
    if (isPauseElement(element) && isPauseElement(last)) {
        last.pause = mergePause_(last.pause, element.pause);
        return;
    }
    markup.push(element);
}
function simplifyMarkup_(markup) {
    const lastPers = {};
    const result = [];
    for (let i = 0, element; (element = markup[i]); i++) {
        if (!isMarkupElement(element)) {
            appendElement_(result, element);
            continue;
        }
        if (!element.close || element.close.length !== 1 || element.open.length) {
            copyValues_(element, lastPers);
            result.push(element);
            continue;
        }
        let nextElement = markup[i + 1];
        if (!nextElement || isSpanElement(nextElement)) {
            copyValues_(element, lastPers);
            result.push(element);
            continue;
        }
        const pauseElement = isPauseElement(nextElement) ? nextElement : null;
        if (pauseElement) {
            nextElement = markup[i + 2];
        }
        if (nextElement &&
            isMarkupElement(nextElement) &&
            nextElement.open[0] === element.close[0] &&
            !nextElement.close.length &&
            nextElement[nextElement.open[0]] === lastPers[nextElement.open[0]]) {
            if (pauseElement) {
                appendElement_(result, pauseElement);
                i = i + 2;
            }
            else {
                i = i + 1;
            }
        }
        else {
            copyValues_(element, lastPers);
            result.push(element);
        }
    }
    return result;
}
function copyValues_(from, to) {
    if (from['rate']) {
        to['rate'] = from['rate'];
    }
    if (from['pitch']) {
        to['pitch'] = from['pitch'];
    }
    if (from['volume']) {
        to['volume'] = from['volume'];
    }
}
function finaliseMarkup_() {
    const final = [];
    for (let i = LastOpen_.length - 1; i >= 0; i--) {
        const pers = LastOpen_[i];
        if (pers.length) {
            const markup = { open: [], close: [] };
            for (let j = 0; j < pers.length; j++) {
                const per = pers[j];
                markup.close.push(per);
                markup[per] = 0;
            }
            final.push(markup);
        }
    }
    return final;
}
function isMarkupElement(element) {
    return typeof element === 'object' && element.open;
}
exports.isMarkupElement = isMarkupElement;
function isPauseElement(element) {
    return (typeof element === 'object' &&
        Object.keys(element).length === 1 &&
        Object.keys(element)[0] === EngineConst.personalityProps.PAUSE);
}
exports.isPauseElement = isPauseElement;
function isSpanElement(element) {
    const keys = Object.keys(element);
    return (typeof element === 'object' &&
        ((keys.length === 1 && keys[0] === 'span') ||
            (keys.length === 2 &&
                ((keys[0] === 'span' && keys[1] === 'join') ||
                    (keys[1] === 'span' && keys[0] === 'join')))));
}
exports.isSpanElement = isSpanElement;
function appendMarkup_(markup, span, pers, join, pause, merge = false) {
    if (merge) {
        const last = markup[markup.length - 1];
        let oldJoin;
        if (last) {
            oldJoin = last[EngineConst.personalityProps.JOIN];
        }
        if (last && !span.speech && pause && isPauseElement(last)) {
            const pauseProp = EngineConst.personalityProps.PAUSE;
            last[pauseProp] = mergePause_(last[pauseProp], pause[pauseProp]);
            pause = null;
        }
        if (last &&
            span.speech &&
            Object.keys(pers).length === 0 &&
            isSpanElement(last)) {
            if (typeof oldJoin !== 'undefined') {
                const lastSpan = last['span'].pop();
                span = new span_1.Span(lastSpan.speech + oldJoin + span.speech, lastSpan.attributes);
            }
            last['span'].push(span);
            span = new span_1.Span('', {});
            last[EngineConst.personalityProps.JOIN] = join;
        }
    }
    if (Object.keys(pers).length !== 0) {
        markup.push(pers);
    }
    if (span.speech) {
        markup.push({ span: [span], join: join });
    }
    if (pause) {
        markup.push(pause);
    }
}
function personalityDiff_(current, old) {
    if (!old) {
        return current;
    }
    const result = {};
    for (const prop of EngineConst.personalityPropList) {
        const currentValue = current[prop];
        const oldValue = old[prop];
        if ((!currentValue && !oldValue) ||
            (currentValue && oldValue && currentValue === oldValue)) {
            continue;
        }
        const value = currentValue || 0;
        if (!isMarkupElement(result)) {
            result.open = [];
            result.close = [];
        }
        if (!currentValue) {
            result.close.push(prop);
        }
        if (!oldValue) {
            result.open.push(prop);
        }
        if (oldValue && currentValue) {
            result.close.push(prop);
            result.open.push(prop);
        }
        old[prop] = value;
        result[prop] = value;
        PersonalityRanges_[prop]
            ? PersonalityRanges_[prop].push(value)
            : (PersonalityRanges_[prop] = [value]);
    }
    if (isMarkupElement(result)) {
        let c = result.close.slice();
        while (c.length > 0) {
            let lo = LastOpen_.pop();
            const loNew = (0, base_util_1.setdifference)(lo, c);
            c = (0, base_util_1.setdifference)(c, lo);
            lo = loNew;
            if (c.length === 0) {
                if (lo.length !== 0) {
                    LastOpen_.push(lo);
                }
                continue;
            }
            if (lo.length === 0) {
                continue;
            }
            result.close = result.close.concat(lo);
            result.open = result.open.concat(lo);
            for (let i = 0, open; (open = lo[i]); i++) {
                result[open] = old[open];
            }
        }
        LastOpen_.push(result.open);
    }
    return result;
}
