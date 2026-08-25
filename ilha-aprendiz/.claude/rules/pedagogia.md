---
paths:
  - pedagogia/**
  - app/data/**
  - app/js/game-loop.js
  - app/js/revisao-espacada.js
  - app/js/ritmo-bimestre.js
  - app/js/navigation.js
  - app/js/storage.js
---

# Regras de pedagogia

- Critério de domínio (mastery, em `game-loop.js`) não pode ser alterado sem revisão pedagógica prévia.
- Progressão/pré-requisitos/unlock (`ritmo-bimestre.js`, `navigation.js`) não podem ser reordenados sem justificativa registrada.
- Algoritmo de revisão espaçada (`revisao-espacada.js`) não pode ser enfraquecido só para "destravar" progresso do usuário.
- Contratos de progresso persistidos (`storage.js`) não podem mudar de formato sem migração de dados existentes.
- Dados de BNCC (`app/data/`) são metadado de rastreabilidade — não podem virar UI voltada à criança.
