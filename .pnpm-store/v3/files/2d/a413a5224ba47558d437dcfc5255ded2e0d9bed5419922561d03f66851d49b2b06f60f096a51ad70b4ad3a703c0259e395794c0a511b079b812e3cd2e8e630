"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var ts = require("typescript");
var buildFilter_1 = require("./buildFilter");
// We'll use the currentDirectoryName to trim parent fileNames
var currentDirectoryPath = process.cwd();
var currentDirectoryParts = currentDirectoryPath.split(path.sep);
var currentDirectoryName = currentDirectoryParts[currentDirectoryParts.length - 1];
exports.defaultParserOpts = {};
exports.defaultOptions = {
    jsx: ts.JsxEmit.React,
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.Latest
};
/**
 * Parses a file with default TS options
 * @param filePath component file that should be parsed
 */
function parse(filePathOrPaths, parserOpts) {
    if (parserOpts === void 0) { parserOpts = exports.defaultParserOpts; }
    return withCompilerOptions(exports.defaultOptions, parserOpts).parse(filePathOrPaths);
}
exports.parse = parse;
/**
 * Constructs a parser for a default configuration.
 */
function withDefaultConfig(parserOpts) {
    if (parserOpts === void 0) { parserOpts = exports.defaultParserOpts; }
    return withCompilerOptions(exports.defaultOptions, parserOpts);
}
exports.withDefaultConfig = withDefaultConfig;
/**
 * Constructs a parser for a specified tsconfig file.
 */
function withCustomConfig(tsconfigPath, parserOpts) {
    var basePath = path.dirname(tsconfigPath);
    var _a = ts.readConfigFile(tsconfigPath, function (filename) {
        return fs.readFileSync(filename, 'utf8');
    }), config = _a.config, error = _a.error;
    if (error !== undefined) {
        // tslint:disable-next-line: max-line-length
        var errorText = "Cannot load custom tsconfig.json from provided path: " + tsconfigPath + ", with error code: " + error.code + ", message: " + error.messageText;
        throw new Error(errorText);
    }
    var _b = ts.parseJsonConfigFileContent(config, ts.sys, basePath, {}, tsconfigPath), options = _b.options, errors = _b.errors;
    if (errors && errors.length) {
        throw errors[0];
    }
    return withCompilerOptions(options, parserOpts);
}
exports.withCustomConfig = withCustomConfig;
/**
 * Constructs a parser for a specified set of TS compiler options.
 */
function withCompilerOptions(compilerOptions, parserOpts) {
    if (parserOpts === void 0) { parserOpts = exports.defaultParserOpts; }
    return {
        parse: function (filePathOrPaths) {
            return parseWithProgramProvider(filePathOrPaths, compilerOptions, parserOpts);
        },
        parseWithProgramProvider: function (filePathOrPaths, programProvider) {
            return parseWithProgramProvider(filePathOrPaths, compilerOptions, parserOpts, programProvider);
        }
    };
}
exports.withCompilerOptions = withCompilerOptions;
var isOptional = function (prop) {
    // tslint:disable-next-line:no-bitwise
    return (prop.getFlags() & ts.SymbolFlags.Optional) !== 0;
};
var defaultJSDoc = {
    description: '',
    fullComment: '',
    tags: {}
};
var Parser = /** @class */ (function () {
    function Parser(program, opts) {
        var savePropValueAsString = opts.savePropValueAsString, shouldExtractLiteralValuesFromEnum = opts.shouldExtractLiteralValuesFromEnum, shouldRemoveUndefinedFromOptional = opts.shouldRemoveUndefinedFromOptional, shouldExtractValuesFromUnion = opts.shouldExtractValuesFromUnion, shouldIncludePropTagMap = opts.shouldIncludePropTagMap;
        this.checker = program.getTypeChecker();
        this.propFilter = buildFilter_1.buildFilter(opts);
        this.shouldExtractLiteralValuesFromEnum = Boolean(shouldExtractLiteralValuesFromEnum);
        this.shouldRemoveUndefinedFromOptional = Boolean(shouldRemoveUndefinedFromOptional);
        this.shouldExtractValuesFromUnion = Boolean(shouldExtractValuesFromUnion);
        this.savePropValueAsString = Boolean(savePropValueAsString);
        this.shouldIncludePropTagMap = Boolean(shouldIncludePropTagMap);
    }
    Parser.prototype.getComponentFromExpression = function (exp) {
        var declaration = exp.valueDeclaration || exp.declarations[0];
        var type = this.checker.getTypeOfSymbolAtLocation(exp, declaration);
        var typeSymbol = type.symbol || type.aliasSymbol;
        if (!typeSymbol) {
            return exp;
        }
        var symbolName = typeSymbol.getName();
        if ((symbolName === 'MemoExoticComponent' ||
            symbolName === 'ForwardRefExoticComponent') &&
            exp.valueDeclaration &&
            ts.isExportAssignment(exp.valueDeclaration) &&
            ts.isCallExpression(exp.valueDeclaration.expression)) {
            var component = this.checker.getSymbolAtLocation(exp.valueDeclaration.expression.arguments[0]);
            if (component) {
                exp = component;
            }
        }
        return exp;
    };
    Parser.prototype.getComponentInfo = function (exp, source, componentNameResolver, customComponentTypes) {
        if (componentNameResolver === void 0) { componentNameResolver = function () { return undefined; }; }
        if (customComponentTypes === void 0) { customComponentTypes = []; }
        if (!!exp.declarations && exp.declarations.length === 0) {
            return null;
        }
        var rootExp = this.getComponentFromExpression(exp);
        var declaration = rootExp.valueDeclaration || rootExp.declarations[0];
        var type = this.checker.getTypeOfSymbolAtLocation(rootExp, declaration);
        var commentSource = rootExp;
        var typeSymbol = type.symbol || type.aliasSymbol;
        var originalName = rootExp.getName();
        if (!rootExp.valueDeclaration) {
            if (originalName === 'default' &&
                !typeSymbol &&
                (rootExp.flags & ts.SymbolFlags.Alias) !== 0) {
                commentSource = this.checker.getAliasedSymbol(commentSource);
            }
            else if (!typeSymbol) {
                return null;
            }
            else {
                rootExp = typeSymbol;
                var expName = rootExp.getName();
                var defaultComponentTypes = [
                    '__function',
                    'StatelessComponent',
                    'Stateless',
                    'StyledComponentClass',
                    'StyledComponent',
                    'FunctionComponent',
                    'ForwardRefExoticComponent'
                ];
                var supportedComponentTypes = defaultComponentTypes.concat(customComponentTypes);
                if (supportedComponentTypes.indexOf(expName) !== -1) {
                    commentSource = this.checker.getAliasedSymbol(commentSource);
                }
                else {
                    commentSource = rootExp;
                }
            }
        }
        else if (type.symbol &&
            (ts.isPropertyAccessExpression(declaration) ||
                ts.isPropertyDeclaration(declaration))) {
            commentSource = type.symbol;
        }
        // Skip over PropTypes that are exported
        if (typeSymbol &&
            (typeSymbol.getEscapedName() === 'Requireable' ||
                typeSymbol.getEscapedName() === 'Validator')) {
            return null;
        }
        var propsType = this.extractPropsFromTypeIfStatelessComponent(type) ||
            this.extractPropsFromTypeIfStatefulComponent(type);
        var nameSource = originalName === 'default' ? rootExp : commentSource;
        var resolvedComponentName = componentNameResolver(nameSource, source);
        var _a = this.findDocComment(commentSource), description = _a.description, tags = _a.tags;
        var displayName = resolvedComponentName ||
            tags.visibleName ||
            computeComponentName(nameSource, source, customComponentTypes);
        var methods = this.getMethodsInfo(type);
        if (propsType) {
            if (!commentSource.valueDeclaration) {
                return null;
            }
            var defaultProps = this.extractDefaultPropsFromComponent(commentSource, commentSource.valueDeclaration.getSourceFile());
            var props = this.getPropsInfo(propsType, defaultProps);
            for (var _i = 0, _b = Object.keys(props); _i < _b.length; _i++) {
                var propName = _b[_i];
                var prop = props[propName];
                var component = { name: displayName };
                if (!this.propFilter(prop, component)) {
                    delete props[propName];
                }
            }
            return {
                tags: tags,
                description: description,
                displayName: displayName,
                methods: methods,
                props: props
            };
        }
        else if (description && displayName) {
            return {
                tags: tags,
                description: description,
                displayName: displayName,
                methods: methods,
                props: {}
            };
        }
        return null;
    };
    Parser.prototype.extractPropsFromTypeIfStatelessComponent = function (type) {
        var callSignatures = type.getCallSignatures();
        if (callSignatures.length) {
            // Could be a stateless component.  Is a function, so the props object we're interested
            // in is the (only) parameter.
            for (var _i = 0, callSignatures_1 = callSignatures; _i < callSignatures_1.length; _i++) {
                var sig = callSignatures_1[_i];
                var params = sig.getParameters();
                if (params.length === 0) {
                    continue;
                }
                // Maybe we could check return type instead,
                // but not sure if Element, ReactElement<T> are all possible values
                var propsParam = params[0];
                if (propsParam.name === 'props' || params.length === 1) {
                    return propsParam;
                }
            }
        }
        return null;
    };
    Parser.prototype.extractPropsFromTypeIfStatefulComponent = function (type) {
        var constructSignatures = type.getConstructSignatures();
        if (constructSignatures.length) {
            // React.Component. Is a class, so the props object we're interested
            // in is the type of 'props' property of the object constructed by the class.
            for (var _i = 0, constructSignatures_1 = constructSignatures; _i < constructSignatures_1.length; _i++) {
                var sig = constructSignatures_1[_i];
                var instanceType = sig.getReturnType();
                var props = instanceType.getProperty('props');
                if (props) {
                    return props;
                }
            }
        }
        return null;
    };
    Parser.prototype.extractMembersFromType = function (type) {
        var _this = this;
        var methodSymbols = [];
        /**
         * Need to loop over properties first so we capture any
         * static methods. static methods aren't captured in type.symbol.members
         */
        type.getProperties().forEach(function (property) {
            // Only add members, don't add non-member properties
            if (_this.getCallSignature(property)) {
                methodSymbols.push(property);
            }
        });
        if (type.symbol && type.symbol.members) {
            type.symbol.members.forEach(function (member) {
                methodSymbols.push(member);
            });
        }
        return methodSymbols;
    };
    Parser.prototype.getMethodsInfo = function (type) {
        var _this = this;
        var members = this.extractMembersFromType(type);
        var methods = [];
        members.forEach(function (member) {
            if (!_this.isTaggedPublic(member)) {
                return;
            }
            var name = member.getName();
            var docblock = _this.getFullJsDocComment(member).fullComment;
            var callSignature = _this.getCallSignature(member);
            var params = _this.getParameterInfo(callSignature);
            var description = ts.displayPartsToString(member.getDocumentationComment(_this.checker));
            var returnType = _this.checker.typeToString(callSignature.getReturnType());
            var returnDescription = _this.getReturnDescription(member);
            var modifiers = _this.getModifiers(member);
            methods.push({
                description: description,
                docblock: docblock,
                modifiers: modifiers,
                name: name,
                params: params,
                returns: returnDescription
                    ? {
                        description: returnDescription,
                        type: returnType
                    }
                    : null
            });
        });
        return methods;
    };
    Parser.prototype.getModifiers = function (member) {
        var modifiers = [];
        var flags = ts.getCombinedModifierFlags(member.valueDeclaration);
        var isStatic = (flags & ts.ModifierFlags.Static) !== 0; // tslint:disable-line no-bitwise
        if (isStatic) {
            modifiers.push('static');
        }
        return modifiers;
    };
    Parser.prototype.getParameterInfo = function (callSignature) {
        var _this = this;
        return callSignature.parameters.map(function (param) {
            var paramType = _this.checker.getTypeOfSymbolAtLocation(param, param.valueDeclaration);
            var paramDeclaration = _this.checker.symbolToParameterDeclaration(param);
            var isOptionalParam = !!(paramDeclaration && paramDeclaration.questionToken);
            return {
                description: ts.displayPartsToString(param.getDocumentationComment(_this.checker)) || null,
                name: param.getName() + (isOptionalParam ? '?' : ''),
                type: { name: _this.checker.typeToString(paramType) }
            };
        });
    };
    Parser.prototype.getCallSignature = function (symbol) {
        var symbolType = this.checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
        return symbolType.getCallSignatures()[0];
    };
    Parser.prototype.isTaggedPublic = function (symbol) {
        var jsDocTags = symbol.getJsDocTags();
        var isPublic = Boolean(jsDocTags.find(function (tag) { return tag.name === 'public'; }));
        return isPublic;
    };
    Parser.prototype.getReturnDescription = function (symbol) {
        var tags = symbol.getJsDocTags();
        var returnTag = tags.find(function (tag) { return tag.name === 'returns'; });
        if (!returnTag) {
            return null;
        }
        return returnTag.text || null;
    };
    Parser.prototype.getValuesFromUnionType = function (type) {
        if (type.isStringLiteral())
            return "\"" + type.value + "\"";
        if (type.isNumberLiteral())
            return "" + type.value;
        return this.checker.typeToString(type);
    };
    Parser.prototype.getDocgenType = function (propType, isRequired) {
        var _this = this;
        // When we are going to process the type, we check if this type has a constraint (is a generic type with constraint)
        if (propType.getConstraint()) {
            // If so, we assing the property the type that is the constraint
            propType = propType.getConstraint();
        }
        var propTypeString = this.checker.typeToString(propType);
        if (propType.isUnion()) {
            if (this.shouldExtractValuesFromUnion ||
                (this.shouldExtractLiteralValuesFromEnum &&
                    propType.types.every(function (type) {
                        return type.getFlags() &
                            (ts.TypeFlags.StringLiteral |
                                ts.TypeFlags.NumberLiteral |
                                ts.TypeFlags.EnumLiteral |
                                ts.TypeFlags.Undefined);
                    }))) {
                return {
                    name: 'enum',
                    raw: propTypeString,
                    value: propType.types.map(function (type) { return ({
                        value: _this.getValuesFromUnionType(type)
                    }); })
                };
            }
        }
        if (this.shouldRemoveUndefinedFromOptional && !isRequired) {
            propTypeString = propTypeString.replace(' | undefined', '');
        }
        return { name: propTypeString };
    };
    Parser.prototype.getPropsInfo = function (propsObj, defaultProps) {
        var _this = this;
        if (defaultProps === void 0) { defaultProps = {}; }
        if (!propsObj.valueDeclaration) {
            return {};
        }
        var propsType = this.checker.getTypeOfSymbolAtLocation(propsObj, propsObj.valueDeclaration);
        var baseProps = propsType.getApparentProperties();
        var propertiesOfProps = baseProps;
        if (propsType.isUnionOrIntersection()) {
            propertiesOfProps = (propertiesOfProps = this
                .checker.getAllPossiblePropertiesOfTypes(propsType.types)).concat(baseProps);
            if (!propertiesOfProps.length) {
                var subTypes = this.checker.getAllPossiblePropertiesOfTypes(propsType.types.reduce(
                // @ts-ignore
                function (all, t) { return all.concat((t.types || [])); }, []));
                propertiesOfProps = subTypes.concat(baseProps);
            }
        }
        var result = {};
        propertiesOfProps.forEach(function (prop) {
            var propName = prop.getName();
            // Find type of prop by looking in context of the props object itself.
            var propType = _this.checker.getTypeOfSymbolAtLocation(prop, propsObj.valueDeclaration);
            var jsDocComment = _this.findDocComment(prop);
            var hasCodeBasedDefault = defaultProps[propName] !== undefined;
            var defaultValue = null;
            if (hasCodeBasedDefault) {
                defaultValue = { value: defaultProps[propName] };
            }
            else if (jsDocComment.tags.default) {
                defaultValue = { value: jsDocComment.tags.default };
            }
            var parent = getParentType(prop);
            var parents = getDeclarations(prop);
            var declarations = prop.declarations || [];
            var baseProp = baseProps.find(function (p) { return p.getName() === propName; });
            var required = !isOptional(prop) &&
                !hasCodeBasedDefault &&
                // If in a intersection or union check original declaration for "?"
                // @ts-ignore
                declarations.every(function (d) { return !d.questionToken; }) &&
                (!baseProp || !isOptional(baseProp));
            var type = jsDocComment.tags.type
                ? {
                    name: jsDocComment.tags.type
                }
                : _this.getDocgenType(propType, required);
            var propTags = _this.shouldIncludePropTagMap
                ? { tags: jsDocComment.tags }
                : {};
            var description = _this.shouldIncludePropTagMap
                ? jsDocComment.description.replace(/\r\n/g, '\n')
                : jsDocComment.fullComment.replace(/\r\n/g, '\n');
            result[propName] = __assign({ defaultValue: defaultValue, description: description, name: propName, parent: parent, declarations: parents, required: required,
                type: type }, propTags);
        });
        return result;
    };
    Parser.prototype.findDocComment = function (symbol) {
        var _this = this;
        var comment = this.getFullJsDocComment(symbol);
        if (comment.fullComment || comment.tags.default) {
            return comment;
        }
        var rootSymbols = this.checker.getRootSymbols(symbol);
        var commentsOnRootSymbols = rootSymbols
            .filter(function (x) { return x !== symbol; })
            .map(function (x) { return _this.getFullJsDocComment(x); })
            .filter(function (x) { return !!x.fullComment || !!comment.tags.default; });
        if (commentsOnRootSymbols.length) {
            return commentsOnRootSymbols[0];
        }
        return defaultJSDoc;
    };
    /**
     * Extracts a full JsDoc comment from a symbol, even
     * though TypeScript has broken down the JsDoc comment into plain
     * text and JsDoc tags.
     */
    Parser.prototype.getFullJsDocComment = function (symbol) {
        // in some cases this can be undefined (Pick<Type, 'prop1'|'prop2'>)
        if (symbol.getDocumentationComment === undefined) {
            return defaultJSDoc;
        }
        var mainComment = ts.displayPartsToString(symbol.getDocumentationComment(this.checker));
        if (mainComment) {
            mainComment = mainComment.replace(/\r\n/g, '\n');
        }
        var tags = symbol.getJsDocTags() || [];
        var tagComments = [];
        var tagMap = {};
        tags.forEach(function (tag) {
            var trimmedText = (Array.isArray(tag.text) ? ts.displayPartsToString(tag.text) : (tag.text || '')).trim();
            var currentValue = tagMap[tag.name];
            tagMap[tag.name] = currentValue
                ? currentValue + '\n' + trimmedText
                : trimmedText;
            if (['default', 'type'].indexOf(tag.name) < 0) {
                tagComments.push(formatTag(tag));
            }
        });
        return {
            description: mainComment,
            fullComment: (mainComment + '\n' + tagComments.join('\n')).trim(),
            tags: tagMap
        };
    };
    Parser.prototype.getFunctionStatement = function (statement) {
        if (ts.isFunctionDeclaration(statement)) {
            return statement;
        }
        if (ts.isVariableStatement(statement)) {
            var initializer = statement.declarationList &&
                statement.declarationList.declarations[0].initializer;
            // Look at forwardRef function argument
            if (initializer && ts.isCallExpression(initializer)) {
                var symbol = this.checker.getSymbolAtLocation(initializer.expression);
                if (!symbol || symbol.getName() !== 'forwardRef')
                    return;
                initializer = initializer.arguments[0];
            }
            if (initializer &&
                (ts.isArrowFunction(initializer) ||
                    ts.isFunctionExpression(initializer))) {
                return initializer;
            }
        }
    };
    Parser.prototype.extractDefaultPropsFromComponent = function (symbol, source) {
        var _this = this;
        var possibleStatements = source.statements
            // ensure that name property is available
            .filter(function (stmt) { return !!stmt.name; })
            .filter(function (stmt) {
            return _this.checker.getSymbolAtLocation(stmt.name) === symbol;
        }).concat(source.statements.filter(function (stmt) { return ts.isExpressionStatement(stmt) || ts.isVariableStatement(stmt); }));
        return possibleStatements.reduce(function (res, statement) {
            if (statementIsClassDeclaration(statement) && statement.members.length) {
                var possibleDefaultProps = statement.members.filter(function (member) {
                    return member.name && getPropertyName(member.name) === 'defaultProps';
                });
                if (!possibleDefaultProps.length) {
                    return res;
                }
                var defaultProps = possibleDefaultProps[0];
                var initializer = defaultProps.initializer;
                if (!initializer) {
                    return res;
                }
                var properties = initializer.properties;
                while (ts.isIdentifier(initializer)) {
                    var defaultPropsReference = _this.checker.getSymbolAtLocation(initializer);
                    if (defaultPropsReference) {
                        var declarations = defaultPropsReference.getDeclarations();
                        if (declarations) {
                            initializer = declarations[0]
                                .initializer;
                            properties = initializer
                                .properties;
                        }
                    }
                }
                var propMap = {};
                if (properties) {
                    propMap = _this.getPropMap(properties);
                }
                return __assign({}, res, propMap);
            }
            else if (statementIsStatelessWithDefaultProps(statement)) {
                var propMap_1 = {};
                statement.getChildren().forEach(function (child) {
                    var right = child.right;
                    if (right && ts.isIdentifier(right)) {
                        var value = source.locals.get(right.escapedText);
                        if (value &&
                            value.valueDeclaration &&
                            ts.isVariableDeclaration(value.valueDeclaration) &&
                            value.valueDeclaration.initializer) {
                            right = value.valueDeclaration.initializer;
                        }
                    }
                    if (right) {
                        var properties = right.properties;
                        if (properties) {
                            propMap_1 = _this.getPropMap(properties);
                        }
                    }
                });
                return __assign({}, res, propMap_1);
            }
            else {
            }
            var functionStatement = _this.getFunctionStatement(statement);
            // Extracting default values from props destructuring
            if (functionStatement && functionStatement.parameters.length) {
                var name = functionStatement.parameters[0].name;
                if (ts.isObjectBindingPattern(name)) {
                    return __assign({}, res, _this.getPropMap(name.elements));
                }
            }
            return res;
        }, {});
    };
    Parser.prototype.getLiteralValueFromImportSpecifier = function (property) {
        if (ts.isImportSpecifier(property)) {
            var symbol = this.checker.getSymbolAtLocation(property.name);
            if (!symbol) {
                return null;
            }
            var aliasedSymbol = this.checker.getAliasedSymbol(symbol);
            if (aliasedSymbol &&
                aliasedSymbol.declarations &&
                aliasedSymbol.declarations.length) {
                return this.getLiteralValueFromPropertyAssignment(aliasedSymbol.declarations[0]);
            }
            return null;
        }
        return null;
    };
    Parser.prototype.getLiteralValueFromPropertyAssignment = function (property) {
        var initializer = property.initializer;
        // Shorthand properties, so inflect their actual value
        if (!initializer) {
            if (ts.isShorthandPropertyAssignment(property)) {
                var symbol = this.checker.getShorthandAssignmentValueSymbol(property);
                var decl = symbol && symbol.valueDeclaration;
                if (decl && decl.initializer) {
                    initializer = decl.initializer;
                }
            }
        }
        if (!initializer) {
            return undefined;
        }
        // Literal values
        switch (initializer.kind) {
            case ts.SyntaxKind.FalseKeyword:
                return this.savePropValueAsString ? 'false' : false;
            case ts.SyntaxKind.TrueKeyword:
                return this.savePropValueAsString ? 'true' : true;
            case ts.SyntaxKind.StringLiteral:
                return initializer.text.trim();
            case ts.SyntaxKind.PrefixUnaryExpression:
                return this.savePropValueAsString
                    ? initializer.getFullText().trim()
                    : Number(initializer.getFullText());
            case ts.SyntaxKind.NumericLiteral:
                return this.savePropValueAsString
                    ? "" + initializer.text
                    : Number(initializer.text);
            case ts.SyntaxKind.NullKeyword:
                return this.savePropValueAsString ? 'null' : null;
            case ts.SyntaxKind.Identifier:
                if (initializer.text === 'undefined') {
                    return 'undefined';
                }
                var symbol = this.checker.getSymbolAtLocation(initializer);
                if (symbol && symbol.declarations && symbol.declarations.length) {
                    if (ts.isImportSpecifier(symbol.declarations[0])) {
                        return this.getLiteralValueFromImportSpecifier(symbol.declarations[0]);
                    }
                    return this.getLiteralValueFromPropertyAssignment(symbol.declarations[0]);
                }
                return null;
            case ts.SyntaxKind.PropertyAccessExpression: {
                var symbol_1 = this.checker.getSymbolAtLocation(initializer);
                if (symbol_1 && symbol_1.declarations && symbol_1.declarations.length) {
                    var declaration = symbol_1.declarations[0];
                    if (ts.isBindingElement(declaration) ||
                        ts.isPropertyAssignment(declaration)) {
                        return this.getLiteralValueFromPropertyAssignment(declaration);
                    }
                }
            }
            case ts.SyntaxKind.ObjectLiteralExpression:
            default:
                try {
                    return initializer.getText();
                }
                catch (e) {
                    return null;
                }
        }
    };
    Parser.prototype.getPropMap = function (properties) {
        var _this = this;
        var propMap = properties.reduce(function (acc, property) {
            if (ts.isSpreadAssignment(property) || !property.name) {
                return acc;
            }
            var literalValue = _this.getLiteralValueFromPropertyAssignment(property);
            var propertyName = getPropertyName(property.name);
            if ((typeof literalValue === 'string' ||
                typeof literalValue === 'number' ||
                typeof literalValue === 'boolean' ||
                literalValue === null) &&
                propertyName !== null) {
                acc[propertyName] = literalValue;
            }
            return acc;
        }, {});
        return propMap;
    };
    return Parser;
}());
exports.Parser = Parser;
function statementIsClassDeclaration(statement) {
    return !!statement.members;
}
function statementIsStatelessWithDefaultProps(statement) {
    var children = statement.getChildren();
    for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
        var child = children_1[_i];
        var left = child.left;
        if (left) {
            var name = left.name;
            if (name && name.escapedText === 'defaultProps') {
                return true;
            }
        }
    }
    return false;
}
function getPropertyName(name) {
    switch (name.kind) {
        case ts.SyntaxKind.NumericLiteral:
        case ts.SyntaxKind.StringLiteral:
        case ts.SyntaxKind.Identifier:
            return name.text;
        case ts.SyntaxKind.ComputedPropertyName:
            return name.getText();
        default:
            return null;
    }
}
function formatTag(tag) {
    var result = '@' + tag.name;
    if (tag.text) {
        result += ' ' + (Array.isArray(tag.text) ? ts.displayPartsToString(tag.text) : tag.text);
    }
    return result;
}
function getTextValueOfClassMember(classDeclaration, memberName) {
    var classDeclarationMembers = classDeclaration.members || [];
    var textValue = (classDeclarationMembers &&
        classDeclarationMembers
            .filter(function (member) { return ts.isPropertyDeclaration(member); })
            .filter(function (member) {
            var name = ts.getNameOfDeclaration(member);
            return name && name.text === memberName;
        })
            .map(function (member) {
            var property = member;
            return (property.initializer && property.initializer.text);
        }))[0];
    return textValue || '';
}
function getTextValueOfFunctionProperty(exp, source, propertyName) {
    var textValue = source.statements
        .filter(function (statement) { return ts.isExpressionStatement(statement); })
        .filter(function (statement) {
        var expr = statement
            .expression;
        return (expr.left &&
            expr.left.name &&
            expr.left.name.escapedText ===
                propertyName);
    })
        .filter(function (statement) {
        var expr = statement
            .expression;
        return (expr.left.expression
            .escapedText === exp.getName());
    })
        .filter(function (statement) {
        return ts.isStringLiteral(statement
            .expression.right);
    })
        .map(function (statement) {
        return statement
            .expression.right.text;
    })[0];
    return textValue || '';
}
function computeComponentName(exp, source, customComponentTypes) {
    if (customComponentTypes === void 0) { customComponentTypes = []; }
    var exportName = exp.getName();
    var statelessDisplayName = getTextValueOfFunctionProperty(exp, source, 'displayName');
    var statefulDisplayName = exp.valueDeclaration &&
        ts.isClassDeclaration(exp.valueDeclaration) &&
        getTextValueOfClassMember(exp.valueDeclaration, 'displayName');
    if (statelessDisplayName || statefulDisplayName) {
        return statelessDisplayName || statefulDisplayName || '';
    }
    var defaultComponentTypes = [
        'default',
        '__function',
        'Stateless',
        'StyledComponentClass',
        'StyledComponent',
        'FunctionComponent',
        'StatelessComponent',
        'ForwardRefExoticComponent'
    ];
    var supportedComponentTypes = defaultComponentTypes.concat(customComponentTypes);
    if (supportedComponentTypes.indexOf(exportName) !== -1) {
        return getDefaultExportForFile(source);
    }
    else {
        return exportName;
    }
}
// Default export for a file: named after file
function getDefaultExportForFile(source) {
    var name = path.basename(source.fileName, path.extname(source.fileName));
    var filename = name === 'index' ? path.basename(path.dirname(source.fileName)) : name;
    // JS identifiers must starts with a letter, and contain letters and/or numbers
    // So, you could not take filename as is
    var identifier = filename
        .replace(/^[^A-Z]*/gi, '')
        .replace(/[^A-Z0-9]*/gi, '');
    return identifier.length ? identifier : 'DefaultName';
}
exports.getDefaultExportForFile = getDefaultExportForFile;
function isTypeLiteral(node) {
    return node.kind === ts.SyntaxKind.TypeLiteral;
}
function getDeclarations(prop) {
    var declarations = prop.getDeclarations();
    if (declarations === undefined || declarations.length === 0) {
        return undefined;
    }
    var parents = [];
    for (var _i = 0, declarations_1 = declarations; _i < declarations_1.length; _i++) {
        var declaration = declarations_1[_i];
        var parent = declaration.parent;
        if (!isTypeLiteral(parent) && !isInterfaceOrTypeAliasDeclaration(parent)) {
            continue;
        }
        var parentName = 'name' in parent
            ? parent.name.text
            : 'TypeLiteral';
        var fileName = parent.getSourceFile().fileName;
        parents.push({
            fileName: trimFileName(fileName),
            name: parentName
        });
    }
    return parents;
}
function trimFileName(fileName) {
    var fileNameParts = fileName.split('/');
    var trimmedFileNameParts = fileNameParts.slice();
    while (trimmedFileNameParts.length) {
        if (trimmedFileNameParts[0] === currentDirectoryName) {
            break;
        }
        trimmedFileNameParts.splice(0, 1);
    }
    var trimmedFileName;
    if (trimmedFileNameParts.length) {
        trimmedFileName = trimmedFileNameParts.join('/');
    }
    else {
        trimmedFileName = fileName;
    }
    return trimmedFileName;
}
function getParentType(prop) {
    var declarations = prop.getDeclarations();
    if (declarations == null || declarations.length === 0) {
        return undefined;
    }
    // Props can be declared only in one place
    var parent = declarations[0].parent;
    if (!isInterfaceOrTypeAliasDeclaration(parent)) {
        return undefined;
    }
    var parentName = parent.name.text;
    var fileName = parent.getSourceFile().fileName;
    return {
        fileName: trimFileName(fileName),
        name: parentName
    };
}
function isInterfaceOrTypeAliasDeclaration(node) {
    return (node.kind === ts.SyntaxKind.InterfaceDeclaration ||
        node.kind === ts.SyntaxKind.TypeAliasDeclaration);
}
function parseWithProgramProvider(filePathOrPaths, compilerOptions, parserOpts, programProvider) {
    var filePaths = Array.isArray(filePathOrPaths)
        ? filePathOrPaths
        : [filePathOrPaths];
    var program = programProvider
        ? programProvider()
        : ts.createProgram(filePaths, compilerOptions);
    var parser = new Parser(program, parserOpts);
    var checker = program.getTypeChecker();
    return filePaths
        .map(function (filePath) { return program.getSourceFile(filePath); })
        .filter(function (sourceFile) {
        return typeof sourceFile !== 'undefined';
    })
        .reduce(function (docs, sourceFile) {
        var moduleSymbol = checker.getSymbolAtLocation(sourceFile);
        if (!moduleSymbol) {
            return docs;
        }
        var components = checker.getExportsOfModule(moduleSymbol);
        var componentDocs = [];
        // First document all components
        components.forEach(function (exp) {
            var doc = parser.getComponentInfo(exp, sourceFile, parserOpts.componentNameResolver, parserOpts.customComponentTypes);
            if (doc) {
                componentDocs.push(doc);
            }
            if (!exp.exports) {
                return;
            }
            // Then document any static sub-components
            exp.exports.forEach(function (symbol) {
                if (symbol.flags & ts.SymbolFlags.Prototype) {
                    return;
                }
                if (symbol.flags & ts.SymbolFlags.Method) {
                    var signature = parser.getCallSignature(symbol);
                    var returnType = checker.typeToString(signature.getReturnType());
                    if (returnType !== 'Element') {
                        return;
                    }
                }
                var doc = parser.getComponentInfo(symbol, sourceFile, parserOpts.componentNameResolver, parserOpts.customComponentTypes);
                if (doc) {
                    componentDocs.push(__assign({}, doc, { displayName: exp.escapedName + "." + symbol.escapedName }));
                }
            });
        });
        // Remove any duplicates (for HOC where the names are the same)
        var componentDocsNoDuplicates = componentDocs.reduce(function (prevVal, comp) {
            var duplicate = prevVal.find(function (compDoc) {
                return compDoc.displayName === comp.displayName;
            });
            if (duplicate)
                return prevVal;
            return prevVal.concat([comp]);
        }, []);
        var filteredComponentDocs = componentDocsNoDuplicates.filter(function (comp, index, comps) {
            return comps
                .slice(index + 1)
                .every(function (innerComp) { return innerComp.displayName !== comp.displayName; });
        });
        return docs.concat(filteredComponentDocs);
    }, []);
}
//# sourceMappingURL=parser.js.map
