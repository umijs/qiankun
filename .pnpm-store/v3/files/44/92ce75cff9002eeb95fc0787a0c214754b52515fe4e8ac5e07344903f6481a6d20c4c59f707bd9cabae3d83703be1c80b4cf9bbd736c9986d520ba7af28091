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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquationItem = exports.EqnArrayItem = exports.ArrayItem = exports.DotsItem = exports.NonscriptItem = exports.NotItem = exports.FnItem = exports.MmlItem = exports.CellItem = exports.PositionItem = exports.StyleItem = exports.EndItem = exports.BeginItem = exports.RightItem = exports.Middle = exports.LeftItem = exports.OverItem = exports.SubsupItem = exports.PrimeItem = exports.CloseItem = exports.OpenItem = exports.StopItem = exports.StartItem = void 0;
var MapHandler_js_1 = require("../MapHandler.js");
var Entities_js_1 = require("../../../util/Entities.js");
var MmlNode_js_1 = require("../../../core/MmlTree/MmlNode.js");
var TexError_js_1 = __importDefault(require("../TexError.js"));
var ParseUtil_js_1 = __importDefault(require("../ParseUtil.js"));
var NodeUtil_js_1 = __importDefault(require("../NodeUtil.js"));
var StackItem_js_1 = require("../StackItem.js");
var StartItem = (function (_super) {
    __extends(StartItem, _super);
    function StartItem(factory, global) {
        var _this = _super.call(this, factory) || this;
        _this.global = global;
        return _this;
    }
    Object.defineProperty(StartItem.prototype, "kind", {
        get: function () {
            return 'start';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StartItem.prototype, "isOpen", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    StartItem.prototype.checkItem = function (item) {
        if (item.isKind('stop')) {
            var node = this.toMml();
            if (!this.global.isInner) {
                node = this.factory.configuration.tags.finalize(node, this.env);
            }
            return [[this.factory.create('mml', node)], true];
        }
        return _super.prototype.checkItem.call(this, item);
    };
    return StartItem;
}(StackItem_js_1.BaseItem));
exports.StartItem = StartItem;
var StopItem = (function (_super) {
    __extends(StopItem, _super);
    function StopItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(StopItem.prototype, "kind", {
        get: function () {
            return 'stop';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StopItem.prototype, "isClose", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    return StopItem;
}(StackItem_js_1.BaseItem));
exports.StopItem = StopItem;
var OpenItem = (function (_super) {
    __extends(OpenItem, _super);
    function OpenItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(OpenItem.prototype, "kind", {
        get: function () {
            return 'open';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OpenItem.prototype, "isOpen", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    OpenItem.prototype.checkItem = function (item) {
        if (item.isKind('close')) {
            var mml = this.toMml();
            var node = this.create('node', 'TeXAtom', [mml]);
            return [[this.factory.create('mml', node)], true];
        }
        return _super.prototype.checkItem.call(this, item);
    };
    OpenItem.errors = Object.assign(Object.create(StackItem_js_1.BaseItem.errors), {
        'stop': ['ExtraOpenMissingClose',
            'Extra open brace or missing close brace']
    });
    return OpenItem;
}(StackItem_js_1.BaseItem));
exports.OpenItem = OpenItem;
var CloseItem = (function (_super) {
    __extends(CloseItem, _super);
    function CloseItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(CloseItem.prototype, "kind", {
        get: function () {
            return 'close';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CloseItem.prototype, "isClose", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    return CloseItem;
}(StackItem_js_1.BaseItem));
exports.CloseItem = CloseItem;
var PrimeItem = (function (_super) {
    __extends(PrimeItem, _super);
    function PrimeItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(PrimeItem.prototype, "kind", {
        get: function () {
            return 'prime';
        },
        enumerable: false,
        configurable: true
    });
    PrimeItem.prototype.checkItem = function (item) {
        var _a = __read(this.Peek(2), 2), top0 = _a[0], top1 = _a[1];
        if (!NodeUtil_js_1.default.isType(top0, 'msubsup') || NodeUtil_js_1.default.isType(top0, 'msup')) {
            var node = this.create('node', 'msup', [top0, top1]);
            return [[node, item], true];
        }
        NodeUtil_js_1.default.setChild(top0, top0.sup, top1);
        return [[top0, item], true];
    };
    return PrimeItem;
}(StackItem_js_1.BaseItem));
exports.PrimeItem = PrimeItem;
var SubsupItem = (function (_super) {
    __extends(SubsupItem, _super);
    function SubsupItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(SubsupItem.prototype, "kind", {
        get: function () {
            return 'subsup';
        },
        enumerable: false,
        configurable: true
    });
    SubsupItem.prototype.checkItem = function (item) {
        if (item.isKind('open') || item.isKind('left')) {
            return StackItem_js_1.BaseItem.success;
        }
        var top = this.First;
        var position = this.getProperty('position');
        if (item.isKind('mml')) {
            if (this.getProperty('primes')) {
                if (position !== 2) {
                    NodeUtil_js_1.default.setChild(top, 2, this.getProperty('primes'));
                }
                else {
                    NodeUtil_js_1.default.setProperty(this.getProperty('primes'), 'variantForm', true);
                    var node = this.create('node', 'mrow', [this.getProperty('primes'), item.First]);
                    item.First = node;
                }
            }
            NodeUtil_js_1.default.setChild(top, position, item.First);
            if (this.getProperty('movesupsub') != null) {
                NodeUtil_js_1.default.setProperty(top, 'movesupsub', this.getProperty('movesupsub'));
            }
            var result = this.factory.create('mml', top);
            return [[result], true];
        }
        if (_super.prototype.checkItem.call(this, item)[1]) {
            var error = this.getErrors(['', 'sub', 'sup'][position]);
            throw new (TexError_js_1.default.bind.apply(TexError_js_1.default, __spreadArray([void 0, error[0], error[1]], __read(error.splice(2)), false)))();
        }
        return null;
    };
    SubsupItem.errors = Object.assign(Object.create(StackItem_js_1.BaseItem.errors), {
        'stop': ['MissingScript',
            'Missing superscript or subscript argument'],
        'sup': ['MissingOpenForSup',
            'Missing open brace for superscript'],
        'sub': ['MissingOpenForSub',
            'Missing open brace for subscript']
    });
    return SubsupItem;
}(StackItem_js_1.BaseItem));
exports.SubsupItem = SubsupItem;
var OverItem = (function (_super) {
    __extends(OverItem, _super);
    function OverItem(factory) {
        var _this = _super.call(this, factory) || this;
        _this.setProperty('name', '\\over');
        return _this;
    }
    Object.defineProperty(OverItem.prototype, "kind", {
        get: function () {
            return 'over';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OverItem.prototype, "isClose", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    OverItem.prototype.checkItem = function (item) {
        if (item.isKind('over')) {
            throw new TexError_js_1.default('AmbiguousUseOf', 'Ambiguous use of %1', item.getName());
        }
        if (item.isClose) {
            var mml = this.create('node', 'mfrac', [this.getProperty('num'), this.toMml(false)]);
            if (this.getProperty('thickness') != null) {
                NodeUtil_js_1.default.setAttribute(mml, 'linethickness', this.getProperty('thickness'));
            }
            if (this.getProperty('open') || this.getProperty('close')) {
                NodeUtil_js_1.default.setProperty(mml, 'withDelims', true);
                mml = ParseUtil_js_1.default.fixedFence(this.factory.configuration, this.getProperty('open'), mml, this.getProperty('close'));
            }
            return [[this.factory.create('mml', mml), item], true];
        }
        return _super.prototype.checkItem.call(this, item);
    };
    OverItem.prototype.toString = function () {
        return 'over[' + this.getProperty('num') +
            ' / ' + this.nodes.join('; ') + ']';
    };
    return OverItem;
}(StackItem_js_1.BaseItem));
exports.OverItem = OverItem;
var LeftItem = (function (_super) {
    __extends(LeftItem, _super);
    function LeftItem(factory, delim) {
        var _this = _super.call(this, factory) || this;
        _this.setProperty('delim', delim);
        return _this;
    }
    Object.defineProperty(LeftItem.prototype, "kind", {
        get: function () {
            return 'left';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LeftItem.prototype, "isOpen", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    LeftItem.prototype.checkItem = function (item) {
        if (item.isKind('right')) {
            return [[this.factory.create('mml', ParseUtil_js_1.default.fenced(this.factory.configuration, this.getProperty('delim'), this.toMml(), item.getProperty('delim'), '', item.getProperty('color')))], true];
        }
        if (item.isKind('middle')) {
            var def = { stretchy: true };
            if (item.getProperty('color')) {
                def.mathcolor = item.getProperty('color');
            }
            this.Push(this.create('node', 'TeXAtom', [], { texClass: MmlNode_js_1.TEXCLASS.CLOSE }), this.create('token', 'mo', def, item.getProperty('delim')), this.create('node', 'TeXAtom', [], { texClass: MmlNode_js_1.TEXCLASS.OPEN }));
            this.env = {};
            return [[this], true];
        }
        return _super.prototype.checkItem.call(this, item);
    };
    LeftItem.errors = Object.assign(Object.create(StackItem_js_1.BaseItem.errors), {
        'stop': ['ExtraLeftMissingRight',
            'Extra \\left or missing \\right']
    });
    return LeftItem;
}(StackItem_js_1.BaseItem));
exports.LeftItem = LeftItem;
var Middle = (function (_super) {
    __extends(Middle, _super);
    function Middle(factory, delim, color) {
        var _this = _super.call(this, factory) || this;
        _this.setProperty('delim', delim);
        color && _this.setProperty('color', color);
        return _this;
    }
    Object.defineProperty(Middle.prototype, "kind", {
        get: function () {
            return 'middle';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Middle.prototype, "isClose", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    return Middle;
}(StackItem_js_1.BaseItem));
exports.Middle = Middle;
var RightItem = (function (_super) {
    __extends(RightItem, _super);
    function RightItem(factory, delim, color) {
        var _this = _super.call(this, factory) || this;
        _this.setProperty('delim', delim);
        color && _this.setProperty('color', color);
        return _this;
    }
    Object.defineProperty(RightItem.prototype, "kind", {
        get: function () {
            return 'right';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RightItem.prototype, "isClose", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    return RightItem;
}(StackItem_js_1.BaseItem));
exports.RightItem = RightItem;
var BeginItem = (function (_super) {
    __extends(BeginItem, _super);
    function BeginItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(BeginItem.prototype, "kind", {
        get: function () {
            return 'begin';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BeginItem.prototype, "isOpen", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    BeginItem.prototype.checkItem = function (item) {
        if (item.isKind('end')) {
            if (item.getName() !== this.getName()) {
                throw new TexError_js_1.default('EnvBadEnd', '\\begin{%1} ended with \\end{%2}', this.getName(), item.getName());
            }
            if (!this.getProperty('end')) {
                return [[this.factory.create('mml', this.toMml())], true];
            }
            return StackItem_js_1.BaseItem.fail;
        }
        if (item.isKind('stop')) {
            throw new TexError_js_1.default('EnvMissingEnd', 'Missing \\end{%1}', this.getName());
        }
        return _super.prototype.checkItem.call(this, item);
    };
    return BeginItem;
}(StackItem_js_1.BaseItem));
exports.BeginItem = BeginItem;
var EndItem = (function (_super) {
    __extends(EndItem, _super);
    function EndItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(EndItem.prototype, "kind", {
        get: function () {
            return 'end';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EndItem.prototype, "isClose", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    return EndItem;
}(StackItem_js_1.BaseItem));
exports.EndItem = EndItem;
var StyleItem = (function (_super) {
    __extends(StyleItem, _super);
    function StyleItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(StyleItem.prototype, "kind", {
        get: function () {
            return 'style';
        },
        enumerable: false,
        configurable: true
    });
    StyleItem.prototype.checkItem = function (item) {
        if (!item.isClose) {
            return _super.prototype.checkItem.call(this, item);
        }
        var mml = this.create('node', 'mstyle', this.nodes, this.getProperty('styles'));
        return [[this.factory.create('mml', mml), item], true];
    };
    return StyleItem;
}(StackItem_js_1.BaseItem));
exports.StyleItem = StyleItem;
var PositionItem = (function (_super) {
    __extends(PositionItem, _super);
    function PositionItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(PositionItem.prototype, "kind", {
        get: function () {
            return 'position';
        },
        enumerable: false,
        configurable: true
    });
    PositionItem.prototype.checkItem = function (item) {
        if (item.isClose) {
            throw new TexError_js_1.default('MissingBoxFor', 'Missing box for %1', this.getName());
        }
        if (item.isFinal) {
            var mml = item.toMml();
            switch (this.getProperty('move')) {
                case 'vertical':
                    mml = this.create('node', 'mpadded', [mml], { height: this.getProperty('dh'),
                        depth: this.getProperty('dd'),
                        voffset: this.getProperty('dh') });
                    return [[this.factory.create('mml', mml)], true];
                case 'horizontal':
                    return [[this.factory.create('mml', this.getProperty('left')), item,
                            this.factory.create('mml', this.getProperty('right'))], true];
            }
        }
        return _super.prototype.checkItem.call(this, item);
    };
    return PositionItem;
}(StackItem_js_1.BaseItem));
exports.PositionItem = PositionItem;
var CellItem = (function (_super) {
    __extends(CellItem, _super);
    function CellItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(CellItem.prototype, "kind", {
        get: function () {
            return 'cell';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CellItem.prototype, "isClose", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    return CellItem;
}(StackItem_js_1.BaseItem));
exports.CellItem = CellItem;
var MmlItem = (function (_super) {
    __extends(MmlItem, _super);
    function MmlItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(MmlItem.prototype, "isFinal", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MmlItem.prototype, "kind", {
        get: function () {
            return 'mml';
        },
        enumerable: false,
        configurable: true
    });
    return MmlItem;
}(StackItem_js_1.BaseItem));
exports.MmlItem = MmlItem;
var FnItem = (function (_super) {
    __extends(FnItem, _super);
    function FnItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(FnItem.prototype, "kind", {
        get: function () {
            return 'fn';
        },
        enumerable: false,
        configurable: true
    });
    FnItem.prototype.checkItem = function (item) {
        var top = this.First;
        if (top) {
            if (item.isOpen) {
                return StackItem_js_1.BaseItem.success;
            }
            if (!item.isKind('fn')) {
                var mml = item.First;
                if (!item.isKind('mml') || !mml) {
                    return [[top, item], true];
                }
                if ((NodeUtil_js_1.default.isType(mml, 'mstyle') && mml.childNodes.length &&
                    NodeUtil_js_1.default.isType(mml.childNodes[0].childNodes[0], 'mspace')) ||
                    NodeUtil_js_1.default.isType(mml, 'mspace')) {
                    return [[top, item], true];
                }
                if (NodeUtil_js_1.default.isEmbellished(mml)) {
                    mml = NodeUtil_js_1.default.getCoreMO(mml);
                }
                var form = NodeUtil_js_1.default.getForm(mml);
                if (form != null && [0, 0, 1, 1, 0, 1, 1, 0, 0, 0][form[2]]) {
                    return [[top, item], true];
                }
            }
            var node = this.create('token', 'mo', { texClass: MmlNode_js_1.TEXCLASS.NONE }, Entities_js_1.entities.ApplyFunction);
            return [[top, node, item], true];
        }
        return _super.prototype.checkItem.apply(this, arguments);
    };
    return FnItem;
}(StackItem_js_1.BaseItem));
exports.FnItem = FnItem;
var NotItem = (function (_super) {
    __extends(NotItem, _super);
    function NotItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.remap = MapHandler_js_1.MapHandler.getMap('not_remap');
        return _this;
    }
    Object.defineProperty(NotItem.prototype, "kind", {
        get: function () {
            return 'not';
        },
        enumerable: false,
        configurable: true
    });
    NotItem.prototype.checkItem = function (item) {
        var mml;
        var c;
        var textNode;
        if (item.isKind('open') || item.isKind('left')) {
            return StackItem_js_1.BaseItem.success;
        }
        if (item.isKind('mml') &&
            (NodeUtil_js_1.default.isType(item.First, 'mo') || NodeUtil_js_1.default.isType(item.First, 'mi') ||
                NodeUtil_js_1.default.isType(item.First, 'mtext'))) {
            mml = item.First;
            c = NodeUtil_js_1.default.getText(mml);
            if (c.length === 1 && !NodeUtil_js_1.default.getProperty(mml, 'movesupsub') &&
                NodeUtil_js_1.default.getChildren(mml).length === 1) {
                if (this.remap.contains(c)) {
                    textNode = this.create('text', this.remap.lookup(c).char);
                    NodeUtil_js_1.default.setChild(mml, 0, textNode);
                }
                else {
                    textNode = this.create('text', '\u0338');
                    NodeUtil_js_1.default.appendChildren(mml, [textNode]);
                }
                return [[item], true];
            }
        }
        textNode = this.create('text', '\u29F8');
        var mtextNode = this.create('node', 'mtext', [], {}, textNode);
        var paddedNode = this.create('node', 'mpadded', [mtextNode], { width: 0 });
        mml = this.create('node', 'TeXAtom', [paddedNode], { texClass: MmlNode_js_1.TEXCLASS.REL });
        return [[mml, item], true];
    };
    return NotItem;
}(StackItem_js_1.BaseItem));
exports.NotItem = NotItem;
var NonscriptItem = (function (_super) {
    __extends(NonscriptItem, _super);
    function NonscriptItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(NonscriptItem.prototype, "kind", {
        get: function () {
            return 'nonscript';
        },
        enumerable: false,
        configurable: true
    });
    NonscriptItem.prototype.checkItem = function (item) {
        if (item.isKind('mml') && item.Size() === 1) {
            var mml = item.First;
            if (mml.isKind('mstyle') && mml.notParent) {
                mml = NodeUtil_js_1.default.getChildren(NodeUtil_js_1.default.getChildren(mml)[0])[0];
            }
            if (mml.isKind('mspace')) {
                if (mml !== item.First) {
                    var mrow = this.create('node', 'mrow', [item.Pop()]);
                    item.Push(mrow);
                }
                this.factory.configuration.addNode('nonscript', item.First);
            }
        }
        return [[item], true];
    };
    return NonscriptItem;
}(StackItem_js_1.BaseItem));
exports.NonscriptItem = NonscriptItem;
var DotsItem = (function (_super) {
    __extends(DotsItem, _super);
    function DotsItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(DotsItem.prototype, "kind", {
        get: function () {
            return 'dots';
        },
        enumerable: false,
        configurable: true
    });
    DotsItem.prototype.checkItem = function (item) {
        if (item.isKind('open') || item.isKind('left')) {
            return StackItem_js_1.BaseItem.success;
        }
        var dots = this.getProperty('ldots');
        var top = item.First;
        if (item.isKind('mml') && NodeUtil_js_1.default.isEmbellished(top)) {
            var tclass = NodeUtil_js_1.default.getTexClass(NodeUtil_js_1.default.getCoreMO(top));
            if (tclass === MmlNode_js_1.TEXCLASS.BIN || tclass === MmlNode_js_1.TEXCLASS.REL) {
                dots = this.getProperty('cdots');
            }
        }
        return [[dots, item], true];
    };
    return DotsItem;
}(StackItem_js_1.BaseItem));
exports.DotsItem = DotsItem;
var ArrayItem = (function (_super) {
    __extends(ArrayItem, _super);
    function ArrayItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.table = [];
        _this.row = [];
        _this.frame = [];
        _this.hfill = [];
        _this.arraydef = {};
        _this.dashed = false;
        return _this;
    }
    Object.defineProperty(ArrayItem.prototype, "kind", {
        get: function () {
            return 'array';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ArrayItem.prototype, "isOpen", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ArrayItem.prototype, "copyEnv", {
        get: function () {
            return false;
        },
        enumerable: false,
        configurable: true
    });
    ArrayItem.prototype.checkItem = function (item) {
        if (item.isClose && !item.isKind('over')) {
            if (item.getProperty('isEntry')) {
                this.EndEntry();
                this.clearEnv();
                return StackItem_js_1.BaseItem.fail;
            }
            if (item.getProperty('isCR')) {
                this.EndEntry();
                this.EndRow();
                this.clearEnv();
                return StackItem_js_1.BaseItem.fail;
            }
            this.EndTable();
            this.clearEnv();
            var newItem = this.factory.create('mml', this.createMml());
            if (this.getProperty('requireClose')) {
                if (item.isKind('close')) {
                    return [[newItem], true];
                }
                throw new TexError_js_1.default('MissingCloseBrace', 'Missing close brace');
            }
            return [[newItem, item], true];
        }
        return _super.prototype.checkItem.call(this, item);
    };
    ArrayItem.prototype.createMml = function () {
        var scriptlevel = this.arraydef['scriptlevel'];
        delete this.arraydef['scriptlevel'];
        var mml = this.create('node', 'mtable', this.table, this.arraydef);
        if (scriptlevel) {
            mml.setProperty('scriptlevel', scriptlevel);
        }
        if (this.frame.length === 4) {
            NodeUtil_js_1.default.setAttribute(mml, 'frame', this.dashed ? 'dashed' : 'solid');
        }
        else if (this.frame.length) {
            if (this.arraydef['rowlines']) {
                this.arraydef['rowlines'] =
                    this.arraydef['rowlines'].replace(/none( none)+$/, 'none');
            }
            NodeUtil_js_1.default.setAttribute(mml, 'frame', '');
            mml = this.create('node', 'menclose', [mml], { notation: this.frame.join(' ') });
            if ((this.arraydef['columnlines'] || 'none') !== 'none' ||
                (this.arraydef['rowlines'] || 'none') !== 'none') {
                NodeUtil_js_1.default.setAttribute(mml, 'data-padding', 0);
            }
        }
        if (this.getProperty('open') || this.getProperty('close')) {
            mml = ParseUtil_js_1.default.fenced(this.factory.configuration, this.getProperty('open'), mml, this.getProperty('close'));
        }
        return mml;
    };
    ArrayItem.prototype.EndEntry = function () {
        var mtd = this.create('node', 'mtd', this.nodes);
        if (this.hfill.length) {
            if (this.hfill[0] === 0) {
                NodeUtil_js_1.default.setAttribute(mtd, 'columnalign', 'right');
            }
            if (this.hfill[this.hfill.length - 1] === this.Size()) {
                NodeUtil_js_1.default.setAttribute(mtd, 'columnalign', NodeUtil_js_1.default.getAttribute(mtd, 'columnalign') ? 'center' : 'left');
            }
        }
        this.row.push(mtd);
        this.Clear();
        this.hfill = [];
    };
    ArrayItem.prototype.EndRow = function () {
        var node;
        if (this.getProperty('isNumbered') && this.row.length === 3) {
            this.row.unshift(this.row.pop());
            node = this.create('node', 'mlabeledtr', this.row);
        }
        else {
            node = this.create('node', 'mtr', this.row);
        }
        this.table.push(node);
        this.row = [];
    };
    ArrayItem.prototype.EndTable = function () {
        if (this.Size() || this.row.length) {
            this.EndEntry();
            this.EndRow();
        }
        this.checkLines();
    };
    ArrayItem.prototype.checkLines = function () {
        if (this.arraydef['rowlines']) {
            var lines = this.arraydef['rowlines'].split(/ /);
            if (lines.length === this.table.length) {
                this.frame.push('bottom');
                lines.pop();
                this.arraydef['rowlines'] = lines.join(' ');
            }
            else if (lines.length < this.table.length - 1) {
                this.arraydef['rowlines'] += ' none';
            }
        }
        if (this.getProperty('rowspacing')) {
            var rows = this.arraydef['rowspacing'].split(/ /);
            while (rows.length < this.table.length) {
                rows.push(this.getProperty('rowspacing') + 'em');
            }
            this.arraydef['rowspacing'] = rows.join(' ');
        }
    };
    ArrayItem.prototype.addRowSpacing = function (spacing) {
        if (this.arraydef['rowspacing']) {
            var rows = this.arraydef['rowspacing'].split(/ /);
            if (!this.getProperty('rowspacing')) {
                var dimem = ParseUtil_js_1.default.dimen2em(rows[0]);
                this.setProperty('rowspacing', dimem);
            }
            var rowspacing = this.getProperty('rowspacing');
            while (rows.length < this.table.length) {
                rows.push(ParseUtil_js_1.default.Em(rowspacing));
            }
            rows[this.table.length - 1] = ParseUtil_js_1.default.Em(Math.max(0, rowspacing + ParseUtil_js_1.default.dimen2em(spacing)));
            this.arraydef['rowspacing'] = rows.join(' ');
        }
    };
    return ArrayItem;
}(StackItem_js_1.BaseItem));
exports.ArrayItem = ArrayItem;
var EqnArrayItem = (function (_super) {
    __extends(EqnArrayItem, _super);
    function EqnArrayItem(factory) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var _this = _super.call(this, factory) || this;
        _this.maxrow = 0;
        _this.factory.configuration.tags.start(args[0], args[2], args[1]);
        return _this;
    }
    Object.defineProperty(EqnArrayItem.prototype, "kind", {
        get: function () {
            return 'eqnarray';
        },
        enumerable: false,
        configurable: true
    });
    EqnArrayItem.prototype.EndEntry = function () {
        if (this.row.length) {
            ParseUtil_js_1.default.fixInitialMO(this.factory.configuration, this.nodes);
        }
        var node = this.create('node', 'mtd', this.nodes);
        this.row.push(node);
        this.Clear();
    };
    EqnArrayItem.prototype.EndRow = function () {
        if (this.row.length > this.maxrow) {
            this.maxrow = this.row.length;
        }
        var mtr = 'mtr';
        var tag = this.factory.configuration.tags.getTag();
        if (tag) {
            this.row = [tag].concat(this.row);
            mtr = 'mlabeledtr';
        }
        this.factory.configuration.tags.clearTag();
        var node = this.create('node', mtr, this.row);
        this.table.push(node);
        this.row = [];
    };
    EqnArrayItem.prototype.EndTable = function () {
        _super.prototype.EndTable.call(this);
        this.factory.configuration.tags.end();
        this.extendArray('columnalign', this.maxrow);
        this.extendArray('columnwidth', this.maxrow);
        this.extendArray('columnspacing', this.maxrow - 1);
    };
    EqnArrayItem.prototype.extendArray = function (name, max) {
        if (!this.arraydef[name])
            return;
        var repeat = this.arraydef[name].split(/ /);
        var columns = __spreadArray([], __read(repeat), false);
        if (columns.length > 1) {
            while (columns.length < max) {
                columns.push.apply(columns, __spreadArray([], __read(repeat), false));
            }
            this.arraydef[name] = columns.slice(0, max).join(' ');
        }
    };
    return EqnArrayItem;
}(ArrayItem));
exports.EqnArrayItem = EqnArrayItem;
var EquationItem = (function (_super) {
    __extends(EquationItem, _super);
    function EquationItem(factory) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var _this = _super.call(this, factory) || this;
        _this.factory.configuration.tags.start('equation', true, args[0]);
        return _this;
    }
    Object.defineProperty(EquationItem.prototype, "kind", {
        get: function () {
            return 'equation';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EquationItem.prototype, "isOpen", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    EquationItem.prototype.checkItem = function (item) {
        if (item.isKind('end')) {
            var mml = this.toMml();
            var tag = this.factory.configuration.tags.getTag();
            this.factory.configuration.tags.end();
            return [[tag ? this.factory.configuration.tags.enTag(mml, tag) : mml, item], true];
        }
        if (item.isKind('stop')) {
            throw new TexError_js_1.default('EnvMissingEnd', 'Missing \\end{%1}', this.getName());
        }
        return _super.prototype.checkItem.call(this, item);
    };
    return EquationItem;
}(StackItem_js_1.BaseItem));
exports.EquationItem = EquationItem;
//# sourceMappingURL=BaseItems.js.map