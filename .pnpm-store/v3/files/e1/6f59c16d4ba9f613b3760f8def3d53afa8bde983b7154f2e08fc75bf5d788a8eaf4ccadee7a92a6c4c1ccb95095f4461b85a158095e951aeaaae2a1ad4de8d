// src/comments.ts
import ts2 from "typescript";

// src/tokens.ts
import ts from "typescript";
function forEachToken(node, callback, sourceFile = node.getSourceFile()) {
  const queue = [];
  while (true) {
    if (ts.isTokenKind(node.kind)) {
      callback(node);
    } else if (
      // eslint-disable-next-line deprecation/deprecation -- need for support of TS < 4.7
      node.kind !== ts.SyntaxKind.JSDocComment
    ) {
      const children = node.getChildren(sourceFile);
      if (children.length === 1) {
        node = children[0];
        continue;
      }
      for (let i = children.length - 1; i >= 0; --i)
        queue.push(children[i]);
    }
    if (queue.length === 0)
      break;
    node = queue.pop();
  }
}

// src/comments.ts
function canHaveTrailingTrivia(token) {
  switch (token.kind) {
    case ts2.SyntaxKind.CloseBraceToken:
      return token.parent.kind !== ts2.SyntaxKind.JsxExpression || !isJsxElementOrFragment(token.parent.parent);
    case ts2.SyntaxKind.GreaterThanToken:
      switch (token.parent.kind) {
        case ts2.SyntaxKind.JsxOpeningElement:
          return token.end !== token.parent.end;
        case ts2.SyntaxKind.JsxOpeningFragment:
          return false;
        case ts2.SyntaxKind.JsxSelfClosingElement:
          return token.end !== token.parent.end || // if end is not equal, this is part of the type arguments list
          !isJsxElementOrFragment(token.parent.parent);
        case ts2.SyntaxKind.JsxClosingElement:
        case ts2.SyntaxKind.JsxClosingFragment:
          return !isJsxElementOrFragment(token.parent.parent.parent);
      }
  }
  return true;
}
function isJsxElementOrFragment(node) {
  return node.kind === ts2.SyntaxKind.JsxElement || node.kind === ts2.SyntaxKind.JsxFragment;
}
function forEachComment(node, callback, sourceFile = node.getSourceFile()) {
  const fullText = sourceFile.text;
  const notJsx = sourceFile.languageVariant !== ts2.LanguageVariant.JSX;
  return forEachToken(
    node,
    (token) => {
      if (token.pos === token.end)
        return;
      if (token.kind !== ts2.SyntaxKind.JsxText)
        ts2.forEachLeadingCommentRange(
          fullText,
          // skip shebang at position 0
          token.pos === 0 ? (ts2.getShebang(fullText) ?? "").length : token.pos,
          commentCallback
        );
      if (notJsx || canHaveTrailingTrivia(token))
        return ts2.forEachTrailingCommentRange(
          fullText,
          token.end,
          commentCallback
        );
    },
    sourceFile
  );
  function commentCallback(pos, end, kind) {
    callback(fullText, { pos, end, kind });
  }
}

// src/compilerOptions.ts
import ts3 from "typescript";
function isCompilerOptionEnabled(options, option) {
  switch (option) {
    case "stripInternal":
    case "declarationMap":
    case "emitDeclarationOnly":
      return options[option] === true && isCompilerOptionEnabled(options, "declaration");
    case "declaration":
      return options.declaration || isCompilerOptionEnabled(options, "composite");
    case "incremental":
      return options.incremental === void 0 ? isCompilerOptionEnabled(options, "composite") : options.incremental;
    case "skipDefaultLibCheck":
      return options.skipDefaultLibCheck || isCompilerOptionEnabled(options, "skipLibCheck");
    case "suppressImplicitAnyIndexErrors":
      return options.suppressImplicitAnyIndexErrors === true && isCompilerOptionEnabled(options, "noImplicitAny");
    case "allowSyntheticDefaultImports":
      return options.allowSyntheticDefaultImports !== void 0 ? options.allowSyntheticDefaultImports : isCompilerOptionEnabled(options, "esModuleInterop") || options.module === ts3.ModuleKind.System;
    case "noUncheckedIndexedAccess":
      return options.noUncheckedIndexedAccess === true && isCompilerOptionEnabled(options, "strictNullChecks");
    case "allowJs":
      return options.allowJs === void 0 ? isCompilerOptionEnabled(options, "checkJs") : options.allowJs;
    case "noImplicitAny":
    case "noImplicitThis":
    case "strictNullChecks":
    case "strictFunctionTypes":
    case "strictPropertyInitialization":
    case "alwaysStrict":
    case "strictBindCallApply":
      return isStrictCompilerOptionEnabled(
        options,
        option
      );
  }
  return options[option] === true;
}
function isStrictCompilerOptionEnabled(options, option) {
  return (options.strict ? options[option] !== false : options[option] === true) && (option !== "strictPropertyInitialization" || isStrictCompilerOptionEnabled(options, "strictNullChecks"));
}

// src/flags.ts
import ts4 from "typescript";
function isFlagSet(allFlags, flag) {
  return (allFlags & flag) !== 0;
}
function isFlagSetOnObject(obj, flag) {
  return isFlagSet(obj.flags, flag);
}
function isModifierFlagSet(node, flag) {
  return isFlagSet(ts4.getCombinedModifierFlags(node), flag);
}
var isNodeFlagSet = isFlagSetOnObject;
function isObjectFlagSet(objectType, flag) {
  return isFlagSet(objectType.objectFlags, flag);
}
var isSymbolFlagSet = isFlagSetOnObject;
var isTypeFlagSet = isFlagSetOnObject;

// src/modifiers.ts
function includesModifier(modifiers, ...kinds) {
  if (modifiers === void 0)
    return false;
  for (const modifier of modifiers)
    if (kinds.includes(modifier.kind))
      return true;
  return false;
}

// src/nodes/typeGuards/compound.ts
import ts8 from "typescript";

// src/nodes/typeGuards/single.ts
import ts5 from "typescript";
function isAbstractKeyword(node) {
  return node.kind === ts5.SyntaxKind.AbstractKeyword;
}
function isAccessorKeyword(node) {
  return node.kind === ts5.SyntaxKind.AccessorKeyword;
}
function isAnyKeyword(node) {
  return node.kind === ts5.SyntaxKind.AnyKeyword;
}
function isAssertKeyword(node) {
  return node.kind === ts5.SyntaxKind.AssertKeyword;
}
function isAssertsKeyword(node) {
  return node.kind === ts5.SyntaxKind.AssertsKeyword;
}
function isAsyncKeyword(node) {
  return node.kind === ts5.SyntaxKind.AsyncKeyword;
}
function isAwaitKeyword(node) {
  return node.kind === ts5.SyntaxKind.AwaitKeyword;
}
function isBigIntKeyword(node) {
  return node.kind === ts5.SyntaxKind.BigIntKeyword;
}
function isBooleanKeyword(node) {
  return node.kind === ts5.SyntaxKind.BooleanKeyword;
}
function isColonToken(node) {
  return node.kind === ts5.SyntaxKind.ColonToken;
}
function isConstKeyword(node) {
  return node.kind === ts5.SyntaxKind.ConstKeyword;
}
function isDeclareKeyword(node) {
  return node.kind === ts5.SyntaxKind.DeclareKeyword;
}
function isDefaultKeyword(node) {
  return node.kind === ts5.SyntaxKind.DefaultKeyword;
}
function isDotToken(node) {
  return node.kind === ts5.SyntaxKind.DotToken;
}
function isEndOfFileToken(node) {
  return node.kind === ts5.SyntaxKind.EndOfFileToken;
}
function isEqualsGreaterThanToken(node) {
  return node.kind === ts5.SyntaxKind.EqualsGreaterThanToken;
}
function isEqualsToken(node) {
  return node.kind === ts5.SyntaxKind.EqualsToken;
}
function isExclamationToken(node) {
  return node.kind === ts5.SyntaxKind.ExclamationToken;
}
function isExportKeyword(node) {
  return node.kind === ts5.SyntaxKind.ExportKeyword;
}
function isFalseKeyword(node) {
  return node.kind === ts5.SyntaxKind.FalseKeyword;
}
function isFalseLiteral(node) {
  return node.kind === ts5.SyntaxKind.FalseKeyword;
}
function isImportExpression(node) {
  return node.kind === ts5.SyntaxKind.ImportKeyword;
}
function isImportKeyword(node) {
  return node.kind === ts5.SyntaxKind.ImportKeyword;
}
function isInKeyword(node) {
  return node.kind === ts5.SyntaxKind.InKeyword;
}
function isInputFiles(node) {
  return node.kind === ts5.SyntaxKind.InputFiles;
}
function isJSDocText(node) {
  return node.kind === ts5.SyntaxKind.JSDocText;
}
function isJsonMinusNumericLiteral(node) {
  return node.kind === ts5.SyntaxKind.PrefixUnaryExpression;
}
function isNeverKeyword(node) {
  return node.kind === ts5.SyntaxKind.NeverKeyword;
}
function isNullKeyword(node) {
  return node.kind === ts5.SyntaxKind.NullKeyword;
}
function isNullLiteral(node) {
  return node.kind === ts5.SyntaxKind.NullKeyword;
}
function isNumberKeyword(node) {
  return node.kind === ts5.SyntaxKind.NumberKeyword;
}
function isObjectKeyword(node) {
  return node.kind === ts5.SyntaxKind.ObjectKeyword;
}
function isOutKeyword(node) {
  return node.kind === ts5.SyntaxKind.OutKeyword;
}
function isOverrideKeyword(node) {
  return node.kind === ts5.SyntaxKind.OverrideKeyword;
}
function isPrivateKeyword(node) {
  return node.kind === ts5.SyntaxKind.PrivateKeyword;
}
function isProtectedKeyword(node) {
  return node.kind === ts5.SyntaxKind.ProtectedKeyword;
}
function isPublicKeyword(node) {
  return node.kind === ts5.SyntaxKind.PublicKeyword;
}
function isQuestionDotToken(node) {
  return node.kind === ts5.SyntaxKind.QuestionDotToken;
}
function isQuestionToken(node) {
  return node.kind === ts5.SyntaxKind.QuestionToken;
}
function isReadonlyKeyword(node) {
  return node.kind === ts5.SyntaxKind.ReadonlyKeyword;
}
function isStaticKeyword(node) {
  return node.kind === ts5.SyntaxKind.StaticKeyword;
}
function isStringKeyword(node) {
  return node.kind === ts5.SyntaxKind.StringKeyword;
}
function isSuperExpression(node) {
  return node.kind === ts5.SyntaxKind.SuperKeyword;
}
function isSuperKeyword(node) {
  return node.kind === ts5.SyntaxKind.SuperKeyword;
}
function isSymbolKeyword(node) {
  return node.kind === ts5.SyntaxKind.SymbolKeyword;
}
function isSyntaxList(node) {
  return node.kind === ts5.SyntaxKind.SyntaxList;
}
function isThisExpression(node) {
  return node.kind === ts5.SyntaxKind.ThisKeyword;
}
function isThisKeyword(node) {
  return node.kind === ts5.SyntaxKind.ThisKeyword;
}
function isTrueKeyword(node) {
  return node.kind === ts5.SyntaxKind.TrueKeyword;
}
function isTrueLiteral(node) {
  return node.kind === ts5.SyntaxKind.TrueKeyword;
}
function isUndefinedKeyword(node) {
  return node.kind === ts5.SyntaxKind.UndefinedKeyword;
}
function isUnknownKeyword(node) {
  return node.kind === ts5.SyntaxKind.UnknownKeyword;
}
function isUnparsedPrologue(node) {
  return node.kind === ts5.SyntaxKind.UnparsedPrologue;
}
function isUnparsedSyntheticReference(node) {
  return node.kind === ts5.SyntaxKind.UnparsedSyntheticReference;
}
function isVoidKeyword(node) {
  return node.kind === ts5.SyntaxKind.VoidKeyword;
}

// src/nodes/typeGuards/union.ts
import ts7 from "typescript";

// src/utils.ts
import ts6 from "typescript";
var [tsMajor, tsMinor] = ts6.versionMajorMinor.split(".").map((raw) => Number.parseInt(raw, 10));
function isTsVersionAtLeast(major, minor = 0) {
  return tsMajor > major || tsMajor === major && tsMinor >= minor;
}

// src/nodes/typeGuards/union.ts
function isAccessExpression(node) {
  return ts7.isPropertyAccessExpression(node) || ts7.isElementAccessExpression(node);
}
function isAccessibilityModifier(node) {
  return isPublicKeyword(node) || isPrivateKeyword(node) || isProtectedKeyword(node);
}
function isAccessorDeclaration(node) {
  return ts7.isGetAccessorDeclaration(node) || ts7.isSetAccessorDeclaration(node);
}
function isArrayBindingElement(node) {
  return ts7.isBindingElement(node) || ts7.isOmittedExpression(node);
}
function isArrayBindingOrAssignmentPattern(node) {
  return ts7.isArrayBindingPattern(node) || ts7.isArrayLiteralExpression(node);
}
function isAssignmentPattern(node) {
  return ts7.isObjectLiteralExpression(node) || ts7.isArrayLiteralExpression(node);
}
function isBindingOrAssignmentElementRestIndicator(node) {
  if (ts7.isSpreadElement(node) || ts7.isSpreadAssignment(node)) {
    return true;
  }
  if (isTsVersionAtLeast(4, 4)) {
    return ts7.isDotDotDotToken(node);
  }
  return false;
}
function isBindingOrAssignmentElementTarget(node) {
  return isBindingOrAssignmentPattern(node) || ts7.isIdentifier(node) || ts7.isPropertyAccessExpression(node) || ts7.isElementAccessExpression(node) || ts7.isOmittedExpression(node);
}
function isBindingOrAssignmentPattern(node) {
  return isObjectBindingOrAssignmentPattern(node) || isArrayBindingOrAssignmentPattern(node);
}
function isBindingPattern(node) {
  return ts7.isObjectBindingPattern(node) || ts7.isArrayBindingPattern(node);
}
function isBlockLike(node) {
  return ts7.isSourceFile(node) || ts7.isBlock(node) || ts7.isModuleBlock(node) || ts7.isCaseOrDefaultClause(node);
}
function isBooleanLiteral(node) {
  return isTrueLiteral(node) || isFalseLiteral(node);
}
function isClassLikeDeclaration(node) {
  return ts7.isClassDeclaration(node) || ts7.isClassExpression(node);
}
function isClassMemberModifier(node) {
  return isAccessibilityModifier(node) || isReadonlyKeyword(node) || isStaticKeyword(node) || isAccessorKeyword(node);
}
function isDeclarationName(node) {
  return ts7.isIdentifier(node) || ts7.isPrivateIdentifier(node) || ts7.isStringLiteralLike(node) || ts7.isNumericLiteral(node) || ts7.isComputedPropertyName(node) || ts7.isElementAccessExpression(node) || isBindingPattern(node) || isEntityNameExpression(node);
}
function isDeclarationWithTypeParameterChildren(node) {
  return isSignatureDeclaration(node) || // eslint-disable-next-line deprecation/deprecation -- Keep compatibility with ts <5
  isClassLikeDeclaration(node) || ts7.isInterfaceDeclaration(node) || ts7.isTypeAliasDeclaration(node) || ts7.isJSDocTemplateTag(node);
}
function isDeclarationWithTypeParameters(node) {
  return isDeclarationWithTypeParameterChildren(node) || ts7.isJSDocTypedefTag(node) || ts7.isJSDocCallbackTag(node) || ts7.isJSDocSignature(node);
}
function isDestructuringPattern(node) {
  return isBindingPattern(node) || ts7.isObjectLiteralExpression(node) || ts7.isArrayLiteralExpression(node);
}
function isEntityNameExpression(node) {
  return ts7.isIdentifier(node) || isPropertyAccessEntityNameExpression(node);
}
function isEntityNameOrEntityNameExpression(node) {
  return ts7.isEntityName(node) || isEntityNameExpression(node);
}
function isForInOrOfStatement(node) {
  return ts7.isForInStatement(node) || ts7.isForOfStatement(node);
}
function isFunctionLikeDeclaration(node) {
  return ts7.isFunctionDeclaration(node) || ts7.isMethodDeclaration(node) || ts7.isGetAccessorDeclaration(node) || ts7.isSetAccessorDeclaration(node) || ts7.isConstructorDeclaration(node) || ts7.isFunctionExpression(node) || ts7.isArrowFunction(node);
}
function hasDecorators(node) {
  return ts7.isParameter(node) || ts7.isPropertyDeclaration(node) || ts7.isMethodDeclaration(node) || ts7.isGetAccessorDeclaration(node) || ts7.isSetAccessorDeclaration(node) || ts7.isClassExpression(node) || ts7.isClassDeclaration(node);
}
function hasExpressionInitializer(node) {
  return ts7.isVariableDeclaration(node) || ts7.isParameter(node) || ts7.isBindingElement(node) || ts7.isPropertyDeclaration(node) || ts7.isPropertyAssignment(node) || ts7.isEnumMember(node);
}
function hasInitializer(node) {
  return hasExpressionInitializer(node) || ts7.isForStatement(node) || ts7.isForInStatement(node) || ts7.isForOfStatement(node) || ts7.isJsxAttribute(node);
}
function hasJSDoc(node) {
  if (
    // eslint-disable-next-line deprecation/deprecation -- Keep compatibility with ts <5
    isAccessorDeclaration(node) || ts7.isArrowFunction(node) || ts7.isBlock(node) || ts7.isBreakStatement(node) || ts7.isCallSignatureDeclaration(node) || ts7.isCaseClause(node) || // eslint-disable-next-line deprecation/deprecation -- Keep compatibility with ts <5
    isClassLikeDeclaration(node) || ts7.isConstructorDeclaration(node) || ts7.isConstructorTypeNode(node) || ts7.isConstructSignatureDeclaration(node) || ts7.isContinueStatement(node) || ts7.isDebuggerStatement(node) || ts7.isDoStatement(node) || ts7.isEmptyStatement(node) || isEndOfFileToken(node) || ts7.isEnumDeclaration(node) || ts7.isEnumMember(node) || ts7.isExportAssignment(node) || ts7.isExportDeclaration(node) || ts7.isExportSpecifier(node) || ts7.isExpressionStatement(node) || ts7.isForInStatement(node) || ts7.isForOfStatement(node) || ts7.isForStatement(node) || ts7.isFunctionDeclaration(node) || ts7.isFunctionExpression(node) || ts7.isFunctionTypeNode(node) || ts7.isIfStatement(node) || ts7.isImportDeclaration(node) || ts7.isImportEqualsDeclaration(node) || ts7.isIndexSignatureDeclaration(node) || ts7.isInterfaceDeclaration(node) || ts7.isJSDocFunctionType(node) || ts7.isLabeledStatement(node) || ts7.isMethodDeclaration(node) || ts7.isMethodSignature(node) || ts7.isModuleDeclaration(node) || ts7.isNamedTupleMember(node) || ts7.isNamespaceExportDeclaration(node) || ts7.isParameter(node) || ts7.isParenthesizedExpression(node) || ts7.isPropertyAssignment(node) || ts7.isPropertyDeclaration(node) || ts7.isPropertySignature(node) || ts7.isReturnStatement(node) || ts7.isShorthandPropertyAssignment(node) || ts7.isSpreadAssignment(node) || ts7.isSwitchStatement(node) || ts7.isThrowStatement(node) || ts7.isTryStatement(node) || ts7.isTypeAliasDeclaration(node) || ts7.isVariableDeclaration(node) || ts7.isVariableStatement(node) || ts7.isWhileStatement(node) || ts7.isWithStatement(node)
  ) {
    return true;
  }
  if (isTsVersionAtLeast(4, 4) && ts7.isClassStaticBlockDeclaration(node)) {
    return true;
  }
  if (isTsVersionAtLeast(5, 0) && (ts7.isBinaryExpression(node) || ts7.isElementAccessExpression(node) || ts7.isIdentifier(node) || ts7.isJSDocSignature(node) || ts7.isObjectLiteralExpression(node) || ts7.isPropertyAccessExpression(node) || ts7.isTypeParameterDeclaration(node))) {
    return true;
  }
  return false;
}
function hasModifiers(node) {
  return ts7.isTypeParameterDeclaration(node) || ts7.isParameter(node) || ts7.isConstructorTypeNode(node) || ts7.isPropertySignature(node) || ts7.isPropertyDeclaration(node) || ts7.isMethodSignature(node) || ts7.isMethodDeclaration(node) || ts7.isConstructorDeclaration(node) || ts7.isGetAccessorDeclaration(node) || ts7.isSetAccessorDeclaration(node) || ts7.isIndexSignatureDeclaration(node) || ts7.isFunctionExpression(node) || ts7.isArrowFunction(node) || ts7.isClassExpression(node) || ts7.isVariableStatement(node) || ts7.isFunctionDeclaration(node) || ts7.isClassDeclaration(node) || ts7.isInterfaceDeclaration(node) || ts7.isTypeAliasDeclaration(node) || ts7.isEnumDeclaration(node) || ts7.isModuleDeclaration(node) || ts7.isImportEqualsDeclaration(node) || ts7.isImportDeclaration(node) || ts7.isExportAssignment(node) || ts7.isExportDeclaration(node);
}
function hasType(node) {
  return isSignatureDeclaration(node) || ts7.isVariableDeclaration(node) || ts7.isParameter(node) || ts7.isPropertySignature(node) || ts7.isPropertyDeclaration(node) || ts7.isTypePredicateNode(node) || ts7.isParenthesizedTypeNode(node) || ts7.isTypeOperatorNode(node) || ts7.isMappedTypeNode(node) || ts7.isAssertionExpression(node) || ts7.isTypeAliasDeclaration(node) || ts7.isJSDocTypeExpression(node) || ts7.isJSDocNonNullableType(node) || ts7.isJSDocNullableType(node) || ts7.isJSDocOptionalType(node) || ts7.isJSDocVariadicType(node);
}
function hasTypeArguments(node) {
  return ts7.isCallExpression(node) || ts7.isNewExpression(node) || ts7.isTaggedTemplateExpression(node) || ts7.isJsxOpeningElement(node) || ts7.isJsxSelfClosingElement(node);
}
function isJSDocComment(node) {
  if (isJSDocText(node)) {
    return true;
  }
  if (isTsVersionAtLeast(4, 4)) {
    return ts7.isJSDocLink(node) || ts7.isJSDocLinkCode(node) || ts7.isJSDocLinkPlain(node);
  }
  return false;
}
function isJSDocNamespaceBody(node) {
  return ts7.isIdentifier(node) || isJSDocNamespaceDeclaration(node);
}
function isJSDocTypeReferencingNode(node) {
  return ts7.isJSDocVariadicType(node) || ts7.isJSDocOptionalType(node) || ts7.isJSDocNullableType(node) || ts7.isJSDocNonNullableType(node);
}
function isJsonObjectExpression(node) {
  return ts7.isObjectLiteralExpression(node) || ts7.isArrayLiteralExpression(node) || isJsonMinusNumericLiteral(node) || ts7.isNumericLiteral(node) || ts7.isStringLiteral(node) || isBooleanLiteral(node) || isNullLiteral(node);
}
function isJsxAttributeLike(node) {
  return ts7.isJsxAttribute(node) || ts7.isJsxSpreadAttribute(node);
}
function isJsxAttributeValue(node) {
  return ts7.isStringLiteral(node) || ts7.isJsxExpression(node) || ts7.isJsxElement(node) || ts7.isJsxSelfClosingElement(node) || ts7.isJsxFragment(node);
}
function isJsxChild(node) {
  return ts7.isJsxText(node) || ts7.isJsxExpression(node) || ts7.isJsxElement(node) || ts7.isJsxSelfClosingElement(node) || ts7.isJsxFragment(node);
}
function isJsxTagNameExpression(node) {
  return ts7.isIdentifier(node) || isThisExpression(node) || isJsxTagNamePropertyAccess(node);
}
function isLiteralToken(node) {
  return ts7.isNumericLiteral(node) || ts7.isBigIntLiteral(node) || ts7.isStringLiteral(node) || ts7.isJsxText(node) || ts7.isRegularExpressionLiteral(node) || ts7.isNoSubstitutionTemplateLiteral(node);
}
function isModuleBody(node) {
  return isNamespaceBody(node) || isJSDocNamespaceBody(node);
}
function isModuleName(node) {
  return ts7.isIdentifier(node) || ts7.isStringLiteral(node);
}
function isModuleReference(node) {
  return ts7.isEntityName(node) || ts7.isExternalModuleReference(node);
}
function isNamedImportBindings(node) {
  return ts7.isNamespaceImport(node) || ts7.isNamedImports(node);
}
function isNamedImportsOrExports(node) {
  return ts7.isNamedImports(node) || ts7.isNamedExports(node);
}
function isNamespaceBody(node) {
  return ts7.isModuleBlock(node) || isNamespaceDeclaration(node);
}
function isObjectBindingOrAssignmentElement(node) {
  return ts7.isBindingElement(node) || ts7.isPropertyAssignment(node) || ts7.isShorthandPropertyAssignment(node) || ts7.isSpreadAssignment(node);
}
function isObjectBindingOrAssignmentPattern(node) {
  return ts7.isObjectBindingPattern(node) || ts7.isObjectLiteralExpression(node);
}
function isObjectTypeDeclaration(node) {
  return (
    // eslint-disable-next-line deprecation/deprecation -- Keep compatibility with ts <5
    isClassLikeDeclaration(node) || ts7.isInterfaceDeclaration(node) || ts7.isTypeLiteralNode(node)
  );
}
function isParameterPropertyModifier(node) {
  return isAccessibilityModifier(node) || isReadonlyKeyword(node);
}
function isPropertyNameLiteral(node) {
  return ts7.isIdentifier(node) || ts7.isStringLiteralLike(node) || ts7.isNumericLiteral(node);
}
function isPseudoLiteralToken(node) {
  return ts7.isTemplateHead(node) || ts7.isTemplateMiddle(node) || ts7.isTemplateTail(node);
}
function isSignatureDeclaration(node) {
  return ts7.isCallSignatureDeclaration(node) || ts7.isConstructSignatureDeclaration(node) || ts7.isMethodSignature(node) || ts7.isIndexSignatureDeclaration(node) || ts7.isFunctionTypeNode(node) || ts7.isConstructorTypeNode(node) || ts7.isJSDocFunctionType(node) || ts7.isFunctionDeclaration(node) || ts7.isMethodDeclaration(node) || ts7.isConstructorDeclaration(node) || // eslint-disable-next-line deprecation/deprecation -- Keep compatibility with ts <5
  isAccessorDeclaration(node) || ts7.isFunctionExpression(node) || ts7.isArrowFunction(node);
}
function isSuperProperty(node) {
  return isSuperPropertyAccessExpression(node) || isSuperElementAccessExpression(node);
}
function isTypeOnlyCompatibleAliasDeclaration(node) {
  if (ts7.isImportClause(node) || ts7.isImportEqualsDeclaration(node) || ts7.isNamespaceImport(node) || ts7.isImportOrExportSpecifier(node)) {
    return true;
  }
  if (isTsVersionAtLeast(5, 0) && (ts7.isExportDeclaration(node) || ts7.isNamespaceExport(node))) {
    return true;
  }
  return false;
}
function isTypeReferenceType(node) {
  return ts7.isTypeReferenceNode(node) || ts7.isExpressionWithTypeArguments(node);
}
function isUnionOrIntersectionTypeNode(node) {
  return ts7.isUnionTypeNode(node) || ts7.isIntersectionTypeNode(node);
}
function isUnparsedSourceText(node) {
  return ts7.isUnparsedPrepend(node) || ts7.isUnparsedTextLike(node);
}
function isVariableLikeDeclaration(node) {
  return ts7.isVariableDeclaration(node) || ts7.isParameter(node) || ts7.isBindingElement(node) || ts7.isPropertyDeclaration(node) || ts7.isPropertyAssignment(node) || ts7.isPropertySignature(node) || ts7.isJsxAttribute(node) || ts7.isShorthandPropertyAssignment(node) || ts7.isEnumMember(node) || ts7.isJSDocPropertyTag(node) || ts7.isJSDocParameterTag(node);
}

// src/nodes/typeGuards/compound.ts
function isConstAssertionExpression(node) {
  return ts8.isTypeReferenceNode(node.type) && ts8.isIdentifier(node.type.typeName) && node.type.typeName.escapedText === "const";
}
function isIterationStatement(node) {
  switch (node.kind) {
    case ts8.SyntaxKind.DoStatement:
    case ts8.SyntaxKind.ForInStatement:
    case ts8.SyntaxKind.ForOfStatement:
    case ts8.SyntaxKind.ForStatement:
    case ts8.SyntaxKind.WhileStatement:
      return true;
    default:
      return false;
  }
}
function isJSDocNamespaceDeclaration(node) {
  return ts8.isModuleDeclaration(node) && ts8.isIdentifier(node.name) && (node.body === void 0 || isJSDocNamespaceBody(node.body));
}
function isJsxTagNamePropertyAccess(node) {
  return ts8.isPropertyAccessExpression(node) && // eslint-disable-next-line deprecation/deprecation -- Keep compatibility with ts < 5
  isJsxTagNameExpression(node.expression);
}
function isNamedDeclarationWithName(node) {
  return "name" in node && node.name !== void 0 && node.name !== null && isDeclarationName(node.name);
}
function isNamespaceDeclaration(node) {
  return ts8.isModuleDeclaration(node) && ts8.isIdentifier(node.name) && node.body !== void 0 && isNamespaceBody(node.body);
}
function isNumericOrStringLikeLiteral(node) {
  switch (node.kind) {
    case ts8.SyntaxKind.StringLiteral:
    case ts8.SyntaxKind.NumericLiteral:
    case ts8.SyntaxKind.NoSubstitutionTemplateLiteral:
      return true;
    default:
      return false;
  }
}
function isPropertyAccessEntityNameExpression(node) {
  return ts8.isPropertyAccessExpression(node) && ts8.isIdentifier(node.name) && isEntityNameExpression(node.expression);
}
function isSuperElementAccessExpression(node) {
  return ts8.isElementAccessExpression(node) && isSuperExpression(node.expression);
}
function isSuperPropertyAccessExpression(node) {
  return ts8.isPropertyAccessExpression(node) && isSuperExpression(node.expression);
}

// src/scopes.ts
import ts9 from "typescript";
function isFunctionScopeBoundary(node) {
  switch (node.kind) {
    case ts9.SyntaxKind.FunctionExpression:
    case ts9.SyntaxKind.ArrowFunction:
    case ts9.SyntaxKind.Constructor:
    case ts9.SyntaxKind.ModuleDeclaration:
    case ts9.SyntaxKind.ClassDeclaration:
    case ts9.SyntaxKind.ClassExpression:
    case ts9.SyntaxKind.EnumDeclaration:
    case ts9.SyntaxKind.MethodDeclaration:
    case ts9.SyntaxKind.FunctionDeclaration:
    case ts9.SyntaxKind.GetAccessor:
    case ts9.SyntaxKind.SetAccessor:
    case ts9.SyntaxKind.MethodSignature:
    case ts9.SyntaxKind.CallSignature:
    case ts9.SyntaxKind.ConstructSignature:
    case ts9.SyntaxKind.ConstructorType:
    case ts9.SyntaxKind.FunctionType:
      return true;
    case ts9.SyntaxKind.SourceFile:
      return ts9.isExternalModule(node);
    default:
      return false;
  }
}

// src/syntax.ts
import ts10 from "typescript";
function isAssignmentKind(kind) {
  return kind >= ts10.SyntaxKind.FirstAssignment && kind <= ts10.SyntaxKind.LastAssignment;
}
function isNumericPropertyName(name) {
  return String(+name) === name;
}
function charSize(ch) {
  return ch >= 65536 ? 2 : 1;
}
function isValidPropertyAccess(text, languageVersion = ts10.ScriptTarget.Latest) {
  if (text.length === 0)
    return false;
  let ch = text.codePointAt(0);
  if (!ts10.isIdentifierStart(ch, languageVersion))
    return false;
  for (let i = charSize(ch); i < text.length; i += charSize(ch)) {
    ch = text.codePointAt(i);
    if (!ts10.isIdentifierPart(ch, languageVersion))
      return false;
  }
  return true;
}

// src/types/getters.ts
import ts15 from "typescript";

// src/types/typeGuards/intrinsic.ts
import ts11 from "typescript";
function isIntrinsicAnyType(type) {
  return isTypeFlagSet(type, ts11.TypeFlags.Any);
}
function isIntrinsicBooleanType(type) {
  return isTypeFlagSet(type, ts11.TypeFlags.Boolean);
}
function isIntrinsicBigIntType(type) {
  return isTypeFlagSet(type, ts11.TypeFlags.BigInt);
}
function isIntrinsicErrorType(type) {
  return isIntrinsicType(type) && type.intrinsicName === "error";
}
function isIntrinsicESSymbolType(type) {
  return isTypeFlagSet(type, ts11.TypeFlags.ESSymbol);
}
var IntrinsicTypeFlags = ts11.TypeFlags.Intrinsic ?? ts11.TypeFlags.Any | ts11.TypeFlags.Unknown | ts11.TypeFlags.String | ts11.TypeFlags.Number | ts11.TypeFlags.BigInt | ts11.TypeFlags.Boolean | ts11.TypeFlags.BooleanLiteral | ts11.TypeFlags.ESSymbol | ts11.TypeFlags.Void | ts11.TypeFlags.Undefined | ts11.TypeFlags.Null | ts11.TypeFlags.Never | ts11.TypeFlags.NonPrimitive;
function isIntrinsicType(type) {
  return isTypeFlagSet(type, IntrinsicTypeFlags);
}
function isIntrinsicNeverType(type) {
  return isTypeFlagSet(type, ts11.TypeFlags.Never);
}
function isIntrinsicNonPrimitiveType(type) {
  return isTypeFlagSet(type, ts11.TypeFlags.NonPrimitive);
}
function isIntrinsicNullType(type) {
  return isTypeFlagSet(type, ts11.TypeFlags.Null);
}
function isIntrinsicNumberType(type) {
  return isTypeFlagSet(type, ts11.TypeFlags.Number);
}
function isIntrinsicStringType(type) {
  return isTypeFlagSet(type, ts11.TypeFlags.String);
}
function isIntrinsicUndefinedType(type) {
  return isTypeFlagSet(type, ts11.TypeFlags.Undefined);
}
function isIntrinsicUnknownType(type) {
  return isTypeFlagSet(type, ts11.TypeFlags.Unknown);
}
function isIntrinsicVoidType(type) {
  return isTypeFlagSet(type, ts11.TypeFlags.Void);
}

// src/types/typeGuards/objects.ts
import ts13 from "typescript";

// src/types/typeGuards/single.ts
import ts12 from "typescript";
function isConditionalType(type) {
  return isTypeFlagSet(type, ts12.TypeFlags.Conditional);
}
function isEnumType(type) {
  return isTypeFlagSet(type, ts12.TypeFlags.Enum);
}
function isFreshableType(type) {
  return isTypeFlagSet(type, ts12.TypeFlags.Freshable);
}
function isIndexType(type) {
  return isTypeFlagSet(type, ts12.TypeFlags.Index);
}
function isIndexedAccessType(type) {
  return isTypeFlagSet(type, ts12.TypeFlags.IndexedAccess);
}
function isInstantiableType(type) {
  return isTypeFlagSet(type, ts12.TypeFlags.Instantiable);
}
function isIntersectionType(type) {
  return isTypeFlagSet(type, ts12.TypeFlags.Intersection);
}
function isObjectType(type) {
  return isTypeFlagSet(type, ts12.TypeFlags.Object);
}
function isStringMappingType(type) {
  return isTypeFlagSet(type, ts12.TypeFlags.StringMapping);
}
function isSubstitutionType(type) {
  return isTypeFlagSet(type, ts12.TypeFlags.Substitution);
}
function isTypeParameter(type) {
  return isTypeFlagSet(type, ts12.TypeFlags.TypeParameter);
}
function isTypeVariable(type) {
  return isTypeFlagSet(type, ts12.TypeFlags.TypeVariable);
}
function isUnionType(type) {
  return isTypeFlagSet(type, ts12.TypeFlags.Union);
}
function isUnionOrIntersectionType(type) {
  return isTypeFlagSet(type, ts12.TypeFlags.UnionOrIntersection);
}
function isUniqueESSymbolType(type) {
  return isTypeFlagSet(type, ts12.TypeFlags.UniqueESSymbol);
}

// src/types/typeGuards/objects.ts
function isEvolvingArrayType(type) {
  return isObjectType(type) && isObjectFlagSet(type, ts13.ObjectFlags.EvolvingArray);
}
function isTupleType(type) {
  return isObjectType(type) && isObjectFlagSet(type, ts13.ObjectFlags.Tuple);
}
function isTypeReference(type) {
  return isObjectType(type) && isObjectFlagSet(type, ts13.ObjectFlags.Reference);
}

// src/types/typeGuards/compound.ts
function isFreshableIntrinsicType(type) {
  return isIntrinsicType(type) && isFreshableType(type);
}
function isTupleTypeReference(type) {
  return isTypeReference(type) && isTupleType(type.target);
}

// src/types/typeGuards/literal.ts
import ts14 from "typescript";
function isBooleanLiteralType(type) {
  return isTypeFlagSet(type, ts14.TypeFlags.BooleanLiteral);
}
function isBigIntLiteralType(type) {
  return isTypeFlagSet(type, ts14.TypeFlags.BigIntLiteral);
}
function isFalseLiteralType(type) {
  return isBooleanLiteralType(type) && type.intrinsicName === "false";
}
function isLiteralType(type) {
  return isTypeFlagSet(type, ts14.TypeFlags.Literal);
}
function isNumberLiteralType(type) {
  return isTypeFlagSet(type, ts14.TypeFlags.NumberLiteral);
}
function isStringLiteralType(type) {
  return isTypeFlagSet(type, ts14.TypeFlags.StringLiteral);
}
function isTemplateLiteralType(type) {
  return isTypeFlagSet(type, ts14.TypeFlags.TemplateLiteral);
}
function isTrueLiteralType(type) {
  return isBooleanLiteralType(type) && type.intrinsicName === "true";
}
function isUnknownLiteralType(type) {
  return isTypeFlagSet(type, ts14.TypeFlags.Literal);
}

// src/types/getters.ts
function getCallSignaturesOfType(type) {
  if (isUnionType(type)) {
    const signatures = [];
    for (const subType of type.types) {
      signatures.push(...getCallSignaturesOfType(subType));
    }
    return signatures;
  }
  if (isIntersectionType(type)) {
    let signatures;
    for (const subType of type.types) {
      const sig = getCallSignaturesOfType(subType);
      if (sig.length !== 0) {
        if (signatures !== void 0)
          return [];
        signatures = sig;
      }
    }
    return signatures === void 0 ? [] : signatures;
  }
  return type.getCallSignatures();
}
function getPropertyOfType(type, name) {
  if (!name.startsWith("__"))
    return type.getProperty(name);
  return type.getProperties().find((s) => s.escapedName === name);
}
function getWellKnownSymbolPropertyOfType(type, wellKnownSymbolName, typeChecker) {
  const prefix = "__@" + wellKnownSymbolName;
  for (const prop of type.getProperties()) {
    if (!prop.name.startsWith(prefix)) {
      continue;
    }
    const declaration = prop.valueDeclaration ?? prop.getDeclarations()[0];
    if (!isNamedDeclarationWithName(declaration) || declaration.name === void 0 || !ts15.isComputedPropertyName(declaration.name)) {
      continue;
    }
    const globalSymbol = typeChecker.getApparentType(
      typeChecker.getTypeAtLocation(declaration.name.expression)
    ).symbol;
    if (prop.escapedName === getPropertyNameOfWellKnownSymbol(
      typeChecker,
      globalSymbol,
      wellKnownSymbolName
    )) {
      return prop;
    }
  }
  return void 0;
}
function getPropertyNameOfWellKnownSymbol(typeChecker, symbolConstructor, symbolName) {
  const knownSymbol = symbolConstructor && typeChecker.getTypeOfSymbolAtLocation(
    symbolConstructor,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    symbolConstructor.valueDeclaration
  ).getProperty(symbolName);
  const knownSymbolType = knownSymbol && typeChecker.getTypeOfSymbolAtLocation(
    knownSymbol,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    knownSymbol.valueDeclaration
  );
  if (knownSymbolType && isUniqueESSymbolType(knownSymbolType))
    return knownSymbolType.escapedName;
  return "__@" + symbolName;
}

// src/types/utilities.ts
import ts17 from "typescript";

// src/nodes/utilities.ts
import ts16 from "typescript";
function isBindableObjectDefinePropertyCall(node) {
  return node.arguments.length === 3 && isEntityNameExpression(node.arguments[0]) && isNumericOrStringLikeLiteral(node.arguments[1]) && ts16.isPropertyAccessExpression(node.expression) && node.expression.name.escapedText === "defineProperty" && ts16.isIdentifier(node.expression.expression) && node.expression.expression.escapedText === "Object";
}
function isInConstContext(node) {
  let current = node;
  while (true) {
    const parent = current.parent;
    outer:
      switch (parent.kind) {
        case ts16.SyntaxKind.TypeAssertionExpression:
        case ts16.SyntaxKind.AsExpression:
          return isConstAssertionExpression(parent);
        case ts16.SyntaxKind.PrefixUnaryExpression:
          if (current.kind !== ts16.SyntaxKind.NumericLiteral)
            return false;
          switch (parent.operator) {
            case ts16.SyntaxKind.PlusToken:
            case ts16.SyntaxKind.MinusToken:
              current = parent;
              break outer;
            default:
              return false;
          }
        case ts16.SyntaxKind.PropertyAssignment:
          if (parent.initializer !== current)
            return false;
          current = parent.parent;
          break;
        case ts16.SyntaxKind.ShorthandPropertyAssignment:
          current = parent.parent;
          break;
        case ts16.SyntaxKind.ParenthesizedExpression:
        case ts16.SyntaxKind.ArrayLiteralExpression:
        case ts16.SyntaxKind.ObjectLiteralExpression:
        case ts16.SyntaxKind.TemplateExpression:
          current = parent;
          break;
        default:
          return false;
      }
  }
}

// src/types/utilities.ts
function isFalsyType(type) {
  if (isTypeFlagSet(
    type,
    ts17.TypeFlags.Undefined | ts17.TypeFlags.Null | ts17.TypeFlags.Void
  ))
    return true;
  if (type.isLiteral())
    return !type.value;
  return isFalseLiteralType(type);
}
function intersectionTypeParts(type) {
  return isIntersectionType(type) ? type.types : [type];
}
function isReadonlyPropertyIntersection(type, name, typeChecker) {
  const typeParts = isIntersectionType(type) ? type.types : [type];
  return typeParts.some((subType) => {
    const prop = getPropertyOfType(subType, name);
    if (prop === void 0)
      return false;
    if (prop.flags & ts17.SymbolFlags.Transient) {
      if (/^(?:[1-9]\d*|0)$/.test(name) && isTupleTypeReference(subType))
        return subType.target.readonly;
      switch (isReadonlyPropertyFromMappedType(subType, name, typeChecker)) {
        case true:
          return true;
        case false:
          return false;
        default:
      }
    }
    return !!// members of namespace import
    (isSymbolFlagSet(prop, ts17.SymbolFlags.ValueModule) || // we unwrapped every mapped type, now we can check the actual declarations
    symbolHasReadonlyDeclaration(prop, typeChecker));
  });
}
function isReadonlyPropertyFromMappedType(type, name, typeChecker) {
  if (!isObjectType(type) || !isObjectFlagSet(type, ts17.ObjectFlags.Mapped))
    return;
  const declaration = type.symbol.declarations[0];
  if (declaration.readonlyToken !== void 0 && !/^__@[^@]+$/.test(name))
    return declaration.readonlyToken.kind !== ts17.SyntaxKind.MinusToken;
  const { modifiersType } = type;
  return modifiersType && isPropertyReadonlyInType(modifiersType, name, typeChecker);
}
function isCallback(typeChecker, param, node) {
  let type = typeChecker.getApparentType(
    typeChecker.getTypeOfSymbolAtLocation(param, node)
  );
  if (param.valueDeclaration.dotDotDotToken) {
    type = type.getNumberIndexType();
    if (type === void 0)
      return false;
  }
  for (const subType of unionTypeParts(type)) {
    if (subType.getCallSignatures().length !== 0)
      return true;
  }
  return false;
}
function isPropertyReadonlyInType(type, name, typeChecker) {
  let seenProperty = false;
  let seenReadonlySignature = false;
  for (const subType of unionTypeParts(type)) {
    if (getPropertyOfType(subType, name) === void 0) {
      const index = (isNumericPropertyName(name) ? typeChecker.getIndexInfoOfType(subType, ts17.IndexKind.Number) : void 0) ?? typeChecker.getIndexInfoOfType(subType, ts17.IndexKind.String);
      if (index?.isReadonly) {
        if (seenProperty)
          return true;
        seenReadonlySignature = true;
      }
    } else if (seenReadonlySignature || isReadonlyPropertyIntersection(subType, name, typeChecker)) {
      return true;
    } else {
      seenProperty = true;
    }
  }
  return false;
}
function isReadonlyAssignmentDeclaration(node, typeChecker) {
  if (!isBindableObjectDefinePropertyCall(node))
    return false;
  const descriptorType = typeChecker.getTypeAtLocation(node.arguments[2]);
  if (descriptorType.getProperty("value") === void 0)
    return descriptorType.getProperty("set") === void 0;
  const writableProp = descriptorType.getProperty("writable");
  if (writableProp === void 0)
    return false;
  const writableType = writableProp.valueDeclaration !== void 0 && ts17.isPropertyAssignment(writableProp.valueDeclaration) ? typeChecker.getTypeAtLocation(writableProp.valueDeclaration.initializer) : typeChecker.getTypeOfSymbolAtLocation(writableProp, node.arguments[2]);
  return isFalseLiteralType(writableType);
}
function isThenableType(typeChecker, node, type = typeChecker.getTypeAtLocation(node)) {
  for (const typePart of unionTypeParts(typeChecker.getApparentType(type))) {
    const then = typePart.getProperty("then");
    if (then === void 0)
      continue;
    const thenType = typeChecker.getTypeOfSymbolAtLocation(then, node);
    for (const subTypePart of unionTypeParts(thenType))
      for (const signature of subTypePart.getCallSignatures())
        if (signature.parameters.length !== 0 && isCallback(typeChecker, signature.parameters[0], node))
          return true;
  }
  return false;
}
function symbolHasReadonlyDeclaration(symbol, typeChecker) {
  return !!((symbol.flags & ts17.SymbolFlags.Accessor) === ts17.SymbolFlags.GetAccessor || symbol.declarations?.some(
    (node) => isModifierFlagSet(node, ts17.ModifierFlags.Readonly) || ts17.isVariableDeclaration(node) && isNodeFlagSet(node.parent, ts17.NodeFlags.Const) || ts17.isCallExpression(node) && isReadonlyAssignmentDeclaration(node, typeChecker) || ts17.isEnumMember(node) || (ts17.isPropertyAssignment(node) || ts17.isShorthandPropertyAssignment(node)) && isInConstContext(node.parent)
  ));
}
function unionTypeParts(type) {
  return isUnionType(type) ? type.types : [type];
}
export {
  forEachComment,
  forEachToken,
  getCallSignaturesOfType,
  getPropertyOfType,
  getWellKnownSymbolPropertyOfType,
  hasDecorators,
  hasExpressionInitializer,
  hasInitializer,
  hasJSDoc,
  hasModifiers,
  hasType,
  hasTypeArguments,
  includesModifier,
  intersectionTypeParts,
  isAbstractKeyword,
  isAccessExpression,
  isAccessibilityModifier,
  isAccessorDeclaration,
  isAccessorKeyword,
  isAnyKeyword,
  isArrayBindingElement,
  isArrayBindingOrAssignmentPattern,
  isAssertKeyword,
  isAssertsKeyword,
  isAssignmentKind,
  isAssignmentPattern,
  isAsyncKeyword,
  isAwaitKeyword,
  isBigIntKeyword,
  isBigIntLiteralType,
  isBindingOrAssignmentElementRestIndicator,
  isBindingOrAssignmentElementTarget,
  isBindingOrAssignmentPattern,
  isBindingPattern,
  isBlockLike,
  isBooleanKeyword,
  isBooleanLiteral,
  isBooleanLiteralType,
  isClassLikeDeclaration,
  isClassMemberModifier,
  isColonToken,
  isCompilerOptionEnabled,
  isConditionalType,
  isConstAssertionExpression,
  isConstKeyword,
  isDeclarationName,
  isDeclarationWithTypeParameterChildren,
  isDeclarationWithTypeParameters,
  isDeclareKeyword,
  isDefaultKeyword,
  isDestructuringPattern,
  isDotToken,
  isEndOfFileToken,
  isEntityNameExpression,
  isEntityNameOrEntityNameExpression,
  isEnumType,
  isEqualsGreaterThanToken,
  isEqualsToken,
  isEvolvingArrayType,
  isExclamationToken,
  isExportKeyword,
  isFalseKeyword,
  isFalseLiteral,
  isFalseLiteralType,
  isFalsyType,
  isForInOrOfStatement,
  isFreshableIntrinsicType,
  isFreshableType,
  isFunctionLikeDeclaration,
  isFunctionScopeBoundary,
  isImportExpression,
  isImportKeyword,
  isInKeyword,
  isIndexType,
  isIndexedAccessType,
  isInputFiles,
  isInstantiableType,
  isIntersectionType,
  isIntrinsicAnyType,
  isIntrinsicBigIntType,
  isIntrinsicBooleanType,
  isIntrinsicESSymbolType,
  isIntrinsicErrorType,
  isIntrinsicNeverType,
  isIntrinsicNonPrimitiveType,
  isIntrinsicNullType,
  isIntrinsicNumberType,
  isIntrinsicStringType,
  isIntrinsicType,
  isIntrinsicUndefinedType,
  isIntrinsicUnknownType,
  isIntrinsicVoidType,
  isIterationStatement,
  isJSDocComment,
  isJSDocNamespaceBody,
  isJSDocNamespaceDeclaration,
  isJSDocText,
  isJSDocTypeReferencingNode,
  isJsonMinusNumericLiteral,
  isJsonObjectExpression,
  isJsxAttributeLike,
  isJsxAttributeValue,
  isJsxChild,
  isJsxTagNameExpression,
  isJsxTagNamePropertyAccess,
  isLiteralToken,
  isLiteralType,
  isModifierFlagSet,
  isModuleBody,
  isModuleName,
  isModuleReference,
  isNamedDeclarationWithName,
  isNamedImportBindings,
  isNamedImportsOrExports,
  isNamespaceBody,
  isNamespaceDeclaration,
  isNeverKeyword,
  isNodeFlagSet,
  isNullKeyword,
  isNullLiteral,
  isNumberKeyword,
  isNumberLiteralType,
  isNumericOrStringLikeLiteral,
  isNumericPropertyName,
  isObjectBindingOrAssignmentElement,
  isObjectBindingOrAssignmentPattern,
  isObjectFlagSet,
  isObjectKeyword,
  isObjectType,
  isObjectTypeDeclaration,
  isOutKeyword,
  isOverrideKeyword,
  isParameterPropertyModifier,
  isPrivateKeyword,
  isPropertyAccessEntityNameExpression,
  isPropertyNameLiteral,
  isPropertyReadonlyInType,
  isProtectedKeyword,
  isPseudoLiteralToken,
  isPublicKeyword,
  isQuestionDotToken,
  isQuestionToken,
  isReadonlyKeyword,
  isSignatureDeclaration,
  isStaticKeyword,
  isStrictCompilerOptionEnabled,
  isStringKeyword,
  isStringLiteralType,
  isStringMappingType,
  isSubstitutionType,
  isSuperElementAccessExpression,
  isSuperExpression,
  isSuperKeyword,
  isSuperProperty,
  isSuperPropertyAccessExpression,
  isSymbolFlagSet,
  isSymbolKeyword,
  isSyntaxList,
  isTemplateLiteralType,
  isThenableType,
  isThisExpression,
  isThisKeyword,
  isTrueKeyword,
  isTrueLiteral,
  isTrueLiteralType,
  isTupleType,
  isTupleTypeReference,
  isTypeFlagSet,
  isTypeOnlyCompatibleAliasDeclaration,
  isTypeParameter,
  isTypeReference,
  isTypeReferenceType,
  isTypeVariable,
  isUndefinedKeyword,
  isUnionOrIntersectionType,
  isUnionOrIntersectionTypeNode,
  isUnionType,
  isUniqueESSymbolType,
  isUnknownKeyword,
  isUnknownLiteralType,
  isUnparsedPrologue,
  isUnparsedSourceText,
  isUnparsedSyntheticReference,
  isValidPropertyAccess,
  isVariableLikeDeclaration,
  isVoidKeyword,
  symbolHasReadonlyDeclaration,
  unionTypeParts
};
