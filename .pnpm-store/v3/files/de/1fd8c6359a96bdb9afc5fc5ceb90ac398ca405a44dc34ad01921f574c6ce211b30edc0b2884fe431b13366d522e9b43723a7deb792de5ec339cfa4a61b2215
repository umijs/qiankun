var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.distribution');

require('../env.js');

suite.addBatch({
  'uniform pdf': {
    'topic': function() {
      return jStat;
    },
    'check pdf calculation': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.uniform.pdf(10.5, 10, 11), 1.0);
      assert.epsilon(tol, jStat.uniform.pdf(6, 0, 10), 0.1);
    },
    'check cdf calculation': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.uniform.cdf(7, 0, 10), 0.7);
      assert.epsilon(tol, jStat.uniform.cdf(10.5, 10, 11), 0.5);
    },
    'check inv calculation': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.uniform.inv(0.5, 10, 11), 10.5);
      assert.epsilon(tol, jStat.uniform.inv(0.7, 0, 10), 7.0);
    }
  },
});

suite.export(module);
