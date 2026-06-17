# ultimateENEM Atualidades API

Endpoint diário para alimentar a aba **Atualidades ENEM** do app.

```txt
GET /api/noticias/diarias
```

## O que entrega

O retorno já vem no formato que o app espera:

- repertório para Redação ENEM;
- temas possíveis;
- proposta de intervenção C5;
- usos em Linguagens, Matemática, Humanas e Natureza;
- notícias organizadas por seção;
- fontes originais para checagem.

## Teste local sem instalar nada

Na pasta do projeto:

```bash
cd "/Users/CAV/Documents/Codex/2026-06-12/quero-escrever-um-app-de-produtividade/daily-news-enem-api"
node scripts/local-server.mjs
```

Depois abra:

```txt
http://localhost:3000/api/noticias/diarias
```

O app local já usa esse endereço por padrão.

## Usar com IA

Crie um arquivo `.env.local` nesta pasta:

```txt
OPENAI_API_KEY=sua_chave
OPENAI_MODEL=modelo_liberado_no_seu_projeto
CRON_SECRET=uma_senha_forte
```

Sem `OPENAI_API_KEY` e `OPENAI_MODEL`, o endpoint funciona em modo básico: ele organiza as manchetes e mantém o app de pé, mas sem a análise autoral completa.

## Publicar na Vercel

Esta pasta é um projeto separado. Publique a pasta:

```txt
daily-news-enem-api
```

No painel da Vercel, configure as variáveis:

```txt
OPENAI_API_KEY
OPENAI_MODEL
CRON_SECRET
```

Depois o endpoint ficará assim:

```txt
https://SEU-PROJETO.vercel.app/api/noticias/diarias
```

Cole esse link na aba **Atualidades ENEM** do app.

## Atualização diária

O `vercel.json` agenda uma chamada diária:

```txt
0 9 * * *
```

Esse horário é 09:00 UTC, aproximadamente 06:00 em Brasília/São Paulo.

## Forçar atualização manual

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  "https://SEU-PROJETO.vercel.app/api/noticias/diarias?force=1"
```
