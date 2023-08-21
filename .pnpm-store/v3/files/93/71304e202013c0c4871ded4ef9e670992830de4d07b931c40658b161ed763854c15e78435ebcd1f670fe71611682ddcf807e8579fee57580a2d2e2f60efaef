var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.gammap');

require('../env.js');

suite.addBatch({
  'gammap': {
    'topic': function() {
      return jStat;
    },

    // Checked against Mathematica Gamma[a, 0, x]
    // Also checked against R's gammainc(x, a) via the pracma library
    // gammainc() outputs three values, this matches 'lowinc'
    'check gammap': function(jStat) {
      var tol = 0.000001;
      assert.epsilon(tol, jStat.gammap(5, 5), 13.4281611);
      assert.epsilon(tol, jStat.gammap(5, 4), 8.90791355);
      assert.epsilon(tol, jStat.gammap(5, 7), 19.8482014);
    }
  }
});

suite.export(module);
