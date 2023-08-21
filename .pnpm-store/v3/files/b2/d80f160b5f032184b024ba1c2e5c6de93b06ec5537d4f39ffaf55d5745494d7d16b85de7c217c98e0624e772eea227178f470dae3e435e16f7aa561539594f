const CoverageProviderMap = {
  v8: "@vitest/coverage-v8",
  istanbul: "@vitest/coverage-istanbul"
};
async function resolveCoverageProviderModule(options, loader) {
  if (!(options == null ? void 0 : options.enabled) || !options.provider)
    return null;
  const provider = options.provider;
  if (provider === "v8" || provider === "istanbul") {
    const { default: coverageModule } = await loader.executeId(CoverageProviderMap[provider]);
    if (!coverageModule)
      throw new Error(`Failed to load ${CoverageProviderMap[provider]}. Default export is missing.`);
    return coverageModule;
  }
  let customProviderModule;
  try {
    customProviderModule = await loader.executeId(options.customProviderModule);
  } catch (error) {
    throw new Error(`Failed to load custom CoverageProviderModule from ${options.customProviderModule}`, { cause: error });
  }
  if (customProviderModule.default == null)
    throw new Error(`Custom CoverageProviderModule loaded from ${options.customProviderModule} was not the default export`);
  return customProviderModule.default;
}
async function getCoverageProvider(options, loader) {
  const coverageModule = await resolveCoverageProviderModule(options, loader);
  if (coverageModule)
    return coverageModule.getProvider();
  return null;
}
async function startCoverageInsideWorker(options, loader) {
  var _a;
  const coverageModule = await resolveCoverageProviderModule(options, loader);
  if (coverageModule)
    return (_a = coverageModule.startCoverage) == null ? void 0 : _a.call(coverageModule);
  return null;
}
async function takeCoverageInsideWorker(options, loader) {
  var _a;
  const coverageModule = await resolveCoverageProviderModule(options, loader);
  if (coverageModule)
    return (_a = coverageModule.takeCoverage) == null ? void 0 : _a.call(coverageModule);
  return null;
}
async function stopCoverageInsideWorker(options, loader) {
  var _a;
  const coverageModule = await resolveCoverageProviderModule(options, loader);
  if (coverageModule)
    return (_a = coverageModule.stopCoverage) == null ? void 0 : _a.call(coverageModule);
  return null;
}

export { CoverageProviderMap as C, stopCoverageInsideWorker as a, getCoverageProvider as g, startCoverageInsideWorker as s, takeCoverageInsideWorker as t };
