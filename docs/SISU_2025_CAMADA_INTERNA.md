# Camada Interna SISU 2025

## Objetivo

Esta camada traz para o Ultimate ENEM CAV o simulador de competitividade originalmente consolidado no projeto SouFederal 2027.

Ela permite comparar notas do aluno com pesos, notas mínimas, vagas, inscrições e notas de corte da chamada regular do SiSU 2025.

## Arquivos Integrados

- `sisu-2025-intelligence-data.js`: metadados da base, origem e esquema dos campos.
- `sisu-simulator-core.js`: motor de cálculo de nota ponderada, nota mínima, diferença para o corte e faixa de competitividade.
- `data/sisu_2025_courses_compact.json`: base compacta de ofertas do SiSU 2025.
- `data/sisu_2025_summary.json`: resumo estatístico da base.

## Uso no App

O painel aparece na aba `Desempenho`, depois que o aluno conclui o plantão obrigatório do dia.

O aluno pode informar ou ajustar:

- nota estimada em Linguagens;
- nota estimada em Humanas;
- nota estimada em Natureza;
- nota estimada em Matemática;
- nota de Redação;
- curso;
- UF;
- modalidade.

Quando possível, o app pré-preenche notas por área usando a régua TRI por acertos já existente no Ultimate.

## Regras de Prudência

- A simulação é pedagógica, não resultado oficial.
- A base usada é a chamada regular 2025.
- Bônus percentual não é aplicado automaticamente; ele depende de elegibilidade declarada pelo candidato.
- Cursos sem nota de corte competitiva preservada na base não devem ser tratados como promessa de aprovação.
- O painel deve orientar estudo, não substituir consulta ao edital nem inscrição oficial.

## Integração com o Motor de Inteligência

A camada fortalece respostas futuras do app para perguntas como:

- "Com minha nota eu teria chance em Medicina?"
- "Qual área pesa mais para o curso que eu quero?"
- "Quanto preciso ganhar para entrar na zona competitiva?"
- "Minha Redação compensa baixa em Natureza?"

O cálculo respeita:

- pesos por área;
- notas mínimas por área;
- nota de corte por modalidade;
- vagas e inscrições;
- diferença entre nota calculada e corte.
