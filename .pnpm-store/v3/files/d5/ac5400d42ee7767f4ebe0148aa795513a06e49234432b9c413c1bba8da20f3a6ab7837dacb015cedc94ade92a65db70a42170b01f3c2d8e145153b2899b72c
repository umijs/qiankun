## Core Functionality

Core functionality include methods that generate and analyse vectors or matrices.

### jStat()

The jStat object can function in several capacities, as demonstrated below.
In all cases, jStat will always return an instance of itself.

**jStat( array[, fn] )**

Creates a new jStat object from either an existing array or jStat object.
For example, create a new jStat matrix by doing the following:

    var matrix = jStat([[ 1, 2, 3 ],[ 4, 5, 6 ],[ 7, 8, 9 ]]);

If an existing jStat object is passed as an argument then it will be cloned into a new object:

    var stat1 = jStat([[ 1, 2 ],[ 3, 4 ]]),
        stat2 = jStat( stat1 );


To transform the data on creation, pass a function as the final argument:

    jStat([[ 1, 2 ],[ 3, 4 ]], function( x ) {
        return x * 2;
    });

**jStat( start, stop, count[, fn ])**

To create a sequence then pass numeric values in the same form `jStat.seq()` would be used:

    var vector = jStat( 0, 1, 5 );
    // vector === [[ 0, 0.25, 0.5, 0.75, 1 ]]

By passing a function the sequence value can be manipulated:

    var vector = jStat( 0, 1, 5, function( x ) {
        return x * 2;
    });
    // vector === [[ 0, 0.5, 1, 1.5, 2 ]];

The second argument passed to the function is the count (starting from 0).
Using this we can create a multidimensional array (useful for plotting data):

    var betaGraph = jStat( 0, 1, 11, function( x, cnt ) {
        return [ jStat.beta.pdf( x, alpha, beta ), cnt ];
    });

**jStat()**

A chainable shortcut in the API exists to allow for filling in the data after object creation.
So creating `jStat` objects from methods like `rand()` can be accomplished in one of the following ways:

    // pass the generated random 3x3 matrix to jStat
    jStat( jStat.rand( 3 ));
    // or create an empty instance that is filled in afterwards
    jStat().rand( 3 );


### rows()

Returns the count of rows in a matrix.

**rows( array )**

    var matrix = [[1,2,3],[4,5,6]];
    jStat.rows( matrix ) === 2;

**fn.rows( [callback] )**

    jStat( matrix ).rows() === 2;

Or pass a callback to run the calculation asynchronously and pass on the calculation.
This allows for continued chaining of methods to the jStat object.
Also note `this` within the callback refers to the calling jStat object.

    jStat( matrix ).rows(function( d ) {
        // d === 2
    });

### rowa()

Returns a array from matrix row.

    rowa([[1,2],[3,4]]) === [1,2];

### cols()

Returns the number of columns in a matrix.

**cols( array )**

    var matrix = [[1,2,3],[4,5,6]];
    jStat.cols( matrix ) === 3;

**fn.cols( [callback] )**

    jStat( matrix ).cols() === 3;

Or pass a callback to run the calculation asynchronously and pass on the calculation.
This allows for continued chaining of methods to the jStat object.
Also note `this` within the callback refers to the calling jStat object.

    jStat( matrix ).cols(function( d ) {
        // d === 3
    });

### cola()

Returns an array from matrix column (`col()` will return a matrix form instead of an array form).

    cola([[1,2],[3,4]]) === [1,3];

### slice()

Slices matrix as numpy style.

    A=[[1,2,3],[4,5,6],[7,8,9]];
    slice(A,{row:{end:2},col:{start:1}}) === [[2,3],[5,6]];
    slice(A,1,{start:1}) === [5,6];

### sliceAssign()

Do slice assign as numpy style.

    A = [[1,2,3],[4,5,6],[7,8,9]];
    sliceAssign(A,{row : {start : 1}, col : {start : 1}},[[0,0],[0,0]]);
    A = [[1,2,3],[4,0,0],[7,0,0]];


### dimensions()

Returns an object with the dimensions of a matrix.

**dimensions( array )**

    var matrix = [[1,2,3],[4,5,6]];
    jStat.dimensions( matrix ) === { cols: 3, rows: 2 };

**fn.dimensions( [callback] )**

    jStat( matrix ).dimensions() === { cols: 3, rows: 2 };

Or pass a callback to run the calculation asynchronously and pass on the calculation.
This allows for continued chaining of methods to the jStat object.
Also note `this` within the callback refers to the calling jStat object.

    jStat( matrix ).dimensions(function( d ) {
        // d === { cols: 3, rows: 2 }
    });

### row()

Returns a specified row of a matrix.

**row( array, index )**

    var matrix = [[1,2,3],[4,5,6],[7,8,9]];
    jStat.row( matrix, 0 ) === [1,2,3];
    jStat.row( matrix, [0,1] ) === [[1,2,3],[4,5,6]]

**fn.row( index[, callback] )**

    jStat( matrix ).row( 0 ) === jStat([1,2,3]);

Or pass a callback to run the calculation asynchronously and pass on the calculation.
This allows for continued chaining of methods to the jStat object.
Also note `this` within the callback refers to the calling jStat object.

    jStat( matrix ).row( 0, function( d ) {
        // d === jStat([1,2,3])
    });

### col()

Returns the specified column as a column vector.

**col( index )**

    var matrix = [[1,2,3],[4,5,6],[7,8,9]];
    jStat.col( matrix, 0 ) === [[1],[4],[7]];
    jStat.col( matrix,[0,1] ) === [[1,2],[4,5],[7,8]]

**fn.col( index[, callback] )**

    jStat( matrix ).col( 0 ) === jStat([[1],[4],[7]]);

Or pass a callback to run the calculation asynchronously and pass on the calculation.
This allows for continued chaining of methods to the jStat object.
Also note `this` within the callback refers to the calling jStat object.

    jStat( matrix ).col( 0, function( d ) {
        // d === jStat([[1],[3]])
    })

### diag()

Returns the diagonal of a matrix.

**diag( array )**

    var matrix = [[1,2,3],[4,5,6],[7,8,9]];
    jStat.diag( matrix ) === [[1],[5],[9]];

**fn.diag( [callback] )**

    jStat( matrix ).diag() === jStat([[1],[5],[9]]);

Or pass a callback to run the calculation asynchronously and pass on the calculation.
This allows for continued chaining of methods to the jStat object.
Also note `this` within the callback refers to the calling jStat object.

    jStat( matrix ).diag(function( d ) {
        // d === jStat([[1],[5],[9]])
    });

### antidiag()

Returns the anti-diagonal of the matrix.

**antidiag( array )**

    var matrix = [[1,2,3],[4,5,6],[7,8,9]];
    jStat.antidiag( matrix ) === [[3],[5],[7]];

**fn.antidiag( [callback] )**

    jStat( matrix ).antidiag() === jStat([[3],[5],[7]]);

Or pass a callback to run the calculation asynchronously and pass on the calculation.
This allows for continued chaining of methods to the jStat object.
Also note `this` within the callback refers to the calling jStat object.

    jStat( matrix ).antidiag(function( d ) {
        // d === jStat([[3],[5],[7]])
    });

### diagonal()

Creates a new diagonal matrix by given 1d diag array.

    jStat.diagonal([1,2,3]) === [[1,0,0],[0,2,0],[0,0,3]];

### transpose()

Transposes a matrix.

**transpose( array )**

    var matrix = [[1,2],[3,4]];
    jStat.transpose( matrix ) === [[1,3],[2,4]];

**fn.transpose( [callback] )**

    jStat( matrix ).transpose() === [[1,3],[2,4]];

Or pass a callback to run the calculation asynchronously and pass on the calculation.
This allows for continued chaining of methods to the jStat object.
Also note `this` within the callback refers to the calling jStat object.

    jStat( matrix ).transpose(function( d ) {
        // d === jStat([[1,3],[2,4]])
    })

### map( func )

Maps a function to all values and return a new object.

**map( array, fn )**

    var matrix = [[1,2],[3,4]];
    jStat.map( matrix, function( x ) {
        return x * 2;
    });
    // returns [[2,4],[6,8]]

**fn.map( fn )**

    jStat( matrix ).map(function( x ) {
        return x * 2;
    });

### cumreduce( func )

Cumulatively reduces values using a function and return a new object.

**cumreduce( array, fn )**

    var matrix = [[1,2],[3,4]];
    jStat.cumreduce( matrix, function( a, b ) {
        return a + b;
    });
    // returns [[1,3],[3,7]]

**fn.cumreduce( fn )**

    jStat( matrix ).cumreduce(function( a, b ) {
        return a + b;
    });

### alter( func )

Destructively maps to an array.

**alter( array, fn )**

    var matrix = [[1,2],[3,4]];
    jStat.alter( matrix, function( x ) {
        return x * 2;
    });
    // matrix === [[2,4],[6,8]]

**fn.alter( fn )**

    var matrix = [[1,2],[3,4]];
    jStat( matrix ).alter( function( x ) {
        return x * 2;
    });

### create()

Creates a row by col matrix using the supplied function.
If `col` is omitted then it will default to value `row`.

**create( row[, col], fn )**

    jStat.create( 2, function( row, col ) {
        return row + col;
    });
    // returns [[0,1],[1,2]]

**fn.create( row[, col], fn )**

Use this technique to create matrices in jStat instances.

    jStat().create( 2, function( row, col ) {
        return row + col;
    });
    // returns jStat([[0,1],[1,2]])

### zeros()

Creates a row by col matrix of all zeros.
If `col` is omitted then it will default to value `row`.

**zeros( row[, col] )**

    jStat.zeros( 2 );
    // returns [[0,0],[0,0]]

**fn.zeros( row[, col] )**

Use this technique to create matrices in jStat instances.

    jStat().zeros( 2 );
    // returns jStat([[0,0],[0,0]])

### ones()

Creates a row by col matrix of all ones.
If `col` is omitted then it will default to value `row`.

**ones( row[, col] )**

    jStat.zeros( 2 );
    // returns [[0,0],[0,0]]

**fn.ones( row[, col] )**

Use this technique to create matrices in jStat instances.

    jStat().ones( 2 );
    // returns jStat([[0,0],[0,0]])

### rand()

Creates a matrix of normally distributed random numbers.
If `col` is omitted then it will default to value `row`.

**rand( row[, col] )**

    jStat.rand( 3 );

**fn.rand( row[, col] )**

Use this technique to create matrices in jStat instances.

    jStat().rand( 3 );

### copy()

Returns a copy of given matrix.

### identity()

Creates an identity matrix of row by col.
If `col` is omitted then it will default to value `row`.

**identity( row[, col] )**

    jStat.identity( 2 );
    // returns [[1,0],[0,1]]

**fn.identity( row[, col] )**

Use this technique to create matrices in jStat instances.

    jStat().identity( 2 );

### seq()

Creates an arithmetic sequence by given length.

    jStat.seq(1,5,9) === [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

### arange()

Creates an arithmetic sequence by given step.

    arange(5) === [0,1,2,3,4]
    arange(1,5) === [1,2,3,4]
    arange(5,1,-1) === [5,4,3,2]



### clear()

Sets all values in the vector or matrix to zero.

**clear( array )**

    var tmp = [1,2,3];
    jStat.clear( tmp );
    // tmp === [0,0,0]

**fn.clear( [callback] )**

    jStat( 0, 1, 3 ).clear();
    // returns [[0,0,0]]

If a callback is passed then the original object is not altered.

    var obj = jStat( 0, 1, 3 );
    obj.clear(function() {
        // this === [ 0, 0, 0 ]
    });
    // obj === [ 0, 0.5, 1 ]

### symmetric()

Tests if a matrix is symmetric.

**symmetric( array )**

    jStat.symmetric([[1,2],[2,1]]) === true

**fn.symmetric( [callback] )**

    jStat([[1,2],[2,1]]).symmetric() === true

Can pass a callback to maintain chainability.

    jStat([[1,2],[2,1]]).symmetric(function( result ) {
        // result === true
    });

## jStat Utility Methods

Utilities that are used throughout the jStat library.

### utils.calcRdx( num0, num1 )

Calculates the decimal shift for the IEEE 754 floating point calculation correction.

### utils.isArray( arg )

Tests if `arg` is an array.

### utils.isFunction( arg )

Tests if `arg` is a function.

### utils.isNumber( arg )

Tests if `arg` is a number and not `NaN`.
