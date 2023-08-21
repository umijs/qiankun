var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat');

require('../env.js');

suite.addBatch({
  'diagonal': {
    'topic': function() {
      return jStat;
    },
    'example1': function(jStat) {
      var A = jStat.diagonal(jStat.arange(3));
      var tol = 0.000001;
      assert.epsilon(tol, A[0][0], 0);
      assert.epsilon(tol, A[0][1], 0);
      assert.epsilon(tol, A[0][2], 0);
      assert.epsilon(tol, A[1][0], 0);
      assert.epsilon(tol, A[1][1], 1);
      assert.epsilon(tol, A[1][2], 0);
      assert.epsilon(tol, A[2][0], 0);
      assert.epsilon(tol, A[2][1], 0);
      assert.epsilon(tol, A[2][2], 2);
    }
  }
});

suite.export(module);
