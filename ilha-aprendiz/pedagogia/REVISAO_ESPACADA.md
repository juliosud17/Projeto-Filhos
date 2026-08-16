# Revisão Espaçada

*Status: 🟢 implementado em 2026-08-16 (`js/revisao-espacada.js`). Este documento descreve o desenho e o porquê de cada escolha — para o histórico da decisão em si (incluindo o que foi cogitado e descartado), ver `docs/DECISOES.md`.*

## O problema que isto resolve

Documentado em `docs/BRIEFING.md` e `docs/ROADMAP.md`: até esta entrega, depois que uma atividade chegava ao nível 5 e passava no Desafio Final, ela nunca mais voltava. Nada trazia "Monte a Sílaba" de volta em setembro pra reforçar — coerente com o princípio "domínio e retenção são métricas diferentes" (`CLAUDE.md`), mas o app só media a primeira.

## Como funciona

1. **Entrada no ciclo:** na primeira vez que uma atividade atinge nível 5 com 80%+ de domínio (dentro de `endSession()`), ela entra automaticamente no ciclo de revisão (`registerActivityMastered`). Rejogar o nível 5 depois disso, por diversão, não reseta o relógio.
2. **Intervalos crescentes:** cada atividade tem um "estágio" (0 a 4) e uma data da última revisão. O intervalo até a próxima revisão cresce por estágio: **2, 5, 10, 21, 45 dias** — depois disso, fica fixo em 45 dias pra sempre (o objetivo é retenção contínua, não "graduar" do ciclo e nunca mais revisar).
3. **"🔁 Revisão de Hoje":** aparece como card em destaque na tela de Ano Letivo do Benjamin, só quando existe pelo menos 1 atividade vencida. Ao abrir, junta 2 rodadas de cada atividade vencida numa sessão só (embaralhadas), reaproveitando o mesmo loop de jogo de sempre — cada rodada é renderizada exatamente como na prática normal daquela atividade.
4. **Pontuação separada:** igual ao Desafio Final, a sessão de revisão pontua numa trilha própria (`state.revisaoResults`), nunca em `mastery`. Isso evita que uma sessão de revisão (propositalmente mais espaçada no tempo, sem repetição de aquecimento) distorça a métrica de domínio da prática normal.
5. **Avança ou repete, nunca recua:** se o desempenho na sessão bate 60%+ (por atividade), o estágio avança (intervalo maior da próxima vez). Se não bate, o estágio **não avança** — mas também nunca recua. Aplicação direta do princípio "nunca penalizar erro retirando recompensa": o pior cenário é a próxima revisão vir um pouco mais cedo, nunca perder o progresso já conquistado.

## Decisões de escopo (e o porquê)

- **Sessão dedicada, não misturada com a prática normal.** Cogitei duas formas (documentado como aberto no stub original): misturar rodadas de revisão dentro de uma sessão de prática comum, ou um bloco dedicado. Escolhi bloco dedicado porque a arquitetura atual já é "sessão de uma atividade por vez" (`state.subgames`/`state.roundPlan`) — um bloco dedicado multi-atividade reaproveita 100% dessa infraestrutura sem precisar alterar o significado de uma sessão normal. Custo: exige a criança abrir a Revisão de propósito, não é passivo.
- **Intervalo fixo por estágio, não gatilho por sinal de esquecimento.** Um gatilho adaptativo (ex.: acionar revisão antes se o domínio de uma habilidade relacionada cair) exigiria dado de uso real pra calibrar sem chutar — não existia ainda quando isso foi implementado. Fica registrado como possível refinamento futuro, não descartado de vez.
- **Threshold de aprovação por atividade (60%), não geral.** Espelha o critério por atividade do Desafio Final (`PROVA_PASS_PER_ACTIVITY`), por consistência — evita ter dois números "que parecem o mesmo tipo de coisa" mas são diferentes sem motivo.
- **2 rodadas por atividade vencida na sessão.** Suficiente pra registrar um sinal de desempenho sem virar uma sessão longa — revisão é pra ser rápida e não competir em esforço com o módulo do dia.
- **Só a trilha do Benjamin.** Os jogos do Joaquim não têm nível (`activityLevel` não rastreia nenhum deles), então nunca atingem "nível 5 dominado" — o ciclo de revisão não se aplica a eles por construção, não por exclusão deliberada extra.

## Testado

`testes/qa_test_revisao_espacada.js` (38 checagens): registro de entrada no ciclo (idempotente), cálculo de vencimento por estágio, montagem da sessão (roundPlan, contagem de rodadas), pontuação isolada de `mastery`, avanço de estágio condicionado ao desempenho (e não-recuo quando fraco), navegação de volta pra Ano Letivo, aparição condicional do card, integração real via `endSession()`, limpeza pelos resets do admin, e persistência completa (round-trip + defesas contra dado malformado). Suíte inteira (31 arquivos) revalidada — mesmo resultado da baseline (única falha é a já conhecida em `qa_test_regression.js`).
