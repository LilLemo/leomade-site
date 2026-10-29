"use client";

import { useState } from "react";

const views = [
  { label: "Arena", image: "01-entrada-na-arena.png", width: 610, height: 565, title: "Dados econômicos com energia de arcade.", text: "Criei uma experiência inspirada nos jogos de luta dos anos 1990, com identidade visual, música 16-bit e efeitos sonoros opcionais.", alt: "Tela de entrada do Embate dos Governos com a identidade visual de arcade e opções de entrar com ou sem som." },
  { label: "Cenário", image: "02-selecao-do-embate.png", width: 1520, height: 904, title: "Você escolhe os lados. Os dados abrem a conversa.", text: "Organizei a escolha dos governos, da capital no mapa e do índice de inflação. A cobertura dos dados e a duração dos recortes ficam visíveis antes da comparação.", alt: "Interface real com dois períodos presidenciais, mapa interativo do Brasil, cobertura por capital e escolha de INPC ou IPCA." },
  { label: "Placar", image: "03-placar-dos-indicadores.png", width: 1524, height: 740, title: "Três rodadas. Critérios que você pode conferir.", text: "Separei a análise em peso da cesta no salário, ganho real e evolução da cesta. Cada rodada explica seu critério, sem contar a mesma relação matemática mais de uma vez.", alt: "Placar do Embate com três indicadores independentes e resultados destacados para cada período." },
  { label: "Inflação", image: "04-inflacao-e-resultado-final.png", width: 1480, height: 885, title: "Aumento nominal não conta a história inteira.", text: "Coloquei o reajuste do salário ao lado da inflação acumulada e do ganho real de poder de compra. Os cálculos usam regras matemáticas, com a metodologia disponível no projeto.", alt: "Detalhamento visual do reajuste nominal, inflação acumulada, ganho real e resultado final do recorte." },
  { label: "Alimentos", image: "05-raio-x-dos-alimentos.png", width: 1526, height: 893, title: "Abri a cesta para olhar alimento por alimento.", text: "No Raio-X, cada alimento tem uma escala compartilhada pelos dois períodos. Também incluí gráficos mensais, auditoria de cobertura e exportação dos dados em CSV.", alt: "Raio-X da cesta básica com gráficos comparativos de carne, leite, feijão, arroz e outros alimentos." },
];

export default function EmbateShowcase() {
  const [view, setView] = useState(1);
  const [zoom, setZoom] = useState(false);
  const current = views[view];
  return <div className="projectVisual embateShowcase" onKeyDown={e => e.stopPropagation()}>
    <div className="embateShowcaseTop"><span>EMBATE DOS GOVERNOS</span><span>DADOS × DESIGN × INTERAÇÃO</span></div>
    <nav className="embateViews" aria-label="Telas do Embate dos Governos">{views.map((item, i) => <button key={item.label} aria-pressed={view === i} onClick={() => { setView(i); setZoom(false); }}><span>0{i + 1}</span>{item.label}</button>)}</nav>
    <figure className="embateCapture"><div className={`embateImageFrame ${zoom ? "zoomed" : ""}`} tabIndex={zoom ? 0 : undefined} aria-label={zoom ? "Imagem ampliada. Role para ver os detalhes." : undefined}><img key={current.image} src={`/projects/embate/${current.image}`} width={current.width} height={current.height} alt={current.alt} loading="lazy" draggable="false" /></div><figcaption><span>TELA REAL DO MEU PROJETO</span><button onClick={() => setZoom(!zoom)} aria-pressed={zoom}>{zoom ? "Ver tela inteira ↙" : "Ampliar detalhes ↗"}</button></figcaption></figure>
    <div className="embateViewStory" aria-live="polite"><h4>{current.title}</h4><p>{current.text}</p></div>
    <div className="embateCapabilities"><span>Python + dados tratados</span><span>Mapa + gráficos</span><span>INPC / IPCA</span><span>Cálculos transparentes</span></div>
    <a className="embateLiveLink" href="https://embate-dos-governos.vercel.app/" target="_blank" rel="noreferrer">Entre na arena e explore os dados <span>↗</span></a>
  </div>;
}
