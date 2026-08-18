# Checklist de Produção — Monte a Sílaba (banco completo, 87 palavras)

*Atualizar esta tabela conforme os arquivos forem entrando em `app/assets/`. ✅ = já existe no projeto | 🔴 = falta produzir/gravar | ♻️ = sílaba já existe (produzida por outra palavra), só reusar. Status conferido em 2026-08-18 (3ª rodada — vídeos 100%, sílabas quase 100%).*

## 🎉 Vídeos de personagem: 87 de 87 palavras prontos e implementados (2026-08-18)

Confirmado: o `parede.mp4` era mesmo o vídeo do MURO — renomeado pra `personagens/muro/muro-intro.mp4` e registrado no jogo (`character:"muro", genero:"m"`). **As 5 rodadas de "Monte a Sílaba" (níveis 1-5) agora têm vídeo de personagem real em TODAS as 87 palavras.**

## 🎉 Sílabas: 29 das 33 que faltavam já gravadas (2026-08-18)

O Júlio criou as 5 vogais sozinhas e 26 dos 28 clusters de 3+ letras, organizados em duas pastas próprias (`fonetica/avogais/` e `fonetica/dígrafos/`). **Reorganizei tudo pra dentro de `fonetica/silabas/`** — é a única pasta que o app sabe procurar (`mediaFonetica()`, `js/media-catalog.js`, mapeia `silaba` sempre pra pasta `silabas`, não importa o tamanho da sílaba). As pastas `avogais/` e `dígrafos/` ficaram vazias, pode ignorar/apagar quando quiser.

**Ajustes feitos na reorganização:**
- `cão.mp3` → renomeado pra `cao.mp3` (a sílaba de VULCÃO no banco é escrita `CAO`, sem til — mesma regra de sempre, o nome do arquivo segue o dado, não a ortografia acentuada).
- Extensões `.MP3` (maiúsculo) normalizadas pra `.mp3` minúsculo, mesma convenção do resto do projeto (no Windows não fazia diferença técnica, mas mantém tudo consistente).
- **`rra.mp3` e `rro.mp3` não correspondem a nenhuma sílaba usada no banco** (as palavras com RR duplo — CARRO, FERRO — já são cobertas por `car`+`ro` e `fer`+`ro`, nenhuma delas usa "RRA"/"RRO" como sílaba própria). Movidos pra `fonetica/_a_revisar/` sem apagar — se você gravou pensando em outra coisa, me avisa, senão são sobra e dá pra ignorar.

**Ainda faltam 4 clusters** (não veio gravação pra esses):

| Sílaba | Usada em |
|---|---|
| `boi` 🔴 | JIBOIA |
| `gar` 🔴 | GARRAFA |
| `lho` 🔴 | MILHO, JULHO ♻️, COELHO ♻️ |
| `nho` 🔴 | NINHO |

## ⚠️ Achado ainda pendente — decisão necessária antes de gravar o ÁUDIO de FUMAÇA

`mediaFileName()` (`app/js/media-catalog.js`) normaliza acento tirando qualquer marca combinante Unicode — isso é correto pra acento comum (ex. `"LÁ"` → `"la"`, mesmo som, só sem o acento tônico). **Mas `Ç` não é só uma letra acentuada — é uma letra com som diferente de `C`** (Ç soa /s/, C antes de A/O/U soa /k/). A normalização atual reduz `Ç` a `C`, então a sílaba `ÇA` de FUMAÇA calcularia o mesmo arquivo que `CA` (`ca.mp3`) — **isso tocaria o som errado** (kah em vez de sah). Antes de gravar o ÁUDIO de FUMAÇA (o vídeo já está ok, essa pegadinha é só de áudio), preciso de uma decisão sua:
- (a) ajustar `mediaFileName()` pra tratar `Ç` como consoante própria (ex. gerar `ssa` ou manter `ça` como token distinto), ou
- (b) outra forma que você prefira.
Não vou gravar/nomear o áudio de FUMAÇA até isso ficar decidido — as outras 76 palavras não têm esse problema, e enquanto isso a palavra já é jogável normalmente via TTS.

## 📁 Estrutura de pastas (importante)

- Vídeo: `app/assets/video/personagens/<palavra-minuscula>/<palavra-minuscula>-intro.mp4` — as 87 pastas existem e estão todas preenchidas agora.
- Sílaba: `app/assets/audio/fonetica/silabas/<silaba-minuscula-sem-acento>.mp3` — **sempre essa pasta**, não importa se a sílaba tem 1, 2, 3+ letras. Não criar pasta nova por tamanho de sílaba (foi o que aconteceu com `avogais/`/`dígrafos/` desta vez — reorganizei, mas economiza um passo já soltar direto em `silabas/` da próxima vez).
- Palavra inteira: `app/assets/audio/fonetica/palavras/<palavra-minuscula>.mp3`.

## Áudio de palavra inteira — 19 das 87 já existem

`fonetica/palavras/{vaca,gato,pato,sapo,bola,casa,galo,lobo,sino,carro,dedo,dia,mala,mesa,pera,rato,rosa,rua,sete}.mp3` ✅ (Lote A + os 9 do nível 1). As outras 68 faltam — gravar sob demanda, mesma lógica de sempre (1 arquivo por palavra, pronúncia oficial, nunca junto com a voz da Lia). Não bloqueia jogar (fallback TTS).

## Palavras que precisam de atenção extra na pronúncia (consoante dobrada, mesma regra do CAR-RO)

`FERRO` (FER-RO), `OSSO` (OS-SO), `MASSA` (MAS-SA) — ver instrução extra em `TEMPLATES_PROMPTS.md`, seção "Alerta — sílaba com consoante dobrada".

## Falas da Lia (fixas, já prontas — cobrem qualquer palavra, inclusive gênero)

`monte-o-nome.mp3` ✅ (feminino) · `monte-o-nome-genero-masculino.mp3` ✅ (masculino) · `acerto-01.mp3` ✅ · `dica-vamos-ouvir-o-comeco.mp3` ✅. Nenhuma fala nova precisa ser gravada. **Pendência separada:** falta uma variante "cena" pra palavras sem personagem (DIA hoje, JULHO/FESTA/CIDADE se algum dia forem contextuais) — ver `docs/DECISOES.md`, 2026-08-18.

## SFX

`sfx/feedback/acerto.mp3` ✅ · `sfx/feedback/erro.mp3` ✅ — prontos, não precisam de nada novo.

## O que falta pra fechar 100% (vídeo já fechado — só áudio agora)

1. Gravar os 4 clusters que faltam: `boi`, `gar`, `lho`, `nho`.
2. Decidir o caso do `Ç` (FUMAÇA) antes de gravar o áudio dessa palavra especificamente.
3. Gravar as 68 palavras inteiras que faltam.
4. Confirmar o que fazer com `rra.mp3`/`rro.mp3` (em `fonetica/_a_revisar/`).
5. (Fora do escopo de áudio) gravar a variante "cena" da fala da Lia, se quiser fechar a pendência do DIA.
