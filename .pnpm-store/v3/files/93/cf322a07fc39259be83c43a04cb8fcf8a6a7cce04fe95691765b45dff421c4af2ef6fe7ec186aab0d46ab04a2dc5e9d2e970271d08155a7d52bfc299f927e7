var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.distribution');

require('../env.js');

suite.addBatch({
  'inverse gamma pdf': {
    'topic': function() {
      return jStat;
    },

    // Checked against R's densigamma(x, alpha, beta) from pscl package
    //    install.packages("pscl")
    //    library("pscl")
    //    densigamma(0.5, 1, 1)
    //    densigamma(0.25, 10, 2)
    //    densigamma(0.95, 18, 10)
    //    densigamma(-5, 2, 4) # Note: This incorrectly throws an error!
    'check pdf': function(jStat) {
      tol = 0.000001;
      assert.epsilon(tol, jStat.invgamma.pdf(0.5, 1, 1), 0.5413411329);
      assert.epsilon(tol, jStat.invgamma.pdf(0.25, 10, 2), 3.970461353);
      assert.epsilon(tol, jStat.invgamma.pdf(0.95, 18, 10), 0.1998306597);
      assert.epsilon(tol, jStat.invgamma.pdf(-5, 2, 4), 0);
    },

    //Checked against R's pigamma(q, shape, scale), which R calls alpha, beta
    //from the pscl package
    'check cdf': function(jStat) {
      tol = 0.000001;
      assert.epsilon(tol, jStat.invgamma.cdf(0.5, 1, 1), 0.1353353);
      assert.epsilon(tol, jStat.invgamma.cdf(0.25, 10, 2), 0.7166243);
      assert.epsilon(tol, jStat.invgamma.cdf(0.95, 18, 10), 0.9776673);
      assert.epsilon(tol, jStat.invgamma.cdf(-5, 5, 20), 0);
    },

    //Checked against R's qigamma(p, shape, rate = 1/scale)
    //from the pscl package
    'check inv': function(jStat) {
      tol = 0.00001;
      assert.epsilon(tol, jStat.invgamma.inv(0.135, 1, 1), 0.4993806);
      assert.epsilon(tol, jStat.invgamma.inv(0.716, 10, 2), 0.2498429);
    }
  },
});

suite.export(module);
