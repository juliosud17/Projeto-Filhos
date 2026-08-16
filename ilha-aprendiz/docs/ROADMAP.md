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
| Revisão espaçada | 🔴 Não existe |
| Trava de ritmo por bimestre | 🔴 Não existe |
| Estrutura de documentação viva (este conjunto de arquivos) | 🟢 Criada em 2026-08-16 |
| Modularização do código (`app/ilha_aprendiz.html` → `js/`, `css/`, `data/`) | 🟢 Feita em 2026-08-16 — ver `docs/ARQUITETURA.md` |

## Por que essa ordem (o gargalo)

Descoberto em agosto de 2026 (ver `BRIEFING.md` para a conta completa): 265 níveis a dominar entre as duas trilhas, dando entre 530 e ~800 sessões de jogo — 18 a 30 horas de tela no total. Numa dose realista de 15-20 min/dia, **o conteúdo acaba em 3-4 meses**, não no ano letivo inteiro (~200 dias letivos). Três causas identificadas:

1. Distribuição torta entre bimestres — o 1º concentra 34% do conteúdo do ano.
2. Matemática não tem freio — os 12 módulos são independentes entre si, nada impede varrer tudo em poucas semanas.
3. Não existe revisão espaçada — depois do nível 5 + prova aprovada, a atividade nunca mais volta.

Até 2026-08-16, um fator tornava essa discussão só teórica: sem persistência, "quantos dias o conteúdo dura" dependia de quanto tempo a aba ficava aberta, não de dias corridos. Isso está resolvido agora (`js/storage.js`) — a partir daqui, os itens 2 e 3 abaixo passam a ser observáveis de verdade com uso real.

## Próximos passos, em ordem

### ~~1. Persistência de progresso~~ — feito em 2026-08-16
localStorage via `js/storage.js`: nível de cada atividade, histórico de mastery (últimas 10 tentativas), Desafio Final e estrelas sobrevivem a fechar a aba. Detalhe técnico e decisão de escopo em `docs/ARQUITETURA.md` e `docs/DECISOES.md`. Isso desbloqueia os itens 2 e 3 abaixo, que antes não tinham como ser avaliados na prática.

### 2. Revisão espaçada
Trazer de volta, em intervalos crescentes, atividades já dominadas — em vez de "nível 5 aprovado = nunca mais aparece". É o que mais estica a vida útil do conteúdo existente sem escrever uma linha nova de currículo. Ver `pedagogia/REVISAO_ESPACADA.md` (ainda a projetar).

### 3. Trava de ritmo por bimestre
Especialmente em Matemática — impedir ou desencorajar varrer os 12 módulos de uma vez, alinhando a liberação aproximada ao calendário real. Formato ainda em aberto (bloqueio rígido vs. bimestre como referência com liberação por domínio de pré-requisitos vs. outro mecanismo) — decidir e registrar em `DECISOES.md` quando este item for atacado.

### 4. Redistribuir densidade entre bimestres
O Módulo 1 de Português (7 atividades, 13% do conteúdo do ano sozinho) e o peso geral do 1º bimestre merecem um olhar; pode fazer sentido quebrar o Módulo 1 ou realocar conteúdo pro 3º bimestre, que hoje está raso.

### 5. Avaliação real com o Benjamin jogando
A etapa que já estava combinada como prioridade desde antes deste documento existir. Agora que a persistência existe (item 1), já dá pra observar ritmo de verdade — mas ainda faz mais sentido depois da revisão espaçada e da trava de ritmo (itens 2-3), senão a observação capturaria o app no formato "sem freio" que já se sabe que não vai durar o ano.

### ~~Em paralelo: modularização do código~~ — feito em 2026-08-16
`app/ilha_aprendiz.html` já está separado em `css/`, `data/` e `js/` (ver `docs/ARQUITETURA.md`). Isso não estava bloqueando os itens 1-5, mas reduz o risco de trabalhar neles agora — em especial o item 1 (persistência), que nasce como `js/storage.js` novo, e não mais como código espalhado dentro de um arquivo de 5.600 linhas.

## Fora do roadmap (decisão já tomada, não revisitar sem motivo novo)

- **Módulo 8 de Português** e **M13 de Matemática** — ambos fora da tela por design (projeto leitor semanal / pesquisa de campo). Já estão no formato certo pra habilidade que cobrem, não entram como "pendência".
- **Auditoria de ensino das 51 atividades restantes** (quais precisam de aula completa vs. demonstração rápida vs. podem ir direto pra prática) — mencionada em `pedagogia/MOTOR_DE_ENSINO.md` como próximo passo natural do Motor de Ensino, mas só faz sentido depois que persistência (item 1) permitir observar onde a criança realmente trava.
