// Conteudo + definicao das atividades dos 12 modulos da trilha de Matematica (Benjamin).
const MM1_ACTIVITIES = [
  {id:"quantos_tem",     name:"Quantos Tem?",   icon:"🔢", desc:"Contar quantidade e reconhecer posição/ordem (EF01MA01)"},
  {id:"conta_comigo_b",  name:"Conta Comigo",   icon:"🧮", desc:"Contar com estratégias diferentes: um a um, em grupos, por estimativa (EF01MA02)"},
  {id:"qual_tem_mais",   name:"Qual Tem Mais?", icon:"⚖️", desc:"Comparar e estimar quantidades de dois grupos (EF01MA03)"},
];

/* As atividades do Módulo M2 (Contagem até 100, EF01MA04) — também
   generativas, mesma filosofia do M1. "Conta Até 100" mostra os objetos
   AGRUPADOS EM FILEIRAS DE 10 (apoio visual de valor posicional, ligado ao
   futuro Módulo M6 de dezena/unidade), e "Pulando de Tantos em Tantos" testa
   a contagem por saltos como estratégia — não é a mesma habilidade de
   sequência/padrão do M3 (EF01MA10, que é Álgebra); aqui o foco é usar o
   salto como ATALHO de contagem até 100. */
const MM2_ACTIVITIES = [
  {id:"conta_ate_100",  name:"Conta Até 100",         icon:"💯", desc:"Contar coleções grandes, agrupadas em fileiras de 10 (EF01MA04)"},
  {id:"pulando_de_10",  name:"Pulando de Tantos em Tantos", icon:"🐇", desc:"Contar de 2 em 2, 5 em 5 ou 10 em 10 até perto de 100 (EF01MA04)"},
];
/* Faixa de quantidade total por nível pro Conta Até 100 — sempre múltiplo/
   próximo de 10 pra ficar natural agrupar em fileiras de 10. */
const MM2_QTY_RANGE = {1:[10,20], 2:[20,40], 3:[35,60], 4:[55,80], 5:[75,100]};
/* Passo de salto disponível por nível pro Pulando de Tantos em Tantos —
   nível 1-2 só o salto mais fácil (10, depois 5), nível 3+ mistura os 3. */
const MM2_STEP_BY_LEVEL = {1:[10], 2:[5,10], 3:[2,5,10], 4:[2,5,10], 5:[2,5,10]};

/* As atividades do Módulo M3 (Comparar, Ordenar e Sequenciar). Pedido
   explícito do Júlio: Matemática precisa de instrução mais clara e mais
   apoio visual que Português, porque o raciocínio quebra inteiro se a
   criança não entender o que está sendo pedido — então as 3 atividades
   deste módulo SEMPRE mostram apoio visual concreto junto do número
   abstrato (nunca só o número sozinho), e a regra do padrão em "O Que Vem
   Depois?" é sempre dita explicitamente em voz alta. */
const MM3_ACTIVITIES = [
  {id:"qual_e_maior",         name:"Qual é Maior?",         icon:"⚖️", desc:"Comparar dois números com apoio visual de quantidade (EF01MA05)"},
  {id:"organize_por_tamanho", name:"Organize por Tamanho",  icon:"📐", desc:"Colocar objetos em ordem do menor pro maior (EF01MA09)"},
  {id:"o_que_vem_depois",     name:"O Que Vem Depois?",     icon:"🔮", desc:"Descobrir o próximo item de um padrão, com a regra explicada (EF01MA10)"},
];
/* Faixa de número por nível pro Qual é Maior? — nível 1-2 fica dentro do
   que dá pra mostrar em pontinhos individuais (até 20), nível 3+ já usa
   representação em fileiras de 10 (mesma linguagem visual do M2, pra não
   introduzir um jeito novo de "ver número grande" a cada módulo). */
const MM3_COMPARE_RANGE = {1:[1,9], 2:[5,20], 3:[10,40], 4:[20,70], 5:[35,99]};
/* Quantidade de objetos a ordenar por tamanho, por nível. */
const MM3_ORDER_COUNT = {1:3, 2:3, 3:4, 4:4, 5:5};
/* Passo (diferença constante) disponível pro O Que Vem Depois?, por nível —
   propositalmente DIFERENTE dos passos do M2 (2/5/10, que são estratégia de
   contagem rápida) porque aqui o foco é reconhecer QUALQUER padrão
   recursivo, incluindo passos "estranhos" como +3 ou +4, que testam se a
   criança entendeu a REGRA e não decorou o salto de 10. */
const MM3_PATTERN_STEP = {1:[1], 2:[1,2], 3:[2,3], 4:[3,4], 5:[3,4,6,7]};
/* Padrões visuais de forma/cor (sem número nenhum) pros níveis 1-2 — chegar
   no conceito de "padrão que se repete" antes de aplicar em números, que é
   mais abstrato. Cada padrão é uma sequência AB ou ABC de emoji. */
const MM3_SHAPE_PATTERNS = [
  {level:1, unit:["🔴","🔵"]},
  {level:1, unit:["⭐","🌙"]},
  {level:2, unit:["🔴","🔵","🟡"]},
  {level:2, unit:["⬛","⬜"]},
];

/* Faixa de quantidade (min,max) por nível 1-5 — cresce em dificuldade real
   (não só em quantidade de itens, mas em quão perto os números ficam uns dos
   outros, forçando contagem de verdade em vez de "chute pela diferença
   visual" nos níveis mais altos). */
const MM1_QTY_RANGE = {1:[1,5], 2:[3,8], 3:[5,12], 4:[8,16], 5:[12,20]};
/* Diferença MÁXIMA entre os dois grupos em Qual Tem Mais? por nível — cai
   conforme o nível sobe, forçando contar de verdade em vez de perceber a
   diferença só de olhar (EF01MA03 pede estimar E comparar, não só perceber
   o óbvio). */
const MM1_MAXGAP = {1:99, 2:6, 3:4, 4:2, 5:1};
/* Fila de animais DISTINTOS (não repetidos) pra pergunta de ORDEM/posição —
   diferente do COUNT_EMOJI (mesmo emoji repetido N vezes, bom pra contar
   quantidade), aqui cada posição precisa ser visualmente diferente da
   vizinha, senão "qual é o 3º" não tem como ser respondido de verdade. */
const ANIMAL_ROW_EMOJI = ["🐶","🐱","🐰","🐻","🐸","🦊","🐼","🐨","🦁","🐷","🐵","🐔","🐮","🐹","🦉"];
const ORDINAL_WORDS = {1:"1º",2:"2º",3:"3º",4:"4º",5:"5º",6:"6º",7:"7º",8:"8º",9:"9º",10:"10º",11:"11º",12:"12º",13:"13º",14:"14º",15:"15º"};

const MM4_ACTIVITIES = [
  {id:"fatos_da_soma",       name:"Fatos da Soma",     icon:"➕", desc:"Somar dois grupos com apoio visual, evoluindo pra só números (EF01MA06)"},
  {id:"problemas_de_somar",  name:"Problemas de Somar", icon:"🧩", desc:"Mini-histórias faladas em voz que pedem uma soma pra resolver (EF01MA08)"},
];
/* Faixa do TOTAL (soma final) por nível, não dos dois números soltos — cresce
   até somas de até 20, o teto natural de "fatos básicos da adição" na BNCC do
   1º ano. A partir do total sorteado, os dois números somados são derivados
   (a de 1 até total-1, b = total-a), garantindo que a soma nunca estoure o
   teto do nível. Nível 1-2 fica dentro do que dá pra mostrar em pontinhos
   individuais claramente; nível 4-5 usa fileiras de 10 (mesma linguagem
   visual do M2/M3) pra manter o apoio concreto mesmo com números maiores —
   nunca só a conta abstrata. */
const MM4_SUM_RANGE = {1:[2,6], 2:[4,10], 3:[6,14], 4:[10,18], 5:[12,20]};
/* Mini-histórias contextualizadas pro Problemas de Somar — banco de
   templates (sujeito + item + verbo de "ganhar/receber/juntar") combinados
   com números sorteados dentro da faixa do nível, dando variedade real sem
   precisar de um banco fixo gigante de frases prontas. */
const MM4_PROBLEM_TEMPLATES = [
  {subject:"Benjamin",   item:"bolinhas de gude", verb:"ganhou", fem:true},
  {subject:"Joaquim",    item:"carrinhos",        verb:"ganhou", fem:false},
  {subject:"a Sofia",    item:"figurinhas",       verb:"ganhou", fem:true},
  {subject:"o vovô",     item:"balas",            verb:"trouxe", fem:true},
  {subject:"Benjamin",   item:"lápis de cor",     verb:"ganhou", fem:false},
  {subject:"a turma",    item:"bonecos",          verb:"recebeu", fem:false},
  {subject:"Joaquim",    item:"adesivos",         verb:"ganhou", fem:false},
  {subject:"a mamãe",    item:"maçãs",            verb:"comprou", fem:true},
  {subject:"Benjamin",   item:"cartinhas",        verb:"ganhou", fem:true},
  {subject:"o cachorro", item:"ossinhos",         verb:"ganhou", fem:false},
  {subject:"a Alice",    item:"pulseiras",        verb:"ganhou", fem:true},
  {subject:"Joaquim",    item:"blocos de montar", verb:"ganhou", fem:false},
];

const MM5_ACTIVITIES = [
  {id:"fatos_da_subtracao", name:"Fatos da Subtração", icon:"➖", desc:"Subtrair com apoio visual, evoluindo pra só números (EF01MA08)"},
  {id:"problemas_de_tirar", name:"Problemas de Tirar",  icon:"🧮", desc:"Mini-histórias faladas que pedem uma subtração pra resolver (EF01MA08)"},
  {id:"soma_ou_subtracao",  name:"Soma ou Subtração?",  icon:"🤔", desc:"Decidir qual operação o problema pede, antes de resolver (EF01MA08)"},
];
/* Faixa do total inicial (minuendo) por nível — mesmo teto de 20 do M4, pra
   manter a dificuldade numérica comparável entre soma e subtração. */
const MM5_MINUEND_RANGE = {1:[2,6], 2:[4,10], 3:[6,14], 4:[10,18], 5:[12,20]};
/* Mini-histórias contextualizadas pro Problemas de Tirar — mesmo padrão do
   MM4_PROBLEM_TEMPLATES, mas com verbos de PERDER/TIRAR/DAR em vez de
   ganhar, pra variar o contexto sem repetir os mesmos sujeitos/itens sempre
   nos mesmos papéis (soma = ganhar, subtração = perder). */
const MM5_PROBLEM_TEMPLATES = [
  {subject:"Benjamin",   item:"bolinhas de gude", verb:"deu",      fem:true},
  {subject:"Joaquim",    item:"carrinhos",        verb:"perdeu",   fem:false},
  {subject:"a Sofia",    item:"figurinhas",       verb:"trocou",   fem:true},
  {subject:"o vovô",     item:"balas",            verb:"comeu",    fem:true},
  {subject:"Benjamin",   item:"lápis de cor",     verb:"emprestou",fem:false},
  {subject:"a turma",    item:"bonecos",          verb:"doou",     fem:false},
  {subject:"Joaquim",    item:"adesivos",         verb:"deu",      fem:false},
  {subject:"a mamãe",    item:"maçãs",            verb:"usou",     fem:true},
  {subject:"Benjamin",   item:"cartinhas",        verb:"perdeu",   fem:true},
  {subject:"o cachorro", item:"ossinhos",         verb:"comeu",    fem:false},
  {subject:"a Alice",    item:"pulseiras",        verb:"deu",      fem:true},
  {subject:"Joaquim",    item:"blocos de montar", verb:"guardou",  fem:false},
];

const MM6_ACTIVITIES = [
  {id:"monte_o_numero",   name:"Monte o Número",   icon:"🧱", desc:"Descobrir a dezena ou a unidade que falta pra completar o número (EF01MA07)"},
  {id:"dezena_e_unidade", name:"Dezena e Unidade",  icon:"🔟", desc:"Contar quantas dezenas e quantas unidades tem um número, com apoio visual (EF01MA07)"},
];
/* Faixa do número de duas ordens (10-99) por nível — sobe gradualmente até
   cobrir o intervalo completo no nível 5. */
const MM6_NUMBER_RANGE = {1:[10,30], 2:[15,45], 3:[20,60], 4:[30,80], 5:[40,99]};

const MM7_ACTIVITIES = [
  {id:"onde_esta",  name:"Onde Está?",   icon:"🔍", desc:"Localizar um bichinho numa grade e descrever onde ele está (EF01MA11)"},
  {id:"siga_o_mapa", name:"Siga o Mapa", icon:"🧭", desc:"Descobrir o caminho até o alvo a partir de um ponto de referência (EF01MA12)"},
];
/* Nomes e gênero dos bichinhos do ANIMAL_ROW_EMOJI, pra montar a pergunta
   "Onde está o/a [bicho]?" com concordância certa. */
const ANIMAL_NAMES = {
  "🐶":{name:"cachorro", fem:false}, "🐱":{name:"gato", fem:false}, "🐰":{name:"coelho", fem:false},
  "🐻":{name:"urso", fem:false}, "🐸":{name:"sapo", fem:false}, "🦊":{name:"raposa", fem:true},
  "🐼":{name:"panda", fem:false}, "🐨":{name:"coala", fem:false}, "🦁":{name:"leão", fem:false},
  "🐷":{name:"porquinho", fem:false}, "🐵":{name:"macaco", fem:false}, "🐔":{name:"galinha", fem:true},
  "🐮":{name:"vaquinha", fem:true}, "🐹":{name:"hamster", fem:false}, "🦉":{name:"coruja", fem:true},
};
/* Rótulos de posição numa grade 3×3, combinando linha (cima/meio/embaixo) e
   coluna (esquerda/meio/direita) — o meio-meio vira "bem no meio", e as
   posições no meio de uma linha/coluna omitem a parte redundante ("no
   meio") pra não soar estranho ("no meio, no meio"). */
const MM7_ROW_LABELS = ["em cima", "", "embaixo"];
const MM7_COL_LABELS = ["à esquerda", "", "à direita"];
function mm7CellLabel(row, col){
  if(row === 1 && col === 1) return "bem no meio";
  if(row === 1) return `${MM7_COL_LABELS[col]}`;
  if(col === 1) return `${MM7_ROW_LABELS[row]}`;
  return `${MM7_ROW_LABELS[row]}, ${MM7_COL_LABELS[col]}`;
}
/* Quais células (linha,coluna) entram no sorteio de pergunta por nível —
   controla a complexidade do vocabulário exigido, não a grade em si (a
   grade sempre tem os 9 bichinhos, só a pergunta muda). */
const MM7_LEVEL_CELLS = {
  1: [[1,0],[1,2]],                  // só esquerda/direita
  2: [[0,1],[2,1]],                  // só cima/embaixo
  3: [[1,0],[1,2],[0,1],[2,1],[1,1]],// mistura eixo único + bem no meio
  4: [[0,0],[0,2],[2,0],[2,2]],      // só cantos
  5: [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]], // qualquer célula
};

const MM8_ACTIVITIES = [
  {id:"formas_no_mundo", name:"Formas no Mundo", icon:"🌍", desc:"Ligar um objeto do dia a dia à forma espacial que ele lembra (EF01MA13)"},
  {id:"nomeie_a_forma",  name:"Nomeie a Forma",  icon:"🔺", desc:"Reconhecer e nomear formas planas, em diferentes posições (EF01MA14)"},
];
/* Objetos do dia a dia ligados às 6 formas espaciais da BNCC. */
const MM8_SPATIAL_ITEMS = [
  {emoji:"⚽", name:"a bola de futebol",     shape:"esfera"},
  {emoji:"🍊", name:"a laranja",             shape:"esfera"},
  {emoji:"🎲", name:"o dado",                shape:"cubo"},
  {emoji:"🧊", name:"o cubo de gelo",        shape:"cubo"},
  {emoji:"📦", name:"a caixa",               shape:"bloco retangular"},
  {emoji:"🧱", name:"o tijolo",              shape:"bloco retangular"},
  {emoji:"🥫", name:"a lata",                shape:"cilindro"},
  {emoji:"🖊️", name:"a caneta",              shape:"cilindro"},
  {emoji:"🍦", name:"a casquinha de sorvete",shape:"cone"},
  {emoji:"🏕️", name:"a barraca de acampar",  shape:"pirâmide"},
];
const MM8_SHAPE_LABELS = {"esfera":"Esfera","cubo":"Cubo","bloco retangular":"Bloco retangular","cilindro":"Cilindro","cone":"Cone","pirâmide":"Pirâmide"};
/* Quais formas espaciais entram no sorteio por nível — esfera/cubo primeiro
   (mais fáceis de reconhecer), cone/pirâmide só nos níveis altos. */
const MM8_SPATIAL_LEVEL_SHAPES = {
  1: ["esfera","cubo","cilindro"],
  2: ["esfera","cubo","cilindro","bloco retangular"],
  3: ["esfera","cubo","cilindro","bloco retangular","cone"],
  4: ["esfera","cubo","cilindro","bloco retangular","cone","pirâmide"],
  5: ["esfera","cubo","cilindro","bloco retangular","cone","pirâmide"],
};
/* Faixa de rotação (graus) da figura plana por nível — 0 fixo nos níveis
   1-2 (posição "de livro", pra firmar o reconhecimento básico antes de
   complicar), rotação crescente a partir do nível 3, cobrindo a exigência
   da BNCC de reconhecer a forma em "diferentes disposições". */
const MM8_ROTATION_RANGE = {1:[0,0], 2:[0,0], 3:[-30,30], 4:[-90,90], 5:[-179,179]};
const MM8_PLANE_COLORS = ["#8b5cf6","#f59e0b","#10b981","#ef4444","#3b82f6","#ec4899"];
const MM8_PLANE_SHAPES = ["círculo","quadrado","retângulo","triângulo"];

const MM9_ACTIVITIES = [
  {id:"comparar_medidas", name:"Comparar de Verdade",              icon:"📏", desc:"Comparar altura, comprimento e largura com o vocabulário certo (EF01MA15)"},
  {id:"cheio_ou_vazio",   name:"Cheio ou Vazio, Pesado ou Leve",    icon:"⚖️", desc:"Comparar capacidade (cheio/vazio) e peso (pesado/leve) (EF01MA15)"},
];
/* 3 tipos de comparação linear, cada um com o par de termos certo da BNCC e
   um contexto do dia a dia diferente pra não misturar o vocabulário. */
const MM9_DIMENSIONS = [
  {type:"altura",      contextName:"árvore", positive:"mais alta",     negative:"mais baixa",     orientation:"vertical"},
  {type:"comprimento", contextName:"cobra",  positive:"mais comprida", negative:"mais curta",     orientation:"horizontal-thin"},
  {type:"largura",     contextName:"tapete", positive:"mais largo",    negative:"mais estreito",  orientation:"horizontal-thick"},
];
/* Diferença MÍNIMA (em pixels) entre os dois tamanhos comparados, por nível
   — encolhe conforme o nível sobe, mesmo princípio do MM1_MAXGAP (Qual Tem
   Mais?) e do Organize por Tamanho (M3): força comparação cuidadosa de
   verdade nos níveis altos, não só "bater o olho". */
const MM9_MIN_GAP = {1:35, 2:25, 3:18, 4:12, 5:6};
/* Mesma lógica, em pontos percentuais, pro nível de líquido nos copos. */
const MM9_CONTAINER_GAP = {1:35, 2:25, 3:18, 4:12, 5:6};
/* Pares de objetos reais com relação de peso ÓBVIA e sem ambiguidade — peso
   é a única grandeza da BNCC que não dá pra representar visualmente de
   forma honesta numa tela, então a comparação usa conhecimento de mundo
   (exatamente o que a BNCC pede: sem unidade de medida convencional). */
const MM9_WEIGHT_PAIRS = [
  {a:{emoji:"🐘", name:"o elefante"},   b:{emoji:"🐭", name:"o ratinho"},    heavier:"a"},
  {a:{emoji:"🚗", name:"o carro"},      b:{emoji:"🚲", name:"a bicicleta"},  heavier:"a"},
  {a:{emoji:"🐋", name:"a baleia"},     b:{emoji:"🐬", name:"o golfinho"},   heavier:"a"},
  {a:{emoji:"📚", name:"a pilha de livros"}, b:{emoji:"🍬", name:"a bala"},  heavier:"a"},
  {a:{emoji:"🛋️", name:"o sofá"},       b:{emoji:"🪑", name:"a cadeira"},    heavier:"a"},
  {a:{emoji:"🍉", name:"a melancia"},   b:{emoji:"🍇", name:"o cacho de uva"}, heavier:"a"},
  {a:{emoji:"🏠", name:"a casa"},       b:{emoji:"🚗", name:"o carro"},      heavier:"a"},
  {a:{emoji:"🐕", name:"o cachorro"},   b:{emoji:"🐈", name:"o gato"},       heavier:"a"},
  {a:{emoji:"🍎", name:"a maçã"},       b:{emoji:"🍇", name:"a uva"},        heavier:"a"},
  {a:{emoji:"🐻", name:"o urso"},       b:{emoji:"🐰", name:"o coelho"},     heavier:"a"},
];

const MM10_ACTIVITIES = [
  {id:"ordem_do_dia",    name:"Ordem do Dia",     icon:"🌅", desc:"Descobrir o que acontece primeiro numa rotina do dia (EF01MA16)"},
  {id:"que_dia_e_hoje",  name:"Que Dia é Hoje?",  icon:"📆", desc:"Períodos do dia, dias da semana e meses do ano (EF01MA17)"},
  {id:"escreva_a_data",  name:"Escreva a Data",   icon:"🗓️", desc:"Reconhecer as partes que compõem uma data (EF01MA18)"},
];
/* Rotina do dia em ORDEM TOTAL fixa — qualquer par de eventos sorteado tem
   uma resposta certa inequívoca de qual vem primeiro, mesmo sem serem
   vizinhos na lista. */
const MM10_ROUTINE = ["Acordar", "Escovar os dentes", "Tomar café da manhã", "Ir pra escola", "Almoçar", "Brincar", "Tomar banho", "Jantar", "Dormir"];
/* Distância (em posições) entre os dois eventos sorteados, por nível —
   eventos bem distantes primeiro (fácil, óbvio), eventos vizinhos só nos
   níveis altos (precisa saber a rotina de verdade, não só "óbvio"). */
const MM10_ROUTINE_GAP = {1:[5,8], 2:[3,5], 3:[2,4], 4:[1,2], 5:[1,1]};
const MM10_DAYS = ["domingo","segunda-feira","terça-feira","quarta-feira","quinta-feira","sexta-feira","sábado"];
const MM10_MONTHS = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
const MM10_PERIODS = [{emoji:"🌅", name:"manhã"}, {emoji:"☀️", name:"tarde"}, {emoji:"🌙", name:"noite"}];
function mm10Cap(s){ return s.charAt(0).toUpperCase() + s.slice(1); }

const MM11_ACTIVITIES = [
  {id:"quanto_vale",       name:"Quanto Vale?",     icon:"🪙", desc:"Reconhecer o valor de moedas e cédulas reais (EF01MA19)"},
  {id:"junte_pra_comprar", name:"Junte pra Comprar", icon:"🛍️", desc:"Somar moedas e cédulas pra descobrir quanto dá ao todo (EF01MA19)"},
];
/* Todas as moedas e cédulas do sistema monetário brasileiro, em CENTAVOS
   (não em número decimal) pra nunca ter erro de arredondamento de ponto
   flutuante ao somar — só vira "R$ x,yy" na hora de mostrar na tela. */
const MM11_ITEMS = [
  {cents:5,     label:"R$ 0,05",  type:"moeda"},
  {cents:10,    label:"R$ 0,10",  type:"moeda"},
  {cents:25,    label:"R$ 0,25",  type:"moeda"},
  {cents:50,    label:"R$ 0,50",  type:"moeda"},
  {cents:100,   label:"R$ 1,00",  type:"moeda"},
  {cents:200,   label:"R$ 2,00",  type:"cédula"},
  {cents:500,   label:"R$ 5,00",  type:"cédula"},
  {cents:1000,  label:"R$ 10,00", type:"cédula"},
  {cents:2000,  label:"R$ 20,00", type:"cédula"},
  {cents:5000,  label:"R$ 50,00", type:"cédula"},
  {cents:10000, label:"R$ 100,00",type:"cédula"},
];
/* Quais moedas/cédulas entram no sorteio por nível — reais inteiros
   "redondos" primeiro, moedas de centavos só a partir do nível 4 (visivelmente
   mais difíceis de comparar/somar de cabeça pra uma criança de 6 anos). */
const MM11_LEVEL_CENTS = {
  1: [100, 200, 500],
  2: [100, 200, 500, 1000, 2000],
  3: [100, 200, 500, 1000, 2000, 5000, 10000],
  4: [50, 100, 200, 500, 1000, 2000, 5000, 10000],
  5: [5, 10, 25, 50, 100, 200, 500, 1000, 2000, 5000, 10000],
};
/* Quantas moedas/cédulas somar em Junte pra Comprar, por nível. */
const MM11_JUNTE_COUNT = {1:2, 2:2, 3:2, 4:3, 5:3};
function mm11FormatCents(cents){
  const reais = Math.floor(cents/100);
  const centavos = String(cents % 100).padStart(2,"0");
  return `R$ ${reais},${centavos}`;
}

const MM12_ACTIVITIES = [
  {id:"vai_acontecer",  name:"Vai Acontecer?",   icon:"🎲", desc:"Classificar se algo é certo, possível ou impossível de acontecer (EF01MA20)"},
  {id:"leia_o_grafico", name:"Leia o Gráfico",   icon:"📊", desc:"Ler informações num gráfico de colunas (EF01MA21)"},
];
const MM12_CATEGORY_LABELS = {certo:"É certo acontecer", possivel:"É possível acontecer", impossivel:"É impossível acontecer"};
/* Situações do dia a dia classificadas em certo/possível/impossível, 3 por
   nível, sempre balanceadas entre as 3 categorias — o nível controla a
   sutileza da situação, não muda a mecânica. */
const MM12_EVENTS = [
  {text:"O sol vai nascer amanhã de manhã", category:"certo", level:1},
  {text:"Um peixe vai dirigir um carro", category:"impossivel", level:1},
  {text:"Vai chover amanhã", category:"possivel", level:1},
  {text:"Depois de terça-feira vem quarta-feira", category:"certo", level:2},
  {text:"Uma pedra vai flutuar sozinha no ar, sem ninguém segurar", category:"impossivel", level:2},
  {text:"Vou encontrar um amigo na rua hoje", category:"possivel", level:2},
  {text:"Se você soltar uma pedra, ela vai cair no chão", category:"certo", level:3},
  {text:"Uma vaca vai voar sozinha pelo céu", category:"impossivel", level:3},
  {text:"Vou tirar CARA jogando uma moeda pra cima", category:"possivel", level:3},
  {text:"Todo mês do ano tem pelo menos 28 dias", category:"certo", level:4},
  {text:"Um sapo vai falar português com você", category:"impossivel", level:4},
  {text:"O time do seu pai vai ganhar o próximo jogo", category:"possivel", level:4},
  {text:"Depois de hoje, vai vir um dia de amanhã", category:"certo", level:5},
  {text:"Uma pessoa vai morar dentro de um copo d'água", category:"impossivel", level:5},
  {text:"Você vai ganhar um presente de surpresa esse mês", category:"possivel", level:5},
];
/* Temas do gráfico — sempre 3 categorias por gráfico, pra manter o número de
   opções de resposta previsível e o gráfico simples de ler. */
const MM12_CHART_THEMES = [
  {label:"frutas favoritas",   categories:[{icon:"🍎",name:"Maçã"},{icon:"🍌",name:"Banana"},{icon:"🍇",name:"Uva"}]},
  {label:"animais de estimação", categories:[{icon:"🐶",name:"Cachorro"},{icon:"🐱",name:"Gato"},{icon:"🐟",name:"Peixe"}]},
  {label:"esportes favoritos", categories:[{icon:"⚽",name:"Futebol"},{icon:"🏀",name:"Basquete"},{icon:"🎾",name:"Tênis"}]},
  {label:"brinquedos favoritos", categories:[{icon:"🚗",name:"Carrinho"},{icon:"🪀",name:"Ioiô"},{icon:"⚾",name:"Bola"}]},
];
/* Faixa de valor de cada coluna do gráfico, por nível — cresce gradualmente. */
const MM12_CHART_RANGE = {1:[2,6], 2:[2,8], 3:[3,10], 4:[3,12], 5:[4,15]};
/* Tipos de pergunta liberados por nível — "mais/menos" primeiro (leitura
   direta), "quantos" a partir do nível 2 (contar exato), "diferença" só
   nos níveis altos (subtração implícita a partir da leitura do gráfico). */
const MM12_QUESTION_TYPES = {
  1: ["mais_menos"],
  2: ["mais_menos","quantos"],
  3: ["mais_menos","quantos"],
  4: ["mais_menos","quantos","diferenca"],
  5: ["mais_menos","quantos","diferenca"],
};
function mm12DistinctValues(count, min, max){
  let vals;
  do{
    vals = Array.from({length:count}, ()=> min + Math.floor(Math.random()*(max-min+1)));
  }while(new Set(vals).size !== count);
  return vals;
}

/* Nível atual (1-5) de cada atividade com progressão própria — em memória,
   reinicia a cada sessão. Qualquer atividade cuja chave exista neste objeto
   ganha automaticamente nível 1-5, gate de 80% de domínio pra subir, e card
   "Nível X/5" no menu/admin — é o motor genérico, não precisa duplicar lógica
   pra cada módulo novo. */
