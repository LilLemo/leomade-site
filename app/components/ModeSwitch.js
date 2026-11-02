"use client";
import { useEffect, useRef, useState } from "react";
import { sfx } from "./sound";

const KEY = "leomade-light-switch";
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const curtainCopy = {
  light: ["Acendendo a luz.", "SOBRE MIM"],
  dark: ["Apagando a luz.", "ESTÚDIO LEOMADE"],
};

// Runs in <head>, before the first paint of the arriving page, so the curtain is already there.
export const lightArrivalScript = `(function(){try{var r=sessionStorage.getItem("${KEY}");if(!r)return;var d=JSON.parse(r);if(!d||Date.now()-d.at>9000||matchMedia("(prefers-reduced-motion: reduce)").matches){sessionStorage.removeItem("${KEY}");return;}document.documentElement.setAttribute("data-light-arrival",d.to);}catch(e){}})();`;

function clearCurtain() {
  document.querySelectorAll(".lightCurtain").forEach(el => el.remove());
  delete document.documentElement.dataset.lightLeaving;
}

const THEME = "leomade-theme";
// Runs in <head> so the saved theme is applied before the first paint.
export const themeScript = `(function(){try{if(localStorage.getItem("${THEME}")==="light")document.documentElement.classList.add("lightOn");}catch(e){}})();`;

// A wall switch: same page, the light on or off.
export default function ModeSwitch() {
  const [light, setLight] = useState(false);
  const [state, setState] = useState("idle");
  const timers = useRef([]);
  useEffect(() => { setLight(document.documentElement.classList.contains("lightOn")); return () => timers.current.forEach(clearTimeout); }, []);
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  const apply = next => {
    document.documentElement.classList.toggle("lightOn", next);
    try { localStorage.setItem(THEME, next ? "light" : "dark"); } catch {}
    setLight(next);
  };
  return <button
    type="button"
    className={`lightSwitch ${light ? "isOn" : "isOff"} ${state === "flipping" ? "flipping" : ""}`}
    aria-label={light ? "Apagar a luz: tema escuro" : "Acender a luz: tema claro"}
    aria-pressed={light}
    onClick={e => {
      if (state !== "idle") return;
      const next = !light;
      sfx.lightSwitch();
      if (reduced()) { apply(next); return; }
      setState("flipping");
      const plate = e.currentTarget.querySelector(".switchPlate").getBoundingClientRect();
      const x = plate.left + plate.width / 2, y = plate.top + plate.height / 2;
      const to = next ? "light" : "dark";
      later(() => {
        const curtain = document.createElement("div");
        curtain.className = `lightCurtain to-${to}`;
        curtain.setAttribute("aria-hidden", "true");
        curtain.style.setProperty("--x", `${x}px`);
        curtain.style.setProperty("--y", `${y}px`);
        curtain.innerHTML = `<div class="curtainCopy"><span class="curtainFilament"></span><strong>${next ? "Acendendo a luz." : "Apagando a luz."}</strong><small>${next ? "TEMA CLARO" : "TEMA ESCURO"}</small></div>`;
        document.body.appendChild(curtain);
        later(() => { apply(next); later(() => { curtain.classList.add("lifting"); later(() => { curtain.remove(); setState("idle"); }, 650); }, 280); }, 660);
      }, 170);
    }}>
    <span className="switchText"><small>{light ? "APAGUE A LUZ" : "ACENDA A LUZ"}</small><strong>{light ? "Tema escuro" : "Tema claro"}</strong></span>
    <span className="switchPlate" aria-hidden="true"><span className="switchRocker"><i /></span><span className="switchPilot" /></span>
  </button>;
}

// The arriving page starts under the curtain (set in <head>) and lifts it once React is ready.
export function LightArrival() {
  useEffect(() => {
    const root = document.documentElement;
    try { sessionStorage.removeItem(KEY); } catch {}
    if (!root.dataset.lightArrival) return;
    let done = false;
    const timers = [];
    const lift = () => {
      if (done) return;
      done = true;
      root.dataset.lightLeaving = "yes";
      timers.push(setTimeout(() => { delete root.dataset.lightArrival; delete root.dataset.lightLeaving; }, 900));
    };
    const fonts = document.fonts?.ready ?? Promise.resolve();
    fonts.then(() => timers.push(setTimeout(lift, 120)));
    timers.push(setTimeout(lift, 900));
    return () => timers.forEach(clearTimeout);
  }, []);
  return null;
}
