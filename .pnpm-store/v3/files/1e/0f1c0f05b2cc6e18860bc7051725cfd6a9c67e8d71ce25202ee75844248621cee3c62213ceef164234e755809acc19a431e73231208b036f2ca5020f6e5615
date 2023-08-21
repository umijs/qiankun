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
 * @fileoverview  Implements bit-fields with extendable field names
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

export class BitField {

  /**
   * The largest bit available
   */
  protected static MAXBIT = 1 << 31;

  /**
   * The next bit to be allocated
   */
  protected static next: number = 1;

  /**
   * The map of names to bit positions
   */
  protected static names: Map<string, number> = new Map();

  /**
   * The bits that are set
   */
  protected bits: number = 0;

  /**
   * @param {string} names    The names of the bit positions to reserve
   */
  public static allocate(...names: string[]) {
    for (const name of names) {
      if (this.has(name)) {
        throw new Error('Bit already allocated for ' + name);
      }
      if (this.next === BitField.MAXBIT) {
        throw new Error('Maximum number of bits already allocated');
      }
      this.names.set(name, this.next);
      this.next <<= 1;
    }
  }

  /**
   * @param {string} name   The name of the bit to check for being defined
   * @return {boolean}      True if the named bit is already allocated
   */
  public static has(name: string): boolean {
    return this.names.has(name);
  }

  /**
   * @param {string} name    The name of the bit position to set
   */
  public set(name: string) {
    this.bits |= this.getBit(name);
  }

  /**
   * @param {string} name    The name of the bit position to clear
   */
  public clear(name: string) {
    this.bits &= ~this.getBit(name);
  }

  /**
   * @param {string} name   The name of the bit to check if set
   * @return {boolean}      True if the named bit is set
   */
  public isSet(name: string): boolean {
    return !!(this.bits & this.getBit(name));
  }

  /**
   * Clear all bits
   */
  public reset() {
    this.bits = 0;
  }

  /**
   * @param {string} name   The name whose bit position is needed (error if not defined)
   * @return {number}       The position of the named bit
   */
  protected getBit(name: string): number {
    const bit = (this.constructor as typeof BitField).names.get(name);
    if (!bit) {
      throw new Error('Unknown bit-field name: ' + name);
    }
    return bit;
  }

}

/**
 * @param {string[]} names    The name of the positions to allocate initially
 * @return {typeof AbstractBitField}  The bit-field class with names allocated
 */
export function BitFieldClass(...names: string[]): typeof BitField {
  const Bits = class extends BitField {};
  Bits.allocate(...names);
  return Bits;
}
