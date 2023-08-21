'use strict';

// These tests are copied from the htmltojsx package, to ensure feature parity.

const unified = require('unified');
const rehypeParse = require('rehype-parse');
const toJsx = require('..');

function htmlToJsx(html) {
  const ast = unified()
    .use(rehypeParse, { fragment: true })
    .parse(html);
  return toJsx(ast);
}

test('should handle basic HTML', function() {
  expect(htmlToJsx('<div>Hello world!</div>')).toBe('<div>Hello world!</div>');
});

test('should handle HTML comments', function() {
  expect(htmlToJsx('<!-- Hello World -->')).toBe('{/* Hello World */}');
});

test('should convert tags to lowercase', function() {
  expect(htmlToJsx('<DIV>Hello world!</DIV>')).toBe('<div>Hello world!</div>');
});

test('handles single-line script tag', function() {
  expect(htmlToJsx('<div>foo<script>lol</script>bar</div>')).toBe(
    '<div>foo<script>lol</script>bar</div>'
  );
});

test('handles multi-line script tag', function() {
  const input = `<div>foo<script>
lol
lolz
</script>bar</div>`;
  expect(htmlToJsx(input)).toBe(input);
});

describe('escaped characters', function() {
  test('should handle escaped < symbols', function() {
    expect(htmlToJsx('<div>&lt;</div>')).toBe('<div>&lt;</div>');
  });

  test('should handle unescaped copyright symbols', function() {
    expect(htmlToJsx('<div>©</div>')).toBe('<div>©</div>');
  });
});

describe('Attribute transformations', function() {
  test('should convert basic "style" attributes', function() {
    expect(htmlToJsx('<div style="color: red">Test</div>')).toBe(
      '<div style={{color: "red"}}>Test</div>'
    );
  });

  test('should convert CSS shorthand "style" values', function() {
    expect(
      htmlToJsx('<div style="padding: 10px 15px 20px 25px;">Test</div>')
    ).toBe('<div style={{padding: "10px 15px 20px 25px"}}>Test</div>');
  });

  test('should convert numeric "style" attributes', function() {
    expect(htmlToJsx('<div style="width: 100px">Test</div>')).toBe(
      '<div style={{width: "100px"}}>Test</div>'
    );
  });

  test('should convert dashed "style" attributes', function() {
    expect(htmlToJsx('<div style="font-size: 12pt">Test</div>')).toBe(
      '<div style={{fontSize: "12pt"}}>Test</div>'
    );
  });

  test('should convert vendor-prefix "style" attributes', function() {
    expect(
      htmlToJsx(
        '<div style="-moz-hyphens: auto; -webkit-hyphens: auto">Test</div>'
      )
    ).toBe(
      '<div style={{MozHyphens: "auto", WebkitHyphens: "auto"}}>Test</div>'
    );
  });

  // Waiting on fix in postcss-js ...
  // test('should convert uppercase vendor-prefix "style" attributes', function() {
  //   expect(
  //     htmlToJsx(
  //       '<div style="-MOZ-HYPHENS: auto; -WEBKIT-HYPHENS: auto">Test</div>'
  //     )
  //   ).toBe(
  //     '<div style={{MozHyphens: "auto", WebkitHyphens: "auto"}}>Test</div>'
  //   );
  // });

  test('should convert "style" attributes with vendor prefix-like strings in the middle and mixed case', function() {
    expect(
      htmlToJsx(
        '<div style="myclass-moz-hyphens: auto; myclass-webkit-hyphens: auto">Test</div>'
      )
    ).toBe(
      '<div style={{myclassMozHyphens: "auto", myclassWebkitHyphens: "auto"}}>Test</div>'
    );
  });

  test('should convert -ms- prefix "style" attributes', function() {
    expect(htmlToJsx('<div style="-ms-hyphens: auto">Test</div>')).toBe(
      '<div style={{msHyphens: "auto"}}>Test</div>'
    );
  });

  test('should convert "style" attributes with -ms- in the middle', function() {
    expect(htmlToJsx('<div style="myclass-ms-hyphens: auto">Test</div>')).toBe(
      '<div style={{myclassMsHyphens: "auto"}}>Test</div>'
    );
  });

  // Waiting on fix in postcss-js ...
  // test('should convert uppercase "style" attributes', function() {
  //   expect(htmlToJsx('<div style="TEXT-ALIGN: center">Test</div>')).toBe(
  //     '<div style={{textAlign: "center"}}>Test</div>'
  //   );
  // });

  test('should convert "class" attribute', function() {
    expect(htmlToJsx('<div class="awesome">Test</div>')).toBe(
      '<div className="awesome">Test</div>'
    );
  });

  test('should convert "for" attribute', function() {
    expect(htmlToJsx('<label for="potato">Test</label>')).toBe(
      '<label htmlFor="potato">Test</label>'
    );
  });

  test('should convert "maxlength" attribute to "maxLength"', function() {
    expect(htmlToJsx('<input maxlength=2></input>')).toBe(
      '<input maxLength={2} />'
    );
  });

  test('should convert "http-equiv" attribute to "httpEquiv"', function() {
    expect(htmlToJsx('<meta http-equiv="refresh">')).toBe(
      '<meta httpEquiv="refresh" />'
    );
  });

  test('should convert "accept-charset" attribute to "acceptCharset"', function() {
    expect(htmlToJsx('<form accept-charset="UTF-8">Test</form>')).toBe(
      '<form acceptCharset="UTF-8">Test</form>'
    );
  });

  test('should convert "enctype" attribute to "encType"', function() {
    expect(
      htmlToJsx(
        '<form method="post" enctype="application/x-www-form-urlencoded">Test</form>'
      )
    ).toBe(
      '<form method="post" encType="application/x-www-form-urlencoded">Test</form>'
    );
  });

  test('should maintain value-less attributes', function() {
    expect(htmlToJsx('<input disabled>')).toBe('<input disabled={true} />');
  });

  test('should set <input> "value" to "defaultValue" to allow input editing', function() {
    expect(htmlToJsx('<input value="Darth Vader">')).toBe(
      '<input defaultValue="Darth Vader" />'
    );
  });

  test('should not set "value" to "defaultValue" for non-<input> elements', function() {
    expect(htmlToJsx('<select><option value="Hans"></select>')).toBe(
      '<select><option value="Hans" /></select>'
    );
  });

  test('should set <input> "checked" to "defaultChecked" to allow box checking', function() {
    expect(htmlToJsx('<input type="checkbox" checked>')).toBe(
      '<input type="checkbox" defaultChecked={true} />'
    );
  });

  // HAST does not handle SVG well yet.
  // test('should convert SVG attributes', function() {
  //   expect(
  //     htmlToJsx(
  //       '<svg height="100" width="100"><circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" fill-rule="evenodd"/></svg>'
  //     )
  //   ).toBe(
  //     '<svg height={100} width={100}><circle cx={50} cy={50} r={40} stroke="black" strokeWidth={3} fill="red" fillRule="evenodd" /></svg>'
  //   );
  // });
});

describe('special tags', function() {
  test('should use "defaultValue" for textareas', function() {
    expect(htmlToJsx('<textarea>hello\nworld</textarea>')).toBe(
      '<textarea defaultValue="hello\\nworld" />'
    );
  });

  test('should do magic voodoo for <pre>', function() {
    expect(htmlToJsx('<pre>hello\nworld{foo}</pre>')).toBe(
      '<pre>hello{"\\n"}world{"{"}foo{"}"}</pre>'
    );
  });

  test('should handle <pre> tags with children', function() {
    expect(
      htmlToJsx('<pre><b>Hello world  yo</b>this   is   a<i>   test</i></pre>')
    ).toBe(
      '<pre><b>Hello world{"  "}yo</b>this{"   "}is{"   "}a<i>{"   "}test</i></pre>'
    );
  });

  test('should dangerously set <style> tag contents', function() {
    expect(
      htmlToJsx(
        '<style>\nh1 {\n    background: url("http://foo.bar/img.jpg";\n}\n</style>'
      )
    ).toBe(
      '<style dangerouslySetInnerHTML={{__html: "\\nh1 {\\n    background: url(\\"http://foo.bar/img.jpg\\";\\n}\\n" }} />'
    );
  });

  test('should convert svg tag names', function() {
    expect(
      htmlToJsx(
        '<svg><clipPath><feSpotLight><linearGradient></linearGradient></feSpotLight></clipPath></svg>'
      )
    ).toBe(
      '<svg><clipPath><feSpotLight><linearGradient /></feSpotLight></clipPath></svg>'
    );
  });
});
