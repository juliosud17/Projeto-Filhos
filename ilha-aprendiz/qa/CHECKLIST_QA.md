# Checklist de QA — Antes de Marcar Algo Como Pronto

*Checklist prático, derivado do padrão já seguido em toda a suíte `testes/` (ver `CASOS_DE_TESTE.md`) e da "regra de governança" original em `docs/ECOSSISTEMA.md` ("nenhum conteúdo novo é considerado pronto sem passar por Pedagógico → Criação → QA"). Usar antes de marcar qualquer atividade/módulo como 🟢 Refinado.*

## Conteúdo (atividade nova ou banco expandido)

- [ ] Renderiza sem erro nos 5 níveis (ou todos os níveis que existirem)
- [ ] Resposta certa sempre presente e clicável — nunca uma rodada sem gabarito nas opções
- [ ] Sem opção duplicada/repetida na mesma rodada
- [ ] Distribuição de dificuldade real por nível (não só o rótulo do nível muda, o conteúdo muda de verdade)
- [ ] Nenhuma repetição de item na mesma sessão, dentro do razoável do tamanho do banco
- [ ] Enunciado falado em voz automaticamente ao renderizar (Web Speech API) — ver `qa_test_speak_coverage.js` como referência de como isso é verificado
- [ ] Simulação automatizada de volume alto (30-60+ rodadas por nível) rodada pelo menos uma vez — bugs intermitentes (item repetido raro, opção duplicada rara) só aparecem em volume

## Gate / progressão

- [ ] Critério de "módulo completo" checado: todas as atividades do módulo em nível 5 com ≥80% de domínio
- [ ] Se o módulo participa de sequência (Português): gate de desbloqueio do próximo módulo exige módulo atual completo **e** Desafio Final aprovado
- [ ] Se o módulo é de Matemática (independente): confirmar que continua sempre desbloqueado, sem depender de outro módulo
- [ ] Card no menu, no painel dos módulos e no admin mostrando contagem/status corretos (bug real já encontrado aqui antes — ver `docs/DECISOES.md`)

## Regressão

- [ ] Suíte inteira revalidada depois da mudança, não só o teste do módulo tocado
- [ ] Falhas conhecidas e já documentadas (`setTimeout` em `qa_test_regression.js`/`qa_test_svg.js`, intermitência em `qa_test_typing.js`) não contam como bloqueio, mas uma falha **nova** sim
- [ ] Se a mudança tocou em código genérico compartilhado (`MODULE_CONTAINERS`, `pickWeightedByLevel`, `isModuleUnlocked`, `activitiesFullyMastered`), rodar a suíte 2-3 vezes seguidas — vários bugs reais documentados neste projeto foram intermitentes, não determinísticos

## Escopo pedagógico

- [ ] Se a habilidade BNCC exige produção real (escrever livre, gravar, entrevistar, pesquisa de campo): não forçar proxy artificial de clique — documentar como fora da tela, seguindo o padrão já registrado em `docs/DECISOES.md`
- [ ] Terminologia técnica (BNCC, nomes de habilidade) não aparece na tela da criança
- [ ] Tom de voz encorajador, nunca punitivo — errar nunca tira estrela/progresso

## Antes de marcar 🟢 Refinado no índice de currículo

- [ ] Todos os itens acima passaram
- [ ] `pedagogia/CURRICULO_BNCC_PORTUGUES.md` ou `CURRICULO_BNCC_MATEMATICA.md` atualizado com o status novo
- [ ] Se foi uma decisão de escopo não óbvia (ex.: "por que isso não virou jogo"), registrada em `docs/DECISOES.md`
