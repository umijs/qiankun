'use strict';var _ExportMap = require('../ExportMap');var _ExportMap2 = _interopRequireDefault(_ExportMap);
var _importDeclaration = require('../importDeclaration');var _importDeclaration2 = _interopRequireDefault(_importDeclaration);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      category: 'Helpful warnings',
      description: 'Forbid use of exported name as identifier of default export.',
      url: (0, _docsUrl2['default'])('no-named-as-default') },

    schema: [] },


  create: function () {function create(context) {
      function checkDefault(nameKey, defaultSpecifier) {
        // #566: default is a valid specifier
        if (defaultSpecifier[nameKey].name === 'default') {return;}

        var declaration = (0, _importDeclaration2['default'])(context);

        var imports = _ExportMap2['default'].get(declaration.source.value, context);
        if (imports == null) {return;}

        if (imports.errors.length) {
          imports.reportErrors(context, declaration);
          return;
        }

        if (imports.has('default') && imports.has(defaultSpecifier[nameKey].name)) {

          context.report(
          defaultSpecifier, 'Using exported name \'' + String(
          defaultSpecifier[nameKey].name) + '\' as identifier for default export.');


        }
      }
      return {
        ImportDefaultSpecifier: checkDefault.bind(null, 'local'),
        ExportDefaultSpecifier: checkDefault.bind(null, 'exported') };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1uYW1lZC1hcy1kZWZhdWx0LmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydHMiLCJtZXRhIiwidHlwZSIsImRvY3MiLCJjYXRlZ29yeSIsImRlc2NyaXB0aW9uIiwidXJsIiwic2NoZW1hIiwiY3JlYXRlIiwiY29udGV4dCIsImNoZWNrRGVmYXVsdCIsIm5hbWVLZXkiLCJkZWZhdWx0U3BlY2lmaWVyIiwibmFtZSIsImRlY2xhcmF0aW9uIiwiaW1wb3J0cyIsIkV4cG9ydHMiLCJnZXQiLCJzb3VyY2UiLCJ2YWx1ZSIsImVycm9ycyIsImxlbmd0aCIsInJlcG9ydEVycm9ycyIsImhhcyIsInJlcG9ydCIsIkltcG9ydERlZmF1bHRTcGVjaWZpZXIiLCJiaW5kIiwiRXhwb3J0RGVmYXVsdFNwZWNpZmllciJdLCJtYXBwaW5ncyI6ImFBQUEseUM7QUFDQSx5RDtBQUNBLHFDOztBQUVBQSxPQUFPQyxPQUFQLEdBQWlCO0FBQ2ZDLFFBQU07QUFDSkMsVUFBTSxTQURGO0FBRUpDLFVBQU07QUFDSkMsZ0JBQVUsa0JBRE47QUFFSkMsbUJBQWEsOERBRlQ7QUFHSkMsV0FBSywwQkFBUSxxQkFBUixDQUhELEVBRkY7O0FBT0pDLFlBQVEsRUFQSixFQURTOzs7QUFXZkMsUUFYZSwrQkFXUkMsT0FYUSxFQVdDO0FBQ2QsZUFBU0MsWUFBVCxDQUFzQkMsT0FBdEIsRUFBK0JDLGdCQUEvQixFQUFpRDtBQUMvQztBQUNBLFlBQUlBLGlCQUFpQkQsT0FBakIsRUFBMEJFLElBQTFCLEtBQW1DLFNBQXZDLEVBQWtELENBQUUsT0FBUzs7QUFFN0QsWUFBTUMsY0FBYyxvQ0FBa0JMLE9BQWxCLENBQXBCOztBQUVBLFlBQU1NLFVBQVVDLHVCQUFRQyxHQUFSLENBQVlILFlBQVlJLE1BQVosQ0FBbUJDLEtBQS9CLEVBQXNDVixPQUF0QyxDQUFoQjtBQUNBLFlBQUlNLFdBQVcsSUFBZixFQUFxQixDQUFFLE9BQVM7O0FBRWhDLFlBQUlBLFFBQVFLLE1BQVIsQ0FBZUMsTUFBbkIsRUFBMkI7QUFDekJOLGtCQUFRTyxZQUFSLENBQXFCYixPQUFyQixFQUE4QkssV0FBOUI7QUFDQTtBQUNEOztBQUVELFlBQUlDLFFBQVFRLEdBQVIsQ0FBWSxTQUFaLEtBQTBCUixRQUFRUSxHQUFSLENBQVlYLGlCQUFpQkQsT0FBakIsRUFBMEJFLElBQXRDLENBQTlCLEVBQTJFOztBQUV6RUosa0JBQVFlLE1BQVI7QUFDRVosMEJBREY7QUFFMEJBLDJCQUFpQkQsT0FBakIsRUFBMEJFLElBRnBEOzs7QUFLRDtBQUNGO0FBQ0QsYUFBTztBQUNMWSxnQ0FBd0JmLGFBQWFnQixJQUFiLENBQWtCLElBQWxCLEVBQXdCLE9BQXhCLENBRG5CO0FBRUxDLGdDQUF3QmpCLGFBQWFnQixJQUFiLENBQWtCLElBQWxCLEVBQXdCLFVBQXhCLENBRm5CLEVBQVA7O0FBSUQsS0F2Q2MsbUJBQWpCIiwiZmlsZSI6Im5vLW5hbWVkLWFzLWRlZmF1bHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRXhwb3J0cyBmcm9tICcuLi9FeHBvcnRNYXAnO1xuaW1wb3J0IGltcG9ydERlY2xhcmF0aW9uIGZyb20gJy4uL2ltcG9ydERlY2xhcmF0aW9uJztcbmltcG9ydCBkb2NzVXJsIGZyb20gJy4uL2RvY3NVcmwnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbWV0YToge1xuICAgIHR5cGU6ICdwcm9ibGVtJyxcbiAgICBkb2NzOiB7XG4gICAgICBjYXRlZ29yeTogJ0hlbHBmdWwgd2FybmluZ3MnLFxuICAgICAgZGVzY3JpcHRpb246ICdGb3JiaWQgdXNlIG9mIGV4cG9ydGVkIG5hbWUgYXMgaWRlbnRpZmllciBvZiBkZWZhdWx0IGV4cG9ydC4nLFxuICAgICAgdXJsOiBkb2NzVXJsKCduby1uYW1lZC1hcy1kZWZhdWx0JyksXG4gICAgfSxcbiAgICBzY2hlbWE6IFtdLFxuICB9LFxuXG4gIGNyZWF0ZShjb250ZXh0KSB7XG4gICAgZnVuY3Rpb24gY2hlY2tEZWZhdWx0KG5hbWVLZXksIGRlZmF1bHRTcGVjaWZpZXIpIHtcbiAgICAgIC8vICM1NjY6IGRlZmF1bHQgaXMgYSB2YWxpZCBzcGVjaWZpZXJcbiAgICAgIGlmIChkZWZhdWx0U3BlY2lmaWVyW25hbWVLZXldLm5hbWUgPT09ICdkZWZhdWx0JykgeyByZXR1cm47IH1cblxuICAgICAgY29uc3QgZGVjbGFyYXRpb24gPSBpbXBvcnREZWNsYXJhdGlvbihjb250ZXh0KTtcblxuICAgICAgY29uc3QgaW1wb3J0cyA9IEV4cG9ydHMuZ2V0KGRlY2xhcmF0aW9uLnNvdXJjZS52YWx1ZSwgY29udGV4dCk7XG4gICAgICBpZiAoaW1wb3J0cyA9PSBudWxsKSB7IHJldHVybjsgfVxuXG4gICAgICBpZiAoaW1wb3J0cy5lcnJvcnMubGVuZ3RoKSB7XG4gICAgICAgIGltcG9ydHMucmVwb3J0RXJyb3JzKGNvbnRleHQsIGRlY2xhcmF0aW9uKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW1wb3J0cy5oYXMoJ2RlZmF1bHQnKSAmJiBpbXBvcnRzLmhhcyhkZWZhdWx0U3BlY2lmaWVyW25hbWVLZXldLm5hbWUpKSB7XG5cbiAgICAgICAgY29udGV4dC5yZXBvcnQoXG4gICAgICAgICAgZGVmYXVsdFNwZWNpZmllcixcbiAgICAgICAgICBgVXNpbmcgZXhwb3J0ZWQgbmFtZSAnJHtkZWZhdWx0U3BlY2lmaWVyW25hbWVLZXldLm5hbWV9JyBhcyBpZGVudGlmaWVyIGZvciBkZWZhdWx0IGV4cG9ydC5gLFxuICAgICAgICApO1xuXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBJbXBvcnREZWZhdWx0U3BlY2lmaWVyOiBjaGVja0RlZmF1bHQuYmluZChudWxsLCAnbG9jYWwnKSxcbiAgICAgIEV4cG9ydERlZmF1bHRTcGVjaWZpZXI6IGNoZWNrRGVmYXVsdC5iaW5kKG51bGwsICdleHBvcnRlZCcpLFxuICAgIH07XG4gIH0sXG59O1xuIl19