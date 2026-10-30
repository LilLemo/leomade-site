"use client";
import { useEffect, useRef, useState } from "react";

export function CuriosityEye({ className = "" }) {
  return <svg className={className} viewBox="0 0 80 48" fill="none" aria-hidden="true"><path d="M5 24C14 11 25 5 40 5s26 6 35 19c-9 13-20 19-35 19S14 37 5 24Z" stroke="currentColor" strokeWidth="2" /><circle cx="40" cy="24" r="11" stroke="currentColor" strokeWidth="2" /><circle cx="40" cy="24" r="4" fill="currentColor" /><circle cx="43" cy="21" r="1.5" fill="var(--eye-highlight, #eee8d5)" /></svg>;
}

const ALMOND = "M5 24C14 11 25 5 40 5s26 6 35 19c-9 13-20 19-35 19S14 37 5 24Z";
const pokeLines = ["EI! ISSO É UM OLHO.", "OK, JÁ ENTENDI O RECADO.", "CURIOSO, HEIN?", "MELHOR CLICAR NO BOTÃO."];

// The big eye: the iris follows the pointer anywhere on the page, blinks on its own and flinches when poked.
function LivingEye() {
  const root = useRef(null);
  const timers = useRef([]);
  const [lid, setLid] = useState("");
  const [line, setLine] = useState(null);
  const pokes = useRef(0);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame, target = { x: 0, y: 0 };
    const apply = () => { el.style.setProperty("--px", `${target.x.toFixed(2)}px`); el.style.setProperty("--py", `${target.y.toFixed(2)}px`); };
    const move = e => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height * .5;
      const dx = e.clientX - cx, dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const reach = Math.min(1, dist / (r.width * .9));
      // Viewbox units: the almond leaves more room sideways than up and down.
      target = { x: (dx / dist) * reach * 14, y: (dy / dist) * reach * 6.5 };
      cancelAnimationFrame(frame); frame = requestAnimationFrame(apply);
    };
    const center = () => { target = { x: 0, y: 0 }; cancelAnimationFrame(frame); frame = requestAnimationFrame(apply); };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", center);
    let idle;
    const scheduleBlink = () => {
      idle = setTimeout(() => { setLid(current => current || "blink"); timers.current.push(setTimeout(() => setLid(current => current === "blink" ? "" : current), 240)); scheduleBlink(); }, 3200 + Math.random() * 4200);
    };
    if (!reduced) scheduleBlink();
    return () => { window.removeEventListener("pointermove", move); document.documentElement.removeEventListener("pointerleave", center); cancelAnimationFrame(frame); clearTimeout(idle); timers.current.forEach(clearTimeout); };
  }, []);
  const poke = () => {
    if (lid === "poke") return;
    setLid("poke");
    setLine(pokeLines[Math.min(pokes.current, pokeLines.length - 1)]);
    pokes.current += 1;
    timers.current.push(setTimeout(() => setLid(""), 950));
    timers.current.push(setTimeout(() => setLine(null), 2600));
  };
  return <>
    <div className={`lensEye ${lid}`} ref={root} onPointerDown={poke}>
      <svg viewBox="0 0 80 48" fill="none" aria-hidden="true">
        <defs><clipPath id="lensEyeClip"><path d={ALMOND} /></clipPath></defs>
        <path className="eyeShut" d="M7 25C18 33 29 36 40 36s22-3 33-11" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        <g className="eyeLid">
          <path d={ALMOND} stroke="currentColor" strokeWidth="2" />
          <g clipPath="url(#lensEyeClip)"><g className="eyeIris"><circle cx="40" cy="24" r="11" stroke="currentColor" strokeWidth="2" /><g className="eyePupil"><circle cx="40" cy="24" r="4" fill="currentColor" /><circle cx="43" cy="21" r="1.5" fill="var(--eye-highlight, #eee8d5)" /></g></g></g>
        </g>
      </svg>
    </div>
    <span className={line ? "eyeOuch" : ""}>{line || "UMA PERGUNTA PODE MUDAR TUDO."}</span>
  </>;
}

export default function StudioHero({ onEnter, opening = false }) {
  return <section className={`curiosityHome ${opening ? "opening" : ""}`} aria-labelledby="curiosity-title">
    <header className="curiosityHeader"><a className="studioBrand" href="/" aria-label="LEOMADE, início">leomade<span>✳</span></a><span>MADE WITH CURIOSITY</span></header>
    <div className="curiosityBody"><div className="curiosityCopy"><p className="monoLabel">PARA QUEM QUER DESCOBRIR, CRIAR E IR ALÉM</p><h1 id="curiosity-title">A curiosidade<br />é só o <em>começo.</em></h1><p>Eu acredito nas perguntas que viram experimentos e na vontade de fazer algo que ainda não existe. A LEOMADE é onde dou forma a essa inquietação.</p>
      <button className="curiosityEnter" onClick={e => { const rect = e.currentTarget.querySelector("svg").getBoundingClientRect(); onEnter({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }); }} disabled={opening}><span>Mergulhe na curiosidade</span><CuriosityEye className="entryEye" /></button>
    </div><div className="curiosityLens" aria-hidden="true"><i /><i /><LivingEye /></div></div>
    <footer className="curiosityBottom"><span>EMPREENDER. INVESTIGAR. INVENTAR.</span><span>TUDO COMEÇA COM A VONTADE DE FAZER. <i>✳</i></span></footer>
  </section>;
}
