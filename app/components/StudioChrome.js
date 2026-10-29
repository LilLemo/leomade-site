"use client";

import { useState } from "react";
import ModeSwitch from "./ModeSwitch";
export const linkedIn = "https://www.linkedin.com/in/leonardo-moura-rebouças-1583191b0";

export function StudioHeader({ personal = false }) {
  const [menu, setMenu] = useState(false);
  return <header className={`studioNav ${menu ? "menuOpen" : ""}`}>
    <a className="studioBrand" href="/" aria-label="LEOMADE, início">leomade<span>✳</span></a>
    <span className="navCaption">MADE WITH CURIOSITY</span>
    <button className="menuToggle" aria-expanded={menu} aria-controls="studio-links" onClick={() => setMenu(!menu)}>{menu ? "Fechar −" : "Menu +"}</button>
    <nav id="studio-links" aria-label="Navegação principal">
      {personal ? <><a href="#impacto" onClick={() => setMenu(false)}>Impacto</a><a href="#laboratorio" onClick={() => setMenu(false)}>Projetos</a></> : <><a href="#laboratorio" onClick={() => setMenu(false)}>Laboratório</a><a href="#no-trabalho" onClick={() => setMenu(false)}>No trabalho</a></>}
      <ModeSwitch personal={personal} />
      <a href={linkedIn} target="_blank" rel="noreferrer" className="navContact">Vamos conversar <span>↗</span></a>
    </nav>
  </header>;
}

export function StudioFooter({ personal = false }) {
  const [spark, setSpark] = useState(0);
  const words = ["uma ideia", "um e se?", "uma conversa", "um começo"];
  return <footer className="studioFooter" id="conversa">
    <div className="footerTop"><span className="monoLabel">PRÓXIMO EXPERIMENTO</span><span className="monoLabel">SÃO PAULO · BRASIL</span></div>
    <div className="footerInvitation">
      <h2>Começa com<br /><button onClick={() => setSpark((spark + 1) % words.length)} aria-label="Experimentar outra ideia">{words[spark]}<span>↻</span></button></h2>
      <div><p>Tem um problema interessante?<br />Uma ideia ainda sem forma?<br />Me conta. Vamos ver o que ela pode virar.</p><a className="studioButton cream" href={linkedIn} target="_blank" rel="noreferrer">Fale comigo <span>↗</span></a></div>
    </div>
    <div className="footerBaseline"><a href="/" className="studioBrand">leomade<span>✳</span></a><p>Sou o Léo. A LEOMADE é meu estúdio.</p><a href={personal ? "/" : "/leo"}>{personal ? "Voltar ao meu estúdio" : "Mais sobre mim"} ↗</a><a href="https://github.com/LilLemo" target="_blank" rel="noreferrer">Meu GitHub ↗</a></div>
  </footer>;
}
