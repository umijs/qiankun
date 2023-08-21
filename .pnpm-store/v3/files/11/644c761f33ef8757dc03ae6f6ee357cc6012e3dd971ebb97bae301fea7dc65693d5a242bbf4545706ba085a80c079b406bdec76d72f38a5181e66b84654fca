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
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  BaseGenerator: () => import_BaseGenerator.default,
  Generator: () => import_Generator.default,
  MagicString: () => import_magic_string.default,
  Mustache: () => import_mustache.default,
  address: () => import_address.default,
  aliasUtils: () => aliasUtils,
  axios: () => import_axios.default,
  chalk: () => import_chalk.default,
  cheerio: () => import_cheerio.default,
  chokidar: () => chokidar,
  clackPrompts: () => clackPrompts,
  crossSpawn: () => import_cross_spawn.default,
  debug: () => import_debug.default,
  deepmerge: () => import_deepmerge.default,
  execa: () => execa,
  fastestLevenshtein: () => fastestLevenshtein,
  filesize: () => filesize,
  fsExtra: () => import_fs_extra.default,
  generateFile: () => import_generateFile.default,
  getGitInfo: () => import_getGitInfo.default,
  git: () => git,
  glob: () => import_glob.default,
  gzipSize: () => gzipSize,
  installDeps: () => import_installDeps.default,
  lodash: () => import_lodash.default,
  logger: () => logger,
  pkgUp: () => pkgUp,
  portfinder: () => import_portfinder.default,
  printHelp: () => printHelp,
  prompts: () => import_prompts.default,
  register: () => register,
  remapping: () => import_remapping.default,
  resolve: () => import_resolve.default,
  rimraf: () => import_rimraf.default,
  semver: () => import_semver.default,
  stripAnsi: () => import_strip_ansi.default,
  tsconfigPaths: () => tsconfigPaths,
  updatePackageJSON: () => import_updatePackageJSON.default,
  yParser: () => import_yargs_parser.default,
  zod: () => import_zod.z
});
module.exports = __toCommonJS(src_exports);
var chokidar = __toESM(require("chokidar"));
var clackPrompts = __toESM(require("../compiled/@clack/prompts"));
var import_address = __toESM(require("../compiled/address"));
var import_axios = __toESM(require("../compiled/axios"));
var import_chalk = __toESM(require("../compiled/chalk"));
var import_cheerio = __toESM(require("../compiled/cheerio"));
var import_cross_spawn = __toESM(require("../compiled/cross-spawn"));
var import_debug = __toESM(require("../compiled/debug"));
var import_deepmerge = __toESM(require("../compiled/deepmerge"));
var execa = __toESM(require("../compiled/execa"));
var import_fs_extra = __toESM(require("../compiled/fs-extra"));
var import_glob = __toESM(require("../compiled/glob"));
var import_remapping = __toESM(require("../compiled/@ampproject/remapping"));
var fastestLevenshtein = __toESM(require("../compiled/fastest-levenshtein"));
var filesize = __toESM(require("../compiled/filesize"));
var gzipSize = __toESM(require("../compiled/gzip-size"));
var import_lodash = __toESM(require("../compiled/lodash"));
var import_magic_string = __toESM(require("../compiled/magic-string"));
var import_mustache = __toESM(require("../compiled/mustache"));
var pkgUp = __toESM(require("../compiled/pkg-up"));
var import_portfinder = __toESM(require("../compiled/portfinder"));
var import_prompts = __toESM(require("../compiled/prompts"));
var import_resolve = __toESM(require("../compiled/resolve"));
var import_rimraf = __toESM(require("../compiled/rimraf"));
var import_semver = __toESM(require("../compiled/semver"));
var import_strip_ansi = __toESM(require("../compiled/strip-ansi"));
var tsconfigPaths = __toESM(require("../compiled/tsconfig-paths"));
var import_yargs_parser = __toESM(require("../compiled/yargs-parser"));
var import_zod = require("../compiled/zod");
var import_BaseGenerator = __toESM(require("./BaseGenerator/BaseGenerator"));
var import_generateFile = __toESM(require("./BaseGenerator/generateFile"));
var import_Generator = __toESM(require("./Generator/Generator"));
var import_getGitInfo = __toESM(require("./getGitInfo"));
var import_installDeps = __toESM(require("./installDeps"));
var logger = __toESM(require("./logger"));
var printHelp = __toESM(require("./printHelp"));
var import_updatePackageJSON = __toESM(require("./updatePackageJSON"));
var aliasUtils = __toESM(require("./aliasUtils"));
__reExport(src_exports, require("./getCorejsVersion"), module.exports);
__reExport(src_exports, require("./getDevBanner"), module.exports);
var git = __toESM(require("./getFileGitIno"));
__reExport(src_exports, require("./importLazy"), module.exports);
__reExport(src_exports, require("./isJavaScriptFile"), module.exports);
__reExport(src_exports, require("./isLocalDev"), module.exports);
__reExport(src_exports, require("./isMonorepo"), module.exports);
__reExport(src_exports, require("./isStyleFile"), module.exports);
__reExport(src_exports, require("./npmClient"), module.exports);
__reExport(src_exports, require("./randomColor/randomColor"), module.exports);
__reExport(src_exports, require("./readDirFiles"), module.exports);
var register = __toESM(require("./register"));
__reExport(src_exports, require("./setNoDeprecation"), module.exports);
__reExport(src_exports, require("./tryPaths"), module.exports);
__reExport(src_exports, require("./winPath"), module.exports);
__reExport(src_exports, require("./zod/isZodSchema"), module.exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BaseGenerator,
  Generator,
  MagicString,
  Mustache,
  address,
  aliasUtils,
  axios,
  chalk,
  cheerio,
  chokidar,
  clackPrompts,
  crossSpawn,
  debug,
  deepmerge,
  execa,
  fastestLevenshtein,
  filesize,
  fsExtra,
  generateFile,
  getGitInfo,
  git,
  glob,
  gzipSize,
  installDeps,
  lodash,
  logger,
  pkgUp,
  portfinder,
  printHelp,
  prompts,
  register,
  remapping,
  resolve,
  rimraf,
  semver,
  stripAnsi,
  tsconfigPaths,
  updatePackageJSON,
  yParser,
  zod
});
