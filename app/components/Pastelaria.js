"use client";

import { useEffect, useRef, useState } from "react";
import { sfx } from "./sound";
import PixelHand from "./PixelHand";

/* 07 · Briefing portal as a pastry shop: orders arrive by channel, you hang them by deadline, the kitchen fries in that order. */
const ART = {"cook": ["....kWWWWWWWWk....", "....kWWWWWWWWk....", "...kWWWWWWWWWWk...", "...kWWWWWWWWWWk...", "...kWWWWWWWWWWk...", "....kWWWWWWWWk....", "....kGGGGGGGGk....", "....khsssssshk....", "....khssssssSk....", "....kssessesSk....", "....ksssssssSk....", "....ksssmmssSk....", "....ksssssssSk....", "....kssssssssk....", "...kkkkkSSkkkkk...", "..kjjjjWWWWjjjjk..", ".kkjjjWWWWWWjjjkk.", "kjjjjjWWWWWWjjjjjk", "kjjjjjWWWWWWjjjjjk", "kjjjjjWWWWWWjjjjjk", "kjjjjjWWWWWWjjjjjk", "kjjjjjWWWWWWjjjjjk", "kssjjjWWWWWWjjjssk", "kssjjjWWWWWWjjjssk"], "moto": ["..krrrrrrrrk..", "..krrrrrrrrk..", "..krrrrrrrrk..", ".krrrrrrrrrrk.", ".krrvvvvvvrrk.", ".krrvevvevrrk.", ".krrvvvvvvrrk.", ".krrvvvvvvrrk.", ".krrrrrrrrrrk.", ".kkjjjjjjjjkk.", "kjjjjjjjjjjjjk", "kjjjjjjjjjjjjk", "kjjjjjjjjjjjjk", "kjjjjjjjjjjjjk", "kjjjjjjjjjjjjk", "kjjjjjjjjjjjjk", "kjjjjjjjjjjjjk", "kssjjjjjjjjssk", ".kkkppppppkkk.", "...kppppppk...", "...kppppppk...", "...kppppppk...", "...kppppppk...", "...kppppppk...", "..kbbbbbbbbk..", "...kkkkkkkk..."], "email": ["..khhhhhhhhk..", "..khhhhhhhhk..", "..khhhhhhhhk..", "..khsssssShk..", "..khsssssShk..", "..khsesseSk...", "...ksssssSk...", "...kssmmsSk...", "...ksssssSk...", "...kssssssk...", ".kkjjjwwjjjkk.", "kjjjjjttjjjjjk", "kjjjjjttjjjjjk", "kjjjjjttjjjjjk", "kjjjjjttjjjjjk", "kjjjjjttjjjjjk", "kjjjjjjjjjjjjk", "kssjjjjjjjjssk", ".kkkppppppkkk.", "...kppppppk...", "...kppppppk...", "...kppppppk...", "...kppppppk...", "...kppppppk...", "..kbbbbbbbbk..", "...kkkkkkkk..."], "teams": [".knnnnnnnnnnk.", ".khhhhhhhhhhk.", ".khhsssssshhk.", ".knhsssssShnk.", ".knhsssssShnk.", ".knhsesseShnk.", ".knhsssssShnk.", ".khnssmmsSkk..", "..kknssssSk...", "...kssssssk...", ".kkjjJJJJjjkk.", "kjjjjJJJJjjjjk", "kjjjjjjjjjjjjk", "kjjjjjjjjjjjjk", "kjjjjjjjjjjjjk", "kjjjjjjjjjjjjk", "kjjjjjjjjjjjjk", "kssjjjjjjjjssk", ".kkkppppppkkk.", "...kppppppk...", "...kppppppk...", "...kppppppk...", "...kppppppk...", "...kppppppk...", "..kbbbbbbbbk..", "...kkkkkkkk..."], "pastel": ["...kkyyyykk...", "..kyyyyLyyyk..", ".kyyLyyyyyyyk.", "kyyyyyyyyyLyyk", "kyyyyyyyyyyyyk", "kyYyyyYyyyYyyk", "kYYYYYYYYYYYYk", ".kkkkkkkkkkkk."], "heart": [".kkk.kkk.", "kRRRkRRRk", "kRwRkRRRk", "kRRRRRRRk", "kRRRRRRRk", ".kRRRRRk.", "..kRRRk..", "...kRk..."], "storm": ["..kkkk...", ".kGGGGkk.", "kGGGGGGGk", "kGGGGGGGk", ".kkkkkkk.", "..R.R.R..", ".R.R.R..."]};
const base = { k: "#0c1a14", W: "#f6f3ea", G: "#c9c4b6", s: "#f2c39b", S: "#d9a27a", e: "#1b1b1b", m: "#b0644a", h: "#6b3e1f", j: "#3d5a8a", J: "#2c4268", w: "#f4f2ea", t: "#8fb4e8", p: "#2a2f3a", b: "#141414", r: "#d9503c", v: "#2a3b48", n: "#2b2f36", y: "#e8b04a", Y: "#b77a22", L: "#f6d58c", R: "#e8503c" };
const looks = {
  cookA: { j: "#3d6b55" }, cookB: { j: "#7a3b2c", s: "#c98e62", S: "#b0794f", h: "#2b1a10" },
  email: { j: "#3d5a8a", t: "#8fb4e8" }, moto: { j: "#2b2f36" }, teams: { j: "#6b4fa0", J: "#54397f", h: "#2b1a10", s: "#c98e62", S: "#b0794f" },
  factory: { j: "#e8833a", t: "#f6d58c", h: "#3a2a1c" },
};
function Px({ name, look, className = "" }) {
  const rows = ART[name], pal = { ...base, ...(looks[look] || {}) }, rects = [];
  rows.forEach((row, y) => { let x = 0; while (x < row.length) { const c = row[x]; let r = 1; while (x + r < row.length && row[x + r] === c) r++; if (c !== ".") rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={r + .02} height="1.02" fill={pal[c]} />); x += r; } });
  return <svg className={`px ${className}`} viewBox={`0 0 ${rows[0].length} ${rows.length}`} shapeRendering="crispEdges" aria-hidden="true">{rects}</svg>;
}

const channels = {
  email: { label: "E-MAIL", short: "E-MAIL", color: "#8fb4e8", sprite: "email", look: "email" },
  whats: { label: "WHATSAPP", short: "ZAP", color: "#7fd8a0", sprite: "moto", look: "moto" },
  teams: { label: "TEAMS", short: "TEAMS", color: "#b49cf2", sprite: "teams", look: "teams" },
  fab: { label: "TELEFONE", short: "FÁBRICA", color: "#f09a86", sprite: "email", look: "factory" },
};
const orders = [
  { id: 1, ch: "email", who: "Diretoria", job: "Apresentação Q3", flavor: "palmito", due: 12, shout: "URGENTE!!" },
  { id: 2, ch: "whats", who: "Vendas", job: "Post da promo", flavor: "carne", due: 10 },
  { id: 3, ch: "teams", who: "RH", job: "Banner do RH", flavor: "frango", due: 11 },
  { id: 4, ch: "email", who: "Produto", job: "Flyer da feira", flavor: "queijo", due: 10 },
  { id: 5, ch: "whats", who: "Comercial", job: "Vídeo curto", flavor: "pizza", due: 11 },
];
const EMERGENCY = { id: 6, ch: "fab", who: "Fábrica · linha 2 parada", job: "Placa de segurança", flavor: "especial", due: 11, max: true };
const everyone = [...orders, EMERGENCY];
const find = id => everyone.find(o => o.id === id);
const X = x => `${x / 3.6}%`, Y = y => `${y / 1.5}%`;
const queueX = i => 272 + i * 12;

function Ticket({ o, at }) {
  const c = channels[o.ch], late = at && at > o.due;
  return <span className={`ticketBody ${o.max ? "max" : ""} ${late ? "willLate" : ""}`} style={{ "--c": c.color }}>
    <span className="tCh">{c.label}{o.shout && <em>{o.shout}</em>}{o.max && <em className="maxTag">PRIORIDADE MÁXIMA</em>}</span>
    <b>{o.job}</b>
    <span className="tWho">{o.who} · pastel de {o.flavor}</span>
    <span className="tDue">entregar até <strong>{o.due}h</strong>{late && <i> · vai atrasar</i>}</span>
  </span>;
}

function Shop({ open }) {
  const scallops = Array.from({ length: 39 }, (_, i) => <polygon key={i} points={`${24 + i * 8},41 ${32 + i * 8},41 ${28 + i * 8},45`} fill={i % 2 ? "#f4efe1" : "#e8836f"} />);
  const shelf = Array.from({ length: 10 }, (_, i) => <g key={i}><rect x={108 + i * 15} y="68" width="10" height="4" fill="#e8b04a" /><rect x={110 + i * 15} y="67" width="6" height="1" fill="#e8b04a" /><rect x={108 + i * 15} y="71" width="10" height="1" fill="#b77a22" /></g>);
  return <svg className="shopArt" viewBox="0 0 360 150" shapeRendering="crispEdges" aria-hidden="true">
    <defs>
      <pattern id="brick" width="16" height="8" patternUnits="userSpaceOnUse"><rect width="16" height="8" fill="#8a4532" /><rect y="3" width="16" height="1" fill="#6a3224" /><rect y="7" width="16" height="1" fill="#6a3224" /><rect x="7" width="1" height="3" fill="#6a3224" /><rect x="15" y="4" width="1" height="3" fill="#6a3224" /></pattern>
      <pattern id="awning" width="16" height="10" patternUnits="userSpaceOnUse"><rect width="8" height="10" fill="#e8836f" /><rect x="8" width="8" height="10" fill="#f4efe1" /></pattern>
      <pattern id="walk" width="12" height="8" patternUnits="userSpaceOnUse"><rect width="12" height="8" fill="#3b403a" /><rect width="12" height="1" fill="#2e322d" /><rect width="1" height="8" fill="#2e322d" /></pattern>
      <pattern id="tiles" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#e9e1cf" /><rect width="6" height="1" fill="#cfc4ad" /><rect width="1" height="6" fill="#cfc4ad" /></pattern>
    </defs>
    <rect width="360" height="150" fill="#0d241b" />
    <rect x="14" y="6" width="332" height="112" fill="url(#brick)" />
    <rect x="10" y="2" width="340" height="6" fill="#3a2414" />
    <rect x="116" y="9" width="128" height="21" fill="#2b1a10" /><rect x="118" y="11" width="124" height="17" fill="#5a3820" />
    <text x="180" y="22.5" textAnchor="middle" className="signText">PASTELARIA DO BRIEFING</text>
    <rect x="104" y="13" width="6" height="9" fill="#2b1a10" /><rect x="105" y="15" width="4" height="6" fill={open ? "#f6d58c" : "#6b5a3a"} className={open ? "lampOn" : ""} />
    <rect x="250" y="13" width="6" height="9" fill="#2b1a10" /><rect x="251" y="15" width="4" height="6" fill={open ? "#f6d58c" : "#6b5a3a"} className={open ? "lampOn" : ""} />
    <rect x="24" y="32" width="312" height="9" fill="url(#awning)" />{scallops}
    <rect x="28" y="45" width="304" height="61" fill="#3b2216" />
    <rect x="102" y="76" width="156" height="30" fill="url(#tiles)" opacity=".9" />
    <rect x="104" y="72" width="152" height="2" fill="#6b4325" />{shelf}
    <line x1="102" y1="52.5" x2="258" y2="52.5" stroke="#e8e2d0" strokeWidth="1" /><rect x="101" y="51" width="3" height="3" fill="#8b9088" /><rect x="256" y="51" width="3" height="3" fill="#8b9088" />
    <rect x="98" y="45" width="5" height="61" fill="#2b1a10" /><rect x="257" y="45" width="5" height="61" fill="#2b1a10" />
    <rect x="32" y="48" width="64" height="56" fill="#4a2c1c" stroke="#2b1a10" strokeWidth="2" />
    <rect x="264" y="48" width="64" height="56" fill="#4a2c1c" stroke="#2b1a10" strokeWidth="2" />
    <rect x="44" y="49" width="40" height="8" fill="#d9503c" /><text x="64" y="55" textAnchor="middle" className="plaque">PEDIDOS</text>
    <rect x="276" y="49" width="40" height="8" fill="#3f9a6a" /><text x="296" y="55" textAnchor="middle" className="plaque">RETIRADA</text>
    <rect x="268" y="97" width="56" height="3" fill="#8b9088" />
    <rect x="166" y="92" width="28" height="12" fill="#2b2f36" /><rect x="168" y="92" width="24" height="3" fill="#e8b04a" className={open ? "oil" : ""} /><rect x="164" y="91" width="32" height="2" fill="#4a4f56" />
    <rect x="24" y="104" width="312" height="4" fill="#c98a4f" /><rect x="24" y="108" width="312" height="10" fill="#7a4c2b" />
    {Array.from({ length: 12 }, (_, i) => <rect key={i} x={28 + i * 26} y="110" width="22" height="6" fill="#6b4325" />)}
    <rect x="0" y="118" width="360" height="32" fill="url(#walk)" />
    <rect x="6" y="96" width="10" height="22" fill="#2b1a10" /><rect x="4" y="88" width="14" height="10" fill="#3f7a4a" /><rect x="7" y="85" width="8" height="4" fill="#57a065" />
    <rect x="344" y="96" width="10" height="22" fill="#2b1a10" /><rect x="342" y="88" width="14" height="10" fill="#3f7a4a" /><rect x="345" y="85" width="8" height="4" fill="#57a065" />
    {!open && <g><rect x="160" y="78" width="40" height="12" fill="#f4efe1" stroke="#2b1a10" strokeWidth="1" /><text x="180" y="86.5" textAnchor="middle" className="closedText">FECHADO</text></g>}
  </svg>;
}

export default function Pastelaria() {
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  const lineRef = useRef(null), dragRef = useRef(null), planRef = useRef({}), firedRef = useRef(false);
  const [phase, setPhase] = useState("closed");
  const [people, setPeople] = useState([]);
  const [inbox, setInbox] = useState([]);
  const [line, setLine] = useState([]);
  const [drag, setDrag] = useState(null);
  const [cooking, setCooking] = useState([]);
  const [ready, setReady] = useState([]);
  const [results, setResults] = useState({});
  const [clock, setClock] = useState(null);
  const [base, setBase] = useState(10);
  const [fried, setFried] = useState([]);
  const canEdit = phase === "arriving" || phase === "emergency";
  const readyAt = i => base + Math.floor(i / 2);
  const slots = phase === "closed" || phase === "arriving" ? orders.length : phase === "emergency" ? line.length + inbox.length : line.length;

  const walkIn = (o, i, delay) => {
    later(() => {
      setPeople(p => [...p, { id: o.id, ch: o.ch, x: -16, walking: true, mood: null }]);
      later(() => setPeople(p => p.map(c => (c.id === o.id ? { ...c, x: 64 } : c))), 40);
      later(() => { setInbox(b => [...b, o.id]); sfx.floor(); setPeople(p => p.map(c => (c.id === o.id ? { ...c, x: queueX(i) } : c))); }, 1150);
      later(() => setPeople(p => p.map(c => (c.id === o.id ? { ...c, walking: false } : c))), 2500);
    }, delay);
  };
  const open = () => { setPhase("arriving"); sfx.lightSwitch(); orders.forEach((o, i) => walkIn(o, i, i * 1100)); };
  const hang = id => { if (!canEdit) return; setInbox(b => b.filter(x => x !== id)); setLine(l => [...l, id]); sfx.clip(); };

  const axis = () => (lineRef.current && getComputedStyle(lineRef.current).getPropertyValue("--axis").trim()) || "x";
  const slotSize = () => { const r = lineRef.current.getBoundingClientRect(); return axis() === "x" ? r.width / Math.max(slots, 1) : 108; };
  const onDown = (e, id) => { if (!canEdit) return; e.currentTarget.setPointerCapture(e.pointerId); dragRef.current = { id, x0: e.clientX, y0: e.clientY, i0: line.indexOf(id), slot: slotSize(), ax: axis() }; setDrag({ id, d: 0 }); };
  const onMove = e => {
    const g = dragRef.current; if (!g) return;
    const d = g.ax === "x" ? e.clientX - g.x0 : e.clientY - g.y0;
    const ni = Math.max(0, Math.min(line.length - 1, g.i0 + Math.round(d / g.slot)));
    setLine(l => { const cur = l.indexOf(g.id); if (cur === ni) return l; const n = l.filter(x => x !== g.id); n.splice(ni, 0, g.id); sfx.key(ni % 3); return n; });
    setDrag({ id: g.id, d: d - (ni - g.i0) * g.slot });
  };
  const onUp = () => { dragRef.current = null; setDrag(null); };

  const judge = (id, at) => {
    const o = find(id), ok = at <= o.due;
    const why = ok ? null : o.max ? "fabWait" : (planRef.current[id] ?? 99) <= o.due ? "fab" : "order";
    setResults(r => ({ ...r, [id]: { ok, why } }));
    setPeople(p => p.map(c => (c.id === id ? { ...c, mood: ok ? "happy" : why === "fab" ? "fine" : "late" } : c)));
    ok ? sfx.fix() : why === "fab" ? sfx.pop() : sfx.buzz();
    later(() => setPeople(p => p.map(c => (c.id === id ? { ...c, x: 380, walking: true } : c))), 1300);
  };
  const cookRound = (order, at) => {
    const pair = order.slice(0, 2), rest = order.slice(2);
    later(() => { setLine(l => l.filter(x => !pair.includes(x))); setCooking(pair); setClock(at); sfx.sizzle(); }, 250);
    later(() => { setCooking([]); setReady(pair); sfx.pop(); }, 1750);
    later(() => {
      setReady([]); pair.forEach(id => judge(id, at));
      if (!firedRef.current) { firedRef.current = true; later(() => emergency(), 1300); }
      else if (rest.length) later(() => cookRound(rest, at + 1), 900);
      else later(() => { setPhase("done"); sfx.ding(); }, 1500);
    }, 2350);
  };
  const emergency = () => {
    setPhase("emergency"); setBase(11); sfx.phone();
    setPeople(p => [...p, { id: 6, ch: "fab", x: -16, walking: true, mood: null }]);
    later(() => setPeople(p => p.map(c => (c.id === 6 ? { ...c, x: 64 } : c))), 40);
    later(() => { setInbox([6]); sfx.alert(); setPeople(p => p.map(c => (c.id === 6 ? { ...c, x: 256 } : c))); }, 1150);
    later(() => setPeople(p => p.map(c => (c.id === 6 ? { ...c, walking: false } : c))), 2500);
  };
  const fry = () => {
    if (line.length < orders.length) return;
    planRef.current = Object.fromEntries(line.map((id, i) => [id, 10 + Math.floor(i / 2)]));
    setFried([...line]); setPhase("frying"); cookRound([...line], 10);
  };
  const resume = () => { if (inbox.length) return; setPhase("frying"); cookRound([...line], 11); };
  const reset = () => { timers.current.forEach(clearTimeout); timers.current = []; firedRef.current = false; planRef.current = {}; setPhase("closed"); setPeople([]); setInbox([]); setLine([]); setCooking([]); setReady([]); setResults({}); setClock(null); setBase(10); setFried([]); sfx.flip(); };

  const res = Object.values(results), onTime = res.filter(r => r.ok).length, late = res.length - onTime;
  const byOrder = res.filter(r => r.why === "order").length, byFab = res.filter(r => r.why === "fab").length, fabWait = res.some(r => r.why === "fabWait");
  const shoutFirst = fried.indexOf(1) > -1 && fried.indexOf(1) < 2;
  const willLate = line.some((id, i) => readyAt(i) > find(id).due);
  const verdict = fabWait ? "A fábrica parada esperou na fila. Urgência real passa na frente de tudo."
    : byOrder === 0 && byFab === 0 ? "Tudo no prazo, até com a fábrica parada. Varal impecável."
    : [byFab ? `${byFab} ${byFab > 1 ? "pedidos atrasaram" : "pedido atrasou"} por causa da fábrica parada. Esse dá para renegociar com dados.` : "", byOrder ? `${byOrder} ${byOrder > 1 ? "atrasaram" : "atrasou"} pela ordem do varal${shoutFirst ? ": o grito no assunto furou a fila" : ""}.` : ""].filter(Boolean).join(" ");
  const hint = phase === "closed" ? "Hora de abrir. Os pedidos chegam por todo canal."
    : phase === "arriving" ? (inbox.length && !line.length ? "Toque num pedido para pendurar no varal." : people.length < orders.length ? "Mais gente chegando. Vai pendurando." : line.length < orders.length ? "Pendure todos no varal." : willLate ? "Embaixo de cada vaga está a hora que fica pronto. Vermelho vai atrasar." : "Tudo dentro do prazo. Pode fritar!")
    : phase === "emergency" ? (inbox.length ? "Telefone! Fábrica parada. Pendure o pedido vermelho." : "Encaixe a prioridade máxima e veja quem passa a atrasar.")
    : phase === "frying" ? "Cozinha a mil. Dois pastéis por vez."
    : "Fim do expediente.";

  return <div className={`projectVisual toyVisual pastelVisual phase-${phase}`} data-noswipe>
    <div className="toyTop"><span className="toyEyebrow">PORTAL DE BRIEFING · PASTELARIA</span><span className="toyHint" key={hint}>{hint}</span></div>
    <div className="shop">
      <Shop open={phase !== "closed"} />
      {phase === "emergency" && <span className="phoneRing" style={{ left: X(58), top: Y(60) }}>TRIM TRIM</span>}
      {["cookA", "cookB"].map((k, i) => <span key={k} className={`cook ${cooking[i] ? "working" : ""}`} style={{ left: X(i ? 216 : 126), top: Y(80), width: X(18) }}><Px name="cook" look={k} />{cooking[i] && <span className="cookTicket">{find(cooking[i]).flavor}</span>}</span>)}
      {cooking.length > 0 && <span className="steam" style={{ left: X(180), top: Y(84) }}><i /><i /><i /></span>}
      {ready.map((id, i) => <span key={id} className="readyPastel" style={{ left: X(274 + i * 26), top: Y(86), width: X(16) }}><Px name="pastel" /><small>{find(id).flavor}</small></span>)}
      {people.map(c => { const ch = channels[c.ch]; return <span key={c.id} className={`customer ${c.walking ? "walking" : ""}`} style={{ left: X(c.x - 7), top: Y(120), width: X(14) }}>
        <span className="chBadge" style={{ "--c": ch.color }}>{ch.short}</span>
        {c.mood && <span className={`mood ${c.mood}`}>{c.mood !== "fine" && <Px name={c.mood === "happy" ? "heart" : "storm"} />}<small>{c.mood === "happy" ? "valeu!" : c.mood === "fine" ? "tudo bem" : "atrasou!"}</small></span>}
        <Px name={ch.sprite} look={ch.look} />
      </span>; })}
    </div>
    {(phase === "closed" || canEdit) && <div className="tray">
      <span className="boardLabel">CHEGARAM <b>{inbox.length}</b></span>
      <div className="trayRow">{inbox.map((id, i) => <button key={id} className="ticket loose" style={{ "--i": i }} onClick={() => hang(id)}><Ticket o={find(id)} /></button>)}
        {!inbox.length && <span className="trayEmpty">{phase === "closed" ? "Os pedidos chegam aqui quando a loja abrir." : phase === "arriving" ? "Tudo pendurado." : "Bandeja vazia."}</span>}
        {canEdit && inbox.length > 0 && (!line.length || phase === "emergency") && <span className="guide trayGuide"><PixelHand /><em>toque para pendurar</em></span>}</div>
    </div>}
    {phase !== "done" && <div className="varal">
      <span className="boardLabel">VARAL · <b className="dirX">A ESQUERDA FRITA PRIMEIRO</b><b className="dirY">O DE CIMA FRITA PRIMEIRO</b></span>
      <div className="line" ref={lineRef} style={{ "--n": Math.max(slots, 1) }}>
        {line.map((id, i) => { const dragging = drag?.id === id; return <button key={id} className={`ticket hung ${dragging ? "dragging" : ""}`} style={{ "--i": i, "--d": dragging ? `${drag.d}px` : "0px" }} onPointerDown={e => onDown(e, id)} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}><i className="pin" /><Ticket o={find(id)} at={canEdit ? readyAt(i) : null} /></button>; })}
        {Array.from({ length: Math.max(0, slots - line.length) }, (_, k) => <span key={`e${k}`} className="slotEmpty" style={{ "--i": line.length + k }} />)}
        {canEdit && Array.from({ length: slots }, (_, i) => { const id = line[i], bad = id && readyAt(i) > find(id).due; return <span key={`t${i}`} className={`slotTime ${bad ? "bad" : id ? "good" : ""}`} style={{ "--i": i }}>{i + 1}º · pronto às <b>{readyAt(i)}h</b></span>; })}
      </div>
    </div>}
    <div className="pastelFoot">
      {clock && <span className="clock"><small>COZINHA</small>{clock}h</span>}
      <span className="score">NO PRAZO <b>{onTime}</b></span><span className="score late">ATRASADOS <b>{late}</b></span>
      {phase === "done" && <span className="verdict">{verdict}</span>}
      {phase === "closed" && <><span className="guide footGuide"><PixelHand /></span><button className="primaryAction nudge" onClick={open}>Abrir a loja</button></>}
      {phase === "arriving" && <button className={`primaryAction ${line.length === orders.length ? "nudge" : ""}`} onClick={fry} disabled={line.length < orders.length}>Pode fritar!</button>}
      {phase === "emergency" && <button className={`primaryAction ${inbox.length ? "" : "nudge"}`} onClick={resume} disabled={inbox.length > 0}>Retomar a fritura</button>}
      {phase === "done" && <button className="ghostAction" onClick={reset}>Novo dia</button>}
    </div>
    <span className="visualCaption">EXEMPLO INTERATIVO · DADOS FICTÍCIOS</span>
  </div>;
}
