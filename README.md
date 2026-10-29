# LEOMADE

Site do meu estúdio independente e portfólio pessoal.

- `/` Estúdio LEOMADE: produtos próprios, laboratório e um resumo do trabalho aplicado.
- `/leo` Portfólio: trajetória, mapa de impacto (white label) e cases em detalhe.

## Rodar localmente

```bash
npm ci
npm run build:next   # build usado na Vercel
npx next start       # ou: npm run dev
```

## Publicação

Hospedado na Vercel. O `vercel.json` define o build (`npm run build:next`).
Cada push na `main` publica uma nova versão.

O histórico do projeto está em `docs/ESTADO-DO-PROJETO.md`.
