# CAVPRIME — PACOTE DE LOGOS + PDFs + INSTRUÇÕES DE IMPLANTAÇÃO

Este pacote reúne:
1. logos oficiais do ecossistema CAVPRIME em PNG original e WEBP otimizado para mobile;
2. capas aprovadas de desktop e mobile;
3. PDFs de timbrados, relatórios diagnósticos e folhas especiais;
4. instruções objetivas para o time de código implantar sem alterar a identidade.

## 1) Estrutura do pacote
- `logos/original_png/` → arquivos com máxima fidelidade.
- `logos/mobile_webp/` → versões leves para app/site mobile.
- `logos/preview_jpg/` → prévias rápidas para conferência.
- `pdfs/timbrados/` → papéis timbrados dos cursos.
- `pdfs/relatorios/` → relatórios diagnósticos.
- `pdfs/folhas_especiais/` → folha VaiBem 3º ao 7º ano e PDF de conferência mobile.
- `capas/desktop/` → tela de abertura desktop aprovada.
- `capas/mobile/` → tela de abertura mobile aprovada.
- `docs/manifest.json` → mapa técnico dos arquivos.

## 2) Regras obrigatórias de uso das logos
1. **Não redesenhar** nenhuma marca.
2. **Não remover** círculos, estrelas, assinaturas, slogans, `by CAVPRIME` ou qualquer elemento aprovado.
3. **Não trocar tipografia**.
4. **Não aplicar** bordas arredondadas, boxes amarelos, glow extra, contornos ou molduras sobre as logos.
5. Manter **proporção original**; se redimensionar, usar escala proporcional.
6. Preferir fundo escuro/preto para preservar a leitura visual aprovada.
7. No cabeçalho dos papéis: **CAVPRIME à esquerda + logo do produto à direita**.
8. No rodapé dos papéis: **linha tênue + frase em inglês + assinatura `by CAVPRIME`**.

## 3) Regras de performance
### Web / Mobile
- usar primeiro o arquivo em `logos/mobile_webp/`;
- usar `loading="lazy"` onde a logo não for crítica acima da dobra;
- servir com cache longo (`Cache-Control: public, max-age=31536000, immutable`) se o nome do arquivo estiver versionado;
- não embutir PDFs na tela inicial; abrir sob demanda.

### Recomendação de implementação
- logos no topo e cards: `object-fit: contain`.
- nunca usar `object-fit: cover` nas logos.
- reservar área de respiro interna mínima equivalente a 8% da menor dimensão do componente.

## 4) Exemplo HTML
```html
<picture>
  <source srcset="/assets/cavprime/logos/mobile_webp/ultimate_enem.webp" type="image/webp">
  <img
    src="/assets/cavprime/logos/original_png/ultimate_enem.png"
    alt="Logo Ultimate ENEM by CAVPRIME"
    width="714"
    height="904"
    style="display:block;max-width:100%;height:auto;object-fit:contain"
  >
</picture>
```

## 5) Exemplo React / Next.js
```jsx
import Image from 'next/image'

export function LogoUltimate() {
  return (
    <Image
      src="/assets/cavprime/logos/mobile_webp/ultimate_enem.webp"
      alt="Ultimate ENEM by CAVPRIME"
      width={714}
      height={904}
      style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
      priority={false}
    />
  )
}
```

## 6) Implementação dos PDFs
### Quando exibir
- área do aluno;
- área do professor;
- secretaria / coordenação;
- downloads de simulados, relatórios e folhas de atividade.

### Como servir
- preferir botão de download e botão de visualização;
- em mobile, abrir em nova aba ou viewer nativo;
- não converter o PDF para imagem em produção, exceto prévia.

### Exemplo de link de download
```html
<a href="/assets/cavprime/pdfs/relatorios/02_ULTIMATE_ENEM_Diagnostico.pdf" download>
  Baixar relatório Ultimate ENEM
</a>
```

## 7) Convenção sugerida de pastas no projeto
```text
/public/assets/cavprime/
  logos/
    original_png/
    mobile_webp/
    preview_jpg/
  pdfs/
    timbrados/
    relatorios/
    folhas_especiais/
  capas/
    desktop/
    mobile/
```

## 8) Checklist final para o dev
- [ ] conferiu se cada logo usada é a oficial correta?
- [ ] não adicionou moldura, glow ou box amarelo?
- [ ] usou WEBP no mobile e PNG como fallback?
- [ ] manteve fundo escuro onde necessário?
- [ ] PDFs estão com rotas acessíveis e nomes amigáveis?
- [ ] capa desktop foi mantida sem alterações?
- [ ] capa mobile usada é a versão revisada aprovada?
- [ ] logo do VaiBem usada é a oficial com `AULA PARTICULAR` e `BRIGHT MINDS. BRIGHTER FUTURES.`?

## 9) Observações de implantação
- Se o time precisar de retina/2x, usar o PNG original.
- Se houver CDN, ativar compressão Brotli/Gzip para PDFs.
- Para apps híbridos, armazenar logos leves localmente e baixar PDFs sob demanda.
- Para preview de PDF, gerar thumbnail separada; não rasterizar o PDF inteiro no carregamento inicial.