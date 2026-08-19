# Arquitetura Técnica — Ilha Aprendiz

*Arquitetura do **código**, não do currículo (para arquitetura pedagógica/conteúdo, ver `pedagogia/ARQUITETURA_TRILHA_PORTUGUES.md` e `pedagogia/MOTOR_DE_ENSINO.md`). Escrito em 2026-08-16 a partir de inspeção direta do código-fonte, na criação da camada de documentação viva. Atualizado no mesmo dia depois da modularização (ver `docs/DECISOES.md`) — a seção "Estado atual" abaixo já reflete a estrutura nova; a versão anterior (arquivo único) fica só no histórico do git.*

## Estado atual: multi-arquivo, sem build step

`app/ilha_aprendiz.html` — hoje **175 linhas**, só HTML (marcação das telas + as tags `<link>`/`<script src>` que carregam o resto). Continua abrindo direto no navegador (`file://`), sem servidor — decisão deliberada, ver "Por que multi-arquivo sem quebrar o duplo-clique" abaixo.

```
app/
├── ilha_aprendiz.html   (marcação das telas + <link>/<script src>)
├── css/
│   └── app.css           (~340 linhas)
├── data/
│   ├── icones.js               (SVGs próprios)
│   ├── portugues-conteudo.js   (letras, palavras, pares mínimos, rimas, famílias)
│   ├── emoji-visuais.js        (vocabulário visual compartilhado)
│   ├── registro-modulos.js     (menus e registro das duas trilhas)
│   ├── portugues-atividades.js (conteúdo + definição das atividades, 7 módulos PT)
│   ├── matematica-atividades.js(idem, 12 módulos MT)
│   ├── licoes.js                (conteúdo do Motor de Ensino)
│   ├── mapa-portugues.js        (coordenadas dos hotspots da Ilha das Letras — desde 2026-08-16)
│   └── projeto-leitor.js        (conteúdo do Módulo 8 — livros/roteiro, desde 2026-08-16)
├── assets/
│   └── maps/            (imagens de mapa — ver docs/DECISOES.md sobre o asset da Ilha das Letras)
└── js/
    ├── mastery.js         (domínio/progressão, MODULE_CONTAINERS, Desafio Final, moduleStatus)
    ├── navigation.js       (árvore de telas)
    ├── ritmo-bimestre.js   (sinal de ritmo por bimestre — desde 2026-08-16)
    ├── mapa-portugues.js   (Ilha das Letras: mapa interativo de Português — desde 2026-08-16)
    ├── projeto-leitor.js   (tela do Módulo 8, aberta pelo mapa — desde 2026-08-16)
    ├── revisao-espacada.js (revisão espaçada — desde 2026-08-16)
    ├── storage.js          (persistência — localStorage, desde 2026-08-16)
    ├── admin.js            (painel de admin)
    ├── utils.js            (sorteio, fala, som, ícone/emoji)
    ├── teaching-engine.js  (Motor de Ensino: fluxo da aula)
    ├── game-loop.js        (iniciar atividade, rodada, resposta, Desafio Final)
    ├── activities-portugues.js   (~30 funções render*, 7 módulos PT + Joaquim)
    └── activities-matematica.js  (~30 funções render*, 12 módulos MT)
```

## Por que multi-arquivo sem quebrar o duplo-clique

`<script src="...">` **clássico** (sem `type="module"`) e dados como `const` em `.js` (não `.json` via `fetch`) — tudo no mesmo escopo global, carregado na ordem das tags. Isso evita o problema de CORS que `type="module"`/`fetch` teriam sob `file://` (que esta mesma seção do documento sinalizava como pendência antes da modularização) — o app continua abrindo com duplo-clique, sem servidor.

## Ilha das Letras — mapa interativo de Português (2026-08-16, UX refinada em 5 rodadas entre 2026-08-17 e 2026-08-19)

Substitui a grade de cartões de Módulos (`screen-modulos`), só pra Português — Matemática continua na grade normal ("Ilha dos Números" fica pra depois, mesma arquitetura reaproveitável quando chegar a vez). Fluxo: `screen-materias` → clique em Português → `screen-mapa-portugues` (mapa) → clique numa região (abre popover) → CTA do popover → **direto pro jogo** (`screen-game`, via `maybeShowLesson()`/`startGame()`) ou pro Desafio Final (`startProva()`) quando o módulo já está todo concluído — desde a rodada 4 (2026-08-19), o CTA não passa mais por `screen-atividades` (ver abaixo).

- **Reuso, não duplicação:** `moduleStatus(mod)` (`js/mastery.js`) foi extraída de dentro de `renderModulos()` e passou a ser usada pelas duas telas — o cálculo de bloqueado/progresso/aprovado é feito uma vez só. `proximaAtividadeDoModulo(mod)` (`js/mapa-portugues.js`, rodada 4) reaproveita o mesmo critério de "atividade concluída" que `doneCount` já usa (nível 5 + 80%), só devolvendo a atividade em vez da contagem. O CTA chama `maybeShowLesson()`/`startGame()`/`startProva()` — as mesmas funções que a antiga grade de Atividades sempre chamou, nenhuma mecânica nova.
- **Grade de Atividades pulada, de propósito (rodada 4, 2026-08-19):** dentro de um módulo, as 7 atividades sempre foram simultaneamente destravadas (arquitetura antiga, independente do mapa) — a grade de Atividades deixava essa liberdade visível/clicável, permitindo pular a ordem pretendida. O CTA do mapa agora abre direto a próxima atividade não concluída (`proximaAtividadeDoModulo()`) ou o Desafio Final quando todas as 7 já estão feitas — a criança passa a progredir uma atividade de cada vez, na ordem do módulo. `screen-atividades`/`renderAtividades()` continuam existindo intocados (Matemática ainda usa normalmente via `renderModulos()` → `openAtividades()`); só deixaram de ser alcançados pelo clique no mapa. `state.navBack = "mapa-portugues"` (existia desde a rodada 2, sempre sobrescrito antes de ser lido) passou a ser real — `backToMenu()` (`js/admin.js`) ganhou o branch que faltava.
- **"Praticar de novo" (rodada 5, 2026-08-19):** link discreto no popover (`🔁 Praticar de novo`, só aparece com ≥1 atividade concluída no módulo) abre `screen-pratica-livre` — tela dedicada listando só as atividades JÁ dominadas daquele módulo (nunca as pendentes: revisar o passado, não pular o futuro). `state.freePracticeMode` (`js/game-loop.js`) isola a pontuação dessas sessões do jeito que Desafio Final/Revisão Espaçada já isolam as deles — `registerAnswer()` ganha um 3º branch que não grava em `mastery`/`activityLevel`. `startFreePractice(activityId)` chama `startGame()` normalmente e só depois liga a flag (que `startGame()` já reseta pra `false` no início, defensivo contra vazamento entre sessões).
- **5 estados visuais** (LOCKED/AVAILABLE/LEARNING/MASTERED/DESAFIO_APROVADO): marcador compacto (ícone + anel de progresso via `conic-gradient`, cor por estado) + selo de canto só nos estados extremos — nunca regenera a imagem base, tudo overlay HTML/CSS. "Próximo destino" (`computeDestinoAtual()`/`regionIsRecommendedToday()`, ver abaixo) é um estado visual **separado**, sobreposto aos 5 de mastery, não um 6º estado de domínio.
- **Popover sob demanda:** cada região é um grupo `.map-region` (marcador + `.map-popover`). Só clique/toque (`.is-open`) ou foco por teclado (`:focus-within`) abrem o popover inteiro — **desde a rodada 3 (2026-08-17), `:hover` não abre mais** (o cursor descansando em cima do marcador em destaque fazia o popover parecer "grudado" aberto sem clique nenhum); hover no desktop mantém só um feedback leve (o anel sobe 3px). O popover mostra nome, status por extenso, detalhe de progresso ("X de Y desafios concluídos" ou o motivo do bloqueio), **a atividade específica que o CTA vai abrir** (ícone+nome, ex. "🧩 Monte a Sílaba" ou "🏁 Desafio Final" — rodada 4, necessário porque o CTA agora pula direto pra lá, sem mais uma grade intermediária mostrando o nome) e o botão `[Continuar aventura]`/equivalente que efetivamente navega — clicar no marcador em si **não navega direto**, só abre/fecha o popover. Região bloqueada não ganha CTA, só a explicação.
- **"Próximo destino":** `computeDestinoAtual()` (`js/mapa-portugues.js`) calcula a primeira região desbloqueada e ainda não concluída, na ordem pedagógica de `PT_MAPA_REGIOES`; `regionIsRecommendedToday(moduleId)` (existia desde o MVP, sempre `false` de propósito) usa isso de verdade desde a rodada 2. Só leitura do estado que `moduleStatus()` já expõe — zero mudança em `js/mastery.js`. Visualmente é um halo suave (`mapGlow`) + selo estático "✨" (rodada 3) — o selo não anima, então continua identificável com `prefers-reduced-motion` ativo (`@media` dedicado desativando `mapPulse`/`mapGlow`). Cabeçalho do mapa também é contextual (`mensagemDestinoAtual()`, rodada 3): "primeira aventura" / "novo destino" / "aventura continua", conforme o progresso real do destino atual — mesma fonte de dado, sem duplicar lógica. Ponto de extensão pra futura "Aventura de Hoje" continua o mesmo, agora com implementação de referência real.
- **Linguagem de aventura na tela de Atividades (função preservada, hoje vestigial pro mapa):** `renderAtividades()` (`js/navigation.js`) mostra o nome/ícone da região (ex. "🌳 Floresta do Alfabeto") em vez do nome curricular ("Módulo 1 · Alfabeto e Sílabas") quando o módulo aberto tem uma entrada correspondente em `PT_MAPA_REGIOES`; subtítulo também contextual ("Escolha seu próximo desafio" sem progresso, "Continue sua aventura — X de Y" com progresso). Desde a rodada 4, o mapa não chama mais essa tela — a função continua correta e testada (Matemática ainda a usa via `renderModulos()`, e qualquer código futuro que chame `openAtividades()` diretamente continua se beneficiando dela), só não faz mais parte do caminho normal de clique da criança em Português. O dado curricular original em `registro-modulos.js` não muda (painel adulto/admin continuam mostrando o nome oficial).
- **Módulo 8 (Castelo dos Livros)** não é jogo — o CTA do seu popover abre `screen-projeto-leitor` (`js/projeto-leitor.js`), que reaproveita o conteúdo já existente em `pedagogia/MODULO8_PROJETO_LEITOR.md` (estruturado em `data/projeto-leitor.js`), não uma mecânica nova.
- **Responsividade — decisão confirmada por cálculo, não suposição (rodada 3):** a distância real entre os marcadores mais próximos (`narrativas`/`gramatica`) foi calculada a partir da mesma matemática do CSS (`aspect-ratio:3/2`, padding do `.app`, marcador de 44px) pros 3 tamanhos de celular pedidos — 360px (sobrepõe, -1,2px), 390px (2,8px de folga) e 430px (8,1px) contra 53-71px em tablet/desktop. **`contain`+`%` sozinho não é suficiente em celular estreito** — confirmado. Solução: abaixo de 600px de largura, `.mundo-map` (o "viewport" visível, sempre do tamanho da tela) vira `overflow:auto` em torno de um `.mundo-map__canvas` interno maior (largura fixa, ex. 640px, altura proporcional via `aspect-ratio`) — rolagem nativa do navegador, sem lib externa, sem gesto customizado. Acima de 600px, canvas = viewport = comportamento de sempre. `openMapaPortugues()` chama `centralizarMapaNoDestino()` pra abrir a tela já centralizada no destino atual — só tem efeito quando há algo pra rolar (no-op natural em telas largas). A matemática de centralização (`calcularScrollCentralizado()`) é uma função pura isolada do DOM, testável sem depender de layout real. Zoom por pinça do navegador continua funcionando (nenhum `user-scalable=no` no viewport). Essas são as duas primeiras `@media` do projeto (a outra é `prefers-reduced-motion`) — até a rodada 2 o app não tinha nenhuma.
- **Lia / transformações visuais do mundo — preparado, não implementado:** comentário em `js/mapa-portugues.js` documentando que um overlay de posição da Lia (`map-guide`) ou de progresso visual por região usaria o mesmo sistema de coordenadas `--x`/`--y` já em uso, como filho adicional de `.map-region`/`.mundo-map__canvas`. A personagem já desenhada na imagem base (perto do cais) não deve virar elemento dinâmico — a Lia de verdade será um asset próprio por cima do mapa, no futuro. Também avaliado e adiado (rodada 3): destacar o checkpoint do destino atual sobre o caminho dourado que já existe na arte — os marcos são visíveis na imagem, mas calibrar 8 coordenadas novas na mesma rodada de várias outras mudanças foi considerado frágil demais; fica pro próximo round, reaproveitando `?calibrar=1`.
- **Nome do mundo, centralizado:** `PT_MAPA_REGIOES` (`data/mapa-portugues.js`, `{moduleId, nome, icone, left, top}`) é a única fonte de "nome de aventura" por módulo — usada pelo mapa, pelo popover e pelo cabeçalho de Atividades. Qualquer feature futura que precise desse nome (Aventura de Hoje, Lia) deve ler daqui, não duplicar a string.
- **Coordenadas dos hotspots** (`data/mapa-portugues.js`) foram recalibradas visualmente contra o asset real — ainda estimativa a olho, não medição exata de pixel; ajuste fino com `?calibrar=1` na URL (clique no mapa imprime a coordenada no console). Não tocadas na rodada 3 (aprovadas como estão).
- **Asset da imagem:** `app/assets/maps/ilha-das-letras.webp` (1536×1024, colocado em 2026-08-16), carregado via JS só na primeira vez que a tela abre (quem nunca visita a Ilha das Letras nunca baixa o arquivo). **Pendência de performance:** 2,4MB, sem otimização — não havia ferramenta de recompressão de imagem disponível neste ambiente (ImageMagick/cwebp ausentes). Vale revisitar quando alguma dessas ferramentas estiver disponível.

Testado em `testes/qa_test_mapa_portugues.js`.

## Como a divisão foi feita (histórico, pra quem for repetir o processo em outro trecho)

O corte de ~5.600 linhas em 15 arquivos foi feito por **extração mecânica de faixa de linha exata** (mapeado via grep de todo `const`/`function` de topo antes de cortar, não estimado), não reescrita manual — risco de erro de transcrição praticamente zero, porque nenhuma linha de lógica foi digitada de novo. Verificação em duas camadas depois de cada corte:

1. **Reconstrução:** `testes/_util/load_app_html.js` "achata" os arquivos de volta num HTML só; o resultado foi comparado (`diff`, depois `diff` de conjunto ignorando ordem) contra o arquivo monolítico anterior — confirmando que nenhuma linha de conteúdo real foi perdida ou alterada (só reordenada em 1 ponto: 5 funções de atividade de Português que estavam soltas no fim do arquivo original foram reagrupadas junto do resto das atividades de PT — seguro em script clássico, porque ordem de declaração de função não afeta comportamento).
2. **Suíte de testes:** os 29 arquivos de `testes/` rodados depois de cada fase (CSS, depois dados+lógica) — mesmo resultado da baseline em toda fase (28/29 limpos, 1 falha já conhecida em `qa_test_regression.js`).

**Onde a separação não é 100% pura, de propósito:** `js/mastery.js` mistura estado (`state`, `mastery`, `activityLevel`) com as funções que operam sobre ele — é o módulo de domínio como um todo, não "dado" isolado de "lógica". `js/activities-portugues.js` inclui as 3 funções da trilha simples do Joaquim (`renderLetras`, `renderNumeros`, `renderContar`) junto das atividades niveladas de Português — não tem trilha própria ainda, não valia a pena um arquivo à parte só pra 3 funções.

**Onde ainda dá pra refinar depois (não feito agora, retorno decrescente pro risco):** `data/portugues-atividades.js` e `data/matematica-atividades.js` agrupam todos os módulos da trilha inteira num arquivo só, em vez de 1 arquivo por módulo (7+12=19 arquivos minúsculos) — decisão consciente de manter no grão de "trilha inteira" por ora.

## Testes

`testes/qa_test_*.js` (Node + jsdom), 29 arquivos. Desde 2026-08-16, todos carregam o app via `testes/_util/load_app_html.js` (`npm install` + `node testes/_run_all.js`, ou `node testes/qa_test_nome.js` individualmente) — não depende mais de copiar o arquivo pra `/tmp` (era uma fragilidade conhecida, corrigida nesta entrega; ver `docs/DECISOES.md`). O helper foi desenhado pensando na modularização e já cumpriu esse papel: acha as tags `<link>`/`<script src>` locais e as substitui pelo conteúdo inline antes de entregar pro jsdom — os 29 arquivos de teste não precisaram mudar de novo quando a modularização aconteceu.

**Baseline estabelecida em 2026-08-16** (primeira vez que a suíte roda de fato nesta máquina), confirmada de novo depois de cada fase da modularização: 28 de 29 arquivos limpos, 1 falha conhecida (`qa_test_regression.js`, artefato de `setTimeout`/jsdom — ver "Pendências" abaixo). `qa_test_new_activities.js` usa formato de saída próprio (`TOTAL ERRORS: N`), diferente do `RESULT: N passed, M failed` do resto da suíte.

## Testes

`testes/qa_test_*.js` (Node + jsdom), 29 arquivos. Desde 2026-08-16, todos carregam o app via `testes/_util/load_app_html.js` (`npm install` + `node testes/_run_all.js`, ou `node testes/qa_test_nome.js` individualmente) — não depende mais de copiar o arquivo pra `/tmp` (era uma fragilidade conhecida, corrigida nesta entrega; ver `docs/DECISOES.md`). O helper foi desenhado pensando na modularização e já cumpriu esse papel: acha as tags `<link>`/`<script src>` locais e as substitui pelo conteúdo inline antes de entregar pro jsdom — os 29 arquivos de teste não precisaram mudar de novo quando a modularização aconteceu.

**Baseline estabelecida em 2026-08-16** (primeira vez que a suíte roda de fato nesta máquina), confirmada de novo depois de cada fase da modularização: 28 de 29 arquivos limpos, 1 falha conhecida (`qa_test_regression.js`, artefato de `setTimeout`/jsdom — ver "Pendências" abaixo). `qa_test_new_activities.js` usa formato de saída próprio (`TOTAL ERRORS: N`), diferente do `RESULT: N passed, M failed` do resto da suíte.

## Próximos refinamentos possíveis (não urgentes, não bloqueiam nada)

- **Per-módulo em vez de per-trilha** em `data/portugues-atividades.js`/`matematica-atividades.js` (19 arquivos menores em vez de 2 grandes) — só vale a pena se esses arquivos ficarem difíceis de navegar na prática.
- **Schema JSON por conceito pedagógico** (`id`, `titulo`, `pre_requisitos`, `ensino: {...}`) — ideia registrada em `pedagogia/PREREQUISITOS.md`, ainda não aplicada aos dados reais; hoje o conteúdo continua como array/objeto JS "achatado", não nesse formato mais rico.

## Pendências técnicas conhecidas

- ~~Caminho hardcoded `/tmp/ilha_aprendiz.html` nos testes~~ — resolvido em 2026-08-16, ver `docs/DECISOES.md`.
- Flakiness conhecida e documentada (não são bugs novos, não travar CI por causa deles): `qa_test_regression.js` e `qa_test_svg.js` (artefato de `setTimeout` no harness), intermitência ocasional em `qa_test_typing.js`.
- `npm install` (jsdom) precisa ser rodado uma vez por máquina antes de `node testes/_run_all.js` funcionar — `node_modules/` está no `.gitignore`, não versionado.
