# Auditoria de Produção — Ilha Aprendiz (Fase 0)

*Data: 2026-08-20. Escopo: leitura e diagnóstico apenas — nenhuma linha de código foi alterada, nenhuma dependência instalada, nenhum arquivo movido, nenhum commit de implementação feito. Este documento é o entregável da Fase 0 do plano mestre de produção comercial (`docs/PRUDUÇÃO/ILHA_APRENDIZ_PLANO_MESTRE_PRODUCAO_COMERCIAL.md`).*

*Fontes: `CLAUDE.md`, `claude/REGRAS_PERMANENTES.md`, `docs/ARQUITETURA.md`, `docs/BRIEFING.md`, `docs/ROADMAP.md`, `docs/DECISOES.md`, `docs/CHANGELOG.md`, `docs/ECOSSISTEMA.md`, `docs/audio/MEDIA_GUIDELINES.md`, `docs/audio/VOZ_LIA.md`, `docs/characters/CHARACTER_BIBLE.md`, todos os 15 arquivos de `app/js/`, todos os 9 arquivos de `app/data/`, `app/ilha_aprendiz.html`, `app/css/app.css`, `package.json`, os 34 arquivos de `testes/`, `qa/CASOS_DE_TESTE.md`, `qa/CHECKLIST_QA.md`, e o histórico de trabalho da própria sessão que produziu a base de áudio/vídeo das 87 palavras.*

---

## Resumo executivo

O protótipo é um app HTML/JS de página única, sem build, sem servidor, feito para abrir com duplo-clique — e essa é exatamente a característica que precisa ser preservada até o último momento possível durante a migração. Ele já resolve corretamente as partes pedagógicas difíceis (progressão por domínio, revisão espaçada, Desafio Final, trilha sequencial vs. independente) e tem uma suíte de testes real (34 arquivos, jsdom, `npm test`) que funciona hoje sem nenhuma infraestrutura além de `node` e um `npm install` local.

O que o app **não** tem, e que toda a arquitetura atual pressupõe implicitamente que nunca vai precisar, é: um sistema de módulos real (é 190+ funções e objetos globais compartilhando `window`, amarrados só pela ordem dos `<script>` no HTML), um schema de dados validado (tudo é `const` de JS lido por convenção, sem nenhuma checagem de integridade referencial), um conceito real de "usuário"/conta (dois filhos hardcoded em 4 lugares diferentes, progresso salvo num único blob de `localStorage` sem particionamento real por criança), e qualquer noção de ambiente (dev/staging/prod são a mesma coisa: o arquivo local ou o GitHub Pages).

Nenhum desses pontos é motivo para pânico — são exatamente o tipo de dívida que se resolve numa sequência de fases pequenas e reversíveis, que é como o plano mestre já está desenhado. A auditoria abaixo documenta cada achado item a item, e termina com a sequência de migração mínima pedida.

---

## 1. Arquitetura atual

App de página única (`app/ilha_aprendiz.html`, 223 linhas) carregando 21 `<script>` clássicos (não `type="module"`) mais um `<link rel="stylesheet">` para `css/app.css` — tudo lido diretamente do disco, sem bundler, sem transpilador, sem CDN externo. O conteúdo pedagógico (palavras, atividades, módulos, lições) é definido como literais `const` de JavaScript em `app/data/*.js`, nunca como JSON buscado via `fetch`. A lógica de jogo/UI vive em `app/js/*.js`. Não existe framework (nem React, nem Vue) — DOM manipulado diretamente via `innerHTML`/`createElement`.

O estilo arquitetural é "scripts clássicos compartilhando `window`", não módulos ES: qualquer arquivo pode referenciar qualquer `const`/`function` de qualquer outro arquivo carregado antes dele, sem `import`/`export`. Isso funciona hoje porque a ordem dos 21 `<script>` no HTML foi ajustada manualmente para satisfazer as dependências implícitas (ver item 4).

## 2. Entry point

`app/ilha_aprendiz.html` é o único ponto de entrada. Não há roteamento client-side de URL (sem `history.pushState`, sem hash routing) — a navegação entre telas é feita trocando `display`/classes em `<div>`s fixas no mesmo documento (`showScreen()` em `navigation.js`). Abrir o arquivo já entrega a tela de seleção de criança; não existe "deep link" para uma atividade específica.

## 3. Execução: `file://` ou servidor

Hoje roda dos dois jeitos, e o app foi desenhado deliberadamente para o primeiro:

- **`file://` local (uso real diário)**: duplo-clique no `.html`, sem servidor — é como o Benjamin e o Joaquim jogam hoje.
- **GitHub Pages (deploy público, descoberto/confirmado nesta mesma sessão de trabalho)**: `https://juliosud17.github.io/Projeto-Filhos/ilha-aprendiz/app/ilha_aprendiz.html` — serve os mesmos arquivos estáticos, sem build, direto do repositório.

Essa dualidade já causou um bug real e corrigido: GitHub Pages roda em filesystem Linux **case-sensitive**; Windows/`file://` é case-insensitive. Nomes de arquivo/pasta de áudio com a caixa errada funcionavam localmente e davam 404 no ar — 164 arquivos de áudio precisaram de correção de caixa. `docs/audio/MEDIA_GUIDELINES.md` já documenta esse risco explicitamente ("o código sempre referencia tudo em minúsculo... isso importa se o projeto for hospedado num servidor Linux") mas a causa raiz (developer editando em Windows, sem CI que valide case) continua presente — é um risco estrutural, não um evento isolado, e vai se repetir em qualquer pipeline futuro que não valide nomes de arquivo automaticamente.

## 4. Módulos e dependências

Nenhuma dependência de runtime além de `jsdom` (só para testes, `devDependency`, `^24.0.0`) — `package.json` não declara nenhuma dependência de produção. O "grafo de módulos" real é a ordem dos 21 `<script src>` em `ilha_aprendiz.html`:

```
data/icones.js → data/portugues-conteudo.js → data/emoji-visuais.js →
data/registro-modulos.js → data/portugues-atividades.js → data/matematica-atividades.js →
data/mapa-portugues.js → data/projeto-leitor.js →
js/mastery.js → js/ritmo-bimestre.js → js/navigation.js →
js/mapa-portugues.js → js/projeto-leitor.js → js/revisao-espacada.js →
js/storage.js → js/admin.js → js/utils.js → js/media-catalog.js → js/audio-manager.js →
data/licoes.js →
js/teaching-engine.js → js/game-loop.js →
js/activities-portugues.js → js/activities-matematica.js
```

Pontos frágeis já identificados na leitura do código:

- `js/storage.js` roda `loadProgress()`/`updateGlobalStars()` no nível superior do arquivo (não dentro de um handler de evento), então precisa carregar **depois** de `mastery.js`, `revisao-espacada.js` e `navigation.js` já terem definido o que ele lê/muta. Isso funciona hoje só porque alguém ajustou a ordem manualmente — não há nenhuma declaração formal de dependência.
- `data/licoes.js` é injetado entre `audio-manager.js` e `teaching-engine.js` porque `teaching-engine.js` referencia o global `LESSONS` definido lá — também não documentado em comentário, só funciona por ordem.
- Existem dois arquivos de mesmo nome-base em pastas diferentes: `data/mapa-portugues.js` / `js/mapa-portugues.js` e `data/projeto-leitor.js` / `js/projeto-leitor.js` — hoje inofensivo, mas qualquer config de bundler que resolva por glob/basename precisa saber disso.
- `data/portugues-conteudo.js` referencia constantes definidas em `data/icones.js` (`ICON_TATU` etc.) diretamente dentro de literais de objeto — se a ordem for invertida, é `ReferenceError` na hora do parse.

## 5. Estado global

Não existe uma fonte única de verdade — o estado está espalhado em pelo menos 7 objetos globais, cada um declarado num arquivo, mutado por vários outros:

| Global | Declarado em | Mutado por |
|---|---|---|
| `state` (child, game, round, totalStars, provaMode, freePracticeMode, currentTrilha...) | `mastery.js` | quase todos os arquivos |
| `activityLevel` (nível 1–5 por atividade, 49 chaves fixas) | `mastery.js` | `game-loop.js`, `admin.js`, `storage.js` |
| `mastery` (histórico últimas 10 tentativas por atividade) | `mastery.js` | `mastery.js`, `admin.js` |
| `provaPassed` / `provaScores` | `mastery.js` | `game-loop.js`, `admin.js` |
| `reviewState` (revisão espaçada) | `revisao-espacada.js` | `revisao-espacada.js`, `admin.js` |
| `lessonState` | `teaching-engine.js` | só `teaching-engine.js` |
| `CHILD_INFO` | `mastery.js` | nunca mutado (leitura) |

Achado relevante: o objeto literal inicial de `state` (em `mastery.js`) **não declara** `revisaoMode`, `roundPlan`, `subgames`, `pools`, `usedSomLetters`, `characterIntroSeen`, `provaResults` nem `provaContainerId` — essas propriedades são criadas ad hoc em `game-loop.js`/`revisao-espacada.js` na primeira vez que são necessárias. Não existe um "shape" canônico de `state`; ele é construído incrementalmente em runtime dependendo de qual caminho de código roda primeiro. Isso importa muito para qualquer tentativa de tipar o estado (TypeScript) ou de espelhá-lo num schema de banco — o shape real só existe reconstruindo todos os pontos de mutação, não lendo a declaração inicial.

## 6. localStorage

Ponto positivo confirmado por leitura direta do código: **`js/storage.js` é o único ponto de acesso direto a `localStorage`** — exatamente 3 chamadas (`getItem`/`setItem`/`removeItem`), todas nesse arquivo. Nenhum outro dos 14 arquivos de `app/js/` toca `localStorage` diretamente; tudo passa por `saveProgress()`/`loadProgress()`/`clearProgress()`.

Chave única: `"ilhaAprendizProgresso"`, um blob JSON único contendo `{version, activityLevel, mastery, provaPassed, provaScores, reviewState, totalStars, savedAt}`. Existe um campo `STORAGE_VERSION = 1` com bail-out duro: se a versão salva não bater, `loadProgress()` **descarta 100% do progresso salvo** sem tentar migrar. Não existe nenhuma função de migração de schema — hoje qualquer mudança de formato teria que ou manter compatibilidade solta com `version:1` para sempre, ou apagar o progresso de quem já jogou.

O comentário do próprio arquivo documenta uma regra importante para qualquer migração futura: "mutar propriedade, nunca substituir a referência" — outros arquivos guardam referências diretas aos objetos (`activityLevel`, `mastery` etc.), então `loadProgress()` precisa alterar as propriedades desses objetos in-place, não trocar a variável por um objeto novo. Um `fetch`/carregamento assíncrono do Supabase que simplesmente reatribua essas variáveis quebra qualquer código que já tenha capturado a referência antiga.

## 7. Perfis

Sistema **hardcoded para exatamente 2 crianças, não um sistema de perfis real**:

- `CHILD_INFO` (`mastery.js`) é um literal com só as chaves `joaquim`/`benjamin`.
- `ilha_aprendiz.html` tem dois `<div class="child-card">` escritos direto no HTML com `onclick="selectChild('joaquim')"` / `selectChild('benjamin')`.
- `state.totalStars` inicializa como `{joaquim:0, benjamin:0}` — mais um lugar hardcoded.
- `storage.js`'s `loadProgress()` itera `["joaquim","benjamin"].forEach(...)` — uma **quarta** cópia hardcoded da mesma lista.

Adicionar uma terceira criança hoje exige editar 4 lugares diferentes sem nenhum registro central. Mais grave para a migração: **`activityLevel`, `mastery`, `provaPassed`, `provaScores` e `reviewState` não são particionados por criança de forma alguma** — são objetos globais únicos, só `state.totalStars` é de fato por-criança. Isso não é bug visível hoje porque Joaquim e Benjamin usam conjuntos de IDs de atividade disjuntos, mas é uma armadilha estrutural: não existe, nem conceitualmente, um `user_id`/`child_id` como chave estrangeira em nada. Qualquer schema real do Supabase precisa ser desenhado do zero para progresso-por-criança, não pode ser um "espelho" do localStorage atual.

## 8. Progresso

Nível por atividade (`activityLevel`), histórico de domínio (`mastery`), resultado do Desafio Final (`provaPassed`/`provaScores`), estado de revisão espaçada (`reviewState`) e estrelas (`state.totalStars`) — todos persistidos via `saveProgress()`, todos no mesmo blob único de `localStorage` (ver item 6). Existe desde 2026-08-16 (`docs/DECISOES.md`), antes disso o progresso se perdia ao fechar a aba.

## 9. Mastery

`mastery.js`: domínio é medido por array de até 10 booleans por atividade (`mastery[gameId ou "gameId:nível"]`), e a progressão de nível (1→5) usa `≥80% de acerto nas últimas 10 tentativas`, nunca contagem de rodadas — esse é um princípio obrigatório documentado em `CLAUDE.md` e confirmado no código (`masteryPercent()`, `isModuleUnlocked()`). `moduleStatus()` mistura, no mesmo lugar, cálculo de domínio e rótulos voltados a UI (strings tipo `"LOCKED"`/`"MASTERED"`) — não há separação entre "calcular estado de domínio" e "decidir como mostrar isso na tela".

## 10. Revisão espaçada

`js/revisao-espacada.js`: intervalos crescentes `[2, 5, 10, 21, 45]` dias, estado por atividade `{stage, lastReviewedAt}`, exposto na tela via o card "🔁 Revisão de Hoje". Existe desde 2026-08-16, sem estado próprio além do que já está no blob de `localStorage`.

## 11. Desafio Final

`game-loop.js` (`startProva`/`endProva`/`retryProva`) + constantes em `mastery.js` (`PROVA_QUESTIONS_PER_ACTIVITY`, `PROVA_PASS_OVERALL`, `PROVA_PASS_PER_ACTIVITY`). Completo e testado nos 21 módulos com nível — módulo N de Português só desbloqueia com módulo N-1 100% dominado **e** Desafio Final aprovado; em Matemática os 12 módulos não têm ordem obrigatória entre si. Essas duas regras diferentes (sequencial vs. independente) vivem no mesmo `isModuleUnlocked()`/`moduleStatus()` — importante não confundir as duas ao desenhar o schema de "módulo desbloqueado" no banco.

## 12. Mapas

`js/mapa-portugues.js` (18 KB) — a visualização "Ilha das Letras" não guarda estado próprio: deriva 100% de `moduleStatus()` (mastery.js) e de coordenadas fixas (`PT_MAPA_REGIOES`, em `app/data/mapa-portugues.js`), estimadas a olho, não medição exata de pixel (`docs/ARQUITETURA.md`). Responsividade para telas de celular (360–430px) já tem tratamento específico com `overflow:auto` + canvas interno — um dos poucos pontos do app já pensado para mobile antes desta fase.

## 13. Áudio/TTS

Arquitetura em 3 camadas:

1. **`utils.js`'s `speak()`** — TTS nativo via Web Speech API (`SpeechSynthesisUtterance`, `pt-BR`), é o caminho *padrão/legado* usado direto por ~55 das ~60 funções `render*` das duas atividades (chamado inline via `onclick="speak('...')"`).
2. **`media-catalog.js`** — funções puras que calculam caminhos de asset (`mediaFonetica`, `mediaLiaVoice`, `mediaCharacterVideo`, `mediaSfx`), incluindo `mediaFileName()`, que faz normalização NFD + substituição especial `ç→ss` (para não colidir "ÇA" e "CA" no mesmo nome de arquivo depois de tirar acento) — uma regra deliberada, documentada, que qualquer bucket do Supabase Storage precisa replicar exatamente.
3. **`audio-manager.js`** — o `AudioManager`, único módulo real do app (IIFE com estado privado), usado hoje só pela atividade "Monte a Sílaba"/"Digite a Palavra" (Módulo 1 de Português). Toca o MP3 real com um timeout de segurança (`GRACE_MS`, ajustado de 300ms → 1800ms nesta mesma sessão de trabalho por causa de latência de rede em mobile/GitHub Pages) antes de cair para TTS como fallback.

**Achado de bug ainda não corrigido, descoberto na leitura desta auditoria**: `AudioManager.setTtsAllowed(false)` é chamado no início de `renderSilabas()` para implementar a proibição de TTS decidida nesta mesma sessão ("Monte a Sílaba" não pode usar TTS, só áudio real da Lia). Essa flag é uma variável de closure **compartilhada por toda a sessão do app**, e nada no código chama `setTtsAllowed(true)` de volta em nenhum outro lugar. Ou seja: **uma vez que a criança visita "Monte a Sílaba" uma vez, o TTS fica desligado para o resto da sessão**, inclusive em atividades que dependem só de `speak()` como única narração (a maioria das ~55 restantes). Isso é uma regressão funcional real, não uma decisão de design — vale corrigir antes ou durante a Fase 1, fora do escopo desta auditoria (que não altera código).

Só 1 das ~53 atividades usa o pipeline `AudioManager`; as demais dependem 100% de `speak()` sem nenhum fallback caso o navegador não suporte Web Speech API (`try/catch` silencioso — sem indicação visual pra criança).

## 14. Vídeo

Vive dentro de `audio-manager.js` (decisão documentada em comentário: não vale a pena um `media-manager.js` separado ainda). `mountCharacterIntro()` monta um `<video>`, com dois fallbacks explícitos: autoplay bloqueado → botão "▶️ Toque para começar" com timeout de 4s que segue em frente mesmo sem toque; qualquer outro erro → cai direto para um fallback visual estático (emoji/SVG). Convenção de nome: `{personagem}-{estado}.mp4`, hoje sempre `estado="intro"`.

**Achado de bug latente de case-sensitivity, ainda não confirmado como já ocorrido**: diferente de todas as outras funções `media*`, `mediaCharacterVideo()` **não** passa `characterId` por `mediaFileName()` — insere a string crua no caminho. Se algum dado de conteúdo (`character` em `WORDS`) algum dia tiver letra maiúscula ou inconsistência de caixa, o caminho de vídeo gerado não vai ser normalizado como os demais, e no GitHub Pages (case-sensitive) isso 404a silenciosamente. Vale conferir contra os nomes de arquivo reais de vídeo produzidos (87/87) antes da Fase 1.

## 15. Assets

Estrutura documentada em `docs/audio/MEDIA_GUIDELINES.md`: `app/assets/{maps, video/personagens/<id>/, audio/{lia,fonetica,personagens,sfx}/, images/characters/}`, convenção kebab-case minúsculo sem acento, regra explícita de "não criar pasta vazia". MP3 128kbps/44.1kHz é o único formato aceito. Um achado de performance documentado e não resolvido: `app/assets/maps/ilha-das-letras.webp` tem 2,4 MB sem otimização (faltou ferramenta de recompressão no ambiente em que foi gerado) — candidato óbvio a otimizar antes de qualquer deploy PWA/mobile sério, já que impacta tempo de carregamento em rede móvel.

Nota de rastreabilidade documental: `docs/audio/VOZ_LIA.md` nunca teve o campo "Voice ID"/"modelo ElevenLabs" preenchido, mesmo com a produção real das 87 palavras já concluída — não há registro escrito de qual voz/modelo exato gerou o áudio já em produção, o que é um risco se for preciso gerar áudio adicional depois com a mesma voz.

## 16. Testes

34 arquivos `testes/qa_test_*.js` (Node + jsdom, sem Jest/Mocha), rodados individualmente com `node testes/qa_test_X.js` ou todos juntos com `npm test` (= `node testes/_run_all.js`, que roda cada arquivo em processo filho isolado e agrega um resumo `RESUMO DA SUITE`). Único dependency de dev: `jsdom ^24.0.0`.

Todos usam o mesmo carregador central (`testes/_util/load_app_html.js`): lê `app/ilha_aprendiz.html`, faz *inline* manual de cada `<link>`/`<script src>` local via regex, e roda o HTML resultante com `new JSDOM(html, {runScripts:'dangerously', ...})`. Esse inliner **só entende `<script src>` clássico** — qualquer migração para `<script type="module">`/imports do Vite quebra essas regexes e exige trocar a estratégia de teste (rodar contra um servidor de dev real, ou usar Playwright).

Falhas conhecidas e toleradas (confirmadas lendo o código, batem com `CLAUDE.md`): `qa_test_regression.js` (ruído de `setTimeout` pendente no teardown do jsdom, não falha de asserção real), `qa_test_svg.js` (flake estatístico documentado — depende de sorteio de palavra específica, mitigado subindo de 100 para 400 iterações), `qa_test_typing.js` (intermitência ocasional, confirmada por teste A/B nesta mesma sessão como pré-existente, não causada pelo trabalho recente de TTS/GRACE_MS).

Gaps de cobertura: `game-loop.js`, `navigation.js`, `mastery.js` e `utils.js` — os módulos mais "de engine/compartilhados" — não têm arquivo de teste dedicado; são exercitados implicitamente por quase todos os outros testes. O próprio `qa/CHECKLIST_QA.md` já reconhece esse risco e recomenda rodar a suíte inteira 2–3 vezes depois de tocar em código compartilhado (`MODULE_CONTAINERS`, `pickWeightedByLevel`, `isModuleUnlocked`, `activitiesFullyMastered`), em vez de apontar pra um teste isolado — ou seja, é uma lacuna já conhecida e mitigada por processo, não por cobertura automatizada.

## 17. Pontos de acoplamento

O agrupamento mais fortemente acoplado do app é **`mastery.js` + `game-loop.js` + `navigation.js` + `activities-portugues.js`/`activities-matematica.js`** — compartilham o mesmo `state` mutável e o mesmo par `activityLevel`/`mastery` sem nenhuma fronteira. `renderRound()` (`game-loop.js`) é um `switch` de ~60 casos chamando por nome toda função `render*` das duas atividades, que por sua vez chamam de volta `registerAnswer()`/leem `activityLevel` — um ciclo bidirecional completo entre 3 arquivos sem nenhuma interface.

Outros pares fortemente acoplados: `storage.js` ↔ `mastery.js`+`revisao-espacada.js` (mutação por referência, ver item 6); `admin.js` ↔ praticamente tudo (é um hub de leitura/escrita sem encapsulamento); `mapa-portugues.js` ↔ `navigation.js`+`mastery.js`+`teaching-engine.js`+`game-loop.js` (reaproveita deliberadamente `moduleStatus()`/`openAtividades()` para não duplicar lógica de domínio — bom em princípio, mas significa que não dá pra extrair/testar isoladamente).

Numa futura divisão em módulos ES/Vite, esse núcleo (mastery+game-loop+navigation+activities) provavelmente precisa virar um único "motor de jogo" coeso em vez de 5 módulos separados — tentar separá-los cedo demais é o tipo de refatoração de alto risco que o plano mestre já recomenda evitar numa única fase.

## 18. Dívida técnica

Lista consolidada, por ordem de impacto:

1. **Bug de TTS globalmente desligado** após visitar "Monte a Sílaba" uma vez (item 13) — funcional, silencioso, provavelmente já afeta o uso real.
2. **190+ funções/objetos globais sem nenhum namespacing** — qualquer nome novo repetido (`render*`, um helper genérico como `visual`) sobrescreve silenciosamente em `window`, sem erro de build.
3. **Handlers inline (`onclick="..."`) espalhados por todo HTML gerado via `innerHTML`** — dezenas de ocorrências em cada arquivo de atividades, incompatível por construção com qualquer Content-Security-Policy que não permita `unsafe-inline`; exige reescrita ampla se/quando migrar para um framework de componentes.
4. **Escaping manual de aspas para strings interpoladas em `onclick="speak('...')"`** (`.replace(/'/g,"\\'")`) — frágil, não trata todos os casos, é sintoma do mesmo problema do item 3.
5. **Ausência de schema/validação de integridade referencial** nos dados: `LESSONS[act.id]`, `moduleId` no mapa vs `id` em `registro-modulos.js`, chaves de `mastery` — tudo amarrado só por convenção de nome, sem checagem automática; um `id` digitado errado falha silenciosamente (`undefined`), não com erro.
6. **Vazamento de código BNCC na tela da criança**: confirmado por leitura direta — `desc` de pelo menos 38 atividades entre `matematica-atividades.js` e `portugues-atividades.js` termina com `"(EF01MA01)"` etc., e esse mesmo `desc` é interpolado no card que a criança toca (`navigation.js`'s `renderAtividades()`). Isso viola o princípio obrigatório do próprio `CLAUDE.md` ("BNCC não deve poluir a interface infantil") — é um achado desta auditoria, não algo já sinalizado antes.
7. **`STORAGE_VERSION` sem estratégia de migração** — qualquer mudança de schema no localStorage hoje apaga o progresso salvo em vez de migrar (item 6).
8. **Asset de mapa de 2,4 MB sem compressão** (item 15).
9. **Flag de dev `?calibrar=1`** deixada ativa em código de produção (`mapa-portugues.js`) — inofensiva (só `console.log`), mas é ferramenta de desenvolvedor sem nenhum corte de build.
10. **Documentação viva desatualizada em cascata**: `BRIEFING.md` não menciona a frente audiovisual em nenhuma linha; `ROADMAP.md` ainda descreve "assets ainda não adicionados" quando o piloto VACA já estava 100% completo há dias, e nenhum dos documentos lidos reflete o estado real de 87/87 palavras produzidas nesta mesma sessão de trabalho; `ECOSSISTEMA.md` tem trechos ainda mais antigos contradizendo `ROADMAP.md` sobre persistência de progresso. Nenhum é um problema de código, mas juntos criam risco real de alguém (inclusive uma sessão futura de Claude) tomar decisão baseada em status errado.

## 19. Código duplicado

Achados concretos de duplicação (não apenas padrão repetido intencionalmente):

- **Geração de distratores** (`let wrongs = pickRandom(...); while(wrongs.length < 2){...}`) repetida quase idêntica em pelo menos 15 funções de `activities-matematica.js` e em `activities-portugues.js`, nunca fatorada num helper `pickDistractors()`.
- **Boilerplate de renderização de múltipla escolha** (montar `.prompt`, botão de TTS, `#opts`, criar `<button>` por opção com `onclick=()=>registerAnswer(...)`) repetido de forma quase idêntica em mais de 50 funções `render*` nos dois arquivos de atividades — nenhuma abstração compartilhada tipo `renderMultipleChoice(stage, {prompt, options, correct})`.
- **`renderDigitePalavra` reimplementa** a mesma lógica de resposta digitada que `renderTypedAnswer` já centraliza para outras 3 funções — não reaproveita o helper existente.
- **Três variáveis módulo-level quase idênticas** (`currentParlendaText`, `currentCuriosityText`, `currentStoryText`) resolvendo o mesmo problema (escapar aspas pra interpolar em `onclick`) de forma copiada 3 vezes em vez de uma solução única.
- **`normalizeTyped` (activities-portugues.js) duplica parte da lógica de `mediaFileName` (media-catalog.js)** — normalização de acento/caixa com regras ligeiramente diferentes entre as duas. Essa duplicação é **deliberada e documentada** (comentário do próprio `media-catalog.js`: evitar dependência de ordem de carregamento entre os dois arquivos) — é dívida técnica consciente, não descuido, e vale preservar essa separação conceitual mesmo numa reescrita, só resolvendo via um pacote compartilhado sem acoplamento de ordem de import.

## 20. Funções globais

Inventário completo por arquivo está registrado no material de apoio desta auditoria; o número aproximado é **190+ declarações de função de nível superior** somando os 15 arquivos de `app/js/`, mais dezenas de `const` de estado/dados. Destaque de risco: 19 das 26 funções de `mastery.js` (`module1FullyMastered`...`module7FullyMastered`, `mm1FullyMastered`...`mm12FullyMastered`) são essencialmente o mesmo one-liner repetido à mão em vez de gerado a partir de dados — um sinal claro de poluição de namespace por padrão copy-paste em vez de fábrica de função. Nenhuma colisão de nome real foi encontrada hoje (o projeto teve sorte, não disciplina) — mas não existe nenhum mecanismo (linter, build) que impediria uma colisão silenciosa amanhã.

## 21. Restrições técnicas atuais

- Sem build step, sem transpilador, sem bundler.
- Scripts clássicos, não ES modules — dependência de ordem de `<script>` no HTML é o único "sistema de módulos" que existe.
- Conteúdo como `const` de JS, não JSON/fetch — carregado de forma síncrona, disponível imediatamente após o parse do script.
- Precisa continuar abrindo com duplo-clique (`file://`), sem servidor — restrição de produto explícita em `CLAUDE.md`, não apenas técnica.
- Nenhuma dependência de produção; `jsdom` é a única dependência (de teste).
- Suíte de testes roda com `node`/`npm test`, sem infraestrutura de CI visível no repositório (nenhum workflow do GitHub Actions foi lido nesta auditoria — vale confirmar se existe).

## 22. Tudo que quebraria ao migrar para Vite

- **O inliner de teste (`testes/_util/load_app_html.js`)** só entende `<script src>` clássico — regex não reconhece `type="module"`/`import`; a estratégia de teste inteira (rodar HTML flatten em jsdom) precisa mudar para servir contra um dev server real ou trocar para Playwright.
- **190+ globais compartilhados via `window` sem `import`/`export`** — converter ingenuamente cada arquivo pra `type="module"` quebra na hora, porque nada exporta nada; a saída seguindo o princípio de "menor mudança segura" é envolver o bundle legado inteiro num único módulo que atribui tudo a `window` primeiro, e só depois ir convertendo arquivo por arquivo pra imports/exports explícitos.
- **Ordem de carregamento é o grafo de dependência real** (item 4) — ao mover pra Vite, essa ordem implícita precisa virar imports explícitos; há pelo menos 2 dependências de ordem não documentadas em comentário (`storage.js`, `data/licoes.js`) que só vão aparecer como `ReferenceError` na hora da conversão.
- **Caminhos de asset como string literal** (`"assets/..."` em `mapa-portugues.js`, `MEDIA_BASE = "assets/"` em `media-catalog.js`) presumem que o app sempre roda a partir da própria raiz com uma pasta `assets/` irmã — Vite com hashing de asset e `import.meta.env.BASE_URL` exige reescrever todos esses caminhos para o mecanismo de asset do Vite (pasta `public/` ou `new URL(..., import.meta.url)`).
- **Handlers inline (`onclick="..."`) em HTML estático e em `innerHTML` gerado** — não quebram tecnicamente com Vite (Vite não impõe CSP por si só), mas são o tipo de coisa que travaria qualquer endurecimento de segurança futuro (CSP sem `unsafe-inline`) — vale já não piorar esse padrão em código novo.
- **Flag de dev `?calibrar=1`** (item 18) deveria virar um `import.meta.env.DEV` real em vez de checagem de URL em runtime.

## 23. Tudo que quebraria ao adicionar Supabase

- **`localStorage` como fonte única de verdade, sem particionamento por criança** (itens 6-7) — o schema de progresso precisa ser desenhado do zero para Supabase (tabelas com `child_id`/`user_id`), não pode ser um espelho 1:1 do blob atual.
- **Mutação por referência em vez de reatribuição** (`storage.js`, item 6) — qualquer código novo que busque dados do Supabase e reatribua `activityLevel`/`mastery` por completo (em vez de mutar in-place) quebra silenciosamente qualquer outro arquivo que já tenha capturado a referência antiga do objeto.
- **Nenhuma validação de integridade referencial hoje** (item 18.5) — migrar pra um banco relacional é uma boa oportunidade de finalmente impor FKs reais, mas os dados de origem (JS consts) não têm nenhuma garantia prévia de que os IDs realmente batem; é preciso auditar/validar antes de popular tabelas.
- **Conteúdo "executável", não só dados** — `licoes.js` guarda `html: () => \`...\`` / `render: () => \`...\`` como funções JS que retornam markup com `onclick` embutido. Isso não é serializável como está; virar linhas de banco exige separar o "template/markup" (fica em código) do "conteúdo real" (números, texto falado, resposta certa) — é reautoria real, não exportação direta.
- **Tabelas geradas/derivadas em runtime** (ex.: `ALL_MODULES_BENJAMIN = PT_MODULES_BENJAMIN.concat(MATH_MODULES_BENJAMIN)`) presumem que as fontes já existem de forma síncrona no momento do parse — buscar essas fontes do Supabase de forma assíncrona exige transformar esses `const` derivados em função/seletor recalculado depois que os dados chegam, não um valor fixo calculado uma vez no load do script.
- **Vazamento de BNCC no campo `desc`** (item 18.6) é uma boa oportunidade de já corrigir durante a modelagem do schema — separar `desc` (visível à criança) de um campo `bncc_code` (só admin/pais) em vez de portar o campo conflated como está.
- **Chaves de API (ElevenLabs) nunca devem ir para o repositório** — já é regra documentada em `MEDIA_GUIDELINES.md`; ao introduzir Supabase (que também vai ter chaves), vale já centralizar tudo em variável de ambiente/secret manager desde o primeiro dia, não só para o ElevenLabs.
- **Pressuposto atual de app 100% offline/estático** (`media-catalog.js` trata arquivo de mídia ausente como fallback esperado, não erro) — precisa decisão explícita de produto: o app vai continuar funcionando sem rede (cache local/PWA) mesmo depois de ter conteúdo no Supabase, ou vai exigir conexão? Hoje essa decisão nunca foi tomada porque nunca precisou ser.

## 24. Tudo que precisa permanecer retrocompatível

Princípios obrigatórios do produto (`CLAUDE.md`), que qualquer fase de migração precisa preservar sem discussão adicional:

- Ensinar antes de avaliar quando a habilidade exigir conhecimento novo (Motor de Ensino).
- Nunca penalizar erro retirando recompensa — sem trava, sem tirar estrela, sem resetar progresso.
- Progressão por domínio (≥80% nas últimas 10 tentativas), nunca por quantidade de exercícios.
- Domínio e retenção são métricas diferentes — não confundir "nível 5" com "vai lembrar em 3 meses" (é literalmente o motivo de existir revisão espaçada).
- Códigos BNCC nunca visíveis na tela da criança — **hoje já violado** (item 18.6), precisa ser corrigido, não apenas preservado.
- Trilha de Português sequencial (módulo N precisa de módulo N-1 100% dominado + Desafio Final aprovado); trilha de Matemática independente (12 módulos sem ordem obrigatória) — as duas regras não podem ser confundidas ao desenhar o schema de módulos no banco.
- Progresso salvo entre sessões (existe desde 2026-08-16) — não pode regredir para "perde tudo ao fechar a aba" durante a transição.
- Suíte de testes inteira roda antes de qualquer entrega — falha nova é bloqueante, falha conhecida/documentada é tolerada.
- Trabalho mecânico (`claude/REGRAS_PERMANENTES.md`): commit antes de mudança grande, nunca depois; decisão de arquitetura relevante registrada em `docs/DECISOES.md` no momento em que é tomada; mudança de status de frente refletida em `docs/ROADMAP.md` no mesmo momento; nunca reescrever entradas antigas de `DECISOES.md`.
- Convenção de nomenclatura de mídia (kebab-case, minúsculo, sem acento, `ç→ss` em nome de arquivo) — qualquer bucket de storage remoto (Supabase Storage) precisa replicar essa convenção exatamente, senão quebra o mapeamento que `media-catalog.js` já calcula hoje.

## 25. Riscos relacionados a mobile/PWA

- **Case-sensitivity Windows vs. Linux** (item 3) já causou um incidente real em produção (164 arquivos). Qualquer pipeline de deploy futuro (Vercel/Cloudflare/Netlify sobre Vite) roda em Linux — o risco continua vivo para qualquer asset novo até existir uma checagem automática (lint de nomes de arquivo ou build que normalize tudo).
- **Autoplay de áudio/vídeo em mobile**: `AudioManager.unlockAudio()` é chamado uma única vez, dentro de `selectChild()` — o primeiro gesto de usuário garantido da sessão. Se um fluxo futuro (deep link, PWA restaurando estado direto numa tela de jogo, "continuar de onde parei") pular a tela de seleção de criança, autoplay de áudio/vídeo falha silenciosamente sem nenhum caminho de recuperação, porque a flag de "desbloqueado" é single-shot.
- **Sem `<source>` alternativo de vídeo** — só `.mp4` hardcoded, sem fallback de formato/codec; não crítico hoje (mp4 é universal), mas vale revisar ao empacotar como PWA/app com Capacitor futuramente.
- **Web Speech API sem detecção de capacidade real** — `speak()` engole erro em `try/catch` silencioso; um WebView embutido (Capacitor) sem suporte a Web Speech deixaria ~55 das atividades mudas sem nenhuma indicação visual para a criança ou o responsável.
- **Asset de mapa não otimizado (2,4 MB)** pesa desproporcionalmente em conexão móvel — candidato a correção antes de qualquer publicação como PWA instalável.
- **Nenhuma menção a PWA em nenhum documento vivo hoje** (`ARQUITETURA.md`, `BRIEFING.md`, `ROADMAP.md`, `ECOSSISTEMA.md`) — não é um risco técnico em si, mas confirma que PWA é, de fato, trabalho novo a ser desenhado do zero na fase correspondente, não algo que já existe parcialmente e só precisa ser "ligado".
- **Segunda sessão de Claude Code operando direto no repositório via VS Code** (observado nesta mesma sessão de trabalho: commits aparecendo no `git log` que esta sessão não fez) — não é um risco técnico do produto, mas é um risco operacional real para a disciplina "uma fase por vez" do plano mestre: se duas sessões trabalharem em paralelo sem coordenação, é fácil uma delas pular a ordem de fases ou sobrescrever decisão da outra. Vale, antes de iniciar a Fase 1 de fato, garantir que só uma sessão está ativa na transformação comercial por vez.

---

## Sequência de migração mínima e segura

Ordem pedida pelo usuário, com o motivo de cada passo vir antes do seguinte — cada seta é uma fase reversível, testável e comitável isoladamente, seguindo a disciplina já estabelecida no plano mestre (AUDITAR → PLANEJAR → APROVAR → IMPLEMENTAR → TESTAR → VALIDAR → COMMIT → PRÓXIMA FASE):

**1. Protótipo atual → Vite/HTTP**
Envolver o bundle legado inteiro (todos os 24 `<script>` atuais) como um único ponto de entrada Vite que preserva a ordem de carregamento existente e continua atribuindo tudo a `window`, sem nenhuma reescrita de lógica de jogo. Objetivo único desta fase: trocar "abrir arquivo" por "servir via `vite dev`/`vite build` + servidor HTTP estático", sem quebrar nenhum teste existente e sem separar módulos de verdade ainda. O inliner de teste (`testes/_util/load_app_html.js`) precisa ser adaptado para apontar pro output do Vite (ou trocado por um teste que sobe o dev server) nesse mesmo passo — não depois.

**2. Ambientes**
Só depois que o app já roda sob Vite/HTTP: introduzir a distinção dev/staging/prod (hoje inexistente — é sempre "o arquivo local" ou "o GitHub Pages"). Variáveis de ambiente (`import.meta.env`) para qualquer configuração futura (URL do Supabase, chaves públicas), preparando o terreno sem ainda conectar nada externo.

**3. Supabase (schema + Storage, sem trocar a fonte de leitura ainda)**
Desenhar e criar o schema real (tabelas de conteúdo pedagógico, progresso por criança com FK de verdade, bucket de Storage espelhando a convenção de nomenclatura de mídia já documentada) — mas o app continua lendo dos `const` locais e escrevendo no `localStorage`. Esta fase é só infraestrutura + validação de schema contra o conteúdo real existente (útil, inclusive, pra pegar qualquer inconsistência de ID hoje só garantida por convenção).

**4. Auth do responsável**
Adicionar login do responsável (Supabase Auth) como camada nova, sem ainda depender dela para nada essencial — o app precisa continuar funcionando sem conta (mesmo comportamento offline atual) até a auth estar validada em uso real.

**5. Perfis infantis**
Substituir o `CHILD_INFO` hardcoded de 2 chaves por perfis reais associados à conta do responsável (sem e-mail/login próprio da criança, seguindo o princípio de minimizar PII infantil já definido no plano mestre). Esta é a fase que resolve o problema estrutural do item 7/23: dar a cada criança um `child_id` real, ao invés dos 4 lugares hardcoded hoje.

**6. Progresso cloud**
Só depois que perfis infantis existem de verdade: trocar `saveProgress()`/`loadProgress()` para escrever/ler do Supabase, mantendo `localStorage` como cache operacional (nunca apagar o local antes de confirmar a escrita remota, conforme já é princípio do plano mestre). É o ponto onde a mutação-por-referência (item 6/23) precisa ser resolvida com cuidado, para não quebrar os módulos que hoje capturam a referência direta dos objetos de estado.

**7. PWA**
Manifest, service worker, ícones, e validação de instalação/autoplay em mobile real (Chrome Android, Safari iOS) — só depois que progresso cloud já está estável, porque testar PWA junto com uma migração de storage ainda instável mistura duas fontes de bug difíceis de separar.

**8. Monetização**
Último passo, só depois que toda a base (conta, perfis, progresso cloud, PWA) está validada com uso real — decisão de gateway (Stripe vs. Mercado Pago) e modelo (assinatura vs. compra única) ficam de fora do escopo técnico desta auditoria.

Em paralelo a essa sequência, e sem bloquear nenhuma fase dela, valem duas correções pequenas e independentes assim que houver aprovação para tocar em código: o bug de TTS permanentemente desligado após "Monte a Sílaba" (item 13) e o vazamento de código BNCC na tela da criança (item 18.6/24) — nenhum dos dois depende de Vite ou Supabase, e os dois já violam princípios obrigatórios do próprio `CLAUDE.md` hoje.
