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

export class TagTransformStream extends TransformStream {
  constructor(tagReplacements: TagReplacement[], autoReplacementTags: AutoCompleteTags) {
    let buffer = '';
    super({
      async transform(chunk: string, controller: TransformStreamDefaultController<string>) {
        buffer += chunk;

        const data = tagReplacements.reduce(
          (acc, replacement) => acc.replace(replacement.tag, replacement.alt),
          buffer,
        );

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
          if (buffer.indexOf(`<body>`) === -1 && autoReplacementTags.body) {
            buffer = `<body>${buffer}</body>`;
          }
          // if (buffer.indexOf(`<head>`) === -1) {
          //   buffer = `<head></head>${buffer}`;
          // }

          const data = tagReplacements.reduce(
            (acc, replacement) => acc.replace(replacement.tag, replacement.alt),
            buffer,
          );
          controller.enqueue(data);

          buffer = '';
        }
      },
    });
  }
}
