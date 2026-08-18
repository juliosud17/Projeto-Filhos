# Checklist de Produção — Monte a Sílaba (banco completo, 87 palavras)

*Atualizar esta tabela conforme os arquivos forem entrando em `app/assets/`. ✅ = já existe no projeto | 🔴 = falta produzir/gravar | ♻️ = sílaba já existe (produzida por outra palavra), só reusar. Status conferido em 2026-08-18.*

## 📁 Estrutura de pasta dos vídeos (importante)

Cada palavra precisa da PRÓPRIA pasta em `app/assets/video/personagens/<palavra-minuscula>/`, com o vídeo dentro renomeado pra `<palavra-minuscula>-intro.mp4` (ex. `personagens/mala/mala-intro.mp4`) — é assim que o app calcula o caminho automaticamente (`mediaCharacterVideo`, `js/media-catalog.js`). **Todas as 87 pastas já estão criadas vazias** — é só soltar o vídeo dentro da pasta certa e renomear pra `<palavra>-intro.mp4`. Se cair solto na raiz de `personagens/` eu organizo, mas economiza um passo já soltar direto na pasta.

## ⚠️ Achado durante esta checagem — decisão necessária antes de gravar FUMAÇA

`mediaFileName()` (`app/js/media-catalog.js`) normaliza acento tirando qualquer marca combinante Unicode — isso é correto pra acento comum (ex. `"LÁ"` → `"la"`, mesmo som, só sem o acento tônico). **Mas `Ç` não é só uma letra acentuada — é uma letra com som diferente de `C`** (Ç soa /s/, C antes de A/O/U soa /k/). A normalização atual reduz `Ç` a `C`, então a sílaba `ÇA` de FUMAÇA calcularia o mesmo arquivo que `CA` (`ca.mp3`) — **isso tocaria o som errado** (kah em vez de sah). Antes de gravar FUMAÇA, preciso de uma decisão sua:
- (a) ajustar `mediaFileName()` pra tratar `Ç` como consoante própria (ex. gerar `ssa` ou manter `ça` como token distinto), ou
- (b) outra forma que você prefira.
Não vou gravar/nomear o áudio de FUMAÇA até isso ficar decidido — as outras 76 palavras não têm esse problema.

## Legenda de reuso — sílabas que JÁ EXISTEM cobrem a maioria do banco

Praticamente todo o alfabeto (consoante + A/E/I/O/U) já está gravado — ver lista completa nas rodadas anteriores. Isso já resolve a maior parte das sílabas simples de 2 letras do banco inteiro (ex. `BO`, `TO`, `SA`, `RA`, `MA`...). O que falta são só sílabas de **3+ letras (clusters/dígrafos)** e as **5 vogais sozinhas** (A/E/I/O/U, usadas quando uma palavra tem sílaba de 1 letra só, ex. RU-**A**, L-**U**-A, C-**O**-ELHO).

## Sílabas que FALTAM gravar (33 no total — cobre o banco inteiro)

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

`fonetica/palavras/{vaca,gato,pato,sapo,bola,casa,galo,lobo,sino,carro}.mp3` ✅. As outras 77 faltam — gravar sob demanda, mesma lógica de sempre (1 arquivo por palavra, pronúncia oficial, nunca junto com a voz da Lia).

## Vídeos de personagem — status por nível

| Nível | Total | Produzidos | Faltam |
|---|---|---|---|
| 1 | 16 | 15 (BOLA, CASA, GATO, PATO, VACA, SAPO, GALO, RATO, MALA, ROSA, DEDO, MESA, RUA, PERA, DIA) | 1 (SETE) |
| 2 | 22 | 2 (LOBO, SINO) | 20 |
| 3 | 22 | 1 (CARRO) | 21 |
| 4 | 11 | 0 | 11 |
| 5 | 16 | 0 | 16 |
| **Total** | **87** | **18** | **69** |

Nível 1 quase fechado (2026-08-18) — só falta o vídeo de **SETE** (pasta `personagens/sete/` já criada, esperando `sete-intro.mp4`). As outras 15 palavras do nível 1 já estão implementadas no jogo (`character`+`genero` em `portugues-conteudo.js`), incluindo DIA (cena contextual — ver `docs/DECISOES.md` pra pendência da fala da Lia).

Prompts de vídeo pras 77 palavras que faltam: `producao/PROMPTS_VIDEO_TODAS_PALAVRAS.md` (gerado em 2026-08-17, a partir das ações em português já registradas em `BANCO_87_PALAVRAS.md`).

## Palavras que precisam de atenção extra na pronúncia (consoante dobrada, mesma regra do CAR-RO)

`FERRO` (FER-RO), `OSSO` (OS-SO), `MASSA` (MAS-SA) — ver instrução extra em `TEMPLATES_PROMPTS.md`, seção "Alerta — sílaba com consoante dobrada".

## Falas da Lia (fixas, já prontas — cobrem qualquer palavra, inclusive gênero)

`monte-o-nome.mp3` ✅ (feminino) · `monte-o-nome-genero-masculino.mp3` ✅ (masculino) · `acerto-01.mp3` ✅ · `dica-vamos-ouvir-o-comeco.mp3` ✅. Nenhuma fala nova precisa ser gravada pras próximas palavras — só decidir o campo `genero` de cada uma quando forem implementadas no jogo (mesma regra da escala do Lote A: nunca inferir da palavra, sempre explícito).

## SFX

`sfx/feedback/acerto.mp3` ✅ · `sfx/feedback/erro.mp3` ✅ — prontos, não precisam de nada novo.

## Ordem sugerida pra fechar o banco com menos trabalho

1. Gravar as 5 vogais sozinhas (A/E/I/O/U) — destrava várias palavras de uma vez (RUA, DIA, LUA, OVO, UVA, RIO, ANEL, ILHA, NAVIO, COELHO, AGULHA, JIBOIA).
2. Gravar os 28 clusters — cada um destrava só a(s) palavra(s) indicada(s) na tabela.
3. Decidir o caso do `Ç` (FUMAÇA) antes de gravar essa palavra especificamente.
4. Produzir os 77 vídeos (prompts prontos em `PROMPTS_VIDEO_TODAS_PALAVRAS.md`).
5. Gravar as 77 palavras inteiras.
6. Implementar no jogo (`character` + `genero` em `portugues-conteudo.js`) só depois de cada leva de mídia estar pronta — mesmo padrão usado pro Lote A (não registrar `character` de uma palavra sem a mídia real dela existir).
