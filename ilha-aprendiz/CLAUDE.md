# Ilha Aprendiz — Constituição do Projeto

*Este arquivo é carregado automaticamente pelo Claude Code sempre que a sessão abre nesta pasta (ou numa pasta abaixo dela). É o ponto de entrada — leia isto antes de qualquer alteração. Os documentos vivos que ele referencia (`docs/`, `pedagogia/`, `qa/`, `claude/`) são a memória oficial do projeto: se uma decisão importante não está registrada em algum deles, ela existe só na conversa e será perdida quando a conversa acabar.*

## O que é

Ilha Aprendiz é um app educacional infantil adaptativo, HTML/JS de página única, sem servidor, criado pra reforçar em casa o que o Benjamin (6 anos) e o Joaquim (3 anos) aprendem — **não substitui a escola**, é prática extra. Currículo do Benjamin baseado na BNCC do 1º ano do Ensino Fundamental (um ano à frente da matrícula real dele, no Jardim 2).

Comece sempre por [`docs/BRIEFING.md`](docs/BRIEFING.md) pra saber onde o projeto está agora.

## Princípios obrigatórios

Regras que não podem ser quebradas silenciosamente — qualquer mudança que violar uma delas precisa ser discutida antes, não só implementada:

- **Ensinar antes de avaliar** quando a habilidade exigir conhecimento novo que a criança ainda não tem (ver "Motor de Ensino" abaixo). Hoje só 2 das 53 atividades têm essa aula prévia — o app ainda avalia bem mas ensina pouco na maioria das atividades.
- **Nunca penalizar erro retirando recompensa.** Errar não trava, não tira estrela, não reseta progresso — sempre pode tentar de novo.
- **Não avançar apenas por quantidade de exercícios.** Progressão de nível é por domínio (≥80% de acerto nas últimas 10 tentativas), não por ter "feito X rodadas".
- **Domínio e retenção são métricas diferentes.** Nível 5 com 80% de mastery mede domínio no momento; isso não significa que a criança vai lembrar em 3 meses. Não confundir as duas nem tratar "chegou no nível 5" como "está garantido pra sempre" (é exatamente a lacuna de revisão espaçada identificada no roadmap).
- **BNCC não deve poluir a interface infantil.** Os códigos de habilidade (EF01LP04, EF01MA07, etc.) existem na documentação e no código-fonte, nunca na tela que a criança vê.
- **Toda mudança deve preservar os testes existentes.** Antes de considerar qualquer alteração pronta, a suíte em `testes/` roda inteira. Falhas pré-existentes conhecidas (flakiness de `setTimeout`/`Math.random` em `qa_test_regression.js` e `qa_test_svg.js`, intermitência em `qa_test_typing.js`) são toleradas e já documentadas — uma falha *nova* não é.
- **Novas funcionalidades precisam de teste automatizado** no mesmo padrão jsdom já usado (ver `qa/CHECKLIST_QA.md`).
- **Trilha de Português é sequencial** (módulo N só desbloqueia com módulo N-1 100% dominado + Desafio Final aprovado); **trilha de Matemática é independente** (os 12 módulos não têm ordem obrigatória entre si). Não confundir as duas regras ao adicionar módulo novo.
- **Progresso é salvo entre sessões** desde 2026-08-16 (`js/storage.js`, localStorage) — o que passa a tornar possível de verdade observar ritmo real de uso (antes disso, era só teórico).

## Arquitetura pedagógica (por atividade, quando tiver aula)

```
Ensinar → Demonstrar → Prática guiada → Prática independente → Domínio → Revisão espaçada → Retenção
```

Ver [`pedagogia/MOTOR_DE_ENSINO.md`](pedagogia/MOTOR_DE_ENSINO.md) pro protótipo já implementado desse fluxo (hoje só nas atividades `monte_o_numero` e `dezena_e_unidade` do Módulo M6 de Matemática).

## Estado atual (visão rápida — detalhes em `docs/ROADMAP.md`)

- Conteúdo pedagógico: **completo** para as trilhas planejadas — Português 7/8 módulos em tela + 1 fora da tela (`pedagogia/MODULO8_PROJETO_LEITOR.md`); Matemática 12/13 + 1 fora da tela.
- Desafio Final (avaliação por módulo): **completo e testado** nos 21 módulos com nível.
- Persistência de progresso: **existe** desde 2026-08-16 (`js/storage.js`, localStorage) — nível de cada atividade, histórico de mastery, Desafio Final e estrelas sobrevivem a fechar a aba. Ver `docs/ARQUITETURA.md` e `docs/DECISOES.md`.
- Revisão espaçada: **existe** desde 2026-08-16 (`js/revisao-espacada.js`) — atividades dominadas voltam em intervalos crescentes via o card "🔁 Revisão de Hoje". Ver `pedagogia/REVISAO_ESPACADA.md`.
- Trava de ritmo por bimestre: **existe** desde 2026-08-16 (`js/ritmo-bimestre.js`) — só Matemática, só selo informativo "🗓️ Adiantado", nunca bloqueia. Ver `docs/DECISOES.md`.
- Uso real com o Benjamin jogando: **ainda não começou**.
- Código: modularizado em 2026-08-16 — `app/ilha_aprendiz.html` (175 linhas) + `css/`, `data/`, `js/`. Scripts clássicos (não ES modules), conteúdo como `const` (não JSON via `fetch`) — continua abrindo com duplo-clique, sem servidor. Ver `docs/ARQUITETURA.md`.
- **Frente audiovisual (personagens/voz da Lia/fonética/SFX)**: arquitetura aprovada e piloto VACA implementado em código em 2026-08-17 (`app/js/media-catalog.js`, `app/js/audio-manager.js`). **Assets reais do piloto já estão no projeto** (3 falas da Lia, fonética VA/CA/VACA + família B/V completa, SFX de acerto, vídeo da vaca) — piloto VACA fim-a-fim funcional, testado em `testes/qa_test_piloto_vaca.js`. Ver `docs/audio/MEDIA_GUIDELINES.md` (status atualizado do roteiro de gravação) e `docs/audio/VOZ_LIA.md`/`docs/characters/CHARACTER_BIBLE.md`. Pendente: Voice ID/modelo do ElevenLabs em `docs/audio/VOZ_LIA.md` ainda não preenchidos; escalar o campo `character` além de VACA pras demais palavras de `WORDS` é decisão futura, não feita ainda (vertical slice deliberado).
- **Produção de vídeo/áudio (Flow/ElevenLabs) das 87 palavras**: templates de prompt + banco de palavras + checklist em `producao/` (ferramenta de trabalho, separada de `docs/`). Peça "me dá o prompt de X" (ou use o subagente `.claude/agents/gerador-prompts-av.md`) pra gerar o próximo prompt sem reler tudo do zero. Lote A (10 palavras) em produção; resto do banco (77 palavras) aguardando validação do Lote A.

## Ordem atual do roadmap

Ver [`docs/ROADMAP.md`](docs/ROADMAP.md) pra detalhe e justificativa de cada item. Resumo:

1. ~~Persistência de progresso~~ — feito
2. ~~Revisão espaçada~~ — feito
3. ~~Trava de ritmo por bimestre~~ — feito
4. Redistribuir densidade entre bimestres (1º bimestre está sobrecarregado)
5. Avaliação real com o Benjamin jogando

(Item de infraestrutura "modularizar o HTML monolítico" também já foi feito em 2026-08-16 — ver `docs/ARQUITETURA.md`. Detalhe de cada item em `docs/ROADMAP.md`.)

## Papéis que o Claude assume nesta sessão

O projeto ainda está numa fase em que poucos papéis resolvem quase tudo — não crie novos agentes/subagentes sem necessidade real. Ver [`claude/AGENTES.md`](claude/AGENTES.md) para a descrição de cada um:

- **Arquiteto/Orquestrador** — planeja, decide arquitetura, quebra trabalho grande em passos.
- **Desenvolvedor** — escreve/refatora código, roda testes.
- **Especialista Pedagógico** — currículo, BNCC, progressão, motor de ensino.
- **QA/Validador** — audita atividades, garante cobertura de teste.

## Regras de trabalho (mecânicas, não pedagógicas)

Ver [`claude/REGRAS_PERMANENTES.md`](claude/REGRAS_PERMANENTES.md) para a lista completa. As mais importantes:

- Commit antes de qualquer mudança grande ("versão estável antes de X"), nunca depois.
- Decisão de arquitetura ou de escopo pedagógico relevante → registrar em `docs/DECISOES.md`, com data e motivo, não só implementar.
- Mudança de conteúdo/currículo → refletir no índice correspondente em `pedagogia/`.
