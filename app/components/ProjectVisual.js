"use client";

import { useMemo, useState } from "react";
import EmbateShowcase from "./EmbateShowcase";

// Fictional data only. Nothing here comes from a real company base.
const queue = {
  valor: [
    { id: "aprovacao", label: "Aguardando aprovação", v: 41, rows: [["#1042", "Padaria Aurora", "12 dias"], ["#1057", "Mercado Bom Fim", "9 dias"], ["#1061", "Café Duas Pontes", "4 dias"]] },
    { id: "separacao", label: "Separação", v: 24, rows: [["#1033", "Empório Serra Azul", "6 dias"], ["#1066", "Hortifruti Vila Nova", "3 dias"]] },
    { id: "transporte", label: "Transporte", v: 17, rows: [["#1018", "Armazém Lagoa", "8 dias"], ["#1070", "Doceria Primavera", "2 dias"]] },
    { id: "faturamento", label: "Faturamento", v: 13, rows: [["#1049", "Restaurante Maré Alta", "5 dias"]] },
    { id: "outros", label: "Outros", v: .6, rows: [["#1072", "Quitanda do Morro", "1 dia"]] },
  ],
  pedidos: [
    { id: "aprovacao", v: 18 }, { id: "separacao", v: 31 }, { id: "transporte", v: 12 }, { id: "faturamento", v: 9 }, { id: "outros", v: 1 },
  ],
};
const MIN_SHARE = .07;

function splitTreemap(items, x, y, w, h, out) {
  if (items.length === 1) { out.push({ ...items[0], x, y, w, h }); return out; }
  const total = items.reduce((sum, item) => sum + item.shown, 0);
  let i = 1, acc = items[0].shown;
  while (i < items.length - 1 && acc + items[i].shown <= total / 2) { acc += items[i].shown; i++; }
  const ratio = acc / total;
  if (w >= h) { splitTreemap(items.slice(0, i), x, y, w * ratio, h, out); splitTreemap(items.slice(i), x + w * ratio, y, w * (1 - ratio), h, out); }
  else { splitTreemap(items.slice(0, i), x, y, w, h * ratio, out); splitTreemap(items.slice(i), x, y + h * ratio, w, h * (1 - ratio), out); }
  return out;
}

function TreemapDemo() {
  const [metric, setMetric] = useState("valor");
  const [open, setOpen] = useState("aprovacao");
  const blocks = useMemo(() => {
    const base = queue.valor.map(item => ({ ...item, v: metric === "valor" ? item.v : queue.pedidos.find(p => p.id === item.id).v }));
    const total = base.reduce((sum, item) => sum + item.v, 0);
    const shown = base.map(item => ({ ...item, share: item.v / total, shown: Math.max(item.v, total * MIN_SHARE) })).sort((a, b) => b.shown - a.shown);
    return splitTreemap(shown, 0, 0, 160, 100, []);
  }, [metric]);
  const current = blocks.find(item => item.id === open) || blocks[0];
  return <div className="projectVisual treemapVisual">
    <div className="treemapTop"><span className="flowEyebrow">PEDIDOS PARADOS POR ETAPA</span><div className="treemapToggle" role="group" aria-label="Medir por">{[["valor", "Valor"], ["pedidos", "Pedidos"]].map(([id, label]) => <button key={id} aria-pressed={metric === id} onClick={() => setMetric(id)}>{label}</button>)}</div></div>
    <div className="treemapCanvas">{blocks.map((item, i) => <button key={item.id} className={`treemapBlock ${open === item.id ? "open" : ""}`} style={{ left: `${item.x / 1.6}%`, top: `${item.y}%`, width: `${item.w / 1.6}%`, height: `${item.h}%`, "--i": i }} aria-pressed={open === item.id} onClick={() => setOpen(item.id)}><strong>{(item.share * 100).toLocaleString("pt-BR", { maximumFractionDigits: item.share < .01 ? 1 : 0 })}%</strong><span>{item.label}</span>{item.shown > item.v && <i>tamanho mínimo</i>}</button>)}</div>
    <div className="treemapDetail" aria-live="polite"><span>MERGULHO · {current.label.toUpperCase()}</span><ul>{current.rows.map(row => <li key={row[0]}><b>{row[0]}</b>{row[1]}<i>{row[2]}</i></li>)}</ul></div>
    <span className="visualCaption">EXEMPLO INTERATIVO · DADOS FICTÍCIOS · TOQUE NOS BLOCOS</span>
  </div>;
}

const ledger = [
  { name: "Padaria Aurora Ltda", alias: "Fornecedor A", doc: "4500129873", value: 12480 },
  { name: "Transportes Rio Claro", alias: "Fornecedor B", doc: "4500130412", value: 3215.4 },
  { name: "Padaria Aurora Ltda", alias: "Fornecedor A", doc: "4500131055", value: 7902.1 },
];
const money = value => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function MaskDemo() {
  const [masked, setMasked] = useState(false);
  return <div className={`projectVisual maskVisual ${masked ? "masked" : ""}`}>
    <span className="flowEyebrow">ANTES DE QUALQUER CONVERSA COM IA</span>
    <div className="maskTable" role="table" aria-label={masked ? "Extração anonimizada" : "Extração original fictícia"}>
      <div className="maskRow maskHead" role="row"><span role="columnheader">Fornecedor<small>apelido consistente</small></span><span role="columnheader">Documento<small>máscara</small></span><span role="columnheader">Valor<small>escala</small></span></div>
      {ledger.map((row, i) => <div className="maskRow" role="row" key={row.doc} style={{ "--i": i }}>
        <span role="cell"><b key={String(masked)}>{masked ? row.alias : row.name}</b></span>
        <span role="cell"><b key={String(masked)}>{masked ? `${row.doc.slice(0, 2)}•••••${row.doc.slice(-3)}` : row.doc}</b></span>
        <span role="cell"><b key={String(masked)}>{money(masked ? row.value * .83 : row.value)}</b></span>
      </div>)}
    </div>
    <div className="maskFoot"><span className="maskLock"><i />O DE-PARA FICA SÓ NA MINHA MÁQUINA</span><span>{masked ? "Mesmo nome, mesmo apelido. Proporções preservadas." : "Nomes e documentos reais não vão para a IA."}</span></div>
    <button className="demoButton" onClick={() => setMasked(!masked)} aria-pressed={masked}>{masked ? "Voltar ao original" : "Anonimizar o exemplo"} <span>↻</span></button>
    <span className="visualCaption">EXEMPLO INTERATIVO · DADOS FICTÍCIOS</span>
  </div>;
}

export default function ProjectVisual({ project }) {
  const [step, setStep] = useState(0);
  const [people, setPeople] = useState(2);
  const [cleaned, setCleaned] = useState(false);
  const phases = project.phases || ["Importar", "Conferir", "Aprovar", "Registrar"];
  const messages = project.messages || ["O relatório entra.", "A exceção aparece.", "A decisão tem contexto.", "O histórico fica."];
  if (project.type === "os") return <div className="projectVisual osVisual">
    <div className="appWindow">
      <div className="appToolbar"><span className="appTraffic"><i /><i /><i /></span><span>OS Fácil</span><span>OFFLINE ●</span></div>
      <div className="osWorkspace"><aside><strong>os<span>fácil.</span></strong><span className="selected">Ordens de serviço</span><span>Clientes</span><span>Histórico</span></aside><div className="osMain">
        <div className="osHeading"><h4>Seu dia, organizado.</h4><span>+ Nova OS</span></div>
        <div className="osStats"><div><span>Em aberto</span><strong>{step === 2 ? "02" : "03"}</strong></div><div><span>Concluídas</span><strong>{step === 2 ? "08" : "07"}</strong></div></div>
        <div className="osRow"><span>OS #048</span><strong>Troca de tela</strong><i>{["Recebida", "Diagnóstico", "Concluída"][step]}</i></div>
        <div className="osRow"><span>OS #047</span><strong>Revisão geral</strong><i>Em andamento</i></div>
        <div className="osTimeline">{["Recebida", "Diagnóstico", "Concluída"].map((s, i) => <span key={s} className={i <= step ? "done" : ""}><b>{i <= step ? "✓" : "○"}</b>{s}</span>)}</div>
        <button className="demoButton" onClick={() => setStep((step + 1) % 3)}>{step === 2 ? "Recomeçar o atendimento" : "Avançar o atendimento"} <span>→</span></button>
      </div></div>
    </div><span className="visualCaption">EXEMPLO INTERATIVO · DADOS FICTÍCIOS</span>
  </div>;
  if (project.type === "embate") return <EmbateShowcase />;
  if (project.type === "treemap") return <TreemapDemo />;
  if (project.type === "mask") return <MaskDemo />;
  if (project.type === "komu") return <div className="projectVisual komuVisual">
    <span className="komuBackground" aria-hidden="true">juntos.</span><div className="phoneDemo">
      <div className="phoneNotch" /><div className="phoneTop">9:41 <span>● ● ▰</span></div><strong className="komuLogo">komu<span>✳</span></strong><p>As contas da casa,<br />sem complicar a vida.</p><div className="receipt"><span>Compra compartilhada</span><strong>R$ 180,00</strong><small>VALOR FICTÍCIO</small></div><div className="peopleControl"><button aria-label="Diminuir número de pessoas" disabled={people <= 2} onClick={() => setPeople(people - 1)}>−</button><span>{people} pessoas</span><button aria-label="Aumentar número de pessoas" disabled={people >= 6} onClick={() => setPeople(people + 1)}>+</button></div><div className="splitValue"><span>Para cada pessoa</span><strong>{(180 / people).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong></div>
    </div><span className="visualCaption">EXEMPLO INTERATIVO · DADOS FICTÍCIOS</span>
  </div>;
  if (project.type === "flow") return <div className="projectVisual flowVisual">
    <span className="flowEyebrow">{project.eyebrow || "DA CONFERÊNCIA À DECISÃO"}</span>
    <div className="flowBoard">{phases.map((phase, i) => <div className={`flowPhase ${i <= step ? "lit" : ""}`} key={phase}><span>0{i + 1}</span><i>{i < step ? "✓" : i === step ? "●" : "○"}</i><strong>{phase}</strong></div>)}</div>
    <div className="flowMessage" aria-live="polite"><span>ETAPA 0{step + 1}</span><h4>{messages[step]}</h4></div>
    <button className="demoButton" onClick={() => setStep((step + 1) % 4)}>{step === 3 ? "Recomeçar o fluxo" : "Percorrer o fluxo"} →</button><span className="visualCaption">EXEMPLO SIMPLIFICADO DO FLUXO</span>
  </div>;
  return <div className="projectVisual dataVisual"><span className="flowEyebrow">{project.id === "polyblen" ? "ENCONTRAR PADRÕES COMEÇA COM CONTEXTO" : "DADOS MELHORES. DECISÕES MELHORES."}</span><div className={`dataField ${cleaned ? "organized" : ""}`}>{Array.from({ length: 30 }, (_, i) => <i key={i} style={{ "--i": i, "--scatter-x": `${Math.sin(i * 3.7) * 30}px`, "--scatter-y": `${Math.cos(i * 2.3) * 32}px` }}>{cleaned ? "✓" : i % 5 === 0 ? "?" : "·"}</i>)}</div><h4>{cleaned ? "Agora dá para fazer perguntas." : "O primeiro passo é organizar."}</h4><button className="demoButton" onClick={() => setCleaned(!cleaned)}>{cleaned ? "Voltar à origem" : "Organizar o exemplo"} ↗</button><span className="visualCaption">EXEMPLO VISUAL · DADOS FICTÍCIOS</span></div>;
}
