"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = exports.EventType = exports.Move = exports.KeyCode = void 0;
var KeyCode;
(function (KeyCode) {
    KeyCode[KeyCode["ENTER"] = 13] = "ENTER";
    KeyCode[KeyCode["ESC"] = 27] = "ESC";
    KeyCode[KeyCode["SPACE"] = 32] = "SPACE";
    KeyCode[KeyCode["PAGE_UP"] = 33] = "PAGE_UP";
    KeyCode[KeyCode["PAGE_DOWN"] = 34] = "PAGE_DOWN";
    KeyCode[KeyCode["END"] = 35] = "END";
    KeyCode[KeyCode["HOME"] = 36] = "HOME";
    KeyCode[KeyCode["LEFT"] = 37] = "LEFT";
    KeyCode[KeyCode["UP"] = 38] = "UP";
    KeyCode[KeyCode["RIGHT"] = 39] = "RIGHT";
    KeyCode[KeyCode["DOWN"] = 40] = "DOWN";
    KeyCode[KeyCode["TAB"] = 9] = "TAB";
    KeyCode[KeyCode["LESS"] = 188] = "LESS";
    KeyCode[KeyCode["GREATER"] = 190] = "GREATER";
    KeyCode[KeyCode["DASH"] = 189] = "DASH";
    KeyCode[KeyCode["ZERO"] = 48] = "ZERO";
    KeyCode[KeyCode["ONE"] = 49] = "ONE";
    KeyCode[KeyCode["TWO"] = 50] = "TWO";
    KeyCode[KeyCode["THREE"] = 51] = "THREE";
    KeyCode[KeyCode["FOUR"] = 52] = "FOUR";
    KeyCode[KeyCode["FIVE"] = 53] = "FIVE";
    KeyCode[KeyCode["SIX"] = 54] = "SIX";
    KeyCode[KeyCode["SEVEN"] = 55] = "SEVEN";
    KeyCode[KeyCode["EIGHT"] = 56] = "EIGHT";
    KeyCode[KeyCode["NINE"] = 57] = "NINE";
    KeyCode[KeyCode["A"] = 65] = "A";
    KeyCode[KeyCode["B"] = 66] = "B";
    KeyCode[KeyCode["C"] = 67] = "C";
    KeyCode[KeyCode["D"] = 68] = "D";
    KeyCode[KeyCode["E"] = 69] = "E";
    KeyCode[KeyCode["F"] = 70] = "F";
    KeyCode[KeyCode["G"] = 71] = "G";
    KeyCode[KeyCode["H"] = 72] = "H";
    KeyCode[KeyCode["I"] = 73] = "I";
    KeyCode[KeyCode["J"] = 74] = "J";
    KeyCode[KeyCode["K"] = 75] = "K";
    KeyCode[KeyCode["L"] = 76] = "L";
    KeyCode[KeyCode["M"] = 77] = "M";
    KeyCode[KeyCode["N"] = 78] = "N";
    KeyCode[KeyCode["O"] = 79] = "O";
    KeyCode[KeyCode["P"] = 80] = "P";
    KeyCode[KeyCode["Q"] = 81] = "Q";
    KeyCode[KeyCode["R"] = 82] = "R";
    KeyCode[KeyCode["S"] = 83] = "S";
    KeyCode[KeyCode["T"] = 84] = "T";
    KeyCode[KeyCode["U"] = 85] = "U";
    KeyCode[KeyCode["V"] = 86] = "V";
    KeyCode[KeyCode["W"] = 87] = "W";
    KeyCode[KeyCode["X"] = 88] = "X";
    KeyCode[KeyCode["Y"] = 89] = "Y";
    KeyCode[KeyCode["Z"] = 90] = "Z";
})(KeyCode = exports.KeyCode || (exports.KeyCode = {}));
exports.Move = new Map([
    [13, 'ENTER'],
    [27, 'ESC'],
    [32, 'SPACE'],
    [33, 'PAGE_UP'],
    [34, 'PAGE_DOWN'],
    [35, 'END'],
    [36, 'HOME'],
    [37, 'LEFT'],
    [38, 'UP'],
    [39, 'RIGHT'],
    [40, 'DOWN'],
    [9, 'TAB'],
    [188, 'LESS'],
    [190, 'GREATER'],
    [189, 'DASH'],
    [48, 'ZERO'],
    [49, 'ONE'],
    [50, 'TWO'],
    [51, 'THREE'],
    [52, 'FOUR'],
    [53, 'FIVE'],
    [54, 'SIX'],
    [55, 'SEVEN'],
    [56, 'EIGHT'],
    [57, 'NINE'],
    [65, 'A'],
    [66, 'B'],
    [67, 'C'],
    [68, 'D'],
    [69, 'E'],
    [70, 'F'],
    [71, 'G'],
    [72, 'H'],
    [73, 'I'],
    [74, 'J'],
    [75, 'K'],
    [76, 'L'],
    [77, 'M'],
    [78, 'N'],
    [79, 'O'],
    [80, 'P'],
    [81, 'Q'],
    [82, 'R'],
    [83, 'S'],
    [84, 'T'],
    [85, 'U'],
    [86, 'V'],
    [87, 'W'],
    [88, 'X'],
    [89, 'Y'],
    [90, 'Z']
]);
var EventType;
(function (EventType) {
    EventType["CLICK"] = "click";
    EventType["DBLCLICK"] = "dblclick";
    EventType["MOUSEDOWN"] = "mousedown";
    EventType["MOUSEUP"] = "mouseup";
    EventType["MOUSEOVER"] = "mouseover";
    EventType["MOUSEOUT"] = "mouseout";
    EventType["MOUSEMOVE"] = "mousemove";
    EventType["SELECTSTART"] = "selectstart";
    EventType["KEYPRESS"] = "keypress";
    EventType["KEYDOWN"] = "keydown";
    EventType["KEYUP"] = "keyup";
    EventType["TOUCHSTART"] = "touchstart";
    EventType["TOUCHMOVE"] = "touchmove";
    EventType["TOUCHEND"] = "touchend";
    EventType["TOUCHCANCEL"] = "touchcancel";
})(EventType = exports.EventType || (exports.EventType = {}));
class Event {
    constructor(src, type, callback) {
        this.src = src;
        this.type = type;
        this.callback = callback;
    }
    add() {
        this.src.addEventListener(this.type, this.callback);
    }
    remove() {
        this.src.removeEventListener(this.type, this.callback);
    }
}
exports.Event = Event;
