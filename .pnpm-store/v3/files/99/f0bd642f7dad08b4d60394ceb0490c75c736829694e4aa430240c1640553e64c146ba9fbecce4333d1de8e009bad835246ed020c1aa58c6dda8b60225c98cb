'use strict';var _ExportMap = require('../ExportMap');var _ExportMap2 = _interopRequireDefault(_ExportMap);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      category: 'Static analysis',
      description: 'Ensure a default export is present, given a default import.',
      url: (0, _docsUrl2['default'])('default') },

    schema: [] },


  create: function () {function create(context) {
      function checkDefault(specifierType, node) {
        var defaultSpecifier = node.specifiers.find(
        function (specifier) {return specifier.type === specifierType;});


        if (!defaultSpecifier) {return;}
        var imports = _ExportMap2['default'].get(node.source.value, context);
        if (imports == null) {return;}

        if (imports.errors.length) {
          imports.reportErrors(context, node);
        } else if (imports.get('default') === undefined) {
          context.report({
            node: defaultSpecifier,
            message: 'No default export found in imported module "' + String(node.source.value) + '".' });

        }
      }

      return {
        ImportDeclaration: checkDefault.bind(null, 'ImportDefaultSpecifier'),
        ExportNamedDeclaration: checkDefault.bind(null, 'ExportDefaultSpecifier') };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9kZWZhdWx0LmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydHMiLCJtZXRhIiwidHlwZSIsImRvY3MiLCJjYXRlZ29yeSIsImRlc2NyaXB0aW9uIiwidXJsIiwic2NoZW1hIiwiY3JlYXRlIiwiY29udGV4dCIsImNoZWNrRGVmYXVsdCIsInNwZWNpZmllclR5cGUiLCJub2RlIiwiZGVmYXVsdFNwZWNpZmllciIsInNwZWNpZmllcnMiLCJmaW5kIiwic3BlY2lmaWVyIiwiaW1wb3J0cyIsIkV4cG9ydHMiLCJnZXQiLCJzb3VyY2UiLCJ2YWx1ZSIsImVycm9ycyIsImxlbmd0aCIsInJlcG9ydEVycm9ycyIsInVuZGVmaW5lZCIsInJlcG9ydCIsIm1lc3NhZ2UiLCJJbXBvcnREZWNsYXJhdGlvbiIsImJpbmQiLCJFeHBvcnROYW1lZERlY2xhcmF0aW9uIl0sIm1hcHBpbmdzIjoiYUFBQSx5QztBQUNBLHFDOztBQUVBQSxPQUFPQyxPQUFQLEdBQWlCO0FBQ2ZDLFFBQU07QUFDSkMsVUFBTSxTQURGO0FBRUpDLFVBQU07QUFDSkMsZ0JBQVUsaUJBRE47QUFFSkMsbUJBQWEsNkRBRlQ7QUFHSkMsV0FBSywwQkFBUSxTQUFSLENBSEQsRUFGRjs7QUFPSkMsWUFBUSxFQVBKLEVBRFM7OztBQVdmQyxRQVhlLCtCQVdSQyxPQVhRLEVBV0M7QUFDZCxlQUFTQyxZQUFULENBQXNCQyxhQUF0QixFQUFxQ0MsSUFBckMsRUFBMkM7QUFDekMsWUFBTUMsbUJBQW1CRCxLQUFLRSxVQUFMLENBQWdCQyxJQUFoQjtBQUN2QixrQkFBQ0MsU0FBRCxVQUFlQSxVQUFVZCxJQUFWLEtBQW1CUyxhQUFsQyxFQUR1QixDQUF6Qjs7O0FBSUEsWUFBSSxDQUFDRSxnQkFBTCxFQUF1QixDQUFFLE9BQVM7QUFDbEMsWUFBTUksVUFBVUMsdUJBQVFDLEdBQVIsQ0FBWVAsS0FBS1EsTUFBTCxDQUFZQyxLQUF4QixFQUErQlosT0FBL0IsQ0FBaEI7QUFDQSxZQUFJUSxXQUFXLElBQWYsRUFBcUIsQ0FBRSxPQUFTOztBQUVoQyxZQUFJQSxRQUFRSyxNQUFSLENBQWVDLE1BQW5CLEVBQTJCO0FBQ3pCTixrQkFBUU8sWUFBUixDQUFxQmYsT0FBckIsRUFBOEJHLElBQTlCO0FBQ0QsU0FGRCxNQUVPLElBQUlLLFFBQVFFLEdBQVIsQ0FBWSxTQUFaLE1BQTJCTSxTQUEvQixFQUEwQztBQUMvQ2hCLGtCQUFRaUIsTUFBUixDQUFlO0FBQ2JkLGtCQUFNQyxnQkFETztBQUViYyw2RUFBd0RmLEtBQUtRLE1BQUwsQ0FBWUMsS0FBcEUsUUFGYSxFQUFmOztBQUlEO0FBQ0Y7O0FBRUQsYUFBTztBQUNMTywyQkFBbUJsQixhQUFhbUIsSUFBYixDQUFrQixJQUFsQixFQUF3Qix3QkFBeEIsQ0FEZDtBQUVMQyxnQ0FBd0JwQixhQUFhbUIsSUFBYixDQUFrQixJQUFsQixFQUF3Qix3QkFBeEIsQ0FGbkIsRUFBUDs7QUFJRCxLQW5DYyxtQkFBakIiLCJmaWxlIjoiZGVmYXVsdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBFeHBvcnRzIGZyb20gJy4uL0V4cG9ydE1hcCc7XG5pbXBvcnQgZG9jc1VybCBmcm9tICcuLi9kb2NzVXJsJztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1ldGE6IHtcbiAgICB0eXBlOiAncHJvYmxlbScsXG4gICAgZG9jczoge1xuICAgICAgY2F0ZWdvcnk6ICdTdGF0aWMgYW5hbHlzaXMnLFxuICAgICAgZGVzY3JpcHRpb246ICdFbnN1cmUgYSBkZWZhdWx0IGV4cG9ydCBpcyBwcmVzZW50LCBnaXZlbiBhIGRlZmF1bHQgaW1wb3J0LicsXG4gICAgICB1cmw6IGRvY3NVcmwoJ2RlZmF1bHQnKSxcbiAgICB9LFxuICAgIHNjaGVtYTogW10sXG4gIH0sXG5cbiAgY3JlYXRlKGNvbnRleHQpIHtcbiAgICBmdW5jdGlvbiBjaGVja0RlZmF1bHQoc3BlY2lmaWVyVHlwZSwgbm9kZSkge1xuICAgICAgY29uc3QgZGVmYXVsdFNwZWNpZmllciA9IG5vZGUuc3BlY2lmaWVycy5maW5kKFxuICAgICAgICAoc3BlY2lmaWVyKSA9PiBzcGVjaWZpZXIudHlwZSA9PT0gc3BlY2lmaWVyVHlwZSxcbiAgICAgICk7XG5cbiAgICAgIGlmICghZGVmYXVsdFNwZWNpZmllcikgeyByZXR1cm47IH1cbiAgICAgIGNvbnN0IGltcG9ydHMgPSBFeHBvcnRzLmdldChub2RlLnNvdXJjZS52YWx1ZSwgY29udGV4dCk7XG4gICAgICBpZiAoaW1wb3J0cyA9PSBudWxsKSB7IHJldHVybjsgfVxuXG4gICAgICBpZiAoaW1wb3J0cy5lcnJvcnMubGVuZ3RoKSB7XG4gICAgICAgIGltcG9ydHMucmVwb3J0RXJyb3JzKGNvbnRleHQsIG5vZGUpO1xuICAgICAgfSBlbHNlIGlmIChpbXBvcnRzLmdldCgnZGVmYXVsdCcpID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgIG5vZGU6IGRlZmF1bHRTcGVjaWZpZXIsXG4gICAgICAgICAgbWVzc2FnZTogYE5vIGRlZmF1bHQgZXhwb3J0IGZvdW5kIGluIGltcG9ydGVkIG1vZHVsZSBcIiR7bm9kZS5zb3VyY2UudmFsdWV9XCIuYCxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIEltcG9ydERlY2xhcmF0aW9uOiBjaGVja0RlZmF1bHQuYmluZChudWxsLCAnSW1wb3J0RGVmYXVsdFNwZWNpZmllcicpLFxuICAgICAgRXhwb3J0TmFtZWREZWNsYXJhdGlvbjogY2hlY2tEZWZhdWx0LmJpbmQobnVsbCwgJ0V4cG9ydERlZmF1bHRTcGVjaWZpZXInKSxcbiAgICB9O1xuICB9LFxufTtcbiJdfQ==