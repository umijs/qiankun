"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.splitByPlaceholders = exports.placeholderRegex = exports.makePlaceholder = void 0;
// The capture group makes sure that the split contains the interpolation index
const placeholderRegex = /(?:__PLACEHOLDER_(\d+)__)/g; // Alternative regex that splits without a capture group

exports.placeholderRegex = placeholderRegex;
const placeholderNonCapturingRegex = /__PLACEHOLDER_(?:\d+)__/g; // Generates a placeholder from an index

const makePlaceholder = index => `__PLACEHOLDER_${index}__`; // Splits CSS by placeholders


exports.makePlaceholder = makePlaceholder;

const splitByPlaceholders = ([css, ...rest], capture = true) => [css.split(capture ? placeholderRegex : placeholderNonCapturingRegex), ...rest];

exports.splitByPlaceholders = splitByPlaceholders;