var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat');

require('../env.js');

suite.addBatch({
  'linearalgebra': {
    'topic': function() {
      return jStat;
    },
    'angle works for a vector': function(jStat) {
      var piOverFour = 0.7853981633974484;
      var tol = 0.00000001;
      var A = jStat([[0, 1]]);
      var B = [[2, 2]];
      assert.epsilon(tol, A.angle(B), piOverFour);
    }
  }
});

suite.export(module);
