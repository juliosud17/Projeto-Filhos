# Diretrizes de Mídia — Ilha Aprendiz

*Regra do jogo operacional pra quem for produzir ou integrar um asset de personagem/voz/fonética/SFX. Criado em 2026-08-17 junto com o piloto VACA. Consolida a arquitetura aprovada (ver `docs/DECISOES.md`) num guia prático — não repete o "porquê" de cada decisão, só o "como fazer".*

## Árvore de pastas

```
app/assets/
├── maps/                        (já existia — mapas do mundo)
├── video/
│   └── personagens/
│       └── <id>/
│           └── <id>-<estado>.mp4
├── audio/
│   ├── lia/
│   │   ├── comuns/              (frases reutilizáveis entre atividades)
│   │   ├── portugues/           (específicas de módulos de Português)
│   │   └── matematica/          (específicas de módulos de Matemática)
│   ├── fonetica/
│   │   ├── letras/
│   │   ├── silabas/
│   │   ├── palavras/
│   │   └── numeros/
│   ├── personagens/
│   │   └── <id>/                (som avulso, fora do vídeo — raro)
│   └── sfx/
│       ├── feedback/
│       ├── progresso/
│       └── interface/
└── images/
    └── characters/                (só still estático, se algum dia precisar)
```

**Não criar pastas vazias.** Só existe fisicamente o que já tem conteúdo real dentro.

## Nomenclatura oficial

Kebab-case, minúsculo, sem acento, sem espaço.

| Categoria | Padrão | Exemplo |
|---|---|---|
| Vídeo de personagem | `<personagem>-<estado>.mp4` | `vaca-intro.mp4` |
| Voz da Lia | `<nome>.mp3` dentro de `lia/<categoria>/` | `lia/comuns/acerto-01.mp3` |
| Fonética | `<conteúdo>.mp3` (o próprio conteúdo) | `va.mp3`, `vaca.mp3`, `dez.mp3` |
| Som de personagem avulso | `<personagem>-<som>.mp3` | `vaca-muu.mp3` |
| SFX | `<evento>.mp3` | `acerto.mp3`, `estrela.mp3` |

Sufixo `-01`/`-02` só pra variações intercambiáveis da MESMA fala (nunca pra versionar tipo "final"/"v2" — o arquivo é sobrescrito, o git guarda o histórico).

**Fonética nunca leva sufixo de variação** — é pronúncia pedagógica determinística, uma oficial por item.

## Canais de reprodução (Audio Manager)

- **Canal de voz** (Lia + fonética): só uma fala por vez — nova fala sempre interrompe a anterior. `AudioManager.queueVoice([...])`.
- **Canal de SFX**: independente, não cancela nem é cancelado pela voz. `AudioManager.playSfx(url, opts)`.
- **Canal de personagem** (vídeo): controlado à parte via `mountCharacterIntro()` — o som do personagem (ex. "muuu") normalmente é o áudio embutido do próprio vídeo, não passa pelo canal de voz nem SFX.

Toda chamada de voz tem fallback pra TTS (`speak()`) embutido — se o MP3 não existir/falhar, a narração continua por TTS, nunca fica muda. Toda chamada de SFX tem fallback pro `beep()` sintetizado existente.

## Volumes relativos

| Canal | Volume |
|---|---|
| Voz (Lia + fonética) | 100% |
| Personagem (som do vídeo) | ~75-85% (controle nativo do `<video>`, não do Audio Manager) |
| SFX | ~60% |

Regra geral: a voz pedagógica nunca compete com efeito.

## Quando o áudio fica dentro do vídeo vs. separado

**Dentro do vídeo** (embutido, sincronizado): som natural do personagem que não muda entre usos — ex. "muuu" da vaca, "miau" do gato. Não precisa de arquivo de áudio à parte.

**Sempre separado** (nunca embutido em vídeo): qualquer fala pedagógica — instrução, dica, feedback, celebração. Motivos: poder trocar texto, trocar voz, reutilizar a animação, internacionalização futura, acessibilidade, manutenção, menos rerender.

## Checklist de reutilização ("isso precisa ser específico?")

Antes de gerar um asset novo, perguntar:

1. Essa fala/som já existe em `lia/comuns/` ou `sfx/`? Se sim, reusar — não duplicar.
2. É pronúncia oficial de letra/sílaba/palavra/número? Vai em `fonetica/`, gerado 1x, reutilizado por toda palavra/atividade que precisar dela.
3. É específico de UM personagem (vídeo, som próprio)? Só aí vale um asset dedicado.
4. É específico de UMA palavra/atividade? Only a fonética da palavra inteira e o campo `character` do item de dado se encaixam aqui — o resto quase sempre é reutilizável.

## Modelo de dados

Um item de conteúdo (ex. `WORDS`) só ganha o campo `character` quando realmente tem personagem associado — não é obrigatório em todo item. Nenhum outro campo de mídia é adicionado ao dado: os caminhos são **derivados** a partir do que o item já tem (`word`, `syl`) pelas funções de `js/media-catalog.js` (`mediaFonetica`, `mediaLiaVoice`, `mediaCharacterVideo`, `mediaSfx`). Nenhum `render*()` monta um caminho `assets/...` na mão.

## Pipeline de produção

```
necessidade pedagógica → roteiro de fala → validação da fala (não entrega resposta?)
  → geração ElevenLabs (Lia) / Flow (personagem) → edição externa se necessário
  → nomenclatura oficial → compressão (MP3 128kbps/44.1kHz; vídeo comprimido pra web)
  → entrada no projeto (pasta certa em app/assets/) → teste (jsdom + manual no app)
  → aprovação
```

## Formato de exportação de áudio

**MP3** (128 kbps / 44,1 kHz) é o único formato aceito no projeto — é o que já está definido acima ("Pipeline de produção") e vale tanto pra voz da Lia quanto fonética e SFX. Ao exportar de qualquer ferramenta (ElevenLabs, editor externo etc.), sempre escolher MP3 na caixa de formato, nunca WAV/AAC/FLAC:

- **WAV/FLAC** (sem perda) geram arquivo bem maior sem ganho perceptível pra voz falada — só valeriam como "master" antes de editar, e a decisão foi não manter master+web separados neste estágio (MP3 exportado direto da ferramenta já é suficiente).
- **AAC** é comparável em qualidade/tamanho ao MP3, mas MP3 tem compatibilidade mais universal e é o padrão único já adotado — não introduzir um segundo formato no projeto.

## Roteiro de gravação — Piloto VACA (pendente)

Nenhum destes arquivos existe no projeto ainda (conferido em 2026-08-17). Frases exatas a gravar — usar EXATAMENTE este texto, porque é o mesmo texto que o app já fala via TTS de fallback quando o MP3 não existe (consistência entre o que a Lia "promete" e o que ela diz de verdade):

| Arquivo (caminho final em `app/assets/`) | Tipo | Frase/conteúdo exato |
|---|---|---|
| `audio/lia/comuns/monte-o-nome.mp3` | Voz da Lia | "Olha quem chegou por aqui! Observe com atenção... e monte o nome dela!" |
| `audio/lia/comuns/acerto-01.mp3` | Voz da Lia | "Isso! Muito bem!" |
| `audio/lia/comuns/dica-vamos-ouvir-o-comeco.mp3` | Voz da Lia | "Quase! Vamos ouvir o começo?" |
| `audio/fonetica/silabas/va.mp3` | Fonética | "VA" — som da sílaba (tipo /va/), não soletrada letra por letra |
| `audio/fonetica/silabas/ca.mp3` | Fonética | "CA" — som da sílaba (tipo /ka/) |
| `audio/fonetica/palavras/vaca.mp3` | Fonética | "VACA" — palavra inteira, pronúncia natural |
| `audio/sfx/feedback/acerto.mp3` | SFX | Sem voz — som curto de recompensa (chime/sino/sparkle), tom gentil, não agressivo |
| `video/personagens/vaca/vaca-intro.mp4` | Vídeo (com áudio embutido) | Vaquinha aparece + "Muuu... muu muu!" — o vídeo já gerado no Flow, ainda não colocado no projeto |

Todos gerados na voz da Lia (ElevenLabs, Voice ID/prompt em `docs/audio/VOZ_LIA.md`), exceto o SFX (sem voz) e o vídeo (som do próprio animal). Formato de exportação: ver seção acima.

Se no futuro quiser variações de acerto (`acerto-02.mp3`, `acerto-03.mp3` etc.), o `AudioManager` já suporta sortear entre elas — precisa de um ajuste pequeno no código de `registerAnswerWithCharacterFeedback()` (`js/activities-portugues.js`) pra escolher aleatoriamente entre as variações existentes em vez de sempre `acerto-01`.

## Testes

Todo suporte de mídia nova precisa de teste automatizado no padrão jsdom da suíte (`testes/qa_test_*.js`) — ver `testes/qa_test_piloto_vaca.js` como referência: testa os paths do catálogo, o fallback pra TTS/beep quando o arquivo não existe, e que a instrução nunca revela a resposta. `HTMLMediaElement.prototype.play`/`window.Audio` precisam ser stubados no teste (jsdom não implementa reprodução de mídia — chamar `.play()` sem stub trava o processo).
