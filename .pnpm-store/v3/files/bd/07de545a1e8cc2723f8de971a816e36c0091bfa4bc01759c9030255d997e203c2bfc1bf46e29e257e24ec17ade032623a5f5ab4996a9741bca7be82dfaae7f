## Linear Algebra

## Instance Functionality

### add( arg )

Adds value to all entries.

    jStat([[1,2,3]]).add( 2 ) === [[3,4,5]];

### subtract( arg )

Subtracts all entries by value.

    jStat([[4,5,6]]).subtract( 2 ) === [[2,3,4]];

### divide( arg )

Divides all entries by value.

    jStat([[2,4,6]]).divide( 2 ) === [[1,2,3]];

### multiply( arg )

Multiplies all entries by value.

    jStat([[1,2,3]]).multiply( 2 ) === [[2,4,6]];

### dot( arg )

Takes dot product.

### pow( arg )

Raises all entries by value.

    jStat([[1,2,3]]).pow( 2 ) === [[1,4,9]];

### exp()

Exponentiates all entries.

    jStat([[0,1]]).exp() === [[1, 2.718281828459045]]

### log()

Returns the natural logarithm of all entries.

    jStat([[1, 2.718281828459045]]).log() === [[0,1]];

### abs()

Returns the absolute values of all entries.

    jStat([[1,-2,-3]]).abs() === [[1,2,3]];

### norm()

Computes the norm of a vector. Note that if a matrix is passed, then the
first row of the matrix will be used as a vector for `norm()`.

### angle( arg )

Computes the angle between two vectors. Note that if a matrix is passed, then
the first row of the matrix will be used as the vector for `angle()`.

## Static Functionality

### add( arr, arg )

Adds `arg` to all entries of `arr` array.

### subtract( arr, arg )

Subtracts all entries of the `arr` array by `arg`.

### divide( arr, arg )

Divides all entries of the `arr` array by `arg`.

### multiply( arr, arg )

Multiplies all entries of the `arr` array by `arg`.

### dot( arr1, arr2 )

Takes the dot product of the `arr1` and `arr2` arrays.

### outer( A, B )

Takes the outer product of the `A` and `B` arrays.

    outer([1,2,3],[4,5,6]) === [[4,5,6],[8,10,12],[12,15,18]]

### pow( arr, arg )

Raises all entries of the `arr` array to the power of `arg`.

### exp( arr )

Exponentiates all entries in the `arr` array.

### log( arr )

Returns the natural logarithm of all entries in the `arr` array

### abs( arr )

Returns the absolute values of all entries in the `arr` array

### norm( arr )

Computes the norm of the `arr` vector.

### angle( arr1, arr2 )

Computes the angle between the `arr1` and `arr2` vectors.

### aug( A, B )

Augments matrix `A` by matrix `B`. Note that this method returns a plain matrix,
not a jStat object.

### det( A )

Calculates the determinant of matrix `A`.

### inv( A )

Returns the inverse of the matrix `A`.

### gauss_elimination( A, B )

Performs Gaussian Elimination on matrix `A` augmented by matrix `B`.

### gauss_jordan( A, B )

Performs Gauss-Jordan Elimination on matrix `A` augmented by matrix `B`.

### lu( A )

Perform the LU decomposition on matrix `A`.

`A` -> `[L,U]`

st.

`A = LU`

`L` is lower triangular matrix.

`U` is upper triangular matrix.

### cholesky( A )

Performs the Cholesky decomposition on matrix `A`.

`A` -> `T`

st.

`A = TT'`

`T` is lower triangular matrix.

### gauss_jacobi( A, b, x, r )

Solves the linear system `Ax = b` using the Gauss-Jacobi method with an initial guess of `r`.

### gauss_seidel( A, b, x, r )

Solves the linear system `Ax = b` using the Gauss-Seidel method with an initial guess of `r`.

### SOR( A, b, x, r, w )

Solves the linear system `Ax = b` using the sucessive over-relaxation method with an initial guess of `r` and parameter `w` (omega).

### householder( A )

Performs the householder transformation on the matrix `A`.

### QR( A )

Performs the Cholesky decomposition on matrix `A`.

`A` -> `[Q,R]`

`Q` is the orthogonal matrix.

`R` is the upper triangular.

### lstsq( A, b )

Solves least squard problem for Ax=b as QR decomposition way.

If `b` is of the `[[b1], [b2], [b3]]` form, the method will return an array of the `[[x1], [x2], [x3]]` form solution.

Otherwise, if `b` is of the  `[b1, b2, b3]` form, the method will return an array of the `[x1,x2,x3]` form solution.




### jacobi()

### rungekutta()

### romberg()

### richardson()

### simpson()

### hermite()

### lagrange()

### cubic_spline()

### gauss_quadrature()

### PCA()
