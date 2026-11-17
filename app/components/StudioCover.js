"use client";

import CitrusPrint from "./CitrusPrint";
import { projects } from "./projects";
import { useProjectDetail } from "./ProjectDetail";

const selection = [
  ["embate", "Dados públicos", "Salário mínimo e cesta básica, governo a governo."],
  ["osfacil", "Software de gestão", "O caminho de um serviço, da entrada à entrega."],
  ["relatorios", "Experimento de dados", "Uma planilha que você pode explorar por dentro."]
];

export default function StudioCover() {
  const { open } = useProjectDetail();
  return <>
    <section className="editionCover" id="inicio" aria-labelledby="studio-start">
      <div className="editionIntro">
        <p className="editionLabel">Estúdio independente · São Paulo</p>
        <h1 id="studio-start">Leo<span>made</span><i>.</i></h1>
        <p className="editionText">Sou o Léo. Faço software com IA e transformo dados em ferramentas que você pode experimentar aqui.</p>
        <a className="editionButton" href="#selecao">Mergulhe na curiosidade <span aria-hidden="true">↓</span></a>
      </div>
      <figure className="editionPoster">
        <div className="posterFrame"><span className="posterTop">LEOMADE <b>✳</b></span><CitrusPrint /><figcaption>Made with curiosity</figcaption></div>
      </figure>
    </section>
    <section className="editionSelection" id="selecao" aria-labelledby="selection-title">
      <div className="editionRule"><h2 id="selection-title">Seleção do estúdio</h2><a href="#laboratorio">Todos os projetos ↓</a></div>
      <div className="editionCases">{selection.map(([id, category, copy]) => {
        const project = projects.find(item => item.id === id);
        return <button key={id} className={'editionCard tile-' + id} onClick={() => open(project)}>
          <span className="tileArt" aria-hidden="true"><b/><b/><b/><b/><b/></span>
          <small>{category}</small><strong>{project.title}</strong><span className="tileCopy">{copy}</span><span className="tileArrow" aria-hidden="true">↗</span>
        </button>;
      })}</div>
    </section>
  </>;
}
