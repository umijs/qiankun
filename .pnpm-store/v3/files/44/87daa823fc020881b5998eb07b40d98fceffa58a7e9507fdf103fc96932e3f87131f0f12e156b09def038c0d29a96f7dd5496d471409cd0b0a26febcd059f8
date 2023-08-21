## Statistical Tests

The test module includes methods that enact popular statistical tests.
The tests that are implemented are Z tests, T tests, and F tests.
Also included are methods for developing confidence intervals. Currently
regression is not included but it should be included soon (once matrix
inversion is fixed).

## Statistics Instance Functionality

### zscore( value[, flag] )

Returns the z-score of `value` taking the jStat object as the observed
values. `flag===true` denotes use of sample standard deviation.

### ztest( value, sides[, flag] )

Returns the p-value of `value` taking the jStat object as the observed
values. `sides` is an integer value 1 or 2 denoting a 1 or 2 sided z-test.
The test defaults to a 2 sided z-test if `sides` is not specified. `flag===true`
denotes use of sample standard deviation.

### tscore( value )

Returns the t-score of `value` taking the jStat object as the observed
values.

### ttest( value, sides )

Returns the p-value of `value` taking the jStat object as the observed
values. `sides` is an integer value 1 or 2 denoting a 1 or 2 sided t-test.
The test defaults to a 2 sided t-test if `sides` is not specified.

### anovafscore()

Returns the f-score of the ANOVA test on the arrays of the jStat object.

### anovaftest()

Returns the p-value of an ANOVA test on the arrays of the jStat object.

## Static Methods

## Z Statistics

### jStat.zscore( value, mean, sd )

Returns the z-score of `value` given the `mean` mean and the `sd` standard deviation
of the test.

### jStat.zscore( value, array[, flag] )

Returns the z-score of `value` given the data from `array`. `flag===true` denotes
use of the sample standard deviation.

### jStat.ztest( value, mean, sd, sides )

Returns the p-value of a the z-test of `value` given the `mean` mean and `sd` standard
deviation of the test. `sides` is an integer value 1 or 2 denoting a
one or two sided z-test. If `sides` is not specified the test defaults
to a two sided z-test.

### jStat.ztest( zscore, sides )

Returns the p-value of the `zscore` z-score. `sides` is an integer value 1 or 2
denoting a one or two sided z-test. If `sides` is not specified the test
defaults to a two sided z-test

### jStat.ztest( value, array, sides[, flag] )

Returns the p-value of `value` given the data from `array`. `sides` is
an integer value 1 or 2 denoting a one or two sided z-test. If `sides`
is not specified the test defaults to a two sided z-test. `flag===true`
denotes the use of the sample standard deviation.

## T Statistics

### jStat.tscore( value, mean, sd, n )

Returns the t-score of `value` given the `mean` mean, `sd` standard deviation,
and the sample size `n`.

### jStat.tscore( value, array )

Returns the t-score of `value` given the data from `array`.

### jStat.ttest( value, mean, sd, n, sides )

Returns the p-value of `value` given the `mean` mean, `sd` standard deviation,
and the sample size `n`. `sides` is an integer value 1 or 2 denoting
a one or two sided t-test. If `sides` is not specified the test
defaults to a two sided t-test.

### jStat.ttest( tscore, n, sides )

Returns the p-value of the `tscore` t-score given the sample size `n`. `sides`
is an integer value 1 or 2 denoting a one or two sided t-test.
If `sides` is not specified the test defaults to a two sided t-test.

### jStat.ttest( value, array, sides )

Returns the p-value of `value` given the data in `array`.
`sides` is an integer value 1 or 2 denoting a one or two sided
t-test. If `sides` is not specified the test defaults to a two
sided t-test.

## F Statistics

### jStat.anovafscore( array1, array2, ..., arrayn )

Returns the f-score of an ANOVA on the arrays.

### jStat.anovafscore( [array1,array2, ...,arrayn] )

Returns the f-score of an ANOVA on the arrays.

### jStat.anovaftest( array1, array2, ...., arrayn )

Returns the p-value of the f-statistic from the ANOVA
test on the arrays.

### jStat.ftest( fscore, df1, df2)

Returns the p-value for the `fscore` f-score with a `df1` numerator degrees
of freedom and a `df2` denominator degrees of freedom.

## Tukey's Range Test

### jStat.qscore( mean1, mean2, n1, n2, sd )

Returns the q-score of a single pairwise comparison between arrays
of mean `mean1` and `mean2`, size `n1` and `n2`, and standard deviation (of
all vectors) `sd`.

### jStat.qscore( array1, array2, sd )

Same as above, but the means and sizes are calculated automatically
from the arrays.

### jStat.qtest( qscore, n, k )

Returns the p-value of the q-score given the total sample size `n`
and `k` number of populations.

### jStat.qtest( mean1, mean2, n1, n2, sd, n, k )

Returns the p-value of a single pairwise comparison between arrays
of mean `mean1` and `mean2`, size `n1` and `n2`, and standard deviation (of
all vectors) `sd`, where the total sample size is `n` and the number of
populations is `k`.

### jStat.qtest( array1, array2, sd, n, k )

Same as above, but the means and sizes are calculated automatically
from the arrays.

### jStat.tukeyhsd( arrays )

Performs the full Tukey's range test returning p-values for every
pairwise combination of the arrays in the format of
`[[[index1, index2], pvalue], ...]`

For example:

    > jStat.tukeyhsd([[1, 2], [3, 4, 5], [6], [7, 8]])
    [ [ [ 0, 1 ], 0.10745283896120883 ],
      [ [ 0, 2 ], 0.04374051946838586 ],
      [ [ 0, 3 ], 0.007850804224287633 ],
      [ [ 1, 2 ], 0.32191548545694226 ],
      [ [ 1, 3 ], 0.03802747415485819 ],
      [ [ 2, 3 ], 0.5528665999257486 ] ]

## Confidence Intervals

### jStat.normalci( value, alpha, sd, n )

Returns a 1-alpha confidence interval for `value` given
a normal distribution with a standard deviation `sd` and a
sample size `n`

### jStat.normalci( value, alpha, array )

Returns a 1-alpha confidence interval for `value` given
a normal distribution in the data from `array`.

### jStat.tci( value, alpha, sd, n )

Returns a 1-alpha confidence interval for `value` given
the standard deviation `sd` and the sample size `n`.

### jStat.tci( value, alpha, array )

Returns a 1-alpha confidence interval for `value` given
the data from `array`.

### jStat.fn.oneSidedDifferenceOfProportions( p1, n1, p2, n2 )

Returns the p-value for a 1-sided test for the difference
between two proportions. `p1` is the sample proportion for
the first sample, whereas `p2` is the sample proportion for
the second sample. Similiarly, `n1` is the sample size of the
first sample and `n2` is the sample size for the second sample.

### jStat.fn.twoSidedDifferenceOfProportions( p1, n1, p2, n2 )

Returns the p-value for a 2-sided test for the difference
between two proportions. `p1` is the sample proportion for
the first sample, whereas `p2` is the sample proportion for
the second sample. Similiarly, `n1` is the sample size of the
first sample and `n2` is the sample size for the second sample.
