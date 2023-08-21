var S = Object.defineProperty;
var H = (n, a, t) => a in n ? S(n, a, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[a] = t;
var i = (n, a, t) => (H(n, typeof a != "symbol" ? a + "" : a, t), t);

// src/event.ts
function r(n, a = null) {
  let t = new Event(n);
  return Object.defineProperty(t, "task", {
    value: a,
    enumerable: !0,
    writable: !1,
    configurable: !1
  }), t;
}

// src/constants.ts
var z = {
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
}, w = z;

// src/utils.ts
var P = (n) => n / 1e6, b = () => {
  var n;
  return typeof ((n = globalThis.process) == null ? void 0 : n.hrtime) == "function" ? P(Number(process.hrtime.bigint())) : performance.now();
}, F = (n) => n.reduce((a, t) => a + t, 0) / n.length || 0, B = (n, a) => n.reduce((e, s) => e + (s - a) ** 2) / (n.length - 1) || 0, j = (async () => {
}).constructor, O = (n) => n.constructor === j;

// src/task.ts
var p = class extends EventTarget {
  constructor(t, e, s, o = {}) {
    super();
    i(this, "bench");
    i(this, "name");
    i(this, "fn");
    i(this, "runs", 0);
    i(this, "result");
    i(this, "opts");
    this.bench = t, this.name = e, this.fn = s, this.opts = o;
  }
  async run() {
    var o, u, l;
    this.dispatchEvent(r("start", this));
    let t = 0, e = [], s = O(this.fn);
    for (await this.bench.setup(this, "run"), this.opts.beforeAll != null && await this.opts.beforeAll.call(this); (t < this.bench.time || this.runs < this.bench.iterations) && !((o = this.bench.signal) != null && o.aborted); ) {
      this.opts.beforeEach != null && await this.opts.beforeEach.call(this);
      let h = 0;
      try {
        h = this.bench.now(), s ? await this.fn() : this.fn();
      } catch (f) {
        this.setResult({ error: f });
      }
      let c = this.bench.now() - h;
      this.runs += 1, e.push(c), t += c, this.opts.afterEach != null && await this.opts.afterEach.call(this);
    }
    this.opts.afterAll != null && await this.opts.afterAll.call(this), await this.bench.teardown(this, "run"), e.sort((h, c) => h - c);
    {
      let h = e[0], c = e[e.length - 1], f = t / this.runs, L = 1e3 / f, E = F(e), g = B(e, E), T = Math.sqrt(g), k = T / Math.sqrt(e.length), y = e.length - 1, x = w[String(Math.round(y) || 1)] || w.infinity, M = k * x, A = M / E * 100 || 0, K = e[Math.ceil(e.length * (75 / 100)) - 1], _ = e[Math.ceil(e.length * (99 / 100)) - 1], R = e[Math.ceil(e.length * (99.5 / 100)) - 1], I = e[Math.ceil(e.length * (99.9 / 100)) - 1];
      if ((u = this.bench.signal) != null && u.aborted)
        return this;
      this.setResult({
        totalTime: t,
        min: h,
        max: c,
        hz: L,
        period: f,
        samples: e,
        mean: E,
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
    return (l = this.result) != null && l.error && (this.dispatchEvent(r("error", this)), this.bench.dispatchEvent(r("error", this))), this.dispatchEvent(r("cycle", this)), this.bench.dispatchEvent(r("cycle", this)), this.dispatchEvent(r("complete", this)), this;
  }
  async warmup() {
    var s;
    this.dispatchEvent(r("warmup", this));
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
    this.dispatchEvent(r("reset", this)), this.runs = 0, this.result = void 0;
  }
};

// src/bench.ts
var v = class extends EventTarget {
  constructor(t = {}) {
    var e, s, o, u, l, h, c;
    super();
    i(this, "_tasks", /* @__PURE__ */ new Map());
    i(this, "_todos", /* @__PURE__ */ new Map());
    i(this, "signal");
    i(this, "warmupTime", 100);
    i(this, "warmupIterations", 5);
    i(this, "time", 500);
    i(this, "iterations", 10);
    i(this, "now", b);
    i(this, "setup");
    i(this, "teardown");
    this.now = (e = t.now) != null ? e : this.now, this.warmupTime = (s = t.warmupTime) != null ? s : this.warmupTime, this.warmupIterations = (o = t.warmupIterations) != null ? o : this.warmupIterations, this.time = (u = t.time) != null ? u : this.time, this.iterations = (l = t.iterations) != null ? l : this.iterations, this.signal = t.signal, this.setup = (h = t.setup) != null ? h : () => {
    }, this.teardown = (c = t.teardown) != null ? c : () => {
    }, this.signal && this.signal.addEventListener(
      "abort",
      () => {
        this.dispatchEvent(r("abort"));
      },
      { once: !0 }
    );
  }
  async run() {
    var e;
    this.dispatchEvent(r("start"));
    let t = [];
    for (let s of [...this._tasks.values()])
      (e = this.signal) != null && e.aborted ? t.push(s) : t.push(await s.run());
    return this.dispatchEvent(r("complete")), t;
  }
  async warmup() {
    this.dispatchEvent(r("warmup"));
    for (let [, t] of this._tasks)
      await t.warmup();
  }
  reset() {
    this.dispatchEvent(r("reset")), this._tasks.forEach((t) => {
      t.reset();
    });
  }
  add(t, e, s = {}) {
    let o = new p(this, t, e, s);
    return this._tasks.set(t, o), this.dispatchEvent(r("add", o)), this;
  }
  todo(t, e = () => {
  }, s = {}) {
    let o = new p(this, t, e, s);
    return this._todos.set(t, o), this.dispatchEvent(r("todo", o)), this;
  }
  remove(t) {
    let e = this.getTask(t);
    return this.dispatchEvent(r("remove", e)), this._tasks.delete(t), this;
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
var tt = v;
export {
  v as Bench,
  p as Task,
  tt as default,
  b as now
};
