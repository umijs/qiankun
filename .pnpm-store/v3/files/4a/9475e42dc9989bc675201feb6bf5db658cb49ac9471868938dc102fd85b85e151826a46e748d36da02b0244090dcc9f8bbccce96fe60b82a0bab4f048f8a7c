var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat');

require('../env.js');

suite.addBatch({
  'triaUpSolve': {
    'topic': function() {
      return jStat;
    },
    'array call': function(jStat) {
      var A = [[1, 2, 3], [0, 4, 5], [0, 0, 6]];
      var b = [8, 9, 10];
      var coef = jStat.triaUpSolve(A, b);
      var tol = 0.0001;
      assert.epsilon(tol, coef[0], 2.66666666);
      assert.epsilon(tol, coef[1], 0.16666666);
      assert.epsilon(tol, coef[2], 1.66666666);
    },
    'matrix call': function(jStat) {
      var A = [[1, 2, 3], [0, 4, 5], [0, 0, 6]];
      var b = [[8], [9], [10]];
      var coef = jStat.triaUpSolve(A, b);
      var tol = 0.0001;
      assert.epsilon(tol, coef[0][0], 2.66666666);
      assert.epsilon(tol, coef[1][0], 0.16666666);
      assert.epsilon(tol, coef[2][0], 1.66666666);
    }
  }
});

suite.export(module);
