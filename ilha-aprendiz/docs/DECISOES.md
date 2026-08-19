# Decisões — Ilha Aprendiz

*Responde "por que fizemos dessa maneira?". Registro append-only: novas entradas se somam, entradas antigas não são reescritas (se uma decisão for revertida, registra-se uma entrada nova explicando a reversão, mantendo a antiga como histórico). Sem isso, depois de centenas de alterações vira impossível responder "por que fizemos isso mesmo?".*

*As entradas abaixo, datadas de "agosto de 2026" sem dia exato, foram retroativamente extraídas dos documentos já existentes (`BRIEFING.md`, `pedagogia/CURRICULO_BNCC_PORTUGUES.md`, `pedagogia/CURRICULO_BNCC_MATEMATICA.md`, `docs/ECOSSISTEMA.md`) na criação deste arquivo — a decisão em si é real e já estava documentada, só não existia num registro dedicado. A partir daqui, toda decisão nova ganha data exata.*

---

## 2026-08-17 — Piloto VACA, rodada 2: orquestração audiovisual por Promise/async-await

**Decisão:** enquanto o Júlio gera os áudios/vídeos reais das próximas palavras (via `producao/`), pediu uma segunda passada no piloto VACA especificamente pra virar uma **referência arquitetural reutilizável**: fluxo controlado por `Promise`/`async-await` de ponta a ponta (em vez de `setTimeout`s adivinhados pra sincronizar áudio/vídeo/UI) e destaque visual sincronizado com cada sílaba/palavra sendo pronunciada. Ele mandou uma proposta detalhada de como faria; boa parte do motor (`AudioManager.queueVoice`) já era internamente sequencial via `await` dentro de uma IIFE — só faltava expor isso como Promise pra quem chama, em vez de só aceitar callback.

**O que mudou:**
- `AudioManager.queueVoice()` (`js/audio-manager.js`) passa a **também retornar a Promise** que já existia internamente — mudança de 2 linhas, comportamento anterior 100% preservado.
- `AudioManager.playVoice(item)` novo — toca 1 item de voz e retorna a Promise (mesma lógica de token/interrupção do `queueVoice`, extraída pra 1 item só).
- `playCharacterIntro()` novo — Promise-wrapper fino em cima do `mountCharacterIntro` já existente, sem tocar em nenhuma linha da lógica de fallback de autoplay/vídeo ausente que já estava lá.
- `pronounceAndHighlight(element, item)` novo — adiciona `.is-speaking`, `await AudioManager.playVoice(item)`, remove a classe, pequeno respiro (~180ms). Helper genérico pensado pra qualquer atividade audiovisual futura, não só VACA.
- `registerAnswerWithCharacterFeedback()` (`js/activities-portugues.js`) virou `async`: no acerto, `await` a Lia + `pronounceAndHighlight` em loop sobre `item.syl` (slot por sílaba) + a palavra inteira (`#slots`) — só DEPOIS chama `registerAnswer(true, null, {nextRoundDelay:700})`. **O `nextRoundDelay` deixou de ser um chute pra "cobrir" a fala (era 4800ms) e virou só o respiro final — a rodada só avança depois que o áudio já terminou de verdade**, não um timeout paralelo torcendo pra dar tempo. No erro, a dica destaca o **botão de opção** com a 1ª sílaba certa (não os slots, que já foram limpos pra não travar a criança esperando o áudio) — continua nunca revelando a 2ª sílaba.
- `startCharacterIntroRound()` virou `runWordIntro()`, reescrita como sequência `await` legível (vídeo/visual → instrução da Lia → libera opções) em vez de callbacks aninhados.

**Por que não segui o rascunho do Júlio 100% ao pé da letra:** ele sugeriu um objeto `MEDIA`+`phoneticPath()`/`characterVideoPath()` paralelos a `media-catalog.js` — não criei, o arquivo já faz exatamente esse trabalho e o próprio pedido dele foi pra preservá-lo. Sugeriu também um `playVoiceSequence(files, gap)` novo — não dupliquei, é o que `queueVoice()` já faz; só precisava virar awaitable. O `playVoice()` dele reimplementava `<audio>`/eventos do zero — extraí de `playVoiceItem`, que já existia e já é testado.

**Fora de escopo, de propósito:** a escalada de dicas em 3 níveis que o Júlio esboçou foi apresentada como ideia pra "o futuro" na mensagem dele, não fazia parte do pedido concreto final — não implementada agora. Mastery, conteúdo de `WORDS`, e qualquer outra atividade continuam intocados.

**Testado** (`testes/qa_test_piloto_vaca.js`, 39 checagens — 9 novas): as duas chamadas de teste a `registerAnswerWithCharacterFeedback()` passam a `await` a Promise real em vez de `wait()` adivinhado; `pronounceAndHighlight` testado isoladamente (adiciona a classe antes da Promise resolver, remove depois); nenhum elemento fica com `.is-speaking` residual depois de acerto/erro; `playVoice`/`queueVoice`/`playCharacterIntro`/`pronounceAndHighlight` existem com a superfície esperada; **o teste mais importante** — `nextRound` só é chamado depois que as 4 falas (Lia+VA+CA+VACA) já foram registradas, confirmando que a sincronização é real, não um timeout paralelo. Suíte completa: 33/34 arquivos limpos (mesma falha conhecida, `qa_test_regression.js`).

---

## 2026-08-17 — Ilha das Letras, rodada 3: destino mais claro, popover limpo, texto contextual e mobile de verdade

**Decisão:** terceiro e (por ora) último refinamento de UX sobre a Ilha das Letras — o Júlio confirmou a estrutura visual da rodada 2 como aprovada ("não redesenhe o mapa, não altere a imagem, não mude coordenadas sem necessidade") e pediu só polimento fino antes de tratar a Ilha das Letras como **modelo-base pros futuros mundos do Ilha Aprendiz** (a partir da Ilha dos Números). Mastery, desbloqueio, estrelas, atividades, níveis, Desafio Final, Matemática, Projeto Leitor e persistência continuam intocados.

**A descoberta que mais importa desta rodada — números reais, não suposição:** o Júlio pediu explicitamente pra não assumir que `contain`+`%` está bom no celular só porque funciona no desktop. Sem navegador, calculei a distância real entre marcadores a partir da mesma matemática que o CSS usa (`aspect-ratio:3/2`, `.app{padding:20px}`, marcador de 44px) — script Node, puro cálculo geométrico, nada especulativo:

| Viewport | Largura útil do mapa | Par mais próximo (Vale das Histórias ↔ Montanha dos Sinais) | Folga entre bordas |
|---|---|---|---|
| 360px | 320px | 42,8px | **-1,2px — sobrepõe de verdade** |
| 390px | 350px | 46,8px | 2,8px — encostando |
| 430px | 390px | 52,1px | 8,1px — ainda apertado |
| 768px (tablet) | 728px | 97,3px | 53,3px — confortável |
| 900px (desktop) | 860px | 115,0px | 71,0px — confortável |

Esse par (Vale das Histórias/`narrativas` e Montanha dos Sinais/`gramatica`) também é visualmente vizinho na própria arte (fogueira com os animais colada nas pedras com "?"/"!") — o cálculo bate com a ilustração, não é só teoria. **Nos 3 tamanhos de celular que o Júlio pediu pra validar (360/390/430px), `contain`+`%` sozinho não é suficiente** — confirmado, não presumido. A partir de ~550px de largura de viewport já fica confortável (por isso o corte em 600px, com folga).

**Solução escolhida — rolagem nativa, não pan/zoom customizado:** abaixo de 600px de largura, o mapa ganha uma superfície interna (`.mundo-map__canvas`) maior que a janela visível (`.mundo-map`, que passa a ter `overflow:auto`) — sem lib externa, sem gesto customizado, é `overflow:auto` do navegador mesmo, arrastável com o dedo normalmente. Acima de 600px nada muda: canvas = viewport, como sempre foi. `centralizarMapaNoDestino()` centraliza a rolagem horizontal no destino atual ao abrir a tela (pedido explícito do Júlio), só tem efeito quando existe algo pra rolar — em telas largas é um no-op natural, não um `if` especial. A matemática da centralização (`calcularScrollCentralizado()`) foi isolada numa função pura justamente pra dar pra testar sem depender de layout real (jsdom não calcula CSS de verdade).

**Outras mudanças da rodada:**
1. **Popover não abre mais sozinho:** o comportamento "aparece aberto ao entrar" relatado pelo Júlio não era um bug de estado (nada no código força abertura) — era o seletor CSS `:hover` disparando porque o cursor do mouse tende a estar em cima do marcador em destaque (que já chama atenção) no momento da troca de tela. Correção: `:hover` deixou de abrir o popover inteiro; só clique/toque (`.is-open`) ou foco por teclado (`:focus-within`) abrem. Hover no desktop continua com um feedback leve (o anel sobe 3px), só não expõe mais status/CTA sozinho.
2. **Destino atual mais evidente:** halo (`mapGlow`, já existia) + um selo estático "✨" fixo acima do marcador — o selo não anima, então continua comunicando "você está aqui" mesmo com `prefers-reduced-motion` ativo (novo `@media` desativando `mapPulse`/`mapGlow` pra quem prefere menos movimento — as primeiras duas media queries do projeto, junto com a de 600px acima).
3. **Cabeçalho contextual** (`mensagemDestinoAtual()`, `js/mapa-portugues.js`): troca o "Próximo destino: X" fixo por 3 mensagens conforme o progresso real (1ª aventura / novo destino recém-desbloqueado / aventura em andamento) — só leitura de `moduleStatus()`, nenhuma regra de mastery nova. Mesma ideia replicada, menor, no subtítulo da tela de Atividades (`renderAtividades()`, `js/navigation.js`).
4. **Caminho/checkpoints da arte (item 5 do pedido):** avaliado de verdade — abri a imagem de novo e confirmei que o caminho dourado tem marcos/checkpoints visíveis, então o pedido é fisicamente viável. **Adiado de propósito**: calibrar 8 coordenadas novas de checkpoint na mesma rodada em que várias outras coisas mudam é exatamente o tipo de "coordenada frágil" que o próprio Júlio autorizou a adiar. Fica documentado como próximo passo natural, reaproveitando o mesmo fluxo `?calibrar=1`.
5. **Primeira visita (item 3 do pedido):** só arquitetura, nenhum código novo — `toggleMapaPopover()`/`fecharTodosPopoversMapa()` já são reutilizáveis o bastante pra uma futura "abrir automaticamente uma vez" só precisar de um flag de estado que ainda não existe.
6. **Nome do mundo centralizado (item 9 do pedido):** já existia desde a rodada 2 (`PT_MAPA_REGIOES`) — nada novo construído, só confirmado que é essa a fonte única que qualquer feature futura (Aventura de Hoje, Lia) deve reaproveitar.
7. **Hierarquia do "Voltar" (item 11 do pedido):** conferida lendo o código — já estava correta (Exercício → Atividades → Mapa → Matérias, cada nível voltando exatamente um passo). Nenhuma mudança de código, só um teste novo que percorre a cadeia inteira de uma vez.

**Testado** (`testes/qa_test_mapa_portugues.js`, 72 checagens — 20 novas): popover fechado por padrão ao entrar; clique no destino atual abre o popover dele; `computeDestinoAtual()`/`regionIsRecommendedToday()`/`mensagemDestinoAtual()` não alteram mastery/prova (snapshot antes/depois); as 3 mensagens contextuais do cabeçalho do mapa; subtítulo contextual da tela de Atividades (com/sem progresso); cadeia completa "exercício → Atividades → Mapa → Matérias" num fluxo só; `calcularScrollCentralizado()` como função pura (matemática, sem depender de layout real); `centralizarMapaNoDestino()` não quebra quando não há nada pra rolar; confirmação de que a regra `prefers-reduced-motion` existe de verdade no `app.css` (lida como texto, já que jsdom não avalia media query de preferência do sistema). Suíte completa (33 arquivos): mesma baseline conhecida (32/33; `qa_test_regression.js` é o flake documentado; `qa_test_typing.js` falhou uma vez de forma intermitente já catalogada, confirmada não-regressão ao rodar de novo).

---

## 2026-08-17 — Ilha das Letras, rodada 2: marcadores compactos, popover sob demanda e "próximo destino"

**Decisão:** segunda rodada de UX sobre o MVP da Ilha das Letras (entrada de 2026-08-16 abaixo), a pedido do Júlio depois de ver o resultado — os cards grandes e translúcidos (nome + badge sempre visíveis) cobriam boa parte da ilustração e faziam o mapa parecer "menu com fundo bonito" em vez de mundo pra explorar. Trocado por:
1. **Marcador compacto:** círculo de ~44px com só o ícone da região; um anel de progresso (`conic-gradient`, cor por estado) substitui o texto "X/Y" solto no mapa; um selo de canto (🔒/✓/⭐) só nos estados extremos (bloqueado/dominado/aprovado).
2. **Popover sob demanda:** nome, status por extenso, detalhe de progresso ("3 de 7 desafios concluídos" ou explicação de bloqueio) e o botão de ação moraram pra um popover que aparece em `:hover`/`:focus-visible`/toque — CSS puro pra mouse e teclado, uma classe `.is-open` alternada por clique só pra cobrir toque (sem hover).
3. **"Próximo destino":** `computeDestinoAtual()` novo — primeira região desbloqueada e ainda não concluída, na ordem pedagógica de `PT_MAPA_REGIOES`. `regionIsRecommendedToday()` (que existia desde o MVP sempre retornando `false`, de propósito) passa a usar essa função de verdade. Continua sendo leitura pura do estado que `moduleStatus()` já calcula — **nenhuma mudança em `js/mastery.js`**, é um overlay visual independente, preparado desde o início pra virar a base da futura "Aventura de Hoje".
4. **Linguagem de aventura na tela de Atividades:** ao entrar por uma região do mapa, o título vira o nome da região ("🌳 Floresta do Alfabeto") em vez do nome curricular ("Módulo 1 · Alfabeto e Sílabas"). O dado curricular original em `PT_MODULES_BENJAMIN` (`registro-modulos.js`) **não muda** — painel adulto e admin continuam usando o nome oficial normalmente; é só uma checagem a mais em `renderAtividades()` (`js/navigation.js`) que troca a apresentação quando existe uma entrada correspondente em `PT_MAPA_REGIOES` (ou seja, só Português). Matemática não tem entrada nesse array — comportamento inalterado, testado como regressão.

**Mudança de interação, não só cosmética — registrada explicitamente:** no MVP, clicar no hotspot navegava direto. Agora clicar no marcador **abre o popover**; quem navega de fato é o botão `[Continuar aventura]` (ou equivalente) dentro dele. Isso é o que o pedido do Júlio descreveu explicitamente (mostrar nome/status sob demanda, com um botão de ação dentro do popover), não uma decisão unilateral — mas como muda o comportamento de clique testado no MVP, os testes correspondentes foram reescritos (não só ajustados) em `testes/qa_test_mapa_portugues.js`.

**Lia e transformações visuais do mundo — só arquitetura, nada implementado:** comentário em `js/mapa-portugues.js` documentando que um overlay de posição da Lia (`map-guide`) ou de progresso visual por região (árvore crescendo etc.) usaria o mesmo sistema de coordenadas `--x`/`--y` já em uso, como filho adicional de `.map-region`/`.mundo-map`. Não criado nenhum elemento novo pra isso agora — não existe asset da Lia ainda, e a imagem base já tem uma personagem desenhada perto do cais que **não** deve ser reaproveitada como elemento dinâmico (instrução explícita do Júlio — a Lia de verdade será um asset próprio por cima do mapa, no futuro).

**Responsividade — decisão de não agir ainda:** o Júlio pediu validação real em desktop/tablet/celular estreito (~390px) e perguntou explicitamente se recomendo manter `contain`+`%` ou migrar pra um mapa navegável (pan/scroll). Recomendei manter `contain`+`%` nesta rodada — não tenho como abrir navegador real pra medir sobreposição, mas o cálculo por percentuais mostra que os pontos mais próximos entre si (~20% de distância) têm folga suficiente pra marcadores de 44px compactos, ao contrário dos cards antigos de ~90px com texto sempre visível (esses sim eram o fator real de aperto). Construir um viewport arrastável agora seria especular sem confirmação visual — fica como pendência conhecida, validação fica por conta do Júlio testando no celular de verdade; a arquitetura de coordenadas em `%` não muda nem impede evoluir pra pan/scroll depois se for preciso.

**Testado** (`testes/qa_test_mapa_portugues.js`, reescrito — 52 checagens): os 8 marcadores continuam `<button>` acessíveis com `aria-label`/`aria-expanded`; nome de região não aparece mais permanentemente no marcador; popover mostra conteúdo certo por estado (inclusive a mensagem de bloqueio sem CTA); clique no marcador abre/fecha o popover sem navegar; CTA dentro do popover navega (Atividades ou Projeto Leitor); só 1 popover aberto por vez; anel de progresso reflete o percentual real em LEARNING; "próximo destino" muda corretamente conforme o progresso avança (3 cenários: início, depois do 1º módulo, ilha quase inteira concluída); nome amigável aparece em `atividades-title` vindo do mapa e o dado curricular original continua intacto; Matemática inalterada (regressão). Suíte completa (33 arquivos): mesmo resultado da baseline conhecida, nenhuma falha nova.

---

## 2026-08-16 — Ilha das Letras: mapa interativo substitui a grade de Módulos (só Português)

**Decisão:** navegação de Português (Matérias → Módulos → Atividades) ganha uma camada visual de aventura — a grade de cartões de Módulos vira um mapa de ilha ilustrado ("Ilha das Letras"), com cada módulo virando uma região clicável. Matemática continua na grade de cartões (`Ilha dos Números` fica pra depois). Arquitetura interna (mastery, domínio, Desafio Final, prerequisito entre módulos) não muda em nada — o mapa é estritamente uma camada de apresentação nova por cima do que já existia, sem duplicar lógica (`moduleStatus()` extraída e reaproveitada pelas duas telas).

**Motivo:** pedido do Júlio, com uma imagem conceitual anexada ("Ilha das Letras") — a visão de marca já registrada desde antes em `docs/ECOSSISTEMA.md` ("uma ilha com regiões/trilhas que a criança desbloqueia conforme avança") finalmente ganha uma primeira implementação real, começando só por Português como MVP controlado.

**Processo seguido:** entrei em modo de planejamento (ExitPlanMode) antes de qualquer código — diagnóstico completo do fluxo/arquitetura existente, mapeamento de exatamente 2 pontos de código que precisavam mudar (`renderMaterias()` e `backToModulos()`), plano revisado e aprovado pelo Júlio com 3 ajustes antes da implementação começar (ver abaixo).

**3 ajustes do Júlio ao plano original, incorporados:**
1. **Módulo 8 (Castelo dos Livros)** não fica só "em construção" — abre uma tela própria (`screen-projeto-leitor`) reaproveitando o conteúdo já existente em `pedagogia/MODULO8_PROJETO_LEITOR.md` (livros + roteiro de perguntas), sem mecânica de jogo nova.
2. **Ponto de extensão pra "Aventura de Hoje"** preparado desde já: `regionIsRecommendedToday(moduleId)`, hoje sempre `false` — não implementado, mas a estrutura já aceita esse estado visual independente de domínio/desbloqueio quando for construído de verdade.
3. **Responsividade** (`aspect-ratio` + hotspots em `%`) tratada como **hipótese de primeira versão**, não decisão definitiva — validar em desktop/tablet/celular estreito depois de implementado; se a ilha ficar pequena demais num celular, a evolução already-prevista é um viewport navegável/pan mantendo os mesmos hotspots em `%`.

**O que NÃO foi feito, de propósito (fora do MVP, mas a arquitetura não impede depois):** Ilha dos Números (Matemática), personagem-guia Lia, mecânica completa de "Aventura de Hoje", transformações visuais de progresso (árvore que cresce, ponte que se constrói), pan/zoom customizado.

**Atualização (mesmo dia):** asset colocado no projeto — `app/assets/maps/ilha-das-letras.webp` (1536×1024, 2,4MB). O Júlio mandou duas versões geradas: uma com número/checkmark/estrelas/cadeado desenhados na própria imagem (rejeitada — contraria o princípio de "sem texto fixo de interface" do briefing original, teria ficado redundante/desalinhado com os badges dinâmicos em HTML) e uma limpa, só cenário (usada). Coordenadas dos 8 hotspots recalibradas visualmente contra o arquivo real (antes eram sobre a prévia do chat). **Pendência que ficou:** não consegui recomprimir/otimizar o WebP neste ambiente (sem ImageMagick/cwebp disponíveis — `convert` no Windows é o utilitário de disco, não o do ImageMagick) — o arquivo está pesado (2,4MB) pro que precisa ser; fica registrado como próximo passo de performance, não bloqueia o MVP.

**Testado** (`testes/qa_test_mapa_portugues.js`, 32 checagens): 8 hotspots reais e acessíveis (elementos `<button>`, `aria-label`), os 5 estados visuais (fixtures de mastery/prova pra cada um), clique em hotspot bloqueado não navega, clique em hotspot desbloqueado abre Atividades, Módulo 8 abre a tela de Projeto Leitor (não Atividades) com o conteúdo completo, `backToModulos()` retorna pro lugar certo dependendo da trilha (mapa pra Português, grade pra Matemática), Matemática inteiramente inalterada (grade de cartões, zero hotspot). Suíte completa (33 arquivos): mesmo resultado da baseline, incluindo `qa_test_nav_tree.js` sem nenhuma regressão (37/37, inalterado).

---

## 2026-08-16 — Correção dos 12 achados da auditoria BNCC, via framework de papéis

**O que foi feito:** as 5 divergências reais + 7 achados menores da auditoria (ver entrada anterior e `qa/auditorias/auditoria_bncc_oficial.md`) foram corrigidos no mesmo dia, a pedido explícito do Júlio ("arrume elas, use as investiduras dos agentes que temos pra isso") — usando o framework de papéis do `claude/AGENTES.md`: Especialista Pedagógico decidiu o quê/como corrigir cada achado, Desenvolvedor implementou, QA testou.

**Decisões de correção, achado a achado:**
1. **EF01MA13** (Formas no Mundo) — conteúdo mantido (cubo/pirâmide continuam testados), só o rótulo corrigido pra ser honesto: EF01MA13 (4 formas oficiais) + "além" explicitamente antecipando EF02MA14. Escolhido em vez de remover cubo/pirâmide porque é conteúdo válido, consistente com a proposta "um ano à frente" do app — só estava mal rotulado.
2. **EF01MA11/12** (Onde Está?/Siga o Mapa) — vocabulário de "Onde Está?" trocado de "em cima/embaixo" pra "à frente/atrás", com o enunciado agora estabelecendo o referencial ("em relação a você"). "Siga o Mapa" não mudou.
3. **EF01MA01** (Quantos Tem?) — nova 3ª variação: classificar número como quantidade/ordem vs. código de identificação (número de casa, camisa, canal).
4. **EF01MA09** (Organize por Tamanho) — 2 variações novas ("ache o diferente" por cor e por forma), somadas à original (tamanho).
5. **EF01LP17/20/22/24** (Módulo 4/5 de Português) — textos das habilidades corrigidos (verbo completo, lista de gêneros completa); gênero "legenda de foto" adicionado ao banco `FUNCTIONAL_TEXTS` (5 itens novos).
6-12. **Achados menores** — todos os 7 tiveram o texto corrigido pra bater com o oficial; 2 deles (EF01MA14, EF01MA16) só na documentação, porque a lacuna real (relacionar 2D a face de sólido 3D; usar horário de relógio) exigiria conteúdo/jogo novo — registrado como pendência conhecida em vez de fabricar cobertura que não existe.

**Por que não criar atividades totalmente novas pros achados 3-5:** optei por estender atividades existentes (nova variação dentro do mesmo formato) em vez de construir jogos novos do zero — mais rápido, mais consistente visualmente, e menor risco de quebrar algo, já que reaproveita motores já testados (ex.: `mm8DrawShape` pro achado 4, o mesmo padrão de completar lacuna pro achado 5).

**Testado:** suíte completa revalidada depois de cada mudança individual (não só no final) + checagens novas direcionadas em `qa_test_math_m1.js` (+3), `qa_test_math_m3.js` (+3), `qa_test_math_m7.js` (+4), `qa_test_modulo4.js` (+2) — total de 12 checagens novas verificando especificamente o conteúdo corrigido, não só "não quebrou nada". Suíte completa (32 arquivos): mesmo resultado da baseline (única falha conhecida em `qa_test_regression.js`; uma falha intermitente pré-existente em `qa_test_typing.js` apareceu uma vez, confirmada como flake já documentado, não regressão).

---

## 2026-08-16 — Comparação do currículo próprio contra o texto oficial da BNCC

**O que foi feito:** comparação código a código das 26 habilidades EF01LP e 22 EF01MA como descritas em `app/data/registro-modulos.js` (fonte real usada pelo app) contra o texto oficial em `pedagogia/bncc-oficial/`. Relatório completo em `qa/auditorias/auditoria_bncc_oficial.md`.

**Resultado:** a maioria dos 48 códigos bate bem com o oficial. 5 divergências reais encontradas, por ordem de relevância:
1. **EF01MA13** ("Formas no Mundo") usa a lista de 6 formas geométricas do EF02MA14 (2º ano) — cubo e pirâmide não fazem parte do EF01MA13 oficial (só cone, cilindro, esfera, bloco retangular).
2. **EF01MA11/EF01MA12** — o vocabulário oficial de cada código ("em frente/atrás" pra EF01MA11, "em cima/em baixo" citado no EF01MA12) está com sinais trocados entre as atividades "Onde Está?" e "Siga o Mapa".
3. **EF01MA01** — a atividade cobre só a metade "quantidade vs. ordem" da habilidade; a outra metade oficial ("números como código de identificação", ex. número de casa) não tem atividade.
4. **EF01MA09** — atividade só testa ordenação por tamanho; oficial também pede cor e forma como critério.
5. **EF01LP17/20/22/24** — texto oficial sempre inclui "legendas para álbuns/fotos" na lista de gêneros (o gênero Fotolegendas já pesquisado em `pedagogia/REFERENCIA_NOVA_ESCOLA.md`) e o verbo "planejar"/"identificar" antes de produzir/reproduzir; nossos textos capturam só metade disso.

Mais 7 achados menores (imprecisão de redação, sem gap de conteúdo real) documentados no relatório.

**Escopo desta entrega:** só o relatório — **nenhuma correção de código, jogo ou documentação de currículo foi aplicada ainda**. Fica registrado como pendência conhecida até decisão do Júlio sobre o que (se algo) vale corrigir.

---

## 2026-08-16 — Documento oficial da BNCC baixado e alocado no projeto

**Decisão:** o Júlio perguntou se tínhamos algum guia oficial do MEC anexado — não tínhamos, só os índices próprios (`pedagogia/CURRICULO_BNCC_PORTUGUES.md`/`CURRICULO_BNCC_MATEMATICA.md`), que referenciam códigos de habilidade sem fonte pra conferir. Baixamos o PDF oficial completo (`basenacionalcomum.mec.gov.br`) e alocamos em `pedagogia/bncc-oficial/`, junto com dois recortes extraídos (Língua Portuguesa 1º/2º anos, Matemática 1º ano) pra uso prático — a fonte de verdade que faltava.

**Motivo:** decisão explícita do Júlio ("aloque os documentos em nossas pastas, devem ser nossas diretrizes e guias"). Contagem de códigos EF01LP (26) e EF01MA (22) no documento extraído bate exatamente com o que os índices próprios já afirmavam ter, o que é um bom sinal inicial — mas isso **não é a mesma coisa** que ter comparado item a item se cada descrição de habilidade bate com o texto oficial.

**Escopo desta entrega — deliberadamente parado aqui:** o Júlio pediu explicitamente pra alocar os documentos agora e comparar depois, em separado. Este commit é só a alocação; a comparação linha a linha contra `CURRICULO_BNCC_PORTUGUES.md`/`CURRICULO_BNCC_MATEMATICA.md` fica registrada como próximo passo pendente, não feita ainda.

**Nota técnica:** `pdftotext` (poppler) não conseguiu ler este PDF específico do MEC (erro de xref table) — usamos `pdf-parse` (Node.js) como alternativa. Detalhe completo, incluindo o artefato cosmético de extração conhecido, em `pedagogia/bncc-oficial/README.md`.

---

## 2026-08-16 — Trava de ritmo por bimestre: referência informativa, não bloqueio

**Decisão:** `js/ritmo-bimestre.js`. Módulo de Matemática cujo bimestre (`mod.bimestre`, ex. "3º bimestre") está à frente do bimestre real do calendário (calculado por mês, aproximado — ver comentário no código) ganha um selo "🗓️ Adiantado" no card do módulo e um resumo agregado no card da trilha. **Nenhum módulo fica bloqueado por causa disso** — é puramente informativo, zero fricção no clique. Só se aplica a Matemática; Português já trava por domínio + Desafio Final entre módulos sequenciais. Deliberadamente não existe sinal de "atrasado".

**Motivo:** essa era a decisão de formato mais em aberto do roadmap (bloqueio rígido vs. referência vs. outro mecanismo) — escolhida sem input adicional do Júlio além de "continue", então registrada aqui em detalhe. Três fatores pesaram pra "referência, não bloqueio":

1. **Consistência com o princípio já registrado em `CLAUDE.md`** — "nunca trava a criança" foi usado até agora só pra erro dentro de uma atividade, mas bloquear um módulo inteiro por causa da DATA (não por falta de domínio) seria um tipo de trava nova e mais arbitrária — a criança pode estar genuinamente pronta e curiosa, e o calendário é só uma aproximação.
2. **A trilha de Português já mostra que bloqueio funciona bem quando é por domínio** (a criança realmente não sabe o conteúdo ainda) — bloquear por data é uma justificativa mais fraca, mais fácil de frustrar sem necessidade.
3. **Consistência com o tom "encorajador, nunca punitivo"** já registrado em `docs/ECOSSISTEMA.md` — daí também a decisão de nunca sinalizar "atrasado" (só teria efeito de culpa, sem ganho pedagógico real).

**Efeito real esperado:** isso não *impede* varrer os 12 módulos de Matemática de uma vez (ainda dá pra fazer) — dá visibilidade pros pais decidirem o ritmo com informação, que é consistente com o app já pressupor acompanhamento adulto na maior parte das atividades. Se isso na prática não for suficiente (a avaliação real do item 5 do roadmap pode revelar isso), o próximo passo seria considerar um mecanismo mais forte — registrado como possibilidade em aberto, não fechada.

**Testado** (`testes/qa_test_ritmo_bimestre.js`, 23 checagens): mapeamento mês→bimestre nos limites de cada trimestre, extração do número do bimestre do rótulo, `moduloAdiantado` (incluindo confirmar que nunca sinaliza módulo passado), agregação por trilha, cobertura real dos 4 bimestres nos dados de Matemática, renderização sem erro nas telas de Matérias/Módulos, e confirmação de que o selo nunca aparece em Português. Suíte inteira (32 arquivos): mesmo resultado da baseline.

---

## 2026-08-16 — Revisão espaçada: sessão dedicada, intervalos fixos por estágio, nunca recua

**Decisão:** `js/revisao-espacada.js`. Atividade dominada (nível 5, 80%+) entra num ciclo com estágios 0-4, intervalo de revisão crescente (2/5/10/21/45 dias, fixo em 45 depois disso). Card "🔁 Revisão de Hoje" na tela de Ano Letivo do Benjamin, visível só quando há atividade vencida, abre uma sessão de 2 rodadas por atividade vencida, reaproveitando o loop de jogo normal. Pontua numa trilha separada (`state.revisaoResults`), nunca em `mastery`. Desempenho ≥60% na sessão avança o estágio; abaixo disso, não avança, mas também nunca recua.

**Motivo:** decisão de design pedagógico feita sem input adicional do Júlio além do "pode continuar" — registrada aqui com o raciocínio completo em vez de silenciosa, exatamente pra poder ser revisitada se não for isso que ele tinha em mente. Escolhas específicas com justificativa completa em `pedagogia/REVISAO_ESPACADA.md`: sessão dedicada (não misturada com prática normal) porque reaproveita a arquitetura de sessão já existente sem alterá-la; intervalo fixo por estágio (não gatilho adaptativo por sinal de esquecimento) porque não havia dado de uso real ainda pra calibrar um gatilho adaptativo sem chutar; threshold de 60% por atividade espelha o mesmo critério já usado no Desafio Final, por consistência; "nunca recua" é aplicação direta do princípio "nunca penalizar erro" do `CLAUDE.md`, estendido de estrelas/progresso pra também cobrir o cronograma de revisão.

**Testado** (`testes/qa_test_revisao_espacada.js`, 38 checagens): entrada no ciclo (idempotente), vencimento por estágio, montagem de sessão, isolamento de `mastery`, avanço condicionado ao desempenho, navegação de volta, aparição condicional do card, integração via `endSession()`, limpeza pelos resets do admin, persistência completa. Suíte inteira (31 arquivos): mesmo resultado da baseline.

---

## 2026-08-16 — Persistência de progresso: localStorage salva tudo, não só o nível

**Decisão:** `js/storage.js` persiste `activityLevel` (nível 1-5 de cada atividade), `mastery` (histórico completo das últimas 10 tentativas de primeira jogada, por nível), `provaPassed`/`provaScores` (Desafio Final) e `state.totalStars` — não só um resumo. `saveProgress()` é chamado depois de cada rodada com registro de mastery, fim de sessão, fim de Desafio Final e reset de admin; `loadProgress()` roda uma vez ao carregar a página. Formato versionado (`version: 1`) e validação leve em cada campo restaurado (tipo, range, forma), pra um localStorage adulterado ou de versão futura incompatível não corromper o estado em memória.

**Motivo:** opção explícita do Júlio entre persistir "tudo" (incluindo o histórico fino de mastery) vs. só o essencial (nível + Desafio Final, sem o histórico das últimas 10 tentativas). "Tudo" foi escolhido — mantém a métrica de domínio (`masteryPercent`) com a mesma precisão entre sessões que já tinha dentro de uma sessão só.

**Escopo deliberadamente de fora:** a tela/rodada exata em que a criança estava no meio de uma sessão não é restaurada — reabrir o app sempre volta pra tela de seleção de criança (`screen-home`), com os dados corretos já carregados. Retomar no meio de uma rodada (inclusive um Desafio Final em andamento) foi considerado risco desproporcional ao ganho.

**Testado** (`testes/qa_test_persistencia.js`, 26 checagens): round-trip completo (salvar → resetar em memória → restaurar, comparando cada campo), defesas contra JSON corrompido, versão desconhecida, nível fora do range 1-5, chave inexistente, mastery mal formado e estrelas negativas, `clearProgress()`, e confirmação de que os hooks reais (`adminReset`, `adminResetAll`) gravam/limpam o localStorage de fato, não só o estado em memória. Suíte inteira (30 arquivos agora) revalidada — mesmo resultado da baseline (a mesma falha já conhecida em `qa_test_regression.js`).

---

## 2026-08-16 — Modularizar `app/ilha_aprendiz.html` em CSS/dados/JS, sem servidor e sem build

**Decisão:** dividir o arquivo único (~5.600 linhas) em 15 arquivos (`css/`, `data/`, `js/`), usando `<script src="...">` **clássico** (sem `type="module"`) e conteúdo como `const` em `.js` (não `.json` via `fetch`). `app/ilha_aprendiz.html` (mantido com esse nome, não renomeado pra `index.html`) cai pra 175 linhas.

**Motivo:** a alternativa mais "moderna" (ES modules + JSON via `fetch`) quebra o app sob `file://` por CORS — exigiria servidor local pra abrir, mudando a rotina de uso diário sem necessidade real nesta fase. Scripts clássicos multi-arquivo compartilham o mesmo escopo global de sempre, carregam na ordem das tags, e preservam 100% o "abre com duplo-clique" que já era um princípio do produto.

**Como foi verificado (sem quebrar os 28 módulos já testados):** extração por faixa de linha exata (mapeada via grep antes de cortar, não estimada) — nenhuma linha de lógica foi reescrita manualmente. Duas camadas de verificação depois de cada fase: (1) reconstrução via `testes/_util/load_app_html.js` comparada linha a linha e por conjunto contra o arquivo anterior — confirmando zero perda de conteúdo (só uma reordenação segura: 5 funções de atividade de Português que estavam soltas no fim do arquivo viraram vizinhas do resto das atividades de PT); (2) suíte de 29 testes rodada depois de cada fase, mesmo resultado da baseline em todas (28/29 limpos, a mesma falha já conhecida). Detalhe completo em `docs/ARQUITETURA.md`. **Confirmado manualmente pelo Júlio em navegador real (duplo-clique) no mesmo dia** — jsdom cobre lógica/DOM mas não layout visual nem a fala real (Web Speech API).

---

## 2026-08-16 — Suíte de testes passa a carregar o app via helper compartilhado, não mais `/tmp`

**Decisão:** `testes/_util/load_app_html.js` substitui o `fs.readFileSync('/tmp/ilha_aprendiz.html', ...)` hardcoded que existia em cada um dos 29 arquivos de teste. `package.json` + `jsdom` como devDependency também foram adicionados (não existiam antes).

**Motivo:** pré-requisito de segurança pra começar a modularizar `app/ilha_aprendiz.html` (ver entrada abaixo e `docs/ARQUITETURA.md`) — não dava pra verificar que a modularização não quebrou nada sem primeiro conseguir rodar a suíte de verdade nesta máquina. De quebra, resolve uma fragilidade já registrada como pendência técnica desde a criação do `docs/ARQUITETURA.md`. O helper já nasce preparado pra "achatar" `<link>`/`<script src>` externos de volta pra inline, então não precisa ser tocado de novo quando a modularização acontecer.

**Baseline confirmada nesta mudança** (primeira execução real da suíte nesta máquina): 28/29 arquivos limpos, 1 falha já conhecida e documentada (`qa_test_regression.js`, artefato de `setTimeout`/jsdom).

---

## 2026-08-16 — Reorganizar a pasta de trabalho e criar camada de documentação viva

**Decisão:** renomear `Ilha Aprendiz/` → `ilha-aprendiz/` e `1 ano fundamental/` → `materiais-brutos/` (kebab-case, sem espaço/acento); inicializar git; e reestruturar `ilha-aprendiz/` em três camadas — código (`app/`), documentação viva (`docs/`, `pedagogia/`, `qa/`), e governança do agente (`claude/`, com `CLAUDE.md` na raiz).

**Motivo:** o conhecimento do projeto vivia só na conversa com o Claude — se a conversa mudasse ou o contexto fosse resumido, decisões importantes se perdiam. `CLAUDE.md` na raiz é lido automaticamente pelo Claude Code a cada sessão nova, então vira o ponto de entrada garantido, não dependente de o usuário lembrar de colar contexto.

---

## agosto de 2026 — Não salvar progresso entre sessões (sem localStorage)

**Decisão:** o app não persiste progresso — fechar a aba zera níveis e estrelas.

**Motivo:** decisão técnica deliberada desde o início do protótipo (documentada em `BRIEFING.md`), não uma lacuna descoberta depois — mantida enquanto o app estava em fase de construção de conteúdo. Passou a ser tratada como **prioridade técnica nº 1** a partir do momento em que ficou claro (agosto de 2026) que sem persistência não dá pra medir ritmo real de uso nem avaliar as próximas decisões de revisão espaçada/trava de ritmo — ver `docs/ROADMAP.md`.

---

## agosto de 2026 — Desafio Final também é critério de desbloqueio, não só relatório

**Decisão:** ao implementar o checkpoint de avaliação por módulo (Desafio Final — nunca "prova" na tela, pra criança), ele passa a ser exigido, junto com 80%+ de domínio em nível 5, pra desbloquear o próximo módulo — não é só um informativo pros pais.

**Motivo:** pedido explícito do Júlio ("quero implantar provas ao fim de cada módulo"). Critério duplo de aprovação (80% geral **e** 60%+ em cada atividade individual) evita que uma atividade fraca fique escondida atrás da média das outras. Retrofitado de uma vez em todos os 21 módulos já prontos, não pilotado num módulo primeiro.

**Efeito assimétrico:** em Português (trilha sequencial), isso trava de verdade o avanço. Em Matemática (trilha independente, `requires:null` em todos os módulos), o Desafio Final não bloqueia nada na prática — vira só registro de conquista. Ver `pedagogia/CURRICULO_BNCC_MATEMATICA.md`.

---

## agosto de 2026 — Trilha de Português é sequencial; trilha de Matemática é independente

**Decisão:** os 7 módulos de Português seguem ordem estrita (módulo N exige módulo N-1 100% dominado + Desafio Final aprovado). Os 12 módulos de Matemática ficam todos desbloqueados desde o início, sem ordem obrigatória entre si.

**Motivo:** Português é cumulativo por natureza (letra → sílaba → palavra → frase → texto), então a sequência reflete pré-requisito real de habilidade. Matemática, nesse recorte de 1º ano, tem unidades temáticas mais paralelas entre si (números, geometria, medidas, probabilidade não dependem uma da outra na mesma medida). Efeito colateral reconhecido: como nada trava Matemática, "o ritmo ali depende 100% de decisão manual dos pais" — é a raiz do item 3 do roadmap (trava de ritmo por bimestre).

---

## agosto de 2026 — Habilidades de produção ficam fora da tela, sem proxy artificial

**Decisão:** habilidades BNCC que exigem produção real (escrever livremente, gravar áudio/vídeo, entrevistar pessoas, pesquisa de campo) não viram atividade de clique com resposta certa fingida — ficam formalizadas como recomendação fora da tela.

**Motivo:** aplicado de forma consistente em pelo menos 4 pontos — Módulo 8 de Português (projeto leitor semanal, `pedagogia/MODULO8_PROJETO_LEITOR.md`), M13 de Matemática (pesquisa de campo), EF01LP22/23/24 (produção de diagrama/entrevista/mídia) e a escrita em Módulo 4 (ver entrada abaixo). Princípio: ser honesto sobre o que um app offline de clique/digitação consegue avaliar de verdade, em vez de fingir avaliação automática onde não existe resposta certa única.

---

## agosto de 2026 — Módulo 4 (produção escrita) usa escrita guiada com validação leve, não redação livre

**Decisão:** nenhuma atividade do Módulo 4 pede redação aberta/livre. Toda escrita acontece dentro de um contexto real (lista, bilhete, parlenda) e é validada contra uma palavra-alvo específica.

**Motivo:** opção escolhida explicitamente pelo Júlio entre as alternativas discutidas — não dá pra corrigir redação livre automaticamente sem IA de correção, fora do escopo de um app offline. O formato escolhido é mais rico que uma palavra solta (tem contexto real) mas continua auto-corrigível.

---

## agosto de 2026 — "Som Inicial" (por letra) e "Pares Mínimos" (por fonema) são complementares, não uma substituindo a outra

**Decisão:** manter as duas atividades no Módulo 1, cada uma testando uma coisa diferente — Som Inicial compara a primeira *letra*; Pares Mínimos compara o *fonema* real via TTS.

**Motivo:** a dúvida inicial era se "Som Inicial" deveria virar "Letra Inicial" (renomear) ou ser substituída por um jogo de fonema de verdade. A pesquisa nas sequências da Nova Escola (`pedagogia/REFERENCIA_NOVA_ESCOLA.md`) confirmou que letra inicial é conteúdo legítimo do currículo por si só (sequência "Um pomar de A a Z"), não um erro de design — então as duas atividades ficaram, cobrindo aspectos diferentes da mesma habilidade.

---

## 2026-08-17 — Arquitetura audiovisual (personagens, vozes, fonética, SFX) e piloto VACA

**Decisão:** abrir uma frente paralela de mídia (personagens, animações, voz da Lia, fonética, SFX), com arquitetura aprovada ANTES de produzir qualquer asset em massa, e implementar um único vertical slice de validação (atividade "Monte a Sílaba", palavra VACA) antes de escalar pra outras palavras/personagens.

**Motivo:** o app usava TTS genérico do navegador pra tudo, incluindo um bug pedagógico real: `renderSilabas()` falava "Monte a palavra VACA" antes da criança montar VA+CA, entregando a resposta. Corrigido junto com a arquitetura nova.

**Decisões de arquitetura (resumo — árvore completa em `docs/audio/MEDIA_GUIDELINES.md`):**
- Separação de camadas: personagem (vídeo, com som embutido quando faz sentido) + voz da Lia (personalidade/instrução/encorajamento) + fonética (pronúncia pedagógica oficial) + SFX + lógica (JS decide quando cada um toca) — nunca tudo dentro de um MP4 só.
- **Lia e fonética são SEMPRE arquivos separados**, mesmo no acerto — nunca a Lia falando a pronúncia embutida na mesma frase de celebração. Permite revisar a pronúncia sem regravar a fala emocional (pedido do Júlio na aprovação).
- Fonética resolvida por `js/media-catalog.js` com **tipo explícito** (`letra`/`silaba`/`palavra`/`numero`), nunca por heurística de tamanho de texto (`texto.length <= 2`) — quebraria com sílabas de 3 letras (CHA/NHA/QUE). Ajuste pedido pelo Júlio na aprovação.
- `WORDS` (dado existente) ganha só um campo novo, `character`, e só nos itens que realmente têm personagem — hoje só VACA. Nenhum objeto `media` paralelo — os caminhos são derivados por convenção a partir de `word`/`syl` via `media-catalog.js`.
- Audio Manager mínimo (`js/audio-manager.js`): canal de voz (Lia+fonética, só 1 fala por vez) e canal de SFX (independente), com fallback pra TTS/`beep()` já existentes sempre que o arquivo real não existir ou falhar — narração automática nunca fica muda.
- Vídeo do MVP: só `<personagem>-intro.mp4`, sem estados de erro em vídeo (erro é conduzido pela Lia, não pelo personagem "reagindo mal" — bate com a regra de não punir erro) e sem `idle`/`success` em vídeo por ora (CSS/emoji resolvem).
- Ritmo da rodada: vídeo completo só no 1º encontro do personagem na sessão (`state.characterIntroSeen`); encontros seguintes pulam pro visual estático + instrução direto — evita 6-7s de introdução obrigatória em toda rodada. Pedido do Júlio na aprovação.
- `registerAnswer()` (`js/game-loop.js`) ganhou um 3º parâmetro opcional `opts` (`skipBeep`, `nextRoundDelay`) — 100% retrocompatível, todo call-site existente continua passando só 2 argumentos.

**Assets do piloto ainda não existem no projeto** (nem o vídeo `vaca-intro.mp4` que o Júlio mencionou já ter gerado — não encontrado na pasta conectada `D:\10_PROJETO_FILHOS` nesta sessão). Todo o suporte de código já trata a ausência de mídia como caso normal (fallback pra TTS/`beep()`/emoji), então o exercício funciona hoje exatamente como antes pra qualquer criança jogando — só passa a usar a mídia real assim que os arquivos forem adicionados nos caminhos documentados em `docs/audio/MEDIA_GUIDELINES.md`.

**Documentos novos:** `docs/audio/VOZ_LIA.md`, `docs/characters/CHARACTER_BIBLE.md` (só Lia + Vaca), `docs/audio/MEDIA_GUIDELINES.md`.

**Teste:** `testes/qa_test_piloto_vaca.js` (30 checagens) — paths do catálogo, campo `character` só em VACA, fallback de voz/SFX quando mídia não existe, instrução nunca revela a resposta, ritmo reduzido no 2º encontro, separação Lia×fonética no acerto/erro. Suíte completa rodada depois: mesma baseline conhecida (33/34 arquivos limpos, falha já documentada em `qa_test_regression.js`), nenhuma falha nova.

**Atualização (mesmo dia) — assets reais chegaram, piloto completo:** o Júlio adicionou os 7 arquivos essenciais do piloto direto em `app/assets/` (fora desta conversa): 3 falas da Lia (`monte-o-nome`, `acerto-01`, `dica-vamos-ouvir-o-comeco`), fonética VA/CA/VACA + a família B/V inteira como bônus (`ba,be,bi,bo,bu,ve,vi,vo,vu`), o SFX de acerto e `vaca-intro.mp4`. Rodei a suíte de novo pra confirmar: `qa_test_piloto_vaca.js` 30/30, suíte completa 33/34 (mesma falha conhecida). Corrigi duas menções desatualizadas que ainda diziam "nenhum asset real ainda" — `docs/audio/MEDIA_GUIDELINES.md` (tabela do roteiro, linha do `ca.mp3` que estava marcada 🔴 apesar do arquivo já existir) e `CLAUDE.md` ("Estado atual"). **Nota de estrutura:** esta entrada ficou fora de ordem no arquivo (deveria estar no topo, mais recente primeiro) — não reordenei pra não mexer em conteúdo alheio sem necessidade, só registrando aqui pra quem for procurar.


---

## 2026-08-17 — Pasta `producao/` + subagente gerador de prompts (video/fonetica)

**Decisao:** criar `producao/` (templates de prompt Flow/ElevenLabs, banco das 87 palavras de "Monte a Silaba", checklist de producao) e um subagente pontual `.claude/agents/gerador-prompts-av.md`, a partir de um briefing detalhado do Julio sobre como evitar reproducao desnecessaria de midia.

**Motivo:** produzir video/audio pra 87 palavras sem reuso geraria centenas de arquivos desnecessarios (87 videos + 87x falas da Lia repetidas). O pipeline correto, definido pelo Julio: 1 video por palavra/objeto quando fizer sentido visualmente + 1 audio por silaba UNICA (reutilizavel entre palavras, ex. `TO.mp3` serve GATO/PATO/RATO) + 1 audio por palavra inteira + falas da Lia genericas e fixas (nao mudam por palavra). Producao dividida em lotes (Lote A = 10 palavras primeiro) pra validar o padrao visual antes de escalar pras 87.

**Por que subagente e nao so documentacao:** o pedido explicito foi "eu vou pedir um prompt e voce me traz completo" -- um fluxo repetitivo (checar banco, checar reuso de silaba no checklist, montar os 2 prompts) que vale a pena isolar como tarefa deterministica, sem virar um 5o papel de sessao (ver nota em `claude/AGENTES.md`).

**Nao gerado ainda:** nenhum dos 77 prompts restantes (fora o Lote A, que ja tinha GATO/BOLA/VACA resolvidos no briefing) -- ficam pra quando o Julio pedir, palavra por palavra ou lote por lote, seguindo a mesma logica de "nao produzir em massa antes de validar" da arquitetura aprovada em 2026-08-17.
---

## 2026-08-17 — Piloto VACA: vídeo do personagem SEMPRE completo (reversão da "introdução reduzida")

**Decisão:** o piloto VACA original (aprovação da arquitetura, mesmo dia) tinha o ajuste #3 do Júlio: em reencontros com o mesmo personagem na mesma sessão, pular o vídeo inteiro e ir direto pra instrução falada, pra não obrigar a criança a assistir o vídeo de novo a cada rodada. Testando ao vivo, o Júlio viu esse comportamento acontecer (emoji + fala da Lia no lugar do vídeo, na 2ª vez que VACA apareceu) e pediu a reversão: **"pra mim faz sentido o vídeo aparecer sempre, isso prende a criança"**.

**O que mudou:** `runWordIntro()` (`app/js/activities-portugues.js`) não checa mais `characterIntroSeen` pra decidir se pula o vídeo — o vídeo completo (`playCharacterIntro`) toca em TODA aparição do personagem, mesmo repetindo na mesma sessão. `state.characterIntroSeen` continua sendo preenchido (registro de quem já apareceu), mas hoje não afeta mais o fluxo — mantido só pra eventual uso futuro (ex. analytics, ou se um dia fizer sentido reduzir só depois de N repetições, não na 2ª já).

**Por que a decisão original mudou:** a suposição de que "vídeo repetido cansa" fazia sentido em teoria (evitar fadiga/tédio), mas na prática, pro Benjamin, o vídeo é o que prende a atenção — cortar ele faz o personagem "sumir" no meio da experiência, o que é pior pedagogicamente do que repetir. Fica registrado como aprendizado: nem toda otimização de "ritmo" é uma melhoria real, precisa validar com uso de verdade (é exatamente por isso que o piloto existe antes de escalar pras 87 palavras).

**Teste ajustado:** `testes/qa_test_piloto_vaca.js`, seção 5 — antes checava "nenhum vídeo é criado no 2º encontro", agora checa o oposto ("o vídeo é criado de novo"). Suíte completa rodada depois da mudança: 33/34 arquivos sem falha (a falha em `qa_test_regression.js` é a tolerada/documentada, não relacionada a esta mudança).

---

## 2026-08-17 — Piloto VACA: TTS não fala mais junto com o MP3 real (bug de duas vozes sobrepostas)

**Decisão:** testando ao vivo o acerto da VACA, o Júlio ouviu duas vozes ao mesmo tempo: a MP3 real (o que produzimos) e a leitura por TTS que o app já fazia antes do piloto — "saiu o que fizemos, e o padrão que estava antes do leitor". Causa raiz: o design original do `AudioManager` (aprovação da arquitetura + rodada 2, ambos 2026-08-17) sempre começava a falar por TTS **imediatamente**, em paralelo à tentativa do MP3 real, e só cortava o TTS quando o MP3 confirmava que tinha começado a tocar (evento `playing`). Isso fazia sentido enquanto nenhum MP3 existia (nunca ficar mudo), mas agora que o Lote A está com áudio real gravado, os dois ficam audíveis ao mesmo tempo por uma fração de segundo toda vez.

**O que mudou:** `playVoiceItem()` (`app/js/audio-manager.js`) agora espera até 300ms (`GRACE_MS`) o MP3 real confirmar `playing` antes de sequer iniciar o TTS. Se o áudio real assumir dentro desse tempo, o TTS nunca chega a ser chamado — zero sobreposição. Só se o áudio real falhar, não existir, ou demorar mais que 300ms pra confirmar é que o TTS entra como fallback (mantendo a garantia de nunca ficar mudo).

**Trade-off aceito:** em troca de eliminar a sobreposição de vozes no caso comum (áudio existe e funciona), toda fala real ganha uma latência mínima adicional de até 300ms antes de tocar (tempo de tentar o áudio primeiro) — considerado imperceptível/aceitável frente ao ganho de qualidade percebida.

**Teste ajustado:** `testes/qa_test_piloto_vaca.js`, seção 3 — antes checava que o TTS já tinha falado de forma SÍNCRONA logo após chamar `queueVoice`; agora checa o oposto logo após a chamada (TTS ainda não falou) e só depois de uma pequena espera confirma que o TTS assumiu (porque o áudio "real" do teste sempre falha, por design). Suíte completa: 33/34 arquivos sem falha (mesma falha tolerada/documentada de sempre, sem relação com esta mudança).

---

## 2026-08-17 — Lote A inteiro escalado (9 personagens além da Vaca)

**Decisão:** depois de validar o piloto ao vivo com a Vaca (vídeo, voz, fonética, e corrigir os 2 bugs encontrados na validação — introdução reduzida revertida e sobreposição de vozes), o Júlio pediu pra escalar o resto do Lote A, que já estava com toda a mídia produzida (`producao/CHECKLIST_PRODUCAO.md`): "implemente as outras palavras que já temos salvos".

**O que mudou:** `app/data/portugues-conteudo.js` — as 9 palavras restantes do Lote A (GATO, PATO, SAPO, BOLA, CASA, GALO, LOBO, SINO, CARRO) ganharam o campo `character` (mesmo padrão da VACA), entrando automaticamente no fluxo completo de personagem+Lia+fonética já existente em `runWordIntro()`/`registerAnswerWithCharacterFeedback()` — **nenhuma linha nova de lógica**, só dado novo consumindo o motor que já existia (prova de que a arquitetura estava certa: escalar 9 palavras não pediu nenhuma mudança de código, só de dado).

**Documentação:** `docs/characters/CHARACTER_BIBLE.md` ganhou uma entrada consolidada pros 8 novos personagens/objetos (compartilham o mesmo padrão de campos da Vaca — não repetido campo a campo pra não inflar o documento). Campo "Som" ficou genérico de propósito, sem inventar onomatopeia que não foi conferida no vídeo real.

**Teste:** `testes/qa_test_piloto_vaca.js` ganhou uma seção 9 — smoke test estrutural pros 9 personagens novos (vídeo é criado, opções começam desabilitadas, caminhos de mídia resolvem certo pra cada sílaba/palavra), sem repetir as 30+ checagens profundas já feitas com a Vaca (acerto/erro/fallback/reencontro — esses continuam cobertos só pela Vaca, que é o caso mais testado). Suíte completa: 33/34 arquivos sem falha (mesma baseline conhecida) — `qa_test_piloto_vaca.js` sozinho foi de 40 pra 95 checagens.

**Ainda não coberto:** validação manual (a lista de 10 itens) só foi feita com a VACA até agora — vale rodar pelo menos 1-2 rodadas de cada palavra nova no navegador de verdade antes de considerar o Lote A 100% validado, não só testado por jsdom.

**Não escalado ainda (de propósito):** as 77 palavras dos níveis 2-5 fora do Lote A não têm mídia produzida — continuam sem `character`, e não devem ganhar até `producao/CHECKLIST_PRODUCAO.md` mostrar mídia pronta pra elas.

---

## 2026-08-17 — Concordância de gênero na fala de instrução da Lia ("dela"/"dele")

**Decisão:** o Júlio notou que a instrução fixa da Lia ("...e monte o nome **dela**!") ficava errada pra palavras de gênero masculino (GATO, PATO, SAPO, GALO, LOBO, SINO, CARRO) — "o gato" pede "dele", não "dela". Ele já tinha gravado o arquivo `monte-o-nome-genero-masculino.mp3` (mesma pasta, `audio/lia/comuns/`) e pediu pra identificar automaticamente qual arquivo usar por palavra.

**Decisão de design (consistente com o ajuste #1 da arquitetura original):** `genero` é um campo **explícito** em cada item de `WORDS` (`"m"|"f"`), igual à regra já estabelecida pra `mediaFonetica(tipo, texto)` — **nunca inferido da palavra por heurística**. Inferir por terminação (-a=feminino, -o=masculino) pareceria razoável mas quebra com exceções reais do português (“o mapa”, “a foto”, “o dia”) — o mesmo tipo de armadilha que motivou a regra original.

**O que mudou:**
- `app/data/portugues-conteudo.js`: as 10 palavras do Lote A ganharam `genero` ("f" pra BOLA/CASA/VACA, "m" pra GATO/PATO/SAPO/GALO/LOBO/SINO/CARRO).
- `app/js/activities-portugues.js`: nova função `montaFalaIntroPersonagem(item)` — escolhe entre `monte-o-nome.mp3`/"dela" e `monte-o-nome-genero-masculino.mp3`/"dele" com base em `item.genero`. Se `genero` estiver faltando, cai pro feminino (mesmo arquivo de sempre) COM aviso no console — nunca quebra, mas também nunca finge que "adivinhou" certo.
- `testes/qa_test_piloto_vaca.js`: novas checagens por palavra (concordância de gênero + arquivo certo) e um caso de borda (item sem `genero`).

**Efeito colateral corrigido nesta mesma rodada:** ao rodar a suíte completa depois da mudança, `qa_test_speak_coverage.js` e `qa_test_svg.js` começaram a falhar de forma intermitente — não por causa do gênero, mas porque agora que várias palavras de nível 1-3 têm `character` (Lote A inteiro), esses dois testes genéricos (que rodam TODAS as atividades, incluindo "silabas", sem os stubs de mídia que só existiam em `qa_test_piloto_vaca.js`) às vezes sorteavam uma palavra com personagem e travavam a narração esperando um `<video>` real que o jsdom não sabe tocar. Os dois ganharam os mesmos stubs de `HTMLMediaElement`/`Audio`, e `qa_test_speak_coverage.js` passou a esperar um pouco antes de checar a fala no caso "silabas" (mesma razão do ajuste "duas vozes sobrepostas"). De brinde, achei e corrigi um flake estatístico pré-existente e não relacionado em `qa_test_svg.js` (100 tentativas tinha ~1% de chance de nunca sortear TATU por acaso — subiu pra 400).

Suíte completa rodada várias vezes seguidas depois de todos os ajustes: 33/34 sem falha, de forma estável (mesma baseline conhecida).

---

## 2026-08-18 — Nem toda palavra do banco vira vídeo do mesmo jeito (crítica trazida de fora, GPT)

**Contexto:** o Júlio trouxe uma análise que fez com outra IA sobre a palavra DIA — apontando que "sol pulando atrás de nuvem" não comunica "dia" de forma inequívoca (a criança provavelmente nomeia SOL ou NUVEM). A crítica generalizou: nem toda palavra do banco tem um objeto único que "seja" a palavra — algumas são inerentemente abstratas/contextuais (DIA, JULHO, FESTA, CIDADE), e outras têm objeto certo mas risco de leitura errada por proximidade visual (ex. NINHO → "ovo", BICO → "passarinho").

**Decisão:** classifiquei o banco inteiro (87 palavras) em 🟢 direto (73) / 🟡 precisa direção visual cuidadosa (10: DEDO, BICO, NINHO, RUA, ARCO, BURACO, FUMAÇA, ILHA, MURO, DUNA) / 🔴 abstrato-contextual (4: DIA, JULHO, FESTA, CIDADE). Perguntei ao Júlio como tratar as 🔴 e 🟡 — ele escolheu **tentar a cena contextual nas 4 abstratas mesmo assim** (em vez de pular vídeo nelas), sabendo que o resultado pode continuar ambíguo — decisão dele, registrada aqui como aposta pedagógica consciente, não como certeza de que vai funcionar.

**O que mudou:** `producao/PROMPTS_VIDEO_TODAS_PALAVRAS.md` — os prompts das 10 🟡 ganharam direção visual mais específica (ex. NINHO sem passarinho pousando, BICO em close extremo sem o resto do pássaro, RUA sem carro nenhum). Os das 4 🔴 viraram cena contextual completa (ex. DIA = amanhecer até dia claro, não sol sozinho) com uma "IMPORTANT SEMANTIC NOTE" no próprio prompt instruindo o Flow a não deixar nenhum elemento único virar resposta óbvia — mesma técnica sugerida na crítica.

**Pendência real, não resolvida ainda:** a fala fixa da Lia ("Olha quem **chegou** por aqui!...") pressupõe um personagem chegando — não faz sentido pras 4 palavras abstratas (cena, não personagem). Vai precisar de uma 2ª variante fixa da fala (por categoria "personagem" vs. "cena", não por palavra — mesmo padrão do campo `genero`) antes de implementar DIA/JULHO/FESTA/CIDADE no jogo. Não gravada, não implementada — só a mídia de vídeo foi endereçada nesta rodada.

**Validação necessária antes de confiar nesse padrão:** testar os vídeos das 4 abstratas com o Benjamin de verdade antes de usar essa técnica (cena contextual) pra outras palavras abstratas que possam aparecer nos níveis futuros — não assumir que "deu certo pro DIA" generaliza sem checar.

---

## 2026-08-18 — Nível 1 quase completo: 8 palavras a mais ganham `character`/`genero`

**Contexto:** o Júlio gravou os vídeos de personagem de 8 das 9 palavras restantes do nível 1 (faltando só SETE, que por design não tem vídeo de personagem — ver `BANCO_87_PALAVRAS.md`), mas soltou os arquivos direto em `personagens/` em vez de uma pasta por palavra, e perguntou se já dava pra testar no jogo.

**O que mudou:**
- Reorganizei os 8 vídeos pra dentro das pastas certas (`personagens/<palavra>/<palavra>-intro.mp4`) e pré-criei as 87 pastas vazias (uma por palavra do banco inteiro) pra evitar essa mesma dúvida se repetir — só falta soltar o arquivo na pasta certa daqui pra frente.
- `app/data/portugues-conteudo.js`: RATO(m), MALA(f), ROSA(f), DEDO(m), MESA(f), RUA(f), PERA(f), DIA(m) ganharam `character` + `genero`, seguindo exatamente o mesmo padrão do Lote A (nada de lógica nova — validação de que a arquitetura escala).
- `testes/qa_test_piloto_vaca.js`: a checagem "nenhuma palavra fora do Lote A tem character" foi trocada por `PALAVRAS_COM_CHARACTER` (Lote A + essas 8), com uma checagem nova conferindo os 8 itens específicos.

**Pendência que já era conhecida e continua:** DIA usa cena contextual (sol nascendo), não personagem — a fala fixa da Lia ("Olha quem chegou...") ainda não bate com esse tipo de vídeo (ver decisão acima, "Nem toda palavra..."). Implementei DIA no jogo mesmo assim, a pedido do Júlio, com esse descompasso explicitamente sinalizado a ele — não é regressão nova, é a mesma pendência já registrada, agora exposta em produção.

Suíte completa rodada após a mudança: 34/34 arquivos, exceto o mesmo `qa_test_regression.js` com a falha-baseline conhecida ("session ended on end screen", não relacionada) — 33/34 sem falha nova, estável.

---

## 2026-08-18 — Banco quase 100%: 86 das 87 palavras ganham `character`/`genero` de uma vez

**Contexto:** o Júlio gravou e soltou (flat, sem pasta própria) os vídeos de praticamente TODO o banco de 87 palavras numa única rodada. Pediu pra organizar cada um na pasta certa e "fazer o que falta pra deixar tudo 100% pras 5 rodadas de monte a sílaba".

**O que mudou:**
- Reorganizei 68 vídeos soltos em `personagens/<palavra>/<palavra>-intro.mp4` (mesma convenção de sempre).
- `app/data/portugues-conteudo.js`: as 68 palavras receberam `character`+`genero`, junto com as que já tinham (Lote A + 8 do nível 1) — total 86 de 87 palavras do banco agora com vídeo real implementado. Gênero de cada uma decidido manualmente (nunca inferido por heurística de terminação, mesma regra desde a decisão original) — ex. exceções reais conferidas: "o mapa"-like não se aplicam aqui, mas casos como OVO(m)/UVA(f), LEITE(m)/NEVE(f), JULHO(m, meses são masculinos), NOVE/SETE(m, números são masculinos) foram checados um a um.
- `testes/qa_test_piloto_vaca.js` e `testes/qa_test_svg.js`: as checagens hardcoded por lista de palavras (Lote A, "8 novas de nível 1"...) foram trocadas por checagens ESTRUTURAIS sobre `WORDS` inteiro — insustentável manter uma lista fixa a cada rodada de escala. Agora valida: toda palavra com `character` tem `genero` válido e `character === lowercase(word)`; a única exceção sem `character` é a esperada (MURO). O smoke test da seção 9 passou a rodar em TODAS as palavras com `character`, não uma lista fixa — escala automaticamente com o banco.
- `qa_test_svg.js`: o teste "TATU's SVG aparece em modo tile" ficou estruturalmente impossível de continuar passando — TATU ganhou vídeo de personagem real, então `hasCharacter` (`activities-portugues.js`) sempre desvia pro fluxo de vídeo, nunca mais renderiza o SVG solto em modo tile. Não é regressão: é o caminho antigo (mídia não existia) virando inatingível de propósito porque a mídia real passou a existir. Teste reescrito pra validar o fluxo de vídeo em vez do caminho morto.

**Achados durante a organização, não resolvidos silenciosamente:**
1. A pasta `personagens/muro/` ficou vazia — não veio vídeo de MURO. Apareceu um `parede.mp4` solto, sem pasta correspondente ("parede" não é palavra do banco) — pode ser o vídeo do MURO com nome trocado. Movido pra `personagens/_a_revisar/parede.mp4` sem renomear/decidir nada, aguardando confirmação do Júlio.
2. `MURO` continua sem `character` no banco — única palavra das 87 ainda sem vídeo, por não ter mídia real (mesma regra desde o início: nunca registrar `character` sem a mídia existir de verdade).

**Efeito no "100%":** as 5 rodadas de "Monte a Sílaba" (níveis 1-5) já são totalmente jogáveis agora — 86/87 palavras com vídeo real, e a que falta (MURO) e o áudio de sílaba/palavra que ainda não foi gravado (a maioria) caem no fallback de TTS já garantido desde o piloto da Vaca, então nada fica mudo ou quebrado. "100%" no sentido de "sem áudio sintético nenhum" ainda depende de gravar as 33 sílabas e as 77 palavras inteiras que faltam (ver `producao/CHECKLIST_PRODUCAO.md`).

Suíte completa rodada após todas as mudanças: 33/34 arquivos sem falha (mesma baseline conhecida em `qa_test_regression.js`), estável em múltiplas rodadas.

---

## 2026-08-18 — Vídeo do MURO confirmado + sílabas quase completas (banco 100% em vídeo)

**Contexto:** o Júlio confirmou que o `parede.mp4` da rodada anterior era mesmo o vídeo do MURO, e nessa mesma mensagem avisou que gravou os áudios das 5 vogais sozinhas e dos clusters de 3+ letras, organizados em pastas próprias (`fonetica/avogais/` e `fonetica/dígrafos/`), pedindo pra conferir.

**O que mudou:**
- `parede.mp4` renomeado pra `personagens/muro/muro-intro.mp4`; `app/data/portugues-conteudo.js`: MURO ganhou `character:"muro", genero:"m"` — **as 87 palavras do banco agora têm vídeo de personagem real**, nenhuma exceção.
- `testes/qa_test_piloto_vaca.js`: a checagem estrutural que aceitava "só MURO sem character" virou "banco inteiro tem character" (`comCharacter.length === WORDS.length`) — sem mais exceção hardcoded.
- Áudio de sílaba: `avogais/` e `dígrafos/` não são pastas que o app conhece — `mediaFonetica()` (`media-catalog.js`) sempre resolve `tipo:"silaba"` pra pasta `silabas/`, independente do tamanho da sílaba (1 letra ou cluster de 3+). Reorganizei os 31 arquivos pra dentro de `fonetica/silabas/`, com dois ajustes no caminho: `cão.mp3` → `cao.mp3` (o dado do banco usa `CAO` sem til, mesma regra de sempre — nome de arquivo segue o dado, não a ortografia visual) e extensões `.MP3` normalizadas pra `.mp3` minúsculo (consistência, não era bug funcional no Windows).

**Achado, não resolvido silenciosamente:** `rra.mp3` e `rro.mp3` não correspondem a nenhuma sílaba realmente usada no banco (CARRO e FERRO, as únicas palavras com RR duplo, já são cobertas por `car`+`ro` e `fer`+`ro` — nenhuma usa "RRA"/"RRO" como sílaba própria na quebra silábica oficial). Movidos pra `fonetica/_a_revisar/` sem apagar, aguardando o Júlio confirmar se é sobra ou se gravou pensando em outra coisa.

**Ainda faltam 4 dos 28 clusters:** `boi` (JIBOIA), `gar` (GARRAFA), `lho` (MILHO/JULHO/COELHO), `nho` (NINHO) — não vieram nessa leva.

**Estado do "100%" agora:** vídeo de personagem está 100% (87/87). Áudio de sílaba está 29/33 (só faltam os 4 clusters acima + a pegadinha do Ç de FUMAÇA, que já tinha decisão pendente). Áudio de palavra inteira segue baixo (19/87) mas continua não bloqueando — fallback de TTS garantido desde o piloto da Vaca.

Suíte completa rodada após a mudança: 834 checagens em `qa_test_piloto_vaca.js` (era 826), 33/34 arquivos sem falha (mesma baseline conhecida).

---

## 2026-08-18 — Bug do Ç corrigido (FUMAÇA liberada pra gravar)

**Contexto:** pendência aberta desde a primeira leva de vídeos — `mediaFileName()` tratava `Ç` como acento comum e o reduzia a `C` na hora de montar o nome do arquivo, então a sílaba `ÇA` de FUMAÇA colidiria com `CA` (som errado: /k/ em vez de /s/). Perguntei ao Júlio como resolver; ele escolheu a opção recomendada: corrigir no código.

**Decisão de design:** `Ç` não é um caso de acento (que só marca tonicidade, o som da letra continua o mesmo — `"LÁ"`→`"la"` é seguro) — é uma consoante com som PRÓPRIO, diferente de `C`. Por isso o tratamento dele precisa acontecer ANTES do NFD genérico que cuida dos acentos de verdade, não junto.

**O que mudou:**
- `app/js/media-catalog.js`: `mediaFileName()` agora troca `ç`/`Ç` por `"ss"` antes do NFD (aproxima o som /s/ do Ç e garante arquivo distinto de C).
- `app/data/portugues-conteudo.js`: a 3ª sílaba de FUMAÇA no banco virou `"ÇA"` (grafia real da palavra) em vez de `"CA"` — o jogo passa a mostrar e cobrar a sílaba certa na tela do "Monte a Sílaba", não só no áudio. Confirmei que essa mudança é segura: a mecânica do jogo compara os blocos clicados contra `item.syl` (o próprio array), nunca contra `item.word` reconstruído, então `syl` pode ter uma grafia diferente da palavra sem quebrar nada.
- `testes/qa_test_piloto_vaca.js`: checagem genérica de sílaba (seção 9) ajustada pra já esperar a troca de Ç por "ss"; nova checagem dedicada confirmando que `ÇA` e `CA` não colidem mais, e que o dado de FUMAÇA usa `"ÇA"`.

**Efeito colateral bom, não planejado:** como `ÇA` deixou de ser igual a `CA`, `CA` volta a poder aparecer como distrator visual nas rodadas de FUMAÇA (antes não aparecia, porque o código de distratores excluía qualquer sílaba igual às da palavra certa) — isso ajuda pedagogicamente a mostrar a diferença visual entre `ÇA` e `CA`, não só a sonora.

Suíte completa rodada após a mudança: 836 checagens em `qa_test_piloto_vaca.js` (era 834), 33/34 arquivos sem falha (mesma baseline conhecida). FUMAÇA está liberada pra gravar (sílaba `ssa.mp3` + palavra `fumaca.mp3`, ver `producao/CHECKLIST_PRODUCAO.md`).

---

## 2026-08-18 — Nível 5 (Digite a Palavra) para de usar voz nativa "crua"

**Contexto:** o Júlio notou que o áudio de instrução do nível 5 ("Digite a palavra banana") sai com a voz genérica do navegador, destoando do resto do app (que usa a voz oficial da Lia + fonética real na maior parte do tempo). Perguntou se dava pra montar a fala da palavra juntando os áudios de sílaba já gravados (ex. `ba`+`na`+`na` pra "banana").

**Causa raiz:** `renderDigitePalavra()` (`app/js/activities-portugues.js`) chamava `speak()` direto — a função de TTS nativo de `utils.js` — em vez de passar pelo `AudioManager`, que é quem decide entre áudio real e TTS (com a folga de 300ms já estabelecida, ver decisão de 2026-08-17 sobre duas vozes sobrepostas). Era o único lugar do jogo que ainda ignorava esse fluxo.

**Decisão sobre a pergunta do Júlio (juntar sílabas):** NÃO fazer isso. Sílabas gravadas isoladas (`ba.mp3`, `na.mp3`) não têm a coarticulação natural da fala contínua — tocadas em sequência soam picadas/robóticas, não como alguém falando "banana" de verdade. É exatamente por isso que o projeto desde o início separa "1 áudio por sílaba" de "1 áudio por palavra inteira" (`TEMPLATES_PROMPTS.md`, "Princípio de economia") — juntar sílabas seria reintroduzir o problema que essa separação já resolve.

**O que mudou:**
- `renderDigitePalavra()` agora chama `AudioManager.queueVoice([...])` com 2 peças, mesmo padrão usado no resto do jogo (ex. `registerAnswerWithCharacterFeedback`): (1) a instrução fixa `digite-a-palavra.mp3` ("Digite a palavra:") — nova fala da Lia, reutilizável por qualquer palavra, **ainda não gravada** (cai pro TTS nativo até lá, mas nunca fica muda); (2) a pronúncia oficial da palavra via `mediaFonetica("palavra", item.word)` — já existe pra 76 das 87 palavras do banco, TTS cobre as 11 que faltam.
- `testes/qa_test_typing.js`, `qa_test_modulo4.js`, `qa_test_prova.js`: ganharam os mesmos stubs de `HTMLMediaElement`/`Audio` que os outros testes de mídia já tinham — sem eles, o `AudioManager.queueVoice` novo travava o jsdom tentando tocar áudio de verdade (mesmo padrão de causa/correção do ajuste de gênero em 2026-08-17).

**Achado incidental, não corrigido (fora do escopo desta mudança):** ao investigar um `jsdomError` intermitente em `qa_test_typing.js`, descobri que é um bug pré-existente e não relacionado — `endSession()` (`game-loop.js`) acessa `CHILD_INFO[state.child].name`, e esse teste específico nunca define `state.child` antes de simular respostas certas no nível 5. Confirmei que o erro acontece igual com o código ANTIGO (`speak()` direto), então não foi introduzido por esta mudança — é uma lacuna do harness de teste (ou, na pior hipótese, um bug real de `state.child` indefinido em algum fluxo de produção ainda não mapeado). Não é falha de teste (o `RESULT` continua "0 failed"), só barulho no console. Fica registrado pra quem for investigar depois, não resolvido agora pra não misturar dois problemas numa mudança só.

Suíte completa rodada após a mudança: 33/34 arquivos sem falha (mesma baseline conhecida em `qa_test_regression.js`), estável.

---

## 2026-08-19 — Monte a Sílaba fecha 100%: últimas 4 sílabas, `bói`→`boi`, ressalva de "boi" contextual

**Contexto:** o Júlio terminou os 4 clusters de sílaba que faltavam (`boi`, `gar`, `lho`, `nho`) e reconfirmou que já tinha terminado antes o áudio de palavra inteira. Ao gravar `boi` (usado em JIBOIA), salvou o arquivo como `bói.MP3` de propósito — pra marcar que o som é o "ó" tônico — e avisou que se uma palavra futura usar "boi" de um jeito átono (ele deu o exemplo "boiadeiro"), o som muda e não seria o mesmo áudio.

**O que mudou:**
- Conferi as 4 sílabas na pasta: `gar.MP3`, `LHO.MP3`, `nho.MP3` já estavam com nome correto (maiúsculo não importa no Windows). `bói.MP3` estava com acento — renomeei pra `boi.mp3`, porque o jogo calcula o nome do arquivo removendo acento (`mediaFileName()` em `media-catalog.js`) e sempre procura `boi.mp3`; com o acento no nome, o arquivo nunca seria encontrado e cairia silenciosamente no TTS nativo (mesma causa/correção do caso `cão.mp3`→`cao.mp3` de 2026-08-18). O CONTEÚDO do áudio (o som "bói" tônico) está certo — só o nome do arquivo precisava mudar.
- Conferi `fonetica/palavras/`: as 87 palavras (incluindo as 10 que faltavam antes — cama, ovo, uva, vela, dente, rio, leite, neve, mola, barco — e FUMAÇA) estão presentes, com nome certo. `pato(1).MP3` (duplicado, achado numa rodada anterior) não existe mais na pasta.

**Sobre a ressalva do Júlio (boi vs. boiadeiro):** é uma limitação real do sistema atual, não uma correção que dava pra fazer agora. O jogo resolve o áudio de sílaba só pelo TEXTO da sílaba (`mediaFonetica("silaba", texto)` → sempre o mesmo arquivo pra o mesmo texto) — não existe hoje nenhum mecanismo pra dar 2 pronúncias diferentes à mesma grafia dependendo da palavra em que ela aparece. Busquei "BOI" em `portugues-conteudo.js`: aparece só 1 vez no banco inteiro (JIBOIA), então não é um bug ativo — é um alerta de design pra quando/se uma palavra como "boiadeiro" for adicionada no futuro. Se isso acontecer, vai exigir uma solução nova (por exemplo, sufixar o nome do arquivo por contexto, ou tratar como caso especial) — não implementado agora porque não há problema real ainda pra resolver, só a possibilidade.

**Efeito no "100%":** as 5 rodadas de "Monte a Sílaba" (níveis 1-5) fecham 100% em mídia real — vídeo de personagem (87/87), áudio de sílaba (33/33) e áudio de palavra inteira (87/87), sem nenhum fallback de TTS pendente no fluxo principal. Restam só itens de limpeza opcional sem efeito no jogo (`rra.mp3`/`rro.mp3` em `fonetica/_a_revisar/`, aguardando confirmação) e a pendência separada, já conhecida, da fala "cena" da Lia pro DIA.

Suíte completa rodada após a conferência: 836 checagens em `qa_test_piloto_vaca.js`, 0 falhas (nenhuma mudança de código nesta rodada, só organização de arquivo e documentação).

---

## 2026-08-19 — Áudio/voz não tocava no celular (autoplay bloqueado sem destravar)

**Contexto:** o Júlio testou no celular e reportou dois sintomas: o vídeo do personagem às vezes não toca sozinho, e as vozes (Lia, sílabas, palavras) simplesmente não saem.

**Causa raiz:** navegadores móveis (Safari iOS, Chrome Android) bloqueiam qualquer `play()` de `<audio>`/`<video>` e qualquer `speechSynthesis.speak()` disparado por código, A MENOS que aconteça DENTRO de um gesto real do usuário (toque/clique) — a partir daí, fica destravado pro resto da sessão. No app, a voz da Lia/fonética sempre toca de forma assíncrona (depois de um `await`, um `setTimeout`, início de rodada) — nunca dentro do próprio evento de toque — então no celular ela nasce sempre bloqueada. No desktop isso não aparecia porque a política de autoplay lá é mais permissiva. O vídeo já tinha um fallback ("▶️ Toque para começar") pra esse mesmo bloqueio — por isso ele "às vezes" tocava sozinho (quando o navegador permitia) e às vezes exigia o toque; já as vozes não tinham NENHUM mecanismo de destravamento nem fallback visual, então ficavam mudas sem aviso nenhum.

**O que mudou:**
- `app/js/audio-manager.js`: novo `AudioManager.unlockAudio()` — toca um áudio silencioso real (`<audio>` com um WAV de silêncio embutido) e dispara+cancela uma fala vazia via `speechSynthesis`, só pra "gastar" a permissão do gesto do usuário. É o mesmo mecanismo usado por bibliotecas de áudio pra web (Howler.js e afins) pra esse exato problema.
- `app/js/navigation.js`: `selectChild()` chama `AudioManager.unlockAudio()` logo no início — é o primeiro toque garantido de toda sessão (escolher Joaquim/Benjamin na tela inicial), sempre antes de qualquer vídeo/voz precisar tocar.
- Vídeo de personagem não mudou — o fallback "toque pra começar" já existente continua cobrindo o caso do navegador ainda bloquear autoplay-com-som mesmo depois do destravamento (comportamento esperado em alguns navegadores/versões, não é bug).

**Testado:** suíte completa rodada, `qa_test_piloto_vaca.js` continua 836/836. Os dois arquivos com erro (`qa_test_regression.js`, `qa_test_new_activities.js`) foram confirmados como falhas PRÉ-EXISTENTES e não relacionadas (reproduzidas de forma idêntica revertendo a mudança e rodando de novo) — mesma causa já documentada antes (`state.child` não definido no harness de teste).
