'use strict';




var _staticRequire = require('../core/staticRequire');var _staticRequire2 = _interopRequireDefault(_staticRequire);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);

var _debug = require('debug');var _debug2 = _interopRequireDefault(_debug);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}
var log = (0, _debug2['default'])('eslint-plugin-import:rules:newline-after-import');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
/**
 * @fileoverview Rule to enforce new line after import not followed by another import.
 * @author Radek Benkel
 */function containsNodeOrEqual(outerNode, innerNode) {return outerNode.range[0] <= innerNode.range[0] && outerNode.range[1] >= innerNode.range[1];}

function getScopeBody(scope) {
  if (scope.block.type === 'SwitchStatement') {
    log('SwitchStatement scopes not supported');
    return null;
  }var

  body = scope.block.body;
  if (body && body.type === 'BlockStatement') {
    return body.body;
  }

  return body;
}

function findNodeIndexInScopeBody(body, nodeToFind) {
  return body.findIndex(function (node) {return containsNodeOrEqual(node, nodeToFind);});
}

function getLineDifference(node, nextNode) {
  return nextNode.loc.start.line - node.loc.end.line;
}

function isClassWithDecorator(node) {
  return node.type === 'ClassDeclaration' && node.decorators && node.decorators.length;
}

function isExportDefaultClass(node) {
  return node.type === 'ExportDefaultDeclaration' && node.declaration.type === 'ClassDeclaration';
}

function isExportNameClass(node) {

  return node.type === 'ExportNamedDeclaration' && node.declaration && node.declaration.type === 'ClassDeclaration';
}

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      category: 'Style guide',
      description: 'Enforce a newline after import statements.',
      url: (0, _docsUrl2['default'])('newline-after-import') },

    fixable: 'whitespace',
    schema: [
    {
      type: 'object',
      properties: {
        count: {
          type: 'integer',
          minimum: 1 },

        considerComments: { type: 'boolean' } },

      additionalProperties: false }] },



  create: function () {function create(context) {
      var level = 0;
      var requireCalls = [];
      var options = Object.assign({ count: 1, considerComments: false }, context.options[0]);

      function checkForNewLine(node, nextNode, type) {
        if (isExportDefaultClass(nextNode) || isExportNameClass(nextNode)) {
          var classNode = nextNode.declaration;

          if (isClassWithDecorator(classNode)) {
            nextNode = classNode.decorators[0];
          }
        } else if (isClassWithDecorator(nextNode)) {
          nextNode = nextNode.decorators[0];
        }

        var lineDifference = getLineDifference(node, nextNode);
        var EXPECTED_LINE_DIFFERENCE = options.count + 1;

        if (lineDifference < EXPECTED_LINE_DIFFERENCE) {
          var column = node.loc.start.column;

          if (node.loc.start.line !== node.loc.end.line) {
            column = 0;
          }

          context.report({
            loc: {
              line: node.loc.end.line,
              column: column },

            message: 'Expected ' + String(options.count) + ' empty line' + (options.count > 1 ? 's' : '') + ' after ' + String(type) + ' statement not followed by another ' + String(type) + '.',
            fix: function () {function fix(fixer) {return fixer.insertTextAfter(
                node,
                '\n'.repeat(EXPECTED_LINE_DIFFERENCE - lineDifference));}return fix;}() });


        }
      }

      function commentAfterImport(node, nextComment) {
        var lineDifference = getLineDifference(node, nextComment);
        var EXPECTED_LINE_DIFFERENCE = options.count + 1;

        if (lineDifference < EXPECTED_LINE_DIFFERENCE) {
          var column = node.loc.start.column;

          if (node.loc.start.line !== node.loc.end.line) {
            column = 0;
          }

          context.report({
            loc: {
              line: node.loc.end.line,
              column: column },

            message: 'Expected ' + String(options.count) + ' empty line' + (options.count > 1 ? 's' : '') + ' after import statement not followed by another import.',
            fix: function () {function fix(fixer) {return fixer.insertTextAfter(
                node,
                '\n'.repeat(EXPECTED_LINE_DIFFERENCE - lineDifference));}return fix;}() });


        }
      }

      function incrementLevel() {
        level++;
      }
      function decrementLevel() {
        level--;
      }

      function checkImport(node) {var
        parent = node.parent;

        if (!parent || !parent.body) {
          return;
        }

        var nodePosition = parent.body.indexOf(node);
        var nextNode = parent.body[nodePosition + 1];
        var endLine = node.loc.end.line;
        var nextComment = void 0;

        if (typeof parent.comments !== 'undefined' && options.considerComments) {
          nextComment = parent.comments.find(function (o) {return o.loc.start.line === endLine + 1;});
        }

        // skip "export import"s
        if (node.type === 'TSImportEqualsDeclaration' && node.isExport) {
          return;
        }

        if (nextComment && typeof nextComment !== 'undefined') {
          commentAfterImport(node, nextComment);
        } else if (nextNode && nextNode.type !== 'ImportDeclaration' && (nextNode.type !== 'TSImportEqualsDeclaration' || nextNode.isExport)) {
          checkForNewLine(node, nextNode, 'import');
        }
      }

      return {
        ImportDeclaration: checkImport,
        TSImportEqualsDeclaration: checkImport,
        CallExpression: function () {function CallExpression(node) {
            if ((0, _staticRequire2['default'])(node) && level === 0) {
              requireCalls.push(node);
            }
          }return CallExpression;}(),
        'Program:exit': function () {function ProgramExit() {
            log('exit processing for', context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename());
            var scopeBody = getScopeBody(context.getScope());
            log('got scope:', scopeBody);

            requireCalls.forEach(function (node, index) {
              var nodePosition = findNodeIndexInScopeBody(scopeBody, node);
              log('node position in scope:', nodePosition);

              var statementWithRequireCall = scopeBody[nodePosition];
              var nextStatement = scopeBody[nodePosition + 1];
              var nextRequireCall = requireCalls[index + 1];

              if (nextRequireCall && containsNodeOrEqual(statementWithRequireCall, nextRequireCall)) {
                return;
              }

              if (
              nextStatement && (
              !nextRequireCall ||
              !containsNodeOrEqual(nextStatement, nextRequireCall)))

              {

                checkForNewLine(statementWithRequireCall, nextStatement, 'require');
              }
            });
          }return ProgramExit;}(),
        FunctionDeclaration: incrementLevel,
        FunctionExpression: incrementLevel,
        ArrowFunctionExpression: incrementLevel,
        BlockStatement: incrementLevel,
        ObjectExpression: incrementLevel,
        Decorator: incrementLevel,
        'FunctionDeclaration:exit': decrementLevel,
        'FunctionExpression:exit': decrementLevel,
        'ArrowFunctionExpression:exit': decrementLevel,
        'BlockStatement:exit': decrementLevel,
        'ObjectExpression:exit': decrementLevel,
        'Decorator:exit': decrementLevel };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uZXdsaW5lLWFmdGVyLWltcG9ydC5qcyJdLCJuYW1lcyI6WyJsb2ciLCJjb250YWluc05vZGVPckVxdWFsIiwib3V0ZXJOb2RlIiwiaW5uZXJOb2RlIiwicmFuZ2UiLCJnZXRTY29wZUJvZHkiLCJzY29wZSIsImJsb2NrIiwidHlwZSIsImJvZHkiLCJmaW5kTm9kZUluZGV4SW5TY29wZUJvZHkiLCJub2RlVG9GaW5kIiwiZmluZEluZGV4Iiwibm9kZSIsImdldExpbmVEaWZmZXJlbmNlIiwibmV4dE5vZGUiLCJsb2MiLCJzdGFydCIsImxpbmUiLCJlbmQiLCJpc0NsYXNzV2l0aERlY29yYXRvciIsImRlY29yYXRvcnMiLCJsZW5ndGgiLCJpc0V4cG9ydERlZmF1bHRDbGFzcyIsImRlY2xhcmF0aW9uIiwiaXNFeHBvcnROYW1lQ2xhc3MiLCJtb2R1bGUiLCJleHBvcnRzIiwibWV0YSIsImRvY3MiLCJjYXRlZ29yeSIsImRlc2NyaXB0aW9uIiwidXJsIiwiZml4YWJsZSIsInNjaGVtYSIsInByb3BlcnRpZXMiLCJjb3VudCIsIm1pbmltdW0iLCJjb25zaWRlckNvbW1lbnRzIiwiYWRkaXRpb25hbFByb3BlcnRpZXMiLCJjcmVhdGUiLCJjb250ZXh0IiwibGV2ZWwiLCJyZXF1aXJlQ2FsbHMiLCJvcHRpb25zIiwiY2hlY2tGb3JOZXdMaW5lIiwiY2xhc3NOb2RlIiwibGluZURpZmZlcmVuY2UiLCJFWFBFQ1RFRF9MSU5FX0RJRkZFUkVOQ0UiLCJjb2x1bW4iLCJyZXBvcnQiLCJtZXNzYWdlIiwiZml4IiwiZml4ZXIiLCJpbnNlcnRUZXh0QWZ0ZXIiLCJyZXBlYXQiLCJjb21tZW50QWZ0ZXJJbXBvcnQiLCJuZXh0Q29tbWVudCIsImluY3JlbWVudExldmVsIiwiZGVjcmVtZW50TGV2ZWwiLCJjaGVja0ltcG9ydCIsInBhcmVudCIsIm5vZGVQb3NpdGlvbiIsImluZGV4T2YiLCJlbmRMaW5lIiwiY29tbWVudHMiLCJmaW5kIiwibyIsImlzRXhwb3J0IiwiSW1wb3J0RGVjbGFyYXRpb24iLCJUU0ltcG9ydEVxdWFsc0RlY2xhcmF0aW9uIiwiQ2FsbEV4cHJlc3Npb24iLCJwdXNoIiwiZ2V0UGh5c2ljYWxGaWxlbmFtZSIsImdldEZpbGVuYW1lIiwic2NvcGVCb2R5IiwiZ2V0U2NvcGUiLCJmb3JFYWNoIiwiaW5kZXgiLCJzdGF0ZW1lbnRXaXRoUmVxdWlyZUNhbGwiLCJuZXh0U3RhdGVtZW50IiwibmV4dFJlcXVpcmVDYWxsIiwiRnVuY3Rpb25EZWNsYXJhdGlvbiIsIkZ1bmN0aW9uRXhwcmVzc2lvbiIsIkFycm93RnVuY3Rpb25FeHByZXNzaW9uIiwiQmxvY2tTdGF0ZW1lbnQiLCJPYmplY3RFeHByZXNzaW9uIiwiRGVjb3JhdG9yIl0sIm1hcHBpbmdzIjoiOzs7OztBQUtBLHNEO0FBQ0EscUM7O0FBRUEsOEI7QUFDQSxJQUFNQSxNQUFNLHdCQUFNLGlEQUFOLENBQVo7O0FBRUE7QUFDQTtBQUNBO0FBYkE7OztHQWVBLFNBQVNDLG1CQUFULENBQTZCQyxTQUE3QixFQUF3Q0MsU0FBeEMsRUFBbUQsQ0FDakQsT0FBT0QsVUFBVUUsS0FBVixDQUFnQixDQUFoQixLQUFzQkQsVUFBVUMsS0FBVixDQUFnQixDQUFoQixDQUF0QixJQUE0Q0YsVUFBVUUsS0FBVixDQUFnQixDQUFoQixLQUFzQkQsVUFBVUMsS0FBVixDQUFnQixDQUFoQixDQUF6RSxDQUNEOztBQUVELFNBQVNDLFlBQVQsQ0FBc0JDLEtBQXRCLEVBQTZCO0FBQzNCLE1BQUlBLE1BQU1DLEtBQU4sQ0FBWUMsSUFBWixLQUFxQixpQkFBekIsRUFBNEM7QUFDMUNSLFFBQUksc0NBQUo7QUFDQSxXQUFPLElBQVA7QUFDRCxHQUowQjs7QUFNbkJTLE1BTm1CLEdBTVZILE1BQU1DLEtBTkksQ0FNbkJFLElBTm1CO0FBTzNCLE1BQUlBLFFBQVFBLEtBQUtELElBQUwsS0FBYyxnQkFBMUIsRUFBNEM7QUFDMUMsV0FBT0MsS0FBS0EsSUFBWjtBQUNEOztBQUVELFNBQU9BLElBQVA7QUFD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QUFEO0FBQ0csZUFBQ2hGLG9CQUFvQitFLGFBQXBCLEVBQW1DQyxlQUFuQyxDQUZOLENBREY7O0FBS0U7O0FBRUFwQyxnQ0FBZ0JrQyx3QkFBaEIsRUFBMENDLGFBQTFDLEVBQXlELFNBQXpEO0FBQ0Q7QUFDRixhQXJCRDtBQXNCRCxXQW5DSTtBQW9DTEUsNkJBQXFCeEIsY0FwQ2hCO0FBcUNMeUIsNEJBQW9CekIsY0FyQ2Y7QUFzQ0wwQixpQ0FBeUIxQixjQXRDcEI7QUF1Q0wyQix3QkFBZ0IzQixjQXZDWDtBQXdDTDRCLDBCQUFrQjVCLGNBeENiO0FBeUNMNkIsbUJBQVc3QixjQXpDTjtBQTBDTCxvQ0FBNEJDLGNBMUN2QjtBQTJDTCxtQ0FBMkJBLGNBM0N0QjtBQTRDTCx3Q0FBZ0NBLGNBNUMzQjtBQTZDTCwrQkFBdUJBLGNBN0NsQjtBQThDTCxpQ0FBeUJBLGNBOUNwQjtBQStDTCwwQkFBa0JBLGNBL0NiLEVBQVA7O0FBaURELEtBNUtjLG1CQUFqQiIsImZpbGUiOiJuZXdsaW5lLWFmdGVyLWltcG9ydC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVvdmVydmlldyBSdWxlIHRvIGVuZm9yY2UgbmV3IGxpbmUgYWZ0ZXIgaW1wb3J0IG5vdCBmb2xsb3dlZCBieSBhbm90aGVyIGltcG9ydC5cbiAqIEBhdXRob3IgUmFkZWsgQmVua2VsXG4gKi9cblxuaW1wb3J0IGlzU3RhdGljUmVxdWlyZSBmcm9tICcuLi9jb3JlL3N0YXRpY1JlcXVpcmUnO1xuaW1wb3J0IGRvY3NVcmwgZnJvbSAnLi4vZG9jc1VybCc7XG5cbmltcG9ydCBkZWJ1ZyBmcm9tICdkZWJ1Zyc7XG5jb25zdCBsb2cgPSBkZWJ1ZygnZXNsaW50LXBsdWdpbi1pbXBvcnQ6cnVsZXM6bmV3bGluZS1hZnRlci1pbXBvcnQnKTtcblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFJ1bGUgRGVmaW5pdGlvblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gY29udGFpbnNOb2RlT3JFcXVhbChvdXRlck5vZGUsIGlubmVyTm9kZSkge1xuICByZXR1cm4gb3V0ZXJOb2RlLnJhbmdlWzBdIDw9IGlubmVyTm9kZS5yYW5nZVswXSAmJiBvdXRlck5vZGUucmFuZ2VbMV0gPj0gaW5uZXJOb2RlLnJhbmdlWzFdO1xufVxuXG5mdW5jdGlvbiBnZXRTY29wZUJvZHkoc2NvcGUpIHtcbiAgaWYgKHNjb3BlLmJsb2NrLnR5cGUgPT09ICdTd2l0Y2hTdGF0ZW1lbnQnKSB7XG4gICAgbG9nKCdTd2l0Y2hTdGF0ZW1lbnQgc2NvcGVzIG5vdCBzdXBwb3J0ZWQnKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IHsgYm9keSB9ID0gc2NvcGUuYmxvY2s7XG4gIGlmIChib2R5ICYmIGJvZHkudHlwZSA9PT0gJ0Jsb2NrU3RhdGVtZW50Jykge1xuICAgIHJldHVybiBib2R5LmJvZHk7XG4gIH1cblxuICByZXR1cm4gYm9keTtcbn1cblxuZnVuY3Rpb24gZmluZE5vZGVJbmRleEluU2NvcGVCb2R5KGJvZHksIG5vZGVUb0ZpbmQpIHtcbiAgcmV0dXJuIGJvZHkuZmluZEluZGV4KChub2RlKSA9PiBjb250YWluc05vZGVPckVxdWFsKG5vZGUsIG5vZGVUb0ZpbmQpKTtcbn1cblxuZnVuY3Rpb24gZ2V0TGluZURpZmZlcmVuY2Uobm9kZSwgbmV4dE5vZGUpIHtcbiAgcmV0dXJuIG5leHROb2RlLmxvYy5zdGFydC5saW5lIC0gbm9kZS5sb2MuZW5kLmxpbmU7XG59XG5cbmZ1bmN0aW9uIGlzQ2xhc3NXaXRoRGVjb3JhdG9yKG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUudHlwZSA9PT0gJ0NsYXNzRGVjbGFyYXRpb24nICYmIG5vZGUuZGVjb3JhdG9ycyAmJiBub2RlLmRlY29yYXRvcnMubGVuZ3RoO1xufVxuXG5mdW5jdGlvbiBpc0V4cG9ydERlZmF1bHRDbGFzcyhub2RlKSB7XG4gIHJldHVybiBub2RlLnR5cGUgPT09ICdFeHBvcnREZWZhdWx0RGVjbGFyYXRpb24nICYmIG5vZGUuZGVjbGFyYXRpb24udHlwZSA9PT0gJ0NsYXNzRGVjbGFyYXRpb24nO1xufVxuXG5mdW5jdGlvbiBpc0V4cG9ydE5hbWVDbGFzcyhub2RlKSB7XG5cbiAgcmV0dXJuIG5vZGUudHlwZSA9PT0gJ0V4cG9ydE5hbWVkRGVjbGFyYXRpb24nICYmIG5vZGUuZGVjbGFyYXRpb24gJiYgbm9kZS5kZWNsYXJhdGlvbi50eXBlID09PSAnQ2xhc3NEZWNsYXJhdGlvbic7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ2xheW91dCcsXG4gICAgZG9jczoge1xuICAgICAgY2F0ZWdvcnk6ICdTdHlsZSBndWlkZScsXG4gICAgICBkZXNjcmlwdGlvbjogJ0VuZm9yY2UgYSBuZXdsaW5lIGFmdGVyIGltcG9ydCBzdGF0ZW1lbnRzLicsXG4gICAgICB1cmw6IGRvY3NVcmwoJ25ld2xpbmUtYWZ0ZXItaW1wb3J0JyksXG4gICAgfSxcbiAgICBmaXhhYmxlOiAnd2hpdGVzcGFjZScsXG4gICAgc2NoZW1hOiBbXG4gICAgICB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgY291bnQ6IHtcbiAgICAgICAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgICAgICAgIG1pbmltdW06IDEsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBjb25zaWRlckNvbW1lbnRzOiB7IHR5cGU6ICdib29sZWFuJyB9LFxuICAgICAgICB9LFxuICAgICAgICBhZGRpdGlvbmFsUHJvcGVydGllczogZmFsc2UsXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG4gIGNyZWF0ZShjb250ZXh0KSB7XG4gICAgbGV0IGxldmVsID0gMDtcbiAgICBjb25zdCByZXF1aXJlQ2FsbHMgPSBbXTtcbiAgICBjb25zdCBvcHRpb25zID0geyBjb3VudDogMSwgY29uc2lkZXJDb21tZW50czogZmFsc2UsIC4uLmNvbnRleHQub3B0aW9uc1swXSB9O1xuXG4gICAgZnVuY3Rpb24gY2hlY2tGb3JOZXdMaW5lKG5vZGUsIG5leHROb2RlLCB0eXBlKSB7XG4gICAgICBpZiAoaXNFeHBvcnREZWZhdWx0Q2xhc3MobmV4dE5vZGUpIHx8IGlzRXhwb3J0TmFtZUNsYXNzKG5leHROb2RlKSkge1xuICAgICAgICBjb25zdCBjbGFzc05vZGUgPSBuZXh0Tm9kZS5kZWNsYXJhdGlvbjtcblxuICAgICAgICBpZiAoaXNDbGFzc1dpdGhEZWNvcmF0b3IoY2xhc3NOb2RlKSkge1xuICAgICAgICAgIG5leHROb2RlID0gY2xhc3NOb2RlLmRlY29yYXRvcnNbMF07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoaXNDbGFzc1dpdGhEZWNvcmF0b3IobmV4dE5vZGUpKSB7XG4gICAgICAgIG5leHROb2RlID0gbmV4dE5vZGUuZGVjb3JhdG9yc1swXTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbGluZURpZmZlcmVuY2UgPSBnZXRMaW5lRGlmZmVyZW5jZShub2RlLCBuZXh0Tm9kZSk7XG4gICAgICBjb25zdCBFWFBFQ1RFRF9MSU5FX0RJRkZFUkVOQ0UgPSBvcHRpb25zLmNvdW50ICsgMTtcblxuICAgICAgaWYgKGxpbmVEaWZmZXJlbmNlIDwgRVhQRUNURURfTElORV9ESUZGRVJFTkNFKSB7XG4gICAgICAgIGxldCBjb2x1bW4gPSBub2RlLmxvYy5zdGFydC5jb2x1bW47XG5cbiAgICAgICAgaWYgKG5vZGUubG9jLnN0YXJ0LmxpbmUgIT09IG5vZGUubG9jLmVuZC5saW5lKSB7XG4gICAgICAgICAgY29sdW1uID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICBsb2M6IHtcbiAgICAgICAgICAgIGxpbmU6IG5vZGUubG9jLmVuZC5saW5lLFxuICAgICAgICAgICAgY29sdW1uLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgbWVzc2FnZTogYEV4cGVjdGVkICR7b3B0aW9ucy5jb3VudH0gZW1wdHkgbGluZSR7b3B0aW9ucy5jb3VudCA+IDEgPyAncycgOiAnJ30gYWZ0ZXIgJHt0eXBlfSBzdGF0ZW1lbnQgbm90IGZvbGxvd2VkIGJ5IGFub3RoZXIgJHt0eXBlfS5gLFxuICAgICAgICAgIGZpeDogKGZpeGVyKSA9PiBmaXhlci5pbnNlcnRUZXh0QWZ0ZXIoXG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgJ1xcbicucmVwZWF0KEVYUEVDVEVEX0xJTkVfRElGRkVSRU5DRSAtIGxpbmVEaWZmZXJlbmNlKSxcbiAgICAgICAgICApLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb21tZW50QWZ0ZXJJbXBvcnQobm9kZSwgbmV4dENvbW1lbnQpIHtcbiAgICAgIGNvbnN0IGxpbmVEaWZmZXJlbmNlID0gZ2V0TGluZURpZmZlcmVuY2Uobm9kZSwgbmV4dENvbW1lbnQpO1xuICAgICAgY29uc3QgRVhQRUNURURfTElORV9ESUZGRVJFTkNFID0gb3B0aW9ucy5jb3VudCArIDE7XG5cbiAgICAgIGlmIChsaW5lRGlmZmVyZW5jZSA8IEVYUEVDVEVEX0xJTkVfRElGRkVSRU5DRSkge1xuICAgICAgICBsZXQgY29sdW1uID0gbm9kZS5sb2Muc3RhcnQuY29sdW1uO1xuXG4gICAgICAgIGlmIChub2RlLmxvYy5zdGFydC5saW5lICE9PSBub2RlLmxvYy5lbmQubGluZSkge1xuICAgICAgICAgIGNvbHVtbiA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgbG9jOiB7XG4gICAgICAgICAgICBsaW5lOiBub2RlLmxvYy5lbmQubGluZSxcbiAgICAgICAgICAgIGNvbHVtbixcbiAgICAgICAgICB9LFxuICAgICAgICAgIG1lc3NhZ2U6IGBFeHBlY3RlZCAke29wdGlvbnMuY291bnR9IGVtcHR5IGxpbmUke29wdGlvbnMuY291bnQgPiAxID8gJ3MnIDogJyd9IGFmdGVyIGltcG9ydCBzdGF0ZW1lbnQgbm90IGZvbGxvd2VkIGJ5IGFub3RoZXIgaW1wb3J0LmAsXG4gICAgICAgICAgZml4OiAoZml4ZXIpID0+IGZpeGVyLmluc2VydFRleHRBZnRlcihcbiAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICAnXFxuJy5yZXBlYXQoRVhQRUNURURfTElORV9ESUZGRVJFTkNFIC0gbGluZURpZmZlcmVuY2UpLFxuICAgICAgICAgICksXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluY3JlbWVudExldmVsKCkge1xuICAgICAgbGV2ZWwrKztcbiAgICB9XG4gICAgZnVuY3Rpb24gZGVjcmVtZW50TGV2ZWwoKSB7XG4gICAgICBsZXZlbC0tO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNoZWNrSW1wb3J0KG5vZGUpIHtcbiAgICAgIGNvbnN0IHsgcGFyZW50IH0gPSBub2RlO1xuXG4gICAgICBpZiAoIXBhcmVudCB8fCAhcGFyZW50LmJvZHkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBub2RlUG9zaXRpb24gPSBwYXJlbnQuYm9keS5pbmRleE9mKG5vZGUpO1xuICAgICAgY29uc3QgbmV4dE5vZGUgPSBwYXJlbnQuYm9keVtub2RlUG9zaXRpb24gKyAxXTtcbiAgICAgIGNvbnN0IGVuZExpbmUgPSBub2RlLmxvYy5lbmQubGluZTtcbiAgICAgIGxldCBuZXh0Q29tbWVudDtcblxuICAgICAgaWYgKHR5cGVvZiBwYXJlbnQuY29tbWVudHMgIT09ICd1bmRlZmluZWQnICYmIG9wdGlvbnMuY29uc2lkZXJDb21tZW50cykge1xuICAgICAgICBuZXh0Q29tbWVudCA9IHBhcmVudC5jb21tZW50cy5maW5kKChvKSA9PiBvLmxvYy5zdGFydC5saW5lID09PSBlbmRMaW5lICsgMSk7XG4gICAgICB9XG5cbiAgICAgIC8vIHNraXAgXCJleHBvcnQgaW1wb3J0XCJzXG4gICAgICBpZiAobm9kZS50eXBlID09PSAnVFNJbXBvcnRFcXVhbHNEZWNsYXJhdGlvbicgJiYgbm9kZS5pc0V4cG9ydCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChuZXh0Q29tbWVudCAmJiB0eXBlb2YgbmV4dENvbW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGNvbW1lbnRBZnRlckltcG9ydChub2RlLCBuZXh0Q29tbWVudCk7XG4gICAgICB9IGVsc2UgaWYgKG5leHROb2RlICYmIG5leHROb2RlLnR5cGUgIT09ICdJbXBvcnREZWNsYXJhdGlvbicgJiYgKG5leHROb2RlLnR5cGUgIT09ICdUU0ltcG9ydEVxdWFsc0RlY2xhcmF0aW9uJyB8fCBuZXh0Tm9kZS5pc0V4cG9ydCkpIHtcbiAgICAgICAgY2hlY2tGb3JOZXdMaW5lKG5vZGUsIG5leHROb2RlLCAnaW1wb3J0Jyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIEltcG9ydERlY2xhcmF0aW9uOiBjaGVja0ltcG9ydCxcbiAgICAgIFRTSW1wb3J0RXF1YWxzRGVjbGFyYXRpb246IGNoZWNrSW1wb3J0LFxuICAgICAgQ2FsbEV4cHJlc3Npb24obm9kZSkge1xuICAgICAgICBpZiAoaXNTdGF0aWNSZXF1aXJlKG5vZGUpICYmIGxldmVsID09PSAwKSB7XG4gICAgICAgICAgcmVxdWlyZUNhbGxzLnB1c2gobm9kZSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnUHJvZ3JhbTpleGl0JygpIHtcbiAgICAgICAgbG9nKCdleGl0IHByb2Nlc3NpbmcgZm9yJywgY29udGV4dC5nZXRQaHlzaWNhbEZpbGVuYW1lID8gY29udGV4dC5nZXRQaHlzaWNhbEZpbGVuYW1lKCkgOiBjb250ZXh0LmdldEZpbGVuYW1lKCkpO1xuICAgICAgICBjb25zdCBzY29wZUJvZHkgPSBnZXRTY29wZUJvZHkoY29udGV4dC5nZXRTY29wZSgpKTtcbiAgICAgICAgbG9nKCdnb3Qgc2NvcGU6Jywgc2NvcGVCb2R5KTtcblxuICAgICAgICByZXF1aXJlQ2FsbHMuZm9yRWFjaCgobm9kZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICBjb25zdCBub2RlUG9zaXRpb24gPSBmaW5kTm9kZUluZGV4SW5TY29wZUJvZHkoc2NvcGVCb2R5LCBub2RlKTtcbiAgICAgICAgICBsb2coJ25vZGUgcG9zaXRpb24gaW4gc2NvcGU6Jywgbm9kZVBvc2l0aW9uKTtcblxuICAgICAgICAgIGNvbnN0IHN0YXRlbWVudFdpdGhSZXF1aXJlQ2FsbCA9IHNjb3BlQm9keVtub2RlUG9zaXRpb25dO1xuICAgICAgICAgIGNvbnN0IG5leHRTdGF0ZW1lbnQgPSBzY29wZUJvZHlbbm9kZVBvc2l0aW9uICsgMV07XG4gICAgICAgICAgY29uc3QgbmV4dFJlcXVpcmVDYWxsID0gcmVxdWlyZUNhbGxzW2luZGV4ICsgMV07XG5cbiAgICAgICAgICBpZiAobmV4dFJlcXVpcmVDYWxsICYmIGNvbnRhaW5zTm9kZU9yRXF1YWwoc3RhdGVtZW50V2l0aFJlcXVpcmVDYWxsLCBuZXh0UmVxdWlyZUNhbGwpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgbmV4dFN0YXRlbWVudCAmJiAoXG4gICAgICAgICAgICAgICFuZXh0UmVxdWlyZUNhbGxcbiAgICAgICAgICAgICAgfHwgIWNvbnRhaW5zTm9kZU9yRXF1YWwobmV4dFN0YXRlbWVudCwgbmV4dFJlcXVpcmVDYWxsKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICkge1xuXG4gICAgICAgICAgICBjaGVja0Zvck5ld0xpbmUoc3RhdGVtZW50V2l0aFJlcXVpcmVDYWxsLCBuZXh0U3RhdGVtZW50LCAncmVxdWlyZScpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgRnVuY3Rpb25EZWNsYXJhdGlvbjogaW5jcmVtZW50TGV2ZWwsXG4gICAgICBGdW5jdGlvbkV4cHJlc3Npb246IGluY3JlbWVudExldmVsLFxuICAgICAgQXJyb3dGdW5jdGlvbkV4cHJlc3Npb246IGluY3JlbWVudExldmVsLFxuICAgICAgQmxvY2tTdGF0ZW1lbnQ6IGluY3JlbWVudExldmVsLFxuICAgICAgT2JqZWN0RXhwcmVzc2lvbjogaW5jcmVtZW50TGV2ZWwsXG4gICAgICBEZWNvcmF0b3I6IGluY3JlbWVudExldmVsLFxuICAgICAgJ0Z1bmN0aW9uRGVjbGFyYXRpb246ZXhpdCc6IGRlY3JlbWVudExldmVsLFxuICAgICAgJ0Z1bmN0aW9uRXhwcmVzc2lvbjpleGl0JzogZGVjcmVtZW50TGV2ZWwsXG4gICAgICAnQXJyb3dGdW5jdGlvbkV4cHJlc3Npb246ZXhpdCc6IGRlY3JlbWVudExldmVsLFxuICAgICAgJ0Jsb2NrU3RhdGVtZW50OmV4aXQnOiBkZWNyZW1lbnRMZXZlbCxcbiAgICAgICdPYmplY3RFeHByZXNzaW9uOmV4aXQnOiBkZWNyZW1lbnRMZXZlbCxcbiAgICAgICdEZWNvcmF0b3I6ZXhpdCc6IGRlY3JlbWVudExldmVsLFxuICAgIH07XG4gIH0sXG59O1xuIl19