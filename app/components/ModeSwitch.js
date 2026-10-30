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

// A wall switch: the studio is the room at night, "Sobre mim" is the same room with the light on.
export default function ModeSwitch({ personal = false }) {
  const [state, setState] = useState("idle");
  const timers = useRef([]);
  const prefetched = useRef(false);
  const href = personal ? "/#inicio" : "/leo";
  const to = personal ? "dark" : "light";
  useEffect(() => {
    const restore = e => { if (e.persisted) { clearCurtain(); setState("idle"); } };
    window.addEventListener("pageshow", restore);
    return () => { timers.current.forEach(clearTimeout); window.removeEventListener("pageshow", restore); };
  }, []);
  const prefetch = () => {
    if (prefetched.current) return;
    prefetched.current = true;
    try { fetch(href.split("#")[0], { credentials: "same-origin" }).catch(() => {}); } catch {}
  };
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  return <a
    className={`lightSwitch ${personal ? "isOn" : "isOff"} ${state === "flipping" ? "flipping" : ""}`}
    href={href}
    aria-label={personal ? "Apagar a luz: ir para o estúdio LEOMADE" : "Acender a luz: conhecer quem é o Léo"}
    aria-busy={state === "flipping"}
    onPointerEnter={prefetch}
    onFocus={prefetch}
    onTouchStart={prefetch}
    onClick={e => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0 || reduced()) return;
      e.preventDefault();
      if (state !== "idle") return;
      prefetch();
      sfx.lightSwitch();
      setState("flipping");
      const plate = e.currentTarget.querySelector(".switchPlate").getBoundingClientRect();
      const x = plate.left + plate.width / 2, y = plate.top + plate.height / 2;
      try { sessionStorage.setItem(KEY, JSON.stringify({ to, at: Date.now() })); } catch {}
      later(() => {
        const curtain = document.createElement("div");
        curtain.className = `lightCurtain to-${to}`;
        curtain.setAttribute("aria-hidden", "true");
        curtain.style.setProperty("--x", `${x}px`);
        curtain.style.setProperty("--y", `${y}px`);
        curtain.innerHTML = `<div class="curtainCopy"><span class="curtainFilament"></span><strong>${curtainCopy[to][0]}</strong><small>${curtainCopy[to][1]}</small></div>`;
        document.body.appendChild(curtain);
        later(() => window.location.assign(href), 640);
      }, 190);
    }}>
    <span className="switchText"><small>{personal ? "APAGUE A LUZ" : "ACENDA A LUZ"}</small><strong>{personal ? "Estúdio" : "Sobre mim"}<em>→</em></strong></span>
    <span className="switchPlate" aria-hidden="true"><span className="switchRocker"><i /></span><span className="switchPilot" /></span>
  </a>;
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
