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
exports.ComplexityVisitor = void 0;
var MmlVisitor_js_1 = require("../../core/MmlTree/MmlVisitor.js");
var collapse_js_1 = require("./collapse.js");
var Options_js_1 = require("../../util/Options.js");
var ComplexityVisitor = (function (_super) {
    __extends(ComplexityVisitor, _super);
    function ComplexityVisitor(factory, options) {
        var _this = _super.call(this, factory) || this;
        _this.complexity = {
            text: .5,
            token: .5,
            child: 1,
            script: .8,
            sqrt: 2,
            subsup: 2,
            underover: 2,
            fraction: 2,
            enclose: 2,
            action: 2,
            phantom: 0,
            xml: 2,
            glyph: 2
        };
        var CLASS = _this.constructor;
        _this.options = (0, Options_js_1.userOptions)((0, Options_js_1.defaultOptions)({}, CLASS.OPTIONS), options);
        _this.collapse = new _this.options.Collapse(_this);
        _this.factory = factory;
        return _this;
    }
    ComplexityVisitor.prototype.visitTree = function (node) {
        _super.prototype.visitTree.call(this, node, true);
        if (this.options.makeCollapsible) {
            this.collapse.makeCollapse(node);
        }
    };
    ComplexityVisitor.prototype.visitNode = function (node, save) {
        if (node.attributes.get('data-semantic-complexity'))
            return;
        return _super.prototype.visitNode.call(this, node, save);
    };
    ComplexityVisitor.prototype.visitDefault = function (node, save) {
        var complexity;
        if (node.isToken) {
            var text = node.getText();
            complexity = this.complexity.text * text.length + this.complexity.token;
        }
        else {
            complexity = this.childrenComplexity(node);
        }
        return this.setComplexity(node, complexity, save);
    };
    ComplexityVisitor.prototype.visitMfracNode = function (node, save) {
        var complexity = this.childrenComplexity(node) * this.complexity.script + this.complexity.fraction;
        return this.setComplexity(node, complexity, save);
    };
    ComplexityVisitor.prototype.visitMsqrtNode = function (node, save) {
        var complexity = this.childrenComplexity(node) + this.complexity.sqrt;
        return this.setComplexity(node, complexity, save);
    };
    ComplexityVisitor.prototype.visitMrootNode = function (node, save) {
        var complexity = this.childrenComplexity(node) + this.complexity.sqrt
            - (1 - this.complexity.script) * this.getComplexity(node.childNodes[1]);
        return this.setComplexity(node, complexity, save);
    };
    ComplexityVisitor.prototype.visitMphantomNode = function (node, save) {
        return this.setComplexity(node, this.complexity.phantom, save);
    };
    ComplexityVisitor.prototype.visitMsNode = function (node, save) {
        var text = node.attributes.get('lquote')
            + node.getText()
            + node.attributes.get('rquote');
        var complexity = text.length * this.complexity.text;
        return this.setComplexity(node, complexity, save);
    };
    ComplexityVisitor.prototype.visitMsubsupNode = function (node, save) {
        _super.prototype.visitDefault.call(this, node, true);
        var sub = node.childNodes[node.sub];
        var sup = node.childNodes[node.sup];
        var base = node.childNodes[node.base];
        var complexity = Math.max(sub ? this.getComplexity(sub) : 0, sup ? this.getComplexity(sup) : 0) * this.complexity.script;
        complexity += this.complexity.child * ((sub ? 1 : 0) + (sup ? 1 : 0));
        complexity += (base ? this.getComplexity(base) + this.complexity.child : 0);
        complexity += this.complexity.subsup;
        return this.setComplexity(node, complexity, save);
    };
    ComplexityVisitor.prototype.visitMsubNode = function (node, save) {
        return this.visitMsubsupNode(node, save);
    };
    ComplexityVisitor.prototype.visitMsupNode = function (node, save) {
        return this.visitMsubsupNode(node, save);
    };
    ComplexityVisitor.prototype.visitMunderoverNode = function (node, save) {
        _super.prototype.visitDefault.call(this, node, true);
        var under = node.childNodes[node.under];
        var over = node.childNodes[node.over];
        var base = node.childNodes[node.base];
        var complexity = Math.max(under ? this.getComplexity(under) : 0, over ? this.getComplexity(over) : 0) * this.complexity.script;
        if (base) {
            complexity = Math.max(this.getComplexity(base), complexity);
        }
        complexity += this.complexity.child * ((under ? 1 : 0) + (over ? 1 : 0) + (base ? 1 : 0));
        complexity += this.complexity.underover;
        return this.setComplexity(node, complexity, save);
    };
    ComplexityVisitor.prototype.visitMunderNode = function (node, save) {
        return this.visitMunderoverNode(node, save);
    };
    ComplexityVisitor.prototype.visitMoverNode = function (node, save) {
        return this.visitMunderoverNode(node, save);
    };
    ComplexityVisitor.prototype.visitMencloseNode = function (node, save) {
        var complexity = this.childrenComplexity(node) + this.complexity.enclose;
        return this.setComplexity(node, complexity, save);
    };
    ComplexityVisitor.prototype.visitMactionNode = function (node, save) {
        this.childrenComplexity(node);
        var complexity = this.getComplexity(node.selected);
        return this.setComplexity(node, complexity, save);
    };
    ComplexityVisitor.prototype.visitMsemanticsNode = function (node, save) {
        var child = node.childNodes[0];
        var complexity = 0;
        if (child) {
            this.visitNode(child, true);
            complexity = this.getComplexity(child);
        }
        return this.setComplexity(node, complexity, save);
    };
    ComplexityVisitor.prototype.visitAnnotationNode = function (node, save) {
        return this.setComplexity(node, this.complexity.xml, save);
    };
    ComplexityVisitor.prototype.visitAnnotation_xmlNode = function (node, save) {
        return this.setComplexity(node, this.complexity.xml, save);
    };
    ComplexityVisitor.prototype.visitMglyphNode = function (node, save) {
        return this.setComplexity(node, this.complexity.glyph, save);
    };
    ComplexityVisitor.prototype.getComplexity = function (node) {
        var collapsed = node.getProperty('collapsedComplexity');
        return (collapsed != null ? collapsed : node.attributes.get('data-semantic-complexity'));
    };
    ComplexityVisitor.prototype.setComplexity = function (node, complexity, save) {
        if (save) {
            if (this.options.identifyCollapsible) {
                complexity = this.collapse.check(node, complexity);
            }
            node.attributes.set('data-semantic-complexity', complexity);
        }
        return complexity;
    };
    ComplexityVisitor.prototype.childrenComplexity = function (node) {
        var e_1, _a;
        _super.prototype.visitDefault.call(this, node, true);
        var complexity = 0;
        try {
            for (var _b = __values(node.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                complexity += this.getComplexity(child);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (node.childNodes.length > 1) {
            complexity += node.childNodes.length * this.complexity.child;
        }
        return complexity;
    };
    ComplexityVisitor.OPTIONS = {
        identifyCollapsible: true,
        makeCollapsible: true,
        Collapse: collapse_js_1.Collapse
    };
    return ComplexityVisitor;
}(MmlVisitor_js_1.MmlVisitor));
exports.ComplexityVisitor = ComplexityVisitor;
//# sourceMappingURL=visitor.js.map