# LEOMADE

Site do meu estúdio independente, em uma página só.

- `/` LEOMADE: abertura, cases interativos, trilha de reaproveitamento, currículo de projetos, trajetória, método e contato. Tema claro e escuro pelo interruptor.
- `/leo` não existe mais como página; links antigos são redirecionados para `/`.

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
