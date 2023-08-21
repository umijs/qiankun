var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.distribution');

require('../env.js');

var tol = 0.0000001;
var gamma = jStat.gammafn;


suite.addBatch({
    'weibull pdf': {
        'topic': function() {
            return jStat;
        },
        'check pdf calculation': function(jStat) {
            var pdf = jStat.weibull.pdf;

            assert.epsilon(tol, pdf(1, 1, 1), Math.exp(-1));
            assert.epsilon(tol, pdf(3, 1, 1), Math.exp(-3));

            //Scale parameter
            assert.epsilon(tol, pdf(1, 2, 1), 0.5 * Math.exp(-0.5));
            assert.epsilon(tol, pdf(1, 10, 1), 0.1 * Math.exp(-0.1));

            //Shape parameter
            assert.epsilon(tol, pdf(1, 1, 4), 4 * Math.exp(-1));
            assert.epsilon(tol, pdf(2, 1, 2), 4 * Math.exp(-4));

            //Negative test cases for invalid parameters
            assert.epsilon(tol, pdf(-1, 1, 1), 0);
            assert.epsilon(tol, pdf(1, -1, 1), 0);
            assert.epsilon(tol, pdf(1, 1, -1), 0);
        },
        'check cdf calculation': function(jStat) {
            var cdf = jStat.weibull.cdf;

            assert.epsilon(tol, cdf(1, 1, 1), 1 - Math.exp(-1));

            assert.epsilon(tol, cdf(2, 1, 1), 1 - Math.exp(-2));
            assert.epsilon(tol, cdf(1, 2, 1), 1 - Math.exp(-0.5));
            assert.epsilon(tol, cdf(2, 1, 2), 1 - Math.exp(-4));
        },
        'mean': function(jStat) {
            var mean = jStat.weibull.mean;

            assert.epsilon(tol, mean(1, 1), gamma(2));
            assert.epsilon(tol, mean(2, 1), 2 * gamma(2));

            assert.epsilon(tol, mean(1, 2), gamma(1.5));
        },
        'median': function(jStat) {
            var median = jStat.weibull.median;

            assert.epsilon(tol, median(1, 1), Math.log(2));

            assert.epsilon(tol, median(1, 2), Math.pow(Math.log(2), 0.5));
            assert.epsilon(tol, median(2, 1), 2 * Math.log(2));
        },
        'mode': function(jStat) {
            var mode = jStat.weibull.mode;

            assert.epsilon(tol, mode(1, 1), 0);
            assert.epsilon(tol, mode(1, 2), Math.pow(0.5, 0.5))
            assert.epsilon(tol, mode(3, 2), 3 * Math.pow(0.5, 0.5))
        },
        'variance': function(jStat) {
            var variance = jStat.weibull.variance;

            assert.epsilon(tol, variance(1, 1), gamma(3) - Math.pow(gamma(2), 2));
            assert.epsilon(tol, variance(1, 2), gamma(2) - Math.pow(gamma(1.5), 2));
            assert.epsilon(tol, variance(3, 2), 9 * (gamma(2) - Math.pow(gamma(1.5), 2)));
        }

    }
});

suite.export(module);
