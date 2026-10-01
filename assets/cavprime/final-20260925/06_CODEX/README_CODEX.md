# CAVPRIME — FINAL 25 DE SETEMBRO

Pacote de handoff para implementação no Codex.

## FONTE DE VERDADE
A capa aprovada está em `01_CAPA_FINAL/cavprime_capa_final_desktop.png`.
Ela é a referência visual principal. Não redesenhar as marcas a partir dela.

Os cinco lockups oficiais usados na capa foram extraídos da própria versão aprovada e estão em:
- `02_LOGOS_LOCKUPS_PNG/` — máxima fidelidade;
- `03_LOGOS_LOCKUPS_WEBP/` — versão leve para web/app;
- `04_CARDS_UI/` — card completo com CTA visual.

## ORDEM OBRIGATÓRIA DOS PRODUTOS
1. ULTIMATE ENEM
2. DIA DE A
3. discMED
4. MedPISM
5. VaiBem

## REGRA ABSOLUTA DAS MARCAS
As imagens dos lockups são **imutáveis**. O código pode apenas:
- redimensionar proporcionalmente;
- posicionar;
- aplicar `object-fit: contain`;
- trocar PNG por WEBP equivalente.

O código NÃO pode:
- reescrever nomes ou slogans;
- trocar fontes;
- remover círculos, arcos, livros, símbolos ou assinaturas;
- acrescentar estrela, brilho, moldura ou ícone;
- reconstruir a marca com HTML/CSS;
- cortar internamente a arte.

## VAIBEM — REGRA ESPECÍFICA
A versão final aprovada contém:
- mentor + aluno sobre livro;
- arcos superiores;
- **sem estrela**;
- `VAI BEM`;
- `AULA PARTICULAR`;
- linha dourada tênue com `by CAVPRIME` no centro;
- `BRIGHT MINDS. BRIGHTER FUTURES.` abaixo.

Não usar versões anteriores do VaiBem.

## MEDPISM — REGRA ESPECÍFICA
Usar a versão com:
- círculo;
- `UFJF` dentro do círculo;
- símbolo da Medicina;
- `MedPISM`;
- `by CAVPRIME`;
- `DISCIPLINE TODAY. EXCELLENT DOCTORS TOMORROW.`

## CAPA / LOGIN
A capa PNG é referência visual. Para uma tela funcional:
- construir o formulário de login em HTML/React;
- usar inputs reais para e-mail e senha;
- usar botões reais para Entrar, Criar conta e Esqueci minha senha;
- não deixar os campos funcionais “impressos” apenas na imagem;
- preservar a divisão vertical dourada e a atmosfera azul-cirúrgica premium.

## CARDS CLICÁVEIS
O texto visual `ACESSAR AGORA` está dentro do card de referência, mas no app o card deve ser clicável de verdade.
Recomendação: usar a imagem do card como conteúdo visual e envolver em `<button>`/`<a>` com `aria-label` apropriado.

Exemplo:
```tsx
const products = [
  { id: 'ultimate-enem', label: 'Acessar Ultimate ENEM', asset: '/assets/cavprime/03_LOGOS_LOCKUPS_WEBP/ultimate_enem.webp' },
  { id: 'dia-de-a', label: 'Acessar DIA DE A', asset: '/assets/cavprime/03_LOGOS_LOCKUPS_WEBP/dia_de_a.webp' },
  { id: 'discmed', label: 'Acessar discMED', asset: '/assets/cavprime/03_LOGOS_LOCKUPS_WEBP/discmed.webp' },
  { id: 'medpism', label: 'Acessar MedPISM', asset: '/assets/cavprime/03_LOGOS_LOCKUPS_WEBP/medpism.webp' },
  { id: 'vaibem', label: 'Acessar VaiBem', asset: '/assets/cavprime/03_LOGOS_LOCKUPS_WEBP/vaibem.webp' },
]
```

## CSS MÍNIMO PARA NÃO DEFORMAR AS LOGOS
```css
.cavprime-logo-lockup {
  width: 100%;
  height: auto;
  object-fit: contain;
  display: block;
}
```

## PERFORMANCE
- Preferir WEBP no app/site.
- Manter PNG para fallback, QA e impressão.
- Lazy-load dos cards abaixo da dobra.
- Cache longo para assets versionados.
- Não converter as logos em base64 dentro do bundle.

## RESPONSIVIDADE
Desktop: preservar a composição hero + login.
Tablet/mobile: empilhar as áreas e manter as logos sem distorção. Os cinco produtos podem usar rolagem horizontal ou grade responsiva.
Não reduzir a marca a ponto de tornar slogans ilegíveis; em telas muito pequenas, usar o card em largura maior com scroll horizontal.

## QA ANTES DO DEPLOY
- [ ] CAVPRIME correto no topo.
- [ ] Cinco produtos na ordem aprovada.
- [ ] ULTIMATE ENEM alinhado.
- [ ] discMED com UERJ.
- [ ] MedPISM com UFJF + símbolo médico + slogan em inglês.
- [ ] VaiBem com arcos e **sem estrela**.
- [ ] VaiBem com `AULA PARTICULAR`.
- [ ] VaiBem com linha + `by CAVPRIME`.
- [ ] VaiBem com `BRIGHT MINDS. BRIGHTER FUTURES.` no mesmo padrão visual dos demais slogans.
- [ ] Todos os CTAs dizem `ACESSAR AGORA`.
- [ ] Nenhuma logo foi reconstruída com texto/CSS.
- [ ] Nenhum asset usa `object-fit: cover`.

## ARQUIVOS DE CONTROLE
- `06_CODEX/asset_manifest.json`
- `06_CODEX/design_tokens.json`

Esses arquivos devem ser lidos antes da implementação.

## REGRA FINAL — CONTORNOS DOS PRODUTOS
- A capa oficial é `01_CAPA_FINAL/cavprime_capa_final_desktop.*`.
- Os cinco produtos aparecem SEM moldura/contorno amarelo externo ao redor do bloco da marca.
- Em especial, DIA DE A (02), discMED (03) e MedPISM (04) NÃO podem receber retângulo, borda, stroke, outline, box-shadow amarelo ou container dourado.
- O dourado interno das próprias marcas e o contorno do botão `ACESSAR AGORA` permanecem.
- Não redesenhar, reescrever ou reconstruir logos via CSS, SVG ou IA. Use os assets fornecidos.
- VaiBem: manter arcos, sem estrela, `AULA PARTICULAR`, linha tênue com `by CAVPRIME` e `BRIGHT MINDS. BRIGHTER FUTURES.`
- MedPISM: manter `UFJF`, símbolo médico, `by CAVPRIME` e `DISCIPLINE TODAY. EXCELLENT DOCTORS TOMORROW.`


## AJUSTE FINAL — PACOTE 3
- Usar `01_CAPA_FINAL/cavprime_capa_final_desktop.webp` como asset principal no app; PNG é o fallback de alta fidelidade.
- As cinco marcas na fileira devem ficar **centralizadas individualmente** em áreas de largura equivalente.
- Nunca deslocar a arte interna para compensar diferenças visuais; usar `object-fit: contain` e `object-position: center`.
- Os cinco botões `ACESSAR AGORA` devem ficar completamente visíveis, com mesma largura/altura e margem de segurança inferior.
- Não aplicar `overflow: hidden` em contêiner que possa cortar os botões.
- Em CSS, reservar `padding-inline: 8px` e `padding-bottom: 8px` no card e evitar altura fixa menor que o conteúdo.
- Em telas estreitas, permitir quebra da grade/rolagem horizontal em vez de comprimir ou cortar logos e botões.
- NÃO redesenhar nenhuma logo.


## CORREÇÃO FINAL — CARDS E CTAs
- Os arquivos em `04_CARDS_UI` já incluem margem de segurança abaixo do botão `ACESSAR AGORA`.
- Não recortar a imagem no limite inferior do botão.
- Ao usar os cards como imagens, aplicar `object-fit: contain`, nunca `cover`.
- Se o botão for recriado como componente HTML/CSS, manter pelo menos 16 px de área livre abaixo do contorno do botão e centralização horizontal.
- Não usar `overflow: hidden` no contêiner que possa cortar o contorno inferior ou o texto do CTA.
