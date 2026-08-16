# Ilha Aprendiz — pasta do projeto

App educacional infantil adaptativo (Benjamin, 6 anos, e Joaquim, 3 anos). Organizado em três camadas: **código**, **documentação viva** e **governança do agente** — a ideia é que nenhuma decisão importante viva só numa conversa; se está registrada aqui, sobrevive à conversa acabar.

**Comece por [`CLAUDE.md`](CLAUDE.md)** — é o ponto de entrada, carregado automaticamente pelo Claude Code a cada sessão nesta pasta. Resume princípios obrigatórios, estado atual e roadmap.

## `app/`
- **`ilha_aprendiz.html`** — o app em si. Basta abrir no navegador, sem servidor. Modularizado em `css/`, `data/` e `js/` (scripts clássicos, sem build step) — mapa completo em `docs/ARQUITETURA.md`. Progresso é salvo entre sessões via `localStorage` (`js/storage.js`, desde 2026-08-16) — fechar a aba não zera mais nível, domínio, Desafio Final nem estrelas.

## `docs/` — documentação do projeto (o quê, quando, por quê)
- **`BRIEFING.md`** — comece por aqui depois do `CLAUDE.md`. Propósito, conteúdo construído, o gargalo de ritmo e os próximos passos.
- **`ROADMAP.md`** — onde estamos e o que vem depois, em ordem.
- **`ARQUITETURA.md`** — arquitetura técnica do código (não do currículo — isso fica em `pedagogia/`).
- **`DECISOES.md`** — registro de decisões, com data e motivo. Append-only.
- **`CHANGELOG.md`** — histórico de mudanças entregues.
- **`ECOSSISTEMA.md`** — visão maior/ecossistema do projeto (produto, marca, agentes originais).

## `pedagogia/` — currículo e desenho pedagógico
- **`CURRICULO_BNCC_PORTUGUES.md`** / **`CURRICULO_BNCC_MATEMATICA.md`** — índice completo das duas trilhas, módulo a módulo, atividade a atividade, com status real.
- **`ARQUITETURA_TRILHA_PORTUGUES.md`** — decisões de arquitetura de conteúdo da trilha de Português.
- **`LEVANTAMENTO_INICIAL_PORTUGUES.md`** — levantamento inicial do currículo de Português.
- **`MODULO8_PROJETO_LEITOR.md`** — detalhamento do Módulo 8 (fora da tela por design).
- **`MOTOR_DE_ENSINO.md`** — protótipo do fluxo Ensinar → Demonstrar → Praticar → Dominar.
- **`REFERENCIA_NOVA_ESCOLA.md`** — material de referência usado na curadoria de conteúdo.
- **`bncc-oficial/`** — o documento oficial da BNCC (MEC), baixado direto da fonte, mais recortes extraídos das seções de Língua Portuguesa (1º/2º anos) e Matemática (1º ano). Fonte de verdade pra conferir os índices acima — comparação ainda não feita, ver `bncc-oficial/README.md`.
- **`HABILIDADES.md`**, **`PREREQUISITOS.md`** — stubs, ainda a construir (ver cada um pro porquê).

## `qa/` — qualidade
- **`CHECKLIST_QA.md`** — checklist antes de marcar algo como pronto.
- **`CASOS_DE_TESTE.md`** — mapa de qual arquivo em `testes/` cobre o quê.
- **`auditorias/`** — auditorias pontuais (ex.: `auditoria_53_atividades.md`, fila de transformação do Motor de Ensino).

## `claude/` — como o agente trabalha aqui
- **`AGENTES.md`** — os 4 papéis atuais (Arquiteto, Desenvolvedor, Especialista Pedagógico, QA).
- **`REGRAS_PERMANENTES.md`** — regras de processo (git, documentação, testes).

## `testes/`
Suíte de testes automatizados (Node + jsdom) — 32 arquivos, um por módulo/sistema. Mapa completo em `qa/CASOS_DE_TESTE.md`. `npm install` uma vez, depois:

```
node testes/_run_all.js        # suíte inteira, com resumo agregado
node testes/qa_test_nome.js    # um arquivo específico
```
