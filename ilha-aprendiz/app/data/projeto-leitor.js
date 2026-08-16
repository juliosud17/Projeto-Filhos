// Conteudo do Modulo 8 (Projeto Leitor) para exibicao dentro do app -- Ilha
// das Letras, hotspot "Castelo dos Livros". Modulo 8 nao e um jogo digital
// (fora da tela por design, ver pedagogia/MODULO8_PROJETO_LEITOR.md) -- este
// arquivo so estrutura o MESMO conteudo ja documentado la (lista de livros,
// roteiro de perguntas) pra virar uma tela simples dentro do app, sem
// inventar mecanica nova nem duplicar a curadoria em dois lugares
// desencontrados. Qualquer atualizacao de conteudo deve manter os dois
// (aqui e o .md) em sincronia.

const PROJETO_LEITOR_LIVROS = [
  {
    titulo:"O Saci", autor:"Monteiro Lobato", genero:"Aventura / folclore brasileiro",
    comprar:[
      {label:"Estante Virtual", url:"https://www.estantevirtual.com.br/busca/monteiro-lobato"},
      {label:"Box Obra Completa (Amazon)", url:"https://www.amazon.com.br/Obra-Completa-Monteiro-Lobato-BOX/dp/6589645388"}
    ],
    ebook:[{label:"monteirolobato.com/downloads", url:"https://www.monteirolobato.com/downloads/"}]
  },
  {
    titulo:"Caçadas de Pedrinho", autor:"Monteiro Lobato", genero:"Aventura",
    comprar:[{label:"Estante Virtual", url:"https://www.estantevirtual.com.br/busca/monteiro-lobato"}],
    ebook:[
      {label:"monteirolobato.com/downloads", url:"https://www.monteirolobato.com/downloads/"},
      {label:"Wikisource", url:"https://pt.wikisource.org/wiki/Ficheiro:As_Ca%C3%A7adas_de_Pedrinho_(1%C2%AA_edi%C3%A7%C3%A3o).pdf"}
    ]
  },
  {
    titulo:"Reinações de Narizinho", autor:"Monteiro Lobato", genero:"Aventura / fantasia (mais longo — ler em capítulos)",
    comprar:[{label:"Estante Virtual", url:"https://www.estantevirtual.com.br/busca/monteiro-lobato"}],
    ebook:[{label:"monteirolobato.com/downloads", url:"https://www.monteirolobato.com/downloads/"}]
  },
  {
    titulo:"Fábulas", autor:"Monteiro Lobato", genero:"Fábula",
    comprar:[{label:"Estante Virtual", url:"https://www.estantevirtual.com.br/busca/monteiro-lobato"}],
    ebook:[{label:"monteirolobato.com/downloads", url:"https://www.monteirolobato.com/downloads/"}]
  },
  {
    titulo:"Memórias da Emília", autor:"Monteiro Lobato", genero:"Humor",
    comprar:[{label:"Estante Virtual", url:"https://www.estantevirtual.com.br/busca/monteiro-lobato"}],
    ebook:[{label:"monteirolobato.com/downloads", url:"https://www.monteirolobato.com/downloads/"}]
  },
  {
    titulo:"Aritmética da Emília", autor:"Monteiro Lobato", genero:"Não-ficção lúdica (números)",
    comprar:[{label:"Estante Virtual", url:"https://www.estantevirtual.com.br/busca/monteiro-lobato"}],
    ebook:[{label:"monteirolobato.com/downloads", url:"https://www.monteirolobato.com/downloads/"}]
  },
  {
    titulo:"Fábulas de Esopo (tradução)", autor:"Esopo (trad. Carlos Pinheiro)", genero:"Fábula clássica, textos curtos",
    comprar:[], comprarNota:"Buscar \"Fábulas de Esopo\" em livraria/sebo — várias edições ilustradas à venda",
    ebook:[{label:"biblioteca digital de escola portuguesa (PDF)", url:"https://bibliotecadigital.agrcanelas.edu.pt/download/96/Fabulas%20de%20Esopo%20-%20Esopo,%20Carlos%20Pinheiro.pdf"}]
  },
  {
    titulo:"Contos de Grimm (seleção)", autor:"Irmãos Grimm", genero:"Contos de fadas — escolher 1-2 contos curtos por sessão",
    comprar:[], comprarNota:"Buscar \"Contos de Grimm\" em livraria/sebo — várias edições ilustradas à venda",
    ebook:[{label:"Wikisource", url:"https://pt.wikisource.org/wiki/Contos_de_Grimm"}]
  },
  {
    titulo:"Contos de Fadas — Grimm e Perrault", autor:"Grimm / Perrault", genero:"Contos de fadas — escolher 1-2 contos curtos por sessão",
    comprar:[], comprarNota:"Buscar \"Contos de Fadas Grimm Perrault\" em livraria/sebo",
    ebook:[{label:"Internet Archive", url:"https://archive.org/details/ContosDeFadasGrimmPerrault"}]
  },
  {
    titulo:"Cartilha de Adivinhas, Poemas, Parlendas e Cantigas", autor:"Coletânea de folclore", genero:"Poesia / parlenda — reforça os Módulos 3 e 4 do app",
    comprar:[], comprarNota:"Buscar \"Cantigas de roda\" ou \"Parlendas\" em livraria/sebo",
    ebook:[{label:"soescola.com (PDF)", url:"https://soescola.com/2017/02/cartilha-em-pdf-adivinhas-poemas-parlendas-cantigas-de-roda.html"}]
  },
];

const PROJETO_LEITOR_ROTEIRO = [
  "Quem era o personagem principal da história? O que ele fez?",
  "Onde a história aconteceu? Quando (de dia, de noite, no passado)?",
  "Você consegue me contar a história de novo, com suas palavras, do começo ao fim?",
  "Teve alguma palavra nova nesse livro? O que você acha que ela quer dizer?",
  "Qual foi a sua parte favorita? Por quê?",
  "Se você pudesse mudar o final, o que você inventaria?",
];
