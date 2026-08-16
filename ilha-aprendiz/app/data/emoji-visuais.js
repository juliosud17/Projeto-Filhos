// Vocabulario visual (emoji) compartilhado entre atividades generativas, principalmente Matematica/Joaquim.
const COUNT_EMOJI = ["🍎","⭐","🐟","🎈","🍓","🐝","🚗","🌸"];
/* Nome falado de cada emoji de contagem — necessário pra ler o enunciado
   completo em voz alta ("Quantos morangos você vê?"), não só o texto genérico. */
const EMOJI_NAMES = {"🍎":"maçãs", "⭐":"estrelas", "🐟":"peixes", "🎈":"balões", "🍓":"morangos", "🐝":"abelhas", "🚗":"carros", "🌸":"flores"};
/* Gênero de cada nome, pra concordância certa em "Quantos/Quantas ___ você vê?"
   (maçãs/estrelas/abelhas/flores são femininos — sem isso soaria errado, tipo
   "quantos flores" em vez de "quantas flores"). */
const EMOJI_GENDER_FEM = {"🍎":true, "⭐":true, "🐟":false, "🎈":false, "🍓":false, "🐝":true, "🚗":false, "🌸":true};

