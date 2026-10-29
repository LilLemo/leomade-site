"use client";
import { useEffect, useRef, useState } from "react";

export default function ModeSwitch({ personal = false }) {
  const [leaving, setLeaving] = useState(false);
  const timer = useRef(null);
  const href = personal ? "/#inicio" : "/leo";
  useEffect(() => () => clearTimeout(timer.current), []);
  return <a className={`modeSwitch ${personal ? "personalMode" : "studioMode"}`} href={href} aria-label={personal ? "Ligar a luz: ir para o estúdio LEOMADE" : "Trocar a luz: conhecer meu portfólio pessoal"} aria-busy={leaving} onClick={e => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    e.preventDefault(); if (leaving) return; setLeaving(true);
    try { sessionStorage.setItem("leomade-light-switch", "yes"); } catch {}
    document.documentElement.dataset.lightTransition = "out";
    timer.current = setTimeout(() => window.location.assign(href), 420);
  }}><span className={!personal ? "active" : ""}>Estúdio</span><i aria-hidden="true"><b>{personal ? "☾" : "☀"}</b></i><span className={personal ? "active" : ""}>Sobre mim</span></a>;
}

export function LightArrival() {
  useEffect(() => {
    let timer;
    let incoming = false;
    try { incoming = sessionStorage.getItem("leomade-light-switch") === "yes"; sessionStorage.removeItem("leomade-light-switch"); } catch {}
    if (incoming && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.dataset.lightTransition = "in";
      timer = setTimeout(() => delete document.documentElement.dataset.lightTransition, 850);
    }
    return () => { clearTimeout(timer); delete document.documentElement.dataset.lightTransition; };
  }, []);
  return null;
}
