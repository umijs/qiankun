# tty-table 端子台

[![NPM version](https://badge.fury.io/js/tty-table.svg)](http://badge.fury.io/js/tty-table) [![Coverage Status](https://coveralls.io/repos/github/tecfu/tty-table/badge.svg?branch=master)](https://coveralls.io/github/tecfu/tty-table?branch=master)
---

Display your data in a table using a terminal, browser, or browser console.

---

## [Examples](examples/)

[See here for complete example list](examples/)


To view all example output:

```sh
$ git clone https://github.com/tecfu/tty-table && cd tty-table && npm i
$ npm run view-examples
```

### Terminal (Static)

[examples/styles-and-formatting.js](examples/styles-and-formatting.js)

![Static](https://cloud.githubusercontent.com/assets/7478359/15691679/07142030-273f-11e6-8f1e-25728d558a2d.png "Static Example") 

### Terminal (Streaming)

```
$ node examples/data/fake-stream.js | tty-table --format json --header examples/config/header.js
```

![Streaming](https://user-images.githubusercontent.com/7478359/51738817-47c25700-204d-11e9-9df1-04e478331658.gif "tty-table streaming example") 

- See the built-in help for the terminal version of tty-table with: 
```
$ tty-table -h
```

### Browser & Browser Console 

- View in Chrome or Chromium at [http://localhost:8070/examples/browser-example.html](http://localhost:8070/examples/browser-example.html) using a dockerized apache instance:

    ```sh
    git clone https://github.com/tecfu/tty-table
    cd tty-table
    docker run -dit --name tty-table-in-browser -p 8070:80 -v "$PWD":/usr/local/apache2/htdocs/ httpd:2.4
    ```

- [live demo (chrome only): jsfiddle](https://jsfiddle.net/nb14eyav/)
- [live demo (chrome only): plnkr](https://plnkr.co/edit/iQn9xn5yCY4NUkXRF87o?p=preview)
- [source: examples/browser-example.html](examples/browser-example.html)

![Browser Console Example](https://user-images.githubusercontent.com/7478359/74614563-cbcaff00-50e6-11ea-9101-5457497696b8.jpg "tty-table in the browser console") 

<br/>
<br/>

## API Reference 
<!--API-REF-->

<a name="new_Table_new"></a>
### Table(header ```array```, rows ```array```, options ```object```)

| Param | Type | Description |
| --- | --- | --- |
| [header](#header_options) | <code>array</code> | Per-column configuration. An array of objects, one object for each column. Each object contains properties you can use to configure that particular column. [See available properties](#header_options) |
| [rows](#rows_examples) | <code>array</code> | Your data. An array of arrays or objects. [See examples](#rows_examples) |
| [options](#options_properties) | <code>object</code> | Global table configuration. [See available properties](#options_properties) |


<br/>
<a name="header_options"></a>

#### header ```array of objects```

| Param | Type | Description |
| --- | --- | --- |
| alias | <code>string</code> | Text to display in column header cell |
| align | <code>string</code> | default: "center" |
| color | <code>string</code> | default: terminal default color |
| footerAlign | <code>string</code> | default: "center" |
| footerColor | <code>string</code> | default: terminal default color |
| formatter | <code>function(cellValue, columnIndex, rowIndex, rowData, inputData</code> | Runs a callback on each cell value in the parent column. <br/>Please note that fat arrow functions `() => {}` don't support scope overrides, and this feature won't work correctly within them.  |
| @formatter configure | <code>function(object)</code> | Configure cell properties. For example: <br/>`this.configure({ truncate: false, align: "left" })` [More here](https://github.com/tecfu/tty-table/blob/master/examples/truncated-lines.js#L100-L110). |
| @formatter resetStyle | <code>function(cellValue)</code> | Removes ANSI escape sequences. For example: <br/>`this.resetStyle("[32m myText[39m") // "myText"`<br/> |
| @formatter style | <code>function(cellValue, effect)</code> | Style cell value. For example: <br/>`this.style("mytext", "bold", "green", "underline")`<br/>For a full list of options in the terminal: [chalk](https://github.com/chalk/chalk). For a full list of options in the browser: [kleur](https://github.com/lukeed/kleur)|
| headerAlign | <code>string</code> | default: "center" |
| headerColor | <code>string</code> | default: terminal's default color |
| marginLeft | <code>integer</code> | default: 0 |
| marginTop | <code>integer</code> | default: 0 |
| paddingBottom | <code>integer</code> | default: 0 |
| paddingLeft | <code>integer</code> | default: 1 |
| paddingRight | <code>integer</code> | default: 1 |
| paddingTop | <code>integer</code> | default: 0 |
| value | <code>string</code> | Name of the property to display in each cell when data passed as an array of objects |
| width | <code>string</code> \|\| <code>integer</code> | default: "auto" <br/> Can be a percentage of table width i.e. "20%" or a fixed number of columns i.e. "20". <br/> When set to the default ("auto"), the column widths are made proportionate by the longest value in each column. <br/> Note: Percentage columns and fixed value colums not intended to be mixed in the same table.|

**Example**

```js
let header = [{
  value: "item",
  headerColor: "cyan",
  color: "white",
  align: "left",
  width: 20
},
{
  value: "price",
  color: "red",
  width: 10,
  formatter: function (value) {
    let str = `$${value.toFixed(2)}`
    return (value > 5) ? this.style(str, "green", "bold") : 
      this.style(str, "red", "underline")
  }
}]
```

<br/>
<br/>
<a name="rows_examples"></a>

#### rows ```array```

**Example**
- each row an array
```js
const rows = [
  ["hamburger",2.50],
]
```
- each row an object
```js
const rows = [
  {
    item: "hamburger",
    price: 2.50
  }
]
```


<br/>
<br/>
<a name="footer_example"></a>

#### footer ```array```
- Footer is optional

**Example**
```js
const footer = [
  "TOTAL",
  function (cellValue, columnIndex, rowIndex, rowData) {
    let total = rowData.reduce((prev, curr) => {
      return prev + curr[1]
    }, 0)
    .toFixed(2)

    return this.style(`$${total}`, "italic")
  }
]
``` 

<br/>
<br/>
<a name="options_properties"></a>

#### options ```object```

| Param | Type | Description |
| --- | --- | --- |
| borderStyle | <code>string</code> | default: "solid". <br/> options: "solid", "dashed", "none" |
| borderColor | <code>string</code> | default: terminal default color |
| color | <code>string</code> | default: terminal default color |
| compact | <code>boolean</code> | default: false <br/> Removes horizontal borders when true. |
| defaultErrorValue | <code>mixed</code> | default: '�' |
| defaultValue | <code>mixed</code> | default: '?' |
| errorOnNull | <code>boolean</code> | default: false |
| truncate | <code>mixed</code> | default: false <br/> When this property is set to a string, cell contents will be truncated by that string instead of wrapped when they extend beyond of the width of the cell.  <br/> For example if: <br/> <code>"truncate":"..."</code> <br/> the cell will be truncated with "..." <br/> Note: tty-table wraps overflowing cell text into multiple lines by default, so you would likely only utilize `truncate` for extremely long values. |
| width | <code>string</code> | default: "100%" <br/> Width of the table. Can be a percentage of i.e. "50%" or a fixed number of columns in the terminal viewport i.e. "100". <br/> Note: When you use a percentage, your table will be "responsive".|


**Example**
```js
const options = {
  borderStyle: "solid",
  borderColor: "blue",
  headerAlign: "center",
  align: "left",
  color: "white",
  truncate: "...",
  width: "90%"
}
```

<br/>

### Table.render() ⇒ <code>String</code>
<a name="Table.tableObject.render"></a>

Add method to render table to a string

**Example**  
```js
const out = Table(header,rows,options).render()
console.log(out); //prints output
```

<!--END-API-REF-->

<br/>
<br/>

## Installation

- [Terminal](docs/terminal.md):

```sh
$ npm install tty-table -g
```

- Node Module

```sh
$ npm install tty-table
```

- Browser

```js
import Table from 'https://cdn.jsdelivr.net/gh/tecfu/tty-table/dist/tty-table.esm.js'
let Table = require('tty-table')   // https://cdn.jsdelivr.net/gh/tecfu/tty-table/dist/tty-table.cjs.js
let Table = TTY_Table;             // https://cdn.jsdelivr.net/gh/tecfu/tty-table/dist/tty-table.umd.js
```

## Version Compatibility

| Node Version   |   tty-table Version  |
| -------------- | ------------------|
| 8              | >= 2.0            |
| 0.11           | >= 0.0            |

## Running tests

```sh
$ npm test
```

```sh
$ npm run coverage
```

## Saving the output of new unit tests 

```sh
$ npm run save-tests
```

## Dev Tips

- To generate vim tags (make sure [jsctags](https://github.com/ramitos/jsctags) is installed globally)

```sh
$ npm run tags
```

- To generate vim tags on file save 

```sh
$ npm run watch-tags
```

## Pull Requests

Pull requests are encouraged!

- Please remember to add a unit test when necessary
- Please format your commit messages according to the ["Conventional Commits"](https://www.conventionalcommits.org/en/v1.0.0/) specification

If you aren't familiar with Conventional Commits, here's a good [article on the topic](https://dev.to/maniflames/how-conventional-commits-improved-my-git-skills-1jfk)

TL/DR:

- feat: a feature that is visible for end users.
- fix: a bugfix that is visible for end users.
- chore: a change that doesn't impact end users (e.g. chances to CI pipeline)
- docs: a change in the README or documentation
- refactor: a change in production code focused on readability, style and/or performance.


## [Packaging as a distributable](packaging.md)


## License

[MIT License](https://opensource.org/licenses/MIT)

Copyright 2015-2020, Tecfu. 
