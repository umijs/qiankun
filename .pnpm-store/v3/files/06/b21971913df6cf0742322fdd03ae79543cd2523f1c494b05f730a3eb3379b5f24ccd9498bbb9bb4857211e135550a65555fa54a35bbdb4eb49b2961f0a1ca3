"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiItemMetadata = void 0;
const VisitorState_1 = require("./VisitorState");
/**
 * Stores the Collector's additional analysis for an `AstDeclaration`.  This object is assigned to
 * `AstDeclaration.apiItemMetadata` but consumers must always obtain it by calling `Collector.fetchApiItemMetadata()`.
 *
 * @remarks
 * Note that ancillary declarations share their `ApiItemMetadata` with the main declaration,
 * whereas a separate `DeclarationMetadata` object is created for each declaration.
 *
 * Consider this example:
 * ```ts
 * export declare class A {
 *   get b(): string;
 *   set b(value: string);
 * }
 * export declare namespace A { }
 * ```
 *
 * In this example, there are two "symbols": `A` and `b`
 *
 * There are four "declarations": `A` class, `A` namespace, `b` getter, `b` setter
 *
 * There are three "API items": `A` class, `A` namespace, `b` property.  The property getter is the main declaration
 * for `b`, and the setter is the "ancillary" declaration.
 */
class ApiItemMetadata {
    constructor(options) {
        // Assigned by DocCommentEnhancer
        this.needsDocumentation = true;
        this.docCommentEnhancerVisitorState = VisitorState_1.VisitorState.Unvisited;
        this.declaredReleaseTag = options.declaredReleaseTag;
        this.effectiveReleaseTag = options.effectiveReleaseTag;
        this.releaseTagSameAsParent = options.releaseTagSameAsParent;
        this.isEventProperty = options.isEventProperty;
        this.isOverride = options.isOverride;
        this.isSealed = options.isSealed;
        this.isVirtual = options.isVirtual;
        this.isPreapproved = options.isPreapproved;
    }
}
exports.ApiItemMetadata = ApiItemMetadata;
//# sourceMappingURL=ApiItemMetadata.js.map