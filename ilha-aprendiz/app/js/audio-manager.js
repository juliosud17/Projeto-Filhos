// Audio Manager mínimo (piloto VACA, 2026-08-17).
//
// Responsabilidade única: tocar a "voz" do app (Lia + fonética) num canal
// só -- nova fala sempre interrompe a anterior, nunca duas ao mesmo tempo
// (seção 18 da arquitetura aprovada) -- e tocar SFX num canal independente,
// sem cancelar a voz. Nada além disso nesta versão: sem fila avançada, sem
// preload sofisticado, sem mute persistente (REGRAS_PERMANENTES.md: não
// construir arquitetura maior que a necessidade atual).
//
// FALLBACK É PARTE DO DESENHO, NÃO EXCEÇÃO: toda chamada de voz tenta o MP3
// real primeiro (mediaLiaVoice/mediaFonetica); se ele não existir, falhar
// ou demorar mais que ~300ms pra confirmar que começou a tocar, cai pro
// TTS (speak(), de utils.js) -- nunca fica mudo por causa de mídia
// ausente. NÃO fala por TTS e MP3 ao mesmo tempo por padrão (ajuste de
// 2026-08-17: a versão anterior sempre começava os dois juntos e só
// cortava o TTS depois -- com os MP3s do Lote A prontos isso virou duas
// vozes sobrepostas audíveis; agora o TTS só entra se o áudio real não
// confirmar rápido o suficiente). Isso garante que qa_test_speak_coverage.js
// continua passando (toda atividade narra automaticamente) mesmo sem
// nenhum MP3 no projeto.

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
     Espera até GRACE_MS o MP3 real confirmar que começou a tocar antes de
     cair pro TTS -- evita as DUAS vozes audíveis ao mesmo tempo (bug visto
     ao vivo em 2026-08-17: com os MP3s reais do Lote A prontos, o TTS
     "otimista" de antes começava sempre junto, sobrepondo a voz real da
     Lia com a leitura robótica). Só se o áudio real não confirmar
     `playing` dentro da folga (arquivo ausente, falhou, autoplay bloqueado,
     ou demorou demais) é que o TTS entra -- continua garantindo que nunca
     fica mudo, só sem sobrepor quando o áudio real funciona (o caso comum
     agora que a mídia existe). */
  function playVoiceItem(item, token){
    return new Promise((resolve)=>{
      const GRACE_MS = 300;
      let done = false;
      let audioTookOver = false;
      let ttsStarted = false;
      const finish = ()=>{ if(!done){ done = true; resolve(); } };

      const startTts = ()=>{
        if(ttsStarted || audioTookOver) return;
        ttsStarted = true;
        if(item.fallbackText) speak(item.fallbackText);
      };

      if(!item.url){
        startTts();
        const ms = item.fallbackText ? Math.min(4000, 600 + item.fallbackText.length * 55) : 200;
        setTimeout(finish, ms);
        return;
      }

      let audio;
      try{ audio = new Audio(item.url); }
      catch(e){
        startTts();
        const ms = item.fallbackText ? Math.min(4000, 600 + item.fallbackText.length * 55) : 200;
        setTimeout(finish, ms);
        return;
      }
      audio.volume = item.volume != null ? item.volume : VOLUMES.voice;

      const graceTimer = setTimeout(startTts, GRACE_MS);

      const onPlaying = ()=>{
        if(!audioTookOver && token === activeToken){
          audioTookOver = true;
          clearTimeout(graceTimer);
          if(ttsStarted) speakStop(); // só sobrepôs em casos raros (áudio demorou) -- corta o TTS assim que o MP3 assume
        }
      };
      const giveUpToTts = ()=>{
        if(audioTookOver) return;
        clearTimeout(graceTimer);
        startTts();
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
     precisar rastrear/pausar elementos <audio> manualmente.
     Retorna a Promise da sequência inteira (além de continuar chamando
     onDone, se passado) -- rodada 2 do piloto VACA (2026-08-17): quem
     chama pode `await AudioManager.queueVoice([...])` em vez de só receber
     um callback, pra orquestrar o resto da cena depois que a fala termina
     de verdade, sem precisar adivinhar quanto tempo isso leva. */
  function queueVoice(items, onDone){
    activeToken++;
    const myToken = activeToken;
    speakStop();
    return (async ()=>{
      for(let i = 0; i < items.length; i++){
        if(myToken !== activeToken) return; // fila cancelada por outra chamada
        await playVoiceItem(items[i], myToken);
      }
      if(myToken === activeToken && onDone) onDone();
    })();
  }

  /* Toca 1 item de voz só e devolve a Promise -- mesma lógica de
     interrupção/token do queueVoice (útil pra compor sequências fora de um
     array fixo, ex. pronounceAndHighlight abaixo, sem duplicar a lógica de
     fallback pra TTS que playVoiceItem já resolve). */
  function playVoice(item){
    activeToken++;
    const myToken = activeToken;
    speakStop();
    return playVoiceItem(item, myToken);
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

  return { queueVoice, playVoice, stopVoice, stopAll, playSfx, VOLUMES };
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

/* Wrapper fino em Promise em cima de mountCharacterIntro -- não muda
   NENHUMA linha da lógica de fallback acima (autoplay bloqueado/arquivo
   ausente), só deixa quem chama fazer `await playCharacterIntro(...)` em
   vez de passar onEnded/onFallback na mão. Resolve nos dois casos (vídeo
   terminou OU caiu pro fallback) -- pra quem orquestra a cena, "acabou a
   introdução" é a mesma coisa nos dois casos. */
function playCharacterIntro(container, characterId, visualFallback){
  return new Promise(resolve=>{
    mountCharacterIntro(container, characterId, {
      visualFallback,
      onEnded: resolve,
      onFallback: resolve
    });
  });
}

/* Helper genérico pra sincronizar destaque visual com a pronúncia que está
   tocando -- pensado pra ser reaproveitado por qualquer atividade
   audiovisual futura, não só o piloto VACA (rodada 2, 2026-08-17, ver
   docs/DECISOES.md). Adiciona .is-speaking, espera a fala terminar de
   verdade (via AudioManager.playVoice -- mesmo fallback pra TTS de
   sempre), remove a classe e dá um respiro curto antes de resolver, pra
   sequências de várias chamadas (VA -> CA -> VACA) não ficarem coladas. */
function pronounceAndHighlight(element, item){
  if(element) element.classList.add("is-speaking");
  return AudioManager.playVoice(item).then(()=>{
    if(element) element.classList.remove("is-speaking");
    return new Promise(resolve=> setTimeout(resolve, 180));
  });
}
