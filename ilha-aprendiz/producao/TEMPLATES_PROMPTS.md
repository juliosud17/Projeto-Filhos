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

**Correção de 2026-08-18:** cheguei a sugerir colar um bloco de instruções em inglês (tipo "fale devagar e com calma") no campo de texto do ElevenLabs. **Isso estava errado** — o ElevenLabs de texto-pra-voz fala LITERALMENTE tudo que está no campo de texto, ele não obedece instrução meta como um prompt de vídeo (Flow) obedeceria. O jeito que realmente funciona (e que o Júlio já vinha usando por conta própria) é gerar a palavra dentro de uma FRASE natural em português — isso dá contexto e ritmo calmo pro modelo — e depois cortar só a palavra no CapCut. Ver `producao/FRASES_GRAVACAO_PALAVRAS.md` pra frase-molde pronta + as frases das 67 palavras que faltam. O `CONTENT:` abaixo continua valendo só pra sílabas soltas curtas onde a frase-molde de palavra não se aplica (ex. `ba.mp3`, `ca.mp3`) — mesmo assim, se sair rápido/sem calma, vale testar a mesma técnica de frase (ver seção de sílabas em `FRASES_GRAVACAO_PALAVRAS.md`).

**Regra crítica de pronúncia:** sílaba nunca é soletrada. `VA` é sempre "vá" /va/ (som da sílaba), nunca "vê-á" (nome das letras). Mesma regra vale pra toda sílaba do banco.

**Alerta — sílaba com consoante dobrada (CAR-RO, FER-RO, OS-SO, MAS-SA):** a divisão oficial de sílabas separa consoante dobrada no meio mesmo quando ela representa 1 som só (ex. RR = 1 som de R forte, SS = 1 som de S) — é a regra da escola, bate com a mecânica do jogo (clicar as duas sílabas pra montar a palavra), então o nome do arquivo continua sendo a sílaba escrita (`car.mp3`+`ro.mp3`, `fer.mp3`+`ro.mp3`, `os.mp3`+`so.mp3`, `mas.mp3`+`sa.mp3`). O que muda é SÓ o jeito de pedir a gravação: a primeira metade (CAR/FER/OS/MAS) não deve soar como uma palavra isolada de dicionário — pedir pra soar como o começo da palavra cortado, pronto pra emendar na sílaba seguinte; e a segunda metade que carrega o R/S "forte" (RO/SO) deve vir com esse som forte/vibrante, do jeito que soa dentro da palavra (não a versão fraca que essas letras têm em outras posições). Exemplo de instrução extra pro `[CONTENT]` desses casos:

```
CONTENT: CAR
(pronuncie como o início da palavra "carro" — não como a palavra em inglês "car", nem com R forte de final de palavra. Som curto, pronto pra emendar na próxima sílaba.)

CONTENT: RO
(pronuncie com o R forte/vibrante, do jeito que soa em "carro", "rato", "rua" — não o R fraco de palavras como "caro".)
```

Palavras do banco (`BANCO_87_PALAVRAS.md`) que vão precisar dessa atenção quando chegar a vez delas: **CARRO** (Lote A/nível 3), **FERRO** (nível 3), **OSSO** (nível 3), **MASSA** (nível 3).

Exemplo (VACA):
```
va.mp3   → CONTENT: VA
ca.mp3   → CONTENT: CA
vaca.mp3 → CONTENT: VACA
```

---

## Falas da Lia (fixas, reutilizadas — não mudam por palavra)

Já existem no projeto (`app/assets/audio/lia/comuns/`), geradas com a voz oficial (`docs/audio/VOZ_LIA.md`). Não regenerar por palavra — essas servem pra qualquer palavra de "Monte a Sílaba"/"Digite a Palavra":

| Arquivo | Texto | Status |
|---|---|---|
| `monte-o-nome.mp3` | "Olha quem chegou por aqui! Observe com atenção... e monte o nome dela!" | ✅ |
| `monte-o-nome-genero-masculino.mp3` | mesma frase, "...monte o nome dele!" | ✅ |
| `acerto-01.mp3` | "Isso! Muito bem!" | ✅ |
| `dica-vamos-ouvir-o-comeco.mp3` | "Quase! Vamos ouvir o começo?" | ✅ |
| `digite-a-palavra.mp3` | "Digite a palavra:" | 🔴 **falta gravar** (2026-08-18, ver `docs/DECISOES.md`) — usada no nível 5 ("Digite a Palavra"), antes de tocar a pronúncia da palavra em si. Enquanto não existe, cai no TTS nativo do navegador (fallback normal, não trava nada) |

Variações futuras (`acerto-02`, `acerto-03` etc.) ficam pra depois — não precisa agora (ver `docs/audio/MEDIA_GUIDELINES.md`).

**Prompt de fonética pra `digite-a-palavra.mp3`** (é uma fala fixa da Lia, não uma pronúncia neutra — grava com a mesma técnica de frase natural usada nas outras falas da Lia, tom de convite/instrução, não neutro/robótico):

```
Digite a palavra:
```

---

## Estrutura de pastas de saída

```
app/assets/
├── video/personagens/<palavra-em-minusculo>/<palavra>-intro.mp4
└── audio/fonetica/
    ├── silabas/<silaba-minuscula>.mp3
    └── palavras/<palavra-minuscula>.mp3
```
