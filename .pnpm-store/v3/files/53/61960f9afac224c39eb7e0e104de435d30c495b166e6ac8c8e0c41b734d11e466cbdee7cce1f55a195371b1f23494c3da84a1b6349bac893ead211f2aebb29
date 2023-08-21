var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.distribution');

require('../env.js');

suite.addBatch({
  'arcsine pdf': {
    'topic': function() {
      return jStat;
    },
    'check pdf calculation': function(jStat) {
      // Checked against python scipy.stats.arcsine
      //>>> from scipy.stats import arcsine
      var tol = 0.0000001;
      //>>> arcsine.pdf(0, loc=0, scale=1)
      assert.epsilon(tol, jStat.arcsine.pdf(0, 0, 1), 0.0);
      //>>> arcsine.pdf(1, loc=0, scale=1)
      assert.epsilon(tol, jStat.arcsine.pdf(1, 0, 1), 0.0);
      //>>> arcsine.pdf(0.001, loc=0, scale=1)
      assert.epsilon(tol, jStat.arcsine.pdf(0.001, 0, 1), 10.070879119947094);
      //>>> arcsine.pdf(1 - 0.001, loc=0, scale=1)
      assert.epsilon(tol, jStat.arcsine.pdf(1 - 0.001, 0, 1), 10.07087911994709);
      //>>> arcsine.pdf(3, loc=2, scale=4)
      assert.epsilon(tol, jStat.arcsine.pdf(3, 2, 6), 0.1837762984739307);
      //>>> arcsine.pdf(4, loc=2, scale=4)
      assert.epsilon(tol, jStat.arcsine.pdf(4, 2, 6), 0.15915494309189535);
      //>>> arcsine.pdf(6, loc=2, scale=4)
      assert.epsilon(tol, jStat.arcsine.pdf(6, 2, 6), 0.0);
      //>>> arcsine.pdf(10, loc=2, scale=4)
      assert.epsilon(tol, jStat.arcsine.pdf(10, 2, 6), 0.0);
      //>>> arcsine.pdf(-10, loc=2, scale=4)
      assert.epsilon(tol, jStat.arcsine.pdf(-10, 2, 6), 0.0);
      //>>> arcsine.pdf(-2, loc=-2, scale=2)
      assert.epsilon(tol, jStat.arcsine.pdf(-2, -2, 0), 0.0);
      //>>> arcsine.pdf(-1, loc=-2, scale=2)
      assert.epsilon(tol, jStat.arcsine.pdf(-1, -2, 0), 0.31830988618379069);
      //>>> arcsine.pdf(0, loc=-2,scale=0)
      assert(isNaN(jStat.arcsine.pdf(0, -2, -2)));
      //>>> arcsine.pdf(0, loc=1,scale=0)
      assert(isNaN(jStat.arcsine.pdf(0, 1, 0)));
      //>>> arcsine.pdf(0, loc=2,scale=-2)
      assert(isNaN(jStat.arcsine.pdf(0, 2, 0)));
    },

    'check cdf calculation': function(jStat) {
      var tol = 0.0000001;
      //>>> arcsine.cdf(1, loc=0, scale=2)
      assert.epsilon(tol, jStat.arcsine.cdf(1, 0, 2), 0.50000000000000011);
      //>>> arcsine.cdf(2, loc=0, scale=2)
      assert.epsilon(tol, jStat.arcsine.cdf(2, 0, 2), 1.0);
      //>>> arcsine.cdf(0, loc=0, scale=2)
      assert.epsilon(tol, jStat.arcsine.cdf(0, 0, 2), 0.0);
      //>>> arcsine.cdf(0, loc=-1, scale=1)
      assert.epsilon(tol, jStat.arcsine.cdf(0, -1, 0), 1.0);
      //>>> arcsine.cdf(-3, loc=-1, scale=1)
      assert.epsilon(tol, jStat.arcsine.cdf(-3, -1, 0), 0.0);
      //>>> arcsine.cdf(3, loc=-1, scale=1)
      assert.epsilon(tol, jStat.arcsine.cdf(3, -1, 0), 1.0);
      //>>> arcsine.cdf(7, loc=5, scale=4)
      assert.epsilon(tol, jStat.arcsine.cdf(7, 5, 9), 0.50000000000000011);
      //>>> arcsine.cdf(8, loc=5, scale=4)
      assert.epsilon(tol, jStat.arcsine.cdf(8, 5, 9), 0.66666666666666663);
      //>>> arcsine.cdf(6, loc=5, scale=4)
      assert.epsilon(tol, jStat.arcsine.cdf(6, 5, 9), 0.33333333333333337);
      //>>> arcsine.cdf(5.1, loc=5, scale=4)
      assert.epsilon(tol, jStat.arcsine.cdf(5.1, 5, 9), 0.10108262410425969);
      //>>> arcsine.cdf(5.01, loc=5, scale=4)
      assert.epsilon(tol, jStat.arcsine.cdf(5.01, 5, 9), 0.031844266473320351);
    },

    'check variance calculation': function(jStat) {
      var tol = 0.0000001;
      //>>> arcsine.var(0, 1)
      assert.epsilon(tol, jStat.arcsine.variance(0, 1), 0.125);
      //>>> arcsine.var(0, 2)
      assert.epsilon(tol, jStat.arcsine.variance(0, 2), 0.5);
      //>>> arcsine.var(0, 10)
      assert.epsilon(tol, jStat.arcsine.variance(0, 10), 12.5);
      //>>> arcsine.var(2, 10)
      assert.epsilon(tol, jStat.arcsine.variance(2, 12), 12.5);
      //>>> arcsine.var(-10, 2)
      assert.epsilon(tol, jStat.arcsine.variance(-10, -8), 0.5);
      //>>> arcsine.var(-10, -2)
      assert(isNaN(jStat.arcsine.variance(-10, -12)));
      //>>> arcsine.var(2, 0)
      assert(isNaN(jStat.arcsine.variance(2, 2)));
    },

    'check median calculation': function(jStat) {
      var tol = 0.0000001;
      //>>> arcsine.median(0, -1)
      assert(isNaN(jStat.arcsine.median(0, -1)));
      //>>> arcsine.median(2, 4)
      assert.epsilon(tol, jStat.arcsine.median(2, 6), 3.9999999999999996);

    },

    'check mean calculation': function(jStat) {
      var tol = 0.0000001;
      //>>> arcsine.mean(0, -1)
      assert(isNaN(jStat.arcsine.mean(0, -1)));
      //>>> arcsine.mean(2, 4)
      assert.epsilon(tol, jStat.arcsine.mean(2, 6), 4.0);
    },

    'check inv calculation': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.arcsine.inv(0.50000000000000011, 0, 2), 1);
      assert.epsilon(tol, jStat.arcsine.inv(1.0, 0, 2), 2);
      assert.epsilon(tol, jStat.arcsine.inv(0.0, 0, 2), 0);
      assert.epsilon(tol, jStat.arcsine.inv(1.0, -1, 0), 0);

      assert.epsilon(tol, jStat.arcsine.inv(0.0, -1, 0), -1); // boundary
      assert.epsilon(tol, jStat.arcsine.inv(1.0, -1, 0), 0); // boundary

      assert.epsilon(tol, jStat.arcsine.inv(0.50000000000000011, 5, 9), 7);
      assert.epsilon(tol, jStat.arcsine.inv(0.66666666666666663, 5, 9), 8);
      assert.epsilon(tol, jStat.arcsine.inv(0.33333333333333337, 5, 9), 6);
      assert.epsilon(tol, jStat.arcsine.inv(0.10108262410425969, 5, 9), 5.1);
      assert.epsilon(tol, jStat.arcsine.inv(0.031844266473320351, 5, 9), 5.01);
    },

  },
});

suite.export(module);
