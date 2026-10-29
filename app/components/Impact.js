"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { areas, toolTypes, deliveries, reuseLines, reuseStations, impactNumbers, inUseStatuses } from "./impactData";
import { useProjectDetail } from "./ProjectDetail";

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

export function ReuseMetro() {
  const { open } = useProjectDetail();
  const [active, setActive] = useState(null);
  const bounds = Object.fromEntries(reuseLines.map(l => {
    const idx = reuseStations.map((s, i) => s.lines.includes(l.id) ? i : -1).filter(i => i >= 0);
    return [l.id, [Math.min(...idx), Math.max(...idx), idx.length]];
  }));
  return <section className="reuseMetro" id="reaproveitamento" aria-labelledby="metro-title">
    <div className="metroIntro" data-reveal>
      <p className="monoLabel">UMA FERRAMENTA PUXA A OUTRA</p>
      <h2 id="metro-title">Não começo<br /><em>do zero.</em></h2>
      <p>Cada ferramenta deixa peças prontas para a próxima: um visual que as pessoas já reconhecem, a planilha que se arrasta e solta, o treemap que mergulha até o detalhe. Foi assim que uma conferência pedida por uma área virou plataforma para várias frentes.</p>
      <div className="metroLegend" role="group" aria-label="Destacar uma peça reaproveitada">{reuseLines.map(l => <button key={l.id} style={{ "--line": l.color }} aria-pressed={active === l.id} onClick={() => setActive(active === l.id ? null : l.id)}><i />{l.label}<small>{bounds[l.id][2]}×</small></button>)}</div>
      <blockquote>Quando alguém de outra frente viu uma ferramenta pronta, pediu uma igual. É o indicador de que eu mais gosto.</blockquote>
    </div>
    <ol className={`metroMap ${active ? "focused" : ""}`} aria-label="Ferramentas em ordem aproximada de criação">
      {reuseStations.map((s, si) => {
        const d = deliveries.find(x => x.id === s.id);
        const on = !active || s.lines.includes(active);
        return <li key={s.id} className={`metroStop ${on ? "" : "dim"}`}>
          <div className="metroTracks" aria-hidden="true">{reuseLines.map(l => {
            const [first, last] = bounds[l.id];
            const passes = si >= first && si <= last;
            const cls = ["metroTrack", passes && "passes", s.lines.includes(l.id) && "stops", si === first && "start", si === last && "end", active && active !== l.id && "faded"].filter(Boolean).join(" ");
            return <span key={l.id} className={cls} style={{ "--line": l.color }}><i /></span>;
          })}</div>
          <div className="metroInfo"><span>{String(si + 1).padStart(2, "0")} · {areaById[d.area].label} · {d.status}</span><h3>{d.name}</h3><p>{s.note}</p><div className="metroPieces">{s.lines.map(id => <i key={id} style={{ "--line": reuseLines.find(l => l.id === id).color }} title={reuseLines.find(l => l.id === id).label} />)}</div>{d.caseId && <button onClick={() => open(d.caseId)}>Ver o case ↗</button>}</div>
        </li>;
      })}
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
