"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageMetadataManager = exports.PackageMetadata = void 0;
const path = __importStar(require("path"));
const node_core_library_1 = require("@rushstack/node-core-library");
const Extractor_1 = require("../api/Extractor");
/**
 * Represents analyzed information for a package.json file.
 * This object is constructed and returned by PackageMetadataManager.
 */
class PackageMetadata {
    constructor(packageJsonPath, packageJson, aedocSupported) {
        this.packageJsonPath = packageJsonPath;
        this.packageJson = packageJson;
        this.aedocSupported = aedocSupported;
    }
}
exports.PackageMetadata = PackageMetadata;
/**
 * This class maintains a cache of analyzed information obtained from package.json
 * files.  It is built on top of the PackageJsonLookup class.
 *
 * @remarks
 *
 * IMPORTANT: Don't use PackageMetadataManager to analyze source files from the current project:
 * 1. Files such as tsdoc-metadata.json may not have been built yet, and thus may contain incorrect information.
 * 2. The current project is not guaranteed to have a package.json file at all.  For example, API Extractor can
 *    be invoked on a bare .d.ts file.
 *
 * Use ts.program.isSourceFileFromExternalLibrary() to test source files before passing the to PackageMetadataManager.
 */
class PackageMetadataManager {
    constructor(packageJsonLookup, messageRouter) {
        this._packageMetadataByPackageJsonPath = new Map();
        this._packageJsonLookup = packageJsonLookup;
        this._messageRouter = messageRouter;
    }
    // This feature is still being standardized: https://github.com/microsoft/tsdoc/issues/7
    // In the future we will use the @microsoft/tsdoc library to read this file.
    static _resolveTsdocMetadataPathFromPackageJson(packageFolder, packageJson) {
        const tsdocMetadataFilename = PackageMetadataManager.tsdocMetadataFilename;
        let tsdocMetadataRelativePath;
        if (packageJson.tsdocMetadata) {
            // 1. If package.json contains a field such as "tsdocMetadata": "./path1/path2/tsdoc-metadata.json",
            // then that takes precedence.  This convention will be rarely needed, since the other rules below generally
            // produce a good result.
            tsdocMetadataRelativePath = packageJson.tsdocMetadata;
        }
        else if (packageJson.typings) {
            // 2. If package.json contains a field such as "typings": "./path1/path2/index.d.ts", then we look
            // for the file under "./path1/path2/tsdoc-metadata.json"
            tsdocMetadataRelativePath = path.join(path.dirname(packageJson.typings), tsdocMetadataFilename);
        }
        else if (packageJson.main) {
            // 3. If package.json contains a field such as "main": "./path1/path2/index.js", then we look for
            // the file under "./path1/path2/tsdoc-metadata.json"
            tsdocMetadataRelativePath = path.join(path.dirname(packageJson.main), tsdocMetadataFilename);
        }
        else {
            // 4. If none of the above rules apply, then by default we look for the file under "./tsdoc-metadata.json"
            // since the default entry point is "./index.js"
            tsdocMetadataRelativePath = tsdocMetadataFilename;
        }
        // Always resolve relative to the package folder.
        const tsdocMetadataPath = path.resolve(packageFolder, tsdocMetadataRelativePath);
        return tsdocMetadataPath;
    }
    /**
     * @param tsdocMetadataPath - An explicit path that can be configured in api-extractor.json.
     * If this parameter is not an empty string, it overrides the normal path calculation.
     * @returns the absolute path to the TSDoc metadata file
     */
    static resolveTsdocMetadataPath(packageFolder, packageJson, tsdocMetadataPath) {
        if (tsdocMetadataPath) {
            return path.resolve(packageFolder, tsdocMetadataPath);
        }
        return PackageMetadataManager._resolveTsdocMetadataPathFromPackageJson(packageFolder, packageJson);
    }
    /**
     * Writes the TSDoc metadata file to the specified output file.
     */
    static writeTsdocMetadataFile(tsdocMetadataPath, newlineKind) {
        const fileObject = {
            tsdocVersion: '0.12',
            toolPackages: [
                {
                    packageName: '@microsoft/api-extractor',
                    packageVersion: Extractor_1.Extractor.version
                }
            ]
        };
        const fileContent = '// This file is read by tools that parse documentation comments conforming to the TSDoc standard.\n' +
            '// It should be published with your NPM package.  It should not be tracked by Git.\n' +
            node_core_library_1.JsonFile.stringify(fileObject);
        node_core_library_1.FileSystem.writeFile(tsdocMetadataPath, fileContent, {
            convertLineEndings: newlineKind,
            ensureFolderExists: true
        });
    }
    /**
     * Finds the package.json in a parent folder of the specified source file, and
     * returns a PackageMetadata object.  If no package.json was found, then undefined
     * is returned.  The results are cached.
     */
    tryFetchPackageMetadata(sourceFilePath) {
        const packageJsonFilePath = this._packageJsonLookup.tryGetPackageJsonFilePathFor(sourceFilePath);
        if (!packageJsonFilePath) {
            return undefined;
        }
        let packageMetadata = this._packageMetadataByPackageJsonPath.get(packageJsonFilePath);
        if (!packageMetadata) {
            const packageJson = this._packageJsonLookup.loadNodePackageJson(packageJsonFilePath);
            const packageJsonFolder = path.dirname(packageJsonFilePath);
            let aedocSupported = false;
            const tsdocMetadataPath = PackageMetadataManager._resolveTsdocMetadataPathFromPackageJson(packageJsonFolder, packageJson);
            if (node_core_library_1.FileSystem.exists(tsdocMetadataPath)) {
                this._messageRouter.logVerbose("console-found-tsdoc-metadata" /* ConsoleMessageId.FoundTSDocMetadata */, 'Found metadata in ' + tsdocMetadataPath);
                // If the file exists at all, assume it was written by API Extractor
                aedocSupported = true;
            }
            packageMetadata = new PackageMetadata(packageJsonFilePath, packageJson, aedocSupported);
            this._packageMetadataByPackageJsonPath.set(packageJsonFilePath, packageMetadata);
        }
        return packageMetadata;
    }
    /**
     * Returns true if the source file is part of a package whose .d.ts files support AEDoc annotations.
     */
    isAedocSupportedFor(sourceFilePath) {
        const packageMetadata = this.tryFetchPackageMetadata(sourceFilePath);
        if (!packageMetadata) {
            return false;
        }
        return packageMetadata.aedocSupported;
    }
}
PackageMetadataManager.tsdocMetadataFilename = 'tsdoc-metadata.json';
exports.PackageMetadataManager = PackageMetadataManager;
//# sourceMappingURL=PackageMetadataManager.js.map