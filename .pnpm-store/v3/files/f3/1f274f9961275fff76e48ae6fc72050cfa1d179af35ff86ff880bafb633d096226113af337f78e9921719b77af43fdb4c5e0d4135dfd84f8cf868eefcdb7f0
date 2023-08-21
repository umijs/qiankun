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
 * @fileoverview  Implements a class that marks complex items for collapsing
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {MmlNode, AbstractMmlTokenNode, TextNode} from '../../core/MmlTree/MmlNode.js';
import {ComplexityVisitor} from './visitor.js';

/*==========================================================================*/

/**
 * Function for checking if a node should be collapsible
 */
export type CollapseFunction = (node: MmlNode, complexity: number) => number;

/**
 * Map of types to collase functions
 */
export type CollapseFunctionMap = Map<string, CollapseFunction>;

/**
 * A list of values indexed by semantic-type, possibly sub-indexed by semantic-role
 *
 * @template T   The type of the indexed item
 */
export type TypeRole<T> = {[type: string]: T | {[role: string]: T}};

/**
 * The class for determining of a subtree can be collapsed
 */
export class Collapse {

    /**
     * A constant to use to indicate no collapsing
     */
    public static NOCOLLAPSE: number = 10000000; // really big complexity

    /**
     * The complexity object containing this one
     */
    public complexity: ComplexityVisitor;

    /**
     * The cutt-off complexity values for when a structure
     *   of the given type should collapse
     */
    public cutoff: TypeRole<number> = {
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

    /**
     *  These are the characters to use for the various collapsed elements
     *  (if an object, then semantic-role is used to get the character
     *  from the object)
     */
    public marker: TypeRole<string> = {
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

    /**
     * The type-to-function mapping for semantic types
     */
    public collapse: CollapseFunctionMap = new Map([

        //
        //  For fenced elements, if the contents are collapsed,
        //    collapse the fence instead.
        //
        ['fenced', (node, complexity) => {
            complexity = this.uncollapseChild(complexity, node, 1);
            if (complexity > this.cutoff.fenced && node.attributes.get('data-semantic-role') === 'leftright') {
                complexity = this.recordCollapse(
                    node, complexity,
                    this.getText(node.childNodes[0] as MmlNode) +
                        this.getText(node.childNodes[node.childNodes.length - 1] as MmlNode)
                );
            }
            return complexity;
        }],

        //
        //  Collapse function applications if the argument is collapsed
        //    (FIXME: Handle role="limit function" a bit better?)
        //
        ['appl', (node, complexity) => {
            if (this.canUncollapse(node, 2, 2)) {
                complexity = this.complexity.visitNode(node, false);
                const marker = this.marker.appl as {[name: string]: string};
                const text = marker[node.attributes.get('data-semantic-role') as string] || marker.value;
                complexity = this.recordCollapse(node, complexity, text);
            }
            return complexity;
        }],

        //
        //  For sqrt elements, if the contents are collapsed,
        //    collapse the sqrt instead.
        //
        ['sqrt', (node, complexity) => {
            complexity = this.uncollapseChild(complexity, node, 0);
            if (complexity > this.cutoff.sqrt) {
                complexity = this.recordCollapse(node, complexity, this.marker.sqrt as string);
            }
            return complexity;
        }],
        ['root', (node, complexity) => {
            complexity = this.uncollapseChild(complexity, node, 0, 2);
            if (complexity > this.cutoff.sqrt) {
                complexity = this.recordCollapse(node, complexity, this.marker.sqrt as string);
            }
            return complexity;
        }],

        //
        //  For enclose, include enclosure in collapse
        //
        ['enclose', (node, complexity) => {
            if (this.splitAttribute(node, 'children').length === 1) {
                const child = this.canUncollapse(node, 1);
                if (child) {
                    const marker = child.getProperty('collapse-marker') as string;
                    this.unrecordCollapse(child);
                    complexity = this.recordCollapse(node, this.complexity.visitNode(node, false), marker);
                }
            }
            return complexity;
        }],

        //
        //  For bigops, get the character to use from the largeop at its core.
        //
        ['bigop', (node, complexity) => {
            if (complexity > this.cutoff.bigop || !node.isKind('mo')) {
                const id = this.splitAttribute(node, 'content').pop();
                const op = this.findChildText(node, id);
                complexity = this.recordCollapse(node, complexity, op);
            }
            return complexity;
        }],
        ['integral', (node, complexity) => {
            if (complexity > this.cutoff.integral || !node.isKind('mo')) {
                const id = this.splitAttribute(node, 'content').pop();
                const op = this.findChildText(node, id);
                complexity = this.recordCollapse(node, complexity, op);
            }
            return complexity;
        }],

        //
        //  For relseq and multirel, use proper symbol
        //
        ['relseq', (node, complexity) => {
            if (complexity > this.cutoff.relseq) {
                const id = this.splitAttribute(node, 'content')[0];
                const text = this.findChildText(node, id);
                complexity = this.recordCollapse(node, complexity, text);
            }
            return complexity;
        }],
        ['multirel', (node, complexity) => {
            if (complexity > this.cutoff.relseq) {
                const id = this.splitAttribute(node, 'content')[0];
                const text = this.findChildText(node, id) + '\u22EF';
                complexity = this.recordCollapse(node, complexity, text);
            }
            return complexity;
        }],

        //
        //  Include super- and subscripts into a collapsed base
        //
        ['superscript', (node, complexity) => {
            complexity = this.uncollapseChild(complexity, node, 0, 2);
            if (complexity > this.cutoff.superscript) {
                complexity = this.recordCollapse(node, complexity, this.marker.superscript as string);
            }
            return complexity;
        }],
        ['subscript', (node, complexity) => {
            complexity = this.uncollapseChild(complexity, node, 0, 2);
            if (complexity > this.cutoff.subscript) {
                complexity = this.recordCollapse(node, complexity, this.marker.subscript as string);
            }
            return complexity;
        }],
        ['subsup', (node, complexity) => {
            complexity = this.uncollapseChild(complexity, node, 0, 3);
            if (complexity > this.cutoff.subsup) {
                complexity = this.recordCollapse(node, complexity, this.marker.subsup as string);
            }
            return complexity;
        }]

    ] as [string, CollapseFunction][]);

    /**
     * The highest id number used for mactions so far
     */
    private idCount = 0;

    /**
     * @param {ComplexityVisitor} visitor  The visitor for computing complexities
     */
    constructor(visitor: ComplexityVisitor) {
        this.complexity = visitor;
    }

    /**
     * Check if a node should be collapsible and insert the
     *  maction node to handle that.  Return the updated
     *  complexity.
     *
     * @param {MmlNode} node        The node to check
     * @param {number} complexity   The current complexity of the node
     * @return {number}             The revised complexity
     */
    public check(node: MmlNode, complexity: number): number {
        const type = node.attributes.get('data-semantic-type') as string;
        if (this.collapse.has(type)) {
            return this.collapse.get(type).call(this, node, complexity);
        }
        if (this.cutoff.hasOwnProperty(type)) {
            return this.defaultCheck(node, complexity, type);
        }
        return complexity;
    }

    /**
     * Check if the complexity exceeds the cutoff value for the type
     *
     * @param {MmlNode} node        The node to check
     * @param {number} complexity   The current complexity of the node
     * @param {string} type         The semantic type of the node
     * @return {number}             The revised complexity
     */
    protected defaultCheck(node: MmlNode, complexity: number, type: string): number {
        const role = node.attributes.get('data-semantic-role') as string;
        const check = this.cutoff[type];
        const cutoff = (typeof check === 'number' ? check : check[role] || check.value);
        if (complexity > cutoff) {
            const marker = this.marker[type] || '??';
            const text = (typeof marker === 'string' ? marker : marker[role] || marker.value);
            complexity = this.recordCollapse(node, complexity, text);
        }
        return complexity;
    }

    /**
     * @param {MmlNode} node       The node to check
     * @param {number} complexity  The current complexity of the node
     * @param {string} text        The text to use for the collapsed node
     * @return {number}            The revised complexity for the collapsed node
     */
    protected recordCollapse(node: MmlNode, complexity: number, text: string): number {
        text = '\u25C2' + text + '\u25B8';
        node.setProperty('collapse-marker', text);
        node.setProperty('collapse-complexity', complexity);
        return text.length * this.complexity.complexity.text;
    }

    /**
     * Remove collapse markers (to move them to a parent node)
     *
     * @param {MmlNode} node   The node to uncollapse
     */
    protected unrecordCollapse(node: MmlNode) {
        const complexity = node.getProperty('collapse-complexity');
        if (complexity != null) {
            node.attributes.set('data-semantic-complexity', complexity);
            node.removeProperty('collapse-complexity');
            node.removeProperty('collapse-marker');
        }
    }

    /**
     * @param {MmlNode} node    The node to check if its child is collapsible
     * @param {number} n        The position of the child node to check
     * @param {number=} m       The number of children node must have
     * @return {MmlNode|null}   The child node that was collapsed (or null)
     */
    protected canUncollapse(node: MmlNode, n: number, m: number = 1): MmlNode | null {
        if (this.splitAttribute(node, 'children').length === m) {
            const mml = (node.childNodes.length === 1 &&
                         (node.childNodes[0] as MmlNode).isInferred ? node.childNodes[0] as MmlNode : node);
            if (mml && mml.childNodes[n]) {
                const child = mml.childNodes[n] as MmlNode;
                if (child.getProperty('collapse-marker')) {
                    return child;
                }
            }
        }
        return null;
    }

    /**
     * @param {number} complexity   The current complexity
     * @param {MmlNode} node        The node to check
     * @param {number} n            The position of the child node to check
     * @param {number=} m           The number of children the node must have
     * @return {number}             The updated complexity
     */
    protected uncollapseChild(complexity: number, node: MmlNode, n: number, m: number = 1): number {
        const child = this.canUncollapse(node, n, m);
        if (child) {
            this.unrecordCollapse(child);
            if (child.parent !== node) {
                child.parent.attributes.set('data-semantic-complexity', undefined);
            }
            complexity = this.complexity.visitNode(node, false) as number;
        }
        return complexity;
    }

    /**
     * @param {MmlNode} node   The node whose attribute is to be split
     * @param {string} id      The name of the data-semantic attribute to split
     * @return {string[]}      Array of ids in the attribute split at commas
     */
    protected splitAttribute(node: MmlNode, id: string): string[] {
        return (node.attributes.get('data-semantic-' + id) as string || '').split(/,/);
    }

    /**
     * @param {MmlNode} node   The node whose text content is needed
     * @return{string}         The text of the node (and its children), combined
     */
    protected getText(node: MmlNode): string {
        if (node.isToken) return (node as AbstractMmlTokenNode).getText();
        return node.childNodes.map((n: MmlNode) => this.getText(n)).join('');
    }

    /**
     * @param {MmlNode} node   The node whose child text is needed
     * @param {string} id      The (semantic) id of the child needed
     * @return {string}        The text of the specified child node
     */
    protected findChildText(node: MmlNode, id: string): string {
        const child = this.findChild(node, id);
        return this.getText(child.coreMO() || child);
    }

    /**
     * @param {MmlNode} node    The node whose child is to be located
     * @param {string} id       The (semantic) id of the child to be found
     * @return {MmlNode|null}   The child node (or null if not found)
     */
    protected findChild(node: MmlNode, id: string): MmlNode | null {
        if (!node || node.attributes.get('data-semantic-id') === id) return node;
        if (!node.isToken) {
            for (const mml of node.childNodes) {
                const child = this.findChild(mml as MmlNode, id);
                if (child) return child;
            }
        }
        return null;
    }

    /**
     * Add maction nodes to the nodes in the tree that can collapse
     *
     * @paramn {MmlNode} node   The root of the tree to check
     */
    public makeCollapse(node: MmlNode) {
        const nodes: MmlNode[] = [];
        node.walkTree((child: MmlNode) => {
            if (child.getProperty('collapse-marker')) {
                nodes.push(child);
            }
        });
        this.makeActions(nodes);
    }

    /**
     * @param {MmlNode[]} nodes   The list of nodes to replace by maction nodes
     */
    public makeActions(nodes: MmlNode[]) {
        for (const node of nodes) {
            this.makeAction(node);
        }
    }

    /**
     * @return {string}   A unique id string.
     */
    private makeId(): string {
        return 'mjx-collapse-' + this.idCount++;
    }

    /**
     * @param {MmlNode} node   The node to make collapsible by replacing with an maction
     */
    public makeAction(node: MmlNode) {
        if (node.isKind('math')) {
            node = this.addMrow(node);
        }
        const factory = this.complexity.factory;
        const marker = node.getProperty('collapse-marker') as string;
        const parent = node.parent;
        let maction = factory.create('maction', {
            actiontype: 'toggle',
            selection: 2,
            'data-collapsible': true,
            id: this.makeId(),
            'data-semantic-complexity': node.attributes.get('data-semantic-complexity')
        }, [
            factory.create('mtext', {mathcolor: 'blue'}, [
                (factory.create('text') as TextNode).setText(marker)
            ])
        ]);
        maction.inheritAttributesFrom(node);
        node.attributes.set('data-semantic-complexity', node.getProperty('collapse-complexity'));
        node.removeProperty('collapse-marker');
        node.removeProperty('collapse-complexity');
        parent.replaceChild(maction, node);
        maction.appendChild(node);
    }

    /**
     * If the <math> node is to be collapsible, add an mrow to it instead so that we can wrap it
     *  in an maction (can't put one around the <math> node).
     *
     * @param {MmlNode} node  The math node to create an mrow for
     * @return {MmlNode}      The newly created mrow
     */
    public addMrow(node: MmlNode): MmlNode {
        const mrow = this.complexity.factory.create('mrow', null, node.childNodes[0].childNodes as MmlNode[]);
        node.childNodes[0].setChildren([mrow]);

        const attributes = node.attributes.getAllAttributes();
        for (const name of Object.keys(attributes)) {
            if (name.substr(0, 14) === 'data-semantic-') {
                mrow.attributes.set(name, attributes[name]);
                delete attributes[name];
            }
        }

        mrow.setProperty('collapse-marker', node.getProperty('collapse-marker'));
        mrow.setProperty('collapse-complexity', node.getProperty('collapse-complexity'));
        node.removeProperty('collapse-marker');
        node.removeProperty('collapse-complexity');
        return mrow;
    }
}
