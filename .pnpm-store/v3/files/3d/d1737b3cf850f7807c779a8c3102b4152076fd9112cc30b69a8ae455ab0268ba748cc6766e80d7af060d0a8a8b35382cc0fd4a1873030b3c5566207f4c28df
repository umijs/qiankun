/*************************************************************
 *
 *  Copyright (c) 2018-2022 The MathJax Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

/**
 * @fileoverview  Implements a class that computes complexities for enriched math
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {MmlNode, AbstractMmlTokenNode} from '../../core/MmlTree/MmlNode.js';
import {MmlMroot} from '../../core/MmlTree/MmlNodes/mroot.js';
import {MmlMaction} from '../../core/MmlTree/MmlNodes/maction.js';
import {MmlMsubsup, MmlMsub, MmlMsup} from '../../core/MmlTree/MmlNodes/msubsup.js';
import {MmlMunderover, MmlMunder, MmlMover} from '../../core/MmlTree/MmlNodes/munderover.js';
import {MmlVisitor} from '../../core/MmlTree/MmlVisitor.js';
import {MmlFactory} from '../../core/MmlTree/MmlFactory.js';
import {Collapse} from './collapse.js';
import {OptionList, userOptions, defaultOptions} from '../../util/Options.js';

/*==========================================================================*/

/**
 * A visitor pattern that computes complexities within the MathML tree
 */
export class ComplexityVisitor extends MmlVisitor {

    /**
     * The options for handling collapsing
     */
    public static OPTIONS: OptionList = {
        identifyCollapsible: true,    // mark elements that should be collapsed
        makeCollapsible: true,        // insert maction to allow collapsing
        Collapse: Collapse            // the Collapse class to use
    };

    /**
     * Values used to compute complexities
     */
    public complexity: {[name: string]: number} = {
      text: .5,           // each character of a token element adds this to complexity
      token: .5,          // each token element gets this additional complexity
      child: 1,           // child nodes add this to their parent node's complexity

      script: .8,         // script elements reduce their complexity by this factor
      sqrt: 2,            // sqrt adds this extra complexity
      subsup: 2,          // sub-sup adds this extra complexity
      underover: 2,       // under-over adds this extra complexity
      fraction: 2,        // fractions add this extra complexity
      enclose: 2,         // menclose adds this extra complexity
      action: 2,          // maction adds this extra complexity
      phantom: 0,         // mphantom makes complexity 0?
      xml: 2,             // Can't really measure complexity of annotation-xml, so punt
      glyph: 2            // Can't really measure complexity of mglyph, to punt
    };

    /**
     * The object used to handle collapsable content
     */
    public collapse: Collapse;

    /**
     * The MmlFactory for this visitor
     */
    public factory: MmlFactory;

    /**
     * The options for this visitor
     */
    public options: OptionList;

    /**
     * @override
     */
    constructor(factory: MmlFactory, options: OptionList) {
        super(factory);
        let CLASS = this.constructor as typeof ComplexityVisitor;
        this.options = userOptions(defaultOptions({}, CLASS.OPTIONS), options);
        this.collapse = new this.options.Collapse(this);
        this.factory = factory;
    }

    /*==========================================================================*/

    /**
     * @override
     */
    public visitTree(node: MmlNode) {
        super.visitTree(node, true);
        if (this.options.makeCollapsible) {
            this.collapse.makeCollapse(node);
        }
    }

    /**
     * @override
     */
    public visitNode(node: MmlNode, save: boolean) {
        if (node.attributes.get('data-semantic-complexity')) return;
        return super.visitNode(node, save);
    }

    /**
     * For token nodes, use the content length, otherwise, add up the child complexities
     *
     * @override
     */
    public visitDefault(node: MmlNode, save: boolean) {
        let complexity;
        if (node.isToken) {
            const text = (node as AbstractMmlTokenNode).getText();
            complexity = this.complexity.text * text.length + this.complexity.token;
        } else {
            complexity = this.childrenComplexity(node);
        }
        return this.setComplexity(node, complexity, save);
    }

    /**
     * For a fraction, add the complexities of the children and scale by script factor, then
     *   add the fraction amount
     *
     * @param {MmlNode} node   The node whose complixity is being computed
     * @param {boolean} save   True if the complexity is to be saved or just returned
     */
    protected visitMfracNode(node: MmlNode, save: boolean) {
        const complexity = this.childrenComplexity(node) * this.complexity.script + this.complexity.fraction;
        return this.setComplexity(node, complexity, save);
    }

    /**
     * For square roots, use the child complexity plus the sqrt complexity
     *
     * @param {MmlNode} node   The node whose complixity is being computed
     * @param {boolean} save   True if the complexity is to be saved or just returned
     */
    protected visitMsqrtNode(node: MmlNode, save: boolean) {
        const complexity = this.childrenComplexity(node) + this.complexity.sqrt;
        return this.setComplexity(node, complexity, save);
    }

    /**
     * For roots, do the sqrt root computation and remove a bit for the root
     *   (since it is counted in the children sum but is smaller)
     *
     * @param {MmlMroot} node   The node whose complixity is being computed
     * @param {boolean} save   True if the complexity is to be saved or just returned
     */
    protected visitMrootNode(node: MmlMroot, save: boolean) {
        const complexity = this.childrenComplexity(node) + this.complexity.sqrt
            - (1 - this.complexity.script) * this.getComplexity(node.childNodes[1]);
        return this.setComplexity(node, complexity, save);
    }

    /**
     * Phantom complexity is 0
     *
     * @param {MmlNode} node   The node whose complixity is being computed
     * @param {boolean} save   True if the complexity is to be saved or just returned
     */
    protected visitMphantomNode(node: MmlNode, save: boolean) {
        return this.setComplexity(node, this.complexity.phantom, save);
    }

    /**
     * For ms, add the complexity of the quotes to that of the content, and use the
     *    length of that times the text factor as the complexity
     *
     * @param {MmlNode} node   The node whose complixity is being computed
     * @param {boolean} save   True if the complexity is to be saved or just returned
     */
    protected visitMsNode(node: MmlNode, save: boolean) {
        const text = node.attributes.get('lquote')
                   + (node as AbstractMmlTokenNode).getText()
                   + node.attributes.get('rquote');
        const complexity = text.length * this.complexity.text;
        return this.setComplexity(node, complexity, save);
    }

    /**
     * For supscripts and superscripts use the maximum of the script complexities,
     *   multiply by the script factor, and add the base complexity.  Add the child
     *   complexity for each child, and the subsup complexity.
     *
     * @param {MmlMsubsup} node   The node whose complixity is being computed
     * @param {boolean} save   True if the complexity is to be saved or just returned
     */
    protected visitMsubsupNode(node: MmlMsubsup, save: boolean) {
        super.visitDefault(node, true);
        const sub = node.childNodes[node.sub];
        const sup = node.childNodes[node.sup];
        const base = node.childNodes[node.base];
        let complexity = Math.max(
            sub ? this.getComplexity(sub) : 0,
            sup ? this.getComplexity(sup) : 0
        ) * this.complexity.script;
        complexity += this.complexity.child * ((sub ? 1 : 0) + (sup ? 1 : 0));
        complexity += (base ? this.getComplexity(base) + this.complexity.child : 0);
        complexity += this.complexity.subsup;
        return this.setComplexity(node, complexity, save);
    }
    /**
     * @param {MmlMsub} node   The node whose complixity is being computed
     * @param {boolean} save   True if the complexity is to be saved or just returned
     */
    protected visitMsubNode(node: MmlMsub, save: boolean) {
        return this.visitMsubsupNode(node, save);
    }
    /**
     * @param {MmlMsup} node   The node whose complixity is being computed
     * @param {boolean} save   True if the complexity is to be saved or just returned
     */
    protected visitMsupNode(node: MmlMsup, save: boolean) {
        return this.visitMsubsupNode(node, save);
    }

    /**
     * For under/over, get the maximum of the complexities of the under and over
     *   elements times the script factor, and that the maximum of that with the
     *   base complexity.  Add child complexity for all children, and add the
     *   underover amount.
     *
     * @param {MmlMunderover} node   The node whose complixity is being computed
     * @param {boolean} save   True if the complexity is to be saved or just returned
     */
    protected visitMunderoverNode(node: MmlMunderover, save: boolean) {
        super.visitDefault(node, true);
        const under = node.childNodes[node.under];
        const over = node.childNodes[node.over];
        const base = node.childNodes[node.base];
        let complexity = Math.max(
            under ? this.getComplexity(under) : 0,
            over ? this.getComplexity(over) : 0,
        ) * this.complexity.script;
        if (base) {
            complexity = Math.max(this.getComplexity(base), complexity);
        }
        complexity += this.complexity.child * ((under ? 1 : 0) + (over ? 1 : 0) + (base ? 1 : 0));
        complexity += this.complexity.underover;
        return this.setComplexity(node, complexity, save);
    }
    /**
     * @param {MmlMunder} node   The node whose complixity is being computed
     * @param {boolean} save   True if the complexity is to be saved or just returned
     */
    protected visitMunderNode(node: MmlMunder, save: boolean) {
        return this.visitMunderoverNode(node, save);
    }
    /**
     * @param {MmlMover} node   The node whose complixity is being computed
     * @param {boolean} save   True if the complexity is to be saved or just returned
     */
    protected visitMoverNode(node: MmlMover, save: boolean) {
        return this.visitMunderoverNode(node, save);
    }

    /**
     * For enclose, use sum of child complexities plus some for the enclose
     *
     * @param {MmlNode} node   The node whose complixity is being computed
     * @param {boolean} save   True if the complexity is to be saved or just returned
     */
    protected visitMencloseNode(node: MmlNode, save: boolean) {
        const complexity = this.childrenComplexity(node) + this.complexity.enclose;
        return this.setComplexity(node, complexity, save);
    }

    /**
     * For actions, use the complexity of the selected child
     *
     * @param {MmlMaction} node   The node whose complixity is being computed
     * @param {boolean} save   True if the complexity is to be saved or just returned
     */
    protected visitMactionNode(node: MmlMaction, save: boolean) {
        this.childrenComplexity(node);
        const complexity = this.getComplexity(node.selected);
        return this.setComplexity(node, complexity, save);
    }

    /**
     * For semantics, get the complexity from the first child
     *
     * @param {MmlNode} node   The node whose complixity is being computed
     * @param {boolean} save   True if the complexity is to be saved or just returned
     */
    protected visitMsemanticsNode(node: MmlNode, save: boolean) {
        const child = node.childNodes[0] as MmlNode;
        let complexity = 0;
        if (child) {
            this.visitNode(child, true);
            complexity = this.getComplexity(child);
        }
        return this.setComplexity(node, complexity, save);
    }

    /**
     * Can't really measure annotations, so just use a specific value
     *
     * @param {MmlNode} node   The node whose complixity is being computed
     * @param {boolean} save   True if the complexity is to be saved or just returned
     */
    protected visitAnnotationNode(node: MmlNode, save: boolean) {
        return this.setComplexity(node, this.complexity.xml, save);
    }

    /**
     * Can't really measure annotations, so just use a specific value
     *
     * @param {MmlNode} node   The node whose complixity is being computed
     * @param {boolean} save   True if the complexity is to be saved or just returned
     */
    protected visitAnnotation_xmlNode(node: MmlNode, save: boolean) {
        return this.setComplexity(node, this.complexity.xml, save);
    }

    /**
     * Can't really measure mglyph complexity, so just use a specific value
     *
     * @param {MmlNode} node   The node whose complixity is being computed
     * @param {boolean} save   True if the complexity is to be saved or just returned
     */
    protected visitMglyphNode(node: MmlNode, save: boolean) {
        return this.setComplexity(node, this.complexity.glyph, save);
    }

    /*==========================================================================*/

    /**
     * @param {MmlNode} node   The node whose complixity is needed
     * @return {number}        The complexity fof the node (if collapsable, then the collapsed complexity)
     */
    public getComplexity(node: MmlNode): number {
        const collapsed = node.getProperty('collapsedComplexity');
        return (collapsed != null ? collapsed : node.attributes.get('data-semantic-complexity')) as number;
    }

    /**
     * @param {MmlNode} node       The node whose complixity is being set
     * @param {complexity} number  The complexity for the node
     * @param {boolean} save       True if complexity is to be set or just reported
     */
    protected setComplexity(node: MmlNode, complexity: number, save: boolean) {
        if (save) {
            if (this.options.identifyCollapsible) {
                complexity = this.collapse.check(node, complexity);
            }
            node.attributes.set('data-semantic-complexity', complexity);
        }
        return complexity;
    }

    /**
     * @param {MmlNode} node   The node whose children complexities are to be added
     * @return {number}        The sum of the complexities, plus child complexity for each one
     */
    protected childrenComplexity(node: MmlNode): number {
        super.visitDefault(node, true);
        let complexity = 0;
        for (const child of node.childNodes) {
            complexity += this.getComplexity(child as MmlNode);
        }
        if (node.childNodes.length > 1) {
            complexity += node.childNodes.length * this.complexity.child;
        }
        return complexity;
    }

}
