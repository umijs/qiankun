type TagReplacement = {
  // start tag
  tag: string;
  // start tag replacement
  alt: string;
};

type AutoCompleteTags = {
  head: string;
  body?: string;
};

export class TagTransformStream extends TransformStream {
  constructor(tagReplacements: TagReplacement[], autoReplacementTags: AutoCompleteTags) {
    let buffer = '';
    super({
      async transform(chunk: string, controller: TransformStreamDefaultController<string>) {
        buffer += chunk;

        // If the tag in the buffer has appeared in pairs, we will try to replace it, otherwise we will write the data to the buffer next time to replace it
        if (!isAngleBracketsInPairs(buffer)) return;

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
          let matchedReplacement: TagReplacement[] | undefined;
          if (isAngleBracketsInPairs(buffer)) {
            matchedReplacement = tagReplacements.filter((value) => buffer.indexOf(value.tag) !== -1);
          }

          if (!matchedReplacement) {
            // It may be a non-standard HTML chunk that does not contain the head tag, in which case you need to manually fill in a head element
            if (buffer.indexOf(`<body>`) === -1 && autoReplacementTags.body) {
              buffer = `<${autoReplacementTags.body}>${buffer}</${autoReplacementTags.body}>`;
            }
            if (buffer.indexOf(`<head>`) === -1) {
              buffer = `<${autoReplacementTags.head}></${autoReplacementTags.head}>${buffer}`;
            }

            controller.enqueue(buffer);
          } else {
            const data = matchedReplacement.reduce(
              (acc, replacement) => acc.replace(replacement.tag, replacement.alt),
              buffer,
            );
            controller.enqueue(data);
          }

          buffer = '';
        }
      },
    });
  }
}

function isAngleBracketsInPairs(code: string): boolean {
  let count = 0;

  for (let i = 0; i < code.length; i++) {
    if (code.charAt(i) === '<') {
      count++;
    } else if (code.charAt(i) === '>') {
      if (count === 0) return false;
      count--;
    }
  }

  return count === 0;
}
