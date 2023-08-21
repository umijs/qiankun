'use strict';

const h = require('hastscript');
const u = require('unist-builder');
const toJsx = require('..');

test('should stringify special camel-cased properties', () => {
  const actual = toJsx(h('i', { className: ['alpha'] }, 'bravo'));
  expect(actual).toBe('<i className="alpha">bravo</i>');
});

test('should kebabe-case data-* attributes', () => {
  const actual = toJsx(h('i', { dataFoo: 'alpha' }, 'bravo'));
  expect(actual).toBe('<i data-foo="alpha">bravo</i>');
});

test('should kebab-case numeric data-* attributes', () => {
  const actual = toJsx(h('i', { data123: 'alpha' }, 'bravo'));
  expect(actual).toBe('<i data-123="alpha">bravo</i>');
});

test('should kebab-case aria-* attributes', () => {
  const actual = toJsx(h('i', { ariaLabel: 'alpha' }, 'bravo'));
  expect(actual).toBe('<i aria-label="alpha">bravo</i>');
});

test('should show empty string attributes', () => {
  const actual = toJsx(h('img', { alt: '' }));
  expect(actual).toBe('<img alt="" />');
});

test('should stringify multiple properties', () => {
  const actual = toJsx(
    h('i', { className: ['a', 'b'], title: 'c d' }, 'bravo')
  );
  expect(actual).toBe('<i className="a b" title="c d">bravo</i>');
});

test('should stringify space-separated attributes', () => {
  const actual = toJsx(h('i', { className: ['alpha', 'charlie'] }, 'bravo'));
  expect(actual).toBe('<i className="alpha charlie">bravo</i>');
});

test('should stringify comma-separated attributes', () => {
  const actual = toJsx(h('input', { type: 'file', accept: ['jpg', 'jpeg'] }));
  expect(actual).toBe('<input type="file" accept="jpg, jpeg" />');
});

test('should stringify unknown lists as space-separated', () => {
  const actual = toJsx(h('span', { dataUnknown: ['alpha', 'bravo'] }));
  expect(actual).toBe('<span data-unknown="alpha bravo" />');
});

test('should set known boolean attributes set to `true`', () => {
  const actual = toJsx(h('i', { hidden: true }, 'bravo'));
  expect(actual).toBe('<i hidden={true}>bravo</i>');
});

test('should set known boolean attributes set to `false`', () => {
  const actual = toJsx(h('i', { hidden: false }, 'bravo'));
  expect(actual).toBe('<i hidden={false}>bravo</i>');
});

test('should set unknown boolean attributes set to `false`', () => {
  const actual = toJsx(h('i', { dataUnknown: false }, 'bravo'));
  expect(actual).toBe('<i data-unknown={false}>bravo</i>');
});

test('should set unknown boolean attributes set to `true`', () => {
  const actual = toJsx(h('i', { dataUnknown: true }, 'bravo'));
  expect(actual).toBe('<i data-unknown={true}>bravo</i>');
});

test('should set positive known numeric attributes', () => {
  const actual = toJsx(h('i', { cols: 1 }, 'bravo'));
  expect(actual).toBe('<i cols={1}>bravo</i>');
});

test('should set negative known numeric attributes', () => {
  const actual = toJsx(h('i', { cols: -1 }, 'bravo'));
  expect(actual).toBe('<i cols={-1}>bravo</i>');
});

test('should set known numeric attributes set to `0`', () => {
  const actual = toJsx(h('i', { cols: 0 }, 'bravo'));
  expect(actual).toBe('<i cols={0}>bravo</i>');
});

test('should ignore known numeric attributes set to `NaN`', () => {
  const actual = toJsx(h('i', { cols: NaN }, 'bravo'));
  expect(actual).toBe('<i>bravo</i>');
});

test('should stringify other attributes', () => {
  const actual = toJsx(h('i', { id: 'alpha' }, 'bravo'));
  expect(actual).toBe('<i id="alpha">bravo</i>');
});

test(
  'should quote smartly if the other quote is less ' + 'prominent (#1)',
  () => {
    const actual = toJsx(h('img', { alt: '"some \' stuff"' }), {
      quote: '"',
      quoteSmart: true
    });
    expect(actual).toBe(`<img alt="&#x22;some ' stuff&#x22;" />`);
  }
);

test(
  'should quote smartly if the other quote is less ' + 'prominent (#2)',
  () => {
    const actual = toJsx(h('img', { alt: "'some \" stuff'" }), {
      quote: "'",
      quoteSmart: true
    });
    expect(actual).toBe(`<img alt="'some &#x22; stuff'" />`);
  }
);

test('should keep ignore attributes set to `null`', () => {
  const actual = toJsx(
    u(
      'element',
      {
        tagName: 'i',
        properties: { id: null }
      },
      [u('text', 'bravo')]
    )
  );
  expect(actual).toBe('<i id={null}>bravo</i>');
});

test('should ignore attributes set to `undefined`', () => {
  const actual = toJsx(
    u(
      'element',
      {
        tagName: 'i',
        properties: { id: undefined }
      },
      [u('text', 'bravo')]
    )
  );
  expect(actual).toBe('<i>bravo</i>');
});

test('should set positive known numeric attributes', () => {
  const actual = toJsx(h('i', { cols: 1 }, 'bravo'));
  expect(actual).toBe('<i cols={1}>bravo</i>');
});

test('should convert style attribute to an object', () => {
  const actual = toJsx(
    h('span', { style: 'color: pink; padding-left: 10px' }, 'bravo')
  );
  expect(actual).toBe(
    '<span style={{color: "pink", paddingLeft: "10px"}}>bravo</span>'
  );
});

test('transformElement that does not return props', () => {
  const options = {
    transformElement: name => {
      if (name === 'code') {
        return {
          name: 'MyCode'
        };
      }
    }
  };

  const actual = toJsx(
    h('code', { style: 'color: pink; padding-left: 10px' }, 'bravo'),
    options
  );

  expect(actual).toBe(
    '<MyCode style={{color: "pink", paddingLeft: "10px"}}>bravo</MyCode>'
  );
});

test('transformElement that does return props', () => {
  const options = {
    transformElement: name => {
      if (name === 'code') {
        return {
          name: 'MyCode',
          props: { foo: 'bar', style: { color: 'green' } }
        };
      }
    }
  };

  const actual = toJsx(
    h('code', { style: 'color: pink; padding-left: 10px' }, 'bravo'),
    options
  );

  expect(actual).toBe(
    '<MyCode foo="bar" style={{color: "green"}}>bravo</MyCode>'
  );
});

test('realistic transformElement', () => {
  const options = {
    transformElement: (name, props) => {
      if (/^h\d/.test(name)) {
        return {
          name: 'Heading',
          props: Object.assign({ level: Number(/^h(\d)/.exec(name)[1]) }, props)
        };
      }
    }
  };

  const actual = toJsx(
    h('div', [
      h('h1', { style: 'color: pink; padding-left: 10px' }, 'bravo'),
      h('h2', { ariaLabel: 'oo' }, 'eggs')
    ]),
    options
  );

  expect(actual).toBe(
    '<div><Heading level={1} style={{color: "pink", paddingLeft: "10px"}}>bravo</Heading><Heading level={2} aria-label="oo">eggs</Heading></div>'
  );
});
