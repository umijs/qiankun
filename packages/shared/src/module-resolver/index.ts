import type { MatchResult } from '../common';
import eq from 'semver/functions/eq';

type Dependency = {
  url: string;
  version: string;
  semver: string;
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

  const dependenciesString = microAppContainer.querySelector(dependencyMapSelector)?.innerHTML;
  if (dependenciesString) {
    const { dependencies }: DependencyMap = JSON.parse(dependenciesString);
    const normalizedDependencies = normalizeDependencies(dependencies);
    const urlDependency = normalizedDependencies.find((v) => v.url === url);

    if (urlDependency) {
      const mainDependencyMapString = mainAppContainer.querySelector(dependencyMapSelector)?.innerHTML;

      if (mainDependencyMapString) {
        const mainDependencyMap: DependencyMap = JSON.parse(mainDependencyMapString);
        return findDependency(urlDependency, normalizeDependencies(mainDependencyMap.dependencies));
      }
    }
  }

  return undefined;
}

function findDependency(
  dependency: NormalizedDependency,
  dependencies: NormalizedDependency[],
): MatchResult | undefined {
  const matched = dependencies.find((item) => item.name === dependency.name && eq(dependency.version, item.semver));
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
