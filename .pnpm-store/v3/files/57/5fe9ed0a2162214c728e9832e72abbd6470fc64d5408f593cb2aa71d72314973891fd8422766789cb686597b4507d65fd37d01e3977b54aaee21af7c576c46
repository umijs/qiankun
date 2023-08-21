"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _experimentalUtils = require("@typescript-eslint/experimental-utils");

var _path = require("path");

var _utils = require("./utils");

const reportOnViolation = (context, node, {
  maxSize: lineLimit = 50,
  whitelistedSnapshots = {}
}) => {
  const startLine = node.loc.start.line;
  const endLine = node.loc.end.line;
  const lineCount = endLine - startLine;
  const allPathsAreAbsolute = Object.keys(whitelistedSnapshots).every(_path.isAbsolute);

  if (!allPathsAreAbsolute) {
    throw new Error('All paths for whitelistedSnapshots must be absolute. You can use JS config and `path.resolve`');
  }

  let isWhitelisted = false;

  if (whitelistedSnapshots && node.type === _experimentalUtils.AST_NODE_TYPES.ExpressionStatement && 'left' in node.expression && (0, _utils.isExpectMember)(node.expression.left)) {
    const fileName = context.getFilename();
    const whitelistedSnapshotsInFile = whitelistedSnapshots[fileName];

    if (whitelistedSnapshotsInFile) {
      const snapshotName = (0, _utils.getAccessorValue)(node.expression.left.property);
      isWhitelisted = whitelistedSnapshotsInFile.some(name => {
        if (name instanceof RegExp) {
          return name.test(snapshotName);
        }

        return snapshotName;
      });
    }
  }

  if (!isWhitelisted && lineCount > lineLimit) {
    context.report({
      messageId: lineLimit === 0 ? 'noSnapshot' : 'tooLongSnapshots',
      data: {
        lineLimit,
        lineCount
      },
      node
    });
  }
};

var _default = (0, _utils.createRule)({
  name: __filename,
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'disallow large snapshots',
      recommended: false
    },
    messages: {
      noSnapshot: '`{{ lineCount }}`s should begin with lowercase',
      tooLongSnapshots: 'Expected Jest snapshot to be smaller than {{ lineLimit }} lines but was {{ lineCount }} lines long'
    },
    type: 'suggestion',
    schema: [{
      type: 'object',
      properties: {
        maxSize: {
          type: 'number'
        },
        whitelistedSnapshots: {
          type: 'object',
          patternProperties: {
            '.*': {
              type: 'array'
            }
          }
        }
      },
      additionalProperties: false
    }]
  },
  defaultOptions: [{}],

  create(context, [options]) {
    if (context.getFilename().endsWith('.snap')) {
      return {
        ExpressionStatement(node) {
          reportOnViolation(context, node, options);
        }

      };
    } else if (context.getFilename().endsWith('.js')) {
      return {
        CallExpression(node) {
          if ('property' in node.callee && ((0, _utils.isSupportedAccessor)(node.callee.property, 'toMatchInlineSnapshot') || (0, _utils.isSupportedAccessor)(node.callee.property, 'toThrowErrorMatchingInlineSnapshot'))) {
            reportOnViolation(context, node, options);
          }
        }

      };
    }

    return {};
  }

});

exports.default = _default;