// Audio Manager mínimo (piloto VACA, 2026-08-17).
//
// Responsabilidade única: tocar a "voz" do app (Lia + fonética) num canal
// só -- nova fala sempre interrompe a anterior, nunca duas ao mesmo tempo
// (seção 18 da arquitetura aprovada) -- e tocar SFX num canal independente,
// sem cancelar a voz. Nada além disso nesta versão: sem fila avançada, sem
// preload sofisticado, sem mute persistente (REGRAS_PERMANENTES.md: não
// construir arquitetura maior que a necessidade atual).
//
// FALLBACK É PARTE DO DESENHO, NÃO EXCEÇÃO: como nenhum arquivo de áudio
// real existe ainda no projeto (só os caminhos calculados por
// media-catalog.js), toda chamada de voz já nasce falando por TTS
// (speak(), de utils.js) e só "sobe de qualidade" pro MP3 se ele existir e
// tocar com sucesso. Isso garante que qa_test_speak_coverage.js continua
// passando (toda atividade narra automaticamente) mesmo sem nenhum MP3 no
// projeto, e que o exercício nunca fica mudo por causa de mídia ausente.

const AudioManager = (function(){
  const VOLUMES = { voice: 1.0, sfx: 0.6 };

  let activeToken = 0; // identifica a fila de voz "atual"; usado pra
                        // cancelar silenciosamente uma fila anterior quando
                        // outra começa (nova fala interrompe a anterior)

  function stopVoice(){
    activeToken++;
    speakStop();
  }

  /* Toca 1 item de voz: { url, fallbackText, volume }.
     Sempre começa a falar por TTS na hora (fallback otimista) -- se o MP3
     existir e conseguir tocar, corta o TTS quase na hora e deixa o MP3
     seguir. Se o MP3 não existir/falhar/autoplay for bloqueado, o TTS que
     já começou simplesmente continua -- não há "silêncio no meio". */
  function playVoiceItem(item, token){
    return new Promise((resolve)=>{
      let done = false;
      let audioTookOver = false;
      const finish = ()=>{ if(!done){ done = true; resolve(); } };

      if(item.fallbackText) speak(item.fallbackText);

      if(!item.url){
        const ms = item.fallbackText ? Math.min(4000, 600 + item.fallbackText.length * 55) : 200;
        setTimeout(()=>{ if(token === activeToken) finish(); else finish(); }, ms);
        return;
      }

      let audio;
      try{ audio = new Audio(item.url); }
      catch(e){
        const ms = item.fallbackText ? Math.min(4000, 600 + item.fallbackText.length * 55) : 200;
        setTimeout(finish, ms);
        return;
      }
      audio.volume = item.volume != null ? item.volume : VOLUMES.voice;

      const onPlaying = ()=>{
        if(!audioTookOver && token === activeToken){
          audioTookOver = true;
          speakStop(); // o MP3 assumiu -- corta o TTS otimista
        }
      };
      const giveUpToTts = ()=>{
        if(audioTookOver) return;
        const ms = item.fallbackText ? Math.min(4000, 600 + item.fallbackText.length * 55) : 200;
        setTimeout(finish, ms);
      };

      audio.addEventListener("playing", onPlaying);
      audio.addEventListener("ended", finish);
      audio.addEventListener("error", giveUpToTts);

      try{
        const p = audio.play();
        if(p && typeof p.catch === "function") p.catch(giveUpToTts);
      }catch(e){
        giveUpToTts();
      }
    });
  }

  /* Toca uma sequência de itens de voz, um de cada vez, na ordem. Chamar de
     novo enquanto uma fila está tocando cancela a fila anterior (o token
     muda) -- é assim que "nova fala interrompe a anterior" é garantido sem
     precisar rastrear/pausar elementos <audio> manualmente. */
  function queueVoice(items, onDone){
    activeToken++;
    const myToken = activeToken;
    speakStop();
    (async ()=>{
      for(let i = 0; i < items.length; i++){
        if(myToken !== activeToken) return; // fila cancelada por outra chamada
        await playVoiceItem(items[i], myToken);
      }
      if(myToken === activeToken && onDone) onDone();
    })();
  }

  /* SFX: canal independente, não cancela nem é cancelado pela voz.
     opts.fallbackBeep: "ok" | "no" -- usa beep() (utils.js) se o MP3 não
     existir/tocar. */
  function playSfx(url, opts){
    opts = opts || {};
    try{
      const audio = new Audio(url);
      audio.volume = opts.volume != null ? opts.volume : VOLUMES.sfx;
      const p = audio.play();
      if(p && typeof p.catch === "function"){
        p.catch(()=>{ if(opts.fallbackBeep) beep(opts.fallbackBeep); });
      }
    }catch(e){
      if(opts.fallbackBeep) beep(opts.fallbackBeep);
    }
  }

  function stopAll(){ stopVoice(); }

  return { queueVoice, stopVoice, stopAll, playSfx, VOLUMES };
})();

/* Vídeo de personagem com fallback duplo (fora do objeto AudioManager
   porque é vídeo, não canal de áudio -- ver docs/audio/MEDIA_GUIDELINES.md
   sobre por que não vale a pena um media-manager.js à parte só pra isto
   ainda, seção 16 da arquitetura aprovada):
   1. Autoplay com som bloqueado pelo navegador -> mostra um botão "toque
      pra começar" (mesmo arquivo, só precisa do gesto do usuário); depois
      de alguns segundos sem toque, segue pra instrução mesmo assim, pra
      nunca travar a criança esperando um toque que não veio.
   2. Arquivo ausente ou outro erro de carregamento -> cai direto pro
      visual estático (emoji/SVG) que a atividade já usava antes deste
      piloto. O exercício nunca fica sem nada pra mostrar. */
function mountCharacterIntro(container, characterId, opts){
  opts = opts || {};
  if(!container){ if(opts.onFallback) opts.onFallback(); return; }
  const url = mediaCharacterVideo(characterId, "intro");
  const wrap = document.createElement("div");
  wrap.className = "character-intro";
  const video = document.createElement("video");
  video.src = url;
  video.playsInline = true;
  video.className = "character-video";
  video.setAttribute("aria-hidden", "true");
  wrap.appendChild(video);
  container.innerHTML = "";
  container.appendChild(wrap);

  let settled = false;
  const toFallback = ()=>{
    if(settled) return;
    settled = true;
    wrap.innerHTML = `<div style="font-size:60px;">${opts.visualFallback || ""}</div>`;
    if(opts.onFallback) opts.onFallback();
  };

  video.addEventListener("error", toFallback);
  video.addEventListener("ended", ()=>{ if(!settled){ settled = true; } if(opts.onEnded) opts.onEnded(); });

  function showTapOverlay(){
    if(wrap.querySelector(".video-tap-overlay")) return;
    const btn = document.createElement("button");
    btn.className = "video-tap-overlay";
    btn.textContent = "▶️ Toque para começar";
    btn.onclick = ()=>{
      btn.remove();
      try{
        const p2 = video.play();
        if(p2 && typeof p2.catch === "function") p2.catch(toFallback);
      }catch(e){ toFallback(); }
    };
    wrap.appendChild(btn);
    // Nunca deixa a criança travada esperando um toque que não vem --
    // depois de um tempo curto, segue pra instrução mesmo sem o vídeo ter
    // rodado (o vídeo continua disponível/pausado ali, só não bloqueia).
    setTimeout(()=>{ if(!settled && opts.onEnded){ settled = true; opts.onEnded(); } }, 4000);
  }

  let p;
  try{ p = video.play(); }
  catch(e){ showTapOverlay(); return; }
  if(p && typeof p.catch === "function"){
    p.catch((err)=>{
      // NotAllowedError = autoplay bloqueado (o arquivo está OK, só falta o
      // gesto do usuário) -> dá a chance do toque. Qualquer outro erro
      // (arquivo ausente, formato não suportado etc.) -> fallback direto,
      // sem esperar um toque que não vai resolver nada.
      if(err && err.name === "NotAllowedError"){ showTapOverlay(); }
      else{ toFallback(); }
    });
  }
}
