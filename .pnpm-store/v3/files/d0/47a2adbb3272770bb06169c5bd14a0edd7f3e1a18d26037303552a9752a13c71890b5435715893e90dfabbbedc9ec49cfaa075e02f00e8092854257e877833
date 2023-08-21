/*************************************************************
 *
 *  Copyright (c) 2019-2022 The MathJax Consortium
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
 * @fileoverview    Configuration file for the tagformat package.
 *
 * @author dpvc@mathjax.org (Davide P. Cervone)
 */

import {Configuration, ParserConfiguration} from '../Configuration.js';
import {TeX} from '../../tex.js';
import {AbstractTags, TagsFactory} from '../Tags.js';

/**
 * Number used to make tag class unique (each TeX input has to have its own because
 *  it needs access to the parse options)
 */
let tagID = 0;

/**
 * Configure a class to use for the tag handler that uses the input jax's options
 *   to control the formatting of the tags
 * @param {Configuration} config   The configuration for the input jax
 * @param {TeX} jax                The TeX input jax
 */
export function tagformatConfig(config: ParserConfiguration, jax: TeX<any, any, any>) {

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
   * A Tags object that uses the input jax options to perform the formatting
   *
   * Note:  We have to make a new class for each input jax since the format
   * methods don't have access to the input jax, and hence to its options.
   * If they did, we would use a common configTags class instead.
   */
  class TagFormat extends TagClass {

    /**
     * @override
     */
    public formatNumber(n: number) {
      return jax.parseOptions.options.tagformat.number(n);
    }

    /**
     * @override
     */
    public formatTag(tag: string) {
      return jax.parseOptions.options.tagformat.tag(tag);
    }

    /**
     * @override
     */
    public formatId(id: string) {
      return jax.parseOptions.options.tagformat.id(id);
    }

    /**
     * @override
     */
    public formatUrl(id: string, base: string) {
      return jax.parseOptions.options.tagformat.url(id, base);
    }
  }

  //
  //  Get a unique name for the tag class (since it is tied to the input jax)
  //  Note:  These never get freed, so they will accumulate if you create many
  //  TeX input jax instances with this extension.
  //
  tagID++;
  const tagName = 'configTags-' + tagID;
  //
  // Register the tag class
  //
  TagsFactory.add(tagName, TagFormat);
  jax.parseOptions.options.tags = tagName;
}

/**
 * The configuration object for configTags
 */
export const TagFormatConfiguration = Configuration.create(
  'tagformat', {
    config: [tagformatConfig, 10],
    options: {
      tagformat: {
        number: (n: number) => n.toString(),
        tag:    (tag: string) => '(' + tag + ')',
        id:     (id: string) => 'mjx-eqn:' + id.replace(/\s/g, '_'),
        url:    (id: string, base: string) => base + '#' + encodeURIComponent(id),
      }
    }
  }
);
