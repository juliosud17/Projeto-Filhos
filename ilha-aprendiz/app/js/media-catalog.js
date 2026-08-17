// Catálogo central de mídia (piloto VACA, 2026-08-17).
//
// Converte referências CONCEITUAIS (tipo + conteúdo, personagem + estado,
// categoria + nome) em caminhos de arquivo dentro de app/assets/. Nenhum
// render*() deve montar um caminho "assets/..." na mão -- sempre passar por
// aqui, pra manter data -> render*() -> catálogo -> arquivo, sem paths
// espalhados pelo HTML/JS (ver docs/audio/MEDIA_GUIDELINES.md).
//
// Ainda não existe nenhum arquivo real dentro de app/assets/audio ou
// app/assets/video -- essas funções só calculam o caminho ESPERADO; quem
// toca a mídia (js/audio-manager.js) trata a ausência do arquivo como
// condição normal (fallback), não como erro de programação.

const MEDIA_BASE = "assets/";

/* Normaliza texto pra nome de arquivo: minúsculo, sem acento, sem espaço.
   Mesma ideia de normalizeTyped() (activities-portugues.js), mas própria
   pra não criar dependência de ordem de carregamento entre os dois arquivos
   -- media-catalog.js é intencionalmente autocontido. */
function mediaFileName(texto){
  return String(texto)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "-");
}

/* Fonética pedagógica. `tipo` é SEMPRE explícito, nunca inferido por
   tamanho do texto (heurística tipo `texto.length <= 2` quebraria com
   sílabas de 3 letras como CHA/NHA/QUE) -- decisão registrada em
   docs/DECISOES.md. tipo: "letra" | "silaba" | "palavra" | "numero". */
const FONETICA_PASTAS = { letra: "letras", silaba: "silabas", palavra: "palavras", numero: "numeros" };
function mediaFonetica(tipo, texto){
  const pasta = FONETICA_PASTAS[tipo];
  if(!pasta){
    console.warn("mediaFonetica: tipo desconhecido \"" + tipo + "\" (use letra/silaba/palavra/numero)");
    return null;
  }
  return MEDIA_BASE + "audio/fonetica/" + pasta + "/" + mediaFileName(texto) + ".mp3";
}

/* Voz da Lia -- fala pedagógica de instrução/dica ou emocional de
   acerto/encorajamento. NUNCA a pronúncia oficial de uma palavra/sílaba/
   número -- essa é sempre mediaFonetica(), pra não duplicar a mesma
   informação fonética em dois arquivos diferentes (ver docs/DECISOES.md,
   "separação Lia x fonética"). categoria: "comuns" | "portugues" | "matematica". */
function mediaLiaVoice(categoria, nome){
  return MEDIA_BASE + "audio/lia/" + categoria + "/" + mediaFileName(nome) + ".mp3";
}

/* Vídeo de personagem. estado hoje só "intro" no piloto -- ver
   docs/characters/CHARACTER_BIBLE.md e a seção F da arquitetura aprovada
   (sem vídeo de erro, sem estados extras até validar que fazem diferença). */
function mediaCharacterVideo(characterId, estado){
  return MEDIA_BASE + "video/personagens/" + characterId + "/" + characterId + "-" + estado + ".mp4";
}

/* Som avulso de personagem, fora do vídeo -- não usado no piloto (o "muuu"
   da vaca vem embutido em vaca-intro.mp4), existe pra quando surgir o
   primeiro caso real de reuso do som sem o vídeo. */
function mediaCharacterSound(characterId, nome){
  return MEDIA_BASE + "audio/personagens/" + characterId + "/" + mediaFileName(nome) + ".mp3";
}

/* SFX. grupo: "feedback" | "progresso" | "interface". */
function mediaSfx(grupo, nome){
  return MEDIA_BASE + "audio/sfx/" + grupo + "/" + mediaFileName(nome) + ".mp3";
}
