var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.distribution');

require('../env.js');

var tol = 0.0000001;

suite.addBatch({
    'cauchy pdf': {
        'topic': function() {
            return jStat;
        },
        'check pdf calculation': function(jStat) {
            var pdf = jStat.cauchy.pdf;

            assert.epsilon(tol, pdf(1, 0, 1), 1 / (2 * Math.PI));
            assert.epsilon(tol, pdf(3, 0, 1), 1 / (10 * Math.PI));
            assert.epsilon(tol, pdf(-2, 0, 1), 1 / (5 * Math.PI));

            //Location parameter
            assert.epsilon(tol, pdf(1, 1, 1), 1 / Math.PI);
            assert.epsilon(tol, pdf(0, -3, 1), 1 / (10 * Math.PI));

            //Scale parameter
            assert.epsilon(tol, pdf(0, 1, 3), 1 / ((10 / 3) * Math.PI));
            assert.epsilon(tol, pdf(0, 1, 0.5), 1 / (2.5 * Math.PI));

            //Negative test cases
            assert.epsilon(tol, pdf(0, 0, -3), 0);
        },
        'check cdf calculations': function(jStat) {
            var cdf = jStat.cauchy.cdf;

            assert.epsilon(tol, cdf(0, 0, 1), 0.5);
            assert.epsilon(tol, cdf(3, 0, 1), (Math.atan(3) / Math.PI) + 0.5);

            assert.epsilon(tol, cdf(0, 1, 1), (Math.atan(-1) / Math.PI) + 0.5);
            assert.epsilon(tol, cdf(3, 1, 1), (Math.atan(2) / Math.PI) + 0.5);

            assert.epsilon(tol, cdf(0, 1, 2), (Math.atan(-0.5) / Math.PI) + 0.5);
            assert.epsilon(tol, cdf(1, 0, 0.5), (Math.atan(2) / Math.PI) + 0.5);
        },
        'median': function(jStat) {
            var median = jStat.cauchy.median;

            assert.epsilon(tol, median(0, 1), 0);
            assert.epsilon(tol, median(0, 4), 0);
            assert.epsilon(tol, median(-2, 1), -2);
        },
        'mode': function(jStat) {
            var mode = jStat.cauchy.mode;

            assert.epsilon(tol, mode(0, 1), 0);
            assert.epsilon(tol, mode(0, 4), 0);
            assert.epsilon(tol, mode(-2, 1), -2);
        }
    }
});

suite.export(module);
