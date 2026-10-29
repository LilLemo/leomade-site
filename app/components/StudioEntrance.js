"use client";

import { useEffect, useRef, useState } from "react";
import StudioHero from "./StudioHero";
import { expansionCircle } from "./entrance";

export default function StudioEntrance({ children }) {
  const [phase, setPhase] = useState("idle");
  const [circle, setCircle] = useState(null);
  const destination = useRef("studio-start");
  const revealed = phase === "revealing" || phase === "entered";

  useEffect(() => {
    if (!window.location.hash) return;
    try { destination.current = decodeURIComponent(window.location.hash.slice(1)); } catch { destination.current = "studio-start"; }
    setPhase("entered");
  }, []);

  useEffect(() => {
    if (revealed) return;
    const bodyOverflow = document.body.style.overflow;
    const rootOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => { document.body.style.overflow = bodyOverflow; document.documentElement.style.overflow = rootOverflow; };
  }, [revealed]);

  useEffect(() => {
    // Keep entry functional if a stylesheet or animation gets interrupted.
    if (phase !== "opening" && phase !== "revealing") return;
    const timer = setTimeout(() => setPhase(phase === "opening" ? "revealing" : "entered"), phase === "opening" ? 1300 : 280);
    return () => clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (!revealed) return;
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(destination.current) || document.getElementById("studio-start");
      if (destination.current === "studio-start") window.scrollTo({ top: 0, behavior: "instant" });
      else target?.scrollIntoView({ behavior: "instant", block: "start" });
      target?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [revealed]);

  const enter = origin => {
    if (phase !== "idle") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setPhase("entered"); return; }
    setCircle(expansionCircle(origin, { width: window.innerWidth, height: window.innerHeight }));
    setPhase("opening");
  };

  return <main className={`leomadePage entrance-${phase}`}>
    <a className="skipLink" href="#laboratorio" onClick={() => { destination.current = "laboratorio"; setPhase("entered"); }}>Ir para os projetos</a>
    {!revealed && <StudioHero onEnter={enter} opening={phase === "opening"} />}
    <div className="studioContent" hidden={!revealed}>{children}</div>
    {circle && phase !== "entered" && <div className={`entranceWash ${phase === "revealing" ? "revealing" : ""}`} aria-hidden="true" style={{ left: circle.x, top: circle.y, width: circle.diameter, height: circle.diameter }} onAnimationEnd={e => { if (e.animationName === "entranceExpand") setPhase("revealing"); }} />}
    <noscript><div className="entranceFallback"><p>Conheça meus projetos e minha trajetória.</p><a href="/leo">Ir para meu portfólio ↗</a></div></noscript>
  </main>;
}
