import satisfies from 'semver/functions/satisfies';
import type { MatchResult } from './types';

declare global {
  interface HTMLElement {
    __cached_deps__?: string[];
  }
}

type Dependency = {
  url: string;
  version: string;
  range: string;
  peerDeps?: string[];
};

type NormalizedDependency = {
  name: string;
} & Dependency;

type DependencyMap = {
  dependencies: Record<string, Dependency>;
};

export type { MatchResult } from './types';

export function moduleResolver(
  url: string,
  microAppContainer: HTMLElement,
  mainAppContainer: HTMLElement,
): MatchResult | undefined {
  const dependencyMapSelector = 'script[type=dependencymap]';

  const microAppDependenciesString = microAppContainer.querySelector(dependencyMapSelector)?.innerHTML;
  if (microAppDependenciesString) {
    const { dependencies } = JSON.parse(microAppDependenciesString) as DependencyMap;
    const normalizedDependencies = normalizeDependencies(dependencies);
    const microAppDependency = normalizedDependencies.find((v) => v.url === url);

    if (microAppDependency) {
      const mainAppDependencyMapString = mainAppContainer.querySelector(dependencyMapSelector)?.innerHTML;

      if (mainAppDependencyMapString) {
        const mainAppDependencyMap = JSON.parse(mainAppDependencyMapString) as DependencyMap;
        const cachedDeps = (microAppContainer.__cached_deps__ ??= []);
        const matchedDep = findDependency(
          microAppDependency,
          normalizeDependencies(mainAppDependencyMap.dependencies),
          cachedDeps,
        );

        if (matchedDep) {
          cachedDeps.push(matchedDep.name);
          return matchedDep;
        }
      }
    }
  }

  return undefined;
}

function findDependency(
  dependency: NormalizedDependency,
  mainAppDependencies: NormalizedDependency[],
  cachedDependencies: string[],
): MatchResult | undefined {
  const matched = mainAppDependencies.find(
    (cachedDependency) =>
      cachedDependency.name === dependency.name &&
      satisfies(cachedDependency.version, dependency.range) &&
      // peer dependencies must be cached before
      dependency.peerDeps?.every((peerDep) => cachedDependencies.indexOf(peerDep) !== -1),
  );

  if (matched) {
    return {
      name: matched.name,
      version: matched.version,
      url: matched.url,
    };
  }

  return undefined;
}

function normalizeDependencies(dependencies: DependencyMap['dependencies']): NormalizedDependency[] {
  return Object.keys(dependencies).map((name) => ({
    name,
    ...dependencies[name],
  }));
}
