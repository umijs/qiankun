## Overview

### Description

jStat is a statistical library written in JavaScript that allows you to perform advanced statistical operations without the need of a dedicated statistical language (e.g. MATLAB or R). It is available for download on [Github](http://github.com/jstat/jstat).

### Architecture

Calculations are done by *static methods*, while working with groups of numbers is handled by the *instance methods*.
Here is a pseudo example of what is happening in `core.js`:

    jStat.min = function( arr ) {
        return Math.min.apply( null, arr );
    }

    jStat.prototype.min = function() {
        var i = 0,
            newval = [];
        while( newval.push( jStat.min( this[i] )), ++i < this.length );
        return newval;
    }

`jStat.min` does the actual calculation on the array, while `jStat.prototype.min` is a wrapper to help work with the jStat object.
The reason for this approach is to allow for maxium flexibility to other developers who want to extend jStat, while allowing for easy creation of wrappers.
This way extending jStat requires minimal performance overhead and allows for more unique wrappers to be created.

**Remember: Static methods almost always return native JavaScript types. Instance methods always return a jStat object.**

Here is a simple example on the difference in usage between the static and instance methods:

    var myVect = [2,6,4,7,2,7,4],
        jObj = jStat( myVect );

    // calculate the sum of the the vector
    jStat.sum( myVect ) === 32;
    jObj.sum() === 32;

Now say we want to do several operations on the vector (e.g. sum, min, max, and standard deviation).
This can be accomplished using the static methods, but each will need to be called separately.
By using the jStat object we can pass callback functions and chain the execution of each operation:

    jObj.sum( function( val ) {
        // val === sum
    }).min( function( val ) {
        // val === min
    }).max( function( val ) {
        // val === max
    }).stdev( function( val ) {
        // val === st. dev.
    });

This method sets each calculation to be executed in an asynchronous queue.
Very useful method of preventing blocking when working with large data sets.

Let's look at a few chaining and shorthand examples:

    jStat( 0, 1, 11 ) === jStat( jStat.seq( 0, 1, 11 ));
    jStat().rand( 4, 4 ) === jStat( jStat.rand( 4, 4 ));

    jStat().create( 5, function( x, y ) {
        return ( x + Math.random()) / ( y + Math.random());
    }).min( true, function( x ) {
        // do something with the min value
    }).beta( 0.5, 0.5 ).pdf();  // generate and return the pdf
                                // of the beta function for all values
