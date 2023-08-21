"use strict";

const _ = require("lodash");
const optionsMatches = require("../../utils/optionsMatches");
const report = require("../../utils/report");
const ruleMessages = require("../../utils/ruleMessages");
const styleSearch = require("style-search");
const validateOptions = require("../../utils/validateOptions");

const ruleName = "max-empty-lines";

const messages = ruleMessages(ruleName, {
  expected: max =>
    `Expected no more than ${max} empty ${max === 1 ? "line" : "lines"}`
});

const rule = function(max, options) {
  let emptyLines = 0;
  let lastIndex = -1;

  return (root, result) => {
    const validOptions = validateOptions(
      result,
      ruleName,
      {
        actual: max,
        possible: _.isNumber
      },
      {
        actual: options,
        possible: {
          ignore: ["comments"]
        },
        optional: true
      }
    );

    if (!validOptions) {
      return;
    }

    const ignoreComments = optionsMatches(options, "ignore", "comments");

    emptyLines = 0;
    lastIndex = -1;
    const rootString = root.toString();

    styleSearch(
      {
        source: rootString,
        target: /\r\n/.test(rootString) ? "\r\n" : "\n",
        comments: ignoreComments ? "skip" : "check"
      },
      match => {
        checkMatch(rootString, match.startIndex, match.endIndex, root);
      }
    );

    function checkMatch(source, matchStartIndex, matchEndIndex, node) {
      const eof = matchEndIndex === source.length ? true : false;
      let violation = false;

      // Additional check for beginning of file
      if (!matchStartIndex || lastIndex === matchStartIndex) {
        emptyLines++;
      } else {
        emptyLines = 0;
      }

      lastIndex = matchEndIndex;

      if (emptyLines > max) violation = true;

      if (!eof && !violation) return;

      if (violation) {
        report({
          message: messages.expected(max),
          node,
          index: matchStartIndex,
          result,
          ruleName
        });
      }

      // Additional check for end of file
      if (eof && max) {
        emptyLines++;

        if (emptyLines > max && isEofNode(result.root, node)) {
          report({
            message: messages.expected(max),
            node,
            index: matchEndIndex,
            result,
            ruleName
          });
        }
      }
    }
  };
};

/**
 * Checks whether the given node is the last node of file.
 * @param {Document|null} document the document node with `postcss-html` and `postcss-jsx`.
 * @param {Root} root the root node of css
 */
function isEofNode(document, root) {
  if (!document || document.constructor.name !== "Document") {
    return true;
  }

  // In the `postcss-html` and `postcss-jsx` syntax, checks that there is text after the given node.
  let after;

  if (root === document.last) {
    after = _.get(document, "raws.afterEnd");
  } else {
    const rootIndex = document.index(root);

    after = _.get(document.nodes[rootIndex + 1], "raws.beforeStart");
  }

  return !(after + "").trim();
}

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
