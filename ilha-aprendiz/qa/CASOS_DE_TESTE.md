# Casos de Teste — Mapa da Suíte

*O que cada arquivo em `testes/` cobre, pra saber onde olhar quando algo quebra sem precisar abrir os 28 arquivos. Node + jsdom, todos exigem `ilha_aprendiz.html` em `/tmp/ilha_aprendiz.html` (ver pendência técnica em `docs/ARQUITETURA.md`). Rodar: `node testes/qa_test_nome.js`.*

## Conteúdo — Português

| Arquivo | Cobre |
|---|---|
| `qa_test_modulo2.js` / `qa_test_modulo2_complete.js` | Módulo 2 (Leitura de Palavras): renderização por nível, gate de desbloqueio do Módulo 3, cards de menu/admin |
| `qa_test_escrita_certa.js` | Atividade Escrita Certa (Módulo 2): pares certo/erro ortográfico |
| `qa_test_modulo3.js` | Módulo 3 (Frases e Textos Curtos): Parlendas, Som do Meio/Fim, Pontuação Certa |
| `qa_test_modulo4.js` | Módulo 4 (Produções Escritas): fluxo de digitação nas 3 atividades, cobertura do gênero "legenda" (correção BNCC 2026-08-16) |
| `qa_test_modulo5.js` | Módulo 5 (Compreensão): Sinônimos/Antônimos, Qual é o Gênero?, Ler e Responder |
| `qa_test_modulo6.js` | Módulo 6 (Narrativas): inclui teste determinístico da mecânica de ordenar (Reconte a História) |
| `qa_test_modulo7.js` | Módulo 7 (Gramática): Substantivo/Verbo, Que Ação Combina?, Pontuação no Textinho |

## Conteúdo — Matemática

| Arquivo | Cobre |
|---|---|
| `qa_test_math_m1.js` … `qa_test_math_m12.js` | Um arquivo por módulo M1-M12 — as atividades daquele módulo em todos os 5 níveis, geralmente 60 rodadas simuladas por atividade/nível, checagem de opção duplicada, resposta certa sempre encontrável, gate de desbloqueio (sempre destravado, trilha independente). `m1`/`m3`/`m7` também verificam as variantes/vocabulário corrigidos na auditoria BNCC de 2026-08-16 (`qa/auditorias/auditoria_bncc_oficial.md`) |

## Sistemas transversais

| Arquivo | Cobre |
|---|---|
| `qa_test_ritmo_bimestre.js` | Trava de ritmo por bimestre (`js/ritmo-bimestre.js`): mapeamento mês→bimestre, detecção de módulo adiantado, agregação por trilha, renderização (Matemática mostra selo, Português nunca mostra) |
| `qa_test_revisao_espacada.js` | Revisão espaçada (`js/revisao-espacada.js`): vencimento por estágio, montagem/pontuação da sessão, avanço condicionado, card condicional, integração com `endSession()`, resets do admin, persistência |
| `qa_test_persistencia.js` | Persistência (`js/storage.js`): round-trip save/load, defesas contra dado corrompido/versão errada/valor fora do range, `clearProgress()`, hooks reais do admin |
| `qa_test_prova.js` | Desafio Final: fluxo completo (dominar módulo → bloqueado até passar → aprovar → desbloqueia próximo → reset via admin), critério 80% geral + 60% por atividade |
| `qa_test_motor_ensino.js` | Motor de Ensino (Aprender → Ver exemplo → Fazer comigo → Agora é você): aula na 1ª vez, "Pular aula", "Rever aula", sugestão após 3 erros seguidos |
| `qa_test_nav_tree.js` | Navegação em árvore de 4 telas (Ano Letivo → Matéria → Módulo → Atividades): cada nível de navegação, voltar sem perder contexto, Joaquim continua na lista simples |
| `qa_test_mapa_portugues.js` | Ilha das Letras (`js/mapa-portugues.js`): 8 hotspots acessíveis, os 5 estados visuais (marcador compacto + anel de progresso), popover sob demanda por estado (conteúdo, CTA presente/ausente, só 1 aberto por vez, **fechado por padrão** ao entrar, nomeia a atividade específica antes de clicar), clique no marcador abre popover (não navega), **CTA abre o jogo direto (`screen-game`) ou o Desafio Final, pulando a grade de Atividades** (`proximaAtividadeDoModulo`: pula pra 2ª atividade quando a 1ª já está concluída; abre Desafio Final em MASTERED e em DESAFIO_APROVADO; Módulo 8 continua abrindo Projeto Leitor), "próximo destino" (`computeDestinoAtual`) em 3 cenários de progresso e confirmação de que não altera mastery/prova, 3 mensagens de cabeçalho contextuais (`mensagemDestinoAtual`), cadeia completa de "Voltar" (exercício→Mapa→Matérias, sem mais passar por Atividades), `calcularScrollCentralizado()` como função pura, regra `prefers-reduced-motion` presente no CSS, `renderAtividades()`/`backToModulos()` continuam corretos se chamados diretamente (Matemática/uso futuro), Matemática inalterada |
| `qa_test_admin.js` | Painel de admin: pular pra qualquer nível/atividade, reset individual e geral, bloqueio de módulo não construído |
| `qa_test_typing.js` | Digitação em campo de texto (aceita minúscula, ignora acento) — conhecida por ter intermitência ocasional, não confundir com bug novo |
| `qa_test_speak_coverage.js` | Cobertura de fala (Web Speech API): confirma que toda atividade fala o enunciado automaticamente ao renderizar |
| `qa_test_svg.js` | Ícones SVG próprios (TATU, COLA, GOLA, COLEIRA, GOLEIRA) renderizam sem colisão visual |
| `qa_test_regression.js` | Suíte de regressão ampla — força atividades a nível 5/90% mastery e simula fim de sessão/level-up; conhecida por um artefato de `setTimeout` no harness (não é bug real) |
| `qa_test_new_activities.js` | Atividades adicionadas fora do lote original de cada módulo |
| `qa_test_piloto_vaca.js` | Piloto audiovisual VACA (`js/media-catalog.js`, `js/audio-manager.js`): paths do catálogo (fonética por tipo explícito, não por tamanho), campo `character` só em VACA, fallback pra TTS/beep quando mídia não existe, instrução nunca revela a resposta, opções desabilitadas até a instrução terminar, 2º encontro pula o vídeo, separação Lia×fonética no acerto (4 itens) e dica no erro (só 1ª sílaba) |

## O que falta neste mapa

Os 5 itens originais do `docs/ROADMAP.md` (persistência, revisão espaçada, trava de ritmo, redistribuir densidade, avaliação real) já têm cobertura de teste onde fazia sentido ter — os dois últimos são trabalho de conteúdo/observação, não código, então não geram teste automatizado por natureza. Regra permanente em `claude/REGRAS_PERMANENTES.md` continua valendo: toda funcionalidade nova de código exige teste novo.
