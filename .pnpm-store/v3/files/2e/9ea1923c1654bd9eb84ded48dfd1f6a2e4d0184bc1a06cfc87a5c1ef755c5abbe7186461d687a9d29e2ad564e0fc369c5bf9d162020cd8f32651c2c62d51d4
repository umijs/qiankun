"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssistiveMmlHandler = exports.AssistiveMmlMathDocumentMixin = exports.AssistiveMmlMathItemMixin = exports.LimitedMmlVisitor = void 0;
var MathItem_js_1 = require("../core/MathItem.js");
var SerializedMmlVisitor_js_1 = require("../core/MmlTree/SerializedMmlVisitor.js");
var Options_js_1 = require("../util/Options.js");
var LimitedMmlVisitor = (function (_super) {
    __extends(LimitedMmlVisitor, _super);
    function LimitedMmlVisitor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LimitedMmlVisitor.prototype.getAttributes = function (node) {
        return _super.prototype.getAttributes.call(this, node).replace(/ ?id=".*?"/, '');
    };
    return LimitedMmlVisitor;
}(SerializedMmlVisitor_js_1.SerializedMmlVisitor));
exports.LimitedMmlVisitor = LimitedMmlVisitor;
(0, MathItem_js_1.newState)('ASSISTIVEMML', 153);
function AssistiveMmlMathItemMixin(BaseMathItem) {
    return (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.assistiveMml = function (document, force) {
            if (force === void 0) { force = false; }
            if (this.state() >= MathItem_js_1.STATE.ASSISTIVEMML)
                return;
            if (!this.isEscaped && (document.options.enableAssistiveMml || force)) {
                var adaptor = document.adaptor;
                var mml = document.toMML(this.root).replace(/\n */g, '').replace(/<!--.*?-->/g, '');
                var mmlNodes = adaptor.firstChild(adaptor.body(adaptor.parse(mml, 'text/html')));
                var node = adaptor.node('mjx-assistive-mml', {
                    unselectable: 'on', display: (this.display ? 'block' : 'inline')
                }, [mmlNodes]);
                adaptor.setAttribute(adaptor.firstChild(this.typesetRoot), 'aria-hidden', 'true');
                adaptor.setStyle(this.typesetRoot, 'position', 'relative');
                adaptor.append(this.typesetRoot, node);
            }
            this.state(MathItem_js_1.STATE.ASSISTIVEMML);
        };
        return class_1;
    }(BaseMathItem));
}
exports.AssistiveMmlMathItemMixin = AssistiveMmlMathItemMixin;
function AssistiveMmlMathDocumentMixin(BaseDocument) {
    var _a;
    return _a = (function (_super) {
            __extends(BaseClass, _super);
            function BaseClass() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var _this = _super.apply(this, __spreadArray([], __read(args), false)) || this;
                var CLASS = _this.constructor;
                var ProcessBits = CLASS.ProcessBits;
                if (!ProcessBits.has('assistive-mml')) {
                    ProcessBits.allocate('assistive-mml');
                }
                _this.visitor = new LimitedMmlVisitor(_this.mmlFactory);
                _this.options.MathItem =
                    AssistiveMmlMathItemMixin(_this.options.MathItem);
                if ('addStyles' in _this) {
                    _this.addStyles(CLASS.assistiveStyles);
                }
                return _this;
            }
            BaseClass.prototype.toMML = function (node) {
                return this.visitor.visitTree(node);
            };
            BaseClass.prototype.assistiveMml = function () {
                var e_1, _a;
                if (!this.processed.isSet('assistive-mml')) {
                    try {
                        for (var _b = __values(this.math), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var math = _c.value;
                            math.assistiveMml(this);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    this.processed.set('assistive-mml');
                }
                return this;
            };
            BaseClass.prototype.state = function (state, restore) {
                if (restore === void 0) { restore = false; }
                _super.prototype.state.call(this, state, restore);
                if (state < MathItem_js_1.STATE.ASSISTIVEMML) {
                    this.processed.clear('assistive-mml');
                }
                return this;
            };
            return BaseClass;
        }(BaseDocument)),
        _a.OPTIONS = __assign(__assign({}, BaseDocument.OPTIONS), { enableAssistiveMml: true, renderActions: (0, Options_js_1.expandable)(__assign(__assign({}, BaseDocument.OPTIONS.renderActions), { assistiveMml: [MathItem_js_1.STATE.ASSISTIVEMML] })) }),
        _a.assistiveStyles = {
            'mjx-assistive-mml': {
                position: 'absolute !important',
                top: '0px', left: '0px',
                clip: 'rect(1px, 1px, 1px, 1px)',
                padding: '1px 0px 0px 0px !important',
                border: '0px !important',
                display: 'block !important',
                width: 'auto !important',
                overflow: 'hidden !important',
                '-webkit-touch-callout': 'none',
                '-webkit-user-select': 'none',
                '-khtml-user-select': 'none',
                '-moz-user-select': 'none',
                '-ms-user-select': 'none',
                'user-select': 'none'
            },
            'mjx-assistive-mml[display="block"]': {
                width: '100% !important'
            }
        },
        _a;
}
exports.AssistiveMmlMathDocumentMixin = AssistiveMmlMathDocumentMixin;
function AssistiveMmlHandler(handler) {
    handler.documentClass =
        AssistiveMmlMathDocumentMixin(handler.documentClass);
    return handler;
}
exports.AssistiveMmlHandler = AssistiveMmlHandler;
//# sourceMappingURL=assistive-mml.js.map