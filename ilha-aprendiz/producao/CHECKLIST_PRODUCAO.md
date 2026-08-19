# Checklist de Produção — Monte a Sílaba (banco completo, 87 palavras)

*Atualizar esta tabela conforme os arquivos forem entrando em `app/assets/`. ✅ = já existe no projeto | 🔴 = falta produzir/gravar | ♻️ = sílaba já existe (produzida por outra palavra), só reusar. Status conferido em 2026-08-19 (5ª rodada — vídeo, sílabas E palavra inteira 100%).*

## 🎉 Vídeos de personagem: 87 de 87 palavras prontos e implementados (2026-08-18)

Confirmado: o `parede.mp4` era mesmo o vídeo do MURO — renomeado pra `personagens/muro/muro-intro.mp4` e registrado no jogo (`character:"muro", genero:"m"`). **As 5 rodadas de "Monte a Sílaba" (níveis 1-5) agora têm vídeo de personagem real em TODAS as 87 palavras.**

## 🎉 Sílabas: 33 de 33 completas (2026-08-19)

O Júlio gravou as 5 vogais e os 28 clusters de 3+ letras (organizados em `fonetica/avogais/`/`fonetica/dígrafos/`, reorganizados pra `fonetica/silabas/` — é a única pasta que o app sabe procurar, `mediaFonetica()` em `js/media-catalog.js` mapeia `silaba` sempre pra pasta `silabas`, não importa o tamanho da sílaba) e, nesta rodada, terminou os 4 clusters que faltavam: `boi`, `gar`, `lho`, `nho`. **Confirmado no jogo, arquivo por arquivo — todas as 33 sílabas do banco (87 palavras) têm áudio real.**

**Ajustes feitos ao longo da reorganização:**
- `cão.mp3` → renomeado pra `cao.mp3` (a sílaba de VULCÃO no banco é escrita `CAO`, sem til — mesma regra de sempre, o nome do arquivo segue o dado, não a ortografia acentuada).
- **`bói.MP3` → renomeado pra `boi.mp3`** (2026-08-19): o Júlio gravou o som certo (o "ó" tônico de JIBOIA) e salvou o arquivo com acento pra marcar isso — mas o jogo calcula o nome do arquivo removendo acento (`mediaFileName()`), então procura sempre `boi.mp3`, nunca `bói.mp3`. O CONTEÚDO do áudio está certo, só o nome do arquivo precisava perder o acento (mesma causa/correção do caso `cão.mp3`→`cao.mp3` acima).
  - **Atenção pra futuras palavras com "boi" (avisado pelo Júlio):** o cluster `boi` de JIBOIA tem o som tônico ("bói"). Se uma palavra futura usar "boi" como sílaba átona (ex. BOIADEIRO), o som muda e um único arquivo `boi.mp3` não serve pros dois casos — hoje "BOI" só aparece nesse 1 lugar no banco (confirmado por busca em `portugues-conteudo.js`), então não é bug ativo, mas é uma limitação real do sistema atual: **o mesmo texto de sílaba sempre aponta pro mesmo arquivo de áudio, sem jeito de dar 2 pronúncias diferentes pra mesma grafia dependendo da palavra.** Se isso vier a acontecer, vai precisar de uma solução nova (não existe hoje) — registrado também em `docs/DECISOES.md`.
- Extensões `.MP3` (maiúsculo) normalizadas pra `.mp3` minúsculo, mesma convenção do resto do projeto (no Windows não fazia diferença técnica, mas mantém tudo consistente).
- **`rra.mp3` e `rro.mp3` não correspondem a nenhuma sílaba usada no banco** (as palavras com RR duplo — CARRO, FERRO — já são cobertas por `car`+`ro` e `fer`+`ro`, nenhuma delas usa "RRA"/"RRO" como sílaba própria). Continuam em `fonetica/_a_revisar/` sem apagar — ainda aguardando confirmação: se você gravou pensando em outra coisa, me avisa, senão são sobra e dá pra ignorar/apagar.

## ✅ Bug do Ç corrigido (2026-08-18) — já pode gravar FUMAÇA

O Júlio escolheu a opção (a): corrigi `mediaFileName()` (`app/js/media-catalog.js`) pra tratar `Ç` como consoante própria, não como acento comum — `Ç` agora vira `ss` no nome do arquivo (aproxima o som /s/ do Ç e garante que não colide mais com `C`, que soa /k/). Ajustei também `portugues-conteudo.js`: a 3ª sílaba de FUMAÇA no banco agora é `"ÇA"` (grafia real da palavra) em vez de `"CA"` — o jogo já mostra e cobra "ÇA" certinho na tela, não "CA".

**O que isso muda pra gravação:** a sílaba `ÇA` de FUMAÇA agora espera o arquivo `fonetica/silabas/ssa.mp3` (não mais `ca.mp3`, que continua sendo só de `CA`/`FOCA`/`VACA` etc.). Pode gravar normalmente:
- Sílaba: `CONTEUDO: ÇA` (som /s/, tipo "sá") → salvar como `fonetica/silabas/ssa.mp3`.
- Palavra inteira: frase-molde de sempre → `Agora, vamos ouvir a palavra: fumaça.` → salvar como `fonetica/palavras/fumaca.mp3` (sem cedilha no nome do arquivo, igual às outras).

Suíte de testes atualizada com checagem específica desse bug (836 checagens, era 826) — confirma que `ÇA` e `CA` nunca mais colidem.

## 📁 Estrutura de pastas (importante)

- Vídeo: `app/assets/video/personagens/<palavra-minuscula>/<palavra-minuscula>-intro.mp4` — as 87 pastas existem e estão todas preenchidas agora.
- Sílaba: `app/assets/audio/fonetica/silabas/<silaba-minuscula-sem-acento>.mp3` — **sempre essa pasta**, não importa se a sílaba tem 1, 2, 3+ letras. Não criar pasta nova por tamanho de sílaba (foi o que aconteceu com `avogais/`/`dígrafos/` desta vez — reorganizei, mas economiza um passo já soltar direto em `silabas/` da próxima vez).
- Palavra inteira: `app/assets/audio/fonetica/palavras/<palavra-minuscula>.mp3`.

## 🎉 Áudio de palavra inteira: 87 de 87 completas (2026-08-19)

O Júlio gravou todas as palavras inteiras usando a técnica de frase-molde (ver `FRASES_GRAVACAO_PALAVRAS.md`), incluindo as 10 que faltavam (`cama`, `ovo`, `uva`, `vela`, `dente`, `rio`, `leite`, `neve`, `mola`, `barco`) e FUMAÇA. **Conferido arquivo por arquivo na pasta `fonetica/palavras/` — as 87 estão lá, todas com o nome certo.** Não precisou de nenhuma mudança de código — `mediaFonetica("palavra", item.word)` já resolve pra `fonetica/palavras/<palavra>.mp3` automaticamente pra qualquer palavra, sem precisar registrar nada em `portugues-conteudo.js` (diferente do vídeo, que precisa do campo `character`).

O `pato(1).MP3` duplicado que existia antes não está mais na pasta — resolvido (apagado ou renomeado pelo Júlio direto no computador).

## Palavras que precisam de atenção extra na pronúncia (consoante dobrada, mesma regra do CAR-RO)

`FERRO` (FER-RO), `OSSO` (OS-SO), `MASSA` (MAS-SA) — ver instrução extra em `TEMPLATES_PROMPTS.md`, seção "Alerta — sílaba com consoante dobrada".

## Falas da Lia (fixas, cobrem qualquer palavra, inclusive gênero)

`monte-o-nome.mp3` ✅ (feminino) · `monte-o-nome-genero-masculino.mp3` ✅ (masculino) · `acerto-01.mp3` ✅ · `dica-vamos-ouvir-o-comeco.mp3` ✅ · `digite-a-palavra.mp3` ✅ (2026-08-19, gravado e confirmado em `app/assets/audio/Lia/comuns/` — nível 5 já usa a voz oficial, não cai mais no TTS nativo). **Pendência separada, ainda aberta:** falta uma variante "cena" pra palavras sem personagem (DIA hoje, JULHO/FESTA/CIDADE se algum dia forem contextuais) — ver `docs/DECISOES.md`, 2026-08-18.

## ✅ Nível 5 (Digite a Palavra) corrigido — não usa mais voz nativa "crua" (2026-08-18)

Achado do Júlio: o áudio de "Digite a palavra banana" saía com a voz nativa do navegador, destoando do resto do app. Causa: `renderDigitePalavra()` chamava `speak()` direto, sem passar pelo `AudioManager` (que sempre tenta o áudio real primeiro e só cai pro TTS como último recurso). Corrigido pra usar o mesmo padrão do resto do jogo: toca a fala fixa `digite-a-palavra.mp3` (nova, precisa gravar — ver acima) seguida da pronúncia oficial da palavra (`fonetica/palavras/<palavra>.mp3`, já existe pra 76/87). **Decisão tomada:** não formar a palavra juntando os áudios de sílaba (ex. ba+na+na) — sílabas gravadas isoladas não têm a coarticulação natural da fala contínua, ficaria picado/robótico. É por isso que o projeto já separa "áudio de sílaba" de "áudio de palavra inteira" desde o início.

## SFX

`sfx/feedback/acerto.mp3` ✅ · `sfx/feedback/erro.mp3` ✅ — prontos, não precisam de nada novo.

## 🎉 Monte a Sílaba: 100% — vídeo, sílabas e palavra inteira completos (2026-08-19)

Vídeo de personagem (87/87), áudio de sílaba (33/33) e áudio de palavra inteira (87/87) estão todos gravados e implementados nas 5 rodadas de "Monte a Sílaba" (níveis 1-5), sem nenhum fallback de TTS nativo pendente no fluxo principal. O que resta é só limpeza opcional, sem efeito no jogo:

1. Confirmar o que fazer com `rra.mp3`/`rro.mp3` (em `fonetica/_a_revisar/`) — provável sobra, mas ainda não confirmado.
2. (Fora do escopo de "Monte a Sílaba") gravar a variante "cena" da fala da Lia, se quiser fechar a pendência do DIA (a palavra já é jogável, só a fala de instrução não combina 100% com o vídeo contextual).
