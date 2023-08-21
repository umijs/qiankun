"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTemplate = exports.getMainFile = void 0;
function getMainFile(template) {
    switch (template) {
        case "adonis":
            return "server.js";
        case "vue-cli":
            return "src/main.js";
        case "angular-cli":
            return "src/main.ts";
        case "create-react-app-typescript":
            return "src/main.tsx";
        case "parcel":
        case "static":
            return "index.html";
        case "gatsby":
            return "src/pages/index.js";
        case "gridsome":
            return "src/pages/Index.vue";
        case "mdx-deck":
            return "deck.mdx";
        case "quasar":
            return "src/pages/Index.vue";
        case "styleguidist":
        case "nuxt":
        case "next":
        case "apollo":
        case "reason":
        case "sapper":
        case "nest":
        case "vuepress":
        case "styleguidist":
            return "package.json";
        default:
            return "src/index.js";
    }
}
exports.getMainFile = getMainFile;
var SANDBOX_CONFIG = "sandbox.config.json";
var MAX_CLIENT_DEPENDENCY_COUNT = 50;
function getTemplate(pkg, modules) {
    var sandboxConfig = modules[SANDBOX_CONFIG] || modules["/" + SANDBOX_CONFIG];
    if (sandboxConfig && sandboxConfig.type !== "directory") {
        try {
            var config = JSON.parse(sandboxConfig.content);
            if (config.template) {
                return config.template;
            }
        }
        catch (e) { }
    }
    if (!pkg) {
        return "static";
    }
    var _a = pkg.dependencies, dependencies = _a === void 0 ? {} : _a, _b = pkg.devDependencies, devDependencies = _b === void 0 ? {} : _b;
    var totalDependencies = __spreadArrays(Object.keys(dependencies), Object.keys(devDependencies));
    var moduleNames = Object.keys(modules);
    var adonis = ["@adonisjs/framework", "@adonisjs/core"];
    if (totalDependencies.some(function (dep) { return adonis.indexOf(dep) > -1; })) {
        return "adonis";
    }
    var nuxt = ["nuxt", "nuxt-edge", "nuxt-ts", "nuxt-ts-edge"];
    if (totalDependencies.some(function (dep) { return nuxt.indexOf(dep) > -1; })) {
        return "nuxt";
    }
    if (totalDependencies.indexOf("next") > -1) {
        return "next";
    }
    var apollo = [
        "apollo-server",
        "apollo-server-express",
        "apollo-server-hapi",
        "apollo-server-koa",
        "apollo-server-lambda",
        "apollo-server-micro",
    ];
    if (totalDependencies.some(function (dep) { return apollo.indexOf(dep) > -1; })) {
        return "apollo";
    }
    if (totalDependencies.indexOf("mdx-deck") > -1) {
        return "mdx-deck";
    }
    if (totalDependencies.indexOf("gridsome") > -1) {
        return "gridsome";
    }
    if (totalDependencies.indexOf("vuepress") > -1) {
        return "vuepress";
    }
    if (totalDependencies.indexOf("ember-cli") > -1) {
        return "ember";
    }
    if (totalDependencies.indexOf("sapper") > -1) {
        return "sapper";
    }
    if (totalDependencies.indexOf("gatsby") > -1) {
        return "gatsby";
    }
    if (totalDependencies.indexOf("quasar") > -1) {
        return "quasar";
    }
    if (totalDependencies.indexOf("@docusaurus/core") > -1) {
        return "docusaurus";
    }
    // CLIENT
    if (moduleNames.some(function (m) { return m.endsWith(".re"); })) {
        return "reason";
    }
    var parcel = ["parcel-bundler", "parcel"];
    if (totalDependencies.some(function (dep) { return parcel.indexOf(dep) > -1; })) {
        return "parcel";
    }
    var dojo = ["@dojo/core", "@dojo/framework"];
    if (totalDependencies.some(function (dep) { return dojo.indexOf(dep) > -1; })) {
        return "@dojo/cli-create-app";
    }
    if (totalDependencies.indexOf("@nestjs/core") > -1 ||
        totalDependencies.indexOf("@nestjs/common") > -1) {
        return "nest";
    }
    if (totalDependencies.indexOf("react-styleguidist") > -1) {
        return "styleguidist";
    }
    if (totalDependencies.indexOf("react-scripts") > -1) {
        return "create-react-app";
    }
    if (totalDependencies.indexOf("react-scripts-ts") > -1) {
        return "create-react-app-typescript";
    }
    if (totalDependencies.indexOf("@angular/core") > -1) {
        return "angular-cli";
    }
    if (totalDependencies.indexOf("preact-cli") > -1) {
        return "preact-cli";
    }
    if (totalDependencies.indexOf("@sveltech/routify") > -1 ||
        totalDependencies.indexOf("@roxi/routify") > -1) {
        return "node";
    }
    if (totalDependencies.indexOf("vite") > -1) {
        return "node";
    }
    if (totalDependencies.indexOf("@frontity/core") > -1) {
        return "node";
    }
    if (totalDependencies.indexOf("svelte") > -1) {
        return "svelte";
    }
    if (totalDependencies.indexOf("vue") > -1) {
        return "vue-cli";
    }
    if (totalDependencies.indexOf("cx") > -1) {
        return "cxjs";
    }
    var nodeDeps = [
        "express",
        "koa",
        "nodemon",
        "ts-node",
        "@tensorflow/tfjs-node",
        "webpack-dev-server",
        "snowpack",
    ];
    if (totalDependencies.some(function (dep) { return nodeDeps.indexOf(dep) > -1; })) {
        return "node";
    }
    if (Object.keys(dependencies).length >= MAX_CLIENT_DEPENDENCY_COUNT) {
        // The dependencies are too much for client sandboxes to handle
        return "node";
    }
    return undefined;
}
exports.getTemplate = getTemplate;
//# sourceMappingURL=templates.js.map