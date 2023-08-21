"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var Range = require("semver/classes/range"), chalk = require("chalk");

function _interopDefault(e) {
  return e && e.__esModule ? e : {
    default: e
  };
}

var Range__default = _interopDefault(Range), chalk__default = _interopDefault(chalk);

const DEPENDENCY_TYPES = [ "dependencies", "devDependencies", "peerDependencies", "optionalDependencies" ], getAllDependencies = config => {
  const allDependencies = new Map;
  for (const type of DEPENDENCY_TYPES) {
    const deps = config[type];
    if (deps) for (const name of Object.keys(deps)) {
      const depRange = deps[name];
      (depRange.startsWith("link:") || depRange.startsWith("file:")) && "devDependencies" === type || allDependencies.set(name, depRange);
    }
  }
  return allDependencies;
}, isProtocolRange = range => -1 !== range.indexOf(":"), getValidRange = potentialRange => {
  if (isProtocolRange(potentialRange)) return null;
  try {
    return new Range__default.default(potentialRange);
  } catch (_unused) {
    return null;
  }
};

function getDependencyGraph(packages, opts) {
  const graph = new Map;
  let valid = !0;
  const packagesByName = {
    [packages.root.packageJson.name]: packages.root
  }, queue = [ packages.root ];
  for (const pkg of packages.packages) queue.push(pkg), packagesByName[pkg.packageJson.name] = pkg;
  for (const pkg of queue) {
    const {name: name} = pkg.packageJson, dependencies = [], allDependencies = getAllDependencies(pkg.packageJson);
    for (let [depName, depRange] of allDependencies) {
      const match = packagesByName[depName];
      if (!match) continue;
      const expected = match.packageJson.version;
      if (depRange.startsWith("workspace:")) {
        if (depRange = depRange.replace(/^workspace:/, ""), "*" === depRange || "^" === depRange || "~" === depRange) {
          dependencies.push(depName);
          continue;
        }
      } else if (!0 === (null == opts ? void 0 : opts.bumpVersionsWithWorkspaceProtocolOnly)) continue;
      const range = getValidRange(depRange);
      range && !range.test(expected) || isProtocolRange(depRange) ? (valid = !1, console.error(`Package ${chalk__default.default.cyan(`"${name}"`)} must depend on the current version of ${chalk__default.default.cyan(`"${depName}"`)}: ${chalk__default.default.green(`"${expected}"`)} vs ${chalk__default.default.red(`"${depRange}"`)}`)) : range && dependencies.push(depName);
    }
    graph.set(name, {
      pkg: pkg,
      dependencies: dependencies
    });
  }
  return {
    graph: graph,
    valid: valid
  };
}

function getDependentsGraph(packages, opts) {
  const graph = new Map, {graph: dependencyGraph} = getDependencyGraph(packages, {
    bumpVersionsWithWorkspaceProtocolOnly: !0 === (null == opts ? void 0 : opts.bumpVersionsWithWorkspaceProtocolOnly)
  }), dependentsLookup = {};
  packages.packages.forEach((pkg => {
    dependentsLookup[pkg.packageJson.name] = {
      pkg: pkg,
      dependents: []
    };
  })), packages.packages.forEach((pkg => {
    const dependent = pkg.packageJson.name, valFromDependencyGraph = dependencyGraph.get(dependent);
    if (valFromDependencyGraph) {
      valFromDependencyGraph.dependencies.forEach((dependency => {
        dependentsLookup[dependency].dependents.push(dependent);
      }));
    }
  })), Object.keys(dependentsLookup).forEach((key => {
    graph.set(key, dependentsLookup[key]);
  }));
  const simplifiedDependentsGraph = new Map;
  return graph.forEach(((pkgInfo, pkgName) => {
    simplifiedDependentsGraph.set(pkgName, pkgInfo.dependents);
  })), simplifiedDependentsGraph;
}

exports.getDependentsGraph = getDependentsGraph;
