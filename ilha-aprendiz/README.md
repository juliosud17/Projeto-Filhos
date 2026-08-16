# Ilha Aprendiz — pasta do projeto

Tudo que temos até agora, organizado em 3 partes:

## `app/`
- **`ilha_aprendiz.html`** — o app em si. Um único arquivo HTML autocontido (HTML+CSS+JS, sem dependências externas) — basta abrir no navegador. Nenhum progresso é salvo entre sessões ainda (sem localStorage), fechar a aba zera tudo.

## `docs/`
- **`BRIEFING-ilha-aprendiz.md`** — comece por aqui. Propósito, conteúdo construído, o gargalo de ritmo (o conteúdo dura 3-4 meses numa dose realista, não o ano inteiro) e os próximos passos propostos.
- **`indice-curriculo-ilha-aprendiz.md`** — índice completo da trilha de Português (8 módulos, BNCC EF01LP, status de cada um, o sistema de Desafio Final).
- **`indice-curriculo-matematica-ilha-aprendiz.md`** — índice completo da trilha de Matemática (13 módulos, BNCC EF01MA).
- **`arquitetura-trilha-portugues-1ano.md`** — decisões de arquitetura de conteúdo da trilha de Português.
- **`curriculo-portugues-benjamin.md`** — levantamento inicial do currículo de Português.
- **`modulo8-projeto-leitor.md`** — detalhamento do Módulo 8 (Projeto Leitor, fora da tela por design).
- **`ilha-aprendiz-ecossistema-empresa.md`** — notas sobre o ecossistema/visão maior do projeto.
- **`referencia-nova-escola.md`** — material de referência usado na curadoria de conteúdo.

## `testes/`
Suíte de testes automatizados (Node + jsdom) que valida o app inteiro — cada módulo, o sistema de Desafio Final, a navegação em árvore, digitação, admin, cobertura de fala, etc. Para rodar qualquer um:

```
node testes/qa_test_nome.js
```

(exige o `ilha_aprendiz.html` no caminho `/tmp/ilha_aprendiz.html` — ajuste o `fs.readFileSync` no topo do arquivo de teste se for rodar fora deste ambiente).
