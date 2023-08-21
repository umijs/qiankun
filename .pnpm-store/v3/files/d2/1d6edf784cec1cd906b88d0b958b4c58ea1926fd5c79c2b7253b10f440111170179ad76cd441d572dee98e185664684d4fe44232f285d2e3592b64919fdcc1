"use strict";
exports.__esModule = true;
exports.getEmbedUrl = exports.getSandboxUrl = void 0;
var fs = require("fs");
var path_1 = require("path");
/* tslint:disable no-var-requires */
var branch = require("git-branch");
var username = require("git-username");
var repoName = require("git-repo-name");
function optionsToParameterizedUrl(options) {
    var keyValues = Object.keys(options)
        .sort()
        .filter(function (x) { return options[x]; })
        .map(function (key) { return encodeURIComponent(key) + "=" + encodeURIComponent(options[key]); })
        .join("&");
    return keyValues ? "?" + keyValues : "";
}
function getUrlOptions(options) {
    var view = options.view, autoResize = options.autoResize, hideNavigation = options.hideNavigation, currentModuleView = options.currentModuleView, fontSize = options.fontSize, initialPath = options.initialPath, enableEslint = options.enableEslint, useCodeMirror = options.useCodeMirror, expandDevTools = options.expandDevTools, forceRefresh = options.forceRefresh, openedModule = options.openedModule;
    var results = {};
    results.module = openedModule;
    results.view = view;
    results.initialpath = initialPath;
    if (autoResize) {
        results.autoresize = 1;
    }
    if (hideNavigation) {
        results.hidenavigation = 1;
    }
    if (currentModuleView) {
        results.moduleview = 1;
    }
    if (enableEslint) {
        results.eslint = 1;
    }
    if (expandDevTools) {
        results.expanddevtools = 1;
    }
    if (useCodeMirror) {
        results.codemirror = 1;
    }
    if (forceRefresh) {
        results.forcerefresh = 1;
    }
    if (fontSize !== 14) {
        results.fontsize = fontSize;
    }
    if (initialPath) {
        results.initialpath = initialPath;
    }
    if (expandDevTools) {
        results.expanddevtools = 1;
    }
    return optionsToParameterizedUrl(results);
}
var CODESANDBOX_ROOT = "https://codesandbox.io";
function findGitRoot() {
    var currentPath = __dirname;
    while (!fs.readdirSync(currentPath).find(function (f) { return path_1.basename(f) === ".git"; }) &&
        currentPath !== "/") {
        currentPath = path_1.dirname(currentPath);
    }
    if (currentPath === "/") {
        throw new Error("Could not find .git folder");
    }
    return currentPath;
}
function getRepoPath(options) {
    var gitPath = findGitRoot();
    var currentBranch;
    var currentUsername;
    var currentRepo = options.gitRepo || repoName.sync(gitPath);
    // Check whether the build is happening on Netlify
    if (process.env.REPOSITORY_URL) {
        var usernameParts = process.env.REPOSITORY_URL.match(/github.com[:|\/](.*)\/reactjs\.org/);
        if (usernameParts) {
            currentUsername = usernameParts[1];
        }
        currentBranch = process.env.BRANCH;
    }
    else {
        currentBranch = branch.sync(gitPath);
        currentUsername = username(gitPath);
    }
    currentBranch = currentBranch || options.gitBranch;
    currentUsername = currentUsername || options.gitUsername;
    if (!currentBranch) {
        throw new Error("Could not fetch branch from the git info.");
    }
    if (!currentUsername) {
        throw new Error("Could not fetch username from the git info.");
    }
    if (!currentRepo) {
        throw new Error("Could not fetch repository from the git info.");
    }
    var path = currentUsername + "/" + currentRepo + "/tree/" + currentBranch;
    if (options.examplePath) {
        path += "/" + options.examplePath;
    }
    return path;
}
function getFullUrl(type, options) {
    var gitPath = getRepoPath(options);
    var urlOptions = getUrlOptions(options);
    return CODESANDBOX_ROOT + "/" + type + "/github/" + gitPath + urlOptions;
}
function getSandboxUrl(options) {
    return getFullUrl("s", options || {});
}
exports.getSandboxUrl = getSandboxUrl;
function getEmbedUrl(options) {
    return getFullUrl("embed", options || {});
}
exports.getEmbedUrl = getEmbedUrl;
//# sourceMappingURL=url.js.map