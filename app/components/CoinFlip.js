"use client";

import { useId, useRef, useState } from "react";

// Heads: something human about me. Tails: something about the AI-built tools I make.
const sides = {
  cara: {
    label: "CARA · LADO HUMANO",
    lines: [
      "Escuto quem vive a rotina antes de abrir o editor.",
      "Pergunto o porquê até achar a exceção.",
      "Traduzo regra de negócio em linguagem de gente.",
      "A decisão final é minha, não da IA.",
      "Curiosidade que não larga a pergunta.",
      "Gosto de ver a pessoa usando, não só aprovando.",
    ],
  },
  coroa: {
    label: "COROA · LADO IA",
    lines: [
      "Ferramentas que abrem com dois cliques, sem servidor.",
      "Todo número leva ao detalhe que o compõe.",
      "A próxima ferramenta já nasce com peças prontas.",
      "Dado real fica fora da conversa com a IA.",
      "Testado contra arquivos reais antes de entregar.",
      "Português e inglês no mesmo clique.",
    ],
  },
};
const intro = { kind: "intro" };
const pick = (list, avoid) => { const pool = list.filter(item => item !== avoid); return pool[Math.floor(Math.random() * pool.length)]; };

const arcs = {
  intro: ["LEOMADE · MADE WITH CURIOSITY", "TOQUE PARA JOGAR"],
  cara: ["CARA · LADO HUMANO", "LEOMADE · MMXXVI"],
  coroa: ["COROA · LADO IA", "FEITO EM CONVERSA"],
};

// An original commemorative coin: reeded rim, engraved arcs, an emblem per side.
function CoinArt({ kind }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [top, bottom] = arcs[kind];
  const star = (x, y) => <path d={`M${x} ${y - 4}L${x + 1.1} ${y - 1.1}L${x + 4} ${y}L${x + 1.1} ${y + 1.1}L${x} ${y + 4}L${x - 1.1} ${y + 1.1}L${x - 4} ${y}L${x - 1.1} ${y - 1.1}Z`} />;
  return <svg className="coinArt" viewBox="0 0 200 200" aria-hidden="true">
    <defs>
      <path id={`top${id}`} d="M 26,100 A 74,74 0 0 1 174,100" />
      <path id={`bot${id}`} d="M 19,100 A 81,81 0 0 0 181,100" />
    </defs>
    <circle className="coinReed" cx="100" cy="100" r="95.5" />
    <circle className="coinLineDark" cx="100" cy="100" r="91.5" />
    <circle className="coinLineLight" cx="100" cy="100" r="90.5" />
    <circle className="coinLineDark" cx="100" cy="100" r="66.5" />
    <circle className="coinLineLight" cx="100" cy="100" r="65.5" />
    <circle className="coinDots" cx="100" cy="100" r="69.5" />
    <text className="coinArc"><textPath href={`#top${id}`} startOffset="50%" textAnchor="middle">{top}</textPath></text>
    <text className="coinArc"><textPath href={`#bot${id}`} startOffset="50%" textAnchor="middle">{bottom}</textPath></text>
    <g className="coinOrnament">{star(21, 100)}{star(179, 100)}</g>
    {kind === "cara" && <g className="coinEmblem" transform="translate(86.5 44) scale(.34)"><path d="M5 24C14 11 25 5 40 5s26 6 35 19c-9 13-20 19-35 19S14 37 5 24Z" /><circle cx="40" cy="24" r="11" /><circle cx="40" cy="24" r="4" className="fill" /></g>}
    {kind === "coroa" && <g className="coinEmblem"><path d="M100 41v20M91.3 46l17.4 10M91.3 56l17.4-10" /><circle cx="100" cy="51" r="2.6" className="fill" /><circle cx="86" cy="51" r="1.3" className="fill" /><circle cx="114" cy="51" r="1.3" className="fill" /></g>}
  </svg>;
}

function Face({ face, back }) {
  return <span className={`coinFace ${face.kind} ${back ? "back" : ""}`}>
    <CoinArt kind={face.kind} />
    {face.kind === "intro" ? <span className="coinIntro">HUMAN<br /><em>× AI</em></span> : <strong>{face.line}</strong>}
  </span>;
}

export default function CoinFlip() {
  const [angle, setAngle] = useState(0);
  const [faces, setFaces] = useState([intro, intro]);
  const [tossing, setTossing] = useState(false);
  const [score, setScore] = useState({ cara: 0, coroa: 0 });
  const [result, setResult] = useState("");
  const last = useRef({ cara: null, coroa: null });
  const timer = useRef(null);
  const flip = () => {
    if (tossing) return;
    const kind = Math.random() < .5 ? "cara" : "coroa";
    const line = pick(sides[kind].lines, last.current[kind]);
    last.current[kind] = line;
    // Always land on the face that is hidden now, so its content can change unseen.
    const upIsFront = Math.round(angle / 180) % 2 === 0;
    const next = [...faces];
    next[upIsFront ? 1 : 0] = { kind, line };
    setFaces(next);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const halfTurns = reduced ? 1 : 7 + 2 * Math.floor(Math.random() * 2);
    setAngle(angle + halfTurns * 180);
    setTossing(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setTossing(false);
      setScore(s => ({ ...s, [kind]: s[kind] + 1 }));
      setResult(`${kind === "cara" ? "Cara" : "Coroa"}: ${line}`);
    }, reduced ? 50 : 1500);
  };
  const total = score.cara + score.coroa;
  return <div className="coinStage" data-reveal>
    <button className={`coin ${tossing ? "tossing" : ""}`} onClick={flip} aria-label="Jogar a moeda: cara mostra um lado humano meu, coroa um lado das ferramentas que crio com IA" aria-busy={tossing}>
      <span className="coinToss"><span className="coinBody" style={{ "--angle": `${angle}deg` }}>
        <Face face={faces[0]} />
        {Array.from({ length: 6 }, (_, i) => <i key={i} className="coinRim" style={{ "--z": `${(i - 2.5) * 1.6}px` }} />)}
        <Face face={faces[1]} back />
      </span></span>
    </button>
    <p className="coinScore" aria-live="polite"><span className="srOnly">{result}</span>{total ? <>CARA <b>{score.cara}</b> · COROA <b>{score.coroa}</b></> : "CARA OU COROA?"}</p>
  </div>;
}
