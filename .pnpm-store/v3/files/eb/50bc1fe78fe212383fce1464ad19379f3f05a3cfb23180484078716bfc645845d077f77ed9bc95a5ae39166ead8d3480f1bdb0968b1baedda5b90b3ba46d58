"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractNavigatable = void 0;
var key_navigatable_js_1 = require("./key_navigatable.js");
var mouse_navigatable_js_1 = require("./mouse_navigatable.js");
var AbstractNavigatable = (function () {
    function AbstractNavigatable() {
        this.bubble = false;
    }
    AbstractNavigatable.prototype.bubbleKey = function () {
        this.bubble = true;
    };
    AbstractNavigatable.prototype.keydown = function (event) {
        switch (event.keyCode) {
            case key_navigatable_js_1.KEY.ESCAPE:
                this.escape(event);
                break;
            case key_navigatable_js_1.KEY.RIGHT:
                this.right(event);
                break;
            case key_navigatable_js_1.KEY.LEFT:
                this.left(event);
                break;
            case key_navigatable_js_1.KEY.UP:
                this.up(event);
                break;
            case key_navigatable_js_1.KEY.DOWN:
                this.down(event);
                break;
            case key_navigatable_js_1.KEY.RETURN:
            case key_navigatable_js_1.KEY.SPACE:
                this.space(event);
                break;
            default:
                return;
        }
        this.bubble ? this.bubble = false : this.stop(event);
    };
    AbstractNavigatable.prototype.escape = function (_event) { };
    AbstractNavigatable.prototype.space = function (_event) { };
    AbstractNavigatable.prototype.left = function (_event) { };
    AbstractNavigatable.prototype.right = function (_event) { };
    AbstractNavigatable.prototype.up = function (_event) { };
    AbstractNavigatable.prototype.down = function (_event) { };
    AbstractNavigatable.prototype.stop = function (event) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
            event.cancelBubble = true;
        }
    };
    AbstractNavigatable.prototype.mousedown = function (event) {
        return this.stop(event);
    };
    AbstractNavigatable.prototype.mouseup = function (event) {
        return this.stop(event);
    };
    AbstractNavigatable.prototype.mouseover = function (event) {
        return this.stop(event);
    };
    AbstractNavigatable.prototype.mouseout = function (event) {
        return this.stop(event);
    };
    AbstractNavigatable.prototype.click = function (event) {
        return this.stop(event);
    };
    AbstractNavigatable.prototype.addEvents = function (element) {
        element.addEventListener(mouse_navigatable_js_1.MOUSE.DOWN, this.mousedown.bind(this));
        element.addEventListener(mouse_navigatable_js_1.MOUSE.UP, this.mouseup.bind(this));
        element.addEventListener(mouse_navigatable_js_1.MOUSE.OVER, this.mouseover.bind(this));
        element.addEventListener(mouse_navigatable_js_1.MOUSE.OUT, this.mouseout.bind(this));
        element.addEventListener(mouse_navigatable_js_1.MOUSE.CLICK, this.click.bind(this));
        element.addEventListener('keydown', this.keydown.bind(this));
        element.addEventListener('dragstart', this.stop.bind(this));
        element.addEventListener(mouse_navigatable_js_1.MOUSE.SELECTSTART, this.stop.bind(this));
        element.addEventListener('contextmenu', this.stop.bind(this));
        element.addEventListener(mouse_navigatable_js_1.MOUSE.DBLCLICK, this.stop.bind(this));
    };
    return AbstractNavigatable;
}());
exports.AbstractNavigatable = AbstractNavigatable;
//# sourceMappingURL=abstract_navigatable.js.map