/*************************************************************
 *
 *  Copyright (c) 2017-2022 The MathJax Consortium
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
 * @fileoverview  Utility functions for standard pre and post filters.
 *
 * @author sorge@mathjax.org (Volker Sorge)
 */


import {TEXCLASS, MMLNODE, MmlNode} from '../../core/MmlTree/MmlNode.js';
import NodeUtil from './NodeUtil.js';
import ParseOptions from './ParseOptions.js';
import {MmlMo} from '../../core/MmlTree/MmlNodes/mo.js';
import {Attributes} from '../../core/MmlTree/Attributes.js';


namespace FilterUtil {

  /**
   * Visitor to set stretchy attributes to false on <mo> elements, if they are
   * not used as delimiters. Also wraps non-stretchy infix delimiters into a
   * TeXAtom.
   * @param {MmlNode} math The node to rewrite.
   * @param {ParseOptions} data The parse options.
   */
  export let cleanStretchy = function(arg: {math: any, data: ParseOptions}) {
    let options = arg.data;
    for (let mo of options.getList('fixStretchy')) {
      if (NodeUtil.getProperty(mo, 'fixStretchy')) {
        let symbol = NodeUtil.getForm(mo);
        if (symbol && symbol[3] && symbol[3]['stretchy']) {
          NodeUtil.setAttribute(mo, 'stretchy', false);
        }
        const parent = mo.parent;
        if (!NodeUtil.getTexClass(mo) && (!symbol || !symbol[2])) {
          const texAtom = options.nodeFactory.create('node', 'TeXAtom', [mo]);
          parent.replaceChild(texAtom, mo);
          texAtom.inheritAttributesFrom(mo);
        }
        NodeUtil.removeProperties(mo, 'fixStretchy');
      }
    }
  };


  /**
   * Visitor that removes superfluous attributes from nodes. I.e., if a node has
   * an attribute, which is also an inherited attribute it will be removed. This
   * is necessary as attributes are set bottom up in the parser.
   * @param {ParseOptions} data The parse options.
   */
  export let cleanAttributes = function(arg: {data: ParseOptions}) {
    let node = arg.data.root as MmlNode;
    node.walkTree((mml: MmlNode, _d: any) => {
      let attribs = mml.attributes as any;
      if (!attribs) {
        return;
      }
      const keep = new Set((attribs.get('mjx-keep-attrs') || '').split(/ /));
      delete (attribs.getAllAttributes())['mjx-keep-attrs'];
      for (const key of attribs.getExplicitNames()) {
        if (!keep.has(key) && attribs.attributes[key] === mml.attributes.getInherited(key)) {
          delete attribs.attributes[key];
        }
      }
    }, {});
  };


  /**
   * Combine adjacent <mo> elements that are relations (since MathML treats the
   * spacing very differently)
   * @param {ParseOptions} data The parse options.
   */
  export let combineRelations = function(arg: {data: ParseOptions}) {
    const remove: MmlNode[] = [];
    for (let mo of arg.data.getList('mo')) {
      if (mo.getProperty('relationsCombined') || !mo.parent ||
          (mo.parent && !NodeUtil.isType(mo.parent, 'mrow')) ||
          NodeUtil.getTexClass(mo) !== TEXCLASS.REL) {
        // @test Prime, PrimeSup, Named Function
        continue;
      }
      let mml = mo.parent;
      let m2: MmlNode;
      let children = mml.childNodes as MMLNODE[];
      let next = children.indexOf(mo) + 1;
      let variantForm = NodeUtil.getProperty(mo, 'variantForm');
      while (next < children.length && (m2 = children[next]) &&
             NodeUtil.isType(m2, 'mo') &&
             NodeUtil.getTexClass(m2) === TEXCLASS.REL) {
        if (variantForm === NodeUtil.getProperty(m2, 'variantForm') &&
            _compareExplicit(mo, m2)) {
          // @test Shift Left, Less Equal,
          //       Multirel Font X, Multirel Mathvariant X
          NodeUtil.appendChildren(mo, NodeUtil.getChildren(m2));
          // This treatment means we might loose some inheritance structure, but
          // no properties.
          _copyExplicit(['stretchy', 'rspace'], mo, m2);
          for (const name of m2.getPropertyNames()) {
            mo.setProperty(name, m2.getProperty(name));
          }
          children.splice(next, 1);
          remove.push(m2);
          m2.parent = null;
          m2.setProperty('relationsCombined', true);
        } else {
          // @test Preset Rspace Lspace
          if (mo.attributes.getExplicit('rspace') == null) {
            // @test Mulitrel Mathvariant 3, Mulitrel Mathvariant 4
            NodeUtil.setAttribute(mo, 'rspace', '0pt');
          }
          if (m2.attributes.getExplicit('lspace') == null) {
            // @test Mulitrel Mathvariant 3, Mulitrel Mathvariant 4
            NodeUtil.setAttribute(m2, 'lspace', '0pt');
          }
          break;
        }
      }
      mo.attributes.setInherited('form', (mo as MmlMo).getForms()[0]);
    }
    arg.data.removeFromList('mo', remove);
  };


  /**
   * Copies the specified explicit attributes from node2 to node1.
   * @param {string[]} attrs List of explicit attribute names.
   * @param {MmlNode} node1 The goal node.
   * @param {MmlNode} node2 The source node.
   */
  let _copyExplicit = function(attrs: string[],
                               node1: MmlNode, node2: MmlNode) {
    let attr1 = node1.attributes;
    let attr2 = node2.attributes;
    attrs.forEach(x => {
      let attr = attr2.getExplicit(x);
      if (attr != null) {
        // @test Infix Stretchy Right, Preset Lspace Rspace
        attr1.set(x, attr);
      }
    });
  };


  /**
   * Compares the explicit attributes of two nodes. Returns true if they
   * coincide, with the following exceptions:
   *   - lspace attribute of node1 is ignored.
   *   - rspace attribute of node2 is ignored.
   *   - stretchy=false attributes are ignored.
   * @param {MmlNode} node1 The first node.
   * @param {MmlNode} node2 Its next sibling.
   */
  let _compareExplicit = function(node1: MmlNode, node2: MmlNode) {
    let filter = (attr: Attributes, space: string): string[] => {
      let exp = attr.getExplicitNames();
      return exp.filter(x => {
        return x !== space &&
          (x !== 'stretchy' ||
           attr.getExplicit('stretchy'));
      });
    };
    let attr1 = node1.attributes;
    let attr2 = node2.attributes;
    let exp1 = filter(attr1, 'lspace');
    let exp2 = filter(attr2, 'rspace');
    if (exp1.length !== exp2.length) {
      return false;
    }
    for (let name of exp1) {
      if (attr1.getExplicit(name) !== attr2.getExplicit(name)) {
        return false;
      }
    }
    return true;
  };

  /**
   * Cleans msubsup and munderover elements.
   * @param {ParseOptions} options The parse options.
   * @param {string} low String representing the lower part of the expression.
   * @param {string} up String representing the upper part.
   */
  let _cleanSubSup = function(options: ParseOptions, low: string, up: string) {
    const remove: MmlNode[] = [];
    for (let mml of options.getList('m' + low + up) as any[]) {
      const children = mml.childNodes;
      if (children[mml[low]] && children[mml[up]]) {
        continue;
      }
      const parent = mml.parent;
      let newNode = (children[mml[low]] ?
                 options.nodeFactory.create('node', 'm' + low, [children[mml.base], children[mml[low]]]) :
                 options.nodeFactory.create('node', 'm' + up, [children[mml.base], children[mml[up]]]));
      NodeUtil.copyAttributes(mml, newNode);
      if (parent) {
        parent.replaceChild(newNode, mml);
      } else {
        options.root = newNode;
      }
      remove.push(mml);
    }
    options.removeFromList('m' + low + up, remove);
  };


  /**
   * Visitor that rewrites incomplete msubsup/munderover elements in the given
   * node into corresponding msub/sup/under/over nodes.
   * @param {MmlNode} math The node to rewrite.
   * @param {ParseOptions} data The parse options.
   */
  export let cleanSubSup = function(arg: {math: any, data: ParseOptions}) {
    let options = arg.data;
    if (options.error) {
      return;
    }
    _cleanSubSup(options, 'sub', 'sup');
    _cleanSubSup(options, 'under', 'over');
  };


  /**
   * Looks through the list of munderover elements for ones that have
   * movablelimits and bases that are not mo's, and creates new msubsup
   * elements to replace them if they aren't in displaystyle.
   *
   * @param {MmlNode} ath The node to rewrite.
   * @param {ParseOptions} data The parse options.
   */
  let _moveLimits = function (options: ParseOptions, underover: string, subsup: string) {
    const remove: MmlNode[] = [];
    for (const mml of options.getList(underover)) {
      if (mml.attributes.get('displaystyle')) {
        continue;
      }
      const base = mml.childNodes[(mml as any).base] as MmlNode;
      const mo = base.coreMO();
      if (base.getProperty('movablelimits') && !mo.attributes.getExplicit('movablelimits')) {
        let node = options.nodeFactory.create('node', subsup, mml.childNodes);
        NodeUtil.copyAttributes(mml, node);
        if (mml.parent) {
          mml.parent.replaceChild(node, mml);
        } else {
          options.root = node;
        }
        remove.push(mml);
      }
    }
    options.removeFromList(underover, remove);
  };

  /**
   * Visitor that rewrites in-line munderover elements with movablelimits but bases
   * that are not mo's into explicit msubsup elements.
   *
   * @param {ParseOptions} data  The parse options to use
   */
  export let moveLimits = function (arg: {data: ParseOptions}) {
    const options = arg.data;
    _moveLimits(options, 'munderover', 'msubsup');
    _moveLimits(options, 'munder', 'msub');
    _moveLimits(options, 'mover', 'msup');
  };


  /**
   * Recursively sets the inherited attributes on the math tree.
   * @param {MmlNode} math The node to rewrite.
   * @param {ParseOptions} data The parse options.
   */
  export let setInherited = function(arg: {math: any, data: ParseOptions}) {
    arg.data.root.setInheritedAttributes({}, arg.math['display'], 0, false);
  };

}


export default FilterUtil;
