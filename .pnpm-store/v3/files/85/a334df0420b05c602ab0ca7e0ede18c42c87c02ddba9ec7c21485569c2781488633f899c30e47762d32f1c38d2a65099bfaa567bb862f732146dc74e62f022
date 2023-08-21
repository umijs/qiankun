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
 * @fileoverview  Implements a lite CssStyleDeclaration replacement
 *                (very limited in scope)
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

/**
 * An object contining name: value pairs
 */
export type StyleList = {[name: string]: string};

/**
 * Data for how to map a combined style (like border) to its children
 */
export type connection = {
  children: string[],               // suffix names to add to the base name
  split: (name: string) => void,    // function to split the value for the children
  combine: (name: string) => void   // function to combine the child values when one changes
};

/**
 * A collection of connections
 */
export type connections = {[name: string]: connection};

/*********************************************************/
/**
 * Some common children arrays
 */
const TRBL = ['top', 'right', 'bottom', 'left'];
const WSC = ['width', 'style', 'color'];

/**
 * Split a style at spaces (taking quotation marks and commas into account)
 *
 * @param {string} text  The combined styles to be split at spaces
 * @return {string[]}    Array of parts of the style (separated by spaces)
 */
function splitSpaces(text: string): string[] {
  const parts = text.split(/((?:'[^']*'|"[^"]*"|,[\s\n]|[^\s\n])*)/g);
  const split = [] as string[];
  while (parts.length > 1) {
    parts.shift();
    split.push(parts.shift());
  }
  return split;
}

/*********************************************************/
/**
 * Split a top-right-bottom-left group into its parts
 * Format:
 *    x           all are the same value
 *    x y         same as x y x y
 *    x y z       same as x y z y
 *    x y z w     each specified
 *
 * @param {string} name   The style to be processed
 */

function splitTRBL(name: string) {
  const parts = splitSpaces(this.styles[name]);
  if (parts.length === 0) {
    parts.push('');
  }
  if (parts.length === 1) {
    parts.push(parts[0]);
  }
  if (parts.length === 2) {
    parts.push(parts[0]);
  }
  if (parts.length === 3) {
    parts.push(parts[1]);
  }
  for (const child of Styles.connect[name].children) {
    this.setStyle(this.childName(name, child), parts.shift());
  }
}

/**
 * Combine top-right-bottom-left into one entry
 * (removing unneeded values)
 *
 * @param {string} name   The style to be processed
 */
function combineTRBL(name: string) {
  const children = Styles.connect[name].children;
  const parts = [] as string[];
  for (const child of children) {
    const part = this.styles[name + '-' + child];
    if (!part) {
      delete this.styles[name];
      return;
    }
    parts.push(part);
  }
  if (parts[3] === parts[1]) {
    parts.pop();
    if (parts[2] === parts[0]) {
      parts.pop();
      if (parts[1] === parts[0]) {
        parts.pop();
      }
    }
  }
  this.styles[name] = parts.join(' ');
}

/*********************************************************/
/**
 * Use the same value for all children
 *
 * @param {string} name   The style to be processed
 */
function splitSame(name: string) {
  for (const child of Styles.connect[name].children) {
    this.setStyle(this.childName(name, child), this.styles[name]);
  }
}

/**
 * Check that all children have the same values and
 * if so, set the parent to that value
 *
 * @param {string} name   The style to be processed
 */
function combineSame(name: string) {
  const children = [...Styles.connect[name].children];
  const value = this.styles[this.childName(name, children.shift())];
  for (const child of children) {
    if (this.styles[this.childName(name, child)] !== value) {
      delete this.styles[name];
      return;
    }
  }
  this.styles[name] = value;
}

/*********************************************************/
/**
 * Patterns for the parts of a boarder
 */
const BORDER: {[name: string]: RegExp} = {
  width: /^(?:[\d.]+(?:[a-z]+)|thin|medium|thick|inherit|initial|unset)$/,
  style: /^(?:none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset|inherit|initial|unset)$/
};

/**
 * Split a width-style-color border definition
 *
 * @param {string} name   The style to be processed
 */
function splitWSC(name: string) {
  let parts = {width: '', style: '', color: ''} as StyleList;
  for (const part of splitSpaces(this.styles[name])) {
    if (part.match(BORDER.width) && parts.width === '') {
      parts.width = part;
    } else if (part.match(BORDER.style) && parts.style === '') {
      parts.style = part;
    } else {
      parts.color = part;
    }
  }
  for (const child of Styles.connect[name].children) {
    this.setStyle(this.childName(name, child), parts[child]);
  }
}

/**
 * Combine with-style-color border definition from children
 *
 * @param {string} name   The style to be processed
 */
function combineWSC(name: string) {
  const parts = [] as string[];
  for (const child of Styles.connect[name].children) {
    const value = this.styles[this.childName(name, child)];
    if (value) {
      parts.push(value);
    }
  }
  if (parts.length) {
    this.styles[name] = parts.join(' ');
  } else {
    delete this.styles[name];
  }
}

/*********************************************************/
/**
 * Patterns for the parts of a font declaration
 */
const FONT: {[name: string]: RegExp} = {
  style: /^(?:normal|italic|oblique|inherit|initial|unset)$/,
  variant: new RegExp('^(?:' +
                      ['normal|none',
                       'inherit|initial|unset',
                       'common-ligatures|no-common-ligatures',
                       'discretionary-ligatures|no-discretionary-ligatures',
                       'historical-ligatures|no-historical-ligatures',
                       'contextual|no-contextual',
                       '(?:stylistic|character-variant|swash|ornaments|annotation)\\([^)]*\\)',
                       'small-caps|all-small-caps|petite-caps|all-petite-caps|unicase|titling-caps',
                       'lining-nums|oldstyle-nums|proportional-nums|tabular-nums',
                       'diagonal-fractions|stacked-fractions',
                       'ordinal|slashed-zero',
                       'jis78|jis83|jis90|jis04|simplified|traditional',
                       'full-width|proportional-width',
                       'ruby'].join('|') + ')$'),
  weight: /^(?:normal|bold|bolder|lighter|[1-9]00|inherit|initial|unset)$/,
  stretch: new RegExp('^(?:' +
                      ['normal',
                       '(?:(?:ultra|extra|semi)-)?condensed',
                       '(?:(?:semi|extra|ulta)-)?expanded',
                       'inherit|initial|unset']. join('|') + ')$'),
  size: new RegExp('^(?:' +
                   ['xx-small|x-small|small|medium|large|x-large|xx-large|larger|smaller',
                    '[\d.]+%|[\d.]+[a-z]+',
                    'inherit|initial|unset'].join('|') + ')' +
                   '(?:\/(?:normal|[\d.\+](?:%|[a-z]+)?))?$')
};

/**
 * Split a font declaration into is parts (not perfect but good enough for now)
 *
 * @param {string} name   The style to be processed
 */
function splitFont(name: string) {
  const parts = splitSpaces(this.styles[name]);
  //
  //  The parts found (array means can be more than one word)
  //
  const value = {
    style: '', variant: [], weight: '', stretch: '',
    size: '', family: '', 'line-height': ''
  } as {[name: string]: string | string[]};
  for (const part of parts) {
    value.family = part; // assume it is family unless otherwise (family must be present)
    for (const name of Object.keys(FONT)) {
      if ((Array.isArray(value[name]) || value[name] === '') && part.match(FONT[name])) {
        if (name === 'size') {
          //
          // Handle size/line-height
          //
          const [size, height] = part.split(/\//);
          value[name] = size;
          if (height) {
            value['line-height'] = height;
          }
        } else if (value.size === '') {
          //
          // style, weight, variant, stretch must appear before size
          //
          if (Array.isArray(value[name])) {
            (value[name] as string[]).push(part);
          } else {
            value[name] = part;
          }
        }
      }
    }
  }
  saveFontParts(name, value);
  delete this.styles[name]; // only use the parts, not the font declaration itself
}

/**
 * @param {string} name   The style to be processed
 * @param {{[name: string]: string | string[]}} value  The list of parts detected above
 */
function saveFontParts(name: string, value: {[name: string]: string | string[]}) {
  for (const child of Styles.connect[name].children) {
    const cname = this.childName(name, child);
    if (Array.isArray(value[child])) {
      const values = value[child] as string[];
      if (values.length) {
        this.styles[cname] = values.join(' ');
      }
    } else  if (value[child] !== '') {
      this.styles[cname] = value[child];
    }
  }
}

/**
 * Combine font parts into one (we don't actually do that)
 */
function combineFont(_name: string) {}

/*********************************************************/
/**
 * Implements the Styles object (lite version of CssStyleDeclaration)
 */
export class Styles {

  /**
   * Patterns for style values and comments
   */
  public static pattern: {[name: string]: RegExp} = {
    style: /([-a-z]+)[\s\n]*:[\s\n]*((?:'[^']*'|"[^"]*"|\n|.)*?)[\s\n]*(?:;|$)/g,
    comment: /\/\*[^]*?\*\//g
  };

  /**
   * The mapping of parents to children, and how to split and combine them
   */
  public static connect: connections = {
    padding: {
      children: TRBL,
      split: splitTRBL,
      combine: combineTRBL
    },

    border: {
      children: TRBL,
      split: splitSame,
      combine: combineSame
    },
    'border-top': {
      children: WSC,
      split: splitWSC,
      combine: combineWSC
    },
    'border-right': {
      children: WSC,
      split: splitWSC,
      combine: combineWSC
    },
    'border-bottom': {
      children: WSC,
      split: splitWSC,
      combine: combineWSC
    },
    'border-left': {
      children: WSC,
      split: splitWSC,
      combine: combineWSC
    },
    'border-width': {
      children: TRBL,
      split: splitTRBL,
      combine: null      // means its children combine to a different parent
    },
    'border-style': {
      children: TRBL,
      split: splitTRBL,
      combine: null      // means its children combine to a different parent
    },
    'border-color': {
      children: TRBL,
      split: splitTRBL,
      combine: null      // means its children combine to a different parent
    },

    font: {
      children: ['style', 'variant', 'weight', 'stretch', 'line-height', 'size', 'family'],
      split: splitFont,
      combine: combineFont
    }
  };

  /**
   * The list of styles defined for this declaration
   */
  protected styles: StyleList;

  /**
   * @param {string} cssText  The initial definition for the style
   * @constructor
   */
  constructor(cssText: string = '') {
    this.parse(cssText);
  }

  /**
   * @return {string}  The CSS string for the styles currently defined
   */
  public get cssText(): string {
    const styles = [] as string[];
    for (const name of Object.keys(this.styles)) {
      const parent = this.parentName(name);
      if (!this.styles[parent]) {
        styles.push(name + ': ' + this.styles[name] + ';');
      }
    }
    return styles.join(' ');
  }

  /**
   * @param {string} name   The name of the style to set
   * @param {string|number|boolean} value The value to set it to
   */
  public set(name: string, value: string | number | boolean) {
    name = this.normalizeName(name);
    this.setStyle(name, value as string);
    //
    // If there is no combine function ,the children combine to
    // a separate parent (e.g., border-width sets border-top-width, etc.
    // and combines to border-top)
    //
    if (Styles.connect[name] && !Styles.connect[name].combine) {
      this.combineChildren(name);
      delete this.styles[name];
    }
    //
    // If we just changed a child, we need to try to combine
    // it with its parent's other children
    //
    while (name.match(/-/)) {
      name = this.parentName(name);
      if (!Styles.connect[name]) break;
      Styles.connect[name].combine.call(this, name);
    }
  }

  /**
   * @param {string} name  The name of the style to get
   * @return {string}      The value of the style (or empty string if not defined)
   */
  public get(name: string): string {
    name = this.normalizeName(name);
    return (this.styles.hasOwnProperty(name) ? this.styles[name] : '');
  }

  /**
   * @param {string} name   The name of the style to set (without causing parent updates)
   * @param {string} value  The value to set it to
   */
  protected setStyle(name: string, value: string) {
    this.styles[name] = value;
    if (Styles.connect[name] && Styles.connect[name].children) {
      Styles.connect[name].split.call(this, name);
    }
    if (value === '') {
      delete this.styles[name];
    }
  }

  /**
   * @param {string} name   The name of the style whose parent is to be combined
   */
  protected combineChildren(name: string) {
    const parent = this.parentName(name);
    for (const child of Styles.connect[name].children) {
      const cname = this.childName(parent, child);
      Styles.connect[cname].combine.call(this, cname);
    }
  }

  /**
   * @param {string} name   The name of the style whose parent style is to be found
   * @return {string}       The name of the parent, or '' if none
   */
  protected parentName(name: string): string {
    const parent = name.replace(/-[^-]*$/, '');
    return (name === parent ? '' : parent);
  }

  /**
   * @param {string} name   The name of the parent style
   * @param {string} child  The suffix to be added to the parent
   * @preturn {string}      The combined name
   */
  protected childName(name: string, child: string) {
    //
    // If the child contains a dash, it is already the fill name
    //
    if (child.match(/-/)) {
      return child;
    }
    //
    // For non-combining styles, like border-width, insert
    //   the child name before the find word, e.g., border-top-width
    //
    if (Styles.connect[name] && !Styles.connect[name].combine) {
      child += name.replace(/.*-/, '-');
      name = this.parentName(name);
    }
    return name + '-' + child;
  }

  /**
   * @param {string} name  The name of a style to normalize
   * @return {string}      The name converted from CamelCase to lowercase with dashes
   */
  protected normalizeName(name: string): string {
    return name.replace(/[A-Z]/g, c => '-' + c.toLowerCase());
  }

  /**
   * @param {string} cssText  A style text string to be parsed into separate styles
   *                          (by using this.set(), we get all the sub-styles created
   *                           as well as the merged style shorthands)
   */
  protected parse(cssText: string = '') {
    let PATTERN = (this.constructor as typeof Styles).pattern;
    this.styles = {};
    const parts = cssText.replace(PATTERN.comment, '').split(PATTERN.style);
    while (parts.length > 1) {
      let [space, name, value] = parts.splice(0, 3);
      if (space.match(/[^\s\n]/)) return;
      this.set(name, value);
    }
  }

}
