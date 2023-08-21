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

// src/config/detectDeadCode.ts
var detectDeadCode_exports = {};
__export(detectDeadCode_exports, {
  default: () => detectDeadCode_default,
  ignores: () => ignores
});
module.exports = __toCommonJS(detectDeadCode_exports);
var import_webpack = require("@umijs/bundler-webpack/compiled/webpack");
var import_utils = require("@umijs/utils");
var import_path = __toESM(require("path"));
var ignores = [
  "**/node_modules/**",
  "**/.umi/**",
  "**/.umi-production/**",
  "**/.umi-test/**",
  "coverage/**",
  "dist/**",
  "config/**",
  "public/**",
  "mock/**"
];
var detectDeadCode = (compilation, options) => {
  const assets = getWebpackAssets(compilation);
  const compiledFilesDictionary = convertFilesToDict(assets);
  const context = options.context;
  if (!options.patterns.length) {
    options.patterns = getDefaultSourcePattern({ cwd: context });
  }
  const includedFiles = options.patterns.map((pattern) => {
    return import_utils.glob.sync(pattern, {
      ignore: [...ignores, ...options.exclude],
      cwd: context,
      absolute: true
    });
  }).flat();
  const unusedFiles = options.detectUnusedFiles ? includedFiles.filter((file) => !compiledFilesDictionary[file]) : [];
  const unusedExportMap = options.detectUnusedExport ? getUnusedExportMap(convertFilesToDict(includedFiles), compilation) : {};
  logUnusedFiles(unusedFiles);
  logUnusedExportMap(unusedExportMap);
  const hasUnusedThings = unusedFiles.length || Object.keys(unusedExportMap).length;
  if (hasUnusedThings && options.failOnHint) {
    process.exit(2);
  }
};
var getUnusedExportMap = (includedFileMap, compilation) => {
  const unusedExportMap = {};
  compilation.chunks.forEach((chunk) => {
    compilation.chunkGraph.getChunkModules(chunk).forEach((module2) => {
      outputUnusedExportMap(
        compilation,
        chunk,
        module2,
        includedFileMap,
        unusedExportMap
      );
    });
  });
  return unusedExportMap;
};
var outputUnusedExportMap = (compilation, chunk, module2, includedFileMap, unusedExportMap) => {
  if (!(module2 instanceof import_webpack.NormalModule) || !module2.resource) {
    return;
  }
  const path2 = (0, import_utils.winPath)(module2.resource);
  if (!/^((?!(node_modules)).)*$/.test(path2))
    return;
  const providedExports = compilation.chunkGraph.moduleGraph.getProvidedExports(module2);
  const usedExports = compilation.chunkGraph.moduleGraph.getUsedExports(
    module2,
    chunk.runtime
  );
  if (usedExports !== true && providedExports !== true && includedFileMap[path2]) {
    if (usedExports === false) {
      if (providedExports == null ? void 0 : providedExports.length) {
        unusedExportMap[path2] = providedExports;
      }
    } else if (providedExports instanceof Array) {
      const unusedExports = providedExports.filter(
        (item) => usedExports && !usedExports.has(item)
      );
      if (unusedExports.length) {
        unusedExportMap[path2] = unusedExports;
      }
    }
  }
};
var logUnusedExportMap = (unusedExportMap) => {
  if (!Object.keys(unusedExportMap).length) {
    return;
  }
  let numberOfUnusedExport = 0;
  let logStr = "";
  Object.keys(unusedExportMap).forEach((filePath, fileIndex) => {
    const unusedExports = unusedExportMap[filePath];
    logStr += [
      `
${fileIndex + 1}. `,
      import_utils.chalk.yellow(`${filePath}
`),
      "    >>>  ",
      import_utils.chalk.yellow(`${unusedExports.join(",  ")}`)
    ].join("");
    numberOfUnusedExport += unusedExports.length;
  });
  console.log(
    import_utils.chalk.yellow.bold("\nWarning:"),
    import_utils.chalk.yellow(
      `There are ${numberOfUnusedExport} unused exports in ${Object.keys(unusedExportMap).length} files:`
    ),
    logStr,
    import_utils.chalk.red.bold("\nPlease be careful if you want to remove them (¬º-°)¬.\n")
  );
};
var getWebpackAssets = (compilation) => {
  const outputPath = compilation.getPath(
    compilation.compiler.outputPath
  );
  const assets = [
    ...Array.from(compilation.fileDependencies),
    ...compilation.getAssets().map((asset) => import_path.default.join(outputPath, asset.name))
  ];
  return assets;
};
var convertFilesToDict = (assets) => {
  return assets.filter((path2) => !/(node_modules|(\.umi))/.test(path2) && Boolean(path2)).reduce((fileDictionary, file) => {
    const unixFile = (0, import_utils.winPath)(file);
    fileDictionary[unixFile] = true;
    return fileDictionary;
  }, {});
};
var logUnusedFiles = (unusedFiles) => {
  if (!(unusedFiles == null ? void 0 : unusedFiles.length)) {
    return;
  }
  console.log(
    import_utils.chalk.yellow.bold("\nWarning:"),
    import_utils.chalk.yellow(`There are ${unusedFiles.length} unused files:`),
    ...unusedFiles.map(
      (file, index) => `
${index + 1}. ${import_utils.chalk.yellow(file)}`
    ),
    import_utils.chalk.red.bold("\nPlease be careful if you want to remove them (¬º-°)¬.\n")
  );
};
function isDirExist(p) {
  return import_utils.fsExtra.existsSync(p) && import_utils.fsExtra.statSync(p).isDirectory();
}
function getDefaultSourcePattern(opts) {
  const { cwd } = opts;
  const srcPath = import_path.default.join(cwd, "src");
  if (isDirExist(srcPath)) {
    return ["src/**/*"];
  }
  const dirs = import_utils.fsExtra.readdirSync(cwd).filter((p) => {
    return !p.startsWith(".") && isDirExist(p);
  });
  return dirs.map((dir) => `${dir}/**/*`);
}
var detectDeadCode_default = detectDeadCode;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ignores
});
