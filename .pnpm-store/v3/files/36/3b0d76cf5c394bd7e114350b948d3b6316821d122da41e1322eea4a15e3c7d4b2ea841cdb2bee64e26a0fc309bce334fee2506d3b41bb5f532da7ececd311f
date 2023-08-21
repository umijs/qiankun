var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.distribution');

require('../env.js');

suite.addBatch({
  'hypergeometric pdf': {
    'topic': function() {
      return jStat;
    },
    'check pdf calculation': function(jStat) {
      var tol = 0.0000001;
      // How many 1s were obtained by sampling?
      var successes = [10, 16];
      // How big was the source population?
      var population = [100, 3589];
      // How many 1s were in it?
      var available = [20, 16];
      // How big a sample was taken?
      var draws = [15, 2290];
      // What was the probability of exactly this many 1s?
      // Obtained from the calculator at
      // <http://www.geneprof.org/GeneProf/tools/hypergeometric.jsp>
      var answers = [0.000017532028090435493, 0.0007404996809672229];

      for (var i = 0; i < answers.length; i++) {
        // See if we get the right answer for each calculation.
        var calculated = jStat.hypgeom.pdf(successes[i],
                                           population[i],
                                           available[i],
                                           draws[i]);
        // None of the answers should be NaN
        assert(!isNaN(calculated));
        // And they should all match
        assert.epsilon(tol, calculated, answers[i]);
      }
    }
  }
});

suite.export(module);
