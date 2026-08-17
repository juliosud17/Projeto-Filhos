# Checklist de Produção — Monte a Sílaba

*Atualizar esta tabela conforme os arquivos forem entrando em `app/assets/`. ✅ = já existe no projeto | ♻️ = sílaba já produzida por OUTRA palavra, só reusar (não regravar) | 🔴 = falta produzir. Status conferido em 2026-08-17.*

## Lote A (produzir/validar primeiro)

| Palavra | Vídeo | Sílaba 1 | Sílaba 2 | Sílaba 3 | Palavra (áudio) | Validado |
|---|---|---|---|---|---|---|
| VACA | ✅ | VA ✅ | CA 🔴 | — | vaca.mp3 ✅ | 🔴 falta CA pra fechar |
| GATO | 🔴 | GA 🔴 | TO 🔴 | — | 🔴 | 🔴 |
| PATO | 🔴 | PA 🔴 | TO ♻️ (mesma de GATO) | — | 🔴 | 🔴 |
| SAPO | 🔴 | SA 🔴 | PO 🔴 | — | 🔴 | 🔴 |
| BOLA | 🔴 | BO ✅ (já existe!) | LA 🔴 | — | 🔴 | 🔴 |
| CASA | 🔴 | CA ♻️ (mesma de VACA) | SA ♻️ (mesma de SAPO) | — | 🔴 | 🔴 |
| GALO | 🔴 | GA ♻️ (mesma de GATO) | LO 🔴 | — | 🔴 | 🔴 |
| LOBO | 🔴 | LO ♻️ (mesma de GALO) | BO ✅ (já existe!) | — | 🔴 | 🔴 |
| SINO | 🔴 | SI 🔴 | NO 🔴 | — | 🔴 | 🔴 |
| CARRO | 🔴 | CAR 🔴 | RO 🔴 | — | 🔴 | 🔴 |

**Prioridade sugerida pra fechar o Lote A com menos trabalho:** gravar `CA` primeiro (fecha VACA sozinha e já serve CASA também) — depois `GA`/`TO` (fecham GATO e reaproveitam em PATO/GALO) — `BOLA` e `LOBO` já têm metade pronta (`BO`), só falta `LA`/`LO`.

## Sílabas já produzidas (reutilizáveis, além do Lote A)

Estas já existem em `app/assets/audio/fonetica/silabas/` e podem ser reaproveitadas em palavras de níveis futuros sem gravar de novo:

`ba` · `be` · `bi` · `bo` · `bu` · `va` · `ve` · `vi` · `vo` · `vu`

Exemplos de onde já servem: `BICO` (BI+CO, falta só CO), `VELA` (VE+LA, falta só LA — mesma LA que falta pra BOLA), `NOVE` (NO+VE, falta só NO — mesma NO que falta pra SINO), `UVA` (U+VA, falta só U).

## Palavras (áudio da palavra inteira)

| Arquivo | Status |
|---|---|
| `fonetica/palavras/vaca.mp3` | ✅ |
| todas as outras (86 restantes) | 🔴 gerar sob demanda, à medida que cada palavra entrar em produção |

## Vídeos de personagem/objeto

| Arquivo | Status |
|---|---|
| `video/personagens/vaca/vaca-intro.mp4` | ✅ |
| Lote A restante (gato, pato, sapo, bola, casa, galo, lobo, sino, carro) | 🔴 |
| Níveis 2-5 (77 palavras) | 🔴 — não produzir ainda, esperar validação do Lote A |

## Falas da Lia (não entram nesta contagem — são fixas e já prontas)

`monte-o-nome.mp3` ✅ · `acerto-01.mp3` ✅ · `dica-vamos-ouvir-o-comeco.mp3` ✅ — reutilizadas por qualquer palavra, não repetir por palavra.
