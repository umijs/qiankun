'use strict';var _declaredScope = require('eslint-module-utils/declaredScope');var _declaredScope2 = _interopRequireDefault(_declaredScope);
var _ExportMap = require('../ExportMap');var _ExportMap2 = _interopRequireDefault(_ExportMap);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

function message(deprecation) {
  return 'Deprecated' + (deprecation.description ? ': ' + String(deprecation.description) : '.');
}

function getDeprecation(metadata) {
  if (!metadata || !metadata.doc) {return;}

  return metadata.doc.tags.find(function (t) {return t.title === 'deprecated';});
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Helpful warnings',
      description: 'Forbid imported names marked with `@deprecated` documentation tag.',
      url: (0, _docsUrl2['default'])('no-deprecated') },

    schema: [] },


  create: function () {function create(context) {
      var deprecated = new Map();
      var namespaces = new Map();

      function checkSpecifiers(node) {
        if (node.type !== 'ImportDeclaration') {return;}
        if (node.source == null) {return;} // local export, ignore

        var imports = _ExportMap2['default'].get(node.source.value, context);
        if (imports == null) {return;}

        var moduleDeprecation = imports.doc && imports.doc.tags.find(function (t) {return t.title === 'deprecated';});
        if (moduleDeprecation) {
          context.report({ node: node, message: message(moduleDeprecation) });
        }

        if (imports.errors.length) {
          imports.reportErrors(context, node);
          return;
        }

        node.specifiers.forEach(function (im) {
          var imported = void 0;var local = void 0;
          switch (im.type) {

            case 'ImportNamespaceSpecifier':{
                if (!imports.size) {return;}
                namespaces.set(im.local.name, imports);
                return;
              }

            case 'ImportDefaultSpecifier':
              imported = 'default';
              local = im.local.name;
              break;

            case 'ImportSpecifier':
              imported = im.imported.name;
              local = im.local.name;
              break;

            default:return; // can't handle this one
          }

          // unknown thing can't be deprecated
          var exported = imports.get(imported);
          if (exported == null) {return;}

          // capture import of deep namespace
          if (exported.namespace) {namespaces.set(local, exported.namespace);}

          var deprecation = getDeprecation(imports.get(imported));
          if (!deprecation) {return;}

          context.report({ node: im, message: message(deprecation) });

          deprecated.set(local, deprecation);

        });
      }

      return {
        Program: function () {function Program(_ref) {var body = _ref.body;return body.forEach(checkSpecifiers);}return Program;}(),

        Identifier: function () {function Identifier(node) {
            if (node.parent.type === 'MemberExpression' && node.parent.property === node) {
              return; // handled by MemberExpression
            }

            // ignore specifier identifiers
            if (node.parent.type.slice(0, 6) === 'Import') {return;}

            if (!deprecated.has(node.name)) {return;}

            if ((0, _declaredScope2['default'])(context, node.name) !== 'module') {return;}
            context.report({
              node: node,
              message: message(deprecated.get(node.name)) });

          }return Identifier;}(),

        MemberExpression: function () {function MemberExpression(dereference) {
            if (dereference.object.type !== 'Identifier') {return;}
            if (!namespaces.has(dereference.object.name)) {return;}

            if ((0, _declaredScope2['default'])(context, dereference.object.name) !== 'module') {return;}

            // go deep
            var namespace = namespaces.get(dereference.object.name);
            var namepath = [dereference.object.name];
            // while property is namespace and parent is member expression, keep validating
            while (namespace instanceof _ExportMap2['default'] && dereference.type === 'MemberExpression') {
              // ignore computed parts for now
              if (dereference.computed) {return;}

              var metadata = namespace.get(dereference.property.name);

              if (!metadata) {break;}
              var deprecation = getDeprecation(metadata);

              if (deprecation) {
                context.report({ node: dereference.property, message: message(deprecation) });
              }

              // stash and pop
              namepath.push(dereference.property.name);
              namespace = metadata.namespace;
              dereference = dereference.parent;
            }
          }return MemberExpression;}() };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1kZXByZWNhdGVkLmpzIl0sIm5hbWVzIjpbIm1lc3NhZ2UiLCJkZXByZWNhdGlvbiIsImRlc2NyaXB0aW9uIiwiZ2V0RGVwcmVjYXRpb24iLCJtZXRhZGF0YSIsImRvYyIsInRhZ3MiLCJmaW5kIiwidCIsInRpdGxlIiwibW9kdWxlIiwiZXhwb3J0cyIsIm1ldGEiLCJ0eXBlIiwiZG9jcyIsImNhdGVnb3J5IiwidXJsIiwic2NoZW1hIiwiY3JlYXRlIiwiY29udGV4dCIsImRlcHJlY2F0ZWQiLCJNYXAiLCJuYW1lc3BhY2VzIiwiY2hlY2tTcGVjaWZpZXJzIiwibm9kZSIsInNvdXJjZSIsImltcG9ydHMiLCJFeHBvcnRzIiwiZ2V0IiwidmFsdWUiLCJtb2R1bGVEZXByZWNhdGlvbiIsInJlcG9ydCIsImVycm9ycyIsImxlbmd0aCIsInJlcG9ydEVycm9ycyIsInNwZWNpZmllcnMiLCJmb3JFYWNoIiwiaW0iLCJpbXBvcnRlZCIsImxvY2FsIiwic2l6ZSIsInNldCIsIm5hbWUiLCJleHBvcnRlZCIsIm5hbWVzcGFjZSIsIlByb2dyYW0iLCJib2R5IiwiSWRlbnRpZmllciIsInBhcmVudCIsInByb3BlcnR5Iiwic2xpY2UiLCJoYXMiLCJNZW1iZXJFeHByZXNzaW9uIiwiZGVyZWZlcmVuY2UiLCJvYmplY3QiLCJuYW1lcGF0aCIsImNvbXB1dGVkIiwicHVzaCJdLCJtYXBwaW5ncyI6ImFBQUEsa0U7QUFDQSx5QztBQUNBLHFDOztBQUVBLFNBQVNBLE9BQVQsQ0FBaUJDLFdBQWpCLEVBQThCO0FBQzVCLHlCQUFvQkEsWUFBWUMsV0FBWixpQkFBK0JELFlBQVlDLFdBQTNDLElBQTJELEdBQS9FO0FBQ0Q7O0FBRUQsU0FBU0MsY0FBVCxDQUF3QkMsUUFBeEIsRUFBa0M7QUFDaEMsTUFBSSxDQUFDQSxRQUFELElBQWEsQ0FBQ0EsU0FBU0MsR0FBM0IsRUFBZ0MsQ0FBRSxPQUFTOztBQUUzQyxTQUFPRCxTQUFTQyxHQUFULENBQWFD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SUUsWUFBWXRCLFdBQVdNLEdBQVgsQ0FBZXlCLFlBQVlDLE1BQVosQ0FBbUJaLElBQWxDLENBQWhCO0FBQ0EsZ0JBQU1hLFdBQVcsQ0FBQ0YsWUFBWUMsTUFBWixDQUFtQlosSUFBcEIsQ0FBakI7QUFDQTtBQUNBLG1CQUFPRSxxQkFBcUJqQixzQkFBckIsSUFBZ0MwQixZQUFZeEMsSUFBWixLQUFxQixrQkFBNUQsRUFBZ0Y7QUFDOUU7QUFDQSxrQkFBSXdDLFlBQVlHLFFBQWhCLEVBQTBCLENBQUUsT0FBUzs7QUFFckMsa0JBQU1wRCxXQUFXd0MsVUFBVWhCLEdBQVYsQ0FBY3lCLFlBQVlKLFFBQVosQ0FBcUJQLElBQW5DLENBQWpCOztBQUVBLGtCQUFJLENBQUN0QyxRQUFMLEVBQWUsQ0FBRSxNQUFRO0FBQ3pCLGtCQUFNSCxjQUFjRSxlQUFlQyxRQUFmLENBQXBCOztBQUVBLGtCQUFJSCxXQUFKLEVBQWlCO0FBQ2ZrQix3QkFBUVksTUFBUixDQUFlLEVBQUVQLE1BQU02QixZQUFZSixRQUFwQixFQUE4QmpELFNBQVNBLFFBQVFDLFdBQVIsQ0FBdkMsRUFBZjtBQUNEOztBQUVEO0FBQ0FzRCx1QkFBU0UsSUFBVCxDQUFjSixZQUFZSixRQUFaLENBQXFCUCxJQUFuQztBQUNBRSwwQkFBWXhDLFNBQVN3QyxTQUFyQjtBQUNBUyw0QkFBY0EsWUFBWUwsTUFBMUI7QUFDRDtBQUNGLFdBaERJLDZCQUFQOztBQWtERCxLQTFIYyxtQkFBakIiLCJmaWxlIjoibm8tZGVwcmVjYXRlZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkZWNsYXJlZFNjb3BlIGZyb20gJ2VzbGludC1tb2R1bGUtdXRpbHMvZGVjbGFyZWRTY29wZSc7XG5pbXBvcnQgRXhwb3J0cyBmcm9tICcuLi9FeHBvcnRNYXAnO1xuaW1wb3J0IGRvY3NVcmwgZnJvbSAnLi4vZG9jc1VybCc7XG5cbmZ1bmN0aW9uIG1lc3NhZ2UoZGVwcmVjYXRpb24pIHtcbiAgcmV0dXJuIGBEZXByZWNhdGVkJHtkZXByZWNhdGlvbi5kZXNjcmlwdGlvbiA/IGA6ICR7ZGVwcmVjYXRpb24uZGVzY3JpcHRpb259YCA6ICcuJ31gO1xufVxuXG5mdW5jdGlvbiBnZXREZXByZWNhdGlvbihtZXRhZGF0YSkge1xuICBpZiAoIW1ldGFkYXRhIHx8ICFtZXRhZGF0YS5kb2MpIHsgcmV0dXJuOyB9XG5cbiAgcmV0dXJuIG1ldGFkYXRhLmRvYy50YWdzLmZpbmQoKHQpID0+IHQudGl0bGUgPT09ICdkZXByZWNhdGVkJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3N1Z2dlc3Rpb24nLFxuICAgIGRvY3M6IHtcbiAgICAgIGNhdGVnb3J5OiAnSGVscGZ1bCB3YXJuaW5ncycsXG4gICAgICBkZXNjcmlwdGlvbjogJ0ZvcmJpZCBpbXBvcnRlZCBuYW1lcyBtYXJrZWQgd2l0aCBgQGRlcHJlY2F0ZWRgIGRvY3VtZW50YXRpb24gdGFnLicsXG4gICAgICB1cmw6IGRvY3NVcmwoJ25vLWRlcHJlY2F0ZWQnKSxcbiAgICB9LFxuICAgIHNjaGVtYTogW10sXG4gIH0sXG5cbiAgY3JlYXRlKGNvbnRleHQpIHtcbiAgICBjb25zdCBkZXByZWNhdGVkID0gbmV3IE1hcCgpO1xuICAgIGNvbnN0IG5hbWVzcGFjZXMgPSBuZXcgTWFwKCk7XG5cbiAgICBmdW5jdGlvbiBjaGVja1NwZWNpZmllcnMobm9kZSkge1xuICAgICAgaWYgKG5vZGUudHlwZSAhPT0gJ0ltcG9ydERlY2xhcmF0aW9uJykgeyByZXR1cm47IH1cbiAgICAgIGlmIChub2RlLnNvdXJjZSA9PSBudWxsKSB7IHJldHVybjsgfSAvLyBsb2NhbCBleHBvcnQsIGlnbm9yZVxuXG4gICAgICBjb25zdCBpbXBvcnRzID0gRXhwb3J0cy5nZXQobm9kZS5zb3VyY2UudmFsdWUsIGNvbnRleHQpO1xuICAgICAgaWYgKGltcG9ydHMgPT0gbnVsbCkgeyByZXR1cm47IH1cblxuICAgICAgY29uc3QgbW9kdWxlRGVwcmVjYXRpb24gPSBpbXBvcnRzLmRvYyAmJiBpbXBvcnRzLmRvYy50YWdzLmZpbmQoKHQpID0+IHQudGl0bGUgPT09ICdkZXByZWNhdGVkJyk7XG4gICAgICBpZiAobW9kdWxlRGVwcmVjYXRpb24pIHtcbiAgICAgICAgY29udGV4dC5yZXBvcnQoeyBub2RlLCBtZXNzYWdlOiBtZXNzYWdlKG1vZHVsZURlcHJlY2F0aW9uKSB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKGltcG9ydHMuZXJyb3JzLmxlbmd0aCkge1xuICAgICAgICBpbXBvcnRzLnJlcG9ydEVycm9ycyhjb250ZXh0LCBub2RlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBub2RlLnNwZWNpZmllcnMuZm9yRWFjaChmdW5jdGlvbiAoaW0pIHtcbiAgICAgICAgbGV0IGltcG9ydGVkOyBsZXQgbG9jYWw7XG4gICAgICAgIHN3aXRjaCAoaW0udHlwZSkge1xuXG4gICAgICAgICAgY2FzZSAnSW1wb3J0TmFtZXNwYWNlU3BlY2lmaWVyJzoge1xuICAgICAgICAgICAgaWYgKCFpbXBvcnRzLnNpemUpIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICBuYW1lc3BhY2VzLnNldChpbS5sb2NhbC5uYW1lLCBpbXBvcnRzKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjYXNlICdJbXBvcnREZWZhdWx0U3BlY2lmaWVyJzpcbiAgICAgICAgICAgIGltcG9ydGVkID0gJ2RlZmF1bHQnO1xuICAgICAgICAgICAgbG9jYWwgPSBpbS5sb2NhbC5uYW1lO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlICdJbXBvcnRTcGVjaWZpZXInOlxuICAgICAgICAgICAgaW1wb3J0ZWQgPSBpbS5pbXBvcnRlZC5uYW1lO1xuICAgICAgICAgICAgbG9jYWwgPSBpbS5sb2NhbC5uYW1lO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBkZWZhdWx0OiByZXR1cm47IC8vIGNhbid0IGhhbmRsZSB0aGlzIG9uZVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gdW5rbm93biB0aGluZyBjYW4ndCBiZSBkZXByZWNhdGVkXG4gICAgICAgIGNvbnN0IGV4cG9ydGVkID0gaW1wb3J0cy5nZXQoaW1wb3J0ZWQpO1xuICAgICAgICBpZiAoZXhwb3J0ZWQgPT0gbnVsbCkgeyByZXR1cm47IH1cblxuICAgICAgICAvLyBjYXB0dXJlIGltcG9ydCBvZiBkZWVwIG5hbWVzcGFjZVxuICAgICAgICBpZiAoZXhwb3J0ZWQubmFtZXNwYWNlKSB7IG5hbWVzcGFjZXMuc2V0KGxvY2FsLCBleHBvcnRlZC5uYW1lc3BhY2UpOyB9XG5cbiAgICAgICAgY29uc3QgZGVwcmVjYXRpb24gPSBnZXREZXByZWNhdGlvbihpbXBvcnRzLmdldChpbXBvcnRlZCkpO1xuICAgICAgICBpZiAoIWRlcHJlY2F0aW9uKSB7IHJldHVybjsgfVxuXG4gICAgICAgIGNvbnRleHQucmVwb3J0KHsgbm9kZTogaW0sIG1lc3NhZ2U6IG1lc3NhZ2UoZGVwcmVjYXRpb24pIH0pO1xuXG4gICAgICAgIGRlcHJlY2F0ZWQuc2V0KGxvY2FsLCBkZXByZWNhdGlvbik7XG5cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBQcm9ncmFtOiAoeyBib2R5IH0pID0+IGJvZHkuZm9yRWFjaChjaGVja1NwZWNpZmllcnMpLFxuXG4gICAgICBJZGVudGlmaWVyKG5vZGUpIHtcbiAgICAgICAgaWYgKG5vZGUucGFyZW50LnR5cGUgPT09ICdNZW1iZXJFeHByZXNzaW9uJyAmJiBub2RlLnBhcmVudC5wcm9wZXJ0eSA9PT0gbm9kZSkge1xuICAgICAgICAgIHJldHVybjsgLy8gaGFuZGxlZCBieSBNZW1iZXJFeHByZXNzaW9uXG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZ25vcmUgc3BlY2lmaWVyIGlkZW50aWZpZXJzXG4gICAgICAgIGlmIChub2RlLnBhcmVudC50eXBlLnNsaWNlKDAsIDYpID09PSAnSW1wb3J0JykgeyByZXR1cm47IH1cblxuICAgICAgICBpZiAoIWRlcHJlY2F0ZWQuaGFzKG5vZGUubmFtZSkpIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgaWYgKGRlY2xhcmVkU2NvcGUoY29udGV4dCwgbm9kZS5uYW1lKSAhPT0gJ21vZHVsZScpIHsgcmV0dXJuOyB9XG4gICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICBub2RlLFxuICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UoZGVwcmVjYXRlZC5nZXQobm9kZS5uYW1lKSksXG4gICAgICAgIH0pO1xuICAgICAgfSxcblxuICAgICAgTWVtYmVyRXhwcmVzc2lvbihkZXJlZmVyZW5jZSkge1xuICAgICAgICBpZiAoZGVyZWZlcmVuY2Uub2JqZWN0LnR5cGUgIT09ICdJZGVudGlmaWVyJykgeyByZXR1cm47IH1cbiAgICAgICAgaWYgKCFuYW1lc3BhY2VzLmhhcyhkZXJlZmVyZW5jZS5vYmplY3QubmFtZSkpIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgaWYgKGRlY2xhcmVkU2NvcGUoY29udGV4dCwgZGVyZWZlcmVuY2Uub2JqZWN0Lm5hbWUpICE9PSAnbW9kdWxlJykgeyByZXR1cm47IH1cblxuICAgICAgICAvLyBnbyBkZWVwXG4gICAgICAgIGxldCBuYW1lc3BhY2UgPSBuYW1lc3BhY2VzLmdldChkZXJlZmVyZW5jZS5vYmplY3QubmFtZSk7XG4gICAgICAgIGNvbnN0IG5hbWVwYXRoID0gW2RlcmVmZXJlbmNlLm9iamVjdC5uYW1lXTtcbiAgICAgICAgLy8gd2hpbGUgcHJvcGVydHkgaXMgbmFtZXNwYWNlIGFuZCBwYXJlbnQgaXMgbWVtYmVyIGV4cHJlc3Npb24sIGtlZXAgdmFsaWRhdGluZ1xuICAgICAgICB3aGlsZSAobmFtZXNwYWNlIGluc3RhbmNlb2YgRXhwb3J0cyAmJiBkZXJlZmVyZW5jZS50eXBlID09PSAnTWVtYmVyRXhwcmVzc2lvbicpIHtcbiAgICAgICAgICAvLyBpZ25vcmUgY29tcHV0ZWQgcGFydHMgZm9yIG5vd1xuICAgICAgICAgIGlmIChkZXJlZmVyZW5jZS5jb21wdXRlZCkgeyByZXR1cm47IH1cblxuICAgICAgICAgIGNvbnN0IG1ldGFkYXRhID0gbmFtZXNwYWNlLmdldChkZXJlZmVyZW5jZS5wcm9wZXJ0eS5uYW1lKTtcblxuICAgICAgICAgIGlmICghbWV0YWRhdGEpIHsgYnJlYWs7IH1cbiAgICAgICAgICBjb25zdCBkZXByZWNhdGlvbiA9IGdldERlcHJlY2F0aW9uKG1ldGFkYXRhKTtcblxuICAgICAgICAgIGlmIChkZXByZWNhdGlvbikge1xuICAgICAgICAgICAgY29udGV4dC5yZXBvcnQoeyBub2RlOiBkZXJlZmVyZW5jZS5wcm9wZXJ0eSwgbWVzc2FnZTogbWVzc2FnZShkZXByZWNhdGlvbikgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gc3Rhc2ggYW5kIHBvcFxuICAgICAgICAgIG5hbWVwYXRoLnB1c2goZGVyZWZlcmVuY2UucHJvcGVydHkubmFtZSk7XG4gICAgICAgICAgbmFtZXNwYWNlID0gbWV0YWRhdGEubmFtZXNwYWNlO1xuICAgICAgICAgIGRlcmVmZXJlbmNlID0gZGVyZWZlcmVuY2UucGFyZW50O1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH07XG4gIH0sXG59O1xuIl19