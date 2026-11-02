"use client";

import { useState } from "react";
import EmbateShowcase from "./EmbateShowcase";
import Orchestra from "./Orchestra";
import Pastelaria from "./Pastelaria";
import { StampDesk, ClosingHub, Switchboard } from "./CaseToys";
import KomuDemo from "./KomuDemo";
import OsFacilDemo from "./OsFacilDemo";

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
  const [cleaned, setCleaned] = useState(false);
  const phases = project.phases || ["Importar", "Conferir", "Aprovar", "Registrar"];
  const messages = project.messages || ["O relatório entra.", "A exceção aparece.", "A decisão tem contexto.", "O histórico fica."];
  if (project.type === "os") return <OsFacilDemo />;
  if (project.type === "embate") return <EmbateShowcase />;
  if (project.type === "treemap") return <Orchestra />;
  if (project.type === "stamp") return <StampDesk />;
  if (project.type === "mold") return <ClosingHub />;
  if (project.type === "ticket") return <Pastelaria />;
  if (project.type === "switchboard") return <Switchboard />;
  if (project.type === "mask") return <MaskDemo />;
  if (project.type === "komu") return <KomuDemo />;
  if (project.type === "flow") return <div className="projectVisual flowVisual">
    <span className="flowEyebrow">{project.eyebrow || "DA CONFERÊNCIA À DECISÃO"}</span>
    <div className="flowBoard">{phases.map((phase, i) => <div className={`flowPhase ${i <= step ? "lit" : ""}`} key={phase}><span>0{i + 1}</span><i>{i < step ? "✓" : i === step ? "●" : "○"}</i><strong>{phase}</strong></div>)}</div>
    <div className="flowMessage" aria-live="polite"><span>ETAPA 0{step + 1}</span><h4>{messages[step]}</h4></div>
    <button className="demoButton" onClick={() => setStep((step + 1) % 4)}>{step === 3 ? "Recomeçar o fluxo" : "Percorrer o fluxo"} →</button><span className="visualCaption">EXEMPLO SIMPLIFICADO DO FLUXO</span>
  </div>;
  return <div className="projectVisual dataVisual"><span className="flowEyebrow">{project.id === "polyblen" ? "ENCONTRAR PADRÕES COMEÇA COM CONTEXTO" : "DADOS MELHORES. DECISÕES MELHORES."}</span><div className={`dataField ${cleaned ? "organized" : ""}`}>{Array.from({ length: 30 }, (_, i) => <i key={i} style={{ "--i": i, "--scatter-x": `${Math.sin(i * 3.7) * 30}px`, "--scatter-y": `${Math.cos(i * 2.3) * 32}px` }}>{cleaned ? "✓" : i % 5 === 0 ? "?" : "·"}</i>)}</div><h4>{cleaned ? "Agora dá para fazer perguntas." : "O primeiro passo é organizar."}</h4><button className="demoButton" onClick={() => setCleaned(!cleaned)}>{cleaned ? "Voltar à origem" : "Organizar o exemplo"} ↗</button><span className="visualCaption">EXEMPLO VISUAL · DADOS FICTÍCIOS</span></div>;
}
