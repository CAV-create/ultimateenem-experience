# ULTIMATE E PISM CORRIGIDA — HANDOFF PARA CODEX

## Fonte oficial deste pacote
Os dois lockups deste pacote foram recortados diretamente da prancha final aprovada pelo usuário. Não redesenhar, não reconstruir tipografia e não substituir símbolos.

## ULTIMATE ENEM — regras
- Preservar o grande `U` dourado.
- Preservar o livro aberto e a serpente/bastão central bem visíveis.
- Preservar `ULTIMATE ENEM`.
- Preservar `by CAVPRIME`.
- Preservar o slogan: `KNOWLEDGE TRANSFORMS. GREATER FUTURES.`

## MedPISM — regras
- Preservar o círculo duplo dourado.
- Preservar a serpente/bastão central.
- `UF` deve permanecer deslocado para a esquerda do bastão.
- `JF` deve permanecer deslocado para a direita do bastão.
- A serpente não pode cobrir o `F` de `UF` nem o `J`/`F` da direita.
- Preservar `MedPISM`.
- Preservar `by CAVPRIME`.
- Preservar o slogan: `DISCIPLINE TODAY. EXCELLENT DOCTORS TOMORROW.`

## Qual arquivo usar
### Desktop
Preferir:
- `*_desktop.webp` para web/app.
- `*_master.png` quando a máxima fidelidade for necessária.

### Mobile
Preferir:
- `*_mobile.webp`.

### Cards
Preferir:
- `*_card_4x5.webp` para cards de cursos.
- A arte já está centralizada em canvas 4:5 e possui margem de segurança.

## CSS obrigatório
```css
.course-logo {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
}

.course-logo-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
  padding: 8%;
}
```

## Regras proibidas
- NÃO usar `object-fit: cover`.
- NÃO usar `overflow: hidden` no contêiner da marca.
- NÃO recortar automaticamente o rodapé/slogan.
- NÃO gerar novamente as logos por IA.
- NÃO mover letras ou símbolos internamente.
- NÃO acrescentar estrela, moldura ou glow.
- NÃO alterar o texto dos slogans.

## Responsividade sugerida
```css
.logo-card { width: clamp(150px, 18vw, 260px); }
@media (max-width: 768px) {
  .logo-card { width: min(72vw, 360px); }
}
```

## Auditoria antes do deploy
1. Conferir ULTIMATE: serpente e livro legíveis.
2. Conferir MedPISM: `UF` à esquerda e `JF` à direita; nenhuma letra coberta.
3. Conferir `by CAVPRIME` em ambas.
4. Conferir slogan integral.
5. Conferir ausência de corte em mobile e desktop.
6. Comparar visualmente com `00_REFERENCIA/prancha_aprovada_ultimate_medpism.png`.