"use client";

import { useEffect, useRef, useState } from "react";
import { sfx } from "./sound";

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* 04 · Conference desk: scan the pile, fix the exceptions, then stamp it. */
const pile = [
  { id: "#1041", who: "Padaria Aurora", how: "Boleto", val: "1.280,00" },
  { id: "#1042", who: "Transportes Rio Claro", how: "Boleto", val: "3.215,40", issue: "Boleto sem código de barras", fix: "Código de barras incluído" },
  { id: "#1043", who: "Gráfica Ponto Final", how: "TED", val: "860,00" },
  { id: "#1044", who: "Mercado Bom Fim", how: "TED", val: "2.004,90", issue: "Conta do mesmo banco marcada como TED", fix: "Ajustado para crédito em conta" },
  { id: "#1045", who: "Café Duas Pontes", how: "Crédito em conta", val: "540,00" },
];

export function StampDesk() {
  const [phase, setPhase] = useState("idle");
  const [scanned, setScanned] = useState(0);
  const [fixed, setFixed] = useState([]);
  const [nope, setNope] = useState(false);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const issues = pile.filter(r => r.issue).map(r => r.id);
  const open = issues.filter(id => !fixed.includes(id));
  const ready = phase === "review" && open.length === 0;
  const scan = () => {
    setPhase("scanning"); setScanned(0); setFixed([]);
    const step = reducedMotion() ? 0 : 330;
    pile.forEach((r, i) => timers.current.push(setTimeout(() => { setScanned(i + 1); r.issue ? sfx.alert() : sfx.scan(); if (i === pile.length - 1) setPhase("review"); }, step * (i + 1))));
  };
  const stamp = () => {
    if (phase === "stamped") return;
    if (!ready) { setNope(true); sfx.buzz(); timers.current.push(setTimeout(() => setNope(false), 500)); return; }
    sfx.stamp(); setPhase("stamped");
    timers.current.push(setTimeout(() => sfx.print(10), 350));
  };
  const status = (r, i) => i >= scanned ? "wait" : r.issue && !fixed.includes(r.id) ? "bad" : "ok";
  const hint = phase === "idle" ? "Coloque a pilha do dia no scanner." : phase === "scanning" ? "Conferindo título por título..." : phase === "stamped" ? "Aprovado, com histórico guardado." : open.length ? `${open.length} ${open.length > 1 ? "exceções" : "exceção"} antes da remessa. Corrija para liberar o carimbo.` : "Tudo certo. Pode carimbar.";
  return <div className={`projectVisual toyVisual stampDesk phase-${phase}`}>
    <div className="toyTop"><span className="flowEyebrow">MESA DE CONFERÊNCIA</span><span className="toyHint">{hint}</span></div>
    <div className="deskBody">
      <div className="deskPaper">
        <div className="paperHead"><span>TÍTULO</span><span>FORNECEDOR</span><span>FORMA</span><span>R$</span></div>
        {pile.map((r, i) => {
          const st = status(r, i);
          return <div key={r.id} className={`paperRow ${st} ${fixed.includes(r.id) ? "fixed" : ""}`}>
            <span className="rowMark">{st === "wait" ? "·" : st === "bad" ? "!" : "✓"}</span>
            <span>{r.id}</span><span>{r.who}</span><span>{fixed.includes(r.id) && r.id === "#1044" ? "Crédito em conta" : r.how}</span><span>{r.val}</span>
            {st === "bad" && <button className="rowFix" onClick={() => { setFixed(f => [...f, r.id]); sfx.fix(); }}><b>{r.issue}</b><i>Corrigir</i></button>}
            {fixed.includes(r.id) && <em className="rowFixed">{r.fix}</em>}
          </div>;
        })}
        {phase === "scanning" && <i className="scanBeam" />}
        {phase === "stamped" && <span className="inkStamp" aria-label="Aprovado">APROVADO<small>CONFERIDO · 5 TÍTULOS · 2 AJUSTES</small></span>}
      </div>
      <div className="deskSide">
        {phase === "idle" ? <button className="deskStart" onClick={scan}>Conferir a pilha <span>→</span></button> : <button className={`stampTool ${nope ? "nope" : ""} ${phase === "stamped" ? "used" : ""} ${ready ? "ready" : ""}`} onClick={stamp} aria-label="Carimbar aprovação">
          <svg viewBox="0 0 90 120" aria-hidden="true"><g className="stampMove"><circle className="knob" cx="45" cy="18" r="13" /><rect className="neck" x="38" y="29" width="14" height="34" rx="4" /><path className="base" d="M14 66h62l6 18H8Z" /><rect className="rubber" x="10" y="84" width="70" height="10" rx="2" /></g><rect className="pad" x="6" y="104" width="78" height="10" rx="3" /></svg>
          <span>{phase === "stamped" ? "Carimbado" : "Carimbar"}</span>
        </button>}
        {phase === "stamped" && <div className="receipt"><b>RECIBO</b><span>14:02 · pilha conferida</span><span>2 exceções corrigidas</span><span>aprovado por pessoas</span><span>histórico salvo ✓</span></div>}
        {phase === "stamped" && <button className="toyReset" onClick={() => { setPhase("idle"); setScanned(0); setFixed([]); }}>Nova pilha</button>}
      </div>
    </div>
    <span className="visualCaption">EXEMPLO INTERATIVO · DADOS FICTÍCIOS</span>
  </div>;
}

/* 05 · Shape mold: four fronts, four ways of working, one language for management. */
const fronts = [
  { id: 1, color: "#e5574a", shapes: ["circle", "tri", "star"] },
  { id: 2, color: "#f3c84b", shapes: ["tri", "star", "diamond"] },
  { id: 3, color: "#7cc4e8", shapes: ["star", "circle", "diamond"] },
  { id: 4, color: "#c58fe0", shapes: ["diamond", "tri", "circle"] },
];
function Shape({ kind, x, y, color }) {
  const s = 9;
  if (kind === "circle") return <circle cx={x} cy={y} r={s} fill={color} />;
  if (kind === "tri") return <path d={`M${x} ${y - s}L${x + s} ${y + s * .8}H${x - s}Z`} fill={color} />;
  if (kind === "diamond") return <path d={`M${x} ${y - s}L${x + s} ${y}L${x} ${y + s}L${x - s} ${y}Z`} fill={color} />;
  return <path d={`M${x} ${y - s}L${x + 2.6} ${y - 3}L${x + s} ${y - 2.6}L${x + 4} ${y + 2}L${x + 5.5} ${y + s}L${x} ${y + 5}L${x - 5.5} ${y + s}L${x - 4} ${y + 2}L${x - s} ${y - 2.6}L${x - 2.6} ${y - 3}Z`} fill={color} />;
}
export function ShapeMold() {
  const [closed, setClosed] = useState([]);
  const [busy, setBusy] = useState(null);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const close = id => {
    if (closed.includes(id) || busy) return;
    setBusy(id); sfx.drop(0); sfx.drop(1); sfx.drop(2);
    timers.current.push(setTimeout(() => { setClosed(c => [...c, id]); setBusy(null); [0, 1, 2].forEach(i => sfx.block(i)); }, reducedMotion() ? 0 : 750));
  };
  const all = closed.length === fronts.length;
  return <div className={`projectVisual toyVisual shapeMold ${all ? "allClosed" : ""}`}>
    <div className="toyTop"><span className="flowEyebrow">CADA FRENTE NO SEU JEITO</span><span className="toyHint">{all ? "Quatro jeitos de trabalhar, uma língua só." : "Feche o dia de cada frente."}</span></div>
    <svg className="moldArt" viewBox="0 0 400 250" aria-hidden="true">
      {fronts.map((f, i) => {
        const x = 50 + i * 100, done = closed.includes(f.id), going = busy === f.id;
        return <g key={f.id} className={`front ${done ? "done" : ""} ${going ? "going" : ""}`} onClick={() => close(f.id)}>
          <path className="hopper" d={`M${x - 34} 14h68l-18 46h-32Z`} />
          <g className="hopperShapes">{f.shapes.map((k, j) => <g key={j} className="fallShape" style={{ "--j": j }}><Shape kind={k} x={x - 16 + j * 16} y={32 + (j % 2) * 8} color={f.color} /></g>)}</g>
          <text x={x} y="8" textAnchor="middle">FRENTE {f.id}</text>
        </g>;
      })}
      <rect className="mold" x="14" y="86" width="372" height="34" rx="8" />
      {fronts.map((f, i) => <rect key={f.id} className={`moldHole ${busy === f.id ? "hot" : ""}`} x={36 + i * 100} y="94" width="28" height="18" rx="3" />)}
      <text className="moldLabel" x="200" y="134" textAnchor="middle">CONTRATO DE COLUNAS</text>
      <rect className="screen" x="60" y="146" width="280" height="98" rx="10" />
      <text className="screenLabel" x="200" y="162" textAnchor="middle">PAINEL DA GESTÃO</text>
      <line className="axis" x1="80" y1="232" x2="320" y2="232" />
      {fronts.map((f, i) => closed.includes(f.id) && [0, 1, 2].map(b => <rect key={`${f.id}${b}`} className="block" style={{ "--b": b, "--c": f.color }} x={98 + i * 60} y={214 - b * 19} width="26" height="16" rx="3" />))}
    </svg>
    <div className="moldButtons">{fronts.map(f => <button key={f.id} disabled={closed.includes(f.id) || !!busy} onClick={() => close(f.id)} style={{ "--c": f.color }}><i />{closed.includes(f.id) ? "Fechada ✓" : `Fechar frente ${f.id}`}</button>)}{all && <button className="toyReset" onClick={() => setClosed([])}>Novo dia</button>}</div>
    <span className="visualCaption">EXEMPLO INTERATIVO · DADOS FICTÍCIOS</span>
  </div>;
}

/* 07 · Ticket machine: messy requests become numbered tickets in a visible queue. */
const kinds = [["EMBALAGEM", "12/11"], ["EVENTO", "18/11"], ["FLYER", "08/11"], ["POST", "06/11"], ["APRESENTAÇÃO", "21/11"]];
const MAX = 6;
export function TicketMachine() {
  const [next, setNext] = useState(41);
  const [queue, setQueue] = useState([]);
  const [printing, setPrinting] = useState(null);
  const [serving, setServing] = useState(null);
  const [loose, setLoose] = useState(5);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const take = () => {
    if (printing) return;
    const [type, due] = kinds[(next - 41) % kinds.length];
    const t = { n: next, type, due };
    setPrinting(t); setNext(n => n + 1); setLoose(l => Math.max(0, l - 1)); sfx.print(7);
    timers.current.push(setTimeout(() => { setQueue(q => [...q, t]); setPrinting(null); }, reducedMotion() ? 0 : 950));
  };
  const call = () => { if (!queue.length) return; setServing(queue[0]); setQueue(q => q.slice(1)); sfx.ding(); };
  const load = Math.min(1, queue.length / MAX);
  const level = queue.length >= 5 ? "red" : queue.length >= 3 ? "yellow" : "green";
  const msg = level === "red" ? "Fila cheia. Hora de renegociar prazo." : level === "yellow" ? "A fila está enchendo." : queue.length ? "Fila tranquila." : "Pegue uma senha.";
  return <div className={`projectVisual toyVisual ticketMachine level-${level}`}>
    <div className="toyTop"><span className="flowEyebrow">UM PEDIDO, UM CAMINHO</span><span className="toyHint">{msg}</span></div>
    <div className="ticketBody">
      <div className="chaos" aria-label="Pedidos soltos">{["E-MAIL", "WHATSAPP", "CORREDOR", "E-MAIL", "TEAMS"].slice(0, loose).map((c, i) => <span key={i} className="loose" style={{ "--i": i }}>{c}</span>)}{!loose && <span className="calm">Nada solto por aí.</span>}</div>
      <div className="machine">
        <svg viewBox="0 0 120 150" aria-hidden="true">
          <rect className="mBody" x="14" y="10" width="92" height="118" rx="12" />
          <rect className="mScreen" x="28" y="24" width="64" height="26" rx="4" />
          <text className="mNum" x="60" y="43" textAnchor="middle">{String(next).padStart(3, "0")}</text>
          <rect className="mSlot" x="30" y="112" width="60" height="6" rx="3" />
          <rect className="mFoot" x="24" y="128" width="72" height="14" rx="4" />
        </svg>
        <button className="mButton" onClick={take} aria-label="Pegar uma senha"><span>PEGUE<br />SUA SENHA</span></button>
        {printing && <div className="ticket printing"><b>SENHA {String(printing.n).padStart(3, "0")}</b><span>{printing.type}</span><small>PRAZO {printing.due}</small></div>}
      </div>
      <div className="queueBoard">
        <svg className="gauge" viewBox="0 0 120 70" aria-hidden="true">
          <path className="arc g" d="M12 62A48 48 0 0 1 36 20.4" /><path className="arc y" d="M36 20.4A48 48 0 0 1 84 20.4" /><path className="arc r" d="M84 20.4A48 48 0 0 1 108 62" />
          <g className="needle" style={{ "--a": `${-90 + 180 * load}deg` }}><path d="M60 62L60 22" /><circle cx="60" cy="62" r="5" /></g>
        </svg>
        <div className="boardCall"><span>ATENDENDO</span><b>{serving ? String(serving.n).padStart(3, "0") : "—"}</b></div>
        <ol className="queueList">{queue.map(t => <li key={t.n}><b>{String(t.n).padStart(3, "0")}</b>{t.type}<small>{t.due}</small></li>)}</ol>
        <button className="callNext" onClick={call} disabled={!queue.length}>Chamar próximo</button>
      </div>
    </div>
    <span className="visualCaption">EXEMPLO INTERATIVO · DADOS FICTÍCIOS</span>
  </div>;
}

/* 08 · Switchboard: plug each old field into its CRM field, then migrate. */
const oldFields = [{ k: "fone", label: "Fone" }, { k: "cliente", label: "Cliente" }, { k: "uf", label: "UF" }, { k: "email", label: "E-mail" }];
const newFields = [{ k: "cliente", label: "Account.Name" }, { k: "email", label: "Email" }, { k: "fone", label: "MobilePhone" }, { k: "uf", label: "State" }];
const cableColors = { fone: "#e5574a", cliente: "#f3c84b", uf: "#7cc4e8", email: "#8fe0c0" };
const ly = i => 46 + i * 44;
export function Switchboard() {
  const [links, setLinks] = useState({});
  const [pending, setPending] = useState(null);
  const [wrong, setWrong] = useState(null);
  const [migrated, setMigrated] = useState(false);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const pickOld = k => { if (links[k] !== undefined || migrated) return; setPending(k); sfx.key(1); };
  const pickNew = j => {
    if (!pending || Object.values(links).includes(j)) return;
    if (newFields[j].k === pending) { setLinks(l => ({ ...l, [pending]: j })); sfx.plug(); }
    else { setWrong({ from: pending, to: j }); sfx.buzz(); timers.current.push(setTimeout(() => setWrong(null), 900)); }
    setPending(null);
  };
  const done = Object.keys(links).length === oldFields.length;
  const cable = (k, j) => { const i = oldFields.findIndex(f => f.k === k); const y1 = ly(i), y2 = ly(j); return `M96 ${y1}C190 ${y1 + 46} 210 ${y2 + 46} 304 ${y2}`; };
  const hint = migrated ? "4 registros chegaram com significado. 1 ficou na quarentena." : done ? "Tudo plugado. Puxe a alavanca para migrar." : pending ? `Agora escolha para onde vai "${oldFields.find(f => f.k === pending).label}".` : "Toque num campo antigo e depois no campo do CRM.";
  return <div className={`projectVisual toyVisual switchboard ${migrated ? "migrated" : ""}`}>
    <div className="toyTop"><span className="flowEyebrow">MESA DE TELEFONISTA · DATA MAPPING</span><span className="toyHint">{hint}</span></div>
    <svg className="boardArt" viewBox="0 0 400 240" aria-hidden="true">
      <rect className="panel" x="6" y="12" width="388" height="208" rx="14" />
      <text className="colLabel" x="62" y="28" textAnchor="middle">SISTEMA ANTIGO</text>
      <text className="colLabel" x="338" y="28" textAnchor="middle">CRM</text>
      {Object.entries(links).map(([k, j]) => <path key={k} className="cable" d={cable(k, j)} style={{ stroke: cableColors[k] }} />)}
      {wrong && <path className="cable wrong" d={cable(wrong.from, wrong.to)} />}
      {migrated && Object.entries(links).map(([k, j], i) => <circle key={k} className="packet" r="5" style={{ fill: cableColors[k] }}><animateMotion dur="1.4s" begin={`${i * .15}s`} repeatCount="indefinite" path={cable(k, j)} /></circle>)}
      {oldFields.map((f, i) => <g key={f.k} className={`jack old ${pending === f.k ? "pending" : ""} ${links[f.k] !== undefined ? "linked" : ""}`} onClick={() => pickOld(f.k)}>
        <rect x="18" y={ly(i) - 15} width="66" height="30" rx="8" /><text x="51" y={ly(i) + 4} textAnchor="middle">{f.label}</text><circle className="hole" cx="96" cy={ly(i)} r="7" style={{ "--c": cableColors[f.k] }} />
      </g>)}
      {newFields.map((f, j) => <g key={f.k} className={`jack new ${Object.values(links).includes(j) ? "linked" : ""} ${pending ? "target" : ""}`} onClick={() => pickNew(j)}>
        <circle className="hole" cx="304" cy={ly(j)} r="7" /><rect x="316" y={ly(j) - 15} width="74" height="30" rx="8" /><text x="353" y={ly(j) + 4} textAnchor="middle">{f.label}</text>
      </g>)}
    </svg>
    <div className="boardFoot">
      <button className={`lever ${migrated ? "pulled" : ""}`} disabled={!done || migrated} onClick={() => { setMigrated(true); sfx.lever(); }}><i />{migrated ? "Migrado" : "Migrar"}</button>
      <div className="quarantine"><span>QUARENTENA</span><b>{migrated ? "1" : "0"}</b>{migrated && <i className="dirty" title="Telefone sem número" />}</div>
      <div className="tally"><span>ENVIADOS <b>{migrated ? 5 : 0}</b></span><span>CHEGARAM <b>{migrated ? 4 : 0}</b></span><span className={migrated ? "ok" : ""}>{migrated ? "CONFERIDO ✓" : "AGUARDANDO"}</span></div>
      {migrated && <button className="toyReset" onClick={() => { setLinks({}); setMigrated(false); }}>Recomeçar</button>}
    </div>
    <span className="visualCaption">EXEMPLO INTERATIVO · DADOS FICTÍCIOS</span>
  </div>;
}
