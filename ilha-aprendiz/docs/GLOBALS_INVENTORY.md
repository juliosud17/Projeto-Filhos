# Inventário de Globais — Ilha Aprendiz

*FASE 1, PASSO 2. Classifica os globais que já existem hoje (todos vivendo em
`window`, por serem scripts clássicos) em categorias A–H, para servir de mapa
de risco à Fase 2. Não corrige, não reduz, não renomeia nenhum global nesta
fase — só documenta o que existe.*

Legenda de classificação:
- **A** — Dado curricular (bancos de conteúdo, constantes de currículo)
- **B** — Estado (em memória, mutável durante a sessão)
- **C** — Navegação (troca de tela, roteamento entre `<section>`)
- **D** — Motor de Ensino (mini-aulas, `LESSONS`)
- **E** — Atividades (funções `render*` de jogo/exercício)
- **F** — Mídia (áudio/vídeo/paths de assets)
- **G** — Utilitários (funções puras/genéricas reutilizadas em várias categorias)
- **H** — Compatibilidade/legado (nomes que só existem por causa da história do projeto, candidatos a reorganização futura, mas não a remoção)

## A — Dado curricular

| Global | Arquivo de origem | Consumidores conhecidos | Chamado pelo HTML? | Risco de modularização futura |
|---|---|---|---|---|
| `WORDS`, `LETTERS`, `LETTER_LEVELS`, `MIN_PAIRS`, `RHYME_GROUPS`, `WORD_FAMILIES` | `data/portugues-conteudo.js` | `activities-portugues.js`, `game-loop.js`, `portugues-atividades.js` | não | Baixo — dado puro, fácil de virar `import` nomeado |
| `ICON_*` (5 constantes) | `data/icones.js` | `portugues-conteudo.js` | não | Baixo |
| `COUNT_EMOJI`, `EMOJI_NAMES`, `EMOJI_GENDER_FEM` | `data/emoji-visuais.js` | `portugues-atividades.js`, `matematica-atividades.js`, `activities-*.js` | não | Baixo |
| `ALL_MODULES_BENJAMIN`, `PT_MODULES_BENJAMIN`, `MATH_MODULES_BENJAMIN`, `GAMES` | `data/registro-modulos.js` | `navigation.js`, `admin.js`, `mapa-portugues.js` (data), `game-loop.js` | não | Médio — é o índice mestre; qualquer split de bundle por trilha precisa decidir onde este arquivo vive |
| `MODULE1_ACTIVITIES` … `MODULE7_ACTIVITIES` e as ~20 constantes auxiliares (`PARLENDAS`, `PHRASES`, `WORD_CLASS`, etc.) | `data/portugues-atividades.js` | `mastery.js`, `navigation.js`, `activities-portugues.js` | não | Baixo |
| `MM1_ACTIVITIES` … `MM12_ACTIVITIES` e ~40 constantes/helpers auxiliares (`mm10Cap`, `mm7CellLabel`, etc.) | `data/matematica-atividades.js` | `mastery.js`, `activities-matematica.js` | não | Baixo — mas é o arquivo maior em volume de símbolos (57) |
| `PT_MAPA_REGIOES` | `data/mapa-portugues.js` | `js/mapa-portugues.js` | não | Baixo |
| `PROJETO_LEITOR_LIVROS`, `PROJETO_LEITOR_ROTEIRO` | `data/projeto-leitor.js` | `js/projeto-leitor.js` | não | Baixo |
| `LESSONS` | `data/licoes.js` | `teaching-engine.js`, `game-loop.js` | não | Baixo (ver também categoria D) |

## B — Estado

| Global | Arquivo de origem | Consumidores conhecidos | Chamado pelo HTML? | Risco de modularização futura |
|---|---|---|---|---|
| `state` (objeto único, mutado por referência em todo o app) | `js/mastery.js` | praticamente todos os arquivos carregados depois (`navigation`, `game-loop`, `teaching-engine`, `revisao-espacada`, `admin`, `mapa-portugues`, `activities-*`) — 14 campos, ver seção "state" abaixo | sim, indiretamente (`onclick="showLesson(state.game, true)"` no HTML, linha 148) | **Alto** — é o objeto de estado central do app inteiro. Qualquer migração de arquitetura de estado (ex.: para um store real) tem que preservar todos os 14 campos ou mapear cada consumidor |
| `activityLevel` (objeto, 52 chaves fixas, nível 1–5 por atividade) | `js/mastery.js` | `storage.js`, `navigation.js`, `game-loop.js`, `admin.js`, `activities-*.js`, `mapa-portugues.js` | não | Alto — persiste em localStorage (ver `LOCAL_STORAGE_CONTRACT.md`), formato rígido |
| `mastery` (objeto, histórico das últimas 10 tentativas por `gameId:nivel`) | `js/mastery.js` | `storage.js`, `navigation.js`, `game-loop.js`, `admin.js` | não | Alto — mesma razão |
| `provaPassed`, `provaScores` (Desafio Final) | `js/mastery.js` | `storage.js`, `navigation.js`, `admin.js`, `game-loop.js` | não | Alto — persistem em localStorage |
| `reviewState` (Revisão Espaçada) | `js/revisao-espacada.js` | `storage.js`, `admin.js`, `game-loop.js` | não | Alto — persiste em localStorage |
| `lessonState` (progresso dentro de uma mini-aula em curso) | `js/teaching-engine.js` | `teaching-engine.js` (uso interno) | não | Baixo — não persiste, escopo de sessão |
| `bimestreCalendarAtual`, `bimestreNumero` | `js/ritmo-bimestre.js` | `navigation.js` | não | Baixo — calculado a partir da data, não persiste |

## C — Navegação

| Global | Arquivo de origem | Consumidores conhecidos | Chamado pelo HTML? | Risco de modularização futura |
|---|---|---|---|---|
| `showScreen`, `selectChild`, `goHome`, `openMaterias`, `backToAnoLetivo`, `backToMaterias`, `openModulos`, `backToModulos`, `openAtividades`, `openPanel`, `backFromPanel` | `js/navigation.js` | HTML (`onclick`), `admin.js`, `mapa-portugues.js`, `projeto-leitor.js`, `revisao-espacada.js`, `game-loop.js`, `teaching-engine.js` | **sim**, várias direto no HTML (`selectChild`, `goHome`, `backToAnoLetivo`, `backToMaterias`, `backToModulos`, `openPanel`, `backFromPanel`) | **Alto** — são o contrato de navegação inteiro; renomear qualquer uma quebra `onclick=` inline no HTML estático, que não é verificado por nenhum linter/teste de tipos |
| `backToMenu` | `js/admin.js` (fisicamente aqui, mas é navegação genérica de jogo) | HTML (`onclick`, telas `screen-game`/`screen-lesson`/`screen-end`/`screen-prova-result`), `game-loop.js` | **sim**, 3 ocorrências no HTML | Alto, mesma razão — nota especial: está em `admin.js` por razão histórica, não por ser específico do admin (ver categoria H) |
| `openMapaPortugues`, `openPraticaLivre`, `calibrarCoordenadas`, `fecharTodosPopoversMapa`, `toggleMapaPopover` | `js/mapa-portugues.js` | HTML (`onclick`, `calibrarCoordenadas`/`fecharTodosPopoversMapa` na linha 72), `admin.js`, `projeto-leitor.js` | **sim** | Alto |
| `openProjetoLeitor`, `backFromProjetoLeitor` | `js/projeto-leitor.js` | HTML (`onclick`, linha 86), `mapa-portugues.js` | **sim** | Médio |
| `openAdmin`, `renderAdmin` | `js/admin.js` | HTML (`onclick`, linha 34) | **sim** | Médio |

## D — Motor de Ensino

| Global | Arquivo de origem | Consumidores conhecidos | Chamado pelo HTML? | Risco de modularização futura |
|---|---|---|---|---|
| `showLesson`, `skipLesson` | `js/teaching-engine.js` | HTML (`onclick`, linhas 148 e 163), `game-loop.js` | **sim** | Alto — nome/assinatura usada direto no `onclick` |
| `maybeShowLesson`, `lessonNext`, `lessonPrev`, `finishLesson`, `renderLessonStep`, `renderLessonNav` | `js/teaching-engine.js` | uso interno / `game-loop.js` | não | Baixo |
| `LESSONS` | `data/licoes.js` | ver categoria A | — | — |

## E — Atividades

| Global | Arquivo de origem | Consumidores conhecidos | Chamado pelo HTML? | Risco de modularização futura |
|---|---|---|---|---|
| 33 funções `render*` de Português (`renderSilabas`, `renderRimas`, `renderLeitura`, etc.) | `js/activities-portugues.js` | `game-loop.js` (via `gamesForId`/despacho por `id`) | não diretamente — chamadas por despacho dinâmico dentro de `game-loop.js`, não por nome fixo no HTML | Médio — o despacho é indireto (dicionário id→função), então renomear uma função exige atualizar o mapeamento em `game-loop.js`, não o HTML |
| 34 funções `render*`/`mmN*` de Matemática | `js/activities-matematica.js` | `game-loop.js` | não diretamente, mesmo padrão | Médio |

## F — Mídia

| Global | Arquivo de origem | Consumidores conhecidos | Chamado pelo HTML? | Risco de modularização futura |
|---|---|---|---|---|
| `MEDIA_BASE`, `FONETICA_PASTAS`, `mediaFileName`, `mediaFonetica`, `mediaCharacterVideo`, `mediaCharacterSound`, `mediaSfx`, `mediaLiaVoice` | `js/media-catalog.js` | `audio-manager.js`, `activities-portugues.js`, `qa_test_assets_qa.js` | não | Alto — `MEDIA_BASE` é o único ponto que precisa mudar se a raiz de assets migrar (ex.: para CDN); ver `PATHS_MIGRATION.md` |
| `AudioManager`, `mountCharacterIntro`, `playCharacterIntro`, `pronounceAndHighlight` | `js/audio-manager.js` | `activities-portugues.js`, `game-loop.js`, `navigation.js` (referência adiantada) | não | Médio |

## G — Utilitários

| Global | Arquivo de origem | Consumidores conhecidos | Chamado pelo HTML? | Risco de modularização futura |
|---|---|---|---|---|
| `speak`, `speakStop`, `beep`, `visual`, `shuffle`, `pickRandom` | `js/utils.js` | quase todos os arquivos de atividade e mídia | não | Baixo — funções puras/genéricas, boas candidatas a módulo utilitário isolado |
| `descricaoSemBncc`, `extrairCodigoBncc` | `js/utils.js` | `navigation.js` (renderização de card de atividade) | não | Baixo — adicionado na Fase 0.5 especificamente para blindar a UI infantil de código BNCC |

## H — Compatibilidade / legado

| Global | Observação | Risco |
|---|---|---|
| `backToMenu` | Fisicamente declarado em `js/admin.js`, mas é usado como navegação genérica de "voltar ao menu do jogo" em 4 telas que nada têm a ver com o painel admin. Nome e localização não refletem o uso real. **Não mover nesta fase** — mover exigiria também atualizar 3 `onclick=` inline no HTML e não traz benefício funcional nenhum agora. | Baixo funcional, alto histórico/organizacional — bom candidato a reorganizar (não renomear) na Fase 2, quando o HTML puder ser tratado por um bundler em vez de strings soltas |
| Rodapé "protótipo v0.1 · sem armazenamento entre sessões" (`ilha_aprendiz.html:195`) | Não é um global de JS, mas é um texto estático desatualizado — persistência existe desde 2026-08-16. Achado registrado aqui por aparecer durante a leitura do HTML para este documento; **não corrigido nesta fase** (fora do escopo dos 15 passos). | Nenhum risco técnico, só precisão de conteúdo — fica registrado para correção futura |
| `mediaLiaVoice` | Nome sugere "voz da Lia" só, mas hoje é consumido também fora do contexto estritamente de voz (ver `audio-manager.js`/`activities-portugues.js`). Não é um problema em si, só uma nota de nomenclatura. | Baixo |

## Nota sobre `window` global compartilhado

Todos os símbolos acima (constantes `const`/`let` de topo de arquivo em
scripts clássicos, e toda `function` declarada no topo) viram propriedades
de `window` no momento em que cada `<script>` executa. Não há nenhum
mecanismo de encapsulamento (nem IIFE, exceto `AudioManager`, que é a única
exceção do projeto — ver `js/audio-manager.js`). Isso significa:

- Qualquer nome reutilizado em dois arquivos diferentes sobrescreveria
  silenciosamente o anterior — checagem manual não encontrou colisões hoje,
  mas não há proteção automática contra uma futura.
- A Fase 2 (ES Modules) resolve isso estruturalmente por natureza (cada
  módulo tem seu próprio escopo), mas até lá, todo novo símbolo global
  adicionado ao projeto deve continuar sendo verificado manualmente contra
  esta lista antes de ser criado, para não colidir.
