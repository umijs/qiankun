## Regression Models

## Instance Functionality

### ols( endog, exog )

What's the `endog`, `exog`?

Please see:

http://statsmodels.sourceforge.net/stable/endog_exog.html

`ols` use ordinary least square(OLS) method to estimate linear model and return
a `model`object.

`model` object attribute is vrey like to `statsmodels` result object attribute
(nobs,coef,...).

The following example is compared by `statsmodels`. They take same result
exactly.

		var A=[[1,2,3],
            [1,1,0],
            [1,-2,3],
            [1,3,4],
            [1,-10,2],
            [1,4,4],
            [1,10,2],
            [1,3,2],
            [1,4,-1]];
		var b=[1,-2,3,4,-5,6,7,-8,9];
		var model=jStat.models.ols(b,A);

    // coefficient estimated
    model.coef // -> [0.662197222856431, 0.5855663255775336, 0.013512111085743017]

		// R2
    model.R2 // -> 0.309

		// t test P-value
    model.t.p // -> [0.8377444317889267, 0.15296736158442314, 0.9909627983826583]

		// f test P-value
		model.f.pvalue // -> 0.3306363671859872

The adjusted R^2 provided by jStat is the formula variously called the 'Wherry Formula',
'Ezekiel Formula', 'Wherry/McNemar Formula', or the 'Cohen/Cohen Formula', and is the same
as the adjusted R^2 value provided by R's `summary.lm` method on a linear model.
