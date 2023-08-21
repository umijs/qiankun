'use strict';




var _minimatch = require('minimatch');var _minimatch2 = _interopRequireDefault(_minimatch);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
/**
 * @fileoverview Rule to disallow namespace import
 * @author Radek Benkel
 */module.exports = { meta: { type: 'suggestion',
    docs: {
      category: 'Style guide',
      description: 'Forbid namespace (a.k.a. "wildcard" `*`) imports.',
      url: (0, _docsUrl2['default'])('no-namespace') },

    fixable: 'code',
    schema: [{
      type: 'object',
      properties: {
        ignore: {
          type: 'array',
          items: {
            type: 'string' },

          uniqueItems: true } } }] },





  create: function () {function create(context) {
      var firstOption = context.options[0] || {};
      var ignoreGlobs = firstOption.ignore;

      return {
        ImportNamespaceSpecifier: function () {function ImportNamespaceSpecifier(node) {
            if (ignoreGlobs && ignoreGlobs.find(function (glob) {return (0, _minimatch2['default'])(node.parent.source.value, glob, { matchBase: true });})) {
              return;
            }

            var scopeVariables = context.getScope().variables;
            var namespaceVariable = scopeVariables.find(function (variable) {return variable.defs[0].node === node;});
            var namespaceReferences = namespaceVariable.references;
            var namespaceIdentifiers = namespaceReferences.map(function (reference) {return reference.identifier;});
            var canFix = namespaceIdentifiers.length > 0 && !usesNamespaceAsObject(namespaceIdentifiers);

            context.report({
              node: node,
              message: 'Unexpected namespace import.',
              fix: canFix && function (fixer) {
                var scopeManager = context.getSourceCode().scopeManager;
                var fixes = [];

                // Pass 1: Collect variable names that are already in scope for each reference we want
                // to transform, so that we can be sure that we choose non-conflicting import names
                var importNameConflicts = {};
                namespaceIdentifiers.forEach(function (identifier) {
                  var parent = identifier.parent;
                  if (parent && parent.type === 'MemberExpression') {
                    var importName = getMemberPropertyName(parent);
                    var localConflicts = getVariableNamesInScope(scopeManager, parent);
                    if (!importNameConflicts[importName]) {
                      importNameConflicts[importName] = localConflicts;
                    } else {
                      localConflicts.forEach(function (c) {return importNameConflicts[importName].add(c);});
                    }
                  }
                });

                // Choose new names for each import
                var importNames = Object.keys(importNameConflicts);
                var importLocalNames = generateLocalNames(
                importNames,
                importNameConflicts,
                namespaceVariable.name);


                // Replace the ImportNamespaceSpecifier with a list of ImportSpecifiers
                var namedImportSpecifiers = importNames.map(function (importName) {return importName === importLocalNames[importName] ?
                  importName : String(
                  importName) + ' as ' + String(importLocalNames[importName]);});

                fixes.push(fixer.replaceText(node, '{ ' + String(namedImportSpecifiers.join(', ')) + ' }'));

                // Pass 2: Replace references to the namespace with references to the named imports
                namespaceIdentifiers.forEach(function (identifier) {
                  var parent = identifier.parent;
                  if (parent && parent.type === 'MemberExpression') {
                    var importName = getMemberPropertyName(parent);
                    fixes.push(fixer.replaceText(parent, importLocalNames[importName]));
                  }
                });

                return fixes;
              } });

          }return ImportNamespaceSpecifier;}() };

    }return create;}() };


/**
                           * @param {Identifier[]} namespaceIdentifiers
                           * @returns {boolean} `true` if the namespace variable is more than just a glorified constant
                           */
function usesNamespaceAsObject(namespaceIdentifiers) {
  return !namespaceIdentifiers.every(function (identifier) {
    var parent = identifier.parent;

    // `namespace.x` or `namespace['x']`
    return (
      parent &&
      parent.type === 'MemberExpression' && (
      parent.property.type === 'Identifier' || parent.property.type === 'Literal'));

  });
}

/**
   * @param {MemberExpression} memberExpression
   * @returns {string} the name of the member in the object expression, e.g. the `x` in `namespace.x`
   */
function getMemberPropertyName(memberExpression) {
  return memberExpression.property.type === 'Identifier' ?
  memberExpression.property.name :
  memberExpression.property.value;
}

/**
   * @param {ScopeManager} scopeManager
   * @param {ASTNode} node
   * @return {Set<string>}
   */
function getVariableNamesInScope(scopeManager, node) {
  var currentNode = node;
  var scope = scopeManager.acquire(currentNode);
  while (scope == null) {
    currentNode = currentNode.parent;
    scope = scopeManager.acquire(currentNode, true);
  }
  return new Set(scope.variables.concat(scope.upper.variables).map(function (variable) {return variable.name;}));
}

/**
   *
   * @param {*} names
   * @param {*} nameConflicts
   * @param {*} namespaceName
   */
function generateLocalNames(names, nameConflicts, namespaceName) {
  var localNames = {};
  names.forEach(function (name) {
    var localName = void 0;
    if (!nameConflicts[name].has(name)) {
      localName = name;
    } else if (!nameConflicts[name].has(String(namespaceName) + '_' + String(name))) {
      localName = String(namespaceName) + '_' + String(name);
    } else {
      for (var i = 1; i < Infinity; i++) {
        if (!nameConflicts[name].has(String(namespaceName) + '_' + String(name) + '_' + String(i))) {
          localName = String(namespaceName) + '_' + String(name) + '_' + String(i);
          break;
        }
      }
    }
    localNames[name] = localName;
  });
  return localNames;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1uYW1lc3BhY2UuanMiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0cyIsIm1ldGEiLCJ0eXBlIiwiZG9jcyIsImNhdGVnb3J5IiwiZGVzY3JpcHRpb24iLCJ1cmwiLCJmaXhhYmxlIiwic2NoZW1hIiwicHJvcGVydGllcyIsImlnbm9yZSIsIml0ZW1zIiwidW5pcXVlSXRlbXMiLCJjcmVhdGUiLCJjb250ZXh0IiwiZmlyc3RPcHRpb24iLCJvcHRpb25zIiwiaWdub3JlR2xvYnMiLCJJbXBvcnROYW1lc3BhY2VTcGVjaWZpZXIiLCJub2RlIiwiZmluZCIsImdsb2IiLCJwYXJlbnQiLCJzb3VyY2UiLCJ2YWx1ZSIsIm1hdGNoQmFzZSIsInNjb3BlVmFyaWFibGVzIiwiZ2V0U2NvcGUiLCJ2YXJpYWJsZXMiLCJuYW1lc3BhY2VWYXJpYWJsZSIsInZhcmlhYmxlIiwiZGVmcyIsIm5hbWVzcGFjZVJlZmVyZW5jZXMiLCJyZWZlcmVuY2VzIiwibmFtZXNwYWNlSWRlbnRpZmllcnMiLCJtYXAiLCJyZWZlcmVuY2UiLCJpZGVudGlmaWVyIiwiY2FuRml4IiwibGVuZ3RoIiwidXNlc05hbWVzcGFjZUFzT2JqZWN0IiwicmVwb3J0IiwibWVzc2FnZSIsImZpeCIsImZpeGVyIiwic2NvcGVNYW5hZ2VyIiwiZ2V0U291cmNlQ29kZSIsImZpeGVzIiwiaW1wb3J0TmFtZUNvbmZsaWN0cyIsImZvckVhY2giLCJpbXBvcnROYW1lIiwiZ2V0TWVtYmVyUHJvcGVydHlOYW1lIiwibG9jYWxDb25mbGljdHMiLCJnZXRWYXJpYWJsZU5hbWVzSW5TY29wZSIsImMiLCJhZGQiLCJpbXBvcnROYW1lcyIsIk9iamVjdCIsImtleXMiLCJpbXBvcnRMb2NhbE5hbWVzIiwiZ2VuZXJhdGVMb2NhbE5hbWVzIiwibmFtZSIsIm5hbWVkSW1wb3J0U3BlY2lmaWVycyIsInB1c2giLCJyZXBsYWNlVGV4dCIsImpvaW4iLCJldmVyeSIsInByb3BlcnR5IiwibWVtYmVyRXhwcmVzc2lvbiIsImN1cnJlbnROb2RlIiwic2NvcGUiLCJhY3F1aXJlIiwiU2V0IiwiY29uY2F0IiwidXBwZXIiLCJuYW1lcyIsIm5hbWVDb25mbGljdHMiLCJuYW1lc3BhY2VOYW1lIiwibG9jYWxOYW1lcyIsImxvY2FsTmFtZSIsImhhcyIsImkiLCJJbmZpbml0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFLQSxzQztBQUNBLHFDOztBQUVBO0FBQ0E7QUFDQTtBQVZBOzs7R0FZQUEsT0FBT0MsT0FBUCxHQUFpQixFQUNmQyxNQUFNLEVBQ0pDLE1BQU0sWUFERjtBQUVKQyxVQUFNO0FBQ0pDLGdCQUFVLGFBRE47QUFFSkMsbUJBQWEsbURBRlQ7QUFHSkMsV0FBSywwQkFBUSxjQUFSLENBSEQsRUFGRjs7QUFPSkMsYUFBUyxNQVBMO0FBUUpDLFlBQVEsQ0FBQztBQUNQTixZQUFNLFFBREM7QUFFUE8sa0JBQVk7QUFDVkMsZ0JBQVE7QUFDTlIsZ0JBQU0sT0FEQTtBQUVOUyxpQkFBTztBQUNMVCxrQkFBTSxRQURELEVBRkQ7O0FBS05VLHVCQUFhLElBTFAsRUFERSxFQUZMLEVBQUQsQ0FSSixFQURTOzs7Ozs7QUF1QmZDLFFBdkJlLCtCQXVCUkMsT0F2QlEsRUF1QkM7QUFDZCxVQUFNQyxjQUFjRCxRQUFRRSxPQUFSLENBQWdCLENBQWhCLEtBQXNCLEVBQTFDO0FBQ0EsVUFBTUMsY0FBY0YsWUFBWUwsTUFBaEM7O0FBRUEsYUFBTztBQUNMUSxnQ0FESyxpREFDb0JDLElBRHBCLEVBQzBCO0FBQzdCLGdCQUFJRixlQUFlQSxZQUFZRyxJQUFaLENBQWlCLFVBQUNDLElBQUQsVUFBVSw0QkFBVUYsS0FBS0csTUFBTCxDQUFZQyxNQUFaLENBQW1CQyxLQUE3QixFQUFvQ0gsSUFBcEMsRUFBMEMsRUFBRUksV0FBVyxJQUFiLEVBQTFDLENBQVYsRUFBakIsQ0FBbkIsRUFBK0c7QUFDN0c7QUFDRDs7QUFFRCxnQkFBTUMsaUJBQWlCWixRQUFRYSxRQUFSLEdBQW1CQyxTQUExQztBQUNBLGdCQUFNQyxvQkFB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QW9CbUIsR0FBcEIsQ0FBd0JuQixJQUF4QixDQUFMLEVBQW9DO0FBQ2xDa0Isa0JBQVlsQixJQUFaO0FBQ0QsS0FGRCxNQUVPLElBQUksQ0FBQ2UsY0FBY2YsSUFBZCxFQUFvQm1CLEdBQXBCLFFBQTJCSCxhQUEzQixpQkFBNENoQixJQUE1QyxFQUFMLEVBQTBEO0FBQy9Ea0IseUJBQWVGLGFBQWYsaUJBQWdDaEIsSUFBaEM7QUFDRCxLQUZNLE1BRUE7QUFDTCxXQUFLLElBQUlvQixJQUFJLENBQWIsRUFBZ0JBLElBQUlDLFFBQXBCLEVBQThCRCxHQUE5QixFQUFtQztBQUNqQyxZQUFJLENBQUNMLGNBQWNmLElBQWQsRUFBb0JtQixHQUFwQixRQUEyQkgsYUFBM0IsaUJBQTRDaEIsSUFBNUMsaUJBQW9Eb0IsQ0FBcEQsRUFBTCxFQUErRDtBQUM3REYsNkJBQWVGLGFBQWYsaUJBQWdDaEIsSUFBaEMsaUJBQXdDb0IsQ0FBeEM7QUFDQTtBQUNEO0FBQ0Y7QUFDRjtBQUNESCxlQUFXakIsSUFBWCxJQUFtQmtCLFNBQW5CO0FBQ0QsR0FmRDtBQWdCQSxTQUFPRCxVQUFQO0FBQ0QiLCJmaWxlIjoibm8tbmFtZXNwYWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IFJ1bGUgdG8gZGlzYWxsb3cgbmFtZXNwYWNlIGltcG9ydFxuICogQGF1dGhvciBSYWRlayBCZW5rZWxcbiAqL1xuXG5pbXBvcnQgbWluaW1hdGNoIGZyb20gJ21pbmltYXRjaCc7XG5pbXBvcnQgZG9jc1VybCBmcm9tICcuLi9kb2NzVXJsJztcblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFJ1bGUgRGVmaW5pdGlvblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1ldGE6IHtcbiAgICB0eXBlOiAnc3VnZ2VzdGlvbicsXG4gICAgZG9jczoge1xuICAgICAgY2F0ZWdvcnk6ICdTdHlsZSBndWlkZScsXG4gICAgICBkZXNjcmlwdGlvbjogJ0ZvcmJpZCBuYW1lc3BhY2UgKGEuay5hLiBcIndpbGRjYXJkXCIgYCpgKSBpbXBvcnRzLicsXG4gICAgICB1cmw6IGRvY3NVcmwoJ25vLW5hbWVzcGFjZScpLFxuICAgIH0sXG4gICAgZml4YWJsZTogJ2NvZGUnLFxuICAgIHNjaGVtYTogW3tcbiAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBpZ25vcmU6IHtcbiAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHVuaXF1ZUl0ZW1zOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9XSxcbiAgfSxcblxuICBjcmVhdGUoY29udGV4dCkge1xuICAgIGNvbnN0IGZpcnN0T3B0aW9uID0gY29udGV4dC5vcHRpb25zWzBdIHx8IHt9O1xuICAgIGNvbnN0IGlnbm9yZUdsb2JzID0gZmlyc3RPcHRpb24uaWdub3JlO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIEltcG9ydE5hbWVzcGFjZVNwZWNpZmllcihub2RlKSB7XG4gICAgICAgIGlmIChpZ25vcmVHbG9icyAmJiBpZ25vcmVHbG9icy5maW5kKChnbG9iKSA9PiBtaW5pbWF0Y2gobm9kZS5wYXJlbnQuc291cmNlLnZhbHVlLCBnbG9iLCB7IG1hdGNoQmFzZTogdHJ1ZSB9KSkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzY29wZVZhcmlhYmxlcyA9IGNvbnRleHQuZ2V0U2NvcGUoKS52YXJpYWJsZXM7XG4gICAgICAgIGNvbnN0IG5hbWVzcGFjZVZhcmlhYmxlID0gc2NvcGVWYXJpYWJsZXMuZmluZCgodmFyaWFibGUpID0+IHZhcmlhYmxlLmRlZnNbMF0ubm9kZSA9PT0gbm9kZSk7XG4gICAgICAgIGNvbnN0IG5hbWVzcGFjZVJlZmVyZW5jZXMgPSBuYW1lc3BhY2VWYXJpYWJsZS5yZWZlcmVuY2VzO1xuICAgICAgICBjb25zdCBuYW1lc3BhY2VJZGVudGlmaWVycyA9IG5hbWVzcGFjZVJlZmVyZW5jZXMubWFwKChyZWZlcmVuY2UpID0+IHJlZmVyZW5jZS5pZGVudGlmaWVyKTtcbiAgICAgICAgY29uc3QgY2FuRml4ID0gbmFtZXNwYWNlSWRlbnRpZmllcnMubGVuZ3RoID4gMCAmJiAhdXNlc05hbWVzcGFjZUFzT2JqZWN0KG5hbWVzcGFjZUlkZW50aWZpZXJzKTtcblxuICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgbm9kZSxcbiAgICAgICAgICBtZXNzYWdlOiBgVW5leHBlY3RlZCBuYW1lc3BhY2UgaW1wb3J0LmAsXG4gICAgICAgICAgZml4OiBjYW5GaXggJiYgKChmaXhlcikgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc2NvcGVNYW5hZ2VyID0gY29udGV4dC5nZXRTb3VyY2VDb2RlKCkuc2NvcGVNYW5hZ2VyO1xuICAgICAgICAgICAgY29uc3QgZml4ZXMgPSBbXTtcblxuICAgICAgICAgICAgLy8gUGFzcyAxOiBDb2xsZWN0IHZhcmlhYmxlIG5hbWVzIHRoYXQgYXJlIGFscmVhZHkgaW4gc2NvcGUgZm9yIGVhY2ggcmVmZXJlbmNlIHdlIHdhbnRcbiAgICAgICAgICAgIC8vIHRvIHRyYW5zZm9ybSwgc28gdGhhdCB3ZSBjYW4gYmUgc3VyZSB0aGF0IHdlIGNob29zZSBub24tY29uZmxpY3RpbmcgaW1wb3J0IG5hbWVzXG4gICAgICAgICAgICBjb25zdCBpbXBvcnROYW1lQ29uZmxpY3RzID0ge307XG4gICAgICAgICAgICBuYW1lc3BhY2VJZGVudGlmaWVycy5mb3JFYWNoKChpZGVudGlmaWVyKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IHBhcmVudCA9IGlkZW50aWZpZXIucGFyZW50O1xuICAgICAgICAgICAgICBpZiAocGFyZW50ICYmIHBhcmVudC50eXBlID09PSAnTWVtYmVyRXhwcmVzc2lvbicpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbXBvcnROYW1lID0gZ2V0TWVtYmVyUHJvcGVydHlOYW1lKHBhcmVudCk7XG4gICAgICAgICAgICAgICAgY29uc3QgbG9jYWxDb25mbGljdHMgPSBnZXRWYXJpYWJsZU5hbWVzSW5TY29wZShzY29wZU1hbmFnZXIsIHBhcmVudCk7XG4gICAgICAgICAgICAgICAgaWYgKCFpbXBvcnROYW1lQ29uZmxpY3RzW2ltcG9ydE5hbWVdKSB7XG4gICAgICAgICAgICAgICAgICBpbXBvcnROYW1lQ29uZmxpY3RzW2ltcG9ydE5hbWVdID0gbG9jYWxDb25mbGljdHM7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGxvY2FsQ29uZmxpY3RzLmZvckVhY2goKGMpID0+IGltcG9ydE5hbWVDb25mbGljdHNbaW1wb3J0TmFtZV0uYWRkKGMpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBDaG9vc2UgbmV3IG5hbWVzIGZvciBlYWNoIGltcG9ydFxuICAgICAgICAgICAgY29uc3QgaW1wb3J0TmFtZXMgPSBPYmplY3Qua2V5cyhpbXBvcnROYW1lQ29uZmxpY3RzKTtcbiAgICAgICAgICAgIGNvbnN0IGltcG9ydExvY2FsTmFtZXMgPSBnZW5lcmF0ZUxvY2FsTmFtZXMoXG4gICAgICAgICAgICAgIGltcG9ydE5hbWVzLFxuICAgICAgICAgICAgICBpbXBvcnROYW1lQ29uZmxpY3RzLFxuICAgICAgICAgICAgICBuYW1lc3BhY2VWYXJpYWJsZS5uYW1lLFxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgLy8gUmVwbGFjZSB0aGUgSW1wb3J0TmFtZXNwYWNlU3BlY2lmaWVyIHdpdGggYSBsaXN0IG9mIEltcG9ydFNwZWNpZmllcnNcbiAgICAgICAgICAgIGNvbnN0IG5hbWVkSW1wb3J0U3BlY2lmaWVycyA9IGltcG9ydE5hbWVzLm1hcCgoaW1wb3J0TmFtZSkgPT4gaW1wb3J0TmFtZSA9PT0gaW1wb3J0TG9jYWxOYW1lc1tpbXBvcnROYW1lXVxuICAgICAgICAgICAgICA/IGltcG9ydE5hbWVcbiAgICAgICAgICAgICAgOiBgJHtpbXBvcnROYW1lfSBhcyAke2ltcG9ydExvY2FsTmFtZXNbaW1wb3J0TmFtZV19YCxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBmaXhlcy5wdXNoKGZpeGVyLnJlcGxhY2VUZXh0KG5vZGUsIGB7ICR7bmFtZWRJbXBvcnRTcGVjaWZpZXJzLmpvaW4oJywgJyl9IH1gKSk7XG5cbiAgICAgICAgICAgIC8vIFBhc3MgMjogUmVwbGFjZSByZWZlcmVuY2VzIHRvIHRoZSBuYW1lc3BhY2Ugd2l0aCByZWZlcmVuY2VzIHRvIHRoZSBuYW1lZCBpbXBvcnRzXG4gICAgICAgICAgICBuYW1lc3BhY2VJZGVudGlmaWVycy5mb3JFYWNoKChpZGVudGlmaWVyKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IHBhcmVudCA9IGlkZW50aWZpZXIucGFyZW50O1xuICAgICAgICAgICAgICBpZiAocGFyZW50ICYmIHBhcmVudC50eXBlID09PSAnTWVtYmVyRXhwcmVzc2lvbicpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbXBvcnROYW1lID0gZ2V0TWVtYmVyUHJvcGVydHlOYW1lKHBhcmVudCk7XG4gICAgICAgICAgICAgICAgZml4ZXMucHVzaChmaXhlci5yZXBsYWNlVGV4dChwYXJlbnQsIGltcG9ydExvY2FsTmFtZXNbaW1wb3J0TmFtZV0pKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBmaXhlcztcbiAgICAgICAgICB9KSxcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH07XG4gIH0sXG59O1xuXG4vKipcbiAqIEBwYXJhbSB7SWRlbnRpZmllcltdfSBuYW1lc3BhY2VJZGVudGlmaWVyc1xuICogQHJldHVybnMge2Jvb2xlYW59IGB0cnVlYCBpZiB0aGUgbmFtZXNwYWNlIHZhcmlhYmxlIGlzIG1vcmUgdGhhbiBqdXN0IGEgZ2xvcmlmaWVkIGNvbnN0YW50XG4gKi9cbmZ1bmN0aW9uIHVzZXNOYW1lc3BhY2VBc09iamVjdChuYW1lc3BhY2VJZGVudGlmaWVycykge1xuICByZXR1cm4gIW5hbWVzcGFjZUlkZW50aWZpZXJzLmV2ZXJ5KChpZGVudGlmaWVyKSA9PiB7XG4gICAgY29uc3QgcGFyZW50ID0gaWRlbnRpZmllci5wYXJlbnQ7XG5cbiAgICAvLyBgbmFtZXNwYWNlLnhgIG9yIGBuYW1lc3BhY2VbJ3gnXWBcbiAgICByZXR1cm4gKFxuICAgICAgcGFyZW50XG4gICAgICAmJiBwYXJlbnQudHlwZSA9PT0gJ01lbWJlckV4cHJlc3Npb24nXG4gICAgICAmJiAocGFyZW50LnByb3BlcnR5LnR5cGUgPT09ICdJZGVudGlmaWVyJyB8fCBwYXJlbnQucHJvcGVydHkudHlwZSA9PT0gJ0xpdGVyYWwnKVxuICAgICk7XG4gIH0pO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7TWVtYmVyRXhwcmVzc2lvbn0gbWVtYmVyRXhwcmVzc2lvblxuICogQHJldHVybnMge3N0cmluZ30gdGhlIG5hbWUgb2YgdGhlIG1lbWJlciBpbiB0aGUgb2JqZWN0IGV4cHJlc3Npb24sIGUuZy4gdGhlIGB4YCBpbiBgbmFtZXNwYWNlLnhgXG4gKi9cbmZ1bmN0aW9uIGdldE1lbWJlclByb3BlcnR5TmFtZShtZW1iZXJFeHByZXNzaW9uKSB7XG4gIHJldHVybiBtZW1iZXJFeHByZXNzaW9uLnByb3BlcnR5LnR5cGUgPT09ICdJZGVudGlmaWVyJ1xuICAgID8gbWVtYmVyRXhwcmVzc2lvbi5wcm9wZXJ0eS5uYW1lXG4gICAgOiBtZW1iZXJFeHByZXNzaW9uLnByb3BlcnR5LnZhbHVlO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7U2NvcGVNYW5hZ2VyfSBzY29wZU1hbmFnZXJcbiAqIEBwYXJhbSB7QVNUTm9kZX0gbm9kZVxuICogQHJldHVybiB7U2V0PHN0cmluZz59XG4gKi9cbmZ1bmN0aW9uIGdldFZhcmlhYmxlTmFtZXNJblNjb3BlKHNjb3BlTWFuYWdlciwgbm9kZSkge1xuICBsZXQgY3VycmVudE5vZGUgPSBub2RlO1xuICBsZXQgc2NvcGUgPSBzY29wZU1hbmFnZXIuYWNxdWlyZShjdXJyZW50Tm9kZSk7XG4gIHdoaWxlIChzY29wZSA9PSBudWxsKSB7XG4gICAgY3VycmVudE5vZGUgPSBjdXJyZW50Tm9kZS5wYXJlbnQ7XG4gICAgc2NvcGUgPSBzY29wZU1hbmFnZXIuYWNxdWlyZShjdXJyZW50Tm9kZSwgdHJ1ZSk7XG4gIH1cbiAgcmV0dXJuIG5ldyBTZXQoc2NvcGUudmFyaWFibGVzLmNvbmNhdChzY29wZS51cHBlci52YXJpYWJsZXMpLm1hcCgodmFyaWFibGUpID0+IHZhcmlhYmxlLm5hbWUpKTtcbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIHsqfSBuYW1lc1xuICogQHBhcmFtIHsqfSBuYW1lQ29uZmxpY3RzXG4gKiBAcGFyYW0geyp9IG5hbWVzcGFjZU5hbWVcbiAqL1xuZnVuY3Rpb24gZ2VuZXJhdGVMb2NhbE5hbWVzKG5hbWVzLCBuYW1lQ29uZmxpY3RzLCBuYW1lc3BhY2VOYW1lKSB7XG4gIGNvbnN0IGxvY2FsTmFtZXMgPSB7fTtcbiAgbmFtZXMuZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgIGxldCBsb2NhbE5hbWU7XG4gICAgaWYgKCFuYW1lQ29uZmxpY3RzW25hbWVdLmhhcyhuYW1lKSkge1xuICAgICAgbG9jYWxOYW1lID0gbmFtZTtcbiAgICB9IGVsc2UgaWYgKCFuYW1lQ29uZmxpY3RzW25hbWVdLmhhcyhgJHtuYW1lc3BhY2VOYW1lfV8ke25hbWV9YCkpIHtcbiAgICAgIGxvY2FsTmFtZSA9IGAke25hbWVzcGFjZU5hbWV9XyR7bmFtZX1gO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCBpID0gMTsgaSA8IEluZmluaXR5OyBpKyspIHtcbiAgICAgICAgaWYgKCFuYW1lQ29uZmxpY3RzW25hbWVdLmhhcyhgJHtuYW1lc3BhY2VOYW1lfV8ke25hbWV9XyR7aX1gKSkge1xuICAgICAgICAgIGxvY2FsTmFtZSA9IGAke25hbWVzcGFjZU5hbWV9XyR7bmFtZX1fJHtpfWA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgbG9jYWxOYW1lc1tuYW1lXSA9IGxvY2FsTmFtZTtcbiAgfSk7XG4gIHJldHVybiBsb2NhbE5hbWVzO1xufVxuIl19