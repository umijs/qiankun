/*************************************************************
 *
 *  Copyright (c) 2009-2022 The MathJax Consortium
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
 * @fileoverview Stack items for basic Tex parsing.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */


import {MapHandler} from '../MapHandler.js';
import {CharacterMap} from '../SymbolMap.js';
import {entities} from '../../../util/Entities.js';
import {MmlNode, TextNode, TEXCLASS} from '../../../core/MmlTree/MmlNode.js';
import {MmlMsubsup} from '../../../core/MmlTree/MmlNodes/msubsup.js';
import TexError from '../TexError.js';
import ParseUtil from '../ParseUtil.js';
import NodeUtil from '../NodeUtil.js';
import {Property} from '../../../core/Tree/Node.js';
import StackItemFactory from '../StackItemFactory.js';
import {CheckType, BaseItem, StackItem, EnvList} from '../StackItem.js';


/**
 * Initial item on the stack. It's pushed when parsing begins.
 */
export class StartItem extends BaseItem {

  /**
   * @override
   */
  constructor(factory: StackItemFactory, public global: EnvList) {
    super(factory);
  }


  /**
   * @override
   */
  public get kind() {
    return 'start';
  }


  /**
   * @override
   */
  get isOpen() {
    return true;
  }

  /**
   * @override
   */
  public checkItem(item: StackItem): CheckType {
    if (item.isKind('stop')) {
      let node = this.toMml();
      if (!this.global.isInner) {
        node = this.factory.configuration.tags.finalize(node, this.env);
      }
      return [[this.factory.create('mml', node)], true];
    }
    return super.checkItem(item);
  }

}


/**
 * Final item on the stack. Errors will be thrown if other items than the start
 * item are still on the stack.
 */
export class StopItem extends BaseItem {

  /**
   * @override
   */
  public get kind() {
    return 'stop';
  }


  /**
   * @override
   */
  get isClose() {
    return true;
  }

}


/**
 * Item indicating an open brace.
 */
export class OpenItem extends BaseItem {


  /**
   * @override
   */
  protected static errors = Object.assign(Object.create(BaseItem.errors), {
    // @test ExtraOpenMissingClose
    'stop': ['ExtraOpenMissingClose',
             'Extra open brace or missing close brace']
  });

  /**
   * @override
   */
  public get kind() {
    return 'open';
  }


  /**
   * @override
   */
  get isOpen() {
    return true;
  }

  /**
   * @override
   */
  public checkItem(item: StackItem): CheckType {
    if (item.isKind('close')) {
      // @test PrimeSup
      let mml = this.toMml();
      const node = this.create('node', 'TeXAtom', [mml]);
      return [[this.factory.create('mml', node)], true];
    }
    return super.checkItem(item);
  }
}


/**
 * Item indicating a close brace. Collapses stack until an OpenItem is found.
 */
export class CloseItem extends BaseItem {

  /**
   * @override
   */
  public get kind() {
    return 'close';
  }


  /**
   * @override
   */
  get isClose() {
    return true;
  }

}


/**
 * Item indicating an we are currently dealing with a prime mark.
 */
export class PrimeItem extends BaseItem {

  /**
   * @override
   */
  public get kind() {
    return 'prime';
  }

  /**
   * @override
   */
  public checkItem(item: StackItem): CheckType {
    let [top0, top1] = this.Peek(2);
    if (!NodeUtil.isType(top0, 'msubsup') || NodeUtil.isType(top0, 'msup')) {
      // @test Prime, Double Prime
      const node = this.create('node', 'msup', [top0, top1]);
      return [[node, item], true];
    }
    NodeUtil.setChild(top0, (top0 as MmlMsubsup).sup, top1);
    return [[top0, item], true];
  }
}


/**
 * Item indicating an we are currently dealing with a sub/superscript
 * expression.
 */
export class SubsupItem extends BaseItem {

  /**
   * @override
   */
  protected static errors = Object.assign(Object.create(BaseItem.errors), {
    // @test MissingScript Sub, MissingScript Sup
    'stop': ['MissingScript',
             'Missing superscript or subscript argument'],
    // @test MissingOpenForSup
    'sup': ['MissingOpenForSup',
            'Missing open brace for superscript'],
    // @test MissingOpenForSub
    'sub': ['MissingOpenForSub',
            'Missing open brace for subscript']
  });

  /**
   * @override
   */
  public get kind() {
    return 'subsup';
  }

  /**
   * @override
   */
  public checkItem(item: StackItem): CheckType | null {
    if (item.isKind('open') || item.isKind('left')) {
      return BaseItem.success;
    }
    const top = this.First;
    const position = this.getProperty('position') as number;
    if (item.isKind('mml')) {
      if (this.getProperty('primes')) {
        if (position !== 2) {
          // @test Prime on Sub
          NodeUtil.setChild(top, 2, this.getProperty('primes') as MmlNode);
        } else {
          // @test Prime on Prime
          NodeUtil.setProperty(this.getProperty('primes') as MmlNode, 'variantForm', true);
          const node = this.create('node', 'mrow', [this.getProperty('primes') as MmlNode, item.First]);
          item.First = node;
        }
      }
      NodeUtil.setChild(top, position, item.First);
      if (this.getProperty('movesupsub') != null) {
        // @test Limits Subsup (currently does not work! Check again!)
        NodeUtil.setProperty(top, 'movesupsub', this.getProperty('movesupsub') as Property);
      }
      const result = this.factory.create('mml', top);
      return [[result], true];
    }
    if (super.checkItem(item)[1]) {
      // @test Brace Superscript Error, MissingOpenForSup, MissingOpenForSub
      const error = this.getErrors(['', 'sub', 'sup'][position]);
      throw new TexError(error[0], error[1], ...error.splice(2));
    }
    return null;
  }

}


/**
 * Item indicating an we are currently dealing with an \\over command.
 */
export class OverItem extends BaseItem {

  /**
   * @override
   */
  constructor(factory: StackItemFactory) {
    super(factory);
    this.setProperty('name', '\\over');
  }

  /**
   * @override
   */
  public get kind() {
    return 'over';
  }


  /**
   * @override
   */
  get isClose() {
    return true;
  }


  /**
   * @override
   */
  public checkItem(item: StackItem): CheckType {
    if (item.isKind('over')) {
      // @test Double Over
      throw new TexError(
        'AmbiguousUseOf', 'Ambiguous use of %1', item.getName());
    }
    if (item.isClose) {
      // @test Over
      let mml = this.create('node',
                            'mfrac', [this.getProperty('num') as MmlNode, this.toMml(false)]);
      if (this.getProperty('thickness') != null) {
        // @test Choose, Above, Above with Delims
        NodeUtil.setAttribute(mml, 'linethickness',
                              this.getProperty('thickness') as string);
      }
      if (this.getProperty('open') || this.getProperty('close')) {
        // @test Choose
        NodeUtil.setProperty(mml, 'withDelims', true);
        mml = ParseUtil.fixedFence(this.factory.configuration,
                                   this.getProperty('open') as string, mml,
                                   this.getProperty('close') as string);
      }
      return [[this.factory.create('mml', mml), item], true];
    }
    return super.checkItem(item);
  }


  /**
   * @override
   */
  public toString() {
    return 'over[' + this.getProperty('num') +
      ' / ' + this.nodes.join('; ') + ']';
  }

}


/**
 * Item pushed when a \\left opening delimiter has been found.
 */
export class LeftItem extends BaseItem {

  /**
   * @override
   */
  protected static errors = Object.assign(Object.create(BaseItem.errors), {
    // @test ExtraLeftMissingRight
    'stop': ['ExtraLeftMissingRight',
             'Extra \\left or missing \\right']
  });


  /**
   * @override
   */
  constructor(factory: StackItemFactory, delim: string) {
    super(factory);
    this.setProperty('delim', delim);
  }

  /**
   * @override
   */
  public get kind() {
    return 'left';
  }


  /**
   * @override
   */
  get isOpen() {
    return true;
  }


  /**
   * @override
   */
  public checkItem(item: StackItem): CheckType {
    // @test Missing Right
    if (item.isKind('right')) {
      //
      //  Create the fenced structure as an mrow
      //
      return [[this.factory.create('mml', ParseUtil.fenced(
        this.factory.configuration,
        this.getProperty('delim') as string, this.toMml(),
        item.getProperty('delim') as string, '', item.getProperty('color') as string))], true];
    }
    if (item.isKind('middle')) {
      //
      //  Add the middle delimiter, with empty open and close elements around it for spacing
      //
      const def = {stretchy: true} as any;
      if (item.getProperty('color')) {
        def.mathcolor = item.getProperty('color');
      }
      this.Push(
        this.create('node', 'TeXAtom', [], {texClass: TEXCLASS.CLOSE}),
        this.create('token', 'mo', def, item.getProperty('delim')),
        this.create('node', 'TeXAtom', [], {texClass: TEXCLASS.OPEN})
      );
      this.env = {};         // Since \middle closes the group, clear the environment
      return [[this], true]; // this will reset the environment to its initial state
    }
    return super.checkItem(item);
  }

}

/**
 * Item pushed when a \\middle delimiter has been found. Stack is
 * collapsed until a corresponding LeftItem is encountered.
 */
export class Middle extends BaseItem {

  /**
   * @override
   */
  constructor(factory: StackItemFactory, delim: string, color: string) {
    super(factory);
    this.setProperty('delim', delim);
    color && this.setProperty('color', color);
  }

  /**
   * @override
   */
  public get kind() {
    return 'middle';
  }


  /**
   * @override
   */
  get isClose() {
    return true;
  }

}

/**
 * Item pushed when a \\right closing delimiter has been found. Stack is
 * collapsed until a corresponding LeftItem is encountered.
 */
export class RightItem extends BaseItem {

  /**
   * @override
   */
  constructor(factory: StackItemFactory, delim: string, color: string) {
    super(factory);
    this.setProperty('delim', delim);
    color && this.setProperty('color', color);
  }

  /**
   * @override
   */
  public get kind() {
    return 'right';
  }


  /**
   * @override
   */
  get isClose() {
    return true;
  }

}


/**
 * Item pushed for opening an environment with \\begin{env}.
 */
export class BeginItem extends BaseItem {

  /**
   * @override
   */
  public get kind() {
    return 'begin';
  }


  /**
   * @override
   */
  get isOpen() {
    return true;
  }

  /**
   * @override
   */
  public checkItem(item: StackItem): CheckType {
    if (item.isKind('end')) {
      if (item.getName() !== this.getName()) {
        // @test EnvBadEnd
        throw new TexError('EnvBadEnd', '\\begin{%1} ended with \\end{%2}',
                           this.getName(), item.getName());
      }
      if (!this.getProperty('end')) {
        // @test Hfill
        return [[this.factory.create('mml', this.toMml())], true];
      }
      return BaseItem.fail;  // TODO: This case could probably go!
    }
    if (item.isKind('stop')) {
      // @test EnvMissingEnd Array
      throw new TexError('EnvMissingEnd', 'Missing \\end{%1}', this.getName());
    }
    return super.checkItem(item);
  }

}


/**
 * Item pushed for closing an environment with \\end{env}. Stack is collapsed
 * until a corresponding BeginItem for 'env' is found. Error is thrown in case
 * other open environments interfere.
 */
export class EndItem extends BaseItem {

  /**
   * @override
   */
  public get kind() {
    return 'end';
  }


  /**
   * @override
   */
  get isClose() {
    return true;
  }

}


/**
 * Item pushed for remembering styling information.
 */
export class StyleItem extends BaseItem {

  /**
   * @override
   */
  public get kind() {
    return 'style';
  }

  /**
   * @override
   */
  public checkItem(item: StackItem): CheckType {
    if (!item.isClose) {
      return super.checkItem(item);
    }
    // @test Style
    const mml = this.create('node', 'mstyle', this.nodes, this.getProperty('styles'));
    return [[this.factory.create('mml', mml), item], true];
  }

}


/**
 * Item pushed for remembering positioning information.
 */
export class PositionItem extends BaseItem {

  /**
   * @override
   */
  public get kind() {
    return 'position';
  }


  /**
   * @override
   */
  public checkItem(item: StackItem): CheckType {
    if (item.isClose) {
      // @test MissingBoxFor
      throw new TexError('MissingBoxFor', 'Missing box for %1', this.getName());
    }
    if (item.isFinal) {
      let mml = item.toMml();
      switch (this.getProperty('move')) {
      case 'vertical':
        // @test Raise, Lower, Raise Negative, Lower Negative
        mml = this.create('node', 'mpadded', [mml],
                          {height: this.getProperty('dh'),
                           depth: this.getProperty('dd'),
                           voffset: this.getProperty('dh')});
        return [[this.factory.create('mml', mml)], true];
      case 'horizontal':
        // @test Move Left, Move Right, Move Left Negative, Move Right Negative
        return [[this.factory.create('mml', this.getProperty('left') as MmlNode), item,
                 this.factory.create('mml', this.getProperty('right') as MmlNode)], true];
      }
    }
    return super.checkItem(item);
  }
}


/**
 * Item indicating a table cell.
 */
export class CellItem extends BaseItem {

  /**
   * @override
   */
  public get kind() {
    return 'cell';
  }


  /**
   * @override
   */
  get isClose() {
    return true;
  }
}


/**
 * Final item for collating Nodes.
 */
export class MmlItem extends BaseItem {

  /**
   * @override
   */
  public get isFinal() {
    return true;
  }

  /**
   * @override
   */
  public get kind() {
    return 'mml';
  }

}


/**
 * Item indicating a named function operator (e.g., \\sin) as been encountered.
 */
export class FnItem extends BaseItem {

  /**
   * @override
   */
  public get kind() {
    return 'fn';
  }

  /**
   * @override
   */
  public checkItem(item: StackItem): CheckType {
    const top = this.First;
    if (top) {
      if (item.isOpen) {
        // @test Fn Stretchy
        return BaseItem.success;
      }
      if (!item.isKind('fn')) {
        // @test Named Function
        let mml = item.First;
        if (!item.isKind('mml') || !mml) {
          // @test Mathop Super
          return [[top, item], true];
        }
        if ((NodeUtil.isType(mml, 'mstyle') && mml.childNodes.length &&
             NodeUtil.isType(mml.childNodes[0].childNodes[0] as MmlNode, 'mspace')) ||
             NodeUtil.isType(mml, 'mspace')) {
          // @test Fn Pos Space, Fn Neg Space
          return [[top, item], true];
        }
        if (NodeUtil.isEmbellished(mml)) {
          // @test MultiInt with Limits
          mml = NodeUtil.getCoreMO(mml);
        }
        const form = NodeUtil.getForm(mml);
        if (form != null && [0, 0, 1, 1, 0, 1, 1, 0, 0, 0][form[2]]) {
          // @test Fn Operator
          return [[top, item], true];
        }
      }
      // @test Named Function, Named Function Arg
      const node = this.create('token', 'mo', {texClass: TEXCLASS.NONE},
                               entities.ApplyFunction);
      return [[top, node, item], true];
    }
    // @test Mathop Super, Mathop Sub
    return super.checkItem.apply(this, arguments);
  }
}


/**
 * Item indicating a \\not has been encountered and needs to be applied to the
 * next operator.
 */
export class NotItem extends BaseItem {

  private remap = MapHandler.getMap('not_remap') as CharacterMap;

  /**
   * @override
   */
  public get kind() {
    return 'not';
  }

  /**
   * @override
   */
  public checkItem(item: StackItem): CheckType {
    let mml: TextNode | MmlNode;
    let c: string;
    let textNode: TextNode;
    if (item.isKind('open') || item.isKind('left')) {
      // @test Negation Left Paren
      return BaseItem.success;
    }
    if (item.isKind('mml') &&
        (NodeUtil.isType(item.First, 'mo') || NodeUtil.isType(item.First, 'mi') ||
         NodeUtil.isType(item.First, 'mtext'))) {
      mml = item.First;
      c = NodeUtil.getText(mml as TextNode);
      if (c.length === 1 && !NodeUtil.getProperty(mml, 'movesupsub') &&
          NodeUtil.getChildren(mml).length === 1) {
        if (this.remap.contains(c)) {
          // @test Negation Simple, Negation Complex
          textNode = this.create('text', this.remap.lookup(c).char) as TextNode;
          NodeUtil.setChild(mml, 0, textNode);
        } else {
          // @test Negation Explicit
          textNode = this.create('text', '\u0338') as TextNode;
          NodeUtil.appendChildren(mml, [textNode]);
        }
        return [[item], true];
      }
    }
    // @test Negation Large
    textNode = this.create('text', '\u29F8') as TextNode;
    const mtextNode = this.create('node', 'mtext', [], {}, textNode);
    const paddedNode = this.create('node', 'mpadded', [mtextNode], {width: 0});
    mml = this.create('node', 'TeXAtom', [paddedNode], {texClass: TEXCLASS.REL});
    return [[mml, item], true];
  }
}

/**
 * A StackItem that removes an mspace that follows it (for \nonscript).
 */
export class NonscriptItem extends BaseItem {

  /**
   * @override
   */
  public get kind() {
    return 'nonscript';
  }

  /**
   * @override
   */
  public checkItem(item: StackItem): CheckType {
    //
    //  Check if the next item is an mspace (or an mspace in an mstyle) and remove it.
    //
    if (item.isKind('mml') && item.Size() === 1) {
      let mml = item.First;
      //
      //  Space macros like \, are wrapped with an mstyle to set scriptlevel="0"
      //    (so size is independent of level), we look at the contents of the mstyle for the mspace.
      //
      if (mml.isKind('mstyle') && mml.notParent) {
        mml = NodeUtil.getChildren(NodeUtil.getChildren(mml)[0])[0];
      }
      if (mml.isKind('mspace')) {
        //
        //  If the space is in an mstyle, wrap it in an mrow so we can test its scriptlevel
        //    in the post-filter (the mrow will be removed in the filter).  We can't test
        //    the mstyle's scriptlevel, since it is ecxplicitly setting it to 0.
        //
        if (mml !== item.First) {
          const mrow = this.create('node', 'mrow', [item.Pop()]);
          item.Push(mrow);
        }
        //
        //  Save the mspace for later post-processing.
        //
        this.factory.configuration.addNode('nonscript', item.First);
      }
    }
    return [[item], true];
  }
}

/**
 * Item indicating a dots command has been encountered.
 */
export class DotsItem extends BaseItem {

  /**
   * @override
   */
  public get kind() {
    return 'dots';
  }

  /**
   * @override
   */
  public checkItem(item: StackItem): CheckType {
    if (item.isKind('open') || item.isKind('left')) {
      return BaseItem.success;
    }
    let dots = this.getProperty('ldots') as MmlNode;
    let top = item.First;
    // @test Operator Dots
    if (item.isKind('mml') && NodeUtil.isEmbellished(top)) {
      const tclass = NodeUtil.getTexClass(NodeUtil.getCoreMO(top));
      if (tclass === TEXCLASS.BIN || tclass === TEXCLASS.REL) {
        dots = this.getProperty('cdots') as MmlNode;
      }
    }
    return [[dots, item], true];
  }
}


/**
 * Item indicating an array is assembled. It collates cells, rows and
 * information about column/row separator and framing lines.
 */
export class ArrayItem extends BaseItem {

  /**
   * The table as a list of rows.
   * @type {MmlNode[]}
   */
  public table: MmlNode[] = [];

  /**
   * The current row as a list of cells.
   * @type {MmlNode[]}
   */
  public row: MmlNode[] = [];

  /**
   * Frame specification as a list of strings.
   * @type {string[]}
   */
  public frame: string[] = [];

  /**
   * Hfill value.
   * @type {number[]}
   */
  public hfill: number[] = [];

  /**
   * Properties for special array definitions.
   * @type {{[key: string]: string|number|boolean}}
   */
  public arraydef: {[key: string]: string | number | boolean} = {};

  /**
   * True if separators are dashed.
   * @type {boolean}
   */
  public dashed: boolean = false;

  /**
   * @override
   */
  public get kind() {
    return 'array';
  }


  /**
   * @override
   */
  get isOpen() {
    return true;
  }

  /**
   * @override
   */
  get copyEnv() {
    return false;
  }

  /**
   * @override
   */
  public checkItem(item: StackItem): CheckType {
    // @test Array Single
    if (item.isClose && !item.isKind('over')) {
      // @test Array Single
      if (item.getProperty('isEntry')) {
        // @test Array dashed column, Array solid column
        this.EndEntry();
        this.clearEnv();
        return BaseItem.fail;
      }
      if (item.getProperty('isCR')) {
        // @test Enclosed bottom
        this.EndEntry();
        this.EndRow();
        this.clearEnv();
        return BaseItem.fail;
      }
      this.EndTable();
      this.clearEnv();
      let newItem = this.factory.create('mml', this.createMml());
      if (this.getProperty('requireClose')) {
        // @test: Label
        if (item.isKind('close')) {
          // @test: Label
          return [[newItem], true];
        }
        // @test MissingCloseBrace2
        throw new TexError('MissingCloseBrace', 'Missing close brace');
      }
      return [[newItem, item], true];
    }
    return super.checkItem(item);
  }

  /**
   * Create the MathML representation of the table.
   *
   * @return {MmlNode}
   */
  public createMml(): MmlNode {
    const scriptlevel = this.arraydef['scriptlevel'];
    delete this.arraydef['scriptlevel'];
    let mml = this.create('node', 'mtable', this.table, this.arraydef);
    if (scriptlevel) {
      mml.setProperty('scriptlevel', scriptlevel);
    }
    if (this.frame.length === 4) {
      // @test Enclosed frame solid, Enclosed frame dashed
      NodeUtil.setAttribute(mml, 'frame', this.dashed ? 'dashed' : 'solid');
    } else if (this.frame.length) {
      // @test Enclosed left right
      if (this.arraydef['rowlines']) {
        // @test Enclosed dashed row, Enclosed solid row,
        this.arraydef['rowlines'] =
          (this.arraydef['rowlines'] as string).replace(/none( none)+$/, 'none');
      }
      // @test Enclosed left right
      NodeUtil.setAttribute(mml, 'frame', '');
      mml = this.create('node', 'menclose', [mml], {notation: this.frame.join(' ')});
      if ((this.arraydef['columnlines'] || 'none') !== 'none' ||
          (this.arraydef['rowlines'] || 'none') !== 'none') {
        // @test Enclosed dashed row, Enclosed solid row
        // @test Enclosed dashed column, Enclosed solid column
        NodeUtil.setAttribute(mml, 'data-padding', 0);
      }
    }
    if (this.getProperty('open') || this.getProperty('close')) {
      // @test Cross Product Formula
      mml = ParseUtil.fenced(this.factory.configuration,
                             this.getProperty('open') as string, mml,
                             this.getProperty('close') as string);
    }
    return mml;
  }

  /**
   * Finishes a single cell of the array.
   */
  public EndEntry() {
    // @test Array1, Array2
    const mtd = this.create('node', 'mtd', this.nodes);
    if (this.hfill.length) {
      if (this.hfill[0] === 0) {
        NodeUtil.setAttribute(mtd, 'columnalign', 'right');
      }
      if (this.hfill[this.hfill.length - 1] === this.Size()) {
        NodeUtil.setAttribute(
          mtd, 'columnalign',
          NodeUtil.getAttribute(mtd, 'columnalign') ? 'center' : 'left');
      }
    }
    this.row.push(mtd);
    this.Clear();
    this.hfill = [];
  }


  /**
   * Finishes a single row of the array.
   */
  public EndRow() {
    let node: MmlNode;
    if (this.getProperty('isNumbered') && this.row.length === 3) {
      // @test Label, Matrix Numbered
      this.row.unshift(this.row.pop());  // move equation number to first
      // position
      node = this.create('node', 'mlabeledtr', this.row);
    } else {
      // @test Array1, Array2
      node = this.create('node', 'mtr', this.row);
    }
    this.table.push(node);
    this.row = [];
  }


  /**
   * Finishes the table layout.
   */
  public EndTable() {
    if (this.Size() || this.row.length) {
      this.EndEntry();
      this.EndRow();
    }
    this.checkLines();
  }


  /**
   * Finishes line layout if not already given.
   */
  public checkLines() {
    if (this.arraydef['rowlines']) {
      const lines = (this.arraydef['rowlines'] as string).split(/ /);
      if (lines.length === this.table.length) {
        this.frame.push('bottom');
        lines.pop();
        this.arraydef['rowlines'] = lines.join(' ');
      } else if (lines.length < this.table.length - 1) {
        this.arraydef['rowlines'] += ' none';
      }
    }
    if (this.getProperty('rowspacing')) {
      const rows = (this.arraydef['rowspacing'] as string).split(/ /);
      while (rows.length < this.table.length) {
        rows.push(this.getProperty('rowspacing') + 'em');
      }
      this.arraydef['rowspacing'] = rows.join(' ');
    }
  }

  /**
   * Adds a row-spacing to the current row (padding out the rowspacing if needed to get there).
   *
   * @param {string} spacing   The rowspacing to use for the current row.
   */
  public addRowSpacing(spacing: string) {
    if (this.arraydef['rowspacing']) {
      const rows = (this.arraydef['rowspacing'] as string).split(/ /);
      if (!this.getProperty('rowspacing')) {
        // @test Array Custom Linebreak
        let dimem = ParseUtil.dimen2em(rows[0]);
        this.setProperty('rowspacing', dimem);
      }
      const rowspacing = this.getProperty('rowspacing') as number;
      while (rows.length < this.table.length) {
        rows.push(ParseUtil.Em(rowspacing));
      }
      rows[this.table.length - 1] = ParseUtil.Em(
        Math.max(0, rowspacing + ParseUtil.dimen2em(spacing)));
      this.arraydef['rowspacing'] = rows.join(' ');
    }
  }

}


/**
 * Item dealing with equation arrays as a special case of arrays. Handles
 * tagging information according to the given tagging style.
 */
export class EqnArrayItem extends ArrayItem {

  /**
   * The length of the longest row.
   */
  public maxrow: number = 0;

  /**
   * @override
   */
  constructor(factory: any, ...args: any[]) {
    super(factory);
    this.factory.configuration.tags.start(args[0], args[2], args[1]);
  }


  /**
   * @override
   */
  get kind() {
    return 'eqnarray';
  }


  /**
   * @override
   */
  public EndEntry() {
    // @test Cubic Binomial
    if (this.row.length) {
      ParseUtil.fixInitialMO(this.factory.configuration, this.nodes);
    }
    const node = this.create('node', 'mtd', this.nodes);
    this.row.push(node);
    this.Clear();
  }

  /**
   * @override
   */
  public EndRow() {
    if (this.row.length > this.maxrow) {
      this.maxrow = this.row.length;
    }
    // @test Cubic Binomial
    let mtr = 'mtr';
    let tag = this.factory.configuration.tags.getTag();
    if (tag) {
      this.row = [tag].concat(this.row);
      mtr = 'mlabeledtr';
    }
    this.factory.configuration.tags.clearTag();
    const node = this.create('node', mtr, this.row);
    this.table.push(node);
    this.row = [];
  }

  /**
   * @override
   */
  public EndTable() {
    // @test Cubic Binomial
    super.EndTable();
    this.factory.configuration.tags.end();
    //
    // Repeat the column align and width specifications
    //   to match the number of columns
    //
    this.extendArray('columnalign', this.maxrow);
    this.extendArray('columnwidth', this.maxrow);
    this.extendArray('columnspacing', this.maxrow - 1);
  }

  /**
   * Extend a column specification to include a repeating set of values
   *   so that it has enough to match the maximum row length.
   */
  protected extendArray(name: string, max: number) {
    if (!this.arraydef[name]) return;
    const repeat = (this.arraydef[name] as string).split(/ /);
    const columns = [...repeat];
    if (columns.length > 1) {
      while (columns.length < max) {
        columns.push(...repeat);
      }
      this.arraydef[name] = columns.slice(0, max).join(' ');
    }
  }
}


/**
 * Item dealing with simple equation environments.  Handles tagging information
 * according to the given tagging style.
 */
export class EquationItem extends BaseItem {

  /**
   * @override
   */
  constructor(factory: any, ...args: any[]) {
    super(factory);
    this.factory.configuration.tags.start('equation', true, args[0]);
  }


  /**
   * @override
   */
  get kind() {
    return 'equation';
  }

  /**
   * @override
   */
  get isOpen() {
    return true;
  }

  /**
   * @override
   */
  public checkItem(item: StackItem): CheckType {
    if (item.isKind('end')) {
      let mml = this.toMml();
      let tag = this.factory.configuration.tags.getTag();
      this.factory.configuration.tags.end();
      return [[tag ? this.factory.configuration.tags.enTag(mml, tag) : mml, item], true];
    }
    if (item.isKind('stop')) {
      // @test EnvMissingEnd Equation
      throw new TexError('EnvMissingEnd', 'Missing \\end{%1}', this.getName());
    }
    return super.checkItem(item);
  }

}
