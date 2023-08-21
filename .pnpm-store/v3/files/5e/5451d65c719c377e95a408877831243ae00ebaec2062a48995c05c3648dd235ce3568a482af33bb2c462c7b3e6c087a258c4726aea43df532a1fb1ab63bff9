var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.lowRegGamma');

require('../env.js');

suite.addBatch({
  'lowRegGamma': {
    'topic': function() {
      return jStat;
    },

    // Checked against Mathematica Gamma[a, 0, x]
    // Also checked against R's gammainc(a, x) via the pracma library
    // gammainc() outputs three values, this matches 'reginc'.
    // Note that R and jStat swap the operators; so
    // gammainc(a, x) == jStat.lowRegGamma(x, a)
    'check lowRegGamma': function(jStat) {
      var tol = 0.000001;
      assert.epsilon(tol, jStat.lowRegGamma(5, 5), 0.5595067);
      assert.epsilon(tol, jStat.lowRegGamma(4, 5), 0.7349741);
      assert.epsilon(tol, jStat.lowRegGamma(11, 10), 0.4169602);
    }
  }
});

suite.export(module);

