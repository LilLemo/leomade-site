"use client";

import { useEffect, useId, useRef, useState } from "react";
import { sfx } from "./sound";

const ALMOND = "M5 24C14 11 25 5 40 5s26 6 35 19c-9 13-20 19-35 19S14 37 5 24Z";
const IDLE_LINE = "Uma pergunta pode mudar tudo.";
const eyeLines = ["Ei! Isso é um olho.", "Ok, já entendi o recado.", "Curioso, hein?", "Tá começando a incomodar."];
const ANGRY_AT = 4;
const BUTTON_AT = 5;
const buttonLines = { 1: "Isso. Aperta à vontade.", 3: "Satisfatório, né?", 5: "Você não cansa?" };
const PANEL_AT = 7;
const FLOORS = ["T", "1", "2", "3", "4", "5"];

// The eye talks like an AI answering: the words arrive in small chunks, already in their final place.
function useChunks(text) {
  const words = text.split(" ");
  const [count, setCount] = useState(words.length);
  useEffect(() => {
    const total = text.split(" ").length;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setCount(total); return; }
    let shown = 0, timer;
    setCount(0);
    const step = () => {
      shown = Math.min(total, shown + 1 + Math.floor(Math.random() * 3));
      setCount(shown);
      if (shown < total) timer = setTimeout(step, 90 + Math.random() * 90);
    };
    timer = setTimeout(step, 120);
    return () => clearTimeout(timer);
  }, [text]);
  return { words, count };
}

// Every order of L, E and O gets its own answer.
const anagrams = {
  LEO: "L-E-O. Prazer, sou eu.",
  ELO: "ELO. É o que eu faço: ligo áreas, dados e pessoas.",
  OLE: "OLÉ! Driblou a ordem certinho.",
  EOL: "EOL: end of line. Fim de linha, em programês.",
  LOE: "LOE? Parece nome de framework novo.",
  OEL: "OEL. É LEO de trás pra frente. Quase lá.",
};
const keyReply = typed => {
  const last = typed.slice(-3);
  if (anagrams[last]) return anagrams[last];
  if (last.length === 3 && last[0] === last[1] && last[1] === last[2]) return "Calma, uma tecla de cada vez.";
  return typed;
};

function BigRedButton({ onPress, small = false }) {
  const [down, setDown] = useState(false);
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  return <button tabIndex={-1} className={`toyButton redButton ${down ? "down" : ""} ${small ? "small" : ""}`} onPointerDown={() => { setDown(true); sfx.bigDown(); onPress(); }} onPointerUp={() => { setDown(false); sfx.bigUp(); }} onPointerLeave={() => setDown(false)}>
    <svg viewBox="0 0 120 92" aria-hidden="true">
      {/* The cap only shows above the rim, so pressing it really sinks it into the hole. */}
      <defs><clipPath id={`hole${id}`}><path d="M0 0H120V58H100A40 11 0 0 1 20 58H0Z" /></clipPath></defs>
      <ellipse className="toyShadow" cx="60" cy="80" rx="54" ry="9" />
      <path className="metalSide" d="M10 60v9a50 15 0 0 0 100 0v-9" />
      <ellipse className="metalTop" cx="60" cy="60" rx="50" ry="15" />
      <ellipse className="metalHole" cx="60" cy="58" rx="40" ry="11" />
      <g clipPath={`url(#hole${id})`}><g className="cap"><path className="capSide" d="M22 38v20a38 11 0 0 0 76 0V38" /><ellipse className="capTop" cx="60" cy="38" rx="38" ry="11.5" /><path className="capShine" d="M36 34c8-4 22-5 32-3" /></g></g>
      <path className="metalLip" d="M10 60A50 15 0 0 0 110 60L100 58A40 11 0 0 1 20 58Z" /><path className="lipEdge" d="M10 60A50 15 0 0 0 110 60M20 58A40 11 0 0 0 100 58" />
    </svg>
  </button>;
}

function MacroPad({ onKey }) {
  const [down, setDown] = useState(null);
  return <div className="toyButton macroPad">
    <svg viewBox="0 0 130 84" aria-hidden="true">
      <path className="padSide" d="M6 46h118v20a8 8 0 0 1-8 8H14a8 8 0 0 1-8-8Z" />
      <rect className="padTop" x="6" y="36" width="118" height="18" rx="7" />
      <circle className="screw" cx="14" cy="45" r="2.4" /><circle className="screw" cx="116" cy="45" r="2.4" />
      {["L", "E", "O"].map((k, i) => {
        const x = 20 + i * 34;
        return <g key={k} className={`keycap ${down === k ? "down" : ""}`} onPointerDown={() => { setDown(k); sfx.key(i); onKey(k); }} onPointerUp={() => setDown(null)} onPointerLeave={() => setDown(null)}>
          <path className="keySide" d={`M${x} 18h26v22a4 4 0 0 1-4 4H${x + 4}a4 4 0 0 1-4-4Z`} />
          <rect className="keyTop" x={x + 2} y="10" width="22" height="20" rx="4" />
          <text x={x + 13} y="24.5" textAnchor="middle">{k}</text>
        </g>;
      })}
    </svg>
  </div>;
}

function OnOffButton({ onState }) {
  const [on, setOn] = useState(false);
  const [down, setDown] = useState(null);
  const press = which => { setDown(which); const next = which === "I"; sfx.clack(next); setOn(next); onState(next); };
  return <div className={`toyButton onOff ${on ? "isOn" : ""}`}>
    <svg viewBox="0 0 70 104" aria-hidden="true">
      <rect className="housing" x="8" y="6" width="54" height="92" rx="27" />
      <g className={`half red ${down === "O" ? "down" : ""}`} onPointerDown={() => press("O")} onPointerUp={() => setDown(null)} onPointerLeave={() => setDown(null)}>
        <path d="M14 50V34a21 21 0 0 1 42 0v16Z" /><circle className="label" cx="35" cy="34" r="8" />
      </g>
      <g className={`half green ${down === "I" ? "down" : ""}`} onPointerDown={() => press("I")} onPointerUp={() => setDown(null)} onPointerLeave={() => setDown(null)}>
        <path d="M14 54h42v16a21 21 0 0 1-42 0Z" /><path className="label" d="M35 62v14" />
      </g>
      <circle className="lamp" cx="35" cy="6" r="4" />
    </svg>
  </div>;
}

function ElevatorPanel({ onFloor }) {
  const [lit, setLit] = useState(null);
  return <div className="toyButton elevator">
    <svg viewBox="0 0 80 108" aria-hidden="true">
      <rect className="steel" x="4" y="4" width="72" height="100" rx="6" />
      <circle className="screw" cx="12" cy="12" r="2" /><circle className="screw" cx="68" cy="12" r="2" /><circle className="screw" cx="12" cy="96" r="2" /><circle className="screw" cx="68" cy="96" r="2" />
      {FLOORS.map((f, i) => {
        const x = 16 + (i % 2) * 30, y = 22 + Math.floor(i / 2) * 26;
        return <g key={f} className={`floor ${lit === f ? "lit" : ""}`} onPointerDown={() => { setLit(f); sfx.floor(); onFloor(f); }}>
          <rect className="floorPlate" x={x - 4} y={y - 8} width="28" height="18" rx="9" />
          <text x={x + 3} y={y + 4.5} textAnchor="middle">{f}</text>
          <circle className="floorRing" cx={x + 15} cy={y + 1} r="5.5" />
        </g>;
      })}
    </svg>
  </div>;
}

export default function EyeEasterEgg() {
  const root = useRef(null);
  const timers = useRef([]);
  const [stage, setStage] = useState("eye");
  const [lid, setLid] = useState("");
  const [line, setLine] = useState(IDLE_LINE);
  const [presses, setPresses] = useState(0);
  const pokes = useRef(0);
  const typed = useRef("");
  const speech = useChunks(line);
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  const pendingLine = useRef(null);
  const say = (text, then, onThen) => { clearTimeout(pendingLine.current); setLine(text); if (then) pendingLine.current = setTimeout(() => { setLine(then); onThen?.(); }, 1200); };

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame, target = { x: 0, y: 0 };
    const apply = () => { const el = root.current; if (!el) return; el.style.setProperty("--px", `${target.x.toFixed(2)}px`); el.style.setProperty("--py", `${target.y.toFixed(2)}px`); };
    const move = e => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      const el = root.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (!r.width) return;
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy) || 1;
      const reach = Math.min(1, dist / (r.width * .9));
      target = { x: (dx / dist) * reach * 14, y: (dy / dist) * reach * 6.5 };
      cancelAnimationFrame(frame); frame = requestAnimationFrame(apply);
    };
    const center = () => { target = { x: 0, y: 0 }; cancelAnimationFrame(frame); frame = requestAnimationFrame(apply); };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", center);
    let idle;
    const scheduleBlink = () => {
      idle = setTimeout(() => { setLid(c => c || "blink"); later(() => setLid(c => c === "blink" ? "" : c), 240); scheduleBlink(); }, 3200 + Math.random() * 4200);
    };
    if (!reduced) scheduleBlink();
    return () => { window.removeEventListener("pointermove", move); document.documentElement.removeEventListener("pointerleave", center); cancelAnimationFrame(frame); clearTimeout(idle); timers.current.forEach(clearTimeout); };
  }, []);

  const poke = () => {
    if (stage !== "eye" || lid === "poke") return;
    pokes.current += 1;
    const n = pokes.current;
    sfx.poke();
    if (n >= BUTTON_AT) {
      setLine("Ok. Você quer clicar? Toma um botão pra você clicar.");
      setLid("shut");
      setStage("closing");
      later(() => { setStage("button"); sfx.pop(); }, 1100);
      return;
    }
    setLid("poke");
    setLine(eyeLines[n - 1]);
    later(() => setLid(""), 950);
  };

  const pressBig = () => {
    const n = presses + 1;
    setPresses(n);
    if (stage !== "button") return;
    if (n >= PANEL_AT) {
      setLine("Ok, você realmente gosta de clicar. Vou te dar mais opções.");
      later(() => setStage("panel"), 1300);
      return;
    }
    if (buttonLines[n]) setLine(buttonLines[n]);
  };

  const reset = () => {
    clearTimeout(pendingLine.current);
    pokes.current = 0;
    typed.current = "";
    setPresses(0);
    setLid("");
    setStage("eye");
    setLine("Pronto, voltei. Mas com moderação.");
  };

  const angry = stage === "eye" && pokes.current >= ANGRY_AT;
  return <div className={`eyeEgg stage-${stage}`}>
    {(stage === "eye" || stage === "closing") && <div className={`lensEye ${lid} ${angry ? "angry" : ""} ${stage === "closing" ? "closing" : ""}`} ref={root} onPointerDown={poke}>
      <svg viewBox="0 0 80 48" fill="none" aria-hidden="true">
        <defs><clipPath id="lensEyeClip"><path d={ALMOND} /></clipPath></defs>
        <path className="eyeBrow" d="M22 -1L56 8" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" />
        <path className="eyeShut" d="M7 25C18 33 29 36 40 36s22-3 33-11" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        <g className="eyeLid">
          <path d={ALMOND} stroke="currentColor" strokeWidth="2" />
          <g clipPath="url(#lensEyeClip)"><g className="eyeIris"><circle cx="40" cy="24" r="11" stroke="currentColor" strokeWidth="2" /><g className="eyePupil"><circle cx="40" cy="24" r="4" fill="currentColor" /><circle cx="43" cy="21" r="1.5" fill="var(--eye-highlight, #eee8d5)" /></g></g></g>
        </g>
      </svg>
    </div>}
    {stage === "button" && <div className="eggButtonStage"><BigRedButton onPress={pressBig} /><span className="pressCount">{presses ? `${presses} ${presses === 1 ? "CLIQUE" : "CLIQUES"}` : "PODE APERTAR"}</span></div>}
    {stage === "panel" && <div className="eggPanel">
      <BigRedButton small onPress={() => { setPresses(p => p + 1); say(["Clássico.", "O vermelho nunca falha.", "Ainda esse? Respeito."][Math.floor(Math.random() * 3)]); }} />
      <MacroPad onKey={k => { typed.current = (typed.current + k).slice(-9); const reply = keyReply(typed.current); if (reply !== typed.current) typed.current = ""; say(reply); }} />
      <OnOffButton onState={on => say(on ? "Ligado. Agora a curiosidade é oficial." : "Desligado. Mas ninguém desliga a curiosidade.")} />
      <ElevatorPanel onFloor={f => f === "T" ? say("Térreo. Fim da linha.") : say(`Subindo para o ${f}º andar...`, "Ding.", sfx.ding)} />
    </div>}
    <p className="eyeSpeech" aria-live="polite" key={line}>{speech.words.map((w, i) => <span key={i} className={i < speech.count ? "on" : ""}>{w}{i < speech.words.length - 1 ? " " : ""}</span>)}</p>
    {stage === "panel" && <button tabIndex={-1} className="eggReset" onClick={reset}>Devolver o olho</button>}
  </div>;
}
