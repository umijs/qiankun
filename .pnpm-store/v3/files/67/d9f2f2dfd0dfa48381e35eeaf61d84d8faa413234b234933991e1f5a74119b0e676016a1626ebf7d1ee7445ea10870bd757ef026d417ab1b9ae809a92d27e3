var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.distribution');

require('../env.js');

suite.addBatch({
  'triangular pdf': {
    'topic': function() {
      return jStat;
    },
    // checked against R's dtriang(x, min, mode, max, log=FALSE) from package 'mc2d':
    //   install.packages("mc2d")
    //   library("mc2d")
    //   dtriang(c(0.5, 1, 2.5, 5, 6.5, 11, 20), 1, 5, 11)
    //   dtriang(c(-20, -5, -2.5, 5, 10), -5, -5, 5)
    //   dtriang(c(-10, 0, 4, 8, 12), 0, 8, 8)
    //   dtriang(c(0, 7, 12), 5, 4, 10)
    //   dtriang(c(17, 30, 88), 23, 50, 47)
    //   dtriang(c(-17, -10, 0), -10, -10, -10)

    'check pdf calculation, when a < c < b': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.triangular.pdf(0.5, 1, 11, 5), 0);      // x < a
      assert.epsilon(tol, jStat.triangular.pdf(1, 1, 11, 5), 0);        // x = a
      assert.epsilon(tol, jStat.triangular.pdf(2.5, 1, 11, 5), 0.075);  // a < x < c
      assert.epsilon(tol, jStat.triangular.pdf(5, 1, 11, 5), 0.2);      // x = c
      assert.epsilon(tol, jStat.triangular.pdf(6.5, 1, 11, 5), 0.15);   // c < x < b
      assert.epsilon(tol, jStat.triangular.pdf(11, 1, 11, 5), 0);       // x = b
      assert.epsilon(tol, jStat.triangular.pdf(20, 1, 11, 5), 0);       // b < x
    },
    'check pdf calculation, when a = c < b': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.triangular.pdf(-20, -5, 5, -5), 0);     // x < a
      assert.epsilon(tol, jStat.triangular.pdf(-5, -5, 5, -5), 0.2);    // x = a = c
      assert.epsilon(tol, jStat.triangular.pdf(-2.5, -5, 5, -5), 0.15); // a = c < x < b
      assert.epsilon(tol, jStat.triangular.pdf(5, -5, 5, -5), 0);       // x = b
      assert.epsilon(tol, jStat.triangular.pdf(10, -5, 5, -5), 0);      // b < x
    },
    'check pdf calculation, when a < c = b': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.triangular.pdf(-10, 0, 8, 8), 0);       // x < a
      assert.epsilon(tol, jStat.triangular.pdf(0, 0, 8, 8), 0);         // x = a < c = b
      assert.epsilon(tol, jStat.triangular.pdf(4, 0, 8, 8), 0.125);     // a = c < x < b
      assert.epsilon(tol, jStat.triangular.pdf(8, 0, 8, 8), 0.25);      // x = c = b
      assert.epsilon(tol, jStat.triangular.pdf(12, 0, 8, 8), 0);        // b < x
    },
    'check pdf calculation, when c < a': function(jStat) {
      var tol = 0.0000001;
      assert.isNaN(jStat.triangular.pdf(0, 5, 10, 4));                  // x < a
      assert.isNaN(jStat.triangular.pdf(7, 5, 10, 4));                  // a < x < b
      assert.isNaN(jStat.triangular.pdf(12, 5, 10, 4));                 // b < x
    },
    'check pdf calculation, when b < c': function(jStat) {
      var tol = 0.0000001;
      assert.isNaN(jStat.triangular.pdf(17, 23, 47, 50));               // x < a
      assert.isNaN(jStat.triangular.pdf(30, 23, 47, 50));               // a < x < b
      assert.isNaN(jStat.triangular.pdf(88, 23, 47, 50));               // b < x
    },
    'check pdf calculation, when a = b': function(jStat) {
      var tol = 0.0000001;
      assert.isNaN(jStat.triangular.pdf(-17, -10, -10, -10));           // x < a
      assert.isNaN(jStat.triangular.pdf(-10, -10, -10, -10));           // a = x = b
      assert.isNaN(jStat.triangular.pdf(0, -10, -10, -10));             // b < x
    }
  },
  'triangular cdf': {
    'topic': function() {
      return jStat;
    },
    // checked against R's ptriang(q, min=-1, mode=0, max=1, lower.tail=TRUE, log.p=FALSE) from package 'mc2d':
    //   install.packages("mc2d")
    //   library("mc2d")
    //   options(digits=10)
    //   ptriang(c(0, 1, 3, 5, 7, 11, 13), 1, 5, 11)
    //   ptriang(c(-10, -5, 0, 5, 10), -5, -5, 5)
    //   ptriang(c(-1, 0, 4, 8, 10), 0, 8, 8)
    //   ptriang(6, 5, 4, 10)
    //   ptriang(30, 23, 50, 47)
    //   ptriang(-10, -10, -10, -10) # NOTE: This returns: [1] 1, but we don't allow a = b = c!
    'check cdf calculation, when a < c < b': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.triangular.cdf(0, 1, 11, 5), 0);
      assert.epsilon(tol, jStat.triangular.cdf(1, 1, 11, 5), 0);
      assert.epsilon(tol, jStat.triangular.cdf(3, 1, 11, 5), 0.1);
      assert.epsilon(tol, jStat.triangular.cdf(5, 1, 11, 5), 0.4);
      assert.epsilon(tol, jStat.triangular.cdf(7, 1, 11, 5), 0.7333333333);
      assert.epsilon(tol, jStat.triangular.cdf(11, 1, 11, 5), 1);
      assert.epsilon(tol, jStat.triangular.cdf(13, 1, 11, 5), 1);
    },
    'check cdf calculation, when a = c < b': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.triangular.cdf(-10, -5, 5, -5), 0);
      assert.epsilon(tol, jStat.triangular.cdf(-5, -5, 5, -5), 0);
      assert.epsilon(tol, jStat.triangular.cdf(0, -5, 5, -5), 0.75);
      assert.epsilon(tol, jStat.triangular.cdf(5, -5, 5, -5), 1);
      assert.epsilon(tol, jStat.triangular.cdf(10, -5, 5, -5), 1);
    },
    'check cdf calculation, when a < c = b': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.triangular.cdf(-1, 0, 8, 8), 0);
      assert.epsilon(tol, jStat.triangular.cdf(0, 0, 8, 8), 0);
      assert.epsilon(tol, jStat.triangular.cdf(4, 0, 8, 8), 0.25);
      assert.epsilon(tol, jStat.triangular.cdf(8, 0, 8, 8), 1);
      assert.epsilon(tol, jStat.triangular.cdf(10, 0, 8, 8), 1);
    },
    'check cdf calculation, when c < a': function(jStat) {
      var tol = 0.0000001;
      assert.isNaN(jStat.triangular.cdf(6, 5, 10, 4));
    },
    'check cdf calculation, when b < c': function(jStat) {
      var tol = 0.0000001;
      assert.isNaN(jStat.triangular.cdf(30, 23, 47, 50));
    },
    'check cdf calculation, when a = b': function(jStat) {
      var tol = 0.0000001;
      assert.isNaN(jStat.triangular.cdf(-10, -10, -10, -10));
    }
  },
  'triangular inv': {
    'topic': function() {
      return jStat;
    },
    // checked against R's qtriang(p, min=-1, mode=0, max=1, lower.tail=TRUE, log.p=FALSE) from package 'mc2d':
    //   install.packages("mc2d")
    //   library("mc2d")
    //   options(digits=10)
    //   qtriang(c(0, 0.25, 0.5, 0.75, 1), 1, 5, 11)
    //   qtriang(c(0, 0.5, 1), -5, -5, 5)
    //   qtriang(c(0, 0.5, 1), 0, 8, 8)
    //   qtriang(c(0, 0.5, 1), 5, 4, 10)
    //   qtriang(c(0, 0.5, 1), 23, 50, 47)
    //   qtriang(c(0, 0.5, 1), -10, -10, -10) # NOTE: This returns: [1] 1 1 1, but we don't allow a = b = c!
    'check inv calculation, when a < c < b': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.triangular.inv(0, 1, 11, 5), 1);
      assert.epsilon(tol, jStat.triangular.inv(0.25, 1, 11, 5), 4.162277660);
      assert.epsilon(tol, jStat.triangular.inv(0.5, 1, 11, 5), 5.522774425);
      assert.epsilon(tol, jStat.triangular.inv(0.75, 1, 11, 5), 7.127016654);
      assert.epsilon(tol, jStat.triangular.inv(1, 1, 11, 5), 11);
    },
    'check inv calculation, when a = c < b': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.triangular.inv(0, -5, 5, -5), -5);
      assert.epsilon(tol, jStat.triangular.inv(0.5, -5, 5, -5), -2.071067812);
      assert.epsilon(tol, jStat.triangular.inv(1, -5, 5, -5), 5);
    },
    'check inv calculation, when a < c = b': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.triangular.inv(0, 0, 8, 8), 0);
      assert.epsilon(tol, jStat.triangular.inv(0.5, 0, 8, 8), 5.656854249);
      assert.epsilon(tol, jStat.triangular.inv(1, 0, 8, 8), 8);
    },
    'check inv calculation, when c < a': function(jStat) {
      var tol = 0.0000001;
      assert.isNaN(jStat.triangular.inv(0, 5, 10, 4));
      assert.isNaN(jStat.triangular.inv(0.5, 5, 10, 4));
      assert.isNaN(jStat.triangular.inv(1, 5, 10, 4));
    },
    'check inv calculation, when b < c': function(jStat) {
      var tol = 0.0000001;
      assert.isNaN(jStat.triangular.inv(0, 23, 47, 50));
      assert.isNaN(jStat.triangular.inv(0.5, 23, 47, 50));
      assert.isNaN(jStat.triangular.inv(1, 23, 47, 50));
    },
    'check inv calculation, when a = b': function(jStat) {
      var tol = 0.0000001;
      assert.isNaN(jStat.triangular.inv(0, -10, -10, -10));
      assert.isNaN(jStat.triangular.inv(0.5, -10, -10, -10));
      assert.isNaN(jStat.triangular.inv(1, -10, -10, -10));
    }
  }
});

suite.export(module);
