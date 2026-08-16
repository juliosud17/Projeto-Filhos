# Decisões — Ilha Aprendiz

*Responde "por que fizemos dessa maneira?". Registro append-only: novas entradas se somam, entradas antigas não são reescritas (se uma decisão for revertida, registra-se uma entrada nova explicando a reversão, mantendo a antiga como histórico). Sem isso, depois de centenas de alterações vira impossível responder "por que fizemos isso mesmo?".*

*As entradas abaixo, datadas de "agosto de 2026" sem dia exato, foram retroativamente extraídas dos documentos já existentes (`BRIEFING.md`, `pedagogia/CURRICULO_BNCC_PORTUGUES.md`, `pedagogia/CURRICULO_BNCC_MATEMATICA.md`, `docs/ECOSSISTEMA.md`) na criação deste arquivo — a decisão em si é real e já estava documentada, só não existia num registro dedicado. A partir daqui, toda decisão nova ganha data exata.*

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

**Pendência real:** não tenho como extrair o arquivo de imagem anexado no chat e salvá-lo no repositório — `app/assets/maps/ilha-das-letras.webp` é uma referência reservada até o Júlio fornecer o arquivo final. As coordenadas dos 8 hotspots (`data/mapa-portugues.js`) são estimativa visual da prévia vista no chat, não medição em pixel — precisam de calibração contra o asset real (modo `?calibrar=1` já construído pra isso).

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
