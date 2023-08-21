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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SVGmaction = void 0;
var Wrapper_js_1 = require("../Wrapper.js");
var maction_js_1 = require("../../common/Wrappers/maction.js");
var maction_js_2 = require("../../common/Wrappers/maction.js");
var maction_js_3 = require("../../../core/MmlTree/MmlNodes/maction.js");
var SVGmaction = (function (_super) {
    __extends(SVGmaction, _super);
    function SVGmaction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SVGmaction.prototype.toSVG = function (parent) {
        var svg = this.standardSVGnode(parent);
        var child = this.selected;
        var _a = child.getOuterBBox(), h = _a.h, d = _a.d, w = _a.w;
        this.adaptor.append(this.element, this.svg('rect', {
            width: this.fixed(w), height: this.fixed(h + d), y: this.fixed(-d),
            fill: 'none', 'pointer-events': 'all'
        }));
        child.toSVG(svg);
        var bbox = child.getOuterBBox();
        if (child.element) {
            child.place(bbox.L * bbox.rscale, 0);
        }
        this.action(this, this.data);
    };
    SVGmaction.prototype.setEventHandler = function (type, handler) {
        this.element.addEventListener(type, handler);
    };
    SVGmaction.kind = maction_js_3.MmlMaction.prototype.kind;
    SVGmaction.styles = {
        '[jax="SVG"] mjx-tool': {
            display: 'inline-block',
            position: 'relative',
            width: 0, height: 0
        },
        '[jax="SVG"] mjx-tool > mjx-tip': {
            position: 'absolute',
            top: 0, left: 0
        },
        'mjx-tool > mjx-tip': {
            display: 'inline-block',
            padding: '.2em',
            border: '1px solid #888',
            'font-size': '70%',
            'background-color': '#F8F8F8',
            color: 'black',
            'box-shadow': '2px 2px 5px #AAAAAA'
        },
        'g[data-mml-node="maction"][data-toggle]': {
            cursor: 'pointer'
        },
        'mjx-status': {
            display: 'block',
            position: 'fixed',
            left: '1em',
            bottom: '1em',
            'min-width': '25%',
            padding: '.2em .4em',
            border: '1px solid #888',
            'font-size': '90%',
            'background-color': '#F8F8F8',
            color: 'black'
        }
    };
    SVGmaction.actions = new Map([
        ['toggle', [function (node, _data) {
                    node.adaptor.setAttribute(node.element, 'data-toggle', node.node.attributes.get('selection'));
                    var math = node.factory.jax.math;
                    var document = node.factory.jax.document;
                    var mml = node.node;
                    node.setEventHandler('click', function (event) {
                        if (!math.end.node) {
                            math.start.node = math.end.node = math.typesetRoot;
                            math.start.n = math.end.n = 0;
                        }
                        mml.nextToggleSelection();
                        math.rerender(document);
                        event.stopPropagation();
                    });
                }, {}]],
        ['tooltip', [function (node, data) {
                    var tip = node.childNodes[1];
                    if (!tip)
                        return;
                    var rect = node.firstChild();
                    if (tip.node.isKind('mtext')) {
                        var text = tip.node.getText();
                        node.adaptor.insert(node.svg('title', {}, [node.text(text)]), rect);
                    }
                    else {
                        var adaptor_1 = node.adaptor;
                        var container_1 = node.jax.container;
                        var math = node.node.factory.create('math', {}, [node.childNodes[1].node]);
                        var tool_1 = node.html('mjx-tool', {}, [node.html('mjx-tip')]);
                        var hidden_1 = adaptor_1.append(rect, node.svg('foreignObject', { style: { display: 'none' } }, [tool_1]));
                        node.jax.processMath(math, adaptor_1.firstChild(tool_1));
                        node.childNodes[1].node.parent = node.node;
                        node.setEventHandler('mouseover', function (event) {
                            data.stopTimers(node, data);
                            data.hoverTimer.set(node, setTimeout(function () {
                                adaptor_1.setStyle(tool_1, 'left', '0');
                                adaptor_1.setStyle(tool_1, 'top', '0');
                                adaptor_1.append(container_1, tool_1);
                                var tbox = adaptor_1.nodeBBox(tool_1);
                                var nbox = adaptor_1.nodeBBox(node.element);
                                var dx = (nbox.right - tbox.left) / node.metrics.em + node.dx;
                                var dy = (nbox.bottom - tbox.bottom) / node.metrics.em + node.dy;
                                adaptor_1.setStyle(tool_1, 'left', node.px(dx));
                                adaptor_1.setStyle(tool_1, 'top', node.px(dy));
                            }, data.postDelay));
                            event.stopPropagation();
                        });
                        node.setEventHandler('mouseout', function (event) {
                            data.stopTimers(node, data);
                            var timer = setTimeout(function () { return adaptor_1.append(hidden_1, tool_1); }, data.clearDelay);
                            data.clearTimer.set(node, timer);
                            event.stopPropagation();
                        });
                    }
                }, maction_js_2.TooltipData]],
        ['statusline', [function (node, data) {
                    var tip = node.childNodes[1];
                    if (!tip)
                        return;
                    if (tip.node.isKind('mtext')) {
                        var adaptor_2 = node.adaptor;
                        var text_1 = tip.node.getText();
                        adaptor_2.setAttribute(node.element, 'data-statusline', text_1);
                        node.setEventHandler('mouseover', function (event) {
                            if (data.status === null) {
                                var body = adaptor_2.body(adaptor_2.document);
                                data.status = adaptor_2.append(body, node.html('mjx-status', {}, [node.text(text_1)]));
                            }
                            event.stopPropagation();
                        });
                        node.setEventHandler('mouseout', function (event) {
                            if (data.status) {
                                adaptor_2.remove(data.status);
                                data.status = null;
                            }
                            event.stopPropagation();
                        });
                    }
                }, {
                    status: null
                }]]
    ]);
    return SVGmaction;
}((0, maction_js_1.CommonMactionMixin)(Wrapper_js_1.SVGWrapper)));
exports.SVGmaction = SVGmaction;
//# sourceMappingURL=maction.js.map