"use strict";
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
exports.Collapse = void 0;
var Collapse = (function () {
    function Collapse(visitor) {
        var _this = this;
        this.cutoff = {
            identifier: 3,
            number: 3,
            text: 10,
            infixop: 15,
            relseq: 15,
            multirel: 15,
            fenced: 18,
            bigop: 20,
            integral: 20,
            fraction: 12,
            sqrt: 9,
            root: 12,
            vector: 15,
            matrix: 15,
            cases: 15,
            superscript: 9,
            subscript: 9,
            subsup: 9,
            punctuated: {
                endpunct: Collapse.NOCOLLAPSE,
                startpunct: Collapse.NOCOLLAPSE,
                value: 12
            }
        };
        this.marker = {
            identifier: 'x',
            number: '#',
            text: '...',
            appl: {
                'limit function': 'lim',
                value: 'f()'
            },
            fraction: '/',
            sqrt: '\u221A',
            root: '\u221A',
            superscript: '\u25FD\u02D9',
            subscript: '\u25FD.',
            subsup: '\u25FD:',
            vector: {
                binomial: '(:)',
                determinant: '|:|',
                value: '\u27E8:\u27E9'
            },
            matrix: {
                squarematrix: '[::]',
                rowvector: '\u27E8\u22EF\u27E9',
                columnvector: '\u27E8\u22EE\u27E9',
                determinant: '|::|',
                value: '(::)'
            },
            cases: '{:',
            infixop: {
                addition: '+',
                subtraction: '\u2212',
                multiplication: '\u22C5',
                implicit: '\u22C5',
                value: '+'
            },
            punctuated: {
                text: '...',
                value: ','
            }
        };
        this.collapse = new Map([
            ['fenced', function (node, complexity) {
                    complexity = _this.uncollapseChild(complexity, node, 1);
                    if (complexity > _this.cutoff.fenced && node.attributes.get('data-semantic-role') === 'leftright') {
                        complexity = _this.recordCollapse(node, complexity, _this.getText(node.childNodes[0]) +
                            _this.getText(node.childNodes[node.childNodes.length - 1]));
                    }
                    return complexity;
                }],
            ['appl', function (node, complexity) {
                    if (_this.canUncollapse(node, 2, 2)) {
                        complexity = _this.complexity.visitNode(node, false);
                        var marker = _this.marker.appl;
                        var text = marker[node.attributes.get('data-semantic-role')] || marker.value;
                        complexity = _this.recordCollapse(node, complexity, text);
                    }
                    return complexity;
                }],
            ['sqrt', function (node, complexity) {
                    complexity = _this.uncollapseChild(complexity, node, 0);
                    if (complexity > _this.cutoff.sqrt) {
                        complexity = _this.recordCollapse(node, complexity, _this.marker.sqrt);
                    }
                    return complexity;
                }],
            ['root', function (node, complexity) {
                    complexity = _this.uncollapseChild(complexity, node, 0, 2);
                    if (complexity > _this.cutoff.sqrt) {
                        complexity = _this.recordCollapse(node, complexity, _this.marker.sqrt);
                    }
                    return complexity;
                }],
            ['enclose', function (node, complexity) {
                    if (_this.splitAttribute(node, 'children').length === 1) {
                        var child = _this.canUncollapse(node, 1);
                        if (child) {
                            var marker = child.getProperty('collapse-marker');
                            _this.unrecordCollapse(child);
                            complexity = _this.recordCollapse(node, _this.complexity.visitNode(node, false), marker);
                        }
                    }
                    return complexity;
                }],
            ['bigop', function (node, complexity) {
                    if (complexity > _this.cutoff.bigop || !node.isKind('mo')) {
                        var id = _this.splitAttribute(node, 'content').pop();
                        var op = _this.findChildText(node, id);
                        complexity = _this.recordCollapse(node, complexity, op);
                    }
                    return complexity;
                }],
            ['integral', function (node, complexity) {
                    if (complexity > _this.cutoff.integral || !node.isKind('mo')) {
                        var id = _this.splitAttribute(node, 'content').pop();
                        var op = _this.findChildText(node, id);
                        complexity = _this.recordCollapse(node, complexity, op);
                    }
                    return complexity;
                }],
            ['relseq', function (node, complexity) {
                    if (complexity > _this.cutoff.relseq) {
                        var id = _this.splitAttribute(node, 'content')[0];
                        var text = _this.findChildText(node, id);
                        complexity = _this.recordCollapse(node, complexity, text);
                    }
                    return complexity;
                }],
            ['multirel', function (node, complexity) {
                    if (complexity > _this.cutoff.relseq) {
                        var id = _this.splitAttribute(node, 'content')[0];
                        var text = _this.findChildText(node, id) + '\u22EF';
                        complexity = _this.recordCollapse(node, complexity, text);
                    }
                    return complexity;
                }],
            ['superscript', function (node, complexity) {
                    complexity = _this.uncollapseChild(complexity, node, 0, 2);
                    if (complexity > _this.cutoff.superscript) {
                        complexity = _this.recordCollapse(node, complexity, _this.marker.superscript);
                    }
                    return complexity;
                }],
            ['subscript', function (node, complexity) {
                    complexity = _this.uncollapseChild(complexity, node, 0, 2);
                    if (complexity > _this.cutoff.subscript) {
                        complexity = _this.recordCollapse(node, complexity, _this.marker.subscript);
                    }
                    return complexity;
                }],
            ['subsup', function (node, complexity) {
                    complexity = _this.uncollapseChild(complexity, node, 0, 3);
                    if (complexity > _this.cutoff.subsup) {
                        complexity = _this.recordCollapse(node, complexity, _this.marker.subsup);
                    }
                    return complexity;
                }]
        ]);
        this.idCount = 0;
        this.complexity = visitor;
    }
    Collapse.prototype.check = function (node, complexity) {
        var type = node.attributes.get('data-semantic-type');
        if (this.collapse.has(type)) {
            return this.collapse.get(type).call(this, node, complexity);
        }
        if (this.cutoff.hasOwnProperty(type)) {
            return this.defaultCheck(node, complexity, type);
        }
        return complexity;
    };
    Collapse.prototype.defaultCheck = function (node, complexity, type) {
        var role = node.attributes.get('data-semantic-role');
        var check = this.cutoff[type];
        var cutoff = (typeof check === 'number' ? check : check[role] || check.value);
        if (complexity > cutoff) {
            var marker = this.marker[type] || '??';
            var text = (typeof marker === 'string' ? marker : marker[role] || marker.value);
            complexity = this.recordCollapse(node, complexity, text);
        }
        return complexity;
    };
    Collapse.prototype.recordCollapse = function (node, complexity, text) {
        text = '\u25C2' + text + '\u25B8';
        node.setProperty('collapse-marker', text);
        node.setProperty('collapse-complexity', complexity);
        return text.length * this.complexity.complexity.text;
    };
    Collapse.prototype.unrecordCollapse = function (node) {
        var complexity = node.getProperty('collapse-complexity');
        if (complexity != null) {
            node.attributes.set('data-semantic-complexity', complexity);
            node.removeProperty('collapse-complexity');
            node.removeProperty('collapse-marker');
        }
    };
    Collapse.prototype.canUncollapse = function (node, n, m) {
        if (m === void 0) { m = 1; }
        if (this.splitAttribute(node, 'children').length === m) {
            var mml = (node.childNodes.length === 1 &&
                node.childNodes[0].isInferred ? node.childNodes[0] : node);
            if (mml && mml.childNodes[n]) {
                var child = mml.childNodes[n];
                if (child.getProperty('collapse-marker')) {
                    return child;
                }
            }
        }
        return null;
    };
    Collapse.prototype.uncollapseChild = function (complexity, node, n, m) {
        if (m === void 0) { m = 1; }
        var child = this.canUncollapse(node, n, m);
        if (child) {
            this.unrecordCollapse(child);
            if (child.parent !== node) {
                child.parent.attributes.set('data-semantic-complexity', undefined);
            }
            complexity = this.complexity.visitNode(node, false);
        }
        return complexity;
    };
    Collapse.prototype.splitAttribute = function (node, id) {
        return (node.attributes.get('data-semantic-' + id) || '').split(/,/);
    };
    Collapse.prototype.getText = function (node) {
        var _this = this;
        if (node.isToken)
            return node.getText();
        return node.childNodes.map(function (n) { return _this.getText(n); }).join('');
    };
    Collapse.prototype.findChildText = function (node, id) {
        var child = this.findChild(node, id);
        return this.getText(child.coreMO() || child);
    };
    Collapse.prototype.findChild = function (node, id) {
        var e_1, _a;
        if (!node || node.attributes.get('data-semantic-id') === id)
            return node;
        if (!node.isToken) {
            try {
                for (var _b = __values(node.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var mml = _c.value;
                    var child = this.findChild(mml, id);
                    if (child)
                        return child;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        return null;
    };
    Collapse.prototype.makeCollapse = function (node) {
        var nodes = [];
        node.walkTree(function (child) {
            if (child.getProperty('collapse-marker')) {
                nodes.push(child);
            }
        });
        this.makeActions(nodes);
    };
    Collapse.prototype.makeActions = function (nodes) {
        var e_2, _a;
        try {
            for (var nodes_1 = __values(nodes), nodes_1_1 = nodes_1.next(); !nodes_1_1.done; nodes_1_1 = nodes_1.next()) {
                var node = nodes_1_1.value;
                this.makeAction(node);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (nodes_1_1 && !nodes_1_1.done && (_a = nodes_1.return)) _a.call(nodes_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    Collapse.prototype.makeId = function () {
        return 'mjx-collapse-' + this.idCount++;
    };
    Collapse.prototype.makeAction = function (node) {
        if (node.isKind('math')) {
            node = this.addMrow(node);
        }
        var factory = this.complexity.factory;
        var marker = node.getProperty('collapse-marker');
        var parent = node.parent;
        var maction = factory.create('maction', {
            actiontype: 'toggle',
            selection: 2,
            'data-collapsible': true,
            id: this.makeId(),
            'data-semantic-complexity': node.attributes.get('data-semantic-complexity')
        }, [
            factory.create('mtext', { mathcolor: 'blue' }, [
                factory.create('text').setText(marker)
            ])
        ]);
        maction.inheritAttributesFrom(node);
        node.attributes.set('data-semantic-complexity', node.getProperty('collapse-complexity'));
        node.removeProperty('collapse-marker');
        node.removeProperty('collapse-complexity');
        parent.replaceChild(maction, node);
        maction.appendChild(node);
    };
    Collapse.prototype.addMrow = function (node) {
        var e_3, _a;
        var mrow = this.complexity.factory.create('mrow', null, node.childNodes[0].childNodes);
        node.childNodes[0].setChildren([mrow]);
        var attributes = node.attributes.getAllAttributes();
        try {
            for (var _b = __values(Object.keys(attributes)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var name_1 = _c.value;
                if (name_1.substr(0, 14) === 'data-semantic-') {
                    mrow.attributes.set(name_1, attributes[name_1]);
                    delete attributes[name_1];
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        mrow.setProperty('collapse-marker', node.getProperty('collapse-marker'));
        mrow.setProperty('collapse-complexity', node.getProperty('collapse-complexity'));
        node.removeProperty('collapse-marker');
        node.removeProperty('collapse-complexity');
        return mrow;
    };
    Collapse.NOCOLLAPSE = 10000000;
    return Collapse;
}());
exports.Collapse = Collapse;
//# sourceMappingURL=collapse.js.map