"use strict";
var k = Object.defineProperty;
var C = Object.getOwnPropertyDescriptor;
var E = Object.getOwnPropertyNames;
var G = Object.prototype.hasOwnProperty;
var j = (e, t) => {
  for (var r in t)
    k(e, r, { get: t[r], enumerable: !0 });
}, D = (e, t, r, o) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (let n of E(t))
      !G.call(e, n) && n !== r && k(e, n, { get: () => t[n], enumerable: !(o = C(t, n)) || o.enumerable });
  return e;
};
var F = (e) => D(k({}, "__esModule", { value: !0 }), e);

// src/index.ts
var B = {};
j(B, {
  createInternalSpy: () => m,
  getInternalState: () => I,
  internalSpyOn: () => K,
  restoreAll: () => z,
  spies: () => d,
  spy: () => _,
  spyOn: () => $
});
module.exports = F(B);

// src/utils.ts
function g(e, t) {
  if (!e)
    throw new Error(t);
}
function i(e, t) {
  return typeof t === e;
}
function b(e) {
  return e instanceof Promise;
}
function f(e, t, r) {
  Object.defineProperty(e, t, r);
}
function l(e, t, r) {
  Object.defineProperty(e, t, { value: r });
}

// src/constants.ts
var y = Symbol.for("tinyspy:spy");

// src/internal.ts
var d = /* @__PURE__ */ new Set(), q = (e) => {
  e.called = !1, e.callCount = 0, e.calls = [], e.results = [];
}, V = (e) => (f(e, y, { value: { reset: () => q(e[y]) } }), e[y]), I = (e) => e[y] || V(e);
function m(e) {
  g(i("function", e) || i("undefined", e), "cannot spy on a non-function value");
  let t = function(...o) {
    let n = I(t);
    if (n.called = !0, n.callCount++, n.calls.push(o), n.next) {
      let [p, s] = n.next;
      if (n.results.push(n.next), n.next = null, p === "ok")
        return s;
      throw s;
    }
    let a, x = "ok";
    if (n.impl)
      try {
        a = n.impl.apply(this, o), x = "ok";
      } catch (p) {
        throw a = p, x = "error", n.results.push([x, p]), p;
      }
    let u = [x, a];
    if (b(a)) {
      let p = a.then((s) => u[1] = s).catch((s) => {
        throw u[0] = "error", u[1] = s, s;
      });
      Object.assign(p, a), a = p;
    }
    return n.results.push(u), a;
  };
  l(t, "_isMockFunction", !0), l(t, "length", e ? e.length : 0), l(t, "name", e && e.name || "spy");
  let r = I(t);
  return r.reset(), r.impl = e, t;
}
function A(e) {
  let t = I(e);
  f(e, "returns", {
    get: () => t.results.map(([, r]) => r)
  }), ["called", "callCount", "results", "calls", "reset", "impl"].forEach((r) => f(e, r, { get: () => t[r], set: (o) => t[r] = o })), l(e, "nextError", (r) => (t.next = ["error", r], t)), l(e, "nextResult", (r) => (t.next = ["ok", r], t));
}

// src/spy.ts
function _(e) {
  let t = m(e);
  return A(t), t;
}

// src/spyOn.ts
var P = (e, t) => Object.getOwnPropertyDescriptor(e, t);
function K(e, t, r) {
  g(!i("undefined", e), "spyOn could not find an object to spy upon"), g(i("object", e) || i("function", e), "cannot spyOn on a primitive value");
  let o = () => {
    if (!i("object", t))
      return [t, "value"];
    if ("getter" in t && "setter" in t)
      throw new Error("cannot spy on both getter and setter");
    if ("getter" in t)
      return [t.getter, "get"];
    if ("setter" in t)
      return [t.setter, "set"];
    throw new Error("specify getter or setter to spy on");
  }, [n, a] = o(), x = P(e, n), u = Object.getPrototypeOf(e), p = u && P(u, n), s = x || p;
  g(s || n in e, `${String(n)} does not exist`);
  let v = !1;
  a === "value" && s && !s.value && s.get && (a = "get", v = !0, r = s.get());
  let c;
  s ? c = s[a] : a !== "value" ? c = () => e[n] : c = e[n], r || (r = c);
  let S = m(r), O = (w) => {
    let { value: H, ...h } = s || {
      configurable: !0,
      writable: !0
    };
    a !== "value" && delete h.writable, h[a] = w, f(e, n, h);
  }, M = () => s ? f(e, n, s) : O(c), T = S[y];
  return l(T, "restore", M), l(T, "getOriginal", () => v ? c() : c), l(T, "willCall", (w) => (T.impl = w, S)), O(v ? () => S : S), d.add(S), S;
}
function $(e, t, r) {
  let o = K(e, t, r);
  return A(o), ["restore", "getOriginal", "willCall"].forEach((n) => {
    l(o, n, o[y][n]);
  }), o;
}

// src/restoreAll.ts
function z() {
  for (let e of d)
    e.restore();
  d.clear();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createInternalSpy,
  getInternalState,
  internalSpyOn,
  restoreAll,
  spies,
  spy,
  spyOn
});
