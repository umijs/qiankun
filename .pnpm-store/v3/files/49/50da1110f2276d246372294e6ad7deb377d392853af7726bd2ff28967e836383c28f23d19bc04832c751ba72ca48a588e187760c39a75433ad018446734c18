var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.distribution');

require('../env.js');

var tol = 0.0000001;

suite.addBatch({
    'laplace pdf': {
        'topic': function () {
            return jStat;
        },
        'check pdf calculation': function(jStat) {
            var pdf = jStat.laplace.pdf;

            assert.epsilon(tol, pdf(0, 0, 1), 0.5);
            assert.epsilon(tol, pdf(2, 0, 1), 0.5 * Math.exp(-2));

            //Mean parameter
            assert.epsilon(tol, pdf(0, 1, 1), 0.5 * Math.exp(-1));
            assert.epsilon(tol, pdf(0, 3, 1), 0.5 * Math.exp(-3));
            assert.epsilon(tol, pdf(0, -3, 1), 0.5 * Math.exp(-3));

            //Shape parameter
            assert.epsilon(tol, pdf(0, 0, 5), 0.1);

            //Zero for invalid parameters
            assert.epsilon(tol, pdf(0, 0, 0), 0);
            assert.epsilon(tol, pdf(0, 0, -3), 0);

            //Large values
            assert.epsilon(tol, pdf(0, 400, 500), 0.001 * Math.exp(-0.8));
        },
        'check cdf calculation': function(jStat) {
            var cdf = jStat.laplace.cdf;

            assert.epsilon(tol, cdf(0, 0, 1), 0.5);
            assert.epsilon(tol, cdf(1, 0, 1), 1 - (0.5 * Math.exp(-1)));

            //Mean parameter
            assert.epsilon(tol, cdf(0, 2, 1), 0.5 * Math.exp(-2));
            assert.epsilon(tol, cdf(3, 2, 1), 1 - (0.5 * Math.exp(-1)));

            //Shape parameter
            assert.epsilon(tol, cdf(0, 0, 3), 0.5);
            assert.epsilon(tol, cdf(3, 0, 3), 1 - (0.5 * Math.exp(-1)));
            assert.epsilon(tol, cdf(-2, 0, 4), 0.5 * Math.exp(-0.5));

            //Zero returned for invalid parameters
            assert.epsilon(tol, cdf(1, 1, 0), 0);
            assert.epsilon(tol, cdf(1, 1, -2), 0);
        },
        'mean': function(jStat) {
            var mean = jStat.laplace.mean;

            assert.epsilon(tol, mean(0, 2), 0);
            assert.epsilon(tol, mean(1, 2), 1);
            assert.epsilon(tol, mean(-5, 3), -5);
        },
        'median': function(jStat) {
            var median = jStat.laplace.median;

            assert.epsilon(tol, median(0, 2), 0);
            assert.epsilon(tol, median(1, 2), 1);
            assert.epsilon(tol, median(-5, 3), -5);
        },
        'mode': function(jStat) {
            var mode = jStat.laplace.mode;

            assert.epsilon(tol, mode(0, 2), 0);
            assert.epsilon(tol, mode(1, 2), 1);
            assert.epsilon(tol, mode(-5, 3), -5);
        },
        'variance': function(jStat) {
            var variance = jStat.laplace.variance;

            assert.epsilon(tol, variance(0, 2), 2 * 2 * 2);
            assert.epsilon(tol, variance(0, 0.25), 2 * 0.25 * 0.25);
        }
    }
});

suite.export(module);
