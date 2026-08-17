# Templates de Prompt — Vídeo (Flow) e Fonética (ElevenLabs)

*Pasta de produção da frente audiovisual (ver `docs/audio/MEDIA_GUIDELINES.md` pra arquitetura e `docs/DECISOES.md` pra o porquê). Diferente de `docs/`, esta pasta não é "documentação viva de decisão" — é ferramenta de trabalho: templates prontos + banco de palavras + checklist, pra gerar o prompt certo rápido em vez de reescrever do zero toda vez. Criado em 2026-08-17 a partir de um briefing do Júlio.*

**Como usar:** peça "me dá o prompt de <PALAVRA>" (numa sessão normal do Claude, ou invocando o subagente `.claude/agents/gerador-prompts-av.md` no Claude Code/VS Code). A resposta vem com: o prompt Flow completo (vídeo), os prompts ElevenLabs de cada sílaba que ainda falta gravar (checando reuso contra `CHECKLIST_PRODUCAO.md`) e o prompt da palavra inteira — prontos pra colar.

## Princípio de economia (por que não gerar 87 de tudo)

- **1 vídeo por palavra/objeto** quando fizer sentido visualmente — não dá pra reaproveitar vídeo entre palavras diferentes.
- **1 áudio por sílaba única**, reutilizável entre todas as palavras que a contêm (`GA.mp3` serve pra GATO e GALO; `TO.mp3` serve pra GATO, PATO, RATO...).
- **1 áudio por palavra inteira** (pronúncia da palavra completa).
- **Falas da Lia são genéricas e fixas** — não mudam de palavra para palavra (instrução, acerto, dica já existem e são reutilizadas por qualquer atividade "Monte a Sílaba").

Regra de ouro: **Flow identifica visualmente. Lia orienta. Fonética ensina o som. O exercício exige a resposta.** Nenhuma camada faz o trabalho da outra — nunca colocar a Lia dizendo a pronúncia oficial, nunca o vídeo do personagem falando o nome da palavra, nunca a fonética com entonação de celebração.

---

## Prompt mestre — Flow (vídeo do personagem/objeto)

Formato oficial: quadrado 1:1, 1080×1080, ~4-5s, fundo branco puro, sem texto/legenda/UI, sem a palavra dita em voz alta. Só troca os 3 campos finais (`SUBJECT`, `ACTION`, `SOUND`).

```
Create a short premium educational character/object animation for the children's learning app "Ilha Aprendiz".

TARGET AGE:
Children approximately 5–8 years old.

VIDEO FORMAT:
Square 1:1
1080 × 1080
Duration: approximately 4–5 seconds
Static camera
No camera movement
No cuts
Character/object centered
Subject occupies approximately 60–70% of the frame height
Keep comfortable empty space around the subject

BACKGROUND:
Pure solid white background (#FFFFFF).
Completely uniform.
No scenery.
No room.
No landscape.
No horizon.
No floor line.
No gradients.
No written text.
Avoid strong cast shadows.

VISUAL STYLE:
High-quality polished 3D cartoon animation.
Soft rounded shapes.
Friendly educational game aesthetic.
Appealing to children without looking like preschool baby content.
Clean, colorful and expressive.
Consistent visual universe suitable for Ilha Aprendiz.

SUBJECT:
[SUBJECT]
The subject must be immediately recognizable by a Brazilian child.

ANIMATION:
[ACTION]
Keep the movement simple, readable and playful.
The animation must help the child visually identify the subject, not distract from the literacy exercise.

NATURAL SOUND:
[SOUND]
If the subject naturally makes a recognizable sound, include only that natural sound synchronized with the animation.
Examples:
cow → "muuu"
cat → "miau"
dog → bark
For objects without a meaningful natural sound, use no voice and preferably no artificial sound.

IMPORTANT AUDIO RULE:
The subject must NEVER pronounce its own Portuguese name.
Do not say:
"vaca"
"gato"
"bola"
or any target word.
The video must not reveal the answer verbally.

IMPORTANT:
One subject only
No human narrator
No Lia voice
No letters
No syllables
No words
No captions
No subtitles
No speech bubbles
No logos
No game UI
No extra characters unless absolutely necessary for recognizing the action
No written answer anywhere in the frame

ENDING:
Finish in a clean stable pose so the last frame can remain visible after playback.
The animation must work as a reusable educational asset inside a white HTML card.

SUBJECT = [SUBJECT]
ACTION = [ACTION]
SOUND = [SOUND]
```

### Exemplos já resolvidos

**GATO**
```
SUBJECT = A cute small domestic cat.
ACTION = The cat walks two small steps into frame, sits down, looks toward the viewer, moves its ears and tail, blinks and tilts its head curiously.
SOUND = One short natural cute "miau" synchronized with the cat opening its mouth.
```

**BOLA**
```
SUBJECT = A colorful children's play ball.
ACTION = The ball gently rolls into the center, makes one small playful bounce and settles completely still.
SOUND = No voice. A very subtle soft bounce sound is acceptable.
```

**VACA** (já produzido)
```
SUBJECT = A cute small farm cow.
ACTION = The cow walks in, looks toward the viewer, and settles into a calm stable pose.
SOUND = "Muuu... muu muu!" synchronized with the cow's mouth movement.
```

---

## Prompt oficial — Fonética (ElevenLabs)

Separado da personalidade da Lia de propósito — objetivo é pronúncia limpa, neutra, sem entonação de personagem. Só troca `[CONTENT]`.

```
Brazilian Portuguese educational pronunciation for children ages 5–8.

Speak ONLY the exact content provided below.

Extremely clear articulation.
Natural Brazilian Portuguese pronunciation.
Neutral, warm and clean delivery.
Slightly slower than normal speech, but never exaggerated.

No introduction.
No explanation.
No celebration.
No additional words.
No music.
No sound effects.
No singing.
No spelling unless explicitly requested.

For syllables:
pronounce the syllable naturally as a single sound unit, NOT the names of the individual letters.

For words:
pronounce the complete word naturally and clearly.

Avoid exaggerated theatrical intonation.

CONTENT:
[CONTENT]
```

**Regra crítica de pronúncia:** sílaba nunca é soletrada. `VA` é sempre "vá" /va/ (som da sílaba), nunca "vê-á" (nome das letras). Mesma regra vale pra toda sílaba do banco.

Exemplo (VACA):
```
va.mp3   → CONTENT: VA
ca.mp3   → CONTENT: CA
vaca.mp3 → CONTENT: VACA
```

---

## Falas da Lia (fixas, reutilizadas — não mudam por palavra)

Já existem no projeto (`app/assets/audio/lia/comuns/`), geradas com a voz oficial (`docs/audio/VOZ_LIA.md`). Não regenerar por palavra — essas 3 servem pra qualquer palavra de "Monte a Sílaba":

| Arquivo | Texto |
|---|---|
| `monte-o-nome.mp3` | "Olha quem chegou por aqui! Observe com atenção... e monte o nome dela!" |
| `acerto-01.mp3` | "Isso! Muito bem!" |
| `dica-vamos-ouvir-o-comeco.mp3` | "Quase! Vamos ouvir o começo?" |

Variações futuras (`acerto-02`, `acerto-03` etc.) ficam pra depois — não precisa agora (ver `docs/audio/MEDIA_GUIDELINES.md`).

---

## Estrutura de pastas de saída

```
app/assets/
├── video/personagens/<palavra-em-minusculo>/<palavra>-intro.mp4
└── audio/fonetica/
    ├── silabas/<silaba-minuscula>.mp3
    └── palavras/<palavra-minuscula>.mp3
```
