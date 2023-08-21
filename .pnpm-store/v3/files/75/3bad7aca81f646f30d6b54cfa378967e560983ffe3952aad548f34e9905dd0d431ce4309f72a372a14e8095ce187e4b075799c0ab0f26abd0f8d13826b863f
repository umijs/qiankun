var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.distribution');

require('../env.js');

suite.addBatch({
  'kumaraswamy pdf': {
    'topic': function() {
      return jStat;
    },
    // Checked against R's dkumar(p, shape1, shape2, log=FALSE) in package VGAM
    //   install.packages("VGAM")
    //   library("VGAM")
    //   options(digits=10)
    //   dkumar(c(-5, 5), 2, 2)
    'check pdf calculation': function(jStat) {
      var tol = 0.0000001;
      // outside support
      assert.epsilon(tol, jStat.kumaraswamy.pdf(-5, 2, 2), 0);
      assert.epsilon(tol, jStat.kumaraswamy.pdf(5, 2, 2), 0);
    }
  },
  'kumaraswamy inv': {
    'topic': function() {
      return jStat;
    },
    // Checked against R's
    // qkumar(p, shape1, shape2, lower.tail=TRUE, log.p=FALSE) in package VGAM
    //   install.packages("VGAM")
    //   library("VGAM")
    //   options(digits=10)
    //   qkumar(c(0, 0.5, 1), 0.5, 0.5)
    //   qkumar(c(0, 0.5, 1), 0.8, 1)
    //   qkumar(c(0, 0.5, 1), 1, 0.4)
    //   qkumar(c(0, 0.5, 1), 0.6, 1.2)
    //   qkumar(c(0, 0.5, 1), 1, 1)
    //   qkumar(c(0, 0.5, 1), 2, 1)
    //   qkumar(c(0, 0.5, 1), 1.5, 1.5)
    //   qkumar(c(0, 0.5, 1), 7, 25)
    'check inv calculation': function(jStat) {
      var tol = 0.0000001;
      // 'U'-shaped distribution
      assert.epsilon(tol, jStat.kumaraswamy.inv(0, 0.5, 0.5), 0);
      assert.epsilon(tol, jStat.kumaraswamy.inv(0.5, 0.5, 0.5), 0.5625);
      assert.epsilon(tol, jStat.kumaraswamy.inv(1, 0.5, 0.5), 1);

      // 'L'-shaped distribution
      assert.epsilon(tol, jStat.kumaraswamy.inv(0, 0.8, 1), 0);
      assert.epsilon(tol, jStat.kumaraswamy.inv(0.5, 0.8, 1), 0.4204482076);
      assert.epsilon(tol, jStat.kumaraswamy.inv(1, 0.8, 1), 1);

      // reversed-'L'-shaped distribution
      assert.epsilon(tol, jStat.kumaraswamy.inv(0, 1, 0.4), 0);
      assert.epsilon(tol, jStat.kumaraswamy.inv(0.5, 1, 0.4), 0.8232233047);
      assert.epsilon(tol, jStat.kumaraswamy.inv(1, 1, 0.4), 1);

      // sideways-'S'-shaped distribution
      assert.epsilon(tol, jStat.kumaraswamy.inv(0, 0.6, 1.2), 0);
      assert.epsilon(tol, jStat.kumaraswamy.inv(0.5, 0.6, 1.2), 0.2533532737);
      assert.epsilon(tol, jStat.kumaraswamy.inv(1, 0.6, 1.2), 1);

      // flat distribution
      assert.epsilon(tol, jStat.kumaraswamy.inv(0, 1, 1), 0);
      assert.epsilon(tol, jStat.kumaraswamy.inv(0.5, 1, 1), 0.5);
      assert.epsilon(tol, jStat.kumaraswamy.inv(1, 1, 1), 1);

      // '/'-shaped distribution
      assert.epsilon(tol, jStat.kumaraswamy.inv(0, 2, 1), 0);
      assert.epsilon(tol, jStat.kumaraswamy.inv(0.5, 2, 1), 0.7071067812);
      assert.epsilon(tol, jStat.kumaraswamy.inv(1, 2, 1), 1);

      // inverted-'U'-shaped distribution
      assert.epsilon(tol, jStat.kumaraswamy.inv(0, 1.5, 1.5), 0);
      assert.epsilon(tol, jStat.kumaraswamy.inv(0.5, 1.5, 1.5), 0.5154248709);
      assert.epsilon(tol, jStat.kumaraswamy.inv(1, 1.5, 1.5), 1);

      // peaked distribution
      assert.epsilon(tol, jStat.kumaraswamy.inv(0, 7, 25), 0);
      assert.epsilon(tol, jStat.kumaraswamy.inv(0.5, 7, 25), 0.5979941923);
      assert.epsilon(tol, jStat.kumaraswamy.inv(1, 7, 25), 1);
    }
  },

  'kumaraswamy pdf': {
    'topic': function() {
      return jStat;
    },
    // Checked against R's dkumar(p, shape1, shape2, log=FALSE) in package VGAM
    //   install.packages("VGAM")
    //   library("VGAM")
    //   options(digits=10)
    //   dkumar(c(0, 0.5, 1), 0.5, 0.5)
    //   dkumar(c(0, 0.5, 1), 0.8, 1) # Note: Incorrectly returns NaN for x = 1!
    //   dkumar(c(0, 0.5, 1), 1, 0.4) # Note: Incorrectly returns NaN for x = 0!
    //   dkumar(c(0, 0.5, 1), 0.6, 1.2)
    //   dkumar(c(0, 0.5, 1), 1.3, 0.5)
    //   dkumar(c(0, 0.5, 1), 1, 1) # Note: Incorrectly returns NaN for x = 0 and x = 1!
    //   dkumar(c(0, 0.5, 1), 2, 1) # Note: Incorrectly returns NaN for x = 1!
    //   dkumar(c(0, 0.5, 1), 1, 1.5) # Note: Incorrectly returns NaN for x = 0!
    //   dkumar(c(0, 0.5, 1), 1.5, 1.5)
    //   dkumar(c(0, 0.5, 1), 7, 25)
    'check pdf calculation': function(jStat) {
      var tol = 0.0000001;
      // 'U'-shaped distribution
      assert.equal(jStat.kumaraswamy.pdf(0, 0.5, 0.5), Infinity);
      assert.epsilon(tol, jStat.kumaraswamy.pdf(0.5, 0.5, 0.5), 0.6532814824);
      assert.equal(jStat.kumaraswamy.pdf(1, 0.5, 0.5), Infinity);

      // 'L'-shaped distribution
      assert.equal(jStat.kumaraswamy.pdf(0, 0.8, 1), Infinity);
      assert.epsilon(tol, jStat.kumaraswamy.pdf(0.5, 0.8, 1), 0.918958684);
      assert.epsilon(tol, jStat.kumaraswamy.pdf(1, 0.8, 1), 0.8);

      // reversed-'L'-shaped distribution
      assert.epsilon(tol, jStat.kumaraswamy.pdf(0, 1, 0.4), 0.4);
      assert.epsilon(tol, jStat.kumaraswamy.pdf(0.5, 1, 0.4), 0.6062866266);
      assert.equal(jStat.kumaraswamy.pdf(1, 1, 0.4), Infinity);

      // sideways-'S'-shaped distribution
      assert.equal(jStat.kumaraswamy.pdf(0, 0.6, 1.2), Infinity);
      assert.epsilon(tol, jStat.kumaraswamy.pdf(0.5, 0.6, 1.2), 0.7657783992);
      assert.epsilon(tol, jStat.kumaraswamy.pdf(1, 0.6, 1.2), 0);

      // sideways-'Z'-shaped distribution
      assert.epsilon(tol, jStat.kumaraswamy.pdf(0, 1.3, 0.5), 0);
      assert.epsilon(tol, jStat.kumaraswamy.pdf(0.5, 1.3, 0.5), 0.6851052165);
      assert.equal(jStat.kumaraswamy.pdf(1, 1.3, 0.5), Infinity);

      // flat distribution
      assert.epsilon(tol, jStat.kumaraswamy.pdf(0, 1, 1), 1);
      assert.epsilon(tol, jStat.kumaraswamy.pdf(0.5, 1, 1), 1);
      assert.epsilon(tol, jStat.kumaraswamy.pdf(1, 1, 1), 1);

      // '/'-shaped distribution
      assert.epsilon(tol, jStat.kumaraswamy.pdf(0, 2, 1), 0);
      assert.epsilon(tol, jStat.kumaraswamy.pdf(0.5, 2, 1), 1);
      assert.epsilon(tol, jStat.kumaraswamy.pdf(1, 2, 1), 2);

      // '\'-shaped distribution
      assert.epsilon(tol, jStat.kumaraswamy.pdf(0, 1, 1.5), 1.5);
      assert.epsilon(tol, jStat.kumaraswamy.pdf(0.5, 1, 1.5), 1.060660172);
      assert.epsilon(tol, jStat.kumaraswamy.pdf(1, 1, 1.5), 0);

      // inverted-'U'-shaped distribution
      assert.epsilon(tol, jStat.kumaraswamy.pdf(0, 1.5, 1.5), 0);
      assert.epsilon(tol, jStat.kumaraswamy.pdf(0.5, 1.5, 1.5), 1.279186452);
      assert.epsilon(tol, jStat.kumaraswamy.pdf(1, 1.5, 1.5), 0);

      // peaked distribution
      assert.epsilon(tol, jStat.kumaraswamy.pdf(0, 7, 25), 0);
      assert.epsilon(tol, jStat.kumaraswamy.pdf(0.5, 7, 25), 2.265208101);
      assert.epsilon(tol, jStat.kumaraswamy.pdf(1, 7, 25), 0);
    }
  },
  'kumaraswamy cdf': {
    'topic': function() {
      return jStat;
    },
    // Checked against R's pkumar(q, shape1, shape2, lower.tail = TRUE, log.p = FALSE) in package VGAM
    //   install.packages("VGAM")
    //   library("VGAM")
    //   options(digits=10)
    //   pkumar(c(0, 0.5, 1), 0.5, 0.5)
    //   pkumar(c(0, 0.5, 1), 0.8, 1) # Note: Incorrectly returns NaN for x = 1!
    //   pkumar(c(0, 0.5, 1), 1, 0.4) # Note: Incorrectly returns NaN for x = 0!
    //   pkumar(c(0, 0.5, 1), 0.6, 1.2)
    //   pkumar(c(0, 0.5, 1), 1.3, 0.5)
    //   pkumar(c(0, 0.5, 1), 1, 1) # Note: Incorrectly returns NaN for x = 0 and x = 1!
    //   pkumar(c(0, 0.5, 1), 2, 1) # Note: Incorrectly returns NaN for x = 1!
    //   pkumar(c(0, 0.5, 1), 1, 1.5) # Note: Incorrectly returns NaN for x = 0!
    //   pkumar(c(0, 0.5, 1), 1.5, 1.5)
    //   pkumar(c(0, 0.5, 1), 7, 25)
	//	 pkumar(c(-5, 5), 2, 2)
	'check cdf calculation': function(jStat) {
      var tol = 0.0000001;
      // 'U'-shaped distribution
      assert.epsilon(tol, jStat.kumaraswamy.cdf(0, 0.5, 0.5), 0);
      assert.epsilon(tol, jStat.kumaraswamy.cdf(0.5, 0.5, 0.5), 0.4588038999);
      assert.epsilon(tol, jStat.kumaraswamy.cdf(1, 0.5, 0.5), 1);

      // 'L'-shaped distribution
      assert.epsilon(tol, jStat.kumaraswamy.cdf(0, 0.8, 1), 0);
      assert.epsilon(tol, jStat.kumaraswamy.cdf(0.5, 0.8, 1), 0.5743491775);
      assert.epsilon(tol, jStat.kumaraswamy.cdf(1, 0.8, 1), 1);
      
      // reversed-'L'-shaped distribution
      assert.epsilon(tol, jStat.kumaraswamy.cdf(0, 1, 0.4), 0);
      assert.epsilon(tol, jStat.kumaraswamy.cdf(0.5, 1, 0.4), 0.2421417167);
      assert.epsilon(tol, jStat.kumaraswamy.cdf(1, 1, 0.4), 1);

      // sideways-'S'-shaped distribution
      assert.epsilon(tol, jStat.kumaraswamy.cdf(0, 0.6, 1.2), 0);
      assert.epsilon(tol, jStat.kumaraswamy.cdf(0.5, 0.6, 1.2), 0.7257468009);
      assert.epsilon(tol, jStat.kumaraswamy.cdf(1, 0.6, 1.2), 1);

      // sideways-'Z'-shaped distribution
      assert.epsilon(tol, jStat.kumaraswamy.cdf(0, 1.3, 0.5), 0);
      assert.epsilon(tol, jStat.kumaraswamy.cdf(0.5, 1.3, 0.5), 0.2293679206);
      assert.epsilon(tol, jStat.kumaraswamy.cdf(1, 1.3, 0.5), 1);

      // flat distribution
      assert.epsilon(tol, jStat.kumaraswamy.cdf(0, 1, 1), 0);
      assert.epsilon(tol, jStat.kumaraswamy.cdf(0.5, 1, 1), 0.5);
      assert.epsilon(tol, jStat.kumaraswamy.cdf(1, 1, 1), 1);

      // '/'-shaped distribution
      assert.epsilon(tol, jStat.kumaraswamy.cdf(0, 2, 1), 0);
      assert.epsilon(tol, jStat.kumaraswamy.cdf(0.5, 2, 1), 0.25);
      assert.epsilon(tol, jStat.kumaraswamy.cdf(1, 2, 1), 1);

      // '\'-shaped distribution
      assert.epsilon(tol, jStat.kumaraswamy.cdf(0, 1, 1.5), 0);
      assert.epsilon(tol, jStat.kumaraswamy.cdf(0.5, 1, 1.5), 0.6464466094);
      assert.epsilon(tol, jStat.kumaraswamy.cdf(1, 1, 1.5), 1);

      // inverted-'U'-shaped distribution
      assert.epsilon(tol, jStat.kumaraswamy.cdf(0, 1.5, 1.5), 0);
      assert.epsilon(tol, jStat.kumaraswamy.cdf(0.5, 1.5, 1.5), 0.4802446206);
      assert.epsilon(tol, jStat.kumaraswamy.cdf(1, 1.5, 1.5), 1);

      // peaked distribution
      assert.epsilon(tol, jStat.kumaraswamy.cdf(0, 7, 25), 0);
      assert.epsilon(tol, jStat.kumaraswamy.cdf(0.5, 7, 25), 0.1780530605);
      assert.epsilon(tol, jStat.kumaraswamy.cdf(1, 7, 25), 1);

      // outside support
      assert.epsilon(tol, jStat.kumaraswamy.cdf(-5, 2, 2), 0);
      assert.epsilon(tol, jStat.kumaraswamy.cdf(5, 2, 2), 1);
    }
  },
});

suite.export(module);
