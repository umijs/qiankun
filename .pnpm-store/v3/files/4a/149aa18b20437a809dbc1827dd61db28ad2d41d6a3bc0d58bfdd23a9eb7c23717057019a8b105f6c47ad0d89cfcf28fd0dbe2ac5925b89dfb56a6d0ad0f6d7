var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat');

require('../env.js');

suite.addBatch({
  'outer': {
    'topic': function() {
      return jStat;
    },
    'example1': function(jStat) {
      var a = [1, 2, 3];
      var b = [4, 5, 6];
      var A = jStat.outer(a, b);
      var tol = 0.0001
      assert.epsilon(tol, A[0][0], 4);
      assert.epsilon(tol, A[0][1], 5);
      assert.epsilon(tol, A[0][2], 6);
      assert.epsilon(tol, A[1][0], 8);
      assert.epsilon(tol, A[1][1], 10);
      assert.epsilon(tol, A[1][2], 12);
      assert.epsilon(tol, A[2][0], 12);
      assert.epsilon(tol, A[2][1], 15);
      assert.epsilon(tol, A[2][2], 18);
    }
  }
});

suite.export(module);
