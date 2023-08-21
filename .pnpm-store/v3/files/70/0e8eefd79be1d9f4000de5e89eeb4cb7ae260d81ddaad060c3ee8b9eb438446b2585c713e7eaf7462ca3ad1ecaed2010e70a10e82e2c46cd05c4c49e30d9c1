var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.distribution');

require('../env.js');

suite.addBatch({
  'binomial pdf': {
    'topic': function() {
      return jStat;
    },
    //checked against R's dbinom(k, n, p)
    'check pdf calculation': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.binomial.pdf(10, 25, 0.5), 0.09741664);
      assert.epsilon(tol, jStat.binomial.pdf(50, 1000, 0.05), 0.05778798);
    },
    //Checked against r's pbinom(k, n, p)
    'check cdf calculation': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.binomial.cdf(10, 25, 0.5), 0.2121781);
      assert.epsilon(tol, jStat.binomial.cdf(50, 1000, 0.05), 0.537529);

      assert.ok(Number.isNaN(jStat.binomial.cdf(10, 12, -1)));
      assert.ok(Number.isNaN(jStat.binomial.cdf(10, 12, 2)));
      assert.equal(jStat.binomial.cdf(12, 10, 0.5), 1);
      assert.equal(jStat.binomial.cdf(12, -1, 0.5), 1);
      assert.epsilon(tol,
                     jStat.binomial.cdf(101073, 101184, 0.9988219676207195),
                     0.7857313651);
    }
  }
});

suite.export(module);
