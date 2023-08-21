var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/moduleGraph.ts
var moduleGraph_exports = {};
__export(moduleGraph_exports, {
  ModuleGraph: () => ModuleGraph
});
module.exports = __toCommonJS(moduleGraph_exports);
var ModuleNode = class {
  constructor(file) {
    this.importers = /* @__PURE__ */ new Set();
    this.importedModules = /* @__PURE__ */ new Set();
    this.isDependency = false;
    this.isRoot = false;
    this.version = null;
    this.file = file;
  }
};
var ModuleGraph = class {
  constructor() {
    this.fileToModules = /* @__PURE__ */ new Map();
    this.depToModules = /* @__PURE__ */ new Map();
    this.depSnapshotModules = {};
    this.rootModules = /* @__PURE__ */ new Set();
  }
  restore(data) {
    const getModuleNode = (file) => {
      if (this.fileToModules.has(file)) {
        return this.fileToModules.get(file);
      }
      if (this.depToModules.has(file)) {
        return this.depToModules.get(file);
      }
      const mod = new ModuleNode(file);
      return mod;
    };
    const addNode = ({ file, importer }) => {
      const mod = getModuleNode(file);
      let isDependency = false;
      let info;
      if (data.fileModules[file]) {
        info = data.fileModules[file];
      } else if (data.depModules[file]) {
        info = data.depModules[file];
        isDependency = true;
      }
      if (info.isRoot)
        mod.isRoot = true;
      if (importer) {
        mod.importers.add(importer);
        if (!importer.importedModules.has(mod)) {
          importer.importedModules.add(mod);
        } else {
          return;
        }
      }
      mod.isDependency = isDependency;
      if (info.version !== void 0) {
        mod.version = info.version;
      }
      if (isDependency) {
        this.depToModules.set(file, mod);
      } else {
        this.fileToModules.set(file, mod);
        for (const importedModule of info.importedModules) {
          addNode({ file: importedModule, importer: mod });
        }
      }
    };
    for (const root of data.roots) {
      addNode({ file: root });
    }
    this.depSnapshotModules = data.depSnapshotModules;
  }
  toJSON() {
    const roots = [];
    const fileModules = {};
    const depModules = {};
    this.depToModules.forEach((value, key) => {
      depModules[key] = {
        version: value.version
      };
    });
    this.fileToModules.forEach((value, key) => {
      fileModules[key] = {
        importedModules: Array.from(value.importedModules).map(
          (item) => item.file
        )
      };
      if (value.isRoot) {
        fileModules[key].isRoot = true;
        roots.push(key);
      }
    });
    return {
      roots,
      fileModules,
      depModules,
      depSnapshotModules: this.depSnapshotModules
    };
  }
  snapshotDeps() {
    this.depSnapshotModules = this.getDepsInfo(this.depToModules);
  }
  getDepsInfo(mods) {
    return Array.from(mods.keys()).reduce((memo, key) => {
      memo[key] = this.getDepInfo(mods.get(key));
      return memo;
    }, {});
  }
  getDepInfo(mod) {
    const [importer] = mod.importers;
    return {
      file: mod.file,
      version: mod.version,
      importer: importer == null ? void 0 : importer.file
    };
  }
  hasDepChanged() {
    const depModulesInfo = this.getDepsInfo(this.depToModules);
    const depKeys = Object.keys(depModulesInfo);
    const snapshotKeys = Object.keys(this.depSnapshotModules);
    if (depKeys.length !== snapshotKeys.length) {
      return true;
    }
    for (const k of depKeys) {
      const dep = depModulesInfo[k];
      const snapshot = this.depSnapshotModules[k];
      if (dep.file !== (snapshot == null ? void 0 : snapshot.file)) {
        return true;
      }
      if (dep.version !== (snapshot == null ? void 0 : snapshot.version)) {
        return true;
      }
    }
    return false;
  }
  onFileChange(opts) {
    if (this.fileToModules.has(opts.file)) {
      const mod = this.fileToModules.get(opts.file);
      this.updateModule({
        mod,
        deps: opts.deps
      });
    } else {
      const mod = new ModuleNode(opts.file);
      mod.isRoot = true;
      this.fileToModules.set(opts.file, mod);
      this.rootModules.add(mod);
      opts.deps.forEach((dep) => {
        this.addNode({
          file: dep.file,
          isDependency: dep.isDependency,
          version: dep.version || null,
          importer: mod
        });
      });
    }
  }
  updateModule(opts) {
    const importedModulesMap = Array.from(opts.mod.importedModules).reduce((memo, mod) => {
      memo[mod.file] = mod;
      return memo;
    }, {});
    const newDeps = [];
    for (const dep of opts.deps) {
      if (importedModulesMap[dep.file]) {
        if (dep.version !== void 0) {
          importedModulesMap[dep.file].version = dep.version;
        }
        delete importedModulesMap[dep.file];
      } else {
        newDeps.push(dep);
      }
    }
    Object.keys(importedModulesMap).forEach((key) => {
      this.deleteNode({ mod: importedModulesMap[key], importer: opts.mod });
    });
    newDeps.forEach((dep) => {
      this.addNode({ ...dep, importer: opts.mod });
    });
  }
  addNode(opts) {
    const modules = opts.isDependency ? this.depToModules : this.fileToModules;
    let mod;
    if (modules.has(opts.file)) {
      mod = modules.get(opts.file);
      if (opts.version !== void 0)
        mod.version = opts.version;
    } else {
      mod = new ModuleNode(opts.file);
      mod.isDependency = opts.isDependency;
      if (opts.version !== void 0)
        mod.version = opts.version;
      modules.set(opts.file, mod);
    }
    if (!mod.importers.has(opts.importer)) {
      mod.importers.add(opts.importer);
    }
    if (!opts.importer.importedModules.has(mod)) {
      opts.importer.importedModules.add(mod);
    }
  }
  deleteNode(opts) {
    const modules = opts.mod.isDependency ? this.depToModules : this.fileToModules;
    const { mod, importer } = opts;
    mod.importers.delete(opts.importer);
    importer.importedModules.delete(mod);
    if (!mod.importers.size) {
      modules.delete(opts.mod.file);
      mod.importedModules.forEach((importedModule) => {
        this.deleteNode({
          mod: importedModule,
          importer: mod
        });
      });
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ModuleGraph
});
