# Prompts de Vídeo (Flow) — Todas as 87 Palavras

*Complementa `BANCO_87_PALAVRAS.md` (que tem a ação em português + sílabas) e `TEMPLATES_PROMPTS.md` (que tem o prompt mestre completo). Aqui só o `SUBJECT`/`ACTION`/`SOUND` resolvido em inglês, pronto pra colar nos 3 campos finais do prompt mestre. Gerado em 2026-08-17 a partir das ações em português já registradas no banco — nenhuma ação nova foi inventada, só traduzida/formatada no padrão dos exemplos GATO/BOLA/VACA.*

**Lote A (10 palavras) já produzido — não repetido aqui.** Ver prompts de VACA/GATO/BOLA em `TEMPLATES_PROMPTS.md`; os outros 7 (PATO, SAPO, CASA, GALO, LOBO, SINO, CARRO) já foram gerados e usados em rodada anterior (vídeos já existem em `app/assets/video/personagens/`).

Pra pedir um vídeo, cole o prompt mestre de `TEMPLATES_PROMPTS.md` com os 3 campos abaixo da palavra desejada.

## ⚠️ Classificação de risco pedagógico (2026-08-18)

Nem toda palavra vira um vídeo inequívoco só porque tem um objeto "dono" dela. Classificação usada:

- 🟢 **Direto** (73 palavras, sem marcação abaixo) — objeto/animal único, resposta razoavelmente óbvia.
- 🟡 **Precisa direção visual cuidadosa** (10 palavras, marcadas abaixo) — objeto certo, mas risco de a criança nomear algo vizinho (ex. NINHO → "ovo"). Prompt já ajustado com direção mais específica.
- 🔴 **Abstrato/contextual** (4 palavras: DIA, JULHO, FESTA, CIDADE, marcadas abaixo) — não existe objeto único que "seja" a palavra; o vídeo depende da criança interpretar a cena inteira certo. **Decisão registrada em `docs/DECISOES.md`: tentar mesmo assim (cena contextual, sem entregar a resposta), sabendo que o resultado pode continuar ambíguo** — validar com o Benjamin antes de confiar nesse padrão pra outras palavras abstratas do banco.

**Pendência de arquitetura pras 4 abstratas:** a fala fixa da Lia hoje é "Olha quem **chegou** por aqui!... e monte o nome dela/dele!" — isso pressupõe um personagem/ser chegando, o que não faz sentido pra DIA/JULHO/FESTA/CIDADE (são cena, não personagem). Antes de implementar essas 4 no jogo, via ser preciso uma variante da fala da Lia pra "cena" (ainda genérica, não por palavra — só uma 2ª opção de frase fixa por categoria, mesmo padrão de `genero`). Ainda não gravada, não implementada — fica pra quando chegar a vez de produzir essas 4.

---

## Nível 1 (restantes: 9)

**RATO**
```
SUBJECT = A cute small friendly mouse.
ACTION = The mouse runs two quick steps into frame, stops, and twitches its whiskers curiously.
SOUND = No voice. A very light natural sound is optional (no strong squeak).
```

**MALA**
```
SUBJECT = A colorful children's suitcase.
ACTION = The suitcase slides in, its handle pops up, and the lid opens slightly then closes.
SOUND = No voice, no sound.
```

**ROSA**
```
SUBJECT = A single blooming rose flower.
ACTION = The rose grows slightly and its petals gently open.
SOUND = No voice, no sound.
```

**DEDO** 🟡 ajustado — risco de a criança ler "mão" em vez de "dedo"
```
SUBJECT = A close-up of a single friendly cartoon finger, the rest of the hand mostly cropped out of frame at the edge.
ACTION = The finger gently wiggles and taps twice in place, staying the clear central focus of the frame.
SOUND = No voice, no sound.
```

**MESA**
```
SUBJECT = A small colorful children's table.
ACTION = The table gently assembles/appears piece by piece in a soft, smooth motion.
SOUND = No voice, no sound.
```

**RUA** 🟡 ajustado — risco de a criança ler "carro" em vez de "rua"
```
SUBJECT = A short stylized cartoon street with visible road markings (a dashed center line and a sidewalk on each side), no vehicles present.
ACTION = The street appears from front to back in gentle perspective, its road markings softly brightening.
SOUND = No voice, no sound.
```

**SETE**
```
SUBJECT = Seven small identical colorful objects (e.g., stars) arranged clearly in the frame.
ACTION = The seven objects appear one by one and settle in a clear, readable arrangement.
SOUND = No voice, no sound.
```

**PERA**
```
SUBJECT = A single ripe pear fruit.
ACTION = The pear gently rotates in place and settles still.
SOUND = No voice, no sound.
```

**DIA** ⚠️ palavra abstrata — vídeo é uma aposta pedagógica, ver nota no fim do arquivo
```
SUBJECT = A simple cheerful outdoor scene transitioning from dawn to bright daylight: sky, a few small clouds, green grass, and a small house in the distance.
ACTION = The scene smoothly brightens from soft early dawn light into a fully bright, clear, sunny sky; small birds gently fly across the bright sky. Keep the sun small and secondary, never the focus of the frame.
SOUND = No voice. Very subtle natural daytime ambience with one or two soft bird chirps.
IMPORTANT SEMANTIC NOTE: the concept to communicate is "day/daytime" as the WHOLE scene brightening, not any single object in it — do not make the sun a character, do not give it a face, do not let the sun, clouds, house or birds dominate or become an obvious standalone answer.
```

---

## Nível 2 (restantes: 20)

**CAMA**
```
SUBJECT = A small cozy children's bed.
ACTION = The bed appears and the pillow gives one small soft bounce.
SOUND = No voice, no sound.
```

**LUA**
```
SUBJECT = A cartoon crescent moon.
ACTION = The moon appears in frame and shines with a soft gentle glow.
SOUND = No voice, no sound.
```

**OVO**
```
SUBJECT = A single cartoon egg.
ACTION = The egg gently rocks and wobbles in place.
SOUND = No voice, no sound.
```

**UVA**
```
SUBJECT = A bunch of grapes.
ACTION = The bunch appears and one grape gently sways.
SOUND = No voice, no sound.
```

**VELA**
```
SUBJECT = A single birthday-style candle.
ACTION = The candle's flame lights up gently and burns calmly.
SOUND = No voice, no sound.
```

**DENTE**
```
SUBJECT = A friendly cartoon tooth character.
ACTION = The tooth smiles and briefly sparkles/shines.
SOUND = No voice, no sound.
```

**FOGO**
```
SUBJECT = A small friendly cartoon flame.
ACTION = The flame gently dances and flickers, not looking dangerous.
SOUND = No voice, no sound.
```

**COCO**
```
SUBJECT = A whole coconut.
ACTION = The coconut gently rotates in place and settles still.
SOUND = No voice, no sound.
```

**DADO**
```
SUBJECT = A colorful children's game die.
ACTION = The die rolls once and settles still, without emphasizing any specific number.
SOUND = No voice. A very subtle soft rolling sound is acceptable.
```

**TATU**
```
SUBJECT = A cute cartoon armadillo.
ACTION = The armadillo walks a little, partially curls up, and then uncurls back.
SOUND = No voice, no sound.
```

**RIO**
```
SUBJECT = A small stylized flowing river/stream.
ACTION = A gentle stream of water flows across the frame.
SOUND = No voice. A very subtle soft water sound is acceptable.
```

**LEITE**
```
SUBJECT = A glass being filled with milk.
ACTION = The glass is gently and smoothly filled with milk.
SOUND = No voice, no sound.
```

**NEVE**
```
SUBJECT = Gentle falling snowflakes.
ACTION = Soft snowflakes fall gently for a few seconds.
SOUND = No voice, no sound.
```

**MOLA**
```
SUBJECT = A colorful cartoon spring/coil toy.
ACTION = The spring compresses and then playfully bounces up.
SOUND = No voice. A very subtle soft boing sound is acceptable.
```

**MURO** 🟡 ajustado — risco de a criança ler "tijolo"/"bloco" em vez de "muro"
```
SUBJECT = A small low garden wall made of stacked colorful bricks, already shown as one continuous wall segment (not individual scattered blocks).
ACTION = The wall gently glows/highlights once along its full length.
SOUND = No voice, no sound.
```

**FITA**
```
SUBJECT = A colorful ribbon.
ACTION = The ribbon waves gently and forms a small bow shape.
SOUND = No voice, no sound.
```

**GELO**
```
SUBJECT = A single ice cube.
ACTION = The ice cube slides slightly and gently sparkles/shines.
SOUND = No voice, no sound.
```

**DUNA** 🟡 ajustado — risco de a criança ler "areia"/"deserto" em vez de "duna"
```
SUBJECT = A single tall cartoon sand dune with a clear curved ridge silhouette against a plain background.
ACTION = A gentle breeze blows a light trail of sand off the top ridge of the dune.
SOUND = No voice. A very subtle soft wind sound is acceptable.
```

**NOVE**
```
SUBJECT = Nine small identical colorful objects (e.g., stars) arranged clearly.
ACTION = The nine objects appear one by one and settle in a clear, organized arrangement.
SOUND = No voice, no sound.
```

**BICO** 🟡 ajustado — risco de a criança ler "passarinho" em vez de "bico"
```
SUBJECT = An extreme close-up of a small cartoon bird's beak only, the rest of the bird's body mostly cropped out of frame.
ACTION = The beak opens and closes twice, staying the clear central focus of the frame.
SOUND = No voice. A very subtle soft chirp is optional.
```

---

## Nível 3 (restantes: 21)

**FADA**
```
SUBJECT = A friendly cartoon fairy.
ACTION = The fairy gently floats in frame and her wand releases a small sparkle of light.
SOUND = No voice, no sound.
```

**FOCA**
```
SUBJECT = A cute cartoon seal.
ACTION = The seal claps its flippers together and makes a happy movement.
SOUND = No voice. A very light natural sound is optional.
```

**PIPA**
```
SUBJECT = A colorful children's kite.
ACTION = The kite gently sways in the air as if caught by a light breeze.
SOUND = No voice. A very subtle soft wind sound is acceptable.
```

**SUCO**
```
SUBJECT = A glass being filled with juice.
ACTION = Juice is gently poured into the glass.
SOUND = No voice. A very subtle soft pouring sound is acceptable.
```

**BOLO**
```
SUBJECT = A colorful birthday cake.
ACTION = The cake appears and a small candle on top lights up with a gentle sparkle.
SOUND = No voice, no sound.
```

**BALA**
```
SUBJECT = A wrapped colorful candy.
ACTION = The wrapped candy gently spins in place.
SOUND = No voice, no sound.
```

**ANEL**
```
SUBJECT = A shiny cartoon ring.
ACTION = The ring gently spins and sparkles.
SOUND = No voice, no sound.
```

**ARCO** 🟡 risco aceito, não ajustado — "arco" isolado pode soar mais como "arco-íris" (2 palavras) do que "arco" pra uma criança; mantive como estava porque não achei uma direção visual claramente melhor. Se testar e não funcionar, considerar trocar pra um arco de brincar (brinquedo, formato de arco de circo/portal) em vez de arco-íris.
```
SUBJECT = A colorful rainbow.
ACTION = The rainbow gently forms across the frame from one side to the other.
SOUND = No voice, no sound.
```

**CHAVE**
```
SUBJECT = A cartoon key.
ACTION = The key turns and partially enters a keyhole.
SOUND = No voice. A very subtle soft click sound is acceptable.
```

**QUEIJO**
```
SUBJECT = A piece of cheese with holes.
ACTION = The cheese appears and gently rotates with a small sparkle.
SOUND = No voice, no sound.
```

**KIWI**
```
SUBJECT = A whole kiwi fruit.
ACTION = The kiwi rotates in place and reveals a cut half showing its green inside.
SOUND = No voice, no sound.
```

**ILHA** 🟡 ajustado — risco de a criança ler "praia" em vez de "ilha"
```
SUBJECT = A small tropical island seen from above/at an angle that clearly shows it completely surrounded by blue water on all sides, with a palm tree on top.
ACTION = The island gently emerges from the water, the surrounding water clearly visible on every side.
SOUND = No voice. A very subtle soft water sound is acceptable.
```

**ZEBRA**
```
SUBJECT = A friendly cartoon zebra.
ACTION = The zebra walks in and gently sways its head.
SOUND = No voice. A very light natural sound is optional.
```

**FESTA** ⚠️ palavra abstrata — vídeo é uma aposta pedagógica, ver nota no fim do arquivo
```
SUBJECT = A small festive party scene with colorful balloons, falling confetti, a simple decorated cake, and hanging streamers, all shown together.
ACTION = All the party elements appear and animate together at the same time (balloons gently sway, confetti falls, streamers wave) — no single element should dominate the frame.
SOUND = No voice, no sound.
IMPORTANT SEMANTIC NOTE: the concept to communicate is "festa" (the whole party) — not "balão" alone. Multiple party elements must be visible together, not just balloons.
```

**PUDIM**
```
SUBJECT = A classic caramel pudding dessert.
ACTION = The pudding gently wobbles/jiggles in place.
SOUND = No voice, no sound.
```

**NINHO** 🟡 ajustado — risco de a criança ler "ovo" ou "passarinho" em vez de "ninho"
```
SUBJECT = A small bird's nest with a few eggs inside, no bird present.
ACTION = The nest gently appears/settles and the eggs softly wiggle in place.
SOUND = No voice, no sound.
```

**FERRO**
```
SUBJECT = A children's toy clothes iron.
ACTION = The iron slides once smoothly across a piece of fabric.
SOUND = No voice. A very subtle soft gliding sound is acceptable.
```

**OSSO**
```
SUBJECT = A cartoon dog bone.
ACTION = The bone gently spins in place; the bone must remain the main subject of the frame.
SOUND = No voice, no sound.
```

**MASSA**
```
SUBJECT = A ball of dough.
ACTION = The dough is gently kneaded and stretched.
SOUND = No voice, no sound.
```

**MILHO**
```
SUBJECT = An ear of corn.
ACTION = The corn gently rotates and a few husk leaves open.
SOUND = No voice, no sound.
```

**JULHO** ⚠️ palavra abstrata — vídeo é uma aposta pedagógica, ver nota no fim do arquivo
```
SUBJECT = An illustrated calendar page (no numbers, no text, no month name) styled with a warm "Festa Junina" (winter countryside party) atmosphere: small triangular flags, a simple bonfire icon, and warm colors.
ACTION = The calendar page and its festive decorations gently appear together, settling into a warm, cozy composition. No single decoration should dominate the frame.
SOUND = No voice, no sound.
IMPORTANT SEMANTIC NOTE: the concept to communicate is "julho" (the month) via its cultural association with Festa Junina — no single element (flags, bonfire, calendar) should read as the obvious standalone answer.
```

---

## Nível 4 (11 — nenhuma ainda produzida)

**PORCO**
```
SUBJECT = A cute cartoon piglet.
ACTION = The piglet walks in, sniffs around, and makes a short happy movement.
SOUND = No voice. A very light natural sound is optional.
```

**COBRA**
```
SUBJECT = A friendly, non-threatening cartoon snake.
ACTION = The snake gently slides/glides across the frame, with no threatening posture.
SOUND = No voice, no sound.
```

**LÁPIS**
```
SUBJECT = A colorful cartoon pencil.
ACTION = The pencil draws a simple curved line in the air, without forming any letter.
SOUND = No voice, no sound.
```

**TIGRE**
```
SUBJECT = A friendly cartoon tiger.
ACTION = The tiger walks in and sits down calmly.
SOUND = No voice. A very light natural sound is optional.
```

**URSO**
```
SUBJECT = A cute cartoon bear cub.
ACTION = The bear waves one paw and smiles.
SOUND = No voice, no sound.
```

**LIVRO**
```
SUBJECT = A colorful children's book.
ACTION = The book opens and its pages gently turn.
SOUND = No voice. A very subtle soft page-turning sound is acceptable.
```

**BARCO**
```
SUBJECT = A small cartoon toy boat.
ACTION = The boat gently sails/glides smoothly across the frame.
SOUND = No voice. A very subtle soft water sound is acceptable.
```

**BOTA**
```
SUBJECT = A children's rain boot.
ACTION = The boot hops/bounces lightly into frame and settles still.
SOUND = No voice, no sound.
```

**NUVEM**
```
SUBJECT = A soft cartoon cloud.
ACTION = The cloud gently floats and releases two small raindrops.
SOUND = No voice, no sound.
```

**XADREZ**
```
SUBJECT = Chess pieces on a chessboard.
ACTION = The chess pieces appear and one piece makes a single simple move.
SOUND = No voice. A very subtle soft tap sound is acceptable.
```

**VULCÃO**
```
SUBJECT = A friendly cartoon volcano.
ACTION = The volcano releases a small puff of smoke and a bit of stylized lava, without looking dangerous.
SOUND = No voice. A very subtle soft rumble sound is acceptable.
```

---

## Nível 5 (16 — nenhuma ainda produzida)

**BANANA**
```
SUBJECT = A bunch of bananas.
ACTION = The bunch gently rotates and one banana partially peels.
SOUND = No voice, no sound.
```

**CAVALO**
```
SUBJECT = A friendly cartoon horse.
ACTION = The horse walks/trots slowly and makes a brief natural neigh.
SOUND = One short natural neigh synchronized with the horse's mouth movement.
```

**GIRAFA**
```
SUBJECT = A friendly cartoon giraffe.
ACTION = The giraffe lowers its long neck and looks toward the viewer.
SOUND = No voice, no sound.
```

**JACARÉ**
```
SUBJECT = A friendly cartoon alligator/caiman.
ACTION = The alligator gently opens and closes its mouth.
SOUND = No voice. A very light natural sound is optional.
```

**MACACO**
```
SUBJECT = A friendly cartoon monkey.
ACTION = The monkey swings its arms/tail and reacts happily.
SOUND = No voice. A very light natural sound is optional.
```

**NAVIO**
```
SUBJECT = A cartoon ship.
ACTION = The ship sails and a small puff of smoke comes from its chimney.
SOUND = No voice. A very subtle soft horn or water sound is acceptable.
```

**SORVETE**
```
SUBJECT = A colorful ice cream cone.
ACTION = The ice cream gently rotates and a bit of topping slowly drips.
SOUND = No voice, no sound.
```

**TOMATE**
```
SUBJECT = A ripe tomato.
ACTION = The tomato rolls once and settles still.
SOUND = No voice, no sound.
```

**COELHO**
```
SUBJECT = A cute cartoon rabbit.
ACTION = The rabbit hops once, wiggles its nose and ears.
SOUND = No voice. A very light natural sound is optional.
```

**CEBOLA**
```
SUBJECT = A whole onion.
ACTION = The onion rotates in place and reveals its stylized inner layers.
SOUND = No voice, no sound.
```

**CIDADE** ⚠️ palavra abstrata — vídeo é uma aposta pedagógica, ver nota no fim do arquivo
```
SUBJECT = A small stylized 3D toy city with SEVERAL colorful buildings of different heights arranged together along a simple street layout.
ACTION = The buildings gently grow/assemble together at the same time, forming a small skyline. No single building should dominate the frame.
SOUND = No voice, no sound.
IMPORTANT SEMANTIC NOTE: the concept to communicate is "cidade" (many buildings together) — not "prédio" (one building). Multiple distinct buildings must be visible at once.
```

**AGULHA**
```
SUBJECT = A large friendly cartoon sewing needle.
ACTION = The needle smoothly passes through a piece of fabric, without showing any danger.
SOUND = No voice, no sound.
```

**GARRAFA**
```
SUBJECT = A colorful bottle.
ACTION = The bottle gently rotates in place and settles still.
SOUND = No voice, no sound.
```

**BURACO** 🟡 ajustado — risco de a criança ler "bola" em vez de "buraco" (a bola roubava a cena)
```
SUBJECT = A cartoon hole in the ground with clear rounded edges and visible depth, no ball present.
ACTION = The hole appears and its edges gently pulse/highlight once, staying the clear central focus.
SOUND = No voice, no sound.
```

**FUMAÇA** 🟡 ajustado — risco de a criança ler "nuvem" em vez de "fumaça" (ver também alerta de nomeação de arquivo ÇA no `CHECKLIST_PRODUCAO.md`)
```
SUBJECT = A thin wisp of gray cartoon smoke rising from a small chimney, the chimney shown only as a small gray base kept secondary.
ACTION = The smoke rises in a thin curling trail and gently dissipates into the air.
SOUND = No voice, no sound.
```

**JIBOIA**
```
SUBJECT = A friendly, non-threatening cartoon boa snake.
ACTION = The boa gently slides/coils, without any threatening posture.
SOUND = No voice, no sound.
```
