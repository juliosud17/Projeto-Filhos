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
│   └── licoes.js                (conteúdo do Motor de Ensino)
└── js/
    ├── mastery.js         (domínio/progressão, MODULE_CONTAINERS, Desafio Final)
    ├── navigation.js       (árvore de telas)
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
