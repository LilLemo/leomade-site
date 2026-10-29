"use client";

import { useEffect, useRef, useState } from "react";
import { projects } from "./projects";
import ProjectVisual from "./ProjectVisual";
import { useProjectDetail } from "./ProjectDetail";

export { ProjectVisual };

export default function ProjectExperience({ personal = false }) {
  const collection = personal ? projects : projects.slice(0, 3);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [seen, setSeen] = useState([collection[0].id]);
  const { open: setDetail } = useProjectDetail();
  const selectorNav = useRef(null);
  const pointer = useRef(null);
  const project = collection[index];
  const choose = (next) => {
    const valid = (next + collection.length) % collection.length;
    setIndex(valid);
    setSeen(current => current.includes(collection[valid].id) ? current : [...current, collection[valid].id]);
  };
  useEffect(() => {
    const nav = selectorNav.current;
    const selected = nav?.children[index];
    if (nav && selected && nav.scrollWidth > nav.clientWidth) {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      nav.scrollTo({ left: selected.offsetLeft - nav.offsetLeft - (nav.clientWidth - selected.clientWidth) / 2, behavior: reduced ? "instant" : "smooth" });
    }
  }, [index]);
  return <section className={`projectLab ${paused ? "motionPaused" : ""}`} id="laboratorio" tabIndex={-1} aria-labelledby="lab-title">
    <div className="labIntro"><div><p className="monoLabel">{personal ? "03 / PROJETOS EM DETALHE" : "MEU LABORATÓRIO"}</p><h2 id="lab-title">{personal ? <>Agora, de perto.<br /><em>Experimente.</em></> : <>É melhor quando<br /><em>você experimenta.</em></>}</h2></div><p>{personal ? "Produtos que criei e cases do trabalho, lado a lado. Escolha um, brinque com o exemplo e entre para ver minhas decisões e onde cada um está." : "Meus projetos começam com um “e se?”. Escolha uma ideia, brinque com o exemplo e veja como estou tirando cada uma do papel."}</p></div>
    <div className={`projector tone-${project.color}`} onKeyDown={e => { if (e.target.tagName !== "INPUT" && (e.key === "ArrowRight" || e.key === "ArrowLeft")) { e.preventDefault(); choose(index + (e.key === "ArrowRight" ? 1 : -1)); } }}>
      <div className="projectorChrome"><span><i /> PROJETOR DE IDEIAS</span><button onClick={() => setPaused(!paused)} aria-pressed={paused}>{paused ? "Retomar movimento ▷" : "Pausar movimento Ⅱ"}</button></div>
      <div className="projectorBody"><nav ref={selectorNav} className="projectIndex" aria-label="Escolher projeto">{collection.map((item, i) => <button key={item.id} className={index === i ? "selected" : ""} aria-pressed={index === i} onClick={() => choose(i)} onPointerEnter={e => { if (e.pointerType === "mouse") choose(i); }} onFocus={() => choose(i)}><span>{item.number}</span><strong>{item.title}</strong><i>↗</i></button>)}<span className="indexHint">ESCOLHA UMA IDEIA<br />E VEJA O QUE ACONTECE.</span></nav>
        <div className={`projectScreen ${project.type === "embate" ? "hasEmbate" : ""}`} onPointerDown={e => { pointer.current = null; if (!e.target.closest("button, input, a, .embateImageFrame, .embateViews")) pointer.current = { x: e.clientX, y: e.clientY }; }} onPointerUp={e => { if (!pointer.current) return; const dx = e.clientX - pointer.current.x; const dy = e.clientY - pointer.current.y; if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) choose(index + (dx < 0 ? 1 : -1)); pointer.current = null; }} onPointerCancel={() => { pointer.current = null; }}>
          <div className="scene" key={project.id}><div className="sceneMeta"><span>{project.category}</span><span className="statusPill">{project.status}</span></div><ProjectVisual project={project} /><div className="sceneInfo"><div><span className="monoLabel">{project.number} / {String(collection.length).padStart(2, "0")}</span><h3>{project.short}</h3></div><button className="storyButton" onClick={() => setDetail(project)}>Entrar na ideia <span>↗</span></button></div></div>
        </div>
      </div>
      <div className="projectorBottom"><span>{seen.length}/{collection.length} IDEIAS EXPLORADAS</span><span className="swipeHint">DESLIZE PARA EXPLORAR ↔</span><div><button aria-label="Projeto anterior" onClick={() => choose(index - 1)}>←</button><button aria-label="Próximo projeto" onClick={() => choose(index + 1)}>→</button></div></div>
    </div>
    {!personal && <a className="allProjectsLink" href="/leo#laboratorio">Conheça também meus trabalhos com processos, dados e IA <span>↗</span></a>}
  </section>;
}
