// Generic options
class AnalyzerOptions {
  constructor(heuristic_replimit) {
    this.heuristic_replimit = heuristic_replimit;
  }
}

class AttackString {
  constructor(prefixAndPumpList, suffix) {
    this.prefixAndPumpList = prefixAndPumpList;
    this.suffix = suffix;
  }
}

// Abstract class
class Analyzer {
  constructor(analyzerOptions) {
    this.options = analyzerOptions;
  }

  // Subclasser must implement
  // Return boolean
  isVulnerable(regExp) {
    return false;
  }

  // Subclass must implement
  // Returns an AttackString or null
  genAttackString(regExp) {
    return null;
  }
}

module.exports = function(re, replimit) {
  // Build an AST
  let myRegExp = null;
  let ast = null;
  try {
    // Construct a RegExp object
    if (re instanceof RegExp) {
      myRegExp = re;
    } else if (typeof re === "string") {
      myRegExp = new RegExp(re);
    } else {
      myRegExp = new RegExp(String(re));
    }

    // Build an AST
    ast = regexpTree.parse(myRegExp);
  } catch (err) {
    // Invalid or unparseable input
    return false;
  }

  let currentStarHeight = 0;
  let maxObservedStarHeight = 0;

  let repetitionCount = 0;

  regexpTree.traverse(ast, {
    Repetition: {
      pre({ node }) {
        repetitionCount++;

        currentStarHeight++;
        if (maxObservedStarHeight < currentStarHeight) {
          maxObservedStarHeight = currentStarHeight;
        }
      },

      post({ node }) {
        currentStarHeight--;
      }
    }
  });

  return maxObservedStarHeight <= 1 && repetitionCount <= replimit;
};

module.exports = {
  "AnalyzerOptions": AnalyzerOptions,
  "Analyzer": Analyzer,
};
