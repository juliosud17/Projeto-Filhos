// Dados da Ilha das Letras -- mapa interativo que substitui a grade de
// Módulos só para a trilha de Português (Matemática continua na grade,
// "Ilha dos Números" fica pra depois). Cada região corresponde a 1 módulo
// de PT_MODULES_BENJAMIN (app/data/registro-modulos.js) via `moduleId`.
//
// Coordenadas em % (left/top), relativas ao tamanho da imagem de fundo --
// ESTIMATIVA VISUAL DE PRIMEIRA PASSADA sobre a prévia vista no chat em
// 2026-08-16, não medição em pixel do arquivo final. Ajustar com o modo de
// calibração (ver js/mapa-portugues.js, calibrarCoordenadas()) quando o
// asset real for colocado em assets/maps/.
const PT_MAPA_REGIOES = [
  {moduleId:"silabas",      nome:"Floresta do Alfabeto", icone:"🌳", left:18, top:68},
  {moduleId:"leitura",      nome:"Vila das Palavras",     icone:"🏘️", left:17, top:40},
  {moduleId:"frases",       nome:"Bosque das Frases",     icone:"🌿", left:30, top:17},
  {moduleId:"escrita",      nome:"Oficina da Escrita",    icone:"✏️", left:50, top:47},
  {moduleId:"compreensao",  nome:"Porto das Histórias",   icone:"⚓", left:85, top:20},
  {moduleId:"narrativas",   nome:"Vale das Histórias",    icone:"🔥", left:76, top:52},
  {moduleId:"gramatica",    nome:"Montanha dos Sinais",   icone:"⛰️", left:72, top:74},
  {moduleId:"projetoleitor",nome:"Castelo dos Livros",    icone:"🏰", left:55, top:14},
];
