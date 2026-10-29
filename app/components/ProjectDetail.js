"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import ProjectVisual from "./ProjectVisual";
import { projects } from "./projects";

const DetailContext = createContext({ open: () => {} });
export const useProjectDetail = () => useContext(DetailContext);

// One dialog per page, opened from the projector, the impact map or the reuse line.
export function ProjectDetailProvider({ children }) {
  const [detail, setDetail] = useState(null);
  const dialog = useRef(null);
  const opener = useRef(null);
  const open = useCallback(project => {
    const item = typeof project === "string" ? projects.find(p => p.id === project) : project;
    if (!item) return;
    opener.current = document.activeElement;
    setDetail(item);
  }, []);
  useEffect(() => {
    if (!detail || !dialog.current) return;
    if (!dialog.current.open) dialog.current.showModal();
    dialog.current.scrollTop = 0;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [detail]);
  const close = () => dialog.current?.close();
  const related = detail ? projects.filter(p => p.professional && p.id !== detail.id) : [];
  return <DetailContext.Provider value={{ open }}>
    {children}
    <dialog ref={dialog} className="projectDialog" onClose={() => { setDetail(null); opener.current?.focus?.({ preventScroll: true }); }} onClick={e => { if (e.target === e.currentTarget) close(); }} aria-labelledby="project-detail-title">
      {detail && <div className={`dialogInner tone-${detail.color}`}><div className="dialogTop"><span className="monoLabel">LEOMADE / {detail.category}</span><button onClick={close} aria-label="Fechar detalhes do projeto">Fechar ×</button></div><div className="dialogHeading"><span className="statusPill">{detail.status}</span><h2 id="project-detail-title">{detail.title}</h2><p>{detail.question}</p></div><ProjectVisual key={detail.id} project={detail} /><div className="projectStory">{[["O problema", detail.problem], ["Meu papel", detail.role], ["Onde estou", detail.outcome]].map(([heading, text]) => <div key={heading}><h3>{heading}</h3><p>{text}</p></div>)}</div>{detail.premises && <div className="casePremises"><h3>As premissas que guiaram meu trabalho</h3><ul>{detail.premises.map(item => <li key={item}>{item}</li>)}</ul>{detail.professional && <p>Reconstrução ilustrativa, com conteúdo fictício. Sem nomes, valores ou dados internos.</p>}</div>}<div className="projectTags">{detail.tags.map(tag => <span key={tag}>{tag}</span>)}</div><div className="dialogActions">{detail.url && <a className="studioButton cream" href={detail.url} target="_blank" rel="noreferrer">{detail.linkLabel} ↗</a>}{detail.repo && <a href={detail.repo} target="_blank" rel="noreferrer">Código e metodologia ↗</a>}<button onClick={close}>Voltar ←</button></div>
        {detail.professional && <nav className="dialogNext" aria-label="Outros cases"><span>OUTROS CASES</span><div>{related.map(item => <button key={item.id} onClick={() => setDetail(item)}><small>{item.number}</small>{item.title}</button>)}</div></nav>}
      </div>}
    </dialog>
  </DetailContext.Provider>;
}
