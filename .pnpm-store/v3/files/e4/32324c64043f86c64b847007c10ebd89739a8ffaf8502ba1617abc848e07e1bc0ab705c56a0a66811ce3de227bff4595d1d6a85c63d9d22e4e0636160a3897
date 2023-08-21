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
 * @fileoverview Class for generating tags, references, etc.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import TexParser from './TexParser.js';
import {MmlNode} from '../../core/MmlTree/MmlNode.js';
import {MathItem} from '../../core/MathItem.js';
import {EnvList} from './StackItem.js';
import ParseOptions from './ParseOptions.js';
import {OptionList} from '../../util/Options.js';


/**
 *  Simple class for label objects.
 */
export class Label {

  /**
   * @constructor
   * @param {string=} tag The tag that's displayed.
   * @param {string=} id The id that serves as reference.
   */
  constructor(public tag: string = '???', public id: string = '') {}
}


/**
 * A simple class for keeping track of tag information.
 */
export class TagInfo {

  /**
   * @constructor
   * @param {string} env The environment name (e.g., align).
   * @param {boolean} taggable Environment supports tags (e.g., align* does, but
   *     split does not.)
   * @param {boolean} defaultTags Environment is tagged by default (e.g., align
   *     is, but align* is not).
   * @param {string} tag The tag name (e.g., 1).
   * @param {string} tagId The unique id for that tag (e.g., mjx-eqn:1).
   * @param {string} tagFormat The formatted tag (e.g., "(1)").
   * @param {boolean} noTag A no tagging command has been set (e.g., \notag,
   *     \nonumber).
   * @param {string} labelId The label referring to the tag.
   */
  constructor(readonly env: string = '',
              readonly taggable: boolean = false,
              readonly defaultTags: boolean = false,
              public tag: string = null,
              public tagId: string = '',
              public tagFormat: string = '',
              public noTag: boolean = false,
              public labelId: string = '') {}

}


export interface Tags {

  /**
   * The global configurations in which the parsing takes place.
   * @type {ParseOptions}
   */
  configuration: ParseOptions;

  /**
   * IDs used in this equation.
   * @type {Object.<boolean>}
   */
  ids: {[key: string]: boolean};

  /**
   * IDs used in previous equations.
   * @type {Object.<boolean>}
   */
  allIds: {[key: string]: boolean};

  /**
   * Labels in the current equation.
   * @type {Object.<Label>}
   */
  labels: {[key: string]: Label};

  /**
   * Labels in previous equations.
   * @type {Object.<Label>}
   */
  allLabels: {[key: string]: Label};

  /**
   * The label to use for the next tag.
   * @type {string}
   */
  label: string;

  /**
   * True if the equation contains an undefined label and must be reprocessed later.
   * @type {boolean}
   */
  redo: boolean;

  /**
   * True when recompiling to update undefined references
   * @type {boolean}
   */
  refUpdate: boolean;

  /**
   * The environment that is currently tagged.
   * @type {string}
   */
  env: string;

  /**
   * The currently active tag.
   * @type {TagInfo}
   */
  currentTag: TagInfo;

  /**
   * How to format tags.
   * @param {string} tag The tag string.
   * @return {string} The formatted numbered tag.
   */
  formatTag(tag: string): string;

  /**
   * How to format URLs for references.
   * @param {string} id The reference id.
   * @param {string} base The base URL in the reference.
   * @return {}
   */
  formatUrl(id: string, base: string): string;

  /**
   * Set the tag automatically, by incrementing equation number.
   */
  autoTag(): void;

  /**
   * @return {MmlNode|void} Generates and returns the tag node.
   */
  getTag(): MmlNode | void;

  /**
   * Clears tagging information.
   */
  clearTag(): void;

  /**
   * Resets the tag structure after an expression has been typeset.
   */
  resetTag(): void;

  /**
   * Fully resets the tag structure, in particular all the tagging and label
   * history.
   * @param {number} offset A new offset value to start counting ids from.
   */
  reset(offset?: number): void;

  /**
   * Initialise tagging for a MathItem
   * (clear equation-specific labels and ids, set counter
   * and check for recompile)
   * @param {MathItem} math   The MathItem for the current equation
   */
    startEquation(math: MathItem<any, any, any>): void;

  /**
   * Move equation-specific labels and ids to global ones,
   * save the counter, and mark the MathItem for redos
   */
    finishEquation(math: MathItem<any, any, any>): void;

  /**
   * Finalizes tag creation.
   * @param {MmlNode} node
   * @param {EnvList} env List of environment properties.
   * @return {MmlNode} The newly created tag.
   */
  finalize(node: MmlNode, env: EnvList): MmlNode;

  /**
   * Starts tagging on a given environment.
   * @param {string} env The name of the environment.
   * @param {boolean} taggable True if taggable.
   * @param {boolean} defaultTags True if tagged by default.
   */
  start(env: string, taggable: boolean, defaultTags: boolean): void;

  /**
   * End tagging.
   */
  end(): void;

  /**
   * Computes the next tag.
   * @param {string} tag The tag content.
   * @param {boolean} noFormat True if tag should not be formatted.
   */
  tag(tag: string, noFormat: boolean): void;

  /**
   * Call an explicit no tag.
   */
  notag(): void;

  /**
   * Entag an element by creating a table around it.
   * @param {MmlNode} node The node to be tagged.
   * @param {MmlNode} tag The tag node.
   * @return {MmlNode} The table node containing the original node and tag.
   */
  enTag(node: MmlNode, tag: MmlNode): MmlNode;
}


export class AbstractTags implements Tags {

  /**
   * Current equation number.
   * @type {number}
   */
  protected counter: number = 0;

  /**
   * Equation number as equation begins.
   * @type {number}
   */
  protected allCounter: number = 0;

  /**
   * @override
   */
  public configuration: ParseOptions = null;

  /**
   * @override
   */
  public ids: {[key: string]: boolean} = {};

  /**
   * @override
   */
  public allIds: {[key: string]: boolean} = {};

  /**
   * @override
   */
  public labels: {[key: string]: Label} = {};

  /**
   * @override
   */
  public allLabels: {[key: string]: Label} = {};

  /**
   * @override
   */
  public redo: boolean = false;

  /**
   * @override
   */
  public refUpdate: boolean = false;

  /**
   * @override
   */
  public currentTag: TagInfo = new TagInfo();


  /**
   * Chronology of all previous tags, in case we need to look something up in
   * the finalize method.
   * @type {TagInfo[]}
   */
  protected history: TagInfo[] = [];

  private stack: TagInfo[] = [];

  /**
   * @override
   */
  public start(env: string, taggable: boolean, defaultTags: boolean) {
    if (this.currentTag) {
      this.stack.push(this.currentTag);
    }
    this.currentTag = new TagInfo(env, taggable, defaultTags);
  }

  public get env() {
    return this.currentTag.env;
  }


  /**
   * @override
   */
  public end() {
    this.history.push(this.currentTag);
    this.currentTag = this.stack.pop();
  }


  /**
   * @override
   */
  public tag(tag: string, noFormat: boolean) {
    this.currentTag.tag = tag;
    this.currentTag.tagFormat = noFormat ? tag : this.formatTag(tag);
    this.currentTag.noTag = false;
  }


  /**
   * @override
   */
  public notag() {
    this.tag('', true);
    this.currentTag.noTag = true;
  }

  protected get noTag(): boolean {
    return this.currentTag.noTag;
  }

  public set label(label: string) {
    this.currentTag.labelId = label;
  }

  public get label() {
    return this.currentTag.labelId;
  }

  /**
   * @override
   */
  public formatUrl(id: string, base: string) {
    return base + '#' + encodeURIComponent(id);
  }

  /**
   * @override
   */
  public formatTag(tag: string) {
    return '(' + tag + ')';
  }

  /**
   * How to format ids for labelling equations.
   * @param {string} id The unique part of the id (e.g., label or number).
   * @return {string} The formatted id.
   */
  protected formatId(id: string): string {
    return 'mjx-eqn:' + id.replace(/\s/g, '_');
  }

  /**
   * How to format numbers in tags.
   * @param {number} n The tag number.
   * @return {string} The formatted number.
   */
  protected formatNumber(n: number): string {
    return n.toString();
  }

  // Tag handling functions.
  /**
   * @override
   */
  public autoTag() {
    if (this.currentTag.tag == null) {
      this.counter++;
      this.tag(this.formatNumber(this.counter), false);
    }
  }


  /**
   * @override
   */
  public clearTag() {
    this.label = '';
    this.tag(null, true);
    this.currentTag.tagId = '';
  }


  /**
   * @override
   */
  public getTag(force: boolean = false) {
    if (force) {
      this.autoTag();
      return this.makeTag();
    }
    const ct = this.currentTag;
    if (ct.taggable && !ct.noTag) {
      if (ct.defaultTags) {
        this.autoTag();
      }
      if (ct.tag) {
        return this.makeTag();
      }
    }
    return null;
  }


  /**
   * @override
   */
  public resetTag() {
    this.history = [];
    this.redo = false;
    this.refUpdate = false;
    this.clearTag();
  }

  /**
   * @override
   */
  public reset(offset: number = 0) {
    this.resetTag();
    this.counter = this.allCounter = offset;
    this.allLabels = {};
    this.allIds = {};
  }

  /**
   * @override
   */
  public startEquation(math: MathItem<any, any, any>) {
    this.history = [];
    this.stack = [];
    this.clearTag();
    this.currentTag = new TagInfo('', undefined, undefined);
    this.labels = {};
    this.ids = {};
    this.counter = this.allCounter;
    this.redo = false;
    const recompile = math.inputData.recompile;
    if (recompile) {
      this.refUpdate = true;
      this.counter = recompile.counter;
    }
  }

  /**
   * @override
   */
  public finishEquation(math: MathItem<any, any, any>) {
    if (this.redo) {
      math.inputData.recompile = {
        state: math.state(),
        counter: this.allCounter
      };
    }
    if (!this.refUpdate) {
      this.allCounter = this.counter;
    }
    Object.assign(this.allIds, this.ids);
    Object.assign(this.allLabels, this.labels);
  }

  /**
   * @override
   */
  public finalize(node: MmlNode, env: EnvList): MmlNode {
    if (!env.display || this.currentTag.env ||
        this.currentTag.tag == null) {
      return node;
    }
    let tag = this.makeTag();
    let table = this.enTag(node, tag);
    return table;
  }

  /**
   * @override
   */
  public enTag = function(node: MmlNode, tag: MmlNode): MmlNode {
    let nf = this.configuration.nodeFactory;
    let cell = nf.create('node', 'mtd', [node]);
    let row = nf.create('node', 'mlabeledtr', [tag, cell]);
    let table = nf.create('node', 'mtable', [row], {
      side: this.configuration.options['tagSide'],
      minlabelspacing: this.configuration.options['tagIndent'],
      displaystyle: true
    });
    return table;
  };


  /**
   * Sets the tag id.
   */
  private makeId() {
    this.currentTag.tagId = this.formatId(
      this.configuration.options['useLabelIds'] ?
        (this.label || this.currentTag.tag) : this.currentTag.tag);
  }


  /**
   * @return {MmlNode} The actual tag node as an mtd.
   */
  private makeTag(): MmlNode {
    this.makeId();
    if (this.label) {
      this.labels[this.label] = new Label(this.currentTag.tag, this.currentTag.tagId);
    }
    let mml = new TexParser('\\text{' + this.currentTag.tagFormat + '}', {},
                            this.configuration).mml();
    return this.configuration.nodeFactory.create('node', 'mtd', [mml],
                                                 {id: this.currentTag.tagId});
  }

}


/**
 * No tags, except where explicitly set.
 * @constructor
 * @extends {AbstractTags}
 */
export class NoTags extends AbstractTags {

  /**
   * @override
   */
  public autoTag() {}

  /**
   * @override
   */
  public getTag() {
    return !this.currentTag.tag ? null : super.getTag();
  }

}


/**
 * Tags every display formula. Exceptions are: Environments that explicitly
 * disallow tags, e.g., equation*.
 * @constructor
 * @extends {AbstractTags}
 */
export class AllTags extends AbstractTags {

  /**
   * @override
   */
  public finalize(node: MmlNode, env: EnvList) {
    if (!env.display || this.history.find(
      function(x: TagInfo) { return x.taggable; })) {
      return node;
    }
    let tag = this.getTag(true);
    return this.enTag(node, tag);
  }

}


/**
 * Class interface for factory.
 * @interface
 */
export interface TagsClass {
  new (): Tags;
}


export namespace TagsFactory {

  let tagsMapping = new Map<string, TagsClass>([
    ['none', NoTags],
    ['all', AllTags]
  ]);

  let defaultTags = 'none';

  /**
   * The default options for tagging
   * @type {OptionList}
   */
  export let OPTIONS: OptionList = {
    // Tagging style, used to be autonumber in v2.
    tags: defaultTags,
    // This specifies the side on which \tag{} macros will place the tags.
    // Set to 'left' to place on the left-hand side.
    tagSide: 'right',
    // This is the amount of indentation (from right or left) for the tags.
    tagIndent: '0.8em',
    // make element ID's use \label name rather than equation number
    // MJ puts in an equation prefix: mjx-eqn
    // When true it uses the label name XXX as mjx-eqn:XXX
    // If false it uses the actual number N that is displayed: mjx-eqn:N
    useLabelIds: true,
    // Set to true in order to prevent error messages for duplicate label ids
    ignoreDuplicateLabels: false
  };


  /**
   * Add a tagging object.
   * @param {string} name Name of the tagging object.
   * @param {TagsClass} constr The class of the Tagging object.
   */
  export let add = function(name: string, constr: TagsClass) {
    tagsMapping.set(name, constr);
  };


  /**
   * Adds a list of tagging objects to the factory.
   * @param {{[name: string]: TagsClass}} tags The list of tagging objects.
   */
  export let addTags = function(tags: {[name: string]: TagsClass}) {
    for (const key of Object.keys(tags)) {
      TagsFactory.add(key, tags[key]);
    }
  };


  /**
   * Creates a new tagging object.
   * @param {string} name The name of the tagging object.
   * @return {Tags} The newly created object.
   */
  export let create = function(name: string): Tags {
    let constr = tagsMapping.get(name) || tagsMapping.get(defaultTags);
    if (!constr) {
        throw Error('Unknown tags class');
    }
    return new constr();
  };


  /**
   * Set the name of the default tagging object.
   * @param {string} name The default.
   */
  export let setDefault = function(name: string) {
    defaultTags = name;
  };


  /**
   * @return {Tags} The default tagging object.
   */
  export let getDefault = function(): Tags {
    return TagsFactory.create(defaultTags);
  };

}
