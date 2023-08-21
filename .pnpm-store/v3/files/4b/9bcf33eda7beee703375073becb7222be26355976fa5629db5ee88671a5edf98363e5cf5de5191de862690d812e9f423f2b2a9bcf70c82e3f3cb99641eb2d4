import { format, plugins } from 'pretty-format';
import * as diff$1 from 'diff-sequences';
import { b as getColors } from './chunk-colors.js';

function getType(value) {
  if (value === void 0) {
    return "undefined";
  } else if (value === null) {
    return "null";
  } else if (Array.isArray(value)) {
    return "array";
  } else if (typeof value === "boolean") {
    return "boolean";
  } else if (typeof value === "function") {
    return "function";
  } else if (typeof value === "number") {
    return "number";
  } else if (typeof value === "string") {
    return "string";
  } else if (typeof value === "bigint") {
    return "bigint";
  } else if (typeof value === "object") {
    if (value != null) {
      if (value.constructor === RegExp)
        return "regexp";
      else if (value.constructor === Map)
        return "map";
      else if (value.constructor === Set)
        return "set";
      else if (value.constructor === Date)
        return "date";
    }
    return "object";
  } else if (typeof value === "symbol") {
    return "symbol";
  }
  throw new Error(`value of unknown type: ${value}`);
}

const DIFF_DELETE = -1;
const DIFF_INSERT = 1;
const DIFF_EQUAL = 0;
class Diff {
  0;
  1;
  constructor(op, text) {
    this[0] = op;
    this[1] = text;
  }
}
const diff_commonPrefix = function(text1, text2) {
  if (!text1 || !text2 || text1.charAt(0) !== text2.charAt(0))
    return 0;
  let pointermin = 0;
  let pointermax = Math.min(text1.length, text2.length);
  let pointermid = pointermax;
  let pointerstart = 0;
  while (pointermin < pointermid) {
    if (text1.substring(pointerstart, pointermid) === text2.substring(pointerstart, pointermid)) {
      pointermin = pointermid;
      pointerstart = pointermin;
    } else {
      pointermax = pointermid;
    }
    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
  }
  return pointermid;
};
const diff_commonSuffix = function(text1, text2) {
  if (!text1 || !text2 || text1.charAt(text1.length - 1) !== text2.charAt(text2.length - 1))
    return 0;
  let pointermin = 0;
  let pointermax = Math.min(text1.length, text2.length);
  let pointermid = pointermax;
  let pointerend = 0;
  while (pointermin < pointermid) {
    if (text1.substring(text1.length - pointermid, text1.length - pointerend) === text2.substring(text2.length - pointermid, text2.length - pointerend)) {
      pointermin = pointermid;
      pointerend = pointermin;
    } else {
      pointermax = pointermid;
    }
    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
  }
  return pointermid;
};
const diff_commonOverlap_ = function(text1, text2) {
  const text1_length = text1.length;
  const text2_length = text2.length;
  if (text1_length === 0 || text2_length === 0)
    return 0;
  if (text1_length > text2_length)
    text1 = text1.substring(text1_length - text2_length);
  else if (text1_length < text2_length)
    text2 = text2.substring(0, text1_length);
  const text_length = Math.min(text1_length, text2_length);
  if (text1 === text2)
    return text_length;
  let best = 0;
  let length = 1;
  while (true) {
    const pattern = text1.substring(text_length - length);
    const found = text2.indexOf(pattern);
    if (found === -1)
      return best;
    length += found;
    if (found === 0 || text1.substring(text_length - length) === text2.substring(0, length)) {
      best = length;
      length++;
    }
  }
};
const diff_cleanupSemantic = function(diffs) {
  let changes = false;
  const equalities = [];
  let equalitiesLength = 0;
  let lastEquality = null;
  let pointer = 0;
  let length_insertions1 = 0;
  let length_deletions1 = 0;
  let length_insertions2 = 0;
  let length_deletions2 = 0;
  while (pointer < diffs.length) {
    if (diffs[pointer][0] === DIFF_EQUAL) {
      equalities[equalitiesLength++] = pointer;
      length_insertions1 = length_insertions2;
      length_deletions1 = length_deletions2;
      length_insertions2 = 0;
      length_deletions2 = 0;
      lastEquality = diffs[pointer][1];
    } else {
      if (diffs[pointer][0] === DIFF_INSERT)
        length_insertions2 += diffs[pointer][1].length;
      else
        length_deletions2 += diffs[pointer][1].length;
      if (lastEquality && lastEquality.length <= Math.max(length_insertions1, length_deletions1) && lastEquality.length <= Math.max(
        length_insertions2,
        length_deletions2
      )) {
        diffs.splice(
          equalities[equalitiesLength - 1],
          0,
          new Diff(DIFF_DELETE, lastEquality)
        );
        diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;
        equalitiesLength--;
        equalitiesLength--;
        pointer = equalitiesLength > 0 ? equalities[equalitiesLength - 1] : -1;
        length_insertions1 = 0;
        length_deletions1 = 0;
        length_insertions2 = 0;
        length_deletions2 = 0;
        lastEquality = null;
        changes = true;
      }
    }
    pointer++;
  }
  if (changes)
    diff_cleanupMerge(diffs);
  diff_cleanupSemanticLossless(diffs);
  pointer = 1;
  while (pointer < diffs.length) {
    if (diffs[pointer - 1][0] === DIFF_DELETE && diffs[pointer][0] === DIFF_INSERT) {
      const deletion = diffs[pointer - 1][1];
      const insertion = diffs[pointer][1];
      const overlap_length1 = diff_commonOverlap_(deletion, insertion);
      const overlap_length2 = diff_commonOverlap_(insertion, deletion);
      if (overlap_length1 >= overlap_length2) {
        if (overlap_length1 >= deletion.length / 2 || overlap_length1 >= insertion.length / 2) {
          diffs.splice(pointer, 0, new Diff(
            DIFF_EQUAL,
            insertion.substring(0, overlap_length1)
          ));
          diffs[pointer - 1][1] = deletion.substring(0, deletion.length - overlap_length1);
          diffs[pointer + 1][1] = insertion.substring(overlap_length1);
          pointer++;
        }
      } else {
        if (overlap_length2 >= deletion.length / 2 || overlap_length2 >= insertion.length / 2) {
          diffs.splice(pointer, 0, new Diff(
            DIFF_EQUAL,
            deletion.substring(0, overlap_length2)
          ));
          diffs[pointer - 1][0] = DIFF_INSERT;
          diffs[pointer - 1][1] = insertion.substring(0, insertion.length - overlap_length2);
          diffs[pointer + 1][0] = DIFF_DELETE;
          diffs[pointer + 1][1] = deletion.substring(overlap_length2);
          pointer++;
        }
      }
      pointer++;
    }
    pointer++;
  }
};
const nonAlphaNumericRegex_ = /[^a-zA-Z0-9]/;
const whitespaceRegex_ = /\s/;
const linebreakRegex_ = /[\r\n]/;
const blanklineEndRegex_ = /\n\r?\n$/;
const blanklineStartRegex_ = /^\r?\n\r?\n/;
function diff_cleanupSemanticLossless(diffs) {
  function diff_cleanupSemanticScore_(one, two) {
    if (!one || !two) {
      return 6;
    }
    const char1 = one.charAt(one.length - 1);
    const char2 = two.charAt(0);
    const nonAlphaNumeric1 = char1.match(nonAlphaNumericRegex_);
    const nonAlphaNumeric2 = char2.match(nonAlphaNumericRegex_);
    const whitespace1 = nonAlphaNumeric1 && char1.match(whitespaceRegex_);
    const whitespace2 = nonAlphaNumeric2 && char2.match(whitespaceRegex_);
    const lineBreak1 = whitespace1 && char1.match(linebreakRegex_);
    const lineBreak2 = whitespace2 && char2.match(linebreakRegex_);
    const blankLine1 = lineBreak1 && one.match(blanklineEndRegex_);
    const blankLine2 = lineBreak2 && two.match(blanklineStartRegex_);
    if (blankLine1 || blankLine2) {
      return 5;
    } else if (lineBreak1 || lineBreak2) {
      return 4;
    } else if (nonAlphaNumeric1 && !whitespace1 && whitespace2) {
      return 3;
    } else if (whitespace1 || whitespace2) {
      return 2;
    } else if (nonAlphaNumeric1 || nonAlphaNumeric2) {
      return 1;
    }
    return 0;
  }
  let pointer = 1;
  while (pointer < diffs.length - 1) {
    if (diffs[pointer - 1][0] === DIFF_EQUAL && diffs[pointer + 1][0] === DIFF_EQUAL) {
      let equality1 = diffs[pointer - 1][1];
      let edit = diffs[pointer][1];
      let equality2 = diffs[pointer + 1][1];
      const commonOffset = diff_commonSuffix(equality1, edit);
      if (commonOffset) {
        const commonString = edit.substring(edit.length - commonOffset);
        equality1 = equality1.substring(0, equality1.length - commonOffset);
        edit = commonString + edit.substring(0, edit.length - commonOffset);
        equality2 = commonString + equality2;
      }
      let bestEquality1 = equality1;
      let bestEdit = edit;
      let bestEquality2 = equality2;
      let bestScore = diff_cleanupSemanticScore_(equality1, edit) + diff_cleanupSemanticScore_(edit, equality2);
      while (edit.charAt(0) === equality2.charAt(0)) {
        equality1 += edit.charAt(0);
        edit = edit.substring(1) + equality2.charAt(0);
        equality2 = equality2.substring(1);
        const score = diff_cleanupSemanticScore_(equality1, edit) + diff_cleanupSemanticScore_(edit, equality2);
        if (score >= bestScore) {
          bestScore = score;
          bestEquality1 = equality1;
          bestEdit = edit;
          bestEquality2 = equality2;
        }
      }
      if (diffs[pointer - 1][1] !== bestEquality1) {
        if (bestEquality1) {
          diffs[pointer - 1][1] = bestEquality1;
        } else {
          diffs.splice(pointer - 1, 1);
          pointer--;
        }
        diffs[pointer][1] = bestEdit;
        if (bestEquality2) {
          diffs[pointer + 1][1] = bestEquality2;
        } else {
          diffs.splice(pointer + 1, 1);
          pointer--;
        }
      }
    }
    pointer++;
  }
}
function diff_cleanupMerge(diffs) {
  diffs.push(new Diff(DIFF_EQUAL, ""));
  let pointer = 0;
  let count_delete = 0;
  let count_insert = 0;
  let text_delete = "";
  let text_insert = "";
  let commonlength;
  while (pointer < diffs.length) {
    switch (diffs[pointer][0]) {
      case DIFF_INSERT:
        count_insert++;
        text_insert += diffs[pointer][1];
        pointer++;
        break;
      case DIFF_DELETE:
        count_delete++;
        text_delete += diffs[pointer][1];
        pointer++;
        break;
      case DIFF_EQUAL:
        if (count_delete + count_insert > 1) {
          if (count_delete !== 0 && count_insert !== 0) {
            commonlength = diff_commonPrefix(text_insert, text_delete);
            if (commonlength !== 0) {
              if (pointer - count_delete - count_insert > 0 && diffs[pointer - count_delete - count_insert - 1][0] === DIFF_EQUAL) {
                diffs[pointer - count_delete - count_insert - 1][1] += text_insert.substring(0, commonlength);
              } else {
                diffs.splice(0, 0, new Diff(
                  DIFF_EQUAL,
                  text_insert.substring(0, commonlength)
                ));
                pointer++;
              }
              text_insert = text_insert.substring(commonlength);
              text_delete = text_delete.substring(commonlength);
            }
            commonlength = diff_commonSuffix(text_insert, text_delete);
            if (commonlength !== 0) {
              diffs[pointer][1] = text_insert.substring(text_insert.length - commonlength) + diffs[pointer][1];
              text_insert = text_insert.substring(0, text_insert.length - commonlength);
              text_delete = text_delete.substring(0, text_delete.length - commonlength);
            }
          }
          pointer -= count_delete + count_insert;
          diffs.splice(pointer, count_delete + count_insert);
          if (text_delete.length) {
            diffs.splice(
              pointer,
              0,
              new Diff(DIFF_DELETE, text_delete)
            );
            pointer++;
          }
          if (text_insert.length) {
            diffs.splice(
              pointer,
              0,
              new Diff(DIFF_INSERT, text_insert)
            );
            pointer++;
          }
          pointer++;
        } else if (pointer !== 0 && diffs[pointer - 1][0] === DIFF_EQUAL) {
          diffs[pointer - 1][1] += diffs[pointer][1];
          diffs.splice(pointer, 1);
        } else {
          pointer++;
        }
        count_insert = 0;
        count_delete = 0;
        text_delete = "";
        text_insert = "";
        break;
    }
  }
  if (diffs[diffs.length - 1][1] === "")
    diffs.pop();
  let changes = false;
  pointer = 1;
  while (pointer < diffs.length - 1) {
    if (diffs[pointer - 1][0] === DIFF_EQUAL && diffs[pointer + 1][0] === DIFF_EQUAL) {
      if (diffs[pointer][1].substring(diffs[pointer][1].length - diffs[pointer - 1][1].length) === diffs[pointer - 1][1]) {
        diffs[pointer][1] = diffs[pointer - 1][1] + diffs[pointer][1].substring(0, diffs[pointer][1].length - diffs[pointer - 1][1].length);
        diffs[pointer + 1][1] = diffs[pointer - 1][1] + diffs[pointer + 1][1];
        diffs.splice(pointer - 1, 1);
        changes = true;
      } else if (diffs[pointer][1].substring(0, diffs[pointer + 1][1].length) === diffs[pointer + 1][1]) {
        diffs[pointer - 1][1] += diffs[pointer + 1][1];
        diffs[pointer][1] = diffs[pointer][1].substring(diffs[pointer + 1][1].length) + diffs[pointer + 1][1];
        diffs.splice(pointer + 1, 1);
        changes = true;
      }
    }
    pointer++;
  }
  if (changes)
    diff_cleanupMerge(diffs);
}

const NO_DIFF_MESSAGE = "Compared values have no visual difference.";
const SIMILAR_MESSAGE = "Compared values serialize to the same structure.\nPrinting internal object structure without calling `toJSON` instead.";

function formatTrailingSpaces(line, trailingSpaceFormatter) {
  return line.replace(/\s+$/, (match) => trailingSpaceFormatter(match));
}
function printDiffLine(line, isFirstOrLast, color, indicator, trailingSpaceFormatter, emptyFirstOrLastLinePlaceholder) {
  return line.length !== 0 ? color(
    `${indicator} ${formatTrailingSpaces(line, trailingSpaceFormatter)}`
  ) : indicator !== " " ? color(indicator) : isFirstOrLast && emptyFirstOrLastLinePlaceholder.length !== 0 ? color(`${indicator} ${emptyFirstOrLastLinePlaceholder}`) : "";
}
function printDeleteLine(line, isFirstOrLast, {
  aColor,
  aIndicator,
  changeLineTrailingSpaceColor,
  emptyFirstOrLastLinePlaceholder
}) {
  return printDiffLine(
    line,
    isFirstOrLast,
    aColor,
    aIndicator,
    changeLineTrailingSpaceColor,
    emptyFirstOrLastLinePlaceholder
  );
}
function printInsertLine(line, isFirstOrLast, {
  bColor,
  bIndicator,
  changeLineTrailingSpaceColor,
  emptyFirstOrLastLinePlaceholder
}) {
  return printDiffLine(
    line,
    isFirstOrLast,
    bColor,
    bIndicator,
    changeLineTrailingSpaceColor,
    emptyFirstOrLastLinePlaceholder
  );
}
function printCommonLine(line, isFirstOrLast, {
  commonColor,
  commonIndicator,
  commonLineTrailingSpaceColor,
  emptyFirstOrLastLinePlaceholder
}) {
  return printDiffLine(
    line,
    isFirstOrLast,
    commonColor,
    commonIndicator,
    commonLineTrailingSpaceColor,
    emptyFirstOrLastLinePlaceholder
  );
}
function createPatchMark(aStart, aEnd, bStart, bEnd, { patchColor }) {
  return patchColor(
    `@@ -${aStart + 1},${aEnd - aStart} +${bStart + 1},${bEnd - bStart} @@`
  );
}
function joinAlignedDiffsNoExpand(diffs, options) {
  const iLength = diffs.length;
  const nContextLines = options.contextLines;
  const nContextLines2 = nContextLines + nContextLines;
  let jLength = iLength;
  let hasExcessAtStartOrEnd = false;
  let nExcessesBetweenChanges = 0;
  let i = 0;
  while (i !== iLength) {
    const iStart = i;
    while (i !== iLength && diffs[i][0] === DIFF_EQUAL)
      i += 1;
    if (iStart !== i) {
      if (iStart === 0) {
        if (i > nContextLines) {
          jLength -= i - nContextLines;
          hasExcessAtStartOrEnd = true;
        }
      } else if (i === iLength) {
        const n = i - iStart;
        if (n > nContextLines) {
          jLength -= n - nContextLines;
          hasExcessAtStartOrEnd = true;
        }
      } else {
        const n = i - iStart;
        if (n > nContextLines2) {
          jLength -= n - nContextLines2;
          nExcessesBetweenChanges += 1;
        }
      }
    }
    while (i !== iLength && diffs[i][0] !== DIFF_EQUAL)
      i += 1;
  }
  const hasPatch = nExcessesBetweenChanges !== 0 || hasExcessAtStartOrEnd;
  if (nExcessesBetweenChanges !== 0)
    jLength += nExcessesBetweenChanges + 1;
  else if (hasExcessAtStartOrEnd)
    jLength += 1;
  const jLast = jLength - 1;
  const lines = [];
  let jPatchMark = 0;
  if (hasPatch)
    lines.push("");
  let aStart = 0;
  let bStart = 0;
  let aEnd = 0;
  let bEnd = 0;
  const pushCommonLine = (line) => {
    const j = lines.length;
    lines.push(printCommonLine(line, j === 0 || j === jLast, options));
    aEnd += 1;
    bEnd += 1;
  };
  const pushDeleteLine = (line) => {
    const j = lines.length;
    lines.push(printDeleteLine(line, j === 0 || j === jLast, options));
    aEnd += 1;
  };
  const pushInsertLine = (line) => {
    const j = lines.length;
    lines.push(printInsertLine(line, j === 0 || j === jLast, options));
    bEnd += 1;
  };
  i = 0;
  while (i !== iLength) {
    let iStart = i;
    while (i !== iLength && diffs[i][0] === DIFF_EQUAL)
      i += 1;
    if (iStart !== i) {
      if (iStart === 0) {
        if (i > nContextLines) {
          iStart = i - nContextLines;
          aStart = iStart;
          bStart = iStart;
          aEnd = aStart;
          bEnd = bStart;
        }
        for (let iCommon = iStart; iCommon !== i; iCommon += 1)
          pushCommonLine(diffs[iCommon][1]);
      } else if (i === iLength) {
        const iEnd = i - iStart > nContextLines ? iStart + nContextLines : i;
        for (let iCommon = iStart; iCommon !== iEnd; iCommon += 1)
          pushCommonLine(diffs[iCommon][1]);
      } else {
        const nCommon = i - iStart;
        if (nCommon > nContextLines2) {
          const iEnd = iStart + nContextLines;
          for (let iCommon = iStart; iCommon !== iEnd; iCommon += 1)
            pushCommonLine(diffs[iCommon][1]);
          lines[jPatchMark] = createPatchMark(
            aStart,
            aEnd,
            bStart,
            bEnd,
            options
          );
          jPatchMark = lines.length;
          lines.push("");
          const nOmit = nCommon - nContextLines2;
          aStart = aEnd + nOmit;
          bStart = bEnd + nOmit;
          aEnd = aStart;
          bEnd = bStart;
          for (let iCommon = i - nContextLines; iCommon !== i; iCommon += 1)
            pushCommonLine(diffs[iCommon][1]);
        } else {
          for (let iCommon = iStart; iCommon !== i; iCommon += 1)
            pushCommonLine(diffs[iCommon][1]);
        }
      }
    }
    while (i !== iLength && diffs[i][0] === DIFF_DELETE) {
      pushDeleteLine(diffs[i][1]);
      i += 1;
    }
    while (i !== iLength && diffs[i][0] === DIFF_INSERT) {
      pushInsertLine(diffs[i][1]);
      i += 1;
    }
  }
  if (hasPatch)
    lines[jPatchMark] = createPatchMark(aStart, aEnd, bStart, bEnd, options);
  return lines.join("\n");
}
function joinAlignedDiffsExpand(diffs, options) {
  return diffs.map((diff, i, diffs2) => {
    const line = diff[1];
    const isFirstOrLast = i === 0 || i === diffs2.length - 1;
    switch (diff[0]) {
      case DIFF_DELETE:
        return printDeleteLine(line, isFirstOrLast, options);
      case DIFF_INSERT:
        return printInsertLine(line, isFirstOrLast, options);
      default:
        return printCommonLine(line, isFirstOrLast, options);
    }
  }).join("\n");
}

const noColor = (string) => string;
const DIFF_CONTEXT_DEFAULT = 5;
function getDefaultOptions() {
  const c = getColors();
  return {
    aAnnotation: "Expected",
    aColor: c.green,
    aIndicator: "-",
    bAnnotation: "Received",
    bColor: c.red,
    bIndicator: "+",
    changeColor: c.inverse,
    changeLineTrailingSpaceColor: noColor,
    commonColor: c.dim,
    commonIndicator: " ",
    commonLineTrailingSpaceColor: noColor,
    compareKeys: void 0,
    contextLines: DIFF_CONTEXT_DEFAULT,
    emptyFirstOrLastLinePlaceholder: "",
    expand: true,
    includeChangeCounts: false,
    omitAnnotationLines: false,
    patchColor: c.yellow
  };
}
function getCompareKeys(compareKeys) {
  return compareKeys && typeof compareKeys === "function" ? compareKeys : void 0;
}
function getContextLines(contextLines) {
  return typeof contextLines === "number" && Number.isSafeInteger(contextLines) && contextLines >= 0 ? contextLines : DIFF_CONTEXT_DEFAULT;
}
function normalizeDiffOptions(options = {}) {
  return {
    ...getDefaultOptions(),
    ...options,
    compareKeys: getCompareKeys(options.compareKeys),
    contextLines: getContextLines(options.contextLines)
  };
}

function isEmptyString(lines) {
  return lines.length === 1 && lines[0].length === 0;
}
function countChanges(diffs) {
  let a = 0;
  let b = 0;
  diffs.forEach((diff2) => {
    switch (diff2[0]) {
      case DIFF_DELETE:
        a += 1;
        break;
      case DIFF_INSERT:
        b += 1;
        break;
    }
  });
  return { a, b };
}
function printAnnotation({
  aAnnotation,
  aColor,
  aIndicator,
  bAnnotation,
  bColor,
  bIndicator,
  includeChangeCounts,
  omitAnnotationLines
}, changeCounts) {
  if (omitAnnotationLines)
    return "";
  let aRest = "";
  let bRest = "";
  if (includeChangeCounts) {
    const aCount = String(changeCounts.a);
    const bCount = String(changeCounts.b);
    const baAnnotationLengthDiff = bAnnotation.length - aAnnotation.length;
    const aAnnotationPadding = " ".repeat(Math.max(0, baAnnotationLengthDiff));
    const bAnnotationPadding = " ".repeat(Math.max(0, -baAnnotationLengthDiff));
    const baCountLengthDiff = bCount.length - aCount.length;
    const aCountPadding = " ".repeat(Math.max(0, baCountLengthDiff));
    const bCountPadding = " ".repeat(Math.max(0, -baCountLengthDiff));
    aRest = `${aAnnotationPadding}  ${aIndicator} ${aCountPadding}${aCount}`;
    bRest = `${bAnnotationPadding}  ${bIndicator} ${bCountPadding}${bCount}`;
  }
  const a = `${aIndicator} ${aAnnotation}${aRest}`;
  const b = `${bIndicator} ${bAnnotation}${bRest}`;
  return `${aColor(a)}
${bColor(b)}

`;
}
function printDiffLines(diffs, options) {
  return printAnnotation(options, countChanges(diffs)) + (options.expand ? joinAlignedDiffsExpand(diffs, options) : joinAlignedDiffsNoExpand(diffs, options));
}
function diffLinesUnified(aLines, bLines, options) {
  return printDiffLines(
    diffLinesRaw(
      isEmptyString(aLines) ? [] : aLines,
      isEmptyString(bLines) ? [] : bLines
    ),
    normalizeDiffOptions(options)
  );
}
function diffLinesUnified2(aLinesDisplay, bLinesDisplay, aLinesCompare, bLinesCompare, options) {
  if (isEmptyString(aLinesDisplay) && isEmptyString(aLinesCompare)) {
    aLinesDisplay = [];
    aLinesCompare = [];
  }
  if (isEmptyString(bLinesDisplay) && isEmptyString(bLinesCompare)) {
    bLinesDisplay = [];
    bLinesCompare = [];
  }
  if (aLinesDisplay.length !== aLinesCompare.length || bLinesDisplay.length !== bLinesCompare.length) {
    return diffLinesUnified(aLinesDisplay, bLinesDisplay, options);
  }
  const diffs = diffLinesRaw(aLinesCompare, bLinesCompare);
  let aIndex = 0;
  let bIndex = 0;
  diffs.forEach((diff2) => {
    switch (diff2[0]) {
      case DIFF_DELETE:
        diff2[1] = aLinesDisplay[aIndex];
        aIndex += 1;
        break;
      case DIFF_INSERT:
        diff2[1] = bLinesDisplay[bIndex];
        bIndex += 1;
        break;
      default:
        diff2[1] = bLinesDisplay[bIndex];
        aIndex += 1;
        bIndex += 1;
    }
  });
  return printDiffLines(diffs, normalizeDiffOptions(options));
}
function diffLinesRaw(aLines, bLines) {
  const aLength = aLines.length;
  const bLength = bLines.length;
  const isCommon = (aIndex2, bIndex2) => aLines[aIndex2] === bLines[bIndex2];
  const diffs = [];
  let aIndex = 0;
  let bIndex = 0;
  const foundSubsequence = (nCommon, aCommon, bCommon) => {
    for (; aIndex !== aCommon; aIndex += 1)
      diffs.push(new Diff(DIFF_DELETE, aLines[aIndex]));
    for (; bIndex !== bCommon; bIndex += 1)
      diffs.push(new Diff(DIFF_INSERT, bLines[bIndex]));
    for (; nCommon !== 0; nCommon -= 1, aIndex += 1, bIndex += 1)
      diffs.push(new Diff(DIFF_EQUAL, bLines[bIndex]));
  };
  const diffSequences = diff$1.default.default || diff$1.default;
  diffSequences(aLength, bLength, isCommon, foundSubsequence);
  for (; aIndex !== aLength; aIndex += 1)
    diffs.push(new Diff(DIFF_DELETE, aLines[aIndex]));
  for (; bIndex !== bLength; bIndex += 1)
    diffs.push(new Diff(DIFF_INSERT, bLines[bIndex]));
  return diffs;
}

function diffStrings(a, b) {
  const isCommon = (aIndex2, bIndex2) => a[aIndex2] === b[bIndex2];
  let aIndex = 0;
  let bIndex = 0;
  const diffs = [];
  const foundSubsequence = (nCommon, aCommon, bCommon) => {
    if (aIndex !== aCommon)
      diffs.push(new Diff(DIFF_DELETE, a.slice(aIndex, aCommon)));
    if (bIndex !== bCommon)
      diffs.push(new Diff(DIFF_INSERT, b.slice(bIndex, bCommon)));
    aIndex = aCommon + nCommon;
    bIndex = bCommon + nCommon;
    diffs.push(new Diff(DIFF_EQUAL, b.slice(bCommon, bIndex)));
  };
  const diffSequences = diff$1.default.default || diff$1.default;
  diffSequences(a.length, b.length, isCommon, foundSubsequence);
  if (aIndex !== a.length)
    diffs.push(new Diff(DIFF_DELETE, a.slice(aIndex)));
  if (bIndex !== b.length)
    diffs.push(new Diff(DIFF_INSERT, b.slice(bIndex)));
  return diffs;
}

function concatenateRelevantDiffs(op, diffs, changeColor) {
  return diffs.reduce(
    (reduced, diff) => reduced + (diff[0] === DIFF_EQUAL ? diff[1] : diff[0] === op && diff[1].length !== 0 ? changeColor(diff[1]) : ""),
    ""
  );
}
class ChangeBuffer {
  op;
  line;
  // incomplete line
  lines;
  // complete lines
  changeColor;
  constructor(op, changeColor) {
    this.op = op;
    this.line = [];
    this.lines = [];
    this.changeColor = changeColor;
  }
  pushSubstring(substring) {
    this.pushDiff(new Diff(this.op, substring));
  }
  pushLine() {
    this.lines.push(
      this.line.length !== 1 ? new Diff(
        this.op,
        concatenateRelevantDiffs(this.op, this.line, this.changeColor)
      ) : this.line[0][0] === this.op ? this.line[0] : new Diff(this.op, this.line[0][1])
      // was common diff
    );
    this.line.length = 0;
  }
  isLineEmpty() {
    return this.line.length === 0;
  }
  // Minor input to buffer.
  pushDiff(diff) {
    this.line.push(diff);
  }
  // Main input to buffer.
  align(diff) {
    const string = diff[1];
    if (string.includes("\n")) {
      const substrings = string.split("\n");
      const iLast = substrings.length - 1;
      substrings.forEach((substring, i) => {
        if (i < iLast) {
          this.pushSubstring(substring);
          this.pushLine();
        } else if (substring.length !== 0) {
          this.pushSubstring(substring);
        }
      });
    } else {
      this.pushDiff(diff);
    }
  }
  // Output from buffer.
  moveLinesTo(lines) {
    if (!this.isLineEmpty())
      this.pushLine();
    lines.push(...this.lines);
    this.lines.length = 0;
  }
}
class CommonBuffer {
  deleteBuffer;
  insertBuffer;
  lines;
  constructor(deleteBuffer, insertBuffer) {
    this.deleteBuffer = deleteBuffer;
    this.insertBuffer = insertBuffer;
    this.lines = [];
  }
  pushDiffCommonLine(diff) {
    this.lines.push(diff);
  }
  pushDiffChangeLines(diff) {
    const isDiffEmpty = diff[1].length === 0;
    if (!isDiffEmpty || this.deleteBuffer.isLineEmpty())
      this.deleteBuffer.pushDiff(diff);
    if (!isDiffEmpty || this.insertBuffer.isLineEmpty())
      this.insertBuffer.pushDiff(diff);
  }
  flushChangeLines() {
    this.deleteBuffer.moveLinesTo(this.lines);
    this.insertBuffer.moveLinesTo(this.lines);
  }
  // Input to buffer.
  align(diff) {
    const op = diff[0];
    const string = diff[1];
    if (string.includes("\n")) {
      const substrings = string.split("\n");
      const iLast = substrings.length - 1;
      substrings.forEach((substring, i) => {
        if (i === 0) {
          const subdiff = new Diff(op, substring);
          if (this.deleteBuffer.isLineEmpty() && this.insertBuffer.isLineEmpty()) {
            this.flushChangeLines();
            this.pushDiffCommonLine(subdiff);
          } else {
            this.pushDiffChangeLines(subdiff);
            this.flushChangeLines();
          }
        } else if (i < iLast) {
          this.pushDiffCommonLine(new Diff(op, substring));
        } else if (substring.length !== 0) {
          this.pushDiffChangeLines(new Diff(op, substring));
        }
      });
    } else {
      this.pushDiffChangeLines(diff);
    }
  }
  // Output from buffer.
  getLines() {
    this.flushChangeLines();
    return this.lines;
  }
}
function getAlignedDiffs(diffs, changeColor) {
  const deleteBuffer = new ChangeBuffer(DIFF_DELETE, changeColor);
  const insertBuffer = new ChangeBuffer(DIFF_INSERT, changeColor);
  const commonBuffer = new CommonBuffer(deleteBuffer, insertBuffer);
  diffs.forEach((diff) => {
    switch (diff[0]) {
      case DIFF_DELETE:
        deleteBuffer.align(diff);
        break;
      case DIFF_INSERT:
        insertBuffer.align(diff);
        break;
      default:
        commonBuffer.align(diff);
    }
  });
  return commonBuffer.getLines();
}

function hasCommonDiff(diffs, isMultiline) {
  if (isMultiline) {
    const iLast = diffs.length - 1;
    return diffs.some(
      (diff, i) => diff[0] === DIFF_EQUAL && (i !== iLast || diff[1] !== "\n")
    );
  }
  return diffs.some((diff) => diff[0] === DIFF_EQUAL);
}
function diffStringsUnified(a, b, options) {
  if (a !== b && a.length !== 0 && b.length !== 0) {
    const isMultiline = a.includes("\n") || b.includes("\n");
    const diffs = diffStringsRaw(
      isMultiline ? `${a}
` : a,
      isMultiline ? `${b}
` : b,
      true
      // cleanupSemantic
    );
    if (hasCommonDiff(diffs, isMultiline)) {
      const optionsNormalized = normalizeDiffOptions(options);
      const lines = getAlignedDiffs(diffs, optionsNormalized.changeColor);
      return printDiffLines(lines, optionsNormalized);
    }
  }
  return diffLinesUnified(a.split("\n"), b.split("\n"), options);
}
function diffStringsRaw(a, b, cleanup) {
  const diffs = diffStrings(a, b);
  if (cleanup)
    diff_cleanupSemantic(diffs);
  return diffs;
}

function getCommonMessage(message, options) {
  const { commonColor } = normalizeDiffOptions(options);
  return commonColor(message);
}
const {
  AsymmetricMatcher,
  DOMCollection,
  DOMElement,
  Immutable,
  ReactElement,
  ReactTestComponent
} = plugins;
const PLUGINS = [
  ReactTestComponent,
  ReactElement,
  DOMElement,
  DOMCollection,
  Immutable,
  AsymmetricMatcher
];
const FORMAT_OPTIONS = {
  plugins: PLUGINS
};
const FALLBACK_FORMAT_OPTIONS = {
  callToJSON: false,
  maxDepth: 10,
  plugins: PLUGINS
};
function diff(a, b, options) {
  if (Object.is(a, b))
    return "";
  const aType = getType(a);
  let expectedType = aType;
  let omitDifference = false;
  if (aType === "object" && typeof a.asymmetricMatch === "function") {
    if (a.$$typeof !== Symbol.for("jest.asymmetricMatcher")) {
      return null;
    }
    if (typeof a.getExpectedType !== "function") {
      return null;
    }
    expectedType = a.getExpectedType();
    omitDifference = expectedType === "string";
  }
  if (expectedType !== getType(b)) {
    const { aAnnotation, aColor, aIndicator, bAnnotation, bColor, bIndicator } = normalizeDiffOptions(options);
    const formatOptions = getFormatOptions(FALLBACK_FORMAT_OPTIONS, options);
    const aDisplay = format(a, formatOptions);
    const bDisplay = format(b, formatOptions);
    const aDiff = `${aColor(`${aIndicator} ${aAnnotation}:`)} 
${aDisplay}`;
    const bDiff = `${bColor(`${bIndicator} ${bAnnotation}:`)} 
${bDisplay}`;
    return `${aDiff}

${bDiff}`;
  }
  if (omitDifference)
    return null;
  switch (aType) {
    case "string":
      return diffLinesUnified(a.split("\n"), b.split("\n"), options);
    case "boolean":
    case "number":
      return comparePrimitive(a, b, options);
    case "map":
      return compareObjects(sortMap(a), sortMap(b), options);
    case "set":
      return compareObjects(sortSet(a), sortSet(b), options);
    default:
      return compareObjects(a, b, options);
  }
}
function comparePrimitive(a, b, options) {
  const aFormat = format(a, FORMAT_OPTIONS);
  const bFormat = format(b, FORMAT_OPTIONS);
  return aFormat === bFormat ? "" : diffLinesUnified(aFormat.split("\n"), bFormat.split("\n"), options);
}
function sortMap(map) {
  return new Map(Array.from(map.entries()).sort());
}
function sortSet(set) {
  return new Set(Array.from(set.values()).sort());
}
function compareObjects(a, b, options) {
  let difference;
  let hasThrown = false;
  try {
    const formatOptions = getFormatOptions(FORMAT_OPTIONS, options);
    difference = getObjectsDifference(a, b, formatOptions, options);
  } catch {
    hasThrown = true;
  }
  const noDiffMessage = getCommonMessage(NO_DIFF_MESSAGE, options);
  if (difference === void 0 || difference === noDiffMessage) {
    const formatOptions = getFormatOptions(FALLBACK_FORMAT_OPTIONS, options);
    difference = getObjectsDifference(a, b, formatOptions, options);
    if (difference !== noDiffMessage && !hasThrown) {
      difference = `${getCommonMessage(
        SIMILAR_MESSAGE,
        options
      )}

${difference}`;
    }
  }
  return difference;
}
function getFormatOptions(formatOptions, options) {
  const { compareKeys } = normalizeDiffOptions(options);
  return {
    ...formatOptions,
    compareKeys
  };
}
function getObjectsDifference(a, b, formatOptions, options) {
  const formatOptionsZeroIndent = { ...formatOptions, indent: 0 };
  const aCompare = format(a, formatOptionsZeroIndent);
  const bCompare = format(b, formatOptionsZeroIndent);
  if (aCompare === bCompare) {
    return getCommonMessage(NO_DIFF_MESSAGE, options);
  } else {
    const aDisplay = format(a, formatOptions);
    const bDisplay = format(b, formatOptions);
    return diffLinesUnified2(
      aDisplay.split("\n"),
      bDisplay.split("\n"),
      aCompare.split("\n"),
      bCompare.split("\n"),
      options
    );
  }
}

export { DIFF_DELETE, DIFF_EQUAL, DIFF_INSERT, Diff, diff, diffLinesRaw, diffLinesUnified, diffLinesUnified2, diffStringsRaw, diffStringsUnified };
