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

type TransformedBuffer = {
  output: string;
  pending: string;
  remainingReplacements: TagReplacement[];
};

function findPendingPrefixLength(input: string, replacements: TagReplacement[]): number {
  const maximumLength = Math.min(
    input.length,
    replacements.reduce((length, replacement) => Math.max(length, replacement.tag.length - 1), 0),
  );

  for (let length = maximumLength; length > 0; length -= 1) {
    const suffix = input.slice(-length);
    if (replacements.some((replacement) => replacement.tag.startsWith(suffix))) return length;
  }
  return 0;
}

function validateReplacements(replacements: TagReplacement[]): void {
  if (replacements.some((replacement) => !replacement.tag)) {
    throw new Error('tag replacement patterns must not be empty');
  }

  replacements.forEach((replacement, index) => {
    for (let otherIndex = index + 1; otherIndex < replacements.length; otherIndex += 1) {
      const otherTag = replacements[otherIndex].tag;
      if (replacement.tag.includes(otherTag) || otherTag.includes(replacement.tag)) {
        throw new Error('tag replacement patterns must not contain one another');
      }
    }
  });
}

function transformAvailable(input: string, replacements: TagReplacement[], finalChunk: boolean): TransformedBuffer {
  const remainingReplacements = [...replacements];
  let cursor = 0;
  let output = '';

  while (cursor < input.length) {
    let nextIndex = -1;
    let nextReplacementIndex = -1;
    remainingReplacements.forEach((replacement, replacementIndex) => {
      const index = input.indexOf(replacement.tag, cursor);
      if (index !== -1 && (nextIndex === -1 || index < nextIndex)) {
        nextIndex = index;
        nextReplacementIndex = replacementIndex;
      }
    });
    if (nextReplacementIndex === -1) break;

    const [nextReplacement] = remainingReplacements.splice(nextReplacementIndex, 1);
    output += input.slice(cursor, nextIndex) + nextReplacement.alt;
    cursor = nextIndex + nextReplacement.tag.length;
  }

  const tail = input.slice(cursor);
  const pendingLength = finalChunk ? 0 : findPendingPrefixLength(tail, remainingReplacements);
  const readyLength = tail.length - pendingLength;
  return {
    output: output + tail.slice(0, readyLength),
    pending: tail.slice(readyLength),
    remainingReplacements,
  };
}

export function createTagTransformStream(
  tagReplacements: TagReplacement[],
  autoCompleteTags: AutoCompleteTags,
): TransformStream<string, string> {
  validateReplacements(tagReplacements);
  class TagTransformStream extends TransformStream {
    constructor(replacements: TagReplacement[], completion: AutoCompleteTags) {
      let buffer = '';
      let remainingReplacements = [...replacements];
      const usesLegacyAutoCompletion = completion.body || completion.head;
      super({
        transform(chunk: string, controller: TransformStreamDefaultController<string>) {
          buffer += chunk;

          // Auto-completion needs the legacy whole-buffer view to decide whether a missing wrapper
          // must be synthesized at EOF. The loader's normal path does not enable this mode.
          if (usesLegacyAutoCompletion) {
            const data = replacements.reduce(
              (acc, replacement) => acc.replace(replacement.tag, replacement.alt),
              buffer,
            );
            if (buffer === data) return;
            controller.enqueue(data);
            buffer = '';
            return;
          }

          const transformed = transformAvailable(buffer, remainingReplacements, false);
          buffer = transformed.pending;
          remainingReplacements = transformed.remainingReplacements;
          if (transformed.output) controller.enqueue(transformed.output);
        },

        flush(controller: TransformStreamDefaultController<string>) {
          if (buffer) {
            // FIXME It may be a non-standard HTML chunk that does not contain the head tag, in which case you need to manually fill in a head element
            if (buffer.indexOf(`<body>`) === -1 && completion.body) {
              buffer = `<body>${buffer}</body>`;
            }
            // if (buffer.indexOf(`<head>`) === -1) {
            //   buffer = `<head></head>${buffer}`;
            // }

            const data = usesLegacyAutoCompletion
              ? replacements.reduce((acc, replacement) => acc.replace(replacement.tag, replacement.alt), buffer)
              : transformAvailable(buffer, remainingReplacements, true).output;
            if (data) controller.enqueue(data);

            buffer = '';
          }
        },
      });
    }
  }

  return new TagTransformStream(tagReplacements, autoCompleteTags);
}
