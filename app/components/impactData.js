// White label map of my applied work: areas, kinds of tool and what each one does.
// No company names, people, values, volumes, identifiers or internal documents.

export const areas = [
  { id: "financas", label: "Finanças", detail: "Pagamentos e tesouraria" },
  { id: "credito", label: "Crédito & vendas", detail: "Pedidos e liberação" },
  { id: "marketing", label: "Marketing & design", detail: "Demandas e entregas" },
  { id: "comunicacao", label: "Comunicação interna", detail: "Rotina do time" },
  { id: "comercial", label: "Comercial & CRM", detail: "Clientes, territórios e dados" },
  { id: "qualidade", label: "Qualidade & pós-venda", detail: "Reclamações e devoluções" },
  { id: "logistica", label: "Logística", detail: "Controles operacionais" },
  { id: "processos", label: "Transformação", detail: "O que destrava o meu trabalho" },
];

export const toolTypes = [
  { id: "rotina", label: "Ferramenta de rotina", short: "Rotina", text: "Usada no dia a dia para conferir, acompanhar e decidir." },
  { id: "relatorio", label: "Relatório interativo", short: "Relatório", text: "A planilha entra, a leitura pronta para apresentar sai." },
  { id: "plataforma", label: "Plataforma de dados", short: "Plataforma", text: "Várias equipes, um formato de dados, uma visão." },
  { id: "fluxo", label: "Fluxo de trabalho", short: "Fluxo", text: "Pedido, execução e aprovação no mesmo caminho." },
  { id: "dados", label: "Migração & qualidade", short: "Dados", text: "Dados que chegam ao destino com significado." },
  { id: "analise", label: "Análise de dados & IA", short: "Análise", text: "Cruzar bases e encontrar padrões e lacunas." },
  { id: "apoio", label: "Ferramental de apoio", short: "Apoio", text: "Peças que deixam o resto do trabalho mais seguro." },
];

export const inUseStatuses = ["Em uso"];

export const deliveries = [
  {
    id: "conferencia", area: "financas", type: "rotina", status: "Em uso", caseId: "cpag",
    name: "Central de conferência e aprovação de pagamentos",
    question: "Como achar o erro antes da remessa, e não depois?",
    built: "Validações em linguagem de negócio, resumo para aprovação montado a partir dos relatórios, ajustes registrados e pacote de envio em dois idiomas.",
    reuse: "Qualquer rotina que cruza relatórios do ERP antes de uma decisão.",
  },
  {
    id: "fechamento", area: "financas", type: "plataforma", status: "Em implantação", caseId: "fechamento",
    name: "Plataforma de fechamento para várias frentes",
    question: "Como cada equipe fecha o seu dia e a gestão enxerga tudo junto?",
    built: "Uma ferramenta por frente no navegador, um contrato de colunas único e uma pasta compartilhada que alimenta o painel de BI.",
    reuse: "Times que repetem o mesmo fechamento com regras um pouco diferentes.",
  },
  {
    id: "fornecedores", area: "financas", type: "relatorio", status: "Em uso", caseId: "relatorios",
    name: "Relatório de concentração de fornecedores",
    question: "Onde está concentrado o volume de pagamentos?",
    built: "Arquivo que abre no navegador, organiza a extração em treemap e exporta em PDF para a gestão.",
    reuse: "Qualquer leitura de concentração: clientes, produtos, centros de custo.",
  },
  {
    id: "adiantamentos", area: "financas", type: "relatorio", status: "Em desenvolvimento", caseId: "relatorios",
    name: "Relatório de adiantamentos em aberto",
    question: "Quais adiantamentos seguem pendentes, e com quem?",
    built: "Recebe a extração, separa os dados e gera a apresentação gráfica para a gestão, no padrão visual da plataforma de pagamentos.",
    reuse: "Acompanhamento de pendências que hoje vive em planilha.",
  },
  {
    id: "credito", area: "credito", type: "relatorio", status: "Concluído", caseId: "relatorios",
    name: "Recorte diário de pedidos travados em crédito",
    question: "Quanto do que está travado pesa no total, e há quanto tempo está parado?",
    built: "Treemaps por motivo de bloqueio, tempo parado como primeiro indicador, mergulho até o pedido e exportação em Excel e HTML interativo.",
    reuse: "Filas de exceção em qualquer etapa do pedido ao recebimento.",
  },
  {
    id: "entregas", area: "marketing", type: "relatorio", status: "Primeira versão entregue", caseId: "relatorios",
    name: "Relatório de entregas do time de design",
    question: "O que o time entregou, de que tipo, e com quanto retrabalho?",
    built: "A planilha de tarefas entra arrastando. Sai um relatório com filtro de datas livre, tipos de job, prazo e qualidade, insights e versão em inglês.",
    reuse: "Qualquer time criativo ou de serviço que hoje monta o report à mão.",
  },
  {
    id: "briefing", area: "marketing", type: "fluxo", status: "Em desenvolvimento", caseId: "briefing",
    name: "Portal de briefing e gestão de demandas",
    question: "Como receber pedidos completos e mostrar quando a fila já está cheia?",
    built: "Formulário, lista de gestão, quadro de tarefas, aprovação e painel conectados no Microsoft 365.",
    reuse: "Áreas que recebem pedidos por e-mail, chat e corredor ao mesmo tempo.",
  },
  {
    id: "panorama", area: "comunicacao", type: "rotina", status: "Em uso",
    name: "Painel de acompanhamento da comunicação interna",
    question: "Como o time acompanha o próprio trabalho num lugar só?",
    built: "Ferramenta no navegador conectada ao ambiente de arquivos da empresa, usada pelo time no dia a dia.",
    reuse: "Times pequenos que precisam de visibilidade sem um sistema novo.",
  },
  {
    id: "crm", area: "comercial", type: "dados", status: "Em andamento", caseId: "etl",
    name: "Migração de dados para um novo CRM",
    question: "Como levar dados de várias fontes para o CRM sem perder o significado?",
    built: "Data mapping, pipelines em Python com quarentena para linhas sujas e validação com o negócio em ambiente de teste.",
    reuse: "Qualquer troca de sistema em que o dado antigo precisa continuar fazendo sentido.",
  },
  {
    id: "territorios", area: "comercial", type: "analise", status: "Entregue", caseId: "etl",
    name: "Cruzamento de clientes e territórios",
    question: "Quais clientes e regiões estão sem um representante ativo?",
    built: "Uni duas bases de clientes, cruzei com a cobertura por localidade e apontei lacunas e possíveis responsáveis por território.",
    reuse: "Cobertura comercial, rotas, carteiras e atendimento regional.",
  },
  {
    id: "status", area: "comercial", type: "apoio", status: "Em uso", caseId: "etl",
    name: "Status report executivo em inglês",
    question: "Como manter um time internacional a par de um projeto com muitas frentes?",
    built: "One-page em inglês com donos, prazos e progresso medido pelo que foi testado, não só pelo que foi carregado.",
    reuse: "Projetos com muitos fornecedores e stakeholders em outros países.",
  },
  {
    id: "desafios", area: "comercial", type: "analise", status: "Entregue",
    name: "Consolidação de uma trilha de treinamento comercial",
    question: "Quem participou dos desafios, por regional?",
    built: "Scripts em Python que validam cada participante contra a lista oficial, classificam por unidade de negócio e consolidam todas as rodadas.",
    reuse: "Engajamento em treinamentos, campanhas e programas internos.",
  },
  {
    id: "devolucoes", area: "qualidade", type: "analise", status: "Em pesquisa", caseId: "polyblen",
    name: "Estudo de sinais de devolução",
    question: "O histórico ajuda a antecipar o volume de devoluções?",
    built: "Bases separadas e limpas, dicionário de produtos para o histórico não rachar quando um código muda e critérios de validação definidos com a área.",
    reuse: "Previsão de demanda, de reclamações ou de qualquer evento recorrente.",
  },
  {
    id: "logistica", area: "logistica", type: "dados", status: "Construído",
    name: "Controle logístico fora da planilha",
    question: "Como tirar um controle histórico de uma planilha frágil?",
    built: "Aplicação com banco de dados para onde migrei o histórico da planilha legada.",
    reuse: "Controles que cresceram demais para continuar no Excel.",
  },
  {
    id: "anonimizador", area: "processos", type: "apoio", status: "Em uso", caseId: "anon",
    name: "Anonimizador de extrações",
    question: "Como usar IA para acelerar sem expor dados da empresa?",
    built: "Ferramenta local no navegador: apelidos consistentes, números mascarados, valores em escala e o de-para guardado só comigo.",
    reuse: "Qualquer time que queira usar IA com dados sensíveis por perto.",
  },
  {
    id: "abertura", area: "processos", type: "fluxo", status: "Em uso",
    name: "Abertura de demanda",
    question: "Como entender o pedido, as exceções e o ponto final antes de começar?",
    built: "Formulário que as áreas preenchem: o que precisa, casos reais, o que fica fora, definição de pronto, prazo e pessoas envolvidas.",
    reuse: "Qualquer time interno que recebe pedidos de muitas áreas.",
  },
];

// Pieces that travel from one tool to the next. Approximate order of creation.
export const reuseLines = [
  { id: "visual", label: "Identidade e cabeçalho", color: "#d2e99b" },
  { id: "drop", label: "Arrastar a planilha", color: "#8fe0c0" },
  { id: "treemap", label: "Treemap com mergulho", color: "#eebda9" },
  { id: "export", label: "Exportação pronta para enviar", color: "#f3d77a" },
  { id: "lang", label: "Português e inglês", color: "#a9cdee" },
];

export const reuseStations = [
  { id: "fornecedores", lines: ["visual", "treemap", "export"], note: "O cabeçalho que outras ferramentas passaram a repetir." },
  { id: "conferencia", lines: ["visual", "drop", "treemap", "export", "lang"], note: "Regras de negócio, trilha de auditoria e pacote em dois idiomas." },
  { id: "credito", lines: ["visual", "drop", "treemap", "export", "lang"], note: "O treemap ganha mergulho e tamanho mínimo para blocos pequenos." },
  { id: "entregas", lines: ["visual", "drop", "treemap", "export", "lang"], note: "O esqueleto do financeiro vira relatório de outra área." },
  { id: "fechamento", lines: ["visual", "drop", "export"], note: "O jeito de trabalhar da central chega a outras frentes." },
  { id: "adiantamentos", lines: ["visual", "drop", "treemap"], note: "Já nasce com o tema e a usabilidade da plataforma." },
];

export const impactNumbers = () => ({
  deliveries: deliveries.length,
  areas: new Set(deliveries.map(item => item.area)).size,
  types: new Set(deliveries.map(item => item.type)).size,
  inUse: deliveries.filter(item => inUseStatuses.includes(item.status)).length,
});
