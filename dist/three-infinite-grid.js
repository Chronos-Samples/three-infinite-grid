var te = Object.defineProperty;
var ie = (o, a, e) => a in o ? te(o, a, { enumerable: !0, configurable: !0, writable: !0, value: e }) : o[a] = e;
var R = (o, a, e) => ie(o, typeof a != "symbol" ? a + "" : a, e);
import { Float32BufferAttribute as ne, Euler as ro, MathUtils as so, Matrix4 as re, Vector3 as F, Quaternion as se, Color as c, Vector2 as go, Object3D as ae, BufferGeometry as ue, DoubleSide as le, InstancedMesh as ce } from "three";
import { MeshBasicNodeMaterial as de } from "three/webgpu";
import { select as i, vec3 as ao, positionWorld as me, vec2 as d, max as s, clamp as _, dFdx as vo, dFdy as _o, length as V, smoothstep as E, vec4 as p, mix as b, fract as yo, uniform as Bo, abs as xe } from "three/tsl";
var H = /* @__PURE__ */ ((o) => (o[o.XZ = 0] = "XZ", o[o.XY = 1] = "XY", o[o.ZY = 2] = "ZY", o))(H || {});
const Do = 20, he = (o) => {
  let a = 0, e = o;
  for (; e > Do; )
    a++, e = Math.round(e / 3 * 1e3) / 1e3;
  return { iterations: a, initialSize: e };
}, Ae = (o, a) => o * Math.pow(3, a), fe = (o, a) => {
  const { iterations: e, initialSize: t } = he(a), Y = o.geometry, n = new re(), r = new F(), M = new se().identity(), u = new F(1, 1, 1);
  Y.setFromPoints([
    new F(0, 0, 0),
    new F(t, 0, 0),
    new F(t, 0, t),
    new F(0, 0, t)
  ]);
  let m = 0;
  r.set(-t / 2, 0, -t / 2), n.compose(r, M, u), o.setMatrixAt(0, n);
  let l = 1;
  for (let x = 0; x <= e; x++) {
    const h = Ae(t, x);
    m += h, r.set(-m - t / 2, 0, -h / 2), u.setScalar(Math.pow(3, x)), n.compose(r, M, u), o.setMatrixAt(l, n), l++, r.set(
      -m - t / 2,
      0,
      -m - t / 2
    ), u.setScalar(Math.pow(3, x)), n.compose(r, M, u), o.setMatrixAt(l, n), l++, r.set(-h / 2, 0, -m - t / 2), u.setScalar(Math.pow(3, x)), n.compose(r, M, u), o.setMatrixAt(l, n), l++, r.set(
      m - h + t / 2,
      0,
      -m - t / 2
    ), u.setScalar(Math.pow(3, x)), n.compose(r, M, u), o.setMatrixAt(l, n), l++, r.set(
      m - h + t / 2,
      0,
      -h / 2
    ), u.setScalar(Math.pow(3, x)), n.compose(r, M, u), o.setMatrixAt(l, n), l++, r.set(
      m - h + t / 2,
      0,
      m - h + t / 2
    ), u.setScalar(Math.pow(3, x)), n.compose(r, M, u), o.setMatrixAt(l, n), l++, r.set(
      -h / 2,
      0,
      m - h + t / 2
    ), u.setScalar(Math.pow(3, x)), n.compose(r, M, u), o.setMatrixAt(l, n), l++, r.set(
      -m - t / 2,
      0,
      m - h + t / 2
    ), u.setScalar(Math.pow(3, x)), n.compose(r, M, u), o.setMatrixAt(l, n), l++;
  }
  o.count = l;
}, bo = (o, a, e) => {
  const t = o.geometry;
  switch (t.setIndex([0, 1, 2, 0, 2, 3]), t.setAttribute(
    "uv",
    new ne(new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]), 2)
  ), fe(o, e.x * Do), a) {
    case 0: {
      o.setRotationFromEuler(new ro(0, 0, 0));
      break;
    }
    case 1: {
      o.setRotationFromEuler(new ro(90 * so.DEG2RAD, 0, 0));
      break;
    }
    case 2:
      o.setRotationFromEuler(
        new ro(-90 * so.DEG2RAD, 0, 90 * so.DEG2RAD)
      );
  }
  return o.instanceMatrix.needsUpdate = !0, o;
}, jo = {
  chunks: new go(300, 300),
  plane: H.XZ,
  scale: 1,
  minorLineWidth: 0.01,
  minorLineColor: new c("#000000"),
  majorGridFactor: 5,
  majorLineWidth: 0.02,
  majorLineColor: new c("#000000"),
  axisLineWidth: 0.05,
  xAxisColor: new c("#ff0000"),
  yAxisColor: new c("#00ff00"),
  zAxisColor: new c("#0000ff"),
  centerColor: new c("#ffff00"),
  opacity: 1,
  debugWorldAB: !1
}, y = (o) => Bo(o), X = (o) => Bo(o), f = 1e-6, k = (o) => Math.max(o, 0), Me = (o) => ({
  uPlane: y(o.plane),
  uScale: y(o.scale),
  uLineWidth: y(o.minorLineWidth),
  uLineColor: X(new c(o.minorLineColor)),
  uMajorGridFactor: y(o.majorGridFactor),
  uMajorLineWidth: y(o.majorLineWidth),
  uMajorLineColor: X(new c(o.majorLineColor)),
  uAxisLineWidth: y(o.axisLineWidth),
  uXAxisColor: X(new c(o.xAxisColor)),
  uYAxisColor: X(new c(o.yAxisColor)),
  uZAxisColor: X(new c(o.zAxisColor)),
  uCenterColor: X(new c(o.centerColor)),
  uOpacity: y(o.opacity),
  uDebugWorldAB: y(o.debugWorldAB ? 1 : 0)
});
class ve extends ae {
  constructor(e) {
    super();
    R(this, "_mesh");
    R(this, "_chunks");
    R(this, "_uniforms");
    this._chunks = new go().copy(
      (e == null ? void 0 : e.chunks) || jo.chunks
    );
    const t = Object.assign(
      {},
      jo,
      e
    );
    t.minorLineWidth = k(t.minorLineWidth), t.majorLineWidth = k(t.majorLineWidth), t.axisLineWidth = k(t.axisLineWidth), this._uniforms = Me(t);
    const Y = new ue(), n = new de({
      side: le,
      transparent: !0
    });
    n.fragmentNode = Ce(this._uniforms), this._mesh = new ce(Y, n, 1e3), bo(this._mesh, this.plane, this._chunks), this.add(this._mesh);
  }
  get mesh() {
    return this._mesh;
  }
  set plane(e) {
    this._uniforms.uPlane.value = e, bo(this._mesh, e, this._chunks);
  }
  get plane() {
    return this._uniforms.uPlane.value;
  }
  set cellSize(e) {
    this._uniforms.uScale.value = e;
  }
  get cellSize() {
    return this._uniforms.uScale.value;
  }
  set minorLineWidth(e) {
    const t = k(e);
    this._uniforms.uLineWidth.value = t;
  }
  get minorLineWidth() {
    return this._uniforms.uLineWidth.value;
  }
  set minorLineColor(e) {
    this._uniforms.uLineColor.value = new c(e);
  }
  get minorLineColor() {
    return this._uniforms.uLineColor.value;
  }
  set majorGridFactor(e) {
    this._uniforms.uMajorGridFactor.value = Math.max(2, e);
  }
  get majorGridFactor() {
    return this._uniforms.uMajorGridFactor.value;
  }
  set majorLineWidth(e) {
    this._uniforms.uMajorLineWidth.value = e;
  }
  get majorLineWidth() {
    return this._uniforms.uMajorLineWidth.value;
  }
  set majorLineColor(e) {
    this._uniforms.uMajorLineColor.value = new c(e);
  }
  get majorLineColor() {
    return this._uniforms.uMajorLineColor.value;
  }
  set axisLineWidth(e) {
    this._uniforms.uAxisLineWidth.value = k(e);
  }
  get axisLineWidth() {
    return this._uniforms.uAxisLineWidth.value;
  }
  set xAxisColor(e) {
    this._uniforms.uXAxisColor.value = new c(e);
  }
  get xAxisColor() {
    return this._uniforms.uXAxisColor.value;
  }
  set yAxisColor(e) {
    this._uniforms.uYAxisColor.value = new c(e);
  }
  get yAxisColor() {
    return this._uniforms.uYAxisColor.value;
  }
  set zAxisColor(e) {
    this._uniforms.uZAxisColor.value = new c(e);
  }
  get zAxisColor() {
    return this._uniforms.uZAxisColor.value;
  }
  set centerColor(e) {
    this._uniforms.uCenterColor.value = new c(e);
  }
  get centerColor() {
    return this._uniforms.uCenterColor.value;
  }
  set opacity(e) {
    this._uniforms.uOpacity.value = Math.max(Math.min(e, 1), 0);
  }
  get opacity() {
    return this._uniforms.uOpacity.value;
  }
  set debugWorldAB(e) {
    this._uniforms.uDebugWorldAB.value = e ? 1 : 0;
  }
  get debugWorldAB() {
    return this._uniforms.uDebugWorldAB.value > 0.5;
  }
}
const Ce = (o) => {
  const a = (G, T, z) => d(
    E(G.x, T.x, z.x),
    E(G.y, T.y, z.y)
  ), {
    uPlane: e,
    uScale: t,
    uLineWidth: Y,
    uLineColor: n,
    uMajorGridFactor: r,
    uMajorLineWidth: M,
    uMajorLineColor: u,
    uAxisLineWidth: m,
    uXAxisColor: l,
    uYAxisColor: x,
    uZAxisColor: h,
    uCenterColor: So,
    uOpacity: Go,
    uDebugWorldAB: zo
  } = o, L = e.equal(H.XY), w = e.equal(H.ZY), j = me, A = i(
    L,
    ao(j.x, j.y, 0),
    i(
      w,
      ao(0, j.y, j.z),
      ao(j.x, 0, j.z)
    )
  ), q = i(
    L,
    d(A.x, A.y),
    i(
      w,
      d(A.z, A.y),
      d(A.x, A.z)
    )
  ), K = s(t, 1e-6), Fo = s(r, 2), uo = s(K.mul(Fo), 1e-6), lo = (G, T) => {
    const z = _(T, 0, 1), U = p(vo(G), _o(G)), to = d(
      V(d(U.x, U.z)),
      V(d(U.y, U.w))
    ), io = z.greaterThan(0.5), I = i(
      io,
      z.oneMinus(),
      z
    ), wo = d(I, I), no = _(
      wo,
      to,
      d(0.5)
    ), Wo = s(to, d(1e-6)).mul(1.5);
    let O = xe(yo(G).mul(2).sub(1));
    O = i(io, O, O.oneMinus());
    let W = a(
      no.add(Wo),
      no.sub(Wo),
      O
    );
    W = W.mul(
      _(wo.div(no), d(0), d(1))
    );
    const Lo = _(
      to.mul(2).sub(1),
      d(0),
      d(1)
    );
    return W = d(
      b(W.x, I, Lo.x),
      b(W.y, I, Lo.y)
    ), W = i(io, W.oneMinus(), W), b(W.x, 1, W.y);
  }, Eo = q.div(K), Xo = q.div(uo), Yo = _(
    Y.div(K),
    f,
    1 - f
  ), Zo = _(
    M.div(uo),
    f,
    1 - f
  );
  let Z = lo(Eo, Yo);
  const co = lo(Xo, Zo);
  Z = Z.mul(co.oneMinus());
  const C = s(m.mul(0.5), f), Q = i(
    L,
    A.y,
    i(w, A.y, A.z)
  ), N = i(
    L,
    A.x,
    i(w, A.z, A.x)
  ), g = vo(A), B = _o(A), ko = i(
    L,
    g.y,
    i(w, g.y, g.z)
  ), Po = i(
    L,
    B.y,
    i(w, B.y, B.z)
  ), To = i(
    L,
    g.x,
    i(w, g.z, g.x)
  ), Uo = i(
    L,
    B.x,
    i(w, B.z, B.x)
  ), J = V(d(ko, Po)), Io = s(C, J), $ = s(J, f).mul(1.5), mo = s(C.sub($), 0), Oo = s(
    C.add($),
    mo.add(f)
  );
  let D = E(
    mo,
    Oo,
    Q.abs()
  ).oneMinus();
  D = D.mul(_(C.div(Io), 0, 1)), D = i(
    Q.abs().lessThan(C.add($.mul(4))),
    D,
    0
  );
  const oo = V(d(To, Uo)), Ro = s(C, oo), eo = s(oo, f).mul(1.5), xo = s(C.sub(eo), 0), Vo = s(
    C.add(eo),
    xo.add(f)
  );
  let S = E(
    xo,
    Vo,
    N.abs()
  ).oneMinus();
  S = S.mul(_(C.div(Ro), 0, 1)), S = i(
    N.abs().lessThan(C.add(eo.mul(4))),
    S,
    0
  );
  const P = s(C.mul(4.05), f), ho = s(J, f).mul(1.5), Ao = s(P.sub(ho), 0), Ho = s(
    P.add(ho),
    Ao.add(f)
  ), qo = E(
    Ao,
    Ho,
    Q.abs()
  ), fo = s(oo, f).mul(1.5), Mo = s(P.sub(fo), 0), Ko = s(
    P.add(fo),
    Mo.add(f)
  ), Qo = E(
    Mo,
    Ko,
    N.abs()
  );
  Z = Z.mul(qo).mul(Qo);
  let v = p(n, Z);
  v = b(v, p(u, 1), co);
  const No = i(
    w,
    p(h, 1),
    p(l, 1)
  ), Jo = i(
    L,
    p(x, 1),
    i(w, p(x, 1), p(h, 1))
  );
  v = b(v, Jo, S), v = b(v, No, D);
  const $o = _(D.mul(S), 0, 1);
  v = b(v, p(So, 1), $o);
  const Co = p(1, 1, 1, Go), oe = v.mul(Co), po = yo(q), ee = p(po.x, po.y, 0, 1).mul(
    Co
  );
  return i(zo.greaterThan(0.5), ee, oe);
};
export {
  Do as CHUNK_SIZE,
  H as PLANE,
  ve as ThreeInfiniteGrid
};
