import { pathToFileURL, fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { ModuleCacheMap, ViteNodeRunner, DEFAULT_REQUEST_STUBS } from 'vite-node/client';
import { isNodeBuiltin, getCachedData, setCacheData, isInternalRequest, isPrimitive } from 'vite-node/utils';
import { resolve, isAbsolute, dirname, join, basename, extname, normalize, relative } from 'pathe';
import { processError } from '@vitest/utils/error';
import { d as distDir } from './vendor-paths.84fc7a99.js';
import { g as getWorkerState } from './vendor-global.97e4527c.js';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { getColors, getType } from '@vitest/utils';
import { b as getAllMockableProperties } from './vendor-base.9c08bbd0.js';
import { dirname as dirname$1 } from 'node:path';
import { createRequire, Module } from 'node:module';
import { CSS_LANGS_RE, KNOWN_ASSET_RE } from 'vite-node/constants';

const spyModulePath = resolve(distDir, "spy.js");
class RefTracker {
  idMap = /* @__PURE__ */ new Map();
  mockedValueMap = /* @__PURE__ */ new Map();
  getId(value) {
    return this.idMap.get(value);
  }
  getMockedValue(id) {
    return this.mockedValueMap.get(id);
  }
  track(originalValue, mockedValue) {
    const newId = this.idMap.size;
    this.idMap.set(originalValue, newId);
    this.mockedValueMap.set(newId, mockedValue);
    return newId;
  }
}
function isSpecialProp(prop, parentType) {
  return parentType.includes("Function") && typeof prop === "string" && ["arguments", "callee", "caller", "length", "name"].includes(prop);
}
class VitestMocker {
  constructor(executor) {
    this.executor = executor;
    const context = this.executor.options.context;
    if (context)
      this.primitives = vm.runInContext("({ Object, Error, Function, RegExp, Symbol, Array, Map })", context);
    else
      this.primitives = { Object, Error, Function, RegExp, Symbol: globalThis.Symbol, Array, Map };
    const Symbol2 = this.primitives.Symbol;
    this.filterPublicKeys = ["__esModule", Symbol2.asyncIterator, Symbol2.hasInstance, Symbol2.isConcatSpreadable, Symbol2.iterator, Symbol2.match, Symbol2.matchAll, Symbol2.replace, Symbol2.search, Symbol2.split, Symbol2.species, Symbol2.toPrimitive, Symbol2.toStringTag, Symbol2.unscopables];
  }
  static pendingIds = [];
  spyModule;
  resolveCache = /* @__PURE__ */ new Map();
  primitives;
  filterPublicKeys;
  get root() {
    return this.executor.options.root;
  }
  get mockMap() {
    return this.executor.options.mockMap;
  }
  get moduleCache() {
    return this.executor.moduleCache;
  }
  get moduleDirectories() {
    return this.executor.options.moduleDirectories || [];
  }
  async initializeSpyModule() {
    this.spyModule = await this.executor.executeId(spyModulePath);
  }
  deleteCachedItem(id) {
    const mockId = this.getMockPath(id);
    if (this.moduleCache.has(mockId))
      this.moduleCache.delete(mockId);
  }
  isAModuleDirectory(path) {
    return this.moduleDirectories.some((dir) => path.includes(dir));
  }
  getSuiteFilepath() {
    return this.executor.state.filepath || "global";
  }
  createError(message) {
    const Error2 = this.primitives.Error;
    return new Error2(message);
  }
  getMocks() {
    const suite = this.getSuiteFilepath();
    const suiteMocks = this.mockMap.get(suite);
    const globalMocks = this.mockMap.get("global");
    return {
      ...globalMocks,
      ...suiteMocks
    };
  }
  async resolvePath(rawId, importer) {
    let id;
    let fsPath;
    try {
      [id, fsPath] = await this.executor.originalResolveUrl(rawId, importer);
    } catch (error) {
      if (error.code === "ERR_MODULE_NOT_FOUND") {
        const { id: unresolvedId } = error[Symbol.for("vitest.error.not_found.data")];
        id = unresolvedId;
        fsPath = unresolvedId;
      } else {
        throw error;
      }
    }
    const external = !isAbsolute(fsPath) || this.isAModuleDirectory(fsPath) ? rawId : null;
    return {
      id,
      fsPath,
      external
    };
  }
  async resolveMocks() {
    if (!VitestMocker.pendingIds.length)
      return;
    await Promise.all(VitestMocker.pendingIds.map(async (mock) => {
      const { fsPath, external } = await this.resolvePath(mock.id, mock.importer);
      if (mock.type === "unmock")
        this.unmockPath(fsPath);
      if (mock.type === "mock")
        this.mockPath(mock.id, fsPath, external, mock.factory);
    }));
    VitestMocker.pendingIds = [];
  }
  async callFunctionMock(dep, mock) {
    var _a, _b;
    const cached = (_a = this.moduleCache.get(dep)) == null ? void 0 : _a.exports;
    if (cached)
      return cached;
    let exports;
    try {
      exports = await mock();
    } catch (err) {
      const vitestError = this.createError(
        '[vitest] There was an error when mocking a module. If you are using "vi.mock" factory, make sure there are no top level variables inside, since this call is hoisted to top of the file. Read more: https://vitest.dev/api/vi.html#vi-mock'
      );
      vitestError.cause = err;
      throw vitestError;
    }
    const filepath = dep.slice(5);
    const mockpath = ((_b = this.resolveCache.get(this.getSuiteFilepath())) == null ? void 0 : _b[filepath]) || filepath;
    if (exports === null || typeof exports !== "object")
      throw this.createError(`[vitest] vi.mock("${mockpath}", factory?: () => unknown) is not returning an object. Did you mean to return an object with a "default" key?`);
    const moduleExports = new Proxy(exports, {
      get: (target, prop) => {
        const val = target[prop];
        if (prop === "then") {
          if (target instanceof Promise)
            return target.then.bind(target);
        } else if (!(prop in target)) {
          if (this.filterPublicKeys.includes(prop))
            return void 0;
          const c = getColors();
          throw this.createError(
            `[vitest] No "${String(prop)}" export is defined on the "${mockpath}" mock. Did you forget to return it from "vi.mock"?
If you need to partially mock a module, you can use "vi.importActual" inside:

${c.green(`vi.mock("${mockpath}", async () => {
  const actual = await vi.importActual("${mockpath}")
  return {
    ...actual,
    // your mocked methods
  },
})`)}
`
          );
        }
        return val;
      }
    });
    this.moduleCache.set(dep, { exports: moduleExports });
    return moduleExports;
  }
  getMockPath(dep) {
    return `mock:${dep}`;
  }
  getDependencyMock(id) {
    return this.getMocks()[id];
  }
  normalizePath(path) {
    return this.moduleCache.normalizePath(path);
  }
  resolveMockPath(mockPath, external) {
    const path = external || mockPath;
    if (external || isNodeBuiltin(mockPath) || !existsSync(mockPath)) {
      const mockDirname = dirname(path);
      const mockFolder = join(this.root, "__mocks__", mockDirname);
      if (!existsSync(mockFolder))
        return null;
      const files = readdirSync(mockFolder);
      const baseOriginal = basename(path);
      for (const file of files) {
        const baseFile = basename(file, extname(file));
        if (baseFile === baseOriginal)
          return resolve(mockFolder, file);
      }
      return null;
    }
    const dir = dirname(path);
    const baseId = basename(path);
    const fullPath = resolve(dir, "__mocks__", baseId);
    return existsSync(fullPath) ? fullPath : null;
  }
  mockObject(object, mockExports = {}) {
    const finalizers = new Array();
    const refs = new RefTracker();
    const define = (container, key, value) => {
      try {
        container[key] = value;
        return true;
      } catch {
        return false;
      }
    };
    const mockPropertiesOf = (container, newContainer) => {
      const containerType = getType(container);
      const isModule = containerType === "Module" || !!container.__esModule;
      for (const { key: property, descriptor } of getAllMockableProperties(container, isModule, this.primitives)) {
        if (!isModule && descriptor.get) {
          try {
            Object.defineProperty(newContainer, property, descriptor);
          } catch (error) {
          }
          continue;
        }
        if (isSpecialProp(property, containerType))
          continue;
        const value = container[property];
        const refId = refs.getId(value);
        if (refId !== void 0) {
          finalizers.push(() => define(newContainer, property, refs.getMockedValue(refId)));
          continue;
        }
        const type = getType(value);
        if (Array.isArray(value)) {
          define(newContainer, property, []);
          continue;
        }
        const isFunction = type.includes("Function") && typeof value === "function";
        if ((!isFunction || value.__isMockFunction) && type !== "Object" && type !== "Module") {
          define(newContainer, property, value);
          continue;
        }
        if (!define(newContainer, property, isFunction ? value : {}))
          continue;
        if (isFunction) {
          const spyModule = this.spyModule;
          if (!spyModule)
            throw this.createError("[vitest] `spyModule` is not defined. This is Vitest error. Please open a new issue with reproduction.");
          const mock = spyModule.spyOn(newContainer, property).mockImplementation(() => void 0);
          mock.mockRestore = () => {
            mock.mockReset();
            mock.mockImplementation(() => void 0);
            return mock;
          };
          Object.defineProperty(newContainer[property], "length", { value: 0 });
        }
        refs.track(value, newContainer[property]);
        mockPropertiesOf(value, newContainer[property]);
      }
    };
    const mockedObject = mockExports;
    mockPropertiesOf(object, mockedObject);
    for (const finalizer of finalizers)
      finalizer();
    return mockedObject;
  }
  unmockPath(path) {
    const suitefile = this.getSuiteFilepath();
    const id = this.normalizePath(path);
    const mock = this.mockMap.get(suitefile);
    if (mock && id in mock)
      delete mock[id];
    this.deleteCachedItem(id);
  }
  mockPath(originalId, path, external, factory) {
    const suitefile = this.getSuiteFilepath();
    const id = this.normalizePath(path);
    const mocks = this.mockMap.get(suitefile) || {};
    const resolves = this.resolveCache.get(suitefile) || {};
    mocks[id] = factory || this.resolveMockPath(path, external);
    resolves[id] = originalId;
    this.mockMap.set(suitefile, mocks);
    this.resolveCache.set(suitefile, resolves);
    this.deleteCachedItem(id);
  }
  async importActual(rawId, importee) {
    const { id, fsPath } = await this.resolvePath(rawId, importee);
    const result = await this.executor.cachedRequest(id, fsPath, [importee]);
    return result;
  }
  async importMock(rawId, importee) {
    const { id, fsPath, external } = await this.resolvePath(rawId, importee);
    const normalizedId = this.normalizePath(fsPath);
    let mock = this.getDependencyMock(normalizedId);
    if (mock === void 0)
      mock = this.resolveMockPath(fsPath, external);
    if (mock === null) {
      const mod = await this.executor.cachedRequest(id, fsPath, [importee]);
      return this.mockObject(mod);
    }
    if (typeof mock === "function")
      return this.callFunctionMock(fsPath, mock);
    return this.executor.dependencyRequest(mock, mock, [importee]);
  }
  async requestWithMock(url, callstack) {
    const id = this.normalizePath(url);
    const mock = this.getDependencyMock(id);
    const mockPath = this.getMockPath(id);
    if (mock === null) {
      const cache = this.moduleCache.get(mockPath);
      if (cache.exports)
        return cache.exports;
      const exports = {};
      this.moduleCache.set(mockPath, { exports });
      const mod = await this.executor.directRequest(url, url, callstack);
      this.mockObject(mod, exports);
      return exports;
    }
    if (typeof mock === "function" && !callstack.includes(mockPath) && !callstack.includes(url)) {
      callstack.push(mockPath);
      const result = await this.callFunctionMock(mockPath, mock);
      const indexMock = callstack.indexOf(mockPath);
      callstack.splice(indexMock, 1);
      return result;
    }
    if (typeof mock === "string" && !callstack.includes(mock))
      return mock;
  }
  queueMock(id, importer, factory) {
    VitestMocker.pendingIds.push({ type: "mock", id, importer, factory });
  }
  queueUnmock(id, importer) {
    VitestMocker.pendingIds.push({ type: "unmock", id, importer });
  }
}

const SyntheticModule = vm.SyntheticModule;
const SourceTextModule = vm.SourceTextModule;
const _require = createRequire(import.meta.url);
const nativeResolve = import.meta.resolve;
const dataURIRegex = /^data:(?<mime>text\/javascript|application\/json|application\/wasm)(?:;(?<encoding>charset=utf-8|base64))?,(?<code>.*)$/;
class ExternalModulesExecutor {
  constructor(options) {
    this.options = options;
    this.context = options.context;
    const primitives = vm.runInContext("({ Object, Array, Error })", this.context);
    this.primitives = primitives;
    const executor = this;
    this.Module = class Module$1 {
      exports;
      isPreloading = false;
      require;
      id;
      filename;
      loaded;
      parent;
      children = [];
      path;
      paths = [];
      constructor(id, parent) {
        this.exports = primitives.Object.create(Object.prototype);
        this.require = Module$1.createRequire(id);
        this.path = dirname$1(id);
        this.id = id;
        this.filename = id;
        this.loaded = false;
        this.parent = parent;
      }
      _compile(code, filename) {
        const cjsModule = Module$1.wrap(code);
        const script = new vm.Script(cjsModule, {
          filename,
          importModuleDynamically: executor.importModuleDynamically
        });
        script.identifier = filename;
        const fn = script.runInContext(executor.context);
        const __dirname = dirname$1(filename);
        executor.requireCache[filename] = this;
        try {
          fn(this.exports, this.require, this, filename, __dirname);
          return this.exports;
        } finally {
          this.loaded = true;
        }
      }
      // exposed for external use, Node.js does the opposite
      static _load = (request, parent, _isMain) => {
        const require = Module$1.createRequire((parent == null ? void 0 : parent.filename) ?? request);
        return require(request);
      };
      static wrap = (script) => {
        return Module$1.wrapper[0] + script + Module$1.wrapper[1];
      };
      static wrapper = new primitives.Array(
        "(function (exports, require, module, __filename, __dirname) { ",
        "\n});"
      );
      static builtinModules = Module.builtinModules;
      static findSourceMap = Module.findSourceMap;
      static SourceMap = Module.SourceMap;
      static syncBuiltinESMExports = Module.syncBuiltinESMExports;
      static _cache = executor.moduleCache;
      static _extensions = executor.extensions;
      static createRequire = (filename) => {
        return executor.createRequire(filename);
      };
      static runMain = () => {
        throw new primitives.Error('[vitest] "runMain" is not implemented.');
      };
      // @ts-expect-error not typed
      static _resolveFilename = Module._resolveFilename;
      // @ts-expect-error not typed
      static _findPath = Module._findPath;
      // @ts-expect-error not typed
      static _initPaths = Module._initPaths;
      // @ts-expect-error not typed
      static _preloadModules = Module._preloadModules;
      // @ts-expect-error not typed
      static _resolveLookupPaths = Module._resolveLookupPaths;
      // @ts-expect-error not typed
      static globalPaths = Module.globalPaths;
      // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
      // @ts-ignore not typed in lower versions
      static isBuiltin = Module.isBuiltin;
      static Module = Module$1;
    };
    this.extensions[".js"] = this.requireJs;
    this.extensions[".json"] = this.requireJson;
  }
  requireCache = /* @__PURE__ */ Object.create(null);
  builtinCache = /* @__PURE__ */ Object.create(null);
  moduleCache = /* @__PURE__ */ new Map();
  extensions = /* @__PURE__ */ Object.create(null);
  esmLinkMap = /* @__PURE__ */ new WeakMap();
  context;
  fsCache = /* @__PURE__ */ new Map();
  fsBufferCache = /* @__PURE__ */ new Map();
  Module;
  primitives;
  requireJs = (m, filename) => {
    const content = this.readFile(filename);
    m._compile(content, filename);
  };
  requireJson = (m, filename) => {
    const code = this.readFile(filename);
    m.exports = JSON.parse(code);
  };
  importModuleDynamically = async (specifier, referencer) => {
    const module = await this.resolveModule(specifier, referencer.identifier);
    return this.evaluateModule(module);
  };
  resolveModule = async (specifier, referencer) => {
    const identifier = await this.resolveAsync(specifier, referencer);
    return await this.createModule(identifier);
  };
  async resolveAsync(specifier, parent) {
    return nativeResolve(specifier, parent);
  }
  readFile(path) {
    const cached = this.fsCache.get(path);
    if (cached)
      return cached;
    const source = readFileSync(path, "utf-8");
    this.fsCache.set(path, source);
    return source;
  }
  readBuffer(path) {
    const cached = this.fsBufferCache.get(path);
    if (cached)
      return cached;
    const buffer = readFileSync(path);
    this.fsBufferCache.set(path, buffer);
    return buffer;
  }
  findNearestPackageData(basedir) {
    var _a;
    const originalBasedir = basedir;
    const packageCache = this.options.packageCache;
    while (basedir) {
      const cached = getCachedData(packageCache, basedir, originalBasedir);
      if (cached)
        return cached;
      const pkgPath = join(basedir, "package.json");
      try {
        if ((_a = statSync(pkgPath, { throwIfNoEntry: false })) == null ? void 0 : _a.isFile()) {
          const pkgData = JSON.parse(this.readFile(pkgPath));
          if (packageCache)
            setCacheData(packageCache, pkgData, basedir, originalBasedir);
          return pkgData;
        }
      } catch {
      }
      const nextBasedir = dirname$1(basedir);
      if (nextBasedir === basedir)
        break;
      basedir = nextBasedir;
    }
    return null;
  }
  wrapSynteticModule(identifier, exports) {
    const moduleKeys = Object.keys(exports).filter((key) => key !== "default");
    const m = new SyntheticModule(
      [...moduleKeys, "default"],
      () => {
        for (const key of moduleKeys)
          m.setExport(key, exports[key]);
        m.setExport("default", exports);
      },
      {
        context: this.context,
        identifier
      }
    );
    return m;
  }
  async evaluateModule(m) {
    if (m.status === "unlinked") {
      this.esmLinkMap.set(
        m,
        m.link(
          (identifier, referencer) => this.resolveModule(identifier, referencer.identifier)
        )
      );
    }
    await this.esmLinkMap.get(m);
    if (m.status === "linked")
      await m.evaluate();
    return m;
  }
  findLongestRegisteredExtension(filename) {
    const name = basename(filename);
    let currentExtension;
    let index;
    let startIndex = 0;
    while ((index = name.indexOf(".", startIndex)) !== -1) {
      startIndex = index + 1;
      if (index === 0)
        continue;
      currentExtension = name.slice(index);
      if (this.extensions[currentExtension])
        return currentExtension;
    }
    return ".js";
  }
  createRequire = (filename) => {
    const _require2 = createRequire(filename);
    const require = (id) => {
      const resolved = _require2.resolve(id);
      const ext = extname(resolved);
      if (ext === ".node" || isNodeBuiltin(resolved))
        return this.requireCoreModule(resolved);
      const module = this.createCommonJSNodeModule(resolved);
      return this.loadCommonJSModule(module, resolved);
    };
    require.resolve = _require2.resolve;
    Object.defineProperty(require, "extensions", {
      get: () => this.extensions,
      set: () => {
      },
      configurable: true
    });
    require.main = _require2.main;
    require.cache = this.requireCache;
    return require;
  };
  createCommonJSNodeModule(filename) {
    return new this.Module(filename);
  }
  // very naive implementation for Node.js require
  loadCommonJSModule(module, filename) {
    const cached = this.requireCache[filename];
    if (cached)
      return cached.exports;
    const extension = this.findLongestRegisteredExtension(filename);
    const loader = this.extensions[extension] || this.extensions[".js"];
    loader(module, filename);
    return module.exports;
  }
  async createEsmModule(fileUrl, code) {
    const cached = this.moduleCache.get(fileUrl);
    if (cached)
      return cached;
    const [urlPath] = fileUrl.split("?");
    if (CSS_LANGS_RE.test(urlPath) || KNOWN_ASSET_RE.test(urlPath)) {
      const path = normalize(urlPath);
      let name = path.split("/node_modules/").pop() || "";
      if (name == null ? void 0 : name.startsWith("@"))
        name = name.split("/").slice(0, 2).join("/");
      else
        name = name.split("/")[0];
      const ext = extname(path);
      let error = `[vitest] Cannot import ${fileUrl}. At the moment, importing ${ext} files inside external dependencies is not allowed. `;
      if (name) {
        const c = getColors();
        error += `As a temporary workaround you can try to inline the package by updating your config:

${c.gray(c.dim("// vitest.config.js"))}
${c.green(`export default {
  test: {
    deps: {
      optimizer: {
        web: {
          include: [
            ${c.yellow(c.bold(`"${name}"`))}
          ]
        }
      }
    }
  }
}
`)}`;
      }
      throw new this.primitives.Error(error);
    }
    if (fileUrl.endsWith(".json")) {
      const m2 = new SyntheticModule(
        ["default"],
        () => {
          const result = JSON.parse(code);
          m2.setExport("default", result);
        }
      );
      this.moduleCache.set(fileUrl, m2);
      return m2;
    }
    const m = new SourceTextModule(
      code,
      {
        identifier: fileUrl,
        context: this.context,
        importModuleDynamically: this.importModuleDynamically,
        initializeImportMeta: (meta, mod) => {
          meta.url = mod.identifier;
          meta.resolve = (specifier, importer) => {
            return nativeResolve(specifier, importer ?? mod.identifier);
          };
        }
      }
    );
    this.moduleCache.set(fileUrl, m);
    return m;
  }
  requireCoreModule(identifier) {
    const normalized = identifier.replace(/^node:/, "");
    if (this.builtinCache[normalized])
      return this.builtinCache[normalized].exports;
    const moduleExports = _require(identifier);
    if (identifier === "node:module" || identifier === "module") {
      const module = new this.Module("/module.js");
      module.exports = this.Module;
      this.builtinCache[normalized] = module;
      return module.exports;
    }
    this.builtinCache[normalized] = _require.cache[normalized];
    return moduleExports;
  }
  async loadWebAssemblyModule(source, identifier) {
    const cached = this.moduleCache.get(identifier);
    if (cached)
      return cached;
    const wasmModule = await WebAssembly.compile(source);
    const exports = WebAssembly.Module.exports(wasmModule);
    const imports = WebAssembly.Module.imports(wasmModule);
    const moduleLookup = {};
    for (const { module } of imports) {
      if (moduleLookup[module] === void 0) {
        const resolvedModule = await this.resolveModule(
          module,
          identifier
        );
        moduleLookup[module] = await this.evaluateModule(resolvedModule);
      }
    }
    const syntheticModule = new SyntheticModule(
      exports.map(({ name }) => name),
      () => {
        const importsObject = {};
        for (const { module, name } of imports) {
          if (!importsObject[module])
            importsObject[module] = {};
          importsObject[module][name] = moduleLookup[module].namespace[name];
        }
        const wasmInstance = new WebAssembly.Instance(
          wasmModule,
          importsObject
        );
        for (const { name } of exports)
          syntheticModule.setExport(name, wasmInstance.exports[name]);
      },
      { context: this.context, identifier }
    );
    return syntheticModule;
  }
  async createDataModule(identifier) {
    const cached = this.moduleCache.get(identifier);
    if (cached)
      return cached;
    const Error = this.primitives.Error;
    const match = identifier.match(dataURIRegex);
    if (!match || !match.groups)
      throw new Error("Invalid data URI");
    const mime = match.groups.mime;
    const encoding = match.groups.encoding;
    if (mime === "application/wasm") {
      if (!encoding)
        throw new Error("Missing data URI encoding");
      if (encoding !== "base64")
        throw new Error(`Invalid data URI encoding: ${encoding}`);
      const module = await this.loadWebAssemblyModule(
        Buffer.from(match.groups.code, "base64"),
        identifier
      );
      this.moduleCache.set(identifier, module);
      return module;
    }
    let code = match.groups.code;
    if (!encoding || encoding === "charset=utf-8")
      code = decodeURIComponent(code);
    else if (encoding === "base64")
      code = Buffer.from(code, "base64").toString();
    else
      throw new Error(`Invalid data URI encoding: ${encoding}`);
    if (mime === "application/json") {
      const module = new SyntheticModule(
        ["default"],
        () => {
          const obj = JSON.parse(code);
          module.setExport("default", obj);
        },
        { context: this.context, identifier }
      );
      this.moduleCache.set(identifier, module);
      return module;
    }
    return this.createEsmModule(identifier, code);
  }
  async createModule(identifier) {
    if (identifier.startsWith("data:"))
      return this.createDataModule(identifier);
    const extension = extname(identifier);
    if (extension === ".node" || isNodeBuiltin(identifier)) {
      const exports2 = this.requireCoreModule(identifier);
      return this.wrapSynteticModule(identifier, exports2);
    }
    const isFileUrl = identifier.startsWith("file://");
    const fileUrl = isFileUrl ? identifier : pathToFileURL(identifier).toString();
    const pathUrl = isFileUrl ? fileURLToPath(identifier.split("?")[0]) : identifier;
    if (extension === ".cjs") {
      const module2 = this.createCommonJSNodeModule(pathUrl);
      const exports2 = this.loadCommonJSModule(module2, pathUrl);
      return this.wrapSynteticModule(fileUrl, exports2);
    }
    if (extension === ".mjs")
      return await this.createEsmModule(fileUrl, this.readFile(pathUrl));
    const pkgData = this.findNearestPackageData(normalize(pathUrl));
    if (pkgData.type === "module")
      return await this.createEsmModule(fileUrl, this.readFile(pathUrl));
    const module = this.createCommonJSNodeModule(pathUrl);
    const exports = this.loadCommonJSModule(module, pathUrl);
    return this.wrapSynteticModule(fileUrl, exports);
  }
  async import(identifier) {
    const module = await this.createModule(identifier);
    await this.evaluateModule(module);
    return module.namespace;
  }
}

const entryUrl = pathToFileURL(resolve(distDir, "entry.js")).href;
async function createVitestExecutor(options) {
  const runner = new VitestExecutor(options);
  await runner.executeId("/@vite/env");
  await runner.mocker.initializeSpyModule();
  return runner;
}
let _viteNode;
const packageCache = /* @__PURE__ */ new Map();
const moduleCache = new ModuleCacheMap();
const mockMap = /* @__PURE__ */ new Map();
async function startViteNode(options) {
  if (_viteNode)
    return _viteNode;
  const executor = await startVitestExecutor(options);
  const { run } = await import(entryUrl);
  _viteNode = { run, executor };
  return _viteNode;
}
async function startVitestExecutor(options) {
  const state = () => getWorkerState() || options.state;
  const rpc = () => state().rpc;
  const processExit = process.exit;
  process.exit = (code = process.exitCode || 0) => {
    const error = new Error(`process.exit called with "${code}"`);
    rpc().onWorkerExit(error, code);
    return processExit(code);
  };
  function catchError(err, type) {
    var _a;
    const worker = state();
    const error = processError(err);
    if (!isPrimitive(error)) {
      error.VITEST_TEST_NAME = (_a = worker.current) == null ? void 0 : _a.name;
      if (worker.filepath)
        error.VITEST_TEST_PATH = relative(state().config.root, worker.filepath);
      error.VITEST_AFTER_ENV_TEARDOWN = worker.environmentTeardownRun;
    }
    rpc().onUnhandledError(error, type);
  }
  process.on("uncaughtException", (e) => catchError(e, "Uncaught Exception"));
  process.on("unhandledRejection", (e) => catchError(e, "Unhandled Rejection"));
  const getTransformMode = () => {
    return state().environment.transformMode ?? "ssr";
  };
  return await createVitestExecutor({
    fetchModule(id) {
      return rpc().fetch(id, getTransformMode());
    },
    resolveId(id, importer) {
      return rpc().resolveId(id, importer, getTransformMode());
    },
    packageCache,
    moduleCache,
    mockMap,
    get interopDefault() {
      return state().config.deps.interopDefault;
    },
    get moduleDirectories() {
      return state().config.deps.moduleDirectories;
    },
    get root() {
      return state().config.root;
    },
    get base() {
      return state().config.base;
    },
    ...options
  });
}
function updateStyle(id, css) {
  if (typeof document === "undefined")
    return;
  const element = document.querySelector(`[data-vite-dev-id="${id}"]`);
  if (element) {
    element.textContent = css;
    return;
  }
  const head = document.querySelector("head");
  const style = document.createElement("style");
  style.setAttribute("type", "text/css");
  style.setAttribute("data-vite-dev-id", id);
  style.textContent = css;
  head == null ? void 0 : head.appendChild(style);
}
function removeStyle(id) {
  if (typeof document === "undefined")
    return;
  const sheet = document.querySelector(`[data-vite-dev-id="${id}"]`);
  if (sheet)
    document.head.removeChild(sheet);
}
class VitestExecutor extends ViteNodeRunner {
  constructor(options) {
    super(options);
    this.options = options;
    this.mocker = new VitestMocker(this);
    if (!options.context) {
      Object.defineProperty(globalThis, "__vitest_mocker__", {
        value: this.mocker,
        writable: true,
        configurable: true
      });
      const clientStub = { ...DEFAULT_REQUEST_STUBS["@vite/client"], updateStyle, removeStyle };
      this.options.requestStubs = {
        "/@vite/client": clientStub,
        "@vite/client": clientStub
      };
      this.primitives = {
        Object,
        Reflect,
        Symbol
      };
    } else {
      this.externalModules = new ExternalModulesExecutor({
        context: options.context,
        packageCache: options.packageCache
      });
      const clientStub = vm.runInContext(
        `(defaultClient) => ({ ...defaultClient, updateStyle: ${updateStyle.toString()}, removeStyle: ${removeStyle.toString()} })`,
        options.context
      )(DEFAULT_REQUEST_STUBS["@vite/client"]);
      this.options.requestStubs = {
        "/@vite/client": clientStub,
        "@vite/client": clientStub
      };
      this.primitives = vm.runInContext("({ Object, Reflect, Symbol })", options.context);
    }
  }
  mocker;
  externalModules;
  primitives;
  getContextPrimitives() {
    return this.primitives;
  }
  get state() {
    return getWorkerState() || this.options.state;
  }
  shouldResolveId(id, _importee) {
    var _a;
    if (isInternalRequest(id) || id.startsWith("data:"))
      return false;
    const transformMode = ((_a = this.state.environment) == null ? void 0 : _a.transformMode) ?? "ssr";
    return transformMode === "ssr" ? !isNodeBuiltin(id) : !id.startsWith("node:");
  }
  async originalResolveUrl(id, importer) {
    return super.resolveUrl(id, importer);
  }
  async resolveUrl(id, importer) {
    if (VitestMocker.pendingIds.length)
      await this.mocker.resolveMocks();
    if (importer && importer.startsWith("mock:"))
      importer = importer.slice(5);
    try {
      return await super.resolveUrl(id, importer);
    } catch (error) {
      if (error.code === "ERR_MODULE_NOT_FOUND") {
        const { id: id2 } = error[Symbol.for("vitest.error.not_found.data")];
        const path = this.mocker.normalizePath(id2);
        const mock = this.mocker.getDependencyMock(path);
        if (mock !== void 0)
          return [id2, id2];
      }
      throw error;
    }
  }
  async runModule(context, transformed) {
    const vmContext = this.options.context;
    if (!vmContext || !this.externalModules)
      return super.runModule(context, transformed);
    const codeDefinition = `'use strict';async (${Object.keys(context).join(",")})=>{{`;
    const code = `${codeDefinition}${transformed}
}}`;
    const options = {
      filename: context.__filename,
      lineOffset: 0,
      columnOffset: -codeDefinition.length
    };
    const fn = vm.runInContext(code, vmContext, {
      ...options,
      // if we encountered an import, it's not inlined
      importModuleDynamically: this.externalModules.importModuleDynamically
    });
    await fn(...Object.values(context));
  }
  async importExternalModule(path) {
    if (this.externalModules)
      return this.externalModules.import(path);
    return super.importExternalModule(path);
  }
  async dependencyRequest(id, fsPath, callstack) {
    const mocked = await this.mocker.requestWithMock(fsPath, callstack);
    if (typeof mocked === "string")
      return super.dependencyRequest(mocked, mocked, callstack);
    if (mocked && typeof mocked === "object")
      return mocked;
    return super.dependencyRequest(id, fsPath, callstack);
  }
  prepareContext(context) {
    if (this.state.filepath && normalize(this.state.filepath) === normalize(context.__filename)) {
      const globalNamespace = this.options.context || globalThis;
      Object.defineProperty(context.__vite_ssr_import_meta__, "vitest", { get: () => globalNamespace.__vitest_index__ });
    }
    if (this.options.context && this.externalModules)
      context.require = this.externalModules.createRequire(context.__filename);
    return context;
  }
}

export { VitestExecutor as V, mockMap as a, startVitestExecutor as b, moduleCache as m, startViteNode as s };
