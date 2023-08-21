'use strict';var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();var _path = require('path');var path = _interopRequireWildcard(_path);
var _ExportMap = require('../ExportMap');var _ExportMap2 = _interopRequireDefault(_ExportMap);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj['default'] = obj;return newObj;}}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      category: 'Static analysis',
      description: 'Ensure named imports correspond to a named export in the remote file.',
      url: (0, _docsUrl2['default'])('named') },

    schema: [
    {
      type: 'object',
      properties: {
        commonjs: {
          type: 'boolean' } },


      additionalProperties: false }] },




  create: function () {function create(context) {
      var options = context.options[0] || {};

      function checkSpecifiers(key, type, node) {
        // ignore local exports and type imports/exports
        if (
        node.source == null ||
        node.importKind === 'type' ||
        node.importKind === 'typeof' ||
        node.exportKind === 'type')
        {
          return;
        }

        if (!node.specifiers.some(function (im) {return im.type === type;})) {
          return; // no named imports/exports
        }

        var imports = _ExportMap2['default'].get(node.source.value, context);
        if (imports == null || imports.parseGoal === 'ambiguous') {
          return;
        }

        if (imports.errors.length) {
          imports.reportErrors(context, node);
          return;
        }

        node.specifiers.forEach(function (im) {
          if (
          im.type !== type
          // ignore type imports
          || im.importKind === 'type' || im.importKind === 'typeof')
          {
            return;
          }

          var name = im[key].name || im[key].value;

          var deepLookup = imports.hasDeep(name);

          if (!deepLookup.found) {
            if (deepLookup.path.length > 1) {
              var deepPath = deepLookup.path.
              map(function (i) {return path.relative(path.dirname(context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename()), i.path);}).
              join(' -> ');

              context.report(im[key], String(name) + ' not found via ' + String(deepPath));
            } else {
              context.report(im[key], String(name) + ' not found in \'' + String(node.source.value) + '\'');
            }
          }
        });
      }

      function checkRequire(node) {
        if (
        !options.commonjs ||
        node.type !== 'VariableDeclarator'
        // return if it's not an object destructure or it's an empty object destructure
        || !node.id || node.id.type !== 'ObjectPattern' || node.id.properties.length === 0
        // return if there is no call expression on the right side
        || !node.init || node.init.type !== 'CallExpression')
        {
          return;
        }

        var call = node.init;var _call$arguments = _slicedToArray(
        call.arguments, 1),source = _call$arguments[0];
        var variableImports = node.id.properties;
        var variableExports = _ExportMap2['default'].get(source.value, context);

        if (
        // return if it's not a commonjs require statement
        call.callee.type !== 'Identifier' || call.callee.name !== 'require' || call.arguments.length !== 1
        // return if it's not a string source
        || source.type !== 'Literal' ||
        variableExports == null ||
        variableExports.parseGoal === 'ambiguous')
        {
          return;
        }

        if (variableExports.errors.length) {
          variableExports.reportErrors(context, node);
          return;
        }

        variableImports.forEach(function (im) {
          if (im.type !== 'Property' || !im.key || im.key.type !== 'Identifier') {
            return;
          }

          var deepLookup = variableExports.hasDeep(im.key.name);

          if (!deepLookup.found) {
            if (deepLookup.path.length > 1) {
              var deepPath = deepLookup.path.
              map(function (i) {return path.relative(path.dirname(context.getFilename()), i.path);}).
              join(' -> ');

              context.report(im.key, String(im.key.name) + ' not found via ' + String(deepPath));
            } else {
              context.report(im.key, String(im.key.name) + ' not found in \'' + String(source.value) + '\'');
            }
          }
        });
      }

      return {
        ImportDeclaration: checkSpecifiers.bind(null, 'imported', 'ImportSpecifier'),

        ExportNamedDeclaration: checkSpecifiers.bind(null, 'local', 'ExportSpecifier'),

        VariableDeclarator: checkRequire };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uYW1lZC5qcyJdLCJuYW1lcyI6WyJwYXRoIiwibW9kdWxlIiwiZXhwb3J0cyIsIm1ldGEiLCJ0eXBlIiwiZG9jcyIsImNhdGVnb3J5IiwiZGVzY3JpcHRpb24iLCJ1cmwiLCJzY2hlbWEiLCJwcm9wZXJ0aWVzIiwiY29tbW9uanMiLCJhZGRpdGlvbmFsUHJvcGVydGllcyIsImNyZWF0ZSIsImNvbnRleHQiLCJvcHRpb25zIiwiY2hlY2tTcGVjaWZpZXJzIiwia2V5Iiwibm9kZSIsInNvdXJjZSIsImltcG9ydEtpbmQiLCJleHBvcnRLaW5kIiwic3BlY2lmaWVycyIsInNvbWUiLCJpbSIsImltcG9ydHMiLCJFeHBvcnRzIiwiZ2V0IiwidmFsdWUiLCJwYXJzZUdvYWwiLCJlcnJvcnMiLCJsZW5ndGgiLCJyZXBvcnRFcnJvcnMiLCJmb3JFYWNoIiwibmFtZSIsImRlZXBMb29rdXAiLCJoYXNEZWVwIiwiZm91bmQiLCJkZWVwUGF0aCIsIm1hcCIsImkiLCJyZWxhdGl2ZSIsImRpcm5hbWUiLCJnZXRQaHlzaWNhbEZpbGVuYW1lIiwiZ2V0RmlsZW5hbWUiLCJqb2luIiwicmVwb3J0IiwiY2hlY2tSZXF1aXJlIiwiaWQiLCJpbml0IiwiY2FsbCIsImFyZ3VtZW50cyIsInZhcmlhYmxlSW1wb3J0cyIsInZhcmlhYmxlRXhwb3J0cyIsImNhbGxlZSIsIkltcG9ydERlY2xhcmF0aW9uIiwiYmluZCIsIkV4cG9ydE5hbWVkRGVjbGFyYXRpb24iLCJWYXJpYWJsZURlY2xhcmF0b3IiXSwibWFwcGluZ3MiOiJxb0JBQUEsNEIsSUFBWUEsSTtBQUNaLHlDO0FBQ0EscUM7O0FBRUFDLE9BQU9DLE9BQVAsR0FBaUI7QUFDZkMsUUFBTTtBQUNKQyxVQUFNLFNBREY7QUFFSkMsVUFBTTtBQUNKQyxnQkFBVSxpQkFETjtBQUVKQyxtQkFBYSx1RUFGVDtBQUdKQyxXQUFLLDBCQUFRLE9BQVIsQ0FIRCxFQUZGOztBQU9KQyxZQUFRO0FBQ047QUFDRUws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QUFJRixXQUFXbkMsSUFBWCxDQUFnQitCLE1BQWhCLEdBQXlCLENBQTdCLEVBQWdDO0FBQzlCLGtCQUFNTyxXQUFXSCxXQUFXbkMsSUFBWDtBQUNkdUMsaUJBRGMsQ0FDVixVQUFDQyxDQUFELFVBQU94QyxLQUFLeUMsUUFBTCxDQUFjekMsS0FBSzBDLE9BQUwsQ0FBYTVCLFFBQVE4QixXQUFSLEVBQWIsQ0FBZCxFQUFtREosRUFBRXhDLElBQXJELENBQVAsRUFEVTtBQUVkNkMsa0JBRmMsQ0FFVCxNQUZTLENBQWpCOztBQUlBL0Isc0JBQVFnQyxNQUFSLENBQWV0QixHQUFHUCxHQUFsQixTQUEwQk8sR0FBR1AsR0FBSCxDQUFPaUIsSUFBakMsK0JBQXVESSxRQUF2RDtBQUNELGFBTkQsTUFNTztBQUNMeEIsc0JBQVFnQyxNQUFSLENBQWV0QixHQUFHUCxHQUFsQixTQUEwQk8sR0FBR1AsR0FBSCxDQUFPaUIsSUFBakMsZ0NBQXVEZixPQUFPUyxLQUE5RDtBQUNEO0FBQ0Y7QUFDRixTQWxCRDtBQW1CRDs7QUFFRCxhQUFPO0FBQ0wyQiwyQkFBbUJ2QyxnQkFBZ0J3QyxJQUFoQixDQUFxQixJQUFyQixFQUEyQixVQUEzQixFQUF1QyxpQkFBdkMsQ0FEZDs7QUFHTEMsZ0NBQXdCekMsZ0JBQWdCd0MsSUFBaEIsQ0FBcUIsSUFBckIsRUFBMkIsT0FBM0IsRUFBb0MsaUJBQXBDLENBSG5COztBQUtMRSw0QkFBb0JYLFlBTGYsRUFBUDs7QUFPRCxLQXpJYyxtQkFBakIiLCJmaWxlIjoibmFtZWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IEV4cG9ydHMgZnJvbSAnLi4vRXhwb3J0TWFwJztcbmltcG9ydCBkb2NzVXJsIGZyb20gJy4uL2RvY3NVcmwnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbWV0YToge1xuICAgIHR5cGU6ICdwcm9ibGVtJyxcbiAgICBkb2NzOiB7XG4gICAgICBjYXRlZ29yeTogJ1N0YXRpYyBhbmFseXNpcycsXG4gICAgICBkZXNjcmlwdGlvbjogJ0Vuc3VyZSBuYW1lZCBpbXBvcnRzIGNvcnJlc3BvbmQgdG8gYSBuYW1lZCBleHBvcnQgaW4gdGhlIHJlbW90ZSBmaWxlLicsXG4gICAgICB1cmw6IGRvY3NVcmwoJ25hbWVkJyksXG4gICAgfSxcbiAgICBzY2hlbWE6IFtcbiAgICAgIHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICBjb21tb25qczoge1xuICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcblxuICBjcmVhdGUoY29udGV4dCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSBjb250ZXh0Lm9wdGlvbnNbMF0gfHwge307XG5cbiAgICBmdW5jdGlvbiBjaGVja1NwZWNpZmllcnMoa2V5LCB0eXBlLCBub2RlKSB7XG4gICAgICAvLyBpZ25vcmUgbG9jYWwgZXhwb3J0cyBhbmQgdHlwZSBpbXBvcnRzL2V4cG9ydHNcbiAgICAgIGlmIChcbiAgICAgICAgbm9kZS5zb3VyY2UgPT0gbnVsbFxuICAgICAgICB8fCBub2RlLmltcG9ydEtpbmQgPT09ICd0eXBlJ1xuICAgICAgICB8fCBub2RlLmltcG9ydEtpbmQgPT09ICd0eXBlb2YnXG4gICAgICAgIHx8IG5vZGUuZXhwb3J0S2luZCA9PT0gJ3R5cGUnXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoIW5vZGUuc3BlY2lmaWVycy5zb21lKChpbSkgPT4gaW0udHlwZSA9PT0gdHlwZSkpIHtcbiAgICAgICAgcmV0dXJuOyAvLyBubyBuYW1lZCBpbXBvcnRzL2V4cG9ydHNcbiAgICAgIH1cblxuICAgICAgY29uc3QgaW1wb3J0cyA9IEV4cG9ydHMuZ2V0KG5vZGUuc291cmNlLnZhbHVlLCBjb250ZXh0KTtcbiAgICAgIGlmIChpbXBvcnRzID09IG51bGwgfHwgaW1wb3J0cy5wYXJzZUdvYWwgPT09ICdhbWJpZ3VvdXMnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKGltcG9ydHMuZXJyb3JzLmxlbmd0aCkge1xuICAgICAgICBpbXBvcnRzLnJlcG9ydEVycm9ycyhjb250ZXh0LCBub2RlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBub2RlLnNwZWNpZmllcnMuZm9yRWFjaChmdW5jdGlvbiAoaW0pIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGltLnR5cGUgIT09IHR5cGVcbiAgICAgICAgICAvLyBpZ25vcmUgdHlwZSBpbXBvcnRzXG4gICAgICAgICAgfHwgaW0uaW1wb3J0S2luZCA9PT0gJ3R5cGUnIHx8IGltLmltcG9ydEtpbmQgPT09ICd0eXBlb2YnXG4gICAgICAgICkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5hbWUgPSBpbVtrZXldLm5hbWUgfHwgaW1ba2V5XS52YWx1ZTtcblxuICAgICAgICBjb25zdCBkZWVwTG9va3VwID0gaW1wb3J0cy5oYXNEZWVwKG5hbWUpO1xuXG4gICAgICAgIGlmICghZGVlcExvb2t1cC5mb3VuZCkge1xuICAgICAgICAgIGlmIChkZWVwTG9va3VwLnBhdGgubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgY29uc3QgZGVlcFBhdGggPSBkZWVwTG9va3VwLnBhdGhcbiAgICAgICAgICAgICAgLm1hcCgoaSkgPT4gcGF0aC5yZWxhdGl2ZShwYXRoLmRpcm5hbWUoY29udGV4dC5nZXRQaHlzaWNhbEZpbGVuYW1lID8gY29udGV4dC5nZXRQaHlzaWNhbEZpbGVuYW1lKCkgOiBjb250ZXh0LmdldEZpbGVuYW1lKCkpLCBpLnBhdGgpKVxuICAgICAgICAgICAgICAuam9pbignIC0+ICcpO1xuXG4gICAgICAgICAgICBjb250ZXh0LnJlcG9ydChpbVtrZXldLCBgJHtuYW1lfSBub3QgZm91bmQgdmlhICR7ZGVlcFBhdGh9YCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnRleHQucmVwb3J0KGltW2tleV0sIGAke25hbWV9IG5vdCBmb3VuZCBpbiAnJHtub2RlLnNvdXJjZS52YWx1ZX0nYCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjaGVja1JlcXVpcmUobm9kZSkge1xuICAgICAgaWYgKFxuICAgICAgICAhb3B0aW9ucy5jb21tb25qc1xuICAgICAgICB8fCBub2RlLnR5cGUgIT09ICdWYXJpYWJsZURlY2xhcmF0b3InXG4gICAgICAgIC8vIHJldHVybiBpZiBpdCdzIG5vdCBhbiBvYmplY3QgZGVzdHJ1Y3R1cmUgb3IgaXQncyBhbiBlbXB0eSBvYmplY3QgZGVzdHJ1Y3R1cmVcbiAgICAgICAgfHwgIW5vZGUuaWQgfHwgbm9kZS5pZC50eXBlICE9PSAnT2JqZWN0UGF0dGVybicgfHwgbm9kZS5pZC5wcm9wZXJ0aWVzLmxlbmd0aCA9PT0gMFxuICAgICAgICAvLyByZXR1cm4gaWYgdGhlcmUgaXMgbm8gY2FsbCBleHByZXNzaW9uIG9uIHRoZSByaWdodCBzaWRlXG4gICAgICAgIHx8ICFub2RlLmluaXQgfHwgbm9kZS5pbml0LnR5cGUgIT09ICdDYWxsRXhwcmVzc2lvbidcbiAgICAgICkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNhbGwgPSBub2RlLmluaXQ7XG4gICAgICBjb25zdCBbc291cmNlXSA9IGNhbGwuYXJndW1lbnRzO1xuICAgICAgY29uc3QgdmFyaWFibGVJbXBvcnRzID0gbm9kZS5pZC5wcm9wZXJ0aWVzO1xuICAgICAgY29uc3QgdmFyaWFibGVFeHBvcnRzID0gRXhwb3J0cy5nZXQoc291cmNlLnZhbHVlLCBjb250ZXh0KTtcblxuICAgICAgaWYgKFxuICAgICAgICAvLyByZXR1cm4gaWYgaXQncyBub3QgYSBjb21tb25qcyByZXF1aXJlIHN0YXRlbWVudFxuICAgICAgICBjYWxsLmNhbGxlZS50eXBlICE9PSAnSWRlbnRpZmllcicgfHwgY2FsbC5jYWxsZWUubmFtZSAhPT0gJ3JlcXVpcmUnIHx8IGNhbGwuYXJndW1lbnRzLmxlbmd0aCAhPT0gMVxuICAgICAgICAvLyByZXR1cm4gaWYgaXQncyBub3QgYSBzdHJpbmcgc291cmNlXG4gICAgICAgIHx8IHNvdXJjZS50eXBlICE9PSAnTGl0ZXJhbCdcbiAgICAgICAgfHwgdmFyaWFibGVFeHBvcnRzID09IG51bGxcbiAgICAgICAgfHwgdmFyaWFibGVFeHBvcnRzLnBhcnNlR29hbCA9PT0gJ2FtYmlndW91cydcbiAgICAgICkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICh2YXJpYWJsZUV4cG9ydHMuZXJyb3JzLmxlbmd0aCkge1xuICAgICAgICB2YXJpYWJsZUV4cG9ydHMucmVwb3J0RXJyb3JzKGNvbnRleHQsIG5vZGUpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhcmlhYmxlSW1wb3J0cy5mb3JFYWNoKGZ1bmN0aW9uIChpbSkge1xuICAgICAgICBpZiAoaW0udHlwZSAhPT0gJ1Byb3BlcnR5JyB8fCAhaW0ua2V5IHx8IGltLmtleS50eXBlICE9PSAnSWRlbnRpZmllcicpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkZWVwTG9va3VwID0gdmFyaWFibGVFeHBvcnRzLmhhc0RlZXAoaW0ua2V5Lm5hbWUpO1xuXG4gICAgICAgIGlmICghZGVlcExvb2t1cC5mb3VuZCkge1xuICAgICAgICAgIGlmIChkZWVwTG9va3VwLnBhdGgubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgY29uc3QgZGVlcFBhdGggPSBkZWVwTG9va3VwLnBhdGhcbiAgICAgICAgICAgICAgLm1hcCgoaSkgPT4gcGF0aC5yZWxhdGl2ZShwYXRoLmRpcm5hbWUoY29udGV4dC5nZXRGaWxlbmFtZSgpKSwgaS5wYXRoKSlcbiAgICAgICAgICAgICAgLmpvaW4oJyAtPiAnKTtcblxuICAgICAgICAgICAgY29udGV4dC5yZXBvcnQoaW0ua2V5LCBgJHtpbS5rZXkubmFtZX0gbm90IGZvdW5kIHZpYSAke2RlZXBQYXRofWApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb250ZXh0LnJlcG9ydChpbS5rZXksIGAke2ltLmtleS5uYW1lfSBub3QgZm91bmQgaW4gJyR7c291cmNlLnZhbHVlfSdgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBJbXBvcnREZWNsYXJhdGlvbjogY2hlY2tTcGVjaWZpZXJzLmJpbmQobnVsbCwgJ2ltcG9ydGVkJywgJ0ltcG9ydFNwZWNpZmllcicpLFxuXG4gICAgICBFeHBvcnROYW1lZERlY2xhcmF0aW9uOiBjaGVja1NwZWNpZmllcnMuYmluZChudWxsLCAnbG9jYWwnLCAnRXhwb3J0U3BlY2lmaWVyJyksXG5cbiAgICAgIFZhcmlhYmxlRGVjbGFyYXRvcjogY2hlY2tSZXF1aXJlLFxuICAgIH07XG4gIH0sXG59O1xuIl19