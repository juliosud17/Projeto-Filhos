// Conteudo + definicao das atividades dos 7 modulos da trilha de Portugues (Benjamin).
const MODULE1_ACTIVITIES = [
  {id:"silabas",       name:"Monte a Sílaba",         icon:"🧩", desc:"Formar palavras juntando sílabas"},
  {id:"letras_b",      name:"Caça-Letras",            icon:"🔤", desc:"Reconhecer as letras do alfabeto"},
  {id:"cominicial",    name:"Som Inicial",            icon:"👂", desc:"Comparar a letra inicial das palavras"},
  {id:"pares_minimos", name:"Pares Mínimos",          icon:"🎧", desc:"Ouvir com atenção e distinguir sons parecidos"},
  {id:"rimas",         name:"Rimas",                  icon:"🎶", desc:"Descobrir qual palavra rima"},
  {id:"manipulacao",   name:"Troca-Letra",            icon:"🔄", desc:"Trocar 1 letra e descobrir a nova palavra"},
  {id:"maiusc_minusc", name:"Maiúscula ↔ Minúscula",  icon:"🔠", desc:"Reconhecer a mesma letra maiúscula e minúscula"},
];

/* As atividades do Módulo 2 (Leitura de Palavras), mesmo padrão do Módulo 1:
   cada uma jogada separadamente, com 5 níveis próprios. "Leia a Frase" nasceu
   pra cobrir 2 habilidades que a Leitura Rápida sozinha não testava:
   EF01LP12 (separação de palavras por espaço — "quantas palavras tem essa
   frase?") e EF01LP01 (direção da leitura — apontar a primeira/última
   palavra). Não testa compreensão semântica da frase — isso é do Módulo 5. */
const MODULE2_ACTIVITIES = [
  {id:"leitura",        name:"Leitura Rápida", icon:"📖", desc:"Ler a palavra e achar a figura"},
  {id:"frases_leitura", name:"Leia a Frase",   icon:"📝", desc:"Contar palavras e apontar a primeira/última de uma frase"},
  {id:"escrita_certa",  name:"Escrita Certa",  icon:"🖋️", desc:"Comparar a escrita certa com um erro comum de quem tá aprendendo"},
];

/* Pares "escrita certa vs. erro comum" pra EF01LP03 (comparar a própria
   escrita/uma escrita dada com a escrita convencional) — a única habilidade do
   Módulo 2 que ainda não tinha atividade dedicada. Os erros não são
   aleatórios: cada um reproduz uma confusão ortográfica real e documentada de
   quem tá alfabetizando em português (omissão de letra, S/Z, dígrafos CH/X e
   LH, G/J antes de E/I, B/V e L/R por semelhança de traço, E/I átono final).
   A imagem fica na tela o tempo todo — a criança não precisa decifrar a
   palavra do zero, só comparar as DUAS grafias e escolher a convencional. */
const WRITING_PAIRS = [
  // Nível 1 — omissão de letra (erro mais grosseiro e fácil de perceber)
  {level:1, correct:"GATO", wrong:"GTO",  emoji:"🐱"},
  {level:1, correct:"BOLA", wrong:"BLA",  emoji:"⚽"},
  {level:1, correct:"SAPO", wrong:"SPO",  emoji:"🐸"},
  {level:1, correct:"VACA", wrong:"VCA",  emoji:"🐮"},
  {level:1, correct:"PATO", wrong:"PTO",  emoji:"🦆"},
  // Nível 2 — S/Z (mesmo som, grafia errada) e letra dobrada indevida
  {level:2, correct:"CASA", wrong:"CAZA",  emoji:"🏠"},
  {level:2, correct:"ROSA", wrong:"ROZA",  emoji:"🌹"},
  {level:2, correct:"MALA", wrong:"MALLA", emoji:"🧳"},
  {level:2, correct:"BOLO", wrong:"BOLLO", emoji:"🎂"},
  // Nível 3 — dígrafo trocado (CH/X) e letras parecidas no traço (B/V, L/R)
  {level:3, correct:"CHAVE", wrong:"XAVE",  emoji:"🔑"},
  {level:3, correct:"BALA",  wrong:"VALA",  emoji:"🍬"},
  {level:3, correct:"ZEBRA", wrong:"ZEBLA", emoji:"🦓"},
  // Nível 4 — G/J antes de E/I (clássico: soa igual, escreve diferente) e cluster consonantal
  {level:4, correct:"GIRAFA", wrong:"JIRAFA", emoji:"🦒"},
  {level:4, correct:"XADREZ", wrong:"CHADREZ",emoji:"♟️"},
  {level:4, correct:"LIVRO",  wrong:"LIVLO",  emoji:"📖"},
  // Nível 5 — dígrafo LH, QU x K, e E/I átono no final da palavra (fala "TOMATI", escreve "TOMATE")
  {level:5, correct:"QUEIJO",  wrong:"KEIJO",   emoji:"🧀"},
  {level:5, correct:"COELHO",  wrong:"COELIO",  emoji:"🐰"},
  {level:5, correct:"SORVETE", wrong:"SORVETI", emoji:"🍦"},
  {level:5, correct:"TOMATE",  wrong:"TOMATI",  emoji:"🍅"},
  // Expansão — mais exemplos por categoria de erro, reaproveitando o banco
  // de palavras ampliado do Módulo 1, pra reduzir repetição na mesma sessão.
  {level:1, correct:"CASA", wrong:"CSA",   emoji:"🏠"},
  {level:1, correct:"RATO", wrong:"RTO",   emoji:"🐭"},
  {level:2, correct:"MESA", wrong:"MEZA",  emoji:"🪑"},
  {level:2, correct:"CARRO", wrong:"CARO", emoji:"🚗"},
  {level:3, correct:"NINHO", wrong:"NIINHO", emoji:"🪺"},
  {level:3, correct:"GALO",  wrong:"GARO",   emoji:"🐓"},
  {level:4, correct:"MILHO", wrong:"MILIO",  emoji:"🌽"},
  {level:4, correct:"AGULHA", wrong:"AGULIA", emoji:"🪡"},
  {level:5, correct:"CIDADE",  wrong:"CIDADI",  emoji:"🏙️"},
  {level:5, correct:"GARRAFA", wrong:"GARAFA",  emoji:"🍾"},
];

/* Frases curtas de 2 a 6 palavras (nível 1 a 5), com vocabulário majoritariamente
   já conhecido do banco WORDS + um punhado de palavras simples de 1º ano
   (verbos e adjetivos curtos). Todas com palavras distintas dentro da mesma
   frase, pra "primeira/última palavra" nunca ficar ambíguo. */
const PHRASES = [
  {level:1, words:["O","GATO"]},
  {level:1, words:["A","BOLA"]},
  {level:1, words:["O","SAPO"]},
  {level:1, words:["A","VACA"]},
  {level:1, words:["O","PATO"]},
  {level:1, words:["A","CASA"]},
  {level:1, words:["O","SOL"]},
  {level:1, words:["A","LUA"]},
  {level:2, words:["O","GATO","DORME"]},
  {level:2, words:["A","BOLA","CAI"]},
  {level:2, words:["O","SAPO","PULA"]},
  {level:2, words:["A","VACA","COME"]},
  {level:2, words:["O","PATO","NADA"]},
  {level:2, words:["A","LUA","BRILHA"]},
  {level:3, words:["O","SAPO","PULA","ALTO"]},
  {level:3, words:["A","VACA","COME","CAPIM"]},
  {level:3, words:["O","GATO","DORME","MUITO"]},
  {level:3, words:["A","LUA","BRILHA","FORTE"]},
  {level:4, words:["O","RATO","CORRE","NA","CASA"]},
  {level:4, words:["A","BOLA","CAI","NO","CHÃO"]},
  {level:4, words:["O","SAPO","PULA","NA","LUA"]},
  {level:4, words:["A","VACA","COME","NO","CAMPO"]},
  {level:5, words:["O","GATO","PRETO","DORME","NA","CAMA"]},
  {level:5, words:["A","BOLA","GRANDE","CAI","NO","CHÃO"]},
  {level:5, words:["O","SAPO","VERDE","PULA","NA","LUA"]},
  {level:5, words:["A","VACA","MARROM","COME","NO","CAMPO"]},
  // Expansão — novos sujeitos (menos repetição de GATO/BOLA/SAPO/VACA/PATO
  // em toda sessão), reaproveitando o banco de palavras ampliado do Módulo 1.
  {level:1, words:["O","URSO"]},
  {level:1, words:["A","GIRAFA"]},
  {level:1, words:["O","CAVALO"]},
  {level:2, words:["O","URSO","DORME"]},
  {level:2, words:["A","GIRAFA","COME"]},
  {level:2, words:["O","CARRO","ANDA"]},
  {level:3, words:["O","CAVALO","CORRE","RÁPIDO"]},
  {level:3, words:["A","GIRAFA","COME","FOLHAS"]},
  {level:4, words:["O","MACACO","SOBE","NA","ÁRVORE"]},
  {level:4, words:["A","GALINHA","BOTA","UM","OVO"]},
  {level:5, words:["O","CAVALO","BRANCO","CORRE","NO","CAMPO"]},
  {level:5, words:["A","GIRAFA","ALTA","COME","FOLHAS","VERDES"]},
];

/* As atividades do Módulo 3 (Leitura de Frases e Textos Curtos). EF01LP19
   ("recitar parlendas/trava-línguas com entonação adequada") NÃO tem
   atividade própria — não dá pra avaliar recitação sem microfone, então em
   vez de fingir que testamos isso, a Parlendas e Trava-Línguas oferece um
   botão "ouvir e recitar junto" (TTS lê o texto inteiro, sem pontuação de
   acerto) pra exposição/prática em voz alta com um adulto, mas o que é
   efetivamente pontuado ali é compreensão de estrutura (EF01LP16), não
   entonação. Ver limitação documentada no índice de currículo. */
const MODULE3_ACTIVITIES = [
  {id:"parlendas",       name:"Parlendas e Trava-Línguas", icon:"🎤", desc:"Ler e entender quadras, parlendas e trava-línguas"},
  {id:"silaba_meio_fim", name:"Som do Meio e do Fim",       icon:"🔊", desc:"Comparar palavras pelo som de sílabas mediais e finais"},
  {id:"pontuacao",       name:"Pontuação Certa",            icon:"❓", desc:"Escolher o ponto, a interrogação ou a exclamação certa"},
];

/* Parlendas e trava-línguas reais do folclore infantil brasileiro (domínio
   público), não inventados — quanto mais versos, maior o nível. */
const PARLENDAS = [
  {level:1, lines:["O rato roeu a roupa do rei de Roma."]},
  {level:1, lines:["Um tigre, dois tigres, três tigres."]},
  {level:1, lines:["Se a serpente se sente, sente-se, serpente."]},
  {level:2, lines:["Um, dois, feijão com arroz.", "Três, quatro, feijão no prato."]},
  {level:2, lines:["Borboletinha.", "Tá na cozinha."]},
  {level:3, lines:["Um, dois, feijão com arroz.", "Três, quatro, feijão no prato.", "Cinco, seis, girassóis."]},
  {level:3, lines:["Borboletinha.", "Tá na cozinha.", "Fazendo chocolate."]},
  {level:4, lines:["Um, dois, feijão com arroz.", "Três, quatro, feijão no prato.", "Cinco, seis, girassóis.", "Sete, oito, comer biscoito."]},
  {level:4, lines:["Borboletinha.", "Tá na cozinha.", "Fazendo chocolate.", "Para a madrinha."]},
  {level:4, lines:["Hoje é domingo.", "Pede cigarro ao vizinho.", "O vizinho não tem.", "Bate no bico do vintém."]},
  {level:5, lines:["Um, dois, feijão com arroz.", "Três, quatro, feijão no prato.", "Cinco, seis, girassóis.", "Sete, oito, comer biscoito.", "Nove, dez, comer pastéis."]},
  {level:5, lines:["Hoje é domingo.", "Pede cigarro ao vizinho.", "O vizinho não tem.", "Bate no bico do vintém.", "O vintém é de ouro."]},
  // Expansão — mais parlendas reais de domínio público do folclore infantil
  // brasileiro, pra não repetir sempre as mesmas 4 bases em toda sessão.
  {level:1, lines:["Fui à feira, comprei pão."]},
  {level:1, lines:["Serra, serra, serrador."]},
  {level:2, lines:["Pintinho amarelinho.", "Cabe na mão."]},
  {level:2, lines:["A canoa virou.", "Por causa de fulano."]},
  {level:3, lines:["Pintinho amarelinho.", "Cabe na mão.", "Vive pra sempre."]},
  {level:3, lines:["Lá vem o trem.", "Cheio de gente.", "Cheio de gás."]},
  {level:4, lines:["Fui à feira, comprei pão.", "Comprei ovo pra chocar.", "Ao chocar deu um pinto.", "Pinto que canta cocoricó."]},
  {level:5, lines:["Lá vem o trem.", "Cheio de gente.", "Cheio de gás.", "Cheio de fumaça.", "Trás, trás, trás."]},
];

/* Grupos pra comparar palavras pelo som de sílabas MEDIAIS ou FINAIS
   (EF01LP13) — diferente da Rimas do Módulo 1, que compara o som final da
   palavra inteira ouvida por TTS; aqui a comparação é pela posição da
   SÍLABA em si (meio ou fim), reforçando consciência silábica, não fonêmica.
   Palavras reaproveitadas do banco já conhecido — casamentos de sílaba
   reais, não forçados. */
const MEDIAL_FINAL_GROUPS = [
  {level:1, type:"final", syllable:"TO", words:[{word:"GATO",emoji:"🐱"},{word:"PATO",emoji:"🦆"},{word:"RATO",emoji:"🐭"}]},
  {level:2, type:"final", syllable:"LA", words:[{word:"BOLA",emoji:"⚽"},{word:"MALA",emoji:"🧳"}]},
  {level:2, type:"final", syllable:"SA", words:[{word:"CASA",emoji:"🏠"},{word:"ROSA",emoji:"🌹"}]},
  {level:3, type:"final", syllable:"CO", words:[{word:"SUCO",emoji:"🧃"},{word:"ARCO",emoji:"🌈"},{word:"PORCO",emoji:"🐷"},{word:"BARCO",emoji:"⛵"},{word:"MACACO",emoji:"🐵"}]},
  {level:4, type:"final", syllable:"LO", words:[{word:"CAVALO",emoji:"🐴"},{word:"BOLO",emoji:"🎂"},{word:"GALO",emoji:"🐓"}]},
  {level:5, type:"final", syllable:"TE", words:[{word:"SORVETE",emoji:"🍦"},{word:"TOMATE",emoji:"🍅"}]},
  {level:5, type:"medial", syllable:"CA", words:[{word:"JACARE",emoji:"🐊"},{word:"MACACO",emoji:"🐵"}]},
  // Expansão — reaproveita o banco de palavras ampliado do Módulo 1 (dígrafo
  // LH e RR agora têm palavra suficiente pra virar grupo próprio de comparação;
  // MILHO/JULHO terminam de verdade em "-LHO", diferente de NINHO que termina
  // em "-NHO" — dígrafos parecidos mas sons finais diferentes, não confundir).
  {level:3, type:"final", syllable:"LHO", words:[{word:"MILHO",emoji:"🌽"},{word:"JULHO",emoji:"📅"}]},
  {level:3, type:"final", syllable:"RRO", words:[{word:"CARRO",emoji:"🚗"},{word:"FERRO",emoji:"🔧"}]},
  {level:4, type:"final", syllable:"SA", words:[{word:"MASSA",emoji:"🍝"},{word:"MESA",emoji:"🪑"},{word:"CASA",emoji:"🏠"}]},
];

/* Frases sem pontuação final — a criança escolhe qual marca combina com o
   sentido/entonação da frase (EF01LP14). Cada nível tem uma de cada tipo
   (ponto, interrogação, exclamação), sinalizada por palavras-pista comuns
   (Que/Cuidado/Nossa/Socorro → exclamação; Cadê/Onde/Você/Quantos/Por que →
   interrogação; frase afirmativa simples → ponto final). */
const PUNCTUATION_SENTENCES = [
  {level:1, text:"Que gato bonito", correct:"!"},
  {level:1, text:"Cadê o gato", correct:"?"},
  {level:1, text:"O gato dorme", correct:"."},
  {level:2, text:"Que bola grande", correct:"!"},
  {level:2, text:"Onde está a bola", correct:"?"},
  {level:2, text:"A bola é redonda", correct:"."},
  {level:3, text:"Cuidado com o cachorro", correct:"!"},
  {level:3, text:"Você tem um cachorro", correct:"?"},
  {level:3, text:"O cachorro corre no parque", correct:"."},
  {level:4, text:"Nossa, que sapo enorme", correct:"!"},
  {level:4, text:"Quantos sapos você viu", correct:"?"},
  {level:4, text:"O sapo pula alto", correct:"."},
  {level:5, text:"Socorro, o rio está cheio", correct:"!"},
  {level:5, text:"Por que o rio está cheio", correct:"?"},
  {level:5, text:"O rio corre para o mar", correct:"."},
  // Expansão — mais frases por nível, reaproveitando vocabulário novo
  {level:1, text:"Que carro veloz", correct:"!"},
  {level:1, text:"O ninho tem ovos", correct:"."},
  {level:2, text:"Cadê o milho", correct:"?"},
  {level:2, text:"A festa é hoje", correct:"."},
  {level:3, text:"Nossa, que susto", correct:"!"},
  {level:3, text:"Você viu a girafa", correct:"?"},
  {level:4, text:"Cuidado com o vulcão", correct:"!"},
  {level:4, text:"Onde fica a cidade", correct:"?"},
  {level:5, text:"Que garrafa enorme", correct:"!"},
  {level:5, text:"Quantas cebolas você comprou", correct:"?"},
];

/* As atividades do Módulo 4 (Primeiras Produções Escritas) — "escrita guiada
   com validação leve": cada rodada é uma missão de escrever DENTRO de um
   contexto real (lista, bilhete, parlenda), nunca uma palavra solta ou uma
   redação livre sem correção nenhuma. Reaproveita o mesmo mecanismo testado
   de digitação do Módulo 1 (Digite a Palavra), aplicado a contextos novos. */
const MODULE4_ACTIVITIES = [
  {id:"lista_completa",  name:"Complete a Lista",   icon:"📋", desc:"Escrever a palavra que falta numa lista (EF01LP17)"},
  {id:"texto_funcional", name:"Texto do Dia a Dia",  icon:"✉️", desc:"Completar bilhetes, convites, receitas e combinados da turma (EF01LP17/21)"},
  {id:"parlenda_de_cor", name:"Parlenda de Cor",     icon:"🖊️", desc:"Escrever de memória a palavra que falta numa parlenda conhecida (EF01LP18)"},
];

/* Listas temáticas curtas com 1 lacuna — EF01LP17 (produzir listas). */
const LISTS = [
  {level:1, title:"Lista de frutas para a salada", items:["MAÇÃ","BANANA","___"], answer:"UVA", hint:"🍇"},
  {level:1, title:"Lista de bichos da fazenda",     items:["VACA","GALO","___"],   answer:"PATO", hint:"🦆"},
  {level:2, title:"Lista de compras da vovó",       items:["OVO","LEITE","___"],   answer:"PÃO", hint:"🍞"},
  {level:2, title:"Lista de bichos de estimação",   items:["GATO","___"],          answer:"CACHORRO", hint:"🐶"},
  {level:3, title:"Lista do material escolar",      items:["LÁPIS","BORRACHA","___"], answer:"CADERNO", hint:"📓"},
  {level:3, title:"Lista de frutas da feira",       items:["BANANA","UVA","___"],  answer:"TOMATE", hint:"🍅"},
  {level:4, title:"Lista do lanche da escola",      items:["SUCO","BOLO","___"],   answer:"SORVETE", hint:"🍦"},
  {level:4, title:"Lista de bichos do zoológico",   items:["GIRAFA","MACACO","___"], answer:"ZEBRA", hint:"🦓"},
  {level:5, title:"Lista de coisas para a viagem",  items:["MALA","CHAVE","___"],  answer:"LIVRO", hint:"📖"},
  {level:5, title:"Lista de bichos do rio",         items:["JACARÉ","PEIXE","___"], answer:"COBRA", hint:"🐍"},
  // Expansão — mais listas por nível, menos repetição na mesma sessão
  {level:1, title:"Lista de números",              items:["SETE","NOVE","___"], answer:"DEZ", hint:"🔟"},
  {level:2, title:"Lista de coisas da cozinha",     items:["PANELA","GARRAFA","___"], answer:"COPO", hint:"🥤"},
  {level:3, title:"Lista de meses do ano",          items:["JUNHO","JULHO","___"], answer:"AGOSTO", hint:"📅"},
  {level:4, title:"Lista de partes da casa",        items:["CIDADE","MURO","___"], answer:"PORTÃO", hint:"🚪"},
  {level:5, title:"Lista de bichos que se enrolam", items:["TATU","MINHOCA","___"], answer:"COBRA", hint:"🐍"},
];

/* Textos funcionais curtos com 1 lacuna — bilhete, convite, receita (EF01LP17)
   e combinado/regra da turma (EF01LP21), misturados no mesmo banco porque as
   4 habilidades pedem o mesmo formato (texto curto do cotidiano com 1 palavra
   faltando), só muda o gênero textual. */
const FUNCTIONAL_TEXTS = [
  {level:1, type:"bilhete", text:"Mamãe, fui brincar na ___ da vizinha.", answer:"CASA", hint:"🏠"},
  {level:1, type:"regra",   text:"Regra da sala: sempre levantar a ___ antes de falar.", answer:"MÃO", hint:"✋"},
  {level:2, type:"convite", text:"Venha para o meu aniversário e coma um pedaço de ___!", answer:"BOLO", hint:"🎂"},
  {level:2, type:"receita", text:"Receita de suco gelado: bata a fruta com água e ___.", answer:"GELO", hint:"🧊"},
  {level:3, type:"bilhete", text:"Querido pai, comprei um ___ novo para desenhar.", answer:"LÁPIS", hint:"✏️"},
  {level:3, type:"regra",   text:"Regra da sala: guardar os ___ depois de brincar.", answer:"BRINQUEDOS", hint:"🧸"},
  {level:4, type:"convite", text:"Convido você para a festa da escola na ___ nova.", answer:"ESCOLA", hint:"🏫"},
  {level:4, type:"receita", text:"Receita de bolo: misture farinha, ovo e ___.", answer:"LEITE", hint:"🥛"},
  {level:5, type:"bilhete", text:"Levei o ___ emprestado para a biblioteca da escola.", answer:"LIVRO", hint:"📖"},
  {level:5, type:"regra",   text:"Regra da sala: pedir ___ para usar o brinquedo do amigo.", answer:"LICENÇA", hint:"🙏"},
  // Expansão — mais textos funcionais por nível, mesmos 4 gêneros
  {level:1, type:"bilhete", text:"Vovó, deixei o ___ em cima da mesa.", answer:"BILHETE", hint:"📝"},
  {level:2, type:"regra",   text:"Regra da sala: guardar o ___ depois de usar.", answer:"LÁPIS", hint:"✏️"},
  {level:3, type:"convite", text:"Venha ver o ___ que vai fazer erupção na feira de ciências!", answer:"VULCÃO", hint:"🌋"},
  {level:4, type:"receita", text:"Receita de pipoca: coloque o ___ na panela quente.", answer:"MILHO", hint:"🌽"},
  {level:5, type:"bilhete", text:"Fui à ___ comprar pão, já volto.", answer:"CIDADE", hint:"🏙️"},
];

/* As atividades do Módulo 5 (Compreensão de Textos e Gêneros). "Ler e
   Responder" é a primeira atividade do app inteiro que testa compreensão de
   verdade (interpretar o que o texto diz), não só reconhecer palavra/som/
   estrutura — todos os módulos anteriores eram sobre decodificação. */
const MODULE5_ACTIVITIES = [
  {id:"sinonimos_antonimos", name:"Sinônimos e Antônimos", icon:"⚖️", desc:"Agrupar palavras por significado parecido ou oposto (EF01LP15)"},
  {id:"genero_textual",      name:"Qual é o Gênero?",       icon:"🗂️", desc:"Reconhecer lista, bilhete, receita, convite e parlenda pelo formato (EF01LP20)"},
  {id:"ler_responder",       name:"Ler e Responder",        icon:"🧐", desc:"Ler uma curiosidade curta e responder sobre ela (EF01LP22/24)"},
];

/* Sinônimo/antônimo com distratores curados à mão (não aleatórios) — pra
   garantir que as opções erradas sejam plausíveis mas claramente erradas,
   não um chute óbvio. EF01LP15. */
const WORD_RELATIONS = [
  {level:1, word:"GRANDE", type:"antônimo", correct:"PEQUENO", wrongs:["QUENTE","FELIZ"]},
  {level:1, word:"QUENTE", type:"antônimo", correct:"FRIO", wrongs:["GRANDE","TRISTE"]},
  {level:1, word:"FELIZ",  type:"antônimo", correct:"TRISTE", wrongs:["QUENTE","PEQUENO"]},
  {level:2, word:"RÁPIDO", type:"antônimo", correct:"DEVAGAR", wrongs:["ALTO","LIMPO"]},
  {level:2, word:"ALTO",   type:"antônimo", correct:"BAIXO", wrongs:["SUJO","RÁPIDO"]},
  {level:2, word:"LIMPO",  type:"antônimo", correct:"SUJO", wrongs:["ALTO","DEVAGAR"]},
  {level:3, word:"GRANDE", type:"sinônimo", correct:"GIGANTE", wrongs:["PEQUENO","TRISTE"]},
  {level:3, word:"BONITO", type:"sinônimo", correct:"LINDO", wrongs:["FEIO","BAIXO"]},
  {level:3, word:"FELIZ",  type:"sinônimo", correct:"ALEGRE", wrongs:["TRISTE","CALADO"]},
  {level:4, word:"FORTE",  type:"sinônimo", correct:"PODEROSO", wrongs:["FRACO","BAIXO"]},
  {level:4, word:"RÁPIDO", type:"sinônimo", correct:"VELOZ", wrongs:["DEVAGAR","PEQUENO"]},
  {level:4, word:"CORAJOSO", type:"sinônimo", correct:"VALENTE", wrongs:["MEDROSO","CALADO"]},
  {level:5, word:"GENEROSO", type:"antônimo", correct:"EGOÍSTA", wrongs:["VALENTE","ALEGRE"]},
  {level:5, word:"INTELIGENTE", type:"sinônimo", correct:"ESPERTO", wrongs:["BURRO","BARULHENTO"]},
  {level:5, word:"CALADO", type:"antônimo", correct:"BARULHENTO", wrongs:["ESPERTO","EGOÍSTA"]},
  // Expansão — mais pares por nível, menos repetição na mesma sessão
  {level:1, word:"LIMPO", type:"antônimo", correct:"SUJO", wrongs:["QUENTE","GRANDE"]},
  {level:1, word:"ALTO", type:"antônimo", correct:"BAIXO", wrongs:["FELIZ","FRIO"]},
  {level:2, word:"BONITO", type:"antônimo", correct:"FEIO", wrongs:["DEVAGAR","GIGANTE"]},
  {level:2, word:"FRACO", type:"antônimo", correct:"FORTE", wrongs:["BAIXO","SUJO"]},
  {level:3, word:"PEQUENO", type:"sinônimo", correct:"MINÚSCULO", wrongs:["GIGANTE","VELOZ"]},
  {level:4, word:"MEDROSO", type:"antônimo", correct:"VALENTE", wrongs:["ESPERTO","GIGANTE"]},
  {level:5, word:"VALENTE", type:"sinônimo", correct:"CORAJOSO", wrongs:["MEDROSO","EGOÍSTA"]},
];

/* Trechos curtos com gênero textual reconhecível — reaproveita o "sabor" dos
   bancos de conteúdo já usados no Módulo 4 (lista/bilhete/receita/convite) +
   parlenda do Módulo 3, agora pedindo pra NOMEAR o gênero, não completar.
   EF01LP20. */
const TEXT_GENRES = [
  {level:1, excerpt:"MAÇÃ, BANANA, UVA", genre:"LISTA", wrongs:["RECEITA","BILHETE"]},
  {level:1, excerpt:"Mamãe, fui brincar na casa da vizinha.", genre:"BILHETE", wrongs:["LISTA","RECEITA"]},
  {level:2, excerpt:"Bata a fruta com água e gelo.", genre:"RECEITA", wrongs:["BILHETE","CONVITE"]},
  {level:2, excerpt:"Venha para o meu aniversário!", genre:"CONVITE", wrongs:["RECEITA","LISTA"]},
  {level:3, excerpt:"Um, dois, feijão com arroz.", genre:"PARLENDA", wrongs:["BILHETE","RECEITA"]},
  {level:3, excerpt:"LÁPIS, BORRACHA, CADERNO", genre:"LISTA", wrongs:["CONVITE","PARLENDA"]},
  {level:4, excerpt:"Misture farinha, ovo e leite.", genre:"RECEITA", wrongs:["PARLENDA","LISTA"]},
  {level:4, excerpt:"Querido pai, comprei um lápis novo.", genre:"BILHETE", wrongs:["CONVITE","RECEITA"]},
  {level:5, excerpt:"Borboletinha, tá na cozinha.", genre:"PARLENDA", wrongs:["LISTA","CONVITE"]},
  {level:5, excerpt:"Convido você para a festa da escola.", genre:"CONVITE", wrongs:["BILHETE","PARLENDA"]},
  // Expansão — mais trechos por nível, menos repetição
  {level:1, excerpt:"CARRO, FERRO, GARRAFA", genre:"LISTA", wrongs:["RECEITA","BILHETE"]},
  {level:2, excerpt:"Coloque o milho na panela quente.", genre:"RECEITA", wrongs:["BILHETE","LISTA"]},
  {level:3, excerpt:"Serra, serra, serrador.", genre:"PARLENDA", wrongs:["CONVITE","LISTA"]},
  {level:4, excerpt:"Vovó, deixei o bilhete em cima da mesa.", genre:"BILHETE", wrongs:["RECEITA","PARLENDA"]},
  {level:5, excerpt:"Venha ver o vulcão da feira de ciências!", genre:"CONVITE", wrongs:["LISTA","RECEITA"]},
];

/* Mini-textos de curiosidade (2-3 frases) com pergunta de interpretação —
   primeiro banco do app que exige compreensão de texto de verdade, não só
   reconhecimento de palavra/som/estrutura. EF01LP22/24 (lado de leitura). */
const CURIOSITIES = [
  {level:1, text:"O gato dorme quase o dia inteiro.", question:"O que o gato faz quase o dia inteiro?", correct:"Dorme", wrongs:["Corre","Nada"]},
  {level:1, text:"A girafa tem o pescoço muito comprido.", question:"O que a girafa tem muito comprido?", correct:"O pescoço", wrongs:["A cauda","As orelhas"]},
  {level:2, text:"O sapo pula muito alto para pegar insetos.", question:"Por que o sapo pula alto?", correct:"Para pegar insetos", wrongs:["Para nadar","Para dormir"]},
  {level:2, text:"A abelha faz mel dentro da colmeia.", question:"Onde a abelha faz mel?", correct:"Na colmeia", wrongs:["No rio","Na árvore"]},
  {level:3, text:"O tigre é um animal muito forte e vive na floresta.", question:"Onde o tigre vive?", correct:"Na floresta", wrongs:["No mar","No deserto"]},
  {level:3, text:"A zebra tem listras pretas e brancas pelo corpo todo.", question:"De que cor são as listras da zebra?", correct:"Pretas e brancas", wrongs:["Verdes e amarelas","Azuis e roxas"]},
  {level:4, text:"O macaco gosta de comer banana e pular de árvore em árvore.", question:"O que o macaco gosta de fazer, além de comer banana?", correct:"Pular de árvore em árvore", wrongs:["Nadar no rio","Voar no céu"]},
  {level:4, text:"O jacaré fica muito tempo parado dentro da água esperando a comida chegar.", question:"Onde o jacaré fica esperando a comida?", correct:"Dentro da água", wrongs:["Em cima da árvore","Debaixo da terra"]},
  {level:5, text:"O tatu se enrola como uma bola quando sente perigo. Assim, ele se protege de outros animais.", question:"Por que o tatu se enrola como uma bola?", correct:"Para se proteger", wrongs:["Para dormir melhor","Para nadar mais rápido"]},
  {level:5, text:"O urso passa o inverno inteiro dormindo dentro de uma toca. Esse sono comprido se chama hibernação.", question:"Como se chama o sono comprido do urso?", correct:"Hibernação", wrongs:["Migração","Alimentação"]},
  // Expansão — mais curiosidades por nível
  {level:1, text:"O cavalo consegue dormir em pé.", question:"Como o cavalo consegue dormir?", correct:"Em pé", wrongs:["Voando","Debaixo d'água"]},
  {level:2, text:"A minhoca ajuda a deixar a terra mais fofa para as plantas.", question:"O que a minhoca ajuda a deixar mais fofo?", correct:"A terra", wrongs:["A água","O ar"]},
  {level:3, text:"A galinha bota um ovo quase todos os dias.", question:"O que a galinha bota quase todos os dias?", correct:"Um ovo", wrongs:["Uma pedra","Uma flor"]},
  {level:4, text:"O vulcão pode ficar dormindo por muitos anos antes de entrar em erupção de novo.", question:"O que o vulcão pode fazer antes de entrar em erupção?", correct:"Ficar dormindo por anos", wrongs:["Voar pelo céu","Nadar no mar"]},
  {level:5, text:"A borboleta começa a vida como uma lagarta e depois se transforma dentro de um casulo. Essa transformação se chama metamorfose.", question:"Como se chama a transformação da lagarta em borboleta?", correct:"Metamorfose", wrongs:["Hibernação","Migração"]},
];

/* As atividades do Módulo 6 (Narrativas e Recontagem). "Reconte a História" é
   a primeira atividade do app com mecânica de ORDENAR em vez de escolher
   entre opções soltas — a criança toca os acontecimentos na sequência
   certa, testando enredo de verdade (EF01LP25), não só reconhecimento. */
const MODULE6_ACTIVITIES = [
  {id:"elementos_historia", name:"Elementos da História", icon:"🎭", desc:"Identificar quem, onde e quando da história (EF01LP26)"},
  {id:"reconte_historia",   name:"Reconte a História",     icon:"🔢", desc:"Colocar os acontecimentos na ordem certa (EF01LP25)"},
  {id:"invente_final",      name:"Invente o Final",        icon:"🎬", desc:"Escolher o final que faz mais sentido pra história (EF01LP25/26)"},
];

/* Mini-histórias de 3 acontecimentos, com personagem/lugar/tempo definidos e
   distratores plausíveis (não chute óbvio) — base compartilhada da Elementos
   da História (EF01LP26) e da Reconte a História (EF01LP25, ordenação). */
const MINI_STORIES = [
  {level:1, character:"O coelho", wrongCharacters:["O lobo","A galinha"], place:"Na floresta", wrongPlaces:["No mar","Na cidade"], time:"De manhã", wrongTimes:["À noite","No inverno"],
   events:["O coelho acordou de manhã.","Ele saiu para procurar cenouras.","Encontrou muitas cenouras na floresta."]},
  {level:1, character:"O pato", wrongCharacters:["O gato","A vaca"], place:"No lago", wrongPlaces:["Na montanha","No deserto"], time:"À tarde", wrongTimes:["De manhã","De noite"],
   events:["O pato foi até o lago à tarde.","Ele nadou com os amigos.","No fim, todos voltaram para casa."]},
  {level:2, character:"O sapo", wrongCharacters:["A aranha","O peixe"], place:"No jardim", wrongPlaces:["Na praia","Na escola"], time:"De noite", wrongTimes:["De manhã","De tarde"],
   events:["O sapo saiu de noite para caçar.","Ele pulou de folha em folha.","Pegou um inseto e voltou satisfeito."]},
  {level:2, character:"O gato", wrongCharacters:["O cachorro","O rato"], place:"Em casa", wrongPlaces:["Na floresta","No rio"], time:"De manhã", wrongTimes:["De noite","De tarde"],
   events:["O gato acordou em casa de manhã.","Ele tomou leite na cozinha.","Depois foi dormir no sofá."]},
  {level:3, character:"O macaco", wrongCharacters:["A girafa","O jacaré"], place:"Na árvore", wrongPlaces:["No rio","Na casa"], time:"De tarde", wrongTimes:["De manhã","De noite"],
   events:["O macaco subiu na árvore de tarde.","Ele comeu uma banana bem doce.","Depois pulou para outra árvore."]},
  {level:3, character:"O tigre", wrongCharacters:["O urso","A zebra"], place:"Na floresta", wrongPlaces:["No mar","Na cidade"], time:"De manhã", wrongTimes:["À noite","De tarde"],
   events:["O tigre acordou cedo na floresta.","Ele foi beber água no rio.","Depois descansou embaixo de uma árvore."]},
  {level:4, character:"A girafa", wrongCharacters:["O elefante","O leão"], place:"Na savana", wrongPlaces:["No gelo","No oceano"], time:"De manhã", wrongTimes:["De noite","De tarde"],
   events:["A girafa acordou cedo na savana.","Ela comeu folhas bem altas.","Depois caminhou devagar até o rio."]},
  {level:4, character:"O urso", wrongCharacters:["O lobo","A raposa"], place:"Na toca", wrongPlaces:["No rio","Na cidade"], time:"No inverno", wrongTimes:["No verão","De tarde"],
   events:["O urso dormiu na toca durante o inverno.","Ele acordou com fome.","Foi procurar comida na floresta."]},
  {level:5, character:"O jacaré", wrongCharacters:["O hipopótamo","A cobra"], place:"No rio", wrongPlaces:["No deserto","Na montanha"], time:"De tarde", wrongTimes:["De manhã","À noite"],
   events:["O jacaré ficou escondido na água de tarde.","Ele esperou um peixe se aproximar.","Rapidamente pegou o peixe para comer."]},
  {level:5, character:"O tatu", wrongCharacters:["O esquilo","O coelho"], place:"Na toca", wrongPlaces:["Na árvore","No rio"], time:"De noite", wrongTimes:["De manhã","De tarde"],
   events:["O tatu saiu da toca de noite.","Sentiu um barulho estranho perto dele.","Se enrolou como uma bola para se proteger."]},
  // Expansão — mais histórias por nível, menos repetição na mesma sessão
  {level:1, character:"A galinha", wrongCharacters:["O pato","O gato"], place:"No galinheiro", wrongPlaces:["No rio","Na árvore"], time:"De manhã", wrongTimes:["De noite","De tarde"],
   events:["A galinha acordou cedo no galinheiro.","Ela botou um ovo bem branquinho.","Depois foi ciscar no quintal."]},
  {level:2, character:"O cavalo", wrongCharacters:["A vaca","O porco"], place:"No campo", wrongPlaces:["No mar","Na cidade"], time:"De tarde", wrongTimes:["De manhã","De noite"],
   events:["O cavalo correu no campo de tarde.","Ele parou para beber água.","Depois voltou devagar para o estábulo."]},
  {level:3, character:"A minhoca", wrongCharacters:["A aranha","O besouro"], place:"Debaixo da terra", wrongPlaces:["No céu","No telhado"], time:"De manhã", wrongTimes:["À noite","De tarde"],
   events:["A minhoca cavou um túnel de manhã.","Ela deixou a terra fofinha por onde passou.","No fim, encontrou uma raiz gostosa."]},
  {level:4, character:"O esquilo", wrongCharacters:["O coelho","O tatu"], place:"Na floresta", wrongPlaces:["No lago","Na cidade"], time:"No outono", wrongTimes:["No verão","De manhã"],
   events:["O esquilo juntou nozes no outono.","Ele escondeu tudo dentro de um buraco na árvore.","Assim teria comida guardada para o inverno."]},
  {level:5, character:"A borboleta", wrongCharacters:["A abelha","O besouro"], place:"No jardim", wrongPlaces:["No rio","Na caverna"], time:"De manhã", wrongTimes:["De noite","No inverno"],
   events:["A borboleta saiu do casulo de manhã.","Ela abriu as asas coloridas devagar.","Depois voou de flor em flor pelo jardim."]},
];

/* Começos de história com 1 final coerente e 2 finais propositalmente
   absurdos (não apenas "diferentes") — testa se a criança reconhece um
   desfecho que faz sentido com o enredo. EF01LP25/26. */
const STORY_ENDINGS = [
  {level:1, setup:"O coelho estava com muita fome e foi procurar comida na floresta.", correctEnding:"Ele encontrou uma cenoura e comeu feliz.", wrongEndings:["Ele foi nadar no fundo do mar.","Ele dirigiu um carro até a escola."]},
  {level:1, setup:"O pato viu que ia chover e procurou um lugar seco.", correctEnding:"Ele se escondeu embaixo de uma árvore.", wrongEndings:["Ele voou até a lua.","Ele foi dormir dentro do forno."]},
  {level:2, setup:"O gato ficou com sono depois de brincar a tarde toda.", correctEnding:"Ele se enrolou e dormiu no sofá.", wrongEndings:["Ele foi nadar no oceano gelado.","Ele dirigiu um caminhão enorme."]},
  {level:2, setup:"O sapo sentiu fome quando o sol se escondeu.", correctEnding:"Ele saiu para caçar insetos.", wrongEndings:["Ele foi voar entre as nuvens.","Ele construiu uma casa de tijolos."]},
  {level:3, setup:"O macaco viu uma banana bem no topo da árvore mais alta.", correctEnding:"Ele subiu com cuidado e pegou a banana.", wrongEndings:["Ele nadou até a lua para pegar a banana.","Ele chamou um caminhão para buscar a banana."]},
  {level:3, setup:"O tigre sentiu muita sede depois de correr pela floresta.", correctEnding:"Ele foi até o rio beber água fresquinha.", wrongEndings:["Ele voou até as estrelas.","Ele foi comprar suco no mercado."]},
  {level:4, setup:"A girafa queria comer as folhas mais altas da árvore.", correctEnding:"Ela esticou bem o pescoço comprido e alcançou.", wrongEndings:["Ela cavou um buraco fundo na terra.","Ela pegou um elevador até o topo."]},
  {level:4, setup:"O urso sentiu muito frio quando o inverno chegou.", correctEnding:"Ele foi dormir dentro da toca quentinha.", wrongEndings:["Ele foi nadar no mar congelado.","Ele ligou o ar-condicionado da caverna."]},
  {level:5, setup:"O jacaré ficou escondido na água esperando um peixe passar.", correctEnding:"De repente, ele nadou rápido e pegou o peixe.", wrongEndings:["Ele saiu voando atrás de uma nuvem.","Ele foi pegar um ônibus para casa."]},
  {level:5, setup:"O tatu ouviu um barulho estranho vindo do mato.", correctEnding:"Ele se enrolou como uma bola para se proteger.", wrongEndings:["Ele foi nadar até a outra margem do rio.","Ele acendeu a televisão para assistir."]},
  // Expansão — mais começos de história por nível
  {level:1, setup:"A galinha estava no galinheiro na hora de botar ovo.", correctEnding:"Ela botou um ovo branquinho no ninho.", wrongEndings:["Ela dirigiu um carro até a cidade.","Ela mergulhou fundo no oceano."]},
  {level:2, setup:"O cavalo correu bastante no campo e ficou com sede.", correctEnding:"Ele foi até o bebedouro tomar água.", wrongEndings:["Ele subiu numa árvore bem alta.","Ele foi assistir televisão em casa."]},
  {level:3, setup:"O esquilo viu que o outono estava chegando.", correctEnding:"Ele começou a juntar nozes para o inverno.", wrongEndings:["Ele foi nadar no fundo do mar gelado.","Ele construiu um foguete para viajar."]},
  {level:4, setup:"A minhoca sentiu que ia chover forte.", correctEnding:"Ela cavou mais fundo na terra para se proteger.", wrongEndings:["Ela voou para cima das nuvens.","Ela foi correndo pegar um ônibus."]},
  {level:5, setup:"A borboleta terminou de sair do casulo bem devagar.", correctEnding:"Ela abriu as asas e voou até as flores do jardim.", wrongEndings:["Ela mergulhou no fundo de um lago congelado.","Ela dirigiu um trator até a fazenda vizinha."]},
];

/* As atividades do Módulo 7 (Gramática Inicial e Pontuação). Substantivo/Verbo
   é ensinado pela FUNÇÃO (nome de coisa vs. ação), sem metalinguagem
   gramatical formal — apropriado a 6-7 anos, antecipa conteúdo de 2º ano. */
const MODULE7_ACTIVITIES = [
  {id:"substantivo_verbo", name:"Substantivo ou Verbo?", icon:"🧩", desc:"É o NOME de algo ou é uma AÇÃO? (antecipação lúdica de 2º ano)"},
  {id:"acao_combina",      name:"Que Ação Combina?",     icon:"⚡", desc:"Escolher o verbo de ação certo pra cada personagem"},
  {id:"pontuacao_texto",   name:"Pontuação no Textinho",  icon:"❓", desc:"Ponto final ou de interrogação no fim da 2ª frase (EF01LP14 aprofundado)"},
];

/* Palavras classificadas como NOME (substantivo, sem usar o termo técnico
   com a criança) ou AÇÃO (verbo) — a criança reconhece pela função, não
   decora regra gramatical. Distratores são palavras da mesma família de
   conteúdo do app (animais, ações do dia a dia) pra manter familiaridade. */
const WORD_CLASS = [
  {level:1, word:"GATO", correct:"NOME", wrongs:["AÇÃO"]},
  {level:1, word:"PULAR", correct:"AÇÃO", wrongs:["NOME"]},
  {level:1, word:"CASA", correct:"NOME", wrongs:["AÇÃO"]},
  {level:1, word:"CORRER", correct:"AÇÃO", wrongs:["NOME"]},
  {level:2, word:"BOLA", correct:"NOME", wrongs:["AÇÃO"]},
  {level:2, word:"NADAR", correct:"AÇÃO", wrongs:["NOME"]},
  {level:2, word:"ESCOLA", correct:"NOME", wrongs:["AÇÃO"]},
  {level:2, word:"COMER", correct:"AÇÃO", wrongs:["NOME"]},
  {level:3, word:"MENINO", correct:"NOME", wrongs:["AÇÃO"]},
  {level:3, word:"DORMIR", correct:"AÇÃO", wrongs:["NOME"]},
  {level:3, word:"FLORESTA", correct:"NOME", wrongs:["AÇÃO"]},
  {level:3, word:"VOAR", correct:"AÇÃO", wrongs:["NOME"]},
  {level:4, word:"PROFESSORA", correct:"NOME", wrongs:["AÇÃO"]},
  {level:4, word:"ESTUDAR", correct:"AÇÃO", wrongs:["NOME"]},
  {level:4, word:"JACARÉ", correct:"NOME", wrongs:["AÇÃO"]},
  {level:4, word:"NADAR", correct:"AÇÃO", wrongs:["NOME"]},
  {level:5, word:"BIBLIOTECA", correct:"NOME", wrongs:["AÇÃO"]},
  {level:5, word:"CONSTRUIR", correct:"AÇÃO", wrongs:["NOME"]},
  {level:5, word:"BORBOLETA", correct:"NOME", wrongs:["AÇÃO"]},
  {level:5, word:"ESCREVER", correct:"AÇÃO", wrongs:["NOME"]},
  // Expansão — mais palavras por nível, menos repetição
  {level:1, word:"CACHORRO", correct:"NOME", wrongs:["AÇÃO"]},
  {level:1, word:"CANTAR", correct:"AÇÃO", wrongs:["NOME"]},
  {level:2, word:"CARRO", correct:"NOME", wrongs:["AÇÃO"]},
  {level:2, word:"DANÇAR", correct:"AÇÃO", wrongs:["NOME"]},
  {level:3, word:"CIDADE", correct:"NOME", wrongs:["AÇÃO"]},
  {level:3, word:"DESENHAR", correct:"AÇÃO", wrongs:["NOME"]},
  {level:4, word:"GARRAFA", correct:"NOME", wrongs:["AÇÃO"]},
  {level:4, word:"VIAJAR", correct:"AÇÃO", wrongs:["NOME"]},
  {level:5, word:"VULCÃO", correct:"NOME", wrongs:["AÇÃO"]},
  {level:5, word:"IMAGINAR", correct:"AÇÃO", wrongs:["NOME"]},
];

/* Personagem (reaproveita animais do app) + verbo de ação que combina de
   verdade, com 2 verbos plausíveis-mas-errados como distratores — reforça
   verbo como "coisa que o personagem FAZ", não como categoria abstrata. */
const ACTION_MATCHES = [
  {level:1, subject:"O peixe", correct:"NADA", wrongs:["VOA","CORRE"]},
  {level:1, subject:"O passarinho", correct:"VOA", wrongs:["NADA","CAVA"]},
  {level:2, subject:"O coelho", correct:"PULA", wrongs:["VOA","NADA"]},
  {level:2, subject:"A cobra", correct:"RASTEJA", wrongs:["VOA","PULA"]},
  {level:3, subject:"O macaco", correct:"SOBE NA ÁRVORE", wrongs:["NADA NO MAR","VOA NO CÉU"]},
  {level:3, subject:"O jacaré", correct:"NADA NO RIO", wrongs:["VOA NO CÉU","CAVA UM BURACO"]},
  {level:4, subject:"A abelha", correct:"VOA DE FLOR EM FLOR", wrongs:["NADA NO LAGO","DORME NA TOCA"]},
  {level:4, subject:"O urso", correct:"DORME NA TOCA", wrongs:["VOA NO CÉU","NADA NO MAR"]},
  {level:5, subject:"A girafa", correct:"COME FOLHAS ALTAS", wrongs:["CAVA UM TÚNEL","VOA ENTRE NUVENS"]},
  {level:5, subject:"O tatu", correct:"SE ENROLA COMO BOLA", wrongs:["VOA MUITO ALTO","NADA NO OCEANO"]},
  // Expansão — mais personagens por nível
  {level:1, subject:"A galinha", correct:"CISCA", wrongs:["NADA","VOA"]},
  {level:2, subject:"O cavalo", correct:"CORRE", wrongs:["VOA","NADA"]},
  {level:3, subject:"A minhoca", correct:"CAVA NA TERRA", wrongs:["VOA NO CÉU","NADA NO RIO"]},
  {level:4, subject:"O esquilo", correct:"JUNTA NOZES", wrongs:["NADA NO MAR","VOA ALTO"]},
  {level:5, subject:"A borboleta", correct:"VOA DE FLOR EM FLOR", wrongs:["CAVA UM TÚNEL","NADA NO LAGO"]},
];

/* Mini-textos de 2 frases: a 1ª já vem pontuada, a 2ª termina sem pontuação
   e a criança escolhe entre ponto final e ponto de interrogação — aprofunda
   EF01LP14 além do nível de frase isolada (já coberto no Módulo 3). */
const TEXT_PUNCT = [
  {level:1, text1:"O cachorro correu no parque.", text2:"Ele estava muito feliz", correct:".", wrongs:["?"]},
  {level:1, text1:"Hoje é dia de escola.", text2:"Você trouxe o material", correct:"?", wrongs:["."]},
  {level:2, text1:"A menina desenhou uma flor.", text2:"O desenho ficou lindo", correct:".", wrongs:["?"]},
  {level:2, text1:"O menino perdeu o lápis.", text2:"Você viu o lápis dele", correct:"?", wrongs:["."]},
  {level:3, text1:"O gato subiu no telhado.", text2:"Ele não conseguia descer", correct:".", wrongs:["?"]},
  {level:3, text1:"A festa começa às três horas.", text2:"Você vai chegar cedo", correct:"?", wrongs:["."]},
  {level:4, text1:"O sapo pulou dentro do lago.", text2:"A água estava bem fria", correct:".", wrongs:["?"]},
  {level:4, text1:"O passarinho fez um ninho novo.", text2:"Quantos ovos ele vai botar", correct:"?", wrongs:["."]},
  {level:5, text1:"A girafa comeu as folhas mais altas.", text2:"Ela ficou satisfeita depois", correct:".", wrongs:["?"]},
  {level:5, text1:"O jacaré ficou escondido na água.", text2:"Será que ele vai pegar o peixe", correct:"?", wrongs:["."]},
  // Expansão — mais mini-textos por nível
  {level:1, text1:"A galinha botou um ovo.", text2:"O ovo era branquinho", correct:".", wrongs:["?"]},
  {level:2, text1:"O cavalo correu no campo.", text2:"Cadê o cavalo agora", correct:"?", wrongs:["."]},
  {level:3, text1:"A minhoca cavou um túnel.", text2:"A terra ficou bem fofinha", correct:".", wrongs:["?"]},
  {level:4, text1:"O esquilo juntou nozes no outono.", text2:"Quantas nozes ele guardou", correct:"?", wrongs:["."]},
  {level:5, text1:"A borboleta saiu do casulo.", text2:"Ela abriu as asas devagar", correct:".", wrongs:["?"]},
];

/* As atividades do Módulo M1 da trilha de Matemática (Números e Quantidades).
   Diferente dos bancos de conteúdo curados de Português (lista fixa de itens),
   estas 3 atividades são GENERATIVAS — cada rodada sorteia emoji + quantidade
   dentro de uma faixa por nível, usando o COUNT_EMOJI/EMOJI_NAMES já
   existentes. Isso dá variedade praticamente ilimitada de rodadas (8 emojis ×
   qualquer quantidade na faixa do nível), em vez de um banco fixo de N itens
   que a criança decoraria depois de algumas sessões — pedido explícito do
   Júlio de não limitar quantidade de exercícios e não ser raso. */
