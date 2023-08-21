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
 * @fileoverview  Implements functions for handling option lists
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */


/*****************************************************************/
/* tslint:disable-next-line:jsdoc-require */
const OBJECT = {}.constructor;

/**
 *  Check if an object is an object literal (as opposed to an instance of a class)
 */
export function isObject(obj: any) {
  return typeof obj === 'object' && obj !== null &&
    (obj.constructor === OBJECT || obj.constructor === Expandable);
}

/*****************************************************************/
/**
 * Generic list of options
 */
export type OptionList = {[name: string]: any};

/*****************************************************************/
/**
 *  Used to append an array to an array in default options
 *  E.g., an option of the form
 *
 *    {
 *      name: {[APPEND]: [1, 2, 3]}
 *    }
 *
 *  where 'name' is an array in the default options would end up with name having its
 *  original value with 1, 2, and 3 appended.
 */
export const APPEND = '[+]';

/**
 *  Used to remove elements from an array in default options
 *  E.g., an option of the form
 *
 *    {
 *      name: {[REMOVE]: [2]}
 *    }
 *
 *  where 'name' is an array in the default options would end up with name having its
 *  original value but with any entry of 2 removed  So if the original value was [1, 2, 3, 2],
 *  then the final value will be [1, 3] instead.
 */
export const REMOVE = '[-]';


/**
 *  Provides options for the option utlities.
 */
export const OPTIONS = {
  invalidOption: 'warn' as ('fatal' | 'warn'),
  /**
   * Function to report messages for invalid options
   *
   * @param {string} message   The message for the invalid parameter.
   * @param {string} key       The invalid key itself.
   */
  optionError: (message: string, _key: string) => {
    if (OPTIONS.invalidOption === 'fatal') {
      throw new Error(message);
    }
    console.warn('MathJax: ' + message);
  }
};


/**
 * A Class to use for options that should not produce warnings if an undefined key is used
 */
export class Expandable {}

/**
 * Produces an instance of Expandable with the given values (to be used in defining options
 * that can use keys that don't have default values).  E.g., default options of the form:
 *
 *  OPTIONS = {
 *     types: expandable({
 *       a: 1,
 *       b: 2
 *     })
 *  }
 *
 *  would allow user options of
 *
 *  {
 *     types: {
 *       c: 3
 *     }
 *  }
 *
 *  without reporting an error.
 */
export function expandable(def: OptionList) {
  return Object.assign(Object.create(Expandable.prototype), def);
}

/*****************************************************************/
/**
 *  Make sure an option is an Array
 */
export function makeArray(x: any): any[] {
  return Array.isArray(x) ? x : [x];
}

/*****************************************************************/
/**
 * Get all keys and symbols from an object
 *
 * @param {Optionlist} def        The object whose keys are to be returned
 * @return {(string | symbol)[]}  The list of keys for the object
 */
export function keys(def: OptionList): (string | symbol)[] {
  if (!def) {
    return [];
  }
  return (Object.keys(def) as (string | symbol)[]).concat(Object.getOwnPropertySymbols(def));
}

/*****************************************************************/
/**
 * Make a deep copy of an object
 *
 * @param {OptionList} def  The object to be copied
 * @return {OptionList}     The copy of the object
 */
export function copy(def: OptionList): OptionList {
  let props: OptionList = {};
  for (const key of keys(def)) {
    let prop = Object.getOwnPropertyDescriptor(def, key);
    let value = prop.value;
    if (Array.isArray(value)) {
      prop.value = insert([], value, false);
    } else if (isObject(value)) {
      prop.value = copy(value);
    }
    if (prop.enumerable) {
      props[key as string] = prop;
    }
  }
  return Object.defineProperties(def.constructor === Expandable ? expandable({}) : {}, props);
}

/*****************************************************************/
/**
 * Insert one object into another (with optional warnings about
 * keys that aren't in the original)
 *
 * @param {OptionList} dst  The option list to merge into
 * @param {OptionList} src  The options to be merged
 * @param {boolean} warn    True if a warning should be issued for a src option that isn't already in dst
 * @return {OptionList}     The modified destination option list (dst)
 */
export function insert(dst: OptionList, src: OptionList, warn: boolean = true): OptionList {
  for (let key of keys(src) as string[]) {
    //
    // Check if the key is valid (i.e., is in the defaults or in an expandable block)
    //
    if (warn && dst[key] === undefined && dst.constructor !== Expandable) {
      if (typeof key === 'symbol') {
        key = (key as symbol).toString();
      }
      OPTIONS.optionError(`Invalid option "${key}" (no default value).`, key);
      continue;
    }
    //
    // Shorthands for the source and destination values
    //
    let sval = src[key], dval = dst[key];
    //
    // If the source is an object literal and the destination exists and is either an
    //   object or a function (so can have properties added to it)...
    //
    if (isObject(sval) && dval !== null &&
        (typeof dval === 'object' || typeof dval === 'function')) {
      const ids = keys(sval);
      //
      // Check for APPEND or REMOVE objects:
      //
      if (
        //
        // If the destination value is an array...
        //
        Array.isArray(dval) &&
          (
            //
            // If there is only one key and it is APPEND or REMOVE and the keys value is an array...
            //
            (ids.length === 1 && (ids[0] === APPEND || ids[0] === REMOVE) && Array.isArray(sval[ids[0]])) ||
              //
              // Or if there are two keys and they are APPEND and REMOVE and both keys' values
              //   are arrays...
              //
              (ids.length === 2 && ids.sort().join(',') === APPEND + ',' + REMOVE &&
               Array.isArray(sval[APPEND]) && Array.isArray(sval[REMOVE]))
          )
      ) {
        //
        // Then remove any values to be removed
        //
        if (sval[REMOVE]) {
          dval = dst[key] = dval.filter(x => sval[REMOVE].indexOf(x) < 0);
        }
        //
        // And append any values to be added (make a copy so as not to modify the original)
        //
        if (sval[APPEND]) {
          dst[key] = [...dval, ...sval[APPEND]];
        }
      } else {
        //
        // Otherwise insert the values of the source object into the destination object
        //
        insert(dval, sval, warn);
      }
    } else if (Array.isArray(sval)) {
      //
      // If the source is an array, replace the destination with an empty array
      //   and copy the source values into it.
      //
      dst[key] = [];
      insert(dst[key], sval, false);
    } else if (isObject(sval)) {
      //
      // If the source is an object literal, set the destination to a copy of it
      //
      dst[key] = copy(sval);
    } else {
      //
      // Otherwise set the destination to the source value
      //
      dst[key] = sval;
    }
  }
  return dst;
}

/*****************************************************************/
/**
 * Merge options without warnings (so we can add new default values into an
 * existing default list)
 *
 * @param {OptionList} options  The option list to be merged into
 * @param {OptionList[]} defs   The option lists to merge into the first one
 * @return {OptionList}         The modified options list
 */
export function defaultOptions(options: OptionList, ...defs: OptionList[]): OptionList {
  defs.forEach(def => insert(options, def, false));
  return options;
}

/*****************************************************************/
/**
 * Merge options with warnings about undefined ones (so we can merge
 * user options into the default list)
 *
 * @param {OptionList} options  The option list to be merged into
 * @param {OptionList[]} defs   The option lists to merge into the first one
 * @return {OptionList}         The modified options list
 */
export function userOptions(options: OptionList, ...defs: OptionList[]): OptionList {
  defs.forEach(def => insert(options, def, true));
  return options;
}

/*****************************************************************/
/**
 * Select a subset of options by key name
 *
 * @param {OptionList} options  The option list from which option values will be taken
 * @param {string[]} keys       The names of the options to extract
 * @return {OptionList}         The option list consisting of only the ones whose keys were given
 */
export function selectOptions(options: OptionList, ...keys: string[]): OptionList {
  let subset: OptionList = {};
  for (const key of keys) {
    if (options.hasOwnProperty(key)) {
      subset[key] = options[key];
    }
  }
  return subset;
}

/*****************************************************************/
/**
 * Select a subset of options by keys from an object
 *
 * @param {OptionList} options  The option list from which the option values will be taken
 * @param {OptionList} object   The option list whose keys will be used to select the options
 * @return {OptionList}         The option list consisting of the option values from the first
 *                               list whose keys are those from the second list.
 */
export function selectOptionsFromKeys(options: OptionList, object: OptionList): OptionList {
  return selectOptions(options, ...Object.keys(object));
}

/*****************************************************************/
/**
 *  Separate options into sets: the ones having the same keys
 *  as the second object, the third object, etc, and the ones that don't.
 *  (Used to separate an option list into the options needed for several
 *   subobjects.)
 *
 * @param {OptionList} options    The option list to be split into parts
 * @param {OptionList[]} objects  The list of option lists whose keys are used to break up
 *                                 the original options into separate pieces.
 * @return {OptionList[]}         The option lists taken from the original based on the
 *                                 keys of the other objects.  The first one in the list
 *                                 consists of the values not appearing in any of the others
 *                                 (i.e., whose keys were not in any of the others).
 */
export function separateOptions(options: OptionList, ...objects: OptionList[]): OptionList[] {
  let results: OptionList[] = [];
  for (const object of objects) {
    let exists: OptionList = {}, missing: OptionList = {};
    for (const key of Object.keys(options || {})) {
      (object[key] === undefined ? missing : exists)[key] = options[key];
    }
    results.push(exists);
    options = missing;
  }
  results.unshift(options);
  return results;
}


/*****************************************************************/
/**
 *  Look up a value from object literal, being sure it is an
 *  actual property (not inherited), with a default if not found.
 *
 * @param {string} name         The name of the key to look up.
 * @param {OptionList} lookup   The list of options to check.
 * @param {any} def             The default value if the key isn't found.
 */
export function lookup(name: string, lookup: OptionList, def: any = null) {
  return (lookup.hasOwnProperty(name) ? lookup[name] : def);
}

