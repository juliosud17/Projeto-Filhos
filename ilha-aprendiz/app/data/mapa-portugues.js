// Dados da Ilha das Letras -- mapa interativo que substitui a grade de
// Módulos só para a trilha de Português (Matemática continua na grade,
// "Ilha dos Números" fica pra depois). Cada região corresponde a 1 módulo
// de PT_MODULES_BENJAMIN (app/data/registro-modulos.js) via `moduleId`.
//
// Coordenadas em % (left/top), relativas ao tamanho da imagem de fundo.
// Asset real: assets/maps/ilha-das-letras.webp (1536×1024, colocado no
// projeto em 2026-08-16). Coordenadas abaixo já são calibradas visualmente
// contra ESSE arquivo (não mais a prévia do chat) — ainda estimativa a
// olho, não medição exata de pixel; ajustar fino com o modo de calibração
// (abrir com ?calibrar=1 na URL, clicar no mapa imprime %,% no console —
// ver js/mapa-portugues.js).
const PT_MAPA_REGIOES = [
  {moduleId:"silabas",      nome:"Floresta do Alfabeto", icone:"🌳", left:18, top:64},
  {moduleId:"leitura",      nome:"Vila das Palavras",     icone:"🏘️", left:18, top:37},
  {moduleId:"frases",       nome:"Bosque das Frases",     icone:"🌿", left:32, top:20},
  {moduleId:"escrita",      nome:"Oficina da Escrita",    icone:"✏️", left:47, top:42},
  {moduleId:"compreensao",  nome:"Porto das Histórias",   icone:"⚓", left:78, top:20},
  {moduleId:"narrativas",   nome:"Vale das Histórias",    icone:"🔥", left:67, top:50},
  {moduleId:"gramatica",    nome:"Montanha dos Sinais",   icone:"⛰️", left:68, top:70},
  {moduleId:"projetoleitor",nome:"Castelo dos Livros",    icone:"🏰", left:51, top:15},
];
