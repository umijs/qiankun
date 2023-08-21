"use strict";
var f = Object.defineProperty;
var S = Object.getOwnPropertyDescriptor;
var H = Object.getOwnPropertyNames;
var z = Object.prototype.hasOwnProperty;
var P = (n, i, t) => i in n ? f(n, i, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[i] = t;
var j = (n, i) => {
  for (var t in i)
    f(n, t, { get: i[t], enumerable: !0 });
}, q = (n, i, t, e) => {
  if (i && typeof i == "object" || typeof i == "function")
    for (let s of H(i))
      !z.call(n, s) && s !== t && f(n, s, { get: () => i[s], enumerable: !(e = S(i, s)) || e.enumerable });
  return n;
};
var N = (n) => q(f({}, "__esModule", { value: !0 }), n);
var r = (n, i, t) => (P(n, typeof i != "symbol" ? i + "" : i, t), t);

// src/index.ts
var G = {};
j(G, {
  Bench: () => u,
  Task: () => p,
  default: () => D,
  now: () => E
});
module.exports = N(G);

// src/event.ts
function a(n, i = null) {
  let t = new Event(n);
  return Object.defineProperty(t, "task", {
    value: i,
    enumerable: !0,
    writable: !1,
    configurable: !1
  }), t;
}

// src/constants.ts
var V = {
  1: 12.71,
  2: 4.303,
  3: 3.182,
  4: 2.776,
  5: 2.571,
  6: 2.447,
  7: 2.365,
  8: 2.306,
  9: 2.262,
  10: 2.228,
  11: 2.201,
  12: 2.179,
  13: 2.16,
  14: 2.145,
  15: 2.131,
  16: 2.12,
  17: 2.11,
  18: 2.101,
  19: 2.093,
  20: 2.086,
  21: 2.08,
  22: 2.074,
  23: 2.069,
  24: 2.064,
  25: 2.06,
  26: 2.056,
  27: 2.052,
  28: 2.048,
  29: 2.045,
  30: 2.042,
  31: 2.0399,
  32: 2.0378,
  33: 2.0357,
  34: 2.0336,
  35: 2.0315,
  36: 2.0294,
  37: 2.0273,
  38: 2.0252,
  39: 2.0231,
  40: 2.021,
  41: 2.0198,
  42: 2.0186,
  43: 2.0174,
  44: 2.0162,
  45: 2.015,
  46: 2.0138,
  47: 2.0126,
  48: 2.0114,
  49: 2.0102,
  50: 2.009,
  51: 2.0081,
  52: 2.0072,
  53: 2.0063,
  54: 2.0054,
  55: 2.0045,
  56: 2.0036,
  57: 2.0027,
  58: 2.0018,
  59: 2.0009,
  60: 2,
  61: 1.9995,
  62: 1.999,
  63: 1.9985,
  64: 1.998,
  65: 1.9975,
  66: 1.997,
  67: 1.9965,
  68: 1.996,
  69: 1.9955,
  70: 1.995,
  71: 1.9945,
  72: 1.994,
  73: 1.9935,
  74: 1.993,
  75: 1.9925,
  76: 1.992,
  77: 1.9915,
  78: 1.991,
  79: 1.9905,
  80: 1.99,
  81: 1.9897,
  82: 1.9894,
  83: 1.9891,
  84: 1.9888,
  85: 1.9885,
  86: 1.9882,
  87: 1.9879,
  88: 1.9876,
  89: 1.9873,
  90: 1.987,
  91: 1.9867,
  92: 1.9864,
  93: 1.9861,
  94: 1.9858,
  95: 1.9855,
  96: 1.9852,
  97: 1.9849,
  98: 1.9846,
  99: 1.9843,
  100: 1.984,
  101: 1.9838,
  102: 1.9836,
  103: 1.9834,
  104: 1.9832,
  105: 1.983,
  106: 1.9828,
  107: 1.9826,
  108: 1.9824,
  109: 1.9822,
  110: 1.982,
  111: 1.9818,
  112: 1.9816,
  113: 1.9814,
  114: 1.9812,
  115: 1.9819,
  116: 1.9808,
  117: 1.9806,
  118: 1.9804,
  119: 1.9802,
  120: 1.98,
  infinity: 1.96
}, b = V;

// src/utils.ts
var C = (n) => n / 1e6, E = () => {
  var n;
  return typeof ((n = globalThis.process) == null ? void 0 : n.hrtime) == "function" ? C(Number(process.hrtime.bigint())) : performance.now();
}, F = (n) => n.reduce((i, t) => i + t, 0) / n.length || 0, B = (n, i) => n.reduce((e, s) => e + (s - i) ** 2) / (n.length - 1) || 0, $ = (async () => {
}).constructor, O = (n) => n.constructor === $;

// src/task.ts
var p = class extends EventTarget {
  constructor(t, e, s, o = {}) {
    super();
    r(this, "bench");
    r(this, "name");
    r(this, "fn");
    r(this, "runs", 0);
    r(this, "result");
    r(this, "opts");
    this.bench = t, this.name = e, this.fn = s, this.opts = o;
  }
  async run() {
    var o, l, m;
    this.dispatchEvent(a("start", this));
    let t = 0, e = [], s = O(this.fn);
    for (await this.bench.setup(this, "run"), this.opts.beforeAll != null && await this.opts.beforeAll.call(this); (t < this.bench.time || this.runs < this.bench.iterations) && !((o = this.bench.signal) != null && o.aborted); ) {
      this.opts.beforeEach != null && await this.opts.beforeEach.call(this);
      let h = 0;
      try {
        h = this.bench.now(), s ? await this.fn() : this.fn();
      } catch (v) {
        this.setResult({ error: v });
      }
      let c = this.bench.now() - h;
      this.runs += 1, e.push(c), t += c, this.opts.afterEach != null && await this.opts.afterEach.call(this);
    }
    this.opts.afterAll != null && await this.opts.afterAll.call(this), await this.bench.teardown(this, "run"), e.sort((h, c) => h - c);
    {
      let h = e[0], c = e[e.length - 1], v = t / this.runs, L = 1e3 / v, w = F(e), g = B(e, w), T = Math.sqrt(g), k = T / Math.sqrt(e.length), y = e.length - 1, x = b[String(Math.round(y) || 1)] || b.infinity, M = k * x, A = M / w * 100 || 0, K = e[Math.ceil(e.length * (75 / 100)) - 1], _ = e[Math.ceil(e.length * (99 / 100)) - 1], R = e[Math.ceil(e.length * (99.5 / 100)) - 1], I = e[Math.ceil(e.length * (99.9 / 100)) - 1];
      if ((l = this.bench.signal) != null && l.aborted)
        return this;
      this.setResult({
        totalTime: t,
        min: h,
        max: c,
        hz: L,
        period: v,
        samples: e,
        mean: w,
        variance: g,
        sd: T,
        sem: k,
        df: y,
        critical: x,
        moe: M,
        rme: A,
        p75: K,
        p99: _,
        p995: R,
        p999: I
      });
    }
    return (m = this.result) != null && m.error && (this.dispatchEvent(a("error", this)), this.bench.dispatchEvent(a("error", this))), this.dispatchEvent(a("cycle", this)), this.bench.dispatchEvent(a("cycle", this)), this.dispatchEvent(a("complete", this)), this;
  }
  async warmup() {
    var s;
    this.dispatchEvent(a("warmup", this));
    let t = this.bench.now(), e = 0;
    for (await this.bench.setup(this, "warmup"); (e < this.bench.warmupTime || this.runs < this.bench.warmupIterations) && !((s = this.bench.signal) != null && s.aborted); ) {
      try {
        await Promise.resolve().then(this.fn);
      } catch (o) {
      }
      this.runs += 1, e = this.bench.now() - t;
    }
    this.bench.teardown(this, "warmup"), this.runs = 0;
  }
  addEventListener(t, e, s) {
    super.addEventListener(t, e, s);
  }
  removeEventListener(t, e, s) {
    super.removeEventListener(t, e, s);
  }
  setResult(t) {
    this.result = { ...this.result, ...t }, Object.freeze(this.reset);
  }
  reset() {
    this.dispatchEvent(a("reset", this)), this.runs = 0, this.result = void 0;
  }
};

// src/bench.ts
var u = class extends EventTarget {
  constructor(t = {}) {
    var e, s, o, l, m, h, c;
    super();
    r(this, "_tasks", /* @__PURE__ */ new Map());
    r(this, "_todos", /* @__PURE__ */ new Map());
    r(this, "signal");
    r(this, "warmupTime", 100);
    r(this, "warmupIterations", 5);
    r(this, "time", 500);
    r(this, "iterations", 10);
    r(this, "now", E);
    r(this, "setup");
    r(this, "teardown");
    this.now = (e = t.now) != null ? e : this.now, this.warmupTime = (s = t.warmupTime) != null ? s : this.warmupTime, this.warmupIterations = (o = t.warmupIterations) != null ? o : this.warmupIterations, this.time = (l = t.time) != null ? l : this.time, this.iterations = (m = t.iterations) != null ? m : this.iterations, this.signal = t.signal, this.setup = (h = t.setup) != null ? h : () => {
    }, this.teardown = (c = t.teardown) != null ? c : () => {
    }, this.signal && this.signal.addEventListener(
      "abort",
      () => {
        this.dispatchEvent(a("abort"));
      },
      { once: !0 }
    );
  }
  async run() {
    var e;
    this.dispatchEvent(a("start"));
    let t = [];
    for (let s of [...this._tasks.values()])
      (e = this.signal) != null && e.aborted ? t.push(s) : t.push(await s.run());
    return this.dispatchEvent(a("complete")), t;
  }
  async warmup() {
    this.dispatchEvent(a("warmup"));
    for (let [, t] of this._tasks)
      await t.warmup();
  }
  reset() {
    this.dispatchEvent(a("reset")), this._tasks.forEach((t) => {
      t.reset();
    });
  }
  add(t, e, s = {}) {
    let o = new p(this, t, e, s);
    return this._tasks.set(t, o), this.dispatchEvent(a("add", o)), this;
  }
  todo(t, e = () => {
  }, s = {}) {
    let o = new p(this, t, e, s);
    return this._todos.set(t, o), this.dispatchEvent(a("todo", o)), this;
  }
  remove(t) {
    let e = this.getTask(t);
    return this.dispatchEvent(a("remove", e)), this._tasks.delete(t), this;
  }
  addEventListener(t, e, s) {
    super.addEventListener(t, e, s);
  }
  removeEventListener(t, e, s) {
    super.removeEventListener(t, e, s);
  }
  table() {
    return this.tasks.map(({ name: t, result: e }) => e ? {
      "Task Name": t,
      "ops/sec": parseInt(e.hz.toString(), 10).toLocaleString(),
      "Average Time (ns)": e.mean * 1e3 * 1e3,
      Margin: `\xB1${e.rme.toFixed(2)}%`,
      Samples: e.samples.length
    } : null);
  }
  get results() {
    return [...this._tasks.values()].map((t) => t.result);
  }
  get tasks() {
    return [...this._tasks.values()];
  }
  get todos() {
    return [...this._todos.values()];
  }
  getTask(t) {
    return this._tasks.get(t);
  }
};

// src/index.ts
var D = u;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Bench,
  Task,
  now
});
