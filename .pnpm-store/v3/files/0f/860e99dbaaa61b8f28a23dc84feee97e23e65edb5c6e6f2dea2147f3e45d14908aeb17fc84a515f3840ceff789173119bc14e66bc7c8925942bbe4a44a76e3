"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Focus = void 0;
const WalkerUtil = require("./walker_util");
class Focus {
    constructor(nodes, primary) {
        this.nodes = nodes;
        this.primary = primary;
        this.domNodes = [];
        this.domPrimary_ = null;
        this.allNodes = [];
    }
    static factory(primaryId, nodeIds, rebuilt, dom) {
        const idFunc = (id) => WalkerUtil.getBySemanticId(dom, id);
        const dict = rebuilt.nodeDict;
        const node = idFunc(primaryId);
        const nodes = nodeIds.map(idFunc);
        const snodes = nodeIds.map(function (primaryId) {
            return dict[primaryId];
        });
        const focus = new Focus(snodes, dict[primaryId]);
        focus.domNodes = nodes;
        focus.domPrimary_ = node;
        focus.allNodes = Focus.generateAllVisibleNodes_(nodeIds, nodes, dict, dom);
        return focus;
    }
    static generateAllVisibleNodes_(ids, nodes, dict, domNode) {
        const idFunc = (id) => WalkerUtil.getBySemanticId(domNode, id);
        let result = [];
        for (let i = 0, l = ids.length; i < l; i++) {
            if (nodes[i]) {
                result.push(nodes[i]);
                continue;
            }
            const virtual = dict[ids[i]];
            if (!virtual) {
                continue;
            }
            const childIds = virtual.childNodes.map(function (x) {
                return x.id.toString();
            });
            const children = childIds.map(idFunc);
            result = result.concat(Focus.generateAllVisibleNodes_(childIds, children, dict, domNode));
        }
        return result;
    }
    getSemanticPrimary() {
        return this.primary;
    }
    getSemanticNodes() {
        return this.nodes;
    }
    getNodes() {
        return this.allNodes;
    }
    getDomNodes() {
        return this.domNodes;
    }
    getDomPrimary() {
        return this.domPrimary_;
    }
    toString() {
        return 'Primary:' + this.domPrimary_ + ' Nodes:' + this.domNodes;
    }
    clone() {
        const focus = new Focus(this.nodes, this.primary);
        focus.domNodes = this.domNodes;
        focus.domPrimary_ = this.domPrimary_;
        focus.allNodes = this.allNodes;
        return focus;
    }
}
exports.Focus = Focus;
