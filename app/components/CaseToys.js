"use client";

import { useEffect, useRef, useState } from "react";
import { sfx } from "./sound";

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function useTimers() {
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  return (fn, ms) => timers.current.push(setTimeout(fn, reducedMotion() ? 0 : ms));
}

/* ───────── 04 · Conference desk: scan, fix the exceptions, seal it. ───────── */
const pile = [
  { id: "1041", who: "Padaria Aurora", how: "Boleto", val: "1.280,00" },
  { id: "1042", who: "Transportes Rio Claro", how: "Boleto", val: "3.215,40", issue: "Boleto sem código de barras", impact: "Travaria a remessa inteira.", fix: "Código de barras incluído" },
  { id: "1043", who: "Gráfica Ponto Final", how: "TED", val: "860,00" },
  { id: "1044", who: "Mercado Bom Fim", how: "TED", val: "2.004,90", issue: "Conta do mesmo banco marcada como TED", impact: "Seria rejeitado pelo banco.", fix: "Ajustado para crédito em conta", fixedHow: "Crédito em conta" },
  { id: "1045", who: "Café Duas Pontes", how: "Crédito em conta", val: "540,00" },
];

function Seal() {
  return <svg className="seal" viewBox="0 0 160 160" aria-hidden="true">
    <defs><path id="sealArc" d="M80 80m-58 0a58 58 0 1 1 116 0a58 58 0 1 1-116 0" /></defs>
    <circle cx="80" cy="80" r="72" className="sealRing" /><circle cx="80" cy="80" r="44" className="sealRing thin" />
    <text className="sealText"><textPath href="#sealArc" startOffset="0">CONFERIDO · APROVADO POR PESSOAS · HISTÓRICO SALVO ·</textPath></text>
    <path className="sealCheck" d="M62 80l12 12 24-26" />
    <text className="sealDate" x="80" y="112" textAnchor="middle">01·11</text>
  </svg>;
}

export function StampDesk() {
  const later = useTimers();
  const [phase, setPhase] = useState("idle");
  const [scanned, setScanned] = useState(0);
  const [fixed, setFixed] = useState([]);
  const [nope, setNope] = useState(false);
  const found = pile.slice(0, scanned).filter(r => r.issue);
  const open = pile.filter(r => r.issue && !fixed.includes(r.id));
  const ready = phase === "review" && open.length === 0;
  const scan = () => {
    setPhase("scanning"); setScanned(0); setFixed([]);
    pile.forEach((r, i) => later(() => { setScanned(i + 1); r.issue ? sfx.alert() : sfx.scan(); if (i === pile.length - 1) setPhase("review"); }, 380 * (i + 1)));
  };
  const approve = () => {
    if (!ready) { setNope(true); sfx.buzz(); later(() => setNope(false), 450); return; }
    setPhase("sealed"); sfx.stamp(); later(() => sfx.print(10), 420);
  };
  const st = (r, i) => i >= scanned ? "wait" : r.issue && !fixed.includes(r.id) ? "bad" : "ok";
  const hint = { idle: "A remessa do dia chegou na mesa.", scanning: "Conferindo título por título…", sealed: "Aprovado, com rastro de cada ajuste." }[phase] || (open.length ? `${open.length} ${open.length > 1 ? "exceções" : "exceção"} antes da remessa sair.` : "Tudo certo. A decisão é sua.");
  return <div className={`projectVisual toyVisual deskVisual phase-${phase}`}>
    <div className="toyTop"><span className="toyEyebrow">MESA DE CONFERÊNCIA</span><span className="toyHint">{hint}</span></div>
    <div className="deskGrid">
      <div className="paper">
        <div className="paperTitle"><span>REMESSA · 01/11 · 5 TÍTULOS</span><strong>Pagamentos do dia</strong></div>
        <div className="paperHead"><span /><span>Nº</span><span>Fornecedor</span><span>Forma</span><span>R$</span></div>
        {pile.map((r, i) => { const s = st(r, i); return <div key={r.id} className={`paperRow ${s} ${fixed.includes(r.id) ? "fixed" : ""}`}>
          <i className="rowStatus" /><span>{r.id}</span><span>{r.who}</span><span>{fixed.includes(r.id) && r.fixedHow ? r.fixedHow : r.how}</span><span>{r.val}</span>
        </div>; })}
        <div className="paperFoot">
          <div className="approvalBox"><span>APROVAÇÃO</span>{phase === "sealed" && <div className="sealMark"><Seal /></div>}</div>
          <div className="paperTotal"><span>TOTAL</span><b>7.900,30</b></div>
        </div>
        {phase === "scanning" && <i className="scanLine" />}
      </div>
      <aside className="deskAside">
        <span className="asideLabel">EXCEÇÕES {phase !== "idle" && <b>{open.length}/{pile.filter(r => r.issue).length}</b>}</span>
        {phase === "idle" && <p className="asideEmpty">Nenhuma conferida ainda.</p>}
        {phase !== "idle" && !found.length && <p className="asideEmpty">Procurando…</p>}
        {found.map(r => <div key={r.id} className={`issueCard ${fixed.includes(r.id) ? "done" : ""}`}>
          <span>Nº {r.id}</span>
          <strong>{fixed.includes(r.id) ? r.fix : r.issue}</strong>
          {!fixed.includes(r.id) && <><em>{r.impact}</em><button onClick={() => { setFixed(f => [...f, r.id]); sfx.fix(); }}>Corrigir</button></>}
        </div>)}
        <div className="asideAction">
          {phase === "idle" && <button className="primaryAction" onClick={scan}>Conferir remessa</button>}
          {(phase === "scanning" || phase === "review") && <button className={`primaryAction ${ready ? "" : "locked"} ${nope ? "nope" : ""}`} onClick={approve} disabled={phase === "scanning"}>{ready ? "Aprovar e selar" : "Aprovação travada"}</button>}
          {phase === "sealed" && <div className="thermal"><b>LEOMADE · CONFERÊNCIA</b><span>5 títulos lidos</span><span>2 exceções corrigidas</span><span>aprovado às 14:02</span><span className="ok">histórico salvo ✓</span></div>}
          {phase === "sealed" && <button className="ghostAction" onClick={() => { setPhase("idle"); setScanned(0); setFixed([]); }}>Nova remessa</button>}
        </div>
      </aside>
    </div>
    <span className="visualCaption">EXEMPLO INTERATIVO · DADOS FICTÍCIOS</span>
  </div>;
}

/* ───────── 05 · Closing platform: each front closes its day, one standard file, one panel. ───────── */
const fronts = [
  { id: "a", name: "Frente A", rule: "Filtra por forma de pagamento", total: 412, items: 38, color: "#b8f4d1" },
  { id: "b", name: "Frente B", rule: "Separa adiantamentos", total: 1240, items: 91, color: "#d2e99b" },
  { id: "c", name: "Frente C", rule: "Soma lançamentos manuais", total: 287, items: 24, color: "#eebda9" },
  { id: "d", name: "Frente D", rule: "Converte moeda estrangeira", total: 640, items: 17, color: "#a9cdee" },
];
const pastDays = ["20", "21", "22", "23", "24", "27", "28", "29", "30", "31"];
const money = k => k >= 1000 ? `R$ ${(k / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} mi` : `R$ ${k} mil`;
export function ClosingHub() {
  const later = useTimers();
  const [closed, setClosed] = useState([]);
  const [flying, setFlying] = useState(null);
  const [range, setRange] = useState("hoje");
  const close = f => {
    if (closed.includes(f.id) || flying) return;
    setFlying(f.id); sfx.print(4);
    later(() => { setClosed(c => [...c, f.id]); setFlying(null); sfx.block(1); }, 900);
  };
  const done = fronts.filter(f => closed.includes(f.id));
  const total = done.reduce((s, f) => s + f.total, 0), items = done.reduce((s, f) => s + f.items, 0);
  const all = done.length === fronts.length;
  const shown = range === "hoje" ? { total, items } : { total: 52630 + total, items: 3470 + items };
  return <div className={`projectVisual toyVisual hubVisual ${all ? "allIn" : ""}`}>
    <div className="toyTop"><span className="toyEyebrow">FECHAMENTO DO DIA · 01/11</span><span className="toyHint">{all ? "Quatro regras diferentes, uma leitura só." : "Cada frente fecha o seu dia do seu jeito."}</span></div>
    <div className="hubFronts">{fronts.map(f => { const isDone = closed.includes(f.id), isFly = flying === f.id; return <div key={f.id} className={`frontCol ${isDone ? "done" : ""} ${isFly ? "fly" : ""}`} style={{ "--c": f.color }}>
      <div className="frontCard">
        <span className="frontName"><i />{f.name}</span>
        <span className="frontRule">{f.rule}</span>
        <button onClick={() => close(f)} disabled={isDone || !!flying}>{isDone ? "Fechada ✓" : isFly ? "Gerando arquivo…" : "Fechar o dia"}</button>
      </div>
      <div className="frontWire"><span className="fileChip">frente-{f.id}_2026-11-01</span></div>
    </div>; })}</div>
    <div className="hubFolder"><span className="folderIcon" /><div><b>Pasta compartilhada</b><span>um arquivo por frente por dia · mesmo contrato de colunas</span></div><span className="folderCount">{done.length}/4</span></div>
    <div className="hubPanel">
      <div className="panelHead"><span>PAINEL DA GESTÃO</span><div className="rangeSwitch">{["hoje", "mês"].map(r => <button key={r} aria-pressed={range === r} onClick={() => setRange(r)}>{r === "hoje" ? "Hoje" : "Mês"}</button>)}</div></div>
      <div className="panelKpis"><div><span>Total pago</span><b>{shown.total ? money(shown.total) : "—"}</b></div><div><span>Lançamentos</span><b>{shown.items ? shown.items.toLocaleString("pt-BR") : "—"}</b></div><div><span>Frentes fechadas</span><b>{done.length}/4</b></div></div>
      <div className="panelBar">{fronts.map(f => <i key={f.id} style={{ "--c": f.color, flexGrow: closed.includes(f.id) ? f.total : 0 }} />)}{!done.length && <span>aguardando os arquivos do dia</span>}</div>
      <div className="panelCal"><span>DIAS ÚTEIS</span><div>{pastDays.map(d => <i key={d} className="filled" title={`${d}/10`} />)}<i className={`today ${all ? "filled" : done.length ? "partial" : ""}`} style={{ "--p": done.length / 4 }} title="01/11" /></div></div>
    </div>
    <span className="visualCaption">EXEMPLO INTERATIVO · DADOS FICTÍCIOS</span>
  </div>;
}

/* ───────── 07 · Briefing portal: arrival, organization, delivery. ───────── */
const raw = [
  { ch: "WHATSAPP", text: "Faz aquele flyer? Pra ontem rs", type: "Flyer", pr: "Média", due: "06/11" },
  { ch: "E-MAIL", text: "Arte do evento, urgente!!", type: "Evento", pr: "Alta", due: "08/11" },
  { ch: "CORREDOR", text: "Embalagem nova, detalhes depois", type: "Embalagem", pr: "Alta", due: "12/11" },
  { ch: "TEAMS", text: "Banner pro site, tamanho padrão", type: "Banner", pr: "Baixa", due: "14/11" },
  { ch: "E-MAIL", text: "Ajustar post de ontem", type: "Post", pr: "Média", due: "05/11" },
  { ch: "WHATSAPP", text: "Apresentação do cliente X", type: "Apresentação", pr: "Alta", due: "07/11" },
];
const CAP = 5;
const cols = ["Fila", "Execução", "Aprovação", "Entregue"];
export function BriefingFlow() {
  const later = useTimers();
  const [stage, setStage] = useState(1);
  const [arrived, setArrived] = useState(3);
  const [tickets, setTickets] = useState([]);
  const [toast, setToast] = useState(null);
  const arrive = () => { if (arrived >= raw.length) return; setArrived(a => a + 1); sfx.drop(0); };
  const organize = () => {
    setStage(2);
    raw.slice(0, arrived).forEach((r, i) => later(() => { setTickets(t => [...t, { ...r, id: 42 + i, col: 0 }]); sfx.key(i % 3); }, 260 * (i + 1)));
  };
  const advance = id => {
    setTickets(ts => ts.map(t => {
      if (t.id !== id || t.col >= 3) return t;
      const col = t.col + 1;
      if (col === 3) { sfx.ding(); setToast(`MKT-0${t.id} entregue · solicitante avisado por e-mail`); later(() => setToast(null), 2600); } else sfx.floor();
      return { ...t, col };
    }));
  };
  const reset = () => { setStage(1); setArrived(3); setTickets([]); setToast(null); };
  const load = tickets.filter(t => t.col < 3).length;
  const over = load > CAP;
  const hint = stage === 1 ? `${arrived} pedidos soltos. Nenhum com briefing completo.` : stage === 2 ? (over ? "A fila passou da capacidade. Dá para renegociar com dados." : "Cada pedido virou um card com tipo, prioridade e prazo.") : "Execução, aprovação e aviso automático a quem pediu.";
  return <div className={`projectVisual toyVisual briefVisual stage-${stage}`}>
    <div className="toyTop"><span className="toyEyebrow">PORTAL DE BRIEFING</span><span className="toyHint">{hint}</span></div>
    <ol className="briefSteps">{["Chegada", "Organização", "Entrega"].map((s, i) => <li key={s} className={stage === i + 1 ? "on" : stage > i + 1 ? "past" : ""}><b>0{i + 1}</b>{s}</li>)}</ol>
    {stage === 1 && <div className="inboxStage">
      <div className="inboxPile">{raw.slice(0, arrived).map((r, i) => <div key={i} className="looseNote" style={{ "--i": i }}><span>{r.ch}</span>{r.text}</div>)}</div>
      <div className="inboxSide">
        <div className="inboxStats"><div><b>{arrived}</b><span>pedidos</span></div><div><b>0</b><span>com briefing</span></div><div><b>?</b><span>prazo real</span></div></div>
        <button className="ghostAction" onClick={arrive} disabled={arrived >= raw.length}>Chega mais um</button>
        <button className="primaryAction" onClick={organize}>Organizar pelo portal</button>
      </div>
    </div>}
    {stage >= 2 && <div className="boardStage">
      <div className="kanban">{cols.map((c, ci) => <div key={c} className="kCol"><span className="kHead">{c} <b>{tickets.filter(t => t.col === ci).length}</b></span>
        {tickets.filter(t => t.col === ci).map(t => <button key={t.id} className={`kCard pr-${t.pr}`} onClick={() => stage === 3 && advance(t.id)} disabled={stage !== 3 || t.col === 3}>
          <span className="kId">MKT-0{t.id}<i>{t.pr}</i></span><strong>{t.type}</strong><span className="kMeta">prazo {t.due} · briefing ✓</span>
        </button>)}
      </div>)}</div>
      <div className="boardFoot">
        <div className={`capacity ${over ? "over" : ""}`}><span>CAPACIDADE</span><div className="capBar"><i style={{ width: `${Math.min(100, (load / CAP) * 100)}%` }} /><em style={{ left: "100%" }} /></div><b>{load}/{CAP}</b></div>
        {stage === 2 && <button className="primaryAction" onClick={() => setStage(3)} disabled={tickets.length < arrived}>Executar</button>}
        {stage === 3 && (toast ? <span className="toast" key={toast}><i />{toast}</span> : <span className="boardTip">Toque num card para avançar uma etapa.</span>)}
        <button className="ghostAction" onClick={reset}>Recomeçar</button>
      </div>
    </div>}
    <span className="visualCaption">EXEMPLO INTERATIVO · DADOS FICTÍCIOS</span>
  </div>;
}

/* ───────── 08 · Switchboard: connect legacy fields to the CRM, then load and reconcile. ───────── */
const legacy = [{ k: "fone", label: "Fone", sample: "11 98877-6655" }, { k: "cliente", label: "Cliente", sample: "Padaria Aurora" }, { k: "uf", label: "UF", sample: "sp" }, { k: "email", label: "E-mail", sample: "contato@aurora…" }];
const crm = [{ k: "cliente", label: "Account.Name", type: "lookup" }, { k: "email", label: "Email", type: "e-mail" }, { k: "fone", label: "MobilePhone", type: "telefone" }, { k: "uf", label: "State", type: "2 letras" }];
const rules = { fone: "formato (11) 9xxxx-xxxx", cliente: "busca a conta pelo nome", uf: "maiúsculas, 2 letras", email: "valida o formato" };
const wireColor = { fone: "#eebda9", cliente: "#d2e99b", uf: "#a9cdee", email: "#b8f4d1" };
const py = i => 52 + i * 50;
export function Switchboard() {
  const later = useTimers();
  const [links, setLinks] = useState({});
  const [pending, setPending] = useState(null);
  const [wrong, setWrong] = useState(null);
  const [load, setLoad] = useState("idle");
  const pickL = k => { if (links[k] !== undefined || load !== "idle") return; setPending(k); sfx.key(1); };
  const pickR = j => {
    if (!pending || Object.values(links).includes(j)) return;
    if (crm[j].k === pending) { setLinks(l => ({ ...l, [pending]: j })); sfx.plug(); }
    else { setWrong({ from: pending, to: j }); sfx.buzz(); later(() => setWrong(null), 900); }
    setPending(null);
  };
  const done = Object.keys(links).length === legacy.length;
  const run = () => { setLoad("running"); sfx.lever(); later(() => { setLoad("done"); sfx.fix(); }, 2200); };
  const path = (k, j) => { const i = legacy.findIndex(f => f.k === k); const y1 = py(i), y2 = py(j); return `M150 ${y1}C230 ${y1} 250 ${y2} 330 ${y2}`; };
  const hint = load === "done" ? "4 registros chegaram limpos. 1 ficou de quarentena para revisão." : load === "running" ? "Carregando no CRM…" : done ? "Mapeamento completo. Pode executar a carga." : wrong ? "Esses campos não combinam: o tipo é diferente." : pending ? `Para onde vai “${legacy.find(f => f.k === pending).label}”?` : "Toque num campo antigo e depois no campo do CRM.";
  return <div className={`projectVisual toyVisual switchVisual load-${load}`}>
    <div className="toyTop"><span className="toyEyebrow">DATA MAPPING · LEGADO → CRM</span><span className="toyHint">{hint}</span></div>
    <svg className="patch" viewBox="0 0 480 250" aria-hidden="true">
      <defs><pattern id="grid8" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M16 0H0V16" className="gridLine" /></pattern></defs>
      <rect className="patchBg" x="1" y="1" width="478" height="248" rx="14" />
      <rect x="1" y="1" width="478" height="248" rx="14" fill="url(#grid8)" />
      <text className="colTitle" x="22" y="26">LEGADO</text><text className="colTitle" x="458" y="26" textAnchor="end">CRM</text>
      {Object.entries(links).map(([k, j]) => <path key={k} className="wire" d={path(k, j)} style={{ stroke: wireColor[k] }} />)}
      {wrong && <path className="wire bad" d={path(wrong.from, wrong.to)} />}
      {load === "running" && Object.entries(links).map(([k, j], i) => <circle key={k} r="4" className="packet" style={{ fill: wireColor[k] }}><animateMotion dur="1.1s" begin={`${i * .12}s`} repeatCount="2" path={path(k, j)} /></circle>)}
      {legacy.map((f, i) => <g key={f.k} className={`port left ${pending === f.k ? "pending" : ""} ${links[f.k] !== undefined ? "linked" : ""}`} onClick={() => pickL(f.k)} style={{ "--w": wireColor[f.k] }}>
        <rect x="18" y={py(i) - 19} width="120" height="38" rx="9" /><text className="pLabel" x="30" y={py(i) - 3}>{f.label}</text><text className="pSample" x="30" y={py(i) + 11}>{f.sample}</text><circle cx="150" cy={py(i)} r="6" className="jack" />
      </g>)}
      {crm.map((f, j) => <g key={f.k} className={`port right ${Object.values(links).includes(j) ? "linked" : ""} ${pending ? "target" : ""}`} onClick={() => pickR(j)}>
        <circle cx="330" cy={py(j)} r="6" className="jack" /><rect x="342" y={py(j) - 19} width="120" height="38" rx="9" /><text className="pLabel" x="354" y={py(j) - 3}>{f.label}</text><text className="pSample" x="354" y={py(j) + 11}>{f.type}</text>
      </g>)}
    </svg>
    <div className="mapFoot">
      <div className="mapTable"><span className="mapHead">MAPEAMENTO</span>{legacy.filter(f => links[f.k] !== undefined).map(f => <div key={f.k} className="mapRow"><i style={{ background: wireColor[f.k] }} /><span>{f.label} → {crm[links[f.k]].label}</span><em>{rules[f.k]}</em></div>)}{!Object.keys(links).length && <em className="mapEmpty">nenhum campo ligado ainda</em>}</div>
      <div className="loadBox">
        {load === "idle" && <button className="primaryAction" onClick={run} disabled={!done}>Executar carga</button>}
        {load !== "idle" && <div className="progress"><i className={load} /></div>}
        {load === "done" && <div className="recon"><span>ENVIADOS <b>5</b></span><span>CHEGARAM <b>4</b></span><span className="q">QUARENTENA <b>1</b> · telefone sem número</span><span className="ok">CONFERIDO ✓</span></div>}
        {load === "done" && <button className="ghostAction" onClick={() => { setLinks({}); setLoad("idle"); }}>Recomeçar</button>}
      </div>
    </div>
    <span className="visualCaption">EXEMPLO INTERATIVO · DADOS FICTÍCIOS</span>
  </div>;
}
