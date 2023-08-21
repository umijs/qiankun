import Range from 'semver/classes/range';
import chalk from 'chalk';

// This is a modified version of the graph-getting in bolt
const DEPENDENCY_TYPES = ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"];

const getAllDependencies = config => {
  const allDependencies = new Map();

  for (const type of DEPENDENCY_TYPES) {
    const deps = config[type];
    if (!deps) continue;

    for (const name of Object.keys(deps)) {
      const depRange = deps[name];

      if ((depRange.startsWith("link:") || depRange.startsWith("file:")) && type === "devDependencies") {
        continue;
      }

      allDependencies.set(name, depRange);
    }
  }

  return allDependencies;
};

const isProtocolRange = range => range.indexOf(":") !== -1;

const getValidRange = potentialRange => {
  if (isProtocolRange(potentialRange)) {
    return null;
  }

  try {
    return new Range(potentialRange);
  } catch (_unused) {
    return null;
  }
};

function getDependencyGraph(packages, opts) {
  const graph = new Map();
  let valid = true;
  const packagesByName = {
    [packages.root.packageJson.name]: packages.root
  };
  const queue = [packages.root];

  for (const pkg of packages.packages) {
    queue.push(pkg);
    packagesByName[pkg.packageJson.name] = pkg;
  }

  for (const pkg of queue) {
    const {
      name
    } = pkg.packageJson;
    const dependencies = [];
    const allDependencies = getAllDependencies(pkg.packageJson);

    for (let [depName, depRange] of allDependencies) {
      const match = packagesByName[depName];
      if (!match) continue;
      const expected = match.packageJson.version;
      const usesWorkspaceRange = depRange.startsWith("workspace:");

      if (usesWorkspaceRange) {
        depRange = depRange.replace(/^workspace:/, "");

        if (depRange === "*" || depRange === "^" || depRange === "~") {
          dependencies.push(depName);
          continue;
        }
      } else if ((opts === null || opts === void 0 ? void 0 : opts.bumpVersionsWithWorkspaceProtocolOnly) === true) {
        continue;
      }

      const range = getValidRange(depRange);

      if (range && !range.test(expected) || isProtocolRange(depRange)) {
        valid = false;
        console.error(`Package ${chalk.cyan(`"${name}"`)} must depend on the current version of ${chalk.cyan(`"${depName}"`)}: ${chalk.green(`"${expected}"`)} vs ${chalk.red(`"${depRange}"`)}`);
        continue;
      } // `depRange` could have been a tag and if a tag has been used there might have been a reason for that
      // we should not count this as a local monorepro dependant


      if (!range) {
        continue;
      }

      dependencies.push(depName);
    }

    graph.set(name, {
      pkg,
      dependencies
    });
  }

  return {
    graph,
    valid
  };
}

function getDependentsGraph(packages, opts) {
  const graph = new Map();
  const {
    graph: dependencyGraph
  } = getDependencyGraph(packages, {
    bumpVersionsWithWorkspaceProtocolOnly: (opts === null || opts === void 0 ? void 0 : opts.bumpVersionsWithWorkspaceProtocolOnly) === true
  });
  const dependentsLookup = {};
  packages.packages.forEach(pkg => {
    dependentsLookup[pkg.packageJson.name] = {
      pkg,
      dependents: []
    };
  });
  packages.packages.forEach(pkg => {
    const dependent = pkg.packageJson.name;
    const valFromDependencyGraph = dependencyGraph.get(dependent);

    if (valFromDependencyGraph) {
      const dependencies = valFromDependencyGraph.dependencies;
      dependencies.forEach(dependency => {
        dependentsLookup[dependency].dependents.push(dependent);
      });
    }
  });
  Object.keys(dependentsLookup).forEach(key => {
    graph.set(key, dependentsLookup[key]);
  });
  const simplifiedDependentsGraph = new Map();
  graph.forEach((pkgInfo, pkgName) => {
    simplifiedDependentsGraph.set(pkgName, pkgInfo.dependents);
  });
  return simplifiedDependentsGraph;
}

export { getDependentsGraph };
