const analyzer = require('./lib/analyzer');
const analyzerFamily = require('./lib/analyzer-family');

const DEFAULT_SAFE_REP_LIMIT = 25;
const RET_IS_SAFE = true;
const RET_IS_VULNERABLE = false;

class Args {
  constructor(regExp, analyzerOptions) {
    this.regExp = regExp;
    this.analyzerOptions = analyzerOptions;
  }
}

function safeRegex(re, opts) {
  try {
    const args = buildArgs(re, opts);
    const analyzerResponses = askAnalyzersIfVulnerable(args);

    // Did any analyzer say true?
    if (analyzerResponses.find((isVulnerable) => isVulnerable)) {
      return RET_IS_VULNERABLE;
    } else {
      return RET_IS_SAFE;
    }
  } catch (err) {
    // Invalid or unparseable input
    return false;
  }
}

function buildArgs(re, opts) {
  // Build AnalyzerOptions
  if (!opts) opts = {};
  const heuristic_replimit = opts.limit === undefined ? DEFAULT_SAFE_REP_LIMIT : opts.limit;

  const analyzerOptions = new analyzer.AnalyzerOptions(heuristic_replimit);

  // Build RegExp
  let regExp = null;
  // Construct a RegExp object
  if (re instanceof RegExp) {
    regExp = re;
  } else if (typeof re === 'string') {
    regExp = new RegExp(re);
  } else {
    regExp = new RegExp(String(re));
  }

  return new Args(regExp, analyzerOptions);
}

function askAnalyzersIfVulnerable(args) {
  let analyzerSaysVulnerable = [];

  // Query the Analyzers
  let Analyzer;
  for (Analyzer of analyzerFamily) {
    try {
      const analyzer = new Analyzer(args.analyzerOptions);
      analyzerSaysVulnerable.push(analyzer.isVulnerable(args.regExp));
    } catch (err) {
      /* istanbul ignore next */ // No need to worry about code coverage here.
      analyzerSaysVulnerable.push(false);
    }
  }

  return analyzerSaysVulnerable;
}

// Export

module.exports = safeRegex;