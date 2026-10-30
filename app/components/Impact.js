"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { areas, toolTypes, deliveries, reuseLines, reuseStations, impactNumbers, inUseStatuses } from "./impactData";
import { useProjectDetail } from "./ProjectDetail";
import { sfx } from "./sound";

const areaById = Object.fromEntries(areas.map(a => [a.id, a]));
const typeById = Object.fromEntries(toolTypes.map(t => [t.id, t]));

const icons = {
  rotina: <><rect x="3" y="3" width="14" height="14" rx="2.5" /><path d="M6.6 10.3l2.3 2.3 4.6-5" /></>,
  relatorio: <><rect x="3" y="3" width="14" height="14" rx="1.5" /><path d="M10 3v14M10 9h7M3 12h7" /></>,
  plataforma: <><ellipse cx="10" cy="5.5" rx="6" ry="2.4" /><path d="M4 5.5v9c0 1.3 2.7 2.4 6 2.4s6-1.1 6-2.4v-9M4 10c0 1.3 2.7 2.4 6 2.4s6-1.1 6-2.4" /></>,
  fluxo: <><circle cx="4.5" cy="10" r="1.8" /><circle cx="15.5" cy="4.5" r="1.8" /><circle cx="15.5" cy="15.5" r="1.8" /><path d="M6.3 10H10m0 0V5.6c0-.6.5-1.1 1.1-1.1h2.6M10 10v4.4c0 .6.5 1.1 1.1 1.1h2.6" /></>,
  dados: <><path d="M4 7h11.5M12.5 4l3 3-3 3M16 13H4.5M7.5 10l-3 3 3 3" /></>,
  analise: <><path d="M3 16.5h14M4.5 13l3.5-4 3 2.5 4.5-6" /><circle cx="15.5" cy="5.5" r="1.3" /></>,
  apoio: <><path d="M10 2.8l6 2.3v4.4c0 3.6-2.5 6.4-6 7.7-3.5-1.3-6-4.1-6-7.7V5.1z" /><path d="M7.4 10l1.8 1.8 3.5-3.6" /></>,
};
export function TypeIcon({ type }) {
  return <svg className="typeIcon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[type]}</svg>;
}

export function CountUp({ value }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(value);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame;
    setShown(0);
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = now => { const t = Math.min(1, (now - start) / 1100); setShown(Math.round(value * (1 - Math.pow(1 - t, 3)))); if (t < 1) frame = requestAnimationFrame(tick); };
      frame = requestAnimationFrame(tick);
    }, { threshold: .5 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(frame); };
  }, [value]);
  return <strong ref={ref} aria-label={String(value)}>{String(shown).padStart(2, "0")}</strong>;
}

const statusTone = status => inUseStatuses.includes(status) ? "live" : status.startsWith("Em ") ? "building" : "done";

function NumbersRow({ className = "impactNumbers" }) {
  const n = impactNumbers();
  return <div className={className}>{[[n.deliveries, "entregas e projetos"], [n.areas, "áreas atendidas"], [n.types, "tipos de ferramenta"], [n.inUse, "em uso hoje"]].map(([value, label]) => <div key={label}><CountUp value={value} /><span>{label}</span></div>)}</div>;
}

export function ImpactAtlas() {
  const { open } = useProjectDetail();
  const [filter, setFilter] = useState({ area: null, type: null });
  const [expanded, setExpanded] = useState(false);
  const list = useMemo(() => deliveries.filter(d => (!filter.area || d.area === filter.area) && (!filter.type || d.type === filter.type)), [filter]);
  const count = (area, type) => deliveries.filter(d => d.area === area && d.type === type).length;
  const pick = next => {
    setFilter(current => (current.area === next.area && current.type === next.type) ? { area: null, type: null } : next);
  };
  const usedAreas = areas.filter(a => deliveries.some(d => d.area === a.id));
  const usedTypes = toolTypes.filter(t => deliveries.some(d => d.type === t.id));
  const filtered = Boolean(filter.area || filter.type);
  const PREVIEW = 6;
  const visible = filtered || expanded ? list : list.slice(0, PREVIEW);
  const filterText = filter.area && filter.type ? `${areaById[filter.area].label} × ${typeById[filter.type].label}` : filter.area ? areaById[filter.area].label : filter.type ? typeById[filter.type].label : "Todas as áreas e tipos";
  return <section className="impactAtlas" id="impacto" aria-labelledby="impact-title">
    <div className="impactIntro" data-reveal><div><p className="monoLabel">02 / IMPACTO NAS ÁREAS</p><h2 id="impact-title">Um jeito de pensar,<br /><em>muitas áreas.</em></h2></div><p>Trabalho com transformação de processos e atendo equipes bem diferentes. Este é o mapa do que já construí, em versão white label: sem nomes, valores ou dados internos. Só o tipo de problema, o tipo de ferramenta e o que ela pode fazer por outras equipes.</p></div>
    <NumbersRow />
    <div className="impactBoard" data-reveal>
      <div className="boardHead"><span><i /> ÁREA × TIPO DE FERRAMENTA</span><span className="boardHint">TOQUE NUMA ÁREA, NUM TIPO OU NUM PONTO</span></div>
      <div className="boardBody">
        <div className="matrixWrap"><table className="impactMatrix">
          <caption className="srOnly">Quantidade de entregas por área e tipo de ferramenta</caption>
          <thead><tr><th scope="col"><span className="srOnly">Área</span></th>{usedTypes.map(t => <th scope="col" key={t.id}><button className={filter.type === t.id && !filter.area ? "active" : ""} aria-pressed={filter.type === t.id && !filter.area} onClick={() => pick({ area: null, type: t.id })} title={t.label}><TypeIcon type={t.id} /><span className="srOnly">{t.label}</span></button></th>)}</tr></thead>
          <tbody>{usedAreas.map(a => <tr key={a.id} className={filter.area === a.id ? "rowActive" : ""}><th scope="row"><button className={filter.area === a.id && !filter.type ? "active" : ""} aria-pressed={filter.area === a.id && !filter.type} onClick={() => pick({ area: a.id, type: null })}>{a.label}<small>{deliveries.filter(d => d.area === a.id).length}</small></button></th>{usedTypes.map(t => { const c = count(a.id, t.id); const on = (!filter.area || filter.area === a.id) && (!filter.type || filter.type === t.id); return <td key={t.id} className={on ? "" : "muted"}>{c ? <button className={`dot n${Math.min(c, 3)} ${filter.area === a.id && filter.type === t.id ? "active" : ""}`} aria-label={`${a.label}, ${t.label}: ${c} ${c > 1 ? "entregas" : "entrega"}`} aria-pressed={filter.area === a.id && filter.type === t.id} onClick={() => pick({ area: a.id, type: t.id })}><i /></button> : <span className="dot empty" aria-hidden="true" />}</td>; })}</tr>)}</tbody>
        </table></div>
        <ul className="typeLegend">{usedTypes.map(t => <li key={t.id}><button className={filter.type === t.id ? "active" : ""} onClick={() => pick({ area: null, type: t.id })} aria-pressed={filter.type === t.id && !filter.area}><TypeIcon type={t.id} /><span><b>{t.label}</b>{t.text}</span></button></li>)}</ul>
      </div>
    </div>
    <div className="impactStatusBar" aria-live="polite"><span><b>{String(visible.length).padStart(2, "0")}</b> de {deliveries.length} · {filterText}</span>{(filter.area || filter.type) && <button onClick={() => setFilter({ area: null, type: null })}>Ver tudo ×</button>}</div>
    <div className="impactCards" id="impact-cards" key={`${filter.area}-${filter.type}`}>
      {visible.map((d, i) => <article className="impactCard" key={d.id} style={{ "--i": i }}>
        <div className="impactCardMeta"><span>{areaById[d.area].label}</span><span className="impactType"><TypeIcon type={d.type} />{typeById[d.type].short}</span></div>
        <h3>{d.name}</h3>
        <span className={`impactStatus ${statusTone(d.status)}`}><i />{d.status}</span>
        <dl><dt>A pergunta</dt><dd>{d.question}</dd><dt>O que construí</dt><dd>{d.built}</dd></dl>
        <p className="impactReuse"><span>Serve também para</span>{d.reuse}</p>
        {d.caseId && <button className="impactCase" onClick={() => open(d.caseId)}>Ver o case <i>↗</i></button>}
      </article>)}
    </div>
    {!filtered && <button className="impactMore" aria-expanded={expanded} aria-controls="impact-cards" onClick={() => { if (expanded) document.getElementById("impacto")?.scrollIntoView({ block: "start" }); setExpanded(!expanded); }}>{expanded ? "Mostrar menos ↑" : `Ver todas as ${list.length} entregas ↓`}<span>{expanded ? "" : `+${list.length - PREVIEW}`}</span></button>}
  </section>;
}

// Every line departs from the same terminal: listening before building.
const terminal = {
  id: "terminal", terminal: true, lines: reuseLines.map(l => l.id),
  label: "00 · TERMINAL · EM TODO PROJETO",
  name: "Ouvir e entender a necessidade",
  note: "Todo projeto começa escutando e entendendo qual é a dor. Antes de reaproveitar qualquer peça, converso com quem vive a rotina para entender a regra, as exceções e o que significa pronto.",
};
const metroStations = [terminal, ...reuseStations];

// Which later stations each station "fed", line by line.
const feeds = metroStations.map((s, si) => {
  const byLine = {};
  s.lines.forEach(l => {
    const targets = metroStations.map((t, ti) => ti > si && t.lines.includes(l) ? ti : -1).filter(ti => ti >= 0);
    if (targets.length) byLine[l] = targets;
  });
  return { byLine, all: [...new Set(Object.values(byLine).flat())].sort((x, y) => x - y) };
});

export function ReuseMetro() {
  const { open } = useProjectDetail();
  const [active, setActive] = useState(null);
  const [source, setSource] = useState(null);
  const [geo, setGeo] = useState(null);
  const mapRef = useRef(null);
  const stops = useRef([]);
  const bounds = Object.fromEntries(reuseLines.map(l => {
    const idx = metroStations.map((s, i) => s.lines.includes(l.id) ? i : -1).filter(i => i >= 0);
    return [l.id, [Math.min(...idx), Math.max(...idx), idx.length]];
  }));

  // Scroll draws the lines downwards and opens one station at a time.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const reveal = () => stops.current.forEach(li => { if (!li) return; li.style.setProperty("--fill", "1"); li.classList.add("reached"); });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { reveal(); return; }
    map.classList.add("scrolly");
    let frame, locked = false;
    const fills = [], reached = [];
    // One way only: what has appeared stays; once the last station is reached, everything locks on.
    const update = () => {
      if (locked) return;
      const head = window.innerHeight * .58;
      const last = stops.current.length - 1;
      stops.current.forEach((li, i) => {
        if (!li) return;
        const r = li.getBoundingClientRect();
        const stopY = parseFloat(getComputedStyle(li).getPropertyValue("--stop-y")) || 46;
        fills[i] = Math.max(fills[i] || 0, Math.min(1, (head - r.top) / r.height));
        reached[i] = reached[i] || i === 0 || head >= r.top + stopY;
        li.style.setProperty("--fill", fills[i].toFixed(3));
        li.classList.toggle("reached", reached[i]);
      });
      if (reached[last]) { locked = true; reveal(); map.classList.add("complete"); }
    };
    const request = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", request); window.removeEventListener("resize", request); };
  }, []);

  // Where each line runs and where each station sits, for the trains.
  useEffect(() => {
    if (source === null) return;
    const measure = () => {
      const map = mapRef.current, first = stops.current[0];
      if (!map || !first) return;
      const mr = map.getBoundingClientRect();
      const x = {};
      first.querySelectorAll(".metroTrack").forEach((t, i) => { const r = t.getBoundingClientRect(); x[reuseLines[i].id] = r.left + r.width / 2 - mr.left; });
      const y = stops.current.map(li => { const r = li.getBoundingClientRect(); return r.top - mr.top + (parseFloat(getComputedStyle(li).getPropertyValue("--stop-y")) || 46); });
      setGeo({ x, y });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [source]);

  const choose = si => {
    const next = source === si ? null : si;
    setSource(next);
    setActive(null);
    if (next !== null) sfx.metro();
  };
  const fed = source === null ? [] : feeds[source].all;
  const nameOf = i => deliveries.find(x => x.id === metroStations[i].id).name;
  return <section className="reuseMetro" id="reaproveitamento" aria-labelledby="metro-title">
    <div className="metroIntro" data-reveal>
      <p className="monoLabel">UMA FERRAMENTA PUXA A OUTRA</p>
      <h2 id="metro-title">Não começo<br /><em>do zero.</em></h2>
      <p>Não começar do zero não é só reaproveitar peças. Todo projeto começa do mesmo jeito: ouvindo e entendendo a dor de quem pede. Depois, cada ferramenta deixa peças prontas para a próxima.</p>
      <div className="metroLegend" role="group" aria-label="Destacar uma peça reaproveitada">{reuseLines.map(l => <button key={l.id} style={{ "--line": l.color }} aria-pressed={active === l.id} onClick={() => { setActive(active === l.id ? null : l.id); setSource(null); }}><i />{l.label}<small>{bounds[l.id][2] - 1}×</small></button>)}</div>
      <p className="metroHint"><i />TOQUE NUMA ESTAÇÃO PARA VER O QUE ELA ALIMENTOU</p>
      <blockquote>Quando alguém de outra frente viu uma ferramenta pronta, pediu uma igual. É o indicador de que eu mais gosto.</blockquote>
    </div>
    <ol ref={mapRef} className={`metroMap ${active ? "focused" : ""} ${active || source !== null ? "showAll" : ""} ${source !== null ? "routing" : ""}`} aria-label="Ferramentas em ordem aproximada de criação">
      {metroStations.map((s, si) => {
        const d = s.terminal ? null : deliveries.find(x => x.id === s.id);
        const role = source === null ? "" : si === source ? "source" : fed.includes(si) ? "fed" : "idle";
        const on = active ? s.lines.includes(active) : role !== "idle";
        return <li key={s.id} ref={el => { stops.current[si] = el; }} className={`metroStop ${on ? "" : "dim"} ${role} ${s.terminal ? "terminal" : ""}`}>
          <div className="metroTracks" aria-hidden="true">{reuseLines.map(l => {
            const [first, last] = bounds[l.id];
            const passes = si >= first && si <= last;
            const carries = source !== null && feeds[source].byLine[l.id] && si >= source && si <= Math.max(...feeds[source].byLine[l.id]);
            const faded = (active && active !== l.id) || (source !== null && !carries);
            const cls = ["metroTrack", passes && "passes", s.lines.includes(l.id) && "stops", si === first && "start", si === last && "end", faded && "faded"].filter(Boolean).join(" ");
            return <span key={l.id} className={cls} style={{ "--line": l.color }}><i /></span>;
          })}</div>
          <div className="metroInfo">
            <span>{s.terminal ? s.label : `${String(si).padStart(2, "0")} · ${areaById[d.area].label} · ${d.status}`}</span>
            <h3><button className="metroStation" aria-pressed={source === si} onClick={() => choose(si)}>{s.terminal ? s.name : d.name}</button></h3>
            <p>{s.note}</p>
            <div className="metroPieces">{s.lines.map(id => <i key={id} style={{ "--line": reuseLines.find(l => l.id === id).color }} title={reuseLines.find(l => l.id === id).label} />)}</div>
            {source === si && <p className="metroFed" aria-live="polite">{s.terminal ? <><b>Todo projeto começa aqui.</b> As {fed.length} ferramentas nasceram de alguém me contando onde doía.</> : fed.length ? <><b>Alimentou {fed.length} {fed.length > 1 ? "ferramentas" : "ferramenta"}:</b> {fed.map(nameOf).join(", ")}.</> : <b>Ponta da linha, por enquanto. A próxima ferramenta sai daqui.</b>}</p>}
            {d?.caseId && <button className="metroCase" onClick={() => open(d.caseId)}>Ver o case ↗</button>}
          </div>
        </li>;
      })}
      {source !== null && geo && <li className="metroTrains" aria-hidden="true">{Object.entries(feeds[source].byLine).map(([lineId, targets], k) => {
        const y0 = geo.y[source], y1 = geo.y[Math.max(...targets)];
        const color = reuseLines.find(l => l.id === lineId).color;
        return [0, 1].map(car => <span key={`${lineId}${car}`} className="metroTrain" style={{ left: geo.x[lineId], top: y0, "--run": `${y1 - y0}px`, "--line": color, animationDuration: `${Math.max(1.6, (y1 - y0) / 260)}s`, animationDelay: `${k * .18 + car * Math.max(.8, (y1 - y0) / 520)}s` }} />);
      })}</li>}
    </ol>
  </section>;
}

export function ImpactTeaser() {
  const used = areas.filter(a => deliveries.some(d => d.area === a.id));
  return <section className="impactTeaser" id="no-trabalho" aria-labelledby="teaser-title">
    <div className="teaserCopy" data-reveal>
      <p className="monoLabel">FORA DO ESTÚDIO / NO DIA A DIA DAS EMPRESAS</p>
      <h2 id="teaser-title">A mesma curiosidade,<br /><em>a serviço de outras áreas.</em></h2>
      <p>Na transformação de processos, levo esse jeito de construir para finanças, marketing, comunicação, comercial e dados. São ferramentas de verdade, várias delas em uso, contadas sem nomes nem números internos.</p>
      <a className="studioButton cream" href="/leo#impacto">Ver o mapa de impacto <span>↗</span></a>
    </div>
    <div className="teaserBoard" data-reveal>
      <NumbersRow className="teaserNumbers" />
      <ul className="teaserAreas">{used.map(a => { const items = deliveries.filter(d => d.area === a.id); const types = [...new Set(items.map(d => d.type))]; return <li key={a.id}><span>{a.label}<small>{a.detail}</small></span><span className="teaserIcons">{types.map(t => <TypeIcon key={t} type={t} />)}</span></li>; })}</ul>
    </div>
  </section>;
}
