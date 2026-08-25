---
paths:
  - producao/**
  - docs/audio/**
  - app/js/audio-manager.js
  - app/js/media-catalog.js
  - app/assets/audio/**
  - app/assets/video/**
---

# Regras de audiovisual

- Preservar a separação de papéis: visual contextualiza, Lia orienta, fonética ensina o som, SFX dá feedback — não misturar essas responsabilidades entre `audio-manager.js` e `media-catalog.js`.
- Mídia (imagem/áudio/vídeo) nunca entrega a resposta da atividade.
- Antes de mover/renomear um asset em `app/assets/audio/` ou `app/assets/video/`, localizar todas as referências em `media-catalog.js` e no código que o consome.
- Mudança no catálogo (`media-catalog.js`) que altera chave/nome/contrato exige checagem de uso em todo o app antes de aplicar.
