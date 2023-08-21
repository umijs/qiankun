# @mapbox/hast-util-to-jsx

Transform [HAST](https://github.com/syntax-tree/hast) to JSX.

## Installation

```
npm install @mapbox/hast-util-to-jsx
```

## Usage

```js
const h = require('hyperscript');
const toJsx = require('@mapbox/hast-util-to-jsx');

const tree = h('div.one.two', id: 'bar' }, [
  h('p.hidden', { ariaHidden: true }, ['hidden text']),
  h('p', { style: 'color: pink; font-size: 2em;' }, ['fancy text'])
]);

console.log(toJsx(tree));
```

Yields (with whitespace collapsed):

```jsx
<div className="one two" id="bar">
  <p className="hidden" aria-hidden={true}>hidden text</p>
  <p style={{color: "pink", fontSize: "2em"}}>fancy text</p>
</div>
```

A few libraries exist to transform HTML to JSX.
Using this util, you can perform that transformation entirely within the ecosystem of [`unified`](https://github.com/unifiedjs/unified) syntax trees, using [`rehype`](https://github.com/rehypejs/rehype) to parse HTML and this util to stringify the tree into JSX.

## Related

- [`hast-util-to-html`](https://github.com/syntax-tree/hast-util-to-html) — Transform HAST to HTML.
- [`rehype`](https://github.com/rehypejs/rehype) — Process HTML as HAST.
