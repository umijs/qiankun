import satisfies from 'semver/functions/satisfies';
import type { MatchResult } from './types';

type Dependency = {
  url: string;
  version: string;
  range: string;
};

type NormalizedDependency = {
  name: string;
} & Dependency;

type DependencyMap = {
  dependencies: Record<string, Dependency>;
};

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
      const mainDependencyMapString = mainAppContainer.querySelector(dependencyMapSelector)?.innerHTML;

      if (mainDependencyMapString) {
        const mainDependencyMap = JSON.parse(mainDependencyMapString) as DependencyMap;
        return findDependency(microAppDependency, normalizeDependencies(mainDependencyMap.dependencies));
      }
    }
  }

  return undefined;
}

function findDependency(
  dependency: NormalizedDependency,
  cachedDependencies: NormalizedDependency[],
): MatchResult | undefined {
  const matched = cachedDependencies.find(
    (cachedDependency) =>
      cachedDependency.name === dependency.name && satisfies(cachedDependency.version, dependency.range),
  );
  if (matched) {
    return {
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
export type { MatchResult } from './types';
