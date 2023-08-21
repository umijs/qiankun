'use strict';var _declaredScope = require('eslint-module-utils/declaredScope');var _declaredScope2 = _interopRequireDefault(_declaredScope);
var _ExportMap = require('../ExportMap');var _ExportMap2 = _interopRequireDefault(_ExportMap);
var _importDeclaration = require('../importDeclaration');var _importDeclaration2 = _interopRequireDefault(_importDeclaration);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

function processBodyStatement(context, namespaces, declaration) {
  if (declaration.type !== 'ImportDeclaration') {return;}

  if (declaration.specifiers.length === 0) {return;}

  var imports = _ExportMap2['default'].get(declaration.source.value, context);
  if (imports == null) {return null;}

  if (imports.errors.length > 0) {
    imports.reportErrors(context, declaration);
    return;
  }

  declaration.specifiers.forEach(function (specifier) {
    switch (specifier.type) {
      case 'ImportNamespaceSpecifier':
        if (!imports.size) {
          context.report(
          specifier, 'No exported names found in module \'' + String(
          declaration.source.value) + '\'.');

        }
        namespaces.set(specifier.local.name, imports);
        break;
      case 'ImportDefaultSpecifier':
      case 'ImportSpecifier':{
          var meta = imports.get(
          // default to 'default' for default https://i.imgur.com/nj6qAWy.jpg
          specifier.imported ? specifier.imported.name || specifier.imported.value : 'default');

          if (!meta || !meta.namespace) {break;}
          namespaces.set(specifier.local.name, meta.namespace);
          break;
        }
      default:}

  });
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      category: 'Static analysis',
      description: 'Ensure imported namespaces contain dereferenced properties as they are dereferenced.',
      url: (0, _docsUrl2['default'])('namespace') },


    schema: [
    {
      type: 'object',
      properties: {
        allowComputed: {
          description: 'If `false`, will report computed (and thus, un-lintable) references to namespace members.',
          type: 'boolean',
          'default': false } },


      additionalProperties: false }] },




  create: function () {function namespaceRule(context) {
      // read options
      var _ref =

      context.options[0] || {},_ref$allowComputed = _ref.allowComputed,allowComputed = _ref$allowComputed === undefined ? false : _ref$allowComputed;

      var namespaces = new Map();

      function makeMessage(last, namepath) {
        return '\'' + String(last.name) + '\' not found in ' + (namepath.length > 1 ? 'deeply ' : '') + 'imported namespace \'' + String(namepath.join('.')) + '\'.';
      }

      return {
        // pick up all imports at body entry time, to properly respect hoisting
        Program: function () {function Program(_ref2) {var body = _ref2.body;
            body.forEach(function (x) {processBodyStatement(context, namespaces, x);});
          }return Program;}(),

        // same as above, but does not add names to local map
        ExportNamespaceSpecifier: function () {function ExportNamespaceSpecifier(namespace) {
            var declaration = (0, _importDeclaration2['default'])(context);

            var imports = _ExportMap2['default'].get(declaration.source.value, context);
            if (imports == null) {return null;}

            if (imports.errors.length) {
              imports.reportErrors(context, declaration);
              return;
            }

            if (!imports.size) {
              context.report(
              namespace, 'No exported names found in module \'' + String(
              declaration.source.value) + '\'.');

            }
          }return ExportNamespaceSpecifier;}(),

        // todo: check for possible redefinition

        MemberExpression: function () {function MemberExpression(dereference) {
            if (dereference.object.type !== 'Identifier') {return;}
            if (!namespaces.has(dereference.object.name)) {return;}
            if ((0, _declaredScope2['default'])(context, dereference.object.name) !== 'module') {return;}

            if (dereference.parent.type === 'AssignmentExpression' && dereference.parent.left === dereference) {
              context.report(
              dereference.parent, 'Assignment to member of namespace \'' + String(
              dereference.object.name) + '\'.');

            }

            // go deep
            var namespace = namespaces.get(dereference.object.name);
            var namepath = [dereference.object.name];
            // while property is namespace and parent is member expression, keep validating
            while (namespace instanceof _ExportMap2['default'] && dereference.type === 'MemberExpression') {
              if (dereference.computed) {
                if (!allowComputed) {
                  context.report(
                  dereference.property, 'Unable to validate computed reference to imported namespace \'' + String(
                  dereference.object.name) + '\'.');

                }
                return;
              }

              if (!namespace.has(dereference.property.name)) {
                context.report(
                dereference.property,
                makeMessage(dereference.property, namepath));

                break;
              }

              var exported = namespace.get(dereference.property.name);
              if (exported == null) {return;}

              // stash and pop
              namepath.push(dereference.property.name);
              namespace = exported.namespace;
              dereference = dereference.parent;
            }
          }return MemberExpression;}(),

        VariableDeclarator: function () {function VariableDeclarator(_ref3) {var id = _ref3.id,init = _ref3.init;
            if (init == null) {return;}
            if (init.type !== 'Identifier') {return;}
            if (!namespaces.has(init.name)) {return;}

            // check for redefinition in intermediate scopes
            if ((0, _declaredScope2['default'])(context, init.name) !== 'module') {return;}

            // DFS traverse child namespaces
            function testKey(pattern, namespace) {var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [init.name];
              if (!(namespace instanceof _ExportMap2['default'])) {return;}

              if (pattern.type !== 'ObjectPattern') {return;}var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {

                for (var _iterator = pattern.properties[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var property = _step.value;
                  if (
                  property.type === 'ExperimentalRestProperty' ||
                  property.type === 'RestElement' ||
                  !property.key)
                  {
                    continue;
                  }

                  if (property.key.type !== 'Identifier') {
                    context.report({
                      node: property,
                      message: 'Only destructure top-level names.' });

                    continue;
                  }

                  if (!namespace.has(property.key.name)) {
                    context.report({
                      node: property,
                      message: makeMessage(property.key, path) });

                    continue;
                  }

                  path.push(property.key.name);
                  var dependencyExportMap = namespace.get(property.key.name);
                  // could be null when ignored or ambiguous
                  if (dependencyExportMap !== null) {
                    testKey(property.value, dependencyExportMap.namespace, path);
                  }
                  path.pop();
                }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator['return']) {_iterator['return']();}} finally {if (_didIteratorError) {throw _iteratorError;}}}
            }

            testKey(id, namespaces.get(init.name));
          }return VariableDeclarator;}(),

        JSXMemberExpression: function () {function JSXMemberExpression(_ref4) {var object = _ref4.object,property = _ref4.property;
            if (!namespaces.has(object.name)) {return;}
            var namespace = namespaces.get(object.name);
            if (!namespace.has(property.name)) {
              context.report({
                node: property,
                message: makeMessage(property, [object.name]) });

            }
          }return JSXMemberExpression;}() };

    }return namespaceRule;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uYW1lc3BhY2UuanMiXSwibmFtZXMiOlsicHJvY2Vzc0JvZHlTdGF0ZW1lbnQiLCJjb250ZXh0IiwibmFtZXNwYWNlcyIsImRlY2xhcmF0aW9uIiwidHlwZSIsInNwZWNpZmllcnMiLCJsZW5ndGgiLCJpbXBvcnRzIiwiRXhwb3J0cyIsImdldCIsInNvdXJjZSIsInZhbHVlIiwiZXJyb3JzIiwicmVwb3J0RXJyb3JzIiwiZm9yRWFjaCIsInNwZWNpZmllciIsInNpemUiLCJyZXBvcnQiLCJzZXQiLCJsb2NhbCIsIm5hbWUiLCJtZXRhIiwiaW1wb3J0ZWQiLCJuYW1lc3BhY2UiLCJtb2R1bGUiLCJleHBvcnRzIiwiZG9jcyIsImNhdGVnb3J5IiwiZGVzY3JpcHRpb24iLCJ1cmwiLCJzY2hlbWEiLCJwcm9wZXJ0aWVzIiwiYWxsb3dDb21wdXRlZCIsImFkZGl0aW9uYWxQcm9wZXJ0aWVzIiwiY3JlYXRlIiwibmFtZXNwYWNlUnVsZSIsIm9wdGlvbnMiLCJNYXAiLCJtYWtlTWVzc2FnZSIsImxhc3QiLCJuYW1lcGF0aCIsImpvaW4iLCJQcm9ncmFtIiwiYm9keSIsIngiLCJFeHBvcnROYW1lc3BhY2VTcGVjaWZpZXIiLCJNZW1iZXJFeHByZXNzaW9uIiwiZGVyZWZlcmVuY2UiLCJvYmplY3QiLCJoYXMiLCJwYXJlbnQiLCJsZWZ0IiwiY29tcHV0ZWQiLCJwcm9wZXJ0eSIsImV4cG9ydGVkIiwicHVzaCIsIlZhcmlhYmxlRGVjbGFyYXRvciIsImlkIiwiaW5pdCIsInRlc3RLZXkiLCJwYXR0ZXJuIiwicGF0aCIsImtleSIsIm5vZGUiLCJtZXNzYWdlIiwiZGVwZW5kZW5jeUV4cG9ydE1hcCIsInBvcCIsIkpTWE1lbWJlckV4cHJlc3Npb24iXSwibWFwcGluZ3MiOiJhQUFBLGtFO0FBQ0EseUM7QUFDQSx5RDtBQUNBLHFDOztBQUVBLFNBQVNBLG9CQUFULENBQThCQyxPQUE5QixFQUF1Q0MsVUFBdkMsRUFBbURDLFdBQW5ELEVBQWdF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QyxJQUEzQixDQUE1QjtBQUNBO0FBQ0Esc0JBQUk2Qyx3QkFBd0IsSUFBNUIsRUFBa0M7QUFDaENOLDRCQUFRTixTQUFTMUMsS0FBakIsRUFBd0JzRCxvQkFBb0IxQyxTQUE1QyxFQUF1RHNDLElBQXZEO0FBQ0Q7QUFDREEsdUJBQUtLLEdBQUw7QUFDRCxpQkFyQ3NEO0FBc0N4RDs7QUFFRFAsb0JBQVFGLEVBQVIsRUFBWXZELFdBQVdPLEdBQVgsQ0FBZWlELEtBQUt0QyxJQUFwQixDQUFaO0FBQ0QsV0EzSEk7O0FBNkhMK0MsMkJBN0hLLG1EQTZIcUMsS0FBcEJuQixNQUFvQixTQUFwQkEsTUFBb0IsQ0FBWkssUUFBWSxTQUFaQSxRQUFZO0FBQ3hDLGdCQUFJLENBQUNuRCxXQUFXK0MsR0FBWCxDQUFlRCxPQUFPNUIsSUFBdEIsQ0FBTCxFQUFrQyxDQUFFLE9BQVM7QUFDN0MsZ0JBQU1HLFlBQVlyQixXQUFXTyxHQUFYLENBQWV1QyxPQUFPNUIsSUFBdEIsQ0FBbEI7QUFDQSxnQkFBSSxDQUFDRyxVQUFVMEIsR0FBVixDQUFjSSxTQUFTakMsSUFBdkIsQ0FBTCxFQUFtQztBQUNqQ25CLHNCQUFRZ0IsTUFBUixDQUFlO0FBQ2I4QyxzQkFBTVYsUUFETztBQUViVyx5QkFBUzFCLFlBQVllLFFBQVosRUFBc0IsQ0FBQ0wsT0FBTzVCLElBQVIsQ0FBdEIsQ0FGSSxFQUFmOztBQUlEO0FBQ0YsV0F0SUksZ0NBQVA7O0FBd0lELEtBcEpELE9BQWlCZSxhQUFqQixJQXhCZSxFQUFqQiIsImZpbGUiOiJuYW1lc3BhY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZGVjbGFyZWRTY29wZSBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL2RlY2xhcmVkU2NvcGUnO1xuaW1wb3J0IEV4cG9ydHMgZnJvbSAnLi4vRXhwb3J0TWFwJztcbmltcG9ydCBpbXBvcnREZWNsYXJhdGlvbiBmcm9tICcuLi9pbXBvcnREZWNsYXJhdGlvbic7XG5pbXBvcnQgZG9jc1VybCBmcm9tICcuLi9kb2NzVXJsJztcblxuZnVuY3Rpb24gcHJvY2Vzc0JvZHlTdGF0ZW1lbnQoY29udGV4dCwgbmFtZXNwYWNlcywgZGVjbGFyYXRpb24pIHtcbiAgaWYgKGRlY2xhcmF0aW9uLnR5cGUgIT09ICdJbXBvcnREZWNsYXJhdGlvbicpIHsgcmV0dXJuOyB9XG5cbiAgaWYgKGRlY2xhcmF0aW9uLnNwZWNpZmllcnMubGVuZ3RoID09PSAwKSB7IHJldHVybjsgfVxuXG4gIGNvbnN0IGltcG9ydHMgPSBFeHBvcnRzLmdldChkZWNsYXJhdGlvbi5zb3VyY2UudmFsdWUsIGNvbnRleHQpO1xuICBpZiAoaW1wb3J0cyA9PSBudWxsKSB7IHJldHVybiBudWxsOyB9XG5cbiAgaWYgKGltcG9ydHMuZXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICBpbXBvcnRzLnJlcG9ydEVycm9ycyhjb250ZXh0LCBkZWNsYXJhdGlvbik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZGVjbGFyYXRpb24uc3BlY2lmaWVycy5mb3JFYWNoKChzcGVjaWZpZXIpID0+IHtcbiAgICBzd2l0Y2ggKHNwZWNpZmllci50eXBlKSB7XG4gICAgICBjYXNlICdJbXBvcnROYW1lc3BhY2VTcGVjaWZpZXInOlxuICAgICAgICBpZiAoIWltcG9ydHMuc2l6ZSkge1xuICAgICAgICAgIGNvbnRleHQucmVwb3J0KFxuICAgICAgICAgICAgc3BlY2lmaWVyLFxuICAgICAgICAgICAgYE5vIGV4cG9ydGVkIG5hbWVzIGZvdW5kIGluIG1vZHVsZSAnJHtkZWNsYXJhdGlvbi5zb3VyY2UudmFsdWV9Jy5gLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgbmFtZXNwYWNlcy5zZXQoc3BlY2lmaWVyLmxvY2FsLm5hbWUsIGltcG9ydHMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ0ltcG9ydERlZmF1bHRTcGVjaWZpZXInOlxuICAgICAgY2FzZSAnSW1wb3J0U3BlY2lmaWVyJzoge1xuICAgICAgICBjb25zdCBtZXRhID0gaW1wb3J0cy5nZXQoXG4gICAgICAgIC8vIGRlZmF1bHQgdG8gJ2RlZmF1bHQnIGZvciBkZWZhdWx0IGh0dHBzOi8vaS5pbWd1ci5jb20vbmo2cUFXeS5qcGdcbiAgICAgICAgICBzcGVjaWZpZXIuaW1wb3J0ZWQgPyBzcGVjaWZpZXIuaW1wb3J0ZWQubmFtZSB8fCBzcGVjaWZpZXIuaW1wb3J0ZWQudmFsdWUgOiAnZGVmYXVsdCcsXG4gICAgICAgICk7XG4gICAgICAgIGlmICghbWV0YSB8fCAhbWV0YS5uYW1lc3BhY2UpIHsgYnJlYWs7IH1cbiAgICAgICAgbmFtZXNwYWNlcy5zZXQoc3BlY2lmaWVyLmxvY2FsLm5hbWUsIG1ldGEubmFtZXNwYWNlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgIH1cbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3Byb2JsZW0nLFxuICAgIGRvY3M6IHtcbiAgICAgIGNhdGVnb3J5OiAnU3RhdGljIGFuYWx5c2lzJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRW5zdXJlIGltcG9ydGVkIG5hbWVzcGFjZXMgY29udGFpbiBkZXJlZmVyZW5jZWQgcHJvcGVydGllcyBhcyB0aGV5IGFyZSBkZXJlZmVyZW5jZWQuJyxcbiAgICAgIHVybDogZG9jc1VybCgnbmFtZXNwYWNlJyksXG4gICAgfSxcblxuICAgIHNjaGVtYTogW1xuICAgICAge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIGFsbG93Q29tcHV0ZWQ6IHtcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnSWYgYGZhbHNlYCwgd2lsbCByZXBvcnQgY29tcHV0ZWQgKGFuZCB0aHVzLCB1bi1saW50YWJsZSkgcmVmZXJlbmNlcyB0byBuYW1lc3BhY2UgbWVtYmVycy4nLFxuICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgYWRkaXRpb25hbFByb3BlcnRpZXM6IGZhbHNlLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuXG4gIGNyZWF0ZTogZnVuY3Rpb24gbmFtZXNwYWNlUnVsZShjb250ZXh0KSB7XG4gICAgLy8gcmVhZCBvcHRpb25zXG4gICAgY29uc3Qge1xuICAgICAgYWxsb3dDb21wdXRlZCA9IGZhbHNlLFxuICAgIH0gPSBjb250ZXh0Lm9wdGlvbnNbMF0gfHwge307XG5cbiAgICBjb25zdCBuYW1lc3BhY2VzID0gbmV3IE1hcCgpO1xuXG4gICAgZnVuY3Rpb24gbWFrZU1lc3NhZ2UobGFzdCwgbmFtZXBhdGgpIHtcbiAgICAgIHJldHVybiBgJyR7bGFzdC5uYW1lfScgbm90IGZvdW5kIGluICR7bmFtZXBhdGgubGVuZ3RoID4gMSA/ICdkZWVwbHkgJyA6ICcnfWltcG9ydGVkIG5hbWVzcGFjZSAnJHtuYW1lcGF0aC5qb2luKCcuJyl9Jy5gO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAvLyBwaWNrIHVwIGFsbCBpbXBvcnRzIGF0IGJvZHkgZW50cnkgdGltZSwgdG8gcHJvcGVybHkgcmVzcGVjdCBob2lzdGluZ1xuICAgICAgUHJvZ3JhbSh7IGJvZHkgfSkge1xuICAgICAgICBib2R5LmZvckVhY2goKHgpID0+IHsgcHJvY2Vzc0JvZHlTdGF0ZW1lbnQoY29udGV4dCwgbmFtZXNwYWNlcywgeCk7IH0pO1xuICAgICAgfSxcblxuICAgICAgLy8gc2FtZSBhcyBhYm92ZSwgYnV0IGRvZXMgbm90IGFkZCBuYW1lcyB0byBsb2NhbCBtYXBcbiAgICAgIEV4cG9ydE5hbWVzcGFjZVNwZWNpZmllcihuYW1lc3BhY2UpIHtcbiAgICAgICAgY29uc3QgZGVjbGFyYXRpb24gPSBpbXBvcnREZWNsYXJhdGlvbihjb250ZXh0KTtcblxuICAgICAgICBjb25zdCBpbXBvcnRzID0gRXhwb3J0cy5nZXQoZGVjbGFyYXRpb24uc291cmNlLnZhbHVlLCBjb250ZXh0KTtcbiAgICAgICAgaWYgKGltcG9ydHMgPT0gbnVsbCkgeyByZXR1cm4gbnVsbDsgfVxuXG4gICAgICAgIGlmIChpbXBvcnRzLmVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgICBpbXBvcnRzLnJlcG9ydEVycm9ycyhjb250ZXh0LCBkZWNsYXJhdGlvbik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpbXBvcnRzLnNpemUpIHtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydChcbiAgICAgICAgICAgIG5hbWVzcGFjZSxcbiAgICAgICAgICAgIGBObyBleHBvcnRlZCBuYW1lcyBmb3VuZCBpbiBtb2R1bGUgJyR7ZGVjbGFyYXRpb24uc291cmNlLnZhbHVlfScuYCxcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvLyB0b2RvOiBjaGVjayBmb3IgcG9zc2libGUgcmVkZWZpbml0aW9uXG5cbiAgICAgIE1lbWJlckV4cHJlc3Npb24oZGVyZWZlcmVuY2UpIHtcbiAgICAgICAgaWYgKGRlcmVmZXJlbmNlLm9iamVjdC50eXBlICE9PSAnSWRlbnRpZmllcicpIHsgcmV0dXJuOyB9XG4gICAgICAgIGlmICghbmFtZXNwYWNlcy5oYXMoZGVyZWZlcmVuY2Uub2JqZWN0Lm5hbWUpKSB7IHJldHVybjsgfVxuICAgICAgICBpZiAoZGVjbGFyZWRTY29wZShjb250ZXh0LCBkZXJlZmVyZW5jZS5vYmplY3QubmFtZSkgIT09ICdtb2R1bGUnKSB7IHJldHVybjsgfVxuXG4gICAgICAgIGlmIChkZXJlZmVyZW5jZS5wYXJlbnQudHlwZSA9PT0gJ0Fzc2lnbm1lbnRFeHByZXNzaW9uJyAmJiBkZXJlZmVyZW5jZS5wYXJlbnQubGVmdCA9PT0gZGVyZWZlcmVuY2UpIHtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydChcbiAgICAgICAgICAgIGRlcmVmZXJlbmNlLnBhcmVudCxcbiAgICAgICAgICAgIGBBc3NpZ25tZW50IHRvIG1lbWJlciBvZiBuYW1lc3BhY2UgJyR7ZGVyZWZlcmVuY2Uub2JqZWN0Lm5hbWV9Jy5gLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBnbyBkZWVwXG4gICAgICAgIGxldCBuYW1lc3BhY2UgPSBuYW1lc3BhY2VzLmdldChkZXJlZmVyZW5jZS5vYmplY3QubmFtZSk7XG4gICAgICAgIGNvbnN0IG5hbWVwYXRoID0gW2RlcmVmZXJlbmNlLm9iamVjdC5uYW1lXTtcbiAgICAgICAgLy8gd2hpbGUgcHJvcGVydHkgaXMgbmFtZXNwYWNlIGFuZCBwYXJlbnQgaXMgbWVtYmVyIGV4cHJlc3Npb24sIGtlZXAgdmFsaWRhdGluZ1xuICAgICAgICB3aGlsZSAobmFtZXNwYWNlIGluc3RhbmNlb2YgRXhwb3J0cyAmJiBkZXJlZmVyZW5jZS50eXBlID09PSAnTWVtYmVyRXhwcmVzc2lvbicpIHtcbiAgICAgICAgICBpZiAoZGVyZWZlcmVuY2UuY29tcHV0ZWQpIHtcbiAgICAgICAgICAgIGlmICghYWxsb3dDb21wdXRlZCkge1xuICAgICAgICAgICAgICBjb250ZXh0LnJlcG9ydChcbiAgICAgICAgICAgICAgICBkZXJlZmVyZW5jZS5wcm9wZXJ0eSxcbiAgICAgICAgICAgICAgICBgVW5hYmxlIHRvIHZhbGlkYXRlIGNvbXB1dGVkIHJlZmVyZW5jZSB0byBpbXBvcnRlZCBuYW1lc3BhY2UgJyR7ZGVyZWZlcmVuY2Uub2JqZWN0Lm5hbWV9Jy5gLFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghbmFtZXNwYWNlLmhhcyhkZXJlZmVyZW5jZS5wcm9wZXJ0eS5uYW1lKSkge1xuICAgICAgICAgICAgY29udGV4dC5yZXBvcnQoXG4gICAgICAgICAgICAgIGRlcmVmZXJlbmNlLnByb3BlcnR5LFxuICAgICAgICAgICAgICBtYWtlTWVzc2FnZShkZXJlZmVyZW5jZS5wcm9wZXJ0eSwgbmFtZXBhdGgpLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IGV4cG9ydGVkID0gbmFtZXNwYWNlLmdldChkZXJlZmVyZW5jZS5wcm9wZXJ0eS5uYW1lKTtcbiAgICAgICAgICBpZiAoZXhwb3J0ZWQgPT0gbnVsbCkgeyByZXR1cm47IH1cblxuICAgICAgICAgIC8vIHN0YXNoIGFuZCBwb3BcbiAgICAgICAgICBuYW1lcGF0aC5wdXNoKGRlcmVmZXJlbmNlLnByb3BlcnR5Lm5hbWUpO1xuICAgICAgICAgIG5hbWVzcGFjZSA9IGV4cG9ydGVkLm5hbWVzcGFjZTtcbiAgICAgICAgICBkZXJlZmVyZW5jZSA9IGRlcmVmZXJlbmNlLnBhcmVudDtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgVmFyaWFibGVEZWNsYXJhdG9yKHsgaWQsIGluaXQgfSkge1xuICAgICAgICBpZiAoaW5pdCA9PSBudWxsKSB7IHJldHVybjsgfVxuICAgICAgICBpZiAoaW5pdC50eXBlICE9PSAnSWRlbnRpZmllcicpIHsgcmV0dXJuOyB9XG4gICAgICAgIGlmICghbmFtZXNwYWNlcy5oYXMoaW5pdC5uYW1lKSkgeyByZXR1cm47IH1cblxuICAgICAgICAvLyBjaGVjayBmb3IgcmVkZWZpbml0aW9uIGluIGludGVybWVkaWF0ZSBzY29wZXNcbiAgICAgICAgaWYgKGRlY2xhcmVkU2NvcGUoY29udGV4dCwgaW5pdC5uYW1lKSAhPT0gJ21vZHVsZScpIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgLy8gREZTIHRyYXZlcnNlIGNoaWxkIG5hbWVzcGFjZXNcbiAgICAgICAgZnVuY3Rpb24gdGVzdEtleShwYXR0ZXJuLCBuYW1lc3BhY2UsIHBhdGggPSBbaW5pdC5uYW1lXSkge1xuICAgICAgICAgIGlmICghKG5hbWVzcGFjZSBpbnN0YW5jZW9mIEV4cG9ydHMpKSB7IHJldHVybjsgfVxuXG4gICAgICAgICAgaWYgKHBhdHRlcm4udHlwZSAhPT0gJ09iamVjdFBhdHRlcm4nKSB7IHJldHVybjsgfVxuXG4gICAgICAgICAgZm9yIChjb25zdCBwcm9wZXJ0eSBvZiBwYXR0ZXJuLnByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgcHJvcGVydHkudHlwZSA9PT0gJ0V4cGVyaW1lbnRhbFJlc3RQcm9wZXJ0eSdcbiAgICAgICAgICAgICAgfHwgcHJvcGVydHkudHlwZSA9PT0gJ1Jlc3RFbGVtZW50J1xuICAgICAgICAgICAgICB8fCAhcHJvcGVydHkua2V5XG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eS5rZXkudHlwZSAhPT0gJ0lkZW50aWZpZXInKSB7XG4gICAgICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgICAgICBub2RlOiBwcm9wZXJ0eSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAnT25seSBkZXN0cnVjdHVyZSB0b3AtbGV2ZWwgbmFtZXMuJyxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIW5hbWVzcGFjZS5oYXMocHJvcGVydHkua2V5Lm5hbWUpKSB7XG4gICAgICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgICAgICBub2RlOiBwcm9wZXJ0eSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBtYWtlTWVzc2FnZShwcm9wZXJ0eS5rZXksIHBhdGgpLFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHBhdGgucHVzaChwcm9wZXJ0eS5rZXkubmFtZSk7XG4gICAgICAgICAgICBjb25zdCBkZXBlbmRlbmN5RXhwb3J0TWFwID0gbmFtZXNwYWNlLmdldChwcm9wZXJ0eS5rZXkubmFtZSk7XG4gICAgICAgICAgICAvLyBjb3VsZCBiZSBudWxsIHdoZW4gaWdub3JlZCBvciBhbWJpZ3VvdXNcbiAgICAgICAgICAgIGlmIChkZXBlbmRlbmN5RXhwb3J0TWFwICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgIHRlc3RLZXkocHJvcGVydHkudmFsdWUsIGRlcGVuZGVuY3lFeHBvcnRNYXAubmFtZXNwYWNlLCBwYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBhdGgucG9wKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGVzdEtleShpZCwgbmFtZXNwYWNlcy5nZXQoaW5pdC5uYW1lKSk7XG4gICAgICB9LFxuXG4gICAgICBKU1hNZW1iZXJFeHByZXNzaW9uKHsgb2JqZWN0LCBwcm9wZXJ0eSB9KSB7XG4gICAgICAgIGlmICghbmFtZXNwYWNlcy5oYXMob2JqZWN0Lm5hbWUpKSB7IHJldHVybjsgfVxuICAgICAgICBjb25zdCBuYW1lc3BhY2UgPSBuYW1lc3BhY2VzLmdldChvYmplY3QubmFtZSk7XG4gICAgICAgIGlmICghbmFtZXNwYWNlLmhhcyhwcm9wZXJ0eS5uYW1lKSkge1xuICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgIG5vZGU6IHByb3BlcnR5LFxuICAgICAgICAgICAgbWVzc2FnZTogbWFrZU1lc3NhZ2UocHJvcGVydHksIFtvYmplY3QubmFtZV0pLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH07XG4gIH0sXG59O1xuIl19