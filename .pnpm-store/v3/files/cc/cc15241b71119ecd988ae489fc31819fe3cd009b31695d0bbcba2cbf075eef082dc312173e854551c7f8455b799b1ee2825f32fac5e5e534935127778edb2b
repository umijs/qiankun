[![view on npm](https://badgen.net/npm/v/ansi-escape-sequences)](https://www.npmjs.org/package/ansi-escape-sequences)
[![npm module downloads](https://badgen.net/npm/dt/ansi-escape-sequences)](https://www.npmjs.org/package/ansi-escape-sequences)
[![Gihub repo dependents](https://badgen.net/github/dependents-repo/75lb/ansi-escape-sequences)](https://github.com/75lb/ansi-escape-sequences/network/dependents?dependent_type=REPOSITORY)
[![Gihub package dependents](https://badgen.net/github/dependents-pkg/75lb/ansi-escape-sequences)](https://github.com/75lb/ansi-escape-sequences/network/dependents?dependent_type=PACKAGE)
[![Node.js CI](https://github.com/75lb/ansi-escape-sequences/actions/workflows/node.js.yml/badge.svg)](https://github.com/75lb/ansi-escape-sequences/actions/workflows/node.js.yml)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)

# ansi-escape-sequences

A simple library containing all known terminal [ansi escape codes and sequences](http://en.wikipedia.org/wiki/ANSI_escape_code). Useful for adding colour to your command-line output, or building a dynamic text user interface.

## API Reference

**Example**  
```js
import ansi from 'ansi-escape-sequences'
```

* [ansi-escape-sequences](#module_ansi-escape-sequences)
    * [.cursor](#module_ansi-escape-sequences.cursor)
        * [.hide](#module_ansi-escape-sequences.cursor.hide)
        * [.show](#module_ansi-escape-sequences.cursor.show)
        * [.up([lines])](#module_ansi-escape-sequences.cursor.up) ⇒ <code>string</code>
        * [.down([lines])](#module_ansi-escape-sequences.cursor.down) ⇒ <code>string</code>
        * [.forward([lines])](#module_ansi-escape-sequences.cursor.forward) ⇒ <code>string</code>
        * [.back([lines])](#module_ansi-escape-sequences.cursor.back) ⇒ <code>string</code>
        * [.nextLine([lines])](#module_ansi-escape-sequences.cursor.nextLine) ⇒ <code>string</code>
        * [.previousLine([lines])](#module_ansi-escape-sequences.cursor.previousLine) ⇒ <code>string</code>
        * [.horizontalAbsolute(n)](#module_ansi-escape-sequences.cursor.horizontalAbsolute) ⇒ <code>string</code>
        * [.position(n, m)](#module_ansi-escape-sequences.cursor.position) ⇒ <code>string</code>
    * [.erase](#module_ansi-escape-sequences.erase)
        * [.display(n)](#module_ansi-escape-sequences.erase.display) ⇒ <code>string</code>
        * [.inLine(n)](#module_ansi-escape-sequences.erase.inLine) ⇒ <code>string</code>
    * [.style](#module_ansi-escape-sequences.style) : <code>enum</code>
    * [.rgb(r, g, b)](#module_ansi-escape-sequences.rgb) ⇒ <code>string</code>
    * [.bgRgb(r, g, b)](#module_ansi-escape-sequences.bgRgb) ⇒ <code>string</code>
    * [.styles(styles)](#module_ansi-escape-sequences.styles) ⇒ <code>string</code>
    * [.format(str, [styleArray])](#module_ansi-escape-sequences.format) ⇒ <code>string</code>

<a name="module_ansi-escape-sequences.cursor"></a>

## ansi.cursor
cursor-related sequences

**Kind**: static property of [<code>ansi-escape-sequences</code>](#module_ansi-escape-sequences)  

* [.cursor](#module_ansi-escape-sequences.cursor)
    * [.hide](#module_ansi-escape-sequences.cursor.hide)
    * [.show](#module_ansi-escape-sequences.cursor.show)
    * [.up([lines])](#module_ansi-escape-sequences.cursor.up) ⇒ <code>string</code>
    * [.down([lines])](#module_ansi-escape-sequences.cursor.down) ⇒ <code>string</code>
    * [.forward([lines])](#module_ansi-escape-sequences.cursor.forward) ⇒ <code>string</code>
    * [.back([lines])](#module_ansi-escape-sequences.cursor.back) ⇒ <code>string</code>
    * [.nextLine([lines])](#module_ansi-escape-sequences.cursor.nextLine) ⇒ <code>string</code>
    * [.previousLine([lines])](#module_ansi-escape-sequences.cursor.previousLine) ⇒ <code>string</code>
    * [.horizontalAbsolute(n)](#module_ansi-escape-sequences.cursor.horizontalAbsolute) ⇒ <code>string</code>
    * [.position(n, m)](#module_ansi-escape-sequences.cursor.position) ⇒ <code>string</code>

<a name="module_ansi-escape-sequences.cursor.hide"></a>

### cursor.hide
Hides the cursor

**Kind**: static property of [<code>cursor</code>](#module_ansi-escape-sequences.cursor)  
<a name="module_ansi-escape-sequences.cursor.show"></a>

### cursor.show
Shows the cursor

**Kind**: static property of [<code>cursor</code>](#module_ansi-escape-sequences.cursor)  
<a name="module_ansi-escape-sequences.cursor.up"></a>

### cursor.up([lines]) ⇒ <code>string</code>
Moves the cursor `lines` cells up. If the cursor is already at the edge of the screen, this has no effect

**Kind**: static method of [<code>cursor</code>](#module_ansi-escape-sequences.cursor)  

| Param | Type | Default |
| --- | --- | --- |
| [lines] | <code>number</code> | <code>1</code> | 

<a name="module_ansi-escape-sequences.cursor.down"></a>

### cursor.down([lines]) ⇒ <code>string</code>
Moves the cursor `lines` cells down. If the cursor is already at the edge of the screen, this has no effect

**Kind**: static method of [<code>cursor</code>](#module_ansi-escape-sequences.cursor)  

| Param | Type | Default |
| --- | --- | --- |
| [lines] | <code>number</code> | <code>1</code> | 

<a name="module_ansi-escape-sequences.cursor.forward"></a>

### cursor.forward([lines]) ⇒ <code>string</code>
Moves the cursor `lines` cells forward. If the cursor is already at the edge of the screen, this has no effect

**Kind**: static method of [<code>cursor</code>](#module_ansi-escape-sequences.cursor)  

| Param | Type | Default |
| --- | --- | --- |
| [lines] | <code>number</code> | <code>1</code> | 

<a name="module_ansi-escape-sequences.cursor.back"></a>

### cursor.back([lines]) ⇒ <code>string</code>
Moves the cursor `lines` cells back. If the cursor is already at the edge of the screen, this has no effect

**Kind**: static method of [<code>cursor</code>](#module_ansi-escape-sequences.cursor)  

| Param | Type | Default |
| --- | --- | --- |
| [lines] | <code>number</code> | <code>1</code> | 

<a name="module_ansi-escape-sequences.cursor.nextLine"></a>

### cursor.nextLine([lines]) ⇒ <code>string</code>
Moves cursor to beginning of the line n lines down.

**Kind**: static method of [<code>cursor</code>](#module_ansi-escape-sequences.cursor)  

| Param | Type | Default |
| --- | --- | --- |
| [lines] | <code>number</code> | <code>1</code> | 

<a name="module_ansi-escape-sequences.cursor.previousLine"></a>

### cursor.previousLine([lines]) ⇒ <code>string</code>
Moves cursor to beginning of the line n lines up.

**Kind**: static method of [<code>cursor</code>](#module_ansi-escape-sequences.cursor)  

| Param | Type | Default |
| --- | --- | --- |
| [lines] | <code>number</code> | <code>1</code> | 

<a name="module_ansi-escape-sequences.cursor.horizontalAbsolute"></a>

### cursor.horizontalAbsolute(n) ⇒ <code>string</code>
Moves the cursor to column n.

**Kind**: static method of [<code>cursor</code>](#module_ansi-escape-sequences.cursor)  

| Param | Type | Description |
| --- | --- | --- |
| n | <code>number</code> | column number |

<a name="module_ansi-escape-sequences.cursor.position"></a>

### cursor.position(n, m) ⇒ <code>string</code>
Moves the cursor to row n, column m. The values are 1-based, and default to 1 (top left corner) if omitted.

**Kind**: static method of [<code>cursor</code>](#module_ansi-escape-sequences.cursor)  

| Param | Type | Description |
| --- | --- | --- |
| n | <code>number</code> | row number |
| m | <code>number</code> | column number |

<a name="module_ansi-escape-sequences.erase"></a>

## ansi.erase
erase sequences

**Kind**: static property of [<code>ansi-escape-sequences</code>](#module_ansi-escape-sequences)  

* [.erase](#module_ansi-escape-sequences.erase)
    * [.display(n)](#module_ansi-escape-sequences.erase.display) ⇒ <code>string</code>
    * [.inLine(n)](#module_ansi-escape-sequences.erase.inLine) ⇒ <code>string</code>

<a name="module_ansi-escape-sequences.erase.display"></a>

### erase.display(n) ⇒ <code>string</code>
Clears part of the screen. If n is 0 (or missing), clear from cursor to end of screen. If n is 1, clear from cursor to beginning of the screen. If n is 2, clear entire screen.

**Kind**: static method of [<code>erase</code>](#module_ansi-escape-sequences.erase)  

| Param | Type |
| --- | --- |
| n | <code>number</code> | 

<a name="module_ansi-escape-sequences.erase.inLine"></a>

### erase.inLine(n) ⇒ <code>string</code>
Erases part of the line. If n is zero (or missing), clear from cursor to the end of the line. If n is one, clear from cursor to beginning of the line. If n is two, clear entire line. Cursor position does not change.

**Kind**: static method of [<code>erase</code>](#module_ansi-escape-sequences.erase)  

| Param | Type |
| --- | --- |
| n | <code>number</code> | 

<a name="module_ansi-escape-sequences.style"></a>

## ansi.style : <code>enum</code>
Various formatting styles (aka Select Graphic Rendition codes).

**Kind**: static enum of [<code>ansi-escape-sequences</code>](#module_ansi-escape-sequences)  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| reset | <code>string</code> | <code>&quot;\u001b[0m&quot;</code> | 
| bold | <code>string</code> | <code>&quot;\u001b[1m&quot;</code> | 
| italic | <code>string</code> | <code>&quot;\u001b[3m&quot;</code> | 
| underline | <code>string</code> | <code>&quot;\u001b[4m&quot;</code> | 
| fontDefault | <code>string</code> | <code>&quot;\u001b[10m&quot;</code> | 
| font2 | <code>string</code> | <code>&quot;\u001b[11m&quot;</code> | 
| font3 | <code>string</code> | <code>&quot;\u001b[12m&quot;</code> | 
| font4 | <code>string</code> | <code>&quot;\u001b[13m&quot;</code> | 
| font5 | <code>string</code> | <code>&quot;\u001b[14m&quot;</code> | 
| font6 | <code>string</code> | <code>&quot;\u001b[15m&quot;</code> | 
| imageNegative | <code>string</code> | <code>&quot;\u001b[7m&quot;</code> | 
| imagePositive | <code>string</code> | <code>&quot;\u001b[27m&quot;</code> | 
| black | <code>string</code> | <code>&quot;\u001b[30m&quot;</code> | 
| red | <code>string</code> | <code>&quot;\u001b[31m&quot;</code> | 
| green | <code>string</code> | <code>&quot;\u001b[32m&quot;</code> | 
| yellow | <code>string</code> | <code>&quot;\u001b[33m&quot;</code> | 
| blue | <code>string</code> | <code>&quot;\u001b[34m&quot;</code> | 
| magenta | <code>string</code> | <code>&quot;\u001b[35m&quot;</code> | 
| cyan | <code>string</code> | <code>&quot;\u001b[36m&quot;</code> | 
| white | <code>string</code> | <code>&quot;\u001b[37m&quot;</code> | 
| grey | <code>string</code> | <code>&quot;\u001b[90m&quot;</code> | 
| gray | <code>string</code> | <code>&quot;\u001b[90m&quot;</code> | 
| brightRed | <code>string</code> | <code>&quot;\u001b[91m&quot;</code> | 
| brightGreen | <code>string</code> | <code>&quot;\u001b[92m&quot;</code> | 
| brightYellow | <code>string</code> | <code>&quot;\u001b[93m&quot;</code> | 
| brightBlue | <code>string</code> | <code>&quot;\u001b[94m&quot;</code> | 
| brightMagenta | <code>string</code> | <code>&quot;\u001b[95m&quot;</code> | 
| brightCyan | <code>string</code> | <code>&quot;\u001b[96m&quot;</code> | 
| brightWhite | <code>string</code> | <code>&quot;\u001b[97m&quot;</code> | 
| "bg-black" | <code>string</code> | <code>&quot;\u001b[40m&quot;</code> | 
| "bg-red" | <code>string</code> | <code>&quot;\u001b[41m&quot;</code> | 
| "bg-green" | <code>string</code> | <code>&quot;\u001b[42m&quot;</code> | 
| "bg-yellow" | <code>string</code> | <code>&quot;\u001b[43m&quot;</code> | 
| "bg-blue" | <code>string</code> | <code>&quot;\u001b[44m&quot;</code> | 
| "bg-magenta" | <code>string</code> | <code>&quot;\u001b[45m&quot;</code> | 
| "bg-cyan" | <code>string</code> | <code>&quot;\u001b[46m&quot;</code> | 
| "bg-white" | <code>string</code> | <code>&quot;\u001b[47m&quot;</code> | 
| "bg-grey" | <code>string</code> | <code>&quot;\u001b[100m&quot;</code> | 
| "bg-gray" | <code>string</code> | <code>&quot;\u001b[100m&quot;</code> | 
| "bg-brightRed" | <code>string</code> | <code>&quot;\u001b[101m&quot;</code> | 
| "bg-brightGreen" | <code>string</code> | <code>&quot;\u001b[102m&quot;</code> | 
| "bg-brightYellow" | <code>string</code> | <code>&quot;\u001b[103m&quot;</code> | 
| "bg-brightBlue" | <code>string</code> | <code>&quot;\u001b[104m&quot;</code> | 
| "bg-brightMagenta" | <code>string</code> | <code>&quot;\u001b[105m&quot;</code> | 
| "bg-brightCyan" | <code>string</code> | <code>&quot;\u001b[106m&quot;</code> | 
| "bg-brightWhite" | <code>string</code> | <code>&quot;\u001b[107m&quot;</code> | 

**Example**  
```js
console.log(ansi.style.red + 'this is red' + ansi.style.reset)
```
<a name="module_ansi-escape-sequences.rgb"></a>

## ansi.rgb(r, g, b) ⇒ <code>string</code>
Returns a 24-bit "true colour" foreground colour escape sequence.

**Kind**: static method of [<code>ansi-escape-sequences</code>](#module_ansi-escape-sequences)  

| Param | Type | Description |
| --- | --- | --- |
| r | <code>number</code> | Red value. |
| g | <code>number</code> | Green value. |
| b | <code>number</code> | Blue value. |

**Example**  
```js
> ansi.rgb(120, 0, 120)
'\u001b[38;2;120;0;120m'
```
<a name="module_ansi-escape-sequences.bgRgb"></a>

## ansi.bgRgb(r, g, b) ⇒ <code>string</code>
Returns a 24-bit "true colour" background colour escape sequence.

**Kind**: static method of [<code>ansi-escape-sequences</code>](#module_ansi-escape-sequences)  

| Param | Type | Description |
| --- | --- | --- |
| r | <code>number</code> | Red value. |
| g | <code>number</code> | Green value. |
| b | <code>number</code> | Blue value. |

**Example**  
```js
> ansi.bgRgb(120, 0, 120)
'\u001b[48;2;120;0;120m'
```
<a name="module_ansi-escape-sequences.styles"></a>

## ansi.styles(styles) ⇒ <code>string</code>
Returns an ansi sequence setting one or more styles.

**Kind**: static method of [<code>ansi-escape-sequences</code>](#module_ansi-escape-sequences)  

| Param | Type | Description |
| --- | --- | --- |
| styles | <code>string</code> \| <code>Array.&lt;string&gt;</code> | One or more style strings. |

**Example**  
```js
> ansi.styles('green')
'\u001b[32m'

> ansi.styles([ 'green', 'underline' ])
'\u001b[32m\u001b[4m'

> ansi.styles([ 'bg-red', 'rgb(200,200,200)' ])
'\u001b[41m\u001b[38;2;200;200;200m'
```
<a name="module_ansi-escape-sequences.format"></a>

## ansi.format(str, [styleArray]) ⇒ <code>string</code>
A convenience function, applying the styles provided in `styleArray` to the input string.

Partial, inline styling can also be applied using the syntax `[style-list]{text to format}` anywhere within the input string, where `style-list` is a space-separated list of styles from [ansi.style](#module_ansi-escape-sequences.style). For example `[bold white bg-red]{bold white text on a red background}`.

24-bit "true colour" values can be set using `rgb(n,n,n)` syntax (no spaces), for example `[rgb(255,128,0) underline]{orange underlined}`. Background 24-bit colours can be set using `bg-rgb(n,n,n)` syntax.

**Kind**: static method of [<code>ansi-escape-sequences</code>](#module_ansi-escape-sequences)  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | The string to format. Can also include inline-formatting using the syntax `[style-list]{text to format}` anywhere within the string. |
| [styleArray] | <code>string</code> \| <code>Array.&lt;string&gt;</code> | One or more style strings to apply to the input string. Valid strings are any property from the [`ansi.style`](https://github.com/75lb/ansi-escape-sequences#ansistyle--enum) object (e.g. `red` or `bg-red`), `rgb(n,n,n)` or `bg-rgb(n,n,n)`. |

**Example**  
```js
> ansi.format('what?', 'green')
'\u001b[32mwhat?\u001b[0m'

> ansi.format('what?', ['green', 'bold'])
'\u001b[32m\u001b[1mwhat?\u001b[0m'

> ansi.format('something', ['rgb(255,128,0)', 'bold'])
'\u001b[38;2;255;128;0m\u001b[1msomething\u001b[0m'

> ansi.format('Inline styling: [rgb(255,128,0) bold]{something}')
'Inline styling: \u001b[38;2;255;128;0m\u001b[1msomething\u001b[0m'

> ansi.format('Inline styling: [bg-rgb(255,128,0) bold]{something}')
'Inline styling: \u001b[48;2;255;128;0m\u001b[1msomething\u001b[0m'
```

## Load anywhere

This library is compatible with Node.js, the Web and any style of module loader. It can be loaded anywhere, natively without transpilation.

Node.js:

```js
const ansi = require('ansi-escape-sequences')
```

Within Node.js with ECMAScript Module support enabled:

```js
import ansi from 'ansi-escape-sequences'
```

Within a modern browser ECMAScript Module:

```js
import ansi from './node_modules/ansi-escape-sequences/dist/index.mjs'
```

* * *

&copy; 2014-23 Lloyd Brookes \<75pound@gmail.com\>.

Tested by [test-runner](https://github.com/test-runner-js/test-runner). Documented by [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown).
