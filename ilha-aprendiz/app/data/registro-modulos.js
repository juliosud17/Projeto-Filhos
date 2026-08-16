// Registro de menus e modulos das duas trilhas (Portugues/Matematica) -- estrutura de navegacao, nao conteudo de atividade.
const GAMES = {
  joaquim: [
    {id:"letras", name:"Caça-Letras", icon:"🔤", desc:"Encontrar a letra certa", tag:"Grátis"},
    {id:"numeros", name:"Números Mágicos", icon:"🔢", desc:"Combinar número e quantidade", tag:"Grátis"},
    {id:"contar", name:"Conta Comigo", icon:"🧮", desc:"Contar objetos até 10", tag:"Grátis"},
    {id:"cultura_j", name:"Sons do Brasil", icon:"🎵", desc:"Módulo cultural — em breve", tag:"Em breve", locked:true},
  ]
};

/* Trilha de Português do Benjamin: módulos com trava por domínio (80%),
   seguindo o currículo baseado na BNCC EF01LP. */
const PT_MODULES_BENJAMIN = [
  {
    id:"silabas", name:"Módulo 1 · Alfabeto e Sílabas", icon:"🧩",
    desc:"Formar palavras com sílabas", requires:null, unlockAt:0, built:true,
    bimestre:"1º bimestre",
    habilidades:[
      "EF01LP04 — Distinguir letras do alfabeto de outros sinais gráficos",
      "EF01LP06 — Segmentar oralmente palavras em sílabas",
      "EF01LP07 — Identificar fonemas e sua representação por letras",
      "EF01LP08 — Relacionar elementos sonoros com sua representação escrita",
      "EF01LP09 — Comparar palavras pelo som das sílabas iniciais",
      "EF01LP10 — Nomear as letras do alfabeto e recitá-lo",
      "EF01LP11 — Conhecer letras maiúsculas/minúsculas, imprensa/cursiva",
    ],
    alem:["Pares Mínimos — discriminação sonora real por fonema (V/F, B/M...), não por letra", "Rimas — reconhecer o mesmo som final entre palavras diferentes", "Manipulação de Palavra — trocar 1 letra e formar outra palavra real"],
    jogos:["Monte a Sílaba (5 níveis)","Caça-Letras (5 níveis)","Som Inicial (5 níveis)","Pares Mínimos (5 níveis)","Rimas (5 níveis)","Manipulação de Palavra (5 níveis)","Maiúscula ↔ Minúscula (5 níveis)"],
    isContainer:true /* não é jogado diretamente — abrange as 7 atividades abaixo */
  },
  {
    id:"leitura", name:"Módulo 2 · Leitura de Palavras", icon:"📖",
    desc:"Ler palavras e frases curtas", requires:"silabas", unlockAt:80, built:true,
    bimestre:"1º bimestre",
    habilidades:[
      "EF01LP01 — Reconhecer a direção da leitura/escrita (esquerda→direita, cima→baixo)",
      "EF01LP02 — Escrever palavras e frases de forma alfabética",
      "EF01LP03 — Observar a escrita convencional, comparando-a com a própria produção escrita",
      "EF01LP05 — Reconhecer o sistema alfabético como representação dos sons da fala",
      "EF01LP12 — Reconhecer a separação de palavras por espaços em branco",
    ],
    alem:[
      "Leia a Frase — contar palavras de uma frase (separação por espaço) e apontar a primeira/última palavra (direção da leitura), sem cobrar compreensão de significado ainda",
      "Escrita Certa — comparar a escrita convencional com um erro ortográfico comum de quem está alfabetizando (omissão de letra, S/Z, dígrafos CH/X e LH, G/J antes de E/I, E/I átono no final da palavra)"
    ],
    jogos:["Leitura Rápida (5 níveis)","Leia a Frase (5 níveis)","Escrita Certa (5 níveis)"],
    isContainer:true /* não é jogado diretamente — abrange as 3 atividades acima, mesmo padrão do Módulo 1 */
  },
  {
    id:"frases", name:"Módulo 3 · Leitura de Frases e Textos Curtos", icon:"📜",
    desc:"Parlendas, trava-línguas, sílabas e pontuação", requires:"leitura", unlockAt:80, built:true,
    bimestre:"2º bimestre",
    habilidades:[
      "EF01LP13 — Comparar palavras pelo som das sílabas mediais e finais",
      "EF01LP14 — Identificar pontuação e seus efeitos na entonação",
      "EF01LP16 — Ler e compreender quadras, quadrinhas, parlendas, trava-línguas",
      "EF01LP19 — Recitar parlendas e trava-línguas com entonação adequada",
    ],
    alem:[
      "Parlendas e Trava-Línguas reais do folclore infantil brasileiro (domínio público), não inventadas",
      "Som do Meio e do Fim — consciência silábica por POSIÇÃO da sílaba (meio/fim), diferente da Rimas do Módulo 1 (que compara o som final da palavra inteira)"
    ],
    jogos:["Parlendas e Trava-Línguas (5 níveis)","Som do Meio e do Fim (5 níveis)","Pontuação Certa (5 níveis)"],
    isContainer:true, /* não é jogado diretamente — abrange as 3 atividades acima, mesmo padrão dos Módulos 1 e 2 */
    limitacao: "EF01LP19 (recitar com entonação) não tem pontuação de acerto/erro — não dá pra avaliar recitação sem microfone. A Parlendas e Trava-Línguas oferece um botão \"ouvir e recitar junto\" pra prática em voz alta com um adulto, mas o que é testado de fato é compreensão de estrutura (EF01LP16), não a recitação em si."
  },
  {
    id:"escrita", name:"Módulo 4 · Primeiras Produções Escritas", icon:"📮",
    desc:"Listas, bilhetes, receitas e regras da turma", requires:"frases", unlockAt:80, built:true,
    bimestre:"2º bimestre",
    habilidades:[
      "EF01LP02 — Escrever palavras e frases de forma alfabética (aprofundado)",
      "EF01LP17 — Planejar e produzir listas, agendas, calendários, avisos, convites, receitas, instruções de montagem e legendas para álbuns, fotos ou ilustrações",
      "EF01LP18 — Registrar cantigas, quadras e parlendas em colaboração",
      "EF01LP21 — Escrever listas de regras escolares em colaboração",
    ],
    alem:["Escrita sempre dentro de um contexto real (lista, bilhete, parlenda), nunca uma palavra solta descontextualizada — o campo de texto livre é validado contra a palavra que falta, não é redação aberta sem correção nenhuma", "Texto do Dia a Dia ganhou o gênero \"legenda de foto/ilustração\" em 2026-08-16 — faltava no banco mesmo sendo citado explicitamente no texto oficial do EF01LP17/20 (ver qa/auditorias/auditoria_bncc_oficial.md)"],
    jogos:["Complete a Lista (5 níveis)","Texto do Dia a Dia (5 níveis)","Parlenda de Cor (5 níveis)"],
    isContainer:true, /* não é jogado diretamente — abrange as 3 atividades acima, mesmo padrão dos Módulos 1, 2 e 3 */
    limitacao: "Não avalia escrita livre/criativa aberta (isso exigiria correção humana ou de IA, fora do escopo de um app offline). Cada atividade tem uma palavra-alvo específica validada por digitação (aceita minúscula e sem acento), dentro de um contexto de texto real — não é só \"Digite a Palavra\" repetido, é a mesma habilidade aplicada a listas, bilhetes e parlendas."
  },
  {
    id:"compreensao", name:"Módulo 5 · Compreensão de Textos e Gêneros", icon:"🔎",
    desc:"Sinônimos, gêneros textuais e curiosidades", requires:"escrita", unlockAt:80, built:true,
    bimestre:"3º bimestre",
    habilidades:[
      "EF01LP15 — Agrupar palavras por semelhança de significado (sinônimos) e separar palavras por oposição de significado (antônimos)",
      "EF01LP20 — Identificar e reproduzir a formatação e diagramação específica de listas, agendas, calendários, avisos, convites, receitas e legendas para álbuns/fotos/ilustrações",
      "EF01LP22 — Planejar e produzir diagramas, entrevistas e curiosidades investigativas",
      "EF01LP24 — Identificar e reproduzir a formatação de enunciados, diagramas, entrevistas e curiosidades investigativas",
    ],
    alem:["Ler e Responder — primeira atividade do app que testa compreensão de verdade (não só reconhecer palavra/estrutura): mini-textos de curiosidade com pergunta de interpretação (quem, o quê, onde, por quê)"],
    jogos:["Sinônimos e Antônimos (5 níveis)","Qual é o Gênero? (5 níveis)","Ler e Responder (5 níveis)"],
    isContainer:true, /* não é jogado diretamente — abrange as 3 atividades acima, mesmo padrão dos Módulos 1-4 */
    limitacao: "EF01LP22 (produzir diagramas, entrevistas) não tem atividade própria — é uma habilidade de PRODUÇÃO (a criança cria o diagrama/entrevista), mais adequada a uma atividade em papel com um adulto do que a um clique/digitação num app. O que este módulo testa de EF01LP22/24 é o lado de LEITURA de um texto investigativo (a curiosidade) — a produção fica de fora do escopo digital, por ora."
  },
  {
    id:"narrativas", name:"Módulo 6 · Narrativas e Recontagem", icon:"📗",
    desc:"Elementos, ordem e finais de histórias curtas", requires:"compreensao", unlockAt:80, built:true,
    bimestre:"3º bimestre",
    habilidades:[
      "EF01LP25 — Recontar histórias observando personagem, enredo, tempo e espaço",
      "EF01LP26 — Identificar elementos de narrativas lidas ou escutadas",
    ],
    alem:["Reconte a História — primeira atividade do app com mecânica de ORDENAR (não escolher entre opções soltas): a criança toca os acontecimentos na sequência certa, testando enredo de verdade, não só reconhecimento", "Invente o Final — escolher, entre finais plausíveis e propositalmente absurdos, qual faz sentido pra história — estímulo à imaginação com correção ainda automática"],
    jogos:["Elementos da História (5 níveis)","Reconte a História (5 níveis)","Invente o Final (5 níveis)"],
    isContainer:true, /* não é jogado diretamente — abrange as 3 atividades acima, mesmo padrão dos Módulos 1-5 */
  },
  {
    id:"gramatica", name:"Módulo 7 · Gramática Inicial e Pontuação", icon:"🔤",
    desc:"Substantivo, verbo e pontuação lúdica", requires:"narrativas", unlockAt:80, built:true,
    bimestre:"4º bimestre",
    habilidades:["EF01LP14 — Pontuação e entonação (aprofundado)"],
    alem:["Substantivo ou Verbo? — noção lúdica de substantivo (nome de coisa/pessoa/animal) e verbo (ação), conteúdo típico do 2º ano antecipado", "Que Ação Combina? — escolher o verbo de ação correto pra cada animal/personagem, reforçando a ideia de verbo pela função, não pela nomenclatura gramatical", "Pontuação no Textinho — usar ponto final ou ponto de interrogação no fim de uma frase dentro de um mini-texto de 2 frases, aprofundando EF01LP14 além do nível de frase isolada"],
    jogos:["Substantivo ou Verbo? (5 níveis)","Que Ação Combina? (5 níveis)","Pontuação no Textinho (5 níveis)"],
    isContainer:true, /* não é jogado diretamente — abrange as 3 atividades acima, mesmo padrão dos Módulos 1-6 */
    limitacao: "Não usa os termos técnicos \"substantivo\"/\"verbo\" como definição gramatical formal (isso é conteúdo de 2º/3º ano) — a criança aprende a RECONHECER a diferença (nome de coisa vs. ação) de forma lúdica, antecipando a base conceitual sem exigir metalinguagem gramatical, apropriado para 6-7 anos."
  },
  {
    id:"projetoleitor", name:"Módulo 8 · Projeto Leitor e Vocabulário", icon:"🏆",
    desc:"Livros, poesia e vocabulário avançado", requires:"gramatica", unlockAt:80, built:false,
    bimestre:"4º bimestre",
    habilidades:[],
    alem:["1 livro infantil curto por semana, fora do app, com os pais", "Ampliação de vocabulário a partir de cada livro lido", "Trava-línguas mais difíceis, primeiras noções de rima e poesia", "Módulo-ponte: quem domina bem aqui está pronto para um currículo de 2º ano adaptado"],
    jogos:["Projeto Leitor Semanal (fora da tela)"]
  },
];

/* Trilha de Matemática do Benjamin: mesmo padrão de módulos com trava por
   domínio (80%) da trilha de Português, mapeada às 22 habilidades da BNCC
   EF01MA01-22. Trilha INDEPENDENTE da de Português — nenhum módulo de
   Matemática exige nada de Português (requires aponta só pra módulos de
   Matemática anteriores, ou null no M1 pra ficar sempre disponível). Ver
   indice-curriculo-matematica-ilha-aprendiz.md pro mapa completo dos 13
   módulos planejados — construção módulo a módulo, sem pressa e sem raso. */
const MATH_MODULES_BENJAMIN = [
  {
    id:"mm1_numeros", name:"M1 · Números e Quantidades", icon:"🔢",
    desc:"Quantidade, contagem e comparação de conjuntos", requires:null, unlockAt:0, built:true,
    bimestre:"1º bimestre",
    habilidades:[
      "EF01MA01 — Utilizar números naturais como indicador de quantidade ou de ordem, e reconhecer situações em que os números não indicam contagem nem ordem, mas sim código de identificação",
      "EF01MA02 — Contar de maneira exata ou aproximada, utilizando diferentes estratégias",
      "EF01MA03 — Estimar e comparar quantidades de objetos de dois conjuntos",
    ],
    alem:["Qual Tem Mais? evolui de comparação por percepção visual direta (níveis 1-2) pra grupos com quantidades próximas que exigem contar de verdade pra decidir (níveis 4-5), não só \"olhar e perceber\"", "Conta Comigo alterna estratégias de contagem (uma a uma, em grupos de 2, em grupos de 5) pra construir flexibilidade, não só repetição mecânica", "Quantos Tem? tem uma 3ª variação (além de quantidade e ordem): reconhecer quando um número é só um código de identificação (número de casa, de camisa, de canal de TV), não quantidade nem ordem — a metade da EF01MA01 que faltava, corrigida em 2026-08-16 (ver qa/auditorias/auditoria_bncc_oficial.md)"],
    jogos:["Quantos Tem? (5 níveis)","Conta Comigo (5 níveis)","Qual Tem Mais? (5 níveis)"],
    isContainer:true,
  },
  {
    id:"mm2_contagem100", name:"M2 · Contagem até 100", icon:"💯",
    desc:"Contar coleções grandes e pular de tantos em tantos", requires:null, unlockAt:0, built:true,
    bimestre:"1º bimestre",
    habilidades:["EF01MA04 — Contar a quantidade de objetos de coleções até 100 unidades e apresentar o resultado por registros verbais e simbólicos"],
    alem:["Pulando de Tantos em Tantos — contagem por saltos (2 em 2, 5 em 5, 10 em 10) como estratégia eficiente pra chegar perto de 100 sem contar um por um, base pra tabuada mais à frente"],
    jogos:["Conta Até 100 (5 níveis)","Pulando de Tantos em Tantos (5 níveis)"],
    isContainer:true,
  },
  {
    id:"mm3_comparar", name:"M3 · Comparar, Ordenar e Sequenciar", icon:"📏",
    desc:"Maior/menor, ordenar por tamanho e completar padrões", requires:null, unlockAt:0, built:true,
    bimestre:"1º bimestre",
    habilidades:[
      "EF01MA05 — Comparar números naturais de até duas ordens em situações cotidianas (oficial cita reta numérica como apoio possível; a atividade usa fileiras de pontinhos em vez disso)",
      "EF01MA09 — Organizar objetos familiares por um atributo (cor, forma ou tamanho)",
      "EF01MA10 — Descrever, verbalmente, elementos ausentes em sequências recursivas",
    ],
    alem:["Pedido explícito do Júlio nesta fase: Matemática exige mais clareza que Português, porque um número errado no meio de um raciocínio quebra o exercício inteiro. As 3 atividades deste módulo sempre mostram um apoio visual concreto (pontinhos/blocos, tamanho real dos objetos) do lado do número abstrato, nunca só o número sozinho — e a regra do padrão em O Que Vem Depois? é sempre dita em voz alta, a criança nunca precisa 'adivinhar a regra' sem pista nenhuma", "Qual é Maior? evolui de contagem visual direta (níveis 1-2) pra números de duas ordens onde é preciso comparar dezena primeiro (níveis 4-5)", "Organize por Tamanho ganhou 2 variantes novas em 2026-08-16 (cor e forma, mecânica 'ache o diferente', reaproveitando o desenhador de formas do M8) além da original (maior/menor por tamanho) — a EF01MA09 oficial pede organizar por cor, forma OU medida, não só medida; achado e corrigido via qa/auditorias/auditoria_bncc_oficial.md"],
    jogos:["Qual é Maior? (5 níveis)","Organize por Tamanho (5 níveis)","O Que Vem Depois? (5 níveis)"],
    isContainer:true,
  },
  {
    id:"mm4_adicao", name:"M4 · Adição", icon:"➕",
    desc:"Fatos da soma e problemas do dia a dia com adição", requires:null, unlockAt:0, built:true,
    bimestre:"2º bimestre",
    habilidades:[
      "EF01MA06 — Construir fatos básicos da adição e utilizá-los em procedimentos de cálculo",
      "EF01MA08 — Resolver e elaborar problemas de adição, associados a ideias de juntar e acrescentar",
    ],
    alem:["Fatos da Soma sempre mostra os dois grupos de objetos concretos do lado da conta abstrata (nunca só \"3+2=?\" sem apoio visual), até o nível 5 onde os grupos maiores usam fileiras de 10 pra manter clareza", "Problemas de Somar usa mini-histórias faladas em voz (contextos do dia a dia — brinquedos, doces, figurinhas) em vez de conta seca, pra praticar reconhecer quando um problema pede soma"],
    jogos:["Fatos da Soma (5 níveis)","Problemas de Somar (5 níveis)"],
    isContainer:true,
  },
  {
    id:"mm5_subtracao", name:"M5 · Subtração e Problemas", icon:"➖",
    desc:"Fatos da subtração, problemas de tirar e escolher a operação certa", requires:null, unlockAt:0, built:true,
    bimestre:"2º bimestre",
    habilidades:[
      "EF01MA08 — Resolver e elaborar problemas de adição e subtração, envolvendo diferentes ideias (juntar, acrescentar, separar, retirar), e problemas com a ideia de reconhecer a operação apropriada",
    ],
    alem:["Fatos da Subtração reaproveita a linguagem visual de \"objetos cortados\" (crossed-out) do jogo extra Subtração Divertida, mas agora dentro do sistema de 5 níveis e nunca passando de 20", "Soma ou Subtração? testa a parte mais difícil da EF01MA08 de forma honesta dentro do motor de clique único: em vez de pedir a conta inteira, pede pra criança reconhecer qual OPERAÇÃO o problema pede (somar ou subtrair) antes de resolver — a habilidade central que a BNCC pede aqui"],
    jogos:["Fatos da Subtração (5 níveis)","Problemas de Tirar (5 níveis)","Soma ou Subtração? (5 níveis)"],
    isContainer:true,
  },
  {
    id:"mm6_compor_decompor", name:"M6 · Compor e Decompor Números", icon:"🧱",
    desc:"Dezena e unidade — o número por dentro", requires:null, unlockAt:0, built:true,
    bimestre:"2º bimestre",
    habilidades:[
      "EF01MA07 — Compor e decompor número de até duas ordens, por meio de diferentes adições, com o suporte de material manipulável",
    ],
    alem:["Introduz o vocabulário formal \"dezena\" e \"unidade\" pela primeira vez (M2 já usava fileiras de 10 visualmente, mas sem nomear os termos) — a primeira vez que a criança ouve cada termo, o app sempre explica entre parênteses (\"dezenas, ou seja, grupos de 10\")", "Monte o Número sempre mostra o apoio visual em fileiras de 10 do lado da equação incompleta (nunca só \"23 = 20 + ___\" sem apoio)"],
    jogos:["Monte o Número (5 níveis)","Dezena e Unidade (5 níveis)"],
    isContainer:true,
  },
  {
    id:"mm7_espaco", name:"M7 · Espaço e Localização", icon:"🧭",
    desc:"Onde as coisas estão e como chegar até elas", requires:null, unlockAt:0, built:true,
    bimestre:"3º bimestre",
    habilidades:[
      "EF01MA11 — Descrever a localização de pessoas e de objetos no espaço em relação à própria posição, utilizando termos como à direita, à esquerda, à frente, atrás",
      "EF01MA12 — Descrever a localização de pessoas e de objetos no espaço segundo um ponto de referência dado, e indicar as mudanças de direção que devem ser feitas num percurso",
    ],
    alem:["Onde Está? usa uma grade 3×3 fixa (nunca ambígua) e sobe de dificuldade controlando QUAIS posições entram no sorteio por nível — nível 1-2 só pergunta esquerda/direita ou à frente/atrás isolados, níveis 4-5 já incluem cantos (\"à frente, à direita\"). Enunciado em relação à própria criança (\"em relação a você\"), a marca do EF01MA11 — corrigido em 2026-08-16, antes usava vocabulário do EF01MA12 (em cima/embaixo); ver qa/auditorias/auditoria_bncc_oficial.md.", "Siga o Mapa evolui de trajeto de 1 passo (mesma linha ou coluna do alvo) nos níveis 1-3 pra trajeto de 2 passos (diagonal, precisa combinar duas direções em ordem) nos níveis 4-5 — sempre com o ponto de referência (o robôzinho) visível no mapa, o que dá ao EF01MA12 o que ele pede: um referencial explícito, não a própria criança"],
    jogos:["Onde Está? (5 níveis)","Siga o Mapa (5 níveis)"],
    isContainer:true,
  },
  {
    id:"mm8_formas", name:"M8 · Formas Geométricas", icon:"🔷",
    desc:"Formas espaciais no mundo real e formas planas", requires:null, unlockAt:0, built:true,
    bimestre:"3º bimestre",
    habilidades:[
      "EF01MA13 — Relacionar figuras geométricas espaciais (cone, cilindro, esfera, bloco retangular) a objetos do mundo físico",
      "EF01MA14 — Identificar e nomear figuras planas (círculo, quadrado, retângulo e triângulo) em desenhos, em diferentes disposições (oficial também inclui reconhecer a forma como contorno de face de sólido geométrico — não testado ainda)",
    ],
    alem:["Formas no Mundo testa 6 formas espaciais, não só as 4 do EF01MA13 (cone, cilindro, esfera, bloco retangular) — cubo e pirâmide antecipam o EF02MA14 (2º ano), de propósito, no mesmo espírito de antecipação que já vale pro resto do currículo do Benjamin. Auditoria de 2026-08-16 (ver qa/auditorias/auditoria_bncc_oficial.md) encontrou que esse rótulo estava incorreto — cubo/pirâmide apareciam citados como se fossem EF01MA13, quando são EF02MA14 — corrigido aqui.", "Formas no Mundo sobe de dificuldade controlando QUAIS das 6 formas espaciais entram no sorteio (esfera/cubo primeiro, cone/pirâmide só nos níveis altos, por serem as mais difíceis de reconhecer num objeto do dia a dia)", "Nomeie a Forma desenha as figuras planas de verdade (CSS, não emoji), e só começa a girar a forma (\"diferentes disposições\", como pede a BNCC) a partir do nível 3 — nos níveis 1-2 a forma sempre aparece na posição \"de livro\" pra não confundir antes de firmar o reconhecimento básico", "Aproximação honesta documentada: a barraca de acampar (🏕️) é usada como o exemplo do dia a dia mais próximo de uma pirâmide que existe em emoji padrão — não é uma pirâmide perfeita (é um prisma triangular), mas é o objeto real mais parecido que uma criança de 6 anos reconheceria"],
    jogos:["Formas no Mundo (5 níveis)","Nomeie a Forma (5 níveis)"],
    isContainer:true,
  },
  {
    id:"mm9_medidas", name:"M9 · Medidas e Comparações", icon:"📐",
    desc:"Comparar comprimento, largura, altura, capacidade e peso, sem unidade formal", requires:null, unlockAt:0, built:true,
    bimestre:"4º bimestre",
    habilidades:[
      "EF01MA15 — Comparar comprimentos, capacidades ou massas, utilizando termos como mais alto/baixo, mais comprido/curto, mais largo/estreito, mais pesado/leve, mais cheio/vazio, sem uso de unidades de medida convencionais",
    ],
    alem:["A BNCC pede um vocabulário rico (7 pares de termos diferentes) numa habilidade só — em vez de espremer tudo numa atividade rasa, o módulo abre em 2 atividades pra dar peso real a cada tipo de comparação: medidas lineares (altura/comprimento/largura) numa, capacidade e peso na outra", "Comparar de Verdade encolhe a diferença mínima entre os dois tamanhos conforme o nível sobe (mesmo princípio do Qual Tem Mais? do M1 e Organize por Tamanho do M3), forçando comparação cuidadosa de verdade nos níveis altos", "Peso é a única grandeza da BNCC que não dá pra representar visualmente de forma honesta numa tela (não existe \"peso visual\"), então em vez de fingir uma pista visual falsa, a atividade usa pares de objetos reais com relação de peso óbvia e sem ambiguidade (elefante × ratinho, carro × bicicleta) — comparação pelo conhecimento de mundo, que é exatamente o que a BNCC pede aqui (sem unidade de medida convencional)"],
    jogos:["Comparar de Verdade (5 níveis)","Cheio ou Vazio, Pesado ou Leve (5 níveis)"],
    isContainer:true,
  },
  {
    id:"mm10_tempo", name:"M10 · Tempo e Calendário", icon:"📅",
    desc:"Rotina do dia, dias da semana, meses e a data de hoje", requires:null, unlockAt:0, built:true,
    bimestre:"4º bimestre",
    habilidades:[
      "EF01MA16 — Relatar sequência de acontecimentos relativos a um dia (oficial pede uso de horários dos eventos, quando possível; a atividade usa só ordem — antes/depois — sem horário de relógio)",
      "EF01MA17 — Reconhecer e relacionar períodos do dia, dias da semana e meses do ano, utilizando calendário, quando necessário",
      "EF01MA18 — Produzir a escrita de uma data (dia, mês, ano) e indicar o dia da semana correspondente",
    ],
    alem:["Ordem do Dia usa comparação de dois eventos por vez (\"o que acontece PRIMEIRO?\"), não ordenação de lista inteira — motor de clique único, mas sempre inequívoco porque a rotina do dia é uma ordem TOTAL fixa, então qualquer par de eventos tem uma resposta certa clara", "Escreva a Data é a aproximação honesta pra EF01MA18 dentro do motor de clique: em vez de fingir digitação livre de uma data inteira, decompõe a data em suas 3 partes (dia da semana, número do dia, mês) e pergunta uma de cada vez — a criança pratica reconhecer cada peça que compõe uma data, sem a fricção de digitar errado por acidente"],
    jogos:["Ordem do Dia (5 níveis)","Que Dia é Hoje? (5 níveis)","Escreva a Data (5 níveis)"],
    isContainer:true,
  },
  {
    id:"mm11_dinheiro", name:"M11 · Dinheiro", icon:"💰",
    desc:"Reconhecer moedas e cédulas reais e somar quantias simples", requires:null, unlockAt:0, built:true,
    bimestre:"4º bimestre",
    habilidades:[
      "EF01MA19 — Reconhecer e relacionar valores de moedas e cédulas do sistema monetário brasileiro para resolver situações simples do cotidiano",
    ],
    alem:["Trabalha em centavos internamente (não em número decimal direto) pra nunca ter erro de arredondamento de ponto flutuante ao somar moedas — sempre formata o resultado como R$ de verdade só na hora de mostrar", "Cédulas e moedas de valor \"redondo\" primeiro (R$1, R$2, R$5), moedas de centavos (R$0,05 a R$0,50) só a partir do nível 4 — os centavos são visivelmente mais difíceis de comparar/somar de cabeça pra uma criança de 6 anos do que os reais inteiros"],
    jogos:["Quanto Vale? (5 níveis)","Junte pra Comprar (5 níveis)"],
    isContainer:true,
  },
  {
    id:"mm12_probabilidade", name:"M12 · Probabilidade e Gráficos", icon:"🎲",
    desc:"O que é certo, possível ou impossível, e ler informação num gráfico", requires:null, unlockAt:0, built:true,
    bimestre:"4º bimestre",
    habilidades:[
      "EF01MA20 — Classificar eventos envolvendo o acaso, tais como 'acontecerá com certeza', 'talvez aconteça' e 'é impossível acontecer', em situações do cotidiano",
      "EF01MA21 — Ler dados expressos em tabelas e em gráficos de colunas",
    ],
    alem:["Vai Acontecer? tem 15 situações do dia a dia, 3 por nível, sempre balanceadas entre as 3 categorias (certo/possível/impossível) — nunca vira \"decoreba\" porque o banco cresce por nível", "Leia o Gráfico desenha o gráfico como colunas de QUADRADINHOS EMPILHADOS (não barra proporcional com altura livre), pra a criança poder CONTAR de verdade em vez de estimar por altura de pixel — mais fiel ao jeito como gráfico de colunas costuma ser ensinado no 1º ano"],
    jogos:["Vai Acontecer? (5 níveis)","Leia o Gráfico (5 níveis)"],
    isContainer:true,
  },
];

/* Trilha de Português + Trilha de Matemática juntas — usado pelos pontos do
   motor genérico (endSession, renderAdmin, renderMenu) que precisam achar
   "qual módulo desbloqueia com isso" ou "qual módulo é dono desse container"
   independente de qual trilha o módulo pertence. */
const ALL_MODULES_BENJAMIN = PT_MODULES_BENJAMIN.concat(MATH_MODULES_BENJAMIN);

/* As 6 atividades do Módulo 1, jogadas separadamente, cada uma com 5 níveis
   próprios de dificuldade (progressão independente por atividade). As 3 novas
   (pares_minimos, rimas, manipulacao) nasceram da pesquisa nas sequências da
   Nova Escola — ver referencia-nova-escola.md — pra cobrir consciência
   fonológica de verdade, não só letra inicial. */
