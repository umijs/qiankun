import { tokenizer } from 'acorn';

function _stripLiteralAcorn(code, options) {
  const FILL = options?.fillChar ?? " ";
  const FILL_COMMENT = " ";
  let result = "";
  const filter = options?.filter ?? (() => true);
  function fillupTo(index) {
    if (index > result.length)
      result += code.slice(result.length, index).replace(/[^\n]/g, FILL_COMMENT);
  }
  const tokens = [];
  const pasers = tokenizer(code, {
    ecmaVersion: "latest",
    sourceType: "module",
    allowHashBang: true,
    allowAwaitOutsideFunction: true,
    allowImportExportEverywhere: true
  });
  const iter = pasers[Symbol.iterator]();
  let error;
  try {
    while (true) {
      const { done, value: token } = iter.next();
      if (done)
        break;
      tokens.push(token);
      fillupTo(token.start);
      if (token.type.label === "string") {
        const body = code.slice(token.start + 1, token.end - 1);
        if (filter(body)) {
          result += code[token.start] + FILL.repeat(token.end - token.start - 2) + code[token.end - 1];
          continue;
        }
      } else if (token.type.label === "template") {
        const body = code.slice(token.start, token.end);
        if (filter(body)) {
          result += FILL.repeat(token.end - token.start);
          continue;
        }
      } else if (token.type.label === "regexp") {
        const body = code.slice(token.start, token.end);
        if (filter(body)) {
          result += body.replace(/\/(.*)\/(\w?)$/g, (_, $1, $2) => `/${FILL.repeat($1.length)}/${$2}`);
          continue;
        }
      }
      result += code.slice(token.start, token.end);
    }
    fillupTo(code.length);
  } catch (e) {
    error = e;
  }
  return {
    error,
    result,
    tokens
  };
}
function stripLiteralAcorn(code, options) {
  const result = _stripLiteralAcorn(code, options);
  if (result.error)
    throw result.error;
  return result.result;
}
function createIsLiteralPositionAcorn(code) {
  const positionList = [];
  const tokens = tokenizer(code, {
    ecmaVersion: "latest",
    sourceType: "module",
    allowHashBang: true,
    allowAwaitOutsideFunction: true,
    allowImportExportEverywhere: true,
    onComment(_isBlock, _text, start, end) {
      positionList.push(start);
      positionList.push(end);
    }
  });
  const inter = tokens[Symbol.iterator]();
  while (true) {
    const { done, value: token } = inter.next();
    if (done)
      break;
    if (token.type.label === "string") {
      positionList.push(token.start + 1);
      positionList.push(token.end - 1);
    } else if (token.type.label === "template") {
      positionList.push(token.start);
      positionList.push(token.end);
    }
  }
  return (position) => {
    const i = binarySearch(positionList, (v) => position < v);
    return (i - 1) % 2 === 0;
  };
}
function binarySearch(array, pred) {
  let low = -1;
  let high = array.length;
  while (1 + low < high) {
    const mid = low + (high - low >> 1);
    if (pred(array[mid]))
      high = mid;
    else
      low = mid;
  }
  return high;
}

const multilineCommentsRE = /\/\*([^*\/])*?\*\//gms;
const singlelineCommentsRE = /(?:^|\n|\r)\s*\/\/.*(?:\r|\n|$)/gm;
const templateLiteralRE = /\$\{(\s*(?:|{.*}|(?!\$\{).|\n|\r)*?\s*)\}/g;
const quotesRE = [
  /(["'`])((?:\\\1|(?!\1)|.|\r)*?)\1/gm,
  /([`])((?:\\\1|(?!\1)|.|\n|\r)*?)\1/gm
  // multi-line strings (i.e. template literals only)
];
function stripLiteralRegex(code, options) {
  const FILL_COMMENT = " ";
  const FILL = options?.fillChar ?? " ";
  const filter = options?.filter ?? (() => true);
  code = code.replace(multilineCommentsRE, (s) => filter(s) ? FILL_COMMENT.repeat(s.length) : s).replace(singlelineCommentsRE, (s) => filter(s) ? FILL_COMMENT.repeat(s.length) : s);
  let expanded = code;
  for (let i = 0; i < 16; i++) {
    const before = expanded;
    expanded = expanded.replace(templateLiteralRE, "` $1`");
    if (expanded === before)
      break;
  }
  quotesRE.forEach((re) => {
    expanded = expanded.replace(re, (s, quote, body, index) => {
      if (!filter(s.slice(1, -1)))
        return s;
      code = code.slice(0, index + 1) + FILL.repeat(s.length - 2) + code.slice(index + s.length - 1);
      return quote + FILL.repeat(s.length - 2) + quote;
    });
  });
  return code;
}

function stripLiteral(code, options) {
  return stripLiteralDetailed(code, options).result;
}
function stripLiteralDetailed(code, options) {
  const acorn = _stripLiteralAcorn(code, options);
  if (!acorn.error) {
    return {
      mode: "acorn",
      result: acorn.result,
      acorn
    };
  }
  return {
    mode: "regex",
    result: stripLiteralRegex(acorn.result + code.slice(acorn.result.length), options),
    acorn
  };
}

export { createIsLiteralPositionAcorn, stripLiteral, stripLiteralAcorn, stripLiteralDetailed, stripLiteralRegex };
