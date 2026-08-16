# Changelog — Ilha Aprendiz

*Histórico de mudanças reais entregues, em ordem cronológica reversa (mais recente primeiro). Diferente do `DECISOES.md` (o "por quê") e do `ROADMAP.md` (o "o que vem"), este é o "o que já mudou, quando". A partir de 2026-08-16 este arquivo é alimentado a cada mudança relevante; o histórico anterior a essa data não foi reconstruído em detalhe — está espalhado pelos documentos em `pedagogia/` e no `git log` a partir do commit inicial.*

---

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
