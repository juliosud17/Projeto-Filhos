const fs = require('fs');
const { JSDOM, VirtualConsole } = require('jsdom');
let html = require('./_util/load_app_html').loadAppHtml();

const testScript = `
<script>
window.speechSynthesis = { cancel(){}, speak(){} };
window.SpeechSynthesisUtterance = function(t){ this.text=t; };
window.AudioContext = function(){ return { createOscillator(){return {connect(){},frequency:{setValueAtTime(){},exponentialRampToValueAtTime(){}},start(){},stop(){}} }, createGain(){return {connect(){},gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}}} }, destination:{}, currentTime:0 }; };
/* silabas pode sortear uma palavra do Lote A (tem 'character') e cair no
   fluxo de personagem (vídeo real + AudioManager) em vez do speak() direto
   de sempre -- sem estes stubs, o .play() de um <video> REAL trava o
   processo (jsdom não implementa reprodução de mídia de verdade), igual ao
   padrão já usado em qa_test_piloto_vaca.js. */
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
function wait(ms){ return new Promise(r=>setTimeout(r, ms)); }

let lastSpoken = [];
const origSpeak = speak;
speak = function(t){ lastSpoken.push(t); return origSpeak(t); };

const games = ["letras","letras_b","numeros","contar","silabas","leitura","soma","subtracao","cominicial","pares_minimos","rimas","manipulacao","maiusc_minusc"];

(async function(){
for(const g of games){
  lastSpoken = [];
  state.game=g; state.subgames=[g]; state.round=1; state.totalRounds=1;
  state.pools={}; state.usedSomLetters = new Set(); state.roundPlan=[g]; state.currentRender=g;
  try{
    renderRound();
  }catch(e){
    console.log("RENDER ERROR " + g + ": " + e.message);
  }
  const prompt = document.querySelector('.prompt');
  const promptText = prompt ? prompt.textContent.trim() : "";
  // silabas pode ter caído no fluxo de personagem (palavra do Lote A, ver
  // acima) -- aí o narrador entra de forma assíncrona (vídeo/áudio real
  // tentado primeiro, TTS só depois de uma folga curta), então dá um tempo
  // antes de checar em vez de assumir sempre síncrono como as outras
  // atividades (ver docs/DECISOES.md, "duas vozes sobrepostas").
  if(g === "silabas") await wait(600);
  check(g + ": renderRound produced a .prompt element", !!prompt);
  check(g + ": speak() was called automatically at least once (len=" + lastSpoken.length + ")", lastSpoken.length > 0);
  if(lastSpoken.length > 0){
    console.log("  " + g + " prompt: \\"" + promptText + "\\" | spoken: \\"" + lastSpoken[0] + "\\"");
  }
}
console.log("\\nRESULT: " + ok + " passed, " + fail + " failed");
})();
<\/script>
`;
html = html.replace('</body>', testScript + '</body>');
const virtualConsole = new VirtualConsole();
virtualConsole.on('log', (...a)=>console.log(...a));
virtualConsole.on('jsdomError', (e)=>console.error('[jsdomError]', e.message));
new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/', virtualConsole });
