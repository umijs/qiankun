const safeRegex = require("../");

const REPETITION_LIMIT = 25;
const REPETITION_TOO_MUCH = REPETITION_LIMIT + 1;

// TODO Named character classes

test("linear-time regexes are safe", () => {
  const linTime = [
    // regular RE's
    /a/,
    /a*/,
    /a+/,
    /a?/,
    /a{3,5}/,
    /a|b/,
    /(ab)/,
    /(ab)\1/,
    /\bOakland\b/,
    /(a+)|(b+)/,

    // RE's in a string
    "^foo/bar",

    // non-RE, non-string
    1,
  ];

  linTime.forEach(re => {
    expect(safeRegex(re)).toBe(true);
  });
});

test("linear-time regexes are safe, under varying repetition limits", () => {
  const re1 = RegExp("a?".repeat(REPETITION_LIMIT) + "a".repeat(REPETITION_LIMIT));
  expect(safeRegex(re1)).toBe(true);

  const LOW_REPETITION_LIMIT = 3;
  const re2 = RegExp(Array(LOW_REPETITION_LIMIT).join("a?"));

  expect(safeRegex(re2, { limit: LOW_REPETITION_LIMIT })).toBe(true);
});

test("poly-time regexes are safe (at least according to our heuristics)", () => {
  const polyTime = [
    /^a+a+$/,        // QOA
    /^a+aa+$/,       // QOA with obvious intermediate run
    /^a+aaaa+$/,     // QOA with obvious intermediate run
    /^a+[a-z]a+$/,   // QOA with obvious intermediate run
    /^a+\wa+$/,      // QOA with intermediate character class
    /^a+(\w|\d)a+$/, // QOA with valid path through
    /^a+b?a+$/,      // QOA with valid path through
    /^a+(cde)*a+$/,  // QOA with valid path through
    /^.*a*$/,        // QOA by subset
    /^\w*\d*$/,      // QOA by intersection
    /^\S+@\S+\.\S+$/, // Example from Django
    /a+$/,           // QOA under partial-match
    /abc.*$/,        // QOA under partial-match
    // TODO It would be nice to have one of the regexes that are poly-time even when they match, due to non-greedy quantifiers (p-NFA)
  ];

  polyTime.forEach(re => {
    expect(safeRegex(re)).toBe(true);
  });
});

test("exp-time regexes due to star height are unsafe", () => {
  const expTime = [
    // Straightforward star height
    /(a*)*$/,
    /(a?)*$/,
    /(a*)?$/,
    /(a*)+$/,
    /(a+)*$/,
    /(\wa+)*$/, // Prefix
    /(\..*)*$/, // Suffix

    // Branching and nesting.
    /(a*|b)+$/,
    /(a|b*)+$/,
    /(((b*)))+$/,
    /(((b*))+)$/,
    /(((b*)+))$/,
    /(((b)*)+)$/,
    /(((b)*))+$/,

    // Misc. more complex cases
    /^(a?){25}(a){25}$/,
    /(x+x+)+y/,
    /foo|(x+x+)+y/,
    /(a+){10}y/,
    /(a+){2}y/,
    /(.*){1,32000}[bc]/,


    // RE's in a string
    "(a+)+",
  ];

  expTime.forEach(re => {
    expect(safeRegex(re)).toBe(false);
  });
});

test("linear-time regexes with star height > 1", () => {
  // TODO These are false positives, Fix once we improve analysis
  const linTime = [
    /(ab*)+$/,
    /(b*a)+$/,
  ];

  linTime.forEach(re => {
    expect(safeRegex(re)).toBe(false);
  });
});

test("exp-time regexes due to disjunction are safe (according to current heuristics)", () => {
  // TODO These are false negatives. Fix once we improve analysis
  const expTime = [
    /(a|a)*$/,       // QOD: obvious 
    /(a|\w)*$/,      // QOD due to overlap
    /([abc]|b)*$/,   // QOD due to overlap
    /(\w\w\w|bab)*$/, // QOD due to overlap, with multi-step internal paths
  ];

  expTime.forEach(re => {
    expect(safeRegex(re)).toBe(true);
  });
});

test("regex that exceeds repetition limit is unsafe", () => {
  const re1 = RegExp("a?".repeat(REPETITION_TOO_MUCH) + "a".repeat(REPETITION_TOO_MUCH));
  expect(safeRegex(re1)).toBe(false);

  const LOW_REPETITION_LIMIT = 3;
  const re2 = RegExp("a?".repeat(LOW_REPETITION_LIMIT + 1));
  expect(safeRegex(re2, { limit: LOW_REPETITION_LIMIT })).toBe(false);
});

test("invalid regexes default to unsafe", () => {
  const invalid = [
    "(a+",
    "[a-z",
    "*Oakland*",
    "hey(yoo) )",
    "abcde(?>hellow)",
    "[abc",
  ];

  invalid.forEach(re => {
    expect(safeRegex(re)).toBe(false);
  });
});