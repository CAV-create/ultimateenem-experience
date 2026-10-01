# CAVPRIME — LOGOS PARA CAPA DO APP — HANDOFF CODEX

## Fonte oficial
Os ativos deste pacote foram derivados exclusivamente da última prancha de cinco logos aprovada na conversa. O Codex deve **usar os arquivos**, não tentar reproduzir as marcas com HTML, CSS, SVG, fontes ou geração de imagem.

## Estrutura
- `00_REFERENCIA_OFICIAL/`: prancha aprovada, para auditoria visual.
- `01_LOGOS_MASTER_PNG/`: masters 2x em PNG. Use quando a prioridade for máxima fidelidade.
- `02_DESKTOP_WEBP/`: versões leves para desktop/web.
- `03_MOBILE_WEBP/`: versões leves para mobile.
- `04_CARDS_4x5/`: cards 4:5 sem borda externa amarela, em PNG e WebP.
- `05_IMPLEMENTACAO_CODEX/`: manifest, CSS, exemplo React e checksums.

## Regras inegociáveis
1. Não redesenhar, reescrever, recortar internamente ou reconstruir nenhuma logo.
2. `object-fit: contain`; nunca `cover`.
3. `overflow: visible` no wrapper da marca; não cortar slogans ou `by CAVPRIME`.
4. Não adicionar caixa/borda amarela em torno das logos. O dourado interno das marcas deve permanecer.
5. Manter a proporção original e centralizar horizontal e verticalmente.
6. Desktop: preferir `02_DESKTOP_WEBP`; mobile: `03_MOBILE_WEBP`; PNG master é fallback de alta fidelidade.
7. Não comprimir novamente o PNG master. WebP já está otimizado.
8. Se o app usar CDN, versionar o nome do arquivo ou invalidar cache ao substituir ativos.

## Identidade aprovada
- ULTIMATE ENEM: `ENEM` branco e em negrito; `by CAVPRIME`; `KNOWLEDGE TRANSFORMS. GREATER FUTURES.`
- DIA DE A: `by CAVPRIME`; `DISCIPLINE TODAY. GREAT ACHIEVEMENTS TOMORROW.`
- discMED: círculo UERJ; `by CAVPRIME`; `PRECISION TODAY. EXCELLENT RESULTS TOMORROW.`
- MedPISM: `Med` branco/negrito e `PISM` dourado; UF à esquerda, JF à direita, serpente central sem cobrir letras; `by CAVPRIME`; `DISCIPLINE TODAY. EXCELLENT DOCTORS TOMORROW.`
- VAI BEM: professor dourado/amarelo e aluno branco; arcos preservados; sem estrela; `AULA PARTICULAR`; `by CAVPRIME`; `BRIGHT MINDS. BRIGHTER FUTURES.`

## CSS recomendado
```css
.cavprime-logo-slot {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
  min-width: 0;
}
.cavprime-logo-slot img {
  display: block;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  object-position: center;
}
@media (max-width: 768px) {
  .cavprime-logo-slot { padding: 8px; }
}
```

## React / Next.js
```jsx
import Image from 'next/image';

const logos = {
  ultimate: '/assets/cavprime/logos/ultimate_enem_desktop.webp',
  diaDeA: '/assets/cavprime/logos/dia_de_a_desktop.webp',
  discmed: '/assets/cavprime/logos/discmed_desktop.webp',
  medpism: '/assets/cavprime/logos/medpism_desktop.webp',
  vaibem: '/assets/cavprime/logos/vaibem_desktop.webp',
};

export function BrandLogo({ src, alt }) {
  return (
    <div className="cavprime-logo-slot">
      <Image src={src} alt={alt} width={900} height={900} style={{objectFit:'contain'}} />
    </div>
  );
}
```

## Troca responsiva opcional
Use `<picture>` quando quiser carregar o ativo menor no celular:
```html
<picture>
  <source media="(max-width: 768px)" srcset="/assets/cavprime/logos/vaibem_mobile.webp">
  <img src="/assets/cavprime/logos/vaibem_desktop.webp" alt="VaiBem — Aula Particular" loading="lazy">
</picture>
```

## Checklist antes do deploy
- [ ] As cinco marcas estão centralizadas?
- [ ] Nenhuma frase, arco, círculo ou assinatura foi cortada?
- [ ] Não existe borda amarela externa indevida?
- [ ] ENEM está branco/negrito?
- [ ] Med está branco/negrito?
- [ ] UF e JF estão legíveis e separados da serpente?
- [ ] Professor do VaiBem está dourado e aluno branco?
- [ ] VaiBem está sem estrela e com os arcos?
- [ ] O mobile usa WEBP menor e `contain`?
- [ ] Cache/CDN foi invalidado após a substituição?
