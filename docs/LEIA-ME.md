# LEOMADE | Pacote de continuidade

Este pacote reúne o código do site e um prompt para acrescentar projetos documentados em outro chat de IA.

1. Extraia o ZIP.
2. Envie o ZIP à outra IA e peça que siga `PROMPT-PARA-OUTRA-IA.txt`.
3. Receba o novo ZIP e a lista dos cases adicionados.
4. Traga o pacote atualizado ao chat original para revisar e atualizar a hospedagem existente.

## Rodar localmente

O código fica em `site/`. Com Node.js compatível com as dependências do projeto instalado:

```bash
cd site
npm ci
npm run dev
```

Para gerar a versão de produção: `npm run build`. Este projeto usa React e Vinext/Vite com estrutura de rotas app. Preserve package.json, package-lock.json, vite.config.ts e wrangler.jsonc; não migre de stack sem necessidade.

URL existente: https://leonardo-processos-dados.lillemo.chatgpt.site/
Portfólio: https://leonardo-processos-dados.lillemo.chatgpt.site/leo

O pacote contém código-fonte e recursos públicos, sem dependências instaladas, histórico Git, uploads de conversa ou credenciais. O manifesto de hospedagem preserva a identidade do site existente; não é uma credencial.
