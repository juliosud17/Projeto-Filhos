# Decisões — Ilha Aprendiz

*Responde "por que fizemos dessa maneira?". Registro append-only: novas entradas se somam, entradas antigas não são reescritas (se uma decisão for revertida, registra-se uma entrada nova explicando a reversão, mantendo a antiga como histórico). Sem isso, depois de centenas de alterações vira impossível responder "por que fizemos isso mesmo?".*

*As entradas abaixo, datadas de "agosto de 2026" sem dia exato, foram retroativamente extraídas dos documentos já existentes (`BRIEFING.md`, `pedagogia/CURRICULO_BNCC_PORTUGUES.md`, `pedagogia/CURRICULO_BNCC_MATEMATICA.md`, `docs/ECOSSISTEMA.md`) na criação deste arquivo — a decisão em si é real e já estava documentada, só não existia num registro dedicado. A partir daqui, toda decisão nova ganha data exata.*

---

## 2026-08-16 — Modularizar `app/ilha_aprendiz.html` em CSS/dados/JS, sem servidor e sem build

**Decisão:** dividir o arquivo único (~5.600 linhas) em 15 arquivos (`css/`, `data/`, `js/`), usando `<script src="...">` **clássico** (sem `type="module"`) e conteúdo como `const` em `.js` (não `.json` via `fetch`). `app/ilha_aprendiz.html` (mantido com esse nome, não renomeado pra `index.html`) cai pra 175 linhas.

**Motivo:** a alternativa mais "moderna" (ES modules + JSON via `fetch`) quebra o app sob `file://` por CORS — exigiria servidor local pra abrir, mudando a rotina de uso diário sem necessidade real nesta fase. Scripts clássicos multi-arquivo compartilham o mesmo escopo global de sempre, carregam na ordem das tags, e preservam 100% o "abre com duplo-clique" que já era um princípio do produto.

**Como foi verificado (sem quebrar os 28 módulos já testados):** extração por faixa de linha exata (mapeada via grep antes de cortar, não estimada) — nenhuma linha de lógica foi reescrita manualmente. Duas camadas de verificação depois de cada fase: (1) reconstrução via `testes/_util/load_app_html.js` comparada linha a linha e por conjunto contra o arquivo anterior — confirmando zero perda de conteúdo (só uma reordenação segura: 5 funções de atividade de Português que estavam soltas no fim do arquivo viraram vizinhas do resto das atividades de PT); (2) suíte de 29 testes rodada depois de cada fase, mesmo resultado da baseline em todas (28/29 limpos, a mesma falha já conhecida). Detalhe completo em `docs/ARQUITETURA.md`.

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
