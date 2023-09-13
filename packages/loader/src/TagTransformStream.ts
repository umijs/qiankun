type TagReplacement = {
  // start tag
  tag: string;
  // start tag replacement
  alt: string;
};

export class TagTransformStream extends TransformStream {
  constructor(tagReplacements: TagReplacement[]) {
    let buffer = '';
    super({
      async transform(chunk: string, controller: TransformStreamDefaultController<string>) {
        buffer += chunk;

        const matchedReplacement = tagReplacements.filter((value) => buffer.indexOf(value.tag) !== -1);

        if (!matchedReplacement) return;

        const data = matchedReplacement.reduce(
          (acc, replacement) => acc.replace(replacement.tag, replacement.alt),
          buffer,
        );
        controller.enqueue(data);

        buffer = '';
      },

      flush(controller: TransformStreamDefaultController<string>) {
        if (buffer) {
          const matchedReplacement = tagReplacements.filter((value) => buffer.indexOf(value.tag) !== -1);

          if (!matchedReplacement) controller.enqueue(buffer);

          const data = matchedReplacement.reduce(
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
