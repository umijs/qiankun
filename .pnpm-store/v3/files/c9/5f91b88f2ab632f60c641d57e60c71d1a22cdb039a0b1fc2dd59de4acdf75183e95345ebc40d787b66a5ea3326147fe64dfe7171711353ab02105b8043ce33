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
 * @fileoverview Error class for the TeX parser.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */


export default class TexError {

  private static pattern =
    /%(\d+|\{\d+\}|\{[a-z]+:\%\d+(?:\|(?:%\{\d+\}|%.|[^\}])*)+\}|.)/g;

  /**
   * Default error message.
   * @type {string}
   */
  public message: string;

  /**
   * The old MathJax processing function.
   * @param {string} str The basic error message.
   * @param {string[]} args The arguments to be replaced in the error message.
   * @return {string} The processed error string.
   */
  private static processString(str: string, args: string[]): string {
    let parts = str.split(TexError.pattern);
    for (let i = 1, m = parts.length; i < m; i += 2) {
      let c = parts[i].charAt(0);  // first char will be { or \d or a char to be
                                   // kept literally
      if (c >= '0' && c <= '9') {    // %n
        parts[i] = args[parseInt(parts[i], 10) - 1];
        if (typeof parts[i] === 'number') {
          parts[i] = parts[i].toString();
        }
      } else if (c === '{') {        // %{n} or %{plural:%n|...}
        c = parts[i].substr(1);
        if (c >= '0' && c <= '9') {  // %{n}
          parts[i] = args[parseInt(parts[i].substr(1, parts[i].length - 2), 10) - 1];
          if (typeof parts[i] === 'number') {
            parts[i] = parts[i].toString();
          }
        } else {                     // %{plural:%n|...}
          let match = parts[i].match(/^\{([a-z]+):%(\d+)\|(.*)\}$/);
          if (match) {
            // Removed plural here.
            parts[i] = '%' + parts[i];
          }
        }
      }
      if (parts[i] == null) {
        parts[i] = '???';
      }
    }
    return parts.join('');
  }

  /**
   * @constructor
   * @param{string} id        message id (for localization)
   * @param{string} message   text of English message
   * @param{string[]=} rest   any substitution arguments
   */
  constructor(public id: string, message: string, ...rest: string[]) {
    this.message = TexError.processString(message, rest);
  }

}
