type TagReplacement = {
  // start tag
  tag: string;
  // start tag replacement
  alt: string;
};

type AutoCompleteTags = {
  head?: boolean;
  body?: boolean;
};

export function createTagTransformStream(
  tagReplacements: TagReplacement[],
  autoCompleteTags: AutoCompleteTags,
): TransformStream<string, string> {
  class TagTransformStream extends TransformStream {
    constructor(trs: TagReplacement[], acts: AutoCompleteTags) {
      let buffer = '';
      super({
        async transform(chunk: string, controller: TransformStreamDefaultController<string>) {
          buffer += chunk;

          const data = trs.reduce((acc, replacement) => acc.replace(replacement.tag, replacement.alt), buffer);

          // while buffer is equal to data, it means that the data has not been replaced, and the data will be written to the buffer for checking next time
          if (buffer === data) {
            return;
          }

          controller.enqueue(data);
          buffer = '';
        },

        flush(controller: TransformStreamDefaultController<string>) {
          if (buffer) {
            // FIXME It may be a non-standard HTML chunk that does not contain the head tag, in which case you need to manually fill in a head element
            if (buffer.indexOf(`<body>`) === -1 && acts.body) {
              buffer = `<body>${buffer}</body>`;
            }
            // if (buffer.indexOf(`<head>`) === -1) {
            //   buffer = `<head></head>${buffer}`;
            // }

            const data = trs.reduce((acc, replacement) => acc.replace(replacement.tag, replacement.alt), buffer);
            controller.enqueue(data);

            buffer = '';
          }
        },
      });
    }
  }

  return new TagTransformStream(tagReplacements, autoCompleteTags);
}
