var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.distribution');

require('../env.js');

suite.addBatch({
  'central F distribution': {
    'topic': function() {
      return jStat;
    },
    //Check against R's df(x, df1, df2)
    'check pdf calculation': function(jStat) {
      var tol = 0.0000001;

      var zeroth = jStat.centralF.pdf(0.2, 1, 3);
      assert.epsilon(tol, zeroth, 0.722349);

      var first = jStat.centralF.pdf(1, 100, 100);
      assert.epsilon(tol, first, 1.989731);

      var second = jStat.centralF.pdf(2.5, 50, 200);
      assert.epsilon(tol, second, 0.00003610325);

      var third = jStat.centralF.pdf(0.8, 2, 10);
      assert.epsilon(tol, third, 0.4104423);

      var fourth = jStat.centralF.pdf(0.4, 3, 10);
      assert.epsilon(tol, fourth, 0.6733766);

      var first_at_zero = jStat.centralF.pdf(0.0, 3, 5);
      assert.epsilon(tol, first_at_zero, 0);

      var second_at_zero = jStat.centralF.pdf(0.0, 2, 1);
      assert.epsilon(tol, second_at_zero, 1);

      var third_at_zero = jStat.centralF.pdf(0.0, 1, 1);
      assert.strictEqual(third_at_zero, Infinity);

      // When x < 0 return 0
      //   df(-3, 4, 11)
      assert.epsilon(tol, jStat.centralF.pdf(-3, 4, 11), 0);

      // When x = 0, and df1 = 2, return 1
      //   df(0, 2, 15)
      assert.epsilon(tol, jStat.centralF.pdf(0, 2, 15), 1);

      // When x = 0, and df1 < 2, return Infinity
      //   df(0, 1, 20)
      assert.equal(jStat.centralF.pdf(0, 1, 20), Infinity);

      assert.epsilon(tol, jStat.centralF.pdf(5, 1, 200), 0.0148982);

      assert.epsilon(tol, jStat.centralF.pdf(4.099, 2, 140), 0.01759074);

      assert.epsilon(tol, jStat.centralF.pdf(10, 300, 10), 8.304129e-05);
    },
    // Check against R's pf(q, df1, df2, ncp, lower.tail = TRUE, log.p = FALSE):
    //    options(digits=10)
    //    pf(0.2, 1, 3)
    //    pf(1, 100, 100)
    //    pf(2.5, 50, 200)
    //    pf(0.8, 2, 10)
    //    pf(0.4, 3, 10)
    //    pf(0, 3, 5)
    //    pf(0, 2, 1)
    //    pf(0, 1, 1)
    //    pf(-5, 5, 20)
    'check cdf calculation': function(jStat) {
      var tol = 0.0000001;
      // Check with x within support (x > 0)
      assert.epsilon(tol, jStat.centralF.cdf(0.2, 1, 3), 0.3149623575);
      assert.epsilon(tol, jStat.centralF.cdf(1, 100, 100), 0.5);
      assert.epsilon(tol, jStat.centralF.cdf(2.5, 50, 200), 0.9999962786);
      assert.epsilon(tol, jStat.centralF.cdf(0.8, 2, 10), 0.5238869846);
      assert.epsilon(tol, jStat.centralF.cdf(0.4, 3, 10), 0.2439174275);
      // Check with x at edge of support (x = 0)
      assert.epsilon(tol, jStat.centralF.cdf(0.0, 3, 5), 0);
      assert.epsilon(tol, jStat.centralF.cdf(0.0, 2, 1), 0);
      assert.epsilon(tol, jStat.centralF.cdf(0.0, 1, 1), 0);
      // Check with x outside of support (x < 0)
      assert.epsilon(tol, jStat.centralF.cdf(-5, 5, 20), 0);
    }
  }
});

suite.export(module);
