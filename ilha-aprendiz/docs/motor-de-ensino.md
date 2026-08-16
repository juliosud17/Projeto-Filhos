# Motor de Ensino — protótipo (Módulo M6 · Compor e Decompor Números)

*Implementado em `ilha_aprendiz.html`, agosto de 2026. Primeira peça concreta da mudança de filosofia discutida: o app avaliava bem, mas ensinava pouco — uma atividade como "Compor e Decompor Números" pressupunha que um adulto já tivesse explicado dezena/unidade antes de a criança abrir a tela.*

## O que foi construído

Uma nova tela, **Aula da Ilha** (`screen-lesson`), que aparece **automaticamente na primeira vez** que a criança entra numa atividade que tem aula — hoje só `monte_o_numero` e `dezena_e_unidade` (Módulo M6 de Matemática), como prova de conceito. Nas próximas vezes, ou em qualquer atividade sem aula ainda, o app continua indo direto pra prática, exatamente como antes.

Cada aula segue o fluxo discutido — **Aprender → Ver exemplo → Fazer comigo → Agora é você**:

1. **📖 Aprender** — explicação curta e visual (blocos de dezena/unidade reaproveitando `mm3Visual`, o mesmo apoio visual já usado no M2/M3), com narração automática.
2. **👀 Ver exemplo** — o app "resolve" uma equação parecida, explicando o raciocínio.
3. **🤝 Fazer comigo** — a criança responde com um exercício simples; errar não trava nem penaliza (mostra uma dica e deixa tentar de novo), mas o botão "Próximo" só libera depois de acertar pelo menos uma vez.
4. **🎯 Agora é você** — só a partir daqui entra a prática de verdade, a que conta pra `recordMastery`/domínio.

Outros detalhes implementados:

- **"Pular aula →"** sempre disponível, pros pais que preferirem ir direto (ou pra criança que já sabe o conteúdo).
- **"🎓 Rever aula"** — botão fixo na tela de jogo (só aparece em atividades que têm aula), pra rever a qualquer momento.
- **Sugestão automática após 3 erros seguidos**: se a criança erra 3 vezes de primeira tentativa seguidas na mesma atividade, aparece um link discreto "👀 Rever a aulinha?" junto do feedback — não força nada, só oferece o caminho de volta pra explicação. Esse é o começo do "sistema inteligente de erros" descrito no plano (hoje só olha *quantidade* de erros seguidos; identificar o *tipo* de erro, tipo confusão S/Z, fica pra depois).
- Card de atividade no painel mostra selo **"🎓 Tem aulinha antes de praticar"** quando a atividade tem aula.

## O que NÃO foi feito ainda (de propósito)

- **Só 2 das 53 atividades têm aula.** O próximo passo, sugerido no próprio plano, é auditar as outras 51 e classificar cada uma em: pode ir direto pra prática / precisa só de uma demonstração rápida / precisa de mini-aula completa como essa.
- **Sem múltiplas explicações por habilidade** (visual matemático vs. situação do dia a dia vs. dinheiro, como discutido) — cada aula hoje tem só um caminho de explicação.
- **Erro não é classificado por tipo ainda** — só conta "quantos erros seguidos", não "que tipo de erro". Fica pro Motor de Domínio mais completo.
- **`lessonsSeen` não persiste** — reseta se a aba fechar, igual a todo o resto do progresso hoje (persistência continua sendo o pré-requisito nº 1 de tudo, como já estava no briefing).

## Testado

`testes/qa_test_motor_ensino.js` — 33 checks automatizados (jsdom), cobrindo: aula aparece só na primeira vez, navegação entre passos, passo de prática bloqueia "Próximo" até acertar (sem travar em erro), passo final abre a prática real e conta pro domínio, "Pular aula" funciona, sugestão após 3 erros seguidos aparece e o link reabre a aula em modo retomar (sem reiniciar a atividade do zero), e o selo "🎓" aparece no card certo.

Rodei também a suíte inteira de testes já existente (27 arquivos) contra o arquivo modificado — nenhuma regressão. As duas falhas que aparecem (`qa_test_regression.js`, `qa_test_svg.js` às vezes) já existiam no arquivo original antes desta mudança; são flakiness pré-existente do harness de teste (setTimeout/Math.random), não relacionadas ao Motor de Ensino.

```
node testes/qa_test_motor_ensino.js
```
(exige o `ilha_aprendiz.html` em `/tmp/ilha_aprendiz.html`, igual aos outros testes da suíte.)
