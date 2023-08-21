/*************************************************************
 *  Copyright (c) 2021-2022 MathJax Consortium
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
 * @fileoverview    Tags implementation for the mathtools package.
 *
 * @author dpvc@mathjax.org (Davide P. Cervone)
 */

import TexError from '../TexError.js';
import {ParserConfiguration} from '../Configuration.js';
import {TeX} from '../../tex.js';
import {AbstractTags, TagsFactory} from '../Tags.js';


/**
 * The type for the Mathtools tags (including their data).
 */
export type MathtoolsTags = AbstractTags & {
  mtFormats: Map<string, [string, string, string]>;  // name -> [left, right, format]
  mtCurrent: [string, string, string];               // [left, right, format]
};

/**
 * The ID number for the current tag class
 */
let tagID = 0;

/**
 * Creates and registers a subclass of the currently configured tag class
 * that handles the formats created by the \newtagform macro.
 */
export function MathtoolsTagFormat(config: ParserConfiguration, jax: TeX<any, any, any>) {
  /**
   * If the tag format is being added by one of the other extensions,
   *   as is done for the 'ams' tags, make sure it is defined so we can create it.
   */
  const tags = jax.parseOptions.options.tags;
  if (tags !== 'base' && config.tags.hasOwnProperty(tags)) {
    TagsFactory.add(tags, config.tags[tags]);
  }

  /**
   * The original tag class to be extended (none, ams, or all)
   */
  const TagClass = TagsFactory.create(jax.parseOptions.options.tags).constructor as typeof AbstractTags;

  /**
   * A Tags object that uses \newtagform to define the formatting
   */
  class TagFormat extends TagClass {

    /**
     * The defined tag formats
     */
    public mtFormats: Map<string, [string, string, string]> = new Map();

    /**
     * The format currently in use ([left, right, format]), or null for using the default
     */
    public mtCurrent: [string, string, string] = null;

    /**
     * @override
     * @constructor
     */
    constructor() {
      super();
      const forms = jax.parseOptions.options.mathtools.tagforms;
      for (const form of Object.keys(forms)) {
        if (!Array.isArray(forms[form]) || forms[form].length !== 3) {
          throw new TexError('InvalidTagFormDef',
                             'The tag form definition for "%1" should be an array fo three strings', form);
        }
        this.mtFormats.set(form, forms[form]);
      }
    }

    /**
     * @override
     */
    public formatTag(tag: string) {
      if (this.mtCurrent) {
        const [left, right, format] = this.mtCurrent;
        return (format ? `${left}${format}{${tag}}${right}` : `${left}${tag}${right}`);
      }
      return super.formatTag(tag);
    }
  }

  //
  //  Get a unique name for the tag class (since it is tied to the input jax)
  //  Note:  These never get freed, so they will accumulate if you create many
  //  TeX input jax instances with this extension.
  //
  tagID++;
  const tagName = 'MathtoolsTags-' + tagID;
  //
  // Register the tag class
  //
  TagsFactory.add(tagName, TagFormat);
  jax.parseOptions.options.tags = tagName;
}
