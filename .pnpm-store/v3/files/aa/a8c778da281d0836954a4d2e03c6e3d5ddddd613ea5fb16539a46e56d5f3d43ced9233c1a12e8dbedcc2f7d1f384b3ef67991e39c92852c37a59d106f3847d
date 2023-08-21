'use strict';var _path = require('path');var _path2 = _interopRequireDefault(_path);

var _resolve = require('eslint-module-utils/resolve');var _resolve2 = _interopRequireDefault(_resolve);
var _moduleVisitor = require('eslint-module-utils/moduleVisitor');var _moduleVisitor2 = _interopRequireDefault(_moduleVisitor);
var _isGlob = require('is-glob');var _isGlob2 = _interopRequireDefault(_isGlob);
var _minimatch = require('minimatch');
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);
var _importType = require('../core/importType');var _importType2 = _interopRequireDefault(_importType);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

var containsPath = function containsPath(filepath, target) {
  var relative = _path2['default'].relative(target, filepath);
  return relative === '' || !relative.startsWith('..');
};

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      category: 'Static analysis',
      description: 'Enforce which files can be imported in a given folder.',
      url: (0, _docsUrl2['default'])('no-restricted-paths') },


    schema: [
    {
      type: 'object',
      properties: {
        zones: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'object',
            properties: {
              target: {
                anyOf: [
                { type: 'string' },
                {
                  type: 'array',
                  items: { type: 'string' },
                  uniqueItems: true,
                  minLength: 1 }] },



              from: {
                anyOf: [
                { type: 'string' },
                {
                  type: 'array',
                  items: { type: 'string' },
                  uniqueItems: true,
                  minLength: 1 }] },



              except: {
                type: 'array',
                items: {
                  type: 'string' },

                uniqueItems: true },

              message: { type: 'string' } },

            additionalProperties: false } },


        basePath: { type: 'string' } },

      additionalProperties: false }] },




  create: function () {function noRestrictedPaths(context) {
      var options = context.options[0] || {};
      var restrictedPaths = options.zones || [];
      var basePath = options.basePath || process.cwd();
      var currentFilename = context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename();
      var matchingZones = restrictedPaths.filter(
      function (zone) {return [].concat(zone.target).
        map(function (target) {return _path2['default'].resolve(basePath, target);}).
        some(function (targetPath) {return isMatchingTargetPath(currentFilename, targetPath);});});


      function isMatchingTargetPath(filename, targetPath) {
        if ((0, _isGlob2['default'])(targetPath)) {
          var mm = new _minimatch.Minimatch(targetPath);
          return mm.match(filename);
        }

        return containsPath(filename, targetPath);
      }

      function isValidExceptionPath(absoluteFromPath, absoluteExceptionPath) {
        var relativeExceptionPath = _path2['default'].relative(absoluteFromPath, absoluteExceptionPath);

        return (0, _importType2['default'])(relativeExceptionPath, context) !== 'parent';
      }

      function areBothGlobPatternAndAbsolutePath(areGlobPatterns) {
        return areGlobPatterns.some(function (isGlob) {return isGlob;}) && areGlobPatterns.some(function (isGlob) {return !isGlob;});
      }

      function reportInvalidExceptionPath(node) {
        context.report({
          node: node,
          message: 'Restricted path exceptions must be descendants of the configured `from` path for that zone.' });

      }

      function reportInvalidExceptionMixedGlobAndNonGlob(node) {
        context.report({
          node: node,
          message: 'Restricted path `from` must contain either only glob patterns or none' });

      }

      function reportInvalidExceptionGlob(node) {
        context.report({
          node: node,
          message: 'Restricted path exceptions must be glob patterns when `from` contains glob patterns' });

      }

      function computeMixedGlobAndAbsolutePathValidator() {
        return {
          isPathRestricted: function () {function isPathRestricted() {return true;}return isPathRestricted;}(),
          hasValidExceptions: false,
          reportInvalidException: reportInvalidExceptionMixedGlobAndNonGlob };

      }

      function computeGlobPatternPathValidator(absoluteFrom, zoneExcept) {
        var isPathException = void 0;

        var mm = new _minimatch.Minimatch(absoluteFrom);
        var isPathRestricted = function () {function isPathRestricted(absoluteImportPath) {return mm.match(absoluteImportPath);}return isPathRestricted;}();
        var hasValidExceptions = zoneExcept.every(_isGlob2['default']);

        if (hasValidExceptions) {
          var exceptionsMm = zoneExcept.map(function (except) {return new _minimatch.Minimatch(except);});
          isPathException = function () {function isPathException(absoluteImportPath) {return exceptionsMm.some(function (mm) {return mm.match(absoluteImportPath);});}return isPathException;}();
        }

        var reportInvalidException = reportInvalidExceptionGlob;

        return {
          isPathRestricted: isPathRestricted,
          hasValidExceptions: hasValidExceptions,
          isPathException: isPathException,
          reportInvalidException: reportInvalidException };

      }

      function computeAbsolutePathValidator(absoluteFrom, zoneExcept) {
        var isPathException = void 0;

        var isPathRestricted = function () {function isPathRestricted(absoluteImportPath) {return containsPath(absoluteImportPath, absoluteFrom);}return isPathRestricted;}();

        var absoluteExceptionPaths = zoneExcept.
        map(function (exceptionPath) {return _path2['default'].resolve(absoluteFrom, exceptionPath);});
        var hasValidExceptions = absoluteExceptionPaths.
        every(function (absoluteExceptionPath) {return isValidExceptionPath(absoluteFrom, absoluteExceptionPath);});

        if (hasValidExceptions) {
          isPathException = function () {function isPathException(absoluteImportPath) {return absoluteExceptionPaths.some(
              function (absoluteExceptionPath) {return containsPath(absoluteImportPath, absoluteExceptionPath);});}return isPathException;}();

        }

        var reportInvalidException = reportInvalidExceptionPath;

        return {
          isPathRestricted: isPathRestricted,
          hasValidExceptions: hasValidExceptions,
          isPathException: isPathException,
          reportInvalidException: reportInvalidException };

      }

      function reportInvalidExceptions(validators, node) {
        validators.forEach(function (validator) {return validator.reportInvalidException(node);});
      }

      function reportImportsInRestrictedZone(validators, node, importPath, customMessage) {
        validators.forEach(function () {
          context.report({
            node: node,
            message: 'Unexpected path "{{importPath}}" imported in restricted zone.' + (customMessage ? ' ' + String(customMessage) : ''),
            data: { importPath: importPath } });

        });
      }

      var makePathValidators = function () {function makePathValidators(zoneFrom) {var zoneExcept = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
          var allZoneFrom = [].concat(zoneFrom);
          var areGlobPatterns = allZoneFrom.map(_isGlob2['default']);

          if (areBothGlobPatternAndAbsolutePath(areGlobPatterns)) {
            return [computeMixedGlobAndAbsolutePathValidator()];
          }

          var isGlobPattern = areGlobPatterns.every(function (isGlob) {return isGlob;});

          return allZoneFrom.map(function (singleZoneFrom) {
            var absoluteFrom = _path2['default'].resolve(basePath, singleZoneFrom);

            if (isGlobPattern) {
              return computeGlobPatternPathValidator(absoluteFrom, zoneExcept);
            }
            return computeAbsolutePathValidator(absoluteFrom, zoneExcept);
          });
        }return makePathValidators;}();

      var validators = [];

      function checkForRestrictedImportPath(importPath, node) {
        var absoluteImportPath = (0, _resolve2['default'])(importPath, context);

        if (!absoluteImportPath) {
          return;
        }

        matchingZones.forEach(function (zone, index) {
          if (!validators[index]) {
            validators[index] = makePathValidators(zone.from, zone.except);
          }

          var applicableValidatorsForImportPath = validators[index].filter(function (validator) {return validator.isPathRestricted(absoluteImportPath);});

          var validatorsWithInvalidExceptions = applicableValidatorsForImportPath.filter(function (validator) {return !validator.hasValidExceptions;});
          reportInvalidExceptions(validatorsWithInvalidExceptions, node);

          var applicableValidatorsForImportPathExcludingExceptions = applicableValidatorsForImportPath.
          filter(function (validator) {return validator.hasValidExceptions && !validator.isPathException(absoluteImportPath);});
          reportImportsInRestrictedZone(applicableValidatorsForImportPathExcludingExceptions, node, importPath, zone.message);
        });
      }

      return (0, _moduleVisitor2['default'])(function (source) {
        checkForRestrictedImportPath(source.value, source);
      }, { commonjs: true });
    }return noRestrictedPaths;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1yZXN0cmljdGVkLXBhdGhzLmpzIl0sIm5hbWVzIjpbImNvbnRhaW5zUGF0aCIsImZpbGVwYXRoIiwidGFyZ2V0IiwicmVsYXRpdmUiLCJwYXRoIiwic3RhcnRzV2l0aCIsIm1vZHVsZSIsImV4cG9ydHMiLCJtZXRhIiwidHlwZSIsImRvY3MiLCJjYXRlZ29yeSIsImRlc2NyaXB0aW9uIiwidXJsIiwic2NoZW1hIiwicHJvcGVydGllcyIsInpvbmVzIiwibWluSXRlbXMiLCJpdGVtcyIsImFueU9mIiwidW5pcXVlSXRlbXMiLCJtaW5MZW5ndGgiLCJmcm9tIiwiZXhjZXB0IiwibWVzc2FnZSIsImFkZGl0aW9uYWxQcm9wZXJ0aWVzIiwiYmFzZVBhdGgiLCJjcmVhdGUiLCJub1Jlc3RyaWN0ZWRQYXRocyIsImNvbnRleHQiLCJvcHRpb25zIiwicmVzdHJpY3RlZFBhdGhzIiwicHJvY2VzcyIsImN3ZCIsImN1cnJlbnRGaWxlbmFtZSIsImdldFBoeXNpY2FsRmlsZW5hbWUiLCJnZXRGaWxlbmFtZSIsIm1hdGNoaW5nWm9uZXMiLCJmaWx0ZXIiLCJ6b25lIiwiY29uY2F0IiwibWFwIiwicmVzb2x2ZSIsInNvbWUiLCJ0YXJnZXRQYXRoIiwiaXNNYXRjaGluZ1RhcmdldFBhdGgiLCJmaWxlbmFtZSIsIm1tIiwiTWluaW1hdGNoIiwibWF0Y2giLCJpc1ZhbGlkRXhjZXB0aW9uUGF0aCIsImFic29sdXRlRnJvbVBhdGgiLCJhYnNvbHV0ZUV4Y2VwdGlvblBhdGgiLCJyZWxhdGl2ZUV4Y2VwdGlvblBhdGgiLCJhcmVCb3RoR2xvYlBhdHRlcm5BbmRBYnNvbHV0ZVBhdGgiLCJhcmVHbG9iUGF0dGVybnMiLCJpc0dsb2IiLCJyZXBvcnRJbnZhbGlkRXhjZXB0aW9uUGF0aCIsIm5vZGUiLCJyZXBvcnQiLCJyZXBvcnRJbnZhbGlkRXhjZXB0aW9uTWl4ZWRHbG9iQW5kTm9uR2xvYiIsInJlcG9ydEludmFsaWRFeGNlcHRpb25HbG9iIiwiY29tcHV0ZU1peGVkR2xvYkFuZEFic29sdXRlUGF0aFZhbGlkYXRvciIsImlzUGF0aFJlc3RyaWN0ZWQiLCJoYXNWYWxpZEV4Y2VwdGlvbnMiLCJyZXBvcnRJbnZhbGlkRXhjZXB0aW9uIiwiY29tcHV0ZUdsb2JQYXR0ZXJuUGF0aFZhbGlkYXRvciIsImFic29sdXRlRnJvbSIsInpvbmVFeGNlcHQiLCJpc1BhdGhFeGNlcHRpb24iLCJhYnNvbHV0ZUltcG9ydFBhdGgiLCJldmVyeSIsImV4Y2VwdGlvbnNNbSIsImNvbXB1dGVBYnNvbHV0ZVBhdGhWYWxpZGF0b3IiLCJhYnNvbHV0ZUV4Y2VwdGlvblBhdGhzIiwiZXhjZXB0aW9uUGF0aCIsInJlcG9ydEludmFsaWRFeGNlcHRpb25zIiwidmFsaWRhdG9ycyIsImZvckVhY2giLCJ2YWxpZGF0b3IiLCJyZXBvcnRJbXBvcnRzSW5SZXN0cmljdGVkWm9uZSIsImltcG9ydFBhdGgiLCJjdXN0b21NZXNzYWdlIiwiZGF0YSIsIm1ha2VQYXRoVmFsaWRhdG9ycyIsInpvbmVGcm9tIiwiYWxsWm9uZUZyb20iLCJpc0dsb2JQYXR0ZXJuIiwic2luZ2xlWm9uZUZyb20iLCJjaGVja0ZvclJlc3RyaWN0ZWRJbXBvcnRQYXRoIiwiaW5kZXgiLCJhcHBsaWNhYmxlVmFsaWRhdG9yc0ZvckltcG9ydFBhdGgiLCJ2YWxpZGF0b3JzV2l0aEludmFsaWRFeGNlcHRpb25zIiwiYXBwbGljYWJsZVZhbGlkYXRvcnNGb3JJbXBvcnRQYXRoRXhjbHVkaW5nRXhjZXB0aW9ucyIsInNvdXJjZSIsInZhbHVlIiwiY29tbW9uanMiXSwibWFwcGluZ3MiOiJhQUFBLDRCOztBQUVBLHNEO0FBQ0Esa0U7QUFDQSxpQztBQUNBO0FBQ0EscUM7QUFDQSxnRDs7QUFFQSxJQUFNQSxlQUFlLFNBQWZBLFlBQWUsQ0FBQ0MsUUFBRCxFQUFXQyxNQUFYLEVBQXNCO0FBQ3pDLE1BQU1DLFdBQVdDLGtCQUFLRCxRQUFMLENBQWNELE1BQWQsRUFBc0JELFFBQXRCLENBQWpCO0FBQ0EsU0FBT0UsYUFB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RztBQUNELFNBYkQ7QUFjRDs7QUFFRCxhQUFPLGdDQUFjLFVBQUNzRSxNQUFELEVBQVk7QUFDL0JMLHFDQUE2QkssT0FBT0MsS0FBcEMsRUFBMkNELE1BQTNDO0FBQ0QsT0FGTSxFQUVKLEVBQUVFLFVBQVUsSUFBWixFQUZJLENBQVA7QUFHRCxLQXpLRCxPQUFpQnBFLGlCQUFqQixJQTVEZSxFQUFqQiIsImZpbGUiOiJuby1yZXN0cmljdGVkLXBhdGhzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmltcG9ydCByZXNvbHZlIGZyb20gJ2VzbGludC1tb2R1bGUtdXRpbHMvcmVzb2x2ZSc7XG5pbXBvcnQgbW9kdWxlVmlzaXRvciBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL21vZHVsZVZpc2l0b3InO1xuaW1wb3J0IGlzR2xvYiBmcm9tICdpcy1nbG9iJztcbmltcG9ydCB7IE1pbmltYXRjaCB9IGZyb20gJ21pbmltYXRjaCc7XG5pbXBvcnQgZG9jc1VybCBmcm9tICcuLi9kb2NzVXJsJztcbmltcG9ydCBpbXBvcnRUeXBlIGZyb20gJy4uL2NvcmUvaW1wb3J0VHlwZSc7XG5cbmNvbnN0IGNvbnRhaW5zUGF0aCA9IChmaWxlcGF0aCwgdGFyZ2V0KSA9PiB7XG4gIGNvbnN0IHJlbGF0aXZlID0gcGF0aC5yZWxhdGl2ZSh0YXJnZXQsIGZpbGVwYXRoKTtcbiAgcmV0dXJuIHJlbGF0aXZlID09PSAnJyB8fCAhcmVsYXRpdmUuc3RhcnRzV2l0aCgnLi4nKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3Byb2JsZW0nLFxuICAgIGRvY3M6IHtcbiAgICAgIGNhdGVnb3J5OiAnU3RhdGljIGFuYWx5c2lzJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRW5mb3JjZSB3aGljaCBmaWxlcyBjYW4gYmUgaW1wb3J0ZWQgaW4gYSBnaXZlbiBmb2xkZXIuJyxcbiAgICAgIHVybDogZG9jc1VybCgnbm8tcmVzdHJpY3RlZC1wYXRocycpLFxuICAgIH0sXG5cbiAgICBzY2hlbWE6IFtcbiAgICAgIHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICB6b25lczoge1xuICAgICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICAgIG1pbkl0ZW1zOiAxLFxuICAgICAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IHtcbiAgICAgICAgICAgICAgICAgIGFueU9mOiBbXG4gICAgICAgICAgICAgICAgICAgIHsgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgICAgICAgICAgICAgaXRlbXM6IHsgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgICAgICAgICAgICAgICAgICB1bmlxdWVJdGVtczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICBtaW5MZW5ndGg6IDEsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZnJvbToge1xuICAgICAgICAgICAgICAgICAgYW55T2Y6IFtcbiAgICAgICAgICAgICAgICAgICAgeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICAgICAgICAgICAgICBpdGVtczogeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgICAgICAgICAgICAgICAgIHVuaXF1ZUl0ZW1zOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgIG1pbkxlbmd0aDogMSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBleGNlcHQ6IHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgICAgICAgICBpdGVtczoge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB1bmlxdWVJdGVtczogdHJ1ZSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHsgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgYWRkaXRpb25hbFByb3BlcnRpZXM6IGZhbHNlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGJhc2VQYXRoOiB7IHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcblxuICBjcmVhdGU6IGZ1bmN0aW9uIG5vUmVzdHJpY3RlZFBhdGhzKGNvbnRleHQpIHtcbiAgICBjb25zdCBvcHRpb25zID0gY29udGV4dC5vcHRpb25zWzBdIHx8IHt9O1xuICAgIGNvbnN0IHJlc3RyaWN0ZWRQYXRocyA9IG9wdGlvbnMuem9uZXMgfHwgW107XG4gICAgY29uc3QgYmFzZVBhdGggPSBvcHRpb25zLmJhc2VQYXRoIHx8IHByb2Nlc3MuY3dkKCk7XG4gICAgY29uc3QgY3VycmVudEZpbGVuYW1lID0gY29udGV4dC5nZXRQaHlzaWNhbEZpbGVuYW1lID8gY29udGV4dC5nZXRQaHlzaWNhbEZpbGVuYW1lKCkgOiBjb250ZXh0LmdldEZpbGVuYW1lKCk7XG4gICAgY29uc3QgbWF0Y2hpbmdab25lcyA9IHJlc3RyaWN0ZWRQYXRocy5maWx0ZXIoXG4gICAgICAoem9uZSkgPT4gW10uY29uY2F0KHpvbmUudGFyZ2V0KVxuICAgICAgICAubWFwKCh0YXJnZXQpID0+IHBhdGgucmVzb2x2ZShiYXNlUGF0aCwgdGFyZ2V0KSlcbiAgICAgICAgLnNvbWUoKHRhcmdldFBhdGgpID0+IGlzTWF0Y2hpbmdUYXJnZXRQYXRoKGN1cnJlbnRGaWxlbmFtZSwgdGFyZ2V0UGF0aCkpLFxuICAgICk7XG5cbiAgICBmdW5jdGlvbiBpc01hdGNoaW5nVGFyZ2V0UGF0aChmaWxlbmFtZSwgdGFyZ2V0UGF0aCkge1xuICAgICAgaWYgKGlzR2xvYih0YXJnZXRQYXRoKSkge1xuICAgICAgICBjb25zdCBtbSA9IG5ldyBNaW5pbWF0Y2godGFyZ2V0UGF0aCk7XG4gICAgICAgIHJldHVybiBtbS5tYXRjaChmaWxlbmFtZSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjb250YWluc1BhdGgoZmlsZW5hbWUsIHRhcmdldFBhdGgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzVmFsaWRFeGNlcHRpb25QYXRoKGFic29sdXRlRnJvbVBhdGgsIGFic29sdXRlRXhjZXB0aW9uUGF0aCkge1xuICAgICAgY29uc3QgcmVsYXRpdmVFeGNlcHRpb25QYXRoID0gcGF0aC5yZWxhdGl2ZShhYnNvbHV0ZUZyb21QYXRoLCBhYnNvbHV0ZUV4Y2VwdGlvblBhdGgpO1xuXG4gICAgICByZXR1cm4gaW1wb3J0VHlwZShyZWxhdGl2ZUV4Y2VwdGlvblBhdGgsIGNvbnRleHQpICE9PSAncGFyZW50JztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhcmVCb3RoR2xvYlBhdHRlcm5BbmRBYnNvbHV0ZVBhdGgoYXJlR2xvYlBhdHRlcm5zKSB7XG4gICAgICByZXR1cm4gYXJlR2xvYlBhdHRlcm5zLnNvbWUoKGlzR2xvYikgPT4gaXNHbG9iKSAmJiBhcmVHbG9iUGF0dGVybnMuc29tZSgoaXNHbG9iKSA9PiAhaXNHbG9iKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXBvcnRJbnZhbGlkRXhjZXB0aW9uUGF0aChub2RlKSB7XG4gICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgIG5vZGUsXG4gICAgICAgIG1lc3NhZ2U6ICdSZXN0cmljdGVkIHBhdGggZXhjZXB0aW9ucyBtdXN0IGJlIGRlc2NlbmRhbnRzIG9mIHRoZSBjb25maWd1cmVkIGBmcm9tYCBwYXRoIGZvciB0aGF0IHpvbmUuJyxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlcG9ydEludmFsaWRFeGNlcHRpb25NaXhlZEdsb2JBbmROb25HbG9iKG5vZGUpIHtcbiAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgbm9kZSxcbiAgICAgICAgbWVzc2FnZTogJ1Jlc3RyaWN0ZWQgcGF0aCBgZnJvbWAgbXVzdCBjb250YWluIGVpdGhlciBvbmx5IGdsb2IgcGF0dGVybnMgb3Igbm9uZScsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXBvcnRJbnZhbGlkRXhjZXB0aW9uR2xvYihub2RlKSB7XG4gICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgIG5vZGUsXG4gICAgICAgIG1lc3NhZ2U6ICdSZXN0cmljdGVkIHBhdGggZXhjZXB0aW9ucyBtdXN0IGJlIGdsb2IgcGF0dGVybnMgd2hlbiBgZnJvbWAgY29udGFpbnMgZ2xvYiBwYXR0ZXJucycsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb21wdXRlTWl4ZWRHbG9iQW5kQWJzb2x1dGVQYXRoVmFsaWRhdG9yKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaXNQYXRoUmVzdHJpY3RlZDogKCkgPT4gdHJ1ZSxcbiAgICAgICAgaGFzVmFsaWRFeGNlcHRpb25zOiBmYWxzZSxcbiAgICAgICAgcmVwb3J0SW52YWxpZEV4Y2VwdGlvbjogcmVwb3J0SW52YWxpZEV4Y2VwdGlvbk1peGVkR2xvYkFuZE5vbkdsb2IsXG4gICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbXB1dGVHbG9iUGF0dGVyblBhdGhWYWxpZGF0b3IoYWJzb2x1dGVGcm9tLCB6b25lRXhjZXB0KSB7XG4gICAgICBsZXQgaXNQYXRoRXhjZXB0aW9uO1xuXG4gICAgICBjb25zdCBtbSA9IG5ldyBNaW5pbWF0Y2goYWJzb2x1dGVGcm9tKTtcbiAgICAgIGNvbnN0IGlzUGF0aFJlc3RyaWN0ZWQgPSAoYWJzb2x1dGVJbXBvcnRQYXRoKSA9PiBtbS5tYXRjaChhYnNvbHV0ZUltcG9ydFBhdGgpO1xuICAgICAgY29uc3QgaGFzVmFsaWRFeGNlcHRpb25zID0gem9uZUV4Y2VwdC5ldmVyeShpc0dsb2IpO1xuXG4gICAgICBpZiAoaGFzVmFsaWRFeGNlcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IGV4Y2VwdGlvbnNNbSA9IHpvbmVFeGNlcHQubWFwKChleGNlcHQpID0+IG5ldyBNaW5pbWF0Y2goZXhjZXB0KSk7XG4gICAgICAgIGlzUGF0aEV4Y2VwdGlvbiA9IChhYnNvbHV0ZUltcG9ydFBhdGgpID0+IGV4Y2VwdGlvbnNNbS5zb21lKChtbSkgPT4gbW0ubWF0Y2goYWJzb2x1dGVJbXBvcnRQYXRoKSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlcG9ydEludmFsaWRFeGNlcHRpb24gPSByZXBvcnRJbnZhbGlkRXhjZXB0aW9uR2xvYjtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaXNQYXRoUmVzdHJpY3RlZCxcbiAgICAgICAgaGFzVmFsaWRFeGNlcHRpb25zLFxuICAgICAgICBpc1BhdGhFeGNlcHRpb24sXG4gICAgICAgIHJlcG9ydEludmFsaWRFeGNlcHRpb24sXG4gICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbXB1dGVBYnNvbHV0ZVBhdGhWYWxpZGF0b3IoYWJzb2x1dGVGcm9tLCB6b25lRXhjZXB0KSB7XG4gICAgICBsZXQgaXNQYXRoRXhjZXB0aW9uO1xuXG4gICAgICBjb25zdCBpc1BhdGhSZXN0cmljdGVkID0gKGFic29sdXRlSW1wb3J0UGF0aCkgPT4gY29udGFpbnNQYXRoKGFic29sdXRlSW1wb3J0UGF0aCwgYWJzb2x1dGVGcm9tKTtcblxuICAgICAgY29uc3QgYWJzb2x1dGVFeGNlcHRpb25QYXRocyA9IHpvbmVFeGNlcHRcbiAgICAgICAgLm1hcCgoZXhjZXB0aW9uUGF0aCkgPT4gcGF0aC5yZXNvbHZlKGFic29sdXRlRnJvbSwgZXhjZXB0aW9uUGF0aCkpO1xuICAgICAgY29uc3QgaGFzVmFsaWRFeGNlcHRpb25zID0gYWJzb2x1dGVFeGNlcHRpb25QYXRoc1xuICAgICAgICAuZXZlcnkoKGFic29sdXRlRXhjZXB0aW9uUGF0aCkgPT4gaXNWYWxpZEV4Y2VwdGlvblBhdGgoYWJzb2x1dGVGcm9tLCBhYnNvbHV0ZUV4Y2VwdGlvblBhdGgpKTtcblxuICAgICAgaWYgKGhhc1ZhbGlkRXhjZXB0aW9ucykge1xuICAgICAgICBpc1BhdGhFeGNlcHRpb24gPSAoYWJzb2x1dGVJbXBvcnRQYXRoKSA9PiBhYnNvbHV0ZUV4Y2VwdGlvblBhdGhzLnNvbWUoXG4gICAgICAgICAgKGFic29sdXRlRXhjZXB0aW9uUGF0aCkgPT4gY29udGFpbnNQYXRoKGFic29sdXRlSW1wb3J0UGF0aCwgYWJzb2x1dGVFeGNlcHRpb25QYXRoKSxcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVwb3J0SW52YWxpZEV4Y2VwdGlvbiA9IHJlcG9ydEludmFsaWRFeGNlcHRpb25QYXRoO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBpc1BhdGhSZXN0cmljdGVkLFxuICAgICAgICBoYXNWYWxpZEV4Y2VwdGlvbnMsXG4gICAgICAgIGlzUGF0aEV4Y2VwdGlvbixcbiAgICAgICAgcmVwb3J0SW52YWxpZEV4Y2VwdGlvbixcbiAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVwb3J0SW52YWxpZEV4Y2VwdGlvbnModmFsaWRhdG9ycywgbm9kZSkge1xuICAgICAgdmFsaWRhdG9ycy5mb3JFYWNoKCh2YWxpZGF0b3IpID0+IHZhbGlkYXRvci5yZXBvcnRJbnZhbGlkRXhjZXB0aW9uKG5vZGUpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXBvcnRJbXBvcnRzSW5SZXN0cmljdGVkWm9uZSh2YWxpZGF0b3JzLCBub2RlLCBpbXBvcnRQYXRoLCBjdXN0b21NZXNzYWdlKSB7XG4gICAgICB2YWxpZGF0b3JzLmZvckVhY2goKCkgPT4ge1xuICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgbm9kZSxcbiAgICAgICAgICBtZXNzYWdlOiBgVW5leHBlY3RlZCBwYXRoIFwie3tpbXBvcnRQYXRofX1cIiBpbXBvcnRlZCBpbiByZXN0cmljdGVkIHpvbmUuJHtjdXN0b21NZXNzYWdlID8gYCAke2N1c3RvbU1lc3NhZ2V9YCA6ICcnfWAsXG4gICAgICAgICAgZGF0YTogeyBpbXBvcnRQYXRoIH0sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgbWFrZVBhdGhWYWxpZGF0b3JzID0gKHpvbmVGcm9tLCB6b25lRXhjZXB0ID0gW10pID0+IHtcbiAgICAgIGNvbnN0IGFsbFpvbmVGcm9tID0gW10uY29uY2F0KHpvbmVGcm9tKTtcbiAgICAgIGNvbnN0IGFyZUdsb2JQYXR0ZXJucyA9IGFsbFpvbmVGcm9tLm1hcChpc0dsb2IpO1xuXG4gICAgICBpZiAoYXJlQm90aEdsb2JQYXR0ZXJuQW5kQWJzb2x1dGVQYXRoKGFyZUdsb2JQYXR0ZXJucykpIHtcbiAgICAgICAgcmV0dXJuIFtjb21wdXRlTWl4ZWRHbG9iQW5kQWJzb2x1dGVQYXRoVmFsaWRhdG9yKCldO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBpc0dsb2JQYXR0ZXJuID0gYXJlR2xvYlBhdHRlcm5zLmV2ZXJ5KChpc0dsb2IpID0+IGlzR2xvYik7XG5cbiAgICAgIHJldHVybiBhbGxab25lRnJvbS5tYXAoKHNpbmdsZVpvbmVGcm9tKSA9PiB7XG4gICAgICAgIGNvbnN0IGFic29sdXRlRnJvbSA9IHBhdGgucmVzb2x2ZShiYXNlUGF0aCwgc2luZ2xlWm9uZUZyb20pO1xuXG4gICAgICAgIGlmIChpc0dsb2JQYXR0ZXJuKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbXB1dGVHbG9iUGF0dGVyblBhdGhWYWxpZGF0b3IoYWJzb2x1dGVGcm9tLCB6b25lRXhjZXB0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29tcHV0ZUFic29sdXRlUGF0aFZhbGlkYXRvcihhYnNvbHV0ZUZyb20sIHpvbmVFeGNlcHQpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGNvbnN0IHZhbGlkYXRvcnMgPSBbXTtcblxuICAgIGZ1bmN0aW9uIGNoZWNrRm9yUmVzdHJpY3RlZEltcG9ydFBhdGgoaW1wb3J0UGF0aCwgbm9kZSkge1xuICAgICAgY29uc3QgYWJzb2x1dGVJbXBvcnRQYXRoID0gcmVzb2x2ZShpbXBvcnRQYXRoLCBjb250ZXh0KTtcblxuICAgICAgaWYgKCFhYnNvbHV0ZUltcG9ydFBhdGgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBtYXRjaGluZ1pvbmVzLmZvckVhY2goKHpvbmUsIGluZGV4KSA9PiB7XG4gICAgICAgIGlmICghdmFsaWRhdG9yc1tpbmRleF0pIHtcbiAgICAgICAgICB2YWxpZGF0b3JzW2luZGV4XSA9IG1ha2VQYXRoVmFsaWRhdG9ycyh6b25lLmZyb20sIHpvbmUuZXhjZXB0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGFwcGxpY2FibGVWYWxpZGF0b3JzRm9ySW1wb3J0UGF0aCA9IHZhbGlkYXRvcnNbaW5kZXhdLmZpbHRlcigodmFsaWRhdG9yKSA9PiB2YWxpZGF0b3IuaXNQYXRoUmVzdHJpY3RlZChhYnNvbHV0ZUltcG9ydFBhdGgpKTtcblxuICAgICAgICBjb25zdCB2YWxpZGF0b3JzV2l0aEludmFsaWRFeGNlcHRpb25zID0gYXBwbGljYWJsZVZhbGlkYXRvcnNGb3JJbXBvcnRQYXRoLmZpbHRlcigodmFsaWRhdG9yKSA9PiAhdmFsaWRhdG9yLmhhc1ZhbGlkRXhjZXB0aW9ucyk7XG4gICAgICAgIHJlcG9ydEludmFsaWRFeGNlcHRpb25zKHZhbGlkYXRvcnNXaXRoSW52YWxpZEV4Y2VwdGlvbnMsIG5vZGUpO1xuXG4gICAgICAgIGNvbnN0IGFwcGxpY2FibGVWYWxpZGF0b3JzRm9ySW1wb3J0UGF0aEV4Y2x1ZGluZ0V4Y2VwdGlvbnMgPSBhcHBsaWNhYmxlVmFsaWRhdG9yc0ZvckltcG9ydFBhdGhcbiAgICAgICAgICAuZmlsdGVyKCh2YWxpZGF0b3IpID0+IHZhbGlkYXRvci5oYXNWYWxpZEV4Y2VwdGlvbnMgJiYgIXZhbGlkYXRvci5pc1BhdGhFeGNlcHRpb24oYWJzb2x1dGVJbXBvcnRQYXRoKSk7XG4gICAgICAgIHJlcG9ydEltcG9ydHNJblJlc3RyaWN0ZWRab25lKGFwcGxpY2FibGVWYWxpZGF0b3JzRm9ySW1wb3J0UGF0aEV4Y2x1ZGluZ0V4Y2VwdGlvbnMsIG5vZGUsIGltcG9ydFBhdGgsIHpvbmUubWVzc2FnZSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbW9kdWxlVmlzaXRvcigoc291cmNlKSA9PiB7XG4gICAgICBjaGVja0ZvclJlc3RyaWN0ZWRJbXBvcnRQYXRoKHNvdXJjZS52YWx1ZSwgc291cmNlKTtcbiAgICB9LCB7IGNvbW1vbmpzOiB0cnVlIH0pO1xuICB9LFxufTtcbiJdfQ==