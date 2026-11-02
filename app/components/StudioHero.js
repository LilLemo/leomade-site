"use client";
import EyeEasterEgg from "./EyeEasterEgg";

export function CuriosityEye({ className = "" }) {
  return <svg className={className} viewBox="0 0 80 48" fill="none" aria-hidden="true"><path d="M5 24C14 11 25 5 40 5s26 6 35 19c-9 13-20 19-35 19S14 37 5 24Z" stroke="currentColor" strokeWidth="2" /><circle cx="40" cy="24" r="11" stroke="currentColor" strokeWidth="2" /><circle cx="40" cy="24" r="4" fill="currentColor" /><circle cx="43" cy="21" r="1.5" fill="var(--eye-highlight, #eee8d5)" /></svg>;
}

export default function StudioHero({ onEnter, opening = false }) {
  return <section className={`curiosityHome ${opening ? "opening" : ""}`} aria-labelledby="curiosity-title">
    <header className="curiosityHeader"><a className="studioBrand" href="/" aria-label="LEOMADE, início">leomade<span>✳</span></a><span>MADE WITH CURIOSITY</span></header>
    <div className="curiosityBody"><div className="curiosityCopy"><h1 id="curiosity-title">A curiosidade<br />é só o <em>começo.</em></h1><p><span className="noteLine">Crio ferramentas de dados, automação e IA que resolvem gargalos reais de empresas.</span></p>
      <button className="curiosityEnter" onClick={e => { const rect = e.currentTarget.querySelector("svg").getBoundingClientRect(); onEnter({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }); }} disabled={opening}><span>Mergulhe na curiosidade</span><CuriosityEye className="entryEye" /></button>
    </div><div className="curiosityLens" aria-hidden="true"><i /><i /><EyeEasterEgg /></div></div>
    <footer className="curiosityBottom" aria-hidden="true" />
    
  </section>;
}
