"use client";

import { useState } from "react";

/* OS Fácil, resumido: abrir OS por tipo de aparelho, andar com cada atendimento e ver os gráficos se mexerem junto. */
const stages = ["Recebida", "Diagnóstico", "Pronta", "Entregue"];
const kinds = {
  cel: { label: "Celular", defects: ["Troca de tela", "Bateria", "Conector de carga"], color: "#2f7a4f" },
  pc: { label: "Computador", defects: ["Não liga", "Formatação", "Limpeza interna"], color: "#9bb36f" },
  game: { label: "Videogame", defects: ["Controle com drift", "Superaquecendo", "Leitor de disco"], color: "#d4974a" },
};
const clients = ["Marina Souza", "Carlos Lima", "Júlia Prado", "Rafael Dias"];
const startOrders = [
  { n: 48, kind: "cel", defect: "Troca de tela", client: "Marina Souza", stage: 0 },
  { n: 47, kind: "pc", defect: "Limpeza interna", client: "Carlos Lima", stage: 1 },
  { n: 46, kind: "game", defect: "Controle com drift", client: "Rafael Dias", stage: 2 },
  { n: 45, kind: "cel", defect: "Bateria", client: "Júlia Prado", stage: 3 },
  { n: 44, kind: "pc", defect: "Não liga", client: "Marina Souza", stage: 3 },
  { n: 43, kind: "cel", defect: "Conector de carga", client: "Carlos Lima", stage: 2 },
];
const days = ["Seg", "Ter", "Qua", "Qui", "Hoje"];
const baseIn = [3, 5, 2, 4, 1];
const baseOut = [2, 3, 4, 2, 0];

/* Curva suave (Catmull-Rom) entre os pontos, para a linha não ficar quebrada. */
function smooth(points) {
  return points.reduce((d, [x, y], i, a) => {
    if (!i) return `M${x},${y}`;
    const [x0, y0] = a[i - 2] || a[i - 1], [x1, y1] = a[i - 1], [x3, y3] = a[i + 1] || [x, y];
    return `${d} C${x1 + (x - x0) / 6},${y1 + (y - y0) / 6} ${x - (x3 - x1) / 6},${y - (y3 - y1) / 6} ${x},${y}`;
  }, "");
}

function WeekChart({ series }) {
  const W = 600, H = 150, top = 16, bottom = 12, max = Math.max(...series.flatMap(s => s.values), 1);
  const pts = values => values.map((v, i) => [(i / (values.length - 1)) * W, top + (1 - v / max) * (H - top - bottom)]);
  return <div className="ofLine"><div className="ofChartArea">
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
      <defs><linearGradient id="ofArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2f7a4f" stopOpacity=".22" /><stop offset="1" stopColor="#2f7a4f" stopOpacity="0" /></linearGradient></defs>
      {[0, 0.5, 1].map(g => <line key={g} x1="0" x2={W} y1={top + g * (H - top - bottom)} y2={top + g * (H - top - bottom)} className="ofGrid" />)}
      <path d={`${smooth(pts(series[0].values))} L${W},${H} L0,${H} Z`} fill="url(#ofArea)" />
      {series.map(s => <path key={s.name} d={smooth(pts(s.values))} className={`ofStroke ${s.cls}`} />)}
    </svg>
    <div className="ofPlot">{series.map(s => pts(s.values).map(([x, y], i) => <span key={s.name + i} className={`ofDot ${s.cls} ${i === s.values.length - 1 ? "last" : ""}`} style={{ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` }}>{i === s.values.length - 1 && <b>{s.values[i]}</b>}</span>))}</div></div>
    <div className="ofDays">{days.map(d => <span key={d}>{d}</span>)}</div>
  </div>;
}

function KindIcon({ kind }) {
  if (kind === "cel") return <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="4.5" y="1.5" width="7" height="13" rx="1.6" /><path d="M7 12.4h2" /></svg>;
  if (kind === "pc") return <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2.5" y="3" width="11" height="7.5" rx="1" /><path d="M1 13h14" /></svg>;
  return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 5h7a3 3 0 0 1 3 3v.5a2.5 2.5 0 0 1-4.4 1.6L9.5 9.5h-3l-.6.6A2.5 2.5 0 0 1 1.5 8.5V8a3 3 0 0 1 3-3Z" /><path d="M4.5 7v2M3.5 8h2" /></svg>;
}
const Stage = ({ stage }) => <i className={`ofStage s${stage}`}>{stages[stage]}</i>;
const code = n => `#${String(n).padStart(3, "0")}`;

export default function OsFacilDemo() {
  const [orders, setOrders] = useState(startOrders);
  const [view, setView] = useState("os");
  const [filter, setFilter] = useState(null);
  const [clientFilter, setClientFilter] = useState(null);
  const [open, setOpen] = useState(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState({ kind: "cel", defect: null, client: null });
  const [fresh, setFresh] = useState(null);
  const [delivered, setDelivered] = useState(0);
  const created = orders.length - startOrders.length;

  const counts = stages.map((_, i) => orders.filter(o => o.stage === i).length);
  const shown = orders.filter(o => (filter === null || o.stage === filter) && (!clientFilter || o.client === clientFilter));
  const current = orders.find(o => o.n === open);
  const nextNumber = Math.max(...orders.map(o => o.n)) + 1;

  const advance = n => {
    const target = orders.find(o => o.n === n);
    if (!target || target.stage >= 3) return;
    if (target.stage === 2) setDelivered(d => d + 1);
    setOrders(list => list.map(o => o.n === n ? { ...o, stage: o.stage + 1 } : o));
  };
  const startNew = () => { setCreating(true); setOpen(null); setView("os"); setDraft({ kind: "cel", defect: null, client: null }); };
  const createOrder = () => {
    if (!draft.defect || !draft.client) return;
    setOrders(list => [{ n: nextNumber, kind: draft.kind, defect: draft.defect, client: draft.client, stage: 0 }, ...list]);
    setFresh(nextNumber); setCreating(false); setFilter(null); setClientFilter(null);
  };
  const goto = next => { setView(next); setCreating(false); setOpen(null); };
  const kindTotals = Object.keys(kinds).map(k => ({ k, v: orders.filter(o => o.kind === k).length }));
  let acc = 0;
  const donut = kindTotals.map(({ k, v }) => { const from = acc; acc += (v / orders.length) * 100; return `${kinds[k].color} ${from}% ${acc}%`; }).join(", ");
  const series = [
    { name: "Entradas", cls: "in", values: baseIn.map((v, i) => i === baseIn.length - 1 ? v + created : v) },
    { name: "Entregas", cls: "out", values: baseOut.map((v, i) => i === baseOut.length - 1 ? v + delivered : v) },
  ];

  return <div className="projectVisual osVisual ofVisual" data-noswipe>
    <div className="ofApp">
      <div className="ofBar"><span className="ofDots" aria-hidden="true"><i /><i /><i /></span><span>OS Fácil · Assistência Ponto Certo</span><span className="ofOffline">OFFLINE ●</span></div>
      <div className="ofBody">
        <nav className="ofNav" aria-label="Seções do OS Fácil">
          <strong className="ofBrand">os<span>fácil.</span></strong>
          {[["os", "Ordens de serviço"], ["clientes", "Clientes"], ["graficos", "Relatórios"]].map(([id, label]) => <button key={id} className={view === id ? "on" : ""} aria-pressed={view === id} onClick={() => goto(id)}>{label}</button>)}
        </nav>

        <div className="ofMain">
          {view === "os" && !creating && !current && <>
            <div className="ofHeading"><h4>{clientFilter ? `OS de ${clientFilter}` : "Ordens de serviço"}</h4><button className="ofNew" onClick={startNew}>+ Nova OS</button></div>
            <div className="ofFilters" role="group" aria-label="Filtrar por etapa">
              <button className={filter === null ? "on" : ""} onClick={() => setFilter(null)}>Todas <b>{orders.length}</b></button>
              {stages.map((s, i) => <button key={s} className={filter === i ? "on" : ""} onClick={() => setFilter(filter === i ? null : i)}>{s} <b>{counts[i]}</b></button>)}
              {clientFilter && <button className="on" onClick={() => setClientFilter(null)}>{clientFilter.split(" ")[0]} ✕</button>}
            </div>
            <ul className="ofRows">{shown.map(o => <li key={o.n}><button className={fresh === o.n ? "fresh" : ""} onClick={() => setOpen(o.n)}>
              <span className="ofCode">{code(o.n)}</span>
              <span className="ofKind" style={{ "--k": kinds[o.kind].color }}><KindIcon kind={o.kind} /></span>
              <span className="ofWhat"><strong>{o.defect}</strong><small>{o.client}</small></span>
              <Stage stage={o.stage} />
            </button></li>)}
              {!shown.length && <li className="ofEmpty">Nenhuma OS nessa etapa.</li>}
            </ul>
            <p className="ofHint">Toque numa OS para andar com o atendimento.</p>
          </>}

          {view === "os" && current && <div className="ofDetail">
            <button className="ofBack" onClick={() => setOpen(null)}>← Voltar</button>
            <div className="ofDetailHead"><span className="ofKind big" style={{ "--k": kinds[current.kind].color }}><KindIcon kind={current.kind} /></span><div><small>OS {code(current.n)} · {kinds[current.kind].label}</small><h4>{current.defect}</h4><span>{current.client}</span></div></div>
            <ol className="ofTrack">{stages.map((s, i) => <li key={s} className={i < current.stage ? "done" : i === current.stage ? "now" : ""}><b>{i < current.stage ? "✓" : i + 1}</b>{s}</li>)}</ol>
            <button className="ofPrimary" onClick={() => advance(current.n)} disabled={current.stage === 3}>{current.stage === 3 ? "Atendimento finalizado ✓" : `Mover para ${stages[current.stage + 1]} →`}</button>
            <p className="ofHint">{["O aparelho entrou e já tem dono, defeito e número.", "O técnico registra o que encontrou.", "O cliente pode ser avisado para buscar.", "Fica no histórico do cliente."][current.stage]}</p>
          </div>}

          {view === "os" && creating && <div className="ofForm">
            <div className="ofHeading"><h4>Nova OS {code(nextNumber)}</h4><button className="ofBack" onClick={() => setCreating(false)}>Cancelar</button></div>
            <span className="ofLabel">1 · Que aparelho entrou?</span>
            <div className="ofChips">{Object.entries(kinds).map(([k, info]) => <button key={k} className={draft.kind === k ? "on" : ""} onClick={() => setDraft({ ...draft, kind: k, defect: null })}><span className="ofKind" style={{ "--k": info.color }}><KindIcon kind={k} /></span>{info.label}</button>)}</div>
            <span className="ofLabel">2 · Qual o defeito?</span>
            <div className="ofChips">{kinds[draft.kind].defects.map(d => <button key={d} className={draft.defect === d ? "on" : ""} onClick={() => setDraft({ ...draft, defect: d })}>{d}</button>)}</div>
            <span className="ofLabel">3 · De quem é?</span>
            <div className="ofChips">{clients.map(c => <button key={c} className={draft.client === c ? "on" : ""} onClick={() => setDraft({ ...draft, client: c })}>{c}</button>)}</div>
            <button className="ofPrimary" onClick={createOrder} disabled={!draft.defect || !draft.client}>{draft.defect && draft.client ? `Abrir OS ${code(nextNumber)} →` : "Escolha o defeito e o cliente"}</button>
          </div>}

          {view === "clientes" && <>
            <div className="ofHeading"><h4>Clientes</h4><span className="ofMuted">{clients.length} cadastrados</span></div>
            <ul className="ofRows ofClients">{clients.map(c => {
              const mine = orders.filter(o => o.client === c);
              const openOnes = mine.filter(o => o.stage < 3).length;
              return <li key={c}><button onClick={() => { setClientFilter(c); setFilter(null); setView("os"); }}>
                <span className="ofInitial" aria-hidden="true">{c[0]}</span>
                <span className="ofWhat"><strong>{c}</strong><small>{mine.length} {mine.length === 1 ? "OS" : "OS no histórico"}</small></span>
                <i className={`ofStage ${openOnes ? "s1" : "s3"}`}>{openOnes ? `${openOnes} em aberto` : "Tudo entregue"}</i>
              </button></li>;
            })}</ul>
            <p className="ofHint">Toque num cliente para ver as OS dele.</p>
          </>}

          {view === "graficos" && <>
            <div className="ofHeading"><h4>Relatórios</h4><span className="ofMuted">{orders.length} OS no total</span></div>
            <div className="ofCharts">
              <figure className="ofCard">
                <figcaption>Por etapa</figcaption>
                <ul className="ofHBars">{stages.map((s, i) => <li key={s}><span>{s}</span><i style={{ "--w": `${(counts[i] / Math.max(...counts)) * 100}%` }} className={`s${i}`} /><b>{counts[i]}</b></li>)}</ul>
              </figure>
              <figure className="ofCard">
                <figcaption>Por aparelho</figcaption>
                <div className="ofDonutWrap"><div className="ofDonut" style={{ background: `conic-gradient(${donut})` }} role="img" aria-label={kindTotals.map(({ k, v }) => `${kinds[k].label}: ${v}`).join(", ")}><span>{orders.length}</span></div>
                  <ul className="ofLegend">{kindTotals.map(({ k, v }) => <li key={k}><i style={{ background: kinds[k].color }} />{kinds[k].label}<b>{v}</b></li>)}</ul></div>
              </figure>
              <figure className="ofCard wide">
                <figcaption>Entradas e entregas na semana<span className="ofKey"><i className="in" />Entradas<i className="out" />Entregas</span></figcaption>
                <WeekChart series={series} />
              </figure>
            </div>
            <p className="ofHint">{created || delivered ? "O que você fez no exemplo já entrou nos gráficos." : "Abra uma OS ou entregue um atendimento e volte aqui: os gráficos acompanham."}</p>
          </>}
        </div>
      </div>
    </div>
    <span className="visualCaption">EXEMPLO INTERATIVO · DADOS FICTÍCIOS</span>
  </div>;
}
