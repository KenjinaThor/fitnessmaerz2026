/* Winter-Fit – App-Logik */
(function () {
  'use strict';
  const { CAT, EQ, EX, EXMAP, SESS, QUICK, WEEK, PHASES, TESTS, VERSION, CHANGELOG, SOURCES } = window.DATA;

  /* ================= Utils ================= */
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = n => String(n).padStart(2, '0');
  const dkey = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const parseKey = k => { const a = k.split('-').map(Number); return new Date(a[0], a[1] - 1, a[2], 12); };
  const addDays = (d, n) => { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12); x.setDate(x.getDate() + n); return x; };
  const mondayOf = d => { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; };
  const daysBetween = (a, b) => Math.round((new Date(b.getFullYear(), b.getMonth(), b.getDate(), 12) - new Date(a.getFullYear(), a.getMonth(), a.getDate(), 12)) / 864e5);
  const fmtDate = (k, o) => parseKey(k).toLocaleDateString('de-CH', o || { day: 'numeric', month: 'short' });
  const rnd1 = v => Math.round(v * 10) / 10;
  const fmtMin = s => Math.max(1, Math.round(s / 60)) + ' Min';
  const clock = s => { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + pad(s % 60); };
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const WD = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  /* ================= Icons ================= */
  const IC = {
    home: '<path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
    cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    dumbbell: '<path d="M6.5 6.5v11M17.5 6.5v11M3 9v6M21 9v6M6.5 12h11"/>',
    chart: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
    play: '<path d="M7 4l13 8-13 8z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    flame: '<path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z"/>',
    check: '<path d="M5 12l5 5 9-10"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    swap: '<path d="M7 4L3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"/>',
    chev: '<path d="M9 6l6 6-6 6"/>',
    back: '<path d="M15 6l-6 6 6 6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    moon: '<path d="M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10z"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4v1a4 4 0 0 0 4 4M16 6h4v1a4 4 0 0 1-4 4M12 13v4M8 21h8M10 17h4"/>',
    wave: '<path d="M2 12c3-7 6 7 10 0s7 7 10 0"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/>',
    leaf: '<path d="M5 19c0-9 6-14 15-14 0 9-5 15-14 15z"/><path d="M5 19c3-5 6-8 10-10"/>',
    video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3z"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
    skip: '<path d="M5 5l9 7-9 7zM18 5v14"/>',
    download: '<path d="M12 4v11M7 11l5 5 5-5M4 20h16"/>'
  };
  const icon = (n, c) => '<svg class="svg ' + (c || '') + '" viewBox="0 0 24 24" aria-hidden="true">' + IC[n] + '</svg>';
  const KIND_ICON = { strength: 'dumbbell', mobility: 'wave', cond: 'flame', core: 'target', flow: 'leaf', custom: 'dumbbell', ext: 'flame' };

  /* ================= Store ================= */
  const KEY = 'winterfit.v1';
  function defaultStart() {
    const t = new Date();
    const wd = (t.getDay() + 6) % 7;
    return dkey(wd <= 2 ? mondayOf(t) : addDays(mondayOf(t), 7));
  }
  const defaults = () => ({ v: 1, settings: { name: '', goal: 5, start: defaultStart(), theme: 'auto', sound: true, vibrate: true, wake: true, seen: '', health: false }, history: [], body: [], tests: [], custom: [], draft: null, plan: { week: WEEK.slice(), edits: {} } });
  let S = load();
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const o = JSON.parse(raw), d = defaults();
        return Object.assign(d, o, { settings: Object.assign(d.settings, o.settings || {}) });
      }
    } catch (e) { console.warn('Laden fehlgeschlagen', e); }
    return defaults();
  }
  let saveWarned = false;
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); }
    catch (e) { if (!saveWarned) { saveWarned = true; toast('Speichern nicht möglich – Speicher voll oder gesperrt'); } }
  }
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});

  function applyTheme() {
    const t = S.settings.theme;
    if (t === 'auto') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', t);
    const dark = t === 'dark' || (t === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
    const m = $('meta[name=theme-color]'); if (m) m.content = dark ? '#0a1220' : '#f3f6fa';
  }

  /* ================= Plan ================= */
  const norm = (v, ph) => Array.isArray(v) ? v[Math.min(ph, v.length - 1)] : v;
  function planAt(date) {
    const diff = daysBetween(parseKey(S.settings.start), date);
    const wk = Math.max(0, Math.floor(diff / 7));
    return { diff, wk, ph: Math.min(2, Math.floor(wk / 4)), deload: wk % 4 === 3, before: diff < 0 };
  }
  const planWeek = () => (S.plan && Array.isArray(S.plan.week) && S.plan.week.length === 7) ? S.plan.week : WEEK;
  function sessionFor(date) { const id = planWeek()[(date.getDay() + 6) % 7]; return id ? getSession(id) : null; }
  function getBase(id) { return SESS[id] || QUICK[id] || null; }
  function getSession(id) {
    const base = getBase(id);
    if (base) { const ed = S.plan.edits[id]; return ed ? Object.assign({}, base, { blocks: ed.blocks, edited: true }) : base; }
    const c = S.custom.find(x => x.id === id);
    if (c) return { id: c.id, name: c.name, sub: 'Eigenes Workout', kind: 'custom', custom: true, blocks: [{ n: 'Workout', items: c.items.map(i => ({ ex: i.ex, s: i.s, r: i.r, rest: i.rest })) }] };
    return null;
  }
  function modeOf(st) { const e = EXMAP[st.ex]; return (st.timed || e.track === 't' || e.track === 'wt') ? 'timer' : 'reps'; }
  const hasW = e => e.track === 'wr' || e.track === 'wt';

  function buildSteps(sess, ph, deload) {
    const steps = [];
    sess.blocks.forEach(b => {
      if (b.minPhase != null && ph < b.minPhase) return;
      if (b.circuit) {
        let rounds = norm(b.rounds, ph); if (deload && rounds > 3) rounds--;
        const work = norm(b.work, ph);
        for (let r = 0; r < rounds; r++) b.items.forEach((ex, k) => {
          const last = k === b.items.length - 1;
          const rest = last ? (r === rounds - 1 ? 0 : (b.items.length === 1 ? b.rest : b.roundRest)) : b.rest;
          steps.push({ ex, block: b.n, set: r + 1, sets: rounds, side: null, timed: true, secs: work, target: work, rest, circuit: true });
        });
      } else {
        b.items.forEach(it => {
          let sets = norm(it.s, ph); if (deload && sets > 2) sets--;
          const tgt = norm(it.r, ph), rest = norm(it.rest == null ? 45 : it.rest, ph), e = EXMAP[it.ex];
          for (let s = 1; s <= sets; s++) {
            const sides = e.side ? ['L', 'R'] : [null];
            sides.forEach((sd, k) => steps.push({ ex: it.ex, block: b.n, set: s, sets, side: sd, target: tgt, rest: k === sides.length - 1 ? rest : 0 }));
          }
        });
      }
    });
    return steps;
  }
  function sessMeta(sess, ph, deload) {
    const steps = buildSteps(sess, ph, deload); let sec = 0; const eq = new Set();
    steps.forEach(st => {
      const e = EXMAP[st.ex]; e.eq.forEach(q => { if (q !== 'bw') eq.add(q); });
      sec += (modeOf(st) === 'timer' ? (st.secs || st.target) : (st.target || 10) * 3.5) + (st.rest || 0) + 8;
    });
    return { steps: steps.length, min: Math.max(1, Math.round(sec / 60)), eq: [...eq], n: new Set(steps.map(s => s.ex)).size };
  }
  const curPlan = () => planAt(new Date());

  /* ================= Statistik ================= */
  function prevIndex() {
    const idx = {};
    S.history.slice().sort((a, b) => a.ts - b.ts).forEach(h => {
      const by = {};
      h.sets.forEach(s => { (by[s.ex] = by[s.ex] || []).push(s); });
      Object.keys(by).forEach(ex => {
        const best = by[ex].reduce((a, s) => ((s.w || 0) > (a.w || 0) || ((s.w || 0) === (a.w || 0) && (s.r || 0) >= (a.r || 0))) ? s : a, by[ex][0]);
        idx[ex] = { w: best.w || 0, r: best.r || 0, t: best.t || 0, date: h.date };
      });
    });
    return idx;
  }
  function bestOf(sets) {
    let e1 = 0, reps = 0, t = 0, w = 0;
    sets.forEach(s => { if (s.w > 0 && s.r > 0) e1 = Math.max(e1, s.w * (1 + s.r / 30)); w = Math.max(w, s.w || 0); reps = Math.max(reps, s.r || 0); t = Math.max(t, s.t || 0); });
    return { e1, reps, t, w };
  }
  function metricOf(ex, b) { const tr = EXMAP[ex].track; return tr === 'wr' ? (b.e1 || b.reps) : tr === 'r' ? b.reps : tr === 'wt' ? b.w * 1000 + b.t : b.t; }
  function detectPRs(logs) {
    const by = {}; logs.forEach(l => { (by[l.ex] = by[l.ex] || []).push(l); });
    const out = [];
    Object.keys(by).forEach(ex => {
      const old = []; S.history.forEach(h => h.sets.forEach(s => { if (s.ex === ex) old.push(s); }));
      if (!old.length) return;
      const e = EXMAP[ex], now = bestOf(by[ex]), was = bestOf(old);
      if (metricOf(ex, now) > metricOf(ex, was) + 1e-9) {
        const txt = e.track === 'wr' && now.w > 0 ? 'Neuer Bestwert: ' + rnd1(now.w) + ' kg × ' + (by[ex].find(s => s.w === now.w) || {}).r : e.track === 'r' || e.track === 'wr' ? 'Neuer Bestwert: ' + now.reps + ' Wdh.' : 'Neuer Bestwert: ' + now.t + ' s' + (now.w ? ' mit ' + rnd1(now.w) + ' kg' : '');
        out.push({ ex, txt });
      }
    });
    return out;
  }
  function weekCounts(n) {
    const m0 = mondayOf(new Date()), res = [];
    for (let i = n - 1; i >= 0; i--) {
      const a = addDays(m0, -7 * i), b = addDays(a, 6), ka = dkey(a), kb = dkey(b);
      const hs = S.history.filter(h => h.date >= ka && h.date <= kb);
      res.push({ start: a, n: hs.length, vol: hs.reduce((s, h) => s + (h.vol || 0), 0), min: hs.reduce((s, h) => s + (h.dur || 0), 0) / 60 });
    }
    return res;
  }
  function streakWeeks() {
    const goal = S.settings.goal, wc = weekCounts(52).reverse();
    let n = 0, i = 0;
    if (wc[0].n >= goal) { n++; } i = 1;
    for (; i < wc.length; i++) { if (wc[i].n >= goal) n++; else break; }
    return n;
  }

  /* ================= Charts ================= */
  function lineChart(pts, unit, h) {
    h = h || 150;
    if (!pts.length) return '';
    const w = 320, pl = 36, pr = 12, pt = 14, pb = 24;
    let mn = Math.min.apply(null, pts.map(p => p.v)), mx = Math.max.apply(null, pts.map(p => p.v));
    if (mn === mx) { mn -= 1; mx += 1; }
    const pd = (mx - mn) * .15; mn -= pd; mx += pd;
    const t0 = pts[0].t, t1 = pts[pts.length - 1].t;
    const X = p => (pts.length === 1 || t1 === t0) ? pl + (w - pl - pr) / 2 : pl + (p.t - t0) / (t1 - t0) * (w - pl - pr);
    const Y = v => pt + (1 - (v - mn) / (mx - mn)) * (h - pt - pb);
    let g = '';
    [0, .5, 1].forEach(f => { const v = mn + (mx - mn) * f, y = Y(v); g += '<line class="gl" x1="' + pl + '" x2="' + (w - pr) + '" y1="' + y + '" y2="' + y + '"/><text x="' + (pl - 6) + '" y="' + (y + 3) + '" text-anchor="end">' + rnd1(v) + '</text>'; });
    const path = pts.map((p, i) => (i ? 'L' : 'M') + X(p).toFixed(1) + ' ' + Y(p.v).toFixed(1)).join(' ');
    const area = pts.length > 1 ? path + ' L' + X(pts[pts.length - 1]).toFixed(1) + ' ' + (h - pb) + ' L' + X(pts[0]).toFixed(1) + ' ' + (h - pb) + 'Z' : '';
    const dots = pts.map(p => '<circle class="dt" cx="' + X(p).toFixed(1) + '" cy="' + Y(p.v).toFixed(1) + '" r="3.5"/>').join('');
    const fmt = t => new Date(t).toLocaleDateString('de-CH', { day: 'numeric', month: 'short' });
    const lab = pts.length > 1 ? '<text x="' + pl + '" y="' + (h - 6) + '">' + fmt(t0) + '</text><text x="' + (w - pr) + '" y="' + (h - 6) + '" text-anchor="end">' + fmt(t1) + '</text>' : '<text x="' + (w / 2) + '" y="' + (h - 6) + '" text-anchor="middle">' + fmt(t0) + '</text>';
    return '<svg class="chart" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="Verlauf ' + esc(unit) + '">' + g + (area ? '<path class="ar" d="' + area + '"/>' : '') + (pts.length > 1 ? '<path class="ln" d="' + path + '"/>' : '') + dots + lab + '</svg>';
  }
  function barChart(vals, labels, h) {
    h = h || 130;
    const w = 320, pt = 18, pb = 22, n = vals.length, bw = w / n, mx = Math.max(1, Math.max.apply(null, vals));
    return '<svg class="chart" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="Balkendiagramm">' + vals.map((v, i) => {
      const bh = v / mx * (h - pt - pb), x = i * bw + bw * .18;
      return '<rect class="bar ' + (i === n - 1 ? 'cur' : '') + '" x="' + x.toFixed(1) + '" y="' + (h - pb - bh).toFixed(1) + '" width="' + (bw * .64).toFixed(1) + '" height="' + Math.max(bh, v ? 2 : 0).toFixed(1) + '" rx="4"/>' +
        '<text class="val" x="' + (x + bw * .32).toFixed(1) + '" y="' + (h - pb - bh - 5).toFixed(1) + '" text-anchor="middle">' + (v ? Math.round(v) : '') + '</text>' +
        '<text x="' + (x + bw * .32).toFixed(1) + '" y="' + (h - 7) + '" text-anchor="middle">' + labels[i] + '</text>';
    }).join('') + '</svg>';
  }
  function ring(pct, size) {
    size = size || 64; const r = (size - 8) / 2, c = 2 * Math.PI * r;
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '"><circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="var(--line)" stroke-width="7"/><circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="var(--accent2)" stroke-width="7" stroke-linecap="round" stroke-dasharray="' + c + '" stroke-dashoffset="' + c * (1 - Math.min(1, pct)) + '" transform="rotate(-90 ' + size / 2 + ' ' + size / 2 + ')"/></svg>';
  }

  /* ================= UI-Grundlagen ================= */
  let tab = 'today';
  const TABS = [['today', 'Heute', 'home'], ['plan', 'Programm', 'cal'], ['lib', 'Übungen', 'dumbbell'], ['prog', 'Fortschritt', 'chart'], ['me', 'Profil', 'user']];
  const H = {}, I = {}, C = {};
  document.addEventListener('click', e => { const el = e.target.closest('[data-act]'); if (el && H[el.dataset.act]) H[el.dataset.act](el.dataset, el, e); });
  document.addEventListener('input', e => { const el = e.target.closest('[data-in]'); if (el && I[el.dataset.in]) I[el.dataset.in](el.value, el, el.dataset); });
  document.addEventListener('change', e => { const el = e.target.closest('[data-ch]'); if (el && C[el.dataset.ch]) C[el.dataset.ch](el.type === 'checkbox' ? el.checked : el.value, el, el.dataset); });

  function toast(msg) {
    const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t);
    setTimeout(() => t.remove(), 2600);
  }
  function renderNav() {
    $('#nav').innerHTML = TABS.map(t => '<button class="' + (tab === t[0] ? 'on' : '') + '" data-act="tab" data-t="' + t[0] + '" aria-label="' + t[1] + '">' + icon(t[2]) + '<span>' + t[1] + '</span></button>').join('');
  }
  function render() {
    $('#view').innerHTML = V[tab]();
    renderNav();
  }
  H.tab = d => { tab = d.t; render(); window.scrollTo(0, 0); };
  const go = t => { tab = t; render(); window.scrollTo(0, 0); };

  /* Sheets (Stapel) */
  let sheetStack = [];
  function showSheet() {
    const el = $('#sheet');
    if (!sheetStack.length) { el.classList.remove('open'); el.innerHTML = ''; return; }
    const top = sheetStack[sheetStack.length - 1], r = top();
    el.innerHTML = '<div class="backdrop" data-act="sheetclose"></div><div class="sheetbox" role="dialog" aria-modal="true"><div class="grab"></div><div class="sheethead">' +
      (sheetStack.length > 1 ? '<button class="iconbtn" data-act="sheetback" aria-label="Zurück">' + icon('back') + '</button>' : '') +
      '<h3>' + r.title + '</h3><button class="iconbtn" data-act="sheetclose" aria-label="Schliessen">' + icon('x') + '</button></div><div class="sheetbody">' + r.body + '</div></div>';
    el.classList.add('open');
  }
  const openSheet = fn => { sheetStack = [fn]; showSheet(); };
  const pushSheet = fn => { sheetStack.push(fn); showSheet(); };
  const popSheet = () => { sheetStack.pop(); showSheet(); };
  const refreshSheet = () => { const sb = $('.sheetbody'), y = sb ? sb.scrollTop : 0; showSheet(); const n = $('.sheetbody'); if (n) n.scrollTop = y; };
  H.sheetclose = () => { sheetStack = []; showSheet(); };
  H.sheetback = () => popSheet();

  function confirmSheet(title, text, actions) {
    window.__cf = actions;
    pushSheet(() => ({
      title: esc(title), body: '<p class="muted">' + esc(text) + '</p><div class="mt16" style="display:grid;gap:10px">' + actions.map((a, i) => '<button class="btn block ' + (a.cls || '') + '" data-act="cf" data-i="' + i + '">' + esc(a.label) + '</button>').join('') + '</div>'
    }));
  }
  H.cf = d => { const a = window.__cf[+d.i]; popSheet(); if (a.fn) a.fn(); };

  /* ================= Views ================= */
  const V = {};

  function kindBadge(kind, sz) { return '<div class="badge k-' + kind + '"' + (sz ? ' style="width:' + sz + 'px;height:' + sz + 'px"' : '') + '>' + icon(KIND_ICON[kind] || 'dumbbell') + '</div>'; }
  const eqChips = eq => eq.map(q => '<span class="chip">' + EQ[q] + '</span>').join('');

  V.today = function () {
    const now = new Date(), pl = curPlan(), sess = sessionFor(now), key = dkey(now);
    const doneToday = S.history.filter(h => h.date === key);
    const hr = now.getHours(), greet = hr < 11 ? 'Guten Morgen' : hr < 17 ? 'Hallo' : 'Guten Abend';
    const wcs = weekCounts(1)[0], goal = S.settings.goal;
    const phName = PHASES[pl.ph].n + (pl.wk >= 12 ? ' · Erhaltung' : '');
    let h = '<div class="page-head"><div><div class="sub">' + now.toLocaleDateString('de-CH', { weekday: 'long', day: 'numeric', month: 'long' }) + '</div><h1>' + greet + (S.settings.name ? ', ' + esc(S.settings.name) : '') + '</h1></div></div>';
    h += '<div class="chips" style="margin:-4px 0 14px"><span class="chip accent">' + (pl.before ? 'Start ' + fmtDate(S.settings.start) : 'Woche ' + (pl.wk + 1)) + ' · ' + phName + '</span>' + (pl.deload && !pl.before ? '<span class="chip warn">Entlastungswoche</span>' : '') + '</div>';

    if (S.draft) {
      h += '<div class="card row" style="margin-bottom:12px;border-color:var(--accent2)"><div class="grow"><div class="bold">Training unterbrochen</div><div class="small muted">' + esc(S.draft.name) + ' · Übung ' + (S.draft.idx + 1) + ' von ' + S.draft.steps.length + '</div></div><button class="btn primary sm" data-act="resume">Fortsetzen</button><button class="iconbtn" data-act="discarddraft" aria-label="Verwerfen">' + icon('trash') + '</button></div>';
    }
    if (sess) {
      const m = sessMeta(sess, pl.ph, pl.deload);
      h += '<div class="hero k-' + sess.kind + '"><div class="label">' + (doneToday.length ? 'Heute erledigt ✓' : 'Heutiges Training') + '</div><h2>' + esc(sess.name) + '</h2><p>' + esc(sess.sub) + '</p>' +
        '<div class="chips"><span class="chip">' + icon('clock') + ' ca. ' + m.min + ' Min</span><span class="chip">' + m.n + ' Übungen</span>' + m.eq.slice(0, 3).map(q => '<span class="chip">' + EQ[q] + '</span>').join('') + '</div>' +
        '<div class="actions"><button class="btn big" data-act="start" data-id="' + sess.id + '">' + icon('play', 'fill') + ' Start</button><button class="btn big outline" data-act="preview" data-id="' + sess.id + '">Vorschau</button></div></div>';
    } else {
      h += '<div class="hero k-rest"><div class="label">Heute</div><h2>Ruhetag</h2><p>Erholung gehört zum Training. Ein kurzer Spaziergang oder leichte Mobilität reicht.</p><div class="actions mt16" style="margin-top:16px"><button class="btn big" data-act="start" data-id="q_morning">' + icon('play', 'fill') + ' 10 Min Mobility</button></div></div>';
    }

    // Woche
    const m0 = mondayOf(now);
    h += '<div class="section-title">Diese Woche</div><div class="week">';
    for (let i = 0; i < 7; i++) {
      const d = addDays(m0, i), k = dkey(d), sid = planWeek()[i], done = S.history.some(x => x.date === k), isT = k === key;
      h += '<button class="day ' + (isT ? 'today ' : '') + (done ? 'done ' : '') + (sid ? '' : 'off') + '" data-act="preview" data-id="' + (sid || 'q_morning') + '" aria-label="' + WD[i] + '"><span class="wd">' + WD[i] + '</span><span class="dn">' + d.getDate() + '</span><span class="dot">' + (done ? icon('check') : sid ? icon(KIND_ICON[getSession(sid).kind]) : icon('moon')) + '</span></button>';
    }
    h += '</div>';

    h += '<div class="stats mt12"><div class="stat"><div class="ringwrap">' + ring(wcs.n / goal) + '<div class="rv">' + wcs.n + '/' + goal + '</div></div><div class="l" style="margin-top:6px">Wochenziel</div></div>' +
      '<div class="stat"><div class="v">' + streakWeeks() + '</div><div class="l">Wochen-Serie</div></div>' +
      '<div class="stat"><div class="v">' + Math.round(wcs.min) + '</div><div class="l">Minuten</div></div></div>';

    // Programm-Fortschritt
    const pct = Math.min(100, Math.round(((pl.wk + (pl.before ? 0 : ((pl.diff % 7) + 1) / 7)) / 12) * 100));
    h += '<div class="card mt12"><div class="row"><div class="grow bold">Winterprogramm</div><span class="small muted">' + (pl.before ? (pl.diff === -1 ? 'beginnt morgen' : 'beginnt in ' + (-pl.diff) + ' Tagen') : pl.wk >= 12 ? 'abgeschlossen – weiter so' : 'Woche ' + (pl.wk + 1) + ' von 12') + '</span></div><div class="progress mt8"><div style="width:' + (pl.before ? 0 : pct) + '%"></div></div><div class="small muted mt8">' + esc(PHASES[pl.ph].d) + '</div></div>';

    // Coach
    const ch = coachHints().slice(0, 2);
    h += '<div class="section-title">Coach<button data-act="opencoach">Alle Hinweise</button></div>' + (ch.length ? ch.map(hintCard).join('') : '<div class="card empty"><b>Noch keine Auswertung</b>Sobald du trainiert hast, bewertet der Coach deine Belastung anhand von Studien und Richtlinien.</div>');
    h += '<button class="btn block mt12" data-act="logext">' + icon('plus') + ' Aktivität eintragen (Fussball, Golf, Laufen …)</button>';
    // Schnelle Einheiten
    h += '<div class="section-title">Schnelle Einheiten</div><div class="scroll-x">' + Object.values(QUICK).map(q => '<button class="qcard k-' + q.kind + '" data-act="preview" data-id="' + q.id + '">' + icon(KIND_ICON[q.kind]) + '<b>' + esc(q.name) + '</b><span>' + esc(q.sub.split('·')[0]) + '</span></button>').join('') + '</div>';

    const last = S.history.slice().sort((a, b) => b.ts - a.ts)[0];
    if (last) h += '<div class="section-title">Zuletzt</div><div class="card"><button class="item" style="padding:0;border:0" data-act="histdetail" data-id="' + last.id + '">' + kindBadge(last.kind || 'strength') + '<div class="grow"><div class="t">' + esc(last.name) + '</div><div class="s">' + fmtDate(last.date, { weekday: 'long', day: 'numeric', month: 'short' }) + ' · ' + fmtMin(last.dur) + (last.sets.length ? ' · ' + last.sets.length + ' Sätze' : '') + '</div></div>' + icon('chev', 'chev') + '</button></div>';
    return h;
  };

  H.resume = () => resumeWorkout();
  H.discarddraft = () => confirmSheet('Unterbrochenes Training verwerfen?', 'Bereits erfasste Sätze gehen verloren.', [{ label: 'Verwerfen', cls: 'danger', fn: () => { S.draft = null; save(); render(); } }, { label: 'Abbrechen' }]);

  /* ---- Vorschau ---- */
  H.preview = d => openSheet(() => previewBody(d.id));
  function previewBody(id) {
    const sess = getSession(id), pl = curPlan(), m = sessMeta(sess, pl.ph, pl.deload);
    let b = '<p class="muted">' + esc(sess.sub) + '</p><div class="chips mt8"><span class="chip accent">' + icon('clock') + ' ca. ' + m.min + ' Min</span><span class="chip">' + m.n + ' Übungen</span>' + eqChips(m.eq) + '</div>';
    if (!sess.custom && !QUICK[id]) b += '<div class="small muted mt8">Woche ' + (pl.wk + 1) + ' · ' + PHASES[pl.ph].n + (pl.deload ? ' · Entlastung (weniger Sätze)' : '') + '</div>';
    sess.blocks.forEach(bl => {
      if (bl.minPhase != null && pl.ph < bl.minPhase) return;
      b += '<div class="blk">' + esc(bl.n) + (bl.circuit ? ' · ' + norm(bl.rounds, pl.ph) + ' Runden × ' + norm(bl.work, pl.ph) + ' s' : '') + '</div>';
      bl.items.forEach(it => {
        const exid = typeof it === 'string' ? it : it.ex, e = EXMAP[exid];
        let desc = '';
        if (typeof it !== 'string') { const s = norm(it.s, pl.ph), r = norm(it.r, pl.ph); desc = s + ' × ' + r + (e.track === 't' || e.track === 'wt' ? ' s' : ' Wdh.') + (e.side ? ' pro Seite' : ''); }
        else desc = norm(bl.work, pl.ph) + ' s Arbeit';
        b += '<button class="xrow" data-act="exinfo" data-id="' + exid + '"><div class="grow"><div class="t bold">' + esc(e.name) + '</div><div class="small muted">' + desc + '</div></div>' + icon('chev', 'chev') + '</button>';
      });
    });
    b += '<button class="btn primary big block mt16" data-act="start" data-id="' + id + '">' + icon('play', 'fill') + ' Training starten</button>';
    b += sess.custom ? '<button class="btn block mt12" data-act="editcustom" data-id="' + id + '">' + icon('edit') + ' Bearbeiten</button>' : '<button class="btn block mt12" data-act="editplan" data-id="' + id + '">' + icon('edit') + ' Einheit anpassen' + (sess.edited ? ' (bereits angepasst)' : '') + '</button>';
    return { title: esc(sess.name) + (sess.edited ? ' <span class="chip accent" style="vertical-align:middle">angepasst</span>' : ''), body: b };
  }

  /* ---- Übungsdetail ---- */
  H.exinfo = d => pushSheet(() => exBody(d.id));
  function exBody(id) {
    const e = EXMAP[id], prev = prevIndex()[id];
    const hist = []; S.history.slice().sort((a, b) => a.ts - b.ts).forEach(h => { const s = h.sets.filter(x => x.ex === id); if (s.length) hist.push({ t: h.ts, d: h.date, b: bestOf(s) }); });
    let b = '<div class="chips"><span class="chip accent">' + CAT[e.cat] + '</span>' + eqChips(e.eq) + (e.side ? '<span class="chip">pro Seite</span>' : '') + '</div>';
    b += '<div class="small muted mt8">' + esc(e.m) + '</div><div class="blk">Ausführung</div><ul class="cues">' + e.cues.map(c => '<li>' + esc(c) + '</li>').join('') + '</ul>';
    if (e.tip) b += '<div class="tip">' + esc(e.tip) + '</div>';
    b += '<a class="btn block mt16" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=' + encodeURIComponent(e.name + ' Übung Anleitung') + '">' + icon('video') + ' Videoanleitung suchen</a>';
    if (hist.length) {
      const pts = hist.map(x => ({ t: x.t, v: rnd1(e.track === 'wr' ? (x.b.e1 || x.b.reps) : e.track === 'r' ? x.b.reps : e.track === 'wt' ? (x.b.w || x.b.t) : x.b.t) }));
      b += '<div class="blk">Dein Verlauf ' + (e.track === 'wr' ? '(geschätztes 1RM, kg)' : e.track === 'r' ? '(Wdh.)' : '(Sek.)') + '</div>' + lineChart(pts, '');
    }
    return { title: esc(e.name), body: b };
  }

  /* ---- Programm ---- */
  V.plan = function () {
    const pl = curPlan(), week = planWeek(), DAYS = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
    let h = '<div class="page-head"><div><div class="sub">Winterpause</div><h1>Programm</h1></div></div>';
    h += '<div class="card"><div class="bold">Dein Winterziel</div><p class="small muted mt8">Kondition halten, Rumpf kräftigen, Beweglichkeit verbessern und Körperkontrolle schulen – zuhause mit Gymnastikball, Lang- und Kurzhanteln und Balancierscheibe. Der Plan ist ein Vorschlag: Du kannst jede Einheit anpassen und den Wochenplan ändern.</p><div style="display:grid;gap:10px;margin-top:12px"><button class="btn primary block" data-act="assistant">Plan-Assistent</button><button class="btn block" data-act="editweek">Wochenplan anpassen</button></div></div>';
    const ph = planHints(week, pl.ph);
    if (ph.length) h += '<div class="section-title">Plan-Check</div>' + ph.map(hintCard).join('');
    h += '<div class="section-title">12 Wochen · 3 Phasen</div><div class="card">';
    PHASES.forEach((p, i) => { h += '<div class="phase ' + (pl.ph === i && !pl.before ? 'on' : '') + '"><div class="num">' + (i + 1) + '</div><div><div class="bold">' + p.n + ' <span class="muted small">· ' + p.w + '</span></div><div class="small muted">' + esc(p.d) + '</div></div></div>'; });
    h += '<p class="small muted mt12">Jede 4. Woche hat weniger Sätze (Entlastungswoche). Phasen und Entlastung sind Planungsentscheidungen der App; ACSM (2009) sieht Variation der Belastung über die Zeit als sinnvoll an.</p></div>';

    h += '<div class="section-title">Wochenplan</div><div class="card list">';
    week.forEach((sid, i) => {
      const s = sid ? getSession(sid) : null;
      if (!s) { h += '<div class="item"><div class="badge" style="background:var(--surface2);color:var(--muted)">' + icon('moon') + '</div><div class="grow"><div class="t">' + DAYS[i] + ' · Ruhetag</div><div class="s">Erholung, Spaziergang oder eigene Aktivität</div></div></div>'; return; }
      const m = sessMeta(s, pl.ph, pl.deload);
      h += '<button class="item" data-act="preview" data-id="' + sid + '">' + kindBadge(s.kind) + '<div class="grow"><div class="t">' + DAYS[i] + ' · ' + esc(s.name) + (s.edited ? ' <span class="chip accent">angepasst</span>' : '') + '</div><div class="s">' + esc(s.sub) + ' · ' + m.min + ' Min</div></div>' + icon('chev', 'chev') + '</button>';
    });
    h += '</div><p class="small muted mt8">Du kannst jede Einheit jederzeit starten – auch an einem anderen Tag.</p>';

    h += '<div class="section-title">Schnelle Einheiten</div><div class="card list">' + Object.values(QUICK).map(q => { const qq = getSession(q.id); return '<button class="item" data-act="preview" data-id="' + q.id + '">' + kindBadge(q.kind) + '<div class="grow"><div class="t">' + esc(q.name) + (qq.edited ? ' <span class="chip accent">angepasst</span>' : '') + '</div><div class="s">' + esc(q.sub) + '</div></div>' + icon('chev', 'chev') + '</button>'; }).join('') + '</div>';

    h += '<div class="section-title">Eigene Workouts<button data-act="newcustom">+ Neu</button></div>';
    if (!S.custom.length) h += '<div class="card empty"><b>Noch keine eigenen Workouts</b>Stelle dir aus der Übungsbibliothek eigene Einheiten zusammen.</div>';
    else h += '<div class="card list">' + S.custom.map(c => '<div class="item"><button class="row grow" style="background:none;border:0;padding:0;text-align:left" data-act="preview" data-id="' + c.id + '">' + kindBadge('custom') + '<div class="grow"><div class="t">' + esc(c.name) + '</div><div class="s">' + c.items.length + ' Übungen</div></div></button><button class="iconbtn" data-act="editcustom" data-id="' + c.id + '" aria-label="Bearbeiten">' + icon('edit') + '</button></div>').join('') + '</div>';

    h += '<div class="section-title">Einstellungen</div><div class="card"><label class="field"><span>Programmstart (Montag empfohlen)</span><input type="date" data-ch="start" value="' + esc(S.settings.start) + '"></label><p class="small muted">Daraus berechnen sich Woche und Phase.</p></div>';
    return h;
  };
  C.start = v => { if (v) { S.settings.start = v; save(); render(); } };

  /* ---- Übungsbibliothek ---- */
  const LIB = { q: '', cat: '', eq: '' };
  function exList(f) {
    const q = f.q.trim().toLowerCase();
    return EX.filter(e => (!f.cat || e.cat === f.cat) && (!f.eq || e.eq.includes(f.eq)) && (!q || (e.name + ' ' + e.m + ' ' + CAT[e.cat]).toLowerCase().includes(q)));
  }
  function exRows(list, act) {
    if (!list.length) return '<div class="empty"><b>Keine Übung gefunden</b>Passe Suche oder Filter an.</div>';
    return list.map(e => '<button class="item" data-act="' + act + '" data-id="' + e.id + '"><div class="badge" style="background:var(--surface2);color:var(--accent2)">' + icon(e.cat === 'mob' ? 'wave' : e.cat === 'cond' ? 'flame' : e.cat === 'core' || e.cat === 'rot' ? 'target' : e.cat === 'bal' ? 'leaf' : 'dumbbell') + '</div><div class="grow"><div class="t">' + esc(e.name) + '</div><div class="s">' + CAT[e.cat] + ' · ' + e.eq.map(q => EQ[q]).join(', ') + '</div></div>' + icon('chev', 'chev') + '</button>').join('');
  }
  function filterChips(f, prefix, lockCat) {
    let h = '';
    if (!lockCat) h += '<div class="scroll-x"><button class="fchip ' + (f.cat === '' ? 'on' : '') + '" data-act="' + prefix + 'cat" data-v="">Alle</button>' + Object.keys(CAT).map(k => '<button class="fchip ' + (f.cat === k ? 'on' : '') + '" data-act="' + prefix + 'cat" data-v="' + k + '">' + CAT[k] + '</button>').join('') + '</div>';
    h += '<div class="scroll-x"><button class="fchip ' + (f.eq === '' ? 'on' : '') + '" data-act="' + prefix + 'eq" data-v="">Jedes Gerät</button>' + Object.keys(EQ).map(k => '<button class="fchip ' + (f.eq === k ? 'on' : '') + '" data-act="' + prefix + 'eq" data-v="' + k + '">' + EQ[k] + '</button>').join('') + '</div>';
    return h;
  }
  V.lib = function () {
    return '<div class="page-head"><div><div class="sub">' + EX.length + ' Übungen</div><h1>Übungen</h1></div></div><div class="search">' + icon('search') + '<input type="text" placeholder="Übung oder Muskel suchen" data-in="libq" value="' + esc(LIB.q) + '" aria-label="Suche"></div><div id="libChips">' + filterChips(LIB, 'lib') + '</div><div class="card list mt12" id="libList" style="padding:4px 16px">' + exRows(exList(LIB), 'exinfo1') + '</div>';
  };
  const libRefresh = () => { $('#libChips').innerHTML = filterChips(LIB, 'lib'); $('#libList').innerHTML = exRows(exList(LIB), 'exinfo1'); };
  I.libq = v => { LIB.q = v; $('#libList').innerHTML = exRows(exList(LIB), 'exinfo1'); };
  H.libcat = d => { LIB.cat = d.v; libRefresh(); };
  H.libeq = d => { LIB.eq = d.v; libRefresh(); };
  H.exinfo1 = d => openSheet(() => exBody(d.id));

  /* ---- Auswahl (Picker) ---- */
  const PK = { q: '', cat: '', eq: '', cb: null, lock: false };
  function pickExercise(cb, cat) { PK.q = ''; PK.cat = cat || ''; PK.eq = ''; PK.cb = cb; PK.lock = false; pushSheet(pickerSheet); }
  function pickerSheet() {
    return { title: 'Übung wählen', body: '<div class="search">' + icon('search') + '<input type="text" placeholder="Suchen" data-in="pkq" value="' + esc(PK.q) + '"></div><div id="pkChips">' + filterChips(PK, 'pk', PK.lock) + '</div><div class="list mt8" id="pkList">' + exRows(exList(PK), 'pkpick') + '</div>' };
  }
  const pkRefresh = () => { $('#pkChips').innerHTML = filterChips(PK, 'pk', PK.lock); $('#pkList').innerHTML = exRows(exList(PK), 'pkpick'); };
  I.pkq = v => { PK.q = v; $('#pkList').innerHTML = exRows(exList(PK), 'pkpick'); };
  H.pkcat = d => { PK.cat = d.v; pkRefresh(); };
  H.pkeq = d => { PK.eq = d.v; pkRefresh(); };
  H.pkpick = d => { const cb = PK.cb; popSheet(); if (cb) cb(d.id); };

  /* ---- Editor: eigene Workouts und Anpassung der Einheiten ---- */
  let ED = null;
  const isTimeTrack = id => { const t = EXMAP[id].track; return t === 't' || t === 'wt'; };
  const resolveBlocks = (sess, ph) => sess.blocks.map(b => {
    const nb = Object.assign({}, b);
    if (b.circuit) { nb.rounds = norm(b.rounds, ph); nb.work = norm(b.work, ph); nb.items = b.items.slice(); }
    else nb.items = b.items.map(it => ({ ex: it.ex, s: norm(it.s, ph), r: norm(it.r, ph), rest: norm(it.rest == null ? 45 : it.rest, ph) }));
    return nb;
  });
  function defItem(id) { const t = EXMAP[id].track; return { ex: id, s: 3, r: t === 'wr' ? 10 : t === 'r' ? 12 : 30, rest: t === 'wr' ? 60 : 30 }; }
  const edShown = b => b.minPhase == null || curPlan().ph >= b.minPhase;
  H.newcustom = () => { ED = { type: 'custom', id: 'c_' + uid(), name: '', isNew: true, blocks: [{ n: 'Workout', items: [] }] }; openEditor(); };
  H.editcustom = d => { const c = S.custom.find(x => x.id === d.id); ED = { type: 'custom', id: c.id, name: c.name, blocks: [{ n: 'Workout', items: c.items.map(i => Object.assign({}, i)) }] }; H.sheetclose(); openEditor(); };
  H.editplan = d => {
    const base = getBase(d.id), ed = S.plan.edits[d.id];
    ED = { type: 'plan', id: d.id, name: base.name, edited: !!ed, blocks: ed ? JSON.parse(JSON.stringify(ed.blocks)) : resolveBlocks(base, curPlan().ph) };
    H.sheetclose(); openEditor();
  };
  function openEditor() { $('#screen').classList.add('open'); renderEditor(); }
  function closeEditor() { $('#screen').classList.remove('open'); $('#screen').innerHTML = ''; ED = null; setTimeout(applyUpdate, 500); }
  function renderEditor() {
    const sc = $('#screen'), y = sc.scrollTop, plan = ED.type === 'plan';
    let h = '<div style="max-width:600px;margin:0 auto;padding:calc(14px + env(safe-area-inset-top)) 16px 40px"><div class="row" style="margin-bottom:14px"><button class="iconbtn" data-act="edcancel" aria-label="Schliessen">' + icon('x') + '</button><h2 class="grow" style="font-size:20px">' + (plan ? 'Einheit anpassen' : ED.isNew ? 'Neues Workout' : 'Workout bearbeiten') + '</h2><button class="btn primary sm" data-act="edsave">Speichern</button></div>';
    h += plan ? '<div class="card"><div class="bold">' + esc(ED.name) + '</div><p class="small muted mt8">Ersetze, ergänze oder lösche Übungen und ändere Sätze, Wiederholungen und Pausen. Deine Werte gelten dann in allen Phasen (die automatische Steigerung entfällt für diese Einheit).</p></div>' : '<label class="field"><span>Name</span><input type="text" data-in="edname" value="' + esc(ED.name) + '" placeholder="z. B. Oberkörper Express" maxlength="40"></label>';
    ED.blocks.forEach((bl, bi) => {
      if (!edShown(bl)) return;
      if (plan) h += '<div class="blk">' + esc(bl.n) + '</div>';
      if (bl.circuit) h += '<div class="card"><div class="row" style="gap:8px"><label class="field grow" style="margin:0"><span>Runden</span><input type="number" inputmode="numeric" min="1" max="20" data-in="edcirc" data-b="' + bi + '" data-f="rounds" value="' + bl.rounds + '"></label><label class="field grow" style="margin:0"><span>Arbeit s</span><input type="number" inputmode="numeric" min="5" max="300" data-in="edcirc" data-b="' + bi + '" data-f="work" value="' + bl.work + '"></label><label class="field grow" style="margin:0"><span>Pause s</span><input type="number" inputmode="numeric" min="0" max="300" data-in="edcirc" data-b="' + bi + '" data-f="rest" value="' + bl.rest + '"></label></div></div>';
      bl.items.forEach((it, i) => {
        const id = bl.circuit ? it : it.ex, e = EXMAP[id], sec = isTimeTrack(id);
        h += '<div class="card"><div class="row"><div class="grow bold">' + esc(e.name) + '</div><button class="iconbtn" data-act="edswap" data-b="' + bi + '" data-i="' + i + '" aria-label="Ersetzen">' + icon('swap') + '</button><button class="iconbtn" data-act="edup" data-b="' + bi + '" data-i="' + i + '" aria-label="Nach oben" ' + (i === 0 ? 'disabled' : '') + '>↑</button><button class="iconbtn" data-act="eddel" data-b="' + bi + '" data-i="' + i + '" aria-label="Entfernen">' + icon('trash') + '</button></div>';
        if (!bl.circuit) h += '<div class="row mt12" style="gap:8px"><label class="field grow" style="margin:0"><span>Sätze</span><input type="number" inputmode="numeric" min="1" max="10" data-in="editem" data-b="' + bi + '" data-i="' + i + '" data-f="s" value="' + it.s + '"></label><label class="field grow" style="margin:0"><span>' + (sec ? 'Sekunden' : 'Wdh.') + '</span><input type="number" inputmode="numeric" min="1" max="600" data-in="editem" data-b="' + bi + '" data-i="' + i + '" data-f="r" value="' + it.r + '"></label><label class="field grow" style="margin:0"><span>Pause s</span><input type="number" inputmode="numeric" min="0" max="600" data-in="editem" data-b="' + bi + '" data-i="' + i + '" data-f="rest" value="' + it.rest + '"></label></div>' + (e.side ? '<div class="tiny muted mt8">Pro Seite</div>' : '');
        h += '</div>';
      });
      h += '<button class="btn block" data-act="edadd" data-b="' + bi + '">' + icon('plus') + ' Übung hinzufügen</button>';
    });
    if (plan && ED.edited) h += '<button class="btn block mt16" data-act="edreset">Auf Vorschlag zurücksetzen</button>';
    if (!plan && !ED.isNew) h += '<button class="btn block danger mt12" data-act="eddelete">Workout löschen</button>';
    sc.innerHTML = h + '</div>'; sc.scrollTop = y;
  }
  I.edname = v => { ED.name = v; };
  I.editem = (v, el, d) => { ED.blocks[+d.b].items[+d.i][d.f] = Math.max(0, parseInt(v, 10) || 0); };
  I.edcirc = (v, el, d) => { ED.blocks[+d.b][d.f] = Math.max(0, parseInt(v, 10) || 0); };
  H.edadd = d => pickExercise(id => { const bl = ED.blocks[+d.b]; bl.items.push(bl.circuit ? id : defItem(id)); renderEditor(); });
  H.edswap = d => {
    const bl = ED.blocks[+d.b], i = +d.i, cur = bl.circuit ? bl.items[i] : bl.items[i].ex;
    pickExercise(id => {
      if (bl.circuit) bl.items[i] = id;
      else { const it = bl.items[i], was = isTimeTrack(it.ex); it.ex = id; if (isTimeTrack(id) !== was) it.r = was ? 10 : 30; }
      renderEditor();
    }, EXMAP[cur].cat);
  };
  H.eddel = d => { ED.blocks[+d.b].items.splice(+d.i, 1); renderEditor(); };
  H.edup = d => { const it = ED.blocks[+d.b].items, i = +d.i; if (i > 0) { const t = it[i]; it[i] = it[i - 1]; it[i - 1] = t; renderEditor(); } };
  H.edcancel = () => closeEditor();
  H.edsave = () => {
    const total = ED.blocks.reduce((n, b) => n + (edShown(b) ? b.items.length : 0), 0);
    if (ED.type === 'custom' && !ED.name.trim()) return toast('Bitte einen Namen eingeben');
    if (!total) return toast('Füge mindestens eine Übung hinzu');
    ED.blocks.forEach(b => {
      if (b.circuit) { b.rounds = Math.max(1, b.rounds); b.work = Math.max(5, b.work); }
      else b.items.forEach(i => { i.s = Math.max(1, i.s); i.r = Math.max(1, i.r); });
    });
    if (ED.type === 'plan') S.plan.edits[ED.id] = { blocks: ED.blocks };
    else {
      const o = { id: ED.id, name: ED.name.trim(), items: ED.blocks[0].items }, k = S.custom.findIndex(c => c.id === o.id);
      if (k >= 0) S.custom[k] = o; else S.custom.push(o);
    }
    save(); closeEditor(); render(); toast('Gespeichert');
  };
  H.edreset = () => confirmSheet('Auf Vorschlag zurücksetzen?', 'Deine Anpassungen an dieser Einheit gehen verloren.', [{ label: 'Zurücksetzen', cls: 'danger', fn: () => { delete S.plan.edits[ED.id]; save(); closeEditor(); render(); toast('Vorschlag wiederhergestellt'); } }, { label: 'Abbrechen' }]);
  H.eddelete = () => confirmSheet('Workout löschen?', ED.name, [{ label: 'Löschen', cls: 'danger', fn: () => { S.custom = S.custom.filter(c => c.id !== ED.id); save(); closeEditor(); render(); } }, { label: 'Abbrechen' }]);

  /* ---- Wochenplan anpassen ---- */
  H.editweek = () => openSheet(() => {
    const DAYS = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'], week = planWeek();
    const opts = cur => '<option value="">Ruhetag</option>' + [['Einheiten', Object.values(SESS)], ['Schnelle Einheiten', Object.values(QUICK)], ['Eigene Workouts', S.custom.map(c => ({ id: c.id, name: c.name }))]].filter(g => g[1].length).map(g => '<optgroup label="' + g[0] + '">' + g[1].map(x => '<option value="' + x.id + '"' + (x.id === cur ? ' selected' : '') + '>' + esc(x.name) + '</option>').join('') + '</optgroup>').join('');
    return { title: 'Wochenplan anpassen', body: DAYS.map((d, i) => '<label class="field"><span>' + d + '</span><select data-ch="wkset" data-i="' + i + '">' + opts(week[i]) + '</select></label>').join('') + '<p class="small muted">Änderungen gelten sofort. Der Plan-Check im Programm zeigt dir, wie der Wochenplan zu den Richtlinien passt.</p><button class="btn primary block mt12" data-act="sheetclose">Fertig</button>' };
  });
  C.wkset = (v, el, d) => { S.plan.week[+d.i] = v || null; save(); render(); };

  /* ---- Plan-Assistent ---- */
  const PL = { days: 5, focus: 'bal' };
  const WEEK_TABLE = {
    bal: { 2: ['kraftA', 'kraftB'], 3: ['kraftA', 'cond', 'kraftB'], 4: ['kraftA', 'control', 'cond', 'kraftB'], 5: ['kraftA', 'control', 'cond', 'core', 'kraftB'], 6: ['kraftA', 'control', 'cond', 'core', 'kraftB', 'flow'] },
    cond: { 2: ['kraftA', 'kraftB'], 3: ['kraftA', 'cond', 'kraftB'], 4: ['kraftA', 'cond', 'cond', 'kraftB'], 5: ['kraftA', 'cond', 'core', 'cond', 'kraftB'], 6: ['kraftA', 'cond', 'control', 'cond', 'kraftB', 'flow'] },
    mob: { 2: ['kraftA', 'kraftB'], 3: ['kraftA', 'control', 'kraftB'], 4: ['kraftA', 'control', 'flow', 'kraftB'], 5: ['kraftA', 'control', 'cond', 'flow', 'kraftB'], 6: ['kraftA', 'control', 'cond', 'flow', 'kraftB', 'control'] }
  };
  const WEEK_POS = { 2: [0, 3], 3: [0, 2, 4], 4: [0, 1, 3, 4], 5: [0, 1, 2, 3, 4], 6: [0, 1, 2, 3, 4, 5] };
  function suggestWeek(days, focus) {
    const w = [null, null, null, null, null, null, null], list = WEEK_TABLE[focus][days];
    WEEK_POS[days].forEach((pos, k) => { w[pos] = list[k]; });
    return w;
  }
  H.assistant = () => openSheet(assistantSheet);
  function assistantSheet() {
    const w = suggestWeek(PL.days, PL.focus), pl = curPlan(), DAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
    const sel = (key, val, arr) => '<select data-ch="' + key + '">' + arr.map(a => '<option value="' + a[0] + '"' + (String(a[0]) === String(val) ? ' selected' : '') + '>' + a[1] + '</option>').join('') + '</select>';
    return {
      title: 'Plan-Assistent', body:
        '<p class="small muted">Der Assistent wählt aus den vorhandenen Einheiten einen Wochenplan nach festen Regeln der WHO- und ACSM-Richtlinien. Er kennt dich nicht persönlich und ersetzt keine Beratung.</p>' +
        '<label class="field mt12"><span>Trainingstage pro Woche</span>' + sel('pldays', PL.days, [[2, '2 Tage'], [3, '3 Tage'], [4, '4 Tage'], [5, '5 Tage'], [6, '6 Tage']]) + '</label>' +
        '<label class="field"><span>Schwerpunkt</span>' + sel('plfocus', PL.focus, [['bal', 'Ausgewogen'], ['cond', 'Mehr Kondition'], ['mob', 'Mehr Mobilität & Balance']]) + '</label>' +
        '<div class="blk">Vorschlag</div><div class="card" style="box-shadow:none">' + w.map((id, i) => '<div class="tr" style="grid-template-columns:40px 1fr"><div class="bold">' + DAYS[i] + '</div><div>' + (id ? esc(getBase(id).name) : '<span class="muted">Ruhetag</span>') + '</div></div>').join('') + '</div>' +
        planHints(w, pl.ph).map(hintCard).join('') +
        '<button class="btn primary big block mt16" data-act="plapply">Plan übernehmen</button><p class="tiny muted mt8">Dein Wochenziel wird auf ' + w.filter(Boolean).length + ' Einheiten gesetzt. Deine eigenen Anpassungen an Einheiten bleiben erhalten.</p>'
    };
  }
  C.pldays = v => { PL.days = +v; refreshSheet(); };
  C.plfocus = v => { PL.focus = v; refreshSheet(); };
  H.plapply = () => { const w = suggestWeek(PL.days, PL.focus); S.plan.week = w; S.settings.goal = Math.min(7, w.filter(Boolean).length); save(); H.sheetclose(); render(); toast('Wochenplan übernommen'); };

  /* ---- Aktivität eintragen ---- */
  const EXT = [['Fussball Training', true], ['Fussball Spiel', true], ['Golf (zu Fuss)', true], ['Golf (mit Cart)', false], ['Laufen', true], ['Radfahren', true], ['Schwimmen', true], ['Zügiges Gehen', true], ['Andere Aktivität', false]];
  H.logext = () => openSheet(() => ({
    title: 'Aktivität eintragen', body:
      '<p class="small muted">Trage auch Aktivitäten ausserhalb des Plans ein. Sie fliessen in die Belastungsauswertung des Coaches ein.</p>' +
      '<label class="field mt12"><span>Aktivität</span><select id="x_type" data-ch="xtype">' + EXT.map((e, i) => '<option value="' + i + '">' + e[0] + '</option>').join('') + '</select></label>' +
      '<label class="field"><span>Dauer (Minuten)</span><input type="number" inputmode="numeric" id="x_min" min="1" max="600" value="60"></label>' +
      '<label class="field"><span>Anstrengung (0–10): <b id="x_rv">5</b></span><input type="range" id="x_rpe" min="0" max="10" value="5" style="width:100%" data-in="xrpe"><div class="tiny muted">0 = Ruhe, 3 = moderat, 5 = anstrengend, 7 = sehr anstrengend, 10 = maximal (Skala nach Foster)</div></label>' +
      '<div class="switch"><div><div class="bold">Zählt als Ausdaueraktivität</div><div class="small muted">Puls deutlich erhöht, durchgehend in Bewegung</div></div><label class="tgl"><input type="checkbox" id="x_aer" checked><i></i></label></div>' +
      '<button class="btn primary big block mt16" data-act="savext">Speichern</button>'
  }));
  C.xtype = v => { $('#x_aer').checked = EXT[+v][1]; };
  I.xrpe = v => { $('#x_rv').textContent = v; };
  H.savext = () => {
    const min = parseInt($('#x_min').value, 10);
    if (!(min > 0)) return toast('Bitte die Dauer eingeben');
    const now = new Date();
    S.history.push({ id: uid(), date: dkey(now), ts: now.getTime(), sid: 'ext', name: EXT[+$('#x_type').value][0], kind: 'ext', dur: min * 60, sets: [], vol: 0, prs: 0, rpe: +$('#x_rpe').value, aer: $('#x_aer').checked });
    save(); H.sheetclose(); render(); toast('Aktivität gespeichert');
  };

  /* ---- Fortschritt ---- */
  const PG = { tab: 'overview', ex: null };
  V.prog = function () {
    let h = '<div class="page-head"><div><div class="sub">Deine Daten</div><h1>Fortschritt</h1></div></div><div class="seg">' + [['overview', 'Übersicht'], ['coach', 'Coach'], ['ex', 'Übungen'], ['body', 'Körper'], ['check', 'Check']].map(t => '<button class="' + (PG.tab === t[0] ? 'on' : '') + '" data-act="pgtab" data-t="' + t[0] + '">' + t[1] + '</button>').join('') + '</div>';
    return h + PGV[PG.tab]();
  };
  H.pgtab = d => { PG.tab = d.t; render(); };
  const PGV = {};
  PGV.overview = function () {
    const hs = S.history, totalMin = hs.reduce((s, h) => s + h.dur, 0) / 60, vol = hs.reduce((s, h) => s + (h.vol || 0), 0);
    if (!hs.length) return '<div class="card empty"><b>Noch keine Trainings</b>Starte dein erstes Workout – danach siehst du hier deine Entwicklung.</div>';
    const wc = weekCounts(8);
    let h = '<div class="stats"><div class="stat"><div class="v">' + hs.length + '</div><div class="l">Workouts</div></div><div class="stat"><div class="v">' + streakWeeks() + '</div><div class="l">Wochen-Serie</div></div><div class="stat"><div class="v">' + (totalMin >= 60 ? rnd1(totalMin / 60) : Math.round(totalMin)) + '</div><div class="l">' + (totalMin >= 60 ? 'Stunden' : 'Minuten') + '</div></div></div>';
    h += '<div class="stats mt12"><div class="stat"><div class="v">' + (vol >= 1000 ? rnd1(vol / 1000) + 't' : Math.round(vol)) + '</div><div class="l">Gehoben' + (vol >= 1000 ? '' : ' (kg)') + '</div></div><div class="stat"><div class="v">' + hs.reduce((s, x) => s + x.sets.length, 0) + '</div><div class="l">Sätze</div></div><div class="stat"><div class="v">' + hs.reduce((s, x) => s + (x.prs || 0), 0) + '</div><div class="l">Bestwerte</div></div></div>';
    h += '<div class="section-title">Workouts pro Woche</div><div class="card">' + barChart(wc.map(w => w.n), wc.map(w => addDays(w.start, 0).getDate() + '.' + (w.start.getMonth() + 1)), 130) + '<div class="tiny muted center">Wochenziel: ' + S.settings.goal + ' Einheiten</div></div>';
    h += '<div class="section-title">Aktivität · 12 Wochen</div><div class="card"><div class="heat">';
    const m0 = addDays(mondayOf(new Date()), -77), tk = dkey(new Date());
    for (let i = 0; i < 84; i++) { const d = addDays(m0, i), k = dkey(d), n = hs.filter(x => x.date === k).length; h += '<i class="' + (n >= 2 ? 'l2' : n ? 'l1' : '') + (k > tk ? ' fut' : '') + (k === tk ? ' td' : '') + '" title="' + fmtDate(k) + '"></i>'; }
    h += '</div></div><div class="section-title">Verlauf</div><div class="card list">' + hs.slice().sort((a, b) => b.ts - a.ts).slice(0, 30).map(x => '<button class="item" data-act="histdetail" data-id="' + x.id + '">' + kindBadge(x.kind || 'strength') + '<div class="grow"><div class="t">' + esc(x.name) + (x.prs ? ' <span class="chip warn">' + x.prs + ' Bestwert' + (x.prs > 1 ? 'e' : '') + '</span>' : '') + '</div><div class="s">' + fmtDate(x.date, { weekday: 'short', day: 'numeric', month: 'short' }) + ' · ' + fmtMin(x.dur) + ' · ' + x.sets.length + ' Sätze</div></div>' + icon('chev', 'chev') + '</button>').join('') + '</div>';
    return h;
  };
  H.histdetail = d => openSheet(() => {
    const x = S.history.find(h => h.id === d.id);
    if (!x) return { title: 'Training', body: '' };
    const by = []; x.sets.forEach(s => { let g = by.find(b => b.ex === s.ex); if (!g) { g = { ex: s.ex, sets: [] }; by.push(g); } g.sets.push(s); });
    let b = '<div class="chips"><span class="chip">' + fmtDate(x.date, { weekday: 'long', day: 'numeric', month: 'long' }) + '</span><span class="chip">' + icon('clock') + ' ' + fmtMin(x.dur) + '</span>' + (x.rpe ? '<span class="chip">Anstrengung ' + x.rpe + '/10</span>' : '') + (x.vol ? '<span class="chip">' + Math.round(x.vol) + ' kg Volumen</span>' : '') + '</div>';
    if (x.note) b += '<div class="tip">' + esc(x.note) + '</div>';
    by.forEach(g => { const e = EXMAP[g.ex]; b += '<div class="blk">' + esc(e ? e.name : g.ex) + '</div>' + g.sets.map(s => '<div class="small" style="padding:3px 0">' + (s.side ? (s.side === 'L' ? 'Links · ' : 'Rechts · ') : '') + (s.w ? rnd1(s.w) + ' kg × ' : '') + (s.t ? s.t + ' s' : (s.r || 0) + ' Wdh.') + '</div>').join(''); });
    b += '<button class="btn block danger mt16" data-act="histdel" data-id="' + x.id + '">' + icon('trash') + ' Training löschen</button>';
    return { title: esc(x.name), body: b };
  });
  H.histdel = d => confirmSheet('Training löschen?', 'Das Workout wird dauerhaft aus deinem Verlauf entfernt.', [{ label: 'Löschen', cls: 'danger', fn: () => { S.history = S.history.filter(h => h.id !== d.id); save(); H.sheetclose(); render(); } }, { label: 'Abbrechen' }]);

  PGV.ex = function () {
    const done = {}; S.history.forEach(h => h.sets.forEach(s => { done[s.ex] = 1; }));
    const ids = EX.filter(e => done[e.id]);
    if (!ids.length) return '<div class="card empty"><b>Noch keine Daten</b>Sobald du Sätze erfasst hast, siehst du hier den Verlauf pro Übung.</div>';
    if (!PG.ex || !done[PG.ex]) PG.ex = ids[0].id;
    const e = EXMAP[PG.ex], pts = [];
    S.history.slice().sort((a, b) => a.ts - b.ts).forEach(h => { const s = h.sets.filter(x => x.ex === PG.ex); if (s.length) { const b = bestOf(s); pts.push({ t: h.ts, v: rnd1(e.track === 'wr' ? (b.e1 || b.reps) : e.track === 'r' ? b.reps : e.track === 'wt' ? (b.w || b.t) : b.t) }); } });
    const prs = ids.map(x => { const all = []; S.history.forEach(h => h.sets.forEach(s => { if (s.ex === x.id) all.push(s); })); const b = bestOf(all); return { e: x, b }; });
    return '<label class="field"><span>Übung</span><select data-ch="pgex">' + ids.map(x => '<option value="' + x.id + '"' + (x.id === PG.ex ? ' selected' : '') + '>' + esc(x.name) + '</option>').join('') + '</select></label><div class="card"><div class="bold">' + esc(e.name) + '</div><div class="tiny muted">' + (e.track === 'wr' ? 'Geschätztes 1RM (kg) pro Training' : e.track === 'r' ? 'Beste Wiederholungen pro Training' : e.track === 'wt' ? 'Gewicht (kg) bzw. Zeit (s)' : 'Beste Haltezeit (s)') + '</div>' + lineChart(pts, '') + '</div><div class="section-title">Persönliche Bestwerte</div><div class="card list">' + prs.map(p => '<div class="tr"><div>' + esc(p.e.name) + '</div><div class="bold">' + (p.e.track === 'wr' && p.b.w > 0 ? rnd1(p.b.w) + ' kg' : p.e.track === 'r' || p.e.track === 'wr' ? p.b.reps + ' Wdh.' : p.b.t + ' s' + (p.b.w ? ' · ' + rnd1(p.b.w) + ' kg' : '')) + '</div><div></div></div>').join('') + '</div>';
  };
  C.pgex = v => { PG.ex = v; render(); };

  PGV.body = function () {
    const b = S.body.slice().sort((a, c) => a.date.localeCompare(c.date));
    let h = '<div class="card"><div class="bold">Neuer Eintrag</div><div class="row mt12" style="gap:10px;align-items:flex-end"><label class="field grow" style="margin:0"><span>Gewicht (kg)</span><input type="number" inputmode="decimal" step="0.1" id="bw" placeholder="z. B. 78.5"></label><label class="field grow" style="margin:0"><span>Taille (cm)</span><input type="number" inputmode="decimal" step="0.5" id="bwa" placeholder="optional"></label></div><button class="btn primary block mt12" data-act="bodyadd">Speichern</button></div>';
    const wp = b.filter(x => x.weight).map(x => ({ t: parseKey(x.date).getTime(), v: x.weight }));
    if (wp.length) h += '<div class="section-title">Körpergewicht</div><div class="card">' + lineChart(wp, 'kg') + '</div>';
    const ws = b.filter(x => x.waist).map(x => ({ t: parseKey(x.date).getTime(), v: x.waist }));
    if (ws.length) h += '<div class="section-title">Taillenumfang</div><div class="card">' + lineChart(ws, 'cm') + '</div>';
    if (b.length) h += '<div class="section-title">Einträge</div><div class="card list">' + b.slice().reverse().map(x => '<div class="tr"><div>' + fmtDate(x.date, { day: 'numeric', month: 'short', year: 'numeric' }) + '</div><div class="bold">' + (x.weight ? x.weight + ' kg' : '') + (x.waist ? ' · ' + x.waist + ' cm' : '') + '</div><button class="iconbtn" data-act="bodydel" data-d="' + x.date + '" data-w="' + (x.weight || 0) + '" aria-label="Löschen">' + icon('trash') + '</button></div>').join('') + '</div>';
    return h;
  };
  H.bodyadd = () => {
    const w = parseFloat($('#bw').value), c = parseFloat($('#bwa').value);
    if (!(w > 0) && !(c > 0)) return toast('Bitte einen Wert eingeben');
    const k = dkey(new Date()); let e = S.body.find(x => x.date === k);
    if (!e) { e = { date: k }; S.body.push(e); }
    if (w > 0) e.weight = rnd1(w); if (c > 0) e.waist = rnd1(c);
    save(); render(); toast('Gespeichert');
  };
  H.bodydel = d => { S.body = S.body.filter(x => x.date !== d.d); save(); render(); };

  PGV.check = function () {
    const ts = S.tests.slice().sort((a, b) => a.date.localeCompare(b.date)), first = ts[0], last = ts[ts.length - 1];
    let h = '<div class="card"><div class="bold">Körper-Check</div><p class="small muted mt8">Misst Gleichgewicht, Beweglichkeit und Rumpfkraft. Wiederhole den Test in regelmässigen Abständen (z. B. alle 4 Wochen), um Veränderungen zu vergleichen.</p>' + (last ? '<div class="small mt8">Letzter Check: <b>' + fmtDate(last.date, { day: 'numeric', month: 'long' }) + '</b>' + (daysBetween(parseKey(last.date), new Date()) >= 28 ? ' · <span class="delta up">Zeit für einen neuen Check</span>' : '') + '</div>' : '') + '<button class="btn primary block mt12" data-act="newcheck">' + (last ? 'Neuen Check durchführen' : 'Ersten Check durchführen') + '</button></div>';
    if (!last) return h;
    h += '<div class="section-title">Ergebnisse</div><div class="card list">';
    TESTS.forEach(t => {
      const v = last.vals[t.id]; if (v == null) return;
      const f = first.vals[t.id]; let d = '';
      if (ts.length > 1 && f != null && f !== v) { const diff = rnd1(v - f), good = t.better === 'high' ? diff > 0 : diff < 0; d = '<span class="delta ' + (good ? 'up' : 'down') + '">' + (diff > 0 ? '+' : '') + diff + '</span>'; }
      h += '<div class="tr"><div>' + esc(t.name) + '</div><div class="bold">' + v + ' ' + t.unit + '</div><div style="min-width:36px;text-align:right">' + d + '</div></div>';
    });
    h += '</div>';
    const warn = [['stand_l', 'stand_r', 'Einbeinstand'], ['rot_l', 'rot_r', 'Rumpfrotation'], ['side_l', 'side_r', 'Seitstütz'], ['stand_closed_l', 'stand_closed_r', 'Einbeinstand (Augen zu)']].map(p => { const a = last.vals[p[0]], b = last.vals[p[1]]; if (a == null || b == null || !Math.max(a, b)) return ''; const diff = Math.abs(a - b) / Math.max(a, b); return diff >= .2 ? '<li>' + p[2] + ': links ' + a + ' · rechts ' + b + ' (' + Math.round(diff * 100) + ' % Unterschied)</li>' : ''; }).join('');
    if (warn) h += '<div class="tip" style="margin-top:12px"><b>Unterschiede links/rechts (ab 20 %)</b><ul class="cues">' + warn + '</ul><div class="small muted">Seitenunterschiede kommen vor und sind kein Befund. Die App stellt keine Diagnose.</div></div>';
    ['stand_l', 'plank', 'reach'].forEach(id => { const t = TESTS.find(x => x.id === id), pts = ts.filter(x => x.vals[id] != null).map(x => ({ t: parseKey(x.date).getTime(), v: x.vals[id] })); if (pts.length > 1) h += '<div class="section-title">' + esc(t.name) + '</div><div class="card">' + lineChart(pts, t.unit) + '</div>'; });
    return h;
  };
  H.newcheck = () => openSheet(() => ({
    title: 'Körper-Check', body: '<p class="small muted">Trage nur ein, was du getestet hast. Leere Felder werden übersprungen.</p>' + TESTS.map(t => '<label class="field mt12"><span>' + esc(t.name) + ' (' + t.unit + ')</span>' + (t.rating ? '<select id="t_' + t.id + '"><option value="">–</option>' + [1, 2, 3, 4, 5].map(n => '<option>' + n + '</option>').join('') + '</select>' : '<input type="number" inputmode="decimal" step="0.5" id="t_' + t.id + '">') + '<div class="tiny muted" style="margin-top:4px">' + esc(t.hint) + '</div></label>').join('') + '<button class="btn primary big block" data-act="savecheck">Speichern</button>'
  }));
  H.savecheck = () => {
    const vals = {}; TESTS.forEach(t => { const raw = $('#t_' + t.id).value; if (raw !== '' && !isNaN(parseFloat(raw))) vals[t.id] = parseFloat(raw); });
    if (!Object.keys(vals).length) return toast('Bitte mindestens einen Wert eingeben');
    const k = dkey(new Date()), ex = S.tests.find(x => x.date === k);
    if (ex) ex.vals = Object.assign(ex.vals, vals); else S.tests.push({ date: k, vals });
    save(); H.sheetclose(); render(); toast('Check gespeichert');
  };

  /* ---- Profil ---- */
  V.me = function () {
    const s = S.settings, bytes = (localStorage.getItem(KEY) || '').length;
    return '<div class="page-head"><div><div class="sub">Einstellungen</div><h1>Profil</h1></div></div>' +
      '<div class="card"><label class="field"><span>Name</span><input type="text" data-in="name" value="' + esc(s.name) + '" placeholder="Dein Name" maxlength="30"></label>' +
      '<div class="field" style="margin:0"><span>Wochenziel (Einheiten)</span><div class="stepper"><button data-act="goal" data-d="-1" aria-label="weniger">−</button><input type="text" readonly value="' + s.goal + '" aria-label="Wochenziel"><button data-act="goal" data-d="1" aria-label="mehr">+</button></div></div></div>' +
      '<div class="section-title">Darstellung & Verhalten</div><div class="card"><label class="field"><span>Design</span><select data-ch="theme"><option value="auto"' + (s.theme === 'auto' ? ' selected' : '') + '>Automatisch</option><option value="light"' + (s.theme === 'light' ? ' selected' : '') + '>Hell</option><option value="dark"' + (s.theme === 'dark' ? ' selected' : '') + '>Dunkel</option></select></label>' +
      [['sound', 'Signaltöne', 'Countdown und Pausenende'], ['vibrate', 'Vibration', 'Bei Pausenende (nicht auf iPhone)'], ['wake', 'Bildschirm anlassen', 'Während des Trainings']].map(t => '<div class="switch"><div><div class="bold">' + t[1] + '</div><div class="small muted">' + t[2] + '</div></div><label class="tgl"><input type="checkbox" data-ch="tg" data-k="' + t[0] + '"' + (s[t[0]] ? ' checked' : '') + '><i></i></label></div>').join('') + '</div>' +
      '<div class="section-title">Daten</div><div class="card"><p class="small muted">Alle Daten liegen nur auf diesem Gerät (' + Math.max(1, Math.round(bytes / 1024)) + ' KB, ' + S.history.length + ' Trainings). Sichere sie regelmässig, besonders vor dem Löschen von Browserdaten.</p><div style="display:grid;gap:10px;margin-top:12px"><button class="btn block" data-act="exportjson">' + icon('download') + ' Backup exportieren (JSON)</button><button class="btn block" data-act="exportcsv">' + icon('download') + ' Trainingsdaten exportieren (CSV)</button><label class="btn block" style="cursor:pointer">Backup importieren<input type="file" accept="application/json,.json" data-ch="import" class="hide"></label><button class="btn block danger" data-act="resetall">Alle Daten löschen</button></div></div>' +
      '<div class="section-title">App</div><div class="card"><button class="item" style="padding:0;border:0" data-act="changelog"><div class="badge" style="background:var(--surface2);color:var(--accent2)">' + icon('info') + '</div><div class="grow"><div class="t">Update-Historie</div><div class="s">Version ' + VERSION + ' · ' + fmtDate(CHANGELOG[0].date, { day: 'numeric', month: 'long', year: 'numeric' }) + '</div></div>' + icon('chev', 'chev') + '</button><button class="item" data-act="checkupdate"><div class="badge" style="background:var(--surface2);color:var(--accent2)">' + icon('download') + '</div><div class="grow"><div class="t">Nach Updates suchen</div><div class="s">Die App aktualisiert sich automatisch</div></div>' + icon('chev', 'chev') + '</button></div>' +
      '<div class="section-title">Apple Health & Watch</div><div class="card"><div class="switch" style="padding-top:0"><div><div class="bold">Health-Eintrag nach Training</div><div class="small muted">Startet nach dem Speichern den Kurzbefehl „Winter-Fit Health“</div></div><label class="tgl"><input type="checkbox" data-ch="tg" data-k="health"' + (s.health ? ' checked' : '') + '><i></i></label></div><button class="btn block mt12" data-act="healthhelp">Einrichtung & Apple Watch</button></div>' +
      '<div class="section-title">Tipps</div><div class="card small muted"><p><b style="color:var(--text)">Als App installieren:</b> Safari → Teilen → „Zum Home-Bildschirm" (iPhone) oder Chrome → „App installieren" (Android). Danach funktioniert alles auch offline.</p><p class="mt8"><b style="color:var(--text)">Gewichte:</b> Langhantel-Übungen nur mit Ständer oder Hilfe laden. Wähle ein Gewicht, mit dem 2 saubere Wiederholungen übrig bleiben.</p><p class="mt8"><b style="color:var(--text)">Schmerz:</b> Bei stechenden Schmerzen abbrechen. Die App ersetzt keine ärztliche oder physiotherapeutische Beratung.</p></div>' +
      '<p class="tiny muted center mt16">Winter-Fit · Version ' + VERSION + '</p>';
  };
  I.name = v => { S.settings.name = v; save(); };
  H.goal = d => { S.settings.goal = Math.min(7, Math.max(1, S.settings.goal + +d.d)); save(); render(); };
  C.theme = v => { S.settings.theme = v; save(); applyTheme(); };
  C.tg = (v, el, d) => { S.settings[d.k] = v; save(); };
  function download(name, text, type) {
    const a = document.createElement('a'), url = URL.createObjectURL(new Blob([text], { type }));
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
  H.exportjson = () => download('winter-fit-backup-' + dkey(new Date()) + '.json', JSON.stringify(S, null, 2), 'application/json');
  H.exportcsv = () => {
    const rows = [['Datum', 'Workout', 'Übung', 'Satz', 'Seite', 'Gewicht_kg', 'Wiederholungen', 'Sekunden']];
    S.history.slice().sort((a, b) => a.ts - b.ts).forEach(h => h.sets.forEach(s => rows.push([h.date, h.name, (EXMAP[s.ex] || { name: s.ex }).name, s.set, s.side || '', s.w || '', s.r || '', s.t || ''])));
    download('winter-fit-training-' + dkey(new Date()) + '.csv', '﻿' + rows.map(r => r.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(';')).join('\n'), 'text/csv');
  };
  C.import = (v, el) => {
    const f = el.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const o = JSON.parse(r.result);
        if (!o || !Array.isArray(o.history)) throw new Error('format');
        confirmSheet('Backup importieren?', 'Alle aktuellen Daten auf diesem Gerät werden durch das Backup ersetzt (' + o.history.length + ' Trainings).', [{ label: 'Importieren', fn: () => { const d = defaults(); S = Object.assign(d, o, { settings: Object.assign(d.settings, o.settings || {}) }); save(); applyTheme(); render(); toast('Backup importiert'); } }, { label: 'Abbrechen' }]);
      } catch (e) { toast('Datei ist kein gültiges Backup'); }
      el.value = '';
    };
    r.readAsText(f);
  };
  H.resetall = () => confirmSheet('Wirklich alles löschen?', 'Trainings, Messwerte und eigene Workouts werden unwiderruflich entfernt. Erstelle vorher ein Backup.', [{ label: 'Alles löschen', cls: 'danger', fn: () => { S = defaults(); save(); applyTheme(); render(); toast('Daten gelöscht'); } }, { label: 'Abbrechen' }]);

  /* ---- Apple Health & Watch ---- */
  H.healthhelp = () => openSheet(() => ({
    title: 'Apple Health & Watch', body:
      '<p class="small muted">Eine Web-App darf Apple Health nicht direkt beschreiben. Mit einem Kurzbefehl (einmalig, ca. 2 Minuten) trägt Winter-Fit trotzdem jedes Training als Workout in Health ein – es erscheint dann auch in der Fitness-App und in deinen Aktivitätsringen.</p>' +
      '<div class="blk">Einrichtung auf dem iPhone</div><ol class="cues"><li>App <b>Kurzbefehle</b> öffnen, oben rechts <b>+</b> tippen.</li><li>Namen des Kurzbefehls: <b>Winter-Fit Health</b> (genau so).</li><li>Aktion <b>Training protokollieren</b> hinzufügen. Art: z. B. <b>Funktionelles Krafttraining</b>.</li><li>Dauer antippen → Variable <b>Kurzbefehl-Eingabe</b> wählen, Einheit <b>Minuten</b>.</li><li>Fertig. In Winter-Fit unter Profil den Schalter <b>Health-Eintrag nach Training</b> aktivieren.</li></ol>' +
      '<div class="tip">Beim ersten Mal fragt iOS nach der Erlaubnis, Daten in Health zu schreiben und den Kurzbefehl zu öffnen. Nach dem Eintrag wechselst du per Wischgeste zurück zu Winter-Fit.</div>' +
      '<div class="blk">Apple Watch</div><ul class="cues"><li><b>Herzfrequenz & Kalorien:</b> Starte parallel zum Training die Workout-App auf der Watch (z. B. „Krafttraining“) und beende sie am Ende. Dann schaltest du den Health-Eintrag besser aus, damit nichts doppelt gezählt wird.</li><li><b>Kurzbefehl auf der Watch:</b> Du kannst „Winter-Fit Health“ auch aus der Kurzbefehle-App der Watch starten, falls du ein Training nachtragen willst.</li><li>Eine eigene Winter-Fit-App auf der Watch ist als Web-App nicht möglich. Dafür wäre eine native iOS-/watchOS-App nötig.</li></ul>'
  }));

  /* ---- Automatische Updates ---- */
  let swReg = null, pendingVer = null, updating = false;
  const ss = { get: k => { try { return sessionStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { sessionStorage.setItem(k, v); } catch (e) { /* ignorieren */ } } };
  async function remoteVersion() {
    const r = await fetch('data.js?_=' + Date.now(), { cache: 'no-store' });
    const m = (await r.text()).match(/const VERSION = '([^']+)'/);
    return m ? m[1] : null;
  }
  const busy = () => !!R || $('#screen').classList.contains('open');
  function applyUpdate() {
    if (!pendingVer || updating || busy()) return;
    updating = true; toast('Update ' + pendingVer + ' wird geladen …');
    const reload = () => location.reload();
    if (swReg && navigator.serviceWorker) { navigator.serviceWorker.addEventListener('controllerchange', reload, { once: true }); swReg.update().catch(() => {}); setTimeout(reload, 5000); }
    else setTimeout(reload, 600);
  }
  async function checkUpdate(manual) {
    try {
      const v = await remoteVersion();
      if (v && v !== VERSION) {
        if (!manual && ss.get('wf.try') === v) return; // Schleifenschutz
        ss.set('wf.try', v); pendingVer = v;
        if (busy()) toast('Update ' + v + ' bereit – wird nach dem Training geladen'); else applyUpdate();
      } else if (manual) toast('Du hast die neueste Version (' + VERSION + ')');
    } catch (e) { if (manual) toast('Keine Verbindung – Update-Suche nicht möglich'); }
  }
  H.checkupdate = () => { toast('Suche nach Updates …'); checkUpdate(true); };
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') checkUpdate(false); });
  setInterval(() => { if (document.visibilityState === 'visible') checkUpdate(false); }, 30 * 60 * 1000);

  /* ================= Coach (nur Regeln mit Quelle) ================= */
  const RES_CATS = ['uk', 'push', 'pull', 'core', 'rot'], STRENGTH_MIN_SETS = 6;
  const resSets = sets => sets.filter(x => EXMAP[x.ex] && RES_CATS.includes(EXMAP[x.ex].cat)).length;
  const GROUPS = [['uk', 'Beine & Gesäss'], ['push', 'Drücken (Brust, Schulter)'], ['pull', 'Ziehen (Rücken)'], ['core', 'Rumpf & Rotation'], ['mob', 'Mobilität'], ['bal', 'Balance & Kontrolle']];
  const f1 = v => (Math.round(v * 10) / 10).toLocaleString('de-CH');
  const loadOf = h => (h.rpe == null ? 5 : h.rpe) * h.dur / 60; // Session-RPE: Anstrengung x Minuten (Foster 2001)

  function coachData() {
    const t = new Date(), dk = i => dkey(addDays(t, -i)), hs = S.history;
    const load = {}, res = {}, aer = {}, any = {}, grp = {};
    let condMin14 = 0;
    hs.forEach(h => {
      const k = h.date; load[k] = (load[k] || 0) + loadOf(h); any[k] = 1;
      const rs = resSets(h.sets); if (rs) res[k] = (res[k] || 0) + rs;
      if (h.kind === 'cond' || (h.kind === 'ext' && h.aer)) aer[k] = (aer[k] || 0) + h.dur / 60;
    });
    const sum = (o, a, b) => { let x = 0; for (let i = a; i <= b; i++) x += o[dk(i)] || 0; return x; };
    for (let i = 0; i < 14; i++) hs.filter(h => h.date === dk(i)).forEach(h => {
      h.sets.forEach(x => { const e = EXMAP[x.ex]; if (e) { const g = e.cat === 'rot' ? 'core' : e.cat; grp[g] = (grp[g] || 0) + 1; } });
      if (h.kind === 'cond') condMin14 += h.dur / 60;
    });
    const acute = sum(load, 0, 6), chronic = (acute + sum(load, 7, 13) + sum(load, 14, 20) + sum(load, 21, 27)) / 4;
    const first = hs.length ? hs.reduce((m, h) => h.date < m ? h.date : m, hs[0].date) : null, span = first ? daysBetween(parseKey(first), t) : 0;
    const acwr = (span >= 27 && chronic > 0) ? acute / chronic : null;
    const dl = []; for (let i = 6; i >= 0; i--) dl.push(load[dk(i)] || 0);
    const trainDays = dl.filter(x => x > 0).length, mean = dl.reduce((a, b) => a + b, 0) / 7;
    const sd = Math.sqrt(dl.reduce((a, b) => a + (b - mean) * (b - mean), 0) / 6);
    const mono = (span >= 6 && trainDays >= 3 && sd > 0) ? mean / sd : null;
    const strengthDays = []; for (let i = 0; i < 14; i++) strengthDays.push((res[dk(i)] || 0) >= STRENGTH_MIN_SETS);
    const sd7 = strengthDays.slice(0, 7).filter(Boolean).length;
    let consec = null; for (let i = 0; i < 13; i++) if (strengthDays[i] && strengthDays[i + 1]) { consec = [dk(i + 1), dk(i)]; break; }
    const last3 = hs.slice().sort((a, b) => b.ts - a.ts).slice(0, 3);
    const lastDate = hs.length ? hs.reduce((m, h) => h.date > m ? h.date : m, hs[0].date) : null;
    return { acute, chronic, acwr, mono, strain: mono ? acute * mono : null, trainDays, restDays: 7 - trainDays, strengthDays7: sd7, consec, aerMin7: sum(aer, 0, 6), grp, condMin14, span, last3, daysSince: lastDate ? daysBetween(parseKey(lastDate), t) : null, hasResistance14: strengthDays.some(Boolean), n28: hs.filter(h => daysBetween(parseKey(h.date), t) < 28).length };
  }
  function progression() {
    const byEx = {};
    S.history.slice().sort((a, b) => a.ts - b.ts).forEach(h => {
      const g = {};
      h.sets.forEach(x => { const e = EXMAP[x.ex]; if (e && e.track === 'wr' && x.tg > 0 && x.w > 0) (g[x.ex] = g[x.ex] || []).push(x); });
      Object.keys(g).forEach(ex => (byEx[ex] = byEx[ex] || []).push(g[ex]));
    });
    const out = {};
    Object.keys(byEx).forEach(ex => {
      const L = byEx[ex]; if (L.length < 2) return;
      const a = L[L.length - 2], b = L[L.length - 1], wa = Math.max.apply(null, a.map(x => x.w)), wb = Math.max.apply(null, b.map(x => x.w));
      if (wa !== wb) return;
      const ok = arr => arr.filter(x => x.w === wa).every(x => x.r >= x.tg + 2);
      if (ok(a) && ok(b)) { const lo = Math.max(wa + .5, Math.round(wa * 1.02 * 2) / 2), hi = Math.max(lo, Math.round(wa * 1.10 * 2) / 2); out[ex] = { w: wa, lo, hi }; }
    });
    return out;
  }
  const LV = { warn: ['Achtung', 0], tip: ['Hinweis', 1], info: ['Info', 2] };
  function hintCard(hn) {
    return '<div class="hint ' + hn.level + '"><div class="row" style="gap:8px"><span class="chip ' + (hn.level === 'warn' ? 'warn' : hn.level === 'tip' ? 'accent' : '') + '">' + LV[hn.level][0] + '</span><div class="bold grow">' + esc(hn.title) + '</div></div><div class="small mt8">' + esc(hn.text) + '</div>' +
      (hn.refs && hn.refs.length ? '<div class="tiny muted mt8">Quelle: ' + hn.refs.map(r => '<button class="refchip" data-act="sources">' + SOURCES[r].short + '</button>').join(' ') + '</div>' : '') + '</div>';
  }
  function coachHints() {
    const out = [];
    if (!S.history.length) return out;
    const c = coachData();
    if (c.acwr != null) {
      const v = f1(c.acwr), base = 'Akut:Chronisch-Verhältnis ' + v + ' (Belastung der letzten 7 Tage gegenüber dem Wochenschnitt der letzten 4 Wochen). ';
      if (c.acwr >= 1.5) out.push({ level: 'warn', title: 'Belastung deutlich über deinem Durchschnitt', text: base + 'In Studien mit Teamsportlern ging ein Verhältnis ab etwa 1,5 mit einem höheren Verletzungsrisiko einher. Das Modell ist umstritten; nimm es als Orientierung. Eine mögliche Reaktion ist, die Belastung der nächsten Tage zu senken.', refs: ['gab', 'imp'] });
      else if (c.acwr > 1.3) out.push({ level: 'tip', title: 'Belastung über deinem Durchschnitt', text: base + 'Als günstiger Bereich gelten 0,8–1,3; du liegst darüber. Beobachte, wie du dich erholst.', refs: ['gab', 'imp'] });
      else if (c.acwr < 0.8) out.push({ level: 'info', title: 'Belastung unter deinem Durchschnitt', text: base + 'Der Wert liegt unter 0,8. Das ist normal in einer Entlastungswoche oder nach einer Pause.', refs: ['gab', 'imp'] });
      else out.push({ level: 'info', title: 'Belastung im günstigen Bereich', text: base + 'Der Wert liegt zwischen 0,8 und 1,3.', refs: ['gab', 'imp'] });
    }
    if (c.mono != null && c.mono > 2) out.push({ level: 'warn', title: 'Monotones Training in den letzten 7 Tagen', text: 'Monotonie ' + f1(c.mono) + ': Deine Tagesbelastung schwankt wenig. Studien an Athleten (Foster 1998, 2001) brachten Werte über 2,0 mit häufigeren Krankheiten und Übertraining in Verbindung. Foster empfiehlt, harte und leichte Tage zu variieren; ein freier Tag senkt den Wert.', refs: ['fos98', 'fos01'] });
    if (c.restDays === 0) out.push({ level: 'tip', title: 'Kein freier Tag in den letzten 7 Tagen', text: 'Du hast an allen 7 Tagen trainiert. Gleichförmige Belastung ohne Abwechslung erhöht die Monotonie (Foster 2001). Plane leichte oder freie Tage ein.', refs: ['fos01'] });
    if (c.span >= 6 && c.strengthDays7 < 2) out.push({ level: 'tip', title: 'Weniger als 2 Krafttage in 7 Tagen', text: 'Du hattest ' + c.strengthDays7 + ' Krafttag(e). Die WHO empfiehlt muskelkräftigende Aktivität an mindestens 2 Tagen pro Woche (als Krafttag zählt hier eine Einheit mit mindestens ' + STRENGTH_MIN_SETS + ' Kräftigungssätzen).', refs: ['who'] });
    if (c.consec) out.push({ level: 'tip', title: 'Krafteinheiten an aufeinanderfolgenden Tagen', text: 'Am ' + fmtDate(c.consec[0]) + ' und ' + fmtDate(c.consec[1]) + ' hast du Kraft trainiert. Der ACSM nennt 48–72 Stunden Pause für dieselbe Muskelgruppe. Bei Ganzkörper-Einheiten betrifft das alle Gruppen.', refs: ['acsm'] });
    if (c.hasResistance14) {
      const miss = GROUPS.slice(0, 4).filter(g => !c.grp[g[0]]).map(g => g[1]);
      if (miss.length) out.push({ level: 'tip', title: 'Muskelgruppen ohne Training (14 Tage)', text: 'Nicht trainiert: ' + miss.join(', ') + '. Die WHO empfiehlt, alle grossen Muskelgruppen zu kräftigen.', refs: ['who'] });
    }
    if (c.last3.length === 3 && c.last3.every(h => h.rpe >= 9)) out.push({ level: 'tip', title: 'Dreimal in Folge sehr hohe Anstrengung', text: 'Deine letzten 3 Einheiten lagen bei einer Anstrengung von 9–10 von 10. Foster empfiehlt, harte Einheiten mit leichten abzuwechseln.', refs: ['fos01'] });
    if (c.daysSince != null && c.daysSince >= 7) out.push({ level: 'info', title: 'Seit ' + c.daysSince + ' Tagen kein Training erfasst', text: 'Nach einer Pause die Belastung schrittweise wieder steigern; der ACSM beschreibt eine progressive Laststeigerung.', refs: ['acsm'] });
    const pg = progression(), ids = Object.keys(pg);
    if (ids.length) out.push({ level: 'tip', title: 'Bereit für mehr Gewicht', text: ids.slice(0, 4).map(id => EXMAP[id].name + ': aktuell ' + f1(pg[id].w) + ' kg → ca. ' + f1(pg[id].lo) + '–' + f1(pg[id].hi) + ' kg').join(' · ') + '. Der ACSM nennt eine Steigerung um 2–10 %, wenn die geplanten Wiederholungen in zwei Einheiten in Folge um 1–2 übertroffen wurden.', refs: ['acsm'] });
    return out.sort((a, b) => LV[a.level][1] - LV[b.level][1]);
  }
  function planHints(week, ph) {
    const out = [], ss = week.map(id => id ? getSession(id) : null);
    const res = ss.map(x => x ? buildSteps(x, ph, false).filter(st => RES_CATS.includes(EXMAP[st.ex].cat)).length : 0), sd = res.map(n => n >= STRENGTH_MIN_SETS), nS = sd.filter(Boolean).length;
    const DAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
    if (nS < 2) out.push({ level: 'warn', title: 'Weniger als 2 Krafttage', text: 'Der Plan enthält ' + nS + ' Krafttag(e). Die WHO empfiehlt muskelkräftigende Aktivität an mindestens 2 Tagen pro Woche (als Krafttag zählt hier eine Einheit mit mindestens ' + STRENGTH_MIN_SETS + ' Kräftigungssätzen).', refs: ['who'] });
    for (let i = 0; i < 7; i++) if (nS > 1 && sd[i] && sd[(i + 1) % 7]) { out.push({ level: 'tip', title: 'Krafttage direkt hintereinander', text: DAYS[i] + ' und ' + DAYS[(i + 1) % 7] + ' sind beides Krafttage. Der ACSM nennt 48–72 Stunden Pause für dieselbe Muskelgruppe.', refs: ['acsm'] }); break; }
    if (week.every(Boolean)) out.push({ level: 'tip', title: 'Kein freier Tag im Plan', text: 'Plane mindestens einen leichten oder freien Tag ein. Gleichförmige Belastung ohne Abwechslung erhöht die Monotonie (Foster 2001).', refs: ['fos01'] });
    const cm = ss.reduce((n, x) => n + (x && x.kind === 'cond' ? sessMeta(x, ph, false).min : 0), 0);
    out.push({ level: 'info', title: 'Geplante Kondition: ' + cm + ' Min pro Woche', text: 'Die WHO empfiehlt 150–300 Min moderate oder 75–150 Min intensive Ausdaueraktivität pro Woche. Aktivitäten wie Fussball, Laufen oder zügiges Gehen zählen mit; trage sie unter „Heute“ ein.', refs: ['who'] });
    return out;
  }
  H.sources = () => pushSheet(() => ({ title: 'Quellen', body: '<p class="small muted">Alle Coach-Hinweise stützen sich auf diese Veröffentlichungen. Die Schwellenwerte stammen aus den Studien und sind Orientierung, keine Diagnose. Die App ersetzt keine ärztliche oder physiotherapeutische Beratung.</p>' + Object.keys(SOURCES).map(k => '<div class="card" style="box-shadow:none"><div class="bold">' + SOURCES[k].short + '</div><div class="small muted mt8">' + esc(SOURCES[k].full) + '</div></div>').join('') + '<div class="card" style="box-shadow:none"><div class="bold">Eigene Definitionen der App</div><div class="small muted mt8">Belastung = Anstrengung (0–10) × Minuten (Foster 2001). „Krafttag“ = Einheit mit mindestens ' + STRENGTH_MIN_SETS + ' Kräftigungssätzen. Monotonie = Mittelwert / Standardabweichung der Tagesbelastung der letzten 7 Tage. Akut = letzte 7 Tage, chronisch = Durchschnitt der letzten 4 Wochen.</div></div>' }));
  H.opencoach = () => { PG.tab = 'coach'; go('prog'); };

  PGV.coach = function () {
    const c = coachData(), hints = coachHints();
    const wk = []; const m0 = mondayOf(new Date());
    for (let i = 7; i >= 0; i--) { const a = dkey(addDays(m0, -7 * i)), b = dkey(addDays(m0, -7 * i + 6)); wk.push({ d: addDays(m0, -7 * i), v: S.history.filter(h => h.date >= a && h.date <= b).reduce((n, h) => n + loadOf(h), 0) }); }
    let h = '<div class="tip" style="margin-top:0">Der Coach rechnet mit veröffentlichten Methoden und Richtlinien. Jeder Hinweis nennt seine Quelle. Die Werte sind Orientierung, keine medizinische Beratung.</div>';
    h += '<div class="section-title">Hinweise</div>' + (hints.length ? hints.map(hintCard).join('') : '<div class="card empty"><b>Noch keine Hinweise</b>Trage Trainings ein; ab etwa einer Woche Daten werten die Regeln aus.</div>');
    h += '<div class="section-title">Belastung pro Woche</div><div class="card">' + barChart(wk.map(w => w.v), wk.map(w => w.d.getDate() + '.' + (w.d.getMonth() + 1)), 130) + '<div class="tiny muted center">Belastung = Anstrengung (0–10) × Minuten</div></div>';
    h += '<div class="section-title">Kennzahlen</div><div class="card list">' +
      [['Belastung letzte 7 Tage', Math.round(c.acute)], ['Ø Belastung pro Woche (4 Wochen)', Math.round(c.chronic)], ['Akut:Chronisch-Verhältnis', c.acwr != null ? f1(c.acwr) : 'ab 4 Wochen Daten'], ['Monotonie (7 Tage)', c.mono != null ? f1(c.mono) : 'mind. 3 Trainingstage'], ['Belastungsindex (Strain)', c.strain != null ? Math.round(c.strain) : '–'], ['Trainingstage (7 Tage)', c.trainDays + ' von 7'], ['Krafttage (7 Tage)', c.strengthDays7], ['Ausdauer-Minuten (7 Tage)', Math.round(c.aerMin7) + ' Min']].map(r => '<div class="tr" style="grid-template-columns:1fr auto"><div>' + r[0] + '</div><div class="bold">' + r[1] + '</div></div>').join('') + '</div>';
    const mx = Math.max(1, Math.max.apply(null, GROUPS.map(g => c.grp[g[0]] || 0)));
    h += '<div class="section-title">Verteilung (14 Tage, Sätze)</div><div class="card">' + GROUPS.map(g => '<div style="margin:8px 0"><div class="row small"><div class="grow">' + g[1] + '</div><b>' + (c.grp[g[0]] || 0) + '</b></div><div class="progress mt8"><div style="width:' + Math.round((c.grp[g[0]] || 0) / mx * 100) + '%"></div></div></div>').join('') + '<div class="small muted mt8">Kondition: ' + Math.round(c.condMin14) + ' Min in Konditions-Einheiten</div></div>';
    h += '<details class="cuebox"><summary>Was bedeuten die Werte?</summary><ul class="cues"><li><b>Akut:Chronisch</b>: Belastung der letzten 7 Tage geteilt durch den Wochenschnitt der letzten 4 Wochen. 0,8–1,3 gilt als günstig, ab etwa 1,5 war in Studien das Verletzungsrisiko höher (Gabbett 2016). Das Modell wird kritisiert (Impellizzeri 2020).</li><li><b>Monotonie</b>: Mittelwert geteilt durch Standardabweichung der Tagesbelastung. Hohe Werte (über 2,0) hingen bei Athleten mit Krankheit und Übertraining zusammen (Foster 1998, 2001).</li><li><b>Strain</b>: Wochenbelastung × Monotonie (Foster).</li></ul></details>';
    h += '<button class="btn block mt16" data-act="sources">Quellen anzeigen</button>';
    return h;
  };

  /* ---- Update-Historie ---- */
  function changelogBody() {
    return CHANGELOG.map((c, i) => '<div class="card" style="box-shadow:none"><div class="row"><div class="grow bold">' + esc(c.title) + '</div>' + (i === 0 ? '<span class="chip accent">aktuell</span>' : '') + '</div><div class="tiny muted">Version ' + esc(c.v) + ' · ' + fmtDate(c.date, { day: 'numeric', month: 'long', year: 'numeric' }) + '</div><ul class="cues">' + c.items.map(t => '<li>' + esc(t) + '</li>').join('') + '</ul></div>').join('');
  }
  H.changelog = () => openSheet(() => ({ title: 'Update-Historie', body: changelogBody() }));
  function announceUpdate() {
    const first = !S.history.length && !S.settings.seen && !S.body.length && !S.tests.length && !S.custom.length;
    if (S.settings.seen !== VERSION) {
      S.settings.seen = VERSION; save();
      if (!first) openSheet(() => ({ title: 'Neu in Version ' + VERSION, body: changelogBody() }));
    }
  }

  /* ================= Workout-Runner ================= */
  let R = null, wakeLock = null, audio = null;
  function beep(f, d) {
    if (!S.settings.sound) return;
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === 'suspended') audio.resume();
      const o = audio.createOscillator(), g = audio.createGain();
      o.frequency.value = f; o.type = 'sine'; g.gain.value = .18; o.connect(g); g.connect(audio.destination);
      o.start(); o.stop(audio.currentTime + d / 1000);
    } catch (e) { /* ignorieren */ }
  }
  const buzz = p => { if (S.settings.vibrate && navigator.vibrate) navigator.vibrate(p); };
  async function lockScreen() { try { if (S.settings.wake && navigator.wakeLock) wakeLock = await navigator.wakeLock.request('screen'); } catch (e) { /* ignorieren */ } }
  function unlockScreen() { try { if (wakeLock) wakeLock.release(); } catch (e) { /* ignorieren */ } wakeLock = null; }
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && R) lockScreen(); });

  H.start = d => {
    const sess = getSession(d.id), pl = curPlan();
    if (S.draft) return confirmSheet('Es gibt ein unterbrochenes Training', 'Möchtest du es verwerfen und das neue Training starten?', [{ label: 'Verwerfen & neu starten', cls: 'danger', fn: () => { S.draft = null; save(); H.start(d); } }, { label: 'Abbrechen' }]);
    const steps = buildSteps(sess, pl.ph, pl.deload && !sess.custom && !QUICK[d.id]);
    if (!steps.length) return toast('Dieses Workout hat keine Übungen');
    H.sheetclose();
    R = { sid: sess.id, name: sess.name, kind: sess.kind, steps, idx: 0, logs: [], active: 0, last: Date.now(), phase: 'work' };
    beep(1, 1);
    openRunner();
  };
  function resumeWorkout() {
    R = Object.assign({}, S.draft, { last: Date.now(), phase: 'work' });
    openRunner();
  }
  function openRunner() {
    R.prev = prevIndex(); R.prog = progression();
    $('#runner').classList.add('open'); lockScreen();
    initStep(); clearInterval(R.iv); R.iv = setInterval(tick, 200);
    drawRunner();
  }
  function closeRunner() {
    if (R) clearInterval(R.iv);
    R = null; unlockScreen(); $('#runner').classList.remove('open'); $('#runner').innerHTML = '';
    setTimeout(applyUpdate, 1500);
  }
  function stepEx() { return EXMAP[R.steps[R.idx].ex]; }
  function initStep() {
    const st = R.steps[R.idx], e = EXMAP[st.ex];
    const same = R.logs.slice().reverse().find(l => l.ex === st.ex), p = R.prev[st.ex];
    R.cur = { w: hasW(e) ? (same ? same.w : (p ? p.w : 0)) : 0, r: modeOf(st) === 'reps' ? (st.target || 0) : 0 };
    R.tm = modeOf(st) === 'timer' ? { state: 'idle', total: st.secs || st.target, left: (st.secs || st.target) * 1000 } : null;
    R.phase = 'work';
  }
  function persistDraft() { S.draft = { sid: R.sid, name: R.name, kind: R.kind, steps: R.steps, idx: R.idx, logs: R.logs, active: R.active }; save(); }
  function touch() { const n = Date.now(); R.active += Math.min((n - R.last) / 1000, 900); R.last = n; }

  function completeStep(forceT) {
    const st = R.steps[R.idx], e = EXMAP[st.ex], timer = modeOf(st) === 'timer';
    touch();
    const log = { ex: st.ex, set: st.set, block: st.block };
    if (st.side) log.side = st.side;
    if (hasW(e)) log.w = R.cur.w || 0;
    if (timer) { const tot = st.secs || st.target; log.t = forceT != null ? forceT : (R.tm && R.tm.state === 'run' ? Math.max(1, Math.round(tot - R.tm.left / 1000)) : tot); }
    else { log.r = R.cur.r || 0; log.tg = st.target || 0; }
    R.logs.push(log);
    advance(st.rest);
  }
  function skipStep() { touch(); advance(0); }
  function advance(rest) {
    if (R.idx >= R.steps.length - 1) { return finishWorkout(); }
    persistDraftNext(rest);
  }
  function persistDraftNext(rest) {
    if (rest > 0) { R.phase = 'rest'; R.rest = { end: Date.now() + rest * 1000, total: rest, beeped: 0 }; R.idx += 0; persistDraftAt(R.idx + 1); drawRunner(); }
    else { R.idx++; persistDraft(); initStep(); drawRunner(); }
  }
  function persistDraftAt(i) { const keep = R.idx; R.idx = i; persistDraft(); R.idx = keep; }
  function endRest() { R.idx++; initStep(); drawRunner(); }

  function finishWorkout() {
    touch(); R.phase = 'summary';
    R.prs = detectPRs(R.logs); R.rpe = 6; R.note = '';
    R.vol = R.logs.reduce((s, l) => s + (l.w || 0) * (l.r || 0), 0);
    drawRunner();
  }

  function tick() {
    if (!R) return;
    const now = Date.now();
    if (R.phase === 'rest') {
      const left = Math.ceil((R.rest.end - now) / 1000), el = $('#restText');
      if (left <= 3 && left > 0 && R.rest.beeped !== left) { R.rest.beeped = left; beep(660, 90); }
      if (left <= 0) { beep(990, 400); buzz([200, 80, 200]); endRest(); return; }
      if (el) { el.textContent = clock(left); setRing('#restRing', 1 - (R.rest.end - now) / (R.rest.total * 1000)); }
    } else if (R.phase === 'work' && R.tm) {
      const t = R.tm;
      if (t.state === 'pre') {
        const left = Math.ceil((t.end - now) / 1000);
        if (left <= 0) { t.state = 'run'; t.pb = null; t.end = now + t.total * 1000; t.left = t.total * 1000; beep(990, 300); buzz(100); drawRunner(); return; }
        if (t.pb !== left) { t.pb = left; beep(660, 90); }
        const el = $('#tmText'); if (el) el.textContent = left;
      } else if (t.state === 'run') {
        t.left = t.end - now;
        const left = Math.ceil(t.left / 1000);
        if (left <= 3 && left > 0 && t.pb !== left) { t.pb = left; beep(660, 90); }
        if (t.left <= 0) { beep(990, 500); buzz([300]); completeStep(t.total); return; }
        const el = $('#tmText'); if (el) el.textContent = clock(left); setRing('#tmRing', 1 - t.left / (t.total * 1000));
      }
    }
  }
  const CIRC = 2 * Math.PI * 88;
  function setRing(sel, f) { const el = $(sel); if (el) el.setAttribute('stroke-dashoffset', CIRC * (1 - Math.min(1, Math.max(0, f)))); }
  const bigRing = (id, f) => '<svg viewBox="0 0 200 200" width="200" height="200" style="position:absolute;inset:0"><circle cx="100" cy="100" r="88" fill="none" stroke="var(--line)" stroke-width="10"/><circle id="' + id + '" cx="100" cy="100" r="88" fill="none" stroke="var(--accent2)" stroke-width="10" stroke-linecap="round" stroke-dasharray="' + CIRC + '" stroke-dashoffset="' + CIRC * (1 - f) + '" transform="rotate(-90 100 100)"/></svg>';

  function stepLabel(st) {
    const sd = st.side ? (st.side === 'L' ? ' · links' : ' · rechts') : '';
    return (st.circuit ? 'Runde ' : 'Satz ') + st.set + ' von ' + st.sets + sd;
  }
  function drawRunner() {
    const el = $('#runner');
    if (!R) return;
    if (R.phase === 'summary') return drawSummary(el);
    const total = R.steps.length, st = R.steps[R.idx];
    const pos = R.phase === 'rest' ? R.idx + 1 : R.idx;
    const top = '<div class="rn-top"><button class="iconbtn" data-act="rnclose" aria-label="Beenden">' + icon('x') + '</button><div class="progress"><div style="width:' + Math.round(pos / total * 100) + '%"></div></div><span class="small bold">' + Math.min(total, pos + 1) + '/' + total + '</span></div>';
    if (R.phase === 'rest') {
      const nx = R.steps[R.idx + 1], ne = EXMAP[nx.ex], p = R.prev[nx.ex];
      el.innerHTML = '<div class="rn">' + top + '<div class="rest"><div class="chip accent">Pause</div><div class="timerbig">' + bigRing('restRing', 0) + '<div class="tt"><span id="restText">' + clock(R.rest.total) + '</span><small>Erholung</small></div></div>' +
        '<div class="upnext" style="width:100%;max-width:420px"><div class="tiny muted bold" style="text-transform:uppercase">Als Nächstes</div><div class="bold" style="font-size:18px">' + esc(ne.name) + '</div><div class="small muted">' + stepLabel(nx) + ' · ' + (modeOf(nx) === 'timer' ? (nx.secs || nx.target) + ' s' : nx.target + ' Wdh.') + (hasW(ne) && p && p.w ? ' · zuletzt ' + rnd1(p.w) + ' kg' : '') + '</div></div>' +
        '<div class="mini-actions"><button class="btn" data-act="restadd">+15 s</button><button class="btn primary" data-act="restskip">Pause überspringen</button></div></div></div>';
      return;
    }
    const e = EXMAP[st.ex], p = R.prev[st.ex], timer = modeOf(st) === 'timer', nx = R.steps[R.idx + 1];
    const wStep = e.eq.includes('bb') ? 2.5 : 1;
    let body = '<div class="rn-body"><div class="chips"><span class="chip accent">' + esc(st.block) + '</span><span class="chip">' + stepLabel(st) + '</span></div><h2>' + esc(e.name) + '</h2><div class="small muted">' + esc(e.m) + '</div>';
    if (timer) {
      const t = R.tm;
      body += '<div class="timerbig">' + bigRing('tmRing', t.state === 'run' ? 1 - t.left / (t.total * 1000) : 0) + '<div class="tt"><span id="tmText">' + (t.state === 'pre' ? Math.max(1, Math.ceil((t.end - Date.now()) / 1000)) : clock(Math.ceil(t.left / 1000))) + '</span><small>' + (t.state === 'pre' ? 'Mach dich bereit' : t.state === 'run' ? 'Los!' : t.state === 'paused' ? 'Pausiert' : (st.side ? (st.side === 'L' ? 'Linke Seite' : 'Rechte Seite') : 'Sekunden')) + '</small></div></div>';
    } else {
      body += '<div class="target">' + st.target + ' <small>Wdh.' + (e.side ? ' · ' + (st.side === 'L' ? 'links' : 'rechts') : '') + '</small></div>';
    }
    if (hasW(e) || !timer) {
      body += '<div class="logrow">';
      if (hasW(e)) body += '<div class="center"><div class="tiny muted bold" style="text-transform:uppercase;margin-bottom:6px">Gewicht (kg)</div><div class="stepper"><button data-act="rnstep" data-f="w" data-d="-' + wStep + '" aria-label="Weniger">−</button><input type="number" inputmode="decimal" step="' + wStep + '" id="in_w" data-in="rncur" data-f="w" value="' + (R.cur.w || 0) + '"><button data-act="rnstep" data-f="w" data-d="' + wStep + '" aria-label="Mehr">+</button></div></div>';
      if (!timer) body += '<div class="center"><div class="tiny muted bold" style="text-transform:uppercase;margin-bottom:6px">Wiederholungen</div><div class="stepper"><button data-act="rnstep" data-f="r" data-d="-1" aria-label="Weniger">−</button><input type="number" inputmode="numeric" id="in_r" data-in="rncur" data-f="r" value="' + R.cur.r + '"><button data-act="rnstep" data-f="r" data-d="1" aria-label="Mehr">+</button></div></div>';
      body += '</div>';
    }
    if (hasW(e) && p && p.w) body += '<div class="center"><span class="prev">Zuletzt: ' + rnd1(p.w) + ' kg' + (p.r ? ' × ' + p.r : p.t ? ' · ' + p.t + ' s' : '') + '</span></div>';
    if (R.prog[st.ex]) body += '<div class="center mt8"><span class="prev" style="color:var(--good)">Steigern möglich: ca. ' + f1(R.prog[st.ex].lo) + '–' + f1(R.prog[st.ex].hi) + ' kg (ACSM)</span></div>';
    body += '<details class="cuebox"' + (R.logs.some(l => l.ex === st.ex) ? '' : ' open') + '><summary>So geht’s</summary><ul class="cues">' + e.cues.map(c => '<li>' + esc(c) + '</li>').join('') + '</ul>' + (e.tip ? '<div class="small muted mt8">' + esc(e.tip) + '</div>' : '') + '</details>';
    body += '<div class="mini-actions"><button class="btn sm" data-act="rnswap">' + icon('swap') + ' Ersetzen</button><button class="btn sm" data-act="rnskip">' + icon('skip') + ' Überspringen</button><a class="btn sm" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=' + encodeURIComponent(e.name + ' Übung Anleitung') + '">' + icon('video') + ' Video</a></div>';
    if (nx) body += '<div class="upnext"><span class="tiny muted bold" style="text-transform:uppercase">Danach</span><div class="bold">' + esc(EXMAP[nx.ex].name) + '</div></div>';
    body += '</div>';
    let foot;
    if (timer) {
      const t = R.tm;
      foot = t.state === 'idle' ? '<button class="btn primary big block" data-act="tmstart">' + icon('play', 'fill') + ' Start</button>' :
        t.state === 'run' ? '<div class="row"><button class="btn big" style="flex:1" data-act="tmpause">' + icon('pause') + ' Pause</button><button class="btn primary big" style="flex:1" data-act="rndone">' + icon('check') + ' Fertig</button></div>' :
          t.state === 'paused' ? '<div class="row"><button class="btn primary big" style="flex:1" data-act="tmresume">Weiter</button><button class="btn big" style="flex:1" data-act="rndone">Beenden</button></div>' : '<button class="btn big block" data-act="tmcancel">Abbrechen</button>';
    } else foot = '<button class="btn primary big block" data-act="rndone">' + icon('check') + ' Satz abschliessen</button>';
    el.innerHTML = '<div class="rn">' + top + body + '<div class="rn-foot">' + foot + '</div></div>';
  }
  I.rncur = (v, el, d) => { R.cur[d.f] = Math.max(0, parseFloat(v) || 0); };
  H.rnstep = d => {
    const f = d.f, v = Math.max(0, rnd1((R.cur[f] || 0) + parseFloat(d.d)));
    R.cur[f] = v; const el = $('#in_' + f); if (el) el.value = v;
  };
  H.rndone = () => completeStep();
  H.rnskip = () => { skipStep(); };
  H.restskip = () => endRest();
  H.restadd = () => { R.rest.end += 15000; R.rest.total += 15; };
  H.tmstart = () => { beep(1, 1); R.tm.state = 'pre'; R.tm.end = Date.now() + 3000; R.tm.pb = null; drawRunner(); };
  H.tmcancel = () => { const st = R.steps[R.idx]; R.tm = { state: 'idle', total: st.secs || st.target, left: (st.secs || st.target) * 1000 }; drawRunner(); };
  H.tmpause = () => { R.tm.state = 'paused'; R.tm.left = R.tm.end - Date.now(); drawRunner(); };
  H.tmresume = () => { R.tm.state = 'run'; R.tm.end = Date.now() + R.tm.left; drawRunner(); };
  H.rnswap = () => {
    const st = R.steps[R.idx], e = EXMAP[st.ex];
    PK.q = ''; PK.cat = e.cat; PK.eq = ''; PK.lock = true;
    PK.cb = id => {
      const old = st.ex, ne = EXMAP[id], out = [];
      R.steps.forEach((s, i) => {
        if (i < R.idx || s.ex !== old) { out.push(s); return; }
        const wasTimer = modeOf(s) === 'timer', ns = Object.assign({}, s, { ex: id });
        if (!s.circuit) {
          const nowTimer = ne.track === 't' || ne.track === 'wt';
          if (nowTimer && !wasTimer) ns.target = 30;
          if (!nowTimer && wasTimer) ns.target = 10;
          if (e.side && !ne.side) {
            if (s.side === 'L') { ns.side = null; ns.rest = R.steps[i + 1] ? R.steps[i + 1].rest : s.rest; out.push(ns); }
            else if (i === R.idx) { ns.side = null; out.push(ns); }
            return;
          }
          if (!e.side && ne.side) { out.push(Object.assign({}, ns, { side: 'L', rest: 0 }), Object.assign({}, ns, { side: 'R' })); return; }
        }
        out.push(ns);
      });
      R.steps = out; initStep(); persistDraft(); drawRunner(); toast('Übung ersetzt');
    };
    pushSheet(pickerSheet);
  };
  H.rnclose = () => confirmSheet('Training beenden?', 'Bisher erfasst: ' + R.logs.length + ' Sätze.', [
    { label: 'Weitermachen' },
    { label: 'Pausieren & später fortsetzen', fn: () => { if (R.phase === 'rest') persistDraftAt(R.idx + 1); else persistDraft(); closeRunner(); render(); toast('Training gesichert'); } },
    { label: 'Beenden & speichern', cls: 'primary', fn: () => { if (!R.logs.length) { S.draft = null; save(); closeRunner(); render(); toast('Nichts zu speichern'); } else finishWorkout(); } },
    { label: 'Verwerfen', cls: 'danger', fn: () => { S.draft = null; save(); closeRunner(); render(); } }
  ]);

  function drawSummary(el) {
    const dur = Math.round(R.active), sets = R.logs.length;
    el.innerHTML = '<div class="rn"><div class="rn-body" style="padding-top:calc(24px)"><div class="center"><div class="badge k-' + R.kind + '" style="width:64px;height:64px;margin:0 auto 12px;border-radius:20px">' + icon('trophy') + '</div><h2 style="margin:0">Geschafft!</h2><div class="muted">' + esc(R.name) + '</div></div>' +
      '<div class="sumgrid"><div class="stat"><div class="v">' + fmtMin(dur).replace(' Min', '') + '</div><div class="l">Minuten</div></div><div class="stat"><div class="v">' + sets + '</div><div class="l">Sätze</div></div><div class="stat"><div class="v">' + (R.vol >= 1000 ? rnd1(R.vol / 1000) + 't' : Math.round(R.vol)) + '</div><div class="l">Volumen kg</div></div></div>' +
      (R.prs.length ? R.prs.map(p => '<div class="pr">' + icon('trophy') + '<div><div>' + esc(EXMAP[p.ex].name) + '</div><div class="small" style="font-weight:600">' + esc(p.txt) + '</div></div></div>').join('') : '') +
      '<div class="blk">Wie anstrengend war es? <span id="rpeVal" class="bold" style="color:var(--text)">' + R.rpe + '/10</span></div><input type="range" min="1" max="10" value="' + R.rpe + '" data-in="rpe" style="width:100%" aria-label="Anstrengung"><div class="tiny muted" style="display:flex;justify-content:space-between"><span>leicht</span><span>maximal</span></div>' +
      '<label class="field mt16"><span>Notiz</span><textarea data-in="rnote" placeholder="Wie hat es sich angefühlt? (optional)" maxlength="300"></textarea></label>' +
      '<div class="switch"><div><div class="bold">In Apple Health eintragen</div><div class="small muted">Über den Kurzbefehl „Winter-Fit Health“</div></div><label class="tgl"><input type="checkbox" data-ch="tg" data-k="health"' + (S.settings.health ? ' checked' : '') + '><i></i></label></div></div>' +
      '<div class="rn-foot"><button class="btn primary big block" data-act="rnsave">Speichern</button><button class="btn ghost block mt8" data-act="rndiscard">Nicht speichern</button></div></div>';
  }
  I.rpe = v => { R.rpe = +v; const e = $('#rpeVal'); if (e) e.textContent = v + '/10'; };
  I.rnote = v => { R.note = v; };
  H.rnsave = () => {
    const now = new Date();
    S.history.push({ id: uid(), date: dkey(now), ts: now.getTime(), sid: R.sid, name: R.name, kind: R.kind, dur: Math.round(R.active), sets: R.logs, vol: Math.round(R.vol * 10) / 10, prs: R.prs.length, rpe: R.rpe, note: R.note.trim() });
    S.draft = null; save();
    const mins = Math.max(1, Math.round(R.active / 60)), health = S.settings.health;
    closeRunner(); go('today'); toast('Training gespeichert');
    if (health) setTimeout(() => { location.href = 'shortcuts://run-shortcut?name=' + encodeURIComponent('Winter-Fit Health') + '&input=text&text=' + mins; }, 600);
  };
  H.rndiscard = () => confirmSheet('Nicht speichern?', 'Dieses Training wird verworfen.', [{ label: 'Verwerfen', cls: 'danger', fn: () => { S.draft = null; save(); closeRunner(); render(); } }, { label: 'Zurück' }]);

  /* ================= Start ================= */
  applyTheme();
  matchMedia('(prefers-color-scheme: dark)').addEventListener && matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
  render();
  announceUpdate();
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then(r => { swReg = r; }).catch(() => {});
  checkUpdate(false);
  window.__winterfit = { get state() { return S; } };
})();
