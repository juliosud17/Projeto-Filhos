# Checklist de Produção — Monte a Sílaba (banco completo, 87 palavras)

*Atualizar esta tabela conforme os arquivos forem entrando em `app/assets/`. ✅ = já existe no projeto | 🔴 = falta produzir/gravar | ♻️ = sílaba já existe (produzida por outra palavra), só reusar. Status conferido em 2026-08-18 (2ª rodada — vídeos de personagem quase 100% completos).*

## 🎉 Vídeos de personagem: 86 das 87 palavras prontos e implementados (2026-08-18)

O Júlio gravou e organizou os vídeos de praticamente o banco inteiro numa tacada só. Todas as 5 rodadas de "Monte a Sílaba" (níveis 1-5) já jogam com vídeo de personagem real em quase toda palavra — ver tabela por nível abaixo. **Falta só 1: MURO.**

**Pendência aberta — MURO:** a pasta `personagens/muro/` está vazia. Apareceu um arquivo `parede.mp4` solto (sem pasta correspondente, "parede" não é palavra do banco) — pode ser o vídeo do MURO com nome trocado, ou pode ser sobra de outra coisa. Movi ele pra `personagens/_a_revisar/parede.mp4` sem tocar — **preciso que você confirme**: se for o vídeo do MURO, é só renomear pra `personagens/muro/muro-intro.mp4` que eu registro no jogo; se não for, me avisa o que fazer com ele.

**Áudio (sílabas + palavra inteira): a maior parte ainda falta, mas isso NÃO bloqueia jogar.** O app tem fallback garantido pra TTS (voz sintética do navegador) sempre que o MP3 real não existe — é assim desde o piloto da Vaca (ver `docs/DECISOES.md`). Ou seja: as 5 rodadas já são 100% jogáveis agora, com vídeo real + voz sintética nas sílabas/palavras que ainda não têm áudio gravado. Ver seção de áudio mais abaixo pra ir substituindo TTS por gravação real, no seu ritmo.

## 📁 Estrutura de pasta dos vídeos (importante)

Cada palavra precisa da PRÓPRIA pasta em `app/assets/video/personagens/<palavra-minuscula>/`, com o vídeo dentro renomeado pra `<palavra-minuscula>-intro.mp4` (ex. `personagens/mala/mala-intro.mp4`) — é assim que o app calcula o caminho automaticamente (`mediaCharacterVideo`, `js/media-catalog.js`). Todas as 87 pastas continuam criadas (a de MURO ainda vazia) — é só soltar o vídeo dentro da pasta certa e renomear.

## ⚠️ Achado ainda pendente — decisão necessária antes de gravar o ÁUDIO de FUMAÇA

`mediaFileName()` (`app/js/media-catalog.js`) normaliza acento tirando qualquer marca combinante Unicode — isso é correto pra acento comum (ex. `"LÁ"` → `"la"`, mesmo som, só sem o acento tônico). **Mas `Ç` não é só uma letra acentuada — é uma letra com som diferente de `C`** (Ç soa /s/, C antes de A/O/U soa /k/). A normalização atual reduz `Ç` a `C`, então a sílaba `ÇA` de FUMAÇA calcularia o mesmo arquivo que `CA` (`ca.mp3`) — **isso tocaria o som errado** (kah em vez de sah). Antes de gravar o ÁUDIO de FUMAÇA (o vídeo já está ok, essa pegadinha é só de áudio), preciso de uma decisão sua:
- (a) ajustar `mediaFileName()` pra tratar `Ç` como consoante própria (ex. gerar `ssa` ou manter `ça` como token distinto), ou
- (b) outra forma que você prefira.
Não vou gravar/nomear o áudio de FUMAÇA até isso ficar decidido — as outras 76 palavras não têm esse problema, e enquanto isso a palavra já é jogável normalmente via TTS.

## Vídeos de personagem — status por nível (2026-08-18, 2ª rodada)

| Nível | Total | Produzidos | Faltam |
|---|---|---|---|
| 1 | 16 | 16 (todas!) | 0 |
| 2 | 22 | 21 | 1 (MURO) |
| 3 | 22 | 22 (todas!) | 0 |
| 4 | 11 | 11 (todas!) | 0 |
| 5 | 16 | 16 (todas!) | 0 |
| **Total** | **87** | **86** | **1 (MURO)** |

Todas as palavras com vídeo já estão implementadas no jogo (`character`+`genero` em `portugues-conteudo.js`), incluindo os casos especiais: DIA (cena contextual — pendência da fala da Lia registrada em `docs/DECISOES.md`) e SETE (o plano original era não ter vídeo de personagem pra essa palavra, mas o Júlio gravou mesmo assim e foi implementado).

## Legenda de reuso — sílabas que JÁ EXISTEM cobrem a maioria do banco

Praticamente todo o alfabeto (consoante + A/E/I/O/U) já está gravado. Isso já resolve a maior parte das sílabas simples de 2 letras do banco inteiro (ex. `BO`, `TO`, `SA`, `RA`, `MA`...). O que falta são só sílabas de **3+ letras (clusters/dígrafos)** e as **5 vogais sozinhas** (A/E/I/O/U, usadas quando uma palavra tem sílaba de 1 letra só, ex. RU-**A**, L-**U**-A, C-**O**-ELHO).

## Sílabas que FALTAM gravar (33 no total — cobre o banco inteiro; ver bloco do Ç acima pra FUMAÇA)

### Vogais sozinhas (5) — usadas em várias palavras, gravar uma vez só

| Sílaba | Usada em |
|---|---|
| `a` 🔴 | RUA, DIA, LUA, ANEL, ILHA, AGULHA, JIBOIA |
| `e` 🔴 | COELHO |
| `i` 🔴 | ILHA |
| `o` 🔴 | OVO, RIO, NAVIO |
| `u` 🔴 | UVA |

### Clusters/dígrafos de 3+ letras (28) — cada um é único, sem reuso possível fora do indicado

| Sílaba | Usada em | Sílaba | Usada em |
|---|---|---|---|
| `ar` 🔴 | ARCO | `nel` 🔴 | ANEL |
| `bar` 🔴 | BARCO | `nho` 🔴 | NINHO |
| `boi` 🔴 | JIBOIA | `os` 🔴 | OSSO |
| `bra` 🔴 | ZEBRA, COBRA ♻️ | `pis` 🔴 | LÁPIS |
| `cao` 🔴 | VULCÃO | `por` 🔴 | PORCO |
| `cha` 🔴 | CHAVE | `quei` 🔴 | QUEIJO |
| `den` 🔴 | DENTE | `sor` 🔴 | SORVETE |
| `dim` 🔴 | PUDIM | `ur` 🔴 | URSO |
| `drez` 🔴 | XADREZ | `vem` 🔴 | NUVEM |
| `fer` 🔴 | FERRO (mesma pegadinha de pronúncia do CAR-RO, ver `TEMPLATES_PROMPTS.md`) | `vro` 🔴 | LIVRO |
| `fes` 🔴 | FESTA | `vul` 🔴 | VULCÃO |
| `gar` 🔴 | GARRAFA | `lha` 🔴 | ILHA, AGULHA ♻️ |
| `gre` 🔴 | TIGRE | `lho` 🔴 | MILHO, JULHO ♻️, COELHO ♻️ |
| `lei` 🔴 | LEITE | `mas` 🔴 | MASSA |

*(`ça` de FUMAÇA fica de fora desta lista até a decisão acima.)*

## Áudio de palavra inteira — só as 10 do Lote A existem

`fonetica/palavras/{vaca,gato,pato,sapo,bola,casa,galo,lobo,sino,carro}.mp3` ✅. As outras 77 faltam — gravar sob demanda, mesma lógica de sempre (1 arquivo por palavra, pronúncia oficial, nunca junto com a voz da Lia). Não bloqueia jogar (fallback TTS).

## Palavras que precisam de atenção extra na pronúncia (consoante dobrada, mesma regra do CAR-RO)

`FERRO` (FER-RO), `OSSO` (OS-SO), `MASSA` (MAS-SA) — ver instrução extra em `TEMPLATES_PROMPTS.md`, seção "Alerta — sílaba com consoante dobrada".

## Falas da Lia (fixas, já prontas — cobrem qualquer palavra, inclusive gênero)

`monte-o-nome.mp3` ✅ (feminino) · `monte-o-nome-genero-masculino.mp3` ✅ (masculino) · `acerto-01.mp3` ✅ · `dica-vamos-ouvir-o-comeco.mp3` ✅. Nenhuma fala nova precisa ser gravada. **Pendência separada:** falta uma variante "cena" pra palavras sem personagem (DIA hoje, JULHO/FESTA/CIDADE se algum dia forem contextuais) — ver `docs/DECISOES.md`, 2026-08-18.

## SFX

`sfx/feedback/acerto.mp3` ✅ · `sfx/feedback/erro.mp3` ✅ — prontos, não precisam de nada novo.

## Ordem sugerida pra fechar 100% (vídeo + áudio)

1. Confirmar o caso do `parede.mp4`/MURO (bloco no topo) — resolve o único vídeo que falta.
2. Decidir o caso do `Ç` (FUMAÇA) antes de gravar o áudio dessa palavra especificamente.
3. Gravar as 5 vogais sozinhas (A/E/I/O/U) — destrava várias palavras de uma vez.
4. Gravar os 28 clusters — cada um destrava só a(s) palavra(s) indicada(s) na tabela.
5. Gravar as 77 palavras inteiras que faltam.
6. (Fora do escopo de áudio) gravar a variante "cena" da fala da Lia, se quiser fechar a pendência do DIA.
