# Roadmap — Ilha Aprendiz

*Responde "onde estamos e o que vem depois?". Este documento muda com frequência — é o painel de controle do momento presente, diferente do `DECISOES.md` (que é histórico e não deve ser reescrito) e do `BRIEFING.md` (que é a fotografia de status mais recente, mais narrativa). Atualizado em 2026-08-16, na criação da camada de documentação viva.*

## Onde estamos

| Frente | Status |
|---|---|
| Conteúdo Português (7/8 módulos em tela) | 🟢 Completo, testado, não validado com o Benjamin jogando |
| Conteúdo Matemática (12/13 módulos em tela) | 🟢 Completo, testado, não validado com o Benjamin jogando |
| Desafio Final (avaliação por módulo) | 🟢 Completo e testado nos 21 módulos com nível |
| Navegação (árvore de 4 telas) | 🟢 Reorganizada |
| Motor de Ensino (Aprender → Ver exemplo → Fazer comigo → Agora é você) | 🟡 Prova de conceito em 2 das 53 atividades (M6 Matemática) |
| Persistência de progresso | 🟢 Existe desde 2026-08-16 (`js/storage.js`, localStorage) |
| Revisão espaçada | 🟢 Existe desde 2026-08-16 (`js/revisao-espacada.js`) |
| Trava de ritmo por bimestre | 🟢 Existe desde 2026-08-16 (`js/ritmo-bimestre.js`, referência informativa) |
| Estrutura de documentação viva (este conjunto de arquivos) | 🟢 Criada em 2026-08-16 |
| Modularização do código (`app/ilha_aprendiz.html` → `js/`, `css/`, `data/`) | 🟢 Feita em 2026-08-16 — ver `docs/ARQUITETURA.md` |
| Arquitetura audiovisual (personagens, voz da Lia, fonética, SFX) | 🟢 Piloto VACA validado e banco de mídia completo desde 2026-08-19/20 (`app/js/media-catalog.js`, `app/js/audio-manager.js`) — as 87 palavras têm vídeo de personagem + áudio de fonética/Lia/SFX reais no projeto (confirmado em `app/assets/`, coberto por `testes/qa_test_piloto_vaca.js`), ver atualização em "Frente paralela" abaixo e `docs/DECISOES.md` |

## Por que essa ordem (o gargalo)

Descoberto em agosto de 2026 (ver `BRIEFING.md` para a conta completa): 265 níveis a dominar entre as duas trilhas, dando entre 530 e ~800 sessões de jogo — 18 a 30 horas de tela no total. Numa dose realista de 15-20 min/dia, **o conteúdo acaba em 3-4 meses**, não no ano letivo inteiro (~200 dias letivos). Três causas identificadas:

1. Distribuição torta entre bimestres — o 1º concentra 34% do conteúdo do ano.
2. Matemática não tem freio — os 12 módulos são independentes entre si, nada impede varrer tudo em poucas semanas.
3. Não existe revisão espaçada — depois do nível 5 + prova aprovada, a atividade nunca mais volta.

Até 2026-08-16, um fator tornava essa discussão só teórica: sem persistência, "quantos dias o conteúdo dura" dependia de quanto tempo a aba ficava aberta, não de dias corridos. Isso está resolvido agora (`js/storage.js`), e a causa 3 (revisão espaçada) também já foi endereçada (`js/revisao-espacada.js`). A causa 2 (Matemática sem freio) ganhou um **sinal informativo** de ritmo (`js/ritmo-bimestre.js`) — não um freio de verdade, de propósito (ver `docs/DECISOES.md`): ainda dá pra varrer tudo, só que agora com um selo visível avisando que está adiantado. Resta a causa 1 (distribuição entre bimestres), item 4 abaixo.

## Próximos passos, em ordem

### ~~1. Persistência de progresso~~ — feito em 2026-08-16
localStorage via `js/storage.js`: nível de cada atividade, histórico de mastery (últimas 10 tentativas), Desafio Final e estrelas sobrevivem a fechar a aba. Detalhe técnico e decisão de escopo em `docs/ARQUITETURA.md` e `docs/DECISOES.md`. Isso desbloqueia os itens 2 e 3 abaixo, que antes não tinham como ser avaliados na prática.

### ~~2. Revisão espaçada~~ — feito em 2026-08-16
Atividades já dominadas voltam em intervalos crescentes (2/5/10/21/45 dias) via o card "🔁 Revisão de Hoje" na tela de Ano Letivo. Desenho completo e decisões de escopo em `pedagogia/REVISAO_ESPACADA.md` e `docs/DECISOES.md`.

### ~~3. Trava de ritmo por bimestre~~ — feito em 2026-08-16
Formato escolhido: **referência informativa, não bloqueio.** Módulo de Matemática cujo bimestre está à frente do bimestre real do calendário ganha um selo "🗓️ Adiantado" (no card do módulo e um resumo no card da trilha) — nenhum módulo fica inacessível por causa disso. Só Matemática (Português já trava por domínio+Desafio Final). Justificativa completa da escolha entre bloqueio rígido vs. referência em `docs/DECISOES.md`.

### 4. Redistribuir densidade entre bimestres
O Módulo 1 de Português (7 atividades, 13% do conteúdo do ano sozinho) e o peso geral do 1º bimestre merecem um olhar; pode fazer sentido quebrar o Módulo 1 ou realocar conteúdo pro 3º bimestre, que hoje está raso.

### 5. Avaliação real com o Benjamin jogando
A etapa que já estava combinada como prioridade desde antes deste documento existir. Persistência, revisão espaçada e o sinal de ritmo já existem — dá pra começar essa avaliação a qualquer momento agora, inclusive em paralelo ao item 4, já que nenhum dos itens restantes é pré-requisito técnico deste.

### ~~Em paralelo: modularização do código~~ — feito em 2026-08-16
`app/ilha_aprendiz.html` já está separado em `css/`, `data/` e `js/` (ver `docs/ARQUITETURA.md`). Isso não estava bloqueando os itens 1-5, mas reduz o risco de trabalhar neles agora — em especial o item 1 (persistência), que nasce como `js/storage.js` novo, e não mais como código espalhado dentro de um arquivo de 5.600 linhas.

## Frente paralela: piloto audiovisual (não bloqueia os itens 1-5 acima)

Arquitetura aprovada e piloto VACA (`ilha-aprendiz`, Módulo 1 → Monte a Sílaba) implementado em código em 2026-08-17 — ver `docs/DECISOES.md` e `docs/audio/MEDIA_GUIDELINES.md`. Estado original desta seção (2026-08-17) listava 3 passos pendentes; atualização em 2026-08-20, saneamento pré-produção (Fase 0.5), com o estado real encontrado no projeto:

1. ~~Adicionar os assets reais no projeto~~ — **feito.** O banco de mídia está completo: as 87 palavras (não só VACA) têm vídeo de personagem (`app/assets/video/personagens/<id>/<id>-intro.mp4`) e áudio de fonética/voz da Lia/SFX reais (`app/assets/audio/`), confirmados fisicamente no projeto e cobertos por `testes/qa_test_piloto_vaca.js` (838 checagens). O código continua com fallback de TTS/beep/emoji pra qualquer asset que venha a faltar.
2. ~~Validação manual~~ — **feita, e encontrou problemas reais já corrigidos**: no celular (GitHub Pages), o TTS estava atravessando/cortando a voz real da Lia (corrigido subindo `GRACE_MS` de 300ms para 1800ms em `app/js/audio-manager.js`, e depois proibindo TTS de vez em "Monte a Sílaba" a pedido do Júlio); também foi encontrado e corrigido um bug de case-sensitivity — 164 arquivos de áudio com nome `.MP3` funcionavam no Windows/`file://` e davam 404 no GitHub Pages (filesystem case-sensitive), ver `docs/DECISOES.md`.
3. Decisão de escalar pra outras palavras/personagens além de VACA — **já tomada e executada**: o banco inteiro (87 palavras) foi escalado, não ficou restrito ao piloto original.

Pendência real ainda aberta (não documental, precisa de ação humana): `docs/audio/VOZ_LIA.md` não tem o Voice ID/modelo/configurações do ElevenLabs preenchidos — Júlio precisa preencher a partir do próprio painel.

## Frente paralela: preparação estrutural para produção (Vite/hospedagem)

Sequência de fases pequenas e reversíveis, separada das frentes pedagógicas
acima, iniciada em 2026-08-20 (ver `docs/PRODUCTION_AUDIT.md` e
`docs/PRODUCAO/ILHA_APRENDIZ_PLANO_MESTRE_PRODUCAO_COMERCIAL.md` para o
plano completo). Estado:

1. ~~Fase 0 — Auditoria de produção~~ — **feita** em 2026-08-20. Ver `docs/PRODUCTION_AUDIT.md`.
2. ~~Fase 0.5 — Saneamento pré-produção~~ — **feita** em 2026-08-20 (correção de bug de TTS, blindagem de BNCC na UI, normalização de case de mídia, QA de assets, documentação viva atualizada). Pendências manuais dessa fase (renomear pastas `audio/Lia`→`audio/lia` e `dígrafos`→`digrafos`) resolvidas pelo Júlio em 2026-08-21.
3. ~~Fase 1 — Preparação estrutural para produção~~ — **feita** em 2026-08-21. Não é a migração para Vite — documentou os contratos que a Fase 2 precisa preservar: ordem de carga dos 24 `<script>` e mapa de globais (`docs/RUNTIME_DEPENDENCIES.md`, `docs/GLOBALS_INVENTORY.md`), paths de asset (`docs/PATHS_MIGRATION.md`), contrato de `localStorage` (`docs/LOCAL_STORAGE_CONTRACT.md`), contrato de IDs (`docs/ID_CONTRACT.md`), auditoria de segredos (nenhum encontrado, `docs/SECRETS_AUDIT_FASE1.md`), `.gitignore` preparado sem quebrar o projeto atual, `docs/ARQUITETURA.md` com a visão de curto prazo, e `docs/VITE_MIGRATION_CHECKLIST.md` operacional pra Fase 2 executar. Nenhum código de produto foi alterado nesta fase.
4. Fase 2 — Migração para Vite — **não iniciada**. Depende de decisão explícita do Júlio pra começar (ver `docs/VITE_MIGRATION_CHECKLIST.md`, seção ANTES).

Achado da Fase 1 que precisa de ação humana (não é código, é decisão/dado
pendente): `docs/audio/VOZ_LIA.md` continua com Voice ID/modelo/configurações
do ElevenLabs como "PENDENTE DE PREENCHIMENTO" no arquivo real do projeto —
apesar de mencionado como resolvido no início desta Fase 1, a checagem
direta do arquivo no dispositivo confirmou que os três campos técnicos
ainda não foram preenchidos (ver `docs/SECRETS_AUDIT_FASE1.md`).

## Fora do roadmap (decisão já tomada, não revisitar sem motivo novo)

- **Módulo 8 de Português** e **M13 de Matemática** — ambos fora da tela por design (projeto leitor semanal / pesquisa de campo). Já estão no formato certo pra habilidade que cobrem, não entram como "pendência".
- **Auditoria de ensino das 51 atividades restantes** (quais precisam de aula completa vs. demonstração rápida vs. podem ir direto pra prática) — mencionada em `pedagogia/MOTOR_DE_ENSINO.md` como próximo passo natural do Motor de Ensino, mas só faz sentido depois de observar onde a criança realmente trava com uso real (item 5).
