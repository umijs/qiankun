// Exports an Analyzer subclass

const regexpTree = require("regexp-tree");
const analyzer = require("./analyzer");

class HeuristicAnalyzer extends analyzer.Analyzer {
  constructor(analyzerOptions) {
    super(analyzerOptions);
  }

  isVulnerable(regExp) {
    // Heuristic #1: Star height > 1
    const starHeight = this._measureStarHeight(regExp);
    if (starHeight > 1) {
      return true;
    }

    // Heuristic #2: # repetitions > limit
    // TODO This is a poor heuristic
    const nRepetitions = this._measureRepetitions(regExp);
    if (nRepetitions > this.options.heuristic_replimit) {
      return true;
    }

    return false;
  }

  genAttackString(regExp) {
    return null;
  }

  _measureStarHeight(regExp) {
    let currentStarHeight = 0;
    let maxObservedStarHeight = 0;

    const ast = regexpTree.parse(regExp);

    regexpTree.traverse(ast, {
      Repetition: {
        pre({ node }) {
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

    return maxObservedStarHeight;
  }

  _measureRepetitions(regExp) {
    let nRepetitions = 0;

    const ast = regexpTree.parse(regExp);
    regexpTree.traverse(ast, {
      Repetition: {
        pre({ node }) {
          nRepetitions++;
        }
      }
    });

    return nRepetitions;
  }
}

module.exports = HeuristicAnalyzer;
