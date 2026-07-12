type TagReplacement = {
  // literal tag pattern
  tag: string;
  // replacement text
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

/**
 * Finds the longest suffix that is also a prefix of an unconsumed tag pattern.
 * That suffix may be the start of a tag split across chunks; every earlier byte
 * is safe to emit. The length bound retains no more than the longest possible
 * incomplete pattern; complete matches have already been consumed by the caller.
 */
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

  // If one pattern contains another, the shorter pattern may become complete
  // before the longer one across a chunk boundary. The selected replacement would
  // then depend on chunking, so containment (including duplicates) is unsupported.
  replacements.forEach((replacement, index) => {
    for (let otherIndex = index + 1; otherIndex < replacements.length; otherIndex += 1) {
      const otherTag = replacements[otherIndex].tag;
      if (replacement.tag.includes(otherTag) || otherTag.includes(replacement.tag)) {
        throw new Error('tag replacement patterns must not contain one another');
      }
    }
  });
}

/**
 * Transforms every byte that is safe to emit without waiting for the next chunk.
 *
 * Each configured structural tag is replaced at most once. After a match, its
 * replacement is removed so identical text appearing later in scripts, templates,
 * or content is left untouched. This is a literal matcher rather than an HTML
 * parser; that protection applies after the structural occurrence consumes its
 * rule. Of the unmatched tail, only a suffix that could be the prefix of a remaining
 * tag is kept pending across chunks.
 *
 * At EOF, complete remaining tags are still replaced, but no suffix is kept pending:
 * an incomplete tag prefix can no longer be completed and is emitted unchanged.
 */
function transformAvailable(input: string, replacements: TagReplacement[], finalChunk: boolean): TransformedBuffer {
  const remainingReplacements = [...replacements];
  let cursor = 0;
  let output = '';

  while (cursor < input.length) {
    let nextIndex = -1;
    let nextReplacementIndex = -1;
    // Process the earliest remaining tag first so replacements preserve document order.
    remainingReplacements.forEach((replacement, replacementIndex) => {
      const index = input.indexOf(replacement.tag, cursor);
      if (index !== -1 && (nextIndex === -1 || index < nextIndex)) {
        nextIndex = index;
        nextReplacementIndex = replacementIndex;
      }
    });
    if (nextReplacementIndex === -1) break;

    // Consume the rule so later duplicate tags or raw-text literals are not rewritten.
    const [nextReplacement] = remainingReplacements.splice(nextReplacementIndex, 1);
    output += input.slice(cursor, nextIndex) + nextReplacement.alt;
    cursor = nextIndex + nextReplacement.tag.length;
  }

  const tail = input.slice(cursor);
  // Keep the longest suffix that could prefix an unconsumed tag, such as "<he"
  // followed by "ad>" in the next chunk. Everything before it is safe to emit.
  const pendingLength = finalChunk ? 0 : findPendingPrefixLength(tail, remainingReplacements);
  const readyLength = tail.length - pendingLength;
  return {
    output: output + tail.slice(0, readyLength),
    pending: tail.slice(readyLength),
    remainingReplacements,
  };
}

/**
 * Creates a streaming structural-tag rewriter.
 *
 * The previous implementation used output equality to decide whether buffered
 * HTML could be emitted. Once the document tags had been replaced, ordinary body
 * chunks no longer changed and were retained until EOF, effectively turning the
 * rest of a streaming response into a buffered one. A real match was also mistaken
 * for "no match" when its replacement text was identical to the original tag.
 *
 * The normal loader path now emits safe HTML incrementally and carries only a
 * possible split-tag suffix into the next transform. Auto-completion deliberately
 * keeps the legacy tail-buffering behavior because it must inspect unmatched bytes
 * at EOF before synthesizing a missing wrapper.
 */
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

          // Preserve legacy auto-completion semantics: a match may emit and clear the
          // buffer, but the unmatched tail since that match stays buffered for the EOF
          // wrapper check. The loader's regular path disables this mode.
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
