"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("./utils");

// todo: refactor into "ban-matchers"
var _default = (0, _utils.createRule)({
  name: __filename,
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Disallow using `toBeTruthy()` & `toBeFalsy()`',
      recommended: false
    },
    messages: {
      avoidMessage: 'Avoid {{ methodName }}'
    },
    type: 'suggestion',
    schema: []
  },
  defaultOptions: [],

  create(context) {
    return {
      CallExpression(node) {
        if (!(0, _utils.isExpectCall)(node)) {
          return;
        }

        const _parseExpectCall = (0, _utils.parseExpectCall)(node),
              matcher = _parseExpectCall.matcher;

        if (!matcher || !['toBeTruthy', 'toBeFalsy'].includes(matcher.name)) {
          return;
        }

        context.report({
          data: {
            methodName: matcher.name
          },
          // todo: rename to 'matcherName'
          messageId: 'avoidMessage',
          // todo: rename to 'avoidMatcher'
          node: matcher.node.property
        });
      }

    };
  }

});

exports.default = _default;