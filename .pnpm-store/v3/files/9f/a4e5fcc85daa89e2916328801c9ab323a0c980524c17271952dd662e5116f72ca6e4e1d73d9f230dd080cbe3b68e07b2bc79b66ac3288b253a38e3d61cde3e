/**
 * @fileoverview Utility functions for propWrapperFunctions setting
 */
'use strict';

const DEFAULT_LINK_COMPONENTS = ['a'];
const DEFAULT_LINK_ATTRIBUTE = 'href';

function getLinkComponents(context) {
  const settings = context.settings || {};
  return new Map(DEFAULT_LINK_COMPONENTS.concat(settings.linkComponents || []).map(value => {
    if (typeof value === 'string') {
      return [value, DEFAULT_LINK_ATTRIBUTE];
    }
    return [value.name, value.linkAttribute];
  }));
}

module.exports = {
  getLinkComponents: getLinkComponents
};
