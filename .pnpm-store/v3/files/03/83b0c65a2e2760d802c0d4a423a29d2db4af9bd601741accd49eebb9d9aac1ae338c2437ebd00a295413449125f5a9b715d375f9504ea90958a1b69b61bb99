"use strict";

const _ = require("lodash");
const report = require("../../utils/report");
const ruleMessages = require("../../utils/ruleMessages");
const styleSearch = require("style-search");
const validateOptions = require("../../utils/validateOptions");

const ruleName = "value-list-max-empty-lines";

const messages = ruleMessages(ruleName, {
  expected: max =>
    `Expected no more than ${max} empty ${max === 1 ? "line" : "lines"}`
});

const rule = function(max, options, context) {
  const maxAdjacentNewlines = max + 1;

  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: max,
      possible: _.isNumber
    });

    if (!validOptions) {
      return;
    }

    root.walkDecls(decl => {
      const value = decl.raws.value ? decl.raws.value.raw : decl.value;
      const repeatLFNewLines = _.repeat("\n", maxAdjacentNewlines);
      const repeatCRLFNewLines = _.repeat("\r\n", maxAdjacentNewlines);

      const fixIndices = [];

      styleSearch({ source: value, target: "\n" }, match => {
        if (
          value.substr(match.startIndex + 1, maxAdjacentNewlines) ===
            repeatLFNewLines ||
          value.substr(match.startIndex + 1, maxAdjacentNewlines * 2) ===
            repeatCRLFNewLines
        ) {
          // Put index at `\r` if it's CRLF, otherwise leave it at `\n`
          let index = match.startIndex;

          if (value[index - 1] === "\r") {
            index -= 1;
          }

          if (context.fix) {
            fixIndices.push(index);

            return;
          }

          report({
            message: messages.expected(max),
            node: decl,
            index,
            result,
            ruleName
          });
        }
      });

      if (fixIndices.length) {
        const maxAdjacentNewLinesStr = _.repeat(
          context.newline,
          maxAdjacentNewlines
        );
        let fixedValue = value;

        fixIndices
          .sort((a, b) => b - a)
          .forEach(index => {
            fixedValue =
              fixedValue.slice(0, index) +
              maxAdjacentNewLinesStr +
              fixedValue.slice(index).replace(/^[\r\n]*/, "");
          });

        if (decl.raws.value) {
          decl.raws.value.raw = fixedValue;
        } else {
          decl.value = fixedValue;
        }
      }
    });
  };
};

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
