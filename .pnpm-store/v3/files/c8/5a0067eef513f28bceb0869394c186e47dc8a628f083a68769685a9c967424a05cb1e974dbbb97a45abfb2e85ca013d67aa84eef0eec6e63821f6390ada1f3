const SAFE_TIMERS_SYMBOL = Symbol("vitest:SAFE_TIMERS");
const SAFE_COLORS_SYMBOL = Symbol("vitest:SAFE_COLORS");

const colorsMap = {
  bold: ["\x1B[1m", "\x1B[22m", "\x1B[22m\x1B[1m"],
  dim: ["\x1B[2m", "\x1B[22m", "\x1B[22m\x1B[2m"],
  italic: ["\x1B[3m", "\x1B[23m"],
  underline: ["\x1B[4m", "\x1B[24m"],
  inverse: ["\x1B[7m", "\x1B[27m"],
  hidden: ["\x1B[8m", "\x1B[28m"],
  strikethrough: ["\x1B[9m", "\x1B[29m"],
  black: ["\x1B[30m", "\x1B[39m"],
  red: ["\x1B[31m", "\x1B[39m"],
  green: ["\x1B[32m", "\x1B[39m"],
  yellow: ["\x1B[33m", "\x1B[39m"],
  blue: ["\x1B[34m", "\x1B[39m"],
  magenta: ["\x1B[35m", "\x1B[39m"],
  cyan: ["\x1B[36m", "\x1B[39m"],
  white: ["\x1B[37m", "\x1B[39m"],
  gray: ["\x1B[90m", "\x1B[39m"],
  bgBlack: ["\x1B[40m", "\x1B[49m"],
  bgRed: ["\x1B[41m", "\x1B[49m"],
  bgGreen: ["\x1B[42m", "\x1B[49m"],
  bgYellow: ["\x1B[43m", "\x1B[49m"],
  bgBlue: ["\x1B[44m", "\x1B[49m"],
  bgMagenta: ["\x1B[45m", "\x1B[49m"],
  bgCyan: ["\x1B[46m", "\x1B[49m"],
  bgWhite: ["\x1B[47m", "\x1B[49m"]
};
const colorsEntries = Object.entries(colorsMap);
function string(str) {
  return String(str);
}
string.open = "";
string.close = "";
const defaultColors = /* @__PURE__ */ colorsEntries.reduce((acc, [key]) => {
  acc[key] = string;
  return acc;
}, { isColorSupported: false });
function getDefaultColors() {
  return { ...defaultColors };
}
function getColors() {
  return globalThis[SAFE_COLORS_SYMBOL] || defaultColors;
}
function createColors(isTTY = false) {
  const enabled = typeof process !== "undefined" && !("NO_COLOR" in process.env || process.argv.includes("--no-color")) && !("GITHUB_ACTIONS" in process.env) && ("FORCE_COLOR" in process.env || process.argv.includes("--color") || process.platform === "win32" || isTTY && process.env.TERM !== "dumb" || "CI" in process.env);
  const replaceClose = (string2, close, replace, index) => {
    const start = string2.substring(0, index) + replace;
    const end = string2.substring(index + close.length);
    const nextIndex = end.indexOf(close);
    return ~nextIndex ? start + replaceClose(end, close, replace, nextIndex) : start + end;
  };
  const formatter = (open, close, replace = open) => {
    const fn = (input) => {
      const string2 = String(input);
      const index = string2.indexOf(close, open.length);
      return ~index ? open + replaceClose(string2, close, replace, index) + close : open + string2 + close;
    };
    fn.open = open;
    fn.close = close;
    return fn;
  };
  const colorsObject = {
    isColorSupported: enabled,
    reset: enabled ? (s) => `\x1B[0m${s}\x1B[0m` : string
  };
  for (const [name, formatterArgs] of colorsEntries) {
    colorsObject[name] = enabled ? formatter(...formatterArgs) : string;
  }
  return colorsObject;
}
function setupColors(colors) {
  globalThis[SAFE_COLORS_SYMBOL] = colors;
}

export { SAFE_TIMERS_SYMBOL as S, SAFE_COLORS_SYMBOL as a, getColors as b, createColors as c, getDefaultColors as g, setupColors as s };
