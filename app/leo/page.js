"use client";
import { useEffect, useRef, useState } from "react";
import ProjectExperience from "../components/ProjectExperience";
import { StudioHeader, StudioFooter, linkedIn } from "../components/StudioChrome";
import { ProjectDetailProvider } from "../components/ProjectDetail";
import { ImpactAtlas, ReuseMetro } from "../components/Impact";
import { impactNumbers } from "../components/impactData";

const steps = [["Problema", "Observo o gargalo real."], ["Contexto", "Entendo regras e exceções."], ["Estrutura", "Organizo dados e fluxo."], ["Solução", "Transformo a ideia em algo utilizável."]];
function ProcessJourney() {
  const section = useRef(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame;
    const update = () => {
      const rect = section.current?.getBoundingClientRect();
      if (rect) setProgress(reduced.matches ? 1 : Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height - window.innerHeight))));
    };
    const request = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    update(); window.addEventListener("scroll", request, { passive: true }); window.addEventListener("resize", request); reduced.addEventListener("change", request);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", request); window.removeEventListener("resize", request); reduced.removeEventListener("change", request); };
  }, []);
  return <section className="leoProcessJourney" ref={section} style={{ "--journey-progress": progress }} aria-labelledby="journey-title"><div className="leoProcessSticky"><p className="monoLabel">01 / COMO EU TIRO UMA IDEIA DO PAPEL</p><div className="leoProcessBody"><h2 id="journey-title">Do problema<br /><em>à solução.</em></h2><div className="leoProcessTrack">{steps.map(([title, description], i) => <div className={progress >= i / 3 - .04 ? "illuminated" : ""} key={title}><span className="processNode">0{i + 1}</span><h3>{title}</h3><p>{description}</p></div>)}</div></div><span className="processScrollNote">ROLE PARA ACOMPANHAR ↓</span></div></section>;
}

export default function Leo() {
  const n = impactNumbers();
  return <main className="leoPage"><ProjectDetailProvider><a className="skipLink" href="#impacto">Ir para o mapa de impacto</a><StudioHeader personal />
    <section className="leoHero" id="inicio"><div><p className="monoLabel">OI, SOU O LÉO. / LEONARDO REBOUÇAS</p><h1>Entre o problema<br />e a solução,<br /><em>tem curiosidade.</em></h1><p className="leoLead">Sou bacharel em Ciência da Computação, estudante de Inteligência Artificial e estagiário de Business Process Transformation no ICL Group. Conecto processos, dados e tecnologia e, dirigindo IA, construo ferramentas para áreas como finanças, marketing, comunicação e comercial.</p><div className="leoHeroLinks"><a className="studioButton cream" href="#impacto">Veja onde meu trabalho chegou ↘</a><a className="textLink" href={linkedIn} target="_blank" rel="noreferrer">Meu LinkedIn ↗</a></div><a className="heroImpact" href="#impacto" aria-label={`${n.deliveries} entregas, ${n.areas} áreas, ${n.inUse} em uso hoje. Ver o mapa de impacto`}><span><b>{n.deliveries}</b>entregas</span><span><b>{String(n.areas).padStart(2, "0")}</b>áreas</span><span><b>{String(n.inUse).padStart(2, "0")}</b>em uso hoje</span></a></div><div className="leoKinetic" aria-hidden="true"><span>ENTENDER.</span><em>imaginar.</em><span>CONSTRUIR.</span><div><i /> PROCESSOS + DADOS + IA</div></div></section>
    <ProcessJourney />
    <ImpactAtlas />
    <ReuseMetro />
    <ProjectExperience personal />
    <section className="leoTrajectory" id="trajetoria"><div data-reveal><p className="monoLabel">04 / MINHA TRAJETÓRIA</p><h2>Antes da ideia,<br /><em>o mundo real.</em></h2><p>Passei por operação, suporte e transformação. Trabalhar perto de quem usa as ferramentas mudou meu jeito de pensar tecnologia.</p></div><div className="trajectoryRows"><article><span>AGORA</span><div><h3>ICL Group</h3><strong>Business Process Transformation</strong><p>Hoje trabalho com processos, dados, automação e migração corporativa. Entendo a rotina, traduzo regras e valido soluções junto com o negócio.</p></div></article><article><span>ANTES</span><div><h3>1TeamCloud</h3><strong>Telecom & suporte técnico</strong><p>Atuei com VoIP, cloud e suporte técnico para clientes, incluindo instituições financeiras. Lidei com prioridades, continuidade da operação e comunicação sob pressão.</p></div></article><article><span>ANTES</span><div><h3>DHL Express</h3><strong>Operação & financeiro</strong><p>Trabalhei com processos de operação e demandas financeiras. Aprendi a acompanhar fluxos e resolver pendências antes de começar a criar ferramentas para isso.</p></div></article><article><span>ESTUDANDO</span><div><h3>Inteligência Artificial</h3><strong>Universidade Anhembi Morumbi · em andamento</strong><p>Estou cursando Inteligência Artificial na Anhembi Morumbi. Quero aprofundar minha formação e conectar o que estudo aos problemas de processos, dados e software que encontro na prática.</p></div></article><article><span>FORMAÇÃO</span><div><h3>Ciência da Computação</h3><strong>Bacharelado concluído</strong><p>Concluí meu bacharelado em Ciência da Computação. No TCC, explorei a análise de dados econômicos que deu origem ao Embate dos Governos.</p></div></article></div></section>
    <section className="leoMethod" id="como-trabalho"><p className="monoLabel">05 / COMO EU TRABALHO</p><h2>Prompt é o começo.<br /><em>Critério é o trabalho.</em></h2><div className="methodColumns" data-reveal><article><span>01</span><h3>Entender</h3><p>Começo pelas pessoas, pela regra real e pelas exceções. As áreas abrem a demanda por um formulário que criei, com casos reais, o que fica fora e a definição de pronto.</p></article><article><span>02</span><h3>Dirigir com IA</h3><p>Uso agentes de código para transformar especificações e prompts em software. Dou direção, reviso a lógica e ajusto o que precisa melhorar.</p></article><article><span>03</span><h3>Validar</h3><p>Comparo saídas com os relatórios de origem, questiono o resultado e testo com quem vai usar. Dados reais não vão para a IA: anonimizo antes.</p></article></div><div className="leoTools"><span>Python</span><span>SQL</span><span>JavaScript</span><span>ETL & data mapping</span><span>Power BI</span><span>Power Automate</span><span>SharePoint</span><span>Process design</span><span>Data analysis</span><span>Generative AI</span><span>Vibe coding</span></div><a className="textLink" href="/">Conheça meu estúdio, LEOMADE ↗</a></section>
    <StudioFooter personal />
  </ProjectDetailProvider></main>;
}
