# Changelog — Ilha Aprendiz

*Histórico de mudanças reais entregues, em ordem cronológica reversa (mais recente primeiro). Diferente do `DECISOES.md` (o "por quê") e do `ROADMAP.md` (o "o que vem"), este é o "o que já mudou, quando". A partir de 2026-08-16 este arquivo é alimentado a cada mudança relevante; o histórico anterior a essa data não foi reconstruído em detalhe — está espalhado pelos documentos em `pedagogia/` e no `git log` a partir do commit inicial.*

---

## 2026-08-17 — Ilha das Letras, rodada 2: marcadores compactos, popover e "próximo destino"

- Hotspots trocam cards grandes (nome+badge sempre visíveis) por marcadores compactos: círculo com ícone da região + anel de progresso (`conic-gradient`) + selo de canto só nos estados extremos (🔒/✓/⭐) — o número "X/Y" some do mapa.
- Nome, status detalhado e o botão de ação passam pra um popover sob demanda (`:hover`/`:focus-within`/toque) — clicar no marcador abre o popover, não navega mais direto; o CTA dentro dele é quem navega.
- Novo `computeDestinoAtual()`/`regionIsRecommendedToday()` real (era stub sempre `false`) — destaca a próxima região a explorar, sem tocar em `js/mastery.js`; subtítulo do mapa mostra "Próximo destino: {região}" dinamicamente.
- `renderAtividades()` mostra o nome da região ("🌳 Floresta do Alfabeto") em vez do nome curricular quando vem do mapa — dado oficial em `registro-modulos.js` intocado, painel/admin inalterados. Matemática sem mudança nenhuma.
- `testes/qa_test_mapa_portugues.js` reescrito (52 checagens, muitas novas — popover, destino atual, nome amigável). Suíte completa: mesmo resultado da baseline, nenhuma falha nova.
- Responsividade mobile (390px) segue como hipótese não confirmada com navegador real — decisão de manter `contain`+`%` nesta rodada, documentada em `docs/DECISOES.md`.

## 2026-08-16 — Ilha das Letras: mapa interativo de Português (MVP)

- Grade de Módulos vira mapa de ilha ilustrado, só pra Português — Matemática inalterada.
- `data/mapa-portugues.js` + `js/mapa-portugues.js` novos: 8 hotspots (1 por módulo), 5 estados visuais (LOCKED/AVAILABLE/LEARNING/MASTERED/DESAFIO_APROVADO) reaproveitando `moduleStatus()` (extraída de `renderModulos()` pra `js/mastery.js`, usada pelas duas telas agora).
- Módulo 8 (Castelo dos Livros) ganhou tela própria (`screen-projeto-leitor`, `js/projeto-leitor.js`, `data/projeto-leitor.js`) com o conteúdo de `pedagogia/MODULO8_PROJETO_LEITOR.md` — não é jogo, é leitura em família.
- Ponto de extensão pra "Aventura de Hoje" preparado (`regionIsRecommendedToday`, hoje sempre `false`, não implementado).
- CSS novo (`.mundo-map`, `.map-hotspot`) — container de proporção travada + hotspots em `%`, sem `@media` (primeira peça verdadeiramente responsiva/espacial da UI).
- Asset da imagem incorporado no mesmo dia (`app/assets/maps/ilha-das-letras.webp`, 1536×1024) — coordenadas dos 8 hotspots recalibradas contra o arquivo real. Pendência: arquivo pesado (2,4MB), sem ferramenta de recompressão disponível neste ambiente.
- `testes/qa_test_mapa_portugues.js` novo (32 checagens). Suíte completa (33 arquivos): mesmo resultado da baseline, `qa_test_nav_tree.js` sem regressão.
- Planejado via modo de planejamento formal (plano revisado e aprovado pelo Júlio com 3 ajustes antes do código começar). Detalhe completo em `docs/DECISOES.md`.

## 2026-08-16 — Correção dos 12 achados da auditoria BNCC

- **EF01MA13** (Formas no Mundo): rótulo corrigido (EF01MA13 real + "além" antecipando EF02MA14), conteúdo mantido.
- **EF01MA11/12** (Onde Está?/Siga o Mapa): vocabulário de "Onde Está?" corrigido pra "à frente/atrás", enunciado estabelece o referencial.
- **EF01MA01** (Quantos Tem?): nova variação "número como código" (banco `MM1_CODE_EXAMPLES`).
- **EF01MA09** (Organize por Tamanho): 2 variações novas, cor e forma (`mm3OddOneOutRound`).
- **EF01LP17/20/22/24** (Módulo 4/5 PT): textos corrigidos; gênero "legenda de foto" adicionado a `FUNCTIONAL_TEXTS`.
- 7 achados menores: texto corrigido em todos; 2 (EF01MA14, EF01MA16) só na documentação, gap de conteúdo registrado como pendência honesta.
- 12 checagens de teste novas (`qa_test_math_m1.js`, `qa_test_math_m3.js`, `qa_test_math_m7.js`, `qa_test_modulo4.js`), verificando o conteúdo corrigido especificamente.
- Suíte completa revalidada a cada mudança — mesmo resultado da baseline em todas.

## 2026-08-16 — Comparação do currículo próprio contra o texto oficial da BNCC

- `qa/auditorias/auditoria_bncc_oficial.md` novo: comparação código a código das 48 habilidades (26 EF01LP + 22 EF01MA) contra `pedagogia/bncc-oficial/`.
- 5 divergências reais encontradas (destaque: EF01MA13 usa a lista de formas do 2º ano) + 7 achados menores. Maioria dos códigos bate bem.
- Nenhuma correção aplicada ainda — só o relatório. Próximo passo depende de decisão do Júlio.

## 2026-08-16 — Documento oficial da BNCC alocado no projeto

- `pedagogia/bncc-oficial/` novo: PDF oficial completo (MEC, 600 páginas) + recortes extraídos de Língua Portuguesa (1º/2º anos) e Matemática (1º ano) + README explicando fonte, método de extração e limitações conhecidas.
- Contagem de códigos EF01LP (26) e EF01MA (22) no documento bate com o que os índices próprios já afirmavam.
- Comparação item a item contra `pedagogia/CURRICULO_BNCC_PORTUGUES.md`/`CURRICULO_BNCC_MATEMATICA.md` ainda não feita — próximo passo, por pedido explícito do Júlio de separar "alocar" de "comparar".

## 2026-08-16 — Trava de ritmo por bimestre (item 3 do roadmap)

- `js/ritmo-bimestre.js` novo: mapeia mês do calendário pro bimestre aproximado (1-4), compara contra o bimestre de cada módulo de Matemática.
- Selo "🗓️ Adiantado" no card do módulo (`renderModulos`) e resumo agregado no card da trilha (`renderMaterias`) — só em Matemática, só informativo, nenhum módulo é bloqueado.
- `testes/qa_test_ritmo_bimestre.js` novo (23 checagens). Suíte completa: 31/32 arquivos limpos, mesma falha já conhecida.
- Decisão de formato (referência vs. bloqueio) documentada com justificativa completa em `docs/DECISOES.md`.

## 2026-08-16 — Revisão espaçada (item 2 do roadmap)

- `js/revisao-espacada.js` novo: ciclo de revisão por estágio (0-4), intervalos 2/5/10/21/45 dias.
- Card "🔁 Revisão de Hoje" em `renderAnoLetivo()`, visível só quando há atividade vencida.
- Hooks: `endSession()` registra atividade recém-dominada no ciclo; `nextRound()`/`registerAnswer()` ganharam o modo `revisaoMode` (pontuação isolada, não mexe em `mastery`); `adminReset`/`adminResetAll` limpam o ciclo também.
- `js/storage.js` estendido pra persistir `reviewState`.
- `testes/qa_test_revisao_espacada.js` novo (38 checagens). Suíte completa: 30/31 arquivos limpos, mesma falha já conhecida.
- Decisões de design documentadas em `pedagogia/REVISAO_ESPACADA.md` e `docs/DECISOES.md`.

## 2026-08-16 — Persistência de progresso (item 1 do roadmap)

- `js/storage.js` novo: `saveProgress()`/`loadProgress()`/`clearProgress()` via `localStorage`, formato versionado.
- Persiste `activityLevel`, `mastery` (histórico completo, não resumido), `provaPassed`, `provaScores` e `state.totalStars`.
- Hooks em `js/game-loop.js` (fim de rodada com mastery, fim de sessão, fim de Desafio Final) e `js/admin.js` (`adminReset`, `adminResetProva`, `adminResetAll`).
- Fechar a aba não zera mais o progresso — reabrir volta pra tela de seleção de criança com nível/domínio/Desafio Final/estrelas restaurados. Não restaura a tela/rodada exata em que a criança estava (decisão deliberada, ver `docs/DECISOES.md`).
- `testes/qa_test_persistencia.js` novo (26 checagens). Suíte completa: 29/30 arquivos limpos, mesma falha já conhecida.

## 2026-08-16 — Modularização de `app/ilha_aprendiz.html`

- Arquivo único (~5.600 linhas) dividido em `css/app.css`, 7 arquivos em `data/` e 8 em `js/` — `ilha_aprendiz.html` cai pra 175 linhas.
- `<script src>` clássico (não `type="module"`) + conteúdo como `const` (não JSON via `fetch`) — o app continua abrindo com duplo-clique (`file://`), sem servidor.
- Verificado em duas camadas: reconstrução byte-a-byte/por-conjunto contra o arquivo anterior (zero perda de conteúdo), e suíte de 29 testes com o mesmo resultado da baseline em cada fase (CSS, depois dados+lógica).
- Detalhe completo em `docs/ARQUITETURA.md` e `docs/DECISOES.md`.

## 2026-08-16 — Infraestrutura de teste (groundwork da modularização)

- `package.json` + `jsdom` (devDependency) criados — não existiam antes.
- `testes/_util/load_app_html.js`: helper compartilhado que substitui o `/tmp/ilha_aprendiz.html` hardcoded nos 29 arquivos de teste, e já sabe achatar `<link>`/`<script src>` externos de volta pra inline (preparado pra quando o app virar multi-arquivo).
- `testes/_run_all.js`: roda a suíte inteira e imprime um resumo agregado (`npm test`).
- Baseline confirmada: 28/29 arquivos limpos, 1 falha conhecida (`qa_test_regression.js`).
- Nenhuma linha de `app/ilha_aprendiz.html` foi alterada nesta entrega — só a forma como os testes carregam o arquivo.

## 2026-08-16 — Reorganização estrutural do projeto

- Pasta de trabalho reorganizada: `Ilha Aprendiz/` → `ilha-aprendiz/`, `1 ano fundamental/` → `materiais-brutos/`.
- Git inicializado na raiz de `10_PROJETO_FILHOS/`.
- Criada a camada de documentação viva dentro de `ilha-aprendiz/`: `docs/` (BRIEFING, ROADMAP, ARQUITETURA, DECISOES, CHANGELOG, ECOSSISTEMA), `pedagogia/` (currículo, motor de ensino, referências), `qa/` (checklist, casos de teste, auditorias), `claude/` (AGENTES, REGRAS_PERMANENTES) + `CLAUDE.md` na raiz do projeto.
- Nenhum código de `app/` ou `testes/` foi alterado nesta entrega.

## agosto de 2026 (datas específicas não registradas retroativamente)

Resumo do que já existia antes deste changelog começar a ser mantido — detalhe completo em cada documento de `pedagogia/`:

- Trilha de Português: 7 dos 8 módulos construídos e testados (25 atividades, 5 níveis cada).
- Trilha de Matemática: 12 dos 13 módulos construídos e testados (28 atividades, 5 níveis cada).
- Sistema de Desafio Final retrofitado nos 21 módulos com nível.
- Navegação reorganizada em árvore de 4 telas.
- Motor de Ensino (protótipo Aprender → Ver exemplo → Fazer comigo → Agora é você) implementado em 2 atividades (M6 Matemática) como prova de conceito.
- Auditoria e expansão de conteúdo em todos os 7 módulos de Português (mais de 150 itens novos adicionados).
- Cobertura de fala (Web Speech API) auditada e corrigida nas 13 atividades que tinham lacuna.
