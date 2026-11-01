"use client";

import { useEffect, useRef, useState } from "react";
import { sfx } from "./sound";
import PixelHand from "./PixelHand";

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function useTimers() {
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  return (fn, ms) => timers.current.push(setTimeout(fn, reducedMotion() ? 0 : ms));
}

/* ───────── 04 · Inspection desk: open the clipboard, hunt with the lens, type the fixes, print, stamp. ───────── */
const remessa = [
  { id: "1041", who: "Padaria Aurora", det: "cód. 23793.38128 60082", how: "Boleto", val: "1.280,00" },
  { id: "1042", who: "Transportes Rio Claro", det: "cód. barras: ausente", how: "Boleto", val: "3.215,40", err: { cell: "det", key: "cod", fix: "cód. 34191.79001 01043" } },
  { id: "1043", who: "Gráfica Ponto Final", det: "banco 237 · ag. 0912", how: "TED", val: "860,00" },
  { id: "1044", who: "Mercado Bom Fim", det: "banco 001 · ag. 3310", how: "TED", val: "2.004,90", err: { cell: "how", key: "forma", fix: "Créd. conta" } },
  { id: "1045", who: "Café Duas Pontes", det: "NF 450,00", how: "Créd. conta", val: "540,00", err: { cell: "val", key: "valor", fix: "450,00" } },
];
const deskRules = [
  { k: "cod", t: "Boleto só sai com código de barras." },
  { k: "forma", t: "Conta no banco do pagador (001) recebe por crédito em conta, não TED." },
  { k: "valor", t: "O valor tem que bater com a nota fiscal." },
];
const obsText = { cod: "1042 · boleto sem código de barras", forma: "1044 · mesmo banco pago por TED", valor: "1045 · valor diferente da NF" };
const stampLabel = { ok: "APROVADO", no: "NEGADO" };
function StampArt({ kind }) {
  return <span className={`stampArt ${kind}`} aria-hidden="true">
    <span className="sHandle"><i className="neck" /><i className="ball" /></span>
    <span className="sTop"><b>{stampLabel[kind]}</b></span>
    <span className="sEdge" />
  </span>;
}
const StampInk = ({ s }) => <span className={`stampMark ${s.k}`} style={{ left: `${s.x}%`, top: `${s.y}%`, "--r": `${s.r}deg` }}>
<b>{stampLabel[s.k]}</b><small>CONFERÊNCIA · 01·11</small>
</span>;

export function StampDesk() {
  const later = useTimers();
  const sheetRef = useRef(null), downAt = useRef(null), queue = useRef(Promise.resolve()), gen = useRef(0);
  const [cover, setCover] = useState("closed");
  const [tool, setTool] = useState(null);
  const [pt, setPt] = useState(null);
  const [hoverErr, setHoverErr] = useState(null);
  const [found, setFound] = useState([]);
  const [typed, setTyped] = useState({});
  const [typing, setTyping] = useState(null);
  const [fixed, setFixed] = useState([]);
  const [print, setPrint] = useState("none");
  const [drag, setDrag] = useState(null);
  const [note, setNote] = useState(null);
  const [stamps, setStamps] = useState([]);
  const [press, setPress] = useState(0);
  const [nextRot, setNextRot] = useState(-3);
  const [flash, setFlash] = useState(null);
  const allFixed = fixed.length === 3;
  const isOpen = cover === "open";
  const say = m => { setFlash(m); later(() => setFlash(f => (f === m ? null : f)), 2400); };

  const typeOut = (key, text, done) => {
    const g = gen.current;
    queue.current = queue.current.then(() => new Promise(res => {
      if (gen.current !== g) return res();
      setTyping(key);
      const step = i => {
        if (gen.current !== g) return res();
        setTyped(t => ({ ...t, [key]: i }));
        if (text[i - 1] !== " ") sfx.type(i);
        if (i < text.length) later(() => step(i + 1), 40);
        else { setTyping(null); done && done(); res(); }
      };
      step(1);
    }));
  };
  const openBoard = () => { if (cover !== "closed") return; setCover("opening"); sfx.clip(); later(() => sfx.flip(), 140); later(() => setCover("open"), 640); };
  const pickTool = k => { setTool(t => (t === k ? null : k)); setPt(null); setHoverErr(null); setPress(0); k === "lens" ? sfx.pop() : sfx.pick(); };
  const markFound = k => {
    if (found.includes(k)) return;
    setFound(f => [...f, k]); sfx.alert();
    typeOut("obs-" + k, obsText[k]);
  };
  const fix = k => {
    if (typing || fixed.includes(k)) return;
    const e = remessa.find(r => r.err?.key === k).err;
    typeOut("fix-" + k, e.fix, () => { setFixed(f => [...f, k]); sfx.bell(); });
  };
  const doPrint = () => { setPrint("printing"); sfx.print(18); later(() => setPrint("ready"), 1650); };
  const reset = () => {
    gen.current++; queue.current = Promise.resolve(); sfx.flip();
    setCover("closed"); setTool(null); setPt(null); setFound([]); setTyped({}); setTyping(null); setFixed([]); setPrint("none"); setDrag(null); setNote(null); setStamps([]); setFlash(null);
  };

  const where = e => { const r = sheetRef.current.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height }; };
  const onSheetMove = e => {
    if (e.type === "pointerdown") downAt.current = { x: e.clientX, y: e.clientY };
    if (!tool) return;
    setPt(where(e));
    if (tool === "lens") {
      const el = document.elementFromPoint(e.clientX, e.clientY)?.closest?.("[data-err]");
      const k = el && !fixed.includes(el.dataset.err) ? el.dataset.err : null;
      if (k !== hoverErr) { setHoverErr(k); if (k && !found.includes(k)) sfx.scan(); }
    }
  };
  const onSheetClick = e => {
    if (!tool) return;
    if (tool === "lens") {
      if (e.target.closest("button")) return;
      const at = downAt.current || { x: e.clientX, y: e.clientY };
      const el = document.elementFromPoint(at.x, at.y)?.closest?.("[data-err]") || e.target.closest("[data-err]");
      if (el && !fixed.includes(el.dataset.err)) markFound(el.dataset.err);
      else if (e.target.closest(".sRow:not(.head)")) { sfx.scan(); say("Esse campo está ok."); }
      return;
    }
    const p = where(downAt.current ? { clientX: downAt.current.x, clientY: downAt.current.y } : e);
    setStamps(s => [...s.slice(-89), { id: `${Date.now()}-${Math.random()}`, x: (p.x / p.w) * 100, y: (p.y / p.h) * 100, r: nextRot, k: tool }]);
    setNextRot(Math.round(Math.random() * 12 - 6));
    setPress(n => n + 1); sfx.thump();
    const n = stamps.length + 1;
    if (tool === "ok" && !allFixed) say("Aprovar com erro? Isso voltaria do banco.");
    else if (n === 1 && tool === "no" && allFixed) say("Negado. Fica registrado do mesmo jeito.");
  };

  const onNoteDown = e => { if (print !== "ready") return; e.currentTarget.setPointerCapture(e.pointerId); setDrag({ x0: e.clientX, y0: e.clientY, dx: 0, dy: 0, moved: false }); };
  const onNoteMove = e => {
    if (!drag) return;
    const dx = e.clientX - drag.x0, dy = e.clientY - drag.y0, moved = drag.moved || Math.hypot(dx, dy) > 6;
    if (moved && !drag.moved) sfx.tear();
    setDrag({ ...drag, dx, dy, moved });
  };
  const place = (x, y, wPct = 22, hPct = 26) => { setNote({ x: Math.max(0, Math.min(x, 99 - wPct)), y: Math.max(0, Math.min(y, 99 - hPct)), r: (Math.random() * 6 - 3).toFixed(1) }); setPrint("placed"); sfx.drop(1); };
  const onNoteUp = e => {
    if (!drag) return;
    const sr = sheetRef.current.getBoundingClientRect(), nr = e.currentTarget.getBoundingClientRect();
    const cx = nr.left + nr.width / 2, cy = nr.top + nr.height / 2, wp = (nr.width / sr.width) * 100, hp = (nr.height / sr.height) * 100;
    if (!drag.moved) { sfx.tear(); const s = sheetRef.current.querySelector(".receiptSlot").getBoundingClientRect(); place(((s.left - sr.left) / sr.width) * 100, ((s.top - sr.top) / sr.height) * 100, wp, hp); }
    else if (cx > sr.left && cx < sr.right && cy > sr.top && cy < sr.bottom) place(((nr.left - sr.left) / sr.width) * 100, ((nr.top - sr.top) / sr.height) * 100, wp, hp);
    else sfx.pop();
    setDrag(null);
  };

  const receiptBody = <div className="receiptPaper">
    <b>LEOMADE</b><span>CONFERÊNCIA 01/11</span><span>5 títulos lidos</span><span>3 corrigidos</span><span>R$ 7.810,30</span><span className="ok">pronto ✓</span>
  </div>;

  const cellOf = (r, cell, text, reveal) => {
    const e = r.err && r.err.cell === cell ? r.err : null;
    if (!e) return <span className={`c-${cell}`}>{text}</span>;
    const k = e.key, isFixed = fixed.includes(k), n = typed["fix-" + k];
    const state = isFixed ? "fixedCell" : found.includes(k) ? "flag marked" : reveal ? "flag" : "";
    return <span className={`c-${cell} errCell ${state}`} data-err={reveal ? undefined : k}>
      {n ? <em className="typed">{e.fix.slice(0, n)}{typing === "fix-" + k && <i className="caret" />}</em> : text}
    </span>;
  };
  const renderSheet = reveal => <div className={`sheet ${reveal ? "clone" : ""} ${!reveal && tool ? "tool-" + tool : ""}`} ref={reveal ? undefined : sheetRef} aria-hidden={reveal || undefined}
    onPointerMove={reveal ? undefined : onSheetMove} onPointerDown={reveal ? undefined : onSheetMove} onPointerLeave={reveal ? undefined : () => { setPt(null); setHoverErr(null); }} onClick={reveal ? undefined : onSheetClick}
    style={reveal ? { width: pt?.w } : undefined}>
    <div className="sheetHead"><div><span>REMESSA · 01/11 · 5 TÍTULOS</span><strong>Pagamentos do dia</strong></div><div className="sheetMeta">PAGADOR · BANCO 001<br />CONFERENTE · VOCÊ</div></div>
    <div className="sRow head"><span>Nº</span><span>Fornecedor</span><span>Forma</span><span>R$</span></div>
    {remessa.map(r => <div key={r.id} className="sRow">
      <span className="mono">{r.id}</span>
      <span className="who"><b>{r.who}</b>{cellOf(r, "det", r.det, reveal)}</span>
      {cellOf(r, "how", r.how, reveal)}
      {cellOf(r, "val", r.val, reveal)}
    </div>)}
    <div className="sheetFoot">
      <div className="obs"><span className="sLabel">OBSERVAÇÕES DA CONFERÊNCIA</span>
        <ol>{found.map(k => { const t = obsText[k], n = typed["obs-" + k] || 0, done = fixed.includes(k); return <li key={k} className={done ? "done" : ""}>
          <em className="typed">{t.slice(0, n)}{typing === "obs-" + k && <i className="caret" />}</em>
          {!reveal && n >= t.length && !done && <button className="fixBtn" onClick={() => fix(k)} disabled={!!typing}>corrigir</button>}
          {done && <b className="okTick">CORRIGIDO</b>}
        </li>; })}{!found.length && <li className="empty">Nenhuma até agora.</li>}</ol>
      </div>
      <div className="sideFoot">
        <div className="sTotal"><span>TOTAL</span><b>{fixed.includes("valor") ? <em className="typed">7.810,30</em> : "7.900,30"}</b></div>
        <div className="receiptSlot"><span>COLE AQUI<br />O COMPROVANTE</span></div>
      </div>
    </div>
    {note && <div className="receipt placed" style={{ left: `${note.x}%`, top: `${note.y}%`, "--r": `${note.r}deg` }}>{receiptBody}</div>}
    <div className="stampLayer">{stamps.map(s => <StampInk key={s.id} s={s} />)}</div>
    {!reveal && pt && tool === "lens" && (() => { const R = pt.w < 520 ? 50 : 64, S = 1.7, hx = R + (R + 20) * .707; return <div className="lensWrap" style={{ left: pt.x - R, top: pt.y - R, width: 2 * R, height: 2 * R }}>
      <i className="lensHandle" style={{ left: hx - 8, top: hx - 28 }} />
      <div className="lensGlass"><div className="lensView" style={{ width: pt.w, transform: `translate(${R - pt.x * S}px, ${R - pt.y * S}px) scale(${S})` }}>{renderSheet(true)}</div></div>
    </div>; })()}
    {!reveal && pt && (tool === "ok" || tool === "no") && <div className={`stampGhost ${tool}`} style={{ left: pt.x, top: pt.y, "--r": `${nextRot}deg` }}><i key={"s" + press} className="ghostShadow" /><div key={press} className={`ghostInner ${press ? "hit" : ""}`}><StampArt kind={tool} /></div></div>}
  </div>;

  const n = stamps.length;
  const hint = flash || (!isOpen ? "Uma prancheta nova chegou na mesa."
    : tool === "lens" ? (hoverErr && !found.includes(hoverErr) ? "Opa. Clique para marcar." : "Passe a lupa. O que estiver errado fica vermelho.")
    : !found.length && !n ? "Pegue a lupa e procure o que não fecha."
    : !allFixed ? (found.length < 3 ? "Ainda tem coisa errada nessa remessa." : "Tudo marcado. Agora é corrigir.")
    : print === "none" ? "Tudo certo. Imprima o comprovante."
    : print === "printing" ? "Imprimindo…"
    : print === "ready" ? "Destaque a nota e cole na folha."
    : n >= 30 ? `${n} carimbadas. Esse papel já virou arte.`
    : n >= 12 ? `${n} carimbadas. Ninguém vai dizer que não foi conferido.`
    : n ? "Pode carimbar quantas vezes quiser." : "Agora escolha um carimbo.");

  const lensDock = where => <div className={`lensDock ${where} ${tool === "lens" ? "out" : ""}`}>
    <span className="rackHead">LUPA</span>
    <div className={`dockTray ${isOpen && tool !== "lens" && found.length < 3 ? "calling" : ""}`}>
      <button className="lensTool" onClick={() => pickTool("lens")} disabled={!isOpen} aria-pressed={tool === "lens"} aria-label={tool === "lens" ? "Devolver a lupa" : "Pegar a lupa"}><span className="lensArt"><i className="lHandle" /><i className="lGlass" /></span></button>
      {isOpen && tool !== "lens" && found.length < 3 && <span className="guide"><PixelHand /><em>{found.length ? "ainda tem erro" : "pegue a lupa"}</em></span>}
      {tool === "lens" && <em className="dockNote">clique aqui para devolver</em>}
    </div>
  </div>;

  return <div className="projectVisual toyVisual deskVisual" data-noswipe>
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true"><filter id="inkRough"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n" /><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" result="d" /><feTurbulence type="fractalNoise" baseFrequency="0.45" numOctaves="1" seed="9" result="n2" /><feColorMatrix in="n2" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -1.4 0 0 0 1.45" result="m" /><feComposite in="d" in2="m" operator="in" /></filter></svg>
    <div className="toyTop"><span className="toyEyebrow">MESA DE CONFERÊNCIA</span><span className="toyHint" key={hint}>{hint}</span></div>
    <div className="inspectGrid">
      <aside className="deskRules">
        <div className="rulebook"><span className="rbHead">REGRAS DO DIA</span><ol>{deskRules.map((r, i) => <li key={r.k} className={fixed.includes(r.k) ? "done" : ""}><b>0{i + 1}</b>{r.t}</li>)}</ol></div>
        <div className="rulesSide">
          {lensDock("inRules")}
          {isOpen && <div className={`foundCount ${found.length === 3 ? "all" : ""}`}><span>ERROS<br />ACHADOS</span><b>{found.length}/3</b></div>}
        </div>
      </aside>
      <div className={`clipboard cover-${cover}`}>
        <div className="clip"><i /></div>
        {renderSheet(false)}
        {cover !== "open" && <button className="cover" onClick={openBoard} aria-label="Abrir prancheta">
          <span className="coverLabel"><small>REMESSA 01/11</small><strong>Pagamentos do dia</strong><small>5 títulos</small></span>
          <span className="coverStamp">PARA CONFERÊNCIA</span>
        </button>}
        {cover === "closed" && <span className="guide coverGuide"><em>abra a prancheta</em><PixelHand dir="down" /></span>}
      </div>
      <aside className="deskTools">
        <div className="stampRack"><span className="rackHead">CARIMBOS <b>{n}</b></span>
          <div className={`rackRow ${note && !n && tool !== "ok" && tool !== "no" ? "nudge" : ""}`}>{["ok", "no"].map(k => <button key={k} className={`stampTool ${k} ${tool === k ? "inHand" : ""}`} onClick={() => pickTool(k)} disabled={!isOpen} aria-pressed={tool === k}><span className="rackArt"><StampArt kind={k} /></span><span>{stampLabel[k]}</span></button>)}</div>
        </div>
        <div className="printZone">
          <div className={`printer p-${print}`}>
            <div className="printerBody"><span className="pName">TERMAL</span><span className="led" /><span className="slot" /></div>
            <div className="printMouth">{(print === "printing" || print === "ready") && <div className={`receipt ${drag?.moved ? "dragging" : ""}`} style={drag ? { transform: `translate(${drag.dx}px, ${drag.dy}px) rotate(${drag.moved ? -3 : 0}deg)` } : undefined}
              onPointerDown={onNoteDown} onPointerMove={onNoteMove} onPointerUp={onNoteUp} onPointerCancel={() => setDrag(null)}>{receiptBody}<i className="perf" /></div>}</div>
          </div>
          {print === "none" && <button className={`primaryAction ${allFixed ? "nudge" : ""}`} onClick={doPrint} disabled={!allFixed}>Imprimir comprovante</button>}
          {print === "ready" && <span className="tearHint">Arraste a nota até a folha</span>}
          {isOpen && <button className="ghostAction" onClick={reset}>Nova remessa</button>}
        </div>
        {lensDock("inTools")}
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
