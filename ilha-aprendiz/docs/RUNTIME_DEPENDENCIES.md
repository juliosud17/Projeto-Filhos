# Mapa de Dependências de Runtime — Ilha Aprendiz

*Documento da FASE 1 — PREPARAÇÃO ESTRUTURAL PARA PRODUÇÃO (PASSO 1). Gerado por
leitura estática de `app/ilha_aprendiz.html` e dos 24 arquivos `<script>` que ele
carrega, na ordem real em que o navegador os executa. Não converte nada para ES
Modules, não reordena scripts, não altera nenhum arquivo de código — é só o
raio-x do que já existe hoje, para servir de contrato à Fase 2 (Vite).*

Data: 2026-08-21 · Baseado em commit `d402686` (branch `master`).

---

## 1. Como o app inicia hoje (resumo)

Não existe `DOMContentLoaded`, `window.onload` nem `addEventListener(..., 'load', ...)`
em nenhum lugar do projeto (`app/js/`, `app/data/`, `app/ilha_aprendiz.html`) —
confirmado por grep, zero ocorrências. O bootstrap real é **duas instruções
soltas no topo do escopo global**, nas duas últimas linhas de `js/storage.js`
(linhas 133-134):

```js
loadProgress();
updateGlobalStars();
```

Como scripts clássicos (`<script src="...">`, sem `defer`/`async`/`type="module"`)
executam sincronamente na ordem em que aparecem no HTML, assim que o parser
alcança a 15ª tag `<script>` (`js/storage.js`) essas duas linhas rodam
imediatamente — o DOM já existe (o `<body>` inteiro já foi parseado antes da
primeira tag `<script>`, que fica no fim do `<body>`), mas nenhum evento de
"documento pronto" é esperado. Isso funciona porque `storage.js` só manipula
`localStorage` e o texto de `#global-stars`, elementos que já existem no HTML
estático — não depende de nenhum outro script ter rodado depois dele, exceto
os que já rodaram antes (ver seção 3).

Depois disso, o app fica em repouso até o usuário clicar num `child-card` na
tela inicial (`onclick="selectChild('joaquim')"` ou `'benjamin'`), que é o
primeiro ponto de interação real.

## 2. Ordem exata dos `<script>` (24 tags, `ilha_aprendiz.html` linhas 198-221)

| # | Arquivo | Categoria |
|---|---|---|
| 1 | `data/icones.js` | dado curricular |
| 2 | `data/portugues-conteudo.js` | dado curricular |
| 3 | `data/emoji-visuais.js` | dado curricular |
| 4 | `data/registro-modulos.js` | dado curricular |
| 5 | `data/portugues-atividades.js` | dado curricular |
| 6 | `data/matematica-atividades.js` | dado curricular |
| 7 | `data/mapa-portugues.js` | dado curricular |
| 8 | `data/projeto-leitor.js` | dado curricular |
| 9 | `js/mastery.js` | estado/domínio |
| 10 | `js/ritmo-bimestre.js` | estado/regras |
| 11 | `js/navigation.js` | navegação/UI |
| 12 | `js/mapa-portugues.js` | navegação/UI |
| 13 | `js/projeto-leitor.js` | navegação/UI |
| 14 | `js/revisao-espacada.js` | estado |
| 15 | `js/storage.js` | persistência (**bootstrap acontece aqui**) |
| 16 | `js/admin.js` | navegação/UI (painel adulto) |
| 17 | `js/utils.js` | utilitário |
| 18 | `js/media-catalog.js` | mídia (só monta paths, não toca DOM) |
| 19 | `js/audio-manager.js` | mídia (toca áudio/vídeo) |
| 20 | `data/licoes.js` | dado curricular (Motor de Ensino) |
| 21 | `js/teaching-engine.js` | Motor de Ensino |
| 22 | `js/game-loop.js` | motor do jogo |
| 23 | `js/activities-portugues.js` | atividades (render) |
| 24 | `js/activities-matematica.js` | atividades (render) |

Observação de risco para a Fase 2: a ordem **importa de verdade** — não é
decorativa. Vários arquivos leem globais (`const`/`function`) definidos por
arquivos anteriores no exato momento em que são *executados* no top-level
(não só quando são *chamados* depois). Trocar a ordem, ou carregar como ES
Module com resolução assíncrona sem cuidado, pode quebrar a inicialização.

## 3. PRODUZ / CONSOME por arquivo

Formato: o que o arquivo declara no escopo global (`const`/`let`/`function`
de topo) e de quais arquivos *carregados antes dele* ele lê símbolos (via
varredura textual — confirma uso, não prova que é o único uso possível).
Símbolos que um arquivo referencia mas que só existem em arquivos carregados
**depois** dele estão marcados como "referência adiantada" na seção 4 —
esses são o sinal mais próximo de dependência circular que este runtime tem.

### `data/icones.js`
- **Produz:** `ICON_COLA`, `ICON_COLEIRA`, `ICON_GOLA`, `ICON_GOLEIRA`, `ICON_TATU`
- **Consome:** nada (primeiro script)

### `data/portugues-conteudo.js`
- **Produz:** `LETTERS`, `LETTER_LEVELS`, `MIN_PAIRS`, `RHYME_GROUPS`, `WORDS`, `WORD_FAMILIES`
- **Consome:** `data/icones.js` (todos os `ICON_*`)

### `data/emoji-visuais.js`
- **Produz:** `COUNT_EMOJI`, `EMOJI_GENDER_FEM`, `EMOJI_NAMES`
- **Consome:** nada

### `data/registro-modulos.js`
- **Produz:** `ALL_MODULES_BENJAMIN`, `GAMES`, `MATH_MODULES_BENJAMIN`, `PT_MODULES_BENJAMIN`
- **Consome:** nada diretamente (é o índice mestre dos módulos; outros arquivos leem dele, ele não lê ninguém)

### `data/portugues-atividades.js`
- **Produz:** 21 constantes de banco de atividades (`MODULE1_ACTIVITIES` … `MODULE7_ACTIVITIES`, `PARLENDAS`, `PHRASES`, etc.)
- **Consome:** `data/portugues-conteudo.js` (`WORDS`), `data/emoji-visuais.js` (`COUNT_EMOJI`, `EMOJI_NAMES`)

### `data/matematica-atividades.js`
- **Produz:** ~57 constantes/funções `MM1_*`…`MM12_*` (bancos e helpers de formatação)
- **Consome:** `data/emoji-visuais.js` (`COUNT_EMOJI`)

### `data/mapa-portugues.js`
- **Produz:** `PT_MAPA_REGIOES`
- **Consome:** `data/registro-modulos.js` (`PT_MODULES_BENJAMIN`)

### `data/projeto-leitor.js`
- **Produz:** `PROJETO_LEITOR_LIVROS`, `PROJETO_LEITOR_ROTEIRO`
- **Consome:** nada

### `js/mastery.js`
- **Produz:** `state` (objeto de estado em memória — ver `docs/GLOBALS_INVENTORY.md`), `mastery`, `activityLevel`, `recordMastery`, `provaScores`, `provaPassed`, `moduleStatus`, `isModuleUnlocked`, `containerById`, `containerForActivity`, `masteryPercent`, `CHILD_INFO`, `MODULE_CONTAINERS`, `MATH_GAMES_BENJAMIN`, `FUTURE_BENJAMIN`, `PROVA_PASS_OVERALL`, `PROVA_PASS_PER_ACTIVITY`, `PROVA_QUESTIONS_PER_ACTIVITY`, mais 12 funções `moduleXFullyMastered`/`mmNFullyMastered`
- **Consome:** `data/portugues-atividades.js` (`MODULE1..7_ACTIVITIES`), `data/matematica-atividades.js` (`MM1..12_ACTIVITIES`)
- **Referência adiantada:** usa `renderMenu` (definido só em `js/navigation.js`, carregado depois) — só dentro de corpo de função, não no top-level, então não quebra a carga.

### `js/ritmo-bimestre.js`
- **Produz:** `bimestreNumero`, `bimestreCalendarAtual`, `moduloAdiantado`, `modulosAdiantadosDaTrilha`
- **Consome:** nada diretamente detectado (opera sobre datas e sobre módulos passados como parâmetro)

### `js/navigation.js`
- **Produz:** `showScreen`, `selectChild`, `goHome`, `openMaterias`, `backToAnoLetivo`, `backToMaterias`, `openModulos`, `backToModulos`, `openAtividades`, `openPanel`, `backFromPanel`, `renderMenu`, `renderAnoLetivo`, `renderMaterias`, `renderModulos`, `renderAtividades`, `renderPanel`, `renderSectionTitle`, `updateGlobalStars`
- **Consome:** `data/registro-modulos.js` (`ALL_MODULES_BENJAMIN`, `GAMES`, `MATH_MODULES_BENJAMIN`, `PT_MODULES_BENJAMIN`), `data/portugues-atividades.js` (`MODULE1_ACTIVITIES`), `data/mapa-portugues.js` (`PT_MAPA_REGIOES`), `js/mastery.js` (`CHILD_INFO`, `FUTURE_BENJAMIN`, `MATH_GAMES_BENJAMIN`, `PROVA_PASS_OVERALL`, `PROVA_PASS_PER_ACTIVITY`, `activityLevel`, `containerById`, `isModuleUnlocked`, `mastery`, `masteryPercent`, `moduleStatus`, `provaPassed`, `provaScores`, `state`), `js/ritmo-bimestre.js` (`moduloAdiantado`, `modulosAdiantadosDaTrilha`)
- **Referência adiantada:** chama `openMapaPortugues` (`js/mapa-portugues.js`, #12), `startGame`/`startProva` (`js/game-loop.js`, #22), `maybeShowLesson` (`js/teaching-engine.js`, #21) e `AudioManager` (`js/audio-manager.js`, #19) — todos carregados **depois** de `navigation.js` (#11). Só funciona porque são chamados dentro de handlers de clique/render, nunca no top-level — este é o padrão dominante do app inteiro e o principal motivo pelo qual a ordem de carga tem que ser preservada tal como está na Fase 2.

### `js/mapa-portugues.js`
- **Produz:** `renderMapaPortugues`, `openMapaPortugues`, `renderPraticaLivre`, `openPraticaLivre`, `calibrarCoordenadas`, `calcularScrollCentralizado`, `centralizarMapaNoDestino`, `computeDestinoAtual`, `fecharTodosPopoversMapa`, `mapaCalibracaoAtiva`, `mapaCtaLabel`, `mapaEstadoLabel`, `mapaPopoverHtml`, `mapaProgressoPct`, `mapaSeloHtml`, `mensagemDestinoAtual`, `proximaAtividadeDoModulo`, `regionIsRecommendedToday`, `toggleMapaPopover`
- **Consome:** `data/registro-modulos.js` (`PT_MODULES_BENJAMIN`), `data/mapa-portugues.js` (`PT_MAPA_REGIOES`), `js/mastery.js` (`activityLevel`, `containerById`, `mastery`, `masteryPercent`, `moduleStatus`, `state`), `js/navigation.js` (`backToModulos`, `openAtividades`, `openModulos`, `renderAtividades`, `renderModulos`, `showScreen`)
- Carrega `assets/maps/ilha-das-letras.webp` via `bg.src = "assets/maps/..."` — ver seção 5 (paths).

### `js/projeto-leitor.js`
- **Produz:** `renderProjetoLeitor`, `openProjetoLeitor`, `backFromProjetoLeitor`
- **Consome:** `data/projeto-leitor.js` (`PROJETO_LEITOR_LIVROS`, `PROJETO_LEITOR_ROTEIRO`), `js/navigation.js` (`openAtividades`, `showScreen`), `js/mapa-portugues.js` (`openMapaPortugues`)

### `js/revisao-espacada.js`
- **Produz:** `reviewState`, `startRevisao`, `endRevisao`, `isDueForReview`, `dueReviewActivities`, `daysSince`, `registerActivityMastered`, `REVIEW_INTERVALS_DAYS`, `REVIEW_PASS_PER_ACTIVITY`, `REVIEW_ROUNDS_PER_ACTIVITY`
- **Consome:** `js/mastery.js` (`CHILD_INFO`, `activityLevel`, `mastery`, `state`), `js/navigation.js` (`showScreen`, `updateGlobalStars`)

### `js/storage.js` — **ponto de bootstrap**
- **Produz:** `loadProgress`, `saveProgress`, `clearProgress`, `hasLocalStorage`, `STORAGE_KEY`, `STORAGE_VERSION`
- **Consome:** `js/mastery.js` (`activityLevel`, `mastery`, `provaPassed`, `provaScores`, `state`), `js/navigation.js` (`updateGlobalStars`), `js/revisao-espacada.js` (`REVIEW_INTERVALS_DAYS`, `reviewState`)
- **Efeito colateral no top-level:** as duas linhas finais (`loadProgress(); updateGlobalStars();`) executam assim que este script carrega — é o único arquivo com efeito colateral de topo além das declarações. Por isso `js/storage.js` **depende implicitamente** de `js/mastery.js`, `js/navigation.js` e `js/revisao-espacada.js` já estarem carregados no momento em que ele próprio carrega — o que hoje é garantido só pela ordem física das tags `<script>` (posições 9, 11, 14 vêm antes da 15).

### `js/admin.js`
- **Produz:** `openAdmin`, `renderAdmin`, `adminSection`, `adminSimpleCard`, `adminLeveledCard`, `adminNotBuiltCard`, `adminProvaCard`, `adminPlay`, `adminPlayProva`, `adminReset`, `adminResetProva`, `adminResetAll`, `backToMenu`
- **Consome:** `data/registro-modulos.js` (`ALL_MODULES_BENJAMIN`, `GAMES`, `MATH_MODULES_BENJAMIN`, `PT_MODULES_BENJAMIN`), `js/mastery.js` (`MATH_GAMES_BENJAMIN`, `MODULE_CONTAINERS`, `activityLevel`, `mastery`, `masteryPercent`, `provaPassed`, `provaScores`, `state`), `js/navigation.js` (`renderAnoLetivo`, `renderAtividades`, `renderMenu`, `renderModulos`, `showScreen`, `updateGlobalStars`), `js/mapa-portugues.js` (`openMapaPortugues`), `js/revisao-espacada.js` (`reviewState`), `js/storage.js` (`clearProgress`, `saveProgress`)
- Nota: `backToMenu` é produzido aqui, mas é usado por `onclick` no HTML em telas que nada têm a ver com o admin (`screen-game`, `screen-lesson`, `screen-end`, etc. — ver seção 6). É um global "genérico de navegação" que historicamente ficou dentro de `admin.js`.

### `js/utils.js`
- **Produz:** `speak`, `speakStop`, `beep`, `visual`, `shuffle`, `pickRandom`, `descricaoSemBncc`, `extrairCodigoBncc`
- **Consome:** `js/mastery.js` (`recordMastery`), `js/navigation.js` (`renderAtividades`) — referências leves, dentro de funções

### `js/media-catalog.js`
- **Produz:** `MEDIA_BASE`, `FONETICA_PASTAS`, `mediaFileName`, `mediaFonetica`, `mediaCharacterVideo`, `mediaCharacterSound`, `mediaSfx`, `mediaLiaVoice`
- **Consome:** nada — puro (só monta strings de caminho, não toca DOM nem localStorage). Ver seção 5 para os paths que produz.

### `js/audio-manager.js`
- **Produz:** `AudioManager`, `mountCharacterIntro`, `playCharacterIntro`, `pronounceAndHighlight`
- **Consome:** `js/navigation.js` (`selectChild`), `js/utils.js` (`beep`, `speak`, `speakStop`, `visual`), `js/media-catalog.js` (`mediaCharacterVideo`, `mediaFonetica`, `mediaLiaVoice`)

### `data/licoes.js`
- **Produz:** `LESSONS`
- **Consome:** `js/utils.js` (`speak`) — usado dentro de callbacks de conteúdo da lição, não no top-level

### `js/teaching-engine.js`
- **Produz:** `showLesson`, `skipLesson`, `lessonState`, `lessonNext`, `lessonPrev`, `finishLesson`, `maybeShowLesson`, `renderLessonStep`, `renderLessonNav`
- **Consome:** `js/mastery.js` (`state`), `js/navigation.js` (`showScreen`), `js/utils.js` (`speak`, `speakStop`), `data/licoes.js` (`LESSONS`)

### `js/game-loop.js`
- **Produz:** `startGame`, `startFreePractice`, `startProva`, `nextRound`, `renderRound`, `registerAnswer`, `disableOptions`, `endSession`, `endProva`, `playAgainSameGame`, `retryProva`, `pickFromPool`, `pickWeightedByLevel`, `gamesForId`
- **Consome:** `data/portugues-conteudo.js` (`LETTERS`, `LETTER_LEVELS`, `WORDS`), `data/registro-modulos.js` (`ALL_MODULES_BENJAMIN`), `js/mastery.js` (`CHILD_INFO`, `PROVA_PASS_OVERALL`, `PROVA_PASS_PER_ACTIVITY`, `PROVA_QUESTIONS_PER_ACTIVITY`, `activityLevel`, `containerById`, `containerForActivity`, `mastery`, `masteryPercent`, `provaPassed`, `provaScores`, `recordMastery`, `state`), `js/navigation.js` (`showScreen`, `updateGlobalStars`), `js/revisao-espacada.js` (`endRevisao`, `registerActivityMastered`), `js/storage.js` (`saveProgress`), `js/utils.js` (`beep`, `shuffle`), `js/media-catalog.js` (`mediaSfx`), `js/audio-manager.js` (`AudioManager`), `data/licoes.js` (`LESSONS`), `js/teaching-engine.js` (`showLesson`)
- É o arquivo com mais dependências de todo o projeto (12 outros arquivos) — o "motor" central que orquestra praticamente tudo que veio antes dele.

### `js/activities-portugues.js`
- **Produz:** 33 funções `render*` (uma por tipo de atividade de Português) + helpers `montaFalaIntroPersonagem`, `normalizeTyped`, `currentCuriosityText`, `currentParlendaText`, `currentStoryText`
- **Consome:** `data/portugues-conteudo.js` (todos os 6 exports), `data/emoji-visuais.js` (todos os 3), `data/portugues-atividades.js` (15 dos 21 bancos), `js/mastery.js` (`activityLevel`, `state`), `js/utils.js` (`pickRandom`, `shuffle`, `speak`, `visual`), `js/media-catalog.js` (`mediaFonetica`, `mediaLiaVoice`, `mediaSfx`), `js/audio-manager.js` (`AudioManager`, `playCharacterIntro`, `pronounceAndHighlight`), `js/game-loop.js` (`pickFromPool`, `pickWeightedByLevel`, `registerAnswer`)

### `js/activities-matematica.js`
- **Produz:** 34 funções `render*`/`mmN*` (uma por tipo de atividade de Matemática)
- **Consome:** `data/emoji-visuais.js` (todos os 3), `data/matematica-atividades.js` (44 dos ~57 exports), `js/mastery.js` (`activityLevel`), `js/utils.js` (`pickRandom`, `shuffle`, `speak`, `visual`), `js/game-loop.js` (`pickWeightedByLevel`, `registerAnswer`)

## 4. "Dependências circulares aparentes" (referências adiantadas)

Não há dependência circular real no sentido de "A precisa de B e B precisa de
A ao mesmo tempo, no top-level" — isso quebraria a carga hoje mesmo, e a
suíte de testes (`testes/_run_all.js`) confirma que o app carrega e roda.
O que existe, e que É um risco relevante para a Fase 2, é o padrão de
**referência adiantada dentro de corpo de função**: um arquivo carregado
cedo (ex.: `js/navigation.js`, #11) referencia por nome uma função definida
só em um arquivo carregado bem depois (ex.: `js/game-loop.js`, #22,
`js/audio-manager.js`, #19, `js/teaching-engine.js`, #21, `js/mapa-portugues.js`,
#12). Isso funciona hoje porque:

1. Todos os 24 scripts terminam de carregar (e portanto todas as `function`
   de topo já existem no objeto `window`) antes de qualquer clique do
   usuário poder disparar o primeiro `onclick`.
2. Nenhum desses arquivos chama a função adiantada no seu próprio top-level
   — só dentro de outra função, que só roda depois, por interação.

Lista de referências adiantadas identificadas (arquivo mais cedo → símbolo
resolvido só em arquivo mais tarde):

- `js/navigation.js` (#11) → `openMapaPortugues` (`js/mapa-portugues.js`, #12), `startGame`/`startProva` (`js/game-loop.js`, #22), `maybeShowLesson` (`js/teaching-engine.js`, #21), `AudioManager` (`js/audio-manager.js`, #19)
- `js/mastery.js` (#9) → `renderMenu` (`js/navigation.js`, #11)

Risco para a Fase 2: qualquer estratégia de *code splitting* ou *lazy load*
por rota precisa preservar a garantia de que **todos** os 24 arquivos estão
totalmente carregados antes da primeira interação — não dá pra carregar só
"o necessário para a Home" sob demanda sem reescrever essas referências
adiantadas para checagem tardia (ex.: `typeof fn === 'function'`) ou sem
importar explicitamente cada símbolo consumido. Isso é trabalho de Fase 2,
não desta fase.

## 5. Caminhos de asset dependentes da localização do HTML

Todos os caminhos abaixo são relativos ao diretório de `app/ilha_aprendiz.html`
— não usam `/` absoluto nem `file://` explícito, o que é uma boa notícia para
a Fase 2 (paths relativos tendem a sobreviver à troca de `file://` para
HTTP/Vite sem alteração, **desde que a posição relativa entre o HTML e as
pastas `css/`/`assets/` seja preservada** pelo bundler).

- `<link rel="stylesheet" href="css/app.css">` (`ilha_aprendiz.html:7`)
- `MEDIA_BASE = "assets/"` (`js/media-catalog.js:14`) — raiz de onde todo o
  áudio/vídeo é montado dinamicamente:
  - `assets/audio/fonetica/<pasta>/<arquivo>.mp3`
  - `assets/audio/lia/<categoria>/<arquivo>.mp3`
  - `assets/video/personagens/<id>/<id>-<estado>.mp4`
  - `assets/audio/personagens/<characterId>/<arquivo>.mp3`
  - `assets/audio/sfx/<grupo>/<arquivo>.mp3`
- `bg.src = "assets/maps/ilha-das-letras.webp"` (`js/mapa-portugues.js:56`) — path literal fora de `media-catalog.js`, não passa por `mediaFileName()`/`MEDIA_BASE`. Ver `docs/PATHS_MIGRATION.md` para o detalhe deste caso.
- `video.src = url` (`js/audio-manager.js:267`) — atribuição dinâmica; `url` vem sempre de uma chamada anterior a `mediaCharacterVideo()`/`mediaCharacterSound()`, então herda o mesmo `MEDIA_BASE`.

Nenhum caminho absoluto de disco (`C:\`, `D:\`, `file://`) foi encontrado
embutido em `app/js/` ou `app/data/` — os únicos caminhos "quebráveis" na
migração são os relativos acima, e só quebram se a posição relativa de
`app/`, `css/`, `assets/` mudar.

## 6. Funções chamadas diretamente pelo HTML (`onclick` inline)

21 ocorrências de `onclick=` no HTML estático (`app/ilha_aprendiz.html`):

| Linha | Handler |
|---|---|
| 20 | `selectChild('joaquim')` |
| 26 | `selectChild('benjamin')` |
| 34 | `openAdmin(); return false;` |
| 41 | `goHome()` |
| 42 | `openPanel()` |
| 57 | `backToAnoLetivo()` |
| 68 | `backToMaterias()` |
| 72 | `calibrarCoordenadas(event); fecharTodosPopoversMapa();` |
| 86 | `backFromProjetoLeitor()` |
| 96 | `openMapaPortugues()` |
| 106 | `backToMaterias()` |
| 116 | `backToModulos()` |
| 126 | `backFromPanel()` |
| 136 | `goHome()` |
| 146 | `backToMenu()` |
| 148 | `showLesson(state.game, true)` |
| 161 | `backToMenu()` |
| 163 | `skipLesson()` |
| 175 | `playAgainSameGame()` |
| 176 | `backToMenu()` |
| 189 | `retryProva()` |
| 190 | `backToMenu()` |

Além disso, centenas de `onclick=` são gerados dinamicamente em tempo de
execução via template string/`innerHTML` dentro dos próprios arquivos JS —
contagem de linhas com `onclick=` por arquivo gerador:
`activities-matematica.js` (36), `activities-portugues.js` (28),
`admin.js` (6), `teaching-engine.js` (3), `game-loop.js` (1). Todos os
outros arquivos não geram `onclick=` dinâmico.

`addEventListener` (uso direto, fora de `onclick`) aparece só em dois
arquivos: `js/activities-portugues.js` (2 ocorrências) e
`js/audio-manager.js` (5 ocorrências, tipicamente eventos de mídia como
`ended`/`error` em `<video>`/`<audio>`).

## 7. Sem `DOMContentLoaded` / `window.onload`

Confirmado por grep em `app/js/*.js`, `app/data/*.js` e `app/ilha_aprendiz.html`:
zero ocorrências de `DOMContentLoaded`, `window.onload`, ou
`addEventListener(['"]load`. Ver seção 1.

## 8. Implicações diretas para a Fase 2 (não é escopo desta fase, só registro)

- Qualquer migração para ES Modules vai precisar resolver as referências
  adiantadas da seção 4 explicitamente (import estático ou checagem de
  disponibilidade), porque ES Modules não garantem por si só "todo mundo
  carregado antes do primeiro clique" da mesma forma simples que scripts
  clássicos sequenciais garantem hoje.
- O bootstrap de `js/storage.js` (linhas 133-134) precisa ser convertido para
  algo explícito e determinístico (ex.: um `init()` chamado depois que todos
  os módulos resolveram) — hoje ele depende 100% da posição física da tag
  `<script>` no HTML.
- `MEDIA_BASE = "assets/"` e o path literal de `mapa-portugues.js` são os
  dois pontos de maior atenção para servir assets via Vite/HTTP — ver
  `docs/PATHS_MIGRATION.md`.
