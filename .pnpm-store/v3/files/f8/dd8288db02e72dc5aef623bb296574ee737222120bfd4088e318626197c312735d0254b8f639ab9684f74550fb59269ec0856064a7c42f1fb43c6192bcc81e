var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.distribution');

require('../env.js');

suite.addBatch({
  'pareto pdf': {
    'topic': function() {
      return jStat;
    },
    // Checked against R's dpareto(x, df) in package VGAM
    //   install.packages("VGAM")
    //   library("VGAM")
    //   options(digits=10)
    //   dpareto(c(0, 1, 2), 1, 1)
    //   dpareto(c(-1, 1, 4), 1, 2)
    //   dpareto(c(1, 2, 10), 2, 2)
    'check pdf calculation': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.pareto.pdf(0, 1, 1), 0);
      assert.epsilon(tol, jStat.pareto.pdf(1, 1, 1), 1);
      assert.epsilon(tol, jStat.pareto.pdf(2, 1, 1), 0.25);

      assert.epsilon(tol, jStat.pareto.pdf(-1, 1, 2), 0);
      assert.epsilon(tol, jStat.pareto.pdf(1, 1, 2), 2);
      assert.epsilon(tol, jStat.pareto.pdf(4, 1, 2), 0.03125);

      assert.epsilon(tol, jStat.pareto.pdf(1, 2, 2), 0);
      assert.epsilon(tol, jStat.pareto.pdf(2, 2, 2), 1);
      assert.epsilon(tol, jStat.pareto.pdf(10, 2, 2), 0.008);
    }
  },
  'pareto inv': {
    'topic': function() {
      return jStat;
    },
    // Checked against R's qpareto(x, df) in package VGAM
    //   install.packages("VGAM")
    //   library("VGAM")
    //   options(digits=10)
    //   qpareto(c(0, 0.5, 1), 1, 1)
    //   qpareto(c(0, 0.5, 1), 1, 2)
    //   qpareto(c(0, 0.5, 1), 2, 2)
    'check inv calculation': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.pareto.inv(0, 1, 1), 1);
      assert.epsilon(tol, jStat.pareto.inv(0.5, 1, 1), 2);
      assert.equal(jStat.pareto.inv(1, 1, 1), Infinity);

      assert.epsilon(tol, jStat.pareto.inv(0, 1, 2), 1);
      assert.epsilon(tol, jStat.pareto.inv(0.5, 1, 2), 1.414213562);
      assert.equal(jStat.pareto.inv(1, 1, 2), Infinity);

      assert.epsilon(tol, jStat.pareto.inv(0, 2, 2), 2);
      assert.epsilon(tol, jStat.pareto.inv(0.5, 2, 2), 2.828427125);
      assert.equal(jStat.pareto.inv(1, 2, 2), Infinity);
    }
  },
  'pareto cdf': {
    'topic': function() {
      return jStat;
    },
    // Checked against R's ppareto(q, scale = 1, shape, lower.tail = TRUE, log.p = FALSE) in package VGAM
    //   install.packages("VGAM")
    //   library("VGAM")
    //   options(digits=10)
    //   ppareto(c(0, 1, 2), 1, 1)
    //   ppareto(c(-1, 1, 4), 1, 2)
    //   ppareto(c(1, 2, 10), 2, 2)
    'check cdf calculation': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.pareto.cdf(0, 1, 1), 0);
      assert.epsilon(tol, jStat.pareto.cdf(1, 1, 1), 0);
      assert.epsilon(tol, jStat.pareto.cdf(2, 1, 1), 0.5);

      assert.epsilon(tol, jStat.pareto.cdf(-1, 1, 2), 0);
      assert.epsilon(tol, jStat.pareto.cdf(1, 1, 2), 0);
      assert.epsilon(tol, jStat.pareto.cdf(4, 1, 2), 0.9375);

      assert.epsilon(tol, jStat.pareto.cdf(1, 2, 2), 0);
      assert.epsilon(tol, jStat.pareto.cdf(2, 2, 2), 0);
      assert.epsilon(tol, jStat.pareto.cdf(10, 2, 2), 0.96);
    }
  },
});

suite.export(module);
