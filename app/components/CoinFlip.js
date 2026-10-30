"use client";

import { useRef, useState } from "react";

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

function Face({ face, back }) {
  if (face.kind === "intro") return <span className={`coinFace intro ${back ? "back" : ""}`}><span className="coinIntro">HUMAN<br /><em>× AI</em></span><small>FEITO EM CONVERSA</small><b className="coinHint">TOQUE PARA JOGAR</b></span>;
  return <span className={`coinFace ${face.kind} ${back ? "back" : ""}`}><small>{sides[face.kind].label}</small><strong>{face.line}</strong><b className="coinHint">JOGAR DE NOVO</b></span>;
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
