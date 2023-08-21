var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.distribution');

require('../env.js');

var tol = 0.0000001;

suite.addBatch({
    'poisson pdf': {
        'topic': function() {
            return jStat;
        },
        'check pdf calculation': function(jStat) {
            var pdf = jStat.poisson.pdf;

            assert.epsilon(tol, pdf(1, 1), Math.exp(-1));
            assert.epsilon(tol, pdf(2, 1), Math.exp(-1) / 2);

            assert.epsilon(tol, pdf(1, 3), 3 * Math.exp(-3));
            assert.epsilon(tol, pdf(1, 1.5), 1.5 * Math.exp(- 1.5));

            //Negative test cases outside of support
            assert.epsilon(tol, pdf(1.4, 1), 0);
            assert.epsilon(tol, pdf(1, -2), 0);
        },
        'check cdf calculation': function(jStat) {
            var curriedCdf = function(k) { return jStat.poisson.cdf(k, 1); };

            var pdfValues = [Math.exp(-1), Math.exp(-1), Math.exp(-1) / 2, Math.exp(-1) / 6, Math.exp(-1) / 24];

            assert.epsilon(tol, curriedCdf(0.5), pdfValues[0]);
            assert.epsilon(tol, curriedCdf(3.5), pdfValues[0] + pdfValues[1] + pdfValues[2] + pdfValues[3]);

            assert.epsilon(tol, curriedCdf(-1), 0);
            assert.epsilon(tol, curriedCdf(2), pdfValues[0] + pdfValues[1] + pdfValues[2]);
        },
        'mean': function(jStat) {
            var mean = jStat.poisson.mean;

            assert.epsilon(tol, mean(1), 1);
            assert.epsilon(tol, mean(3.5), 3.5);
        },
        'check sample': function(jStat) {
            var samplingTol = 10;
            var lambdaToTest = [10, 100, 1000, 10000, 100000];
            var sampleSize = 10000;
            for(var i in lambdaToTest) {
                var lambda = lambdaToTest[i];
                var sum = 0;
                for(let i = 0; i < sampleSize; i++) {
                    sum += jStat.poisson.sample(lambda);
                }
                var mean = sum/sampleSize;
                assert.epsilon(samplingTol, mean, lambda);
            }
        }
    }
});

suite.export(module);
