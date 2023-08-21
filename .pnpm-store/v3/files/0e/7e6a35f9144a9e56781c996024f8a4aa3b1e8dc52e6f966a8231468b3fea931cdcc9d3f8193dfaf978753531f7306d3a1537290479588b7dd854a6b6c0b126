'use strict';var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();

var _minimatch = require('minimatch');var _minimatch2 = _interopRequireDefault(_minimatch);
var _arrayIncludes = require('array-includes');var _arrayIncludes2 = _interopRequireDefault(_arrayIncludes);
var _object = require('object.groupby');var _object2 = _interopRequireDefault(_object);

var _importType = require('../core/importType');var _importType2 = _interopRequireDefault(_importType);
var _staticRequire = require('../core/staticRequire');var _staticRequire2 = _interopRequireDefault(_staticRequire);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

var defaultGroups = ['builtin', 'external', 'parent', 'sibling', 'index'];

// REPORTING AND FIXING

function reverse(array) {
  return array.map(function (v) {
    return Object.assign({}, v, { rank: -v.rank });
  }).reverse();
}

function getTokensOrCommentsAfter(sourceCode, node, count) {
  var currentNodeOrToken = node;
  var result = [];
  for (var i = 0; i < count; i++) {
    currentNodeOrToken = sourceCode.getTokenOrCommentAfter(currentNodeOrToken);
    if (currentNodeOrToken == null) {
      break;
    }
    result.push(currentNodeOrToken);
  }
  return result;
}

function getTokensOrCommentsBefore(sourceCode, node, count) {
  var currentNodeOrToken = node;
  var result = [];
  for (var i = 0; i < count; i++) {
    currentNodeOrToken = sourceCode.getTokenOrCommentBefore(currentNodeOrToken);
    if (currentNodeOrToken == null) {
      break;
    }
    result.push(currentNodeOrToken);
  }
  return result.reverse();
}

function takeTokensAfterWhile(sourceCode, node, condition) {
  var tokens = getTokensOrCommentsAfter(sourceCode, node, 100);
  var result = [];
  for (var i = 0; i < tokens.length; i++) {
    if (condition(tokens[i])) {
      result.push(tokens[i]);
    } else {
      break;
    }
  }
  return result;
}

function takeTokensBeforeWhile(sourceCode, node, condition) {
  var tokens = getTokensOrCommentsBefore(sourceCode, node, 100);
  var result = [];
  for (var i = tokens.length - 1; i >= 0; i--) {
    if (condition(tokens[i])) {
      result.push(tokens[i]);
    } else {
      break;
    }
  }
  return result.reverse();
}

function findOutOfOrder(imported) {
  if (imported.length === 0) {
    return [];
  }
  var maxSeenRankNode = imported[0];
  return imported.filter(function (importedModule) {
    var res = importedModule.rank < maxSeenRankNode.rank;
    if (maxSeenRankNode.rank < importedModule.rank) {
      maxSeenRankNode = importedModule;
    }
    return res;
  });
}

function findRootNode(node) {
  var parent = node;
  while (parent.parent != null && parent.parent.body == null) {
    parent = parent.parent;
  }
  return parent;
}

function findEndOfLineWithComments(sourceCode, node) {
  var tokensToEndOfLine = takeTokensAfterWhile(sourceCode, node, commentOnSameLineAs(node));
  var endOfTokens = tokensToEndOfLine.length > 0 ?
  tokensToEndOfLine[tokensToEndOfLine.length - 1].range[1] :
  node.range[1];
  var result = endOfTokens;
  for (var i = endOfTokens; i < sourceCode.text.length; i++) {
    if (sourceCode.text[i] === '\n') {
      result = i + 1;
      break;
    }
    if (sourceCode.text[i] !== ' ' && sourceCode.text[i] !== '\t' && sourceCode.text[i] !== '\r') {
      break;
    }
    result = i + 1;
  }
  return result;
}

function commentOnSameLineAs(node) {
  return function (token) {return (token.type === 'Block' || token.type === 'Line') &&
    token.loc.start.line === token.loc.end.line &&
    token.loc.end.line === node.loc.end.line;};
}

function findStartOfLineWithComments(sourceCode, node) {
  var tokensToEndOfLine = takeTokensBeforeWhile(sourceCode, node, commentOnSameLineAs(node));
  var startOfTokens = tokensToEndOfLine.length > 0 ? tokensToEndOfLine[0].range[0] : node.range[0];
  var result = startOfTokens;
  for (var i = startOfTokens - 1; i > 0; i--) {
    if (sourceCode.text[i] !== ' ' && sourceCode.text[i] !== '\t') {
      break;
    }
    result = i;
  }
  return result;
}

function isRequireExpression(expr) {
  return expr != null &&
  expr.type === 'CallExpression' &&
  expr.callee != null &&
  expr.callee.name === 'require' &&
  expr.arguments != null &&
  expr.arguments.length === 1 &&
  expr.arguments[0].type === 'Literal';
}

function isSupportedRequireModule(node) {
  if (node.type !== 'VariableDeclaration') {
    return false;
  }
  if (node.declarations.length !== 1) {
    return false;
  }
  var decl = node.declarations[0];
  var isPlainRequire = decl.id && (
  decl.id.type === 'Identifier' || decl.id.type === 'ObjectPattern') &&
  isRequireExpression(decl.init);
  var isRequireWithMemberExpression = decl.id && (
  decl.id.type === 'Identifier' || decl.id.type === 'ObjectPattern') &&
  decl.init != null &&
  decl.init.type === 'CallExpression' &&
  decl.init.callee != null &&
  decl.init.callee.type === 'MemberExpression' &&
  isRequireExpression(decl.init.callee.object);
  return isPlainRequire || isRequireWithMemberExpression;
}

function isPlainImportModule(node) {
  return node.type === 'ImportDeclaration' && node.specifiers != null && node.specifiers.length > 0;
}

function isPlainImportEquals(node) {
  return node.type === 'TSImportEqualsDeclaration' && node.moduleReference.expression;
}

function canCrossNodeWhileReorder(node) {
  return isSupportedRequireModule(node) || isPlainImportModule(node) || isPlainImportEquals(node);
}

function canReorderItems(firstNode, secondNode) {
  var parent = firstNode.parent;var _sort =
  [
  parent.body.indexOf(firstNode),
  parent.body.indexOf(secondNode)].
  sort(),_sort2 = _slicedToArray(_sort, 2),firstIndex = _sort2[0],secondIndex = _sort2[1];
  var nodesBetween = parent.body.slice(firstIndex, secondIndex + 1);var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {
    for (var _iterator = nodesBetween[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var nodeBetween = _step.value;
      if (!canCrossNodeWhileReorder(nodeBetween)) {
        return false;
      }
    }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator['return']) {_iterator['return']();}} finally {if (_didIteratorError) {throw _iteratorError;}}}
  return true;
}

function makeImportDescription(node) {
  if (node.node.importKind === 'type') {
    return 'type import';
  }
  if (node.node.importKind === 'typeof') {
    return 'typeof import';
  }
  return 'import';
}

function fixOutOfOrder(context, firstNode, secondNode, order) {
  var sourceCode = context.getSourceCode();

  var firstRoot = findRootNode(firstNode.node);
  var firstRootStart = findStartOfLineWithComments(sourceCode, firstRoot);
  var firstRootEnd = findEndOfLineWithComments(sourceCode, firstRoot);

  var secondRoot = findRootNode(secondNode.node);
  var secondRootStart = findStartOfLineWithComments(sourceCode, secondRoot);
  var secondRootEnd = findEndOfLineWithComments(sourceCode, secondRoot);
  var canFix = canReorderItems(firstRoot, secondRoot);

  var newCode = sourceCode.text.substring(secondRootStart, secondRootEnd);
  if (newCode[newCode.length - 1] !== '\n') {
    newCode = String(newCode) + '\n';
  }

  var firstImport = String(makeImportDescription(firstNode)) + ' of `' + String(firstNode.displayName) + '`';
  var secondImport = '`' + String(secondNode.displayName) + '` ' + String(makeImportDescription(secondNode));
  var message = secondImport + ' should occur ' + String(order) + ' ' + firstImport;

  if (order === 'before') {
    context.report({
      node: secondNode.node,
      message: message,
      fix: canFix && function (fixer) {return fixer.replaceTextRange(
        [firstRootStart, secondRootEnd],
        newCode + sourceCode.text.substring(firstRootStart, secondRootStart));} });


  } else if (order === 'after') {
    context.report({
      node: secondNode.node,
      message: message,
      fix: canFix && function (fixer) {return fixer.replaceTextRange(
        [secondRootStart, firstRootEnd],
        sourceCode.text.substring(secondRootEnd, firstRootEnd) + newCode);} });


  }
}

function reportOutOfOrder(context, imported, outOfOrder, order) {
  outOfOrder.forEach(function (imp) {
    var found = imported.find(function () {function hasHigherRank(importedItem) {
        return importedItem.rank > imp.rank;
      }return hasHigherRank;}());
    fixOutOfOrder(context, found, imp, order);
  });
}

function makeOutOfOrderReport(context, imported) {
  var outOfOrder = findOutOfOrder(imported);
  if (!outOfOrder.length) {
    return;
  }

  // There are things to report. Try to minimize the number of reported errors.
  var reversedImported = reverse(imported);
  var reversedOrder = findOutOfOrder(reversedImported);
  if (reversedOrder.length < outOfOrder.length) {
    reportOutOfOrder(context, reversedImported, reversedOrder, 'after');
    return;
  }
  reportOutOfOrder(context, imported, outOfOrder, 'before');
}

var compareString = function compareString(a, b) {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
};

/** Some parsers (languages without types) don't provide ImportKind */
var DEAFULT_IMPORT_KIND = 'value';
var getNormalizedValue = function getNormalizedValue(node, toLowerCase) {
  var value = node.value;
  return toLowerCase ? String(value).toLowerCase() : value;
};

function getSorter(alphabetizeOptions) {
  var multiplier = alphabetizeOptions.order === 'asc' ? 1 : -1;
  var orderImportKind = alphabetizeOptions.orderImportKind;
  var multiplierImportKind = orderImportKind !== 'ignore' && (
  alphabetizeOptions.orderImportKind === 'asc' ? 1 : -1);

  return function () {function importsSorter(nodeA, nodeB) {
      var importA = getNormalizedValue(nodeA, alphabetizeOptions.caseInsensitive);
      var importB = getNormalizedValue(nodeB, alphabetizeOptions.caseInsensitive);
      var result = 0;

      if (!(0, _arrayIncludes2['default'])(importA, '/') && !(0, _arrayIncludes2['default'])(importB, '/')) {
        result = compareString(importA, importB);
      } else {
        var A = importA.split('/');
        var B = importB.split('/');
        var a = A.length;
        var b = B.length;

        for (var i = 0; i < Math.min(a, b); i++) {
          result = compareString(A[i], B[i]);
          if (result) {break;}
        }

        if (!result && a !== b) {
          result = a < b ? -1 : 1;
        }
      }

      result = result * multiplier;

      // In case the paths are equal (result === 0), sort them by importKind
      if (!result && multiplierImportKind) {
        result = multiplierImportKind * compareString(
        nodeA.node.importKind || DEAFULT_IMPORT_KIND,
        nodeB.node.importKind || DEAFULT_IMPORT_KIND);

      }

      return result;
    }return importsSorter;}();
}

function mutateRanksToAlphabetize(imported, alphabetizeOptions) {
  var groupedByRanks = (0, _object2['default'])(imported, function (item) {return item.rank;});

  var sorterFn = getSorter(alphabetizeOptions);

  // sort group keys so that they can be iterated on in order
  var groupRanks = Object.keys(groupedByRanks).sort(function (a, b) {
    return a - b;
  });

  // sort imports locally within their group
  groupRanks.forEach(function (groupRank) {
    groupedByRanks[groupRank].sort(sorterFn);
  });

  // assign globally unique rank to each import
  var newRank = 0;
  var alphabetizedRanks = groupRanks.reduce(function (acc, groupRank) {
    groupedByRanks[groupRank].forEach(function (importedItem) {
      acc[String(importedItem.value) + '|' + String(importedItem.node.importKind)] = parseInt(groupRank, 10) + newRank;
      newRank += 1;
    });
    return acc;
  }, {});

  // mutate the original group-rank with alphabetized-rank
  imported.forEach(function (importedItem) {
    importedItem.rank = alphabetizedRanks[String(importedItem.value) + '|' + String(importedItem.node.importKind)];
  });
}

// DETECTING

function computePathRank(ranks, pathGroups, path, maxPosition) {
  for (var i = 0, l = pathGroups.length; i < l; i++) {var _pathGroups$i =
    pathGroups[i],pattern = _pathGroups$i.pattern,patternOptions = _pathGroups$i.patternOptions,group = _pathGroups$i.group,_pathGroups$i$positio = _pathGroups$i.position,position = _pathGroups$i$positio === undefined ? 1 : _pathGroups$i$positio;
    if ((0, _minimatch2['default'])(path, pattern, patternOptions || { nocomment: true })) {
      return ranks[group] + position / maxPosition;
    }
  }
}

function computeRank(context, ranks, importEntry, excludedImportTypes) {
  var impType = void 0;
  var rank = void 0;
  if (importEntry.type === 'import:object') {
    impType = 'object';
  } else if (importEntry.node.importKind === 'type' && ranks.omittedTypes.indexOf('type') === -1) {
    impType = 'type';
  } else {
    impType = (0, _importType2['default'])(importEntry.value, context);
  }
  if (!excludedImportTypes.has(impType)) {
    rank = computePathRank(ranks.groups, ranks.pathGroups, importEntry.value, ranks.maxPosition);
  }
  if (typeof rank === 'undefined') {
    rank = ranks.groups[impType];
  }
  if (importEntry.type !== 'import' && !importEntry.type.startsWith('import:')) {
    rank += 100;
  }

  return rank;
}

function registerNode(context, importEntry, ranks, imported, excludedImportTypes) {
  var rank = computeRank(context, ranks, importEntry, excludedImportTypes);
  if (rank !== -1) {
    imported.push(Object.assign({}, importEntry, { rank: rank }));
  }
}

function getRequireBlock(node) {
  var n = node;
  // Handle cases like `const baz = require('foo').bar.baz`
  // and `const foo = require('foo')()`
  while (
  n.parent.type === 'MemberExpression' && n.parent.object === n ||
  n.parent.type === 'CallExpression' && n.parent.callee === n)
  {
    n = n.parent;
  }
  if (
  n.parent.type === 'VariableDeclarator' &&
  n.parent.parent.type === 'VariableDeclaration' &&
  n.parent.parent.parent.type === 'Program')
  {
    return n.parent.parent.parent;
  }
}

var types = ['builtin', 'external', 'internal', 'unknown', 'parent', 'sibling', 'index', 'object', 'type'];

// Creates an object with type-rank pairs.
// Example: { index: 0, sibling: 1, parent: 1, external: 1, builtin: 2, internal: 2 }
// Will throw an error if it contains a type that does not exist, or has a duplicate
function convertGroupsToRanks(groups) {
  var rankObject = groups.reduce(function (res, group, index) {
    [].concat(group).forEach(function (groupItem) {
      if (types.indexOf(groupItem) === -1) {
        throw new Error('Incorrect configuration of the rule: Unknown type `' + String(JSON.stringify(groupItem)) + '`');
      }
      if (res[groupItem] !== undefined) {
        throw new Error('Incorrect configuration of the rule: `' + String(groupItem) + '` is duplicated');
      }
      res[groupItem] = index * 2;
    });
    return res;
  }, {});

  var omittedTypes = types.filter(function (type) {
    return typeof rankObject[type] === 'undefined';
  });

  var ranks = omittedTypes.reduce(function (res, type) {
    res[type] = groups.length * 2;
    return res;
  }, rankObject);

  return { groups: ranks, omittedTypes: omittedTypes };
}

function convertPathGroupsForRanks(pathGroups) {
  var after = {};
  var before = {};

  var transformed = pathGroups.map(function (pathGroup, index) {var
    group = pathGroup.group,positionString = pathGroup.position;
    var position = 0;
    if (positionString === 'after') {
      if (!after[group]) {
        after[group] = 1;
      }
      position = after[group]++;
    } else if (positionString === 'before') {
      if (!before[group]) {
        before[group] = [];
      }
      before[group].push(index);
    }

    return Object.assign({}, pathGroup, { position: position });
  });

  var maxPosition = 1;

  Object.keys(before).forEach(function (group) {
    var groupLength = before[group].length;
    before[group].forEach(function (groupIndex, index) {
      transformed[groupIndex].position = -1 * (groupLength - index);
    });
    maxPosition = Math.max(maxPosition, groupLength);
  });

  Object.keys(after).forEach(function (key) {
    var groupNextPosition = after[key];
    maxPosition = Math.max(maxPosition, groupNextPosition - 1);
  });

  return {
    pathGroups: transformed,
    maxPosition: maxPosition > 10 ? Math.pow(10, Math.ceil(Math.log10(maxPosition))) : 10 };

}

function fixNewLineAfterImport(context, previousImport) {
  var prevRoot = findRootNode(previousImport.node);
  var tokensToEndOfLine = takeTokensAfterWhile(
  context.getSourceCode(), prevRoot, commentOnSameLineAs(prevRoot));

  var endOfLine = prevRoot.range[1];
  if (tokensToEndOfLine.length > 0) {
    endOfLine = tokensToEndOfLine[tokensToEndOfLine.length - 1].range[1];
  }
  return function (fixer) {return fixer.insertTextAfterRange([prevRoot.range[0], endOfLine], '\n');};
}

function removeNewLineAfterImport(context, currentImport, previousImport) {
  var sourceCode = context.getSourceCode();
  var prevRoot = findRootNode(previousImport.node);
  var currRoot = findRootNode(currentImport.node);
  var rangeToRemove = [
  findEndOfLineWithComments(sourceCode, prevRoot),
  findStartOfLineWithComments(sourceCode, currRoot)];

  if (/^\s*$/.test(sourceCode.text.substring(rangeToRemove[0], rangeToRemove[1]))) {
    return function (fixer) {return fixer.removeRange(rangeToRemove);};
  }
  return undefined;
}

function makeNewlinesBetweenReport(context, imported, newlinesBetweenImports, distinctGroup) {
  var getNumberOfEmptyLinesBetween = function getNumberOfEmptyLinesBetween(currentImport, previousImport) {
    var linesBetweenImports = context.getSourceCode().lines.slice(
    previousImport.node.loc.end.line,
    currentImport.node.loc.start.line - 1);


    return linesBetweenImports.filter(function (line) {return !line.trim().length;}).length;
  };
  var getIsStartOfDistinctGroup = function getIsStartOfDistinctGroup(currentImport, previousImport) {return currentImport.rank - 1 >= previousImport.rank;};
  var previousImport = imported[0];

  imported.slice(1).forEach(function (currentImport) {
    var emptyLinesBetween = getNumberOfEmptyLinesBetween(currentImport, previousImport);
    var isStartOfDistinctGroup = getIsStartOfDistinctGroup(currentImport, previousImport);

    if (newlinesBetweenImports === 'always' ||
    newlinesBetweenImports === 'always-and-inside-groups') {
      if (currentImport.rank !== previousImport.rank && emptyLinesBetween === 0) {
        if (distinctGroup || !distinctGroup && isStartOfDistinctGroup) {
          context.report({
            node: previousImport.node,
            message: 'There should be at least one empty line between import groups',
            fix: fixNewLineAfterImport(context, previousImport) });

        }
      } else if (emptyLinesBetween > 0 &&
      newlinesBetweenImports !== 'always-and-inside-groups') {
        if (distinctGroup && currentImport.rank === previousImport.rank || !distinctGroup && !isStartOfDistinctGroup) {
          context.report({
            node: previousImport.node,
            message: 'There should be no empty line within import group',
            fix: removeNewLineAfterImport(context, currentImport, previousImport) });

        }
      }
    } else if (emptyLinesBetween > 0) {
      context.report({
        node: previousImport.node,
        message: 'There should be no empty line between import groups',
        fix: removeNewLineAfterImport(context, currentImport, previousImport) });

    }

    previousImport = currentImport;
  });
}

function getAlphabetizeConfig(options) {
  var alphabetize = options.alphabetize || {};
  var order = alphabetize.order || 'ignore';
  var orderImportKind = alphabetize.orderImportKind || 'ignore';
  var caseInsensitive = alphabetize.caseInsensitive || false;

  return { order: order, orderImportKind: orderImportKind, caseInsensitive: caseInsensitive };
}

// TODO, semver-major: Change the default of "distinctGroup" from true to false
var defaultDistinctGroup = true;

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Style guide',
      description: 'Enforce a convention in module import order.',
      url: (0, _docsUrl2['default'])('order') },


    fixable: 'code',
    schema: [
    {
      type: 'object',
      properties: {
        groups: {
          type: 'array' },

        pathGroupsExcludedImportTypes: {
          type: 'array' },

        distinctGroup: {
          type: 'boolean',
          'default': defaultDistinctGroup },

        pathGroups: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              pattern: {
                type: 'string' },

              patternOptions: {
                type: 'object' },

              group: {
                type: 'string',
                'enum': types },

              position: {
                type: 'string',
                'enum': ['after', 'before'] } },


            additionalProperties: false,
            required: ['pattern', 'group'] } },


        'newlines-between': {
          'enum': [
          'ignore',
          'always',
          'always-and-inside-groups',
          'never'] },


        alphabetize: {
          type: 'object',
          properties: {
            caseInsensitive: {
              type: 'boolean',
              'default': false },

            order: {
              'enum': ['ignore', 'asc', 'desc'],
              'default': 'ignore' },

            orderImportKind: {
              'enum': ['ignore', 'asc', 'desc'],
              'default': 'ignore' } },


          additionalProperties: false },

        warnOnUnassignedImports: {
          type: 'boolean',
          'default': false } },


      additionalProperties: false }] },




  create: function () {function importOrderRule(context) {
      var options = context.options[0] || {};
      var newlinesBetweenImports = options['newlines-between'] || 'ignore';
      var pathGroupsExcludedImportTypes = new Set(options.pathGroupsExcludedImportTypes || ['builtin', 'external', 'object']);
      var alphabetize = getAlphabetizeConfig(options);
      var distinctGroup = options.distinctGroup == null ? defaultDistinctGroup : !!options.distinctGroup;
      var ranks = void 0;

      try {var _convertPathGroupsFor =
        convertPathGroupsForRanks(options.pathGroups || []),pathGroups = _convertPathGroupsFor.pathGroups,maxPosition = _convertPathGroupsFor.maxPosition;var _convertGroupsToRanks =
        convertGroupsToRanks(options.groups || defaultGroups),groups = _convertGroupsToRanks.groups,omittedTypes = _convertGroupsToRanks.omittedTypes;
        ranks = {
          groups: groups,
          omittedTypes: omittedTypes,
          pathGroups: pathGroups,
          maxPosition: maxPosition };

      } catch (error) {
        // Malformed configuration
        return {
          Program: function () {function Program(node) {
              context.report(node, error.message);
            }return Program;}() };

      }
      var importMap = new Map();

      function getBlockImports(node) {
        if (!importMap.has(node)) {
          importMap.set(node, []);
        }
        return importMap.get(node);
      }

      return {
        ImportDeclaration: function () {function handleImports(node) {
            // Ignoring unassigned imports unless warnOnUnassignedImports is set
            if (node.specifiers.length || options.warnOnUnassignedImports) {
              var name = node.source.value;
              registerNode(
              context,
              {
                node: node,
                value: name,
                displayName: name,
                type: 'import' },

              ranks,
              getBlockImports(node.parent),
              pathGroupsExcludedImportTypes);

            }
          }return handleImports;}(),
        TSImportEqualsDeclaration: function () {function handleImports(node) {
            var displayName = void 0;
            var value = void 0;
            var type = void 0;
            // skip "export import"s
            if (node.isExport) {
              return;
            }
            if (node.moduleReference.type === 'TSExternalModuleReference') {
              value = node.moduleReference.expression.value;
              displayName = value;
              type = 'import';
            } else {
              value = '';
              displayName = context.getSourceCode().getText(node.moduleReference);
              type = 'import:object';
            }
            registerNode(
            context,
            {
              node: node,
              value: value,
              displayName: displayName,
              type: type },

            ranks,
            getBlockImports(node.parent),
            pathGroupsExcludedImportTypes);

          }return handleImports;}(),
        CallExpression: function () {function handleRequires(node) {
            if (!(0, _staticRequire2['default'])(node)) {
              return;
            }
            var block = getRequireBlock(node);
            if (!block) {
              return;
            }
            var name = node.arguments[0].value;
            registerNode(
            context,
            {
              node: node,
              value: name,
              displayName: name,
              type: 'require' },

            ranks,
            getBlockImports(block),
            pathGroupsExcludedImportTypes);

          }return handleRequires;}(),
        'Program:exit': function () {function reportAndReset() {
            importMap.forEach(function (imported) {
              if (newlinesBetweenImports !== 'ignore') {
                makeNewlinesBetweenReport(context, imported, newlinesBetweenImports, distinctGroup);
              }

              if (alphabetize.order !== 'ignore') {
                mutateRanksToAlphabetize(imported, alphabetize);
              }

              makeOutOfOrderReport(context, imported);
            });

            importMap.clear();
          }return reportAndReset;}() };

    }return importOrderRule;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9vcmRlci5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0R3JvdXBzIiwicmV2ZXJzZSIsImFycmF5IiwibWFwIiwidiIsInJhbmsiLCJnZXRUb2tlbnNPckNvbW1lbnRzQWZ0ZXIiLCJzb3VyY2VDb2RlIiwibm9kZSIsImNvdW50IiwiY3VycmVudE5vZGVPclRva2VuIiwicmVzdWx0IiwiaSIsImdldFRva2VuT3JDb21tZW50QWZ0ZXIiLCJwdXNoIiwiZ2V0VG9rZW5zT3JDb21tZW50c0JlZm9yZSIsImdldFRva2VuT3JDb21tZW50QmVmb3JlIiwidGFrZVRva2Vuc0FmdGVyV2hpbGUiLCJjb25kaXRpb24iLCJ0b2tlbnMiLCJsZW5ndGgiLCJ0YWtlVG9rZW5zQmVmb3JlV2hpbGUiLCJmaW5kT3V0T2ZPcmRlciIsImltcG9ydGVkIiwibWF4U2VlblJhbmtOb2RlIiwiZmlsdGVyIiwiaW1wb3J0ZWRNb2R1bGUiLCJyZXMiLCJmaW5kUm9vdE5vZGUiLCJwYXJlbnQiLCJib2R5IiwiZmluZEVuZE9mTGluZVdpdGhDb21tZW50cyIsInRva2Vuc1RvRW5kT2ZMaW5lIiwiY29tbWVudE9uU2FtZUxpbmVBcyIsImVuZE9mVG9rZW5zIiwicmFuZ2UiLCJ0ZXh0IiwidG9rZW4iLCJ0eXBlIiwibG9jIiwic3RhcnQiLCJsaW5lIiwiZW5kIiwiZmluZFN0YXJ0T2ZMaW5lV2l0aENvbW1lbnRzIiwic3RhcnRPZlRva2VucyIsImlzUmVxdWlyZUV4cHJlc3Npb24iLCJleHByIiwiY2FsbGVlIiwibmFtZSIsImFyZ3VtZW50cyIsImlzU3VwcG9ydGVkUmVxdWlyZU1vZHVsZSIsImRlY2xhcmF0aW9ucyIsImRlY2wiLCJpc1BsYWluUmVxdWlyZSIsImlkIiwiaW5pdCIsImlzUmVxdWlyZVdpdGhNZW1iZXJFeHByZXNzaW9uIiwib2JqZWN0IiwiaXNQbGFpbkltcG9ydE1vZHVsZSIsInNwZWNpZmllcnMiLCJpc1BsYWluSW1wb3J0RXF1YWxzIiwibW9kdWxlUmVmZXJlbmNlIiwiZXhwcmVzc2lvbiIsImNhbkNyb3NzTm9kZVdoaWxlUmVvcmRlciIsImNhblJlb3JkZXJJdGVtcyIsImZpcnN0Tm9kZSIsInNlY29uZE5vZGUiLCJpbmRleE9mIiwic29ydCIsImZpcnN0SW5kZXgiLCJzZWNvbmRJbmRleCIsIm5vZGVzQmV0d2VlbiIsInNsaWNlIiwibm9kZUJldHdlZW4iLCJtYWtlSW1wb3J0RGVzY3JpcHRpb24iLCJpbXBvcnRLaW5kIiwiZml4T3V0T2ZPcmRlciIsImNvbnRleHQiLCJvcmRlciIsImdldFNvdXJjZUNvZGUiLCJmaXJzdFJvb3QiLCJmaXJzdFJvb3RTdGFydCIsImZpcnN0Um9vdEVuZCIsInNlY29uZFJvb3QiLCJzZWNvbmRSb290U3RhcnQiLCJzZWNvbmRSb290RW5kIiwiY2FuRml4IiwibmV3Q29kZSIsInN1YnN0cmluZyIsImZpcnN0SW1wb3J0IiwiZGlzcGxheU5hbWUiLCJzZWNvbmRJbXBvcnQiLCJtZXNzYWdlIiwicmVwb3J0IiwiZml4IiwiZml4ZXIiLCJyZXBsYWNlVGV4dFJhbmdlIiwicmVwb3J0T3V0T2ZPcmRlciIsIm91dE9mT3JkZXIiLCJmb3JFYWNoIiwiaW1wIiwiZm91bmQiLCJmaW5kIiwiaGFzSGlnaGVyUmFuayIsImltcG9ydGVkSXRlbSIsIm1ha2VPdXRPZk9yZGVyUmVwb3J0IiwicmV2ZXJzZWRJbXBvcnRlZCIsInJldmVyc2VkT3JkZXIiLCJjb21wYXJlU3RyaW5nIiwiYSIsImIiLCJERUFGVUxUX0lNUE9SVF9LSU5EIiwiZ2V0Tm9ybWFsaXplZFZhbHVlIiwidG9Mb3dlckNhc2UiLCJ2YWx1ZSIsIlN0cmluZyIsImdldFNvcnRlciIsImFscGhhYmV0aXplT3B0aW9ucyIsIm11bHRpcGxpZXIiLCJvcmRlckltcG9ydEtpbmQiLCJtdWx0aXBsaWVySW1wb3J0S2luZCIsImltcG9ydHNTb3J0ZXIiLCJub2RlQSIsIm5vZGVCIiwiaW1wb3J0QSIsImNhc2VJbnNlbnNpdGl2ZSIsImltcG9ydEIiLCJBIiwic3BsaXQiLCJCIiwiTWF0aCIsIm1pbiIsIm11dGF0ZVJhbmtzVG9BbHBoYWJldGl6ZSIsImdyb3VwZWRCeVJhbmtzIiwiaXRlbSIsInNvcnRlckZuIiwiZ3JvdXBSYW5rcyIsIk9iamVjdCIsImtleXMiLCJncm91cFJhbmsiLCJuZXdSYW5rIiwiYWxwaGFiZXRpemVkUmFua3MiLCJyZWR1Y2UiLCJhY2MiLCJwYXJzZUludCIsImNvbXB1dGVQYXRoUmFuayIsInJhbmtzIiwicGF0aEdyb3VwcyIsInBhdGgiLCJtYXhQb3NpdGlvbiIsImwiLCJwYXR0ZXJuIiwicGF0dGVybk9wdGlvbnMiLCJncm91cCIsInBvc2l0aW9uIiwibm9jb21tZW50IiwiY29tcHV0ZVJhbmsiLCJpbXBvcnRFbnRyeSIsImV4Y2x1ZGVkSW1wb3J0VHlwZXMiLCJpbXBUeXBlIiwib21pdHRlZFR5cGVzIiwiaGFzIiwiZ3JvdXBzIiwic3RhcnRzV2l0aCIsInJlZ2lzdGVyTm9kZSIsImdldFJlcXVpcmVCbG9jayIsIm4iLCJ0eXBlcyIsImNvbnZlcnRHcm91cHNUb1JhbmtzIiwicmFua09iamVjdCIsImluZGV4IiwiY29uY2F0IiwiZ3JvdXBJdGVtIiwiRXJyb3IiLCJKU09OIiwic3RyaW5naWZ5IiwidW5kZWZpbmVkIiwiY29udmVydFBhdGhHcm91cHNGb3JSYW5rcyIsImFmdGVyIiwiYmVmb3JlIiwidHJhbnNmb3JtZWQiLCJwYXRoR3JvdXAiLCJwb3NpdGlvblN0cmluZyIsImdyb3VwTGVuZ3RoIiwiZ3JvdXBJbmRleCIsIm1heCIsImtleSIsImdyb3VwTmV4dFBvc2l0aW9uIiwicG93IiwiY2VpbCIsImxvZzEwIiwiZml4TmV3TGluZUFmdGVySW1wb3J0IiwicHJldmlvdXNJbXBvcnQiLCJwcmV2Um9vdCIsImVuZE9mTGluZSIsImluc2VydFRleHRBZnRlclJhbmdlIiwicmVtb3ZlTmV3TGluZUFmdGVySW1wb3J0IiwiY3VycmVudEltcG9ydCIsImN1cnJSb290IiwicmFuZ2VUb1JlbW92ZSIsInRlc3QiLCJyZW1vdmVSYW5nZSIsIm1ha2VOZXdsaW5lc0JldHdlZW5SZXBvcnQiLCJuZXdsaW5lc0JldHdlZW5JbXBvcnRzIiwiZGlzdGluY3RHcm91cCIsImdldE51bWJlck9mRW1wdHlMaW5lc0JldHdlZW4iLCJsaW5lc0JldHdlZW5JbXBvcnRzIiwibGluZXMiLCJ0cmltIiwiZ2V0SXNTdGFydE9mRGlzdGluY3RHcm91cCIsImVtcHR5TGluZXNCZXR3ZWVuIiwiaXNTdGFydE9mRGlzdGluY3RHcm91cCIsImdldEFscGhhYmV0aXplQ29uZmlnIiwib3B0aW9ucyIsImFscGhhYmV0aXplIiwiZGVmYXVsdERpc3RpbmN0R3JvdXAiLCJtb2R1bGUiLCJleHBvcnRzIiwibWV0YSIsImRvY3MiLCJjYXRlZ29yeSIsImRlc2NyaXB0aW9uIiwidXJsIiwiZml4YWJsZSIsInNjaGVtYSIsInByb3BlcnRpZXMiLCJwYXRoR3JvdXBzRXhjbHVkZWRJbXBvcnRUeXBlcyIsIml0ZW1zIiwiYWRkaXRpb25hbFByb3BlcnRpZXMiLCJyZXF1aXJlZCIsIndhcm5PblVuYXNzaWduZWRJbXBvcnRzIiwiY3JlYXRlIiwiaW1wb3J0T3JkZXJSdWxlIiwiU2V0IiwiZXJyb3IiLCJQcm9ncmFtIiwiaW1wb3J0TWFwIiwiTWFwIiwiZ2V0QmxvY2tJbXBvcnRzIiwic2V0IiwiZ2V0IiwiSW1wb3J0RGVjbGFyYXRpb24iLCJoYW5kbGVJbXBvcnRzIiwic291cmNlIiwiVFNJbXBvcnRFcXVhbHNEZWNsYXJhdGlvbiIsImlzRXhwb3J0IiwiZ2V0VGV4dCIsIkNhbGxFeHByZXNzaW9uIiwiaGFuZGxlUmVxdWlyZXMiLCJibG9jayIsInJlcG9ydEFuZFJlc2V0IiwiY2xlYXIiXSwibWFwcGluZ3MiOiJBQUFBLGE7O0FBRUEsc0M7QUFDQSwrQztBQUNBLHdDOztBQUVBLGdEO0FBQ0Esc0Q7QUFDQSxxQzs7QUFFQSxJQUFNQSxnQkFBZ0IsQ0FBQyxTQUFELEVBQVksVUFBWixFQUF3QixRQUF4QixFQUFrQyxTQUFsQyxFQUE2QyxPQUE3QyxDQUF0Qjs7QUFFQTs7QUFFQSxTQUFTQyxP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SztBQWlETEsscUNBQWdCLFNBQVNDLGNBQVQsQ0FBd0JoUCxJQUF4QixFQUE4QjtBQUM1QyxnQkFBSSxDQUFDLGdDQUFnQkEsSUFBaEIsQ0FBTCxFQUE0QjtBQUMxQjtBQUNEO0FBQ0QsZ0JBQU1pUCxRQUFRcEYsZ0JBQWdCN0osSUFBaEIsQ0FBZDtBQUNBLGdCQUFJLENBQUNpUCxLQUFMLEVBQVk7QUFDVjtBQUNEO0FBQ0QsZ0JBQU16TSxPQUFPeEMsS0FBS3lDLFNBQUwsQ0FBZSxDQUFmLEVBQWtCaUUsS0FBL0I7QUFDQWtEO0FBQ0V2RixtQkFERjtBQUVFO0FBQ0VyRSx3QkFERjtBQUVFMEcscUJBQU9sRSxJQUZUO0FBR0UwQywyQkFBYTFDLElBSGY7QUFJRVYsb0JBQU0sU0FKUixFQUZGOztBQVFFNEcsaUJBUkY7QUFTRTRGLDRCQUFnQlcsS0FBaEIsQ0FURjtBQVVFdkIseUNBVkY7O0FBWUQsV0FyQkQsT0FBeUJzQixjQUF6QixJQWpESztBQXVFTCxxQ0FBZ0IsU0FBU0UsY0FBVCxHQUEwQjtBQUN4Q2Qsc0JBQVV6SSxPQUFWLENBQWtCLFVBQUM1RSxRQUFELEVBQWM7QUFDOUIsa0JBQUlvTCwyQkFBMkIsUUFBL0IsRUFBeUM7QUFDdkNELDBDQUEwQjdILE9BQTFCLEVBQW1DdEQsUUFBbkMsRUFBNkNvTCxzQkFBN0MsRUFBcUVDLGFBQXJFO0FBQ0Q7O0FBRUQsa0JBQUlVLFlBQVl4SSxLQUFaLEtBQXNCLFFBQTFCLEVBQW9DO0FBQ2xDc0QseUNBQXlCN0csUUFBekIsRUFBbUMrTCxXQUFuQztBQUNEOztBQUVEN0csbUNBQXFCNUIsT0FBckIsRUFBOEJ0RCxRQUE5QjtBQUNELGFBVkQ7O0FBWUFxTixzQkFBVWUsS0FBVjtBQUNELFdBZEQsT0FBeUJELGNBQXpCLElBdkVLLEVBQVA7O0FBdUZELEtBekhELE9BQWlCbEIsZUFBakIsSUFwRmUsRUFBakIiLCJmaWxlIjoib3JkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBtaW5pbWF0Y2ggZnJvbSAnbWluaW1hdGNoJztcbmltcG9ydCBpbmNsdWRlcyBmcm9tICdhcnJheS1pbmNsdWRlcyc7XG5pbXBvcnQgZ3JvdXBCeSBmcm9tICdvYmplY3QuZ3JvdXBieSc7XG5cbmltcG9ydCBpbXBvcnRUeXBlIGZyb20gJy4uL2NvcmUvaW1wb3J0VHlwZSc7XG5pbXBvcnQgaXNTdGF0aWNSZXF1aXJlIGZyb20gJy4uL2NvcmUvc3RhdGljUmVxdWlyZSc7XG5pbXBvcnQgZG9jc1VybCBmcm9tICcuLi9kb2NzVXJsJztcblxuY29uc3QgZGVmYXVsdEdyb3VwcyA9IFsnYnVpbHRpbicsICdleHRlcm5hbCcsICdwYXJlbnQnLCAnc2libGluZycsICdpbmRleCddO1xuXG4vLyBSRVBPUlRJTkcgQU5EIEZJWElOR1xuXG5mdW5jdGlvbiByZXZlcnNlKGFycmF5KSB7XG4gIHJldHVybiBhcnJheS5tYXAoZnVuY3Rpb24gKHYpIHtcbiAgICByZXR1cm4geyAuLi52LCByYW5rOiAtdi5yYW5rIH07XG4gIH0pLnJldmVyc2UoKTtcbn1cblxuZnVuY3Rpb24gZ2V0VG9rZW5zT3JDb21tZW50c0FmdGVyKHNvdXJjZUNvZGUsIG5vZGUsIGNvdW50KSB7XG4gIGxldCBjdXJyZW50Tm9kZU9yVG9rZW4gPSBub2RlO1xuICBjb25zdCByZXN1bHQgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgY3VycmVudE5vZGVPclRva2VuID0gc291cmNlQ29kZS5nZXRUb2tlbk9yQ29tbWVudEFmdGVyKGN1cnJlbnROb2RlT3JUb2tlbik7XG4gICAgaWYgKGN1cnJlbnROb2RlT3JUb2tlbiA9PSBudWxsKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgcmVzdWx0LnB1c2goY3VycmVudE5vZGVPclRva2VuKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBnZXRUb2tlbnNPckNvbW1lbnRzQmVmb3JlKHNvdXJjZUNvZGUsIG5vZGUsIGNvdW50KSB7XG4gIGxldCBjdXJyZW50Tm9kZU9yVG9rZW4gPSBub2RlO1xuICBjb25zdCByZXN1bHQgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgY3VycmVudE5vZGVPclRva2VuID0gc291cmNlQ29kZS5nZXRUb2tlbk9yQ29tbWVudEJlZm9yZShjdXJyZW50Tm9kZU9yVG9rZW4pO1xuICAgIGlmIChjdXJyZW50Tm9kZU9yVG9rZW4gPT0gbnVsbCkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJlc3VsdC5wdXNoKGN1cnJlbnROb2RlT3JUb2tlbik7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdC5yZXZlcnNlKCk7XG59XG5cbmZ1bmN0aW9uIHRha2VUb2tlbnNBZnRlcldoaWxlKHNvdXJjZUNvZGUsIG5vZGUsIGNvbmRpdGlvbikge1xuICBjb25zdCB0b2tlbnMgPSBnZXRUb2tlbnNPckNvbW1lbnRzQWZ0ZXIoc291cmNlQ29kZSwgbm9kZSwgMTAwKTtcbiAgY29uc3QgcmVzdWx0ID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdG9rZW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGNvbmRpdGlvbih0b2tlbnNbaV0pKSB7XG4gICAgICByZXN1bHQucHVzaCh0b2tlbnNbaV0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gdGFrZVRva2Vuc0JlZm9yZVdoaWxlKHNvdXJjZUNvZGUsIG5vZGUsIGNvbmRpdGlvbikge1xuICBjb25zdCB0b2tlbnMgPSBnZXRUb2tlbnNPckNvbW1lbnRzQmVmb3JlKHNvdXJjZUNvZGUsIG5vZGUsIDEwMCk7XG4gIGNvbnN0IHJlc3VsdCA9IFtdO1xuICBmb3IgKGxldCBpID0gdG9rZW5zLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgaWYgKGNvbmRpdGlvbih0b2tlbnNbaV0pKSB7XG4gICAgICByZXN1bHQucHVzaCh0b2tlbnNbaV0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdC5yZXZlcnNlKCk7XG59XG5cbmZ1bmN0aW9uIGZpbmRPdXRPZk9yZGVyKGltcG9ydGVkKSB7XG4gIGlmIChpbXBvcnRlZC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgbGV0IG1heFNlZW5SYW5rTm9kZSA9IGltcG9ydGVkWzBdO1xuICByZXR1cm4gaW1wb3J0ZWQuZmlsdGVyKGZ1bmN0aW9uIChpbXBvcnRlZE1vZHVsZSkge1xuICAgIGNvbnN0IHJlcyA9IGltcG9ydGVkTW9kdWxlLnJhbmsgPCBtYXhTZWVuUmFua05vZGUucmFuaztcbiAgICBpZiAobWF4U2VlblJhbmtOb2RlLnJhbmsgPCBpbXBvcnRlZE1vZHVsZS5yYW5rKSB7XG4gICAgICBtYXhTZWVuUmFua05vZGUgPSBpbXBvcnRlZE1vZHVsZTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGZpbmRSb290Tm9kZShub2RlKSB7XG4gIGxldCBwYXJlbnQgPSBub2RlO1xuICB3aGlsZSAocGFyZW50LnBhcmVudCAhPSBudWxsICYmIHBhcmVudC5wYXJlbnQuYm9keSA9PSBudWxsKSB7XG4gICAgcGFyZW50ID0gcGFyZW50LnBhcmVudDtcbiAgfVxuICByZXR1cm4gcGFyZW50O1xufVxuXG5mdW5jdGlvbiBmaW5kRW5kT2ZMaW5lV2l0aENvbW1lbnRzKHNvdXJjZUNvZGUsIG5vZGUpIHtcbiAgY29uc3QgdG9rZW5zVG9FbmRPZkxpbmUgPSB0YWtlVG9rZW5zQWZ0ZXJXaGlsZShzb3VyY2VDb2RlLCBub2RlLCBjb21tZW50T25TYW1lTGluZUFzKG5vZGUpKTtcbiAgY29uc3QgZW5kT2ZUb2tlbnMgPSB0b2tlbnNUb0VuZE9mTGluZS5sZW5ndGggPiAwXG4gICAgPyB0b2tlbnNUb0VuZE9mTGluZVt0b2tlbnNUb0VuZE9mTGluZS5sZW5ndGggLSAxXS5yYW5nZVsxXVxuICAgIDogbm9kZS5yYW5nZVsxXTtcbiAgbGV0IHJlc3VsdCA9IGVuZE9mVG9rZW5zO1xuICBmb3IgKGxldCBpID0gZW5kT2ZUb2tlbnM7IGkgPCBzb3VyY2VDb2RlLnRleHQubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc291cmNlQ29kZS50ZXh0W2ldID09PSAnXFxuJykge1xuICAgICAgcmVzdWx0ID0gaSArIDE7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgaWYgKHNvdXJjZUNvZGUudGV4dFtpXSAhPT0gJyAnICYmIHNvdXJjZUNvZGUudGV4dFtpXSAhPT0gJ1xcdCcgJiYgc291cmNlQ29kZS50ZXh0W2ldICE9PSAnXFxyJykge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJlc3VsdCA9IGkgKyAxO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGNvbW1lbnRPblNhbWVMaW5lQXMobm9kZSkge1xuICByZXR1cm4gKHRva2VuKSA9PiAodG9rZW4udHlwZSA9PT0gJ0Jsb2NrJyB8fCAgdG9rZW4udHlwZSA9PT0gJ0xpbmUnKVxuICAgICAgJiYgdG9rZW4ubG9jLnN0YXJ0LmxpbmUgPT09IHRva2VuLmxvYy5lbmQubGluZVxuICAgICAgJiYgdG9rZW4ubG9jLmVuZC5saW5lID09PSBub2RlLmxvYy5lbmQubGluZTtcbn1cblxuZnVuY3Rpb24gZmluZFN0YXJ0T2ZMaW5lV2l0aENvbW1lbnRzKHNvdXJjZUNvZGUsIG5vZGUpIHtcbiAgY29uc3QgdG9rZW5zVG9FbmRPZkxpbmUgPSB0YWtlVG9rZW5zQmVmb3JlV2hpbGUoc291cmNlQ29kZSwgbm9kZSwgY29tbWVudE9uU2FtZUxpbmVBcyhub2RlKSk7XG4gIGNvbnN0IHN0YXJ0T2ZUb2tlbnMgPSB0b2tlbnNUb0VuZE9mTGluZS5sZW5ndGggPiAwID8gdG9rZW5zVG9FbmRPZkxpbmVbMF0ucmFuZ2VbMF0gOiBub2RlLnJhbmdlWzBdO1xuICBsZXQgcmVzdWx0ID0gc3RhcnRPZlRva2VucztcbiAgZm9yIChsZXQgaSA9IHN0YXJ0T2ZUb2tlbnMgLSAxOyBpID4gMDsgaS0tKSB7XG4gICAgaWYgKHNvdXJjZUNvZGUudGV4dFtpXSAhPT0gJyAnICYmIHNvdXJjZUNvZGUudGV4dFtpXSAhPT0gJ1xcdCcpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXN1bHQgPSBpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGlzUmVxdWlyZUV4cHJlc3Npb24oZXhwcikge1xuICByZXR1cm4gZXhwciAhPSBudWxsXG4gICAgJiYgZXhwci50eXBlID09PSAnQ2FsbEV4cHJlc3Npb24nXG4gICAgJiYgZXhwci5jYWxsZWUgIT0gbnVsbFxuICAgICYmIGV4cHIuY2FsbGVlLm5hbWUgPT09ICdyZXF1aXJlJ1xuICAgICYmIGV4cHIuYXJndW1lbnRzICE9IG51bGxcbiAgICAmJiBleHByLmFyZ3VtZW50cy5sZW5ndGggPT09IDFcbiAgICAmJiBleHByLmFyZ3VtZW50c1swXS50eXBlID09PSAnTGl0ZXJhbCc7XG59XG5cbmZ1bmN0aW9uIGlzU3VwcG9ydGVkUmVxdWlyZU1vZHVsZShub2RlKSB7XG4gIGlmIChub2RlLnR5cGUgIT09ICdWYXJpYWJsZURlY2xhcmF0aW9uJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAobm9kZS5kZWNsYXJhdGlvbnMubGVuZ3RoICE9PSAxKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGNvbnN0IGRlY2wgPSBub2RlLmRlY2xhcmF0aW9uc1swXTtcbiAgY29uc3QgaXNQbGFpblJlcXVpcmUgPSBkZWNsLmlkXG4gICAgJiYgKGRlY2wuaWQudHlwZSA9PT0gJ0lkZW50aWZpZXInIHx8IGRlY2wuaWQudHlwZSA9PT0gJ09iamVjdFBhdHRlcm4nKVxuICAgICYmIGlzUmVxdWlyZUV4cHJlc3Npb24oZGVjbC5pbml0KTtcbiAgY29uc3QgaXNSZXF1aXJlV2l0aE1lbWJlckV4cHJlc3Npb24gPSBkZWNsLmlkXG4gICAgJiYgKGRlY2wuaWQudHlwZSA9PT0gJ0lkZW50aWZpZXInIHx8IGRlY2wuaWQudHlwZSA9PT0gJ09iamVjdFBhdHRlcm4nKVxuICAgICYmIGRlY2wuaW5pdCAhPSBudWxsXG4gICAgJiYgZGVjbC5pbml0LnR5cGUgPT09ICdDYWxsRXhwcmVzc2lvbidcbiAgICAmJiBkZWNsLmluaXQuY2FsbGVlICE9IG51bGxcbiAgICAmJiBkZWNsLmluaXQuY2FsbGVlLnR5cGUgPT09ICdNZW1iZXJFeHByZXNzaW9uJ1xuICAgICYmIGlzUmVxdWlyZUV4cHJlc3Npb24oZGVjbC5pbml0LmNhbGxlZS5vYmplY3QpO1xuICByZXR1cm4gaXNQbGFpblJlcXVpcmUgfHwgaXNSZXF1aXJlV2l0aE1lbWJlckV4cHJlc3Npb247XG59XG5cbmZ1bmN0aW9uIGlzUGxhaW5JbXBvcnRNb2R1bGUobm9kZSkge1xuICByZXR1cm4gbm9kZS50eXBlID09PSAnSW1wb3J0RGVjbGFyYXRpb24nICYmIG5vZGUuc3BlY2lmaWVycyAhPSBudWxsICYmIG5vZGUuc3BlY2lmaWVycy5sZW5ndGggPiAwO1xufVxuXG5mdW5jdGlvbiBpc1BsYWluSW1wb3J0RXF1YWxzKG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUudHlwZSA9PT0gJ1RTSW1wb3J0RXF1YWxzRGVjbGFyYXRpb24nICYmIG5vZGUubW9kdWxlUmVmZXJlbmNlLmV4cHJlc3Npb247XG59XG5cbmZ1bmN0aW9uIGNhbkNyb3NzTm9kZVdoaWxlUmVvcmRlcihub2RlKSB7XG4gIHJldHVybiBpc1N1cHBvcnRlZFJlcXVpcmVNb2R1bGUobm9kZSkgfHwgaXNQbGFpbkltcG9ydE1vZHVsZShub2RlKSB8fCBpc1BsYWluSW1wb3J0RXF1YWxzKG5vZGUpO1xufVxuXG5mdW5jdGlvbiBjYW5SZW9yZGVySXRlbXMoZmlyc3ROb2RlLCBzZWNvbmROb2RlKSB7XG4gIGNvbnN0IHBhcmVudCA9IGZpcnN0Tm9kZS5wYXJlbnQ7XG4gIGNvbnN0IFtmaXJzdEluZGV4LCBzZWNvbmRJbmRleF0gPSBbXG4gICAgcGFyZW50LmJvZHkuaW5kZXhPZihmaXJzdE5vZGUpLFxuICAgIHBhcmVudC5ib2R5LmluZGV4T2Yoc2Vjb25kTm9kZSksXG4gIF0uc29ydCgpO1xuICBjb25zdCBub2Rlc0JldHdlZW4gPSBwYXJlbnQuYm9keS5zbGljZShmaXJzdEluZGV4LCBzZWNvbmRJbmRleCArIDEpO1xuICBmb3IgKGNvbnN0IG5vZGVCZXR3ZWVuIG9mIG5vZGVzQmV0d2Vlbikge1xuICAgIGlmICghY2FuQ3Jvc3NOb2RlV2hpbGVSZW9yZGVyKG5vZGVCZXR3ZWVuKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gbWFrZUltcG9ydERlc2NyaXB0aW9uKG5vZGUpIHtcbiAgaWYgKG5vZGUubm9kZS5pbXBvcnRLaW5kID09PSAndHlwZScpIHtcbiAgICByZXR1cm4gJ3R5cGUgaW1wb3J0JztcbiAgfVxuICBpZiAobm9kZS5ub2RlLmltcG9ydEtpbmQgPT09ICd0eXBlb2YnKSB7XG4gICAgcmV0dXJuICd0eXBlb2YgaW1wb3J0JztcbiAgfVxuICByZXR1cm4gJ2ltcG9ydCc7XG59XG5cbmZ1bmN0aW9uIGZpeE91dE9mT3JkZXIoY29udGV4dCwgZmlyc3ROb2RlLCBzZWNvbmROb2RlLCBvcmRlcikge1xuICBjb25zdCBzb3VyY2VDb2RlID0gY29udGV4dC5nZXRTb3VyY2VDb2RlKCk7XG5cbiAgY29uc3QgZmlyc3RSb290ID0gZmluZFJvb3ROb2RlKGZpcnN0Tm9kZS5ub2RlKTtcbiAgY29uc3QgZmlyc3RSb290U3RhcnQgPSBmaW5kU3RhcnRPZkxpbmVXaXRoQ29tbWVudHMoc291cmNlQ29kZSwgZmlyc3RSb290KTtcbiAgY29uc3QgZmlyc3RSb290RW5kID0gZmluZEVuZE9mTGluZVdpdGhDb21tZW50cyhzb3VyY2VDb2RlLCBmaXJzdFJvb3QpO1xuXG4gIGNvbnN0IHNlY29uZFJvb3QgPSBmaW5kUm9vdE5vZGUoc2Vjb25kTm9kZS5ub2RlKTtcbiAgY29uc3Qgc2Vjb25kUm9vdFN0YXJ0ID0gZmluZFN0YXJ0T2ZMaW5lV2l0aENvbW1lbnRzKHNvdXJjZUNvZGUsIHNlY29uZFJvb3QpO1xuICBjb25zdCBzZWNvbmRSb290RW5kID0gZmluZEVuZE9mTGluZVdpdGhDb21tZW50cyhzb3VyY2VDb2RlLCBzZWNvbmRSb290KTtcbiAgY29uc3QgY2FuRml4ID0gY2FuUmVvcmRlckl0ZW1zKGZpcnN0Um9vdCwgc2Vjb25kUm9vdCk7XG5cbiAgbGV0IG5ld0NvZGUgPSBzb3VyY2VDb2RlLnRleHQuc3Vic3RyaW5nKHNlY29uZFJvb3RTdGFydCwgc2Vjb25kUm9vdEVuZCk7XG4gIGlmIChuZXdDb2RlW25ld0NvZGUubGVuZ3RoIC0gMV0gIT09ICdcXG4nKSB7XG4gICAgbmV3Q29kZSA9IGAke25ld0NvZGV9XFxuYDtcbiAgfVxuXG4gIGNvbnN0IGZpcnN0SW1wb3J0ID0gYCR7bWFrZUltcG9ydERlc2NyaXB0aW9uKGZpcnN0Tm9kZSl9IG9mIFxcYCR7Zmlyc3ROb2RlLmRpc3BsYXlOYW1lfVxcYGA7XG4gIGNvbnN0IHNlY29uZEltcG9ydCA9IGBcXGAke3NlY29uZE5vZGUuZGlzcGxheU5hbWV9XFxgICR7bWFrZUltcG9ydERlc2NyaXB0aW9uKHNlY29uZE5vZGUpfWA7XG4gIGNvbnN0IG1lc3NhZ2UgPSBgJHtzZWNvbmRJbXBvcnR9IHNob3VsZCBvY2N1ciAke29yZGVyfSAke2ZpcnN0SW1wb3J0fWA7XG5cbiAgaWYgKG9yZGVyID09PSAnYmVmb3JlJykge1xuICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgIG5vZGU6IHNlY29uZE5vZGUubm9kZSxcbiAgICAgIG1lc3NhZ2UsXG4gICAgICBmaXg6IGNhbkZpeCAmJiAoKGZpeGVyKSA9PiBmaXhlci5yZXBsYWNlVGV4dFJhbmdlKFxuICAgICAgICBbZmlyc3RSb290U3RhcnQsIHNlY29uZFJvb3RFbmRdLFxuICAgICAgICBuZXdDb2RlICsgc291cmNlQ29kZS50ZXh0LnN1YnN0cmluZyhmaXJzdFJvb3RTdGFydCwgc2Vjb25kUm9vdFN0YXJ0KSxcbiAgICAgICkpLFxuICAgIH0pO1xuICB9IGVsc2UgaWYgKG9yZGVyID09PSAnYWZ0ZXInKSB7XG4gICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgbm9kZTogc2Vjb25kTm9kZS5ub2RlLFxuICAgICAgbWVzc2FnZSxcbiAgICAgIGZpeDogY2FuRml4ICYmICgoZml4ZXIpID0+IGZpeGVyLnJlcGxhY2VUZXh0UmFuZ2UoXG4gICAgICAgIFtzZWNvbmRSb290U3RhcnQsIGZpcnN0Um9vdEVuZF0sXG4gICAgICAgIHNvdXJjZUNvZGUudGV4dC5zdWJzdHJpbmcoc2Vjb25kUm9vdEVuZCwgZmlyc3RSb290RW5kKSArIG5ld0NvZGUsXG4gICAgICApKSxcbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZXBvcnRPdXRPZk9yZGVyKGNvbnRleHQsIGltcG9ydGVkLCBvdXRPZk9yZGVyLCBvcmRlcikge1xuICBvdXRPZk9yZGVyLmZvckVhY2goZnVuY3Rpb24gKGltcCkge1xuICAgIGNvbnN0IGZvdW5kID0gaW1wb3J0ZWQuZmluZChmdW5jdGlvbiBoYXNIaWdoZXJSYW5rKGltcG9ydGVkSXRlbSkge1xuICAgICAgcmV0dXJuIGltcG9ydGVkSXRlbS5yYW5rID4gaW1wLnJhbms7XG4gICAgfSk7XG4gICAgZml4T3V0T2ZPcmRlcihjb250ZXh0LCBmb3VuZCwgaW1wLCBvcmRlcik7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBtYWtlT3V0T2ZPcmRlclJlcG9ydChjb250ZXh0LCBpbXBvcnRlZCkge1xuICBjb25zdCBvdXRPZk9yZGVyID0gZmluZE91dE9mT3JkZXIoaW1wb3J0ZWQpO1xuICBpZiAoIW91dE9mT3JkZXIubGVuZ3RoKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gVGhlcmUgYXJlIHRoaW5ncyB0byByZXBvcnQuIFRyeSB0byBtaW5pbWl6ZSB0aGUgbnVtYmVyIG9mIHJlcG9ydGVkIGVycm9ycy5cbiAgY29uc3QgcmV2ZXJzZWRJbXBvcnRlZCA9IHJldmVyc2UoaW1wb3J0ZWQpO1xuICBjb25zdCByZXZlcnNlZE9yZGVyID0gZmluZE91dE9mT3JkZXIocmV2ZXJzZWRJbXBvcnRlZCk7XG4gIGlmIChyZXZlcnNlZE9yZGVyLmxlbmd0aCA8IG91dE9mT3JkZXIubGVuZ3RoKSB7XG4gICAgcmVwb3J0T3V0T2ZPcmRlcihjb250ZXh0LCByZXZlcnNlZEltcG9ydGVkLCByZXZlcnNlZE9yZGVyLCAnYWZ0ZXInKTtcbiAgICByZXR1cm47XG4gIH1cbiAgcmVwb3J0T3V0T2ZPcmRlcihjb250ZXh0LCBpbXBvcnRlZCwgb3V0T2ZPcmRlciwgJ2JlZm9yZScpO1xufVxuXG5jb25zdCBjb21wYXJlU3RyaW5nID0gKGEsIGIpID0+IHtcbiAgaWYgKGEgPCBiKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG4gIGlmIChhID4gYikge1xuICAgIHJldHVybiAxO1xuICB9XG4gIHJldHVybiAwO1xufTtcblxuLyoqIFNvbWUgcGFyc2VycyAobGFuZ3VhZ2VzIHdpdGhvdXQgdHlwZXMpIGRvbid0IHByb3ZpZGUgSW1wb3J0S2luZCAqL1xuY29uc3QgREVBRlVMVF9JTVBPUlRfS0lORCA9ICd2YWx1ZSc7XG5jb25zdCBnZXROb3JtYWxpemVkVmFsdWUgPSAobm9kZSwgdG9Mb3dlckNhc2UpID0+IHtcbiAgY29uc3QgdmFsdWUgPSBub2RlLnZhbHVlO1xuICByZXR1cm4gdG9Mb3dlckNhc2UgPyBTdHJpbmcodmFsdWUpLnRvTG93ZXJDYXNlKCkgOiB2YWx1ZTtcbn07XG5cbmZ1bmN0aW9uIGdldFNvcnRlcihhbHBoYWJldGl6ZU9wdGlvbnMpIHtcbiAgY29uc3QgbXVsdGlwbGllciA9IGFscGhhYmV0aXplT3B0aW9ucy5vcmRlciA9PT0gJ2FzYycgPyAxIDogLTE7XG4gIGNvbnN0IG9yZGVySW1wb3J0S2luZCA9IGFscGhhYmV0aXplT3B0aW9ucy5vcmRlckltcG9ydEtpbmQ7XG4gIGNvbnN0IG11bHRpcGxpZXJJbXBvcnRLaW5kID0gb3JkZXJJbXBvcnRLaW5kICE9PSAnaWdub3JlJ1xuICAgICYmIChhbHBoYWJldGl6ZU9wdGlvbnMub3JkZXJJbXBvcnRLaW5kID09PSAnYXNjJyA/IDEgOiAtMSk7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIGltcG9ydHNTb3J0ZXIobm9kZUEsIG5vZGVCKSB7XG4gICAgY29uc3QgaW1wb3J0QSA9IGdldE5vcm1hbGl6ZWRWYWx1ZShub2RlQSwgYWxwaGFiZXRpemVPcHRpb25zLmNhc2VJbnNlbnNpdGl2ZSk7XG4gICAgY29uc3QgaW1wb3J0QiA9IGdldE5vcm1hbGl6ZWRWYWx1ZShub2RlQiwgYWxwaGFiZXRpemVPcHRpb25zLmNhc2VJbnNlbnNpdGl2ZSk7XG4gICAgbGV0IHJlc3VsdCA9IDA7XG5cbiAgICBpZiAoIWluY2x1ZGVzKGltcG9ydEEsICcvJykgJiYgIWluY2x1ZGVzKGltcG9ydEIsICcvJykpIHtcbiAgICAgIHJlc3VsdCA9IGNvbXBhcmVTdHJpbmcoaW1wb3J0QSwgaW1wb3J0Qik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IEEgPSBpbXBvcnRBLnNwbGl0KCcvJyk7XG4gICAgICBjb25zdCBCID0gaW1wb3J0Qi5zcGxpdCgnLycpO1xuICAgICAgY29uc3QgYSA9IEEubGVuZ3RoO1xuICAgICAgY29uc3QgYiA9IEIubGVuZ3RoO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IE1hdGgubWluKGEsIGIpOyBpKyspIHtcbiAgICAgICAgcmVzdWx0ID0gY29tcGFyZVN0cmluZyhBW2ldLCBCW2ldKTtcbiAgICAgICAgaWYgKHJlc3VsdCkgeyBicmVhazsgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIXJlc3VsdCAmJiBhICE9PSBiKSB7XG4gICAgICAgIHJlc3VsdCA9IGEgPCBiID8gLTEgOiAxO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJlc3VsdCA9IHJlc3VsdCAqIG11bHRpcGxpZXI7XG5cbiAgICAvLyBJbiBjYXNlIHRoZSBwYXRocyBhcmUgZXF1YWwgKHJlc3VsdCA9PT0gMCksIHNvcnQgdGhlbSBieSBpbXBvcnRLaW5kXG4gICAgaWYgKCFyZXN1bHQgJiYgbXVsdGlwbGllckltcG9ydEtpbmQpIHtcbiAgICAgIHJlc3VsdCA9IG11bHRpcGxpZXJJbXBvcnRLaW5kICogY29tcGFyZVN0cmluZyhcbiAgICAgICAgbm9kZUEubm9kZS5pbXBvcnRLaW5kIHx8IERFQUZVTFRfSU1QT1JUX0tJTkQsXG4gICAgICAgIG5vZGVCLm5vZGUuaW1wb3J0S2luZCB8fCBERUFGVUxUX0lNUE9SVF9LSU5ELFxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG5mdW5jdGlvbiBtdXRhdGVSYW5rc1RvQWxwaGFiZXRpemUoaW1wb3J0ZWQsIGFscGhhYmV0aXplT3B0aW9ucykge1xuICBjb25zdCBncm91cGVkQnlSYW5rcyA9IGdyb3VwQnkoaW1wb3J0ZWQsIChpdGVtKSA9PiBpdGVtLnJhbmspO1xuXG4gIGNvbnN0IHNvcnRlckZuID0gZ2V0U29ydGVyKGFscGhhYmV0aXplT3B0aW9ucyk7XG5cbiAgLy8gc29ydCBncm91cCBrZXlzIHNvIHRoYXQgdGhleSBjYW4gYmUgaXRlcmF0ZWQgb24gaW4gb3JkZXJcbiAgY29uc3QgZ3JvdXBSYW5rcyA9IE9iamVjdC5rZXlzKGdyb3VwZWRCeVJhbmtzKS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgcmV0dXJuIGEgLSBiO1xuICB9KTtcblxuICAvLyBzb3J0IGltcG9ydHMgbG9jYWxseSB3aXRoaW4gdGhlaXIgZ3JvdXBcbiAgZ3JvdXBSYW5rcy5mb3JFYWNoKGZ1bmN0aW9uIChncm91cFJhbmspIHtcbiAgICBncm91cGVkQnlSYW5rc1tncm91cFJhbmtdLnNvcnQoc29ydGVyRm4pO1xuICB9KTtcblxuICAvLyBhc3NpZ24gZ2xvYmFsbHkgdW5pcXVlIHJhbmsgdG8gZWFjaCBpbXBvcnRcbiAgbGV0IG5ld1JhbmsgPSAwO1xuICBjb25zdCBhbHBoYWJldGl6ZWRSYW5rcyA9IGdyb3VwUmFua3MucmVkdWNlKGZ1bmN0aW9uIChhY2MsIGdyb3VwUmFuaykge1xuICAgIGdyb3VwZWRCeVJhbmtzW2dyb3VwUmFua10uZm9yRWFjaChmdW5jdGlvbiAoaW1wb3J0ZWRJdGVtKSB7XG4gICAgICBhY2NbYCR7aW1wb3J0ZWRJdGVtLnZhbHVlfXwke2ltcG9ydGVkSXRlbS5ub2RlLmltcG9ydEtpbmR9YF0gPSBwYXJzZUludChncm91cFJhbmssIDEwKSArIG5ld1Jhbms7XG4gICAgICBuZXdSYW5rICs9IDE7XG4gICAgfSk7XG4gICAgcmV0dXJuIGFjYztcbiAgfSwge30pO1xuXG4gIC8vIG11dGF0ZSB0aGUgb3JpZ2luYWwgZ3JvdXAtcmFuayB3aXRoIGFscGhhYmV0aXplZC1yYW5rXG4gIGltcG9ydGVkLmZvckVhY2goZnVuY3Rpb24gKGltcG9ydGVkSXRlbSkge1xuICAgIGltcG9ydGVkSXRlbS5yYW5rID0gYWxwaGFiZXRpemVkUmFua3NbYCR7aW1wb3J0ZWRJdGVtLnZhbHVlfXwke2ltcG9ydGVkSXRlbS5ub2RlLmltcG9ydEtpbmR9YF07XG4gIH0pO1xufVxuXG4vLyBERVRFQ1RJTkdcblxuZnVuY3Rpb24gY29tcHV0ZVBhdGhSYW5rKHJhbmtzLCBwYXRoR3JvdXBzLCBwYXRoLCBtYXhQb3NpdGlvbikge1xuICBmb3IgKGxldCBpID0gMCwgbCA9IHBhdGhHcm91cHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgY29uc3QgeyBwYXR0ZXJuLCBwYXR0ZXJuT3B0aW9ucywgZ3JvdXAsIHBvc2l0aW9uID0gMSB9ID0gcGF0aEdyb3Vwc1tpXTtcbiAgICBpZiAobWluaW1hdGNoKHBhdGgsIHBhdHRlcm4sIHBhdHRlcm5PcHRpb25zIHx8IHsgbm9jb21tZW50OiB0cnVlIH0pKSB7XG4gICAgICByZXR1cm4gcmFua3NbZ3JvdXBdICsgcG9zaXRpb24gLyBtYXhQb3NpdGlvbjtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gY29tcHV0ZVJhbmsoY29udGV4dCwgcmFua3MsIGltcG9ydEVudHJ5LCBleGNsdWRlZEltcG9ydFR5cGVzKSB7XG4gIGxldCBpbXBUeXBlO1xuICBsZXQgcmFuaztcbiAgaWYgKGltcG9ydEVudHJ5LnR5cGUgPT09ICdpbXBvcnQ6b2JqZWN0Jykge1xuICAgIGltcFR5cGUgPSAnb2JqZWN0JztcbiAgfSBlbHNlIGlmIChpbXBvcnRFbnRyeS5ub2RlLmltcG9ydEtpbmQgPT09ICd0eXBlJyAmJiByYW5rcy5vbWl0dGVkVHlwZXMuaW5kZXhPZigndHlwZScpID09PSAtMSkge1xuICAgIGltcFR5cGUgPSAndHlwZSc7XG4gIH0gZWxzZSB7XG4gICAgaW1wVHlwZSA9IGltcG9ydFR5cGUoaW1wb3J0RW50cnkudmFsdWUsIGNvbnRleHQpO1xuICB9XG4gIGlmICghZXhjbHVkZWRJbXBvcnRUeXBlcy5oYXMoaW1wVHlwZSkpIHtcbiAgICByYW5rID0gY29tcHV0ZVBhdGhSYW5rKHJhbmtzLmdyb3VwcywgcmFua3MucGF0aEdyb3VwcywgaW1wb3J0RW50cnkudmFsdWUsIHJhbmtzLm1heFBvc2l0aW9uKTtcbiAgfVxuICBpZiAodHlwZW9mIHJhbmsgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmFuayA9IHJhbmtzLmdyb3Vwc1tpbXBUeXBlXTtcbiAgfVxuICBpZiAoaW1wb3J0RW50cnkudHlwZSAhPT0gJ2ltcG9ydCcgJiYgIWltcG9ydEVudHJ5LnR5cGUuc3RhcnRzV2l0aCgnaW1wb3J0OicpKSB7XG4gICAgcmFuayArPSAxMDA7XG4gIH1cblxuICByZXR1cm4gcmFuaztcbn1cblxuZnVuY3Rpb24gcmVnaXN0ZXJOb2RlKGNvbnRleHQsIGltcG9ydEVudHJ5LCByYW5rcywgaW1wb3J0ZWQsIGV4Y2x1ZGVkSW1wb3J0VHlwZXMpIHtcbiAgY29uc3QgcmFuayA9IGNvbXB1dGVSYW5rKGNvbnRleHQsIHJhbmtzLCBpbXBvcnRFbnRyeSwgZXhjbHVkZWRJbXBvcnRUeXBlcyk7XG4gIGlmIChyYW5rICE9PSAtMSkge1xuICAgIGltcG9ydGVkLnB1c2goeyAuLi5pbXBvcnRFbnRyeSwgcmFuayB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRSZXF1aXJlQmxvY2sobm9kZSkge1xuICBsZXQgbiA9IG5vZGU7XG4gIC8vIEhhbmRsZSBjYXNlcyBsaWtlIGBjb25zdCBiYXogPSByZXF1aXJlKCdmb28nKS5iYXIuYmF6YFxuICAvLyBhbmQgYGNvbnN0IGZvbyA9IHJlcXVpcmUoJ2ZvbycpKClgXG4gIHdoaWxlIChcbiAgICBuLnBhcmVudC50eXBlID09PSAnTWVtYmVyRXhwcmVzc2lvbicgJiYgbi5wYXJlbnQub2JqZWN0ID09PSBuXG4gICAgfHwgbi5wYXJlbnQudHlwZSA9PT0gJ0NhbGxFeHByZXNzaW9uJyAmJiBuLnBhcmVudC5jYWxsZWUgPT09IG5cbiAgKSB7XG4gICAgbiA9IG4ucGFyZW50O1xuICB9XG4gIGlmIChcbiAgICBuLnBhcmVudC50eXBlID09PSAnVmFyaWFibGVEZWNsYXJhdG9yJ1xuICAgICYmIG4ucGFyZW50LnBhcmVudC50eXBlID09PSAnVmFyaWFibGVEZWNsYXJhdGlvbidcbiAgICAmJiBuLnBhcmVudC5wYXJlbnQucGFyZW50LnR5cGUgPT09ICdQcm9ncmFtJ1xuICApIHtcbiAgICByZXR1cm4gbi5wYXJlbnQucGFyZW50LnBhcmVudDtcbiAgfVxufVxuXG5jb25zdCB0eXBlcyA9IFsnYnVpbHRpbicsICdleHRlcm5hbCcsICdpbnRlcm5hbCcsICd1bmtub3duJywgJ3BhcmVudCcsICdzaWJsaW5nJywgJ2luZGV4JywgJ29iamVjdCcsICd0eXBlJ107XG5cbi8vIENyZWF0ZXMgYW4gb2JqZWN0IHdpdGggdHlwZS1yYW5rIHBhaXJzLlxuLy8gRXhhbXBsZTogeyBpbmRleDogMCwgc2libGluZzogMSwgcGFyZW50OiAxLCBleHRlcm5hbDogMSwgYnVpbHRpbjogMiwgaW50ZXJuYWw6IDIgfVxuLy8gV2lsbCB0aHJvdyBhbiBlcnJvciBpZiBpdCBjb250YWlucyBhIHR5cGUgdGhhdCBkb2VzIG5vdCBleGlzdCwgb3IgaGFzIGEgZHVwbGljYXRlXG5mdW5jdGlvbiBjb252ZXJ0R3JvdXBzVG9SYW5rcyhncm91cHMpIHtcbiAgY29uc3QgcmFua09iamVjdCA9IGdyb3Vwcy5yZWR1Y2UoZnVuY3Rpb24gKHJlcywgZ3JvdXAsIGluZGV4KSB7XG4gICAgW10uY29uY2F0KGdyb3VwKS5mb3JFYWNoKGZ1bmN0aW9uIChncm91cEl0ZW0pIHtcbiAgICAgIGlmICh0eXBlcy5pbmRleE9mKGdyb3VwSXRlbSkgPT09IC0xKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW5jb3JyZWN0IGNvbmZpZ3VyYXRpb24gb2YgdGhlIHJ1bGU6IFVua25vd24gdHlwZSBcXGAke0pTT04uc3RyaW5naWZ5KGdyb3VwSXRlbSl9XFxgYCk7XG4gICAgICB9XG4gICAgICBpZiAocmVzW2dyb3VwSXRlbV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEluY29ycmVjdCBjb25maWd1cmF0aW9uIG9mIHRoZSBydWxlOiBcXGAke2dyb3VwSXRlbX1cXGAgaXMgZHVwbGljYXRlZGApO1xuICAgICAgfVxuICAgICAgcmVzW2dyb3VwSXRlbV0gPSBpbmRleCAqIDI7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlcztcbiAgfSwge30pO1xuXG4gIGNvbnN0IG9taXR0ZWRUeXBlcyA9IHR5cGVzLmZpbHRlcihmdW5jdGlvbiAodHlwZSkge1xuICAgIHJldHVybiB0eXBlb2YgcmFua09iamVjdFt0eXBlXSA9PT0gJ3VuZGVmaW5lZCc7XG4gIH0pO1xuXG4gIGNvbnN0IHJhbmtzID0gb21pdHRlZFR5cGVzLnJlZHVjZShmdW5jdGlvbiAocmVzLCB0eXBlKSB7XG4gICAgcmVzW3R5cGVdID0gZ3JvdXBzLmxlbmd0aCAqIDI7XG4gICAgcmV0dXJuIHJlcztcbiAgfSwgcmFua09iamVjdCk7XG5cbiAgcmV0dXJuIHsgZ3JvdXBzOiByYW5rcywgb21pdHRlZFR5cGVzIH07XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRQYXRoR3JvdXBzRm9yUmFua3MocGF0aEdyb3Vwcykge1xuICBjb25zdCBhZnRlciA9IHt9O1xuICBjb25zdCBiZWZvcmUgPSB7fTtcblxuICBjb25zdCB0cmFuc2Zvcm1lZCA9IHBhdGhHcm91cHMubWFwKChwYXRoR3JvdXAsIGluZGV4KSA9PiB7XG4gICAgY29uc3QgeyBncm91cCwgcG9zaXRpb246IHBvc2l0aW9uU3RyaW5nIH0gPSBwYXRoR3JvdXA7XG4gICAgbGV0IHBvc2l0aW9uID0gMDtcbiAgICBpZiAocG9zaXRpb25TdHJpbmcgPT09ICdhZnRlcicpIHtcbiAgICAgIGlmICghYWZ0ZXJbZ3JvdXBdKSB7XG4gICAgICAgIGFmdGVyW2dyb3VwXSA9IDE7XG4gICAgICB9XG4gICAgICBwb3NpdGlvbiA9IGFmdGVyW2dyb3VwXSsrO1xuICAgIH0gZWxzZSBpZiAocG9zaXRpb25TdHJpbmcgPT09ICdiZWZvcmUnKSB7XG4gICAgICBpZiAoIWJlZm9yZVtncm91cF0pIHtcbiAgICAgICAgYmVmb3JlW2dyb3VwXSA9IFtdO1xuICAgICAgfVxuICAgICAgYmVmb3JlW2dyb3VwXS5wdXNoKGluZGV4KTtcbiAgICB9XG5cbiAgICByZXR1cm4geyAuLi5wYXRoR3JvdXAsIHBvc2l0aW9uIH07XG4gIH0pO1xuXG4gIGxldCBtYXhQb3NpdGlvbiA9IDE7XG5cbiAgT2JqZWN0LmtleXMoYmVmb3JlKS5mb3JFYWNoKChncm91cCkgPT4ge1xuICAgIGNvbnN0IGdyb3VwTGVuZ3RoID0gYmVmb3JlW2dyb3VwXS5sZW5ndGg7XG4gICAgYmVmb3JlW2dyb3VwXS5mb3JFYWNoKChncm91cEluZGV4LCBpbmRleCkgPT4ge1xuICAgICAgdHJhbnNmb3JtZWRbZ3JvdXBJbmRleF0ucG9zaXRpb24gPSAtMSAqIChncm91cExlbmd0aCAtIGluZGV4KTtcbiAgICB9KTtcbiAgICBtYXhQb3NpdGlvbiA9IE1hdGgubWF4KG1heFBvc2l0aW9uLCBncm91cExlbmd0aCk7XG4gIH0pO1xuXG4gIE9iamVjdC5rZXlzKGFmdGVyKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICBjb25zdCBncm91cE5leHRQb3NpdGlvbiA9IGFmdGVyW2tleV07XG4gICAgbWF4UG9zaXRpb24gPSBNYXRoLm1heChtYXhQb3NpdGlvbiwgZ3JvdXBOZXh0UG9zaXRpb24gLSAxKTtcbiAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICBwYXRoR3JvdXBzOiB0cmFuc2Zvcm1lZCxcbiAgICBtYXhQb3NpdGlvbjogbWF4UG9zaXRpb24gPiAxMCA/IE1hdGgucG93KDEwLCBNYXRoLmNlaWwoTWF0aC5sb2cxMChtYXhQb3NpdGlvbikpKSA6IDEwLFxuICB9O1xufVxuXG5mdW5jdGlvbiBmaXhOZXdMaW5lQWZ0ZXJJbXBvcnQoY29udGV4dCwgcHJldmlvdXNJbXBvcnQpIHtcbiAgY29uc3QgcHJldlJvb3QgPSBmaW5kUm9vdE5vZGUocHJldmlvdXNJbXBvcnQubm9kZSk7XG4gIGNvbnN0IHRva2Vuc1RvRW5kT2ZMaW5lID0gdGFrZVRva2Vuc0FmdGVyV2hpbGUoXG4gICAgY29udGV4dC5nZXRTb3VyY2VDb2RlKCksIHByZXZSb290LCBjb21tZW50T25TYW1lTGluZUFzKHByZXZSb290KSk7XG5cbiAgbGV0IGVuZE9mTGluZSA9IHByZXZSb290LnJhbmdlWzFdO1xuICBpZiAodG9rZW5zVG9FbmRPZkxpbmUubGVuZ3RoID4gMCkge1xuICAgIGVuZE9mTGluZSA9IHRva2Vuc1RvRW5kT2ZMaW5lW3Rva2Vuc1RvRW5kT2ZMaW5lLmxlbmd0aCAtIDFdLnJhbmdlWzFdO1xuICB9XG4gIHJldHVybiAoZml4ZXIpID0+IGZpeGVyLmluc2VydFRleHRBZnRlclJhbmdlKFtwcmV2Um9vdC5yYW5nZVswXSwgZW5kT2ZMaW5lXSwgJ1xcbicpO1xufVxuXG5mdW5jdGlvbiByZW1vdmVOZXdMaW5lQWZ0ZXJJbXBvcnQoY29udGV4dCwgY3VycmVudEltcG9ydCwgcHJldmlvdXNJbXBvcnQpIHtcbiAgY29uc3Qgc291cmNlQ29kZSA9IGNvbnRleHQuZ2V0U291cmNlQ29kZSgpO1xuICBjb25zdCBwcmV2Um9vdCA9IGZpbmRSb290Tm9kZShwcmV2aW91c0ltcG9ydC5ub2RlKTtcbiAgY29uc3QgY3VyclJvb3QgPSBmaW5kUm9vdE5vZGUoY3VycmVudEltcG9ydC5ub2RlKTtcbiAgY29uc3QgcmFuZ2VUb1JlbW92ZSA9IFtcbiAgICBmaW5kRW5kT2ZMaW5lV2l0aENvbW1lbnRzKHNvdXJjZUNvZGUsIHByZXZSb290KSxcbiAgICBmaW5kU3RhcnRPZkxpbmVXaXRoQ29tbWVudHMoc291cmNlQ29kZSwgY3VyclJvb3QpLFxuICBdO1xuICBpZiAoKC9eXFxzKiQvKS50ZXN0KHNvdXJjZUNvZGUudGV4dC5zdWJzdHJpbmcocmFuZ2VUb1JlbW92ZVswXSwgcmFuZ2VUb1JlbW92ZVsxXSkpKSB7XG4gICAgcmV0dXJuIChmaXhlcikgPT4gZml4ZXIucmVtb3ZlUmFuZ2UocmFuZ2VUb1JlbW92ZSk7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gbWFrZU5ld2xpbmVzQmV0d2VlblJlcG9ydChjb250ZXh0LCBpbXBvcnRlZCwgbmV3bGluZXNCZXR3ZWVuSW1wb3J0cywgZGlzdGluY3RHcm91cCkge1xuICBjb25zdCBnZXROdW1iZXJPZkVtcHR5TGluZXNCZXR3ZWVuID0gKGN1cnJlbnRJbXBvcnQsIHByZXZpb3VzSW1wb3J0KSA9PiB7XG4gICAgY29uc3QgbGluZXNCZXR3ZWVuSW1wb3J0cyA9IGNvbnRleHQuZ2V0U291cmNlQ29kZSgpLmxpbmVzLnNsaWNlKFxuICAgICAgcHJldmlvdXNJbXBvcnQubm9kZS5sb2MuZW5kLmxpbmUsXG4gICAgICBjdXJyZW50SW1wb3J0Lm5vZGUubG9jLnN0YXJ0LmxpbmUgLSAxLFxuICAgICk7XG5cbiAgICByZXR1cm4gbGluZXNCZXR3ZWVuSW1wb3J0cy5maWx0ZXIoKGxpbmUpID0+ICFsaW5lLnRyaW0oKS5sZW5ndGgpLmxlbmd0aDtcbiAgfTtcbiAgY29uc3QgZ2V0SXNTdGFydE9mRGlzdGluY3RHcm91cCA9IChjdXJyZW50SW1wb3J0LCBwcmV2aW91c0ltcG9ydCkgPT4gY3VycmVudEltcG9ydC5yYW5rIC0gMSA+PSBwcmV2aW91c0ltcG9ydC5yYW5rO1xuICBsZXQgcHJldmlvdXNJbXBvcnQgPSBpbXBvcnRlZFswXTtcblxuICBpbXBvcnRlZC5zbGljZSgxKS5mb3JFYWNoKGZ1bmN0aW9uIChjdXJyZW50SW1wb3J0KSB7XG4gICAgY29uc3QgZW1wdHlMaW5lc0JldHdlZW4gPSBnZXROdW1iZXJPZkVtcHR5TGluZXNCZXR3ZWVuKGN1cnJlbnRJbXBvcnQsIHByZXZpb3VzSW1wb3J0KTtcbiAgICBjb25zdCBpc1N0YXJ0T2ZEaXN0aW5jdEdyb3VwID0gZ2V0SXNTdGFydE9mRGlzdGluY3RHcm91cChjdXJyZW50SW1wb3J0LCBwcmV2aW91c0ltcG9ydCk7XG5cbiAgICBpZiAobmV3bGluZXNCZXR3ZWVuSW1wb3J0cyA9PT0gJ2Fsd2F5cydcbiAgICAgICAgfHwgbmV3bGluZXNCZXR3ZWVuSW1wb3J0cyA9PT0gJ2Fsd2F5cy1hbmQtaW5zaWRlLWdyb3VwcycpIHtcbiAgICAgIGlmIChjdXJyZW50SW1wb3J0LnJhbmsgIT09IHByZXZpb3VzSW1wb3J0LnJhbmsgJiYgZW1wdHlMaW5lc0JldHdlZW4gPT09IDApIHtcbiAgICAgICAgaWYgKGRpc3RpbmN0R3JvdXAgfHwgIWRpc3RpbmN0R3JvdXAgJiYgaXNTdGFydE9mRGlzdGluY3RHcm91cCkge1xuICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgIG5vZGU6IHByZXZpb3VzSW1wb3J0Lm5vZGUsXG4gICAgICAgICAgICBtZXNzYWdlOiAnVGhlcmUgc2hvdWxkIGJlIGF0IGxlYXN0IG9uZSBlbXB0eSBsaW5lIGJldHdlZW4gaW1wb3J0IGdyb3VwcycsXG4gICAgICAgICAgICBmaXg6IGZpeE5ld0xpbmVBZnRlckltcG9ydChjb250ZXh0LCBwcmV2aW91c0ltcG9ydCksXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoZW1wdHlMaW5lc0JldHdlZW4gPiAwXG4gICAgICAgICYmIG5ld2xpbmVzQmV0d2VlbkltcG9ydHMgIT09ICdhbHdheXMtYW5kLWluc2lkZS1ncm91cHMnKSB7XG4gICAgICAgIGlmIChkaXN0aW5jdEdyb3VwICYmIGN1cnJlbnRJbXBvcnQucmFuayA9PT0gcHJldmlvdXNJbXBvcnQucmFuayB8fCAhZGlzdGluY3RHcm91cCAmJiAhaXNTdGFydE9mRGlzdGluY3RHcm91cCkge1xuICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgIG5vZGU6IHByZXZpb3VzSW1wb3J0Lm5vZGUsXG4gICAgICAgICAgICBtZXNzYWdlOiAnVGhlcmUgc2hvdWxkIGJlIG5vIGVtcHR5IGxpbmUgd2l0aGluIGltcG9ydCBncm91cCcsXG4gICAgICAgICAgICBmaXg6IHJlbW92ZU5ld0xpbmVBZnRlckltcG9ydChjb250ZXh0LCBjdXJyZW50SW1wb3J0LCBwcmV2aW91c0ltcG9ydCksXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGVtcHR5TGluZXNCZXR3ZWVuID4gMCkge1xuICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICBub2RlOiBwcmV2aW91c0ltcG9ydC5ub2RlLFxuICAgICAgICBtZXNzYWdlOiAnVGhlcmUgc2hvdWxkIGJlIG5vIGVtcHR5IGxpbmUgYmV0d2VlbiBpbXBvcnQgZ3JvdXBzJyxcbiAgICAgICAgZml4OiByZW1vdmVOZXdMaW5lQWZ0ZXJJbXBvcnQoY29udGV4dCwgY3VycmVudEltcG9ydCwgcHJldmlvdXNJbXBvcnQpLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJldmlvdXNJbXBvcnQgPSBjdXJyZW50SW1wb3J0O1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0QWxwaGFiZXRpemVDb25maWcob3B0aW9ucykge1xuICBjb25zdCBhbHBoYWJldGl6ZSA9IG9wdGlvbnMuYWxwaGFiZXRpemUgfHwge307XG4gIGNvbnN0IG9yZGVyID0gYWxwaGFiZXRpemUub3JkZXIgfHwgJ2lnbm9yZSc7XG4gIGNvbnN0IG9yZGVySW1wb3J0S2luZCA9IGFscGhhYmV0aXplLm9yZGVySW1wb3J0S2luZCB8fCAnaWdub3JlJztcbiAgY29uc3QgY2FzZUluc2Vuc2l0aXZlID0gYWxwaGFiZXRpemUuY2FzZUluc2Vuc2l0aXZlIHx8IGZhbHNlO1xuXG4gIHJldHVybiB7IG9yZGVyLCBvcmRlckltcG9ydEtpbmQsIGNhc2VJbnNlbnNpdGl2ZSB9O1xufVxuXG4vLyBUT0RPLCBzZW12ZXItbWFqb3I6IENoYW5nZSB0aGUgZGVmYXVsdCBvZiBcImRpc3RpbmN0R3JvdXBcIiBmcm9tIHRydWUgdG8gZmFsc2VcbmNvbnN0IGRlZmF1bHREaXN0aW5jdEdyb3VwID0gdHJ1ZTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1ldGE6IHtcbiAgICB0eXBlOiAnc3VnZ2VzdGlvbicsXG4gICAgZG9jczoge1xuICAgICAgY2F0ZWdvcnk6ICdTdHlsZSBndWlkZScsXG4gICAgICBkZXNjcmlwdGlvbjogJ0VuZm9yY2UgYSBjb252ZW50aW9uIGluIG1vZHVsZSBpbXBvcnQgb3JkZXIuJyxcbiAgICAgIHVybDogZG9jc1VybCgnb3JkZXInKSxcbiAgICB9LFxuXG4gICAgZml4YWJsZTogJ2NvZGUnLFxuICAgIHNjaGVtYTogW1xuICAgICAge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIGdyb3Vwczoge1xuICAgICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHBhdGhHcm91cHNFeGNsdWRlZEltcG9ydFR5cGVzOiB7XG4gICAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGlzdGluY3RHcm91cDoge1xuICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgICAgZGVmYXVsdDogZGVmYXVsdERpc3RpbmN0R3JvdXAsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBwYXRoR3JvdXBzOiB7XG4gICAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgICBwYXR0ZXJuOiB7XG4gICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHBhdHRlcm5PcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdyb3VwOiB7XG4gICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgIGVudW06IHR5cGVzLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcG9zaXRpb246IHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgZW51bTogWydhZnRlcicsICdiZWZvcmUnXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBhZGRpdGlvbmFsUHJvcGVydGllczogZmFsc2UsXG4gICAgICAgICAgICAgIHJlcXVpcmVkOiBbJ3BhdHRlcm4nLCAnZ3JvdXAnXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnbmV3bGluZXMtYmV0d2Vlbic6IHtcbiAgICAgICAgICAgIGVudW06IFtcbiAgICAgICAgICAgICAgJ2lnbm9yZScsXG4gICAgICAgICAgICAgICdhbHdheXMnLFxuICAgICAgICAgICAgICAnYWx3YXlzLWFuZC1pbnNpZGUtZ3JvdXBzJyxcbiAgICAgICAgICAgICAgJ25ldmVyJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBhbHBoYWJldGl6ZToge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIGNhc2VJbnNlbnNpdGl2ZToge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgb3JkZXI6IHtcbiAgICAgICAgICAgICAgICBlbnVtOiBbJ2lnbm9yZScsICdhc2MnLCAnZGVzYyddLFxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6ICdpZ25vcmUnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBvcmRlckltcG9ydEtpbmQ6IHtcbiAgICAgICAgICAgICAgICBlbnVtOiBbJ2lnbm9yZScsICdhc2MnLCAnZGVzYyddLFxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6ICdpZ25vcmUnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHdhcm5PblVuYXNzaWduZWRJbXBvcnRzOiB7XG4gICAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBhZGRpdGlvbmFsUHJvcGVydGllczogZmFsc2UsXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG5cbiAgY3JlYXRlOiBmdW5jdGlvbiBpbXBvcnRPcmRlclJ1bGUoY29udGV4dCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSBjb250ZXh0Lm9wdGlvbnNbMF0gfHwge307XG4gICAgY29uc3QgbmV3bGluZXNCZXR3ZWVuSW1wb3J0cyA9IG9wdGlvbnNbJ25ld2xpbmVzLWJldHdlZW4nXSB8fCAnaWdub3JlJztcbiAgICBjb25zdCBwYXRoR3JvdXBzRXhjbHVkZWRJbXBvcnRUeXBlcyA9IG5ldyBTZXQob3B0aW9ucy5wYXRoR3JvdXBzRXhjbHVkZWRJbXBvcnRUeXBlcyB8fCBbJ2J1aWx0aW4nLCAnZXh0ZXJuYWwnLCAnb2JqZWN0J10pO1xuICAgIGNvbnN0IGFscGhhYmV0aXplID0gZ2V0QWxwaGFiZXRpemVDb25maWcob3B0aW9ucyk7XG4gICAgY29uc3QgZGlzdGluY3RHcm91cCA9IG9wdGlvbnMuZGlzdGluY3RHcm91cCA9PSBudWxsID8gZGVmYXVsdERpc3RpbmN0R3JvdXAgOiAhIW9wdGlvbnMuZGlzdGluY3RHcm91cDtcbiAgICBsZXQgcmFua3M7XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgeyBwYXRoR3JvdXBzLCBtYXhQb3NpdGlvbiB9ID0gY29udmVydFBhdGhHcm91cHNGb3JSYW5rcyhvcHRpb25zLnBhdGhHcm91cHMgfHwgW10pO1xuICAgICAgY29uc3QgeyBncm91cHMsIG9taXR0ZWRUeXBlcyB9ID0gY29udmVydEdyb3Vwc1RvUmFua3Mob3B0aW9ucy5ncm91cHMgfHwgZGVmYXVsdEdyb3Vwcyk7XG4gICAgICByYW5rcyA9IHtcbiAgICAgICAgZ3JvdXBzLFxuICAgICAgICBvbWl0dGVkVHlwZXMsXG4gICAgICAgIHBhdGhHcm91cHMsXG4gICAgICAgIG1heFBvc2l0aW9uLFxuICAgICAgfTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgLy8gTWFsZm9ybWVkIGNvbmZpZ3VyYXRpb25cbiAgICAgIHJldHVybiB7XG4gICAgICAgIFByb2dyYW0obm9kZSkge1xuICAgICAgICAgIGNvbnRleHQucmVwb3J0KG5vZGUsIGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICB9LFxuICAgICAgfTtcbiAgICB9XG4gICAgY29uc3QgaW1wb3J0TWFwID0gbmV3IE1hcCgpO1xuXG4gICAgZnVuY3Rpb24gZ2V0QmxvY2tJbXBvcnRzKG5vZGUpIHtcbiAgICAgIGlmICghaW1wb3J0TWFwLmhhcyhub2RlKSkge1xuICAgICAgICBpbXBvcnRNYXAuc2V0KG5vZGUsIFtdKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpbXBvcnRNYXAuZ2V0KG5vZGUpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBJbXBvcnREZWNsYXJhdGlvbjogZnVuY3Rpb24gaGFuZGxlSW1wb3J0cyhub2RlKSB7XG4gICAgICAgIC8vIElnbm9yaW5nIHVuYXNzaWduZWQgaW1wb3J0cyB1bmxlc3Mgd2Fybk9uVW5hc3NpZ25lZEltcG9ydHMgaXMgc2V0XG4gICAgICAgIGlmIChub2RlLnNwZWNpZmllcnMubGVuZ3RoIHx8IG9wdGlvbnMud2Fybk9uVW5hc3NpZ25lZEltcG9ydHMpIHtcbiAgICAgICAgICBjb25zdCBuYW1lID0gbm9kZS5zb3VyY2UudmFsdWU7XG4gICAgICAgICAgcmVnaXN0ZXJOb2RlKFxuICAgICAgICAgICAgY29udGV4dCxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgICAgdmFsdWU6IG5hbWUsXG4gICAgICAgICAgICAgIGRpc3BsYXlOYW1lOiBuYW1lLFxuICAgICAgICAgICAgICB0eXBlOiAnaW1wb3J0JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByYW5rcyxcbiAgICAgICAgICAgIGdldEJsb2NrSW1wb3J0cyhub2RlLnBhcmVudCksXG4gICAgICAgICAgICBwYXRoR3JvdXBzRXhjbHVkZWRJbXBvcnRUeXBlcyxcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgVFNJbXBvcnRFcXVhbHNEZWNsYXJhdGlvbjogZnVuY3Rpb24gaGFuZGxlSW1wb3J0cyhub2RlKSB7XG4gICAgICAgIGxldCBkaXNwbGF5TmFtZTtcbiAgICAgICAgbGV0IHZhbHVlO1xuICAgICAgICBsZXQgdHlwZTtcbiAgICAgICAgLy8gc2tpcCBcImV4cG9ydCBpbXBvcnRcInNcbiAgICAgICAgaWYgKG5vZGUuaXNFeHBvcnQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUubW9kdWxlUmVmZXJlbmNlLnR5cGUgPT09ICdUU0V4dGVybmFsTW9kdWxlUmVmZXJlbmNlJykge1xuICAgICAgICAgIHZhbHVlID0gbm9kZS5tb2R1bGVSZWZlcmVuY2UuZXhwcmVzc2lvbi52YWx1ZTtcbiAgICAgICAgICBkaXNwbGF5TmFtZSA9IHZhbHVlO1xuICAgICAgICAgIHR5cGUgPSAnaW1wb3J0JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWx1ZSA9ICcnO1xuICAgICAgICAgIGRpc3BsYXlOYW1lID0gY29udGV4dC5nZXRTb3VyY2VDb2RlKCkuZ2V0VGV4dChub2RlLm1vZHVsZVJlZmVyZW5jZSk7XG4gICAgICAgICAgdHlwZSA9ICdpbXBvcnQ6b2JqZWN0JztcbiAgICAgICAgfVxuICAgICAgICByZWdpc3Rlck5vZGUoXG4gICAgICAgICAgY29udGV4dCxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICBkaXNwbGF5TmFtZSxcbiAgICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgfSxcbiAgICAgICAgICByYW5rcyxcbiAgICAgICAgICBnZXRCbG9ja0ltcG9ydHMobm9kZS5wYXJlbnQpLFxuICAgICAgICAgIHBhdGhHcm91cHNFeGNsdWRlZEltcG9ydFR5cGVzLFxuICAgICAgICApO1xuICAgICAgfSxcbiAgICAgIENhbGxFeHByZXNzaW9uOiBmdW5jdGlvbiBoYW5kbGVSZXF1aXJlcyhub2RlKSB7XG4gICAgICAgIGlmICghaXNTdGF0aWNSZXF1aXJlKG5vZGUpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGJsb2NrID0gZ2V0UmVxdWlyZUJsb2NrKG5vZGUpO1xuICAgICAgICBpZiAoIWJsb2NrKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5hbWUgPSBub2RlLmFyZ3VtZW50c1swXS52YWx1ZTtcbiAgICAgICAgcmVnaXN0ZXJOb2RlKFxuICAgICAgICAgIGNvbnRleHQsXG4gICAgICAgICAge1xuICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgIHZhbHVlOiBuYW1lLFxuICAgICAgICAgICAgZGlzcGxheU5hbWU6IG5hbWUsXG4gICAgICAgICAgICB0eXBlOiAncmVxdWlyZScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICByYW5rcyxcbiAgICAgICAgICBnZXRCbG9ja0ltcG9ydHMoYmxvY2spLFxuICAgICAgICAgIHBhdGhHcm91cHNFeGNsdWRlZEltcG9ydFR5cGVzLFxuICAgICAgICApO1xuICAgICAgfSxcbiAgICAgICdQcm9ncmFtOmV4aXQnOiBmdW5jdGlvbiByZXBvcnRBbmRSZXNldCgpIHtcbiAgICAgICAgaW1wb3J0TWFwLmZvckVhY2goKGltcG9ydGVkKSA9PiB7XG4gICAgICAgICAgaWYgKG5ld2xpbmVzQmV0d2VlbkltcG9ydHMgIT09ICdpZ25vcmUnKSB7XG4gICAgICAgICAgICBtYWtlTmV3bGluZXNCZXR3ZWVuUmVwb3J0KGNvbnRleHQsIGltcG9ydGVkLCBuZXdsaW5lc0JldHdlZW5JbXBvcnRzLCBkaXN0aW5jdEdyb3VwKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoYWxwaGFiZXRpemUub3JkZXIgIT09ICdpZ25vcmUnKSB7XG4gICAgICAgICAgICBtdXRhdGVSYW5rc1RvQWxwaGFiZXRpemUoaW1wb3J0ZWQsIGFscGhhYmV0aXplKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBtYWtlT3V0T2ZPcmRlclJlcG9ydChjb250ZXh0LCBpbXBvcnRlZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGltcG9ydE1hcC5jbGVhcigpO1xuICAgICAgfSxcbiAgICB9O1xuICB9LFxufTtcbiJdfQ==