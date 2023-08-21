# eslint-ast-utils [![Build Status](https://travis-ci.org/jfmengels/eslint-ast-utils.svg?branch=master)](https://travis-ci.org/jfmengels/eslint-ast-utils)

> Utility library to manipulate ASTs for ESLint projects


## Install

```
$ npm install --save eslint-ast-utils
```

## Usage

```js
const astUtils = require('eslint-ast-utils');
```


## API

### astUtils.isStaticRequire(node)

Checks whether `node` is a call to CommonJS's `require` function.

Returns `true` if and only if:
- `node` is a `CallExpression`
- `node`'s callee is an `Identifier` named `require`
- `node` has exactly 1 `Literal` argument whose value is a `string`

Example:
```js
require('lodash');
// => true
require(foo);
// => false
foo('lodash');
// => false
```

Usage example:
```js
function create(context) {
	return {
		CallExpression(node) {
			if (astUtils.isStaticRequire(node)) {
				context.report({
					node: node,
					message: 'Use import syntax rather than `require`'
				});
			}
		}
	};
}
```

### astUtils.getRequireSource(node)

Gets the source of a `require()` call. If `node` is not a `require` call (in the definition of [`isStaticRequire`](#astutilsisstaticrequirenode)), it will return `undefined`.

Example:
```js
require('lodash');
// => 'lodash'
require('./foo');
// => './foo'
```

Usage example:
```js
function create(context) {
	return {
		CallExpression(node) {
			if (astUtils.isStaticRequire(node) && astUtils.getRequireSource(node) === 'underscore') {
				context.report({
					node: node,
					message: 'Use `lodash` instead of `underscore`'
				});
			}
		}
	};
}
```

### astUtils.containsIdentifier(name, node)

Checks if there is a reference to a variable named `name` inside of `node`.

Returns true if and only if:
- There is an `Identifier` named `name` inside of `node`
- That `Identifier` is a variable (i.e. not a static property name for instance)
- That `Identifier` does not reference a different variable named `name` introduced in a sub-scope of `node`.

Example:
```js
foo(a);
// containsIdentifier('a', node) // => true
// containsIdentifier('b', node) // => true

function foo(fn) {
	return function(a) {
		return fn(a);
	};
}
// containsIdentifier('a', node) // => false
```

Usage example:
```js
function create(context) {
	return {
		FunctionDeclaration(node) {
			node.params.forEach(param => {
				if (param.type === 'Identifier' && !astUtils.containsIdentifier(param.name, node.body)) {
					context.report({
						node: node,
						message: `${name} is never used`
					});
				}
			});
		}
	};
}
```

### astUtils.someContainIdentifier(name, nodes)

Checks if there is a reference to a variable named `name` inside any node of the `nodes` array. Will return `false` if `nodes` is not an array.
This is a shorthand version of [`containsIdentifier`](#astutilscontainsidentifier) that works for arrays. The following are equivalent:

```js
[node1, node2, node3].some(node => astUtils.containsIdentifier('a', node));
// equivalent to
astUtils.someContainIdentifier('a', [node1, node2, node3]);
```

### astUtils.getPropertyName(node)

Get the name of a `MemberExpression`'s property. Returns:
- a `string` if the property is accessed through dot notation.
- a `string` if the property is accessed through brackets and is a string.
- a `number` if the property is accessed through brackets and is a number.
- `undefined` if `node` is not a `MemberExpression`
- `undefined` if the property name is a hard to compute expression.

Example:
```js
foo.bar
// => 'bar'
foo['bar']
// => 'bar'
foo[bar]
// => undefined
foo[0]
// => 0 # Number
foo[null]
// => null
foo[undefined]
// => undefined
```

Usage example:
```js
function create(context) {
	return {
		MemberExpression(node) {
			if (astUtils.getPropertyName(node).startsWith('_')) {
				context.report({
					node: node,
					message: 'Don\'t access "private" fields'
				});
			}
		}
	};
}
```

### astUtils.computeStaticExpression(node)

Get the value of an expression that can be statically computed, i.e. without variables references or expressions too complex.

Returns:
- `undefined` if the value could not be statically computed.
- An object with a `value` property containing the computed value.

Example:
```js
foo
// => undefined
42
// => {value: 42}
'foo'
// => {value: 'foo'}
undefined
// => {value: undefined}
null
// => {value: null}
1 + 2 - 4 + (-1)
// => {value: -2}
true ? 1 : 2
// => {value: 1}
`foo ${'bar'}`
// => {value: 'foo bar'}
```

Usage example:
```js
function create(context) {
	return {
		TemplateLiteral(node) {
			const expression = astUtils.computeStaticExpression(node);
			if (expression) {
				context.report({
					node: node,
					message: `You can replace this template literal by the regular string '${expression.value}'.`
				});
			}
		}
	};
}
```

### astUtils.isPromise(node)

Checks whether `node` is a Promise.

Returns `true` if and only if `node` is one of the following:
- a call of an expression's `then` or `catch` properties
- a call to a property of `Promise` (except `cancel`, `promisify`,  `promisifyAll` and `is`)
- a call to `new Promise`

If `node` uses unknown properties of a value that would be considered a Promise, `node` itself would not be considered as a Promise.

Example:
```js
foo.then(fn);
// => true
foo.catch(fn);
// => true
foo.then(fn).catch(fn);
// => true
foo.then(fn).isFulfilled(fn); // isFulfilled(fn) may not return a Promise
// => false

Promise.resolve(value);
// => true
Promise.reject(value);
// => true
Promise.race(promises);
// => true
Promise.all(promises);
// => true
Promise.map(promises, fn); // Bluebird method
// => true

new Promise(fn);
// => true
new Promise.resolve(value);
// => false
```

Usage example:
```js
function create(context) {
	function reportIfPromise(node) {
		if (astUtils.isPromise(node)) {
			context.report({
				node: node,
				message: 'Prefer using async/await'
			});
		}
	}

	return {
		CallExpression: reportIfPromise,
		NewExpression: reportIfPromise
	};
}
```

### astUtils.isFunctionExpression(node)

Checks whether `node` is a function expression or an arrow function expression (not a function declaration).

If `node` uses unknown properties of a value that would be considered a Promise, `node` itself would not be considered as a Promise.

Example:
```js
(function foo() {})
// => true
() => {}
// => true
function foo() {} // function declaration
// => false
```

Usage example:
```js
function create(context) {
	return {
		CallExpression(node) {
			if (node.callee.type === 'Identifier'
				&& node.callee.name === 'test'
				&& !astUtils.isFunctionExpression(node.arguments[0])
				&& !astUtils.isFunctionExpression(node.arguments[1])
			) {
				context.report({
					node: node,
					message: 'You need to pass a function to test()'
				});
			}
		}
	};
}
```

## License

MIT © [Jeroen Engels](https://github.com/jfmengels)
