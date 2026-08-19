// Banco de conteudo de Portugues compartilhado entre modulos (letras, palavras, pares minimos, rimas, familias de palavra).
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

/* Banco de palavras com nível de dificuldade (1-5) e cobertura ampla de letras/sílabas.
   Níveis 1-4: palavras de 2 sílabas (CV+CV, depois clusters/dígrafos).
   Nível 5: introduz palavras de 3 sílabas ("ir além" da BNCC do 1º ano). */
const WORDS = [
  // Nível 1 — sílabas simples abertas
  {word:"BOLA", syl:["BO","LA"], emoji:"⚽", level:1, character:"bola", genero:"f"},
  {word:"CASA", syl:["CA","SA"], emoji:"🏠", level:1, character:"casa", genero:"f"},
  {word:"GATO", syl:["GA","TO"], emoji:"🐱", level:1, character:"gato", genero:"m"},
  {word:"PATO", syl:["PA","TO"], emoji:"🦆", level:1, character:"pato", genero:"m"},
  {word:"VACA", syl:["VA","CA"], emoji:"🐮", level:1, character:"vaca", genero:"f"}, // character/genero: piloto audiovisual (docs/DECISOES.md, 2026-08-17) -- Lote A inteiro escalado em 2026-08-17 (BOLA/CASA/GATO/PATO/SAPO/GALO/LOBO/SINO/CARRO), ver docs/characters/CHARACTER_BIBLE.md. genero SEMPRE explícito, nunca inferido da palavra (heurística de terminação -a/-o quebra com exceções do português)
  {word:"SAPO", syl:["SA","PO"], emoji:"🐸", level:1, character:"sapo", genero:"m"},
  {word:"RATO", syl:["RA","TO"], emoji:"🐭", level:1, character:"rato", genero:"m"},
  {word:"GALO", syl:["GA","LO"], emoji:"🐓", level:1, character:"galo", genero:"m"},
  {word:"MALA", syl:["MA","LA"], emoji:"🧳", level:1, character:"mala", genero:"f"},
  {word:"ROSA", syl:["RO","SA"], emoji:"🌹", level:1, character:"rosa", genero:"f"},
  // Nível 2 — ainda simples, sílaba final fechada ou menos frequente
  {word:"CAMA", syl:["CA","MA"], emoji:"🛏️", level:2, character:"cama", genero:"f"},
  {word:"LOBO", syl:["LO","BO"], emoji:"🐺", level:2, character:"lobo", genero:"m"},
  {word:"LUA",  syl:["LU","A"],  emoji:"🌙", level:2, character:"lua", genero:"f"},
  {word:"OVO",  syl:["O","VO"],  emoji:"🥚", level:2, character:"ovo", genero:"m"},
  {word:"UVA",  syl:["U","VA"],  emoji:"🍇", level:2, character:"uva", genero:"f"},
  {word:"VELA", syl:["VE","LA"], emoji:"🕯️", level:2, character:"vela", genero:"f"},
  {word:"DENTE",syl:["DEN","TE"],emoji:"🦷", level:2, character:"dente", genero:"m"},
  {word:"FOGO", syl:["FO","GO"], emoji:"🔥", level:2, character:"fogo", genero:"m"},
  {word:"COCO", syl:["CO","CO"], emoji:"🥥", level:2, character:"coco", genero:"m"},
  {word:"DADO", syl:["DA","DO"], emoji:"🎲", level:2, character:"dado", genero:"m"},
  // Nível 3 — dígrafos e letras menos comuns
  {word:"FADA", syl:["FA","DA"], emoji:"🧚", level:3, character:"fada", genero:"f"},
  {word:"FOCA", syl:["FO","CA"], emoji:"🦭", level:3, character:"foca", genero:"f"},
  {word:"PIPA", syl:["PI","PA"], emoji:"🪁", level:3, character:"pipa", genero:"f"},
  {word:"SUCO", syl:["SU","CO"], emoji:"🧃", level:3, character:"suco", genero:"m"},
  {word:"BOLO", syl:["BO","LO"], emoji:"🎂", level:3, character:"bolo", genero:"m"},
  {word:"BALA", syl:["BA","LA"], emoji:"🍬", level:3, character:"bala", genero:"f"},
  {word:"ANEL", syl:["A","NEL"], emoji:"💍", level:3, character:"anel", genero:"m"},
  {word:"ARCO", syl:["AR","CO"], emoji:"🌈", level:3, character:"arco", genero:"m"},
  {word:"CHAVE",syl:["CHA","VE"],emoji:"🔑", level:3, character:"chave", genero:"f"},
  {word:"QUEIJO",syl:["QUEI","JO"],emoji:"🧀", level:3, character:"queijo", genero:"m"},
  {word:"KIWI", syl:["KI","WI"], emoji:"🥝", level:3, character:"kiwi", genero:"m"},
  {word:"ILHA", syl:["I","LHA"], emoji:"🏝️", level:3, character:"ilha", genero:"f"},
  {word:"ZEBRA",syl:["ZE","BRA"],emoji:"🦓", level:3, character:"zebra", genero:"f"},
  // Nível 4 — encontros consonantais mais difíceis
  {word:"PORCO",syl:["POR","CO"], emoji:"🐷", level:4, character:"porco", genero:"m"},
  {word:"COBRA",syl:["CO","BRA"], emoji:"🐍", level:4, character:"cobra", genero:"f"},
  {word:"LAPIS",syl:["LA","PIS"], emoji:"✏️", level:4, character:"lapis", genero:"m"},
  {word:"TIGRE",syl:["TI","GRE"], emoji:"🐯", level:4, character:"tigre", genero:"m"},
  {word:"URSO", syl:["UR","SO"],  emoji:"🐻", level:4, character:"urso", genero:"m"},
  {word:"LIVRO",syl:["LI","VRO"], emoji:"📖", level:4, character:"livro", genero:"m"},
  {word:"BARCO",syl:["BAR","CO"], emoji:"⛵", level:4, character:"barco", genero:"m"},
  {word:"BOTA", syl:["BO","TA"],  emoji:"🥾", level:4, character:"bota", genero:"f"},
  {word:"NUVEM",syl:["NU","VEM"], emoji:"☁️", level:4, character:"nuvem", genero:"f"},
  {word:"XADREZ",syl:["XA","DREZ"],emoji:"♟️", level:4, character:"xadrez", genero:"m"},
  // Nível 5 — palavras de 3 sílabas (indo além do padrão do 1º ano)
  {word:"BANANA",syl:["BA","NA","NA"], emoji:"🍌", level:5, character:"banana", genero:"f"},
  {word:"CAVALO",syl:["CA","VA","LO"], emoji:"🐴", level:5, character:"cavalo", genero:"m"},
  {word:"GIRAFA",syl:["GI","RA","FA"], emoji:"🦒", level:5, character:"girafa", genero:"f"},
  {word:"JACARE",syl:["JA","CA","RE"], emoji:"🐊", level:5, character:"jacare", genero:"m"},
  {word:"MACACO",syl:["MA","CA","CO"], emoji:"🐵", level:5, character:"macaco", genero:"m"},
  {word:"NAVIO", syl:["NA","VI","O"],  emoji:"🚢", level:5, character:"navio", genero:"m"},
  {word:"SORVETE",syl:["SOR","VE","TE"],emoji:"🍦", level:5, character:"sorvete", genero:"m"},
  {word:"TOMATE",syl:["TO","MA","TE"], emoji:"🍅", level:5, character:"tomate", genero:"m"},
  {word:"COELHO",syl:["CO","E","LHO"], emoji:"🐰", level:5, character:"coelho", genero:"m"},
  // Palavra pedagogicamente valiosa (animal típico do Brasil) que não tinha
  // emoji reconhecível — primeiro caso de ícone SVG próprio no banco.
  {word:"TATU", syl:["TA","TU"], svg:ICON_TATU, level:2, character:"tatu", genero:"m"},
  // ======================================================================
  // EXPANSÃO — auditoria de família silábica (consoante × 5 vogais A/E/I/O/U)
  // encontrou lacunas reais: nenhuma palavra com dígrafo NH, RR ou SS no
  // banco original, e várias consoantes com só 2 das 5 vogais representadas
  // (ex.: M só tinha MA, N só tinha NA). As 33 palavras abaixo fecham essas
  // lacunas de propósito — cada uma foi escolhida pra completar uma sílaba
  // que faltava, não just pra engordar o banco. Depois desta expansão: T, L,
  // P, R, S e N ficam com as 5 vogais completas; M fica completo via MILHO
  // (MI) + as que já existiam; B, D, F, G, J e V ficam parcialmente mais
  // completos mas ainda com 1-2 vogais raras de verdade em português (ex.:
  // BE, JE) — isso é limitação real do idioma pra palavras curtas e
  // concretas de criança pequena, não falta de curadoria (documentado no
  // índice). X, Z, K, W, Y seguem como limitação conhecida (letras raras).
  // ======================================================================
  {word:"DEDO",   syl:["DE","DO"],   emoji:"👆", level:1, character:"dedo", genero:"m"},
  {word:"MESA",   syl:["ME","SA"],   emoji:"🪑", level:1, character:"mesa", genero:"f"},
  {word:"RUA",    syl:["RU","A"],    emoji:"🛣️", level:1, character:"rua", genero:"f"},
  {word:"SETE",   syl:["SE","TE"],   emoji:"7️⃣", level:1, character:"sete", genero:"m"}, // plano original era sem vídeo (BANCO_87_PALAVRAS.md dizia "sete objetos aparecem"), mas o vídeo de personagem foi gravado mesmo assim (2026-08-18) — implementado, plano superado pela mídia real
  {word:"PERA",   syl:["PE","RA"],   emoji:"🍐", level:1, character:"pera", genero:"f"},
  {word:"DIA",    syl:["DI","A"],    emoji:"🌤️", level:1, character:"dia", genero:"m"}, // cena contextual (sol nasce atrás de nuvem) — Lia ainda usa fala padrão "personagem chegou", fala tipo "cena" pendente (ver docs/DECISOES.md 2026-08-18)
  {word:"RIO",    syl:["RI","O"],    emoji:"🌊", level:2, character:"rio", genero:"m"},
  {word:"SINO",   syl:["SI","NO"],   emoji:"🔔", level:2, character:"sino", genero:"m"},
  {word:"LEITE",  syl:["LEI","TE"],  emoji:"🥛", level:2, character:"leite", genero:"m"},
  {word:"NEVE",   syl:["NE","VE"],   emoji:"❄️", level:2, character:"neve", genero:"f"},
  {word:"MOLA",   syl:["MO","LA"],   emoji:"🪤", level:2, character:"mola", genero:"f"},
  {word:"MURO",   syl:["MU","RO"],   emoji:"🧱", level:2, character:"muro", genero:"m"}, // confirmado pelo Júlio em 2026-08-18: o parede.mp4 (sem pasta/palavra correspondente) era o vídeo do MURO -- renomeado pra personagens/muro/muro-intro.mp4
  {word:"FITA",   syl:["FI","TA"],   emoji:"🎀", level:2, character:"fita", genero:"f"},
  {word:"GELO",   syl:["GE","LO"],   emoji:"🧊", level:2, character:"gelo", genero:"m"},
  {word:"DUNA",   syl:["DU","NA"],   emoji:"🏜️", level:2, character:"duna", genero:"f"},
  {word:"NOVE",   syl:["NO","VE"],   emoji:"9️⃣", level:2, character:"nove", genero:"m"},
  {word:"BICO",   syl:["BI","CO"],   emoji:"🐦", level:2, character:"bico", genero:"m"},
  {word:"FESTA",  syl:["FES","TA"],  emoji:"🎉", level:3, character:"festa", genero:"f"},
  {word:"PUDIM",  syl:["PU","DIM"],  emoji:"🍮", level:3, character:"pudim", genero:"m"},
  {word:"NINHO",  syl:["NI","NHO"],  emoji:"🪺", level:3, character:"ninho", genero:"m"},
  {word:"CARRO",  syl:["CAR","RO"],  emoji:"🚗", level:3, character:"carro", genero:"m"},
  {word:"FERRO",  syl:["FER","RO"],  emoji:"🔧", level:3, character:"ferro", genero:"m"},
  {word:"OSSO",   syl:["OS","SO"],   emoji:"🦴", level:3, character:"osso", genero:"m"},
  {word:"MASSA",  syl:["MAS","SA"],  emoji:"🍝", level:3, character:"massa", genero:"f"},
  {word:"MILHO",  syl:["MI","LHO"],  emoji:"🌽", level:3, character:"milho", genero:"m"},
  {word:"JULHO",  syl:["JU","LHO"],  emoji:"📅", level:3, character:"julho", genero:"m"},
  {word:"VULCAO", syl:["VUL","CAO"], emoji:"🌋", level:4, character:"vulcao", genero:"m"},
  {word:"CEBOLA", syl:["CE","BO","LA"],  emoji:"🧅", level:5, character:"cebola", genero:"f"},
  {word:"CIDADE", syl:["CI","DA","DE"],  emoji:"🏙️", level:5, character:"cidade", genero:"f"},
  {word:"AGULHA", syl:["A","GU","LHA"],  emoji:"🪡", level:5, character:"agulha", genero:"f"},
  {word:"GARRAFA",syl:["GAR","RA","FA"], emoji:"🍾", level:5, character:"garrafa", genero:"f"},
  {word:"BURACO", syl:["BU","RA","CO"],  emoji:"🕳️", level:5, character:"buraco", genero:"m"},
  {word:"FUMACA", syl:["FU","MA","ÇA"],  emoji:"💨", level:5, character:"fumaca", genero:"f"}, // ÇA (não CA) -- Ç tem som próprio (/s/), diferente de C -- ver mediaFileName() em media-catalog.js e docs/DECISOES.md 2026-08-18
  {word:"JIBOIA", syl:["JI","BOI","A"],  emoji:"🐍", level:5, character:"jiboia", genero:"f"},
];

/* Nível de dificuldade de cada letra para o Caça-Letras do Benjamin (cumulativo) */
const LETTER_LEVELS = {
  A:1, E:1, I:1, O:1, U:1,
  B:2, C:2, D:2, F:2, G:2, L:2,
  M:3, N:3, P:3, R:3, S:3, T:3,
  V:4, Z:4, J:4, Q:4, H:4, X:4,
  K:5, W:5, Y:5
};

/* Pares mínimos reais (diferem por 1 fonema só) — base técnica pra atividade
   "Pares Mínimos", inspirada na sequência "Pares mínimos com consoantes
   homorgânicas" da Nova Escola. Testa discriminação sonora real via TTS,
   não letra/imagem — diferente do Som Inicial (que compara letra inicial).
   Contrastes fonéticos (surdo/sonoro no mesmo ponto de articulação — P/B,
   T/D, C/G, F/V) conferidos contra material de referência de fonoaudiologia
   (oficinadalinguagem.commercesuite.com.br — pares mínimos p/b, t/d, c/g),
   adaptados pra palavras com emoji reconhecível dos dois lados do par. */
const MIN_PAIRS = [
  // Nível 1 — fonemas bem distintos entre si, fácil discriminar
  {level:1, a:{word:"PÃO",  emoji:"🍞"}, b:{word:"MÃO",  emoji:"✋"}},
  {level:1, a:{word:"MÃO",  emoji:"✋"}, b:{word:"CÃO",  emoji:"🐕"}},
  {level:1, a:{word:"SOL",  emoji:"☀️"}, b:{word:"GOL",  emoji:"⚽"}},
  {level:1, a:{word:"PATO", emoji:"🦆"}, b:{word:"GATO", emoji:"🐱"}},
  // Nível 2 — ainda bem distinto, mais opções pra não repetir tanto
  {level:2, a:{word:"GATO", emoji:"🐱"}, b:{word:"GALO", emoji:"🐓"}},
  {level:2, a:{word:"PATO", emoji:"🦆"}, b:{word:"RATO", emoji:"🐭"}},
  {level:2, a:{word:"BOLA", emoji:"⚽"}, b:{word:"BOLO", emoji:"🎂"}},
  {level:2, a:{word:"POTE", emoji:"🫙"}, b:{word:"BOTE", emoji:"🛥️"}},
  // Nível 3 — mais sutil (vogal medial, ou consoante nasal/oral)
  {level:3, a:{word:"MALA", emoji:"🧳"}, b:{word:"BALA", emoji:"🍬"}},
  {level:3, a:{word:"BOLA", emoji:"⚽"}, b:{word:"BALA", emoji:"🍬"}},
  {level:3, a:{word:"DADO", emoji:"🎲"}, b:{word:"GADO", emoji:"🐄"}},
  // Nível 4 — contraste surdo/sonoro clássico (o coração de "pares mínimos com consoantes homorgânicas")
  {level:4, a:{word:"FACA", emoji:"🔪"}, b:{word:"VACA", emoji:"🐮"}},
  {level:4, a:{word:"GATO", emoji:"🐱"}, b:{word:"GADO", emoji:"🐄"}},
  {level:4, a:{word:"POTE", emoji:"🫙"}, b:{word:"BOLA", emoji:"⚽"}},
  // Nível 5 — o mais sutil do banco
  {level:5, a:{word:"BOTA", emoji:"🥾"}, b:{word:"BOLA", emoji:"⚽"}},
  {level:5, a:{word:"BOTE", emoji:"🛥️"}, b:{word:"POTE", emoji:"🫙"}},
  // reforço de nível — reaproveita vocabulário já emoji-validado em contrastes novos
  {level:2, a:{word:"SALA", emoji:"🛋️"}, b:{word:"MALA", emoji:"🧳"}},
  {level:3, a:{word:"CÃO",  emoji:"🐕"}, b:{word:"PÃO",  emoji:"🍞"}},
  {level:4, a:{word:"SALA", emoji:"🛋️"}, b:{word:"BALA", emoji:"🍬"}},
  // pares que só existem agora graças ao ícone SVG próprio — sem emoji bom
  // pra "gola" ou "coleira", esse contraste C/G real (fonte: mesma lista de
  // fonoaudiologia usada antes) ficaria de fora do banco
  {level:3, a:{word:"COLA", svg:ICON_COLA}, b:{word:"GOLA", svg:ICON_GOLA}},
  {level:4, a:{word:"COLEIRA", svg:ICON_COLEIRA}, b:{word:"GOLEIRA", svg:ICON_GOLEIRA}},
];

/* Grupos de rima real (não é "mesma letra final", é o mesmo som final),
   inspirado nas sequências "O que rima com" / "Letra de Canção". */
const RHYME_GROUPS = [
  {level:1, rhyme:"-ÃO", words:[{word:"LEÃO",emoji:"🦁"},{word:"PÃO",emoji:"🍞"},{word:"FEIJÃO",emoji:"🫘"},{word:"MELÃO",emoji:"🍈"},{word:"MÃO",emoji:"✋"},{word:"CÃO",emoji:"🐕"}]},
  {level:2, rhyme:"-EL", words:[{word:"ANEL",emoji:"💍"},{word:"MEL",emoji:"🍯"},{word:"PAPEL",emoji:"📄"}]},
  {level:3, rhyme:"-ATO", words:[{word:"GATO",emoji:"🐱"},{word:"PATO",emoji:"🦆"},{word:"RATO",emoji:"🐭"},{word:"SAPATO",emoji:"👞"}]},
  {level:4, rhyme:"-OR", words:[{word:"FLOR",emoji:"🌸"},{word:"AMOR",emoji:"❤️"},{word:"CALOR",emoji:"🔥"},{word:"SUOR",emoji:"💦"}]},
  {level:5, rhyme:"-INHO", words:[{word:"PASSARINHO",emoji:"🐦"},{word:"NINHO",emoji:"🪺"},{word:"CAMINHO",emoji:"🛤️"}]},
];

/* Famílias de palavras que trocam a 1ª letra e viram outra palavra real —
   base da atividade "Manipulação de Palavra", inspirada nas sequências
   "Se mudar de lugar, muda a palavra?" e "Se tirar, qual palavra formou?". */
const WORD_FAMILIES = [
  {level:1, pattern:"_ATO", variants:[{letter:"G",word:"GATO",emoji:"🐱"},{letter:"P",word:"PATO",emoji:"🦆"},{letter:"R",word:"RATO",emoji:"🐭"}]},
  {level:1, pattern:"_ÃO",  variants:[{letter:"M",word:"MÃO",emoji:"✋"},{letter:"C",word:"CÃO",emoji:"🐕"},{letter:"P",word:"PÃO",emoji:"🍞"}]},
  {level:2, pattern:"_ADO", variants:[{letter:"D",word:"DADO",emoji:"🎲"},{letter:"G",word:"GADO",emoji:"🐄"}]},
  {level:3, pattern:"_ALA", variants:[{letter:"B",word:"BALA",emoji:"🍬"},{letter:"M",word:"MALA",emoji:"🧳"},{letter:"S",word:"SALA",emoji:"🛋️"}]},
  {level:4, pattern:"_ACA", variants:[{letter:"V",word:"VACA",emoji:"🐮"},{letter:"F",word:"FACA",emoji:"🔪"}]},
  {level:5, pattern:"_OTE", variants:[{letter:"P",word:"POTE",emoji:"🫙"},{letter:"B",word:"BOTE",emoji:"🛥️"}]},
  // família só viável agora com ícone SVG (COLA/GOLA não têm emoji bom) —
  // BOLA reaproveita o emoji que já existe, COLA/GOLA usam o ícone próprio
  {level:2, pattern:"_OLA", variants:[{letter:"B",word:"BOLA",emoji:"⚽"},{letter:"C",word:"COLA",svg:ICON_COLA},{letter:"G",word:"GOLA",svg:ICON_GOLA}]},
];

