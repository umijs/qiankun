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

// src/plugins/style.ts
var style_exports = {};
__export(style_exports, {
  style: () => style
});
module.exports = __toCommonJS(style_exports);
var import_esbuild = __toESM(require("@umijs/bundler-utils/compiled/esbuild"));
var import_utils = require("@umijs/utils");
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var import_postcssProcess = require("../utils/postcssProcess");
function style({
  minify = true,
  charset = "utf8",
  inlineStyle,
  config
} = {}) {
  return {
    name: "style",
    setup({ onResolve, onLoad }) {
      const cwd = process.cwd();
      const opt = {
        logLevel: "silent",
        bundle: true,
        write: false,
        charset,
        minify,
        loader: {
          // images
          ".svg": "dataurl",
          ".png": "dataurl",
          ".jpg": "dataurl",
          ".jpeg": "dataurl",
          ".gif": "dataurl",
          ".ico": "dataurl",
          ".webp": "dataurl",
          // font
          ".ttf": "dataurl",
          ".otf": "dataurl",
          ".woff": "dataurl",
          ".woff2": "dataurl",
          ".eot": "dataurl"
        }
      };
      onResolve({ filter: /\.css$/, namespace: "file" }, (args) => {
        const absPath = import_path.default.resolve(
          cwd,
          import_path.default.relative(cwd, args.resolveDir),
          args.path
        );
        const resolved = import_fs.default.existsSync(absPath) ? absPath : import_utils.resolve.sync(`${args.path}`, {
          basedir: args.resolveDir
        });
        return { path: resolved, namespace: inlineStyle ? "style-stub" : "" };
      });
      if (inlineStyle) {
        onResolve({ filter: /\.css$/, namespace: "style-stub" }, (args) => {
          return { path: args.path, namespace: "style-content" };
        });
        onResolve(
          { filter: /^__style_helper__$/, namespace: "style-stub" },
          (args) => ({
            path: args.path,
            namespace: "style-helper",
            sideEffects: false
          })
        );
        onLoad({ filter: /.*/, namespace: "style-helper" }, async () => ({
          contents: `
            export function injectStyle(text) {
              if (typeof document !== 'undefined') {
                var style = document.createElement('style')
                var node = document.createTextNode(text)
                style.appendChild(node)
                document.head.appendChild(style)
              }
            }
          `
        }));
        onLoad({ filter: /.*/, namespace: "style-stub" }, async (args) => ({
          contents: `
            import { injectStyle } from "__style_helper__"
            import css from ${JSON.stringify(args.path)}
            injectStyle(css)
          `
        }));
      }
      onLoad(
        {
          filter: inlineStyle ? /.*/ : /\.css$/,
          namespace: inlineStyle ? "style-content" : "file"
        },
        async (args) => {
          const options = { entryPoints: [args.path], ...opt };
          const { errors, warnings, outputFiles } = await import_esbuild.default.build(
            options
          );
          if (errors.length > 0) {
            return {
              errors,
              warnings,
              contents: outputFiles[0].text,
              loader: "text"
            };
          }
          const dir = import_path.default.dirname(args.path);
          try {
            const result = await (0, import_postcssProcess.postcssProcess)(
              config,
              outputFiles[0].text,
              args.path
            );
            return {
              errors,
              warnings,
              contents: result.css,
              loader: inlineStyle ? "text" : "css"
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
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  style
});
