# ultimateENEM experience

Versao estatica provisoria do app para publicacao no GitHub Pages ou na Vercel.

## Como publicar na Vercel

1. Crie um repositorio no GitHub, por exemplo `ultimateenem-experience`.
2. Envie todo o conteudo desta pasta para a raiz do repositorio.
3. Na Vercel, clique em `Add New` > `Project`.
4. Escolha o repositorio `ultimateenem-experience`.
5. Em `Framework Preset`, selecione `Other`.
6. Deixe `Build Command` vazio.
7. Deixe `Output Directory` vazio ou como `.`.
8. Clique em `Deploy`.

O endereco ficara parecido com:

```txt
https://ultimateenem-experience.vercel.app
```

## Como publicar pelo GitHub web

1. Crie um repositorio no GitHub, por exemplo `ultimateenem-experience`.
2. Envie todo o conteudo desta pasta para a raiz do repositorio.
3. No GitHub, abra `Settings` > `Pages`.
4. Em `Build and deployment`, selecione:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
5. Salve e aguarde o GitHub gerar o link.

O endereco ficara parecido com:

```txt
https://SEU-USUARIO.github.io/ultimateenem-experience/
```

## Observacao sobre Atualidades ENEM

Esta publicacao e estatica. A aba `Atualidades` aceita um endpoint externo, mas o GitHub Pages nao executa servidor.

Para noticias automaticas, publique o endpoint em Vercel/Next ou outro servidor e cole a URL publica no campo da aba `Atualidades`.

## Arquivos principais

- `index.html`: entrada do app.
- `app.js`: logica do aplicativo.
- `enem-data.js`: banco de questoes.
- `assets/`: imagens, icones e recortes das questoes.
- `service-worker.js`: cache local do app.
