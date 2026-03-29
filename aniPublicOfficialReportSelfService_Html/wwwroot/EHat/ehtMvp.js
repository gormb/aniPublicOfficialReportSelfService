(() => {
  const c = document.getElementById('c');
  const ctx = c.getContext('2d');
  const ui = {
    seed, level, scale, meta, colorMode, pal, showHats, showKites, showMeta, showMetaMeta, spectre,
    spectreBulge, spectreA, spectreB, regen
  };
  const palWrap = document.getElementById("palWrap");
  const curveWrap = document.getElementById("curveWrap");
  const ctrlAWrap = document.getElementById("ctrlAWrap");
  const ctrlBWrap = document.getElementById("ctrlBWrap");
  const curveMin = document.getElementById("curveMin");
  const curveMax = document.getElementById("curveMax");
  const curveMid = document.getElementById("curveMid");
  const helpBtn = document.getElementById("helpBtn");
  const helpPanel = document.getElementById("helpPanel");
  const helpClose = document.getElementById("helpClose");
  const rotateAll = document.getElementById("rotateAll");

  let panX = 0, panY = 0, zoom = 1;
  let drag = false, lx = 0, ly = 0;
  let globalAngle = 0;

  const hr3 = 0.8660254037844386;
  const PI = Math.PI;
  const ident = [1, 0, 0, 0, 1, 0];
  const PACK = 1.0;

  const palettes = {
    cool: ['#22d3ee', '#38bdf8', '#0ea5e9', '#0284c7'],
    warm: ['#fb7185', '#f97316', '#f59e0b', '#eab308'],
    mono: ['#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b']
  };
  const labelTint = { H1: 0, H: 1, T: 2, P: 3, F: 0 };

  const pt = (x, y) => ({ x, y });
  const hexPt = (x, y) => pt(x + 0.5 * y, hr3 * y);
  const padd = (p, q) => pt(p.x + q.x, p.y + q.y);
  const psub = (p, q) => pt(p.x - q.x, p.y - q.y);
  const pframe = (o, v, w, a, b) => pt(o.x + v.x * a + w.x * b, o.y + v.y * a + w.y * b);

  const ttrans = (tx, ty) => [1, 0, tx, 0, 1, ty];
  const trot = (a) => {
    const ca = Math.cos(a), sa = Math.sin(a);
    return [ca, -sa, 0, sa, ca, 0];
  };
  const mul = (A, B) => [
    A[0] * B[0] + A[1] * B[3],
    A[0] * B[1] + A[1] * B[4],
    A[0] * B[2] + A[1] * B[5] + A[2],
    A[3] * B[0] + A[4] * B[3],
    A[3] * B[1] + A[4] * B[4],
    A[3] * B[2] + A[4] * B[5] + A[5]
  ];
  const transPt = (M, P) => pt(M[0] * P.x + M[1] * P.y + M[2], M[3] * P.x + M[4] * P.y + M[5]);
  const inv = (T) => {
    const d = T[0] * T[4] - T[1] * T[3];
    return [
      T[4] / d, -T[1] / d, (T[1] * T[5] - T[2] * T[4]) / d,
      -T[3] / d, T[0] / d, (T[2] * T[3] - T[0] * T[5]) / d
    ];
  };
  const matchSeg = (p, q) => [q.x - p.x, p.y - q.y, p.x, q.y - p.y, q.x - p.x, p.y];
  const matchTwo = (p1, q1, p2, q2) => mul(matchSeg(p2, q2), inv(matchSeg(p1, q1)));
  const rotAbout = (p, a) => mul(ttrans(p.x, p.y), mul(trot(a), ttrans(-p.x, -p.y)));
  const intersect = (p1, q1, p2, q2) => {
    const d = (q2.y - p2.y) * (q1.x - p1.x) - (q2.x - p2.x) * (q1.y - p1.y);
    if (!Number.isFinite(d) || Math.abs(d) < 1e-9) {
      return pt((p1.x + q1.x + p2.x + q2.x) * 0.25, (p1.y + q1.y + p2.y + q2.y) * 0.25);
    }
    const u = ((q2.x - p2.x) * (p1.y - p2.y) - (q2.y - p2.y) * (p1.x - p2.x)) / d;
    const ix = p1.x + u * (q1.x - p1.x), iy = p1.y + u * (q1.y - p1.y);
    if (!Number.isFinite(ix) || !Number.isFinite(iy)) {
      return pt((p1.x + q1.x) * 0.5, (p1.y + q1.y) * 0.5);
    }
    return pt(ix, iy);
  };

  const hat_outline = [
    hexPt(0, 0), hexPt(-1, -1), hexPt(0, -2), hexPt(2, -2),
    hexPt(2, -1), hexPt(4, -2), hexPt(5, -1), hexPt(4, 0),
    hexPt(3, 0), hexPt(2, 2), hexPt(0, 3), hexPt(0, 2), hexPt(-1, 2)
   ];
  const kite_base_outline = [
    hexPt(0, 0), hexPt(-1, -1), hexPt(0, -2), hexPt(1, -2)
  ];
  const kite_layout = [
    { offset: [0, 0], rotationDeg: 0 },
    { offset: [0, 0], rotationDeg: 60 },
    { offset: [0, 0], rotationDeg: 120 },
    { offset: [0, 0], rotationDeg: 180 },
    { offset: [2, 2], rotationDeg: 0 },
    { offset: [2, 2], rotationDeg: 300 },
    { offset: [4, -2], rotationDeg: 240 },
    { offset: [4, -2], rotationDeg: 180 }
  ];
  const kite_colors = [
    'rgba(239,68,68,.95)',
    'rgba(34,197,94,.95)',
    'rgba(59,130,246,.95)',
    'rgba(245,158,11,.95)',
    'rgba(168,85,247,.95)',
    'rgba(236,72,153,.95)',
    'rgba(20,184,166,.95)',
    'rgba(250,204,21,.95)'
  ];
  const kites_outline = kite_layout.map(({ offset, rotationDeg }) => {
    const R = trot(rotationDeg * PI / 180);
    const O = hexPt(offset[0], offset[1]);
    return kite_base_outline.map(p => padd(transPt(R, p), O));
  });
  class HatTile {
    constructor(label) { this.label = label; this.shape = hat_outline; this.kind = 'hat'; }
  }

  class MetaTile {
    constructor(shape, width) { this.shape = shape; this.width = width; this.children = []; this.kind = 'meta'; }
    addChild(T, geom) { this.children.push({ T, geom }); }
    evalChild(n, i) { return transPt(this.children[n].T, this.children[n].geom.shape[i]); }
    recentre() {
      let cx = 0, cy = 0;
      for (const p of this.shape) { cx += p.x; cy += p.y; }
      cx /= this.shape.length; cy /= this.shape.length;
      const M = ttrans(-cx, -cy);
      for (let i = 0; i < this.shape.length; i++) this.shape[i] = padd(this.shape[i], pt(-cx, -cy));
      for (const ch of this.children) ch.T = mul(M, ch.T);
    }
  }

  const H1_hat = new HatTile('H1');
  const H_hat = new HatTile('H');
  const T_hat = new HatTile('T');
  const P_hat = new HatTile('P');
  const F_hat = new HatTile('F');

  function H_init() {
    const o = [pt(0, 0), pt(4, 0), pt(4.5, hr3), pt(2.5, 5 * hr3), pt(1.5, 5 * hr3), pt(-0.5, hr3)];
    const m = new MetaTile(o, 2);
    m.addChild(matchTwo(hat_outline[5], hat_outline[7], o[5], o[0]), H_hat);
    m.addChild(matchTwo(hat_outline[9], hat_outline[11], o[1], o[2]), H_hat);
    m.addChild(matchTwo(hat_outline[5], hat_outline[7], o[3], o[4]), H_hat);
    m.addChild(mul(ttrans(2.5, hr3), mul([-0.5, -hr3, 0, hr3, -0.5, 0], [0.5, 0, 0, 0, -0.5, 0])), H1_hat);
    return m;
  }

  function T_init() {
    const o = [pt(0, 0), pt(3, 0), pt(1.5, 3 * hr3)];
    const m = new MetaTile(o, 2);
    m.addChild([0.5, 0, 0.5, 0, 0.5, hr3], T_hat);
    return m;
  }

  function P_init() {
    const o = [pt(0, 0), pt(4, 0), pt(3, 2 * hr3), pt(-1, 2 * hr3)];
    const m = new MetaTile(o, 2);
    m.addChild([0.5, 0, 1.5, 0, 0.5, hr3], P_hat);
    m.addChild(mul(ttrans(0, 2 * hr3), mul([0.5, hr3, 0, -hr3, 0.5, 0], [0.5, 0, 0, 0, 0.5, 0])), P_hat);
    return m;
  }

  function F_init() {
    const o = [pt(0, 0), pt(3, 0), pt(3.5, hr3), pt(3, 2 * hr3), pt(-1, 2 * hr3)];
    const m = new MetaTile(o, 2);
    m.addChild([0.5, 0, 1.5, 0, 0.5, hr3], F_hat);
    m.addChild(mul(ttrans(0, 2 * hr3), mul([0.5, hr3, 0, -hr3, 0.5, 0], [0.5, 0, 0, 0, 0.5, 0])), F_hat);
    return m;
  }

  function constructPatch(H, T, P, F) {
    const rules = [
      ['H'], [0, 0, 'P', 2], [1, 0, 'H', 2], [2, 0, 'P', 2], [3, 0, 'H', 2],
      [4, 4, 'P', 2], [0, 4, 'F', 3], [2, 4, 'F', 3], [4, 1, 3, 2, 'F', 0],
      [8, 3, 'H', 0], [9, 2, 'P', 0], [10, 2, 'H', 0], [11, 4, 'P', 2], [12, 0, 'H', 2],
      [13, 0, 'F', 3], [14, 2, 'F', 1], [15, 3, 'H', 4], [8, 2, 'F', 1], [17, 3, 'H', 0],
      [18, 2, 'P', 0], [19, 2, 'H', 2], [20, 4, 'F', 3], [20, 0, 'P', 2], [22, 0, 'H', 2],
      [23, 4, 'F', 3], [23, 0, 'F', 3], [16, 0, 'P', 2], [9, 4, 0, 2, 'T', 2], [4, 0, 'F', 3]
    ];

    const ret = new MetaTile([], H.width);
    const sh = { H, T, P, F };

    for (const r of rules) {
      if (r.length === 1) {
        ret.addChild(ident, sh[r[0]]);
      } else if (r.length === 4) {
        const poly = ret.children[r[0]].geom.shape;
        const T0 = ret.children[r[0]].T;
        const P0 = transPt(T0, poly[(r[1] + 1) % poly.length]);
        const Q0 = transPt(T0, poly[r[1]]);
        const n = sh[r[2]], np = n.shape;
        ret.addChild(matchTwo(np[r[3]], np[(r[3] + 1) % np.length], P0, Q0), n);
      } else {
        const chP = ret.children[r[0]], chQ = ret.children[r[2]];
        const P0 = transPt(chQ.T, chQ.geom.shape[r[3]]);
        const Q0 = transPt(chP.T, chP.geom.shape[r[1]]);
        const n = sh[r[4]], np = n.shape;
        ret.addChild(matchTwo(np[r[5]], np[(r[5] + 1) % np.length], P0, Q0), n);
      }
    }
    return ret;
  }

    function constructMetatiles(p) {
    const b1 = p.evalChild(8, 2), b2 = p.evalChild(21, 2);
    const rb = transPt(rotAbout(b1, -2 * PI / 3), b2);
    const p72 = p.evalChild(7, 2), p252 = p.evalChild(25, 2);
    const llc = intersect(b1, rb, p.evalChild(6, 2), p72);

    let w = psub(p.evalChild(6, 2), llc);
    const H = [llc, b1];
    w = transPt(trot(-PI / 3), w); H.push(padd(H[1], w));
    H.push(p.evalChild(14, 2));
    w = transPt(trot(-PI / 3), w); H.push(psub(H[3], w));
    H.push(p.evalChild(6, 2));

    const nH = new MetaTile(H, p.width * 2);
    for (const ch of [0, 9, 16, 27, 26, 6, 1, 8, 10, 15]) nH.addChild(p.children[ch].T, p.children[ch].geom);

    const P = [p72, padd(p72, psub(b1, llc)), b1, llc];
    const nP = new MetaTile(P, p.width * 2);
    for (const ch of [7, 2, 3, 4, 28]) nP.addChild(p.children[ch].T, p.children[ch].geom);

    const F = [b2, p.evalChild(24, 2), p.evalChild(25, 0), p252, padd(p252, psub(llc, b1))];
    const nF = new MetaTile(F, p.width * 2);
    for (const ch of [21, 20, 22, 23, 24, 25]) nF.addChild(p.children[ch].T, p.children[ch].geom);

    const AAA = H[2], BBB = padd(H[1], psub(H[4], H[5]));
    const CCC = transPt(rotAbout(BBB, -PI / 3), AAA);
    const nT = new MetaTile([BBB, CCC, AAA], p.width * 2);
    nT.addChild(p.children[11].T, p.children[11].geom);

    nH.recentre(); nP.recentre(); nF.recentre(); nT.recentre();
    return [nH, nT, nP, nF];
  }

  function buildSelectedRoot() {
    let a = [H_init(), T_init(), P_init(), F_init()];
    const lv = Math.max(0, Math.min(9, +ui.level.value || 0));
    for (let i = 0; i < lv; i++) { a = constructMetatiles(constructPatch(...a)); }
    const metas = { H: a[0], T: a[1], P: a[2], F: a[3] };
    return metas[ui.meta.value] || metas.H;
  }
  function getSpectreCurveParams() {
    const bulgeIn = Number(ui.spectreBulge.value);
    const aIn = Number(ui.spectreA.value);
    const bIn = Number(ui.spectreB.value);
    const bulge = Math.max(-0.6, Math.min(0.6, Number.isFinite(bulgeIn) ? bulgeIn : 0.6));
    let a = Math.max(0.05, Math.min(0.95, Number.isFinite(aIn) ? aIn : 0.33));
    let b = Math.max(0.05, Math.min(0.95, Number.isFinite(bIn) ? bIn : 0.67));
    if (a > b) { const tmp = a; a = b; b = tmp; }
    ui.spectreBulge.value = String(bulge);
    ui.spectreA.value = String(a);
    ui.spectreB.value = String(b);
    return { bulge, a, b };
  }

  class SShape {
    constructor(pts, quad, label, curved, curveCfg) {
      this.quad = quad;
      this.label = label;
      this.curved = curved;
      this.base = pts;
      if (curved) {
        this.pts = [pts[pts.length - 1]];
        let up = true;
        for (const p of pts) {
          const prev = this.pts[this.pts.length - 1];
          const v = psub(p, prev);
          const w = pt(-v.y, v.x);
          const bulge = up ? curveCfg.bulge : -curveCfg.bulge;
          this.pts.push(pframe(prev, v, w, curveCfg.a, bulge));
          this.pts.push(pframe(prev, v, w, curveCfg.b, bulge));
          this.pts.push(p);
          up = !up;
        }
      } else {
        this.pts = pts;
      }
    }
  }

  class SMeta {
    constructor() { this.geoms = []; this.quad = []; }
    addChild(geom, xform) { this.geoms.push({ geom, xform }); }
  }

  function rad(d) { return d * PI / 180; }

  function buildSpectreBase(curved, curveCfg) {
    const spectre = [
      pt(0, 0), pt(1.0, 0.0), pt(1.5, -0.8660254037844386), pt(2.366025403784439, -0.36602540378443865),
      pt(2.366025403784439, 0.6339745962155614), pt(3.366025403784439, 0.6339745962155614),
      pt(3.866025403784439, 1.5), pt(3.0, 2.0), pt(2.133974596215561, 1.5),
      pt(1.6339745962155614, 2.3660254037844393), pt(0.6339745962155614, 2.3660254037844393),
      pt(-0.3660254037844386, 2.3660254037844393), pt(-0.866025403784439, 1.5), pt(0.0, 1.0)
    ];
    const keys = [spectre[3], spectre[5], spectre[7], spectre[11]];
    const ret = {};

    for (const lab of ['Delta','Theta','Lambda','Xi','Pi','Sigma','Phi','Psi']) {
      ret[lab] = new SShape(spectre, keys, lab, curved, curveCfg);
    }

    const gamma = new SMeta();
    gamma.addChild(new SShape(spectre, keys, 'Gamma1', curved, curveCfg), ident);
    gamma.addChild(new SShape(spectre, keys, 'Gamma2', curved, curveCfg), mul(ttrans(spectre[8].x, spectre[8].y), trot(PI / 6)));
    gamma.quad = keys;
    ret.Gamma = gamma;
    return ret;
  }

  function buildSpectreSupertiles(sys) {
    const quad = sys.Delta.quad;
    const R = [-1, 0, 0, 0, 1, 0];
    const t_rules = [[60,3,1],[0,2,0],[60,3,1],[60,3,1],[0,2,0],[60,3,1],[-120,3,3]];

    const Ts = [ident];
    let total = 0;
    let rot = ident;
    const tquad = [...quad];

    for (const [ang, from, to] of t_rules) {
      total += ang;
      if (ang !== 0) {
        rot = trot(rad(total));
        for (let i = 0; i < 4; i++) tquad[i] = transPt(rot, quad[i]);
      }
      const tr = ttrans(transPt(Ts[Ts.length - 1], quad[from]).x - tquad[to].x, transPt(Ts[Ts.length - 1], quad[from]).y - tquad[to].y);
      Ts.push(mul(tr, rot));
    }

    for (let i = 0; i < Ts.length; i++) Ts[i] = mul(R, Ts[i]);

    const super_rules = {
      Gamma:['Pi','Delta','null','Theta','Sigma','Xi','Phi','Gamma'],
      Delta:['Xi','Delta','Xi','Phi','Sigma','Pi','Phi','Gamma'],
      Theta:['Psi','Delta','Pi','Phi','Sigma','Pi','Phi','Gamma'],
      Lambda:['Psi','Delta','Xi','Phi','Sigma','Pi','Phi','Gamma'],
      Xi:['Psi','Delta','Pi','Phi','Sigma','Psi','Phi','Gamma'],
      Pi:['Psi','Delta','Xi','Phi','Sigma','Psi','Phi','Gamma'],
      Sigma:['Xi','Delta','Xi','Phi','Sigma','Pi','Lambda','Gamma'],
      Phi:['Psi','Delta','Psi','Phi','Sigma','Pi','Phi','Gamma'],
      Psi:['Psi','Delta','Psi','Phi','Sigma','Psi','Phi','Gamma']
    };

    const super_quad = [transPt(Ts[6], quad[2]), transPt(Ts[5], quad[1]), transPt(Ts[3], quad[2]), transPt(Ts[0], quad[1])];
    const ret = {};

    for (const [lab, subs] of Object.entries(super_rules)) {
      const sup = new SMeta();
      for (let i = 0; i < 8; i++) {
        if (subs[i] === 'null') continue;
        sup.addChild(sys[subs[i]], Ts[i]);
      }
      sup.quad = super_quad;
      ret[lab] = sup;
    }
    return ret;
  }

  function spectreFill(label) {
    const cols = palettes[ui.pal.value] || palettes.cool;
    const key = ({Gamma:0,Gamma1:0,Gamma2:1,Delta:2,Theta:3,Lambda:0,Xi:1,Pi:2,Sigma:3,Phi:0,Psi:1})[label] || 0;
    return cols[key % cols.length];
  }


  function drawSCurvedPath(g, T, unit, cx, cy) {
    const pts = g.pts;
    if (!pts || pts.length < 4) return;

    const s0 = toScreen(transPt(T, pts[0]), unit, cx, cy);
    ctx.beginPath();
    ctx.moveTo(s0.x, s0.y);

    for (let i = 1; i + 2 < pts.length; i += 3) {
      const c1 = toScreen(transPt(T, pts[i]), unit, cx, cy);
      const c2 = toScreen(transPt(T, pts[i + 1]), unit, cx, cy);
      const e = toScreen(transPt(T, pts[i + 2]), unit, cx, cy);
      ctx.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, e.x, e.y);
    }

    ctx.closePath();
  }
  function drawSGeom(g, T, unit, cx, cy, curveCfg) {
    if (g instanceof SMeta) {
      for (const ch of g.geoms) drawSGeom(ch.geom, mul(T, ch.xform), unit, cx, cy, curveCfg);
      return;
    }

    if (g.curved) {
      drawSCurvedPath(g, T, unit, cx, cy);
    } else {
      ctx.beginPath();
      for (let i = 0; i < g.pts.length; i++) {
        const s = toScreen(transPt(T, g.pts[i]), unit, cx, cy);
        i ? ctx.lineTo(s.x, s.y) : ctx.moveTo(s.x, s.y);
      }
      ctx.closePath();
    }

    ctx.fillStyle = spectreFill(g.label);
    ctx.fill();
    ctx.strokeStyle = 'rgba(2,6,23,.58)';
    ctx.lineWidth = Math.max(1, unit * 0.03);
    ctx.stroke();
  }
  function drawSpectre(unit, cx, cy) {
    const curveCfg = getSpectreCurveParams();
    let sys = buildSpectreBase(true, curveCfg);
    const lv = Math.max(0, Math.min(9, +ui.level.value || 0));
    for (let i = 0; i < lv; i++) sys = buildSpectreSupertiles(sys);

    const map = { H: 'Gamma', T: 'Delta', P: 'Phi', F: 'Psi' };
    const rootName = map[ui.meta.value] || 'Gamma';
    const root = sys[rootName];

    const b = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
    spectreGeomBounds(root, ident, b);
    const centerX = (b.minX + b.maxX) * 0.5;
    const centerY = (b.minY + b.maxY) * 0.5;
    const viewT = ttrans(-centerX, -centerY);

    if (ui.showHats.checked) drawSGeom(root, viewT, unit, cx, cy, curveCfg);

    const metas = [];
    collectSpectreMeta(root, viewT, metas);

    // In Spectre trees, structural depth is uneven (Gamma branch). Use leaf-distance levels instead.
    const metaLevel = 1;
    const metaMetaLevel = 2;

    if (ui.showMeta.checked) {
      const col = 'rgba(34,211,238,.65)';
      for (const m of metas) {
        if (m.leafDist !== metaLevel || !m.geom) continue;
        drawSpectreMetaBoundary(m.geom, m.T, unit, cx, cy, col, Math.max(1, unit * 0.03));
      }
    }

    if (ui.showMetaMeta.checked) {
      const col = 'rgba(251,113,133,.6)';
      for (const m of metas) {
        if (m.leafDist !== metaMetaLevel || !m.geom) continue;
        drawSpectreMetaBoundary(m.geom, m.T, unit, cx, cy, col, Math.max(1, unit * 0.04));
      }
    }
  }
  function spectreGeomBounds(g, T, b) {
    if (g instanceof SMeta) {
      for (const ch of g.geoms) spectreGeomBounds(ch.geom, mul(T, ch.xform), b);
      return;
    }
    for (const p of g.pts) {
      const w = transPt(T, p);
      if (w.x < b.minX) b.minX = w.x;
      if (w.x > b.maxX) b.maxX = w.x;
      if (w.y < b.minY) b.minY = w.y;
      if (w.y > b.maxY) b.maxY = w.y;
    }
  }

  function collectSpectreMeta(g, T, out) {
    if (!(g instanceof SMeta)) return 0;
    let minDist = Infinity;
    for (const ch of g.geoms) {
      const d = collectSpectreMeta(ch.geom, mul(T, ch.xform), out);
      if (d < minDist) minDist = d;
    }
    const leafDist = (minDist === Infinity) ? 1 : (minDist + 1);
    out.push({ leafDist, T, shape: g.quad, geom: g });
    return leafDist;
  }
  function segKey(a, b) {
    const p = (a.x < b.x || (a.x === b.x && a.y <= b.y)) ? a : b;
    const q = (p === a) ? b : a;
    return `${Math.round(p.x * 1e4)}:${Math.round(p.y * 1e4)}|${Math.round(q.x * 1e4)}:${Math.round(q.y * 1e4)}`;
  }

  function addSpectreLeafEdges(g, T, edgeMap) {
    if (g instanceof SMeta) {
      for (const ch of g.geoms) addSpectreLeafEdges(ch.geom, mul(T, ch.xform), edgeMap);
      return;
    }

    const pts = g.base || g.pts;
    for (let i = 0; i < pts.length; i++) {
      const a = transPt(T, pts[i]);
      const b = transPt(T, pts[(i + 1) % pts.length]);
      const k = segKey(a, b);
      const e = edgeMap.get(k);
      if (e) {
        e.count += 1;
      } else {
        const p = (a.x < b.x || (a.x === b.x && a.y <= b.y)) ? a : b;
        const q = (p === a) ? b : a;
        edgeMap.set(k, { a: p, b: q, count: 1 });
      }
    }
  }

  function drawSpectreMetaBoundary(g, T, unit, cx, cy, stroke, width) {
    const edgeMap = new Map();
    addSpectreLeafEdges(g, T, edgeMap);
    ctx.beginPath();
    for (const e of edgeMap.values()) {
      if (e.count !== 1) continue;
      const a = toScreen(e.a, unit, cx, cy);
      const b = toScreen(e.b, unit, cx, cy);
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
    }
    ctx.strokeStyle = stroke;
    ctx.lineWidth = width;
    ctx.stroke();
  }
  function hashPath(path) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < path.length; i++) {
      h ^= (path[i] + 1);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
  }

  function collectHierarchy(node, T, path, stack, out) {
    if (node.kind === 'hat') {
      const meta = stack[stack.length - 1] || null;
      const metaMeta = stack[stack.length - 2] || null;
      if (meta && !out.metaMap.has(meta.key)) out.metaMap.set(meta.key, meta);
      if (metaMeta && !out.metaMetaMap.has(metaMeta.key)) out.metaMetaMap.set(metaMeta.key, metaMeta);
      out.hats.push({ T, label: node.label, path: path.slice() });
      return;
    }

    const key = path.join('.') || 'root';
    const entry = { key, T, shape: node.shape, path: path.slice() };
    stack.push(entry);
    for (let i = 0; i < node.children.length; i++) {
      const ch = node.children[i];
      collectHierarchy(ch.geom, mul(T, ch.T), path.concat(i), stack, out);
    }
    stack.pop();
  }

  function colorPalette(hat, idx) {
    const cols = palettes[ui.pal.value] || palettes.cool;
    const s = ((+ui.seed.value || 1) >>> 0);
    const spec = ui.spectre.checked ? 2 : 0;
    const v = ((Math.floor(Math.abs(hat.T[2] * 17 + hat.T[5] * 29)) * 2654435761) ^ (s * 2246822519) ^ (idx * 3266489917)) >>> 0;
    return cols[(v + labelTint[hat.label] + spec) % cols.length];
  }

  function colorHslHierarchy(hat) {
    const path = hat.path;
    const hatKey = hashPath(path);
    const metaIdx = path.length >= 2 ? path[path.length - 2] : 0;
    const metaMetaIdx = path.length >= 3 ? path[path.length - 3] : 0;

    const shift = ui.spectre.checked ? 140 : 0;
    const hue = (hatKey + shift) % 360;
    const sat = Math.min(95, 35 + ((metaIdx * 17 + 11) % 56) + (ui.spectre.checked ? 8 : 0));
    const lig = Math.max(18, 30 + ((metaMetaIdx * 13 + 7) % 46) - (ui.spectre.checked ? 4 : 0));
    return `hsl(${hue} ${sat}% ${lig}%)`;
  }

  function drawPolylineShape(shape, T, unit, cx, cy, fill, stroke, width) {
    ctx.beginPath();
    const ca = Math.cos(globalAngle), sa = Math.sin(globalAngle);
    for (let i = 0; i < shape.length; i++) {
      const w = transPt(T, shape[i]);
      const rx = ca * w.x - sa * w.y;
      const ry = sa * w.x + ca * w.y;
      const sx = cx + rx * unit * PACK;
      const sy = cy - ry * unit * PACK;
      i ? ctx.lineTo(sx, sy) : ctx.moveTo(sx, sy);
    }
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke(); }
  }

  function toScreen(w, unit, cx, cy) {
    const ca = Math.cos(globalAngle), sa = Math.sin(globalAngle);
    const rx = ca * w.x - sa * w.y;
    const ry = sa * w.x + ca * w.y;
    return { x: cx + rx * unit * PACK, y: cy - ry * unit * PACK };
  }

  function drawHat(hat, unit, cx, cy, idx) {
    const fill = ui.colorMode.value === 'hsl' ? colorHslHierarchy(hat) : colorPalette(hat, idx);
    const outline = ui.spectre.checked ? 'rgba(15,23,42,.78)' : 'rgba(2,6,23,.62)';
    const width = Math.max(1, unit * (ui.spectre.checked ? 0.07 : 0.06));
    // Stable no-hole render path.
    drawPolylineShape(hat_outline, hat.T, unit, cx, cy, fill, null, 0);
    ctx.save();
    drawPolylineShape(hat_outline, hat.T, unit, cx, cy, null, null, 0);
    ctx.clip();
    drawPolylineShape(hat_outline, hat.T, unit, cx, cy, null, outline, width);
    ctx.restore();
  }

  function drawKiteGuide(hat, unit, cx, cy) {
    ctx.save();
    drawPolylineShape(hat_outline, hat.T, unit, cx, cy, null, null, 0);
    ctx.clip();
    for (let k = 0; k < kites_outline.length; k++) {
      const kite = kites_outline[k];
      drawPolylineShape(kite, hat.T, unit, cx, cy, kite_colors[k % kite_colors.length], null, 0);
    }

    ctx.restore();
  }

  function drawOutline(entry, unit, cx, cy, stroke, width) {
    drawPolylineShape(entry.shape, entry.T, unit, cx, cy, null, stroke, width);
  }

  function draw() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    const unit = Math.max(2, +ui.scale.value || 22) * zoom;
    const cx = innerWidth / 2 + panX;
    const cy = innerHeight / 2 + panY;

    if (ui.spectre.checked) {
      drawSpectre(unit, cx, cy);
      return;
    }

    const root = buildSelectedRoot();
    const out = { hats: [], metaMap: new Map(), metaMetaMap: new Map() };
    collectHierarchy(root, ident, [], [], out);

    if (ui.showHats.checked) {
      for (let i = 0; i < out.hats.length; i++) drawHat(out.hats[i], unit, cx, cy, i);
    }
    if (ui.showKites.checked) {
      for (let i = 0; i < out.hats.length; i++) drawKiteGuide(out.hats[i], unit, cx, cy);
    }
    if (ui.showMeta.checked) {
      const col = ui.spectre.checked ? 'rgba(163,230,53,.7)' : 'rgba(34,211,238,.65)';
      for (const entry of out.metaMap.values()) drawOutline(entry, unit, cx, cy, col, Math.max(1, unit * 0.03));
    }

    if (ui.showMetaMeta.checked) {
      const col = ui.spectre.checked ? 'rgba(245,158,11,.65)' : 'rgba(251,113,133,.6)';
      for (const entry of out.metaMetaMap.values()) drawOutline(entry, unit, cx, cy, col, Math.max(1, unit * 0.04));
    }
  }

  function fit() {
    c.width = innerWidth * devicePixelRatio;
    c.height = innerHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }

  fit();
  function updateRotateLabel() {
    const cur = ((-globalAngle * 180 / PI) % 360 + 360) % 360;
    const next = (Math.round(cur / 30) * 30 + 30) % 360;
    rotateAll.textContent = `rotate to ${next}\u00B0`;
  }
  function updateControlVisibility() {
    palWrap.style.display = (ui.colorMode.value === "hsl") ? "none" : "";
    const showCurve = ui.spectre.checked;
    curveWrap.style.display = showCurve ? "" : "none";
    ctrlAWrap.style.display = showCurve ? "" : "none";
    ctrlBWrap.style.display = showCurve ? "" : "none";
  }
  updateControlVisibility();
  updateRotateLabel();
  draw();

  addEventListener('resize', () => { fit(); draw(); });

  ui.regen.onclick = draw;
  curveMin.onclick = () => { ui.spectreBulge.value = ui.spectreBulge.min || "-0.6"; updateControlVisibility(); draw(); };
  curveMid.onclick = () => { ui.spectreBulge.value = "0"; updateControlVisibility(); draw(); };
  curveMax.onclick = () => { ui.spectreBulge.value = ui.spectreBulge.max || "0.6"; updateControlVisibility(); draw(); };
  helpBtn.onclick = () => { helpPanel.hidden = false; };
  helpClose.onclick = () => { helpPanel.hidden = true; };
  helpPanel.onclick = (e) => { if (e.target === helpPanel) helpPanel.hidden = true; };
  addEventListener('keydown', (e) => { if (e.key === 'Escape') helpPanel.hidden = true; });
  rotateAll.onclick = () => {
    globalAngle -= PI / 6; // clockwise 30deg each click
    updateRotateLabel();
    draw();
  };
  [ui.seed, ui.level, ui.scale, ui.meta, ui.colorMode, ui.pal, ui.showHats, ui.showKites, ui.showMeta, ui.showMetaMeta, ui.spectre, ui.spectreBulge, ui.spectreA, ui.spectreB]
    .forEach(el => el.addEventListener('input', () => { updateControlVisibility(); draw(); }));

  c.addEventListener('mousedown', (e) => { drag = true; lx = e.clientX; ly = e.clientY; });
  addEventListener('mouseup', () => { drag = false; });
  addEventListener('mousemove', (e) => {
    if (!drag) return;
    panX += e.clientX - lx;
    panY += e.clientY - ly;
    lx = e.clientX; ly = e.clientY;
    draw();
  });

  c.addEventListener('wheel', (e) => {
    e.preventDefault();
    const z = Math.exp(-e.deltaY * 0.0012);
    zoom = Math.min(8, Math.max(0.2, zoom * z));
    draw();
  }, { passive: false });
})();


