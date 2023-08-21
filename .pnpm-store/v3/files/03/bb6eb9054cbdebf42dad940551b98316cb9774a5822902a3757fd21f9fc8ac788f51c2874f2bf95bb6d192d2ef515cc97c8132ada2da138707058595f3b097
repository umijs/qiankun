## Vector Functionality

### sum()

**sum( array )**

Returns the sum of the `array` vector.

    jStat.sum([1,2,3]) === 6

**fn.sum( [bool][, callback] )**

Returns the sum of a vector or matrix columns.

    jStat( 1, 5, 5 ).sum() === 15
    jStat([[1,2],[3,4]]).sum() === [ 4, 6 ]

If callback is passed then will pass result as first argument.

    jStat( 1, 5, 5 ).sum(function( result ) {
        // result === 15
    });

If pass boolean true as first argument, then return sum of entire matrix.

    jStat([[1,2],[3,4]]).sum( true ) === 10

And the two can be combined.

    jStat([[1,2],[3,4]]).sum(true, function( result ) {
        // result === 10
    });

### sumsqrd()

**sumsqrd( array )**

Returns the sum squared of the `array` vector.

    jStat.sumsqrd([1,2,3]) === 14

**fn.sumsqrd( [bool][, callback] )**

Returns the sum squared of a vector or matrix columns.

    jStat( 1, 5, 5 ).sumsqrd() === 55
    jStat([[1,2],[3,4]]).sumsqrd() === [ 10, 20 ]

If callback is passed then will pass result as first argument.

    jStat( 1, 5, 5 ).sumsqrd(function( result ) {
        // result === 55
    });

If pass boolean true as first argument, then return sum squared of entire matrix.

    jStat([[1,2],[3,4]]).sumsqrd( true ) === 650

And the two can be combined.

    jStat([[1,2],[3,4]]).sumsqrd(true,function( result ) {
        // result === 650
    });

### sumsqerr()

**sumsqerr( array )**

Returns the sum of squared errors of prediction of the `array` vector.

    jStat.sumsqerr([1,2,3]) === 2

**fn.sumsqerr( [bool][, callback] )**

Returns the sum of squared errors of prediction of a vector or matrix columns.

    jStat( 1, 5, 5 ).sumsqerr() === 10
    jStat([[1,2],[3,4]]).sumsqerr() === [ 2, 2 ]

If callback is passed then will pass result as first argument.

    jStat( 1, 5, 5 ).sumsqerr(function( result ) {
        // result === 55
    });

If pass boolean true as first argument, then return sum of squared errors of entire matrix.

    jStat([[1,2],[3,4]]).sumsqerr( true ) === 0

And the two can be combined.

    jStat([[1,2],[3,4]]).sumsqerr(true,function( result ) {
        // result === 0
    });

### sumrow()

**sumrow( array )**

Returns the sum of the `array` vector in row-based order.

    jStat.sumrow([1,2,3]) === 6

**fn.sumrow( [bool][, callback] )**

Returns the sum of a vector or matrix rows.

    jStat( 1, 5, 5 ).sumrow() === 15
    jStat([[1,2],[3,4]]).sumrow() === [ 3, 7 ]

If callback is passed then will pass result as first argument.

    jStat( 1, 5, 5 ).sumrow(function( result ) {
        // result === 15
    });

If pass boolean true as first argument, then return sum of entire matrix.

    jStat([[1,2],[3,4]]).sumrow( true ) === 10

And the two can be combined.

    jStat([[1,2],[3,4]]).sumrow(true,function( result ) {
        // result === 10
    });


### product()

**product( array )**

Returns the product of the `array` vector.

    jStat.product([1,2,3]) === 6

**fn.product( [bool][, callback] )**

Returns the product of a vector or matrix columns.

    jStat( 1, 5, 5 ).product() === 120
    jStat([[1,2],[3,4]]).product() === [ 3, 8 ]

If callback is passed then will pass result as first argument.

    jStat( 1, 5, 5 ).product(function( result ) {
        // result === 120
    });

If pass boolean true as first argument, then return sumsqerr of entire matrix.

    jStat([[1,2],[3,4]]).product( true ) === 24

And the two can be combined.

    jStat([[1,2],[3,4]]).product(true,function( result ) {
        // result === 24
    });

### min()

**min( array )**

Returns the minimum value of the `array` vector.

    jStat.min([1,2,3]) === 1

**fn.min( [bool][, callback] )**

Returns the minimum value of a vector or matrix columns.

    jStat( 1, 5, 5 ).min() === 1
    jStat([[1,2],[3,4]]).min() === [ 1, 2 ]

If callback is passed then will pass result as first argument.

    jStat( 1, 5, 5 ).min(function( result ) {
        // result === 1
    });

If pass boolean true as first argument, then return minimum of entire matrix.

    jStat([[1,2],[3,4]]).min( true ) === 1

And the two can be combined.

    jStat([[1,2],[3,4]]).min(true,function( result ) {
        // result === 1
    });

### max()

**max( array )**

Returns the maximum value of the `array` vector.

    jStat.max([1,2,3]) === 3

**fn.max( [bool][, callback] )**

Returns the maximum value of a vector or matrix columns.

    jStat( 1, 5, 5 ).max() === 5
    jStat([[1,2],[3,4]]).max() === [ 3, 4 ]

If callback is passed then will pass result as first argument.

    jStat( 1, 5, 5 ).max(function( result ) {
        // result === 5
    });

If pass boolean true as first argument, then return maximum of entire matrix.

    jStat([[1,2],[3,4]]).max( true ) === 4

And the two can be combined.

    jStat([[1,2],[3,4]]).max(true,function( result ) {
        // result === 4
    });

### mean()

**mean( array )**

Returns the mean of the `array` vector.

    jStat.mean([1,2,3]) === 2

**fn.max( [bool,][callback] )**

Returns the max of a vector or matrix columns.

    jStat( 1, 5, 5 ).mean() === 3
    jStat([[1,2],[3,4]]).mean() === [ 2, 3 ]

If callback is passed then will pass result as first argument.

    jStat( 1, 5, 5 ).mean(function( result ) {
        // result === 3
    });

If pass boolean true as first argument, then return mean of entire matrix.

    jStat([[1,2],[3,4]]).mean( true ) === 2.5

And the two can be combined.

    jStat([[1,2],[3,4]]).mean(true,function( result ) {
        // result === 2.5
    });

### meansqerr()

**meansqerr( array )**

Returns the mean squared error of the `array` vector.

    jStat.meansqerr([1,2,3]) === 0.66666...

**fn.meansqerr( [bool][, callback] )**

Returns the mean squared error of a vector or matrix columns.

    jStat( 1, 5, 5 ).meansqerr() === 2
    jStat([[1,2],[3,4]]).meansqerr() === [ 1, 1 ]

If callback is passed then will pass result as first argument.

    jStat( 1, 5, 5 ).meansqerr(function( result ) {
        // result === 2
    });

If pass boolean true as first argument, then return mean squared error of entire matrix.

    jStat([[1,2],[3,4]]).meansqerr( true ) === 0

And the two can be combined.

    jStat([[1,2],[3,4]]).meansqerr(true,function( result ) {
        // result === 0
    });

### geomean()

**geomean( array )**

Returns the geometric mean of the `array` vector.

    jStat.geomean([4,1,1/32]) === 0.5

**fn.geomean( [bool][, callback] )**

Returns the geometric mean of a vector or matrix columns.

    jStat([4,1,1\32]).geomean() === 0.5
    jStat([[1,2],[3,4]]).geomean() === [ 1.732..., 2.828... ]

If callback is passed then will pass result as first argument.

    jStat([4,1,1\32]).geomean(function( result ) {
        // result === 0.5
    });

If pass boolean true as first argument, then return geometric mean of entire matrix.

    jStat([[1,2],[3,4]]).geomean( true ) === 2.213...

And the two can be combined.

    jStat([[1,2],[3,4]]).geomean(true,function( result ) {
        // result === 2.213...
    });

### median()

**median( array )**

Returns the median of the `array` vector.

    jStat.median([1,2,3]) === 2

**fn.median( [bool][, callback] )**

Returns the median of a vector or matrix columns.

    jStat( 1, 5, 5 ).median() === 3
    jStat([[1,2],[3,4]]).median() === [ 2, 3 ]

If callback is passed then will pass result as first argument.

    jStat( 1, 5, 5 ).median(function( result ) {
        // result === 3
    });

If pass boolean true as first argument, then return median of entire matrix.

    jStat([[1,2],[3,4]]).median( true ) === 2.5

And the two can be combined.

    jStat([[1,2],[3,4]]).median(true,function( result ) {
        // result === 2.5
    });

### cumsum()

**cumsum( array )**

Returns an array of partial sums in the sequence.

    jStat.cumsum([1,2,3]) === [1,3,6]

**fn.cumsum( [bool][, callback] )**

Returns an array of partial sums for a vector or matrix columns.

    jStat( 1, 5, 5 ).cumsum() === [1,3,6,10,15]
    jStat([[1,2],[3,4]]).cumsum() === [[1,4],[2,6]]

If callback is passed then will pass result as first argument.

    jStat( 1, 5, 5 ).cumsum(function( result ) {
        // result === [1,3,6,10,15]
    });

If pass boolean true as first argument, then return cumulative sums of the matrix.

    jStat([[1,2],[3,4]]).cumsum( true ) === [[1,3],[3,7]]

And the two can be combined.

    jStat([[1,2],[3,4]]).cumsum(true,function( result ) {
        // result === ...
    });

### cumprod()

**cumprod( array )**

Returns an array of partial products in the sequence.

    jStat.cumprod([2,3,4]) === [2,6,24]

**fn.cumprod( [bool][, callback] )**

Returns an array of partial products for a vector or matrix columns.

    jStat( 1, 5, 5 ).cumprod() === [1,2,6,24,120]
    jStat([[1,2],[3,4]]).cumprod() === [[1,3],[2,8]]

If callback is passed then will pass result as first argument.

    jStat( 1, 5, 5 ).cumprod(function( result ) {
        // result === [1,2,6,24,120]
    });

If pass boolean true as first argument, then return cumulative products of the matrix.

    jStat([[1,2],[3,4]]).cumprod( true ) === [[1,2],[3,12]]

And the two can be combined.

    jStat([[1,2],[3,4]]).cumprod(true,function( result ) {
        // result === ...
    });

### diff()

**diff( array )**

Returns an array of the successive differences of the array.

    jStat.diff([1,2,2,3]) === [1,0,1]

**fn.diff( [bool][, callback] )**

Returns an array of successive differences for a vector or matrix columns.

    jStat([1,2,2,3]).diff() === [1,0,1]
    jStat([[1,2],[3,4],[1,4]]).diff() === [[2,-2],[2,0]]

If callback is passed then will pass result as first argument.

    jStat([[1,2],[3,4],[1,4]]).diff(function( result ) {
        // result === [[2,-2],[2,0]]
    });

If pass boolean true as first argument, then return successive difference for the whole matrix.

    jStat([[1,2],[3,4],[1,4]]).diff(true) === [0,2]

And the two can be combined.

    jStat([[1,2],[3,4],[1,4]]).diff(true,function( result ) {
        // result === [0,2]
    });

### rank()

**rank( array )**

Returns an array of the ranks of the array.

    jStat.rank([1, 2, 2, 3]) === [1, 2.5, 2.5, 4]

**fn.rank( [bool][, callback] )**

Returns an array of ranks for a vector or matrix columns.

    jStat([1, 2, 2, 3]).rank() === [1, 2.5, 2.5, 4]
    jStat([[1, 2], [3, 4], [1, 4]]).rank() === [[1.5, 3, 1.5], [1, 2.5, 2.5]]

If callback is passed then will pass result as first argument.

    jStat([[1, 2], [3, 4], [1, 4]]).rank(function( result ) {
        // result === [[1.5, 3, 1.5], [1, 2.5, 2.5]]
    });

If pass boolean true as first argument, then return rank for the whole matrix.

    jStat([[1, 2], [3, 4], [1, 4]]).rank(true) === [2, 5, 2, 5, 2, 5]

And the two can be combined.

    jStat([[1, 2], [3, 4], [1, 4]]).rank(true, function( result ) {
        // result === [2, 5, 2, 5, 2, 5]
    });

### mode()

**mode( array )**

Returns the mode of the `array` vector.
If there are multiple modes then `mode()` will return all of them.

    jStat.mode([1,2,2,3]) === 2
    jStat.mode([1,2,3]) === [1,2,3]

**fn.mode( [bool][, callback] )**

Returns the mode for a vector or matrix columns.

    jStat([1,2,2,3]).mode() === 2
    jStat([[1,2],[3,4],[1,4]]).mode() === [1,4]

If callback is passed then will pass result as first argument.

    jStat( 1, 5, 5 ).mode(function( result ) {
        // result === false
    });

If pass boolean true as first argument, then the matrix will be treated as one
dimensional.

    jStat([[5,4],[5, 2], [5,2]]).mode( true ) === 5

### range()

**range( array )**

Returns the range of the `array` vector.

    jStat.range([1,2,3]) === 2

**fn.range( [bool][, callback] )**

Returns the range for a vector or matrix columns.

    jStat([1,2,3]).range() === 2
    jStat([[1,2],[3,4]]).range() === [2,2]

If callback is passed then will pass result as first argument.

    jStat( 1, 5, 5 ).range(function( result ) {
        // result === 4
    });

If pass boolean true as first argument, then return range of the matrix.

    jStat([[1,2],[3,5]]).range( true ) === true

And the two can be combined.

    jStat([[1,2],[3,5]]).range(true,function( result ) {
        // result === 1
    });

### variance()

**variance( array[, flag] )**

Returns the variance of the `array` vector.
By default, the population variance is calculated.
Passing `true` to `flag` indicates to compute the sample variance instead.

    jStat.variance([1,2,3,4]) === 1.25
    jStat.variance([1,2,3,4],true) === 1.66666...

**fn.variance( [bool][, callback] )**

Returns the variance for a vector or matrix columns.

**Note:** Cannot pass flag to indicate between population or sample for matrices.
There is a feature request for this on [Issue #51](https://github.com/jstat/jstat/issues/51).

    jStat([1,2,3,4]).variance() === 1.25
    jStat([[1,2],[3,4]]).variance() === [1,1]

If callback is passed then will pass result as first argument.

    jStat( 1, 5, 5 ).variance(function( result ) {
        // result === 2
    });

If pass boolean true as first argument, then return variance of the matrix.

    jStat([[1,2],[3,5]]).variance( true ) === 0.140625

And the two can be combined.

    jStat([[1,2],[3,5]]).variance(true,function( result ) {
        // result === 0.140625
    });

### pooledvariance()

**pooledvariance( arrays )**

Returns the pooled (sample) variance of an array of vectors.
Assumes the population variance of the vectors are the same.

    jStat.pooledvariance([[1,2],[3,4]]) === 0.5

### deviation()

**deviation( array )**

Returns the deviation of the `array` vector.

    jStat.deviation([1,2,3,4]) === [-1.5, -0.5, 0.5, 1.5]

**fn.deviation( [bool][, callback] )**

Returns the deviation for a vector or matrix columns.

    jStat([1,2,3,4]).deviation() === [-1.5, -0.5, 0.5, 1.5]
    jStat([[1,2],[3,4]]).deviation() === [[-1,1],[-1,1]]

If callback is passed then will pass result as first argument.

    jStat( 1, 4, 4 ).deviation(function( result ) {
        // result === [-1.5, -0.5, 0.5, 1.5]
    });

If pass boolean true as first argument, then return variance of the matrix.

    jStat([[1,2],[3,5]]).deviation( true ) === [-0.5, 0.5, -1, 1]

And the two can be combined.

    jStat([[1,2],[3,5]]).deviation(true,function( result ) {
        // result === [-0.5, 0.5, -1, 1]
    });

### stdev()

**stdev( array[, flag] )**

Returns the standard deviation of the `array` vector.
By default, the population standard deviation is returned.
Passing `true` to `flag` returns the sample standard deviation.

The 'sample' standard deviation is also called the 'corrected standard deviation', and is an unbiased estimator of the population standard deviation.
The population standard deviation is also the 'uncorrected standard deviation', and is a biased but minimum-mean-squared-error estimator.

    jStat.stdev([1,2,3,4]) === 1.118...
    jStat.stdev([1,2,3,4],true) === 1.290...

**fn.stdev( [bool][, callback] )**

Returns the standard deviation for a vector or matrix columns.

**Note:** Cannot pass `flag` to indicate between population or sample for matrices.
There is a feature request for this on [Issue #51](https://github.com/jstat/jstat/issues/51).

    jStat([1,2,3,4]).stdev() === 1.118...
    jStat([1,2,3,4]).stdev(true) === 1.290...
    jStat([[1,2],[3,4]]).stdev() === [1,1]

If callback is passed then will pass result as first argument.

    jStat( 1, 4, 4 ).stdev(function( result ) {
        // result === 1.118...
    });
    jStat( 1, 4, 4 ).stdev(true,function( result ) {
        // result === 1.290...
    });

If pass boolean true as first argument, then return variance of the matrix.

    jStat([[1,2],[3,5]]).stdev( true ) === 0.25

And the two can be combined.

    jStat([[1,2],[3,5]]).stdev(true,function( result ) {
        // result === 0.25
    });

### pooledstdev()

**pooledstdev( arrays )**

Returns the pooled (sample) standard deviation of an array of vectors.
Assumes the population standard deviation of the vectors are the same.

    jStat.pooledstdev([[1,2],[3,4]]) === 0.707...

### meandev()

**meandev( array )**

Returns the mean absolute deviation of the `array` vector.

    jStat.meandev([1,2,3,4]) === 1

**fn.meandev( [bool][, callback] )**

Returns the mean absolute deviation for a vector or matrix columns.

    jStat([1,2,3,4]).meandev() === 1
    jStat([[1,2],[3,4]]).meandev() === [1,1]

If callback is passed then will pass result as first argument.

    jStat( 1, 4, 4 ).meandev(function( result ) {
        // result === 1
    });

If pass boolean true as first argument, then return mean absolute deviation of the matrix.

    jStat([[1,2],[3,5]]).meandev( true ) === 0.25

And the two can be combined.

    jStat([[1,2],[3,5]]).meandev(true,function( result ) {
        // result === 0.25
    });

### meddev()

**meddev( array )**

Returns the median absolute deviation of the `array` vector.

    jStat.meddev([1,2,3,4]) === 1

**fn.meddev( [bool][, callback] )**

Returns the median absolute deviation for a vector or matrix columns.

    jStat([1,2,3,4]).meddev() === 1
    jStat([[1,2],[3,4]]).meddev() === [1,1]

If callback is passed then will pass result as first argument.

    jStat( 1, 4, 4 ).meddev(function( result ) {
        // result === 1
    });

If pass boolean true as first argument, then return median absolute deviation of the matrix.

    jStat([[1,2],[3,5]]).meddev( true ) === 0.25

And the two can be combined.

    jStat([[1,2],[3,5]]).meddev(true,function( result ) {
        // result === 0.25
    });

### skewness()

**skewness( array )**

Returns the skewness of the `array` vector (third standardized moment).

    jStat.skewness([1,2,2,3,5]) === 0.75003...

### kurtosis()

**kurtosis( array )**

Returns the excess kurtosis of the `array` vector (fourth standardized moment - 3).

    jStat.kurtosis([1,2,3,4]) === -0.63610...

### coeffvar()

**coeffvar( array )**

Returns the coefficient of variation of the `array` vector.

    jStat.coeffvar([1,2,3,4]) === 0.447...

**fn.coeffvar( [bool][, callback] )**

Returns the coefficient of variation for a vector or matrix columns.

    jStat([1,2,3,4]).coeffvar() === 0.447...
    jStat([[1,2],[3,4]]).coeffvar() === [0.5,0.333...]

If callback is passed then will pass result as first argument.

    jStat( 1, 4, 4 ).coeffvar(function( result ) {
        // result === 0.447...
    });

If pass boolean true as first argument, then return coefficient of variation of the matrix.

    jStat([[1,2],[3,5]]).coeffvar( true ) === 0.142...

And the two can be combined.

    jStat([[1,2],[3,5]]).coeffvar(true,function( result ) {
        // result === 0.142...
    });

### quartiles()

**quartiles( array )**

Returns the quartiles of the `array` vector.

    jStat.quartiles( jStat.seq(1,100,100)) === [25,50,75]

**fn.quartiles( [callback] )**

Returns the quartiles for a vector or matrix columns.

    jStat(1,100,100).quartiles() === [25,50,75]
    jStat(1,100,100,function( x ) {
        return [x,x];
    }).quartiles() === [[25,50,75],[25,50,75]]

If callback is passed then will pass result as first argument.

    jStat(1,100,100).quartiles(function( result ) {
        // result === [25,50,75]
    });

### quantiles()

**quantiles( dataArray, quantilesArray[, alphap[, betap]] )**

Like quartiles, but calculate and return arbitrary quantiles of the `dataArray` vector
or matrix (column-by-column).

    jStat.quantiles([1, 2, 3, 4, 5, 6],
                    [0.25, 0.5, 0.75]) === [1.9375, 3.5, 5.0625]

Optional parameters alphap and betap govern the quantile estimation method.
For more details see the Wikipedia page on quantiles or scipy.stats.mstats.mquantiles
documentation.

### percentile()

**percentile( dataArray, k, [exclusive] )**

Returns the k-th percentile of values in the `dataArray` range, where k is in the range 0..1, exclusive.
Passing true for the exclusive parameter excludes both endpoints of the range.

     jStat.percentile([1, 2, 3, 4], 0.3) === 1.9;
     jStat.percentile([1, 2, 3, 4], 0.3, true) === 1.5;

### percentileOfScore()

**percentileOfScore( dataArray, score[, kind] )**

The percentile rank of score in a given array. Returns the percentage
of all values in `dataArray` that are less than (if `kind == 'strict'`) or
less or equal than (if `kind == 'weak'`) score. Default is `'weak'`.

     jStat.percentileOfScore([1, 2, 3, 4, 5, 6], 3), 0.5, 'weak') === 0.5;

### histogram()

**histogram( dataArray[, numBins] )**

The histogram data defined as the number of `dataArray` elements found in
equally sized bins across the range of `dataArray`. Default number
of bins is 4.

     jStat.histogram([100, 101, 102, 230, 304, 305, 400], 3) === [3, 1, 3];

### covariance()

**covariance( array1, array2 )**

Returns the covariance of the `array1` and `array2` vectors.

    var seq = jStat.seq( 0, 10, 11 );
    jStat.covariance( seq, seq ) === 11;

### corrcoeff()

**corrcoeff( array1, array2 )**

Returns the population correlation coefficient of the `array1` and `array2` vectors (Pearson's Rho).

    var seq = jStat.seq( 0, 10, 11 );
    jStat.corrcoeff( seq, seq ) === 1;


**spearmancoeff( array1, array2 )**

Returns the rank correlation coefficient of the `array1` and `array2` vectors (Spearman's Rho).

    jStat.spearmancoeff([1, 2, 3, 4], [5, 6, 9, 7]) == 0.8;
    jStat.spearmancoeff([1, 2, 2, 4], [5, 2, 5, 7]) == 0.5;
