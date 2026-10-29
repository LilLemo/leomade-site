"use client";
import { useRef } from "react";

export function CuriosityEye({ className = "" }) {
  return <svg className={className} viewBox="0 0 80 48" fill="none" aria-hidden="true"><path d="M5 24C14 11 25 5 40 5s26 6 35 19c-9 13-20 19-35 19S14 37 5 24Z" stroke="currentColor" strokeWidth="2" /><circle cx="40" cy="24" r="11" stroke="currentColor" strokeWidth="2" /><circle cx="40" cy="24" r="4" fill="currentColor" /><circle cx="43" cy="21" r="1.5" fill="var(--eye-highlight, #eee8d5)" /></svg>;
}

export default function StudioHero({ onEnter, opening = false }) {
  const pupil = useRef(null);
  return <section className={`curiosityHome ${opening ? "opening" : ""}`} aria-labelledby="curiosity-title">
    <header className="curiosityHeader"><a className="studioBrand" href="/" aria-label="LEOMADE, início">leomade<span>✳</span></a><span>MADE WITH CURIOSITY</span></header>
    <div className="curiosityBody"><div className="curiosityCopy"><p className="monoLabel">PARA QUEM QUER DESCOBRIR, CRIAR E IR ALÉM</p><h1 id="curiosity-title">A curiosidade<br />é só o <em>começo.</em></h1><p>Eu acredito nas perguntas que viram experimentos e na vontade de fazer algo que ainda não existe. A LEOMADE é onde dou forma a essa inquietação.</p>
      <button className="curiosityEnter" onClick={e => { const rect = e.currentTarget.querySelector("svg").getBoundingClientRect(); onEnter({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }); }} disabled={opening}><span>Mergulhe na curiosidade</span><CuriosityEye className="entryEye" /></button>
    </div><div className="curiosityLens" aria-hidden="true" onPointerMove={e => { if (e.pointerType !== "mouse") return; const rect = e.currentTarget.getBoundingClientRect(); pupil.current?.style.setProperty("--eye-x", `${(e.clientX - rect.left - rect.width / 2) * .045}px`); pupil.current?.style.setProperty("--eye-y", `${(e.clientY - rect.top - rect.height / 2) * .045}px`); }} onPointerLeave={() => { pupil.current?.style.setProperty("--eye-x", "0px"); pupil.current?.style.setProperty("--eye-y", "0px"); }}><i /><i /><div className="lensEye" ref={pupil}><CuriosityEye /></div><span>UMA PERGUNTA PODE MUDAR TUDO.</span></div></div>
    <footer className="curiosityBottom"><span>EMPREENDER. INVESTIGAR. INVENTAR.</span><span>TUDO COMEÇA COM A VONTADE DE FAZER. <i>✳</i></span></footer>
  </section>;
}
