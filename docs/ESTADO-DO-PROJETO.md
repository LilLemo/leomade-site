# Estado da entrega | 29/10/2026

Versão publicada: **26**. Versão neste pacote: **27** (ainda não publicada).

## Versão 27 | Mapa de impacto (29/10/2026)

Pacote atualizado em outro chat (Claude). Ainda NÃO publicado na hospedagem existente.

### O que mudou

- /leo ganhou um fluxo numerado: 01 Como eu tiro uma ideia do papel, 02 Impacto nas áreas, Uma ferramenta puxa a outra, 03 Projetos em detalhe, 04 Trajetória, 05 Como trabalho.
- **Mapa de impacto (#impacto)**: matriz área x tipo de ferramenta clicável, contadores calculados a partir dos dados, cards white label com pergunta, o que construí, "serve também para" e status. Mostra 6 cards e expande para todos.
- **Metrô de reaproveitamento (#reaproveitamento)**: linhas coloridas mostram peças que passam de uma ferramenta para outra (identidade, arrastar planilha, treemap, exportação, PT/EN). Legenda destaca uma linha.
- **Home**: nova seção "Fora do estúdio" (#no-trabalho) com números e áreas, levando para /leo#impacto. Menu ganhou "No trabalho" na home e "Impacto"/"Projetos" em /leo.
- **Novos cases**: Plataforma de fechamento (flow), Relatórios que se explicam (treemap interativo fictício), IA com dados protegidos (demo de anonimização). Central de conferência, Portal de Briefing, Integração de dados e Sinais de devolução foram revisados.
- Dialog de detalhes virou um provider único (ProjectDetail.js), aberto pelo projetor, pelos cards e pelo metrô, com navegação entre cases.
- Barra de progresso de leitura e revelação suave ao rolar. Ambas desligadas com movimento reduzido.

### Arquivos novos ou alterados

| Arquivo | Responsabilidade |
| --- | --- |
| app/components/impactData.js | Catálogo white label: áreas, tipos, entregas, linhas do metrô |
| app/components/Impact.js | Mapa de impacto, metrô, teaser da home, ícones e contadores |
| app/components/ProjectDetail.js | Provider e dialog de detalhes |
| app/components/ProjectVisual.js | Visuais dos projetos (inclui treemap e anonimizador) |
| app/components/Motion.js | Progresso de leitura e revelação |
| app/impact.css | Estilos novos, carregado depois de studio.css |
| app/components/projects.js | Cases revisados e novos (10 no total) |
| app/page.js, app/leo/page.js, app/layout.js, app/leo/layout.js, app/components/StudioChrome.js, app/components/ProjectExperience.js | Integração |

### Regras de conteúdo mantidas

- Sem nomes de pessoas, fornecedores, clientes, valores, volumes, códigos de transação ou telas reais. Dados das demos são fictícios.
- Números exibidos (entregas, áreas, tipos, em uso) são contados a partir de impactData.js; ao incluir ou mudar status de uma entrega, os números se ajustam sozinhos.
- Status confirmado no histórico. "Controle logístico fora da planilha" usa o status neutro "Construído" e precisa de confirmação.

### Testes executados

- npm ci e npm run build passaram.
- Playwright (Chromium) em 1440x900 e 390x844: sem erros de console, sem rolagem horizontal, filtros da matriz (linha, coluna, ponto, legenda, limpar), abrir/fechar dialog e navegar entre cases, treemap e anonimizador, destaque do metrô, interruptor /leo para /#inicio, entrada pelo olho, link da home para /leo#impacto, links diretos /#laboratorio, /home e /Home, e modo de movimento reduzido.
- Celular real (gestos e Safari iOS) continua sem validação.

## Implementado na versão 26

- Abertura fixa, convite à curiosidade e botão olho com expansão de verde.
- Estúdio nas rotas /, /home e /Home, em verde escuro.
- Perfil pessoal em /leo, em verde claro e creme.
- Roadmap com fundo sálvia mais escuro, linha de progresso de 3 px em verde claro e bolinhas ativas preenchidas. Degradês das bordas preservados. Contraste calculado acima de 4,5:1 para linha, título e descrições ativas; build passou.
- Interruptor de navegação Estúdio/Sobre mim e transição de luz entre as rotas. Movimento reduzido usa a navegação nativa sem animação.
- Projetor interativo de projetos e detalhes em dialog.
- Embate dos Governos com cinco telas reais do repositório público.
- Seção Experiência aplicada com plataforma de pagamentos, portal de briefing e integração/migração de dados.
- Cases com problema, minha participação, resultado ou estágio atual e premissas. Fluxos profissionais reconstruídos de forma ilustrativa.
- Trajetória profissional, bacharelado concluído e IA em andamento na Anhembi Morumbi.
- Textos em primeira pessoa e transparência sobre construção com IA.

## Arquivos importantes

| Arquivo | Responsabilidade |
| --- | --- |
| app/components/projects.js | Catálogo dos projetos e textos dos cases |
| app/components/ProjectExperience.js | Projetor, seção de cases e detalhes |
| app/components/ModeSwitch.js | Interruptor e chegada da transição |
| app/components/StudioChrome.js | Navegação e rodapé |
| app/components/StudioHero.js | Tela inicial com o olho |
| app/components/StudioEntrance.js | Entrada e liberação da rolagem |
| app/studio.css | Identidade visual, tema pessoal e responsividade |
| app/leo/page.js | Perfil, roadmap e trajetória |

## Limites e pendências

- Panorama entrou só como card white label no mapa ("Painel de acompanhamento da comunicação interna"), descrito em termos gerais. Não tem case detalhado.
- A descrição da vaga do iFood não pôde ser lida automaticamente, por bloqueio de acesso. Não foi inserido conteúdo específico da vaga no site.
- Não há métricas internas nem ganhos quantitativos inventados.
- Não presumir que projetos em desenvolvimento já foram lançados ou concluídos.
- Build e rotas /, /home, /Home e /leo passaram.
- Testes em DOM simulado passaram para transição de saída/chegada, preferência de movimento reduzido e abertura dos três cases com premissas.
- A validação visual em navegador real de celular permanece pendente. DOM simulado não comprova aparência nem gestos em um aparelho real.
- Este pacote não é confirmação de criação de um repositório privado na conta GitHub do usuário.

Commit do código incluído: `deacd3d5323eed7ab05437f5309176e1c554c9e5`.
