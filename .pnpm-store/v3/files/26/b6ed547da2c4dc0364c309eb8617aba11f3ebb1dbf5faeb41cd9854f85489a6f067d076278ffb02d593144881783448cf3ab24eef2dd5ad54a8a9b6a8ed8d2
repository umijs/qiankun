'use strict';var _vm = require('vm');var _vm2 = _interopRequireDefault(_vm);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Style guide',
      description: 'Enforce a leading comment with the webpackChunkName for dynamic imports.',
      url: (0, _docsUrl2['default'])('dynamic-import-chunkname') },

    schema: [{
      type: 'object',
      properties: {
        importFunctions: {
          type: 'array',
          uniqueItems: true,
          items: {
            type: 'string' } },


        webpackChunknameFormat: {
          type: 'string' } } }] },





  create: function () {function create(context) {
      var config = context.options[0];var _ref =
      config || {},_ref$importFunctions = _ref.importFunctions,importFunctions = _ref$importFunctions === undefined ? [] : _ref$importFunctions;var _ref2 =
      config || {},_ref2$webpackChunknam = _ref2.webpackChunknameFormat,webpackChunknameFormat = _ref2$webpackChunknam === undefined ? '([0-9a-zA-Z-_/.]|\\[(request|index)\\])+' : _ref2$webpackChunknam;

      var paddedCommentRegex = /^ (\S[\s\S]+\S) $/;
      var commentStyleRegex = /^( ((webpackChunkName: .+)|((webpackPrefetch|webpackPreload): (true|false|-?[0-9]+))|(webpackIgnore: (true|false))|((webpackInclude|webpackExclude): \/.*\/)|(webpackMode: ["'](lazy|lazy-once|eager|weak)["'])|(webpackExports: (['"]\w+['"]|\[(['"]\w+['"], *)+(['"]\w+['"]*)\]))),?)+ $/;
      var chunkSubstrFormat = ' webpackChunkName: ["\']' + String(webpackChunknameFormat) + '["\'],? ';
      var chunkSubstrRegex = new RegExp(chunkSubstrFormat);

      function run(node, arg) {
        var sourceCode = context.getSourceCode();
        var leadingComments = sourceCode.getCommentsBefore ?
        sourceCode.getCommentsBefore(arg) // This method is available in ESLint >= 4.
        : sourceCode.getComments(arg).leading; // This method is deprecated in ESLint 7.

        if (!leadingComments || leadingComments.length === 0) {
          context.report({
            node: node,
            message: 'dynamic imports require a leading comment with the webpack chunkname' });

          return;
        }

        var isChunknamePresent = false;var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {

          for (var _iterator = leadingComments[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var comment = _step.value;
            if (comment.type !== 'Block') {
              context.report({
                node: node,
                message: 'dynamic imports require a /* foo */ style comment, not a // foo comment' });

              return;
            }

            if (!paddedCommentRegex.test(comment.value)) {
              context.report({
                node: node,
                message: 'dynamic imports require a block comment padded with spaces - /* foo */' });

              return;
            }

            try {
              // just like webpack itself does
              _vm2['default'].runInNewContext('(function() {return {' + String(comment.value) + '}})()');
            } catch (error) {
              context.report({
                node: node,
                message: 'dynamic imports require a "webpack" comment with valid syntax' });

              return;
            }

            if (!commentStyleRegex.test(comment.value)) {
              context.report({
                node: node,
                message: 'dynamic imports require a "webpack" comment with valid syntax' });


              return;
            }

            if (chunkSubstrRegex.test(comment.value)) {
              isChunknamePresent = true;
            }
          }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator['return']) {_iterator['return']();}} finally {if (_didIteratorError) {throw _iteratorError;}}}

        if (!isChunknamePresent) {
          context.report({
            node: node,
            message: 'dynamic imports require a leading comment in the form /*' +
            chunkSubstrFormat + '*/' });

        }
      }

      return {
        ImportExpression: function () {function ImportExpression(node) {
            run(node, node.source);
          }return ImportExpression;}(),

        CallExpression: function () {function CallExpression(node) {
            if (node.callee.type !== 'Import' && importFunctions.indexOf(node.callee.name) < 0) {
              return;
            }

            run(node, node.arguments[0]);
          }return CallExpression;}() };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9keW5hbWljLWltcG9ydC1jaHVua25hbWUuanMiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0cyIsIm1ldGEiLCJ0eXBlIiwiZG9jcyIsImNhdGVnb3J5IiwiZGVzY3JpcHRpb24iLCJ1cmwiLCJzY2hlbWEiLCJwcm9wZXJ0aWVzIiwiaW1wb3J0RnVuY3Rpb25zIiwidW5pcXVlSXRlbXMiLCJpdGVtcyIsIndlYnBhY2tDaHVua25hbWVGb3JtYXQiLCJjcmVhdGUiLCJjb250ZXh0IiwiY29uZmlnIiwib3B0aW9ucyIsInBhZGRlZENvbW1lbnRSZWdleCIsImNvbW1lbnRTdHlsZVJlZ2V4IiwiY2h1bmtTdWJzdHJGb3JtYXQiLCJjaHVua1N1YnN0clJlZ2V4IiwiUmVnRXhwIiwicnVuIiwibm9kZSIsImFyZyIsInNvdXJjZUNvZGUiLCJnZXRTb3VyY2VDb2RlIiwibGVhZGluZ0NvbW1lbnRzIiwiZ2V0Q29tbWVudHNCZWZvcmUiLCJnZXRDb21tZW50cyIsImxlYWRpbmciLCJsZW5ndGgiLCJyZXBvcnQiLCJtZXNzYWdlIiwiaXNDaHVua25hbWVQcmVzZW50IiwiY29tbWVudCIsInRlc3QiLCJ2YWx1ZSIsInZtIiwicnVuSW5OZXdDb250ZXh0IiwiZXJyb3IiLCJJbXBvcnRFeHByZXNzaW9uIiwic291cmNlIiwiQ2FsbEV4cHJlc3Npb24iLCJjYWxsZWUiLCJpbmRleE9mIiwibmFtZSIsImFyZ3VtZW50cyJdLCJtYXBwaW5ncyI6ImFBQUEsd0I7QUFDQSxxQzs7QUFFQUEsT0FBT0MsT0FBUCxHQUFpQjtBQUNmQyxRQUFNO0FBQ0pDLFVBQU0sWUFERjtBQUVKQyxVQUFNO0FBQ0pDLGdCQUFVLGFBRE47QUFFSkMsbUJBQWEsMEVBRlQ7QUFHSkMsV0FBSywwQkFBUSwwQkFBUixDQUhELEVBRkY7O0FBT0pDLFlBQVEsQ0FBQztBQUNQTCxZQUFNLFFBREM7QUFFUE0sa0JBQVk7QUFDVkMseUJBQWlCO0FBQ2ZQLGdCQUFNLE9BRFM7QUFFZlEsdUJBQWEsSUFGRTtBQUdmQyxpQkFBTztBQUNMVCxrQkFBTSxRQURELEVBSFEsRUFEUDs7O0FBUVZVLGdDQUF3QjtBQUN0QlYsZ0JBQU0sUUFEZ0IsRUFSZCxFQUZMLEVBQUQsQ0FQSixFQURTOzs7Ozs7QUF5QmZXLFFBekJlLCtCQXlCUkMsT0F6QlEsRUF5QkM7QUFDZCxVQUFNQyxTQUFTRCxRQUFRRSxPQUFSLENBQWdCLENBQWhCLENBQWYsQ0FEYztBQUVtQkQsZ0JBQVUsRUFGN0IsNkJBRU5OLGVBRk0sQ0FFTkEsZUFGTSx3Q0FFWSxFQUZaO0FBR2tFTSxnQkFBVSxFQUg1RSwrQkFHTkgsc0JBSE0sQ0FHTkEsc0JBSE0seUNBR21CLDBDQUhuQjs7QUFLZCxVQUFNSyxxQkFBcUIsbUJBQTNCO0FBQ0EsVUFBTUMsb0JBQW9CLDRSQUExQjtBQUNBLFVBQU1DLHdEQUE4Q1Asc0JBQTlDLGNBQU47QUFDQSxVQUFNUSxtQkFBbUIsSUFBSUMsTUFBSixDQUFXRixpQkFBWCxDQUF6Qjs7QUFFQSxlQUFTRyxHQUFULENBQWFDLElBQWIsRUFBbUJDLEdBQW5CLEVBQXdCO0FBQ3RCLFlBQU1DLGFBQWFYLFFBQVFZLGFBQVIsRUFBbkI7QUFDQSxZQUFNQyxrQkFBa0JGLFdBQVdHLGlCQUFYO0FBQ3BCSCxtQkFBV0csaUJBQVgsQ0FBNkJKLEdBQTdCLENBRG9CLENBQ2M7QUFEZCxVQUVwQkMsV0FBV0ksV0FBWCxDQUF1QkwsR0FBdkIsRUFBNEJNLE9BRmhDLENBRnNCLENBSW1COztBQUV6QyxZQUFJLENBQUNILGVBQUQsSUFBb0JBLGdCQUFnQkksTUFBaEIsS0FBMkIsQ0FBbkQsRUFBc0Q7QUFDcERqQixrQkFBUWtCLE1BQVIsQ0FBZTtBQUNiVCxzQkFEYTtBQUViVSxxQkFBUyxzRUFGSSxFQUFmOztBQUlBO0FBQ0Q7O0FBRUQsWUFBSUMscUJBQXFCLEtBQXpCLENBZHNCOztBQWdCdEIsK0JBQXNCUCxlQUF0Qiw4SEFBdUMsS0FBNUJRLE9BQTRCO0FBQ3JDLGdCQUFJQSxRQUFRakMsSUFBUixLQUFpQixPQUFyQixFQUE4QjtBQUM1Qlksc0JBQVFrQixNQUFSLENBQWU7QUFDYlQsMEJBRGE7QUFFYlUseUJBQVMseUVBRkksRUFBZjs7QUFJQTtBQUNEOztBQUVELGdCQUFJLENBQUNoQixtQkFBbUJtQixJQUFuQixDQUF3QkQsUUFBUUUsS0FBaEMsQ0FBTCxFQUE2QztBQUMzQ3ZCLHNCQUFRa0IsTUFBUixDQUFlO0FBQ2JULDBCQURhO0FBRWJVLGlHQUZhLEVBQWY7O0FBSUE7QUFDRDs7QUFFRCxnQkFBSTtBQUNGO0FBQ0FLLDhCQUFHQyxlQUFILGtDQUEyQ0osUUFBUUUsS0FBbkQ7QUFDRCxhQUhELENBR0UsT0FBT0csS0FBUCxFQUFjO0FBQ2QxQixzQkFBUWtCLE1BQVIsQ0FBZTtBQUNiVCwwQkFEYTtBQUViVSx3RkFGYSxFQUFmOztBQUlBO0FBQ0Q7O0FBRUQsZ0JBQUksQ0FBQ2Ysa0JBQWtCa0IsSUFBbEIsQ0FBdUJELFFBQVFFLEtBQS9CLENBQUwsRUFBNEM7QUFDMUN2QixzQkFBUWtCLE1BQVIsQ0FBZTtBQUNiVCwwQkFEYTtBQUViVSx3RkFGYSxFQUFmOzs7QUFLQTtBQUNEOztBQUVELGdCQUFJYixpQkFBaUJnQixJQUFqQixDQUFzQkQsUUFBUUUsS0FBOUIsQ0FBSixFQUEwQztBQUN4Q0gsbUNBQXFCLElBQXJCO0FBQ0Q7QUFDRixXQXhEcUI7O0FBMER0QixZQUFJLENBQUNBLGtCQUFMLEVBQXlCO0FBQ3ZCcEIsa0JBQVFrQixNQUFSLENBQWU7QUFDYlQsc0JBRGE7QUFFYlU7QUFDNkRkLDZCQUQ3RCxPQUZhLEVBQWY7O0FBS0Q7QUFDRjs7QUFFRCxhQUFPO0FBQ0xzQix3QkFESyx5Q0FDWWxCLElBRFosRUFDa0I7QUFDckJELGdCQUFJQyxJQUFKLEVBQVVBLEtBQUttQixNQUFmO0FBQ0QsV0FISTs7QUFLTEMsc0JBTEssdUNBS1VwQixJQUxWLEVBS2dCO0FBQ25CLGdCQUFJQSxLQUFLcUIsTUFBTCxDQUFZMUMsSUFBWixLQUFxQixRQUFyQixJQUFpQ08sZ0JBQWdCb0MsT0FBaEIsQ0FBd0J0QixLQUFLcUIsTUFBTCxDQUFZRSxJQUFwQyxJQUE0QyxDQUFqRixFQUFvRjtBQUNsRjtBQUNEOztBQUVEeEIsZ0JBQUlDLElBQUosRUFBVUEsS0FBS3dCLFNBQUwsQ0FBZSxDQUFmLENBQVY7QUFDRCxXQVhJLDJCQUFQOztBQWFELEtBbkhjLG1CQUFqQiIsImZpbGUiOiJkeW5hbWljLWltcG9ydC1jaHVua25hbWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdm0gZnJvbSAndm0nO1xuaW1wb3J0IGRvY3NVcmwgZnJvbSAnLi4vZG9jc1VybCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3N1Z2dlc3Rpb24nLFxuICAgIGRvY3M6IHtcbiAgICAgIGNhdGVnb3J5OiAnU3R5bGUgZ3VpZGUnLFxuICAgICAgZGVzY3JpcHRpb246ICdFbmZvcmNlIGEgbGVhZGluZyBjb21tZW50IHdpdGggdGhlIHdlYnBhY2tDaHVua05hbWUgZm9yIGR5bmFtaWMgaW1wb3J0cy4nLFxuICAgICAgdXJsOiBkb2NzVXJsKCdkeW5hbWljLWltcG9ydC1jaHVua25hbWUnKSxcbiAgICB9LFxuICAgIHNjaGVtYTogW3tcbiAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBpbXBvcnRGdW5jdGlvbnM6IHtcbiAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgIHVuaXF1ZUl0ZW1zOiB0cnVlLFxuICAgICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICB3ZWJwYWNrQ2h1bmtuYW1lRm9ybWF0OiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH1dLFxuICB9LFxuXG4gIGNyZWF0ZShjb250ZXh0KSB7XG4gICAgY29uc3QgY29uZmlnID0gY29udGV4dC5vcHRpb25zWzBdO1xuICAgIGNvbnN0IHsgaW1wb3J0RnVuY3Rpb25zID0gW10gfSA9IGNvbmZpZyB8fCB7fTtcbiAgICBjb25zdCB7IHdlYnBhY2tDaHVua25hbWVGb3JtYXQgPSAnKFswLTlhLXpBLVotXy8uXXxcXFxcWyhyZXF1ZXN0fGluZGV4KVxcXFxdKSsnIH0gPSBjb25maWcgfHwge307XG5cbiAgICBjb25zdCBwYWRkZWRDb21tZW50UmVnZXggPSAvXiAoXFxTW1xcc1xcU10rXFxTKSAkLztcbiAgICBjb25zdCBjb21tZW50U3R5bGVSZWdleCA9IC9eKCAoKHdlYnBhY2tDaHVua05hbWU6IC4rKXwoKHdlYnBhY2tQcmVmZXRjaHx3ZWJwYWNrUHJlbG9hZCk6ICh0cnVlfGZhbHNlfC0/WzAtOV0rKSl8KHdlYnBhY2tJZ25vcmU6ICh0cnVlfGZhbHNlKSl8KCh3ZWJwYWNrSW5jbHVkZXx3ZWJwYWNrRXhjbHVkZSk6IFxcLy4qXFwvKXwod2VicGFja01vZGU6IFtcIiddKGxhenl8bGF6eS1vbmNlfGVhZ2VyfHdlYWspW1wiJ10pfCh3ZWJwYWNrRXhwb3J0czogKFsnXCJdXFx3K1snXCJdfFxcWyhbJ1wiXVxcdytbJ1wiXSwgKikrKFsnXCJdXFx3K1snXCJdKilcXF0pKSksPykrICQvO1xuICAgIGNvbnN0IGNodW5rU3Vic3RyRm9ybWF0ID0gYCB3ZWJwYWNrQ2h1bmtOYW1lOiBbXCInXSR7d2VicGFja0NodW5rbmFtZUZvcm1hdH1bXCInXSw/IGA7XG4gICAgY29uc3QgY2h1bmtTdWJzdHJSZWdleCA9IG5ldyBSZWdFeHAoY2h1bmtTdWJzdHJGb3JtYXQpO1xuXG4gICAgZnVuY3Rpb24gcnVuKG5vZGUsIGFyZykge1xuICAgICAgY29uc3Qgc291cmNlQ29kZSA9IGNvbnRleHQuZ2V0U291cmNlQ29kZSgpO1xuICAgICAgY29uc3QgbGVhZGluZ0NvbW1lbnRzID0gc291cmNlQ29kZS5nZXRDb21tZW50c0JlZm9yZVxuICAgICAgICA/IHNvdXJjZUNvZGUuZ2V0Q29tbWVudHNCZWZvcmUoYXJnKSAvLyBUaGlzIG1ldGhvZCBpcyBhdmFpbGFibGUgaW4gRVNMaW50ID49IDQuXG4gICAgICAgIDogc291cmNlQ29kZS5nZXRDb21tZW50cyhhcmcpLmxlYWRpbmc7IC8vIFRoaXMgbWV0aG9kIGlzIGRlcHJlY2F0ZWQgaW4gRVNMaW50IDcuXG5cbiAgICAgIGlmICghbGVhZGluZ0NvbW1lbnRzIHx8IGxlYWRpbmdDb21tZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgbWVzc2FnZTogJ2R5bmFtaWMgaW1wb3J0cyByZXF1aXJlIGEgbGVhZGluZyBjb21tZW50IHdpdGggdGhlIHdlYnBhY2sgY2h1bmtuYW1lJyxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbGV0IGlzQ2h1bmtuYW1lUHJlc2VudCA9IGZhbHNlO1xuXG4gICAgICBmb3IgKGNvbnN0IGNvbW1lbnQgb2YgbGVhZGluZ0NvbW1lbnRzKSB7XG4gICAgICAgIGlmIChjb21tZW50LnR5cGUgIT09ICdCbG9jaycpIHtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgbWVzc2FnZTogJ2R5bmFtaWMgaW1wb3J0cyByZXF1aXJlIGEgLyogZm9vICovIHN0eWxlIGNvbW1lbnQsIG5vdCBhIC8vIGZvbyBjb21tZW50JyxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXBhZGRlZENvbW1lbnRSZWdleC50ZXN0KGNvbW1lbnQudmFsdWUpKSB7XG4gICAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgIG1lc3NhZ2U6IGBkeW5hbWljIGltcG9ydHMgcmVxdWlyZSBhIGJsb2NrIGNvbW1lbnQgcGFkZGVkIHdpdGggc3BhY2VzIC0gLyogZm9vICovYCxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIGp1c3QgbGlrZSB3ZWJwYWNrIGl0c2VsZiBkb2VzXG4gICAgICAgICAgdm0ucnVuSW5OZXdDb250ZXh0KGAoZnVuY3Rpb24oKSB7cmV0dXJuIHske2NvbW1lbnQudmFsdWV9fX0pKClgKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgbWVzc2FnZTogYGR5bmFtaWMgaW1wb3J0cyByZXF1aXJlIGEgXCJ3ZWJwYWNrXCIgY29tbWVudCB3aXRoIHZhbGlkIHN5bnRheGAsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFjb21tZW50U3R5bGVSZWdleC50ZXN0KGNvbW1lbnQudmFsdWUpKSB7XG4gICAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgIG1lc3NhZ2U6XG4gICAgICAgICAgICAgIGBkeW5hbWljIGltcG9ydHMgcmVxdWlyZSBhIFwid2VicGFja1wiIGNvbW1lbnQgd2l0aCB2YWxpZCBzeW50YXhgLFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjaHVua1N1YnN0clJlZ2V4LnRlc3QoY29tbWVudC52YWx1ZSkpIHtcbiAgICAgICAgICBpc0NodW5rbmFtZVByZXNlbnQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNDaHVua25hbWVQcmVzZW50KSB7XG4gICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICBub2RlLFxuICAgICAgICAgIG1lc3NhZ2U6XG4gICAgICAgICAgICBgZHluYW1pYyBpbXBvcnRzIHJlcXVpcmUgYSBsZWFkaW5nIGNvbW1lbnQgaW4gdGhlIGZvcm0gLyoke2NodW5rU3Vic3RyRm9ybWF0fSovYCxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIEltcG9ydEV4cHJlc3Npb24obm9kZSkge1xuICAgICAgICBydW4obm9kZSwgbm9kZS5zb3VyY2UpO1xuICAgICAgfSxcblxuICAgICAgQ2FsbEV4cHJlc3Npb24obm9kZSkge1xuICAgICAgICBpZiAobm9kZS5jYWxsZWUudHlwZSAhPT0gJ0ltcG9ydCcgJiYgaW1wb3J0RnVuY3Rpb25zLmluZGV4T2Yobm9kZS5jYWxsZWUubmFtZSkgPCAwKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcnVuKG5vZGUsIG5vZGUuYXJndW1lbnRzWzBdKTtcbiAgICAgIH0sXG4gICAgfTtcbiAgfSxcbn07XG4iXX0=