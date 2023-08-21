import { statSync, promises } from 'node:fs';
import { resolve, join, isAbsolute, dirname } from 'pathe';
import { resolvePath } from 'mlly';

const defaultFindOptions = {
  startingFrom: ".",
  rootPattern: /^node_modules$/,
  reverse: false,
  test: (filePath) => {
    try {
      if (statSync(filePath).isFile()) {
        return true;
      }
    } catch {
    }
  }
};
async function findFile(filename, _options = {}) {
  const options = { ...defaultFindOptions, ..._options };
  const basePath = resolve(options.startingFrom);
  const leadingSlash = basePath[0] === "/";
  const segments = basePath.split("/").filter(Boolean);
  if (leadingSlash) {
    segments[0] = "/" + segments[0];
  }
  let root = segments.findIndex((r) => r.match(options.rootPattern));
  if (root === -1) {
    root = 0;
  }
  if (!options.reverse) {
    for (let index = segments.length; index > root; index--) {
      const filePath = join(...segments.slice(0, index), filename);
      if (await options.test(filePath)) {
        return filePath;
      }
    }
  } else {
    for (let index = root + 1; index <= segments.length; index++) {
      const filePath = join(...segments.slice(0, index), filename);
      if (await options.test(filePath)) {
        return filePath;
      }
    }
  }
  throw new Error(
    `Cannot find matching ${filename} in ${options.startingFrom} or parent directories`
  );
}
function findNearestFile(filename, _options = {}) {
  return findFile(filename, _options);
}
function findFarthestFile(filename, _options = {}) {
  return findFile(filename, { ..._options, reverse: true });
}

function definePackageJSON(package_) {
  return package_;
}
function defineTSConfig(tsconfig) {
  return tsconfig;
}
const FileCache = /* @__PURE__ */ new Map();
async function readPackageJSON(id, options = {}) {
  const resolvedPath = await resolvePackageJSON(id, options);
  const cache = options.cache && typeof options.cache !== "boolean" ? options.cache : FileCache;
  if (options.cache && cache.has(resolvedPath)) {
    return cache.get(resolvedPath);
  }
  const blob = await promises.readFile(resolvedPath, "utf8");
  const parsed = JSON.parse(blob);
  cache.set(resolvedPath, parsed);
  return parsed;
}
async function writePackageJSON(path, package_) {
  await promises.writeFile(path, JSON.stringify(package_, void 0, 2));
}
async function readTSConfig(id, options = {}) {
  const resolvedPath = await resolveTSConfig(id, options);
  const cache = options.cache && typeof options.cache !== "boolean" ? options.cache : FileCache;
  if (options.cache && cache.has(resolvedPath)) {
    return cache.get(resolvedPath);
  }
  const blob = await promises.readFile(resolvedPath, "utf8");
  const jsonc = await import('jsonc-parser');
  const parsed = jsonc.parse(blob);
  cache.set(resolvedPath, parsed);
  return parsed;
}
async function writeTSConfig(path, tsconfig) {
  await promises.writeFile(path, JSON.stringify(tsconfig, void 0, 2));
}
async function resolvePackageJSON(id = process.cwd(), options = {}) {
  const resolvedPath = isAbsolute(id) ? id : await resolvePath(id, options);
  return findNearestFile("package.json", {
    startingFrom: resolvedPath,
    ...options
  });
}
async function resolveTSConfig(id = process.cwd(), options = {}) {
  const resolvedPath = isAbsolute(id) ? id : await resolvePath(id, options);
  return findNearestFile("tsconfig.json", {
    startingFrom: resolvedPath,
    ...options
  });
}
const lockFiles = [
  "yarn.lock",
  "package-lock.json",
  "pnpm-lock.yaml",
  "npm-shrinkwrap.json",
  "bun.lockb"
];
async function resolveLockfile(id = process.cwd(), options = {}) {
  const resolvedPath = isAbsolute(id) ? id : await resolvePath(id, options);
  const _options = { startingFrom: resolvedPath, ...options };
  for (const lockFile of lockFiles) {
    try {
      return await findNearestFile(lockFile, _options);
    } catch {
    }
  }
  throw new Error("No lockfile found from " + id);
}
async function findWorkspaceDir(id = process.cwd(), options = {}) {
  const resolvedPath = isAbsolute(id) ? id : await resolvePath(id, options);
  const _options = { startingFrom: resolvedPath, ...options };
  try {
    const r = await findNearestFile(".git/config", _options);
    return resolve(r, "../..");
  } catch {
  }
  try {
    const r = await resolveLockfile(resolvedPath, {
      ..._options,
      reverse: true
    });
    return dirname(r);
  } catch {
  }
  try {
    const r = await findFile(resolvedPath, _options);
    return dirname(r);
  } catch {
  }
  throw new Error("Cannot detect workspace root from " + id);
}

export { definePackageJSON, defineTSConfig, findFarthestFile, findFile, findNearestFile, findWorkspaceDir, readPackageJSON, readTSConfig, resolveLockfile, resolvePackageJSON, resolveTSConfig, writePackageJSON, writeTSConfig };
