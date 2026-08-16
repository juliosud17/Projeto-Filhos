# Roadmap — Ilha Aprendiz

*Responde "onde estamos e o que vem depois?". Este documento muda com frequência — é o painel de controle do momento presente, diferente do `DECISOES.md` (que é histórico e não deve ser reescrito) e do `BRIEFING.md` (que é a fotografia de status mais recente, mais narrativa). Atualizado em 2026-08-16, na criação da camada de documentação viva.*

## Onde estamos

| Frente | Status |
|---|---|
| Conteúdo Português (7/8 módulos em tela) | 🟢 Completo, testado, não validado com o Benjamin jogando |
| Conteúdo Matemática (12/13 módulos em tela) | 🟢 Completo, testado, não validado com o Benjamin jogando |
| Desafio Final (avaliação por módulo) | 🟢 Completo e testado nos 21 módulos com nível |
| Navegação (árvore de 4 telas) | 🟢 Reorganizada |
| Motor de Ensino (Aprender → Ver exemplo → Fazer comigo → Agora é você) | 🟡 Prova de conceito em 2 das 53 atividades (M6 Matemática) |
| Persistência de progresso | 🟢 Existe desde 2026-08-16 (`js/storage.js`, localStorage) |
| Revisão espaçada | 🟢 Existe desde 2026-08-16 (`js/revisao-espacada.js`) |
| Trava de ritmo por bimestre | 🟢 Existe desde 2026-08-16 (`js/ritmo-bimestre.js`, referência informativa) |
| Estrutura de documentação viva (este conjunto de arquivos) | 🟢 Criada em 2026-08-16 |
| Modularização do código (`app/ilha_aprendiz.html` → `js/`, `css/`, `data/`) | 🟢 Feita em 2026-08-16 — ver `docs/ARQUITETURA.md` |

## Por que essa ordem (o gargalo)

Descoberto em agosto de 2026 (ver `BRIEFING.md` para a conta completa): 265 níveis a dominar entre as duas trilhas, dando entre 530 e ~800 sessões de jogo — 18 a 30 horas de tela no total. Numa dose realista de 15-20 min/dia, **o conteúdo acaba em 3-4 meses**, não no ano letivo inteiro (~200 dias letivos). Três causas identificadas:

1. Distribuição torta entre bimestres — o 1º concentra 34% do conteúdo do ano.
2. Matemática não tem freio — os 12 módulos são independentes entre si, nada impede varrer tudo em poucas semanas.
3. Não existe revisão espaçada — depois do nível 5 + prova aprovada, a atividade nunca mais volta.

Até 2026-08-16, um fator tornava essa discussão só teórica: sem persistência, "quantos dias o conteúdo dura" dependia de quanto tempo a aba ficava aberta, não de dias corridos. Isso está resolvido agora (`js/storage.js`), e a causa 3 (revisão espaçada) também já foi endereçada (`js/revisao-espacada.js`). A causa 2 (Matemática sem freio) ganhou um **sinal informativo** de ritmo (`js/ritmo-bimestre.js`) — não um freio de verdade, de propósito (ver `docs/DECISOES.md`): ainda dá pra varrer tudo, só que agora com um selo visível avisando que está adiantado. Resta a causa 1 (distribuição entre bimestres), item 4 abaixo.

## Próximos passos, em ordem

### ~~1. Persistência de progresso~~ — feito em 2026-08-16
localStorage via `js/storage.js`: nível de cada atividade, histórico de mastery (últimas 10 tentativas), Desafio Final e estrelas sobrevivem a fechar a aba. Detalhe técnico e decisão de escopo em `docs/ARQUITETURA.md` e `docs/DECISOES.md`. Isso desbloqueia os itens 2 e 3 abaixo, que antes não tinham como ser avaliados na prática.

### ~~2. Revisão espaçada~~ — feito em 2026-08-16
Atividades já dominadas voltam em intervalos crescentes (2/5/10/21/45 dias) via o card "🔁 Revisão de Hoje" na tela de Ano Letivo. Desenho completo e decisões de escopo em `pedagogia/REVISAO_ESPACADA.md` e `docs/DECISOES.md`.

### ~~3. Trava de ritmo por bimestre~~ — feito em 2026-08-16
Formato escolhido: **referência informativa, não bloqueio.** Módulo de Matemática cujo bimestre está à frente do bimestre real do calendário ganha um selo "🗓️ Adiantado" (no card do módulo e um resumo no card da trilha) — nenhum módulo fica inacessível por causa disso. Só Matemática (Português já trava por domínio+Desafio Final). Justificativa completa da escolha entre bloqueio rígido vs. referência em `docs/DECISOES.md`.

### 4. Redistribuir densidade entre bimestres
O Módulo 1 de Português (7 atividades, 13% do conteúdo do ano sozinho) e o peso geral do 1º bimestre merecem um olhar; pode fazer sentido quebrar o Módulo 1 ou realocar conteúdo pro 3º bimestre, que hoje está raso.

### 5. Avaliação real com o Benjamin jogando
A etapa que já estava combinada como prioridade desde antes deste documento existir. Persistência, revisão espaçada e o sinal de ritmo já existem — dá pra começar essa avaliação a qualquer momento agora, inclusive em paralelo ao item 4, já que nenhum dos itens restantes é pré-requisito técnico deste.

### ~~Em paralelo: modularização do código~~ — feito em 2026-08-16
`app/ilha_aprendiz.html` já está separado em `css/`, `data/` e `js/` (ver `docs/ARQUITETURA.md`). Isso não estava bloqueando os itens 1-5, mas reduz o risco de trabalhar neles agora — em especial o item 1 (persistência), que nasce como `js/storage.js` novo, e não mais como código espalhado dentro de um arquivo de 5.600 linhas.

## Fora do roadmap (decisão já tomada, não revisitar sem motivo novo)

- **Módulo 8 de Português** e **M13 de Matemática** — ambos fora da tela por design (projeto leitor semanal / pesquisa de campo). Já estão no formato certo pra habilidade que cobrem, não entram como "pendência".
- **Auditoria de ensino das 51 atividades restantes** (quais precisam de aula completa vs. demonstração rápida vs. podem ir direto pra prática) — mencionada em `pedagogia/MOTOR_DE_ENSINO.md` como próximo passo natural do Motor de Ensino, mas só faz sentido depois de observar onde a criança realmente trava com uso real (item 5).
