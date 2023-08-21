var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.distribution');

require('../env.js');

suite.addBatch({
  'chisquare pdf': {
    'topic': function() {
      return jStat;
    },
    //Checked against R dchisq(x,df)
    'check pdf calculation': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.chisquare.pdf(3.5, 10), 0.03395437);
    },
    // Checked against R dchisq(x,df)
    //   dchisq(0, 5)
    //   dchisq(0, 2)
    //   dchisq(0, 1)
    'check pdf calculation at x = 0.0': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.chisquare.pdf(0.0, 5), 0.0);
      assert.epsilon(tol, jStat.chisquare.pdf(0.0, 2), 0.5);
      assert.equal(jStat.chisquare.pdf(0.0, 1), Infinity);
    },
    'check pdf calculation at x < 0': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.chisquare.pdf(-10, 8), 0.0);
    },
    //Checked against R's pchisq(x, df)
    'check cdf calculation': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.chisquare.cdf(2.5, 8), 0.03826905);
    },
    // Checked against R's pchisq(q, df, ncp = 0, lower.tail = TRUE, log.p = FALSE):
    //    pchisq(-5, 21)
    'check cdf calculation when x outside support (x < 0)': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.chisquare.cdf(-5, 21), 0);
    },
    //Checked against R's qchisq(x, df)
    'check inv calculation': function(jStat) {
      var tol = 0.00001;
      assert.epsilon(tol, jStat.chisquare.inv(0.95, 10), 18.30704);
    },
    //Checked against R's qchisq(x, df)
    'check inv calculation again': function(jStat) {
      var tol = 0.00001;
      assert.epsilon(tol, jStat.chisquare.inv(0.85, 10), 14.53394);
    }
  },
});

suite.export(module);
