# Checklist de Produção — Monte a Sílaba

*Atualizar esta tabela conforme os arquivos forem entrando em `app/assets/`. ✅ = já existe no projeto | 🔴 = falta produzir. Status conferido em 2026-08-17 (3ª verificação — Lote A fechado).*

## Lote A — produção 100% concluída ✅

| Palavra | Vídeo | Sílaba 1 | Sílaba 2 | Palavra (áudio) | Validado |
|---|---|---|---|---|---|
| VACA | ✅ | VA ✅ | CA ✅ | vaca.mp3 ✅ | 🔴 |
| GATO | ✅ | GA ✅ | TO ✅ | gato.mp3 ✅ | 🔴 |
| PATO | ✅ | PA ✅ | TO ✅ | pato.mp3 ✅ | 🔴 |
| SAPO | ✅ | SA ✅ | PO ✅ | sapo.mp3 ✅ | 🔴 |
| BOLA | ✅ | BO ✅ | LA ✅ | bola.mp3 ✅ | 🔴 |
| CASA | ✅ | CA ✅ | SA ✅ | casa.mp3 ✅ | 🔴 |
| GALO | ✅ | GA ✅ | LO ✅ | galo.mp3 ✅ | 🔴 |
| LOBO | ✅ | LO ✅ | BO ✅ | lobo.mp3 ✅ | 🔴 |
| SINO | ✅ | SI ✅ | NO ✅ | sino.mp3 ✅ | 🔴 |
| CARRO | ✅ | CAR ✅ | RO ✅ | carro.mp3 ✅ | 🔴 |

**Não falta nenhum arquivo de mídia do Lote A.** A única coluna em aberto é a validação manual (não é produção de mídia, é teste no app).

## Sílabas fonéticas — cobertura muito além do Lote A

`app/assets/audio/fonetica/silabas/` tem praticamente o alfabeto inteiro gravado (todos os consoantes de A a Z, incluindo o P completo agora): `ba·be·bi·bo·bu` `ca·ce·ci·co·cu·car` `da·de·di·do·du` `fa·fe·fi·fo·fu` `ga·ge·gi·go·gu` `ha·he·hi·ho·hu` `ja·je·ji·jo·ju` `ka·ke·ki·ko·ku` `la·le·li·lo·lu` `ma·me·mi·mo·mu` `na·ne·ni·no·nu` `pa·pe·pi·po·pu` `qua·quao·que·qui·quo` `ra·re·ri·ro·ru` `sa·se·si·so·su` `ta·te·ti·to·tu` `va·ve·vi·vo·vu` `wa·we·wi·wo·wu` `xa·xe·xi·xo·xu` `za·ze·zi·zo·zu`.

Isso já destrava várias palavras de níveis futuros sem gravar nada novo (ex.: BICO, VELA, NOVE, UVA, PIA, PATA, etc. — conferir letra a letra quando cada uma entrar em produção).

Nota técnica (não bloqueia nada, só registro): parte dos arquivos está com extensão `.MP3` maiúscula e parte `.mp3` minúscula — funciona igual no Windows (case-insensitive), mas pode gerar inconsistência se o projeto for versionado/rodado num sistema case-sensitive no futuro. Ver `docs/audio/MEDIA_GUIDELINES.md`.

## Vídeos de personagem/objeto

| Arquivo | Status |
|---|---|
| Lote A completo (vaca, gato, pato, sapo, bola, casa, galo, lobo, sino, carro) | ✅ 10/10 |
| Níveis 2-5 (77 palavras) | 🔴 — não produzir ainda, esperar validação do Lote A |

## Falas da Lia (fixas, reutilizadas por qualquer palavra)

`monte-o-nome.mp3` ✅ · `acerto-01.mp3` ✅ · `dica-vamos-ouvir-o-comeco.mp3` ✅

## SFX

`sfx/feedback/acerto.mp3` ✅ · `sfx/feedback/erro.mp3` ✅

## Próximo passo — não é mais produção, é validação

Toda a mídia do Lote A está pronta. O que falta agora é rodar o checklist de 10 itens combinado antes de decidir escalar pros próximos níveis:

1. Chrome desktop
2. Chrome Android
3. Safari/iPhone
4. Comportamento de autoplay (com e sem gesto do usuário)
5. Fallback funcionando (desligar/remover um arquivo de propósito e ver se cai pro TTS/beep/emoji sem quebrar)
6. Troca rápida entre telas/atividades
7. Cliques múltiplos rápidos nas opções
8. Sem sobreposição de áudio (voz nova sempre corta a anterior)
9. App funcional mesmo sem nenhuma mídia (teste em pasta vazia/renomeada)
10. Ritmo das rodadas não cansativo (1º encontro vs. repetição)

Só depois dessa validação decidir se escala pros 77 palavras restantes (níveis 2-5) — combinado desde o início: não escalar antes de validar o piloto.
