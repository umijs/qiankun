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
 * @fileoverview Implements Attribute class for MmlNodes
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {PropertyList, Property} from '../Tree/Node.js';

/**
 * A constant for when a property should be inherited from the global defaults lists
 */
export const INHERIT = '_inherit_';

/******************************************************************/
/**
 * Implements the Attributes class for MmlNodes
 *  (These can be set explicitly, inherited from parent nodes,
 *   taken from a default list of values, or taken from global
 *   defaults.)
 */

export class Attributes {
  /**
   * The attributes explicitly set on a node
   */
  protected attributes: PropertyList;
  /**
   * The attributes inherited from parent nodes
   */
  protected inherited: PropertyList;
  /**
   * The default attributes for the node type
   */
  protected defaults: PropertyList;
  /**
   * Global attributes from the math node itself
   */
  protected global: PropertyList;

  /**
   * @param {PropertyList} defaults  The defaults for this node type
   * @param {PropertyList} global    The global properties (from the math node)
   *
   * @constructor
   */
  constructor(defaults: PropertyList, global: PropertyList) {
    this.global = global;
    this.defaults = Object.create(global);
    this.inherited = Object.create(this.defaults);
    this.attributes = Object.create(this.inherited);
    Object.assign(this.defaults, defaults);
  }

  /**
   * @param {string} name     The name of the attribute to set
   * @param {Property} value  The value to give the named attribute
   */
  public set(name: string, value: Property) {
    this.attributes[name] = value;
  }

  /**
   * @param {PropertyList} list  An object containing the properties to set
   */
  public setList(list: PropertyList) {
    Object.assign(this.attributes, list);
  }

  /**
   * @param {string} name  The name of the attribute whose value is to be returned
   * @return {Property}    The value of the named attribute (including inheritance and defaults)
   */
  public get(name: string): Property {
    let value = this.attributes[name];
    if (value === INHERIT) {
      value = this.global[name];
    }
    return value;
  }

  /**
   * @param {string} name  The value of the attribute whose value is to be returned
   * @return {Property}    The attribute whose name was given if it is explicit on the
   *                       node (not inherited or defaulted), null otherwise
   */
  public getExplicit(name: string): Property {
    if (!this.attributes.hasOwnProperty(name)) {
      return undefined;
    }
    return this.attributes[name];
  }

  /**
   * @param {string[]} names  The names of attributes whose values are to be returned
   * @return {PropertyList}   An object containing the attributes and their values
   */
  public getList(...names: string[]): PropertyList {
    let values: PropertyList = {};
    for (const name of names) {
      values[name] = this.get(name);
    }
    return values;
  }

  /**
   * @param {string} name  The name of an inherited attribute to be set
   * @param {Property} value  The value to assign to the named attribute
   */
  public setInherited(name: string, value: Property) {
    this.inherited[name] = value;
  }

  /**
   * @param {string} name  The name of an inherited attribute whose value is to be returned
   * @return {Property}    The value of the named attribute if it is inherited, null otherwise
   */
  public getInherited(name: string): Property {
    return this.inherited[name];
  }

  /**
   * @param {string} name  The name of a default attribute whose value is to be returned
   * @return {Property}    The value of the named attribute if a default exists for it, null otherwise
   */
  public getDefault(name: string): Property {
    return this.defaults[name];
  }

  /**
   * @param {string} name  The name of a attribute to check
   * @return {boolean}     True if attribute is set explicitly or inherited
   *                         from an explicit mstyle or math attribute
   */
  public isSet(name: string): boolean {
    return this.attributes.hasOwnProperty(name) || this.inherited.hasOwnProperty(name);
  }

  /**
   * @param {string} name  The name of an attribute to test for the existence of a default
   * @return {boolean}     True of there is a default for the named attribute, false otherwise
   */
  public hasDefault(name: string): boolean {
    return (name in this.defaults);
  }

  /**
   * @return {string[]}  The names of all the attributes explicitly set on the node
   */
  public getExplicitNames(): string[] {
    return Object.keys(this.attributes);
  }

  /**
   * @return {string[]}  The names of all the inherited attributes for the node
   */
  public getInheritedNames(): string[] {
    return Object.keys(this.inherited);
  }

  /**
   * @return {string[]}  The names of all the default attributes for the node
   */
  public getDefaultNames(): string[] {
    return Object.keys(this.defaults);
  }

  /**
   * @return {string[]}  The names of all the global attributes
   */
  public getGlobalNames(): string[] {
    return Object.keys(this.global);
  }

  /**
   * @return {PropertyList}  The attribute object
   */
  public getAllAttributes(): PropertyList {
    return this.attributes;
  }

  /**
   * @return {PropertyList}  The inherited object
   */
  public getAllInherited(): PropertyList {
    return this.inherited;
  }

  /**
   * @return {PropertyList}  The defaults object
   */
  public getAllDefaults(): PropertyList {
    return this.defaults;
  }

  /**
   * @return {PropertyList}  The global object
   */
  public getAllGlobals(): PropertyList {
    return this.global;
  }

}
