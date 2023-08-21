const { dirname, join } = require('path')
const { existsSync, readFileSync } = require('fs')
const fs = require('fs').promises
const { loadPackageJSON, isPackageListed } = require('./dist/shared.cjs')

function resolveModule(name, options) {
  try {
    return require.resolve(name, options)
  }
  catch (e) {
    return undefined
  }
}

function importModule(path) {
  const mod = require(path)
  if (mod.__esModule)
    return Promise.resolve(mod)
  else
    return Promise.resolve({ default: mod })
}

function isPackageExists(name, options) {
  return !!resolvePackage(name, options)
}

function getPackageJsonPath(name, options) {
  const entry = resolvePackage(name, options)
  if (!entry)
    return
  return searchPackageJSON(entry)
}

async function getPackageInfo(name, options) {
  const packageJsonPath = getPackageJsonPath(name, options)
  if (!packageJsonPath)
    return

  const pkg = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'))

  return {
    name,
    version: pkg.version,
    rootPath: dirname(packageJsonPath),
    packageJsonPath,
    packageJson: pkg,
  }
}

function getPackageInfoSync(name, options) {
  const packageJsonPath = getPackageJsonPath(name, options)
  if (!packageJsonPath)
    return

  const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8'))

  return {
    name,
    version: pkg.version,
    rootPath: dirname(packageJsonPath),
    packageJsonPath,
    packageJson: pkg,
  }
}

function resolvePackage(name, options = {}) {
  try {
    return require.resolve(`${name}/package.json`, options)
  }
  catch {
  }
  try {
    return require.resolve(name, options)
  }
  catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND')
      throw e
    return false
  }
}

function searchPackageJSON(dir) {
  let packageJsonPath
  while (true) {
    if (!dir)
      return
    const newDir = dirname(dir)
    if (newDir === dir)
      return
    dir = newDir
    packageJsonPath = join(dir, 'package.json')
    if (existsSync(packageJsonPath))
      break
  }

  return packageJsonPath
}

module.exports = {
  resolveModule,
  importModule,
  isPackageExists,
  getPackageInfo,
  getPackageInfoSync,
  loadPackageJSON,
  isPackageListed,
}

Object.defineProperty(module.exports, '__esModule', { value: true, enumerable: false })
