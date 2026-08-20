# Ilha Aprendiz — Briefing e Status

*Atualizado em agosto de 2026. Este documento resume propósito, conteúdo construído, o gargalo de ritmo identificado e os próximos passos propostos — pensados pra fazer o mesmo conteúdo render o ano letivo inteiro, em vez de reescrever tudo do zero.*

> **Nota (2026-08-16):** desde a criação deste documento, dois itens tratados abaixo como pendência já foram resolvidos — **modularização do código** e **persistência de progresso** (item 1 dos "próximos passos"). O texto abaixo não foi reescrito pra preservar o registro histórico da descoberta original; o status atual e vivo fica em `docs/ROADMAP.md`, `docs/DECISOES.md` e `CLAUDE.md`.

> **Nota (2026-08-20, saneamento pré-produção/Fase 0.5):** este documento também não menciona, em nenhuma linha, a frente audiovisual — que já existe, com piloto VACA validado e banco de mídia completo (87 palavras com vídeo de personagem + áudio de fonética/Lia/SFX reais no projeto, ver `docs/ROADMAP.md`, seção "Frente paralela: piloto audiovisual"). Mesmo motivo do parecer acima: preservar o registro histórico original em vez de reescrever; status vivo continua em `docs/ROADMAP.md`.

---

## Propósito

Ilha Aprendiz é um app HTML/JS de página única, sem servidor e sem instalação, criado pra reforçar em casa o que o Benjamin (6 anos) e o Joaquim (3 anos) estão aprendendo — **não substitui a escola**, é ferramenta de prática extra.

O currículo do Benjamin é baseado na BNCC do **1º ano do Ensino Fundamental**, um ano à frente da matrícula real dele (ele está no Jardim 2), no mesmo espírito de antecipação que já vinha sendo aplicado antes do app existir. O Joaquim tem uma trilha bem mais simples, sem níveis, com letras/números/contagem básica.

Cada atividade tem 5 níveis de dificuldade, progressão por domínio (80% de acerto nas últimas 10 tentativas pra subir de nível), nunca deixa a criança travada (pode errar e tentar de novo sem penalidade), e todo enunciado é lido em voz alta (Web Speech API).

---

## O que foi construído

### Trilha Português (Benjamin) — 7 de 8 módulos prontos

| Módulo | Atividades | Bimestre |
|---|---|---|
| 1 · Alfabeto e Sílabas | 7 (Monte a Sílaba, Caça-Letras, Som Inicial, Pares Mínimos, Rimas, Troca-Letra, Maiúscula↔Minúscula) | 1º |
| 2 · Leitura de Palavras | 3 (Leitura Rápida, Leia a Frase, Escrita Certa) | 1º |
| 3 · Leitura de Frases e Textos Curtos | 3 (Parlendas, Som do Meio/Fim, Pontuação Certa) | 2º |
| 4 · Primeiras Produções Escritas | 3 (Complete a Lista, Texto do Dia a Dia, Parlenda de Cor) | 2º |
| 5 · Compreensão de Textos e Gêneros | 3 (Sinônimos/Antônimos, Qual é o Gênero?, Ler e Responder) | 3º |
| 6 · Narrativas e Recontagem | 3 (Elementos da História, Reconte a História, Invente o Final) | 3º |
| 7 · Gramática Inicial e Pontuação | 3 (Substantivo ou Verbo?, Que Ação Combina?, Pontuação no Textinho) | 4º |
| 8 · Projeto Leitor e Vocabulário | — | 4º |

**Total: 25 atividades × 5 níveis = 125 níveis a dominar.**

Módulo 8 não foi construído em tela por design — é uma habilidade de produção (ler livros de verdade, ampliar vocabulário) mais adequada a uma rotina de leitura em família do que a um app de clique. Fica formalizado como recomendação fora da tela.

A trilha é **sequencial**: só destrava o próximo módulo depois de dominar 100% do atual E passar no Desafio Final dele.

### Trilha Matemática (Benjamin) — 12 de 13 módulos prontos

| Módulo | Atividades | Bimestre |
|---|---|---|
| M1 · Números e Quantidades | 3 | 1º |
| M2 · Contagem até 100 | 2 | 1º |
| M3 · Comparar, Ordenar e Sequenciar | 3 | 1º |
| M4 · Adição | 2 | 2º |
| M5 · Subtração e Problemas | 3 | 2º |
| M6 · Compor e Decompor Números | 2 | 2º |
| M7 · Espaço e Localização | 2 | 3º |
| M8 · Formas Geométricas | 2 | 3º |
| M9 · Medidas e Comparações | 2 | 4º |
| M10 · Tempo e Calendário | 3 | 4º |
| M11 · Dinheiro | 2 | 4º |
| M12 · Probabilidade e Gráficos | 2 | 4º |
| M13 · Pesquisa da Semana | — | 4º |

**Total: 28 atividades × 5 níveis = 140 níveis a dominar.** Mais 2 jogos extras sem nível (Soma/Subtração Divertida, prática livre).

M13 também fica fora da tela por design — é pesquisa de campo (perguntar pra pessoas de verdade e organizar dados), reaproveitando o formato de gráfico que o M12 já ensina, aplicado a dados reais que o Benjamin mesmo coleta.

Diferente de Português, a trilha de Matemática é **inteiramente independente** — os 12 módulos não têm ordem obrigatória entre si, todos ficam desbloqueados desde o início.

**Somando as duas trilhas: 53 atividades, 265 níveis, 19 módulos com Desafio Final.**

### Desafio Final (Prova)

Checkpoint ao fim de cada um dos 19 módulos-container: só aparece depois do módulo 100% dominado, mistura 3 perguntas de cada atividade (embaralhadas), exige 80% de acerto geral **e** 60%+ em cada atividade individual pra aprovar. Em Português isso também é critério de desbloqueio do próximo módulo; em Matemática (trilha sem sequência) é só registro de conquista.

### Navegação

Reorganizada recentemente numa árvore de 4 telas — Ano Letivo → Matéria (Português/Matemática) → Módulo (agrupado por bimestre) → Atividades — em vez de uma lista única com tudo misturado. Joaquim continua com a lista simples, já que tem poucos jogos.

### Cobertura curricular

21 das 22 habilidades EF01MA e a quase totalidade das EF01LP estão mapeadas e testadas. Toda entrega passou por suíte de testes automatizada (jsdom, dezenas de milhares de rodadas simuladas por atividade) antes de ser considerada pronta.

---

## O gargalo: o conteúdo não dura o ano letivo

Essa é a descoberta mais importante desta fase — vale destacar antes de qualquer "próximo módulo".

**A conta:** 265 níveis, mínimo 2 sessões de 6 rodadas por nível pra dominar (80% de acerto), mais 159 perguntas somando os 19 Desafios Finais. Isso dá entre **530 e ~800 sessões** dependendo do quanto ele acerta de primeira — **18 a 30 horas de tela no total**.

O ano letivo brasileiro tem ~200 dias letivos. Pra esse conteúdo render o ano inteiro, a dose precisaria ficar em **~10 minutos por dia**. Numa dose mais realista de 15-20 min/dia (o que um menino de 6 anos aguenta antes de perder o interesse), **ele termina tudo em 3 a 4 meses** — não em 12.

Três fatores agravam isso:

1. **Distribuição torta entre bimestres.** O 1º bimestre concentra 18 atividades (34% do conteúdo do ano) — só o Módulo 1 de Português tem 7 atividades, 13% do total sozinho, logo onde ele é mais lento (ainda alfabetizando). O 3º bimestre tem só 10. Na prática o começo do ano vai arrastar e o fim vai voar.
2. **Matemática não tem freio.** Como os 12 módulos são independentes entre si, nada impede o Benjamin de varrer a trilha inteira em poucas semanas — o ritmo ali depende 100% de decisão manual de vocês, o app não segura.
3. **Não existe revisão espaçada.** Depois que uma atividade chega ao nível 5 e passa na prova, ela nunca mais volta. Nada traz "Monte a Sílaba" de volta em setembro pra reforçar. O app foi desenhado pra *terminar*, não pra *durar*.

E o fator que torna essa discussão hoje só teórica: **nenhum progresso é salvo entre sessões** (sem localStorage — decisão técnica documentada desde o início). Fechar a aba zera tudo. Enquanto isso não mudar, "quantos dias o conteúdo dura" depende de quanto tempo a aba fica aberta, não de dias corridos.

---

## Onde paramos

- Conteúdo pedagógico: **completo** para as trilhas planejadas (Português 7/8 módulos em tela + 1 fora da tela; Matemática 12/13 + 1 fora da tela).
- Sistema de avaliação (Desafio Final): **completo e testado** nos 21 módulos.
- Navegação/UX: **reorganizada** em árvore de 4 níveis.
- Persistência de progresso: **não existe** — maior lacuna técnica em aberto.
- Mecanismo de ritmo/revisão espaçada: **não existe** — lacuna identificada agora.
- Uso real com o Benjamin jogando de fato: **ainda não começou** — é a etapa combinada como prioridade antes de qualquer novo módulo.

---

## Próximos passos propostos (pra caber no mesmo ano letivo)

Não é construir mais conteúdo — é fazer o conteúdo que já existe render o ano. Nesta ordem sugerida:

1. **Persistência de progresso** (localStorage ou equivalente). Pré-requisito pra tudo abaixo fazer sentido — sem isso, medir ritmo real é impossível.
2. **Revisão espaçada.** Trazer de volta, em intervalos crescentes, atividades já dominadas — em vez de "nível 5 aprovado = nunca mais aparece". É o que mais estica a vida útil do conteúdo sem escrever uma linha nova de currículo.
3. **Trava de ritmo por bimestre**, especialmente em Matemática — impedir (ou desencorajar) varrer os 12 módulos de uma vez, alinhando a liberação approximada ao calendário real.
4. **Redistribuir a densidade entre bimestres** — o Módulo 1 de Português (7 atividades) e o peso do 1º bimestre merecem um olhar; pode fazer sentido quebrar o Módulo 1 ou realocar conteúdo pro 3º bimestre, que hoje está raso.
5. **Só depois disso, avaliação real com o Benjamin jogando** — a etapa que já estava combinada como prioridade, e que agora ganha um motivo técnico a mais: sem persistência, não dá pra observar ritmo de verdade.

Módulo 8 de Português e M13 de Matemática (ambos fora da tela por design) não entram nessa lista — já estão no formato certo pra habilidade que cobrem.
