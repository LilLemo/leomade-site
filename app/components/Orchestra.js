"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { sfx } from "./sound";
import PixelHand from "./PixelHand";

/* 06 · Reports that explain themselves, told as an orchestra: pick the data, the conductor plays, the screen reads. */
const ART = {"maestro0": [".........k...k........kw", "........khk.khk.......kw", ".......khkhkhkhk.....kwk", ".......khhhhhhhhk....kwk", ".......khHhhhhhhk...kwk.", "......khhhhhHhhhhk.kswk.", ".....khhhhhhhhhhhhkkssk.", "......khhhhhhhHhhk.kssk.", ".....khhhhHhhhhhhhkjjjk.", "......khhhhhhHhhhkkjjk..", "......kshhhhhhhhskjjjk..", ".......khhhhhhhhkkjjk...", ".......kkwwwwwwkkjjjk...", "......kjjjjjjjjjjjjk....", "......kjjjjJJjjjjjjk....", "....kkjjjjjJJjjjjjk.....", ".kkkjjjjjjjJJjjjjk......", "kssjjjjjjjjJJjjjjk......", "kssjjkkjjjjJJjjjjk......", ".kkkk.kjjjjJJjjjjk......", "......kjjjjJJjjjjk......", "......kjjjjJJjjjjk......", "......kjjjjJJjjjjk......", "......kjjjjJJjjjjk......", "......kjjjjJJjjjjk......", "......kjjjjjjjjjjk......", ".......kjppkkppjk.......", ".......kjppkkppjk.......", ".......kjppkkppjk.......", ".......kjppkkppjk.......", ".......kjppkkppjk.......", "........kppkkppk........", ".......kbbbkkbbbk.......", "........kkk..kkk........"], "maestro1": [".........k...k..........", "........khk.khk.........", ".......khkhkhkhk........", ".......khhhhhhhhk.......", ".......khHhhhhhhk.......", ".kk...khhhhhHhhhhk......", "kssk.khhhhhhhhhhhhk.....", "ksskk.khhhhhhhHhhk......", "kssjjkhhhhHhhhhhhhk.....", ".kkjjjkhhhhhhHhhhk......", "...kjjkshhhhhhhhsk......", "...kjjjkhhhhhhhhk.......", "....kjjjkwwwwwwkk.......", ".....kjjjjjjjjjjjk......", ".....kjjjjjJJjjjjjk.....", "......kjjjjJJjjjjjjkk...", "......kjjjjJJjjjjjjjjk..", "......kjjjjJJjjjjkjjssk.", "......kjjjjJJjjjjkkksswk", "......kjjjjJJjjjjk..kkwk", "......kjjjjJJjjjjk...kwk", "......kjjjjJJjjjjk....kw", "......kjjjjJJjjjjk....kw", "......kjjjjJJjjjjk.....k", "......kjjjjJJjjjjk......", "......kjjjjjjjjjjk......", ".......kjppkkppjk.......", ".......kjppkkppjk.......", ".......kjppkkppjk.......", ".......kjppkkppjk.......", ".......kjppkkppjk.......", "........kppkkppk........", ".......kbbbkkbbbk.......", "........kkk..kkk........"], "chair": ["kooooooooooook", "kooooooooooook", "kookOOkkOOkook", "kookOOkkOOkook", "kookOOkkOOkook", "kookOOkkOOkook", "kookOOkkOOkook", "kookOOkkOOkook", "kookkkkkkkkook", "oooooooooooooo", "oooooooooooooo", "OOOOOOOOOOOOOO", "kookkkkkkkkook", "kook......kook", "kook......kook", "kook......kook", "kook......kook", "kook......kook"], "stand": ["mmmmmmmmmmmm", "mwwwwwwwwwwm", "mwnnwnnwnwwm", "mwwwwwwwwwwm", "mwnwnnwnwnwm", "mwwwwwwwwwwm", "mmmmmmmmmmmm", "kkkkkmmkkkkk", "....kmmk....", "....kmmk....", "....kmmk....", "....kmmk....", "....kmmk....", "....kmmk....", "....kmmk....", "....kmmk....", "....kmmk....", "..kkkmmkkk..", ".kmmmmmmmmk.", ".kmmmmmmmmk."], "docIdle": ["wwwwwwwwwfk...", "wwwwwwwwwffk..", "wwwwwwwwwfffk.", "wwwwwwwwwffffk", "wwwewwwwweffff", "wwwewwwwwewwww", "wwwwwwmmwwwwww", "wwwwwwwwwwwwww", "llllllllllllll", "llllllllllllll", "llllllllllllll", "llllllllllllll", "wwwwwwwwwwwwww", "wwwwwwwwwwwwww", "wwwwwwwwwwwwww", "kkkwwkkkkwwkkk", "..kwwk..kwwk.."], "docHappy": ["wwwwwwwwwfk...", "wwwwwwwwwffk..", "wwwwwwwwwfffk.", "wwwwwwwwwffffk", "wwwewwwwweffff", "wwewewwwewewww", "wwwwwwmmwwwwww", "wwwwwwwwwwwwww", "llllllllllllll", "llllllllllllll", "llllllllllllll", "llllllllllllll", "wwwwwwwwwwwwww", "wwwwwwwwwwwwww", "wwwwwwwwwwwwww", "kkkwwkkkkwwkkk", "..kwwk..kwwk.."]};
const ink = { k: "#0c1a14", j: "#1b1b20", J: "#2a2a31", p: "#141418", b: "#0b0b0d", w: "#f4f2ea", h: "#6b3e1f", H: "#8a5530", s: "#e8b48c", o: "#9a6538", O: "#6f4523", m: "#2b2f36", n: "#7c8088", f: "#c9c4b6", e: "#1b1b1b" };
function PixelArt({ name, className = "", tint }) {
  const rows = ART[name], pal = tint ? { ...ink, l: tint } : ink, rects = [];
  rows.forEach((row, y) => { let x = 0; while (x < row.length) { const c = row[x]; let r = 1; while (x + r < row.length && row[x + r] === c) r++; if (c !== ".") rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={r + .02} height="1.02" fill={pal[c]} />); x += r; } });
  return <svg className={`pixelArt ${className}`} viewBox={`0 0 ${rows[0].length} ${rows.length}`} shapeRendering="crispEdges" aria-hidden="true">{rects}</svg>;
}

const files = [
  { id: "csv", ext: "CSV", desc: "extração do sistema", color: "#8fe6b4" },
  { id: "xlsx", ext: "XLSX", desc: "planilha da área", color: "#d2e99b" },
  { id: "pdf", ext: "PDF", desc: "relatório exportado", color: "#f09a86" },
  { id: "json", ext: "JSON", desc: "dados de API", color: "#c3a6f0" },
  { id: "img", ext: "IMG", desc: "print de painel", color: "#9cc8f2" },
  { id: "db", ext: "DB", desc: "base de pedidos", color: "#f2c46b" },
];
const seats = [{ x: 13, y: 52 }, { x: 24, y: 40 }, { x: 35, y: 33 }, { x: 65, y: 33 }, { x: 76, y: 40 }, { x: 87, y: 52 }];
const stages = [
  { id: "aprovacao", label: "Aguardando aprovação", valor: 41, pedidos: 18, rows: [["#1042", "Padaria Aurora", "12 dias"], ["#1057", "Mercado Bom Fim", "9 dias"], ["#1061", "Café Duas Pontes", "4 dias"]] },
  { id: "separacao", label: "Separação", valor: 24, pedidos: 31, rows: [["#1033", "Empório Serra Azul", "6 dias"], ["#1066", "Hortifruti Vila Nova", "3 dias"]] },
  { id: "transporte", label: "Transporte", valor: 17, pedidos: 12, rows: [["#1018", "Armazém Lagoa", "8 dias"], ["#1070", "Doceria Primavera", "2 dias"]] },
  { id: "faturamento", label: "Faturamento", valor: 13, pedidos: 9, rows: [["#1049", "Restaurante Maré Alta", "5 dias"]] },
  { id: "outros", label: "Outros", valor: 1, pedidos: 1, rows: [["#1072", "Quitanda do Morro", "1 dia"]] },
];
const stageColor = { aprovacao: "#eebda9", separacao: "#e3a58c", transporte: "#d79179", faturamento: "#c67f68", outros: "#b06d59" };
const week = [["25/10", 92], ["26/10", 88], ["27/10", 95], ["28/10", 84], ["29/10", 79], ["30/10", 76], ["31/10", 74], ["01/11", 71]];
const charts = [["treemap", "Treemap"], ["bars", "Barras"], ["pie", "Pizza"], ["line", "Linha"]];
const META = .15;
const solo = { xlsx: "7 clientes esperando, o mais antigo há 12 dias.", img: "Meta da área: até 15% parado por etapa.", json: "+3 pedidos entraram na última hora.", pdf: "Histórico de oito dias pronto para a tendência." };
const MIN_SHARE = .07;
function splitTreemap(items, x, y, w, h, out) {
  if (items.length === 1) { out.push({ ...items[0], x, y, w, h }); return out; }
  const total = items.reduce((s, it) => s + it.shown, 0);
  let i = 1, acc = items[0].shown;
  while (i < items.length - 1 && acc + items[i].shown <= total / 2) { acc += items[i].shown; i++; }
  const r = acc / total;
  if (w >= h) { splitTreemap(items.slice(0, i), x, y, w * r, h, out); splitTreemap(items.slice(i), x + w * r, y, w * (1 - r), h, out); }
  else { splitTreemap(items.slice(0, i), x, y, w, h * r, out); splitTreemap(items.slice(i), x, y + h * r, w, h * (1 - r), out); }
  return out;
}
const pct = v => `${Math.round(v * 100)}%`;

export default function Orchestra() {
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  const boxRef = useRef(null);
  const [picked, setPicked] = useState([]);
  const [phase, setPhase] = useState("pick");
  const [chart, setChart] = useState("treemap");
  const [metric, setMetric] = useState("valor");
  const [focus, setFocus] = useState("aprovacao");
  const [ratio, setRatio] = useState(2.4);
  const [lock, setLock] = useState(null);
  const has = id => picked.includes(id);
  const hasBase = has("csv") || has("db");
  useEffect(() => {
    if (phase !== "report" || !boxRef.current) return;
    const measure = () => { const r = boxRef.current?.getBoundingClientRect(); if (r?.height) setRatio(r.width / r.height); };
    measure(); const ro = new ResizeObserver(measure); ro.observe(boxRef.current); return () => ro.disconnect();
  }, [phase]);

  const toggle = id => { if (phase !== "pick") return; setPicked(p => (p.includes(id) ? p.filter(x => x !== id) : [...p, id])); picked.includes(id) ? sfx.pop() : sfx.drop(files.findIndex(f => f.id === id) % 3); };
  const play = () => { if (picked.length < 2) return; setMetric(has("db") ? "valor" : "pedidos"); setChart(hasBase ? "treemap" : has("pdf") ? "line" : "none"); setPhase("tuning"); sfx.tap?.(); later(() => sfx.concert(picked.length), 350); later(() => { setPhase("report"); sfx.ding(); }, 3400); };
  const reset = () => { setPhase("pick"); setPicked([]); setChart("treemap"); setFocus("aprovacao"); setLock(null); sfx.flip(); };
  const need = { treemap: hasBase ? null : ["CSV ou o DB", "o quadro das etapas"], bars: hasBase ? null : ["CSV ou o DB", "as barras"], pie: hasBase ? null : ["CSV ou o DB", "a pizza"], line: has("pdf") ? null : ["PDF", "a tendência"], valor: has("db") ? null : ["DB", "quanto dinheiro está parado"], pedidos: has("csv") ? null : ["CSV", "quantos pedidos são"] };
  const tryOpen = (id, apply) => { if (need[id]) { setLock(`Chame o ${need[id][0]} para ver ${need[id][1]}.`); sfx.buzz(); later(() => setLock(null), 2600); return; } setLock(null); apply(); };

  const total = stages.reduce((s, x) => s + x[metric], 0);
  const blocks = useMemo(() => {
    const shown = stages.map(s => ({ ...s, share: s[metric] / total, shown: Math.max(s[metric], total * MIN_SHARE) })).sort((a, b) => b.shown - a.shown);
    return splitTreemap(shown, 0, 0, ratio * 100, 100, []);
  }, [metric, ratio, total]);
  const cur = stages.find(s => s.id === focus);
  const other = metric === "valor" ? "pedidos" : "valor";
  const leaderOther = [...stages].sort((a, b) => b[other] - a[other])[0];
  const above = stages.filter(s => s[metric] / total > META).length;
  const reading = chart === "none" ? ["Sem a base dos pedidos não dá para montar o quadro.", "Chame o CSV ou o DB para a melodia principal."]
    : chart === "line"
    ? [`Os pedidos parados caíram ${Math.round((1 - week[7][1] / week[0][1]) * 100)}% em oito dias.`, "O pico foi em 27/10, depois de um feriado regional.", hasBase ? "A queda vem quase toda da etapa de separação." : "Sem o CSV ou o DB, eu vejo a curva mas não sei de qual etapa ela vem."]
    : [`${cur.label} concentra ${pct(cur[metric] / total)} ${metric === "valor" ? "do valor parado" : "dos pedidos parados"}.`,
      !has("db") ? "Sem o DB, eu conto os pedidos mas não sei quanto dinheiro está parado." : !has("csv") ? "Sem o CSV, eu vejo o valor mas não quantos pedidos são." : leaderOther.id !== cur.id ? `Em ${other === "valor" ? "valor" : "quantidade"}, quem lidera é ${leaderOther.label.toLowerCase()}.` : `Também lidera em ${other === "valor" ? "valor" : "quantidade"}.`,
      ...(has("img") ? [`${above} ${above > 1 ? "etapas estão" : "etapa está"} acima da meta de 15% que veio do print do painel.`] : [])];
  const lit = chart === "none" ? picked : chart === "line" ? ["pdf", "json"] : [metric === "valor" ? "db" : "csv", "xlsx", "json", ...(chart === "bars" ? ["img"] : [])];
  const missing = files.filter(f => !has(f.id)).map(f => f.ext);
  const pickFocus = id => { setFocus(id); sfx.key(1); };

  const C = 2 * Math.PI * 34;
  let acc = 0;
  const chartView = chart === "treemap"
    ? <div className="tmap">{blocks.map((b, i) => <button key={b.id} className={`tBlock ${focus === b.id ? "on" : ""}`} style={{ left: `${b.x / ratio}%`, top: `${b.y}%`, width: `${b.w / ratio}%`, height: `${b.h}%`, background: stageColor[b.id], "--i": i }} onClick={() => pickFocus(b.id)}><strong>{pct(b.share)}</strong><span>{b.label}</span></button>)}</div>
    : chart === "bars"
      ? <div className="hbars">{has("img") && <span className="metaLine" style={{ "--m": (META * total) / Math.max(...stages.map(x => x[metric])) }}><em>META 15%</em></span>}{[...stages].sort((a, b) => b[metric] - a[metric]).map((s, i) => <button key={s.id} className={`hbar ${focus === s.id ? "on" : ""}`} onClick={() => pickFocus(s.id)} style={{ "--i": i }}><span>{s.label}</span><i style={{ width: `${(s[metric] / Math.max(...stages.map(x => x[metric]))) * 100}%`, background: stageColor[s.id] }} /><b className={has("img") && s[metric] / total > META ? "over" : ""}>{pct(s[metric] / total)}</b></button>)}</div>
      : chart === "pie"
        ? <div className="pieWrap"><svg viewBox="0 0 100 100" className="pie">{stages.map(s => { const len = (s[metric] / total) * C, off = acc; acc += len; return <circle key={s.id} cx="50" cy="50" r="34" fill="none" stroke={stageColor[s.id]} strokeWidth={focus === s.id ? 22 : 16} strokeDasharray={`${len} ${C}`} strokeDashoffset={-off} transform="rotate(-90 50 50)" onClick={() => pickFocus(s.id)} className="pieSlice" />; })}<text x="50" y="49" textAnchor="middle" className="pieBig">{pct(cur[metric] / total)}</text><text x="50" y="60" textAnchor="middle" className="pieSmall">{cur.label.split(" ")[0]}</text></svg></div>
        : chart === "none" ? <div className="noBase"><b>Faltou quem toca a melodia principal.</b><span>O que deu para tocar com quem veio:</span><ul>{picked.filter(id => solo[id]).map(id => <li key={id} style={{ "--c": files.find(f => f.id === id).color }}><i />{solo[id]}</li>)}</ul></div>
        : <svg viewBox="0 0 320 120" className="lineChart" preserveAspectRatio="none">{[0, 1, 2, 3].map(g => <line key={g} x1="0" x2="320" y1={15 + g * 30} y2={15 + g * 30} className="grid" />)}<polyline points={week.map(([, v], i) => `${10 + i * 43},${110 - (v - 60) * 2.6}`).join(" ")} className="line" />{week.map(([d, v], i) => <line key={d} x1={10 + i * 43} x2={10 + i * 43} y1={110 - (v - 60) * 2.6} y2={110 - (v - 60) * 2.6} className="dot" />)}</svg>;

  const n = picked.length;
  const hint = phase === "tuning" ? "Cada fonte no seu tempo, uma leitura só." : phase === "report" ? (chart === "none" ? "A orquestra tocou, mas faltou a base." : "Cada aba acende quem tocou aquela parte.") : n === 0 ? "As cadeiras estão vazias. Escolha quem toca hoje." : n < 2 ? "Mais um arquivo e a orquestra já pode começar." : `${n} no palco. É só dar o sinal ao maestro.`;
  return <div className={`projectVisual toyVisual orchVisual phase-${phase}`} data-noswipe>
    <div className="toyTop"><span className="toyEyebrow">RELATÓRIOS QUE SE EXPLICAM</span><span className="toyHint" key={hint}>{hint}</span></div>
    <div className="theater">
      <i className="curtain left" /><i className="curtain right" /><i className="valance" />
      <div className="screen">
        {phase === "pick" && <div className="scrPick">
          <span className="scrTitle"><b>Selecione seus dados</b><small>Cada arquivo escolhido ganha uma cadeira na orquestra.</small></span>
          <div className="fileChips">{files.map(f => <button key={f.id} aria-pressed={picked.includes(f.id)} onClick={() => toggle(f.id)} style={{ "--c": f.color }}><i />{f.ext}<em>{f.desc}</em></button>)}</div>
          <div className="scrActions"><span>{n} DE 6 NO PALCO</span>{n >= 2 && <span className="guide playGuide"><PixelHand /></span>}<button className={`primaryAction ${n >= 2 ? "nudge" : ""}`} onClick={play} disabled={n < 2}>Começar o concerto</button></div>
        </div>}
        {phase === "tuning" && <div className="scrTuning"><div className="eq">{Array.from({ length: 14 }, (_, i) => <i key={i} style={{ "--i": i }} />)}</div><b>Afinando os dados…</b><small>{picked.map(id => files.find(f => f.id === id).ext).join(" · ")}</small></div>}
        {phase === "report" && <div className="scrReport">
          <div className="repTop"><nav className="repTabs">{charts.map(([id, label]) => <button key={id} aria-pressed={chart === id} className={need[id] ? "locked" : ""} onClick={() => tryOpen(id, () => { setChart(id); sfx.key(2); })}>{label}</button>)}</nav>
            {has("json") && <span className="liveBadge"><i />AO VIVO · +3 NA ÚLTIMA HORA</span>}
            {chart === "line" ? <span className="repNote">PEDIDOS PARADOS · 8 DIAS</span> : chart !== "none" && <div className="repMetric">{[["valor", "Valor"], ["pedidos", "Pedidos"]].map(([id, l]) => <button key={id} aria-pressed={metric === id} className={need[id] ? "locked" : ""} onClick={() => tryOpen(id, () => setMetric(id))}>{l}</button>)}</div>}</div>
          <div className="repBody"><div className="chartBox" ref={boxRef}>{chartView}</div>
            <aside className="reading"><span>LEITURA AUTOMÁTICA</span>{lock && <p className="lockNote" key={lock}>{lock}</p>}{reading.map((r, i) => <p key={r} style={{ "--i": i }}>{r}</p>)}
              {chart !== "line" && chart !== "none" && (has("xlsx") ? <ul>{cur.rows.map(r => <li key={r[0]}><b>{r[0]}</b>{r[1]}<i>{r[2]}</i></li>)}</ul> : <p className="gapNote">Sem o XLSX, eu sei quanto está parado, mas não quem está esperando.</p>)}</aside></div>
          <div className="repFoot"><span>TOCARAM · {picked.map(id => files.find(f => f.id === id).ext).join(" · ")}{missing.length > 0 && <em> · FALTARAM · {missing.join(" · ")}</em>}</span><button className="ghostAction" onClick={reset}>Nova apresentação</button></div>
        </div>}
      </div>
      <div className="stage">
        <svg className="arcs" viewBox="0 0 100 100" preserveAspectRatio="none">{seats.map((s, i) => { const f = files[i]; return picked.includes(f.id) && <path key={f.id} className={phase === "report" && !lit.includes(f.id) ? "rest" : ""} d={`M${s.x} ${s.y + 14}Q${(s.x + 50) / 2} ${s.y - 22} 50 20`} style={{ stroke: f.color }} />; })}</svg>
        <div className="console"><i /><i /><i /><i /></div>
        {seats.map((s, i) => { const f = files[i], on = picked.includes(f.id); return <div key={f.id} className={`seat ${on ? "taken" : ""} ${on && phase === "report" ? (lit.includes(f.id) ? "lit" : "rest") : ""}`} style={{ left: `${s.x}%`, top: `${s.y}%`, "--c": f.color, "--d": `${i * .13}s` }}>
          <PixelArt name="stand" className="stand" />
          <PixelArt name="chair" className="chair" />
          {on && <span className="musician"><PixelArt name="docIdle" className="idle" tint={f.color} /><PixelArt name="docHappy" className="happy" tint={f.color} /><b>{f.ext}</b></span>}
          {on && <span className="notes"><i>♪</i><i>♫</i></span>}
        </div>; })}
        <div className="maestro"><PixelArt name="maestro0" className="m0" /><PixelArt name="maestro1" className="m1" /><i className="podium" /></div>
      </div>
    </div>
    <span className="visualCaption">EXEMPLO INTERATIVO · DADOS FICTÍCIOS</span>
  </div>;
}
