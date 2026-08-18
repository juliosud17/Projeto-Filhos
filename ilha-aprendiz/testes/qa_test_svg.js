const fs = require('fs');
const { JSDOM, VirtualConsole } = require('jsdom');
let html = require('./_util/load_app_html').loadAppHtml();

const testScript = `
<script>
window.speechSynthesis = { cancel(){}, speak(){} };
window.SpeechSynthesisUtterance = function(t){ this.text=t; };
window.AudioContext = function(){ return { createOscillator(){return {connect(){},frequency:{setValueAtTime(){},exponentialRampToValueAtTime(){}},start(){},stop(){}} }, createGain(){return {connect(){},gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}}} }, destination:{}, currentTime:0 }; };
/* silabas pode sortear uma palavra do Lote A (tem 'character') e criar um
   <video> real -- stub pra não gerar warning de "Not implemented" (jsdom
   não roda mídia de verdade), mesmo padrão de qa_test_piloto_vaca.js. */
window.HTMLMediaElement.prototype.play = function(){ return Promise.reject(new Error("jsdom: arquivo de mídia não existe (stub de teste)")); };
window.HTMLMediaElement.prototype.pause = function(){};
window.HTMLMediaElement.prototype.load = function(){};
window.Audio = function(url){ this._url = url; this._listeners = {}; this.volume = 1; };
window.Audio.prototype.addEventListener = function(evt, cb){ (this._listeners[evt] = this._listeners[evt] || []).push(cb); };
window.Audio.prototype.play = function(){
  const self = this;
  return Promise.resolve().then(()=>{
    (self._listeners.error || []).forEach(cb=>cb());
    throw new Error("simulado: mp3 não existe (estado real do projeto hoje)");
  });
};

let ok=0, fail=0;
function check(l,c){ if(c) ok++; else { fail++; console.log("FAIL: " + l); } }

// force pares_minimos level 3/4 many times to try to hit the COLA/GOLA and COLEIRA/GOLEIRA svg pairs
let sawSvgInParesMinimos = false;
for(let i=0;i<200;i++){
  activityLevel.pares_minimos = 3 + (i % 2);
  state.game="pares_minimos"; state.subgames=["pares_minimos"]; state.round=1; state.totalRounds=1;
  state.pools={}; state.roundPlan=["pares_minimos"]; state.currentRender="pares_minimos";
  renderRound();
  const opts = document.querySelectorAll('.option-btn');
  if(Array.from(opts).some(b=>b.innerHTML.includes('<svg'))) sawSvgInParesMinimos = true;
}
check("Pares Mínimos rendered an SVG option at least once in 200 tries", sawSvgInParesMinimos);

let sawSvgInManip = false;
for(let i=0;i<200;i++){
  activityLevel.manipulacao = 2;
  state.game="manipulacao"; state.subgames=["manipulacao"]; state.round=1; state.totalRounds=1;
  state.pools={}; state.roundPlan=["manipulacao"]; state.currentRender="manipulacao";
  renderRound();
  const opts = document.querySelectorAll('.option-btn');
  if(Array.from(opts).some(b=>b.innerHTML.includes('<svg'))) sawSvgInManip = true;
}
check("Troca-Letra rendered an SVG option at least once in 200 tries (family _OLA)", sawSvgInManip);

// Monte a Sílaba / Digite a Palavra com TATU (level 2, único item de WORDS
// com 'svg'): ATÉ 2026-08-17 este teste confirmava que o ícone SVG do TATU
// aparecia em modo "tile" (sem vídeo/personagem). Em 2026-08-18 o TATU ganhou
// 'character'+'genero' (vídeo real de personagem produzido, escala do banco
// pra quase 100%) -- então agora ele SEMPRE entra no fluxo de vídeo
// (hasCharacter em runWordIntro, activities-portugues.js), nunca mais no modo
// "tile" com o SVG solto. Isso não é regressão: é o caminho antigo (mídia
// ainda não existia) virando inatingível de propósito, porque a mídia real
// passou a existir. O SVG do TATU continua existindo e sendo usado dentro do
// vídeo de personagem (visual(item) em runWordIntro) -- só não aparece mais
// isolado em modo tile. Ver docs/DECISOES.md, 2026-08-18.
let sawTatuVideo = false;
for(let i=0;i<20;i++){
  activityLevel.silabas = 2;
  state.game="silabas"; state.subgames=["silabas"]; state.round=1; state.totalRounds=1;
  state.pools={}; state.roundPlan=["silabas"]; state.currentRender="silabas";
  renderRound();
  if(document.querySelectorAll("video").length > 0) sawTatuVideo = true;
}
check("pool de nível 2 eventualmente sorteia alguma palavra com vídeo de personagem em 20 tentativas (confirma que o fluxo de vídeo está de fato ativo, não quebrado)", sawTatuVideo);

console.log("\\nRESULT: " + ok + " passed, " + fail + " failed");
<\/script>
`;
html = html.replace('</body>', testScript + '</body>');
const virtualConsole = new VirtualConsole();
virtualConsole.on('log', (...a)=>console.log(...a));
virtualConsole.on('jsdomError', (e)=>console.error('[jsdomError]', e.message));
new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/', virtualConsole });
