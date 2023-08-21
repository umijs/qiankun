import { readFileSync, writeFileSync } from 'node:fs';
import { relative } from 'pathe';

const THRESHOLD_KEYS = ["lines", "functions", "statements", "branches"];
class BaseCoverageProvider {
  /**
   * Check if current coverage is above configured thresholds and bump the thresholds if needed
   */
  updateThresholds({ configurationFile, coverageMap, thresholds, perFile }) {
    if (!configurationFile)
      throw new Error('Missing configurationFile. The "coverage.thresholdAutoUpdate" can only be enabled when configuration file is used.');
    const summaries = perFile ? coverageMap.files().map((file) => coverageMap.fileCoverageFor(file).toSummary()) : [coverageMap.getCoverageSummary()];
    const thresholdsToUpdate = [];
    for (const key of THRESHOLD_KEYS) {
      const threshold = thresholds[key] || 100;
      const actual = Math.min(...summaries.map((summary) => summary[key].pct));
      if (actual > threshold)
        thresholdsToUpdate.push([key, actual]);
    }
    if (thresholdsToUpdate.length === 0)
      return;
    const originalConfig = readFileSync(configurationFile, "utf8");
    let updatedConfig = originalConfig;
    for (const [threshold, newValue] of thresholdsToUpdate) {
      const previousThreshold = (thresholds[threshold] || 100).toString();
      const pattern = new RegExp(`(${threshold}\\s*:\\s*)${previousThreshold.replace(".", "\\.")}`);
      const matches = originalConfig.match(pattern);
      if (matches)
        updatedConfig = updatedConfig.replace(matches[0], matches[1] + newValue);
      else
        console.error(`Unable to update coverage threshold ${threshold}. No threshold found using pattern ${pattern}`);
    }
    if (updatedConfig !== originalConfig) {
      console.log("Updating thresholds to configuration file. You may want to push with updated coverage thresholds.");
      writeFileSync(configurationFile, updatedConfig, "utf-8");
    }
  }
  /**
   * Checked collected coverage against configured thresholds. Sets exit code to 1 when thresholds not reached.
   */
  checkThresholds({ coverageMap, thresholds, perFile }) {
    const summaries = perFile ? coverageMap.files().map((file) => ({
      file,
      summary: coverageMap.fileCoverageFor(file).toSummary()
    })) : [{
      file: null,
      summary: coverageMap.getCoverageSummary()
    }];
    for (const { summary, file } of summaries) {
      for (const thresholdKey of ["lines", "functions", "statements", "branches"]) {
        const threshold = thresholds[thresholdKey];
        if (threshold !== void 0) {
          const coverage = summary.data[thresholdKey].pct;
          if (coverage < threshold) {
            process.exitCode = 1;
            let errorMessage = `ERROR: Coverage for ${thresholdKey} (${coverage}%) does not meet`;
            if (!perFile)
              errorMessage += " global";
            errorMessage += ` threshold (${threshold}%)`;
            if (perFile && file)
              errorMessage += ` for ${relative("./", file).replace(/\\/g, "/")}`;
            console.error(errorMessage);
          }
        }
      }
    }
  }
  /**
   * Resolve reporters from various configuration options
   */
  resolveReporters(configReporters) {
    if (!Array.isArray(configReporters))
      return [[configReporters, {}]];
    const resolvedReporters = [];
    for (const reporter of configReporters) {
      if (Array.isArray(reporter)) {
        resolvedReporters.push([reporter[0], reporter[1] || {}]);
      } else {
        resolvedReporters.push([reporter, {}]);
      }
    }
    return resolvedReporters;
  }
}

export { BaseCoverageProvider };
