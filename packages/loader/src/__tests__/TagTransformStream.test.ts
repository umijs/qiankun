import { describe, expect, it } from 'vitest';
import { createTagTransformStream } from '../TagTransformStream';

const HEAD_REPLACEMENTS = [
  { alt: '<qiankun-head>', tag: '<head>' },
  { alt: '</qiankun-head>', tag: '</head>' },
];

async function transformChunks(chunks: string[], replacements = HEAD_REPLACEMENTS): Promise<string[]> {
  const stream = createTagTransformStream(replacements);
  const reader = stream.readable.getReader();
  const writer = stream.writable.getWriter();
  const output: string[] = [];
  const consume = (async () => {
    while (true) {
      const result = await reader.read();
      if (result.done) return;
      output.push(result.value);
    }
  })();

  for (const chunk of chunks) {
    await writer.write(chunk);
  }
  await writer.close();
  await consume;
  return output;
}

describe('createTagTransformStream', () => {
  it('emits every safe HTML chunk instead of buffering non-matching chunks until EOF', async () => {
    const chunks = [
      '<html><head><title>app</title></head><body><main id="root">',
      '<section id="benchmark-core">ready</section>',
      '<script src="entry.js"></script></main></body></html>',
    ];

    await expect(transformChunks(chunks)).resolves.toEqual([
      '<html><qiankun-head><title>app</title></qiankun-head><body><main id="root">',
      chunks[1],
      chunks[2],
    ]);
  });

  it('preserves replacement tags split at every chunk boundary', async () => {
    const input = 'before<head>inside</head>after';
    const expected = 'before<qiankun-head>inside</qiankun-head>after';

    for (let boundary = 1; boundary < input.length; boundary += 1) {
      const output = await transformChunks([input.slice(0, boundary), input.slice(boundary)]);
      expect(output.join('')).toBe(expected);
    }
  });

  it('flushes an incomplete replacement prefix unchanged at EOF', async () => {
    await expect(transformChunks(['before<he'])).resolves.toEqual(['before', '<he']);
  });

  it('passes through entries without an explicit body for downstream parser completion', async () => {
    await expect(
      transformChunks(['<head><title>app</title></head>', '<main id="root">body-less entry</main>']),
    ).resolves.toEqual(['<qiankun-head><title>app</title></qiankun-head>', '<main id="root">body-less entry</main>']);
  });

  it('replaces each structural tag once independently of chunk boundaries', async () => {
    const input = '<head>one</head><head>two</head>';
    const expected = '<qiankun-head>one</qiankun-head><head>two</head>';

    await expect(transformChunks([input])).resolves.toEqual([expected]);
    await expect(transformChunks(['<hea', 'd>one</he', 'ad><head>two</head>'])).resolves.toEqual([
      '<qiankun-head>one',
      '</qiankun-head><head>two</head>',
    ]);
  });

  it('preserves matching literals in raw text after replacing the document head', async () => {
    const head = '<head><title>app</title></head>';
    const body = `<body><script>const template = '<head>x</head>';</script></body>`;

    await expect(transformChunks([head, body])).resolves.toEqual([
      '<qiankun-head><title>app</title></qiankun-head>',
      body,
    ]);
  });

  it('does not use output equality as a signal to keep buffering', async () => {
    const replacements = [{ alt: '<head>', tag: '<head>' }];

    await expect(transformChunks(['<head>first', 'second'], replacements)).resolves.toEqual(['<head>first', 'second']);
  });

  it('rejects empty or containment-ambiguous replacement tags', () => {
    expect(() => createTagTransformStream([{ alt: 'x', tag: '' }])).toThrow(/must not be empty/);
    expect(() =>
      createTagTransformStream([
        { alt: 'long', tag: 'abc' },
        { alt: 'short', tag: 'ab' },
      ]),
    ).toThrow(/must not contain one another/);
    expect(() =>
      createTagTransformStream([
        { alt: 'long', tag: 'abcd' },
        { alt: 'inner', tag: 'bc' },
      ]),
    ).toThrow(/must not contain one another/);
  });
});
