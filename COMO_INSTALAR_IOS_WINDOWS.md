# ultimateENEM experience - iOS e Windows

O app foi preparado como PWA. Isso significa que ele pode abrir no navegador e também ser instalado como aplicativo quando estiver em HTTPS ou em um servidor local confiável.

## Teste local no computador

Na pasta `outputs`, rode um servidor local.

No macOS:

```bash
python3 -m http.server 8000
```

No Windows:

```powershell
py -m http.server 8000
```

Depois abra:

```text
http://localhost:8000
```

## Windows

1. Abra o link no Microsoft Edge ou Google Chrome.
2. Clique no ícone de instalação do navegador.
3. Instale como app.
4. O app ficará disponível no menu Iniciar.

## iPhone ou iPad

1. Publique a pasta `outputs` em um endereço HTTPS.
2. Abra o endereço no Safari.
3. Toque em Compartilhar.
4. Escolha Adicionar à Tela de Início.

## Observação importante

Abrir por `file://` funciona para testar a interface no computador, mas iOS e Windows não ativam instalação/offline completa nesse modo. Para isso, use HTTPS ou `localhost`.
