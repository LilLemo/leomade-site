"use client";
import { useEffect, useRef, useState } from "react";

const steps = [["Problema", "Observo o gargalo real."], ["Contexto", "Entendo regras e exceções."], ["Estrutura", "Organizo dados e fluxo."], ["Solução", "Transformo a ideia em algo utilizável."]];
export default function ProcessJourney() {
  const section = useRef(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame;
    const update = () => {
      const rect = section.current?.getBoundingClientRect();
      if (rect) setProgress(reduced.matches ? 1 : Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height - window.innerHeight))));
    };
    const request = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    update(); window.addEventListener("scroll", request, { passive: true }); window.addEventListener("resize", request); reduced.addEventListener("change", request);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", request); window.removeEventListener("resize", request); reduced.removeEventListener("change", request); };
  }, []);
  return <section className="leoProcessJourney" ref={section} style={{ "--journey-progress": progress }} aria-labelledby="journey-title"><div className="leoProcessSticky"><p className="monoLabel">01 / COMO EU TIRO UMA IDEIA DO PAPEL</p><div className="leoProcessBody"><h2 id="journey-title">Do problema<br /><em>à solução.</em></h2><div className="leoProcessTrack">{steps.map(([title, description], i) => <div className={progress >= i / 3 - .04 ? "illuminated" : ""} key={title}><span className="processNode">0{i + 1}</span><h3>{title}</h3><p>{description}</p></div>)}</div></div><span className="processScrollNote">ROLE PARA ACOMPANHAR ↓</span></div></section>;
}

