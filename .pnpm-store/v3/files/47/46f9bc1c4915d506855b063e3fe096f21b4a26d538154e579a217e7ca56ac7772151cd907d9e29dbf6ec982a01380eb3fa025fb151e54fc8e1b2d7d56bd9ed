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
var m = /* @__PURE__ */ new Set(), M = (e) => {
  e.called = !1, e.callCount = 0, e.calls = [], e.results = [];
}, C = (e) => (f(e, y, { value: { reset: () => M(e[y]) } }), e[y]), A = (e) => e[y] || C(e);
function I(e) {
  g(i("function", e) || i("undefined", e), "cannot spy on a non-function value");
  let t = function(...o) {
    let n = A(t);
    if (n.called = !0, n.callCount++, n.calls.push(o), n.next) {
      let [p, s] = n.next;
      if (n.results.push(n.next), n.next = null, p === "ok")
        return s;
      throw s;
    }
    let a, d = "ok";
    if (n.impl)
      try {
        a = n.impl.apply(this, o), d = "ok";
      } catch (p) {
        throw a = p, d = "error", n.results.push([d, p]), p;
      }
    let u = [d, a];
    if (b(a)) {
      let p = a.then((s) => u[1] = s).catch((s) => {
        throw u[0] = "error", u[1] = s, s;
      });
      Object.assign(p, a), a = p;
    }
    return n.results.push(u), a;
  };
  l(t, "_isMockFunction", !0), l(t, "length", e ? e.length : 0), l(t, "name", e && e.name || "spy");
  let r = A(t);
  return r.reset(), r.impl = e, t;
}
function v(e) {
  let t = A(e);
  f(e, "returns", {
    get: () => t.results.map(([, r]) => r)
  }), ["called", "callCount", "results", "calls", "reset", "impl"].forEach((r) => f(e, r, { get: () => t[r], set: (o) => t[r] = o })), l(e, "nextError", (r) => (t.next = ["error", r], t)), l(e, "nextResult", (r) => (t.next = ["ok", r], t));
}

// src/spy.ts
function z(e) {
  let t = I(e);
  return v(t), t;
}

// src/spyOn.ts
var P = (e, t) => Object.getOwnPropertyDescriptor(e, t);
function E(e, t, r) {
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
  }, [n, a] = o(), d = P(e, n), u = Object.getPrototypeOf(e), p = u && P(u, n), s = d || p;
  g(s || n in e, `${String(n)} does not exist`);
  let w = !1;
  a === "value" && s && !s.value && s.get && (a = "get", w = !0, r = s.get());
  let c;
  s ? c = s[a] : a !== "value" ? c = () => e[n] : c = e[n], r || (r = c);
  let x = I(r), O = (h) => {
    let { value: G, ...k } = s || {
      configurable: !0,
      writable: !0
    };
    a !== "value" && delete k.writable, k[a] = h, f(e, n, k);
  }, K = () => s ? f(e, n, s) : O(c), T = x[y];
  return l(T, "restore", K), l(T, "getOriginal", () => w ? c() : c), l(T, "willCall", (h) => (T.impl = h, x)), O(w ? () => x : x), m.add(x), x;
}
function W(e, t, r) {
  let o = E(e, t, r);
  return v(o), ["restore", "getOriginal", "willCall"].forEach((n) => {
    l(o, n, o[y][n]);
  }), o;
}

// src/restoreAll.ts
function Z() {
  for (let e of m)
    e.restore();
  m.clear();
}
export {
  I as createInternalSpy,
  A as getInternalState,
  E as internalSpyOn,
  Z as restoreAll,
  m as spies,
  z as spy,
  W as spyOn
};
