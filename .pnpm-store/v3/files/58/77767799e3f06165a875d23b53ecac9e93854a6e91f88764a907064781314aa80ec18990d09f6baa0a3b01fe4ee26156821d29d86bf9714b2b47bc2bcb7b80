var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.distribution');

require('../env.js');

suite.addBatch({
  'beta pdf': {
    'topic': function() {
      return jStat;
    },
    'check pdf calculation': function(jStat) {
      // Non-log form of the Beta pdf
      function pdf(x, alpha, beta) {
        if (x > 1 || x < 0)
          return 0;
        return (Math.pow(x, alpha - 1) * Math.pow(1 - x, beta - 1)) /
            jStat.betafn(alpha, beta);
      }

      var tol = 0.0000001;
      var args = [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1];
      var arg;

      for (var i = 0; i < args.length; i++) {
        arg = args[i];
        assert.epsilon(tol, jStat.beta.pdf(arg, 0.1, 0.1), pdf(arg, 0.1, 0.1));
        assert.epsilon(tol, jStat.beta.pdf(arg, 1, 1), pdf(arg, 1, 1));
        assert.epsilon(tol, jStat.beta.pdf(arg, 10, 50), pdf(arg, 10, 50));

        // Show that the log form of the pdf performs better for
        // large parameter values.
        assert(!isNaN(jStat.beta.pdf(arg, 1000, 5000)),
               'New Beta pdf is NaN for large parameter values.');
        assert(isNaN(pdf(arg, 1000, 5000)),
               'Old Beta pdf is not NaN for large parameter values.');
      }

      assert.equal(jStat.beta.pdf(0, 1, 4), 4);
      assert.equal(jStat.beta.pdf(1, 4, 1), 4);
      assert.equal(jStat.beta.pdf(0.5, 200, 4000), 0);
    },
    // checked against R code:
    //   options(digits=10)
    //   # Using mode definition from: https://en.wikipedia.org/wiki/Beta_distribution
    //   beta.mode <- function (a, b) {(a-1)/(a+b-2)}
    //   beta.mode(2.05, 2)
    //   beta.mode(5, 10)
    //   beta.mode(3, 3)
    'check mode calculation': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.beta.mode(5, 10), 0.3076923077);
      assert.epsilon(tol, jStat.beta.mode(2.05, 2), 0.512195122);
      assert.epsilon(tol, jStat.beta.mode(3, 3), 0.5);
    },
    // checked against R's qbeta(p, shape1, shape2, ncp=0, lower.tail=TRUE, log.p=FALSE) from package 'stats':
    //   options(digits=10)
    //   qbeta(0.5, 5, 10)
    //   qbeta(0.5, 2.05, 2)
    //   qbeta(0.5, 3, 3)
    'check median calculation': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.beta.median(5, 10), 0.3257511553);
      assert.epsilon(tol, jStat.beta.median(2.05, 2), 0.5072797399);
      assert.epsilon(tol, jStat.beta.median(3, 3), 0.5);
    }
  }
});

suite.export(module);
