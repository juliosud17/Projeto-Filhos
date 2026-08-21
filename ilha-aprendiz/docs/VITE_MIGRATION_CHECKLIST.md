# Checklist Operacional — Migração para Vite (Fase 2)

*Preparado na FASE 1 (PASSO 11), a partir dos contratos documentados em
`docs/RUNTIME_DEPENDENCIES.md`, `docs/GLOBALS_INVENTORY.md`,
`docs/PATHS_MIGRATION.md`, `docs/LOCAL_STORAGE_CONTRACT.md`,
`docs/ID_CONTRACT.md` e `docs/ARQUITETURA.md`. Este documento é um
checklist para EXECUTAR na Fase 2 — nada aqui foi executado nesta fase.
Vite não foi instalado. Nenhum passo abaixo foi marcado como feito.*

## ANTES (preparação, antes de tocar em qualquer arquivo)

- [ ] Confirmar `git status` limpo e branch correta (mesma disciplina da Fase 0/0.5/1: commit de checkpoint antes de começar).
- [ ] Registrar o commit exato usado como ponto de partida da Fase 2 (assim como esta Fase 1 registrou `d402686` como baseline).
- [ ] Rodar `npm test` (suíte completa) e o QA de assets, e comparar com a baseline desta Fase 1 (37/38, só `qa_test_regression.js` falhando, conhecido) — qualquer diferença precisa ser investigada ANTES de instalar o Vite, não depois.
- [ ] Reler `docs/RUNTIME_DEPENDENCIES.md` inteiro — a ordem dos 24 `<script>` e as referências adiantadas (seção 4 daquele documento) são o maior risco de regressão silenciosa.
- [ ] Reler `docs/GLOBALS_INVENTORY.md` — decidir explicitamente, antes de escrever qualquer código, se a Fase 2 vai manter scripts clássicos (risco baixo, ganho menor) ou migrar para ES Modules (risco alto, exige resolver toda referência adiantada e todo `onclick=` inline do HTML).
- [ ] Reler `docs/PATHS_MIGRATION.md` — decidir explicitamente se `app/assets/` vira `public/assets/` estático (recomendado) ou asset processado/hasheado pelo Vite (exige reescrever `media-catalog.js`).
- [ ] Instalar Vite como devDependency (`npm install --save-dev vite`) — não instalado nesta Fase 1, de propósito (PASSO 12).

## DURANTE (execução)

- [ ] Adicionar scripts de `package.json`: `"dev": "vite"`, `"build": "vite build"`, `"preview": "vite preview"` — preservando `"test": "node testes/_run_all.js"` como está, sem alterar.
- [ ] Preservar `app/ilha_aprendiz.html` como o HTML principal (mover para a raiz do projeto Vite se o Vite exigir, mas manter o conteúdo/estrutura de telas intacto — nenhuma tela, `id`, ou `onclick` deve mudar só por causa da migração de build).
- [ ] Confirmar o entry point: hoje é implícito (as 24 tags `<script>`, bootstrap em `js/storage.js` linhas 133-134 — ver `RUNTIME_DEPENDENCIES.md` seção 1). Decidir se a Fase 2 mantém esse bootstrap implícito ou o torna explícito (`main.js`/`init()`) — documentar a decisão em `docs/DECISOES.md` quando tomada.
- [ ] Ajustar todos os paths conforme `docs/PATHS_MIGRATION.md` — `css/app.css`, os 24 `<script src>`, `MEDIA_BASE`, e o path literal do mapa (`js/mapa-portugues.js:56`, fora do padrão `MEDIA_BASE` — ver nota naquele documento).
- [ ] Preservar `app/assets/` como pasta estática servida (`public/assets/` do Vite, ou equivalente) — sem mover, renomear ou reorganizar nenhum arquivo de mídia como parte desta migração (reorganização de assets é trabalho à parte, fora do escopo da Fase 2 tal como a Fase 1 a definiu).
- [ ] Preservar CSS (`css/app.css`) sem reescrever — só ajustar o caminho de import/link conforme a config do Vite exigir.
- [ ] Preservar a ordem de carga dos 24 scripts — se migrar para `import`, cada import deve respeitar exatamente a mesma ordem de dependência documentada em `docs/RUNTIME_DEPENDENCIES.md` seção 3, incluindo tratar as referências adiantadas da seção 4 (checagem tardia ou import explícito, não confiar em ordem de carga implícita de módulo).
- [ ] Resolver a transição `file://` → HTTP: qualquer suposição de protocolo (`window.location.protocol`, checagem de `file:`) deve ser auditada — não encontrada nenhuma nesta Fase 1, mas reconferir no início da Fase 2 caso algo tenha mudado desde então.
- [ ] Preservar o schema de `localStorage["ilhaAprendizProgresso"]` exatamente como está em `docs/LOCAL_STORAGE_CONTRACT.md` — nenhuma migração de dado do usuário deve acontecer só por causa da troca de bundler.
- [ ] Confirmar que áudio (`assets/audio/...`) continua carregando e tocando sob HTTP/Vite dev server (comportamento de autoplay de navegador pode diferir entre `file://` e `http://` — testar manualmente, item da seção VALIDAÇÃO MANUAL abaixo).
- [ ] Confirmar que vídeo (`assets/video/...`) continua carregando e tocando sob HTTP/Vite dev server, mesma ressalva de autoplay.
- [ ] Confirmar que o mapa interativo (`assets/maps/ilha-das-letras.webp`, path literal fora de `MEDIA_BASE`) carrega corretamente.

## TESTES AUTOMÁTICOS

- [ ] `npm test` (suíte `testes/qa_test_*.js`, Node + jsdom) — deve continuar rodando exatamente como hoje, já que testa o HTML/JS diretamente via `testes/_util/load_app_html.js`, independente do Vite. Zero falhas novas em relação à baseline desta Fase 1 (37/38 — só `qa_test_regression.js`, conhecido).
- [ ] QA de assets (`testes/qa_test_assets_qa.js`) — rodar especificamente, incluindo a varredura real de `app/assets/` no disco (não só no ambiente de verificação em nuvem, que pula essa parte por não ter os assets binários — ver nota na Fase 1, PASSO 0/13).
- [ ] Rodar a suíte também depois do `vite build` (não só em `vite dev`) — comportamento de build pode diferir de dev server.

## VALIDAÇÃO MANUAL

- [ ] Abrir o app via `vite dev` no navegador e percorrer manualmente: seleção de criança → menu → módulo → atividade → rodada completa → tela de fim → Desafio Final.
- [ ] Confirmar áudio/vídeo tocando (autoplay, sem gesto de usuário vs. com gesto — navegadores bloqueiam autoplay de forma diferente por origem/protocolo).
- [ ] Confirmar `localStorage` persiste entre reload (F5) e entre fechar/abrir aba, com dados reais preservados.
- [ ] Confirmar mapa interativo (Ilha das Letras) — hotspots, popovers, scroll em mobile.
- [ ] Testar em pelo menos um dispositivo mobile real ou emulado (360px de largura, conforme os cálculos de responsividade já documentados em `docs/ARQUITETURA.md`).
- [ ] Testar `vite build` + `vite preview` (simula produção) além de `vite dev`.
- [ ] Painel admin (`openAdmin()`) — inspecionar e resetar progresso continuam funcionando.

## CRITÉRIO DE APROVAÇÃO

- [ ] Zero falhas novas na suíte automatizada em relação à baseline da Fase 1.
- [ ] Todas as telas navegáveis manualmente sem erro de console novo.
- [ ] Áudio e vídeo funcionando sob HTTP (não só sob `file://`).
- [ ] `localStorage` de uma sessão real (não just de teste) sobrevive à migração sem perda de dado.
- [ ] Nenhum `onclick=` inline quebrado (todas as 21 ocorrências do HTML estático, mais as geradas dinamicamente — ver `docs/RUNTIME_DEPENDENCIES.md` seção 6).
- [ ] `docs/ARQUITETURA.md` atualizado para refletir a arquitetura real pós-migração (a "visão de curto prazo" desta Fase 1 vira a "visão atual").
- [ ] `docs/DECISOES.md` registra a decisão de ES Modules vs. scripts clássicos, e de assets estáticos vs. processados, com data e motivo.

## ROLLBACK

- [ ] Se qualquer critério de aprovação falhar: reverter para o commit de checkpoint registrado no início da Fase 2 (`git reset`/`git checkout` da branch de trabalho, nunca forçar sobre `master` sem confirmação explícita do Júlio — mesma regra de commit-antes-de-mudança-grande de `claude/REGRAS_PERMANENTES.md`).
- [ ] Como o app não depende de nenhuma migração de schema de `localStorage` para funcionar sob Vite (dado já preservado no formato atual), reverter o código basta — não há necessidade de reverter dado do usuário junto, desde que nenhuma alteração de schema tenha sido feita durante a tentativa.
- [ ] Documentar em `docs/DECISOES.md` o motivo do rollback, se ocorrer, com o mesmo padrão de transparência já usado nas fases anteriores deste projeto.
