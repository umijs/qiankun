/**
 * The deployed twin of `server.mjs`: a Cloudflare Pages Function that replays the same
 * `<!--#flush:<ms>-->` markers over a streamed Response, so examples.qiankunjs.com paces the
 * chunks exactly like the dev server does. `scripts/build-examples-site.mjs` copies this file
 * to `functions/apps/streaming/index.js`, where `wrangler pages deploy` picks it up and mounts
 * it at `/apps/streaming/` — shadowing the statically uploaded `index.html`, which stays in the
 * deployment as this function's source material (and keeps `entry.js` a plain asset).
 */
const FLUSH_MARKER = /<!--#flush:(\d+)-->/g;

export async function onRequestGet(context) {
  // ASSETS bypasses functions, so fetching the canonical URL yields the static file this
  // function shadows. Not `/index.html`: Pages answers the non-canonical spelling with a 308.
  const asset = await context.env.ASSETS.fetch(new URL('/apps/streaming/', context.request.url));
  const parts = (await asset.text()).split(FLUSH_MARKER);

  const encoder = new TextEncoder();
  const { readable, writable } = new TransformStream();

  const stream = async () => {
    const writer = writable.getWriter();
    await writer.write(encoder.encode(parts[0]));
    for (let index = 1; index < parts.length; index += 2) {
      await new Promise((resolve) => setTimeout(resolve, Number(parts[index])));
      await writer.write(encoder.encode(parts[index + 1]));
    }
    await writer.close();
  };
  // the handler returns while chunks are still pending; waitUntil keeps the writer alive
  context.waitUntil(stream());

  return new Response(readable, {
    headers: {
      // `_headers` only decorates static assets — a function answers with its own CORS
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store',
      // opt out of edge compression: a buffering compressor would coalesce the paced chunks,
      // and pacing is this response's entire reason to exist
      'Content-Encoding': 'identity',
      'Content-Type': 'text/html; charset=utf-8',
      'Timing-Allow-Origin': '*',
    },
  });
}
