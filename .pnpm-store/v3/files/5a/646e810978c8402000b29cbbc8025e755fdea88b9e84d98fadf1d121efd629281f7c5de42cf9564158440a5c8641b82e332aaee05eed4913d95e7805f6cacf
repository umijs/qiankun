"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalkerState = exports.WalkerMoves = void 0;
var WalkerMoves;
(function (WalkerMoves) {
    WalkerMoves["UP"] = "up";
    WalkerMoves["DOWN"] = "down";
    WalkerMoves["LEFT"] = "left";
    WalkerMoves["RIGHT"] = "right";
    WalkerMoves["REPEAT"] = "repeat";
    WalkerMoves["DEPTH"] = "depth";
    WalkerMoves["ENTER"] = "enter";
    WalkerMoves["EXPAND"] = "expand";
    WalkerMoves["HOME"] = "home";
    WalkerMoves["SUMMARY"] = "summary";
    WalkerMoves["DETAIL"] = "detail";
    WalkerMoves["ROW"] = "row";
    WalkerMoves["CELL"] = "cell";
})(WalkerMoves = exports.WalkerMoves || (exports.WalkerMoves = {}));
class WalkerState {
    static resetState(id) {
        delete WalkerState.STATE[id];
    }
    static setState(id, value) {
        WalkerState.STATE[id] = value;
    }
    static getState(id) {
        return WalkerState.STATE[id];
    }
}
exports.WalkerState = WalkerState;
WalkerState.STATE = {};
