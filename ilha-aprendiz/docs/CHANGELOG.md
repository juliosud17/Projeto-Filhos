# Changelog — Ilha Aprendiz

*Histórico de mudanças reais entregues, em ordem cronológica reversa (mais recente primeiro). Diferente do `DECISOES.md` (o "por quê") e do `ROADMAP.md` (o "o que vem"), este é o "o que já mudou, quando". A partir de 2026-08-16 este arquivo é alimentado a cada mudança relevante; o histórico anterior a essa data não foi reconstruído em detalhe — está espalhado pelos documentos em `pedagogia/` e no `git log` a partir do commit inicial.*

---

## 2026-08-21 — Fase 1: preparação estrutural para produção (contratos pré-Vite)

Seguindo a sequência de fases pequenas e reversíveis do plano de produção
(`docs/PRODUCTION_AUDIT.md`, `docs/PRODUCAO/ILHA_APRENDIZ_PLANO_MESTRE_PRODUCAO_COMERCIAL.md`).
**Não é a migração para Vite** — só documentação de contratos, para minimizar
risco da Fase 2. Nenhum código de `app/` foi alterado; só documentação e
`.gitignore`. Baseline de testes conferida antes e depois: 37/38 arquivos
limpos, mesma falha já conhecida (`qa_test_regression.js`), zero falhas
novas.

- **`docs/RUNTIME_DEPENDENCIES.md`** (novo): ordem exata dos 24 `<script>`, o que cada arquivo produz/consome de globais, confirmação de que não existe `DOMContentLoaded`/`window.onload` (o bootstrap real é `loadProgress()`+`updateGlobalStars()` no fim de `js/storage.js`), inventário de `onclick=` inline e dinâmico, referências adiantadas (candidato mais próximo de dependência circular que o projeto tem hoje), e paths de asset dependentes da posição do HTML.
- **`docs/GLOBALS_INVENTORY.md`** (novo): todos os globais do projeto classificados em A (dado curricular) a H (compatibilidade/legado), com origem, consumidores e risco de modularização futura.
- **`docs/PATHS_MIGRATION.md`** (novo): todo path runtime auditado por categoria (HTML, assets, áudio, vídeo, imagem, dados, CSS, fontes, `file://`) com comportamento atual, esperado sob Vite, risco e ação prevista — nenhum path alterado nesta fase.
- **`docs/LOCAL_STORAGE_CONTRACT.md`** (novo): a única chave de `localStorage` do projeto (`ilhaAprendizProgresso`) documentada campo a campo, com exemplo anonimizado e risco de perda de dado se o schema mudar sem migração.
- **`docs/ID_CONTRACT.md`** (novo): IDs de criança, atividade, módulo/container, personagem, palavra e nível classificados em ESTÁVEL/INTERNO/VISUAL, com risco de renomeação para cada categoria.
- **`docs/SECRETS_AUDIT_FASE1.md`** (novo): varredura por segredos/chaves de API — nenhum encontrado. Achado registrado: `docs/audio/VOZ_LIA.md` continua com Voice ID/modelo/configurações do ElevenLabs pendentes no arquivo real do projeto, apesar de mencionado como resolvido no início desta fase.
- **`docs/VITE_MIGRATION_CHECKLIST.md`** (novo): checklist operacional pra Fase 2 executar (ANTES/DURANTE/TESTES AUTOMÁTICOS/VALIDAÇÃO MANUAL/CRITÉRIO DE APROVAÇÃO/ROLLBACK) — nenhum passo executado nesta fase.
- **`docs/ARQUITETURA.md`**: nova seção "Duas visões" — arquitetura atual (sem build step) e visão de curto prazo (Vite, ainda não implementada), lado a lado.
- **`docs/ROADMAP.md`**: nova seção resumindo o estado da frente de preparação para produção (Fases 0/0.5/1 feitas, Fase 2 não iniciada) e o achado pendente do Voice ID da Lia.
- **`.gitignore`** (raiz de `10_PROJETO_FILHOS/`): preparado para o futuro sem quebrar o projeto atual — adiciona `dist/`, `.env`/`.env.*` (com exceção explícita pra `.env.example`), logs e arquivos temporários/de SO comuns. `app/assets/` e demais artefatos reais do produto continuam fora do `.gitignore`.
- Vite, Supabase, backend, login, PWA, service worker, React e ES Modules **não foram introduzidos** — fora do escopo desta fase, conforme combinado.

## 2026-08-20 — Fase 0.5: saneamento pré-produção (achados da auditoria de produção)

Seguindo `docs/PRODUCTION_AUDIT.md` (Fase 0, aprovada), correções pontuais dos problemas encontrados na auditoria, sem nenhuma mudança estrutural (sem Vite, sem Supabase, sem ES Modules, sem dependência nova). Checkpoint de commit e baseline de testes registrados antes de qualquer alteração, conforme `claude/REGRAS_PERMANENTES.md`.

- **Bug do TTS globalmente desligado (item 13 da auditoria)**: `AudioManager.setTtsAllowed(false)` era chamado 1x em `renderSilabas()` e nada revertia depois — uma vez visitado "Monte a Sílaba", o TTS ficava mudo pro resto da sessão em qualquer outra atividade. Corrigido tornando a política contextual: `game-loop.js`'s `renderRound()` (único funil de toda rodada de toda atividade) agora recalcula `setTtsAllowed` a cada rodada, de acordo com a atividade da vez. "Monte a Sílaba" continua proibida de usar TTS (decisão de 2026-08-20 preservada). Teste novo: `testes/qa_test_tts_context.js`.
- **Vazamento de código BNCC na UI infantil (item 18.6 da auditoria)**: `desc` de 38 atividades (matemática + português) terminava com o código de habilidade entre parênteses (ex. "(EF01MA01)"), e esse texto ia direto pro card que a criança toca (`renderAtividades()`, `navigation.js`). Os dados (`app/data/matematica-atividades.js`, `portugues-atividades.js`) continuam intocados, com o código — só a renderização voltada à criança agora usa `descricaoSemBncc()` (nova, `app/js/utils.js`), que também expõe `extrairCodigoBncc()` pra uso futuro em painel de responsáveis/admin. Teste novo: `testes/qa_test_bncc_ui.js`.
- **Case-sensitivity em `mediaCharacterVideo()` (item 14 da auditoria)**: diferente de toda outra função `media*()`, não normalizava `characterId` via `mediaFileName()` antes de montar o caminho. Sem bug ativo confirmado (os 87 valores reais de `character` já são minúsculos/sem acento), mas era um risco estrutural do mesmo tipo que já causou um incidente real (164 áudios `.MP3`→`.mp3` no GitHub Pages). Corrigido em `app/js/media-catalog.js` (`mediaCharacterVideo`, `mediaCharacterSound`) de forma retrocompatível — nenhum asset precisou ser renomeado. Teste novo: `testes/qa_test_media_case.js`.
- **`docs/audio/VOZ_LIA.md`**: Voice ID/modelo/configurações do ElevenLabs continuavam com placeholder — atualizado para deixar explícito que são **PENDENTE DE PREENCHIMENTO PELO RESPONSÁVEL** (Júlio precisa preencher a partir do painel ElevenLabs; não foi inferido nem inventado nenhum valor).
- **Documentação viva desatualizada**: `docs/ROADMAP.md` (status da frente audiovisual, que ainda dizia "assets ainda não adicionados" — na verdade banco de 87 palavras completo desde 2026-08-19/20), `docs/BRIEFING.md` (nota nova, mesmo padrão da nota de 2026-08-16 já existente, sem reescrever o histórico) e `docs/ECOSSISTEMA.md` (correções pontuais de afirmações que diziam "sem persistência"/"2 de 8 módulos", ambas desatualizadas) atualizados só nos pontos comprovadamente errados, com notas datadas preservando o texto original.
- Suíte completa (36 arquivos após os 3 testes novos): 35/36 sem falha, única falha é a já documentada (`qa_test_regression.js`, flakiness de `setTimeout`/jsdom). Nenhuma falha nova.

## 2026-08-20 — TTS PROIBIDO no "Monte a Sílaba" (pedido direto do Júlio)

- `app/js/audio-manager.js`: `AudioManager.setTtsAllowed(v)` novo -- quando `false`, TTS nunca toca, mesmo se o áudio real falhar de verdade. `renderSilabas()` (`activities-portugues.js`) chama isso logo no início, cobrindo os 5 níveis do módulo.
- Delay artificial de "esperar o TTS terminar de falar" virou fixo e curto (200ms) quando TTS está desligado -- não faz mais sentido esperar algo que não vai falar.
- `qa_test_piloto_vaca.js`: reescrita grande (seções 3-7) -- estava construído simulando "mp3 não existe" e observando comportamento via TTS, premissa dupla e obsoleta (banco 100% completo + TTS agora proibido). Passou a simular sucesso de áudio por padrão e checar via `audioLog` (URLs reais tocadas, em ordem) em vez de `spokenLog`. Nova checagem dedicada: mesmo com falha REAL simulada do áudio, TTS não entra.
- `qa_test_speak_coverage.js`: exceção documentada pra `silabas` (não fala mais via TTS, de propósito).
- Suíte: `qa_test_piloto_vaca.js` 838/838, `qa_test_speak_coverage.js` 26/26, sem falha nova.

## 2026-08-20 — TTS cortando a voz da Lia no celular (GRACE_MS aumentado)

- `app/js/audio-manager.js`: `GRACE_MS` (folga antes de cair pro TTS) de 300ms para 1800ms — no celular pela rede, o mp3 às vezes demorava mais que 300ms pra confirmar `playing`, o TTS entrava otimisticamente e era cortado no meio quando o áudio real alcançava.
- `audio.preload = "auto"` adicionado, pra ajudar o download do mp3 começar mais rápido.
- Caso de arquivo genuinamente ausente continua caindo pro TTS na hora (evento `error`, não depende do `GRACE_MS`) — a mudança só afeta o caso "arquivo existe mas demorou", seguro agora que o banco de mídia está 100% completo.
- Suíte: `qa_test_piloto_vaca.js` 836/836, sem falha nova nos outros arquivos.

## 2026-08-19 — Áudio/voz destravado pra celular (autoplay bloqueado sem gesto do usuário)

- `app/js/audio-manager.js`: novo `AudioManager.unlockAudio()` — toca áudio silencioso + fala vazia (speechSynthesis) pra "gastar" a permissão do gesto do usuário, destravando `play()`/`speak()` assíncronos pro resto da sessão em navegador móvel.
- `app/js/navigation.js`: `selectChild()` chama `unlockAudio()` logo no início (primeiro toque garantido de toda sessão).
- Causa: iOS Safari/Chrome Android bloqueiam `play()`/`speak()` disparado por código fora de um gesto real — a voz da Lia/fonética sempre tocava de forma assíncrona, então nascia sempre bloqueada no celular (não acontecia no desktop).
- Vídeo de personagem não mudou — o fallback "▶️ Toque para começar" já existente continua cobrindo o caso do navegador ainda bloquear autoplay-com-som.
- Suíte: `qa_test_piloto_vaca.js` 836/836. Falhas em `qa_test_regression.js`/`qa_test_new_activities.js` confirmadas pré-existentes, não relacionadas.

## 2026-08-19 — Monte a Sílaba fecha 100% (vídeo + sílabas + palavra inteira)

- Últimas 4 sílabas gravadas (`boi`, `gar`, `lho`, `nho`) — sílabas agora 33/33.
- `bói.MP3` renomeado pra `boi.mp3` (o jogo procura sem acento; conteúdo do áudio já estava certo).
- `fonetica/palavras/` conferida: 87/87 palavras presentes, incluindo as 10 que faltavam antes + FUMAÇA. Duplicata `pato(1).MP3` não existe mais.
- `digite-a-palavra.mp3` (fala da Lia do nível 5) confirmado gravado e no lugar certo — nível 5 usa a voz oficial, sem fallback de TTS.
- Ressalva registrada (não é bug ativo, é limitação de design pra futuro): sílaba "boi" hoje só serve pro som tônico de JIBOIA — se uma palavra futura usar "boi" átono (ex. "boiadeiro"), vai precisar de solução nova, já que o sistema atual dá sempre a mesma pronúncia pra mesma grafia de sílaba. Ver `docs/DECISOES.md`.
- **Efeito:** as 5 rodadas de "Monte a Sílaba" (níveis 1-5) estão 100% em mídia real — sem nenhum fallback de TTS pendente no fluxo principal.

## 2026-08-18 — Nível 5 (Digite a Palavra) para de usar voz nativa "crua"

- `app/js/activities-portugues.js`: `renderDigitePalavra()` trocou `speak()` direto por `AudioManager.queueVoice([...])` com 2 peças — a instrução fixa `digite-a-palavra.mp3` (nova, ainda não gravada, cai pro TTS até lá) + a pronúncia oficial da palavra (`mediaFonetica("palavra", ...)`, já existe pra 76/87).
- Decisão explícita de NÃO montar a palavra juntando áudios de sílaba (ex. ba+na+na) — soa picado/robótico, sem coarticulação natural. Mantém a separação já estabelecida entre áudio de sílaba e de palavra inteira.
- `qa_test_typing.js`, `qa_test_modulo4.js`, `qa_test_prova.js` ganharam os stubs de mídia que faltavam.
- Achado incidental (não corrigido, fora do escopo): `qa_test_typing.js` tem um `jsdomError` pré-existente e não relacionado (`endSession()` acessa `CHILD_INFO[state.child].name` sem `state.child` definido no teste) — confirmado que já acontecia com o código antigo, registrado em `docs/DECISOES.md` pra investigar depois.

## 2026-08-18 — Bug do Ç corrigido, FUMAÇA liberada pra gravar

- `app/js/media-catalog.js`: `mediaFileName()` trata `Ç` como consoante própria (vira `"ss"`) ANTES do NFD, em vez de deixar o acento genérico reduzi-lo a `C` — `ÇA` não colide mais com `CA` (som errado corrigido).
- `app/data/portugues-conteudo.js`: 3ª sílaba de FUMAÇA corrigida de `"CA"` pra `"ÇA"` (grafia real) — jogo mostra/cobra a sílaba certa na tela, não só no áudio.
- `testes/qa_test_piloto_vaca.js`: checagem dedicada do bug + ajuste na checagem genérica de sílaba. Suíte: 836 checagens (era 834), 33/34 arquivos sem falha.
- FUMAÇA liberada: sílaba `ssa.mp3` + palavra `fumaca.mp3` podem ser gravadas normalmente agora.

## 2026-08-18 — Banco 100% em vídeo (MURO confirmado) + sílabas quase completas

- `parede.mp4` confirmado como o vídeo do MURO, renomeado e registrado (`character:"muro", genero:"m"`) — as 87 palavras do banco têm vídeo de personagem real agora.
- Áudio de sílaba: 31 arquivos (5 vogais + 26 clusters) reorganizados de `fonetica/avogais/`/`fonetica/dígrafos/` (pastas que o app não reconhece) pra `fonetica/silabas/` (a única que `mediaFonetica()` resolve, sempre, não importa o tamanho da sílaba). `cão.mp3` renomeado pra `cao.mp3` (dado do banco é sem til); extensões `.MP3` normalizadas pra `.mp3`.
- Achado: `rra.mp3`/`rro.mp3` não correspondem a nenhuma sílaba usada no banco — movidos pra `fonetica/_a_revisar/`, aguardando confirmação. Ainda faltam 4 clusters: `boi`, `gar`, `lho`, `nho`.
- `testes/qa_test_piloto_vaca.js`: checagem "banco inteiro tem character" sem mais exceção hardcoded. Suíte: 834 checagens (era 826), 33/34 arquivos sem falha (mesma baseline).

## 2026-08-18 — Banco quase 100%: 86 das 87 palavras com vídeo de personagem

- 68 vídeos soltos reorganizados em `personagens/<palavra>/<palavra>-intro.mp4`. `app/data/portugues-conteudo.js`: as 68 ganharam `character`+`genero` — total 86/87 do banco jogável com vídeo real (só falta MURO).
- `testes/qa_test_piloto_vaca.js` e `testes/qa_test_svg.js`: checagens hardcoded por lista de palavras trocadas por checagens estruturais sobre `WORDS` inteiro (escalam sozinhas). `qa_test_svg.js`: teste do SVG do TATU em modo tile reescrito — ficou inatingível de propósito (TATU agora sempre vai pro vídeo).
- Achado, não resolvido: pasta `personagens/muro/` vazia + um `parede.mp4` sem palavra correspondente movido pra `personagens/_a_revisar/` — aguardando confirmação do Júlio se é o vídeo do MURO.
- Suíte completa: 826 checagens em `qa_test_piloto_vaca.js` (era 125), 33/34 arquivos sem falha (mesma baseline conhecida).
- As 5 rodadas de "Monte a Sílaba" já são 100% jogáveis (vídeo real + fallback TTS onde falta áudio de sílaba/palavra — a maioria ainda não gravada, ver `producao/CHECKLIST_PRODUCAO.md`).

## 2026-08-18 — Nível 1 quase completo: mais 8 palavras jogáveis com personagem

- `app/data/portugues-conteudo.js`: RATO, MALA, ROSA, DEDO, MESA, RUA e PERA ganharam `character`+`genero`; DIA também (cena contextual, sol nascendo) — só SETE do nível 1 segue sem vídeo (por design, não vira personagem). Mesmo padrão do Lote A, zero lógica nova.
- 8 vídeos reorganizados pra `personagens/<palavra>/<palavra>-intro.mp4`; as 87 pastas do banco inteiro pré-criadas vazias pra evitar a mesma dúvida de novo.
- `testes/qa_test_piloto_vaca.js`: checagem "fora do Lote A não tem character" trocada por `PALAVRAS_COM_CHARACTER` (Lote A + as 8 novas), com checagem específica pros 8 itens. Suíte: 125 checagens no arquivo (era 124), 33/34 arquivos sem falha na suíte completa (mesma baseline conhecida em `qa_test_regression.js`).
- Pendência conhecida e não resolvida: DIA usa fala fixa de "personagem chegou" que não bate com o vídeo de cena — falta a variante "cena" da fala da Lia (ver `docs/DECISOES.md`, 2026-08-18).

## 2026-08-17 — Concordância de gênero na fala de instrução da Lia

- "...e monte o nome dela!" estava errado pra palavras masculinas (GATO, PATO, SAPO, GALO, LOBO, SINO, CARRO). Novo campo explícito `genero` ("m"|"f") em cada palavra do Lote A escolhe entre `monte-o-nome.mp3`/"dela" e `monte-o-nome-genero-masculino.mp3`/"dele" — nunca inferido por heurística de terminação (quebra com exceções do português).
- `montaFalaIntroPersonagem(item)` novo em `app/js/activities-portugues.js`.
- De quebra, corrigido: `qa_test_speak_coverage.js` e `qa_test_svg.js` ganharam os stubs de mídia que faltavam (agora várias palavras têm `character`, e esses testes genéricos não tinham o stub) — e um flake estatístico pré-existente em `qa_test_svg.js` (100 → 400 tentativas). Suíte completa: 33/34 sem falha, estável em várias rodadas seguidas.

## 2026-08-17 — Lote A inteiro escalado (9 personagens além da Vaca)

- `app/data/portugues-conteudo.js`: GATO, PATO, SAPO, BOLA, CASA, GALO, LOBO, SINO e CARRO ganharam `character` — entram no mesmo fluxo de personagem+Lia+fonética que só a VACA tinha, sem nenhuma mudança de código (a arquitetura já suportava escalar só com dado novo).
- `docs/characters/CHARACTER_BIBLE.md`: entrada consolidada pros 8 novos personagens/objetos.
- `testes/qa_test_piloto_vaca.js`: nova seção de smoke test estrutural pros 9 personagens novos (vídeo, opções, caminhos de mídia) — suíte do piloto foi de 40 pra 95 checagens. Suíte completa: 33/34 sem falha (mesma baseline).
- Ainda falta: validação manual (checklist de 10 itens) das 9 palavras novas — só a VACA foi validada ao vivo até agora.

## 2026-08-17 — Piloto VACA: corrige duas vozes sobrepostas (TTS + MP3 real)

- Bug visto ao vivo: no acerto da VACA, o MP3 real da Lia e a leitura por TTS que já existia antes tocavam ao mesmo tempo, audíveis juntas.
- `playVoiceItem()` (`app/js/audio-manager.js`) não fala mais por TTS imediatamente em paralelo ao MP3 — espera até 300ms o áudio real confirmar que começou a tocar antes de considerar o TTS. Continua garantindo que nunca fica mudo (arquivo ausente/erro/demora cai pro TTS), só não sobrepõe mais quando o áudio real funciona.
- `testes/qa_test_piloto_vaca.js` ajustado pra checar o novo comportamento assíncrono. Suíte completa: 33/34 sem falha (mesma baseline conhecida).

## 2026-08-17 — Piloto VACA: vídeo do personagem sempre completo (Lote A validado ao vivo)

- Produção do Lote A concluída: 10/10 vídeos de personagem, todas as sílabas fonéticas do Lote A (incluindo `PA`/`PO` que faltavam, mais o P inteiro por bônus), 9/10 áudios de palavra inteira (só faltava confirmar VACA, que já existia), falas fixas da Lia e SFX de acerto/erro — tudo presente em `app/assets/`.
- Testado ao vivo pela 1ª vez: 1º encontro com VACA funcionou (vídeo, instrução, montagem, sons de acerto na ordem certa). No 2º encontro (mesma sessão), a "introdução reduzida" (pular o vídeo, ajuste original da aprovação da arquitetura) entrou em ação como desenhado — mas o Júlio decidiu reverter: **vídeo completo em toda aparição do personagem**, porque prende mais a atenção da criança do que evita "cansaço".
- `runWordIntro()` (`app/js/activities-portugues.js`) não pula mais o vídeo em reencontros — `characterIntroSeen` continua registrado mas não afeta mais o fluxo. `testes/qa_test_piloto_vaca.js` ajustado (seção 5 agora espera vídeo no 2º encontro, não a ausência dele). Suíte completa: 33/34 sem falha (mesma baseline conhecida).
- `producao/CHECKLIST_PRODUCAO.md` atualizado pra refletir Lote A 100% produzido — falta só a validação manual (checklist de 10 itens) antes de decidir escalar pros 77 palavras restantes.

## 2026-08-17 — Piloto VACA, rodada 2: orquestração audiovisual por Promise/async-await

- `AudioManager.queueVoice()` passa a retornar `Promise` (além de continuar aceitando callback); `playVoice(item)` novo (1 item, retorna `Promise`); `playCharacterIntro()` novo (Promise-wrapper de `mountCharacterIntro`); `pronounceAndHighlight(element, item)` novo — sincroniza destaque visual (`.is-speaking`) com a pronúncia tocando, reutilizável por qualquer atividade audiovisual futura.
- `registerAnswerWithCharacterFeedback()` e `runWordIntro()` (antes `startCharacterIntroRound()`) viram `async`, sequência `await` legível em vez de `setTimeout`s adivinhados — `nextRoundDelay` do acerto cai de um chute de 4800ms pra 700ms de respiro, porque a rodada só avança depois que o áudio já terminou de verdade.
- No acerto, cada sílaba (VA → CA → VACA) é destacada visualmente enquanto sua pronúncia toca; no erro, o destaque vai no botão de opção com a sílaba certa (dica, sem revelar a 2ª sílaba).
- `media-catalog.js` e os fallbacks existentes preservados integralmente — mudança é só de orquestração, não de conteúdo/paths.
- `docs/audio/MEDIA_GUIDELINES.md` ganha a seção "Orquestração de cena", documentando o padrão pra atividades audiovisuais futuras.
- `testes/qa_test_piloto_vaca.js`: 39 checagens (9 novas). Suíte completa: mesma baseline conhecida.

## 2026-08-17 — Arquitetura audiovisual (personagens/voz/fonética/SFX) + piloto VACA

- Frente paralela nova: arquitetura de mídia aprovada (árvore de pastas, nomenclatura, Audio Manager mínimo, separação Lia×fonética, ritmo de introdução) antes de produzir qualquer asset em massa — documento de análise+proposta discutido e aprovado com 3 ajustes.
- `app/js/media-catalog.js` (novo): caminhos de mídia derivados por convenção a partir dos dados existentes, com `mediaFonetica(tipo, texto)` de tipo **explícito** (letra/silaba/palavra/numero) — nunca heurística de tamanho de texto.
- `app/js/audio-manager.js` (novo): canal de voz (Lia+fonética, 1 fala por vez) e canal de SFX, com fallback pra TTS/`beep()` sempre que o arquivo real não existir/falhar — `mountCharacterIntro()` cuida do vídeo do personagem com fallback de autoplay bloqueado (toque pra começar) e arquivo ausente (cai pro emoji).
- `data/portugues-conteudo.js`: `WORDS.VACA` ganha o único campo novo, `character:"vaca"` — nenhuma outra palavra muda.
- `js/activities-portugues.js` (`renderSilabas`): quando o item tem `character`, corrige o bug real de TTS que entregava a resposta (`speak("Monte a palavra " + item.word)`) — instrução da Lia nunca cita a palavra; opções ficam desabilitadas até a instrução terminar; 1º encontro do personagem na sessão mostra o vídeo completo, encontros seguintes pulam pro visual estático (não obriga introdução longa toda rodada); acerto toca Lia + fonética (VA, CA, VACA) como arquivos separados, erro revela só a 1ª sílaba como dica.
- `js/game-loop.js` (`registerAnswer`): 3º parâmetro opcional `opts` (`skipBeep`, `nextRoundDelay`), 100% retrocompatível — usado só pelo piloto.
- Documentos novos: `docs/audio/VOZ_LIA.md`, `docs/characters/CHARACTER_BIBLE.md` (só Lia + Vaca), `docs/audio/MEDIA_GUIDELINES.md`.
- **Nenhum asset real (vídeo/áudio) entrou no projeto ainda** — nem o `vaca-intro.mp4` mencionado como já existente foi encontrado na pasta conectada. Todo o suporte de fallback já está pronto pra quando os arquivos forem adicionados (caminhos exatos documentados em `docs/audio/MEDIA_GUIDELINES.md`).
- `testes/qa_test_piloto_vaca.js` novo (30 checagens). Suíte completa: 33/34 arquivos limpos, mesma falha já conhecida e documentada (`qa_test_regression.js`), nenhuma falha nova.

## 2026-08-17 — Ilha das Letras, rodada 3: destino mais claro, popover limpo, mobile de verdade

- Calculado (não suposto) que `contain`+`%` sozinho não aguenta os 3 tamanhos de celular pedidos (360/390/430px) — marcadores mais próximos chegam a se tocar. Abaixo de 600px, o mapa vira maior que a tela num container que rola nativamente (`overflow:auto`, sem lib externa), centralizado no destino atual ao abrir.
- Popover deixa de abrir em `:hover` (só clique/toque/foco) — corrige o comportamento de "aparecer aberto sozinho" ao entrar na Ilha.
- Destino atual ganha selo "✨" estático além do halo já existente; `prefers-reduced-motion` desativa as animações sem perder a identificação (primeiras `@media` do projeto, junto com a de 600px).
- Cabeçalho do mapa e subtítulo da tela de Atividades ficam contextuais conforme o progresso real (1ª aventura / novo destino / aventura em andamento), em vez do texto fixo — só leitura de `moduleStatus()`, sem lógica de mastery nova.
- Hierarquia do "Voltar" (exercício → Atividades → Mapa → Matérias) conferida — já estava correta, sem mudança de código, só teste novo cobrindo a cadeia inteira.
- Path/checkpoints da arte e "abrir popover na 1ª visita" avaliados e adiados de propósito (documentado o porquê em `docs/DECISOES.md`).
- `testes/qa_test_mapa_portugues.js`: 72 checagens (20 novas). Suíte completa: mesma baseline conhecida.

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
