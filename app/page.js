import StudioEntrance from "./components/StudioEntrance";
import ProjectExperience from "./components/ProjectExperience";
import { StudioHeader, StudioFooter } from "./components/StudioChrome";
import { ProjectDetailProvider } from "./components/ProjectDetail";
import { ImpactTeaser } from "./components/Impact";

export default function Home() {
  return <StudioEntrance><ProjectDetailProvider><StudioHeader />
    <section className="studioWelcome" id="inicio"><p className="monoLabel">LEOMADE / MEU ESTÚDIO INDEPENDENTE</p><h1 id="studio-start" tabIndex={-1}>Transformo perguntas<br />em <em>possibilidades.</em></h1><div className="welcomeBottom"><p>Crio software, exploro dados e experimento com inteligência artificial.<br />Este é meu espaço para tirar ideias do papel e descobrir até onde elas podem ir.</p><a className="textLink" href="#laboratorio">Conheça minhas ideias <span>↓</span></a></div></section>
    <div className="curiosityRibbon" aria-hidden="true"><div>{Array.from({ length: 4 }, (_, i) => <span key={i}>CURIOSIDADE É MATÉRIA-PRIMA <i>✳</i> MADE WITH CURIOSITY <i>✳</i> IDEIAS EM MOVIMENTO <i>✳</i></span>)}</div></div>
    <ProjectExperience />
    <ImpactTeaser />
    <section className="studioManifesto" id="estudio"><p className="monoLabel">MEU ESTÚDIO. CAMPO ABERTO.</p><div data-reveal><h2>Um lugar para<br />levar o <em>“e se?”</em><br />a sério.</h2><div className="manifestoCopy"><p>A LEOMADE é meu estúdio independente de criatividade e experimentação com software e inteligência artificial.</p><p>Aqui desenvolvo produtos próprios, investigo problemas reais e testo ideias que ainda não sei onde vão chegar.</p><a href="/leo" className="textLink">Um pouco sobre mim <span>↗</span></a></div></div><div className="studioFields"><span>01 / PRODUTOS DIGITAIS</span><span>02 / PROCESSOS & DADOS</span><span>03 / EXPERIÊNCIAS & EXPERIMENTOS</span></div></section>
    <section className="vibeSection"><div className="vibeBadge" data-reveal>HUMAN<br /><em>× AI</em><span>FEITO EM CONVERSA</span></div><div><p className="monoLabel">COMO CRIEI ESTE SITE</p><h2>Sim, é<br /><em>vibe coding.</em></h2><p>Criei este site por prompts, sem escrever o código à mão. Defini a ideia, trouxe referências, pedi mudanças e revisei o resultado. A IA escreveu o código.</p><p className="vibeSecond">Uso a IA para acelerar a execução. Eu cuido da direção, questiono as respostas e decido o que precisa mudar. A responsabilidade pelas escolhas continua comigo.</p><a href="/leo#como-trabalho" className="textLink">Como eu trabalho <span>↗</span></a></div></section>
    <StudioFooter />
  </ProjectDetailProvider></StudioEntrance>;
}
