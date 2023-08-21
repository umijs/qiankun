var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/plugins/less.ts
var less_exports = {};
__export(less_exports, {
  aliasLessImportPath: () => aliasLessImportPath,
  default: () => less_default
});
module.exports = __toCommonJS(less_exports);
var import_less = __toESM(require("@umijs/bundler-utils/compiled/less"));
var import_enhanced_resolve = __toESM(require("enhanced-resolve"));
var import_fs = require("fs");
var import_path = __toESM(require("path"));
var import_postcssProcess = require("../utils/postcssProcess");
var import_sortByAffix = require("../utils/sortByAffix");
var import_less_plugin_alias = __toESM(require("./less-plugin-alias"));
var resolver = import_enhanced_resolve.default.create({
  mainFields: ["module", "browser", "main"],
  extensions: [
    ".json",
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".cjs",
    ".mjs",
    ".less",
    ".css"
  ],
  // TODO: support exports
  exportsFields: []
});
async function resolve(context, path2) {
  return new Promise((resolve2, reject) => {
    resolver(
      context,
      path2,
      (err, result) => err ? reject(err) : resolve2(result)
    );
  });
}
var aliasLessImports = async (ctx, alias, importer) => {
  const importRegex = /@import(?:\s+\((.*)\))?\s+['"](.*)['"]/;
  const globalImportRegex = /@import(?:\s+\((.*)\))?\s+['"](.*)['"]/g;
  const match = ctx.match(globalImportRegex) || [];
  for (const el of match) {
    const [imp, _, filePath] = el.match(importRegex) || [];
    let aliaPath = await aliasLessImportPath(filePath, alias, importer);
    if (aliaPath) {
      ctx = ctx.replace(imp, el.replace(filePath, aliaPath));
    }
  }
  return ctx;
};
var aliasLessImportPath = async (filePath, alias, importer) => {
  let aliaPath = filePath.startsWith("~") ? filePath.replace("~", "") : filePath;
  const keys = (0, import_sortByAffix.sortByAffix)({ arr: Object.keys(alias), affix: "$" });
  for (const key of keys) {
    const pathSegments = aliaPath.split("/");
    if (pathSegments[0] === key) {
      pathSegments[0] = alias[key];
      aliaPath = pathSegments.join("/");
      aliaPath = import_path.default.extname(aliaPath) ? aliaPath : `${aliaPath}.less`;
      return await resolve(importer, aliaPath);
    }
  }
  return null;
};
var less_default = (options = {}) => {
  const { alias, inlineStyle, config, ...lessOptions } = options;
  return {
    name: "less",
    setup({ onResolve, onLoad }) {
      onResolve({ filter: /\.less$/, namespace: "file" }, async (args) => {
        let filePath = args.path;
        let isMatchedAlias = false;
        if (!!alias) {
          const aliasMatchPath = await aliasLessImportPath(
            filePath,
            alias,
            args.path
          );
          if (aliasMatchPath) {
            isMatchedAlias = true;
            filePath = aliasMatchPath;
          }
        }
        if (!isMatchedAlias) {
          const isImportFromDeps = !import_path.default.isAbsolute(filePath) && !filePath.startsWith(".");
          if (isImportFromDeps) {
            filePath = await resolve(process.cwd(), filePath);
          } else {
            filePath = import_path.default.resolve(
              process.cwd(),
              import_path.default.relative(process.cwd(), args.resolveDir),
              args.path
            );
          }
        }
        return {
          path: filePath,
          namespace: inlineStyle ? "less-file" : "file"
        };
      });
      if (inlineStyle) {
        onResolve({ filter: /\.less$/, namespace: "less-file" }, (args) => {
          return { path: args.path, namespace: "less-content" };
        });
        onResolve(
          { filter: /^__style_helper__$/, namespace: "less-file" },
          (args) => ({
            path: args.path,
            namespace: "style-helper",
            sideEffects: false
          })
        );
        onLoad({ filter: /.*/, namespace: "less-file" }, async (args) => ({
          contents: `
            import { injectStyle } from "__style_helper__"
            import css from ${JSON.stringify(args.path)}
            injectStyle(css)
            export default{}
          `
        }));
      }
      onLoad(
        { filter: /\.less$/, namespace: inlineStyle ? "less-content" : "file" },
        async (args) => {
          let content = await import_fs.promises.readFile(args.path, "utf-8");
          if (!!alias) {
            content = await aliasLessImports(content, alias, args.path);
          }
          const dir = import_path.default.dirname(args.path);
          const filename = import_path.default.basename(args.path);
          try {
            const result = await import_less.default.render(content, {
              plugins: [
                new import_less_plugin_alias.default({
                  alias: alias || {}
                })
              ],
              filename,
              rootpath: dir,
              ...lessOptions,
              paths: [...lessOptions.paths || [], dir]
            });
            const postcssrResult = await (0, import_postcssProcess.postcssProcess)(
              config,
              result.css,
              args.path
            );
            return {
              contents: postcssrResult.css,
              loader: inlineStyle ? "text" : "css",
              resolveDir: dir
            };
          } catch (error) {
            return {
              errors: [
                {
                  text: error.message,
                  location: {
                    namespace: "file",
                    file: error.filename,
                    line: error.line,
                    column: error.column
                  }
                }
              ],
              resolveDir: dir
            };
          }
        }
      );
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  aliasLessImportPath
});
